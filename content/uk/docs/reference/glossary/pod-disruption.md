---
id: pod-disruption
title: Порушення роботи Podʼа
full_link: /docs/concepts/workloads/pods/disruptions/
short_description: >
  Процес, під час якого Podʼи на вузлах припиняють роботу добровільно або примусово.

aka:
related:
 - pod
 - container
tags:
 - operation
---

[Порушення роботи Podʼа](/docs/concepts/workloads/pods/disruptions/) — це процес, під час якого Podʼи на вузлах припиняють роботу добровільно або примусово.

<!--more-->

Добровільне порушення навмисно запускають власники застосунків або адміністратори кластера. Невідворотне порушення є ненавмисним і може бути спричинене неминучими проблемами, такими як вичерпання {{< glossary_tooltip text="ресурсів" term_id="infrastructure-resource" >}} вузлів, або випадковим видаленням.
