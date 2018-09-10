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
{% raw  %}

{{% capture overview %}}

You can run Kubernetes almost anywhere, from your laptop to VMs on a cloud
provider to a rack of bare metal servers. Deciding where to run Kubernetes
depends on how much effort you're willing to give and how much flexibility you
need.

Set up a fully-managed cluster by running a single command or craft your own
customized cluster for your bare metal servers. Use this page to find a
solution from a [Certified Kubernetes Service Provider](/partners/#kcsp)
that fits your needs.

{{% /capture %}}

{{% capture body %}}

## Local-machine Solutions

Using a local-machine solution is a perfect way to get started with Kubernetes.
You can devlop and test containerized apps without

* [Minikube](/docs/setup/minikube/) is the recommended method for creating a
local, single-node Kubernetes cluster for development and testing. Setup is
completely automated and doesn't require a cloud provider account.

* [IBM Cloud Private-CE (Community Edition)](https://github.com/IBM/deploy-ibm-cloud-private)
can use VirtualBox on your machine to deploy Kubernetes to one or more VMs for
development and test scenarios. Scales to full multi-node cluster.

* [IBM Cloud Private-CE (Community Edition) on Linux Containers](https://github.com/HSBawa/icp-ce-on-linux-containers) is a
Terraform/Packer/BASH based Infrastructure as Code (IaC) scripts to create a
seven node (1 Boot, 1 Master, 1 Management, 1 Proxy and 3 Workers) LXD cluster
on  Linux Host.

* [Kubeadm-dind](https://github.com/kubernetes-sigs/kubeadm-dind-cluster) is a
multi-node (while minikube is single-node) Kubernetes cluster which only
requires a docker daemon. It uses docker-in-docker technique to spawn the
Kubernetes cluster.

* [Ubuntu on LXD](/docs/getting-started-guides/ubuntu/local/) supports a
nine-instance deployment on localhost.

## Hosted Solutions

Hosted solutions are the easiest way to create and maintain Kubernetes clusters.
If you don't have your own data centers or dedicated SRE team to ensure your
containerized apps are highly available, pick one of these solutions:

* [Giant Swarm](https://giantswarm.io/product/) offers managed Kubernetes
clusters in their own datacenter, on-premises, or on public clouds.

* [IBM Cloud Container Service](https://console.bluemix.net/docs/containers/container_index.html)
offers managed Kubernetes clusters with isolation choice, operational tools,
integrated security insight into images and containers, and integration with
Watson, IoT, and data.

* [Stackpoint.io](https://stackpoint.io) provides Kubernetes infrastructure
automation and management for multiple public clouds.

### Turnkey Cloud Solutions

These solutions allow you to create Kubernetes clusters on a range of Cloud IaaS
providers with only a few commands. These solutions are actively developed and
have active community support.

* [Alibaba Cloud](/docs/setup/turnkey/alibaba-cloud/)
* [IBM Cloud](https://github.com/patrocinio/kubernetes-softlayer)
* [Kubermatic](https://cloud.kubermatic.io)
* [Stackpoint.io](/docs/setup/turnkey/stackpoint/)
* [Tectonic by CoreOS](https://coreos.com/tectonic)

### On-Premises turnkey cloud solutions
These solutions allow you to create Kubernetes clusters on your internal, secure,
cloud network with only a few commands.

* [Giant Swarm](https://giantswarm.io/product/)
* [IBM Cloud Private](https://www.ibm.com/cloud-computing/products/ibm-cloud-private/)
* [Kubermatic](https://www.loodse.com)

## Custom Solutions



{{% /capture %}}

{{% capture whatsnext %}}
Go to [Picking the Right Solution](/docs/setup/pick-right-solution/)to see solutions from uncertified Kubernetes Service Providers.
{{% /capture %}}

{% endraw %}
