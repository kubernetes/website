---
title: Static Pod
id: static-pod
date: 2019-02-12
full_link: /docs/tasks/configure-pod-container/static-pod/
short_description: >
  A pod managed directly by the kubelet daemon on a specific node.

aka: 
tags:
- fundamental
---

A {{< glossary_tooltip text="pod" term_id="pod" >}} managed directly by the {{< glossary_tooltip text="kubelet" term_id="kubelet" >}}
 daemon on a specific node,
<!--more-->

without the API server observing it.

Static Pods do not support {{< glossary_tooltip text="ephemeral containers" term_id="ephemeral-container" >}}.
