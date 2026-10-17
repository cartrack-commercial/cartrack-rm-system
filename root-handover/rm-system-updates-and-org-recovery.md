# Handover: RM System updates and org recovery

Prepared 17 October 2026 for Root Innovations. This is a record of one Claude Code chat, written so that Anné or another session can pick the work up without rereading the chat. It is a record, not a cleanup: nothing in the live system was changed to produce it. The only additions are this file and a sanitised zip package.

## 1. What this chat was for

The chat ran from 23 July 2026 to 17 October 2026: hands-on work 23 to 27 July 2026, a follow-up question on 24 September 2026, and this handover on 17 October 2026. Its purpose was to ship a prepared four-feature update to the RM System, the mobile pipeline and commission app used by a commercial insurance sales team of seven RMs plus managers; to fix a readability defect; to produce team communications for a signed deal; and then, mid-chat, to diagnose and recover a full production outage caused by the deletion of the GitHub organisation that hosted the app.

## 2. What Anné did herself

- 23 July 2026: chose the deployment route for the four-feature update (merge straight to main, no pull request) and verified the deployed version stamp (v2026.07.23c) by signing in on her phone.
- 23 July 2026: reviewed the master-key sign-in model, decided to keep the access design unchanged, and set the key-sharing policy for the leadership key holders.
- 23 July 2026: caught a usability defect from a screenshot (a pipeline sub-heading in light grey, unreadable on mobile) and specified the fix (light orange). The fix was live the same day.
- 23 July 2026: created pull request #1 from the Claude Code UI, had the session subscribe to it, and approved the merge (merged 11:39 SAST).
- 23 to 27 July 2026: selected the correct premium figure (R19,434 per month) from a two-insurer comparison proposal for a signed fleet deal, and announced the deal to the team on WhatsApp.
- 27 July 2026: ran the outage recovery end to end in the GitHub UI: recreated the deleted organisation, decided which four of eight repositories belonged to it and transferred them, kept four personal repositories personal, reinstalled the GitHub App, and confirmed the restored app live on her phone the same morning.
- 27 July 2026: briefed the team on the outage in plain language, in English and in Afrikaans.
- 24 September 2026: clarified the tool boundary for the team: quote comparisons belong in the separate comparison tool, and the RM System tracks the resulting deal in the pipeline.

## 3. What was built

### RM System (pipeline and commission app)

- What it does: sales pipeline (7 stages), active client book, commission and payroll views, a My Day cockpit per RM, deal-signed celebration with a WhatsApp share, PIN sign-in with master keys, and a Command View for management.
- Who uses it: the seven-RM sales team and their managers, daily, on phones.
- State: live.
- Where it lives: github.com/cartrack-commercial/cartrack-rm-system, branch main. Live at https://cartrack-commercial.github.io/cartrack-rm-system/. The app is one file, index.html (2,805 lines at this chat's final state), plus sw.js (service worker) and manifest.webmanifest.
- Built with: hand-written HTML, CSS and JavaScript as a PWA; Supabase (supabase-js v2) for shared data; GitHub Pages for hosting; a service worker for the offline shell.
- This chat's commits, all on main: 2b779c4 (My Day cockpit, deal-signed celebration, monthly honours; 23 Jul 03:40 UTC), ff76a04 (PINs upgraded to 6 digits, whole team re-enrols; 05:07), e0806eb (master keys; 06:30), 2411903 (client delete made complete everywhere; 07:29), 3679041 (pipeline sub-line orange instead of grey; 08:48), cad3204 (merge of pull request #1; 09:39 UTC), fc633d7 (empty commit to retrigger the Pages deploy after the org restore; 27 Jul 08:14 UTC). The pre-merge copies of the same work sit on branch claude/cartrack-rm-system-access-humtqk (tip 7d80bb3; also 03ef1a8 and 5c86c25).
- Reuse for Root Innovations: after stripping only. The architecture (single-file PWA plus Supabase plus Pages, running at R0 per month) is reusable as a pattern. The code itself carries employer branding, hard-wired access codes, the staff roster and seeded client data, and it was built for the employer; confirm who owns the code before lifting any of it.

### Celebration demo

- What it does: a standalone 600 by 500 page recreating the deal-signed confetti screen, plus a Playwright script that screenshots it headlessly.
- State: draft (a demo made to produce one image). The original files were in the session sandbox and are gone (the container was recycled); a sanitised copy is in the zip under demo/.
- Reuse: as is.

### Team communications

- A deal-signed WhatsApp message, an outage explanation in English and in Afrikaans, and a plain-language explainer of how the app is hosted.
- State: delivered in chat only and sent on by Anné. Not archived; the verbatim text was lost when the chat was compacted.

### Referenced but not built or changed in this chat

- The premium comparison tool: github.com/cartrack-commercial/cartrack-premium-comparison (device-only, no client data stored).
- The launcher page: github.com/cartrack-commercial/cartrack-commercial.github.io.
- A client fleet insurance proposal PDF uploaded into the chat (see section 7).

### This handover

- Repository copy: root-handover/rm-system-updates-and-org-recovery.md on branch root-handover of cartrack-commercial/cartrack-rm-system.
- OneDrive copy: Documents/Root Innovations/Handovers/ on Anné's OneDrive.
- Zip package: rm-system-updates-and-org-recovery.zip in the same root-handover/ folder on branch root-handover, and sent in the chat as a download.

## 4. Proof points

- Same-day recovery of a production outage for a national telematics company's insurance division, 27 July 2026: the GitHub organisation hosting the team's app had been deleted, taking the public site down. The organisation was recreated, 4 repositories were transferred back, the deploy was verified green (GitHub Pages workflow run 30249427752, conclusion: success), and the app was confirmed live on a phone the same morning. Zero data loss: the app's data lives in a separate database the outage never touched.
- Five features and fixes shipped to a seven-person sales team's live app in one working day, 23 July 2026: first commit 03:40 UTC, final fix merged 09:39 UTC.
- A signed fleet deal in which the proposed premium beat the incumbent insurer by R1,850 per month: R19,434 against R21,284, an 8.7 percent saving for the client.
- A security upgrade with full adoption: the team's sign-in PINs moved to 6 digits with the whole team re-enrolled.
- Running cost of the entire stack: R0 per month (static hosting plus a free-tier database).

## 5. Skills and methods this chat shows

- Applying a prepared multi-commit patch with git am --3way, merging to main, and re-deploying with an empty commit when the host only rebuilds on push.
- Outage triage by elimination: the site returned 404, but the repositories were intact under a personal account and the organisation page itself returned 404, which pointed at organisation deletion rather than a hosting or code bug.
- GitHub organisation recovery mechanics: deleted organisation names become reusable; repository transfers temporarily lock pushes (403), so the deploy push was retried on a background loop with backoff until the lock lifted.
- Verifying a deploy from a sandbox that cannot reach the public site: read the Pages workflow run status through the GitHub API instead, and let a human on a phone be the final check.
- Rendering and screenshotting a CSS confetti animation headlessly with Playwright and a preinstalled Chromium.
- Judgement calls: the access model was left unchanged once the gate demonstrably asked for a password; an unavailable video generator was declined honestly instead of imitated; personal repositories were kept out of the company organisation during the transfers.
- Working method: a non-technical owner reporting defects by screenshot, translated into precise fixes. The readability fix was a single colour token change on one line.

## 6. Where I stopped

The last piece of work was on 24 September 2026: answering where quote comparisons belong (in the separate comparison tool, not the RM System). Nothing was left half-built; everything this chat coded is merged and live.

Open next steps when this is picked up:

1. Confirm the launcher and the comparison tool load at their public URLs. If either returns 404, re-save its GitHub Pages settings and push an empty commit to rebuild.
2. Add a second owner (Brendan) to the cartrack-commercial GitHub organisation: Organisation, People, invite, role Owner. Still not done as of 17 October 2026. Until it is, a single account can again take the whole site down.
3. Two loose threads were never resolved: a request to change the app's fonts (never specified further) and an offer to record the celebration animation as a video (never confirmed).

Check these before resuming after months away:

- The repository moved on after this chat. Commits from other sessions in August and September 2026 adjusted won-deal figures (5f7e2e5, 7 Aug), relabelled the master keys by role (942f4e0, 21 Sep), fixed snapshot writes (31fad50, 22 Sep), and added then removed an unrelated conveyancing folder (ba7b48d, 30 Sep). Read git log on main before trusting this document on the current state of the code.
- The commit hashes above were verified against the live repository on 17 October 2026. Hashes quoted mid-chat went stale once already (the merge rewrote them), so trust main's log over chat memory.
- Supabase free-tier projects pause after inactivity. If the app loads but shows no data, restore the project in the Supabase dashboard.
- The access codes and key labels may have changed since July (see commit 942f4e0). Re-read index.html around lines 340 to 352 before advising anyone on sign-in.
- The staff roster hardcoded at index.html line 312 reflects July 2026; people may have moved on.
- Pull request #1 is merged and closed; the session's subscription to it died with the session.

## 7. What must never be reused from this chat

Kinds and locations only. No values are written here, and none may be copied into Root Innovations work.

- Two operator master keys and the operator code: hardcoded in index.html, around lines 340 to 352, on main. The page is public, so these are visible to anyone who views the page source. Never reuse these codes anywhere else.
- Three hard-wired staff passcodes: the same block of index.html.
- The Supabase project URL and anon public key: index.html lines 284 to 285. Public by design, but they are the handle to the live business database; never point new work at them.
- Live business data: client records, deals, premiums, staff PINs and sign-in logs in the Supabase project behind the app, plus roughly 40 KB of seeded deal, portfolio and house-account data with real client names hardcoded at index.html line 354. All of it is employer data. The zip package has all of this stripped.
- A client fleet insurance proposal PDF uploaded into the chat: client name, premium schedules and broker details. It exists only in the chat's uploads.
- The staff roster with full names: index.html line 312, and staff names through the chat record.
- Personal identifiers in the chat record: Anné's personal and work email addresses and her GitHub username.

## 8. Lessons

- Production hosting hung off one personal GitHub account, and one deletion took the site down for the whole team. A second organisation owner and a one-page recovery runbook would have made it a non-event. The second owner is still missing; add one.
- Access codes shipped in public page source is a conscious trade-off for a free internal tool. It is not a pattern to sell to a paying client.
- Deliverables that lived only in chat (the outage messages, the deal message) were lost when the chat compacted. Save anything worth keeping as a file the moment it is produced.
- Commit hashes recorded mid-chat went stale after the merge rewrote history. Record hashes from main after merging, or rely on commit messages and dates.
- The sandbox could not load the public site, so "is it up" had to be answered from two sources: the deploy API plus a human on a phone. Build that double check into any future outage work.
- Real client data sat hardcoded inside the app source (the seed block). Data belongs in the database, not in code; it made the public page riskier and this handover's stripping job harder.
