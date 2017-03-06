---
assignees:
- lavalamp
title: Kubernetes Components
---

This document outlines the various binary components that need to run to
deliver a functioning Kubernetes cluster.

## Master Components

Master components are those that provide the cluster's control plane. For
example, master components are responsible for making global decisions about the
cluster (e.g., scheduling), and detecting and responding to cluster events
(e.g., starting up a new pod when a replication controller's 'replicas' field is
unsatisfied).

In theory, Master components can be run on any node in the cluster. However,
for simplicity, current set up scripts typically start all master components on
the same VM, and does not run user containers on this VM. See
[high-availability.md](/docs/admin/high-availability) for an example multi-master-VM setup.

Even in the future, when Kubernetes is fully self-hosting, it will probably be
wise to only allow master components to schedule on a subset of nodes, to limit
co-running with user-run pods, reducing the possible scope of a
node-compromising security exploit.

### kube-apiserver

[kube-apiserver](/docs/admin/kube-apiserver) exposes the Kubernetes API; it is the front-end for the
Kubernetes control plane. It is designed to scale horizontally (i.e., one scales
it by running more of them-- [high-availability.md](/docs/admin/high-availability)).

### etcd

[etcd](/docs/admin/etcd) is used as Kubernetes' backing store. All cluster data is stored here.
Proper administration of a Kubernetes cluster includes a backup plan for etcd's
data.

### kube-controller-manager

[kube-controller-manager](/docs/admin/kube-controller-manager) is a binary that runs controllers, which are the
background threads that handle routine tasks in the cluster. Logically, each
controller is a separate process, but to reduce the number of moving pieces in
the system, they are all compiled into a single binary and run in a single
process.

These controllers include:

* Node Controller: Responsible for noticing & responding when nodes go down.
* Replication Controller: Responsible for maintaining the correct number of pods for every replication
  controller object in the system.
* Endpoints Controller: Populates the Endpoints object (i.e., join Services & Pods).
* Service Account & Token Controllers: Create default accounts and API access tokens for new namespaces.
* ... and others.

### kube-scheduler

[kube-scheduler](/docs/admin/kube-scheduler) watches newly created pods that have no node assigned, and
selects a node for them to run on.

### addons

Addons are pods and services that implement cluster features. The pods may be managed
by Deployments, ReplicationContollers, etc. Namespaced addon objects are created in
the "kube-system" namespace.

Addon manager takes the responsibility for creating and maintaining addon resources.
See [here](http://releases.k8s.io/HEAD/cluster/addons) for more details.

#### DNS

While the other addons are not strictly required, all Kubernetes
clusters should have [cluster DNS](/docs/admin/dns/), as many examples rely on it.

Cluster DNS is a DNS server, in addition to the other DNS server(s) in your
environment, which serves DNS records for Kubernetes services.

Containers started by Kubernetes automatically include this DNS server
in their DNS searches.

#### User interface

The kube-ui provides a read-only overview of the cluster state.  Access
[the UI using kubectl proxy](/docs/user-guide/connecting-to-applications-proxy/#connecting-to-the-kube-ui-service-from-your-local-workstation)

#### Container Resource Monitoring

[Container Resource Monitoring](/docs/user-guide/monitoring) records generic time-series metrics
about containers in a central database, and provides a UI for browsing that data.

#### Cluster-level Logging

A [Cluster-level logging](/docs/user-guide/logging/overview) mechanism is responsible for
saving container logs to a central log store with search/browsing interface.

## Node components

Node components run on every node, maintaining running pods and providing them
the Kubernetes runtime environment.

### kubelet

[kubelet](/docs/admin/kubelet) is the primary node agent. It:

* Watches for pods that have been assigned to its node (either by apiserver
  or via local configuration file) and:
* Mounts the pod's required volumes
* Downloads the pod's secrets
* Runs the pod's containers via docker (or, experimentally, rkt).
* Periodically executes any requested container liveness probes.
* Reports the status of the pod back to the rest of the system, by creating a
  "mirror pod" if necessary.
* Reports the status of the node back to the rest of the system.

### kube-proxy

[kube-proxy](/docs/admin/kube-proxy) enables the Kubernetes service abstraction by maintaining
network rules on the host and performing connection forwarding.

### docker

`docker` is of course used for actually running containers.

### rkt

`rkt` is supported experimentally as an alternative to docker.

### supervisord

`supervisord` is a lightweight process babysitting system for keeping kubelet and docker
running.

### fluentd

`fluentd` is a daemon which helps provide [cluster-level logging](#cluster-level-logging).
