---
title: 端口和协议
content_type: reference
weight: 50
---

<!--
title: Ports and Protocols
content_type: reference
weight: 50
-->

<!--
When running Kubernetes in an environment with strict network boundaries, such 
as on-premises datacenter with physical network firewalls or Virtual 
Networks in Public Cloud, it is useful to be aware of the ports and protocols 
used by Kubernetes components
-->
当你在一个有严格网络边界的环境里运行 Kubernetes，例如拥有物理网络防火墙或者拥有公有云中虚拟网络的自有数据中心，
了解 Kubernetes 组件使用了哪些端口和协议是非常有用的。

<!--
## Control plane

| Protocol | Direction | Port Range | Purpose                 | Used By                   |
|----------|-----------|------------|-------------------------|---------------------------|
| TCP      | Inbound   | 6443       | Kubernetes API server   | All                       |
| TCP      | Inbound   | 2379-2380  | etcd server client API  | kube-apiserver, etcd      |
| TCP      | Inbound   | 10250      | Kubelet API             | Self, Control plane       |
| TCP      | Inbound   | 10259      | kube-scheduler          | Self                      |
| TCP      | Inbound   | 10257      | kube-controller-manager | Self                      |

Although etcd ports are included in control plane section, you can also host your own
etcd cluster externally or on custom ports. 
-->
## 控制面  {#control-plane}

| 协议     | 方向      | 端口范围     | 目的                     | 使用者                     |
|----------|-----------|------------|-------------------------|---------------------------|
| TCP      | 入站       | 6443       | Kubernetes API 服务器    | 所有                       |
| TCP      | 入站       | 2379-2380  | etcd 服务器客户端 API     | kube-apiserver、etcd      |
| TCP      | 入站       | 10250      | kubelet API             | 自身、控制面                |
| TCP      | 入站       | 10259      | kube-scheduler          | 自身                       |
| TCP      | 入站       | 10257      | kube-controller-manager | 自身                       |

尽管 etcd 的端口也列举在控制面的部分，但你也可以在外部自己托管 etcd 集群或者自定义端口。

<!--
## Worker node(s) {#node}

| Protocol | Direction | Port Range  | Purpose               | Used By                 |
|----------|-----------|-------------|-----------------------|-------------------------|
| TCP      | Inbound   | 10250       | Kubelet API           | Self, Control plane     |
| TCP      | Inbound   | 10256       | kube-proxy            | Self, Load balancers    |
| TCP      | Inbound   | 30000-32767 | NodePort Services†    | All                     |

† Default port range for [NodePort Services](/docs/concepts/services-networking/service/).

All default port numbers can be overridden. When custom ports are used those 
ports need to be open instead of defaults mentioned here. 

One common example is API server port that is sometimes switched
to 443. Alternatively, the default port is kept as is and API server is put 
behind a load balancer that listens on 443 and routes the requests to API server
on the default port.
-->
## 工作节点  {#node}

| 协议     | 方向      | 端口范围     | 目的                     | 使用者                  |
|----------|-----------|-------------|-----------------------|-------------------------|
| TCP      | 入站       | 10250       | kubelet API           | 自身、控制面             |
| TCP      | 入站       | 10256       | kube-proxy            | 自身、负载均衡器   |
| TCP      | 入站       | 30000-32767 | NodePort Services†    | 所有                    |

† [NodePort Service](/zh-cn/docs/concepts/services-networking/service/) 的默认端口范围。

所有默认端口都可以重新配置。当使用自定义的端口时，你需要打开这些端口来代替这里提到的默认端口。

一个常见的例子是 API 服务器的端口有时会配置为 443。或者你也可以使用默认端口，
把 API 服务器放到一个监听 443 端口的负载均衡器后面，并且路由所有请求到 API 服务器的默认端口。
