// @ts-nocheck
import { generateText } from './genkitService';
import { ProductAnalytics, Sale } from '../types';

export interface DemandForecastResult {
    productId: string;
    productName: string;
    currentDailyDemand: number;
    predictedDailyDemand: number;
    confidence: 'high' | 'medium' | 'low';
    trend: 'growing' | 'stable' | 'declining';
    growthPercent: number;
    recommendedStock: number;
    seasonalFactor: string;
    insight: string;
}

// Local math-based forecast (fallback)
export const calculateLocalForecast = (
    analytics: ProductAnalytics[],
    sales: Sale[]
): DemandForecastResult[] => {
    return analytics
        .filter(a => a.averageDailySales > 0.01)
        .map(item => {
            const { product, averageDailySales, demandTrend, supplier } = item;

            // Calculate recent vs older sales trend
            const productSales = sales
                .filter(s => s.productId === product.id)
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

            let recentAvg = averageDailySales;
            let olderAvg = averageDailySales;

            if (productSales.length >= 4) {
                const mid = Math.floor(productSales.length / 2);
                const recent = productSales.slice(0, mid);
                const older = productSales.slice(mid);

                const recentDays = Math.max(1, (new Date(recent[0].date).getTime() - new Date(recent[recent.length - 1].date).getTime()) / (1000 * 60 * 60 * 24));
                const olderDays = Math.max(1, (new Date(older[0].date).getTime() - new Date(older[older.length - 1].date).getTime()) / (1000 * 60 * 60 * 24));

                recentAvg = recent.reduce((s, sale) => s + sale.quantity, 0) / recentDays;
                olderAvg = older.reduce((s, sale) => s + sale.quantity, 0) / olderDays;
            }

            const growthRate = olderAvg > 0 ? ((recentAvg - olderAvg) / olderAvg) * 100 : 0;
            const predictedDemand = recentAvg * (1 + (growthRate / 100) * 0.5); // dampened projection

            let trend: DemandForecastResult['trend'] = 'stable';
            if (growthRate > 10) trend = 'growing';
            else if (growthRate < -10) trend = 'declining';

            let confidence: DemandForecastResult['confidence'] = 'medium';
            if (productSales.length >= 20) confidence = 'high';
            else if (productSales.length < 5) confidence = 'low';

            const leadTime = supplier?.leadTimeDays || 7;
            const safetyBuffer = 1.5;
            const recommendedStock = Math.ceil(predictedDemand * (leadTime + 7) * safetyBuffer);

            return {
                productId: product.id,
                productName: product.name,
                currentDailyDemand: parseFloat(averageDailySales.toFixed(2)),
                predictedDailyDemand: parseFloat(Math.max(0.01, predictedDemand).toFixed(2)),
                confidence,
                trend,
                growthPercent: parseFloat(growthRate.toFixed(1)),
                recommendedStock,
                seasonalFactor: 'Normal',
                insight: trend === 'growing'
                    ? `Demand is growing ${Math.abs(growthRate).toFixed(0)}%. Consider increasing stock.`
                    : trend === 'declining'
                        ? `Demand declining ${Math.abs(growthRate).toFixed(0)}%. Reduce reorder quantities.`
                        : `Demand is stable. Maintain current stock levels.`
            };
        })
        .sort((a, b) => Math.abs(b.growthPercent) - Math.abs(a.growthPercent));
};

// AI-powered forecast using Gemini
export const generateAIDemandForecast = async (
    analytics: ProductAnalytics[],
    sales: Sale[]
): Promise<string> => {
    const localForecast = calculateLocalForecast(analytics, sales);

    const topProducts = localForecast.slice(0, 8).map(f => ({
        name: f.productName,
        currentDemand: f.currentDailyDemand,
        predictedDemand: f.predictedDailyDemand,
        trend: f.trend,
        growth: f.growthPercent + '%',
        recommendedStock: f.recommendedStock
    }));

    const prompt = `As a demand planning expert, analyze these inventory demand forecasts and provide strategic recommendations.

FORECAST DATA:
${JSON.stringify(topProducts, null, 2)}

Total products: ${analytics.length}
Products with growing demand: ${localForecast.filter(f => f.trend === 'growing').length}
Products with declining demand: ${localForecast.filter(f => f.trend === 'declining').length}

Provide:
1. Executive summary (2 sentences)
2. Top 3 actionable recommendations
3. Risk assessment for growing demand products
4. Suggested adjustments for declining products

Keep the response concise and actionable. Do NOT use markdown bold formatting (**text**). Use plain text with emojis for readability.`;

    try {
        const response = await generateText({
            prompt,
            systemPrompt: "You are a demand forecasting analyst for an inventory management system. Be data-driven and actionable. Do NOT use markdown formatting. Use plain text only with emojis for visual cues."
        });
        return response.replace(/\*+/g, '').trim();
    } catch (error) {
        console.error('AI Forecast Error:', error);
        return "AI analysis temporarily unavailable. Review the mathematical forecasts below for insights.";
    }
};
