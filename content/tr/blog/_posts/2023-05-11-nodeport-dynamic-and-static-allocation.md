---
layout: blog
title: "Kubernetes 1.27: Avoid Collisions Assigning Ports to NodePort Services"
date: 2023-05-11
slug: nodeport-dynamic-and-static-allocation
author: >
   Xu Zhenglun (Alibaba)
---

In Kubernetes, a Service can be used to provide a unified traffic endpoint for 
applications running on a set of Pods. Clients can use the virtual IP address (or _VIP_) provided
by the Service for access, and Kubernetes provides load balancing for traffic accessing
different back-end Pods, but a ClusterIP type of Service is limited to providing access to
nodes within the cluster, while traffic from outside the cluster cannot be routed.
One way to solve this problem is to use a `type: NodePort` Service, which sets up a mapping
to a specific port of all nodes in the cluster, thus redirecting traffic from the
outside to the inside of the cluster.

## How Kubernetes allocates node ports to Services?

When a `type: NodePort` Service is created, its corresponding port(s) are allocated in one
of two ways:

- **Dynamic** : If the Service type is `NodePort` and you do not set a `nodePort` 
  value explicitly in the `spec` for that Service, the Kubernetes control plane will
  automatically allocate an unused port to it at creation time.

- **Static** : In addition to the dynamic auto-assignment described above, you can also
  explicitly assign a port that is within the nodeport port range configuration.

The value of `nodePort` that you manually assign must be unique across the whole cluster.
Attempting to create a Service of `type: NodePort` where you explicitly specify a node port that
was already allocated results in an error.

## Why do you need to reserve ports of NodePort Service? 
Sometimes, you may want to have a NodePort Service running on well-known ports
so that other components and users inside o r outside the cluster can use them.

In some complex cluster deployments with a mix of Kubernetes nodes and other servers on the same network, 
it may be necessary to use some pre-defined ports for communication. In particular, some fundamental
components cannot rely on the VIPs that back `type: LoadBalancer` Services
because the virtual IP address mapping implementation for that cluster also relies on
these foundational components.

Now suppose you need to expose a Minio object storage service on Kubernetes to clients 
running outside the Kubernetes cluster, and the agreed port is `30009`, we need to 
create a Service as follows:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: minio
spec:
  ports:
  - name: api
    nodePort: 30009
    port: 9000
    protocol: TCP
    targetPort: 9000
  selector:
    app: minio
  type: NodePort
```

However, as mentioned before, if the port (30009) required for the `minio` Service is not reserved,
and another `type: NodePort` (or possibly `type: LoadBalancer`) Service is created and dynamically
allocated before or concurrently with the `minio` Service, TCP port 30009 might be allocated to that
other Service; if so, creation of the `minio` Service will fail due to a node port collision.

## How can you avoid NodePort Service port conflicts? 
Kubernetes 1.24 introduced changes for `type: ClusterIP` Services, dividing the CIDR range for cluster
IP addresses into two blocks that use different allocation policies to [reduce the risk of conflicts](/docs/reference/networking/virtual-ips/#avoiding-collisions).
In Kubernetes 1.27, as an alpha feature, you can adopt a similar policy for `type: NodePort` Services.
You can enable a new [feature gate](/docs/reference/command-line-tools-reference/feature-gates/)
`ServiceNodePortStaticSubrange`. Turning this on allows you to use a different port allocation strategy
for `type: NodePort` Services, and reduce the risk of collision.

The port range for `NodePort` will be divided, based on the formula `min(max(16, nodeport-size / 32), 128)`. 
The outcome of the formula will be a number between 16 and 128, with a step size that increases as the 
size of the nodeport range increases. The outcome of the formula determine that the size of static port 
range. When the port range is less than 16, the size of static port range will be set to 0, 
which means that all ports will be dynamically allocated.

Dynamic port assignment will use the upper band by default, once this has been exhausted it will use the lower range.
This will allow users to use static allocations on the lower band with a low risk of collision.

## Examples

### default range: 30000-32767
| Range properties        | Values                                                |
|-------------------------|-------------------------------------------------------|
| service-node-port-range | 30000-32767                                           |
| Band Offset             | &ensp; `min(max(16, 2768/32), 128)` <br>= `min(max(16, 86), 128)` <br>= `min(86, 128)` <br>= 86 |
| Static band start       | 30000                                                 |
| Static band end         | 30085                                                 |
| Dynamic band start      | 30086                                                 |
| Dynamic band end        | 32767                                                 |

{{< mermaid >}}
pie showData
    title 30000-32767
    "Static" : 86
    "Dynamic" : 2682
{{< /mermaid >}}

### very small range: 30000-30015
| Range properties        | Values                                                |
|-------------------------|-------------------------------------------------------|
| service-node-port-range | 30000-30015                                           |
| Band Offset             | 0                                                     |
| Static band start       | -                                                     |
| Static band end         | -                                                     |
| Dynamic band start      | 30000                                                 |
| Dynamic band end        | 30015                                                 |

{{< mermaid >}}
pie showData
    title 30000-30015
    "Static" : 0
    "Dynamic" : 16
{{< /mermaid >}}

### small(lower boundary) range: 30000-30127
| Range properties        | Values                                                |
|-------------------------|-------------------------------------------------------|
| service-node-port-range | 30000-30127                                           |
| Band Offset             | &ensp; `min(max(16, 128/32), 128)` <br>= `min(max(16, 4), 128)` <br>= `min(16, 128)` <br>= 16 |
| Static band start       | 30000                                                 |
| Static band end         | 30015                                                 |
| Dynamic band start      | 30016                                                 |
| Dynamic band end        | 30127                                                 |

{{< mermaid >}}
pie showData
    title 30000-30127
    "Static" : 16
    "Dynamic" : 112
{{< /mermaid >}}

### large(upper boundary) range: 30000-34095
| Range properties        | Values                                                |
|-------------------------|-------------------------------------------------------|
| service-node-port-range | 30000-34095                                           |
| Band Offset             | &ensp; `min(max(16, 4096/32), 128)` <br>= `min(max(16, 128), 128)` <br>= `min(128, 128)` <br>= 128 |
| Static band start       | 30000                                                 |
| Static band end         | 30127                                                 |
| Dynamic band start      | 30128                                                 |
| Dynamic band end        | 34095                                                 |

{{< mermaid >}}
pie showData
    title 30000-34095
    "Static" : 128
    "Dynamic" : 3968
{{< /mermaid >}}

### very large range: 30000-38191
| Range properties        | Values                                                |
|-------------------------|-------------------------------------------------------|
| service-node-port-range | 30000-38191                                           |
| Band Offset             | &ensp; `min(max(16, 8192/32), 128)` <br>= `min(max(16, 256), 128)` <br>= `min(256, 128)` <br>= 128 |
| Static band start       | 30000                                                 |
| Static band end         | 30127                                                 |
| Dynamic band start      | 30128                                                 |
| Dynamic band end        | 38191                                                 |

{{< mermaid >}}
pie showData
    title 30000-38191
    "Static" : 128
    "Dynamic" : 8064
{{< /mermaid >}}