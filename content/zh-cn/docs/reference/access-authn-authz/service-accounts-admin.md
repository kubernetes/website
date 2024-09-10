---
title: 管理服务账号
content_type: concept
weight: 50
---
<!--
reviewers:
  - liggitt
  - enj
title: Managing Service Accounts
content_type: concept
weight: 50
-->

<!-- overview -->

<!--
A _ServiceAccount_ provides an identity for processes that run in a Pod.

A process inside a Pod can use the identity of its associated service account to
authenticate to the cluster's API server.
-->
**ServiceAccount** 为 Pod 中运行的进程提供了一个身份。

Pod 内的进程可以使用其关联服务账号的身份，向集群的 API 服务器进行身份认证。

<!--
For an introduction to service accounts, read [configure service accounts](/docs/tasks/configure-pod-container/configure-service-account/).

This task guide explains some of the concepts behind ServiceAccounts. The
guide also explains how to obtain or revoke tokens that represent
ServiceAccounts.
-->
有关服务账号的介绍，
请参阅[配置服务账号](/zh-cn/docs/tasks/configure-pod-container/configure-service-account/)。

本任务指南阐述有关 ServiceAccount 的几个概念。
本指南还讲解如何获取或撤销代表 ServiceAccount 的令牌。

<!-- body -->

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

<!--
To be able to follow these steps exactly, ensure you have a namespace named
`examplens`.
If you don't, create one by running:
-->
为了能够准确地跟随这些步骤，确保你有一个名为 `examplens` 的名字空间。
如果你没有，运行以下命令创建一个名字空间：

```shell
kubectl create namespace examplens
```

<!--
## User accounts versus service accounts

Kubernetes distinguishes between the concept of a user account and a service account
for a number of reasons:
-->
## 用户账号与服务账号  {#user-accounts-versus-service-accounts}

Kubernetes 区分用户账号和服务账号的概念，主要基于以下原因：

<!--
- User accounts are for humans. Service accounts are for application processes,
  which (for Kubernetes) run in containers that are part of pods.
- User accounts are intended to be global: names must be unique across all
  namespaces of a cluster. No matter what namespace you look at, a particular
  username that represents a user represents the same user.
  In Kubernetes, service accounts are namespaced: two different namespaces can
  contain ServiceAccounts that have identical names.
-->
- 用户账号是针对人而言的。而服务账号是针对运行在 Pod 中的应用进程而言的，
  在 Kubernetes 中这些进程运行在容器中，而容器是 Pod 的一部分。
- 用户账号是全局性的。其名称在某集群中的所有名字空间中必须是唯一的。
  无论你查看哪个名字空间，代表用户的特定用户名都代表着同一个用户。
  在 Kubernetes 中，服务账号是名字空间作用域的。
  两个不同的名字空间可以包含具有相同名称的 ServiceAccount。
<!--
- Typically, a cluster's user accounts might be synchronised from a corporate
  database, where new user account creation requires special privileges and is
  tied to complex business processes. By contrast, service account creation is
  intended to be more lightweight, allowing cluster users to create service accounts
  for specific tasks on demand. Separating ServiceAccount creation from the steps to
  onboard human users makes it easier for workloads to follow the principle of
  least privilege.
-->
- 通常情况下，集群的用户账号可能会从企业数据库进行同步，
  创建新用户需要特殊权限，并且涉及到复杂的业务流程。
  服务账号创建有意做得更轻量，允许集群用户为了具体的任务按需创建服务账号。
  将 ServiceAccount 的创建与新用户注册的步骤分离开来，
  使工作负载更易于遵从权限最小化原则。
<!--
- Auditing considerations for humans and service accounts may differ; the separation
  makes that easier to achieve.
- A configuration bundle for a complex system may include definition of various service
  accounts for components of that system. Because service accounts can be created
  without many constraints and have namespaced names, such configuration is
  usually portable.
-->
- 对人员和服务账号审计所考虑的因素可能不同；这种分离更容易区分不同之处。
- 针对复杂系统的配置包可能包含系统组件相关的各种服务账号的定义。
  因为服务账号的创建约束不多并且有名字空间域的名称，所以这种配置通常是轻量的。

<!--
## Bound service account tokens
-->
## 绑定的服务账号令牌  {#bound-service-account-tokens}

<!--
ServiceAccount tokens can be bound to API objects that exist in the kube-apiserver.
This can be used to tie the validity of a token to the existence of another API object.
Supported object types are as follows:

* Pod (used for projected volume mounts, see below)
* Secret (can be used to allow revoking a token by deleting the Secret)
* Node (in v1.30, creating new node-bound tokens is alpha, using existing node-bound tokens is beta)
-->
ServiceAccount 令牌可以被绑定到 kube-apiserver 中存在的 API 对象。
这可用于将令牌的有效性与另一个 API 对象的存在与否关联起来。
支持的对象类型如下：

* Pod（用于投射卷的挂载，见下文）
* Secret（可用于允许通过删除 Secret 来撤销令牌）
* 节点（在 v1.30 中，创建新的节点绑定令牌是 Alpha 特性，使用现有的节点绑定特性是 Beta 特性）

<!--
When a token is bound to an object, the object's `metadata.name` and `metadata.uid` are
stored as extra 'private claims' in the issued JWT.

When a bound token is presented to the kube-apiserver, the service account authenticator
will extract and verify these claims.
If the referenced object no longer exists (or its `metadata.uid` does not match),
the request will not be authenticated.
-->
当将令牌绑定到某对象时，该对象的 `metadata.name` 和 `metadata.uid`
将作为额外的“私有声明”存储在所发布的 JWT 中。

当将被绑定的令牌提供给 kube-apiserver 时，服务帐户身份认证组件将提取并验证这些声明。
如果所引用的对象不再存在（或其 `metadata.uid` 不匹配），则请求将无法通过认证。

<!--
### Additional metadata in Pod bound tokens
-->
### Pod 绑定令牌中的附加元数据    {#additional-metadata-in-pod-bound-tokens}

{{< feature-state feature_gate_name="ServiceAccountTokenPodNodeInfo" >}}

<!--
When a service account token is bound to a Pod object, additional metadata is also
embedded into the token that indicates the value of the bound pod's `spec.nodeName` field,
and the uid of that Node, if available.

This node information is **not** verified by the kube-apiserver when the token is used for authentication.
It is included so integrators do not have to fetch Pod or Node API objects to check the associated Node name
and uid when inspecting a JWT.
-->
当服务帐户令牌被绑定到某 Pod 对象时，一些额外的元数据也会被嵌入到令牌中，
包括所绑定 Pod 的 `spec.nodeName` 字段的值以及该节点的 uid（如果可用）。

当使用令牌进行身份认证时，kube-apiserver **不会**检查此节点信息的合法性。
由于节点信息被包含在令牌内，所以集成商在检查 JWT 时不必获取 Pod 或 Node API 对象来检查所关联的 Node 名称和 uid。

<!--
### Verifying and inspecting private claims

The `TokenReview` API can be used to verify and extract private claims from a token:
-->
### 查验和检视私有声明   {#verifying-and-inspecting-private-claims}

`TokenReview` API 可用于校验并从令牌中提取私有声明：

<!--
1. First, assume you have a pod named `test-pod` and a service account named `my-sa`.
2. Create a token that is bound to this Pod:
-->
1. 首先，假设你有一个名为 `test-pod` 的 Pod 和一个名为 `my-sa` 的服务帐户。
2. 创建绑定到此 Pod 的令牌：

```shell
kubectl create token my-sa --bound-object-kind="Pod" --bound-object-name="test-pod"
```

<!--
3. Copy this token into a new file named `tokenreview.yaml`:
-->
3. 将此令牌复制到名为 `tokenreview.yaml` 的新文件中：

```yaml
apiVersion: authentication.k8s.io/v1
kind: TokenReview
spec:
  token: <来自第二步的令牌内容>
```

<!--
4. Submit this resource to the apiserver for review:
-->
4. 将此资源提交给 API 服务器进行审核：

<!--
# we use '-o yaml' so we can inspect the output
-->
```shell
kubectl create -o yaml -f tokenreview.yaml # 我们使用 '-o yaml' 以便检视命令输出
```

<!--
You should see an output like below:
-->
你应该看到如下所示的输出：

```yaml
apiVersion: authentication.k8s.io/v1
kind: TokenReview
metadata:
  creationTimestamp: null
spec:
  token: <token>
status:
  audiences:
  - https://kubernetes.default.svc.cluster.local
  authenticated: true
  user:
    extra:
      authentication.kubernetes.io/credential-id:
      - JTI=7ee52be0-9045-4653-aa5e-0da57b8dccdc
      authentication.kubernetes.io/node-name:
      - kind-control-plane
      authentication.kubernetes.io/node-uid:
      - 497e9d9a-47aa-4930-b0f6-9f2fb574c8c6
      authentication.kubernetes.io/pod-name:
      - test-pod
      authentication.kubernetes.io/pod-uid:
      - e87dbbd6-3d7e-45db-aafb-72b24627dff5
    groups:
    - system:serviceaccounts
    - system:serviceaccounts:default
    - system:authenticated
    uid: f8b4161b-2e2b-11e9-86b7-2afc33b31a7e
    username: system:serviceaccount:default:my-sa
```

{{< note >}}
<!--
Despite using `kubectl create -f` to create this resource, and defining it similar to
other resource types in Kubernetes, TokenReview is a special type and the kube-apiserver
does not actually persist the TokenReview object into etcd.
Hence `kubectl get tokenreview` is not a valid command.
-->
尽管你使用了 `kubectl create -f` 来创建此资源，并与 Kubernetes
中的其他资源类型类似的方式定义它，但 TokenReview 是一种特殊类别，
kube-apiserver 实际上并不将 TokenReview 对象持久保存到 etcd 中。
因此 `kubectl get tokenreview` 不是一个有效的命令。
{{< /note >}}

<!--
## Bound service account token volume mechanism {#bound-service-account-token-volume}
-->
## 绑定的服务账号令牌卷机制  {#bound-service-account-token-volume}

{{< feature-state feature_gate_name="BoundServiceAccountTokenVolume" >}}

<!--
By default, the Kubernetes control plane (specifically, the
[ServiceAccount admission controller](#serviceaccount-admission-controller))
adds a [projected volume](/docs/concepts/storage/projected-volumes/) to Pods,
and this volume includes a token for Kubernetes API access.

Here's an example of how that looks for a launched Pod:
-->
默认情况下，Kubernetes 控制平面（特别是 [ServiceAccount 准入控制器](#serviceaccount-admission-controller)）
添加一个[投射卷](/zh-cn/docs/concepts/storage/projected-volumes/)到 Pod，
此卷包括了访问 Kubernetes API 的令牌。

以下示例演示如何查找已启动的 Pod：

<!--
```yaml
...
  - name: kube-api-access-<random-suffix>
    projected:
      sources:
        - serviceAccountToken:
            path: token # must match the path the app expects
        - configMap:
            items:
              - key: ca.crt
                path: ca.crt
            name: kube-root-ca.crt
        - downwardAPI:
            items:
              - fieldRef:
                  apiVersion: v1
                  fieldPath: metadata.namespace
                path: namespace
```
-->
```yaml
...
  - name: kube-api-access-<随机后缀>
    projected:
      sources:
        - serviceAccountToken:
            path: token # 必须与应用所预期的路径匹配
        - configMap:
            items:
              - key: ca.crt
                path: ca.crt
            name: kube-root-ca.crt
        - downwardAPI:
            items:
              - fieldRef:
                  apiVersion: v1
                  fieldPath: metadata.namespace
                path: namespace
```

<!--
That manifest snippet defines a projected volume that consists of three sources. In this case,
each source also represents a single path within that volume. The three sources are:

1. A `serviceAccountToken` source, that contains a token that the kubelet acquires from kube-apiserver
   The kubelet fetches time-bound tokens using the TokenRequest API. A token served for a TokenRequest expires
   either when the pod is deleted or after a defined lifespan (by default, that is 1 hour).
   The token is bound to the specific Pod and has the kube-apiserver as its audience.
   This mechanism superseded an earlier mechanism that added a volume based on a Secret,
   where the Secret represented the ServiceAccount for the Pod, but did not expire.
1. A `configMap` source. The ConfigMap contains a bundle of certificate authority data. Pods can use these
   certificates to make sure that they are connecting to your cluster's kube-apiserver (and not to middlebox
   or an accidentally misconfigured peer).
1. A `downwardAPI` source that looks up the name of the namespace containing the Pod, and makes
   that name information available to application code running inside the Pod.
-->
该清单片段定义了由三个数据源组成的投射卷。在当前场景中，每个数据源也代表该卷内的一条独立路径。这三个数据源是：

1. `serviceAccountToken` 数据源，包含 kubelet 从 kube-apiserver 获取的令牌。
   kubelet 使用 TokenRequest API 获取有时间限制的令牌。为 TokenRequest 服务的这个令牌会在
   Pod 被删除或定义的生命周期（默认为 1 小时）结束之后过期。该令牌绑定到特定的 Pod，
   并将其 audience（受众）设置为与 `kube-apiserver` 的 audience 相匹配。
   这种机制取代了之前基于 Secret 添加卷的机制，之前 Secret 代表了针对 Pod 的 ServiceAccount 但不会过期。
1. `configMap` 数据源。ConfigMap 包含一组证书颁发机构数据。
   Pod 可以使用这些证书来确保自己连接到集群的 kube-apiserver（而不是连接到中间件或意外配置错误的对等点上）。
1. `downwardAPI` 数据源，用于查找包含 Pod 的名字空间的名称，
   并使该名称信息可用于在 Pod 内运行的应用程序代码。

<!--
Any container within the Pod that mounts this particular volume can access the above information.
-->
Pod 内挂载这个特定卷的所有容器都可以访问上述信息。

{{< note >}}
<!--
There is no specific mechanism to invalidate a token issued via TokenRequest. If you no longer
trust a bound service account token for a Pod, you can delete that Pod. Deleting a Pod expires
its bound service account tokens.
-->
没有特定的机制可以使通过 TokenRequest 签发的令牌无效。
如果你不再信任为某个 Pod 绑定的服务账号令牌，
你可以删除该 Pod。删除 Pod 将使其绑定的服务账号令牌过期。
{{< /note >}}

<!--
## Manual Secret management for ServiceAccounts

Versions of Kubernetes before v1.22 automatically created credentials for accessing
the Kubernetes API. This older mechanism was based on creating token Secrets that
could then be mounted into running Pods.
-->
## 手动管理 ServiceAccount 的 Secret   {#manual-secret-management-for-serviceaccounts}

v1.22 之前的 Kubernetes 版本会自动创建凭据访问 Kubernetes API。
这种更老的机制基于先创建令牌 Secret，然后将其挂载到正运行的 Pod 中。

<!--
In more recent versions, including Kubernetes v{{< skew currentVersion >}}, API credentials
are [obtained directly](#bound-service-account-token-volume) using the
[TokenRequest](/docs/reference/kubernetes-api/authentication-resources/token-request-v1/) API,
and are mounted into Pods using a projected volume.
The tokens obtained using this method have bounded lifetimes, and are automatically
invalidated when the Pod they are mounted into is deleted.
-->
在包括 Kubernetes v{{< skew currentVersion >}} 在内最近的几个版本中，使用
[TokenRequest](/zh-cn/docs/reference/kubernetes-api/authentication-resources/token-request-v1/)
API [直接获得](#bound-service-account-token-volume) API 凭据，
并使用投射卷挂载到 Pod 中。使用这种方法获得的令牌具有绑定的生命周期，
当挂载的 Pod 被删除时这些令牌将自动失效。

<!--
You can still [manually create](/docs/tasks/configure-pod-container/configure-service-account/#manually-create-an-api-token-for-a-serviceaccount) a Secret to hold a service account token; for example, if you need a token that never expires.

Once you manually create a Secret and link it to a ServiceAccount, the Kubernetes control plane automatically populates the token into that Secret.
-->
你仍然可以[手动创建](/zh-cn/docs/tasks/configure-pod-container/configure-service-account/#manually-create-an-api-token-for-a-serviceaccount)
Secret 来保存服务账号令牌；例如在你需要一个永不过期的令牌的时候。

一旦你手动创建一个 Secret 并将其关联到 ServiceAccount，
Kubernetes 控制平面就会自动将令牌填充到该 Secret 中。

{{< note >}}
<!--
Although the manual mechanism for creating a long-lived ServiceAccount token exists,
using [TokenRequest](/docs/reference/kubernetes-api/authentication-resources/token-request-v1/)
to obtain short-lived API access tokens is recommended instead.
-->
尽管存在手动创建长久 ServiceAccount 令牌的机制，但还是推荐使用
[TokenRequest](/zh-cn/docs/reference/kubernetes-api/authentication-resources/token-request-v1/)
获得短期的 API 访问令牌。
{{< /note >}}

<!--
## Auto-generated legacy ServiceAccount token clean up {#auto-generated-legacy-serviceaccount-token-clean-up}

Before version 1.24, Kubernetes automatically generated Secret-based tokens for
ServiceAccounts. To distinguish between automatically generated tokens and
manually created ones, Kubernetes checks for a reference from the
ServiceAccount's secrets field. If the Secret is referenced in the `secrets`
field, it is considered an auto-generated legacy token. Otherwise, it is
considered a manually created legacy token. For example:
-->
## 清理自动生成的传统 ServiceAccount 令牌   {#auto-generated-legacy-serviceaccount-token-clean-up}

在 1.24 版本之前，Kubernetes 自动为 ServiceAccount 生成基于 Secret 的令牌。
为了区分自动生成的令牌和手动创建的令牌，Kubernetes 会检查 ServiceAccount 的
Secret 字段是否有引用。如果该 Secret 被 `secrets` 字段引用，
它被视为自动生成的传统令牌。否则，它被视为手动创建的传统令牌。例如：

<!--
```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: build-robot
  namespace: default
secrets:
  - name: build-robot-secret # usually NOT present for a manually generated token
```
-->
```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: build-robot
  namespace: default
secrets:
  - name: build-robot-secret # 对于手动生成的令牌通常不会存在此字段
```

<!--
Beginning from version 1.29, legacy ServiceAccount tokens that were generated
automatically will be marked as invalid if they remain unused for a certain
period of time (set to default at one year). Tokens that continue to be unused
for this defined period (again, by default, one year) will subsequently be
purged by the control plane.
-->
从 1.29 版本开始，如果传统 ServiceAccount
令牌在一定时间段（默认设置为一年）内未被使用，则会被标记为无效。
在定义的时间段（同样默认为一年）持续未被使用的令牌将由控制平面自动清除。

<!--
If users use an invalidated auto-generated token, the token validator will

1. add an audit annotation for the key-value pair
  `authentication.k8s.io/legacy-token-invalidated: <secret name>/<namespace>`,
1. increment the `invalid_legacy_auto_token_uses_total` metric count,
1. update the Secret label `kubernetes.io/legacy-token-last-used` with the new
   date,
1. return an error indicating that the token has been invalidated.
-->
如果用户使用一个无效的自动生成的令牌，令牌验证器将执行以下操作：

1. 为键值对 `authentication.k8s.io/legacy-token-invalidated: <secret name>/<namespace>`
  添加审计注解，
1. `invalid_legacy_auto_token_uses_total` 指标计数加一，
1. 更新 Secret 标签 `kubernetes.io/legacy-token-last-used` 为新日期，
1. 返回一个提示令牌已经无效的报错。

<!--
When receiving this validation error, users can update the Secret to remove the
`kubernetes.io/legacy-token-invalid-since` label to temporarily allow use of
this token.

Here's an example of an auto-generated legacy token that has been marked with the
`kubernetes.io/legacy-token-last-used` and `kubernetes.io/legacy-token-invalid-since`
labels:
-->
当收到这个校验报错时，用户可以通过移除 `kubernetes.io/legacy-token-invalid-since`
标签更新 Secret，以临时允许使用此令牌。

以下是一个自动生成的传统令牌示例，它被标记了 `kubernetes.io/legacy-token-last-used`
和 `kubernetes.io/legacy-token-invalid-since` 标签：

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: build-robot-secret
  namespace: default
  labels:
    kubernetes.io/legacy-token-last-used: 2022-10-24
    kubernetes.io/legacy-token-invalid-since: 2023-10-25
  annotations:
    kubernetes.io/service-account.name: build-robot
type: kubernetes.io/service-account-token
```

<!--
## Control plane details

### ServiceAccount controller

A ServiceAccount controller manages the ServiceAccounts inside namespaces, and
ensures a ServiceAccount named "default" exists in every active namespace.
-->
## 控制平面细节   {#control-plane-details}

### ServiceAccount 控制器   {#serviceaccount-controller}

ServiceAccount 控制器管理名字空间内的 ServiceAccount，
并确保每个活跃的名字空间中都存在名为 `default` 的 ServiceAccount。

<!--
### Token controller

The service account token controller runs as part of `kube-controller-manager`.
This controller acts asynchronously. It:

- watches for ServiceAccount deletion and deletes all corresponding ServiceAccount
  token Secrets.
- watches for ServiceAccount token Secret addition, and ensures the referenced
  ServiceAccount exists, and adds a token to the Secret if needed.
- watches for Secret deletion and removes a reference from the corresponding
  ServiceAccount if needed.
-->
### 令牌控制器   {#token-controller}

服务账号令牌控制器作为 `kube-controller-manager` 的一部分运行，以异步的形式工作。
其职责包括：

- 监测 ServiceAccount 的删除并删除所有相应的服务账号令牌 Secret。
- 监测服务账号令牌 Secret 的添加，保证相应的 ServiceAccount 存在，
  如有需要，向 Secret 中添加令牌。
- 监测服务账号令牌 Secret 的删除，如有需要，从相应的 ServiceAccount 中移除引用。

<!--
You must pass a service account private key file to the token controller in
the `kube-controller-manager` using the `--service-account-private-key-file`
flag. The private key is used to sign generated service account tokens.
Similarly, you must pass the corresponding public key to the `kube-apiserver`
using the `--service-account-key-file` flag. The public key will be used to
verify the tokens during authentication.
-->
你必须通过 `--service-account-private-key-file` 标志为
`kube-controller-manager`的令牌控制器传入一个服务账号私钥文件。
该私钥用于为所生成的服务账号令牌签名。同样地，你需要通过
`--service-account-key-file` 标志将对应的公钥通知给
kube-apiserver。公钥用于在身份认证过程中校验令牌。

<!--
### ServiceAccount admission controller

The modification of pods is implemented via a plugin
called an [Admission Controller](/docs/reference/access-authn-authz/admission-controllers/).
It is part of the API server.
This admission controller acts synchronously to modify pods as they are created.
When this plugin is active (and it is by default on most distributions), then
it does the following when a Pod is created:
-->
### ServiceAccount 准入控制器   {#serviceaccount-admission-controller}

对 Pod 的改动通过一个被称为[准入控制器](/zh-cn/docs/reference/access-authn-authz/admission-controllers/)的插件来实现。
它是 API 服务器的一部分。当 Pod 被创建时，该准入控制器会同步地修改 Pod。
如果该插件处于激活状态（在大多数发行版中都是默认激活的），当 Pod 被创建时它会进行以下操作：

<!--
1. If the pod does not have a `.spec.serviceAccountName` set, the admission controller sets the name of the
   ServiceAccount for this incoming Pod to `default`.
1. The admission controller ensures that the ServiceAccount referenced by the incoming Pod exists. If there
   is no ServiceAccount with a matching name, the admission controller rejects the incoming Pod. That check
   applies even for the `default` ServiceAccount.
-->
1. 如果该 Pod 没有设置 `.spec.serviceAccountName`，
   准入控制器为新来的 Pod 将 ServiceAccount 的名称设为 `default`。
2. 准入控制器保证新来的 Pod 所引用的 ServiceAccount 确实存在。
   如果没有 ServiceAccount 具有匹配的名称，则准入控制器拒绝新来的 Pod。
   这个检查甚至适用于 `default` ServiceAccount。
<!--
1. Provided that neither the ServiceAccount's `automountServiceAccountToken` field nor the
   Pod's `automountServiceAccountToken` field is set to `false`:
   - the admission controller mutates the incoming Pod, adding an extra
     {{< glossary_tooltip text="volume" term_id="volume" >}} that contains
     a token for API access.
   - the admission controller adds a `volumeMount` to each container in the Pod,
     skipping any containers that already have a volume mount defined for the path
     `/var/run/secrets/kubernetes.io/serviceaccount`.
     For Linux containers, that volume is mounted at `/var/run/secrets/kubernetes.io/serviceaccount`;
     on Windows nodes, the mount is at the equivalent path.
1. If the spec of the incoming Pod doesn't already contain any `imagePullSecrets`, then the
   admission controller adds `imagePullSecrets`, copying them from the `ServiceAccount`.
-->
3. 如果服务账号的 `automountServiceAccountToken` 字段或 Pod 的
   `automountServiceAccountToken` 字段都未显式设置为 `false`：
   - 准入控制器变更新来的 Pod，添加一个包含 API
     访问令牌的额外{{< glossary_tooltip text="卷" term_id="volume" >}}。
   - 准入控制器将 `volumeMount` 添加到 Pod 中的每个容器，
     忽略已为 `/var/run/secrets/kubernetes.io/serviceaccount` 路径定义的卷挂载的所有容器。
     对于 Linux 容器，此卷挂载在 `/var/run/secrets/kubernetes.io/serviceaccount`；
     在 Windows 节点上，此卷挂载在等价的路径上。
4. 如果新来 Pod 的规约不包含任何 `imagePullSecrets`，则准入控制器添加 `imagePullSecrets`，
   并从 `ServiceAccount` 进行复制。

<!--
### Legacy ServiceAccount token tracking controller
-->
### 传统 ServiceAccount 令牌追踪控制器   {#legacy-serviceaccount-token-tracking-controller}

{{< feature-state feature_gate_name="LegacyServiceAccountTokenTracking" >}}

<!--
This controller generates a ConfigMap called
`kube-system/kube-apiserver-legacy-service-account-token-tracking` in the
`kube-system` namespace. The ConfigMap records the timestamp when legacy service
account tokens began to be monitored by the system.
-->
此控制器在 `kube-system` 命名空间中生成名为
`kube-apiserver-legacy-service-account-token-tracking` 的 ConfigMap。
这个 ConfigMap 记录了系统开始监视传统服务账号令牌的时间戳。

<!--
### Legacy ServiceAccount token cleaner
-->
### 传统 ServiceAccount 令牌清理器   {#legacy-serviceaccount-token-cleaner}

{{< feature-state feature_gate_name="LegacyServiceAccountTokenCleanUp" >}}

<!--
The legacy ServiceAccount token cleaner runs as part of the
`kube-controller-manager` and checks every 24 hours to see if any auto-generated
legacy ServiceAccount token has not been used in a *specified amount of time*.
If so, the cleaner marks those tokens as invalid.

The cleaner works by first checking the ConfigMap created by the control plane
(provided that `LegacyServiceAccountTokenTracking` is enabled). If the current
time is a *specified amount of time* after the date in the ConfigMap, the
cleaner then loops through the list of Secrets in the cluster and evaluates each
Secret that has the type `kubernetes.io/service-account-token`.
-->
传统 ServiceAccount 令牌清理器作为 `kube-controller-manager` 的一部分运行，
每 24 小时检查一次，查看是否有任何自动生成的传统 ServiceAccount
令牌在**特定时间段**内未被使用。如果有的话，清理器会将这些令牌标记为无效。

清理器的工作方式是首先检查控制平面创建的 ConfigMap（前提是启用了
`LegacyServiceAccountTokenTracking`）。如果当前时间是 ConfigMap
所包含日期之后的**特定时间段**，清理器会遍历集群中的 Secret 列表，
并评估每个类型为 `kubernetes.io/service-account-token` 的 Secret。

<!--
If a Secret meets all of the following conditions, the cleaner marks it as
invalid:

- The Secret is auto-generated, meaning that it is bi-directionally referenced
  by a ServiceAccount.
- The Secret is not currently mounted by any pods.
- The Secret has not been used in a *specified amount of time* since it was
  created or since it was last used.
-->
如果一个 Secret 满足以下所有条件，清理器会将其标记为无效：

- Secret 是自动生成的，意味着它被 ServiceAccount 双向引用。
- Secret 当前没有被任何 Pod 挂载。
- Secret 自从创建或上次使用以来的**特定时间段**未被使用过。

<!--
The cleaner marks a Secret invalid by adding a label called
`kubernetes.io/legacy-token-invalid-since` to the Secret, with the current date
as the value. If an invalid Secret is not used in a *specified amount of time*,
the cleaner will delete it.
-->
清理器通过向 Secret 添加名为 `kubernetes.io/legacy-token-invalid-since` 的标签，
并将此值设置为当前日期，来标记 Secret 为无效。
如果一个无效的 Secret 在**特定时间段**内未被使用，清理器将会删除它。

{{< note >}}
<!--
All the *specified amount of time* above defaults to one year. The cluster
administrator can configure this value through the
`--legacy-service-account-token-clean-up-period` command line argument for the
`kube-controller-manager` component.
-->
上述所有的**特定时间段**都默认为一年。集群管理员可以通过 `kube-controller-manager`
组件的 `--legacy-service-account-token-clean-up-period` 命令行参数来配置此值。
{{< /note >}}

### TokenRequest API

{{< feature-state for_k8s_version="v1.22" state="stable" >}}

<!--
You use the [TokenRequest](/docs/reference/kubernetes-api/authentication-resources/token-request-v1/)
subresource of a ServiceAccount to obtain a time-bound token for that ServiceAccount.
You don't need to call this to obtain an API token for use within a container, since
the kubelet sets this up for you using a _projected volume_.

If you want to use the TokenRequest API from `kubectl`, see
[Manually create an API token for a ServiceAccount](/docs/tasks/configure-pod-container/configure-service-account/#manually-create-an-api-token-for-a-serviceaccount).
-->
你使用 ServiceAccount 的
[TokenRequest](/zh-cn/docs/reference/kubernetes-api/authentication-resources/token-request-v1/)
子资源为该 ServiceAccount 获取有时间限制的令牌。
你不需要调用它来获取在容器中使用的 API 令牌，
因为 kubelet 使用**投射卷**对此进行了设置。

如果你想要从 `kubectl` 使用 TokenRequest API，
请参阅[为 ServiceAccount 手动创建 API 令牌](/zh-cn/docs/tasks/configure-pod-container/configure-service-account/#manually-create-an-api-token-for-a-serviceaccount)。

<!--
The Kubernetes control plane (specifically, the ServiceAccount admission controller)
adds a projected volume to Pods, and the kubelet ensures that this volume contains a token
that lets containers authenticate as the right ServiceAccount.

(This mechanism superseded an earlier mechanism that added a volume based on a Secret,
where the Secret represented the ServiceAccount for the Pod but did not expire.)

Here's an example of how that looks for a launched Pod:
-->
Kubernetes 控制平面（特别是 ServiceAccount 准入控制器）向 Pod 添加了一个投射卷，
kubelet 确保该卷包含允许容器作为正确 ServiceAccount 进行身份认证的令牌。

（这种机制取代了之前基于 Secret 添加卷的机制，之前 Secret 代表了 Pod 所用的 ServiceAccount 但不会过期。）

以下示例演示如何查找已启动的 Pod：

<!--
# decimal equivalent of octal 0644
-->
```yaml
...
  - name: kube-api-access-<random-suffix>
    projected:
      defaultMode: 420 # 这个十进制数等同于八进制 0644
      sources:
        - serviceAccountToken:
            expirationSeconds: 3607
            path: token
        - configMap:
            items:
              - key: ca.crt
                path: ca.crt
            name: kube-root-ca.crt
        - downwardAPI:
            items:
              - fieldRef:
                  apiVersion: v1
                  fieldPath: metadata.namespace
                path: namespace
```

<!--
That manifest snippet defines a projected volume that combines information from three sources:

1. A `serviceAccountToken` source, that contains a token that the kubelet acquires from kube-apiserver.
   The kubelet fetches time-bound tokens using the TokenRequest API. A token served for a TokenRequest expires
   either when the pod is deleted or after a defined lifespan (by default, that is 1 hour).
   The kubelet also refreshes that token before the token expires.
   The token is bound to the specific Pod and has the kube-apiserver as its audience.
1. A `configMap` source. The ConfigMap contains a bundle of certificate authority data. Pods can use these
   certificates to make sure that they are connecting to your cluster's kube-apiserver (and not to middlebox
   or an accidentally misconfigured peer).
1. A `downwardAPI` source. This `downwardAPI` volume makes the name of the namespace containing the Pod available
   to application code running inside the Pod.
-->
该清单片段定义了由三个数据源信息组成的投射卷。

1. `serviceAccountToken` 数据源，包含 kubelet 从 kube-apiserver 获取的令牌。
   kubelet 使用 TokenRequest API 获取有时间限制的令牌。为 TokenRequest 服务的这个令牌会在
   Pod 被删除或定义的生命周期（默认为 1 小时）结束之后过期。在令牌过期之前，kubelet 还会刷新该令牌。
   该令牌绑定到特定的 Pod，并将其 audience（受众）设置为与 `kube-apiserver` 的 audience 相匹配。
1. `configMap` 数据源。ConfigMap 包含一组证书颁发机构数据。
   Pod 可以使用这些证书来确保自己连接到集群的 kube-apiserver（而不是连接到中间件或意外配置错误的对等点上）。
1. `downwardAPI` 数据源。这个 `downwardAPI` 卷获得包含 Pod 的名字空间的名称，
   并使该名称信息可用于在 Pod 内运行的应用程序代码。

<!--
Any container within the Pod that mounts this volume can access the above information.

## Create additional API tokens {#create-token}
-->
挂载此卷的 Pod 内的所有容器均可以访问上述信息。

## 创建额外的 API 令牌   {#create-token}

{{< caution >}}
<!--
Only create long-lived API tokens if the [token request](#tokenrequest-api) mechanism
is not suitable. The token request mechanism provides time-limited tokens; because these
expire, they represent a lower risk to information security.
-->
只有[令牌请求](#tokenrequest-api)机制不合适，才需要创建长久的 API 令牌。
令牌请求机制提供有时间限制的令牌；因为随着这些令牌过期，它们对信息安全方面的风险也会降低。
{{< /caution >}}

<!--
To create a non-expiring, persisted API token for a ServiceAccount, create a
Secret of type `kubernetes.io/service-account-token` with an annotation
referencing the ServiceAccount. The control plane then generates a long-lived token and
updates that Secret with that generated token data.

Here is a sample manifest for such a Secret:
-->
要为 ServiceAccount 创建一个不过期、持久化的 API 令牌，
请创建一个类型为 `kubernetes.io/service-account-token` 的 Secret，
附带引用 ServiceAccount 的注解。控制平面随后生成一个长久的令牌，
并使用生成的令牌数据更新该 Secret。

以下是此类 Secret 的示例清单：

{{% code_sample file="secret/serviceaccount/mysecretname.yaml" %}}

<!--
To create a Secret based on this example, run:
-->
若要基于此示例创建 Secret，运行以下命令：

```shell
kubectl -n examplens create -f https://k8s.io/examples/secret/serviceaccount/mysecretname.yaml
```

<!--
To see the details for that Secret, run:
-->
若要查看该 Secret 的详细信息，运行以下命令：

```shell
kubectl -n examplens describe secret mysecretname
```

<!--
The output is similar to:
-->
输出类似于：

```
Name:           mysecretname
Namespace:      examplens
Labels:         <none>
Annotations:    kubernetes.io/service-account.name=myserviceaccount
                kubernetes.io/service-account.uid=8a85c4c4-8483-11e9-bc42-526af7764f64

Type:   kubernetes.io/service-account-token

Data
====
ca.crt:         1362 bytes
namespace:      9 bytes
token:          ...
```

<!--
If you launch a new Pod into the `examplens` namespace, it can use the `myserviceaccount`
service-account-token Secret that you just created.
-->
如果你在 `examplens` 名字空间中启动一个新的 Pod，它可以使用你刚刚创建的
`myserviceaccount` service-account-token Secret。

{{< caution >}}
<!--
Do not reference manually created Secrets in the `secrets` field of a
ServiceAccount. Or the manually created Secrets will be cleaned if it is not used for a long
time. Please refer to [auto-generated legacy ServiceAccount token clean up](#auto-generated-legacy-serviceaccount-token-clean-up).
-->
不要在 ServiceAccount 的 `secrets` 字段中引用手动创建的 Secret。
否则，如果这些手动创建的 Secret 长时间未被使用将会被清理掉。
请参考[清理自动生成的传统 ServiceAccount 令牌](#auto-generated-legacy-serviceaccount-token-clean-up)。
{{< /caution >}}

<!--
## Delete/invalidate a ServiceAccount token {#delete-token}

If you know the name of the Secret that contains the token you want to remove:
-->
## 删除/废止 ServiceAccount 令牌   {#delete-token}

如果你知道 Secret 的名称且该 Secret 包含要移除的令牌：

```shell
kubectl delete secret name-of-secret
```

<!--
Otherwise, first find the Secret for the ServiceAccount.
-->
否则，先找到 ServiceAccount 所用的 Secret。

<!--
# This assumes that you already have a namespace named 'examplens'
-->
```shell
# 此处假设你已有一个名为 'examplens' 的名字空间
kubectl -n examplens get serviceaccount/example-automated-thing -o yaml
```

<!--
The output is similar to:
-->
输出类似于：

```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  annotations:
    kubectl.kubernetes.io/last-applied-configuration: |
      {"apiVersion":"v1","kind":"ServiceAccount","metadata":{"annotations":{},"name":"example-automated-thing","namespace":"examplens"}}
  creationTimestamp: "2019-07-21T07:07:07Z"
  name: example-automated-thing
  namespace: examplens
  resourceVersion: "777"
  selfLink: /api/v1/namespaces/examplens/serviceaccounts/example-automated-thing
  uid: f23fd170-66f2-4697-b049-e1e266b7f835
secrets:
  - name: example-automated-thing-token-zyxwv
```

<!--
Then, delete the Secret you now know the name of:
-->
随后删除你现在知道名称的 Secret：

```shell
kubectl -n examplens delete secret/example-automated-thing-token-zyxwv
```

<!--
## Clean up

If you created a namespace `examplens` to experiment with, you can remove it:
-->
## 清理    {#clean-up}

如果创建了一个 `examplens` 名字空间进行试验，你可以移除它：

```shell
kubectl delete namespace examplens
```

## {{% heading "whatsnext" %}}

<!--
- Read more details about [projected volumes](/docs/concepts/storage/projected-volumes/).
-->
- 查阅有关[投射卷](/zh-cn/docs/concepts/storage/projected-volumes/)的更多细节。
