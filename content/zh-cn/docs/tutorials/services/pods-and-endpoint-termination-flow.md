---
title: 探索 Pod 及其端点的终止行为
content_type: tutorial
weight: 60
---
<!--
title: Explore Termination Behavior for Pods And Their Endpoints
content_type: tutorial
weight: 60
-->

<!-- overview -->

<!--
Once you connected your Application with Service following steps
like those outlined in [Connecting Applications with Services](/docs/tutorials/services/connect-applications-service/),
you have a continuously running, replicated application, that is exposed on a network.
This tutorial helps you look at the termination flow for Pods and to explore ways to implement
graceful connection draining.
-->
一旦你参照[使用 Service 连接到应用](/zh-cn/docs/tutorials/services/connect-applications-service/)中概述的那些步骤使用
Service 连接到了你的应用，你就有了一个持续运行的多副本应用暴露在了网络上。
本教程帮助你了解 Pod 的终止流程，探索实现连接排空的几种方式。

<!-- body -->

<!--
## Termination process for Pods and their endpoints

There are often cases when you need to terminate a Pod - be it for upgrade or scale down.
In order to improve application availability, it may be important to implement
a proper active connections draining.

This tutorial explains the flow of Pod termination in connection with the
corresponding endpoint state and removal by using
a simple nginx web server to demonstrate the concept.
-->
## Pod 及其端点的终止过程   {#termination-process-for-pods-and-endpoints}

你经常会遇到需要终止 Pod 的场景，例如为了升级或缩容。
为了改良应用的可用性，实现一种合适的活跃连接排空机制变得重要。

本教程将通过使用一个简单的 nginx Web 服务器演示此概念，
解释 Pod 终止的流程及其与相应端点状态和移除的联系。

<!-- body -->

<!--
## Example flow with endpoint termination

The following is the example of the flow described in the
[Termination of Pods](/docs/concepts/workloads/pods/pod-lifecycle/#pod-termination)
document.

Let's say you have a Deployment containing of a single `nginx` replica
(just for demonstration purposes) and a Service:
-->
## 端点终止的示例流程   {#example-flow-with-endpoint-termination}

以下是 [Pod 终止](/zh-cn/docs/concepts/workloads/pods/pod-lifecycle/#pod-termination)文档中所述的流程示例。

假设你有包含单个 nginx 副本（仅用于演示目的）的一个 Deployment 和一个 Service：

{{% code_sample file="service/pod-with-graceful-termination.yaml" %}}

{{% code_sample file="service/explore-graceful-termination-nginx.yaml" %}}

<!--
Now create the Deployment Pod and Service using the above files:
-->
现在使用以上文件创建 Deployment Pod 和 Service：

```shell
kubectl apply -f pod-with-graceful-termination.yaml
kubectl apply -f explore-graceful-termination-nginx.yaml
```

<!--
Once the Pod and Service are running, you can get the name of any associated EndpointSlices:
-->
一旦 Pod 和 Service 开始运行，你就可以获取对应的所有 EndpointSlices 的名称：

```shell
kubectl get endpointslice
```

<!--
The output is similar to this:
-->
输出类似于：

```none
NAME                  ADDRESSTYPE   PORTS   ENDPOINTS                 AGE
nginx-service-6tjbr   IPv4          80      10.12.1.199,10.12.1.201   22m
```

<!--
You can see its status, and validate that there is one endpoint registered:
-->
你可以查看其 status 并验证已经有一个端点被注册：

```shell
kubectl get endpointslices -o json -l kubernetes.io/service-name=nginx-service
```

<!--
The output is similar to this:
-->
输出类似于：

```none
{
    "addressType": "IPv4",
    "apiVersion": "discovery.k8s.io/v1",
    "endpoints": [
        {
            "addresses": [
                "10.12.1.201"
            ],
            "conditions": {
                "ready": true,
                "serving": true,
                "terminating": false
                          }
        }
    ]
}
```

<!--
Now let's terminate the Pod and validate that the Pod is being terminated
respecting the graceful termination period configuration:
-->
现在让我们终止这个 Pod 并验证该 Pod 正在遵从体面终止期限的配置进行终止：

```shell
kubectl delete pod nginx-deployment-7768647bf9-b4b9s
```

<!--
All pods:
-->
查看所有 Pod：

```shell
kubectl get pods
```

<!--
The output is similar to this:
-->
输出类似于：

```none
NAME                                READY   STATUS        RESTARTS      AGE
nginx-deployment-7768647bf9-b4b9s   1/1     Terminating   0             4m1s
nginx-deployment-7768647bf9-rkxlw   1/1     Running       0             8s
```

<!--
You can see that the new pod got scheduled.

While the new endpoint is being created for the new Pod, the old endpoint is
still around in the terminating state:
-->
你可以看到新的 Pod 已被调度。

当系统在为新的 Pod 创建新的端点时，旧的端点仍处于 Terminating 状态：

```shell
kubectl get endpointslice -o json nginx-service-6tjbr
```

<!--
The output is similar to this:
-->
输出类似于：

```none
{
    "addressType": "IPv4",
    "apiVersion": "discovery.k8s.io/v1",
    "endpoints": [
        {
            "addresses": [
                "10.12.1.201"
            ],
            "conditions": {
                "ready": false,
                "serving": true,
                "terminating": true
            },
            "nodeName": "gke-main-default-pool-dca1511c-d17b",
            "targetRef": {
                "kind": "Pod",
                "name": "nginx-deployment-7768647bf9-b4b9s",
                "namespace": "default",
                "uid": "66fa831c-7eb2-407f-bd2c-f96dfe841478"
            },
            "zone": "us-central1-c"
        },
    ]
        {
            "addresses": [
                "10.12.1.202"
            ],
            "conditions": {
                "ready": true,
                "serving": true,
                "terminating": false
            },
            "nodeName": "gke-main-default-pool-dca1511c-d17b",
            "targetRef": {
                "kind": "Pod",
                "name": "nginx-deployment-7768647bf9-rkxlw",
                "namespace": "default",
                "uid": "722b1cbe-dcd7-4ed4-8928-4a4d0e2bbe35"
            },
            "zone": "us-central1-c"
        }
}
```

<!--
This allows applications to communicate their state during termination
and clients (such as load balancers) to implement a connections draining functionality.
These clients may detect terminating endpoints and implement a special logic for them.
-->
这种设计使得应用可以在终止期间公布自己的状态，而客户端（如负载均衡器）则可以实现连接排空功能。
这些客户端可以检测到正在终止的端点，并为这些端点实现特殊的逻辑。

<!--
In Kubernetes, endpoints that are terminating always have their `ready` status set as as `false`.
This needs to happen for backward
compatibility, so existing load balancers will not use it for regular traffic.
If traffic draining on terminating pod is needed, the actual readiness can be
checked as a condition `serving`.

When Pod is deleted, the old endpoint will also be deleted.
-->
在 Kubernetes 中，正在终止的端点始终将其 `ready` 状态设置为 `false`。
这是为了满足向后兼容的需求，确保现有的负载均衡器不会将 Pod 用于常规流量。
如果需要排空正被终止的 Pod 上的流量，可以将 `serving` 状况作为实际的就绪状态。

当 Pod 被删除时，旧的端点也会被删除。

## {{% heading "whatsnext" %}}

<!--
* Learn how to [Connect Applications with Services](/docs/tutorials/services/connect-applications-service/)
* Learn more about [Using a Service to Access an Application in a Cluster](/docs/tasks/access-application-cluster/service-access-application-cluster/)
* Learn more about [Connecting a Front End to a Back End Using a Service](/docs/tasks/access-application-cluster/connecting-frontend-backend/)
* Learn more about [Creating an External Load Balancer](/docs/tasks/access-application-cluster/create-external-load-balancer/)
-->
* 了解如何[使用 Service 连接到应用](/zh-cn/docs/tutorials/services/connect-applications-service/)
* 进一步了解[使用 Service 访问集群中的应用](/zh-cn/docs/tasks/access-application-cluster/service-access-application-cluster/)
* 进一步了解[使用 Service 把前端连接到后端](/zh-cn/docs/tasks/access-application-cluster/connecting-frontend-backend/)
* 进一步了解[创建外部负载均衡器](/zh-cn/docs/tasks/access-application-cluster/create-external-load-balancer/)
