---
approvers:
- derekwaynecarr
title: 资源配额
---

当多个用户或团队共享具有固定数目节点的集群时，人们会担心有人使用的资源超出应有的份额。

资源配额是帮助管理员解决这一问题的工具。

资源配额， 通过 `ResourceQuota` 对象来定义， 对每个namespace的资源消耗总量提供限制。 它可以按类型限制namespace下可以创建的对象的数量，也可以限制可被该项目以资源形式消耗的计算资源的总量。

资源配额的工作方式如下：

- 不同的团队在不同的namespace下工作。 目前这是自愿的， 但计划通过ACL (Access Control List 访问控制列表) 
  使其变为强制性的。
- 管理员为每个namespace创建一个或多个资源配额对象。
- 用户在namespace下创建资源 (pods、 services等)，同时配额系统会跟踪使用情况，来确保其不超过
  资源配额中定义的硬性资源限额。
- 如果资源的创建或更新违反了配额约束，则请求会失败，并返回 HTTP状态码 `403 FORBIDDEN` ，以及说明违反配额
  约束的信息。
- 如果namespace下的计算资源 （如 `cpu` 和 `memory`）的配额被启用，则用户必须为这些资源设定请求值（request）
  和约束值（limit），否则配额系统将拒绝Pod的创建。  
  提示: 可使用 LimitRange 准入控制器来为没有设置计算资源需求的Pod设置默认值。
  作为示例，请参考 [演练](/docs/tasks/administer-cluster/quota-memory-cpu-namespace/) 来避免这个问题。

下面是使用namespace和配额构建策略的示例：

- 在具有 32 GiB 内存 和 16 核CPU资源的集群中， 允许A团队使用 20 GiB 内存 和 10 核的CPU资源，
  允许B团队使用 10GiB 内存和 4 核的CPU资源， 并且预留 2GiB 内存和 2 核的CPU资源供将来分配。
- 限制 "testing" namespace使用 1 核CPU资源和 1GiB 内存。  允许 "production" namespace使用任意数量。

在集群容量小于各namespace配额总和的情况下，可能存在资源竞争。 Kubernetes采用先到先服务的方式处理这类问题。

无论是资源竞争还是配额的变更都不会影响已经创建的资源。

## 启用资源配额

资源配额的支持在很多Kubernetes版本中是默认开启的。 当 apiserver 的 
`--admission-control=` 参数中包含 `ResourceQuota` 时，资源配额会被启用。

当namespace中存在一个 `ResourceQuota` 对象时，该namespace即开始实施资源配额管理。 
一个namespace中最多只应存在一个 `ResourceQuota` 对象

## 计算资源配额

用户可以对给定namespace下的 [计算资源](/docs/user-guide/compute-resources) 总量进行限制。

配额机制所支持的资源类型：

| 资源名称 | 描述 |
| --------------------- | ----------------------------------------------------------- |
| `cpu` | 所有非终止状态的Pod中，其CPU需求总量不能超过该值。 |
| `limits.cpu` | 所有非终止状态的Pod中，其CPU限额总量不能超过该值。 |
| `limits.memory` | 所有非终止状态的Pod中，其内存限额总量不能超过该值。 |
| `memory` | 所有非终止状态的Pod中，其内存需求总量不能超过该值。 |
| `requests.cpu` | 所有非终止状态的Pod中，其CPU需求总量不能超过该值。 |
| `requests.memory` | 所有非终止状态的Pod中，其内存需求总量不能超过该值。 |

## 存储资源配额

用户可以对给定namespace下的 [存储资源](/docs/user-guide/persistent-volumes) 总量进行限制。

此外，还可以根据相关的存储类（Storage Class）来限制存储资源的消耗。

| 资源名称 | 描述 |
| --------------------- | ----------------------------------------------------------- |
| `requests.storage` | 所有的PVC中，存储资源的需求不能超过该值。 |
| `persistentvolumeclaims` | namespace中所允许的 [PVC](/docs/user-guide/persistent-volumes/#persistentvolumeclaims) 总量。 |
| `<storage-class-name>.storageclass.storage.k8s.io/requests.storage` | 所有该storage-class-name相关的PVC中， 存储资源的需求不能超过该值。 |
| `<storage-class-name>.storageclass.storage.k8s.io/persistentvolumeclaims` |  namespace中所允许的该storage-class-name相关的[PVC](/docs/user-guide/persistent-volumes/#persistentvolumeclaims)的总量。 |

例如，如果一个操作人员针对 "黄金" 存储类型与 "铜" 存储类型设置配额，操作员可以
定义配额如下：

* `gold.storageclass.storage.k8s.io/requests.storage: 500Gi`
* `bronze.storageclass.storage.k8s.io/requests.storage: 100Gi`

## 对象数量配额

给定类型的对象数量可以被限制。 支持以下类型：

| 资源名称 | 描述 |
| ------------------------------- | ------------------------------------------------- |
| `configmaps` | namespace下允许存在的configmap的数量。 |
| `persistentvolumeclaims` | namespace下允许存在的[PVC](/docs/user-guide/persistent-volumes/#persistentvolumeclaims)的数量。 |
| `pods` | namespace下允许存在的非终止状态的pod数量。 如果pod 的 `status.phase 为 Failed 或 Succeeded` ， 那么其处于终止状态。  |
| `replicationcontrollers` | namespace下允许存在的replication controllers的数量。 |
| `resourcequotas` | namespace下允许存在的 [resource quotas](/docs/admin/admission-controllers/#resourcequota) 的数量。 |
| `services` | namespace下允许存在的service的数量。 |
| `services.loadbalancers` | namespace下允许存在的load balancer类型的service的数量。 |
| `services.nodeports` | namespace下允许存在的node port类型的service的数量。 |
| `secrets` | namespace下允许存在的secret的数量。 |

例如 `pods` 配额统计并保证单个namespace下创建 `pods` 的最大数量。

用户可能希望在namespace中为pod设置配额，来避免有用户创建很多小的pod，从而耗尽集群提供的pod IP地址。

## 配额作用域

每个配额都有一组相关的作用域（scope），配额只会对作用域内的资源生效。

当一个作用域被添加到配额中后，它会对作用域相关的资源数量作限制。
如配额中指定了允许（作用域）集合之外的资源，会导致验证错误。

| 范围 | 描述 |
| ----- | ----------- |
| `Terminating` | 匹配 `spec.activeDeadlineSeconds >= 0` 的pod。 |
| `NotTerminating` | 匹配 `spec.activeDeadlineSeconds is nil` 的pod。 |
| `BestEffort` | 匹配"尽力而为（best effort)"服务类型的pod。 |
| `NotBestEffort` | 匹配非"尽力而为（best effort)"服务类型的pod。 |

`BestEffort` 作用域限制配额跟踪以下资源： `pods`

`Terminating`、 `NotTerminating` 和 `NotBestEffort` 限制配额跟踪以下资源：

* `cpu`
* `limits.cpu`
* `limits.memory`
* `memory`
* `pods`
* `requests.cpu`
* `requests.memory`

## 请求／约束

分配计算资源时，每个容器可以为CPU或内存指定请求和约束。
也可以设置两者中的任何一个。

如果配额中指定了 `requests.cpu` 或 `requests.memory` 的值，那么它要求每个进来的容器针对这些资源有明确的请求。  如果配额中指定了 `limits.cpu` 或 `limits.memory`的值，那么它要求每个进来的容器针对这些资源指定明确的约束。

## 查看和设置配额

Kubectl 支持创建、更新和查看配额：

```shell
$ kubectl create namespace myspace

$ cat <<EOF > compute-resources.yaml
apiVersion: v1
kind: ResourceQuota
metadata:
  name: compute-resources
spec:
  hard:
    pods: "4"
    requests.cpu: "1"
    requests.memory: 1Gi
    limits.cpu: "2"
    limits.memory: 2Gi
EOF
$ kubectl create -f ./compute-resources.yaml --namespace=myspace

$ cat <<EOF > object-counts.yaml
apiVersion: v1
kind: ResourceQuota
metadata:
  name: object-counts
spec:
  hard:
    configmaps: "10"
    persistentvolumeclaims: "4"
    replicationcontrollers: "20"
    secrets: "10"
    services: "10"
    services.loadbalancers: "2"
EOF
$ kubectl create -f ./object-counts.yaml --namespace=myspace

$ kubectl get quota --namespace=myspace
NAME                    AGE
compute-resources       30s
object-counts           32s

$ kubectl describe quota compute-resources --namespace=myspace
Name:                  compute-resources
Namespace:             myspace
Resource               Used Hard
--------               ---- ----
limits.cpu             0    2
limits.memory          0    2Gi
pods                   0    4
requests.cpu           0    1
requests.memory        0    1Gi

$ kubectl describe quota object-counts --namespace=myspace
Name:                   object-counts
Namespace:              myspace
Resource                Used    Hard
--------                ----    ----
configmaps              0       10
persistentvolumeclaims  0       4
replicationcontrollers  0       20
secrets                 1       10
services                0       10
services.loadbalancers  0       2
```

## 配额和集群容量

配额对象是独立于集群容量的。它们通过绝对的单位来表示。 所以，为集群添加节点， *不会*
自动赋予每个namespace消耗更多资源的能力。

有时可能需要更复杂的策略，比如：

  - 在几个团队中按比例划分总的集群资源。
  - 允许每个租户根据需要增加资源使用量，但要有足够的限制以防止意外资源耗尽。
  - 在namespace中添加节点、提高配额的额外需求。

这些策略可以基于 ResourceQuota，通过编写一个检测配额使用，并根据其他信号调整各namespace下的配额硬性限制的 "控制器" 来实现。

注意：资源配额对集群资源总体进行划分，但它对节点没有限制：来自多个namespace的Pod可能在同一节点上运行。

## 示例

查看 [如何使用资源配额的详细示例](/docs/tasks/administer-cluster/quota-api-object/)。

## 更多信息

查看 [资源配额设计文档](https://git.k8s.io/community/contributors/design-proposals/resource-management/admission_control_resource_quota.md) 了解更多信息。
