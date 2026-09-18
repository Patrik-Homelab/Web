import { conn } from './variables';

export interface VisitorLogEntry {
  ip: string;
  page: string;
  user_agent: string;
}

const MAX_QUEUE_SIZE = 500;
const BATCH_FLUSH_INTERVAL_MS = 5000;
const BATCH_SIZE = 50;

const queue: VisitorLogEntry[] = [];
let flushTimeout: NodeJS.Timeout | null = null;

async function flushVisitors(): Promise<void> {
  if (queue.length === 0) return;

  const toInsert = queue.splice(0, BATCH_SIZE);
  try {
    await conn.insertInto('visitors').values(toInsert).execute();
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Error logging visitor batch:', err);
  }

  if (queue.length > 0 && !flushTimeout) {
    flushTimeout = setTimeout(() => {
      flushTimeout = null;
      void flushVisitors();
    }, 1000);
  }
}

export function logVisitor(entry: VisitorLogEntry): void {
  if (queue.length >= MAX_QUEUE_SIZE) {
    return;
  }

  queue.push(entry);

  if (queue.length >= BATCH_SIZE) {
    if (flushTimeout) {
      clearTimeout(flushTimeout);
      flushTimeout = null;
    }
    void flushVisitors();
  } else if (!flushTimeout) {
    flushTimeout = setTimeout(() => {
      flushTimeout = null;
      void flushVisitors();
    }, BATCH_FLUSH_INTERVAL_MS);
  }
}
