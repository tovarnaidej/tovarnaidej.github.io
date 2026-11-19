"""Flatten design_data/figma_json_export.txt into fig/sections.json (normalised css per node)."""
import json, os, re, sys
SRC = os.path.join(os.environ.get('COMPONENTS', 'D:/projekti_tovarna/components'), 'design_data', 'figma_json_export.txt')
os.makedirs('fig', exist_ok=True)
text = open(SRC, encoding='utf8').read()
parts = re.split(r'(?m)^([^\[\]{}\s"][^\n]*?):?[ \t]*$', text)
SKIP = re.compile(r'(-variable|-collection|-variable-id|-style)$')
out = {}
def norm(v):
    v = str(v)
    while True:
        n = re.sub(r'var\(--[^,()]+,\s*([^()]+)\)', r'\1', v)
        if n == v: break
        v = n
    return re.sub(r'\s*/\*.*?\*/', '', v).strip()
def walk(n, depth, path, acc):
    props = {k: norm(v) for k, v in (n.get('cssProps') or {}).items() if not SKIP.search(k)}
    p = path + [n.get('name', '')]
    acc.append({'depth': depth, 'type': n.get('type'), 'name': n.get('name'), 'path': ' > '.join(p[-3:]),
                'text': n.get('characters') or n.get('text'), 'props': props})
    for c in n.get('children', []): walk(c, depth + 1, p, acc)
for i in range(1, len(parts), 2):
    name, body = parts[i].strip(), parts[i + 1].strip()
    try: tree = json.loads(body)
    except Exception as e:
        print('PARSE-FAIL', name, e); continue
    acc = []
    for n in tree: walk(n, 0, [], acc)
    out[name] = acc
    print(name, len(acc))
json.dump(out, open('fig/sections.json', 'w', encoding='utf8'), ensure_ascii=False)
