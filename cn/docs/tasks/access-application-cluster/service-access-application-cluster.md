---
title: 使用 service 访问群集中的应用程序
redirect_from:
- "/docs/user-guide/quick-start/"
- "/docs/user-guide/quick-start.html"
- "/docs/tutorials/stateless-application/expose-external-ip-address-service/"
- "/docs/tutorials/stateless-application/expose-external-ip-address-service.html"
cn-approvers:
- rootsongjc
cn-reviewers:
- rootsongjc
---

{% capture overview %}

<!--

This page shows how to create a Kubernetes Service object that external
clients can use to access an application running in a cluster. The Service
provides load balancing for an application that has two running instances.

-->

此页向您展示如何创建 Kubernetes Service 对象，外部客户端可以使用它来访问集群中运行的应用程序。该 Service 可以为具有两个运行实例的应用程序提供负载均衡。


{% endcapture %}


{% capture prerequisites %}

{% include task-tutorial-prereqs.md %}

{% endcapture %}

{% capture objectives %}

<!--

* Run two instances of a Hello World application.
* Create a Service object that exposes a node port.
* Use the Service object to access the running application.

-->

- 运行 Hello World 应用程序的两个实例。
- 创建一个暴露节点端口的 Service 对象。
- 使用 Service 对象访问正在运行的应用程序。


{% endcapture %}

{% capture lessoncontent %}

<!--

## Creating a service for an application running in two pods

1. Run a Hello World application in your cluster:

        kubectl run hello-world --replicas=2 --labels="run=load-balancer-example" --image=gcr.io/google-samples/node-hello:1.0  --port=8080

    The preceding command creates a
    [Deployment](/docs/concepts/workloads/controllers/deployment/)
    object and an associated
    [ReplicaSet](/docs/concepts/workloads/controllers/replicaset/)
    object. The ReplicaSet has two
    [Pods](/docs/concepts/workloads/pods/pod/),
    each of which runs the Hello World application.

2. Display information about the Deployment:

        kubectl get deployments hello-world
        kubectl describe deployments hello-world

3. Display information about your ReplicaSet objects:

        kubectl get replicasets
        kubectl describe replicasets

4. Create a Service object that exposes the deployment:

        kubectl expose deployment hello-world --type=NodePort --name=example-service

5. Display information about the Service:

        kubectl describe services example-service

    The output is similar to this:

        Name:                   example-service
        Namespace:              default
        Labels:                 run=load-balancer-example
        Selector:               run=load-balancer-example
        Type:                   NodePort
        IP:                     10.32.0.16
        Port:                   <unset> 8080/TCP
        NodePort:               <unset> 31496/TCP
        Endpoints:              10.200.1.4:8080,10.200.2.5:8080
        Session Affinity:       None
        No events.

    Make a note of the NodePort value for the service. For example,
    in the preceding output, the NodePort value is 31496.

6. List the pods that are running the Hello World application:

        kubectl get pods --selector="run=load-balancer-example" --output=wide

    The output is similar to this:

        NAME                           READY   STATUS    ...  IP           NODE
        hello-world-2895499144-bsbk5   1/1     Running   ...  10.200.1.4   worker1
        hello-world-2895499144-m1pwt   1/1     Running   ...  10.200.2.5   worker2

7. Get the public IP address of one of your nodes that is running
   a Hello World pod. How you get this address depends on how you set
   up your cluster. For example, if you are using Minikube, you can
   see the node address by running `kubectl cluster-info`. If you are
   using Google Compute Engine instances, you can use the
   `gcloud compute instances list` command to see the public addresses of your
   nodes.

8. On your chosen node, create a firewall rule that allows TCP traffic
   on your node port. For example, if your Service has a NodePort value of
   31568, create a firewall rule that allows TCP traffic on port 31568.

9. Use the node address and node port to access the Hello World application:

        curl http://<public-node-ip>:<node-port>

    where `<public-node-ip>` is the public IP address of your node,
    and `<node-port>` is the NodePort value for your service.

    The response to a successful request is a hello message:

        Hello Kubernetes!

-->

## 为在两个 pod 中运行的应用程序创建 service

1. 在集群中运行 Hello World 应用程序：

   ```
   kubectl run hello-world --replicas=2 --labels="run=load-balancer-example" --image=gcr.io/google-samples/node-hello:1.0  --port=8080
   ```

   上述命令创建一个 [Deployment](/docs/concepts/workloads/controllers/deployment/) 对象和一个相关联的 [ReplicaSet](/docs/concepts/workloads/controllers/replicaset/) 对象。该 ReplicaSet 有两个 [Pod](/docs/concepts/workloads/pods/pod/)，每个 Pod 中都运行一个 Hello World 应用程序。

2. 显示关于该 Deployment 的信息：

   ```
   kubectl get deployments hello-world
   kubectl describe deployments hello-world
   ```

3. 显示 ReplicaSet 的信息：

   ```
   kubectl get replicasets
   kubectl describe replicasets
   ```

4. 创建一个暴露该 Deployment 的 Service 对象：

   ```
    kubectl expose deployment hello-world --type=NodePort --name=example-service
   ```

5. 显示该 Service 的信息：

   ```
    kubectl describe services example-service
   ```

   输出类似于：

   ```
    Name:                   example-service
    Namespace:              default
    Labels:                 run=load-balancer-example
    Selector:               run=load-balancer-example
    Type:                   NodePort
    IP:                     10.32.0.16
    Port:                   <unset> 8080/TCP
    NodePort:               <unset> 31496/TCP
    Endpoints:              10.200.1.4:8080,10.200.2.5:8080
    Session Affinity:       None
    No events.
   ```

    记下服务的 NodePort 值。例如，在前面的输出中，NodePort 值为 31496。

6. 列出运行 Hello World 应用程序的 Pod：

   ```
    kubectl get pods --selector="run=load-balancer-example" --output=wide
   ```

   输出类似于：

   ```
    NAME                           READY   STATUS    ...  IP           NODE
    hello-world-2895499144-bsbk5   1/1     Running   ...  10.200.1.4   worker1
    hello-world-2895499144-m1pwt   1/1     Running   ...  10.200.2.5   worker2
   ```

7. 获取正在运行 Hello World 应用程序的 Pod 的其中一个节点的 public IP 地址。如何得到这个地址取决于您的集群设置。例如，如果您使用 Minikube，可以通过运行 `kubectl cluster-info` 查看节点地址。如果您是使用 Google Compute Engine 实例，可以使用 `gcloud compute instances list` 命令查看您的公共地址节点。

8. 在您选择的节点上，在您的节点端口上例如创建允许 TCP 流量的防火墙规则，如果您的服务 NodePort 值为 31568，创建防火墙规则，允许端口 31568 上的TCP流量。

9. 使用节点地址和节点端口访问 Hello World 应用程序：

   ```
    curl http://<public-node-ip>:<node-port>
   ```

   其中 `<public-node-ip>` 是您节点的 public IP地址，而 `<node-port>` 是您服务的 NodePort 值。

   对成功请求的响应是一个 hello 消息：

   ```
    Hello Kubernetes!
   ```



<!--

## Using a service configuration file

As an alternative to using `kubectl expose`, you can use a
[service configuration file](/docs/user-guide/services/operations)
to create a Service.

{% endcapture %}


{% capture cleanup %}

To delete the Service, enter this command:

    kubectl delete services example-service

To delete the Deployment, the ReplicaSet, and the Pods that are running
the Hello World application, enter this command:

    kubectl delete deployment hello-world

{% endcapture %}


{% capture whatsnext %}

Learn more about
[connecting applications with services](/docs/concepts/services-networking/connect-applications-service/).
{% endcapture %}

{% include templates/tutorial.md %}

-->

## 使用 Service 配置文件

作为使用 `kubectl expose` 的替代方法，您可以使用 [service 配置文件](/docs/user-guide/services/operations) 来创建 Service。

{% endcapture %}

{% capture cleanup %}

要删除 Service，输入以下命令：

```
kubectl delete services example-service
```

删除 Deployment、ReplicaSet 和正运行在 Pod 中的 Hello World 应用程序，输入以下命令：

```
kubectl delete deployment hello-world
```

{% endcapture %}

{% capture whatsnext %}

了解更多关于 [使用 service 连接应用程序](/docs/concepts/services-networking/connect-applications-service/)。

{% endcapture %}

{% include templates/tutorial.md %}