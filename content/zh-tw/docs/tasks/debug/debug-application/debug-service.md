---
content_type: task
title: 調試 Service
weight: 20
---

<!--
reviewers:
- thockin
- bowei
content_type: task
title: Debug Services
weight: 20
-->

<!-- overview -->

<!--
An issue that comes up rather frequently for new installations of Kubernetes is
that a Service is not working properly.  You've run your Pods through a
Deployment (or other workload controller) and created a Service, but you
get no response when you try to access it.  This document will hopefully help
you to figure out what's going wrong.
-->
對於新安裝的 Kubernetes，經常出現的問題是 Service 無法正常運行。你已經通過
Deployment（或其他工作負載控制器）運行了 Pod，並創建 Service ，
但是當你嘗試訪問它時，沒有任何響應。此文檔有望對你有所幫助並找出問題所在。

<!-- body -->

<!--
## Running commands in a Pod

For many steps here you will want to see what a Pod running in the cluster
sees.  The simplest way to do this is to run an interactive busybox Pod:
-->
## 在 Pod 中運行命令

對於這裏的許多步驟，你可能希望知道運行在集羣中的 Pod 看起來是什麼樣的。
最簡單的方法是運行一個交互式的 busybox Pod：

```none
kubectl run -it --rm --restart=Never busybox --image=gcr.io/google-containers/busybox sh
```

<!--
{{< note >}}
If you don't see a command prompt, try pressing enter.
{{< /note >}}
-->
{{< note >}}
如果沒有看到命令提示符，請按回車。
{{< /note >}}

<!--
If you already have a running Pod that you prefer to use, you can run a
command in it using:
-->
如果你已經有了你想使用的正在運行的 Pod，則可以運行以下命令去進入：

```shell
kubectl exec <POD-NAME> -c <CONTAINER-NAME> -- <COMMAND>
```

<!--
## Setup

For the purposes of this walk-through, let's run some Pods.  Since you're
probably debugging your own Service you can substitute your own details, or you
can follow along and get a second data point.
-->
## 設置  {#setup}

爲了完成本次實踐的任務，我們先運行幾個 Pod。
由於你可能正在調試自己的 Service，所以，你可以使用自己的信息進行替換，
或者你也可以跟着教程並開始下面的步驟來獲得第二個數據點。

```shell
kubectl create deployment hostnames --image=registry.k8s.io/serve_hostname
```

```none
deployment.apps/hostnames created
```

<!--
`kubectl` commands will print the type and name of the resource created or mutated, which can then be used in subsequent commands.

Let's scale the deployment to 3 replicas.
-->
`kubectl` 命令將打印創建或變更的資源的類型和名稱，它們可以在後續命令中使用。
讓我們將這個 deployment 的副本數擴至 3。

```shell
kubectl scale deployment hostnames --replicas=3
```

```none
deployment.apps/hostnames scaled
```

<!--
Note that this is the same as if you had started the Deployment with the following
YAML:
-->
請注意這與你使用以下 YAML 方式啓動 Deployment 類似：

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  labels:
    app: hostnames
  name: hostnames
spec:
  selector:
    matchLabels:
      app: hostnames
  replicas: 3
  template:
    metadata:
      labels:
        app: hostnames
    spec:
      containers:
      - name: hostnames
        image: registry.k8s.io/serve_hostname
```

<!--
The label "app" is automatically set by `kubectl create deployment` to the name of the Deployment.

You can confirm your Pods are running:
-->
"app" 標籤是 `kubectl create deployment` 根據 Deployment 名稱自動設置的。

確認你的 Pod 是運行狀態:

```shell
kubectl get pods -l app=hostnames
```

```none
NAME                        READY     STATUS    RESTARTS   AGE
hostnames-632524106-bbpiw   1/1       Running   0          2m
hostnames-632524106-ly40y   1/1       Running   0          2m
hostnames-632524106-tlaok   1/1       Running   0          2m
```

<!--
You can also confirm that your Pods are serving.  You can get the list of
Pod IP addresses and test them directly.
-->
你還可以確認你的 Pod 是否正在提供服務。你可以獲取 Pod IP 地址列表並直接對其進行測試。

```shell
kubectl get pods -l app=hostnames \
    -o go-template='{{range .items}}{{.status.podIP}}{{"\n"}}{{end}}'
```

```none
10.244.0.5
10.244.0.6
10.244.0.7
```

<!--
The example container used for this walk-through serves its own hostname
via HTTP on port 9376, but if you are debugging your own app, you'll want to
use whatever port number your Pods are listening on.

From within a pod:
-->
用於本教程的示例容器通過 HTTP 在端口 9376 上提供其自己的主機名，
但是如果要調試自己的應用程序，則需要使用你的 Pod 正在偵聽的端口號。

在 Pod 內運行：

```shell
for ep in 10.244.0.5:9376 10.244.0.6:9376 10.244.0.7:9376; do
    wget -qO- $ep
done
```

<!--
This should produce something like:
-->
輸出類似這樣：

```
hostnames-632524106-bbpiw
hostnames-632524106-ly40y
hostnames-632524106-tlaok
```

<!--
If you are not getting the responses you expect at this point, your Pods
might not be healthy or might not be listening on the port you think they are.
You might find `kubectl logs` to be useful for seeing what is happening, or
perhaps you need to `kubectl exec` directly into your Pods and debug from
there.

Assuming everything has gone to plan so far, you can start to investigate why
your Service doesn't work.
-->
如果此時你沒有收到期望的響應，則你的 Pod 狀態可能不健康，或者可能沒有在你認爲正確的端口上進行監聽。
你可能會發現 `kubectl logs` 命令對於查看正在發生的事情很有用，
或者你可能需要通過`kubectl exec` 直接進入 Pod 中並從那裏進行調試。

假設到目前爲止一切都已按計劃進行，那麼你可以開始調查爲何你的 Service 無法正常工作。

<!--
## Does the Service exist?

The astute reader will have noticed that you did not actually create a Service
yet - that is intentional.  This is a step that sometimes gets forgotten, and
is the first thing to check.

What would happen if you tried to access a non-existent Service?  If
you have another Pod that consumes this Service by name you would get
something like:
-->
## Service 是否存在？   {#does-the-service-exist}

細心的讀者會注意到我們實際上尚未創建 Service —— 這是有意而爲之。
這一步有時會被遺忘，這是首先要檢查的步驟。

那麼，如果我嘗試訪問不存在的 Service 會怎樣？ 
假設你有另一個 Pod 通過名稱匹配到 Service，你將得到類似結果：

```shell
wget -O- hostnames
```

```none
Resolving hostnames (hostnames)... failed: Name or service not known.
wget: unable to resolve host address 'hostnames'
```

<!--
The first thing to check is whether that Service actually exists:
-->
首先要檢查的是該 Service 是否真實存在：

```shell
kubectl get svc hostnames
```

```none
No resources found.
Error from server (NotFound): services "hostnames" not found
```

<!--
Let's create the Service.  As before, this is for the walk-through - you can
use your own Service's details here.
-->
讓我們創建 Service。 和以前一樣，在這次實踐中 —— 你可以在此處使用自己的 Service 的內容。

```shell
kubectl expose deployment hostnames --port=80 --target-port=9376
```

```none
service/hostnames exposed
```

<!--
And read it back:
-->
重新運行查詢命令：

```shell
kubectl get svc hostnames
```

```none
NAME        TYPE        CLUSTER-IP   EXTERNAL-IP   PORT(S)   AGE
hostnames   ClusterIP   10.0.1.175   <none>        80/TCP    5s
```

<!--
Now you know that the Service exists.

As before, this is the same as if you had started the Service with YAML:
-->
現在你知道了 Service 確實存在。

同前，此步驟效果與通過 YAML 方式啓動 Service 一樣：

```yaml
apiVersion: v1
kind: Service
metadata:
  labels:
    app: hostnames
  name: hostnames
spec:
  selector:
    app: hostnames
  ports:
  - name: default
    protocol: TCP
    port: 80
    targetPort: 9376
```

<!--
In order to highlight the full range of configuration, the Service you created
here uses a different port number than the Pods.  For many real-world
Services, these values might be the same.
-->
爲了突出配置範圍的完整性，你在此處創建的 Service 使用的端口號與 Pods 不同。
對於許多真實的 Service，這些值可以是相同的。

<!--
## Any Network Policy Ingress rules affecting the target Pods?

If you have deployed any Network Policy Ingress rules which may affect incoming
traffic to `hostnames-*` Pods, these need to be reviewed.

Please refer to [Network Policies](/docs/concepts/services-networking/network-policies/) for more details.
-->
## 是否存在影響目標 Pod 的網絡策略入站規則？

如果你部署了任何可能影響到 `hostnames-*` Pod 的傳入流量的網絡策略入站規則，
則需要對其進行檢查。

詳細信息，請參閱[網絡策略](/zh-cn/docs/concepts/services-networking/network-policies/)。

<!--
## Does the Service work by DNS name?

One of the most common ways that clients consume a Service is through a DNS
name.

From a Pod in the same Namespace:
-->
## Service 是否可通過 DNS 名字訪問？  {#does-the-service-work-by-dns-name}

通常客戶端通過 DNS 名稱來匹配到 Service。

從相同命名空間下的 Pod 中運行以下命令：

```shell
nslookup hostnames
```

```none
Address 1: 10.0.0.10 kube-dns.kube-system.svc.cluster.local

Name:      hostnames
Address 1: 10.0.1.175 hostnames.default.svc.cluster.local
```

<!--
If this fails, perhaps your Pod and Service are in different
Namespaces, try a namespace-qualified name (again, from within a Pod):
-->
如果失敗，那麼你的 Pod 和 Service 可能位於不同的命名空間中，
請嘗試使用限定命名空間的名稱（同樣在 Pod 內運行）：

```shell
nslookup hostnames.default
```

```none
Address 1: 10.0.0.10 kube-dns.kube-system.svc.cluster.local

Name:      hostnames.default
Address 1: 10.0.1.175 hostnames.default.svc.cluster.local
```

<!--
If this works, you'll need to adjust your app to use a cross-namespace name, or
run your app and Service in the same Namespace.  If this still fails, try a
fully-qualified name:
-->
如果成功，那麼需要調整你的應用，使用跨命名空間的名稱去訪問它，
或者在相同的命名空間中運行應用和 Service。如果仍然失敗，請嘗試一個完全限定的名稱：

```shell
nslookup hostnames.default.svc.cluster.local
```

```none
Address 1: 10.0.0.10 kube-dns.kube-system.svc.cluster.local

Name:      hostnames.default.svc.cluster.local
Address 1: 10.0.1.175 hostnames.default.svc.cluster.local
```

<!--
Note the suffix here: "default.svc.cluster.local".  The "default" is the
Namespace you're operating in.  The "svc" denotes that this is a Service.
The "cluster.local" is your cluster domain, which COULD be different in your
own cluster.

You can also try this from a Node in the cluster:

-->
注意這裏的後綴："default.svc.cluster.local"。"default" 是我們正在操作的命名空間。
"svc" 表示這是一個 Service。"cluster.local" 是你的集羣域，在你自己的集羣中可能會有所不同。

你也可以在集羣中的節點上嘗試此操作：

{{< note >}}
<!--
10.0.0.10 is the cluster's DNS Service IP, yours might be different.
-->
10.0.0.10 是集羣的 DNS 服務 IP，你的可能有所不同。
{{< /note >}}

```shell
nslookup hostnames.default.svc.cluster.local 10.0.0.10
```

```none
Server:         10.0.0.10
Address:        10.0.0.10#53

Name:   hostnames.default.svc.cluster.local
Address: 10.0.1.175
```

<!--
If you are able to do a fully-qualified name lookup but not a relative one, you
need to check that your `/etc/resolv.conf` file in your Pod is correct.  From
within a Pod:
-->
如果你能夠使用完全限定的名稱查找，但不能使用相對名稱，則需要檢查你 Pod 中的
`/etc/resolv.conf` 文件是否正確。在 Pod 中運行以下命令：

```shell
cat /etc/resolv.conf
```

<!--
You should see something like:
-->
你應該可以看到類似這樣的輸出：

```
nameserver 10.0.0.10
search default.svc.cluster.local svc.cluster.local cluster.local example.com
options ndots:5
```

<!--
The `nameserver` line must indicate your cluster's DNS Service. This is
passed into `kubelet` with the `--cluster-dns` flag.
-->
`nameserver` 行必須指示你的集羣的 DNS Service，
它是通過 `--cluster-dns` 標誌傳遞到 kubelet 的。

<!--
The `search` line must include an appropriate suffix for you to find the
Service name.  In this case it is looking for Services in the local
Namespace ("default.svc.cluster.local"), Services in all Namespaces
("svc.cluster.local"), and lastly for names in the cluster ("cluster.local").
Depending on your own install you might have additional records after that (up
to 6 total).  The cluster suffix is passed into `kubelet` with the
`--cluster-domain` flag.  Throughout this document, the cluster suffix is
assumed to be "cluster.local".  Your own clusters might be configured
differently, in which case you should change that in all of the previous
commands.
-->
`search` 行必須包含一個適當的後綴，以便查找 Service 名稱。
在本例中，它查找本地命名空間（`default.svc.cluster.local`）中的服務和所有命名空間
（`svc.cluster.local`）中的服務，最後在集羣（`cluster.local`）中查找服務的名稱。
根據你自己的安裝情況，可能會有額外的記錄（最多 6 條）。
集羣后綴是通過 `--cluster-domain` 標誌傳遞給 `kubelet` 的。 
本文中，我們假定後綴是 “cluster.local”。
你的集羣配置可能不同，這種情況下，你應該在上面的所有命令中更改它。

<!--
The `options` line must set `ndots` high enough that your DNS client library
considers search paths at all.  Kubernetes sets this to 5 by default, which is
high enough to cover all of the DNS names it generates.
-->
`options` 行必須設置足夠高的 `ndots`，以便 DNS 客戶端庫考慮搜索路徑。
在默認情況下，Kubernetes 將這個值設置爲 5，這個值足夠高，足以覆蓋它生成的所有 DNS 名稱。

<!--
### Does any Service work by DNS name? {#does-any-service-exist-in-dns}

If the above still fails, DNS lookups are not working for your Service.  You
can take a step back and see what else is not working.  The Kubernetes master
Service should always work.  From within a Pod:
-->
### 是否存在 Service 能通過 DNS 名稱訪問？{#does-any-service-exist-in-dns}

如果上面的方式仍然失敗，DNS 查找不到你需要的 Service ，你可以後退一步，
看看還有什麼其它東西沒有正常工作。
Kubernetes 主 Service 應該一直是工作的。在 Pod 中運行如下命令：

```shell
nslookup kubernetes.default
```
```none
Server:    10.0.0.10
Address 1: 10.0.0.10 kube-dns.kube-system.svc.cluster.local

Name:      kubernetes.default
Address 1: 10.0.0.1 kubernetes.default.svc.cluster.local
```

<!--
If this fails, please see the [kube-proxy](#is-the-kube-proxy-working) section
of this document, or even go back to the top of this document and start over,
but instead of debugging your own Service, debug the DNS Service.
-->
如果失敗，你可能需要轉到本文的 [kube-proxy](#is-the-kube-proxy-working) 節，
或者甚至回到文檔的頂部重新開始，但不是調試你自己的 Service ，而是調試 DNS Service。

<!--
## Does the Service work by IP?

Assuming you have confirmed that DNS works, the next thing to test is whether your
Service works by its IP address.  From a Pod in your cluster, access the
Service's IP (from `kubectl get` above).
-->
### Service 能夠通過 IP 訪問麼？   {#does-the-service-work-by-ip}

假設你已經確認 DNS 工作正常，那麼接下來要測試的是你的 Service 能否通過它的 IP 正常訪問。
從集羣中的一個 Pod，嘗試訪問 Service 的 IP（從上面的 `kubectl get` 命令獲取）。

```shell
for i in $(seq 1 3); do 
    wget -qO- 10.0.1.175:80
done
```

<!--
This should produce something like:
-->
輸出應該類似這樣：

```
hostnames-632524106-bbpiw
hostnames-632524106-ly40y
hostnames-632524106-tlaok
```

<!--
If your Service is working, you should get correct responses.  If not, there
are a number of things that could be going wrong.  Read on.
-->
如果 Service 狀態是正常的，你應該得到正確的響應。
如果沒有，有很多可能出錯的地方，請繼續閱讀。

<!--
## Is the Service defined correctly?

It might sound silly, but you should really double and triple check that your
Service is correct and matches your Pod's port.  Read back your Service
and verify it:
-->
## Service 的配置是否正確？   {#is-the-service-defined-correctly}

這聽起來可能很愚蠢，但你應該兩次甚至三次檢查你的 Service 配置是否正確，並且與你的 Pod 匹配。
查看你的 Service 配置並驗證它：

```shell
kubectl get service hostnames -o json
```

```json
{
    "kind": "Service",
    "apiVersion": "v1",
    "metadata": {
        "name": "hostnames",
        "namespace": "default",
        "uid": "428c8b6c-24bc-11e5-936d-42010af0a9bc",
        "resourceVersion": "347189",
        "creationTimestamp": "2015-07-07T15:24:29Z",
        "labels": {
            "app": "hostnames"
        }
    },
    "spec": {
        "ports": [
            {
                "name": "default",
                "protocol": "TCP",
                "port": 80,
                "targetPort": 9376,
                "nodePort": 0
            }
        ],
        "selector": {
            "app": "hostnames"
        },
        "clusterIP": "10.0.1.175",
        "type": "ClusterIP",
        "sessionAffinity": "None"
    },
    "status": {
        "loadBalancer": {}
    }
}
```

<!--
* Is the Service port you are trying to access listed in `spec.ports[]`?
* Is the `targetPort` correct for your Pods (some Pods use a different port than the Service)?
* If you meant to use a numeric port, is it a number (9376) or a string "9376"?
* If you meant to use a named port, do your Pods expose a port with the same name?
* Is the port's `protocol` correct for your Pods?
-->
* 你想要訪問的 Service 端口是否在 `spec.ports[]` 中列出？
* `targetPort` 對你的 Pod 來說正確嗎（許多 Pod 使用與 Service 不同的端口）？
* 如果你想使用數值型端口，那麼它的類型是一個數值（9376）還是字符串 “9376”？
* 如果你想使用名稱型端口，那麼你的 Pod 是否暴露了一個同名端口？
* 端口的 `protocol` 和 Pod 的是否對應？

<!--
## Does the Service have any EndpointSlices?

If you got this far, you have confirmed that your Service is correctly
defined and is resolved by DNS.  Now let's check that the Pods you ran are
actually being selected by the Service.

Earlier you saw that the Pods were running.  You can re-check that:
-->
## Service 有 EndpointSlices 嗎？  {#does-the-service-have-any-endpoints}

如果你已經走到了這一步，你已經確認你的 Service 被正確定義，並能通過 DNS 解析。
現在，讓我們檢查一下，你運行的 Pod 確實是被 Service 選中的。

早些時候，我們已經看到 Pod 是運行狀態。我們可以再檢查一下：

```shell
kubectl get pods -l app=hostnames
```

```none
NAME                        READY     STATUS    RESTARTS   AGE
hostnames-632524106-bbpiw   1/1       Running   0          1h
hostnames-632524106-ly40y   1/1       Running   0          1h
hostnames-632524106-tlaok   1/1       Running   0          1h
```

<!--
The `-l app=hostnames` argument is a label selector configured on the Service.

The "AGE" column says that these Pods are about an hour old, which implies that
they are running fine and not crashing.
-->
`-l app=hostnames` 參數是在 Service 上配置的標籤選擇器。

“AGE” 列表明這些 Pod 已經啓動一個小時了，這意味着它們運行良好，而未崩潰。

<!--
The "RESTARTS" column says that these pods are not crashing frequently or being
restarted.  Frequent restarts could lead to intermittent connectivity issues.
If the restart count is high, read more about how to [debug pods](/docs/tasks/debug/debug-application/debug-pods).

Inside the Kubernetes system is a control loop which evaluates the selector of
every Service and saves the results into a corresponding EndpointSlice object.
-->
"RESTARTS" 列表明 Pod 沒有經常崩潰或重啓。經常性崩潰可能導致間歇性連接問題。
如果重啓次數過大，通過[調試 Pod](/zh-cn/docs/tasks/debug/debug-application/debug-pods)
瞭解相關技術。

在 Kubernetes 系統中有一個控制迴路，它評估每個 Service 的選擇算符，並將結果保存到
EndpointSlice 對象中。

```shell
kubectl get endpointslices -l k8s.io/service-name=hostnames
```

```
NAME              ADDRESSTYPE   PORTS   ENDPOINTS
hostnames-ytpni   IPv4          9376    10.244.0.5,10.244.0.6,10.244.0.7
```

<!--
This confirms that the EndpointSlice controller has found the correct Pods for
your Service.  If the `ENDPOINTS` column is `<none>`, you should check that
the `spec.selector` field of your Service actually selects for
`metadata.labels` values on your Pods.  A common mistake is to have a typo or
other error, such as the Service selecting for `app=hostnames`, but the
Deployment specifying `run=hostnames`, as in versions previous to 1.18, where
the `kubectl run` command could have been also used to create a Deployment.
-->
這證實 EndpointSlice 控制器已經爲你的 Service 找到了正確的 Pods。
如果 `ENDPOINTS` 列的值爲 `<none>`，則應檢查 Service 的 `spec.selector` 字段，
以及你實際想選擇的 Pod 的 `metadata.labels` 的值。
常見的錯誤是輸入錯誤或其他錯誤，例如 Service 想選擇 `app=hostnames`，但是
Deployment 指定的是 `run=hostnames`。在 1.18之前的版本中 `kubectl run`
也可以被用來創建 Deployment。

<!--
## Are the Pods working?

At this point, you know that your Service exists and has selected your Pods.
At the beginning of this walk-through, you verified the Pods themselves.
Let's check again that the Pods are actually working - you can bypass the
Service mechanism and go straight to the Pods, as listed by the Endpoints
above.
-->
## Pod 工作正常嗎？   {#are-the-pods-working}

至此，你知道你的 Service 已存在，並且已匹配到你的Pod。在本實驗的開始，你已經檢查了 Pod 本身。
讓我們再次檢查 Pod 是否確實在工作 - 你可以繞過 Service 機制並直接轉到 Pod，
如上面的 Endpoints 所示。

{{< note >}}
<!--
These commands use the Pod port (9376), rather than the Service port (80).
-->
這些命令使用的是 Pod 端口（9376），而不是 Service 端口（80）。
{{< /note >}}

<!--
From within a Pod:
-->
在 Pod 中運行：

```shell
for ep in 10.244.0.5:9376 10.244.0.6:9376 10.244.0.7:9376; do
    wget -qO- $ep
done
```

<!--
This should produce something like:
-->
輸出應該類似這樣：

```
hostnames-632524106-bbpiw
hostnames-632524106-ly40y
hostnames-632524106-tlaok
```

<!--
You expect each Pod in the endpoints list to return its own hostname.  If
this is not what happens (or whatever the correct behavior is for your own
Pods), you should investigate what's happening there.
-->
你希望 Endpoint 列表中的每個 Pod 都返回自己的主機名。 
如果情況並非如此（或你自己的 Pod 的正確行爲是什麼），你應調查發生了什麼事情。

<!--
## Is the kube-proxy working?

If you get here, your Service is running, has EndpointSlices, and your Pods
are actually serving.  At this point, the whole Service proxy mechanism is
suspect.  Let's confirm it, piece by piece.

The default implementation of Services, and the one used on most clusters, is
kube-proxy.  This is a program that runs on every node and configures one of a
small set of mechanisms for providing the Service abstraction.  If your
cluster does not use kube-proxy, the following sections will not apply, and you
will have to investigate whatever implementation of Services you are using.
-->
## kube-proxy 正常工作嗎？  {#is-the-kube-proxy-working}

如果你到達這裏，則說明你的 Service 正在運行，擁有 EndpointSlices，Pod 真正在提供服務。
此時，整個 Service 代理機制是可疑的。讓我們一步一步地確認它沒問題。

Service 的默認實現（在大多數集羣上應用的）是 kube-proxy。
這是一個在每個節點上運行的程序，負責配置用於提供 Service 抽象的機制之一。
如果你的集羣不使用 kube-proxy，則以下各節將不適用，你將必須檢查你正在使用的 Service 的實現方式。

<!--
### Is kube-proxy running?

Confirm that `kube-proxy` is running on your Nodes.  Running directly on a
Node, you should get something like the below:
-->
### kube-proxy 正常運行嗎？  {#is-kube-proxy working}

確認 `kube-proxy` 正在節點上運行。在節點上直接運行，你將會得到類似以下的輸出：

```shell
ps auxw | grep kube-proxy
```

```none
root  4194  0.4  0.1 101864 17696 ?    Sl Jul04  25:43 /usr/local/bin/kube-proxy --master=https://kubernetes-master --kubeconfig=/var/lib/kube-proxy/kubeconfig --v=2
```

<!--
Next, confirm that it is not failing something obvious, like contacting the
master.  To do this, you'll have to look at the logs.  Accessing the logs
depends on your Node OS.  On some OSes it is a file, such as
/var/log/kube-proxy.log, while other OSes use `journalctl` to access logs.  You
should see something like:
-->
下一步，確認它並沒有出現明顯的失敗，比如連接主節點失敗。要做到這一點，你必須查看日誌。
訪問日誌的方式取決於你節點的操作系統。
在某些操作系統上日誌是一個文件，如 /var/log/messages kube-proxy.log，
而其他操作系統使用 `journalctl` 訪問日誌。你應該看到輸出類似於：

```none
I1027 22:14:53.995134    5063 server.go:200] Running in resource-only container "/kube-proxy"
I1027 22:14:53.998163    5063 server.go:247] Using iptables Proxier.
I1027 22:14:54.038140    5063 proxier.go:352] Setting endpoints for "kube-system/kube-dns:dns-tcp" to [10.244.1.3:53]
I1027 22:14:54.038164    5063 proxier.go:352] Setting endpoints for "kube-system/kube-dns:dns" to [10.244.1.3:53]
I1027 22:14:54.038209    5063 proxier.go:352] Setting endpoints for "default/kubernetes:https" to [10.240.0.2:443]
I1027 22:14:54.038238    5063 proxier.go:429] Not syncing iptables until Services and Endpoints have been received from master
I1027 22:14:54.040048    5063 proxier.go:294] Adding new service "default/kubernetes:https" at 10.0.0.1:443/TCP
I1027 22:14:54.040154    5063 proxier.go:294] Adding new service "kube-system/kube-dns:dns" at 10.0.0.10:53/UDP
I1027 22:14:54.040223    5063 proxier.go:294] Adding new service "kube-system/kube-dns:dns-tcp" at 10.0.0.10:53/TCP
```

<!--
If you see error messages about not being able to contact the master, you
should double-check your Node configuration and installation steps.
-->
如果你看到有關無法連接主節點的錯誤消息，則應再次檢查節點配置和安裝步驟。

<!--
Kube-proxy can run in one of a few modes.  In the log listed above, the
line `Using iptables Proxier` indicates that kube-proxy is running in
"iptables" mode.  The most common other mode is "ipvs".
-->
Kube-proxy 可以以若干模式之一運行。在上述日誌中，`Using iptables Proxier`
行表示 kube-proxy 在 "iptables" 模式下運行。
最常見的另一種模式是 "ipvs"。

<!--
#### Iptables mode

In "iptables" mode, you should see something like the following on a Node:
-->
#### Iptables 模式   {#iptables-mode}

在 "iptables" 模式中, 你應該可以在節點上看到如下輸出:

```shell
iptables-save | grep hostnames
```

```none
-A KUBE-SEP-57KPRZ3JQVENLNBR -s 10.244.3.6/32 -m comment --comment "default/hostnames:" -j MARK --set-xmark 0x00004000/0x00004000
-A KUBE-SEP-57KPRZ3JQVENLNBR -p tcp -m comment --comment "default/hostnames:" -m tcp -j DNAT --to-destination 10.244.3.6:9376
-A KUBE-SEP-WNBA2IHDGP2BOBGZ -s 10.244.1.7/32 -m comment --comment "default/hostnames:" -j MARK --set-xmark 0x00004000/0x00004000
-A KUBE-SEP-WNBA2IHDGP2BOBGZ -p tcp -m comment --comment "default/hostnames:" -m tcp -j DNAT --to-destination 10.244.1.7:9376
-A KUBE-SEP-X3P2623AGDH6CDF3 -s 10.244.2.3/32 -m comment --comment "default/hostnames:" -j MARK --set-xmark 0x00004000/0x00004000
-A KUBE-SEP-X3P2623AGDH6CDF3 -p tcp -m comment --comment "default/hostnames:" -m tcp -j DNAT --to-destination 10.244.2.3:9376
-A KUBE-SERVICES -d 10.0.1.175/32 -p tcp -m comment --comment "default/hostnames: cluster IP" -m tcp --dport 80 -j KUBE-SVC-NWV5X2332I4OT4T3
-A KUBE-SVC-NWV5X2332I4OT4T3 -m comment --comment "default/hostnames:" -m statistic --mode random --probability 0.33332999982 -j KUBE-SEP-WNBA2IHDGP2BOBGZ
-A KUBE-SVC-NWV5X2332I4OT4T3 -m comment --comment "default/hostnames:" -m statistic --mode random --probability 0.50000000000 -j KUBE-SEP-X3P2623AGDH6CDF3
-A KUBE-SVC-NWV5X2332I4OT4T3 -m comment --comment "default/hostnames:" -j KUBE-SEP-57KPRZ3JQVENLNBR
```

<!--
For each port of each Service, there should be 1 rule in `KUBE-SERVICES` and
one `KUBE-SVC-<hash>` chain.  For each Pod endpoint, there should be a small
number of rules in that `KUBE-SVC-<hash>` and one `KUBE-SEP-<hash>` chain with
a small number of rules in it.  The exact rules will vary based on your exact
config (including node-ports and load-balancers).
-->
對於每個 Service 的每個端口，應有 1 條 `KUBE-SERVICES` 規則、一個 `KUBE-SVC-<hash>` 鏈。
對於每個 Pod 末端，在那個 `KUBE-SVC-<hash>` 鏈中應該有一些規則與之對應，還應該
有一個 `KUBE-SEP-<hash>` 鏈與之對應，其中包含爲數不多的幾條規則。
實際的規則數量可能會根據你實際的配置（包括 NodePort 和 LoadBalancer 服務）有所不同。

<!--
#### IPVS mode

In "ipvs" mode, you should see something like the following on a Node:
-->
#### IPVS 模式   {#ipvs-mode}

在 "ipvs" 模式中, 你應該在節點下看到如下輸出：

```shell
ipvsadm -ln
```

```none
Prot LocalAddress:Port Scheduler Flags
  -> RemoteAddress:Port           Forward Weight ActiveConn InActConn
...
TCP  10.0.1.175:80 rr
  -> 10.244.0.5:9376               Masq    1      0          0
  -> 10.244.0.6:9376               Masq    1      0          0
  -> 10.244.0.7:9376               Masq    1      0          0
...
```

<!--
For each port of each Service, plus any NodePorts, external IPs, and
load-balancer IPs, kube-proxy will create a virtual server.  For each Pod
endpoint, it will create corresponding real servers. In this example, service
hostnames(`10.0.1.175:80`) has 3 endpoints(`10.244.0.5:9376`,
`10.244.0.6:9376`, `10.244.0.7:9376`).
-->
對於每個 Service 的每個端口，還有 NodePort，External IP 和 LoadBalancer 類型服務
的 IP，kube-proxy 將創建一個虛擬服務器。
對於每個 Pod 末端，它將創建相應的真實服務器。
在此示例中，服務主機名（`10.0.1.175:80`）擁有 3 個末端（`10.244.0.5:9376`、
`10.244.0.6:9376` 和 `10.244.0.7:9376`）。

<!--
### Is kube-proxy proxying?

Assuming you do see one the above cases, try again to access your Service by
IP from one of your Nodes:
-->
### kube-proxy 是否在執行代理操作?    {#is-kube-proxy-proxying}

假設你確實遇到上述情況之一，請重試從節點上通過 IP 訪問你的 Service ：

```shell
curl 10.0.1.175:80
```

```none
hostnames-632524106-bbpiw
```

<!--
If this still fails, look at the `kube-proxy` logs for specific lines like:
-->
如果這步操作仍然失敗，請查看 `kube-proxy` 日誌中的特定行，如：

```none
Setting endpoints for default/hostnames:default to [10.244.0.5:9376 10.244.0.6:9376 10.244.0.7:9376]
```

<!--
If you don't see those, try restarting `kube-proxy` with the `-v` flag set to 4, and
then look at the logs again.
-->
如果你沒有看到這些，請嘗試將 `-v` 標誌設置爲 4 並重新啓動 `kube-proxy`，然後再查看日誌。

<!--
### Edge case: A Pod fails to reach itself via the Service IP {#a-pod-fails-to-reach-itself-via-the-service-ip}

This might sound unlikely, but it does happen and it is supposed to work.

This can happen when the network is not properly configured for "hairpin"
traffic, usually when `kube-proxy` is running in `iptables` mode and Pods
are connected with bridge network. The `Kubelet` exposes a `hairpin-mode`
[flag](/docs/reference/command-line-tools-reference/kubelet/) that allows endpoints of a Service to loadbalance
back to themselves if they try to access their own Service VIP. The
`hairpin-mode` flag must either be set to `hairpin-veth` or
`promiscuous-bridge`.
-->
### 邊緣案例: Pod 無法通過 Service IP 連接到它本身  {#a-pod-fails-to-reach-itself-via-the-service-ip}

這聽起來似乎不太可能，但是確實可能發生，並且應該可以工作。

如果網絡沒有爲“髮夾模式（Hairpin）”流量生成正確配置，
通常當 `kube-proxy` 以 `iptables` 模式運行，並且 Pod 與橋接網絡連接時，就會發生這種情況。
`kubelet` 提供了 `hairpin-mode`
[標誌](/zh-cn/docs/reference/command-line-tools-reference/kubelet/)。
如果 Service 的末端嘗試訪問自己的 Service VIP，則該端點可以把流量負載均衡回來到它們自身。
`hairpin-mode` 標誌必須被設置爲 `hairpin-veth` 或者 `promiscuous-bridge`。

<!--
The common steps to trouble shoot this are as follows:

* Confirm `hairpin-mode` is set to `hairpin-veth` or `promiscuous-bridge`.
You should see something like the below. `hairpin-mode` is set to
`promiscuous-bridge` in the following example.
-->
診斷此類問題的常見步驟如下：

* 確認 `hairpin-mode` 被設置爲 `hairpin-veth` 或 `promiscuous-bridge`。
  你應該可以看到下面這樣。本例中 `hairpin-mode` 被設置爲 `promiscuous-bridge`。

  ```shell
  ps auxw | grep kubelet
  ```
  ```none
  root      3392  1.1  0.8 186804 65208 ?        Sl   00:51  11:11 /usr/local/bin/kubelet --enable-debugging-handlers=true --config=/etc/kubernetes/manifests --allow-privileged=True --v=4 --cluster-dns=10.0.0.10 --cluster-domain=cluster.local --configure-cbr0=true --cgroup-root=/ --system-cgroups=/system --hairpin-mode=promiscuous-bridge --runtime-cgroups=/docker-daemon --kubelet-cgroups=/kubelet --babysit-daemons=true --max-pods=110 --serialize-image-pulls=false --outofdisk-transition-frequency=0
  ```

<!--
* Confirm the effective `hairpin-mode`. To do this, you'll have to look at
kubelet log. Accessing the logs depends on your Node OS. On some OSes it
is a file, such as /var/log/kubelet.log, while other OSes use `journalctl`
to access logs. Please be noted that the effective hairpin mode may not
match `--hairpin-mode` flag due to compatibility. Check if there is any log
lines with key word `hairpin` in kubelet.log. There should be log lines
indicating the effective hairpin mode, like something below.
-->
* 確認有效的 `hairpin-mode`。要做到這一點，你必須查看 kubelet 日誌。
  訪問日誌取決於節點的操作系統。在一些操作系統上，它是一個文件，如 /var/log/kubelet.log，
  而其他操作系統則使用 `journalctl` 訪問日誌。請注意，由於兼容性，
  有效的 `hairpin-mode` 可能不匹配 `--hairpin-mode` 標誌。在 kubelet.log
  中檢查是否有帶有關鍵字 `hairpin` 的日誌行。應該有日誌行指示有效的
  `hairpin-mode`，就像下面這樣。

  ```none
  I0629 00:51:43.648698    3252 kubelet.go:380] Hairpin mode set to "promiscuous-bridge"
  ```

<!--
* If the effective hairpin mode is `hairpin-veth`, ensure the `Kubelet` has
the permission to operate in `/sys` on node. If everything works properly,
you should see something like:
-->
* 如果有效的髮夾模式是 `hairpin-veth`, 要保證 `Kubelet` 有操作節點上 `/sys` 的權限。
  如果一切正常，你將會看到如下輸出:

  ```shell
  for intf in /sys/devices/virtual/net/cbr0/brif/*; do cat $intf/hairpin_mode; done
  ```
  ```none
  1
  1
  1
  1
  ```

<!--
* If the effective hairpin mode is `promiscuous-bridge`, ensure `Kubelet`
has the permission to manipulate linux bridge on node. If `cbr0` bridge is
used and configured properly, you should see:
-->
* 如果有效的髮卡模式是 `promiscuous-bridge`, 要保證 `Kubelet` 有操作節點上
  Linux 網橋的權限。如果 `cbr0` 橋正在被使用且被正確設置，你將會看到如下輸出:

  ```shell
  ifconfig cbr0 |grep PROMISC
  ```
  ```none
  UP BROADCAST RUNNING PROMISC MULTICAST  MTU:1460  Metric:1
  ```

<!--
* Seek help if none of above works out.
-->
* 如果以上步驟都不能解決問題，請尋求幫助。

<!--
## Seek help

If you get this far, something very strange is happening.  Your Service is
running, has EndpointSlices, and your Pods are actually serving.  You have DNS
working, and `kube-proxy` does not seem to be misbehaving.  And yet your
Service is not working.  Please let us know what is going on, so we can help
investigate!

Contact us on
[Slack](https://slack.k8s.io/) or
[Forum](https://discuss.kubernetes.io) or
[GitHub](https://github.com/kubernetes/kubernetes).
-->
## 尋求幫助  {#seek-help}

如果你走到這一步，那麼就真的是奇怪的事情發生了。你的 Service 正在運行，有 EndpointSlices 存在，
你的 Pods 也確實在提供服務。你的 DNS 正常，`iptables` 規則已經安裝，`kube-proxy` 看起來也正常。
然而 Service 還是沒有正常工作。這種情況下，請告訴我們，以便我們可以幫助調查！

通過 [Slack](https://slack.k8s.io/) 或者 [Forum](https://discuss.kubernetes.io) 或者
[GitHub](https://github.com/kubernetes/kubernetes) 聯繫我們。

## {{% heading "whatsnext" %}}

<!--
Visit the [troubleshooting overview document](/docs/tasks/debug/) for more information.
-->
訪問[故障排查概述文檔](/zh-cn/docs/tasks/debug/)獲取更多信息。

