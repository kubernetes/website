---
title: Робоче навантаження
id: workload
date: 2019-02-13
full_link: /uk/docs/concepts/workloads/
short_description: >
   Робоче навантаження є застосунком, який запущено в Kubernetes.

aka: 
- Workload
tags:
- fundamental
---

Робоче навантаження є застосунком, який запущено в Kubernetes.

<!--more-->

Різноманітні основні обʼєкти, які представляють різні типи або частини робочого навантаження, включають обʼєкти DaemonSet, Deployment, Job, ReplicaSet та StatefulSet.

Наприклад, робоче навантаження, що має вебсервер та базу даних має запускати базу даних в одному {{< glossary_tooltip term_id="StatefulSet" >}} та вебсервер в {{< glossary_tooltip term_id="Deployment" >}}.
