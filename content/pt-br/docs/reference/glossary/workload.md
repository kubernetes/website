---
title: Carga de Trabalho
id: workloads
date: 2019-02-13
full_link: /docs/concepts/workloads/
short_description: >
   Uma carga de trabalho é uma aplicação sendo executada no Kubernetes.

aka: 
tags:
- fundamental
---
   Uma carga de trabalho é uma aplicação sendo executada no Kubernetes.

<!--more-->

Vários objetos principais que representam diferentes tipos ou partes de uma carga de trabalho
incluem os objetos DaemonSet, Deployment, Job, ReplicaSet, e StatefulSet.

Por exemplo, uma carga de trabalho que tem um servidor web e um banco de dados pode rodar o
banco de dados em um {{< glossary_tooltip term_id="StatefulSet" >}} e o servidor web
em um {{< glossary_tooltip term_id="Deployment" >}}.
