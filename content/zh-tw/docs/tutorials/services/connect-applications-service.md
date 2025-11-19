---
title: 使用 Service 連接到應用
content_type: tutorial
weight: 20
---
<!--
reviewers:
- caesarxuchao
- lavalamp
- thockin
title: Connecting Applications with Services
content_type: tutorial
weight: 20
-->

<!-- overview -->

<!--
## The Kubernetes model for connecting containers

Now that you have a continuously running, replicated application you can expose it on a network.

Kubernetes assumes that pods can communicate with other pods, regardless of which host they land on.
Kubernetes gives every pod its own cluster-private IP address, so you do not need to explicitly
create links between pods or map container ports to host ports. This means that containers within
a Pod can all reach each other's ports on localhost, and all pods in a cluster can see each other
without NAT. The rest of this document elaborates on how you can run reliable services on such a
networking model.

This tutorial uses a simple nginx web server to demonstrate the concept.
-->
## Kubernetes 連接容器的模型  {#the-kubernetes-model-for-connecting-containers}

既然有了一個持續運行、可複製的應用，我們就能夠將它暴露到網路上。

Kubernetes 假設 Pod 可與其它 Pod 通信，不管它們在哪個主機上。
Kubernetes 給每一個 Pod 分配一個叢集私有 IP 地址，所以沒必要在
Pod 與 Pod 之間創建連接或將容器的端口映射到主機端口。
這意味着同一個 Pod 內的所有容器能通過 localhost 上的端口互相連通，叢集中的所有 Pod
也不需要通過 NAT 轉換就能夠互相看到。
本文檔的剩餘部分詳述如何在上述網路模型之上運行可靠的服務。

本教程使用一個簡單的 Nginx 伺服器來演示概念驗證原型。

<!-- body -->

<!--
## Exposing pods to the cluster

We did this in a previous example, but let's do it once again and focus on the networking perspective.
Create an nginx Pod, and note that it has a container port specification:
-->
## 在叢集中暴露 Pod  {#exposing-pods-to-the-cluster}

我們在之前的示例中已經做過，然而讓我們以網路連接的視角再重做一遍。
創建一個 Nginx Pod，注意其中包含一個容器端口的規約：

{{% code_sample file="service/networking/run-my-nginx.yaml" %}}

<!--
This makes it accessible from any node in your cluster. Check the nodes the Pod is running on:
-->
這使得可以從叢集中任何一個節點來訪問它。檢查節點，該 Pod 正在運行：

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
kubectl get pods -l run=my-nginx -o custom-columns=POD_IP:.status.podIPs
    POD_IP
    [map[ip:10.244.3.4]]
    [map[ip:10.244.2.5]]
```

<!--
You should be able to ssh into any node in your cluster and use a tool such as `curl`
to make queries against both IPs. Note that the containers are *not* using port 80 on
the node, nor are there any special NAT rules to route traffic to the pod. This means
you can run multiple nginx pods on the same node all using the same `containerPort`,
and access them from any other pod or node in your cluster using the assigned IP
address for the pod. If you want to arrange for a specific port on the host
Node to be forwarded to backing Pods, you can - but the networking model should
mean that you do not need to do so.

You can read more about the
[Kubernetes Networking Model](/docs/concepts/cluster-administration/networking/#the-kubernetes-network-model)
if you're curious.
-->
你應該能夠通過 ssh 登錄到叢集中的任何一個節點上，並使用諸如 `curl` 之類的工具向這兩個 IP 地址發出查詢請求。
需要注意的是，容器 **不會** 使用該節點上的 80 端口，也不會使用任何特定的 NAT 規則去路由流量到 Pod 上。
這意味着你可以使用相同的 `containerPort` 在同一個節點上運行多個 Nginx Pod，
並且可以從叢集中任何其他的 Pod 或節點上使用爲 Pod 分配的 IP 地址訪問到它們。
如果你想的話，你依然可以將宿主節點的某個端口的流量轉發到 Pod 中，但是出於網路模型的原因，你不必這麼做。

如果對此好奇，請參考
[Kubernetes 網路模型](/zh-cn/docs/concepts/cluster-administration/networking/#the-kubernetes-network-model)。

<!--
## Creating a Service

So we have pods running nginx in a flat, cluster wide, address space. In theory,
you could talk to these pods directly, but what happens when a node dies? The pods
die with it, and the ReplicaSet inside the Deployment will create new ones, with different IPs. This is
the problem a Service solves.

A Kubernetes Service is an abstraction which defines a logical set of Pods running
somewhere in your cluster, that all provide the same functionality. When created,
each Service is assigned a unique IP address (also called clusterIP). This address
is tied to the lifespan of the Service, and will not change while the Service is alive.
Pods can be configured to talk to the Service, and know that communication to the
Service will be automatically load-balanced out to some pod that is a member of the Service.

You can create a Service for your 2 nginx replicas with `kubectl expose`:
-->
## 創建 Service   {#creating-a-service}

我們有一組在一個扁平的、叢集範圍的地址空間中運行 Nginx 服務的 Pod。
理論上，你可以直接連接到這些 Pod，但如果某個節點宕機會發生什麼呢？
Pod 會終止，Deployment 內的 ReplicaSet 將創建新的 Pod，且使用不同的 IP。這正是 Service 要解決的問題。

Kubernetes Service 是叢集中提供相同功能的一組 Pod 的抽象表達。
當每個 Service 創建時，會被分配一個唯一的 IP 地址（也稱爲 clusterIP）。
這個 IP 地址與 Service 的生命週期綁定在一起，只要 Service 存在，它就不會改變。
可以設定 Pod 使它與 Service 進行通信，Pod 知道與 Service 通信將被自動地負載均衡到該
Service 中的某些 Pod 上。

可以使用 `kubectl expose` 命令爲 2 個 Nginx 副本創建一個 Service：

```shell
kubectl expose deployment/my-nginx
```

```
service/my-nginx exposed
```

<!--
This is equivalent to `kubectl apply -f` in the following yaml:
-->
這等價於使用 `kubectl create -f` 命令及如下的 yaml 文件創建：

{{% code_sample file="service/networking/nginx-svc.yaml" %}}

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
上述規約將創建一個 Service，該 Service 會將所有具有標籤 `run: my-nginx` 的 Pod 的 TCP
80 端口暴露到一個抽象的 Service 端口上（`targetPort`：容器接收流量的端口；`port`：
可任意取值的抽象的 Service 端口，其他 Pod 通過該端口訪問 Service）。
查看 [Service](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#service-v1-core)
API 對象以瞭解 Service 所能接受的字段列表。
查看你的 Service 資源:

```shell
kubectl get svc my-nginx
```

```
NAME       TYPE        CLUSTER-IP     EXTERNAL-IP   PORT(S)   AGE
my-nginx   ClusterIP   10.0.162.149   <none>        80/TCP    21s
```

<!--
As mentioned previously, a Service is backed by a group of Pods. These Pods are
exposed through
{{<glossary_tooltip term_id="endpoint-slice" text="EndpointSlices">}}.
The Service's selector will be evaluated continuously and the results will be POSTed
to an EndpointSlice that is connected to the Service using
{{< glossary_tooltip text="labels" term_id="label" >}}.
When a Pod dies, it is automatically removed from the EndpointSlices that contain it
as an endpoint. New Pods that match the Service's selector will automatically get added
to an EndpointSlice for that Service.
Check the endpoints, and note that the IPs are the same as the Pods created in
the first step:
-->
正如前面所提到的，一個 Service 由一組 Pod 提供支撐。這些 Pod 通過
{{<glossary_tooltip term_id="endpoint-slice" text="EndpointSlices">}} 暴露出來。
Service Selector 將持續評估，結果被 POST
到使用{{< glossary_tooltip text="標籤" term_id="label" >}}與該 Service 連接的一個 EndpointSlice。
當 Pod 終止後，它會自動從包含該 Pod 的 EndpointSlices 中移除。
新的能夠匹配上 Service Selector 的 Pod 將被自動地爲該 Service 添加到 EndpointSlice 中。
檢查 Endpoint，注意到 IP 地址與在第一步創建的 Pod 是相同的。

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
IP Family Policy:    SingleStack
IP Families:         IPv4
IP:                  10.0.162.149
IPs:                 10.0.162.149
Port:                <unset> 80/TCP
TargetPort:          80/TCP
Endpoints:           10.244.2.5:80,10.244.3.4:80
Session Affinity:    None
Events:              <none>
```

```shell
kubectl get endpointslices -l kubernetes.io/service-name=my-nginx
```

```
NAME             ADDRESSTYPE   PORTS   ENDPOINTS               AGE
my-nginx-7vzhx   IPv4          80      10.244.2.5,10.244.3.4   21s
```

<!--
You should now be able to curl the nginx Service on `<CLUSTER-IP>:<PORT>` from
any node in your cluster. Note that the Service IP is completely virtual, it
never hits the wire. If you're curious about how this works you can read more
about the [service proxy](/docs/reference/networking/virtual-ips/).
-->
現在，你應該能夠從叢集中任意節點上使用 curl 命令向 `<CLUSTER-IP>:<PORT>` 發送請求以訪問 Nginx Service。
注意 Service IP 完全是虛擬的，它從來沒有走過網路，如果對它如何工作的原理感到好奇，
可以進一步閱讀[服務代理](/zh-cn/docs/reference/networking/virtual-ips/)的內容。

<!--
## Accessing the Service

Kubernetes supports 2 primary modes of finding a Service - environment variables
and DNS. The former works out of the box while the latter requires the
[CoreDNS cluster addon](https://releases.k8s.io/v{{< skew currentPatchVersion >}}/cluster/addons/dns/coredns).
-->
## 訪問 Service   {#accessing-the-service}

Kubernetes 支持兩種查找服務的主要模式：環境變量和 DNS。前者開箱即用，而後者則需要
[CoreDNS 叢集插件](https://releases.k8s.io/v{{< skew currentPatchVersion >}}/cluster/addons/dns/coredns)。

{{< note >}}
<!--
If the service environment variables are not desired (because possible clashing
with expected program ones, too many variables to process, only using DNS, etc)
you can disable this mode by setting the `enableServiceLinks` flag to `false` on
the [pod spec](/docs/reference/generated/kubernetes-api/v{{< skew latestVersion >}}/#pod-v1-core).
-->
如果不需要服務環境變量（因爲可能與預期的程序衝突，可能要處理的變量太多，或者僅使用DNS等），則可以通過在
[pod spec](/docs/reference/generated/kubernetes-api/v{{< skew latestVersion >}}/#pod-v1-core)
上將 `enableServiceLinks` 標誌設置爲 `false` 來禁用此模式。
{{< /note >}}

<!--
### Environment Variables

When a Pod runs on a Node, the kubelet adds a set of environment variables for
each active Service. This introduces an ordering problem. To see why, inspect
the environment of your running nginx Pods (your Pod name will be different):
-->
### 環境變量   {#environment-variables}

當 Pod 在節點上運行時，kubelet 會針對每個活躍的 Service 爲 Pod 添加一組環境變量。
這就引入了一個順序的問題。爲解釋這個問題，讓我們先檢查正在運行的 Nginx Pod
的環境變量（你的環境中的 Pod 名稱將會與下面示例命令中的不同）：

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
Deployment to recreate them. This time the Service exists *before* the
replicas. This will give you scheduler-level Service spreading of your Pods
(provided all your nodes have equal capacity), as well as the right environment
variables:
-->
能看到環境變量中並沒有你創建的 Service 相關的值。這是因爲副本的創建先於 Service。
這樣做的另一個缺點是，調度器可能會將所有 Pod 部署到同一臺機器上，如果該機器宕機則整個 Service 都會離線。
要改正的話，我們可以先終止這 2 個 Pod，然後等待 Deployment 去重新創建它們。
這次 Service 會 **先於** 副本存在。這將實現調度器級別的 Pod 按 Service
分佈（假定所有的節點都具有同樣的容量），並提供正確的環境變量：

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
你可能注意到，Pod 具有不同的名稱，這是因爲它們是被重新創建的。

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
Kubernetes offers a DNS cluster addon Service that automatically assigns dns names
to other Services. You can check if it's running on your cluster:
-->
Kubernetes 提供了一個自動爲其它 Service 分配 DNS 名字的 DNS 插件 Service。
你可以通過如下命令檢查它是否在工作：

```shell
kubectl get services kube-dns --namespace=kube-system
```

```
NAME       TYPE        CLUSTER-IP   EXTERNAL-IP   PORT(S)         AGE
kube-dns   ClusterIP   10.0.0.10    <none>        53/UDP,53/TCP   8m
```

<!--
The rest of this section will assume you have a Service with a long lived IP
(my-nginx), and a DNS server that has assigned a name to that IP. Here we use
the CoreDNS cluster addon (application name `kube-dns`), so you can talk to the
Service from any pod in your cluster using standard methods (e.g. `gethostbyname()`).
If CoreDNS isn't running, you can enable it referring to the
[CoreDNS README](https://github.com/coredns/deployment/tree/master/kubernetes)
or [Installing CoreDNS](/docs/tasks/administer-cluster/coredns/#installing-coredns).
Let's run another curl application to test this:
-->
本段剩餘的內容假設你已經有一個擁有持久 IP 地址的 Service（my-nginx），以及一個爲其
IP 分配名稱的 DNS 伺服器。 這裏我們使用 CoreDNS 叢集插件（應用名爲 `kube-dns`），
所以在叢集中的任何 Pod 中，你都可以使用標準方法（例如：`gethostbyname()`）與該 Service 通信。
如果 CoreDNS 沒有在運行，你可以參照
[CoreDNS README](https://github.com/coredns/deployment/tree/master/kubernetes)
或者[安裝 CoreDNS](/zh-cn/docs/tasks/administer-cluster/coredns/#installing-coredns) 來啓用它。
讓我們運行另一個 curl 應用來進行測試：

```shell
kubectl run curl --image=radial/busyboxplus:curl -i --tty --rm
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

Till now we have only accessed the nginx server from within the cluster. Before
exposing the Service to the internet, you want to make sure the communication
channel is secure. For this, you will need:

* Self signed certificates for https (unless you already have an identity certificate)
* An nginx server configured to use the certificates
* A [secret](/docs/concepts/configuration/secret/) that makes the certificates accessible to pods

You can acquire all these from the
[nginx https example](https://github.com/kubernetes/examples/tree/master/_archived/https-nginx/).
This requires having go and make tools installed. If you don't want to install those,
then follow the manual steps later. In short:
-->
## 保護 Service {#securing-the-service}

到現在爲止，我們只在叢集內部訪問了 Nginx 伺服器。在將 Service 暴露到因特網之前，我們希望確保通信信道是安全的。
爲實現這一目的，需要：

* 用於 HTTPS 的自簽名證書（除非已經有了一個身份證書）
* 使用證書設定的 Nginx 伺服器
* 使 Pod 可以訪問證書的 [Secret](/zh-cn/docs/concepts/configuration/secret/)

你可以從
[Nginx https 示例](https://github.com/kubernetes/examples/tree/master/_archived/https-nginx/)獲取所有上述內容。
你需要安裝 go 和 make 工具。如果你不想安裝這些軟件，可以按照後文所述的手動執行步驟執行操作。簡要過程如下：

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
nginxsecret           kubernetes.io/tls                     2         1m
```

<!--
And also the configmap:
-->
以下是 configmap：

```shell
kubectl create configmap nginxconfigmap --from-file=default.conf
```

<!--
You can find an example for `default.conf` in
[the Kubernetes examples project repo](https://github.com/kubernetes/examples/tree/bc9ca4ca32bb28762ef216386934bef20f1f9930/staging/https-nginx/).
-->
你可以在
[Kubernetes examples 項目代碼倉庫](https://github.com/kubernetes/examples/tree/bc9ca4ca32bb28762ef216386934bef20f1f9930/staging/https-nginx/)中找到
`default.conf` 示例。

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
You can view the details of the `nginxconfigmap` ConfigMap using the following command:
-->
你可以使用以下命令來查看 `nginxconfigmap` ConfigMap 的細節：

```shell
kubectl describe configmap  nginxconfigmap
```

<!--
The output is similar to:
-->
輸出類似於：

```console
Name:         nginxconfigmap
Namespace:    default
Labels:       <none>
Annotations:  <none>

Data
====
default.conf:
----
server {
        listen 80 default_server;
        listen [::]:80 default_server ipv6only=on;

        listen 443 ssl;

        root /usr/share/nginx/html;
        index index.html;

        server_name localhost;
        ssl_certificate /etc/nginx/ssl/tls.crt;
        ssl_certificate_key /etc/nginx/ssl/tls.key;

        location / {
                try_files $uri $uri/ =404;
        }
}

BinaryData
====

Events:  <none>
```

<!--
Following are the manual steps to follow in case you run into problems running make (on windows for example):
-->
以下是你在運行 make 時遇到問題時要遵循的手動步驟（例如，在 Windows 上）：

<!--
```shell
# Create a public private key pair
openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout /d/tmp/nginx.key -out /d/tmp/nginx.crt -subj "/CN=my-nginx/O=my-nginx"
# Convert the keys to base64 encoding
cat /d/tmp/nginx.crt | base64
cat /d/tmp/nginx.key | base64
```
-->
```shell
# 創建公鑰和相對應的私鑰
openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout /d/tmp/nginx.key -out /d/tmp/nginx.crt -subj "/CN=my-nginx/O=my-nginx"
# 對密鑰實施 base64 編碼
cat /d/tmp/nginx.crt | base64
cat /d/tmp/nginx.key | base64
```

<!--
Use the output from the previous commands to create a yaml file as follows.
The base64 encoded value should all be on a single line.
-->
如下所示，使用上述命令的輸出來創建 yaml 文件。base64 編碼的值應全部放在一行上。

```yaml
apiVersion: "v1"
kind: "Secret"
metadata:
  name: "nginxsecret"
  namespace: "default"
type: kubernetes.io/tls
data:
  # 注意：將以下值替換爲你自己 base64 編碼後的證書和密鑰。
  tls.crt: "REPLACE_WITH_BASE64_CERT" 
  tls.key: "REPLACE_WITH_BASE64_KEY"
```

<!--
Now create the secrets using the file:
-->
現在使用文件創建 Secret：

```shell
kubectl apply -f nginxsecrets.yaml
kubectl get secrets
```

```
NAME                  TYPE                                  DATA      AGE
nginxsecret           kubernetes.io/tls                     2         1m
```

<!--
Now modify your nginx replicas to start an https server using the certificate
in the secret, and the Service, to expose both ports (80 and 443):
-->
現在修改 Nginx 副本以啓動一個使用 Secret 中的證書的 HTTPS 伺服器以及相應的用於暴露其端口（80 和 443）的 Service：

{{% code_sample file="service/networking/nginx-secure-app.yaml" %}}

<!--
Noteworthy points about the nginx-secure-app manifest:

- It contains both Deployment and Service specification in the same file.
- The [nginx server](https://github.com/kubernetes/examples/blob/master/_archived/https-nginx/default.conf)
  serves HTTP traffic on port 80 and HTTPS traffic on 443, and nginx Service
  exposes both ports.
- Each container has access to the keys through a volume mounted at `/etc/nginx/ssl`.
  This is set up *before* the nginx server is started.
-->
關於 nginx-secure-app 清單，值得注意的幾點如下：

- 它將 Deployment 和 Service 的規約放在了同一個文件中。
- [Nginx 伺服器](https://github.com/kubernetes/examples/blob/master/_archived/https-nginx/default.conf)通過
  80 端口處理 HTTP 流量，通過 443 端口處理 HTTPS 流量，而 Nginx Service 則暴露了這兩個端口。
- 每個容器能通過掛載在 `/etc/nginx/ssl` 的卷訪問密鑰。卷和密鑰需要在 Nginx 伺服器啓動 **之前** 設定好。

```shell
kubectl delete deployments,svc my-nginx; kubectl create -f ./nginx-secure-app.yaml
```

<!--
At this point you can reach the nginx server from any node.
-->
這時，你可以從任何節點訪問到 Nginx 伺服器。

```shell
kubectl get pods -l run=my-nginx -o custom-columns=POD_IP:.status.podIPs
    POD_IP
    [map[ip:10.244.3.5]]
```

```shell
node $ curl -k https://10.244.3.5
...
<h1>Welcome to nginx!</h1>
```

<!--
Note how we supplied the `-k` parameter to curl in the last step, this is because
we don't know anything about the pods running nginx at certificate generation time,
so we have to tell curl to ignore the CName mismatch. By creating a Service we
linked the CName used in the certificate with the actual DNS name used by pods
during Service lookup. Let's test this from a pod (the same secret is being reused
for simplicity, the pod only needs nginx.crt to access the Service):
-->
注意最後一步我們是如何提供 `-k` 參數執行 curl 命令的，這是因爲在證書生成時，
我們不知道任何關於運行 nginx 的 Pod 的信息，所以不得不在執行 curl 命令時忽略 CName 不匹配的情況。
通過創建 Service，我們連接了在證書中的 CName 與在 Service 查詢時被 Pod 使用的實際 DNS 名字。
讓我們從一個 Pod 來測試（爲了方便，這裏使用同一個 Secret，Pod 僅需要使用 nginx.crt 去訪問 Service）：

{{% code_sample file="service/networking/curlpod.yaml" %}}

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
## 暴露 Service  {#exposing-the-service}

對應用的某些部分，你可能希望將 Service 暴露在一個外部 IP 地址上。
Kubernetes 支持兩種實現方式：NodePort 和 LoadBalancer。
在上一段創建的 Service 使用了 `NodePort`，因此，如果你的節點有一個公網
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
Let's now recreate the Service to use a cloud load balancer.
Change the `Type` of `my-nginx` Service from `NodePort` to `LoadBalancer`:
-->
讓我們重新創建一個 Service 以使用雲負載均衡器。
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
The IP address in the `EXTERNAL-IP` column is the one that is available on the public internet.
The `CLUSTER-IP` is only available inside your cluster/private cloud network.

Note that on AWS, type `LoadBalancer` creates an ELB, which uses a (long)
hostname, not an IP.  It's too long to fit in the standard `kubectl get svc`
output, in fact, so you'll need to do `kubectl describe service my-nginx` to
see it.  You'll see something like this:
-->
在 `EXTERNAL-IP` 列中的 IP 地址能在公網上被訪問到。`CLUSTER-IP` 只能從叢集/私有云網路中訪問。

注意，在 AWS 上，類型 `LoadBalancer` 的服務會創建一個 ELB，且 ELB 使用主機名（比較長），而不是 IP。
ELB 的主機名太長以至於不能適配標準 `kubectl get svc` 的輸出，所以需要通過執行
`kubectl describe service my-nginx` 命令來查看它。
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
* 進一步瞭解如何[使用 Service 將前端連接到後端](/zh-cn/docs/tasks/access-application-cluster/connecting-frontend-backend/)
* 進一步瞭解如何[創建外部負載均衡器](/zh-cn/docs/tasks/access-application-cluster/create-external-load-balancer/)
