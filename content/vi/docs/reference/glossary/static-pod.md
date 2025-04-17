---
title: Static Pod
id: static-pod
date: 2019-02-12
full_link: /docs/tasks/configure-pod-container/static-pod/
short_description: >
  Pod được quản lý trực tiếp bởi tiến trình kubelet trên một node cụ thể.

aka: 
tags:
- fundamental
---

Một {{< glossary_tooltip text="pod" term_id="pod" >}} được quản lý trực tiếp bởi tiến trình {{< glossary_tooltip text="kubelet" term_id="kubelet" >}}
trên một node cụ thể,
<!--more-->

mà không được API server giám sát.

Static Pod không hỗ trợ {{< glossary_tooltip text="ephemeral container" term_id="ephemeral-container" >}}.
