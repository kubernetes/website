---
title: ReplicationController
id: replication-controller
full_link:
short_description: >
  Обʼєкт API (застарілий), який керує реплікованим застосунком.

aka:
tags:
- workload
- core-object
---

{{< glossary_tooltip text="Обʼєкт" term_id="object" >}} управління робочими навантаженнями, який керує реплікованим застосунком, забезпечуючи роботу певної кількості екземплярів обʼєкта {{< glossary_tooltip text="Pod" term_id="pod" >}}.

<!--more-->

Керівний вузол (control-plane node) забезпечує роботу визначеної кількості Podʼів, навіть якщо деякі Podʼи зазнають збою, якщо ви видаляєте Podʼи вручну або якщо їх помилково запущено забагато.

{{< note >}}
ReplicationController є застарілим. Див. {{< glossary_tooltip text="Deployment" term_id="deployment" >}}, який є подібним.
{{< /note >}}
