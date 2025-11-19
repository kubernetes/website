---
title: Secret
api_metadata:
- apiVersion: "v1"
  kind: "Secret"
content_type: concept
feature:
  title: Secret 和配置管理
  description: >
    部署和更新 Secret 和應用程序的配置而不必重新構建容器鏡像，
    且不必將軟件堆棧配置中的祕密信息暴露出來。
weight: 30
---
<!--
reviewers:
- mikedanese
title: Secrets
api_metadata:
- apiVersion: "v1"
  kind: "Secret"
content_type: concept
feature:
  title: Secret and configuration management
  description: >
    Deploy and update Secrets and application configuration without rebuilding your image
    and without exposing Secrets in your stack configuration.
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
Secret 是一種包含少量敏感信息例如密碼、令牌或密鑰的對象。
這樣的信息可能會被放在 {{< glossary_tooltip term_id="pod" >}} 規約中或者鏡像中。
使用 Secret 意味着你不需要在應用程序代碼中包含機密數據。

<!--
Because Secrets can be created independently of the Pods that use them, there
is less risk of the Secret (and its data) being exposed during the workflow of
creating, viewing, and editing Pods. Kubernetes, and applications that run in
your cluster, can also take additional precautions with Secrets, such as avoiding
writing sensitive data to nonvolatile storage.

Secrets are similar to {{< glossary_tooltip text="ConfigMaps" term_id="configmap" >}}
but are specifically intended to hold confidential data.
-->
由於創建 Secret 可以獨立於使用它們的 Pod，
因此在創建、查看和編輯 Pod 的工作流程中暴露 Secret（及其數據）的風險較小。
Kubernetes 和在集羣中運行的應用程序也可以對 Secret 採取額外的預防措施，
例如避免將敏感數據寫入非易失性存儲。

Secret 類似於 {{<glossary_tooltip text="ConfigMap" term_id="configmap" >}}
但專門用於保存機密數據。

{{< caution >}}
<!--
Kubernetes Secrets are, by default, stored unencrypted in the API server's underlying data store
(etcd). Anyone with API access can retrieve or modify a Secret, and so can anyone with access to etcd.
Additionally, anyone who is authorized to create a Pod in a namespace can use that access to read
any Secret in that namespace; this includes indirect access such as the ability to create a
Deployment.

In order to safely use Secrets, take at least the following steps:

1. [Enable Encryption at Rest](/docs/tasks/administer-cluster/encrypt-data/) for Secrets.
1. [Enable or configure RBAC rules](/docs/reference/access-authn-authz/authorization/) with
   least-privilege access to Secrets.
1. Restrict Secret access to specific containers.
1. [Consider using external Secret store providers](https://secrets-store-csi-driver.sigs.k8s.io/concepts.html#provider-for-the-secrets-store-csi-driver).
-->
默認情況下，Kubernetes Secret 未加密地存儲在 API 服務器的底層數據存儲（etcd）中。
任何擁有 API 訪問權限的人都可以檢索或修改 Secret，任何有權訪問 etcd 的人也可以。
此外，任何有權限在命名空間中創建 Pod 的人都可以使用該訪問權限讀取該命名空間中的任何 Secret；
這包括間接訪問，例如創建 Deployment 的能力。

爲了安全地使用 Secret，請至少執行以下步驟：

1. 爲 Secret [啓用靜態加密](/zh-cn/docs/tasks/administer-cluster/encrypt-data/)。
1. 以最小特權訪問 Secret 並[啓用或配置 RBAC 規則](/zh-cn/docs/reference/access-authn-authz/authorization/)。
1. 限制 Secret 對特定容器的訪問。
1. [考慮使用外部 Secret 存儲驅動](https://secrets-store-csi-driver.sigs.k8s.io/concepts.html#provider-for-the-secrets-store-csi-driver)。

<!--
For more guidelines to manage and improve the security of your Secrets, refer to
[Good practices for Kubernetes Secrets](/docs/concepts/security/secrets-good-practices).
-->
有關管理和提升 Secret 安全性的指南，請參閱
[Kubernetes Secret 良好實踐](/zh-cn/docs/concepts/security/secrets-good-practices)。
{{< /caution >}}

<!--
See [Information security for Secrets](#information-security-for-secrets) for more details.
-->
參見 [Secret 的信息安全](#information-security-for-secrets)瞭解詳情。

<!-- body -->

<!--
## Uses for Secrets

You can use Secrets for purposes such as the following:
- [Set environment variables for a container](/docs/tasks/inject-data-application/distribute-credentials-secure/#define-container-environment-variables-using-secret-data).
- [Provide credentials such as SSH keys or passwords to Pods](/docs/tasks/inject-data-application/distribute-credentials-secure/#provide-prod-test-creds).
- [Allow the kubelet to pull container images from private registries](/docs/tasks/configure-pod-container/pull-image-private-registry/).

The Kubernetes control plane also uses Secrets; for example,
[bootstrap token Secrets](#bootstrap-token-secrets) are a mechanism to
help automate node registration.
-->
## Secret 的使用 {#uses-for-secrets}

你可以將 Secret 用於以下場景：

- [設置容器的環境變量](/zh-cn/docs/tasks/inject-data-application/distribute-credentials-secure/#define-container-environment-variables-using-secret-data)。
- [向 Pod 提供 SSH 密鑰或密碼等憑據](/zh-cn/docs/tasks/inject-data-application/distribute-credentials-secure/#provide-prod-test-creds)。
- [允許 kubelet 從私有鏡像倉庫中拉取鏡像](/zh-cn/docs/tasks/configure-pod-container/pull-image-private-registry/)。

Kubernetes 控制面也使用 Secret；
例如，[引導令牌 Secret](#bootstrap-token-secrets)
是一種幫助自動化節點註冊的機制。

<!--
### Use case: dotfiles in a secret volume

You can make your data "hidden" by defining a key that begins with a dot.
This key represents a dotfile or "hidden" file. For example, when the following Secret
is mounted into a volume, `secret-volume`, the volume will contain a single file,
called `.secret-file`, and the `dotfile-test-container` will have this file
present at the path `/etc/secret-volume/.secret-file`.
-->
### 使用場景：在 Secret 卷中帶句點的文件 {#use-case-dotfiles-in-a-secret-volume}

通過定義以句點（`.`）開頭的主鍵，你可以“隱藏”你的數據。
這些主鍵代表的是以句點開頭的文件或“隱藏”文件。
例如，當以下 Secret 被掛載到 `secret-volume` 捲上時，該卷中會包含一個名爲
`.secret-file` 的文件，並且容器 `dotfile-test-container`
中此文件位於路徑 `/etc/secret-volume/.secret-file` 處。

{{< note >}}
<!--
Files beginning with dot characters are hidden from the output of  `ls -l`;
you must use `ls -la` to see them when listing directory contents.
-->
以句點開頭的文件會在 `ls -l` 的輸出中被隱藏起來；
列舉目錄內容時你必須使用 `ls -la` 才能看到它們。
{{< /note >}}

{{% code language="yaml" file="secret/dotfile-secret.yaml" %}}

<!--
### Use case: Secret visible to one container in a Pod

Consider a program that needs to handle HTTP requests, do some complex business
logic, and then sign some messages with an HMAC. Because it has complex
application logic, there might be an unnoticed remote file reading exploit in
the server, which could expose the private key to an attacker.
-->
### 使用場景：僅對 Pod 中一個容器可見的 Secret {#use-case-secret-visible-to-one-container-in-a-pod}

考慮一個需要處理 HTTP 請求，執行某些複雜的業務邏輯，之後使用 HMAC
來對某些消息進行簽名的程序。因爲這一程序的應用邏輯很複雜，
其中可能包含未被注意到的遠程服務器文件讀取漏洞，
這種漏洞可能會把私鑰暴露給攻擊者。

<!--
This could be divided into two processes in two containers: a frontend container
which handles user interaction and business logic, but which cannot see the
private key; and a signer container that can see the private key, and responds
to simple signing requests from the frontend (for example, over localhost networking).
-->
這一程序可以分隔成兩個容器中的兩個進程：前端容器要處理用戶交互和業務邏輯，
但無法看到私鑰；簽名容器可以看到私鑰，並對來自前端的簡單簽名請求作出響應
（例如，通過本地主機網絡）。

<!--
With this partitioned approach, an attacker now has to trick the application
server into doing something rather arbitrary, which may be harder than getting
it to read a file.
-->
採用這種劃分的方法，攻擊者現在必須欺騙應用服務器來做一些其他操作，
而這些操作可能要比讀取一個文件要複雜很多。

<!--
### Alternatives to Secrets

Rather than using a Secret to protect confidential data, you can pick from alternatives.

Here are some of your options:
-->
### Secret 的替代方案  {#alternatives-to-secrets}

除了使用 Secret 來保護機密數據，你也可以選擇一些替代方案。

下面是一些選項：

<!--
- If your cloud-native component needs to authenticate to another application that you
  know is running within the same Kubernetes cluster, you can use a
  [ServiceAccount](/docs/reference/access-authn-authz/authentication/#service-account-tokens)
  and its tokens to identify your client.
- There are third-party tools that you can run, either within or outside your cluster,
  that provide sensitive data. For example, a service that Pods access over HTTPS,
  that reveals a Secret if the client correctly authenticates (for example, with a ServiceAccount
  token).
-->
- 如果你的雲原生組件需要執行身份認證來訪問你所知道的、在同一 Kubernetes 集羣中運行的另一個應用，
  你可以使用 [ServiceAccount](/zh-cn/docs/reference/access-authn-authz/authentication/#service-account-tokens)
  及其令牌來標識你的客戶端身份。
- 你可以運行的第三方工具也有很多，這些工具可以運行在集羣內或集羣外，提供機密數據管理。
  例如，這一工具可能是 Pod 通過 HTTPS 訪問的一個服務，該服務在客戶端能夠正確地通過身份認證
  （例如，通過 ServiceAccount 令牌）時，提供機密數據內容。
<!--
- For authentication, you can implement a custom signer for X.509 certificates, and use
  [CertificateSigningRequests](/docs/reference/access-authn-authz/certificate-signing-requests/)
  to let that custom signer issue certificates to Pods that need them.
- You can use a [device plugin](/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/)
  to expose node-local encryption hardware to a specific Pod. For example, you can schedule
  trusted Pods onto nodes that provide a Trusted Platform Module, configured out-of-band.
-->
- 就身份認證而言，你可以爲 X.509 證書實現一個定製的簽名者，並使用
  [CertificateSigningRequest](/zh-cn/docs/reference/access-authn-authz/certificate-signing-requests/)
  來讓該簽名者爲需要證書的 Pod 發放證書。
- 你可以使用一個[設備插件](/zh-cn/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/)
  來將節點本地的加密硬件暴露給特定的 Pod。例如，你可以將可信任的 Pod
  調度到提供可信平臺模塊（Trusted Platform Module，TPM）的節點上。
  這類節點是另行配置的。

<!--
You can also combine two or more of those options, including the option to use Secret objects themselves.

For example: implement (or deploy) an {{< glossary_tooltip text="operator" term_id="operator-pattern" >}}
that fetches short-lived session tokens from an external service, and then creates Secrets based
on those short-lived session tokens. Pods running in your cluster can make use of the session tokens,
and operator ensures they are valid. This separation means that you can run Pods that are unaware of
the exact mechanisms for issuing and refreshing those session tokens.
-->
你還可以將如上選項的兩種或多種進行組合，包括直接使用 Secret 對象本身也是一種選項。

例如：實現（或部署）一個 {{< glossary_tooltip text="Operator" term_id="operator-pattern" >}}，
從外部服務取回生命期很短的會話令牌，之後基於這些生命期很短的會話令牌來創建 Secret。
運行在集羣中的 Pod 可以使用這些會話令牌，而 Operator 則確保這些令牌是合法的。
這種責權分離意味着你可以運行那些不瞭解會話令牌如何發放與刷新的確切機制的 Pod。

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
## Secret 的類型  {#secret-types}

創建 Secret 時，你可以使用 [Secret](/zh-cn/docs/reference/kubernetes-api/config-and-storage-resources/secret-v1/)
資源的 `type` 字段，或者與其等價的 `kubectl` 命令行參數（如果有的話）爲其設置類型。
Secret 類型有助於對 Secret 數據進行編程處理。

Kubernetes 提供若干種內置的類型，用於一些常見的使用場景。
針對這些類型，Kubernetes 所執行的合法性檢查操作以及對其所實施的限制各不相同。

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
| 內置類型     | 用法  |
|--------------|-------|
| `Opaque`     | 用戶定義的任意數據 |
| `kubernetes.io/service-account-token` | 服務賬號令牌 |
| `kubernetes.io/dockercfg` | `~/.dockercfg` 文件的序列化形式 |
| `kubernetes.io/dockerconfigjson` | `~/.docker/config.json` 文件的序列化形式 |
| `kubernetes.io/basic-auth` | 用於基本身份認證的憑據 |
| `kubernetes.io/ssh-auth` | 用於 SSH 身份認證的憑據 |
| `kubernetes.io/tls` | 用於 TLS 客戶端或者服務器端的數據 |
| `bootstrap.kubernetes.io/token` | 啓動引導令牌數據 |

<!--
You can define and use your own Secret type by assigning a non-empty string as the
`type` value for a Secret object (an empty string is treated as an `Opaque` type).
-->
通過爲 Secret 對象的 `type` 字段設置一個非空的字符串值，你也可以定義並使用自己
Secret 類型（如果 `type` 值爲空字符串，則被視爲 `Opaque` 類型）。

<!--
Kubernetes doesn't impose any constraints on the type name. However, if you
are using one of the built-in types, you must meet all the requirements defined
for that type.
-->
Kubernetes 並不對類型的名稱作任何限制。不過，如果你要使用內置類型之一，
則你必須滿足爲該類型所定義的所有要求。

<!--
If you are defining a type of Secret that's for public use, follow the convention
and structure the Secret type to have your domain name before the name, separated
by a `/`. For example: `cloud-hosting.example.net/cloud-api-credentials`.
-->
如果你要定義一種公開使用的 Secret 類型，請遵守 Secret 類型的約定和結構，
在類型名前面添加域名，並用 `/` 隔開。
例如：`cloud-hosting.example.net/cloud-api-credentials`。

<!--
### Opaque Secrets

`Opaque` is the default Secret type if you don't explicitly specify a type in
a Secret manifest. When you create a Secret using `kubectl`, you must use the
`generic` subcommand to indicate an `Opaque` Secret type. For example, the
following command creates an empty Secret of type `Opaque`:
-->
### Opaque Secret

當你未在 Secret 清單中顯式指定類型時，默認的 Secret 類型是 `Opaque`。
當你使用 `kubectl` 來創建一個 Secret 時，你必須使用 `generic`
子命令來標明要創建的是一個 `Opaque` 類型的 Secret。
例如，下面的命令會創建一個空的 `Opaque` 類型的 Secret：

```shell
kubectl create secret generic empty-secret
kubectl get secret empty-secret
```

<!--
The output looks like:
-->
輸出類似於：

```
NAME           TYPE     DATA   AGE
empty-secret   Opaque   0      2m6s
```

<!--
The `DATA` column shows the number of data items stored in the Secret.
In this case, `0` means you have created an empty Secret.
-->
`DATA` 列顯示 Secret 中保存的數據條目個數。
在這個例子中，`0` 意味着你剛剛創建了一個空的 Secret。

<!--
### ServiceAccount token Secrets

A `kubernetes.io/service-account-token` type of Secret is used to store a
token credential that identifies a
{{< glossary_tooltip text="ServiceAccount" term_id="service-account" >}}. This
is a legacy mechanism that provides long-lived ServiceAccount credentials to
Pods.
-->
### ServiceAccount 令牌 Secret  {#service-account-token-secrets}

類型爲 `kubernetes.io/service-account-token` 的 Secret 用來存放標識某
{{< glossary_tooltip text="ServiceAccount" term_id="service-account" >}} 的令牌憑據。
這是爲 Pod 提供長期有效 ServiceAccount 憑據的傳統機制。

<!--
In Kubernetes v1.22 and later, the recommended approach is to obtain a
short-lived, automatically rotating ServiceAccount token by using the
[`TokenRequest`](/docs/reference/kubernetes-api/authentication-resources/token-request-v1/)
API instead. You can get these short-lived tokens using the following methods:
-->
在 Kubernetes v1.22 及更高版本中，推薦的方法是通過使用
[`TokenRequest`](/zh-cn/docs/reference/kubernetes-api/authentication-resources/token-request-v1/) API
來獲取短期自動輪換的 ServiceAccount 令牌。你可以使用以下方法獲取這些短期令牌：

<!--
* Call the `TokenRequest` API either directly or by using an API client like
  `kubectl`. For example, you can use the
  [`kubectl create token`](/docs/reference/generated/kubectl/kubectl-commands#-em-token-em-)
  command.
* Request a mounted token in a
  [projected volume](/docs/reference/access-authn-authz/service-accounts-admin/#bound-service-account-token-volume)
  in your Pod manifest. Kubernetes creates the token and mounts it in the Pod.
  The token is automatically invalidated when the Pod that it's mounted in is
  deleted. For details, see
  [Launch a Pod using service account token projection](/docs/tasks/configure-pod-container/configure-service-account/#launch-a-pod-using-service-account-token-projection).
-->
- 直接調用 `TokenRequest` API，或者使用像 `kubectl` 這樣的 API 客戶端。
  例如，你可以使用
  [`kubectl create token`](/docs/reference/generated/kubectl/kubectl-commands#-em-token-em-) 命令。
- 在 Pod 清單中請求使用[投射卷](/zh-cn/docs/reference/access-authn-authz/service-accounts-admin/#bound-service-account-token-volume)掛載的令牌。
  Kubernetes 會創建令牌並將其掛載到 Pod 中。
  當掛載令牌的 Pod 被刪除時，此令牌會自動失效。
  更多細節參閱[啓動使用服務賬號令牌投射的 Pod](/zh-cn/docs/tasks/configure-pod-container/configure-service-account/#launch-a-pod-using-service-account-token-projection)。

{{< note >}}
<!--
You should only create a ServiceAccount token Secret
if you can't use the `TokenRequest` API to obtain a token,
and the security exposure of persisting a non-expiring token credential
in a readable API object is acceptable to you. For instructions, see
[Manually create a long-lived API token for a ServiceAccount](/docs/tasks/configure-pod-container/configure-service-account/#manually-create-an-api-token-for-a-serviceaccount).
-->
只有在你無法使用 `TokenRequest` API 來獲取令牌，
並且你能夠接受因爲將永不過期的令牌憑據寫入到可讀取的 API 對象而帶來的安全風險時，
才應該創建 ServiceAccount 令牌 Secret。
更多細節參閱[爲 ServiceAccount 手動創建長期有效的 API 令牌](/zh-cn/docs/tasks/configure-pod-container/configure-service-account/#manually-create-an-api-token-for-a-serviceaccount)。
{{< /note >}}

<!--
When using this Secret type, you need to ensure that the
`kubernetes.io/service-account.name` annotation is set to an existing
ServiceAccount name. If you are creating both the ServiceAccount and
the Secret objects, you should create the ServiceAccount object first.
-->
使用這種 Secret 類型時，你需要確保對象的註解 `kubernetes.io/service-account-name`
被設置爲某個已有的 ServiceAccount 名稱。
如果你同時創建 ServiceAccount 和 Secret 對象，應該先創建 ServiceAccount 對象。

<!--
After the Secret is created, a Kubernetes {{< glossary_tooltip text="controller" term_id="controller" >}}
fills in some other fields such as the `kubernetes.io/service-account.uid` annotation, and the
`token` key in the `data` field, which is populated with an authentication token.

The following example configuration declares a ServiceAccount token Secret:
-->
當 Secret 對象被創建之後，某個 Kubernetes
{{< glossary_tooltip text="控制器" term_id="controller" >}}會填寫
Secret 的其它字段，例如 `kubernetes.io/service-account.uid` 註解和
`data` 字段中的 `token` 鍵值（該鍵包含一個身份認證令牌）。

下面的配置實例聲明瞭一個 ServiceAccount 令牌 Secret：

{{% code language="yaml" file="secret/serviceaccount-token-secret.yaml" %}}

<!--
After creating the Secret, wait for Kubernetes to populate the `token` key in the `data` field.
-->
創建了 Secret 之後，等待 Kubernetes 在 `data` 字段中填充 `token` 主鍵。

<!--
See the [ServiceAccount](/docs/concepts/security/service-accounts/)
documentation for more information on how ServiceAccounts work.
You can also check the `automountServiceAccountToken` field and the
`serviceAccountName` field of the
[`Pod`](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#pod-v1-core)
for information on referencing ServiceAccount credentials from within Pods.
-->
參考 [ServiceAccount](/zh-cn/docs/concepts/security/service-accounts/)
文檔瞭解 ServiceAccount 的工作原理。你也可以查看
[`Pod`](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#pod-v1-core)
資源中的 `automountServiceAccountToken` 和 `serviceAccountName` 字段文檔，
進一步瞭解從 Pod 中引用 ServiceAccount 憑據。

<!--
### Docker config Secrets

If you are creating a Secret to store credentials for accessing a container image registry,
you must use one of the following `type` values for that Secret:
-->
### Docker 配置 Secret  {#docker-config-secrets}

如果你要創建 Secret 用來存放用於訪問容器鏡像倉庫的憑據，則必須選用以下 `type`
值之一來創建 Secret：

<!--
- `kubernetes.io/dockercfg`: store a serialized `~/.dockercfg` which is the
  legacy format for configuring Docker command line. The Secret
  `data` field contains a `.dockercfg` key whose value is the content of a
  base64 encoded `~/.dockercfg` file.
- `kubernetes.io/dockerconfigjson`: store a serialized JSON that follows the
  same format rules as the `~/.docker/config.json` file, which is a new format
  for `~/.dockercfg`. The Secret `data` field must contain a
  `.dockerconfigjson` key for which the value is the content of a base64
  encoded `~/.docker/config.json` file.
-->
- `kubernetes.io/dockercfg`：存放 `~/.dockercfg` 文件的序列化形式，它是配置 Docker
  命令行的一種老舊形式。Secret 的 `data` 字段包含名爲 `.dockercfg` 的主鍵，
  其值是用 base64 編碼的某 `~/.dockercfg` 文件的內容。
- `kubernetes.io/dockerconfigjson`：存放 JSON 數據的序列化形式，
  該 JSON 也遵從 `~/.docker/config.json` 文件的格式規則，而後者是 `~/.dockercfg`
  的新版本格式。使用此 Secret 類型時，Secret 對象的 `data` 字段必須包含
  `.dockerconfigjson` 鍵，其鍵值爲 base64 編碼的字符串包含 `~/.docker/config.json`
  文件的內容。

<!--
Below is an example for a `kubernetes.io/dockercfg` type of Secret:
-->
下面是一個 `kubernetes.io/dockercfg` 類型 Secret 的示例：

{{% code language="yaml" file="secret/dockercfg-secret.yaml" %}}

{{< note >}}
<!--
If you do not want to perform the base64 encoding, you can choose to use the
`stringData` field instead.
-->
如果你不希望執行 base64 編碼轉換，可以使用 `stringData` 字段代替。
{{< /note >}}

<!--
When you create Docker config Secrets using a manifest, the API
server checks whether the expected key exists in the `data` field, and
it verifies if the value provided can be parsed as a valid JSON. The API
server doesn't validate if the JSON actually is a Docker config file.

You can also use `kubectl` to create a Secret for accessing a container
registry, such as when you don't have a Docker configuration file:
-->
當你使用清單文件通過 Docker 配置來創建 Secret 時，API 服務器會檢查 `data` 字段中是否存在所期望的主鍵，
並且驗證其中所提供的鍵值是否是合法的 JSON 數據。
不過，API 服務器不會檢查 JSON 數據本身是否是一個合法的 Docker 配置文件內容。

你還可以使用 `kubectl` 創建一個 Secret 來訪問容器倉庫時，
當你沒有 Docker 配置文件時你可以這樣做：

```shell
kubectl create secret docker-registry secret-tiger-docker \
  --docker-email=tiger@acme.example \
  --docker-username=tiger \
  --docker-password=pass1234 \
  --docker-server=my-registry.example:5000
```

<!--
This command creates a Secret of type `kubernetes.io/dockerconfigjson`.

Retrieve the `.data.dockerconfigjson` field from that new Secret and decode the
data:
-->
此命令創建一個類型爲 `kubernetes.io/dockerconfigjson` 的 Secret。

從這個新的 Secret 中獲取 `.data.dockerconfigjson` 字段並執行數據解碼：

```shell
kubectl get secret secret-tiger-docker -o jsonpath='{.data.*}' | base64 -d
```

<!--
The output is equivalent to the following JSON document (which is also a valid
Docker configuration file):
-->
輸出等價於以下 JSON 文檔（這也是一個有效的 Docker 配置文件）：

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

{{< caution >}}
<!--
The `auth` value there is base64 encoded; it is obscured but not secret.
Anyone who can read that Secret can learn the registry access bearer token.

It is suggested to use [credential providers](/docs/tasks/administer-cluster/kubelet-credential-provider/) to dynamically and securely provide pull secrets on-demand.
-->
`auths` 值是 base64 編碼的，其內容被屏蔽但未被加密。
任何能夠讀取該 Secret 的人都可以瞭解鏡像庫的訪問令牌。

建議使用[憑據提供程序](/zh-cn/docs/tasks/administer-cluster/kubelet-credential-provider/)來動態、
安全地按需提供拉取 Secret。
{{< /caution >}}

<!--
### Basic authentication Secret

The `kubernetes.io/basic-auth` type is provided for storing credentials needed
for basic authentication. When using this Secret type, the `data` field of the
Secret must contain one of the following two keys:

- `username`: the user name for authentication
- `password`: the password or token for authentication
-->
### 基本身份認證 Secret  {#basic-authentication-secret}

`kubernetes.io/basic-auth` 類型用來存放用於基本身份認證所需的憑據信息。
使用這種 Secret 類型時，Secret 的 `data` 字段必須包含以下兩個鍵之一：

- `username`：用於身份認證的用戶名；
- `password`：用於身份認證的密碼或令牌。

<!--
Both values for the above two keys are base64 encoded strings. You can
alternatively provide the clear text content using the `stringData` field in the
Secret manifest.

The following manifest is an example of a basic authentication Secret:
-->
以上兩個鍵的鍵值都是 base64 編碼的字符串。
當然你也可以在 Secret 清單中的使用 `stringData` 字段來提供明文形式的內容。

以下清單是基本身份驗證 Secret 的示例：

{{% code language="yaml" file="secret/basicauth-secret.yaml" %}}

{{< note >}}
<!--
The `stringData` field for a Secret does not work well with server-side apply.
-->
Secret 的 `stringData` 字段不能很好地與服務器端應用配合使用。
{{< /note >}}

<!--
The basic authentication Secret type is provided only for convenience.
You can create an `Opaque` type for credentials used for basic authentication.
However, using the defined and public Secret type (`kubernetes.io/basic-auth`) helps other
people to understand the purpose of your Secret, and sets a convention for what key names
to expect.
-->
提供基本身份認證類型的 Secret 僅僅是出於方便性考慮。
你也可以使用 `Opaque` 類型來保存用於基本身份認證的憑據。
不過，使用預定義的、公開的 Secret 類型（`kubernetes.io/basic-auth`）
有助於幫助其他用戶理解 Secret 的目的，並且對其中存在的主鍵形成一種約定。

<!--
### SSH authentication Secrets

The builtin type `kubernetes.io/ssh-auth` is provided for storing data used in
SSH authentication. When using this Secret type, you will have to specify a
`ssh-privatekey` key-value pair in the `data` (or `stringData`) field
as the SSH credential to use.

The following manifest is an example of a Secret used for SSH public/private
key authentication:
-->
### SSH 身份認證 Secret {#ssh-authentication-secrets}

Kubernetes 所提供的內置類型 `kubernetes.io/ssh-auth` 用來存放 SSH 身份認證中所需要的憑據。
使用這種 Secret 類型時，你就必須在其 `data` （或 `stringData`）
字段中提供一個 `ssh-privatekey` 鍵值對，作爲要使用的 SSH 憑據。

下面的清單是一個 SSH 公鑰/私鑰身份認證的 Secret 示例：

{{% code language="yaml" file="secret/ssh-auth-secret.yaml" %}}

<!--
The SSH authentication Secret type is provided only for convenience.
You can create an `Opaque` type for credentials used for SSH authentication.
However, using the defined and public Secret type (`kubernetes.io/tls`) helps other
people to understand the purpose of your Secret, and sets a convention for what key names
to expect.
The Kubernetes API verifies that the required keys are set for a Secret of this type.
-->
提供 SSH 身份認證類型的 Secret 僅僅是出於方便性考慮。
你可以使用 `Opaque` 類型來保存用於 SSH 身份認證的憑據。
不過，使用預定義的、公開的 Secret 類型（`kubernetes.io/tls`）
有助於其他人理解你的 Secret 的用途，也可以就其中包含的主鍵名形成約定。
Kubernetes API 會驗證這種類型的 Secret 中是否設定了所需的主鍵。

{{< caution >}}
<!--
SSH private keys do not establish trusted communication between an SSH client and
host server on their own. A secondary means of establishing trust is needed to
mitigate "man in the middle" attacks, such as a `known_hosts` file added to a ConfigMap.
-->
SSH 私鑰自身無法建立 SSH 客戶端與服務器端之間的可信連接。
需要其它方式來建立這種信任關係，以緩解“中間人（Man In The Middle）”
攻擊，例如向 ConfigMap 中添加一個 `known_hosts` 文件。
{{< /caution >}}

<!--
### TLS Secrets

The `kubernetes.io/tls` Secret type is for storing
a certificate and its associated key that are typically used for TLS.

One common use for TLS Secrets is to configure encryption in transit for
an [Ingress](/docs/concepts/services-networking/ingress/), but you can also use it
with other resources or directly in your workload.
When using this type of Secret, the `tls.key` and the `tls.crt` key must be provided
in the `data` (or `stringData`) field of the Secret configuration, although the API
server doesn't actually validate the values for each key.

As an alternative to using `stringData`, you can use the `data` field to provide
the base64 encoded certificate and private key. For details, see
[Constraints on Secret names and data](#restriction-names-data).

The following YAML contains an example config for a TLS Secret:
-->
### TLS Secret

`kubernetes.io/tls` Secret 類型用來存放 TLS 場合通常要使用的證書及其相關密鑰。

TLS Secret 的一種典型用法是爲 [Ingress](/zh-cn/docs/concepts/services-networking/ingress/)
資源配置傳輸過程中的數據加密，不過也可以用於其他資源或者直接在負載中使用。
當使用此類型的 Secret 時，Secret 配置中的 `data` （或 `stringData`）字段必須包含
`tls.key` 和 `tls.crt` 主鍵，儘管 API 服務器實際上並不會對每個鍵的取值作進一步的合法性檢查。

作爲使用 `stringData` 的替代方法，你可以使用 `data` 字段來指定 base64 編碼的證書和私鑰。
有關詳細信息，請參閱 [Secret 名稱和數據的限制](#restriction-names-data)。

下面的 YAML 包含一個 TLS Secret 的配置示例：

{{% code language="yaml" file="secret/tls-auth-secret.yaml" %}}

<!--
The TLS Secret type is provided only for convenience.
You can create an `Opaque` type for credentials used for TLS authentication.
However, using the defined and public Secret type (`kubernetes.io/tls`)
helps ensure the consistency of Secret format in your project. The API server
verifies if the required keys are set for a Secret of this type.

To create a TLS Secret using `kubectl`, use the `tls` subcommand:
-->
提供 TLS 類型的 Secret 僅僅是出於方便性考慮。
你可以創建 `Opaque` 類型的 Secret 來保存用於 TLS 身份認證的憑據。
不過，使用已定義和公開的 Secret 類型（`kubernetes.io/tls`）有助於確保你自己項目中的 Secret 格式的一致性。
API 服務器會驗證這種類型的 Secret 是否設定了所需的主鍵。

要使用 `kubectl` 創建 TLS Secret，你可以使用 `tls` 子命令：

```shell
kubectl create secret tls my-tls-secret \
  --cert=path/to/cert/file \
  --key=path/to/key/file
```

<!--
The public/private key pair must exist before hand. The public key certificate for `--cert` must be .PEM encoded
and must match the given private key for `--key`.
-->
公鑰/私鑰對必須事先存在，`--cert` 的公鑰證書必須採用 .PEM 編碼，
並且必須與 `--key` 的給定私鑰匹配。

<!--
### Bootstrap token Secrets

The `bootstrap.kubernetes.io/token` Secret type is for
tokens used during the node bootstrap process. It stores tokens used to sign
well-known ConfigMaps.
-->
### 啓動引導令牌 Secret  {#bootstrap-token-secrets}

`bootstrap.kubernetes.io/token` Secret 類型針對的是節點啓動引導過程所用的令牌。
其中包含用來爲周知的 ConfigMap 簽名的令牌。

<!--
A bootstrap token Secret is usually created in the `kube-system` namespace and
named in the form `bootstrap-token-<token-id>` where `<token-id>` is a 6 character
string of the token ID.

As a Kubernetes manifest, a bootstrap token Secret might look like the
following:
-->
啓動引導令牌 Secret 通常創建於 `kube-system` 名字空間內，並以
`bootstrap-token-<令牌 ID>` 的形式命名；
其中 `<令牌 ID>` 是一個由 6 個字符組成的字符串，用作令牌的標識。

以 Kubernetes 清單文件的形式，某啓動引導令牌 Secret 可能看起來像下面這樣：

{{% code language="yaml" file="secret/bootstrap-token-secret-base64.yaml" %}}

<!--
A bootstrap token Secret has the following keys specified under `data`:

- `token-id`: A random 6 character string as the token identifier. Required.
- `token-secret`: A random 16 character string as the actual token Secret. Required.
- `description`: A human-readable string that describes what the token is
  used for. Optional.
- `expiration`: An absolute UTC time using [RFC3339](https://datatracker.ietf.org/doc/html/rfc3339) specifying when the token
  should be expired. Optional.
- `usage-bootstrap-<usage>`: A boolean flag indicating additional usage for
  the bootstrap token.
- `auth-extra-groups`: A comma-separated list of group names that will be
  authenticated as in addition to the `system:bootstrappers` group.
-->
啓動引導令牌類型的 Secret 會在 `data` 字段中包含如下主鍵：

- `token-id`：由 6 個隨機字符組成的字符串，作爲令牌的標識符。必需。
- `token-secret`：由 16 個隨機字符組成的字符串，包含實際的令牌機密。必需。
- `description`：供用戶閱讀的字符串，描述令牌的用途。可選。
- `expiration`：一個使用 [RFC3339](https://datatracker.ietf.org/doc/html/rfc3339)
  來編碼的 UTC 絕對時間，給出令牌要過期的時間。可選。
- `usage-bootstrap-<usage>`：布爾類型的標誌，用來標明啓動引導令牌的其他用途。
- `auth-extra-groups`：用逗號分隔的組名列表，身份認證時除被認證爲
  `system:bootstrappers` 組之外，還會被添加到所列的用戶組中。

<!--
You can alternatively provide the values in the `stringData` field of the Secret
without base64 encoding them:

{{% code language="yaml" file="secret/bootstrap-token-secret-literal.yaml" %}}

-->
你也可以在 Secret 的 `stringData` 字段中提供值，而無需對其進行 base64 編碼：

{{% code language="yaml" file="secret/bootstrap-token-secret-literal.yaml" %}}

{{< note >}}
<!--
The `stringData` field for a Secret does not work well with server-side apply.
-->
Secret 的 `stringData` 字段不能很好地與服務器端應用配合使用。
{{< /note >}}

<!--
## Working with Secrets

### Creating a Secret

There are several options to create a Secret:

- [Use `kubectl`](/docs/tasks/configmap-secret/managing-secret-using-kubectl/)
- [Use a configuration file](/docs/tasks/configmap-secret/managing-secret-using-config-file/)
- [Use the Kustomize tool](/docs/tasks/configmap-secret/managing-secret-using-kustomize/)
-->
## 使用 Secret  {#working-with-secrets}

### 創建 Secret  {#creating-a-secret}

創建 Secret 有以下幾種可選方式：

- [使用 `kubectl`](/zh-cn/docs/tasks/configmap-secret/managing-secret-using-kubectl/)
- [使用配置文件](/zh-cn/docs/tasks/configmap-secret/managing-secret-using-config-file/)
- [使用 Kustomize 工具](/zh-cn/docs/tasks/configmap-secret/managing-secret-using-kustomize/)

<!--
#### Constraints on Secret names and data {#restriction-names-data}

The name of a Secret object must be a valid
[DNS subdomain name](/docs/concepts/overview/working-with-objects/names#dns-subdomain-names).
-->
#### 對 Secret 名稱與數據的約束 {#restriction-names-data}

Secret 對象的名稱必須是合法的
[DNS 子域名](/zh-cn/docs/concepts/overview/working-with-objects/names#dns-subdomain-names)。

<!--
You can specify the `data` and/or the `stringData` field when creating a
configuration file for a Secret. The `data` and the `stringData` fields are optional.
The values for all keys in the `data` field have to be base64-encoded strings.
If the conversion to base64 string is not desirable, you can choose to specify
the `stringData` field instead, which accepts arbitrary strings as values.

The keys of `data` and `stringData` must consist of alphanumeric characters,
`-`, `_` or `.`. All key-value pairs in the `stringData` field are internally
merged into the `data` field. If a key appears in both the `data` and the
`stringData` field, the value specified in the `stringData` field takes
precedence.
-->
在爲創建 Secret 編寫配置文件時，你可以設置 `data` 與/或 `stringData` 字段。
`data` 和 `stringData` 字段都是可選的。`data` 字段中所有鍵值都必須是 base64
編碼的字符串。如果不希望執行這種 base64 字符串的轉換操作，你可以選擇設置
`stringData` 字段，其中可以使用任何字符串作爲其取值。

`data` 和 `stringData` 中的鍵名只能包含字母、數字、`-`、`_` 或 `.` 字符。
`stringData` 字段中的所有鍵值對都會在內部被合併到 `data` 字段中。
如果某個主鍵同時出現在 `data` 和 `stringData` 字段中，`stringData`
所指定的鍵值具有高優先級。

<!--
#### Size limit {#restriction-data-size}

Individual Secrets are limited to 1MiB in size. This is to discourage creation
of very large Secrets that could exhaust the API server and kubelet memory.
However, creation of many smaller Secrets could also exhaust memory. You can
use a [resource quota](/docs/concepts/policy/resource-quotas/) to limit the
number of Secrets (or other resources) in a namespace.
-->
#### 尺寸限制   {#restriction-data-size}

每個 Secret 的尺寸最多爲 1MiB。施加這一限制是爲了避免用戶創建非常大的 Secret，
進而導致 API 服務器和 kubelet 內存耗盡。不過創建很多小的 Secret 也可能耗盡內存。
你可以使用[資源配額](/zh-cn/docs/concepts/policy/resource-quotas/)來約束每個名字空間中
Secret（或其他資源）的個數。

<!--
### Editing a Secret

You can edit an existing Secret unless it is [immutable](#secret-immutable). To
edit a Secret, use one of the following methods:
-->
### 編輯 Secret    {#editing-a-secret}

你可以編輯一個已有的 Secret，除非它是[不可變更的](#secret-immutable)。
要編輯一個 Secret，可使用以下方法之一：

<!--
- [Use `kubectl`](/docs/tasks/configmap-secret/managing-secret-using-kubectl/#edit-secret)
- [Use a configuration file](/docs/tasks/configmap-secret/managing-secret-using-config-file/#edit-secret)
-->
- [使用 `kubectl`](/zh-cn/docs/tasks/configmap-secret/managing-secret-using-kubectl/#edit-secret)
- [使用配置文件](/zh-cn/docs/tasks/configmap-secret/managing-secret-using-config-file/#edit-secret)

<!--
You can also edit the data in a Secret using the [Kustomize tool](/docs/tasks/configmap-secret/managing-secret-using-kustomize/#edit-secret). However, this
method creates a new `Secret` object with the edited data.

Depending on how you created the Secret, as well as how the Secret is used in
your Pods, updates to existing `Secret` objects are propagated automatically to
Pods that use the data. For more information, refer to [Using Secrets as files from a Pod](#using-secrets-as-files-from-a-pod) section.
-->
你也可以使用
[Kustomize 工具](/zh-cn/docs/tasks/configmap-secret/managing-secret-using-kustomize/#edit-secret)編輯數據。
然而這種方法會用編輯過的數據創建新的 `Secret` 對象。

根據你創建 Secret 的方式以及該 Secret 在 Pod 中被使用的方式，對已有 `Secret`
對象的更新將自動擴散到使用此數據的 Pod。有關更多信息，
請參閱[在 Pod 以文件形式使用 Secret](#using-secrets-as-files-from-a-pod)。

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

Secret 可以以數據卷的形式掛載，也可以作爲{{< glossary_tooltip text="環境變量" term_id="container-env-variables" >}}
暴露給 Pod 中的容器使用。Secret 也可用於系統中的其他部分，而不是一定要直接暴露給 Pod。
例如，Secret 也可以包含系統中其他部分在替你與外部系統交互時要使用的憑證數據。

<!--
Secret volume sources are validated to ensure that the specified object
reference actually points to an object of type Secret. Therefore, a Secret
needs to be created before any Pods that depend on it.

If the Secret cannot be fetched (perhaps because it does not exist, or
due to a temporary lack of connection to the API server) the kubelet
periodically retries running that Pod. The kubelet also reports an Event
for that Pod, including details of the problem fetching the Secret.
-->
Kubernetes 會檢查 Secret 的卷數據源，確保所指定的對象引用確實指向類型爲 Secret
的對象。因此，如果 Pod 依賴於某 Secret，該 Secret 必須先於 Pod 被創建。

如果 Secret 內容無法取回（可能因爲 Secret 尚不存在或者臨時性地出現 API
服務器網絡連接問題），kubelet 會週期性地重試 Pod 運行操作。kubelet 也會爲該 Pod
報告 Event 事件，給出讀取 Secret 時遇到的問題細節。

<!--
#### Optional Secrets {#restriction-secret-must-exist}
-->
#### 可選的 Secret   {#restriction-secret-must-exist}

<!--
When you reference a Secret in a Pod, you can mark the Secret as _optional_,
such as in the following example. If an optional Secret doesn't exist,
Kubernetes ignores it.
-->
當你在 Pod 中引用 Secret 時，你可以將該 Secret 標記爲**可選**，就像下面例子中所展示的那樣。
如果可選的 Secret 不存在，Kubernetes 將忽略它。

{{% code language="yaml" file="secret/optional-secret.yaml" %}}

<!--
By default, Secrets are required. None of a Pod's containers will start until
all non-optional Secrets are available.
-->
默認情況下，Secret 是必需的。在所有非可選的 Secret 都可用之前，Pod 的所有容器都不會啓動。

<!--
If a Pod references a specific key in a non-optional Secret and that Secret
does exist, but is missing the named key, the Pod fails during startup.
-->
如果 Pod 引用了非可選 Secret 中的特定鍵，並且該 Secret 確實存在，但缺少所指定的鍵，
則 Pod 在啓動期間會失敗。

<!--
### Using Secrets as files from a Pod {#using-secrets-as-files-from-a-pod}

If you want to access data from a Secret in a Pod, one way to do that is to
have Kubernetes make the value of that Secret be available as a file inside
the filesystem of one or more of the Pod's containers.
-->
### 在 Pod 以文件形式使用 Secret   {#using-secrets-as-files-from-a-pod}

如果你要在 Pod 中訪問來自 Secret 的數據，一種方式是讓 Kubernetes 將該 Secret
的值以文件的形式呈現，該文件存在於 Pod 中一個或多個容器內的文件系統內。

<!--
For instructions, refer to
[Create a Pod that has access to the secret data through a Volume](/docs/tasks/inject-data-application/distribute-credentials-secure/#create-a-pod-that-has-access-to-the-secret-data-through-a-volume).
-->
相關的指示說明，
可以參閱[創建一個可以通過卷訪問 Secret 數據的 Pod](/zh-cn/docs/tasks/inject-data-application/distribute-credentials-secure/#create-a-pod-that-has-access-to-the-secret-data-through-a-volume)。

<!--
When a volume contains data from a Secret, and that Secret is updated, Kubernetes tracks
this and updates the data in the volume, using an eventually-consistent approach.
-->
當卷中包含來自 Secret 的數據，而對應的 Secret 被更新，Kubernetes
會跟蹤到這一操作並更新卷中的數據。更新的方式是保證最終一致性。

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
You can configure the way that the kubelet detects changes from the cached values. The
`configMapAndSecretChangeDetectionStrategy` field in the
[kubelet configuration](/docs/reference/config-api/kubelet-config.v1beta1/) controls
which strategy the kubelet uses. The default strategy is `Watch`.
-->
Kubelet 組件會維護一個緩存，在其中保存節點上 Pod 卷中使用的 Secret 的當前主鍵和取值。
你可以配置 kubelet 如何檢測所緩存數值的變化。
[kubelet 配置](/zh-cn/docs/reference/config-api/kubelet-config.v1beta1/)中的
`configMapAndSecretChangeDetectionStrategy` 字段控制 kubelet 所採用的策略。
默認的策略是 `Watch`。

<!--
Updates to Secrets can be either propagated by an API watch mechanism (the default), based on
a cache with a defined time-to-live, or polled from the cluster API server on each kubelet
synchronisation loop.
-->
對 Secret 的更新操作既可以通過 API 的 watch 機制（默認）來傳播，
基於設置了生命期的緩存獲取，也可以通過 kubelet 的同步迴路來從集羣的 API
服務器上輪詢獲取。

<!--
As a result, the total delay from the moment when the Secret is updated to the moment
when new keys are projected to the Pod can be as long as the kubelet sync period + cache
propagation delay, where the cache propagation delay depends on the chosen cache type
(following the same order listed in the previous paragraph, these are:
watch propagation delay, the configured cache TTL, or zero for direct polling).
-->
因此，從 Secret 被更新到新的主鍵被投射到 Pod 中，中間存在一個延遲。
這一延遲的上限是 kubelet 的同步週期加上緩存的傳播延遲，
其中緩存的傳播延遲取決於所選擇的緩存類型。
對應上一段中提到的幾種傳播機制，延遲時長爲 watch 的傳播延遲、所配置的緩存 TTL
或者對於直接輪詢而言是零。

<!--
### Using Secrets as environment variables

To use a Secret in an {{< glossary_tooltip text="environment variable" term_id="container-env-variables" >}}
in a Pod:
-->
### 以環境變量的方式使用 Secret   {#using-secrets-as-environment-variables}

如果需要在 Pod
中以{{< glossary_tooltip text="環境變量" term_id="container-env-variables" >}}的形式使用 Secret：

<!--
1. For each container in your Pod specification, add an environment variable
   for each Secret key that you want to use to the
   `env[].valueFrom.secretKeyRef` field.
1. Modify your image and/or command line so that the program looks for values
   in the specified environment variables.
-->
1. 對於 Pod 規約中的每個容器，針對你要使用的每個 Secret 鍵，將對應的環境變量添加到
   `env[].valueFrom.secretKeyRef` 中。
1. 更改你的鏡像或命令行，以便程序能夠從指定的環境變量找到所需要的值。

<!--
For instructions, refer to
[Define container environment variables using Secret data](/docs/tasks/inject-data-application/distribute-credentials-secure/#define-container-environment-variables-using-secret-data).
-->
相關的指示說明，
可以參閱[使用 Secret 數據定義容器變量](/zh-cn/docs/tasks/inject-data-application/distribute-credentials-secure/#define-container-environment-variables-using-secret-data)。

<!--
It's important to note that the range of characters allowed for environment variable
names in pods is [restricted](/docs/tasks/inject-data-application/define-environment-variable-container/#using-environment-variables-inside-of-your-config).
If any keys do not meet the rules, those keys are not made available to your container, though
the Pod is allowed to start.
-->
需要注意的是，Pod 中環境變量名稱允許的字符範圍是[有限的](/zh-cn/docs/tasks/inject-data-application/define-environment-variable-container/#using-environment-variables-inside-of-your-config)。
如果某些變量名稱不滿足這些規則，則即使 Pod 是可以啓動的，你的容器也無法訪問這些變量。

<!--
### Container image pull Secrets {#using-imagepullsecrets}

If you want to fetch container images from a private repository, you need a way for
the kubelet on each node to authenticate to that repository. You can configure
_image pull Secrets_ to make this possible. These secrets are configured at the Pod
level.
-->
### 容器鏡像拉取 Secret  {#using-imagepullsecrets}

如果你嘗試從私有倉庫拉取容器鏡像，你需要一種方式讓每個節點上的 kubelet
能夠完成與鏡像庫的身份認證。你可以配置**鏡像拉取 Secret** 來實現這點。
Secret 是在 Pod 層面來配置的。

<!--
#### Using imagePullSecrets

The `imagePullSecrets` field is a list of references to Secrets in the same namespace.
You can use an `imagePullSecrets` to pass a Secret that contains a Docker (or other) image registry
password to the kubelet. The kubelet uses this information to pull a private image on behalf of your Pod.
See the [PodSpec API](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#podspec-v1-core)
for more information about the `imagePullSecrets` field.
-->
#### 使用 imagePullSecrets {#using-imagepullsecrets-1}

`imagePullSecrets` 字段是一個列表，包含對同一名字空間中 Secret 的引用。
你可以使用 `imagePullSecrets` 將包含 Docker（或其他）鏡像倉庫密碼的 Secret
傳遞給 kubelet。kubelet 使用此信息來替 Pod 拉取私有鏡像。
參閱 [PodSpec API](/zh-cn/docs/reference/kubernetes-api/workload-resources/pod-v1/#PodSpec)
進一步瞭解 `imagePullSecrets` 字段。

<!--
##### Manually specifying an imagePullSecret

You can learn how to specify `imagePullSecrets` from the
[container images](/docs/concepts/containers/images/#specifying-imagepullsecrets-on-a-pod)
documentation.
-->
##### 手動設定 imagePullSecret {#manually-specifying-an-imagepullsecret}

你可以通過閱讀[容器鏡像](/zh-cn/docs/concepts/containers/images/#specifying-imagepullsecrets-on-a-pod)
文檔瞭解如何設置 `imagePullSecrets`。

<!--
##### Arranging for imagePullSecrets to be automatically attached

You can manually create `imagePullSecrets`, and reference these from a ServiceAccount. Any Pods
created with that ServiceAccount or created with that ServiceAccount by default, will get their
`imagePullSecrets` field set to that of the service account.
See [Add ImagePullSecrets to a service account](/docs/tasks/configure-pod-container/configure-service-account/#add-imagepullsecrets-to-a-service-account)
for a detailed explanation of that process.
-->
##### 設置 imagePullSecrets 爲自動掛載 {#arranging-for-imagepullsecrets-to-be-automatically-attached}

你可以手動創建 `imagePullSecret`，並在一個 ServiceAccount 中引用它。
對使用該 ServiceAccount 創建的所有 Pod，或者默認使用該 ServiceAccount 創建的 Pod
而言，其 `imagePullSecrets` 字段都會設置爲該服務賬號。
請閱讀[向服務賬號添加 ImagePullSecret](/zh-cn/docs/tasks/configure-pod-container/configure-service-account/#add-imagepullsecrets-to-a-service-account)
來詳細瞭解這一過程。

<!--
### Using Secrets with static Pods {#restriction-static-pod}

You cannot use ConfigMaps or Secrets with {{< glossary_tooltip text="static Pods" term_id="static-pod" >}}.
-->
### 在靜態 Pod 中使用 Secret    {#restriction-static-pod}

你不可以在{{< glossary_tooltip text="靜態 Pod" term_id="static-pod" >}}
中使用 ConfigMap 或 Secret。

<!--
## Use cases

### Use case: As container environment variables {#use-case-as-container-environment-variables}

You can create a Secret and use it to
[set environment variables for a container](/docs/tasks/inject-data-application/distribute-credentials-secure/#define-container-environment-variables-using-secret-data).
-->
## 使用場景  {#use-case}

### 使用場景：作爲容器環境變量 {#use-case-as-container-environment-variables}

你可以創建 Secret
並使用它[爲容器設置環境變量](/zh-cn/docs/tasks/inject-data-application/distribute-credentials-secure/#define-container-environment-variables-using-secret-data)。

<!--
### Use case: Pod with SSH keys

Create a Secret containing some SSH keys:
-->
### 使用場景：帶 SSH 密鑰的 Pod {#use-case-pod-with-ssh-keys}

創建包含一些 SSH 密鑰的 Secret：

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
你也可以創建一個 `kustomization.yaml` 文件，在其 `secretGenerator`
字段中包含 SSH 密鑰。

{{< caution >}}
<!--
Think carefully before sending your own SSH keys: other users of the cluster may have access
to the Secret.
-->
在提供你自己的 SSH 密鑰之前要仔細思考：集羣的其他用戶可能有權訪問該 Secret。

<!--
You could instead create an SSH private key representing a service identity that you want to be
accessible to all the users with whom you share the Kubernetes cluster, and that you can revoke
if the credentials are compromised.
-->
你也可以創建一個 SSH 私鑰，代表一個你希望與你共享 Kubernetes 集羣的其他用戶分享的服務標識。
當憑據信息被泄露時，你可以收回該訪問權限。
{{< /caution >}}

<!--
Now you can create a Pod which references the secret with the SSH key and
consumes it in a volume:
-->
現在你可以創建一個 Pod，在其中訪問包含 SSH 密鑰的 Secret，並通過卷的方式來使用它：

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
容器命令執行時，祕鑰的數據可以在下面的位置訪問到：

```
/etc/secret-volume/ssh-publickey
/etc/secret-volume/ssh-privatekey
```

<!--
The container is then free to use the secret data to establish an SSH connection.
-->
容器就可以隨便使用 Secret 數據來建立 SSH 連接。

<!--
### Use case: Pods with prod / test credentials

This example illustrates a Pod which consumes a secret containing production credentials and
another Pod which consumes a secret with test environment credentials.

You can create a `kustomization.yaml` with a `secretGenerator` field or run
`kubectl create secret`.
-->
### 使用場景：帶有生產、測試環境憑據的 Pod {#use-case-pods-with-prod-test-credentials}

這一示例所展示的一個 Pod 會使用包含生產環境憑據的 Secret，另一個 Pod
使用包含測試環境憑據的 Secret。

你可以創建一個帶有 `secretGenerator` 字段的 `kustomization.yaml` 文件或者運行
`kubectl create secret` 來創建 Secret。

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
你也可以創建一個包含測試環境憑據的 Secret：

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
Special characters such as `$`, `\`, `*`, `=`, and `!` will be interpreted by your
[shell](https://en.wikipedia.org/wiki/Shell_(computing)) and require escaping.
-->
特殊字符（例如 `$`、`\`、`*`、`=` 和 `!`）會被你的
[Shell](https://zh.wikipedia.org/wiki/%E6%AE%BC%E5%B1%A4) 解釋，因此需要轉義。

<!--
In most shells, the easiest way to escape the password is to surround it with single quotes (`'`).
For example, if your actual password is `S!B\*d$zDsb=`, you should execute the command this way:
-->
在大多數 Shell 中，對密碼進行轉義的最簡單方式是用單引號（`'`）將其括起來。
例如，如果你的實際密碼是 `S!B\*d$zDsb`，則應通過以下方式執行命令：

```shell
kubectl create secret generic dev-db-secret --from-literal=username=devuser --from-literal=password='S!B\*d$zDsb='
```

<!--
You do not need to escape special characters in passwords from files (`--from-file`).
-->
你無需對文件中的密碼（`--from-file`）中的特殊字符進行轉義。
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
將 Pod 添加到同一 `kustomization.yaml` 文件中：

```shell
cat <<EOF >> kustomization.yaml
resources:
- pod.yaml
EOF
```

<!--
Apply all those objects on the API server by running:
-->
通過下面的命令在 API 服務器上應用所有這些對象：

```shell
kubectl apply -k .
```

<!--
Both containers will have the following files present on their filesystems with the values
for each container's environment:
-->
兩個文件都會在其文件系統中出現下面的文件，文件中內容是各個容器的環境值：

```
/etc/secret-volume/username
/etc/secret-volume/password
```

<!--
Note how the specs for the two Pods differ only in one field; this facilitates
creating Pods with different capabilities from a common Pod template.
-->
注意這兩個 Pod 的規約中只有一個字段不同。
這便於基於相同的 Pod 模板生成具有不同能力的 Pod。

<!--
You could further simplify the base Pod specification by using two service accounts:

1. `prod-user` with the `prod-db-secret`
1. `test-user` with the `test-db-secret`

The Pod specification is shortened to:
-->
你可以通過使用兩個服務賬號來進一步簡化這一基本的 Pod 規約：

1. `prod-user` 服務賬號使用 `prod-db-secret`
1. `test-user` 服務賬號使用 `test-db-secret`

Pod 規約簡化爲：

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
Kubernetes 允許你將特定的 Secret（和 ConfigMap）標記爲 **不可更改（Immutable）**。
禁止更改現有 Secret 的數據有下列好處：

- 防止意外（或非預期的）更新導致應用程序中斷
- （對於大量使用 Secret 的集羣而言，至少數萬個不同的 Secret 供 Pod 掛載），
  通過將 Secret 標記爲不可變，可以極大降低 kube-apiserver 的負載，提升集羣性能。
  kubelet 不需要監視那些被標記爲不可更改的 Secret。

<!--
### Marking a Secret as immutable {#secret-immutable-create}

You can create an immutable Secret by setting the `immutable` field to `true`. For example,
-->
### 將 Secret 標記爲不可更改   {#secret-immutable-create}

你可以通過將 Secret 的 `immutable` 字段設置爲 `true` 創建不可更改的 Secret。
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
一旦一個 Secret 或 ConfigMap 被標記爲不可更改，撤銷此操作或者更改 `data`
字段的內容都是**不**可能的。
只能刪除並重新創建這個 Secret。現有的 Pod 將維持對已刪除 Secret 的掛載點 --
建議重新創建這些 Pod。
{{< /note >}}

<!--
## Information security for Secrets

Although ConfigMap and Secret work similarly, Kubernetes applies some additional
protection for Secret objects.
-->
## Secret 的信息安全問題 {#information-security-for-secrets}

儘管 ConfigMap 和 Secret 的工作方式類似，但 Kubernetes 對 Secret 有一些額外的保護。

<!--
Secrets often hold values that span a spectrum of importance, many of which can
cause escalations within Kubernetes (e.g. service account tokens) and to
external systems. Even if an individual app can reason about the power of the
Secrets it expects to interact with, other apps within the same namespace can
render those assumptions invalid.
-->
Secret 通常保存重要性各異的數值，其中很多都可能會導致 Kubernetes 中
（例如，服務賬號令牌）或對外部系統的特權提升。
即使某些個別應用能夠推導它期望使用的 Secret 的能力，
同一名字空間中的其他應用可能會讓這種假定不成立。

<!--
A Secret is only sent to a node if a Pod on that node requires it.
For mounting Secrets into Pods, the kubelet stores a copy of the data into a `tmpfs`
so that the confidential data is not written to durable storage.
Once the Pod that depends on the Secret is deleted, the kubelet deletes its local copy
of the confidential data from the Secret.
-->
只有當某個節點上的 Pod 需要某 Secret 時，對應的 Secret 纔會被髮送到該節點上。
如果將 Secret 掛載到 Pod 中，kubelet 會將數據的副本保存在在 `tmpfs` 中，
這樣機密的數據不會被寫入到持久性存儲中。
一旦依賴於該 Secret 的 Pod 被刪除，kubelet 會刪除來自於該 Secret 的機密數據的本地副本。

<!--
There may be several containers in a Pod. By default, containers you define
only have access to the default ServiceAccount and its related Secret.
You must explicitly define environment variables or map a volume into a
container in order to provide access to any other Secret.
-->
同一個 Pod 中可能包含多個容器。默認情況下，你所定義的容器只能訪問默認 ServiceAccount
及其相關 Secret。你必須顯式地定義環境變量或者將卷映射到容器中，才能爲容器提供對其他
Secret 的訪問。

<!--
There may be Secrets for several Pods on the same node. However, only the
Secrets that a Pod requests are potentially visible within its containers.
Therefore, one Pod does not have access to the Secrets of another Pod.
-->
針對同一節點上的多個 Pod 可能有多個 Secret。不過，只有某個 Pod 所請求的 Secret
纔有可能對 Pod 中的容器可見。因此，一個 Pod 不會獲得訪問其他 Pod 的 Secret 的權限。

<!--
### Configure least-privilege access to Secrets

To enhance the security measures around Secrets, use separate namespaces to isolate access to mounted secrets.
-->
### 配置 Secret 資源的最小特權訪問

爲了增強 Secrets 的安全措施，使用單獨的命名空間來隔離對掛載 Secret 的訪問。

{{< warning >}}
<!--
Any containers that run with `privileged: true` on a node can access all
Secrets used on that node.
-->
在一個節點上以 `privileged: true` 運行的所有容器可以訪問該節點上使用的所有 Secret。
{{< /warning >}}

## {{% heading "whatsnext" %}}

<!--
- For guidelines to manage and improve the security of your Secrets, refer to
  [Good practices for Kubernetes Secrets](/docs/concepts/security/secrets-good-practices).
- Learn how to [manage Secrets using `kubectl`](/docs/tasks/configmap-secret/managing-secret-using-kubectl/)
- Learn how to [manage Secrets using config file](/docs/tasks/configmap-secret/managing-secret-using-config-file/)
- Learn how to [manage Secrets using kustomize](/docs/tasks/configmap-secret/managing-secret-using-kustomize/)
- Read the [API reference](/docs/reference/kubernetes-api/config-and-storage-resources/secret-v1/) for `Secret`
-->
- 有關管理和提升 Secret 安全性的指南，請參閱 [Kubernetes Secret 良好實踐](/zh-cn/docs/concepts/security/secrets-good-practices)
- 學習如何[使用 `kubectl` 管理 Secret](/zh-cn/docs/tasks/configmap-secret/managing-secret-using-kubectl/)
- 學習如何[使用配置文件管理 Secret](/zh-cn/docs/tasks/configmap-secret/managing-secret-using-config-file/)
- 學習如何[使用 kustomize 管理 Secret](/zh-cn/docs/tasks/configmap-secret/managing-secret-using-kustomize/)
- 閱讀 [API 參考](/zh-cn/docs/reference/kubernetes-api/config-and-storage-resources/secret-v1/)瞭解 `Secret`

