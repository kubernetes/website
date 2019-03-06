---
reviewers:
- derekwaynecarr
- dashpole
- RobertKrawitz
title: Pid Limiting
content_template: templates/concept
---

{{% capture overview %}}
{{< feature-state state="beta" >}}

This page explains how to configure pid limiting with the `kubelet`.

Pids are a fundamental resource on Linux hosts. It is trivial to hit the task
limit without hitting any other resource limits and cause instability to a host
machine.

Administrators require mechanisms to ensure that user pods cannot induce pid
exhaustion that prevents host daemons (runtime, kubelet, etc) from running. In
addition, it is important to ensure that pids are limited among pods in order to
ensure they have limited impact to other workloads on the node.

{{% /capture %}}

{{% capture body %}}

## Pod to Pod Isolation of Pids

The `SupportPodPidsLimit` feature gate is *beta*.

If enabled, the `kubelet` argument for `pod-max-pids` will write out the configured
pid limit to the pod level cgroup to the value specified on Linux hosts. If -1,
the `kubelet` will default to the node allocatable pid capacity.

## Node to Pod Isolation of Pids

The `SupportNodePidsLimit` feature gate is *alpha*.

If enabled, the node allocatable feature is able to reserve a number of pids for
system components.  The `pids` resource is supported when specifying `system-reserved`
and `kube-reserved` flags for the `kubelet`.

{{% /capture %}}
