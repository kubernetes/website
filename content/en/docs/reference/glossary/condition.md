---
title: Condition
id: condition
date: 2026-01-11
full_link: /docs/concepts/workloads/pods/pod-lifecycle/#pod-conditions
short_description: >
  A condition represents the current state of a Kubernetes resource, providing information about whether certain aspects of the resource are true.

aka:
tags:
- fundamental
---
A condition is a field in a Kubernetes resource's status that describes the current state of that resource.

<!--more-->

Conditions provide a standardized way for Kubernetes components to communicate the status of resources. Each condition has a `type`, a `status` (True, False, or Unknown), and optional fields like `reason` and `message` that provide additional details. For example, a Pod might have conditions like `Ready`, `ContainersReady`, or `PodScheduled`.
