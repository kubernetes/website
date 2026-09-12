---
id: pod-disruption
title: Розлад в роботі Podʼа
full_link: /docs/concepts/workloads/pods/disruptions/
short_description: >
  Процес, за якого Podʼи на вузлах припиняють роботу добровільно, або примусово.

aka:
related:
 - pod
 - container
tags:
  - operation
---

[Розлад в роботі Podʼа](/docs/concepts/workloads/pods/disruptions/) — це процес, за якого Podʼи на вузлах припиняють роботу добровільно, або примусово.

<!--more-->

Добровільні розлади запускаються навмисно власниками застосунків або адміністраторами кластера. Примусові розлади є ненавмисними та можуть бути спричинені невідворотними проблемами, такими як вичерпання {{< glossary_tooltip text="ресурсів" term_id="infrastructure-resource" >}} вузлів, або випадковими видаленнями.
