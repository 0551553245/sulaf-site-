"""Turn the static export (.next-preview) into self-contained HTML pages for a
private preview link: CSS, JS, fonts and images are inlined, links made relative.

    PREVIEW_EXPORT=1 NEXT_PUBLIC_INLINE_WEAVE=1 npx next build
    python3 scripts/preview.py <out-dir>
"""
import base64
import io
import re
import sys
from pathlib import Path

from PIL import Image

SRC = Path(__file__).resolve().parent.parent / ".next-preview"
OUT = Path(sys.argv[1])
OUT.mkdir(parents=True, exist_ok=True)


def data_uri(mime, raw):
    return f"data:{mime};base64,{base64.b64encode(raw).decode()}"


def media_uri(path):
    im = Image.open(path)
    # Bottles are tall cut-outs: cap their height; photos are already small.
    if im.height > 1100:
        im = im.resize((round(im.width * 1100 / im.height), 1100), Image.LANCZOS)
    buf = io.BytesIO()
    im.save(buf, "WEBP", quality=82)
    return data_uri("image/webp", buf.getvalue())


MEDIA = {
    "/media/" + p.relative_to(SRC / "media").as_posix(): media_uri(p)
    for p in (SRC / "media").rglob("*.webp")
}


def inline_media(text):
    for path, uri in MEDIA.items():
        text = text.replace(path, uri)
    return text


def css_with_fonts(css):
    def font(m):
        return f"url({data_uri('font/woff2', (SRC / m.group(1).lstrip('/')).read_bytes())})"

    return re.sub(r"url\((/_next/static/media/[^)]+\.woff2)\)", font, css)


def build(src_name, out_name):
    html = (SRC / src_name).read_text()

    # Preloads, icons and the nomodule polyfill aren't needed once inlined.
    html = re.sub(r'<link rel="preload"[^>]*/>', "", html)
    html = re.sub(r'<link rel="(icon|apple-touch-icon)"[^>]*/>', "", html)
    html = re.sub(r'<script src="[^"]*polyfills[^"]*"[^>]*></script>', "", html)

    # Stylesheet: keep the tag React expects, add the CSS inline beside it.
    def style(m):
        css = css_with_fonts((SRC / m.group(1).lstrip("/")).read_text())
        return m.group(0) + "<style>" + css + "</style>"

    html = re.sub(r'<link rel="stylesheet" href="(/_next/static/css/[^"]+)"[^>]*/>', style, html)

    # Scripts: inline each chunk in place.
    def script(m):
        js = inline_media((SRC / m.group(1).lstrip("/")).read_text())
        return "<script>" + js.replace("</script", "<\\/script") + "</script>"

    html = re.sub(r'<script src="(/_next/static/chunks/[^"]+)"[^>]*></script>', script, html)

    html = inline_media(html)
    # Language switch and logo links between the two preview pages.
    html = html.replace('href="/en"', 'href="en.html"').replace('href="/"', 'href="ar.html"')
    (OUT / out_name).write_text(html)
    return len(html)


print("ar.html", build("index.html", "ar.html"))
print("en.html", build("en.html", "en.html"))
