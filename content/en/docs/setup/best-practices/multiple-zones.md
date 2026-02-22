---
reviewers:
- jlowdermilk
- justinsb
- quinton-hoole
title: Running in multiple zones
weight: 20
content_type: concept
---

<!-- overview -->

This page describes running Kubernetes across multiple zones.

<!-- body -->

## Background

Kubernetes is designed so that a single Kubernetes cluster can run
across multiple failure zones, typically where these zones fit within
a logical grouping called a _region_. Major cloud providers define a region
as a set of failure zones (also called _availability zones_) that provide
a consistent set of features: within a region, each zone offers the same
APIs and services.

Typical cloud architectures aim to minimize the chance that a failure in
one zone also impairs services in another zone.

## Control plane behavior

All [control plane components](/docs/concepts/architecture/#control-plane-components)
support running as a pool of interchangeable resources, replicated per
component.

When you deploy a cluster control plane, place replicas of
control plane components across multiple failure zones. If availability is
an important concern, select at least three failure zones and replicate
each individual control plane component (API server, scheduler, etcd,
cluster controller manager) across at least three failure zones.
If you are running a cloud controller manager then you should
also replicate this across all the failure zones you selected.

{{< note >}}
Kubernetes does not provide cross-zone resilience for the API server
endpoints. You can use various techniques to improve availability for
the cluster API server, including DNS round-robin, SRV records, or
a third-party load balancing solution with health checking.
{{< /note >}}

## Node behavior

Kubernetes automatically spreads the Pods for
workload resources (such as {{< glossary_tooltip text="Deployment" term_id="deployment" >}}
or {{< glossary_tooltip text="StatefulSet" term_id="statefulset" >}})
across different nodes in a cluster. This spreading helps
reduce the impact of failures.

When nodes start up, the kubelet on each node automatically adds
{{< glossary_tooltip text="labels" term_id="label" >}} to the Node object
that represents that specific kubelet in the Kubernetes API.
These labels can include
[zone information](/docs/reference/labels-annotations-taints/#topologykubernetesiozone).

If your cluster spans multiple zones or regions, you can use node labels
in conjunction with
[Pod topology spread constraints](/docs/concepts/scheduling-eviction/topology-spread-constraints/)
to control how Pods are spread across your cluster among fault domains:
regions, zones, and even specific nodes.
These hints enable the
{{< glossary_tooltip text="scheduler" term_id="kube-scheduler" >}} to place
Pods for better expected availability, reducing the risk that a correlated
failure affects your whole workload.

For example, you can set a constraint to make sure that the
3 replicas of a StatefulSet are all running in different zones to each
other, whenever that is feasible. You can define this declaratively
without explicitly defining which availability zones are in use for
each workload.

### Distributing nodes across zones

Kubernetes' core does not create nodes for you; you need to do that yourself,
or use a tool such as the [Cluster API](https://cluster-api.sigs.k8s.io/) to
manage nodes on your behalf.

Using tools such as the Cluster API you can define sets of machines to run as
worker nodes for your cluster across multiple failure domains, and rules to
automatically heal the cluster in case of whole-zone service disruption.

## Manual zone assignment for Pods

You can apply [node selector constraints](/docs/concepts/scheduling-eviction/assign-pod-node/#nodeselector)
to Pods that you create, as well as to Pod templates in workload resources
such as Deployment, StatefulSet, or Job.

## Storage access for zones

When persistent volumes are created, Kubernetes automatically adds zone labels 
to any PersistentVolumes that are linked to a specific zone.
The {{< glossary_tooltip text="scheduler" term_id="kube-scheduler" >}} then ensures,
through its `NoVolumeZoneConflict` predicate, that pods which claim a given PersistentVolume
are only placed into the same zone as that volume.

Please note that the method of adding zone labels can depend on your 
cloud provider and the storage provisioner you’re using. Always refer to the specific 
documentation for your environment to ensure correct configuration.

You can specify a {{< glossary_tooltip text="StorageClass" term_id="storage-class" >}}
for PersistentVolumeClaims that specifies the failure domains (zones) that the
storage in that class may use.
To learn about configuring a StorageClass that is aware of failure domains or zones,
see [Allowed topologies](/docs/concepts/storage/storage-classes/#allowed-topologies).

## Networking

By itself, Kubernetes does not include zone-aware networking. You can use a
[network plugin](/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins/)
to configure cluster networking, and that network solution might have zone-specific
elements. For example, if your cloud provider supports Services with
`type=LoadBalancer`, the load balancer might only send traffic to Pods running in the
same zone as the load balancer element processing a given connection.
Check your cloud provider's documentation for details.

For custom or on-premises deployments, similar considerations apply.
{{< glossary_tooltip text="Service" term_id="service" >}} and
{{< glossary_tooltip text="Ingress" term_id="ingress" >}} behavior, including handling
of different failure zones, does vary depending on exactly how your cluster is set up.

## Fault recovery

When you set up your cluster, you might also need to consider whether and how
your setup can restore service if all the failure zones in a region go
off-line at the same time. For example, do you rely on there being at least
one node able to run Pods in a zone?  
Make sure that any cluster-critical repair work does not rely
on there being at least one healthy node in your cluster. For example: if all nodes
are unhealthy, you might need to run a repair Job with a special
{{< glossary_tooltip text="toleration" term_id="toleration" >}} so that the repair
can complete enough to bring at least one node into service.

Kubernetes doesn't come with an answer for this challenge; however, it's
something to consider.

## {{% heading "whatsnext" %}}

To learn how the scheduler places Pods in a cluster, honoring the configured constraints,
visit [Scheduling and Eviction](/docs/concepts/scheduling-eviction/).
