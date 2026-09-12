#!/usr/bin/env python3
#
# Copyright 2026 The Kubernetes Authors.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

import argparse
import base64
import os
import shutil
import sys

try:
    from PIL import Image, ImageDraw, ImageFont, ImageOps
    PIL_AVAILABLE = True
except Exception:
    PIL_AVAILABLE = False


def load_font(candidates, size):
    for path in candidates:
        try:
            return ImageFont.truetype(path, size)
        except Exception:
            continue
    return ImageFont.load_default()


def write_fallback_png(path):
    tiny_png = (
        "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8"
        "/x8AAukB9Wf8nNQAAAAASUVORK5CYII="
    )
    with open(path, "wb") as f:
        f.write(base64.b64decode(tiny_png))


def copy_first_raster(sources, output_path):
    for source in sources:
        if source and os.path.isfile(source) and source.lower().endswith((".png", ".jpg", ".jpeg")):
            shutil.copyfile(source, output_path)
            return True
    return False


def generate_cover(release_logo, brand_logo, header_title, version, output_png):
    if not PIL_AVAILABLE:
        if copy_first_raster((release_logo, brand_logo), output_png):
            return
        write_fallback_png(output_png)
        return

    w, h = 1600, 2400
    header_h = 240
    padding = 64
    content_top = header_h + 36
    content_h = h - content_top - padding
    content_w = w - (padding * 2)

    resampling = getattr(Image, "Resampling", Image)
    font_primary = load_font(
        [
            "/Library/Fonts/Helvetica.ttc",
            "/Library/Fonts/Arial.ttf",
            "/System/Library/Fonts/Supplemental/Arial.ttf",
        ],
        56,
    )
    font_secondary = load_font(
        [
            "/Library/Fonts/Helvetica.ttc",
            "/Library/Fonts/Arial.ttf",
            "/System/Library/Fonts/Supplemental/Arial.ttf",
        ],
        42,
    )

    canvas = Image.new("RGB", (w, h), "#f8fafc")
    draw = ImageDraw.Draw(canvas)
    draw.rectangle([(0, 0), (w, header_h)], fill="#eef2ff")
    draw.rectangle([(0, header_h - 2), (w, header_h)], fill="#1d4ed8")

    icon_x = 56
    icon_y = 48
    icon_size = 136
    if brand_logo and os.path.isfile(brand_logo):
        try:
            icon = Image.open(brand_logo).convert("RGBA")
            icon.thumbnail((icon_size, icon_size), resampling.LANCZOS)
            paste_y = icon_y + ((icon_size - icon.height) // 2)
            canvas.paste(icon, (icon_x, paste_y), icon)
        except Exception:
            pass

    text_x = icon_x + icon_size + 30
    draw.text((text_x, 58), "Kubernetes", fill="#0f172a", font=font_primary)
    draw.text((text_x, 128), header_title, fill="#1e293b", font=font_secondary)

    content_logo = None
    if release_logo and os.path.isfile(release_logo):
        try:
            content_logo = Image.open(release_logo).convert("RGB")
        except Exception:
            content_logo = None

    if content_logo is None and brand_logo and os.path.isfile(brand_logo):
        try:
            content_logo = Image.open(brand_logo).convert("RGB")
        except Exception:
            content_logo = None

    if content_logo is not None:
        fitted = ImageOps.contain(content_logo, (content_w, content_h), method=resampling.LANCZOS)
        px = (w - fitted.width) // 2
        py = content_top + ((content_h - fitted.height) // 2)
        canvas.paste(fitted, (px, py))
    else:
        draw.rectangle(
            [(padding, content_top), (w - padding, h - padding)],
            outline="#94a3b8",
            width=4,
        )
        draw.text((padding + 30, content_top + 30), f"Kubernetes {version}", fill="#475569", font=font_secondary)

    canvas.save(output_png, format="PNG", optimize=True)


def parse_args():
    parser = argparse.ArgumentParser(description="Generate branded EPUB cover image.")
    parser.add_argument("--release-logo", default="", help="Path to release artwork image.")
    parser.add_argument("--brand-logo", default="", help="Path to Kubernetes brand logo.")
    parser.add_argument("--header-title", required=True, help="Text shown in the cover header.")
    parser.add_argument("--version", required=True, help="Kubernetes release version.")
    parser.add_argument("--output", required=True, help="Output PNG path.")
    return parser.parse_args()


def main():
    args = parse_args()
    out_dir = os.path.dirname(args.output)
    if out_dir:
        os.makedirs(out_dir, exist_ok=True)

    generate_cover(
        release_logo=args.release_logo,
        brand_logo=args.brand_logo,
        header_title=args.header_title,
        version=args.version,
        output_png=args.output,
    )
    return 0


if __name__ == "__main__":
    sys.exit(main())
