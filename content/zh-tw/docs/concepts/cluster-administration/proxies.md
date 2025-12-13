---
title: Kubernetes 中的代理
content_type: concept
weight: 100
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
本文講述了 Kubernetes 中所使用的代理。

<!-- body -->

<!--
## Proxies

There are several different proxies you may encounter when using Kubernetes:
-->
## 代理  {#proxies}

使用者在使用 Kubernetes 的過程中可能遇到幾種不同的代理（proxy）：

<!--
1.  The [kubectl proxy](/docs/tasks/access-application-cluster/access-cluster/#directly-accessing-the-rest-api):

    - runs on a user's desktop or in a pod
    - proxies from a localhost address to the Kubernetes apiserver
    - client to proxy uses HTTP
    - proxy to apiserver uses HTTPS
    - locates apiserver
    - adds authentication headers
-->
1. [kubectl proxy](/zh-cn/docs/tasks/access-application-cluster/access-cluster/#directly-accessing-the-rest-api)：

    - 運行在使用者的桌面或 pod 中
    - 從本機地址到 Kubernetes apiserver 的代理
    - 客戶端到代理使用 HTTP 協議
    - 代理到 apiserver 使用 HTTPS 協議
    - 指向 apiserver
    - 添加認證頭資訊

<!--
1.  The [apiserver proxy](/docs/tasks/access-application-cluster/access-cluster-services/#discovering-builtin-services):

    - is a bastion built into the apiserver
    - connects a user outside of the cluster to cluster IPs which otherwise might not be reachable
    - runs in the apiserver processes
    - client to proxy uses HTTPS (or http if apiserver so configured)
    - proxy to target may use HTTP or HTTPS as chosen by proxy using available information
    - can be used to reach a Node, Pod, or Service
    - does load balancing when used to reach a Service
-->
2. [apiserver proxy](/zh-cn/docs/tasks/access-application-cluster/access-cluster-services/#discovering-builtin-services)：

    - 是一個建立在 apiserver 內部的“堡壘”
    - 將叢集外部的使用者與叢集 IP 相連接，這些 IP 是無法通過其他方式訪問的
    - 運行在 apiserver 進程內
    - 客戶端到代理使用 HTTPS 協議 (如果設定 apiserver 使用 HTTP 協議，則使用 HTTP 協議)
    - 通過可用資訊進行選擇，代理到目的地可能使用 HTTP 或 HTTPS 協議
    - 可以用來訪問 Node、 Pod 或 Service
    - 當用來訪問 Service 時，會進行負載均衡

<!--
1.  The [kube proxy](/docs/concepts/services-networking/service/#ips-and-vips):

    - runs on each node
    - proxies UDP, TCP and SCTP
    - does not understand HTTP
    - provides load balancing
    - is only used to reach services
-->
3. [kube proxy](/zh-cn/docs/concepts/services-networking/service/#ips-and-vips)：

    - 在每個節點上運行
    - 代理 UDP、TCP 和 SCTP
    - 不支持 HTTP
    - 提供負載均衡能力
    - 只用來訪問 Service

<!--
1.  A Proxy/Load-balancer in front of apiserver(s):

    - existence and implementation varies from cluster to cluster (e.g. nginx)
    - sits between all clients and one or more apiservers
    - acts as load balancer if there are several apiservers.
-->
4. apiserver 之前的代理/負載均衡器：

    - 在不同叢集中的存在形式和實現不同 (如 nginx)
    - 位於所有客戶端和一個或多個 API 伺服器之間
    - 存在多個 API 伺服器時，扮演負載均衡器的角色

<!--
1.  Cloud Load Balancers on external services:

    - are provided by some cloud providers (e.g. AWS ELB, Google Cloud Load Balancer)
    - are created automatically when the Kubernetes service has type `LoadBalancer`
    - usually supports UDP/TCP only
    - SCTP support is up to the load balancer implementation of the cloud provider
    - implementation varies by cloud provider.
-->
5. 外部服務的雲負載均衡器：

    - 由一些雲供應商提供 (如 AWS ELB、Google Cloud Load Balancer)
    - Kubernetes 服務類型爲 `LoadBalancer` 時自動創建
    - 通常僅支持 UDP/TCP 協議
    - SCTP 支持取決於雲供應商的負載均衡器實現
    - 不同雲供應商的雲負載均衡器實現不同

<!--
Kubernetes users will typically not need to worry about anything other than the first two types.  The cluster admin
will typically ensure that the latter types are set up correctly.
-->

Kubernetes 使用者通常只需要關心前兩種類型的代理，叢集管理員通常需要確保後面幾種類型的代理設置正確。

<!--
## Requesting redirects

Proxies have replaced redirect capabilities.  Redirects have been deprecated.
-->
## 請求重定向

代理已經取代重定向功能，重定向功能已被棄用。

