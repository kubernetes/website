---
title: PodTemplate
id: pod-template
date: 2024-10-13
short_description: >
  A template for creating Pods.

aka: 
  - pod template
tags:
- core-object

---
An API object that defines a template for creating {{< glossary_tooltip text="Pods" term_id="pod" >}}.
The PodTemplate API is also embedded in API definitions for workload management, such as 
{{< glossary_tooltip text="Deployment" term_id="deployment" >}} or
{{< glossary_tooltip text="StatefulSets" term_id="StatefulSet" >}}.

<!--more--> 

Pod templates allow you to define common metadata (such as labels, or a template for the name of a
new Pod) as well as to specify a pod's desired state.
[Workload management](/docs/concepts/workloads/controllers/) controllers use Pod templates
(embedded into another object, such as a Deployment or StatefulSet)
to define and manage one or more {{< glossary_tooltip text="Pods" term_id="pod" >}}.
When there can be multiple Pods based on the same template, these are called
{{< glossary_tooltip term_id="replica" text="replicas" >}}.
Although you can create a PodTemplate object directly, you rarely need to do so.
