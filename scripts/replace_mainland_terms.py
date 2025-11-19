#!/usr/bin/env python3
"""
Replace mainland Chinese terms with Taiwan-specific terms in content/zh-tw.
This script skips fenced code blocks (``` ```), and inline code spans (`...`) to avoid changing code samples.

Usage: python3 scripts/replace_mainland_terms.py
"""
from pathlib import Path
import re
import sys

ROOT = Path('content/zh-tw')
EXTS = {'.md', '.markdown', '.html', '.txt', '.yml', '.yaml'}

# Conservative mapping: mainland variant -> Taiwan variant
MAPPING = [
    (r'伺服器', '伺服器'),
    (r'服務器', '伺服器'),
    (r'服务器', '伺服器'),
    (r'用戶', '使用者'),
    (r'用户', '使用者'),
    (r'命令行', '命令列'),
    (r'配置', '設定'),
    (r'集羣', '叢集'),
    (r'集群', '叢集'),
    (r'網絡', '網路'),
    (r'网络', '網路'),
    (r'日志', '日誌'),
    (r'日志', '日誌'),
    # Prefer explicit mapping for container image
    (r'容器鏡像', '容器映像檔'),
    (r'容器镜像', '容器映像檔'),
    # Generic 鏡像 fallback -> 映像檔 (apply after container mapping)
    (r'鏡像', '映像檔'),
    (r'镜像', '映像檔'),
    (r'檢查', '檢查'),
    (r'检查', '檢查'),
    (r'開發', '開發'),
    (r'开发', '開發'),
]

FENCED_RE = re.compile(r'(```(?:.|\n)*?```)', re.MULTILINE)
INLINE_CODE_RE = re.compile(r'(`[^`]+`)', re.MULTILINE)


def transform_text(text: str) -> str:
    # Extract fenced code blocks and inline code, replace them with placeholders
    fenced_blocks = {}
    def fence_repl(m):
        key = f"__FENCE_{len(fenced_blocks)}__"
        fenced_blocks[key] = m.group(1)
        return key

    text_no_fence = FENCED_RE.sub(fence_repl, text)

    inline_blocks = {}
    def inline_repl(m):
        key = f"__INLINE_{len(inline_blocks)}__"
        inline_blocks[key] = m.group(1)
        return key

    text_no_code = INLINE_CODE_RE.sub(inline_repl, text_no_fence)

    # Apply mappings on the remaining text
    new = text_no_code
    for pat, repl in MAPPING:
        new = re.sub(pat, repl, new)

    # Restore inline code then fenced blocks
    for k, v in inline_blocks.items():
        new = new.replace(k, v)
    for k, v in fenced_blocks.items():
        new = new.replace(k, v)

    return new


def process_file(path: Path) -> bool:
    try:
        text = path.read_text(encoding='utf-8')
    except Exception:
        return False
    new_text = transform_text(text)
    if new_text != text:
        path.write_text(new_text, encoding='utf-8')
        return True
    return False


def main():
    if not ROOT.exists():
        print(f"Directory {ROOT} not found.")
        sys.exit(1)
    modified = []
    for p in ROOT.rglob('*'):
        if p.is_file() and p.suffix in EXTS:
            changed = process_file(p)
            if changed:
                modified.append(str(p))
    print(f"Modified {len(modified)} files")
    for m in modified[:200]:
        print(m)


if __name__ == '__main__':
    main()
