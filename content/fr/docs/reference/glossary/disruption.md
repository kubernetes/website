---
title: Disruption
id: disruption
full_link: /docs/concepts/workloads/pods/disruptions/
short_description: >
  Un événement qui entraîne la mise hors service d’un ou plusieurs Pods.
aka:
tags:
- fondamental
---
Les disruptions sont des événements qui entraînent la mise hors service d’un ou plusieurs
{{< glossary_tooltip term_id="pod" text="Pods" >}}.
Une disruption a des conséquences sur la gestion des {{< glossary_tooltip text="ressources" term_id="api-resource" >}} de workload,
comme les {{< glossary_tooltip term_id="deployment" >}}, qui dépendent des Pods affectés.

<!--more-->

Si vous, en tant qu’opérateur de cluster, supprimez un Pod appartenant à une application,
Kubernetes parle de _disruption volontaire_. Si un Pod devient indisponible à cause d’une panne
de nœud ou d’une interruption touchant une zone plus large, Kubernetes parle de _disruption involontaire_.

Voir [Disruptions](/docs/concepts/workloads/pods/disruptions/) pour plus d’informations.
