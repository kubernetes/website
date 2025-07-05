---
title: Static Pod
id: static-pod
date: 2019-02-12
full_link: /docs/tasks/configure-pod-container/static-pod/
short_description: >
  Một pod được quản lý trực tiếp bởi kubelet daemon trên một node cụ thể.

aka:
tags:
- fundamental
---

Một {{< glossary_tooltip text="pod" term_id="pod" >}} được quản lý trực tiếp bởi {{< glossary_tooltip text="kubelet" term_id="kubelet" >}}
 daemon trên một node cụ thể,
<!--more-->

mà không có sự giám sát của API server.

Static Pod không hỗ trợ {{< glossary_tooltip text="ephemeral container" term_id="ephemeral-container" >}}.
