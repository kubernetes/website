---
cn-approvers:
- tianshapjq
approvers:
- baldwinspc
title: 通过 Stackpoint.io 在多个云平台上运行 Kubernetes
---
<!--
---
approvers:
- baldwinspc
title: Running Kubernetes on Multiple Clouds with Stackpoint.io
---
-->

* TOC
{:toc}


<!--
## Introduction

StackPointCloud is the universal control plane for Kubernetes Anywhere.  StackPointCloud allows you to deploy and manage a Kubernetes cluster to the cloud provider of your choice in 3 steps using a web-based interface.
-->
## 简介
StackPointCloud 是一个能够让 Kubernetes 随处运行的通用控制平面。通过 StackPointCloud，您可以使用基于 Web 的界面，通过3个步骤将 Kubernetes 集群部署到您选择的云提供商上，并能够管理集群。


<!--
## AWS

To create a Kubernetes cluster on AWS, you will need an Access Key ID and a Secret Access Key from AWS.
-->
## AWS

要在 AWS 上创建 Kubernetes 集群，您需要 AWS 的访问密钥 ID 和秘密访问密钥（Secret Access Key）。

<!--
### Choose a Provider

Log in to [stackpoint.io](https://stackpoint.io) with a GitHub, Google, or Twitter account.

Click **+ADD A CLUSTER NOW**.

Click to select Amazon Web Services (AWS).
-->
### 选择一个提供商

通过 GitHub、Google 或者 Twitter 账号来登录 [stackpoint.io](https://stackpoint.io)。

点击 **+ADD A CLUSTER NOW**。

点击选择 Amazon Web Services (AWS)。

<!--
### Configure Your Provider

Add your Access Key ID and a Secret Access Key from AWS. Select your default StackPointCloud SSH keypair, or click **ADD SSH KEY** to add a new keypair.

Click **SUBMIT** to submit the authorization information.
-->
### 配置您的提供商

添加您从 AWS 获得的访问密钥 ID 和秘密访问密钥。选择您的默认 StackPointCloud SSH 密钥对，或者点击 **ADD SSH KEY** 来添加一个新的密钥对。

点击 **SUBMIT** 来提交验证信息。

<!--
### Configure Your Cluster

Choose any extra options you may want to include with your cluster, then click **SUBMIT** to create the cluster. 
-->
### 配置您的集群

选择您希望包含在集群中的任何其他选项，然后单击 **SUBMIT** 创建集群。

<!--
### Running the Cluster

You can monitor the status of your cluster and suspend or delete it from [your stackpoint.io dashboard](https://stackpoint.io/#/clusters).

For information on using and managing a Kubernetes cluster on AWS, [consult the  Kubernetes documentation](/docs/getting-started-guides/aws/).
-->
### 运行集群

您能通过 [您的 stackpoint.io 面板](https://stackpoint.io/#/clusters) 来管理集群状态，也能进行挂起和删除操作。

对于如何在 AWS 上使用和管理 Kubernetes 集群，[请参阅 Kubernetes 文档](/docs/getting-started-guides/aws/)。




<!--
## GCE

To create a Kubernetes cluster on GCE, you will need the Service Account JSON Data from Google.
-->
## GCE

要在 GCE 上创建 Kubernetes 集群，您需要 Google 提供的服务帐户 JSON 数据（Service Account JSON Data）。

<!--
### Choose a Provider

Log in to [stackpoint.io](https://stackpoint.io) with a GitHub, Google, or Twitter account.

Click **+ADD A CLUSTER NOW**.

Click to select Google Compute Engine (GCE).
-->
### 选择一个提供商

通过 GitHub、Google 或者 Twitter 账号来登录 [stackpoint.io](https://stackpoint.io)。

点击 **+ADD A CLUSTER NOW**。

点击选择 Google Compute Engine (GCE)。

<!--
### Configure Your Provider

Add your Service Account JSON Data from Google. Select your default StackPointCloud SSH keypair, or click **ADD SSH KEY** to add a new keypair.

Click **SUBMIT** to submit the authorization information.
-->
### 配置您的提供商

添加您从 Google 获得的服务帐户 JSON 数据。选择您的默认 StackPointCloud SSH 密钥对，或者点击 **ADD SSH KEY** 来添加一个新的密钥对。

点击 **SUBMIT** 来提交验证信息。

<!--
### Configure Your Cluster

Choose any extra options you may want to include with your cluster, then click **SUBMIT** to create the cluster. 
-->
### 配置您的集群

选择您希望包含在集群中的任何其他选项，然后单击 **SUBMIT** 创建集群。

<!--
### Running the Cluster

You can monitor the status of your cluster and suspend or delete it from [your stackpoint.io dashboard](https://stackpoint.io/#/clusters).

For information on using and managing a Kubernetes cluster on GCE, [consult the  Kubernetes documentation](/docs/getting-started-guides/gce/).
-->
### 运行集群

您能通过 [您的 stackpoint.io 面板](https://stackpoint.io/#/clusters) 来管理集群状态，也能进行挂起和删除操作。

对于如何在 GCE 上使用和管理 Kubernetes 集群，[请参阅 Kubernetes 文档](/docs/getting-started-guides/gce/)。





## Google Kubernetes Engine

<!--
To create a Kubernetes cluster on Google Kubernetes Engine, you will need the Service Account JSON Data from Google.
-->
要在 Google Kubernetes Engine 上创建一个 Kubernetes 集群，你需要使用从 Google 获得的服务帐户 JSON 数据。

<!--
### Choose a Provider

Log in to [stackpoint.io](https://stackpoint.io) with a GitHub, Google, or Twitter account.

Click **+ADD A CLUSTER NOW**.

Click to select Google Kubernetes Engine.
-->
### 选择一个提供商

通过 GitHub、Google 或者 Twitter 账号来登录 [stackpoint.io](https://stackpoint.io)。

点击 **+ADD A CLUSTER NOW**。

点击选择 Google Kubernetes Engine。

<!--
### Configure Your Provider

Add your Service Account JSON Data from Google. Select your default StackPointCloud SSH keypair, or click **ADD SSH KEY** to add a new keypair.

Click **SUBMIT** to submit the authorization information.
-->
### 配置您的提供商

添加您从 Google 获得的服务帐户 JSON 数据。选择您的默认 StackPointCloud SSH 密钥对，或者点击 **ADD SSH KEY** 来添加一个新的密钥对。

点击 **SUBMIT** 来提交验证信息。

<!--
### Configure Your Cluster

Choose any extra options you may want to include with your cluster, then click **SUBMIT** to create the cluster. 
-->
### 配置您的集群

选择您希望包含在集群中的任何其他选项，然后单击 **SUBMIT** 创建集群。


<!--
### Running the Cluster

You can monitor the status of your cluster and suspend or delete it from [your stackpoint.io dashboard](https://stackpoint.io/#/clusters).

For information on using and managing a Kubernetes cluster on Google Kubernetes Engine, consult [the official documentation](/docs/home/).
-->
### 运行集群

您能通过 [您的 stackpoint.io 面板](https://stackpoint.io/#/clusters) 来管理集群状态，也能进行挂起和删除操作。

对于如何在 Google Kubernetes Engine 上使用和管理 Kubernetes 集群，请参阅 [官方文档](/docs/home/)。


## DigitalOcean

<!--
To create a Kubernetes cluster on DigitalOcean, you will need a DigitalOcean API Token.
-->
如果想要在 DigitalOcean 上创建一个 Kubernetes 集群，您需要拥有一个 DigitalOcean 的 API token。

<!--
### Choose a Provider

Log in to [stackpoint.io](https://stackpoint.io) with a GitHub, Google, or Twitter account.

Click **+ADD A CLUSTER NOW**.

Click to select DigitalOcean.
-->
### 选择一个提供商

通过 GitHub、Google 或者 Twitter 账号来登录 [stackpoint.io](https://stackpoint.io)。

点击 **+ADD A CLUSTER NOW**。

点击选择 DigitalOcean。

<!--
### Configure Your Provider

Add your DigitalOcean API Token. Select your default StackPointCloud SSH keypair, or click **ADD SSH KEY** to add a new keypair.

Click **SUBMIT** to submit the authorization information.
-->
### 配置您的提供商

添加您的 DigitalOcean API Token。选择您的默认 StackPointCloud SSH 密钥对，或者点击 **ADD SSH KEY** 来添加一个新的密钥对。

点击 **SUBMIT** 来提交验证信息。

<!--
### Configure Your Cluster

Choose any extra options you may want to include with your cluster, then click **SUBMIT** to create the cluster. 
-->
### 配置您的集群

选择您希望包含在集群中的任何其他选项，然后单击 **SUBMIT** 创建集群。

<!--
### Running the Cluster

You can monitor the status of your cluster and suspend or delete it from [your stackpoint.io dashboard](https://stackpoint.io/#/clusters).

For information on using and managing a Kubernetes cluster on DigitalOcean, consult [the official documentation](/docs/home/).
-->
### 运行集群

您能通过 [您的 stackpoint.io 面板](https://stackpoint.io/#/clusters) 来管理集群状态，也能进行挂起和删除操作。

对于如何在 DigitalOcean 上使用和管理 Kubernetes 集群，请参阅 [官方文档](/docs/home/)。





## Microsoft Azure

<!--
To create a Kubernetes cluster on Microsoft Azure, you will need an Azure Subscription ID, Username/Email, and Password.
-->
如果想要在 Microsoft Azure 上创建一个 Kubernetes 集群，您需要拥有一个 Azure Subscription ID，用户名/邮箱和密码。

<!--
### Choose a Provider

Log in to [stackpoint.io](https://stackpoint.io) with a GitHub, Google, or Twitter account.

Click **+ADD A CLUSTER NOW**.

Click to select Microsoft Azure.
-->
### 选择一个提供商

通过 GitHub、Google 或者 Twitter 账号来登录 [stackpoint.io](https://stackpoint.io)。

点击 **+ADD A CLUSTER NOW**。

点击选择 Microsoft Azure。

<!--
### Configure Your Provider

Add your Azure Subscription ID, Username/Email, and Password. Select your default StackPointCloud SSH keypair, or click **ADD SSH KEY** to add a new keypair.

Click **SUBMIT** to submit the authorization information.
-->
### 配置您的提供商

添加您的 Azure Subscription ID、用户名/邮箱和密码。选择您的默认 StackPointCloud SSH 密钥对，或者点击 **ADD SSH KEY** 来添加一个新的密钥对。

点击 **SUBMIT** 来提交验证信息。

<!--
### Configure Your Cluster

Choose any extra options you may want to include with your cluster, then click **SUBMIT** to create the cluster. 
-->
### 配置您的集群

选择您希望包含在集群中的任何其他选项，然后单击 **SUBMIT** 创建集群。

<!--
### Running the Cluster

You can monitor the status of your cluster and suspend or delete it from [your stackpoint.io dashboard](https://stackpoint.io/#/clusters).

For information on using and managing a Kubernetes cluster on Azure, [consult the  Kubernetes documentation](/docs/getting-started-guides/azure/).
-->
### 运行集群

您能通过 [您的 stackpoint.io 面板](https://stackpoint.io/#/clusters) 来管理集群状态，也能进行挂起和删除操作。

对于如何在 Azure 上使用和管理 Kubernetes 集群，请参阅 [Kubernetes 文档](/docs/getting-started-guides/azure/)。





## Packet

<!--
To create a Kubernetes cluster on Packet, you will need a Packet API Key.
-->
如果想要在 Packet 上创建一个 Kubernetes 集群，您需要拥有一个 Packet API 密钥。

<!--
### Choose a Provider

Log in to [stackpoint.io](https://stackpoint.io) with a GitHub, Google, or Twitter account.

Click **+ADD A CLUSTER NOW**.

Click to select Packet.
-->
### 选择一个提供商

通过 GitHub、Google 或者 Twitter 账号来登录 [stackpoint.io](https://stackpoint.io)。

点击 **+ADD A CLUSTER NOW**。

点击选择 Packet。

<!--
### Configure Your Provider

Add your Packet API Key. Select your default StackPointCloud SSH keypair, or click **ADD SSH KEY** to add a new keypair.

Click **SUBMIT** to submit the authorization information.
-->
### 配置您的提供商

添加您的 Packet API 密钥。选择您的默认 StackPointCloud SSH 密钥对，或者点击 **ADD SSH KEY** 来添加一个新的密钥对。

点击 **SUBMIT** 来提交验证信息。

<!--
### Configure Your Cluster

Choose any extra options you may want to include with your cluster, then click **SUBMIT** to create the cluster. 
-->
### 配置您的集群

选择您希望包含在集群中的任何其他选项，然后单击 **SUBMIT** 创建集群。

<!--
### Running the Cluster

You can monitor the status of your cluster and suspend or delete it from [your stackpoint.io dashboard](https://stackpoint.io/#/clusters).

For information on using and managing a Kubernetes cluster on Packet, consult [the official documentation](/docs/home/).
-->
### 运行集群

您能通过 [您的 stackpoint.io 面板](https://stackpoint.io/#/clusters) 来管理集群状态，也能进行挂起和删除操作。

对于如何在 Packet 上使用和管理 Kubernetes 集群，请参阅 [官方文档](/docs/home/)。
