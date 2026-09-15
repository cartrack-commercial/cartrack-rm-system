# H Annandale Attorneys Inc. — documents

| Folder | What's in it |
|---|---|
| `brand/` | **Start here.** `BRAND.md` is the house style — colours, type, layout rules, the firm's details and every decision already made. `brand.css` + `logo.svg` are what the documents actually use. |
| `fonts/` | Cormorant Garamond + IBM Plex Sans, vendored so PDFs render identically offline. |
| `letters/` | Client letters. Currently: registration of an inter vivos trust. |
| `invoices/` | Tax invoice MD1 (Maryke → the firm), plus the Word generator and a blank template. |
| `matters/` | Matter notes. Currently: the Holding 34 Chartwell deed of sale summary. |
| `proposal/` | The Conveyancing Pipeline app preview (separate piece of work — see its NOTES.md). |

Every document is a single HTML file rendered to PDF with headless Chromium. Recipes for
measuring and rendering are at the foot of `brand/BRAND.md`.
