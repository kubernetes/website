---
reviewers:
- maplain
title: Service Internal Traffic Policy
content_type: concept
weight: 45
---


<!-- overview -->

{{< feature-state for_k8s_version="v1.21" state="alpha" >}}

_Service Internal Traffic Policy_ enables internal traffic restrictions to only route
internal traffic to endpoints within the node the traffic originated from. The
"internal" traffic here refers to traffic originated from Pods in the current
cluster. This can help to reduce costs and improve performance.

<!-- body -->

## Using Service Internal Traffic Policy

Once you have enabled the `ServiceInternalTrafficPolicy`
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/),
you can enable an internal-only traffic policy for a
{{< glossary_tooltip text="Services" term_id="service" >}}, by setting its
`.spec.internalTrafficPolicy` to `Local`.
This tells kube-proxy to only use node local endpoints for cluster internal traffic.

{{< note >}}
For pods on nodes with no endpoints for a given Service, the Service
behaves as if it has zero endpoints (for Pods on this node) even if the service
does have endpoints on other nodes.
{{< /note >}}

The following example shows what a Service looks like when you set
`.spec.internalTrafficPolicy` to `Local`:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-service
spec:
  selector:
    app: MyApp
  ports:
    - protocol: TCP
      port: 80
      targetPort: 9376
  internalTrafficPolicy: Local
```

## How it works

The kube-proxy filters the endpoints it routes to based on the
`spec.internalTrafficPolicy` setting. When it's set to `Local`, only node local
endpoints are considered. When it's `Cluster` or missing, all endpoints are
considered.
When the [feature gate](/docs/reference/command-line-tools-reference/feature-gates/)
`ServiceInternalTrafficPolicy` is enabled, `spec.internalTrafficPolicy` defaults to "Cluster".

## Constraints

* Service Internal Traffic Policy is not used when `externalTrafficPolicy` is set
  to `Local` on a Service. It is possible to use both features in the same cluster
  on different Services, just not on the same Service.

## {{% heading "whatsnext" %}}

* Read about [enabling Topology Aware Hints](/docs/tasks/administer-cluster/enabling-topology-aware-hints)
* Read about [Service External Traffic Policy](/docs/tasks/access-application-cluster/create-external-load-balancer/#preserving-the-client-source-ip)
* Read [Connecting Applications with Services](/docs/concepts/services-networking/connect-applications-service/)
