---
reviewers:
- lavalamp
title: Kubernetes Components
content_template: templates/concept
weight: 20
card: 
  name: concepts
  weight: 20
---

{{% capture overview %}}
When you deploy Kubernetes, you get a cluster.
{{< glossary_definition term_id="cluster" length="all" prepend="A Kubernetes cluster consists of">}}

This document outlines the various components you need to have
a complete and working Kubernetes cluster.

Here's the diagram of a Kubernetes cluster with all the components tied together.

![Components of Kubernetes](/images/docs/components-of-kubernetes.png)

{{% /capture %}}

{{% capture body %}}
## Node components

In Kubernetes, your application runs inside groups of one or more
co-located containers called
{{< glossary_tooltip text="_pods_" term_id="pod" >}}. Containers within a
pod may share resources, such as an IP address and storage volumes, whereas
pods are isolated from one another and from their hosts.  
The hosts that run pods are called nodes, and one node can run pods from many
different applications.

To make this happen, Kubernetes runs several components on each node:

### kubelet

{{< glossary_definition term_id="kubelet" length="all" >}}

### kube-proxy

{{< glossary_definition term_id="kube-proxy" length="all" >}}

### Container runtime

{{< glossary_definition term_id="container-runtime" length="all" >}}

## Control plane components

The more different kinds of pod you want to run in your cluster, the
more it helps to have systems to manage and share system resources,
to make sure pods can communicate with other pods they need to talk to,
and to make sure that the cluster is operating securely.

The control plane's components make global decisions for your cluster
(for example, scheduling), as well as detecting and responding to
workload- level events (for example, starting up a new
{{< glossary_tooltip text="pod" term_id="pod">}} when a deployment's `replicas`
field is unsatisfied).

Control plane components can be run on any machine in the cluster. However,
for simplicity, set up scripts typically start all control plane components on
the same machine, and do not run user containers on this machine. See
[Building High-Availability Clusters](/docs/admin/high-availability/) for
an example of a control plane distributed across multiple hosts.

### kube-apiserver

{{< glossary_definition term_id="kube-apiserver" length="all" >}}

### etcd

{{< glossary_definition term_id="etcd" length="all" >}}

### kube-scheduler

{{< glossary_definition term_id="kube-scheduler" length="all" >}}

### kube-controller-manager

{{< glossary_definition term_id="kube-controller-manager" length="all" >}}

These controllers include:

  * Deployment controller: Responsible for maintaining the correct numbers of Pods for stateless
    applications, and ensuring they are running with up-to-date configurations.
  * Node controller: Responsible for noticing and responding when nodes go offline.
  * Endpoints controller: Populates the Endpoints object (that is, joins Services & Pods).
  * ServiceAccount & Token controllers: Create default accounts and API access tokens for new namespaces.

### Cloud controller manager {#cloud-controller-manager}

{{< glossary_definition term_id="cloud-controller-manager" length="short" >}}

The cloud-controller-manager only runs controllers that are specific to your cloud provider.
If you are running Kubernetes on your own premises, or in a learning environment inside your
own PC, the cluster does not have a cloud controller manager.

As with the kube-controller-manager, the cloud-controller-manager combines several logically
independent control loops into a single binary that you run as a single process. You can
scale horizontally (run more than one copy) to improve performance or to help tolerate failures.

The following controllers can have cloud provider dependencies:

  * Node controller: For checking the cloud provider to determine if a node has been deleted in the cloud after it stops responding
  * Route controller: For setting up routes in the underlying cloud infrastructure
  * Service controller: For creating, updating and deleting cloud provider load balancers

## Add-ons {#addons}

Add-ons use Kubernetes resources ({{< glossary_tooltip term_id="daemonset" >}},
{{< glossary_tooltip term_id="deployment" >}}, etc)
to implement cluster features. Because these are providing cluster-level features, namespaced resources
for addons often belong within the `kube-system`
{{< glossary_tooltip term_id="namespace" text="namespace">}}.

Some important examples of add-ons are:

### DNS

While the other add-ons are not strictly required, all Kubernetes clusters should have [cluster DNS](/docs/concepts/services-networking/dns-pod-service/), as many elements of Kubernetes rely on it.

_Cluster DNS_ provides DNS specifically for your Kubernetes cluster, and lets Pods in the
cluster look up DNS records for Kubernetes services.

When Kubernetes runs a container, the kubelet provides configuration so that the application
in the container automatically includes the cluster DNS service in its DNS searches.

### Web UI (Dashboard)

[Dashboard](/docs/tasks/access-application-cluster/web-ui-dashboard/) is a general purpose, web-based UI for Kubernetes clusters. It allows users to manage and troubleshoot applications running in the cluster, as well as the cluster itself.

### Resource monitoring

[Resource monitoring tools](/docs/tasks/debug-application-cluster/resource-usage-monitoring/) let you
records generic time-series metrics about pods and their containers. You can link these up
to additional tooling that lets you view the metrics graphically, identify anomalies,
and alert about issues.

### Cluster-level logging

You can set up [cluster-level logging](/docs/concepts/cluster-administration/logging/) for
your cluster; for example, you can use a system that sends container logs to a central
log store with search/browsing interface.

{{% /capture %}}
{{% capture whatsnext %}}
* Learn about [nodes](/docs/concepts/architecture/nodes/)
* Learn about [Pods](/docs/concepts/workloads/pods/pod/#motivation-for-pods) and why Kubernetes uses them
  to group containers
* Learn about [controllers](/docs/concepts/architecture/controller/)
* Learn about [kube-scheduler](/docs/concepts/scheduling/kube-scheduler/)

If you want to read about some of the above topics in depth, you can also:

* Read etcd's official [documentation](https://etcd.io/docs/)
* See [Add-ons](/docs/concepts/cluster-administration/addons/) for a longer list of Kubernetes add-ons
{{% /capture %}}
