---
title: 使用 Node 鑑權
content_type: concept
weight: 90
---
<!--
---
reviewers:
- timstclair
- deads2k
- liggitt
- ericchiang
title: Using Node Authorization
content_type: concept
weight: 90
---
-->

<!-- overview -->
節點鑑權是一種特殊用途的鑑權模式，專門對 kubelet 發出的 API 請求進行鑑權。
<!--
Node authorization is a special-purpose authorization mode that specifically authorizes API requests made by kubelets.
-->


<!-- body -->
## 概述
<!--
## Overview
-->

節點鑑權器允許 kubelet 執行 API 操作。包括：
<!--
The Node authorizer allows a kubelet to perform API operations. This includes:
-->

讀取操作：
<!--
Read operations:
-->

* services
* endpoints
* nodes
* pods
* secrets、configmaps、pvcs 以及繫結到 kubelet 節點的與 pod 相關的持久卷

<!--
* services
* endpoints
* nodes
* pods
* secrets, configmaps, persistent volume claims and persistent volumes related to pods bound to the kubelet's node
-->

寫入操作：
<!--
Write operations:
-->

* 節點和節點狀態（啟用 `NodeRestriction` 准入外掛以限制 kubelet 只能修改自己的節點）
* Pod 和 Pod 狀態 (啟用 `NodeRestriction` 准入外掛以限制 kubelet 只能修改繫結到自身的 Pod)
* 事件

<!--
* nodes and node status (enable the `NodeRestriction` admission plugin to limit a kubelet to modify its own node)
* pods and pod status (enable the `NodeRestriction` admission plugin to limit a kubelet to modify pods bound to itself)
* events
-->

鑑權相關操作：
<!--
Auth-related operations:
-->

* 對於基於 TLS 的啟動引導過程時使用的
  [certificationsigningrequests API](/zh-cn/docs/reference/access-authn-authz/certificate-signing-requests/)
  的讀/寫許可權
* 為委派的身份驗證/授權檢查建立 TokenReview 和 SubjectAccessReview 的能力

<!--
* read/write access to the [CertificateSigningRequests API](/docs/reference/access-authn-authz/certificate-signing-requests/) for TLS bootstrapping
* the ability to create TokenReviews and SubjectAccessReviews for delegated authentication/authorization checks
-->

在將來的版本中，節點鑑權器可能會新增或刪除許可權，以確保 kubelet 具有正確操作所需的最小許可權集。
<!--
In future releases, the node authorizer may add or remove permissions to ensure kubelets
have the minimal set of permissions required to operate correctly.
-->

為了獲得節點鑑權器的授權，kubelet 必須使用一個憑證以表示它在 `system:nodes` 組中，使用者名稱為 `system:node:<nodeName>`。
上述的組名和使用者名稱格式要與 [kubelet TLS 啟動引導](/zh-cn/docs/reference/access-authn-authz/kubelet-tls-bootstrapping/)過程中為每個 kubelet 建立的標識相匹配。
<!--
In order to be authorized by the Node authorizer, kubelets must use a credential that identifies them as
being in the `system:nodes` group, with a username of `system:node:<nodeName>`.
This group and user name format match the identity created for each kubelet as part of
[kubelet TLS bootstrapping](/docs/reference/access-authn-authz/kubelet-tls-bootstrapping/).
-->

要啟用節點授權器，請使用 `--authorization-mode = Node` 啟動 apiserver。
<!--
To enable the Node authorizer, start the apiserver with `--authorization-mode=Node`.
-->

要限制 kubelet 具有寫入許可權的 API 物件，請使用 `--enable-admission-plugins=...,NodeRestriction,...` 啟動 apiserver，從而啟用 [NodeRestriction](/zh-cn/docs/reference/access-authn-authz/admission-controllers#NodeRestriction) 准入外掛。
<!--
To limit the API objects kubelets are able to write, enable the [NodeRestriction](/docs/reference/access-authn-authz/admission-controllers#NodeRestriction) admission plugin by starting the apiserver with `--enable-admission-plugins=...,NodeRestriction,...`
 -->

## 遷移考慮因素
<!--
## Migration considerations
-->

### 在 `system:nodes` 組之外的 Kubelet
<!--
### Kubelets outside the `system:nodes` group
-->

`system:nodes` 組之外的 kubelet 不會被 `Node` 鑑權模式授權，並且需要繼續通過當前授權它們的機制來授權。
節點准入外掛不會限制來自這些 kubelet 的請求。
<!--
Kubelets outside the `system:nodes` group would not be authorized by the `Node` authorization mode,
and would need to continue to be authorized via whatever mechanism currently authorizes them.
The node admission plugin would not restrict requests from these kubelets.
-->

### 具有無差別使用者名稱的 Kubelet
<!--
### Kubelets with undifferentiated usernames
-->

在一些部署中，kubelet 具有 `system:nodes` 組的憑證，但是無法給出它們所關聯的節點的標識，因為它們沒有 `system:node:...` 格式的使用者名稱。
這些 kubelet 不會被 `Node` 授權模式授權，並且需要繼續通過當前授權它們的任何機制來授權。
<!--
In some deployments, kubelets have credentials that place them in the `system:nodes` group,
but do not identify the particular node they are associated with,
because they do not have a username in the `system:node:...` format.
These kubelets would not be authorized by the `Node` authorization mode,
and would need to continue to be authorized via whatever mechanism currently authorizes them.
-->

因為預設的節點識別符號實現不會把它當作節點身份標識，`NodeRestriction` 准入外掛會忽略來自這些 kubelet 的請求。
<!--
The `NodeRestriction` admission plugin would ignore requests from these kubelets,
since the default node identifier implementation would not consider that a node identity.
-->

### 相對於以前使用 RBAC 的版本的更新
<!--
### Upgrades from previous versions using RBAC
-->

升級的 1.7 之前的使用 [RBAC](/zh-cn/docs/reference/access-authn-authz/rbac/) 的叢集將繼續按原樣執行，因為 `system:nodes` 組繫結已經存在。
<!--
Upgraded pre-1.7 clusters using [RBAC](/docs/reference/access-authn-authz/rbac/) will continue functioning as-is because the `system:nodes` group binding will already exist.
-->

如果叢集管理員希望開始使用 `Node` 鑑權器和 `NodeRestriction` 准入外掛來限制節點對 API 的訪問，這一需求可以透過下列操作來完成且不會影響已部署的應用：
<!--
If a cluster admin wishes to start using the `Node` authorizer and `NodeRestriction` admission plugin
to limit node access to the API, that can be done non-disruptively:
 -->

1. 啟用 `Node` 鑑權模式 (`--authorization-mode=Node,RBAC`) 和 `NodeRestriction` 准入外掛
2. 確保所有 kubelet 的憑據符合組/使用者名稱要求
3. 稽核 apiserver 日誌以確保 `Node` 鑑權器不會拒絕來自 kubelet 的請求（日誌中沒有持續的 `NODE DENY` 訊息）
4. 刪除 `system:node` 叢集角色繫結
<!--
1. Enable the `Node` authorization mode (`--authorization-mode=Node,RBAC`) and the `NodeRestriction` admission plugin
2. Ensure all kubelets' credentials conform to the group/username requirements
3. Audit apiserver logs to ensure the `Node` authorizer is not rejecting requests from kubelets (no persistent `NODE DENY` messages logged)
4. Delete the `system:node` cluster role binding
-->

### RBAC 節點許可權
<!--
### RBAC Node Permissions
-->

在 1.6 版本中，當使用 [RBAC 鑑權模式](/zh-cn/docs/reference/access-authn-authz/rbac/) 時，`system:nodes` 叢集角色會被自動繫結到 `system:node` 組。
<!--
In 1.6, the `system:node` cluster role was automatically bound to the `system:nodes` group when using the [RBAC Authorization mode](/docs/reference/access-authn-authz/rbac/).
-->

在 1.7 版本中，不再推薦將 `system:nodes` 組自動繫結到 `system:node` 角色，因為節點鑑權器透過對 secret 和 configmap 訪問的額外限制完成了相同的任務。
如果同時啟用了 `Node` 和 `RBAC` 授權模式，1.7 版本則不會建立 `system:nodes` 組到 `system:node` 角色的自動繫結。
<!--
In 1.7, the automatic binding of the `system:nodes` group to the `system:node` role is deprecated
because the node authorizer accomplishes the same purpose with the benefit of additional restrictions
on secret and configmap access. If the `Node` and `RBAC` authorization modes are both enabled,
the automatic binding of the `system:nodes` group to the `system:node` role is not created in 1.7.
-->

在 1.8 版本中，繫結將根本不會被建立。
<!--
In 1.8, the binding will not be created at all.
-->

使用 RBAC 時，將繼續建立 `system:node` 叢集角色，以便與將其他使用者或組繫結到該角色的部署方法相容。
<!--
When using RBAC, the `system:node` cluster role will continue to be created,
for compatibility with deployment methods that bind other users or groups to that role.
-->
