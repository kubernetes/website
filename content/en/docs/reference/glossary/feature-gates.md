---
title: Feature gate
id: feature-gate
date: 2023-01-12
full_link: /docs/reference/command-line-tools-reference/feature-gates/
short_description: >
  A way to control whether or not a particular Kubernetes feature is enabled.

aka: 
tags:
- fundamental
- operation
---

Feature gates are a set of keys (opaque string values) that you can use to control which
Kubernetes features are enabled in your cluster.

<!--more-->

You can turn these features on or off using the `--feature-gates` command line flag on each Kubernetes component.
Each Kubernetes component lets you enable or disable a set of feature gates that are relevant to that component.
The Kubernetes documentation lists all current 
[feature gates](/docs/reference/command-line-tools-reference/feature-gates/) and what they control.
