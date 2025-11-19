---
title: 探索 Pod 及其端點的終止行爲
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
一旦你參照[使用 Service 連接到應用](/zh-cn/docs/tutorials/services/connect-applications-service/)中概述的那些步驟使用
Service 連接到了你的應用，你就有了一個持續運行的多副本應用暴露在了網路上。
本教程幫助你瞭解 Pod 的終止流程，探索實現連接排空的幾種方式。

<!-- body -->

<!--
## Termination process for Pods and their endpoints

There are often cases when you need to terminate a Pod - be it to upgrade or scale down.
In order to improve application availability, it may be important to implement
a proper active connections draining.

This tutorial explains the flow of Pod termination in connection with the
corresponding endpoint state and removal by using
a simple nginx web server to demonstrate the concept.
-->
## Pod 及其端點的終止過程   {#termination-process-for-pods-and-endpoints}

你經常會遇到需要終止 Pod 的場景，例如爲了升級或縮容。
爲了改良應用的可用性，實現一種合適的活躍連接排空機制變得重要。

本教程將通過使用一個簡單的 nginx Web 伺服器演示此概念，
解釋 Pod 終止的流程及其與相應端點狀態和移除的聯繫。

<!-- body -->

<!--
## Example flow with endpoint termination

The following is the example flow described in the
[Termination of Pods](/docs/concepts/workloads/pods/pod-lifecycle/#pod-termination)
document.

Let's say you have a Deployment containing a single `nginx` replica
(say just for the sake of demonstration purposes) and a Service:
-->
## 端點終止的示例流程   {#example-flow-with-endpoint-termination}

以下是 [Pod 終止](/zh-cn/docs/concepts/workloads/pods/pod-lifecycle/#pod-termination)文檔中所述的流程示例。

假設你有包含單個 nginx 副本（僅用於演示目的）的一個 Deployment 和一個 Service：

{{% code_sample file="service/pod-with-graceful-termination.yaml" %}}

{{% code_sample file="service/explore-graceful-termination-nginx.yaml" %}}

<!--
Now create the Deployment Pod and Service using the above files:
-->
現在使用以上文件創建 Deployment Pod 和 Service：

```shell
kubectl apply -f pod-with-graceful-termination.yaml
kubectl apply -f explore-graceful-termination-nginx.yaml
```

<!--
Once the Pod and Service are running, you can get the name of any associated EndpointSlices:
-->
一旦 Pod 和 Service 開始運行，你就可以獲取對應的所有 EndpointSlices 的名稱：

```shell
kubectl get endpointslice
```

<!--
The output is similar to this:
-->
輸出類似於：

```none
NAME                  ADDRESSTYPE   PORTS   ENDPOINTS                 AGE
nginx-service-6tjbr   IPv4          80      10.12.1.199,10.12.1.201   22m
```

<!--
You can see its status, and validate that there is one endpoint registered:
-->
你可以查看其 status 並驗證已經有一個端點被註冊：

```shell
kubectl get endpointslices -o json -l kubernetes.io/service-name=nginx-service
```

<!--
The output is similar to this:
-->
輸出類似於：

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
現在讓我們終止這個 Pod 並驗證該 Pod 正在遵從體面終止期限的設定進行終止：

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
輸出類似於：

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
你可以看到新的 Pod 已被調度。

當系統在爲新的 Pod 創建新的端點時，舊的端點仍處於 Terminating 狀態：

```shell
kubectl get endpointslice -o json nginx-service-6tjbr
```

<!--
The output is similar to this:
-->
輸出類似於：

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
and clients (such as load balancers) to implement connection draining functionality.
These clients may detect terminating endpoints and implement a special logic for them.
-->
這種設計使得應用可以在終止期間公佈自己的狀態，而客戶端（如負載均衡器）則可以實現連接排空功能。
這些客戶端可以檢測到正在終止的端點，併爲這些端點實現特殊的邏輯。

<!--
In Kubernetes, endpoints that are terminating always have their `ready` status set as `false`.
This needs to happen for backward
compatibility, so existing load balancers will not use it for regular traffic.
If traffic draining on terminating pod is needed, the actual readiness can be
checked as a condition `serving`.

When Pod is deleted, the old endpoint will also be deleted.
-->
在 Kubernetes 中，正在終止的端點始終將其 `ready` 狀態設置爲 `false`。
這是爲了滿足向後兼容的需求，確保現有的負載均衡器不會將 Pod 用於常規流量。
如果需要排空正被終止的 Pod 上的流量，可以將 `serving` 狀況作爲實際的就緒狀態。

當 Pod 被刪除時，舊的端點也會被刪除。

## {{% heading "whatsnext" %}}

<!--
* Learn how to [Connect Applications with Services](/docs/tutorials/services/connect-applications-service/)
* Learn more about [Using a Service to Access an Application in a Cluster](/docs/tasks/access-application-cluster/service-access-application-cluster/)
* Learn more about [Connecting a Front End to a Back End Using a Service](/docs/tasks/access-application-cluster/connecting-frontend-backend/)
* Learn more about [Creating an External Load Balancer](/docs/tasks/access-application-cluster/create-external-load-balancer/)
-->
* 瞭解如何[使用 Service 連接到應用](/zh-cn/docs/tutorials/services/connect-applications-service/)
* 進一步瞭解[使用 Service 訪問叢集中的應用](/zh-cn/docs/tasks/access-application-cluster/service-access-application-cluster/)
* 進一步瞭解[使用 Service 把前端連接到後端](/zh-cn/docs/tasks/access-application-cluster/connecting-frontend-backend/)
* 進一步瞭解[創建外部負載均衡器](/zh-cn/docs/tasks/access-application-cluster/create-external-load-balancer/)
