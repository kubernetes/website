---
title: Горизонтальне автомасштабування Podʼа
id: horizontal-pod-autoscaler
date: 2018-04-12
full_link: /docs/tasks/run-application/horizontal-pod-autoscale/
short_description: >
  Ресурс API, який автоматично масштабує кількість реплік {{< glossary_tooltip term_id="pod" text="Podʼу" >}} на основі вказаних параметрів використання ЦП або власних метрик.

aka: 
- HPA
- Horizontal Pod Autoscaler
tags:
- operation
---
Ресурс API, який автоматично масштабує кількість реплік {{< glossary_tooltip term_id="pod" text="Podʼу" >}} на основі вказаних параметрів використання ЦП або власних метрик.

<!--more--> 

Горизонтальне автомасштабування Podʼа (HPA) зазвичай використовується з {{< glossary_tooltip text="ReplicationControllers" term_id="replication-controller" >}}, {{< glossary_tooltip text="Deployments" term_id="deployment" >}} або {{< glossary_tooltip text="ReplicaSets" term_id="replica-set" >}}. Його неможливо застосувати до обʼєктів, які не можна масштабувати, наприклад, {{< glossary_tooltip text="DaemonSets" term_id="daemonset" >}}.
