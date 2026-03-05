---
title: Shutting Down and Restarting Clusters
content_type: task
weight: 55
---

<!-- overview -->

This page outlines the steps required to safely shut down and restart Kubernetes clusters.

As cluster administrators, you may need to suspend your running cluster and restart it at a later time. There are different reasons why you may need to perform this shutdown, such as cluster maintenance or saving on operation/resource costs.

At a high level, the steps you perform for shutting down are:
- Back up the cluster
- Cordon the nodes (mark as unschedulable)
- Drain pods from nodes
- Shut down nodes
- Shut down any dependencies of your cluster

Meanwhile, the steps you perform for restarting are:
- Start external dependencies
- Power on your nodes and wait until they are Ready
- Mark the nodes as schedulable again

<!-- body -->

## {{% heading "prerequisites" %}}

You must have an existing cluster. This page is about shutting down and restarting clusters. You must also have access to the cluster as a user with the cluster admin role.

### (Optional) Check for certificate expiration {#check-certificate-expiration}

If you are shutting the cluster down for an extended period, identify the date on which certificates will expire.

```bash
openssl x509 -in /etc/kubernetes/pki/apiserver.crt -noout -enddate
```

Example output:

```bash
notAfter=Mar  3 09:18:19 2026 GMT
``` 

To ensure that the cluster can restart gracefully after this shut down, plan to restart it on or before the specified date. 
Note that various certificates may have different expiration dates.

## Backup your cluster

If the cluster has etcd, create an [etcd backup](/docs/tasks/administer-cluster/configure-upgrade-etcd/#backing-up-an-etcd-cluster). This backup may be useful in restoring the cluster if restarting the cluster does not work.

{{< note >}}
- This procedure terminates workloads normally to prevent data corruption, but if necessary, back up the workloads. Check the backup method for each workload.
- Cluster shutdown will be executed by the cluster administrator, but workload backups may needed be executed by the people responsible for each individual workload.
  As a cluster administrator, you should establish management processes for cluster shutdown, such as notifying users in advance.
{{< /note >}}

See below for details about the etcd that is external to the cluster.

- [External etcd topology](https://kubernetes.io/docs/setup/production-environment/tools/kubeadm/ha-topology/#external-etcd-topology)
- [External etcd nodes](https://kubernetes.io/docs/setup/production-environment/tools/kubeadm/high-availability/#external-etcd-nodes)
- [Set up a High Availability etcd Cluster with kubeadm](https://kubernetes.io/docs/setup/production-environment/tools/kubeadm/setup-ha-etcd-with-kubeadm/)

## Shut down the nodes in your cluster {#node-shutdown}

You can shut down your cluster in a graceful manner by gracefully shutting down its nodes. This will typically allow you to gracefully restart the cluster for later use. While [node shutdown](/docs/concepts/cluster-administration/node-shutdown/#graceful-node-shutdown) allows you to safely evict the pods of the node to another available node, cluster shutdowns do not need evicted pods to be rescheduled anywhere else until the cluster is restarted. Thus, this procedure suppresses any pod rescheduling from the nodes being shutdown until cluster restart.

### Mark worker nodes unschedulable

Make all nodes in the cluster unschedulable using `kubectl cordon`

```bash
kubectl cordon node1 node2 node3
```

### Terminating pods in the nodes

Evict all the pods using `kubectl drain`

While `kubectl drain` should basically be enough due to it capable of internally making the specified nodes unschedulable before pod eviction, larger clusters may need to make sure all nodes are properly cordoned first before draining. You can check the nodes' schedulability using `kubectl get nodes`

```bash
kubectl drain --ignore-daemonsets node1 node2 node3
```

### Shutting down nodes in the cluster

Shut down all of the nodes in the cluster. You can do this in ways that best fit your cluster; such as through your cloud provider's web console, or a script, or playbook. 

Example:

Run the following command on all nodes.

```bash
# Run this on each node (not on your own PC)
systemctl poweroff
```

### Shutting down cluster dependencies

After all nodes have successfully shut down, shut down any other cluster dependencies that are no longer needed, such as external storages. Consult your vendor's documentation to see if some resources are okay to shut down, suspend, or delete.

## Restart the cluster

This section describes the process you need to restart the cluster after being gracefully shutdown.

If the cluster fails to recover, restore the cluster to its previous state using the [etcd backup](/docs/tasks/administer-cluster/configure-upgrade-etcd/#restoring-an-etcd-cluster).

### Powering on cluster dependencies

Power on any cluster dependencies you need for your cluster, such as external storages.

### Powering on cluster machines

Start all cluster machines (i.e. your nodes). Use the method best-fit for your cluster to turn on the machines, like using the cloud provider's web console. 

Allow a few minutes for the cluster's control plane nodes and worker nodes to become `Ready`. Control plane components (kube-apiserver, etcd) may take longer. Verify that all nodes are `Ready`. 

```bash
kubectl get nodes
```

### Making control plane nodes schedulable

Once the control plane nodes are `Ready`, mark all control plane nodes in the cluster schedulable using `kubectl uncordon`

```bash
kubectl uncordon control-plane-node1 control-plane-node2 control-plane-node3
```

### Making worker nodes schedulable

Once the worker nodes are `Ready`, mark all worker nodes in the cluster schedulable using `kubectl uncordon`

```bash
kubectl uncordon worker-node1 worker-node2 worker-node3
```

Wait until all pods are back in operation. Verify that the pods are `Running`

```bash
kubectl get pods --all-namespaces
```

This is the simplest verification method.
In a real production situation, additional procedures and verifications may be required depending on your system environment.

### Caveats

Pre-shutdown pod scheduling might not be preserved after restart. Making the nodes schedulable again happens sequentially. Kube-scheduler will only schedule the pods to `Ready` and `Schedulable` nodes polled at an instance. In case there are many nodes that need to be made schedulable again, the pod scheduling might end up imbalanced in favor of the first nodes that become schedulable at that instance.
