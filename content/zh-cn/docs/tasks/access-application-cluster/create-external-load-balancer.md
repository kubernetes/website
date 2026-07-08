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
This page shows how to create an external load balancer.
-->
本文展示如何创建一个外部负载均衡器。

<!--
When creating a {{< glossary_tooltip text="Service" term_id="service" >}}, you have
the option of automatically creating a cloud load balancer. This provides an
externally-accessible IP address that sends traffic to the correct port on your cluster
nodes,
_provided your cluster runs in a supported environment and is configured with
the correct cloud load balancer provider package_.
-->
创建{{< glossary_tooltip text="服务" term_id="service" >}}时，你可以选择自动创建云网络负载均衡器。
负载均衡器提供外部可访问的 IP 地址，可将流量发送到集群节点上的正确端口上
（**假设集群在支持的环境中运行，并配置了正确的云负载均衡器驱动包**）。

<!--
You can also use an {{< glossary_tooltip term_id="ingress" >}} in place of Service.
For more information, check the [Ingress](/docs/concepts/services-networking/ingress/)
documentation.
-->
你还可以使用 {{< glossary_tooltip text="Ingress" term_id="ingress" >}} 代替 Service。
更多信息，请参阅 [Ingress](/zh-cn/docs/concepts/services-networking/ingress/) 文档。

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

<!--
Your cluster must be running in a cloud or other environment that already has support
for configuring external load balancers.
-->
你的集群必须在已经支持配置外部负载均衡器的云或其他环境中运行。

<!-- steps -->

<!--
## Create a Service

### Create a Service from a manifest

To create an external load balancer, add the following line to your
Service manifest:
-->
## 创建服务   {#create-a-service}

### 基于清单文件创建服务   {#create-a-service-from-a-manifest}

要创建外部负载均衡器，请将以下内容添加到你的 Service 清单文件：

```yaml
    type: LoadBalancer
```

<!--
Your manifest might then look like:
-->
你的清单文件可能会如下所示：

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
### Create a Service using kubectl

You can alternatively create the service with the `kubectl expose` command and
its `--type=LoadBalancer` flag:
-->
### 使用 kubectl 创建 Service   {#create-a-service-using-kubectl}

你也可以使用 `kubectl expose` 命令及其 `--type=LoadBalancer` 参数创建服务：

```bash
kubectl expose deployment example --port=8765 --target-port=9376 \
        --name=example-service --type=LoadBalancer
```

<!--
This command creates a new Service using the same selectors as the referenced
resource (in the case of the example above, a
{{< glossary_tooltip text="Deployment" term_id="deployment" >}} named `example`).

For more information, including optional flags, refer to the
[`kubectl expose` reference](/docs/reference/generated/kubectl/kubectl-commands/#expose).
-->
此命令通过使用与引用资源（在上面的示例的情况下，名为 `example` 的
{{< glossary_tooltip text="Deployment" term_id="deployment" >}}）
相同的选择器来创建一个新的服务。

更多信息（包括更多的可选参数），请参阅
[`kubectl expose` 指南](/docs/reference/generated/kubectl/kubectl-commands/#expose)。

<!--
## Finding your IP address

You can find the IP address created for your service by getting the service
information through `kubectl`:
-->
## 找到你的 IP 地址   {#finding-your-ip-address}

你可以通过 `kubectl` 获取服务信息，找到为你的服务创建的 IP 地址：

```bash
kubectl describe services example-service
```

<!--
which should produce output similar to:
-->
这将获得类似如下输出：

```
Name:                     example-service
Namespace:                default
Labels:                   app=example
Annotations:              <none>
Selector:                 app=example
Type:                     LoadBalancer
IP Families:              <none>
IP:                       10.3.22.96
IPs:                      10.3.22.96
LoadBalancer Ingress:     192.0.2.89
Port:                     <unset>  8765/TCP
TargetPort:               9376/TCP
NodePort:                 <unset>  30593/TCP
Endpoints:                172.17.0.3:9376
Session Affinity:         None
External Traffic Policy:  Cluster
Events:                   <none>
```

<!--
The load balancer's IP address is listed next to `LoadBalancer Ingress`.
-->
负载均衡器的 IP 地址列在 `LoadBalancer Ingress` 旁边。

{{< note >}}
<!--
If you are running your service on Minikube, you can find the assigned IP address and port with:
-->
如果你在 Minikube 上运行服务，你可以通过以下命令找到分配的 IP 地址和端口：

```bash
minikube service example-service --url
```
{{< /note >}}

<!--
## Preserving the client source IP

By default, the source IP seen in the target container is *not the original
source IP* of the client. To enable preservation of the client IP, the following
fields can be configured in the `.spec` of the Service:
-->
## 保留客户端源 IP   {#preserving-the-client-source-ip}

默认情况下，目标容器中看到的源 IP 将**不是客户端的原始源 IP**。
要启用保留客户端 IP，可以在服务的 `.spec` 中配置以下字段：

<!--
* `.spec.externalTrafficPolicy` - denotes if this Service desires to route
  external traffic to node-local or cluster-wide endpoints. There are two available
  options: `Cluster` (default) and `Local`. `Cluster` obscures the client source
  IP and may cause a second hop to another node, but should have good overall
  load-spreading. `Local` preserves the client source IP and avoids a second hop
  for LoadBalancer and NodePort type Services, but risks potentially imbalanced
  traffic spreading.
-->
* `.spec.externalTrafficPolicy` - 表示此 Service 是否希望将外部流量路由到节点本地或集群范围的端点。
  有两个可用选项：`Cluster`（默认）和 `Local`。
  `Cluster` 隐藏了客户端源 IP，可能导致第二跳到另一个节点，但具有良好的整体负载分布。
  `Local` 保留客户端源 IP 并避免 LoadBalancer 和 NodePort 类型服务的第二跳，
  但存在潜在的不均衡流量传播风险。

<!--
* `.spec.healthCheckNodePort` - specifies the health check node port
  (numeric port number) for the service. If you don't specify
  `healthCheckNodePort`, the service controller allocates a port from your
  cluster's NodePort range.
  You can configure that range by setting an API server command line option,
  `--service-node-port-range`. The Service will use the user-specified
  `healthCheckNodePort` value if you specify it, provided that the
  Service `type` is set to LoadBalancer and `externalTrafficPolicy` is set
  to `Local`.
-->
* `.spec.healthCheckNodePort` - 指定服务的 healthcheck nodePort（数字端口号）。
  如果你未指定 `healthCheckNodePort`，服务控制器从集群的 NodePort 范围内分配一个端口。
  你可以通过设置 API 服务器的命令行选项 `--service-node-port-range` 来配置上述范围。
  在服务 `type` 设置为 LoadBalancer 并且 `externalTrafficPolicy` 设置为 `Local` 时，
  Service 将会使用用户指定的 `healthCheckNodePort` 值（如果你指定了它）。

<!--
Setting `externalTrafficPolicy` to Local in the Service manifest
activates this feature. For example:
-->
可以通过在服务的清单文件中将 `externalTrafficPolicy` 设置为 Local 来激活此功能。比如：

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
### Caveats and limitations when preserving source IPs

Load balancing services from some cloud providers do not let you configure different weights for each target.

With each target weighted equally in terms of sending traffic to Nodes, external
traffic is not equally load balanced across different Pods. The external load balancer
is unaware of the number of Pods on each node that are used as a target.
-->
### 保留源 IP 时的注意事项和限制   {#caveats-and-limitations-when-preserving-source-ips}

一些云服务供应商的负载均衡服务不允许你为每个目标配置不同的权重。

由于每个目标在向节点发送流量方面的权重相同，因此外部流量不会在不同 Pod 之间平均负载。
外部负载均衡器不知道每个节点上用作目标的 Pod 数量。

<!--
Where `NumServicePods <<  NumNodes` or `NumServicePods >> NumNodes`, a fairly close-to-equal
distribution will be seen, even without weights.

Internal pod to pod traffic should behave similar to ClusterIP services, with equal probability across all pods.
-->
在 `NumServicePods <<  NumNodes` 或 `NumServicePods >> NumNodes` 时，
即使没有权重，也会看到接近相等的分布。

内部 Pod 到 Pod 的流量应该与 ClusterIP 服务类似，所有 Pod 的概率相同。

<!--
## Garbage collecting load balancers
-->
## 回收负载均衡器   {#garbage-collecting-load-balancers}

{{< feature-state for_k8s_version="v1.17" state="stable" >}}

<!--
In usual case, the correlating load balancer resources in cloud provider should
be cleaned up soon after a LoadBalancer type Service is deleted. But it is known
that there are various corner cases where cloud resources are orphaned after the
associated Service is deleted. Finalizer Protection for Service LoadBalancers was
introduced to prevent this from happening. By using finalizers, a Service resource
will never be deleted until the correlating load balancer resources are also deleted.
-->
在通常情况下，应在删除 LoadBalancer 类型 Service 后立即清除云服务供应商中的相关负载均衡器资源。
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
## External load balancer providers

It is important to note that the datapath for this functionality is provided by a load balancer external to the Kubernetes cluster.
-->
## 外部负载均衡器供应商   {#external-load-balancer-providers}

请务必注意，此功能的数据路径由 Kubernetes 集群外部的负载均衡器提供。

<!--
When the Service `type` is set to LoadBalancer, Kubernetes provides functionality equivalent to `type` equals ClusterIP to pods
within the cluster and extends it by programming the (external to Kubernetes) load balancer with entries for the nodes
hosting the relevant Kubernetes pods. The Kubernetes control plane automates the creation of the external load balancer,
health checks (if needed), and packet filtering rules (if needed). Once the cloud provider allocates an IP address for the load
balancer, the control plane looks up that external IP address and populates it into the Service object.
-->
当服务 `type` 设置为 LoadBalancer 时，Kubernetes 向集群中的 Pod 提供的功能等同于
`type` 设置为 ClusterIP，并通过使用托管了相关 Kubernetes Pod 的节点作为条目对负载均衡器
（从外部到 Kubernetes）进行编程来扩展它。
Kubernetes 控制平面自动创建外部负载均衡器、健康检查（如果需要）和包过滤规则（如果需要）。
一旦云服务供应商为负载均衡器分配了 IP 地址，控制平面就会查找该外部 IP 地址并将其填充到 Service 对象中。

## {{% heading "whatsnext" %}}

<!--
* Follow the [Connecting Applications with Services](/docs/tutorials/services/connect-applications-service/) tutorial
* Read about [Service](/docs/concepts/services-networking/service/)
* Read about [Ingress](/docs/concepts/services-networking/ingress/)
-->
* 遵循教程[使用 Service 连接到应用](/zh-cn/docs/tutorials/services/connect-applications-service/)
* 阅读[服务](/zh-cn/docs/concepts/services-networking/service/)
* 阅读 [Ingress](/zh-cn/docs/concepts/services-networking/ingress/)
