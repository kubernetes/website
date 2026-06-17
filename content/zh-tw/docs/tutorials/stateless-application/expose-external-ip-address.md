---
title: 公開外部 IP 位址以存取叢集中的應用程式
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
本頁說明如何建立會公開外部 IP 位址的 Kubernetes Service 物件。

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
* 安裝 [kubectl](/docs/tasks/tools/)。
* 使用 Google Kubernetes Engine 或 Amazon Web Services 等雲端供應商建立 Kubernetes 叢集。
  本教學會建立一個[外部負載平衡器](/docs/tasks/access-application-cluster/create-external-load-balancer/)，
  這需要雲端供應商。
* 設定 `kubectl` 與 Kubernetes API 伺服器通訊。相關操作說明請參閱雲端供應商的文件。

## {{% heading "objectives" %}}

<!--
* Run five instances of a Hello World application.
* Create a Service object that exposes an external IP address.
* Use the Service object to access the running application.
-->
* 執行 Hello World 應用程式的五個執行個體。
* 建立用來公開 Deployment 的 Service 物件。
* 使用 Service 物件存取執行中的應用程式。

<!-- lessoncontent -->

<!--
## Creating a service for an application running in five pods
-->
## 為在五個 Pod 中執行的應用程式建立 Service {#creating-a-service-for-an-app-running-in-five-pods}

<!--
1. Run a Hello World application in your cluster:
-->
1. 在叢集中執行 Hello World 應用程式：

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
   前述指令會建立一個
   {{< glossary_tooltip text="Deployment" term_id="deployment" >}}
   以及一個相關聯的
   {{< glossary_tooltip term_id="replica-set" text="ReplicaSet" >}}。
   ReplicaSet 包含五個
   {{< glossary_tooltip text="Pod" term_id="pod" >}}，
   每個 Pod 都會執行 Hello World 應用程式。

<!--
1. Display information about the Deployment:
-->
1. 顯示 Deployment 的相關資訊：

   ```shell
   kubectl get deployments hello-world
   kubectl describe deployments hello-world
   ```

<!--
1. Display information about your ReplicaSet objects:
-->
1. 顯示 ReplicaSet 物件的相關資訊：

   ```shell
   kubectl get replicasets
   kubectl describe replicasets
   ```

<!--
1. Create a Service object that exposes the deployment:
-->
1. 建立用來公開 Deployment 的 Service 物件：

   ```shell
   kubectl expose deployment hello-world --type=LoadBalancer --name=my-service
   ```

<!--
1. Display information about the Service:
-->
1. 顯示 Service 的相關資訊：

   ```shell
   kubectl get services my-service
   ```

   <!--
   The output is similar to:
   -->
   輸出會類似如下：

   ```console
   NAME         TYPE           CLUSTER-IP     EXTERNAL-IP      PORT(S)    AGE
   my-service   LoadBalancer   10.3.245.137   104.198.205.71   8080/TCP   54s
   ```

   {{< note >}}

   <!--
   The `type=LoadBalancer` service is backed by external cloud providers, which is not covered in this example. Please refer to [setting `type: LoadBalancer` for your Service](/docs/concepts/services-networking/service/#loadbalancer) for the details.
   -->
   `type=LoadBalancer` 服務由外部雲端供應商提供支援，本範例不涵蓋這部分。
   詳細資訊請參閱[為您的 Service 設定 `type: LoadBalancer`](/docs/concepts/services-networking/service/#loadbalancer)。

   {{< /note >}}

   {{< note >}}

   <!--
   If the external IP address is shown as \<pending\>, wait for a minute and enter the same command again.
   -->
   如果外部 IP 位址顯示為 \<pending\>，請等待一分鐘後再次輸入相同指令。

   {{< /note >}}

<!--
1. Display detailed information about the Service:
-->
1. 顯示 Service 的詳細資訊：

   ```shell
   kubectl describe services my-service
   ```

   <!--
   The output is similar to:
   -->
   輸出會類似如下：

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
   記下此服務公開的外部 IP 位址（`LoadBalancer Ingress`）。
   在本範例中，外部 IP 位址是 104.198.205.71。
   同時也記下 `Port` 與 `NodePort` 的值。
   在本範例中，`Port` 是 8080，而 `NodePort` 是 32377。

<!--
1. In the preceding output, you can see that the service has several endpoints:
   10.0.0.6:8080,10.0.1.6:8080,10.0.1.7:8080 + 2 more. These are internal
   addresses of the pods that are running the Hello World application. To
   verify these are pod addresses, enter this command:
-->
1. 在前述輸出中，您可以看到此服務有多個端點：
   10.0.0.6:8080、10.0.1.6:8080、10.0.1.7:8080 以及另外 2 個。
   這些都是正在執行 Hello World 應用程式之 Pod 的內部位址。
   若要驗證這些是 Pod 位址，請輸入此指令：

   ```shell
   kubectl get pods --output=wide
   ```

   <!--
   The output is similar to:
   -->
   輸出會類似如下：

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
1. 使用外部 IP 位址（`LoadBalancer Ingress`）存取 Hello World 應用程式：

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
   其中 `<external-ip>` 是您的 Service 的外部 IP 位址（`LoadBalancer Ingress`），
   而 `<port>` 是 Service 描述中 `Port` 的值。
   如果您使用 minikube，輸入 `minikube service my-service`
   會自動在瀏覽器中開啟 Hello World 應用程式。

   <!--
   The response to a successful request is a hello message:
   -->
   成功請求的回應是一則 hello 訊息：

   ```console
   Hello, world!
   Version: 2.0.0
   Hostname: 0bd46b45f32f
   ```

## {{% heading "cleanup" %}}

<!--
To delete the Service, enter this command:
-->
若要刪除 Service，請輸入此指令：

```shell
kubectl delete services my-service
```

<!--
To delete the Deployment, the ReplicaSet, and the Pods that are running
the Hello World application, enter this command:
-->
若要刪除 Deployment，以及其建立的 ReplicaSet 和正在執行 Hello World 應用程式的 Pod，請輸入此指令：

```shell
kubectl delete deployment hello-world
```

## {{% heading "whatsnext" %}}

<!--
Learn more about
[connecting applications with services](/docs/tutorials/services/connect-applications-service/).
-->
進一步了解[使用 Service 連接應用程式](/docs/tutorials/services/connect-applications-service/)。
