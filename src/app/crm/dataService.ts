"use server";
import { PrismaClient } from '../../../prisma/generated/crm';
import { Client, Task, Deal } from '../../store';

const prisma = new PrismaClient();

export const fetchClients = async (): Promise<Client[]> => {
    const rows = await prisma.client.findMany();
    // Maps from Prisma object to expected type
    return rows.map(c => ({
        id: c.id,
        name: c.name,
        company: c.company,
        email: c.email,
        status: c.status as any
    }));
};

export const fetchTasks = async (): Promise<Task[]> => {
    const rows = await prisma.task.findMany();
    return rows.map(t => ({
        id: t.id,
        title: t.title,
        time: t.time,
        type: t.type as any,
        completed: t.completed
    }));
};

export const fetchDeals = async (): Promise<Deal[]> => {
    const rows = await prisma.deal.findMany();
    return rows.map(d => ({
        id: d.id,
        client: d.client,
        value: d.value,
        days: d.days,
        stageId: d.stageId
    }));
};

export const toggleTaskCompleted = async (id: number, currentStatus: boolean): Promise<void> => {
    await prisma.task.update({
        where: { id },
        data: { completed: !currentStatus }
    });
};

export const createDeal = async (deal: Omit<Deal, 'id'>): Promise<Deal> => {
    const d = await prisma.deal.create({
        data: {
            client: deal.client,
            value: deal.value,
            days: deal.days,
            stageId: deal.stageId
        }
    });
    return {
        id: d.id,
        client: d.client,
        value: d.value,
        days: d.days,
        stageId: d.stageId
    };
};
