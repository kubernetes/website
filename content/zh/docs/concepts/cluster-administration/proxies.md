---
title: Kubernetes 中的代理
content_type: concept
weight: 90
---
<!--
title: Proxies in Kubernetes
content_type: concept
weight: 90
-->

<!-- overview -->
<!--
This page explains proxies used with Kubernetes.
-->
本文讲述了 Kubernetes 中所使用的代理。

<!-- body -->

<!--
## Proxies

There are several different proxies you may encounter when using Kubernetes:
-->
## 代理  {#proxies}

用户在使用 Kubernetes 的过程中可能遇到几种不同的代理（proxy）：

<!--
1.  The [kubectl proxy](/docs/tasks/access-application-cluster/access-cluster/#directly-accessing-the-rest-api):

    - runs on a user's desktop or in a pod
    - proxies from a localhost address to the Kubernetes apiserver
    - client to proxy uses HTTP
    - proxy to apiserver uses HTTPS
    - locates apiserver
    - adds authentication headers
-->
1. [kubectl proxy](/zh/docs/tasks/access-application-cluster/access-cluster/#directly-accessing-the-rest-api)：

    - 运行在用户的桌面或 pod 中
    - 从本机地址到 Kubernetes apiserver 的代理
    - 客户端到代理使用 HTTP 协议
    - 代理到 apiserver 使用 HTTPS 协议
    - 指向 apiserver
    - 添加认证头信息

<!--
1.  The [apiserver proxy](/docs/tasks/access-application-cluster/access-cluster/#discovering-builtin-services):

    - is a bastion built into the apiserver
    - connects a user outside of the cluster to cluster IPs which otherwise might not be reachable
    - runs in the apiserver processes
    - client to proxy uses HTTPS (or http if apiserver so configured)
    - proxy to target may use HTTP or HTTPS as chosen by proxy using available information
    - can be used to reach a Node, Pod, or Service
    - does load balancing when used to reach a Service
-->
2. [apiserver proxy](/zh/docs/tasks/access-application-cluster/access-cluster/#discovering-builtin-services)：

    - 是一个建立在 apiserver 内部的“堡垒”
    - 将集群外部的用户与群集 IP 相连接，这些IP是无法通过其他方式访问的
    - 运行在 apiserver 进程内
    - 客户端到代理使用 HTTPS 协议 (如果配置 apiserver 使用 HTTP 协议，则使用 HTTP 协议)
    - 通过可用信息进行选择，代理到目的地可能使用 HTTP 或 HTTPS 协议
    - 可以用来访问 Node、 Pod 或 Service
    - 当用来访问 Service 时，会进行负载均衡

<!--
1.  The [kube proxy](/docs/concepts/services-networking/service/#ips-and-vips):

    - runs on each node
    - proxies UDP, TCP and SCTP
    - does not understand HTTP
    - provides load balancing
    - is only used to reach services
-->
3. [kube proxy](/zh/docs/concepts/services-networking/service/#ips-and-vips)：

    - 在每个节点上运行
    - 代理 UDP、TCP 和 SCTP
    - 不支持 HTTP
    - 提供负载均衡能力
    - 只用来访问 Service

<!--
1.  A Proxy/Load-balancer in front of apiserver(s):

    - existence and implementation varies from cluster to cluster (e.g. nginx)
    - sits between all clients and one or more apiservers
    - acts as load balancer if there are several apiservers.
-->
4. apiserver 之前的代理/负载均衡器：

    - 在不同集群中的存在形式和实现不同 (如 nginx)
    - 位于所有客户端和一个或多个 API 服务器之间
    - 存在多个 API 服务器时，扮演负载均衡器的角色

<!--
1.  Cloud Load Balancers on external services:

    - are provided by some cloud providers (e.g. AWS ELB, Google Cloud Load Balancer)
    - are created automatically when the Kubernetes service has type `LoadBalancer`
    - usually supports UDP/TCP only
    - SCTP support is up to the load balancer implementation of the cloud provider
    - implementation varies by cloud provider.
-->
5. 外部服务的云负载均衡器：

    - 由一些云供应商提供 (如 AWS ELB、Google Cloud Load Balancer)
    - Kubernetes 服务类型为 `LoadBalancer` 时自动创建
    - 通常仅支持 UDP/TCP 协议
    - SCTP 支持取决于云供应商的负载均衡器实现
    - 不同云供应商的云负载均衡器实现不同

<!--
Kubernetes users will typically not need to worry about anything other than the first two types.  The cluster admin
will typically ensure that the latter types are setup correctly.
-->

Kubernetes 用户通常只需要关心前两种类型的代理，集群管理员通常需要确保后面几种类型的代理设置正确。

<!--
## Requesting redirects

Proxies have replaced redirect capabilities.  Redirects have been deprecated.
-->
## 请求重定向

代理已经取代重定向功能，重定向功能已被弃用。

