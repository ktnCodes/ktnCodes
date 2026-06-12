import { readFileSync } from 'fs';
import { join } from 'path';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const PDFDocument = require('pdfkit') as typeof import('pdfkit');
import { ResumeSchema, type ResumeData } from '@/lib/content-schemas';

// pdfkit is a CJS module with internal font assets; keep it out of the
// webpack bundle so Next.js resolves it from node_modules at runtime.
export const runtime = 'nodejs';

// Stone palette
const C = {
  strong: '#1c1917',
  body:   '#292524',
  muted:  '#78716c',
  dim:    '#a8a29e',
  line:   '#d6d3d1',
};

const LEFT  = 50;
const RIGHT = 50;
const PAGE_W = 612;
const W = PAGE_W - LEFT - RIGHT; // 512

function readResume(): ResumeData {
  const raw = readFileSync(join(process.cwd(), 'content', 'resume.json'), 'utf-8');
  return ResumeSchema.parse(JSON.parse(raw));
}

function fmtDate(d: string | undefined): string {
  if (!d) return 'Present';
  const [y, m] = d.split('-').map(Number);
  if (!m) return String(y);
  return new Date(y, m - 1).toLocaleString('en-US', { month: 'short' }) + ' ' + y;
}

// Draw hairline + section label, advance cursor
function drawSection(doc: InstanceType<typeof PDFDocument>, title: string) {
  const y = doc.y + 7;
  doc.strokeColor(C.line).lineWidth(0.5)
    .moveTo(LEFT, y).lineTo(LEFT + W, y).stroke();
  doc.font('Helvetica-Bold').fontSize(7.5).fillColor(C.muted)
    .text(title, LEFT, y + 6);
  doc.font('Helvetica').fillColor(C.body);
  doc.moveDown(0.25);
}

// Write left text (bold) and right text (muted) on the same y baseline.
// Left is written FIRST so the PDF content stream reads company-then-date:
// naive ATS extractors consume text in stream order, not visual order.
function entryHeader(
  doc: InstanceType<typeof PDFDocument>,
  left: string,
  right: string,
) {
  const y = doc.y;
  doc.font('Helvetica-Bold').fontSize(9.5).fillColor(C.strong)
    .text(left, LEFT, y);
  const afterLeft = doc.y; // taller line-height; this sets the final cursor
  doc.font('Helvetica').fontSize(8.5).fillColor(C.muted)
    .text(right, LEFT, y, { align: 'right', width: W });
  doc.y = afterLeft;
}

async function buildPDF(data: ResumeData): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: 'LETTER',
      margins: { top: 45, bottom: 40, left: LEFT, right: RIGHT },
      bufferPages: true,
      info: { Title: `${data.basics.name} Resume`, Author: data.basics.name },
    });

    const chunks: Buffer[] = [];
    doc.on('data', (c: Buffer) => chunks.push(c));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    // ── HEADER ───────────────────────────────────────────────────────────────
    doc.font('Helvetica-Bold').fontSize(19).fillColor(C.strong)
      .text(data.basics.name, LEFT, 45);
    doc.font('Helvetica').fontSize(10).fillColor(C.muted)
      .text(data.basics.label);

    const contactParts = [
      data.basics.email,
      data.basics.phone,
      data.basics.url.replace(/^https?:\/\//, ''),
      ...(data.basics.profiles?.map((p) => p.url.replace(/^https?:\/\//, '')) ?? []),
    ].filter(Boolean);

    doc.font('Helvetica').fontSize(8).fillColor(C.dim)
      .text(contactParts.join('  |  '));

    // ── SUMMARY ───────────────────────────────────────────────────────────────
    drawSection(doc, 'SUMMARY');
    doc.font('Helvetica').fontSize(9).fillColor(C.body)
      .text(data.basics.summary, LEFT, undefined, { width: W, lineGap: 1 });

    // ── SKILLS ────────────────────────────────────────────────────────────────
    drawSection(doc, 'SKILLS');
    const labelW = 158;
    for (const skill of data.skills) {
      const y = doc.y;
      doc.font('Helvetica-Bold').fontSize(8).fillColor(C.body)
        .text(skill.name.toUpperCase(), LEFT, y, { width: labelW, lineBreak: false });
      doc.font('Helvetica').fontSize(8.5).fillColor(C.body)
        .text(skill.keywords.join(', '), LEFT + labelW + 6, y, { width: W - labelW - 6 });
      doc.moveDown(0.15);
    }

    // ── EXPERIENCE ────────────────────────────────────────────────────────────
    drawSection(doc, 'EXPERIENCE');
    for (const job of data.work) {
      entryHeader(doc, job.name, `${fmtDate(job.startDate)} - ${fmtDate(job.endDate)}`);
      doc.font('Helvetica-Oblique').fontSize(9).fillColor(C.muted)
        .text(`${job.position}  |  ${job.location}`, LEFT);
      doc.moveDown(0.15);
      doc.font('Helvetica').fontSize(8.5).fillColor(C.body);
      for (const h of job.highlights) {
        doc.text(`•  ${h}`, LEFT + 8, undefined, { width: W - 8, lineGap: 0.5 });
      }
      doc.moveDown(0.6);
    }

    // ── PROJECTS ──────────────────────────────────────────────────────────────
    drawSection(doc, 'PROJECTS');
    for (const proj of data.projects) {
      entryHeader(doc, proj.name, proj.url?.replace(/^https?:\/\//, '') ?? '');
      doc.moveDown(0.15);
      doc.font('Helvetica').fontSize(8.5).fillColor(C.body);
      for (const h of proj.highlights) {
        doc.text(`•  ${h}`, LEFT + 8, undefined, { width: W - 8, lineGap: 0.5 });
      }
      doc.moveDown(0.6);
    }

    // ── EDUCATION ─────────────────────────────────────────────────────────────
    drawSection(doc, 'EDUCATION');
    for (const edu of data.education) {
      entryHeader(doc, edu.institution, fmtDate(edu.endDate));
      doc.font('Helvetica-Oblique').fontSize(9).fillColor(C.muted)
        .text(`${edu.studyType}  ${edu.area}`, LEFT);
    }

    doc.end();
  });
}

export async function GET() {
  try {
    const data = readResume();
    const buffer = await buildPDF(data);
    return new Response(buffer as unknown as BodyInit, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="Kevin_Nguyen_Resume.pdf"',
        'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
      },
    });
  } catch (err) {
    console.error('[resume] PDF generation failed:', err);
    return new Response('Failed to generate resume', { status: 500 });
  }
}
