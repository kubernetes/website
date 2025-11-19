---
title: 使用 Node 鑑權
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
節點鑑權是一種特殊用途的鑑權模式，專門對 kubelet 發出的 API 請求進行授權。

<!-- body -->

<!--
## Overview
-->
## 概述   {#overview}

<!--
The Node authorizer allows a kubelet to perform API operations. This includes:
-->
節點鑑權器允許 kubelet 執行 API 操作。包括：

<!--
Read operations:
-->
讀取操作：

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
* 與綁定到 kubelet 節點的 Pod 相關的 Secret、ConfigMap、PersistentVolumeClaim 和持久卷

{{< feature-state feature_gate_name="AuthorizeNodeWithSelectors" >}}

<!--
Kubelets are limited to reading their own Node objects, and only reading pods bound to their node.
-->
kubelet 僅限於讀取自己的節點對象，以及與節點綁定的 Pod。

<!--
Write operations:
-->
寫入操作：

<!--
* nodes and node status (enable the `NodeRestriction` admission plugin to limit
  a kubelet to modify its own node)
* pods and pod status (enable the `NodeRestriction` admission plugin to limit a
  kubelet to modify pods bound to itself)
* events
-->
* 節點和節點狀態（啓用 `NodeRestriction` 准入插件以限制 kubelet 只能修改自己的節點）
* Pod 和 Pod 狀態（啓用 `NodeRestriction` 准入插件以限制 kubelet 只能修改綁定到自身的 Pod）
* 事件

<!--
Auth-related operations:
-->
身份認證與鑑權相關的操作：

<!--
* read/write access to the
  [CertificateSigningRequests API](/docs/reference/access-authn-authz/certificate-signing-requests/)
  for TLS bootstrapping
* the ability to create TokenReviews and SubjectAccessReviews for delegated
  authentication/authorization checks
-->
* 對於基於 TLS 的啓動引導過程時使用的
  [certificationsigningrequests API](/zh-cn/docs/reference/access-authn-authz/certificate-signing-requests/)
  的讀/寫權限
* 爲委派的身份驗證/鑑權檢查創建 TokenReview 和 SubjectAccessReview 的能力

<!--
In future releases, the node authorizer may add or remove permissions to ensure
kubelets have the minimal set of permissions required to operate correctly.
-->
在將來的版本中，節點鑑權器可能會添加或刪除權限，以確保 kubelet 具有正確操作所需的最小權限集。

<!--
In order to be authorized by the Node authorizer, kubelets must use a credential
that identifies them as being in the `system:nodes` group, with a username of
`system:node:<nodeName>`.
This group and user name format match the identity created for each kubelet as part of 
[kubelet TLS bootstrapping](/docs/reference/access-authn-authz/kubelet-tls-bootstrapping/).
-->
爲了獲得節點鑑權器的授權，kubelet 必須使用一個憑據以表示它在 `system:nodes`
組中，用戶名爲 `system:node:<nodeName>`。上述的組名和用戶名格式要與
[kubelet TLS 啓動引導](/zh-cn/docs/reference/access-authn-authz/kubelet-tls-bootstrapping/)
過程中爲每個 kubelet 創建的標識相匹配。

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
`<nodeName>` 的值**必須**與 kubelet 註冊的節點名稱精確匹配。默認情況下，節點名稱是由
`hostname` 提供的主機名，或者通過 kubelet `--hostname-override`
[選項](/zh-cn/docs/reference/command-line-tools-reference/kubelet/)覆蓋。
但是，當使用 `--cloud-provider` kubelet 選項時，具體的主機名可能由雲提供商確定，
忽略本地的 `hostname` 和 `--hostname-override` 選項。有關
kubelet 如何確定主機名的詳細信息，請參閱
[kubelet 選項參考](/zh-cn/docs/reference/command-line-tools-reference/kubelet/)。

<!--
To enable the Node authorizer, start the {{< glossary_tooltip text="API server" term_id="kube-apiserver" >}}
with the `--authorization-config` flag set to a file that includes the `Node` authorizer; for example:
-->
要啓用 Node 鑑權器，啓動 {{< glossary_tooltip text="API 服務器" term_id="kube-apiserver" >}}時將
`--authorization-config` 參數設置爲包含 `Node` 鑑權器的某個文件；例如：

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
或者，在啓動 {{< glossary_tooltip text="API 服務器" term_id="kube-apiserver" >}}時將
`--authorization-mode` 參數設置爲一個包含 `Node` 的逗號分隔的列表；例如：

```shell
kube-apiserver --authorization-mode=...,Node --other-options --more-options
```

<!--
To limit the API objects kubelets are able to write, enable the
[NodeRestriction](/docs/reference/access-authn-authz/admission-controllers#noderestriction)
admission plugin by starting the apiserver with
`--enable-admission-plugins=...,NodeRestriction,...`
-->
要限制 kubelet 可以寫入的 API 對象，請使用
`--enable-admission-plugins=...,NodeRestriction,...` 啓動 API 服務器，從而啓用
[NodeRestriction](/zh-cn/docs/reference/access-authn-authz/admission-controllers#NodeRestriction)
准入插件。

<!--
## Migration considerations
-->
## 遷移考慮因素   {#migration-considerations}

<!--
### Kubelets outside the `system:nodes` group
-->
### 在 `system:nodes` 組之外的 kubelet   {#kubelets-outside-the-system-nodes-group}

<!--
Kubelets outside the `system:nodes` group would not be authorized by the `Node`
authorization mode, and would need to continue to be authorized via whatever
mechanism currently authorizes them.
The node admission plugin would not restrict requests from these kubelets.
-->
`system:nodes` 組之外的 kubelet 不會被 `Node` 鑑權模式授權，並且需要繼續通過當前授權它們的機制來授權。
節點准入插件不會限制來自這些 kubelet 的請求。

<!--
### Kubelets with undifferentiated usernames
-->
### 具有無差別用戶名的 kubelet   {#kubelets-with-undifferentiated-usernames}

<!--
In some deployments, kubelets have credentials that place them in the `system:nodes` group,
but do not identify the particular node they are associated with,
because they do not have a username in the `system:node:...` format.
These kubelets would not be authorized by the `Node` authorization mode,
and would need to continue to be authorized via whatever mechanism currently authorizes them.
-->
在一些部署中，kubelet 具有 `system:nodes` 組的憑據，
但是無法給出它們所關聯的節點的標識，因爲它們沒有 `system:node:...` 格式的用戶名。
這些 kubelet 不會被 `Node` 鑑權模式授權，並且需要繼續通過當前授權它們的任何機制來授權。

<!--
The `NodeRestriction` admission plugin would ignore requests from these kubelets,
since the default node identifier implementation would not consider that a node identity.
-->
因爲默認的節點標識符實現不會把它當作節點身份標識，`NodeRestriction`
准入插件會忽略來自這些 kubelet 的請求。
