---
title: "示例：使用 MongoDB 部署 PHP 留言板应用程序"
content_type: tutorial
weight: 20
card:
  name: tutorials
  weight: 30
  title: "无状态应用示例：基于 MongoDB 的 PHP Guestbook"
min-kubernetes-server-version: v1.14
---

<!--
title: "Example: Deploying PHP Guestbook application with MongoDB"
reviewers:
- ahmetb
content_type: tutorial
weight: 20
card:
  name: tutorials
  weight: 30
  title: "Stateless Example: PHP Guestbook with MongoDB"
min-kubernetes-server-version: v1.14
-->

<!-- overview -->

<!--
This tutorial shows you how to build and deploy a simple _(not production ready)_, multi-tier web application using Kubernetes and [Docker](https://www.docker.com/). This example consists of the following components:
-->
本教程向您展示如何使用 Kubernetes 和 [Docker](https://www.docker.com/) 构建和部署
一个简单的_(非面向生产)的_多层 web 应用程序。本例由以下组件组成：

<!--
* A single-instance [MongoDB](https://www.mongodb.com/) to store guestbook entries
* Multiple web frontend instances
-->

* 单实例 [MongoDB](https://www.mongodb.com/) 以保存留言板条目
* 多个 web 前端实例




## {{% heading "objectives" %}}


<!--
* Start up a Mongo database.
* Start up the guestbook frontend.
* Expose and view the Frontend Service.
* Clean up.
-->

* 启动 Mongo 数据库。
* 启动留言板前端。
* 公开并查看前端服务。
* 清理。



## {{% heading "prerequisites" %}}


{{< include "task-tutorial-prereqs.md" >}}

{{< version-check >}}



<!-- lessoncontent -->

<!--
## Start up the Mongo Database
-->

##  启动 Mongo 数据库

<!--
The guestbook application uses MongoDB to store its data.
-->
留言板应用程序使用 MongoDB 存储数据。

<!--
### Creating the Mongo Deployment
-->

### 创建 Mongo 的 Deployment

<!--
The manifest file, included below, specifies a Deployment controller that runs a single replica MongoDB Pod.
-->
下面包含的清单文件指定了一个 Deployment 控制器，该控制器运行一个 MongoDB Pod 副本。

{{< codenew file="application/guestbook/mongo-deployment.yaml" >}}

<!--
1. Launch a terminal window in the directory you downloaded the manifest files.
1. Apply the MongoDB Deployment from the `mongo-deployment.yaml` file:
-->
1. 在下载清单文件的目录中启动终端窗口。
2. 从 `mongo-deployment.yaml` 文件中应用 MongoDB Deployment：

      ```shell
      kubectl apply -f https://k8s.io/examples/application/guestbook/mongo-deployment.yaml
      ```

<!---
for local testing of the content via relative file path
kubectl apply -f ./content/en/examples/application/guestbook/mongo-deployment.yaml
-->


<!--
1. Query the list of Pods to verify that the MongoDB Pod is running:
-->
3. 查询 Pod 列表以验证 MongoDB Pod 是否正在运行：

      ```shell
      kubectl get pods
      ```

<!--
      The response should be similar to this:
-->
      响应应该与此类似：

      ```shell
      NAME                            READY     STATUS    RESTARTS   AGE
      mongo-5cfd459dd4-lrcjb          1/1       Running   0          28s
      ```

<!--
1. Run the following command to view the logs from the MongoDB Deployment:
-->
4. 运行以下命令查看 MongoDB Deployment 中的日志：

     ```shell
     kubectl logs -f deployment/mongo
     ```

<!--
### Creating the MongoDB Service
-->

### 创建 MongoDB 服务

<!--
The guestbook application needs to communicate to the MongoDB to write its data. You need to apply a [Service](/docs/concepts/services-networking/service/) to proxy the traffic to the MongoDB Pod. A Service defines a policy to access the Pods.
-->
留言板应用程序需要往 MongoDB 中写数据。因此，需要创建 [Service](/zh/docs/concepts/services-networking/service/) 来代理 MongoDB Pod 的流量。Service 定义了访问 Pod 的策略。

{{< codenew file="application/guestbook/mongo-service.yaml" >}}

<!--
1. Apply the MongoDB Service from the following `mongo-service.yaml` file:
-->
1. 使用下面的 `mongo-service.yaml` 文件创建 MongoDB 的服务：

      ```shell
      kubectl apply -f https://k8s.io/examples/application/guestbook/mongo-service.yaml
      ```

<!---
for local testing of the content via relative file path
kubectl apply -f ./content/en/examples/application/guestbook/mongo-service.yaml
-->

<!--
1. Query the list of Services to verify that the MongoDB Service is running:
-->
2. 查询服务列表验证 MongoDB 服务是否正在运行：

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
      mongo          ClusterIP   10.0.0.151   <none>        27017/TCP   8s
      ```

<!--
This manifest file creates a Service named `mongo` with a set of labels that match the labels previously defined, so the Service routes network traffic to the MongoDB Pod.
-->
{{< note >}}
这个清单文件创建了一个名为 `mongo` 的 Service，其中包含一组与前面定义的标签匹配的标签，因此服务将网络流量路由到 MongoDB Pod 上。
{{< /note >}}

<!--
## Set up and Expose the Guestbook Frontend
-->
## 设置并公开留言板前端

<!-- 
The guestbook application has a web frontend serving the HTTP requests written in PHP. It is configured to connect to the `mongo` Service to store Guestbook entries.
 -->
留言板应用程序有一个 web 前端，服务于用 PHP 编写的 HTTP 请求。
它被配置为连接到 `mongo` 服务以存储留言版条目。

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

<!---
for local testing of the content via relative file path
kubectl apply -f ./content/en/examples/application/guestbook/frontend-deployment.yaml
-->

<!--
1. Query the list of Pods to verify that the three frontend replicas are running:
-->
2. 查询 Pod 列表，验证三个前端副本是否正在运行：

      ```shell
      kubectl get pods -l app.kubernetes.io/name=guestbook -l app.kubernetes.io/component=frontend
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
The `mongo` Services you applied is only accessible within the Kubernetes cluster because the default type for a Service is [ClusterIP](/docs/concepts/services-networking/service/#publishing-services---service-types). `ClusterIP` provides a single IP address for the set of Pods the Service is pointing to. This IP address is accessible only within the cluster.
-->
应用的 `mongo` 服务只能在 Kubernetes 集群中访问，因为服务的默认类型是
[ClusterIP](/zh/docs/concepts/services-networking/service/#publishing-services---service-types)。`ClusterIP` 为服务指向的 Pod 集提供一个 IP 地址。这个 IP 地址只能在集群中访问。

<!--
If you want guests to be able to access your guestbook, you must configure the frontend Service to be externally visible, so a client can request the Service from outside the Kubernetes cluster. However a Kubernetes user you can use `kubectl port-forward` to access the service even though it uses a `ClusterIP`.
-->
如果您希望访客能够访问您的留言板，您必须将前端服务配置为外部可见的，以便客户端可以从 Kubernetes 集群之外请求服务。然而即便使用了 `ClusterIP` Kubernets 用户仍可以通过 `kubectl port-forwart` 访问服务。

<!--
Some cloud providers, like Google Compute Engine or Google Kubernetes Engine, support external load balancers. If your cloud provider supports load balancers and you want to use it, uncomment `type: LoadBalancer`.
-->
{{< note >}}
一些云提供商，如 Google Compute Engine 或 Google Kubernetes Engine，支持外部负载均衡器。如果您的云提供商支持负载均衡器，并且您希望使用它，
只需取消注释 `type: LoadBalancer` 即可。
{{< /note >}}

{{< codenew file="application/guestbook/frontend-service.yaml" >}}

<!--
1. Apply the frontend Service from the `frontend-service.yaml` file:
-->
1. 从 `frontend-service.yaml` 文件中应用前端服务：

      ```shell
      kubectl apply -f https://k8s.io/examples/application/guestbook/frontend-service.yaml
      ```

<!---
for local testing of the content via relative file path
kubectl apply -f ./content/en/examples/application/guestbook/frontend-service.yaml
-->

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
      frontend       ClusterIP   10.0.0.112   <none>       80/TCP   6s
      kubernetes     ClusterIP   10.0.0.1     <none>        443/TCP        4m
      mongo          ClusterIP   10.0.0.151   <none>        6379/TCP       2m
      ```

<!--
### Viewing the Frontend Service via `kubectl port-forward`
-->

### 通过 `kubectl port-forward` 查看前端服务

<!--
1. Run the following command to forward port `8080` on your local machine to port `80` on the service.
-->
1. 运行以下命令将本机的 `8080` 端口转发到服务的 `80` 端口。

      ```shell
      kubectl port-forward svc/frontend 8080:80
      ```

<!--
      The response should be similar to this:
-->
      响应应该与此类似：

      ```
      Forwarding from 127.0.0.1:8080 -> 80
      Forwarding from [::1]:8080 -> 80
      ```

<!--
1. load the page [http://localhost:8080](http://localhost:8080) in your browser to view your guestbook.
-->
2. 在浏览器中加载 [http://localhost:8080](http://localhost:8080) 页面以查看留言板。

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
      mongo-1068406935-3lswp   1/1       Running   0          56m
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
      mongo-1068406935-3lswp   1/1       Running   0          1h
      ```



## {{% heading "cleanup" %}}


<!--
Deleting the Deployments and Services also deletes any running Pods. Use labels to delete multiple resources with one command.
-->
删除 Deployments 和服务还会删除正在运行的 Pod。使用标签用一个命令删除多个资源。

<!--
1. Run the following commands to delete all Pods, Deployments, and Services.
-->
1. 运行以下命令以删除所有 Pod，Deployments 和 Services。

      ```shell
      kubectl delete deployment -l app.kubernetes.io/name=mongo
      kubectl delete service -l app.kubernetes.io/name=mongo
      kubectl delete deployment -l app.kubernetes.io/name=guestbook
      kubectl delete service -l app.kubernetes.io/name=guestbook
      ```

<!--
      The responses should be:
-->
      响应应该是：

      ```
      deployment.apps "mongo" deleted
      service "mongo" deleted
      deployment.apps "frontend" deleted
      service "frontend" deleted
      ```

<!--
1. Query the list of Pods to verify that no Pods are running:
-->
2. 查询 Pod 列表，确认没有 Pod 在运行：

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



## {{% heading "whatsnext" %}}


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


