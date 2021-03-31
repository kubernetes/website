---
reviewers:
- robscott
title: Enabling Topology Aware Hints
content_type: task
min-kubernetes-server-version: 1.21
---

<!-- overview -->
{{< feature-state for_k8s_version="v1.21" state="alpha" >}}

_Topology Aware Hints_ enable topology aware routing with topology hints
included in EndpointSlices. This approach tries to keep traffic close to where
it originated from. This can result in decreased costs and improved performance.

## {{% heading "prerequisites" %}}

  {{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

The following prerequisite is needed in order to enable topology aware hints:

* {{< glossary_tooltip text="Kube-proxy" term_id="kube-proxy" >}} running in
  iptables mode or IPVS mode
* Ensure that you have not disabled EndpointSlices

## Enable Topology Aware Hints

To enable service topology, enable the `TopologyAwareHints` [feature
gate](docs/reference/command-line-tools-reference/feature-gates/) for the
kube-apiserver, kube-controller-manager, and kube-proxy:

```
--feature-gates="TopologyAwareHints=true"
```

## {{% heading "whatsnext" %}}

* Read about [Topology Aware Hints](/docs/concepts/services-networking/topology-aware-hints) for Services
* Read [Connecting Applications with Services](/docs/concepts/services-networking/connect-applications-service/)
