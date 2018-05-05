---
approvers:
- bprashanth
- davidopp
- lavalamp
- liggitt
title: 管理Service Accounts
---

*这是一篇针对service accounts（服务账户）的集群管理员指南。  它呈现了 [User Guide to Service Accounts](/docs/user-guide/service-accounts)中的信息。* 

*对授权和用户账户的支持已在规划中，当前并不完备，为了更好地描述service accounts，有时这些不完善的特性也会被提及。*

## 用户账户与服务账户

Kubernetes 区分用户账户和服务账户的概念主要基于以下原因：

  - 用户账户是针对人而言的。  服务账户是针对运行在pod中的进程而言的。
  - 用户账户是全局性的。 其名称在集群各namespace中都是全局唯一的，未来的用户资源不会做namespace隔离，
    服务账户是namespace隔离的。
  - 通常情况下，集群的用户账户可能会从企业数据库进行同步，其创建需要特殊权限，并且涉及到复杂的业务流程。 服务账户创建的目的是为了更轻量，允许集群用户为了具体的任务创建服务账户 (即权限最小化原则)。
  - 对人员和服务账户审计所考虑的因素可能不同。
  - 针对复杂系统的配置可能包含系统组件相关的各种服务账户的定义。 因为服务账户可以定制化地创建，并且有namespace级别的名称，这种配置是很轻量的。

## 服务账户的自动化

三个独立组件协作完成服务账户相关的自动化:

  - 服务账户准入控制器（Service account admission controller）
  - Token控制器（Token controller）
  - 服务账户控制器（Service account controller）

### 服务账户准入控制器

对pod的改动通过一个被称为[Admission Controller](/docs/admin/admission-controllers)的插件来实现。它是apiserver的一部分。
当pod被创建或更新时，它会同步地修改pod。 当该插件处于激活状态(在大多数发行版中都是默认的)，当pod被创建或更新时它会进行以下动作：

  1. 如果该pod没有 `ServiceAccount` 设置，将其 `ServiceAccount` 设为 `default`。
  2. 保证pod所关联的 `ServiceAccount` 存在，否则拒绝该pod。
  4. 如果pod不包含 `ImagePullSecrets`设置，那么 将 `ServiceAccount`中的`ImagePullSecrets` 信息添加到pod中。
  5. 将一个包含用于API访问的token的 `volume` 添加到pod中。
  6. 将挂载于 `/var/run/secrets/kubernetes.io/serviceaccount` 的 `volumeSource`添加到pod下的每个容器中。

### Token管理器

Token管理器是controller-manager的一部分。 以异步的形式工作：

- 检测服务账户的创建，并且创建相应的Secret以支持API访问。
- 检测服务账户的删除，并且删除所有相应的服务账户Token Secret。
- 检测Secret的增加，保证相应的服务账户存在，如有需要，为Secret增加token。
- 检测Secret的删除，如有需要，从相应的服务账户中移除引用。

你需要通过 `--service-account-private-key-file` 参数项传入一个服务账户私钥文件至Token管理器。 私钥用于为生成的服务账户token签名。
同样地，你需要通过 `--service-account-key-file` 参数将对应的公钥传入kube-apiserver。 公钥用于认证过程中的token校验。

#### 创建额外的 API tokens

控制器中有专门的循环来保证每个服务账户中都存在API token对应的Secret。 当需要为服务账户创建额外的API token时，创建一个类型为 `ServiceAccountToken` 的Secret，并在annotation中引用服务账户，控制器会生成token并更新:

secret.json:

```json
{
    "kind": "Secret",
    "apiVersion": "v1",
    "metadata": {
        "name": "mysecretname",
        "annotations": {
            "kubernetes.io/service-account.name": "myserviceaccount"
        }
    },
    "type": "kubernetes.io/service-account-token"
}
```

```shell
kubectl create -f ./secret.json
kubectl describe secret mysecretname
```

#### 删除/失效 服务账户token

```shell
kubectl delete secret mysecretname
```

### 服务账户管理器

服务账户管理器管理各命名空间下的服务账户，并且保证每个活跃的命名空间下存在一个名为 "default" 的服务账户
