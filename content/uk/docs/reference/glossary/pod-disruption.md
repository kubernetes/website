---
id: pod-disruption
title: Переривання роботи Podʼа
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

[Переривання роботи Podʼа](/docs/concepts/workloads/pods/disruptions/) — це процес, під час якого Podʼи на вузлах припиняють роботу добровільно або примусово.

<!--more-->

Добровільне переривання роботи навмисно запускають власники застосунків або адміністратори кластера. Невідворотне переривання роботи є ненавмисним і може бути спричинене неминучими проблемами, такими як вичерпання {{< glossary_tooltip text="ресурсів" term_id="infrastructure-resource" >}} вузлів, або випадковим видаленням.
