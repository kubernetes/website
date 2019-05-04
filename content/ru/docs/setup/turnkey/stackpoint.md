---
reviewers:
- baldwinspc
title: Running Kubernetes on Multiple Clouds with Stackpoint.io
content_template: templates/concept
---

{{% capture overview %}}

[StackPointCloud](https://stackpoint.io/) is the universal control plane for Kubernetes Anywhere. StackPointCloud allows you to deploy and manage a Kubernetes cluster to the cloud provider of your choice in 3 steps using a web-based interface.

{{% /capture %}}

{{% capture body %}}

## AWS

To create a Kubernetes cluster on AWS, you will need an Access Key ID and a Secret Access Key from AWS.

1. Choose a Provider

    a. Log in to [stackpoint.io](https://stackpoint.io) with a GitHub, Google, or Twitter account.

    b. Click **+ADD A CLUSTER NOW**.

    c. Click to select Amazon Web Services (AWS).

1. Configure Your Provider

    a. Add your Access Key ID and a Secret Access Key from AWS. Select your default StackPointCloud SSH keypair, or click **ADD SSH KEY** to add a new keypair.

    b. Click **SUBMIT** to submit the authorization information.

1. Configure Your Cluster

    Choose any extra options you may want to include with your cluster, then click **SUBMIT** to create the cluster. 

1. Run the Cluster

    You can monitor the status of your cluster and suspend or delete it from [your stackpoint.io dashboard](https://stackpoint.io/#/clusters).

    For information on using and managing a Kubernetes cluster on AWS, [consult the  Kubernetes documentation](/docs/getting-started-guides/aws/).


## GCE

To create a Kubernetes cluster on GCE, you will need the Service Account JSON Data from Google.

1. Choose a Provider

    a. Log in to [stackpoint.io](https://stackpoint.io) with a GitHub, Google, or Twitter account.

    b. Click **+ADD A CLUSTER NOW**.

    c. Click to select Google Compute Engine (GCE).

1. Configure Your Provider

    a. Add your Service Account JSON Data from Google. Select your default StackPointCloud SSH keypair, or click **ADD SSH KEY** to add a new keypair.

    b. Click **SUBMIT** to submit the authorization information.

1. Configure Your Cluster

    Choose any extra options you may want to include with your cluster, then click **SUBMIT** to create the cluster. 

1. Run the Cluster

    You can monitor the status of your cluster and suspend or delete it from [your stackpoint.io dashboard](https://stackpoint.io/#/clusters).

    For information on using and managing a Kubernetes cluster on GCE, [consult the  Kubernetes documentation](/docs/getting-started-guides/gce/).


## Google Kubernetes Engine

To create a Kubernetes cluster on Google Kubernetes Engine, you will need the Service Account JSON Data from Google.

1. Choose a Provider

    a. Log in to [stackpoint.io](https://stackpoint.io) with a GitHub, Google, or Twitter account.

    b. Click **+ADD A CLUSTER NOW**.

    c. Click to select Google Kubernetes Engine.

1. Configure Your Provider

    a. Add your Service Account JSON Data from Google. Select your default StackPointCloud SSH keypair, or click **ADD SSH KEY** to add a new keypair.

    b. Click **SUBMIT** to submit the authorization information.

1. Configure Your Cluster

    Choose any extra options you may want to include with your cluster, then click **SUBMIT** to create the cluster. 

1. Run the Cluster

    You can monitor the status of your cluster and suspend or delete it from [your stackpoint.io dashboard](https://stackpoint.io/#/clusters).

    For information on using and managing a Kubernetes cluster on Google Kubernetes Engine, consult [the official documentation](/docs/home/).


## DigitalOcean

To create a Kubernetes cluster on DigitalOcean, you will need a DigitalOcean API Token.

1. Choose a Provider

    a. Log in to [stackpoint.io](https://stackpoint.io) with a GitHub, Google, or Twitter account.

    b. Click **+ADD A CLUSTER NOW**.

    c. Click to select DigitalOcean.

1. Configure Your Provider

    a. Add your DigitalOcean API Token. Select your default StackPointCloud SSH keypair, or click **ADD SSH KEY** to add a new keypair.

    b. Click **SUBMIT** to submit the authorization information.

1. Configure Your Cluster

    Choose any extra options you may want to include with your cluster, then click **SUBMIT** to create the cluster. 

1. Run the Cluster

    You can monitor the status of your cluster and suspend or delete it from [your stackpoint.io dashboard](https://stackpoint.io/#/clusters).

    For information on using and managing a Kubernetes cluster on DigitalOcean, consult [the official documentation](/docs/home/).


## Microsoft Azure

To create a Kubernetes cluster on Microsoft Azure, you will need an Azure Subscription ID, Username/Email, and Password.

1. Choose a Provider

    a. Log in to [stackpoint.io](https://stackpoint.io) with a GitHub, Google, or Twitter account.

    b. Click **+ADD A CLUSTER NOW**.

    c. Click to select Microsoft Azure.

1. Configure Your Provider

    a. Add your Azure Subscription ID, Username/Email, and Password. Select your default StackPointCloud SSH keypair, or click **ADD SSH KEY** to add a new keypair.

    b. Click **SUBMIT** to submit the authorization information.

1. Configure Your Cluster

    Choose any extra options you may want to include with your cluster, then click **SUBMIT** to create the cluster. 

1. Run the Cluster

    You can monitor the status of your cluster and suspend or delete it from [your stackpoint.io dashboard](https://stackpoint.io/#/clusters).

    For information on using and managing a Kubernetes cluster on Azure, [consult the  Kubernetes documentation](/docs/getting-started-guides/azure/).


## Packet

To create a Kubernetes cluster on Packet, you will need a Packet API Key.

1. Choose a Provider

    a. Log in to [stackpoint.io](https://stackpoint.io) with a GitHub, Google, or Twitter account.

    b. Click **+ADD A CLUSTER NOW**.

    c. Click to select Packet.

1. Configure Your Provider

    a. Add your Packet API Key. Select your default StackPointCloud SSH keypair, or click **ADD SSH KEY** to add a new keypair.

    b. Click **SUBMIT** to submit the authorization information.

1. Configure Your Cluster

    Choose any extra options you may want to include with your cluster, then click **SUBMIT** to create the cluster. 

1. Run the Cluster

    You can monitor the status of your cluster and suspend or delete it from [your stackpoint.io dashboard](https://stackpoint.io/#/clusters).

    For information on using and managing a Kubernetes cluster on Packet, consult [the official documentation](/docs/home/).

{{% /capture %}}
