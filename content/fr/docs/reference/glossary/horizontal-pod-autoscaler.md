---
title: Horizontal Pod Autoscaler
id: horizontal-pod-autoscaler
date: 2018-04-12
full_link: /docs/concepts/workloads/autoscaling/horizontal-pod-autoscale/
short_description: >
  Objet qui met automatiquement à l’échelle le nombre de répliques de pods en fonction de la consommation ciblée de ressources ou d’objectifs de métriques personnalisées.

aka: 
- HPA
tags:
- operation
---
Un {{< glossary_tooltip text="objet" term_id="object" >}} qui met automatiquement à l’échelle le nombre de {{< glossary_tooltip term_id="pod" >}} répliques,  
en fonction de la consommation ciblée de {{< glossary_tooltip text="ressources" term_id="infrastructure-resource" >}} ou d’objectifs de métriques personnalisées.

<!--more-->

Le HorizontalPodAutoscaler (HPA) est généralement utilisé avec des {{< glossary_tooltip text="Deployments" term_id="deployment" >}} ou des {{< glossary_tooltip text="ReplicaSets" term_id="replica-set" >}}. Il ne peut pas être appliqué à des objets non extensibles, par exemple des {{< glossary_tooltip text="DaemonSets" term_id="daemonset" >}}.
