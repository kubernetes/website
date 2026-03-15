---
layout: blog
title: "Kubernetes v1.36: Resource Health Status in Pod Status Reaches Beta"
date: 2026-04-22
draft: true
slug: resource-health-status-beta
author: >
  [Harshal Patil](https://github.com/harche)
---

Placeholder for the KEP-4680 feature blog.

## Summary

KEP-4680 adds a new `allocatedResourcesStatus` field to Pod Status that exposes
the health of devices (GPUs, FPGAs, etc.) allocated to a Pod via Device Plugin
or Dynamic Resource Allocation (DRA). This enables users and controllers to
detect when a Pod is using an unhealthy device, improving troubleshooting for
device-related failures.

<!-- TODO: expand with motivation, what's new in beta, examples, and next steps -->
