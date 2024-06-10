---
title: CRI-O
id: cri-o
date: 2019-05-14
full_link: https://cri-o.io/#what-is-cri-o
short_description: >
  Kubernetesに特化した軽量コンテナランタイム

aka:
tags:
- tool
---
Kubernetes CRIと一緒にOCIコンテナランタイムを使うためのツールです。

<!--more-->

CRI-OはOpen Container Initiative (OCI) [runtime spec](https://www.github.com/opencontainers/runtime-spec)と互換性がある{{< glossary_tooltip text="コンテナ" term_id="container" >}}ランタイムを使用できるようにするための{{< glossary_tooltip term_id="cri" >}}の実装の１つです。

CRI-Oのデプロイによって、Kubernetesは任意のOCI準拠のランタイムを、{{< glossary_tooltip text="Pod" term_id="pod" >}}を実行するためのコンテナランタイムとして利用することと、リモートレジストリからOCIコンテナイメージを取得することができるようになります。
