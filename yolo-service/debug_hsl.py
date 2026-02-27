def hsl(r, g, b):
    rf, gf, bf = r/255, g/255, b/255
    cmax, cmin = max(rf,gf,bf), min(rf,gf,bf)
    delta = cmax - cmin
    l = (cmax + cmin) / 2
    s = 0 if delta == 0 else delta / (1 - abs(2*l - 1))
    if delta == 0: h = 0
    elif cmax == rf: h = 60 * (((gf-bf)/delta) % 6)
    elif cmax == gf: h = 60 * (((bf-rf)/delta) + 2)
    else: h = 60 * (((rf-gf)/delta) + 4)
    if h < 0: h += 360
    return round(h,1), round(s,2), round(l,2)

cases = [('olive jacket', 107, 142, 35), ('mustard yellow', 255, 219, 88), ('teal', 0, 128, 128)]
for label, r, g, b in cases:
    h, s, l = hsl(r, g, b)
    print(f'{label}: h={h} s={s} l={l}')
