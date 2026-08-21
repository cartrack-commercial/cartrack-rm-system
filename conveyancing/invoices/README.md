# Invoices — H Annandale Attorneys Inc. / Maryke Dique

## What's here

| File | What it is |
|---|---|
| `Maryke-Invoice-Firm-Setup.pdf` | The new-firm-setup invoice, dated 21 August 2026. R 28 517.40. |
| `Maryke-Invoice-Firm-Setup.docx` | The same invoice in Word — type over the `[grey italic]` placeholders. |
| `HAA-Invoice-TEMPLATE.docx` | Blank version with 12 empty lines. Reuse for any job. |
| `invoice-doc.html` | Source of the PDF. Edit, then re-render (command below). |
| `invoice.js` | Generator for both Word files. `node invoice.js setup` / `node invoice.js blank`. |

No logo and no fraud-warning box — both removed at Annè's request on 21 Aug 2026.
Letterhead address is Maryke's own: 673B Skukuza Street, Faerie Glen, Pretoria, 0081.
The date is hard-coded in the filled invoice and stays a placeholder in the blank template.

## Still to fill in (10 placeholders)

Invoice number · your client reference · client name, address, email and reg. no. ·
engagement period · payment reference · company reg. no. in the footer.
(The date is set; the VAT field has been removed.)

## Regenerating

```bash
# PDF (needs Chromium; fonts/ must sit next to the HTML)
chrome --headless --no-pdf-header-footer --print-to-pdf=Maryke-Invoice-Firm-Setup.pdf \
       file://$PWD/invoice-doc.html

# Word
npm install docx && node invoice.js setup && node invoice.js blank
```

Keep the invoice to **one page** — `.pg` must stay at or under ~296.5mm of content.
Measure it before shipping:

```bash
sed 's|</body>|<script>onload=()=>document.title=(document.querySelector(".pg").scrollHeight/3.7795).toFixed(1)+"mm"</script></body>|' \
  invoice-doc.html > _m.html && chrome --headless --dump-dom file://$PWD/_m.html | grep -o '<title>[^<]*'
```

## Open questions for Annè

1. ~~VAT~~ — settled 21 Aug 2026: **no VAT line**. Total stays R 28 517.40 and the
   "VAT reg. no." field has been removed from the letterhead. Note that in South Africa
   only a registered VAT vendor may head a document **TAX INVOICE**; if Maryke is not
   registered the heading should read simply **INVOICE**. One-word change — say the word.
2. **Whose letterhead.** The name block still reads H Annandale Attorneys Inc., but the
   address is now Maryke's own (673B Skukuza Street) and the account (ABSA 9153076436) is
   in her personal name. If she is invoicing personally, swap the name block for her own
   name and drop the company reg. no. line in the footer.
3. **Branch code** 632005 is ABSA's universal branch code — worth a glance before sending.
4. **Fraud warning.** The red banking-fraud box has been removed. Conveyancing payments are
   a common interception target, so consider keeping a line about it in the covering email.

Two wording fixes were made to the supplied list: *Ekhuruleni* → **Ekurhuleni**, and
*Correspond research* → **Correspondent research**. Say the word if either was intended
as written.
