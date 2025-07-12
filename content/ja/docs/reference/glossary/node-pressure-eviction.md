---
title: ノード圧迫による退避
id: node-pressure-eviction
date: 2021-05-13
full_link: /ja/docs/concepts/scheduling-eviction/node-pressure-eviction/
short_description: >
  ノード圧迫による退避は、kubeletがノード上のリソースを回収するためにPodを積極的に失敗させるプロセスです。
aka:
- kubelet eviction
tags:
- operation
---
ノード圧迫による退避は、{{<glossary_tooltip term_id="kubelet" text="kubelet">}}がノード上のリソースを回収するためにPodを積極的に失敗させるプロセスです。

<!--more-->

kubeletは、クラスターのノード上のCPU、メモリ、ディスク容量、ファイルシステムのinodeなどのリソースを監視します。
これらのリソースの1つ以上が特定の消費レベルに達すると、kubeletはノード上の1つ以上のPodを積極的に失敗させることでリソースを回収し、枯渇を防ぎます。

ノード圧迫による退避は、[APIを起点とした退避](/ja/docs/concepts/scheduling-eviction/api-eviction/)とは異なります。
