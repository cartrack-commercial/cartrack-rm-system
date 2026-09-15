# H Annandale Attorneys Inc. — brand kit & document house style

Everything needed to rebuild any of these documents from scratch. Taken from the firm's
printed letterhead (photographed 15 Sep 2026) and from decisions made with Annè along the way.

---

## 1. The firm

| | |
|---|---|
| Name | **H Annandale Attorneys Inc.** |
| Registration number | **2026/219692/21** |
| Director | **H Annandale LLB (NWU)** — Hesca Annandale, Director \| Attorney |
| Address | 59 Bolo Street, Moreleta Park, Pretoria, 0181 |
| Phone | 060 981 3036 (Hesca) · 083 619 2313 (Maryke) |
| Email | hesca@haattorneys.co.za · maryke@haattorneys.co.za |

**Maryke Dique** — conveyancing. Her own address, used when she invoices in her personal capacity:
673B Skukuza Street, Faerie Glen, Pretoria, 0081 · maryke@haattorneys.co.za · 083 619 2313.
Bank: **ABSA**, account **9153076436**, branch **632005**, in her own name.

---

## 2. Colours

| Token | Hex | Where |
|---|---|---|
| `--band` | `#333E48` | letterhead bar, footer bar, table headers, total bar |
| `--band-2` | `#2B353E` | the second (director) footer bar |
| `--gold` | `#C2A56E` | the mark, rules, bullets, small caps on dark |
| `--gold-ink` | `#8A6F3C` | gold dark enough to read as text on white |
| `--ink` | `#1F2933` | body text |
| `--soft` | `#55606B` | secondary text |
| `--faint` | `#949DA7` | labels |
| `--line` | `#DFE3E7` | rules |
| `--paper` | `#F7F5F1` | tint panels |
| `--red` / `--red-soft` | `#A33328` / `#FBF3F2` | "requires attention" cards |

Sampled from a photo of the printed letterhead and white-balanced against the paper, so
they are close but not certified. If the firm has the original artwork or a brand sheet,
prefer those values.

## 3. Type

- **Display / firm name:** Cormorant Garamond 600, letter-spaced `.17em–.26em`, uppercase.
- **Body:** IBM Plex Sans (the firm's own Word documents use Arial — Plex is the print-quality
  stand-in and reads the same at a glance).
- Fonts are vendored in `../fonts/` with `fonts.css` rewritten to local paths, so PDFs render
  identically offline. Re-fetch with the `curl` recipe at the bottom of this file.

## 4. The mark

`logo.svg` — a **redraw**, not the original artwork: a gable with two posts, a 2×2 window and
a three-block crossbar forming the H. It uses `currentColor`, so set the colour on the parent.
Good enough for print at the sizes used here; **ask the firm for the real vector file** if the
logo ever needs to appear large.

## 5. Layout

`brand.css` carries the shared furniture:

- `.sheet` — A4 page, flex column, `min-height:296.6mm`. **Keep each sheet at or under 296.6mm**
  or Chromium spills a blank page. Measure before shipping (recipe below).
- `.lh` — the dark letterhead bar: mark, firm name, gold divider, contact block.
- `.foot` + `.foot-reg` / `.foot-dir` — the two stacked footer bars. `.foot` uses `margin-top:auto`
  so it always sits at the foot of the page.
- `table.fees`, `.panel`, `.flag`, `.sec`, `ul.sub` — tables, tint panels, red attention cards,
  gold section labels, chevron sub-lists.

---

## 6. Documents built on this

| File | What it is |
|---|---|
| `../letters/trust-letter.html` | Registration of an Inter Vivos Trust — **faithful reproduction** of the firm's own letter: same wording, same bullet structure, same Debit/Credit fee table (R 22 000.00). Only the typos below were fixed. |
| `../invoices/invoice-doc.html` | Tax invoice MD1 — Maryke → H Annandale, R 28 517.40 |
| `../invoices/invoice.js` | Word version of the invoice (`node invoice.js setup\|blank`) |
| `../matters/chartwell-summary.html` | Deed of sale summary — Holding 34 Chartwell |

### Decisions already made — don't undo these by accident

- **The invoice runs from Maryke to the firm**, so it carries *her* letterhead and bank account,
  not the firm's. Annandale's details sit in the "Invoice to" block.
- **No VAT line** on the invoice; total is R 28 517.40. The "VAT reg. no." field was removed
  rather than left blank. If Maryke is not a registered VAT vendor the heading should read
  **INVOICE**, not **TAX INVOICE** — raised with Annè, not yet decided.
- **No logo and no banking-fraud box** on the invoice (Annè, 21 Aug 2026). The logo *is* used on
  firm letterhead documents.
- **No terms block** on the invoice (Annè, 21 Aug 2026).
- Invoice reference **MD1**, used as both invoice number and payment reference.
- The **trust letter is a reproduction, not a rewrite.** Keep the firm's own wording and the
  •/➢ list structure. Typos silently corrected against the printed original: "Copy of ID
  document **of** passport" → "or passport" (twice); runner's fee "1 875.0" → "1 875.00";
  missing spaces in "consideration.Once" and "jurisdiction.The"; a comma after
  "Relationship to the founder(s)" made a semicolon; the table's clipped column headers
  restored to **Debit** / **Credit**.

### Gotcha: `li::before` in brand.css
`brand.css` styles **every** `li::before` as a gold circle. Any custom list marker must
override `background`, `border-radius` and `border` explicitly, or the circle paints behind
it — this produced a blob instead of an arrow in the trust letter until it was caught.

---

## 7. Recipes

```bash
# measure every sheet before shipping — each must be <= 296.6mm
python3 - <<'PY'
s=open('doc.html').read()
js='<script>onload=()=>{const q=[...document.querySelectorAll(".sheet")].map(e=>(e.scrollHeight/3.779528).toFixed(1));document.title=q.join(" | ")+" mm"}</script></body>'
open('_m.html','w').write(s.replace('</body>', js))
PY
chrome --headless --no-sandbox --virtual-time-budget=9000 --dump-dom file://$PWD/_m.html | grep -o "<title>[^<]*"

# render
chrome --headless --no-sandbox --no-pdf-header-footer --virtual-time-budget=12000 \
       --print-to-pdf=out.pdf file://$PWD/doc.html

# re-fetch the fonts if fonts/ is ever lost
curl -A "Mozilla/5.0" "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=IBM+Plex+Sans:wght@400;500;600;700&display=swap" -o fonts/fonts.css
# then download each gstatic URL into fonts/ and rewrite the URLs in fonts.css to the filenames
```

Word documents need `libreoffice-writer` (not just `libreoffice-core`) before `soffice --convert-to pdf`
will open anything — without it every conversion fails with "source file could not be loaded".
Always render the .docx and look at it; the invoice silently ran onto a second page for weeks.
