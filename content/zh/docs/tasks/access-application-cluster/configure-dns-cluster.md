---
title: 为集群配置 DNS
weight: 120
content_type: concept
---

<!--
---
title: Configure DNS for a Cluster
weight: 120
content_type: concept
---
-->

<!-- overview -->
<!--
Kubernetes offers a DNS cluster addon, which most of the supported environments enable by default. In Kubernetes version 1.11 and later, CoreDNS is recommended and is installed by default with kubeadm.
-->
Kubernetes 提供 DNS 集群插件，大多数支持的环境默认情况下都会启用。在Kubernetes 1.11及其以后版本中，推荐使用CoreDNS，CoreDNS默认与kubeadm一起安装。

<!-- body -->
<!--
For more information on how to configure CoreDNS for a Kubernetes cluster, see the [Customizing DNS Service](/docs/tasks/administer-cluster/dns-custom-nameservers/). An example demonstrating how to use Kubernetes DNS with kube-dns, see the [Kubernetes DNS sample plugin](https://github.com/kubernetes/examples/tree/master/staging/cluster-dns)
-->
获取更多关于如何为Kubernetes集群配置CoreDNS的信息，参阅 [定制DNS服务](/docs/tasks/administer-cluster/dns-custom-nameservers/)。演示如何利用kube-dns配置kubernetes DNS的例子，参阅 [Kubernetes DNS插件示例](https://github.com/kubernetes/examples/tree/master/staging/cluster-dns)。


