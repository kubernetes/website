---
title: Priority Class
id: priority-class
date: 2023-07-10
full_link: /docs/concepts/scheduling-eviction/pod-priority-preemption/#priorityclass
short_description: >
  PriorityClass resource assigns priorities to pods, helping the scheduler prioritize scheduling based on importance or criticality.
aka:
tags:
  - core-object
  - workload
---
A Priority Class maps a name to a priority value as an integer and is not namespaced.
<!-- more -->
The PriorityClass is a non-namespaced object mapping a name to an integer priority. The name is specified in the name field, and the priority value in the value field. Priorities range from -2147483648 to 1000000000 inclusive. Higher values indicate higher priority.
