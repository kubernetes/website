---
title: Workload
id: workload
date: 2019-02-13
full_link: /docs/concepts/workloads/
short_description: >
   Workload to aplikacja działająca na Kubernetesie.

aka: 
tags:
- fundamental
---
   Workload to aplikacja działająca na Kubernetesie.

<!--more--> 

Podstawowe obiekty, które reprezentują Workload to
DaemonSet, Deployment, Job, ReplicaSet i StatefulSet.

Na przykład, Workload który posiada web serwer i bazę danych, może uruchamiać
bazę danych w {{< glossary_tooltip term_id="StatefulSet" >}},
a web serwer w {{< glossary_tooltip term_id="Deployment" >}}.
