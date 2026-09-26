---
title: 使用 Node 鉴权
content_type: concept
weight: 34
---
<!--
reviewers:
- timstclair
- deads2k
- liggitt
title: Using Node Authorization
content_type: concept
weight: 34
-->

<!-- overview -->

<!--
Node authorization is a special-purpose authorization mode that specifically
authorizes API requests made by kubelets.
-->
节点鉴权是一种特殊用途的鉴权模式，专门对 kubelet 发出的 API 请求进行授权。

<!-- body -->

<!--
## Overview
-->
## 概述   {#overview}

<!--
The Node authorizer allows a kubelet to perform API operations. This includes:
-->
节点鉴权器允许 kubelet 执行 API 操作。包括：

<!--
Read operations:
-->
读取操作：

<!--
* services
* endpoints
* nodes
* pods
* secrets, configmaps, persistent volume claims and persistent volumes related
  to pods bound to the kubelet's node
-->
* services
* endpoints
* nodes
* pods
* 与绑定到 kubelet 节点的 Pod 相关的 Secret、ConfigMap、PersistentVolumeClaim 和持久卷

{{< feature-state feature_gate_name="AuthorizeNodeWithSelectors" >}}

<!--
Kubelets are limited to reading their own Node objects, and only reading pods bound to their node.
-->
kubelet 仅限于读取自己的节点对象，以及与节点绑定的 Pod。

<!--
Write operations:
-->
写入操作：

<!--
* nodes and node status (enable the `NodeRestriction` admission plugin to limit
  a kubelet to modify its own node)
* pods and pod status (enable the `NodeRestriction` admission plugin to limit a
  kubelet to modify pods bound to itself)
* events
-->
* 节点和节点状态（启用 `NodeRestriction` 准入插件以限制 kubelet 只能修改自己的节点）
* Pod 和 Pod 状态（启用 `NodeRestriction` 准入插件以限制 kubelet 只能修改绑定到自身的 Pod）
* 事件

<!--
Auth-related operations:
-->
身份认证与鉴权相关的操作：

<!--
* read/write access to the
  [CertificateSigningRequests API](/docs/reference/access-authn-authz/certificate-signing-requests/)
  for TLS bootstrapping
* the ability to create TokenReviews and SubjectAccessReviews for delegated
  authentication/authorization checks
-->
* 对于基于 TLS 的启动引导过程时使用的
  [certificationsigningrequests API](/zh-cn/docs/reference/access-authn-authz/certificate-signing-requests/)
  的读/写权限
* 为委派的身份验证/鉴权检查创建 TokenReview 和 SubjectAccessReview 的能力

<!--
In future releases, the node authorizer may add or remove permissions to ensure
kubelets have the minimal set of permissions required to operate correctly.
-->
在将来的版本中，节点鉴权器可能会添加或删除权限，以确保 kubelet 具有正确操作所需的最小权限集。

<!--
In order to be authorized by the Node authorizer, kubelets must use a credential
that identifies them as being in the `system:nodes` group, with a username of
`system:node:<nodeName>`.
This group and user name format match the identity created for each kubelet as part of 
[kubelet TLS bootstrapping](/docs/reference/access-authn-authz/kubelet-tls-bootstrapping/).
-->
为了获得节点鉴权器的授权，kubelet 必须使用一个凭据以表示它在 `system:nodes`
组中，用户名为 `system:node:<nodeName>`。上述的组名和用户名格式要与
[kubelet TLS 启动引导](/zh-cn/docs/reference/access-authn-authz/kubelet-tls-bootstrapping/)
过程中为每个 kubelet 创建的标识相匹配。

<!--
The value of `<nodeName>` **must** match precisely the name of the node as
registered by the kubelet. By default, this is the host name as provided by
`hostname`, or overridden via the
[kubelet option](/docs/reference/command-line-tools-reference/kubelet/)
`--hostname-override`. However, when using the `--cloud-provider` kubelet
option, the specific hostname may be determined by the cloud provider, ignoring
the local `hostname` and the `--hostname-override` option. 
For specifics about how the kubelet determines the hostname, see the
[kubelet options reference](/docs/reference/command-line-tools-reference/kubelet/).
-->
`<nodeName>` 的值**必须**与 kubelet 注册的节点名称精确匹配。默认情况下，节点名称是由
`hostname` 提供的主机名，或者通过 kubelet `--hostname-override`
[选项](/zh-cn/docs/reference/command-line-tools-reference/kubelet/)覆盖。
但是，当使用 `--cloud-provider` kubelet 选项时，具体的主机名可能由云提供商确定，
忽略本地的 `hostname` 和 `--hostname-override` 选项。有关
kubelet 如何确定主机名的详细信息，请参阅
[kubelet 选项参考](/zh-cn/docs/reference/command-line-tools-reference/kubelet/)。

<!--
To enable the Node authorizer, start the {{< glossary_tooltip text="API server" term_id="kube-apiserver" >}}
with the `--authorization-config` flag set to a file that includes the `Node` authorizer; for example:
-->
要启用 Node 鉴权器，启动 {{< glossary_tooltip text="API 服务器" term_id="kube-apiserver" >}}时将
`--authorization-config` 参数设置为包含 `Node` 鉴权器的某个文件；例如：

```yaml
apiVersion: apiserver.config.k8s.io/v1
kind: AuthorizationConfiguration
authorizers:
  ...
  - type: Node
  ...
```

<!--
Or, start the {{< glossary_tooltip text="API server" term_id="kube-apiserver" >}} with
the `--authorization-mode` flag set to a comma-separated list that includes `Node`;
for example:
-->
或者，在启动 {{< glossary_tooltip text="API 服务器" term_id="kube-apiserver" >}}时将
`--authorization-mode` 参数设置为一个包含 `Node` 的逗号分隔的列表；例如：

```shell
kube-apiserver --authorization-mode=...,Node --other-options --more-options
```

<!--
To limit the API objects kubelets are able to write, enable the
[NodeRestriction](/docs/reference/access-authn-authz/admission-controllers#noderestriction)
admission plugin by starting the apiserver with
`--enable-admission-plugins=...,NodeRestriction,...`
-->
要限制 kubelet 可以写入的 API 对象，请使用
`--enable-admission-plugins=...,NodeRestriction,...` 启动 API 服务器，从而启用
[NodeRestriction](/zh-cn/docs/reference/access-authn-authz/admission-controllers#NodeRestriction)
准入插件。

<!--
## Service account token audience restriction {#service-account-token-audience-restriction}
-->
## 服务帐户令牌受众限制   {#service-account-token-audience-restriction}

{{< feature-state feature_gate_name="ServiceAccountNodeAudienceRestriction" >}}

<!--
When the `ServiceAccountNodeAudienceRestriction` [feature gate](/docs/reference/command-line-tools-reference/feature-gates/)
is enabled and the `NodeRestriction` admission plugin is active, the kubelet can only
request service account tokens for audiences that are already referenced by pods running
on that node. This prevents a compromised node from obtaining tokens for arbitrary audiences.
-->
当启用了 `ServiceAccountNodeAudienceRestriction`
[特性门控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)，
并且 `NodeRestriction` 准入插件处于活动状态时，kubelet 只能请求为那些已经在该节点上运行的
Pod 引用的受众的服务账户令牌。这防止了被攻破的节点获取任意受众的令牌。

<!--
The allowed audiences are determined from the pod spec:

- The default API server audience (empty or the API server's configured audience).
- Audiences set in projected service account token volume sources.
- Audiences configured in CSI driver `spec.tokenRequests` for any CSI driver used by
  the pod, whether through inline CSI volumes, PersistentVolumeClaim-backed volumes,
  or ephemeral volumes.
-->
允许的受众从 Pod 规约中确定：

- 默认 API 服务器受众（空或 API 服务器配置的受众）。
- 在投射服务账户令牌卷源中设置的受众。
- 在 CSI 驱动 `spec.tokenRequests` 中配置的受众，适用于 Pod 使用的任何 CSI 驱动，
  无论是通过内联 CSI 卷、由 PersistentVolumeClaim 支持的卷，或是临时卷。

<!--
This is particularly relevant when using [service account tokens for image credential providers](/docs/tasks/administer-cluster/kubelet-credential-provider/#service-account-token-for-image-pulls),
where the kubelet requests tokens with a registry-specific audience on behalf of pods.
-->
这在使用[服务账户令牌为镜像凭据提供者](/zh-cn/docs/tasks/administer-cluster/kubelet-credential-provider/#service-account-token-for-image-pulls)时特别相关，
此时 kubelet 代表 Pod 向特定注册表受众请求令牌。

<!--
### Allowing additional audiences with RBAC {#allowing-additional-audiences}

You can grant kubelets permission to request tokens for audiences beyond what
the pod spec references. When the kubelet requests a token with an audience that
is not found in the pod spec, the NodeRestriction admission plugin checks whether
the kubelet is authorized by performing an authorization check with the following
attributes:
-->
### 使用 RBAC 允许额外的受众 {#allowing-additional-audiences}

你可以授予 kubelet 权限，以请求超出 Pod 规约引用的受众的令牌。
当 kubelet 请求带有未在 Pod 规约中找到的受众的令牌时，
NodeRestriction 准入插件通过执行带有以下属性的授权检查来验证 kubelet 是否有权限：

<!--
| Attribute  | Value |
| ---------- | ----- |
| Verb       | `request-serviceaccounts-token-audience` |
| API Group  | (empty string, meaning the core API group) |
| Resource   | The requested audience value |
| Name       | The service account name |
| Namespace  | The service account namespace |
-->
| 属性                  | 值 |
| --------------------- | --------------------------------------- |
| 动词（Verb）           | `request-serviceaccounts-token-audience` |
| API 组（API Group）    | （空字符串，意味着核心 API 组）              |
| 资源（Resource）       | 请求的受众值                              |
| 名称（Name）           | 服务账号名称                               |
| 命名空间（Namespace）   | 服务账号命名空间                          |

<!--
You can use standard RBAC rules to authorize these checks. The `resources` field
controls which audiences are allowed, and the `resourceNames` field controls which
service accounts the rule applies to.

For example, to allow the kubelet to request audience `my-registry-audience` for
a specific service account:
-->
你可以使用标准的 RBAC 规则来授权这些检查。
`resources` 字段控制允许哪些受众，`resourceNames`
字段控制规则适用的服务账号。

例如，要允许 kubelet 为特定服务账号请求受众 `my-registry-audience`：

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: node-audience-my-registry
rules:
- verbs: ["request-serviceaccounts-token-audience"]
  apiGroups: [""]
  resources: ["my-registry-audience"]
  resourceNames: ["my-service-account"]
```

<!--
Omitting `resourceNames` allows the audience for any service account. Using a
wildcard (`"*"`) for `resources` allows any audience:
-->
省略 `resourceNames` 时，允许为任意服务账号请求该受众。
`resources` 使用通配符（`"*"`）时，允许请求任意受众：

<!--
# any audience
# no resourceNames: any service account
-->
```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: node-audience-unrestricted
rules:
- verbs: ["request-serviceaccounts-token-audience"]
  apiGroups: [""]
  resources: ["*"]  # 任意受众
  # 无资源名称：任何服务帐户
```

<!--
Bind the ClusterRole to the `system:nodes` group to apply it to all kubelets:
-->
将 ClusterRole 绑定到 `system:nodes` 组，使其应用于所有 kubelet：

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: node-audience-binding
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: node-audience-my-registry
subjects:
- kind: Group
  name: system:nodes
  apiGroup: rbac.authorization.k8s.io
```

{{< note >}}
<!--
This restriction is part of the NodeRestriction admission plugin and only applies to
node identities (kubelets). It does not restrict which audiences other callers of the
`TokenRequest` API can request. If you need to restrict other callers, consider using a [ValidatingAdmissionPolicy](/docs/reference/access-authn-authz/validating-admission-policy/).
-->
此限制是 NodeRestriction 准入插件的一部分，
且仅适用于节点身份（kubelet）。它并不限制其他调用者可以请求的受众。
如果你需要限制其他调用者，请考虑使用
[ValidatingAdmissionPolicy](/zh-cn/docs/reference/access-authn-authz/validating-admission-policy/)。
{{< /note >}}

<!--
## Migration considerations
-->
## 迁移考虑因素   {#migration-considerations}

<!--
### Kubelets outside the `system:nodes` group
-->
### 在 `system:nodes` 组之外的 kubelet   {#kubelets-outside-the-system-nodes-group}

<!--
Kubelets outside the `system:nodes` group would not be authorized by the `Node`
authorization mode, and would need to continue to be authorized via whatever
mechanism currently authorizes them.
The node admission plugin would not restrict requests from these kubelets.
-->
`system:nodes` 组之外的 kubelet 不会被 `Node` 鉴权模式授权，并且需要继续通过当前授权它们的机制来授权。
节点准入插件不会限制来自这些 kubelet 的请求。

<!--
### Kubelets with undifferentiated usernames
-->
### 具有无差别用户名的 kubelet   {#kubelets-with-undifferentiated-usernames}

<!--
In some deployments, kubelets have credentials that place them in the `system:nodes` group,
but do not identify the particular node they are associated with,
because they do not have a username in the `system:node:...` format.
These kubelets would not be authorized by the `Node` authorization mode,
and would need to continue to be authorized via whatever mechanism currently authorizes them.
-->
在一些部署中，kubelet 具有 `system:nodes` 组的凭据，
但是无法给出它们所关联的节点的标识，因为它们没有 `system:node:...` 格式的用户名。
这些 kubelet 不会被 `Node` 鉴权模式授权，并且需要继续通过当前授权它们的任何机制来授权。

<!--
The `NodeRestriction` admission plugin would ignore requests from these kubelets,
since the default node identifier implementation would not consider that a node identity.
-->
因为默认的节点标识符实现不会把它当作节点身份标识，`NodeRestriction`
准入插件会忽略来自这些 kubelet 的请求。
