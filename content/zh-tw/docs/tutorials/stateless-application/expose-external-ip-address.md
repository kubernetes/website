---
title: 公開外部 IP 地址以訪問集羣中的應用
content_type: tutorial
weight: 10
---
<!--
title: Exposing an External IP Address to Access an Application in a Cluster
content_type: tutorial
weight: 10
-->

<!-- overview -->

<!--
This page shows how to create a Kubernetes Service object that exposes an
external IP address.
-->
此頁面顯示如何創建公開外部 IP 地址的 Kubernetes 服務對象。

## {{% heading "prerequisites" %}}

<!--
* Install [kubectl](/docs/tasks/tools/).
* Use a cloud provider like Google Kubernetes Engine or Amazon Web Services to
  create a Kubernetes cluster. This tutorial creates an
  [external load balancer](/docs/tasks/access-application-cluster/create-external-load-balancer/),
  which requires a cloud provider.
* Configure `kubectl` to communicate with your Kubernetes API server. For instructions, see the
  documentation for your cloud provider.
-->
* 安裝 [kubectl](/zh-cn/docs/tasks/tools/)。
* 使用 Google Kubernetes Engine 或 Amazon Web Services 等雲供應商創建 Kubernetes 集羣。
  本教程創建了一個[外部負載均衡器](/zh-cn/docs/tasks/access-application-cluster/create-external-load-balancer/)，
  需要雲供應商。
* 配置 `kubectl` 與 Kubernetes API 服務器通信。有關說明，請參閱雲供應商文檔。

## {{% heading "objectives" %}}

<!--
* Run five instances of a Hello World application.
* Create a Service object that exposes an external IP address.
* Use the Service object to access the running application.
-->
* 運行 Hello World 應用的五個實例。
* 創建一個公開外部 IP 地址的 Service 對象。
* 使用 Service 對象訪問正在運行的應用。

<!-- lessoncontent -->

<!--
## Creating a service for an application running in five pods
-->
## 爲在五個 Pod 中運行的應用創建服務   {#creating-a-service-for-an-app-running-in-five-pods}

<!--
1. Run a Hello World application in your cluster:
-->
1. 在集羣中運行 Hello World 應用：

   {{% code_sample file="service/load-balancer-example.yaml" %}}

   ```shell
   kubectl apply -f https://k8s.io/examples/service/load-balancer-example.yaml
   ```

   <!--
   The preceding command creates a
   {{< glossary_tooltip text="Deployment" term_id="deployment" >}}
   and an associated
   {{< glossary_tooltip term_id="replica-set" text="ReplicaSet" >}}.
   The ReplicaSet has five
   {{< glossary_tooltip text="Pods" term_id="pod" >}}
   each of which runs the Hello World application.
   -->
   
   前面的命令創建一個
   {{< glossary_tooltip text="Deployment" term_id="deployment" >}}
   對象和一個關聯的
   {{< glossary_tooltip term_id="replica-set" text="ReplicaSet" >}} 對象。
   ReplicaSet 有五個 {{< glossary_tooltip text="Pod" term_id="pod" >}}，
   每個都運行 Hello World 應用。

<!--
1. Display information about the Deployment:
-->
2. 顯示有關 Deployment 的信息：

   ```shell
   kubectl get deployments hello-world
   kubectl describe deployments hello-world
   ```

<!--
1. Display information about your ReplicaSet objects:
-->
3. 顯示有關 ReplicaSet 對象的信息：

   ```shell
   kubectl get replicasets
   kubectl describe replicasets
   ```

<!--
1. Create a Service object that exposes the deployment:
-->
4. 創建公開 Deployment 的 Service 對象：

   ```shell
   kubectl expose deployment hello-world --type=LoadBalancer --name=my-service
   ```

<!--
1. Display information about the Service:
-->
5. 顯示有關 Service 的信息：

   ```shell
   kubectl get services my-service
   ```

   <!--
   The output is similar to this:
   -->

   輸出類似於：

   ```console
   NAME         TYPE           CLUSTER-IP     EXTERNAL-IP      PORT(S)    AGE
   my-service   LoadBalancer   10.3.245.137   104.198.205.71   8080/TCP   54s
   ```

   {{< note >}}
   <!--
   The `type=LoadBalancer` service is backed by external cloud providers, which is not covered in this example. Please refer to [setting `type: LoadBalancer` for your Service](/docs/concepts/services-networking/service/#loadbalancer) for the details.
   -->
   `type=LoadBalancer` 服務由外部雲服務提供商提供支持，本例中不包含此部分，
   詳細信息請參考[爲你的 Service 設置 `type: LoadBalancer`](/zh-cn/docs/concepts/services-networking/service/#loadbalancer)。
   {{< /note >}}

   {{< note >}}
   <!--
   If the external IP address is shown as \<pending\>, wait for a minute and enter the same command again.
   -->
   如果外部 IP 地址顯示爲 \<pending\>，請等待一分鐘再次輸入相同的命令。
   {{< /note >}}

<!--
1. Display detailed information about the Service:
-->
6. 顯示有關 Service 的詳細信息：

   ```shell
   kubectl describe services my-service
   ```

   <!--
   The output is similar to this:
   -->

   輸出類似於：

   ```console
   Name:           my-service
   Namespace:      default
   Labels:         app.kubernetes.io/name=load-balancer-example
   Annotations:    <none>
   Selector:       app.kubernetes.io/name=load-balancer-example
   Type:           LoadBalancer
   IP:             10.3.245.137
   LoadBalancer Ingress:   104.198.205.71
   Port:           <unset> 8080/TCP
   NodePort:       <unset> 32377/TCP
   Endpoints:      10.0.0.6:8080,10.0.1.6:8080,10.0.1.7:8080 + 2 more...
   Session Affinity:   None
   Events:         <none>
   ```

   <!--
   Make a note of the external IP address (`LoadBalancer Ingress`) exposed by
   your service. In this example, the external IP address is 104.198.205.71.
   Also note the value of `Port` and `NodePort`. In this example, the `Port`
   is 8080 and the `NodePort` is 32377.
   -->

   記下服務公開的外部 IP 地址（`LoadBalancer Ingress`）。
   在本例中，外部 IP 地址是 104.198.205.71。還要注意 `Port` 和 `NodePort` 的值。
   在本例中，`Port` 是 8080，`NodePort` 是 32377。

<!--
1. In the preceding output, you can see that the service has several endpoints:
   10.0.0.6:8080,10.0.1.6:8080,10.0.1.7:8080 + 2 more. These are internal
   addresses of the pods that are running the Hello World application. To
   verify these are pod addresses, enter this command:
-->
7. 在前面的輸出中，你可以看到服務有幾個端點：
   10.0.0.6:8080、10.0.1.6:8080、10.0.1.7:8080 和另外兩個，
   這些都是正在運行 Hello World 應用的 Pod 的內部地址。
   要驗證這些是 Pod 地址，請輸入以下命令：

   ```shell
   kubectl get pods --output=wide
   ```

   <!--
   The output is similar to this:
   -->

   輸出類似於：

   ```console
   NAME                         ...  IP         NODE
   hello-world-2895499144-1jaz9 ...  10.0.1.6   gke-cluster-1-default-pool-e0b8d269-1afc
   hello-world-2895499144-2e5uh ...  10.0.1.8   gke-cluster-1-default-pool-e0b8d269-1afc
   hello-world-2895499144-9m4h1 ...  10.0.0.6   gke-cluster-1-default-pool-e0b8d269-5v7a
   hello-world-2895499144-o4z13 ...  10.0.1.7   gke-cluster-1-default-pool-e0b8d269-1afc
   hello-world-2895499144-segjf ...  10.0.2.5   gke-cluster-1-default-pool-e0b8d269-cpuc
   ```
<!--
1. Use the external IP address (`LoadBalancer Ingress`) to access the Hello
   World application:
-->
8. 使用外部 IP 地址（`LoadBalancer Ingress`）訪問 Hello World 應用:

   ```shell
   curl http://<external-ip>:<port>
   ```

   <!--
   where `<external-ip>` is the external IP address (`LoadBalancer Ingress`)
   of your Service, and `<port>` is the value of `Port` in your Service
   description.
   If you are using minikube, typing `minikube service my-service` will
   automatically open the Hello World application in a browser.
   -->

   其中 `<external-ip>` 是你的服務的外部 IP 地址（`LoadBalancer Ingress`），
   `<port>` 是你的服務描述中的 `port` 的值。
   如果你正在使用 minikube，輸入 `minikube service my-service`
   將在瀏覽器中自動打開 Hello World 應用。

   <!--
   The response to a successful request is a hello message:
   -->

   成功請求的響應是一條問候消息：

   ```shell
   Hello, world!
   Version: 2.0.0
   Hostname: 0bd46b45f32f
   ```

## {{% heading "cleanup" %}}

<!--
To delete the Service, enter this command:
-->
要刪除 Service，請輸入以下命令：

```shell
kubectl delete services my-service
```

<!--
To delete the Deployment, the ReplicaSet, and the Pods that are running
the Hello World application, enter this command:
-->
要刪除正在運行 Hello World 應用的 Deployment、ReplicaSet 和 Pod，請輸入以下命令：

```shell
kubectl delete deployment hello-world
```

## {{% heading "whatsnext" %}}

<!--
Learn more about
[connecting applications with services](/docs/tutorials/services/connect-applications-service/).
-->
進一步瞭解[使用 Service 連接到應用](/zh-cn/docs/tutorials/services/connect-applications-service/)。
