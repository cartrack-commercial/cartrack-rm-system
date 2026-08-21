const fs = require('fs');
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  WidthType, BorderStyle, ShadingType, AlignmentType, VerticalAlign,
} = require('docx');

// node invoice.js setup   -> the firm-setup invoice, filled in
// node invoice.js blank   -> an empty template to reuse for any job
const FILLED = process.argv[2] !== 'blank';

const NAVY = '17263A', GOLD = 'B58C4B', INK = '1B2B40', SOFT = '55647A',
      FAINT = '93A0B2', LINE = 'E3DDD2', PAPER = 'FAF8F4';
const SERIF = 'Times New Roman', SANS = 'Arial';
const NONE = { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' };
const NOB = { top: NONE, bottom: NONE, left: NONE, right: NONE };
const HAIR = { top: NONE, bottom: { style: BorderStyle.SINGLE, size: 3, color: LINE }, left: NONE, right: NONE };

const t = (text, o = {}) => new TextRun({
  text, font: o.font || SANS, size: o.size || 18, bold: o.bold, italics: o.italics,
  color: o.color || INK, characterSpacing: o.spacing, allCaps: o.caps,
});
const p = (runs, o = {}) => new Paragraph({
  children: Array.isArray(runs) ? runs : [runs],
  alignment: o.align,
  spacing: { before: o.before || 0, after: o.after === undefined ? 60 : o.after, line: o.line || 240 },
  border: o.border, numbering: o.numbering,
});
const gap = (h) => new Paragraph({ children: [], spacing: { after: h } });
const lb = (s) => p(t(s, { size: 13, bold: true, color: GOLD, spacing: 55, caps: true }), { after: 80 });
const cell = (children, o = {}) => new TableCell({
  children, width: { size: o.w, type: WidthType.DXA },
  borders: o.borders || NOB,
  shading: o.fill ? { type: ShadingType.CLEAR, fill: o.fill, color: 'auto' } : undefined,
  margins: o.m || { top: 60, bottom: 60, left: 0, right: 0 },
  verticalAlign: o.valign, columnSpan: o.span,
});
const tbl = (rows, widths) => new Table({
  rows, columnWidths: widths,
  width: { size: widths.reduce((a, b) => a + b, 0), type: WidthType.DXA }, borders: NOB,
});
const money = (n) => 'R ' + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
// placeholder styling: grey italic so it's obvious what still needs typing over
const fill = (s, o = {}) => t(s, Object.assign({ color: '9AA6B6', italics: true }, o));
const F = (ph, val, o = {}) => (FILLED && val ? t(val, o) : fill('[' + ph + ']', o));

// ---------------------------------------------------------------- data
const ITEMS = FILLED ? [
  ['Consulting fee in respect of firm requirements', 2017.40],
  ['E4 registration', 3000],
  ['Lexpro registration', 3000],
  ['SearchWorks registration', 3000],
  ['e-Tshwane clearance portal setup', 2000],
  ['Ekurhuleni clearance portal setup', 2000],
  ['Email set-up', 2000],
  ['Letterhead and logo design', 2000],
  ['Email signature design', 2000],
  ['Correspondent research and lodgement arrangements', 2500],
  ['Office setup and purchasing of office supplies', 5000],
] : Array.from({ length: 10 }, () => ['[Description of service]', null]);
const subtotal = ITEMS.reduce((s, r) => s + (r[1] || 0), 0);

// ---------------------------------------------------------------- header
const headerLeft = [
  p(t('MARYKE DIQUE', { font: SERIF, size: 26, bold: true, color: NAVY, spacing: 80 }), { after: 150 }),
  p(t('673B Skukuza Street, Faerie Glen', { size: 15, color: SOFT }), { after: 10 }),
  p(t('Pretoria, 0081', { size: 15, color: SOFT }), { after: 10 }),
  p(t('maryke@haattorneys.co.za', { size: 15, color: SOFT }), { after: 10 }),
  p(t('083 619 2313', { size: 15, color: SOFT }), { after: 0 }),
];
const metaRow = (k, v) => new TableRow({ children: [
  cell([p(t(k, { size: 13, color: FAINT, caps: true, spacing: 25 }), { align: AlignmentType.RIGHT, after: 0 })],
    { w: 1700, m: { top: 25, bottom: 25, left: 0, right: 150 } }),
  cell([p(v, { align: AlignmentType.RIGHT, after: 0 })],
    { w: 2400, m: { top: 25, bottom: 25, left: 0, right: 0 } }),
]});
const headerRight = [
  p(t('TAX INVOICE', { font: SERIF, size: 38, bold: true, color: NAVY, spacing: 40 }), { align: AlignmentType.RIGHT, after: 50 }),
  new Paragraph({ children: [], spacing: { after: 150 }, border: { bottom: { style: BorderStyle.SINGLE, size: 10, color: GOLD } } }),
  tbl([
    metaRow('Invoice no.', F('INV-2026-001', 'MD1', { size: 17, bold: true })),
    metaRow('Date', F('DD Month 2026', '21 August 2026', { size: 17, bold: true })),
    ...(FILLED ? [] : [metaRow('Your reference', fill('[Client ref]', { size: 17, bold: true }))]),
    metaRow('Prepared by', t('Maryke Dique', { size: 17, bold: true })),
  ], [1700, 2400]),
];

// ---------------------------------------------------------------- parties
const kv = (k, v) => tbl([new TableRow({ children: [
  cell([p(t(k, { size: 16, color: FAINT }), { after: 0 })], { w: 1300, m: { top: 40, bottom: 40, left: 0, right: 120 } }),
  cell([p(v, { after: 0 })], { w: 3202, m: { top: 40, bottom: 40, left: 0, right: 0 } }),
] })], [1300, 3202]);

const billTo = [
  lb('Invoice to'),
  p(F('Client / firm name', 'H Annandale Attorneys Inc.', { size: 20, bold: true }), { after: 90 }),
  p(F('Attention', 'Attention: Hesca Annandale', { size: 17 }), { after: 40 }),
  p(F('Address line 1', '59 Bolo Street, Moreleta Park', { size: 17 }), { after: 40 }),
  p(F('Address line 2', 'Pretoria, 0181', { size: 17 }), { after: 40 }),
  p(F('Email address', 'hesca@haattorneys.co.za', { size: 17 }), { after: 0 }),
];
const engagement = [
  lb('The engagement'),
  kv('Service', FILLED ? t('Assisting in new firm setup', { size: 17 }) : fill('[Service]', { size: 17 })),
  kv('Scope', FILLED ? t('Practice registrations, clearance portals, systems and office establishment', { size: 17 })
                     : fill('[Scope of work]', { size: 17 })),
  kv('Period', F('Month – Month 2026', null, { size: 17 })),
  kv('Status', FILLED ? t('Completed', { size: 17 }) : fill('[Status]', { size: 17 })),
];

// ---------------------------------------------------------------- items
const C = [7704, 2500];
const itemsHead = new TableRow({ children: [
  cell([p(t('Description', { size: 13, bold: true, color: 'FFFFFF', spacing: 50, caps: true }), { after: 0 })],
    { w: C[0], fill: NAVY, m: { top: 90, bottom: 90, left: 150, right: 60 } }),
  cell([p(t('Amount', { size: 13, bold: true, color: 'FFFFFF', spacing: 50, caps: true }), { align: AlignmentType.RIGHT, after: 0 })],
    { w: C[1], fill: NAVY, m: { top: 90, bottom: 90, left: 0, right: 150 } }),
]});
const itemRow = ([desc, val]) => new TableRow({ children: [
  cell([p(val === null ? fill(desc, { size: 17 }) : t(desc, { size: 17 }), { after: 0 })],
    { w: C[0], borders: HAIR, m: { top: 75, bottom: 75, left: 150, right: 120 } }),
  cell([p(val === null ? fill('R', { size: 17 }) : t(money(val), { size: 17 }), { align: AlignmentType.RIGHT, after: 0 })],
    { w: C[1], borders: HAIR, m: { top: 75, bottom: 75, left: 0, right: 150 } }),
]});

// ---------------------------------------------------------------- totals
const T = [7204, 3000];
const totalRow = (k, v, o = {}) => new TableRow({ children: [
  cell([p(t(k, { size: o.big ? 18 : 17, bold: o.bold, color: o.color || SOFT, caps: o.big, spacing: o.big ? 45 : 0 }), { align: AlignmentType.RIGHT, after: 0 })],
    { w: T[0], fill: o.fill, borders: o.borders, m: { top: o.pad || 70, bottom: o.pad || 70, left: 0, right: 220 } }),
  cell([p(v === null ? fill('R', { size: 17 }) : t(money(v), { font: o.big ? SERIF : SANS, size: o.big ? 26 : 17, bold: o.bold, color: o.color || INK }), { align: AlignmentType.RIGHT, after: 0 })],
    { w: T[1], fill: o.fill, borders: o.borders, m: { top: o.pad || 70, bottom: o.pad || 70, left: 0, right: 150 } }),
]});

// ---------------------------------------------------------------- blocks
const bank = (k, v) => p([
  t(k, { size: 13, color: FAINT, caps: true, spacing: 25 }),
  new TextRun({ text: '   ', font: SANS, size: 17 }),
  v,
], { after: 70 });

const payBlock = [
  lb('Payment details'),
  bank('Account holder', t('Maryke Dique', { size: 17, bold: true })),
  bank('Bank', t('ABSA', { size: 17, bold: true })),
  bank('Account number', t('9153076436', { size: 17, bold: true })),
  bank('Branch code', t('632005', { size: 17, bold: true })),
  bank('Reference', F('Invoice no.', 'MD1', { size: 17, bold: true })),
  p([t('Please use reference ', { size: 14, italics: true, color: SOFT }), t(FILLED ? 'MD1' : 'as above', { size: 14, bold: true, italics: true, color: SOFT }), t(' when paying and email proof of payment to maryke@haattorneys.co.za.', { size: 14, italics: true, color: SOFT })], { after: 0 }),
];

// ---------------------------------------------------------------- document
const doc = new Document({
  creator: 'H Annandale Attorneys Inc.',
  title: FILLED ? 'Tax Invoice — new firm setup' : 'Tax Invoice — template',
  description: 'Tax invoice',
  styles: { default: { document: { run: { font: SANS, size: 18, color: INK } } } },
  sections: [{
    properties: { page: { margin: { top: 620, right: 851, bottom: 400, left: 851 } } },
    children: [
      tbl([new TableRow({ children: [
        cell(headerLeft, { w: 6104, valign: VerticalAlign.TOP }),
        cell(headerRight, { w: 4100, valign: VerticalAlign.TOP }),
      ] })], [6104, 4100]),
      gap(180),
      new Paragraph({ children: [], spacing: { after: 220 }, border: { bottom: { style: BorderStyle.SINGLE, size: 8, color: GOLD } } }),
      tbl([new TableRow({ children: [
        cell(billTo, { w: 4702, valign: VerticalAlign.TOP }),
        cell([], { w: 300 }),
        cell(engagement, { w: 5202, valign: VerticalAlign.TOP, fill: PAPER, m: { top: 170, bottom: 170, left: 220, right: 200 } }),
      ] })], [4702, 300, 5202]),
      p(t('Services rendered', { size: 14, bold: true, color: NAVY, spacing: 55, caps: true }), { before: 300, after: 110 }),
      tbl([itemsHead, ...ITEMS.map(itemRow)], C),
      gap(200),
      tbl([
        totalRow('Subtotal', FILLED ? subtotal : null, { borders: { top: { style: BorderStyle.SINGLE, size: 3, color: LINE }, bottom: NONE, left: NONE, right: NONE } }),
        totalRow('Total due', FILLED ? subtotal : null, { bold: true, big: true, color: 'FFFFFF', fill: NAVY, pad: 140 }),
      ], T),
      gap(190),
      tbl([new TableRow({ children: [
        cell(payBlock, { w: 4952, fill: PAPER, valign: VerticalAlign.TOP, m: { top: 190, bottom: 190, left: 220, right: 200 } }),
        cell([], { w: 5252 }),
      ] })], [4952, 5252]),
      gap(120),
      new Paragraph({ children: [], spacing: { after: 90 }, border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: LINE } } }),
      p([
        t('Maryke Dique', { size: 13, bold: true, color: SOFT }),
        t('   ·   673B Skukuza Street, Faerie Glen, Pretoria, 0081   ·   083 619 2313   ·   E & OE', { size: 13, color: FAINT }),
      ], { after: 0 }),
    ],
  }],
});

const out = FILLED ? 'Maryke-Invoice-Firm-Setup.docx' : 'HAA-Invoice-TEMPLATE.docx';
Packer.toBuffer(doc).then((b) => { fs.writeFileSync(out, b); console.log('wrote', out, b.length, 'bytes'); });
