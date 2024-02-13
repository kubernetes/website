---
title: ReplicationController
id: replication-controller
date: 2018-04-12
full_link: 
short_description: >
  Обʼєкт API (застарілий), який керує реплікованим застосунком.

aka: 
tags:
- workload
- core-object
---
Ресурс робочого навантаження, який керує реплікованим застосунком, забезпечуючи наявність певної кількості екземплярів обʼекта {{< glossary_tooltip text="Pod" term_id="pod" >}}.

<!--more-->

Панель управління забезпечує, що визначена кількість екземплярів Pod працює, навіть якщо деякі Pod відмовляють, якщо ви видаляєте Pod вручну або якщо помилково їх запускається забагато.

{{< note >}}
ReplicationController є застарілим. Див. {{< glossary_tooltip text="Deployment" term_id="deployment" >}}, який є подібним.
{{< /note >}}
