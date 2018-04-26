---
title: Building High-Availability Clusters
---

## Introduction

This document describes how to build a high-availability (HA) Kubernetes cluster.  This is a fairly advanced topic.
Users who merely want to experiment with Kubernetes are encouraged to use configurations that are simpler to set up such
as [Minikube](/docs/getting-started-guides/minikube/)
or try [Google Kubernetes Engine](https://cloud.google.com/kubernetes-engine/) for hosted Kubernetes.

Also, at this time high availability support for Kubernetes is not continuously tested in our end-to-end (e2e) testing.  We will
be working to add this continuous testing, but for now the single-node master installations are more heavily tested.

* TOC
{:toc}

## Overview

Setting up a truly reliable, highly available distributed system requires a number of steps. It is akin to
wearing underwear, pants, a belt, suspenders, another pair of underwear, and another pair of pants.  We go into each
of these steps in detail, but a summary is given here to help guide and orient the user.

The steps involved are as follows:

   * [Creating the reliable constituent nodes that collectively form our HA master implementation.](#reliable-nodes)
   * [Setting up a redundant, reliable storage layer with clustered etcd.](#establishing-a-redundant-reliable-data-storage-layer)
   * [Starting replicated, load balanced Kubernetes API servers](#replicated-api-servers)
   * [Setting up master-elected Kubernetes scheduler and controller-manager daemons](#master-elected-components)

Here's what the system should look like when it's finished:

![High availability Kubernetes diagram](/images/docs/ha.svg)

## Initial set-up

The remainder of this guide assumes that you are setting up a 3-node clustered master, where each machine is running some flavor of Linux.
Examples in the guide are given for Debian distributions, but they should be easily adaptable to other distributions.
Likewise, this set up should work whether you are running in a public or private cloud provider, or if you are running
on bare metal.

The easiest way to implement an HA Kubernetes cluster is to start with an existing single-master cluster.  The
instructions at [https://get.k8s.io](https://get.k8s.io)
describe easy installation for single-master clusters on a variety of platforms.

## Reliable nodes

On each master node, we are going to run a number of processes that implement the Kubernetes API.  The first step in making these reliable is
to make sure that each automatically restarts when it fails.  To achieve this, we need to install a process watcher.  We choose to use
the `kubelet` that we run on each of the worker nodes.  This is convenient, since we can use containers to distribute our binaries, we can
establish resource limits, and introspect the resource usage of each daemon.  Of course, we also need something to monitor the kubelet
itself (insert who watches the watcher jokes here).  For Debian systems, we choose monit, but there are a number of alternate
choices. For example, on systemd-based systems (e.g. RHEL, CentOS), you can run 'systemctl enable kubelet'.

If you are extending from a standard Kubernetes installation, the `kubelet` binary should already be present on your system.  You can run
`which kubelet` to determine if the binary is in fact installed.  If it is not installed,
you should install the [kubelet binary](https://storage.googleapis.com/kubernetes-release/release/v0.19.3/bin/linux/amd64/kubelet) and [default-kubelet](/docs/admin/high-availability/default-kubelet)
scripts.

If you are using monit, you should also install the monit daemon (`apt-get install monit`) and the [monit-kubelet](/docs/admin/high-availability/monit-kubelet) and
[monit-docker](/docs/admin/high-availability/monit-docker) configs.

On systemd systems you `systemctl enable kubelet` and `systemctl enable docker`.

## Establishing a redundant, reliable data storage layer

The central foundation of a highly available solution is a redundant, reliable storage layer.  The number one rule of high-availability is
to protect the data.  Whatever else happens, whatever catches on fire, if you have the data, you can rebuild.  If you lose the data, you're
done.

Clustered etcd already replicates your storage to all master instances in your cluster.  This means that to lose data, all three nodes would need
to have their physical (or virtual) disks fail at the same time.  The probability that this occurs is relatively low, so for many people
running a replicated etcd cluster is likely reliable enough.  You can add additional reliability by increasing the
size of the cluster from three to five nodes.  If that is still insufficient, you can add
[even more redundancy to your storage layer](#even-more-reliable-storage).

### Clustering etcd

The full details of clustering etcd are beyond the scope of this document, lots of details are given on the
[etcd clustering page](https://github.com/coreos/etcd/blob/master/Documentation/op-guide/clustering.md).  This example walks through
a simple cluster set up, using etcd's built in discovery to build our cluster.

First, hit the etcd discovery service to create a new token:

```shell
curl https://discovery.etcd.io/new?size=3
```

On each node, copy the [etcd.yaml](/docs/admin/high-availability/etcd.yaml) file into `/etc/kubernetes/manifests/etcd.yaml`

The kubelet on each node actively monitors the contents of that directory, and it will create an instance of the `etcd`
server from the definition of the pod specified in `etcd.yaml`.

Note that in `etcd.yaml` you should substitute the token URL you got above for `${DISCOVERY_TOKEN}` on all three machines,
and you should substitute a different name (e.g. `node-1`) for `${NODE_NAME}` and the correct IP address
for `${NODE_IP}` on each machine.

#### Validating your cluster

Once you copy this into all three nodes, you should have a clustered etcd set up.  You can validate on master with

```shell
kubectl exec <pod_name> etcdctl member list
```

and

```shell
kubectl exec <pod_name> etcdctl cluster-health
```

You can also validate that this is working with `etcdctl set foo bar` on one node, and `etcdctl get foo`
on a different node.

### Even more reliable storage

Of course, if you are interested in increased data reliability, there are further options which make the place where etcd
installs its data even more reliable than regular disks (belts *and* suspenders, ftw!).

If you use a cloud provider, then they usually provide this
for you, for example [Persistent Disk](https://cloud.google.com/compute/docs/disks/persistent-disks) on the Google Cloud Platform.  These
are block-device persistent storage that can be mounted onto your virtual machine. Other cloud providers provide similar solutions.

If you are running on physical machines, you can also use network attached redundant storage using an iSCSI or NFS interface.
Alternatively, you can run a clustered file system like Gluster or Ceph.  Finally, you can also run a RAID array on each physical machine.

Regardless of how you choose to implement it, if you chose to use one of these options, you should make sure that your storage is mounted
to each machine.  If your storage is shared between the three masters in your cluster, you should create a different directory on the storage
for each node.  Throughout these instructions, we assume that this storage is mounted to your machine in `/var/etcd/data`.

## Replicated API Servers

Once you have replicated etcd set up correctly, we will also install the apiserver using the kubelet.

### Installing configuration files

First you need to create the initial log file, so that Docker mounts a file instead of a directory:

```shell
touch /var/log/kube-apiserver.log
```

Next, you need to create a `/srv/kubernetes/` directory on each node.  This directory includes:

   * basic_auth.csv  - basic auth user and password
   * ca.crt - Certificate Authority cert
   * known_tokens.csv - tokens that entities (e.g. the kubelet) can use to talk to the apiserver
   * kubecfg.crt - Client certificate, public key
   * kubecfg.key - Client certificate, private key
   * server.cert - Server certificate, public key
   * server.key - Server certificate, private key

The easiest way to create this directory, may be to copy it from the master node of a working cluster, or you can manually generate these files yourself.

### Starting the API Server

Once these files exist, copy the [kube-apiserver.yaml](/docs/admin/high-availability/kube-apiserver.yaml) into `/etc/kubernetes/manifests/` on each master node.

The kubelet monitors this directory, and will automatically create an instance of the `kube-apiserver` container using the pod definition specified
in the file.

### Load balancing

At this point, you should have 3 apiservers all working correctly.  If you set up a network load balancer, you should
be able to access your cluster via that load balancer, and see traffic balancing between the apiserver instances.  Setting
up a load balancer will depend on the specifics of your platform, for example instructions for the Google Cloud
Platform can be found [here](https://cloud.google.com/compute/docs/load-balancing/).

Note, if you are using authentication, you may need to regenerate your certificate to include the IP address of the balancer,
in addition to the IP addresses of the individual nodes.

For pods that you deploy into the cluster, the `kubernetes` service/dns name should provide a load balanced endpoint for the master automatically.

For external users of the API (e.g. the `kubectl` command line interface, continuous build pipelines, or other clients) you will want to configure
them to talk to the external load balancer's IP address.

### Endpoint reconciler

As mentioned in the previous section, the apiserver is exposed through a
service called `kubernetes`. The endpoints for this service correspond to
the apiserver replicas that we just deployed.

Since updating endpoints and services requires the apiserver to be up, there
is special code in the apiserver to let it update its own endpoints directly.
This code is called the "reconciler," because it reconciles the list of
endpoints stored in etcd, and the list of endpoints that are actually up
and running.

Prior to Kubernetes 1.9, the reconciler expects you to provide the
number of endpoints (i.e., the number of apiserver replicas) through
a command-line flag (e.g. `--apiserver-count=3`). If more replicas
are available, the reconciler trims down the list of endpoints.
As a result, if a node running a replica of the apiserver crashes
and gets replaced, the list of endpoints is eventually updated.
However, until the replica gets replaced, its endpoint stays in
the list. During that time, a fraction of the API requests sent
to the `kubernetes` service will fail, because they will be sent
to a down endpoint.

This is why the previous section advises you to deploy a load
balancer, and access the API through that load balancer. The
load balancer will directly assess the health of the apiserver
replicas, and make sure that requests are not sent to crashed
instances.

If you do not add the `--apiserver-count` flag, the value defaults to 1.
Your cluster will work correctly, but each apiserver replica will
continuously try to add itself to the list of endpoints while removing
the other ones, causing a lot of extraneous updates in kube-proxy
and other components.

Starting with Kubernetes 1.9, a new alpha reconciler implementation is
available.  It uses a *lease* that is regularly renewed by each apiserver
replica. When a replica is down, it stops renewing its lease, and the other
replicas notice that the lease expired and remove it from the list of
endpoints. You can switch to the new reconciler by adding the flag
`--endpoint-reconciler-type=lease` when starting your apiserver replicas.

{% include feature-state-alpha.md %}

If you want to know more, you can check the following resources:
- [issue kubernetes/kubernetes#22609](https://github.com/kubernetes/kubernetes/issues/22609),
  which gives additional context
- [master/reconcilers/mastercount.go](https://github.com/kubernetes/kubernetes/blob/dd9981d038012c120525c9e6df98b3beb3ef19e1/pkg/master/reconcilers/mastercount.go#L63),
  the implementation of the master count reconciler
- [PR kubernetes/kubernetes#51698](https://github.com/kubernetes/kubernetes/pull/51698),
  which adds support for the lease reconciler

## Master elected components

So far we have set up state storage, and we have set up the API server, but we haven't run anything that actually modifies
cluster state, such as the controller manager and scheduler.  To achieve this reliably, we only want to have one actor modifying state at a time, but we want replicated
instances of these actors, in case a machine dies.  To achieve this, we are going to use a lease-lock in the API to perform
master election.  We will use the `--leader-elect` flag for each scheduler and controller-manager, using a lease in the API will ensure that only 1 instance of the scheduler and controller-manager are running at once.

The scheduler and controller-manager can be configured to talk to the API server that is on the same node (i.e. 127.0.0.1), or it can be configured to communicate using the load balanced IP address of the API servers. Regardless of how they are configured, the scheduler and controller-manager will complete the leader election process mentioned above when using the `--leader-elect` flag.

In case of a failure accessing the API server, the elected leader will not be able to renew the lease, causing a new leader to be elected. This is especially relevant when configuring the scheduler and controller-manager to access the API server via 127.0.0.1, and the API server on the same node is unavailable.

### Installing configuration files

First, create empty log files on each node, so that Docker will mount the files not make new directories:

```shell
touch /var/log/kube-scheduler.log
touch /var/log/kube-controller-manager.log
```

Next, set up the descriptions of the scheduler and controller manager pods on each node by copying [kube-scheduler.yaml](/docs/admin/high-availability/kube-scheduler.yaml) and [kube-controller-manager.yaml](/docs/admin/high-availability/kube-controller-manager.yaml) into the `/etc/kubernetes/manifests/` directory.

## Conclusion

At this point, you are done (yeah!) with the master components, but you still need to add worker nodes (boo!).

If you have an existing cluster, this is as simple as reconfiguring your kubelets to talk to the load-balanced endpoint, and
restarting the kubelets on each node.

If you are turning up a fresh cluster, you will need to install the kubelet and kube-proxy on each worker node, and
set the `--apiserver` flag to your replicated endpoint.
