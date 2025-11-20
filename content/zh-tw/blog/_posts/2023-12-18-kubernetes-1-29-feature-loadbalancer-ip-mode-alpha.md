---
layout: blog
title: "Kubernetes 1.29 新的 Alpha 特性：Service 的負載均衡器 IP 模式"
date: 2023-12-18
slug: kubernetes-1-29-feature-loadbalancer-ip-mode-alpha
---
<!-- 
layout: blog
title: "Kubernetes 1.29: New (alpha) Feature, Load Balancer IP Mode for Services"
date: 2023-12-18
slug: kubernetes-1-29-feature-loadbalancer-ip-mode-alpha
-->

<!-- **Author:** [Aohan Yang](https://github.com/RyanAoh) -->
**作者：** [Aohan Yang](https://github.com/RyanAoh)

**譯者：** Allen Zhang

<!-- 
This blog introduces a new alpha feature in Kubernetes 1.29. 
It provides a configurable approach to define how Service implementations, 
exemplified in this blog by kube-proxy, 
handle traffic from pods to the Service, within the cluster. 
-->
本文介紹 Kubernetes 1.29 中一個新的 Alpha 特性。
此特性提供了一種可設定的方式用於定義 Service 的實現方式，本文中以
kube-proxy 爲例介紹如何處理叢集內從 Pod 到 Service 的流量。

<!-- 
## Background 
-->
## 背景

<!-- 
In older Kubernetes releases, the kube-proxy would intercept traffic that was destined for the IP
address associated with a Service of `type: LoadBalancer`. This happened whatever mode you used
for `kube-proxy`.  
-->
在 Kubernetes 早期版本中，kube-proxy 會攔截指向 `type: LoadBalancer` Service 關聯
IP 地址的流量。這與你爲 `kube-proxy` 所使用的哪種模式無關。
<!-- 
The interception implemented the expected behavior (traffic eventually reaching the expected
endpoints behind the Service). The mechanism to make that work depended on the mode for kube-proxy;
on Linux, kube-proxy in iptables mode would redirecting packets directly to the endpoint; in ipvs mode,
kube-proxy would configure the load balancer's IP address to one interface on the node. 
The motivation for implementing that interception was for two reasons: 
-->
這種攔截實現了預期行爲（流量最終會抵達服務後掛載的端點）。這種機制取決於 kube-proxy 的模式，在
Linux 中，運行於 iptables 模式下的 kube-proxy 會重定向資料包到後端端點；在 ipvs 模式下，
kube-proxy 會將負載均衡器的 IP 地址設定到節點的一個網路介面上。採用這種攔截有兩個原因：

<!-- 
1. **Traffic path optimization:** Efficiently redirecting pod traffic - when a container in a pod sends an outbound
   packet that is destined for the load balancer's IP address - 
   directly to the backend service by bypassing the load balancer. 
-->
1. **流量路徑優化：** 高效地重定向 Pod 流量 - 當 Pod 中的容器發送指向負載均衡器 IP 地址的出站包時，
   會繞過負載均衡器直接重定向到後端服務。
  
<!-- 
2. **Handling load balancer packets:** Some load balancers send packets with the destination IP set to 
the load balancer's IP address. As a result, these packets need to be routed directly to the correct backend (which 
might not be local to that node), in order to avoid loops. 
-->
2. **處理負載均衡資料包：** 有些負載均衡器發送的資料包設置目標 IP 爲負載均衡器的 IP 地址。
   因此，這些資料包需要被直接路由到正確的後端（可能不在該節點本地），以避免迴環。
  
<!-- 
## Problems 
-->
## 問題

<!-- 
However, there are several problems with the aforementioned behavior: 
-->
然而，上述行爲存在幾個問題：

<!-- 
1. **[Source IP](https://github.com/kubernetes/kubernetes/issues/79783):** 
    Some cloud providers use the load balancer's IP as the source IP when 
    transmitting packets to the node. In the ipvs mode of kube-proxy, 
    there is a problem that health checks from the load balancer never return. This occurs because the reply packets 
    would be forward to the local interface `kube-ipvs0`(where the load balancer's IP is bound to) 
    and be subsequently ignored. 
-->
1. **[源 IP（Source IP）](https://github.com/kubernetes/kubernetes/issues/79783)：** 
    一些雲廠商在傳輸資料包到節點時使用負載均衡器的 IP 地址作爲源 IP。在 kube-proxy 的 ipvs 模式下，
    存在負載均衡器健康檢查永遠不會返回的問題。原因是回覆的資料包被轉發到本地網路介面 `kube-ipvs0`（綁定負載均衡器 IP 的介面）上並被忽略。
  
<!-- 
2. **[Feature loss at load balancer level](https://github.com/kubernetes/kubernetes/issues/66607):**
    Certain cloud providers offer features(such as TLS termination, proxy protocol, etc.) at the
    load balancer level.
    Bypassing the load balancer results in the loss of these features when the packet reaches the service
    (leading to protocol errors). 
-->
2. **[負載均衡器層功能缺失](https://github.com/kubernetes/kubernetes/issues/66607)：**
    某些雲廠商在負載均衡器層提供了部分特性（例如 TLS 終結、協議代理等）。
    繞過負載均衡器會導致當資料包抵達後端服務時這些特性不會生效（導致協議錯誤等）。
  

<!-- 
Even with the new alpha behaviour disabled (the default), there is a 
[workaround](https://github.com/kubernetes/kubernetes/issues/66607#issuecomment-474513060) 
that involves setting `.status.loadBalancer.ingress.hostname` for the Service, in order 
to bypass kube-proxy binding. 
But this is just a makeshift solution. 
-->
即使新的 Alpha 特性預設關閉，也有[臨時解決方案](https://github.com/kubernetes/kubernetes/issues/66607#issuecomment-474513060)，
即爲 Service 設置 `.status.loadBalancer.ingress.hostname` 以繞過 kube-proxy 綁定。
但這終究只是臨時解決方案。

<!-- 
## Solution 
-->
## 解決方案

<!-- 
In summary, providing an option for cloud providers to disable the current behavior would be highly beneficial. 
-->
總之，爲雲廠商提供選項以禁用當前這種行爲大有裨益。

<!-- 
To address this, Kubernetes v1.29 introduces a new (alpha) `.status.loadBalancer.ingress.ipMode` 
field for a Service.
This field specifies how the load balancer IP behaves and can be specified only when 
the `.status.loadBalancer.ingress.ip` field is also specified. 
-->
Kubernetes 1.29 版本爲 Service 引入新的 Alpha 字段 `.status.loadBalancer.ingress.ipMode` 以解決上述問題。
該字段指定負載均衡器 IP 的運行方式，並且只有在指定 `.status.loadBalancer.ingress.ip` 字段時才能指定。

<!-- 
Two values are possible for `.status.loadBalancer.ingress.ipMode`: `"VIP"` and `"Proxy"`.
The default value is "VIP", meaning that traffic delivered to the node 
with the destination set to the load balancer's IP and port will be redirected to the backend service by kube-proxy.
This preserves the existing behavior of kube-proxy. 
The "Proxy" value is intended to prevent kube-proxy from binding the load balancer's IP address 
to the node in both ipvs and iptables modes. 
Consequently, traffic is sent directly to the load balancer and then forwarded to the destination node. 
The destination setting for forwarded packets varies depending on how the cloud provider's load balancer delivers traffic: 
-->
`.status.loadBalancer.ingress.ipMode` 可選值爲：`"VIP"` 和 `"Proxy"`。
預設值爲 `VIP`，即目標 IP 設置爲負載均衡 IP 和端口併發送到節點的流量會被 kube-proxy 重定向到後端服務。
這種方式保持 kube-proxy 現有行爲模式。`Proxy` 用於阻止 kube-proxy 在 ipvs 和 iptables 模式下綁定負載均衡 IP 地址到節點。
此時，流量會直達負載均衡器然後被重定向到目標節點。轉發資料包的目的值設定取決於雲廠商的負載均衡器如何傳輸流量。

<!-- 
- If the traffic is delivered to the node then DNATed to the pod, the destination would be set to the node's IP and node port;
- If the traffic is delivered directly to the pod, the destination would be set to the pod's IP and port. 
-->
- 如果流量被髮送到節點然後通過目標地址轉換（`DNAT`）的方式到達 Pod，目的地應當設置爲節點和 IP 和端口；
- 如果流量被直接轉發到 Pod，目的地應當被設置爲 Pod 的 IP 和端口。

<!-- 
## Usage 
-->
## 用法

<!-- 
Here are the necessary steps to enable this feature: 
-->
開啓該特性的必要步驟：

<!-- 
- Download the [latest Kubernetes project](https://kubernetes.io/releases/download/) (version `v1.29.0` or later).
- Enable the feature gate with the command line flag `--feature-gates=LoadBalancerIPMode=true` 
on kube-proxy, kube-apiserver, and cloud-controller-manager.
- For Services with `type: LoadBalancer`, set `ipMode` to the appropriate value. 
This step is likely handled by your chosen cloud-controller-manager during the `EnsureLoadBalancer` process. 
-->
- 下載 [Kubernetes 最新版本](https://kubernetes.io/releases/download/)（`v1.29.0` 或更新）。
- 通過命令列參數 `--feature-gates=LoadBalancerIPMode=true` 在 kube-proxy、kube-apiserver 和
    cloud-controller-manager 開啓特性門控。
- 對於 `type: LoadBalancer` 類型的 Service，將 `ipMode` 設置爲合適的值。
    這一步可能由你在 `EnsureLoadBalancer` 過程中選擇的 cloud-controller-manager 進行處理。

<!-- 
## More information 
-->
## 更多資訊

<!-- 
- Read [Specifying IPMode of load balancer status](/docs/concepts/services-networking/service/#load-balancer-ip-mode).
- Read [KEP-1860](https://kep.k8s.io/1860) - [Make Kubernetes aware of the LoadBalancer behaviour](https://github.com/kubernetes/enhancements/tree/b103a6b0992439f996be4314caf3bf7b75652366/keps/sig-network/1860-kube-proxy-IP-node-binding#kep-1860-make-kubernetes-aware-of-the-loadbalancer-behaviour) _(sic)_.
 -->
- 閱讀[指定負載均衡器狀態的 IPMode](/zh-cn/docs/concepts/services-networking/service/#load-balancer-ip-mode)。
- 閱讀 [KEP-1860](https://kep.k8s.io/1860) - [讓 Kubernetes 感知負載均衡器的行爲](https://github.com/kubernetes/enhancements/tree/b103a6b0992439f996be4314caf3bf7b75652366/keps/sig-network/1860-kube-proxy-IP-node-binding#kep-1860-make-kubernetes-aware-of-the-loadbalancer-behaviour) _(sic)_。

<!-- 
## Getting involved 
-->
## 聯繫我們

<!-- 
Reach us on [Slack](https://slack.k8s.io/): [#sig-network](https://kubernetes.slack.com/messages/sig-network), 
or through the [mailing list](https://groups.google.com/forum/#!forum/kubernetes-sig-network).
 -->
通過 [Slack](https://slack.k8s.io/) 頻道 [#sig-network](https://kubernetes.slack.com/messages/sig-network), 
或者通過[郵件列表](https://groups.google.com/forum/#!forum/kubernetes-sig-network)聯繫我們。

<!-- 
## Acknowledgments 
-->
## 特別鳴謝

<!-- 
Huge thanks to [@Sh4d1](https://github.com/Sh4d1) for the original KEP and initial implementation code. 
I took over midway and completed the work. Similarly, immense gratitude to other contributors 
who have assisted in the design, implementation, and review of this feature (alphabetical order): 
-->
非常感謝 [@Sh4d1](https://github.com/Sh4d1) 的原始提案和最初代碼實現。
我中途接手並完成了這項工作。同樣我們也向其他幫助設計、實現、審查特性代碼的貢獻者表示感謝（按首字母順序排列）：

- [@aojea](https://github.com/aojea)
- [@danwinship](https://github.com/danwinship)
- [@sftim](https://github.com/sftim)
- [@tengqm](https://github.com/tengqm)
- [@thockin](https://github.com/thockin)
- [@wojtek-t](https://github.com/wojtek-t)