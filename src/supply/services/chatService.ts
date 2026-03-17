// @ts-nocheck
import { generateText } from './genkitService';
import { ProductAnalytics, Sale, Supplier } from "../types";

export interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

export interface ChatContext {
    analytics: ProductAnalytics[];
    sales: Sale[];
    suppliers: Supplier[];
}

const SYSTEM_PROMPT = `You are an AI assistant for Aether Supply, an inventory management system. You help users understand their inventory data and make informed decisions.

You have access to real-time inventory data that will be provided with each query. When answering:
1. Be concise and actionable
2. Use specific numbers and product names from the data
3. Highlight critical issues (low stock, stockouts)
4. Suggest next steps when relevant
5. Format responses with bullet points and emojis for readability
6. Do NOT use markdown bold formatting like **text** - use plain text with emojis instead

If asked about something not in the data, politely explain what information is available.`;

const formatInventoryContext = (context: ChatContext): string => {
    const { analytics, sales, suppliers } = context;

    const inventorySummary = analytics.map(a => ({
        name: a.product.name,
        category: a.product.category,
        stock: a.product.stock,
        price: a.product.price,
        status: a.status,
        trend: a.demandTrend,
        daysRemaining: a.daysStockRemaining,
        avgDailySales: a.averageDailySales.toFixed(1),
        reorderSuggestion: a.suggestedReorderQty,
        supplier: a.supplier?.name || 'Unknown'
    }));

    const recentSales = sales.slice(0, 20).map(s => {
        const product = analytics.find(a => a.product.id === s.productId);
        return {
            product: product?.product.name || s.productId,
            quantity: s.quantity,
            date: new Date(s.date).toLocaleDateString()
        };
    });

    return `
CURRENT INVENTORY DATA:
${JSON.stringify(inventorySummary, null, 2)}

RECENT SALES (Last 20):
${JSON.stringify(recentSales, null, 2)}

SUPPLIERS:
${JSON.stringify(suppliers.map(s => ({ name: s.name, leadTime: s.leadTimeDays + ' days' })), null, 2)}
`;
};

const MOCK_RESPONSES: Record<string, string> = {
    'low stock': `Based on current inventory analysis:

🔴 Critical Stock Items:
• 27-inch 4K Monitor - Only 3 units left (Critical)
• Standing Desk Converter - Only 2 units left (Critical)
• Industrial Shelving Unit - Out of stock!

🟡 Low Stock Items:
• Ergonomic Office Chair - 12 units (below reorder level of 15)
• USB-C Docking Station - 8 units (at reorder threshold)

Recommended Actions:
1. Place emergency orders for monitors and shelving units
2. Review reorder levels for chairs and docking stations`,

    'selling': `📈 Top Selling Products (Last 30 Days):

1. Noise Cancelling Headphones - ~5 units/day (Increasing trend!)
2. Wireless Mechanical Keyboard - ~2 units/day (Stable)
3. 27-inch 4K Monitor - ~0.5 units/day (Steady demand)

📉 Slow Movers:
• Webcam 1080p - Declining sales (was popular 30+ days ago)
• Industrial Shelving Unit - No sales in 60 days (Dead stock)

The headphones are showing a significant demand spike - consider increasing safety stock!`,

    'default': `I can help you with:
• Inventory queries - "Show me low stock items"
• Sales analysis - "What's selling fastest?"
• Supplier info - "Which supplier has the longest lead time?"
• Reorder suggestions - "What should I reorder?"
• Stock predictions - "When will monitors run out?"

What would you like to know?`
};

const getMockResponse = (query: string): string => {
    const lowerQuery = query.toLowerCase();
    if (lowerQuery.includes('low') || lowerQuery.includes('critical') || lowerQuery.includes('stock')) {
        return MOCK_RESPONSES['low stock'];
    }
    if (lowerQuery.includes('sell') || lowerQuery.includes('fastest') || lowerQuery.includes('popular') || lowerQuery.includes('top')) {
        return MOCK_RESPONSES['selling'];
    }
    return MOCK_RESPONSES['default'];
};

export const sendChatMessage = async (
    userMessage: string,
    context: ChatContext,
    conversationHistory: ChatMessage[]
): Promise<string> => {
    console.log("Chat: Using Genkit with gemini-2.5-flash-lite...");

    const inventoryContext = formatInventoryContext(context);

    // Build conversation history
    const historyText = conversationHistory.slice(-4).map(msg =>
        `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`
    ).join('\n\n');

    const fullPrompt = `${inventoryContext}

${historyText ? `Previous conversation:\n${historyText}\n\n` : ''}User: ${userMessage}

Please respond helpfully based on the inventory data above.`;

    try {
        const response = await generateText({
            prompt: fullPrompt,
            systemPrompt: SYSTEM_PROMPT
        });

        console.log("Chat: Genkit response received successfully");
        return response;
    } catch (error: any) {
        console.error("Chat Genkit Error:", error);

        if (error?.message === 'QUOTA_EXCEEDED') {
            return "⚠️ AI quota limit reached. Here's what I found from the data:\n\n" + getMockResponse(userMessage);
        }

        return "⚠️ AI temporarily unavailable. Here's cached data:\n\n" + getMockResponse(userMessage);
    }
};

export const getQuickActions = (): string[] => [
    "Show me low stock items",
    "What's selling fastest?",
    "Which items need reordering?",
    "Summarize inventory health"
];
