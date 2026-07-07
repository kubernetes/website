---
layout: blog
title: "Kubernetes v1.37: Volume Health Monitoring Improvements"
date: 2026-07-07
slug: kubernetes-v1-37-volume-health-monitor
author: >
  Hemant Kumar (Red Hat)
---

The `CSIVolumeHealth` feature gate, originally introduced as Alpha in Kubernetes v1.21,
has been significantly reworked for Kubernetes v1.37.
This feature enables Kubernetes to monitor the health status of persistent volumes
backed by CSI drivers, allowing cluster administrators to detect and respond to
volume health issues proactively.

## What is Volume Health Monitoring?

Volume Health Monitoring provides a mechanism for CSI drivers to report the health
status of volumes to Kubernetes. When a volume becomes unhealthy — for example, due
to underlying storage system issues — Kubernetes can surface this information through
events and conditions, enabling automated or manual remediation.

## What's changing in v1.37?

*This section will be updated with specific details about the v1.37 changes.*

## Getting involved

This feature is driven by [SIG Storage](https://github.com/kubernetes/community/tree/master/sig-storage).

For more details, see [KEP-1432: Volume Health Monitor](https://github.com/kubernetes/enhancements/issues/1432).
