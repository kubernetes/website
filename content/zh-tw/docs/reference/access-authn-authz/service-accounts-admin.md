---
title: 管理服務賬號
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
**ServiceAccount** 爲 Pod 中運行的進程提供了一個身份。

Pod 內的進程可以使用其關聯服務賬號的身份，向集羣的 API 服務器進行身份認證。

<!--
For an introduction to service accounts, read [configure service accounts](/docs/tasks/configure-pod-container/configure-service-account/).

This task guide explains some of the concepts behind ServiceAccounts. The
guide also explains how to obtain or revoke tokens that represent
ServiceAccounts, and how to (optionally) bind a ServiceAccount's validity to
the lifetime of an API object.
-->
有關服務賬號的介紹，
請參閱[配置服務賬號](/zh-cn/docs/tasks/configure-pod-container/configure-service-account/)。

本任務指南闡述有關 ServiceAccount 的幾個概念。
本指南還講解如何獲取或撤銷代表 ServiceAccount 的令牌，
以及如何將 ServiceAccount 的有效期與某個 API 對象的生命期綁定（可選）。

<!-- body -->

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

<!--
To be able to follow these steps exactly, ensure you have a namespace named
`examplens`.
If you don't, create one by running:
-->
爲了能夠準確地跟隨這些步驟，確保你有一個名爲 `examplens` 的名字空間。
如果你沒有，運行以下命令創建一個名字空間：

```shell
kubectl create namespace examplens
```

<!--
## User accounts versus service accounts

Kubernetes distinguishes between the concept of a user account and a service account
for a number of reasons:
-->
## 用戶賬號與服務賬號  {#user-accounts-versus-service-accounts}

Kubernetes 區分用戶賬號和服務賬號的概念，主要基於以下原因：

<!--
- User accounts are for humans. Service accounts are for application processes,
  which (for Kubernetes) run in containers that are part of pods.
- User accounts are intended to be global: names must be unique across all
  namespaces of a cluster. No matter what namespace you look at, a particular
  username that represents a user represents the same user.
  In Kubernetes, service accounts are namespaced: two different namespaces can
  contain ServiceAccounts that have identical names.
-->
- 用戶賬號是針對人而言的。而服務賬號是針對運行在 Pod 中的應用進程而言的，
  在 Kubernetes 中這些進程運行在容器中，而容器是 Pod 的一部分。
- 用戶賬號是全局性的。其名稱在某集羣中的所有名字空間中必須是唯一的。
  無論你查看哪個名字空間，代表用戶的特定用戶名都代表着同一個用戶。
  在 Kubernetes 中，服務賬號是名字空間作用域的。
  兩個不同的名字空間可以包含具有相同名稱的 ServiceAccount。
<!--
- Typically, a cluster's user accounts might be synchronised from a corporate
  database, where new user account creation requires special privileges and is
  tied to complex business processes. By contrast, service account creation is
  intended to be more lightweight, allowing cluster users to create service accounts
  for specific tasks on demand. Separating ServiceAccount creation from the steps to
  onboard human users makes it easier for workloads to follow the principle of
  least privilege.
-->
- 通常情況下，集羣的用戶賬號可能會從企業數據庫進行同步，
  創建新用戶需要特殊權限，並且涉及到複雜的業務流程。
  服務賬號創建有意做得更輕量，允許集羣用戶爲了具體的任務按需創建服務賬號。
  將 ServiceAccount 的創建與新用戶註冊的步驟分離開來，
  使工作負載更易於遵從權限最小化原則。
<!--
- Auditing considerations for humans and service accounts may differ; the separation
  makes that easier to achieve.
- A configuration bundle for a complex system may include definition of various service
  accounts for components of that system. Because service accounts can be created
  without many constraints and have namespaced names, such configuration is
  usually portable.
-->
- 對人員和服務賬號審計所考慮的因素可能不同；這種分離更容易區分不同之處。
- 針對複雜系統的配置包可能包含系統組件相關的各種服務賬號的定義。
  因爲服務賬號的創建約束不多並且有名字空間域的名稱，所以這種配置通常是輕量的。

<!--
## Bound service account tokens
-->
## 綁定的服務賬號令牌  {#bound-service-account-tokens}

<!--
ServiceAccount tokens can be bound to API objects that exist in the kube-apiserver.
This can be used to tie the validity of a token to the existence of another API object.
Supported object types are as follows:

* Pod (used for projected volume mounts, see below)
* Secret (can be used to allow revoking a token by deleting the Secret)
* Node (can be used to auto-revoke a token when its Node is deleted; creating new node-bound tokens is GA in v1.33+)
-->
ServiceAccount 令牌可以被綁定到 kube-apiserver 中存在的 API 對象。
這可用於將令牌的有效性與另一個 API 對象的存在與否關聯起來。
支持的對象類型如下：

* Pod（用於投射卷的掛載，見下文）
* Secret（可用於允許通過刪除 Secret 來撤銷令牌）
* 節點（可以在其節點被刪除時自動撤銷令牌；創建新的與節點綁定的令牌在 v1.33+ 中是 GA 狀態）

<!--
When a token is bound to an object, the object's `metadata.name` and `metadata.uid` are
stored as extra 'private claims' in the issued JWT.

When a bound token is presented to the kube-apiserver, the service account authenticator
will extract and verify these claims.
If the referenced object or the ServiceAccount is pending deletion (for example, due to finalizers),
then for any instant that is 60 seconds (or more) after the `.metadata.deletionTimestamp` date,
authentication with that token would fail.
If the referenced object no longer exists (or its `metadata.uid` does not match),
the request will not be authenticated.
-->
當將令牌綁定到某對象時，該對象的 `metadata.name` 和 `metadata.uid`
將作爲額外的“私有聲明”存儲在所發佈的 JWT 中。

當將被綁定的令牌提供給 kube-apiserver 時，服務帳戶身份認證組件將提取並驗證這些聲明。
如果所引用的對象或 ServiceAccount 正處於刪除中（例如，由於 finalizer 的原因），
那麼在 `.metadata.deletionTimestamp` 時間戳之後的 60 秒（或更長時間）後的某一時刻，
使用該令牌進行身份認證將會失敗。
如果所引用的對象不再存在（或其 `metadata.uid` 不匹配），則請求將無法通過認證。

<!--
### Additional metadata in Pod bound tokens
-->
### Pod 綁定令牌中的附加元數據    {#additional-metadata-in-pod-bound-tokens}

{{< feature-state feature_gate_name="ServiceAccountTokenPodNodeInfo" >}}

<!--
When a service account token is bound to a Pod object, additional metadata is also
embedded into the token that indicates the value of the bound pod's `spec.nodeName` field,
and the uid of that Node, if available.

This node information is **not** verified by the kube-apiserver when the token is used for authentication.
It is included so integrators do not have to fetch Pod or Node API objects to check the associated Node name
and uid when inspecting a JWT.
-->
當服務帳戶令牌被綁定到某 Pod 對象時，一些額外的元數據也會被嵌入到令牌中，
包括所綁定 Pod 的 `spec.nodeName` 字段的值以及該節點的 uid（如果可用）。

當使用令牌進行身份認證時，kube-apiserver **不會**檢查此節點信息的合法性。
由於節點信息被包含在令牌內，所以集成商在檢查 JWT 時不必獲取 Pod 或 Node API 對象來檢查所關聯的 Node 名稱和 uid。

<!--
### Verifying and inspecting private claims

The TokenReview API can be used to verify and extract private claims from a token:
-->
### 查驗和檢視私有聲明   {#verifying-and-inspecting-private-claims}

TokenReview API 可用於校驗並從令牌中提取私有聲明：

<!--
1. First, assume you have a pod named `test-pod` and a service account named `my-sa`.
1. Create a token that is bound to this Pod:
-->
1. 首先，假設你有一個名爲 `test-pod` 的 Pod 和一個名爲 `my-sa` 的服務帳戶。
2. 創建綁定到此 Pod 的令牌：

   ```shell
   kubectl create token my-sa --bound-object-kind="Pod" --bound-object-name="test-pod"
   ```

<!--
1. Copy this token into a new file named `tokenreview.yaml`:

   ```yaml
   apiVersion: authentication.k8s.io/v1
   kind: TokenReview
   spec:
     token: <token from step 2>
   ```
-->
3. 將此令牌複製到名爲 `tokenreview.yaml` 的新文件中：

   ```yaml
   apiVersion: authentication.k8s.io/v1
   kind: TokenReview
   spec:
     token: <第 2 步獲取的令牌>
   ```

<!--
1. Submit this resource to the apiserver for review:

   ```shell
   # use '-o yaml' to inspect the output
   kubectl create -o yaml -f tokenreview.yaml
   ```

   You should see an output like below:
-->
4. 將此資源提交給 API 服務器進行審覈：

   ```shell
   # 使用 '-o yaml' 檢視命令輸出
   kubectl create -o yaml -f tokenreview.yaml
   ```

   你應該看到如下所示的輸出：

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
   儘管你使用了 `kubectl create -f` 來創建此資源，並與 Kubernetes
   中的其他資源類型類似的方式定義它，但 TokenReview 是一種特殊類別，
   kube-apiserver 實際上並不將 TokenReview 對象持久保存到 etcd 中。
   因此 `kubectl get tokenreview` 不是一個有效的命令。
   {{< /note >}}

<!--
#### Schema for service account private claims

The schema for the Kubernetes-specific claims within JWT tokens is not currently documented,
however the relevant code area can be found in
[the serviceaccount package](https://github.com/kubernetes/kubernetes/blob/d8919343526597e0788a1efe133c70d9a0c07f69/pkg/serviceaccount/claims.go#L56-L68)
in the Kubernetes codebase.
-->
#### 服務賬號私有聲明的模式

目前在 JWT 令牌中特定於 Kubernetes 的聲明模式尚未文檔化，但相關代碼段可以在 Kubernetes 代碼庫的
[serviceaccount 包](https://github.com/kubernetes/kubernetes/blob/d8919343526597e0788a1efe133c70d9a0c07f69/pkg/serviceaccount/claims.go#L56-L68)中找到。

<!--
You can inspect a JWT using standard JWT decoding tool. Below is an example of a JWT for the
`my-serviceaccount` ServiceAccount, bound to a Pod object named `my-pod` which is scheduled
to the Node `my-node`, in the `my-namespace` namespace:
-->
你可以使用標準的 JWT 解碼工具檢查 JWT。
下面是一個關於 `my-serviceaccount` 服務賬號的 JWT 示例，
該服務賬號綁定到了一個被調度到 `my-node` 節點、位於 `my-namespace` 命名空間中且名爲 `my-pod` 的 Pod 對象：

```json
{
  "aud": [
    "https://my-audience.example.com"
  ],
  "exp": 1729605240,
  "iat": 1729601640,
  "iss": "https://my-cluster.example.com",
  "jti": "aed34954-b33a-4142-b1ec-389d6bbb4936",
  "kubernetes.io": {
    "namespace": "my-namespace",
    "node": {
      "name": "my-node",
      "uid": "646e7c5e-32d6-4d42-9dbd-e504e6cbe6b1"
    },
    "pod": {
      "name": "my-pod",
      "uid": "5e0bd49b-f040-43b0-99b7-22765a53f7f3"
    },
    "serviceaccount": {
      "name": "my-serviceaccount",
      "uid": "14ee3fa4-a7e2-420f-9f9a-dbc4507c3798"
    }
  },
  "nbf": 1729601640,
  "sub": "system:serviceaccount:my-namespace:my-serviceaccount"
}
```

{{< note >}}
<!--
The `aud` and `iss` fields in this JWT may differ between different Kubernetes clusters depending
on your configuration.

The presence of both the `pod` and `node` claim implies that this token is bound
to a *Pod* object. When verifying Pod bound ServiceAccount tokens, the API server **does not**
verify the existence of the referenced Node object.
-->
此 JWT 中的 `aud` 和 `iss` 字段可能因你的配置而在不同的 Kubernetes 集羣之間有所差異。

同時存在 `pod` 和 `node` 聲明意味着此令牌被綁定到了 **Pod** 對象。
在驗證 Pod 綁定的服務賬號令牌時，API 服務器**不**驗證所引用的 Node 對象是否存在。
{{< /note >}}

<!--
Services that run outside of Kubernetes and want to perform offline validation of JWTs may
use this schema, along with a compliant JWT validator configured with OpenID Discovery information
from the API server, to verify presented JWTs without requiring use of the TokenReview API.
-->
在 Kubernetes 外部運行且想要對 JWT 進行離線校驗的服務可以使用此模式，
結合以 API 服務器的 OpenID Discovery 信息所配置的合規 JWT 校驗器，
可以在不需要使用 TokenReview API 的情況下驗證呈現的 JWT。

<!--
Services that verify JWTs in this way **do not verify** the claims embedded in the JWT token to be
current and still valid.
This means if the token is bound to an object, and that object no longer exists, the token will still
be considered valid (until the configured token expires).
-->
以這種方式驗證 JWT 的服務**不驗證**嵌入在 JWT 令牌中的聲明是否當前正使用且仍然有效。
這意味着如果令牌被綁定到某個對象，且該對象不再存在，此令牌仍將被視爲有效（直到配置的令牌過期）。

<!--
Clients that require assurance that a token's bound claims are still valid **MUST** use the TokenReview
API to present the token to the `kube-apiserver` for it to verify and expand the embedded claims, using
similar steps to the [Verifying and inspecting private claims](#verifying-and-inspecting-private-claims)
section above, but with a [supported client library](/docs/reference/using-api/client-libraries/).
For more information on JWTs and their structure, see the [JSON Web Token RFC](https://datatracker.ietf.org/doc/html/rfc7519).
-->
需要確保令牌的綁定聲明仍然有效的客戶端**必須**使用 TokenReview API 將令牌呈現給 `kube-apiserver`，
以便其驗證並擴展嵌入的聲明，具體步驟類似於上文所述的[驗證和檢查私有聲明](#verifying-and-inspecting-private-claims)，
但會使用[支持的客戶端庫](/zh-cn/docs/reference/using-api/client-libraries/)。
有關 JWT 及其結構的細節，參見 [JSON Web Token RFC](https://datatracker.ietf.org/doc/html/rfc7519)。

<!--
## Bound service account token volume mechanism {#bound-service-account-token-volume}
-->
## 綁定的服務賬號令牌卷機制  {#bound-service-account-token-volume}

{{< feature-state feature_gate_name="BoundServiceAccountTokenVolume" >}}

<!--
By default, the Kubernetes control plane (specifically, the
[ServiceAccount admission controller](#serviceaccount-admission-controller))
adds a [projected volume](/docs/concepts/storage/projected-volumes/) to Pods,
and this volume includes a token for Kubernetes API access.

Here's an example of how that looks for a launched Pod:
-->
默認情況下，Kubernetes 控制平面（特別是 [ServiceAccount 准入控制器](#serviceaccount-admission-controller)）
添加一個[投射卷](/zh-cn/docs/concepts/storage/projected-volumes/)到 Pod，
此捲包括了訪問 Kubernetes API 的令牌。

以下示例演示如何查找已啓動的 Pod：

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
  - name: kube-api-access-<隨機後綴>
    projected:
      sources:
        - serviceAccountToken:
            path: token # 必須與應用所預期的路徑匹配
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
該清單片段定義了由三個數據源組成的投射卷。在當前場景中，每個數據源也代表該卷內的一條獨立路徑。這三個數據源是：

1. `serviceAccountToken` 數據源，包含 kubelet 從 kube-apiserver 獲取的令牌。
   kubelet 使用 TokenRequest API 獲取有時間限制的令牌。爲 TokenRequest 服務的這個令牌會在
   Pod 被刪除或定義的生命週期（默認爲 1 小時）結束之後過期。該令牌綁定到特定的 Pod，
   並將其 audience（受衆）設置爲與 `kube-apiserver` 的 audience 相匹配。
   這種機制取代了之前基於 Secret 添加捲的機制，之前 Secret 代表了針對 Pod 的 ServiceAccount 但不會過期。
1. `configMap` 數據源。ConfigMap 包含一組證書頒發機構數據。
   Pod 可以使用這些證書來確保自己連接到集羣的 kube-apiserver（而不是連接到中間件或意外配置錯誤的對等點上）。
1. `downwardAPI` 數據源，用於查找包含 Pod 的名字空間的名稱，
   並使該名稱信息可用於在 Pod 內運行的應用程序代碼。

<!--
Any container within the Pod that mounts this particular volume can access the above information.
-->
Pod 內掛載這個特定卷的所有容器都可以訪問上述信息。

{{< note >}}
<!--
There is no specific mechanism to invalidate a token issued via TokenRequest. If you no longer
trust a bound service account token for a Pod, you can delete that Pod. Deleting a Pod expires
its bound service account tokens.
-->
沒有特定的機制可以使通過 TokenRequest 簽發的令牌無效。
如果你不再信任爲某個 Pod 綁定的服務賬號令牌，
你可以刪除該 Pod。刪除 Pod 將使其綁定的服務賬號令牌過期。
{{< /note >}}

<!--
## Manual Secret management for ServiceAccounts

Versions of Kubernetes before v1.22 automatically created credentials for accessing
the Kubernetes API. This older mechanism was based on creating token Secrets that
could then be mounted into running Pods.
-->
## 手動管理 ServiceAccount 的 Secret   {#manual-secret-management-for-serviceaccounts}

v1.22 之前的 Kubernetes 版本會自動創建憑據訪問 Kubernetes API。
這種更老的機制基於先創建令牌 Secret，然後將其掛載到正運行的 Pod 中。

<!--
In more recent versions, including Kubernetes v{{< skew currentVersion >}}, API credentials
are [obtained directly](#bound-service-account-token-volume) using the
[TokenRequest](/docs/reference/kubernetes-api/authentication-resources/token-request-v1/) API,
and are mounted into Pods using a projected volume.
The tokens obtained using this method have bounded lifetimes, and are automatically
invalidated when the Pod they are mounted into is deleted.
-->
在包括 Kubernetes v{{< skew currentVersion >}} 在內最近的幾個版本中，使用
[TokenRequest](/zh-cn/docs/reference/kubernetes-api/authentication-resources/token-request-v1/)
API [直接獲得](#bound-service-account-token-volume) API 憑據，
並使用投射卷掛載到 Pod 中。使用這種方法獲得的令牌具有綁定的生命週期，
當掛載的 Pod 被刪除時這些令牌將自動失效。

<!--
You can still [manually create](/docs/tasks/configure-pod-container/configure-service-account/#manually-create-an-api-token-for-a-serviceaccount)
a Secret to hold a service account token; for example, if you need a token that never expires.

Once you manually create a Secret and link it to a ServiceAccount,
the Kubernetes control plane automatically populates the token into that Secret.
-->
你仍然可以[手動創建](/zh-cn/docs/tasks/configure-pod-container/configure-service-account/#manually-create-an-api-token-for-a-serviceaccount)
Secret 來保存服務賬號令牌；例如在你需要一個永不過期的令牌的時候。

一旦你手動創建一個 Secret 並將其關聯到 ServiceAccount，
Kubernetes 控制平面就會自動將令牌填充到該 Secret 中。

{{< note >}}
<!--
Although the manual mechanism for creating a long-lived ServiceAccount token exists,
using [TokenRequest](/docs/reference/kubernetes-api/authentication-resources/token-request-v1/)
to obtain short-lived API access tokens is recommended instead.
-->
儘管存在手動創建長久 ServiceAccount 令牌的機制，但還是推薦使用
[TokenRequest](/zh-cn/docs/reference/kubernetes-api/authentication-resources/token-request-v1/)
獲得短期的 API 訪問令牌。
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
## 清理自動生成的傳統 ServiceAccount 令牌   {#auto-generated-legacy-serviceaccount-token-clean-up}

在 1.24 版本之前，Kubernetes 自動爲 ServiceAccount 生成基於 Secret 的令牌。
爲了區分自動生成的令牌和手動創建的令牌，Kubernetes 會檢查 ServiceAccount 的
Secret 字段是否有引用。如果該 Secret 被 `secrets` 字段引用，
它被視爲自動生成的傳統令牌。否則，它被視爲手動創建的傳統令牌。例如：

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
  - name: build-robot-secret # 對於手動生成的令牌通常不會存在此字段
```

<!--
Beginning from version 1.29, legacy ServiceAccount tokens that were generated
automatically will be marked as invalid if they remain unused for a certain
period of time (set to default at one year). Tokens that continue to be unused
for this defined period (again, by default, one year) will subsequently be
purged by the control plane.
-->
從 1.29 版本開始，如果傳統 ServiceAccount
令牌在一定時間段（默認設置爲一年）內未被使用，則會被標記爲無效。
在定義的時間段（同樣默認爲一年）持續未被使用的令牌將由控制平面自動清除。

<!--
If users use an invalidated auto-generated token, the token validator will

1. add an audit annotation for the key-value pair
  `authentication.k8s.io/legacy-token-invalidated: <secret name>/<namespace>`,
1. increment the `invalid_legacy_auto_token_uses_total` metric count,
1. update the Secret label `kubernetes.io/legacy-token-last-used` with the new
   date,
1. return an error indicating that the token has been invalidated.
-->
如果用戶使用一個無效的自動生成的令牌，令牌驗證器將執行以下操作：

1. 爲鍵值對 `authentication.k8s.io/legacy-token-invalidated: <secret name>/<namespace>`
  添加審計註解，
1. `invalid_legacy_auto_token_uses_total` 指標計數加一，
1. 更新 Secret 標籤 `kubernetes.io/legacy-token-last-used` 爲新日期，
1. 返回一個提示令牌已經無效的報錯。

<!--
When receiving this validation error, users can update the Secret to remove the
`kubernetes.io/legacy-token-invalid-since` label to temporarily allow use of
this token.

Here's an example of an auto-generated legacy token that has been marked with the
`kubernetes.io/legacy-token-last-used` and `kubernetes.io/legacy-token-invalid-since`
labels:
-->
當收到這個校驗報錯時，用戶可以通過移除 `kubernetes.io/legacy-token-invalid-since`
標籤更新 Secret，以臨時允許使用此令牌。

以下是一個自動生成的傳統令牌示例，它被標記了 `kubernetes.io/legacy-token-last-used`
和 `kubernetes.io/legacy-token-invalid-since` 標籤：

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
## 控制平面細節   {#control-plane-details}

### ServiceAccount 控制器   {#serviceaccount-controller}

ServiceAccount 控制器管理名字空間內的 ServiceAccount，
並確保每個活躍的名字空間中都存在名爲 `default` 的 ServiceAccount。

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

服務賬號令牌控制器作爲 `kube-controller-manager` 的一部分運行，以異步的形式工作。
其職責包括：

- 監測 ServiceAccount 的刪除並刪除所有相應的服務賬號令牌 Secret。
- 監測服務賬號令牌 Secret 的添加，保證相應的 ServiceAccount 存在，
  如有需要，向 Secret 中添加令牌。
- 監測服務賬號令牌 Secret 的刪除，如有需要，從相應的 ServiceAccount 中移除引用。

<!--
You must pass a service account private key file to the token controller in
the `kube-controller-manager` using the `--service-account-private-key-file`
flag. The private key is used to sign generated service account tokens.
Similarly, you must pass the corresponding public key to the `kube-apiserver`
using the `--service-account-key-file` flag. The public key will be used to
verify the tokens during authentication.
-->
你必須通過 `--service-account-private-key-file` 標誌爲
`kube-controller-manager`的令牌控制器傳入一個服務賬號私鑰文件。
該私鑰用於爲所生成的服務賬號令牌簽名。同樣地，你需要通過
`--service-account-key-file` 標誌將對應的公鑰通知給
kube-apiserver。公鑰用於在身份認證過程中校驗令牌。

{{< feature-state feature_gate_name="ExternalServiceAccountTokenSigner" >}}

<!--
An alternate setup to setting `--service-account-private-key-file` and `--service-account-key-file` flags is
to configure an external JWT signer for [external ServiceAccount token signing and key management](#external-serviceaccount-token-signing-and-key-management).
Note that these setups are mutually exclusive and cannot be configured together.
-->
設置 `--service-account-private-key-file` 和 `--service-account-key-file`
標誌的替代方案是配置一個外部 JWT 簽名程序，
用於[外部服務賬戶令牌簽名和密鑰管理](#external-serviceaccount-token-signing-and-key-management)。
請注意，這些設置是互斥的，不能同時配置。

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

對 Pod 的改動通過一個被稱爲[准入控制器](/zh-cn/docs/reference/access-authn-authz/admission-controllers/)的插件來實現。
它是 API 服務器的一部分。當 Pod 被創建時，該准入控制器會同步地修改 Pod。
如果該插件處於激活狀態（在大多數發行版中都是默認激活的），當 Pod 被創建時它會進行以下操作：

<!--
1. If the pod does not have a `.spec.serviceAccountName` set, the admission controller sets the name of the
   ServiceAccount for this incoming Pod to `default`.
1. The admission controller ensures that the ServiceAccount referenced by the incoming Pod exists. If there
   is no ServiceAccount with a matching name, the admission controller rejects the incoming Pod. That check
   applies even for the `default` ServiceAccount.
-->
1. 如果該 Pod 沒有設置 `.spec.serviceAccountName`，
   准入控制器爲新來的 Pod 將 ServiceAccount 的名稱設爲 `default`。
2. 准入控制器保證新來的 Pod 所引用的 ServiceAccount 確實存在。
   如果沒有 ServiceAccount 具有匹配的名稱，則准入控制器拒絕新來的 Pod。
   這個檢查甚至適用於 `default` ServiceAccount。
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
3. 如果服務賬號的 `automountServiceAccountToken` 字段或 Pod 的
   `automountServiceAccountToken` 字段都未顯式設置爲 `false`：
   - 准入控制器變更新來的 Pod，添加一個包含 API
     訪問令牌的額外{{< glossary_tooltip text="卷" term_id="volume" >}}。
   - 准入控制器將 `volumeMount` 添加到 Pod 中的每個容器，
     忽略已爲 `/var/run/secrets/kubernetes.io/serviceaccount` 路徑定義的卷掛載的所有容器。
     對於 Linux 容器，此卷掛載在 `/var/run/secrets/kubernetes.io/serviceaccount`；
     在 Windows 節點上，此卷掛載在等價的路徑上。
4. 如果新來 Pod 的規約不包含任何 `imagePullSecrets`，則准入控制器添加 `imagePullSecrets`，
   並從 `ServiceAccount` 進行復制。

<!--
### Legacy ServiceAccount token tracking controller
-->
### 傳統 ServiceAccount 令牌追蹤控制器   {#legacy-serviceaccount-token-tracking-controller}

{{< feature-state feature_gate_name="LegacyServiceAccountTokenTracking" >}}

<!--
This controller generates a ConfigMap called
`kube-system/kube-apiserver-legacy-service-account-token-tracking` in the
`kube-system` namespace. The ConfigMap records the timestamp when legacy service
account tokens began to be monitored by the system.
-->
此控制器在 `kube-system` 命名空間中生成名爲
`kube-apiserver-legacy-service-account-token-tracking` 的 ConfigMap。
這個 ConfigMap 記錄了系統開始監視傳統服務賬號令牌的時間戳。

<!--
### Legacy ServiceAccount token cleaner
-->
### 傳統 ServiceAccount 令牌清理器   {#legacy-serviceaccount-token-cleaner}

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
傳統 ServiceAccount 令牌清理器作爲 `kube-controller-manager` 的一部分運行，
每 24 小時檢查一次，查看是否有任何自動生成的傳統 ServiceAccount
令牌在**特定時間段**內未被使用。如果有的話，清理器會將這些令牌標記爲無效。

清理器的工作方式是首先檢查控制平面創建的 ConfigMap（前提是啓用了
`LegacyServiceAccountTokenTracking`）。如果當前時間是 ConfigMap
所包含日期之後的**特定時間段**，清理器會遍歷集羣中的 Secret 列表，
並評估每個類型爲 `kubernetes.io/service-account-token` 的 Secret。

<!--
If a Secret meets all of the following conditions, the cleaner marks it as
invalid:

- The Secret is auto-generated, meaning that it is bi-directionally referenced
  by a ServiceAccount.
- The Secret is not currently mounted by any pods.
- The Secret has not been used in a *specified amount of time* since it was
  created or since it was last used.
-->
如果一個 Secret 滿足以下所有條件，清理器會將其標記爲無效：

- Secret 是自動生成的，意味着它被 ServiceAccount 雙向引用。
- Secret 當前沒有被任何 Pod 掛載。
- Secret 自從創建或上次使用以來的**特定時間段**未被使用過。

<!--
The cleaner marks a Secret invalid by adding a label called
`kubernetes.io/legacy-token-invalid-since` to the Secret, with the current date
as the value. If an invalid Secret is not used in a *specified amount of time*,
the cleaner will delete it.
-->
清理器通過向 Secret 添加名爲 `kubernetes.io/legacy-token-invalid-since` 的標籤，
並將此值設置爲當前日期，來標記 Secret 爲無效。
如果一個無效的 Secret 在**特定時間段**內未被使用，清理器將會刪除它。

{{< note >}}
<!--
All the *specified amount of time* above defaults to one year. The cluster
administrator can configure this value through the
`--legacy-service-account-token-clean-up-period` command line argument for the
`kube-controller-manager` component.
-->
上述所有的**特定時間段**都默認爲一年。集羣管理員可以通過 `kube-controller-manager`
組件的 `--legacy-service-account-token-clean-up-period` 命令行參數來配置此值。
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
子資源爲該 ServiceAccount 獲取有時間限制的令牌。
你不需要調用它來獲取在容器中使用的 API 令牌，
因爲 kubelet 使用**投射卷**對此進行了設置。

如果你想要從 `kubectl` 使用 TokenRequest API，
請參閱[爲 ServiceAccount 手動創建 API 令牌](/zh-cn/docs/tasks/configure-pod-container/configure-service-account/#manually-create-an-api-token-for-a-serviceaccount)。

<!--
The Kubernetes control plane (specifically, the ServiceAccount admission controller)
adds a projected volume to Pods, and the kubelet ensures that this volume contains a token
that lets containers authenticate as the right ServiceAccount.

(This mechanism superseded an earlier mechanism that added a volume based on a Secret,
where the Secret represented the ServiceAccount for the Pod but did not expire.)

Here's an example of how that looks for a launched Pod:
-->
Kubernetes 控制平面（特別是 ServiceAccount 准入控制器）向 Pod 添加了一個投射卷，
kubelet 確保該捲包含允許容器作爲正確 ServiceAccount 進行身份認證的令牌。

（這種機制取代了之前基於 Secret 添加捲的機制，之前 Secret 代表了 Pod 所用的 ServiceAccount 但不會過期。）

以下示例演示如何查找已啓動的 Pod：

<!--
# decimal equivalent of octal 0644
-->
```yaml
...
  - name: kube-api-access-<random-suffix>
    projected:
      defaultMode: 420 # 這個十進制數等同於八進制 0644
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
   The token is bound to the specific Pod and has the kube-apiserver as its audience.
1. A `configMap` source. The ConfigMap contains a bundle of certificate authority data. Pods can use these
   certificates to make sure that they are connecting to your cluster's kube-apiserver (and not to a middlebox
   or an accidentally misconfigured peer).
1. A `downwardAPI` source. This `downwardAPI` volume makes the name of the namespace containing the Pod available
   to application code running inside the Pod.
-->
該清單片段定義了由三個數據源信息組成的投射卷。

1. `serviceAccountToken` 數據源，包含 kubelet 從 kube-apiserver 獲取的令牌。
   kubelet 使用 TokenRequest API 獲取有時間限制的令牌。爲 TokenRequest 服務的這個令牌會在
   Pod 被刪除或定義的生命週期（默認爲 1 小時）結束之後過期。在令牌過期之前，kubelet 還會刷新該令牌。
   該令牌綁定到特定的 Pod，並將其 audience（受衆）設置爲與 `kube-apiserver` 的 audience 相匹配。
1. `configMap` 數據源。ConfigMap 包含一組證書頒發機構數據。
   Pod 可以使用這些證書來確保自己連接到集羣的 kube-apiserver（而不是連接到中間件或意外配置錯誤的對等點上）。
1. `downwardAPI` 數據源。這個 `downwardAPI` 卷獲得包含 Pod 的名字空間的名稱，
   並使該名稱信息可用於在 Pod 內運行的應用程序代碼。

<!--
Any container within the Pod that mounts this volume can access the above information.

## Create additional API tokens {#create-token}
-->
掛載此卷的 Pod 內的所有容器均可以訪問上述信息。

## 創建額外的 API 令牌   {#create-token}

{{< caution >}}
<!--
Only create long-lived API tokens if the [token request](#tokenrequest-api) mechanism
is not suitable. The token request mechanism provides time-limited tokens; because these
expire, they represent a lower risk to information security.
-->
只有[令牌請求](#tokenrequest-api)機制不合適，才需要創建長久的 API 令牌。
令牌請求機制提供有時間限制的令牌；因爲隨着這些令牌過期，它們對信息安全方面的風險也會降低。
{{< /caution >}}

<!--
To create a non-expiring, persisted API token for a ServiceAccount, create a
Secret of type `kubernetes.io/service-account-token` with an annotation
referencing the ServiceAccount. The control plane then generates a long-lived token and
updates that Secret with that generated token data.

Here is a sample manifest for such a Secret:
-->
要爲 ServiceAccount 創建一個不過期、持久化的 API 令牌，
請創建一個類型爲 `kubernetes.io/service-account-token` 的 Secret，
附帶引用 ServiceAccount 的註解。控制平面隨後生成一個長久的令牌，
並使用生成的令牌數據更新該 Secret。

以下是此類 Secret 的示例清單：

{{% code_sample file="secret/serviceaccount/mysecretname.yaml" %}}

<!--
To create a Secret based on this example, run:
-->
若要基於此示例創建 Secret，運行以下命令：

```shell
kubectl -n examplens create -f https://k8s.io/examples/secret/serviceaccount/mysecretname.yaml
```

<!--
To see the details for that Secret, run:
-->
若要查看該 Secret 的詳細信息，運行以下命令：

```shell
kubectl -n examplens describe secret mysecretname
```

<!--
The output is similar to:
-->
輸出類似於：

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
如果你在 `examplens` 名字空間中啓動一個新的 Pod，它可以使用你剛剛創建的
`myserviceaccount` service-account-token Secret。

{{< caution >}}
<!--
Do not reference manually created Secrets in the `secrets` field of a
ServiceAccount. Or the manually created Secrets will be cleaned if it is not used for a long
time. Please refer to [auto-generated legacy ServiceAccount token clean up](#auto-generated-legacy-serviceaccount-token-clean-up).
-->
不要在 ServiceAccount 的 `secrets` 字段中引用手動創建的 Secret。
否則，如果這些手動創建的 Secret 長時間未被使用將會被清理掉。
請參考[清理自動生成的傳統 ServiceAccount 令牌](#auto-generated-legacy-serviceaccount-token-clean-up)。
{{< /caution >}}

<!--
## Delete/invalidate a ServiceAccount token {#delete-token}

If you know the name of the Secret that contains the token you want to remove:
-->
## 刪除/廢止 ServiceAccount 令牌   {#delete-token}

如果你知道 Secret 的名稱且該 Secret 包含要移除的令牌：

```shell
kubectl delete secret name-of-secret
```

<!--
Otherwise, first find the Secret for the ServiceAccount.
-->
否則，先找到 ServiceAccount 所用的 Secret。

<!--
# This assumes that you already have a namespace named 'examplens'
-->
```shell
# 此處假設你已有一個名爲 'examplens' 的名字空間
kubectl -n examplens get serviceaccount/example-automated-thing -o yaml
```

<!--
The output is similar to:
-->
輸出類似於：

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
隨後刪除你現在知道名稱的 Secret：

```shell
kubectl -n examplens delete secret/example-automated-thing-token-zyxwv
```

<!--
## External ServiceAccount token signing and key management
-->
## 外部 ServiceAccount 令牌簽名和密鑰管理    {#external-serviceaccount-token-signing-and-key-management}

{{< feature-state feature_gate_name="ExternalServiceAccountTokenSigner" >}}

<!--
The kube-apiserver can be configured to use external signer for token signing and token verifying key management.
This feature enables kubernetes distributions to integrate with key management solutions of their choice
(for example, HSMs, cloud KMSes) for service account credential signing and verification.
To configure kube-apiserver to use external-jwt-signer set the `--service-account-signing-endpoint` flag
to the location of a Unix domain socket (UDS) on a filesystem, or be prefixed with an @ symbol and name
a UDS in the abstract socket namespace. At the configured UDS, shall be an RPC server which implements
[ExternalJWTSigner](https://github.com/kubernetes/kubernetes/blob/release-1.32/staging/src/k8s.io/externaljwt/apis/v1alpha1/api.proto).
The external-jwt-signer must be healthy and be ready to serve supported service account keys for the kube-apiserver to start.
-->
kube-apiserver 可以被配置爲使用外部簽名程序進行令牌簽名和令牌驗證密鑰管理。
此特性允許各種 Kubernetes 發行版集成自己選擇的密鑰管理解決方案（例如 HSM、雲上 KMS）來進行服務賬戶憑證簽名和驗證。
要配置 kube-apiserver 使用 external-jwt-signer，將 `--service-account-signing-endpoint`
標誌設置爲文件系統上 Unix 域套接字 (UDS) 所在的位置，或者以 @ 符號開頭並在抽象套接字命名空間中命名 UDS。
在配置的 UDS 上，需要有一個實現
[ExternalJWTSigner](https://github.com/kubernetes/kubernetes/blob/release-1.32/staging/src/k8s.io/externaljwt/apis/v1alpha1/api.proto)
的 RPC 服務器。external-jwt-signer 必須處於健康狀態，並準備好爲 kube-apiserver 啓動提供支持的服務賬戶密鑰。

<!--
Check out [KEP-740](https://github.com/kubernetes/enhancements/tree/master/keps/sig-auth/740-service-account-external-signing)
for more details on ExternalJWTSigner.
-->
有關 ExternalJWTSigner 的細節，查閱
[KEP-740](https://github.com/kubernetes/enhancements/tree/master/keps/sig-auth/740-service-account-external-signing)。

{{< note >}}
<!--
The kube-apiserver flags `--service-account-key-file` and `--service-account-signing-key-file` will continue
to be used for reading from files unless `--service-account-signing-endpoint` is set; they are mutually
exclusive ways of supporting JWT signing and authentication.
-->
kube-apiserver 的 `--service-account-key-file` 和 `--service-account-signing-key-file`
標誌將繼續被用於從文件中讀取，除非設置了 `--service-account-signing-endpoint`；
它們在支持 JWT 簽名和身份驗證方面是互斥的。
{{< /note >}}

<!--
## Clean up

If you created a namespace `examplens` to experiment with, you can remove it:
-->
## 清理    {#clean-up}

如果創建了一個 `examplens` 名字空間進行試驗，你可以移除它：

```shell
kubectl delete namespace examplens
```

## {{% heading "whatsnext" %}}

<!--
- Read more details about [projected volumes](/docs/concepts/storage/projected-volumes/).
-->
- 查閱有關[投射卷](/zh-cn/docs/concepts/storage/projected-volumes/)的更多細節。
