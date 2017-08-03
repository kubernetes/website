---
title: Installing Kubernetes On-premises/Cloud Providers with Kubespray
---

## Overview

This quickstart helps to install a Kubernetes cluster hosted on GCE, Azure, OpenStack, AWS, or Baremetal with [Kubespray](https://github.com/kubernetes-incubator/kubespray) tool.

Kubespray is a composition of [Ansible](http://docs.ansible.com/) playbooks, [inventory](https://github.com/kubernetes-incubator/kubespray/blob/master/docs/ansible.md), provisioning tools, and domain knowledge for generic OS/Kubernetes clusters configuration management tasks. It provides:

* Highly available cluster
* Composable
* Supports most popular Linux distributions
* Continuous integration tests

To choose a tool which fits your use case the best, you may want to read this [comparison](https://github.com/kubernetes-incubator/kubespray/blob/master/docs/comparisons.md) to [kubeadm](../kubeadm) and [kops](../kops).

## Creating a cluster

### (1/5) Ensure the underlay [requirements](https://github.com/kubernetes-incubator/kubespray#requirements) are met

This includes:

* `Ansible v2.3` (or newer) 
* `Jinja 2.9` (or newer) 
* `python-netaddr` is installed on the machine that will run Ansible commands
* The target servers must have access to the Internet in order to pull docker images.
* The target servers are configured to allow IPv4 forwarding.
* The target servers have SSH connectivity ( tcp/22 ) either directly to your nodes or through a bastion host/ssh jump box. 
* The target servers have a privileged user
* Your ssh key must be copied to all the servers that are part of your inventory.
* Firewall rules are configured properly to allow ansible and kubernetes components to communicate. 
* If using a cloud provider, you must have the appropriate credentials available and exported as environment variables

Kubespray provides the following utilities to help provision your environment:

* [Terraform](https://www.terraform.io/) scripts for the following cloud providers
  * [AWS](https://github.com/kubernetes-incubator/kubespray/tree/master/contrib/terraform/aws)
  * [OpenStack](https://github.com/kubernetes-incubator/kubespray/tree/master/contrib/terraform/aws)
* [kubespray-cli tool](https://github.com/kubernetes-incubator/kubespray/blob/master/docs/getting-started.md) *Note* This tool is no longer actively maintained

### (2/5) Compose an inventory file

Once you have your servers provisioned and the base requirements met, its time to create an [inventory file for Ansible](http://docs.ansible.com/ansible/intro_inventory.html). This can be done manually or via a dynamic inventory script. The following guide will help you get started with creating your [inventory file](https://github.com/kubernetes-incubator/kubespray/blob/master/docs/getting-started.md#building-your-own-inventory). 

### (3/5) Customize the deployment options

Kubespray provides the ability to customize many aspects of the deployment including

* CNI ( networking ) plugin
* DNS configuration
* Choice of how to run the control plane ( native/binary vs containerized with docker or rkt )
* Component versions
* Calico route reflectors
* Component runtime options
* Certificate generation methods

These customizations can be made to a [variable file](http://docs.ansible.com/ansible/playbooks_variables.html). If you are just getting started with Kubespray, you may want to use the Kubespray defaults to deploy your cluster to explore Kubernetes.

### (4/5) Deploy a Cluster

Once you have planned out your cluster deployment it is time to deploy your cluster. This can be done in one of two methods:

* [ansible-playbook](https://github.com/kubernetes-incubator/kubespray/blob/master/docs/getting-started.md#starting-custom-deployment).
* [kubespray-cli tool](https://github.com/kubernetes-incubator/kubespray/blob/master/docs/getting-started.md) *Note* This tool is no longer actively maintained

Both methods will run the default [cluster definition file](https://github.com/kubernetes-incubator/kubespray/blob/master/cluster.yml).

For large deployments (100+ nodes), you may want to [tweak things](https://github.com/kubernetes-incubator/kubespray/blob/master/docs/large-deployments.md) for best results.

### (5/5) Verify the deployment (Optional)

Kubespray provides a way to verify  inter-pods connectivity and DNS resolve with [Netchecker](https://github.com/kubernetes-incubator/kubespray/blob/master/docs/netcheck.md). Netchecker ensures the netchecker-agents pods can resolve DNS requests and ping each over within the default namespace. Those pods mimic similar behavior of the rest of the workloads and serve as cluster health indicators.

## Cluster operations

Kubespray provides some additional playbooks to help manage your cluster

### Scale your cluster

You can scale your cluster by running the scale playbook. Additional information can be found [here](https://github.com/kubernetes-incubator/kubespray/blob/master/docs/getting-started.md#Adding-nodes). 

### Upgrade your cluster

You can upgrade your cluster by running the upgrade-cluster playbook. Additional information can be found [here](https://github.com/kubernetes-incubator/kubespray/blob/master/docs/upgrades.md). 

## What's next

Kubespray has quite a few [marks on the radar](https://github.com/kubernetes-incubator/kubespray/blob/master/docs/roadmap.md).

## Cleanup

Kubespray provides the ability to reset your nodes. This means that it will wipe out all components installed Kubespray. This is done via the [reset playbook](https://github.com/kubernetes-incubator/kubespray/blob/master/reset.yml).

Note, you should exercise caution when running the reset playbook and ensure that you do not accidentally target your production cluster!

## Feedback

* Slack Channel: [#kubespray](https://kubernetes.slack.com/messages/kubespray/)
* [GitHub Issues](https://github.com/kubernetes-incubator/kubespray/issues)
