---
title: Життєвий цикл Podʼа
id: pod-lifecycle
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

[Життєвий цикл Podʼа](/docs/concepts/workloads/pods/pod-lifecycle/) визначається станами або фазами Podʼа. Існує пʼять можливих фаз Podʼа: Pending, Running, Succeeded, Failed та Unknown. Високорівневий опис стану Podʼа міститься в полі `phase` [PodStatus](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#podstatus-v1-core).
