---
no_issue: true
title: Od czego zacząć
main_menu: true
weight: 20
content_template: templates/concept
card:
  name: setup
  weight: 20
  anchors:
  - anchor: "#srodowisko-do-nauki"
    title: Środowisko do nauki
  - anchor: "#srodowisko-produkcyjne"
    title: Środowisko produkcyjne  
---

{{% capture overview %}}

Ten rozdział poświęcony jest różnym metodom konfiguracji i uruchomienia Kubernetesa.

Istnieje wiele rozwiązań dopasowanych do różnych potrzeb użytkowników: łatwości w utrzymaniu, wymagań bezpieczeństwa, poziomu sterowania, dostępności zasobów oraz niezbędnego doświadczenia do zarządzania klastrem.

Klaster Kubernetes możesz zainstalować na lokalnym komputerze, w chmurze czy w prywatnym centrum obliczeniowym albo skorzystać z klastra Kubernetes udostępnianego jako usługa. Inną możliwością jest budowa własnego rozwiązania opartego o różnych dostawców usług chmurowych, bądź bazującego bezpośrednio na sprzęcie fizycznym.

W dużym uproszczeniu, możesz zbudować klaster Kubernetes zarówno w środowisku szkoleniowym, jak i na potrzeby produkcyjne.

{{% /capture %}}

{{% capture body %}}

## Środowisko do nauki {#srodowisko-do-nauki}

Aby uruchomić klaster Kubernetes do nauki na lokalnym komputerze, skorzystaj z rozwiązań opartych o Dockera — z narzędzi wspieranych przez społeczność Kubernetesa, bądź innych narzędzi dostępnych w ekosystemie.

{{< table caption="Tabela z rozwiązaniami pozwalającymi na uruchomienie Kubernetesa na komputerze lokalnym - wspieranymi przez społeczność lub innymi dostępnymi w ekosystemie" >}}

|Społeczność           |Ekosystem     |
| ------------       | --------     |
| [Minikube](/docs/setup/learning-environment/minikube/) | [CDK on LXD](https://www.ubuntu.com/kubernetes/docs/install-local) |
| [kind (Kubernetes IN Docker)](https://github.com/kubernetes-sigs/kind) | [Docker Desktop](https://www.docker.com/products/docker-desktop)|
|                     | [Minishift](https://docs.okd.io/latest/minishift/)|
|                     | [MicroK8s](https://microk8s.io/)|
|                     | [IBM Cloud Private-CE (Community Edition)](https://github.com/IBM/deploy-ibm-cloud-private) |
|                     | [IBM Cloud Private-CE (Community Edition) on Linux Containers](https://github.com/HSBawa/icp-ce-on-linux-containers)|
|                     | [k3s](https://k3s.io)|
|                     | [Ubuntu on LXD](/docs/getting-started-guides/ubuntu/)|

## Środowisko produkcyjne {#srodowisko-produkcyjne}

Wybierając rozwiązanie dla środowiska produkcyjnego musisz zdecydować, którymi poziomami zarządzania klastrem (_abstrakcjami_) chcesz zajmować się sam, a które będą realizowane po stronie zewnętrznego operatora.

Przykładowe poziomy abstrakcji klastra Kubernetesa to: {{< glossary_tooltip text="aplikacje" term_id="applications" >}}, {{< glossary_tooltip text="warstwa danych" term_id="data-plane" >}}, {{< glossary_tooltip text="warstwa sterowania" term_id="control-plane" >}}, {{< glossary_tooltip text="infrastruktura klastra" term_id="cluster-infrastructure" >}} i {{< glossary_tooltip text="operacje na klastrze" term_id="cluster-operations" >}}.

Poniższy schemat pokazuje poszczególne poziomy abstrakcji klastra Kubernetes oraz informacje, kto jest za nie odpowiedzialny (sam użytkownik czy zewnętrzny operator).

Rozwiązania dla środowisk produkcyjnych![Rozwiązania dla środowisk produkcyjnych](/images/docs/KubernetesSolutions.svg)

{{< table caption="Tabela z dostawcami i rozwiązaniami dla środowisk produkcyjnych." >}}
Poniższa tabela zawiera przegląd dostawców środowisk produkcyjnych i rozwiązań, które oferują.

|Dostawca  | Zarządzana | Chmura "pod klucz"  | Prywatne centrum danych  | Własne (w chmurze) | Własne (VM lokalne)| Własne (Bare Metal) |
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
| [OpenShift](https://www.openshift.com)          |[OpenShift Dedicated](https://www.openshift.com/products/dedicated/) i [OpenShift Online](https://www.openshift.com/products/online/)              |        | [OpenShift Container Platform](https://www.openshift.com/products/container-platform/)            |      |  [OpenShift Container Platform](https://www.openshift.com/products/container-platform/)        |[OpenShift Container Platform](https://www.openshift.com/products/container-platform/)
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
