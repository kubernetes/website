---
title: Горизонтальне автомасштабування Podʼа
id: horizontal-pod-autoscaler
full_link: /docs/concepts/workloads/autoscaling/horizontal-pod-autoscale/
short_description: >
  Обʼєкт, який автоматично масштабує кількість реплік Podʼа на основі вказаних параметрів використання цільових ресурсів або власних метрик.

aka:
- HPA
- Horizontal Pod Autoscaler
tags:
- operation
---

{{< glossary_tooltip text="Обʼєкт" term_id="object" >}}, який автоматично масштабує кількість реплік {{< glossary_tooltip term_id="pod" text="Podʼа" >}} на основі вказаних параметрів використання цільових {{< glossary_tooltip text="ресурсів" term_id="infrastructure-resource" >}} або власних метрик.

<!--more-->

HorizontalPodAutoscaler (HPA) зазвичай використовується з {{< glossary_tooltip text="Deployments" term_id="deployment" >}} або {{< glossary_tooltip text="ReplicaSets" term_id="replica-set" >}}. Його неможливо застосувати до обʼєктів, які не можна масштабувати, наприклад, {{< glossary_tooltip text="DaemonSets" term_id="daemonset" >}}.
