---
title: 网络策略
content_type: concept
api_metadata:
  - apiVersion: "networking.k8s.io/v1"
    kind: "NetworkPolicy"
weight: 70
description: >-
  如果你希望在 IP 地址或端口层面（OSI 第 3 层或第 4 层）控制网络流量，
  NetworkPolicy 可以让你为集群内以及 Pod 与外界之间的网络流量指定规则。
  你的集群必须使用支持 NetworkPolicy 实施的网络插件。
---

<!--
reviewers:
- thockin
- caseydavenport
- danwinship
title: Network Policies
content_type: concept
api_metadata:
- apiVersion: "networking.k8s.io/v1"
  kind: "NetworkPolicy"
weight: 70
description: >-
  If you want to control traffic flow at the IP address or port level (OSI layer 3 or 4),
  NetworkPolicies allow you to specify rules for traffic flow within your cluster, and
  also between Pods and the outside world.
  Your cluster must use a network plugin that supports NetworkPolicy enforcement.
-->

<!-- overview -->

<!--
If you want to control traffic flow at the IP address or port level for TCP, UDP, and SCTP protocols,
then you might consider using Kubernetes NetworkPolicies for particular applications in your cluster.
NetworkPolicies are an application-centric construct which allow you to specify how a
{{< glossary_tooltip text="pod" term_id="pod">}} is allowed to communicate with various network
"entities" (we use the word "entity" here to avoid overloading the more common terms such as
"endpoints" and "services", which have specific Kubernetes connotations) over the network.
NetworkPolicies apply to a connection with a pod on one or both ends, and are not relevant to
other connections.
-->
如果你希望针对 TCP、UDP 和 SCTP 协议在 IP 地址或端口层面控制网络流量，
则你可以考虑为集群中特定应用使用 Kubernetes 网络策略（NetworkPolicy）。
NetworkPolicy 是一种以应用为中心的结构，允许你设置如何允许
{{< glossary_tooltip text="Pod" term_id="pod">}} 与网络上的各类网络“实体”
（我们这里使用实体以避免过度使用诸如“端点”和“服务”这类常用术语，
这些术语在 Kubernetes 中有特定含义）通信。
NetworkPolicy 适用于一端或两端与 Pod 的连接，与其他连接无关。

<!--
The entities that a Pod can communicate with are identified through a combination of the following
three identifiers:

1. Other pods that are allowed (exception: a pod cannot block access to itself)
1. Namespaces that are allowed
1. IP blocks (exception: traffic to and from the node where a Pod is running is always allowed,
   regardless of the IP address of the Pod or the node)
-->
Pod 可以与之通信的实体是通过如下三个标识符的组合来辩识的：

1. 其他被允许的 Pod（例外：Pod 无法阻塞对自身的访问）
2. 被允许的名字空间
3. IP 组块（例外：与 Pod 运行所在的节点的通信总是被允许的，
   无论 Pod 或节点的 IP 地址）

<!--
When defining a pod- or namespace-based NetworkPolicy, you use a
{{< glossary_tooltip text="selector" term_id="selector">}} to specify what traffic is allowed to
and from the Pod(s) that match the selector.

Meanwhile, when IP-based NetworkPolicies are created, we define policies based on IP blocks (CIDR ranges).
-->
在定义基于 Pod 或名字空间的 NetworkPolicy 时，
你会使用{{< glossary_tooltip text="选择算符" term_id="selector">}}来设定哪些流量可以进入或离开与该算符匹配的 Pod。

另外，当创建基于 IP 的 NetworkPolicy 时，我们基于 IP 组块（CIDR 范围）来定义策略。

<!-- body -->

<!--
## Prerequisites

Network policies are implemented by the [network plugin](/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins/).
To use network policies, you must be using a networking solution which supports NetworkPolicy.
Creating a NetworkPolicy resource without a controller that implements it will have no effect.
-->
## 前置条件   {#prerequisites}

网络策略通过[网络插件](/zh-cn/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins/)来实现。
要使用网络策略，你必须使用支持 NetworkPolicy 的网络解决方案。
创建一个 NetworkPolicy 资源对象而没有控制器来使它生效的话，是没有任何作用的。

<!--
## The two Sorts of Pod isolation

There are two sorts of isolation for a pod: isolation for egress, and isolation for ingress.
They concern what connections may be established. "Isolation" here is not absolute, rather it
means "some restrictions apply". The alternative, "non-isolated for $direction", means that no
restrictions apply in the stated direction. The two sorts of isolation (or not) are declared
independently, and are both relevant for a connection from one pod to another.
-->
## Pod 隔离的两种类型   {#the-two-sorts-of-pod-isolation}

Pod 有两种隔离：出口的隔离和入口的隔离。它们涉及到可以建立哪些连接。
这里的“隔离”不是绝对的，而是意味着“有一些限制”。
另外的，“非隔离方向”意味着在所述方向上没有限制。这两种隔离（或不隔离）是独立声明的，
并且都与从一个 Pod 到另一个 Pod 的连接有关。

<!--
By default, a pod is non-isolated for egress; all outbound connections are allowed.
A pod is isolated for egress if there is any NetworkPolicy that both selects the pod and has
"Egress" in its `policyTypes`; we say that such a policy applies to the pod for egress.
When a pod is isolated for egress, the only allowed connections from the pod are those allowed by
the `egress` list of some NetworkPolicy that applies to the pod for egress. Reply traffic for those
allowed connections will also be implicitly allowed.
The effects of those `egress` lists combine additively.
-->
默认情况下，一个 Pod 的出口是非隔离的，即所有外向连接都是被允许的。如果有任何的 NetworkPolicy
选择该 Pod 并在其 `policyTypes` 中包含 "Egress"，则该 Pod 是出口隔离的，
我们称这样的策略适用于该 Pod 的出口。当一个 Pod 的出口被隔离时，
唯一允许的来自 Pod 的连接是适用于出口的 Pod 的某个 NetworkPolicy 的 `egress` 列表所允许的连接。
针对那些允许连接的应答流量也将被隐式允许。
这些 `egress` 列表的效果是相加的。

<!--
By default, a pod is non-isolated for ingress; all inbound connections are allowed.
A pod is isolated for ingress if there is any NetworkPolicy that both selects the pod and
has "Ingress" in its `policyTypes`; we say that such a policy applies to the pod for ingress.
When a pod is isolated for ingress, the only allowed connections into the pod are those from
the pod's node and those allowed by the `ingress` list of some NetworkPolicy that applies to
the pod for ingress. Reply traffic for those allowed connections will also be implicitly allowed.
The effects of those `ingress` lists combine additively.
-->
默认情况下，一个 Pod 对入口是非隔离的，即所有入站连接都是被允许的。如果有任何的 NetworkPolicy
选择该 Pod 并在其 `policyTypes` 中包含 “Ingress”，则该 Pod 被隔离入口，
我们称这种策略适用于该 Pod 的入口。当一个 Pod 的入口被隔离时，唯一允许进入该 Pod
的连接是来自该 Pod 节点的连接和适用于入口的 Pod 的某个 NetworkPolicy 的 `ingress`
列表所允许的连接。针对那些允许连接的应答流量也将被隐式允许。这些 `ingress` 列表的效果是相加的。

<!--
Network policies do not conflict; they are additive. If any policy or policies apply to a given
pod for a given direction, the connections allowed in that direction from that pod is the union of
what the applicable policies allow. Thus, order of evaluation does not affect the policy result.

For a connection from a source pod to a destination pod to be allowed, both the egress policy on
the source pod and the ingress policy on the destination pod need to allow the connection. If
either side does not allow the connection, it will not happen.
-->
网络策略是相加的，所以不会产生冲突。如果策略适用于 Pod 某一特定方向的流量，
Pod 在对应方向所允许的连接是适用的网络策略所允许的集合。
因此，评估的顺序不影响策略的结果。

要允许从源 Pod 到目的 Pod 的某个连接，源 Pod 的出口策略和目的 Pod 的入口策略都需要允许此连接。
如果任何一方不允许此连接，则连接将会失败。

<!--
## The NetworkPolicy resource {#networkpolicy-resource}

See the [NetworkPolicy](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#networkpolicy-v1-networking-k8s-io)
reference for a full definition of the resource.

An example NetworkPolicy might look like this:
-->
## NetworkPolicy 资源 {#networkpolicy-resource}

参阅 [NetworkPolicy](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#networkpolicy-v1-networking-k8s-io)
来了解资源的完整定义。

下面是一个 NetworkPolicy 的示例：

{{< code_sample file="service/networking/networkpolicy.yaml" >}}

{{< note >}}
<!--
POSTing this to the API server for your cluster will have no effect unless your chosen networking
solution supports network policy.
-->
除非选择支持网络策略的网络解决方案，否则将上述示例发送到 API 服务器没有任何效果。
{{< /note >}}

<!--
__Mandatory Fields__: As with all other Kubernetes config, a NetworkPolicy needs `apiVersion`,
`kind`, and `metadata` fields. For general information about working with config files, see
[Configure a Pod to Use a ConfigMap](/docs/tasks/configure-pod-container/configure-pod-configmap/),
and [Object Management](/docs/concepts/overview/working-with-objects/object-management).

**spec**: NetworkPolicy [spec](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-architecture/api-conventions.md#spec-and-status)
has all the information needed to define a particular network policy in the given namespace.

**podSelector**: Each NetworkPolicy includes a `podSelector` which selects the grouping of pods to
which the policy applies. The example policy selects pods with the label "role=db". An empty
`podSelector` selects all pods in the namespace.
-->
**必需字段**：与所有其他的 Kubernetes 配置一样，NetworkPolicy 需要 `apiVersion`、
`kind` 和 `metadata` 字段。关于配置文件操作的一般信息，
请参考[配置 Pod 以使用 ConfigMap](/zh-cn/docs/tasks/configure-pod-container/configure-pod-configmap/)
和[对象管理](/zh-cn/docs/concepts/overview/working-with-objects/object-management)。

**spec**：NetworkPolicy
[规约](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-architecture/api-conventions.md#spec-and-status)
中包含了在一个名字空间中定义特定网络策略所需的所有信息。

**podSelector**：每个 NetworkPolicy 都包括一个 `podSelector`，
它对该策略所适用的一组 Pod 进行选择。示例中的策略选择带有 "role=db" 标签的 Pod。
空的 `podSelector` 选择名字空间下的所有 Pod。

<!--
**policyTypes**: Each NetworkPolicy includes a `policyTypes` list which may include either
`Ingress`, `Egress`, or both. The `policyTypes` field indicates whether or not the given policy
applies to ingress traffic to selected pod, egress traffic from selected pods, or both. If no
`policyTypes` are specified on a NetworkPolicy then by default `Ingress` will always be set and
`Egress` will be set if the NetworkPolicy has any egress rules.

**ingress**: Each NetworkPolicy may include a list of allowed `ingress` rules. Each rule allows
traffic which matches both the `from` and `ports` sections. The example policy contains a single
rule, which matches traffic on a single port, from one of three sources, the first specified via
an `ipBlock`, the second via a `namespaceSelector` and the third via a `podSelector`.

**egress**: Each NetworkPolicy may include a list of allowed `egress` rules. Each rule allows
traffic which matches both the `to` and `ports` sections. The example policy contains a single
rule, which matches traffic on a single port to any destination in `10.0.0.0/24`.
-->
**policyTypes**：每个 NetworkPolicy 都包含一个 `policyTypes` 列表，其中包含
`Ingress` 或 `Egress` 或两者兼具。`policyTypes` 字段表示给定的策略是应用于进入所选
Pod 的入站流量还是来自所选 Pod 的出站流量，或两者兼有。
如果 NetworkPolicy 未指定 `policyTypes` 则默认情况下始终设置 `Ingress`；
如果 NetworkPolicy 有任何出口规则的话则设置 `Egress`。

**ingress**：每个 NetworkPolicy 可包含一个 `ingress` 规则的白名单列表。
每个规则都允许同时匹配 `from` 和 `ports` 部分的流量。示例策略中包含一条简单的规则：
它匹配某个特定端口，来自三个来源中的一个，第一个通过 `ipBlock`
指定，第二个通过 `namespaceSelector` 指定，第三个通过 `podSelector` 指定。

**egress**：每个 NetworkPolicy 可包含一个 `egress` 规则的白名单列表。
每个规则都允许匹配 `to` 和 `port` 部分的流量。该示例策略包含一条规则，
该规则将指定端口上的流量匹配到 `10.0.0.0/24` 中的任何目的地。

<!--
So, the example NetworkPolicy:

1. isolates `role=db` pods in the `default` namespace for both ingress and egress traffic
   (if they weren't already isolated)
1. (Ingress rules) allows connections to all pods in the `default` namespace with the label
   `role=db` on TCP port 6379 from:

   * any pod in the `default` namespace with the label `role=frontend`
   * any pod in a namespace with the label `project=myproject`
   * IP addresses in the ranges `172.17.0.0`–`172.17.0.255` and `172.17.2.0`–`172.17.255.255`
     (ie, all of `172.17.0.0/16` except `172.17.1.0/24`)

1. (Egress rules) allows connections from any pod in the `default` namespace with the label
   `role=db` to CIDR `10.0.0.0/24` on TCP port 5978

See the [Declare Network Policy](/docs/tasks/administer-cluster/declare-network-policy/)
walkthrough for further examples.
-->
所以，该网络策略示例：

1. 隔离 `default` 名字空间下 `role=db` 的 Pod （如果它们不是已经被隔离的话）。
2. （Ingress 规则）允许以下 Pod 连接到 `default` 名字空间下的带有 `role=db`
   标签的所有 Pod 的 6379 TCP 端口：

   * `default` 名字空间下带有 `role=frontend` 标签的所有 Pod
   * 带有 `project=myproject` 标签的所有名字空间中的 Pod
   * IP 地址范围为 `172.17.0.0–172.17.0.255` 和 `172.17.2.0–172.17.255.255`
     （即，除了 `172.17.1.0/24` 之外的所有 `172.17.0.0/16`）

3. （Egress 规则）允许 `default` 名字空间中任何带有标签 `role=db` 的 Pod 到 CIDR
   `10.0.0.0/24` 下 5978 TCP 端口的连接。

有关更多示例，请参阅[声明网络策略](/zh-cn/docs/tasks/administer-cluster/declare-network-policy/)演练。

<!--
## Behavior of `to` and `from` selectors

There are four kinds of selectors that can be specified in an `ingress` `from` section or `egress`
`to` section:

**podSelector**: This selects particular Pods in the same namespace as the NetworkPolicy which
should be allowed as ingress sources or egress destinations.

**namespaceSelector**: This selects particular namespaces for which all Pods should be allowed as
ingress sources or egress destinations.

**namespaceSelector** *and* **podSelector**: A single `to`/`from` entry that specifies both
`namespaceSelector` and `podSelector` selects particular Pods within particular namespaces. Be
careful to use correct YAML syntax. For example:
-->
## 选择器 `to` 和 `from` 的行为   {#behavior-of-to-and-from-selectors}

可以在 `ingress` 的 `from` 部分或 `egress` 的 `to` 部分中指定四种选择器：

**podSelector**：此选择器将在与 NetworkPolicy 相同的名字空间中选择特定的
Pod，应将其允许作为入站流量来源或出站流量目的地。

**namespaceSelector**：此选择器将选择特定的名字空间，应将所有 Pod
用作其入站流量来源或出站流量目的地。

**namespaceSelector 和 podSelector**：一个指定 `namespaceSelector`
和 `podSelector` 的 `to`/`from` 条目选择特定名字空间中的特定 Pod。
注意使用正确的 YAML 语法；下面的策略：

```yaml
  ...
  ingress:
  - from:
    - namespaceSelector:
        matchLabels:
          user: alice
      podSelector:
        matchLabels:
          role: client
  ...
```

<!--
This policy contains a single `from` element allowing connections from Pods with the label
`role=client` in namespaces with the label `user=alice`. But the following policy is different:
-->
此策略在 `from` 数组中仅包含一个元素，只允许来自标有 `role=client` 的 Pod
且该 Pod 所在的名字空间中标有 `user=alice` 的连接。但是**这项**策略：

```yaml
  ...
  ingress:
  - from:
    - namespaceSelector:
        matchLabels:
          user: alice
    - podSelector:
        matchLabels:
          role: client
  ...
```

<!--
It contains two elements in the `from` array, and allows connections from Pods in the local
Namespace with the label `role=client`, *or* from any Pod in any namespace with the label
`user=alice`.
-->
它在 `from` 数组中包含两个元素，允许来自本地名字空间中标有 `role=client` 的
Pod 的连接，**或**来自任何名字空间中标有 `user=alice` 的任何 Pod 的连接。

<!--
When in doubt, use `kubectl describe` to see how Kubernetes has interpreted the policy.

<a name="behavior-of-ipblock-selectors"></a>
**ipBlock**: This selects particular IP CIDR ranges to allow as ingress sources or egress
destinations. These should be cluster-external IPs, since Pod IPs are ephemeral and unpredictable.

Cluster ingress and egress mechanisms often require rewriting the source or destination IP
of packets. In cases where this happens, it is not defined whether this happens before or
after NetworkPolicy processing, and the behavior may be different for different
combinations of network plugin, cloud provider, `Service` implementation, etc.

In the case of ingress, this means that in some cases you may be able to filter incoming
packets based on the actual original source IP, while in other cases, the "source IP" that
the NetworkPolicy acts on may be the IP of a `LoadBalancer` or of the Pod's node, etc.

For egress, this means that connections from pods to `Service` IPs that get rewritten to
cluster-external IPs may or may not be subject to `ipBlock`-based policies.
-->
如有疑问，请使用 `kubectl describe` 查看 Kubernetes 如何解释该策略。

**ipBlock**：此选择器将选择特定的 IP CIDR 范围以用作入站流量来源或出站流量目的地。
这些应该是集群外部 IP，因为 Pod IP 存在时间短暂的且随机产生。

集群的入站和出站机制通常需要重写数据包的源 IP 或目标 IP。
在发生这种情况时，不确定在 NetworkPolicy 处理之前还是之后发生，
并且对于网络插件、云提供商、`Service` 实现等的不同组合，其行为可能会有所不同。

对入站流量而言，这意味着在某些情况下，你可以根据实际的原始源 IP 过滤传入的数据包，
而在其他情况下，NetworkPolicy 所作用的 `源IP` 则可能是 `LoadBalancer` 或
Pod 的节点等。

对于出站流量而言，这意味着从 Pod 到被重写为集群外部 IP 的 `Service` IP
的连接可能会或可能不会受到基于 `ipBlock` 的策略的约束。

<!--
## Default policies

By default, if no policies exist in a namespace, then all ingress and egress traffic is allowed to
and from pods in that namespace. The following examples let you change the default behavior
in that namespace.
-->
## 默认策略   {#default-policies}

默认情况下，如果名字空间中不存在任何策略，则所有进出该名字空间中 Pod 的流量都被允许。
以下示例使你可以更改该名字空间中的默认行为。

<!--
### Default deny all ingress traffic
-->
### 默认拒绝所有入站流量   {#default-deny-all-ingress-traffic}

<!--
You can create a "default" ingress isolation policy for a namespace by creating a NetworkPolicy
that selects all pods but does not allow any ingress traffic to those pods.
-->
你可以通过创建选择所有 Pod 但不允许任何进入这些 Pod 的入站流量的 NetworkPolicy
来为名字空间创建 "default" 隔离策略。

{{< code_sample file="service/networking/network-policy-default-deny-ingress.yaml" >}}

<!--
This ensures that even pods that aren't selected by any other NetworkPolicy will still be isolated
for ingress. This policy does not affect isolation for egress from any pod.
-->
这确保即使没有被任何其他 NetworkPolicy 选择的 Pod 仍将被隔离以进行入口。
此策略不影响任何 Pod 的出口隔离。

<!--
### Allow all ingress traffic
-->
### 允许所有入站流量   {#allow-all-ingress-traffic}

<!--
If you want to allow all incoming connections to all pods in a namespace, you can create a policy
that explicitly allows that.
-->
如果你想允许一个名字空间中所有 Pod 的所有入站连接，你可以创建一个明确允许的策略。

{{< code_sample file="service/networking/network-policy-allow-all-ingress.yaml" >}}

<!--
With this policy in place, no additional policy or policies can cause any incoming connection to
those pods to be denied. This policy has no effect on isolation for egress from any pod.
-->
有了这个策略，任何额外的策略都不会导致到这些 Pod 的任何入站连接被拒绝。
此策略对任何 Pod 的出口隔离没有影响。

<!--
### Default deny all egress traffic

You can create a "default" egress isolation policy for a namespace by creating a NetworkPolicy
that selects all pods but does not allow any egress traffic from those pods.
-->
### 默认拒绝所有出站流量   {#default-deny-all-egress-traffic}

你可以通过创建选择所有容器但不允许来自这些容器的任何出站流量的 NetworkPolicy
来为名字空间创建 "default" 隔离策略。

{{< code_sample file="service/networking/network-policy-default-deny-egress.yaml" >}}

<!--
This ensures that even pods that aren't selected by any other NetworkPolicy will not be allowed
egress traffic. This policy does not change the ingress isolation behavior of any pod.
-->
此策略可以确保即使没有被其他任何 NetworkPolicy 选择的 Pod 也不会被允许流出流量。
此策略不会更改任何 Pod 的入站流量隔离行为。

<!--
### Allow all egress traffic
-->
### 允许所有出站流量   {#allow-all-egress-traffic}

<!--
If you want to allow all connections from all pods in a namespace, you can create a policy that
explicitly allows all outgoing connections from pods in that namespace.
-->
如果要允许来自名字空间中所有 Pod 的所有连接，
则可以创建一个明确允许来自该名字空间中 Pod 的所有出站连接的策略。

{{< code_sample file="service/networking/network-policy-allow-all-egress.yaml" >}}

<!--
With this policy in place, no additional policy or policies can cause any outgoing connection from
those pods to be denied. This policy has no effect on isolation for ingress to any pod.
-->
有了这个策略，任何额外的策略都不会导致来自这些 Pod 的任何出站连接被拒绝。
此策略对进入任何 Pod 的隔离没有影响。

<!--
### Default deny all ingress and all egress traffic

You can create a "default" policy for a namespace which prevents all ingress AND egress traffic by
creating the following NetworkPolicy in that namespace.
-->
### 默认拒绝所有入站和所有出站流量   {#default-deny-all-ingress-and-all-egress-traffic}

你可以为名字空间创建 "default" 策略，以通过在该名字空间中创建以下 NetworkPolicy
来阻止所有入站和出站流量。

{{< code_sample file="service/networking/network-policy-default-deny-all.yaml" >}}

<!--
This ensures that even pods that aren't selected by any other NetworkPolicy will not be allowed
ingress or egress traffic.
-->
此策略可以确保即使没有被其他任何 NetworkPolicy 选择的 Pod 也不会被允许入站或出站流量。

<!--
## Network traffic filtering

NetworkPolicy is defined for [layer 4](https://en.wikipedia.org/wiki/OSI_model#Layer_4:_Transport_layer)
connections (TCP, UDP, and optionally SCTP). For all the other protocols, the behaviour may vary
across network plugins.
-->
## 网络流量过滤   {#network-traffic-filtering}

NetworkPolicy 是为[第 4 层](https://zh.wikipedia.org/wiki/OSI%E6%A8%A1%E5%9E%8B#%E7%AC%AC4%E5%B1%A4_%E5%82%B3%E8%BC%B8%E5%B1%A4)连接
（TCP、UDP 和可选的 SCTP）所定义的。对于所有其他协议，这种网络流量过滤的行为可能因网络插件而异。

{{< note >}}
<!--
You must be using a {{< glossary_tooltip text="CNI" term_id="cni" >}} plugin that supports SCTP
protocol NetworkPolicies.
-->
你必须使用支持 SCTP 协议 NetworkPolicy 的 {{< glossary_tooltip text="CNI" term_id="cni" >}} 插件。
{{< /note >}}

<!--
When a `deny all` network policy is defined, it is only guaranteed to deny TCP, UDP and SCTP
connections. For other protocols, such as ARP or ICMP, the behaviour is undefined.
The same applies to allow rules: when a specific pod is allowed as ingress source or egress destination,
it is undefined what happens with (for example) ICMP packets. Protocols such as ICMP may be allowed by some
network plugins and denied by others.
-->
当 `deny all` 网络策略被定义时，此策略只能保证拒绝 TCP、UDP 和 SCTP 连接。
对于 ARP 或 ICMP 这类其他协议，这种网络流量过滤行为是未定义的。
相同的情况也适用于 allow 规则：当特定 Pod 被允许作为入口源或出口目的地时，
对于（例如）ICMP 数据包会发生什么是未定义的。
ICMP 这类协议可能被某些网络插件所允许，而被另一些网络插件所拒绝。

<!--
## Targeting a range of ports
-->
## 针对某个端口范围   {#targeting-a-range-of-ports}

{{< feature-state for_k8s_version="v1.25" state="stable" >}}

<!--
When writing a NetworkPolicy, you can target a range of ports instead of a single port.

This is achievable with the usage of the `endPort` field, as the following example:
-->
在编写 NetworkPolicy 时，你可以针对一个端口范围而不是某个固定端口。

这一目的可以通过使用 `endPort` 字段来实现，如下例所示：

{{< code_sample file="service/networking/networkpolicy-multiport-egress.yaml" >}}

<!--
The above rule allows any Pod with label `role=db` on the namespace `default` to communicate
with any IP within the range `10.0.0.0/24` over TCP, provided that the target
port is between the range 32000 and 32768.
-->
上面的规则允许名字空间 `default` 中所有带有标签 `role=db` 的 Pod 使用 TCP 协议与
`10.0.0.0/24` 范围内的 IP 通信，只要目标端口介于 32000 和 32768 之间就可以。

<!--
The following restrictions apply when using this field:

* The `endPort` field must be equal to or greater than the `port` field.
* `endPort` can only be defined if `port` is also defined.
* Both ports must be numeric.
-->
使用此字段时存在以下限制：

* `endPort` 字段必须等于或者大于 `port` 字段的值。
* 只有在定义了 `port` 时才能定义 `endPort`。
* 两个字段的设置值都只能是数字。

{{< note >}}
<!--
Your cluster must be using a {{< glossary_tooltip text="CNI" term_id="cni" >}} plugin that
supports the `endPort` field in NetworkPolicy specifications.
If your [network plugin](/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins/)
does not support the `endPort` field and you specify a NetworkPolicy with that,
the policy will be applied only for the single `port` field.
-->
你的集群所使用的 {{< glossary_tooltip text="CNI" term_id="cni" >}} 插件必须支持在
NetworkPolicy 规约中使用 `endPort` 字段。
如果你的[网络插件](/zh-cn/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins/)不支持
`endPort` 字段，而你指定了一个包含 `endPort` 字段的 NetworkPolicy，
策略只对单个 `port` 字段生效。
{{< /note >}}

<!--
## Targeting multiple namespaces by label

In this scenario, your `Egress` NetworkPolicy targets more than one namespace using their
label names. For this to work, you need to label the target namespaces. For example:
-->
## 按标签选择多个名字空间   {#targeting-multiple-namespaces-by-label}

在这种情况下，你的 `Egress` NetworkPolicy 使用名字空间的标签名称来将多个名字空间作为其目标。
为此，你需要为目标名字空间设置标签。例如：

```shell
kubectl label namespace frontend namespace=frontend
kubectl label namespace backend namespace=backend
```

<!--
Add the labels under `namespaceSelector` in your NetworkPolicy document. For example:
-->
在 NetworkPolicy 文档中的 `namespaceSelector` 下添加标签。例如：

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: egress-namespaces
spec:
  podSelector:
    matchLabels:
      app: myapp
  policyTypes:
    - Egress
  egress:
    - to:
      - namespaceSelector:
          matchExpressions:
            - key: namespace
              operator: In
              values: ["frontend", "backend"]
```

{{< note >}}
<!--
It is not possible to directly specify the name of the namespaces in a NetworkPolicy.
You must use a `namespaceSelector` with `matchLabels` or `matchExpressions` to select the
namespaces based on their labels.
-->
你不可以在 NetworkPolicy 中直接指定名字空间的名称。
你必须使用带有 `matchLabels` 或 `matchExpressions` 的 `namespaceSelector`
来根据标签选择名字空间。
{{< /note >}}

<!--
## Targeting a Namespace by its name
-->
## 基于名字指向某名字空间   {#targeting-a-namespace-by-its-name}

<!--
The Kubernetes control plane sets an immutable label `kubernetes.io/metadata.name` on all
namespaces, the value of the label is the namespace name.

While NetworkPolicy cannot target a namespace by its name with some object field, you can use the
standardized label to target a specific namespace.
-->
Kubernetes 控制面会在所有名字空间上设置一个不可变更的标签
`kubernetes.io/metadata.name`。该标签的值是名字空间的名称。

如果 NetworkPolicy 无法在某些对象字段中指向某名字空间，
你可以使用标准的标签方式来指向特定名字空间。

<!--
## Pod lifecycle
-->
## Pod 生命周期   {#pod-lifecycle}

{{< note >}}
<!--
The following applies to clusters with a conformant networking plugin and a conformant implementation of
NetworkPolicy.
-->
以下内容适用于使用了合规网络插件和 NetworkPolicy 合规实现的集群。
{{< /note >}}

<!--
When a new NetworkPolicy object is created, it may take some time for a network plugin
to handle the new object. If a pod that is affected by a NetworkPolicy
is created before the network plugin has completed NetworkPolicy handling,
that pod may be started unprotected, and isolation rules will be applied when
the NetworkPolicy handling is completed.
-->
当新的 NetworkPolicy 对象被创建时，网络插件可能需要一些时间来处理这个新对象。
如果受到 NetworkPolicy 影响的 Pod 在网络插件完成 NetworkPolicy 处理之前就被创建了，
那么该 Pod 可能会最初处于无保护状态，而在 NetworkPolicy 处理完成后被应用隔离规则。

<!--
Once the NetworkPolicy is handled by a network plugin,

1. All newly created pods affected by a given NetworkPolicy will be isolated before 
   they are started.
   Implementations of NetworkPolicy must ensure that filtering is effective throughout
   the Pod lifecycle, even from the very first instant that any container in that Pod is started.
   Because they are applied at Pod level, NetworkPolicies apply equally to init containers,
   sidecar containers, and regular containers.
-->
一旦 NetworkPolicy 被网络插件处理，

1. 所有受给定 NetworkPolicy 影响的新建 Pod 都将在启动前被隔离。
   NetworkPolicy 的实现必须确保过滤规则在整个 Pod 生命周期内是有效的，
   这个生命周期要从该 Pod 的任何容器启动的第一刻算起。
   因为 NetworkPolicy 在 Pod 层面被应用，所以 NetworkPolicy 同样适用于 Init 容器、边车容器和常规容器。

<!--
2. Allow rules will be applied eventually after the isolation rules (or may be applied at the same time).
   In the worst case, a newly created pod may have no network connectivity at all when it is first started, if
   isolation rules were already applied, but no allow rules were applied yet.

Every created NetworkPolicy will be handled by a network plugin eventually, but there is no
way to tell from the Kubernetes API when exactly that happens.
-->
2. Allow 规则最终将在隔离规则之后被应用（或者可能同时被应用）。
   在最糟的情况下，如果隔离规则已被应用，但 allow 规则尚未被应用，
   那么新建的 Pod 在初始启动时可能根本没有网络连接。

用户所创建的每个 NetworkPolicy 最终都会被网络插件处理，但无法使用 Kubernetes API
来获知确切的处理时间。

<!--
Therefore, pods must be resilient against being started up with different network
connectivity than expected. If you need to make sure the pod can reach certain destinations
before being started, you can use an [init container](/docs/concepts/workloads/pods/init-containers/)
to wait for those destinations to be reachable before kubelet starts the app containers.
-->
因此，若 Pod 启动时使用非预期的网络连接，它必须保持稳定。
如果你需要确保 Pod 在启动之前能够访问特定的目标，可以使用
[Init 容器](/zh-cn/docs/concepts/workloads/pods/init-containers/)在
kubelet 启动应用容器之前等待这些目的地变得可达。

<!--
Every NetworkPolicy will be applied to all selected pods eventually.
Because the network plugin may implement NetworkPolicy in a distributed manner,
it is possible that pods may see a slightly inconsistent view of network policies
when the pod is first created, or when pods or policies change.
For example, a newly-created pod that is supposed to be able to reach both Pod A
on Node 1 and Pod B on Node 2 may find that it can reach Pod A immediately,
but cannot reach Pod B until a few seconds later.
-->
每个 NetworkPolicy 最终都会被应用到所选定的所有 Pod 之上。
由于网络插件可能以分布式的方式实现 NetworkPolicy，所以当 Pod 被首次创建时或当
Pod 或策略发生变化时，Pod 可能会看到稍微不一致的网络策略视图。
例如，新建的 Pod 本来应能立即访问 Node 1 上的 Pod A 和 Node 2 上的 Pod B，
但可能你会发现新建的 Pod 可以立即访问 Pod A，但要在几秒后才能访问 Pod B。

<!--
## NetworkPolicy and `hostNetwork` pods

NetworkPolicy behaviour for `hostNetwork` pods is undefined, but it should be limited to 2 possibilities:
-->
## NetworkPolicy 和 `hostNetwork` Pod    {#networkpolicy-and-hostnetwork-pods}

针对 `hostNetwork` Pod 的 NetworkPolicy 行为是未定义的，但应限制为以下两种可能：

<!--
- The network plugin can distinguish `hostNetwork` pod traffic from all other traffic
  (including being able to distinguish traffic from different `hostNetwork` pods on
  the same node), and will apply NetworkPolicy to `hostNetwork` pods just like it does
  to pod-network pods.
-->
- 网络插件可以从所有其他流量中辨别出 `hostNetwork` Pod 流量
  （包括能够从同一节点上的不同 `hostNetwork` Pod 中辨别流量），
  网络插件还可以像处理 Pod 网络流量一样，对 `hostNetwork` Pod 应用 NetworkPolicy。

<!--
- The network plugin cannot properly distinguish `hostNetwork` pod traffic,
  and so it ignores `hostNetwork` pods when matching `podSelector` and `namespaceSelector`.
  Traffic to/from `hostNetwork` pods is treated the same as all other traffic to/from the node IP.
  (This is the most common implementation.)
-->
- 网络插件无法正确辨别 `hostNetwork` Pod 流量，因此在匹配 `podSelector` 和 `namespaceSelector`
  时会忽略 `hostNetwork` Pod。流向/来自 `hostNetwork` Pod 的流量的处理方式与流向/来自节点 IP
  的所有其他流量一样。（这是最常见的实现方式。）

<!--
This applies when
-->
这适用于以下情形：

<!--
1. a `hostNetwork` pod is selected by `spec.podSelector`.
-->
1. `hostNetwork` Pod 被 `spec.podSelector` 选中。
   
   ```yaml
     ...
     spec:
       podSelector:
         matchLabels:
           role: client
     ...
   ```
 
<!--
1. a `hostNetwork` pod is selected by a `podSelector` or `namespaceSelector` in an `ingress` or `egress` rule.
-->
2. `hostNetwork` Pod 在 `ingress` 或 `egress` 规则中被 `podSelector` 或
   `namespaceSelector` 选中。

   ```yaml
     ...
     ingress:
       - from:
         - podSelector:
             matchLabels:
               role: client
     ...
   ```

<!--
At the same time, since `hostNetwork` pods have the same IP addresses as the nodes they reside on,
their connections will be treated as node connections. For example, you can allow traffic
from a `hostNetwork` Pod using an `ipBlock` rule.
-->
同时，由于 `hostNetwork` Pod 具有与其所在节点相同的 IP 地址，所以它们的连接将被视为节点连接。
例如，你可以使用 `ipBlock` 规则允许来自 `hostNetwork` Pod 的流量。

<!--
## What you can't do with network policies (at least, not yet)

As of Kubernetes {{< skew currentVersion >}}, the following functionality does not exist in the
NetworkPolicy API, but you might be able to implement workarounds using Operating System
components (such as SELinux, OpenVSwitch, IPTables, and so on) or Layer 7 technologies (Ingress
controllers, Service Mesh implementations) or admission controllers. In case you are new to
network security in Kubernetes, its worth noting that the following User Stories cannot (yet) be
implemented using the NetworkPolicy API.
-->
## 通过网络策略（至少目前还）无法完成的工作   {#what-you-can-t-do-with-network-policies-at-least-not-yet}

到 Kubernetes {{< skew currentVersion >}} 为止，NetworkPolicy API 还不支持以下功能，
不过你可能可以使用操作系统组件（如 SELinux、OpenVSwitch、IPTables 等等）
或者第七层技术（Ingress 控制器、服务网格实现）或准入控制器来实现一些替代方案。
如果你对 Kubernetes 中的网络安全性还不太了解，了解使用 NetworkPolicy API
还无法实现下面的用户场景是很值得的。

<!--
- Forcing internal cluster traffic to go through a common gateway (this might be best served with
  a service mesh or other proxy).
- Anything TLS related (use a service mesh or ingress controller for this).
- Node specific policies (you can use CIDR notation for these, but you cannot target nodes by
  their Kubernetes identities specifically).
- Targeting of services by name (you can, however, target pods or namespaces by their
  {{< glossary_tooltip text="labels" term_id="label" >}}, which is often a viable workaround).
- Creation or management of "Policy requests" that are fulfilled by a third party.
-->
- 强制集群内部流量经过某公用网关（这种场景最好通过服务网格或其他代理来实现）；
- 与 TLS 相关的场景（考虑使用服务网格或者 Ingress 控制器）；
- 特定于节点的策略（你可以使用 CIDR 来表达这一需求不过你无法使用节点在
  Kubernetes 中的其他标识信息来辩识目标节点）；
- 基于名字来选择服务（不过，你可以使用 {{< glossary_tooltip text="标签" term_id="label" >}}
  来选择目标 Pod 或名字空间，这也通常是一种可靠的替代方案）；
- 创建或管理由第三方来实际完成的“策略请求”；
<!--
- Default policies which are applied to all namespaces or pods (there are some third party
  Kubernetes distributions and projects which can do this).
- Advanced policy querying and reachability tooling.
- The ability to log network security events (for example connections that are blocked or accepted).
- The ability to explicitly deny policies (currently the model for NetworkPolicies are deny by
  default, with only the ability to add allow rules).
- The ability to prevent loopback or incoming host traffic (Pods cannot currently block localhost
  access, nor do they have the ability to block access from their resident node).
-->
- 实现适用于所有名字空间或 Pod 的默认策略（某些第三方 Kubernetes 发行版本或项目可以做到这点）；
- 高级的策略查询或者可达性相关工具；
- 生成网络安全事件日志的能力（例如，被阻塞或接收的连接请求）；
- 显式地拒绝策略的能力（目前，NetworkPolicy 的模型默认采用拒绝操作，
  其唯一的能力是添加允许策略）；
- 禁止本地回路或指向宿主的网络流量（Pod 目前无法阻塞 localhost 访问，
  它们也无法禁止来自所在节点的访问请求）。

<!--
## NetworkPolicy's impact on existing connections

When the set of NetworkPolicies that applies to an existing connection changes - this could happen
either due to a change in NetworkPolicies or if the relevant labels of the namespaces/pods selected by the
policy (both subject and peers) are changed in the middle of an existing connection - it is
implementation defined as to whether the change will take effect for that existing connection or not.
Example: A policy is created that leads to denying a previously allowed connection, the underlying network plugin
implementation is responsible for defining if that new policy will close the existing connections or not.
It is recommended not to modify policies/pods/namespaces in ways that might affect existing connections.
-->
## NetworkPolicy 对现有连接的影响   {#networkpolicys-impact-on-existing-connections}

当应用到现有连接的 NetworkPolicy 集合发生变化时，这可能是由于 NetworkPolicy
发生变化或者在现有连接过程中（主体和对等方）策略所选择的名字空间或 Pod 的相关标签发生变化，
此时是否对该现有连接生效是由实现定义的。例如：某个策略的创建导致之前允许的连接被拒绝，
底层网络插件的实现负责定义这个新策略是否会关闭现有的连接。
建议不要以可能影响现有连接的方式修改策略、Pod 或名字空间。

## {{% heading "whatsnext" %}}

<!--
- See the [Declare Network Policy](/docs/tasks/administer-cluster/declare-network-policy/)
  walkthrough for further examples.
- See more [recipes](https://github.com/ahmetb/kubernetes-network-policy-recipes) for common
  scenarios enabled by the NetworkPolicy resource.
-->
- 有关更多示例，请参阅[声明网络策略](/zh-cn/docs/tasks/administer-cluster/declare-network-policy/)演练。
- 有关 NetworkPolicy 资源所支持的常见场景的更多信息，
  请参见[此指南](https://github.com/ahmetb/kubernetes-network-policy-recipes)。
