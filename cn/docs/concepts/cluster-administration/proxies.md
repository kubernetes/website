---
title: Kubernetes 中的代理
cn-approvers:
- chentao1596
---
<!--
---
title: Proxies in Kubernetes
---
-->

{% capture overview %}
<!--
This page explains proxies used with Kubernetes.
-->
本页描述与 Kubernetes 一起使用的代理。
{% endcapture %}

{% capture body %}

<!--
## Proxies
-->
## 代理

<!--
There are several different proxies you may encounter when using Kubernetes:
-->
在使用 Kubernetes 的时候，您可能会遇到下面几种不同的代理：

<!--
1.  The [kubectl proxy](/docs/tasks/access-application-cluster/access-cluster/#directly-accessing-the-rest-api):

    - runs on a user's desktop or in a pod
    - proxies from a localhost address to the Kubernetes apiserver
    - client to proxy uses HTTP
    - proxy to apiserver uses HTTPS
    - locates apiserver
    - adds authentication headers
-->
1.  [kubectl 代理](/docs/tasks/access-application-cluster/access-cluster/#directly-accessing-the-rest-api)：

    - 运行在用户桌面上或 pod 中
    - 本地主机地址到 Kubernetes apiserver 的代理
    - 客户端到代理使用 HTTP
    - 代理到 apiserver 使用 HTTPS
    - 定位 apiserver
    - 添加身份验证 header

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
1.  [apiserver 代理](/docs/tasks/access-application-cluster/access-cluster/#discovering-builtin-services)：

    - apiserver 内置的一个 bastion
    - 将群集外部的用户连接到群集 IP，否则可能无法访问
    - 运行在 apiserver 进程中
    - 客户端到代理使用 HTTPS （如果 apiserver 配置为使用 HTTP，则这里使用 HTTP）
    - 代理到目标可以使用 HTTP 或 HTTPS，这是由代理使用可用信息来选择的
    - 可用于访问 Node、Pod 或者 Service
    - 访问 Service 时作为负载均衡
	
<!--
1.  The [kube proxy](/docs/concepts/services-networking/service/#ips-and-vips):

    - runs on each node
    - proxies UDP and TCP
    - does not understand HTTP
    - provides load balancing
    - is just used to reach services
-->
1.  [kube 代理](/docs/concepts/services-networking/service/#ips-and-vips)：

    - 每个 node 上都运行
    - 代理 UDP 和 TCP
    - 不支持 HTTP
    - 提供负载均衡
    - 只用来访问服务

<!--
1.  A Proxy/Load-balancer in front of apiserver(s):

    - existence and implementation varies from cluster to cluster (e.g. nginx)
    - sits between all clients and one or more apiservers
    - acts as load balancer if there are several apiservers.
-->
1.  放在 apiserver 前面的代理/负载均衡：

    - 存在和实现因集群而异（例如 nginx）
    - 在所有的客户端和一个或多个 apiserver 之间
    - 如果有几个 apiserver，则充当负载均衡器。
	
<!--
1.  Cloud Load Balancers on external services:

    - are provided by some cloud providers (e.g. AWS ELB, Google Cloud Load Balancer)
    - are created automatically when the Kubernetes service has type `LoadBalancer`
    - use UDP/TCP only
    - implementation varies by cloud provider.
-->
1.  外部服务的云负载平衡器：

    - 由一些云服务提供商提供（例如 AWS ELB，谷歌云负载平衡器）
    - 当 Kubernetes 服务类型为 `LoadBalancer` 时，自动创建
    - 仅使用 UDP/TCP
    - 因云服务提供商的不同，实现存在差异

<!--
Kubernetes users will typically not need to worry about anything other than the first two types.  The cluster admin
will typically ensure that the latter types are setup correctly.
-->
Kubernetes 用户通常不需要担心前两种以外的其它类型。集群管理通常会确保后面类型的设置是否正确。

<!--
## Requesting redirects
-->
## 请求重定向

<!--
Proxies have replaced redirect capabilities.  Redirects have been deprecated.
-->
代理已经取代了重定向功能。重定向已被弃用。

{% endcapture %}

{% include templates/concept.md %}
