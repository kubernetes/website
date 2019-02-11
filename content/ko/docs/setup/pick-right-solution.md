---
title: 알맞은 솔루션 선정
weight: 10
content_template: templates/concept
---

{{% capture overview %}}

쿠버네티스는 랩탑부터 클라우드 공급자의 VM들, 베어메탈 서버 랙까지 다양한 플랫폼에서 작동 가능하다.
클러스터 구성을 위해 필요한 노력은 하나의 단일 명령어를 실행시키는 수준에서 직접 자신만의 맞춤형 클러스터를 세밀하게 만드는 수준에 이르기까지 다양하다.
알맞은 솔루션을 선택하기 위해서 이 가이드를 사용하자.

쿠버네티스를 시도해보기를 원한다면, [로컬 Docker 기반의 솔루션](#로컬-머신-솔루션)을 사용하자. 

더 많은 머신과 높은 가용성으로 확장할 준비가 되었다면, [호스트 된 솔루션](#호스트-된-솔루션)이 생성하고 유지하기에 가장 쉽다. 

[턴키 클라우드 솔루션](#턴키-클라우드-솔루션)은 클라우드 공급자들의 넓은 범위를 다루고 생성하기 위해서 약간의 명령어가 필요하다.
[온-프레미스 턴키 클라우드 솔루션](#온-프레미스-턴키-클라우드-솔루션)은 프라이빗 네트워크의 보안과 결합된 턴키 클라우드 솔루션의 단순함을 가진다.

호스팅한 자원을 구성하는 방법을 이미 가지고 있다면, 머신 당 단일 명령어로 클러스터를 만들어내기 위해서 [kubeadm](/docs/setup/independent/create-cluster-kubeadm/)을 사용하자.

[사용자 지정 솔루션](#사용자-지정-솔루션)은 단계별 지침부터 쿠버네티스 클러스터를 처음부터 설정하기 위한 일반적인 조언까지 다양하다. 

{{% /capture %}}

{{% capture body %}}

## 로컬 머신 솔루션

* [Minikube](/docs/setup/minikube/)는 개발과 테스트를 위한 단일 노드 쿠버네티스 클러스터를 로컬에 생성하기 위한 하나의 방법이다. 설치는 완전히 자동화 되어 있고, 클라우드 공급자 계정 정보가 필요하지 않다. 

* [Minishift](https://docs.okd.io/latest/minishift/)는 커뮤니티 버전의 쿠버네티스 엔터프라이즈 플랫폼 OpenShift를 로컬 개발과 테스트 용으로 설치한다. Windows, macOS와 리눅스를 위한 All-In-One VM (`minishift start`)과 컨테이너 기반의 `oc cluster up` (리눅스 전용)을 지원하고 [쉬운 설치가 가능한 몇 가지 애드온도 포함](https://github.com/minishift/minishift-addons/tree/master/add-ons)한다.

* [microk8s](https://microk8s.io/)는 개발과 테스트를 위한 쿠버네티스 최신 버전을 단일 명령어로 로컬 머신 상의 설치를 제공한다. 설치는 신속하고 빠르며(~30초) 단일 명령어로 Istio를 포함한 많은 플러그인을 지원한다. 

* [IBM Cloud Private-CE (Community Edition)](https://github.com/IBM/deploy-ibm-cloud-private)는 개발과 테스트 시나리오를 위해 1개 또는 더 많은 VM에 쿠버네티스를 배포하기 위해서 머신의 VirtualBox를 사용할 수 있다. 이는 전체 멀티 노드 클러스터로 확장할 수 있다. 

* [IBM Cloud Private-CE (Community Edition) on Linux Containers](https://github.com/HSBawa/icp-ce-on-linux-containers)는 Terraform/Packer/BASH 기반의 리눅스 호스트 상의 LXD 클러스터에 7개의 노드(부트 1개, 마스터 1개, 관리 1개, 프록시 1개 그리고 워커 3개)를 생성하기 위한 Infrastructure as Code (IaC) 스크립트이다.

* [Kubeadm-dind](https://github.com/kubernetes-sigs/kubeadm-dind-cluster)는 하나의 docker 데몬이 필요한 멀티 노드 쿠버네티스 클러스터이다.(minikube는 단일 노드이다.) 클러스터 생성을 위해서 docker-in-docker 기술을 사용한다. 

* [Ubuntu on LXD](/docs/getting-started-guides/ubuntu/local/)는 로컬 호스트에서 9개의 인스턴스 배포를 지원한다.

## 호스트 된 솔루션

* [AppsCode.com](https://appscode.com/products/cloud-deployment/)는 AWS와 Google Cloud Platform을 포함하여 다양한 퍼블릭 클라우드의 관리형 쿠버네티스 클러스터를 제공한다.

* [APPUiO](https://appuio.ch)는 쿠버네티스 워크로드를 지원하는 OpenShift 퍼블릭 클라우드 플랫폼을 구동한다. 게다가 APPUiO는 퍼블릭 또는 프라이빗 클라우드에서 구동 중인 프라이빗 OpenShift 클러스터 관리를 제공한다.

* [Amazon Elastic Container Service for Kubernetes](https://aws.amazon.com/eks/)는 관리형 쿠버네티스 서비스를 제공한다. 

* [Azure Kubernetes Service](https://azure.microsoft.com/services/container-service/)는 관리형 쿠버네티스 클러스터를 제공한다. 

* [Containership Kubernetes Engine (CKE)](https://containership.io/containership-platform)는 GCP, Azure, AWS, Packet과 DigitalOcean 상에서 직관적인 쿠버네티스 클러스터 프로비저닝과 관리 기능을 제공한다. 매끄러운 버전 업그레이드, 오토스케일링, 메트릭, 워크로드 생성 등을 지원한다.

* [DigitalOcean Kubernetes](https://www.digitalocean.com/products/kubernetes/) 관리형 쿠버네티스 서비스를 제공한다.

* [Giant Swarm](https://giantswarm.io/product/)은 온-프레미스 또는 퍼블릭 클라우드 데이터센터 내에서 관리형 쿠버네티스 클러스터를 제공한다. 

* [Google Kubernetes Engine](https://cloud.google.com/kubernetes-engine/)은 관리형 쿠버네티스 클러스터를 제공한다.

* [IBM Cloud Kubernetes Service](https://console.bluemix.net/docs/containers/container_index.html)는 관리형 쿠버네티스 클러스터를 제공한다. 그와 함께 격리 종류, 운영 도구, 이미지와 컨테이너 통합된 보안 통찰력, Watson, IoT, 데이터와의 통합도 제공한다. 

* [Kubermatic](https://www.loodse.com)는 AWS와  Digital Ocean을 포함한 다양한 퍼블릭 클라우드뿐만 아니라 온-프레미스 상의 OpenStack 통합을 위한 관리형 쿠버네티스 클러스터를 제공한다.

* [Kublr](https://kublr.com)는 AWS, Azure, GCP 및 온-프레미스에서 기업 수준의 안전하고, 확장 가능하며, 신뢰성 높은 쿠버네티스 클러스터를 제공한다. 여기에는 즉시 사용 가능한 백업 및 재해 복구, 중앙 집중식 다중 클러스터 로깅 및  모니터링, 내장 경고 서비스가 포함된다.

* [Madcore.Ai](https://madcore.ai)는 AWS에서 쿠버네티스 인프라를 배포하기 위한 devops 중심의 CLI 도구이다. 또한 마스터, 스팟 인스턴스 그룹 노드 오토-스케일링, ingress-ssl-lego, Heapster, Grafana를 지원한다.

* [OpenShift Dedicated](https://www.openshift.com/dedicated/)는 OpenShift의 관리형 쿠버네티스 클러스터를 제공한다.

* [OpenShift Online](https://www.openshift.com/features/)은 쿠버네티스 애플리케이션을 위해 호스트 된 무료 접근을 제공한다. 

* [Oracle Container Engine for Kubernetes](https://docs.us-phoenix-1.oraclecloud.com/Content/ContEng/Concepts/contengoverview.htm)는 컨테이너 애플리케이션을 클라우드에 배포하는 데 사용할 수 있는 완벽하게 관리되고, 확장 가능하며, 가용성이 높은 서비스이다.

* [Platform9](https://platform9.com/products/kubernetes/)는 온-프레미스 또는 모든 퍼블릭 클라우드에서 관리형 쿠버네티스를 제공한다. 또한, 24/7 상태 모니터링 및 알람 및 경고 서비스를 제공한다.(Kube2go는 웹 UI 기반의 쿠버네티스 클러스터 배포 서비스인 Platform9가 Platform9 Sandbox에 통합된 형태로 출시되었다.)

* [Stackpoint.io](https://stackpoint.io)는 다중 퍼블릭 클라우드에서 쿠버네티스 인프라 자동화 및 관리 기능을 제공한다.

* [SysEleven MetaKube](https://www.syseleven.io/products-services/managed-kubernetes/)는 자체 OpenStack 퍼블릭 클라우드 상에서 서비스로써 관리형 쿠버네티스를 제공한다. 라이프사이클 관리, 관리 대시보드, 모니터링, 오토스케일링과 그 밖에 많은 기능을 포함한다.

* [VMware Cloud PKS](https://cloud.vmware.com/vmware-cloud-pks)는 사용하기 쉽고, 기본적으로 안전하며, 비용 효율적인 SaaS 기반의 쿠버네티스 클러스터를 제공하는 VMWare 클라우드 서비스 포트폴리오의 엔터프라이즈 Kubernetes-as-a-Service 오퍼링이다.

## 턴키 클라우드 솔루션

다음 솔루션들은 클라우드 IaaS 공급자의 범위에서 몇 안 되는 명령어로 쿠버네티스 클러스터를 생성을 허용한다. 이러한 솔루션은 활발히 개발되었고 활발한 커뮤니티 지원을 한다. 

* [Agile Stacks](https://www.agilestacks.com/products/kubernetes)
* [Alibaba Cloud](/docs/setup/turnkey/alibaba-cloud/)
* [APPUiO](https://appuio.ch)
* [AWS](/docs/setup/turnkey/aws/)
* [Azure](/docs/setup/turnkey/azure/)
* [CenturyLink Cloud](/docs/setup/turnkey/clc/)
* [Conjure-up Kubernetes with Ubuntu on AWS, Azure, Google Cloud, Oracle Cloud](/docs/getting-started-guides/ubuntu/)
* [Containership](https://containership.io/containership-platform)
* [Gardener](https://gardener.cloud/)
* [Google Compute Engine (GCE)](/docs/setup/turnkey/gce/)
* [IBM Cloud](https://github.com/patrocinio/kubernetes-softlayer)
* [Kontena Pharos](https://kontena.io/pharos/)
* [Kubermatic](https://cloud.kubermatic.io)
* [Kublr](https://kublr.com/)
* [Madcore.Ai](https://madcore.ai/)
* [Nirmata](https://nirmata.com/)
* [Oracle Container Engine for K8s](https://docs.us-phoenix-1.oraclecloud.com/Content/ContEng/Concepts/contengprerequisites.htm)
* [Pivotal Container Service](https://pivotal.io/platform/pivotal-container-service)
* [Giant Swarm](https://giantswarm.io)
* [Rancher 2.0](https://rancher.com/docs/rancher/v2.x/en/)
* [Stackpoint.io](/docs/setup/turnkey/stackpoint/)
* [Tectonic by CoreOS](https://coreos.com/tectonic)

## 온-프레미스 턴키 클라우드 솔루션

다음 솔루션들은 몇 안 되는 명령어를 사용하여 내부의 안전한 클라우드 네트워크에서 쿠버네티스 클러스터를 생성할 수 있다.

* [Agile Stacks](https://www.agilestacks.com/products/kubernetes)
* [APPUiO](https://appuio.ch)
* [GKE On-Prem | Google Cloud](https://cloud.google.com/gke-on-prem/)
* [IBM Cloud Private](https://www.ibm.com/cloud-computing/products/ibm-cloud-private/)
* [Kontena Pharos](https://kontena.io/pharos/)
* [Kubermatic](https://www.loodse.com)
* [Kublr](https://kublr.com/)
* [Nirmata](https://nirmata.com/)
* [OpenShift Container Platform](https://www.openshift.com/products/container-platform/) (OCP) by [Red Hat](https://www.redhat.com)
* [Pivotal Container Service](https://pivotal.io/platform/pivotal-container-service)
* [Giant Swarm](https://giantswarm.io)
* [Rancher 2.0](https://rancher.com/docs/rancher/v2.x/en/)
* [SUSE CaaS Platform](https://www.suse.com/products/caas-platform)
* [SUSE Cloud Application Platform](https://www.suse.com/products/cloud-application-platform/)

## 사용자 지정 솔루션

쿠버네티스는 넓은 범위의 클라우드 공급자와 베어메탈 환경에서, 그리고 많은 기반 운영 체제에서 동작할 수 있다.

필요에 맞는 가이드를 아래에서 찾았다면, 그것을 사용하자. 약간 구식일 수도 있지만, 처음부터 시작하는 것보다 더 쉬울 것이다. 
특별한 요구사항이 있기 때문에, 또는 단지 쿠버네티스 클러스터의 아래에 무엇이 있는지를 이해하기 원하기 때문에 
처음부터 시작하기를 원한다면, [맨 처음부터 시작하기](/docs/setup/scratch/) 가이드를 시도하라. 

새로운 플랫폼에서 쿠버네티스 지원하는 것에 관심이 있다면, [Writing a Getting Started Guide](https://git.k8s.io/community/contributors/devel/writing-a-getting-started-guide.md) 가이드를 참고하라. 

### 일반

호스팅한 리소스를 구성하는 방법을 이미 알고 있다면, [kubeadm](/docs/setup/independent/create-cluster-kubeadm/)을 사용하면 머신당 단일 명령어로 쉽게 클러스터를 가지고 올 수 있다. 

### 클라우드

다음 솔루션은 위의 솔루션에서 다루지 않는 클라우드 공급자와 운영체제의 조합이다. 

* [CoreOS on AWS or GCE](/docs/setup/custom-cloud/coreos/)
* [Gardener](https://gardener.cloud/)
* [Kublr](https://kublr.com/)
* [Kubernetes on Ubuntu](/docs/getting-started-guides/ubuntu/)
* [Kubespray](/docs/setup/custom-cloud/kubespray/)
* [Rancher Kubernetes Engine (RKE)](https://github.com/rancher/rke)

### 온-프레미스 VM

* [CloudStack](/docs/setup/on-premises-vm/cloudstack/) (Ansible, CoreOS와 flannel를 사용)
* [Fedora (Multi Node)](/docs/getting-started-guides/fedora/flannel_multi_node_cluster/) (Fedora와 flannel를 사용)
* [OpenShift Container Platform](https://www.openshift.com/products/container-platform/) (OCP) Kubernetes platform by [Red Hat](https://www.redhat.com)
* [oVirt](/docs/setup/on-premises-vm/ovirt/)
* [Vagrant](/docs/setup/custom-cloud/coreos/) (CoreOS와 flannel를 사용)
* [VMware](/docs/setup/custom-cloud/coreos/) (CoreOS와 flannel를 사용)
* [VMware vSphere](https://vmware.github.io/vsphere-storage-for-kubernetes/documentation/)
* [VMware vSphere, OpenStack, or Bare Metal](/docs/getting-started-guides/ubuntu/) (Juju, Ubuntu와 flannel를 사용)

### 베어 메탈

* [CoreOS](/docs/setup/custom-cloud/coreos/)
* [Digital Rebar](/docs/setup/on-premises-metal/krib/)
* [Fedora (Single Node)](/docs/getting-started-guides/fedora/fedora_manual_config/)
* [Fedora (Multi Node)](/docs/getting-started-guides/fedora/flannel_multi_node_cluster/)
* [Kubernetes on Ubuntu](/docs/getting-started-guides/ubuntu/)
* [OpenShift Container Platform](https://www.openshift.com/products/container-platform/) (OCP) Kubernetes platform by [Red Hat](https://www.redhat.com)

### 통합

다음 솔루션들은 타사 스케줄러, 자원 관리자, 낮은 레벨의 플랫폼의 통합을 제공한다.

* [DCOS](/docs/setup/on-premises-vm/dcos/)
  * Community Edition DCOS는 AWS를 사용한다.
  * Enterprise Edition DCOS는 클라우드 호스팅, 온-프레미스 VM, 베어메탈을 지원한다.

## 솔루션 표

아래는 위에 리스트 된 모든 솔루션의 표이다.

IaaS 공급자        | 구성 관리 | OS     | 네트워킹  | 문서                                              | 지원 레벨
-------------------- | ------------ | ------ | ----------  | ---------------------------------------------     | ----------------------------
any                  | any          | multi-support | any CNI | [docs](/docs/setup/independent/create-cluster-kubeadm/) | Project ([SIG-cluster-lifecycle](https://git.k8s.io/community/sig-cluster-lifecycle))
Google Kubernetes Engine |              |        | GCE         | [docs](https://cloud.google.com/kubernetes-engine/docs/) | Commercial
Red Hat OpenShift    | Ansible & CoreOS | RHEL & CoreOS   | [multi-support](https://docs.openshift.com/container-platform/3.11/architecture/networking/network_plugins.html) | [docs](https://docs.openshift.com/container-platform/3.11/welcome/index.html) | Commercial
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
any                  | any          | any    | any         | [docs](/docs/setup/scratch/)                                |  Community ([@erictune](https://github.com/erictune))
any                  | any          | any    | any         | [docs](http://docs.projectcalico.org/v2.2/getting-started/kubernetes/installation/)                                |  Commercial and Community
any                  | RKE          | multi-support    | flannel or canal         | [docs](https://rancher.com/docs/rancher/v2.x/en/quick-start-guide/)                                |  [Commercial](https://rancher.com/what-is-rancher/overview/) and [Community](https://github.com/rancher/rancher)
any                  | [Gardener Cluster-Operator](https://kubernetes.io/blog/2018/05/17/gardener/) | multi-support | multi-support | [docs](https://gardener.cloud) | [Project/Community](https://github.com/gardener) and [Commercial]( https://cloudplatform.sap.com/)
Alibaba Cloud Container Service For Kubernetes | ROS        | CentOS | flannel/Terway       | [docs](https://www.aliyun.com/product/containerservice)                    |  Commercial
Agile Stacks       | Terraform   | CoreOS | multi-support | [docs](https://www.agilestacks.com/products/kubernetes) | Commercial
IBM Cloud Kubernetes Service | | Ubuntu | calico | [docs](https://console.bluemix.net/docs/containers/container_index.html) | Commercial
Digital Rebar        | kubeadm      | any    | metal       | [docs](/docs/setup/on-premises-metal/krib/)                                  | Community ([@digitalrebar](https://github.com/digitalrebar))
VMware Cloud PKS     |              | Photon OS | Canal | [docs](https://docs.vmware.com/en/VMware-Kubernetes-Engine/index.html) | Commercial

{{< note >}}
위의 표는 버전 테스트/사용된 노드의 지원 레벨을 기준으로 정렬된다.
{{< /note >}}

### 열 정의

* **IaaS 공급자**는 쿠버네티스가 구동되는 가상 또는 물리적 머신(노드)를 제공하는 제품 또는 조직이다.
* **OS**는 노드의 기본 운영 체제이다.
* **구성 관리**는 노드에서 쿠버네티스를 설치하고 유지 관리하는 데 도움이 되는 구성 관리 시스템이다.
  nodes.
* **네트워킹**은 [네트워킹 모델](/docs/concepts/cluster-administration/networking/)을 구현하는 것이다. 네트워크 유형이
  _none_인 노드는 단일 노드 이상을 지원하지 않거나, 단일 물리 노드에서 여러 VM 노드를 지원할 수 있다. 
* **적합성**은 명시된 구성으로 생성된 클러스터가 쿠버네티스 v1.0.0의 API 및 기본 기능을 지원하는지의 프로젝트 적합성 테스트 통과 여부를 나타낸다.
* **지원 레벨**
  * **프로젝트**: 쿠버네티스 커미터는 현재 구성을 정기적으로 사용하므로, 일반적으로 최신 쿠버네티스 릴리즈와 함께 동작한다. 
  * **상업용**: 자체 지원 계약을 가진 상업용 제품.
  * **커뮤니티**: 커뮤니티 기여를 바탕으로 활발하게 지원. 쿠버네티스 최신 릴리즈에는 작동하지 않을 수도 있다.
  * **비활성**: 현재 유지되지 않는다. 쿠버네티스 최초 사용자에게 권장하지 않으며, 삭제될 수도 있다.
* **참고**는 사용된 쿠버네티스 버전 같은 기타 관련 정보가 있다.

<!-- reference style links below here -->
<!-- GCE conformance test result -->
[1]: https://gist.github.com/erictune/4cabc010906afbcc5061
<!-- Vagrant conformance test result -->
[2]: https://gist.github.com/derekwaynecarr/505e56036cdf010bf6b6
<!-- Google Kubernetes Engine conformance test result -->
[3]: https://gist.github.com/erictune/2f39b22f72565365e59b

{{% /capture %}}
