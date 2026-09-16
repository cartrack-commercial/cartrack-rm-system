#!/usr/bin/env python3
"""Build three variants of the transfer-process guide, differing only in how
the DRAFTING of the deed is handled. Maryke picks one; the winner gets rebuilt
without the option marker."""
import re, subprocess, sys, os

BASE = 'transfer-process.html'
CHROME = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome'
src = open(BASE).read()

# ---- split the template into reusable pieces -------------------------------
p1_head, rest      = src.split('  <div class="steps">\n', 1)
p1_steps, rest     = rest.split('  </div>\n\n  <div class="foot">', 1)
p1_tail, rest      = ('  </div>\n\n  <div class="foot">' + rest).split('<!-- ================= PAGE 2 ================= -->', 1)
p2_open, rest      = rest.split('<div class="steps" style="border-top:none;margin-top:0;">\n', 1)
p2_steps, p2_tail  = rest.split('  </div>\n\n  <div class="two">', 1)
p2_tail            = '  </div>\n\n  <div class="two">' + p2_tail

def steps_of(block):
    """Return list of (number, html) for each .step div."""
    out, depth, cur = [], 0, []
    for line in block.splitlines(keepends=True):
        if '<div class="step"' in line and depth == 0:
            cur, depth = [line], 1
            continue
        if depth:
            cur.append(line)
            depth += line.count('<div') - line.count('</div>')
            if depth <= 0:
                html = ''.join(cur)
                n = re.search(r'<div class="n">(\d+)</div>', html).group(1)
                out.append([n, html]); depth = 0
    return out

steps = steps_of(p1_steps) + steps_of(p2_steps)
assert len(steps) == 9, f'expected 9 steps, found {len(steps)}'

def set_title(html, title):
    return re.sub(r'(<div class="t">).*?(</div>)', lambda m: m.group(1)+title+m.group(2), html, count=1)

def set_desc(html, desc):
    return re.sub(r'(<div class="d">).*?(</div>)\n', lambda m: m.group(1)+desc+m.group(2)+'\n', html, count=1, flags=re.S)

def set_when(html, when):
    return re.sub(r'(<div class="when">).*?(</div>)', lambda m: m.group(1)+when+m.group(2), html, count=1)

DRAFT_DESC = ("We draw the deed of transfer itself — the new title deed that will be registered in the "
              "purchaser's name — together with the supporting deeds. A draft is sent to the bond attorney "
              "so that the purchaser's bond can be prepared to match it exactly, and to the cancellation "
              "attorney so that the existing bond can be cancelled against it. Any discrepancy between the "
              "three sets of deeds is corrected now rather than at the Deeds Office.")

# ---- the three variants ----------------------------------------------------
def variant(opt):
    s = [ [n, h] for n, h in (x[:] for x in steps) ]   # deep-ish copy

    if opt == 1:                       # nine steps; drafting named at step 6
        s[5][1] = set_title(s[5][1], 'Drafting the deed and preparation for lodgement')
        s[5][1] = set_desc(s[5][1],
            "We draw the deed of transfer — the new title deed to be registered in the purchaser's name — and "
            "send a draft to the bond attorney and the cancellation attorney so that all three sets of deeds "
            "agree with one another. With the signed documents, the transfer duty receipt, the clearance "
            "certificates and the guarantees in hand, the deeds are then prepared for lodgement and we arrange "
            "that all three sets are lodged at the Deeds Office on the same day — they must be registered "
            "simultaneously.")
        split = 6

    elif opt == 2:                     # ten steps; drafting stands on its own
        new = set_when(set_desc(set_title(s[3][1], 'Drawing the deed of transfer'), DRAFT_DESC), 'Week 3–4')
        new = re.sub(r'<div class="you">.*?</div>\n', '', new, flags=re.S)     # no client action here
        s.insert(3, ['x', new])
        for i, row in enumerate(s):                                            # renumber 1..10
            row[1] = re.sub(r'<div class="n">\w+</div>', f'<div class="n">{i+1}</div>', row[1], count=1)
        s[6][1] = set_desc(s[6][1],
            "With the signed documents, the transfer duty receipt, the clearance certificates and the guarantees "
            "in hand, the deeds are prepared for lodgement. We arrange with the bond attorney and the cancellation "
            "attorney that all three sets of deeds are lodged at the Deeds Office on the same day — they must be "
            "registered simultaneously.")
        split = 7

    else:                              # three: drafting named early, at the document stage
        s[2][1] = set_title(s[2][1], 'Drafting the deed and the transfer documents')
        s[2][1] = set_desc(s[2][1],
            "We draw the deed of transfer — the new title deed to be registered in the purchaser's name — and "
            "prepare the supporting documents: the power of attorney to pass transfer, the declarations by both "
            "parties and the transfer duty declarations. A draft of the deed goes to the bond attorney so that "
            "the purchaser's bond is prepared to match it. You will be asked to attend at our offices to sign, "
            "or we will arrange signature through a correspondent if you are not in Pretoria.")
        s[5][1] = set_desc(s[5][1],
            "With the signed documents, the transfer duty receipt, the clearance certificates and the guarantees "
            "in hand, the deeds are checked against the bond and cancellation deeds and prepared for lodgement. "
            "We arrange that all three sets are lodged at the Deeds Office on the same day — they must be "
            "registered simultaneously.")
        split = 6

    page1 = ''.join(h for _, h in s[:split])
    page2 = ''.join(h for _, h in s[split:])
    page2 = re.sub(r'<div class="step">', '<div class="step" style="border-top:.25mm solid var(--line);">',
                   page2, count=1)
    page2 = page2.replace('<div class="step" style="border-top:.25mm solid var(--line);"> style=', '<div class="step" style=')
    return (p1_head + '  <div class="steps">\n' + page1 + p1_tail
            + '<!-- ================= PAGE 2 ================= -->' + p2_open
            + '<div class="steps" style="border-top:none;margin-top:0;">\n' + page2 + p2_tail)

TIGHTEN = """
<style>
  .step {{ padding:{pad1}mm 0 {pad2}mm; }}
  .step .d {{ line-height:{lh}; }}
  p {{ line-height:{plh}; }}
  .card p, .card li {{ line-height:{clh}; }}
  .note p {{ line-height:{clh}; }}
</style>
"""

def measure(path):
    js = ('<script>onload=()=>{const q=[...document.querySelectorAll(".sheet")]'
          '.map(e=>(e.scrollHeight/3.779528).toFixed(1));document.title=q.join("|")}</script></body>')
    open('_probe.html','w').write(open(path).read().replace('</body>', js))
    out = subprocess.run([CHROME,'--headless','--disable-gpu','--no-sandbox','--disable-dev-shm-usage',
                          '--virtual-time-budget=9000','--dump-dom',f'file://{os.getcwd()}/_probe.html'],
                         capture_output=True, text=True).stdout
    os.remove('_probe.html')
    m = re.search(r'<title>([\d.|]+)</title>', out)
    return [float(x) for x in m.group(1).split('|')] if m else [999]

for opt in (1, 2, 3):
    html = variant(opt)
    path = f'_opt{opt}.html'
    for lvl in range(0, 9):                       # auto-fit: tighten until both sheets fit
        tuned = html.replace('</head>', TIGHTEN.format(
            pad1=round(3.1-0.22*lvl, 2), pad2=round(2.9-0.22*lvl, 2),
            lh=round(1.52-0.017*lvl, 3), plh=round(1.56-0.017*lvl, 3),
            clh=round(1.50-0.015*lvl, 3)) + '</head>') if lvl else html
        open(path,'w').write(tuned)
        h = measure(path)
        if max(h) <= 296.7:
            break
    pdf = f'Transfer Process - OPTION {opt}.pdf'
    subprocess.run([CHROME,'--headless','--disable-gpu','--no-sandbox','--disable-dev-shm-usage',
                    '--no-pdf-header-footer','--virtual-time-budget=12000',
                    f'--print-to-pdf={pdf}', f'file://{os.getcwd()}/{path}'],
                   capture_output=True)
    pages = subprocess.run(['pdfinfo', pdf], capture_output=True, text=True).stdout
    pages = re.search(r'Pages:\s+(\d+)', pages).group(1)
    nsteps = len(re.findall(r'<div class="n">\d+</div>', open(path).read()))
    print(f'option {opt}: {nsteps} steps · fit level {lvl} · heights {h} · {pages} pages')
