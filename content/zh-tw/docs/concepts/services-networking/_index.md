---
title: "服務、負載均衡和聯網"
weight: 60
description: Kubernetes 網路背後的概念和資源。
---

<!--
## The Kubernetes network model

Every [`Pod`](/docs/concepts/workloads/pods/) in a cluster gets its own unique cluster-wide IP address. 
This means you do not need to explicitly create links between `Pods` and you
almost never need to deal with mapping container ports to host ports.  
This creates a clean, backwards-compatible model where `Pods` can be treated
much like VMs or physical hosts from the perspectives of port allocation,
naming, service discovery, [load balancing](/docs/concepts/services-networking/ingress/#load-balancing),
application configuration, and migration.
-->
## Kubernetes 網路模型   {#the-kubernetes-network-model}

叢集中每一個 [`Pod`](/zh-cn/docs/concepts/workloads/pods/) 都會獲得自己的、
獨一無二的 IP 地址，
這就意味著你不需要顯式地在 `Pod` 之間建立連結，你幾乎不需要處理容器埠到主機埠之間的對映。
這將形成一個乾淨的、向後相容的模型；在這個模型裡，從埠分配、命名、服務發現、
[負載均衡](/zh-cn/docs/concepts/services-networking/ingress/#load-balancing)、
應用配置和遷移的角度來看，`Pod` 可以被視作虛擬機器或者物理主機。

<!--
Kubernetes imposes the following fundamental requirements on any networking
implementation (barring any intentional network segmentation policies):
-->
Kubernetes 強制要求所有網路設施都滿足以下基本要求（從而排除了有意隔離網路的策略）：

<!--
* pods can communicate with all other pods on any other [node](/docs/concepts/architecture/nodes/) 
  without NAT
* agents on a node (e.g. system daemons, kubelet) can communicate with all
  pods on that node
-->
* Pod 能夠與所有其他[節點](/zh-cn/docs/concepts/architecture/nodes/)上的 Pod 通訊，
  且不需要網路地址轉譯（NAT）
* 節點上的代理（比如：系統守護程序、kubelet）可以和節點上的所有 Pod 通訊

<!--
Note: For those platforms that support `Pods` running in the host network (e.g.
Linux), when pods are attached to the host network of a node they can still communicate 
with all pods on all nodes without NAT.
-->
說明：對於支援在主機網路中執行 `Pod` 的平臺（比如：Linux），
當 Pod 掛接到節點的宿主網路上時，它們仍可以不透過 NAT 和所有節點上的 Pod 通訊。

<!--
This model is not only less complex overall, but it is principally compatible
with the desire for Kubernetes to enable low-friction porting of apps from VMs
to containers.  If your job previously ran in a VM, your VM had an IP and could
talk to other VMs in your project.  This is the same basic model.

Kubernetes IP addresses exist at the `Pod` scope - containers within a `Pod`
share their network namespaces - including their IP address and MAC address.
This means that containers within a `Pod` can all reach each other's ports on
`localhost`. This also means that containers within a `Pod` must coordinate port
usage, but this is no different from processes in a VM.  This is called the
"IP-per-pod" model.
-->
這個模型不僅不復雜，而且還和 Kubernetes 的實現從虛擬機器向容器平滑遷移的初衷相符，
如果你的任務開始是在虛擬機器中執行的，你的虛擬機器有一個 IP，
可以和專案中其他虛擬機器通訊。這裡的模型是基本相同的。

Kubernetes 的 IP 地址存在於 `Pod` 範圍內 —— 容器共享它們的網路名稱空間 ——
包括它們的 IP 地址和 MAC 地址。
這就意味著 `Pod` 內的容器都可以透過 `localhost` 到達對方埠。
這也意味著 `Pod` 內的容器需要相互協調埠的使用，但是這和虛擬機器中的程序似乎沒有什麼不同，
這也被稱為“一個 Pod 一個 IP”模型。

<!--
How this is implemented is a detail of the particular container runtime in use.

It is possible to request ports on the `Node` itself which forward to your `Pod`
(called host ports), but this is a very niche operation. How that forwarding is
implemented is also a detail of the container runtime. The `Pod` itself is
blind to the existence or non-existence of host ports.
-->
如何實現以上需求是所使用的特定容器執行時的細節。

也可以在 `Node` 本身請求埠，並用這類埠轉發到你的 `Pod`（稱之為主機埠），
但這是一個很特殊的操作。轉發方式如何實現也是容器執行時的細節。
`Pod` 自己並不知道這些主機埠的存在。

<!--
Kubernetes networking addresses four concerns:
- Containers within a Pod [use networking to communicate](/docs/concepts/services-networking/dns-pod-service/) via loopback.
- Cluster networking provides communication between different Pods.
- The [Service resource](/docs/concepts/services-networking/service/) lets you [expose an application running in Pods](/docs/concepts/services-networking/connect-applications-service/) to be reachable from outside your cluster.
- You can also use Services to [publish services only for consumption inside your cluster](/docs/concepts/services-networking/service-traffic-policy/).
-->

Kubernetes 網路解決四方面的問題：

- 一個 Pod 中的容器之間[透過本地迴路（loopback）通訊](/zh-cn/docs/concepts/services-networking/dns-pod-service/)。
- 叢集網路在不同 pod 之間提供通訊。
- [Service 資源](/zh-cn/docs/concepts/services-networking/service/)允許你
  [向外暴露 Pods 中執行的應用](/zh-cn/docs/concepts/services-networking/connect-applications-service/)，
  以支援來自於叢集外部的訪問。
- 可以使用 Services 來[釋出僅供叢集內部使用的服務](/zh-cn/docs/concepts/services-networking/service-traffic-policy/)。
