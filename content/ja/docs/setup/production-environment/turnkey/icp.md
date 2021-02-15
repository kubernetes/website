---
title: IBM Cloud Privateを使ってマルチクラウドでKubernetesを動かす
---

IBM® Cloud Private is a turnkey cloud solution and an on-premises turnkey cloud solution. IBM Cloud Private delivers pure upstream Kubernetes with the typical management components that are required to run real enterprise workloads. These workloads include health management, log management, audit trails, and metering for tracking usage of workloads on the platform.

IBM Cloud Private is available in a community edition and a fully supported enterprise edition. The community edition is available at no charge from [Docker Hub](https://hub.docker.com/r/ibmcom/icp-inception/). The enterprise edition supports high availability topologies and includes commercial support from IBM for Kubernetes and the IBM Cloud Private management platform. If you want to try IBM Cloud Private, you can use either the hosted trial, the tutorial, or the self-guided demo. You can also try the free community edition. For details, see [Get started with IBM Cloud Private](https://www.ibm.com/cloud/private/get-started).

For more information, explore the following resources:

* [IBM Cloud Private](https://www.ibm.com/cloud/private)
* [Reference architecture for IBM Cloud Private](https://github.com/ibm-cloud-architecture/refarch-privatecloud)
* [IBM Cloud Private documentation](https://www.ibm.com/support/knowledgecenter/SSBS6K/product_welcome_cloud_private.html)

## IBM Cloud PrivateとTerraform

The following modules are available where you can deploy IBM Cloud Private by using Terraform:

* AWS: [Deploy IBM Cloud Private to AWS](https://github.com/ibm-cloud-architecture/terraform-icp-aws)
* Azure: [Deploy IBM Cloud Private to Azure](https://github.com/ibm-cloud-architecture/terraform-icp-azure)
* IBM Cloud: [Deploy IBM Cloud Private cluster to IBM Cloud](https://github.com/ibm-cloud-architecture/terraform-icp-ibmcloud)
* OpenStack: [Deploy IBM Cloud Private to OpenStack](https://github.com/ibm-cloud-architecture/terraform-icp-openstack)
* Terraform module: [Deploy IBM Cloud Private on any supported infrastructure vendor](https://github.com/ibm-cloud-architecture/terraform-module-icp-deploy)
* VMware: [Deploy IBM Cloud Private to VMware](https://github.com/ibm-cloud-architecture/terraform-icp-vmware)

## AWS上でのIBM Cloud Private

You can deploy an IBM Cloud Private cluster on Amazon Web Services (AWS) using Terraform.

IBM Cloud Private can also run on the AWS cloud platform by using Terraform. To deploy IBM Cloud Private in an AWS EC2 environment, see [Installing IBM Cloud Private on AWS](https://github.com/ibm-cloud-architecture/terraform-icp-aws).

## Azure上でのIBM Cloud Private

You can enable Microsoft Azure as a cloud provider for IBM Cloud Private deployment and take advantage of all the IBM Cloud Private features on the Azure public cloud. For more information, see [IBM Cloud Private on Azure](https://www.ibm.com/support/knowledgecenter/SSBS6K_3.2.0/supported_environments/azure_overview.html).

## Red Hat OpenShiftを用いたIBM Cloud Private

You can deploy IBM certified software containers that are running on IBM Cloud Private onto Red Hat OpenShift.

Integration capabilities:

* Supports Linux® 64-bit platform in offline-only installation mode
* Single-master configuration
* Integrated IBM Cloud Private cluster management console and catalog
* Integrated core platform services, such as monitoring, metering, and logging
* IBM Cloud Private uses the OpenShift image registry

For more information see, [IBM Cloud Private on OpenShift](https://www.ibm.com/support/knowledgecenter/SSBS6K_3.2.0/supported_environments/openshift/overview.html).

## VirtualBox上でのIBM Cloud Private

To install IBM Cloud Private to a VirtualBox environment, see [Installing IBM Cloud Private on VirtualBox](https://github.com/ibm-cloud-architecture/refarch-privatecloud-virtualbox).

## VMware上でのIBM Cloud Private

You can install IBM Cloud Private on VMware with either Ubuntu or RHEL images. For details, see the following projects:

* [Installing IBM Cloud Private with Ubuntu](https://github.com/ibm-cloud-architecture/refarch-privatecloud/blob/master/Installing_ICp_on_prem_ubuntu.md)
* [Installing IBM Cloud Private with Red Hat Enterprise](https://github.com/ibm-cloud-architecture/refarch-privatecloud/tree/master/icp-on-rhel)

The IBM Cloud Private Hosted service automatically deploys IBM Cloud Private Hosted on your VMware vCenter Server instances. This service brings the power of microservices and containers to your VMware environment on IBM Cloud. With this service, you can extend the same familiar VMware and IBM Cloud Private operational model and tools from on-premises into the IBM Cloud.

For more information, see [IBM Cloud Private Hosted service](https://cloud.ibm.com/docs/vmwaresolutions?topic=vmwaresolutions-icp_overview).
