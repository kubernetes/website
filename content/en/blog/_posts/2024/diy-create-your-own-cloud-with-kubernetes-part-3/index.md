---
layout: blog
title: "DIY: Create Your Own Cloud with Kubernetes (Part 3)"
slug: diy-create-your-own-cloud-with-kubernetes-part-3
date: 2024-04-05T07:40:00+00:00
author: >
  Andrei Kvapil (Ænix)
---

Approaching the most interesting phase, this article delves into running Kubernetes within
Kubernetes. Technologies such as Kamaji and Cluster API are highlighted, along with their
integration with KubeVirt.

Previous discussions have covered
[preparing Kubernetes on bare metal](/blog/2024/04/05/diy-create-your-own-cloud-with-kubernetes-part-1/)
and
[how to turn Kubernetes into virtual machines management system](/blog/2024/04/05/diy-create-your-own-cloud-with-kubernetes-part-2).
This article concludes the series by explaining how, using all of the above, you can build a
full-fledged managed Kubernetes and run virtual Kubernetes clusters with just a click.

First up, let's dive into the Cluster API.

## Cluster API

Cluster API is an extension for Kubernetes that allows the management of Kubernetes clusters as
custom resources within another Kubernetes cluster.

The main goal of the Cluster API is to provide a unified interface for describing the basic
entities of a Kubernetes cluster and managing their lifecycle. This enables the automation of
processes for creating, updating, and deleting clusters, simplifying scaling, and infrastructure
management.

Within the context of Cluster API, there are two terms: **management cluster** and
**tenant clusters**.

- **Management cluster** is a Kubernetes cluster used to deploy and manage other clusters.
This cluster contains all the necessary Cluster API components and is responsible for describing,
creating, and updating tenant clusters. It is often used just for this purpose.
- **Tenant clusters** are the user clusters or clusters deployed using the Cluster API. They are
created by describing the relevant resources in the management cluster. They are then used for
deploying applications and services by end-users.

It's important to understand that physically, tenant clusters do not necessarily have to run on
the same infrastructure with the management cluster; more often, they are running elsewhere.

{{< figure src="clusterapi1.svg" caption="A diagram showing interaction of management Kubernetes cluster and tenant Kubernetes clusters using Cluster API" alt="A diagram showing interaction of management Kubernetes cluster and tenant Kubernetes clusters using Cluster API" >}}

For its operation, Cluster API utilizes the concept of _providers_ which are separate controllers
responsible for specific components of the cluster being created. Within Cluster API, there are
several types of providers. The major ones are:

 - **Infrastructure Provider**, which is responsible for providing the computing infrastructure, such as virtual machines or physical servers.
 - **Control Plane Provider**, which provides the Kubernetes control plane, namely the components kube-apiserver, kube-scheduler, and kube-controller-manager.
 - **Bootstrap Provider**, which is used for generating cloud-init configuration for the virtual machines and servers being created.

To get started, you will need to install the Cluster API itself and one provider of each type.
You can find a complete list of supported providers in the project's
[documentation](https://cluster-api.sigs.k8s.io/reference/providers.html).

For installation, you can use the `clusterctl` utility, or
[Cluster API Operator](https://github.com/kubernetes-sigs/cluster-api-operator)
as the more declarative method.

## Choosing providers

### Infrastructure provider

To run Kubernetes clusters using KubeVirt, the
[KubeVirt Infrastructure Provider](https://github.com/kubernetes-sigs/cluster-api-provider-kubevirt)
must be installed.
It enables the deployment of virtual machines for worker nodes in the same management cluster, where
the Cluster API operates.

### Control plane provider

The [Kamaji](https://github.com/clastix/kamaji) project offers a ready solution for running the
Kubernetes control plane for tenant clusters as containers within the management cluster.
This approach has several significant advantages:

- **Cost-effectiveness**: Running the control plane in containers avoids the use of separate control
plane nodes for each cluster, thereby significantly reducing infrastructure costs.
- **Stability**: Simplifying architecture by eliminating complex multi-layered deployment schemes.
Instead of sequentially launching a virtual machine and then installing etcd and Kubernetes components
inside it, there's a simple control plane that is deployed and run as a regular application inside
Kubernetes and managed by an operator.
- **Security**: The cluster's control plane is hidden from the end user, reducing the possibility
of its components being compromised, and also eliminates user access to the cluster's certificate
store. This approach to organizing a control plane invisible to the user is often used by cloud providers.

### Bootstrap provider

[Kubeadm](https://github.com/kubernetes-sigs/cluster-api/tree/main/bootstrap) as the Bootstrap
Provider - as the standard method for preparing clusters in Cluster API. This provider is developed
as part of the Cluster API itself. It requires only a prepared system image with kubelet and kubeadm
installed and allows generating configs in the cloud-init and ignition formats.

It's worth noting that Talos Linux also supports provisioning via the Cluster API and
[has](https://github.com/siderolabs/cluster-api-bootstrap-provider-talos)
[providers](https://github.com/siderolabs/cluster-api-bootstrap-provider-talos) for this.
Although [previous articles](/blog/2024/04/05/diy-create-your-own-cloud-with-kubernetes-part-1/)
discussed using Talos Linux to set up a management cluster on bare-metal nodes, to provision tenant
clusters the Kamaji+Kubeadm approach has more advantages.
It facilitates the deployment of Kubernetes control planes in containers, thus removing the need for
separate virtual machines for control plane instances. This simplifies the management and reduces costs.

## How it works

The primary object in Cluster API is the Cluster resource, which acts as the parent for all the others.
Typically, this resource references two others: a resource describing the **control plane** and a
resource describing the **infrastructure**, each managed by a separate provider.

Unlike the Cluster, these two resources are not standardized, and their kind depends on the specific
provider you are using:

{{< figure src="clusterapi2.svg" caption="A diagram showing the relationship of a Cluster resource and the resources it links to in Cluster API" alt="A diagram showing the relationship of a Cluster resource and the resources it links to in Cluster API" >}}

Within Cluster API, there is also a resource named MachineDeployment, which describes a group of nodes,
whether they are physical servers or virtual machines. This resource functions similarly to standard
Kubernetes resources such as Deployment, ReplicaSet, and Pod, providing a mechanism for the
declarative description of a group of nodes and automatic scaling.

In other words, the MachineDeployment resource allows you to declaratively describe nodes for your
cluster, automating their creation, deletion, and updating according to specified parameters and
the requested number of replicas.

{{< figure src="machinedeploymentres.svg" caption="A diagram showing the relationship of a MachineDeployment resource and its children in Cluster API" alt="A diagram showing the relationship of a Cluster resource and its children in Cluster API" >}}

To create machines, MachineDeployment refers to a template for generating the machine itself and a
template for generating its cloud-init config:

{{< figure src="clusterapi3.svg" caption="A diagram showing the relationship of a MachineDeployment resource and the resources it links to in Cluster API" alt="A diagram showing the relationship of a Cluster resource and the resources it links to in Cluster API" >}}

To deploy a new Kubernetes cluster using Cluster API, you will need to prepare the following set of resources:

- A general Cluster resource
- A KamajiControlPlane resource, responsible for the control plane operated by Kamaji
- A KubevirtCluster resource, describing the cluster configuration in KubeVirt
- A KubevirtMachineTemplate resource, responsible for the virtual machine template
- A KubeadmConfigTemplate resource, responsible for generating tokens and cloud-init
- At least one MachineDeployment to create some workers

## Polishing the cluster

In most cases, this is sufficient, but depending on the providers used, you may need other resources
as well. You can find examples of the resources created for each type of provider in the
[Kamaji project documentation](https://github.com/clastix/cluster-api-control-plane-provider-kamaji?tab=readme-ov-file#-supported-capi-infrastructure-providers).

At this stage, you already have a ready tenant Kubernetes cluster, but so far, it contains nothing
but API workers and a few core plugins that are standardly included in the installation of any
Kubernetes cluster: **kube-proxy** and **CoreDNS**. For full integration, you will need to install
several more components:

To install additional components, you can use a separate
[Cluster API Add-on Provider for Helm](https://github.com/kubernetes-sigs/cluster-api-addon-provider-helm),
or the same [FluxCD](https://fluxcd.io/) discussed in
[previous articles](/blog/2024/04/05/diy-create-your-own-cloud-with-kubernetes-part-1/).

When creating resources in FluxCD, it's possible to specify the target cluster by referring to the
kubeconfig generated by Cluster API. Then, the installation will be performed directly into it.
Thus, FluxCD becomes a universal tool for managing resources both in the management cluster and
in the user tenant clusters.

{{< figure src="fluxcd.svg" caption="A diagram showing the interaction scheme of fluxcd, which can install components in both management and tenant Kubernetes clusters" alt="A diagram showing the interaction scheme of fluxcd, which can install components in both management and tenant Kubernetes clusters" >}}

What components are being discussed here? Generally, the set includes the following:

### CNI Plugin

To ensure communication between pods in a tenant Kubernetes cluster, it's necessary to deploy a
CNI plugin. This plugin creates a virtual network that allows pods to interact with each other
and is traditionally deployed as a Daemonset on the cluster's worker nodes. You can choose and
install any CNI plugin that you find suitable.

{{< figure src="components1.svg" caption="A diagram showing a CNI plugin installed inside the tenant Kubernetes cluster on a scheme of nested Kubernetes clusters" alt="A diagram showing a CNI plugin installed inside the tenant Kubernetes cluster on a scheme of nested Kubernetes clusters" >}}

### Cloud Controller Manager

The main task of the Cloud Controller Manager (CCM) is to integrate Kubernetes with the cloud
infrastructure provider's environment (in your case, it is the management Kubernetes cluster
in which all worksers of tenant Kubernetes are provisioned). Here are some tasks it performs:

1. When a service of type LoadBalancer is created, the CCM initiates the process of creating a cloud load balancer, which directs traffic to your Kubernetes cluster.
1. If a node is removed from the cloud infrastructure, the CCM ensures its removal from your cluster as well, maintaining the cluster's current state.
1. When using the CCM, nodes are added to the cluster with a special taint, `node.cloudprovider.kubernetes.io/uninitialized`,
   which allows for the processing of additional business logic if necessary. After successful initialization, this taint is removed from the node.

Depending on the cloud provider, the CCM can operate both inside and outside the tenant cluster.

[The KubeVirt Cloud Provider](https://github.com/kubevirt/cloud-provider-kubevirt) is designed
to be installed in the external parent management cluster. Thus, creating services of type
LoadBalancer in the tenant cluster initiates the creation of LoadBalancer services in the parent
cluster, which direct traffic into the tenant cluster.

{{< figure src="components2.svg" caption="A diagram showing a Cloud Controller Manager installed outside of a tenant Kubernetes cluster on a scheme of nested Kubernetes clusters and the mapping of services it manages from the parent to the child Kubernetes cluster" alt="A diagram showing a Cloud Controller Manager installed outside of a tenant Kubernetes cluster on a scheme of nested Kubernetes clusters and the mapping of services it manages from the parent to the child Kubernetes cluster" >}}

### CSI Driver

The Container Storage Interface (CSI) is divided into two main parts for interacting with storage
in Kubernetes:

- **csi-controller**: This component is responsible for interacting with the cloud provider's API
to create, delete, attach, detach, and resize volumes.
- **csi-node**: This component runs on each node and facilitates the mounting of volumes to pods
as requested by kubelet.

In the context of using the [KubeVirt CSI Driver](https://github.com/kubevirt/csi-driver), a unique
opportunity arises. Since virtual machines in KubeVirt runs within the management Kubernetes cluster,
where a full-fledged Kubernetes API is available, this opens the path for running the csi-controller
outside of the user's tenant cluster. This approach is popular in the KubeVirt community and offers
several key advantages:

- **Security**: This method hides the internal cloud API from the end-user, providing access to
resources exclusively through the Kubernetes interface. Thus, it reduces the risk of direct access
to the management cluster from user clusters.
- **Simplicity and Convenience**: Users don't need to manage additional controllers in their clusters,
simplifying the architecture and reducing the management burden.

However, the CSI-node must necessarily run inside the tenant cluster, as it directly interacts with
kubelet on each node. This component is responsible for the mounting and unmounting of volumes into pods,
requiring close integration with processes occurring directly on the cluster nodes.

The KubeVirt CSI Driver acts as a proxy for ordering volumes. When a PVC is created inside the tenant
cluster, a PVC is created in the management cluster, and then the created PV is connected to the
virtual machine.

{{< figure src="components3.svg" caption="A diagram showing a CSI plugin components installed on both inside and outside of a tenant Kubernetes cluster on a scheme of nested Kubernetes clusters and the mapping of persistent volumes it manages from the parent to the child Kubernetes cluster" alt="A diagram showing a CSI plugin components installed on both inside and outside of a tenant Kubernetes cluster on a scheme of nested Kubernetes clusters and the mapping of persistent volumes it manages from the parent to the child Kubernetes cluster" >}}

### Cluster Autoscaler

The [Cluster Autoscaler](https://github.com/kubernetes/autoscaler) is a versatile component that
can work with various cloud APIs, and its integration with Cluster-API is just one of the available
functions. For proper configuration, it requires access to two clusters: the tenant cluster, to
track pods and determine the need for adding new nodes, and the managing Kubernetes cluster
(management kubernetes cluster), where it interacts with the MachineDeployment resource and adjusts
the number of replicas.

Although Cluster Autoscaler usually runs inside the tenant Kubernetes cluster, in this situation,
it is suggested to install it outside for the same reasons described before. This approach is
simpler to maintain and more secure as it prevents users of tenant clusters from accessing the
management API of the management cluster.

{{< figure src="components4.svg" caption="A diagram showing a Cluster Autoscaler installed outside of a tenant Kubernetes cluster on a scheme of nested Kubernetes clusters" alt="A diagram showing a Cloud Controller Manager installed outside of a tenant Kubernetes cluster on a scheme of nested Kubernetes clusters" >}}

### Konnectivity

There's another additional component I'd like to mention -
[Konnectivity](https://kubernetes.io/docs/tasks/extend-kubernetes/setup-konnectivity/).
You will likely need it later on to get webhooks and the API aggregation layer working in your
tenant Kubernetes cluster. This topic is covered in detail in one of my
[previous article](/blog/2021/12/22/kubernetes-in-kubernetes-and-pxe-bootable-server-farm/#webhooks-and-api-aggregation-layer).

Unlike the components presented above, Kamaji allows you to easily enable Konnectivity and manage
it as one of the core components of your tenant cluster, alongside kube-proxy and CoreDNS.

## Conclusion

Now you have a fully functional Kubernetes cluster with the capability for dynamic scaling, automatic
provisioning of volumes, and load balancers.

Going forward, you might consider metrics and logs collection from your tenant clusters, but that
goes beyond the scope of this article.

Of course, all the components necessary for deploying a Kubernetes cluster can be packaged into a
single Helm chart and deployed as a unified application. This is precisely how we organize the
deployment of managed Kubernetes clusters with the click of a button on our open PaaS platform,
[Cozystack](https://cozystack.io/), where you can try all the technologies described in the article
for free.
