---
title: Життєвий цикл Podʼа
id: pod-lifecycle
date: 2019-02-17
full-link: /docs/concepts/workloads/pods/pod-lifecycle/

aka:
- Pod Lifecycle
related:
 - pod
 - container
tags:
 - fundamental
short_description: >
  Послідовність станів, через які проходить Pod протягом свого існування.
 
---
 Послідовність станів, через які проходить Pod протягом свого існування.

<!--more--> 

[Життєвий цикл Podа](/docs/concepts/workloads/pods/pod-lifecycle/) визначається станами або фазами Podʼа. Існує пʼять можливих фаз Podʼа: Pending, Running, Succeeded, Failed та Unknown. Високорівневий опис стану Podʼа знаходиться в полі `phase` [PodStatus](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#podstatus-v1-core).
