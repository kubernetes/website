---
reviewers:
- sieben
- perriea
- lledru
- awkif
- yastij
no_issue: true
title: Installation
main_menu: true
weight: 20
content_template: templates/concept
card:
  name: setup
  weight: 20
  anchors:
  - anchor: "#learning-environment"
    title:  Environnement d'apprentissage
  - anchor: "#production-environment"
    title:  Environnement de production  
---

{{% capture overview %}}

Utilisez cette page pour trouver le type de solution qui correspond le mieux à vos besoins.

Le choix de distribution Kubernetes dépend des ressources dont vous disposez et de la flexibilité dont vous avez besoin.
Vous pouvez exécuter Kubernetes presque partout, de votre ordinateur portable aux machines virtuelles d'un fournisseur de cloud jusqu'à un rack de serveurs en bare metal.

Tout simplement, vous pouvez créer un cluster Kubernetes dans un environnement d'apprentissage ou de production.

{{% /capture %}}

{{% capture body %}}

## Environnement d'apprentissage

Si vous voulez apprendre les concepts Kubernetes, vous pouvez utiliser les solutions basées sur Docker: des outils fournis par la communauté Kubernetes, ou des outils de l'écosystème pour installer un cluster Kubernetes sur une machine locale.

{{< table caption="Tableau des solutions locales qui liste les outils fournis par la communauté et l'écosystème pour déployer Kubernetes." >}}

|Communauté           |Écosystème     |
| ------------       | --------     |
| [Minikube](/docs/setup/learning-environment/minikube/) | [CDK on LXD](https://www.ubuntu.com/kubernetes/docs/install-local) |
| [kind (Kubernetes IN Docker)](https://github.com/kubernetes-sigs/kind) | [Docker Desktop](https://www.docker.com/products/docker-desktop)|
|                     | [Minishift](https://docs.okd.io/latest/minishift/)|
|                     | [MicroK8s](https://microk8s.io/)|
|                     | [IBM Cloud Private-CE (Community Edition)](https://github.com/IBM/deploy-ibm-cloud-private) |
|                     | [IBM Cloud Private-CE (Community Edition) on Linux Containers](https://github.com/HSBawa/icp-ce-on-linux-containers)|
|                     | [k3s](https://k3s.io)|
|                     | [Ubuntu on LXD](/docs/getting-started-guides/ubuntu/)|


## Environnement de production  

Lors de la rechercher d'un environnement de production, vous devez décider quelles sont les fonctionnalités de Kubernetes (ou les _abstractions_) que vous désirez administrer vous même ou déléguer à un fournisseur.

Des abstractions possibles d'un cluster Kubernetes sont les {{< glossary_tooltip text="applications" term_id="applications" >}}, le {{< glossary_tooltip text="data plane" term_id="data-plane" >}}, le {{< glossary_tooltip text="control plane" term_id="control-plane" >}}, l'{{< glossary_tooltip text="infrastructure du cluster" term_id="cluster-infrastructure" >}}, et les  {{< glossary_tooltip text="opération sur le cluster" term_id="cluster-operations" >}}.

Le diagramme suivant liste les abstractions possibles d'un cluster Kubernetes et si l'abstraction est hébergée ou administrée par un fournisseur.

Solutions d'environnement de production![Solutions d'environnement de production](/images/docs/KubernetesSolutions.svg)

{{< table caption="Le tableau des solutions d'environnement de production liste les fournisseurs et les solutions qu'ils proposent." >}}
Le tableau suivant de solutions d'environnement de production liste les fournisseurs et les solutions qu'ils proposent.

|Fournisseurs  | Hébergées | Clés en mains cloud  | Clés en main sur site  | Personnalisées (cloud) | Personnalisées (VMs sur site)| Personnalisées (Bare Metal) |
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
