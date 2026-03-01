---
title: Kubelet
id: kubelet
full_link: /docs/reference/generated/kubelet
short_description: >
  Agente que se ejecuta en cada nodo de un clúster. Se asegura de que los contenedores estén corriendo en un pod.

aka:
tags:
- fundamental
- core-object
---
  Agente que se ejecuta en cada nodo de un clúster. Se asegura de que los contenedores estén corriendo en un pod.

<!--more-->

El agente kubelet toma un conjunto de especificaciones de {{< glossary_tooltip text="Pod" term_id="pod" >}}, llamados
 PodSpecs, que han sido creados por Kubernetes y garantiza que los contenedores descritos en ellos estén funcionando y
 en buen estado.
