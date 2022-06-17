---
title: 為叢集配置 DNS
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
Kubernetes 提供 DNS 叢集外掛，大多數支援的環境預設情況下都會啟用。
在 Kubernetes 1.11 及其以後版本中，推薦使用 CoreDNS，
kubeadm 預設會安裝 CoreDNS。

<!-- body -->
<!--
For more information on how to configure CoreDNS for a Kubernetes cluster, see the [Customizing DNS Service](/docs/tasks/administer-cluster/dns-custom-nameservers/). An example demonstrating how to use Kubernetes DNS with kube-dns, see the [Kubernetes DNS sample plugin](https://github.com/kubernetes/examples/tree/master/staging/cluster-dns)
-->
要了解關於如何為 Kubernetes 叢集配置 CoreDNS 的更多資訊，參閱 
[定製 DNS 服務](/zh-cn/docs/tasks/administer-cluster/dns-custom-nameservers/)。
關於如何利用 kube-dns 配置 kubernetes DNS 的演示例子，參閱 
[Kubernetes DNS 外掛示例](https://github.com/kubernetes/examples/tree/master/staging/cluster-dns)。


