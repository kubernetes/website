---
title: 運行多實例的應用
weight: 10
---
<!--
title: Running Multiple Instances of Your App
weight: 10
-->

## {{% heading "objectives" %}}

<!--
* Scale an existing app manually using kubectl.
-->
* 使用 kubectl 手動擴縮現有的應用

<!--
## Scaling an application
-->
## 擴縮應用

{{% alert %}}
<!--
_You can create from the start a Deployment with multiple instances using the --replicas
parameter for the kubectl create deployment command._
-->
**通過在使用 `kubectl create deployment` 命令時設置 `--replicas` 參數，
你可以在啓動 Deployment 時創建多個實例。**
{{% /alert %}}

<!--
Previously we created a [Deployment](/docs/concepts/workloads/controllers/deployment/),
and then exposed it publicly via a [Service](/docs/concepts/services-networking/service/).
The Deployment created only one Pod for running our application. When traffic increases,
we will need to scale the application to keep up with user demand.

If you haven't worked through the earlier sections, start from
[Using minikube to create a cluster](/docs/tutorials/kubernetes-basics/create-cluster/cluster-intro/).

_Scaling_ is accomplished by changing the number of replicas in a Deployment.
-->
之前我們創建了一個 [Deployment](/zh-cn/docs/concepts/workloads/controllers/deployment/)，
然後通過 [Service](/zh-cn/docs/concepts/services-networking/service/) 讓其可以公開訪問。
Deployment 僅創建了一個 Pod 用於運行這個應用。當流量增加時，我們需要擴容應用滿足用戶需求。

如果你還沒有學習過之前的章節，
需要從[使用 Minikube 創建集羣](/zh-cn/docs/tutorials/kubernetes-basics/create-cluster/cluster-intro/)開始。

擴縮是通過改變 Deployment 中的副本數量來實現的。

{{< note >}}
<!--
If you are trying this after the
[previous section](/docs/tutorials/kubernetes-basics/expose/expose-intro/), then you
may have deleted the service you created, or have created a Service of `type: NodePort`.
In this section, it is assumed that a service with `type: LoadBalancer` is created
for the kubernetes-bootcamp Deployment.

If you have _not_ deleted the Service created in
[the previous section](/docs/tutorials/kubernetes-basics/expose/expose-intro),
first delete that Service and then run the following command to create a new Service
with its `type` set to `LoadBalancer`:
-->
如果你是在[上一節](/zh-cn/docs/tutorials/kubernetes-basics/expose/expose-intro/)之後嘗試此操作，
那麼你可能已經刪除了創建的 Service 或已創建了 `type: NodePort` 類型的 Service。
在本節中，假設你已經爲 kubernetes-bootcamp Deployment 創建了 `type: LoadBalancer`
類型的 Service。

如果你**沒有**刪除在[前一節](/zh-cn/docs/tutorials/kubernetes-basics/expose/expose-intro)中創建的 Service，
請先刪除該 Service，然後運行以下命令來創建一個新的 `type` 設置爲 `LoadBalancer` 的 Service：

```shell
kubectl expose deployment/kubernetes-bootcamp --type="LoadBalancer" --port 8080
```
{{< /note >}}

<!--
## Scaling overview
-->
## 擴縮概述

{{< tutorials/carousel id="myCarousel" interval="3000" >}}
{{< tutorials/carousel-item
     image="/docs/tutorials/kubernetes-basics/public/images/module_05_scaling1.svg"
     active="true" >}}

{{< tutorials/carousel-item
     image="/docs/tutorials/kubernetes-basics/public/images/module_05_scaling2.svg" >}}
{{< /tutorials/carousel >}}

{{% alert %}}
<!--
_Scaling is accomplished by changing the number of replicas in a Deployment._
-->
**擴縮是通過改變 Deployment 中的副本數量來實現的。**
{{% /alert %}}

<!--
Scaling out a Deployment will ensure new Pods are created and scheduled to Nodes
with available resources. Scaling will increase the number of Pods to the new desired
state. Kubernetes also supports [autoscaling](/docs/tasks/run-application/horizontal-pod-autoscale/)
of Pods, but it is outside of the scope of this tutorial. Scaling to zero is also
possible, and it will terminate all Pods of the specified Deployment.
-->
對 Deployment 橫向擴容將保證新的 Pod 被創建並調度到有可用資源的 Node 上，
擴容會將 Pod 數量增加至新的預期狀態。
Kubernetes 還支持 Pod 的[自動擴縮容](/zh-cn/docs/tasks/run-application/horizontal-pod-autoscale/)，
但這並不在本教程的討論範圍內。
將 Pod 數量收縮到 0 也是可以的，這會終止指定 Deployment 上所有的 Pod。

<!--
Running multiple instances of an application will require a way to distribute the
traffic to all of them. Services have an integrated load-balancer that will distribute
network traffic to all Pods of an exposed Deployment. Services will monitor continuously
the running Pods using endpoints, to ensure the traffic is sent only to available Pods.

Once you have multiple instances of an application running, you would be able to
do Rolling updates without downtime. We'll cover that in the next section of the
tutorial. Now, let's go to the terminal and scale our application.
-->
運行多實例的應用，需要有方法在多個實例之間分配流量。Service 有一個集成的負載均衡器，
將網絡流量分配到一個可公開訪問的 Deployment 的所有 Pod 上。
Service 將會通過 Endpoints 來持續監視運行中的 Pod 集合，保證流量只分配到可用的 Pod 上。

一旦有了多個應用實例，就可以進行滾動更新而不會出現服務中斷情況。我們將會在教程的下一節介紹這些內容。
現在讓我們進入終端，擴縮我們的應用。

<!--
### Scaling a Deployment

To list your Deployments, use the `get deployments` subcommand:
-->
### 擴縮 Deployment

要列出你的 Deployment，可以使用 `get deployments` 子命令：

```shell
kubectl get deployments
```

<!--
The output should be similar to:
-->
輸出應該類似這樣：

```
NAME                  READY   UP-TO-DATE   AVAILABLE   AGE
kubernetes-bootcamp   1/1     1            1           11m
```

<!--
We should have 1 Pod. If not, run the command again. This shows:

* _NAME_ lists the names of the Deployments in the cluster.
* _READY_ shows the ratio of CURRENT/DESIRED replicas
* _UP-TO-DATE_ displays the number of replicas that have been updated to achieve the desired state.
* _AVAILABLE_ displays how many replicas of the application are available to your users.
* _AGE_ displays the amount of time that the application has been running.

To see the ReplicaSet created by the Deployment, run:
-->
我們應該有 1 個 Pod。如果沒有，請重新運行命令。結果顯示：

* **NAME** 列出了集羣中的 Deployment 的名稱。
* **READY** 顯示當前副本數與期望副本數的比例。
* **UP-TO-DATE** 顯示已更新至期望狀態的副本數。
* **AVAILABLE** 顯示可用的 Pod 的數量。
* **AGE** 顯示應用已運行的時間。

```shell
kubectl get rs
```

<!--
Notice that the name of the ReplicaSet is always formatted as
<nobr>[DEPLOYMENT-NAME]-[RANDOM-STRING]</nobr>.
The random string is randomly generated and uses the pod-template-hash as a seed.

Two important columns of this output are:
-->
注意 ReplicaSet 名稱總是遵循 <nobr>[DEPLOYMENT-NAME]-[RANDOM-STRING]</nobr> 的格式。
隨機字符串是使用 `pod-template-hash` 作爲種子隨機生成的。

兩個重要的列是：
<!--
* _DESIRED_ displays the desired number of replicas of the application, which you
define when you create the Deployment. This is the desired state.
* _CURRENT_ displays how many replicas are currently running.

Next, let’s scale the Deployment to 4 replicas. We’ll use the `kubectl scale` command,
followed by the Deployment type, name and desired number of instances:
-->
* **DESIRED** 顯示期望應用具有的副本數量，在你創建 Deployment 時要定義這個值。這是期望的狀態。
* **CURRENT** 顯示當前正在運行的副本數量。

接下來，讓我們將 Deployment 擴容到 4 個副本。
我們將使用 `kubectl scale` 命令，後面給出 Deployment 類別、名稱和預期的實例數量：

```shell
kubectl scale deployments/kubernetes-bootcamp --replicas=4
```

<!--
To list your Deployments once again, use `get deployments`:
-->
要再次列舉出你的 Deployment 集合，使用 `get deployments`：

```shell
kubectl get deployments
```

<!--
The change was applied, and we have 4 instances of the application available. Next,
let’s check if the number of Pods changed:
-->
更改已經被應用，我們有 4 個應用實例可用。接下來，讓我們檢查 Pod 的數量是否發生變化：

```shell
kubectl get pods -o wide
```

<!--
There are 4 Pods now, with different IP addresses. The change was registered in
the Deployment events log. To check that, use the `describe` subcommand:
-->
現在有 4 個 Pod，各有不同的 IP 地址。這一變化會記錄到 Deployment 的事件日誌中。
要檢查這一點，可以使用 `describe` 子命令：

```shell
kubectl describe deployments/kubernetes-bootcamp
```

<!--
You can also view in the output of this command that there are 4 replicas now.
-->
你還可以從該命令的輸出中看到，現在有 4 個副本。

<!--
### Load Balancing

Let's check that the Service is load-balancing the traffic. To find out the exposed
IP and Port we can use `describe service` as we learned in the previous part of the tutorial:
-->
### 負載均衡

讓我們來檢查 Service 是否在進行流量負載均衡。要查找對外公開的 IP 和端口，
我們可以使用在教程之前部份學到的 `describe services`：

```shell
kubectl describe services/kubernetes-bootcamp
```

<!--
Create an environment variable called NODE_PORT that has a value as the Node port:
-->
創建一個名爲 `NODE_PORT` 的環境變量，值爲 Node 的端口：

```shell
export NODE_PORT="$(kubectl get services/kubernetes-bootcamp -o go-template='{{(index .spec.ports 0).nodePort}}')"
echo NODE_PORT=$NODE_PORT
```

<!--
Next, we’ll do a `curl` to the exposed IP address and port. Execute the command multiple times:
-->
接下來，我們將使用 `curl` 訪問對外公開的 IP 和端口。多次執行以下命令：

```shell
curl http://"$(minikube ip):$NODE_PORT"
```

<!--
We hit a different Pod with every request. This demonstrates that the load-balancing is working.

The output should be similar to:
-->
我們每個請求都命中了不同的 Pod，這證明負載均衡正在工作。

輸出應該類似於：

```
Hello Kubernetes bootcamp! | Running on: kubernetes-bootcamp-644c5687f4-wp67j | v=1
Hello Kubernetes bootcamp! | Running on: kubernetes-bootcamp-644c5687f4-hs9dj | v=1
Hello Kubernetes bootcamp! | Running on: kubernetes-bootcamp-644c5687f4-4hjvf | v=1
Hello Kubernetes bootcamp! | Running on: kubernetes-bootcamp-644c5687f4-wp67j | v=1
Hello Kubernetes bootcamp! | Running on: kubernetes-bootcamp-644c5687f4-4hjvf | v=1
```

{{< note >}}
<!--
If you're running minikube with Docker Desktop as the container driver, a minikube
tunnel is needed. This is because containers inside Docker Desktop are isolated
from your host computer.

In a separate terminal window, execute:
-->
如果你使用 Docker Desktop 作爲容器驅動程序運行 Minikube，則需要使用 Minikube 隧道。
這是因爲 Docker Desktop 內的容器與主機隔離。

在另一個終端窗口中，執行：

```shell
minikube service kubernetes-bootcamp --url
```

<!--
The output looks like this:
-->
輸出類似於：

```
http://127.0.0.1:51082
!  Because you are using a Docker driver on darwin, the terminal needs to be open to run it.
```

<!--
Then use the given URL to access the app:
-->
然後使用給定的 URL 訪問應用：

```shell
curl 127.0.0.1:51082
```
{{< /note >}}

<!--
### Scale Down

To scale down the Deployment to 2 replicas, run again the `scale` subcommand:
-->
### 縮容

```shell
kubectl scale deployments/kubernetes-bootcamp --replicas=2
```

<!--
List the Deployments to check if the change was applied with the `get deployments` subcommand:
-->
要檢查更改是否已應用，可使用 `get deployments` 子命令：

```shell
kubectl get deployments
```

<!--
The number of replicas decreased to 2. List the number of Pods, with `get pods`:
-->
副本數量減少到了 2 個，要列出 Pod 的數量，使用 `get pods` 列舉 Pod：

```shell
kubectl get pods -o wide
```

<!--
This confirms that 2 Pods were terminated.
-->
這證實了有 2 個 Pod 被終止。

## {{% heading "whatsnext" %}}

<!--
* Tutorial
[Performing a Rolling Update](/docs/tutorials/kubernetes-basics/update/update-intro/).
* Learn more about [ReplicaSet](/docs/concepts/workloads/controllers/replicaset/).
* Learn more about [Autoscaling](/docs/concepts/workloads/autoscaling/).
-->
* [滾動更新](/zh-cn/docs/tutorials/kubernetes-basics/update/update-intro/)教程。
* 瞭解更多關於 [ReplicaSet](/zh-cn/docs/concepts/workloads/controllers/replicaset/)。
* 瞭解更多關於[自動伸縮](/zh-cn/docs/concepts/workloads/autoscaling/)。
