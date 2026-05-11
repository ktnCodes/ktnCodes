import { NextRequest, NextResponse } from 'next/server';
import fs from 'node:fs/promises';
import path from 'node:path';

/**
 * Dev-only file write endpoint. Returns 404 in production so the route does
 * not exist in deployed builds. Accepts JSON bodies for text writes:
 *
 *   POST /api/dev/save
 *     { path: "content/hero.json", content: "...string..." }
 *     { path: "content/projects/arkive.md", content: "...markdown..." }
 *
 * Or form-data for image uploads:
 *
 *   POST /api/dev/save (multipart/form-data)
 *     path:  "public/about/portrait.jpg"   (target path inside the project)
 *     file:  <File>                         (the binary)
 *
 * Path safety: the resolved absolute path MUST sit inside one of the allowed
 * roots (content/ or public/) — otherwise reject. Prevents `../../../etc/passwd`.
 */

const ROOT = process.cwd();
const ALLOWED_DIRS = [path.join(ROOT, 'content'), path.join(ROOT, 'public')];

function isProd() {
  return process.env.NODE_ENV === 'production';
}

function safeResolve(rel: string): string | null {
  if (!rel || typeof rel !== 'string') return null;
  // Normalize and reject any absolute paths from the client.
  const cleaned = rel.replace(/^[\\/]+/, '');
  const abs = path.resolve(ROOT, cleaned);
  if (!ALLOWED_DIRS.some((root) => abs === root || abs.startsWith(root + path.sep))) {
    return null;
  }
  return abs;
}

export async function POST(req: NextRequest) {
  if (isProd()) {
    return NextResponse.json({ error: 'not found' }, { status: 404 });
  }
  const ct = req.headers.get('content-type') ?? '';

  try {
    if (ct.includes('multipart/form-data')) {
      const form = await req.formData();
      const targetRel = String(form.get('path') ?? '');
      const file = form.get('file');
      if (!(file instanceof File)) {
        return NextResponse.json({ error: 'missing file' }, { status: 400 });
      }
      const abs = safeResolve(targetRel);
      if (!abs) return NextResponse.json({ error: 'invalid path' }, { status: 400 });
      await fs.mkdir(path.dirname(abs), { recursive: true });
      const buf = Buffer.from(await file.arrayBuffer());
      await fs.writeFile(abs, buf);
      // Compute the public URL if it's under /public
      const publicRoot = path.join(ROOT, 'public');
      const url = abs.startsWith(publicRoot)
        ? '/' + path.relative(publicRoot, abs).replace(/\\/g, '/')
        : null;
      return NextResponse.json({ ok: true, path: targetRel, url });
    }

    const body = await req.json();
    const targetRel = String(body.path ?? '');
    const content = String(body.content ?? '');
    const abs = safeResolve(targetRel);
    if (!abs) return NextResponse.json({ error: 'invalid path' }, { status: 400 });
    await fs.mkdir(path.dirname(abs), { recursive: true });
    await fs.writeFile(abs, content, 'utf8');
    return NextResponse.json({ ok: true, path: targetRel });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'write failed' },
      { status: 500 },
    );
  }
}

export async function GET() {
  if (isProd()) return NextResponse.json({ error: 'not found' }, { status: 404 });
  return NextResponse.json({
    ok: true,
    allowed: ALLOWED_DIRS.map((d) => path.relative(ROOT, d)),
  });
}
