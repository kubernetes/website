---
title: ReplicaSet
id: replica-set
full_link: /docs/concepts/workloads/controllers/replicaset/
short_description: >
 ReplicaSet забезпечує одночасну роботу вказаної кількості реплік обʼєкта Pod

aka:
tags:
- fundamental
- core-object
- workload
---

Обʼєкт ReplicaSet (має на меті) підтримувати набір реплік обʼєктів Pod, які працюють у будь-який момент часу.

<!--more-->

Обʼєкти робочого навантаження, такі як {{< glossary_tooltip term_id="deployment" >}}, використовують ReplicaSet, щоб у вашому кластері працювала налаштована кількість {{< glossary_tooltip term_id="pod" text="Podʼів" >}} відповідно до специфікації цього ReplicaSet.
