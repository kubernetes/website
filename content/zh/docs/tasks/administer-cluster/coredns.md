---
reviewers:
- johnbelamaric
title: 使用 CoreDNS 进行服务发现
min-kubernetes-server-version: v1.9
content_type: task
---

<!--
---
reviewers:
- johnbelamaric
title: Using CoreDNS for Service Discovery
min-kubernetes-server-version: v1.9
content_type: task
---
-->

<!-- overview -->

<!--
This page describes the CoreDNS upgrade process and how to install CoreDNS instead of kube-dns.
-->
此页面介绍了 CoreDNS 升级过程以及如何安装 CoreDNS 而不是 kube-dns。



## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}


<!-- steps -->

<!--
## About CoreDNS
-->

## 关于 CoreDNS

<!--
[CoreDNS](https://coredns.io) is a flexible, extensible DNS server that can serve as the Kubernetes cluster DNS.
Like Kubernetes, the CoreDNS project is hosted by the {{< glossary_tooltip text="CNCF" term_id="cncf" >}}.
-->
[CoreDNS](https://coredns.io) 是一个灵活可扩展的 DNS 服务器，可以作为 Kubernetes 集群 DNS。与 Kubernetes 一样，CoreDNS 项目由 {{< glossary_tooltip text="CNCF" term_id="cncf" >}} 托管。

<!--
You can use CoreDNS instead of kube-dns in your cluster by replacing kube-dns in an existing
deployment, or by using tools like kubeadm that will deploy and upgrade the cluster for you.
-->
通过在现有的集群中替换 kube-dns，可以在集群中使用 CoreDNS 代替 kube-dns 部署，或者使用 kubeadm 等工具来为您部署和升级集群。

<!--
## Installing CoreDNS
-->

## 安装 CoreDNS

<!--
For manual deployment or replacement of kube-dns, see the documentation at the
[CoreDNS GitHub project.](https://github.com/coredns/deployment/tree/master/kubernetes)
-->
有关手动部署或替换 kube-dns，请参阅 [CoreDNS GitHub 工程](https://github.com/coredns/deployment/tree/master/kubernetes)。

<!--
## Migrating to CoreDNS
-->
## 迁移到 CoreDNS

<!--
## Upgrading an existing cluster with kubeadm
-->

## 使用 kubeadm 升级现有集群

<!--
In Kubernetes version 1.10 and later, you can also move to CoreDNS when you use `kubeadm` to upgrade
a cluster that is using `kube-dns`. In this case, `kubeadm` will generate the CoreDNS configuration
("Corefile") based upon the `kube-dns` ConfigMap, preserving configurations for federation,
stub domains, and upstream name server.
-->
在 Kubernetes 1.10 及更高版本中，当您使用 `kubeadm` 升级使用 `kube-dns` 的集群时，您还可以迁移到 CoreDNS。
在本例中 `kubeadm` 将生成 CoreDNS 配置（"Corefile"）基于 `kube-dns` ConfigMap，保存联邦、存根域和上游名称服务器的配置。

<!--
If you are moving from kube-dns to CoreDNS, make sure to set the `CoreDNS` feature gate to `true`
during an upgrade. For example, here is what a `v1.11.0` upgrade would look like:
-->
如果您正在从 kube-dns 迁移到 CoreDNS，请确保在升级期间将 `CoreDNS` 特性门设置为 `true`。例如，`v1.11.0` 升级应该是这样的:

```
kubeadm upgrade apply v1.11.0 --feature-gates=CoreDNS=true
```

<!--
In Kubernetes version 1.13 and later the `CoreDNS` feature gate is removed and CoreDNS
is used by default. Follow the guide outlined [here](/docs/reference/setup-tools/kubeadm/kubeadm-init-phase#cmd-phase-addon) if you want
your upgraded cluster to use kube-dns.
-->
在 Kubernetes 版本 1.13 和更高版本中，`CoreDNS`特性门已经删除，CoreDNS 在默认情况下使用。
如果您想升级集群以使用 kube-dns，请遵循
[此处](/docs/reference/setup-tools/kubeadm/kubeadm-init-phase#cmd-phase-addon) 。

<!--
In versions prior to 1.11 the Corefile will be **overwritten** by the one created during upgrade.
**You should save your existing ConfigMap if you have customized it.** You may re-apply your
customizations after the new ConfigMap is up and running.
-->
在 1.11 之前的版本中，核心文件将被升级过程中创建的文件覆盖。
**如果已对其进行自定义，则应保存现有的 ConfigMap。** 在新的 ConfigMap 启动并运行后，您可以重新应用自定义。

<!--
If you are running CoreDNS in Kubernetes version 1.11 and later, during upgrade,
your existing Corefile will be retained.
-->
如果您在 Kubernetes 1.11 及更高版本中运行 CoreDNS，则在升级期间，将保留现有的 Corefile。

<!--
## Installing kube-dns instead of CoreDNS with kubeadm
-->
## 使用 kubeadm 安装 kube-dns 而不是 CoreDNS

{{< note >}}

<!--
In Kubernetes 1.11, CoreDNS has graduated to General Availability (GA)
and is installed by default.
-->
在 Kubernetes 1.11 中，CoreDNS 已经升级到通用可用性(GA)，并默认安装。

{{< /note >}}

<!--
To install kube-dns on versions prior to 1.13, set the `CoreDNS` feature gate
value to `false`:
-->
若要在1.13之前到版本上安装 kube-dns，请将 `CoreDNS` 特性门值设置为 `false`：

```
kubeadm init --feature-gates=CoreDNS=false
```

<!--
For versions 1.13 and later, follow the guide outlined [here](/docs/reference/setup-tools/kubeadm/kubeadm-init-phase#cmd-phase-addon).
-->
对于 1.13 版和更高版本，请遵循[此处](/docs/reference/setup-tools/kubeadm/kubeadm-init-phase#cmd-phase-addon)概述到指南。

<!--
## Upgrading CoreDNS 
-->
## 升级 CoreDNS 

<!--
CoreDNS is available in Kubernetes since v1.9. 
You can check the version of CoreDNS shipped with Kubernetes and the changes made to CoreDNS [here](https://github.com/coredns/deployment/blob/master/kubernetes/CoreDNS-k8s_version.md).
-->
从 v1.9 起，Kubernetes 提供了 CoreDNS。
您可以在[此处](https://github.com/coredns/deployment/blob/master/kubernetes/CoreDNS-k8s_version.md)检查 Kubernetes 随附的 CoreDNS 版本以及对 CoreDNS 所做的更改。

<!--
CoreDNS can be upgraded manually in case you want to only upgrade CoreDNS or use your own custom image.
There is a helpful [guideline and walkthrough](https://github.com/coredns/deployment/blob/master/kubernetes/Upgrading_CoreDNS.md) available to ensure a smooth upgrade.
-->
如果您只想升级 CoreDNS 或使用自己的自定义镜像，则可以手动升级 CoreDNS。

<!--
## Tuning CoreDNS
-->

## CoreDNS 调优

<!--
When resource utilisation is a concern, it may be useful to tune the configuration of CoreDNS. For more details, check out the
[documentation on scaling CoreDNS]((https://github.com/coredns/deployment/blob/master/kubernetes/Scaling_CoreDNS.md)).
-->
当涉及到资源利用时，优化内核的配置可能是有用的。有关详细信息，请参阅 [关于扩展 CoreDNS 的文档](https://github.com/coredns/deployment/blob/master/kubernetes/Scaling_CoreDNS.md)。



## {{% heading "whatsnext" %}}


<!--
You can configure [CoreDNS](https://coredns.io) to support many more use cases than
kube-dns by modifying the `Corefile`. For more information, see the
[CoreDNS site](https://coredns.io/2017/05/08/custom-dns-entries-for-kubernetes/).
-->
您可以通过修改 `Corefile` 来配置 [CoreDNS](https://coredns.io)，以支持比 ku-dns 更多的用例。有关更多信息，请参考 [CoreDNS 网站](https://coredns.io/2017/05/08/custom-dns-entries-for-kubernetes/)。




