---
title: Federation
content_template: templates/concept
weight: 80
---

{{% capture overview %}}

{{< deprecationfilewarning >}}
{{< include "federation-deprecation-warning-note.md" >}}
{{< /deprecationfilewarning >}}

This page explains why and how to manage multiple Kubernetes clusters using
federation.
{{% /capture %}}

{{% capture body %}}
## Why federation

Federation makes it easy to manage multiple clusters. It does so by providing 2
major building blocks:

  * Sync resources across clusters: Federation provides the ability to keep
    resources in multiple clusters in sync. For example, you can ensure that the same deployment exists in multiple clusters.
  * Cross cluster discovery: Federation provides the ability to auto-configure DNS servers and load balancers with backends from all clusters. For example, you can ensure that a global VIP or DNS record can be used to access backends from multiple clusters.

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
  than a single large cluster for fault isolation (for example: multiple
  clusters in different availability zones of a cloud provider).
* Scalability: There are scalability limits to a single kubernetes cluster (this
  should not be the case for most users. For more details:
  [Kubernetes Scaling and Performance Goals](https://git.k8s.io/community/sig-scalability/goals.md)).
* [Hybrid cloud](#hybrid-cloud-capabilities): You can have multiple clusters on different cloud providers or
  on-premises data centers.

### Caveats

While there are a lot of attractive use cases for federation, there are also
some caveats:

* Increased network bandwidth and cost: The federation control plane watches all
  clusters to ensure that the current state is as expected. This can lead to
  significant network cost if the clusters are running in different regions on
  a cloud provider or on different cloud providers.
* Reduced cross cluster isolation: A bug in the federation control plane can
  impact all clusters. This is mitigated by keeping the logic in federation
  control plane to a minimum. It mostly delegates to the control plane in
  kubernetes clusters whenever it can. The design and implementation also errs
  on the side of safety and avoiding multi-cluster outage.
* Maturity: The federation project is relatively new and is not very mature.
  Not all resources are available and many are still alpha. [Issue
  88](https://github.com/kubernetes/federation/issues/88) enumerates
  known issues with the system that the team is busy solving.

### Hybrid cloud capabilities

Federations of Kubernetes Clusters can include clusters running in
different cloud providers (e.g. Google Cloud, AWS), and on-premises
(e.g. on OpenStack). [Kubefed](/docs/tasks/federation/set-up-cluster-federation-kubefed/) is the recommended way to deploy federated clusters.

Thereafter, your [API resources](#api-resources) can span different clusters
and cloud providers.

## Setting up federation

To be able to federate multiple clusters, you first need to set up a federation
control plane.
Follow the [setup guide](/docs/tutorials/federation/set-up-cluster-federation-kubefed/) to set up the
federation control plane.

## API resources

Once you have the control plane set up, you can start creating federation API
resources.
The following guides explain some of the resources in detail:

* [Cluster](/docs/tasks/administer-federation/cluster/)
* [ConfigMap](/docs/tasks/administer-federation/configmap/)
* [DaemonSets](/docs/tasks/administer-federation/daemonset/)
* [Deployment](/docs/tasks/administer-federation/deployment/)
* [Events](/docs/tasks/administer-federation/events/)
* [Hpa](/docs/tasks/administer-federation/hpa/)
* [Ingress](/docs/tasks/administer-federation/ingress/)
* [Jobs](/docs/tasks/administer-federation/job/)
* [Namespaces](/docs/tasks/administer-federation/namespaces/)
* [ReplicaSets](/docs/tasks/administer-federation/replicaset/)
* [Secrets](/docs/tasks/administer-federation/secret/)
* [Services](/docs/concepts/cluster-administration/federation-service-discovery/)


The [API reference docs](/docs/reference/federation/) list all the
resources supported by federation apiserver.

## Cascading deletion

Kubernetes version 1.6 includes support for cascading deletion of federated
resources. With cascading deletion, when you delete a resource from the
federation control plane, you also delete the corresponding resources in all underlying clusters.

Cascading deletion is not enabled by default when using the REST API. To enable
it, set the option `DeleteOptions.orphanDependents=false` when you delete a
resource from the federation control plane using the REST API. Using `kubectl
delete`
enables cascading deletion by default. You can disable it by running `kubectl
delete --cascade=false`

Note: Kubernetes version 1.5 included cascading deletion support for a subset of
federation resources.

## Scope of a single cluster

On IaaS providers such as Google Compute Engine or Amazon Web Services, a VM exists in a
[zone](https://cloud.google.com/compute/docs/zones) or [availability
zone](http://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-regions-availability-zones.html).
We suggest that all the VMs in a Kubernetes cluster should be in the same availability zone, because:

  - compared to having a single global Kubernetes cluster, there are fewer single-points of failure.
  - compared to a cluster that spans availability zones, it is easier to reason about the availability properties of a
    single-zone cluster.
  - when the Kubernetes developers are designing the system (e.g. making assumptions about latency, bandwidth, or
    correlated failures) they are assuming all the machines are in a single data center, or otherwise closely connected.

It is recommended to run fewer clusters with more VMs per availability zone; but it is possible to run multiple clusters per availability zones.

Reasons to prefer fewer clusters per availability zone are:

  - improved bin packing of Pods in some cases with more nodes in one cluster (less resource fragmentation).
  - reduced operational overhead (though the advantage is diminished as ops tooling and processes mature).
  - reduced costs for per-cluster fixed resource costs, e.g. apiserver VMs (but small as a percentage
    of overall cluster cost for medium to large clusters).

Reasons to have multiple clusters include:

  - strict security policies requiring isolation of one class of work from another (but, see Partitioning Clusters
    below).
  - test clusters to canary new Kubernetes releases or other cluster software.

## Selecting the right number of clusters

The selection of the number of Kubernetes clusters may be a relatively static choice, only revisited occasionally.
By contrast, the number of nodes in a cluster and the number of pods in a service may change frequently according to
load and growth.

To pick the number of clusters, first, decide which regions you need to be in to have adequate latency to all your end users, for services that will run
on Kubernetes (if you use a Content Distribution Network, the latency requirements for the CDN-hosted content need not
be considered).  Legal issues might influence this as well. For example, a company with a global customer base might decide to have clusters in US, EU, AP, and SA regions.
Call the number of regions to be in `R`.

Second, decide how many clusters should be able to be unavailable at the same time, while still being available.  Call
the number that can be unavailable `U`.  If you are not sure, then 1 is a fine choice.

If it is allowable for load-balancing to direct traffic to any region in the event of a cluster failure, then
you need at least the larger of `R` or `U + 1` clusters.  If it is not (e.g. you want to ensure low latency for all
users in the event of a cluster failure), then you need to have `R * (U + 1)` clusters
(`U + 1` in each of `R` regions).  In any case, try to put each cluster in a different zone.

Finally, if any of your clusters would need more than the maximum recommended number of nodes for a Kubernetes cluster, then
you may need even more clusters.  Kubernetes v1.3 supports clusters up to 1000 nodes in size. Kubernetes v1.8 supports
clusters up to 5000 nodes. See [Building Large Clusters](/docs/setup/best-practices/cluster-large/) for more guidance.

{{% /capture %}}

{{% capture whatsnext %}}
* Learn more about the [Federation
  proposal](https://github.com/kubernetes/community/blob/{{< param "githubbranch" >}}/contributors/design-proposals/multicluster/federation.md).
* See this [setup guide](/docs/tutorials/federation/set-up-cluster-federation-kubefed/) for cluster federation.
* See this [Kubecon2016 talk on federation](https://www.youtube.com/watch?v=pq9lbkmxpS8)
* See this [Kubecon2017 Europe update on federation](https://www.youtube.com/watch?v=kwOvOLnFYck)
* See this [Kubecon2018 Europe update on sig-multicluster](https://www.youtube.com/watch?v=vGZo5DaThQU)
* See this [Kubecon2018 Europe Federation-v2 prototype presentation](https://youtu.be/q27rbaX5Jis?t=7m20s)
* See this [Federation-v2 Userguide](https://github.com/kubernetes-sigs/federation-v2/blob/master/docs/userguide.md)
{{% /capture %}}
