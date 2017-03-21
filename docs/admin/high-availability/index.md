# Running highly-available (HA) clusters

## Introduction

This document describes generic architecture of highly-available (HA) kubernetes
clusters. We discuss here problems and challenges raised by HA setup that need
to addressed regardless of cloud provider, and show how they were solved for
GCE. If you are only interested in running HA cluster on GCE, please see
[http://kubernetes.io/docs/admin/ha-master-gce/](http://kubernetes.io/docs/admin/ha-master-gce/)
for details.

* TOC
{:toc}

## Overview

The idea behind HA cluster is to create a number of master replicas, each
preferably in a different failure zone. So that a failure of a single replica
should not result in a failure of the whole cluster. Similarly, worker nodes
should also be distributed among failure zones.

![High availability Kubernetes diagram](/images/docs/ha-clusters.svg)

## Master Replicas

Each master replica runs a set of kubernetes components. Here, we identify them
and briefly describe, how they should behave in HA cluster.

### API server & etcd

Each API server can work independently, reading & writing to a local etcd
instance. All etcd instances should be clustered together. One of etcd instances
will be elected a leader, but this information will be transparent for API
servers: each etcd replica not being a leader will transparently direct request
to the leader. Each modifications in etcd state will need quorum.

Etcd instances in etcd cluster expose a port for inter-cluster communication.
Such port should be secured by SSL.

The solution described here (API servers talking with local etcd instances, etcd
instances cooperate in one cluster) is a part of GCE implementation of HA
master.

### Controller manager, scheduler and cluster autoscaler

Controller manager, scheduler and cluster autoscaler should use lease mechanism
to guarantee, that exactly one instance will be active. Other instances will
wait in standby mode.

All component mentioned here support a leader election out-of-the-box. The
leader election mechanism is used in GCE implementation of HA master.

### Add-on manager

Add-on manager observers the current state and tries to sync it with files on
disk. Add-on managers are independent one from another. So, add-on managers should
be active on all master replicas, which is also the case for GCE implementation
for HA master.

## Load balancing API servers

In HA cluster we have a set of independent API servers. We need a way of
accessing them. In addition, we should be able to migrate a multi-master cluster
to a single-master cluster and vice-versa keeping the access-way.

There are two main options how we can address the clusters:
DNS name,
external static IP address.

In case A, we can either manually managed DNS entries for the API servers, or
use specialized solutions like Route53 (AWS) or Google Cloud DNS (GCP). DNS
entry can either point to the set of API servers and choose them using
round-robin, or it can point to L4 load balancer created in front of the set of
API servers.

On GCE, we use external IP address for load balancing (case B). In a single
master cluster, the IP address points to the single API server. When starting
the second master replica, a load balancer containing the two replicas will be
created and the IP address of the first replica will be promoted to IP address
of the load balancer. Similarly, after removal of the penultimate master
replica, the load balancer will be removed and its IP address will be assigned
to the last remaining replica. Please note that creation and removal of load
balancer are complex operations and it may take some time (~20 minutes) for them
to propagate.

## Master certificates

All communication with master servers is protected using TLS certificates. We
need to make sure that the certificates allow to access API servers by DNS name
or external static IP address of the cluster (whichever is used for load
balancing).

On GCE, kubernetes generates master TLS certificates for the external public IP
and local IP for each replica. There are no certificates for the ephemeral
public IPs of replicas; to access a replica via its ephemeral public IP, you
must skip TLS verification.

## Kubernetes service

Kubernetes maintains a special service called kubernetes. It is designed to keep
IP addresses of all API servers. Each API server will add itself to the service,
limiting the total numbers of endpoints in the service to apiserver-count given
as a command line flag.
To support HA cluster, apiserver-count needs be set on API servers in the
cluster, and it needs to match the number of master replicas. Any
addition/removal of a master replica should be reflected in changing
apiserver-count.
However, on GCE, a different solution is used. Instead of trying to keep an
up-to-date list of Kubernetes apiserver in the kubernetes service, the
kubernetes service directs all traffic to the external IP:
in one master cluster the IP points to the single master,
in multi-master cluster the IP points to the load balancer in-front of the
masters.
Similarly, the external IP will be used by kubelets to communicate with master.

## Worker Nodes

In addition to replicating masters, HA setup also requires keeping worker nodes
in multiple failure zones. Therefore, failure of a single zone will not bring
down all worker nodes in the cluster. Detailed documentation, how multi-nodes
cluster are supported by Kubernetes and how they can be deployed on GCE and AWS,
can be found in
[Running in Multiple Zones](http://kubernetes.io/docs/admin/multiple-zones/) doc.

## Additional reading
* [HA master on GCE: user guide](http://kubernetes.io/docs/admin/ha-master-gce/),
* [Running in Multiple Zones](http://kubernetes.io/docs/admin/multiple-zones/),
* [Blog Post: Highly Available Kubernetes Clusters](http://blog.kubernetes.io/2017/02/highly-available-kubernetes-clusters.html),
* [Automated HA master deployment](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/ha_master.md) - design doc, may be outdated.

