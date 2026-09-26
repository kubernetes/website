---
id: pod-disruption-budget
title: Pod Disruption Budget
full-link: /docs/concepts/workloads/pods/disruptions/
short_description: >
  Un objet qui limite le nombre de Pods d'une application répliquée pouvant être indisponibles simultanément en raison de perturbations volontaires.

aka:
 - PDB
related:
 - pod
 - container
tags:
 - operation
---

Un [Pod Disruption Budget](/docs/concepts/workloads/pods/disruptions/) permet au propriétaire d'une application de créer un objet pour une application répliquée, afin de garantir qu'un certain nombre ou pourcentage de {{< glossary_tooltip text="Pods" term_id="pod" >}} portant un label attribué ne sera pas évincé volontairement à un moment donné.

<!--more-->

Les perturbations involontaires ne peuvent pas être empêchées par les PDB ; cependant, elles sont comptabilisées dans le budget.