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

"""Asset path normalization for EPUB conversion."""

import os
import re


def _resolve_local_asset(clean_path: str, static_dir: str, public_dir: str = "") -> str | None:
    """Resolve an absolute site path to an existing local file for pandoc."""
    stripped = clean_path.lstrip("/")
    candidates: list[str] = [
        os.path.join(static_dir, stripped),
    ]

    if public_dir:
        candidates.append(os.path.join(public_dir, stripped))

    # Some localized tutorial pages reference /docs/tutorials/... assets that
    # exist only in English source content. Fall back to those files.
    basics_prefix = "docs/tutorials/kubernetes-basics/public/images/"
    if stripped.startswith(basics_prefix):
        filename = os.path.basename(stripped)
        website_dir = os.path.dirname(static_dir)
        candidates.append(
            os.path.join(
                website_dir,
                "content",
                "en",
                "docs",
                "tutorials",
                "kubernetes-basics",
                "public",
                "images",
                filename,
            )
        )

    for candidate in candidates:
        if os.path.exists(candidate):
            return candidate
    return None


def rewrite_image_paths(doc_html: str, static_dir: str, public_dir: str = "") -> str:
    """Rewrite absolute image paths to local filesystem paths for pandoc."""

    def fix_src(match: re.Match[str]) -> str:
        attr = match.group(1)
        quote = match.group(2)
        path = match.group(3)
        clean_path = path.split("?")[0]
        if clean_path.startswith(("http://", "https://", "data:")):
            return match.group(0)
        if clean_path.startswith("/"):
            resolved_path = _resolve_local_asset(clean_path, static_dir, public_dir)
            if resolved_path:
                return f"{attr}={quote}{resolved_path}{quote}"
        return match.group(0)

    return re.sub(r'((?:src|data-src))=(["\'])([^"\']*)\2', fix_src, doc_html)
