---
title: Installing Kubernetes with deployment tools
weight: 30
no_list: true
---

There are many methods and tools for setting up your own production Kubernetes cluster.
For example:

- [kubeadm](/docs/setup/production-environment/tools/kubeadm/)

- [Cluster API](https://cluster-api.sigs.k8s.io/): A Kubernetes sub-project focused on
  providing declarative APIs and tooling to simplify provisioning, upgrading, and operating
  multiple Kubernetes clusters.
  
- [kops](https://kops.sigs.k8s.io/): An automated cluster provisioning tool.
  For tutorials, best practices, configuration options  and information on
  reaching out to the community, please check the
  [`kOps` website](https://kops.sigs.k8s.io/) for details.

- [kubespray](https://kubespray.io/):
  A composition of [Ansible](https://docs.ansible.com/) playbooks,
  [inventory](https://github.com/kubernetes-sigs/kubespray/blob/master/docs/ansible.md#inventory),
  provisioning tools, and domain knowledge for generic OS/Kubernetes clusters configuration
  management tasks. You can reach out to the community on Slack channel
  [#kubespray](https://kubernetes.slack.com/messages/kubespray/).

