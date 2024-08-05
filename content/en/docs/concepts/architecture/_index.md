---
title: "Cluster Architecture"
weight: 30
description: >
  The architectural concepts behind Kubernetes.
---

A Kubernetes cluster consists of a set of worker machines, called nodes, that run containerized applications. Every cluster has at least one worker node.

The worker node(s) host the Pods that are the components of the application workload. The control plane manages the worker nodes and the Pods in the cluster. In production environments, the control plane usually runs across multiple computers and a cluster usually runs multiple nodes, providing fault-tolerance and high availability.

This document outlines the various components you need to have for a complete and working Kubernetes cluster.

{{< figure src="/images/docs/kubernetes-cluster-architecture.svg" alt="The control plane (kube-apiserver, etcd, kube-controller-manager, kube-scheduler) and several nodes. Each node is running a kubelet and kube-proxy."
title="Kubernetes cluster components"
caption="**Note:** This diagram presents an example reference architecture for a Kubernetes cluster. The actual distribution of components can vary based on specific cluster setups and requirements." class="diagram-large" >}}

## Control Plane Components

The control plane's components make global decisions about the cluster (for example, scheduling), as well as detecting and responding to cluster events (for example, starting up a new {{< glossary_tooltip text="pod" term_id="pod">}} when a Deployment's `{{< glossary_tooltip text="replicas" term_id="replica" >}}` field is unsatisfied).

Control plane components can be run on any machine in the cluster. However, for simplicity, setup scripts typically start all control plane components on the same machine, and do not run user containers on this machine. See [Creating Highly Available clusters with kubeadm](/docs/setup/production-environment/tools/kubeadm/high-availability/) for an example control plane setup that runs across multiple machines.

### kube-apiserver

{{< glossary_definition term_id="kube-apiserver" length="all" >}}

### etcd

{{< glossary_definition term_id="etcd" length="all" >}}

### kube-scheduler

{{< glossary_definition term_id="kube-scheduler" length="all" >}}

### kube-controller-manager

{{< glossary_definition term_id="kube-controller-manager" length="all" >}}

There are many different types of controllers. Some examples of them are:

- Node controller: Responsible for noticing and responding when nodes go down.
- Job controller: Watches for Job objects that represent one-off tasks, then creates Pods to run those tasks to completion.
- EndpointSlice controller: Populates EndpointSlice objects (to provide a link between Services and Pods).
- ServiceAccount controller: Create default ServiceAccounts for new namespaces.

The above is not an exhaustive list.

### cloud-controller-manager

{{< glossary_definition term_id="cloud-controller-manager" length="short" >}}

The cloud-controller-manager only runs controllers that are specific to your cloud provider. If you are running Kubernetes on your own premises, or in a learning environment inside your own PC, the cluster does not have a cloud controller manager.

As with the kube-controller-manager, the cloud-controller-manager combines several logically independent control loops into a single binary that you run as a single process. You can scale horizontally (run more than one copy) to improve performance or to help tolerate failures.

The following controllers can have cloud provider dependencies:

- Node controller: For checking the cloud provider to determine if a node has been deleted in the cloud after it stops responding
- Route controller: For setting up routes in the underlying cloud infrastructure
- Service controller: For creating, updating and deleting cloud provider load balancers

## Node Components

Node components run on every node, maintaining running pods and providing the Kubernetes runtime environment.

### kubelet

{{< glossary_definition term_id="kubelet" length="all" >}}

### kube-proxy

{{< glossary_definition term_id="kube-proxy" length="all" >}}

### Container runtime

{{< glossary_definition term_id="container-runtime" length="all" >}}

## Addons

Addons use Kubernetes resources ({{< glossary_tooltip term_id="daemonset" >}}, {{< glossary_tooltip term_id="deployment" >}}, etc) to implement cluster features. Because these are providing cluster-level features, namespaced resources for addons belong within the `kube-system` namespace.

Selected addons are described below; for an extended list of available addons, please see [Addons](/docs/concepts/cluster-administration/addons/).

### DNS

While the other addons are not strictly required, all Kubernetes clusters should have [cluster DNS](/docs/concepts/services-networking/dns-pod-service/), as many examples rely on it.

Cluster DNS is a DNS server, in addition to the other DNS server(s) in your environment, which serves DNS records for Kubernetes services.

Containers started by Kubernetes automatically include this DNS server in their DNS searches.

### Web UI (Dashboard)

[Dashboard](/docs/tasks/access-application-cluster/web-ui-dashboard/) is a general purpose, web-based UI for Kubernetes clusters. It allows users to manage and troubleshoot applications running in the cluster, as well as the cluster itself.

### Container Resource Monitoring

[Container Resource Monitoring](/docs/tasks/debug/debug-cluster/resource-usage-monitoring/) records generic time-series metrics about containers in a central database, and provides a UI for browsing that data.

### Cluster-level Logging

A [cluster-level logging](/docs/concepts/cluster-administration/logging/) mechanism is responsible for saving container logs to a central log store with a search/browsing interface.

### Network Plugins

[Network plugins](/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins) are software components that implement the container network interface (CNI) specification. They are responsible for allocating IP addresses to pods and enabling them to communicate with each other within the cluster.

## Architecture Variations

While the core components of Kubernetes remain consistent, the way they are deployed and managed can vary. Understanding these variations is crucial for designing and maintaining Kubernetes clusters that meet specific operational needs.

### Control Plane Deployment Options

The control plane components can be deployed in several ways:

<dl>
  <dt>Traditional deployment</dt>
  <dd>Control plane components run directly on dedicated machines or VMs, often managed as systemd services.</dd>

  <dt>Static Pods</dt>
  <dd>Control plane components are deployed as static Pods, managed by the kubelet on specific nodes. This is a common approach used by tools like kubeadm.</dd>

  <dt>Self-hosted</dt>
  <dd>The control plane runs as Pods within the Kubernetes cluster itself, managed by Deployments or other Kubernetes primitives.</dd>

  <dt>Managed Kubernetes services</dt>
  <dd>Cloud providers often abstract away the control plane, managing its components as part of their service offering.</dd>
</dl>

### Workload Placement Considerations

The placement of workloads, including the control plane components, can vary based on cluster size, performance requirements, and operational policies:

- In smaller or development clusters, control plane components and user workloads might run on the same nodes.
- Larger production clusters often dedicate specific nodes to control plane components, separating them from user workloads.
- Some organizations run critical add-ons or monitoring tools on control plane nodes.

### Cluster Management Tools

Tools like kubeadm, kops, and Kubespray offer different approaches to deploying and managing clusters, each with its own method of component layout and management.

The flexibility of Kubernetes architecture allows organizations to tailor their clusters to specific needs, balancing factors such as operational complexity, performance, and management overhead.

### Customization and Extensibility

Kubernetes architecture allows for significant customization:

- Custom schedulers can be deployed to work alongside the default Kubernetes scheduler or to replace it entirely.
- API servers can be extended with CustomResourceDefinitions and API Aggregation.
- Cloud providers can integrate deeply with Kubernetes using the cloud-controller-manager.

The flexibility of Kubernetes architecture allows organizations to tailor their clusters to specific needs, balancing factors such as operational complexity, performance, and management overhead.

## {{% heading "whatsnext" %}}

Learn more about the following:

- [Nodes](/docs/concepts/architecture/nodes/) and [their communication](/docs/concepts/architecture/control-plane-node-communication/)
  with the control plane.
- Kubernetes [controllers](/docs/concepts/architecture/controller/).
- [kube-scheduler](/docs/concepts/scheduling-eviction/kube-scheduler/) which is the default scheduler for Kubernetes.
- Etcd's official [documentation](https://etcd.io/docs/).
- Several [container runtimes](/docs/setup/production-environment/container-runtimes/) in Kubernetes.
- Integrating with cloud providers using [cloud-controller-manager](/docs/concepts/architecture/cloud-controller/).
- [kubectl](/docs/reference/generated/kubectl/kubectl-commands) commands.
