---
reviewers:
- lmktfy
title: Безпека для вузлів Linux
content_type: concept
weight: 40
---

<!-- overview -->

На цій сторінці описано міркування щодо безпеки та найкращі практики, характерні для операційної системи Linux.

<!-- body -->

## Захист даних Secret на вузлах {#protection-for-secret-data-on-nodes}

На вузлах Linux томи з підтримкою пам'яті (наприклад, монтування томів [`secret`](/docs/concepts/configuration/secret/) або [`emptyDir`](/docs/concepts/storage/volumes/#emptydir) з `medium: Memory`) реалізовано за допомогою файлової системи `tmpfs`.

Якщо у вас налаштовано swap і ви використовуєте стару версію ядра Linux (або поточну версію ядра та непідтримувану конфігурацію Kubernetes), томи з підтримкою **памʼяті** можуть мати дані, записані в постійне сховище.

Ядро Linux офіційно підтримує параметр `noswap` з версії 6.3, тому рекомендується використовувати версію ядра 6.3 або новішу, або підтримувати параметр `noswap` через зворотну сумісність, якщо swap увімкнено на вузлі.

Дивіться [управління памʼяттю swap](/docs/concepts/cluster-administration/swap-memory-management/#memory-backed-volumes) для отримання додаткової інформації.
