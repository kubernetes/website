---
no_issue: true
title: 入门
main_menu: true
weight: 20
content_template: templates/concept
card:
  name: 设置
  weight: 20
  anchors:
  - anchor: "#learning-environment"
    title: 学习环境
  - anchor: "#production-environment"
    title: 生产环境  
---

<!--
---
reviewers:
- brendandburns
- erictune
- mikedanese
no_issue: true
title: Getting started
main_menu: true
weight: 20
content_template: templates/concept
card:
  name: setup
  weight: 20
  anchors:
  - anchor: "#learning-environment"
    title: Learning environment
  - anchor: "#production-environment"
    title: Production environment  
---
-->

{{% capture overview %}}

<!--
This section covers different options to set up and run Kubernetes.
-->
本节介绍了设置和运行 Kubernetes 环境的不同选项。

<!--
Different Kubernetes solutions meet different requirements: ease of maintenance, security, control, available resources, and expertise required to operate and manage a cluster.
-->
不同的 Kubernetes 解决方案满足不同的要求：易于维护、安全性、可控制性、可用资源以及操作和管理 Kubernetes 集群所需的专业知识。

<!--
You can deploy a Kubernetes cluster on a local machine, cloud, on-prem datacenter; or choose a managed Kubernetes cluster. You can also create custom solutions across a wide range of cloud providers, or bare metal environments.
-->
可以在本地机器、云、本地数据中心上部署 Kubernetes 集群，或选择一个托管的 Kubernetes 集群。还可以跨各种云提供商或裸机环境创建自定义解决方案。

<!--
More simply, you can create a Kubernetes cluster in learning and production environments.
-->
更简单地说，可以在学习和生产环境中创建一个 Kubernetes 集群。

{{% /capture %}}

{{% capture body %}}

<!--
## Learning environment
-->
## 学习环境

<!--
If you're learning Kubernetes, use the Docker-based solutions: tools supported by the Kubernetes community, or tools in the ecosystem to set up a Kubernetes cluster on a local machine.
-->
如果正打算学习 Kubernetes，请使用基于 Docker 的解决方案：Docker 是 Kubernetes 社区支持或生态系统中用来在本地计算机上设置 Kubernetes 集群的一种工具。

<!--
{{< table caption="Local machine solutions table that lists the tools supported by the community and the ecosystem to deploy Kubernetes." >}}
|Community           |Ecosystem     |
|社区           |生态系统     |
-->
{{< table caption="本地机器解决方案表，其中列出了社区和生态系统支持的用于部署 Kubernetes 的工具。" >}}

|社区           |生态系统     |
| ------------       | --------     |
| [Minikube](/docs/setup/learning-environment/minikube/) | [CDK on LXD](https://www.ubuntu.com/kubernetes/docs/install-local) |
| [kind (Kubernetes IN Docker)](https://github.com/kubernetes-sigs/kind) | [Docker Desktop](https://www.docker.com/products/docker-desktop)|
|                     | [Minishift](https://docs.okd.io/latest/minishift/)|
|                     | [MicroK8s](https://microk8s.io/)|
|                     | [IBM Cloud Private-CE (Community Edition)](https://github.com/IBM/deploy-ibm-cloud-private) |
|                     | [IBM Cloud Private-CE (Community Edition) on Linux Containers](https://github.com/HSBawa/icp-ce-on-linux-containers)|
|                     | [k3s](https://k3s.io)|
|                     | [Ubuntu on LXD](/docs/getting-started-guides/ubuntu/)|


<!--
## Production environment
-->
## 生产环境

<!--
When evaluating a solution for a production environment, consider which aspects of operating a Kubernetes cluster (or _abstractions_) you want to manage yourself or offload to a provider.
-->
在评估生产环境的解决方案时，请考虑要管理自己 Kubernetes 集群（_抽象层面_）的哪些方面或将其转移给提供商。

<!--
Some possible abstractions of a Kubernetes cluster are {{< glossary_tooltip text="applications" term_id="applications" >}}, {{< glossary_tooltip text="data plane" term_id="data-plane" >}}, {{< glossary_tooltip text="control plane" term_id="control-plane" >}}, {{< glossary_tooltip text="cluster infrastructure" term_id="cluster-infrastructure" >}}, and {{< glossary_tooltip text="cluster operations" term_id="cluster-operations" >}}.
-->
Kubernetes 集群的一些抽象概念可能是 {{< glossary_tooltip text="应用领域" term_id="applications" >}}、{{< glossary_tooltip text="数据平面" term_id="data-plane" >}}、{{< glossary_tooltip text="控制平面" term_id="control-plane" >}}、{{< glossary_tooltip text="集群基础架构" term_id="cluster-infrastructure" >}} 和 {{< glossary_tooltip text="集群操作层面" term_id="cluster-operations" >}}。

<!--
The following diagram lists the possible abstractions of a Kubernetes cluster and whether an abstraction is self-managed or managed by a provider.
-->
下图列出了 Kubernetes 集群的抽象概念以及抽象概念是由自我管理还是由提供商管理。

<!--
Production environment solutions![Production environment solutions](/images/docs/KubernetesSolutions.svg)
-->
生产环境解决方案![生产环境解决方案](/images/docs/KubernetesSolutions.svg)

<!--
{{< table caption="Production environment solutions table lists the providers and the solutions." >}}
The following production environment solutions table lists the providers and the solutions that they offer.
-->
{{< table caption="生产环境解决方案表列出了提供商和解决方案。" >}}
以下生产环境解决方案表列出了提供商及其提供的解决方案。

<!--
|Providers  | Managed | Turnkey cloud  | On-prem datacenter  | Custom (cloud) | Custom (On-premises VMs)| Custom (Bare Metal) |
|提供商  | 管理者 | Turnkey 云  | 本地数据中心  | 自定义（云） | 自定义（本地VM）| 定制（裸机） |
-->

|提供商  | 管理者 | Turnkey 云  | 本地数据中心  | 自定义（云） | 自定义（本地VM）| 定制（裸机） |
| ---------  | ------  | ------         | ------         | ------         | ------                  | -----               |
| [Agile Stacks](https://www.agilestacks.com/products/kubernetes)|                | &#x2714;       | &#x2714;         |       |                    |
| [Alibaba Cloud](https://www.alibabacloud.com/product/kubernetes)|     | &#x2714; |          |    |                      |
| [Amazon](https://aws.amazon.com)   | [Amazon EKS](https://aws.amazon.com/eks/)   |[Amazon EC2](https://aws.amazon.com/ec2/)  |          |        |                       |
| [AppsCode](https://appscode.com/products/pharmer/)          | &#x2714;      |  |       |         |  |
| [APPUiO](https://appuio.ch/)  | &#x2714;     | &#x2714;  |   &#x2714; | |  | |
| [Banzai Cloud Pipeline Kubernetes Engine (PKE)](https://banzaicloud.com/products/pke/) | | &#x2714; | | &#x2714; | &#x2714; | &#x2714; |
| [CenturyLink Cloud](https://www.ctl.io/)     |       | &#x2714; |   |  | |
| [Cisco Container Platform](https://cisco.com/go/containers)     |       |  | &#x2714;  |  | |
| [Cloud Foundry Container Runtime (CFCR)](https://docs-cfcr.cfapps.io/)       |     |  |   | &#x2714; |&#x2714; |
| [CloudStack](https://cloudstack.apache.org/)           |      |  |   | | &#x2714;|
| [Canonical](https://ubuntu.com/kubernetes)      |       &#x2714;       | &#x2714;       |      &#x2714;       | &#x2714;     |&#x2714;  | &#x2714;
| [Containership](https://containership.io/containership-platform)            | &#x2714;       |&#x2714;  |     |     |                   |
| [D2iQ](https://d2iq.com/) |  | [Kommander](https://d2iq.com/solutions/ksphere) | [Konvoy](https://d2iq.com/solutions/ksphere/konvoy) | [Konvoy](https://d2iq.com/solutions/ksphere/konvoy) | [Konvoy](https://d2iq.com/solutions/ksphere/konvoy) | [Konvoy](https://d2iq.com/solutions/ksphere/konvoy) |
| [Digital Rebar](https://provision.readthedocs.io/en/tip/README.html)            |        |  |      |     |  | &#x2714;
| [DigitalOcean](https://www.digitalocean.com/products/kubernetes/)        | &#x2714;      |  |      |     |            |
| [Docker Enterprise](https://www.docker.com/products/docker-enterprise) |       |&#x2714;  | &#x2714;     |  |     | &#x2714;
| [Fedora (Multi Node)](https://kubernetes.io/docs/getting-started-guides/fedora/flannel_multi_node_cluster/)     |      |  |      | |    &#x2714;       | &#x2714;
| [Fedora (Single Node)](https://kubernetes.io/docs/getting-started-guides/fedora/fedora_manual_config/)     |      |  |      | |           | &#x2714;
| [Gardener](https://gardener.cloud/) | &#x2714; | &#x2714; | &#x2714; (via OpenStack) | &#x2714; | |
| [Giant Swarm](https://giantswarm.io/)     | &#x2714;       | &#x2714; |   &#x2714;    |     |
| [Google](https://cloud.google.com/)           |  [Google Kubernetes Engine (GKE)](https://cloud.google.com/kubernetes-engine/)       | [Google Compute Engine (GCE)](https://cloud.google.com/compute/)|[GKE On-Prem](https://cloud.google.com/gke-on-prem/)       |  |  |     |  |      |       |  |
| [IBM](https://www.ibm.com/in-en/cloud)        | [IBM Cloud Kubernetes Service](https://cloud.ibm.com/kubernetes/catalog/cluster)| |[IBM Cloud Private](https://www.ibm.com/in-en/cloud/private) | |
| [Ionos](https://www.ionos.com/enterprise-cloud)        | [Ionos Managed Kubernetes](https://www.ionos.com/enterprise-cloud/managed-kubernetes) | [Ionos Enterprise Cloud](https://www.ionos.com/enterprise-cloud) | |
| [Kontena Pharos](https://www.kontena.io/pharos/)          |    |&#x2714;|    &#x2714;    |        |         |
| [KubeOne](https://github.com/kubermatic/kubeone) |  | &#x2714; | &#x2714; | &#x2714; | &#x2714; | &#x2714; |
| [Kubermatic](https://kubermatic.io/) | &#x2714; | &#x2714; | &#x2714; | &#x2714; | &#x2714; |  |
| [KubeSail](https://kubesail.com/)    | &#x2714;       |  |      |     |        |
| [Kubespray](https://kubespray.io/#/)       |       |    |       |&#x2714;  | &#x2714; | &#x2714; |
| [Kublr](https://kublr.com/)        |&#x2714; | &#x2714;  |&#x2714;       |&#x2714;  |&#x2714; |&#x2714; |
| [Microsoft Azure](https://azure.microsoft.com)    |  [Azure Kubernetes Service (AKS)](https://azure.microsoft.com/en-us/services/kubernetes-service/)     |  |     |        |    |
| [Mirantis Cloud Platform](https://www.mirantis.com/software/kubernetes/)    |       |  | &#x2714; |  |    |
| [Nirmata](https://www.nirmata.com/)          |              |   &#x2714;     | &#x2714;            |      |          |
| [Nutanix](https://www.nutanix.com/en)         | [Nutanix Karbon](https://www.nutanix.com/products/karbon)             | [Nutanix Karbon](https://www.nutanix.com/products/karbon)       |             |      | [Nutanix AHV](https://www.nutanix.com/products/acropolis/virtualization)         |
| [OpenShift](https://www.openshift.com)          |[OpenShift Dedicated](https://www.openshift.com/products/dedicated/) and [OpenShift Online](https://www.openshift.com/products/online/)              |        | [OpenShift Container Platform](https://www.openshift.com/products/container-platform/)            |      |  [OpenShift Container Platform](https://www.openshift.com/products/container-platform/)        |[OpenShift Container Platform](https://www.openshift.com/products/container-platform/)
| [Oracle Cloud Infrastructure Container Engine for Kubernetes (OKE)](https://docs.cloud.oracle.com/iaas/Content/ContEng/Concepts/contengoverview.htm)          | &#x2714;             |   &#x2714;     |             |      |          |
| [oVirt](https://www.ovirt.org/)         |              |        |             |     | &#x2714;          |
| [Pivotal](https://pivotal.io/) | | [Enterprise Pivotal Container Service (PKS)](https://pivotal.io/platform/pivotal-container-service) | [Enterprise Pivotal Container Service (PKS)](https://pivotal.io/platform/pivotal-container-service)           |      |          |
| [Platform9](https://platform9.com/)         | [Platform9 Managed Kubernetes](https://platform9.com/managed-kubernetes/)             |       | [Platform9 Managed Kubernetes](https://platform9.com/managed-kubernetes/)            |  &#x2714;    |  &#x2714;    |   &#x2714;
| [Rancher](https://rancher.com/)         |              |   [Rancher 2.x](https://rancher.com/docs/rancher/v2.x/en/)     |             |  [Rancher Kubernetes Engine (RKE)](https://rancher.com/docs/rke/latest/en/)    |          | [k3s](https://k3s.io/)
| [StackPoint](https://stackpoint.io/)          | &#x2714;            |  &#x2714;      |             |      |          |
| [Supergiant](https://supergiant.io/)         |              |&#x2714;        |             |      |          |
| [SUSE](https://www.suse.com/)        |              | &#x2714;       |             |      |          |
| [SysEleven](https://www.syseleven.io/)         | &#x2714;             |        |             |      |          |
| [Tencent Cloud](https://intl.cloud.tencent.com/)  | [Tencent Kubernetes Engine](https://intl.cloud.tencent.com/product/tke) |   &#x2714;   |   &#x2714; |    |      |   &#x2714;  |
| [VEXXHOST](https://vexxhost.com/)         | &#x2714;             | &#x2714;      |             |      |          |
| [VMware](https://cloud.vmware.com/) | [VMware Cloud PKS](https://cloud.vmware.com/vmware-cloud-pks)              |[VMware Enterprise PKS](https://cloud.vmware.com/vmware-enterprise-pks)        |   [VMware Enterprise PKS](https://cloud.vmware.com/vmware-enterprise-pks)          | [VMware Essential PKS](https://cloud.vmware.com/vmware-essential-pks)      |          |[VMware Essential PKS](https://cloud.vmware.com/vmware-essential-pks)
| [Z.A.R.V.I.S.](https://zarvis.ai/) | &#x2714; | | | | | |

{{% /capture %}}
