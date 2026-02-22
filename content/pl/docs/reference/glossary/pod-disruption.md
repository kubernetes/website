---
id: pod-disruption
title: Przerwanie działania Poda
full_link: /docs/concepts/workloads/pods/disruptions/
date: 2021-05-12
short_description: >
  Dobrowolnie lub wymuszone zakończenie działania Podów na węzłach.

aka:
related:
 - pod
 - container
tags:
 - operation
---

[Zakłócenie działania Poda](/docs/concepts/workloads/pods/disruptions/) to
proces, w ramach którego Pody na węzłach są zakończone dobrowolnie lub mimowolnie. 

<!--more--> 

Dobrowolne zakłócenia są inicjowane celowo przez właścicieli aplikacji lub
administratorów klastra. Mimowolne zakłócenia są niezamierzone i mogą być spowodowane nieuniknionymi
problemami, takimi jak wyczerpanie
{{< glossary_tooltip text="zasobów" term_id="infrastructure-resource" >}} na węzłach, lub przypadkowymi usunięciami.
