---
title: Secret
content_type: concept
feature:
  title: Secret 和配置管理
  description: >
    部署和更新 Secrets 和應用程式的配置而不必重新構建容器映象，且
    不必將軟體堆疊配置中的秘密資訊暴露出來。
weight: 30
---
<!--
reviewers:
- mikedanese
title: Secrets
content_type: concept
feature:
  title: Secret and configuration management
  description: >
    Deploy and update secrets and application configuration without rebuilding your image
    and without exposing secrets in your stack configuration.
weight: 30
-->

<!-- overview -->

<!--
A Secret is an object that contains a small amount of sensitive data such as
a password, a token, or a key. Such information might otherwise be put in a
{{< glossary_tooltip term_id="pod" >}} specification or in a
{{< glossary_tooltip text="container image" term_id="image" >}}. Using a
Secret means that you don't need to include confidential data in your
application code.
-->
Secret 是一種包含少量敏感資訊例如密碼、令牌或金鑰的物件。
這樣的資訊可能會被放在 {{< glossary_tooltip term_id="pod" >}} 規約中或者映象中。
使用 Secret 意味著你不需要在應用程式程式碼中包含機密資料。

<!--
Because Secrets can be created independently of the Pods that use them, there
is less risk of the Secret (and its data) being exposed during the workflow of
creating, viewing, and editing Pods. Kubernetes, and applications that run in
your cluster, can also take additional precautions with Secrets, such as avoiding
writing secret data to nonvolatile storage.

Secrets are similar to {{< glossary_tooltip text="ConfigMaps" term_id="configmap" >}}
but are specifically intended to hold confidential data.
-->
由於建立 Secret 可以獨立於使用它們的 Pod，
因此在建立、檢視和編輯 Pod 的工作流程中暴露 Secret（及其資料）的風險較小。
Kubernetes 和在叢集中執行的應用程式也可以對 Secret 採取額外的預防措施，
例如避免將機密資料寫入非易失性儲存。

Secret 類似於 {{<glossary_tooltip text="ConfigMap" term_id="configmap" >}}
但專門用於儲存機密資料。

{{< caution >}}
<!--
Kubernetes Secrets are, by default, stored unencrypted in the API server's underlying data store (etcd). Anyone with API access can retrieve or modify a Secret, and so can anyone with access to etcd.
Additionally, anyone who is authorized to create a Pod in a namespace can use that access to read any Secret in that namespace; this includes indirect access such as the ability to create a Deployment.

In order to safely use Secrets, take at least the following steps:

1. [Enable Encryption at Rest](/docs/tasks/administer-cluster/encrypt-data/) for Secrets.
1. [Enable or configure RBAC rules](/docs/reference/access-authn-authz/authorization/) that
   restrict reading and writing the Secret. Be aware that secrets can be obtained
   implicitly by anyone with the permission to create a Pod.
1. Where appropriate, also use mechanisms such as RBAC to limit which principals are allowed
   to create new Secrets or replace existing ones.
-->
預設情況下，Kubernetes Secret 未加密地儲存在 API 伺服器的底層資料儲存（etcd）中。
任何擁有 API 訪問許可權的人都可以檢索或修改 Secret，任何有權訪問 etcd 的人也可以。
此外，任何有許可權在名稱空間中建立 Pod 的人都可以使用該訪問許可權讀取該名稱空間中的任何 Secret；
這包括間接訪問，例如建立 Deployment 的能力。

為了安全地使用 Secret，請至少執行以下步驟：

1. 為 Secret [啟用靜態加密](/zh-cn/docs/tasks/administer-cluster/encrypt-data/)；
1. [啟用或配置 RBAC 規則](/zh-cn/docs/reference/access-authn-authz/authorization/)來限制讀取和寫入
   Secret 的資料（包括透過間接方式）。需要注意的是，被准許建立 Pod 的人也隱式地被授權獲取
   Secret 內容。
1. 在適當的情況下，還可以使用 RBAC 等機制來限制允許哪些主體建立新 Secret 或替換現有 Secret。
{{< /caution >}}

<!--
See [Information security for Secrets](#information-security-for-secrets) for more details.
-->
參見 [Secret 的資訊保安](#information-security-for-secrets)瞭解詳情。

<!-- body -->

<!--
## Uses for Secrets

There are three main ways for a Pod to use a Secret:
- As [files](#using-secrets-as-files-from-a-pod) in a
  {{< glossary_tooltip text="volume" term_id="volume" >}} mounted on one or more of
  its containers.
- As [container environment variable](#using-secrets-as-environment-variables).
- By the [kubelet when pulling images](#using-imagepullsecrets) for the Pod.

The Kubernetes control plane also uses Secrets; for example,
[bootstrap token Secrets](#bootstrap-token-secrets) are a mechanism to
help automate node registration.
-->
## Secret 的使用 {#uses-for-secrets}

Pod 可以用三種方式之一來使用 Secret：

- 作為掛載到一個或多個容器上的{{< glossary_tooltip text="卷" term_id="volume" >}}
  中的[檔案](#using-secrets-as-files-from-a-pod)。
- 作為[容器的環境變數](#using-secrets-as-environment-variables)。
- 由 [kubelet 在為 Pod 拉取映象時使用](#using-imagepullsecrets)。

Kubernetes 控制面也使用 Secret；
例如，[引導令牌 Secret](#bootstrap-token-secrets)
是一種幫助自動化節點註冊的機制。

<!--
### Alternatives to Secrets

Rather than using a Secret to protect confidential data, you can pick from alternatives.

Here are some of your options:
-->
### Secret 的替代方案  {#alternatives-to-secrets}

除了使用 Secret 來保護機密資料，你也可以選擇一些替代方案。

下面是一些選項：

<!--
- if your cloud-native component needs to authenticate to another application that you
  know is running within the same Kubernetes cluster, you can use a
  [ServiceAccount](/docs/reference/access-authn-authz/authentication/#service-account-tokens)
  and its tokens to identify your client.
- there are third-party tools that you can run, either within or outside your cluster,
  that provide secrets management. For example, a service that Pods access over HTTPS,
  that reveals a secret if the client correctly authenticates (for example, with a ServiceAccount
  token).
-->
- 如果你的雲原生元件需要執行身份認證來訪問你所知道的、在同一 Kubernetes 叢集中執行的另一個應用，
  你可以使用 [ServiceAccount](/zh-cn/docs/reference/access-authn-authz/authentication/#service-account-tokens)
  及其令牌來標識你的客戶端身份。
- 你可以執行的第三方工具也有很多，這些工具可以執行在叢集內或叢集外，提供機密資料管理。
  例如，這一工具可能是 Pod 透過 HTTPS 訪問的一個服務，該服務在客戶端能夠正確地透過身份認證
  （例如，透過 ServiceAccount 令牌）時，提供機密資料內容。
<!--
- for authentication, you can implement a custom signer for X.509 certificates, and use
  [CertificateSigningRequests](/docs/reference/access-authn-authz/certificate-signing-requests/)
  to let that custom signer issue certificates to Pods that need them.
- you can use a [device plugin](/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/)
  to expose node-local encryption hardware to a specific Pod. For example, you can schedule
  trusted Pods onto nodes that provide a Trusted Platform Module, configured out-of-band.
-->
- 就身份認證而言，你可以為 X.509 證書實現一個定製的簽名者，並使用
  [CertificateSigningRequest](/zh-cn/docs/reference/access-authn-authz/certificate-signing-requests/)
  來讓該簽名者為需要證書的 Pod 發放證書。
- 你可以使用一個[裝置外掛](/zh-cn/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/)
  來將節點本地的加密硬體暴露給特定的 Pod。例如，你可以將可信任的 Pod
  排程到提供可信平臺模組（Trusted Platform Module，TPM）的節點上。
  這類節點是另行配置的。

<!--
You can also combine two or more of those options, including the option to use Secret objects themselves.

For example: implement (or deploy) an {{< glossary_tooltip text="operator" term_id="operator-pattern" >}}
that fetches short-lived session tokens from an external service, and then creates Secrets based
on those short-lived session tokens. Pods running in your cluster can make use of the session tokens,
and operator ensures they are valid. This separation means that you can run Pods that are unaware of
the exact mechanisms for issuing and refreshing those session tokens.
-->
你還可以將如上選項的兩種或多種進行組合，包括直接使用 Secret 物件本身也是一種選項。

例如：實現（或部署）一個 {{< glossary_tooltip text="operator" term_id="operator-pattern" >}}，
從外部服務取回生命期很短的會話令牌，之後基於這些生命期很短的會話令牌來建立 Secret。
執行在叢集中的 Pod 可以使用這些會話令牌，而 Operator 則確保這些令牌是合法的。
這種責權分離意味著你可以執行那些不瞭解會話令牌如何發放與重新整理的確切機制的 Pod。

<!--
## Working with Secrets

### Creating a Secret

There are several options to create a Secret:

- [create Secret using `kubectl` command](/docs/tasks/configmap-secret/managing-secret-using-kubectl/)
- [create Secret from config file](/docs/tasks/configmap-secret/managing-secret-using-config-file/)
- [create Secret using kustomize](/docs/tasks/configmap-secret/managing-secret-using-kustomize/)
-->
## 使用 Secret  {#working-with-secrets}

### 建立 Secret  {#creating-a-secret}

- [使用 `kubectl` 命令來建立 Secret](/zh-cn/docs/tasks/configmap-secret/managing-secret-using-kubectl/)
- [基於配置檔案來建立 Secret](/zh-cn/docs/tasks/configmap-secret/managing-secret-using-config-file/)
- [使用 kustomize 來建立 Secret](/zh-cn/docs/tasks/configmap-secret/managing-secret-using-kustomize/)

<!--
#### Constraints on Secret names and data {#restriction-names-data}

The name of a Secret object must be a valid
[DNS subdomain name](/docs/concepts/overview/working-with-objects/names#dns-subdomain-names).
-->
#### 對 Secret 名稱與資料的約束 {#restriction-names-data}

Secret 物件的名稱必須是合法的
[DNS 子域名](/zh-cn/docs/concepts/overview/working-with-objects/names#dns-subdomain-names)。

<!--
You can specify the `data` and/or the `stringData` field when creating a
configuration file for a Secret.  The `data` and the `stringData` fields are optional.
The values for all keys in the `data` field have to be base64-encoded strings.
If the conversion to base64 string is not desirable, you can choose to specify
the `stringData` field instead, which accepts arbitrary strings as values.

The keys of `data` and `stringData` must consist of alphanumeric characters,
`-`, `_` or `.`. All key-value pairs in the `stringData` field are internally
merged into the `data` field. If a key appears in both the `data` and the
`stringData` field, the value specified in the `stringData` field takes
precedence.
-->
在為建立 Secret 編寫配置檔案時，你可以設定 `data` 與/或 `stringData` 欄位。
`data` 和 `stringData` 欄位都是可選的。`data` 欄位中所有鍵值都必須是 base64
編碼的字串。如果不希望執行這種 base64 字串的轉換操作，你可以選擇設定
`stringData` 欄位，其中可以使用任何字串作為其取值。

`data` 和 `stringData` 中的鍵名只能包含字母、數字、`-`、`_` 或 `.` 字元。
`stringData` 欄位中的所有鍵值對都會在內部被合併到 `data` 欄位中。
如果某個主鍵同時出現在 `data` 和 `stringData` 欄位中，`stringData`
所指定的鍵值具有高優先順序。

<!--
#### Size limit {#restriction-data-size}

Individual secrets are limited to 1MiB in size. This is to discourage creation
of very large secrets that could exhaust the API server and kubelet memory.
However, creation of many smaller secrets could also exhaust memory. You can
use a [resource quota](/docs/concepts/policy/resource-quotas/) to limit the
number of Secrets (or other resources) in a namespace.
-->
#### 尺寸限制   {#restriction-data-size}

每個 Secret 的尺寸最多為 1MiB。施加這一限制是為了避免使用者建立非常大的 Secret，
進而導致 API 伺服器和 kubelet 記憶體耗盡。不過建立很多小的 Secret 也可能耗盡記憶體。
你可以使用[資源配額](/zh-cn/docs/concepts/policy/resource-quotas/)來約束每個名字空間中
Secret（或其他資源）的個數。

<!--
### Editing a Secret

You can edit an existing Secret using kubectl:
-->
### 編輯 Secret    {#editing-a-secret}

你可以使用 kubectl 來編輯一個已有的 Secret：

```shell
kubectl edit secrets mysecret
```

<!--
This opens your default editor and allows you to update the base64 encoded Secret
values in the `data` field; for example:
-->
這一命令會啟動你的預設編輯器，允許你更新 `data` 欄位中存放的 base64 編碼的 Secret 值；
例如：

```yaml
# Please edit the object below. Lines beginning with a '#' will be ignored,
# and an empty file will abort the edit. If an error occurs while saving this file, it will be
# reopened with the relevant failures.
#
apiVersion: v1
data:
  username: YWRtaW4=
  password: MWYyZDFlMmU2N2Rm
kind: Secret
metadata:
  annotations:
    kubectl.kubernetes.io/last-applied-configuration: { ... }
  creationTimestamp: 2020-01-22T18:41:56Z
  name: mysecret
  namespace: default
  resourceVersion: "164619"
  uid: cfee02d6-c137-11e5-8d73-42010af00002
type: Opaque
```

<!--
That example manifest defines a Secret with two keys in the `data` field: `username` and `password`.
The values are Base64 strings in the manifest; however, when you use the Secret with a Pod
then the kubelet provides the _decoded_ data to the Pod and its containers.

You can package many keys and values into one Secret, or use many Secrets, whichever is convenient.
-->
這一示例清單定義了一個 Secret，其 `data` 欄位中包含兩個主鍵：`username` 和 `password`。
清單中的欄位值是 Base64 字串，不過，當你在 Pod 中使用 Secret 時，kubelet 為 Pod
及其中的容器提供的是解碼後的資料。

你可以在一個 Secret 中打包多個主鍵和數值，也可以選擇使用多個 Secret，
完全取決於哪種方式最方便。

<!--
### Using a Secret

Secrets can be mounted as data volumes or exposed as
{{< glossary_tooltip text="environment variables" term_id="container-env-variables" >}}
to be used by a container in a Pod. Secrets can also be used by other parts of the
system, without being directly exposed to the Pod. For example, Secrets can hold
credentials that other parts of the system should use to interact with external
systems on your behalf.
-->
### 使用 Secret    {#using-a-secret}

Secret 可以以資料卷的形式掛載，也可以作為{{< glossary_tooltip text="環境變數" term_id="container-env-variables" >}}
暴露給 Pod 中的容器使用。Secret 也可用於系統中的其他部分，而不是一定要直接暴露給 Pod。
例如，Secret 也可以包含系統中其他部分在替你與外部系統互動時要使用的憑證資料。

<!--
Secret volume sources are validated to ensure that the specified object
reference actually points to an object of type Secret. Therefore, a Secret
needs to be created before any Pods that depend on it.  

If the Secret cannot be fetched (perhaps because it does not exist, or
due to a temporary lack of connection to the API server) the kubelet
periodically retries running that Pod. The kubelet also reports an Event
for that Pod, including details of the problem fetching the Secret.
-->
Kubernetes 會檢查 Secret 的卷資料來源，確保所指定的物件引用確實指向型別為 Secret
的物件。因此，如果 Pod 依賴於某 Secret，該 Secret 必須先於 Pod 被建立。

如果 Secret 內容無法取回（可能因為 Secret 尚不存在或者臨時性地出現 API
伺服器網路連線問題），kubelet 會週期性地重試 Pod 執行操作。kubelet 也會為該 Pod
報告 Event 事件，給出讀取 Secret 時遇到的問題細節。

<!--
#### Optional Secrets {#restriction-secret-must-exist}

When you define a container environment variable based on a Secret,
you can mark it as _optional_. The default is for the Secret to be
required.

None of a Pod's containers will start until all non-optional Secrets are
available.

If a Pod references a specific key in a Secret and that Secret does exist, but
is missing the named key, the Pod fails during startup.
-->
#### 可選的 Secret   {#restriction-secret-must-exist}

當你定義一個基於 Secret 的環境變數時，你可以將其標記為可選。
預設情況下，所引用的 Secret 都是必需的。

只有所有非可選的 Secret 都可用時，Pod 中的容器才能啟動執行。

如果 Pod 引用了 Secret 中的特定主鍵，而雖然 Secret 本身存在，對應的主鍵不存在，
Pod 啟動也會失敗。

<!--
### Using Secrets as files from a Pod {#using-secrets-as-files-from-a-pod}

If you want to access data from a Secret in a Pod, one way to do that is to
have Kubernetes make the value of that Secret be available as a file inside
the filesystem of one or more of the Pod's containers.

To configure that, you:
-->
### 在 Pod 中以檔案形式使用 Secret  {#using-secrets-as-files-from-a-pod}

如果你希望在 Pod 中訪問 Secret 內的資料，一種方式是讓 Kubernetes 將 Secret
以 Pod 中一個或多個容器的檔案系統中的檔案的形式呈現出來。

要配置這種行為，你需要：

<!--
1. Create a secret or use an existing one. Multiple Pods can reference the same secret.
1. Modify your Pod definition to add a volume under `.spec.volumes[]`. Name the volume anything, and have a `.spec.volumes[].secret.secretName` field equal to the name of the Secret object.
1. Add a `.spec.containers[].volumeMounts[]` to each container that needs the secret. Specify `.spec.containers[].volumeMounts[].readOnly = true` and `.spec.containers[].volumeMounts[].mountPath` to an unused directory name where you would like the secrets to appear.
1. Modify your image or command line so that the program looks for files in that directory. Each key in the secret `data` map becomes the filename under `mountPath`.

This is an example of a Pod that mounts a Secret named `mysecret` in a volume:
-->
1. 建立一個 Secret 或者使用已有的 Secret。多個 Pod 可以引用同一個 Secret。
1. 更改 Pod 定義，在 `.spec.volumes[]` 下新增一個卷。根據需要為卷設定其名稱，
   並將 `.spec.volumes[].secret.secretName` 欄位設定為 Secret 物件的名稱。
1. 為每個需要該 Secret 的容器新增 `.spec.containers[].volumeMounts[]`。
   並將 `.spec.containers[].volumeMounts[].readOnly` 設定為 `true`，
   將 `.spec.containers[].volumeMounts[].mountPath` 設定為希望 Secret
   被放置的、目前尚未被使用的路徑名。
1. 更改你的映象或命令列，以便程式讀取所設定的目錄下的檔案。Secret 的 `data`
   對映中的每個主鍵都成為 `mountPath` 下面的檔名。

下面是一個透過捲來掛載名為 `mysecret` 的 Secret 的 Pod 示例：

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: mypod
spec:
  containers:
  - name: mypod
    image: redis
    volumeMounts:
    - name: foo
      mountPath: "/etc/foo"
      readOnly: true
  volumes:
  - name: foo
    secret:
      secretName: mysecret
      optional: false # 預設設定，意味著 "mysecret" 必須已經存在
```

<!--
Each Secret you want to use needs to be referred to in `.spec.volumes`.

If there are multiple containers in the Pod, then each container needs its
own `volumeMounts` block, but only one `.spec.volumes` is needed per Secret.
-->
你要訪問的每個 Secret 都需要透過 `.spec.volumes` 來引用。

如果 Pod 中包含多個容器，則每個容器需要自己的 `volumeMounts` 塊，
不過針對每個 Secret 而言，只需要一份 `.spec.volumes` 設定。

{{< note >}}
<!--
Versions of Kubernetes before v1.22 automatically created credentials for accessing
the Kubernetes API. This older mechanism was based on creating token Secrets that
could then be mounted into running Pods.
In more recent versions, including Kubernetes v{{< skew currentVersion >}}, API credentials
are obtained directly by using the [TokenRequest](/docs/reference/kubernetes-api/authentication-resources/token-request-v1/) API,
and are mounted into Pods using a [projected volume](/docs/reference/access-authn-authz/service-accounts-admin/#bound-service-account-token-volume).
The tokens obtained using this method have bounded lifetimes, and are automatically
invalidated when the Pod they are mounted into is deleted.
-->
Kubernetes v1.22 版本之前都會自動建立用來訪問 Kubernetes API 的憑證。
這一老的機制是基於建立可被掛載到 Pod 中的令牌 Secret 來實現的。
在最近的版本中，包括 Kubernetes v{{< skew currentVersion >}} 中，API 憑據是直接透過
[TokenRequest](/docs/reference/kubernetes-api/authentication-resources/token-request-v1/)
API 來獲得的，這一憑據會使用[投射卷](/zh-cn/docs/reference/access-authn-authz/service-accounts-admin/#bound-service-account-token-volume)
掛載到 Pod 中。使用這種方式獲得的令牌有確定的生命期，並且在掛載它們的 Pod
被刪除時自動作廢。

<!--
You can still [manually create](/docs/tasks/configure-pod-container/configure-service-account/#manually-create-a-service-account-api-token)
a service account token Secret; for example, if you need a token that never expires.
However, using the [TokenRequest](/docs/reference/kubernetes-api/authentication-resources/token-request-v1/)
subresource to obtain a token to access the API is recommended instead.
You can use the [`kubectl create token`](/docs/reference/generated/kubectl/kubectl-commands#-em-token-em-)
command to obtain a token from the `TokenRequest` API.
-->
你仍然可以[手動建立](/zh-cn/docs/tasks/configure-pod-container/configure-service-account/#manually-create-a-service-account-api-token)
服務賬號令牌。例如，當你需要一個永遠都不過期的令牌時。
不過，仍然建議使用 [TokenRequest](/docs/reference/kubernetes-api/authentication-resources/token-request-v1/)
子資源來獲得訪問 API 伺服器的令牌。
你可以使用 [`kubectl create token`](/docs/reference/generated/kubectl/kubectl-commands#-em-token-em-)
命令呼叫 `TokenRequest` API 獲得令牌。
{{< /note >}}

<!--
#### Projection of Secret keys to specific paths

You can also control the paths within the volume where Secret keys are projected.
You can use the `.spec.volumes[].secret.items` field to change the target path of each key:
-->
#### 將 Secret 鍵投射到特定目錄 {#projection-of-secret-keys-to-specific-paths}

你也可以控制 Secret 鍵所投射到的卷中的路徑。
你可以使用 `.spec.volumes[].secret.items` 欄位來更改每個主鍵的目標路徑：

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: mypod
spec:
  containers:
  - name: mypod
    image: redis
    volumeMounts:
    - name: foo
      mountPath: "/etc/foo"
      readOnly: true
  volumes:
  - name: foo
    secret:
      secretName: mysecret
      items:
      - key: username
        path: my-group/my-username
```

<!--
What will happen:

* the `username` key from `mysecret` is available to the container at the path
  `/etc/foo/my-group/my-username` instead of at `/etc/foo/username`.
* the `password` key from that Secret object is not projected.

If `.spec.volumes[].secret.items` is used, only keys specified in `items` are projected.
To consume all keys from the Secret, all of them must be listed in the `items` field.

If you list keys explicitly, then all listed keys must exist in the corresponding Secret.
Otherwise, the volume is not created.
-->
將發生的事情如下：

- `mysecret` 中的鍵 `username` 會出現在容器中的路徑為 `/etc/foo/my-group/my-username`，
  而不是 `/etc/foo/username`。
- Secret 物件的 `password` 鍵不會被投射。

如果使用了 `.spec.volumes[].secret.items`，則只有 `items` 中指定了的主鍵會被投射。
如果要使用 Secret 中的所有主鍵，則需要將它們全部列舉到 `items` 欄位中。

如果你顯式地列舉了主鍵，則所列舉的主鍵都必須在對應的 Secret 中存在。
否則所在的卷不會被建立。

<!--
#### Secret files permissions

You can set the POSIX file access permission bits for a single Secret key.
If you don't specify any permissions, `0644` is used by default.
You can also set a default mode for the entire Secret volume and override per key if needed.

For example, you can specify a default mode like this:
-->
#### Secret 檔案的訪問許可權 {#secret-files-permissions}

你可以為某個 Secret 主鍵設定 POSIX 檔案訪問許可權位。
如果你不指定訪問許可權，預設會使用 `0644`。
你也可以為整個 Secret 卷設定預設的訪問模式，然後再根據需要在主鍵層面過載。

例如，你可以像下面這樣設定預設的模式：

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: mypod
spec:
  containers:
  - name: mypod
    image: redis
    volumeMounts:
    - name: foo
      mountPath: "/etc/foo"
  volumes:
  - name: foo
    secret:
      secretName: mysecret
      defaultMode: 0400
```

<!--
The secret is mounted on `/etc/foo`; all the files created by the
secret volume mount have permission `0400`.
-->
該 Secret 被掛載在 `/etc/foo` 下，Secret 卷掛載所建立的所有檔案的訪問模式都是 `0400`。

{{< note >}}
<!--
If you're defining a Pod or a Pod template using JSON, beware that the JSON
specification doesn't support octal notation. You can use the decimal value
for the `defaultMode` (for example, 0400 in octal is 256 in decimal) instead.  
If you're writing YAML, you can write the `defaultMode` in octal.
-->
如果你是使用 JSON 來定義 Pod 或 Pod 模板，需要注意 JSON 規範不支援八進位制的記數方式。
你可以在 `defaultMode` 中設定十進位制的值（例如，八進位制中的 0400 在十進位制中為 256）。
如果你使用 YAML 來編寫定義，你可以用八進位制值來設定 `defaultMode`。
{{< /note >}}

<!--
#### Consuming Secret values from volumes

Inside the container that mounts a secret volume, the secret keys appear as
files. The secret values are base64 decoded and stored inside these files.

This is the result of commands executed inside the container from the example above:
-->
#### 使用來自卷中的 Secret 值  {#consuming-secret-values-from-volumes}

在掛載了 Secret 卷的容器內，Secret 的主鍵都呈現為檔案。
Secret 的取值都是 Base64 編碼的，儲存在這些檔案中。

下面是在上例中的容器內執行命令的結果：

```shell
ls /etc/foo/
```

<!--
The output is similar to:
-->
輸出類似於：

```
username
password
```

```shell
cat /etc/foo/username
```

<!--
The output is similar to:
-->
輸出類似於：

```
admin
```

```shell
cat /etc/foo/password
```

<!--
The output is similar to:
-->
輸出類似於：

```
1f2d1e2e67df
```

<!--
The program in a container is responsible for reading the secret data from these
files, as needed.
-->
容器中的程式要負責根據需要讀取 Secret 資料。

<!--
#### Mounted Secrets are updated automatically

When a volume contains data from a Secret, and that Secret is updated, Kubernetes tracks
this and updates the data in the volume, using an eventually-consistent approach.
-->
#### 掛載的 Secret 是被自動更新的  {#mounted-secrets-are-updated-automatically}

當卷中包含來自 Secret 的資料，而對應的 Secret 被更新，Kubernetes
會跟蹤到這一操作並更新卷中的資料。更新的方式是保證最終一致性。

{{< note >}}
<!--
A container using a Secret as a
[subPath](/docs/concepts/storage/volumes#using-subpath) volume mount does not receive
automated Secret updates.
-->
對於以 [subPath](/zh-cn/docs/concepts/storage/volumes#using-subpath) 形式掛載 Secret 卷的容器而言，
它們無法收到自動的 Secret 更新。
{{< /note >}}

<!--
The kubelet keeps a cache of the current keys and values for the Secrets that are used in
volumes for pods on that node.
You can configure the way that the kubelet detects changes from the cached values. The `configMapAndSecretChangeDetectionStrategy` field in
the [kubelet configuration](/docs/reference/config-api/kubelet-config.v1beta1/) controls which strategy the kubelet uses. The default strategy is `Watch`.
-->
Kubelet 元件會維護一個快取，在其中儲存節點上 Pod 卷中使用的 Secret 的當前主鍵和取值。
你可以配置 kubelet 如何檢測所快取數值的變化。
[kubelet 配置](/zh-cn/docs/reference/config-api/kubelet-config.v1beta1/)中的
`configMapAndSecretChangeDetectionStrategy` 欄位控制 kubelet 所採用的策略。
預設的策略是 `Watch`。

<!--
Updates to Secrets can be either propagated by an API watch mechanism (the default), based on
a cache with a defined time-to-live, or polled from the cluster API server on each kubelet
synchronisation loop.
-->
對 Secret 的更新操作既可以透過 API 的 watch 機制（預設）來傳播，
基於設定了生命期的快取獲取，也可以透過 kubelet 的同步迴路來從叢集的 API
伺服器上輪詢獲取。

<!--
As a result, the total delay from the moment when the Secret is updated to the moment
when new keys are projected to the Pod can be as long as the kubelet sync period + cache
propagation delay, where the cache propagation delay depends on the chosen cache type
(following the same order listed in the previous paragraph, these are:
watch propagation delay, the configured cache TTL, or zero for direct polling).
-->
因此，從 Secret 被更新到新的主鍵被投射到 Pod 中，中間存在一個延遲。
這一延遲的上限是 kubelet 的同步週期加上快取的傳播延遲，
其中快取的傳播延遲取決於所選擇的快取型別。
對應上一段中提到的幾種傳播機制，延遲時長為 watch 的傳播延遲、所配置的快取 TTL
或者對於直接輪詢而言是零。

<!--
### Using Secrets as environment variables

To use a Secret in an {{< glossary_tooltip text="environment variable" term_id="container-env-variables" >}}
in a Pod:
-->
### 以環境變數的方式使用 Secret   {#using-secrets-as-environment-variables}

如果需要在 Pod 中以{{< glossary_tooltip text="環境變數" term_id="container-env-variables" >}}
的形式使用 Secret：

<!--
1. Create a Secret (or use an existing one).  Multiple Pods can reference the same Secret.
1. Modify your Pod definition in each container that you wish to consume the value of a secret
   key to add an environment variable for each secret key you wish to consume. The environment
   variable that consumes the secret key should populate the secret's name and key in `env[].valueFrom.secretKeyRef`.
1. Modify your image and/or command line so that the program looks for values in the specified
   environment variables.
-->
1. 建立 Secret（或者使用現有 Secret）。多個 Pod 可以引用同一個 Secret。
1. 更改 Pod 定義，在要使用 Secret 鍵值的每個容器中新增與所使用的主鍵對應的環境變數。
   讀取 Secret 主鍵的環境變數應該在 `env[].valueFrom.secretKeyRef` 中填寫 Secret
   的名稱和主鍵名稱。
1. 更改你的映象或命令列，以便程式讀取環境變數中儲存的值。

<!--
This is an example of a Pod that uses a Secret via environment variables:
-->
下面是一個透過環境變數來使用 Secret 的示例 Pod：

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: secret-env-pod
spec:
  containers:
  - name: mycontainer
    image: redis
    env:
      - name: SECRET_USERNAME
        valueFrom:
          secretKeyRef:
            name: mysecret
            key: username
            optional: false # 此值為預設值；意味著 "mysecret"
                            # 必須存在且包含名為 "username" 的主鍵
      - name: SECRET_PASSWORD
        valueFrom:
          secretKeyRef:
            name: mysecret
            key: password
            optional: false # 此值為預設值；意味著 "mysecret"
                            # 必須存在且包含名為 "password" 的主鍵
  restartPolicy: Never
```

<!--
#### Invalid environment variables {#restriction-env-from-invalid}

Secrets used to populate environment variables by the `envFrom` field that have keys
that are considered invalid environment variable names will have those keys
skipped. The Pod is allowed to start.
-->
#### 非法環境變數    {#restriction-env-from-invalid}

對於透過 `envFrom` 欄位來填充環境變數的 Secret 而言，
如果其中包含的主鍵不能被當做合法的環境變數名，這些主鍵會被忽略掉。
Pod 仍然可以啟動。

<!--
If you define a Pod with an invalid variable name, the failed Pod startup includes
an event with the reason set to `InvalidVariableNames` and a message that lists the
skipped invalid keys. The following example shows a Pod that refers to a Secret
named `mysecret`, where `mysecret` contains 2 invalid keys: `1badkey` and `2alsobad`.
-->
如果你定義的 Pod 中包含非法的變數名稱，則 Pod 可能啟動失敗，
會形成 reason 為 `InvalidVariableNames` 的事件，以及列舉被略過的非法主鍵的訊息。
下面的例子中展示了一個 Pod，引用的是名為 `mysecret` 的 Secret，
其中包含兩個非法的主鍵：`1badkey` 和 `2alsobad`。

```shell
kubectl get events
```

<!--
The output is similar to:
-->
輸出類似於：

```
LASTSEEN   FIRSTSEEN   COUNT     NAME            KIND      SUBOBJECT                         TYPE      REASON
0s         0s          1         dapi-test-pod   Pod                                         Warning   InvalidEnvironmentVariableNames   kubelet, 127.0.0.1      Keys [1badkey, 2alsobad] from the EnvFrom secret default/mysecret were skipped since they are considered invalid environment variable names.
```

<!--
#### Consuming Secret values from environment variables

Inside a container that consumes a Secret using environment variables, the secret keys appear
as normal environment variables. The values of those variables are the base64 decoded values
of the secret data.

This is the result of commands executed inside the container from the example above:
-->
#### 透過環境變數使用 Secret 值 {#consuming-secret-values-from-environment-variables}

在透過環境變數來使用 Secret 的容器中，Secret 主鍵展現為普通的環境變數。
這些變數的取值是 Secret 資料的 Base64 解碼值。

下面是在前文示例中的容器內執行命令的結果：

```shell
echo "$SECRET_USERNAME"
```

<!--
The output is similar to:
-->
輸出類似於：

```
admin
```

```shell
echo "$SECRET_PASSWORD"
```

<!--
The output is similar to:
-->
輸出類似於：

```
1f2d1e2e67df
```

{{< note >}}
<!--
If a container already consumes a Secret in an environment variable,
a Secret update will not be seen by the container unless it is
restarted. There are third party solutions for triggering restarts when
secrets change.
-->
如果容器已經在透過環境變數來使用 Secret，Secret 更新在容器內是看不到的，
除非容器被重啟。有一些第三方的解決方案，能夠在 Secret 發生變化時觸發容器重啟。
{{< /note >}}

<!--
### Container image pull secrets {#using-imagepullsecrets}

If you want to fetch container images from a private repository, you need a way for
the kubelet on each node to authenticate to that repository. You can configure
_image pull secrets_ to make this possible. These secrets are configured at the Pod
level.
-->
### 容器映象拉取 Secret  {#using-imagepullsecrets}

如果你嘗試從私有倉庫拉取容器映象，你需要一種方式讓每個節點上的 kubelet
能夠完成與映象庫的身份認證。你可以配置 *映象拉取 Secret* 來實現這點。
Secret 是在 Pod 層面來配置的。

<!--
The `imagePullSecrets` field for a Pod is a list of references to Secrets in the same namespace
as the Pod.
You can use an `imagePullSecrets` to pass image registry access credentials to
the kubelet. The kubelet uses this information to pull a private image on behalf of your Pod.
See `PodSpec` in the [Pod API reference](/docs/reference/kubernetes-api/workload-resources/pod-v1/#PodSpec)
for more information about the `imagePullSecrets` field.
-->
Pod 的 `imagePullSecrets` 欄位是一個對 Pod 所在的名字空間中的 Secret
的引用列表。你可以使用 `imagePullSecrets` 來將映象倉庫訪問憑據傳遞給 kubelet。
kubelet 使用這個資訊來替你的 Pod 拉取私有映象。
參閱 [Pod API 參考](/docs/reference/kubernetes-api/workload-resources/pod-v1/#PodSpec)
中的 `PodSpec` 進一步瞭解 `imagePullSecrets` 欄位。

<!--
#### Using imagePullSecrets

The `imagePullSecrets` field is a list of references to secrets in the same namespace.
You can use an `imagePullSecrets` to pass a secret that contains a Docker (or other) image registry
password to the kubelet. The kubelet uses this information to pull a private image on behalf of your Pod.
See the [PodSpec API](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#podspec-v1-core) for more information about the `imagePullSecrets` field.
-->
#### 使用 imagePullSecrets {#using-imagepullsecrets-1}

`imagePullSecrets` 欄位是一個列表，包含對同一名字空間中 Secret 的引用。
你可以使用 `imagePullSecrets` 將包含 Docker（或其他）映象倉庫密碼的 Secret
傳遞給 kubelet。kubelet 使用此資訊來替 Pod 拉取私有映象。
參閱 [PodSpec API ](/docs/reference/kubernetes-api/workload-resources/pod-v1/#PodSpec)
進一步瞭解 `imagePullSecrets` 欄位。

<!--
##### Manually specifying an imagePullSecret

You can learn how to specify `imagePullSecrets` from the [container images](/docs/concepts/containers/images/#specifying-imagepullsecrets-on-a-pod)
documentation.
-->
##### 手動設定 imagePullSecret {#manually-specifying-an-imagepullsecret}

你可以透過閱讀[容器映象](/zh-cn/docs/concepts/containers/images/#specifying-imagepullsecrets-on-a-pod)
文件瞭解如何設定 `imagePullSecrets`。

<!--
##### Arranging for imagePullSecrets to be automatically attached

You can manually create `imagePullSecrets`, and reference these from
a ServiceAccount. Any Pods created with that ServiceAccount
or created with that ServiceAccount by default, will get their `imagePullSecrets`
field set to that of the service account.
See [Add ImagePullSecrets to a service account](/docs/tasks/configure-pod-container/configure-service-account/#add-imagepullsecrets-to-a-service-account)
 for a detailed explanation of that process.
-->
##### 設定 imagePullSecrets 為自動掛載 {#arranging-for-imagepullsecrets-to-be-automatically-attached}

你可以手動建立 `imagePullSecret`，並在一個 ServiceAccount 中引用它。
對使用該 ServiceAccount 建立的所有 Pod，或者預設使用該 ServiceAccount 建立的 Pod
而言，其 `imagePullSecrets` 欄位都會設定為該服務賬號。
請閱讀[向服務賬號新增 ImagePullSecrets](/zh-cn/docs/tasks/configure-pod-container/configure-service-account/#add-imagepullsecrets-to-a-service-account)
來詳細瞭解這一過程。

<!--
### Using Secrets with static Pods {#restriction-static-pod}

You cannot use ConfigMaps or Secrets with
{{< glossary_tooltip text="static Pods" term_id="static-pod" >}}.
-->
### 在靜態 Pod 中使用 Secret    {#restriction-static-pod}

你不可以在{{< glossary_tooltip text="靜態 Pod" term_id="static-pod" >}}.
中使用 ConfigMap 或 Secret。

<!--
## Use cases

### Use case: As container environment variables

Create a secret
-->
## 使用場景  {#use-case}

### 使用場景：作為容器環境變數 {#use-case-as-container-environment-variables}

建立 Secret：

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: mysecret
type: Opaque
data:
  USER_NAME: YWRtaW4=
  PASSWORD: MWYyZDFlMmU2N2Rm
```

<!--
Create the Secret:
-->
建立 Secret：

```shell
kubectl apply -f mysecret.yaml
```

<!--
Use `envFrom` to define all of the Secret's data as container environment variables. The key from the Secret becomes the environment variable name in the Pod.
-->
使用 `envFrom` 來將 Secret 的所有資料定義為容器的環境變數。
來自 Secret 的主鍵成為 Pod 中的環境變數名稱：

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: secret-test-pod
spec:
  containers:
    - name: test-container
      image: k8s.gcr.io/busybox
      command: [ "/bin/sh", "-c", "env" ]
      envFrom:
      - secretRef:
          name: mysecret
  restartPolicy: Never
```

<!--
### Use case: Pod with SSH keys

Create a Secret containing some SSH keys:
-->
### 使用場景：帶 SSH 金鑰的 Pod {#use-case-pod-with-ssh-keys}

建立包含一些 SSH 金鑰的 Secret：

```shell
kubectl create secret generic ssh-key-secret --from-file=ssh-privatekey=/path/to/.ssh/id_rsa --from-file=ssh-publickey=/path/to/.ssh/id_rsa.pub
```

<!--
The output is similar to:
-->
輸出類似於：

```
secret "ssh-key-secret" created
```

<!--
You can also create a `kustomization.yaml` with a `secretGenerator` field containing ssh keys.
-->
你也可以建立一個 `kustomization.yaml` 檔案，在其 `secretGenerator`
欄位中包含 SSH 金鑰。

{{< caution >}}
<!--
Think carefully before sending your own SSH keys: other users of the cluster may have access
to the Secret.
-->
在提供你自己的 SSH 金鑰之前要仔細思考：叢集的其他使用者可能有權訪問該 Secret。

<!--
You could instead create an SSH private key representing a service identity that you want to be
accessible to all the users with whom you share the Kubernetes cluster, and that you can revoke
if the credentials are compromised.
-->
你也可以建立一個 SSH 私鑰，代表一個你希望與你共享 Kubernetes 叢集的其他使用者分享的服務標識。
當憑據資訊被洩露時，你可以收回該訪問許可權。
{{< /caution >}}

<!--
Now you can create a Pod which references the secret with the SSH key and
consumes it in a volume:
-->
現在你可以建立一個 Pod，在其中訪問包含 SSH 金鑰的 Secret，並透過卷的方式來使用它：

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: secret-test-pod
  labels:
    name: secret-test
spec:
  volumes:
  - name: secret-volume
    secret:
      secretName: ssh-key-secret
  containers:
  - name: ssh-test-container
    image: mySshImage
    volumeMounts:
    - name: secret-volume
      readOnly: true
      mountPath: "/etc/secret-volume"
```

<!--
When the container's command runs, the pieces of the key will be available in:
-->
容器命令執行時，秘鑰的資料可以在下面的位置訪問到：

```
/etc/secret-volume/ssh-publickey
/etc/secret-volume/ssh-privatekey
```

<!--
The container is then free to use the secret data to establish an SSH connection.
-->
容器就可以隨便使用 Secret 資料來建立 SSH 連線。

<!--
### Use case: Pods with prod / test credentials

This example illustrates a Pod which consumes a secret containing production
credentials and another Pod which consumes a secret with test environment
credentials.

You can create a `kustomization.yaml` with a `secretGenerator` field or run
`kubectl create secret`.
-->
### 使用場景：帶有生產、測試環境憑據的 Pod {#use-case-pods-with-prod-test-credentials}

這一示例所展示的一個 Pod 會使用包含生產環境憑據的 Secret，另一個 Pod
使用包含測試環境憑據的 Secret。

你可以建立一個帶有 `secretGenerator` 欄位的 `kustomization.yaml` 檔案或者執行
`kubectl create secret` 來建立 Secret。

```shell
kubectl create secret generic prod-db-secret --from-literal=username=produser --from-literal=password=Y4nys7f11
```

<!--
The output is similar to:
-->
輸出類似於：

```
secret "prod-db-secret" created
```

<!--
You can also create a secret for test environment credentials.
-->
你也可以建立一個包含測試環境憑據的 Secret：

```shell
kubectl create secret generic test-db-secret --from-literal=username=testuser --from-literal=password=iluvtests
```

<!--
The output is similar to:
-->
輸出類似於：

```
secret "test-db-secret" created
```

{{< note >}}
<!--
Special characters such as `$`, `\`, `*`, `=`, and `!` will be interpreted by your [shell](https://en.wikipedia.org/wiki/Shell_(computing)) and require escaping.
-->
特殊字元（例如 `$`、`\`、`*`、`=` 和 `!`）會被你的
[Shell](https://en.wikipedia.org/wiki/Shell_(computing))解釋，因此需要轉義。

<!--
In most shells, the easiest way to escape the password is to surround it with single quotes (`'`).
For example, if your actual password is `S!B\*d$zDsb=`, you should execute the command this way:
-->
在大多數 Shell 中，對密碼進行轉義的最簡單方式是用單引號（`'`）將其括起來。
例如，如果你的實際密碼是 `S!B\*d$zDsb`，則應透過以下方式執行命令：

```shell
kubectl create secret generic dev-db-secret --from-literal=username=devuser --from-literal=password='S!B\*d$zDsb='
```
<!--
You do not need to escape special characters in passwords from files (`--from-file`).
-->
你無需對檔案中的密碼（`--from-file`）中的特殊字元進行轉義。
{{< /note >}}

<!--
Now make the Pods:
-->
現在生成 Pod：

```shell
cat <<EOF > pod.yaml
apiVersion: v1
kind: List
items:
- kind: Pod
  apiVersion: v1
  metadata:
    name: prod-db-client-pod
    labels:
      name: prod-db-client
  spec:
    volumes:
    - name: secret-volume
      secret:
        secretName: prod-db-secret
    containers:
    - name: db-client-container
      image: myClientImage
      volumeMounts:
      - name: secret-volume
        readOnly: true
        mountPath: "/etc/secret-volume"
- kind: Pod
  apiVersion: v1
  metadata:
    name: test-db-client-pod
    labels:
      name: test-db-client
  spec:
    volumes:
    - name: secret-volume
      secret:
        secretName: test-db-secret
    containers:
    - name: db-client-container
      image: myClientImage
      volumeMounts:
      - name: secret-volume
        readOnly: true
        mountPath: "/etc/secret-volume"
EOF
```

<!--
Add the pods to the same `kustomization.yaml`:
-->
將 Pod 新增到同一 `kustomization.yaml` 檔案中：

```shell
cat <<EOF >> kustomization.yaml
resources:
- pod.yaml
EOF
```

<!--
Apply all those objects on the API server by running:
-->
透過下面的命令在 API 伺服器上應用所有這些物件：

```shell
kubectl apply -k .
```

<!--
Both containers will have the following files present on their filesystems with the values
for each container's environment:
-->
兩個檔案都會在其檔案系統中出現下面面的檔案，檔案中內容是各個容器的環境值：

```
/etc/secret-volume/username
/etc/secret-volume/password
```

<!--
Note how the specs for the two Pods differ only in one field; this facilitates
creating Pods with different capabilities from a common Pod template.
-->
注意這兩個 Pod 的規約中只有一個欄位不同。
這便於基於相同的 Pod 模板生成具有不同能力的 Pod。

<!--
You could further simplify the base Pod specification by using two service accounts:

1. `prod-user` with the `prod-db-secret`
1. `test-user` with the `test-db-secret`

The Pod specification is shortened to:
-->
你可以透過使用兩個服務賬號來進一步簡化這一基本的 Pod 規約：

1. `prod-user` 服務賬號使用 `prod-db-secret`
1. `test-user` 服務賬號使用 `test-db-secret`

Pod 規約簡化為：

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: prod-db-client-pod
  labels:
    name: prod-db-client
spec:
  serviceAccount: prod-db-client
  containers:
  - name: db-client-container
    image: myClientImage
```

<!--
### Use case: dotfiles in a secret volume

You can make your data "hidden" by defining a key that begins with a dot.
This key represents a dotfile or "hidden" file. For example, when the following secret
is mounted into a volume, `secret-volume`:
-->
### 使用場景：在 Secret 卷中帶句點的檔案 {#use-case-dotfiles-in-a-secret-volume}

透過定義以句點（`.`）開頭的主鍵，你可以“隱藏”你的資料。
這些主鍵代表的是以句點開頭的檔案或“隱藏”檔案。
例如，當下面的 Secret 被掛載到 `secret-volume` 卷中時：

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: dotfile-secret
data:
  .secret-file: dmFsdWUtMg0KDQo=
---
apiVersion: v1
kind: Pod
metadata:
  name: secret-dotfiles-pod
spec:
  volumes:
  - name: secret-volume
    secret:
      secretName: dotfile-secret
  containers:
  - name: dotfile-test-container
    image: k8s.gcr.io/busybox
    command:
    - ls
    - "-l"
    - "/etc/secret-volume"
    volumeMounts:
    - name: secret-volume
      readOnly: true
      mountPath: "/etc/secret-volume"
```

<!--
The volume will contain a single file, called `.secret-file`, and
the `dotfile-test-container` will have this file present at the path
`/etc/secret-volume/.secret-file`.
-->
卷中會包含一個名為 `.secret-file` 的檔案，並且容器 `dotfile-test-container`
中此檔案位於路徑 `/etc/secret-volume/.secret-file` 處。

{{< note >}}
<!--
Files beginning with dot characters are hidden from the output of  `ls -l`;
you must use `ls -la` to see them when listing directory contents.
-->
以句點開頭的檔案會在 `ls -l` 的輸出中被隱藏起來；
列舉目錄內容時你必須使用 `ls -la` 才能看到它們。
{{< /note >}}

<!--
### Use case: Secret visible to one container in a Pod

Consider a program that needs to handle HTTP requests, do some complex business
logic, and then sign some messages with an HMAC. Because it has complex
application logic, there might be an unnoticed remote file reading exploit in
the server, which could expose the private key to an attacker.
-->
### 使用場景：僅對 Pod 中一個容器可見的 Secret {#use-case-secret-visible-to-one-container-in-a-pod}

考慮一個需要處理 HTTP 請求，執行某些複雜的業務邏輯，之後使用 HMAC
來對某些訊息進行簽名的程式。因為這一程式的應用邏輯很複雜，
其中可能包含未被注意到的遠端伺服器檔案讀取漏洞，
這種漏洞可能會把私鑰暴露給攻擊者。

<!--
This could be divided into two processes in two containers: a frontend container
which handles user interaction and business logic, but which cannot see the
private key; and a signer container that can see the private key, and responds
to simple signing requests from the frontend (for example, over localhost networking).
-->
這一程式可以分隔成兩個容器中的兩個程序：前端容器要處理使用者互動和業務邏輯，
但無法看到私鑰；簽名容器可以看到私鑰，並對來自前端的簡單簽名請求作出響應
（例如，透過本地主機網路）。

<!--
With this partitioned approach, an attacker now has to trick the application
server into doing something rather arbitrary, which may be harder than getting
it to read a file.
-->
採用這種劃分的方法，攻擊者現在必須欺騙應用伺服器來做一些其他操作，
而這些操作可能要比讀取一個檔案要複雜很多。

<!--
## Types of Secret {#secret-types}

When creating a Secret, you can specify its type using the `type` field of
the [Secret](/docs/reference/kubernetes-api/config-and-storage-resources/secret-v1/)
resource, or certain equivalent `kubectl` command line flags (if available).
The Secret type is used to facilitate programmatic handling of the Secret data.

Kubernetes provides several built-in types for some common usage scenarios.
These types vary in terms of the validations performed and the constraints
Kubernetes imposes on them.
-->
## Secret 的型別  {#secret-types}

建立 Secret 時，你可以使用 [Secret](/docs/reference/kubernetes-api/config-and-storage-resources/secret-v1/)
資源的 `type` 欄位，或者與其等價的 `kubectl` 命令列引數（如果有的話）為其設定型別。
Secret 型別有助於對 Secret 資料進行程式設計處理。

Kubernetes 提供若干種內建的型別，用於一些常見的使用場景。
針對這些型別，Kubernetes 所執行的合法性檢查操作以及對其所實施的限制各不相同。

<!--
| Built-in Type | Usage |
|--------------|-------|
| `Opaque`     |  arbitrary user-defined data |
| `kubernetes.io/service-account-token` | ServiceAccount token |
| `kubernetes.io/dockercfg` | serialized `~/.dockercfg` file |
| `kubernetes.io/dockerconfigjson` | serialized `~/.docker/config.json` file |
| `kubernetes.io/basic-auth` | credentials for basic authentication |
| `kubernetes.io/ssh-auth` | credentials for SSH authentication |
| `kubernetes.io/tls` | data for a TLS client or server |
| `bootstrap.kubernetes.io/token` | bootstrap token data |
-->
| 內建型別     | 用法  |
|--------------|-------|
| `Opaque`     | 使用者定義的任意資料 |
| `kubernetes.io/service-account-token` | 服務賬號令牌 |
| `kubernetes.io/dockercfg` | `~/.dockercfg` 檔案的序列化形式 |
| `kubernetes.io/dockerconfigjson` | `~/.docker/config.json` 檔案的序列化形式 |
| `kubernetes.io/basic-auth` | 用於基本身份認證的憑據 |
| `kubernetes.io/ssh-auth` | 用於 SSH 身份認證的憑據 |
| `kubernetes.io/tls` | 用於 TLS 客戶端或者伺服器端的資料 |
| `bootstrap.kubernetes.io/token` | 啟動引導令牌資料 |

<!--
You can define and use your own Secret type by assigning a non-empty string as the
`type` value for a Secret object (an empty string is treated as an `Opaque` type).
-->
透過為 Secret 物件的 `type` 欄位設定一個非空的字串值，你也可以定義並使用自己
Secret 型別（如果 `type` 值為空字串，則被視為 `Opaque` 型別）。

<!--
Kubernetes doesn't impose any constraints on the type name. However, if you
are using one of the built-in types, you must meet all the requirements defined
for that type.
-->
Kubernetes 並不對型別的名稱作任何限制。不過，如果你要使用內建型別之一，
則你必須滿足為該型別所定義的所有要求。

<!--
If you are defining a type of secret that's for public use, follow the convention
and structure the secret type to have your domain name before the name, separated
by a `/`. For example: `cloud-hosting.example.net/cloud-api-credentials`.
-->
如果你要定義一種公開使用的 Secret 型別，請遵守 Secret 型別的約定和結構，
在型別名簽名新增域名，並用 `/` 隔開。
例如：`cloud-hosting.example.net/cloud-api-credentials`。

<!--
### Opaque secrets

`Opaque` is the default Secret type if omitted from a Secret configuration file.
When you create a Secret using `kubectl`, you will use the `generic`
subcommand to indicate an `Opaque` Secret type. For example, the following
command creates an empty Secret of type `Opaque`.
-->
### Opaque Secret

當 Secret 配置檔案中未作顯式設定時，預設的 Secret 型別是 `Opaque`。
當你使用 `kubectl` 來建立一個 Secret 時，你會使用 `generic` 子命令來標明
要建立的是一個 `Opaque` 型別 Secret。
例如，下面的命令會建立一個空的 `Opaque` 型別 Secret 物件：

```shell
kubectl create secret generic empty-secret
kubectl get secret empty-secret
```

<!--
The output looks like:
-->
輸出類似於

```
NAME           TYPE     DATA   AGE
empty-secret   Opaque   0      2m6s
```

<!--
The `DATA` column shows the number of data items stored in the Secret.
In this case, `0` means you have created an empty Secret.
-->
`DATA` 列顯示 Secret 中儲存的資料條目個數。
在這個例子種，`0` 意味著你剛剛建立了一個空的 Secret。

<!--
### Service account token Secrets

A `kubernetes.io/service-account-token` type of Secret is used to store a
token credential that identifies a
{{< glossary_tooltip text="service account" term_id="service-account" >}}.
-->
### 服務賬號令牌 Secret  {#service-account-token-secrets}

型別為 `kubernetes.io/service-account-token` 的 Secret
用來存放標識某{{< glossary_tooltip text="服務賬號" term_id="service-account" >}}的令牌憑據。

<!--
Since 1.22, this type of Secret is no longer used to mount credentials into Pods,
and obtaining tokens via the [TokenRequest](/docs/reference/kubernetes-api/authentication-resources/token-request-v1/)
API is recommended instead of using service account token Secret objects.
Tokens obtained from the `TokenRequest` API are more secure than ones stored in Secret objects,
because they have a bounded lifetime and are not readable by other API clients.
You can use the [`kubectl create token`](/docs/reference/generated/kubectl/kubectl-commands#-em-token-em-)
command to obtain a token from the `TokenRequest` API.
-->
從 v1.22 開始，這種型別的 Secret 不再被用來向 Pod 中載入憑據資料，
建議透過 [TokenRequest](/zh-cn/docs/reference/kubernetes-api/authentication-resources/token-request-v1/)
API 來獲得令牌，而不是使用服務賬號令牌 Secret 物件。
透過 `TokenRequest` API 獲得的令牌比儲存在 Secret 物件中的令牌更加安全，
因為這些令牌有著被限定的生命期，並且不會被其他 API 客戶端讀取。
你可以使用 [`kubectl create token`](/docs/reference/generated/kubectl/kubectl-commands#-em-token-em-)
命令呼叫 `TokenRequest` API 獲得令牌。

<!--
You should only create a service account token Secret object
if you can't use the `TokenRequest` API to obtain a token,
and the security exposure of persisting a non-expiring token credential
in a readable API object is acceptable to you.
-->
只有在你無法使用 `TokenRequest` API 來獲取令牌，
並且你能夠接受因為將永不過期的令牌憑據寫入到可讀取的 API 物件而帶來的安全風險時，
才應該建立服務賬號令牌 Secret 物件。

<!--
When using this Secret type, you need to ensure that the
`kubernetes.io/service-account.name` annotation is set to an existing
service account name. If you are creating both the ServiceAccount and
the Secret objects, you should create the ServiceAccount object first.
-->
使用這種 Secret 型別時，你需要確保物件的註解 `kubernetes.io/service-account-name`
被設定為某個已有的服務賬號名稱。
如果你同時負責 ServiceAccount 和 Secret 物件的建立，應該先建立 ServiceAccount 物件。

<!--

After the Secret is created, a Kubernetes {{< glossary_tooltip text="controller" term_id="controller" >}}
fills in some other fields such as the `kubernetes.io/service-account.uid` annotation, and the
`token` key in the `data` field, which is set to contain an authentication token.

The following example configuration declares a service account token Secret:
-->
當 Secret 物件被建立之後，某個 Kubernetes{{< glossary_tooltip text="控制器" term_id="controller" >}}會填寫
Secret 的其它欄位，例如 `kubernetes.io/service-account.uid` 註解以及 `data` 欄位中的
`token` 鍵值，使之包含實際的令牌內容。

下面的配置例項聲明瞭一個服務賬號令牌 Secret：

<!--
```yaml
apiVersion: v1
kind: Secret
metadata:
  name: secret-sa-sample
  annotations:
    kubernetes.io/service-account.name: "sa-name"
type: kubernetes.io/service-account-token
data:
  # You can include additional key value pairs as you do with Opaque Secrets
  extra: YmFyCg==
```
-->
```yaml
apiVersion: v1
kind: Secret
metadata:
  name: secret-sa-sample
  annotations:
    kubernetes.io/service-account.name: "sa-name"
type: kubernetes.io/service-account-token
data:
  # 你可以像 Opaque Secret 一樣在這裡新增額外的鍵/值偶對
  extra: YmFyCg==
```

<!--
After creating the Secret, wait for Kubernetes to populate the `token` key in the `data` field.
-->
建立了 Secret 之後，等待 Kubernetes 在 `data` 欄位中填充 `token` 主鍵。

<!--
See the [ServiceAccount](/docs/tasks/configure-pod-container/configure-service-account/)
documentation for more information on how service accounts work.  
You can also check the `automountServiceAccountToken` field and the
`serviceAccountName` field of the
[`Pod`](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#pod-v1-core)
for information on referencing service account credentials from within Pods.
-->
參考 [ServiceAccount](/zh-cn/docs/tasks/configure-pod-container/configure-service-account/)
文件瞭解服務賬號的工作原理。你也可以檢視
[`Pod`](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#pod-v1-core)
資源中的 `automountServiceAccountToken` 和 `serviceAccountName` 欄位文件，
進一步瞭解從 Pod 中引用服務賬號憑據。

<!--
### Docker config Secrets

You can use one of the following `type` values to create a Secret to
store the credentials for accessing a container image registry:
-->
### Docker 配置 Secret  {#docker-config-secrets}

你可以使用下面兩種 `type` 值之一來建立 Secret，用以存放用於訪問容器映象倉庫的憑據：

- `kubernetes.io/dockercfg`
- `kubernetes.io/dockerconfigjson`

<!--
The `kubernetes.io/dockercfg` type is reserved to store a serialized
`~/.dockercfg` which is the legacy format for configuring Docker command line.
When using this Secret type, you have to ensure the Secret `data` field
contains a `.dockercfg` key whose value is content of a `~/.dockercfg` file
encoded in the base64 format.
-->
`kubernetes.io/dockercfg` 是一種保留型別，用來存放 `~/.dockercfg` 檔案的序列化形式。
該檔案是配置 Docker 命令列的一種老舊形式。使用此 Secret 型別時，你需要確保
Secret 的 `data` 欄位中包含名為 `.dockercfg` 的主鍵，其對應鍵值是用 base64
編碼的某 `~/.dockercfg` 檔案的內容。

<!--
The `kubernetes.io/dockerconfigjson` type is designed for storing a serialized
JSON that follows the same format rules as the `~/.docker/config.json` file
which is a new format for `~/.dockercfg`.
When using this Secret type, the `data` field of the Secret object must
contain a `.dockerconfigjson` key, in which the content for the
`~/.docker/config.json` file is provided as a base64 encoded string.

Below is an example for a `kubernetes.io/dockercfg` type of Secret:
-->
型別 `kubernetes.io/dockerconfigjson` 被設計用來儲存 JSON 資料的序列化形式，
該 JSON 也遵從 `~/.docker/config.json` 檔案的格式規則，而後者是 `~/.dockercfg`
的新版本格式。使用此 Secret 型別時，Secret 物件的 `data` 欄位必須包含
`.dockerconfigjson` 鍵，其鍵值為 base64 編碼的字串包含 `~/.docker/config.json`
檔案的內容。

下面是一個 `kubernetes.io/dockercfg` 型別 Secret 的示例：

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: secret-dockercfg
type: kubernetes.io/dockercfg
data:
  .dockercfg: |
    "<base64 encoded ~/.dockercfg file>"
```

{{< note >}}
<!--
If you do not want to perform the base64 encoding, you can choose to use the
`stringData` field instead.
-->
如果你不希望執行 base64 編碼轉換，可以使用 `stringData` 欄位代替。
{{< /note >}}

<!--
When you create these types of Secrets using a manifest, the API
server checks whether the expected key exists in the `data` field, and
it verifies if the value provided can be parsed as a valid JSON. The API
server doesn't validate if the JSON actually is a Docker config file.

When you do not have a Docker config file, or you want to use `kubectl`
to create a Secret for accessing a container registry, you can do:
-->
當你使用清單檔案來建立這兩類 Secret 時，API 伺服器會檢查 `data` 欄位中是否
存在所期望的主鍵，並且驗證其中所提供的鍵值是否是合法的 JSON 資料。
不過，API 伺服器不會檢查 JSON 資料本身是否是一個合法的 Docker 配置檔案內容。


當你沒有 Docker 配置檔案，或者你想使用 `kubectl` 建立一個 Secret
來訪問容器倉庫時，你可以這樣做：

```shell
kubectl create secret docker-registry secret-tiger-docker \
  --docker-email=tiger@acme.example \
  --docker-username=tiger \
  --docker-password=pass1234 \
  --docker-server=my-registry.example:5000
```

<!--
That command creates a Secret of type `kubernetes.io/dockerconfigjson`.
If you dump the `.data.dockerconfigjson` field from that new Secret and then
decode it from base64:
-->
上面的命令建立一個型別為 `kubernetes.io/dockerconfigjson` 的 Secret。
如果你對 `.data.dockerconfigjson` 內容進行轉儲並執行 base64 解碼：

```shell
kubectl get secret secret-tiger-docker -o jsonpath='{.data.*}' | base64 -d
```

<!--
then the output is equivalent to this JSON document (which is also a valid
Docker configuration file):
-->
那麼輸出等價於這個 JSON 文件（這也是一個有效的 Docker 配置檔案）：

```json
{
  "auths": {
    "my-registry.example:5000": {
      "username": "tiger",
      "password": "pass1234",
      "email": "tiger@acme.example",
      "auth": "dGlnZXI6cGFzczEyMzQ="
    }
  }
}
```

{{< note >}}
<!--
The `auth` value there is base64 encoded; it is obscured but not secret.
Anyone who can read that Secret can learn the registry access bearer token.
-->
`auths` 值是 base64 編碼的，其內容被遮蔽但未被加密。
任何能夠讀取該 Secret 的人都可以瞭解映象庫的訪問令牌。
{{< /note >}}

<!--
### Basic authentication Secret

The `kubernetes.io/basic-auth` type is provided for storing credentials needed
for basic authentication. When using this Secret type, the `data` field of the
Secret must contain one of the following two keys:

- `username`: the user name for authentication
- `password`: the password or token for authentication
-->
### 基本身份認證 Secret  {#basic-authentication-secret}

`kubernetes.io/basic-auth` 型別用來存放用於基本身份認證所需的憑據資訊。
使用這種 Secret 型別時，Secret 的 `data` 欄位必須包含以下兩個鍵之一：

- `username`: 用於身份認證的使用者名稱；
- `password`: 用於身份認證的密碼或令牌。

<!--
Both values for the above two keys are base64 encoded strings. You can, of
course, provide the clear text content using the `stringData` for Secret
creation.

The following manifest is an example of a basic authentication Secret:
-->
以上兩個鍵的鍵值都是 base64 編碼的字串。
當然你也可以在建立 Secret 時使用 `stringData` 欄位來提供明文形式的內容。
以下清單是基本身份驗證 Secret 的示例：

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: secret-basic-auth
type: kubernetes.io/basic-auth
stringData:
  username: admin      # kubernetes.io/basic-auth 型別的必需欄位
  password: t0p-Secret # kubernetes.io/basic-auth 型別的必需欄位
```

<!--
The basic authentication Secret type is provided only for convenience.
You can create an `Opaque` type for credentials used for basic authentication.
However, using the defined and public Secret type (`kubernetes.io/basic-auth`) helps other
people to understand the purpose of your Secret, and sets a convention for what key names
to expect.
The Kubernetes API verifies that the required keys are set for a Secret
of this type.
-->
提供基本身份認證型別的 Secret 僅僅是出於方便性考慮。
你也可以使用 `Opaque` 型別來儲存用於基本身份認證的憑據。
不過，使用預定義的、公開的 Secret 型別（`kubernetes.io/basic-auth`）
有助於幫助其他使用者理解 Secret 的目的，並且對其中存在的主鍵形成一種約定。
API 伺服器會檢查 Secret 配置中是否提供了所需要的主鍵。

<!--
### SSH authentication secrets

The builtin type `kubernetes.io/ssh-auth` is provided for storing data used in
SSH authentication. When using this Secret type, you will have to specify a
`ssh-privatekey` key-value pair in the `data` (or `stringData`) field
as the SSH credential to use.

The following manifest is an example of a Secret used for SSH public/private
key authentication:
-->
### SSH 身份認證 Secret {#ssh-authentication-secrets}

Kubernetes 所提供的內建型別 `kubernetes.io/ssh-auth` 用來存放 SSH 身份認證中
所需要的憑據。使用這種 Secret 型別時，你就必須在其 `data` （或 `stringData`）
欄位中提供一個 `ssh-privatekey` 鍵值對，作為要使用的 SSH 憑據。

下面的清單是一個 SSH 公鑰/私鑰身份認證的 Secret 示例：

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: secret-ssh-auth
type: kubernetes.io/ssh-auth
data:
  # 此例中的實際資料被截斷
  ssh-privatekey: |
     MIIEpQIBAAKCAQEAulqb/Y ...
```

<!--
The SSH authentication Secret type is provided only for user's convenience.
You could instead create an `Opaque` type Secret for credentials used for SSH authentication.
However, using the defined and public Secret type (`kubernetes.io/ssh-auth`) helps other
people to understand the purpose of your Secret, and sets a convention for what key names
to expect.
and the API server does verify if the required keys are provided in a Secret
configuration.
-->
提供 SSH 身份認證型別的 Secret 僅僅是出於使用者方便性考慮。
你也可以使用 `Opaque` 型別來儲存用於 SSH 身份認證的憑據。
不過，使用預定義的、公開的 Secret 型別（`kubernetes.io/ssh-auth`）
有助於其他人理解你的 Secret 的用途，也可以就其中包含的主鍵名形成約定。
API 伺服器確實會檢查 Secret 配置中是否提供了所需要的主鍵。

{{< caution >}}
<!--
SSH private keys do not establish trusted communication between an SSH client and
host server on their own. A secondary means of establishing trust is needed to
mitigate "man in the middle" attacks, such as a `known_hosts` file added to a
ConfigMap.
-->
SSH 私鑰自身無法建立 SSH 客戶端與伺服器端之間的可信連線。
需要其它方式來建立這種信任關係，以緩解“中間人（Man In The Middle）”
攻擊，例如向 ConfigMap 中新增一個 `known_hosts` 檔案。
{{< /caution >}}

<!--
### TLS secrets

Kubernetes provides a builtin Secret type `kubernetes.io/tls` for storing
a certificate and its associated key that are typically used for TLS.

One common use for TLS secrets is to configure encryption in transit for
an [Ingress](/docs/concepts/services-networking/ingress/), but you can also use it
with other resources or directly in your workload.
When using this type of Secret, the `tls.key` and the `tls.crt` key must be provided
in the `data` (or `stringData`) field of the Secret configuration, although the API
server doesn't actually validate the values for each key.

The following YAML contains an example config for a TLS Secret:
-->
### TLS Secret

Kubernetes 提供一種內建的 `kubernetes.io/tls` Secret 型別，用來存放 TLS
場合通常要使用的證書及其相關金鑰。
TLS Secret 的一種典型用法是為 [Ingress](/zh-cn/docs/concepts/services-networking/ingress/)
資源配置傳輸過程中的資料加密，不過也可以用於其他資源或者直接在負載中使用。
當使用此型別的 Secret 時，Secret 配置中的 `data` （或 `stringData`）欄位必須包含
`tls.key` 和 `tls.crt` 主鍵，儘管 API 伺服器實際上並不會對每個鍵的取值作進一步的合法性檢查。

下面的 YAML 包含一個 TLS Secret 的配置示例：

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: secret-tls
type: kubernetes.io/tls
data:
  # 此例中的資料被截斷
  tls.crt: |
    MIIC2DCCAcCgAwIBAgIBATANBgkqh ...
  tls.key: |
    MIIEpgIBAAKCAQEA7yn3bRHQ5FHMQ ...
```

<!--
The TLS Secret type is provided for user's convenience. You can create an `Opaque`
for credentials used for TLS server and/or client. However, using the builtin Secret
type helps ensure the consistency of Secret format in your project; the API server
does verify if the required keys are provided in a Secret configuration.

When creating a TLS Secret using `kubectl`, you can use the `tls` subcommand
as shown in the following example:
-->
提供 TLS 型別的 Secret 僅僅是出於使用者方便性考慮。
你也可以使用 `Opaque` 型別來儲存用於 TLS 伺服器與/或客戶端的憑據。
不過，使用內建的 Secret 型別的有助於對憑據格式進行歸一化處理，並且
API 伺服器確實會檢查 Secret 配置中是否提供了所需要的主鍵。

當使用 `kubectl` 來建立 TLS Secret 時，你可以像下面的例子一樣使用 `tls`
子命令：

```shell
kubectl create secret tls my-tls-secret \
  --cert=path/to/cert/file \
  --key=path/to/key/file
```

<!--
The public/private key pair must exist before hand. The public key certificate
for `--cert` must be DER format as per
[Section 5.1 of RFC 7468](https://datatracker.ietf.org/doc/html/rfc7468#section-5.1),
and must match the given private key for `--key` (PKCS #8 in DER format;
[Section 11 of RFC 7468](https://datatracker.ietf.org/doc/html/rfc7468#section-11)).
-->
這裡的公鑰/私鑰對都必須事先已存在。用於 `--cert` 的公鑰證書必須是
[RFC 7468 中 5.1 節](https://datatracker.ietf.org/doc/html/rfc7468#section-5.1)
中所規定的 DER 格式，且與 `--key` 所給定的私鑰匹配。
私鑰必須是 DER 格式的 PKCS #8
（參見 [RFC 7468 第 11節](https://datatracker.ietf.org/doc/html/rfc7468#section-11)）。

{{< note >}}
<!--
A kubernetes.io/tls Secret stores the Base64-encoded DER data for keys and
certificates. If you're familiar with PEM format for private keys and for certificates,
the base64 data are the same as that format except that you omit
the initial and the last lines that are used in PEM.
-->
型別為 `kubernetes.io/tls` 的 Secret 中包含金鑰和證書的 DER 資料，以 Base64 格式編碼。
如果你熟悉私鑰和證書的 PEM 格式，base64 與該格式相同，只是你需要略過 PEM
資料中所包含的第一行和最後一行。

<!--
For example, for a certificate, you do **not** include `--------BEGIN CERTIFICATE-----`
and `-------END CERTIFICATE----`.
-->
例如，對於證書而言，你 **不要** 包含 `--------BEGIN CERTIFICATE-----`
和 `-------END CERTIFICATE----` 這兩行。
{{< /note >}}

<!--
### Bootstrap token Secrets

A bootstrap token Secret can be created by explicitly specifying the Secret
`type` to `bootstrap.kubernetes.io/token`. This type of Secret is designed for
tokens used during the node bootstrap process. It stores tokens used to sign
well-known ConfigMaps.
-->
### 啟動引導令牌 Secret  {#bootstrap-token-secrets}

透過將 Secret 的 `type` 設定為 `bootstrap.kubernetes.io/token` 可以建立
啟動引導令牌型別的 Secret。這種型別的 Secret 被設計用來支援節點的啟動引導過程。
其中包含用來為周知的 ConfigMap 簽名的令牌。

<!--
A bootstrap token Secret is usually created in the `kube-system` namespace and
named in the form `bootstrap-token-<token-id>` where `<token-id>` is a 6 character
string of the token ID.

As a Kubernetes manifest, a bootstrap token Secret might look like the
following:
-->
啟動引導令牌 Secret 通常創建於 `kube-system` 名字空間內，並以
`bootstrap-token-<令牌 ID>` 的形式命名；其中 `<令牌 ID>` 是一個由 6 個字元組成
的字串，用作令牌的標識。

以 Kubernetes 清單檔案的形式，某啟動引導令牌 Secret 可能看起來像下面這樣：

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: bootstrap-token-5emitj
  namespace: kube-system
type: bootstrap.kubernetes.io/token
data:
  auth-extra-groups: c3lzdGVtOmJvb3RzdHJhcHBlcnM6a3ViZWFkbTpkZWZhdWx0LW5vZGUtdG9rZW4=
  expiration: MjAyMC0wOS0xM1QwNDozOToxMFo=
  token-id: NWVtaXRq
  token-secret: a3E0Z2lodnN6emduMXAwcg==
  usage-bootstrap-authentication: dHJ1ZQ==
  usage-bootstrap-signing: dHJ1ZQ==
```

<!--
A bootstrap type Secret has the following keys specified under `data`:

- `token-id`: A random 6 character string as the token identifier. Required.
- `token-secret`: A random 16 character string as the actual token secret. Required.
- `description`: A human-readable string that describes what the token is
  used for. Optional.
- `expiration`: An absolute UTC time using RFC3339 specifying when the token
  should be expired. Optional.
- `usage-bootstrap-<usage>`: A boolean flag indicating additional usage for
  the bootstrap token.
- `auth-extra-groups`: A comma-separated list of group names that will be
  authenticated as in addition to the `system:bootstrappers` group.
-->
啟動引導令牌型別的 Secret 會在 `data` 欄位中包含如下主鍵：

- `token-id`：由 6 個隨機字元組成的字串，作為令牌的識別符號。必需。
- `token-secret`：由 16 個隨機字元組成的字串，包含實際的令牌機密。必需。
- `description`：供使用者閱讀的字串，描述令牌的用途。可選。
- `expiration`：一個使用 RFC3339 來編碼的 UTC 絕對時間，給出令牌要過期的時間。可選。
- `usage-bootstrap-<usage>`：布林型別的標誌，用來標明啟動引導令牌的其他用途。
- `auth-extra-groups`：用逗號分隔的組名列表，身份認證時除被認證為
  `system:bootstrappers` 組之外，還會被新增到所列的使用者組中。

<!--
The above YAML may look confusing because the values are all in base64 encoded
strings. In fact, you can create an identical Secret using the following YAML:

```yaml
apiVersion: v1
kind: Secret
metadata:
  # Note how the Secret is named
  name: bootstrap-token-5emitj
  # A bootstrap token Secret usually resides in the kube-system namespace
  namespace: kube-system
type: bootstrap.kubernetes.io/token
stringData:
  auth-extra-groups: "system:bootstrappers:kubeadm:default-node-token"
  expiration: "2020-09-13T04:39:10Z"
  # This token ID is used in the name
  token-id: "5emitj"
  token-secret: "kq4gihvszzgn1p0r"
  # This token can be used for authentication
  usage-bootstrap-authentication: "true"
  # and it can be used for signing
  usage-bootstrap-signing: "true"
```
-->
上面的 YAML 檔案可能看起來令人費解，因為其中的數值均為 base64 編碼的字串。
實際上，你完全可以使用下面的 YAML 來建立一個一模一樣的 Secret：

```yaml
apiVersion: v1
kind: Secret
metadata:
  # 注意 Secret 的命名方式
  name: bootstrap-token-5emitj
  # 啟動引導令牌 Secret 通常位於 kube-system 名字空間
  namespace: kube-system
type: bootstrap.kubernetes.io/token
stringData:
  auth-extra-groups: "system:bootstrappers:kubeadm:default-node-token"
  expiration: "2020-09-13T04:39:10Z"
  # 此令牌 ID 被用於生成 Secret 名稱
  token-id: "5emitj"
  token-secret: "kq4gihvszzgn1p0r"
  # 此令牌還可用於 authentication （身份認證）
  usage-bootstrap-authentication: "true"
  # 且可用於 signing （證書籤名）
  usage-bootstrap-signing: "true"
```

<!--
## Immutable Secrets {#secret-immutable}
-->
## 不可更改的 Secret {#secret-immutable}

{{< feature-state for_k8s_version="v1.21" state="stable" >}}

<!--
Kubernetes lets you mark specific Secrets (and ConfigMaps) as _immutable_.
Preventing changes to the data of an existing Secret has the following benefits:

- protects you from accidental (or unwanted) updates that could cause applications outages
- (for clusters that extensively use Secrets - at least tens of thousands of unique Secret
  to Pod mounts), switching to immutable Secrets improves the performance of your cluster
  by significantly reducing load on kube-apiserver. The kubelet does not need to maintain
  a [watch] on any Secrets that are marked as immutable.
-->
Kubernetes 允許你將特定的 Secret（和 ConfigMap）標記為 **不可更改（Immutable）**。
禁止更改現有 Secret 的資料有下列好處：

- 防止意外（或非預期的）更新導致應用程式中斷
- （對於大量使用 Secret 的叢集而言，至少數萬個不同的 Secret 供 Pod 掛載），
  透過將 Secret 標記為不可變，可以極大降低 kube-apiserver 的負載，提升叢集效能。
  kubelet 不需要監視那些被標記為不可更改的 Secret。

<!--
### Marking a Secret as immutable {#secret-immutable-create}

You can create an immutable Secret by setting the `immutable` field to `true`. For example,
-->
### 將 Secret 標記為不可更改   {#secret-immutable-create}

你可以透過將 Secret 的 `immutable` 欄位設定為 `true` 建立不可更改的 Secret。
例如：

```yaml
apiVersion: v1
kind: Secret
metadata:
  ...
data:
  ...
immutable: true
```

<!--
You can also update any existing mutable Secret to make it immutable.
-->
你也可以更改現有的 Secret，令其不可更改。

{{< note >}}
<!--
Once a Secret or ConfigMap is marked as immutable, it is _not_ possible to revert this change
nor to mutate the contents of the `data` field. You can only delete and recreate the Secret.
Existing Pods maintain a mount point to the deleted Secret - it is recommended to recreate
these pods.
-->
一旦一個 Secret 或 ConfigMap 被標記為不可更改，撤銷此操作或者更改 `data`
欄位的內容都是 **不** 可能的。
只能刪除並重新建立這個 Secret。現有的 Pod 將維持對已刪除 Secret 的掛載點 --
建議重新建立這些 Pod。
{{< /note >}}

<!--
## Information security for Secrets

Although ConfigMap and Secret work similarly, Kubernetes applies some additional
protection for Secret objects.
-->
## Secret 的資訊保安問題 {#information-security-for-secrets}

儘管 ConfigMap 和 Secret 的工作方式類似，但 Kubernetes 對 Secret 有一些額外的保護。

<!--
Secrets often hold values that span a spectrum of importance, many of which can
cause escalations within Kubernetes (e.g. service account tokens) and to
external systems. Even if an individual app can reason about the power of the
Secrets it expects to interact with, other apps within the same namespace can
render those assumptions invalid.
-->
Secret 通常儲存重要性各異的數值，其中很多都可能會導致 Kubernetes 中
（例如，服務賬號令牌）或對外部系統的特權提升。
即使某些個別應用能夠推導它期望使用的 Secret 的能力，
同一名字空間中的其他應用可能會讓這種假定不成立。

<!--
A Secret is only sent to a node if a Pod on that node requires it.
For mounting secrets into Pods, the kubelet stores a copy of the data into a `tmpfs`
so that the confidential data is not written to durable storage.
Once the Pod that depends on the Secret is deleted, the kubelet deletes its local copy
of the confidential data from the Secret.
-->
只有當某個節點上的 Pod 需要某 Secret 時，對應的 Secret 才會被髮送到該節點上。
如果將 Secret 掛載到 Pod 中，kubelet 會將資料的副本儲存在在 `tmpfs` 中，
這樣機密的資料不會被寫入到永續性儲存中。
一旦依賴於該 Secret 的 Pod 被刪除，kubelet 會刪除來自於該 Secret 的機密資料的本地副本。

<!--
There may be several containers in a Pod. By default, containers you define
only have access to the default ServiceAccount and its related Secret.
You must explicitly define environment variables or map a volume into a
container in order to provide access to any other Secret.
-->
同一個 Pod 中可能包含多個容器。預設情況下，你所定義的容器只能訪問預設 ServiceAccount
及其相關 Secret。你必須顯式地定義環境變數或者將卷對映到容器中，才能為容器提供對其他
Secret 的訪問。

<!--
There may be Secrets for several Pods on the same node. However, only the
Secrets that a Pod requests are potentially visible within its containers.
Therefore, one Pod does not have access to the Secrets of another Pod.
-->
針對同一節點上的多個 Pod 可能有多個 Secret。不過，只有某個 Pod 所請求的 Secret
才有可能對 Pod 中的容器可見。因此，一個 Pod 不會獲得訪問其他 Pod 的 Secret 的許可權。

{{< warning >}}
<!--
Any privileged containers on a node are liable to have access to all Secrets used
on that node.
-->
節點上的所有特權容器都可能訪問到該節點上使用的所有 Secret。
{{< /warning >}}

<!--
### Security recommendations for developers

- Applications still need to protect the value of confidential information after reading it
  from an environment variable or volume. For example, your application must avoid logging
  the secret data in the clear or transmitting it to an untrusted party.
- If you are defining multiple containers in a Pod, and only one of those
  containers needs access to a Secret, define the volume mount or environment
  variable configuration so that the other containers do not have access to that
  Secret.
-->
### 針對開發人員的安全性建議 {#security-recommendations-for-developers}

- 應用在從環境變數或卷中讀取了機密資訊內容之後仍要對其進行保護。例如，
  你的應用應該避免用明文的方式將 Secret 資料寫入日誌，或者將其傳遞給不可信的第三方。
- 如果你在一個 Pod 中定義了多個容器，而只有一個容器需要訪問某 Secret，
  定義卷掛載或環境變數配置時，應確保其他容器無法訪問該 Secret。
<!--
- If you configure a Secret through a {{< glossary_tooltip text="manifest" term_id="manifest" >}},
  with the secret data encoded as base64, sharing this file or checking it in to a
  source repository means the secret is available to everyone who can read the manifest.
  Base64 encoding is _not_ an encryption method, it provides no additional confidentiality
  over plain text.
-->
- 如果你透過{{< glossary_tooltip text="清單" term_id="manifest" >}}來配置某 Secret，
  Secret 資料以 Base64 的形式編碼，將此檔案共享，或者將其檢入到某原始碼倉庫，
  都意味著 Secret 對於任何可以讀取清單的人都是可見的。
  Base64 編碼 **不是** 一種加密方法，與明文相比沒有任何安全性提升。
<!--
- When deploying applications that interact with the Secret API, you should
  limit access using
  [authorization policies](/docs/reference/access-authn-authz/authorization/) such as
  [RBAC](/docs/reference/access-authn-authz/rbac/).
-->
- 部署與 Secret API 互動的應用時，你應該使用 [RBAC](/zh-cn/docs/reference/access-authn-authz/rbac/)
  這類[鑑權策略](/zh-cn/docs/reference/access-authn-authz/authorization/)來限制訪問。
<!--
- In the Kubernetes API, `watch` and `list` requests for Secrets within a namespace
  are extremely powerful capabilities. Avoid granting this access where feasible, since
  listing Secrets allows the clients to inspect the values of every Secret in that
  namespace.
-->
- 在 Kubernetes API 中，名字空間內對 Secret 物件的 `watch` 和 `list` 請求是非常強大的能力。
  在可能的時候應該避免授予這類訪問許可權，因為透過列舉 Secret，
  客戶端能夠檢視對應名字空間內所有 Secret 的取值。

<!--
### Security recommendations for cluster administrators
-->
### 針對叢集管理員的安全性建議 {#security-recommendations-for-cluster-administrators}

{{< caution >}}
<!--
A user who can create a Pod that uses a Secret can also see the value of that Secret. Even
if cluster policies do not allow a user to read the Secret directly, the same user could
have access to run a Pod that then exposes the Secret.
-->
能夠建立使用 Secret 的 Pod 的使用者也可以檢視該 Secret 的取值。
即使叢集策略不允許某使用者直接讀取 Secret 物件，這一使用者仍然可以透過執行一個
Pod 來訪問 Secret 的內容。
{{< /caution >}}

<!--
- Reserve the ability to `watch` or `list` all secrets in a cluster (using the Kubernetes
  API), so that only the most privileged, system-level components can perform this action.
- When deploying applications that interact with the Secret API, you should
  limit access using
  [authorization policies](/docs/reference/access-authn-authz/authorization/) such as
  [RBAC](/docs/reference/access-authn-authz/rbac/).
-->
- 保留（使用 Kubernetes API）對叢集中所有 Secret 物件執行 `watch` 或 `list` 操作的能力，
  這樣只有特權級最高、系統級別的元件能夠執行這類操作。
- 在部署需要透過 Secret API 互動的應用時，你應該透過使用
  [RBAC](/zh-cn/docs/reference/access-authn-authz/rbac/)
  這類[鑑權策略](/zh-cn/docs/reference/access-authn-authz/authorization/)來限制訪問。
<!--
- In the API server, objects (including Secrets) are persisted into
  {{< glossary_tooltip term_id="etcd" >}}; therefore:
  - only allow cluster admistrators to access etcd (this includes read-only access);
  - enable [encryption at rest](/docs/tasks/administer-cluster/encrypt-data/)
    for Secret objects, so that the data of these Secrets are not stored in the clear
    into {{< glossary_tooltip term_id="etcd" >}};
  - consider wiping / shredding the durable storage used by etcd once it is
    no longer in use;
  - if there are multiple etcd instances, make sure that etcd is
    using SSL/TLS for communication between etcd peers.
-->
- 在 API 伺服器上，物件（包括 Secret）會被持久化到 {{< glossary_tooltip term_id="etcd" >}} 中；
  因此：

  - 只應准許叢集管理員訪問 etcd（包括只讀訪問）；
  - 為 Secret 物件啟用[靜態加密](/zh-cn/docs/tasks/administer-cluster/encrypt-data/)，
    這樣這些 Secret 的資料就不會以明文的形式儲存到
    {{< glossary_tooltip term_id="etcd" >}} 中；
  - 當 etcd 的持久化儲存不再被使用時，請考慮徹底擦除儲存介質；
  - 如果存在多個 etcd 例項，請確保 etcd 使用 SSL/TLS 來完成其對等通訊。

## {{% heading "whatsnext" %}}

<!--
- Learn how to [manage Secrets using `kubectl`](/docs/tasks/configmap-secret/managing-secret-using-kubectl/)
- Learn how to [manage Secrets using config file](/docs/tasks/configmap-secret/managing-secret-using-config-file/)
- Learn how to [manage Secrets using kustomize](/docs/tasks/configmap-secret/managing-secret-using-kustomize/)
- Read the [API reference](/docs/reference/kubernetes-api/config-and-storage-resources/secret-v1/) for `Secret`
-->
- 學習如何[使用 `kubectl` 管理 Secret](/zh-cn/docs/tasks/configmap-secret/managing-secret-using-kubectl/)
- 學習如何[使用配置檔案管理 Secret](/zh-cn/docs/tasks/configmap-secret/managing-secret-using-config-file/)
- 學習如何[使用 kustomize 管理 Secret](/zh-cn/docs/tasks/configmap-secret/managing-secret-using-kustomize/)
- 閱讀 [API 參考](/zh-cn/docs/reference/kubernetes-api/config-and-storage-resources/secret-v1/)瞭解 `Secret`

