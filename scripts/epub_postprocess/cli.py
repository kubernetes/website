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

"""CLI for the EPUB post-processing pipeline."""

import argparse

from .pipeline import postprocess


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        description="Post-process Hugo HTML for Kubernetes EPUB conversion (full/reference builds)"
    )
    parser.add_argument("input", help="Input HTML file path")
    parser.add_argument("output", help="Output HTML file path")
    parser.add_argument(
        "--section",
        required=True,
        help="Current docs section for this input (for example: reference, setup, tutorials, concepts, tasks)",
    )
    parser.add_argument("--static-dir", required=True, help="Path to Hugo static directory")
    parser.add_argument("--public-dir", default="", help="Path to Hugo public (output) directory")
    parser.add_argument("--base-url", default="https://kubernetes.io", help="Base URL for cross-section links")
    parser.add_argument(
        "--link-mode",
        choices=["section", "combined"],
        default="section",
        help="Link rewrite strategy: 'section' for reference-only builds, 'combined' for full builds",
    )
    parser.add_argument(
        help="Additional HTML files to build cross-page link index from (repeatable; used by combined mode)",
    )
    return parser


def main() -> None:
    parser = build_parser()
    args = parser.parse_args()
    postprocess(
        input_path=args.input,
        output_path=args.output,
        section=args.section,
        static_dir=args.static_dir,
        public_dir=args.public_dir,
        base_url=args.base_url,
        link_mode=args.link_mode,
        index_html=args.index_html,
    )
