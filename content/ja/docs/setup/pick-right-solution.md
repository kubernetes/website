---
title: 正しいソリューションの選択
weight: 10
content_template: templates/concept
card:
  name: setup
  weight: 20
  anchors:
  - anchor: "#ホスティングを使ったソリューション"
    title: ホスティングを使ったソリューション
  - anchor: "#すぐに利用できるクラウドを使ったソリューション"
    title: すぐに利用できるクラウドを使ったソリューション
  - anchor: "#すぐに利用できるオンプレミスを使ったソリューション"
    title: すぐに利用できるオンプレミスを使ったソリューション
  - anchor: "#カスタムソリューション"
    title: カスタムソリューション
  - anchor: "#ローカルマシンを使ったソリューション"
    title: ローカルマシンを使ったソリューション
---

{{% capture overview %}}

Kubernetesは様々なプラットフォームで動作することができます: PCから、クラウドプロバイダーのVM、ベアメタルサーバーのラックまで。
クラスターをセットアップするために必要な作業は、単一のコマンドを実行することからカスタマイズされたクラスターを作り上げるまで異なります。このガイドを使用して、ニーズに合ったソリューションを選択してください。

Kubernetesを少し試したいだけであれば、[ローカルマシンを使ったソリューション](#ローカルマシンを使ったソリューション)を使用してください。

より多くのマシンと高い可用性にスケールアップする準備がある場合、[ホスティングを使ったソリューション](#ホスティングを使ったソリューション)で作成して保守するのが最も簡単です。

[すぐに利用できるクラウドを使ったソリューション](#すぐに利用できるクラウドを使ったソリューション)は様々なクラウドプロバイダーを作成してカバーするために必要なコマンドはわずかで済みます。[すぐに利用できるオンプレミスを使ったソリューション](#すぐに利用できるオンプレミスを使ったソリューション)には、プライベートネットワークのセキュリティと組み合わせたすぐに利用できるクラウドソリューションのシンプルさがあります。

すでにホスティングサービスを設定する方法がある場合は、[kubeadm](/docs/setup/independent/create-cluster-kubeadm/)を使用して、マシン毎に単一のコマンドでクラスターを簡単に起動できます。

[カスタムソリューション](#カスタムソリューション)は段階的な手順からセットアップの一般的なアドバイスまで様々あります。

{{% /capture %}}

{{% capture body %}}

## ローカルマシンを使ったソリューション

* [Minikube](/docs/setup/minikube/)は開発とテスト用にローカルの単一ノードのKubernetesクラスターを作成するための方法です。セットアップは完全に自動化されており、クラウドプロバイダーのアカウントは必要ありません。

* [Docker Desktop](https://www.docker.com/products/docker-desktop)は
MacまたはWindows環境に簡単にインストールできるアプリケーションで、
単一ノードのKubernetesクラスターを使用して、
数分でコーディングとコンテナへのデプロイを開始できます。

* [Minishift](https://docs.okd.io/latest/minishift/)は、ローカル開発およびテスト用にKubernetesエンタープライズプラットフォームのOpenShiftのコミュニティーバージョンをインストールします。Windows、MacOS、Linux用のオールインワンのVM (`minishift start`)を提供します。コンテナの起動は`oc cluster up`に基づいています (Linuxのみ)。[付属のアドオン](https://github.com/minishift/minishift-addons/tree/master/add-ons)をインストールすることもできます。

* [MicroK8s](https://microk8s.io/)は、開発とテスト用にローカルマシンに最新リリースのKubernetesを単一コマンドでのインストールを可能にします。セットアップは素早く、速く(〜30秒)て、lstioを含む多くのプラグインを単一コマンドでサポートします。

* [IBM Cloud Private-CE (Community Edition)](https://github.com/IBM/deploy-ibm-cloud-private)は、開発とテストシナリオ用に、ご自身のマシンでVirtualBoxを使って1つ以上のVMにKubernetesをデプロイすることができます。フルマルチノードのクラスターに拡張します。

* [IBM Cloud Private-CE (Community Edition) on Linux Containers](https://github.com/HSBawa/icp-ce-on-linux-containers)は、Linuxホスト上に7ノード(1ブート、1マスター、1マネジメント、1プロキシー、3ワーカー)のLXDクラスターを作成するためのTerraform/Packer/BASHベースのInfrastructure as Code（IaC）のスクリプトです。

* [Kubeadm-dind](https://github.com/kubernetes-sigs/kubeadm-dind-cluster)は、(Minikubeが単一ノードであることに対して)マルチノードのKubernetesクラスターで、Dockerデーモンのみが必要です。Kubernetesクラスターを生成するためにdocker-in-docker技術を使います。

* [Ubuntu on LXD](/docs/getting-started-guides/ubuntu/local/)は、ローカルホスト上の9インスタンスのデプロイをサポートします。

## ホスティングを使ったソリューション

* [AppsCode.com](https://appscode.com/products/cloud-deployment/)は、AWSやGoogle Cloud Platformなどの様々なパブリッククラウド用のマネージドなKubernetesクラスターを提供します。

* [APPUiO](https://appuio.ch)は、OpenShiftのパブリッククラウドプラットフォームを実行し、あらゆるKubernetesワークロードをサポートします。さらにAPPUiOは、パブリッククラウドまたはプライベートクラウド上で動作するPrivate Managed OpenShift Clustersを提供します。

* [Amazon Elastic Container Service for Kubernetes](https://aws.amazon.com/eks/)は、マネージドなKubernetesサービスを提供します。

* [Azure Kubernetes Service](https://azure.microsoft.com/services/container-service/)は、マネージドなKubernetesクラスターを提供します。

* [Containership Kubernetes Engine (CKE)](https://containership.io/containership-platform) GCP、Azure、AWS、Packet、DigitalOceanでの直感的なKubernetesクラスターのプロビジョニングと管理。シームレスなバージョンアップグレード、自動スケーリング、メトリック、ワークロードの作成など。

* [DigitalOcean Kubernetes](https://www.digitalocean.com/products/kubernetes/)は、マネージドなKubernetesサービスを提供します。

* [Giant Swarm](https://giantswarm.io/product/)は、独自のデータセンター、オンプレミス、またはパブリッククラウド上にマネージドなKubernetesクラスターを提供します。

* [Google Kubernetes Engine](https://cloud.google.com/kubernetes-engine/)は、マネージドなKubernetesクラスターを提供します。

* [IBM Cloud Kubernetes Service](https://cloud.ibm.com/docs/containers?topic=containers-container_index#container_index)は、アイソレーションの選択、運用ツール、イメージとコンテナーへの統合されたセキュリティーのインサイト、およびWatson、IoT、データとの統合を備えたマネージドなKubernetesクラスターを提供します。

* [Kubermatic](https://www.loodse.com)は、AWSやDigital Oceanなどの様々なパブリッククラウド用のマネージドなKubernetesクラスターを提供するだけでなく、OpenStackと統合されたオンプレミスも提供します。

* [Kublr](https://kublr.com)は、AWS、Azure、GCP、およびオンプレミスで、エンタープライズ級の安全でスケーラブルで信頼性の高いKubernetesクラスターを提供します。すぐに使用可能なバックアップとディザスターリカバリ、集中管理されたマルチクラスターのログ記録とモニタリング、および組み込みのアラートが含まれます。

* [KubeSail](https://kubesail.com)は、簡単にKubernetesを試すことができる近道です。

* [Madcore.Ai](https://madcore.ai)は、AWSにKubernetesインフラストラクチャーをデプロイするためのDevOpsにフォーカスしたCLIツールです。マスター、スポットインスタンスを使ったオートスケーリンググループのノード、ingress-ssl-lego、Heapster、およびGrafana。

* [Nutanix Karbon](https://www.nutanix.com/products/karbon/)は、Kubernetesのプロビジョニング、運用、ライフサイクル管理を簡素化する、マルチクラスターで可用性の高いKubernetes管理および運用プラットフォームです。

* [OpenShift Dedicated](https://www.openshift.com/dedicated/)は、OpenShiftを搭載したマネージドなKubernetesクラスターを提供します。

* [OpenShift Online](https://www.openshift.com/features/)は、Kubernetesアプリケーションに無料のホストアクセスを提供します。

* [Oracle Container Engine for Kubernetes](https://docs.us-phoenix-1.oraclecloud.com/Content/ContEng/Concepts/contengoverview.htm)は、コンテナ化されたアプリケーションをクラウドにデプロイするために使用できる、フルマネージドかつスケーラブルで可用性の高いサービスです。

* [Platform9](https://platform9.com/products/kubernetes/)は、オンプレミスまたはパブリッククラウド上でマネージドなKubernetesを提供し、24時間365日のヘルスモニタリングとアラートを提供します。（Kube2goは、Web UIによって駆動されるKubernetesクラスターデプロイメントサービスであるPlatform9がリリースされ、Platform9 Sandboxに統合されました）

* [Stackpoint.io](https://stackpoint.io)は、複数のパブリッククラウドに対してKubernetesインフラストラクチャーの自動化と管理を提供します。

* [SysEleven MetaKube](https://www.syseleven.io/products-services/managed-kubernetes/)は、OpenStackのパブリッククラウドを基盤とするサービスとしてマネージドなKubernetesを提供します。ライフサイクル管理、管理ダッシュボード、モニタリング、自動スケーリングなどが含まれます。

* [VMware Cloud PKS](https://cloud.vmware.com/vmware-cloud-pks)は、VMware Cloud ServicesポートフォリオのエンタープライズのKubernetes-as-a-Serviceであり、使いやすく、デフォルトで安全、かつ費用対効果の高いSaaSベースのKubernetesクラスターを提供します。

## すぐに利用できるクラウドを使ったソリューション

これらのソリューションを使用すると、ほんの少しのコマンドで、様々なCloud IaaSプロバイダー上にKubernetesクラスターを作成できます。
これらのソリューションはアクティブに開発されており、またアクティブなコミュニティー支援を受けています。

* [Agile Stacks](https://www.agilestacks.com/products/kubernetes)
* [Alibaba Cloud](/docs/setup/turnkey/alibaba-cloud/)
* [APPUiO](https://appuio.ch)
* [AWS](/docs/setup/turnkey/aws/)
* [Azure](/docs/setup/turnkey/azure/)
* [CenturyLink Cloud](/docs/setup/turnkey/clc/)
* [Conjure-up Kubernetes with Ubuntu on AWS, Azure, Google Cloud, Oracle Cloud](/docs/getting-started-guides/ubuntu/)
* [Containership](https://containership.io/containership-platform)
* [Docker Enterprise](https://www.docker.com/products/docker-enterprise)
* [Gardener](https://gardener.cloud/)
* [Giant Swarm](https://giantswarm.io)
* [Google Compute Engine (GCE)](/docs/setup/turnkey/gce/)
* [IBM Cloud](https://github.com/patrocinio/kubernetes-softlayer)
* [Kontena Pharos](https://kontena.io/pharos/)
* [Kubermatic](https://cloud.kubermatic.io)
* [Kublr](https://kublr.com/)
* [Madcore.Ai](https://madcore.ai/)
* [Nirmata](https://nirmata.com/)
* [Nutanix Karbon](https://www.nutanix.com/products/karbon/)
* [Oracle Container Engine for K8s](https://docs.us-phoenix-1.oraclecloud.com/Content/ContEng/Concepts/contengprerequisites.htm)
* [Pivotal Container Service](https://pivotal.io/platform/pivotal-container-service)
* [Rancher 2.0](https://rancher.com/docs/rancher/v2.x/en/)
* [Stackpoint.io](/docs/setup/turnkey/stackpoint/)
* [Supergiant.io](https://supergiant.io/)
* [Tectonic by CoreOS](https://coreos.com/tectonic)
* [VMware Cloud PKS](https://cloud.vmware.com/vmware-cloud-pks)
* [VMware Enterprise PKS](https://cloud.vmware.com/vmware-enterprise-pks)

## すぐに利用できるオンプレミスを使ったソリューション
これらのソリューションは、内部の安全なクラウドネットワーク上にKubernetesクラスターをほんのわずかのコマンドで作成することを可能にします。

* [Agile Stacks](https://www.agilestacks.com/products/kubernetes)
* [APPUiO](https://appuio.ch)
* [Docker Enterprise](https://www.docker.com/products/docker-enterprise)
* [Giant Swarm](https://giantswarm.io)
* [GKE On-Prem | Google Cloud](https://cloud.google.com/gke-on-prem/)
* [IBM Cloud Private](https://www.ibm.com/cloud-computing/products/ibm-cloud-private/)
* [Kontena Pharos](https://kontena.io/pharos/)
* [Kubermatic](https://www.loodse.com)
* [Kublr](www.kublr.com/kubernetes.io/setup-hosted-solution)
* [Mirantis Cloud Platform](https://www.mirantis.com/software/kubernetes/)
* [Nirmata](https://nirmata.com/)
* [OpenShift Container Platform](https://www.openshift.com/products/container-platform/) (OCP) by [Red Hat](https://www.redhat.com)
* [Pivotal Container Service](https://pivotal.io/platform/pivotal-container-service)
* [Rancher 2.0](https://rancher.com/docs/rancher/v2.x/en/)
* [SUSE CaaS Platform](https://www.suse.com/products/caas-platform)
* [SUSE Cloud Application Platform](https://www.suse.com/products/cloud-application-platform/)
* [VMware Enterprise PKS](https://cloud.vmware.com/vmware-enterprise-pks)

## カスタムソリューション

Kubernetesは、幅広いクラウドプロバイダーやベアメタル環境、
そして多くの基本オペレーティングシステム上で実行できます。

もし以下のガイドからニーズに合ったものを見つけることができたなら、それを使ってください。
少し古くなっているかもしれませんが最初から始めるよりも簡単です。特別な要件があるため、
またはKubernetesクラスターの下にあるものを理解したいために最初から始める必要がある場合は、
[ゼロからのカスタムクラスターの作成](/ja/docs/setup/scratch/)を試してください。

### 全般

ホスティングリソースを設定する方法がすでにある場合は、
[kubeadm](/docs/setup/independent/create-cluster-kubeadm/)を使用して
マシン毎に単一のコマンドでクラスターを起動します。

### クラウド

これらのソリューションは、上記のソリューションでカバーされていないクラウドプロバイダーとオペレーティングシステムの組み合わせです。

* [Cloud Foundry Container Runtime (CFCR)](https://docs-cfcr.cfapps.io/)
* [CoreOS on AWS or GCE](/docs/setup/custom-cloud/coreos/)
* [Gardener](https://gardener.cloud/)
* [Kublr](www.kublr.com/kubernetes.io/setup-hosted-solution)
* [Kubernetes on Ubuntu](/docs/getting-started-guides/ubuntu/)
* [Kubespray](/docs/setup/custom-cloud/kubespray/)
* [Rancher Kubernetes Engine (RKE)](https://github.com/rancher/rke)
* [VMware Essential PKS](https://cloud.vmware.com/vmware-essential-PKS)

### オンプレミスの仮想マシン

* [Cloud Foundry Container Runtime (CFCR)](https://docs-cfcr.cfapps.io/)
* [CloudStack](/docs/setup/on-premises-vm/cloudstack/) (Ansible、CoreOSとflannelを使用します)
* [Fedora (Multi Node)](/docs/getting-started-guides/fedora/flannel_multi_node_cluster/) (Fedoraとflannelを使用します)
* [Nutanix AHV](https://www.nutanix.com/products/acropolis/virtualization/)
* [OpenShift Container Platform](https://www.openshift.com/products/container-platform/) (OCP) Kubernetes platform by [Red Hat](https://www.redhat.com)
* [oVirt](/docs/setup/on-premises-vm/ovirt/)
* [Vagrant](/docs/setup/custom-cloud/coreos/) (CoreOSとflannelを使用します)
* [VMware](/docs/setup/custom-cloud/coreos/) (CoreOSとflannelを使用します)
* [VMware Essential PKS](https://cloud.vmware.com/vmware-essential-PKS)
* [VMware vSphere](https://vmware.github.io/vsphere-storage-for-kubernetes/documentation/)
* [VMware vSphere, OpenStack, or Bare Metal](/docs/getting-started-guides/ubuntu/) (Juju、Ubuntuとflannelを使用します)

### ベアメタル

* [CoreOS](/docs/setup/custom-cloud/coreos/)
* [Digital Rebar](/docs/setup/on-premises-metal/krib/)
* [Docker Enterprise](https://www.docker.com/products/docker-enterprise)
* [Fedora (Single Node)](/docs/getting-started-guides/fedora/fedora_manual_config/)
* [Fedora (Multi Node)](/docs/getting-started-guides/fedora/flannel_multi_node_cluster/)
* [Kubernetes on Ubuntu](/docs/getting-started-guides/ubuntu/)
* [OpenShift Container Platform](https://www.openshift.com/products/container-platform/) (OCP) Kubernetes platform by [Red Hat](https://www.redhat.com)
* [VMware Essential PKS](https://cloud.vmware.com/vmware-essential-PKS)

### 統合

これらのソリューションは、サードパーティー製のスケジューラー、リソースマネージャー、および/または低レベルのプラットフォームとの統合を提供します。

* [DCOS](/docs/setup/on-premises-vm/dcos/)
  * Community Edition DCOSは、AWSを使用します
  * Enterprise Edition DCOSは、クラウドホスティング、オンプレミスのVM、およびベアメタルをサポートします

## ソリューションの表

以下は上記のソリューションすべての表です。

IaaS プロバイダー    | 構成管理     | OS     | ネットワーク| ドキュメント                                      | サポートレベル
-------------------- | ------------ | ------ | ----------  | ---------------------------------------------     | ----------------------------
any                  | any          | multi-support | any CNI | [docs](/docs/setup/independent/create-cluster-kubeadm/) | Project ([SIG-cluster-lifecycle](https://git.k8s.io/community/sig-cluster-lifecycle))
Google Kubernetes Engine |              |        | GCE         | [docs](https://cloud.google.com/kubernetes-engine/docs/) | Commercial
Docker Enterprise    | custom | [multi-support](https://success.docker.com/article/compatibility-matrix) | [multi-support](https://docs.docker.com/ee/ucp/kubernetes/install-cni-plugin/) | [docs](https://docs.docker.com/ee/) | Commercial
IBM Cloud Private  | Ansible  | multi-support  | multi-support  | [docs](https://www.ibm.com/support/knowledgecenter/SSBS6K/product_welcome_cloud_private.html) | [Commercial](https://www.ibm.com/mysupport/s/topic/0TO500000001o0fGAA/ibm-cloud-private?language=en_US&productId=01t50000004X1PWAA0) and [Community](https://www.ibm.com/support/knowledgecenter/SSBS6K_3.1.2/troubleshoot/support_types.html) |
Red Hat OpenShift    | Ansible & CoreOS | RHEL & CoreOS   | [multi-support](https://docs.openshift.com/container-platform/3.11/architecture/networking/network_plugins.html) | [docs](https://docs.openshift.com/container-platform/3.11/welcome/index.html) | Commercial
Stackpoint.io        |              | multi-support       | multi-support   | [docs](https://stackpoint.io/) | Commercial
AppsCode.com         | Saltstack    | Debian | multi-support | [docs](https://appscode.com/products/cloud-deployment/) | Commercial
Madcore.Ai           | Jenkins DSL  | Ubuntu | flannel     | [docs](https://madcore.ai)                        | Community ([@madcore-ai](https://github.com/madcore-ai))
Platform9        |              | multi-support | multi-support | [docs](https://platform9.com/managed-kubernetes/) | Commercial
Kublr       | custom       | multi-support | multi-support | [docs](http://docs.kublr.com/) | Commercial
Kubermatic       |              | multi-support | multi-support | [docs](http://docs.kubermatic.io/) | Commercial
IBM Cloud Kubernetes Service |               | Ubuntu | IBM Cloud Networking + Calico | [docs](https://cloud.ibm.com/docs/containers?topic=containers-container_index#container_index) | Commercial
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
IBM Cloud Kubernetes Service | | Ubuntu | calico | [docs](https://cloud.ibm.com/docs/containers?topic=containers-container_index#container_index) | Commercial
Digital Rebar        | kubeadm      | any    | metal       | [docs](/docs/setup/on-premises-metal/krib/)                                  | Community ([@digitalrebar](https://github.com/digitalrebar))
VMware Cloud PKS     |              | Photon OS | Canal | [docs](https://docs.vmware.com/en/VMware-Kubernetes-Engine/index.html) | Commercial
VMware Enterprise PKS     | BOSH       | Ubuntu | VMware NSX-T/flannel | [docs](https://docs.vmware.com/en/VMware-Enterprise-PKS/) | Commercial
Mirantis Cloud Platform | Salt | Ubuntu | multi-support | [docs](https://docs.mirantis.com/mcp/) | Commercial

{{< note >}}
上記の表はバージョンテスト/ノード内での使用順に並べられ、その後にサポートレベルが続きます。
{{< /note >}}

### カラムの定義

* **IaaSプロバイダー**は、Kubernetesが動作する仮想マシンまたは物理マシン（ノード）を提供する製品または組織です。
* **OS**は、ノードのベースのオペレーティングシステムです。
* **構成管理**は、ノードにKubernetesをインストール・保守するのに役立つ構成管理システムです。
* **ネットワーク**は、[ネットワークモデル](/docs/concepts/cluster-administration/networking/)を実装したものです。ネットワークタイプが、
  _none_ のものは、複数のノードをサポートしていない場合や、単一の物理ノードで複数のVMノードをサポートしている場合があります。
* **適合**は、この設定で作成されたクラスターが、Kubernetes v1.0.0のAPIおよび基本機能をサポートするためのプロジェクトの適合性テストに合格したかどうかを示します。
* **サポートレベル**
  * **プロジェクト**: Kubernetesのコミッターは通常この設定を使用しているため、ほとんどの場合Kubernetesの最新リリースで動作します。
  * **商用**: 独自のサポート契約がある商用製品。
  * **コミュニティー**: コミュニティーの貢献によって積極的にサポートされています。 Kubernetesの最近のリリースでは動作しない可能性があります。
  * **非アクティブ**: 積極的にメンテナンスされていません。初めてのKubernetesユーザーにはお勧めできません。削除される可能性があります。
* **注意事項**には、使用されているKubernetesのバージョンなど、その他の関連情報があります。

<!-- reference style links below here -->
<!-- GCE conformance test result -->
[1]: https://gist.github.com/erictune/4cabc010906afbcc5061
<!-- Vagrant conformance test result -->
[2]: https://gist.github.com/derekwaynecarr/505e56036cdf010bf6b6
<!-- Google Kubernetes Engine conformance test result -->
[3]: https://gist.github.com/erictune/2f39b22f72565365e59b

{{% /capture %}}
