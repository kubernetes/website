---
approvers:
- johnbelamaric
title: 使用 CoreDNS 进行服务发现
最低 kubernetes server 版本: v1.9
---
<!--
---
approvers:
- johnbelamaric
title: Using CoreDNS for Service Discovery
min-kubernetes-server-version: v1.9
---
-->

{% include feature-state-alpha.md %}

{% capture overview %}
<!--
This page describes how to enable CoreDNS instead of kube-dns for service
discovery.
-->
本文解释了如何启用 CoreDNS 来替换 kube-dns 进行服务发现。
{% endcapture %}

{% capture prerequisites %}
{% include task-tutorial-prereqs.md %}
{% endcapture %}

{% capture steps %}

<!--
## Installing CoreDNS with kubeadm

In Kubernetes 1.9, [CoreDNS](https://coredns.io) is available as an alpha feature and
may be installed by setting the `CoreDNS` feature gate to `true` during `kubeadm init`:
-->
## 使用 kubeadm 安装 CoreDNS

在 Kubernetes 1.9 版本中，[CoreDNS](https://coredns.io) 可作为 alpha 特性使用，
并可以在 `kubeadm init` 中通过设置 `CoreDNS` 特性开关为 `true` 来进行安装。


```
kubeadm init --feature-gates=CoreDNS=true
```

<!--
This installs CoreDNS instead of kube-dns.
-->
上面的命令安装 CoreDNS 来替换 kube-dns。

{% endcapture %}

{% capture whatsnext %}

<!--
You can configure [CoreDNS](https://coredns.io) to support many more use cases than
kube-dns by modifying the `Corefile`. For more information, see the
[CoreDNS site](https://coredns.io/2017/05/08/custom-dns-entries-for-kubernetes/).
-->
您可以通过修改 `Corefile` 来配置 [CoreDNS](https://coredns.io)，以支持比 kube-dns 更多的用例。
想了解更多信息，请查看 [CoreDNS 网站](https://coredns.io/2017/05/08/custom-dns-entries-for-kubernetes/)。

{% endcapture %}

{% include templates/task.md %}
