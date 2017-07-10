---
assignees:
- brendandburns
- erictune
- mikedanese
title: Picking the Right Solution
redirect_from:
- "/docs/getting-started-guides/index/"
- "/docs/getting-started-guides/index.html"
---

Kubernetes can run on various platforms: from your laptop, to VMs on a cloud provider, to rack of
bare metal servers. The effort required to set up a cluster varies from running a single command to
crafting your own customized cluster. Use this guide to choose a solution that fits your needs.

If you just want to "kick the tires" on Kubernetes, use the [local Docker-based solution using MiniKube](#local-machine-solutions).

When you are ready to scale up to more machines and higher availability, a [hosted solution](#hosted-solutions) is the easiest to create and maintain.

[Turnkey cloud solutions](#turnkey-cloud-solutions) require only a few commands to create
and cover a wide range of cloud providers.

If you already have a way to configure hosting resources, use [kubeadm](/docs/getting-started-guides/kubeadm/) to easily bring up a cluster with a single command per machine.

[Custom solutions](#custom-solutions) vary from step-by-step instructions to general advice for setting up
a Kubernetes cluster from scratch.

* TOC
{:toc}

# Local-machine Solutions

* [Minikube](/docs/getting-started-guides/minikube/) is the recommended method for creating a local, single-node Kubernetes cluster for development and testing. Setup is completely automated and doesn't require a cloud provider account.

* [Ubuntu on LXD](/docs/getting-started-guides/ubuntu/local) supports a nine-instance deployment on localhost.

* [IBM Cloud local-ce (Community Edition)](https://www.ibm.com/support/knowledgecenter/en/SSBS6K/product_welcome_cloud_private.html) can use VirtualBox on your machine to deploy Kubernetes to one or more VMs for dev and test scenarios. Scales to full multi-node cluster. Free version of the enterprise solution.

# Hosted Solutions

* [Google Container Engine](https://cloud.google.com/container-engine) offers managed Kubernetes clusters.

* [Azure Container Service](https://azure.microsoft.com/en-us/services/container-service/) can easily deploy Kubernetes clusters.

* [Stackpoint.io](https://stackpoint.io) provides Kubernetes infrastructure automation and management for multiple public clouds.

* [AppsCode.com](https://appscode.com/products/cloud-deployment/) provides managed Kubernetes clusters for various public clouds, including AWS and Google Cloud Platform.

* [KCluster.io](https://kcluster.io) provides highly available and scalable managed Kubernetes clusters for AWS.

* [KUBE2GO.io](https://kube2go.io) get started with highly available Kubernetes clusters on multiple public clouds along with useful tools for development, debugging, monitoring.

* [Madcore.Ai](https://madcore.ai) is devops-focused CLI tool for deploying Kubernetes infrastructure in AWS. Master, auto-scaling group nodes with spot-instances, ingress-ssl-lego, Heapster, and Grafana.

* [Platform9](https://platform9.com/products/kubernetes/) offers managed Kubernetes on-premises or on any public cloud, and provides 24/7 health monitoring and alerting.

* [OpenShift Dedicated](https://www.openshift.com/dedicated/) offers managed Kubernetes clusters powered by OpenShift.

* [OpenShift Online](https://www.openshift.com/features/) provides free hosted access for Kubernetes applications.

* [IBM Bluemix Container Service](https://console.ng.bluemix.net/docs/containers/container_index.html) offers managed Kubernetes clusters with isolation choice, operational tools, integrated security insight into images and containers, and integration with Watson, IoT, and data.

* [Giant Swarm](https://giantswarm.io/product/) offers managed Kubernetes clusters in their own datacenter, on-premises, or on public clouds.

# Turnkey Cloud Solutions

These solutions allow you to create Kubernetes clusters on a range of Cloud IaaS providers with only a
few commands. These solutions are actively developed and have active community support.

* [Google Compute Engine (GCE)](/docs/getting-started-guides/gce)
* [AWS](/docs/getting-started-guides/aws)
* [Azure](/docs/getting-started-guides/azure)
* [Tectonic by CoreOS](https://coreos.com/tectonic)
* [CenturyLink Cloud](/docs/getting-started-guides/clc)
* [IBM Bluemix](https://github.com/patrocinio/kubernetes-softlayer)
* [Stackpoint.io](/docs/getting-started-guides/stackpoint/)
* [KUBE2GO.io](https://kube2go.io/)
* [Madcore.Ai](https://madcore.ai/)

# Custom Solutions

Kubernetes can run on a wide range of Cloud providers and bare-metal environments, and with many
base operating systems.

If you can find a guide below that matches your needs, use it. It may be a little out of date, but
it will be easier than starting from scratch. If you do want to start from scratch, either because you
have special requirements, or just because you want to understand what is underneath a Kubernetes
cluster, try the [Getting Started from Scratch](/docs/getting-started-guides/scratch) guide.

If you are interested in supporting Kubernetes on a new platform, see
[Writing a Getting Started Guide](https://git.k8s.io/community/contributors/devel/writing-a-getting-started-guide.md).

## Universal

If you already have a way to configure hosting resources, use
[kubeadm](/docs/getting-started-guides/kubeadm/) to easily bring up a cluster
with a single command per machine.

## Cloud

These solutions are combinations of cloud providers and operating systems not covered by the above solutions.

* [CoreOS on AWS or GCE](/docs/getting-started-guides/coreos)
* [Kubernetes on Ubuntu](/docs/getting-started-guides/ubuntu/)

## On-Premises VMs

* [Vagrant](/docs/getting-started-guides/coreos) (uses CoreOS and flannel)
* [CloudStack](/docs/getting-started-guides/cloudstack) (uses Ansible, CoreOS and flannel)
* [Vmware vSphere](/docs/getting-started-guides/vsphere)  (uses Debian)
* [Vmware Photon Controller](/docs/getting-started-guides/photon-controller)  (uses Debian)
* [Vmware vSphere, OpenStack, or Bare Metal](/docs/getting-started-guides/ubuntu/) (uses Juju, Ubuntu and flannel)
* [Vmware](/docs/getting-started-guides/coreos)  (uses CoreOS and flannel)
* [CoreOS on libvirt](/docs/getting-started-guides/libvirt-coreos)  (uses CoreOS)
* [oVirt](/docs/getting-started-guides/ovirt)
* [OpenStack Heat](/docs/getting-started-guides/openstack-heat) (uses CentOS and flannel)
* [Fedora (Multi Node)](/docs/getting-started-guides/fedora/flannel_multi_node_cluster) (uses Fedora and flannel)

## Bare Metal

* [Offline](/docs/getting-started-guides/coreos/bare_metal_offline) (no internet required.  Uses CoreOS and Flannel)
* [Fedora via Ansible](/docs/getting-started-guides/fedora/fedora_ansible_config)
* [Fedora (Single Node)](/docs/getting-started-guides/fedora/fedora_manual_config)
* [Fedora (Multi Node)](/docs/getting-started-guides/fedora/flannel_multi_node_cluster)
* [CentOS](/docs/getting-started-guides/centos/centos_manual_config)
* [Kubernetes on Ubuntu](/docs/getting-started-guides/ubuntu/)
* [Manually Deploying Kubernetes on Ubuntu Nodes](/docs/getting-started-guides/ubuntu/manual)
* [CoreOS on AWS or GCE](/docs/getting-started-guides/coreos)

## Integrations

These solutions provide integration with third-party schedulers, resource managers, and/or lower level platforms.

* [Kubernetes on Mesos](/docs/getting-started-guides/mesos)
  * Instructions specify GCE, but are generic enough to be adapted to most existing Mesos clusters
* [DCOS](/docs/getting-started-guides/dcos)
  * Community Edition DCOS uses AWS
  * Enterprise Edition DCOS supports cloud hosting, on-premise VMs, and bare metal

# Table of Solutions

Below is a table of all of the solutions listed above.

IaaS Provider        | Config. Mgmt. | OS     | Networking  | Docs                                              | Support Level
-------------------- | ------------ | ------ | ----------  | ---------------------------------------------     | ----------------------------
any                  | any          | multi-support | any CNI | [docs](/docs/setup/independent/create-cluster-kubeadm/) | Project ([SIG-cluster-lifecycle](https://git.k8s.io/community/sig-cluster-lifecycle))
GKE                  |              |        | GCE         | [docs](https://cloud.google.com/container-engine) | Commercial
Stackpoint.io        |              | multi-support       | multi-support   | [docs](https://stackpoint.io/) | Commercial
AppsCode.com         | Saltstack    | Debian | multi-support | [docs](https://appscode.com/products/cloud-deployment/) | Commercial
KCluster.io          |              | multi-support | multi-support | [docs](https://kcluster.io) | Commercial
KUBE2GO.io          |              | multi-support | multi-support | [docs](https://kube2go.io) | Commercial
Madcore.Ai           | Jenkins DSL  | Ubuntu | flannel     | [docs](https://madcore.ai)                        | Community ([@madcore-ai](https://github.com/madcore-ai))
Platform9        |              | multi-support | multi-support | [docs](https://platform9.com/managed-kubernetes/) | Commercial
Giant Swarm        |              | CoreOS | flannel and/or Calico | [docs](https://docs.giantswarm.io/) | Commercial
GCE                  | Saltstack    | Debian | GCE         | [docs](/docs/getting-started-guides/gce)                                    | Project
Azure Container Service |              | Ubuntu | Azure       | [docs](https://azure.microsoft.com/en-us/services/container-service/)                    |  Commercial
Azure (IaaS)    |              | Ubuntu | Azure       | [docs](/docs/getting-started-guides/azure)                    |  [Community (Microsoft)](https://github.com/Azure/acs-engine)
Bare-metal           | Ansible      | Fedora | flannel     | [docs](/docs/getting-started-guides/fedora/fedora_ansible_config)           |  Project
Bare-metal           | custom       | Fedora | _none_      | [docs](/docs/getting-started-guides/fedora/fedora_manual_config)            |  Project
Bare-metal           | custom       | Fedora | flannel     | [docs](/docs/getting-started-guides/fedora/flannel_multi_node_cluster)      |  Community ([@aveshagarwal](https://github.com/aveshagarwal))
libvirt              | custom       | Fedora | flannel     | [docs](/docs/getting-started-guides/fedora/flannel_multi_node_cluster)      |  Community ([@aveshagarwal](https://github.com/aveshagarwal))
KVM                  | custom       | Fedora | flannel     | [docs](/docs/getting-started-guides/fedora/flannel_multi_node_cluster)      |  Community ([@aveshagarwal](https://github.com/aveshagarwal))
Mesos/Docker         | custom       | Ubuntu | Docker      | [docs](/docs/getting-started-guides/mesos-docker)                           |  Community ([Kubernetes-Mesos Authors](https://github.com/mesosphere/kubernetes-mesos/blob/master/AUTHORS.md))
Mesos/GCE            |              |        |             | [docs](/docs/getting-started-guides/mesos)                                  |  Community ([Kubernetes-Mesos Authors](https://github.com/mesosphere/kubernetes-mesos/blob/master/AUTHORS.md))
DCOS                 | Marathon   | CoreOS/Alpine | custom | [docs](/docs/getting-started-guides/dcos)                                   |  Community ([Kubernetes-Mesos Authors](https://github.com/mesosphere/kubernetes-mesos/blob/master/AUTHORS.md))
AWS                  | CoreOS       | CoreOS | flannel     | [docs](/docs/getting-started-guides/aws)                                 |  Community
GCE                  | CoreOS       | CoreOS | flannel     | [docs](/docs/getting-started-guides/coreos)                                 |  Community ([@pires](https://github.com/pires))
Vagrant              | CoreOS       | CoreOS | flannel     | [docs](/docs/getting-started-guides/coreos)                                 |  Community ([@pires](https://github.com/pires), [@AntonioMeireles](https://github.com/AntonioMeireles))
Bare-metal (Offline) | CoreOS       | CoreOS | flannel     | [docs](/docs/getting-started-guides/coreos/bare_metal_offline)              |  Community ([@jeffbean](https://github.com/jeffbean))
CloudStack           | Ansible      | CoreOS | flannel     | [docs](/docs/getting-started-guides/cloudstack)                             |  Community ([@sebgoa](https://github.com/sebgoa))
Vmware vSphere       | Saltstack    | Debian | OVS         | [docs](/docs/getting-started-guides/vsphere)                                |  Community ([@imkin](https://github.com/imkin))
Vmware Photon        | Saltstack    | Debian | OVS         | [docs](/docs/getting-started-guides/photon-controller)                      |  Community ([@alainroy](https://github.com/alainroy))
Bare-metal           | custom       | CentOS | flannel      | [docs](/docs/getting-started-guides/centos/centos_manual_config)            |  Community ([@coolsvap](https://github.com/coolsvap))
AWS                  | Juju         | Ubuntu | flannel     | [docs](/docs/getting-started-guides/ubuntu/)                                |  [Commercial](http://www.ubuntu.com/cloud/kubernetes) and [Community](https://github.com/juju-solutions/bundle-canonical-kubernetes)  ( [@matt](https://github.com/mbruzek), [@chuck](https://github.com/chuckbutler) )
GCE                  | Juju         | Ubuntu | flannel     | [docs](/docs/getting-started-guides/ubuntu/)                                |  [Commercial](http://www.ubuntu.com/cloud/kubernetes) and [Community](https://github.com/juju-solutions/bundle-canonical-kubernetes)  ( [@matt](https://github.com/mbruzek), [@chuck](https://github.com/chuckbutler) )
Bare Metal           | Juju         | Ubuntu | flannel     | [docs](/docs/getting-started-guides/ubuntu/)                                |  [Commercial](http://www.ubuntu.com/cloud/kubernetes) and [Community](https://github.com/juju-solutions/bundle-canonical-kubernetes)  ( [@matt](https://github.com/mbruzek), [@chuck](https://github.com/chuckbutler) )
Rackspace            | Juju         | Ubuntu | flannel     | [docs](/docs/getting-started-guides/ubuntu/)                                |  [Commercial](http://www.ubuntu.com/cloud/kubernetes) and [Community](https://github.com/juju-solutions/bundle-canonical-kubernetes)  ( [@matt](https://github.com/mbruzek), [@chuck](https://github.com/chuckbutler) )
Vmware vSphere       | Juju         | Ubuntu | flannel     | [docs](/docs/getting-started-guides/ubuntu/)                                |  [Commercial](http://www.ubuntu.com/cloud/kubernetes) and [Community](https://github.com/juju-solutions/bundle-canonical-kubernetes)  ( [@matt](https://github.com/mbruzek), [@chuck](https://github.com/chuckbutler) )
AWS                  | Saltstack    | Debian | AWS         | [docs](/docs/getting-started-guides/aws)                                    |  Community ([@justinsb](https://github.com/justinsb))
AWS                  | kops         | Debian | AWS         | [docs](https://github.com/kubernetes/kops)                                  |  Community ([@justinsb](https://github.com/justinsb))
Bare-metal           | custom       | Ubuntu | flannel     | [docs](/docs/getting-started-guides/ubuntu)                                 |  Community ([@resouer](https://github.com/resouer), [@WIZARD-CXY](https://github.com/WIZARD-CXY))
libvirt/KVM          | CoreOS       | CoreOS | libvirt/KVM | [docs](/docs/getting-started-guides/libvirt-coreos)                         |  Community ([@lhuard1A](https://github.com/lhuard1A))
oVirt                |              |        |             | [docs](/docs/getting-started-guides/ovirt)                                  |  Community ([@simon3z](https://github.com/simon3z))
OpenStack Heat       | Saltstack    | CentOS | Neutron + flannel hostgw | [docs](/docs/getting-started-guides/openstack-heat)            |  Community ([@FujitsuEnablingSoftwareTechnologyGmbH](https://github.com/FujitsuEnablingSoftwareTechnologyGmbH))
any                  | any          | any    | any         | [docs](/docs/getting-started-guides/scratch)                                |  Community ([@erictune](https://github.com/erictune))
any                  | any          | any    | any         | [docs](http://docs.projectcalico.org/v2.2/getting-started/kubernetes/installation/)                                |  Commercial and Community

**Note**: The above table is ordered by version test/used in nodes, followed by support level.

## Definition of columns

* **IaaS Provider** is the product or organization which provides the virtual or physical machines (nodes) that Kubernetes runs on.
* **OS** is the base operating system of the nodes.
* **Config. Mgmt.** is the configuration management system that helps install and maintain Kubernetes on the
  nodes.
* **Networking** is what implements the [networking model](/docs/concepts/cluster-administration/networking/). Those with networking type
  _none_ may not support more than a single node, or may support multiple VM nodes in a single physical node.
* **Conformance** indicates whether a cluster created with this configuration has passed the project's conformance
  tests for supporting the API and base features of Kubernetes v1.0.0.
* **Support Levels**
  * **Project**: Kubernetes committers regularly use this configuration, so it usually works with the latest release
    of Kubernetes.
  * **Commercial**: A commercial offering with its own support arrangements.
  * **Community**: Actively supported by community contributions. May not work with recent releases of Kubernetes.
  * **Inactive**: Not actively maintained. Not recommended for first-time Kubernetes users, and may be removed.
* **Notes** has other relevant information, such as the version of Kubernetes used.


<!-- reference style links below here -->
<!-- GCE conformance test result -->
[1]: https://gist.github.com/erictune/4cabc010906afbcc5061
<!-- Vagrant conformance test result -->
[2]: https://gist.github.com/derekwaynecarr/505e56036cdf010bf6b6
<!-- GKE conformance test result -->
[3]: https://gist.github.com/erictune/2f39b22f72565365e59b
