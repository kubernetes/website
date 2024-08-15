---
title: Pod
id: pod
date: 2018-04-12
full_link: /docs/concepts/workloads/pods/
short_description: >
  Ein Pod stellt ein Satz laufender Container in Ihrem Cluster dar.

aka: 
tags:
- core-object
- fundamental
---
 Das kleinste und einfachste Kubernetesobjekt. Ein Pod stellt ein Satz laufender {{< glossary_tooltip text="Container" term_id="container" >}} in Ihrem Cluster dar.

<!--more--> 

Ein Pod wird typischerweise verwendet, um einen einzelnen primären Container laufen zu lassen. Es kann optional auch "sidecar" Container laufen lassen, die zusätzliche Features, wie logging, hinzufügen. Pods werden normalerweise durch ein {{< glossary_tooltip text="Deployment" term_id="deployment" >}} verwaltet.
