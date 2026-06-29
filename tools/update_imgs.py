"""
Update imgs[] and alts[] in product.html PRODUCTS object.
Rules:
  img1 = studio photo  (alts: existing or 'نمای استودیو')
  img2 = decorative 1  (alts: existing or 'در فضای واقعی')
  img3 = decorative 2  (alts: 'جزئیات چوب و ساخت')
  img4 = decorative 3  (alts: 'زاویه دیگر — {en name}')
"""

import re, os, sys
sys.stdout.reconfigure(encoding='utf-8')

html_path = r'C:\Users\user\Desktop\Claude code\piro-site\product.html'
images_dir = r'C:\Users\user\Desktop\Claude code\piro-site\images'

# Determine available image counts per product
PRODUCTS = [
    'tehran','gordo','palma','hermosa','shito','muge','lam','blando','zen','hyrcani',
    'lean','alef','leanbar','hamdam','mogensen','nosha','linda','neda','mono','nightmood',
    'dresser','dresser2','tana','arasbaran','ox','cerca','talk','pianura','kaya','en',
    'shonin','emi','sencilla','shonins','nik','mewe','alto','etude','rain','sketch',
    'sense','sideboard','console','largo','tvmood','cabinet','shoerack','mirror',
    'roundo','sheen','sheentall','piso','rash','kido',
]

def available_imgs(pid):
    imgs = []
    img1 = f'{pid}.jpg'
    if os.path.exists(os.path.join(images_dir, img1)):
        imgs.append(img1)
    for n in range(2, 5):
        fn = f'{pid}-{n}.jpg'
        if os.path.exists(os.path.join(images_dir, fn)):
            imgs.append(fn)
    return imgs

# Build replacement map
img_map = {pid: available_imgs(pid) for pid in PRODUCTS}

with open(html_path, encoding='utf-8') as f:
    content = f.read()

def replace_product_imgs(content, pid, new_imgs):
    # Pattern: imgs:[...] inside the product block
    # We also need to update alts:[...]
    # Strategy: find the product block, then update imgs and alts

    # Find product block start
    block_start_pat = rf"    {re.escape(pid)}: \{{"
    m = re.search(block_start_pat, content)
    if not m:
        print(f'  WARNING: {pid} not found in PRODUCTS')
        return content

    # Find the imgs:['...'] pattern in this block
    # Look forward from the product start
    block_pos = m.start()
    # Find the next closing }, which ends this product block
    # Scan forward to find balanced braces
    depth = 0
    block_end = block_pos
    for i in range(block_pos, min(block_pos + 3000, len(content))):
        if content[i] == '{':
            depth += 1
        elif content[i] == '}':
            depth -= 1
            if depth == 0:
                block_end = i + 1
                break

    block = content[block_pos:block_end]

    # Build new imgs array string
    imgs_str = ','.join(f"'{img}'" for img in new_imgs)
    new_imgs_line = f"imgs:[{imgs_str}]"

    # Build new alts array
    # Extract existing alts
    alts_match = re.search(r"alts:\[([^\]]+)\]", block)
    if alts_match:
        existing_alts_str = alts_match.group(1)
        # Parse existing alts
        existing_alts = re.findall(r"'([^']*)'", existing_alts_str)
    else:
        existing_alts = []

    # Build new alts to match new_imgs count
    n = len(new_imgs)
    new_alts = []
    for i in range(n):
        if i < len(existing_alts):
            new_alts.append(existing_alts[i])
        elif i == 1:
            new_alts.append(f'{pid} — در فضای واقعی')
        elif i == 2:
            new_alts.append(f'{pid} — جزئیات چوب راش')
        elif i == 3:
            new_alts.append(f'{pid} — زاویه دیگر')

    alts_str = ','.join(f"'{a}'" for a in new_alts)
    new_alts_line = f"alts:[{alts_str}]"

    # Replace in block
    new_block = re.sub(r"imgs:\[[^\]]+\]", new_imgs_line, block)
    if alts_match:
        new_block = re.sub(r"alts:\[[^\]]+\]", new_alts_line, new_block)

    return content[:block_pos] + new_block + content[block_end:]


for pid in PRODUCTS:
    imgs = img_map[pid]
    if not imgs:
        print(f'  SKIP {pid}: no images found')
        continue
    content = replace_product_imgs(content, pid, imgs)
    print(f'  {pid}: {imgs}')

with open(html_path, 'w', encoding='utf-8') as f:
    f.write(content)

print(f'\nDone. Updated {len(PRODUCTS)} products.')
