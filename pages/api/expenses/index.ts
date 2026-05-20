import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

export type ExpenseEntry = {
  id: number;
  employee: string;
  amount: string;
  currency: string;
  date: string;
  category: string;
  description: string;
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
  confidenceScore: number;
  color: 'green' | 'amber' | 'rose';
  suggestedAction: 'approve' | 'needs_human_review';
  reasoningChain: string;
  context: {
    calendar: string | null;
    email: string | null;
    history: string;
    policy: string;
  };
  isNew?: boolean;
  status?: 'pending' | 'approved' | 'denied';
};

type Store = {
  nextId: number;
  entries: ExpenseEntry[];
};

const DATA_FILE = path.join(process.cwd(), 'data', 'expenses.json');

function readStore(): Store {
  if (!fs.existsSync(DATA_FILE)) {
    return { nextId: 13, entries: [] };
  }
  const raw = fs.readFileSync(DATA_FILE, 'utf-8');
  return JSON.parse(raw);
}

function writeStore(store: Store): void {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(DATA_FILE, JSON.stringify(store, null, 2), 'utf-8');
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const store = readStore();
    return res.status(200).json(store.entries);
  }

  if (req.method === 'POST') {
    const store = readStore();
    const entry: ExpenseEntry = { ...req.body, id: store.nextId++ };
    store.entries.unshift(entry);
    writeStore(store);
    return res.status(201).json(entry);
  }

  if (req.method === 'PATCH') {
    const { id, status } = req.body as { id: number; status: 'approved' | 'denied' };
    const store = readStore();
    const idx = store.entries.findIndex((e) => e.id === id);
    if (idx === -1) return res.status(404).json({ error: 'Not found' });
    store.entries[idx] = { ...store.entries[idx], status };
    writeStore(store);
    return res.status(200).json(store.entries[idx]);
  }

  res.status(405).json({ error: 'Method not allowed' });
}