---
title: Installing Kubernetes On-premise/Cloud Providers with Kubespray
---

## Overview

This quickstart helps to install a Kubernetes cluster hosted
on GCE, Azure, OpenStack, AWS or Baremetal with
[`Kubespray`](https://github.com/kubernetes-incubator/kubespray) tool.

Kubespray is a composition of [Ansible](http://docs.ansible.com/) playbooks,
[inventory](https://github.com/kubernetes-incubator/kubespray/blob/master/docs/ansible.md)
generation CLI tools and domain knowledge for generic OS/Kubernetes
clusters configuration management tasks. It provides:

* [High available cluster](https://github.com/kubernetes-incubator/kubespray/blob/master/docs/ha-mode.md)
* [Composable](https://github.com/kubernetes-incubator/kubespray/blob/master/docs/vars.md)
  (Choice of the network plugin, for instance)
* Support most popular Linux
  [distributions](https://github.com/kubernetes-incubator/kubespray#supported-linux-distributions)
* Continuous integration tests

To choose a tool which fits your use case the best, you may want to read this
[comparison](https://github.com/kubernetes-incubator/kubespray/blob/master/docs/comparisons.md)
to [kubeadm](../kubeadm) and [kops](../kops).

## Creating a cluster

### (1/4) Ensure the underlay [requirements](https://github.com/kubernetes-incubator/kubespray#requirements) are met

#### Checklist

* You must have cloud instances or baremetal nodes running for your future Kubernetes cluster.
  A way to achieve that is to use the
  [kubespray-cli tool](https://github.com/kubernetes-incubator/kubespray/blob/master/docs/getting-started.md).
* Or provision baremetal hosts with a tool-of-your-choice or launch cloud instances,
  then create an inventory file for Ansible with this [tool](https://github.com/kubernetes-incubator/kubespray/blob/master/contrib/inventory_builder/inventory.py).

### (2/4) Compose the deployment

#### Checklist

* Customize your deployment by usual Ansible meanings, which is
  [generating inventory](https://github.com/kubernetes-incubator/kubespray/blob/master/docs/getting-started.md#building-your-own-inventory)
  and overriding default data [variables](https://github.com/kubernetes-incubator/kubespray/blob/master/docs/vars.md).
  Or just stick with default values (Kubespray will choose Calico networking plugin for you
  then). This includes steps like deciding on the:
  * DNS [configuration options](https://github.com/kubernetes-incubator/kubespray/blob/master/docs/dns-stack.md)
  * [Networking plugin](https://github.com/kubernetes-incubator/kubespray#network-plugins) to use
  * [Versions](https://github.com/kubernetes-incubator/kubespray#versions-of-supported-components)
    of components.
  * Additional node groups like [bastion hosts](https://github.com/kubernetes-incubator/kubespray/blob/master/docs/ansible.md#bastion-host) or
    [Calico BGP route reflectors](https://github.com/kubernetes-incubator/kubespray/blob/master/docs/calico.md#optional--bgp-peering-with-border-routers).
* Plan custom deployment steps, if any, or use the default composition layer in the
  [cluster definition file](https://github.com/kubernetes-incubator/kubespray/blob/master/cluster.yml).
  Taking the best from Ansible world, Kubespray allows users to execute arbitrary steps via the
  ``ansible-playbook`` with given inventory, playbooks, data overrides and tags, limits, batches
  of nodes to deploy and so on.
* For large deployments (100+ nodes), you may want to
  [tweak things](https://github.com/kubernetes-incubator/kubespray/blob/master/docs/large-deployments.md)
  for best results.

### (3/4) Run the deployment

#### Checklist

* Apply deployment with
 [kubespray-cli tool](https://github.com/kubernetes-incubator/kubespray/blob/master/docs/getting-started.md)
  or ``ansible-playbook``
 [manual commands](https://github.com/kubernetes-incubator/kubespray/blob/master/docs/getting-started.md#starting-custom-deployment).

### (4/4) (Optional) verify inter-pods connectivity and DNS resolve with [Netchecker](https://github.com/kubernetes-incubator/kubespray/blob/master/docs/netcheck.md)

#### Checklist

* Ensure the netchecker-agent's pods can resolve DNS requests and ping each over within the default namespace.
  Those pods mimic similar behavior of the rest of the workloads and serve as cluster health indicators.

## Explore contributed add-ons

See the [list of contributed playbooks](https://github.com/kubernetes-incubator/kubespray/tree/master/contrib)
to explore other deployment options.

## What's next

Kubespray has quite a few [marks on the radar](https://github.com/kubernetes-incubator/kubespray/blob/master/docs/roadmap.md).

## Cleanup

To delete your scratch cluster, you can apply the
[reset role](https://github.com/kubernetes-incubator/kubespray/blob/master/roles/reset/tasks/main.yml)
with the manual ``ansible-playbook`` command.

Note, that it is highly unrecommended to delete production clusters with the reset playbook!

## Feedback

* Slack Channel: [#kubespray](https://kubernetes.slack.com/messages/kubespray/)
* [GitHub Issues](https://github.com/kubernetes-incubator/kubespray/issues)
