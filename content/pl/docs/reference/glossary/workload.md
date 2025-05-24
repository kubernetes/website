---
title: Workload
id: workload
date: 2019-02-13
full_link: /docs/concepts/workloads/
short_description: >
   Workload to ogólne określenie aplikacji działającej na Kubernetesie.

aka: 
tags:
- fundamental
---
   Workload to ogólne określenie aplikacji działającej na Kubernetesie.

<!--more--> 

Workload budowany jest z różnych podstawowych obiektów Kubernetesa
, takich jak: DaemonSet, Deployment, Job, ReplicaSet i StatefulSet.

Na przykład, Workload, który składa się z web serwera i bazy danych, może uruchamiać
bazę danych jako {{< glossary_tooltip term_id="StatefulSet" >}},
a web serwer jako {{< glossary_tooltip term_id="Deployment" >}}.
