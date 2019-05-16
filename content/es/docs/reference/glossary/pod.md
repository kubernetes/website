---
title: Pod
id: pod
date: 2018-05-16
full_link: /docs/concepts/workloads/pods/pod-overview/
short_description: >
  El objeto más pequeño y simple de Kubernetes. Un Pod representa un conjunto de contenedores ejecutándose en tu cluster.

aka: 
tags:
- core-object
- fundamental
---
  El objeto más pequeño y simple de Kubernetes. Un Pod representa un conjunto de {{< glossary_tooltip text="contenedores" term_id="container" >}} ejecutándose en tu cluster.

<!--more--> 

Normalmente un Pod se configura para ejecutar un solo contenedor primario. También puede ejecutar contenedores sidecar opcionales que añaden funcionalidades adicionales como logging. Los Pods son comúnmente gestionados por un {{< glossary_tooltip term_id="deployment" >}}.

