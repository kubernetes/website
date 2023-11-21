---
title: Priority Class
id: priority-class
date: 2023-11-20
full_link: /docs/concepts/scheduling-eviction/pod-priority-preemption/
short_description: >
  An object that defines the importance of a Pod relative to other Pods. 

tags:
- operation
---
An object that defines the importance of a {{< glossary_tooltip text="Pod" term_id="pod" >}} relative to other Pods.

<!--more-->

A non-namespaced object that allows application owners to set different levels of importance to Pods. Pods with higher importance will be prioritized by the scheduler. For example, if a Pod cannot be scheduled, the scheduler tries to preempt (evict) lower priority Pods to make scheduling of the more important Pod possible.

To learn more, read [Pod Priority and Preemption](/docs/concepts/scheduling-eviction/pod-priority-preemption/).
