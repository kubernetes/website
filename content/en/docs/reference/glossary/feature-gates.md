---
title: Feature gates
id: feature-gates
date: 2023-01-12
full_link: /docs/reference/command-line-tools-reference/feature-gates/
short_description: >
  Feature gates are a set of key=value pairs that describe Kubernetes features.

aka: 
tags:
- fundamental
- operation
---

Feature gates are a set of key=value pairs that describe Kubernetes features.

<!--more-->

You can turn these features on or off using the `--feature-gates` command line flag on each Kubernetes component.
Each Kubernetes component lets you enable or disable a set of feature gates that are relevant to that component. Use -h flag to see a full set of feature gates for all components.
