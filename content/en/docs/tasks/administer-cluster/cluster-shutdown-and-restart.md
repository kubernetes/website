---
title: Shutting Down and Restarting Clusters
content_type: task
weight: 55
---

<!-- overview -->

This page outlines the steps required to safely shut down and restart Kubernetes clusters.

As cluster administrators, you may need to suspend your running cluster and restart it at a later time. There are different reasons why you may need to perform this shutdown, such as cluster maintenance or saving on operation/resource costs.

<!-- body -->

## {{% heading "prerequisites" %}}

- You must have an existing cluster. This page is about shutting down and restarting clusters. You must also have access to the cluster as a user with the cluster admin role.
- This procedure does not apply to environments using a node autoscaler.
- In this procedure, you will shut down the nodes in order to shut down the cluster. Some server management systems are configured to delete servers (VMs) that no longer respond to liveness checks. In such cases, the VMs may be deleted automatically, so you should not perform this procedure.

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

## (Optional) Backup an etcd cluster

If your Kubernetes cluster uses etcd as its backing store, make sure to create an [etcd backup](/docs/tasks/administer-cluster/configure-upgrade-etcd/#backing-up-an-etcd-cluster). This backup may be useful in restoring the cluster if restarting the cluster does not work.

{{< note >}}
- This procedure terminates workloads normally to prevent data corruption, but if necessary, back up the workloads. Check the backup method for each workload.
- Cluster shutdown will be executed by the cluster administrator, but workload backups may needed be executed by the people responsible for each individual workload.
  As a cluster administrator, you should establish management processes for cluster shutdown, such as notifying users in advance.
{{< /note >}}

## Shut down the nodes in your cluster {#node-shutdown}

You can shut down your cluster in a graceful manner by gracefully shutting down its nodes. This will typically allow you to gracefully restart the cluster for later use. While [node shutdown](/docs/concepts/cluster-administration/node-shutdown/#graceful-node-shutdown) allows you to safely evict the pods of the node to another available node, cluster shutdowns do not need evicted pods to be rescheduled anywhere else until the cluster is restarted. Thus, this procedure suppresses any pod rescheduling from the nodes being shutdown until cluster restart. The procedure involves first shutting down the worker nodes, and then shutting down the control plane.

### Mark worker nodes unschedulable

Make all nodes in the cluster unschedulable using `kubectl cordon`

```bash
kubectl cordon --selector='!node-role.kubernetes.io/control-plane'
kubectl cordon --selector='node-role.kubernetes.io/control-plane'
```

### Terminating pods in the nodes

Evict all the pods using `kubectl drain`

While `kubectl drain` should basically be enough due to it capable of internally making the specified nodes unschedulable before pod eviction, larger clusters may need to make sure all nodes are properly cordoned first before draining. You can check the nodes' schedulability using `kubectl get nodes`.
First, drain the worker nodes, then drain the control plane nodes.

```bash
kubectl drain --ignore-daemonsets --selector='!node-role.kubernetes.io/control-plane'
kubectl drain --ignore-daemonsets --selector='node-role.kubernetes.io/control-plane'
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

First, start the machines for all control plane nodes in the cluster. Use the method best-fit for your cluster to turn on the machines, like using the cloud provider's web console. 
Allow a few minutes for the cluster's control plane nodes to become `Ready`. Control plane components (kube-apiserver, etcd) may take longer. Verify that all nodes are `Ready`. 

Next, start the machines for all worker nodes in the cluster and verify that they are in the "Ready" state.

```bash
kubectl get nodes --selector='node-role.kubernetes.io/control-plane'
kubectl get nodes --selector='!node-role.kubernetes.io/control-plane'
```

### Making control plane nodes schedulable

Once the control plane nodes are `Ready`, mark all control plane nodes in the cluster schedulable using `kubectl uncordon`

```bash
kubectl uncordon --selector='node-role.kubernetes.io/control-plane'
```

### Making worker nodes schedulable

Once the worker nodes are `Ready`, mark all worker nodes in the cluster schedulable using `kubectl uncordon`

```bash
kubectl uncordon --selector='!node-role.kubernetes.io/control-plane'
```

Wait until all pods are back in operation. Verify that the pods are `Running`

```bash
kubectl get pods --all-namespaces
```

This is the simplest verification method.
In a real production situation, additional procedures and verifications may be required depending on your system environment.

### Caveats

Pre-shutdown pod scheduling might not be preserved after restart. Making the nodes schedulable again happens sequentially. Kube-scheduler will only schedule the pods to `Ready` and `Schedulable` nodes polled at an instance. In case there are many nodes that need to be made schedulable again, the pod scheduling might end up imbalanced in favor of the first nodes that become schedulable at that instance.
