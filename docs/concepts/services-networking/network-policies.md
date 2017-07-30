---
assignees:
- thockin
- caseydavenport
- danwinship
title: Network Policies
redirect_from:
- "/docs/user-guide/networkpolicies/"
- "/docs/user-guide/networkpolicies.html"
---

* TOC
{:toc}

<!--
A network policy is a specification of how groups of pods are allowed to communicate with each other and other network endpoints.

`NetworkPolicy` resources use labels to select pods and define rules which specify what traffic is allowed to the selected pods.
-->

网络策略说明了，一组 `Pod` 之间是如何被允许互相通信，以及与其它网络 Endpoint 进行通信。
`NetworkPolicy` 资源使用标签来选择 `Pod`，并定义了一些规则，这些规则指明了什么流量被允许进入到选中的 `Pod` 上。

<!--
## Prerequisites

Network policies are implemented by the network plugin, so you must be using a networking solution which supports `NetworkPolicy` - simply creating the resource without a controller to implement it will have no effect.
-->

## 前提条件

网络策略通过网络插件来实现，所以必须使用一种支持 `NetworkPolicy` 的网络方案 —— 不使用 Controller 来实现该资源的创建，是不起作用的。

<!--
## Isolated and Non-isolated Pods

By default, pods are non-isolated; they accept traffic from any source.

Pods become isolated by having a NetworkPolicy that selects them. Once there is any NetworkPolicy in a Namespace selecting a particular pod, that pod will reject any connections that are not allowed by any NetworkPolicy. (Other pods in the Namespace that are not selected by any NetworkPolicy will continue to accept all traffic.)
-->

## 隔离的与未隔离的 Pod

默认 Pod 是未隔离的，它们可以从任何的源接收请求。
具有一个可以选择 Pod 的网络策略后，Pod 就会变成隔离的。
一旦 Namespace 中配置的网络策略能够选择一个特定的 Pod，这个 Pod 将拒绝任何该网络策略不允许的连接。（Namespace 中其它未被网络策略选中的 Pod 将继续接收所有流量）

<!--
## The `NetworkPolicy` Resource

See the [api-reference](/docs/api-reference/v1.7/#networkpolicy-v1-networking) for a full definition of the resource.

An example `NetworkPolicy` might look like this:
-->

## `NetworkPolicy` 资源

查看 [API参考](/docs/api-reference/v1.7/#networkpolicy-v1-networking) 可以获取该资源的完整定义。

一个 `NetworkPolicy` 的例子看起来可能是这样的：

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
  ingress:
  - from:
    - namespaceSelector:
        matchLabels:
          project: myproject
    - podSelector:
        matchLabels:
          role: frontend
    ports:
    - protocol: TCP
      port: 6379
```

<!--
*POSTing this to the API server will have no effect unless your chosen networking solution supports network policy.*

__Mandatory Fields__: As with all other Kubernetes config, a `NetworkPolicy` needs `apiVersion`, `kind`, and `metadata` fields.  For general information about working with config files, see [here](/docs/user-guide/simple-yaml), [here](/docs/user-guide/configuring-containers), and [here](/docs/user-guide/working-with-resources).

__spec__: `NetworkPolicy` [spec](https://git.k8s.io/community/contributors/devel/api-conventions.md#spec-and-status) has all the information needed to define a particular network policy in the given namespace.

__podSelector__: Each `NetworkPolicy` includes a `podSelector` which selects the grouping of pods to which the policy applies. Since `NetworkPolicy` currently only supports definining `ingress` rules, this `podSelector` essentially defines the "destination pods" for the policy. The example policy selects pods with the label "role=db". An empty `podSelector` selects all pods in the namespace.

__ingress__: Each `NetworkPolicy` includes a list of whitelist `ingress` rules.  Each rule allows traffic which matches both the `from` and `ports` sections. The example policy contains a single rule, which matches traffic on a single port, from either of two sources, the first specified via a `namespaceSelector` and the second specified via a `podSelector`.
-->

*将上面配置 POST 到 API Server 将不起任何作用，除非选择的网络方案支持网络策略。*

__必选字段__：像所有其它 Kubernetes 配置一样， `NetworkPolicy` 需要 `apiVersion`、`kind` 和 `metadata` 这三个字段，关于如何使用配置文件的基本信息，可以查看 [这里](/docs/user-guide/simple-yaml)，[这里](/docs/user-guide/configuring-containers) 和 [这里](/docs/user-guide/working-with-resources)。

__spec__：`NetworkPolicy` [spec](https://git.k8s.io/community/contributors/devel/api-conventions.md#spec-and-status) 具有在给定 Namespace 中定义特定网络的全部信息。

__podSelector__：每个 `NetworkPolicy` 包含一个 `podSelector`，它可以选择一组应用了网络策略的 Pod。由于 `NetworkPolicy` 当前只支持定义 `ingress` 规则，这个 `podSelector` 实际上为该策略定义了一组 “目标Pod”。示例中的策略选择了标签为 “role=db” 的 Pod。一个空的 `podSelector` 选择了该 Namespace 中的所有 Pod。

__ingress__：每个`NetworkPolicy` 包含了一个白名单 `ingress` 规则列表。每个规则只允许能够匹配上 `from` 和 `ports` 配置段的流量。示例策略包含了单个规则，它从这两个源中匹配在单个端口上的流量，第一个是通过`namespaceSelector` 指定的，第二个是通过 `podSelector` 指定的。

<!--
So, the example NetworkPolicy:

1. isolates "role=db" pods in the "default" namespace (if they weren't already isolated)
2. allows connections to tcp port 6379 of "role=db" pods in the "default" namespace from any pod in the "default" namespace with the label "role=frontend"
3. allows connections to tcp port 6379 of "role=db" pods in the "default" namespace from any pod in a namespace with the label "project=myproject"

See the [NetworkPolicy getting started guide](/docs/getting-started-guides/network-policy/walkthrough) for further examples.
-->

因此，上面示例的 NetworkPolicy：

1. 在 “default” Namespace中 隔离了标签 “role=db” 的 Pod（如果他们还没有被隔离）
2. 在 “default” Namespace中，允许任何具有 “role=frontend” 的 Pod，连接到标签为 “role=db” 的 Pod 的 TCP 端口 6379
3. 允许在 Namespace 中任何具有标签 “project=myproject” 的 Pod，连接到 “default” Namespace 中标签为 “role=db” 的 Pod 的 TCP 端口 6379

查看 [NetworkPolicy 入门指南](/docs/getting-started-guides/network-policy/walkthrough) 给出的更进一步的例子。

<!--
## Default policies

You can create a "default" isolation policy for a Namespace by creating a NetworkPolicy that selects all pods but does not allow any traffic:
-->

## 默认策略

通过创建一个可以选择所有 Pod 但不允许任何流量的 NetworkPolicy，你可以为一个 Namespace 创建一个 “默认的” 隔离策略，如下所示：

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: default-deny
spec:
  podSelector:
```

<!--
This ensures that even pods that aren't selected by any other NetworkPolicy will still be isolated.

Alternatively, if you want to allow all traffic for all pods in a Namespace (even if policies are added that cause some pods to be treated as "isolated"), you can create a policy that explicitly allows all traffic:
-->

这确保了即使是没有被任何 NetworkPolicy 选中的 Pod，将仍然是被隔离的。

可选地，在 Namespace 中，如果你想允许所有的流量进入到所有的 Pod（即使已经添加了某些策略，使一些 Pod 被处理为 “隔离的”），你可以通过创建一个策略来显式地指定允许所有流量：

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-all
spec:
  podSelector:
  ingress:
  - {}
```

<!--
## What's next?

- See the [Declare Network Policy](/docs/tasks/administer-cluster/declare-network-policy/)
  walkthrough for further examples.
  -->

## 下一步呢？

查看 [声明网络策略](/docs/tasks/administer-cluster/declare-network-policy/) 学习进阶的例子。
