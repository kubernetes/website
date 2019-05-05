---
reviewers:
- johnbelamaric
title: 使用 CoreDNS 进行服务发现
min-kubernetes-server-version: v1.9
content_template: templates/task
---

<!--
---
reviewers:
- johnbelamaric
title: Using CoreDNS for Service Discovery
min-kubernetes-server-version: v1.9
content_template: templates/task
---
-->

{{% capture overview %}}

<!--
This page describes the CoreDNS upgrade process and how to install CoreDNS instead of kube-dns.
-->
此页面介绍了 CoreDNS 升级过程以及如何安装 CoreDNS 而不是 kube-dns。

{{% /capture %}}

{{% capture prerequisites %}}
{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}
{{% /capture %}}

{{% capture steps %}}

<!--
## About CoreDNS
-->

## 关于 CoreDNS

<!--
[CoreDNS](https://coredns.io) is a flexible, extensible DNS server that can serve as the Kubernetes cluster DNS.
Like Kubernetes, the CoreDNS project is hosted by the [CNCF.](http://www.cncf.io)
-->
[CoreDNS](https://coredns.io) 是一个灵活可扩展的 DNS 服务器，可以作为 Kubernetes 集群 DNS。与 Kubernetes 一样，CoreDNS 项目由 CNCF(http://www.cncf.io) 持有。

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
To install kube-dns instead, set the `CoreDNS` feature gate
value to `false`:
-->
若要安装 kube-dns，请将 `CoreDNS` 特性门值设置为 `false`：

```
kubeadm init --feature-gates=CoreDNS=false
```

<!--
## Tuning CoreDNS
-->

## CoreDNS 调优

<!--
When resource utilisation is a concern, it may be useful to tune the configuration of CoreDNS. For more details, check out the
[documentation on scaling CoreDNS]((https://github.com/coredns/deployment/blob/master/kubernetes/Scaling_CoreDNS.md)).
-->
当涉及到资源利用时，优化内核的配置可能是有用的。有关详细信息，请参阅 [关于扩展 CoreDNS 的文档]((https://github.com/coredns/deployment/blob/master/kubernetes/Scaling_CoreDNS.md))。

{{% /capture %}}

{{% capture whatsnext %}}

<!--
You can configure [CoreDNS](https://coredns.io) to support many more use cases than
kube-dns by modifying the `Corefile`. For more information, see the
[CoreDNS site](https://coredns.io/2017/05/08/custom-dns-entries-for-kubernetes/).
-->
您可以通过修改 `Corefile` 来配置 [CoreDNS](https://coredns.io)，以支持比 ku-dns 更多的用例。有关更多信息，请参考 [CoreDNS 网站](https://coredns.io/2017/05/08/custom-dns-entries-for-kubernetes/)。

{{% /capture %}}


