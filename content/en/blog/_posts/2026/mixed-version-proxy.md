---
layout: blog
title: "Kubernetes v1.36: Mixed Version Proxy Graduates to Beta "
date: 2026-05-15T10:00:00-08:00
slug: kubernetes-1-36-feature-mixed-version-proxy-beta
author: >
  Richa Banker (Google)
---

Back in Kubernetes 1.28, we introduced the `Mixed Version Proxy (MVP)` as an Alpha feature (under the feature gate `UnknownVersionInteroperabilityProxy`) in a [previous blog post](/blog/2023/08/28/kubernetes-1-28-feature-mixed-version-proxy-alpha/). The goal was simple but critical: make cluster upgrades safer by ensuring that requests for resources not yet known to an older API server are correctly routed to a newer peer API server, instead of returning an incorrect `404 Not Found`.

We are excited to announce that the Mixed Version Proxy is moving to Beta in Kubernetes 1.36 and will be enabled by default! The feature has evolved significantly since its initial release, addressing key gaps and modernizing its architecture.

Here is a look at how the feature has evolved and what you need to know to leverage it in your clusters.

## What problem are we solving?

In a highly available control plane undergoing an upgrade, you often have API servers running different versions. These servers might serve different sets of APIs (Groups, Versions, Resources).
Without MVP, if a client request lands on an API server that does not serve the requested resource (e.g., a new API version introduced in the upgrade), that server returns a `404 Not Found`. This is technically incorrect because the resource is available in the cluster, just not on that specific server. This can lead to serious side effects, such as mistaken garbage collection or blocked namespace deletions.
MVP solves this by proxying the request to a peer API server that can serve it.

{{< mermaid >}}
sequenceDiagram
    participant Client
    participant API_Server_A as API Server A (Older/Different)
    participant API_Server_B as API Server B (Newer/Capable)
    
    Client->>API_Server_A: 1. Request for Resource (e.g., v2)
    Note over API_Server_A: Determines it cannot serve locally
    API_Server_A->>API_Server_A: 2. Looks up capable peer in Discovery Cache
    API_Server_A->>API_Server_B: 3. Proxies request (adds x-kubernetes-peer-proxied header)
    API_Server_B->>API_Server_B: 4. Processes request locally
    API_Server_B-->>API_Server_A: 5. Returns Response
    API_Server_A-->>Client: 6. Forwards Response
{{< /mermaid >}}

## How has it evolved since 1.28

The initial Alpha implementation was a great proof of concept, but it had some limitations and relied on older mechanisms. Here is how we have modernized it for Beta:

1. From StorageVersion API to Aggregated Discovery
In the Alpha version, API servers relied on the `StorageVersion API` to figure out which peers served which resources. While functional, this approach had a significant limitation: the `StorageVersion API` is not yet supported for CRDs and aggregated APIs.
For Beta, we have replaced the reliance on `StorageVersion API` calls with the use of `Aggregated Discovery`. API servers now use the aggregated discovery data to dynamically understand the capabilities of their peers.

2. The Missing Piece: Peer-Aggregated Discovery
The [1.28 blog post](/blog/2023/08/28/kubernetes-1-28-feature-mixed-version-proxy-alpha/) noted a significant gap: while we could proxy resource requests, discovery requests still only showed what the local API server knew about.
In 1.36, we have added `Peer-Aggregated Discovery` support! Now, when a client performs discovery (e.g., listing available APIs), the API server merges its local view with the discovery data from all active peers. This provides clients with a complete, unified view of all APIs available across the entire cluster, regardless of which API server they connected to.

{{< mermaid >}}
sequenceDiagram
    participant Client
    participant API_Server_A as API Server A
    participant API_Server_B as API Server B
    
    Client->>API_Server_A: 1. Request Discovery Document
    API_Server_A->>API_Server_A: 2. Gets Local APIs
    API_Server_A->>API_Server_B: 3. Gets Peer APIs (Cached or Direct)
    API_Server_A->>API_Server_A: 4. Merges and sorts lists deterministically
    API_Server_A-->>Client: 5. Returns Unified Discovery Document
{{< /mermaid >}}

While peer-aggregated discovery will be the default behavior (note that peer-aggregated discovery is enabled if the `--peer-ca-file` flag is set, otherwise the server will fallback to showing only its local APIs), there may be cases where you need to inspect only the resources served by the specific API server you are connected to. You can request this non-aggregated view by including the `profile=nopeer` parameter in your request's `Accept` header (e.g., `Accept: application/json;g=apidiscovery.k8s.io;v=v2;as=APIGroupDiscoveryList;profile=nopeer`).


## Required configuration 

While the feature gate will be enabled by default, it requires certain flags to be set to allow for secure communication between peer API servers. To function correctly, make sure your API server is configured with the following flags:

- `--feature-gates=UnknownVersionInteroperabilityProxy=true`: This will be default in 1.36, but it is good to verify
- `--peer-ca-file=<path-to-ca>`: [CRITICAL] This is a required flag. You must provide the CA bundle that the source API server will use to authenticate the serving certificates of destination peer API servers. Without this, proxying will fail due to TLS verification errors.
- `--peer-advertise-ip` and `--peer-advertise-port`: These flags are used to set the network address that peers should use to reach this API server. If unset, the values from `--advertise-address` or `--bind-address` are used. If you have complex network topologies where API servers communicate over a specific internal interface, setting these flags explicitly is highly recommended.

### Configuring with `kubeadm`

If you manage your cluster with `kubeadm`, you can configure these flags in your `ClusterConfiguration` file:

```yaml
apiVersion: kubeadm.k8s.io/v1beta4
kind: ClusterConfiguration
apiServer:
  extraArgs:
    peer-ca-file: "/etc/kubernetes/pki/ca.crt"
    # peer-advertise-ip and port if needed
```

## Call to action

If you are running multi-master clusters and upgrading them regularly, the Mixed Version Proxy is a major safety improvement. With it becoming default in 1.36, we encourage you to:

1. Review your API server flags to ensure `--peer-ca-file` is set properly.
2. Test the feature in your staging environments as you prepare for the 1.36 upgrade.
3. Provide feedback to SIG API Machinery ([Slack](https://kubernetes.slack.com/messages/sig-api-machinery/), [mailing list](https://groups.google.com/g/kubernetes-sig-api-machinery), or by [attending SIG API Machinery meetings](https://github.com/kubernetes/community/tree/master/sig-api-machinery#meetings)) on your experience.
