---
title: Pod Priority
id: pod-priority
date: 2019-01-31
full_link: /docs/concepts/configuration/pod-priority-preemption/#pod-priority
short_description: >
  Pod Priority indica la importancia de un Pod con relación a otros Pods. 

aka:
tags:
- operation
---
 Pod Priority indica la importancia de un Pod con relación a otros Pods.

<!--more-->

[Pod Priority](/docs/concepts/configuration/pod-priority-preemption/#pod-priority) permite establecer prioridades para los diferentes {{< glossary_tooltip text="Pods" term_id="pod" >}}, dichas prioridades se tendrán en cuenta a la hora de planificar su ejecución en el clúster. Esta funcionalidad es muy importatnte en clústeres en producción, para poder priorizar la disponiblidad de las cargas de trabajo más críticas.
