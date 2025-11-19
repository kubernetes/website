---
title: 使用源 IP
content_type: tutorial
min-kubernetes-server-version: v1.5
weight: 40
---
<!--  
title: Using Source IP
content_type: tutorial
min-kubernetes-server-version: v1.5
weight: 40
-->

<!-- overview -->

<!-- 
Applications running in a Kubernetes cluster find and communicate with each
other, and the outside world, through the Service abstraction. This document
explains what happens to the source IP of packets sent to different types
of Services, and how you can toggle this behavior according to your needs.
-->
運行在 Kubernetes 集羣中的應用程序通過 Service 抽象發現彼此並相互通信，它們也用 Service 與外部世界通信。
本文解釋了發送到不同類型 Service 的數據包的源 IP 會發生什麼情況，以及如何根據需要切換此行爲。

## {{% heading "prerequisites" %}}

<!-- 
### Terminology

This document makes use of the following terms:
-->
## 術語表  {#terminology}

本文使用了下列術語：

{{< comment >}}
<!--
If localizing this section, link to the equivalent Wikipedia pages for
the target localization.
-->
如果本地化此部分，請鏈接到目標本地化的等效 Wikipedia 頁面。
{{< /comment >}}

<!--
[NAT](https://en.wikipedia.org/wiki/Network_address_translation)
: Network address translation

[Source NAT](https://en.wikipedia.org/wiki/Network_address_translation#SNAT)
: Replacing the source IP on a packet; in this page, that usually means replacing with the IP address of a node.

[Destination NAT](https://en.wikipedia.org/wiki/Network_address_translation#DNAT)
: Replacing the destination IP on a packet; in this page, that usually means replacing with the IP address of a {{< glossary_tooltip term_id="pod" >}}

[VIP](/docs/concepts/services-networking/service/#virtual-ips-and-service-proxies)
: A virtual IP address, such as the one assigned to every {{< glossary_tooltip text="Service" term_id="service" >}} in Kubernetes

[kube-proxy](/docs/concepts/services-networking/service/#virtual-ips-and-service-proxies)
: A network daemon that orchestrates Service VIP management on every node
-->
[NAT](https://zh.wikipedia.org/wiki/%E7%BD%91%E7%BB%9C%E5%9C%B0%E5%9D%80%E8%BD%AC%E6%8D%A2)
: 網絡地址轉換

[Source NAT](https://en.wikipedia.org/wiki/Network_address_translation#SNAT)
: 替換數據包上的源 IP；在本頁面中，這通常意味着替換爲節點的 IP 地址

[Destination NAT](https://en.wikipedia.org/wiki/Network_address_translation#DNAT)
: 替換數據包上的目標 IP；在本頁面中，這通常意味着替換爲 {{<glossary_tooltip text="Pod" term_id="pod" >}} 的 IP 地址

[VIP](/zh-cn/docs/concepts/services-networking/service/#virtual-ips-and-service-proxies)
: 一個虛擬 IP 地址，例如分配給 Kubernetes 中每個 {{<glossary_tooltip text="Service" term_id="service" >}} 的 IP 地址

[Kube-proxy](/zh-cn/docs/concepts/services-networking/service/#virtual-ips-and-service-proxies)
: 一個網絡守護程序，在每個節點上協調 Service VIP 管理

<!-- 
### Prerequisites
-->
## 先決條件  {#prerequisites}

{{< include "task-tutorial-prereqs.md" >}}

<!-- 
The examples use a small nginx webserver that echoes back the source
IP of requests it receives through an HTTP header. You can create it as follows:
-->
示例使用一個小型 nginx Web 服務器，服務器通過 HTTP 標頭返回它接收到的請求的源 IP。
你可以按如下方式創建它：

```shell
kubectl create deployment source-ip-app --image=registry.k8s.io/echoserver:1.10
```

<!-- 
The output is:
-->
輸出爲：

```
deployment.apps/source-ip-app created
```

## {{% heading "objectives" %}}

<!--
* Expose a simple application through various types of Services
* Understand how each Service type handles source IP NAT
* Understand the tradeoffs involved in preserving source IP
-->
* 通過多種類型的 Service 暴露一個簡單應用
* 瞭解每種 Service 類型如何處理源 IP NAT
* 瞭解保留源 IP 所涉及的權衡

<!-- lessoncontent -->

<!-- 
## Source IP for Services with `Type=ClusterIP`
-->
## `Type=ClusterIP` 類型 Service 的源 IP  {#source-ip-for-services-with-type-clusterip}

<!-- 
Packets sent to ClusterIP from within the cluster are never source NAT'd if
you're running kube-proxy in
[iptables mode](/docs/reference/networking/virtual-ips/#proxy-mode-iptables),
(the default). You can query the kube-proxy mode by fetching
`http://localhost:10249/proxyMode` on the node where kube-proxy is running.
-->
如果你在 [iptables 模式](/zh-cn/docs/reference/networking/virtual-ips/#proxy-mode-iptables)（默認）下運行
kube-proxy，則從集羣內發送到 ClusterIP 的數據包永遠不會進行源 NAT。
你可以通過在運行 kube-proxy 的節點上獲取 `http://localhost:10249/proxyMode` 來查詢 kube-proxy 模式。

```console
kubectl get nodes
```

<!--
The output is similar to this:
-->
輸出類似於：

```
NAME                           STATUS     ROLES    AGE     VERSION
kubernetes-node-6jst   Ready      <none>   2h      v1.13.0
kubernetes-node-cx31   Ready      <none>   2h      v1.13.0
kubernetes-node-jj1t   Ready      <none>   2h      v1.13.0
```

<!-- 
Get the proxy mode on one of the nodes (kube-proxy listens on port 10249):
-->
在其中一個節點上獲取代理模式（kube-proxy 監聽 10249 端口）：

<!--
# Run this in a shell on the node you want to query.
-->
```shell
# 在要查詢的節點上的 Shell 中運行
curl http://localhost:10249/proxyMode
```

<!-- 
The output is: 
-->
輸出爲：

```
iptables
```

<!--
You can test source IP preservation by creating a Service over the source IP app: 
-->
你可以通過在源 IP 應用程序上創建 Service 來測試源 IP 保留：

```shell
kubectl expose deployment source-ip-app --name=clusterip --port=80 --target-port=8080
```
<!-- 
The output is: 
-->
輸出爲：

```
service/clusterip exposed
```

```shell
kubectl get svc clusterip
```
<!--
The output is similar to:
-->
輸出類似於：

```
NAME         TYPE        CLUSTER-IP    EXTERNAL-IP   PORT(S)   AGE
clusterip    ClusterIP   10.0.170.92   <none>        80/TCP    51s
```

<!-- 
And hitting the `ClusterIP` from a pod in the same cluster:
-->
並從同一集羣中的 Pod 中訪問 `ClusterIP`：

```shell
kubectl run busybox -it --image=busybox:1.28 --restart=Never --rm
```
<!--
The output is similar to this:
-->
輸出類似於：

```
Waiting for pod default/busybox to be running, status is Pending, pod ready: false
If you don't see a command prompt, try pressing enter.
```
<!-- 
You can then run a command inside that Pod:
-->
然後，你可以在該 Pod 中運行命令：

<!--
# Run this inside the terminal from "kubectl run"
-->
```shell
# 從 “kubectl run” 的終端中運行
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

<!--
…then use `wget` to query the local webserver
-->
然後使用 `wget` 查詢本地 Web 服務器：

<!--
# Replace "10.0.170.92" with the IPv4 address of the Service named "clusterip"
-->
```shell
# 將 “10.0.170.92” 替換爲 Service 中名爲 “clusterip” 的 IPv4 地址
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
不管客戶端 Pod 和服務器 Pod 位於同一節點還是不同節點，`client_address` 始終是客戶端 Pod 的 IP 地址。

<!-- 
## Source IP for Services with `Type=NodePort`

Packets sent to Services with
[`Type=NodePort`](/docs/concepts/services-networking/service/#type-nodeport)
are source NAT'd by default. You can test this by creating a `NodePort` Service:
-->
## `Type=NodePort` 類型 Service 的源 IP  {#source-ip-for-services-with-type-nodeport}

默認情況下，發送到 [`Type=NodePort`](/zh-cn/docs/concepts/services-networking/service/#type-nodeport)
的 Service 的數據包會經過源 NAT 處理。你可以通過創建一個 `NodePort` 的 Service 來測試這點：

```shell
kubectl expose deployment source-ip-app --name=nodeport --port=80 --target-port=8080 --type=NodePort
```
<!-- 
The output is: 
-->
輸出爲：

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
如果你在雲供應商上運行，你可能需要爲上面報告的 `nodes:nodeport` 打開防火牆規則。
現在你可以嘗試通過上面分配的節點端口從集羣外部訪問 Service。

```shell
for node in $NODES; do curl -s $node:$NODEPORT | grep -i client_address; done
```

<!-- 
The output is similar to:
-->
輸出類似於：

```
client_address=10.180.1.1
client_address=10.240.0.5
client_address=10.240.0.3
```

<!--
Note that these are not the correct client IPs, they're cluster internal IPs. This is what happens:

* Client sends packet to `node2:nodePort`
* `node2` replaces the source IP address (SNAT) in the packet with its own IP address
* `node2` replaces the destination IP on the packet with the pod IP
* packet is routed to node 1, and then to the endpoint
* the pod's reply is routed back to node2
* the pod's reply is sent back to the client

Visually:

{{< figure src="/docs/images/tutor-service-nodePort-fig01.svg" alt="source IP nodeport figure 01" class="diagram-large" caption="Figure. Source IP Type=NodePort using SNAT" link="https://mermaid.live/edit#pako:eNqNkV9rwyAUxb-K3LysYEqS_WFYKAzat9GHdW9zDxKvi9RoMIZtlH732ZjSbE970cu5v3s86hFqJxEYfHjRNeT5ZcUtIbXRaMNN2hZ5vrYRqt52cSXV-4iMSuwkZiYtyX739EqWaahMQ-V1qPxDVLNOvkYrO6fj2dupWMR2iiT6foOKdEZoS5Q2hmVSStoH7w7IMqXUVOefWoaG3XVftHbGeZYVRbH6ZXJ47CeL2-qhxvt_ucTe1SUlpuMN6CX12XeGpLdJiaMMFFr0rdAyvvfxjHEIDbbIgcVSohKDCRy4PUV06KQIuJU6OA9MCdMjBTEEt_-2NbDgB7xAGy3i97VJPP0ABRmcqg" >}}
-->
請注意，這些並不是正確的客戶端 IP，它們是集羣的內部 IP。這是所發生的事情：

* 客戶端發送數據包到 `node2:nodePort`
* `node2` 使用它自己的 IP 地址替換數據包的源 IP 地址（SNAT）
* `node2` 將數據包上的目標 IP 替換爲 Pod IP
* 數據包被路由到 node1，然後到端點
* Pod 的回覆被路由回 node2
* Pod 的回覆被髮送回給客戶端

用圖表示：

{{< figure src="/zh-cn/docs/images/tutor-service-nodePort-fig01.svg" alt="圖 1：源 IP NodePort" class="diagram-large" caption="如圖。使用 SNAT 的源 IP（Type=NodePort）" link="https://mermaid.live/edit#pako:eNqNkV9rwyAUxb-K3LysYEqS_WFYKAzat9GHdW9zDxKvi9RoMIZtlH732ZjSbE970cu5v3s86hFqJxEYfHjRNeT5ZcUtIbXRaMNN2hZ5vrYRqt52cSXV-4iMSuwkZiYtyX739EqWaahMQ-V1qPxDVLNOvkYrO6fj2dupWMR2iiT6foOKdEZoS5Q2hmVSStoH7w7IMqXUVOefWoaG3XVftHbGeZYVRbH6ZXJ47CeL2-qhxvt_ucTe1SUlpuMN6CX12XeGpLdJiaMMFFr0rdAyvvfxjHEIDbbIgcVSohKDCRy4PUV06KQIuJU6OA9MCdMjBTEEt_-2NbDgB7xAGy3i97VJPP0ABRmcqg" >}}

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
爲避免這種情況，Kubernetes 有一個特性可以[保留客戶端源 IP](/zh-cn/docs/tasks/access-application-cluster/create-external-load-balancer/#preserving-the-client-source-ip)。
如果將 `service.spec.externalTrafficPolicy` 設置爲 `Local`，
kube-proxy 只會將代理請求代理到本地端點，而不會將流量轉發到其他節點。
這種方法保留了原始源 IP 地址。如果沒有本地端點，則發送到該節點的數據包將被丟棄，
因此你可以在任何數據包處理規則中依賴正確的源 IP，你可能會應用一個數據包使其通過該端點。

<!--
Set the `service.spec.externalTrafficPolicy` field as follows:
-->
設置 `service.spec.externalTrafficPolicy` 字段如下：

```shell
kubectl patch svc nodeport -p '{"spec":{"externalTrafficPolicy":"Local"}}'
```

<!-- 
The output is:
-->
輸出爲：

```
service/nodeport patched
```

<!-- 
Now, re-run the test:
-->
現在，重新運行測試：

```shell
for node in $NODES; do curl --connect-timeout 1 -s $node:$NODEPORT | grep -i client_address; done
```

<!-- 
The output is similar to:
-->
輸出類似於：

```
client_address=198.51.100.79
```

<!-- 
Note that you only got one reply, with the *right* client IP, from the one node on which the endpoint pod
is running.

This is what happens:

* client sends packet to `node2:nodePort`, which doesn't have any endpoints
* packet is dropped
* client sends packet to `node1:nodePort`, which *does* have endpoints
* node1 routes packet to endpoint with the correct source IP

Visually:

{{< figure src="/docs/images/tutor-service-nodePort-fig02.svg" alt="source IP nodeport figure 02" class="diagram-large" caption="Figure. Source IP Type=NodePort preserves client source IP address" link="" >}}
-->
請注意，你只從運行端點 Pod 的節點得到了回覆，這個回覆有**正確的**客戶端 IP。

這是發生的事情：

* 客戶端將數據包發送到沒有任何端點的 `node2:nodePort`
* 數據包被丟棄
* 客戶端發送數據包到**必有**端點的 `node1:nodePort`
* node1 使用正確的源 IP 地址將數據包路由到端點

用圖表示：
{{< figure src="/zh-cn/docs/images/tutor-service-nodePort-fig02.svg" alt="圖 2：源 IP NodePort" class="diagram-large" caption="如圖。源 IP（Type=NodePort）保存客戶端源 IP 地址" link="" >}}

<!-- 
## Source IP for Services with `Type=LoadBalancer`

Packets sent to Services with
[`Type=LoadBalancer`](/docs/concepts/services-networking/service/#loadbalancer)
are source NAT'd by default, because all schedulable Kubernetes nodes in the
`Ready` state are eligible for load-balanced traffic. So if packets arrive
at a node without an endpoint, the system proxies it to a node *with* an
endpoint, replacing the source IP on the packet with the IP of the node (as
described in the previous section).
-->
## `Type=LoadBalancer` 類型 Service 的源 IP  {#source-ip-for-services-with-type-loadbalancer}

默認情況下，發送到 [`Type=LoadBalancer`](/zh-cn/docs/concepts/services-networking/service/#loadbalancer)
的 Service 的數據包經過源 NAT處理，因爲所有處於 `Ready` 狀態的可調度 Kubernetes
節點對於負載均衡的流量都是符合條件的。
因此，如果數據包到達一個沒有端點的節點，系統會將其代理到一個**帶有**端點的節點，用該節點的 IP 替換數據包上的源 IP（如上一節所述）。

<!-- 
You can test this by exposing the source-ip-app through a load balancer:
-->
你可以通過負載均衡器上暴露 source-ip-app 進行測試：

```shell
kubectl expose deployment source-ip-app --name=loadbalancer --port=80 --target-port=8080 --type=LoadBalancer
```

<!-- 
The output is:
-->
輸出爲：

```
service/loadbalancer exposed
```

<!-- 
Print out the IP addresses of the Service:
-->
打印 Service 的 IP 地址：

```console
kubectl get svc loadbalancer
```

<!--
The output is similar to this:
-->
輸出類似於：

```
NAME           TYPE           CLUSTER-IP    EXTERNAL-IP       PORT(S)   AGE
loadbalancer   LoadBalancer   10.0.65.118   203.0.113.140     80/TCP    5m
```

<!-- 
Next, send a request to this Service's external-ip:
-->
接下來，發送請求到 Service 的 的外部 IP（External-IP）：

```shell
curl 203.0.113.140
```

<!--
The output is similar to this:
-->
輸出類似於：

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

Visually:

![Source IP with externalTrafficPolicy](/images/docs/sourceip-externaltrafficpolicy.svg)
-->
然而，如果你在 Google Kubernetes Engine/GCE 上運行，
將相同的 `service.spec.externalTrafficPolicy` 字段設置爲 `Local`，
故意導致健康檢查失敗，從而強制沒有端點的節點把自己從負載均衡流量的可選節點列表中刪除。

用圖表示：

![具有 externalTrafficPolicy 的源 IP](/zh-cn/docs/images/sourceip-externaltrafficpolicy.svg)

<!-- 
You can test this by setting the annotation:
-->
你可以通過設置註解進行測試：

```shell
kubectl patch svc loadbalancer -p '{"spec":{"externalTrafficPolicy":"Local"}}'
```

<!--
You should immediately see the `service.spec.healthCheckNodePort` field allocated
by Kubernetes:
-->
你應該能夠立即看到 Kubernetes 分配的 `service.spec.healthCheckNodePort` 字段：

```shell
kubectl get svc loadbalancer -o yaml | grep -i healthCheckNodePort
```
<!-- 
The output is similar to this:
-->
輸出類似於：

```yaml
  healthCheckNodePort: 32122
```

<!-- 
The `service.spec.healthCheckNodePort` field points to a port on every node
serving the health check at `/healthz`. You can test this:
-->
`service.spec.healthCheckNodePort` 字段指向每個在 `/healthz`
路徑上提供健康檢查的節點的端口。你可以這樣測試：

```shell
kubectl get pod -o wide -l app=source-ip-app
```

<!-- 
The output is similar to this:
-->
輸出類似於：

```
NAME                            READY     STATUS    RESTARTS   AGE       IP             NODE
source-ip-app-826191075-qehz4   1/1       Running   0          20h       10.180.1.136   kubernetes-node-6jst
```

<!-- 
Use `curl` to fetch the `/healthz` endpoint on various nodes:
-->
使用 `curl` 獲取各個節點上的 `/healthz` 端點：

<!--
# Run this locally on a node you choose
-->
```shell
# 在你選擇的節點上本地運行
curl localhost:32122/healthz
```

```
1 Service Endpoints found
```

<!-- 
On a different node you might get a different result:
-->
在不同的節點上，你可能會得到不同的結果：

<!--
# Run this locally on a node you choose
-->
```shell
# 在你選擇的節點上本地運行
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
在{{<glossary_tooltip text="控制平面" term_id="control-plane" >}}上運行的控制器負責分配雲負載均衡器。
同一個控制器還在每個節點上分配指向此端口/路徑的 HTTP 健康檢查。
等待大約 10 秒，讓 2 個沒有端點的節點健康檢查失敗，然後使用 `curl` 查詢負載均衡器的 IPv4 地址：

```shell
curl 203.0.113.140
```

<!-- 
The output is similar to this:
-->
輸出類似於：

```
CLIENT VALUES:
client_address=198.51.100.79
...
```

<!-- 
## Cross-platform support

Only some cloud providers offer support for source IP preservation through
Services with `Type=LoadBalancer`.
The cloud provider you're running on might fulfill the request for a loadbalancer
in a few different ways:
-->
## 跨平臺支持  {#cross-platform-support}

只有部分雲提供商爲 `Type=LoadBalancer` 的 Service 提供保存源 IP 的支持。
你正在運行的雲提供商可能會以幾種不同的方式滿足對負載均衡器的請求：

<!-- 
1. With a proxy that terminates the client connection and opens a new connection
to your nodes/endpoints. In such cases the source IP will always be that of the
cloud LB, not that of the client.

2. With a packet forwarder, such that requests from the client sent to the
loadbalancer VIP end up at the node with the source IP of the client, not
an intermediate proxy.
-->
1. 使用終止客戶端連接並打開到你的節點/端點的新連接的代理。
   在這種情況下，源 IP 將始終是雲 LB 的源 IP，而不是客戶端的源 IP。

2. 使用數據包轉發器，這樣客戶端發送到負載均衡器 VIP
   的請求最終會到達具有客戶端源 IP 的節點，而不是中間代理。

<!-- 
Load balancers in the first category must use an agreed upon
protocol between the loadbalancer and backend to communicate the true client IP
such as the HTTP [Forwarded](https://tools.ietf.org/html/rfc7239#section-5.2)
or [X-FORWARDED-FOR](https://en.wikipedia.org/wiki/X-Forwarded-For)
headers, or the
[proxy protocol](https://www.haproxy.org/download/1.8/doc/proxy-protocol.txt).
Load balancers in the second category can leverage the feature described above
by creating an HTTP health check pointing at the port stored in
the `service.spec.healthCheckNodePort` field on the Service.
-->
第一類負載均衡器必須使用負載均衡器和後端之間商定的協議來傳達真實的客戶端 IP，
例如 HTTP [轉發](https://tools.ietf.org/html/rfc7239#section-5.2)或
[X-FORWARDED-FOR](https://zh.wikipedia.org/wiki/X-Forwarded-For)
標頭，或[代理協議](https://www.haproxy.org/download/1.8/doc/proxy-protocol.txt)。
第二類負載均衡器可以通過創建指向存儲在 Service 上的 `service.spec.healthCheckNodePort`
字段中的端口的 HTTP 健康檢查來利用上述功能。

## {{% heading "cleanup" %}}

<!-- 
Delete the Services:
-->
刪除 Service：

```shell
kubectl delete svc -l app=source-ip-app
```

<!--
Delete the Deployment, ReplicaSet and Pod: 
-->
刪除 Deployment、ReplicaSet 和 Pod：

```shell
kubectl delete deployment source-ip-app
```

## {{% heading "whatsnext" %}}

<!-- 
* Learn more about [connecting applications via services](/docs/tutorials/services/connect-applications-service/)
* Read how to [Create an External Load Balancer](/docs/tasks/access-application-cluster/create-external-load-balancer/)
-->
* 詳細瞭解[通過 Service 連接應用程序](/zh-cn/docs/tutorials/services/connect-applications-service/)
* 閱讀如何[創建外部負載均衡器](/zh-cn/docs/tasks/access-application-cluster/create-external-load-balancer/)
