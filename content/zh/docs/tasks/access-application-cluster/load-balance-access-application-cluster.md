<!--
---
title: Provide Load-Balanced Access to an Application in a Cluster
content_template: templates/tutorial
weight: 50
---
-->
---
title: 提供对集群中应用程序的负载均衡访问
content_template: templates/tutorial
weight: 50
---

{{% capture overview %}}

<!--
This page shows how to create a Kubernetes Service object that provides
load-balanced access to an application running in a cluster.
-->
本文展示如何创建一个 Kubernetes 服务对象，来提供负载均衡入口以访问集群内正在运行的应用程序。

{{% /capture %}}


{{% capture prerequisites %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

{{% /capture %}}


{{% capture objectives %}}

<!--
* Run two instances of a Hello World application
* Create a Service object
* Use the Service object to access the running application
-->
* 运行两个 Hello World 应用示例
* 创建一个服务对象
* 使用这个服务对象来访问正在运行的应用

{{% /capture %}}


{{% capture lessoncontent %}}

<!--
## Creating a Service for an application running in two pods

1. Run a Hello World application in your cluster:
-->
## 为在两个 pod 中运行的应用程序创建服务

1. 在您的集群中运行一个 Hello World 应用：

       ```
       kubectl run hello-world --replicas=2 --labels="run=load-balancer-example" --image=gcr.io/google-samples/node-hello:1.0  --port=8080
       ```
       
<!--
1. List the pods that are running the Hello World application:
-->
1. 列出运行 Hello World 应用的 pod：

       ```
       kubectl get pods --selector="run=load-balancer-example"
       ```

<!--
    The output is similar to this:
-->
    输出应类似于：

       ```
       NAME                           READY     STATUS    RESTARTS   AGE
       hello-world-2189936611-8fyp0   1/1       Running   0          6m
       hello-world-2189936611-9isq8   1/1       Running   0          6m
       ```

<!--
1. Create a Service object that exposes the deployment:
-->
1. 创建一个服务对象来暴露这个 deployment：

       ```
       kubectl expose deployment <your-deployment-name> --type=NodePort --name=example-service
       ```

<!--
    where `<your-deployment-name>` is the name of your deployment.

1. Display the IP addresses for your service:
-->
    这里的 `<your-deployment-name>` 是您的 deployment 的名称。

1. 显示您服务的 IP 地址：

       ```
       kubectl get services example-service
       ```
   
<!--
   The output shows the internal IP address and the external IP address of
   your service. If the external IP address shows as `<pending>`, repeat the
   command.
-->
   输出展示了您服务的内部和外部 IP 地址。如果外部 IP 地址显示 `<pending>`，那么您需要重复运行以上命令。

   {{< note >}}
<!--
    If you are using Minikube, you don't get an external IP address. The
   external IP address remains in the pending state.
-->
   **注意：** 如果您使用 Minikube，那么您将不会获得外部 IP 地址。外部 IP 地址将保持 pending 状态。
   {{< /note >}}

       NAME              CLUSTER-IP   EXTERNAL-IP   PORT(S)    AGE
       example-service   10.0.0.160   <pending>     8080/TCP   40s

<!--
1. Use your Service object to access the Hello World application:
-->
1. 使用您的服务对象来访问这个 Hello World 应用：

       curl <your-external-ip-address>:8080

<!--
   where `<your-external-ip-address>` is the external IP address of your
   service.

   The output is a hello message from the application:
-->
   这里的 `<your-external-ip-address>` 是您服务的外部 IP 地址。

   输出是来自应用的 hello 消息：

       Hello Kubernetes!

   {{< note >}}
<!--
   If you are using Minikube, enter these commands:
-->
   **注意：** 如果您使用 Minikube，输入以下命令：
   {{< /note >}}

       kubectl cluster-info
       kubectl describe services example-service

<!--
   The output displays the IP address of your Minikube node and the NodePort
   value for your service. Then enter this command to access the Hello World
   application:
-->
   输出将展示您的 Minikube 节点的 IP 地址和您服务的 NodePort 值。然后输入以下命令来访问这个 Hello World 应用：

       curl <minikube-node-ip-address>:<service-node-port>

<!--
   where `<minikube-node-ip-address>` us the IP address of your Minikube node,
   and `<service-node-port>` is the NodePort value for your service.
-->
   这里的 `<minikube-node-ip-address>` 是您的 Minikube 节点的 IP 地址，`<service-node-port>` 是您服务的 NodePort 值。

<!--
## Using a service configuration file

As an alternative to using `kubectl expose`, you can use a
[service configuration file](/docs/concepts/services-networking/service/)
to create a Service.
-->
## 使用服务配置文件

作为 `kubectl expose` 的替代方法，您可以使用 [服务配置文件](/docs/concepts/services-networking/service/) 来创建服务。


{{% /capture %}}


{{% capture whatsnext %}}

<!--
Learn more about
[connecting applications with services](/docs/concepts/services-networking/connect-applications-service/).
-->
学习更多关于如何 [通过服务连接应用](/docs/concepts/services-networking/connect-applications-service/)。
{{% /capture %}}



