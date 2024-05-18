---
title: Рабочая нагрузка
id: workload
date: 2023-11-20
full_link: /ru/docs/concepts/workloads/
short_description: >
   Рабочая нагрузка — это приложение, работающее в Kubernetes.

aka: 
tags:
- fundamental
---
   Рабочая нагрузка — это приложение, работающее в Kubernetes.

<!--more--> 

DaemonSet, Deployment, Job, ReplicaSet и StatefulSet являются основными объектами, представляющими собой различные типы рабочей нагрузки.

Например, рабочая нагрузка, включающая в себя веб-сервер и базу данных, может запускать
базу данных в одном {{< glossary_tooltip term_id="StatefulSet" >}}, а веб-сервер —
в {{< glossary_tooltip term_id="Deployment" >}}.
