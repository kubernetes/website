---
title: Priority Class
id: priority-class
date: 2023-07-10
full_link: /docs/concepts/scheduling-eviction/pod-priority-preemption/#priorityclass
short_description: >
 the PriorityClass is a resource that allows you to assign priorities to different pods within a cluster It helps the scheduler prioritize the scheduling of pods based on their importance or criticality.
aka:
tags:
- operation
---
 A Priority Class is an object that is not namespaced and it maps a priority class name to a priority value represented as an integer.
<!--more-->
The [PriorityClass](/docs/concepts/scheduling-eviction/pod-priority-preemption/#priorityclass) is a non-namespaced object that defines a mapping from a priority class name to the integer value of the priority. The name of the priority is specified in the `name` field, and the value of the priority is specified in the `value` field. The higher the value, the higher the priority. The value of PriorityClass object can be in range from -2147483648 to 1000000000 inclusive.