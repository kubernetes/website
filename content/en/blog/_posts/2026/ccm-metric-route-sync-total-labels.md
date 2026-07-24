---
layout: blog
title: "Kubernetes v1.37: New Labels for the Route Sync Metric in the Cloud Controller Manager"
draft: true
slug: ccm-metric-route-sync-total-labels
author: >
  [Lukas Metzner](https://github.com/lukasmetzner) (Hetzner)
---
Kubernetes v1.37 extends the existing alpha counter metric `route_controller_route_sync_total`
in the route controller of the Cloud Controller Manager (CCM) at
[`k8s.io/cloud-provider`](https://github.com/kubernetes/cloud-provider) with two new labels,
`trigger` and `outcome`. Together they let operators see what caused a route reconcile and
whether it actually changed anything.

## New labels

Previously, `route_controller_route_sync_total` was a single counter that incremented on every
reconcile. It now carries two labels:

- `trigger` — what caused the reconcile:
  - `node_change`: a node was added, removed, or updated.
  - `periodic`: the regular fixed-interval reconcile.
- `outcome` — what the reconcile did:
  - `changed`: at least one route was created or deleted.
  - `noop`: no route changes were necessary.
  - `error`: the reconcile failed.

With the `CloudControllerManagerWatchBasedRoutesReconciliation` feature gate disabled (the
default fixed-interval loop), every reconcile is reported as `trigger="periodic"`. The
`trigger="node_change"` value only appears once the feature gate is enabled and the controller
reconciles in response to node events.

## Monitor route corrections

These labels were added to help operators validate the
`CloudControllerManagerWatchBasedRoutesReconciliation` feature gate introduced in
[Kubernetes v1.35](/blog/2025/12/30/kubernetes-v1-35-watch-based-route-reconciliation-in-ccm/).
That feature gate switches the route controller from a fixed-interval loop to a watch-based
approach that reconciles only when nodes actually change. This reduces unnecessary API calls
to the infrastructure provider, easing pressure on rate-limited APIs and letting operators
make more efficient use of their available quota.

Under watch-based reconciliation, the route controller still performs a periodic reconcile as a
safety net: at initialization it picks a random interval between 12h and 24h at which it runs a
full reconcile. The combination

```
route_controller_route_sync_total{trigger="periodic",outcome="changed"}
```

tells you how often those periodic reconciles actually had to create or delete a route. An
increase in this series lets cluster administrators detect potential issues with the filters we
apply to incoming node update events in the route controller.

An increase does not necessarily indicate a problem. Other causes are possible: for example, a
route may have been manually deleted by a user.

## Where can I give feedback?

If you have feedback, feel free to reach out through any of the following channels:
- The [#sig-cloud-provider](https://kubernetes.slack.com/messages/sig-cloud-provider) channel on [Kubernetes Slack](https://slack.k8s.io/)
- The [KEP-5237 issue](https://kep.k8s.io/5237) on GitHub
- The [SIG Cloud Provider community page](https://github.com/kubernetes/community/tree/05223ecbd2d6f960edb40684dc83d053d49f8b68/sig-cloud-provider) for other communication channels

## How can I learn more?

For more details, refer to [KEP-5237](https://kep.k8s.io/5237).
