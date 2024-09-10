---
title: PriorityClass
id: priority-class
date: 2024-03-19
full_link: /docs/concepts/scheduling-eviction/pod-priority-preemption/#priorityclass
short_description: >
  A mapping from a class name to the scheduling priority that a Pod should have.
aka:
tags:
- core-object
---
A PriorityClass is a named class for the scheduling priority that should be assigned to a Pod
in that class.

<!--more-->

A [PriorityClass](/docs/concepts/scheduling-eviction/pod-priority-preemption/#how-to-use-priority-and-preemption)
is a non-namespaced object mapping a name to an integer priority, used for a Pod. The name is
specified in the `metadata.name` field, and the priority value in the `value` field. Priorities range from
-2147483648 to 1000000000 inclusive. Higher values indicate higher priority.
