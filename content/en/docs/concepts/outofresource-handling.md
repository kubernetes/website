---
title: Out of resource Eviction handling 
content_template: templates/concept
weight: 60
---

<!-- overview -->

This page explains how to configure out of resource handling with `kubelet`.

The `kubelet` needs to preserve node stability when available compute resources
are low. This is especially important when dealing with incompressible
compute resources, such as memory or disk space. If such resources are exhausted,
nodes become unstable.

The `kubelet` supports eviction decisions based on available memory and filesystem on both cluster nodes and containers. 

<!-- body -->

## {{% heading "whatsnext" %}}
- Read [Configure out of resource handling](/docs/tasks/administer-cluster/out-of-resource/) to learn more about eviction signals, thresholds, and handling.
