---
title: Kubernetes 中的代理
---

{% capture overview %}
本文讲述了 Kubernetes 中所使用的代理。
{% endcapture %}

{% capture body %}

## 代理

用户在使用 Kubernetes 的过程中可能遇到几种不同的代理（proxy）：

  1. [kubectl proxy](/docs/tasks/access-application-cluster/access-cluster/#directly-accessing-the-rest-api)：

    - 运行在用户的桌面或 pod 中
    - 从本机地址到 Kubernetes apiserver 的代理
    - 客户端到代理使用 HTTP 协议
    - 代理到 apiserver 使用 HTTPS 协议
    - 指向 apiserver
    - 添加认证头信息

  1. [apiserver proxy](/docs/tasks/access-application-cluster/access-cluster/#discovering-builtin-services)：

    - 是一个建立在 apiserver 内部的“堡垒”
    - 将集群外部的用户与群集 IP 相连接，这些IP是无法通过其他方式访问的
    - 运行在 apiserver 进程内
    - 客户端到代理使用 HTTPS 协议 (如果配置 apiserver 使用 HTTP 协议，则使用 HTTP 协议)
    - 通过可用信息进行选择，代理到目的地可能使用 HTTP 或 HTTPS 协议
    - 可以用来访问 Node、 Pod 或 Service
    - 当用来访问 Service 时，会进行负载均衡

  1. [kube proxy](/docs/concepts/services-networking/service/#ips-and-vips)：

    - 在每个节点上运行
    - 代理 UDP 和 TCP
    - 不支持 HTTP 
    - 提供负载均衡能力
    - 只用来访问 Service

  1. apiserver 之前的代理/负载均衡器：

    - 在不同集群间的存在形式和实现不同 (如 nginx)
    - 位于所有客户端和一个或多个 apiserver 之间
    - 存在多个 apiserver 时，扮演负载均衡器的角色

  1. 外部服务的云负载均衡器：

    - 由一些云供应商提供 (如AWS ELB、 Google Cloud Load Balancer)
    - Kubernetes service 为 `LoadBalancer` 类型时自动创建
    - 只使用 UDP/TCP 协议
    - 不同云供应商的实现不同。

Kubernetes 用户通常只需要关心前两种类型的代理，集群管理员通常需要确保后面几种类型的代理设置正确。

## 请求重定向

代理已经取代重定向功能，重定向已被弃用。

{% endcapture %}

{% include templates/concept.md %}
