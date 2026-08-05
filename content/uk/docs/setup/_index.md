---
reviewers:
- brendandburns
- erictune
- mikedanese
no_issue: true
title: Початок роботи
main_menu: true
weight: 20
content_type: concept
card:
  name: setup
  weight: 20
  anchors:
  - anchor: "#навчальне-середовище"
    title: Навчальне середовище
  - anchor: "#прод-оточення"
    title: Прод оточення
---

<!-- overview -->

<!--This section covers different options to set up and run Kubernetes.
-->
У цьому розділі розглянуто різні варіанти налаштування і запуску Kubernetes.

<!--Different Kubernetes solutions meet different requirements: ease of maintenance, security, control, available resources, and expertise required to operate and manage a cluster.
-->
Різні рішення Kubernetes відповідають різним вимогам: легкість в експлуатації, безпека, система контролю, наявні ресурси та досвід, необхідний для управління кластером.

<!--You can deploy a Kubernetes cluster on a local machine, cloud, on-prem datacenter; or choose a managed Kubernetes cluster. You can also create custom solutions across a wide range of cloud providers, or bare metal environments.
-->
Ви можете розгорнути Kubernetes кластер на робочому комп'ютері, у хмарі чи в локальному дата-центрі, або обрати керований Kubernetes кластер. Також можна створити індивідуальні рішення на базі різних провайдерів хмарних сервісів або на звичайних серверах.

<!--More simply, you can create a Kubernetes cluster in learning and production environments.
-->
Простіше кажучи, ви можете створити Kubernetes кластер у навчальному і в прод оточеннях.



<!-- body -->

<!--## Learning environment
-->

## Навчальне оточення {#навчальне-оточення}

<!--If you're learning Kubernetes, use the Docker-based solutions: tools supported by the Kubernetes community, or tools in the ecosystem to set up a Kubernetes cluster on a local machine.
-->
Для вивчення Kubernetes використовуйте рішення на базі Docker: інструменти, підтримувані спільнотою Kubernetes, або інші інструменти з сімейства проектів для налаштування Kubernetes кластера на локальному комп'ютері.

{{< table caption="Таблиця інструментів для локального розгортання Kubernetes, які підтримуються спільнотою або входять до сімейства проектів Kubernetes." >}}

|Спільнота           |Сімейство проектів     |
| ------------       | --------     |
| [Minikube](/docs/setup/learning-environment/minikube/) | [CDK on LXD](https://www.ubuntu.com/kubernetes/docs/install-local) |
| [kind (Kubernetes IN Docker)](https://github.com/kubernetes-sigs/kind) | [Docker Desktop](https://www.docker.com/products/docker-desktop)|
|                     | [Minishift](https://docs.okd.io/latest/minishift/)|
|                     | [MicroK8s](https://microk8s.io/)|
|                     | [IBM Cloud Private-CE (Community Edition)](https://github.com/IBM/deploy-ibm-cloud-private) |
|                     | [IBM Cloud Private-CE (Community Edition) on Linux Containers](https://github.com/HSBawa/icp-ce-on-linux-containers)|
|                     | [k3s](https://k3s.io)|
{{< /table >}}


## Прод оточення {#прод-оточення}

<!--When evaluating a solution for a production environment, consider which aspects of operating a Kubernetes cluster (or _abstractions_) you want to manage yourself or offload to a provider.
-->
Обираючи рішення для проду, визначіться, якими з функціональних складових (або абстракцій) Kubernetes кластера ви хочете керувати самі, а управління якими - доручити провайдеру.

<!--Some possible abstractions of a Kubernetes cluster are {{< glossary_tooltip text="applications" term_id="applications" >}}, {{< glossary_tooltip text="data plane" term_id="data-plane" >}}, {{< glossary_tooltip text="control plane" term_id="control-plane" >}}, {{< glossary_tooltip text="cluster infrastructure" term_id="cluster-infrastructure" >}}, and {{< glossary_tooltip text="cluster operations" term_id="cluster-operations" >}}.
-->
У Kubernetes кластері можливі наступні абстракції: {{< glossary_tooltip text="застосунки" term_id="applications" >}}, {{< glossary_tooltip text="площина даних" term_id="data-plane" >}}, {{< glossary_tooltip text="площина управління" term_id="control-plane" >}}, {{< glossary_tooltip text="інфраструктура кластера" term_id="cluster-infrastructure" >}} та {{< glossary_tooltip text="операції з кластером" term_id="cluster-operations" >}}.

<!--The following diagram lists the possible abstractions of a Kubernetes cluster and whether an abstraction is self-managed or managed by a provider.
-->
На діаграмі нижче показані можливі абстракції Kubernetes кластера із зазначенням, які з них потребують самостійного управління, а які можуть бути керовані провайдером.

Рішення для прод оточення![Рішення для прод оточення](/images/docs/KubernetesSolutions.svg)

{{< table caption="Таблиця рішень для прод оточення містить перелік провайдерів і їх технологій." >}}
<!--The following production environment solutions table lists the providers and the solutions that they offer.
-->
Таблиця рішень для прод оточення містить перелік провайдерів і технологій, які вони пропонують.

|Провайдери  | Керований сервіс | Хмара "під ключ"  | Локальний дата-центр  | Під замовлення (хмара) | Під замовлення (локальні ВМ)| Під замовлення (сервери без ОС) |
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
| [Gardener](https://gardener.cloud/) | &#x2714; | &#x2714; | &#x2714; | &#x2714; | &#x2714; | [Custom Extensions](https://github.com/gardener/gardener/blob/master/docs/extensions/overview.md) |
| [Giant Swarm](https://www.giantswarm.io/)     | &#x2714;       | &#x2714; |   &#x2714;    |     |
| [Google](https://cloud.google.com/)           |  [Google Kubernetes Engine (GKE)](https://cloud.google.com/kubernetes-engine/)       | [Google Compute Engine (GCE)](https://cloud.google.com/compute/)|[GKE On-Prem](https://cloud.google.com/gke-on-prem/)       |  |  |     |  |      |       |  |
| [Hidora](https://hidora.com/)           |  &#x2714;       | &#x2714;| &#x2714;       |  |  |     |  |      |       |  |
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
| [NetApp Kubernetes Service (NKS)](https://cloud.netapp.com/kubernetes-service) | &#x2714; | &#x2714; | &#x2714; |  |  |
| [Nirmata](https://www.nirmata.com/)          |              |   &#x2714;     | &#x2714;            |      |          |
| [Nutanix](https://www.nutanix.com/en)         | [Nutanix Karbon](https://www.nutanix.com/products/karbon)             | [Nutanix Karbon](https://www.nutanix.com/products/karbon)       |             |      | [Nutanix AHV](https://www.nutanix.com/products/acropolis/virtualization)         |
| [OpenNebula](https://www.opennebula.org)          |[OpenNebula Kubernetes](https://marketplace.opennebula.systems/docs/service/kubernetes.html)              |        |            |      |   |
| [OpenShift](https://www.openshift.com)          |[OpenShift Dedicated](https://www.openshift.com/products/dedicated/) and [OpenShift Online](https://www.openshift.com/products/online/)              |        | [OpenShift Container Platform](https://www.openshift.com/products/container-platform/)            |      |  [OpenShift Container Platform](https://www.openshift.com/products/container-platform/)        |[OpenShift Container Platform](https://www.openshift.com/products/container-platform/)
| [Oracle Cloud Infrastructure Container Engine for Kubernetes (OKE)](https://docs.cloud.oracle.com/iaas/Content/ContEng/Concepts/contengoverview.htm)          | &#x2714;             |   &#x2714;     |             |      |          |
| [oVirt](https://www.ovirt.org/)         |              |        |             |     | &#x2714;          |
| [Pivotal](https://pivotal.io/) | | [Enterprise Pivotal Container Service (PKS)](https://pivotal.io/platform/pivotal-container-service) | [Enterprise Pivotal Container Service (PKS)](https://pivotal.io/platform/pivotal-container-service)           |      |          |
| [Platform9](https://platform9.com/)         | [Platform9 Managed Kubernetes](https://platform9.com/managed-kubernetes/)             |       | [Platform9 Managed Kubernetes](https://platform9.com/managed-kubernetes/)            |  &#x2714;    |  &#x2714;    |   &#x2714;
| [Rancher](https://rancher.com/)         |              |   [Rancher 2.x](https://rancher.com/docs/rancher/v2.x/en/)     |             |  [Rancher Kubernetes Engine (RKE)](https://rancher.com/docs/rke/latest/en/)    |          | [k3s](https://k3s.io/)
| [Supergiant](https://supergiant.io/)         |              |&#x2714;        |             |      |          |
| [SUSE](https://www.suse.com/)        |              | &#x2714;       |             |      |          |
| [SysEleven](https://www.syseleven.io/)         | &#x2714;             |        |             |      |          |
| [Tencent Cloud](https://intl.cloud.tencent.com/)  | [Tencent Kubernetes Engine](https://intl.cloud.tencent.com/product/tke) |   &#x2714;   |   &#x2714; |    |      |   &#x2714;  |
| [VEXXHOST](https://vexxhost.com/)         | &#x2714;             | &#x2714;      |             |      |          |
| [VMware](https://cloud.vmware.com/) | [VMware Cloud PKS](https://cloud.vmware.com/vmware-cloud-pks)              |[VMware Enterprise PKS](https://cloud.vmware.com/vmware-enterprise-pks)        |   [VMware Enterprise PKS](https://cloud.vmware.com/vmware-enterprise-pks)          | [VMware Essential PKS](https://cloud.vmware.com/vmware-essential-pks)      |          |[VMware Essential PKS](https://cloud.vmware.com/vmware-essential-pks)
| [Z.A.R.V.I.S.](https://zarvis.ai/) | &#x2714; | | | | | |
{{< /table >}}


