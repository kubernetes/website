---
title: 使用部署工具安裝 Kubernetes
weight: 30
no_list: true
---
<!--
title: Installing Kubernetes with deployment tools
weight: 30
no_list: true
-->

<!--
There are many methods and tools for setting up your own production Kubernetes cluster.
For example:

- [kubeadm](/docs/setup/production-environment/tools/kubeadm/)
-->
搭建你自己的 Kubernetes 生產叢集有許多方法和工具。例如：

- [kubeadm](/zh-cn/docs/setup/production-environment/tools/kubeadm/)

<!--
- [Cluster API](https://cluster-api.sigs.k8s.io/): A Kubernetes sub-project focused on
  providing declarative APIs and tooling to simplify provisioning, upgrading, and operating
  multiple Kubernetes clusters.
-->
- [Cluster API](https://cluster-api.sigs.k8s.io/)：
  一個 Kubernetes 子項目，專注於提供聲明式 API 和工具，以簡化多個 Kubernetes 叢集的安裝、升級和操作。

<!--
- [kops](https://kops.sigs.k8s.io/): An automated cluster provisioning tool.
  For tutorials, best practices, configuration options  and information on
  reaching out to the community, please check the
  [`kOps` website](https://kops.sigs.k8s.io/) for details.
-->
- [kOps](https://kops.sigs.k8s.io/)：自動化叢集製備工具。
  有關教程、最佳實踐、設定選項和社區聯繫信息，請查閱
  [`kOps` 網站](https://kops.sigs.k8s.io/)。

<!--
- [kubespray](https://kubespray.io/):
  A composition of [Ansible](https://docs.ansible.com/) playbooks,
  [inventory](https://github.com/kubernetes-sigs/kubespray/blob/master/docs/ansible/inventory.md),
  provisioning tools, and domain knowledge for generic OS/Kubernetes clusters configuration
  management tasks. You can reach out to the community on Slack channel
  [#kubespray](https://kubernetes.slack.com/messages/kubespray/).
-->
- [Kubespray](https://kubespray.io/)：
  提供了 [Ansible](https://docs.ansible.com/) Playbook、
  [清單（Inventory）](https://github.com/kubernetes-sigs/kubespray/blob/master/docs/ansible/inventory.md)、
  製備工具和通用操作系統及 Kubernetes 叢集設定管理任務領域的知識。
  你可以通過 Slack 頻道 [#kubespray](https://kubernetes.slack.com/messages/kubespray/) 聯繫此社區。
