---
reviewers:
- brendandburns
- erictune
- mikedanese
title: Picking the Right Solution
---

Kubernetes can run on various platforms: from your laptop, to VMs on a cloud provider, to a rack of
bare metal servers. The effort required to set up a cluster varies from running a single command to
crafting your own customized cluster. Use this guide to choose a solution that fits your needs.

If you just want to "kick the tires" on Kubernetes, use the [local Docker-based solutions](#local-machine-solutions).

When you are ready to scale up to more machines and higher availability, a [hosted solution](#hosted-solutions) is the easiest to create and maintain.

[Turnkey cloud solutions](#turnkey-cloud-solutions) require only a few commands to create
and cover a wide range of cloud providers. [On-Premises turnkey cloud solutions](#on-premises-turnkey-cloud-solutions) have the simplicity of the turnkey cloud solution combined with the security of your own private network.

If you already have a way to configure hosting resources, use [kubeadm](/docs/setup/independent/create-cluster-kubeadm/) to easily bring up a cluster with a single command per machine.

[Custom solutions](#custom-solutions) vary from step-by-step instructions to general advice for setting up
a Kubernetes cluster from scratch.

* TOC
{:toc}

# Local-machine Solutions

* [Minikube](/docs/getting-started-guides/minikube/) is the recommended method for creating a local, single-node Kubernetes cluster for development and testing. Setup is completely automated and doesn't require a cloud provider account.

* [Kubeadm-dind](https://github.com/Mirantis/kubeadm-dind-cluster) is a multi-node (while minikube is single-node) Kubernetes cluster which only requires a docker daemon. It uses docker-in-docker technique to spawn the Kubernetes cluster.

* [Ubuntu on LXD](/docs/getting-started-guides/ubuntu/local/) supports a nine-instance deployment on localhost.

* [IBM Cloud Private-CE (Community Edition)](https://github.com/IBM/deploy-ibm-cloud-private) can use VirtualBox on your machine to deploy Kubernetes to one or more VMs for development and test scenarios. Scales to full multi-node cluster.

* [IBM Cloud Private-CE (Community Edition) on Linux Containers](https://github.com/HSBawa/icp-ce-on-linux-containers) is a Terraform/Packer/BASH based Infrastructure as Code (IaC) scripts to create a seven node (1 Boot, 1 Master, 1 Management, 1 Proxy and 3 Workers) LXD cluster on  Linux Host.

# Hosted Solutions

* [Google Kubernetes Engine](https://cloud.google.com/kubernetes-engine/) offers managed Kubernetes clusters.

* [Amazon Elastic Container Service for Kubernetes](https://aws.amazon.com/eks/) offers managed Kubernetes service.

* [Azure Container Service](https://azure.microsoft.com/services/container-service/) offers managed Kubernetes clusters.

* [Stackpoint.io](https://stackpoint.io) provides Kubernetes infrastructure automation and management for multiple public clouds.

* [AppsCode.com](https://appscode.com/products/cloud-deployment/) provides managed Kubernetes clusters for various public clouds, including AWS and Google Cloud Platform.

* [Madcore.Ai](https://madcore.ai) is devops-focused CLI tool for deploying Kubernetes infrastructure in AWS. Master, auto-scaling group nodes with spot-instances, ingress-ssl-lego, Heapster, and Grafana.

* [Platform9](https://platform9.com/products/kubernetes/) offers managed Kubernetes on-premises or on any public cloud, and provides 24/7 health monitoring and alerting. (Kube2go, a web-UI driven Kubernetes cluster deployment service Platform9 released, has been integrated to Platform9 Sandbox.)

* [OpenShift Dedicated](https://www.openshift.com/dedicated/) offers managed Kubernetes clusters powered by OpenShift.

* [OpenShift Online](https://www.openshift.com/features/) provides free hosted access for Kubernetes applications.

* [IBM Cloud Container Service](https://console.bluemix.net/docs/containers/container_index.html) offers managed Kubernetes clusters with isolation choice, operational tools, integrated security insight into images and containers, and integration with Watson, IoT, and data.

* [Giant Swarm](https://giantswarm.io/product/) offers managed Kubernetes clusters in their own datacenter, on-premises, or on public clouds.

* [Kubermatic](https://www.loodse.com) provides managed Kubernetes clusters for various public clouds, including AWS and Digital Ocean, as well as on-premises with OpenStack integration.

* [Pivotal Container Service](https://pivotal.io/platform/pivotal-container-service) provides enterprise-grade Kubernetes for both on-premises and public clouds.  PKS enables on-demand provisioning of Kubernetes clusters, multi-tenancy and fully automated day-2 operations.

# Turnkey Cloud Solutions

These solutions allow you to create Kubernetes clusters on a range of Cloud IaaS providers with only a
few commands. These solutions are actively developed and have active community support.

* [Conjure-up Kubernetes with Ubuntu on AWS, Azure, Google Cloud, Oracle Cloud](/docs/getting-started-guides/ubuntu/)
* [Google Compute Engine (GCE)](/docs/getting-started-guides/gce/)
* [AWS](/docs/getting-started-guides/aws/)
* [Azure](/docs/getting-started-guides/azure/)
* [Tectonic by CoreOS](https://coreos.com/tectonic)
* [CenturyLink Cloud](/docs/getting-started-guides/clc/)
* [IBM Cloud](https://github.com/patrocinio/kubernetes-softlayer)
* [Stackpoint.io](/docs/getting-started-guides/stackpoint/)
* [Madcore.Ai](https://madcore.ai/)
* [Kubermatic](https://cloud.kubermatic.io)

# On-Premises turnkey cloud solutions
These solutions allow you to create Kubernetes clusters on your internal, secure, cloud network with only a
few commands.

* [IBM Cloud Private](https://www.ibm.com/cloud-computing/products/ibm-cloud-private/)
* [Kubermatic](https://www.loodse.com)

# Custom Solutions

Kubernetes can run on a wide range of Cloud providers and bare-metal environments, and with many
base operating systems.

If you can find a guide below that matches your needs, use it. It may be a little out of date, but
it will be easier than starting from scratch. If you do want to start from scratch, either because you
have special requirements, or just because you want to understand what is underneath a Kubernetes
cluster, try the [Getting Started from Scratch](/docs/getting-started-guides/scratch/) guide.

If you are interested in supporting Kubernetes on a new platform, see
[Writing a Getting Started Guide](https://git.k8s.io/community/contributors/devel/writing-a-getting-started-guide.md).

## Universal

If you already have a way to configure hosting resources, use
[kubeadm](/docs/setup/independent/create-cluster-kubeadm/) to easily bring up a cluster
with a single command per machine.

## Cloud

These solutions are combinations of cloud providers and operating systems not covered by the above solutions.

* [CoreOS on AWS or GCE](/docs/getting-started-guides/coreos/)
* [Kubernetes on Ubuntu](/docs/getting-started-guides/ubuntu/)
* [Kubespray](/docs/getting-started-guides/kubespray/)

## On-Premises VMs

* [Vagrant](/docs/getting-started-guides/coreos/) (uses CoreOS and flannel)
* [CloudStack](/docs/getting-started-guides/cloudstack/) (uses Ansible, CoreOS and flannel)
* [VMware vSphere](https://vmware.github.io/vsphere-storage-for-kubernetes/documentation/)
* [VMware vSphere, OpenStack, or Bare Metal](/docs/getting-started-guides/ubuntu/) (uses Juju, Ubuntu and flannel)
* [VMware](/docs/getting-started-guides/coreos/) (uses CoreOS and flannel)
* [oVirt](/docs/getting-started-guides/ovirt/)
* [Fedora (Multi Node)](/docs/getting-started-guides/fedora/flannel_multi_node_cluster/) (uses Fedora and flannel)

## Bare Metal

* [Fedora (Single Node)](/docs/getting-started-guides/fedora/fedora_manual_config/)
* [Fedora (Multi Node)](/docs/getting-started-guides/fedora/flannel_multi_node_cluster/)
* [Kubernetes on Ubuntu](/docs/getting-started-guides/ubuntu/)
* [CoreOS on AWS or GCE](/docs/getting-started-guides/coreos/)

## Integrations

These solutions provide integration with third-party schedulers, resource managers, and/or lower level platforms.

* [DCOS](/docs/getting-started-guides/dcos/)
  * Community Edition DCOS uses AWS
  * Enterprise Edition DCOS supports cloud hosting, on-premises VMs, and bare metal

# Table of Solutions

Below is a table of all of the solutions listed above.

IaaS Provider        | Config. Mgmt. | OS     | Networking  | Docs                                              | Support Level
-------------------- | ------------ | ------ | ----------  | ---------------------------------------------     | ----------------------------
any                  | any          | multi-support | any CNI | [docs](/docs/setup/independent/create-cluster-kubeadm/) | Project ([SIG-cluster-lifecycle](https://git.k8s.io/community/sig-cluster-lifecycle))
Google Kubernetes Engine |              |        | GCE         | [docs](https://cloud.google.com/kubernetes-engine/docs/) | Commercial
Stackpoint.io        |              | multi-support       | multi-support   | [docs](https://stackpoint.io/) | Commercial
AppsCode.com         | Saltstack    | Debian | multi-support | [docs](https://appscode.com/products/cloud-deployment/) | Commercial
Madcore.Ai           | Jenkins DSL  | Ubuntu | flannel     | [docs](https://madcore.ai)                        | Community ([@madcore-ai](https://github.com/madcore-ai))
Platform9        |              | multi-support | multi-support | [docs](https://platform9.com/managed-kubernetes/) | Commercial
Kubermatic       |              | multi-support | multi-support | [docs](http://docs.kubermatic.io/) | Commercial
Giant Swarm        |              | CoreOS | flannel and/or Calico | [docs](https://docs.giantswarm.io/) | Commercial
GCE                  | Saltstack    | Debian | GCE         | [docs](/docs/getting-started-guides/gce/)                                    | Project
Azure Container Service |              | Ubuntu | Azure       | [docs](https://azure.microsoft.com/en-us/services/container-service/)                    |  Commercial
Azure (IaaS)    |              | Ubuntu | Azure       | [docs](/docs/getting-started-guides/azure/)                    |  [Community (Microsoft)](https://github.com/Azure/acs-engine)
Bare-metal           | custom       | Fedora | _none_      | [docs](/docs/getting-started-guides/fedora/fedora_manual_config/)            |  Project
Bare-metal           | custom       | Fedora | flannel     | [docs](/docs/getting-started-guides/fedora/flannel_multi_node_cluster/)      |  Community ([@aveshagarwal](https://github.com/aveshagarwal))
libvirt              | custom       | Fedora | flannel     | [docs](/docs/getting-started-guides/fedora/flannel_multi_node_cluster/)      |  Community ([@aveshagarwal](https://github.com/aveshagarwal))
KVM                  | custom       | Fedora | flannel     | [docs](/docs/getting-started-guides/fedora/flannel_multi_node_cluster/)      |  Community ([@aveshagarwal](https://github.com/aveshagarwal))
DCOS                 | Marathon   | CoreOS/Alpine | custom | [docs](/docs/getting-started-guides/dcos/)                                   |  Community ([Kubernetes-Mesos Authors](https://github.com/mesosphere/kubernetes-mesos/blob/master/AUTHORS.md))
AWS                  | CoreOS       | CoreOS | flannel     | [docs](/docs/getting-started-guides/aws/)                                 |  Community
GCE                  | CoreOS       | CoreOS | flannel     | [docs](/docs/getting-started-guides/coreos/)                                 |  Community ([@pires](https://github.com/pires))
Vagrant              | CoreOS       | CoreOS | flannel     | [docs](/docs/getting-started-guides/coreos/)                                 |  Community ([@pires](https://github.com/pires), [@AntonioMeireles](https://github.com/AntonioMeireles))
CloudStack           | Ansible      | CoreOS | flannel     | [docs](/docs/getting-started-guides/cloudstack/)                             |  Community ([@sebgoa](https://github.com/sebgoa))
VMware vSphere       | any          | multi-support | multi-support     | [docs](https://vmware.github.io/vsphere-storage-for-kubernetes/documentation/)  |  [Community](https://vmware.github.io/vsphere-storage-for-kubernetes/documentation/contactus.html)
Bare-metal           | custom       | CentOS | flannel      | [docs](/docs/getting-started-guides/centos/centos_manual_config/)            |  Community ([@coolsvap](https://github.com/coolsvap))
lxd                  | Juju         | Ubuntu | flannel/canal            | [docs](/docs/getting-started-guides/ubuntu/local/)              |  [Commercial](https://www.ubuntu.com/kubernetes) and [Community](https://jujucharms.com/kubernetes)
AWS                  | Juju         | Ubuntu | flannel/calico/canal     | [docs](/docs/getting-started-guides/ubuntu/)                    |  [Commercial](https://www.ubuntu.com/kubernetes) and [Community](https://jujucharms.com/kubernetes)
Azure                | Juju         | Ubuntu | flannel/calico/canal     | [docs](/docs/getting-started-guides/ubuntu/)                    |  [Commercial](https://www.ubuntu.com/kubernetes) and [Community](https://jujucharms.com/kubernetes)
GCE                  | Juju         | Ubuntu | flannel/calico/canal     | [docs](/docs/getting-started-guides/ubuntu/)                    |  [Commercial](https://www.ubuntu.com/kubernetes) and [Community](https://jujucharms.com/kubernetes)
Oracle Cloud         | Juju         | Ubuntu | flannel/calico/canal     | [docs](/docs/getting-started-guides/ubuntu/)                    |  [Commercial](https://www.ubuntu.com/kubernetes) and [Community](https://jujucharms.com/kubernetes)
Rackspace            | Juju         | Ubuntu | flannel/calico/canal     | [docs](/docs/getting-started-guides/ubuntu/)                    |  [Commercial](https://www.ubuntu.com/kubernetes) and [Community](https://jujucharms.com/kubernetes)
VMware vSphere       | Juju         | Ubuntu | flannel/calico/canal     | [docs](/docs/getting-started-guides/ubuntu/)                    |  [Commercial](https://www.ubuntu.com/kubernetes) and [Community](https://jujucharms.com/kubernetes)
Bare Metal           | Juju         | Ubuntu | flannel/calico/canal     | [docs](/docs/getting-started-guides/ubuntu/)                    |  [Commercial](https://www.ubuntu.com/kubernetes) and [Community](https://jujucharms.com/kubernetes)
AWS                  | Saltstack    | Debian | AWS         | [docs](/docs/getting-started-guides/aws/)                                    |  Community ([@justinsb](https://github.com/justinsb))
AWS                  | kops         | Debian | AWS         | [docs](https://github.com/kubernetes/kops/)                                  |  Community ([@justinsb](https://github.com/justinsb))
Bare-metal           | custom       | Ubuntu | flannel     | [docs](/docs/getting-started-guides/ubuntu/)                                 |  Community ([@resouer](https://github.com/resouer), [@WIZARD-CXY](https://github.com/WIZARD-CXY))
oVirt                |              |        |             | [docs](/docs/getting-started-guides/ovirt/)                                  |  Community ([@simon3z](https://github.com/simon3z))
any                  | any          | any    | any         | [docs](/docs/getting-started-guides/scratch/)                                |  Community ([@erictune](https://github.com/erictune))
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
<!-- Google Kubernetes Engine conformance test result -->
[3]: https://gist.github.com/erictune/2f39b22f72565365e59b
