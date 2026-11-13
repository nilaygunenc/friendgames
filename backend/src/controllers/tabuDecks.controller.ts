import { randomInt, randomUUID } from 'crypto';
import { Request, Response } from 'express';
import { pool, isUsingDatabase } from '../db/pool';

interface DeckCard {
  id?: string;
  main: string;
  banned: string[];
  category: string;
  difficulty: string;
}

interface DeckInput {
  name: string;
  category: string;
  coverColor: string;
  cards: DeckCard[];
}

const mockDecks = new Map<string, any[]>();
const normalizeCards = (value: unknown): DeckCard[] | null => {
  if (!Array.isArray(value) || value.length < 1 || value.length > 100) return null;
  const cards = value.map((raw: any) => ({
    id: typeof raw?.id === 'string' ? raw.id : randomUUID(),
    main: typeof raw?.main === 'string' ? raw.main.trim().slice(0, 80) : '',
    banned: Array.isArray(raw?.banned) ? raw.banned.filter((word: unknown) => typeof word === 'string').map((word: string) => word.trim().slice(0, 50)).filter(Boolean).slice(0, 5) : [],
    category: typeof raw?.category === 'string' ? raw.category : 'diğer',
    difficulty: ['kolay', 'orta', 'zor', 'ekstrem'].includes(raw?.difficulty) ? raw.difficulty : 'orta',
  }));
  if (cards.some(card => !card.main || card.banned.length !== 5)) return null;
  return cards;
};

function newShareCode() { return `VIP-${randomInt(1000, 10000)}`; }

export async function listTabuDecks(req: Request, res: Response): Promise<void> {
  try {
    if (isUsingDatabase()) {
      const result = await pool.query(
        'SELECT id, name, category, cover_color AS "coverColor", share_code AS "shareCode", cards, created_at AS "createdAt" FROM tabu_decks WHERE owner_id = $1 ORDER BY created_at DESC',
        [req.user!.userId]
      );
      res.json({ decks: result.rows });
    } else res.json({ decks: mockDecks.get(req.user!.userId) ?? [] });
  } catch (error) {
    console.error('listTabuDecks error:', error);
    res.status(500).json({ error: 'Desteler yüklenemedi.' });
  }
}

export async function createTabuDeck(req: Request, res: Response): Promise<void> {
  const input = req.body as Partial<DeckInput>;
  const cards = normalizeCards(input.cards);
  const name = typeof input.name === 'string' ? input.name.trim().slice(0, 60) : '';
  const category = typeof input.category === 'string' ? input.category.slice(0, 40) : '';
  const coverColor = typeof input.coverColor === 'string' && /^#[0-9a-fA-F]{6}$/.test(input.coverColor) ? input.coverColor : '#8FA8B8';
  if (!name || !category || !cards) {
    res.status(400).json({ error: 'Deste adı, kategori ve her kart için 5 yasaklı kelime gerekli.' });
    return;
  }
  try {
    const id = randomUUID();
    let shareCode = newShareCode();
    if (isUsingDatabase()) {
      for (let attempt = 0; attempt < 5; attempt++) {
        try {
          const result = await pool.query(
            `INSERT INTO tabu_decks (id, owner_id, name, category, cover_color, share_code, cards)
             VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING id, name, category, cover_color AS "coverColor", share_code AS "shareCode", cards, created_at AS "createdAt"`,
            [id, req.user!.userId, name, category, coverColor, shareCode, JSON.stringify(cards)]
          );
          res.status(201).json({ deck: result.rows[0] });
          return;
        } catch (error: any) {
          if (error.code !== '23505' || attempt === 4) throw error;
          shareCode = newShareCode();
        }
      }
    }
    const deck = { id, name, category, coverColor, shareCode, cards, createdAt: new Date().toISOString() };
    mockDecks.set(req.user!.userId, [deck, ...(mockDecks.get(req.user!.userId) ?? [])]);
    res.status(201).json({ deck });
  } catch (error) {
    console.error('createTabuDeck error:', error);
    res.status(500).json({ error: 'Deste kaydedilemedi.' });
  }
}

export async function getTabuDeckByCode(req: Request, res: Response): Promise<void> {
  const code = String(req.params.code).trim().toUpperCase();
  try {
    if (isUsingDatabase()) {
      const result = await pool.query(
        'SELECT id, name, category, cover_color AS "coverColor", share_code AS "shareCode", cards, created_at AS "createdAt" FROM tabu_decks WHERE share_code = $1',
        [code]
      );
      if (!result.rowCount) { res.status(404).json({ error: 'Bu kodla eşleşen deste bulunamadı.' }); return; }
      res.json({ deck: result.rows[0] });
      return;
    }
    const deck = [...mockDecks.values()].flat().find(item => item.shareCode === code);
    if (!deck) { res.status(404).json({ error: 'Bu kodla eşleşen deste bulunamadı.' }); return; }
    res.json({ deck });
  } catch (error) {
    console.error('getTabuDeckByCode error:', error);
    res.status(500).json({ error: 'Deste indirilemedi.' });
  }
}

export async function generateTabuDeck(req: Request, res: Response): Promise<void> {
  const topic = typeof req.body?.topic === 'string' ? req.body.topic.trim().slice(0, 160) : '';
  const category = typeof req.body?.category === 'string' ? req.body.category.slice(0, 40) : 'diğer';
  if (!topic) { res.status(400).json({ error: 'Deste konusu gerekli.' }); return; }
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) { res.status(503).json({ error: 'AI deste üretimi için sunucuda OPENAI_API_KEY tanımlanmalı.' }); return; }
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: 'Türkçe Tabu kartları oluştur. JSON nesnesi döndür: {"cards":[{"main":"...","banned":["..."],"difficulty":"kolay|orta|zor|ekstrem"}]}. Tam 24 farklı kart; her banned listesinde tam 5 kelime olsun. Ana kelime yasak kelimeler arasında olmasın.' },
          { role: 'user', content: `Konu: ${topic}. Kategori: ${category}.` },
        ],
      }),
    });
    if (!response.ok) { res.status(502).json({ error: 'AI deste şu anda üretilemedi.' }); return; }
    const payload: any = await response.json();
    const parsed = JSON.parse(payload.choices?.[0]?.message?.content ?? '{}');
    const cards = normalizeCards((parsed.cards ?? []).map((card: any, index: number) => ({ ...card, id: `ai-${Date.now()}-${index}`, category })));
    if (!cards || cards.length < 20) { res.status(502).json({ error: 'AI yeterli sayıda geçerli kart üretmedi; tekrar deneyin.' }); return; }
    res.json({ cards });
  } catch (error) {
    console.error('generateTabuDeck error:', error);
    res.status(502).json({ error: 'AI deste üretilirken bir hata oluştu.' });
  }
}
