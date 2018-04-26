---
reviewers:
- akshaisarathy
title: Running Platform9 Managed Kubernetes on Public Cloud
---

* TOC
{:toc}


## Introduction

Through the following tutorial, you will learn to install [Platform9 Managed Kubernetes](https://platform9.com/managed-kubernetes/?utm_source=k8sio) on Amazon Web Services. Platform9 Managed Kubernetes provides auto-deploy functionality on AWS, making it easy for you to install Kubernetes.

Auto-deploy for Google Cloud Platform and Microsoft Azure will be available in 2018. For installation on other clouds and on-premises, please follow the steps for [manual installation](kubernetes.io/platform9/platform9-on-prem/). Please reach us at support@platform9.com if you need an alternative installer.


## Cluster Deployment

The following steps will use the Platform9 [Clarity UI](https://platform9.com/blog/use-remarkable-ui-openstack-kubernetes/?utm_source=k8sio). Using the UI, navigate to the the Kubernetes Dashboard.  
  
<img src="../kubernetes-dashboard.png" width="50%" height="50%">

Click on the **Cloud Providers** tab and then **+ ADD NEW CLOUD PROVIDER**.

Choose Amazon AWS Cloud Provider.

Choose a friendly name for this Cloud Provider, such as `AWS-Containers`.

In order to have permissions to create resources on AWS, Platform9 needs your AWS Access Key ID and Secret Key. Please provide an account with the permissions indicated on the screen.

Click on **Clusters**

Click on **+ ADD CLUSTER**

Create a new cluster by providing the inputs requested. An example is shown below. 

<img src="../cluster-create.png" width="50%" height="50%">

Provide the instance types for master and worker nodes and the numbers required. For a HA configuration, you can choose to have 3 master nodes. For worker nodes, you can allocate a percentage to [spot instances](https://platform9.com/support/platform9-3-1-release-notes/?utm_source=k8sio). Choose this option if you want to take advantage of AWS spot pricing. 

<img src="../kubernetes-node-types.png" width="50%" height="50%">

You can choose to use your current domain or create a new domain. If you want to get started quickly, you can use the `platform9.net` domain and create a new VPC on Amazon. For the required inputs:

- Containers CIDR: provide an unused AWS CIDR from which IP addresses can be allocated to Docker containers. e.g. `10.20.0.0/16` 
- Services CIDR: provide an unused CIDR from which IP addresses can be allocated to Kubernetes services. e.g. `10.21.0.0/16`

Choose an existing AWS SSH key or import a new key. This key can be later used to log into the nodes for management.

Optionally, you can choose to enable running privileged containers and Helm Application Catalog.

Review the Summary screen and click **CREATE CLUSTER**.

<img src="../kubernetes-aws-summary.png">

You can monitor the status of your cluster by clicking on the cluster name in the **Clusters** tab. Next, click on **Nodes** and look for the **Connected** status. This can take a few minutes.

<img src="../kubernetes-aws-complete.png" width="50%" height="50%">

The Kubernetes cluster is now ready for use. 

