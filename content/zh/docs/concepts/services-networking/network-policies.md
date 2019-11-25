---
title: 网络策略
content_template: templates/concept
weight: 50
---

{{< toc >}}

{{% capture overview %}}

<!--
A network policy is a specification of how groups of pods are allowed to communicate with each other and other network endpoints.

`NetworkPolicy` resources use labels to select pods and define rules which specify what traffic is allowed to the selected pods.
-->

网络策略（NetworkPolicy）是一种关于pod间及pod与其他网络端点间所允许的通信规则的规范。

`NetworkPolicy` 资源使用标签选择pod，并定义选定pod所允许的通信规则。

{{% /capture %}}

{{% capture body %}}

<!--
## Prerequisites

Network policies are implemented by the network plugin, so you must be using a networking solution which supports `NetworkPolicy` - simply creating the resource without a controller to implement it will have no effect.
-->

## 前提

网络策略通过网络插件来实现，所以用户必须使用支持 `NetworkPolicy` 的网络解决方案 - 简单地创建资源对象，而没有控制器来使它生效的话，是没有任何作用的。

<!--
## Isolated and Non-isolated Pods

By default, pods are non-isolated; they accept traffic from any source.

Pods become isolated by having a NetworkPolicy that selects them. Once there is any NetworkPolicy in a namespace selecting a particular pod, that pod will reject any connections that are not allowed by any NetworkPolicy. (Other pods in the namespace that are not selected by any NetworkPolicy will continue to accept all traffic.)
-->

## 隔离和非隔离的Pod

默认情况下，Pod是非隔离的，它们接受任何来源的流量。

Pod可以通过相关的网络策略进行隔离。一旦命名空间中有网络策略选择了特定的Pod，该Pod会拒绝网络策略所不允许的连接。 (命名空间下其他未被网络策略所选择的Pod会继续接收所有的流量)

<!--
## The `NetworkPolicy` Resource

See the [NetworkPolicy](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#networkpolicy-v1-networking-k8s-io) for a full definition of the resource.

An example `NetworkPolicy` might look like this:
-->

## `NetworkPolicy` 资源

查看 [网络策略](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#networkpolicy-v1-networking-k8s-io) 来了解资源定义。

下面是一个 `NetworkPolicy` 的示例:

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: test-network-policy
  namespace: default
spec:
  podSelector:
    matchLabels:
      role: db
  policyTypes:
  - Ingress
  - Egress
  ingress:
  - from:
    - ipBlock:
        cidr: 172.17.0.0/16
        except:
        - 172.17.1.0/24
    - namespaceSelector:
        matchLabels:
          project: myproject
    - podSelector:
        matchLabels:
          role: frontend
    ports:
    - protocol: TCP
      port: 6379
  egress:
  - to:
    - ipBlock:
        cidr: 10.0.0.0/24
    ports:
    - protocol: TCP
      port: 5978
```

<!--
*POSTing this to the API server will have no effect unless your chosen networking solution supports network policy.*

__Mandatory Fields__: As with all other Kubernetes config, a `NetworkPolicy`
needs `apiVersion`, `kind`, and `metadata` fields.  For general information
about working with config files, see
[Configure Containers Using a ConfigMap](/docs/tasks/configure-pod-container/configure-pod-configmap/),
and [Object Management](/docs/concepts/overview/working-with-objects/object-management).

__spec__: `NetworkPolicy` [spec](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-architecture/api-conventions.md#spec-and-status) has all the information needed to define a particular network policy in the given namespace.

__podSelector__: Each `NetworkPolicy` includes a `podSelector` which selects the grouping of pods to which the policy applies. The example policy selects pods with the label "role=db". An empty `podSelector` selects all pods in the namespace.

__policyTypes__: Each `NetworkPolicy` includes a `policyTypes` list which may include either `Ingress`, `Egress`, or both. The `policyTypes` field indicates whether or not the given policy applies to ingress traffic to selected pod, egress traffic from selected pods, or both. If no `policyTypes` are specified on a NetworkPolicy then by default `Ingress` will always be set and `Egress` will be set if the NetworkPolicy has any egress rules.

__ingress__: Each `NetworkPolicy` may include a list of whitelist `ingress` rules.  Each rule allows traffic which matches both the `from` and `ports` sections. The example policy contains a single rule, which matches traffic on a single port, from one of three sources, the first specified via an `ipBlock`, the second via a `namespaceSelector` and the third via a `podSelector`.

__egress__: Each `NetworkPolicy` may include a list of whitelist `egress` rules.  Each rule allows traffic which matches both the `to` and `ports` sections. The example policy contains a single rule, which matches traffic on a single port to any destination in `10.0.0.0/24`.
-->

除非选择支持网络策略的网络解决方案，否则将上述示例发送到API服务器没有任何效果。

__必填字段__: 与所有其他的Kubernetes配置一样，`NetworkPolicy` 需要 `apiVersion`、 `kind`和 `metadata` 字段。 关于配置文件操作的一般信息，请参考 [这里](/docs/user-guide/simple-yaml)、 [这里](/docs/user-guide/configuring-containers)和 [这里](/docs/user-guide/working-with-resources)。

__spec__: `NetworkPolicy` [spec](https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status) 中包含了在一个命名空间中定义特定网络策略所需的所有信息

__podSelector__: 每个 `NetworkPolicy` 都包括一个 `podSelector` ，它对该策略所应用的一组Pod进行选择。因为 `NetworkPolicy` 目前只支持定义 `ingress` 规则，这里的 `podSelector` 本质上是为该策略定义 "目标pod" 。示例中的策略选择带有 "role=db" 标签的pod。空的 `podSelector` 选择命名空间下的所有pod。

__policyTypes__: Each `NetworkPolicy` includes a `policyTypes` list which may include either `Ingress`, `Egress`, or both. The `policyTypes` field indicates whether or not the given policy applies to ingress traffic to selected pod, egress traffic from selected pods, or both. If no `policyTypes` are specified on a NetworkPolicy then by default `Ingress` will always be set and `Egress` will be set if the NetworkPolicy has any egress rules.

__ingress__: 每个 `NetworkPolicy` 包含一个 `ingress` 规则的白名单列表。（其中的）规则允许同时匹配 `from` 和 `ports` 部分的流量。示例策略中包含一条简单的规则： 它匹配一个单一的端口，来自两个来源中的一个， 第一个通过 `namespaceSelector` 指定，第二个通过 `podSelector` 指定。

__egress__: 每个 `NetworkPolicy` 包含一个 `egress` 规则的白名单列表。每个规则都允许匹配 `to` 和 `port` 部分的流量。该示例策略包含一条规则，该规则将单个端口上的流量匹配到 `10.0.0.0/24` 中的任何目的地。

<!--
So, the example NetworkPolicy:

1. isolates "role=db" pods in the "default" namespace for both ingress and egress traffic (if they weren't already isolated)
2. (Ingress rules) allows connections to all pods in the “default” namespace with the label “role=db” on TCP port 6379 from:

   * any pod in the "default" namespace with the label "role=frontend"
   * any pod in a namespace with the label "project=myproject"
   * IP addresses in the ranges 172.17.0.0–172.17.0.255 and 172.17.2.0–172.17.255.255 (ie, all of 172.17.0.0/16 except 172.17.1.0/24)
3. (Egress rules) allows connections from any pod in the "default" namespace with the label "role=db" to CIDR 10.0.0.0/24 on TCP port 5978

See the [Declare Network Policy](/docs/tasks/administer-cluster/declare-network-policy/) walkthrough for further examples.
-->

所以，示例网络策略:

1. 隔离 "default" 命名空间下 "role=db" 的pod (如果它们不是已经被隔离的话)。
2. 允许从 "default" 命名空间下带有 "role=frontend" 标签的pod到 "default" 命名空间下的pod的6379 TCP端口的连接。

  * 标签为 "role=frontend" 的 "default" 名称空间中的任何Pod
  * 名称空间中带有标签 "project=myproject" 的任何pod
  * IP 地址范围为 172.17.0.0–172.17.0.255 和 172.17.2.0–172.17.255.255（即，除了 172.17.1.0/24 之外的所有 172.17.0.0/16）
3. 允许从带有 "project=myproject" 标签的命名空间下的任何 pod 到 "default" 命名空间下的 pod 的6379 TCP端口的连接。

查看 [网络策略入门指南](/docs/getting-started-guides/network-policy/walkthrough) 了解更多示例。

<!--
## Behavior of `to` and `from` selectors

There are four kinds of selectors that can be specified in an `ingress` `from` section or `egress` `to` section:

__podSelector__: This selects particular Pods in the same namespace as the `NetworkPolicy` which should be allowed as ingress sources or egress destinations.

__namespaceSelector__: This selects particular namespaces for which all Pods should be allowed as ingress sources or egress destinations.

__namespaceSelector__ *and* __podSelector__: A single `to`/`from` entry that specifies both `namespaceSelector` and `podSelector` selects particular Pods within particular namespaces. Be careful to use correct YAML syntax; this policy:
-->

## 选择器 `to` 和 `from` 的行为

可以在 `ingress` `from` 部分或 `egress` `to` 部分中指定四种选择器：

__podSelector__: 这将在与 `NetworkPolicy` 相同的名称空间中选择特定的 Pod，应将其允许作为入口源或出口目的地。

__namespaceSelector__: 这将选择特定的名称空间，应将所有 Pod 用作其输入源或输出目的地。

__namespaceSelector__ *和* __podSelector__: 一个指定 `namespaceSelector` 和 `podSelector` 的 `to`/`from` 条目选择特定命名空间中的特定 Pod。注意使用正确的YAML语法；这项策略：

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

在 `from` 数组中仅包含一个元素，只允许来自标有 `role = client` 的 Pod 且该 Pod 所在的名称空间中标有`user=alice`的连接。这项策略：

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
contains two elements in the `from` array, and allows connections from Pods in the local Namespace with the label `role=client`, *or* from any Pod in any namespace with the label `user=alice`.

When in doubt, use `kubectl describe` to see how Kubernetes has interpreted the policy.

__ipBlock__: This selects particular IP CIDR ranges to allow as ingress sources or egress destinations. These should be cluster-external IPs, since Pod IPs are ephemeral and unpredictable.

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

在 `from` 数组中包含两个元素，允许来自本地命名空间中标有 `role = client` 的 Pod 的连接，*或*来自任何名称空间中标有`user = alice`的任何Pod的连接。

如有疑问，请使用 `kubectl describe` 查看 Kubernetes 如何解释该策略。

__ipBlock__: 这将选择特定的 IP CIDR 范围以用作入口源或出口目的地。 这些应该是群集外部 IP，因为 Pod IP 存在时间短暂的且随机产生。

群集的入口和出口机制通常需要重写数据包的源 IP 或目标 IP。在发生这种情况的情况下，不确定在 NetworkPolicy 处理之前还是之后发生，并且对于网络插件，云提供商，`Service` 实现等的不同组合，其行为可能会有所不同。

在进入的情况下，这意味着在某些情况下，您可以根据实际的原始源 IP 过滤传入的数据包，而在其他情况下，NetworkPolicy 所作用的 `源IP` 则可能是 `LoadBalancer` 或 Pod的节点等。

对于出口，这意味着从 Pod 到被重写为集群外部 IP 的 `Service` IP 的连接可能会或可能不会受到基于 `ipBlock` 的策略的约束。

<!--
## Default policies

By default, if no policies exist in a namespace, then all ingress and egress traffic is allowed to and from pods in that namespace. The following examples let you change the default behavior
in that namespace.
-->

## 默认策略

默认情况下，如果名称空间中不存在任何策略，则所有进出该名称空间中的Pod的流量都被允许。以下示例使您可以更改该名称空间中的默认行为。

<!--
### Default deny all ingress traffic

You can create a "default" isolation policy for a namespace by creating a NetworkPolicy that selects all pods but does not allow any ingress traffic to those pods.
-->

### 默认拒绝所有入口流量

您可以通过创建选择所有容器但不允许任何进入这些容器的入口流量的 NetworkPolicy 来为名称空间创建 "default" 隔离策略。

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: default-deny
spec:
  podSelector: {}
  policyTypes:
  - Ingress
```

<!--
This ensures that even pods that aren't selected by any other NetworkPolicy will still be isolated. This policy does not change the default egress isolation behavior.
-->
这样可以确保即使容器没有选择其他任何 NetworkPolicy，也仍然可以被隔离。此策略不会更改默认的出口隔离行为。

<!--
### Default allow all ingress traffic

If you want to allow all traffic to all pods in a namespace (even if policies are added that cause some pods to be treated as "isolated"), you can create a policy that explicitly allows all traffic in that namespace.
-->

### 默认允许所有入口流量

如果要允许所有流量进入某个命名空间中的所有 Pod（即使添加了导致某些 Pod 被视为“隔离”的策略），则可以创建一个策略来明确允许该命名空间中的所有流量。

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-all
spec:
  podSelector: {}
  ingress:
  - {}
  policyTypes:
  - Ingress
```

<!--
### Default deny all egress traffic

You can create a "default" egress isolation policy for a namespace by creating a NetworkPolicy that selects all pods but does not allow any egress traffic from those pods.
-->

### 默认拒绝所有出口流量

您可以通过创建选择所有容器但不允许来自这些容器的任何出口流量的 NetworkPolicy 来为名称空间创建 "default" egress 隔离策略。

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: default-deny
spec:
  podSelector: {}
  policyTypes:
  - Egress
```

<!--
This ensures that even pods that aren't selected by any other NetworkPolicy will not be allowed egress traffic. This policy does not
change the default ingress isolation behavior.
-->

这样可以确保即使没有被其他任何 NetworkPolicy 选择的 Pod 也不会被允许流出流量。此策略不会更改默认的 ingress 隔离行为。

<!--
### Default allow all egress traffic

If you want to allow all traffic from all pods in a namespace (even if policies are added that cause some pods to be treated as "isolated"), you can create a policy that explicitly allows all egress traffic in that namespace.
-->

### 默认允许所有出口流量

如果要允许来自命名空间中所有 Pod 的所有流量（即使添加了导致某些 Pod 被视为“隔离”的策略），则可以创建一个策略，该策略明确允许该命名空间中的所有出口流量。

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-all
spec:
  podSelector: {}
  egress:
  - {}
  policyTypes:
  - Egress
```

<!--
### Default deny all ingress and all egress traffic

You can create a "default" policy for a namespace which prevents all ingress AND egress traffic by creating the following NetworkPolicy in that namespace.
-->

### 默认拒绝所有入口和所有出口流量

您可以为名称空间创建 "default" 策略，以通过在该名称空间中创建以下 NetworkPolicy 来阻止所有入站和出站流量。

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: default-deny
spec:
  podSelector: {}
  policyTypes:
  - Ingress
  - Egress
```

<!--
This ensures that even pods that aren't selected by any other NetworkPolicy will not be allowed ingress or egress traffic.
-->

这样可以确保即使没有被其他任何 NetworkPolicy 选择的 Pod 也不会被允许进入或流出流量。

<!--
## SCTP support
-->
## SCTP 支持

{{< feature-state for_k8s_version="v1.12" state="alpha" >}}

<!--
Kubernetes supports SCTP as a `protocol` value in `NetworkPolicy` definitions as an alpha feature. To enable this feature, the cluster administrator needs to enable the `SCTPSupport` feature gate on the apiserver, for example, `“--feature-gates=SCTPSupport=true,...”`. When the feature gate is enabled, users can set the `protocol` field of a `NetworkPolicy` to `SCTP`. Kubernetes sets up the network accordingly for the SCTP associations, just like it does for TCP connections.

The CNI plugin has to support SCTP as `protocol` value in `NetworkPolicy`.
-->
Kubernetes 支持 SCTP 作为 NetworkPolicy 定义中的协议值作为 alpha 功能提供。要启用此功能，集群管理员需要在 apiserver 上启用 `SCTPSupport` 功能门，例如 `“--feature-gates=SCTPSupport=true,...”`。启用功能门后，用户可以将 `NetworkPolicy` 的 `protocol` 字段设置为 `SCTP`。 Kubernetes 相应地为 SCTP 关联设置网络，就像为 TCP 连接一样。

CNI插件必须在 `NetworkPolicy` 中将 SCTP 作为 `protocol` 值支持。

{{% /capture %}}

{{% capture whatsnext %}}

<!--
- See the [Declare Network Policy](/docs/tasks/administer-cluster/declare-network-policy/)
  walkthrough for further examples.
- See more [Recipes](https://github.com/ahmetb/kubernetes-network-policy-recipes) for common scenarios enabled by the NetworkPolicy resource.
-->

- 查看 [声明网络策略](/docs/tasks/administer-cluster/declare-network-policy/)
  来进行更多的示例演练
- 有关NetworkPolicy资源启用的常见方案的更多信息，请参见 [Recipes](https://github.com/ahmetb/kubernetes-network-policy-recipes)。
{{% /capture %}}
