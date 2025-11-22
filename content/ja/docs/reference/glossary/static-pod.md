---
title: Static Pod
id: static-pod
date: 2019-02-12
full_link: /docs/tasks/configure-pod-container/static-pod/
short_description: >
  特定のノード上でkubeletデーモンによって直接管理されるPodです。

aka: 
tags:
- fundamental
---

{{< glossary_tooltip text="APIサーバー" term_id="kube-apiserver" >}}の監視なしに、特定のノード上で{{< glossary_tooltip text="kubelet" term_id="kubelet" >}}デーモンによって直接管理される{{< glossary_tooltip text="Pod" term_id="pod" >}}です。

<!--more-->

Static Podは{{< glossary_tooltip text="エフェメラルコンテナ" term_id="ephemeral-container" >}}をサポートしていません。
