---
layout: blog
title: "Kubernetes v1.26：Kubernetes 中流量工程的进步"
date: 2022-12-30
slug: advancements-in-kubernetes-traffic-engineering
---

<!--
layout: blog
title: "Kubernetes v1.26: Advancements in Kubernetes Traffic Engineering"
date: 2022-12-30
slug: advancements-in-kubernetes-traffic-engineering
-->

**作者**：Andrew Sy Kim (Google)
<!--
**Authors:** Andrew Sy Kim (Google)
-->

**译者**：Wilson Wu (DaoCloud)

<!--
Kubernetes v1.26 includes significant advancements in network traffic engineering with the graduation of two features (Service internal traffic policy support, and EndpointSlice terminating conditions) to GA, and a third feature (Proxy terminating endpoints) to beta. The combination of these enhancements aims to address short-comings in traffic engineering that people face today, and unlock new capabilities for the future.
-->
Kubernetes v1.26 在网络流量工程方面取得了重大进展，
两项功能（服务内部流量策略支持和 EndpointSlice 终止状况）升级为正式发布版本，
第三项功能（代理终止端点）升级为 Beta。这些增强功能的结合旨在解决人们目前所面临的流量工程短板，并在未来解锁新的功能。

<!--
## Traffic Loss from Load Balancers During Rolling Updates
-->
## 滚动更新期间负载均衡器的流量丢失 {#traffic-loss-from-load-balancers-during-rolling-updates}

<!--
Prior to Kubernetes v1.26, clusters could experience [loss of traffic](https://github.com/kubernetes/kubernetes/issues/85643) from Service load balancers during rolling updates when setting the `externalTrafficPolicy` field to `Local`. There are a lot of moving parts at play here so a quick overview of how Kubernetes manages load balancers might help!
-->
在 Kubernetes v1.26 之前，将 `externalTrafficPolicy` 字段设置为 `Local` 时，
集群在滚动更新期间可能会遇到 Service 的负载均衡器[流量丢失](https://github.com/kubernetes/kubernetes/issues/85643)问题。
这里有很多活动部件作用其中，因此简述 Kubernetes 管理负载均衡器的机制可能对此有所帮助！

<!--
In Kubernetes, you can create a Service with `type: LoadBalancer` to expose an application externally with a load balancer. The load balancer implementation varies between clusters and platforms, but the Service provides a generic abstraction representing the load balancer that is consistent across all Kubernetes installations.
-->
在 Kubernetes 中，你可以创建一个 `type: LoadBalancer` 的 Service，
并通过负载均衡器对外暴露应用。负载均衡器的实现因集群和平台而异，
但 Service 提供了表示负载均衡器的通用抽象，该抽象在所有 Kubernetes 环境中都是一致的。

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-service
spec:
  selector:
    app.kubernetes.io/name: my-app
  ports:
    - protocol: TCP
      port: 80
      targetPort: 9376
  type: LoadBalancer
```

<!--
Under the hood, Kubernetes allocates a NodePort for the Service, which is then used by kube-proxy to provide a network data path from the NodePort to the Pod. A controller will then add all available Nodes in the cluster to the load balancer’s backend pool, using the designated NodePort for the Service as the backend target port.
-->
在底层，Kubernetes 为 Service 分配一个 NodePort，然后 kube-proxy 使用它来提供从
NodePort 到 Pod 的网络数据路径。然后，控制器将集群中的所有可用节点添加到负载均衡器的后端池中，
使用 Service 的指定 NodePort 作为后端目标端口。

<!--
{{< figure src="traffic-engineering-service-load-balancer.png" caption="Figure 1: Overview of Service load balancers" >}}
-->
{{< figure src="traffic-engineering-service-load-balancer.png" caption="图 1：Service 负载均衡器概览" >}}

<!--
Oftentimes it is beneficial to set `externalTrafficPolicy: Local` for Services, to avoid extra hops between Nodes that are not running healthy Pods backing that Service. When using `externalTrafficPolicy: Local`, an additional NodePort is allocated for health checking purposes, such that Nodes that do not contain healthy Pods are excluded from the backend pool for a load balancer.
-->
通常，为 Service 设置 `externalTrafficPolicy: Local` 是有益的，
对于没有运行为该 Service 提供服务的健康 Pod 的节点而言，可以避免在这类节点之间的额外跳转。
使用 `externalTrafficPolicy: Local` 时，会分配一个额外的 NodePort 用于健康检查，
这样不包含健康 Pod 的节点就会被排除在负载均衡器的后端池之外。

<!--
{{< figure src="traffic-engineering-lb-healthy.png" caption="Figure 2: Load balancer traffic to a healthy Node, when externalTrafficPolicy is Local" >}}
-->
{{< figure src="traffic-engineering-lb-healthy.png" caption="图 2：当 externalTrafficPolicy 为 Local 时，从负载均衡器到健康节点的流量情况" >}}

<!--
One such scenario where traffic can be lost is when a Node loses all Pods for a Service, but the external load balancer has not probed the health check NodePort yet. The likelihood of this situation is largely dependent on the health checking interval configured on the load balancer. The larger the interval, the more likely this will happen, since the load balancer will continue to send traffic to a node even after kube-proxy has removed forwarding rules for that Service. This also occurrs when Pods start terminating during rolling updates. Since Kubernetes does not consider terminating Pods as “Ready”, traffic can be loss when there are only terminating Pods on any given Node during a rolling update.
-->
流量可能丢失的一种情况是，当节点失去了某个 Service 的所有 Pod，但外部负载均衡器尚未通过
NodePort 进行健康检查探测时。这种情况的发生概率很大程度上取决于负载均衡器上配置的健康检查时间间隔。
间隔越大，发生这种情况的可能性就越大，因为即使在 kube-proxy 删除了该服务的转发规则之后，
负载均衡器仍将继续向节点发送流量。当 Pod 在滚动更新期间开始终止时也会发生这种情况。
由于 Kubernetes 不会将正在终止的 Pod 视为“Ready”，因此当滚动更新期间任何给定节点上仅存在正在终止的 Pod 时，流量可能会丢失。

<!--
{{< figure src="traffic-engineering-lb-without-proxy-terminating-endpoints.png" caption="Figure 3: Load balancer traffic to terminating endpoints, when externalTrafficPolicy is Local" >}}
-->
{{< figure src="traffic-engineering-lb-without-proxy-terminating-endpoints.png" caption="图 3：当 externalTrafficPolicy 为 Local 时，从负载均衡器到正在终止的端点的流量" >}}

<!--
Starting in Kubernetes v1.26, kube-proxy enables the `ProxyTerminatingEndpoints` feature by default, which adds automatic failover and routing to terminating endpoints in scenarios where the traffic would otherwise be dropped. More specifically, when there is a rolling update and a Node only contains terminating Pods, kube-proxy will route traffic to the terminating Pods based on their readiness. In addition, kube-proxy will actively fail the health check NodePort if there are only terminating Pods available. By doing so, kube-proxy alerts the external load balancer that new connections should not be sent to that Node but will gracefully handle requests for existing connections.
-->
从 Kubernetes v1.26 开始，kube-proxy 将默认启用 `ProxyTerminatingEndpoints` 功能，
该功能在流量将被丢弃时自动添加故障转移并将流量路由到正在终止的端点。更具体地说，
当存在滚动更新并且节点仅包含正在终止的 Pod 时，kube-proxy 会根据其就绪情况将流量路由到正在终止的 Pod 中。
此外，如果只有正在终止的 Pod 可用时，kube-proxy 将主动使 NodePort 的健康检查失败。
通过这种做法，kube-proxy 能够提醒外部负载均衡器新连接不应发送到该节点，并妥善处理现有连接的请求。

<!--
{{< figure src="traffic-engineering-lb-with-proxy-terminating-endpoints.png" caption="Figure 4: Load Balancer traffic to terminating endpoints with ProxyTerminatingEndpoints enabled, when externalTrafficPolicy is Local" >}}
-->
{{< figure src="traffic-engineering-lb-with-proxy-terminating-endpoints.png" caption="图 4：当 externalTrafficPolicy 为 Local 时，从负载均衡器到启用 ProxyTerminateEndpoints 的正在终止端点的流量" >}}

<!--
### EndpointSlice Conditions
-->
### EndpointSlice 状况 {#endpointslice-conditions}

<!--
In order to support this new capability in kube-proxy, the EndpointSlice API introduced new conditions for endpoints: `serving` and `terminating`.
-->
为了支持 kube-proxy 中的这一新功能，EndpointSlice API 为端点引入了新状况：`serving` 和 `terminating`。

<!--
{{< figure src="endpointslice-overview.png" caption="Figure 5: Overview of EndpointSlice conditions" >}}
-->
{{< figure src="endpointslice-overview.png" caption="图 5：EndpointSlice 状况概述" >}}

<!--
The `serving` condition is semantically identical to `ready`, except that it can be `true` or `false` while a Pod is terminating, unlike `ready` which will always be `false` for terminating Pods for compatibility reasons. The `terminating` condition is true for Pods undergoing termination (non-empty deletionTimestamp), false otherwise.
-->
`serving` 状况在语义上与 `ready` 相同，只是在 Pod 正在终止时它可以为 `true` 或 `false`，
而 `ready` 则由于兼容性原因对于正在终止的 Pod 始终为 `false`。
对于正在终止的 Pod（deletionTimestamp 不为空），`terminating` 状况为 true，否则为 false。

<!--
The addition of these two conditions enables consumers of this API to understand Pod states that were previously not possible. For example, we can now track "ready" and "not ready" Pods that are also terminating.
-->
添加这两个状况使该 API 的使用者能够了解之前无法体现的 Pod 状态。
例如，我们现在可以同时跟踪“ready”和“not ready”的正在终止的 Pod。

<!--
{{< figure src="endpointslice-with-terminating-pod.png" caption="Figure 6: EndpointSlice conditions with a terminating Pod" >}}
-->
{{< figure src="endpointslice-with-terminating-pod.png" caption="图 6：正在终止 Pod 的 EndpointSlice 状况" >}}

<!--
Consumers of the EndpointSlice API, such as Kube-proxy and Ingress Controllers, can now use these conditions to coordinate connection draining events, by continuing to forward traffic for existing connections but rerouting new connections to other non-terminating endpoints.
-->
EndpointSlice API 的使用者（例如 Kube-proxy 和 Ingress Controller）现在可以使用这些状况来协调连接耗尽事件，
方法是继续转发现有连接的流量，但将新连接重新路由到其他非正在终止的端点。

<!--
## Optimizing Internal Node-Local Traffic
-->
## 优化内部节点本地流量 {#optimizing-internal-node-local-traffic}

<!--
Similar to how Services can set `externalTrafficPolicy: Local` to avoid extra hops for externally sourced traffic, Kubernetes now supports `internalTrafficPolicy: Local`, to enable the same optimization for traffic originating within the cluster, specifically for traffic using the Service Cluster IP as the destination address. This feature graduated to Beta in Kubernetes v1.24 and is graduating to GA in v1.26.
-->
与 Service 可以设置 `externalTrafficPolicy: Local` 以避免外部来源流量的额外跃点类似，
Kubernetes 现在支持 `internalTrafficPolicy: Local`，以便对源自集群内部的流量启用相同的优化，
特别是对于使用 Service 集群 IP 的流量目标地址。该功能已在 Kubernetes v1.24 中升级为 Beta，并在 v1.26 中升级为正式发布版本。

<!--
Services default the `internalTrafficPolicy` field to `Cluster`, where traffic is randomly distributed to all endpoints.
-->
Service 默认将 `internalTrafficPolicy` 字段设置为`Cluster`，使其流量随机分配到所有端点。

<!--
{{< figure src="service-internal-traffic-policy-cluster.png" caption="Figure 7: Service routing when internalTrafficPolicy is Cluster" >}}
-->
{{< figure src="service-internal-traffic-policy-cluster.png" caption="图 7：internalTrafficPolicy 为 Cluster 时的 Service 路由" >}}

<!--
When `internalTrafficPolicy` is set to `Local`, kube-proxy will forward internal traffic for a Service only if there is an available endpoint that is local to the same Node.
-->
当 `internalTrafficPolicy` 设置为 `Local` 时，仅当在相同节点存在本地可用端点时，kube-proxy 才会转发服务的内部流量。

<!--
{{< figure src="service-internal-traffic-policy-local.png" caption="Figure 8: Service routing when internalTrafficPolicy is Local" >}}
-->
{{< figure src="service-internal-traffic-policy-local.png" caption="图 8：internalTrafficPolicy 为 Local 时的服务路由" >}}

<!--
{{< caution >}}
When using `internalTrafficPoliy: Local`, traffic will be dropped by kube-proxy when no local endpoints are available.
{{< /caution >}}
-->
{{< caution >}}
使用 `internalTrafficPoliy: Local` 时，当没有可用的本地端点时，kube-proxy 将丢弃流量。
{{< /caution >}}

<!--
## Getting Involved
-->
## 欢迎参与 {#getting-involved}

<!--
If you're interested in future discussions on Kubernetes traffic engineering, you can get involved in SIG Network through the following ways:
* Slack: [#sig-network](https://kubernetes.slack.com/messages/sig-network)
* [Mailing list](https://groups.google.com/forum/#!forum/kubernetes-sig-network)
* [Open Community Issues/PRs](https://github.com/kubernetes/community/labels/sig%2Fnetwork)
* [Biweekly meetings](https://github.com/kubernetes/community/tree/master/sig-network#meetings)
-->
如果你对未来关于 Kubernetes 流量工程的讨论感兴趣，可以通过以下方式参与 SIG Network：
* Slack：[#sig-network](https://kubernetes.slack.com/messages/sig-network)
* [邮件列表](https://groups.google.com/forum/#!forum/kubernetes-sig-network)
* [开放社区的 Issue/PR](https://github.com/kubernetes/community/labels/sig%2Fnetwork)
* [双周会议](https://github.com/kubernetes/community/tree/master/sig-network#meetings)
