---
title: Static Pod
id: static-pod
date: 2019-02-12
full_link: /docs/tasks/configure-pod-container/static-pod/
short_description: >
  特定のノード上のkubeletデーモンによって直接管理されるPod。

aka:
tags:
- fundamental
---
特定のノード上の{{< glossary_tooltip text="kubelet" term_id="kubelet" >}}デーモンによって直接管理される{{< glossary_tooltip text="Pod" term_id="pod" >}}。

<!--more-->

APIサーバーに監視されることはありません。

Static Podsは{{< glossary_tooltip text="ephemeral containers" term_id="ephemeral-container" >}}をサポートしていません。
