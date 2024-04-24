---
title: 'Process ID Limiting for Stability Improvements in Kubernetes 1.14'
date: 2019-04-15
---

**Author: Derek Carr** 

Have you ever seen someone take more than their fair share of the cookies? The one person who reaches in and grabs a half dozen fresh baked chocolate chip chunk morsels and skitters off like Cookie Monster exclaiming “Om nom nom nom.”

In some rare workloads, a similar occurrence was taking place inside Kubernetes clusters. With each Pod and Node, there comes a finite number of possible process IDs (PIDs) for all applications to share. While it is rare for any one process or pod to reach in and grab all the PIDs, some users were experiencing resource starvation due to this type of behavior. So in Kubernetes 1.14, we introduced an enhancement to mitigate the risk of a single pod monopolizing all of the PIDs available.

## Can You Spare Some PIDs?

Here, we’re talking about the greed of certain containers. Outside the ideal, runaway processes occur from time to time, particularly in clusters where testing is taking place. Thus, some wildly non-production-ready activity is happening. 

In such a scenario, it’s possible for something akin to a fork bomb taking place inside a node. As resources slowly erode, being taken over by some zombie-like process that continually spawns children, other legitimate workloads begin to get bumped in favor of this inflating balloon of wasted processing power. This could result in other processes on the same pod being starved of their needed PIDs. It could also lead to interesting side effects as a node could fail and a replica of that pod is scheduled to a new machine where the process repeats across your entire cluster.

## Fixing the Problem

Thus, in Kubernetes 1.14, we have added a feature that allows for the configuration of a kubelet to limit the number of PIDs a given pod can consume. If that machine supports 32,768 PIDs and 100 pods, one can give each pod a budget of 300 PIDs to prevent total exhaustion of PIDs. If the admin wants to overcommit PIDs similar to cpu or memory, they may do so as well with some additional risks. Either way, no one pod can bring the whole machine down. This will generally prevent against simple fork bombs from taking over your cluster.

This change allows administrators to protect one pod from another, but does not ensure if all pods on the machine can protect the node, and the node agents themselves from falling over. Thus, we’ve introduced a feature in this release in alpha form that provides isolation of PIDs from end user workloads on a pod from the node agents (kubelet, runtime, etc.). The admin is able to reserve a specific number of PIDs--similar to how one reserves CPU or memory today--and ensure they are never consumed by pods on that machine. Once that graduates from alpha, to beta, then stable in future releases of Kubernetes, we’ll have protection against an easily starved Linux resource.

Get started with [Kubernetes 1.14](https://github.com/kubernetes/kubernetes/releases/tag/v1.14.0).

## Get Involved 

If you have feedback for this feature or are interested in getting involved with the design and development, join the [Node Special Interest Group](https://github.com/kubernetes/community/tree/master/sig-node).

### About the author:
Derek Carr is Senior Principal Software Engineer at Red Hat. He is a Kubernetes contributor and member of the Kubernetes Community Steering Committee.

