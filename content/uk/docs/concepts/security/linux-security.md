---
reviewers:
- lmktfy
title: Безпека для вузлів Linux
content_type: concept
weight: 40
---

<!-- overview -->

На цій сторінці описано міркування щодо безпеки та рекомендації, специфічні для операційної системи Linux.

<!-- body -->

## Захист даних Secret на вузлах {#protection-for-secret-data-on-nodes}

На вузлах Linux томи в памʼяті (наприклад, монтування томів [`secret`](/docs/concepts/configuration/secret/) або [`emptyDir`](/docs/concepts/storage/volumes/#emptydir) з `medium: Memory`) реалізовано за допомогою файлової системи `tmpfs`.

Якщо у вас налаштовано своп і ви використовуєте старе ядро Linux (або поточне ядро та непідтримувану конфігурацію Kubernetes), дані з томів у **памʼяті** можуть записуватися в постійне сховище.

Ядро Linux офіційно підтримує параметр `noswap` з версії 6.3, тому, якщо на вузлі ввімкнено своп, рекомендується використовувати ядро версії 6.3 або новіше чи ядро з підтримкою параметра `noswap` через бекпорт.

Докладніше дивіться в розділі [Керування своп-памʼяттю](/docs/concepts/cluster-administration/swap-memory-management/#memory-backed-volumes).
