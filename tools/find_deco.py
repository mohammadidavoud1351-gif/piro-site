import os, sys, shutil
sys.stdout.reconfigure(encoding='utf-8')

base = r'F:\Content\Photos\Products'

MAPPING = {
    'tehran':    ['Sofa - Tehran 1 - 2534', 'Sofa - Tehran 2.5 - 2501'],
    'gordo':     [],
    'palma':     ['Sofa - Palma 1 - 2548', 'Sofa - Palma 2 - 2549'],
    'hermosa':   ['Sofa - Hermosa 1 - 2583', 'Sofa - Hermosa 2 - 2584', 'Sofa - Hermosa 3'],
    'shito':     ['Sofa - Shito 1 - 2535', 'Sofa - Shito 2 - 2520', 'Sofa - Shito 3 - 2521'],
    'muge':      ['Sofa - Muge 1', 'Sofa - Muge 2', 'Sofa - Muge 3'],
    'lam':       ['Lounge Chair - Lam - 2201'],
    'blando':    ['Lounge Chair - Blando - 2205'],
    'zen':       ['Chair - Zen - 2109'],
    'hyrcani':   ['Chair - Hyrcani -  2105'],
    'lean':      ['Chair - Lean - 2113'],
    'alef':      ['Barstool - Aleph - 2401'],
    'leanbar':   ['Barstool - Lean - 2403'],
    'hamdam':    ['Loveseat - Hamdam - 2202', 'Loveseat - Hamdam 3s - 2203'],
    'mogensen':  ['Bench - Mogensen - 2302', 'Bench - Mogensen - 2305'],
    'nosha':     ['Bedstead - Nosha 160 - 4101'],
    'linda':     ['Bedstead - Linda 160 - 4109'],
    'neda':      ['Bedstead - Neda 160 - 4102'],
    'mono':      ['Nightstand - Mono - 3308'],
    'nightmood': ['Nightstand - Mood - 3302'],
    'dresser':   ['Dresser - Mood - 3602'],
    'dresser2':  ['Dresser - Mood Large - 3603'],
    'tana':      ['Clothes Hanger - Tana - 6311'],
    'arasbaran': ['Dining Table - Arasbaran 6 - 5301', 'Dining Table - Arasbaran 8 - 5305'],
    'ox':        ['Dining Table - OX - 5307'],
    'cerca':     ['Dining Table - Cerca 4 - 5310', 'Dining Table - Cerca 8 - 5316'],
    'talk':      ['Dining Table - Talk - 5308'],
    'pianura':   ['Dining Table - pianura - 5319'],
    'kaya':      ['Dining Table -Kaya 4', 'Dining Table -Kaya 6'],
    'en':        ['Coffee Table - EN - 5101'],
    'shonin':    ['Coffee Table - Shonin - 5103'],
    'emi':       ['Coffee Table - EMI - 5105'],
    'sencilla':  ['Coffee Table - Sencilla - 5108', 'Side Table - Sencilla - 5213-14'],
    'shonins':   ['Side Table - Shonin - 5207'],
    'nik':       ['Side Table - Nik - 5205'],
    'mewe':      ['Side Table - MEWE'],
    'alto':      ['Bar table - Alto - 5501'],
    'etude':     ['Writing Desk - Etude'],
    'rain':      ['Writing Desk - Rain - 5412'],
    'sketch':    ['Writing Desk - Sketch - 5401'],
    'sense':     ['Make up table - sense - 3106'],
    'sideboard': ['Sideboard - Mood - 3203', 'Sideboard - Mood - 3204'],
    'console':   ['Console - Mood 110 - 3103', 'Console - Mood 130 - 3102'],
    'largo':     ['TV Console - Largo - 3406'],
    'tvmood':    ['TV Console - Mood 2 - 3407', 'TV Console - Mood 3 - 3401', 'TV Console - Mood 4 - 3403'],
    'cabinet':   ['Cabinet - Mood - 3503'],
    'shoerack':  ['Shoe Rack - Mood - 3507'],
    'mirror':    ['Mirror - Miro - 6210'],
    'roundo':    ['Mirror - Roundo', 'Mirror - image'],
    'sheen':     ['Shelf - Sheen - Short - 2S - 6305', 'Shelf - Sheen - Short - 3S - 6303'],
    'sheentall': ['Shelf - Sheen - Tall - 6301', 'Shelf - Sheen - Wide - 6302'],
    'piso':      ['Shelf - piso - 6312'],
    'rash':      ['Floor Lamp - Rash - 6101'],
    'kido':      ['Floor Lamp - Kido - 6102', 'Floor Lamp - Kido - 6103'],
}

SKIP_SUBDIRS = {'piro','piro 3','piro 4','color','color 2','color 3',
                'dk 4101','dk 4102','digipay','bar','color 4','digi',
                'web','website','site'}

def score_deco(fname, size):
    score = min(size // 1_000_000, 20)
    n = fname.lower().replace('\\', '/').split('/')[-1]
    if ' e.' in n or '_e.' in n or n.endswith('e.jpg'):
        score += 5
    if n.startswith('@_'):
        score += 3
    if n.startswith('_dsc'):
        score += 2
    return score

def collect_candidates(folder_path):
    candidates = []
    try:
        items = sorted(os.listdir(folder_path))
    except:
        return candidates

    for item in items:
        if item.startswith('.'):
            continue
        item_path = os.path.join(folder_path, item)

        if os.path.isfile(item_path) and item.lower().endswith(('.jpg', '.jpeg')):
            n = item.lower()
            if (n.startswith('_dsc') or n.startswith('@_dsc') or n.startswith('@_')
                    or ' e.' in n or '_e.' in n or n.startswith('img_')):
                size = os.path.getsize(item_path)
                if size > 2_000_000:
                    candidates.append((item, size, item_path))

        elif os.path.isdir(item_path):
            sub_lower = item.lower()
            # skip known non-deco subdirs
            if any(sub_lower.startswith(s) for s in SKIP_SUBDIRS):
                continue
            # allow numbered subdirs (photoshoot sessions)
            try:
                subfiles = sorted(os.listdir(item_path))
                for sf in subfiles:
                    if sf.startswith('.'):
                        continue
                    sfp = os.path.join(item_path, sf)
                    if os.path.isfile(sfp) and sf.lower().endswith('.jpg'):
                        size = os.path.getsize(sfp)
                        n = sf.lower()
                        is_deco = (n.startswith('_dsc') or n.startswith('@_') or
                                   ' e.' in n or n[0].isdigit())
                        if size > 3_000_000 and is_deco:
                            candidates.append((f'{item}/{sf}', size, sfp))
            except:
                pass

    return candidates


out_dir = r'C:\Users\user\Desktop\Claude code\piro-site\images\_staging'
os.makedirs(out_dir, exist_ok=True)

plan = {}

for pid, folders in MAPPING.items():
    candidates = []
    for folder in folders:
        fp = os.path.join(base, folder)
        if os.path.exists(fp):
            candidates.extend(collect_candidates(fp))

    candidates.sort(key=lambda x: score_deco(x[0], x[1]), reverse=True)

    # Deduplicate by basename
    seen = set()
    unique = []
    for fname, size, fpath in candidates:
        bname = os.path.basename(fname).lower()
        if bname not in seen:
            seen.add(bname)
            unique.append((fname, size, fpath))

    # We need up to 3 decorative candidates (img2 uses the best, img3 and img4 use next 2)
    # But img2 was already picked - here we pick top 3 and let resize script handle order
    top3 = unique[:3]
    plan[pid] = top3

print('STAGING PLAN:')
total = 0
no_images = []
for pid, items in plan.items():
    if not items:
        no_images.append(pid)
        print(f'  {pid}: NO IMAGES')
        continue
    for i, (fname, size, fpath) in enumerate(items):
        suffix = i + 2  # img2, img3, img4
        dest = f'{pid}-{suffix}.jpg'
        mb = size // 1_000_000
        print(f'  {pid}-{suffix}: {os.path.basename(fname)} ({mb}MB) -> {dest}')
        shutil.copy2(fpath, os.path.join(out_dir, dest))
        total += 1

print(f'\nTotal staged: {total}')
print(f'No source images: {no_images}')
