---
title: Resource Driver
id: resource-driver
date: 2023-10-16
full_link: /docs/concepts/extend-kubernetes/compute-storage-net/resource-drivers/
short_description: >
  Software extensions to let Pods access devices that need vendor-specific initialization or setup
aka:
tags:
- extension
- fundamental
---
 A resource driver is responsible for allocation of non-native resources requested by
{{< glossary_tooltip term_id="ResourceClaim" text="ResourceClaims">}}.

<!--more-->

Typically consists of one controller {{< glossary_tooltip term_id="pod" text="Pod ">}} and many
kubelet plugin Pods. Controller allocates hardware resources requested by ResourceClaim.
Kubelet plugin discovers supported hardware devices, advertises them to controller, prepares and
unprepares the allocated resources when {{< glossary_tooltip term_id="kubelet" text="kubelet" >}}
is preparing to start or has stopped the Pod.

There can be multiple {{< glossary_tooltip term_id="ResourceClass" text="ResourceClasses">}}
associated with one Resource Driver, typically in such case they have different
{{< glossary_tooltip term_id="ResourceClassParameters" text="ResourceClassParameters">}}
that customize resources allocation process.


See
[Dynamic Resource Allocation](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/)
for more information.
