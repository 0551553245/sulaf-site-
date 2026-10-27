"""Cut the six bottle views out of a 2x3 rotation sheet (0°, 45°, 90° / 135°, 180°, 225°).

Sheets with a real alpha channel are used as-is. Sheets with a baked-in
checkerboard are cut with GrabCut, seeded from the bottle's colored pixels.

    python3 scripts/extract_views.py <sheet> <flavor-id> <out-dir>
"""
import sys
from pathlib import Path

import cv2
import numpy as np
from PIL import Image
from scipy import ndimage as nd

VIEWS = ["000", "045", "090", "135", "180", "225"]
HEIGHT = 900  # output height in px, bottles share one scale


def components(mask):
    lab, _ = nd.label(mask)
    boxes = []
    for o in nd.find_objects(lab):
        y, x = o
        if (y.stop - y.start) > 400 and (x.stop - x.start) > 120:
            boxes.append((x.start, y.start, x.stop, y.stop))
    return sorted(boxes, key=lambda b: (b[1] // 400, b[0]))


def cut_alpha(rgb, seed):
    """GrabCut around the bottle, seeded with its colored (non-grey) pixels."""
    mask = np.full(seed.shape, cv2.GC_BGD, np.uint8)
    filled = nd.binary_fill_holes(nd.binary_closing(seed, iterations=4))
    mask[nd.binary_dilation(filled, iterations=14)] = cv2.GC_PR_BGD
    mask[nd.binary_dilation(filled, iterations=4)] = cv2.GC_PR_FGD
    mask[nd.binary_erosion(filled, iterations=6)] = cv2.GC_FGD
    bgd, fgd = np.zeros((1, 65), np.float64), np.zeros((1, 65), np.float64)
    cv2.grabCut(cv2.cvtColor(rgb, cv2.COLOR_RGB2BGR), mask, None, bgd, fgd, 6, cv2.GC_INIT_WITH_MASK)
    fg = np.isin(mask, [cv2.GC_FGD, cv2.GC_PR_FGD])
    fg = nd.binary_fill_holes(nd.binary_opening(fg, iterations=2))
    lab, n = nd.label(fg)
    if n > 1:  # keep the bottle, drop specks
        sizes = nd.sum(fg, lab, range(1, n + 1))
        fg = lab == (1 + int(np.argmax(sizes)))
    alpha = cv2.GaussianBlur(fg.astype(np.float32), (0, 0), 0.8)
    return (alpha * 255).astype(np.uint8)


def main(sheet, flavor, out):
    out = Path(out)
    out.mkdir(parents=True, exist_ok=True)
    im = Image.open(sheet)
    has_alpha = im.mode == "RGBA" and im.getchannel("A").getextrema()[0] < 10
    rgba = np.array(im.convert("RGBA"))
    rgb = rgba[:, :, :3].copy()
    if has_alpha:
        seed_all = rgba[:, :, 3] > 128
    else:
        x = rgb.astype(int)
        seed_all = ((x.max(2) - x.min(2)) > 30) | (x.mean(2) < 110)
        seed_all = nd.binary_closing(seed_all, iterations=3)
    boxes = components(seed_all)
    assert len(boxes) == 6, f"expected 6 bottles, found {len(boxes)}"
    for view, (x0, y0, x1, y1) in zip(VIEWS, boxes):
        pad = 24
        X0, Y0 = max(0, x0 - pad), max(0, y0 - pad)
        X1, Y1 = min(rgb.shape[1], x1 + pad), min(rgb.shape[0], y1 + pad)
        crop_rgb = rgb[Y0:Y1, X0:X1]
        if has_alpha:
            alpha = rgba[Y0:Y1, X0:X1, 3].copy()
            # Drop anything that isn't the bottle (e.g. angle captions under it).
            lab, n = nd.label(alpha > 40)
            if n > 1:
                sizes = nd.sum(alpha > 40, lab, range(1, n + 1))
                alpha[lab != (1 + int(np.argmax(sizes)))] = 0
        else:
            alpha = cut_alpha(crop_rgb, seed_all[Y0:Y1, X0:X1])
        a = Image.fromarray(np.dstack([crop_rgb, alpha]), "RGBA")
        a = a.crop(a.getchannel("A").point(lambda v: 255 if v > 40 else 0).getbbox())
        a = a.resize((round(a.width * HEIGHT / a.height), HEIGHT), Image.LANCZOS)
        a.save(out / f"{flavor}-{view}.webp", quality=88)
        print(flavor, view, a.size)


if __name__ == "__main__":
    main(*sys.argv[1:4])
