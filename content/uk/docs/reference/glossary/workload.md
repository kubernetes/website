---
title: Робоче навантаження
id: workload
full_link: /docs/concepts/workloads/
short_description: >
   Робоче навантаження є застосунком, який запущено в Kubernetes.

aka:
- Workload
tags:
- fundamental
---

Робоче навантаження є застосунком, який запущено в Kubernetes.

<!--more-->

До основних обʼєктів, які представляють різні типи або частини робочого навантаження, належать DaemonSet, Deployment, Job, ReplicaSet та StatefulSet.

Наприклад, робоче навантаження, що має вебсервер та базу даних, може запускати базу даних в одному {{< glossary_tooltip term_id="StatefulSet" >}}, а вебсервер — в {{< glossary_tooltip term_id="Deployment" >}}.
