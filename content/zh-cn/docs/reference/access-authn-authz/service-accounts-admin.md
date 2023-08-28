---
title: 管理服务账号
content_type: concept
weight: 50
---
<!--
reviewers:
  - bprashanth
  - davidopp
  - lavalamp
  - liggitt
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
## Bound service account token volume mechanism {#bound-service-account-token-volume}
-->
## 绑定的服务账号令牌卷机制  {#bound-service-account-token-volume}

{{< feature-state for_k8s_version="v1.22" state="stable" >}}

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
## Control plane details

A ServiceAccount controller manages the ServiceAccounts inside namespaces, and
ensures a ServiceAccount named "default" exists in every active namespace.
-->
## 控制平面细节   {#control-plane-details}

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

{{< codenew file="secret/serviceaccount/mysecretname.yaml" >}}

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
The control plane spots that the ServiceAccount is missing its Secret,
and creates a replacement:
-->
控制平面发现 ServiceAccount 缺少其 Secret，并创建一个替代项：

```shell
kubectl -n examplens get serviceaccount/example-automated-thing -o yaml
```

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
  resourceVersion: "1026"
  selfLink: /api/v1/namespaces/examplens/serviceaccounts/example-automated-thing
  uid: f23fd170-66f2-4697-b049-e1e266b7f835
secrets:
  - name: example-automated-thing-token-4rdrh
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
