---
title: Kubernetes Secret 良好實踐
description: >
  幫助叢集管理員和應用開發者更好管理 Secret 的原理和實踐。
content_type: concept
weight: 70
---
<!--
title: Good practices for Kubernetes Secrets
description: >
  Principles and practices for good Secret management for cluster administrators and application developers.
content_type: concept
weight: 70
-->

<!-- overview -->

{{<glossary_definition prepend="在 Kubernetes 中，Secret 是這樣一個對象："
term_id="secret" length="all">}}

<!--
The following good practices are intended for both cluster administrators and
application developers. Use these guidelines to improve the security of your
sensitive information in Secret objects, as well as to more effectively manage
your Secrets.
-->
以下良好實踐適用於叢集管理員和應用開發者。遵從這些指導方針有助於提高 Secret
對象中敏感資訊的安全性，還可以更有效地管理你的 Secret。

<!-- body -->

<!--
## Cluster administrators

This section provides good practices that cluster administrators can use to
improve the security of confidential information in the cluster.
-->
## 叢集管理員   {#cluster-administrators}

本節提供了叢集管理員可用於提高叢集中機密資訊安全性的良好實踐。

<!--
### Configure encryption at rest

By default, Secret objects are stored unencrypted in {{<glossary_tooltip
term_id="etcd" text="etcd">}}. You should configure encryption of your Secret
data in `etcd`. For instructions, refer to
[Encrypt Secret Data at Rest](/docs/tasks/administer-cluster/encrypt-data/).
-->
### 設定靜態加密   {#configure-encryption-at-rest}

預設情況下，Secret 對象以非加密的形式儲存在 {{<glossary_tooltip term_id="etcd" text="etcd">}} 中。
你設定對在 `etcd` 中儲存的 Secret 資料進行加密。相關的指導資訊，
請參閱[靜態加密 Secret 資料](/zh-cn/docs/tasks/administer-cluster/encrypt-data/)。

<!--
### Configure least-privilege access to Secrets {#least-privilege-secrets}

When planning your access control mechanism, such as Kubernetes
{{<glossary_tooltip term_id="rbac" text="Role-based Access Control">}} [(RBAC)](/docs/reference/access-authn-authz/rbac/),
consider the following guidelines for access to `Secret` objects. You should
also follow the other guidelines in
[RBAC good practices](/docs/concepts/security/rbac-good-practices).
-->
### 設定 Secret 資源的最小特權訪問   {#least-privilege-secrets}

當規劃諸如 Kubernetes
{{<glossary_tooltip term_id="rbac" text="基於角色的訪問控制">}} [(RBAC)](/zh-cn/docs/reference/access-authn-authz/rbac/)
這類訪問控制機制時，需要注意訪問 `Secret` 對象的以下指導資訊。
你還應遵從 [RBAC 良好實踐](/zh-cn/docs/concepts/security/rbac-good-practices)中的其他指導資訊。

<!--
- **Components**: Restrict `watch` or `list` access to only the most
  privileged, system-level components. Only grant `get` access for Secrets if
  the component's normal behavior requires it.
- **Humans**: Restrict `get`, `watch`, or `list` access to Secrets. Only allow
  cluster administrators to access `etcd`. This includes read-only access. For
  more complex access control, such as restricting access to Secrets with
  specific annotations, consider using third-party authorization mechanisms.
-->
- **組件**：限制僅最高特權的系統級組件可以執行 `watch` 或 `list` 訪問。
  僅在組件的正常行爲需要時才授予對 Secret 的 `get` 訪問權限。
- **人員**：限制對 Secret 的 `get`、`watch` 或 `list` 訪問權限。僅允許叢集管理員訪問 `etcd`。
  這包括只讀訪問。對於更復雜的訪問控制，例如使用特定註解限制對 Secret 的訪問，請考慮使用第三方鑑權機制。

{{< caution >}}
<!--
Granting `list` access to Secrets implicitly lets the subject fetch the
contents of the Secrets.
-->
授予對 Secret 的 `list` 訪問權限將意味着允許對應主體獲取 Secret 的內容。
{{< /caution >}}

<!--
A user who can create a Pod that uses a Secret can also see the value of that
Secret. Even if cluster policies do not allow a user to read the Secret
directly, the same user could have access to run a Pod that then exposes the
Secret. You can detect or limit the impact caused by Secret data being exposed,
either intentionally or unintentionally, by a user with this access. Some
recommendations include:
-->
如果一個使用者可以創建使用某 Secret 的 Pod，則該使用者也可以看到該 Secret 的值。
即使叢集策略不允許使用者直接讀取 Secret，同一使用者也可能有權限運行 Pod 進而暴露該 Secret。
你可以檢測或限制具有此訪問權限的使用者有意或無意地暴露 Secret 資料所造成的影響。
這裏有一些建議：

<!--
*  Use short-lived Secrets
*  Implement audit rules that alert on specific events, such as concurrent
   reading of multiple Secrets by a single user
-->
* 使用生命期短暫的 Secret
* 實現對特定事件發出警報的審計規則，例如同一使用者併發讀取多個 Secret 時發出警報

<!--
#### Restrict Access for Secrets
Use separate namespaces to isolate access to mounted secrets.
-->
#### 限制 Secret 的訪問

使用單獨的命名空間來隔離對掛載 Secret 的訪問。

<!--
### Improve etcd management policies

Consider wiping or shredding the durable storage used by `etcd` once it is
no longer in use.

If there are multiple `etcd` instances, configure encrypted SSL/TLS
communication between the instances to protect the Secret data in transit.
-->
### 改進 etcd 管理策略   {#improve-etcd-management-policies}

不再使用 `etcd` 所使用的持久儲存時，考慮擦除或粉碎這些資料。

如果存在多個 `etcd` 實例，則在實例之間設定加密的 SSL/TLS 通信以保護傳輸中的 Secret 資料。

<!--
### Configure access to external Secrets
-->
### 設定對外部 Secret 的訪問權限   {#configure-access-to-external-secrets}

{{% thirdparty-content %}}

<!--
You can use third-party Secrets store providers to keep your confidential data
outside your cluster and then configure Pods to access that information.
The [Kubernetes Secrets Store CSI Driver](https://secrets-store-csi-driver.sigs.k8s.io/)
is a DaemonSet that lets the kubelet retrieve Secrets from external stores, and
mount the Secrets as a volume into specific Pods that you authorize to access
the data.
-->
你可以使用第三方 Secret 儲存提供商將機密資料保存在你的叢集之外，然後設定 Pod 訪問該資訊。
[Kubernetes Secret 儲存 CSI 驅動](https://secrets-store-csi-driver.sigs.k8s.io/)是一個 DaemonSet，
它允許 kubelet 從外部儲存中檢索 Secret，並將 Secret 作爲卷掛載到特定的、你授權訪問資料的 Pod。

<!--
For a list of supported providers, refer to
[Providers for the Secret Store CSI Driver](https://secrets-store-csi-driver.sigs.k8s.io/concepts.html#provider-for-the-secrets-store-csi-driver).
-->
有關支持的提供商列表，請參閱
[Secret 儲存 CSI 驅動的提供商](https://secrets-store-csi-driver.sigs.k8s.io/concepts.html#provider-for-the-secrets-store-csi-driver)。

<!--
## Good practices for using swap memory

For best practices for setting swap memory for Linux nodes, please refer to
[swap memory management](/docs/concepts/cluster-administration/swap-memory-management/#good-practice-for-using-swap-in-a-kubernetes-cluster).
-->
## 使用交換內存的良好實踐     {#good-practices-for-using-swap-memory}

對於爲 Linux 節點設置交換內存的最佳實踐，
請參閱[交換內存管理](/zh-cn/docs/concepts/cluster-administration/swap-memory-management/#good-practice-for-using-swap-in-a-kubernetes-cluster)。

<!--
## Developers

This section provides good practices for developers to use to improve the
security of confidential data when building and deploying Kubernetes resources.
-->
## 開發者   {#developers}

本節爲開發者提供了構建和部署 Kubernetes 資源時用於改進機密資料安全性的良好實踐。

<!--
### Restrict Secret access to specific containers

If you are defining multiple containers in a Pod, and only one of those
containers needs access to a Secret, define the volume mount or environment
variable configuration so that the other containers do not have access to that
Secret.
-->
### 限制特定容器集合才能訪問 Secret     {#restrict-secret-access-to-specific-containers}

如果你在一個 Pod 中定義了多個容器，且僅其中一個容器需要訪問 Secret，則可以定義卷掛載或環境變量設定，
這樣其他容器就不會有訪問該 Secret 的權限。

<!--
### Protect Secret data after reading

Applications still need to protect the value of confidential information after
reading it from an environment variable or volume. For example, your
application must avoid logging the secret data in the clear or transmitting it
to an untrusted party.
-->
### 讀取後保護 Secret 資料   {#protect-secret-data-after-reading}

應用程式從一個環境變量或一個卷讀取機密資訊的值後仍然需要保護這些值。
例如，你的應用程式必須避免以明文記錄 Secret 資料，還必須避免將這些資料傳輸給不受信任的一方。

<!--
### Avoid sharing Secret manifests

If you configure a Secret through a
{{< glossary_tooltip text="manifest" term_id="manifest" >}}, with the secret
data encoded as base64, sharing this file or checking it in to a source
repository means the secret is available to everyone who can read the manifest.
-->
### 避免共享 Secret 清單   {#avoid-shareing-secret-manifests}

如果你通過{{< glossary_tooltip text="清單（Manifest）" term_id="manifest" >}}設定 Secret，
同時將該 Secret 資料編碼爲 base64，
那麼共享此檔案或將其檢入一個源代碼倉庫就意味着有權讀取該清單的所有人都能使用該 Secret。

{{< caution >}}
<!--
Base64 encoding is _not_ an encryption method, it provides no additional
confidentiality over plain text.
-->
Base64 編碼**不是**一種加密方法，它沒有爲純文本提供額外的保密機制。
{{< /caution >}}
