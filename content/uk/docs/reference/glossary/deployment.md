---
title: Deployment
id: deployment
date: 2018-04-12
full_link: /docs/concepts/workloads/controllers/deployment/
short_description: >
  Керує реплікованим застосунком у вашому кластері.

aka:
tags:
- fundamental
- core-object
- workload
---

Обʼєкт API, який керує реплікованим застосунком, зазвичай, запускаючи Podʼи без збереження стану.

<!--more-->

Кожна репліка представлена {{< glossary_tooltip term_id="pod" text="Podʼом" >}}; Podʼи розподіляються серед {{< glossary_tooltip text="вузлів" term_id="node" >}} кластера. Для робочих навантажень, які дійсно вимагають збереження стану, розгляньте використання {{< glossary_tooltip term_id="StatefulSet" >}}.
