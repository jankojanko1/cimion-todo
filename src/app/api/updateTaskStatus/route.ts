import { NextResponse } from 'next/server';
import prisma from '../../../lib/db';

export async function POST(req: Request) {
  try {
    const { id, status } = await req.json();

    if (typeof id !== 'number') {
      return NextResponse.json({ error: 'Invalid task id' }, { status: 400 });
    }

    const allowedStatuses = ['NOT_COMPLETED', 'IN_PROGRESS', 'DONE'];
    if (!allowedStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    const updatedTask = await prisma.task.update({
      where: { id },
      data: { completed: status },
    });

    return NextResponse.json({ task: updatedTask });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
