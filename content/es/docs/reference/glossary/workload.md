---
title: Workload
id: workloads
date: 2019-02-13
full_link: /docs/concepts/workloads/
short_description: >
   Un Workload es una aplicación que se ejecuta en Kubernetes.

aka: 
tags:
- fundamental
---
   Un Workload es una aplicación que se ejecuta en Kubernetes.

<!--more--> 

Varios objetos clave que representan diferentes tipos o partes de un Workload
incluyen los objetos: DaemonSet, Deployment, Job, ReplicaSet y StatefulSet.

Por ejemplo, un Workload que tiene un servidor web y una base de datos podría ejecutar
la base de datos en un {{< glossary_tooltip term_id="StatefulSet" >}} y el servidor
web en un {{< glossary_tooltip term_id="Deployment" >}}.
