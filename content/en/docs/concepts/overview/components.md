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
## Control Plane Components

The Control Plane's components make global decisions about the cluster (for example, scheduling), as well as detecting and responding to cluster events (for example, starting up a new {{< glossary_tooltip text="pod" term_id="pod">}} when a deployment's `replicas` field is unsatisfied).

Control Plane components can be run on any machine in the cluster. However,
for simplicity, set up scripts typically start all Control Plane components on
the same machine, and do not run user containers on this machine. See
[Building High-Availability Clusters](/docs/admin/high-availability/) for an example multi-master-VM setup.

### kube-apiserver

{{< glossary_definition term_id="kube-apiserver" length="all" >}}

### etcd

{{< glossary_definition term_id="etcd" length="all" >}}

### kube-scheduler

{{< glossary_definition term_id="kube-scheduler" length="all" >}}

### kube-controller-manager

{{< glossary_definition term_id="kube-controller-manager" length="all" >}}

These controllers include:

  * Node Controller: Responsible for noticing and responding when nodes go down.
  * Replication Controller: Responsible for maintaining the correct number of pods for every replication
  controller object in the system.
  * Endpoints Controller: Populates the Endpoints object (that is, joins Services & Pods).
  * Service Account & Token Controllers: Create default accounts and API access tokens for new namespaces.

### cloud-controller-manager

[cloud-controller-manager](/docs/tasks/administer-cluster/running-cloud-controller/) runs controllers that interact with the underlying cloud providers. The cloud-controller-manager binary is an alpha feature introduced in Kubernetes release 1.6.

cloud-controller-manager runs cloud-provider-specific controller loops only. You must disable these controller loops in the kube-controller-manager. You can disable the controller loops by setting the `--cloud-provider` flag to `external` when starting the kube-controller-manager.

cloud-controller-manager allows the cloud vendor's code and the Kubernetes code to evolve independently of each other. In prior releases, the core Kubernetes code was dependent upon cloud-provider-specific code for functionality. In future releases, code specific to cloud vendors should be maintained by the cloud vendor themselves, and linked to cloud-controller-manager while running Kubernetes.

The following controllers have cloud provider dependencies:

  * Node Controller: For checking the cloud provider to determine if a node has been deleted in the cloud after it stops responding
  * Route Controller: For setting up routes in the underlying cloud infrastructure
  * Service Controller: For creating, updating and deleting cloud provider load balancers
  * Volume Controller: For creating, attaching, and mounting volumes, and interacting with the cloud provider to orchestrate volumes

## Node Components

Node components run on every node, maintaining running pods and providing the Kubernetes runtime environment.

### kubelet

{{< glossary_definition term_id="kubelet" length="all" >}}

### kube-proxy

{{< glossary_definition term_id="kube-proxy" length="all" >}}

### Container Runtime

{{< glossary_definition term_id="container-runtime" length="all" >}}

## Addons

Addons use Kubernetes resources ({{< glossary_tooltip term_id="daemonset" >}},
{{< glossary_tooltip term_id="deployment" >}}, etc)
to implement cluster features. Because these are providing cluster-level features, namespaced resources
for addons belong within the `kube-system` namespace.

Selected addons are described below; for an extended list of available addons, please
see [Addons](/docs/concepts/cluster-administration/addons/).

### DNS

While the other addons are not strictly required, all Kubernetes clusters should have [cluster DNS](/docs/concepts/services-networking/dns-pod-service/), as many examples rely on it.

Cluster DNS is a DNS server, in addition to the other DNS server(s) in your environment, which serves DNS records for Kubernetes services.

Containers started by Kubernetes automatically include this DNS server in their DNS searches.

### Web UI (Dashboard)

[Dashboard](/docs/tasks/access-application-cluster/web-ui-dashboard/) is a general purpose, web-based UI for Kubernetes clusters. It allows users to manage and troubleshoot applications running in the cluster, as well as the cluster itself.

### Container Resource Monitoring

[Container Resource Monitoring](/docs/tasks/debug-application-cluster/resource-usage-monitoring/) records generic time-series metrics
about containers in a central database, and provides a UI for browsing that data.

### Cluster-level Logging

A [cluster-level logging](/docs/concepts/cluster-administration/logging/) mechanism is responsible for
saving container logs to a central log store with search/browsing interface.

{{% /capture %}}
{{% capture whatsnext %}}
* Learn about [Nodes](/docs/concepts/architecture/nodes/)
* Learn about [Controllers](/docs/concepts/architecture/controller/)
* Learn about [kube-scheduler](/docs/concepts/scheduling/kube-scheduler/)
* Read etcd's official [documentation](https://etcd.io/docs/)
{{% /capture %}}
