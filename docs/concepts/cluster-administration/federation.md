---
title: Federation
---

This guide explains why and how to manage multiple Kubernetes clusters using
federation.


* TOC
{:toc}


## Why federation

Federation makes it easy to manage multiple clusters. It does so by providing 2
major building blocks:

  * Sync resources across clusters: Federation provides the ability to keep
    resources in multiple clusters in sync. This can be used, for example, to
    ensure that the same deployment exists in multiple clusters.
  * Cross cluster discovery: It provides the ability to auto-configure DNS
    servers and load balancers with backends from all clusters. This can be used,
    for example, to ensure that a global VIP or DNS record can be used to access
    backends from multiple clusters.

Some other use cases that federation enables are:

* High Availability: By spreading load across clusters and auto configuring DNS
  servers and load balancers, federation minimises the impact of cluster
  failure.
* Avoiding provider lock-in: By making it easier to migrate applications across
  clusters, federation prevents cluster provider lock-in.


Federation is not helpful unless you have multiple clusters. Some of the reasons
why you might want multiple clusters are:

* Low latency: Having clusters in multiple regions minimises latency by serving
  users from the cluster that is closest to them.
* Fault isolation: It might be better to have multiple small clusters rather
  than a single large  cluster for fault isolation (for example: multiple
  clusters in different availability zones of a cloud provider).
  [Multi cluster guide](/docs/admin/multi-cluster) has more details on this.
* Scalability: There are scalability limits to a single kubernetes cluster (this
  should not be the case for most users. For more details:
  [Kubernetes Scaling and Performance Goals](https://github.com/kubernetes/community/blob/master/sig-scalability/goals.md)).
* Hybrid cloud: You can have multiple clusters on different cloud providers or
  on-premises data centers.


### Caveats

While there are a lot of attractive use cases for federation, there are also
some caveats.

* Increased network bandwidth and cost: The federation control plane watches all
  clusters to ensure that the current state is as expected. This can lead to
  significant network cost if the clusters are running in different regions on
  a cloud provider or on different cloud providers.
* Reduced cross cluster isolation: A bug in the federation control plane can
  impact all clusters. This is mitigated by keeping the logic in federation
  control plane to a minimum. It mostly delegates to the control plane in
  kubernetes clusters whenever it can. The design and implementation also errs
  on the side of safety and avoiding multicluster outage.
* Maturity: The federation project is relatively new and is not very mature.
  Not all resources are available and many are still alpha. [Issue
  38893](https://github.com/kubernetes/kubernetes/issues/38893) ennumerates
  known issues with the system that the team is busy solving.

## Setup

To be able to federate multiple clusters, we first need to setup a federation
control plane.
Follow the [setup guide](/docs/admin/federation/) to setup the
federation control plane.

## Hybrid cloud capabilities

Federations of Kubernetes Clusters can include clusters running in
different cloud providers (e.g. Google Cloud, AWS), and on-premises
(e.g. on OpenStack). Simply create all of the clusters that you
require, in the appropriate cloud providers and/or locations, and
register each cluster's API endpoint and credentials with your
Federation API Server (See the
[federation admin guide](/docs/admin/federation/) for details).

Thereafter, your API resources can span different clusters
and cloud providers.

## API resources

Once we have the control plane setup, we can start creating federation API
resources.
The following guides explain some of the resources in detail:

* [ConfigMap](https://kubernetes.io/docs/user-guide/federation/configmap/)
* [DaemonSets](https://kubernetes.io/docs/user-guide/federation/daemonsets/)
* [Deployment](https://kubernetes.io/docs/user-guide/federation/deployment/)
* [Events](https://kubernetes.io/docs/user-guide/federation/events/)
* [Ingress](https://kubernetes.io/docs/user-guide/federation/federated-ingress/)
* [Namespaces](https://kubernetes.io/docs/user-guide/federation/namespaces/)
* [ReplicaSets](https://kubernetes.io/docs/user-guide/federation/replicasets/)
* [Secrets](https://kubernetes.io/docs/user-guide/federation/secrets/)
* [Services](https://kubernetes.io/docs/user-guide/federation/federated-services/)

[API reference docs](/docs/federation/api-reference/) lists all the
resources supported by federation apiserver.

## Cascading deletion

Kubernetes version 1.5 includes support for cascading deletion of federated
resources. With cascading deletion, when you delete a resource from the
federation control plane, the corresponding resources in all underlying clusters
are also deleted.

To enable cascading deletion, set the option
`DeleteOptions.orphanDependents=false` when you delete a resource from the
federation control plane.

The following Federated resources are affected by cascading deletion:

* [Ingress](https://kubernetes.io/docs/user-guide/federation/federated-ingress/)
* [Namespaces](https://kubernetes.io/docs/user-guide/federation/namespaces/)
* [ReplicaSets](https://kubernetes.io/docs/user-guide/federation/replicasets/)
* [Secrets](https://kubernetes.io/docs/user-guide/federation/secrets/)
* [Deployment](https://kubernetes.io/docs/user-guide/federation/deployment/)
* [DaemonSets](https://kubernetes.io/docs/user-guide/federation/daemonsets/)

Note: By default, deleting a resource from federation control plane does not
delete the corresponding resources from underlying clusters.


## For more information

* [Federation
  proposal](https://github.com/kubernetes/community/blob/{{page.githubbranch}}/contributors/design-proposals/federation.md)
* [Kubecon2016 talk on federation](https://www.youtube.com/watch?v=pq9lbkmxpS8)
