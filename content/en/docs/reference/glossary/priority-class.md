---
title: Priority Class
id: priority-class
date: 2023-07-10
full_link: /docs/concepts/configuration/pod-priority-preemption/#priorityclass
short_description: >
 the PriorityClass is a resource that allows you to assign priorities to different pods within a cluster It helps the scheduler prioritize the scheduling of pods based on their importance or criticality.

aka:
tags:
- operation
---
 the PriorityClass is a resource that allows you to assign priorities to different pods within a     {{< glossary_tooltip term_id="cluster" >}}. It helps the scheduler prioritize the scheduling of pods based on their importance or criticality.



<!--more-->

The [PriorityClass](/docs/concepts/scheduling-eviction/pod-priority-preemption/#priorityClass) is defined as a Kubernetes resource object and consists of a priority value. The priority value is an integer ranging from 0 to 1000000000, where 0 represents the highest priority. Higher values indicate lower priorities. In addition, a global default priority can be set for pods that do not have an explicit PriorityClass assigned to them.







 

 