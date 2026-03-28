---
title: Liveness, Readiness, and Startup Probes
content_type: concept
weight: 40
---

<!-- overview -->

Kubernetes lets you define _probes_ to continuously monitor the health of containers in a Pod.
Based on probe results, Kubernetes can restart unhealthy containers or stop sending traffic to containers that are not ready.

There are three types of probes, each serving a different purpose:

- [Startup probe](#startup-probe)
- [Liveness probe](#liveness-probe)
- [Readiness probe](#readiness-probe)

<!-- body -->

## Startup probe

Startup probes verify whether the application within a container is started. If a startup probe is configured,
Kubernetes does not execute liveness or readiness probes until the startup probe succeeds, allowing the application time to finish its initialization.

This type of probe is only executed at startup, unlike liveness and readiness probes, which are run periodically.

* Read more about the [Configure Liveness, Readiness and Startup Probes](/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes).

## Liveness probe

Liveness probes determine when to restart a container. For example, liveness probes could catch a deadlock when an application is running but unable to make progress.

If a container fails its liveness probe repeatedly, the kubelet restarts the container.

Liveness probes do not wait for readiness probes to succeed. If you want to wait before executing a liveness probe, you can either define `initialDelaySeconds` or use a
[startup probe](#startup-probe).


## Readiness probe

Readiness probes determine when a container is ready to accept traffic. This is useful when waiting for an application to perform time-consuming initial tasks that depend on its backing services; for example: establishing network connections, loading files, and warming caches. Readiness probes can also be useful later in the container’s lifecycle, for example, when recovering from temporary faults or overloads.

If the readiness probe returns a failed state, Kubernetes removes the pod from all matching service endpoints.

Readiness probes run on the container during its whole lifecycle.
