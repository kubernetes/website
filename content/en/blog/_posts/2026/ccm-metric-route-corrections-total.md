---
layout: blog
title: "Kubernetes v1.37: New Metric for Route Corrections in the Cloud Controller Manager"
draft: true
slug: ccm-metric-route-corrections-total
author: >
  [Lukas Metzner](https://github.com/lukasmetzner) (Hetzner)
---
Kubernetes v1.37 introduces a new alpha counter metric `route_controller_route_corrections_total`
to the route controller implementation in the Cloud Controller Manager (CCM) at
[`k8s.io/cloud-provider`](https://github.com/kubernetes/cloud-provider). This metric measures
how often periodic reconciles correct routes.

## Monitor Route Corrections

Like `route_controller_route_sync_total`, this metric was added to help operators validate the
`CloudControllerManagerWatchBasedRoutesReconciliation` feature gate introduced in
[Kubernetes v1.35](/blog/2025/12/30/kubernetes-v1-35-watch-based-route-reconciliation-in-ccm/).
That feature gate switches the route controller from a fixed-interval loop to a watch-based
approach that reconciles only when nodes actually change. This reduces unnecessary API calls
to the infrastructure provider, easing pressure on rate-limited APIs and letting operators
make more efficient use of their available quota. The metric is gated by the same
`CloudControllerManagerWatchBasedRoutesReconciliation` feature gate and is only emitted when
it is enabled.

At initialization, the route controller picks a random interval between 12h and 24h at which
it performs a periodic reconcile. If that reconcile triggers the creation or deletion of routes,
the counter increases. This lets cluster administrators detect potential issues with the filters
we apply to incoming node update events in the route controller.

An increase in the counter does not necessarily indicate a problem. Other causes are possible:
for example, a route may have been manually deleted by a user and then recreated during the
periodic reconcile, or a node delete event may not have been processed correctly, leaving a stale
route that had to be removed.

## Where can I give feedback?

If you have feedback, feel free to reach out through any of the following channels:
- The [#sig-cloud-provider](https://kubernetes.slack.com/messages/sig-cloud-provider) channel on [Kubernetes Slack](https://slack.k8s.io/)
- The [KEP-5237 issue](https://kep.k8s.io/5237) on GitHub
- The [SIG Cloud Provider community page](https://github.com/kubernetes/community/tree/05223ecbd2d6f960edb40684dc83d053d49f8b68/sig-cloud-provider) for other communication channels

## How can I learn more?

For more details, refer to [KEP-5237](https://kep.k8s.io/5237).