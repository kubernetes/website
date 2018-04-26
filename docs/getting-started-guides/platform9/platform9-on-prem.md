---
reviewers:
title: Running Platform9 Managed Kubernetes On-Premises
---

* TOC
{:toc}


## Introduction

Through the following tutorial, you will learn to install [Platform9 Managed Kubernetes](https://platform9.com/managed-kubernetes/?utm_source=k8sio) on the following types infrastructure:
 
- CentOS 7.2+, RHEL 7.2+, Ubuntu 14.04+
- Virtualization support: KVM, VMware vSphere

Platform9 Managed Kubernetes can also be [auto-deployed on public clouds](kubernetes.io/platform9/platform9-cloud.md). Please reach us at <support@platform9.com> if you need an alternative installer. 

## Pre-requisites

In order to prepare your servers, please refer to the following [pre-requisites page](https://platform9.com/support/managed-container-cloud-requirements-checklist/?utm_source=k8sio).


## Cluster Creation

The following steps will use the Platform9 [Clarity UI](https://platform9.com/blog/use-remarkable-ui-openstack-kubernetes/?utm_source=k8sio). Navigate to the the Kubernetes Dashboard by switching panes, if necessary.

<img src="../kubernetes-dashboard.png" width="50%" height="50%">

Click on the **+ ADD CLUSTER** button in the top right of the page.

Click on the **Manual Deploy** checkbox

Enter the values on this page the following way: 

- Name: choose a friendly name for your Kubernetes cluster, e.g. devops
- Containers CIDR: provide an unused CIDR from which IP addresses are allocated to Docker containers. e.g. 10.0.0.0/16
- Services CIDR: provide an unused CIDR from which IP addresses are allocated to Kubernetes services. e.g. 10.1.0.0/16
- [optional] FQDN: FQDN to access the Kubernetes cluster. e.g. devops.platform9.com
- [optional] Privileged, Advanced API configuration, Application Catalog: to enable privileged containers, selective APIs on the cluster, and Helm Application Catalog, respectively. 

A screenshot of a sample summary screen is shown below. Click **CREATE CLUSTER** to complete cluster creation.

<img src="../cluster-create-summary-on-prem.png" width="50%" height="50%">

## Cluster Deployment

Download the guest agent from Platform9:

1. Toggle to the Kubernetes Dashboard using the navigation bar on the left.
2. Click on **Infrastructure** > **Nodes** > **Add Node**
3. Download the installer locally. Installers are provided for Ubuntu 14.04+ and Enterprise Linux (Red Hat/CentOS) 7.2+. 

Transfer the installer to your target server node(s).

(On Ubuntu only) Update package versions and dependencies by executing the command:

	sudo apt-get update
		
For each node, install the host agent by executing the command:

	sudo bash <path to installer>
	
You can optionally set proxy settings and Network Time Protocol. Network Time Protocol Daemon (NTPD) is recommended. 

You will be notified with a message stating **Installation succeeded!** once the guest agent is installed.

After a few moments, your node(s) will be visible in the **Nodes** tab.

<img src="../node-with-agent.png" width="60%" height="60%">

For each node, click on **AUTHORIZE** to import the node. Confirm authorization. Please wait a few minutes for the authorization to complete. 

Continue in the **Nodes** tab. Select the node(s) that you want to join the cluster by clicking the corresponding checkboxes. In this example, only one node is present and it is named `kubernetes-master1`. 

Select **Attach To Cluster** and specify the cluster name, `devops`. 

You can monitor the status of your cluster’s node(s) by clicking on the cluster name in the **Clusters** tab. Next, click on **Nodes** and look for the **Connected** status. This can take a few minutes.

<img src="../kubernetes-node1-onprem-complete.png" width="50%" height="50%">

Your Kubernetes cluster is now ready for use. Please follow the same steps above to add additional nodes to the cluster.
