---
title: Kubelet Summary API
content_type: reference
weight: 55
description: >-
  The kubelet Summary API for accessing node, pod, and container metrics.
---

<!-- overview -->

The kubelet exposes a Summary API at the `/stats/summary` endpoint that provides
aggregated metrics for nodes, pods, containers, and volumes. This API serves as a
primary source for resource usage data collected by the kubelet.

<!-- body -->

## Accessing the Summary API

You can access the Summary API through the Kubernetes API server as a proxy:

```shell
kubectl get --raw "/api/v1/nodes/<NODE_NAME>/proxy/stats/summary"
```

Replace `<NODE_NAME>` with the name of the node you want to query.

Alternatively, if you have direct access to the kubelet port (typically 10250),
you can query it directly:

```shell
curl -k https://<NODE_IP>:10250/stats/summary
```

{{< note >}}
Direct access to the kubelet requires proper authentication and is typically
restricted in production environments. The `-k` flag bypasses certificate 
verification, leaving the connection subject to MITM attacks. Using `kubectl 
proxy` is the recommended approach for secure access.
{{< /note >}}

## API Response Structure

The Summary API returns a JSON object containing comprehensive metrics organized
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
      "containers": [...],
      "cpu": {...},
      "memory": {...},
      "network": {...},
      "volume": [...],
      "ephemeral-storage": {...},
      "process_stats": {...}
    }
  ]
}
```

## Metrics Categories

### Node-Level Metrics

- **CPU**: Usage statistics including total usage and cumulative usage
- **Memory**: Working set, available memory, usage, RSS, and page faults
- **Network**: Interface statistics with RX/TX bytes and errors
- **Filesystem**: Capacity, available space, and usage for the root filesystem
- **Runtime**: Container runtime information and image filesystem stats
- **Rlimit**: System resource limits

### Pod-Level Metrics

- **CPU**: Aggregate CPU usage for all containers in the pod
- **Memory**: Aggregate memory statistics for the pod
- **Network**: Pod-level network I/O statistics
- **Volume**: Usage statistics for each volume mounted in the pod
- **Ephemeral Storage**: Total filesystem usage for containers and emptyDir volumes

### Container-Level Metrics

- **CPU**: Per-container CPU usage and cumulative usage
- **Memory**: Per-container memory statistics
- **Rootfs**: Container writable layer usage
- **Logs**: Container logs storage usage
- **Accelerators**: GPU and other accelerator metrics (if applicable)
- **User-defined metrics**: Custom metrics exposed by containers

## Data Sources

By default, the kubelet collects these metrics using an embedded
[cAdvisor](https://github.com/google/cadvisor). However, when the
`PodAndContainerStatsFromCRI` [feature gate](/docs/reference/command-line-tools-reference/feature-gates/)
is enabled, the kubelet can fetch pod and container metrics directly from the
[Container Runtime Interface (CRI)](/docs/concepts/architecture/cri/).

## Common Use Cases

1. **Monitoring Solutions**: Tools like metrics-server (prior to v0.6.x) use the
   Summary API to collect cluster-wide metrics.

2. **Debugging Resource Usage**: Administrators can query the API to understand
   actual resource consumption versus configured requests and limits.

3. **Custom Autoscaling**: The Summary API can provide data for custom autoscaling
   solutions or vertical pod autoscaling.

4. **Capacity Planning**: Historical data from the Summary API helps in understanding
   resource utilization patterns.

## Limitations and Considerations

- Starting with metrics-server v0.6.x, the preferred endpoint is `/metrics/resource`
  instead of `/stats/summary`.
- The Summary API provides point-in-time data and doesn't store historical metrics.
- Access to the Summary API requires appropriate RBAC permissions when accessed
  through the API server.
- The data format is specific to Kubernetes and differs from Prometheus-style metrics.

## {{% heading "whatsnext" %}}

- Learn more about [Node Metrics](/docs/reference/instrumentation/node-metrics/)
- Explore [CRI Pod & Container Metrics](/docs/reference/instrumentation/cri-pod-container-metrics/)
- Read about [Kubernetes Metrics](/docs/concepts/cluster-administration/system-metrics/)