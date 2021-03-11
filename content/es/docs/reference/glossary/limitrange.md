---
title: LimitRange
id: limitrange
date: 2019-04-15
full_link: /docs/concepts/policy/limit-range/
short_description: >
  Proporciona restricciones para limitar el consumo de recursos por Contenedores o Pods en un espacio de nombres

aka:
tags:
  - core-object
  - fundamental
  - architecture
related:
  - pod
  - container
---

Proporciona restricciones para limitar el consumo de recursos por {{< glossary_tooltip text="Contenedores" term_id="container" >}} o {{< glossary_tooltip text="Pods" term_id="pod" >}} en un espacio de nombres ({{< glossary_tooltip text="Namespace" term_id="namespace" >}})

<!--more-->

LimitRange limita la cantidad de objetos que se pueden crear por su tipo (vease {{< glossary_tooltip text="Workloads" term_id="workload" >}}), así como la cantidad de recursos informáticos que pueden ser requeridos/consumidos por {{< glossary_tooltip text="Pods" term_id="pod" >}} individuales en un espacio de nombres.
