---
---

Cloud Load Control (CLC) is an out-of-the-box solution for companies that are looking for a preassembled and enterprise-ready distribution of tools for provisioning and managing clusters and containers on top of OpenStack-based cloud computing platforms. <span>CLC</span> automates the setup and operation of a workload management system in OpenStack based on modern Linux container and clustering technology: [Kubernetes](http://kubernetes.io/) and [Docker](http://docs.docker.com).

CLC contributes to the Kubernetes open source project initiated by Google. It helps improve this powerful system for managing applications packaged in containers in a cluster environment.  

CLC can drive down costs by supporting an efficient use of resources due to automated workload placement. It reduces complexity by providing methodologies to manage large-scale containerized workloads.

* TOC
{:toc}

## Key Features

The key features of CLC are:

* Integration of container technology and cluster orchestration
* Automated provisioning and setup of clusters on top of OpenStack
* Seamless integration in OpenStack dashboard

### Integration of Container Technology and Cluster Orchestration

Container technology provides for the decoupling of applications from infrastructure, as well as the independence in where an application is deployed. This separation leads to increased efficiency and reliability, in particular to faster and more frequent application deployments. Workloads become mobile and can be shifted quickly between execution environments. This helps to maintain agility and control cost.

Containers are a layer of abstraction and automation on top of operating-system-level virtualization. OS-level virtualization is a server virtualization method where the kernel of an operating system allows for multiple isolated user space instances, instead of just one. Such an instance is called container. Multiple isolated containers can run on a single host, using their own process and network space. The deployment of applications inside software containers can easily be automated, and identical runtime conditions for applications on any type of machine can be ensured. Containers and virtual machines (VMs) share many similarities but are fundamentally different because of the architecture. Containers run as lightweight processes within a host OS, whereas VMs depend on a hypervisor to emulate the architecture. Since there is no hypervisor involved, containers are faster, more efficient, and easier to manage.

CLC integrates Kubernetes into preassembled base images the nodes of a cluster. Kubernetes works in conjunction with Docker containers. Docker containers automate the deployment of applications inside software containers. Kubernetes is a cluster manager that can manage containerized applications across multiple hosts. It aggregates cluster resources into one large virtual machine, and provides basic mechanisms for deployment, maintenance, and scaling of applications. With CLC, Docker containers are automatically dispatched to cluster nodes.

While Docker provides the lifecycle management of containers, Kubernetes takes it to the next level by allowing for orchestration, managing clusters of containers, automating scaling and failover, and providing means of container interconnection.

For details, refer to [Cluster Orchestration](/docs/clc-overview/cluster-orchestration)

### Automated Provisioning and Setup of Clusters

CLC provides an integrated, tested package including all components required to set up and operate a cluster. Cluster nodes are powered by CentOS Atomic Host, a light weight Linux operating system optimized to run containers. CLC provides preassembled nodes, which automate the provisioning of clusters: The node image contains a ready-to-use Docker integration on CentOS.

For details, refer to [Cluster Management](/docs/clc-overview/cluster-mgmt)

### Seamless Integration with the OpenStack Dashboard

CLC is fully integrated with OpenStack  and extends the OpenStack dashboard (Horizon) with an additional panel. A cluster operator can use this panel for requesting the automatic setup, provisioning, or deprovisioning of a cluster. </p>

For details, refer to [Cluster Management](/docs/clc-overview/cluster-mgmt)

## Components

The following illustration provides an overview of the CLC components as well as their integration with the underlying platform.

![CLC Components](/docs/clc-overview/images/product-structure.png)

## Users and Roles

The CLC users can be grouped by their role. The following roles are distinguished:

![Users and Roles](/docs/clc-overview/images/user-scope.png)

* The **cluster user** is responsible for developing and deploying applications on the cluster. He uses CLC for application deployment and ensuring workload mobility, scalability, and availability. For details, refer to the *Cluster Management Guide*.

* The **cluster operator** is responsible for managing clusters on an infrastructure and orchestration level. He uses CLC for cluster setup and management, and ensures high utilization of the cluster. For details, refer to the *Cluster Management Guide*.

* The **OpenStack operator** is responsible for administrating and maintaining the underlying OpenStack platform, and for ensuring the availability and quality of the OpenStack services. He installs CLC on an OpenStack platform. For details, refer to the *Installation Guide*.

Actual end users of services provided in the cluster do not interact with and are not aware of the underlying layers, such as containers or clusters. The end users benefit from CLC</span>'s performance and high availability.

## Interaction of Components and Users

The following picture shows how the CLC components and users interact with each other:

![Component Interaction ](/docs/clc-overview/images/components2.png)

* The OpenStack operator installs CLC on top of OpenStack. The OpenStack operator can use an automated setup or follow manual step-by-step instructions as provided in the *Installation Guide*. In addition, for a stand-alone evaluation of CLC, a setup based on Vagrant is provided. With this setup, a DevStack-based OpenStack environment is created, and CLC is automatically installed on top of it. If you want to try this installation, please contact your Fujitsu Support organization.

* The installation process automatically sets up the **Cluster Management** component which provides all artefacts and tools required for provisioning a cluster. Cluster Management utilizes the resources provided by the underlying OpenStack platform.

  Cluster Management comprises a **Cluster Management UI** and Cluster Provisioning which integrates seamlessly with the OpenStack dashboard ([Horizon](http://docs.openstack.org/developer/horizon/)). It extends the dashboard with a panel for cluster management.

* The Cluster operator uses the Cluster Management UI for creating and deleting clusters, as well as getting an overview of all existing clusters and their current state.

**Cluster Provisioning** is triggered when the cluster operator requests the creation of a new cluster. The operator provides the required information, for example, number of nodes to be provisioned, or access keys in the Cluster Management UI.

* Based on the input values, instructions for provisioning the cluster are created and passed to the **OpenStack Orchestration** (Heat) system. Heat is responsible for the actual creation of the resources (for example, VMs, volumes, etc.) as well as the installation and configuration of the **Cluster Orchestration** (Kubernetes) on top of the created resources.

* The cluster operator uses the command-line interface (**CLI**) of the Cluster Orchestration for maintenance and troubleshooting purposes, as well as for retrieving the usage of the underlying resources, such as CPU and memory.

* The cluster user deploys the actual workloads into the Docker containers using the CLI of the Cluster Orchestration.
