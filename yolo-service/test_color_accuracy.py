import csv, math
from pathlib import Path

colors = []
with open('colors.csv', 'r', encoding='utf-8') as f:
    for row in csv.reader(f):
        if len(row) >= 6:
            try:
                colors.append({'name': row[1].strip().strip('"'), 'r': int(row[3]), 'g': int(row[4]), 'b': int(row[5])})
            except: pass

def nearest(r, g, b):
    best, bd = colors[0], float('inf')
    for c in colors:
        d = (r - c['r'])**2 + (g - c['g'])**2 + (b - c['b'])**2
        if d < bd:
            bd = d; best = c
    return best['name'], math.sqrt(bd)

tests = [
    ('Pure Red',          255,   0,   0),
    ('Pure Green',          0, 255,   0),
    ('Pure Blue',           0,   0, 255),
    ('White',             255, 255, 255),
    ('Black',               0,   0,   0),
    ('Yellow',            255, 255,   0),
    ('Orange',            255, 165,   0),
    ('Pink',              255, 182, 193),
    ('Navy Blue',           0,   0, 128),
    ('Brown skin tone',   141,  85,  36),
    ('Denim / Jeans',      21,  96, 189),
    ('Olive green',       107, 142,  35),
    ('Light skin',        255, 219, 172),
    ('Gray / Shirt',      128, 128, 128),
    ('Dark Charcoal',      54,  69,  79),
    ('Cream / Beige',     255, 253, 208),
    ('Dark Brown hair',    89,  39,  21),
    ('Mustard Yellow',    255, 219,  88),
    ('Burgundy',          128,   0,  32),
    ('Coral',             255, 127,  80),
]

print(f'Loaded {len(colors)} colors from colors.csv\n')
print(f'{"Input Color":<25} {"Detected Name":<35} {"Distance":>8}  Result')
print('-' * 78)

good, okay, bad = 0, 0, 0
for label, r, g, b in tests:
    name, dist = nearest(r, g, b)
    if dist < 25:
        result = 'ACCURATE'; good += 1
    elif dist < 55:
        result = 'CLOSE   '; okay += 1
    else:
        result = 'INACCURATE'; bad += 1
    print(f'{label:<25} {name:<35} {dist:>8.1f}  {result}')

print()
print(f'Results: {good} accurate, {okay} close, {bad} inaccurate out of {len(tests)} tests')
accuracy = (good + okay * 0.5) / len(tests) * 100
print(f'Overall accuracy score: {accuracy:.0f}%')
