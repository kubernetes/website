---
title: 爲 Pod 設定服務賬號
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
Kubernetes 提供兩種完全不同的方式來爲客戶端提供支持，這些客戶端可能運行在你的叢集中，
也可能與你的叢集的{{< glossary_tooltip text="控制面" term_id="control-plane" >}}相關，
需要向 {{< glossary_tooltip text="API 伺服器" term_id="kube-apiserver" >}}完成身份認證。

<!--
A _service account_ provides an identity for processes that run in a Pod,
and maps to a ServiceAccount object. When you authenticate to the API
server, you identify yourself as a particular _user_. Kubernetes recognises
the concept of a user, however, Kubernetes itself does **not** have a User
API.
-->
**服務賬號（Service Account）** 爲 Pod 中運行的進程提供身份標識，
並映射到 ServiceAccount 對象。當你向 API 伺服器執行身份認證時，
你會將自己標識爲某個**使用者（User）**。Kubernetes 能夠識別使用者的概念，
但是 Kubernetes 自身**並不**提供 User API。

<!--
This task guide is about ServiceAccounts, which do exist in the Kubernetes
API. The guide shows you some ways to configure ServiceAccounts for Pods.
-->
本服務是關於 ServiceAccount 的，而 ServiceAccount 則確實存在於 Kubernetes 的 API 中。
本指南爲你展示爲 Pod 設定 ServiceAccount 的一些方法。

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
## 使用預設的服務賬號訪問 API 伺服器   {#use-the-default-service-account-to-access-the-api-server}

當 Pod 與 API 伺服器聯繫時，Pod 會被認證爲某個特定的 ServiceAccount（例如：`default`）。
在每個{{< glossary_tooltip text="名字空間" term_id="namespace" >}}中，至少存在一個
ServiceAccount。

每個 Kubernetes 名字空間至少包含一個 ServiceAccount：也就是該名字空間的預設服務賬號，
名爲 `default`。如果你在創建 Pod 時沒有指定 ServiceAccount，Kubernetes 會自動將該名字空間中名爲
`default` 的 ServiceAccount 分配給該 Pod。

你可以檢視你剛剛創建的 Pod 的細節。例如：

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
在輸出中，你可以看到字段 `spec.serviceAccountName`。當你在創建 Pod 時未設置該字段時，
Kubernetes 自動爲 Pod 設置這一屬性的取值。

Pod 中運行的應用可以使用這一自動掛載的服務賬號憑據來訪問 Kubernetes API。
參閱[訪問叢集](/zh-cn/docs/tasks/access-application-cluster/access-cluster/)以進一步瞭解。

<!--
When a Pod authenticates as a ServiceAccount, its level of access depends on the
[authorization plugin and policy](/docs/reference/access-authn-authz/authorization/#authorization-modules)
in use.
-->
當 Pod 被身份認證爲某個 ServiceAccount 時，
其訪問能力取決於所使用的[鑑權插件和策略](/zh-cn/docs/reference/access-authn-authz/authorization/#authorization-modules)。

<!--
The API credentials are automatically revoked when the Pod is deleted, even if
finalizers are in place. In particular, the API credentials are revoked 60 seconds
beyond the `.metadata.deletionTimestamp` set on the Pod (the deletion timestamp
is typically the time that the **delete** request was accepted plus the Pod's
termination grace period).
-->
當 Pod 被刪除時，即使設置了終結器，API 憑據也會自動失效。
需要額外注意的是，API 憑據會在 Pod 上設置的 `.metadata.deletionTimestamp` 之後的 60 秒內失效
（刪除時間戳通常是 **delete** 請求被接受的時間加上 Pod 的終止寬限期）。

<!--
### Opt out of API credential automounting

If you don't want the {{< glossary_tooltip text="kubelet" term_id="kubelet" >}}
to automatically mount a ServiceAccount's API credentials, you can opt out of
the default behavior.
You can opt out of automounting API credentials on `/var/run/secrets/kubernetes.io/serviceaccount/token`
for a service account by setting `automountServiceAccountToken: false` on the ServiceAccount:

For example:
-->
### 放棄 API 憑據的自動掛載   {#opt-out-of-api-credential-automounting}

如果你不希望 {{< glossary_tooltip text="kubelet" term_id="kubelet" >}} 自動掛載某
ServiceAccount 的 API 訪問憑據，你可以選擇不採用這一預設行爲。
通過在 ServiceAccount 對象上設置 `automountServiceAccountToken: false`，可以放棄在
`/var/run/secrets/kubernetes.io/serviceaccount/token` 處自動掛載該服務賬號的 API 憑據。

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
你也可以選擇不給特定 Pod 自動掛載 API 憑據：

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
如果 ServiceAccount 和 Pod 的 `.spec` 都設置了 `automountServiceAccountToken` 值，
則 Pod 上 spec 的設置優先於服務賬號的設置。

<!--
## Use more than one ServiceAccount {#use-multiple-service-accounts}

Every namespace has at least one ServiceAccount: the default ServiceAccount
resource, called `default`. You can list all ServiceAccount resources in your
[current namespace](/docs/concepts/overview/working-with-objects/namespaces/#setting-the-namespace-preference)
with:
-->
## 使用多個服務賬號   {#use-multiple-service-accounts}

每個名字空間都至少有一個 ServiceAccount：名爲 `default` 的預設 ServiceAccount 資源。
你可以用下面的命令列舉你[當前名字空間](/zh-cn/docs/concepts/overview/working-with-objects/namespaces/#setting-the-namespace-preference)
中的所有 ServiceAccount 資源：

```shell
kubectl get serviceaccounts
```

<!--
The output is similar to this:
-->
輸出類似於：

```
NAME      SECRETS    AGE
default   1          1d
```

<!--
You can create additional ServiceAccount objects like this:
-->
你可以像這樣來創建額外的 ServiceAccount 對象：

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
ServiceAccount 對象的名字必須是一個有效的
[DNS 子域名](/zh-cn/docs/concepts/overview/working-with-objects/names#dns-subdomain-names)。

<!--
If you get a complete dump of the service account object, like this:
-->
如果你查詢服務賬號對象的完整資訊，如下所示：

```shell
kubectl get serviceaccounts/build-robot -o yaml
```

<!--
The output is similar to this:
-->
輸出類似於：

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
你可以使用鑑權插件來[設置服務賬號的訪問許可](/zh-cn/docs/reference/access-authn-authz/rbac/#service-account-permissions)。

要使用非預設的服務賬號，將 Pod 的 `spec.serviceAccountName` 字段設置爲你想用的服務賬號名稱。

<!--
You can only set the `serviceAccountName` field when creating a Pod, or in a
template for a new Pod. You cannot update the `.spec.serviceAccountName` field
of a Pod that already exists.
-->
只能在創建 Pod 時或者爲新 Pod 指定模板時，你纔可以設置 `serviceAccountName`。
你不能更新已經存在的 Pod 的 `.spec.serviceAccountName` 字段。

{{< note >}}
<!--
The `.spec.serviceAccount` field is a deprecated alias for `.spec.serviceAccountName`.
If you want to remove the fields from a workload resource, set both fields to empty explicitly
on the [pod template](/docs/concepts/workloads/pods#pod-templates).
-->
`.spec.serviceAccount` 字段是 `.spec.serviceAccountName` 的已棄用別名。
如果要從工作負載資源中刪除這些字段，請在
[Pod 模板](/zh-cn/docs/concepts/workloads/pods#pod-templates)上將這兩個字段顯式設置爲空。
{{< /note >}}

<!--
### Cleanup {#cleanup-use-multiple-service-accounts}

If you tried creating `build-robot` ServiceAccount from the example above,
you can clean it up by running:
-->
### 清理  {#cleanup-use-multiple-service-accounts}

如果你嘗試了創建前文示例中所給的 `build-robot` ServiceAccount，
你可以通過運行下面的命令來完成清理操作：

```shell
kubectl delete serviceaccount/build-robot
```

<!--
## Manually create an API token for a ServiceAccount

Suppose you have an existing service account named "build-robot" as mentioned earlier.

You can get a time-limited API token for that ServiceAccount using `kubectl`:
-->
## 手動爲 ServiceAccount 創建 API 令牌 {#manually-create-an-api-token-for-a-serviceaccount}

假設你已經有了一個前文所提到的名爲 "build-robot" 的服務賬號。
你可以使用 `kubectl` 爲該 ServiceAccount 獲得一個有時限的 API 令牌：

```shell
kubectl create token build-robot
```

<!--
The output from that command is a token that you can use to authenticate as that
ServiceAccount. You can request a specific token duration using the `--duration`
command line argument to `kubectl create token` (the actual duration of the issued
token might be shorter, or could even be longer).
-->
這一命令的輸出是一個令牌，你可以使用該令牌來將身份認證爲對應的 ServiceAccount。
你可以使用 `kubectl create token` 命令的 `--duration` 參數來請求特定的令牌有效期
（實際簽發的令牌的有效期可能會稍短一些，也可能會稍長一些）。

{{< feature-state feature_gate_name="ServiceAccountTokenNodeBinding" >}}

<!--
Using `kubectl` v1.31 or later, it is possible to create a service
account token that is directly bound to a Node:
-->
使用 kubectl v1.31 或更高版本，可以創建一個直接綁定到 Node 的服務賬號令牌：

```shell
kubectl create token build-robot --bound-object-kind Node --bound-object-name node-001 --bound-object-uid 123...456
```

<!--
The token will be valid until it expires or either the associated Node or service account are deleted.
-->
此令牌將有效直至其過期或關聯的 Node 或服務賬戶被刪除。

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
Kubernetes 在 v1.22 版本之前自動創建用來訪問 Kubernetes API 的長期憑據。
這一較老的機制是基於創建令牌 Secret 對象來實現的，Secret 對象可被掛載到運行中的 Pod 內。
在最近的版本中，包括 Kubernetes v{{< skew currentVersion >}}，API 憑據可以直接使用
[TokenRequest](/zh-cn/docs/reference/kubernetes-api/authentication-resources/token-request-v1/) API
來獲得，並使用一個[投射卷](/zh-cn/docs/reference/access-authn-authz/service-accounts-admin/#bound-service-account-token-volume)掛載到
Pod 中。使用此方法獲得的令牌具有受限的生命期長度，並且能夠在掛載它們的 Pod
被刪除時自動被廢棄。

<!--
You can still manually create a service account token Secret; for example,
if you need a token that never expires. However, using the
[TokenRequest](/docs/reference/kubernetes-api/authentication-resources/token-request-v1/)
subresource to obtain a token to access the API is recommended instead.
-->
你仍然可以通過手動方式來創建服務賬號令牌 Secret 對象，例如你需要一個永遠不過期的令牌時。
不過，使用 [TokenRequest](/zh-cn/docs/reference/kubernetes-api/authentication-resources/token-request-v1/)
子資源來獲得訪問 API 的令牌的做法仍然是推薦的方式。
{{< /note >}}

<!--
### Manually create a long-lived API token for a ServiceAccount

If you want to obtain an API token for a ServiceAccount, you create a new Secret
with a special annotation, `kubernetes.io/service-account.name`.
-->
### 手動爲 ServiceAccount 創建長期有效的 API 令牌 {#manually-create-a-long-lived-api-token-for-a-serviceaccount}

如果你需要爲 ServiceAccount 獲得一個 API 令牌，你可以創建一個新的、帶有特殊註解
`kubernetes.io/service-account.name` 的 Secret 對象。

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
如果你通過下面的命令來查看 Secret：

```shell
kubectl get secret/build-robot-secret -o yaml
```

<!--
you can see that the Secret now contains an API token for the "build-robot" ServiceAccount.

Because of the annotation you set, the control plane automatically generates a token for that
ServiceAccounts, and stores them into the associated Secret. The control plane also cleans up
tokens for deleted ServiceAccounts.
-->
你可以看到 Secret 中現在包含針對 "build-robot" ServiceAccount 的 API 令牌。

鑑於你所設置的註解，控制面會自動爲該 ServiceAccount 生成一個令牌，並將其保存到相關的 Secret
中。控制面也會爲已刪除的 ServiceAccount 執行令牌清理操作。

```shell
kubectl describe secrets/build-robot-secret
```

<!--
The output is similar to this:
-->
輸出類似於這樣：

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
這裏將 `token` 的內容省略了。

注意在你的終端或者計算機屏幕可能被旁觀者看到的場合，不要顯示
`kubernetes.io/service-account-token` 的內容。
{{< /note >}}

<!--
When you delete a ServiceAccount that has an associated Secret, the Kubernetes
control plane automatically cleans up the long-lived token from that Secret.
-->
當你刪除一個與某 Secret 相關聯的 ServiceAccount 時，Kubernetes 的控制面會自動清理該
Secret 中長期有效的令牌。

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

在 ServiceAccount API 對象中看不到 `build-robot-secret` Secret，
[`.secrets`](/zh-cn/docs/reference/kubernetes-api/authentication-resources/service-account-v1/) 字段，
因爲該字段只會填充自動生成的 Secret。
{{< /note >}}
<!--
## Add ImagePullSecrets to a service account

First, [create an imagePullSecret](/docs/concepts/containers/images/#specifying-imagepullsecrets-on-a-pod).
Next, verify it has been created. For example:
-->
## 爲服務賬號添加 ImagePullSecrets    {#add-imagepullsecrets-to-a-service-account}

首先，[生成一個 imagePullSecret](/zh-cn/docs/concepts/containers/images/#specifying-imagepullsecrets-on-a-pod)；
接下來，驗證該 Secret 已被創建。例如：

<!--
- Create an imagePullSecret, as described in
  [Specifying ImagePullSecrets on a Pod](/docs/concepts/containers/images/#specifying-imagepullsecrets-on-a-pod).
-->
- 按[爲 Pod 設置 imagePullSecret](/zh-cn/docs/concepts/containers/images/#specifying-imagepullsecrets-on-a-pod)
  所描述的，生成一個映像檔拉取 Secret：

  ```shell
  kubectl create secret docker-registry myregistrykey --docker-server=<registry name> \
          --docker-username=DUMMY_USERNAME --docker-password=DUMMY_DOCKER_PASSWORD \
          --docker-email=DUMMY_DOCKER_EMAIL
  ```

<!--
- Verify it has been created.
-->
- 檢查該 Secret 已經被創建。

  ```shell
  kubectl get secrets myregistrykey
  ```

  <!--
  The output is similar to this:
  -->
  輸出類似於這樣：

  ```
  NAME             TYPE                              DATA    AGE
  myregistrykey    kubernetes.io/.dockerconfigjson   1       1d
  ```

<!--
### Add image pull secret to service account

Next, modify the default service account for the namespace to use this Secret as an imagePullSecret.
-->
### 將映像檔拉取 Secret 添加到服務賬號   {#add-image-pull-secret-to-service-account}

接下來更改名字空間的預設服務賬號，將該 Secret 用作 imagePullSecret。

```shell
kubectl patch serviceaccount default -p '{"imagePullSecrets": [{"name": "myregistrykey"}]}'
```

<!--
You can achieve the same outcome by editing the object manually:
-->
你也可以通過手動編輯該對象來實現同樣的效果：

```shell
kubectl edit serviceaccount/default
```

<!--
The output of the `sa.yaml` file is similar to this:
-->
`sa.yaml` 檔案的輸出類似於：

<!--
Your selected text editor will open with a configuration looking something like this:
-->
你所選擇的文本編輯器會被打開，展示如下所示的設定：

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
使用你的編輯器，刪掉包含 `resourceVersion` 主鍵的行，添加包含 `imagePullSecrets:`
的行並保存檔案。對於 `uid` 而言，保持其取值與你讀到的值一樣。

當你完成這些變更之後，所編輯的 ServiceAccount 看起來像是這樣：

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
### 檢查 imagePullSecrets 已經被設置到新 Pod 上  {#verify-that-imagepullsecrets-are-set-for-new-pods}

現在，在當前名字空間中創建新 Pod 並使用預設 ServiceAccount 時，
新 Pod 的 `spec.imagePullSecrets` 會被自動設置。

```shell
kubectl run nginx --image=<registry name>/nginx --restart=Never
kubectl get pod nginx -o=jsonpath='{.spec.imagePullSecrets[0].name}{"\n"}'
```

<!--
The output is:
-->
輸出爲：

```
myregistrykey
```

<!--
## ServiceAccount token volume projection
-->
## 服務賬號令牌卷投射   {#serviceaccount-token-volume-projection}

{{< feature-state for_k8s_version="v1.20" state="stable" >}}

{{< note >}}
<!--
To enable and use token request projection, you must specify each of the following
command line arguments to `kube-apiserver`:
-->
爲了啓用令牌請求投射，你必須爲 `kube-apiserver` 設置以下命令列參數：

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
: 定義服務賬號令牌發放者的身份標識（Identifier）。你可以多次指定
  `--service-account-issuer` 參數，對於需要變更發放者而又不想帶來業務中斷的場景，
  這樣做是有用的。如果這個參數被多次指定，其第一個參數值會被用來生成令牌，
  而所有參數值都會被用來確定哪些發放者是可接受的。你所運行的 Kubernetes
  叢集必須是 v1.22 或更高版本才能多次指定 `--service-account-issuer`。

<!--
`--service-account-key-file`
: specifies the path to a file containing PEM-encoded X.509 private or public keys
  (RSA or ECDSA), used to verify ServiceAccount tokens. The specified file can contain
  multiple keys, and the flag can be specified multiple times with different files.
  If specified multiple times, tokens signed by any of the specified keys are considered
  valid by the Kubernetes API server.
-->
`--service-account-key-file`
: 給出某檔案的路徑，其中包含 PEM 編碼的 x509 RSA 或 ECDSA 私鑰或公鑰，用來檢查 ServiceAccount
  的令牌。所指定的檔案中可以包含多個祕鑰，並且你可以多次使用此參數，每個參數值爲不同的檔案。
  多次使用此參數時，由所給的祕鑰之一簽名的令牌會被 Kubernetes API 伺服器認爲是合法令牌。

<!--
`--service-account-signing-key-file`
: specifies the path to a file that contains the current private key of the service
  account token issuer. The issuer signs issued ID tokens with this private key.
-->
`--service-account-signing-key-file`
: 指向某檔案的路徑，其中包含當前服務賬號令牌發放者的私鑰。
  此發放者使用此私鑰來簽署所發放的 ID 令牌。

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
: 爲 ServiceAccount 令牌定義其受衆（Audiences）。
  服務賬號令牌身份檢查組件會檢查針對 API 訪問所使用的令牌，
  確認令牌至少是被綁定到這裏所給的受衆之一。
  如果 `api-audiences` 被多次指定，則針對所給的多個受衆中任何目標的令牌都會被
  Kubernetes API 伺服器當做合法的令牌。如果你指定了 `--service-account-issuer`
  參數，但沒有設置 `--api-audiences`，則控制面認爲此參數的預設值爲一個只有一個元素的列表，
  且該元素爲令牌發放者的 URL。

{{< /note >}}

<!--
The kubelet can also project a ServiceAccount token into a Pod. You can
specify desired properties of the token, such as the audience and the validity
duration. These properties are _not_ configurable on the default ServiceAccount
token. The token will also become invalid against the API when either the Pod
or the ServiceAccount is deleted.
-->
kubelet 還可以將 ServiceAccount 令牌投射到 Pod 中。你可以指定令牌的期望屬性，
例如受衆和有效期限。這些屬性在 default ServiceAccount 令牌上**無法**設定。
當 Pod 或 ServiceAccount 被刪除時，該令牌也將對 API 無效。

<!--
You can configure this behavior for the `spec` of a Pod using a
[projected volume](/docs/concepts/storage/volumes/#projected) type called
`ServiceAccountToken`.
-->
你可以使用類型爲 `ServiceAccountToken` 的[投射卷](/zh-cn/docs/concepts/storage/volumes/#projected)來爲
Pod 的 `spec` 設定此行爲。

<!--
The token from this projected volume is a {{<glossary_tooltip term_id="jwt" text="JSON Web Token">}}  (JWT).
The JSON payload of this token follows a well defined schema - an example payload for a pod bound token:
-->
來自此投射卷的令牌是一個 {{<glossary_tooltip term_id="jwt" text="JSON Web Token">}} (JWT)。
此令牌的 JSON 載荷遵循明確定義的模式，綁定到 Pod 的令牌的示例載荷如下：

<!--
```yaml
{
  "aud": [  # matches the requested audiences, or the API server's default audiences when none are explicitly requested
    "https://kubernetes.default.svc"
  ],
  "exp": 1731613413,
  "iat": 1700077413,
  "iss": "https://kubernetes.default.svc",  # matches the first value passed to the --service-account-issuer flag
  "jti": "ea28ed49-2e11-4280-9ec5-bc3d1d84661a", 
  "kubernetes.io": {
    "namespace": "kube-system",
    "node": {
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
  "aud": [  # 匹配請求的受衆，或當沒有明確請求時匹配 API 伺服器的默認受衆
    "https://kubernetes.default.svc"
  ],
  "exp": 1731613413,
  "iat": 1700077413,
  "iss": "https://kubernetes.default.svc",  # 匹配傳遞到 --service-account-issuer 標誌的第一個值
  "jti": "ea28ed49-2e11-4280-9ec5-bc3d1d84661a",
  "kubernetes.io": {
    "namespace": "kube-system",
    "node": {
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
### 啓動使用服務賬號令牌投射的 Pod  {#launch-a-pod-using-service-account-token-projection}

要爲某 Pod 提供一個受衆爲 `vault` 並且有效期限爲 2 小時的令牌，你可以定義一個與下面類似的
Pod 清單：

{{% code_sample file="pods/pod-projected-svc-token.yaml" %}}

<!--
Create the Pod:
-->
創建此 Pod：

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
kubelet 組件會替 Pod 請求令牌並將其保存起來；通過將令牌儲存到一個可設定的路徑以使之在
Pod 內可用；在令牌快要到期的時候刷新它。kubelet 會在令牌存在期達到其 TTL 的 80%
的時候或者令牌生命期超過 24 小時的時候主動請求將其輪換掉。

<!--
The application is responsible for reloading the token when it rotates. It's
often good enough for the application to load the token on a schedule
(for example: once every 5 minutes), without tracking the actual expiry time.
-->
應用負責在令牌被輪換時重新加載其內容。通常而言，週期性地（例如，每隔 5 分鐘）
重新加載就足夠了，不必跟蹤令牌的實際過期時間。

<!--
## Service Account Issuer Discovery
-->
## 發現服務賬號分發者 {#service-account-issuer-discovery}

{{< feature-state for_k8s_version="v1.21" state="stable" >}}

<!--
If you have enabled [token projection](#serviceaccount-token-volume-projection)
for ServiceAccounts in your cluster, then you can also make use of the discovery
feature. Kubernetes provides a way for clients to federate as an _identity provider_,
so that one or more external systems can act as a _relying party_.
-->
如果你在你的叢集中已經爲 ServiceAccount 啓用了[令牌投射](#serviceaccount-token-volume-projection)，
那麼你也可以利用其發現能力。Kubernetes 提供一種方式來讓客戶端將一個或多個外部系統進行聯邦，
作爲**標識提供者（Identity Provider）**，而這些外部系統的角色是**依賴方（Relying Party）**。

{{< note >}}
<!--
The issuer URL must comply with the
[OIDC Discovery Spec](https://openid.net/specs/openid-connect-discovery-1_0.html). In
practice, this means it must use the `https` scheme, and should serve an OpenID
provider configuration at `{service-account-issuer}/.well-known/openid-configuration`.

If the URL does not comply, ServiceAccount issuer discovery endpoints are not
registered or accessible.
-->
分發者的 URL 必須遵從
[OIDC 發現規範](https://openid.net/specs/openid-connect-discovery-1_0.html)。
實現上，這意味着 URL 必須使用 `https` 模式，並且必須在路徑
`{service-account-issuer}/.well-known/openid-configuration`
處給出 OpenID 提供者（Provider）的設定資訊。

如果 URL 沒有遵從這一規範，ServiceAccount 分發者發現末端末端就不會被註冊也無法訪問。
{{< /note >}}

<!--
When enabled, the Kubernetes API server publishes an OpenID Provider
Configuration document via HTTP. The configuration document is published at
`/.well-known/openid-configuration`.
The OpenID Provider Configuration is sometimes referred to as the _discovery document_.
The Kubernetes API server publishes the related
JSON Web Key Set (JWKS), also via HTTP, at `/openid/v1/jwks`.
-->
當此特性被啓用時，Kubernetes API 伺服器會通過 HTTP 發佈一個 OpenID 提供者設定文檔。
該設定文檔發佈在 `/.well-known/openid-configuration` 路徑。
這裏的 OpenID 提供者設定（OpenID Provider Configuration）有時候也被稱作
“發現文檔（Discovery Document）”。
Kubernetes API 伺服器也通過 HTTP 在 `/openid/v1/jwks` 處發佈相關的
JSON Web Key Set（JWKS）。

{{< note >}}
<!--
The responses served at `/.well-known/openid-configuration` and
`/openid/v1/jwks` are designed to be OIDC compatible, but not strictly OIDC
compliant. Those documents contain only the parameters necessary to perform
validation of Kubernetes service account tokens.
-->
對於在 `/.well-known/openid-configuration` 和 `/openid/v1/jwks` 上給出的響應而言，
其設計上是保證與 OIDC 兼容的，但並不嚴格遵從 OIDC 的規範。
響應中所包含的文檔進包含對 Kubernetes 服務賬號令牌進行校驗所必需的參數。
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
使用 {{< glossary_tooltip text="RBAC" term_id="rbac">}} 的叢集都包含一個的預設
RBAC ClusterRole, 名爲 `system:service-account-issuer-discovery`。
預設的 RBAC ClusterRoleBinding 將此角色分配給 `system:serviceaccounts` 組，
所有 ServiceAccount 隱式屬於該組。這使得叢集上運行的 Pod
能夠通過它們所掛載的服務賬號令牌訪問服務賬號發現文檔。
此外，管理員可以根據其安全性需要以及期望集成的外部系統，選擇是否將該角色綁定到
`system:authenticated` 或 `system:unauthenticated`。

<!--
The JWKS response contains public keys that a relying party can use to validate
the Kubernetes service account tokens. Relying parties first query for the
OpenID Provider Configuration, and use the `jwks_uri` field in the response to
find the JWKS.
-->
JWKS 響應包含依賴方可以用來驗證 Kubernetes 服務賬號令牌的公鑰資料。
依賴方先會查詢 OpenID 提供者設定，之後使用返回響應中的 `jwks_uri` 來查找 JWKS。

<!--
In many cases, Kubernetes API servers are not available on the public internet,
but public endpoints that serve cached responses from the API server can be made
available by users or by service providers. In these cases, it is possible to
override the `jwks_uri` in the OpenID Provider Configuration so that it points
to the public endpoint, rather than the API server's address, by passing the
`--service-account-jwks-uri` flag to the API server. Like the issuer URL, the
JWKS URI is required to use the `https` scheme.
-->
在很多場合，Kubernetes API 伺服器都不會暴露在公網上，不過對於緩存並向外提供 API
伺服器響應資料的公開末端而言，使用者或者服務提供商可以選擇將其暴露在公網上。
在這種環境中，可能會重載 OpenID 提供者設定中的
`jwks_uri`，使之指向公網上可用的末端地址，而不是 API 伺服器的地址。
這時需要向 API 伺服器傳遞 `--service-account-jwks-uri` 參數。
與分發者 URL 類似，此 JWKS URI 也需要使用 `https` 模式。

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
另請參見：

- 閱讀[爲叢集管理員提供的服務賬號指南](/zh-cn/docs/reference/access-authn-authz/service-accounts-admin/)
- 閱讀 [Kubernetes中的鑑權](/zh-cn/docs/reference/access-authn-authz/authorization/)
- 閱讀 [Secret](/zh-cn/docs/concepts/configuration/secret/) 的概念
  - 或者學習[使用 Secret 來安全地分發憑據](/zh-cn/docs/tasks/inject-data-application/distribute-credentials-secure/)
  - 不過也要注意，使用 Secret 來完成 ServiceAccount 身份驗證的做法已經過時。
    建議的替代做法是執行 [ServiceAccount 令牌卷投射](#serviceaccount-token-volume-projection)。
<!--
- Read about [projected volumes](/docs/tasks/configure-pod-container/configure-projected-volume-storage/).
- For background on OIDC discovery, read the
  [ServiceAccount signing key retrieval](https://github.com/kubernetes/enhancements/tree/master/keps/sig-auth/1393-oidc-discovery)
  Kubernetes Enhancement Proposal
- Read the [OIDC Discovery Spec](https://openid.net/specs/openid-connect-discovery-1_0.html)
-->
- 閱讀理解[投射卷](/zh-cn/docs/tasks/configure-pod-container/configure-projected-volume-storage/)
- 關於 OIDC 發現的相關背景資訊，閱讀[服務賬號簽署密鑰檢索 KEP](https://github.com/kubernetes/enhancements/tree/master/keps/sig-auth/1393-oidc-discovery)
  這一 Kubernetes 增強提案
- 閱讀 [OIDC 發現規範](https://openid.net/specs/openid-connect-discovery-1_0.html)
