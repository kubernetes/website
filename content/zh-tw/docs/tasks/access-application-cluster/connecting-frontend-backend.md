---
title: 使用 Service 把前端連線到後端
content_type: tutorial
weight: 70
---
<!--
title: Connect a Frontend to a Backend Using Services
content_type: tutorial
weight: 70
-->

<!-- overview -->

<!--
This task shows how to create a _frontend_ and a _backend_ microservice. The backend 
microservice is a hello greeter. The frontend exposes the backend using nginx and a 
Kubernetes {{< glossary_tooltip term_id="service" >}} object.
-->

本任務會描述如何建立前端（Frontend）微服務和後端（Backend）微服務。後端微服務是一個 hello 歡迎程式。
前端透過 nginx 和一個 Kubernetes {{< glossary_tooltip term_id="service" text="服務" >}}
暴露後端所提供的服務。

## {{% heading "objectives" %}}

<!--
* Create and run a sample `hello` backend microservice using a
  {{< glossary_tooltip term_id="deployment" >}} object.
* Use a Service object to send traffic to the backend microservice's multiple replicas.
* Create and run a `nginx` frontend microservice, also using a Deployment object.
* Configure the frontend microservice to send traffic to the backend microservice.
* Use a Service object of `type=LoadBalancer` to expose the frontend microservice
  outside the cluster.
-->
* 使用部署物件（Deployment object）建立並執行一個 `hello` 後端微服務
* 使用一個 Service 物件將請求流量傳送到後端微服務的多個副本
* 同樣使用一個 Deployment 物件建立並執行一個 `nginx` 前端微服務
* 配置前端微服務將請求流量傳送到後端微服務
* 使用 `type=LoadBalancer` 的 Service 物件將全段微服務暴露到叢集外部

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!--
This task uses
[Services with external load balancers](/docs/tasks/access-application-cluster/create-external-load-balancer/), which
require a supported environment. If your environment does not support this, you can use a Service of type
[NodePort](/docs/concepts/services-networking/service/#type-nodeport) instead.
-->
本任務使用[外部負載均衡服務](/zh-cn/docs/tasks/access-application-cluster/create-external-load-balancer/)，
所以需要對應的可支援此功能的環境。如果你的環境不能支援，你可以使用
[NodePort](/zh-cn/docs/concepts/services-networking/service/#type-nodeport)
型別的服務代替。

<!-- lessoncontent -->

<!--
## Creating the backend using a Deployment

The backend is a simple hello greeter microservice. Here is the configuration
file for the backend Deployment:
-->
### 使用部署物件（Deployment）建立後端

後端是一個簡單的 hello 歡迎微服務應用。這是後端應用的 Deployment 配置檔案：

{{< codenew file="service/access/backend-deployment.yaml" >}}

<!-- 
Create the backend Deployment:
-->
建立後端 Deployment：

```shell
kubectl apply -f https://k8s.io/examples/service/access/backend-deployment.yaml
```

<!--
View information about the backend Deployment:
-->
檢視後端的 Deployment 資訊：

```shell
kubectl describe deployment backend
```

<!--
The output is similar to this:
-->
輸出類似於：

```
Name:                           backend
Namespace:                      default
CreationTimestamp:              Mon, 24 Oct 2016 14:21:02 -0700
Labels:                         app=hello
                                tier=backend
                                track=stable
Annotations:                    deployment.kubernetes.io/revision=1
Selector:                       app=hello,tier=backend,track=stable
Replicas:                       3 desired | 3 updated | 3 total | 3 available | 0 unavailable
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
NewReplicaSet:                  hello-3621623197 (3/3 replicas created)
Events:
...
```

<!--
## Creating the `hello` Service object

The key to sending requests from a frontend to a backend is the backend
Service. A Service creates a persistent IP address and DNS name entry
so that the backend microservice can always be reached. A Service uses
{{< glossary_tooltip text="selectors" term_id="selector" >}} to find
the Pods that it routes traffic to.

First, explore the Service configuration file:
-->
### 建立 `hello` Service 物件

將請求從前端傳送到到後端的關鍵是後端 Service。Service 建立一個固定 IP 和 DNS 解析名入口，
使得後端微服務總是可達。Service 使用
{{< glossary_tooltip text="選擇算符" term_id="selector" >}} 
來尋找目標 Pod。

首先，瀏覽 Service 的配置檔案：

{{< codenew file="service/access/backend-service.yaml" >}}

<!--
In the configuration file, you can see that the Service named `hello` routes
traffic to Pods that have the labels `app: hello` and `tier: backend`.
-->
配置檔案中，你可以看到名為 `hello` 的 Service 將流量路由到包含 `app: hello`
和 `tier: backend` 標籤的 Pod。

<!--
Create the backend Service:
-->
建立後端 Service：

```shell
kubectl apply -f https://k8s.io/examples/service/access/backend-service.yaml
```

<!--
At this point, you have a `backend` Deployment running three replicas of your `hello`
application, and you have a Service that can route traffic to them. However, this
service is neither available nor resolvable outside the cluster.
-->
此時，你已經有了一個執行著 `hello` 應用的三個副本的 `backend` Deployment，你也有了
一個 Service 用於路由網路流量。不過，這個服務在叢集外部無法訪問也無法解析。

<!--
## Creating the frontend

Now that you have your backend running, you can create a frontend that is accessible 
outside the cluster, and connects to the backend by proxying requests to it.

The frontend sends requests to the backend worker Pods by using the DNS name
given to the backend Service. The DNS name is `hello`, which is the value
of the `name` field in the `examples/service/access/backend-service.yaml` 
configuration file.

The Pods in the frontend Deployment run an nginx image that is configured
to proxy requests to the hello backend Service. Here is the nginx configuration file:
-->
### 建立前端應用

現在你已經有了執行中的後端應用，你可以建立一個可在叢集外部訪問的前端，並透過代理
前端的請求連線到後端。

前端使用被賦予後端 Service 的 DNS 名稱將請求傳送到後端工作 Pods。這一 DNS
名稱為 `hello`，也就是 `examples/service/access/backend-service.yaml` 配置
檔案中 `name` 欄位的取值。

前端 Deployment 中的 Pods 執行一個 nginx 映象，這個已經配置好的映象會將請求轉發
給後端的 hello Service。下面是  nginx 的配置檔案：

{{< codenew file="service/access/frontend-nginx.conf" >}}

<!--
Similar to the backend, the frontend has a Deployment and a Service. An important
difference to notice between the backend and frontend services, is that the
configuration for the frontend Service has `type: LoadBalancer`, which means that
the Service uses a load balancer provisioned by your cloud provider and will be
accessible from outside the cluster.
-->
與後端類似，前端用包含一個 Deployment 和一個 Service。後端與前端服務之間的一個
重要區別是前端 Service 的配置檔案包含了 `type: LoadBalancer`，也就是說，Service
會使用你的雲服務商的預設負載均衡裝置，從而實現從叢集外訪問的目的。

{{< codenew file="service/access/frontend-service.yaml" >}}

{{< codenew file="service/access/frontend-deployment.yaml" >}}


<!--
Create the frontend Deployment and Service:
-->
建立前端 Deployment 和 Service：

```shell
kubectl apply -f https://k8s.io/examples/service/access/frontend-deployment.yaml
kubectl apply -f https://k8s.io/examples/service/access/frontend-service.yaml
```

<!--
The output verifies that both resources were created:
-->
透過輸出確認兩個資源都已經被建立：

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
這個 nginx 配置檔案是被打包在
[容器映象](/examples/service/access/Dockerfile) 裡的。
更好的方法是使用
[ConfigMap](/zh-cn/docs/tasks/configure-pod-container/configure-pod-configmap/)，
這樣的話你可以更輕易地更改配置。
{{< /note >}}

<!--
## Interact with the frontend Service

Once you've created a Service of type LoadBalancer, you can use this
command to find the external IP:
-->
### 與前端 Service 互動   {#interact-with-the-frontend-service}

一旦你建立了 LoadBalancer 型別的 Service，你可以使用這條命令檢視外部 IP：

```shell
kubectl get service frontend
```

<!--
This displays the configuration for the `frontend` Service and watches for
changes. Initially, the external IP is listed as `<pending>`:
-->
外部 IP 欄位的生成可能需要一些時間。如果是這種情況，外部 IP 會顯示為 `<pending>`。

```
NAME       CLUSTER-IP      EXTERNAL-IP   PORT(S)  AGE
frontend   10.51.252.116   <pending>     80/TCP   10s
```

<!--
As soon as an external IP is provisioned, however, the configuration updates
to include the new IP under the `EXTERNAL-IP` heading:
-->
當外部 IP 地址被分配可用時，配置會更新，在 `EXTERNAL-IP` 頭部下顯示新的 IP：

```
NAME       CLUSTER-IP      EXTERNAL-IP        PORT(S)  AGE
frontend   10.51.252.116   XXX.XXX.XXX.XXX    80/TCP   1m
```

<!--
That IP can now be used to interact with the `frontend` service from outside the
cluster.
-->
這一新的 IP 地址就可以用來從叢集外與 `frontend` 服務互動了。


<!--
## Send traffic through the frontend

The frontend and backend are now connected. You can hit the endpoint
by using the curl command on the external IP of your frontend Service.
-->
### 透過前端傳送流量

前端和後端已經完成連線了。你可以使用 curl 命令透過你的前端 Service 的外部
IP 訪問服務端點。

```shell
curl http://${EXTERNAL_IP} # 將 EXTERNAL_P 替換為你之前看到的外部 IP
```

<!--
The output shows the message generated by the backend:
-->
輸出顯示後端生成的訊息：

```json
{"message":"Hello"}
```

## {{% heading "cleanup" %}}

<!--
To delete the Services, enter this command:
-->
要刪除服務，輸入下面的命令：

```shell
kubectl delete services frontend backend
```

<!--
To delete the Deployments, the ReplicaSets and the Pods that are running the backend and frontend applications, enter this command:
-->
要刪除在前端和後端應用中執行的 Deployment、ReplicaSet 和 Pod，輸入下面的命令：

```shell
kubectl delete deployment frontend backend
```
## {{% heading "whatsnext" %}}

<!--
* Learn more about [Services](/docs/concepts/services-networking/service/)
* Learn more about [ConfigMaps](/docs/tasks/configure-pod-container/configure-pod-configmap/)
* Learn more about [DNS for Service and Pods](/docs/concepts/services-networking/dns-pod-service/)
-->
* 進一步瞭解 [Service](/zh-cn/docs/concepts/services-networking/service/)
* 進一步瞭解 [ConfigMap](/zh-cn/docs/tasks/configure-pod-container/configure-pod-configmap/)
* 進一步瞭解 [Service 和 Pods 的 DNS](/zh-cn/docs/concepts/services-networking/dns-pod-service/)

