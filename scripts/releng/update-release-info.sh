#!/usr/bin/env bash

# release.md
####################################
cat << EOF > content/en/releases/release.md
---
title: Kubernetes Release Cycle
type: docs
auto_generated: true
---
<!-- THIS CONTENT IS AUTO-GENERATED via https://github.com/kubernetes/website/blob/main/scripts/releng/update-release-info.sh -->

{{< warning >}}
This content is auto-generated and links may not function. The source of the document is located [here](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-release/release.md).
{{< /warning >}}

EOF

curl --retry 3 https://raw.githubusercontent.com/kubernetes/community/master/contributors/devel/sig-release/release.md >> content/en/releases/release.md
