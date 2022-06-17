---
title: 管理服務賬號
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
This is a Cluster Administrator guide to service accounts. You should be familiar with 
[configuring Kubernetes service accounts](/docs/tasks/configure-pod-container/configure-service-account/).

Support for authorization and user accounts is planned but incomplete. Sometimes
incomplete features are referred to in order to better describe service accounts.
-->
這是一篇針對服務賬號的叢集管理員指南。你應該熟悉
[配置 Kubernetes 服務賬號](/zh-cn/docs/tasks/configure-pod-container/configure-service-account/)。

對鑑權和使用者賬號的支援已在規劃中，當前並不完備。
為了更好地描述服務賬號，有時這些不完善的特性也會被提及。

<!-- body -->

<!--
## User accounts versus service accounts

Kubernetes distinguishes between the concept of a user account and a service account
for a number of reasons:
-->
## 使用者賬號與服務賬號  {#user-accounts-versus-service-accounts}

Kubernetes 區分使用者賬號和服務賬號的概念，主要基於以下原因：

<!--
- User accounts are for humans. Service accounts are for processes, which run
  in pods.
- User accounts are intended to be global. Names must be unique across all
  namespaces of a cluster. Service accounts are namespaced.
- Typically, a cluster's user accounts might be synced from a corporate
  database, where new user account creation requires special privileges and is
  tied to complex business processes. Service account creation is intended to be
  more lightweight, allowing cluster users to create service accounts for
  specific tasks by following the principle of least privilege.
- Auditing considerations for humans and service accounts may differ.
- A config bundle for a complex system may include definition of various service
  accounts for components of that system. Because service accounts can be created
  without many constraints and have namespaced names, such config is portable.
-->
- 使用者賬號是針對人而言的。 服務賬號是針對執行在 Pod 中的程序而言的。
- 使用者賬號是全域性性的。其名稱跨叢集中名字空間唯一的。服務賬號是名字空間作用域的。
- 通常情況下，叢集的使用者賬號可能會從企業資料庫進行同步，其建立需要特殊許可權，
  並且涉及到複雜的業務流程。
  服務賬號建立有意做得更輕量，允許叢集使用者為了具體的任務建立服務賬號 
  以遵從許可權最小化原則。
- 對人員和服務賬號審計所考慮的因素可能不同。
- 針對複雜系統的配置包可能包含系統元件相關的各種服務賬號的定義。因為服務賬號
  的建立約束不多並且有名字空間域的名稱，這種配置是很輕量的。

<!--
## Service account automation

Three separate components cooperate to implement the automation around service accounts:

- A `ServiceAccount` admission controller
- A Token controller
- A `ServiceAccount` controller
-->
## 服務賬號的自動化   {#service-account-automation}

三個獨立元件協作完成服務賬號相關的自動化：

- `ServiceAccount` 准入控制器
- Token 控制器
- `ServiceAccount` 控制器

<!--
### ServiceAccount Admission Controller

The modification of pods is implemented via a plugin
called an [Admission Controller](/docs/reference/access-authn-authz/admission-controllers/).
It is part of the API server.
It acts synchronously to modify pods as they are created or updated. When this plugin is active
(and it is by default on most distributions), then it does the following when a pod is created or modified:
-->
### ServiceAccount 准入控制器   {#serviceaccount-admission-controller}

對 Pod 的改動透過一個被稱為
[准入控制器](/zh-cn/docs/reference/access-authn-authz/admission-controllers/)
的外掛來實現。它是 API 伺服器的一部分。
當 Pod 被建立或更新時，它會同步地修改 Pod。
如果該外掛處於啟用狀態（在大多數發行版中都是預設啟用的），當 Pod 被建立
或更新時它會進行以下操作：

<!--
1. If the pod does not have a `ServiceAccount` set, it sets the `ServiceAccount` to `default`.
1. It ensures that the `ServiceAccount` referenced by the pod exists, and otherwise rejects it.
1. It adds a `volume` to the pod which contains a token for API access
   if neither the ServiceAccount `automountServiceAccountToken` nor the Pod's
   `automountServiceAccountToken` is set to `false`.
1. It adds a `volumeSource` to each container of the pod mounted at
   `/var/run/secrets/kubernetes.io/serviceaccount`, if the previous step has
   created a volume for ServiceAccount token.
1. If the pod does not contain any `ImagePullSecrets`, then `ImagePullSecrets` of the `ServiceAccount` are added to the pod.
-->
1. 如果該 Pod 沒有設定 `ServiceAccount`，將其 `ServiceAccount` 設為 `default`。
1. 保證 Pod 所引用的 `ServiceAccount` 確實存在，否則拒絕該 Pod。
1. 如果服務賬號的 `automountServiceAccountToken` 或 Pod 的
   `automountServiceAccountToken` 都未顯式設定為 `false`，則為 Pod 建立一個
   `volume`，在其中包含用來訪問 API 的令牌。
1. 如果前一步中為服務賬號令牌建立了卷，則為 Pod 中的每個容器新增一個
   `volumeSource`，掛載在其 `/var/run/secrets/kubernetes.io/serviceaccount`
   目錄下。
1. 如果 Pod 不包含 `imagePullSecrets` 設定，將 `ServiceAccount` 所引用
   的服務賬號中的 `imagePullSecrets` 資訊新增到 Pod 中。

<!--
#### Bound Service Account Token Volume
-->
#### 繫結的服務賬號令牌卷  {#bound-service-account-token-volume}

{{< feature-state for_k8s_version="v1.22" state="stable" >}}

<!--
The ServiceAccount admission controller will add the following projected volume instead of a Secret-based volume for the non-expiring service account token created by Token Controller.
-->
ServiceAccount 准入控制器將新增如下投射卷，而不是為令牌控制器
所生成的不過期的服務賬號令牌而建立的基於 Secret 的卷。

```yaml
- name: kube-api-access-<隨機字尾>
  projected:
    defaultMode: 420 # 0644
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
This projected volume consists of three sources:

1. A ServiceAccountToken acquired from kube-apiserver via TokenRequest API. It will expire after 1 hour by default or when the pod is deleted. It is bound to the pod and has kube-apiserver as the audience.
1. A ConfigMap containing a CA bundle used for verifying connections to the kube-apiserver. This feature depends on the `RootCAConfigMap` feature gate, which publishes a "kube-root-ca.crt" ConfigMap to every namespace. `RootCAConfigMap` feature gate is graduated to GA in 1.21 and default to true. (This feature will be removed from --feature-gate arg in 1.22).
1. A DownwardAPI that references the namespace of the pod.
-->
此投射卷有三個資料來源：

1. 透過 TokenRequest API 從 kube-apiserver 處獲得的 ServiceAccountToken。
   這一令牌預設會在一個小時之後或者 Pod 被刪除時過期。
   該令牌繫結到 Pod 例項上，並將 kube-apiserver 作為其受眾（audience）。
1. 包含用來驗證與 kube-apiserver 連線的 CA 證書包的 ConfigMap 物件。
   這一特性依賴於 `RootCAConfigMap` 特性門控。該特性被啟用時，
   控制面會公開一個名為 `kube-root-ca.crt` 的 ConfigMap 給所有名字空間。
   `RootCAConfigMap` 在 1.21 版本中進入 GA 狀態，預設被啟用，
   該特性門控會在 1.22 版本中從 `--feature-gate` 引數中刪除。
1. 引用 Pod 名字空間的一個 DownwardAPI。

<!--
See more details about [projected volumes](/docs/tasks/configure-pod-container/configure-projected-volume-storage/).
-->
參閱[投射卷](/zh-cn/docs/tasks/configure-pod-container/configure-projected-volume-storage/)
瞭解進一步的細節。

<!--
### Token Controller

TokenController runs as part of `kube-controller-manager`. It acts asynchronously. It:

- watches ServiceAccount creation and creates a corresponding
  ServiceAccount token Secret to allow API access.
- watches ServiceAccount deletion and deletes all corresponding ServiceAccount
  token Secrets.
- watches ServiceAccount token Secret addition, and ensures the referenced
  ServiceAccount exists, and adds a token to the Secret if needed.
- watches Secret deletion and removes a reference from the corresponding
  ServiceAccount if needed.
-->
### Token 控制器    {#token-controller}

TokenController 作為 `kube-controller-manager` 的一部分執行，以非同步的形式工作。
其職責包括：

- 監測 ServiceAccount 的建立並建立相應的服務賬號令牌 Secret 以允許訪問 API。
- 監測 ServiceAccount 的刪除並刪除所有相應的服務賬號令牌 Secret。
- 監測服務賬號令牌 Secret 的新增，保證相應的 ServiceAccount 存在，如有需要，
  向 Secret 中新增令牌。
- 監測服務賬號令牌 Secret 的刪除，如有需要，從相應的 ServiceAccount 中移除引用。

<!--
You must pass a service account private key file to the token controller in
the `kube-controller-manager` using the `--service-account-private-key-file`
flag. The private key is used to sign generated service account tokens.
Similarly, you must pass the corresponding public key to the `kube-apiserver`
using the `--service-account-key-file` flag. The public key will be used to
verify the tokens during authentication.
-->
你必須透過 `--service-account-private-key-file` 標誌為 `kube-controller-manager`
的令牌控制器傳入一個服務賬號私鑰檔案。該私鑰用於為所生成的服務賬號令牌簽名。
同樣地，你需要透過 `--service-account-key-file` 標誌將對應的公鑰通知給
kube-apiserver。公鑰用於在身份認證過程中校驗令牌。

<!--
#### To create additional API tokens

A controller loop ensures a Secret with an API token exists for each
ServiceAccount. To create additional API tokens for a ServiceAccount, create a
Secret of type `kubernetes.io/service-account-token` with an annotation
referencing the ServiceAccount, and the controller will update it with a
generated token:

Below is a sample configuration for such a Secret:
-->
#### 建立額外的 API 令牌   {#to-create-additional-api-tokens}

控制器中有專門的迴圈來保證每個 ServiceAccount 都存在對應的包含 API 令牌的 Secret。
當需要為 ServiceAccount 建立額外的 API 令牌時，可以建立一個型別為
`kubernetes.io/service-account-token` 的 Secret，並在其註解中引用對應的
ServiceAccount。控制器會生成令牌並更新該 Secret：

下面是這種 Secret 的一個示例配置：

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: mysecretname
  annotations:
    kubernetes.io/service-account.name: myserviceaccount
type: kubernetes.io/service-account-token
```

```shell
kubectl create -f ./secret.json
kubectl describe secret mysecretname
```

<!--
#### To delete/invalidate a ServiceAccount token Secret
-->
#### 刪除/廢止服務賬號令牌 Secret

```shell
kubectl delete secret mysecretname
```

<!--
### ServiceAccount controller

A ServiceAccount controller manages the ServiceAccounts inside namespaces, and
ensures a ServiceAccount named "default" exists in every active namespace.
-->
### 服務賬號控制器   {#serviceaccount-controller}

服務賬號控制器管理各名字空間下的 ServiceAccount 物件，並且保證每個活躍的
名字空間下存在一個名為 "default" 的 ServiceAccount。

