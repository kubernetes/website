---
title: Liveness, Readiness, and Startup Probes
content_type: concept
weight: 40
---

<!-- overview -->

Kubernetes has various types of probes:

- [Liveness probe](#liveness-probe)
- [Readiness probe](#readiness-probe)
- [Startup probe](#startup-probe)

<!-- body -->

## Liveness probe

Liveness probes determine when to restart a container. For example, liveness probes could catch a deadlock, when an application is running, but unable to make progress.

If a container fails its liveness probe repeatedly, the kubelet restarts the container.

Liveness probes do not wait for readiness probes to succeed. If you want to wait before
executing a liveness probe you can either define `initialDelaySeconds`, or use a
[startup probe](#startup-probe).


## Readiness probe

Readiness probes determine when a container is ready to start accepting traffic. This is useful when waiting for an application to perform time-consuming initial tasks, such as establishing network connections, loading files, and warming caches. 

If the readiness probe returns a failed state, Kubernetes removes the pod from all matching service endpoints.

Readiness probes runs on the container during its whole lifecycle.


## Startup probe

A startup probe verifies whether the application within a container is started. This can be used to adopt liveness checks on slow starting containers, avoiding them getting killed by the kubelet before they are up and running.

If such a probe is configured, it disables liveness and readiness checks until it succeeds.

This type of probe is only executed at startup, unlike liveness and readiness probes, which are run periodically.

* Read more about the [Configure Liveness, Readiness and Startup Probes](/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes).
