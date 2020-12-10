---
title: 使用 Source IP
content_type: tutorial
min-kubernetes-server-version: v1.5
---
<!--
title: Using Source IP
content_type: tutorial
min-kubernetes-server-version: v1.5
-->

<!-- overview -->

<!--
Applications running in a Kubernetes cluster find and communicate with each
other, and the outside world, through the Service abstraction. This document
explains what happens to the source IP of packets sent to different types
of Services, and how you can toggle this behavior according to your needs.
-->
Kubernetes 集群中运行的应用通过 Service 抽象来互相查找、通信和与外界进行通信。
本文介绍被发送到不同类型 Services 的数据包源 IP 的变化过程，你可以根据你的需求改变这些行为。

## {{% heading "prerequisites" %}}

<!--
### Terminology
-->
## 术语表

<!--
This document makes use of the following terms:
-->
本文使用了下列术语：

<!--
{{< comment >}}
If localizing this section, link to the equivalent Wikipedia pages for
the target localization.
{{< /comment >}}
-->
{{< comment >}}
如果要本地化此部分，请链接到目标语言对应的 Wikipedia 页面。
{{< /comment >}}

<!--
[NAT](https://en.wikipedia.org/wiki/Network_address_translation)
: network address translation

[Source NAT](https://en.wikipedia.org/wiki/Network_address_translation#SNAT)
: replacing the source IP on a packet; in this page, that usually means replacing with the IP address of a node.

[Destination NAT](https://en.wikipedia.org/wiki/Network_address_translation#DNAT)
: replacing the destination IP on a packet; in this page, that usually means replacing with the IP address of a {{< glossary_tooltip term_id="pod" >}}

[VIP](/docs/concepts/services-networking/service/#virtual-ips-and-service-proxies)
: a virtual IP address, such as the one assigned to every {{< glossary_tooltip text="Service" term_id="service" >}} in Kubernetes

[kube-proxy](/docs/concepts/services-networking/service/#virtual-ips-and-service-proxies)
: a network daemon that orchestrates Service VIP management on every node
-->
[NAT](https://zh.wikipedia.org/wiki/%E7%BD%91%E7%BB%9C%E5%9C%B0%E5%9D%80%E8%BD%AC%E6%8D%A2)
: 网络地址转换

[Source NAT](https://en.wikipedia.org/wiki/Network_address_translation#SNAT)
: 替换数据包的源 IP；在本页内通常指节点的 IP。

[Destination NAT](https://en.wikipedia.org/wiki/Network_address_translation#DNAT)
: 替换数据包的源 IP；在本页内通常指 {{< glossary_tooltip term_id="pod" >}} 的 IP

[VIP](/zh/docs/concepts/services-networking/service/#virtual-ips-and-service-proxies)
: 一个虚拟 IP, 例如分配给 Kubernetes {{< glossary_tooltip text="Service" term_id="service" >}} 的 IP。

[kube-proxy](/zh/docs/concepts/services-networking/service/#virtual-ips-and-service-proxies)
: 一个网络守护程序，在每个节点上协调 Service VIP 管理

<!--
### Prerequisites
-->
### 准备工作

{{< include "task-tutorial-prereqs.md" >}}

<!--
The examples use a small nginx webserver that echoes back the source
IP of requests it receives through an HTTP header. You can create it as follows:
-->
这些示例需要一个小型 Nginx Web 服务器，通过一个HTTP消息头返回它接收到请求的源 IP。你可以像下面这样创建它：

```shell
kubectl run source-ip-app --image=k8s.gcr.io/echoserver:1.4
```

<!-- The output is: -->
输出结果为：

```
deployment.apps/source-ip-app created
```



## {{% heading "objectives" %}}


<!--
* Expose a simple application through various types of Services
* Understand how each Service type handles source IP NAT
* Understand the tradeoffs involved in preserving source IP
-->
* 通过多种类型的 Services 暴露一个简单应用
* 理解每种 Service 类型如何处理源 IP NAT
* 理解保留源 IP 所涉及的折中




<!-- lessoncontent -->

<!-- 
## Source IP for Services with `Type=ClusterIP`
-->
## 'Type=ClusterIP' 类型 Services 的 Source IP

<!-- 
Packets sent to ClusterIP from within the cluster are never source NAT'd if
you're running kube-proxy in
[iptables mode](/docs/concepts/services-networking/service/#proxy-mode-iptables),
(the default). You can query the kube-proxy mode by fetching
`http://localhost:10249/proxyMode` on the node where kube-proxy is running. 
-->
如果你的 kube-proxy 运行在 [iptables 模式](/zh/docs/concepts/services-networking/service/#proxy-mode-iptables)下，
从集群内部发送到 ClusterIP 的包的源地址永远不会被 NAT 转换。
你可以在运行 Kube-proxy 的节点上通过获取 `http://localhost:10249/proxyMode`
查询 kube-proxy 的模式。

```console
kubectl get nodes
```
<!-- 
The output is similar to this: 
-->
输出结果与以下结果类似:
```
NAME                           STATUS     ROLES    AGE     VERSION
kubernetes-node-6jst   Ready      <none>   2h      v1.13.0
kubernetes-node-cx31   Ready      <none>   2h      v1.13.0
kubernetes-node-jj1t   Ready      <none>   2h      v1.13.0
```

<!-- 
Get the proxy mode on one of the nodes (kube-proxy listens on port 10249): 
-->
从其中一个节点中读取其代理模式（kube-proxy 监听 10249 端口）：
<!--
```shell
# Run this in a shell on the node you want to query.
curl http://localhost:10249/proxyMode
```
-->
```shell
# 在你想进行查询的节点上运行这条命令。
curl http://localhost:10249/proxyMode
```
<!-- 
The output is similar to this: 
-->
输出结果类似这样：
```
iptables
```
<!-- 
You can test source IP preservation by creating a Service over the source IP app: 
-->
你可以通过在源 IP 应用上创建一个 Service 来测试源 IP 保留。
```shell
kubectl expose deployment source-ip-app --name=clusterip --port=80 --target-port=8080
```
<!-- 
The output is: 
-->
输出结果为：
```
service/clusterip exposed
```
```shell
kubectl get svc clusterip
```
<!-- 
The output is similar to this: 
-->
输出结果与以下类似：
```
NAME         TYPE        CLUSTER-IP    EXTERNAL-IP   PORT(S)   AGE
clusterip    ClusterIP   10.0.170.92   <none>        80/TCP    51s
```

<!--
And hitting the `ClusterIP` from a pod in the same cluster:
-->
从相同集群中的一个 Pod 访问这个 `ClusterIP`：
```shell
kubectl run busybox -it --image=busybox --restart=Never --rm
```
<!-- 
The output is similar to this: 
-->
输出结果与以下结果类似：
```
Waiting for pod default/busybox to be running, status is Pending, pod ready: false
If you don't see a command prompt, try pressing enter.

```
<!-- 
You can then run a command inside that Pod: 
-->
接下来你可以在此 Pod 中运行这个命令：
<!--
```shell
# Run this inside the terminal from "kubectl run"
ip addr
```
-->
```shell
# 在终端中通过 "kubectl run" 运行
ip addr
```
```
1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
    inet 127.0.0.1/8 scope host lo
       valid_lft forever preferred_lft forever
    inet6 ::1/128 scope host
       valid_lft forever preferred_lft forever
3: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1460 qdisc noqueue
    link/ether 0a:58:0a:f4:03:08 brd ff:ff:ff:ff:ff:ff
    inet 10.244.3.8/24 scope global eth0
       valid_lft forever preferred_lft forever
    inet6 fe80::188a:84ff:feb0:26a5/64 scope link
       valid_lft forever preferred_lft forever
```

<!-- …then use `wget` to query the local webserver -->
…然后使用 `wget` 查询本地网络服务器
<!--
```shell
# Replace "10.0.170.92" with the IPv4 address of the Service named "clusterip"
wget -qO - 10.0.170.92
```
-->
```shell
# 使用名称为 "clusterip" 的 Service 的 IPv4 地址替换 "10.0.170.92" 
wget -qO - 10.0.170.92
```
```
CLIENT VALUES:
client_address=10.244.3.8
command=GET
...
```
<!--
The `client_address` is always the client pod's IP address, whether the client pod and server pod are in the same node or in different nodes.
-->
无论客户端 Pod 和 服务端 Pod 是否在相同的节点上，`client_address` 始终是客户端 Pod 的 IP 地址。

<!-- ## Source IP for Services with `Type=NodePort` -->
## Type=NodePort 类型 Services 的 Source IP

<!--
Packets sent to Services with
[`Type=NodePort`](/docs/concepts/services-networking/service/#nodeport)
are source NAT'd by default. You can test this by creating a `NodePort` Service:
-->
发送给类型为
[`Type=NodePort`](/zh//docs/concepts/services-networking/service/#nodeport) Services 的
数据包默认的源地址会默认被进行 NAT 转换。
你可以通过创建一个 `NodePort` Service 来进行测试：
```shell
kubectl expose deployment source-ip-app --name=nodeport --port=80 --target-port=8080 --type=NodePort
```
<!-- The output is: -->
输出结果为：
```
service/nodeport exposed
```

```shell
NODEPORT=$(kubectl get -o jsonpath="{.spec.ports[0].nodePort}" services nodeport)
NODES=$(kubectl get nodes -o jsonpath='{ $.items[*].status.addresses[?(@.type=="InternalIP")].address }')
```

<!--
If you're running on a cloud provider, you may need to open up a firewall-rule
for the `nodes:nodeport` reported above.
Now you can try reaching the Service from outside the cluster through the node
port allocated above.
-->
如果你的集群运行在一个云服务上，你可能需要为上面报告的 `nodes:nodeport` 开启一条防火墙规则。
现在，你可以通过上面分配的节点端口从外部访问这个 Service。

```shell
for node in $NODES; do curl -s $node:$NODEPORT | grep -i client_address; done
```
<!-- The output is similar to: -->
输出结果与以下结果类似：
```
client_address=10.180.1.1
client_address=10.240.0.5
client_address=10.240.0.3
```

<!--
Note that these are not the correct client IPs, they're cluster internal IPs. This is what happens:
-->
请注意，这些并不是正确的客户端 IP，它们是集群的内部 IP。这是所发生的事情：

<!--
* Client sends packet to `node2:nodePort`
* `node2` replaces the source IP address (SNAT) in the packet with its own IP address
* `node2` replaces the destination IP on the packet with the pod IP
* packet is routed to node 1, and then to the endpoint
* the pod's reply is routed back to node2
* the pod's reply is sent back to the client
-->
* 客户端发送数据包到 `node2:nodePort`
* `node2` 使用它自己的 IP 地址替换数据包的源 IP 地址（SNAT）
* `node2` 使用 Pod IP 地址替换数据包的目的 IP 地址
* 数据包被路由到节点（node） 1，然后交给端点（endpoint）
* Pod 的回复被路由回节点（node）2
* Pod 的回复被发送回给客户端

<!-- Visually: -->
用图表示：

{{< mermaid >}}
graph LR;
  client(客户端)-->node2[节点 2];
  node2-->client;
  node2-. SNAT .->node1[节点 1];
  node1-. SNAT .->node2;
  node1-->endpoint(端点);

  classDef plain fill:#ddd,stroke:#fff,stroke-width:4px,color:#000;
  classDef k8s fill:#326ce5,stroke:#fff,stroke-width:4px,color:#fff;
  class node1,node2,endpoint k8s;
  class client plain;
{{</ mermaid >}}

<!--
To avoid this, Kubernetes has a feature to
[preserve the client source IP](/docs/tasks/access-application-cluster/create-external-load-balancer/#preserving-the-client-source-ip).
If you set `service.spec.externalTrafficPolicy` to the value `Local`,
kube-proxy only proxies proxy requests to local endpoints, and does not
forward traffic to other nodes. This approach preserves the original
source IP address. If there are no local endpoints, packets sent to the
node are dropped, so you can rely on the correct source-ip in any packet
processing rules you might apply a packet that make it through to the
endpoint.
-->
为了防止这种情况发生，Kubernetes 提供了一个特性来
[保留客户端的源 IP 地址](/zh/docs/tasks/access-application-cluster/create-external-load-balancer/#preserving-the-client-source-ip)。
设置 `service.spec.externalTrafficPolicy` 的值为 `Local`，请求就只会被
代理到本地 endpoints 而不会被  kube-proxy 转发到其它节点。这样就保留了最初的源 IP 地址。
如果没有本地 endpoints，发送到这个节点的数据包将会被丢弃。这样在应用到数据包的任何包处理规则下，
你都能依赖这个正确的源 IP 使数据包通过并到达端点。

<!-- Set the `service.spec.externalTrafficPolicy` field as follows: -->
设置 `service.spec.externalTrafficPolicy` 字段如下：
```shell
kubectl patch svc nodeport -p '{"spec":{"externalTrafficPolicy":"Local"}}'
```
<!-- The output is: -->
输出结果为：
```
service/nodeport patched
```

<!-- Now, re-run the test: -->
现在，重新运行测试：

```console
for node in $NODES; do curl --connect-timeout 1 -s $node:$NODEPORT | grep -i client_address; done
```
<!-- The output is similar to: -->

输出结果类似这样：
```
client_address=198.51.100.79
```

<!-- Note that you only got one reply, with the *right* client IP, from the one node on which the endpoint pod
is running. -->
请注意，你只得到了一个回复，来自端点 Pod 运行所在的那个节点，其中包含 *正确的* 客户端 IP。

<!-- This is what happens: -->
这是发生的事情：

<!--
* client sends packet to `node2:nodePort`, which doesn't have any endpoints
* packet is dropped
* client sends packet to `node1:nodePort`, which *does* have endpoints
* node1 routes packet to endpoint with the correct source IP
-->
* 客户端发送数据包到 `node2:nodePort`，它没有任何端点（endpoints）
* 数据包被丢弃
* 客户端发送数据包到 `node1:nodePort`，它*有*端点（endpoints）
* 节点（node）1 使用正确的源 IP 地址将数据包路由到端点（endpoint）

<!-- Visually: -->
用图表示：

{{< mermaid >}}
graph TD;
  client --> node1[节点 1];
  client(客户端) --x node2[节点 2];
  node1 --> endpoint(端点);
  endpoint --> node1;

  classDef plain fill:#ddd,stroke:#fff,stroke-width:4px,color:#000;
  classDef k8s fill:#326ce5,stroke:#fff,stroke-width:4px,color:#fff;
  class node1,node2,endpoint k8s;
  class client plain;
{{</ mermaid >}}



<!-- ## Source IP for Services with `Type=LoadBalancer` -->
## Type=LoadBalancer 类型 Services 的 Source IP

<!--
Packets sent to Services with
[`Type=LoadBalancer`](/docs/concepts/services-networking/service/#loadbalancer)
are source NAT'd by default, because all schedulable Kubernetes nodes in the
`Ready` state are eligible for load-balanced traffic. So if packets arrive
at a node without an endpoint, the system proxies it to a node *with* an
endpoint, replacing the source IP on the packet with the IP of the node (as
described in the previous section).
-->

从Kubernetes1.5开始，发送给类型为 [`Type=LoadBalancer`](/zh/docs/concepts/services-networking/service/#loadbalancert) Services 的数据包默认进行源地址 NAT'd，这是因为所有处于 `Ready` 状态的可调度 Kubernetes 节点对于负载均衡的流量都是符合条件的。所以如果数据包到达一个没有端点的节点，系统将把这个包代理到*有* 端点的节点，并替换数据包的源 IP 为节点的 IP（如前面章节所述）。

<!--
You can test this by exposing the source-ip-app through a load balancer:
-->
你可以通过在一个负载均衡器上暴露这个 source-ip-app 来进行测试。

```shell
kubectl expose deployment source-ip-app --name=loadbalancer --port=80 --target-port=8080 --type=LoadBalancer
```
<!-- The output is: -->
输出结果为：
```
service/loadbalancer exposed
```

<!-- The output is: -->
打印 Service 的 IP 地址：
```console
kubectl get svc loadbalancer
```
<!-- The output is similar to this: -->
输出结果与以下结果类似：
```
NAME           TYPE           CLUSTER-IP    EXTERNAL-IP       PORT(S)   AGE
loadbalancer   LoadBalancer   10.0.65.118   203.0.113.140     80/TCP    5m
```

<!-- Next, send a request to this Service's external-ip: -->
接下来，向这个 Service 的外部 IP 发送请求：
```shell
curl 104.198.149.140
```
<!-- The output is similar to this: -->
输出结果与以下结果类似：
```
CLIENT VALUES:
client_address=10.240.0.5
...
```

<!--
However, if you're running on Google Kubernetes Engine/GCE, setting the same `service.spec.externalTrafficPolicy`
field to `Local` forces nodes *without* Service endpoints to remove
themselves from the list of nodes eligible for loadbalanced traffic by
deliberately failing health checks.
-->
然而，如果你的集群运行在 Google Kubernetes Engine/GCE 上，
可以通过设置 `service.spec.externalTrafficPolicy` 字段值为 `Local` ，
故意导致健康检查失败来强制使没有 endpoints 的节点把自己从负载均衡流量的
可选节点列表中删除。

<!-- Visually: -->
用图表示：

![Source IP with externalTrafficPolicy](/images/docs/sourceip-externaltrafficpolicy.svg)

<!-- You can test this by setting the annotation: -->
你可以设置注解来进行测试：

```shell
kubectl patch svc loadbalancer -p '{"spec":{"externalTrafficPolicy":"Local"}}'
```

<!--
You should immediately see the `service.spec.healthCheckNodePort` field allocated
by Kubernetes:
-->
你应该能够立即看到 Kubernetes 分配的 `service.spec.healthCheckNodePort` 字段：

```shell
kubectl get svc loadbalancer -o yaml | grep -i healthCheckNodePort
```
<!-- The output is similar to this: -->
输出结果与以下结果类似：
```yaml
  healthCheckNodePort: 32122
```

<!--
The `service.spec.healthCheckNodePort` field points to a port on every node
serving the health check at `/healthz`. You can test this:
-->
`service.spec.healthCheckNodePort` 字段指向每个节点在 `/healthz` 路径上提供的用于健康检查的端口。你可以这样测试：

```shell
kubectl get pod -o wide -l run=source-ip-app
```
<!-- The output is similar to this: -->
输出结果与以下结果类似：
```
NAME                            READY     STATUS    RESTARTS   AGE       IP             NODE
source-ip-app-826191075-qehz4   1/1       Running   0          20h       10.180.1.136   kubernetes-node-6jst
```
<!-- Use `curl` to fetch the `/healthz` endpoint on various nodes: -->
使用 curl 命令发送请求到每个节点的 `/healthz` 路径：
<!--
```shell
# Run this locally on a node you choose
curl localhost:32122/healthz
```
-->
```shell
# 从你选择的节点本地运行
curl localhost:32122/healthz
```
```
1 Service Endpoints found
```

<!-- On a different node you might get a different result: -->
在不同的节点上，你可能会得到不同的结果：
<!--
```shell
# Run this locally on a node you choose
curl localhost:32122/healthz
```
```
No Service Endpoints Found
```
-->
```shell
# 从你选择的节点本地运行
curl localhost:32122/healthz
```
```
No Service Endpoints Found
```

<!--
A controller running on the
{{< glossary_tooltip text="control plane" term_id="control-plane" >}} is
responsible for allocating the cloud load balancer. The same controller also
allocates HTTP health checks pointing to this port/path on each node. Wait
about 10 seconds for the 2 nodes without endpoints to fail health checks,
then use `curl` to query the IPv4 address of the load balancer:
-->
在 {{< glossary_tooltip text="control plane" term_id="control-plane" >}} 上运行的控制器负责分配云负载平衡器。 同一控制器还分配指向每个节点上此端口/路径的 HTTP 运行状况检查。 等待两个没有端点的节点通过健康检查大约 10 秒钟，然后使用 `curl` 查询负载均衡器的 IPv4 地址：

<!--
```shell
curl 203.0.113.140
```
The output is similar to this:
```
CLIENT VALUES:
client_address=198.51.100.79
...
```
-->
```shell
curl 203.0.113.140
```
输出类似这样：
```
CLIENT VALUES:
client_address=198.51.100.79
...
```

<!-- ## Cross-platform support -->
## 跨平台支持

<!--
Only some cloud providers offer support for source IP preservation through
Services with `Type=LoadBalancer`.
The cloud provider you're running on might fulfill the request for a loadbalancer
in a few different ways:
-->
仅部分云提供商支持通过类型为 `Type=LoadBalancer` 的 Services 进行源 IP 预留。你的集群所在的云提供商可能以某些不同的方式满足对负载均衡器的需求：

<!--
1. With a proxy that terminates the client connection and opens a new connection
to your nodes/endpoints. In such cases the source IP will always be that of the
cloud LB, not that of the client.
-->
1. 使用代理终止客户端连接并打开一个到你的节点/端点的新连接。在这种情况下，源 IP 地址将永远是云负载均衡器的地址而不是客户端的。

<!--
2. With a packet forwarder, such that requests from the client sent to the
loadbalancer VIP end up at the node with the source IP of the client, not
an intermediate proxy.
-->
2. 使用数据包转发器，这样，从客户端发送到负载平衡器VIP的请求最终将在具有客户端源 IP 而不是中间代理的节点处结束。

<!--
Load balancers in the first category must use an agreed upon
protocol between the loadbalancer and backend to communicate the true client IP
such as the HTTP [Forwarded](https://tools.ietf.org/html/rfc7239#section-5.2)
or [X-FORWARDED-FOR](https://en.wikipedia.org/wiki/X-Forwarded-For)
headers, or the
[proxy protocol](https://www.haproxy.org/download/1.5/doc/proxy-protocol.txt).
Load balancers in the second category can leverage the feature described above
by creating an HTTP health check pointing at the port stored in
the `service.spec.healthCheckNodePort` field on the Service.
-->
第一类负载均衡器必须使用一种它和后端之间约定的协议来和真实的客户端 IP 通信，
例如 [Forwarded](https://tools.ietf.org/html/rfc7239#section-5.2) ，或者 [X-FORWARDED-FOR](https://en.wikipedia.org/wiki/X-Forwarded-For)头。
第二类负载均衡器可以通过简单的在保存于 Service 的 `service.spec.healthCheckNodePort` 
字段上创建一个 HTTP 健康检查点来使用上面描述的特性。

## {{% heading "cleanup" %}}

<!-- Delete the Services: -->
删除服务：

```shell
kubectl delete svc -l run=source-ip-app
```
<!-- Delete the Deployment, ReplicaSet and Pod: -->
删除 Deployment、ReplicaSet 和 Pod：

```shell
kubectl delete deployment source-ip-app
```

## {{% heading "whatsnext" %}}

* 学习更多关于 [通过 services 连接应用](/zh/docs/concepts/services-networking/connect-applications-service/)
* 学习更多关于 [创建外部负载均衡器](/zh/docs/tasks/access-application-cluster/create-external-load-balancer/)