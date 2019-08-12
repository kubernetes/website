---
no_issue: true
title: 시작하기
main_menu: true
weight: 20
content_template: templates/concept
card:
  name: setup
  weight: 20
  anchors:
  - anchor: "#학습-환경"
    title: 학습 환경
  - anchor: "#운영-환경"
    title: 운영 환경
---

{{% capture overview %}}

본 섹션에서는 쿠버네티스를 구축하고 실행하는 여러가지 옵션을 다룬다.

각각의 쿠버네티스 솔루션은 유지보수의 용이성, 보안, 제어, 가용 자원, 클러스터를 운영하고 관리하기 위해 필요한 전문성과 같은 제각각의 요구사항을 충족한다.

쿠버네티스 클러스터를 로컬 머신에, 클라우드에, 온-프레미스 데이터센터에 배포할 수 있고, 아니면 매니지드 쿠버네티스 클러스터를 선택할 수도 있다. 넓은 범위의 클라우드 프로바이더에 걸치거나 베어 메탈 환경을 사용하는 커스텀 솔루션을 만들 수도 있다.

더 간단하게 정리하면, 쿠버네티스 클러스터를 학습 환경과 운영 환경에 만들 수 있다.

{{% /capture %}}

{{% capture body %}}

## 학습 환경

쿠버네티스를 배우고 있다면, 쿠버네티스 커뮤니티에서 지원하는 도구나, 로컬 머신에서 쿠버네티스를 설치하기 위한 생태계 내의 도구와 같은 도커 기반의 솔루션을 사용하자.

{{< table caption="쿠버네티스를 배포하기 위해 커뮤니티와 생태계에서 지원하는 도구를 나열한 로컬 머신 솔루션 표." >}}

|커뮤니티              |생태계     |
| ------------       | --------     |
| [Minikube](/docs/setup/learning-environment/minikube/) | [CDK on LXD](https://www.ubuntu.com/kubernetes/docs/install-local) |
| [Kubeadm-dind](https://github.com/kubernetes-sigs/kubeadm-dind-cluster) | [Docker Desktop](https://www.docker.com/products/docker-desktop)|
| [Kubernetes IN Docker](https://github.com/kubernetes-sigs/kind) | [Minishift](https://docs.okd.io/latest/minishift/)|
|                     | [MicroK8s](https://microk8s.io/)|
|                     | [IBM Cloud Private-CE (Community Edition)](https://github.com/IBM/deploy-ibm-cloud-private) |
|                     | [IBM Cloud Private-CE (Community Edition) on Linux Containers](https://github.com/HSBawa/icp-ce-on-linux-containers)|
|                     | [k3s](https://k3s.io)|
|                     | [Ubuntu on LXD](/docs/getting-started-guides/ubuntu/)|


## 운영 환경

운영 환경을 위한 솔루션을 평가할 때에는, 쿠버네티스 클러스터 운영에 대한 어떤 측면(또는 _추상적인 개념_)을 스스로 관리하기를 원하는지, 제공자에게 넘기기를 원하는지 고려하자.

몇 가지 가능한 쿠버네티스 클러스터의 추상적인 개념은 {{< glossary_tooltip text="애플리케이션" term_id="applications" >}}, {{< glossary_tooltip text="데이터 플레인" term_id="data-plane" >}}, {{< glossary_tooltip text="컨트롤 플레인" term_id="control-plane" >}}, {{< glossary_tooltip text="클러스터 인프라스트럭처" term_id="cluster-infrastructure" >}}, 및 {{< glossary_tooltip text="클러스터 운영" term_id="cluster-operations" >}}이다.

다음의 다이어그램은 쿠버네티스 클러스터에 대해 가능한 추상적인 개념을 나열하고, 각 추상적인 개념을 사용자 스스로 관리하는지 제공자에 의해 관리되는지를 보여준다.

운영 환경 솔루션![운영 환경 솔루션](/images/docs/KubernetesSolutions.svg)

{{< table caption="제공자와 솔루션을 나열한 운영 환경 솔루션 표." >}}
다음 운영 환경 솔루션 표는 제공자와 솔루션을 나열한다.

|제공자  | 매니지드 | 턴키 클라우드  | 온-프렘(on-prem) 데이터센터  | 커스텀 (클라우드) | 커스텀 (온-프레미스 VMs)| 커스텀 (베어 메탈) |
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
| [Canonical](https://www.ubuntu.com/kubernetes/docs/quickstart)      |              | &#x2714;       |             | &#x2714;     |&#x2714;  | &#x2714;
| [Containership](https://containership.io/containership-platform)            | &#x2714;       |&#x2714;  |     |     |                   |
| [Digital Rebar](https://provision.readthedocs.io/en/tip/README.html)            |        |  |      |     |  | &#x2714;
| [DigitalOcean](https://www.digitalocean.com/products/kubernetes/)        | &#x2714;      |  |      |     |            |
| [Docker Enterprise](https://www.docker.com/products/docker-enterprise) |       |&#x2714;  | &#x2714;     |  |     | &#x2714;
| [Fedora (멀티 노드)](https://kubernetes.io/docs/getting-started-guides/fedora/flannel_multi_node_cluster/)     |      |  |      | |    &#x2714;       | &#x2714;
| [Fedora (단일 노드)](https://kubernetes.io/docs/getting-started-guides/fedora/fedora_manual_config/)     |      |  |      | |           | &#x2714;
| [Gardner](https://gardener.cloud/)       |              |&#x2714;  |         | &#x2714;   |          |
| [Giant Swarm](https://giantswarm.io/)     | &#x2714;       | &#x2714; |   &#x2714;    |     |
| [Google](https://cloud.google.com/)           |  [Google Kubernetes Engine (GKE)](https://cloud.google.com/kubernetes-engine/)       | [Google Compute Engine (GCE)](https://cloud.google.com/compute/)|[GKE On-Prem](https://cloud.google.com/gke-on-prem/)       |  |  |     |  |      |       |  |
| [IBM](https://www.ibm.com/in-en/cloud)        | [IBM Cloud Kubernetes Service](https://cloud.ibm.com/kubernetes/catalog/cluster)| |[IBM Cloud Private](https://www.ibm.com/in-en/cloud/private) | |
| [Ionos](https://www.ionos.com/enterprise-cloud)        | [Ionos Managed Kubernetes](https://www.ionos.com/enterprise-cloud/managed-kubernetes) | [Ionos Enterprise Cloud](https://www.ionos.com/enterprise-cloud) | |
| [Kontena Pharos](https://www.kontena.io/pharos/)          |    |&#x2714;|    &#x2714;    |        |         |
| [Kubermatic](https://www.loodse.com/)         |     &#x2714;  | &#x2714; | &#x2714;     |     |  |
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
| [Platform9](https://platform9.com/)         | &#x2714;             | &#x2714;      | &#x2714;            |      |   &#x2714;       |&#x2714;
| [Rancher](https://rancher.com/)         |              |   [Rancher 2.x](https://rancher.com/docs/rancher/v2.x/en/)     |             |  [Rancher Kubernetes Engine (RKE)](https://rancher.com/docs/rke/latest/en/)    |          | [k3s](https://k3s.io/)
| [StackPoint](https://stackpoint.io/)          | &#x2714;            |  &#x2714;      |             |      |          |
| [Supergiant](https://supergiant.io/)         |              |&#x2714;        |             |      |          |
| [SUSE](https://www.suse.com/)        |              | &#x2714;       |             |      |          |
| [SysEleven](https://www.syseleven.io/)         | &#x2714;             |        |             |      |          |
| [Tencent Cloud](https://intl.cloud.tencent.com/)  | [Tencent Kubernetes Engine](https://intl.cloud.tencent.com/product/tke) |   &#x2714;   |   &#x2714; |    |      |   &#x2714;  |
| [VEXXHOST](https://vexxhost.com/)         | &#x2714;             | &#x2714;      |             |      |          |
| [VMware](https://cloud.vmware.com/) | [VMware Cloud PKS](https://cloud.vmware.com/vmware-cloud-pks)              |[VMware Enterprise PKS](https://cloud.vmware.com/vmware-enterprise-pks)        |   [VMware Enterprise PKS](https://cloud.vmware.com/vmware-enterprise-pks)          | [VMware Essential PKS](https://cloud.vmware.com/vmware-essential-pks)      |          |[VMware Essential PKS](https://cloud.vmware.com/vmware-essential-pks)

{{% /capture %}}
