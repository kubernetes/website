---
layout: blog
title: "Kubernetes 1.29 新的 Alpha 特性：Service 的负载均衡器 IP 模式"
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

**译者：** Allen Zhang

<!-- 
This blog introduces a new alpha feature in Kubernetes 1.29. 
It provides a configurable approach to define how Service implementations, 
exemplified in this blog by kube-proxy, 
handle traffic from pods to the Service, within the cluster. 
-->
本文介绍 Kubernetes 1.29 中一个新的 Alpha 特性。
此特性提供了一种可配置的方式用于定义 Service 的实现方式，本文中以
kube-proxy 为例介绍如何处理集群内从 Pod 到 Service 的流量。

<!-- 
## Background 
-->
## 背景

<!-- 
In older Kubernetes releases, the kube-proxy would intercept traffic that was destined for the IP
address associated with a Service of `type: LoadBalancer`. This happened whatever mode you used
for `kube-proxy`.  
-->
在 Kubernetes 早期版本中，kube-proxy 会拦截指向 `type: LoadBalancer` Service 关联
IP 地址的流量。这与你为 `kube-proxy` 所使用的哪种模式无关。
<!-- 
The interception implemented the expected behavior (traffic eventually reaching the expected
endpoints behind the Service). The mechanism to make that work depended on the mode for kube-proxy;
on Linux, kube-proxy in iptables mode would redirecting packets directly to the endpoint; in ipvs mode,
kube-proxy would configure the load balancer's IP address to one interface on the node. 
The motivation for implementing that interception was for two reasons: 
-->
这种拦截实现了预期行为（流量最终会抵达服务后挂载的端点）。这种机制取决于 kube-proxy 的模式，在
Linux 中，运行于 iptables 模式下的 kube-proxy 会重定向数据包到后端端点；在 ipvs 模式下，
kube-proxy 会将负载均衡器的 IP 地址配置到节点的一个网络接口上。采用这种拦截有两个原因：

<!-- 
1. **Traffic path optimization:** Efficiently redirecting pod traffic - when a container in a pod sends an outbound
   packet that is destined for the load balancer's IP address - 
   directly to the backend service by bypassing the load balancer. 
-->
1. **流量路径优化：** 高效地重定向 Pod 流量 - 当 Pod 中的容器发送指向负载均衡器 IP 地址的出站包时，
   会绕过负载均衡器直接重定向到后端服务。
  
<!-- 
2. **Handling load balancer packets:** Some load balancers send packets with the destination IP set to 
the load balancer's IP address. As a result, these packets need to be routed directly to the correct backend (which 
might not be local to that node), in order to avoid loops. 
-->
2. **处理负载均衡数据包：** 有些负载均衡器发送的数据包设置目标 IP 为负载均衡器的 IP 地址。
   因此，这些数据包需要被直接路由到正确的后端（可能不在该节点本地），以避免回环。
  
<!-- 
## Problems 
-->
## 问题

<!-- 
However, there are several problems with the aforementioned behavior: 
-->
然而，上述行为存在几个问题：

<!-- 
1. **[Source IP](https://github.com/kubernetes/kubernetes/issues/79783):** 
    Some cloud providers use the load balancer's IP as the source IP when 
    transmitting packets to the node. In the ipvs mode of kube-proxy, 
    there is a problem that health checks from the load balancer never return. This occurs because the reply packets 
    would be forward to the local interface `kube-ipvs0`(where the load balancer's IP is bound to) 
    and be subsequently ignored. 
-->
1. **[源 IP（Source IP）](https://github.com/kubernetes/kubernetes/issues/79783)：** 
    一些云厂商在传输数据包到节点时使用负载均衡器的 IP 地址作为源 IP。在 kube-proxy 的 ipvs 模式下，
    存在负载均衡器健康检查永远不会返回的问题。原因是回复的数据包被转发到本地网络接口 `kube-ipvs0`（绑定负载均衡器 IP 的接口）上并被忽略。
  
<!-- 
2. **[Feature loss at load balancer level](https://github.com/kubernetes/kubernetes/issues/66607):**
    Certain cloud providers offer features(such as TLS termination, proxy protocol, etc.) at the
    load balancer level.
    Bypassing the load balancer results in the loss of these features when the packet reaches the service
    (leading to protocol errors). 
-->
2. **[负载均衡器层功能缺失](https://github.com/kubernetes/kubernetes/issues/66607)：**
    某些云厂商在负载均衡器层提供了部分特性（例如 TLS 终结、协议代理等）。
    绕过负载均衡器会导致当数据包抵达后端服务时这些特性不会生效（导致协议错误等）。
  

<!-- 
Even with the new alpha behaviour disabled (the default), there is a 
[workaround](https://github.com/kubernetes/kubernetes/issues/66607#issuecomment-474513060) 
that involves setting `.status.loadBalancer.ingress.hostname` for the Service, in order 
to bypass kube-proxy binding. 
But this is just a makeshift solution. 
-->
即使新的 Alpha 特性默认关闭，也有[临时解决方案](https://github.com/kubernetes/kubernetes/issues/66607#issuecomment-474513060)，
即为 Service 设置 `.status.loadBalancer.ingress.hostname` 以绕过 kube-proxy 绑定。
但这终究只是临时解决方案。

<!-- 
## Solution 
-->
## 解决方案

<!-- 
In summary, providing an option for cloud providers to disable the current behavior would be highly beneficial. 
-->
总之，为云厂商提供选项以禁用当前这种行为大有裨益。

<!-- 
To address this, Kubernetes v1.29 introduces a new (alpha) `.status.loadBalancer.ingress.ipMode` 
field for a Service.
This field specifies how the load balancer IP behaves and can be specified only when 
the `.status.loadBalancer.ingress.ip` field is also specified. 
-->
Kubernetes 1.29 版本为 Service 引入新的 Alpha 字段 `.status.loadBalancer.ingress.ipMode` 以解决上述问题。
该字段指定负载均衡器 IP 的运行方式，并且只有在指定 `.status.loadBalancer.ingress.ip` 字段时才能指定。

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
`.status.loadBalancer.ingress.ipMode` 可选值为：`"VIP"` 和 `"Proxy"`。
默认值为 `VIP`，即目标 IP 设置为负载均衡 IP 和端口并发送到节点的流量会被 kube-proxy 重定向到后端服务。
这种方式保持 kube-proxy 现有行为模式。`Proxy` 用于阻止 kube-proxy 在 ipvs 和 iptables 模式下绑定负载均衡 IP 地址到节点。
此时，流量会直达负载均衡器然后被重定向到目标节点。转发数据包的目的值配置取决于云厂商的负载均衡器如何传输流量。

<!-- 
- If the traffic is delivered to the node then DNATed to the pod, the destination would be set to the node's IP and node port;
- If the traffic is delivered directly to the pod, the destination would be set to the pod's IP and port. 
-->
- 如果流量被发送到节点然后通过目标地址转换（`DNAT`）的方式到达 Pod，目的地应当设置为节点和 IP 和端口；
- 如果流量被直接转发到 Pod，目的地应当被设置为 Pod 的 IP 和端口。

<!-- 
## Usage 
-->
## 用法

<!-- 
Here are the necessary steps to enable this feature: 
-->
开启该特性的必要步骤：

<!-- 
- Download the [latest Kubernetes project](https://kubernetes.io/releases/download/) (version `v1.29.0` or later).
- Enable the feature gate with the command line flag `--feature-gates=LoadBalancerIPMode=true` 
on kube-proxy, kube-apiserver, and cloud-controller-manager.
- For Services with `type: LoadBalancer`, set `ipMode` to the appropriate value. 
This step is likely handled by your chosen cloud-controller-manager during the `EnsureLoadBalancer` process. 
-->
- 下载 [Kubernetes 最新版本](https://kubernetes.io/releases/download/)（`v1.29.0` 或更新）。
- 通过命令行参数 `--feature-gates=LoadBalancerIPMode=true` 在 kube-proxy、kube-apiserver 和
    cloud-controller-manager 开启特性门控。
- 对于 `type: LoadBalancer` 类型的 Service，将 `ipMode` 设置为合适的值。
    这一步可能由你在 `EnsureLoadBalancer` 过程中选择的 cloud-controller-manager 进行处理。

<!-- 
## More information 
-->
## 更多信息

<!-- 
- Read [Specifying IPMode of load balancer status](/docs/concepts/services-networking/service/#load-balancer-ip-mode).
- Read [KEP-1860](https://kep.k8s.io/1860) - [Make Kubernetes aware of the LoadBalancer behaviour](https://github.com/kubernetes/enhancements/tree/b103a6b0992439f996be4314caf3bf7b75652366/keps/sig-network/1860-kube-proxy-IP-node-binding#kep-1860-make-kubernetes-aware-of-the-loadbalancer-behaviour) _(sic)_.
 -->
- 阅读[指定负载均衡器状态的 IPMode](/zh-cn/docs/concepts/services-networking/service/#load-balancer-ip-mode)。
- 阅读 [KEP-1860](https://kep.k8s.io/1860) - [让 Kubernetes 感知负载均衡器的行为](https://github.com/kubernetes/enhancements/tree/b103a6b0992439f996be4314caf3bf7b75652366/keps/sig-network/1860-kube-proxy-IP-node-binding#kep-1860-make-kubernetes-aware-of-the-loadbalancer-behaviour) _(sic)_。

<!-- 
## Getting involved 
-->
## 联系我们

<!-- 
Reach us on [Slack](https://slack.k8s.io/): [#sig-network](https://kubernetes.slack.com/messages/sig-network), 
or through the [mailing list](https://groups.google.com/forum/#!forum/kubernetes-sig-network).
 -->
通过 [Slack](https://slack.k8s.io/) 频道 [#sig-network](https://kubernetes.slack.com/messages/sig-network), 
或者通过[邮件列表](https://groups.google.com/forum/#!forum/kubernetes-sig-network)联系我们。

<!-- 
## Acknowledgments 
-->
## 特别鸣谢

<!-- 
Huge thanks to [@Sh4d1](https://github.com/Sh4d1) for the original KEP and initial implementation code. 
I took over midway and completed the work. Similarly, immense gratitude to other contributors 
who have assisted in the design, implementation, and review of this feature (alphabetical order): 
-->
非常感谢 [@Sh4d1](https://github.com/Sh4d1) 的原始提案和最初代码实现。
我中途接手并完成了这项工作。同样我们也向其他帮助设计、实现、审查特性代码的贡献者表示感谢（按首字母顺序排列）：

- [@aojea](https://github.com/aojea)
- [@danwinship](https://github.com/danwinship)
- [@sftim](https://github.com/sftim)
- [@tengqm](https://github.com/tengqm)
- [@thockin](https://github.com/thockin)
- [@wojtek-t](https://github.com/wojtek-t)