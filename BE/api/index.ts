import { handle } from 'hono/vercel';
import { app } from '../src/app.js';

// Serverless function Vercel. vercel.json meneruskan semua /api/* ke sini; path asli tetap
// terbaca, jadi app Hono (basePath /api) sama persis dengan yang dipakai server Node
const handler = handle(app);

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const PATCH = handler;
export const DELETE = handler;
export const OPTIONS = handler;
