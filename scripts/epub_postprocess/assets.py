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
            stripped = clean_path.lstrip("/")
            static_path = os.path.join(static_dir, stripped)
            if os.path.exists(static_path):
                return f"{attr}={quote}{static_path}{quote}"
            if public_dir:
                public_path = os.path.join(public_dir, stripped)
                if os.path.exists(public_path):
                    return f"{attr}={quote}{public_path}{quote}"
        return match.group(0)

    return re.sub(r'((?:src|data-src))=(["\'])([^"\']*)\2', fix_src, doc_html)
