---
layout: blog
title: "Kubernetes v1.37: New Metric for Route Corrections in the Cloud Controller Manager"
date: 2026-07-02T10:35:00-08:00
slug: ccm-new-metric-route-corrections-total
author: >
  [Lukas Metzner](https://github.com/lukasmetzner) (Hetzner)
aliases:
  - /blog/2026/02/26/ccm-new-metric-route-corrections-total
  - /blog/2026/02/26/ccm-new-metric-route-corrections-total/
---

Kubernetes v1.37 introduces a new alpha counter metric `route_controller_route_corrections_total`
to the Cloud Controller Manager (CCM) route controller implementation at
[`k8s.io/cloud-provider`](https://github.com/kubernetes/cloud-provider). This metric
increments each time routes are synced with the cloud provider.

## TODO

## Where can I give feedback?

If you have feedback, feel free to reach out through any of the following channels:
- The [#sig-cloud-provider](https://kubernetes.slack.com/messages/sig-cloud-provider) channel on [Kubernetes Slack](https://slack.k8s.io/)
- The [KEP-5237 issue](https://kep.k8s.io/5237) on GitHub
- The [SIG Cloud Provider community page](https://github.com/kubernetes/community/tree/05223ecbd2d6f960edb40684dc83d053d49f8b68/sig-cloud-provider) for other communication channels

## How can I learn more?

For more details, refer to [KEP-5237](https://kep.k8s.io/5237).