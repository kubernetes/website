---
title: ReplicaSet
id: replica-set
full_link: /docs/concepts/workloads/controllers/replicaset/
short_description: >
 ReplicaSet забезпечує наявність певної кількості реплік обʼєкта Pod в поточний момент часу

aka:
tags:
- fundamental
- core-object
- workload
---

Обʼєкт ReplicaSet (має на меті) підтримувати набір реплік обʼєктів Pod, які завжди працюють в будь-який момент часу.

<!--more-->

Обʼєкти робочого навантаження, такі як {{< glossary_tooltip term_id="deployment" >}}, використовують ReplicaSet для забезпечення того, що налаштована кількість {{< glossary_tooltip term_id="pod" text="Podʼів" >}} працювала у вашому кластері на основі конфігурації цього ReplicaSet.
