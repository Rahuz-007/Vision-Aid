import sys
sys.path.insert(0, '.')

# Pull just the simplify_color function from app.py
with open('app.py', 'r') as f:
    code = f.read()

start = code.index('def simplify_color')
end = code.index('\n\n\n# Initialize Flask')
exec(code[start:end])

tests = [
    ('Pure Red',        255,   0,   0),
    ('Pure Green',        0, 255,   0),
    ('Pure Blue',         0,   0, 255),
    ('White',           255, 255, 255),
    ('Black',             0,   0,   0),
    ('Orange',          255, 165,   0),
    ('Pink shirt',      255, 182, 193),
    ('Navy jeans',       21,  96, 189),
    ('Brown skin tone', 141,  85,  36),
    ('Olive jacket',    107, 142,  35),
    ('Light skin',      255, 219, 172),
    ('Gray shirt',      128, 128, 128),
    ('Dark charcoal',    54,  69,  79),
    ('Mustard yellow',  255, 219,  88),
    ('Burgundy',        128,   0,  32),
    ('Dark brown hair',  89,  39,  21),
    ('Lavender',        230, 230, 250),
    ('Teal',              0, 128, 128),
    ('Hot pink',        255, 105, 180),
    ('Sky blue',        135, 206, 235),
]
print(f'{"Input":<22}   {"Simple Name"}')
print('-' * 44)
for label, r, g, b in tests:
    print(f'{label:<22} -> {simplify_color(r, g, b)}')
