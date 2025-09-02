---
title: Node metrics data
content_type: reference
weight: 50
description: >-
  Mechanisms for accessing metrics at node, volume, pod and container level,
  as seen by the kubelet.
---

The [kubelet](/docs/reference/command-line-tools-reference/kubelet/)
gathers metric statistics at the node, volume, pod and container level,
and emits this information in the
[Summary API](/docs/reference/config-api/kubelet-stats.v1alpha1/).

You can send a proxied request to the stats summary API via the
Kubernetes API server.

Here is an example of a Summary API request for a node named `minikube`:

```shell
kubectl get --raw "/api/v1/nodes/minikube/proxy/stats/summary"
```

Here is the same API call using `curl`:

```shell
# You need to run "kubectl proxy" first
# Change 8080 to the port that "kubectl proxy" assigns
curl http://localhost:8080/api/v1/nodes/minikube/proxy/stats/summary
```

{{< note >}}
Beginning with `metrics-server` 0.6.x, `metrics-server` queries the `/metrics/resource`
kubelet endpoint, and not `/stats/summary`.
{{< /note >}}

## Summary metrics API source {#summary-api-source}

By default, Kubernetes fetches node summary metrics data using an embedded
[cAdvisor](https://github.com/google/cadvisor) that runs within the kubelet. If you 
enable the `PodAndContainerStatsFromCRI` [feature gate](/docs/reference/command-line-tools-reference/feature-gates/) 
in your cluster, and you use a container runtime that supports statistics access via
{{< glossary_tooltip term_id="cri" text="Container Runtime Interface">}} (CRI), then
the kubelet [fetches Pod- and container-level metric data using CRI](/docs/reference/instrumentation/cri-pod-container-metrics), and not via cAdvisor.

## Pressure Stall Information (PSI) {#psi}

{{< feature-state for_k8s_version="v1.34" state="beta" >}}

As a beta feature, Kubernetes lets you configure kubelet to collect Linux kernel
[Pressure Stall Information](https://docs.kernel.org/accounting/psi.html)
(PSI) for CPU, memory, and I/O usage. The information is collected at node, pod and container level.
See [Summary API](/docs/reference/config-api/kubelet-stats.v1alpha1/) for detailed schema.
This feature is enabled by default, by setting the `KubeletPSI` [feature gate](/docs/reference/command-line-tools-reference/feature-gates/). The information is also exposed in
[Prometheus metrics](/docs/concepts/cluster-administration/system-metrics#psi-metrics).

You can learn how to interpret the PSI metrics in [Understand PSI Metrics](/docs/reference/instrumentation/understand-psi-metrics/).

### Requirements

Pressure Stall Information requires:

- [Linux kernel versions 4.20 or later](/docs/reference/node/kernel-version-requirements#requirements-psi).
- [cgroup v2](/docs/concepts/architecture/cgroups)

## {{% heading "whatsnext" %}}

The task pages for [Troubleshooting Clusters](/docs/tasks/debug/debug-cluster/) discuss
how to use a metrics pipeline that rely on these data.
