---
id: pod-disruption-budget
title: Pod Disruption Budget
full_link: /docs/concepts/workloads/pods/disruptions/
short_description: >
  レプリカを持つアプリケーションのうち、自発的なDisruptionによって同時にダウンするPodの数を制限するオブジェクト。

aka:
 - PDB
related:
 - pod
 - container
tags:
 - operation
---

[Pod Disruption Budget](/docs/concepts/workloads/pods/disruptions/)は、アプリケーションの所有者がレプリカを持つアプリケーション向けに作成するオブジェクトで、特定のラベルが付いた{{< glossary_tooltip text="Pod" term_id="pod" >}}のうち一定の数または割合が、どの時点でも自発的に退避されないことを保証します。

<!--more-->

非自発的なDisruptionはPDBによって防ぐことはできません。ただし、予算にはカウントされます。
