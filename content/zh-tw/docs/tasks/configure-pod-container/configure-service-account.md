---
title: 為 Pod 配置服務賬戶
content_type: task
weight: 90
---
<!--
reviewers:
- bprashanth
- liggitt
- thockin
title: Configure Service Accounts for Pods
content_type: task
weight: 90
-->

<!-- overview -->

<!--
A service account provides an identity for processes that run in a Pod.

This document is a user introduction to Service Accounts and describes how service accounts behave in a cluster set up
as recommended by the Kubernetes project. Your cluster administrator may have
customized the behavior in your cluster, in which case this documentation may
not apply.
-->
服務賬戶為 Pod 中執行的程序提供了一個標識。

{{< note >}}
本文是服務賬戶的使用者使用介紹，描述服務賬號在叢集中如何起作用。
你的叢集管理員可能已經對你的叢集做了定製，因此導致本文中所講述的內容並不適用。
{{< /note >}}

<!--
When you (a human) access the cluster (for example, using `kubectl`), you are
authenticated by the apiserver as a particular User Account (currently this is
usually `admin`, unless your cluster administrator has customized your
cluster).  Processes in containers inside pods can also contact the apiserver.
When they do, they are authenticated as a particular Service Account (for example,
`default`).
-->
當你（自然人）訪問叢集時（例如，使用 `kubectl`），API 伺服器將你的身份驗證為
特定的使用者帳戶（當前這通常是 `admin`，除非你的叢集管理員已經定製了你的叢集配置）。
Pod 內的容器中的程序也可以與 api 伺服器接觸。
當它們進行身份驗證時，它們被驗證為特定的服務帳戶（例如，`default`）。

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!-- steps -->

<!--
## Use the Default Service Account to access the API server.

When you create a pod, if you do not specify a service account, it is
automatically assigned the `default` service account in the same namespace.
If you get the raw json or yaml for a pod you have created (for example, `kubectl get pods/podname -o yaml`),
you can see the `spec.serviceAccountName` field has been
[automatically set](/docs/user-guide/working-with-resources/#resources-are-automatically-modified).
-->
## 使用預設的服務賬戶訪問 API 伺服器

當你建立 Pod 時，如果沒有指定服務賬戶，Pod 會被指定給名稱空間中的 `default` 服務賬戶。
如果你檢視 Pod 的原始 JSON 或 YAML（例如：`kubectl get pods/podname -o yaml`），
你可以看到 `spec.serviceAccountName` 欄位已經被自動設定了。

<!--
You can access the API from inside a pod using automatically mounted service account credentials,
as described in [Accessing the Cluster](/docs/tasks/accessing-application-cluster/access-cluster/).
The API permissions of the service account depend on the [authorization plugin and policy](/docs/reference/access-authn-authz/authorization/#authorization-modules) in use.

In version 1.6+, you can opt out of automounting API credentials for a service account by setting
`automountServiceAccountToken: false` on the service account:
-->
你可以使用自動掛載給 Pod 的服務賬戶憑據訪問 API，
[訪問叢集](/zh-cn/docs/tasks/access-application-cluster/access-cluster/)頁面中有相關描述。
服務賬戶的 API 許可取決於你所使用的
[鑑權外掛和策略](/zh-cn/docs/reference/access-authn-authz/authorization/#authorization-modules)。

在 1.6 以上版本中，你可以透過在服務賬戶上設定 `automountServiceAccountToken: false`
來實現不給服務賬號自動掛載 API 憑據：


```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: build-robot
automountServiceAccountToken: false
...
```

<!--
In version 1.6+, you can also opt out of automounting API credentials for a particular pod:
-->
在 1.6 以上版本中，你也可以選擇不給特定 Pod 自動掛載 API 憑據：

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
The pod spec takes precedence over the service account if both specify a `automountServiceAccountToken` value.
-->
如果 Pod 和服務賬戶都指定了 `automountServiceAccountToken` 值，則 Pod 的 spec 優先於服務帳戶。

<!--
## Use Multiple Service Accounts.

Every namespace has a default service account resource called `default`.
You can list this and any other serviceAccount resources in the namespace with this command:
-->
## 使用多個服務賬戶   {#use-multiple-service-accounts}

每個名稱空間都有一個名為 `default` 的服務賬戶資源。
你可以用下面的命令查詢這個服務賬戶以及名稱空間中的其他 ServiceAccount 資源：

```shell
kubectl get serviceAccounts
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
你可以像這樣來建立額外的 ServiceAccount 物件：

```shell
kubectl create -f - <<EOF
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
ServiceAccount 物件的名字必須是一個有效的
[DNS 子域名](/zh-cn/docs/concepts/overview/working-with-objects/names#dns-subdomain-names).

<!--
If you get a complete dump of the service account object, like this:
-->
如果你查詢服務帳戶物件的完整資訊，如下所示：

```shell
kubectl get serviceaccounts/build-robot -o yaml
```

<!--
The output is similar to this:
-->
輸出類似於：

```none
apiVersion: v1
kind: ServiceAccount
metadata:
  creationTimestamp: 2015-06-16T00:12:59Z
  name: build-robot
  namespace: default
  resourceVersion: "272500"
  uid: 721ab723-13bc-11e5-aec2-42010af0021e
secrets:
- name: build-robot-token-bvbk5
```

<!--
then you will see that a token has automatically been created and is referenced by the service account.

You may use authorization plugins to [set permissions on service accounts](/docs/reference/access-authn-authz/rbac/#service-account-permissions).

To use a non-default service account, set the `spec.serviceAccountName`
field of a pod to the name of the service account you wish to use.
-->
那麼你就能看到系統已經自動建立了一個令牌並且被服務賬戶所引用。

你可以使用授權外掛來
[設定服務賬戶的訪問許可](/zh-cn/docs/reference/access-authn-authz/rbac/#service-account-permissions)。

要使用非預設的服務賬戶，將 Pod 的 `spec.serviceAccountName` 欄位設定為你想用的服務賬戶名稱。

<!--
The service account has to exist at the time the pod is created, or it will be rejected.

You cannot update the service account of an already created pod.

You can clean up the service account from this example like this:
-->
Pod 被建立時服務賬戶必須存在，否則會被拒絕。

你不能更新已經建立好的 Pod 的服務賬戶。

你可以清除服務賬戶，如下所示：

```shell
kubectl delete serviceaccount/build-robot
```

<!--
## Manually create a service account API token.

Suppose we have an existing service account named "build-robot" as mentioned above, and we create
a new secret manually.
-->
## 手動建立服務賬戶 API 令牌

假設我們有一個上面提到的名為 "build-robot" 的服務賬戶，然後我們手動建立一個新的 Secret。

```shell
kubectl create -f - <<EOF
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
Now you can confirm that the newly built secret is populated with an API token for the "build-robot" service account.

Any tokens for non-existent service accounts will be cleaned up by the token controller.
-->
現在，你可以確認新構建的 Secret 中填充了 "build-robot" 服務帳戶的 API 令牌。
令牌控制器將清理不存在的服務帳戶的所有令牌。

```shell
kubectl describe secrets/build-robot-secret
```

<!--
The output is similar to this:
-->
輸出類似於：

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

<!--
The content of `token` is elided here.
-->
{{< note >}}
這裡省略了 `token` 的內容。
{{< /note >}}

<!--
## Add ImagePullSecrets to a service account

### Create an imagePullSecret

- Create an imagePullSecret, as described in [Specifying ImagePullSecret on a Pod](/docs/concepts/containers/images/#specifying-imagepullsecrets-on-a-pod).
-->
## 為服務賬戶新增 ImagePullSecrets  {#add-imagepullsecrets-to-a-service-account}

### 建立 ImagePullSecret

- 建立一個 ImagePullSecret，如同[為 Pod 設定 ImagePullSecret](/zh-cn/docs/concepts/containers/images/#specifying-imagepullsecrets-on-a-pod)所述。

  ```shell
  kubectl create secret docker-registry myregistrykey --docker-server=DUMMY_SERVER \
            --docker-username=DUMMY_USERNAME --docker-password=DUMMY_DOCKER_PASSWORD \
            --docker-email=DUMMY_DOCKER_EMAIL
  ```

<!--
- Verify it has been created.
-->
- 確認建立成功：

  ```shell
  kubectl get secrets myregistrykey
  ```
  
  <!-- The output is similar to this: -->
  輸出類似於：

  ```
  NAME             TYPE                              DATA    AGE
  myregistrykey    kubernetes.io/.dockerconfigjson   1       1d
  ```

<!--
### Add image pull secret to service account

Next, modify the default service account for the namespace to use this secret as an imagePullSecret.
-->
### 將映象拉取 Secret 新增到服務賬號

接著修改名稱空間的 `default` 服務帳戶，以將該 Secret 用作 `imagePullSecret`。

```shell
kubectl patch serviceaccount default -p '{"imagePullSecrets": [{"name": "myregistrykey"}]}'
```

<!--
You can instead use `kubectl edit`, or manually edit the YAML manifests as shown below:
-->
你也可以使用 `kubectl edit`，或者如下所示手動編輯 YAML 清單：

```shell
kubectl get serviceaccounts default -o yaml > ./sa.yaml
```

`sa.yaml` 檔案的內容類似於：

```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  creationTimestamp: 2015-08-07T22:02:39Z
  name: default
  namespace: default
  resourceVersion: "243024"
  uid: 052fb0f4-3d50-11e5-b066-42010af0d7b6
secrets:
- name: default-token-uudge
```

<!--
Using your editor of choice (for example `vi`), open the `sa.yaml` file, delete line with key `resourceVersion`, add lines with `imagePullSecrets:` and save.

The output of the `sa.yaml` file is similar to this:
-->
使用你常用的編輯器（例如 `vi`），開啟 `sa.yaml` 檔案，刪除帶有鍵名
`resourceVersion` 的行，新增帶有 `imagePullSecrets:` 的行，最後儲存檔案。

所得到的 `sa.yaml` 檔案類似於：

```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  creationTimestamp: 2015-08-07T22:02:39Z
  name: default
  namespace: default
  uid: 052fb0f4-3d50-11e5-b066-42010af0d7b6
secrets:
- name: default-token-uudge
imagePullSecrets:
- name: myregistrykey
```

<!--
Finally replace the serviceaccount with the new updated `sa.yaml` file
-->
最後，用新的更新的 `sa.yaml` 檔案替換服務賬號。

```shell
kubectl replace serviceaccount default -f ./sa.yaml
```

<!--
### Verify imagePullSecrets was added to pod spec

Now, when a new Pod is created in the current namespace and using the default ServiceAccount, the new Pod has its  `spec.imagePullSecrets` field set automatically:
-->
### 驗證映象拉取 Secret 已經被新增到 Pod 規約

現在，在當前名稱空間中建立使用預設服務賬號的新 Pod 時，新 Pod
會自動設定其 `.spec.imagePullSecrets` 欄位：

```shell
kubectl run nginx --image=nginx --restart=Never
kubectl get pod nginx -o=jsonpath='{.spec.imagePullSecrets[0].name}{"\n"}'
```

<!-- The output is: -->
輸出為：

```
myregistrykey
```

<!--
## Service Account Token Volume Projection
-->
## 服務帳戶令牌卷投射   {#service-account-token-volume-projection}

{{< feature-state for_k8s_version="v1.20" state="stable" >}}

<!--
To enable and use token request projection, you must specify each of the following
command line arguments to `kube-apiserver`:
-->
為了啟用令牌請求投射，你必須為 `kube-apiserver` 設定以下命令列引數：

<!--
* `--service-account-issuer`
  It can be used as the Identifier of the service account token issuer. You can specify the
  `--service-account-issuer` argument multiple times, this can be useful to enable a non-disruptive
  change of the issuer. When this flag is specified multiple times, the first is used to generate
  tokens and all are used to determine which issuers are accepted. You must be running Kubernetes
  v1.22 or later to be able to specify `--service-account-issuer` multiple times.
-->
* `--service-account-issuer`

  此引數可作為服務賬戶令牌發放者的身份標識（Identifier）。你可以多次指定
  `--service-account-issuer` 引數，對於要變更發放者而又不想帶來業務中斷的場景，
  這樣做是有用的。如果這個引數被多次指定，則第一個引數值會被用來生成令牌，
  而所有引數值都會被用來確定哪些發放者是可接受的。你所執行的 Kubernetes
  叢集必須是 v1.22 或更高版本，才能多次指定 `--service-account-issuer`。

<!--
* `--service-account-key-file`
  File containing PEM-encoded x509 RSA or ECDSA private or public keys, used to verify
  ServiceAccount tokens. The specified file can contain multiple keys, and the flag can be specified
  multiple times with different files. If specified multiple times, tokens signed by any of the
  specified keys are considered valid by the Kubernetes API server.
-->
* `--service-account-key-file`

  包含 PEM 編碼的 x509 RSA 或 ECDSA 私鑰或公鑰，用來檢查 ServiceAccount
  的令牌。所指定的檔案中可以包含多個秘鑰，並且你可以多次使用此引數，
  每次引數值為不同的檔案。多次使用此引數時，由所給的秘鑰之一簽名的令牌會被
  Kubernetes API 伺服器認為是合法令牌。

<!--
* `--service-account-signing-key-file`
  Path to the file that contains the current private key of the service account token issuer. The
  issuer signs issued ID tokens with this private key.
-->
* `--service-account-signing-key-file`

  指向包含當前服務賬戶令牌發放者的私鑰的檔案路徑。
  此發放者使用此私鑰來簽署所發放的 ID 令牌。

<!--
* `--api-audiences` (can be omitted)
  The service account token authenticator validates that tokens used against the API are bound to
  at least one of these audiences. If `api-audiences` is specified multiple times, tokens for any of
  the specified audiences are considered valid by the Kubernetes API server. If the
  `--service-account-issuer` flag is configured and this flag is not, this field defaults to a
  single element list containing the issuer URL.
-->
* `--api-audiences` (can be omitted)

  服務賬號令牌身份檢查元件會檢查針對 API 訪問所使用的令牌，
  確認令牌至少是被繫結到這裡所給的受眾（audiences）之一。
  如果此引數被多次指定，則針對所給的多個受眾中任何目標的令牌都會被
  Kubernetes API 伺服器當做合法的令牌。如果 `--service-account-issuer`
  引數被設定，而這個引數未指定，則這個引數的預設值為一個只有一個元素的列表，
  且該元素為令牌發放者的 URL。

<!--
The kubelet can also project a service account token into a Pod. You can
specify desired properties of the token, such as the audience and the validity
duration. These properties are not configurable on the default service account
token. The service account token will also become invalid against the API when
the Pod or the ServiceAccount is deleted.
-->
kubelet 還可以將服務帳戶令牌投射到 Pod 中。
你可以指定令牌的期望屬性，例如受眾和有效期限。
這些屬性在 default 服務帳戶令牌上無法配置。
當刪除 Pod 或 ServiceAccount 時，服務帳戶令牌也將對 API 無效。

<!--
This behavior is configured on a PodSpec using a ProjectedVolume type called
[ServiceAccountToken](/docs/concepts/storage/volumes/#projected). To provide a
pod with a token with an audience of "vault" and a validity duration of two
hours, you would configure the following in your PodSpec:
-->
使用名為 [ServiceAccountToken](/zh-cn/docs/concepts/storage/volumes/#projected) 的
ProjectedVolume 型別在 PodSpec 上配置此功能。
要向 Pod 提供具有 "vault" 使用者以及兩個小時有效期的令牌，可以在 PodSpec 中配置以下內容：

{{< codenew file="pods/pod-projected-svc-token.yaml" >}}

<!--
Create the Pod:
-->
建立 Pod：

```shell
kubectl create -f https://k8s.io/examples/pods/pod-projected-svc-token.yaml
```

<!--
The kubelet will request and store the token on behalf of the pod, make the
token available to the pod at a configurable file path, and refresh the token as it approaches expiration. 
The kubelet proactively rotates the token if it is older than 80% of its total TTL, or if the token is older than 24 hours.

The application is responsible for reloading the token when it rotates. Periodic reloading (e.g. once every 5 minutes) is sufficient for most use cases.
-->
`kubelet` 元件會替 Pod 請求令牌並將其儲存起來，
透過將令牌儲存到一個可配置的路徑使之在 Pod 內可用，
並在令牌快要到期的時候重新整理它。
`kubelet` 會在令牌存在期達到其 TTL 的 80% 的時候或者令牌生命期超過
24 小時的時候主動輪換它。

應用程式負責在令牌被輪換時重新載入其內容。對於大多數使用場景而言，
週期性地（例如，每隔 5 分鐘）重新載入就足夠了。

<!--
## Service Account Issuer Discovery
-->
## 發現服務賬號分發者

{{< feature-state for_k8s_version="v1.21" state="stable" >}}

<!--
The Service Account Issuer Discovery feature is enabled when the Service Account
Token Projection feature is enabled, as described
[above](#service-account-token-volume-projection).
-->
當啟用服務賬號令牌投射時啟用發現服務賬號分發者（Service Account Issuer Discovery）
這一功能特性，如[上文所述](#service-account-token-volume-projection)。

<!--
The issuer URL must comply with the
[OIDC Discovery Spec](https://openid.net/specs/openid-connect-discovery-1_0.html). In
practice, this means it must use the `https` scheme, and should serve an OpenID
provider configuration at `{service-account-issuer}/.well-known/openid-configuration`.

If the URL does not comply, the `ServiceAccountIssuerDiscovery` endpoints will
not be registered, even if the feature is enabled.
-->
分發者的 URL 必須遵從
[OIDC 發現規範](https://openid.net/specs/openid-connect-discovery-1_0.html)。
這意味著 URL 必須使用 `https` 模式，並且必須在
`{service-account-issuer}/.well-known/openid-configuration`
路徑給出 OpenID 提供者（Provider）配置。

如果 URL 沒有遵從這一規範，`ServiceAccountIssuerDiscovery` 末端就不會被註冊，
即使該特性已經被啟用。

<!--
The Service Account Issuer Discovery feature enables federation of Kubernetes
service account tokens issued by a cluster (the _identity provider_) with
external systems (_relying parties_).

When enabled, the Kubernetes API server provides an OpenID Provider
Configuration document at `/.well-known/openid-configuration` and the associated
JSON Web Key Set (JWKS) at `/openid/v1/jwks`. The OpenID Provider Configuration
is sometimes referred to as the _discovery document_.
-->
發現服務賬號分發者這一功能使得使用者能夠用聯邦的方式結合使用 Kubernetes 
叢集（“Identity Provider”，標識提供者）與外部系統（“Relying Parties”，
依賴方）所分發的服務賬號令牌。

當此功能被啟用時，Kubernetes API 伺服器會在 `/.well-known/openid-configuration`
提供一個 OpenID 提供者配置文件，並在 `/openid/v1/jwks` 處提供與之關聯的
JSON Web Key Set（JWKS）。
這裡的 OpenID 提供者配置有時候也被稱作“發現文件（Discovery Document）”。

<!--
Clusters include a default RBAC ClusterRole called
`system:service-account-issuer-discovery`. A default RBAC ClusterRoleBinding
assigns this role to the `system:serviceaccounts` group, which all service
accounts implicitly belong to. This allows pods running on the cluster to access
the service account discovery document via their mounted service account token.
Administrators may, additionally, choose to bind the role to
`system:authenticated` or `system:unauthenticated` depending on their security
requirements and which external systems they intend to federate with.
-->
叢集包括一個的預設 RBAC ClusterRole, 名為 `system:service-account-issuer-discovery`。 
預設的 RBAC ClusterRoleBinding 將此角色分配給 `system:serviceaccounts` 組，
所有服務帳戶隱式屬於該組。這使得叢集上執行的 Pod
能夠透過它們所掛載的服務帳戶令牌訪問服務帳戶發現文件。
此外，管理員可以根據其安全性需要以及期望整合的外部系統選擇是否將該角色繫結到
`system:authenticated` 或 `system:unauthenticated`。

<!--
The responses served at `/.well-known/openid-configuration` and
`/openid/v1/jwks` are designed to be OIDC compatible, but not strictly OIDC
compliant. Those documents contain only the parameters necessary to perform
validation of Kubernetes service account tokens.
-->
對 `/.well-known/openid-configuration` 和 `/openid/v1/jwks` 路徑請求的響應
被設計為與 OIDC 相容，但不是完全與其一致。
返回的文件僅包含對 Kubernetes 服務賬號令牌進行驗證所必須的引數。

<!--
The JWKS response contains public keys that a relying party can use to validate
the Kubernetes service account tokens. Relying parties first query for the
OpenID Provider Configuration, and use the `jwks_uri` field in the response to
find the JWKS.
-->
JWKS 響應包含依賴方可以用來驗證 Kubernetes 服務賬號令牌的公鑰資料。
依賴方先會查詢 OpenID 提供者配置，之後使用返回響應中的 `jwks_uri` 來查詢 JWKS。

<!--
In many cases, Kubernetes API servers are not available on the public internet,
but public endpoints that serve cached responses from the API server can be made
available by users or service providers. In these cases, it is possible to
override the `jwks_uri` in the OpenID Provider Configuration so that it points
to the public endpoint, rather than the API server's address, by passing the
`--service-account-jwks-uri` flag to the API server. Like the issuer URL, the
JWKS URI is required to use the `https` scheme.
-->
在很多場合，Kubernetes API 伺服器都不會暴露在公網上，不過對於快取並向外提供 API
伺服器響應資料的公開末端而言，使用者或者服務提供商可以選擇將其暴露在公網上。
在這種環境中，可能會過載 OpenID 提供者配置中的
`jwks_uri`，使之指向公網上可用的末端地址，而不是 API 伺服器的地址。
這時需要向 API 伺服器傳遞 `--service-account-jwks-uri` 引數。
與分發者 URL 類似，此 JWKS URI 也需要使用 `https` 模式。

## {{% heading "whatsnext" %}}

<!--
See also:

- [Cluster Admin Guide to Service Accounts](/docs/reference/access-authn-authz/service-accounts-admin/)
- [Service Account Signing Key Retrieval KEP](https://github.com/kubernetes/enhancements/tree/master/keps/sig-auth/1393-oidc-discovery)
- [OIDC Discovery Spec](https://openid.net/specs/openid-connect-discovery-1_0.html)
-->
另請參見：

- [服務賬號的叢集管理員指南](/zh-cn/docs/reference/access-authn-authz/service-accounts-admin/)
- [服務賬號簽署金鑰檢索 KEP](https://github.com/kubernetes/enhancements/tree/master/keps/sig-auth/1393-oidc-discovery)
- [OIDC 發現規範](https://openid.net/specs/openid-connect-discovery-1_0.html)

