---
reviewers:
- brendandburns
- erictune
- mikedanese
title: Picking the Right Solution
weight: 10
content_template: templates/concept
card:
  name: setup
  weight: 20
  anchors:
  - anchor: "#hosted-solutions"
    title: Hosted Solutions
  - anchor: "#turnkey-cloud-solutions"
    title: Turnkey Cloud Solutions
  - anchor: "#on-premises-turnkey-cloud-solutions"
    title: On-Premises Solutions
  - anchor: "#custom-solutions"
    title: Custom Solutions
  - anchor: "#local-machine-solutions"
    title: Local Machine
---

{{% capture overview %}}

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

{{% /capture %}}

{{% capture body %}}

## Local-machine Solutions

### Community Supported Tools

* [Minikube](/docs/setup/minikube/) is a method for creating a local, single-node Kubernetes cluster for development and testing. Setup is completely automated and doesn't require a cloud provider account.

* [Kubeadm-dind](https://github.com/kubernetes-sigs/kubeadm-dind-cluster) is a multi-node (while minikube is single-node) Kubernetes cluster which only requires a docker daemon. It uses docker-in-docker technique to spawn the Kubernetes cluster.

* [Kubernetes IN Docker](https://github.com/kubernetes-sigs/kind) is a tool for running local Kubernetes clusters using Docker container "nodes". It is primarily designed for testing Kubernetes 1.11+. You can use it to create multi-node or multi-control-plane Kubernetes clusters.

### Ecosystem Tools

* [CDK on LXD](https://www.ubuntu.com/kubernetes/docs/install-local) supports a nine-instance deployment on localhost with LXD containers.

* [Docker Desktop](https://www.docker.com/products/docker-desktop) is an
easy-to-install application for your Mac or Windows environment that enables you to
start coding and deploying in containers in minutes on a single-node Kubernetes
cluster.

* [Minishift](https://docs.okd.io/latest/minishift/) installs the community version of the Kubernetes enterprise platform OpenShift for local development & testing.  It offers an all-in-one VM (`minishift start`) for Windows, macOS, and Linux. The container start is based on `oc cluster up` (Linux only). You can also install [the included add-ons](https://github.com/minishift/minishift-addons/tree/master/add-ons).

* [MicroK8s](https://microk8s.io/) provides a single command installation of the latest Kubernetes release on a local machine for development and testing. Setup is quick, fast (~30 sec) and supports many plugins including Istio with a single command.

* [IBM Cloud Private-CE (Community Edition)](https://github.com/IBM/deploy-ibm-cloud-private) can use VirtualBox on your machine to deploy Kubernetes to one or more VMs for development and test scenarios. Scales to full multi-node cluster.

* [IBM Cloud Private-CE (Community Edition) on Linux Containers](https://github.com/HSBawa/icp-ce-on-linux-containers) is a Terraform/Packer/BASH based Infrastructure as Code (IaC) scripts to create a seven node (1 Boot, 1 Master, 1 Management, 1 Proxy and 3 Workers) LXD cluster on  Linux Host.

* [k3s](https://k3s.io) is a lightweight production-grade Kubernetes distribution.  With a super-simple installation process and a binary footprint around 40MB, it is ideal for local-machine development.

* [Ubuntu on LXD](/docs/getting-started-guides/ubuntu/local/) supports a nine-instance deployment on localhost.

## Hosted Solutions

* [AppsCode.com](https://appscode.com/products/cloud-deployment/) provides managed Kubernetes clusters for various public clouds, including AWS and Google Cloud Platform.

* [APPUiO](https://appuio.ch) runs an OpenShift public cloud platform, supporting any Kubernetes workload. Additionally APPUiO offers Private Managed OpenShift Clusters, running on any public or private cloud.

* [Amazon Elastic Container Service for Kubernetes](https://aws.amazon.com/eks/) offers managed Kubernetes service.

* [Azure Kubernetes Service](https://azure.microsoft.com/services/container-service/) offers managed Kubernetes clusters.

* [Containership Kubernetes Engine (CKE)](https://containership.io/containership-platform) intuitive Kubernetes cluster provisioning and management on GCP, Azure, AWS, Packet, and DigitalOcean. Seamless version upgrades, autoscaling, metrics, workload creation, and more.

* [DigitalOcean Kubernetes](https://www.digitalocean.com/products/kubernetes/) offers managed Kubernetes service.

* [Giant Swarm](https://giantswarm.io/product/) offers managed Kubernetes clusters in their own datacenter, on-premises, or on public clouds.

* [Google Kubernetes Engine](https://cloud.google.com/kubernetes-engine/) offers managed Kubernetes clusters.

* [IBM Cloud Kubernetes Service](https://cloud.ibm.com/docs/containers?topic=containers-container_index#container_index) offers managed Kubernetes clusters with isolation choice, operational tools, integrated security insight into images and containers, and integration with Watson, IoT, and data.

* [Kubermatic](https://www.loodse.com) runs Kubernetes in Kubernetes to provide managed Kubernetes clusters for any public cloud, including AWS and Digital Ocean, as well as on-premises with OpenStack integration.

* [Kublr](https://kublr.com) offers enterprise-grade secure, scalable, highly reliable Kubernetes clusters on AWS, Azure, GCP, and on-premise. It includes out-of-the-box backup and disaster recovery, multi-cluster centralized logging and monitoring, and built-in alerting.

* [KubeSail](https://kubesail.com) is an easy, free way to try Kubernetes.

* [Madcore.Ai](https://madcore.ai) is devops-focused CLI tool for deploying Kubernetes infrastructure in AWS. Master, auto-scaling group nodes with spot-instances, ingress-ssl-lego, Heapster, and Grafana.

* [Nutanix Karbon](https://www.nutanix.com/products/karbon/) is a multi-cluster, highly available Kubernetes management and operational platform that simplifies the provisioning, operations, and lifecycle management of Kubernetes.

* [OpenShift Dedicated](https://www.openshift.com/dedicated/) offers managed Kubernetes clusters powered by OpenShift.

* [OpenShift Online](https://www.openshift.com/features/) provides free hosted access for Kubernetes applications.

* [Oracle Cloud Infrastructure Container Engine for Kubernetes (OKE)](https://docs.us-phoenix-1.oraclecloud.com/Content/ContEng/Concepts/contengoverview.htm) is a fully-managed, scalable, and highly available service that you can use to deploy your containerized applications to the cloud.

* [Platform9](https://platform9.com/managed-kubernetes/) offers managed Kubernetes service that works on-premises or on any public cloud, with 99.9% SLA guarantee.

* [Stackpoint.io](https://stackpoint.io) provides Kubernetes infrastructure automation and management for multiple public clouds.

* [SysEleven MetaKube](https://www.syseleven.io/products-services/managed-kubernetes/) offers managed Kubernetes as a service powered on our OpenStack public cloud. It includes lifecycle management, administration dashboards, monitoring, autoscaling and much more.

* [VEXXHOST](https://vexxhost.com/public-cloud/container-services/kubernetes/) VEXXHOST proudly offers Certified Kubernetes on their public cloud, which also happens to be the largest OpenStack public cloud in Canada.

* [VMware Cloud PKS](https://cloud.vmware.com/vmware-cloud-pks) is an enterprise Kubernetes-as-a-Service offering in the VMware Cloud Services portfolio that provides easy to use, secure by default, cost effective, SaaS-based Kubernetes clusters.

## Turnkey Cloud Solutions

These solutions allow you to create Kubernetes clusters on a range of Cloud IaaS providers with only a
few commands. These solutions are actively developed and have active community support.

* [Agile Stacks](https://www.agilestacks.com/products/kubernetes)
* [Alibaba Cloud](/docs/setup/turnkey/alibaba-cloud/)
* [APPUiO](https://appuio.ch)
* [AWS](/docs/setup/turnkey/aws/)
* [Azure](/docs/setup/turnkey/azure/)
* [CenturyLink Cloud](/docs/setup/turnkey/clc/)
* [Conjure-up Kubernetes with Ubuntu on AWS, Azure, Google Cloud, Oracle Cloud](https://www.ubuntu.com/kubernetes/docs/quickstart)
* [Containership](https://containership.io/containership-platform)
* [Docker Enterprise](https://www.docker.com/products/docker-enterprise)
* [Gardener](https://gardener.cloud/)
* [Giant Swarm](https://giantswarm.io)
* [Google Compute Engine (GCE)](/docs/setup/turnkey/gce/)
* [IBM Cloud](https://github.com/patrocinio/kubernetes-softlayer)
* [k3s](https://k3s.io)
* [Kontena Pharos](https://kontena.io/pharos/)
* [Kubermatic](https://www.loodse.com/product/)
* [Kublr](https://kublr.com/)
* [Madcore.Ai](https://madcore.ai/)
* [Nirmata](https://nirmata.com/)
* [Oracle Cloud Infrastructure Container Engine for Kubernetes (OKE)](https://docs.us-phoenix-1.oraclecloud.com/Content/ContEng/Concepts/contengprerequisites.htm)
* [Pivotal Container Service](https://pivotal.io/platform/pivotal-container-service)
* [Platform9 Managed Kubernetes as a Service](https://platform9.com/managed-kubernetes/)
* [Rancher](https://rancher.com/docs/rancher/v2.x/en/)
* [Stackpoint.io](/docs/setup/turnkey/stackpoint/)
* [Supergiant.io](https://supergiant.io/)
* [VEXXHOST](https://vexxhost.com/private-cloud/)
* [VMware Cloud PKS](https://cloud.vmware.com/vmware-cloud-pks)
* [VMware Enterprise PKS](https://cloud.vmware.com/vmware-enterprise-pks)

## On-Premises turnkey cloud solutions
These solutions allow you to create Kubernetes clusters on your internal, secure, cloud network with only a
few commands.

* [Agile Stacks](https://www.agilestacks.com/products/kubernetes)
* [APPUiO](https://appuio.ch)
* [Docker Enterprise](https://www.docker.com/products/docker-enterprise)
* [Giant Swarm](https://giantswarm.io)
* [GKE On-Prem | Google Cloud](https://cloud.google.com/gke-on-prem/)
* [IBM Cloud Private](https://www.ibm.com/cloud/private)
* [k3s](https://k3s.io)
* [Nutanix Karbon](https://www.nutanix.com/products/karbon/)
* [Kontena Pharos](https://kontena.io/pharos/)
* [Kubermatic](https://www.loodse.com/product/)
* [Kublr](https://kublr.com/)
* [Mirantis Cloud Platform](https://www.mirantis.com/software/kubernetes/)
* [Nirmata](https://nirmata.com/)
* [OpenShift Container Platform](https://www.openshift.com/products/container-platform/) (OCP) by [Red Hat](https://www.redhat.com)
* [Pivotal Container Service](https://pivotal.io/platform/pivotal-container-service)
* [Platform9 Managed Kubernetes as a Service](https://platform9.com/managed-kubernetes/)
* [Rancher](https://rancher.com/docs/rancher/v2.x/en/)
* [SUSE CaaS Platform](https://www.suse.com/products/caas-platform)
* [SUSE Cloud Application Platform](https://www.suse.com/products/cloud-application-platform/)
* [VMware Enterprise PKS](https://cloud.vmware.com/vmware-enterprise-pks)


## Custom Solutions

Kubernetes can run on a wide range of Cloud providers and bare-metal environments, and with many
base operating systems.

If you can find a guide below that matches your needs, use it.

### Universal

If you already have a way to configure hosting resources, use
[kubeadm](/docs/setup/independent/create-cluster-kubeadm/) to bring up a cluster
with a single command per machine.

### Cloud

These solutions are combinations of cloud providers and operating systems not covered by the above solutions.

* [Cloud Foundry Container Runtime (CFCR)](https://docs-cfcr.cfapps.io/)
* [Gardener](https://gardener.cloud/)
* [Kublr](https://kublr.com/)
* [Kubernetes on Ubuntu](https://www.ubuntu.com/kubernetes/docs/quickstart)
* [Kubespray](/docs/setup/custom-cloud/kubespray/)
* [Rancher Kubernetes Engine (RKE)](https://github.com/rancher/rke)
* [VMware Essential PKS](https://cloud.vmware.com/vmware-essential-PKS)

### On-Premises VMs

* [Cloud Foundry Container Runtime (CFCR)](https://docs-cfcr.cfapps.io/)
* [CloudStack](/docs/setup/on-premises-vm/cloudstack/) (uses Ansible)
* [Fedora (Multi Node)](/docs/getting-started-guides/fedora/flannel_multi_node_cluster/) (uses Fedora and flannel)
* [Kubermatic](https://www.loodse.com/product/)
* [Nutanix AHV](https://www.nutanix.com/products/acropolis/virtualization/)
* [OpenShift Container Platform](https://www.openshift.com/products/container-platform/) (OCP) Kubernetes platform by [Red Hat](https://www.redhat.com)
* [oVirt](/docs/setup/on-premises-vm/ovirt/)
* [Platform9 Managed Kubernetes as a Service](https://platform9.com/managed-kubernetes/) works on any infrastructure: on-premises, bare metal, or private/hybrid cloud.
* [VMware Essential PKS](https://cloud.vmware.com/vmware-essential-PKS)
* [VMware vSphere](https://github.com/kubernetes/cloud-provider-vsphere)
* [VMware vSphere, OpenStack, or Bare Metal](https://www.ubuntu.com/kubernetes/docs/quickstart) (uses Juju, Ubuntu and flannel)

### Bare Metal

* [Digital Rebar](/docs/setup/on-premises-metal/krib/)
* [Docker Enterprise](https://www.docker.com/products/docker-enterprise)
* [Fedora (Single Node)](/docs/getting-started-guides/fedora/fedora_manual_config/)
* [Fedora (Multi Node)](/docs/getting-started-guides/fedora/flannel_multi_node_cluster/)
* [k3s](https://k3s.io)
* [Kubermatic](https://www.loodse.com/product/)
* [Kubernetes on Ubuntu](/docs/getting-started-guides/ubuntu/)
* [Kubernetes on Ubuntu](https://www.ubuntu.com/kubernetes/docs/quickstart)
* [OpenShift Container Platform](https://www.openshift.com/products/container-platform/) (OCP) Kubernetes platform by [Red Hat](https://www.redhat.com)
* [Platform9 Managed Kubernetes as a Service](https://platform9.com/managed-kubernetes/) works on any infrastructure: on-premises, bare metal, or private/hybrid cloud.
* [VMware Essential PKS](https://cloud.vmware.com/vmware-essential-PKS)

### Integrations

These solutions provide integration with third-party schedulers, resource managers, and/or lower level platforms.

* [DCOS](/docs/setup/on-premises-vm/dcos/)
  * Community Edition DCOS uses AWS
  * Enterprise Edition DCOS supports cloud hosting, on-premises VMs, and bare metal

## Table of Solutions

Below is a table of all of the solutions listed above.

IaaS Provider        | Config. Mgmt. | OS     | Networking  | Docs                                              | Support Level
-------------------- | ------------ | ------ | ----------  | ---------------------------------------------     | ----------------------------
Agile Stacks       | Terraform   | CoreOS | multi-support | [docs](https://www.agilestacks.com/products/kubernetes) | Commercial
Alibaba Cloud Container Service For Kubernetes | ROS        | CentOS | flannel/Terway       | [docs](https://www.aliyun.com/product/containerservice)                    |  Commercial
any                  | any          | multi-support | any CNI | [docs](/docs/setup/independent/create-cluster-kubeadm/) | Project ([SIG-cluster-lifecycle](https://git.k8s.io/community/sig-cluster-lifecycle))
any                  | any          | any    | any         | [docs](/docs/setup/release/building-from-source/)                                |  Community ([@erictune](https://github.com/erictune))
any                  | any          | any    | any         | [docs](http://docs.projectcalico.org/v2.2/getting-started/kubernetes/installation/)                                |  Commercial and Community
any           |  Kubermatic            | multi-support | multi-support | [docs](http://docs.kubermatic.io/) | Commercial
any                  | RKE          | multi-support    | flannel or canal         | [docs](https://rancher.com/docs/rancher/v2.x/en/quick-start-guide/)                                |  [Commercial](https://rancher.com/what-is-rancher/overview/) and [Community](https://github.com/rancher/rancher)
any                  | [Gardener Cluster-Operator](https://kubernetes.io/blog/2018/05/17/gardener/) | multi-support | multi-support | [docs](https://gardener.cloud) | [Project/Community](https://github.com/gardener) and [Commercial]( https://cloudplatform.sap.com/)
AppsCode.com         | Saltstack    | Debian | multi-support | [docs](https://appscode.com/products/cloud-deployment/) | Commercial
AWS                  | CoreOS       | CoreOS | flannel     | [docs](/docs/setup/turnkey/aws/)                                 |  Community
AWS                  | Saltstack    | Debian | AWS         | [docs](/docs/setup/turnkey/aws/)                                    |  Community ([@justinsb](https://github.com/justinsb))
AWS                  | kops         | Debian | AWS         | [docs](https://github.com/kubernetes/kops/)                                  |  Community ([@justinsb](https://github.com/justinsb))
AWS                  | Juju         | Ubuntu | flannel/calico/canal     | [docs](https://www.ubuntu.com/kubernetes/docs/quickstart)                    |  [Commercial](https://www.ubuntu.com/kubernetes) and [Community](https://jujucharms.com/kubernetes)
Azure                | Juju         | Ubuntu | flannel/calico/canal     | [docs](https://www.ubuntu.com/kubernetes/docs/quickstart)                    |  [Commercial](https://www.ubuntu.com/kubernetes) and [Community](https://jujucharms.com/kubernetes)
Azure (IaaS)         |              | Ubuntu | Azure       | [docs](/docs/setup/turnkey/azure/)                    |  [Community (Microsoft)](https://github.com/Azure/acs-engine)
Azure Kubernetes Service |              | Ubuntu | Azure       | [docs](https://docs.microsoft.com/en-us/azure/aks/)                    |  Commercial
Bare-metal           | custom       | CentOS | flannel      | [docs](/docs/getting-started-guides/centos/centos_manual_config/)            |  Community ([@coolsvap](https://github.com/coolsvap))
Bare-metal           | custom       | Fedora | _none_      | [docs](/docs/getting-started-guides/fedora/fedora_manual_config/)            |  Project
Bare-metal           | custom       | Fedora | flannel     | [docs](/docs/getting-started-guides/fedora/flannel_multi_node_cluster/)      |  Community ([@aveshagarwal](https://github.com/aveshagarwal))
Bare Metal           | Juju         | Ubuntu | flannel/calico/canal     | [docs](https://www.ubuntu.com/kubernetes/docs/quickstart)                    |  [Commercial](https://www.ubuntu.com/kubernetes) and [Community](https://jujucharms.com/kubernetes)
Bare-metal           | custom       | Ubuntu | flannel     | [docs](https://www.ubuntu.com/kubernetes/docs/quickstart)                                 |  Community ([@resouer](https://github.com/resouer), [@WIZARD-CXY](https://github.com/WIZARD-CXY))
CloudStack           | Ansible      | CoreOS | flannel     | [docs](/docs/getting-started-guides/cloudstack/)                             |  Community ([@sebgoa](https://github.com/sebgoa))
DCOS                 | Marathon   | CoreOS/Alpine | custom | [docs](/docs/getting-started-guides/dcos/)                                   |  Community ([Kubernetes-Mesos Authors](https://github.com/mesosphere/kubernetes-mesos/blob/master/AUTHORS.md))
Digital Rebar        | kubeadm      | any    | metal       | [docs](/docs/setup/on-premises-metal/krib/)                                  | Community ([@digitalrebar](https://github.com/digitalrebar))
Docker Enterprise    | custom | [multi-support](https://success.docker.com/article/compatibility-matrix) | [multi-support](https://docs.docker.com/ee/ucp/kubernetes/install-cni-plugin/) | [docs](https://docs.docker.com/ee/) | Commercial
Giant Swarm          |              | CoreOS | flannel and/or Calico | [docs](https://docs.giantswarm.io/) | Commercial
GCE                  | CoreOS       | CoreOS | flannel     | [docs](/docs/getting-started-guides/coreos/)                                 |  Community ([@pires](https://github.com/pires))
GCE                  | Juju         | Ubuntu | flannel/calico/canal     | [docs](https://www.ubuntu.com/kubernetes/docs/quickstart)                    |  [Commercial](https://www.ubuntu.com/kubernetes) and [Community](https://jujucharms.com/kubernetes)
GCE                  | Saltstack    | Debian | GCE         | [docs](/docs/setup/turnkey/gce/)                                    | Project
Google Kubernetes Engine |              |        | GCE         | [docs](https://cloud.google.com/kubernetes-engine/docs/) | Commercial
IBM Cloud Kubernetes Service |               | Ubuntu | IBM Cloud Networking + Calico | [docs](https://cloud.ibm.com/docs/containers?topic=containers-container_index#container_index) | Commercial
IBM Cloud Kubernetes Service | | Ubuntu | calico | [docs](https://cloud.ibm.com/docs/containers?topic=containers-container_index#container_index) | Commercial
IBM Cloud Private  | Ansible  | multi-support  | multi-support  | [docs](https://www.ibm.com/support/knowledgecenter/SSBS6K/product_welcome_cloud_private.html) | [Commercial](https://www.ibm.com/mysupport/s/topic/0TO500000001o0fGAA/ibm-cloud-private?language=en_US&productId=01t50000004X1PWAA0) and [Community](https://www.ibm.com/support/knowledgecenter/SSBS6K_3.1.2/troubleshoot/support_types.html) |
Kublr                | custom       | multi-support | multi-support | [docs](http://docs.kublr.com/) | Commercial
KVM                  | custom       | Fedora | flannel     | [docs](/docs/getting-started-guides/fedora/flannel_multi_node_cluster/)      |  Community ([@aveshagarwal](https://github.com/aveshagarwal))
libvirt              | custom       | Fedora | flannel     | [docs](/docs/getting-started-guides/fedora/flannel_multi_node_cluster/)      |  Community ([@aveshagarwal](https://github.com/aveshagarwal))
lxd                  | Juju         | Ubuntu | flannel/canal            | [docs](https://www.ubuntu.com/kubernetes/docs/quickstart)              |  [Commercial](https://www.ubuntu.com/kubernetes) and [Community](https://jujucharms.com/kubernetes)
Madcore.Ai           | Jenkins DSL  | Ubuntu | flannel     | [docs](https://madcore.ai)                        | Community ([@madcore-ai](https://github.com/madcore-ai))
Mirantis Cloud Platform | Salt | Ubuntu | multi-support | [docs](https://docs.mirantis.com/mcp/) | Commercial
Oracle Cloud Infrastructure        | Juju         | Ubuntu | flannel/calico/canal     | [docs](https://www.ubuntu.com/kubernetes/docs/quickstart)                    |  [Commercial](https://www.ubuntu.com/kubernetes) and [Community](https://jujucharms.com/kubernetes)
Oracle Cloud Infrastructure Container Engine for Kubernetes (OKE) |              |              | multi-support | [docs](https://docs.cloud.oracle.com/iaas/Content/ContEng/Concepts/contengoverview.htm) | Commercial
oVirt                |              |        |             | [docs](/docs/setup/on-premises-vm/ovirt/)                                  |  Community ([@simon3z](https://github.com/simon3z))
Platform9            |              | multi-support | multi-support | [docs](https://platform9.com/managed-kubernetes/) | Commercial
Rackspace            | custom       | CoreOS | flannel/calico/canal     | [docs](https://developer.rackspace.com/docs/rkaas/latest/)      |  [Commercial](https://www.rackspace.com/managed-kubernetes)
Red Hat OpenShift    | Ansible & CoreOS | RHEL & CoreOS   | [multi-support](https://docs.openshift.com/container-platform/3.11/architecture/networking/network_plugins.html) | [docs](https://docs.openshift.com/container-platform/3.11/welcome/index.html) | Commercial
Stackpoint.io        |              | multi-support       | multi-support   | [docs](https://stackpoint.io/) | Commercial
Vagrant              | CoreOS       | CoreOS | flannel     | [docs](/docs/getting-started-guides/coreos/)                                 |  Community ([@pires](https://github.com/pires), [@AntonioMeireles](https://github.com/AntonioMeireles))
VMware vSphere       | any          | multi-support | multi-support     | [docs](https://github.com/kubernetes/cloud-provider-vsphere/tree/master/docs)  |  [Community](https://vmware.github.io/vsphere-storage-for-kubernetes/documentation/contactus.html)
VMware vSphere       | Juju         | Ubuntu | flannel/calico/canal     | [docs](https://www.ubuntu.com/kubernetes/docs/quickstart)                    |  [Commercial](https://www.ubuntu.com/kubernetes) and [Community](https://jujucharms.com/kubernetes)
VMware Cloud PKS     |              | Photon OS | Canal | [docs](https://docs.vmware.com/en/VMware-Kubernetes-Engine/index.html) | Commercial
VMware Enterprise PKS     | BOSH       | Ubuntu | VMware NSX-T/flannel | [docs](https://docs.vmware.com/en/VMware-Enterprise-PKS/) | Commercial
VMware Essential PKS     | any       | multi-support | multi-support | [docs](https://cloud.vmware.com/vmware-essential-PKS) | Commercial

### Definition of columns

* **IaaS Provider** is the product or organization which provides the virtual or physical machines (nodes) that Kubernetes runs on.
* **OS** is the base operating system of the nodes.
* **Config. Mgmt.** is the configuration management system that helps install and maintain Kubernetes on the
  nodes.
* **Networking** is what implements the [networking model](/docs/concepts/cluster-administration/networking/). Those with networking type
  _none_ may not support more than a single node, or may support multiple VM nodes in a single physical node.
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

{{% /capture %}}
