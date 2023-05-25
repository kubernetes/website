---
title: 为集群配置 DNS
weight: 130
content_type: concept
---

<!--
---
title: Configure DNS for a Cluster
weight: 130
content_type: concept
---
-->

<!-- overview -->
<!--
Kubernetes offers a DNS cluster addon, which most of the supported environments enable by default. In Kubernetes version 1.11 and later, CoreDNS is recommended and is installed by default with kubeadm.
-->
Kubernetes 提供 DNS 集群插件，大多数支持的环境默认情况下都会启用。
在 Kubernetes 1.11 及其以后版本中，推荐使用 CoreDNS，
kubeadm 默认会安装 CoreDNS。

<!-- body -->
<!--
For more information on how to configure CoreDNS for a Kubernetes cluster, see the [Customizing DNS Service](/docs/tasks/administer-cluster/dns-custom-nameservers/). An example demonstrating how to use Kubernetes DNS with kube-dns, see the [Kubernetes DNS sample plugin](https://github.com/kubernetes/examples/tree/master/staging/cluster-dns)
-->
要了解关于如何为 Kubernetes 集群配置 CoreDNS 的更多信息，参阅 
[定制 DNS 服务](/zh-cn/docs/tasks/administer-cluster/dns-custom-nameservers/)。
关于如何利用 kube-dns 配置 kubernetes DNS 的演示例子，参阅 
[Kubernetes DNS 插件示例](https://github.com/kubernetes/examples/tree/master/staging/cluster-dns)。


