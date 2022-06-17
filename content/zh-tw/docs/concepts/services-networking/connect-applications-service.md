---
title: 使用 Service 連線到應用
content_type: concept
weight: 30
---

<!-- overview -->

<!--
## The Kubernetes model for connecting containers

Now that you have a continuously running, replicated application you can expose it on a network.

Kubernetes assumes that pods can communicate with other pods, regardless of which host they land on. Kubernetes gives every pod its own cluster-private IP address, so you do not need to explicitly create links between pods or map container ports to host ports. This means that containers within a Pod can all reach each other's ports on localhost, and all pods in a cluster can see each other without NAT. The rest of this document elaborates on how you can run reliable services on such a networking model.

This guide uses a simple nginx server to demonstrate proof of concept.
-->

## Kubernetes 連線容器的模型

既然有了一個持續執行、可複製的應用，我們就能夠將它暴露到網路上。

Kubernetes 假設 Pod 可與其它 Pod 通訊，不管它們在哪個主機上。
Kubernetes 給每一個 Pod 分配一個叢集私有 IP 地址，所以沒必要在
Pod 與 Pod 之間建立連線或將容器的埠對映到主機埠。
這意味著同一個 Pod 內的所有容器能透過 localhost 上的埠互相連通，叢集中的所有 Pod
也不需要透過 NAT 轉換就能夠互相看到。
本文件的剩餘部分詳述如何在上述網路模型之上執行可靠的服務。

本指南使用一個簡單的 Nginx 伺服器來演示概念驗證原型。

<!-- body -->

<!--
## Exposing pods to the cluster

We did this in a previous example, but let's do it once again and focus on the networking perspective.
Create an nginx Pod, and note that it has a container port specification:
-->
## 在叢集中暴露 Pod

我們在之前的示例中已經做過，然而讓我們以網路連線的視角再重做一遍。
建立一個 Nginx Pod，注意其中包含一個容器埠的規約：

{{< codenew file="service/networking/run-my-nginx.yaml" >}}

<!--
This makes it accessible from any node in your cluster. Check the nodes the Pod is running on:
-->

這使得可以從叢集中任何一個節點來訪問它。檢查節點，該 Pod 正在執行：

```shell
kubectl apply -f ./run-my-nginx.yaml
kubectl get pods -l run=my-nginx -o wide
```
```
NAME                        READY     STATUS    RESTARTS   AGE       IP            NODE
my-nginx-3800858182-jr4a2   1/1       Running   0          13s       10.244.3.4    kubernetes-minion-905m
my-nginx-3800858182-kna2y   1/1       Running   0          13s       10.244.2.5    kubernetes-minion-ljyd
```

<!--
Check your pods' IPs:
-->
檢查 Pod 的 IP 地址：

```shell
kubectl get pods -l run=my-nginx -o yaml | grep podIP
    podIP: 10.244.3.4
    podIP: 10.244.2.5
```

<!--
You should be able to ssh into any node in your cluster and use a tool such as `curl` to make queries against both IPs. Note that the containers are *not* using port 80 on the node, nor are there any special NAT rules to route traffic to the pod. This means you can run multiple nginx pods on the same node all using the same `containerPort`, and access them from any other pod or node in your cluster using the assigned IP address for the Service. If you want to arrange for a specific port on the host Node to be forwarded to backing Pods, you can - but the networking model should mean that you do not need to do so.

You can read more about the [Kubernetes Networking Model](/docs/concepts/cluster-administration/networking/#the-kubernetes-network-model) if you're curious.
-->
你應該能夠透過 ssh 登入到叢集中的任何一個節點上，並使用諸如 `curl` 之類的工具向這兩個 IP 地址發出查詢請求。
需要注意的是，容器不會使用該節點上的 80 埠，也不會使用任何特定的 NAT 規則去路由流量到 Pod 上。
這意味著可以在同一個節點上執行多個 Nginx Pod，使用相同的 `containerPort`，並且可以從叢集中任何其他的
Pod 或節點上使用 IP 的方式訪問到它們。
如果你想的話，你依然可以將宿主節點的某個埠的流量轉發到 Pod 中，但是出於網路模型的原因，你不必這麼做。

如果對此好奇，請參考 [Kubernetes 網路模型](/zh-cn/docs/concepts/cluster-administration/networking/#the-kubernetes-network-model)。

<!--
## Creating a Service

So we have pods running nginx in a flat, cluster wide, address space. In theory, you could talk to these pods directly, but what happens when a node dies? The pods die with it, and the Deployment will create new ones, with different IPs. This is the problem a Service solves.

A Kubernetes Service is an abstraction which defines a logical set of Pods running somewhere in your cluster, that all provide the same functionality. When created, each Service is assigned a unique IP address (also called clusterIP). This address is tied to the lifespan of the Service, and will not change while the Service is alive. Pods can be configured to talk to the Service, and know that communication to the Service will be automatically load-balanced out to some pod that is a member of the Service.

You can create a Service for your 2 nginx replicas with `kubectl expose`:
-->
## 建立 Service

我們有一組在一個扁平的、叢集範圍的地址空間中執行 Nginx 服務的 Pod。
理論上，你可以直接連線到這些 Pod，但如果某個節點死掉了會發生什麼呢？
Pod 會終止，Deployment 將建立新的 Pod，且使用不同的 IP。這正是 Service 要解決的問題。

Kubernetes Service 是叢集中提供相同功能的一組 Pod 的抽象表達。
當每個 Service 建立時，會被分配一個唯一的 IP 地址（也稱為 clusterIP）。
這個 IP 地址與 Service 的生命週期繫結在一起，只要 Service 存在，它就不會改變。
可以配置 Pod 使它與 Service 進行通訊，Pod 知道與 Service 通訊將被自動地負載均衡到該 Service 中的某些 Pod 上。

可以使用 `kubectl expose` 命令為 2個 Nginx 副本建立一個 Service：

```shell
kubectl expose deployment/my-nginx
```
```
service/my-nginx exposed
```

<!--
This is equivalent to `kubectl apply -f` the following yaml:
-->

這等價於使用 `kubectl create -f` 命令及如下的 yaml 檔案建立：

{{< codenew file="service/networking/nginx-svc.yaml" >}}

<!--
This specification will create a Service which targets TCP port 80 on any Pod
with the `run: my-nginx` label, and expose it on an abstracted Service port
(`targetPort`: is the port the container accepts traffic on, `port`: is the
abstracted Service port, which can be any port other pods use to access the
Service).
View [Service](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#service-v1-core)
API object to see the list of supported fields in service definition.
Check your Service:
-->
上述規約將建立一個 Service，該 Service 會將所有具有標籤 `run: my-nginx` 的 Pod 的 TCP
80 埠暴露到一個抽象的 Service 埠上（`targetPort`：容器接收流量的埠；`port`：可任意取值的抽象的 Service
埠，其他 Pod 透過該埠訪問 Service）。
檢視 [Service](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#service-v1-core)
API 物件以瞭解 Service 所能接受的欄位列表。
檢視你的 Service 資源:

```shell
kubectl get svc my-nginx
```
```
NAME       TYPE        CLUSTER-IP     EXTERNAL-IP   PORT(S)   AGE
my-nginx   ClusterIP   10.0.162.149   <none>        80/TCP    21s
```

<!--
As mentioned previously, a Service is backed by a group of Pods. These Pods are
exposed through `endpoints`. The Service's selector will be evaluated continuously
and the results will be POSTed to an Endpoints object also named `my-nginx`.
When a Pod dies, it is automatically removed from the endpoints, and new Pods
matching the Service's selector will automatically get added to the endpoints.
Check the endpoints, and note that the IPs are the same as the Pods created in
the first step:
-->
正如前面所提到的，一個 Service 由一組 Pod 提供支撐。這些 Pod 透過 `endpoints` 暴露出來。
Service Selector 將持續評估，結果被 POST 到一個名稱為 `my-nginx` 的 Endpoint 物件上。
當 Pod 終止後，它會自動從 Endpoint 中移除，新的能夠匹配上 Service Selector 的 Pod 將自動地被新增到 Endpoint 中。
檢查該 Endpoint，注意到 IP 地址與在第一步建立的 Pod 是相同的。

```shell
kubectl describe svc my-nginx
```
```
Name:                my-nginx
Namespace:           default
Labels:              run=my-nginx
Annotations:         <none>
Selector:            run=my-nginx
Type:                ClusterIP
IP:                  10.0.162.149
Port:                <unset> 80/TCP
Endpoints:           10.244.2.5:80,10.244.3.4:80
Session Affinity:    None
Events:              <none>
```
```shell
kubectl get ep my-nginx
```
```
NAME       ENDPOINTS                     AGE
my-nginx   10.244.2.5:80,10.244.3.4:80   1m
```

<!--
You should now be able to curl the nginx Service on `<CLUSTER-IP>:<PORT>` from
any node in your cluster. Note that the Service IP is completely virtual, it
never hits the wire. If you're curious about how this works you can read more
about the [service proxy](/docs/concepts/services-networking/service/#virtual-ips-and-service-proxies).
-->

現在，你應該能夠從叢集中任意節點上使用 curl 命令向 `<CLUSTER-IP>:<PORT>` 傳送請求以訪問 Nginx Service。
注意 Service IP 完全是虛擬的，它從來沒有走過網路，如果對它如何工作的原理感到好奇，
可以進一步閱讀[服務代理](/zh-cn/docs/concepts/services-networking/service/#virtual-ips-and-service-proxies)
的內容。

<!--
## Accessing the Service

Kubernetes supports 2 primary modes of finding a Service - environment variables
and DNS. The former works out of the box while the latter requires the
[CoreDNS cluster addon](https://releases.k8s.io/{{< param "fullversion" >}}/cluster/addons/dns/coredns).
-->
## 訪問 Service

Kubernetes支援兩種查詢服務的主要模式: 環境變數和 DNS。前者開箱即用，而後者則需要
[CoreDNS 叢集外掛](https://releases.k8s.io/{{< param "fullversion" >}}/cluster/addons/dns/coredns).

<!--
If the service environment variables are not desired (because possible clashing with expected program ones,
too many variables to process, only using DNS, etc) you can disable this mode by setting the `enableServiceLinks`
flag to `false` on the [pod spec](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#pod-v1-core).
-->
{{< note >}}
如果不需要服務環境變數（因為可能與預期的程式衝突，可能要處理的變數太多，或者僅使用DNS等），則可以透過在
[pod spec](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#pod-v1-core)
上將 `enableServiceLinks` 標誌設定為 `false` 來禁用此模式。
{{< /note >}}

<!--
### Environment Variables

When a Pod runs on a Node, the kubelet adds a set of environment variables for
each active Service. This introduces an ordering problem. To see why, inspect
the environment of your running nginx Pods (your Pod name will be different):
-->
### 環境變數

當 Pod 在節點上執行時，kubelet 會針對每個活躍的 Service 為 Pod 新增一組環境變數。
這就引入了一個順序的問題。為解釋這個問題，讓我們先檢查正在執行的 Nginx Pod
的環境變數（你的環境中的 Pod 名稱將會與下面示例命令中的不同）：

```shell
kubectl exec my-nginx-3800858182-jr4a2 -- printenv | grep SERVICE
```
```
KUBERNETES_SERVICE_HOST=10.0.0.1
KUBERNETES_SERVICE_PORT=443
KUBERNETES_SERVICE_PORT_HTTPS=443
```

<!--
Note there's no mention of your Service. This is because you created the replicas
before the Service. Another disadvantage of doing this is that the scheduler might
put both Pods on the same machine, which will take your entire Service down if
it dies. We can do this the right way by killing the 2 Pods and waiting for the
Deployment to recreate them. This time around the Service exists *before* the
replicas. This will give you scheduler-level Service spreading of your Pods
(provided all your nodes have equal capacity), as well as the right environment
variables:
-->

能看到環境變數中並沒有你建立的 Service 相關的值。這是因為副本的建立先於 Service。
這樣做的另一個缺點是，排程器可能會將所有 Pod 部署到同一臺機器上，如果該機器宕機則整個 Service 都會離線。
要改正的話，我們可以先終止這 2 個 Pod，然後等待 Deployment 去重新建立它們。
這次 Service 會*先於*副本存在。這將實現排程器級別的 Pod 按 Service
分佈（假定所有的節點都具有同樣的容量），並提供正確的環境變數：

```shell
kubectl scale deployment my-nginx --replicas=0; kubectl scale deployment my-nginx --replicas=2;

kubectl get pods -l run=my-nginx -o wide
```
```
NAME                        READY     STATUS    RESTARTS   AGE     IP            NODE
my-nginx-3800858182-e9ihh   1/1       Running   0          5s      10.244.2.7    kubernetes-minion-ljyd
my-nginx-3800858182-j4rm4   1/1       Running   0          5s      10.244.3.8    kubernetes-minion-905m
```

<!--
You may notice that the pods have different names, since they are killed and recreated.
-->

你可能注意到，Pod 具有不同的名稱，這是因為它們是被重新建立的。

```shell
kubectl exec my-nginx-3800858182-e9ihh -- printenv | grep SERVICE
```
```
KUBERNETES_SERVICE_PORT=443
MY_NGINX_SERVICE_HOST=10.0.162.149
KUBERNETES_SERVICE_HOST=10.0.0.1
MY_NGINX_SERVICE_PORT=80
KUBERNETES_SERVICE_PORT_HTTPS=443
```

### DNS

<!--
Kubernetes offers a DNS cluster addon Service that automatically assigns dns names to other Services. You can check if it's running on your cluster:
-->

Kubernetes 提供了一個自動為其它 Service 分配 DNS 名字的 DNS 外掛 Service。
你可以透過如下命令檢查它是否在工作：

```shell
kubectl get services kube-dns --namespace=kube-system
```
```
NAME       TYPE        CLUSTER-IP   EXTERNAL-IP   PORT(S)         AGE
kube-dns   ClusterIP   10.0.0.10    <none>        53/UDP,53/TCP   8m
```

<!--
The rest of this section will assume you have a Service with a long lived IP
(my-nginx), and a DNS server that has assigned a name to that IP. Here we use the CoreDNS cluster addon (application name `kube-dns`), so you can talk to the Service from any pod in your cluster using standard methods (e.g. `gethostbyname()`). If CoreDNS isn't running, you can enable it referring to the [CoreDNS README](https://github.com/coredns/deployment/tree/master/kubernetes) or [Installing CoreDNS](/docs/tasks/administer-cluster/coredns/#installing-coredns). Let's run another curl application to test this:
-->
本段剩餘的內容假設你已經有一個擁有持久 IP 地址的 Service（my-nginx），以及一個為其
IP 分配名稱的 DNS 伺服器。 這裡我們使用 CoreDNS 叢集外掛（應用名為 `kube-dns`），
所以在叢集中的任何 Pod 中，你都可以使用標準方法（例如：`gethostbyname()`）與該 Service 通訊。
如果 CoreDNS 沒有在執行，你可以參照
[CoreDNS README](https://github.com/coredns/deployment/tree/master/kubernetes)
或者[安裝 CoreDNS](/zh-cn/docs/tasks/administer-cluster/coredns/#installing-coredns) 來啟用它。
讓我們執行另一個 curl 應用來進行測試：

```shell
kubectl run curl --image=radial/busyboxplus:curl -i --tty
```
```
Waiting for pod default/curl-131556218-9fnch to be running, status is Pending, pod ready: false
Hit enter for command prompt
```

<!--
Then, hit enter and run `nslookup my-nginx`:
-->

然後，按回車並執行命令 `nslookup my-nginx`：

```shell
[ root@curl-131556218-9fnch:/ ]$ nslookup my-nginx
Server:    10.0.0.10
Address 1: 10.0.0.10

Name:      my-nginx
Address 1: 10.0.162.149
```

<!--
## Securing the Service

Till now we have only accessed the nginx server from within the cluster. Before exposing the Service to the internet, you want to make sure the communication channel is secure. For this, you will need:

* Self signed certificates for https (unless you already have an identity certificate)
* An nginx server configured to use the certificates
* A [secret](/docs/concepts/configuration/secret/) that makes the certificates accessible to pods

You can acquire all these from the [nginx https example](https://github.com/kubernetes/examples/tree/master/staging/https-nginx/). This requires having go and make tools installed. If you don't want to install those, then follow the manual steps later. In short:
-->

## 保護 Service {#securing-the-service}

到現在為止，我們只在叢集內部訪問了 Nginx 伺服器。在將 Service 暴露到因特網之前，我們希望確保通訊通道是安全的。
為實現這一目的，需要：

* 用於 HTTPS 的自簽名證書（除非已經有了一個身份證書）
* 使用證書配置的 Nginx 伺服器
* 使 Pod 可以訪問證書的 [Secret](/zh-cn/docs/concepts/configuration/secret/)

你可以從
[Nginx https 示例](https://github.com/kubernetes/examples/tree/master/staging/https-nginx/)獲取所有上述內容。
你需要安裝 go 和 make 工具。如果你不想安裝這些軟體，可以按照後文所述的手動執行步驟執行操作。簡要過程如下：

```shell
make keys KEY=/tmp/nginx.key CERT=/tmp/nginx.crt
kubectl create secret tls nginxsecret --key /tmp/nginx.key --cert /tmp/nginx.crt
```
```
secret/nginxsecret created
```
```shell
kubectl get secrets
```
```
NAME                  TYPE                                  DATA      AGE
default-token-il9rc   kubernetes.io/service-account-token   1         1d
nginxsecret           kubernetes.io/tls                     2         1m
```

<!--
And also the configmap:
-->
以下是 configmap：
```shell
kubectl create configmap nginxconfigmap --from-file=default.conf
```
```
configmap/nginxconfigmap created
```
```shell
kubectl get configmaps
```
```
NAME             DATA   AGE
nginxconfigmap   1      114s
```

<!--
Following are the manual steps to follow in case you run into problems running make (on windows for example):
-->
以下是你在執行 make 時遇到問題時要遵循的手動步驟（例如，在 Windows 上）：

```shell
# 建立公鑰和相對應的私鑰
openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout /d/tmp/nginx.key -out /d/tmp/nginx.crt -subj "/CN=my-nginx/O=my-nginx"
# 對金鑰實施 base64 編碼
cat /d/tmp/nginx.crt | base64
cat /d/tmp/nginx.key | base64
```

<!--
Use the output from the previous commands to create a yaml file as follows. The base64 encoded value should all be on a single line.
-->
使用前面命令的輸出來建立 yaml 檔案，如下所示。 base64 編碼的值應全部放在一行上。

```yaml
apiVersion: "v1"
kind: "Secret"
metadata:
  name: "nginxsecret"
  namespace: "default"
type: kubernetes.io/tls  
data:
  tls.crt: "LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0tCk1JSURIekNDQWdlZ0F3SUJBZ0lKQUp5M3lQK0pzMlpJTUEwR0NTcUdTSWIzRFFFQkJRVUFNQ1l4RVRBUEJnTlYKQkFNVENHNW5hVzU0YzNaak1SRXdEd1lEVlFRS0V3aHVaMmx1ZUhOMll6QWVGdzB4TnpFd01qWXdOekEzTVRKYQpGdzB4T0RFd01qWXdOekEzTVRKYU1DWXhFVEFQQmdOVkJBTVRDRzVuYVc1NGMzWmpNUkV3RHdZRFZRUUtFd2h1CloybHVlSE4yWXpDQ0FTSXdEUVlKS29aSWh2Y05BUUVCQlFBRGdnRVBBRENDQVFvQ2dnRUJBSjFxSU1SOVdWM0IKMlZIQlRMRmtobDRONXljMEJxYUhIQktMSnJMcy8vdzZhU3hRS29GbHlJSU94NGUrMlN5ajBFcndCLzlYTnBwbQppeW1CL3JkRldkOXg5UWhBQUxCZkVaTmNiV3NsTVFVcnhBZW50VWt1dk1vLzgvMHRpbGhjc3paenJEYVJ4NEo5Ci82UVRtVVI3a0ZTWUpOWTVQZkR3cGc3dlVvaDZmZ1Voam92VG42eHNVR0M2QURVODBpNXFlZWhNeVI1N2lmU2YKNHZpaXdIY3hnL3lZR1JBRS9mRTRqakxCdmdONjc2SU90S01rZXV3R0ljNDFhd05tNnNTSzRqYUNGeGpYSnZaZQp2by9kTlEybHhHWCtKT2l3SEhXbXNhdGp4WTRaNVk3R1ZoK0QrWnYvcW1mMFgvbVY0Rmo1NzV3ajFMWVBocWtsCmdhSXZYRyt4U1FVQ0F3RUFBYU5RTUU0d0hRWURWUjBPQkJZRUZPNG9OWkI3YXc1OUlsYkROMzhIYkduYnhFVjcKTUI4R0ExVWRJd1FZTUJhQUZPNG9OWkI3YXc1OUlsYkROMzhIYkduYnhFVjdNQXdHQTFVZEV3UUZNQU1CQWY4dwpEUVlKS29aSWh2Y05BUUVGQlFBRGdnRUJBRVhTMW9FU0lFaXdyMDhWcVA0K2NwTHI3TW5FMTducDBvMm14alFvCjRGb0RvRjdRZnZqeE04Tzd2TjB0clcxb2pGSW0vWDE4ZnZaL3k4ZzVaWG40Vm8zc3hKVmRBcStNZC9jTStzUGEKNmJjTkNUekZqeFpUV0UrKzE5NS9zb2dmOUZ3VDVDK3U2Q3B5N0M3MTZvUXRUakViV05VdEt4cXI0Nk1OZWNCMApwRFhWZmdWQTRadkR4NFo3S2RiZDY5eXM3OVFHYmg5ZW1PZ05NZFlsSUswSGt0ejF5WU4vbVpmK3FqTkJqbWZjCkNnMnlwbGQ0Wi8rUUNQZjl3SkoybFIrY2FnT0R4elBWcGxNSEcybzgvTHFDdnh6elZPUDUxeXdLZEtxaUMwSVEKQ0I5T2wwWW5scE9UNEh1b2hSUzBPOStlMm9KdFZsNUIyczRpbDlhZ3RTVXFxUlU9Ci0tLS0tRU5EIENFUlRJRklDQVRFLS0tLS0K"
  tls.key: "LS0tLS1CRUdJTiBQUklWQVRFIEtFWS0tLS0tCk1JSUV2UUlCQURBTkJna3Foa2lHOXcwQkFRRUZBQVNDQktjd2dnU2pBZ0VBQW9JQkFRQ2RhaURFZlZsZHdkbFIKd1V5eFpJWmVEZWNuTkFhbWh4d1NpeWF5N1AvOE9ta3NVQ3FCWmNpQ0RzZUh2dGtzbzlCSzhBZi9WemFhWm9zcApnZjYzUlZuZmNmVUlRQUN3WHhHVFhHMXJKVEVGSzhRSHA3VkpMcnpLUC9QOUxZcFlYTE0yYzZ3MmtjZUNmZitrCkU1bEVlNUJVbUNUV09UM3c4S1lPNzFLSWVuNEZJWTZMMDUrc2JGQmd1Z0ExUE5JdWFubm9UTWtlZTRuMG4rTDQKb3NCM01ZUDhtQmtRQlAzeE9JNHl3YjREZXUraURyU2pKSHJzQmlIT05Xc0RadXJFaXVJMmdoY1kxeWIyWHI2UAozVFVOcGNSbC9pVG9zQngxcHJHclk4V09HZVdPeGxZZmcvbWIvNnBuOUYvNWxlQlkrZStjSTlTMkQ0YXBKWUdpCkwxeHZzVWtGQWdNQkFBRUNnZ0VBZFhCK0xkbk8ySElOTGo5bWRsb25IUGlHWWVzZ294RGQwci9hQ1Zkank4dlEKTjIwL3FQWkUxek1yall6Ry9kVGhTMmMwc0QxaTBXSjdwR1lGb0xtdXlWTjltY0FXUTM5SjM0VHZaU2FFSWZWNgo5TE1jUHhNTmFsNjRLMFRVbUFQZytGam9QSFlhUUxLOERLOUtnNXNrSE5pOWNzMlY5ckd6VWlVZWtBL0RBUlBTClI3L2ZjUFBacDRuRWVBZmI3WTk1R1llb1p5V21SU3VKdlNyblBESGtUdW1vVlVWdkxMRHRzaG9reUxiTWVtN3oKMmJzVmpwSW1GTHJqbGtmQXlpNHg0WjJrV3YyMFRrdWtsZU1jaVlMbjk4QWxiRi9DSmRLM3QraTRoMTVlR2ZQegpoTnh3bk9QdlVTaDR2Q0o3c2Q5TmtEUGJvS2JneVVHOXBYamZhRGR2UVFLQmdRRFFLM01nUkhkQ1pKNVFqZWFKClFGdXF4cHdnNzhZTjQyL1NwenlUYmtGcVFoQWtyczJxWGx1MDZBRzhrZzIzQkswaHkzaE9zSGgxcXRVK3NHZVAKOWRERHBsUWV0ODZsY2FlR3hoc0V0L1R6cEdtNGFKSm5oNzVVaTVGZk9QTDhPTm1FZ3MxMVRhUldhNzZxelRyMgphRlpjQ2pWV1g0YnRSTHVwSkgrMjZnY0FhUUtCZ1FEQmxVSUUzTnNVOFBBZEYvL25sQVB5VWs1T3lDdWc3dmVyClUycXlrdXFzYnBkSi9hODViT1JhM05IVmpVM25uRGpHVHBWaE9JeXg5TEFrc2RwZEFjVmxvcG9HODhXYk9lMTAKMUdqbnkySmdDK3JVWUZiRGtpUGx1K09IYnRnOXFYcGJMSHBzUVpsMGhucDBYSFNYVm9CMUliQndnMGEyOFVadApCbFBtWmc2d1BRS0JnRHVIUVV2SDZHYTNDVUsxNFdmOFhIcFFnMU16M2VvWTBPQm5iSDRvZUZKZmcraEppSXlnCm9RN3hqWldVR3BIc3AyblRtcHErQWlSNzdyRVhsdlhtOElVU2FsbkNiRGlKY01Pc29RdFBZNS9NczJMRm5LQTQKaENmL0pWb2FtZm1nZEN0ZGtFMXNINE9MR2lJVHdEbTRpb0dWZGIwMllnbzFyb2htNUpLMUI3MkpBb0dBUW01UQpHNDhXOTVhL0w1eSt5dCsyZ3YvUHM2VnBvMjZlTzRNQ3lJazJVem9ZWE9IYnNkODJkaC8xT2sybGdHZlI2K3VuCnc1YytZUXRSTHlhQmd3MUtpbGhFZDBKTWU3cGpUSVpnQWJ0LzVPbnlDak9OVXN2aDJjS2lrQ1Z2dTZsZlBjNkQKckliT2ZIaHhxV0RZK2Q1TGN1YSt2NzJ0RkxhenJsSlBsRzlOZHhrQ2dZRUF5elIzT3UyMDNRVVV6bUlCRkwzZAp4Wm5XZ0JLSEo3TnNxcGFWb2RjL0d5aGVycjFDZzE2MmJaSjJDV2RsZkI0VEdtUjZZdmxTZEFOOFRwUWhFbUtKCnFBLzVzdHdxNWd0WGVLOVJmMWxXK29xNThRNTBxMmk1NVdUTThoSDZhTjlaMTltZ0FGdE5VdGNqQUx2dFYxdEYKWSs4WFJkSHJaRnBIWll2NWkwVW1VbGc9Ci0tLS0tRU5EIFBSSVZBVEUgS0VZLS0tLS0K"
```

<!--
Now create the secrets using the file:
-->
現在使用檔案建立 Secret：

```shell
kubectl apply -f nginxsecrets.yaml
kubectl get secrets
```
```
NAME                  TYPE                                  DATA      AGE
default-token-il9rc   kubernetes.io/service-account-token   1         1d
nginxsecret           kubernetes.io/tls                     2         1m
```

<!--
Now modify your nginx replicas to start an https server using the certificate in the secret, and the Service, to expose both ports (80 and 443):
-->
現在修改 nginx 副本以啟動一個使用 Secret 中的證書的 HTTPS 伺服器以及相應的用於暴露其埠（80 和 443）的 Service：

{{< codenew file="service/networking/nginx-secure-app.yaml" >}}

<!--
Noteworthy points about the nginx-secure-app manifest:

- It contains both Deployment and Service specification in the same file.
- The [nginx server](https://github.com/kubernetes/examples/tree/master/staging/https-nginx/default.conf)
  serves HTTP traffic on port 80 and HTTPS traffic on 443, and nginx Service
  exposes both ports.
- Each container has access to the keys through a volume mounted at `/etc/nginx/ssl`.
  This is setup *before* the nginx server is started.
-->
關於 nginx-secure-app 清單，值得注意的幾點如下：

- 它將 Deployment 和 Service 的規約放在了同一個檔案中。
- [Nginx 伺服器](https://github.com/kubernetes/examples/tree/master/staging/https-nginx/default.conf)透過
  80 埠處理 HTTP 流量，透過 443 埠處理 HTTPS 流量，而 Nginx Service 則暴露了這兩個埠。
- 每個容器能透過掛載在 `/etc/nginx/ssl` 的卷訪問秘鑰。卷和金鑰需要在 Nginx 伺服器啟動*之前*配置好。

```shell
kubectl delete deployments,svc my-nginx; kubectl create -f ./nginx-secure-app.yaml
```

<!--
At this point you can reach the nginx server from any node.
-->
這時，你可以從任何節點訪問到 Nginx 伺服器。

```shell
kubectl get pods -o yaml | grep -i podip
    podIP: 10.244.3.5
node $ curl -k https://10.244.3.5
...
<h1>Welcome to nginx!</h1>
```

<!--
Note how we supplied the `-k` parameter to curl in the last step, this is because we don't know anything about the pods running nginx at certificate generation time,
so we have to tell curl to ignore the CName mismatch. By creating a Service we linked the CName used in the certificate with the actual DNS name used by pods during Service lookup.
Let's test this from a pod (the same secret is being reused for simplicity, the pod only needs nginx.crt to access the Service):
-->
注意最後一步我們是如何提供 `-k` 引數執行 curl 命令的，這是因為在證書生成時，
我們不知道任何關於執行 nginx 的 Pod 的資訊，所以不得不在執行 curl 命令時忽略 CName 不匹配的情況。
透過建立 Service，我們連線了在證書中的 CName 與在 Service 查詢時被 Pod 使用的實際 DNS 名字。
讓我們從一個 Pod 來測試（為了方便，這裡使用同一個 Secret，Pod 僅需要使用 nginx.crt 去訪問 Service）：

{{< codenew file="service/networking/curlpod.yaml" >}}

```shell
kubectl apply -f ./curlpod.yaml
kubectl get pods -l app=curlpod
```
```
NAME                               READY     STATUS    RESTARTS   AGE
curl-deployment-1515033274-1410r   1/1       Running   0          1m
```
```shell
kubectl exec curl-deployment-1515033274-1410r -- curl https://my-nginx --cacert /etc/nginx/ssl/tls.crt
...
<title>Welcome to nginx!</title>
...
```

<!--
## Exposing the Service

For some parts of your applications you may want to expose a Service onto an
external IP address. Kubernetes supports two ways of doing this: NodePorts and
LoadBalancers. The Service created in the last section already used `NodePort`,
so your nginx HTTPS replica is ready to serve traffic on the internet if your
node has a public IP.
-->
## 暴露 Service

對應用的某些部分，你可能希望將 Service 暴露在一個外部 IP 地址上。
Kubernetes 支援兩種實現方式：NodePort 和 LoadBalancer。
在上一段建立的 Service 使用了 `NodePort`，因此，如果你的節點有一個公網
IP，那麼 Nginx HTTPS 副本已經能夠處理因特網上的流量。

```shell
kubectl get svc my-nginx -o yaml | grep nodePort -C 5
```

```
  uid: 07191fb3-f61a-11e5-8ae5-42010af00002
spec:
  clusterIP: 10.0.162.149
  ports:
  - name: http
    nodePort: 31704
    port: 8080
    protocol: TCP
    targetPort: 80
  - name: https
    nodePort: 32453
    port: 443
    protocol: TCP
    targetPort: 443
  selector:
    run: my-nginx
```

```shell
kubectl get nodes -o yaml | grep ExternalIP -C 1
```

```
    - address: 104.197.41.11
      type: ExternalIP
    allocatable:
--
    - address: 23.251.152.56
      type: ExternalIP
    allocatable:
...

$ curl https://<EXTERNAL-IP>:<NODE-PORT> -k
...
<h1>Welcome to nginx!</h1>
```

<!--
Let's now recreate the Service to use a cloud load balancer. Change the `Type` of `my-nginx` Service from `NodePort` to `LoadBalancer`:
-->

讓我們重新建立一個 Service 以使用雲負載均衡器。
將 `my-nginx` Service 的 `Type` 由 `NodePort` 改成 `LoadBalancer`：

```shell
kubectl edit svc my-nginx
kubectl get svc my-nginx
```
```
NAME       TYPE           CLUSTER-IP     EXTERNAL-IP        PORT(S)               AGE
my-nginx   LoadBalancer   10.0.162.149   xx.xxx.xxx.xxx     8080:30163/TCP        21s
```
```
curl https://<EXTERNAL-IP> -k
...
<title>Welcome to nginx!</title>
```

<!--
The IP address in the `EXTERNAL-IP` column is the one that is available on the public internet.  The `CLUSTER-IP` is only available inside your
cluster/private cloud network.

Note that on AWS, type `LoadBalancer` creates an ELB, which uses a (long)
hostname, not an IP.  It's too long to fit in the standard `kubectl get svc`
output, in fact, so you'll need to do `kubectl describe service my-nginx` to
see it.  You'll see something like this:
-->

在 `EXTERNAL-IP` 列中的 IP 地址能在公網上被訪問到。`CLUSTER-IP` 只能從叢集/私有云網路中訪問。

注意，在 AWS 上，型別 `LoadBalancer` 的服務會建立一個 ELB，且 ELB 使用主機名（比較長），而不是 IP。
ELB 的主機名太長以至於不能適配標準 `kubectl get svc` 的輸出，所以需要透過執行
`kubectl describe service my-nginx` 命令來檢視它。
可以看到類似如下內容：

```shell
kubectl describe service my-nginx
...
LoadBalancer Ingress:   a320587ffd19711e5a37606cf4a74574-1142138393.us-east-1.elb.amazonaws.com
...
```

## {{% heading "whatsnext" %}}

<!--
* Learn more about [Using a Service to Access an Application in a Cluster](/docs/tasks/access-application-cluster/service-access-application-cluster/)
* Learn more about [Connecting a Front End to a Back End Using a Service](/docs/tasks/access-application-cluster/connecting-frontend-backend/)
* Learn more about [Creating an External Load Balancer](/docs/tasks/access-application-cluster/create-external-load-balancer/)
-->
* 進一步瞭解如何[使用 Service 訪問叢集中的應用](/zh-cn/docs/tasks/access-application-cluster/service-access-application-cluster/)
* 進一步瞭解如何[使用 Service 將前端連線到後端](/zh-cn/docs/tasks/access-application-cluster/connecting-frontend-backend/)
* 進一步瞭解如何[建立外部負載均衡器](/zh-cn/docs/tasks/access-application-cluster/create-external-load-balancer/)
