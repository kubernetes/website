<!--
---
title: Create an External Load Balancer
content_template: templates/task
weight: 80
---
-->
---
title: 创建一个外部负载均衡器
content_template: templates/task
weight: 80
---


{{% capture overview %}}

<!--
This page shows how to create an External Load Balancer.

When creating a service, you have the option of automatically creating a
cloud network load balancer. This provides an externally-accessible IP address
that sends traffic to the correct port on your cluster nodes
_provided your cluster runs in a supported environment and is configured with
the correct cloud load balancer provider package_.

For information on provisioning and using an Ingress resource that can give
services externally-reachable URLs, load balance the traffic, terminate SSL etc.,
please check the [Ingress](/docs/concepts/services-networking/ingress/)
documentation.
-->
本文展示如何创建一个外部负载均衡器。

创建服务时，您可以选择自动创建云网络负载均衡器。这提供了一个外部可访问的 IP 地址，可将流量分配到集群节点上的正确端口上 _假设集群在支持的环境中运行，并配置了正确的云负载平衡器提供商包_。

有关如何配置和使用 Ingress 资源以为服务提供外部可访问的 URL、负载均衡流量、终止 SSL 等功能，请查看 [Ingress](/docs/concepts/services-networking/ingress/) 文档。

{{% /capture %}}

{{% capture prerequisites %}}

* {{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

{{% /capture %}}

{{% capture steps %}}

<!--
## Configuration file

To create an external load balancer, add the following line to your
[service configuration file](/docs/concepts/services-networking/service/#type-loadbalancer):
-->
## 配置文件

要创建外部负载均衡器，请将以下内容添加到 [服务配置文件](/docs/concepts/services-networking/service/#type-loadbalancer)：

```json
    "type": "LoadBalancer"
```

<!--
Your configuration file might look like:
-->
您的配置文件可能会如下所示：

```json
    {
      "kind": "Service",
      "apiVersion": "v1",
      "metadata": {
        "name": "example-service"
      },
      "spec": {
        "ports": [{
          "port": 8765,
          "targetPort": 9376
        }],
        "selector": {
          "app": "example"
        },
        "type": "LoadBalancer"
      }
    }
```

<!--
## Using kubectl

You can alternatively create the service with the `kubectl expose` command and
its `--type=LoadBalancer` flag:
-->
## 使用 kubectl

您也可以使用 `kubectl expose` 命令及其 `--type=LoadBalancer` 参数创建服务：

```bash
kubectl expose rc example --port=8765 --target-port=9376 \
        --name=example-service --type=LoadBalancer
```

<!--
This command creates a new service using the same selectors as the referenced
resource (in the case of the example above, a replication controller named
`example`).

For more information, including optional flags, refer to the
[`kubectl expose` reference](/docs/reference/generated/kubectl/kubectl-commands/#expose).
-->
此命令通过使用与引用资源（在上面的示例的情况下，名为 `example` 的 replication controller）相同的选择器来创建一个新的服务。

更多信息（包括更多的可选参数），请参阅 [`kubectl expose` reference](/docs/reference/generated/kubectl/kubectl-commands/#expose)。

<!--
## Finding your IP address

You can find the IP address created for your service by getting the service
information through `kubectl`:
-->
## 找到您的 IP 地址

您可以通过 `kubectl` 获取服务信息，找到为您的服务创建的 IP 地址：

```bash
kubectl describe services example-service
```

<!--
which should produce output like this:
-->
这将获得如下输出：

```bash
    Name:                   example-service
    Namespace:              default
    Labels:                 <none>
    Annotations:            <none>
    Selector:               app=example
    Type:                   LoadBalancer
    IP:                     10.67.252.103
    LoadBalancer Ingress:   192.0.2.89
    Port:                   <unnamed> 80/TCP
    NodePort:               <unnamed> 32445/TCP
    Endpoints:              10.64.0.4:80,10.64.1.5:80,10.64.2.4:80
    Session Affinity:       None
    Events:                 <none>
```

<!--
The IP address is listed next to `LoadBalancer Ingress`.
-->
IP 地址列在 `LoadBalancer Ingress` 旁边。

{{< note >}}
<!--
If you are running your service on Minikube, you can find the assigned IP address and port with:
-->
**注意：** 如果您在 Minikube 上运行服务，您可以通过以下命令找到分配的 IP 地址和端口：
{{< /note >}}
```bash
minikube service example-service --url
```

<!--
## Preserving the client source IP

Due to the implementation of this feature, the source IP seen in the target
container will *not be the original source IP* of the client. To enable
preservation of the client IP, the following fields can be configured in the
service spec (supported in GCE/Google Kubernetes Engine environments):

* `service.spec.externalTrafficPolicy` - denotes if this Service desires to route
external traffic to node-local or cluster-wide endpoints. There are two available
options: "Cluster" (default) and "Local". "Cluster" obscures the client source
IP and may cause a second hop to another node, but should have good overall
load-spreading. "Local" preserves the client source IP and avoids a second hop
for LoadBalancer and NodePort type services, but risks potentially imbalanced
traffic spreading.
* `service.spec.healthCheckNodePort` - specifies the healthcheck nodePort
(numeric port number) for the service. If not specified, healthCheckNodePort is
created by the service API backend with the allocated nodePort. It will use the
user-specified nodePort value if specified by the client. It only has an
effect when type is set to "LoadBalancer" and externalTrafficPolicy is set
to "Local".

This feature can be activated by setting `externalTrafficPolicy` to "Local" in the
Service Configuration file.
-->
## 保留客户端源 IP

由于此功能的实现，目标容器中看到的源 IP 将 *不是客户端的原始源 IP*。要启用保留客户端 IP，可以在服务的 spec 中配置以下字段（支持 GCE/Google Kubernetes Engine  环境）：

* `service.spec.externalTrafficPolicy` - 表示此服务是否希望将外部流量路由到节点本地或集群范围的端点。有两个可用选项："Cluster"（默认）和 "Local"。"Cluster" 隐藏了客户端源 IP，可能导致第二跳到另一个节点，但具有良好的整体负载分布。 "Local" 保留客户端源 IP 并避免 LoadBalancer 和 NodePort 类型服务的第二跳，但存在潜在的不均衡流量传播风险。
* `service.spec.healthCheckNodePort` - 指定服务的 healthcheck nodePort（数字端口号）。如果未指定，则 serviceCheckNodePort 由服务 API 后端使用已分配的 nodePort 创建。如果客户端指定，它将使用客户端指定的 nodePort 值。仅当 type 设置为 "LoadBalancer" 并且 externalTrafficPolicy 设置为 "Local" 时才生效。

可以通过在服务的配置文件中将 `externalTrafficPolicy` 设置为 "Local" 来激活此功能。

```json
    {
      "kind": "Service",
      "apiVersion": "v1",
      "metadata": {
        "name": "example-service"
      },
      "spec": {
        "ports": [{
          "port": 8765,
          "targetPort": 9376
        }],
        "selector": {
          "app": "example"
        },
        "type": "LoadBalancer",
        "externalTrafficPolicy": "Local"
      }
    }
```

<!--
### Feature availability

| k8s version | Feature support |
| :---------: |:-----------:|
| 1.7+ | Supports the full API fields |
| 1.5 - 1.6 | Supports Beta Annotations |
| <1.5 | Unsupported |

Below you could find the deprecated Beta annotations used to enable this feature
prior to its stable version. Newer Kubernetes versions may stop supporting these
after v1.7. Please update existing applications to use the fields directly.

* `service.beta.kubernetes.io/external-traffic` annotation <-> `service.spec.externalTrafficPolicy` field
* `service.beta.kubernetes.io/healthcheck-nodeport` annotation <-> `service.spec.healthCheckNodePort` field

`service.beta.kubernetes.io/external-traffic` annotation has a different set of values
compared to the `service.spec.externalTrafficPolicy` field. The values match as follows:

* "OnlyLocal" for annotation <-> "Local" for field
* "Global" for annotation <-> "Cluster" for field

**Note that this feature is not currently implemented for all cloudproviders/environments.**
-->
### 特性可用性

| k8s 版本    | 特性支持     |
| :---------: |:-----------:|
| 1.7+ | 支持完整的 API 字段 |
| 1.5 - 1.6 | 支持 Beta Annotation |
| <1.5 | 不支持 |

您可以在下面找到已弃用的 Beta annotation，在稳定版本前使用它来使用该功能。较新的 Kubernetes 版本可能会在 v1.7 之后停止支持这些功能。
请更新现有应用程序以直接使用这些字段。

* `service.beta.kubernetes.io/external-traffic` annotation <-> `service.spec.externalTrafficPolicy` 字段
* `service.beta.kubernetes.io/healthcheck-nodeport` annotation <-> `service.spec.healthCheckNodePort` 字段

`service.beta.kubernetes.io/external-traffic` annotation 与 `service.spec.externalTrafficPolicy` 字段相比拥有一组不同的值。值匹配如下：

* "OnlyLocal" annotation <-> "Local" 字段
* "Global" annotation <-> "Cluster" 字段

**请注意，此功能目前尚未实现在所有云提供商/环境中。**

<!--
Known issues:
-->
已知的问题：

* AWS: [kubernetes/kubernetes#35758](https://github.com/kubernetes/kubernetes/issues/35758)
* Weave-Net: [weaveworks/weave/#2924](https://github.com/weaveworks/weave/issues/2924)

{{% /capture %}}

{{% capture discussion %}}

<!--
## External Load Balancer Providers

It is important to note that the datapath for this functionality is provided by a load balancer external to the Kubernetes cluster.

When the service type is set to `LoadBalancer`, Kubernetes provides functionality equivalent to `type=<ClusterIP>` to pods within the cluster and extends it by programming the (external to Kubernetes) load balancer with entries for the Kubernetes pods. The Kubernetes service controller automates the creation of the external load balancer, health checks (if needed), firewall rules (if needed) and retrieves the external IP allocated by the cloud provider and populates it in the service object.
-->
## 外部负载均衡器提供商

请务必注意，此功能的数据路径由 Kubernetes 集群外部的负载均衡器提供。

当服务类型设置为 `LoadBalancer` 时，Kubernetes 向集群中的 pod 提供与 `type=<ClusterIP>` 等效的功能，并通过使用 Kubernetes pod 的条目对负载均衡器（从外部到 Kubernetes）进行编程来扩展它。 Kubernetes 服务控制器自动创建外部负载均衡器，健康检查（如果需要），防火墙规则（如果需要），并获取云提供商分配的外部 IP 并将其填充到服务对象中。

<!--
## Caveats and Limitations when preserving source IPs

GCE/AWS load balancers do not provide weights for their target pools. This was not an issue with the old LB
kube-proxy rules which would correctly balance across all endpoints.

With the new functionality, the external traffic will not be equally load balanced across pods, but rather
equally balanced at the node level (because GCE/AWS and other external LB implementations do not have the ability
for specifying the weight per node, they balance equally across all target nodes, disregarding the number of
pods on each node).

We can, however, state that for NumServicePods << NumNodes or NumServicePods >> NumNodes, a fairly close-to-equal
distribution will be seen, even without weights.

Once the external load balancers provide weights, this functionality can be added to the LB programming path.
*Future Work: No support for weights is provided for the 1.4 release, but may be added at a future date*

Internal pod to pod traffic should behave similar to ClusterIP services, with equal probability across all pods.
-->
## 保留源 IP 时的注意事项和限制

GCE/AWS 负载均衡器不为其目标池提供权重。对于旧的 LB kube-proxy 规则来说，这不是一个问题，它可以在所有端点之间正确平衡。

使用新功能，外部流量不会在 pod 之间平均负载，而是在节点级别平均负载（因为 GCE/AWS 和其他外部 LB 实现无法指定每个节点的权重，因此它们的平衡跨所有目标节点，并忽略每个节点上的 pod 数量）。

但是，我们可以声明，对于 NumServicePods << NumNodes 或 NumServicePods >> NumNodes 时，即使没有权重，也会看到接近相等的分布。

一旦外部负载平衡器提供权重，就可以将此功能添加到 LB 编程路径中。
*未来工作：1.4 版本不提供权重支持，但可能会在将来版本中添加*

内部 pod 到 pod 的流量应该与 ClusterIP 服务类似，所有 pod 的概率相同。

{{% /capture %}}


