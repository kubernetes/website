---
title: Робоче навантаження
id: workload
date: 2019-02-13
full_link: /docs/concepts/workloads/
short_description: >
   Робоче навантаження є застосунком, який запущено в Kubernetes.

aka: 
tags:
- fundamental
---
   Робоче навантаження є застосунком, який запущено в Kubernetes.

<!--more--> 

Різноманітні основні обʼєкти, які представляють різні типи або частини робочого навантаження, включають обʼєкти DaemonSet, Deployment, Job, ReplicaSet та StatefulSet.

Наприклад, робоче навантаження, що має вебсервер та базу даних має виконувати базу даних в одному {{< glossary_tooltip term_id="StatefulSet" >}} та вебсервер в {{< glossary_tooltip term_id="Deployment" >}}.
