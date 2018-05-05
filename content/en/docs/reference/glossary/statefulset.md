---
title: StatefulSet
id: statefulset
date: 2018-04-12
full_link: /docs/concepts/workloads/controllers/statefulset/
short_description: >
  Manages the deployment and scaling of a set of Pods, *and provides guarantees about the ordering and uniqueness* of these Pods.

aka: 
tags:
- fundamental
- core-object
- workload
- storage
---
 Manages the deployment and scaling of a set of {{< glossary_tooltip text="Pods" term_id="pod" >}}, *and provides guarantees about the ordering and uniqueness* of these Pods.

<!--more--> 

Like a {{< glossary_tooltip term_id="deployment" >}}, a StatefulSet manages Pods that are based on an identical container spec. Unlike a Deployment, a StatefulSet maintains a sticky identity for each of their Pods. These pods are created from the same spec, but are not interchangeable&#58; each has a persistent identifier that it maintains across any rescheduling.

A StatefulSet operates under the same pattern as any other Controller. You define your desired state in a StatefulSet *object*, and the StatefulSet *controller* makes any necessary updates to get there from the current state.

