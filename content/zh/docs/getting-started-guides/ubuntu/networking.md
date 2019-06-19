---
title: 网络
content_template: templates/task
---

<!-- ---
title: Networking
content_template: templates/task
--- -->

{{% capture overview %}}

<!-- Kubernetes supports the [Container Network Interface (CNI)](https://github.com/containernetworking/cni).
This is a network plugin architecture that allows you to use whatever
Kubernetes-friendly SDN you want. Currently this means support for Flannel and Canal. -->

Kubernetes 支持[容器网络接口](https://github.com/containernetworking/cni)。
这个网络插件架构允许你使用任何你喜欢的、对 Kubernetes 友好的 SDN。
目前支持的插件是 Flannel 和 Canal。

<!-- This page shows how the various network portions of a cluster work and how to configure them. -->
本页将展示集群中各个网络部分是如何工作，并且对它们进行相应的配置。

{{% /capture %}}
{{% capture prerequisites %}}

<!-- This page assumes you have a working Juju deployed cluster. -->
本页假设你有一个已经通过 Juju 部署、正在运行的集群。

{{< note >}}
<!-- Note that if you deploy a cluster via conjure-up or the CDK bundles, manually deploying CNI plugins is unnecessary. -->
注意，如果你是通过 `conjure-up` 或者 CDK 软件包部署的集群，将不需要再手动部署 CNI 插件。

{{< /note >}}
{{% /capture %}}


{{% capture steps %}}

<!-- The CNI charms are [subordinates](https://jujucharms.com/docs/stable/authors-subordinate-applications).
These charms will require a principal charm that implements the `kubernetes-cni` interface in order to properly deploy. -->

CNI charms 在[子路径](https://jujucharms.com/docs/stable/authors-subordinate-applications)下。
这些 charms 需要主 charm 实现 `kubernetes-cni` 接口，才能正常部署。

## Flannel

```
juju deploy flannel
juju add-relation flannel kubernetes-master
juju add-relation flannel kubernetes-worker
juju add-relation flannel etcd
```

## Canal

```
juju deploy canal
juju add-relation canal kubernetes-master
juju add-relation canal kubernetes-worker
juju add-relation canal etcd
```

<!-- ### Configuration -->
### 配置

<!-- **iface** The interface to configure the flannel or canal SDN binding. If this value is
empty string or undefined the code will attempt to find the default network
adapter similar to the following command: -->

**iface** 接口是用来配置 flannel 或 canal 的 SDN 绑定。
如果属性为空字符串或未定义，程序将通过下面的命令行试图找出默认的网络适配器：

```bash
$ route | grep default | head -n 1 | awk {'print $8'}
```

<!-- **cidr** The network range to configure the flannel or canal SDN to declare when
establishing networking setup with etcd. Ensure this network range is not active
on layers 2/3 you're deploying to, as it will cause collisions and odd behavior
if care is not taken when selecting a good CIDR range to assign to flannel. It's
also good practice to ensure you allot yourself a large enough IP range to support
how large your cluster will potentially scale.  Class A IP ranges with /24 are
a good option. -->

**cidr** 在用 etcd 进行网络设置时，用于配置 flannel 或 canal SDN 所要使用的网络地址范围。
请确保这个网络地址范围在所要部署的 L2/L3 上不是在用状态，
因为如果没有选择一个好的 CIDR 范围来分配给 flannel，就会出现冲突或异常行为。
同时也要保证 IP 地址范围足够大以支持未来可能会发生的集群扩容。
A 类 IP 地址 `/24` 是一个不错的选择。

{{% /capture %}}
