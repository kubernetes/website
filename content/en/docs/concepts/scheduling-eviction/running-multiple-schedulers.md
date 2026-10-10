---
title: Running multiple schedulers
content_type: concept
weight: 10
---

<!-- overview -->

Kubernetes allows you to run multiple schedulers within a single cluster.

This page describes the general principles of running multiple schedulers in a cluster, assuming that at least one of these schedulers is the default `kube-scheduler`. If you are only running custom or third-party schedulers, refer to their specific documentation.

<!-- body -->

## Deployment strategies

When running multiple schedulers, you must decide how they interact with each other and the cluster's nodes. There are three common deployment scenarios:

### High availability (Standby replicas)

If you want to run a single logical scheduler (such as `kube-scheduler`) but ensure it remains available if a failure occurs, you should run multiple replicas of the scheduler and enable **leader election**.

When leader election is enabled, only one replica (the leader) is active and schedules Pods, while the others remain in standby mode. If the active leader fails, one of the standby replicas automatically wins the leader election and takes over the scheduling work.

For details on how to configure this, see [Enable leader election](/docs/tasks/extend-kubernetes/configure-multiple-schedulers/#enable-leader-election).

### Multiple scheduler profiles or instances

If you want to use different configurations or scheduling rules for different workloads, you can either configure a single `kube-scheduler` instance with multiple scheduling profiles, or run several separate instances of `kube-scheduler`.

* **Multiple profiles in one instance:** A single `kube-scheduler` process can run multiple profiles (each with a unique scheduler name). Because these profiles run in the same process and share the same scheduling queue and cache, they do not make conflicting scheduling decisions. You can still use [node affinity](/docs/concepts/scheduling-eviction/assign-pod-node/#node-affinity-per-scheduling-profile) if you want to isolate workloads by directing each profile to a specific node pool.
* **Multiple separate instances:** If you run several separate `kube-scheduler` processes (deployments), they do not coordinate with each other and might make conflicting scheduling decisions (such as overcommitting a node's resources). To prevent this, each scheduler instance must target a disjoint set of nodes using [node affinity](/docs/concepts/scheduling-eviction/assign-pod-node/#node-affinity-per-scheduling-profile).

### Mixing kube-scheduler with custom schedulers

If you run `kube-scheduler` alongside custom or third-party schedulers, run the schedulers on disjoint pools of nodes to avoid resource conflicts. Depending on how your custom scheduler is designed, it might support running in an active-active configuration, or it might require its own leader election mechanism. Always check the documentation for your custom scheduler.

## {{% heading "whatsnext" %}}

* Read about [Configuring Multiple Schedulers](/docs/tasks/extend-kubernetes/configure-multiple-schedulers/).
* Learn about [Assigning Pods to Nodes](/docs/concepts/scheduling-eviction/assign-pod-node/).