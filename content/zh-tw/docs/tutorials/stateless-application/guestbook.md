---
title: "範例：使用 Redis 部署 PHP 留言板應用程式"
reviewers:
- ahmetb
- jimangel
content_type: tutorial
weight: 20
card:
  name: tutorials
  weight: 30
  title: "無狀態範例：使用 Redis 的 PHP 留言板"
min-kubernetes-server-version: v1.14
source: https://cloud.google.com/kubernetes-engine/docs/tutorials/guestbook
---

<!-- overview -->

<!--
This tutorial shows you how to build and deploy a simple _(not production
ready)_, multi-tier web application using Kubernetes and
[Docker](https://www.docker.com/). This example consists of the following
components:
-->
本教學說明如何使用 Kubernetes 和 [Docker](https://www.docker.com/)
建置並部署一個簡單的（_尚未達生產環境可用_）多層 Web 應用程式。
此範例由下列元件組成：

<!--
* A single-instance [Redis](https://www.redis.io/) to store guestbook entries
* Multiple web frontend instances
-->
* 用來儲存留言板項目的單一執行個體 [Redis](https://www.redis.io/)
* 多個 Web 前端執行個體

## {{% heading "objectives" %}}

<!--
* Start up a Redis leader.
* Start up two Redis followers.
* Start up the guestbook frontend.
* Expose and view the Frontend Service.
* Clean up.
-->
* 啟動 Redis leader。
* 啟動兩個 Redis follower。
* 啟動留言板前端。
* 公開並檢視前端 Service。
* 清理。

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

{{< version-check >}}

<!-- lessoncontent -->

<!--
## Start up the Redis Database
-->
## 啟動 Redis 資料庫 {#start-up-the-redis-database}

<!--
The guestbook application uses Redis to store its data.
-->
留言板應用程式使用 Redis 儲存資料。

<!--
### Creating the Redis Deployment
-->
### 建立 Redis Deployment {#creating-the-redis-deployment}

<!--
The manifest file, included below, specifies a Deployment controller that runs a single replica Redis Pod.
-->
下方的設定檔指定了一個 Deployment 控制器，用來執行單一副本的 Redis Pod。

{{% code_sample file="application/guestbook/redis-leader-deployment.yaml" %}}

<!--
1. Launch a terminal window in the directory you downloaded the manifest files.
1. Apply the Redis Deployment from the `redis-leader-deployment.yaml` file:
-->
1. 在您下載設定檔的目錄中開啟終端機視窗。
1. 從 `redis-leader-deployment.yaml` 檔案套用 Redis Deployment：

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
1. 查詢 Pod 清單，確認 Redis Pod 正在執行：

   ```shell
   kubectl get pods
   ```

   <!--
   The response should be similar to this:
   -->
   回應應類似如下：

   ```
   NAME                           READY   STATUS    RESTARTS   AGE
   redis-leader-fb76b4755-xjr2n   1/1     Running   0          13s
   ```

<!--
1. Run the following command to view the logs from the Redis leader Pod:
-->
1. 執行下列指令以檢視 Redis leader Pod 的日誌：

   ```shell
   kubectl logs -f deployment/redis-leader
   ```

<!--
### Creating the Redis leader Service
-->
### 建立 Redis leader Service {#creating-the-redis-leader-service}

<!--
The guestbook application needs to communicate to the Redis to write its data.
You need to apply a [Service](/docs/concepts/services-networking/service/) to
proxy the traffic to the Redis Pod. A Service defines a policy to access the
Pods.
-->
留言板應用程式需要與 Redis 通訊以寫入資料。
您需要套用一個 [Service](/docs/concepts/services-networking/service/)，
將流量代理到 Redis Pod。Service 會定義存取 Pod 的策略。

{{% code_sample file="application/guestbook/redis-leader-service.yaml" %}}

<!--
1. Apply the Redis Service from the following `redis-leader-service.yaml` file:
-->
1. 從下列 `redis-leader-service.yaml` 檔案套用 Redis Service：

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
1. 查詢 Service 清單，確認 Redis Service 正在執行：

   ```shell
   kubectl get service
   ```

   <!--
   The response should be similar to this:
   -->
   回應應類似如下：

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
此設定檔會建立名為 `redis-leader` 的 Service，並包含一組符合先前定義之標籤的標籤，
因此 Service 會將網路流量路由到 Redis Pod。
{{< /note >}}

<!--
### Set up Redis followers

Although the Redis leader is a single Pod, you can make it highly available
and meet traffic demands by adding a few Redis followers, or replicas.
-->
### 設定 Redis follower {#set-up-redis-followers}

雖然 Redis leader 是單一 Pod，
但您可以新增幾個 Redis follower（也就是副本）來提高可用性並滿足流量需求。

{{% code_sample file="application/guestbook/redis-follower-deployment.yaml" %}}

<!--
1. Apply the Redis Deployment from the following `redis-follower-deployment.yaml` file:
-->
1. 從下列 `redis-follower-deployment.yaml` 檔案套用 Redis Deployment：

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
1. 查詢 Pod 清單，確認兩個 Redis follower 副本正在執行：

   ```shell
   kubectl get pods
   ```

   <!--
   The response should be similar to this:
   -->
   回應應類似如下：

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
### 建立 Redis follower Service {#creating-the-redis-follower-service}

留言板應用程式需要與 Redis follower 通訊以讀取資料。
為了讓 Redis follower 可以被發現，您必須設定另一個
[Service](/docs/concepts/services-networking/service/)。

{{% code_sample file="application/guestbook/redis-follower-service.yaml" %}}

<!--
1. Apply the Redis Service from the following `redis-follower-service.yaml` file:
-->
1. 從下列 `redis-follower-service.yaml` 檔案套用 Redis Service：

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
1. 查詢 Service 清單，確認 Redis Service 正在執行：

   ```shell
   kubectl get service
   ```

   <!--
   The response should be similar to this:
   -->
   回應應類似如下：

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
此設定檔會建立名為 `redis-follower` 的 Service，並包含一組符合先前定義之標籤的標籤，
因此 Service 會將網路流量路由到 Redis Pod。
{{< /note >}}

<!--
## Set up and Expose the Guestbook Frontend
-->
## 設定並公開留言板前端 {#set-up-and-expose-the-guestbook-frontend}

<!--
Now that you have the Redis storage of your guestbook up and running, start
the guestbook web servers. Like the Redis followers, the frontend is deployed
using a Kubernetes Deployment.

The guestbook app uses a PHP frontend. It is configured to communicate with
either the Redis follower or leader Services, depending on whether the request
is a read or a write. The frontend exposes a JSON interface, and serves a
jQuery-Ajax-based UX.
-->
現在您的留言板 Redis 儲存已經啟動並執行，接著啟動留言板 Web 伺服器。
和 Redis follower 一樣，前端會使用 Kubernetes Deployment 部署。

留言板應用程式使用 PHP 前端。
它會根據請求是讀取或寫入，設定為與 Redis follower 或 leader Service 通訊。
前端會公開 JSON 介面，並提供以 jQuery-Ajax 為基礎的使用者體驗。

<!--
### Creating the Guestbook Frontend Deployment
-->
### 建立留言板前端 Deployment {#creating-the-guestbook-frontend-deployment}

{{% code_sample file="application/guestbook/frontend-deployment.yaml" %}}

<!--
1. Apply the frontend Deployment from the `frontend-deployment.yaml` file:
-->
1. 從 `frontend-deployment.yaml` 檔案套用前端 Deployment：

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
1. 查詢 Pod 清單，確認三個前端副本正在執行：

   ```shell
   kubectl get pods -l app=guestbook -l tier=frontend
   ```

   <!--
   The response should be similar to this:
   -->
   回應應類似如下：

   ```
   NAME                        READY   STATUS    RESTARTS   AGE
   frontend-85595f5bf9-5tqhb   1/1     Running   0          47s
   frontend-85595f5bf9-qbzwm   1/1     Running   0          47s
   frontend-85595f5bf9-zchwc   1/1     Running   0          47s
   ```

<!--
### Creating the Frontend Service
-->
### 建立前端 Service {#creating-the-frontend-service}

<!--
The `Redis` Services you applied is only accessible within the Kubernetes
cluster because the default type for a Service is
[ClusterIP](/docs/concepts/services-networking/service/#publishing-services-service-types).
`ClusterIP` provides a single IP address for the set of Pods the Service is
pointing to. This IP address is accessible only within the cluster.
-->
您套用的 `Redis` Service 只能從 Kubernetes 叢集內存取，
因為 Service 的預設型別是
[ClusterIP](/docs/concepts/services-networking/service/#publishing-services-service-types)。
`ClusterIP` 會為 Service 指向的一組 Pod 提供單一 IP 位址。
這個 IP 位址只能從叢集內存取。

<!--
If you want guests to be able to access your guestbook, you must configure the
frontend Service to be externally visible, so a client can request the Service
from outside the Kubernetes cluster. However a Kubernetes user can use
`kubectl port-forward` to access the service even though it uses a
`ClusterIP`.
-->
如果您想讓訪客能夠存取留言板，
必須將前端 Service 設定為可從外部看見，
如此一來用戶端就能從 Kubernetes 叢集外向此 Service 發出請求。
不過，即使它使用 `ClusterIP`，Kubernetes 使用者仍可透過
`kubectl port-forward` 存取此服務。

{{< note >}}
<!--
Some cloud providers, like Google Compute Engine or Google Kubernetes Engine,
support external load balancers. If your cloud provider supports load
balancers and you want to use it, uncomment `type: LoadBalancer`.
-->
某些雲端供應商（例如 Google Compute Engine 或 Google Kubernetes Engine）
支援外部負載平衡器。如果您的雲端供應商支援負載平衡器且您想使用它，
請取消 `type: LoadBalancer` 的註解。
{{< /note >}}

{{% code_sample file="application/guestbook/frontend-service.yaml" %}}

<!--
1. Apply the frontend Service from the `frontend-service.yaml` file:
-->
1. 從 `frontend-service.yaml` 檔案套用前端 Service：

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
1. 查詢 Service 清單，確認前端 Service 正在執行：

   ```shell
   kubectl get services
   ```

   <!--
   The response should be similar to this:
   -->
   回應應類似如下：

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
### 透過 `kubectl port-forward` 檢視前端 Service {#viewing-the-frontend-service-via-kubectl-port-forward}

<!--
1. Run the following command to forward port `8080` on your local machine to port `80` on the service.
-->
1. 執行下列指令，將本機的 `8080` 連接埠轉送到服務上的 `80` 連接埠。

   ```shell
   kubectl port-forward svc/frontend 8080:80
   ```

   <!--
   The response should be similar to this:
   -->
   回應應類似如下：

   ```
   Forwarding from 127.0.0.1:8080 -> 80
   Forwarding from [::1]:8080 -> 80
   ```

<!--
1. Load the page [http://localhost:8080](http://localhost:8080) in your browser to view your guestbook.
-->
1. 在瀏覽器中載入 [http://localhost:8080](http://localhost:8080) 頁面以檢視留言板。

<!--
### Viewing the Frontend Service via `LoadBalancer`
-->
### 透過 `LoadBalancer` 檢視前端 Service {#viewing-the-frontend-service-via-loadbalancer}

<!--
If you deployed the `frontend-service.yaml` manifest with type: `LoadBalancer`
you need to find the IP address to view your Guestbook.
-->
如果您以 `LoadBalancer` 型別部署 `frontend-service.yaml` 設定檔，
需要找出 IP 位址才能檢視留言板。

<!--
1. Run the following command to get the IP address for the frontend Service.
-->
1. 執行下列指令取得前端 Service 的 IP 位址。

   ```shell
   kubectl get service frontend
   ```

   <!--
   The response should be similar to this:
   -->
   回應應類似如下：

   ```
   NAME       TYPE           CLUSTER-IP      EXTERNAL-IP        PORT(S)        AGE
   frontend   LoadBalancer   10.51.242.136   109.197.92.229     80:32372/TCP   1m
   ```

<!--
1. Copy the external IP address, and load the page in your browser to view your guestbook.
-->
1. 複製外部 IP 位址，並在瀏覽器中載入頁面以檢視留言板。

{{< note >}}
<!--
Try adding some guestbook entries by typing in a message, and clicking Submit.
The message you typed appears in the frontend. This message indicates that
data is successfully added to Redis through the Services you created earlier.
-->
試著輸入訊息並點選 Submit，新增一些留言板項目。
您輸入的訊息會出現在前端。
這則訊息表示資料已透過您先前建立的 Service 成功新增到 Redis。
{{< /note >}}

<!--
## Scale the Web Frontend
-->
## 擴縮 Web 前端 {#scale-the-web-frontend}

<!--
You can scale up or down as needed because your servers are defined as a
Service that uses a Deployment controller.
-->
由於您的伺服器被定義為使用 Deployment 控制器的 Service，
因此您可以視需要擴展或縮減。

<!--
1. Run the following command to scale up the number of frontend Pods:
-->
1. 執行下列指令擴展前端 Pod 的數量：

   ```shell
   kubectl scale deployment frontend --replicas=5
   ```

<!--
1. Query the list of Pods to verify the number of frontend Pods running:
-->
1. 查詢 Pod 清單，確認正在執行的前端 Pod 數量：

   ```shell
   kubectl get pods
   ```

   <!--
   The response should look similar to this:
   -->
   回應應類似如下：

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
1. 執行下列指令縮減前端 Pod 的數量：

   ```shell
   kubectl scale deployment frontend --replicas=2
   ```

<!--
1. Query the list of Pods to verify the number of frontend Pods running:
-->
1. 查詢 Pod 清單，確認正在執行的前端 Pod 數量：

   ```shell
   kubectl get pods
   ```

   <!--
   The response should look similar to this:
   -->
   回應應類似如下：

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
刪除 Deployment 和 Service 也會刪除所有執行中的 Pod。
請使用標籤透過一個指令刪除多個資源。

<!--
1. Run the following commands to delete all Pods, Deployments, and Services.
-->
1. 執行下列指令刪除所有 Pod、Deployment 和 Service。

   ```shell
   kubectl delete deployment -l app=redis
   kubectl delete service -l app=redis
   kubectl delete deployment frontend
   kubectl delete service frontend
   ```

   <!--
   The response should look similar to this:
   -->
   回應應類似如下：

   ```
   deployment.apps "redis-follower" deleted
   deployment.apps "redis-leader" deleted
   deployment.apps "frontend" deleted
   service "frontend" deleted
   ```

<!--
1. Query the list of Pods to verify that no Pods are running:
-->
1. 查詢 Pod 清單，確認沒有 Pod 正在執行：

   ```shell
   kubectl get pods
   ```

   <!--
   The response should look similar to this:
   -->
   回應應類似如下：

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
* 完成 [Kubernetes 基礎](/docs/tutorials/kubernetes-basics/)互動式教學
* 使用 Kubernetes 搭配
  [MySQL 和 Wordpress 的 Persistent Volume](/docs/tutorials/stateful-application/mysql-wordpress-persistent-volume/#visit-your-new-wordpress-blog)
  建立部落格
* 閱讀更多關於[使用 Service 連接應用程式](/docs/tutorials/services/connect-applications-service/)的資訊
* 閱讀更多關於[有效使用標籤](/docs/concepts/overview/working-with-objects/labels/#using-labels-effectively)的資訊
