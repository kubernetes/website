---
id: pod-disruption
title: Interrupción de Pods
full_link: /docs/concepts/workloads/pods/disruptions/
short_description: >
  El proceso por el cual los Pods en los nodos se terminan, ya sea de forma
  voluntaria o involuntaria.
aka:
related:
 - pod
 - container
tags:
 - operation
---

La [interrupción de Pods](/docs/concepts/workloads/pods/disruptions/) es el proceso por el cual
los Pods en los nodos se terminan, ya sea de forma voluntaria o involuntaria.

<!--more-->

Las interrupciones voluntarias son iniciadas intencionalmente por los propietarios de las aplicaciones o administradores del clúster.
Las interrupciones involuntarias no son intencionales y pueden ser provocadas por
problemas inevitables como que los nodos se queden sin {{< glossary_tooltip text="recursos" term_id="infrastructure-resource" >}},
o por eliminaciones accidentales.

