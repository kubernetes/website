---
reviewers:
- brendandburns
- erictune
- mikedanese
no_issue: true
title: Setup
main_menu: true
weight: 30
content_template: templates/concept
---

{{% capture overview %}}

Depending on your requirements such as ease of maintenance, security, control, available resources, and level of expertise to operate and manage a Kubernetes cluster there are various solutions available. You can deploy a Kubernetes cluster on a local machine, cloud, on-premise cloud; or choose a managed Kubernetes cluster. You can also create custom solutions across a wide range of cloud providers, or bare metal environments to setup a Kubernetes cluster.

Various solutions are available to create a Kubernetes cluster in learning and production environments.

{{% /capture %}}

{{% capture body %}}

## Learning environment

If you want to get familiar with Kubernetes, you can use the Docker-based solutions. You can use tools that are supported by the Kubernetes community or the tools in the ecosystem to setup a Kubernetes cluster on a local-machine. 

{{< table caption="Local-machine solutions table that lists the tools supported by the community and the ecosystem to deploy Kubernetes." >}}

|Community           |Ecosystem     |
| ------------       | --------     |
| [Minikube](/docs/setup/minikube/) | [CDK on LXD](https://www.ubuntu.com/kubernetes/docs/install-local) |
| [Kubeadm-dind](https://github.com/kubernetes-sigs/kubeadm-dind-cluster) | [Docker Desktop](https://www.docker.com/products/docker-desktop)|
| [Kubernetes IN Docker](https://github.com/kubernetes-sigs/kind) | [Minishift](https://docs.okd.io/latest/minishift/)|
|                     | [MicroK8s](https://microk8s.io/)|
|                     | [IBM Cloud Private-CE (Community Edition)](https://github.com/IBM/deploy-ibm-cloud-private) |
|                     | [IBM Cloud Private-CE (Community Edition) on Linux Containers](https://github.com/HSBawa/icp-ce-on-linux-containers)|
|                     | [k3s](https://k3s.io)|
|                     | [Ubuntu on LXD](/docs/getting-started-guides/ubuntu/)|


## Production environment

The production environment solutions diagram lists the possible abstractions of a Kubernetes cluster and the level of expertise involved in managing the operations of a cluster.

Production environment solutions![Production environment solutions](https://github.com/Rajakavitha1/Images/blob/master/KubernetesSolutions.svg)


 
### Applications
The layer where various containerized applications run. 
 
### Data Plane
The layer that provides capacity such as CPU, memory, network, and storage so that the containers can run and connect to a network.

### Control Plane
The container orchestration layer that exposes the API and interfaces to define, deploy, and manage the lifecycle of containers. 

### Cluster Infrastructure
The infrastructure layer provides and maintains VMs, networking, security groups and others. 

### Cluster Operations
Activities such as upgrading the clusters, implementing security, storage, ingress, networking, logging and monitoring, and other operations involved in managing a Kubernetes cluster.

{{< table caption="Production environment solutions table that lists the solutions and the providers." >}}

|Providers  | Managed | Turnkey cloud  | On-prem Cloud  | Custom (Cloud) | Custom (On-Premises VMs)| Custom (Bare Metal) |
| ---------  | ------  | ------         | ------         | ------         | ------                  | -----               |
| [Agile Stacks](https://www.agilestacks.com/products/kubernetes)|                | &#x2714;       | &#x2714;         |       |                    | 
| [Alibaba Cloud](https://www.alibabacloud.com/product/kubernetes)|     | &#x2714; |          |    |                      | 
| [Amazon](https://aws.amazon.com)   | [Amazon EKS](https://aws.amazon.com/eks/)   |[Amazon EC2](https://aws.amazon.com/ec2/)  |          |        |                       | 
| [AppsCode](https://appscode.com/products/pharmer/)          | &#x2714;      |  |       |         |  | 
| [APPUiO](https://appuio.ch/)  | &#x2714;     | &#x2714;  |   &#x2714; | |  | |
| [Microsoft Azure](https://azure.microsoft.com)    |  [Azure Kubernetes Service (AKS)](https://azure.microsoft.com/en-us/services/kubernetes-service/)     |  |     |        |    | 
| [CenturyLink Cloud](https://www.ctl.io/)     |       | &#x2714; |   |  | | 
| [Cloud Foundry Container Runtime (CFCR)](https://docs-cfcr.cfapps.io/)       |     |  |   | &#x2714; |&#x2714; | 
| [CloudStack](https://cloudstack.apache.org/)           |      |  |   | | &#x2714;| 
| [Canonical](https://www.ubuntu.com/kubernetes/docs/quickstart)      |              | &#x2714;       |             | &#x2714;     |&#x2714;  | &#x2714;
| [Containership](https://containership.io/containership-platform)            | &#x2714;       |&#x2714;  |     |     |                   | 
| [Digital Rebar](https://provision.readthedocs.io/en/tip/README.html)            |        |  |      |     |  | &#x2714;
| [DigitalOcean](https://www.digitalocean.com/products/kubernetes/)        | &#x2714;      |  |      |     |            | 
| [Docker Enterprise](https://www.docker.com/products/docker-enterprise) |       |&#x2714;  | &#x2714;     |  |     | &#x2714;
| [Fedora (Multi Node)](https://kubernetes.io/docs/getting-started-guides/fedora/flannel_multi_node_cluster/)     |      |  |      | |    &#x2714;       | &#x2714;
| [Fedora (Single Node)](https://kubernetes.io/docs/getting-started-guides/fedora/fedora_manual_config/)     |      |  |      | |           | &#x2714;
| [Gardner](https://gardener.cloud/)       |              |&#x2714;  |         | &#x2714;   |          | 
| [Giant Swarm](https://giantswarm.io/)     | &#x2714;       | &#x2714; |   &#x2714;    |     | 
| [Google](https://cloud.google.com/)           |  [Google Kubernetes Engine (GKE)](https://cloud.google.com/kubernetes-engine/)       | [Google Compute Engine (GCE)](https://cloud.google.com/compute/)|[GKE On-Prem](https://cloud.google.com/gke-on-prem/)       |  |  |     |  |      |       |  | 
| [IBM](https://www.ibm.com/in-en/cloud)        | [IBM Cloud Kubernetes Service](https://cloud.ibm.com/kubernetes/catalog/cluster)| | | [IBM Cloud Private](https://www.ibm.com/in-en/cloud/private)|
| [Kontena Pharos](https://www.kontena.io/pharos/)          |    |&#x2714;|    &#x2714;    |        |         |
| [Kubermatic](https://www.loodse.com/)         |     &#x2714;  | &#x2714; | &#x2714;     |     |  |
| [KubeSail](https://kubesail.com/)    | &#x2714;       |  |      |     |        | 
| [Kubespray](https://kubespray.io/#/)       |       |    |       |&#x2714;  |  |  |
| [Kublr](https://kublr.com/)        |&#x2714; | &#x2714;  |&#x2714;       |&#x2714;  | |  |
| Madcore.ai (404 and no official website)         |              |        |      |    |                      |
| [Mirantis Cloud Platform](https://www.mirantis.com/software/kubernetes/)    |       |  | &#x2714; |  |    |
| [Nirmata](https://www.nirmata.com/)          |              |   &#x2714;     | &#x2714;            |      |          |
| [Nutanix](https://www.nutanix.com/en)         | [Nutanix Karbon](https://www.nutanix.com/products/karbon)             | [Nutanix Karbon](https://www.nutanix.com/products/karbon)       |             |      | [Nutanix AHV](https://www.nutanix.com/products/acropolis/virtualization)         |
| [OpenShift](https://www.openshift.com)          |[OpenShift Dedicated](https://www.openshift.com/products/dedicated/) and [OpenShift Online](https://www.openshift.com/products/online/)              |        | [OpenShift Container Platform](https://www.openshift.com/products/container-platform/)            |      |  [OpenShift Container Platform](https://www.openshift.com/products/container-platform/)        |[OpenShift Container Platform](https://www.openshift.com/products/container-platform/)
| [Oracle Cloud Infrastructure Container Engine for Kubernetes (OKE)](https://docs.cloud.oracle.com/iaas/Content/ContEng/Concepts/contengoverview.htm)          | &#x2714;             |   &#x2714;     |             |      |          |
| [oVirt](https://www.ovirt.org/)         |              |        |             |     | &#x2714;          |
| [Pivotal Container Service](https://pivotal.io/platform/pivotal-container-service)         |              | &#x2714;       | &#x2714;           |      |          |
| [Platform9](https://platform9.com/)         | &#x2714;             | &#x2714;      | &#x2714;            |      |   &#x2714;       |&#x2714;
| [Rancher](https://rancher.com/)         |              |   [Rancher 2.x](https://rancher.com/docs/rancher/v2.x/en/)     |             |  [Rancher Kubernetes Engine (RKE)](https://rancher.com/docs/rke/latest/en/)    |          | [k3s](https://k3s.io/)
| [StackPoint](https://stackpoint.io/)          | &#x2714;            |  &#x2714;      |             |      |          |
| [Supergiant](https://supergiant.io/)         |              |&#x2714;        |             |      |          |
| [SUSE](https://www.suse.com/)        |              | &#x2714;       |             |      |          |
| [SysEleven](https://www.syseleven.io/)         | &#x2714;             |        |             |      |          |
| [VEXXHOST](https://vexxhost.com/)         | &#x2714;             | &#x2714;      |             |      |          |
| [VMware](https://cloud.vmware.com/) | [VMware Cloud PKS](https://cloud.vmware.com/vmware-cloud-pks)              |[VMware Enterprise PKS](https://cloud.vmware.com/vmware-enterprise-pks)        |   [VMware Enterprise PKS](https://cloud.vmware.com/vmware-enterprise-pks)          | [VMware Essential PKS](https://cloud.vmware.com/vmware-essential-pks)      |          |[VMware Essential PKS](https://cloud.vmware.com/vmware-essential-pks)

{{% /capture %}}


