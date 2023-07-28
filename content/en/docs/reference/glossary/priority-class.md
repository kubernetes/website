---
title: Priority Class
id: priority-class
date: 2023-07-10
full_link: /docs/concepts/scheduling-eviction/pod-priority-preemption/#priorityclass
short_description: >
 The PriorityClass is a resource that allows you to assign priorities to different pods within a cluster It helps the scheduler prioritize the scheduling of pods based on their importance or criticality.
aka:
tags:
    - core-object
    - workload
---
A Priority Class maps a name to a priority value as an integer, and is not namespaced
<!--more-->
The [PriorityClass](/docs/concepts/scheduling-eviction/pod-priority-preemption/#priorityclass) is a non-namespaced object mapping a name to an integer priority. The name is specified in the name field, and the priority value in the value field. Priorities range from -2147483648 to 1000000000 inclusive. Higher values indicate higher priority.