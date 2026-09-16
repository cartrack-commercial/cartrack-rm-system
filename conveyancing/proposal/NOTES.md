# Conveyancing Pipeline — status notes

**What this folder is:** the sales/preview material for the *Conveyancing Pipeline* —
a sister app to the RM System, for **H Annandale Attorneys Inc.** (Moreleta Park, Pretoria).

- `HAA-Conveyancing-Pipeline-Preview.pdf` — the 5-page preview Annè sends to Maryke.
- `proposal.html` + `fonts/` — the editable source of that PDF. Regenerate with:
  `chrome --headless --no-sandbox --no-pdf-header-footer --print-to-pdf=out.pdf file://…/proposal.html`

## The users
- **Maryke Dique** — conveyancing, maryke@haattorneys.co.za
- **Hesca Annandale** — Director | Attorney, hesca@haattorneys.co.za
- Branding: deep navy + gold, serif firm mark, house-with-H logo (see the SVG in proposal.html).

## App build — ON HOLD (Annè's call, 28 Jul 2026: "will continue once I have more tokens")
Decisions already made:
- Same DNA as `../../index.html` (the RM System): single-file HTML app, PIN gate per person,
  merge-safe saves, outbox + retry banner, refresh on focus, offline-tolerant, Vault backups.
- 9 stages: Instruction → Due diligence → Drafting & signing → Clearances & duty →
  Guarantees & bond sync → Ready to lodge → Lodged/exam → Registered → Settled & closed.
- Per-file checklist template (FICA ×2, POA/declarations, SARS duty receipt, rates clearance
  + expiry, HOA/levy consent, compliance certs, guarantees vs cancellation figures,
  simultaneous lodgement, registration-day runbook), conditional on: buyer bond? seller bond?
  sectional/HOA? Plus suspensive conditions with deadlines, trust ledger (tracking aid only),
  My Day, Dash (registrations/fees/avg days), Vault (export/import, snapshots, bin).
- Storage: local-first kv, optional Supabase later (PASTE_ placeholder pattern like the parent).

Open question for Annè when resuming: **new repo?** She asked "can we build a new repo" —
if yes, the app gets its own repo (+ GitHub Pages) instead of living in this one.
