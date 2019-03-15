---
reviewers:
- bprashanth
- davidopp
- lavalamp
- liggitt
title: 管理 Service Accounts
content_template: templates/concept
weight: 50
---

<!--
---
reviewers:
- bprashanth
- davidopp
- lavalamp
- liggitt
title: Managing Service Accounts
content_template: templates/concept
weight: 50
---
-->

{{% capture overview %}}

<!--
This is a Cluster Administrator guide to service accounts. It assumes knowledge of
the [User Guide to Service Accounts](/docs/user-guide/service-accounts).
-->
这是一个关于 service accounts 的集群管理指南，它假设您了解 [Service Accounts 用户指南](/docs/user-guide/service-accounts)。

<!--
Support for authorization and user accounts is planned but incomplete.  Sometimes
incomplete features are referred to in order to better describe service accounts.
-->
计划支持授权和用户帐户，但并不完整。有时会引用不完整的功能以便更好地描述 service accounts。

{{% /capture %}}

{{% capture body %}}

<!--
## User accounts vs service accounts
-->

## 用户帐户与 service accounts

<!--
Kubernetes distinguishes between the concept of a user account and a service account
for a number of reasons:
-->
Kubernetes 区分用户帐户和 service account 的概念有以下几个原因：

<!--
  - User accounts are for humans. Service accounts are for processes, which
    run in pods.
  - User accounts are intended to be global. Names must be unique across all
    namespaces of a cluster, future user resource will not be namespaced.
    Service accounts are namespaced.
  - Typically, a cluster's User accounts might be synced from a corporate
    database, where new user account creation requires special privileges and
    is tied to complex business processes. Service account creation is intended
    to be more lightweight, allowing cluster users to create service accounts for
    specific tasks (i.e. principle of least privilege).
  - Auditing considerations for humans and service accounts may differ.
  - A config bundle for a complex system may include definition of various service
    accounts for components of that system.  Because service accounts can be created
    ad-hoc and have namespaced names, such config is portable.
-->

  - 用户帐户是针对用户的。Service accounts 用于进程，这些进程在 pods 中运行。
  - 用户帐户应该是全局性的。名称必须在集群的所有命名空间中都是唯一的，未来的用户资源将不会使用命名空间。Service accounts 使用命名空间。
  - 通常，集群的用户帐户可能与企业数据库同步，在企业数据库中，新用户帐户的创建需要特殊的权限，并且与复杂的业务流程相关联。
    Service account 创建的目的是更加轻量级，允许集群用户为特定任务创建 Service account (即：最小特权原则)。
  - 对人员和 Service account 的审计考虑可能有所不同。    
  - 复杂系统的配置包可能包括该系统组件的各种 Service account 的定义。由于 Service account 可以临时创建并具有命名空间名称，因此这种配置是可移植的。

<!--
## Service account automation
-->

## Service account 自动化

<!--
Three separate components cooperate to implement the automation around service accounts:
-->
三个独立的组件合作实现 service accounts 的自动化：

<!--
  - A Service account admission controller
  - A Token controller
  - A Service account controller
-->

  - Service account 准入控制器
  - 令牌控制器
  - Service account 控制器

<!--
### Service Account Admission Controller
-->

### Service Account 准入控制器

<!--
The modification of pods is implemented via a plugin
called an [Admission Controller](/docs/reference/access-authn-authz/admission-controllers/). It is part of the apiserver.
It acts synchronously to modify pods as they are created or updated. When this plugin is active
(and it is by default on most distributions), then it does the following when a pod is created or modified:
-->
pod 的修改是通过一个名为[准入控制器](/docs/reference/access-authn-authz/admission-controllers/)的插件实现的。它是 apiserver 的一部分。它可以同步操作，以便在创建或更新 pod 时对其进行修改。
当此插件处于活动状态时（默认情况下在大多数发行版中），则在创建或修改 pod 时执行以下操作：

<!--
  1. If the pod does not have a `ServiceAccount` set, it sets the `ServiceAccount` to `default`.
  1. It ensures that the `ServiceAccount` referenced by the pod exists, and otherwise rejects it.
  1. If the pod does not contain any `ImagePullSecrets`, then `ImagePullSecrets` of the `ServiceAccount` are added to the pod.
  1. It adds a `volume` to the pod which contains a token for API access.
  1. It adds a `volumeSource` to each container of the pod mounted at `/var/run/secrets/kubernetes.io/serviceaccount`.
-->

  1. 如果 pod 没有设置 `ServiceAccount`，它将 `ServiceAccount` 设置为 `default`。
  2. 它确保 pod 引用的 `ServiceAccount` 存在，否则拒绝它。
  3. 如果 pod 不包含任何 `ImagePullSecrets`，则将 `ServiceAccount` 的 `ImagePullSecrets` 添加到 pod 中。
  4. 它向包含 API 访问令牌的 pod 添加了一个 `volume`。
  5. 它为 pod 内的每个容器添加一个 `volumeSource`，该 volume 被挂载到 `/var/run/secrets/kubernetes.io/serviceaccount`。

<!--
### Token Controller
-->

### 令牌控制器

<!--
TokenController runs as part of controller-manager. It acts asynchronously. It:
-->
TokenController 作为控制器-管理器的一部分异步运行。它用于:

<!--
- observes serviceAccount creation and creates a corresponding Secret to allow API access.
- observes serviceAccount deletion and deletes all corresponding ServiceAccountToken Secrets.
- observes secret addition, and ensures the referenced ServiceAccount exists, and adds a token to the secret if needed.
- observes secret deletion and removes a reference from the corresponding ServiceAccount if needed.
-->

- 观察 serviceAccount 创建并创建相应的 Secret 以允许 API 访问。
- 观察 serviceAccount 删除并删除所有相应的 ServiceAccountToken Secrets。
- 观察 secret 添加，并确保引用的 ServiceAccount 存在，并在需要时向该 secret 添加令牌。
- 观察 secret 删除并在需要时从相应的 ServiceAccount 中删除引用。

<!--
You must pass a service account private key file to the token controller in the controller-manager by using
the `--service-account-private-key-file` option. The private key will be used to sign generated service account tokens.
Similarly, you must pass the corresponding public key to the kube-apiserver using the `--service-account-key-file`
option. The public key will be used to verify the tokens during authentication.
-->
您必须使用 `--service-account-private-key-file` 选项将 service account 私钥文件传递给控制器-管理器中的令牌控制器。
私钥将用于签署生成的 service account 令牌。同样，您必须使用 `--service-account-key-file` 选项将相应的公钥传递给
kube-apiserver。公钥将用于在身份验证期间验证令牌。

<!--
#### To create additional API tokens
-->

#### 创建其他 API 令牌

<!--
A controller loop ensures a secret with an API token exists for each service
account. To create additional API tokens for a service account, create a secret
of type `ServiceAccountToken` with an annotation referencing the service
account, and the controller will update it with a generated token:
-->
控制器循环确保每个 service account 都存在具有 API 令牌的 secret。要为 service account 创建其他 API 令牌，
请使用 ServiceAccountToken 引用 service account 的注解创建类型的 secret，控制器将使用生成的令牌更新它：

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

#### 删除/无效化 一个 service account 令牌

```shell
kubectl delete secret mysecretname
```

<!--
### Service Account Controller
-->

### Service Account 控制器

<!--
Service Account Controller manages ServiceAccount inside namespaces, and ensures
a ServiceAccount named "default" exists in every active namespace.
-->
Service Account 控制器在命名空间中管理 ServiceAccount，并确保每个活动命名空间中都存在一个名为 `default` 的 ServiceAccount。

{{% /capture %}}
