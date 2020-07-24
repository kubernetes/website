---
title: Workload
id: workloads
date: 2019-02-13
full_link: /fr/docs/concepts/workloads/
short_description: >
   Une charge de travail (workload) est une application exécutée sur Kubernetes.

aka: 
tags:
- fundamental
---
   Une charge de travail (workload) est une application exécutée sur Kubernetes.

<!--more--> 

Divers objets de base qui représentent différents types ou parties d'une charge de travail
incluent les objets DaemonSet, Deployment, Job, ReplicaSet et StatefulSet.

Par exemple, une charge de travail constituée d'un serveur Web et d'une base de données peut exécuter la
base de données dans un {{< glossary_tooltip term_id="StatefulSet" >}} et le serveur web
dans un {{< glossary_tooltip term_id="Deployment" >}}.
