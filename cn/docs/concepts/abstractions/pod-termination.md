---
---

#### <a name="pod-termination"></a> Pod Termination

Since Pods represent processes running on your cluster, Kubernetes provides for *graceful termination* when Pods are no longer needed. Kubernetes implements graceful termination by applying a default *grace period* of 30 seconds from the time that you issue a termination request. A typical Pod termination in Kubernetes involves the following steps:

1. You send a command or API call to terminate the Pod.
1. Kubernetes updates the Pod status to reflect the time after which the Pod is to be considered "dead" (the time of the termination request plus the grace period).
1. Kubernetes marks the Pod state as "Terminating" and stops sending traffic to the Pod.
1. Kubernetes send a `TERM` signal to the Pod, indicating that the Pod should shut down.
1. When the grace period expires, Kubernetes issues a `SIGKILL` to any processes still running in the Pod.
1. Kubernetes removes the Pod from the API server on the Kubernetes Master.

> **Note:** The grace period is configurable; you can set your own grace period when interacting with the cluster to request termination, such as using the `kubectl delete` command. See the [Terminating a Pod]() tutorial for more information.