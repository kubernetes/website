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

{{< glossary_tooltip text="Обʼєкт" term_id="object" >}} робочого навантаження, який керує реплікованим застосунком, забезпечуючи наявність певної кількості екземплярів обʼекта {{< glossary_tooltip text="Pod" term_id="pod" >}}.

<!--more-->

Панель управління забезпечує, що визначена кількість екземплярів Pod працює, навіть якщо деякі Podʼи зазнають збою, якщо ви видаляєте Pod вручну або якщо помилково їх запускається забагато.

{{< note >}}
ReplicationController є застарілим. Див. {{< glossary_tooltip text="Deployment" term_id="deployment" >}}, який є подібним.
{{< /note >}}
