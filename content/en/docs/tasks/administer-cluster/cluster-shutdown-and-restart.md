---
reviewers:
title: Shutting Down and Restarting Clusters
content_type: task
weight: 55
---

<!-- overview -->

This page provides an overview of the steps you should follow when shutting down and restarting Kubernetes clusters.

As cluster administrators, you may need to suspend your running cluster and restart it for later use. There are different reasons why you may need to perform this shutdown, such as cluster maintenance or saving on operation/resource costs.

At a high level, the steps you perform for shutting down are:
- Backing up your cluster
- Making your nodes unschedulable
- Terminating pods from your nodes
- Shutting down nodes
- Shutting down any dependencies of your cluster

Meanwhile, the steps you perform for restarting are:
- Powering on your cluster's dependencies
- Powering on your nodes and waiting until they're ready
- Making your nodes schedulable again

<!-- body -->

## {{% heading "prerequisites" %}}

You must have an existing cluster. This page is about shutting down and restarting clusters from Kubernetes
{{< skew currentVersionAddMinor -1 >}} to Kubernetes {{< skew currentVersion >}}. You must also have access to the cluster as a user with the cluster admin role.

## Backup your cluster

If the cluster has etcd, create an [etcd backup](/docs/tasks/administer-cluster/configure-upgrade-etcd/#backing-up-an-etcd-cluster). This backup may be useful in restoring the cluster if restarting the cluster didn't work as intended.

## Shut Down Clusters

You can shut down your cluster in a graceful manner by gracefully shutting down its nodes. This will allow you to gracefully restart the cluster it for later use. While [node shutdown](https://kubernetes.io/docs/concepts/cluster-administration/node-shutdown/#graceful-node-shutdown) allows you to safely evict the pods of the node to another available node, cluster shutdowns do not need the evicted pods be rescheduled anywhere else until the cluster is restarted. Thus, this procedure suppresses any pod rescheduling from the nodes being shutdown until cluster restart.

### (Optional) Checking for certificate expiration

If you are shutting the cluster down for an extended period, identify the date on which certificates expire.
```
$ openssl x509 -in /etc/kubernetes/pki/apiserver.crt -noout -enddate
```

Output
```
notAfter=Mar  3 09:18:19 2026 GMT
``` 

To ensure that the cluster can restart gracefully after this shut down, plan to restart it on or before the specified date. 

### Making nodes unschedulable
Make all nodes in the cluster unschedulable using `kubectl cordon`

```
$ kubectl cordon node1 node2 node3
```

### Terminating pods in the nodes
Evict all the pods using `kubectl drain`

While `kubectl drain` should basically be enough due to it capable of internally making the specified nodes unschedulable before pod eviction, larger clusters may need to make sure all nodes are properly cordoned first before draining. You can check the nodes' schedulability using `kubectl get nodes`
```
$ kubectl drain --ignore-daemonsets node1 node2 node3
```

### Shutting down nodes in the cluster
Shut down all of the nodes in the cluster. You can do this in ways that best fit your cluster; such as through your cloud provider's web console, or a script, or playbook. 

- Example
```
[user@node1 ~]# systemctl poweroff
```

### Shutting down cluster dependencies
After all nodes have successfully shut down, shut down any other cluster dependencies that are no longer needed, such as external storages. Consult your vendor's documentation to see if some resources are okay to shut down, suspend, or delete.

## Restarting Clusters

This section describes the process you need to restart the cluster after being gracefully shutdown.

If the cluster fails to recover, you restore the cluster to its previous state using the [etcd backup](/docs/tasks/administer-cluster/configure-upgrade-etcd/#restoring-an-etcd-cluster).

### Poweering on cluster dependencies
Power on any cluster dependencies you need for your cluster, such as external storages.

### Powering on cluster machines
Start all cluster machines (i.e. your nodes). Use the method best-fit for your cluster to turn on the machines, like using the cloud provider's web console. 

Allow a few minutes for the cluster's control plane nodes and worker nodes to become `Ready`. Verify that all nodes are `Ready`. 

```
$ kubectl get nodes
```

### Making your nodes schedulable again
Once the nodes are `Ready`, mark all the nodes in the cluster schedulable using `kubectl uncordon`

```
$ kubectl uncordon node1 node2 node3
```

Wait until all pods are back in operation. Verify that the pods are `Running`

```
kubectl get pods --all-namespaces
```

### Caveats

Pre-shutdown pod scheduling may not be preserved after restart. Making the nodes schedulable again happens sequentially. Kube-scheduler will only schedule the pods to `Ready` and `Schedulable` nodes polled at an instance. In case that there are many nodes that need to be made schedulable again, the pod scheduling may end up imbalanced in favor of the first nodes that become schedulable at that instance.
