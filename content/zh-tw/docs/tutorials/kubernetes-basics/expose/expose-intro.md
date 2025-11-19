---
title: 使用 Service 公開你的應用
weight: 10
---
<!--
title: Using a Service to Expose Your App
weight: 10
-->

## {{% heading "objectives" %}}

<!--
* Learn about a Service in Kubernetes.
* Understand how labels and selectors relate to a Service.
* Expose an application outside a Kubernetes cluster.
-->
* 瞭解 Kubernetes 中的 Service
* 瞭解標籤（Label）和選擇算符（Selector）如何與 Service 關聯
* 用 Service 向 Kubernetes 叢集外公開應用

<!--
## Overview of Kubernetes Services

Kubernetes [Pods](/docs/concepts/workloads/pods/) are mortal. Pods have a
[lifecycle](/docs/concepts/workloads/pods/pod-lifecycle/). When a worker node dies,
the Pods running on the Node are also lost. A [Replicaset](/docs/concepts/workloads/controllers/replicaset/)
might then dynamically drive the cluster back to the desired state via the creation
of new Pods to keep your application running. As another example, consider an image-processing
backend with 3 replicas. Those replicas are exchangeable; the front-end system should
not care about backend replicas or even if a Pod is lost and recreated. That said,
each Pod in a Kubernetes cluster has a unique IP address, even Pods on the same Node,
so there needs to be a way of automatically reconciling changes among Pods so that your
applications continue to function.
-->
## Kubernetes Service 概述   {#overview-of-kubernetes-services}

Kubernetes [Pod](/zh-cn/docs/concepts/workloads/pods/) 是有生命期的。
Pod 擁有[生命週期](/zh-cn/docs/concepts/workloads/pods/pod-lifecycle/)。
當一個工作節點停止工作後，在節點上運行的 Pod 也會消亡。
[ReplicaSet](/zh-cn/docs/concepts/workloads/controllers/replicaset/)
會自動地通過創建新的 Pod 驅動叢集回到期望狀態，以保證應用正常運行。
換一個例子，考慮一個具有 3 個副本的用作圖像處理的後端程序。
這些副本是彼此可替換的。前端系統不應該關心後端副本，即使某個 Pod 丟失或被重新創建。
此外，Kubernetes 叢集中的每個 Pod 都有一個唯一的 IP 地址，即使是在同一個 Node 上的 Pod 也是如此，
因此需要一種方法來自動協調 Pod 集合中的變化，以便應用保持運行。

{{% alert %}}
<!--
_A Kubernetes Service is an abstraction layer which defines a logical set of Pods and
enables external traffic exposure, load balancing and service discovery for those Pods._
-->
**Kubernetes 的 Service 是一個抽象層，它所定義的是 Pod 的一個邏輯集合，
併爲這些 Pod 支持外部流量公開、負載平衡和服務發現。**
{{% /alert %}}

<!--
A [Service](/docs/concepts/services-networking/service/) in Kubernetes is an abstraction
which defines a logical set of Pods and a policy by which to access them. Services
enable a loose coupling between dependent Pods. A Service is defined using YAML or JSON,
like all Kubernetes object manifests. The set of Pods targeted by a Service is usually
determined by a _label selector_ (see below for why you might want a Service without
including a `selector` in the spec).
-->
Kubernetes 中的 [Service](/zh-cn/docs/concepts/services-networking/service/)
是一種抽象概念，它定義的是 Pod 的一個邏輯集合和一種用來訪問 Pod 的協議。
Service 使從屬 Pod 之間的松耦合成爲可能。
和所有 Kubernetes 對象清單一樣，Service 用 YAML 或者 JSON 來定義。
Service 下的一組 Pod 通常由一個**標籤選擇算符**來標記
（請參閱下面的說明來了解爲什麼你可能想要一個 spec 中不包含 `selector` 的 Service）。

<!--
Although each Pod has a unique IP address, those IPs are not exposed outside the
cluster without a Service. Services allow your applications to receive traffic.
Services can be exposed in different ways by specifying a `type` in the `spec` of the Service:
-->
雖然每個 Pod 都有唯一的 IP 地址，但如果沒有 Service，這些 IP 地址不會公開到叢集外部。
Service 允許你的應用接收流量。通過在 Service 的 `spec` 中指定 `type`，可以以不同的方式公開 Service：

<!--
* _ClusterIP_ (default) - Exposes the Service on an internal IP in the cluster. This
type makes the Service only reachable from within the cluster.

* _NodePort_ - Exposes the Service on the same port of each selected Node in the cluster using NAT.
Makes a Service accessible from outside the cluster using `NodeIP:NodePort`. Superset of ClusterIP.

* _LoadBalancer_ - Creates an external load balancer in the current cloud (if supported)
and assigns a fixed, external IP to the Service. Superset of NodePort.

* _ExternalName_ - Maps the Service to the contents of the `externalName` field
(e.g. `foo.bar.example.com`), by returning a `CNAME` record with its value.
No proxying of any kind is set up. This type requires v1.7 or higher of `kube-dns`,
or CoreDNS version 0.0.8 or higher.
-->
* **ClusterIP**（默認）- 在叢集的內部 IP 上公開 Service。
  這種類型使得 Service 只能從叢集內訪問。
* **NodePort** - 使用 NAT 在叢集中每個選定 Node 的相同端口上公開 Service 。
  使用 `NodeIP:NodePort` 從叢集外部訪問 Service。這是 ClusterIP 的超集。
* **LoadBalancer** - 在當前雲中創建一個外部負載均衡器（如果支持的話），
  併爲 Service 分配一個固定的外部 IP。這是 NodePort 的超集。
* **ExternalName** - 將 Service 映射到 `externalName`
  字段的內容（例如 `foo.bar.example.com`），
  通過返回帶有該名稱的 `CNAME` 記錄實現。不設置任何類型的代理。
  這種類型需要 `kube-dns` 的 v1.7 或更高版本，或者 CoreDNS 的 v0.8 或更高版本。

<!--
More information about the different types of Services can be found in the
[Using Source IP](/docs/tutorials/services/source-ip/) tutorial. Also see
[Connecting Applications with Services](/docs/tutorials/services/connect-applications-service/).

Additionally, note that there are some use cases with Services that involve not defining
a `selector` in the spec. A Service created without `selector` will also not create
the corresponding Endpoints object. This allows users to manually map a Service to
specific endpoints. Another possibility why there may be no selector is you are strictly
using `type: ExternalName`.
-->
關於不同 Service 類型的更多信息可以在[使用源 IP](/zh-cn/docs/tutorials/services/source-ip/)
教程找到。也請參閱[使用 Service 連接到應用](/zh-cn/docs/tutorials/services/connect-applications-service/)。

另外，需要注意的是有一些 Service 的用例不需要在 spec 中定義 `selector`。
一個創建時未設置 `selector` 的 Service 也不會創建相應的 Endpoints 對象。
這允許使用者手動將 Service 映射到特定的端點。
沒有 `selector` 的另一種可能是你在嚴格使用 `type: ExternalName` Service。

<!--
## Services and Labels

A Service routes traffic across a set of Pods. Services are the abstraction that allows
pods to die and replicate in Kubernetes without impacting your application. Discovery
and routing among dependent Pods (such as the frontend and backend components in an application)
are handled by Kubernetes Services.
-->
## Service 和標籤   {#services-and-labels}

Service 爲一組 Pod 提供流量路由。Service 是一種抽象，
使得 Kubernetes 中的 Pod 死亡和複製不會影響應用。
在依賴的 Pod（如應用中的前端和後端組件）之間進行發現和路由是由
Kubernetes Service 處理的。

<!--
Services match a set of Pods using
[labels and selectors](/docs/concepts/overview/working-with-objects/labels), a grouping
primitive that allows logical operation on objects in Kubernetes. Labels are key/value
pairs attached to objects and can be used in any number of ways:

* Designate objects for development, test, and production
* Embed version tags
* Classify an object using tags
-->
Service 通過[標籤和選擇算符](/zh-cn/docs/concepts/overview/working-with-objects/labels)來匹配一組 Pod。
標籤和選擇算符是允許對 Kubernetes 中的對象進行邏輯操作的一種分組原語。
標籤是附加在對象上的鍵/值對，可以以多種方式使用：

* 指定用於開發、測試和生產的對象
* 嵌入版本標記
* 使用標記將對象分類

{{< figure src="/docs/tutorials/kubernetes-basics/public/images/module_04_labels.svg" class="diagram-medium" >}}

<!--
Labels can be attached to objects at creation time or later on. They can be modified
at any time. Let's expose our application now using a Service and apply some labels.
-->
標籤可以在對象創建時或之後附加到對象上，它們可以隨時被修改。
現在使用 Service 發佈我們的應用並添加一些標籤。

<!--
### Step 1: Creating a new Service

Let’s verify that our application is running. We’ll use the `kubectl get` command
and look for existing Pods:
-->
### 第一步：創建新 Service   {#step1-creating-a-new-service}

讓我們來驗證我們的應用正在運行。我們將使用 `kubectl get`
命令並查找現有的 Pod：

```shell
kubectl get pods
```

<!--
If no Pods are running then it means the objects from the previous tutorials were
cleaned up. In this case, go back and recreate the deployment from the
[Using kubectl to create a Deployment](/docs/tutorials/kubernetes-basics/deploy-app/deploy-intro#deploy-an-app)
tutorial. Please wait a couple of seconds and list the Pods again. You can continue
once you see the one Pod running.

Next, let’s list the current Services from our cluster:
-->
如果沒有 Pod 正在運行，則意味着之前教程中的對象已被清理。這時，
請返回並參考[使用 kubectl 創建 Deployment](/zh-cn/docs/tutorials/kubernetes-basics/deploy-app/deploy-intro#deploy-an-app)
教程重新創建 Deployment。
請等待幾秒鐘，然後再次列舉 Pod。一旦看到一個 Pod 正在運行，你就可以繼續了。

接下來，讓我們列舉當前叢集中的 Service：

```shell
kubectl get services
```

<!--
To expose the deployment to external traffic, we'll use the kubectl expose command with the --type=NodePort option:
-->
爲了將 Deployment 公開給外部流量，我們將使用 `kubectl expose` 命令和 `--type=NodePort` 選項：

```shell
kubectl expose deployment/kubernetes-bootcamp --type="NodePort" --port 8080
```

<!--
We have now a running Service called kubernetes-bootcamp. Here we see that the Service
received a unique cluster-IP, an internal port and an external-IP (the IP of the Node).

To find out what port was opened externally (for the `type: NodePort` Service) we’ll
run the `describe service` subcommand:
-->
我們現在有一個運行中的 Service 名爲 kubernetes-bootcamp。
這裏我們看到 Service 收到了一個唯一的叢集內 IP（Cluster-IP）、一個內部端口和一個外部 IP
（External-IP）（Node 的 IP）。

要得到外部打開的端口號（對於 `type: NodePort` 的 Service），
我們需要運行 `describe service` 子命令：

```shell
kubectl describe services/kubernetes-bootcamp
```

<!--
Create an environment variable called `NODE_PORT` that has the value of the Node
port assigned:
-->
創建一個名爲 `NODE_PORT` 的環境變量，它的值爲所分配的 Node 端口：

```shell
export NODE_PORT="$(kubectl get services/kubernetes-bootcamp -o go-template='{{(index .spec.ports 0).nodePort}}')"
echo "NODE_PORT=$NODE_PORT"
```

<!--
Now we can test that the app is exposed outside of the cluster using `curl`, the
IP address of the Node and the externally exposed port:
-->
現在我們可以使用 `curl`、Node 的 IP 地址和對外公開的端口，
來測試應用是否已經被公開到了叢集外部：

```shell
curl http://"$(minikube ip):$NODE_PORT"
```

{{< note >}}
<!--
If you're running minikube with Docker Desktop as the container driver, a minikube
tunnel is needed. This is because containers inside Docker Desktop are isolated
from your host computer.

In a separate terminal window, execute:
-->
如果你正在使用 Docker Desktop 作爲容器驅動來運行 minikube，需要使用
minikube 隧道。這是因爲 Docker Desktop 內部的容器和宿主機是隔離的。

在另一個終端窗口中，執行：

```shell
minikube service kubernetes-bootcamp --url
```

<!--
The output looks like this:
-->
輸出結果如下：

```
http://127.0.0.1:51082
!  Because you are using a Docker driver on darwin, the terminal needs to be open to run it.
```

<!--
Then use the given URL to access the app:
-->
然後使用提供的 URL 訪問應用：

```shell
curl 127.0.0.1:51082
```
{{< /note >}}

<!--
And we get a response from the server. The Service is exposed.

### Step 2: Using labels

The Deployment created automatically a label for our Pod. With the `describe deployment`
subcommand you can see the name (the _key_) of that label:
-->
然後我們就會收到伺服器的響應。Service 已經被公開出來。

### 第二步：使用標籤   {#step2-using-labels}

Deployment 自動給我們的 Pod 創建了一個標籤。通過 `describe deployment`
子命令你可以看到那個標籤的名稱（對應 `key`）：

```shell
kubectl describe deployment
```

<!--
Let’s use this label to query our list of Pods. We’ll use the `kubectl get pods`
command with `-l` as a parameter, followed by the label values:
-->
讓我們使用這個標籤來查詢 Pod 列表。我們將使用 `kubectl get pods`
命令和 `-l` 參數，後面給出標籤值：

```shell
kubectl get pods -l app=kubernetes-bootcamp
```

<!--
You can do the same to list the existing Services:
-->
你可以用同樣的方法列出現有的 Service：

```shell
kubectl get services -l app=kubernetes-bootcamp
```

<!--
Get the name of the Pod and store it in the POD_NAME environment variable:
-->
獲取 Pod 的名稱，然後存放到 `POD_NAME` 環境變量：

```shell
export POD_NAME="$(kubectl get pods -o go-template --template '{{range .items}}{{.metadata.name}}{{"\n"}}{{end}}')"
echo "Name of the Pod: $POD_NAME"
```

<!--
To apply a new label we use the label subcommand followed by the object type,
object name and the new label:
-->
要應用一個新的標籤，我們使用 `label` 子命令，
接着是對象類型、對象名稱和新的標籤：

```shell
kubectl label pods "$POD_NAME" version=v1
```

<!--
This will apply a new label to our Pod (we pinned the application version to the Pod),
and we can check it with the `describe pod` command:
-->
這將會在我們的 Pod 上應用一個新標籤（我們把應用版本鎖定到 Pod 上），
然後我們可以通過 `describe pods` 命令檢查它：

```shell
kubectl describe pods "$POD_NAME"
```

<!--
We see here that the label is attached now to our Pod. And we can query now the
list of pods using the new label:
-->
我們可以看到現在標籤已經被附加到我們的 Pod 上。
我們可以通過新的標籤來查詢 Pod 列表：

```shell
kubectl get pods -l version=v1
```

<!--
And we see the Pod.
-->
我們看到了對應的 Pod。

<!--
### Step 3: Deleting a service

To delete Services you can use the `delete service` subcommand. Labels can be used
also here:
-->
### 第三步：刪除一個 Service   {#step3-deleting-a-service}

要刪除一個 Service 你可以使用 `delete service` 子命令。這裏也可以使用標籤：

```shell
kubectl delete service -l app=kubernetes-bootcamp
```

<!--
Confirm that the Service is gone:
-->
確認對應的 Service 已經消失：

```shell
kubectl get services
```

<!--
This confirms that our Service was removed. To confirm that route is not exposed
anymore you can `curl` the previously exposed IP and port:
-->
這裏確認了我們的 Service 已經被刪除。要確認路由已經不再被公開，
你可以 `curl` 之前公開的 IP 和端口：

```shell
curl http://"$(minikube ip):$NODE_PORT"
```

<!--
This proves that the application is not reachable anymore from outside of the cluster.
You can confirm that the app is still running with a `curl` from inside the pod:
-->
這證明了叢集外部已經不再可以訪問應用。
你可以通過在 Pod 內部運行 `curl` 確認應用仍在運行：

```shell
kubectl exec -ti $POD_NAME -- curl http://localhost:8080
```

<!--
We see here that the application is up. This is because the Deployment is managing
the application. To shut down the application, you would need to delete the Deployment
as well.
-->
這裏我們看到應用是運行狀態。這是因爲 Deployment 正在管理應用。
要關閉應用，你還需要刪除 Deployment。

## {{% heading "whatsnext" %}}

<!--
* Tutorial
[Running Multiple Instances of Your App](/docs/tutorials/kubernetes-basics/scale/scale-intro/).
* Learn more about [Service](/docs/concepts/services-networking/service/).
-->
* [運行應用的多個實例](/zh-cn/docs/tutorials/kubernetes-basics/scale/scale-intro/)的教程。
* 進一步瞭解 [Service](/zh-cn/docs/concepts/services-networking/service/)。
