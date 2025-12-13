---
layout: blog
title: "Kubernetes v1.26：Kubernetes 中流量工程的進步"
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

**譯者**：Wilson Wu (DaoCloud)

<!--
Kubernetes v1.26 includes significant advancements in network traffic engineering with the graduation of two features (Service internal traffic policy support, and EndpointSlice terminating conditions) to GA, and a third feature (Proxy terminating endpoints) to beta. The combination of these enhancements aims to address short-comings in traffic engineering that people face today, and unlock new capabilities for the future.
-->
Kubernetes v1.26 在網路流量工程方面取得了重大進展，
兩項功能（服務內部流量策略支持和 EndpointSlice 終止狀況）升級爲正式發佈版本，
第三項功能（代理終止端點）升級爲 Beta。這些增強功能的結合旨在解決人們目前所面臨的流量工程短板，並在未來解鎖新的功能。

<!--
## Traffic Loss from Load Balancers During Rolling Updates
-->
## 滾動更新期間負載均衡器的流量丟失 {#traffic-loss-from-load-balancers-during-rolling-updates}

<!--
Prior to Kubernetes v1.26, clusters could experience [loss of traffic](https://github.com/kubernetes/kubernetes/issues/85643) from Service load balancers during rolling updates when setting the `externalTrafficPolicy` field to `Local`. There are a lot of moving parts at play here so a quick overview of how Kubernetes manages load balancers might help!
-->
在 Kubernetes v1.26 之前，將 `externalTrafficPolicy` 字段設置爲 `Local` 時，
叢集在滾動更新期間可能會遇到 Service 的負載均衡器[流量丟失](https://github.com/kubernetes/kubernetes/issues/85643)問題。
這裏有很多活動部件作用其中，因此簡述 Kubernetes 管理負載均衡器的機制可能對此有所幫助！

<!--
In Kubernetes, you can create a Service with `type: LoadBalancer` to expose an application externally with a load balancer. The load balancer implementation varies between clusters and platforms, but the Service provides a generic abstraction representing the load balancer that is consistent across all Kubernetes installations.
-->
在 Kubernetes 中，你可以創建一個 `type: LoadBalancer` 的 Service，
並通過負載均衡器對外暴露應用。負載均衡器的實現因叢集和平臺而異，
但 Service 提供了表示負載均衡器的通用抽象，該抽象在所有 Kubernetes 環境中都是一致的。

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
在底層，Kubernetes 爲 Service 分配一個 NodePort，然後 kube-proxy 使用它來提供從
NodePort 到 Pod 的網路資料路徑。然後，控制器將叢集中的所有可用節點添加到負載均衡器的後端池中，
使用 Service 的指定 NodePort 作爲後端目標端口。

<!--
{{< figure src="traffic-engineering-service-load-balancer.png" caption="Figure 1: Overview of Service load balancers" >}}
-->
{{< figure src="traffic-engineering-service-load-balancer.png" caption="圖 1：Service 負載均衡器概覽" >}}

<!--
Oftentimes it is beneficial to set `externalTrafficPolicy: Local` for Services, to avoid extra hops between Nodes that are not running healthy Pods backing that Service. When using `externalTrafficPolicy: Local`, an additional NodePort is allocated for health checking purposes, such that Nodes that do not contain healthy Pods are excluded from the backend pool for a load balancer.
-->
通常，爲 Service 設置 `externalTrafficPolicy: Local` 是有益的，
對於沒有運行爲該 Service 提供服務的健康 Pod 的節點而言，可以避免在這類節點之間的額外跳轉。
使用 `externalTrafficPolicy: Local` 時，會分配一個額外的 NodePort 用於健康檢查，
這樣不包含健康 Pod 的節點就會被排除在負載均衡器的後端池之外。

<!--
{{< figure src="traffic-engineering-lb-healthy.png" caption="Figure 2: Load balancer traffic to a healthy Node, when externalTrafficPolicy is Local" >}}
-->
{{< figure src="traffic-engineering-lb-healthy.png" caption="圖 2：當 externalTrafficPolicy 爲 Local 時，從負載均衡器到健康節點的流量情況" >}}

<!--
One such scenario where traffic can be lost is when a Node loses all Pods for a Service, but the external load balancer has not probed the health check NodePort yet. The likelihood of this situation is largely dependent on the health checking interval configured on the load balancer. The larger the interval, the more likely this will happen, since the load balancer will continue to send traffic to a node even after kube-proxy has removed forwarding rules for that Service. This also occurrs when Pods start terminating during rolling updates. Since Kubernetes does not consider terminating Pods as “Ready”, traffic can be loss when there are only terminating Pods on any given Node during a rolling update.
-->
流量可能丟失的一種情況是，當節點失去了某個 Service 的所有 Pod，但外部負載均衡器尚未通過
NodePort 進行健康檢查探測時。這種情況的發生概率很大程度上取決於負載均衡器上設定的健康檢查時間間隔。
間隔越大，發生這種情況的可能性就越大，因爲即使在 kube-proxy 刪除了該服務的轉發規則之後，
負載均衡器仍將繼續向節點發送流量。當 Pod 在滾動更新期間開始終止時也會發生這種情況。
由於 Kubernetes 不會將正在終止的 Pod 視爲“Ready”，因此當滾動更新期間任何給定節點上僅存在正在終止的 Pod 時，流量可能會丟失。

<!--
{{< figure src="traffic-engineering-lb-without-proxy-terminating-endpoints.png" caption="Figure 3: Load balancer traffic to terminating endpoints, when externalTrafficPolicy is Local" >}}
-->
{{< figure src="traffic-engineering-lb-without-proxy-terminating-endpoints.png" caption="圖 3：當 externalTrafficPolicy 爲 Local 時，從負載均衡器到正在終止的端點的流量" >}}

<!--
Starting in Kubernetes v1.26, kube-proxy enables the `ProxyTerminatingEndpoints` feature by default, which adds automatic failover and routing to terminating endpoints in scenarios where the traffic would otherwise be dropped. More specifically, when there is a rolling update and a Node only contains terminating Pods, kube-proxy will route traffic to the terminating Pods based on their readiness. In addition, kube-proxy will actively fail the health check NodePort if there are only terminating Pods available. By doing so, kube-proxy alerts the external load balancer that new connections should not be sent to that Node but will gracefully handle requests for existing connections.
-->
從 Kubernetes v1.26 開始，kube-proxy 將預設啓用 `ProxyTerminatingEndpoints` 功能，
該功能在流量將被丟棄時自動添加故障轉移並將流量路由到正在終止的端點。更具體地說，
當存在滾動更新並且節點僅包含正在終止的 Pod 時，kube-proxy 會根據其就緒情況將流量路由到正在終止的 Pod 中。
此外，如果只有正在終止的 Pod 可用時，kube-proxy 將主動使 NodePort 的健康檢查失敗。
通過這種做法，kube-proxy 能夠提醒外部負載均衡器新連接不應發送到該節點，並妥善處理現有連接的請求。

<!--
{{< figure src="traffic-engineering-lb-with-proxy-terminating-endpoints.png" caption="Figure 4: Load Balancer traffic to terminating endpoints with ProxyTerminatingEndpoints enabled, when externalTrafficPolicy is Local" >}}
-->
{{< figure src="traffic-engineering-lb-with-proxy-terminating-endpoints.png" caption="圖 4：當 externalTrafficPolicy 爲 Local 時，從負載均衡器到啓用 ProxyTerminateEndpoints 的正在終止端點的流量" >}}

<!--
### EndpointSlice Conditions
-->
### EndpointSlice 狀況 {#endpointslice-conditions}

<!--
In order to support this new capability in kube-proxy, the EndpointSlice API introduced new conditions for endpoints: `serving` and `terminating`.
-->
爲了支持 kube-proxy 中的這一新功能，EndpointSlice API 爲端點引入了新狀況：`serving` 和 `terminating`。

<!--
{{< figure src="endpointslice-overview.png" caption="Figure 5: Overview of EndpointSlice conditions" >}}
-->
{{< figure src="endpointslice-overview.png" caption="圖 5：EndpointSlice 狀況概述" >}}

<!--
The `serving` condition is semantically identical to `ready`, except that it can be `true` or `false` while a Pod is terminating, unlike `ready` which will always be `false` for terminating Pods for compatibility reasons. The `terminating` condition is true for Pods undergoing termination (non-empty deletionTimestamp), false otherwise.
-->
`serving` 狀況在語義上與 `ready` 相同，只是在 Pod 正在終止時它可以爲 `true` 或 `false`，
而 `ready` 則由於兼容性原因對於正在終止的 Pod 始終爲 `false`。
對於正在終止的 Pod（deletionTimestamp 不爲空），`terminating` 狀況爲 true，否則爲 false。

<!--
The addition of these two conditions enables consumers of this API to understand Pod states that were previously not possible. For example, we can now track "ready" and "not ready" Pods that are also terminating.
-->
添加這兩個狀況使該 API 的使用者能夠了解之前無法體現的 Pod 狀態。
例如，我們現在可以同時跟蹤“ready”和“not ready”的正在終止的 Pod。

<!--
{{< figure src="endpointslice-with-terminating-pod.png" caption="Figure 6: EndpointSlice conditions with a terminating Pod" >}}
-->
{{< figure src="endpointslice-with-terminating-pod.png" caption="圖 6：正在終止 Pod 的 EndpointSlice 狀況" >}}

<!--
Consumers of the EndpointSlice API, such as Kube-proxy and Ingress Controllers, can now use these conditions to coordinate connection draining events, by continuing to forward traffic for existing connections but rerouting new connections to other non-terminating endpoints.
-->
EndpointSlice API 的使用者（例如 Kube-proxy 和 Ingress Controller）現在可以使用這些狀況來協調連接耗盡事件，
方法是繼續轉發現有連接的流量，但將新連接重新路由到其他非正在終止的端點。

<!--
## Optimizing Internal Node-Local Traffic
-->
## 優化內部節點本地流量 {#optimizing-internal-node-local-traffic}

<!--
Similar to how Services can set `externalTrafficPolicy: Local` to avoid extra hops for externally sourced traffic, Kubernetes now supports `internalTrafficPolicy: Local`, to enable the same optimization for traffic originating within the cluster, specifically for traffic using the Service Cluster IP as the destination address. This feature graduated to Beta in Kubernetes v1.24 and is graduating to GA in v1.26.
-->
與 Service 可以設置 `externalTrafficPolicy: Local` 以避免外部來源流量的額外躍點類似，
Kubernetes 現在支持 `internalTrafficPolicy: Local`，以便對源自叢集內部的流量啓用相同的優化，
特別是對於使用 Service 叢集 IP 的流量目標地址。該功能已在 Kubernetes v1.24 中升級爲 Beta，並在 v1.26 中升級爲正式發佈版本。

<!--
Services default the `internalTrafficPolicy` field to `Cluster`, where traffic is randomly distributed to all endpoints.
-->
Service 預設將 `internalTrafficPolicy` 字段設置爲`Cluster`，使其流量隨機分配到所有端點。

<!--
{{< figure src="service-internal-traffic-policy-cluster.png" caption="Figure 7: Service routing when internalTrafficPolicy is Cluster" >}}
-->
{{< figure src="service-internal-traffic-policy-cluster.png" caption="圖 7：internalTrafficPolicy 爲 Cluster 時的 Service 路由" >}}

<!--
When `internalTrafficPolicy` is set to `Local`, kube-proxy will forward internal traffic for a Service only if there is an available endpoint that is local to the same Node.
-->
當 `internalTrafficPolicy` 設置爲 `Local` 時，僅當在相同節點存在本地可用端點時，kube-proxy 纔會轉發服務的內部流量。

<!--
{{< figure src="service-internal-traffic-policy-local.png" caption="Figure 8: Service routing when internalTrafficPolicy is Local" >}}
-->
{{< figure src="service-internal-traffic-policy-local.png" caption="圖 8：internalTrafficPolicy 爲 Local 時的服務路由" >}}

<!--
{{< caution >}}
When using `internalTrafficPoliy: Local`, traffic will be dropped by kube-proxy when no local endpoints are available.
{{< /caution >}}
-->
{{< caution >}}
使用 `internalTrafficPoliy: Local` 時，當沒有可用的本地端點時，kube-proxy 將丟棄流量。
{{< /caution >}}

<!--
## Getting Involved
-->
## 歡迎參與 {#getting-involved}

<!--
If you're interested in future discussions on Kubernetes traffic engineering, you can get involved in SIG Network through the following ways:
* Slack: [#sig-network](https://kubernetes.slack.com/messages/sig-network)
* [Mailing list](https://groups.google.com/forum/#!forum/kubernetes-sig-network)
* [Open Community Issues/PRs](https://github.com/kubernetes/community/labels/sig%2Fnetwork)
* [Biweekly meetings](https://github.com/kubernetes/community/tree/master/sig-network#meetings)
-->
如果你對未來關於 Kubernetes 流量工程的討論感興趣，可以通過以下方式參與 SIG Network：
* Slack：[#sig-network](https://kubernetes.slack.com/messages/sig-network)
* [郵件列表](https://groups.google.com/forum/#!forum/kubernetes-sig-network)
* [開放社區的 Issue/PR](https://github.com/kubernetes/community/labels/sig%2Fnetwork)
* [雙週會議](https://github.com/kubernetes/community/tree/master/sig-network#meetings)
