---
reviewers:
title: Shutting Down and Restarting Clusters
weight: 55
---

<!-- overview -->

This page provides an overview of the steps you should follow when shutting down and restarting Kubernetes clusters.

<!-- body -->

## Background

As cluster administrators, you may need to suspend you running cluster and restart if for later use. There are different reasons why you may need to perform this shutdown, such as cluster maintenance or saving on resource costs.

## Backup your cluster

If the cluster has etcd, create an [etcd backup](/docs/tasks/administer-cluster/configure-upgrade-etcd/#backing-up-an-etcd-cluster). This backup may be useful in restoring the cluster if restarting the cluster didn't work properly.

## Shutting Down Clusters

You can shut down your cluster in a graceful manner so you can restart it for later use.

### Prerequisites

- You have access to the cluster as a user with the cluster admin role.

### Procedure

1. (Optional) If you are shutting the cluster down for an extended period, determine the date on which certificates expire.

```
$ kubectl get secrets
``` 

2. Make all nodes in the cluster unschedulable and evacuate all the pods using `kubectl drain`

```
$  kubectl drain --ignore-daemonsets node1 node2 node3
```

3. Shut down all of the nodes in the cluster. You can do this in ways that best fit your cluster, such as thru your cloud provider's web console, or a script, or playbook. 

#### Example
```
[user@worker ~]# systemctl poweroff
```

4. Shut down any other cluster dependencies that are no longer needed, such as external storages. Consult your vendor's documentation to see if some resources are okay to shut down, suspend, or delete.

## Restarting Clusters

This section describes the process you need to restart the cluster after being gracefully shutdown.

If the cluster fails to recover, you restore the cluster to its previous state using the [etcd backup](/docs/tasks/administer-cluster/configure-upgrade-etcd/#restoring-an-etcd-cluster).

### Prerequisite

- Cluster must be gracefully shut down.
- You have access to the cluster as a user with the cluster admin role.

### Procedure

1. Power on any cluster dependencies you need for your cluster, such as external storages.

2. Start all cluster machines. Use the appropriate method best-fit for your cluster to turn on the machines, like using the cloud provider's web console. 

3. Allow a few minutes for the cluster's control plane nodes and worker nodes become ready. Verify that all nodes are ready. 

```
$ kubectl get nodes --all-namespaces
```

4. Once the nodes are `Ready`, mark all the nodes in the cluster schedulable using `kubectl uncordon`

```
$ kubectl uncordon node1 node2 node3
```

5. Wait until all pods are back in operation. Verify that the pods are `Running`

```
kubectl get no,po --all-namespaces
```

### Caveats

1. Pre-shutdown pod scheduling may not be preserved after restart. Making the nodes schedulable again happens sequentially. Kube-scheduler will only schedule the pods to `Ready` and `Schedulable` nodes. In case that there are many nodes that need to be made schedulable again, the pod scheduling may end up imbalanced in favor of the first nodes that become schedulable.
