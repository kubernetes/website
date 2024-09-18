---
title: 为 Pod 配置服务账号
content_type: task
weight: 120
---
<!--
reviewers:
- enj
- liggitt
- thockin
title: Configure Service Accounts for Pods
content_type: task
weight: 120
-->

<!-- overview -->

<!--
Kubernetes offers two distinct ways for clients that run within your
cluster, or that otherwise have a relationship to your cluster's
{{< glossary_tooltip text="control plane" term_id="control-plane" >}}
to authenticate to the
{{< glossary_tooltip text="API server" term_id="kube-apiserver" >}}.
-->
Kubernetes 提供两种完全不同的方式来为客户端提供支持，这些客户端可能运行在你的集群中，
也可能与你的集群的{{< glossary_tooltip text="控制面" term_id="control-plane" >}}相关，
需要向 {{< glossary_tooltip text="API 服务器" term_id="kube-apiserver" >}}完成身份认证。

<!--
A _service account_ provides an identity for processes that run in a Pod,
and maps to a ServiceAccount object. When you authenticate to the API
server, you identify yourself as a particular _user_. Kubernetes recognises
the concept of a user, however, Kubernetes itself does **not** have a User
API.
-->
**服务账号（Service Account）** 为 Pod 中运行的进程提供身份标识，
并映射到 ServiceAccount 对象。当你向 API 服务器执行身份认证时，
你会将自己标识为某个**用户（User）**。Kubernetes 能够识别用户的概念，
但是 Kubernetes 自身**并不**提供 User API。

<!--
This task guide is about ServiceAccounts, which do exist in the Kubernetes
API. The guide shows you some ways to configure ServiceAccounts for Pods.
-->
本服务是关于 ServiceAccount 的，而 ServiceAccount 则确实存在于 Kubernetes 的 API 中。
本指南为你展示为 Pod 配置 ServiceAccount 的一些方法。

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

<!-- steps -->

<!--
## Use the default service account to access the API server

When Pods contact the API server, Pods authenticate as a particular
ServiceAccount (for example, `default`). There is always at least one
ServiceAccount in each {{< glossary_tooltip text="namespace" term_id="namespace" >}}.

Every Kubernetes namespace contains at least one ServiceAccount: the default
ServiceAccount for that namespace, named `default`.
If you do not specify a ServiceAccount when you create a Pod, Kubernetes
automatically assigns the ServiceAccount named `default` in that namespace.

You can fetch the details for a Pod you have created. For example:
-->
## 使用默认的服务账号访问 API 服务器   {#use-the-default-service-account-to-access-the-api-server}

当 Pod 与 API 服务器联系时，Pod 会被认证为某个特定的 ServiceAccount（例如：`default`）。
在每个{{< glossary_tooltip text="名字空间" term_id="namespace" >}}中，至少存在一个
ServiceAccount。

每个 Kubernetes 名字空间至少包含一个 ServiceAccount：也就是该名字空间的默认服务账号，
名为 `default`。如果你在创建 Pod 时没有指定 ServiceAccount，Kubernetes 会自动将该名字空间中名为
`default` 的 ServiceAccount 分配给该 Pod。

你可以检视你刚刚创建的 Pod 的细节。例如：

```shell
kubectl get pods/<podname> -o yaml
```

<!--
In the output, you see a field `spec.serviceAccountName`.
Kubernetes automatically
sets that value if you don't specify it when you create a Pod.

An application running inside a Pod can access the Kubernetes API using
automatically mounted service account credentials.
See [accessing the Cluster](/docs/tasks/access-application-cluster/access-cluster/) to learn more.
-->
在输出中，你可以看到字段 `spec.serviceAccountName`。当你在创建 Pod 时未设置该字段时，
Kubernetes 自动为 Pod 设置这一属性的取值。

Pod 中运行的应用可以使用这一自动挂载的服务账号凭据来访问 Kubernetes API。
参阅[访问集群](/zh-cn/docs/tasks/access-application-cluster/access-cluster/)以进一步了解。

<!--
When a Pod authenticates as a ServiceAccount, its level of access depends on the
[authorization plugin and policy](/docs/reference/access-authn-authz/authorization/#authorization-modules)
in use.
-->
当 Pod 被身份认证为某个 ServiceAccount 时，
其访问能力取决于所使用的[鉴权插件和策略](/zh-cn/docs/reference/access-authn-authz/authorization/#authorization-modules)。

<!--
The API credentials are automatically revoked when the Pod is deleted, even if
finalizers are in place. In particular, the API credentials are revoked 60 seconds
beyond the `.metadata.deletionTimestamp` set on the Pod (the deletion timestamp
is typically the time that the **delete** request was accepted plus the Pod's
termination grace period).
-->
当 Pod 被删除时，即使设置了终结器，API 凭据也会自动失效。
需要额外注意的是，API 凭据会在 Pod 上设置的 `.metadata.deletionTimestamp` 之后的 60 秒内失效
（删除时间戳通常是 **delete** 请求被接受的时间加上 Pod 的终止宽限期）。

<!--
### Opt out of API credential automounting

If you don't want the {{< glossary_tooltip text="kubelet" term_id="kubelet" >}}
to automatically mount a ServiceAccount's API credentials, you can opt out of
the default behavior.
You can opt out of automounting API credentials on `/var/run/secrets/kubernetes.io/serviceaccount/token`
for a service account by setting `automountServiceAccountToken: false` on the ServiceAccount:

For example:
-->
### 放弃 API 凭据的自动挂载   {#opt-out-of-api-credential-automounting}

如果你不希望 {{< glossary_tooltip text="kubelet" term_id="kubelet" >}} 自动挂载某
ServiceAccount 的 API 访问凭据，你可以选择不采用这一默认行为。
通过在 ServiceAccount 对象上设置 `automountServiceAccountToken: false`，可以放弃在
`/var/run/secrets/kubernetes.io/serviceaccount/token` 处自动挂载该服务账号的 API 凭据。

例如：

```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: build-robot
automountServiceAccountToken: false
...
```

<!--
You can also opt out of automounting API credentials for a particular Pod:
-->
你也可以选择不给特定 Pod 自动挂载 API 凭据：

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: my-pod
spec:
  serviceAccountName: build-robot
  automountServiceAccountToken: false
  ...
```

<!--
If both the ServiceAccount and the Pod's `.spec` specify a value for
`automountServiceAccountToken`, the Pod spec takes precedence.
-->
如果 ServiceAccount 和 Pod 的 `.spec` 都设置了 `automountServiceAccountToken` 值，
则 Pod 上 spec 的设置优先于服务账号的设置。

<!--
## Use more than one ServiceAccount {#use-multiple-service-accounts}

Every namespace has at least one ServiceAccount: the default ServiceAccount
resource, called `default`. You can list all ServiceAccount resources in your
[current namespace](/docs/concepts/overview/working-with-objects/namespaces/#setting-the-namespace-preference)
with:
-->
## 使用多个服务账号   {#use-multiple-service-accounts}

每个名字空间都至少有一个 ServiceAccount：名为 `default` 的默认 ServiceAccount 资源。
你可以用下面的命令列举你[当前名字空间](/zh-cn/docs/concepts/overview/working-with-objects/namespaces/#setting-the-namespace-preference)
中的所有 ServiceAccount 资源：

```shell
kubectl get serviceaccounts
```

<!--
The output is similar to this:
-->
输出类似于：

```
NAME      SECRETS    AGE
default   1          1d
```

<!--
You can create additional ServiceAccount objects like this:
-->
你可以像这样来创建额外的 ServiceAccount 对象：

```shell
kubectl apply -f - <<EOF
apiVersion: v1
kind: ServiceAccount
metadata:
  name: build-robot
EOF
```

<!--
The name of a ServiceAccount object must be a valid
[DNS subdomain name](/docs/concepts/overview/working-with-objects/names#dns-subdomain-names).
-->
ServiceAccount 对象的名字必须是一个有效的
[DNS 子域名](/zh-cn/docs/concepts/overview/working-with-objects/names#dns-subdomain-names)。

<!--
If you get a complete dump of the service account object, like this:
-->
如果你查询服务账号对象的完整信息，如下所示：

```shell
kubectl get serviceaccounts/build-robot -o yaml
```

<!--
The output is similar to this:
-->
输出类似于：

```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  creationTimestamp: 2019-06-16T00:12:34Z
  name: build-robot
  namespace: default
  resourceVersion: "272500"
  uid: 721ab723-13bc-11e5-aec2-42010af0021e
```

<!--
You can use authorization plugins to
[set permissions on service accounts](/docs/reference/access-authn-authz/rbac/#service-account-permissions).

To use a non-default service account, set the `spec.serviceAccountName`
field of a Pod to the name of the ServiceAccount you wish to use.
-->
你可以使用鉴权插件来[设置服务账号的访问许可](/zh-cn/docs/reference/access-authn-authz/rbac/#service-account-permissions)。

要使用非默认的服务账号，将 Pod 的 `spec.serviceAccountName` 字段设置为你想用的服务账号名称。

<!--
You can only set the `serviceAccountName` field when creating a Pod, or in a
template for a new Pod. You cannot update the `.spec.serviceAccountName` field
of a Pod that already exists.
-->
只能在创建 Pod 时或者为新 Pod 指定模板时，你才可以设置 `serviceAccountName`。
你不能更新已经存在的 Pod 的 `.spec.serviceAccountName` 字段。

{{< note >}}
<!--
The `.spec.serviceAccount` field is a deprecated alias for `.spec.serviceAccountName`.
If you want to remove the fields from a workload resource, set both fields to empty explicitly
on the [pod template](/docs/concepts/workloads/pods#pod-templates).
-->
`.spec.serviceAccount` 字段是 `.spec.serviceAccountName` 的已弃用别名。
如果要从工作负载资源中删除这些字段，请在
[Pod 模板](/zh-cn/docs/concepts/workloads/pods#pod-templates)上将这两个字段显式设置为空。
{{< /note >}}

<!--
### Cleanup {#cleanup-use-multiple-service-accounts}

If you tried creating `build-robot` ServiceAccount from the example above,
you can clean it up by running:
-->
### 清理  {#cleanup-use-multiple-service-accounts}

如果你尝试了创建前文示例中所给的 `build-robot` ServiceAccount，
你可以通过运行下面的命令来完成清理操作：

```shell
kubectl delete serviceaccount/build-robot
```

<!--
## Manually create an API token for a ServiceAccount

Suppose you have an existing service account named "build-robot" as mentioned earlier.

You can get a time-limited API token for that ServiceAccount using `kubectl`:
-->
## 手动为 ServiceAccount 创建 API 令牌 {#manually-create-an-api-token-for-a-serviceaccount}

假设你已经有了一个前文所提到的名为 "build-robot" 的服务账号。
你可以使用 `kubectl` 为该 ServiceAccount 获得一个有时限的 API 令牌：

```shell
kubectl create token build-robot
```

<!--
The output from that command is a token that you can use to authenticate as that
ServiceAccount. You can request a specific token duration using the `--duration`
command line argument to `kubectl create token` (the actual duration of the issued
token might be shorter, or could even be longer).
-->
这一命令的输出是一个令牌，你可以使用该令牌来将身份认证为对应的 ServiceAccount。
你可以使用 `kubectl create token` 命令的 `--duration` 参数来请求特定的令牌有效期
（实际签发的令牌的有效期可能会稍短一些，也可能会稍长一些）。

{{< feature-state feature_gate_name="ServiceAccountTokenNodeBinding" >}}

<!--
When the `ServiceAccountTokenNodeBinding` and `ServiceAccountTokenNodeBindingValidation`
features are enabled, and using `kubectl` v1.31 or later, it is possible to create a service 
account token that is directly bound to a Node:
-->
当启用了 `ServiceAccountTokenNodeBinding` 和 `ServiceAccountTokenNodeBindingValidation`
特性，并使用 v1.31 或更高版本的 `kubectl` 时，
可以创建一个直接绑定到 `Node` 的服务账号令牌：

```shell
kubectl create token build-robot --bound-object-kind Node --bound-object-name node-001 --bound-object-uid 123...456
```

<!--
The token will be valid until it expires or either the associated Node or service account are deleted.
-->
此令牌将有效直至其过期或关联的 Node 或服务账户被删除。

{{< note >}}
<!--
Versions of Kubernetes before v1.22 automatically created long term credentials for
accessing the Kubernetes API. This older mechanism was based on creating token Secrets
that could then be mounted into running Pods. In more recent versions, including
Kubernetes v{{< skew currentVersion >}}, API credentials are obtained directly by using the
[TokenRequest](/docs/reference/kubernetes-api/authentication-resources/token-request-v1/) API,
and are mounted into Pods using a
[projected volume](/docs/reference/access-authn-authz/service-accounts-admin/#bound-service-account-token-volume).
The tokens obtained using this method have bounded lifetimes, and are automatically
invalidated when the Pod they are mounted into is deleted.
-->
Kubernetes 在 v1.22 版本之前自动创建用来访问 Kubernetes API 的长期凭据。
这一较老的机制是基于创建令牌 Secret 对象来实现的，Secret 对象可被挂载到运行中的 Pod 内。
在最近的版本中，包括 Kubernetes v{{< skew currentVersion >}}，API 凭据可以直接使用
[TokenRequest](/zh-cn/docs/reference/kubernetes-api/authentication-resources/token-request-v1/) API
来获得，并使用一个[投射卷](/zh-cn/docs/reference/access-authn-authz/service-accounts-admin/#bound-service-account-token-volume)挂载到
Pod 中。使用此方法获得的令牌具有受限的生命期长度，并且能够在挂载它们的 Pod
被删除时自动被废弃。

<!--
You can still manually create a service account token Secret; for example,
if you need a token that never expires. However, using the
[TokenRequest](/docs/reference/kubernetes-api/authentication-resources/token-request-v1/)
subresource to obtain a token to access the API is recommended instead.
-->
你仍然可以通过手动方式来创建服务账号令牌 Secret 对象，例如你需要一个永远不过期的令牌时。
不过，使用 [TokenRequest](/zh-cn/docs/reference/kubernetes-api/authentication-resources/token-request-v1/)
子资源来获得访问 API 的令牌的做法仍然是推荐的方式。
{{< /note >}}

<!--
### Manually create a long-lived API token for a ServiceAccount

If you want to obtain an API token for a ServiceAccount, you create a new Secret
with a special annotation, `kubernetes.io/service-account.name`.
-->
### 手动为 ServiceAccount 创建长期有效的 API 令牌 {#manually-create-a-long-lived-api-token-for-a-serviceaccount}

如果你需要为 ServiceAccount 获得一个 API 令牌，你可以创建一个新的、带有特殊注解
`kubernetes.io/service-account.name` 的 Secret 对象。

```shell
kubectl apply -f - <<EOF
apiVersion: v1
kind: Secret
metadata:
  name: build-robot-secret
  annotations:
    kubernetes.io/service-account.name: build-robot
type: kubernetes.io/service-account-token
EOF
```

<!--
If you view the Secret using:
-->
如果你通过下面的命令来查看 Secret：

```shell
kubectl get secret/build-robot-secret -o yaml
```

<!--
you can see that the Secret now contains an API token for the "build-robot" ServiceAccount.

Because of the annotation you set, the control plane automatically generates a token for that
ServiceAccounts, and stores them into the associated Secret. The control plane also cleans up
tokens for deleted ServiceAccounts.
-->
你可以看到 Secret 中现在包含针对 "build-robot" ServiceAccount 的 API 令牌。

鉴于你所设置的注解，控制面会自动为该 ServiceAccount 生成一个令牌，并将其保存到相关的 Secret
中。控制面也会为已删除的 ServiceAccount 执行令牌清理操作。

```shell
kubectl describe secrets/build-robot-secret
```

<!--
The output is similar to this:
-->
输出类似于这样：

```
Name:           build-robot-secret
Namespace:      default
Labels:         <none>
Annotations:    kubernetes.io/service-account.name: build-robot
                kubernetes.io/service-account.uid: da68f9c6-9d26-11e7-b84e-002dc52800da

Type:   kubernetes.io/service-account-token

Data
====
ca.crt:         1338 bytes
namespace:      7 bytes
token:          ...
```

{{< note >}}
<!--
The content of `token` is omitted here.

Take care not to display the contents of a `kubernetes.io/service-account-token`
Secret somewhere that your terminal / computer screen could be seen by an onlooker.
-->
这里将 `token` 的内容省略了。

注意在你的终端或者计算机屏幕可能被旁观者看到的场合，不要显示
`kubernetes.io/service-account-token` 的内容。
{{< /note >}}

<!--
When you delete a ServiceAccount that has an associated Secret, the Kubernetes
control plane automatically cleans up the long-lived token from that Secret.
-->
当你删除一个与某 Secret 相关联的 ServiceAccount 时，Kubernetes 的控制面会自动清理该
Secret 中长期有效的令牌。

{{< note >}}
<!--
If you view the ServiceAccount using:

` kubectl get serviceaccount build-robot -o yaml`

You can't see the `build-robot-secret` Secret in the ServiceAccount API objects
[`.secrets`](/docs/reference/kubernetes-api/authentication-resources/service-account-v1/) field
because that field is only populated with auto-generated Secrets.
-->
如果你使用以下命令查看 ServiceAccount:

` kubectl get serviceaccount build-robot -o yaml`

在 ServiceAccount API 对象中看不到 `build-robot-secret` Secret，
[`.secrets`](/zh-cn/docs/reference/kubernetes-api/authentication-resources/service-account-v1/) 字段，
因为该字段只会填充自动生成的 Secret。
{{< /note >}}
<!--
## Add ImagePullSecrets to a service account

First, [create an imagePullSecret](/docs/concepts/containers/images/#specifying-imagepullsecrets-on-a-pod).
Next, verify it has been created. For example:
-->
## 为服务账号添加 ImagePullSecrets    {#add-imagepullsecrets-to-a-service-account}

首先，[生成一个 imagePullSecret](/zh-cn/docs/concepts/containers/images/#specifying-imagepullsecrets-on-a-pod)；
接下来，验证该 Secret 已被创建。例如：

<!--
- Create an imagePullSecret, as described in
  [Specifying ImagePullSecrets on a Pod](/docs/concepts/containers/images/#specifying-imagepullsecrets-on-a-pod).
-->
- 按[为 Pod 设置 imagePullSecret](/zh-cn/docs/concepts/containers/images/#specifying-imagepullsecrets-on-a-pod)
  所描述的，生成一个镜像拉取 Secret：

  ```shell
  kubectl create secret docker-registry myregistrykey --docker-server=<registry name> \
          --docker-username=DUMMY_USERNAME --docker-password=DUMMY_DOCKER_PASSWORD \
          --docker-email=DUMMY_DOCKER_EMAIL
  ```

<!--
- Verify it has been created.
-->
- 检查该 Secret 已经被创建。

  ```shell
  kubectl get secrets myregistrykey
  ```

  <!--
  The output is similar to this:
  -->
  输出类似于这样：

  ```
  NAME             TYPE                              DATA    AGE
  myregistrykey    kubernetes.io/.dockerconfigjson   1       1d
  ```

<!--
### Add image pull secret to service account

Next, modify the default service account for the namespace to use this Secret as an imagePullSecret.
-->
### 将镜像拉取 Secret 添加到服务账号   {#add-image-pull-secret-to-service-account}

接下来更改名字空间的默认服务账号，将该 Secret 用作 imagePullSecret。

```shell
kubectl patch serviceaccount default -p '{"imagePullSecrets": [{"name": "myregistrykey"}]}'
```

<!--
You can achieve the same outcome by editing the object manually:
-->
你也可以通过手动编辑该对象来实现同样的效果：

```shell
kubectl edit serviceaccount/default
```

<!--
The output of the `sa.yaml` file is similar to this:
-->
`sa.yaml` 文件的输出类似于：

<!--
Your selected text editor will open with a configuration looking something like this:
-->
你所选择的文本编辑器会被打开，展示如下所示的配置：

```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  creationTimestamp: 2021-07-07T22:02:39Z
  name: default
  namespace: default
  resourceVersion: "243024"
  uid: 052fb0f4-3d50-11e5-b066-42010af0d7b6
```

<!--
Using your editor, delete the line with key `resourceVersion`, add lines for
`imagePullSecrets:` and save it. Leave the `uid` value set the same as you found it.

After you made those changes, the edited ServiceAccount looks something like this:
-->
使用你的编辑器，删掉包含 `resourceVersion` 主键的行，添加包含 `imagePullSecrets:`
的行并保存文件。对于 `uid` 而言，保持其取值与你读到的值一样。

当你完成这些变更之后，所编辑的 ServiceAccount 看起来像是这样：

```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  creationTimestamp: 2021-07-07T22:02:39Z
  name: default
  namespace: default
  uid: 052fb0f4-3d50-11e5-b066-42010af0d7b6
imagePullSecrets:
  - name: myregistrykey
```

<!--
### Verify that imagePullSecrets are set for new Pods

Now, when a new Pod is created in the current namespace and using the default
ServiceAccount, the new Pod has its `spec.imagePullSecrets` field set automatically:
-->
### 检查 imagePullSecrets 已经被设置到新 Pod 上  {#verify-that-imagepullsecrets-are-set-for-new-pods}

现在，在当前名字空间中创建新 Pod 并使用默认 ServiceAccount 时，
新 Pod 的 `spec.imagePullSecrets` 会被自动设置。

```shell
kubectl run nginx --image=<registry name>/nginx --restart=Never
kubectl get pod nginx -o=jsonpath='{.spec.imagePullSecrets[0].name}{"\n"}'
```

<!--
The output is:
-->
输出为：

```
myregistrykey
```

<!--
## ServiceAccount token volume projection
-->
## 服务账号令牌卷投射   {#serviceaccount-token-volume-projection}

{{< feature-state for_k8s_version="v1.20" state="stable" >}}

{{< note >}}
<!--
To enable and use token request projection, you must specify each of the following
command line arguments to `kube-apiserver`:
-->
为了启用令牌请求投射，你必须为 `kube-apiserver` 设置以下命令行参数：

<!--
`--service-account-issuer`
: defines the Identifier of the service account token issuer. You can specify the
  `--service-account-issuer` argument multiple times, this can be useful to enable
  a non-disruptive change of the issuer. When this flag is specified multiple times,
  the first is used to generate tokens and all are used to determine which issuers
  are accepted. You must be running Kubernetes v1.22 or later to be able to specify
  `--service-account-issuer` multiple times.
-->
`--service-account-issuer`
: 定义服务账号令牌发放者的身份标识（Identifier）。你可以多次指定
  `--service-account-issuer` 参数，对于需要变更发放者而又不想带来业务中断的场景，
  这样做是有用的。如果这个参数被多次指定，其第一个参数值会被用来生成令牌，
  而所有参数值都会被用来确定哪些发放者是可接受的。你所运行的 Kubernetes
  集群必须是 v1.22 或更高版本才能多次指定 `--service-account-issuer`。

<!--
`--service-account-key-file`
: specifies the path to a file containing PEM-encoded X.509 private or public keys
  (RSA or ECDSA), used to verify ServiceAccount tokens. The specified file can contain
  multiple keys, and the flag can be specified multiple times with different files.
  If specified multiple times, tokens signed by any of the specified keys are considered
  valid by the Kubernetes API server.
-->
`--service-account-key-file`
: 给出某文件的路径，其中包含 PEM 编码的 x509 RSA 或 ECDSA 私钥或公钥，用来检查 ServiceAccount
  的令牌。所指定的文件中可以包含多个秘钥，并且你可以多次使用此参数，每个参数值为不同的文件。
  多次使用此参数时，由所给的秘钥之一签名的令牌会被 Kubernetes API 服务器认为是合法令牌。

<!--
`--service-account-signing-key-file`
: specifies the path to a file that contains the current private key of the service
  account token issuer. The issuer signs issued ID tokens with this private key.
-->
`--service-account-signing-key-file`
: 指向某文件的路径，其中包含当前服务账号令牌发放者的私钥。
  此发放者使用此私钥来签署所发放的 ID 令牌。

<!--
`--api-audiences` (can be omitted)
: defines audiences for ServiceAccount tokens. The service account token authenticator
  validates that tokens used against the API are bound to at least one of these audiences.
  If `api-audiences` is specified multiple times, tokens for any of the specified audiences
  are considered valid by the Kubernetes API server. If you specify the `--service-account-issuer`
  command line argument but you don't set `--api-audiences`, the control plane defaults to
  a single element audience list that contains only the issuer URL.
-->
`--api-audiences`（可以省略）
: 为 ServiceAccount 令牌定义其受众（Audiences）。
  服务账号令牌身份检查组件会检查针对 API 访问所使用的令牌，
  确认令牌至少是被绑定到这里所给的受众之一。
  如果 `api-audiences` 被多次指定，则针对所给的多个受众中任何目标的令牌都会被
  Kubernetes API 服务器当做合法的令牌。如果你指定了 `--service-account-issuer`
  参数，但沒有設置 `--api-audiences`，则控制面认为此参数的默认值为一个只有一个元素的列表，
  且该元素为令牌发放者的 URL。

{{< /note >}}

<!--
The kubelet can also project a ServiceAccount token into a Pod. You can
specify desired properties of the token, such as the audience and the validity
duration. These properties are _not_ configurable on the default ServiceAccount
token. The token will also become invalid against the API when either the Pod
or the ServiceAccount is deleted.
-->
kubelet 还可以将 ServiceAccount 令牌投射到 Pod 中。你可以指定令牌的期望属性，
例如受众和有效期限。这些属性在 default ServiceAccount 令牌上**无法**配置。
当 Pod 或 ServiceAccount 被删除时，该令牌也将对 API 无效。

<!--
You can configure this behavior for the `spec` of a Pod using a
[projected volume](/docs/concepts/storage/volumes/#projected) type called
`ServiceAccountToken`.
-->
你可以使用类型为 `ServiceAccountToken` 的[投射卷](/zh-cn/docs/concepts/storage/volumes/#projected)来为
Pod 的 `spec` 配置此行为。

<!--
The token from this projected volume is a {{<glossary_tooltip term_id="jwt" text="JSON Web Token">}}  (JWT).
The JSON payload of this token follows a well defined schema - an example payload for a pod bound token:
-->
来自此投射卷的令牌是一个 {{<glossary_tooltip term_id="jwt" text="JSON Web Token">}} (JWT)。
此令牌的 JSON 载荷遵循明确定义的模式，绑定到 Pod 的令牌的示例载荷如下：

<!--
```yaml
{
  "aud": [  # matches the requested audiences, or the API server's default audiences when none are explicitly requested
    "https://kubernetes.default.svc"
  ],
  "exp": 1731613413,
  "iat": 1700077413,
  "iss": "https://kubernetes.default.svc",  # matches the first value passed to the --service-account-issuer flag
  "jti": "ea28ed49-2e11-4280-9ec5-bc3d1d84661a",  # ServiceAccountTokenJTI feature must be enabled for the claim to be present
  "kubernetes.io": {
    "namespace": "kube-system",
    "node": {  # ServiceAccountTokenPodNodeInfo feature must be enabled for the API server to add this node reference claim
      "name": "127.0.0.1",
      "uid": "58456cb0-dd00-45ed-b797-5578fdceaced"
    },
    "pod": {
      "name": "coredns-69cbfb9798-jv9gn",
      "uid": "778a530c-b3f4-47c0-9cd5-ab018fb64f33"
    },
    "serviceaccount": {
      "name": "coredns",
      "uid": "a087d5a0-e1dd-43ec-93ac-f13d89cd13af"
    },
    "warnafter": 1700081020
  },
  "nbf": 1700077413,
  "sub": "system:serviceaccount:kube-system:coredns"
}
```
-->
```yaml
{
  "aud": [  # 匹配请求的受众，或当没有明确请求时匹配 API 服务器的默认受众
    "https://kubernetes.default.svc"
  ],
  "exp": 1731613413,
  "iat": 1700077413,
  "iss": "https://kubernetes.default.svc",  # 匹配传递到 --service-account-issuer 标志的第一个值
  "jti": "ea28ed49-2e11-4280-9ec5-bc3d1d84661a",  # ServiceAccountTokenJTI 特性必须被启用才能出现此申领
  "kubernetes.io": {
    "namespace": "kube-system",
    "node": {  # ServiceAccountTokenPodNodeInfo 特性必须被启用，API 服务器才会添加此节点引用申领
      "name": "127.0.0.1",
      "uid": "58456cb0-dd00-45ed-b797-5578fdceaced"
    },
    "pod": {
      "name": "coredns-69cbfb9798-jv9gn",
      "uid": "778a530c-b3f4-47c0-9cd5-ab018fb64f33"
    },
    "serviceaccount": {
      "name": "coredns",
      "uid": "a087d5a0-e1dd-43ec-93ac-f13d89cd13af"
    },
    "warnafter": 1700081020
  },
  "nbf": 1700077413,
  "sub": "system:serviceaccount:kube-system:coredns"
}
```

<!--
### Launch a Pod using service account token projection

To provide a Pod with a token with an audience of `vault` and a validity duration
of two hours, you could define a Pod manifest that is similar to:
-->
### 启动使用服务账号令牌投射的 Pod  {#launch-a-pod-using-service-account-token-projection}

要为某 Pod 提供一个受众为 `vault` 并且有效期限为 2 小时的令牌，你可以定义一个与下面类似的
Pod 清单：

{{% code_sample file="pods/pod-projected-svc-token.yaml" %}}

<!--
Create the Pod:
-->
创建此 Pod：

```shell
kubectl create -f https://k8s.io/examples/pods/pod-projected-svc-token.yaml
```

<!--
The kubelet will: request and store the token on behalf of the Pod; make
the token available to the Pod at a configurable file path; and refresh
the token as it approaches expiration. The kubelet proactively requests rotation
for the token if it is older than 80% of its total time-to-live (TTL),
or if the token is older than 24 hours.
-->
kubelet 组件会替 Pod 请求令牌并将其保存起来；通过将令牌存储到一个可配置的路径以使之在
Pod 内可用；在令牌快要到期的时候刷新它。kubelet 会在令牌存在期达到其 TTL 的 80%
的时候或者令牌生命期超过 24 小时的时候主动请求将其轮换掉。

<!--
The application is responsible for reloading the token when it rotates. It's
often good enough for the application to load the token on a schedule
(for example: once every 5 minutes), without tracking the actual expiry time.
-->
应用负责在令牌被轮换时重新加载其内容。通常而言，周期性地（例如，每隔 5 分钟）
重新加载就足够了，不必跟踪令牌的实际过期时间。

<!--
## Service Account Issuer Discovery
-->
## 发现服务账号分发者 {#service-account-issuer-discovery}

{{< feature-state for_k8s_version="v1.21" state="stable" >}}

<!--
If you have enabled [token projection](#serviceaccount-token-volume-projection)
for ServiceAccounts in your cluster, then you can also make use of the discovery
feature. Kubernetes provides a way for clients to federate as an _identity provider_,
so that one or more external systems can act as a _relying party_.
-->
如果你在你的集群中已经为 ServiceAccount 启用了[令牌投射](#serviceaccount-token-volume-projection)，
那么你也可以利用其发现能力。Kubernetes 提供一种方式来让客户端将一个或多个外部系统进行联邦，
作为**标识提供者（Identity Provider）**，而这些外部系统的角色是**依赖方（Relying Party）**。

{{< note >}}
<!--
The issuer URL must comply with the
[OIDC Discovery Spec](https://openid.net/specs/openid-connect-discovery-1_0.html). In
practice, this means it must use the `https` scheme, and should serve an OpenID
provider configuration at `{service-account-issuer}/.well-known/openid-configuration`.

If the URL does not comply, ServiceAccount issuer discovery endpoints are not
registered or accessible.
-->
分发者的 URL 必须遵从
[OIDC 发现规范](https://openid.net/specs/openid-connect-discovery-1_0.html)。
实现上，这意味着 URL 必须使用 `https` 模式，并且必须在路径
`{service-account-issuer}/.well-known/openid-configuration`
处给出 OpenID 提供者（Provider）的配置信息。

如果 URL 没有遵从这一规范，ServiceAccount 分发者发现末端末端就不会被注册也无法访问。
{{< /note >}}

<!--
When enabled, the Kubernetes API server publishes an OpenID Provider
Configuration document via HTTP. The configuration document is published at
`/.well-known/openid-configuration`.
The OpenID Provider Configuration is sometimes referred to as the _discovery document_.
The Kubernetes API server publishes the related
JSON Web Key Set (JWKS), also via HTTP, at `/openid/v1/jwks`.
-->
当此特性被启用时，Kubernetes API 服务器会通过 HTTP 发布一个 OpenID 提供者配置文档。
该配置文档发布在 `/.well-known/openid-configuration` 路径。
这里的 OpenID 提供者配置（OpenID Provider Configuration）有时候也被称作
“发现文档（Discovery Document）”。
Kubernetes API 服务器也通过 HTTP 在 `/openid/v1/jwks` 处发布相关的
JSON Web Key Set（JWKS）。

{{< note >}}
<!--
The responses served at `/.well-known/openid-configuration` and
`/openid/v1/jwks` are designed to be OIDC compatible, but not strictly OIDC
compliant. Those documents contain only the parameters necessary to perform
validation of Kubernetes service account tokens.
-->
对于在 `/.well-known/openid-configuration` 和 `/openid/v1/jwks` 上给出的响应而言，
其设计上是保证与 OIDC 兼容的，但并不严格遵从 OIDC 的规范。
响应中所包含的文档进包含对 Kubernetes 服务账号令牌进行校验所必需的参数。
{{< /note >}}

<!--
Clusters that use {{< glossary_tooltip text="RBAC" term_id="rbac">}} include a
default ClusterRole called `system:service-account-issuer-discovery`.
A default ClusterRoleBinding assigns this role to the `system:serviceaccounts` group,
which all ServiceAccounts implicitly belong to.
This allows pods running on the cluster to access the service account discovery document
via their mounted service account token. Administrators may, additionally, choose to
bind the role to `system:authenticated` or `system:unauthenticated` depending on their
security requirements and which external systems they intend to federate with.
-->
使用 {{< glossary_tooltip text="RBAC" term_id="rbac">}} 的集群都包含一个的默认
RBAC ClusterRole, 名为 `system:service-account-issuer-discovery`。
默认的 RBAC ClusterRoleBinding 将此角色分配给 `system:serviceaccounts` 组，
所有 ServiceAccount 隐式属于该组。这使得集群上运行的 Pod
能够通过它们所挂载的服务账号令牌访问服务账号发现文档。
此外，管理员可以根据其安全性需要以及期望集成的外部系统，选择是否将该角色绑定到
`system:authenticated` 或 `system:unauthenticated`。

<!--
The JWKS response contains public keys that a relying party can use to validate
the Kubernetes service account tokens. Relying parties first query for the
OpenID Provider Configuration, and use the `jwks_uri` field in the response to
find the JWKS.
-->
JWKS 响应包含依赖方可以用来验证 Kubernetes 服务账号令牌的公钥数据。
依赖方先会查询 OpenID 提供者配置，之后使用返回响应中的 `jwks_uri` 来查找 JWKS。

<!--
In many cases, Kubernetes API servers are not available on the public internet,
but public endpoints that serve cached responses from the API server can be made
available by users or by service providers. In these cases, it is possible to
override the `jwks_uri` in the OpenID Provider Configuration so that it points
to the public endpoint, rather than the API server's address, by passing the
`--service-account-jwks-uri` flag to the API server. Like the issuer URL, the
JWKS URI is required to use the `https` scheme.
-->
在很多场合，Kubernetes API 服务器都不会暴露在公网上，不过对于缓存并向外提供 API
服务器响应数据的公开末端而言，用户或者服务提供商可以选择将其暴露在公网上。
在这种环境中，可能会重载 OpenID 提供者配置中的
`jwks_uri`，使之指向公网上可用的末端地址，而不是 API 服务器的地址。
这时需要向 API 服务器传递 `--service-account-jwks-uri` 参数。
与分发者 URL 类似，此 JWKS URI 也需要使用 `https` 模式。

## {{% heading "whatsnext" %}}

<!--
See also:

- Read the [Cluster Admin Guide to Service Accounts](/docs/reference/access-authn-authz/service-accounts-admin/)
- Read about [Authorization in Kubernetes](/docs/reference/access-authn-authz/authorization/)
- Read about [Secrets](/docs/concepts/configuration/secret/)
  - or learn to [distribute credentials securely using Secrets](/docs/tasks/inject-data-application/distribute-credentials-secure/)
  - but also bear in mind that using Secrets for authenticating as a ServiceAccount
    is deprecated. The recommended alternative is
    [ServiceAccount token volume projection](#serviceaccount-token-volume-projection).
-->
另请参见：

- 阅读[为集群管理员提供的服务账号指南](/zh-cn/docs/reference/access-authn-authz/service-accounts-admin/)
- 阅读 [Kubernetes中的鉴权](/zh-cn/docs/reference/access-authn-authz/authorization/)
- 阅读 [Secret](/zh-cn/docs/concepts/configuration/secret/) 的概念
  - 或者学习[使用 Secret 来安全地分发凭据](/zh-cn/docs/tasks/inject-data-application/distribute-credentials-secure/)
  - 不过也要注意，使用 Secret 来完成 ServiceAccount 身份验证的做法已经过时。
    建议的替代做法是执行 [ServiceAccount 令牌卷投射](#serviceaccount-token-volume-projection)。
<!--
- Read about [projected volumes](/docs/tasks/configure-pod-container/configure-projected-volume-storage/).
- For background on OIDC discovery, read the
  [ServiceAccount signing key retrieval](https://github.com/kubernetes/enhancements/tree/master/keps/sig-auth/1393-oidc-discovery)
  Kubernetes Enhancement Proposal
- Read the [OIDC Discovery Spec](https://openid.net/specs/openid-connect-discovery-1_0.html)
-->
- 阅读理解[投射卷](/zh-cn/docs/tasks/configure-pod-container/configure-projected-volume-storage/)
- 关于 OIDC 发现的相关背景信息，阅读[服务账号签署密钥检索 KEP](https://github.com/kubernetes/enhancements/tree/master/keps/sig-auth/1393-oidc-discovery)
  这一 Kubernetes 增强提案
- 阅读 [OIDC 发现规范](https://openid.net/specs/openid-connect-discovery-1_0.html)
