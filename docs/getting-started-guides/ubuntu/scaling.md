---
title: Scaling
---

{% capture overview %}
This page shows how to horizontally scale master and worker nodes on a cluster.
{% endcapture %}

{% capture prerequisites %}
This page assumes you have a working Juju deployed cluster.

Any of the applications can be scaled out post-deployment. The charms
update the status messages with progress, so it is recommended to run.

```
watch -c juju status --color
```
{% endcapture %}

{% capture steps %}
## Kubernetes masters

The provided Kubernetes master nodes act as a control plane for the cluster.
The deployment has been designed so that these nodes can be scaled independently
of worker nodes to allow for more operational flexibility.
To scale a master node up, simply execute:

    juju add-unit kubernetes-master

This will add another master node to the control plane.
See the [building high-availability clusters](/docs/admin/high-availability)
section of the documentation for more information.

## Kubernetes workers

The kubernetes-worker nodes are the load-bearing units of a Kubernetes cluster.

By default pods are automatically spread throughout the kubernetes-worker units
that you have deployed.

To add more kubernetes-worker units to the cluster:

```
juju add-unit kubernetes-worker
```

or specify machine constraints to create larger nodes:

```
juju set-constraints kubernetes-worker "cpu-cores=8 mem=32G"
juju add-unit kubernetes-worker
```

Refer to the
[machine constraints documentation](https://jujucharms.com/docs/stable/charms-constraints)
for other machine constraints that might be useful for the kubernetes-worker units.

## etcd

Etcd is used as a key-value store for the Kubernetes cluster. The bundle
defaults to one instance in this cluster.

For quorum reasons it is recommended to keep an odd number of etcd nodes. 3, 5, 7, and 9 nodes are the recommended amount of nodes, depending on your cluster size. The CoreOS etcd documentation has a chart for the
[optimal cluster size](https://coreos.com/etcd/docs/latest/admin_guide.html#optimal-cluster-size)
to determine fault tolerance.

To add an etcd unit: 

```
juju add-unit etcd
```

Shrinking of an etcd cluster after growth is not recommended.

## Juju controller

A single node is responsible for coordinating with all the Juju agents
on each machine that manage Kubernetes; it is called the controller node.
For production deployments it is recommended to enable HA of the controller node:

    juju enable-ha
    
Enabling HA results in 3 controller nodes, this should be sufficient for most use cases. 5 and 7 controller nodes are also supported for extra large deployments. 
    
Refer to the [Juju HA controller documentation](https://jujucharms.com/docs/2.2/controllers-ha) for more information.
{% endcapture %}

{% include templates/task.md %}