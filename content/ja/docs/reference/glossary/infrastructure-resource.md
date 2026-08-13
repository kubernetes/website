---
title: リソース(インフラストラクチャ)
id: infrastructure-resource
short_description: >
  CPU、メモリなど、消費可能な一定量のインフラストラクチャ

aka:
tags:
- architecture
---
1つ以上の{{< glossary_tooltip text="ノード" term_id="node" >}}(CPU、メモリ、GPUなど)に提供され、それらのノード上で稼働している{{< glossary_tooltip text="Pod" term_id="pod" >}}によって消費可能な機能です。

Kubernetesでは、{{< glossary_tooltip text="APIリソース" term_id="api-resource" >}}を表す際にも _リソース_ という用語を使用します。

<!--more-->
コンピューターは、処理能力、ストレージメモリ、ネットワークなどの基本的なハードウェア設備を提供します。
これらのリソースにはそのリソース(CPU数、メモリ容量など)に適切な単位で測定されたキャパシティに限りがあります。
Kubernetesはワークロードへの割り当てのために共通の[リソース](/docs/concepts/configuration/manage-resources-containers/)を抽象化し、{{< glossary_tooltip text="ワークロード" term_id="workload" >}}による消費を管理するために、オペレーティングシステムのプリミティブ(例えば、Linuxの{{< glossary_tooltip text="cgroup" term_id="cgroup" >}})を利用します。

複雑なリソース割り当てを自動的に管理するために、[動的リソース割り当て](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/)を利用することも可能です。
