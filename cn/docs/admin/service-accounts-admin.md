---
assignees:
- bprashanth
- davidopp
- lavalamp
- liggitt
title: 管理服务帐号（Service Accounts）
---
<!--
---
assignees:
- bprashanth
- davidopp
- lavalamp
- liggitt
title: Managing Service Accounts
---
-->

<!--
*This is a Cluster Administrator guide to service accounts.  It assumes knowledge of
the [User Guide to Service Accounts](/docs/user-guide/service-accounts).*

*Support for authorization and user accounts is planned but incomplete.  Sometimes
incomplete features are referred to in order to better describe service accounts.*
-->
*本文是服务帐户管理员手册。需要[服务帐户用户手册](/docs/user-guide/service-accounts)的知识背景。*

*对于认证和用户帐号（user accounts）的支持已经在计划中，但是还未完成。为了更好地解释用户帐户，有时会提到一些未完成的功能特性。*

<!--
## User accounts vs service accounts
-->
## 用户账号 vs 服务账号

<!--
Kubernetes distinguished between the concept of a user account and a service accounts
for a number of reasons:

  - User accounts are for humans.  Service accounts are for processes, which
    run in pods.
  - User accounts are intended to be global. Names must be unique across all
    namespaces of a cluster, future user resource will not be namespaced.
    Service accounts are namespaced.
  - Typically, a cluster's User accounts might be synced from a corporate
    database, where new user account creation requires special privileges and
    is tied to complex business  processes.  Service account creation is intended
    to be more lightweight, allowing cluster users to create service accounts for
    specific tasks (i.e. principle of least privilege).
  - Auditing considerations for humans and service accounts may differ.
  - A config bundle for a complex system may include definition of various service
    accounts for components of that system.  Because service accounts can be created
    ad-hoc and have namespaced names, such config is portable.
-->
Kubernetes 将用户账号和服务账号的概念区分开，主要基于以下几个原因：

  - 用户账号是给人使用的。服务账号是给 pod 中运行的进程使用的。
  - 用户账号为全局设计的。命名必须在一个集群的所有命名空间中唯一，未来的用户资源不会被设计到命名空间中。
    服务账号是在命名空间里的。
  - 典型场景中，一个集群的用户账号是从企业数据库的同步来的，在数据库中新用户帐号一般需要特殊权限，并且账号是与复杂的业务流程关联的。
    服务账号的创建往往更轻量，允许集群用户为特定的任务创建服务账号（即，权限最小化原则）。
  - 对于人和服务的账号，审计要求会是不同的。
  - 对于复杂系统而言，配置包可以包含该系统各类组件的服务账号定义，
    因为服务账号能被临时创建，并且有命名空间分类的名字，这类配置是便携式的。

<!--
## Service account automation
-->
## 服务账号自动化

<!--
Three separate components cooperate to implement the automation around service accounts:

  - A Service account admission controller
  - A Token controller
  - A Service account controller
-->
服务账号的自动化由三个独立的组件共同配合实现：

  - 服务账号准入控制器（Service account admission controller）
  - 令牌控制器（Token controller）
  - 服务账号控制器（Service account controller）

<!--
### Service Account Admission Controller
-->
### 服务账号准入控制器

<!--
The modification of pods is implemented via a plugin
called an [Admission Controller](/docs/admin/admission-controllers). It is part of the apiserver.
It acts synchronously to modify pods as they are created or updated. When this plugin is active
(and it is by default on most distributions), then it does the following when a pod is created or modified:

  1. If the pod does not have a `ServiceAccount` set, it sets the `ServiceAccount` to `default`.
  2. It ensures that the `ServiceAccount` referenced by the pod exists, and otherwise rejects it.
  4. If the pod does not contain any `ImagePullSecrets`, then `ImagePullSecrets` of the
`ServiceAccount` are added to the pod.
  5. It adds a `volume` to the pod which contains a token for API access.
  6. It adds a `volumeSource` to each container of the pod mounted at `/var/run/secrets/kubernetes.io/serviceaccount`.
-->
对于 pods 的操作是通过一个叫做 [准入控制器](/docs/admin/admission-controllers) 的插件（plugin）实现的。它是 APIserver 的一部分。
当 pod 被创建或更新时，它会同步更改 pod。当这个插件是活动状态时（大部分版本默认是活动状态），在 pod 被创建或者更改时，
它会做如下操作：

 1. 如果 pod 没有配置 `ServiceAccount`，它会将 `ServiceAccount` 设置为 `default`。
 2. 确保被 pod 关联的 `ServiceAccount` 是存在的，否则就拒绝请求。
 3. 如果 pod 没有包含任何的 `ImagePullSecrets`，那么 `ServiceAccount` 的 `ImagePullSecrets` 就会被添加到 pod。
 4. 它会把 `volume` 添加给 pod，该 pod 包含有一个用于 API 访问的令牌。
 5. 它会把 `volumeSource` 添加到 pod 的每个容器，挂载到 `/var/run/secrets/kubernetes.io/serviceaccount`。

<!--
### Token Controller
-->
### 令牌控制器

<!--
TokenController runs as part of controller-manager. It acts asynchronously. It:

- observes serviceAccount creation and creates a corresponding Secret to allow API access.
- observes serviceAccount deletion and deletes all corresponding ServiceAccountToken Secrets
- observes secret addition, and ensures the referenced ServiceAccount exists, and adds a token to the secret if needed
- observes secret deletion and removes a reference from the corresponding ServiceAccount if needed

You must pass a service account private key file to the token controller in the controller-manager by using
the `--service-account-private-key-file` option. The private key will be used to sign generated service account tokens.
Similarly, you must pass the corresponding public key to the kube-apiserver using the `--service-account-key-file`
option. The public key will be used to verify the tokens during authentication.
-->
令牌控制器（TokenController）作为 controller-manager 的一部分运行。它异步运行。它会：

- 监听对于 serviceAccount 的创建动作，并创建对应的 Secret 以允许 API 访问。
- 监听对于 serviceAccount 的删除动作，并删除所有对应的 ServiceAccountToken Secret。
- 监听对于 secret 的添加动作，确保相关联的 ServiceAccount 是存在的，并根据需要为 secret 添加一个令牌。
- 监听对于 secret 的删除动作，并根据需要删除对应 ServiceAccount 的关联。

你必须给令牌控制器传递一个服务帐号的私钥（private key），通过 `--service-account-private-key-file` 参数完成。传递的私钥将被用来对服务帐号令牌进行签名。
类似的，你必须给 kube-apiserver 传递一个公钥（public key），通过 `--service-account-key-file` 参数完成。传递的公钥在认证过程中会被用于验证令牌。

<!--
#### To create additional API tokens
-->
#### 创建额外的 API 令牌（API token）

<!--
A controller loop ensures a secret with an API token exists for each service
account. To create additional API tokens for a service account, create a secret
of type `ServiceAccountToken` with an annotation referencing the service
account, and the controller will update it with a generated token:
-->
控制器的循环运行会确保对于每个服务帐号都存在一个带有 API 令牌的 secret。
如需要为服务帐号创建一个额外的 API 令牌，可以创建一个 `ServiceAccountToken`
类型的 secret，并添加与服务帐号对应的 annotation 属性，控制器会为它更新令牌：

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

<!--
#### To delete/invalidate a service account token
-->
#### 删除/作废服务账号令牌

```shell
kubectl delete secret mysecretname
```

<!--
### Service Account Controller
-->
### 服务账号控制器

<!--
Service Account Controller manages ServiceAccount inside namespaces, and ensures
a ServiceAccount named "default" exists in every active namespace.
-->
服务帐号控制器在命名空间内管理 ServiceAccount，需要保证名为 "default" 的 ServiceAccount 在每个命名空间中存在。
