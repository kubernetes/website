---

title: 使用 Source IP
content_type: tutorial
---

<!-- overview -->


Kubernetes 集群中运行的应用通过 Service 抽象来互相查找、通信和与外部世界沟通。本文介绍被发送到不同类型 Services 的数据包源 IP 的变化过程，你可以根据你的需求改变这些行为。



## {{% heading "prerequisites" %}}


{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}


## 术语表


本文使用了下列术语：

* [NAT](https://en.wikipedia.org/wiki/Network_address_translation): 网络地址转换
* [Source NAT](https://en.wikipedia.org/wiki/Network_address_translation#SNAT): 替换数据包的源 IP, 通常为节点的 IP
* [Destination NAT](https://en.wikipedia.org/wiki/Network_address_translation#DNAT): 替换数据包的目的 IP, 通常为 Pod 的 IP
* [VIP](/zh/docs/concepts/services-networking/service/#virtual-ips-and-service-proxies): 一个虚拟 IP, 例如分配给每个 Kubernetes Service 的 IP
* [Kube-proxy](/zh/docs/concepts/services-networking/service/#virtual-ips-and-service-proxies): 一个网络守护程序，在每个节点上协调 Service VIP 管理


## 准备工作


你必须拥有一个正常工作的 Kubernetes 1.5 集群来运行此文档中的示例。该示例使用一个简单的 nginx webserver，通过一个HTTP消息头返回它接收到请求的源IP。你可以像下面这样创建它：

```console
kubectl run source-ip-app --image=k8s.gcr.io/echoserver:1.4
```
输出结果为
```
deployment.apps/source-ip-app created
```



## {{% heading "objectives" %}}



* 通过多种类型的 Services 暴露一个简单应用
* 理解每种 Service 类型如何处理源 IP NAT
* 理解保留源IP所涉及的折中




<!-- lessoncontent -->


## Type=ClusterIP 类型 Services 的 Source IP


如果你的 kube-proxy 运行在 [iptables 模式](/zh/docs/user-guide/services/#proxy-mode-iptables)下，从集群内部发送到 ClusterIP 的包永远不会进行源地址 NAT，这从 Kubernetes 1.2 开始是默认选项。Kube-proxy 通过一个 `proxyMode` endpoint 暴露它的模式。

```console
kubectl get nodes
```
输出结果与以下结果类似:
```
NAME                           STATUS     ROLES    AGE     VERSION
kubernetes-node-6jst   Ready      <none>   2h      v1.13.0
kubernetes-node-cx31   Ready      <none>   2h      v1.13.0
kubernetes-node-jj1t   Ready      <none>   2h      v1.13.0
```
从其中一个节点中得到代理模式
```console
kubernetes-node-6jst $ curl localhost:10249/proxyMode
```
输出结果为：
```
iptables
```

你可以通过在source IP应用上创建一个Service来测试源IP保留。

```console
kubectl expose deployment source-ip-app --name=clusterip --port=80 --target-port=8080
```
输出结果为：
```
service/clusterip exposed
```
```console
kubectl get svc clusterip
```
输出结果与以下结果类似：
```
NAME         TYPE        CLUSTER-IP    EXTERNAL-IP   PORT(S)   AGE
clusterip    ClusterIP   10.0.170.92   <none>        80/TCP    51s
```


从相同集群中的一个 pod 访问这个 `ClusterIP`：

```shell
kubectl run busybox -it --image=busybox --restart=Never --rm
```
输出结果与以下结果类似：
```
Waiting for pod default/busybox to be running, status is Pending, pod ready: false
If you don't see a command prompt, try pressing enter.
```

然后你可以在 Pod 内运行命令：

```shell
# 在终端内使用"kubectl run"执行

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

然后使用 `wget` 去请求本地 Web 服务器
```shell
# 用名为 "clusterip" 的服务的 IPv4 地址替换 "10.0.170.92"

wget -qO - 10.0.170.92
```
```
CLIENT VALUES:
client_address=10.244.3.8
command=GET
...
```

无论客户端 pod 和 服务端 pod 是否在相同的节点上，client_address 始终是客户端 pod 的 IP 地址。


## Type=NodePort 类型 Services 的 Source IP


从 Kubernetes 1.5 开始，发送给类型为 [Type=NodePort](/zh/docs/user-guide/services/#type-nodeport) Services 的数据包默认进行源地址 NAT。你可以通过创建一个 `NodePort` Service 来进行测试：

```console
kubectl expose deployment source-ip-app --name=nodeport --port=80 --target-port=8080 --type=NodePort
```
输出结果为：
```
service/nodeport exposed
```

```console
NODEPORT=$(kubectl get -o jsonpath="{.spec.ports[0].nodePort}" services nodeport)
NODES=$(kubectl get nodes -o jsonpath='{ $.items[*].status.addresses[?(@.type=="InternalIP")].address }')
```

如果你的集群运行在一个云服务上，你可能需要为上面报告的 `nodes:nodeport` 开启一条防火墙规则。
现在，你可以通过上面分配的节点端口从外部访问这个 Service。

```console
for node in $NODES; do curl -s $node:$NODEPORT | grep -i client_address; done
```
输出结果与以下结果类似：
```
client_address=10.180.1.1
client_address=10.240.0.5
client_address=10.240.0.3
```

请注意，这些并不是正确的客户端 IP，它们是集群的内部 IP。这是所发生的事情：

* 客户端发送数据包到 `node2:nodePort`
* `node2` 使用它自己的 IP 地址替换数据包的源 IP 地址（SNAT）
* `node2` 使用 pod IP 地址替换数据包的目的 IP 地址
* 数据包被路由到 node 1，然后交给 endpoint
* Pod 的回复被路由回 node2
* Pod 的回复被发送回给客户端


用图表示：

{{< mermaid >}}
graph LR;
  client(client)-->node2[节点 2];
  node2-->client;
  node2-. SNAT .->node1[节点 1];
  node1-. SNAT .->node2;
  node1-->endpoint(端点);

  classDef plain fill:#ddd,stroke:#fff,stroke-width:4px,color:#000;
  classDef k8s fill:#326ce5,stroke:#fff,stroke-width:4px,color:#fff;
  class node1,node2,endpoint k8s;
  class client plain;
{{</ mermaid >}}


为了防止这种情况发生，Kubernetes 提供了一个特性来保留客户端的源 IP 地址[(点击此处查看可用特性)](/zh/docs/tasks/access-application-cluster/create-external-load-balancer/#preserving-the-client-source-ip)。设置 `service.spec.externalTrafficPolicy` 的值为 `Local`，请求就只会被代理到本地 endpoints 而不会被转发到其它节点。这样就保留了最初的源 IP 地址。如果没有本地 endpoints，发送到这个节点的数据包将会被丢弃。这样在应用到数据包的任何包处理规则下，你都能依赖这个正确的 source-ip 使数据包通过并到达 endpoint。


设置 `service.spec.externalTrafficPolicy` 字段如下：

```console
kubectl patch svc nodeport -p '{"spec":{"externalTrafficPolicy":"Local"}}'
```
输出结果为：
```
service/nodeport patched
```


现在，重新运行测试：

```console
for node in $NODES; do curl --connect-timeout 1 -s $node:$NODEPORT | grep -i client_address; done
```
输出结果为：
```
client_address=104.132.1.79
```


请注意，你只从 endpoint pod 运行的那个节点得到了一个回复，这个回复有*正确的*客户端 IP。


这是发生的事情：

* 客户端发送数据包到 `node2:nodePort`，它没有任何 endpoints
* 数据包被丢弃
* 客户端发送数据包到 `node1:nodePort`，它*有*endpoints
* node1 使用正确的源 IP 地址将数据包路由到 endpoint


用图表示：

{{< mermaid >}}
graph TD;
  client --> node1[节点 1];
  client(client) --x node2[节点 2];
  node1 --> endpoint(端点);
  endpoint --> node1;

  classDef plain fill:#ddd,stroke:#fff,stroke-width:4px,color:#000;
  classDef k8s fill:#326ce5,stroke:#fff,stroke-width:4px,color:#fff;
  class node1,node2,endpoint k8s;
  class client plain;
{{</ mermaid >}}



## Type=LoadBalancer 类型 Services 的 Source IP


从Kubernetes1.5开始，发送给类型为 [Type=LoadBalancer](/zh/docs/user-guide/services/#type-nodeport) Services 的数据包默认进行源地址 NAT，这是因为所有处于 `Ready` 状态的可调度 Kubernetes 节点对于负载均衡的流量都是符合条件的。所以如果数据包到达一个没有 endpoint 的节点，系统将把这个包代理到*有* endpoint 的节点，并替换数据包的源 IP 为节点的 IP（如前面章节所述）。


你可以通过在一个 loadbalancer 上暴露这个 source-ip-app 来进行测试。

```console
kubectl expose deployment source-ip-app --name=loadbalancer --port=80 --target-port=8080 --type=LoadBalancer
```
输出结果为：
```
service/loadbalancer exposed
```

打印Service的IPs：
```console
kubectl get svc loadbalancer
```
输出结果与以下结果类似：
```
NAME           TYPE           CLUSTER-IP    EXTERNAL-IP       PORT(S)   AGE
loadbalancer   LoadBalancer   10.0.65.118   104.198.149.140   80/TCP    5m
```

```console
curl 104.198.149.140
```
输出结果与以下结果类似：
```
CLIENT VALUES:
client_address=10.240.0.5
...
```


然而，如果你的集群运行在 Google Kubernetes Engine/GCE 上，可以通过设置 service.spec.externalTrafficPolicy 字段值为 Local ，故意导致健康检查失败来强制使没有 endpoints 的节点把自己从负载均衡流量的可选节点列表中删除。


用图表示：

![Source IP with externalTrafficPolicy](/images/docs/sourceip-externaltrafficpolicy.svg)


你可以设置 annotation 来进行测试：

```console
kubectl patch svc loadbalancer -p '{"spec":{"externalTrafficPolicy":"Local"}}'
```


你应该能够立即看到 Kubernetes 分配的 `service.spec.healthCheckNodePort` 字段：

```console
kubectl get svc loadbalancer -o yaml | grep -i healthCheckNodePort
```
输出结果与以下结果类似：
```
  healthCheckNodePort: 32122
```


`service.spec.healthCheckNodePort` 字段指向每个节点在 `/healthz` 路径上提供的用于健康检查的端口。你可以这样测试：

```console
kubectl get pod -o wide -l run=source-ip-app
```
输出结果与以下结果类似：
```
NAME                            READY     STATUS    RESTARTS   AGE       IP             NODE
source-ip-app-826191075-qehz4   1/1       Running   0          20h       10.180.1.136   kubernetes-node-6jst
```
使用 curl 命令发送请求到每个节点的 `/healthz` 路径。
```console
kubernetes-node-6jst $ curl localhost:32122/healthz
```
输出结果与以下结果类似：
```
1 Service Endpoints found
```
```console
kubernetes-node-jj1t $ curl localhost:32122/healthz
```
输出结果与以下结果类似：
```
No Service Endpoints Found
```


主节点运行的 service 控制器负责分配 cloud loadbalancer。在这样做的同时，它也会分配指向每个节点的 HTTP 健康检查的 port/path。等待大约 10 秒钟之后，没有 endpoints 的两个节点的健康检查会失败，然后 curl 负载均衡器的 ip：

```console
curl 104.198.149.140
```
输出结果与以下结果类似：
```
CLIENT VALUES:
client_address=104.132.1.79
...
```


__跨平台支持__


从 Kubernetes 1.5 开始，通过类型为 Type=LoadBalancer 的 Services 进行源 IP 保存的支持仅在一部分 cloudproviders 中实现（GCP and Azure）。你的集群运行的 cloudprovider 可能以某些不同的方式满足 loadbalancer 的要求：


1. 使用一个代理终止客户端连接并打开一个到你的 nodes/endpoints 的新连接。在这种情况下，源 IP 地址将永远是云负载均衡器的地址而不是客户端的。

2. 使用一个包转发器，因此从客户端发送到负载均衡器 VIP 的请求在拥有客户端源 IP 地址的节点终止，而不被中间代理。


第一类负载均衡器必须使用一种它和后端之间约定的协议来和真实的客户端 IP 通信，例如 HTTP [X-FORWARDED-FOR](https://en.wikipedia.org/wiki/X-Forwarded-For) 头，或者 [proxy 协议](https://www.haproxy.org/download/1.8/doc/proxy-protocol.txt)。
第二类负载均衡器可以通过简单的在保存于 Service 的 `service.spec.healthCheckNodePort` 字段上创建一个 HTTP 健康检查点来使用上面描述的特性。



## {{% heading "cleanup" %}}



删除服务：

```console
$ kubectl delete svc -l run=source-ip-app
```


删除 Deployment、ReplicaSet 和 Pod：

```console
$ kubectl delete deployment source-ip-app
```



## {{% heading "whatsnext" %}}


* 进一步学习 [通过 services 连接应用](/zh/docs/concepts/services-networking/connect-applications-service/)
