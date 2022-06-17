---
title: 使用服務來訪問叢集中的應用
content_type: tutorial
weight: 60
---

<!--
title: Use a Service to Access an Application in a Cluster
content_type: tutorial
weight: 60
-->

<!-- overview -->

<!--
This page shows how to create a Kubernetes Service object that external
clients can use to access an application running in a cluster. The Service
provides load balancing for an application that has two running instances.
-->
本文展示如何建立一個 Kubernetes 服務物件，能讓外部客戶端訪問在叢集中執行的應用。
該服務為一個應用的兩個執行例項提供負載均衡。

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

## {{% heading "objectives" %}}

<!--
* Run two instances of a Hello World application.
* Create a Service object that exposes a node port.
* Use the Service object to access the running application.
-->
* 執行 Hello World 應用的兩個例項。
* 建立一個服務物件來暴露 node port。
* 使用服務物件來訪問正在執行的應用。

<!-- lessoncontent -->

<!--
## Creating a service for an application running in two pods

Here is the configuration file for the application Deployment:
-->
## 為執行在兩個 pod 中的應用建立一個服務

這是應用程式部署的配置檔案：

{{< codenew file="service/access/hello-application.yaml" >}}

<!--
1. Run a Hello World application in your cluster:
   Create the application Deployment using the file above:
   ```shell
   kubectl apply -f https://k8s.io/examples/service/access/hello-application.yaml
   ```
   The preceding command creates a
   [Deployment](/docs/concepts/workloads/controllers/deployment/)
   object and an associated
   [ReplicaSet](/docs/concepts/workloads/controllers/replicaset/)
   object. The ReplicaSet has two
   [Pods](/docs/concepts/workloads/pods/pod/),
   each of which runs the Hello World application.
-->

1. 在你的叢集中執行一個 Hello World 應用：
   使用上面的檔案建立應用程式 Deployment：

   ```shell
   kubectl apply -f https://k8s.io/examples/service/access/hello-application.yaml
   ```

   上面的命令建立一個 [Deployment](/zh-cn/docs/concepts/workloads/controllers/deployment/) 物件
   和一個關聯的 [ReplicaSet](/zh-cn/docs/concepts/workloads/controllers/replicaset/) 物件。
   這個 ReplicaSet 有兩個 [Pod](/zh-cn/docs/concepts/workloads/pods/)，
   每個 Pod 都執行著 Hello World 應用。
  
<!--
1. Display information about the Deployment:
-->
2. 展示 Deployment 的資訊：

   ```shell
   kubectl get deployments hello-world
   kubectl describe deployments hello-world
   ```

<!--
1. Display information about your ReplicaSet objects:
-->
3. 展示你的 ReplicaSet 物件資訊：

   ```shell
   kubectl get replicasets
   kubectl describe replicasets
   ```

<!--
1. Create a Service object that exposes the deployment:
-->
4. 建立一個服務物件來暴露 Deployment：

   ```shell
   kubectl expose deployment hello-world --type=NodePort --name=example-service
   ```

<!--
1. Display information about the Service:
-->
5. 展示 Service 資訊：

   ```shell
   kubectl describe services example-service
   ```

   <!--
   The output is similar to this:
   -->
   輸出類似於：

   ```shell
   Name:                   example-service
   Namespace:              default
   Labels:                 run=load-balancer-example
   Annotations:            <none>
   Selector:               run=load-balancer-example
   Type:                   NodePort
   IP:                     10.32.0.16
   Port:                   <unset> 8080/TCP
   TargetPort:             8080/TCP
   NodePort:               <unset> 31496/TCP
   Endpoints:              10.200.1.4:8080,10.200.2.5:8080
   Session Affinity:       None
   Events:                 <none>
   ```

   <!--
   Make a note of the NodePort value for the service. For example,
   in the preceding output, the NodePort value is 31496.
   -->
   注意服務中的 NodePort 值。例如在上面的輸出中，NodePort 是 31496。

<!--
1. List the pods that are running the Hello World application:
-->
7. 列出執行 Hello World 應用的 Pod：

   ```shell
   kubectl get pods --selector="run=load-balancer-example" --output=wide
   ```

   <!--
   The output is similar to this:
   -->
   輸出類似於：

   ```shell
   NAME                           READY   STATUS    ...  IP           NODE
   hello-world-2895499144-bsbk5   1/1     Running   ...  10.200.1.4   worker1
   hello-world-2895499144-m1pwt   1/1     Running   ...  10.200.2.5   worker2
   ```
<!--
1. Get the public IP address of one of your nodes that is running
   a Hello World pod. How you get this address depends on how you set
   up your cluster. For example, if you are using Minikube, you can
   see the node address by running `kubectl cluster-info`. If you are
   using Google Compute Engine instances, you can use the
   `gcloud compute instances list` command to see the public addresses of your
   nodes.

1. On your chosen node, create a firewall rule that allows TCP traffic
   on your node port. For example, if your Service has a NodePort value of
   31568, create a firewall rule that allows TCP traffic on port 31568. Different
   cloud providers offer different ways of configuring firewall rules.

1. Use the node address and node port to access the Hello World application:
-->
8. 獲取執行 Hello World 的 pod 的其中一個節點的公共 IP 地址。如何獲得此地址取決於你設定叢集的方式。
   例如，如果你使用的是 Minikube，則可以透過執行 `kubectl cluster-info` 來檢視節點地址。
   如果你使用的是 Google Compute Engine 例項，則可以使用 `gcloud compute instances list` 命令檢視節點的公共地址。

9. 在你選擇的節點上，建立一個防火牆規則以開放節點埠上的 TCP 流量。
   例如，如果你的服務的 NodePort 值為 31568，請建立一個防火牆規則以允許 31568 埠上的 TCP 流量。
   不同的雲提供商提供了不同方法來配置防火牆規則。

10. 使用節點地址和 node port 來訪問 Hello World 應用：

   ```shell
   curl http://<public-node-ip>:<node-port>
   ```

   <!--
   where `<public-node-ip>` is the public IP address of your node,
   and `<node-port>` is the NodePort value for your service. The
   response to a successful request is a hello message:
   -->
   這裡的 `<public-node-ip>` 是你節點的公共 IP 地址，`<node-port>` 是你服務的 NodePort 值。
   對於請求成功的響應是一個 hello 訊息：

   ```shell
   Hello Kubernetes!
   ```

<!--
## Using a service configuration file

As an alternative to using `kubectl expose`, you can use a
[service configuration file](/docs/concepts/services-networking/service/)
to create a Service.
-->
## 使用服務配置檔案

作為 `kubectl expose` 的替代方法，你可以使用
[服務配置檔案](/zh-cn/docs/concepts/services-networking/service/) 來建立服務。

## {{% heading "cleanup" %}}

<!--
To delete the Service, enter this command:
-->
想要刪除服務，輸入以下命令：

```shell
kubectl delete services example-service
```

<!--
To delete the Deployment, the ReplicaSet, and the Pods that are running
the Hello World application, enter this command:
-->
想要刪除執行 Hello World 應用的 Deployment、ReplicaSet 和 Pod，輸入以下命令：

```shell
kubectl delete deployment hello-world
```

## {{% heading "whatsnext" %}}

<!--
Learn more about
[connecting applications with services](/docs/concepts/services-networking/connect-applications-service/).
-->
- 進一步瞭解[透過服務連線應用](/zh-cn/docs/concepts/services-networking/connect-applications-service/)。

