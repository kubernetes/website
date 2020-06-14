---
reviewers:
- bradtopol
title: 使用 IBM Cloud Private 在多个云上运行 Kubernetes
---

<!--
---
reviewers:
- bradtopol
title: Running Kubernetes on Multiple Clouds with IBM Cloud Private
---
-->

<!--
IBM® Cloud Private is a turnkey cloud solution and an on-premises turnkey cloud solution. IBM Cloud Private delivers pure upstream Kubernetes with the typical management components that are required to run real enterprise workloads. These workloads include health management, log management, audit trails, and metering for tracking usage of workloads on the platform.
-->
IBM® Cloud Private 是一个 一站式云解决方案并且是一个本地的一站式云解决方案。 IBM Cloud Private 提供纯上游 Kubernetes，以及运行实际企业工作负载所需的典型管理组件。这些工作负载包括健康管理、日志管理、审计跟踪以及用于跟踪平台上工作负载使用情况的计量。

<!--
IBM Cloud Private is available in a community edition and a fully supported enterprise edition. The community edition is available at no charge from [Docker Hub](https://hub.docker.com/r/ibmcom/icp-inception/). The enterprise edition supports high availability topologies and includes commercial support from IBM for Kubernetes and the IBM Cloud Private management platform. If you want to try IBM Cloud Private, you can use either the hosted trial, the tutorial, or the self-guided demo. You can also try the free community edition. For details, see [Get started with IBM Cloud Private](https://www.ibm.com/cloud/private/get-started).
-->
IBM Cloud Private 提供了社区版和全支持的企业版。可从 [Docker Hub](https://hub.docker.com/r/ibmcom/icp-inception/) 免费获得社区版本。企业版支持高可用性拓扑，并包括 IBM 对 Kubernetes 和 IBM Cloud Private 管理平台的商业支持。如果您想尝试 IBM Cloud Private，您可以使用托管试用版、教程或自我指导演示。您也可以尝试免费的社区版。有关详细信息，请参阅 [IBM Cloud Private 入门](https://www.ibm.com/cloud/private/get-started)。

<!--
For more information, explore the following resources:

* [IBM Cloud Private](https://www.ibm.com/cloud/private)
* [Reference architecture for IBM Cloud Private](https://github.com/ibm-cloud-architecture/refarch-privatecloud)
* [IBM Cloud Private documentation](https://www.ibm.com/support/knowledgecenter/SSBS6K/product_welcome_cloud_private.html)
-->
有关更多信息，请浏览以下资源：

* [IBM Cloud Private](https://www.ibm.com/cloud/private)
* [IBM Cloud Private 参考架构](https://github.com/ibm-cloud-architecture/refarch-privatecloud)
* [IBM Cloud Private 文档](https://www.ibm.com/support/knowledgecenter/SSBS6K/product_welcome_cloud_private.html)

<!--
## IBM Cloud Private and Terraform

The following modules are available where you can deploy IBM Cloud Private by using Terraform:

* AWS: [Deploy IBM Cloud Private to AWS](https://github.com/ibm-cloud-architecture/terraform-icp-aws)
* Azure: [Deploy IBM Cloud Private to Azure](https://github.com/ibm-cloud-architecture/terraform-icp-azure)
* IBM Cloud: [Deploy IBM Cloud Private cluster to IBM Cloud](https://github.com/ibm-cloud-architecture/terraform-icp-ibmcloud)
* OpenStack: [Deploy IBM Cloud Private to OpenStack](https://github.com/ibm-cloud-architecture/terraform-icp-openstack)
* Terraform module: [Deploy IBM Cloud Private on any supported infrastructure vendor](https://github.com/ibm-cloud-architecture/terraform-module-icp-deploy)
* VMware: [Deploy IBM Cloud Private to VMware](https://github.com/ibm-cloud-architecture/terraform-icp-vmware)
-->
## IBM Cloud Private 和 Terraform

您可以利用一下模块使用 Terraform 部署 IBM Cloud Private：

* AWS：[将 IBM Cloud Private 部署到 AWS](https://github.com/ibm-cloud-architecture/terraform-icp-aws)
* Azure：[将 IBM Cloud Private 部署到 Azure](https://github.com/ibm-cloud-architecture/terraform-icp-azure)
* IBM Cloud：[将 IBM Cloud Private 集群部署到 IBM Cloud](https://github.com/ibm-cloud-architecture/terraform-icp-ibmcloud)
* OpenStack：[将IBM Cloud Private 部署到 OpenStack](https://github.com/ibm-cloud-architecture/terraform-icp-openstack)
* Terraform 模块：[在任何支持的基础架构供应商上部署 IBM Cloud Private](https://github.com/ibm-cloud-architecture/terraform-module-icp-deploy)
* VMware：[将 IBM Cloud Private 部署到 VMware](https://github.com/ibm-cloud-architecture/terraform-icp-vmware)


<!--
## IBM Cloud Private on AWS
-->
## AWS 上的 IBM Cloud Private

<!--
You can deploy an IBM Cloud Private cluster on Amazon Web Services (AWS) by using either AWS CloudFormation or Terraform.
-->
您可以使用 AWS CloudFormation 或 Terraform 在 Amazon Web Services（AWS）上部署 IBM Cloud Private 集群。

<!--
IBM Cloud Private has a Quick Start that automatically deploys IBM Cloud Private into a new virtual private cloud (VPC) on the AWS Cloud. A regular deployment takes about 60 minutes, and a high availability (HA) deployment takes about 75 minutes to complete. The Quick Start includes AWS CloudFormation templates and a deployment guide.
-->
IBM Cloud Private 快速入门可以自动将 IBM Cloud Private 部署到 AWS Cloud 上的新虚拟私有云（VPC）中。常规部署大约需要60分钟，而高可用性（HA）部署大约需要75分钟。快速入门包括 AWS CloudFormation 模板和部署指南。

<!--
This Quick Start is for users who want to explore application modernization and want to accelerate meeting their digital transformation goals, by using IBM Cloud Private and IBM tooling. The Quick Start helps users rapidly deploy a high availability (HA), production-grade, IBM Cloud Private reference architecture on AWS. For all of the details and the deployment guide, see the [IBM Cloud Private on AWS Quick Start](https://aws.amazon.com/quickstart/architecture/ibm-cloud-private/).
-->
这个快速入门适用于希望探索应用程序现代化并希望通过使用 IBM Cloud Private 和 IBM 工具加速实现其数字化转换目标的用户。快速入门可帮助用户在 AWS 上快速部署高可用性（HA）、生产级的 IBM Cloud Private 参考架构。有关所有详细信息和部署指南，请参阅 [IBM Cloud Private 在 AWS 上的快速入门 ](https://aws.amazon.com/quickstart/architecture/ibm-cloud-private/)。

<!--
IBM Cloud Private can also run on the AWS cloud platform by using Terraform. To deploy IBM Cloud Private in an AWS EC2 environment, see [Installing IBM Cloud Private on AWS](https://github.com/ibm-cloud-architecture/refarch-privatecloud/blob/master/Installing_ICp_on_aws.md).
-->
IBM Cloud Private 也可以通过使用 Terraform 在 AWS 云平台上运行。要在 AWS EC2 环境中部署 IBM Cloud Private，请参阅[在 AWS 上安装 IBM Cloud Private](https://github.com/ibm-cloud-architecture/refarch-privatecloud/blob/master/Installing_ICp_on_aws.md)。

<!--
## IBM Cloud Private on Azure

You can enable Microsoft Azure as a cloud provider for IBM Cloud Private deployment and take advantage of all the IBM Cloud Private features on the Azure public cloud. For more information, see [IBM Cloud Private on Azure](https://www.ibm.com/support/knowledgecenter/SSBS6K_3.2.0/supported_environments/azure_overview.html).
-->
## Azure 上的 IBM Cloud Private

您可以启用 Microsoft Azure 作为 IBM Cloud Private 部署的云提供者，并利用 Azure 公共云上的所有 IBM Cloud Private 功能。有关更多信息，请参阅 [Azure 上的 IBM Cloud Private](https://www.ibm.com/support/knowledgecenter/SSBS6K_3.2.0/supported_environments/azure_overview.html)。

<!--
## IBM Cloud Private with Red Hat OpenShift
-->
## 带有 Red Hat OpenShift 的 IBM Cloud Private

<!--
You can deploy IBM certified software containers that are running on IBM Cloud Private onto Red Hat OpenShift.
-->
您可以将在 IBM Cloud Private 上运行的 IBM 认证的软件容器部署到 Red Hat OpenShift 上。

<!--
Integration capabilities:

* Supports Linux® 64-bit platform in offline-only installation mode
* Single-master configuration
* Integrated IBM Cloud Private cluster management console and catalog
* Integrated core platform services, such as monitoring, metering, and logging
* IBM Cloud Private uses the OpenShift image registry
-->
整合能力：

* 在仅脱机安装模式下支持 Linux®64 位平台
* 单主控节点配置
* 集成的 IBM Cloud Private 集群管理控制台和目录
* 集成的核心平台服务，例如监控、计量和日志
* IBM Cloud Private 使用 OpenShift 镜像仓库

<!--
For more information see, [IBM Cloud Private on OpenShift](https://www.ibm.com/support/knowledgecenter/SSBS6K_3.2.0/supported_environments/openshift/overview.html).
-->
有关更多信息，请参阅 [OpenShift 上的 IBM Cloud Private](https://www.ibm.com/support/knowledgecenter/SSBS6K_3.2.0/supported_environments/openshift/overview.html)。

<!--
## IBM Cloud Private on VirtualBox

To install IBM Cloud Private to a VirtualBox environment, see [Installing IBM Cloud Private on VirtualBox](https://github.com/ibm-cloud-architecture/refarch-privatecloud-virtualbox).
-->
## VirtualBox 上的 IBM Cloud Private

要将 IBM Cloud Private 安装到 VirtualBox 环境，请参阅[在 VirtualBox 上安装 IBM Cloud Private](https://github.com/ibm-cloud-architecture/refarch-privatecloud-virtualbox)。

<!--
## IBM Cloud Private on VMware
-->
## VMware 上的 IBM Cloud Private

<!--
You can install IBM Cloud Private on VMware with either Ubuntu or RHEL images. For details, see the following projects:
-->
您可以使用 Ubuntu 或 RHEL 镜像在 VMware 上安装 IBM Cloud Private。有关详细信息，请参见以下项目：

<!--
* [Installing IBM Cloud Private with Ubuntu](https://github.com/ibm-cloud-architecture/refarch-privatecloud/blob/master/Installing_ICp_on_prem_ubuntu.md)
* [Installing IBM Cloud Private with Red Hat Enterprise](https://github.com/ibm-cloud-architecture/refarch-privatecloud/tree/master/icp-on-rhel)
-->
* [使用 Ubuntu 安装IBM Cloud Private](https://github.com/ibm-cloud-architecture/refarch-privatecloud/blob/master/Installing_ICp_on_prem_ubuntu.md)
* [使用 Red Hat Enterprise 安装 IBM Cloud Private](https://github.com/ibm-cloud-architecture/refarch-privatecloud/tree/master/icp-on-rhel)

<!--
The IBM Cloud Private Hosted service automatically deploys IBM Cloud Private Hosted on your VMware vCenter Server instances. This service brings the power of microservices and containers to your VMware environment on IBM Cloud. With this service, you can extend the same familiar VMware and IBM Cloud Private operational model and tools from on-premises into the IBM Cloud.
-->
IBM Cloud Private Hosted 服务会自动在您的 VMware vCenter Server 实例上部署 IBM Cloud Private Hosted。此服务将微服务和容器的功能带到 IBM Cloud上的VMware 环境中。使用此服务，您可以将同样熟悉的 VMware 和 IBM Cloud Private 操作模型和工具从本地扩展到 IBM Cloud。

<!--
For more information, see [IBM Cloud Private Hosted service](https://cloud.ibm.com/docs/vmwaresolutions?topic=vmwaresolutions-icp_overview).
-->
有关更多信息，请参阅 [IBM Cloud Private Hosted 服务](https://cloud.ibm.com/docs/vmwaresolutions?topic=vmwaresolutions-icp_overview)。
