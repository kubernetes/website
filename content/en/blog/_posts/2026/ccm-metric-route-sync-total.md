---
layout: blog
title: "Kubernetes v1.36: New Metric for Route Sync in the Cloud Controller Manager"
date: 2026-02-26
slug: ccm-new-metric-route-sync-total
author: >
  [Lukas Metzner](https://github.com/lukasmetzner) (Hetzner)
---

Kubernetes v1.36 introduces a new alpha counter metric `route_controller_route_sync_total`
to the Cloud Controller Manager (CCM) route controller implementation at
[`k8s.io/cloud-provider`](https://github.com/kubernetes/cloud-provider). This metric
increments each time routes are synced with the cloud provider.

## A/B testing watch-based route reconciliation

This metric was added to help operators validate the
`CloudControllerManagerWatchBasedRoutesReconciliation` feature gate introduced in
[Kubernetes v1.35](/blog/2025/12/30/kubernetes-v1-35-watch-based-route-reconciliation-in-ccm/).
That feature gate switches the route controller from a fixed-interval loop to a watch-based
approach that only reconciles when nodes actually change.

To A/B test this, compare `route_controller_route_sync_total` with the feature gate
disabled (default) versus enabled. In clusters where node changes are infrequent, you should
see a significant drop in the sync rate with the feature gate turned on.

## Where can I give feedback?

If you have feedback, feel free to reach out through any of the following channels:
- The `#sig-cloud-provider` channel on [Kubernetes Slack](https://slack.k8s.io/)
- The [KEP-5237 issue](https://kep.k8s.io/5237) on GitHub

## How can I learn more?

For more details, refer to [KEP-5237](https://kep.k8s.io/5237).
