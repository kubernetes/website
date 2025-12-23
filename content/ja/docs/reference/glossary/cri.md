---
title: コンテナランタイムインターフェース(CRI)
id: cri
date: 2021-11-24
full_link: /docs/concepts/architecture/cri
short_description: >
  kubeletとローカルコンテナランタイム間の通信のためのプロトコルです。

aka:
tags:
  - fundamental
---

{{< glossary_tooltip text="kubelet" term_id="kubelet" >}}とコンテナランタイム間の通信のための主要なプロトコルです。

<!--more-->

Kubernetesコンテナランタイムインターフェース(CRI)は、[ノードコンポーネント](/docs/concepts/architecture/#node-components)である{{< glossary_tooltip text="kubelet" term_id="kubelet" >}}と{{< glossary_tooltip text="コンテナランタイム" term_id="container-runtime" >}}の間の通信のための主要な[gRPC](https://grpc.io)プロトコルを定義します。