---
layout: blog
title: "Kubernetes v1.35: Watch Based Route Reconciliation in the Cloud Controller Manager"
date: 2025-12-30T10:30:00-08:00
slug: kubernetes-v1-35-watch-based-route-reconciliation-in-ccm
author: >
  [Lukas Metzner](https://github.com/lukasmetzner) (Hetzner)
---

Up to and including Kubernetes v1.34, the route controller in Cloud Controller Manager (CCM)
implementations built using the [k8s.io/cloud-provider](https://github.com/kubernetes/cloud-provider) library reconciles
routes at a fixed interval. This causes unnecessary API requests to the cloud provider when
there are no changes to routes. Other controllers implemented through the same library already
use watch-based mechanisms, leveraging informers to avoid unnecessary API calls. A new feature gate
is being introduced in v1.35 to allow changing the behavior of the route controller to use watch-based informers.

## What's new?

The feature gate `CloudControllerManagerWatchBasedRoutesReconciliation` has been
introduced to [k8s.io/cloud-provider](https://github.com/kubernetes/cloud-provider) in alpha stage by [SIG Cloud Provider](https://github.com/kubernetes/community/blob/master/sig-cloud-provider/README.md).
To enable this feature you can use `--feature-gate=CloudControllerManagerWatchBasedRoutesReconciliation=true`
in the CCM implementation you are using.

## About the feature gate

This feature gate will trigger the route reconciliation loop whenever a node is
added, deleted, or the fields `.spec.podCIDRs` or `.status.addresses` are updated.

An additional reconcile is performed in a random interval between 12h and 24h,
which is chosen at the controller's start time.

This feature gate does not modify the logic within the reconciliation loop.
Therefore, users of a CCM implementation should not experience significant
changes to their existing route configurations.

## How can I learn more?

For more details, refer to the [KEP-5237](https://kep.k8s.io/5237).