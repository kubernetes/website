---
title: Installing Kubernetes On-premises/Cloud Providers with Kubespray
content_template: templates/concept
---

{{% capture overview %}}

This quickstart helps to install a Kubernetes cluster hosted on GCE, Azure, OpenStack, AWS, vSphere, Oracle Cloud Infrastructure (Experimental) or Baremetal with [Kubespray](https://github.com/kubernetes-incubator/kubespray).
  
Kubespray is a composition of [Ansible](http://docs.ansible.com/) playbooks, [inventory](https://github.com/kubernetes-incubator/kubespray/blob/master/docs/ansible.md), provisioning tools, and domain knowledge for generic OS/Kubernetes clusters configuration management tasks. Kubespray provides:

* a highly available cluster
* composable attributes
* support for most popular Linux distributions
  * Container Linux by CoreOS
  * Debian Jessie, Stretch, Wheezy
  * Ubuntu 16.04, 18.04
  * CentOS/RHEL 7
  * Fedora/CentOS Atomic
  * openSUSE Leap 42.3/Tumbleweed
* continuous integration tests

To choose a tool which best fits your use case, read [this comparison](https://github.com/kubernetes-incubator/kubespray/blob/master/docs/comparisons.md) to [kubeadm](/docs/admin/kubeadm/) and [kops](../kops).

{{% /capture %}}

{{% capture body %}}

## Creating a cluster

### (1/5) Meet the underlay requirements

Provision servers with the following [requirements](https://github.com/kubernetes-incubator/kubespray#requirements):

* **Ansible v2.4 (or newer) and python-netaddr is installed on the machine that will run Ansible commands**
* **Jinja 2.9 (or newer) is required to run the Ansible Playbooks**
* The target servers must have **access to the Internet** in order to pull docker images
* The target servers are configured to allow **IPv4 forwarding**
* **Your ssh key must be copied** to all the servers part of your inventory
* The **firewalls are not managed**, you'll need to implement your own rules the way you used to. in order to avoid any issue during deployment you should disable your firewall
* If kubespray is ran from non-root user account, correct privilege escalation method should be configured in the target servers. Then the `ansible_become` flag or command parameters `--become` or `-b` should be specified

Kubespray provides the following utilities to help provision your environment:

* [Terraform](https://www.terraform.io/) scripts for the following cloud providers:
  * [AWS](https://github.com/kubernetes-incubator/kubespray/tree/master/contrib/terraform/aws)
  * [OpenStack](https://github.com/kubernetes-incubator/kubespray/tree/master/contrib/terraform/openstack)

### (2/5) Compose an inventory file

After you provision your servers, create an [inventory file for Ansible](http://docs.ansible.com/ansible/intro_inventory.html). You can do this manually or via a dynamic inventory script. For more information, see "[Building your own inventory](https://github.com/kubernetes-incubator/kubespray/blob/master/docs/getting-started.md#building-your-own-inventory)".

### (3/5) Plan your cluster deployment

Kubespray provides the ability to customize many aspects of the deployment:

* Choice deployment mode: kubeadm or non-kubeadm
* CNI (networking) plugins
* DNS configuration
* Choice of control plane: native/binary or containerized with docker or rkt
* Component versions
* Calico route reflectors
* Component runtime options
  * docker
  * rkt
  * cri-o
* Certificate generation methods

Kubespray customizations can be made to a [variable file](http://docs.ansible.com/ansible/playbooks_variables.html). If you are just getting started with Kubespray, consider using the Kubespray defaults to deploy your cluster and explore Kubernetes.

### (4/5) Deploy a Cluster

Next, deploy your cluster:

Cluster deployment using [ansible-playbook](https://github.com/kubernetes-incubator/kubespray/blob/master/docs/getting-started.md#starting-custom-deployment).

```shell
ansible-playbook -i your/inventory/hosts.ini cluster.yml -b -v \
  --private-key=~/.ssh/private_key
```

Large deployments (100+ nodes) may require [specific adjustments](https://github.com/kubernetes-incubator/kubespray/blob/master/docs/large-deployments.md) for best results.

### (5/5) Verify the deployment

Kubespray provides a way to verify inter-pod connectivity and DNS resolve with [Netchecker](https://github.com/kubernetes-incubator/kubespray/blob/master/docs/netcheck.md). Netchecker ensures the netchecker-agents pods can resolve DNS requests and ping each over within the default namespace. Those pods mimic similar behavior of the rest of the workloads and serve as cluster health indicators.

## Cluster operations

Kubespray provides additional playbooks to manage your cluster: _scale_ and _upgrade_.

### Scale your cluster

You can add worker nodes from your cluster by running the scale playbook. For more information, see "[Adding nodes](https://github.com/kubernetes-incubator/kubespray/blob/master/docs/getting-started.md#adding-nodes)".
You can remove worker nodes from your cluster by running the remove-node playbook. For more information, see "[Remove nodes](https://github.com/kubernetes-incubator/kubespray/blob/master/docs/getting-started.md#remove-nodes)".

### Upgrade your cluster

You can upgrade your cluster by running the upgrade-cluster playbook. For more information, see "[Upgrades](https://github.com/kubernetes-incubator/kubespray/blob/master/docs/upgrades.md)".

## Cleanup

You can reset your nodes and wipe out all components installed with Kubespray via the [reset playbook](https://github.com/kubernetes-incubator/kubespray/blob/master/reset.yml).

{{< caution >}}
**Caution:** When running the reset playbook, be sure not to accidentally target your production cluster!
{{< /caution >}}

## Feedback

* Slack Channel: [#kubespray](https://kubernetes.slack.com/messages/kubespray/)
* [GitHub Issues](https://github.com/kubernetes-incubator/kubespray/issues)

{{% /capture %}}

{{% capture whatsnext %}}

Check out planned work on Kubespray's [roadmap](https://github.com/kubernetes-incubator/kubespray/blob/master/docs/roadmap.md).

{{% /capture %}}
