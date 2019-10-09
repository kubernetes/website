---
approvers:
- sttts
title: Kubernetes集群中使用Sysctls
---

{{< toc >}}

这篇文章描述了如何在Kubernetes集群中使用Sysctls。

## 什么是Sysctl？

在Linux中，Sysctl接口允许管理员在内核运行时修改内核参数。这些可用参数都存在于虚拟进程文件系统中的`/proc/sys/`目录。这些内核参数作用于各种子系统中，例如：

- 内核 (通用前缀：`kernel.`)
- 网络 (通用前缀：`net.`)
- 虚拟内存 (通用前缀：`vm.`)
- 设备专用 (通用前缀：`dev.`)
- 更多子系统描述见 [Kernel docs](https://www.kernel.org/doc/Documentation/sysctl/README).

获取所有参数列表，可运行

```
$ sudo sysctl -a
```

## 命名空间级vs.节点级Sysctls

在今天的Linux内核系统中有一些Sysctls是 _命名空间级_ 的。这意味着他们在同节点的不同pod间是可配置成独立的。在kubernetes里，命名空间级是Sysctls的一个必要条件，以使其在一个pod语境里易于理解。

以下列出了Sysctls中已知的 _命名空间级_ ：

- `kernel.shm*`（内核中共享内存相关参数），
- `kernel.msg*`（内核中SystemV消息队列相关参数），
- `kernel.sem`（内核中信号量参数），
- `fs.mqueue.*`（内核中POSIX消息队列相关参数），
- `net.*`（内核中网络配置项相关参数），如果它可以在容器命名空间里被更改。然而，也有一些特例
  (例如，`net.netfilter.nf_conntrack_max` 和
  `net.netfilter.nf_conntrack_expect_max`
  可以在容器命名空间里被更改，但它们是非命名空间的)。

Sysctls中非命名空间级的被称为 _节点级_ ，其必须由集群管理员手动设置，要么通过节点的底层Linux分布方式(例如，通过 `/etc/sysctls.conf`)，亦或在特权容器中使用Daemonset。

**注意**: 这是很好的做法，考虑在一个集群里给有特殊sysctl的节点设置为 _污点_ ，并且给他们安排仅需要这些sysctl设置的pods。 建议采用Kubernetes [_污点和容点_
特征](/docs/user-guide/kubectl/{{< param "version" >}}/#taint) 来实现。

## 安全的 vs. 不安全的 Sysctls

Sysctls被分为 _安全的_ 和 _不安全的_ sysctls。同一节点上的pods间除了适当命名空间命名一个 _安全的_ sysctl，还必须适当的 _隔离_ 。 这意味着给一个pod设置一个 _安全的_ sysctl

- 不能对相同节点上其他pod产生任何影响
- 不能对节点的健康造成损害
- 不能在pod资源限制以外获取更多的CPU和内存资源

目前看来，大多数的 _命名空间级_ sysctls 不一定被认为是 _安全的_ 。

在Kubernetes 1.4版本中，以下sysctls提供了 _安全的_ 配置：

- `kernel.shm_rmid_forced`,
- `net.ipv4.ip_local_port_range`,
- `net.ipv4.tcp_syncookies`.

该列表在未来的Kubernetes版本里还会继续扩充，当kubelet提供更好的隔离机制时。

所有 _安全的_ sysctls 都是默认启用的。

所有 _不安全的_ sysctls 默认是关闭的，且必须通过每个节点基础上的集群管理手动开启。禁用不安全的sysctls的Pods将会被计划，但不会启动。

**警告**: 由于他们的本质是 _不安全的_ ，使用 _不安全的_ sysctls是自担风险的，并且会导致严重的问题，例如容器的错误行为，资源短缺或者是一个节点的完全破损。

## 使能不安全的Sysctls

牢记上面的警告， 在非常特殊的情况下，例如高性能指标或是实时应用程序优化，集群管理员可以允许 _不安全的_
sysctls。 _不安全的_ sysctls 会打上kubelet标识，在逐节点的基础上被启用，例如：

```shell
$ kubelet --experimental-allowed-unsafe-sysctls 'kernel.msg*,net.core.somaxconn' ...
```

只有 _命名空间级_ sysctls 可以使用该方法启用。

## 给Pod配置Sysctls

在Kubernetes 1.4版本中，sysctl特性是一个alpha API。因此，sysctls被设置为在pods上使用注释。它们适用于同一个pod上的所有容器。

这里列举了一个例子， _安全的_ 和 _不安全的_ sysctls使用不同的注释:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: sysctl-example
  annotations:
    security.alpha.kubernetes.io/sysctls: kernel.shm_rmid_forced=1
    security.alpha.kubernetes.io/unsafe-sysctls: net.core.somaxconn=1024,kernel.msgmax=1 2 3
spec:
  ...
```

**注意**: 包含以上规定的 _不安全的_ sysctls的一个Pod， 将无法启动任何不能使这两个 _不安全的_ sysctls明确的节点。 推荐
_节点级_ sysctls使用 [_容点和污点_
特征](/docs/user-guide/kubectl/v1.6/#taint) or [taints on nodes](/docs/concepts/configuration/taint-and-toleration/)
来将这些pods分配到正确的nodes上。
