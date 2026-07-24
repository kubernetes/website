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

"""Main entrypoint for EPUB post-processing used by full/reference builds."""

if __package__ in (None, ""):
    # Support direct execution: python3 scripts/epub_postprocess/main.py
    import os
    import sys

    sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from epub_postprocess.cli import main


if __name__ == "__main__":
    main()
