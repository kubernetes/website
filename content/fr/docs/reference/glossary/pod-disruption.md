---
id: pod-disruption
title: Pod Disruption
full_link: /docs/concepts/workloads/pods/disruptions/
short_description: >
  Processus par lequel des Pods sur des nœuds sont terminés de manière volontaire ou involontaire.

aka:
related:
 - pod
 - container
tags:
 - operation
---

La [Pod disruption](/docs/concepts/workloads/pods/disruptions/) est le processus par lequel 
des Pods sur des nœuds sont terminés de manière volontaire ou involontaire.

<!--more-->

Les perturbations volontaires sont déclenchées intentionnellement par les propriétaires d'applications ou les administrateurs du cluster. Les perturbations involontaires sont non intentionnelles et peuvent être causées par des problèmes inévitables, comme des nœuds à court de {{< glossary_tooltip text="ressources" term_id="infrastructure-resource" >}},
ou par des suppressions accidentelles.