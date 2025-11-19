---
title: "示例：使用 Redis 部署 PHP 留言板應用"
content_type: tutorial
weight: 20
card:
  name: tutorials
  weight: 30
  title: "無狀態應用示例：基於 Redis 的 PHP Guestbook"
min-kubernetes-server-version: v1.14
source: https://cloud.google.com/kubernetes-engine/docs/tutorials/guestbook
---
<!--
title: "Example: Deploying PHP Guestbook application with Redis"
reviewers:
- ahmetb
- jimangel
content_type: tutorial
weight: 20
card:
  name: tutorials
  weight: 30
  title: "Stateless Example: PHP Guestbook with Redis"
min-kubernetes-server-version: v1.14
source: https://cloud.google.com/kubernetes-engine/docs/tutorials/guestbook
-->

<!-- overview -->

<!--
This tutorial shows you how to build and deploy a simple _(not production
ready)_, multi-tier web application using Kubernetes and
[Docker](https://www.docker.com/). This example consists of the following
components:
-->
本教程向你展示如何使用 Kubernetes 和 [Docker](https://www.docker.com/)
構建和部署一個簡單的 **(非面向生產的)** 多層 Web 應用。本例由以下組件組成：

<!--
* A single-instance [Redis](https://www.redis.io/) to store guestbook entries
* Multiple web frontend instances
-->
* 單實例 [Redis](https://www.redis.io/) 以保存留言板條目
* 多個 Web 前端實例

## {{% heading "objectives" %}}

<!--
* Start up a Redis leader.
* Start up two Redis followers.
* Start up the guestbook frontend.
* Expose and view the Frontend Service.
* Clean up.
-->
* 啓動 Redis 領導者（Leader）
* 啓動兩個 Redis 跟隨者（Follower）
* 公開並查看前端服務
* 清理

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

{{< version-check >}}

<!-- lessoncontent -->

<!--
## Start up the Redis Database
-->
## 啓動 Redis 數據庫   {#start-up-the-redis-database}

<!--
The guestbook application uses Redis to store its data.
-->
留言板應用使用 Redis 存儲數據。

<!--
### Creating the Redis Deployment
-->
### 創建 Redis Deployment    {#creating-the-redis-deployment}

<!--
The manifest file, included below, specifies a Deployment controller that runs a single replica Redis Pod.
-->
下面包含的清單文件指定了一個 Deployment 控制器，該控制器運行一個 Redis Pod 副本。

{{% code_sample file="application/guestbook/redis-leader-deployment.yaml" %}}

<!--
1. Launch a terminal window in the directory you downloaded the manifest files.
1. Apply the Redis Deployment from the `redis-leader-deployment.yaml` file:
-->
1. 在下載清單文件的目錄中啓動終端窗口。
2. 從 `redis-leader-deployment.yaml` 文件中應用 Redis Deployment：

   <!---
   for local testing of the content via relative file path
   kubectl apply -f ./content/en/examples/application/guestbook/redis-leader-deployment.yaml
   -->

   ```shell
   kubectl apply -f https://k8s.io/examples/application/guestbook/redis-leader-deployment.yaml
   ```

<!--
1. Query the list of Pods to verify that the Redis Pod is running:
-->
3. 查詢 Pod 列表以驗證 Redis Pod 是否正在運行：

   ```shell
   kubectl get pods
   ```

   <!--
   The response should be similar to this:
   -->
   響應應該與此類似：

   ```shell
   NAME                           READY   STATUS    RESTARTS   AGE
   redis-leader-fb76b4755-xjr2n   1/1     Running   0          13s
   ```

<!--
1. Run the following command to view the logs from the Redis leader Pod:
-->
4. 運行以下命令查看 Redis Deployment 中的日誌：

   ```shell
   kubectl logs -f deployment/redis-leader
   ```

<!--
### Creating the Redis leader Service
-->
### 創建 Redis 領導者服務   {#creating-the-redis-leader-service}

<!--
The guestbook application needs to communicate to the Redis to write its data.
You need to apply a [Service](/docs/concepts/services-networking/service/) to
proxy the traffic to the Redis Pod. A Service defines a policy to access the
Pods.
-->
留言板應用需要往 Redis 中寫數據。因此，需要創建
[Service](/zh-cn/docs/concepts/services-networking/service/) 來轉發 Redis Pod
的流量。Service 定義了訪問 Pod 的策略。

{{% code_sample file="application/guestbook/redis-leader-service.yaml" %}}

<!--
1. Apply the Redis Service from the following `redis-leader-service.yaml` file:
-->
1. 使用下面的 `redis-leader-service.yaml` 文件創建 Redis 的服務：

   <!---
   for local testing of the content via relative file path
   kubectl apply -f ./content/en/examples/application/guestbook/redis-leader-service.yaml
   -->
   
   ```shell
   kubectl apply -f https://k8s.io/examples/application/guestbook/redis-leader-service.yaml
   ```

<!--
1. Query the list of Services to verify that the Redis Service is running:
-->
2. 查詢服務列表驗證 Redis 服務是否正在運行：

   ```shell
   kubectl get service
   ```

   <!--
   The response should be similar to this:
   -->
   響應應該與此類似：

   ```
   NAME           TYPE        CLUSTER-IP   EXTERNAL-IP   PORT(S)    AGE
   kubernetes     ClusterIP   10.0.0.1     <none>        443/TCP    1m
   redis-leader   ClusterIP   10.103.78.24 <none>        6379/TCP   16s
   ```

{{< note >}}
<!--
This manifest file creates a Service named `redis-leader` with a set of labels
that match the labels previously defined, so the Service routes network
traffic to the Redis Pod.
-->
這個清單文件創建了一個名爲 `redis-leader` 的 Service，
其中包含一組與前面定義的標籤匹配的標籤，因此服務將網路流量路由到 Redis Pod 上。
{{< /note >}}

<!--
### Set up Redis followers

Although the Redis leader is a single Pod, you can make it highly available
and meet traffic demands by adding a few Redis followers, or replicas.
-->
### 設置 Redis 跟隨者   {#set-up-redis-followers}

儘管 Redis 領導者只有一個 Pod，你可以通過添加若干 Redis 跟隨者來將其設定爲高可用狀態，
以滿足流量需求。

{{% code_sample file="application/guestbook/redis-follower-deployment.yaml" %}}

<!--
1. Apply the Redis Deployment from the following `redis-follower-deployment.yaml` file:
-->
1. 應用下面的 `redis-follower-deployment.yaml` 文件創建 Redis Deployment：

   <!---
   for local testing of the content via relative file path
   kubectl apply -f ./content/en/examples/application/guestbook/redis-follower-deployment.yaml
   -->

   ```shell
   kubectl apply -f https://k8s.io/examples/application/guestbook/redis-follower-deployment.yaml
   ```

<!--
1. Verify that the two Redis follower replicas are running by querying the list of Pods:
-->
2. 通過查詢 Pods 列表，驗證兩個 Redis 跟隨者副本在運行：

   ```shell
   kubectl get pods
   ```

   <!--
   The response should be similar to this:
   -->
   響應應該類似於這樣：

   ```
   NAME                             READY   STATUS    RESTARTS   AGE
   redis-follower-dddfbdcc9-82sfr   1/1     Running   0          37s
   redis-follower-dddfbdcc9-qrt5k   1/1     Running   0          38s
   redis-leader-fb76b4755-xjr2n     1/1     Running   0          11m
   ```

<!--
### Creating the Redis follower service

The guestbook application needs to communicate with the Redis followers to
read data. To make the Redis followers discoverable, you must set up another
[Service](/docs/concepts/services-networking/service/).
-->
### 創建 Redis 跟隨者服務   {#creating-the-redis-follower-service}

Guestbook 應用需要與 Redis 跟隨者通信以讀取數據。
爲了讓 Redis 跟隨者可被發現，你必須創建另一個
[Service](/zh-cn/docs/concepts/services-networking/service/)。

{{% code_sample file="application/guestbook/redis-follower-service.yaml" %}}

<!--
1. Apply the Redis Service from the following `redis-follower-service.yaml` file:
-->
1. 應用如下所示 `redis-follower-service.yaml` 文件中的 Redis Service：

   <!---
   for local testing of the content via relative file path
   kubectl apply -f ./content/en/examples/application/guestbook/redis-follower-service.yaml
   -->

   ```shell
   kubectl apply -f https://k8s.io/examples/application/guestbook/redis-follower-service.yaml
   ```

<!--
1. Query the list of Services to verify that the Redis Service is running:
-->
2. 查詢 Service 列表，驗證 Redis 服務在運行：

   ```shell
   kubectl get service
   ```

   <!--
   The response should be similar to this:
   -->
   響應應該類似於這樣：

   ```
   NAME             TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)    AGE
   kubernetes       ClusterIP   10.96.0.1       <none>        443/TCP    3d19h
   redis-follower   ClusterIP   10.110.162.42   <none>        6379/TCP   9s
   redis-leader     ClusterIP   10.103.78.24    <none>        6379/TCP   6m10s
   ```

{{< note >}}
<!--
This manifest file creates a Service named `redis-follower` with a set of
labels that match the labels previously defined, so the Service routes network
traffic to the Redis Pod.
-->
清單文件創建了一個名爲 `redis-follower` 的 Service，該 Service
具有一些與之前所定義的標籤相匹配的標籤，因此該 Service 能夠將網路流量路由到
Redis Pod 之上。
{{< /note >}}

<!--
## Set up and Expose the Guestbook Frontend
-->
## 設置並公開留言板前端   {#set-up-and-expose-the-guestbook-frontend}

<!-- 
Now that you have the Redis storage of your guestbook up and running, start
the guestbook web servers. Like the Redis followers, the frontend is deployed
using a Kubernetes Deployment.

The guestbook app uses a PHP frontend. It is configured to communicate with
either the Redis follower or leader Services, depending on whether the request
is a read or a write. The frontend exposes a JSON interface, and serves a
jQuery-Ajax-based UX.
-->
現在你有了一個爲 Guestbook 應用設定的 Redis 存儲處於運行狀態，
接下來可以啓動 Guestbook 的 Web 伺服器了。
與 Redis 跟隨者類似，前端也是使用 Kubernetes Deployment 來部署的。

Guestbook 應用使用 PHP 前端。該前端被設定成與後端的 Redis
跟隨者或者領導者服務通信，具體選擇哪個服務取決於請求是讀操作還是寫操作。
前端對外暴露一個 JSON 接口，並提供基於 jQuery-Ajax 的使用者體驗。

<!--
### Creating the Guestbook Frontend Deployment
-->
### 創建 Guestbook 前端 Deployment   {#creating-the-guestbook-frontend-deployment}

{{% code_sample file="application/guestbook/frontend-deployment.yaml" %}}

<!--
1. Apply the frontend Deployment from the `frontend-deployment.yaml` file:
-->
1. 應用來自 `frontend-deployment.yaml` 文件的前端 Deployment：

   <!---
   for local testing of the content via relative file path
   kubectl apply -f ./content/en/examples/application/guestbook/frontend-deployment.yaml
   -->
   
   ```shell
   kubectl apply -f https://k8s.io/examples/application/guestbook/frontend-deployment.yaml
   ```

<!--
1. Query the list of Pods to verify that the three frontend replicas are running:
-->
2. 查詢 Pod 列表，驗證三個前端副本正在運行：

   ```shell
   kubectl get pods -l app=guestbook -l tier=frontend
   ```

   <!--
   The response should be similar to this:
   -->
   響應應該與此類似：

   ```
   NAME                        READY   STATUS    RESTARTS   AGE
   frontend-85595f5bf9-5tqhb   1/1     Running   0          47s
   frontend-85595f5bf9-qbzwm   1/1     Running   0          47s
   frontend-85595f5bf9-zchwc   1/1     Running   0          47s
   ```

<!--
### Creating the Frontend Service
-->
### 創建前端服務   {#creating-the-frontend-service}

<!--
The `Redis` Services you applied is only accessible within the Kubernetes
cluster because the default type for a Service is
[ClusterIP](/docs/concepts/services-networking/service/#publishing-services-service-types).
`ClusterIP` provides a single IP address for the set of Pods the Service is
pointing to. This IP address is accessible only within the cluster.
-->
應用的 `Redis` 服務只能在 Kubernetes 叢集中訪問，因爲服務的默認類型是
[ClusterIP](/zh-cn/docs/concepts/services-networking/service/#publishing-services-service-types)。
`ClusterIP` 爲服務指向的 Pod 集提供一個 IP 地址。這個 IP 地址只能在叢集中訪問。

<!--
If you want guests to be able to access your guestbook, you must configure the
frontend Service to be externally visible, so a client can request the Service
from outside the Kubernetes cluster. However a Kubernetes user can use
`kubectl port-forward` to access the service even though it uses a
`ClusterIP`.
-->
如果你希望訪客能夠訪問你的 Guestbook，你必須將前端服務設定爲外部可見的，
以便客戶端可以從 Kubernetes 叢集之外請求服務。
然而即便使用了 `ClusterIP`，Kubernetes 使用者仍可以通過
`kubectl port-forward` 訪問服務。

{{< note >}}
<!--
Some cloud providers, like Google Compute Engine or Google Kubernetes Engine,
support external load balancers. If your cloud provider supports load
balancers and you want to use it, uncomment `type: LoadBalancer`.
-->
Google Compute Engine 或 Google Kubernetes Engine
這些雲平臺支持外部負載均衡器。如果你的雲平臺支持負載均衡器，並且你希望使用它，
只需取消註釋 `type: LoadBalancer`。
{{< /note >}}

{{% code_sample file="application/guestbook/frontend-service.yaml" %}}

<!--
1. Apply the frontend Service from the `frontend-service.yaml` file:
-->
1. 應用來自 `frontend-service.yaml` 文件中的前端服務：

   <!---
   for local testing of the content via relative file path
   kubectl apply -f ./content/en/examples/application/guestbook/frontend-service.yaml
   -->
   
   ```shell
   kubectl apply -f https://k8s.io/examples/application/guestbook/frontend-service.yaml
   ```

<!--
1. Query the list of Services to verify that the frontend Service is running:
-->
2. 查詢 Service 列表以驗證前端服務正在運行:

   ```shell
   kubectl get services
   ```

   <!--
   The response should be similar to this:
   -->
   響應應該與此類似：

   ```
   NAME             TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)    AGE
   frontend         ClusterIP   10.97.28.230    <none>        80/TCP     19s
   kubernetes       ClusterIP   10.96.0.1       <none>        443/TCP    3d19h
   redis-follower   ClusterIP   10.110.162.42   <none>        6379/TCP   5m48s
   redis-leader     ClusterIP   10.103.78.24    <none>        6379/TCP   11m
   ```

<!--
### Viewing the Frontend Service via `kubectl port-forward`
-->
### 通過 `kubectl port-forward` 查看前端服務   {#viewing-the-frontend-service-via-kubectl-port-forward}

<!--
1. Run the following command to forward port `8080` on your local machine to port `80` on the service.
-->
1. 運行以下命令將本機的 `8080` 端口轉發到服務的 `80` 端口。

   ```shell
   kubectl port-forward svc/frontend 8080:80
   ```

   <!--
   The response should be similar to this:
   -->
   響應應該與此類似：

   ```
   Forwarding from 127.0.0.1:8080 -> 80
   Forwarding from [::1]:8080 -> 80
   ```

<!--
1. load the page [http://localhost:8080](http://localhost:8080) in your browser to view your guestbook.
-->
2. 在瀏覽器中加載 [http://localhost:8080](http://localhost:8080) 頁面以查看 Guestbook。

<!--
### Viewing the Frontend Service via `LoadBalancer`
-->
### 通過 `LoadBalancer` 查看前端服務   {#viewing-the-frontend-service-via-loadbalancer}

<!--
If you deployed the `frontend-service.yaml` manifest with type: `LoadBalancer`
you need to find the IP address to view your Guestbook.
-->
如果你部署了 `frontend-service.yaml`，需要找到用來查看 Guestbook 的 IP 地址。

<!--
1. Run the following command to get the IP address for the frontend Service.
-->
1. 運行以下命令以獲取前端服務的 IP 地址。

   ```shell
   kubectl get service frontend
   ```

   <!--
   The response should be similar to this:
   -->
   響應應該與此類似：

   ```
   NAME       TYPE           CLUSTER-IP      EXTERNAL-IP        PORT(S)        AGE
   frontend   LoadBalancer   10.51.242.136   109.197.92.229     80:32372/TCP   1m
   ```

<!--
1. Copy the external IP address, and load the page in your browser to view your guestbook.
-->
2. 複製這裏的外部 IP 地址，然後在瀏覽器中加載頁面以查看留言板。

{{< note >}}
<!--
Try adding some guestbook entries by typing in a message, and clicking Submit.
The message you typed appears in the frontend. This message indicates that
data is successfully added to Redis through the Services you created earlier.
-->
嘗試通過輸入消息並點擊 Submit 來添加一些留言板條目。
你所輸入的消息會在前端顯示。這一消息表明數據被通過你之前所創建的
Service 添加到 Redis 存儲中。
{{< /note >}}

<!--
## Scale the Web Frontend
-->
## 擴展 Web 前端   {#scale-the-web-frontend}

<!--
You can scale up or down as needed because your servers are defined as a
Service that uses a Deployment controller.
-->
你可以根據需要執行伸縮操作，這是因爲伺服器本身被定義爲使用一個
Deployment 控制器的 Service。

<!--
1. Run the following command to scale up the number of frontend Pods:
-->
1. 運行以下命令擴展前端 Pod 的數量：

   ```shell
   kubectl scale deployment frontend --replicas=5
   ```

<!--
1. Query the list of Pods to verify the number of frontend Pods running:
-->
2. 查詢 Pod 列表驗證正在運行的前端 Pod 的數量：

   ```shell
   kubectl get pods
   ```

   <!--
   The response should look similar to this:
   -->
   響應應該類似於這樣：

   ```
   NAME                             READY   STATUS    RESTARTS   AGE
   frontend-85595f5bf9-5df5m        1/1     Running   0          83s
   frontend-85595f5bf9-7zmg5        1/1     Running   0          83s
   frontend-85595f5bf9-cpskg        1/1     Running   0          15m
   frontend-85595f5bf9-l2l54        1/1     Running   0          14m
   frontend-85595f5bf9-l9c8z        1/1     Running   0          14m
   redis-follower-dddfbdcc9-82sfr   1/1     Running   0          97m
   redis-follower-dddfbdcc9-qrt5k   1/1     Running   0          97m
   redis-leader-fb76b4755-xjr2n     1/1     Running   0          108m
   ```

<!--
1. Run the following command to scale down the number of frontend Pods:
-->
3. 運行以下命令縮小前端 Pod 的數量：

   ```shell
   kubectl scale deployment frontend --replicas=2
   ```

<!--
1. Query the list of Pods to verify the number of frontend Pods running:
-->
4. 查詢 Pod 列表驗證正在運行的前端 Pod 的數量：

   ```shell
   kubectl get pods
   ```

   <!--
   The response should look similar to this:
   -->
   響應應該類似於這樣：

   ```
   NAME                             READY   STATUS    RESTARTS   AGE
   frontend-85595f5bf9-cpskg        1/1     Running   0          16m
   frontend-85595f5bf9-l9c8z        1/1     Running   0          15m
   redis-follower-dddfbdcc9-82sfr   1/1     Running   0          98m
   redis-follower-dddfbdcc9-qrt5k   1/1     Running   0          98m
   redis-leader-fb76b4755-xjr2n     1/1     Running   0          109m
   ```

## {{% heading "cleanup" %}}

<!--
Deleting the Deployments and Services also deletes any running Pods. Use
labels to delete multiple resources with one command.
-->
刪除 Deployments 和服務還會刪除正在運行的 Pod。
使用標籤用一個命令刪除多個資源。

<!--
1. Run the following commands to delete all Pods, Deployments, and Services.
-->
1. 運行以下命令以刪除所有 Pod、Deployment 和 Service。

   ```shell
   kubectl delete deployment -l app=redis
   kubectl delete service -l app=redis
   kubectl delete deployment frontend
   kubectl delete service frontend
   ```

   <!--
   The responses should be:
   -->
   響應應該是：

   ```
   deployment.apps "redis-follower" deleted
   deployment.apps "redis-leader" deleted
   deployment.apps "frontend" deleted
   service "frontend" deleted
   ```

<!--
1. Query the list of Pods to verify that no Pods are running:
-->
2. 查詢 Pod 列表，確認沒有 Pod 在運行：

   ```shell
   kubectl get pods
   ```

   <!--
   The response should be this:
   -->
   響應應該是：

   ```
   No resources found in default namespace.
   ```

## {{% heading "whatsnext" %}}

<!--
* Complete the [Kubernetes Basics](/docs/tutorials/kubernetes-basics/) Interactive Tutorials
* Use Kubernetes to create a blog using [Persistent Volumes for MySQL and Wordpress](/docs/tutorials/stateful-application/mysql-wordpress-persistent-volume/#visit-your-new-wordpress-blog)
* Read more about [connecting applications with services](/docs/tutorials/services/connect-applications-service/)
* Read more about [using labels effectively](/docs/concepts/overview/working-with-objects/labels/#using-labels-effectively)
-->
* 完成 [Kubernetes 基礎](/zh-cn/docs/tutorials/kubernetes-basics/) 交互式教程
* 使用 Kubernetes 創建一個博客，使用
  [MySQL 和 Wordpress 的持久卷](/zh-cn/docs/tutorials/stateful-application/mysql-wordpress-persistent-volume/#visit-your-new-wordpress-blog)
* 進一步閱讀[使用 Service 連接到應用](/zh-cn/docs/tutorials/services/connect-applications-service/)
* 進一步閱讀[有效使用標籤](/zh-cn/docs/concepts/overview/working-with-objects/labels/#using-labels-effectively)
