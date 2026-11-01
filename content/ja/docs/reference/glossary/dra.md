---
title: Dynamic Resource Allocation
id: dra
full_link: /docs/concepts/scheduling-eviction/dynamic-resource-allocation/
short_description: >
  ハードウェアアクセラレーターのようなリソースを、Pod間で要求・共有するためのKubernetesの機能。

aka:
- DRA
tags:
- extension
---
Pod間でリソースを要求・共有できるようにするKubernetesの機能です。
これらのリソースは、多くの場合、ハードウェアアクセラレーターのような接続された{{< glossary_tooltip text="デバイス" term_id="device" >}}です。

<!--more-->

DRAでは、デバイスドライバーとクラスター管理者が、ワークロードから _要求(claim)_ できるデバイスの _クラス_ を定義します。
Kubernetesは、一致するデバイスを個々のクレームに割り当て、対応するPodを、割り当てられたデバイスにアクセスできるノードに配置します。
