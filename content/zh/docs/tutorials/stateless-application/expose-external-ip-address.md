---
title: 公开外部 IP 地址以访问集群中应用程序
content_template: templates/tutorial
weight: 10
---

<!--
---
title: Exposing an External IP Address to Access an Application in a Cluster
content_template: templates/tutorial
weight: 10
---
-->

{{% capture overview %}}

<!--
This page shows how to create a Kubernetes Service object that exposes an
external IP address.
-->
此页面显示如何创建公开外部 IP 地址的 Kubernetes 服务对象。

{{% /capture %}}


{{% capture prerequisites %}}

<!--
 * Install [kubectl](/docs/tasks/tools/install-kubectl/).

 * Use a cloud provider like Google Kubernetes Engine or Amazon Web Services to
 create a Kubernetes cluster. This tutorial creates an
 [external load balancer](/docs/tasks/access-application-cluster/create-external-load-balancer/),
 which requires a cloud provider.

 * Configure `kubectl` to communicate with your Kubernetes API server. For
 instructions, see the documentation for your cloud provider.
-->

 * 安装 [kubectl](/zh/docs/tasks/tools/install-kubectl/).

 * 使用 Google Kubernetes Engine 或 Amazon Web Services 等云供应商创建 Kubernetes 群集。
 本教程创建了一个[外部负载均衡器](/zh/docs/tasks/access-application-cluster/create-external-load-balancer/)，需要云供应商。

 * 配置 `kubectl` 与 Kubernetes API 服务器通信。有关说明，请参阅云供应商文档。

{{% /capture %}}


{{% capture objectives %}}

<!--
* Run five instances of a Hello World application.
* Create a Service object that exposes an external IP address.
* Use the Service object to access the running application.
-->

* 运行 Hello World 应用程序的五个实例。
* 创建一个公开外部 IP 地址的 Service 对象。
* 使用 Service 对象访问正在运行的应用程序。

{{% /capture %}}


{{% capture lessoncontent %}}

<!--
## Creating a service for an application running in five pods
-->

## 为一个在五个 pod 中运行的应用程序创建服务

<!--
1. Run a Hello World application in your cluster:
-->
1. 在集群中运行 Hello World 应用程序：

        kubectl run hello-world --replicas=5 --labels="run=load-balancer-example" --image=gcr.io/google-samples/node-hello:1.0  --port=8080

<!--
    The preceding command creates a
    [Deployment](/docs/concepts/workloads/controllers/deployment/)
    object and an associated
    [ReplicaSet](/docs/concepts/workloads/controllers/replicaset/)
    object. The ReplicaSet has five
    [Pods](/docs/concepts/workloads/pods/pod/),
    each of which runs the Hello World application.
-->
   前面的命令创建一个 [Deployment](/zh/docs/concepts/workloads/controllers/deployment/)
   对象和一个关联的 [ReplicaSet](/zh/docs/concepts/workloads/controllers/replicaset/)对象。
   ReplicaSet 有五个 [Pod](/zh/docs/concepts/workloads/pods/pod/)，每个都运行 Hello World 应用程序。

<!--
1. Display information about the Deployment:
-->
2. 显示有关 Deployment 的信息：

        kubectl get deployments hello-world
        kubectl describe deployments hello-world

<!--
1. Display information about your ReplicaSet objects:
-->
3. 显示有关 ReplicaSet 对象的信息：

        kubectl get replicasets
        kubectl describe replicasets

<!--
1. Create a Service object that exposes the deployment:
-->
4. 创建公开 deployment 的 Service 对象：

        kubectl expose deployment hello-world --type=LoadBalancer --name=my-service

<!--
1. Display information about the Service:
-->
5. 显示有关 Service 的信息：

        kubectl get services my-service

<!--
   The output is similar to this:
-->
   输出类似于：

        NAME         TYPE        CLUSTER-IP     EXTERNAL-IP      PORT(S)    AGE
        my-service   ClusterIP   10.3.245.137   104.198.205.71   8080/TCP   54s

<!--
   Note: If the external IP address is shown as \<pending\>, wait for a minute
   and enter the same command again.
-->
   注意：如果外部 IP 地址显示为 \<pending\>，请等待一分钟再次输入相同的命令。

<!--
1. Display detailed information about the Service:
-->
6. 显示有关 Service 的详细信息：

        kubectl describe services my-service

<!--
   The output is similar to this:
-->
   输出类似于：

        Name:           my-service
        Namespace:      default
        Labels:         run=load-balancer-example
        Annotations:    <none>
        Selector:       run=load-balancer-example
        Type:           LoadBalancer
        IP:             10.3.245.137
        LoadBalancer Ingress:   104.198.205.71
        Port:           <unset> 8080/TCP
        NodePort:       <unset> 32377/TCP
        Endpoints:      10.0.0.6:8080,10.0.1.6:8080,10.0.1.7:8080 + 2 more...
        Session Affinity:   None
        Events:         <none>

<!--
   Make a note of the external IP address (`LoadBalancer Ingress`) exposed by
   your service. In this example, the external IP address is 104.198.205.71.
   Also note the value of `Port` and `NodePort`. In this example, the `Port`
   is 8080 and the `NodePort` is 32377.
-->
   记下服务公开的外部 IP 地址（`LoadBalancer Ingress`)。
   在本例中，外部 IP 地址是 104.198.205.71。还要注意 `Port` 和 `NodePort` 的值。
   在本例中，`Port` 是 8080，`NodePort` 是32377。


<!--
1. In the preceding output, you can see that the service has several endpoints:
   10.0.0.6:8080,10.0.1.6:8080,10.0.1.7:8080 + 2 more. These are internal
   addresses of the pods that are running the Hello World application. To
   verify these are pod addresses, enter this command:
-->
7. 在前面的输出中，您可以看到服务有几个端点：
   10.0.0.6:8080、10.0.1.6:8080、10.0.1.7:8080 和另外两个，
   这些都是正在运行 Hello World 应用程序的 pod 的内部地址。
   要验证这些是 pod 地址，请输入以下命令：

        kubectl get pods --output=wide

<!--
   The output is similar to this:
-->
   输出类似于：

        NAME                         ...  IP         NODE
        hello-world-2895499144-1jaz9 ...  10.0.1.6   gke-cluster-1-default-pool-e0b8d269-1afc
        hello-world-2895499144-2e5uh ...  10.0.1.8   gke-cluster-1-default-pool-e0b8d269-1afc
        hello-world-2895499144-9m4h1 ...  10.0.0.6   gke-cluster-1-default-pool-e0b8d269-5v7a
        hello-world-2895499144-o4z13 ...  10.0.1.7   gke-cluster-1-default-pool-e0b8d269-1afc
        hello-world-2895499144-segjf ...  10.0.2.5   gke-cluster-1-default-pool-e0b8d269-cpuc

<!--
1. Use the external IP address (`LoadBalancer Ingress`) to access the Hello
   World application:
-->
8. 使用外部 IP 地址（`LoadBalancer Ingress`）访问 Hello World 应用程序:

        curl http://<external-ip>:<port>

<!--
   where `<external-ip>` is the external IP address (`LoadBalancer Ingress`)
   of your Service, and `<port>` is the value of `Port` in your Service
   description.
   If you are using minikube, typing `minikube service my-service` will
   automatically open the Hello World application in a browser.
-->
   其中 `<external-ip>` 是您的服务的外部 IP 地址（`LoadBalancer Ingress`），
   `<port>` 是您的服务描述中的 `port` 的值。
   如果您正在使用 minikube，输入 `minikube service my-service` 将在浏览器中自动打开 Hello World 应用程序。

<!--
   The response to a successful request is a hello message:
-->
   成功请求的响应是一条问候消息：

        Hello Kubernetes!

{{% /capture %}}


{{% capture cleanup %}}

<!--
To delete the Service, enter this command:
-->
要删除服务，请输入以下命令：

        kubectl delete services my-service

<!--
To delete the Deployment, the ReplicaSet, and the Pods that are running
the Hello World application, enter this command:
-->
要删除正在运行 Hello World 应用程序的 Deployment，ReplicaSet 和 Pod，请输入以下命令：

        kubectl delete deployment hello-world

{{% /capture %}}


{{% capture whatsnext %}}

<!--
Learn more about
[connecting applications with services](/docs/concepts/services-networking/connect-applications-service/).
-->

了解更多关于[将应用程序与服务连接](/zh/docs/concepts/services-networking/connect-applications-service/)。

{{% /capture %}}
