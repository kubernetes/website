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

# Mapping: mainland variant -> Taiwan variant
# Order matters: more specific patterns should come first
MAPPING = [
    # Server related
    (r'服務器', '伺服器'),
    (r'服务器', '伺服器'),
    # User related
    (r'用戶', '使用者'),
    (r'用户', '使用者'),
    # Command line
    (r'命令行', '命令列'),
    # Configuration
    (r'配置', '設定'),
    # Cluster
    (r'集羣', '叢集'),
    (r'集群', '叢集'),
    # Network
    (r'網絡', '網路'),
    (r'网络', '網路'),
    # Log
    (r'日志', '日誌'),
    # Image - specific first
    (r'容器鏡像', '容器映像檔'),
    (r'容器镜像', '容器映像檔'),
    (r'鏡像', '映像檔'),
    (r'镜像', '映像檔'),
    # Storage
    (r'存儲', '儲存'),
    (r'存储', '儲存'),
    # File
    (r'文件', '檔案'),
    # Software
    (r'軟件', '軟體'),
    (r'软件', '軟體'),
    # Program (程序 -> 程式, but 进程 -> 程序 in Taiwan)
    # Note: We only replace 程序 when it means "program", not "process"
    # This is context-dependent, so we'll be conservative
    (r'程序', '程式'),
    # Thread
    (r'線程', '執行緒'),
    (r'线程', '執行緒'),
    # Interface
    (r'接口', '介面'),
    # Database
    (r'數據庫', '資料庫'),
    (r'数据库', '資料庫'),
    (r'數據', '資料'),
    (r'数据', '資料'),
    # Information
    (r'信息', '資訊'),
    (r'信息', '資訊'),
    # Default
    (r'默認', '預設'),
    (r'默认', '預設'),
    # Format (same in both)
    # (r'格式', '格式'),  # No change needed
    # Check/Verify
    (r'检查', '檢查'),
    (r'验证', '驗證'),
    # Development
    (r'开发', '開發'),
    # License
    (r'許可證', '授權'),
    (r'许可证', '授權'),
    # Link
    (r'链接', '連結'),
    # Load
    (r'负载', '負載'),
    # Resource
    (r'资源', '資源'),
    # Component
    (r'组件', '元件'),
    # System
    (r'系统', '系統'),
    # Environment
    (r'环境', '環境'),
    # Application
    (r'应用', '應用'),
    # Service
    (r'服务', '服務'),
    # Video
    (r'視頻', '影片'),
    (r'视频', '影片'),
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
