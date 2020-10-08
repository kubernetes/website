---
reviewers:
- davidopp
- lavalamp
title: Considerations for large clusters
weight: 20
---

A cluster is a set of {{< glossary_tooltip text="nodes" term_id="node" >}} (physical
or virtual machines) running Kubernetes agents, managed by the
{{< glossary_tooltip text="control plane" term_id="control-plane" >}}.
Kubernetes {{< param "version" >}} supports clusters with up to 5000 nodes. More specifically,
Kubernetes is designed to accommodate configurations that meet *all* of the following criteria:

* No more than 100 pods per node
* No more than 5000 nodes
* No more than 150000 total pods
* No more than 300000 total containers

You can scale your cluster by adding or removing nodes. The way you do this depends
on how your cluster is deployed.

## Cloud provider resource quotas {#quota-issues}

To avoid running into cloud provider quota issues, when creating a cluster with many nodes,
consider:
* Request a quota increase for cloud resources such as:
    * Computer instances
    * CPUs
    * Storage volumes
    * In-use IP addresses
    * Packet filtering rule sets
    * Number of load balancers
    * Network subnets
    * Log streams
* Gate the cluster scaling actions to brings up new nodes in batches, with a pause
  between batches, because some cloud providers rate limit the creation of new instances.

## Control plane components

For a large cluster, you need a control plane with sufficient compute and other
resources.

Typically you would run one or two control plane instances per failure zone,
scaling those instances vertically first and then scaling horizontally after reaching
the point of falling returns to (vertical) scale.

### etcd storage

To improve performance of large clusters, you can store Event objects in a separate
dedicated etcd instance.

When creating a cluster, you can (using custom tooling):

* start and configure additional etcd instance
* configure the {{< glossary_tooltip term_id="kube-apiserver" text="API server" >}} to use it for storing events

## Addon resources

To prevent memory leaks or other resource issues in cluster
{{< glossary_tooltip text="addon" term_id="addons" >}} from consuming all the resources
available on a node, Kubernetes sets
[resource limits](/docs/concepts/configuration/manage-resources-containers/) on addon
Pods to limit the amount of CPU and memory that they can consume.

For example:

```yaml
  containers:
  - name: fluentd-cloud-logging
    image: fluent/fluentd-kubernetes-daemonset:v1
    resources:
      limits:
        cpu: 100m
        memory: 200Mi
```

These limits are static and are based on data collected from addons running on
small clusters. Most addons consume a lot more resources when running on large
clusters. So, if a large cluster is deployed without adjusting these values, the
addon(s) may continuously get killed because they keep hitting the limits.

To avoid running into cluster addon resource issues, when creating a cluster with
many nodes, consider the following:

* Some addons scale vertically - there is one replica of the addon for the cluster
  or serving a whole failure zone. For these addons, increase requests and limits
  as you scale out your cluster.
* Many addons scale horizontally - you add capacity by running more pods - but with
  a very large cluster you may also need to raise CPU or memory limits slightly.
  The VerticalPodAutoscaler can run in _recommender_ mode to provide suggested
  figures for requests and limits.
* Some addons run as one copy per node, controlled by a {{< glossary_tooltip text="DaemonSet"
  term_id="daemonset" >}}: for example, a node-level log aggregator. Similar to
  the case with horizontally-scaled addons, you may also need to raise CPU or memory
  limits slightly.

## {{% heading "whatsnext" %}}

`VerticalPodAutoscaler` is a custom resource that you can deploy into your cluster
to help you manage resource requests and limits for pods.  
Visit [Vertical Pod Autoscaler](https://github.com/kubernetes/autoscaler/tree/master/vertical-pod-autoscaler#readme)
to learn more about `VerticalPodAutoscaler` and how you can use it to scale cluster
components, including cluster-critical addons.

The [cluster autoscaler](https://github.com/kubernetes/autoscaler/tree/master/cluster-autoscaler#readme)
integrates with a number of cloud providers to help you run the right number of
nodes for the level of resource demand in your cluster.
