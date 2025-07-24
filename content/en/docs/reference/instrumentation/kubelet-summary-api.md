---
title: Kubelet Summary API
content_type: reference
weight: 55
description: >-
  The kubelet Summary API for accessing node, pod, and container metrics.
---

<!-- overview -->

The {{< glossary_tooltip text="kubelet" term_id="kubelet" >}} exposes a _Summary_
API at the `/stats/summary` endpoint, that provides
aggregated metrics for nodes, pods, containers, and volumes. This API serves as a
primary source for resource usage data collected by the kubelet.

<!-- body -->

## Accessing the Summary API

You can access the Summary API by using the Kubernetes
{{< glossary_tooltip term_id="kube-apiserver" text="API Server" >}}
as a proxy:

```shell
# To fetch the summary data, you must be authorized to proxy to this node
kubectl get --raw "/api/v1/nodes/<NODE_NAME>/proxy/stats/summary"
```

Replace `<NODE_NAME>` with the name of the node you want to query.

Alternatively, if you have direct access to the kubelet port (typically 10250),
you can query it directly:

```shell
# Because this command skips certificate checks, you should run it locally
# from the node. See the note about security for more information.
curl --insecure https://localhost:10250/stats/summary
```

{{< warning >}}
Direct access to the kubelet via HTTP requires proper authentication and is typically
restricted in production environments. The `--insecure` flag bypasses certificate 
verification, leaving the connection subject to interception (and, potentially,
making your credentials available to an attacker).

You should not use `curl` in insecure mode over a network you do not **fully** trust.

The Kubernetes project recommends that you use `kubectl proxy` for secure access.
{{< /warning >}}

## HTTP responses

The Summary API returns metrics in JSON format. The response contains comprehensive metrics organized
hierarchically:

```json
{
  "node": {
    "nodeName": "node-1",
    "systemContainers": [...],
    "startTime": "2024-01-01T00:00:00Z",
    "cpu": {...},
    "memory": {...},
    "network": {...},
    "fs": {...},
    "runtime": {...},
    "rlimit": {...}
  },
  "pods": [
    {
      "podRef": {
        "name": "pod-name",
        "namespace": "namespace",
        "uid": "pod-uid"
      },
      "startTime": "2024-01-01T00:00:00Z",
      "containers": [
        {
          "name": "container-name",
          "startTime": "2024-01-01T00:00:00Z",
          "cpu": {...},
          "memory": {...},
          "rootfs": {...},
          "logs": {...},
          "accelerators": [...]
        }
      ],
      "cpu": {...},
      "memory": {...},
      "network": {...},
      "volume": [...],
      "ephemeral-storage": {...}
    }
  ]
}
```

## Available metrics

Kubernetes {{< skew currentVersion >}} provides the following metrics:

### Node-level metrics

`cpu`
: Usage statistics including total usage and cumulative usage

`memory`
: Working set, available memory, usage, RSS, and page faults

`network`
: Interface statistics with RX/TX bytes and errors

`fs`
: Capacity, available space, and usage for the root filesystem

`runtime`
: Container runtime information and image filesystem stats

`rlimit`
: System resource limits

### Pod-level metrics

`cpu`
: Aggregate CPU usage for all containers in the pod

`memory`
: Aggregate memory statistics for the pod

`network`
: Pod-level network I/O statistics

`volume`
: Usage statistics for each volume mounted in the pod

`ephemeral-storage`
: Total filesystem usage for containers and emptyDir volumes

### Container-level metrics

`cpu`
: Per-container CPU usage and cumulative usage

`memory`
: Per-container memory statistics

`rootfs`
: Container writable layer usage

`logs`
: Container logs storage usage

`accelerators`
: GPU and other accelerator metrics (if applicable)

User-defined metrics
: Custom metrics exposed by containers

## Data sources

By default, the kubelet collects these metrics using an embedded
[cAdvisor](https://github.com/google/cadvisor). However, when the
`PodAndContainerStatsFromCRI` [feature gate](/docs/reference/command-line-tools-reference/feature-gates/)
is enabled, the kubelet can fetch pod and container metrics directly from the
[Container Runtime Interface (CRI)](/docs/concepts/architecture/cri/).

## Common use cases {#use-cases}

1. **Monitoring Solutions**: Tools like metrics-server (prior to v0.6.x) use the
   Summary API to collect cluster-wide metrics.

2. **Debugging Resource Usage**: Administrators can query the API to understand
   actual resource consumption versus configured requests and limits.

3. **Custom Autoscaling**: The Summary API can provide data for custom autoscaling
   solutions or [vertical pod autoscaling](/docs/concepts/workloads/autoscaling/#scaling-workloads-vertically).

4. **Capacity Planning**: Historical data from the Summary API helps in understanding
   resource utilization patterns.

## Limitations and considerations

- Starting with metrics-server v0.6.x, the preferred endpoint is `/metrics/resource`
  instead of `/stats/summary`.
- The Summary API provides point-in-time data and doesn't store historical metrics.
- Access to the Summary API via the API server requires appropriate permissions.
  See [authorization](/docs/reference/access-authn-authz/authorization/) for more information.
- The data format is specific to Kubernetes; it's not a standard format such as
  OpenMetrics or Prometheus.

## {{% heading "whatsnext" %}}

- Learn more about [Node Metrics](/docs/reference/instrumentation/node-metrics/)
- Explore [CRI Pod & Container Metrics](/docs/reference/instrumentation/cri-pod-container-metrics/)
- Read about [Kubernetes Metrics](/docs/concepts/cluster-administration/system-metrics/)