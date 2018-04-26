---
title: 创建一个外部负载均衡器
---
<!--
---
title: Create an External Load Balancer
---
-->

{% capture overview %}

<!--
This page shows how to create an External Load Balancer.
 -->
本文描述如何创建一个外部负载均衡设备。

<!--
When creating a service, you have the option of automatically creating a
cloud network load balancer. This provides an
externally-accessible IP address that sends traffic to the correct port on your
cluster nodes _provided your cluster runs in a supported environment and is configured with the correct cloud load balancer provider package_.
 -->
当创建一个服务时，你可以选择自动创建一个云端的网路负载均衡器。这能为外部提供一个可达的 IP 地址，
这个地址会将数据传递到集群节点上正确的服务端口，_但前提是，集群运行在一个可支持负载均衡的环境中，并且对云端的负载均衡正确地进行了配置_。

{% endcapture %}

{% capture prerequisites %}

* {% include task-tutorial-prereqs.md %}

{% endcapture %}

{% capture steps %}

<!--
## Configuration file
 -->
## 配置文件

<!--
To create an external load balancer, add the following line to your
[service configuration file](/docs/user-guide/services/operations/#service-configuration-file):
 -->
创建外部负载均衡器时，请把下面几行添加到 [服务配置文件](/docs/user-guide/services/operations/#service-configuration-file)中:

```json
    "type": "LoadBalancer"
```

<!--
Your configuration file might look like:
 -->
配置文件类似于：

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
-->
## 使用 kubectl

<!--
You can alternatively create the service with the `kubectl expose` command and
its `--type=LoadBalancer` flag:
-->
或者也可以使用 `kubectl expose` 命令和 `--type=LoadBalancer` 参数创建服务：

```bash
kubectl expose rc example --port=8765 --target-port=9376 \
        --name=example-service --type=LoadBalancer
```

<!--
This command creates a new service using the same selectors as the referenced
resource (in the case of the example above, a replication controller named
`example`.)
-->
这个命令使用了相同的 selector 作为关联资源来创建服务（在上面这个例子中，replication controller 的名字为 `example`）：

<!--
For more information, including optional flags, refer to the
[`kubectl expose` reference](/docs/user-guide/kubectl/v1.6/#expose).
 -->
更多信息（包括可选的参数）参考 [`kubectl expose` 手册](/docs/user-guide/kubectl/{{page.version}}/#expose)。

<!--
## Finding your IP address
-->
## 查看 IP 地址

<!--
You can find the IP address created for your service by getting the service
information through `kubectl`:
-->
通过 `kubectl` 可以查看到所创建服务的 IP 地址：

```bash
kubectl describe services example-service
```

<!--
which should produce output like this:
-->
输出应该是这样的：

```bash
    Name:  example-service
    Selector:   app=example
    Type:     LoadBalancer
    IP:     10.67.252.103
    LoadBalancer Ingress: 123.45.678.9
    Port:     <unnamed> 80/TCP
    NodePort:   <unnamed> 32445/TCP
    Endpoints:    10.64.0.4:80,10.64.1.5:80,10.64.2.4:80
    Session Affinity: None
    No events.
```

<!--
The IP address is listed next to `LoadBalancer Ingress`.
-->
IP 地址会显示在 `LoadBalancer Ingress` 右侧。

<!--
## Preserving the client source IP
-->
## 保留客户端源 IP

<!--
Due to the implementation of this feature, the source IP seen in the target
container will *not be the original source IP* of the client. To enable
preservation of the client IP, the following fields can be configured in the
service spec (supported in GCE/GKE environments):
 -->
因为对于这个特性的代码实现的关系，目标容器看到的源 IP *不是客户端的源 IP*。如需要保留客户端源 IP，
可以配置一下这些服务的 spec 字段（GCE/GKE 环境中可支持）：

<!--
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
 -->
* `service.spec.externalTrafficPolicy` - 如果这个服务需要将外部流量路由到
本地节点或者集群级别的端点，那么需要指明该参数。存在两种选项："Cluster"（默认）和 "Local"。
"Cluster" 隐藏源 IP 地址，可能会导致第二跳（second hop）到其他节点，但是全局负载效果较好。"Local"
保留客户端源 IP 地址，避免 LoadBalancer 和 NodePort 类型服务的第二跳，但是可能会导致负载不平衡。
* `service.spec.healthCheckNodePort` - 定义服务的 healthCheckNodePort (数字端口号)。
如果没有声明，服务 API 后端会用分配的 nodePort 创建 healthCheckNodePort。如果客户端
指定了 nodePort，则会使用用户自定义值。这只有当类型被设置成 "LoadBalancer" 并且
externalTrafficPolicy 被设置成 "Local" 时，才会生效。

<!--
This feature can be activated by setting `externalTrafficPolicy` to "Local" in the
Service Configuration file.
 -->
可用通过将服务的配置文件中的 `externalTrafficPolicy` 参数设置为 "Local" 来激活这个特性。

```json
    {
      "kind": "Service",
      "apiVersion": "v1",
      "metadata": {
        "name": "example-service",
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
-->
### 功能特性可用性

<!--
| k8s version | Feature support |
| :---------: |:-----------:|
| 1.7+ | Supports the full API fields |
| 1.5 - 1.6 | Supports Beta Annotations |
| <1.5 | Unsupported |
-->
| k8s 版本 | 特性功能 |
| :---------: |:-----------:|
| 1.7+ | 支持全 API 字段 |
| 1.5 - 1.6 | 支持 Beta Annotations |
| <1.5 | 不支持 |

<!--
Below you could find the deprecated Beta annotations used to enable this feature
prior to its stable version. Newer Kubernetes versions may stop supporting these
after v1.7. Please update existing applications to use the fields directly.
 -->
可以在下面找到已经被废弃的 Beta 注释（annotation），它们用于在老版本中开启这个功能。
新版本的 Kubernetes 将会在 v1.7 后停止支持这些注释。请更新现有应用直接使用字段（field）。

<!--
* `service.beta.kubernetes.io/external-traffic` annotation <-> `service.spec.externalTrafficPolicy` field
* `service.beta.kubernetes.io/healthcheck-nodeport` annotation <-> `service.spec.healthCheckNodePort` field
 -->
* `service.beta.kubernetes.io/external-traffic` 注释 <-> `service.spec.externalTrafficPolicy` 字段
* `service.beta.kubernetes.io/healthcheck-nodeport` 注释 <-> `service.spec.healthCheckNodePort` 字段

<!--
`service.beta.kubernetes.io/external-traffic` annotation has a different set of values
compared to the `service.spec.externalTrafficPolicy` field. The values match as follows:
 -->
`service.beta.kubernetes.io/external-traffic` 注释相比 `service.spec.externalTrafficPolicy` 字段而言有一套不同的值。值的对应关系如下：

<!--
* "OnlyLocal" for annotation <-> "Local" for field
* "Global" for annotation <-> "Cluster" for field
 -->
* "OnlyLocal" 用于注释 <-> "Local" 用于字段
* "Global" 用于注释 <-> "Cluster" 用于字段

<!--
**Note that this feature is not currently implemented for all cloudproviders/environments.**
 -->
**注意这个特性目前并未在所有云平台/环境中实现。**

{% endcapture %}

{% capture discussion %}

<!--
## External Load Balancer Providers
 -->
## 外部负载均衡提供者

<!--
It is important to note that the datapath for this functionality is provided by a load balancer external to the Kubernetes cluster.
 -->
非常需要注意的是，这个功能的数据路径（datapath）是由 Kubernetes 集群的外部负载均衡器提供的。

<!--
When the service type is set to `LoadBalancer`, Kubernetes provides functionality equivalent to `type=<ClusterIP>` to pods within the cluster
and extends it by programming the (external to Kubernetes) load balancer with entries for the Kubernetes VMs.
The Kubernetes service controller automates the creation of the external load balancer, health checks (if needed),
firewall rules (if needed) and retrieves the external IP allocated by the cloud provider and populates it in the service object.
-->
当服务类型被设置为 `LoadBalancer` 时，Kubernetes 提供的功能等同于 `type=<ClusterIP>` 在集群中对于 pod 的功能，
并且通过使用 Kubernetes 虚拟机入口对负载均衡器（Kubernetes 外部的）编程来对其进行扩展。
Kubernetes 服务控制器自动创建外部负载均衡器，健康检查（如果需要的话），防火墙规则（如果需要的话）并且获取云服务提供商分配的外部 IP 并将其存入服务对象中。

<!--
## Caveats and Limitations when preserving source IPs
 -->
## 使用保留源 IP 的警告和限制

<!--
GCE/AWS load balancers do not provide weights for their target pools. This was not an issue with the old LB
kube-proxy rules which would correctly balance across all endpoints.
 -->
GCE/AWS 负载均衡器不为目标池提供权重。这对于旧的负载均衡 kube-proxy 规则而言不是问题，旧的负载均衡规则依然能正确地平衡所有端点的流量。

<!--
With the new functionality, the external traffic will not be equally load balanced across pods, but rather
equally balanced at the node level (because GCE/AWS and other external LB implementations do not have the ability
for specifying the weight per node, they balance equally across all target nodes, disregarding the number of
pods on each node).
 -->
新功能中，外部的流量不会按照 pod 平均分配，而是在节点（node）层面平均分配（因为 GCE/AWS 和其他外部负载均衡实现没有能力做节点权重，
而是平均地分配给所有目标节点，忽略每个节点上所拥有的 pod 数量）。

<!--
We can, however, state that for NumServicePods << NumNodes or NumServicePods >> NumNodes, a fairly close-to-equal
distribution will be seen, even without weights.
 -->
然而，在 pod 数量（NumServicePods） << 节点数（NumNodes）或者 pod 数量（NumServicePods） >> 节点数（NumNodes）的情况下，即使没有权重策略，我们也可以看到非常接近公平分发的场景。

<!--
Once the external load balancers provide weights, this functionality can be added to the LB programming path.
*Future Work: No support for weights is provided for the 1.4 release, but may be added at a future date*
-->
一旦外部负载均衡提供了权重，这个功能可以添加到负载均衡的编程路径中。
*未来的工作：1.4 版本对于权重没有支持，但是可能会在未来加入这个功能*

<!--
Internal pod to pod traffic should behave similar to ClusterIP services, with equal probability across all pods.
-->
内部 pod 对 pod 的流量应该与 ClusterIP 服务类似，流量对于所有 pod 是均分的。

{% endcapture %}

{% include templates/task.md %}
