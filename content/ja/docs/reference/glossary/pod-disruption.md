---
id: pod-disruption
title: Pod Disruption
full_link: /docs/concepts/workloads/pods/disruptions/
short_description: >
  ノード上のPodが自発的または非自発的に終了されるプロセス。

aka:
related:
 - pod
 - container
tags:
 - operation
---

[Pod disruption](/docs/concepts/workloads/pods/disruptions/)とは、ノード上のPodが自発的または非自発的に終了されるプロセスのことです。

<!--more-->

自発的なDisruptionは、アプリケーションの所有者やクラスター管理者によって意図的に開始されます。
非自発的なDisruptionは意図せず発生するもので、ノードの{{< glossary_tooltip text="リソース" term_id="infrastructure-resource" >}}不足のような避けられない問題や、誤った削除操作によって引き起こされます。
