---
no_issue: true
title: はじめに
main_menu: true
weight: 20
content_template: templates/concept
card:
  name: setup
  weight: 20
  anchors:
  - anchor: "#learning-environment"
    title: 環境について学ぶ
  - anchor: "#production-environment"
    title: 本番環境
---

{{% capture overview %}}

このセクションではKubernetesをセットアップして動かすための複数のやり方について説明します。

各Kubernetesソリューションはそれぞれ、メンテナンス性、セキュリティ、管理、利用可能なリソース、クラスターの運用に専門知識が必要など、異なる要件があります。

Kubernetesクラスタはローカルマシン、クラウド、オンプレのデータセンターにデプロイすることもできますし、マネージドのKubernetesクラスターを選択することもできます。複数のクラウドプロバイダーやベアメタルの環境に跨ったカスタムソリューションを選ぶことも可能です。

簡潔に言えば、学習用としても、本番環境用としてもKubernetesクラスターを作成することができます。

{{% /capture %}}

{{% capture body %}}

## 環境について学ぶ

Kubernetesについて学んでいる場合、Dockerベースのソリューションを使いましょう。これらはKubernetesコミュニティにサポートされていたり、あるいはKubernetesクラスターをローカル環境にセットアップするエコシステムを持っていたりします。

{{< table caption="Local machine solutions table that lists the tools supported by the community and the ecosystem to deploy Kubernetes." >}}

|コミュニティ           |エコシステム     |
| ------------       | --------     |
| [Minikube](/ja/docs/setup/learning-environment/minikube/) | [CDK on LXD](https://www.ubuntu.com/kubernetes/docs/install-local) |
| [kind (Kubernetes IN Docker)](https://github.com/kubernetes-sigs/kind) | [Docker Desktop](https://www.docker.com/products/docker-desktop)|
|                     | [Minishift](https://docs.okd.io/latest/minishift/)|
|                     | [MicroK8s](https://microk8s.io/)|
|                     | [IBM Cloud Private-CE (Community Edition)](https://github.com/IBM/deploy-ibm-cloud-private) |
|                     | [IBM Cloud Private-CE (Community Edition) on Linux Containers](https://github.com/HSBawa/icp-ce-on-linux-containers)|
|                     | [k3s](https://k3s.io)|
|                     | [Ubuntu on LXD](/docs/getting-started-guides/ubuntu/)|


## 本番環境

本番環境用のソリューションを評価する際には、Kubernetesクラスター(または抽象レイヤ)の運用においてどの部分を自分で管理し、どの部分をプロバイダーに任せるのかを考慮してください。

Kubernetesクラスタにおける抽象レイヤには {{< glossary_tooltip text="アプリケーション" term_id="applications" >}}、 {{< glossary_tooltip text="データプレーン" term_id="data-plane" >}}、 {{< glossary_tooltip text="コントロールプレーン" term_id="control-plane" >}}、 {{< glossary_tooltip text="クラスターインフラ" term_id="cluster-infrastructure" >}}、 {{< glossary_tooltip text="そして、クラスター運用" term_id="cluster-operations" >}}があります。

次の図は、Kubernetesクラスターの抽象レイヤ一覧と、それぞれの抽象レイヤを自分で管理するのか、プロバイダによって管理されているのかを示しています。

本番環境のソリューション![Production environment solutions](/images/docs/KubernetesSolutions.svg)

{{< table caption="Production environment solutions table lists the providers and the solutions." >}}
次の表は、各プロバイダーとそれらが提供するソリューションを一覧にしたものです。

|プロバイダー | マネージド | 即時利用可能 | オンプレDC  | カスタム(クラウド) | カスタム(オンプレVM)| カスタム(ベアメタル) |
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
| [Containership](https://containership.io)            | &#x2714;       |&#x2714;  |     |     |                   |
| [D2iQ](https://d2iq.com/) |  | [Kommander](https://d2iq.com/solutions/ksphere) | [Konvoy](https://d2iq.com/solutions/ksphere/konvoy) | [Konvoy](https://d2iq.com/solutions/ksphere/konvoy) | [Konvoy](https://d2iq.com/solutions/ksphere/konvoy) | [Konvoy](https://d2iq.com/solutions/ksphere/konvoy) |
| [Digital Rebar](https://provision.readthedocs.io/en/tip/README.html)            |        |  |      |     |  | &#x2714;
| [DigitalOcean](https://www.digitalocean.com/products/kubernetes/)        | &#x2714;      |  |      |     |            |
| [Docker Enterprise](https://www.docker.com/products/docker-enterprise) |       |&#x2714;  | &#x2714;     |  |     | &#x2714;
| [Fedora (Multi Node)](https://kubernetes.io/docs/getting-started-guides/fedora/flannel_multi_node_cluster/)     |      |  |      | |    &#x2714;       | &#x2714;
| [Fedora (Single Node)](https://kubernetes.io/docs/getting-started-guides/fedora/fedora_manual_config/)     |      |  |      | |           | &#x2714;
| [Gardener](https://gardener.cloud/) | &#x2714; | &#x2714; | &#x2714; | &#x2714; | &#x2714; | [Custom Extensions](https://github.com/gardener/gardener/blob/master/docs/extensions/overview.md) |
| [Giant Swarm](https://www.giantswarm.io/)     | &#x2714;       | &#x2714; |   &#x2714;    |     |
| [Google](https://cloud.google.com/)           |  [Google Kubernetes Engine (GKE)](https://cloud.google.com/kubernetes-engine/)       | [Google Compute Engine (GCE)](https://cloud.google.com/compute/)|[GKE On-Prem](https://cloud.google.com/gke-on-prem/)       |  |  |     |  |      |       |  |
| [IBM](https://www.ibm.com/in-en/cloud)        | [IBM Cloud Kubernetes Service](https://cloud.ibm.com/kubernetes/catalog/cluster)| |[IBM Cloud Private](https://www.ibm.com/in-en/cloud/private) | |
| [Ionos](https://www.ionos.com/enterprise-cloud)        | [Ionos Managed Kubernetes](https://www.ionos.com/enterprise-cloud/managed-kubernetes) | [Ionos Enterprise Cloud](https://www.ionos.com/enterprise-cloud) | |
| [Kontena Pharos](https://www.kontena.io/pharos/)          |    |&#x2714;|    &#x2714;    |        |         |
| [KubeOne](https://kubeone.io/) |  | &#x2714; | &#x2714; | &#x2714; | &#x2714; | &#x2714; |
| [Kubermatic](https://kubermatic.io/) | &#x2714; | &#x2714; | &#x2714; | &#x2714; | &#x2714; |  |
| [KubeSail](https://kubesail.com/)    | &#x2714;       |  |      |     |        |
| [Kubespray](https://kubespray.io/#/)       |       |    |       |&#x2714;  | &#x2714; | &#x2714; |
| [Kublr](https://kublr.com/)        |&#x2714; | &#x2714;  |&#x2714;       |&#x2714;  |&#x2714; |&#x2714; |
| [Microsoft Azure](https://azure.microsoft.com)    |  [Azure Kubernetes Service (AKS)](https://azure.microsoft.com/en-us/services/kubernetes-service/)     |  |     |        |    |
| [Mirantis Cloud Platform](https://www.mirantis.com/software/kubernetes/)    |       |  | &#x2714; |  |    |
| [Nirmata](https://www.nirmata.com/)          |              |   &#x2714;     | &#x2714;            |      |          |
| [Nutanix](https://www.nutanix.com/en)         | [Nutanix Karbon](https://www.nutanix.com/products/karbon)             | [Nutanix Karbon](https://www.nutanix.com/products/karbon)       |             |      | [Nutanix AHV](https://www.nutanix.com/products/acropolis/virtualization)         |
| [OpenNebula](https://www.opennebula.org)          |[OpenNebula Kubernetes](https://marketplace.opennebula.systems/docs/service/kubernetes.html)              |        |            |      |   |
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
