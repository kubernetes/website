---
reviewers:
- bradamant3
- steveperry-53
- zacharysarah
no_issue: true
title: Setup
main_menu: true
weight: 30
content_template: templates/concept
---

{{% capture overview %}}
# Solutions

Depending on your requirements such as ease of maintenance, security, control, available resources, and level of expertise to operate and manage a Kubernetes cluster there are various solutions available. You can deploy a Kubernetes cluster on a local machine, cloud, on-premise cloud; or choose a managed Kubernetes cluster. You can also create custom solutions across a wide range of cloud providers, or bare metal environments to setup a Kubernetes cluster.

Various solutions are available to create a Kubernetes cluster in learning and production environments.

{{% /capture %}}

{{% capture body %}}

## Learning environment

If you want to get familiar with Kubernetes, you can use the Docker-based solutions. You can use tools that are supported by the Kubernetes community or the tools in the ecosystem to setup a Kubernetes cluster on a local-machine.
 
<table><caption>Local-machine solutions table that lists the tools supported by the community and the ecosystem to deploy Kubernetes.</caption>
  <tr><th>Community</th><th>Ecosystem</th></tr>
  <tr><td><ul><li>[Minikube](/docs/setup/minikube/)</li> <li>[Kubeadm-dind](https://github.com/kubernetes-sigs/kubeadm-dind-cluster)</li> <li>[Kubernetes IN Docker](https://github.com/kubernetes-sigs/kind)</li></ul>
</td>
<td><ul><li>[CDK on LXD](https://www.ubuntu.com/kubernetes/docs/install-local) </li><li>[Docker Desktop](https://www.docker.com/products/docker-desktop) </li> <li>[Minishift](https://docs.okd.io/latest/minishift/)</li> <li>[MicroK8s](https://microk8s.io/) </li> <li>[IBM Cloud Private-CE (Community Edition)](https://github.com/IBM/deploy-ibm-cloud-private)</li><li>[IBM Cloud Private-CE (Community Edition) on Linux Containers](https://github.com/HSBawa/icp-ce-on-linux-containers)</li>
<li>[k3s](https://k3s.io)</li>
<li>[Ubuntu on LXD](/docs/getting-started-guides/ubuntu/)</li></ul>
</td></tr>
</table>

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




Providers  | Managed | Turnkey cloud  | On-prem Cloud  | Custom (Cloud) | Custom (On-Premises VMs)| Custom (Bare Metal)
-------------- | ------ | ------ | ------   | ------ | ------ | ----- |
[Agile Stacks](https://www.agilestacks.com/products/kubernetes)            |                | :heavy_check_mark:       | :heavy_check_mark:         |       |                    | 
[Alibaba Cloud](https://www.alibabacloud.com/product/kubernetes)     |     | :heavy_check_mark: |          |    |                      | 
[Amazon](https://aws.amazon.com)      | [Amazon EKS](https://aws.amazon.com/eks/)   |[Amazon EC2](https://aws.amazon.com/ec2/)  |          |        |                       | 
[AppsCode](https://appscode.com/products/pharmer/)          | :heavy_check_mark:      |  |       |         |  | 
[APPUiO](https://appuio.ch/)  | :heavy_check_mark:     | :heavy_check_mark:  |   :heavy_check_mark: | |  | |
[Microsoft Azure](https://azure.microsoft.com)    |  [Azure Kubernetes Service (AKS)](https://azure.microsoft.com/en-us/services/kubernetes-service/)     |  |     |        |    | 
[CenturyLink Cloud](https://www.ctl.io/)     |       | :heavy_check_mark: |   |  | | 
[Cloud Foundry Container Runtime (CFCR)](https://docs-cfcr.cfapps.io/)       |     |  |   |:heavy_check_mark: |:heavy_check_mark: | 
[CloudStack](https://cloudstack.apache.org/)           |      |  |   | | :heavy_check_mark:| 
[Canonical](https://www.ubuntu.com/kubernetes/docs/quickstart)      |              | :heavy_check_mark:       |             | :heavy_check_mark:     |:heavy_check_mark:  | :heavy_check_mark:
[Containership](https://containership.io/containership-platform)            | :heavy_check_mark:       |:heavy_check_mark:  |     |     |                   | 
[Digital Rebar](https://provision.readthedocs.io/en/tip/README.html)            |        |  |      |     |  | :heavy_check_mark:
[DigitalOcean](https://www.digitalocean.com/products/kubernetes/)        | :heavy_check_mark:      |  |      |     |            | 
[Docker Enterprise](https://www.docker.com/products/docker-enterprise) |       |:heavy_check_mark:  | :heavy_check_mark:     |  |     | :heavy_check_mark:
[Fedora (Multi Node)](https://kubernetes.io/docs/getting-started-guides/fedora/flannel_multi_node_cluster/)     |      |  |      | |    :heavy_check_mark:       | :heavy_check_mark:
[Fedora (Single Node)](https://kubernetes.io/docs/getting-started-guides/fedora/fedora_manual_config/)     |      |  |      | |           | :heavy_check_mark:
[Gardner](https://gardener.cloud/)       |              |:heavy_check_mark:  |         | :heavy_check_mark:   |          | 
[Giant Swarm](https://giantswarm.io/)     | :heavy_check_mark:       | :heavy_check_mark: |   :heavy_check_mark:    |     | 
[Google](https://cloud.google.com/)           |  [Google Kubernetes Engine (GKE)](https://cloud.google.com/kubernetes-engine/)       | [Google Compute Engine (GCE)](https://cloud.google.com/compute/)|[GKE On-Prem](https://cloud.google.com/gke-on-prem/)       |  |  |     |  |      |       |  | 
[IBM](https://www.ibm.com/in-en/cloud)        | [IBM Cloud Kubernetes Service](https://cloud.ibm.com/kubernetes/catalog/cluster)| | [IBM Cloud Private](https://www.ibm.com/in-en/cloud/private)|
[Kontena Pharos](https://www.kontena.io/pharos/)          |    |:heavy_check_mark: |    :heavy_check_mark:     |        |         |
[Kubermatic](https://www.loodse.com/)         |     :heavy_check_mark:  | :heavy_check_mark: | :heavy_check_mark:     |     |  |
[KubeSail](https://kubesail.com/)    | :heavy_check_mark:       |  |      |     |        | 
[Kubespray](https://kubespray.io/#/)       |       |    |       |:heavy_check_mark:  |  |  |
[Kublr](https://kublr.com/)        |:heavy_check_mark: | :heavy_check_mark:  |:heavy_check_mark:       |:heavy_check_mark:  | |  |
Madcore.ai (404 and no official website)         |              |        |      |    |                      |
[Mirantis Cloud Platform](https://www.mirantis.com/software/kubernetes/)    |       |  | :heavy_check_mark: |  |    |
[Nirmata](https://www.nirmata.com/)          |              |   :heavy_check_mark:     | :heavy_check_mark:            |      |          |
[Nutanix](https://www.nutanix.com/en)         | [Nutanix Karbon](https://www.nutanix.com/products/karbon)             | [Nutanix Karbon](https://www.nutanix.com/products/karbon)       |             |      | [Nutanix AHV](https://www.nutanix.com/products/acropolis/virtualization)         |
[OpenShift](https://www.openshift.com)          |[OpenShift Dedicated](https://www.openshift.com/products/dedicated/) and [OpenShift Online](https://www.openshift.com/products/online/)              |        | [OpenShift Container Platform](https://www.openshift.com/products/container-platform/)            |      |  [OpenShift Container Platform](https://www.openshift.com/products/container-platform/)        |[OpenShift Container Platform](https://www.openshift.com/products/container-platform/)
[Oracle Cloud Infrastructure Container Engine for Kubernetes (OKE)](https://docs.cloud.oracle.com/iaas/Content/ContEng/Concepts/contengoverview.htm)          | :heavy_check_mark:             |   :heavy_check_mark:     |             |      |          |
[oVirt](https://www.ovirt.org/)         |              |        |             |     | :heavy_check_mark:          |
[Pivotal Container Service](https://pivotal.io/platform/pivotal-container-service)         |              | :heavy_check_mark:       | :heavy_check_mark:            |      |          |
[Platform9](https://platform9.com/)         | :heavy_check_mark:             | :heavy_check_mark:       | :heavy_check_mark:            |      |   :heavy_check_mark:       |:heavy_check_mark:
[Rancher](https://rancher.com/)         |              |   [Rancher 2.x](https://rancher.com/docs/rancher/v2.x/en/)     |             |  [Rancher Kubernetes Engine (RKE)](https://rancher.com/docs/rke/latest/en/)    |          | [k3s](https://k3s.io/)
[StackPoint](https://stackpoint.io/)          | :heavy_check_mark:             |  :heavy_check_mark:      |             |      |          |
[Supergiant](https://supergiant.io/)         |              |:heavy_check_mark:        |             |      |          |
[SUSE](https://www.suse.com/)        |              | :heavy_check_mark:       |             |      |          |
[SysEleven](https://www.syseleven.io/)         | :heavy_check_mark:             |        |             |      |          |
[VEXXHOST](https://vexxhost.com/)         | :heavy_check_mark:             | :heavy_check_mark:       |             |      |          |
[VMware](https://cloud.vmware.com/)         | [VMware Cloud PKS](https://cloud.vmware.com/vmware-cloud-pks)              |[VMware Enterprise PKS](https://cloud.vmware.com/vmware-enterprise-pks)        |   [VMware Enterprise PKS](https://cloud.vmware.com/vmware-enterprise-pks)          | [VMware Essential PKS](https://cloud.vmware.com/vmware-essential-pks)      |          |[VMware Essential PKS](https://cloud.vmware.com/vmware-essential-pks)

{{% /capture %}}



