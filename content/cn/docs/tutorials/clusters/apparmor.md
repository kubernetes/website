---
reviewers:
- stclair
title: AppArmor
---

{% capture overview %}

{% assign for_k8s_version="v1.4" %}{% include feature-state-beta.md %}


AppArmor是一个Linux内核安全模块，它补充标准的Linux用户和组权限以将程序限制在一组有限的资源中。可以为任何应用程序配置AppArmor，以减少其潜在的攻击面并提供更深入的防御。它通过调整配置文件，将特定程序或容器所需的访问权限列入白名单，例如Linux功能，网络访问，文件权限等。每个配置文件都可以在两种模式下运行，一种是强制模式，可以保持对资源的访问许可，另一种是投诉模式，仅报告违规行为。

AppArmor可以帮助用户实现：通过限制容器运行以获得更安全的部署，通过系统日志提供更好的审计。然而，需要注意的是，AppArmor功能是有限的，它在防止程序代码漏洞上，也只能做这些了。重要的是提供好的、限制性的配置文件，并在其他方面强化应用程序和集群。


{% endcapture %}

{% capture objectives %}

* 看一个如何在一个节点上加载配置文件的例子
* 学习如何在Pod上增强配置
* 学习如何检查加载的配置文件
* 当配置文件冲突的时候会怎样
* 看看配置文件加载失败会怎样

{% endcapture %}

{% capture prerequisites %}

请确保:

1. Kubernetes 的版本不能低于v1.4 -- Kubernetes对AppArmor的支持是从v1.4开始的。 低于Kubernetes1.4的版本将无视AppArmor的注释及设置。 请用如下方法节点的版本:

   ```shell
   $ kubectl get nodes -o=jsonpath=$'{range .items[*]}{@.metadata.name}: {@.status.nodeInfo.kubeletVersion}\n{end}'
   gke-test-default-pool-239f5d02-gyn2: v1.4.0
   gke-test-default-pool-239f5d02-x1kf: v1.4.0
   gke-test-default-pool-239f5d02-xwux: v1.4.0
   ```

2. AppArmor kernel module is enabled -- For the Linux kernel to enforce an AppArmor profile, the
   AppArmor kernel module must be installed and enabled. Several distributions enable the module by
   default, such as Ubuntu and SUSE, and many others provide optional support. To check whether the
   module is enabled, check the `/sys/module/apparmor/parameters/enabled` file:
