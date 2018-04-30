---
title: 使用 Service 把前端连接到后端
---


{% capture overview %}




本任务会描述如何创建前端微服务和后端微服务。后端微服务是一个 hello 欢迎程序。
前端和后端的连接是通过 Kubernetes 服务对象（Service object）完成的。

{% endcapture %}


{% capture objectives %}




* 使用部署对象（Deployment object）创建并运行一个微服务
* 从后端将流量路由到前端
* 使用服务对象把前端应用连接到后端应用

{% endcapture %}


{% capture prerequisites %}

* {% include task-tutorial-prereqs.md %}


* 本任务使用 [外部负载均衡服务](/docs/tasks/access-application-cluster/create-external-load-balancer/)，
  所以需要对应的可支持此功能的环境。如果你的环境不能支持，你可以使用
  [NodePort](/docs/user-guide/services/#type-nodeport) 类型的服务代替。

{% endcapture %}


{% capture lessoncontent %}


### 使用部署对象（Deployment）创建后端



后端是一个简单的 hello 欢迎微服务应用。这是后端应用的 Deployment 配置文件：

{% include code.html language="yaml" file="hello.yaml" ghlink="/docs/tasks/access-application-cluster/hello.yaml" %}


创建后端 Deployment：

```
kubectl create -f https://k8s.io/docs/tasks/access-application-cluster/hello.yaml
```


查看后端的 Deployment 信息：

```
kubectl describe deployment hello
```


输出类似于：

```
Name:                           hello
Namespace:                      default
CreationTimestamp:              Mon, 24 Oct 2016 14:21:02 -0700
Labels:                         app=hello
                                tier=backend
                                track=stable
Selector:                       app=hello,tier=backend,track=stable
Replicas:                       7 updated | 7 total | 7 available | 0 unavailable
StrategyType:                   RollingUpdate
MinReadySeconds:                0
RollingUpdateStrategy:          1 max unavailable, 1 max surge
OldReplicaSets:                 <none>
NewReplicaSet:                  hello-3621623197 (7/7 replicas created)
Events:
...
```


### 创建后端服务对象（Service object）





前端连接到后端的关键是 Service。Service 创建一个固定 IP 和 DNS 解析名入口，
使得后端微服务可达。Service 使用 selector 标签来寻找目标 Pod。


首先，浏览 Service 的配置文件：

{% include code.html language="yaml" file="hello-service.yaml" ghlink="/docs/tasks/access-application-cluster/hello-service.yaml" %}



配置文件中，你可以看到 Service 将流量路由到包含 `app: hello` 和 `tier: backend` 标签的 Pod。


创建 `hello` Service：

```
kubectl create -f https://k8s.io/docs/tasks/access-application-cluster/hello-service.yaml
```



此时，你已经有了一个在运行的后端 Deployment，你也有了一个 Service 用于路由网络流量。


### 创建前端应用





既然你已经有了后端应用，你可以创建一个前端应用连接到后端。前端应用通过 DNS 名连接到后端的工作 Pods。
DNS 名是 "hello"，也就是 Service 配置文件中 `name` 字段的值。



前端 Deployment 中的 Pods 运行一个 nginx 镜像，这个已经配置好镜像去寻找后端的 hello Service。
只是 nginx 的配置文件：

{% include code.html file="frontend/frontend.conf" ghlink="/docs/tasks/access-application-cluster/frontend/frontend.conf" %}




与后端类似，前端用包含一个 Deployment 和一个 Service。Service 的配置文件包含了 `type: LoadBalancer`，
也就是说，Service 会使用你的云服务商的默认负载均衡设备。

{% include code.html language="yaml" file="frontend.yaml" ghlink="/docs/tasks/access-application-cluster/frontend.yaml" %}


创建前端 Deployment 和 Service：

```
kubectl create -f https://k8s.io/docs/tasks/access-application-cluster/frontend.yaml
```


通过输出确认两个资源都已经被创建：

```
deployment "frontend" created
service "frontend" created
```






**注意**：这个 nginx 配置文件是被打包在 [容器镜像](/docs/tasks/access-application-cluster/frontend/Dockerfile) 里的。
更好的方法是使用 [ConfigMap](/docs/tasks/configure-pod-container/configure-pod-configmap/)，这样的话你可以更轻易地更改配置。


### 与前端 Service 交互



一旦你创建了 LoadBalancer 类型的 Service，你可以使用这条命令查看外部 IP：

```
kubectl get service frontend
```



外部 IP 字段的生成可能需要一些时间。如果是这种情况，外部 IP 会显示为 `<pending>`。

```
NAME       CLUSTER-IP      EXTERNAL-IP   PORT(S)  AGE
frontend   10.51.252.116   <pending>     80/TCP   10s
```


使用相同的命令直到它显示外部 IP 地址：

```
NAME       CLUSTER-IP      EXTERNAL-IP        PORT(S)  AGE
frontend   10.51.252.116   XXX.XXX.XXX.XXX    80/TCP   1m
```


### 通过前端发送流量



前端和后端已经完成连接了。你可以使用 curl 命令通过你的前端 Service 的外部 IP 访问服务端点。

```
curl http://<EXTERNAL-IP>
```


后端生成的消息输出如下：

```
{"message":"Hello"}
```

{% endcapture %}


{% capture whatsnext %}



* 了解更多 [Services](/docs/concepts/services-networking/service/)
* 了解更多 [ConfigMaps](/docs/tasks/configure-pod-container/configure-pod-configmap/)

{% endcapture %}

{% include templates/tutorial.md %}
