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
import json
import os
import sys


def resolve_image_source(raw_path, static_dir, public_dir, website_dir, repo_dir):
    if not raw_path:
        return ""

    if raw_path.startswith(("http://", "https://", "data:")):
        return ""

    if raw_path.startswith("/") and os.path.isfile(raw_path):
        return raw_path

    candidates = []
    if raw_path.startswith("/"):
        stripped = raw_path[1:]
        candidates = [
            os.path.join(static_dir, stripped),
            os.path.join(public_dir, stripped),
            os.path.join(website_dir, stripped),
            os.path.join(repo_dir, stripped),
        ]
    else:
        candidates = [
            os.path.join(website_dir, raw_path),
            os.path.join(repo_dir, raw_path),
            os.path.join(static_dir, raw_path),
            os.path.join(public_dir, raw_path),
        ]

    for candidate in candidates:
        if os.path.isfile(candidate):
            return candidate
    return ""


def read_cover_metadata(metadata_file, version):
    data = {}
    if os.path.exists(metadata_file):
        with open(metadata_file, "r", encoding="utf-8") as f:
            data = json.load(f)

    defaults = data.get("defaults", {})
    release = data.get("releases", {}).get(version, {})

    name = release.get("name") or defaults.get("name") or "Kubernetes Documentation - {version}"
    name = name.replace("{version}", version)
    logo_input = release.get("logo") or defaults.get("logo") or ""
    found = "true" if release else "false"
    return name, logo_input, found


def parse_args():
    parser = argparse.ArgumentParser(description="Resolve EPUB cover metadata and asset paths.")
    parser.add_argument("--metadata-file", required=True, help="Path to epub-cover.json")
    parser.add_argument("--version", required=True, help="Release version key, e.g. v1.35")
    parser.add_argument("--static-dir", required=True, help="Website static dir")
    parser.add_argument("--public-dir", required=True, help="Website public dir")
    parser.add_argument("--website-dir", required=True, help="Website root dir")
    parser.add_argument("--repo-dir", required=True, help="Repository root dir")
    parser.add_argument("--brand-logo-input", default="", help="Kubernetes brand logo input path")
    return parser.parse_args()


def main():
    args = parse_args()

    release_name, release_logo_input, cover_version_found = read_cover_metadata(
        args.metadata_file,
        args.version,
    )
    release_logo_resolved = resolve_image_source(
        release_logo_input,
        args.static_dir,
        args.public_dir,
        args.website_dir,
        args.repo_dir,
    )
    brand_logo_resolved = resolve_image_source(
        args.brand_logo_input,
        args.static_dir,
        args.public_dir,
        args.website_dir,
        args.repo_dir,
    )

    print(release_name)
    print(release_logo_input)
    print(cover_version_found)
    print(release_logo_resolved)
    print(brand_logo_resolved)
    return 0


if __name__ == "__main__":
    sys.exit(main())
