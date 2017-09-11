---
approvers:
- chrismarino
title: 使用 Romana 来提供 NetworkPolicy
---

{% capture overview %}


本页展示怎么样使用 Romana 来提供 NetworkPolicy

{% endcapture %}

{% capture prerequisites %}


完成 [kubeadm 入门指南](/docs/getting-started-guides/kubeadm/)中的步骤1、2和3

{% endcapture %}

{% capture steps %}


## 使用 kubeadm 安装 Romana


按照[容器化安装指南](https://github.com/romana/romana/tree/master/containerize)中使用 kubeadm 的方式安装


## 应用网络策略


要应用网络策略，请使用以下方式之一：


* [Romana 网络策略](https://github.com/romana/romana/wiki/Romana-policies)
    * [Romana 网络策略示例](https://github.com/romana/core/tree/master/policy)

* NetworkPolicy API

{% endcapture %}

{% capture whatsnext %}


Romana 安装完成之后，您可以通过 [NetworkPolicy 入门指南](/docs/getting-started-guides/network-policy/walkthrough)去尝试使用 Kubernetes NetworkPolicy

{% endcapture %}

{% include templates/task.md %}
