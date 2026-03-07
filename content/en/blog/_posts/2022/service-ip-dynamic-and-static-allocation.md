---
layout: blog
title: "Kubernetes 1.24: Avoid Collisions Assigning IP Addresses to Services"
date: 2022-05-23
slug: service-ip-dynamic-and-static-allocation
author: >
  Antonio Ojea (Red Hat)
---

In Kubernetes, [Services](/docs/concepts/services-networking/service/) are an abstract way to expose
an application running on a set of Pods. Services
can have a cluster-scoped virtual IP address (using a Service of `type: ClusterIP`).
Clients can connect using that virtual IP address, and Kubernetes then load-balances traffic to that
Service across the different backing Pods.

## How Service ClusterIPs are allocated?

A Service `ClusterIP` can be assigned:

_dynamically_
: the cluster's control plane automatically picks a free IP address from within the configured IP range for `type: ClusterIP` Services.

_statically_
: you specify an IP address of your choice, from within the configured IP range for Services.

Across your whole cluster, every Service `ClusterIP` must be unique.
Trying to create a Service with a specific `ClusterIP` that has already
been allocated will return an error.

## Why do you need to reserve Service Cluster IPs?

Sometimes you may want to have Services running in well-known IP addresses, so other components and
users in the cluster can use them.

The best example is the DNS Service for the cluster. Some Kubernetes installers assign the 10th address from
the Service IP range to the DNS service. Assuming you configured your cluster with Service IP range
10.96.0.0/16 and you want your DNS Service IP to be 10.96.0.10, you'd have to create a Service like
this:

```yaml
apiVersion: v1
kind: Service
metadata:
  labels:
    k8s-app: kube-dns
    kubernetes.io/cluster-service: "true"
    kubernetes.io/name: CoreDNS
  name: kube-dns
  namespace: kube-system
spec:
  clusterIP: 10.96.0.10
  ports:
  - name: dns
    port: 53
    protocol: UDP
    targetPort: 53
  - name: dns-tcp
    port: 53
    protocol: TCP
    targetPort: 53
  selector:
    k8s-app: kube-dns
  type: ClusterIP
```

but as I explained before, the IP address 10.96.0.10 has not been reserved; if other Services are created
before or in parallel with dynamic allocation, there is a chance they can allocate this IP, hence,
you will not be able to create the DNS Service because it will fail with a conflict error.

## How can you avoid Service ClusterIP conflicts? {#avoid-ClusterIP-conflict}

In Kubernetes 1.24, you can enable a new feature gate `ServiceIPStaticSubrange`.
Turning this on allows you to use a different IP
allocation strategy for Services, reducing the risk of collision.

The `ClusterIP` range will be divided, based on the formula `min(max(16, cidrSize / 16), 256)`,
described as _never less than 16 or more than 256 with a graduated step between them_.

Dynamic IP assignment will use the upper band by default, once this has been exhausted it will
use the lower range. This will allow users to use static allocations on the lower band with a low
risk of collision.

Examples:

#### Service IP CIDR block: 10.96.0.0/24

Range Size: 2<sup>8</sup> - 2 = 254  
Band Offset: `min(max(16, 256/16), 256)` = `min(16, 256)` = 16  
Static band start: 10.96.0.1  
Static band end: 10.96.0.16  
Range end: 10.96.0.254   

{{< mermaid >}}
pie showData
    title 10.96.0.0/24
    "Static" : 16
    "Dynamic" : 238
{{< /mermaid >}}

#### Service IP CIDR block: 10.96.0.0/20

Range Size: 2<sup>12</sup> - 2 = 4094  
Band Offset: `min(max(16, 4096/16), 256)` = `min(256, 256)` = 256  
Static band start: 10.96.0.1  
Static band end: 10.96.1.0  
Range end: 10.96.15.254  

{{< mermaid >}}
pie showData
    title 10.96.0.0/20
    "Static" : 256
    "Dynamic" : 3838
{{< /mermaid >}}

#### Service IP CIDR block: 10.96.0.0/16

Range Size: 2<sup>16</sup> - 2 = 65534  
Band Offset: `min(max(16, 65536/16), 256)` = `min(4096, 256)` = 256  
Static band start: 10.96.0.1  
Static band ends: 10.96.1.0  
Range end: 10.96.255.254  

{{< mermaid >}}
pie showData
    title 10.96.0.0/16
    "Static" : 256
    "Dynamic" : 65278
{{< /mermaid >}}

## Get involved with SIG Network

The current SIG-Network [KEPs](https://github.com/orgs/kubernetes/projects/10) and [issues](https://github.com/kubernetes/kubernetes/issues?q=is%3Aopen+is%3Aissue+label%3Asig%2Fnetwork) on GitHub illustrate the SIG’s areas of emphasis.

[SIG Network meetings](https://github.com/kubernetes/community/tree/master/sig-network) are a friendly, welcoming venue for you to connect with the community and share your ideas.
Looking forward to hearing from you!

