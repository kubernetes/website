---
approvers:
- thockin
- caseydavenport
- danwinship
title: 网络策略
---

{{< toc >}}

网络策略（NetworkPolicy）是一种关于pod间及pod与其他网络端点间所允许的通信规则的规范。

`NetworkPolicy` 资源使用标签选择pod，并定义选定pod所允许的通信规则。

## 前提

网络策略通过网络插件来实现，所以用户必须使用支持 `NetworkPolicy` 的网络解决方案 - 简单地创建资源对象，而没有控制器来使它生效的话，是没有任何作用的。

## 隔离和非隔离的Pod

默认情况下，Pod是非隔离的，它们接受任何来源的流量。

Pod可以通过相关的网络策略进行隔离。一旦命名空间中有网络策略选择了特定的Pod，该Pod会拒绝网络策略所不允许的连接。 (命名空间下其他未被网络策略所选择的Pod会继续接收所有的流量)

## `NetworkPolicy` 资源

通过[api参考](/docs/api-reference/{{< param "version" >}}/#networkpolicy-v1-networking)来了解资源定义。

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

除非选择支持网络策略的网络解决方案，否则将上述示例发送到API服务器没有任何效果。

__必填字段__: 与所有其他的Kubernetes配置一样，`NetworkPolicy` 需要 `apiVersion`、 `kind`和 `metadata` 字段。 关于配置文件操作的一般信息，请参考 [这里](/docs/user-guide/simple-yaml)、 [这里](/docs/user-guide/configuring-containers)和 [这里](/docs/user-guide/working-with-resources)。

__spec__: `NetworkPolicy` [spec](https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status) 中包含了在一个命名空间中定义特定网络策略所需的所有信息

__podSelector__: 每个 `NetworkPolicy` 都包括一个 `podSelector` ，它对该策略所应用的一组Pod进行选择。因为 `NetworkPolicy` 目前只支持定义 `ingress` 规则，这里的 `podSelector` 本质上是为该策略定义 "目标pod" 。示例中的策略选择带有 "role=db" 标签的pod。空的 `podSelector` 选择命名空间下的所有pod。

__ingress__: 每个 `NetworkPolicy` 包含一个 `ingress` 规则的白名单列表。 （其中的）规则允许同时匹配 `from` 和 `ports` 部分的流量。示例策略中包含一条简单的规则： 它匹配一个单一的端口，来自两个来源中的一个， 第一个通过 `namespaceSelector` 指定，第二个通过 `podSelector` 指定。

所以，示例网络策略:

1. 隔离 "default" 命名空间下 "role=db" 的pod (如果它们不是已经被隔离的话)。
2. 允许从 "default" 命名空间下带有 "role=frontend" 标签的pod到 "default" 命名空间下的pod的6379 TCP端口的连接。
3. 允许从带有 "project=myproject" 标签的命名空间下的任何pod到 "default" 命名空间下的pod的6379 TCP端口的连接。

查看 [网络策略入门指南](/docs/getting-started-guides/network-policy/walkthrough) 了解更多示例。

## 默认策略

用户可以通过创建一个选择所有Pod，但是不允许任何通信的网络策略，来为一个命名空间创建 "默认的" 隔离策略：

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: default-deny
spec:
  podSelector:
```

这可以确保即使Pod在未被其他任何网络策略所选择的情况下仍能被隔离。

或者，如果用户希望允许一个命名空间下的所有Pod的所有通信 (即使已经添加了策略，使得一些pod被 "隔离")，仍可以创建一个明确允许所有通信的策略：

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

## 下一步呢？

- 查看 [声明网络策略](/docs/tasks/administer-cluster/declare-network-policy/)
  来进行更多的示例演练
