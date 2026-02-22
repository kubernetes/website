---
title: 使用服务来访问集群中的应用
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
本文展示如何创建一个 Kubernetes 服务对象，能让外部客户端访问在集群中运行的应用。
该服务为一个应用的两个运行实例提供负载均衡。

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

## {{% heading "objectives" %}}

<!--
* Run two instances of a Hello World application.
* Create a Service object that exposes a node port.
* Use the Service object to access the running application.
-->
* 运行 Hello World 应用的两个实例。
* 创建一个服务对象来暴露 NodePort。
* 使用服务对象来访问正在运行的应用。

<!-- lessoncontent -->

<!--
## Creating a service for an application running in two pods

Here is the configuration file for the application Deployment:
-->
## 为运行在两个 Pod 中的应用创建一个服务   {#creating-a-service-for-an-app-running-in-two-pods}

这是应用程序部署的配置文件：

{{% code_sample file="service/access/hello-application.yaml" %}}

<!--
1. Run a Hello World application in your cluster:
   Create the application Deployment using the file above:
-->
1. 在你的集群中运行一个 Hello World 应用。
   使用上面的文件创建应用程序 Deployment：

   ```shell
   kubectl apply -f https://k8s.io/examples/service/access/hello-application.yaml
   ```

   <!--
   The preceding command creates a
   {{< glossary_tooltip text="Deployment" term_id="deployment" >}}
   and an associated
   {{< glossary_tooltip term_id="replica-set" text="ReplicaSet" >}}.
   The ReplicaSet has two
   {{< glossary_tooltip text="Pods" term_id="pod" >}}
   each of which runs the Hello World application.
   -->

   上面的命令创建一个
   {{< glossary_tooltip text="Deployment" term_id="deployment" >}} 对象
   和一个关联的 {{< glossary_tooltip term_id="replica-set" text="ReplicaSet" >}} 对象。
   这个 ReplicaSet 有两个 {{< glossary_tooltip text="Pod" term_id="pod" >}}，
   每个 Pod 都运行着 Hello World 应用。

<!--
1. Display information about the Deployment:
-->
2. 展示 Deployment 的信息：

   ```shell
   kubectl get deployments hello-world
   kubectl describe deployments hello-world
   ```

<!--
1. Display information about your ReplicaSet objects:
-->
3. 展示你的 ReplicaSet 对象信息：

   ```shell
   kubectl get replicasets
   kubectl describe replicasets
   ```

<!--
1. Create a Service object that exposes the deployment:
-->
4. 创建一个服务对象来暴露 Deployment：

   ```shell
   kubectl expose deployment hello-world --type=NodePort --name=example-service
   ```

<!--
1. Display information about the Service:
-->
5. 展示 Service 信息：

   ```shell
   kubectl describe services example-service
   ```

   <!--
   The output is similar to this:
   -->
   输出类似于：

   ```none
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
   Make a note of the NodePort value for the Service. For example,
   in the preceding output, the NodePort value is 31496.
   -->
   注意 Service 中的 NodePort 值。例如在上面的输出中，NodePort 值是 31496。

<!--
1. List the pods that are running the Hello World application:
-->
6. 列出运行 Hello World 应用的 Pod：

   ```shell
   kubectl get pods --selector="run=load-balancer-example" --output=wide
   ```

   <!--
   The output is similar to this:
   -->

   输出类似于：

   ```none
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
7. 获取运行 Hello World 的 pod 的其中一个节点的公共 IP 地址。如何获得此地址取决于你设置集群的方式。
   例如，如果你使用的是 Minikube，则可以通过运行 `kubectl cluster-info` 来查看节点地址。
   如果你使用的是 Google Compute Engine 实例，
   则可以使用 `gcloud compute instances list` 命令查看节点的公共地址。

8. 在你选择的节点上，创建一个防火墙规则以开放节点端口上的 TCP 流量。
   例如，如果你的服务的 NodePort 值为 31568，请创建一个防火墙规则以允许 31568 端口上的 TCP 流量。
   不同的云提供商提供了不同方法来配置防火墙规则。

9. 使用节点地址和 node port 来访问 Hello World 应用：

   ```shell
   curl http://<public-node-ip>:<node-port>
   ```

   <!--
   where `<public-node-ip>` is the public IP address of your node,
   and `<node-port>` is the NodePort value for your service. The
   response to a successful request is a hello message:
   -->
   这里的 `<public-node-ip>` 是你节点的公共 IP 地址，`<node-port>` 是你服务的 NodePort 值。
   对于请求成功的响应是一个 hello 消息：

   ```none
   Hello, world!
   Version: 2.0.0
   Hostname: hello-world-cdd4458f4-m47c8
   ```

<!--
## Using a service configuration file

As an alternative to using `kubectl expose`, you can use a
[service configuration file](/docs/concepts/services-networking/service/)
to create a Service.
-->
## 使用服务配置文件   {#using-a-service-configuration-file}

作为 `kubectl expose` 的替代方法，
你可以使用[服务配置文件](/zh-cn/docs/concepts/services-networking/service/)来创建服务。

## {{% heading "cleanup" %}}

<!--
To delete the Service, enter this command:
-->
想要删除服务，输入以下命令：

```shell
kubectl delete services example-service
```

<!--
To delete the Deployment, the ReplicaSet, and the Pods that are running
the Hello World application, enter this command:
-->
想要删除运行 Hello World 应用的 Deployment、ReplicaSet 和 Pod，输入以下命令：

```shell
kubectl delete deployment hello-world
```

## {{% heading "whatsnext" %}}

<!--
Follow the
[Connecting Applications with Services](/docs/tutorials/services/connect-applications-service/)
tutorial.
-->
跟随教程[使用 Service 连接到应用](/zh-cn/docs/tutorials/services/connect-applications-service/)。
