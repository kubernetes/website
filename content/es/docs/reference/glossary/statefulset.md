---
title: StatefulSet
id: statefulset
date: 2018-04-12
full_link: /docs/concepts/workloads/controllers/statefulset/
short_description: >
  Gestiona el despliegue y escalado de un conjunto de Pods,
  *y garantiza el orden y unicidad* de dichos Pods.

tags:
- fundamental
- core-object
- workload
- storage
---
 Gestiona el despliegue y escalado de un conjunto de {{< glossary_tooltip text="Pods" term_id="pod" >}},
 *y garantiza el orden y unicidad* de dichos Pods.

<!--more-->

Al igual que un {{< glossary_tooltip term_id="deployment" >}}, un StatefulSet gestiona Pods
que se basan en una especificación idéntica de contenedor. A diferencia de un Deployment, un
StatefulSet mantiene una identidad asociada a sus Pods. Estos pods se crean a partir de la
misma especificación, pero no pueden intercambiarse; cada uno tiene su propio identificador persistente
que mantiene a lo largo de cualquier re-programación.

Un StatefulSet opera bajo el mismo patrón que cualquier otro controlador.
Se define el estado deseado en un *objeto* StatefulSet, y el *controlador* del StatefulSet efectúa
las actualizaciones que sean necesarias para alcanzarlo a partir del estado actual.

