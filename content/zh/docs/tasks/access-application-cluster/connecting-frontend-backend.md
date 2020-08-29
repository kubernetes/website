---
title: 使用 Service 把前端连接到后端
content_type: tutorial
weight: 70
---

<!-- overview -->

<!--
This task shows how to create a frontend and a backend
microservice. The backend microservice is a hello greeter. The
frontend and backend are connected using a Kubernetes
{{< glossary_tooltip term_id="service" >}} object.
-->

本任务会描述如何创建前端微服务和后端微服务。后端微服务是一个 hello 欢迎程序。
前端和后端的连接是通过 Kubernetes {{< glossary_tooltip term_id="service" text="服务" >}}
完成的。

## {{% heading "objectives" %}}

<!--
* Create and run a microservice using a {{< glossary_tooltip term_id="deployment" >}} object.
* Route traffic to the backend using a frontend.
* Use a Service object to connect the frontend application to the
  backend application.
-->
* 使用部署对象（Deployment object）创建并运行一个微服务
* 从后端将流量路由到前端
* 使用服务对象把前端应用连接到后端应用

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!--
This task uses
[Services with external load balancers](/docs/tasks/access-application-cluster/create-external-load-balancer/), which
require a supported environment. If your environment does not support this, you can use a Service of type
[NodePort](/docs/concepts/services-networking/service/#nodeport) instead.
-->

本任务使用 [外部负载均衡服务](/zh/docs/tasks/access-application-cluster/create-external-load-balancer/)，
所以需要对应的可支持此功能的环境。如果你的环境不能支持，你可以使用
[NodePort](/zh/docs/concepts/services-networking/service/#nodeport)
类型的服务代替。

<!-- lessoncontent -->

<!--
## Creating the backend using a Deployment

The backend is a simple hello greeter microservice. Here is the configuration
file for the backend Deployment:
-->
### 使用部署对象（Deployment）创建后端

后端是一个简单的 hello 欢迎微服务应用。这是后端应用的 Deployment 配置文件：

{{< codenew file="service/access/hello.yaml" >}}

<!-- 
Create the backend Deployment:
-->
创建后端 Deployment：

```shell
kubectl apply -f https://k8s.io/examples/service/access/hello.yaml
```

<!--
View information about the backend Deployment:
-->
查看后端的 Deployment 信息：

```
kubectl describe deployment hello
```

<!--
The output is similar to this:
-->
输出类似于：

```
Name:                           hello
Namespace:                      default
CreationTimestamp:              Mon, 24 Oct 2016 14:21:02 -0700
Labels:                         app=hello
                                tier=backend
                                track=stable
Annotations:                    deployment.kubernetes.io/revision=1
Selector:                       app=hello,tier=backend,track=stable
Replicas:                       7 desired | 7 updated | 7 total | 7 available | 0 unavailable
StrategyType:                   RollingUpdate
MinReadySeconds:                0
RollingUpdateStrategy:          1 max unavailable, 1 max surge
Pod Template:
  Labels:       app=hello
                tier=backend
                track=stable
  Containers:
   hello:
    Image:              "gcr.io/google-samples/hello-go-gke:1.0"
    Port:               80/TCP
    Environment:        <none>
    Mounts:             <none>
  Volumes:              <none>
Conditions:
  Type          Status  Reason
  ----          ------  ------
  Available     True    MinimumReplicasAvailable
  Progressing   True    NewReplicaSetAvailable
OldReplicaSets:                 <none>
NewReplicaSet:                  hello-3621623197 (7/7 replicas created)
Events:
...
```

<!--
## Creating the backend Service object

The key to connecting a frontend to a backend is the backend
Service. A Service creates a persistent IP address and DNS name entry
so that the backend microservice can always be reached. A Service uses
{{< glossary_tooltip text="selectors" term_id="selector" >}} to find
the Pods that it routes traffic to.

First, explore the Service configuration file:
-->
### 创建后端服务对象

前端连接到后端的关键是 Service（服务）。Service 创建一个固定 IP 和 DNS 解析名入口，
使得后端微服务可达。Service 使用
{{< glossary_tooltip text="选择算符" term_id="selector" >}} 
来寻找目标 Pod。

首先，浏览 Service 的配置文件：

{{< codenew file="service/access/hello-service.yaml" >}}

<!--
In the configuration file, you can see that the Service routes traffic to Pods
that have the labels `app: hello` and `tier: backend`.
-->
配置文件中，你可以看到 Service 将流量路由到包含 `app: hello` 和 `tier: backend` 标签的 Pod。

<!--
Create the `hello` Service:
-->
创建 `hello` Service：

```shell
kubectl apply -f https://k8s.io/examples/service/access/hello-service.yaml
```

<!--
At this point, you have a backend Deployment running, and you have a
Service that can route traffic to it.
-->
此时，你已经有了一个在运行的后端 Deployment，你也有了一个 Service 用于路由网络流量。

<!--
## Creating the frontend

Now that you have your backend, you can create a frontend that connects to the backend.
The frontend connects to the backend worker Pods by using the DNS name
given to the backend Service. The DNS name is "hello", which is the value
of the `name` field in the preceding Service configuration file.

The Pods in the frontend Deployment run an nginx image that is configured
to find the hello backend Service. Here is the nginx configuration file:
-->
### 创建前端应用

既然你已经有了后端应用，你可以创建一个前端应用连接到后端。前端应用通过 DNS 名连接到后端的工作 Pods。
DNS 名是 "hello"，也就是 Service 配置文件中 `name` 字段的值。

前端 Deployment 中的 Pods 运行一个 nginx 镜像，这个已经配置好镜像去寻找后端的 hello Service。
只是 nginx 的配置文件：

{{< codenew file="service/access/frontend.conf" >}}

<!--
Similar to the backend, the frontend has a Deployment and a Service. The
configuration for the Service has `type: LoadBalancer`, which means that
the Service uses the default load balancer of your cloud provider.
-->
与后端类似，前端用包含一个 Deployment 和一个 Service。Service 的配置文件包含了 `type: LoadBalancer`，
也就是说，Service 会使用你的云服务商的默认负载均衡设备。

{{< codenew file="service/access/frontend.yaml" >}}

<!--
Create the frontend Deployment and Service:
-->
创建前端 Deployment 和 Service：

```shell
kubectl apply -f https://k8s.io/examples/service/access/frontend.yaml
```

<!--
The output verifies that both resources were created:
-->
通过输出确认两个资源都已经被创建：

```
deployment.apps/frontend created
service/frontend created
```

<!--
The nginx configuration is baked into the
[container image](/examples/service/access/Dockerfile). A better way to do this would
be to use a
[ConfigMap](/docs/tasks/configure-pod-container/configure-pod-configmap/),
so that you can change the configuration more easily.
-->
{{< note >}}
这个 nginx 配置文件是被打包在
[容器镜像](/examples/service/access/Dockerfile) 里的。
更好的方法是使用
[ConfigMap](/zh/docs/tasks/configure-pod-container/configure-pod-configmap/)，
这样的话你可以更轻易地更改配置。
{{< /note >}}

<!--
## Interact with the frontend Service

Once you’ve created a Service of type LoadBalancer, you can use this
command to find the external IP:
-->
### 与前端 Service 交互

一旦你创建了 LoadBalancer 类型的 Service，你可以使用这条命令查看外部 IP：

```shell
kubectl get service frontend
```

<!--
This displays the configuration for the `frontend` Service and watches for
changes. Initially, the external IP is listed as `<pending>`:
-->
外部 IP 字段的生成可能需要一些时间。如果是这种情况，外部 IP 会显示为 `<pending>`。

```
NAME       CLUSTER-IP      EXTERNAL-IP   PORT(S)  AGE
frontend   10.51.252.116   <pending>     80/TCP   10s
```

<!--
As soon as an external IP is provisioned, however, the configuration updates
to include the new IP under the `EXTERNAL-IP` heading:
-->
当外部 IP 地址被分配可用时，配置会更新，在 `EXTERNAL-IP` 头部下显示新的 IP：

```
NAME       CLUSTER-IP      EXTERNAL-IP        PORT(S)  AGE
frontend   10.51.252.116   XXX.XXX.XXX.XXX    80/TCP   1m
```

<!--
That IP can now be used to interact with the `frontend` service from outside the
cluster.
-->
这一新的 IP 地址就可以用来从集群外与 `frontend` 服务交互了。


<!--
## Send traffic through the frontend

The frontend and backends are now connected. You can hit the endpoint
by using the curl command on the external IP of your frontend Service.
-->
### 通过前端发送流量

前端和后端已经完成连接了。你可以使用 curl 命令通过你的前端 Service 的外部 IP 访问服务端点。

```shell
curl http://<EXTERNAL-IP>
```

<!--
The output shows the message generated by the backend:
-->
后端生成的消息输出如下：

```json
{"message":"Hello"}
```

## {{% heading "cleanup" %}}

<!--
To delete the Services, enter this command:
-->
要删除服务，输入下面的命令：

```shell
kubectl delete services frontend hello
```

<!--
To delete the Deployments, the ReplicaSets and the Pods that are running the backend and frontend applications, enter this command:
-->
要删除在前端和后端应用中运行的 Deployment、ReplicaSet 和 Pod，输入下面的命令：

```shell
kubectl delete deployment frontend hello
```
## {{% heading "whatsnext" %}}

<!--
* Learn more about [Services](/docs/concepts/services-networking/service/)
* Learn more about [ConfigMaps](/docs/tasks/configure-pod-container/configure-pod-configmap/)
-->
* 进一步了解[Service](/zh/docs/concepts/services-networking/service/)
* 进一步了解[ConfigMap](/zh/docs/tasks/configure-pod-container/configure-pod-configmap/)

