---
title: 创建外部负载均衡器
content_type: task
weight: 80
---

<!--
title: Create an External Load Balancer
content_type: task
weight: 80
-->

<!-- overview -->

<!--
This page shows how to create an External Load Balancer.
-->
本文展示如何创建一个外部负载均衡器。

<!-- 
This feature is only available for cloud providers or environments which support external load balancers. 
-->
{{< note >}}
此功能仅适用于支持外部负载均衡器的云提供商或环境。
{{< /note >}}

<!--
When creating a service, you have the option of automatically creating a
cloud network load balancer. This provides an externally-accessible IP address
that sends traffic to the correct port on your cluster nodes
_provided your cluster runs in a supported environment and is configured with
the correct cloud load balancer provider package_.
-->
创建服务时，你可以选择自动创建云网络负载均衡器。这提供了一个外部可访问的 IP 地址，
可将流量分配到集群节点上的正确端口上
（ _假设集群在支持的环境中运行，并配置了正确的云负载平衡器提供商包_）。

<!--
For information on provisioning and using an Ingress resource that can give
services externally-reachable URLs, load balance the traffic, terminate SSL etc.,
please check the [Ingress](/docs/concepts/services-networking/ingress/)
documentation.
-->
有关如何配置和使用 Ingress 资源为服务提供外部可访问的 URL、负载均衡流量、终止 SSL 等功能，
请查看 [Ingress](/zh/docs/concepts/services-networking/ingress/) 文档。

## {{% heading "prerequisites" %}}

* {{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!-- steps -->

<!--
## Configuration file

To create an external load balancer, add the following line to your
[service configuration file](/docs/concepts/services-networking/service/#loadbalancer):
-->
## 配置文件

要创建外部负载均衡器，请将以下内容添加到
[服务配置文件](/zh/docs/concepts/services-networking/service/#loadbalancer)：

```yaml
    type: LoadBalancer
```

<!--
Your configuration file might look like:
-->
你的配置文件可能会如下所示：

```yaml
apiVersion: v1
kind: Service
metadata:
  name: example-service
spec:
  selector:
    app: example
  ports:
    - port: 8765
      targetPort: 9376
  type: LoadBalancer
```

<!--
## Using kubectl

You can alternatively create the service with the `kubectl expose` command and
its `--type=LoadBalancer` flag:
-->
## 使用 kubectl

你也可以使用 `kubectl expose` 命令及其 `--type=LoadBalancer` 参数创建服务：

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

更多信息（包括更多的可选参数），请参阅
[`kubectl expose` 指南](/docs/reference/generated/kubectl/kubectl-commands/#expose)。

<!--
## Finding your IP address

You can find the IP address created for your service by getting the service
information through `kubectl`:
-->
## 找到你的 IP 地址

你可以通过 `kubectl` 获取服务信息，找到为你的服务创建的 IP 地址：

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

<!--
If you are running your service on Minikube, you can find the assigned IP address and port with:
-->
{{< note >}}
如果你在 Minikube 上运行服务，你可以通过以下命令找到分配的 IP 地址和端口：

```bash
minikube service example-service --url
```
{{< /note >}}

<!--
## Preserving the client source IP

Due to the implementation of this feature, the source IP seen in the target
container is *not the original source IP* of the client. To enable
preservation of the client IP, the following fields can be configured in the
service spec (supported in GCE/Google Kubernetes Engine environments):
-->
## 保留客户端源 IP

由于此功能的实现，目标容器中看到的源 IP 将 *不是客户端的原始源 IP*。
要启用保留客户端 IP，可以在服务的 spec 中配置以下字段（支持 GCE/Google Kubernetes Engine  环境）：

<!--
* `service.spec.externalTrafficPolicy` - denotes if this Service desires to route
external traffic to node-local or cluster-wide endpoints. There are two available
options: Cluster (default) and Local. Cluster obscures the client source
IP and may cause a second hop to another node, but should have good overall
load-spreading. Local preserves the client source IP and avoids a second hop
for LoadBalancer and NodePort type services, but risks potentially imbalanced
traffic spreading.
-->
* `service.spec.externalTrafficPolicy` - 表示此服务是否希望将外部流量路由到节点本地或集群范围的端点。
  有两个可用选项：Cluster（默认）和 Local。
  Cluster 隐藏了客户端源 IP，可能导致第二跳到另一个节点，但具有良好的整体负载分布。
  Local 保留客户端源 IP 并避免 LoadBalancer 和 NodePort 类型服务的第二跳，
  但存在潜在的不均衡流量传播风险。

<!--
* `service.spec.healthCheckNodePort` - specifies the health check nodePort
(numeric port number) for the service. If `healthCheckNodePort` isn't specified,
the service controller allocates a port from your cluster's NodePort range. You
can configure that range by setting an API server command line option,
`--service-node-port-range`. It will use the
user-specified `healthCheckNodePort` value if specified by the client. It only has an
effect when `type` is set to LoadBalancer and `externalTrafficPolicy` is set
to Local.
-->
* `service.spec.healthCheckNodePort` - 指定服务的 healthcheck nodePort（数字端口号）。
  如果未指定 `healthCheckNodePort`，服务控制器从集群的 NodePort 范围内分配一个端口。
  你可以通过设置 API 服务器的命令行选项 `--service-node-port-range` 来配置上述范围。
  它将会使用用户指定的 `healthCheckNodePort` 值（如果被客户端指定）。
  仅当 `type`  设置为 LoadBalancer 并且 `externalTrafficPolicy` 设置为 Local 时才生效。

<!--
Setting `externalTrafficPolicy` to Local in the Service configuration file
activates this feature.
-->
可以通过在服务的配置文件中将 `externalTrafficPolicy` 设置为 Local 来激活此功能。

```yaml
apiVersion: v1
kind: Service
metadata:
  name: example-service
spec:
  selector:
    app: example
  ports:
    - port: 8765
      targetPort: 9376
  externalTrafficPolicy: Local
  type: LoadBalancer
```

<!--
## Garbage Collecting Load Balancers

In usual case, the correlating load balancer resources in cloud provider should
be cleaned up soon after a LoadBalancer type Service is deleted. But it is known
that there are various corner cases where cloud resources are orphaned after the
associated Service is deleted. Finalizer Protection for Service LoadBalancers was
introduced to prevent this from happening. By using finalizers, a Service resource
will never be deleted until the correlating load balancer resources are also deleted.
-->
## 回收负载均衡器

在通常情况下，应在删除 LoadBalancer 类型服务后立即清除云提供商中的相关负载均衡器资源。
但是，众所周知，在删除关联的服务后，云资源被孤立的情况很多。
引入了针对服务负载均衡器的终结器保护，以防止这种情况发生。
通过使用终结器，在删除相关的负载均衡器资源之前，也不会删除服务资源。

<!--
Specifically, if a Service has `type` LoadBalancer, the service controller will attach
a finalizer named `service.kubernetes.io/load-balancer-cleanup`.
The finalizer will only be removed after the load balancer resource is cleaned up.
This prevents dangling load balancer resources even in corner cases such as the
service controller crashing.
-->
具体来说，如果服务具有 `type` LoadBalancer，则服务控制器将附加一个名为
`service.kubernetes.io/load-balancer-cleanup` 的终结器。
仅在清除负载均衡器资源后才能删除终结器。
即使在诸如服务控制器崩溃之类的极端情况下，这也可以防止负载均衡器资源悬空。

<!--
## External Load Balancer Providers

It is important to note that the datapath for this functionality is provided by a load balancer external to the Kubernetes cluster.
-->
## 外部负载均衡器提供商

请务必注意，此功能的数据路径由 Kubernetes 集群外部的负载均衡器提供。

<!--
When the Service `type` is set to LoadBalancer, Kubernetes provides functionality equivalent to `type` equals ClusterIP to pods
within the cluster and extends it by programming the (external to Kubernetes) load balancer with entries for the Kubernetes
pods. The Kubernetes service controller automates the creation of the external load balancer, health checks (if needed),
firewall rules (if needed) and retrieves the external IP allocated by the cloud provider and populates it in the service
object.
-->
当服务 `type` 设置为 LoadBalancer 时，Kubernetes 向集群中的 Pod 提供的功能等同于
`type` 等于  ClusterIP，并通过使用 Kubernetes pod 的条目对负载均衡器（从外部到 Kubernetes）
进行编程来扩展它。 
Kubernetes 服务控制器自动创建外部负载均衡器、健康检查（如果需要）、防火墙规则（如果需要），
并获取云提供商分配的外部 IP 并将其填充到服务对象中。

<!--
## Caveats and Limitations when preserving source IPs

GCE/AWS load balancers do not provide weights for their target pools. This was not an issue with the old LB
kube-proxy rules which would correctly balance across all endpoints.
-->
## 保留源 IP 时的注意事项和限制

GCE/AWS 负载均衡器不为其目标池提供权重。
对于旧的 LB kube-proxy 规则来说，这不是一个问题，它可以在所有端点之间正确平衡。

<!--
With the new functionality, the external traffic is not equally load balanced across pods, but rather
equally balanced at the node level (because GCE/AWS and other external LB implementations do not have the ability
for specifying the weight per node, they balance equally across all target nodes, disregarding the number of
pods on each node).
-->
使用新功能，外部流量不会在 pod 之间平均负载，而是在节点级别平均负载
（因为 GCE/AWS 和其他外部 LB 实现无法指定每个节点的权重，
因此它们的平衡跨所有目标节点，并忽略每个节点上的 Pod 数量）。

<!--
We can, however, state that for NumServicePods << NumNodes or NumServicePods >> NumNodes, a fairly close-to-equal
distribution will be seen, even without weights.
-->
但是，我们可以声明，对于 `NumServicePods << NumNodes` 或 `NumServicePods >> NumNodes` 时，
即使没有权重，也会看到接近相等的分布。

<!--
Once the external load balancers provide weights, this functionality can be added to the LB programming path.
*Future Work: No support for weights is provided for the 1.4 release, but may be added at a future date*

Internal pod to pod traffic should behave similar to ClusterIP services, with equal probability across all pods.
-->
一旦外部负载平衡器提供权重，就可以将此功能添加到 LB 编程路径中。
*未来工作：1.4 版本不提供权重支持，但可能会在将来版本中添加*

内部 Pod 到 Pod 的流量应该与 ClusterIP 服务类似，所有 Pod 的概率相同。

