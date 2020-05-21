---
title: "示例：使用 Redis 部署 PHP 留言板应用程序"
reviewers:
- ahmetb
content_template: templates/tutorial
weight: 20
---

<!--
---
title: "Example: Deploying PHP Guestbook application with Redis"
reviewers:
- ahmetb
content_template: templates/tutorial
weight: 20
---
-->

{{% capture overview %}}

<!--
This tutorial shows you how to build and deploy a simple, multi-tier web application using Kubernetes and [Docker](https://www.docker.com/). This example consists of the following components:
-->
本教程向您展示如何使用 Kubernetes 和 [Docker](https://www.docker.com/) 构建和部署
一个简单的多层 web 应用程序。本例由以下组件组成：

<!--
* A single-instance [Redis](https://redis.io/) master to store guestbook entries
* Multiple [replicated Redis](https://redis.io/topics/replication) instances to serve reads
* Multiple web frontend instances
-->

* 单实例 [Redis](https://redis.io/) 主节点保存留言板条目
* 多个[从 Redis](https://redis.io/topics/replication) 节点用来读取数据
* 多个 web 前端实例


{{% /capture %}}

{{% capture objectives %}}

<!--
* Start up a Redis master.
* Start up Redis slaves.
* Start up the guestbook frontend.
* Expose and view the Frontend Service.
* Clean up.
-->

* 启动 Redis 主节点。
* 启动 Redis 从节点。
* 启动留言板前端。
* 公开并查看前端服务。
* 清理。

{{% /capture %}}

{{% capture prerequisites %}}

{{< include "task-tutorial-prereqs.md" >}}

{{< version-check >}}

{{% /capture %}}

{{% capture lessoncontent %}}

<!--
## Start up the Redis Master
-->

##  启动 Redis 主节点

<!--
The guestbook application uses Redis to store its data. It writes its data to a Redis master instance and reads data from multiple Redis slave instances.
-->
留言板应用程序使用 Redis 存储数据。它将数据写入一个 Redis 主实例，并从多个 Redis 读取数据。

<!--
### Creating the Redis Master Deployment
-->

### 创建 Redis 主节点的 Deployment

<!--
The manifest file, included below, specifies a Deployment controller that runs a single replica Redis master Pod.
-->
下面包含的清单文件指定了一个 Deployment 控制器，该控制器运行一个 Redis 主节点 Pod 副本。

{{< codenew file="application/guestbook/redis-master-deployment.yaml" >}}

<!--
1. Launch a terminal window in the directory you downloaded the manifest files.
1. Apply the Redis Master Deployment from the `redis-master-deployment.yaml` file:
-->
1. 在下载清单文件的目录中启动终端窗口。
2. 从 `redis-master-deployment.yaml` 文件中应用 Redis 主 Deployment：

      ```shell
      kubectl apply -f https://k8s.io/examples/application/guestbook/redis-master-deployment.yaml
      ```

<!--
1. Query the list of Pods to verify that the Redis Master Pod is running:
-->
3. 查询 Pod 列表以验证 Redis 主节点 Pod 是否正在运行：

      ```shell
      kubectl get pods
      ```
<!--
      The response should be similar to this:
-->
      响应应该与此类似：

      ```shell
      NAME                            READY     STATUS    RESTARTS   AGE
      redis-master-1068406935-3lswp   1/1       Running   0          28s
      ```

<!--
1. Run the following command to view the logs from the Redis Master Pod:
-->
4. 运行以下命令查看 Redis 主节点 Pod 中的日志：

     ```shell
     kubectl logs -f POD-NAME
     ```

{{< note >}}

<!--
Replace POD-NAME with the name of your Pod.
-->
将 POD-NAME 替换为您的 Pod 名称。

{{< /note >}}

<!--
### Creating the Redis Master Service
-->

### 创建 Redis 主节点的服务

<!--
The guestbook applications needs to communicate to the Redis master to write its data. You need to apply a [Service](/docs/concepts/services-networking/service/) to proxy the traffic to the Redis master Pod. A Service defines a policy to access the Pods.
-->
留言板应用程序需要往 Redis 主节点中写数据。因此，需要创建 [Service](/zh/docs/concepts/services-networking/service/) 来代理 Redis 主节点 Pod 的流量。Service 定义了访问 Pod 的策略。

{{< codenew file="application/guestbook/redis-master-service.yaml" >}}

<!--
1. Apply the Redis Master Service from the following `redis-master-service.yaml` file:
-->
1. 使用下面的 `redis-master-service.yaml` 文件创建 Redis 主节点的服务：

      ```shell
      kubectl apply -f https://k8s.io/examples/application/guestbook/redis-master-service.yaml
      ```

<!--
1. Query the list of Services to verify that the Redis Master Service is running:
-->
2. 查询服务列表验证 Redis 主节点服务是否正在运行：

      ```shell
      kubectl get service
      ```

<!--
      The response should be similar to this:
-->
      响应应该与此类似：

      ```shell
      NAME           TYPE        CLUSTER-IP   EXTERNAL-IP   PORT(S)    AGE
      kubernetes     ClusterIP   10.0.0.1     <none>        443/TCP    1m
      redis-master   ClusterIP   10.0.0.151   <none>        6379/TCP   8s
      ```

{{< note >}}

<!--
This manifest file creates a Service named `redis-master` with a set of labels that match the labels previously defined, so the Service routes network traffic to the Redis master Pod.
-->
这个清单文件创建了一个名为 `Redis-master` 的 Service，其中包含一组与前面定义的标签匹配的标签，因此服务将网络流量路由到 Redis 主节点 Pod 上。

{{< /note >}}

<!--
## Start up the Redis Slaves
-->

## 启动 Redis 从节点

<!--
Although the Redis master is a single pod, you can make it highly available to meet traffic demands by adding replica Redis slaves.
-->
尽管 Redis 主节点是一个单独的 pod，但是您可以通过添加 Redis 从节点的方式来使其高可用性，以满足流量需求。

<!--
### Creating the Redis Slave Deployment
-->

### 创建 Redis 从节点 Deployment

<!--
Deployments scale based off of the configurations set in the manifest file. In this case, the Deployment object specifies two replicas.
-->
Deployments 根据清单文件中设置的配置进行伸缩。在这种情况下，Deployment 对象指定两个副本。

<!--
If there are not any replicas running, this Deployment would start the two replicas on your container cluster. Conversely, if there are more than two replicas are running, it would scale down until two replicas are running.
-->
如果没有任何副本正在运行，则此 Deployment 将启动容器集群上的两个副本。相反，
如果有两个以上的副本在运行，那么它的规模就会缩小，直到运行两个副本为止。

{{< codenew file="application/guestbook/redis-slave-deployment.yaml" >}}

<!--
1. Apply the Redis Slave Deployment from the `redis-slave-deployment.yaml` file:
-->
1. 从 `redis-slave-deployment.yaml` 文件中应用 Redis Slave Deployment：

      ```shell
      kubectl apply -f https://k8s.io/examples/application/guestbook/redis-slave-deployment.yaml
      ```

<!--
1. Query the list of Pods to verify that the Redis Slave Pods are running:
-->
2. 查询 Pod 列表以验证 Redis Slave Pod 正在运行：

      ```shell
      kubectl get pods
      ```

<!--
      The response should be similar to this:
-->
      响应应该与此类似：

      ```shell
      NAME                            READY     STATUS              RESTARTS   AGE
      redis-master-1068406935-3lswp   1/1       Running             0          1m
      redis-slave-2005841000-fpvqc    0/1       ContainerCreating   0          6s
      redis-slave-2005841000-phfv9    0/1       ContainerCreating   0          6s
      ```

<!--
### Creating the Redis Slave Service
-->

### 创建 Redis 从节点的 Service

<!--
The guestbook application needs to communicate to Redis slaves to read data. To make the Redis slaves discoverable, you need to set up a Service. A Service provides transparent load balancing to a set of Pods.
-->
留言板应用程序需要从 Redis 从节点中读取数据。
为了便于 Redis 从节点可发现，
您需要设置一个 Service。Service 为一组 Pod 提供负载均衡。

{{< codenew file="application/guestbook/redis-slave-service.yaml" >}}

<!--
1. Apply the Redis Slave Service from the following `redis-slave-service.yaml` file:
-->
1. 从以下 `redis-slave-service.yaml` 文件应用 Redis Slave 服务：

      ```shell
      kubectl apply -f https://k8s.io/examples/application/guestbook/redis-slave-service.yaml
      ```

<!--
1. Query the list of Services to verify that the Redis slave service is running:
-->
2. 查询服务列表以验证 Redis 在服务是否正在运行：

      ```shell
      kubectl get services
      ```

<!--
      The response should be similar to this:
-->
      响应应该与此类似：

      ```
      NAME           TYPE        CLUSTER-IP   EXTERNAL-IP   PORT(S)    AGE
      kubernetes     ClusterIP   10.0.0.1     <none>        443/TCP    2m
      redis-master   ClusterIP   10.0.0.151   <none>        6379/TCP   1m
      redis-slave    ClusterIP   10.0.0.223   <none>        6379/TCP   6s
      ```

<!--
## Set up and Expose the Guestbook Frontend
-->

## 设置并公开留言板前端

<!--
The guestbook application has a web frontend serving the HTTP requests written in PHP. It is configured to connect to the `redis-master` Service for write requests and the `redis-slave` service for Read requests.
-->
留言板应用程序有一个 web 前端，服务于用 PHP 编写的 HTTP 请求。
它被配置为连接到写请求的 `redis-master` 服务和读请求的 `redis-slave` 服务。

<!--
### Creating the Guestbook Frontend Deployment
-->

### 创建留言板前端 Deployment

{{< codenew file="application/guestbook/frontend-deployment.yaml" >}}

<!--
1. Apply the frontend Deployment from the `frontend-deployment.yaml` file:
-->
1. 从 `frontend-deployment.yaml` 应用前端 Deployment 文件：

      ```shell
      kubectl apply -f https://k8s.io/examples/application/guestbook/frontend-deployment.yaml
      ```

<!--
1. Query the list of Pods to verify that the three frontend replicas are running:
-->
2. 查询 Pod 列表，验证三个前端副本是否正在运行：

      ```shell
      kubectl get pods -l app=guestbook -l tier=frontend
      ```

<!--
      The response should be similar to this:
-->
      响应应该与此类似：

      ```
      NAME                        READY     STATUS    RESTARTS   AGE
      frontend-3823415956-dsvc5   1/1       Running   0          54s
      frontend-3823415956-k22zn   1/1       Running   0          54s
      frontend-3823415956-w9gbt   1/1       Running   0          54s
      ```

<!--
### Creating the Frontend Service
-->

### 创建前端服务

<!--
The `redis-slave` and `redis-master` Services you applied are only accessible within the container cluster because the default type for a Service is [ClusterIP](/docs/concepts/services-networking/service/#publishing-services---service-types). `ClusterIP` provides a single IP address for the set of Pods the Service is pointing to. This IP address is accessible only within the cluster.
-->
应用的 `redis-slave` 和 `redis-master` 服务只能在容器集群中访问，因为服务的默认类型是
[ClusterIP](/zh/docs/concepts/Services-networking/Service/#publishingservices-Service-types)。`ClusterIP` 为服务指向的 Pod 集提供一个 IP 地址。这个 IP 地址只能在集群中访问。

<!--
If you want guests to be able to access your guestbook, you must configure the frontend Service to be externally visible, so a client can request the Service from outside the container cluster. Minikube can only expose Services through `NodePort`.
-->
如果您希望客人能够访问您的留言板，您必须将前端服务配置为外部可见的，以便客户机可以从容器集群之外请求服务。Minikube 只能通过 `NodePort` 公开服务。

{{< note >}}

<!--
Some cloud providers, like Google Compute Engine or Google Kubernetes Engine, support external load balancers. If your cloud provider supports load balancers and you want to use it, simply delete or comment out `type: NodePort`, and uncomment `type: LoadBalancer`.
-->
一些云提供商，如 Google Compute Engine 或 Google Kubernetes Engine，支持外部负载均衡器。如果您的云提供商支持负载均衡器，并且您希望使用它，
只需删除或注释掉 `type: NodePort`，并取消注释 `type: LoadBalancer` 即可。

{{< /note >}}

{{< codenew file="application/guestbook/frontend-service.yaml" >}}

<!--
1. Apply the frontend Service from the `frontend-service.yaml` file:
-->
1. 从 `frontend-service.yaml` 文件中应用前端服务：

      ```shell
      kubectl apply -f https://k8s.io/examples/application/guestbook/frontend-service.yaml
      ```

<!--
1. Query the list of Services to verify that the frontend Service is running:
-->
2. 查询服务列表以验证前端服务正在运行:

      ```shell
      kubectl get services
      ```

<!--
      The response should be similar to this:
-->
      响应应该与此类似：

      ```
      NAME           TYPE        CLUSTER-IP   EXTERNAL-IP   PORT(S)        AGE
      frontend       ClusterIP   10.0.0.112   <none>       80:31323/TCP   6s
      kubernetes     ClusterIP   10.0.0.1     <none>        443/TCP        4m
      redis-master   ClusterIP   10.0.0.151   <none>        6379/TCP       2m
      redis-slave    ClusterIP   10.0.0.223   <none>        6379/TCP       1m
      ```

<!--
### Viewing the Frontend Service via `NodePort`
-->

### 通过 `NodePort` 查看前端服务

<!--
If you deployed this application to Minikube or a local cluster, you need to find the IP address to view your Guestbook.
-->
如果您将此应用程序部署到 Minikube 或本地集群，您需要找到 IP 地址来查看您的留言板。

<!--
1. Run the following command to get the IP address for the frontend Service.
-->
1. 运行以下命令获取前端服务的 IP 地址。

      ```shell
      minikube service frontend --url
      ```

<!--
      The response should be similar to this:
-->
      响应应该与此类似：

      ```
      http://192.168.99.100:31323
      ```

<!--
1. Copy the IP address, and load the page in your browser to view your guestbook.
-->
2. 复制 IP 地址，然后在浏览器中加载页面以查看留言板。

<!--
### Viewing the Frontend Service via `LoadBalancer`
-->

### 通过 `LoadBalancer` 查看前端服务

<!--
If you deployed the `frontend-service.yaml` manifest with type: `LoadBalancer` you need to find the IP address to view your Guestbook.
-->
如果您部署了 `frontend-service.yaml`。你需要找到 IP 地址来查看你的留言板。

<!--
1. Run the following command to get the IP address for the frontend Service.
-->
1. 运行以下命令以获取前端服务的 IP 地址。

      ```shell
      kubectl get service frontend
      ```

<!--
      The response should be similar to this:
-->
      响应应该与此类似：

      ```
      NAME       TYPE        CLUSTER-IP      EXTERNAL-IP        PORT(S)        AGE
      frontend   ClusterIP   10.51.242.136   109.197.92.229     80:32372/TCP   1m
      ```

<!--
1. Copy the external IP address, and load the page in your browser to view your guestbook.
-->
2. 复制外部 IP 地址，然后在浏览器中加载页面以查看留言板。

<!--
## Scale the Web Frontend
-->

## 扩展 Web 前端

<!--
Scaling up or down is easy because your servers are defined as a Service that uses a Deployment controller.
-->
伸缩很容易是因为服务器本身被定义为使用一个 Deployment 控制器的 Service。

<!--
1. Run the following command to scale up the number of frontend Pods:
-->
1. 运行以下命令扩展前端 Pod 的数量：

      ```shell
      kubectl scale deployment frontend --replicas=5
      ```

<!--
1. Query the list of Pods to verify the number of frontend Pods running:
-->
2. 查询 Pod 列表验证正在运行的前端 Pod 的数量：

      ```shell
      kubectl get pods
      ```

<!--
      The response should look similar to this:
-->
      响应应该类似于这样：

      ```
      NAME                            READY     STATUS    RESTARTS   AGE
      frontend-3823415956-70qj5       1/1       Running   0          5s
      frontend-3823415956-dsvc5       1/1       Running   0          54m
      frontend-3823415956-k22zn       1/1       Running   0          54m
      frontend-3823415956-w9gbt       1/1       Running   0          54m
      frontend-3823415956-x2pld       1/1       Running   0          5s
      redis-master-1068406935-3lswp   1/1       Running   0          56m
      redis-slave-2005841000-fpvqc    1/1       Running   0          55m
      redis-slave-2005841000-phfv9    1/1       Running   0          55m
      ```

<!--
1. Run the following command to scale down the number of frontend Pods:
-->
3. 运行以下命令缩小前端 Pod 的数量：

      ```shell
      kubectl scale deployment frontend --replicas=2
      ```

<!--
1. Query the list of Pods to verify the number of frontend Pods running:
-->
4. 查询 Pod 列表验证正在运行的前端 Pod 的数量：

      ```shell
      kubectl get pods
      ```

<!--
      The response should look similar to this:
-->
      响应应该类似于这样：

      ```
      NAME                            READY     STATUS    RESTARTS   AGE
      frontend-3823415956-k22zn       1/1       Running   0          1h
      frontend-3823415956-w9gbt       1/1       Running   0          1h
      redis-master-1068406935-3lswp   1/1       Running   0          1h
      redis-slave-2005841000-fpvqc    1/1       Running   0          1h
      redis-slave-2005841000-phfv9    1/1       Running   0          1h
      ```

{{% /capture %}}

{{% capture cleanup %}}

<!--
Deleting the Deployments and Services also deletes any running Pods. Use labels to delete multiple resources with one command.
-->
删除 Deployments 和服务还会删除正在运行的 Pod。使用标签用一个命令删除多个资源。

<!--
1. Run the following commands to delete all Pods, Deployments, and Services.
-->
5. 运行以下命令以删除所有 Pod，Deployments 和 Services。

      ```shell
      kubectl delete deployment -l app=redis
      kubectl delete service -l app=redis
      kubectl delete deployment -l app=guestbook
      kubectl delete service -l app=guestbook
      ```

<!--
      The responses should be:
-->
      响应应该是：

      ```
      deployment.apps "redis-master" deleted
      deployment.apps "redis-slave" deleted
      service "redis-master" deleted
      service "redis-slave" deleted
      deployment.apps "frontend" deleted
      service "frontend" deleted
      ```

<!--
1. Query the list of Pods to verify that no Pods are running:
-->
6. 查询 Pod 列表，确认没有 Pod 在运行：

      ```shell
      kubectl get pods
      ```

<!--
      The response should be this:
-->
      响应应该是：

      ```
      No resources found.
      ```

{{% /capture %}}

{{% capture whatsnext %}}

<!--
* Complete the [Kubernetes Basics](/docs/tutorials/kubernetes-basics/) Interactive Tutorials
* Use Kubernetes to create a blog using [Persistent Volumes for MySQL and Wordpress](/docs/tutorials/stateful-application/mysql-wordpress-persistent-volume/#visit-your-new-wordpress-blog)
* Read more about [connecting applications](/docs/concepts/services-networking/connect-applications-service/)
* Read more about [Managing Resources](/docs/concepts/cluster-administration/manage-deployment/#using-labels-effectively)
-->

* 完成 [Kubernetes Basics](/zh/docs/tutorials/kubernetes-basics/) 交互式教程
* 使用 Kubernetes 创建一个博客，使用 [MySQL 和 Wordpress 的持久卷](/zh/docs/tutorials/stateful-application/mysql-wordpress-persistent-volume/#visit-your-new-wordpress-blog)
* 阅读更多关于[连接应用程序](/zh/docs/concepts/services-networking/connect-applications-service/)
* 阅读更多关于[管理资源](/zh/docs/concepts/cluster-administration/manage-deployment/#using-labels-effectively)

{{% /capture %}}

