#!/usr/bin/env python3

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

"""
Validate heading hierarchy in Markdown files.

This script checks for:
- Skipped heading levels (e.g., H1 -> H3 skipping H2)
- Multiple H1 headings (there should be only one per page)
- Headings that start at a level other than H1

Usage:
    python3 check-markdown.py <file.md>

Exit codes:
    0 - No issues found
    N - Number of heading hierarchy issues found
"""

import re
import sys
from pathlib import Path


def validate_heading_hierarchy(filepath: str) -> int:
    """
    Validate heading hierarchy in a Markdown file.

    Args:
        filepath: Path to the Markdown file to validate

    Returns:
        Number of heading hierarchy errors found
    """
    errors = 0
    headings = []

    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
    except (IOError, UnicodeDecodeError) as e:
        print(f"Error reading file {filepath}: {e}")
        return 1

    # Find all ATX-style headings (# Heading)
    # Be careful not to match code blocks or inline code
    lines = content.split('\n')
    in_code_block = False

    for line_num, line in enumerate(lines, 1):
        # Track code blocks
        if line.strip().startswith('```'):
            in_code_block = not in_code_block
            continue

        # Skip code blocks
        if in_code_block:
            continue

        # Skip inline code (simple heuristic)
        if line.strip().startswith('`'):
            continue

        # Match ATX headings: lines starting with 1-6 # characters followed by space
        match = re.match(r'^(#{1,6})\s+(.+)$', line)
        if match:
            level = len(match.group(1))
            text = match.group(2).strip()
            headings.append((level, text, line_num))

    # Also check for Setext-style headings (underlined)
    # H1: ======
    # H2: ------
    for i in range(len(lines) - 1):
        current_line = lines[i]
        next_line = lines[i + 1]

        # Skip if in code block or if lines are empty
        if not current_line.strip() or not next_line.strip():
            continue

        # Check for H1 (=====)
        if re.match(r'^=+\s*$', next_line) and not current_line.startswith('#'):
            headings.append((1, current_line.strip(), i + 1))
        # Check for H2 (-----)
        elif re.match(r'^-+\s*$', next_line) and not current_line.startswith('#'):
            headings.append((2, current_line.strip(), i + 1))

    # Sort by line number
    headings.sort(key=lambda x: x[2])

    # Validate heading hierarchy
    prev_level = 0
    h1_count = 0

    for level, text, line_num in headings:
        # Count H1 headings
        if level == 1:
            h1_count += 1
            if h1_count > 1:
                print(f"\033[0;31m[HEADING_H1]\033[0m {filepath}:{line_num} - Multiple H1 headings found (this is H1 #{h1_count})")
                errors += 1

        # Check for skipped levels
        if prev_level > 0 and level > prev_level + 1:
            skipped = level - prev_level - 1
            skip_text = "level" if skipped == 1 else "levels"
            print(f"\033[0;31m[HEADING_SKIP]\033[0m {filepath}:{line_num} - Heading skips {skipped} {skip_text} (H{prev_level} -> H{level}: '{text}')")
            errors += 1
            prev_level = level  # Update prev_level to current to avoid cascading errors
        else:
            prev_level = level

    # Check if first heading is not H1 (only warn for regular docs, not _index.md files)
    if headings and headings[0][0] != 1:
        level, text, line_num = headings[0]
        # Only show warning if not an _index.md file (which often use H2 for frontmatter-like content)
        if not filepath.endswith('_index.md'):
            print(f"\033[0;33m[HEADING_FIRST]\033[0m {filepath}:{line_num} - First heading is H{level}, not H1: '{text}'")
        # This is a warning, not counted as error

    return errors


def main():
    if len(sys.argv) != 2:
        print(f"Usage: {sys.argv[0]} <file.md>")
        print("\nValidate heading hierarchy in Markdown files.")
        print("\nExit codes:")
        print("  0 - No issues found")
        print("  N - Number of heading hierarchy issues found")
        sys.exit(1)

    filepath = sys.argv[1]

    if not Path(filepath).exists():
        print(f"Error: File not found: {filepath}")
        sys.exit(1)

    if not filepath.endswith('.md'):
        print(f"Warning: File does not have .md extension: {filepath}")

    errors = validate_heading_hierarchy(filepath)

    # Exit with number of errors (used by shell script)
    sys.exit(errors)


if __name__ == '__main__':
    main()
