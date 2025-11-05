---
layout: blog
title: "Watch Based Route Reconciliation in the Cloud Controller Manager"
date: 2025-10-27T08:30:00-07:00
draft: true
slug: watch-based-route-reconciliation-in-ccm
author: >
  [Lukas Metzner](https://github.com/lukasmetzner) (Hetzner Cloud)
---

Currently the route controller in the cloud controller manager (ccm), is reconciling in
a fixed interval. This is causing unnecessary API requests towards the cloud
providers. Other controllers in the ccm are already using a watch based solution
by leveraging informers. A new feature gate got introduced to change the current
behavior in the route controller.

## What's new?

The feature gate `CloudControllerManagerWatchBasedRoutesReconciliation` has been
introduced in alpha stage by [SIG Cloud Provider](https://github.com/kubernetes/community/blob/master/sig-cloud-provider/README.md).
To enable this feature you can use `--feature-gate=CloudControllerManagerWatchBasedRoutesReconciliation=true`
in the CCM implementation you are using.

## About the feature gate

This feature gate will trigger the route reconciliation loop whenever a node is
added, deleted, or the fields `.spec.podCIDRs` or `.status.addresses` are updated.

An additional reconcile is performed in a random interval between 12h and 24h,
which is choosen at the controllers start time.

This feature gate does not modify the logic within the reconciliation loop.
Therefore, users of a CCM implementation should not experience significant
changes to their existing route configurations.

## How can I learn more?

For more details, refer to the [KEP](https://kep.k8s.io/5237).