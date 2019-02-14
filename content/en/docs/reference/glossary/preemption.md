---
title: Preemption
id: preemption
date: 2019-01-31
full_link: https://kubernetes.io/docs/concepts/configuration/pod-priority-preemption/#preemption
short_description: >
  Preemption logic in Kubernetes helps a pending Pod to find a suitable Node by evicting low priority Pods existing on that Node.

aka:
tags:
- operation
---
 Preemption logic in Kubernetes helps a pending Pod to find a suitable Node by evicting low priority Pods existing on that Node.

<!--more-->

If a Pod cannot be scheduled, the scheduler tries to [preempt](https://kubernetes.io/docs/concepts/configuration/pod-priority-preemption/#preemption) lower priority Pods to make scheduling of the pending Pod possible.
