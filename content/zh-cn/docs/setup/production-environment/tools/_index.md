---
title: 使用部署工具安装 Kubernetes
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
搭建你自己的 Kubernetes 生产集群有许多方法和工具。例如：

- [kubeadm](/zh-cn/docs/setup/production-environment/tools/kubeadm/)

<!--
- [Cluster API](https://cluster-api.sigs.k8s.io/): A Kubernetes sub-project focused on
  providing declarative APIs and tooling to simplify provisioning, upgrading, and operating
  multiple Kubernetes clusters.
-->
- [Cluster API](https://cluster-api.sigs.k8s.io/): 
  一个 Kubernetes 子项目，专注于提供声明式 API 和工具，以简化多个 Kubernetes 集群的配置、升级和操作。

<!--
- [kops](https://kops.sigs.k8s.io/): An automated cluster provisioning tool.
  For tutorials, best practices, configuration options  and information on
  reaching out to the community, please check the
  [`kOps` website](https://kops.sigs.k8s.io/) for details.
-->
- [kops](https://kops.sigs.k8s.io/)：自动化集群制备工具。
  有关教程、最佳实践、配置选项和社区联系信息，请查阅
  [`kOps` 网站](https://kops.sigs.k8s.io/)。

<!--
- [kubespray](https://kubespray.io/):
  A composition of [Ansible](https://docs.ansible.com/) playbooks,
  [inventory](https://github.com/kubernetes-sigs/kubespray/blob/master/docs/ansible.md#inventory),
  provisioning tools, and domain knowledge for generic OS/Kubernetes clusters configuration
  management tasks. You can reach out to the community on Slack channel
  [#kubespray](https://kubernetes.slack.com/messages/kubespray/).
-->
- [kubespray](https://kubespray.io/)：
  提供了 [Ansible](https://docs.ansible.com/) Playbook、
  [清单（inventory）](https://github.com/kubernetes-sigs/kubespray/blob/master/docs/ansible.md#inventory)、
  制备工具和通用 OS/Kubernetes 集群配置管理任务领域的知识。
  你可以通过 Slack 频道 [#kubespray](https://kubernetes.slack.com/messages/kubespray/) 联系此社区。
