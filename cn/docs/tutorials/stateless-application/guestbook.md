---
title: "示例：使用 Redis 的 PHP Guestbook 应用程序"
assignees:
- ahmetb
- jeffmendoza
---

<!-- 
This example shows how to build a simple, multi-tier web application using Kubernetes and [Docker](https://www.docker.com/).

**Table of Contents**
-->

此示例展示如何使用 Kubernetes 和 [Docker](https://www.docker.com/)构建一个简单的多层 Web 应用程序。

**目录**

<!-- BEGIN MUNGE: GENERATED_TOC -->

<!-- 
  - [Guestbook Example](#guestbook-example)
    - [Prerequisites](#prerequisites)
    - [Quick Start](#quick-start)
    - [Step One: Start up the redis master](#step-one-start-up-the-redis-master)
      - [Define a Deployment](#define-a-deployment)
      - [Define a Service](#define-a-service)
      - [Create a Service](#create-a-service)
      - [Finding a Service](#finding-a-service)
        - [Environment variables](#environment-variables)
        - [DNS service](#dns-service)
      - [Create a Deployment](#create-a-deployment)
      - [Optional Interlude](#optional-interlude)
    - [Step Two: Start up the redis slave](#step-two-start-up-the-redis-slave)
    - [Step Three: Start up the guestbook frontend](#step-three-start-up-the-guestbook-frontend)
      - [Using 'type: LoadBalancer' for the frontend service (cloud-provider-specific)](#using-type-loadbalancer-for-the-frontend-service-cloud-provider-specific)
    - [Step Four: Cleanup](#step-four-cleanup)
    - [Troubleshooting](#troubleshooting)
    - [Appendix: Accessing the guestbook site externally](#appendix-accessing-the-guestbook-site-externally)
      - [Google Compute Engine External Load Balancer Specifics](#google-compute-engine-external-load-balancer-specifics)
-->

  - [Guestbook 示例](#guestbook-示例)
    - [先决条件](#先决条件)
    - [快速开始](#快速开始)
    - [第一步：启动 redis master](#第一步-启动-redis-master)
      - [定义 Deployment](#定义-deployment)
      - [定义 Service](#定义-service)
      - [创建 Service](#创建-service)
      - [Service 发现](#service-发现)
        - [环境变量](#环境变量)
        - [DNS 服务](#dns-服务)
      - [创建 Deployment](#创建-deployment)
      - [小插曲](#小插曲)
    - [第二步：启动 redis slave](#第二步-启动-redis-slave)
    - [第三步：启动 guestbook 的前端](#第三步-启动-guestbook-的前端)
      - [对前端服务使用 'type: LoadBalancer' （特定云提供商）](#对前端服务使用-type-loadbalancer-特定云提供商)
    - [第四步：清理](#第四步-清理)
    - [故障排除](#故障排除)
    - [附录：外部访问 guestbook 站点](#附录-外部访问-guestbook-站点)
      - [Google Compute Engine 外部负载均衡器详细信息](#google-compute-engine-外部负载均衡器详细信息)

<!-- 
The example consists of:

- A web frontend
- A [redis](http://redis.io/) master (for storage), and a replicated set of redis 'slaves'.

The web frontend interacts with the redis master via javascript redis API calls.

**Note**:  If you are running this example on a [Google Container Engine](https://cloud.google.com/container-engine/) installation, see [this Google Container Engine guestbook walkthrough](https://cloud.google.com/container-engine/docs/tutorials/guestbook) instead. The basic concepts are the same, but the walkthrough is tailored to a Container Engine setup.

-->

示例包括:

- 一个 Web 前端
- 一个 [redis](http://redis.io/) master（用于存储）和一个主从复制的 redis 'slaves' 。

Web 前端通过 javascript redis API 调用与 redis master 交互。

**注意**：如果您在 [Google Container Engine](https://cloud.google.com/container-engine/) 中安装运行此示例，
请参阅 [this Google Container Engine guestbook walkthrough](https://cloud.google.com/container-engine/docs/tutorials/guestbook)。 
基本概念是相同的，但是演练是针对 Container Engine 设置的。

<!-- 
### Prerequisites

This example requires a running Kubernetes cluster. First, check that kubectl is properly configured by getting the cluster state:

```console
$ kubectl cluster-info
```

If you see a url response, you are ready to go. If not, read the [Getting Started guides](http://kubernetes.io/docs/getting-started-guides/) for how to get started, and follow the [prerequisites](http://kubernetes.io/docs/user-guide/prereqs/) to install and configure `kubectl`. As noted above, if you have a Google Container Engine cluster set up, read [this example](https://cloud.google.com/container-engine/docs/tutorials/guestbook) instead.

All the files referenced in this example can be downloaded [from GitHub](https://git.k8s.io/examples/guestbook).

-->

### 先决条件

此示例需要运行的 Kubernetes 集群。 首先，通过获取集群状态来检查 kubectl 是否正确配置：

```console
$ kubectl cluster-info
```

如果你看到一个 url 的回显信息，说明你已经准备好了。 如果没有，请阅读[入门指南](http://kubernetes.io/docs/getting-started-guides/)了解如何入门，
并按照[先决条件](http://kubernetes.io/docs/user-guide/prereqs/)来安装和配置 `kubectl` 。 如上所述，如果您设置了 Google Container Engine 集群，
请改为阅读[本示例](https://cloud.google.com/container-engine/docs/tutorials/guestbook)。

本示例中引用的所有文件都可以从 [GitHub](https://git.k8s.io/examples/guestbook) 下载。

<!-- 
### Quick Start

This section shows the simplest way to get the example work. If you want to know the details, you should skip this and read [the rest of the example](#step-one-start-up-the-redis-master).

Start the guestbook with one command:

```console
$ kubectl create -f guestbook/all-in-one/guestbook-all-in-one.yaml
service "redis-master" created
deployment "redis-master" created
service "redis-slave" created
deployment "redis-slave" created
service "frontend" created
deployment "frontend" created
```

Alternatively, you can start the guestbook by running:

```console
$ kubectl create -f guestbook/
```

Then, list all your Services:

```console
$ kubectl get services
NAME           CLUSTER-IP   EXTERNAL-IP   PORT(S)    AGE
frontend       10.0.0.117   <none>        80/TCP     20s
redis-master   10.0.0.170   <none>        6379/TCP   20s
redis-slave    10.0.0.201   <none>        6379/TCP   20s
```

Now you can access the guestbook on each node with frontend Service's `<Cluster-IP>:<PORT>`, e.g. `10.0.0.117:80` in this guide. `<Cluster-IP>` is a cluster-internal IP. If you want to access the guestbook from outside of the cluster, add `type: NodePort` to the frontend Service `spec` field. Then you can access the guestbook with `<NodeIP>:NodePort` from outside of the cluster. On cloud providers which support external load balancers, adding `type: LoadBalancer` to the frontend Service `spec` field will provision a load balancer for your Service. There are several ways for you to access the guestbook. You may learn from [Accessing services running on the cluster](https://kubernetes.io/docs/concepts/cluster-administration/access-cluster/#accessing-services-running-on-the-cluster).

Clean up the guestbook:

```console
$ kubectl delete -f guestbook/all-in-one/guestbook-all-in-one.yaml
```

or

```console
$ kubectl delete -f guestbook/
```

-->

### 快速开始

本节展示了使示例工作最简单的方法。 如果你想知道这些细节，你应该跳过这个并阅读[剩下的例子](#step-one-start-up-the-redis-master)。

用一个命令启动 guestbook ：

```console
$ kubectl create -f guestbook/all-in-one/guestbook-all-in-one.yaml
service "redis-master" created
deployment "redis-master" created
service "redis-slave" created
deployment "redis-slave" created
service "frontend" created
deployment "frontend" created
```

或者，您可以通过运行以下命令启动 guestbook ：

```console
$ kubectl create -f guestbook/
```

然后列出所有 Services ：

```console
$ kubectl get services
NAME           CLUSTER-IP   EXTERNAL-IP   PORT(S)    AGE
frontend       10.0.0.117   <none>        80/TCP     20s
redis-master   10.0.0.170   <none>        6379/TCP   20s
redis-slave    10.0.0.201   <none>        6379/TCP   20s
```

现在，您可以用前端服务的 `<Cluster-IP>:<PORT>` 访问每个节点上的 guestbook ，例如 本指南中的 `10.0.0.117:80` 。 `<Cluster-IP>` 是集群内部的 IP 。 
如果要从集群外部访问 guestbook ，请在前端 Service 的 `spec` 字段中添加 `type: NodePort` 。 然后，您可以从集群外部使用 `<NodeIP>:NodePort` 访问 guestbook 。 
在支持外部负载平衡器的云提供商上，将`type: LoadBalancer`添加到前端 Service 的`spec`字段中将为您的 Service 提供负载均衡器。 有几种访问 guestbook 的方法， 
请参阅[访问集群中运行的服务](https://kubernetes.io/docs/concepts/cluster-administration/access-cluster/#accessing-services-running-on-the-cluster)。

清除 guestbook :

```console
$ kubectl delete -f guestbook/all-in-one/guestbook-all-in-one.yaml
```

或者

```console
$ kubectl delete -f guestbook/
```

<!-- 
### Step One: Start up the redis master

Before continuing to the gory details, we also recommend you to read Kubernetes [concepts and user guide](http://kubernetes.io/docs/user-guide/).
**Note**: The redis master in this example is *not* highly available.  Making it highly available would be an interesting, but intricate exercise — redis doesn't actually support multi-master Deployments at this point in time, so high availability would be a somewhat tricky thing to implement, and might involve periodic serialization to disk, and so on.
-->

### 第一步 启动 redis master

在往下浏览详细细节之前，我们建议您先阅读 Kubernetes [概念和用户指南](http://kubernetes.io/docs/user-guide/)。

**注意**：示例中的 redis master *不是* 高可用的。 使其高可用是一个有趣而复杂的事 - redis 实际上并不支持多 master 的 Deployments ，因此实现高可用这事有点棘手，可能涉及磁盘的定期序列化等等。

<!-- 
#### Define a Deployment

To start the redis master, use the file [redis-master-deployment.yaml](https://git.k8s.io/examples/guestbook/redis-master-deployment.yaml), which describes a single [pod](http://kubernetes.io/docs/user-guide/pods/) running a redis key-value server in a container.

Although we have a single instance of our redis master, we are using a [Deployment](http://kubernetes.io/docs/user-guide/deployments/) to enforce that exactly one pod keeps running. E.g., if the node were to go down, the Deployment will ensure that the redis master gets restarted on a healthy node. (In our simplified example, this could result in data loss.)

The file [redis-master-deployment.yaml](redis-master-deployment.yaml) defines the redis master Deployment:
-->

#### 定义 Deployment

用文件 [redis-master-deployment.yaml](https://git.k8s.io/examples/guestbook/redis-master-deployment.yaml) 启动 redis master ，
该文件描述了一个 [pod](http://kubernetes.io/docs/user-guide/pods/)在容器中运行 redis key-value server 。

虽然我们有一个单独的 redis master 实例，但是我们使用 [Deployment](http://kubernetes.io/docs/user-guide/deployments/) 来强制保证有一个 pod 在运行。 
例如，如果节点要关闭，那么 Deployment 会确保 redis master 在一个健康节点上重新启动。 （我们这个简单示例，会导致数据丢失。）

文件 [redis-master-deployment.yaml](redis-master-deployment.yaml) 定义了redis master 的 Deployment ：

<!-- BEGIN MUNGE: EXAMPLE redis-master-deployment.yaml -->

```yaml
apiVersion: extensions/v1beta1
kind: Deployment
metadata:
  name: redis-master
  # these labels can be applied automatically 
  # from the labels in the pod template if not set
  # labels:
  #   app: redis
  #   role: master
  #   tier: backend
spec:
  # this replicas value is default
  # modify it according to your case
  replicas: 1
  # selector can be applied automatically 
  # from the labels in the pod template if not set
  # selector:
  #   matchLabels:
  #     app: guestbook
  #     role: master
  #     tier: backend
  template:
    metadata:
      labels:
        app: redis
        role: master
        tier: backend
    spec:
      containers:
      - name: master
        image: gcr.io/google_containers/redis:e2e
        resources:
          requests:
            cpu: 100m
            memory: 100Mi
        ports:
        - containerPort: 6379
```

<!-- 
[Download example](https://raw.githubusercontent.com/kubernetes/examples/master/guestbook/redis-master-deployment.yaml)
-->

[下载示例文件](https://raw.githubusercontent.com/kubernetes/examples/master/guestbook/redis-master-deployment.yaml)
<!-- END MUNGE: EXAMPLE redis-master-deployment.yaml -->

<!-- 
#### Define a Service

A Kubernetes [Service](http://kubernetes.io/docs/user-guide/services/) is a named load balancer that proxies traffic to one or more containers. This is done using the [labels](http://kubernetes.io/docs/user-guide/labels/) metadata that we defined in the `redis-master` pod above.  As mentioned, we have only one redis master, but we nevertheless want to create a Service for it. Why? Because it gives us a deterministic way to route to the single master using an elastic IP.

Services find the pods to load balance based on the pods' labels.
The selector field of the Service description determines which pods will receive the traffic sent to the Service, and the `port` and `targetPort` information defines what port the Service proxy will run at.

The file [redis-master-service.yaml](https://git.k8s.io/examples/guestbook/redis-master-deployment.yaml) defines the redis master Service:
-->

#### 定义 Service

Kubernetes [Service](http://kubernetes.io/docs/user-guide/services/) 被命名为负载均衡器，可以将流量代理到一个或多个容器。 
这是使用我们在上面`redis-master`  pod 中定义的 [labels](http://kubernetes.io/docs/user-guide/labels/) metadata 来实现的。 
如上所述，我们只有一个 redis master ，但是我们仍然想为它创建一个 Service 。 
为什么？ 因为它为我们提供了一个使用弹性 IP 路由到单个 master 的确定方法。

Services 可以通过 pod 的 labels 找到 pod 来负载均衡。
Service 描述的 selector 字段确定哪些 pod 将接收发送到 Service 的流量，`port` 和 `targetPort` 信息定义了 Service 代理将运行的端口。

文件 [redis-master-service.yaml](https://git.k8s.io/examples/guestbook/redis-master-deployment.yaml) 定义了 redis master Service:

<!-- BEGIN MUNGE: EXAMPLE redis-master-service.yaml -->

```yaml
apiVersion: v1
kind: Service
metadata:
  name: redis-master
  labels:
    app: redis
    role: master
    tier: backend
spec:
  ports:
    # the port that this service should serve on
  - port: 6379
    targetPort: 6379
  selector:
    app: redis
    role: master
    tier: backend
```

<!-- 
[Download example](https://raw.githubusercontent.com/kubernetes/examples/master/guestbook/redis-master-service.yaml)
-->

[下载示例文件](https://raw.githubusercontent.com/kubernetes/examples/master/guestbook/redis-master-service.yaml)
<!-- END MUNGE: EXAMPLE redis-master-service.yaml -->

<!-- 
#### Create a Service

According to the [config best practices](http://kubernetes.io/docs/user-guide/config-best-practices/), create a Service before corresponding Deployments so that the scheduler can spread the pods comprising the Service. So we first create the Service by running:

```console
$ kubectl create -f guestbook/redis-master-service.yaml
service "redis-master" created
```

Then check the list of services, which should include the redis-master:

```console
$ kubectl get services
NAME              CLUSTER-IP       EXTERNAL-IP       PORT(S)       AGE
redis-master      10.0.76.248      <none>            6379/TCP      1s
```

-->

#### 创建 Service

根据 [config最佳实践](http://kubernetes.io/docs/user-guide/config-best-practices/)，在创建 Deployments 之前创建相应的 Service ，以便调度程序可以传播构成 Service 的 pod 。 
所以我们先创建 Service ：

```console
$ kubectl create -f guestbook/redis-master-service.yaml
service "redis-master" created
```

然后检查 services 列表，其中应包括 redis-master ：

```console
$ kubectl get services
NAME              CLUSTER-IP       EXTERNAL-IP       PORT(S)       AGE
redis-master      10.0.76.248      <none>            6379/TCP      1s
```

<!-- 
This will cause all pods to see the redis master apparently running on `<CLUSTER-IP>:<PORT>`.  A Service can map an incoming port to any `targetPort` in the backend pod.  Once created, the Service proxy on each node is configured to set up a proxy on the specified port (in this case port `6379`).

`targetPort` will default to `port` if it is omitted in the configuration. `targetPort` is the port the container accepts traffic on, and `port` is the abstracted Service port, which can be any port other pods use to access the Service. For simplicity's sake, we omit it in the following configurations.

The traffic flow from slaves to masters can be described in two steps:

  - A *redis slave* will connect to `port` on the *redis master Service*
  - Traffic will be forwarded from the Service `port` (on the Service node) to the `targetPort` on the pod that the Service listens to.

For more details, please see [Connecting applications](http://kubernetes.io/docs/user-guide/connecting-applications/).
-->

可以很明显的看到 redis master 的所有 pods 都运行在 `<CLUSTER-IP>:<PORT>` 上。 一个 Service 可以将一个入站端口映射到后端端口中的任何 'targetPort' 。 
创建后，每个节点上的 Service 代理都设置为指定代理端口（这个示例设置为“6379”端口）。

如果在配置中省略 `targetPort`，`targetPort` 将默认为 `port`。 `targetPort` 是容器接受流量的端口，`port` 是抽象的 Service 端口，
可以是其他 pod 用于访问 Service 的任何端口。 为了简单起见，我们在以下配置中省略它。

从 slaves 到 masters 的流量可以分为两个步骤：

  - *redis slave* 将连接 *redis master Service* 的 `port`
  - 流量将从 Service `port`（ Service 节点）转发到 Service 侦听的 pod 上的 `targetPort` 上。

详情请参阅 [Connecting applications](http://kubernetes.io/docs/user-guide/connecting-applications/).

<!-- 
#### Finding a Service

Kubernetes supports two primary modes of finding a Service — environment variables and DNS.
-->

#### Service 发现

Kubernetes 主要支持两种模式的 Service 发现 - 环境变量和 DNS 。

<!-- 
##### Environment variables

The services in a Kubernetes cluster are discoverable inside other containers via [environment variables](https://kubernetes.io/docs/concepts/services-networking/service/#environment-variables).

-->

##### 环境变量

Kubernetes 集群中的 services 可以通过其他容器内部的 [环境变量](https://kubernetes.io/docs/concepts/services-networking/service/#environment-variables) 来进行服务发现 。

<!-- 
##### DNS service

An alternative is to use the [cluster's DNS service](https://kubernetes.io/docs/concepts/services-networking/service/#dns), if it has been enabled for the cluster.  This lets all pods do name resolution of services automatically, based on the Service name.

This example has been configured to use the DNS service by default.

If your cluster does not have the DNS service enabled, then you can use environment variables by setting the
`GET_HOSTS_FROM` env value in both
[redis-slave-deployment.yaml](https://git.k8s.io/examples/guestbook/redis-slave-deployment.yaml) and [frontend-deployment.yaml](https://git.k8s.io/examples/guestbook/frontend-deployment.yaml)
from `dns` to `env` before you start up the app.
(However, this is unlikely to be necessary. You can check for the DNS service in the list of the cluster's services by
running `kubectl --namespace=kube-system get rc -l k8s-app=kube-dns`.)
Note that switching to env causes creation-order dependencies, since Services need to be created before their clients that require env vars.
-->

##### DNS 服务

如果集群已启用，可以使用另一种方法：[集群 DNS 服务](https://kubernetes.io/docs/concepts/services-networking/service/#dns)。 这将使所有 pod 根据 Service 的名称自动对服务进行解析。

此示例已配置为默认使用 DNS 服务。

如果您的集群没有启用DNS服务，那么您可以先设置 [redis-slave-deployment.yaml](https://git.k8s.io/examples/guestbook/redis-slave-deployment.yaml) 和 [frontend-deployment.yaml](https://git.k8s.io/examples/guestbook/frontend-deployment.yaml)
中的环境变量 `GET_HOSTS_FROM` 的从 `dns` 到 `env` 的环境值，然后再启动应用程序。
（但是，这不是必须的。 您可以通过运行 `kubectl --namespace = kube-system get rc -l k8s-app = kube-dns` 来检查集群服务列表中的 DNS 服务。）
请注意，变换 env 会引发创建顺序依赖关系，因为 Services 需要在他们的客户端需要环境变量之前创建出来。

<!-- 
#### Create a Deployment

Second, create the redis master pod in your Kubernetes cluster by running:

```console
$ kubectl create -f guestbook/redis-master-deployment.yaml
deployment "redis-master" created
```

You can see the Deployment for your cluster by running:

```console
$ kubectl get deployments
NAME           DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
redis-master   1         1         1            1           27s
```

Then, you can list the pods in the cluster, to verify that the master is running:

```console
$ kubectl get pods
```
-->

#### 创建 Deployment

然后，在您的 Kubernetes 集群中创建 redis master pod ，执行如下命令：

```console
$ kubectl create -f guestbook/redis-master-deployment.yaml
deployment "redis-master" created
```

您可以运行以下命令查看集群的 Deployment ：

```console
$ kubectl get deployments
NAME           DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
redis-master   1         1         1            1           27s
```

然后，您可以列出集群中的pod，以验证 master 正在运行：

```console
$ kubectl get pods
```

<!-- 
You'll see all pods in the cluster, including the redis master pod, and the status of each pod.
The name of the redis master will look similar to that in the following list:

```console
NAME                            READY     STATUS    RESTARTS   AGE
redis-master-2353460263-1ecey   1/1       Running   0          1m
...
```

(Note that an initial `docker pull` to grab a container image may take a few minutes, depending on network conditions. A pod will be reported as `Pending` while its image is being downloaded.)

`kubectl get pods` will show only the pods in the default [namespace](http://kubernetes.io/docs/user-guide/namespaces/).  To see pods in all namespaces, run:

```
kubectl get pods --all-namespaces
```

For more details, please see [Configuring containers](http://kubernetes.io/docs/user-guide/configuring-containers/) and [Deploying applications](http://kubernetes.io/docs/user-guide/deploying-applications/).

-->

您将看到集群中的所有pod，包括 redis master pod 和每个 pod 的状态。
redis master 的名字将与以下列表中的名称类似：

```console
NAME                            READY     STATUS    RESTARTS   AGE
redis-master-2353460263-1ecey   1/1       Running   0          1m
...
```

（请注意，根据网络环境，初始的 `docker pull` 拉取容器镜像可能需要几分钟的时间，当镜像下载完后，pod 的状态将会显示为 `Pending` ）。

`kubectl get pods` 只显示默认 [namespace](http://kubernetes.io/docs/user-guide/namespaces/)中的 pod 。 要查看所有 namespaces 中的 pod ，请运行：

```
kubectl get pods --all-namespaces
```

更多详细信息，请参阅[配置容器](http://kubernetes.io/docs/user-guide/configuring-containers/)和[部署应用程序](http://kubernetes.io/docs/user-guide/deploying-applications/)。

<!-- 
#### Optional Interlude

You can get information about a pod, including the machine that it is running on, via `kubectl describe pods/<POD-NAME>`.  E.g., for the redis master, you should see something like the following (your pod name will be different):

-->

#### 小插曲

您可以通过 `kubectl describe pods/<POD-NAME>` 获取有关pod的信息，包括运行的机器。 例如，对于redis master ，您应该看到如下所示（您的pod名称将不同）：

```console
$ kubectl describe pods redis-master-2353460263-1ecey
Name:		redis-master-2353460263-1ecey
Node:		kubernetes-node-m0k7/10.240.0.5
...
Labels:		app=redis,pod-template-hash=2353460263,role=master,tier=backend
Status:		Running
IP:		10.244.2.3
Controllers:	ReplicaSet/redis-master-2353460263
Containers:
  master:
    Container ID:	docker://76cf8115485966131587958ea3cbe363e2e1dcce129e2e624883f393ce256f6c
    Image:		gcr.io/google_containers/redis:e2e
    Image ID:		docker://e5f6c5a2b5646828f51e8e0d30a2987df7e8183ab2c3ed0ca19eaa03cc5db08c
    Port:		6379/TCP
...
```

<!-- 
The `Node` is the name and IP of the machine, e.g. `kubernetes-node-m0k7` in the example above. You can find more details about this node with `kubectl describe nodes kubernetes-node-m0k7`.

If you want to view the container logs for a given pod, you can run:

```console
$ kubectl logs <POD-NAME>
```

These logs will usually give you enough information to troubleshoot.

However, if you should want to SSH to the listed host machine, you can inspect various logs there directly as well.  For example, with Google Compute Engine, using `gcloud`, you can SSH like this:

```console
me@workstation$ gcloud compute ssh <NODE-NAME>
```
-->

`Node` 是机器的名称和 IP ，例如在上面的例子中的 `kubernetes-node-m0k7` 。 您可以使用 `kubectl describe nodes kubernetes-node-m0k7` 命令查找有关此节点的更多详细信息。

如果您要查看某个 pod 的容器日志，可以运行：

```console
$ kubectl logs <POD-NAME>
```

这些日志通常会给您提供足够的信息进行故障排除。

如果您希望 SSH 连接到所列出的主机，以便您可以直接检查各种日志。 例如，如果使用 Google Compute Engine ，使用 `gcloud` ，你可以这样 SSH ：

```console
me@workstation$ gcloud compute ssh <NODE-NAME>
```

<!-- 
Then, you can look at the Docker containers on the remote machine.  You should see something like this (the specifics of the IDs will be different):

```console
me@kubernetes-node-krxw:~$ sudo docker ps
CONTAINER ID        IMAGE                                 COMMAND                 CREATED              STATUS              PORTS                   NAMES
...
0ffef9649265        redis:latest                          "/entrypoint.sh redi"   About a minute ago   Up About a minute                           k8s_master.869d22f3_redis-master-dz33o_default_1449a58a-5ead-11e5-a104-688f84ef8ef6_d74cb2b5
```

If you want to see the logs for a given container, you can run:

```console
$ docker logs <container_id>
```
-->

然后，您可以查看远程机器上的 Docker 容器。 您可能会看到这样的东西（指定的 ID 会有所不同）：

```console
me@kubernetes-node-krxw:~$ sudo docker ps
CONTAINER ID        IMAGE                                 COMMAND                 CREATED              STATUS              PORTS                   NAMES
...
0ffef9649265        redis:latest                          "/entrypoint.sh redi"   About a minute ago   Up About a minute                           k8s_master.869d22f3_redis-master-dz33o_default_1449a58a-5ead-11e5-a104-688f84ef8ef6_d74cb2b5
```

如果要查看某个容器的日志，可以运行：

```console
$ docker logs <container_id>
```

<!-- 
### Step Two: Start up the redis slave

Now that the redis master is running, we can start up its 'read slaves'.

We'll define these as replicated pods as well, though this time — unlike for the redis master — we'll define the number of replicas to be 2.
In Kubernetes, a Deployment is responsible for managing multiple instances of a replicated pod. The Deployment will automatically launch new pods if the number of replicas falls below the specified number.
(This particular replicated pod is a great one to test this with -- you can try killing the Docker processes for your pods directly, then watch them come back online on a new node shortly thereafter.)

Just like the master, we want to have a Service to proxy connections to the redis slaves. In this case, in addition to discovery, the slave Service will provide transparent load balancing to web app clients.

This time we put the Service and Deployment into one [file](http://kubernetes.io/docs/user-guide/managing-deployments/#organizing-resource-configurations). Grouping related objects together in a single file is often better than having separate files.
The specification for the slaves is in [all-in-one/redis-slave.yaml](https://git.k8s.io/examples/guestbook/all-in-one/redis-slave.yaml):
-->

### 第二步 启动 redis slave

现在 redis master 是正在运行的，我们可以启动它的 'read slaves' 。

我们同样会定义为 pod 的副本，尽管这一次 - 与 redis master 不同 - 我们将把 replicas 的数量定义为2。
在 Kubernetes 中，Deployment 负责管理 pod 副本的多个实例。 如果 replicas 的数量低于指定的数量，Deployment 将自动启动新的 pod 。
（这种特殊的 pod 副本是一个非常好的测试工具，您可以直接尝试杀死 pod 的 Docker 进程，然后过一会再查看，它们会在新节点上重新上线。）

就像 master 一样，我们要一个 Service 来代理与 redis slaves 的连接。 在这种情况下，除了服务发现之外，slave Service 将会为 Web 应用程序客户端提供透明的负载平衡。

这次我们将  Service 和 Deployment 放在一个[文件](http://kubernetes.io/docs/user-guide/managing-deployments/#organizing-resource-configurations)中。 
将相关对象放在单独一个文件中通常比分开几个文件更好。
slaves 的规范文档在 [all-in-one/redis-slave.yaml](https://git.k8s.io/examples/guestbook/all-in-one/redis-slave.yaml) 中：

<!-- BEGIN MUNGE: EXAMPLE all-in-one/redis-slave.yaml -->

```yaml
apiVersion: v1
kind: Service
metadata:
  name: redis-slave
  labels:
    app: redis
    role: slave
    tier: backend
spec:
  ports:
    # the port that this service should serve on
  - port: 6379
  selector:
    app: redis
    role: slave
    tier: backend
---
apiVersion: extensions/v1beta1
kind: Deployment
metadata:
  name: redis-slave
  # these labels can be applied automatically
  # from the labels in the pod template if not set
  # labels:
  #   app: redis
  #   role: slave
  #   tier: backend
spec:
  # this replicas value is default
  # modify it according to your case
  replicas: 2
  # selector can be applied automatically
  # from the labels in the pod template if not set
  # selector:
  #   matchLabels:
  #     app: guestbook
  #     role: slave
  #     tier: backend
  template:
    metadata:
      labels:
        app: redis
        role: slave
        tier: backend
    spec:
      containers:
      - name: slave
        image: gcr.io/google_samples/gb-redisslave:v1
        resources:
          requests:
            cpu: 100m
            memory: 100Mi
        env:
        - name: GET_HOSTS_FROM
          value: dns
          # If your cluster config does not include a dns service, then to
          # instead access an environment variable to find the master
          # service's host, comment out the 'value: dns' line above, and
          # uncomment the line below.
          # value: env
        ports:
        - containerPort: 6379
```

[下载示例文件](https://raw.githubusercontent.com/kubernetes/examples/master/guestbook/all-in-one/redis-slave.yaml)
<!-- END MUNGE: EXAMPLE all-in-one/redis-slave.yaml -->

<!-- 
This time the selector for the Service is `app=redis,role=slave,tier=backend`, because that identifies the pods running redis slaves. It is generally helpful to set labels on your Service itself as we've done here to make it easy to locate them with the `kubectl get services -l "app=redis,role=slave,tier=backend"` command. For more information on the usage of labels, see [using-labels-effectively](http://kubernetes.io/docs/user-guide/managing-deployments/#using-labels-effectively).

Now that you have created the specification, create the Service in your cluster by running:
-->

这次 Service 的 selector 是 `app=redis,role=slave,tier=backend` ，因为它是用来识别运行中的 redis slave 的 pod。 为 Service 设置 labels 通常是有用的，
因为我们可以使用 `kubectl get services -l "app=redis,role=slave,tier=backend"` 命令轻松找到它们。 
有关 labels 使用的更多信息，请参阅 [using-labels-effectively](http://kubernetes.io/docs/user-guide/managing-deployments/#using-labels-effectively)。

现在您已经创建了规范，通过运行以下命令在集群中创建 Service ：

```console
$ kubectl create -f guestbook/all-in-one/redis-slave.yaml
service "redis-slave" created
deployment "redis-slave" created

$ kubectl get services
NAME           CLUSTER-IP     EXTERNAL-IP   PORT(S)    AGE
redis-master   10.0.76.248    <none>        6379/TCP   20m
redis-slave    10.0.112.188   <none>        6379/TCP   16s

$ kubectl get deployments
NAME           DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
redis-master   1         1         1            1           22m
redis-slave    2         2         2            2           2m
```

<!-- 
Once the Deployment is up, you can list the pods in the cluster, to verify that the master and slaves are running.  You should see a list that includes something like the following:

```console
$ kubectl get pods
NAME                            READY     STATUS    RESTARTS   AGE
redis-master-2353460263-1ecey   1/1       Running   0          35m
redis-slave-1691881626-dlf5f    1/1       Running   0          15m
redis-slave-1691881626-sfn8t    1/1       Running   0          15m
```

You should see a single redis master pod and two redis slave pods.  As mentioned above, you can get more information about any pod with: `kubectl describe pods/<POD_NAME>`. And also can view the resources on [kube-ui](http://kubernetes.io/docs/user-guide/ui/).

-->

当 Deployment 运行后，您可以列出集群中的 pod ，以验证 master 和 slaves 是否正在运行。 您可以看到类似于以下内容的清单：

```console
$ kubectl get pods
NAME                            READY     STATUS    RESTARTS   AGE
redis-master-2353460263-1ecey   1/1       Running   0          35m
redis-slave-1691881626-dlf5f    1/1       Running   0          15m
redis-slave-1691881626-sfn8t    1/1       Running   0          15m
```

您会看到一个redis master pod 和两个 redis slave pod。 如上所述，您可以运行 `kubectl describe pods/<POD_NAME>` 获取有关任何一个 pod 的更多信息。 
还可以查看 [kube-ui](http://kubernetes.io/docs/user-guide/ui/) 上的资源。

<!-- 
### Step Three: Start up the guestbook frontend

A frontend pod is a simple PHP server that is configured to talk to either the slave or master services, depending on whether the client request is a read or a write. It exposes a simple AJAX interface, and serves an Angular-based UX.
Again we'll create a set of replicated frontend pods instantiated by a Deployment — this time, with three replicas.

As with the other pods, we now want to create a Service to group the frontend pods.
The Deployment and Service are described in the file [all-in-one/frontend.yaml](https://git.k8s.io/examples/guestbook/all-in-one/frontend.yaml):
-->

### 第三步 启动 guestbook 的前端

前端 pod 是一个简单的 PHP 服务器，配置为 slave 和 master 之间的 services 进行通信，具体取决于客户端的请求是读取还是写入的。 它暴露了一个简单的 AJAX 接口，并提供 Angular-based UX 服务。
然后，我们将用 Deployment 创建由前端 pod 副本组成的实例 - 这次有3个 replicas 。

与其他 pod 一样，我们现在想创建一个 Service 来分组前端 pod 。
Deployment 和 Service 的配置文档 [all-in-one/frontend.yaml](https://git.k8s.io/examples/guestbook/all-in-one/frontend.yaml):

<!-- BEGIN MUNGE: EXAMPLE all-in-one/frontend.yaml -->

```yaml
apiVersion: v1
kind: Service
metadata:
  name: frontend
  labels:
    app: guestbook
    tier: frontend
spec:
  # if your cluster supports it, uncomment the following to automatically create
  # an external load-balanced IP for the frontend service.
  # type: LoadBalancer
  ports:
    # the port that this service should serve on
  - port: 80
  selector:
    app: guestbook
    tier: frontend
---
apiVersion: extensions/v1beta1
kind: Deployment
metadata:
  name: frontend
  # these labels can be applied automatically
  # from the labels in the pod template if not set
  # labels:
  #   app: guestbook
  #   tier: frontend
spec:
  # this replicas value is default
  # modify it according to your case
  replicas: 3
  # selector can be applied automatically
  # from the labels in the pod template if not set
  # selector:
  #   matchLabels:
  #     app: guestbook
  #     tier: frontend
  template:
    metadata:
      labels:
        app: guestbook
        tier: frontend
    spec:
      containers:
      - name: php-redis
        image: gcr.io/google-samples/gb-frontend:v4
        resources:
          requests:
            cpu: 100m
            memory: 100Mi
        env:
        - name: GET_HOSTS_FROM
          value: dns
          # If your cluster config does not include a dns service, then to
          # instead access environment variables to find service host
          # info, comment out the 'value: dns' line above, and uncomment the
          # line below.
          # value: env
        ports:
        - containerPort: 80
```

[下载示例文件](https://raw.githubusercontent.com/kubernetes/examples/master/guestbook/all-in-one/frontend.yaml)
<!-- END MUNGE: EXAMPLE all-in-one/frontend.yaml -->

<!-- 
#### Using 'type: LoadBalancer' for the frontend service (cloud-provider-specific)

For supported cloud providers, such as Google Compute Engine or Google Container Engine, you can specify to use an external load balancer
in the service `spec`, to expose the service onto an external load balancer IP.
To do this, uncomment the `type: LoadBalancer` line in the [all-in-one/frontend.yaml](https://git.k8s.io/examples/guestbook/all-in-one/frontend.yaml) file before you start the service.

[See the appendix below](#appendix-accessing-the-guestbook-site-externally) on accessing the guestbook site externally for more details.

Create the service and Deployment like this:

```console
$ kubectl create -f guestbook/all-in-one/frontend.yaml
service "frontend" created
deployment "frontend" created
```
-->

#### 对前端服务使用 'type: LoadBalancer' (特定云提供商)

对于支持此服务的云提供商（如 Google Compute Engine 或 Google Container Engine ），您可以在service 的 `spec` 中指定使用外部负载均衡器，将 service 暴露到外部负载均衡器的 IP 。
为此，在启动 service 之前，请取消 [all-in-one/frontend.yaml](https://git.k8s.io/examples/guestbook/all-in-one/frontend.yaml) 文件中的 `type: LoadBalancer` 行的注释。

有关 guestbook 站点外部访问的更多详细信息[请参阅下面的附录](#附录：外部访问 guestbook 站点) 。

这样创建 service 和 Deployment:

```console
$ kubectl create -f guestbook/all-in-one/frontend.yaml
service "frontend" created
deployment "frontend" created
```

<!-- 
Then, list all your services again:

```console
$ kubectl get services
NAME           CLUSTER-IP     EXTERNAL-IP   PORT(S)    AGE
frontend       10.0.63.63     <none>        80/TCP     1m
redis-master   10.0.76.248    <none>        6379/TCP   39m
redis-slave    10.0.112.188   <none>        6379/TCP   19m
```

Also list all your Deployments:

```console
$ kubectl get deployments 
NAME           DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
frontend       3         3         3            3           2m
redis-master   1         1         1            1           39m
redis-slave    2         2         2            2           20m
```
-->

然后，再次列出所有 services ：

```console
$ kubectl get services
NAME           CLUSTER-IP     EXTERNAL-IP   PORT(S)    AGE
frontend       10.0.63.63     <none>        80/TCP     1m
redis-master   10.0.76.248    <none>        6379/TCP   39m
redis-slave    10.0.112.188   <none>        6379/TCP   19m
```

同时列出所有 Deployments :

```console
$ kubectl get deployments 
NAME           DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
frontend       3         3         3            3           2m
redis-master   1         1         1            1           39m
redis-slave    2         2         2            2           20m
```

<!-- 
Once it's up, i.e. when desired replicas match current replicas (again, it may take up to thirty seconds to create the pods), you can list the pods with specified labels in the cluster, to verify that the master, slaves and frontends are all running. You should see a list containing pods with label 'tier' like the following:

```console
$ kubectl get pods -L tier
NAME                            READY     STATUS    RESTARTS   AGE       TIER
frontend-1211764471-4e1j2       1/1       Running   0          4m        frontend
frontend-1211764471-gkbkv       1/1       Running   0          4m        frontend
frontend-1211764471-rk1cf       1/1       Running   0          4m        frontend
redis-master-2353460263-1ecey   1/1       Running   0          42m       backend
redis-slave-1691881626-dlf5f    1/1       Running   0          22m       backend
redis-slave-1691881626-sfn8t    1/1       Running   0          22m       backend
```

You should see a single redis master pod, two redis slaves, and three frontend pods.

The code for the PHP server that the frontends are running is in `examples/guestbook/php-redis/guestbook.php`.  It looks like this:
-->

一旦启动，即当期望的 replicas 数量与当前的 replicas 不一致时（再次创建pod可能需要三十秒），您可以在集群中列出具有指定 labels 的 pod ，以验证 master 、 slaves 和前端都在运行。 
您可以看到 label 为 'tier' 的所有pod的列表，如下所示：

```console
$ kubectl get pods -L tier
NAME                            READY     STATUS    RESTARTS   AGE       TIER
frontend-1211764471-4e1j2       1/1       Running   0          4m        frontend
frontend-1211764471-gkbkv       1/1       Running   0          4m        frontend
frontend-1211764471-rk1cf       1/1       Running   0          4m        frontend
redis-master-2353460263-1ecey   1/1       Running   0          42m       backend
redis-slave-1691881626-dlf5f    1/1       Running   0          22m       backend
redis-slave-1691881626-sfn8t    1/1       Running   0          22m       backend
```

你应该看到一个 redis master pod ，两个 redis slaves pods 和三个前端 pods 。
前端正在运行的 PHP 服务器的代码位于 `examples/guestbook/php-redis/guestbook.php` 中。 类似这样：

```php
<?

set_include_path('.:/usr/local/lib/php');

error_reporting(E_ALL);
ini_set('display_errors', 1);

require 'Predis/Autoloader.php';

Predis\Autoloader::register();

if (isset($_GET['cmd']) === true) {
  $host = 'redis-master';
  if (getenv('GET_HOSTS_FROM') == 'env') {
    $host = getenv('REDIS_MASTER_SERVICE_HOST');
  }
  header('Content-Type: application/json');
  if ($_GET['cmd'] == 'set') {
    $client = new Predis\Client([
      'scheme' => 'tcp',
      'host'   => $host,
      'port'   => 6379,
    ]);

    $client->set($_GET['key'], $_GET['value']);
    print('{"message": "Updated"}');
  } else {
    $host = 'redis-slave';
    if (getenv('GET_HOSTS_FROM') == 'env') {
      $host = getenv('REDIS_SLAVE_SERVICE_HOST');
    }
    $client = new Predis\Client([
      'scheme' => 'tcp',
      'host'   => $host,
      'port'   => 6379,
    ]);

    $value = $client->get($_GET['key']);
    print('{"data": "' . $value . '"}');
  }
} else {
  phpinfo();
} ?>
```

<!-- 
Note the use of the `redis-master` and `redis-slave` host names -- we're finding those Services via the Kubernetes cluster's DNS service, as discussed above.  All the frontend replicas will write to the load-balancing redis-slaves service, which can be highly replicated as well.
-->

请注意，如果使用 `redis-master` 和 `redis-slave' 的主机名 - 我们可以通过Kubernetes集群的 DNS 服务找到这些 Services 。 所有前端的 replicas 将写入负载均衡 redis-slave service，这也是高可用的。

<!-- 
### Step Four: Cleanup

If you are in a live Kubernetes cluster, you can just kill the pods by deleting the Deployments and Services. Using labels to select the resources to delete is an easy way to do this in one command.

```console
$ kubectl delete deployments,services -l "app in (redis, guestbook)"
```

To completely tear down a Kubernetes cluster, if you ran this from source, you can use:

```console
$ <kubernetes>/cluster/kube-down.sh
```
-->

### 第四步 清理

如果你在一个运行中的 Kubernetes 集群，你可以通过删除 Deployments 和 Services 来杀死pod。 使用 labels 来选择要删除的资源也是一种简单的方法。

```console
$ kubectl delete deployments,services -l "app in (redis, guestbook)"
```

要完全停止 Kubernetes 集群，如果您是用源代码运行的，可以使用：

```console
$ <kubernetes>/cluster/kube-down.sh
```

<!-- 
### Troubleshooting

If you are having trouble bringing up your guestbook app, double check that your external IP is properly defined for your frontend Service, and that the firewall for your cluster nodes is open to port 80.

Then, see the [troubleshooting documentation](http://kubernetes.io/docs/troubleshooting/) for a further list of common issues and how you can diagnose them.
-->

### 故障排除

如果您无法启动您的 guestbook 应用程序，请仔细检查您的外部IP是否正确定义了您的前端 Service ，并且集群节点的防火墙是否打开了80端口。

然后，请参阅[故障排除文档](http://kubernetes.io/docs/troubleshooting/)以进一步获取常见问题的列表以及如何诊断它们。

<!-- 
### Appendix: Accessing the guestbook site externally

You'll want to set up your guestbook Service so that it can be accessed from outside of the internal Kubernetes network. Above, we introduced one way to do that, by setting `type: LoadBalancer` to Service `spec`.

More generally, Kubernetes supports two ways of exposing a Service onto an external IP address: `NodePort`s and `LoadBalancer`s , as described [here](https://kubernetes.io/docs/concepts/services-networking/service/#publishing-services---service-types).

If the `LoadBalancer` specification is used, it can take a short period for an external IP to show up in `kubectl get services` output, but you should then see it listed as well, e.g. like this:
-->

### 附录 外部访问 guestbook 站点

您将需要设置您的 guestbook Service ，以便可以从 Kubernetes 外部网络访问。 上面我们介绍了一种方法，通过设置 Service `spec` 中的 `type: LoadBalancer` 。
更普遍的，Kubernetes 支持将 Service 暴露在外部 IP 地址上的两种方式：`NodePort` 和 `LoadBalancer` ，详情请浏览[这里](https://kubernetes.io/docs/concepts/services-networking/service/#publishing-services---service-types)。
如果使用了 `LoadBalancer`，外部IP可能很快就会显示在 `kubectl get services` 命令的回显信息中，您之后可以看到类似于这样的列表：

```console
$ kubectl get services
NAME           CLUSTER-IP     EXTERNAL-IP   PORT(S)    AGE
frontend       10.0.63.63     23.236.59.54  80/TCP     1m
redis-master   10.0.76.248    <none>        6379/TCP   39m
redis-slave    10.0.112.188   <none>        6379/TCP   19m
```

<!-- 
Once you've exposed the service to an external IP, visit the IP to see your guestbook in action, i.e. `http://<EXTERNAL-IP>:<PORT>`.

You should see a web page that looks something like this (without the messages).  Try adding some entries to it!

<img width="50%" src="http://amy-jo.storage.googleapis.com/images/gb_k8s_ex1.png">

If you are more advanced in the ops arena, you can also manually get the service IP from looking at the output of `kubectl get pods,services`, and modify your firewall using standard tools and services (firewalld, iptables, selinux) which you are already familiar with.
-->

一旦您将 service 暴露给外部 IP ，请使用 IP 来访问您的 guestbook ，即`http://<EXTERNAL-IP>:<PORT>` 。

您应该看到一个看起来像这样的网页（没有消息）。 尝试添加一些内容！

<img width="50%" src="http://amy-jo.storage.googleapis.com/images/gb_k8s_ex1.png">

如果您更深入在ops场曩，您还可以查看 `kubectl get pods,services` 的输出来手动获取服务 IP ，并修改防火墙的标准工具和服务 (firewalld, iptables, selinux) 。

<!-- 
#### Google Compute Engine External Load Balancer Specifics

In Google Compute Engine, Kubernetes automatically creates forwarding rules for services with `LoadBalancer`.

You can list the forwarding rules like this (the forwarding rule also indicates the external IP):

```console
$ gcloud compute forwarding-rules list
NAME                  REGION      IP_ADDRESS     IP_PROTOCOL TARGET
frontend              us-central1 130.211.188.51 TCP         us-central1/targetPools/frontend
```

In Google Compute Engine, you also may need to open the firewall for port 80 using the [console][cloud-console] or the `gcloud` tool. The following command will allow traffic from any source to instances tagged `kubernetes-node` (replace with your tags as appropriate):

```console
$ gcloud compute firewall-rules create --allow=tcp:80 --target-tags=kubernetes-node kubernetes-node-80
```
-->

#### Google Compute Engine 外部负载均衡器详细信息

在 Google Compute Engine 中，Kubernetes 会自动为 `LoadBalancer` 创建 services 的转发规则。

您可以列出这样的转发规则（转发规则也表示外部IP）：

```console
$ gcloud compute forwarding-rules list
NAME                  REGION      IP_ADDRESS     IP_PROTOCOL TARGET
frontend              us-central1 130.211.188.51 TCP         us-central1/targetPools/frontend
```

在Google Compute Engine中，您还可能需要使用 [console][cloud-console] 或 `gcloud` 工具打开防火墙的80端口。 以下命令将允许流量从任何源到 tagged 为 `kubernetes-node`的实例（适当替换为您的 tags ）：

```console
$ gcloud compute firewall-rules create --allow=tcp:80 --target-tags=kubernetes-node kubernetes-node-80
```

<!-- 
For GCE Kubernetes startup details, see the [Getting started on Google Compute Engine](http://kubernetes.io/docs/getting-started-guides/gce/)

For Google Compute Engine details about limiting traffic to specific sources, see the [Google Compute Engine firewall documentation][gce-firewall-docs].

[cloud-console]: https://console.developer.google.com
[gce-firewall-docs]: https://cloud.google.com/compute/docs/networking#firewalls
-->

对于GCE Kubernetes的启动细节，请参阅[开始使用 Google Compute Engine](http://kubernetes.io/docs/getting-started-guides/gce/)

有关Google Compute Engine限制特定源的流量的详细信息，请参阅[Google Compute Engine防火墙文档][gce-firewall-docs].

[cloud-console]: https://console.developer.google.com
[gce-firewall-docs]: https://cloud.google.com/compute/docs/networking#firewalls

<!-- BEGIN MUNGE: GENERATED_ANALYTICS -->
[![Analytics](https://kubernetes-site.appspot.com/UA-36037335-10/GitHub/examples/guestbook/README.md?pixel)]()
<!-- END MUNGE: GENERATED_ANALYTICS -->
