---
title: "Hardening Guide - Resource Limits"
description: >
    Information about improving workload security with respect to resource limits.
content_type: concept
weight: 90
---

<!-- overview -->
Kubernetes allows setting limits of different kinds through , {{< glossary_tooltip text="resource quotas" term_id="resource-quota" >}}, {{< glossary_tooltip text="container resource constraints" term_id="infrastructure-resource" >}}, {{< glossary_tooltip text="LimitRanges" term_id="limitrange" >}}, and {{< glossary_tooltip text="process id limits" term_id="pid-limits" >}}

Although using limits provides ceilings in different context, their absence might have different security implications. 

<!-- body -->
## Workload Resource Limits

### Memory Limits
<!-- Memory limits details here -->

### CPU Limits
<!-- CPU limits details here -->

### Other resources
<!-- Huge pages, device resource limits like GPU -->

## Types of limits


### Resource quota

A resource quota, defined by a ResourceQuota object, provides constraints that limit aggregate resource consumption per namespace. A ResourceQuota can also limit the quantity of objects that can be created in a namespace by API kind, as well as the total amount of infrastructure resources that may be consumed by API objects found in that namespace.


Setting up Resource quotas ensure a namespace does not exceed provide amount from the resource quota


### PID Limits
<!-- PID limits -->

### Limit Ranges
<!-- Limit ranges -->
