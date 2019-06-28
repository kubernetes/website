---
reviewers:
- lavalamp
- thockin
title: Cluster Management
content_template: templates/concept
---

{{% capture overview %}}

This document describes several topics related to the lifecycle of a cluster: creating a new cluster,
upgrading your cluster's
master and worker nodes, performing node maintenance (e.g. kernel upgrades), and upgrading the Kubernetes API version of a
running cluster.

{{% /capture %}}


{{% capture body %}}

## Creating and configuring a Cluster

To install Kubernetes on a set of machines, consult one of the existing [Getting Started guides](/docs/setup/) depending on your environment.

## Upgrading a cluster

The current state of cluster upgrades is provider dependent, and some releases may require special care when upgrading. It is recommended that administrators consult both the [release notes](https://git.k8s.io/kubernetes/CHANGELOG.md), as well as the version specific upgrade notes prior to upgrading their clusters.

### Upgrading an Azure Kubernetes Service (AKS) cluster

Azure Kubernetes Service enables easy self-service upgrades of the control plane and nodes in your cluster. The process is
currently user-initiated and is described in the [Azure AKS documentation](https://docs.microsoft.com/en-us/azure/aks/upgrade-cluster).

### Upgrading Google Compute Engine clusters

Google Compute Engine Open Source (GCE-OSS) support master upgrades by deleting and
recreating the master, while maintaining the same Persistent Disk (PD) to ensure that data is retained across the
upgrade.

Node upgrades for GCE use a [Managed Instance Group](https://cloud.google.com/compute/docs/instance-groups/), each node
is sequentially destroyed and then recreated with new software.  Any Pods that are running on that node need to be
controlled by a Replication Controller, or manually re-created after the roll out.

Upgrades on open source Google Compute Engine (GCE) clusters are controlled by the `cluster/gce/upgrade.sh` script.

Get its usage by running `cluster/gce/upgrade.sh -h`.

For example, to upgrade just your master to a specific version (v1.0.2):

```shell
cluster/gce/upgrade.sh -M v1.0.2
```

Alternatively, to upgrade your entire cluster to the latest stable release:

```shell
cluster/gce/upgrade.sh release/stable
```

### Upgrading Google Kubernetes Engine clusters

Google Kubernetes Engine automatically updates master components (e.g. `kube-apiserver`, `kube-scheduler`) to the latest version. It also handles upgrading the operating system and other components that the master runs on.

The node upgrade process is user-initiated and is described in the [Google Kubernetes Engine documentation](https://cloud.google.com/kubernetes-engine/docs/clusters/upgrade).

### Upgrading an Oracle Cloud Infrastructure Container Engine for Kubernetes (OKE) cluster

Oracle creates and manages a set of master nodes in the Oracle control plane on your behalf (and associated Kubernetes infrastructure such as etcd nodes) to ensure you have a highly available managed Kubernetes control plane. You can also seamlessly upgrade these master nodes to new versions of Kubernetes with zero downtime. These actions are described in the [OKE documentation](https://docs.cloud.oracle.com/iaas/Content/ContEng/Tasks/contengupgradingk8smasternode.htm). 

### Upgrading clusters on other platforms

Different providers, and tools, will manage upgrades differently.  It is recommended that you consult their main documentation regarding upgrades.

* [kops](https://github.com/kubernetes/kops)
* [kubespray](https://github.com/kubernetes-incubator/kubespray)
* [CoreOS Tectonic](https://coreos.com/tectonic/docs/latest/admin/upgrade.html)
* [Digital Rebar](https://provision.readthedocs.io/en/tip/doc/content-packages/krib.html)
* ...

To upgrade a cluster on a platform not mentioned in the above list, check the order of component upgrade on the [Skewed versions](docs/setup/version-skew-policy/#supported-component-upgrade-order) page.

## Resizing a cluster

If your cluster runs short on resources you can easily add more machines to it if your cluster is running in [Node self-registration mode](/docs/admin/node/#self-registration-of-nodes).
If you're using GCE or Google Kubernetes Engine it's done by resizing Instance Group managing your Nodes. It can be accomplished by modifying number of instances on `Compute > Compute Engine > Instance groups > your group > Edit group` [Google Cloud Console page](https://console.developers.google.com) or using gcloud CLI:

```shell
gcloud compute instance-groups managed resize kubernetes-node-pool --size=42 --zone=$ZONE
```

Instance Group will take care of putting appropriate image on new machines and start them, while Kubelet will register its Node with API server to make it available for scheduling. If you scale the instance group down, system will randomly choose Nodes to kill.

In other environments you may need to configure the machine yourself and tell the Kubelet on which machine API server is running.

### Resizing an Azure Kubernetes Service (AKS) cluster

Azure Kubernetes Service enables user-initiated resizing of the cluster from either the CLI or the Azure Portal and is described in the [Azure AKS documentation](https://docs.microsoft.com/en-us/azure/aks/scale-cluster).


### Cluster autoscaling

If you are using GCE or Google Kubernetes Engine, you can configure your cluster so that it is automatically rescaled based on
pod needs.

As described in [Compute Resource](/docs/concepts/configuration/manage-compute-resources-container/), users can reserve how much CPU and memory is allocated to pods.
This information is used by the Kubernetes scheduler to find a place to run the pod. If there is
no node that has enough free capacity (or doesn't match other pod requirements) then the pod has
to wait until some pods are terminated or a new node is added.

Cluster autoscaler looks for the pods that cannot be scheduled and checks if adding a new node, similar
to the other in the cluster, would help. If yes, then it resizes the cluster to accommodate the waiting pods.

Cluster autoscaler also scales down the cluster if it notices that one or more nodes are not needed anymore for
an extended period of time (10min but it may change in the future).

Cluster autoscaler is configured per instance group (GCE) or node pool (Google Kubernetes Engine).

If you are using GCE then you can either enable it while creating a cluster with kube-up.sh script.
To configure cluster autoscaler you have to set three environment variables:

* `KUBE_ENABLE_CLUSTER_AUTOSCALER` - it enables cluster autoscaler if set to true.
* `KUBE_AUTOSCALER_MIN_NODES` - minimum number of nodes in the cluster.
* `KUBE_AUTOSCALER_MAX_NODES` - maximum number of nodes in the cluster.

Example:

```shell
KUBE_ENABLE_CLUSTER_AUTOSCALER=true KUBE_AUTOSCALER_MIN_NODES=3 KUBE_AUTOSCALER_MAX_NODES=10 NUM_NODES=5 ./cluster/kube-up.sh
```

On Google Kubernetes Engine you configure cluster autoscaler either on cluster creation or update or when creating a particular node pool
(which you want to be autoscaled) by passing flags `--enable-autoscaling` `--min-nodes` and `--max-nodes`
to the corresponding `gcloud` commands.

Examples:

```shell
gcloud container clusters create mytestcluster --zone=us-central1-b --enable-autoscaling --min-nodes=3 --max-nodes=10 --num-nodes=5
```

```shell
gcloud container clusters update mytestcluster --enable-autoscaling --min-nodes=1 --max-nodes=15
```

**Cluster autoscaler expects that nodes have not been manually modified (e.g. by adding labels via kubectl) as those properties would not be propagated to the new nodes within the same instance group.**

For more details about how the cluster autoscaler decides whether, when and how
to scale a cluster, please refer to the [FAQ](https://github.com/kubernetes/autoscaler/blob/master/cluster-autoscaler/FAQ.md)
documentation from the autoscaler project.

## Maintenance on a Node

If you need to reboot a node (such as for a kernel upgrade, libc upgrade, hardware repair, etc.), and the downtime is
brief, then when the Kubelet restarts, it will attempt to restart the pods scheduled to it.  If the reboot takes longer
(the default time is 5 minutes, controlled by `--pod-eviction-timeout` on the controller-manager),
then the node controller will terminate the pods that are bound to the unavailable node.  If there is a corresponding
replica set (or replication controller), then a new copy of the pod will be started on a different node.  So, in the case where all
pods are replicated, upgrades can be done without special coordination, assuming that not all nodes will go down at the same time.

If you want more control over the upgrading process, you may use the following workflow:

Use `kubectl drain` to gracefully terminate all pods on the node while marking the node as unschedulable:

```shell
kubectl drain $NODENAME
```

This keeps new pods from landing on the node while you are trying to get them off.

For pods with a replica set, the pod will be replaced by a new pod which will be scheduled to a new node. Additionally, if the pod is part of a service, then clients will automatically be redirected to the new pod.

For pods with no replica set, you need to bring up a new copy of the pod, and assuming it is not part of a service, redirect clients to it.

Perform maintenance work on the node.

Make the node schedulable again:

```shell
kubectl uncordon $NODENAME
```

If you deleted the node's VM instance and created a new one, then a new schedulable node resource will
be created automatically (if you're using a cloud provider that supports
node discovery; currently this is only Google Compute Engine, not including CoreOS on Google Compute Engine using kube-register). See [Node](/docs/admin/node) for more details.

## Advanced Topics

### Upgrading to a different API version

When a new API version is released, you may need to upgrade a cluster to support the new API version (e.g. switching from 'v1' to 'v2' when 'v2' is launched).

This is an infrequent event, but it requires careful management. There is a sequence of steps to upgrade to a new API version.

   1. Turn on the new API version.
   1. Upgrade the cluster's storage to use the new version.
   1. Upgrade all config files. Identify users of the old API version endpoints.
   1. Update existing objects in the storage to new version by running `cluster/update-storage-objects.sh`.
   1. Turn off the old API version.

### Turn on or off an API version for your cluster

Specific API versions can be turned on or off by passing `--runtime-config=api/<version>` flag while bringing up the API server. For example: to turn off v1 API, pass `--runtime-config=api/v1=false`.
runtime-config also supports 2 special keys: api/all and api/legacy to control all and legacy APIs respectively.
For example, for turning off all API versions except v1, pass `--runtime-config=api/all=false,api/v1=true`.
For the purposes of these flags, _legacy_ APIs are those APIs which have been explicitly deprecated (e.g. `v1beta3`).

### Switching your cluster's storage API version

The objects that are stored to disk for a cluster's internal representation of the Kubernetes resources active in the cluster are written using a particular version of the API.
When the supported API changes, these objects may need to be rewritten in the newer API.  Failure to do this will eventually result in resources that are no longer decodable or usable
by the Kubernetes API server.

### Switching your config files to a new API version

You can use `kubectl convert` command to convert config files between different API versions.

```shell
kubectl convert -f pod.yaml --output-version v1
```

For more options, please refer to the usage of [kubectl convert](/docs/reference/generated/kubectl/kubectl-commands#convert) command.

{{% /capture %}}
