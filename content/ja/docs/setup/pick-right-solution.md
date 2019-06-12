---
title: 正しいソリューションの選択
weight: 10
content_template: templates/concept
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

## ローカルマシンを使ったソリューション

* [Minikube](/docs/setup/minikube/) is a method for creating a local, single-node Kubernetes cluster for development and testing. Setup is completely automated and doesn't require a cloud provider account.

* [microk8s](https://microk8s.io/) provides a single command installation of the latest Kubernetes release on a local machine for development and testing. Setup is quick, fast (~30 sec) and supports many plugins including Istio with a single command.

* [IBM Cloud Private-CE (Community Edition)](https://github.com/IBM/deploy-ibm-cloud-private) can use VirtualBox on your machine to deploy Kubernetes to one or more VMs for development and test scenarios. Scales to full multi-node cluster.

* [IBM Cloud Private-CE (Community Edition) on Linux Containers](https://github.com/HSBawa/icp-ce-on-linux-containers) is a Terraform/Packer/BASH based Infrastructure as Code (IaC) scripts to create a seven node (1 Boot, 1 Master, 1 Management, 1 Proxy and 3 Workers) LXD cluster on  Linux Host.

* [Kubeadm-dind](https://github.com/kubernetes-sigs/kubeadm-dind-cluster) is a multi-node (while minikube is single-node) Kubernetes cluster which only requires a docker daemon. It uses docker-in-docker technique to spawn the Kubernetes cluster.

* [Ubuntu on LXD](/docs/getting-started-guides/ubuntu/local/) supports a nine-instance deployment on localhost.

## ホスティングを使ったソリューション

* [AppsCode.com](https://appscode.com/products/cloud-deployment/) provides managed Kubernetes clusters for various public clouds, including AWS and Google Cloud Platform.

* [APPUiO](https://appuio.ch) runs an OpenShift public cloud platform, supporting any Kubernetes workload. Additionally APPUiO offers Private Managed OpenShift Clusters, running on any public or private cloud.

* [Amazon Elastic Container Service for Kubernetes](https://aws.amazon.com/eks/) offers managed Kubernetes service.

* [Azure Kubernetes Service](https://azure.microsoft.com/services/container-service/) offers managed Kubernetes clusters.

* [Giant Swarm](https://giantswarm.io/product/) offers managed Kubernetes clusters in their own datacenter, on-premises, or on public clouds.

* [Google Kubernetes Engine](https://cloud.google.com/kubernetes-engine/) offers managed Kubernetes clusters.

* [IBM Cloud Kubernetes Service](https://console.bluemix.net/docs/containers/container_index.html) offers managed Kubernetes clusters with isolation choice, operational tools, integrated security insight into images and containers, and integration with Watson, IoT, and data.

* [Kubermatic](https://www.loodse.com) provides managed Kubernetes clusters for various public clouds, including AWS and Digital Ocean, as well as on-premises with OpenStack integration.

* [Kublr](https://kublr.com) offers enterprise-grade secure, scalable, highly reliable Kubernetes clusters on AWS, Azure, GCP, and on-premise. It includes out-of-the-box backup and disaster recovery, multi-cluster centralized logging and monitoring, and built-in alerting.

* [Madcore.Ai](https://madcore.ai) is devops-focused CLI tool for deploying Kubernetes infrastructure in AWS. Master, auto-scaling group nodes with spot-instances, ingress-ssl-lego, Heapster, and Grafana.

* [OpenShift Dedicated](https://www.openshift.com/dedicated/) offers managed Kubernetes clusters powered by OpenShift.

* [OpenShift Online](https://www.openshift.com/features/) provides free hosted access for Kubernetes applications.

* [Oracle Container Engine for Kubernetes](https://docs.us-phoenix-1.oraclecloud.com/Content/ContEng/Concepts/contengoverview.htm) is a fully-managed, scalable, and highly available service that you can use to deploy your containerized applications to the cloud.

* [Platform9](https://platform9.com/products/kubernetes/) offers managed Kubernetes on-premises or on any public cloud, and provides 24/7 health monitoring and alerting. (Kube2go, a web-UI driven Kubernetes cluster deployment service Platform9 released, has been integrated to Platform9 Sandbox.)

* [Stackpoint.io](https://stackpoint.io) provides Kubernetes infrastructure automation and management for multiple public clouds.

* [SysEleven MetaKube](https://www.syseleven.io/products-services/managed-kubernetes/) offers managed Kubernetes as a service powered on our OpenStack public cloud. It includes lifecycle management, administration dashboards, monitoring, autoscaling and much more.

* [VMware Cloud PKS](https://cloud.vmware.com/vmware-cloud-pks) is an enterprise Kubernetes-as-a-Service offering in the VMware Cloud Services portfolio that provides easy to use, secure by default, cost effective, SaaS-based Kubernetes clusters.

## すぐに利用できるクラウドを使ったソリューション

These solutions allow you to create Kubernetes clusters on a range of Cloud IaaS providers with only a
few commands. These solutions are actively developed and have active community support.

* [Agile Stacks](https://www.agilestacks.com/products/kubernetes)
* [Alibaba Cloud](/docs/setup/turnkey/alibaba-cloud/)
* [APPUiO](https://appuio.ch)
* [AWS](/docs/setup/turnkey/aws/)
* [Azure](/docs/setup/turnkey/azure/)
* [CenturyLink Cloud](/docs/setup/turnkey/clc/)
* [Conjure-up Kubernetes with Ubuntu on AWS, Azure, Google Cloud, Oracle Cloud](/docs/getting-started-guides/ubuntu/)
* [Gardener](https://gardener.cloud/)
* [Google Compute Engine (GCE)](/docs/setup/turnkey/gce/)
* [IBM Cloud](https://github.com/patrocinio/kubernetes-softlayer)
* [Kontena Pharos](https://kontena.io/pharos/)
* [Kubermatic](https://cloud.kubermatic.io)
* [Kublr](https://kublr.com/)
* [Madcore.Ai](https://madcore.ai/)
* [Oracle Container Engine for K8s](https://docs.us-phoenix-1.oraclecloud.com/Content/ContEng/Concepts/contengprerequisites.htm)
* [Pivotal Container Service](https://pivotal.io/platform/pivotal-container-service)
* [Giant Swarm](https://giantswarm.io)
* [Rancher 2.0](https://rancher.com/docs/rancher/v2.x/en/)
* [Stackpoint.io](/docs/setup/turnkey/stackpoint/)
* [Tectonic by CoreOS](https://coreos.com/tectonic)

## すぐに利用できるオンプレミスを使ったソリューション
These solutions allow you to create Kubernetes clusters on your internal, secure, cloud network with only a
few commands.

* [Agile Stacks](https://www.agilestacks.com/products/kubernetes)
* [APPUiO](https://appuio.ch)
* [GKE On-Prem | Google Cloud](https://cloud.google.com/gke-on-prem/)
* [IBM Cloud Private](https://www.ibm.com/cloud-computing/products/ibm-cloud-private/)
* [Kontena Pharos](https://kontena.io/pharos/)
* [Kubermatic](https://www.loodse.com)
* [Kublr](https://kublr.com/)
* [Pivotal Container Service](https://pivotal.io/platform/pivotal-container-service)
* [Giant Swarm](https://giantswarm.io)
* [Rancher 2.0](https://rancher.com/docs/rancher/v2.x/en/)
* [SUSE CaaS Platform](https://www.suse.com/products/caas-platform)
* [SUSE Cloud Application Platform](https://www.suse.com/products/cloud-application-platform/)

## カスタムソリューション

Kubernetes can run on a wide range of Cloud providers and bare-metal environments, and with many
base operating systems.

If you can find a guide below that matches your needs, use it. It may be a little out of date, but
it will be easier than starting from scratch. If you do want to start from scratch, either because you
have special requirements, or just because you want to understand what is underneath a Kubernetes
cluster, try the [Getting Started from Scratch](/docs/setup/release/building-from-source/) guide.

If you are interested in supporting Kubernetes on a new platform, see
[Writing a Getting Started Guide](https://git.k8s.io/community/contributors/devel/writing-a-getting-started-guide.md).

### 全般

If you already have a way to configure hosting resources, use
[kubeadm](/docs/setup/independent/create-cluster-kubeadm/) to easily bring up a cluster
with a single command per machine.

### クラウド

These solutions are combinations of cloud providers and operating systems not covered by the above solutions.

* [CoreOS on AWS or GCE](/docs/setup/custom-cloud/coreos/)
* [Gardener](https://gardener.cloud/)
* [Kublr](https://kublr.com/)
* [Kubernetes on Ubuntu](/docs/getting-started-guides/ubuntu/)
* [Kubespray](/docs/setup/custom-cloud/kubespray/)
* [Rancher Kubernetes Engine (RKE)](https://github.com/rancher/rke)

### オンプレミスの仮想マシン

* [CloudStack](/docs/setup/on-premises-vm/cloudstack/) (uses Ansible, CoreOS and flannel)
* [Fedora (Multi Node)](/docs/getting-started-guides/fedora/flannel_multi_node_cluster/) (uses Fedora and flannel)
* [oVirt](/docs/setup/on-premises-vm/ovirt/)
* [Vagrant](/docs/setup/custom-cloud/coreos/) (uses CoreOS and flannel)
* [VMware](/docs/setup/custom-cloud/coreos/) (uses CoreOS and flannel)
* [VMware vSphere](https://vmware.github.io/vsphere-storage-for-kubernetes/documentation/)
* [VMware vSphere, OpenStack, or Bare Metal](/docs/getting-started-guides/ubuntu/) (uses Juju, Ubuntu and flannel)

### ベアメタル

* [CoreOS](/docs/setup/custom-cloud/coreos/)
* [Digital Rebar](/docs/setup/on-premises-metal/krib/)
* [Fedora (Single Node)](/docs/getting-started-guides/fedora/fedora_manual_config/)
* [Fedora (Multi Node)](/docs/getting-started-guides/fedora/flannel_multi_node_cluster/)
* [Kubernetes on Ubuntu](/docs/getting-started-guides/ubuntu/)

### 統合

These solutions provide integration with third-party schedulers, resource managers, and/or lower level platforms.

* [DCOS](/docs/setup/on-premises-vm/dcos/)
  * Community Edition DCOS uses AWS
  * Enterprise Edition DCOS supports cloud hosting, on-premises VMs, and bare metal

## ソリューションの表

Below is a table of all of the solutions listed above.

IaaS Provider        | Config. Mgmt. | OS     | Networking  | Docs                                              | Support Level
-------------------- | ------------ | ------ | ----------  | ---------------------------------------------     | ----------------------------
any                  | any          | multi-support | any CNI | [docs](/docs/setup/independent/create-cluster-kubeadm/) | Project ([SIG-cluster-lifecycle](https://git.k8s.io/community/sig-cluster-lifecycle))
Google Kubernetes Engine |              |        | GCE         | [docs](https://cloud.google.com/kubernetes-engine/docs/) | Commercial
Stackpoint.io        |              | multi-support       | multi-support   | [docs](https://stackpoint.io/) | Commercial
AppsCode.com         | Saltstack    | Debian | multi-support | [docs](https://appscode.com/products/cloud-deployment/) | Commercial
Madcore.Ai           | Jenkins DSL  | Ubuntu | flannel     | [docs](https://madcore.ai)                        | Community ([@madcore-ai](https://github.com/madcore-ai))
Platform9        |              | multi-support | multi-support | [docs](https://platform9.com/managed-kubernetes/) | Commercial
Kublr       | custom       | multi-support | multi-support | [docs](http://docs.kublr.com/) | Commercial
Kubermatic       |              | multi-support | multi-support | [docs](http://docs.kubermatic.io/) | Commercial
IBM Cloud Kubernetes Service |               | Ubuntu | IBM Cloud Networking + Calico | [docs](https://console.bluemix.net/docs/containers/) | Commercial
Giant Swarm        |              | CoreOS | flannel and/or Calico | [docs](https://docs.giantswarm.io/) | Commercial
GCE                  | Saltstack    | Debian | GCE         | [docs](/docs/setup/turnkey/gce/)                                    | Project
Azure Kubernetes Service |              | Ubuntu | Azure       | [docs](https://docs.microsoft.com/en-us/azure/aks/)                    |  Commercial
Azure (IaaS)    |              | Ubuntu | Azure       | [docs](/docs/setup/turnkey/azure/)                    |  [Community (Microsoft)](https://github.com/Azure/acs-engine)
Bare-metal           | custom       | Fedora | _none_      | [docs](/docs/getting-started-guides/fedora/fedora_manual_config/)            |  Project
Bare-metal           | custom       | Fedora | flannel     | [docs](/docs/getting-started-guides/fedora/flannel_multi_node_cluster/)      |  Community ([@aveshagarwal](https://github.com/aveshagarwal))
libvirt              | custom       | Fedora | flannel     | [docs](/docs/getting-started-guides/fedora/flannel_multi_node_cluster/)      |  Community ([@aveshagarwal](https://github.com/aveshagarwal))
KVM                  | custom       | Fedora | flannel     | [docs](/docs/getting-started-guides/fedora/flannel_multi_node_cluster/)      |  Community ([@aveshagarwal](https://github.com/aveshagarwal))
DCOS                 | Marathon   | CoreOS/Alpine | custom | [docs](/docs/getting-started-guides/dcos/)                                   |  Community ([Kubernetes-Mesos Authors](https://github.com/mesosphere/kubernetes-mesos/blob/master/AUTHORS.md))
AWS                  | CoreOS       | CoreOS | flannel     | [docs](/docs/setup/turnkey/aws/)                                 |  Community
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
Rackspace            | custom       | CoreOS | flannel/calico/canal     | [docs](https://developer.rackspace.com/docs/rkaas/latest/)      |  [Commercial](https://www.rackspace.com/managed-kubernetes)
VMware vSphere       | Juju         | Ubuntu | flannel/calico/canal     | [docs](/docs/getting-started-guides/ubuntu/)                    |  [Commercial](https://www.ubuntu.com/kubernetes) and [Community](https://jujucharms.com/kubernetes)
Bare Metal           | Juju         | Ubuntu | flannel/calico/canal     | [docs](/docs/getting-started-guides/ubuntu/)                    |  [Commercial](https://www.ubuntu.com/kubernetes) and [Community](https://jujucharms.com/kubernetes)
AWS                  | Saltstack    | Debian | AWS         | [docs](/docs/setup/turnkey/aws/)                                    |  Community ([@justinsb](https://github.com/justinsb))
AWS                  | kops         | Debian | AWS         | [docs](https://github.com/kubernetes/kops/)                                  |  Community ([@justinsb](https://github.com/justinsb))
Bare-metal           | custom       | Ubuntu | flannel     | [docs](/docs/getting-started-guides/ubuntu/)                                 |  Community ([@resouer](https://github.com/resouer), [@WIZARD-CXY](https://github.com/WIZARD-CXY))
oVirt                |              |        |             | [docs](/docs/setup/on-premises-vm/ovirt/)                                  |  Community ([@simon3z](https://github.com/simon3z))
any                  | any          | any    | any         | [docs](/docs/setup/release/building-from-source/)                                |  Community ([@erictune](https://github.com/erictune))
any                  | any          | any    | any         | [docs](http://docs.projectcalico.org/v2.2/getting-started/kubernetes/installation/)                                |  Commercial and Community
any                  | RKE          | multi-support    | flannel or canal         | [docs](https://rancher.com/docs/rancher/v2.x/en/quick-start-guide/)                                |  [Commercial](https://rancher.com/what-is-rancher/overview/) and [Community](https://github.com/rancher/rancher)
any                  | [Gardener Cluster-Operator](https://kubernetes.io/blog/2018/05/17/gardener/) | multi-support | multi-support | [docs](https://gardener.cloud) | [Project/Community](https://github.com/gardener) and [Commercial]( https://cloudplatform.sap.com/)
Alibaba Cloud Container Service For Kubernetes | ROS        | CentOS | flannel/Terway       | [docs](https://www.aliyun.com/product/containerservice)                    |  Commercial
Agile Stacks       | Terraform   | CoreOS | multi-support | [docs](https://www.agilestacks.com/products/kubernetes) | Commercial
IBM Cloud Kubernetes Service | | Ubuntu | calico | [docs](https://console.bluemix.net/docs/containers/container_index.html) | Commercial
Digital Rebar        | kubeadm      | any    | metal       | [docs](/docs/setup/on-premises-metal/krib/)                                  | Community ([@digitalrebar](https://github.com/digitalrebar))
VMware Cloud PKS     |              | Photon OS | Canal | [docs](https://docs.vmware.com/en/VMware-Kubernetes-Engine/index.html) | Commercial

{{< note >}}
The above table is ordered by version test/used in nodes, followed by support level.
{{< /note >}}

### カラムの定義

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

{{% /capture %}}
