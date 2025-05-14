---
title: Dynamic Resource Allocation
id: dra
date: 2025-05-13
full_link: /docs/concepts/scheduling-eviction/dynamic-resource-allocation/
short_description: >
  A Kubernetes feature for requesting and sharing resources among Pods. These
  resources are often attached devices like hardware accelerators.

aka: DRA
tags:
- extension
---
 Dynamic Resource Allocation (DRA) is a Kubernetes feature that lets you
request and share resources among Pods. These resources are often attached
{{< glossary_tooltip text="devices" term_id="device" >}} like hardware accelerators.

<!--more-->

With DRA, device drivers and cluster admins define device _classes_ that are
available to request in a cluster. Developers "claim" devices within a device
class and specify their claims in workloads. Kubernetes allocates matching
devices to specific claims and places the corresponding Pods on nodes that
can access the allocated devices.
