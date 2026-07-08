---
title: 使用 CoreDNS 进行服务发现
min-kubernetes-server-version: v1.9
content_type: task
weight: 380
---

<!--
reviewers:
- johnbelamaric
title: Using CoreDNS for Service Discovery
min-kubernetes-server-version: v1.9
content_type: task
weight: 380
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

[CoreDNS](https://coredns.io) is a flexible, extensible DNS server
that can serve as the Kubernetes cluster DNS.
Like Kubernetes, the CoreDNS project is hosted by the
{{< glossary_tooltip text="CNCF" term_id="cncf" >}}.
-->
## 关于 CoreDNS

[CoreDNS](https://coredns.io) 是一个灵活可扩展的 DNS 服务器，可以作为 Kubernetes 集群 DNS。
与 Kubernetes 一样，CoreDNS 项目由 {{< glossary_tooltip text="CNCF" term_id="cncf" >}} 托管。

<!--
You can use CoreDNS instead of kube-dns in your cluster by replacing
kube-dns in an existing deployment, or by using tools like kubeadm
that will deploy and upgrade the cluster for you.
-->
通过替换现有集群部署中的 kube-dns，或者使用 kubeadm 等工具来为你部署和升级集群，
可以在你的集群中使用 CoreDNS 而非 kube-dns。

<!--
## Installing CoreDNS

For manual deployment or replacement of kube-dns, see the documentation at the
[CoreDNS website](https://coredns.io/manual/installation/).
-->
## 安装 CoreDNS

有关手动部署或替换 kube-dns，请参阅
[CoreDNS 网站](https://coredns.io/manual/installation/)。

<!--
## Migrating to CoreDNS

### Upgrading an existing cluster with kubeadm
-->
## 迁移到 CoreDNS

### 使用 kubeadm 升级现有集群

<!--
In Kubernetes version 1.21, kubeadm removed its support for `kube-dns` as a DNS application.
For `kubeadm` v{{< skew currentVersion >}}, the only supported cluster DNS application
is CoreDNS.
-->
在 Kubernetes 1.21 版本中，kubeadm 移除了对将 `kube-dns` 作为 DNS 应用的支持。
对于 `kubeadm` v{{< skew currentVersion >}}，所支持的唯一的集群 DNS 应用是 CoreDNS。

<!--
You can move to CoreDNS when you use `kubeadm` to upgrade a cluster that is
using `kube-dns`. In this case, `kubeadm` generates the CoreDNS configuration
("Corefile") based upon the `kube-dns` ConfigMap, preserving configurations for
stub domains, and upstream name server.
-->
当你使用 `kubeadm` 升级使用 `kube-dns` 的集群时，你还可以执行到 CoreDNS 的迁移。
在这种场景中，`kubeadm` 将基于 `kube-dns` ConfigMap 生成 CoreDNS 配置（"Corefile"），
保存存根域和上游名称服务器的配置。

<!--
## Upgrading CoreDNS 

You can check the version of CoreDNS that kubeadm installs for each version of
Kubernetes in the page
[CoreDNS version in Kubernetes](https://github.com/coredns/deployment/blob/master/kubernetes/CoreDNS-k8s_version.md).
-->
## 升级 CoreDNS 

你可以在
[Kubernetes 中的 CoreDNS 版本](https://github.com/coredns/deployment/blob/master/kubernetes/CoreDNS-k8s_version.md)
页面查看 kubeadm 为不同版本 Kubernetes 所安装的 CoreDNS 版本。

<!--
CoreDNS can be upgraded manually in case you want to only upgrade CoreDNS
or use your own custom image.
There is a helpful [guideline and walkthrough](https://github.com/coredns/deployment/blob/master/kubernetes/Upgrading_CoreDNS.md)
available to ensure a smooth upgrade.
Make sure the existing CoreDNS configuration ("Corefile") is retained when
upgrading your cluster.
-->
如果你只想升级 CoreDNS 或使用自己的定制镜像，也可以手动升级 CoreDNS。
参看[指南和演练](https://github.com/coredns/deployment/blob/master/kubernetes/Upgrading_CoreDNS.md)
文档了解如何平滑升级。
在升级你的集群过程中，请确保现有 CoreDNS 的配置（"Corefile"）被保留下来。

<!--
If you are upgrading your cluster using the `kubeadm` tool, `kubeadm`
can take care of retaining the existing CoreDNS configuration automatically.
-->
如果使用 `kubeadm` 工具来升级集群，则 `kubeadm` 可以自动处理保留现有 CoreDNS
配置这一事项。

<!--
## Tuning CoreDNS

When resource utilisation is a concern, it may be useful to tune the
configuration of CoreDNS. For more details, check out the
[documentation on scaling CoreDNS](https://github.com/coredns/deployment/blob/master/kubernetes/Scaling_CoreDNS.md).
-->
## CoreDNS 调优

当资源利用方面有问题时，优化 CoreDNS 的配置可能是有用的。
有关详细信息，请参阅有关[扩缩 CoreDNS 的文档](https://github.com/coredns/deployment/blob/master/kubernetes/Scaling_CoreDNS.md)。

## {{% heading "whatsnext" %}}

<!--
You can configure [CoreDNS](https://coredns.io) to support many more use cases than
kube-dns does by modifying the CoreDNS configuration ("Corefile").
For more information, see the [documentation](https://coredns.io/plugins/kubernetes/)
for the `kubernetes` CoreDNS plugin, or read the 
[Custom DNS Entries for Kubernetes](https://coredns.io/2017/05/08/custom-dns-entries-for-kubernetes/)
in the CoreDNS blog.
-->
你可以通过修改 CoreDNS 的配置（"Corefile"）来配置 [CoreDNS](https://coredns.io)，
以支持比 kube-dns 更多的用例。
请参考 `kubernetes` CoreDNS 插件的[文档](https://coredns.io/plugins/kubernetes/)
或者 CoreDNS 博客上的博文
[Kubernetes 的自定义 DNS 条目](https://coredns.io/2017/05/08/custom-dns-entries-for-kubernetes/)，
以了解更多信息。
