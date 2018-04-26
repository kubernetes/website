---
cn-approvers:
- zhangqx2010
cn-reviewers:
- chentao1596
title: 为集群中的应用提供负载均衡访问
---
<!--
---
title: Provide Load-Balanced Access to an Application in a Cluster
---
-->

{% capture overview %}

<!--
This page shows how to create a Kubernetes Service object that provides
load-balanced access to an application running in a cluster.
-->
本文描述如何创建 Kubernetes Service 对象，用于对集群中运行的应用程序提供负载均衡访问。

{% endcapture %}


{% capture prerequisites %}

{% include task-tutorial-prereqs.md %}

{% endcapture %}


{% capture objectives %}

<!--
* Run two instances of a Hello World application
* Create a Service object
* Use the Service object to access the running application
-->
* 运行两个 Hello World 应用实例
* 创建 Service 对象
* 使用 Service 对象访问应用

{% endcapture %}


{% capture lessoncontent %}

<!--
## Creating a Service for an application running in two pods

1. Run a Hello World application in your cluster:

       kubectl run hello-world --replicas=2 --labels="run=load-balancer-example" --image=gcr.io/google-samples/node-hello:1.0  --port=8080

1. List the pods that are running the Hello World application:

       kubectl get pods --selector="run=load-balancer-example"

    The output is similar to this:

       NAME                           READY     STATUS    RESTARTS   AGE
       hello-world-2189936611-8fyp0   1/1       Running   0          6m
       hello-world-2189936611-9isq8   1/1       Running   0          6m

1. List the replica set for the two Hello World pods:

       kubectl get replicasets --selector="run=load-balancer-example"

    The output is similar to this:

       NAME                     DESIRED   CURRENT   AGE
       hello-world-2189936611   2         2         12m

1. Create a Service object that exposes the replica set:

       kubectl expose rs <your-replica-set-name> --type="LoadBalancer" --name="example-service"

    where `<your-replica-set-name>` is the name of your replica set.

1. Display the IP addresses for your service:

       kubectl get services example-service

   The output shows the internal IP address and the external IP address of
   your service. If the external IP address shows as `<pending>`, repeat the
   command.

   Note: If you are using Minikube, you don't get an external IP address. The
   external IP address remains in the pending state.

       NAME              CLUSTER-IP   EXTERNAL-IP   PORT(S)    AGE
       example-service   10.0.0.160   <pending>     8080/TCP   40s

1. Use your Service object to access the Hello World application:

       curl <your-external-ip-address>:8080

    where `<your-external-ip-address>` is the external IP address of your
    service.

    The output is a hello message from the application:

       Hello Kubernetes!

    Note: If you are using Minikube, enter these commands:

       kubectl cluster-info
       kubectl describe services example-service

    The output displays the IP address of your Minikube node and the NodePort
    value for your service. Then enter this command to access the Hello World
    application:

       curl <minikube-node-ip-address>:<service-node-port>

    where `<minikube-node-ip-address>` us the IP address of your Minikube node,
    and `<service-node-port>` is the NodePort value for your service.
-->
## 为运行在两个 Pod 中的应用创建 Service

1. 在集群中运行 Hello World 应用：

       kubectl run hello-world --replicas=2 --labels="run=load-balancer-example" --image=gcr.io/google-samples/node-hello:1.0  --port=8080

1. 查看运行 Hello World 应用的两个 Pod：

       kubectl get pods --selector="run=load-balancer-example"

    输出类似于:

       NAME                           READY     STATUS    RESTARTS   AGE
       hello-world-2189936611-8fyp0   1/1       Running   0          6m
       hello-world-2189936611-9isq8   1/1       Running   0          6m

1. 查看两个 Hello World Pod 的 replica set：

       kubectl get replicasets --selector="run=load-balancer-example"

    输出类似于:

       NAME                     DESIRED   CURRENT   AGE
       hello-world-2189936611   2         2         12m

1. 创建 Service 对象用于暴露 replica set：

       kubectl expose rs <your-replica-set-name> --type="LoadBalancer" --name="example-service"

    其中 `<your-replica-set-name>` 是 replica set 的名字。

1. 查看 Service 的 IP 地址：

       kubectl get services example-service

   输出会显示 Service 的内部 IP 地址和外部 IP 地址。如果外部地址显示为 `<pending>`，重复上述命令。

   注意：如果使用 Minikube，就不会有外部 IP 地址。外部 IP 地址将会一直是 pending 状态。

       NAME              CLUSTER-IP   EXTERNAL-IP   PORT(S)    AGE
       example-service   10.0.0.160   <pending>     8080/TCP   40s

1. 使用 Service 对象访问 Hello World 应用：

       curl <your-external-ip-address>:8080

   其中 `<your-external-ip-address>` 就是 Service 的外部 IP 地址。

   输出是一个来自应用的 hello 消息：

       Hello Kubernetes!

   注意： 如果使用 Minikube，使用如下命令：

       kubectl cluster-info
       kubectl describe services example-service

   输出会显示 Minikube node 的 IP 地址和 service 的 NodePort。然后使用这条命令访问应用：

       curl <minikube-node-ip-address>:<service-node-port>

   其中 `<minikube-node-ip-address>` 使用 Minikube node 的 IP 地址，`<service-node-port>` 是 service 的 NodePort 值。

<!--
## Using a service configuration file

As an alternative to using `kubectl expose`, you can use a
[service configuration file](/docs/user-guide/services/operations)
to create a Service.
-->
## 使用 service 配置文件

除了使用 `kubectl expose` 之外，也可以使用 [service 配置文件](/docs/user-guide/services/operations) 创建 Service。

{% endcapture %}


{% capture whatsnext %}

<!--
Learn more about
[connecting applications with services](/docs/concepts/services-networking/connect-applications-service/).
-->
更多信息参见 [使用 services 连接应用](/docs/concepts/services-networking/connect-applications-service/)。
{% endcapture %}

{% include templates/tutorial.md %}
