---
title: 使用 KMS 驅動進行數據加密
content_type: task
weight: 370
---
<!--
reviewers:
- aramase
- enj
title: Using a KMS provider for data encryption
content_type: task
weight: 370
-->
<!-- overview -->

<!--
This page shows how to configure a Key Management Service (KMS) provider and plugin to enable secret data encryption.
In Kubernetes {{< skew currentVersion >}} there are two versions of KMS at-rest encryption.
You should use KMS v2 if feasible because KMS v1 is deprecated (since Kubernetes v1.28) and disabled by default (since Kubernetes v1.29).
KMS v2 offers significantly better performance characteristics than KMS v1.
-->
本頁展示瞭如何設定密鑰管理服務（Key Management Service，KMS）驅動和插件以啓用 Secret 數據加密。
在 Kubernetes {{< skew currentVersion >}} 中，存在兩個版本的 KMS 靜態加密方式。
如果可行的話，建議使用 KMS v2，因爲（自 Kubernetes v1.28 起）KMS v1 已經被棄用並
（自 Kubernetes v1.29 起）默認被禁用。
KMS v2 提供了比 KMS v1 明顯更好的性能特徵。

{{< caution >}}
<!--
This documentation is for the generally available implementation of KMS v2 (and for the
deprecated version 1 implementation).
If you are using any control plane components older than Kubernetes v1.29, please check
the equivalent page in the documentation for the version of Kubernetes that your cluster
is running. Earlier releases of Kubernetes had different behavior that may be relevant
for information security.
-->
本文適用於正式發佈的 KMS v2 實現（以及已廢棄的 v1 實現）。
如果你使用的控制平面組件早於 Kubernetes v1.29，請查看叢集所運行的 Kubernetes 版本文檔中的相應頁面。
早期版本的 Kubernetes 在信息安全方面具有不同的行爲。
{{< /caution >}}

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

<!--
The version of Kubernetes that you need depends on which KMS API version
you have selected.  Kubernetes recommends using KMS v2.

- If you selected KMS API v1 to support clusters prior to version v1.27
  or if you have a legacy KMS plugin that only supports KMS v1,
  any supported Kubernetes version will work.  This API is deprecated as of Kubernetes v1.28.
  Kubernetes does not recommend the use of this API.
-->
你所需要的 Kubernetes 版本取決於你已選擇的 KMS API 版本。Kubernetes 推薦使用 KMS v2。

- 如果你選擇了 KMS API v1 來支持早於 v1.27 版本的叢集，或者你有一個僅支持 KMS v1 的舊版 KMS 插件，
  那麼任何受支持的 Kubernetes 版本都可以良好工作。此 API 自 Kubernetes v1.28 起被棄用。
  Kubernetes 不推薦使用此 API。

{{< version-check >}}

### KMS v1

{{< feature-state for_k8s_version="v1.28" state="deprecated" >}}

<!--
* Kubernetes version 1.10.0 or later is required

* For version 1.29 and later, the v1 implementation of KMS is disabled by default.
  To enable the feature, set `--feature-gates=KMSv1=true` to configure a KMS v1 provider.

* Your cluster must use etcd v3 or later
-->
* 需要 Kubernetes 1.10.0 或更高版本
* 對於 1.29 及更高版本，KMS 的 v1 實現默認處於禁用狀態。
  要啓用此特性，設置 `--feature-gates=KMSv1=true` 以設定 KMS v1 驅動。
* 你的叢集必須使用 etcd v3 或更高版本

### KMS v2

{{< feature-state for_k8s_version="v1.29" state="stable" >}}

<!--
* Your cluster must use etcd v3 or later
-->
* 你的叢集必須使用 etcd v3 或更高版本

<!-- steps -->

<!--
## KMS encryption and per-object encryption keys
-->
### KMS 加密和爲每個對象加密的密鑰    {#kms-encryption-and-perobject-encryption-keys}

<!--
The KMS encryption provider uses an envelope encryption scheme to encrypt data in etcd.
The data is encrypted using a data encryption key (DEK).
The DEKs are encrypted with a key encryption key (KEK) that is stored and managed in a remote KMS.

If you use the (deprecated) v1 implementation of KMS, a new DEK is generated for each encryption.
-->
KMS 加密驅動使用封套加密模型來加密 etcd 中的數據。數據使用數據加密密鑰（DEK）加密。
這些 DEK 經一個密鑰加密密鑰（KEK）加密後在一個遠端的 KMS 中存儲和管理。

如果你使用（已棄用的）KMS v1 實現，每次加密將生成新的 DEK。

<!--
With KMS v2, a new DEK is generated **per encryption**: the API server uses a
_key derivation function_ to generate single use data encryption keys from a secret seed
combined with some random data.
The seed is rotated whenever the KEK is rotated
(see the _Understanding key_id and Key Rotation_ section below for more details).
-->
對於 KMS v2，**每次加密**將生成新的 DEK：
API 伺服器使用**密鑰派生函數**根據祕密的種子數結合一些隨機數據生成一次性的數據加密密鑰。
種子會在 KEK 輪換時進行輪換
（有關更多詳細信息，請參閱下面的“瞭解 key_id 和密鑰輪換”章節）。

<!--
The KMS provider uses gRPC to communicate with a specific KMS plugin over a UNIX domain socket.
The KMS plugin, which is implemented as a gRPC server and deployed on the same host(s)
as the Kubernetes control plane, is responsible for all communication with the remote KMS.
-->
KMS 驅動使用 gRPC 通過 UNIX 域套接字與一個特定的 KMS 插件通信。
這個 KMS 插件作爲一個 gRPC 伺服器被部署在 Kubernetes 控制平面的相同主機上，負責與遠端 KMS 的通信。

<!--
## Configuring the KMS provider

To configure a KMS provider on the API server, include a provider of type `kms` in the
`providers` array in the encryption configuration file and set the following properties:
-->
## 設定 KMS 驅動   {#configuring-the-kms-provider}

爲了在 API 伺服器上設定 KMS 驅動，在加密設定文件中的 `providers` 數組中加入一個類型爲 `kms`
的驅動，並設置下列屬性：

### KMS v1 {#configuring-the-kms-provider-kms-v1}

<!--
* `apiVersion`: API Version for KMS provider. Leave this value empty or set it to `v1`.
* `name`: Display name of the KMS plugin. Cannot be changed once set.
* `endpoint`: Listen address of the gRPC server (KMS plugin). The endpoint is a UNIX domain socket.
* `cachesize`: Number of data encryption keys (DEKs) to be cached in the clear.
  When cached, DEKs can be used without another call to the KMS;
  whereas DEKs that are not cached require a call to the KMS to unwrap.
* `timeout`: How long should `kube-apiserver` wait for kms-plugin to respond before
  returning an error (default is 3 seconds).
-->
* `apiVersion`：針對 KMS 驅動的 API 版本。此項留空或設爲 `v1`。
* `name`：KMS 插件的顯示名稱。一旦設置，就無法更改。
* `endpoint`：gRPC 伺服器（KMS 插件）的監聽地址。該端點是一個 UNIX 域套接字。
* `cachesize`：以明文緩存的數據加密密鑰（DEK）的數量。一旦被緩存，
  就可以直接使用 DEK 而無需另外調用 KMS；而未被緩存的 DEK 需要調用一次 KMS 才能解包。
* `timeout`：在返回一個錯誤之前，`kube-apiserver` 等待 kms-plugin 響應的時間（默認是 3 秒）。

### KMS v2 {#configuring-the-kms-provider-kms-v2}

<!--
* `apiVersion`: API Version for KMS provider. Set this to `v2`.
* `name`: Display name of the KMS plugin. Cannot be changed once set.
* `endpoint`: Listen address of the gRPC server (KMS plugin). The endpoint is a UNIX domain socket.
* `timeout`: How long should `kube-apiserver` wait for kms-plugin to respond before
  returning an error (default is 3 seconds).
-->
* `apiVersion`：針對 KMS 驅動的 API 版本。此項設爲 `v2`。
* `name`：KMS 插件的顯示名稱。一旦設置，就無法更改。
* `endpoint`：gRPC 伺服器（KMS 插件）的監聽地址。該端點是一個 UNIX 域套接字。
* `timeout`：在返回一個錯誤之前，`kube-apiserver` 等待 kms-plugin 響應的時間（默認是 3 秒）。

<!--
KMS v2 does not support the `cachesize` property. All data encryption keys (DEKs) will be cached in
the clear once the server has unwrapped them via a call to the KMS. Once cached, DEKs can be used
to perform decryption indefinitely without making a call to the KMS.
-->
KMS v2 不支持 `cachesize` 屬性。一旦伺服器通過調用 KMS 解密了數據加密密鑰（DEK），
所有的 DEK 將會以明文形式被緩存。一旦被緩存，DEK 可以無限期地用於解密操作，而無需再次調用 KMS。

<!--
See [Understanding the encryption at rest configuration.](/docs/tasks/administer-cluster/encrypt-data)
-->
參見[理解靜態設定加密](/zh-cn/docs/tasks/administer-cluster/encrypt-data)。

<!--
## Implementing a KMS plugin

To implement a KMS plugin, you can develop a new plugin gRPC server or enable a KMS plugin
already provided by your cloud provider.
You then integrate the plugin with the remote KMS and deploy it on the Kubernetes control plane.
-->
## 實現 KMS 插件   {#implementing-a-kms-plugin}

爲實現一個 KMS 插件，你可以開發一個新的插件 gRPC 伺服器或啓用一個由你的雲服務驅動提供的 KMS 插件。
你可以將這個插件與遠程 KMS 集成，並把它部署到 Kubernetes 控制平面上。

<!--
### Enabling the KMS supported by your cloud provider 
Refer to your cloud provider for instructions on enabling the cloud provider-specific KMS plugin.
-->
### 啓用由雲服務驅動支持的 KMS   {#enabling-the-kms-supported-by-your-cloud-provider}

有關啓用雲服務驅動特定的 KMS 插件的說明，請諮詢你的雲服務驅動商。

<!--
### Developing a KMS plugin gRPC server

You can develop a KMS plugin gRPC server using a stub file available for Go. For other languages,
you use a proto file to create a stub file that you can use to develop the gRPC server code.
-->
### 開發 KMS 插件 gRPC 伺服器   {#developing-a-kms-plugin-grpc-server}

你可以使用 Go 語言的存根文件開發 KMS 插件 gRPC 伺服器。
對於其他語言，你可以用 proto 文件創建可以用於開發 gRPC 伺服器代碼的存根文件。

#### KMS v1 {#developing-a-kms-plugin-gRPC-server-kms-v1}

<!--
* Using Go: Use the functions and data structures in the stub file:
  [api.pb.go](https://github.com/kubernetes/kubernetes/blob/release-1.25/staging/src/k8s.io/apiserver/pkg/storage/value/encrypt/envelope/v1beta1/api.pb.go)
  to develop the gRPC server code 
-->
* 使用 Go：使用存根文件 [api.pb.go](https://github.com/kubernetes/kubernetes/blob/release-1.25/staging/src/k8s.io/apiserver/pkg/storage/value/encrypt/envelope/v1beta1/api.pb.go)
  中的函數和數據結構開發 gRPC 伺服器代碼。

<!--
* Using languages other than Go: Use the protoc compiler with the proto file:
  [api.proto](https://github.com/kubernetes/kubernetes/blob/release-1.25/staging/src/k8s.io/apiserver/pkg/storage/value/encrypt/envelope/v1beta1/api.proto)
  to generate a stub file for the specific language
-->
* 使用 Go 以外的其他語言：用 protoc 編譯器編譯 proto 文件：
  [api.proto](https://github.com/kubernetes/kubernetes/blob/release-1.25/staging/src/k8s.io/apiserver/pkg/storage/value/encrypt/envelope/v1beta1/api.proto)
  爲指定語言生成存根文件。

#### KMS v2 {#developing-a-kms-plugin-gRPC-server-kms-v2}

<!--
* Using Go: A high level
  [library](https://github.com/kubernetes/kms/blob/release-{{< skew currentVersion >}}/pkg/service/interface.go)
  is provided to make the process easier.  Low level implementations
  can use the functions and data structures in the stub file:
  [api.pb.go](https://github.com/kubernetes/kms/blob/release-{{< skew currentVersion >}}/apis/v2/api.pb.go)
  to develop the gRPC server code

* Using languages other than Go: Use the protoc compiler with the proto file:
  [api.proto](https://github.com/kubernetes/kms/blob/release-{{< skew currentVersion >}}/apis/v2/api.proto)
  to generate a stub file for the specific language
-->
* 使用 Go：提供了一個高級[庫](https://github.com/kubernetes/kms/blob/release-{{< skew currentVersion >}}/pkg/service/interface.go)簡化這個過程。
  底層實現可以使用存根文件
  [api.pb.go](https://github.com/kubernetes/kms/blob/release-{{< skew currentVersion >}}/apis/v2/api.pb.go)
  中的函數和數據結構開發 gRPC 伺服器代碼。

* 使用 Go 以外的其他語言：用 protoc 編譯器編譯 proto 文件：
  [api.proto](https://github.com/kubernetes/kms/blob/release-{{< skew currentVersion >}}/apis/v2/api.proto)
  爲指定語言生成存根文件。

<!--
Then use the functions and data structures in the stub file to develop the server code.
-->
然後使用存根文件中的函數和數據結構開發伺服器代碼。

<!--
#### Notes
-->
#### 注意

##### KMS v1 {#developing-a-kms-plugin-gRPC-server-notes-kms-v1}

<!--
* kms plugin version: `v1beta1`

  In response to procedure call Version, a compatible KMS plugin should return `v1beta1` as `VersionResponse.version`.

* message version: `v1beta1`

  All messages from KMS provider have the version field set to `v1beta1`.
-->
* kms 插件版本：`v1beta1`

  作爲對過程調用 Version 的響應，兼容的 KMS 插件應把 `v1beta1` 作爲 `VersionResponse.version` 版本返回。

* 消息版本：`v1beta1`

  所有來自 KMS 驅動的消息都把 version 字段設置爲 `v1beta1`。

<!--
* protocol: UNIX domain socket (`unix`)

  The plugin is implemented as a gRPC server that listens at UNIX domain socket. The plugin deployment should create a file on the file system to run the gRPC unix domain socket connection. The API server (gRPC client) is configured with the KMS provider (gRPC server) unix domain socket endpoint in order to communicate with it. An abstract Linux socket may be used by starting the endpoint with `/@`, i.e. `unix:///@foo`. Care must be taken when using this type of socket as they do not have concept of ACL (unlike traditional file based sockets). However, they are subject to Linux networking namespace, so will only be accessible to containers within the same pod unless host networking is used.
-->
* 協議：UNIX 域套接字 (`unix`)

  該插件被實現爲一個在 UNIX 域套接字上偵聽的 gRPC 伺服器。
  該插件部署時應在文件系統上創建一個文件來運行 gRPC UNIX 域套接字連接。
  API 伺服器（gRPC 客戶端）設定了 KMS 驅動（gRPC 伺服器）UNIX 域套接字端點，以便與其通信。
  通過以 `/@` 開頭的端點，可以使用一個抽象的 Linux 套接字，即 `unix:///@foo`。
  使用這種類型的套接字時必須小心，因爲它們沒有 ACL 的概念（與傳統的基於文件的套接字不同）。
  然而，這些套接字遵從 Linux 網路命名空間約束，因此只能由同一 Pod 中的容器進行訪問，除非使用了主機網路。

##### KMS v2 {#developing-a-kms-plugin-gRPC-server-notes-kms-v2}

<!--
* KMS plugin version: `v2`

  In response to the `Status` remote procedure call, a compatible KMS plugin should return its KMS compatibility
  version as `StatusResponse.version`. That status response should also include
  "ok" as `StatusResponse.healthz` and a `key_id` (remote KMS KEK ID) as `StatusResponse.key_id`.
  The Kubernetes project recommends you make your plugin
  compatible with the stable `v2` KMS API. Kubernetes {{< skew currentVersion >}} also supports the
  `v2beta1` API for KMS; future Kubernetes releases are likely to continue supporting that beta version.
-->
* KMS 插件版本：`v2`

  作爲對過程調用 `Status` 的響應，兼容的 KMS 插件應把 `StatusResponse.version` 作爲其 KMS 兼容版本返回。
  該狀態響應還應包括 "ok" 作爲 `StatusResponse.healthz` 以及 `key_id`（遠程 KMS KEK ID）作爲
  `StatusResponse.key_id`。Kubernetes 項目建議你的插件與穩定的 `v2` KMS API 兼容。
  Kubernetes {{< skew currentVersion >}} 針對 KMS 還支持 `v2beta1` API；
  Kubernetes 後續版本可能會繼續支持該 Beta 版本。

  <!--
  The API server polls the `Status` procedure call approximately every minute when everything is healthy,
  and every 10 seconds when the plugin is not healthy.  Plugins must take care to optimize this call as it will be
  under constant load.
  -->
  當一切健康時，API 伺服器大約每分鐘輪詢一次 `Status` 過程調用，
  而插件不健康時每 10 秒鐘輪詢一次。使用這些插件時要注意優化此調用，因爲此調用將經受持續的負載。

<!--
* Encryption

  The `EncryptRequest` procedure call provides the plaintext and a UID for logging purposes.  The response must include
  the ciphertext, the `key_id` for the KEK used, and, optionally, any metadata that the KMS plugin needs to aid in
  future `DecryptRequest` calls (via the `annotations` field).  The plugin must guarantee that any distinct plaintext
  results in a distinct response `(ciphertext, key_id, annotations)`.
-->
* 加密

  `EncryptRequest` 過程調用提供明文和一個 UID 以用於日誌記錄。
  響應必須包括密文、使用的 KEK 的 `key_id`，以及可選的任意元數據，這些元數據可以
  幫助 KMS 插件在未來的 `DecryptRequest` 調用中（通過 `annotations` 字段）進行解密。
  插件必須保證所有不同的明文都會產生不同的響應 `(ciphertext, key_id, annotations)`。

  <!--
  If the plugin returns a non-empty `annotations` map, all map keys must be fully qualified domain names such as
  `example.com`. An example use case of `annotation` is `{"kms.example.io/remote-kms-auditid":"<audit ID used by the remote KMS>"}`

  The API server does not perform the `EncryptRequest` procedure call at a high rate.  Plugin implementations should
  still aim to keep each request's latency at under 100 milliseconds.
  -->
  如果插件返回一個非空的 `annotations` 映射，則所有映射鍵必須是完全限定域名，
  例如 `example.com`。`annotation` 的一個示例用例是
  `{"kms.example.io/remote-kms-auditid":"<遠程 KMS 使用的審計 ID>"}`。

  當 API 伺服器運行正常時，並不會高頻執行 `EncryptRequest` 過程調用。
  插件實現仍應力求使每個請求的延遲保持在 100 毫秒以下。

<!--
* Decryption

  The `DecryptRequest` procedure call provides the `(ciphertext, key_id, annotations)` from `EncryptRequest` and a UID
  for logging purposes.  As expected, it is the inverse of the `EncryptRequest` call.  Plugins must verify that the
  `key_id` is one that they understand - they must not attempt to decrypt data unless they are sure that it was
  encrypted by them at an earlier time.
-->
* 解密

  `DecryptRequest` 過程調用提供 `EncryptRequest` 中的 `(ciphertext, key_id, annotations)`
  和一個 UID 以用於日誌記錄。正如預期的那樣，它是 `EncryptRequest` 調用的反向操作。插件必須驗證
  `key_id` 是否爲其理解的密鑰ID - 除非這些插件確定數據是之前自己加密的，否則不應嘗試解密。

  <!--
  The API server may perform thousands of `DecryptRequest` procedure calls on startup to fill its watch cache.  Thus
  plugin implementations must perform these calls as quickly as possible, and should aim to keep each request's latency
  at under 10 milliseconds.
  -->
  在啓動時，API 伺服器可能會執行數千個 `DecryptRequest` 過程調用以填充其監視緩存。
  因此，插件實現必須儘快執行這些調用，並應力求使每個請求的延遲保持在 10 毫秒以下。

<!--
* Understanding `key_id` and Key Rotation

  The `key_id` is the public, non-secret name of the remote KMS KEK that is currently in use.  It may be logged
  during regular operation of the API server, and thus must not contain any private data.  Plugin implementations
  are encouraged to use a hash to avoid leaking any data.  The KMS v2 metrics take care to hash this value before
  exposing it via the `/metrics` endpoint.
-->
* 理解 `key_id` 和密鑰輪換

  `key_id` 是目前使用的遠程 KMS KEK 的公共、非機密名稱。
  它可能會在 API 伺服器的常規操作期間記錄，因此不得包含任何私有數據。
  建議插件實現使用哈希來避免泄漏任何數據。
  KMS v2 指標負責在通過 `/metrics` 端點公開之前對此值進行哈希。

  <!--
  The API server considers the `key_id` returned from the `Status` procedure call to be authoritative.  Thus, a change
  to this value signals to the API server that the remote KEK has changed, and data encrypted with the old KEK should
  be marked stale when a no-op write is performed (as described below).  If an `EncryptRequest` procedure call returns a
  `key_id` that is different from `Status`, the response is thrown away and the plugin is considered unhealthy.  Thus
  implementations must guarantee that the `key_id` returned from `Status` will be the same as the one returned by
  `EncryptRequest`.  Furthermore, plugins must ensure that the `key_id` is stable and does not flip-flop between values
  (i.e. during a remote KEK rotation).
  -->
  API 伺服器認爲從 `Status` 過程調用返回的 `key_id` 是權威性的。因此，此值的更改表示遠程 KEK 已更改，
  並且使用舊 KEK 加密的數據應在執行無操作寫入時標記爲過期（如下所述）。如果 `EncryptRequest`
  過程調用返回與 `Status` 不同的 `key_id`，則響應將被丟棄，並且插件將被認爲是不健康的。
  因此，插件實現必須保證從 `Status` 返回的 `key_id` 與 `EncryptRequest` 返回的 `key_id` 相同。
  此外，插件必須確保 `key_id` 是穩定的，並且不會在不同值之間翻轉（即在遠程 KEK 輪換期間）。

  <!--
  Plugins must not re-use `key_id`s, even in situations where a previously used remote KEK has been reinstated.  For
  example, if a plugin was using `key_id=A`, switched to `key_id=B`, and then went back to `key_id=A` - instead of
  reporting `key_id=A` the plugin should report some derivative value such as `key_id=A_001` or use a new value such
  as `key_id=C`.
  -->
  插件不能重新使用 `key_id`，即使在先前使用的遠程 KEK 被恢復的情況下也是如此。
  例如，如果插件使用了 `key_id=A`，切換到 `key_id=B`，然後又回到 `key_id=A`，
  那麼插件應報告 `key_id=A_001` 或使用一個新值，如 `key_id=C`。

  <!--
  Since the API server polls `Status` about every minute, `key_id` rotation is not immediate.  Furthermore, the API
  server will coast on the last valid state for about three minutes.  Thus if a user wants to take a passive approach
  to storage migration (i.e. by waiting), they must schedule a migration to occur at `3 + N + M` minutes after the
  remote KEK has been rotated (`N` is how long it takes the plugin to observe the `key_id` change and `M` is the
  desired buffer to allow config changes to be processed - a minimum `M` of five minutes is recommend).  Note that no
  API server restart is required to perform KEK rotation.
  -->
  由於 API 伺服器大約每分鐘輪詢一次 `Status`，因此 `key_id` 輪換並不立即發生。
  此外，API 伺服器在三分鐘內以最近一個有效狀態爲準。因此，
  如果使用者想採取被動方法進行存儲遷移（即等待），則必須安排遷移在遠程 KEK 輪換後的 `3 + N + M` 分鐘內發生
  （其中 `N` 表示插件觀察 `key_id` 更改所需的時間，`M` 是允許處理設定更改的緩衝區時間 - 建議至少使用 5 分鐘）。
  請注意，執行 KEK 輪換不需要進行 API 伺服器重啓。

  {{< caution >}}  
  <!--
  Because you don't control the number of writes performed with the DEK,
  the Kubernetes project recommends rotating the KEK at least every 90 days.
  -->
  因爲你未控制使用 DEK 執行的寫入次數，所以 Kubernetes 項目建議至少每 90 天輪換一次 KEK。
  {{< /caution >}}

<!--
* protocol: UNIX domain socket (`unix`)

  The plugin is implemented as a gRPC server that listens at UNIX domain socket.
  The plugin deployment should create a file on the file system to run the gRPC unix domain socket connection.
  The API server (gRPC client) is configured with the KMS provider (gRPC server) unix
  domain socket endpoint in order to communicate with it.
  An abstract Linux socket may be used by starting the endpoint with `/@`, i.e. `unix:///@foo`.
  Care must be taken when using this type of socket as they do not have concept of ACL
  (unlike traditional file based sockets).
  However, they are subject to Linux networking namespace, so will only be accessible to
  containers within the same pod unless host networking is used.
-->
* 協議：UNIX 域套接字 (`unix`)

  該插件被實現爲一個在 UNIX 域套接字上偵聽的 gRPC 伺服器。
  該插件部署時應在文件系統上創建一個文件來運行 gRPC UNIX 域套接字連接。
  API 伺服器（gRPC 客戶端）設定了 KMS 驅動（gRPC 伺服器）UNIX 域套接字端點，以便與其通信。
  通過以 `/@` 開頭的端點，可以使用一個抽象的 Linux 套接字，即 `unix:///@foo`。
  使用這種類型的套接字時必須小心，因爲它們沒有 ACL 的概念（與傳統的基於文件的套接字不同）。
  然而，這些套接字遵從 Linux 網路命名空間，因此只能由同一 Pod 中的容器進行訪問，除非使用了主機網路。

<!--
### Integrating a KMS plugin with the remote KMS

The KMS plugin can communicate with the remote KMS using any protocol supported by the KMS.
All configuration data, including authentication credentials the KMS plugin uses to communicate with the remote KMS,
are stored and managed by the KMS plugin independently.
The KMS plugin can encode the ciphertext with additional metadata that may be required before sending it to the KMS
for decryption (KMS v2 makes this process easier by providing a dedicated `annotations` field).
-->
### 將 KMS 插件與遠程 KMS 整合   {#integrating-a-kms-plugin-with-the-remote-kms}

KMS 插件可以用任何受 KMS 支持的協議與遠程 KMS 通信。
所有的設定數據，包括 KMS 插件用於與遠程 KMS 通信的認證憑據，都由 KMS 插件獨立地存儲和管理。
KMS 插件可以用額外的元數據對密文進行編碼，這些元數據是在把它發往 KMS 進行解密之前可能要用到的
（KMS v2 提供了專用的 `annotations` 字段簡化了這個過程）。

<!--
### Deploying the KMS plugin

Ensure that the KMS plugin runs on the same host(s) as the Kubernetes API server(s).
-->
### 部署 KMS 插件   {#deploying-the-kms-plugin}

確保 KMS 插件與 Kubernetes API 伺服器運行在同一主機上。

<!--
## Encrypting your data with the KMS provider

To encrypt the data:
-->
## 使用 KMS 驅動加密數據   {#encrypting-your-data-with-the-kms-provider}

爲了加密數據：

<!--
1. Create a new `EncryptionConfiguration` file using the appropriate properties for the `kms` provider
to encrypt resources like Secrets and ConfigMaps. If you want to encrypt an extension API that is
defined in a CustomResourceDefinition, your cluster must be running Kubernetes v1.26 or newer.

1. Set the `--encryption-provider-config` flag on the kube-apiserver to point to the location of the configuration file.
-->
1. 使用適合於 `kms` 驅動的屬性創建一個新的 `EncryptionConfiguration` 文件，以加密
   Secret 和 ConfigMap 等資源。
   如果要加密使用 CustomResourceDefinition 定義的擴展 API，你的叢集必須運行 Kubernetes v1.26 或更高版本。

2. 設置 kube-apiserver 的 `--encryption-provider-config` 參數指向設定文件的位置。

<!--
1. `--encryption-provider-config-automatic-reload` boolean argument
   determines if the file set by `--encryption-provider-config` should be
   [automatically reloaded](/docs/tasks/administer-cluster/encrypt-data/#configure-automatic-reloading)
   if the disk contents change. This enables key rotation without API server restarts.

1. Restart your API server.
-->
3. `--encryption-provider-config-automatic-reload` 布爾參數決定了磁盤內容發生變化時是否應自動
   [重新加載](/zh-cn/docs/tasks/administer-cluster/encrypt-data/#configure-automatic-reloading)
   通過 `--encryption-provider-config` 設置的文件。這樣可以在不重啓 API 伺服器的情況下進行密鑰輪換。

4. 重啓你的 API 伺服器。

### KMS v1 {#encrypting-your-data-with-the-kms-provider-kms-v1}

   ```yaml
   apiVersion: apiserver.config.k8s.io/v1
   kind: EncryptionConfiguration
   resources:
     - resources:
         - secrets
         - configmaps
         - pandas.awesome.bears.example
       providers:
         - kms:
             name: myKmsPluginFoo
             endpoint: unix:///tmp/socketfile-foo.sock
             cachesize: 100
             timeout: 3s
         - kms:
             name: myKmsPluginBar
             endpoint: unix:///tmp/socketfile-bar.sock
             cachesize: 100
             timeout: 3s
   ```

### KMS v2 {#encrypting-your-data-with-the-kms-provider-kms-v2}

   ```yaml
   apiVersion: apiserver.config.k8s.io/v1
   kind: EncryptionConfiguration
   resources:
     - resources:
         - secrets
         - configmaps
         - pandas.awesome.bears.example
       providers:
         - kms:
             apiVersion: v2
             name: myKmsPluginFoo
             endpoint: unix:///tmp/socketfile-foo.sock
             timeout: 3s
         - kms:
             apiVersion: v2
             name: myKmsPluginBar
             endpoint: unix:///tmp/socketfile-bar.sock
             timeout: 3s
   ```

<!--
Setting `--encryption-provider-config-automatic-reload` to `true` collapses all health checks to a single health check endpoint. Individual health checks are only available when KMS v1 providers are in use and the encryption config is not auto-reloaded.

The following table summarizes the health check endpoints for each KMS version:
-->
`--encryption-provider-config-automatic-reload` 設置爲 `true` 會將所有健康檢查集中到同一個健康檢查端點。
只有 KMS v1 驅動正使用且加密設定未被自動重新加載時，才能進行獨立的健康檢查。

下表總結了每個 KMS 版本的健康檢查端點：

<!--
| KMS configurations | Without Automatic Reload | With Automatic Reload |
| ------------------ | ------------------------ | --------------------- |
| KMS v1 only        | Individual Healthchecks  | Single Healthcheck    |
| KMS v2 only        | Single Healthcheck       | Single Healthcheck    |
| Both KMS v1 and v2 | Individual Healthchecks  | Single Healthcheck    |
| No KMS             | None                     | Single Healthcheck    |
-->
| KMS 設定     | 沒有自動重新加載           | 有自動重新加載       |
| ------------ | ----------------------- | ------------------ |
| 僅 KMS v1    | Individual Healthchecks | Single Healthcheck |
| 僅 KMS v2    | Single Healthcheck      | Single Healthcheck |
| KMS v1 和 v2 | Individual Healthchecks | Single Healthcheck |
| 沒有 KMS     | 無                      | Single Healthcheck |

<!--
`Single Healthcheck` means that the only health check endpoint is `/healthz/kms-providers`.

`Individual Healthchecks` means that each KMS plugin has an associated health check endpoint based on its location in the encryption config: `/healthz/kms-provider-0`, `/healthz/kms-provider-1` etc.

These healthcheck endpoint paths are hard coded and generated/controlled by the server. The indices for individual healthchecks corresponds to the order in which the KMS encryption config is processed.
-->
`Single Healthcheck` 意味着唯一的健康檢查端點是 `/healthz/kms-providers`。

`Individual Healthchecks` 意味着每個 KMS 插件都有一個對應的健康檢查端點，
並且這一端點基於插件在加密設定中的位置確定，例如 `/healthz/kms-provider-0`、`/healthz/kms-provider-1` 等。

這些健康檢查端點路徑是由伺服器硬編碼、生成並控制的。
`Individual Healthchecks` 的索引序號對應於 KMS 加密設定被處理的順序。

<!--
Until the steps defined in [Ensuring all secrets are encrypted](#ensuring-all-secrets-are-encrypted) are performed,
the `providers` list should end with the `identity: {}` provider to allow unencrypted data to be read.
Once all resources are encrypted, the `identity` provider should be removed to prevent the API server from honoring unencrypted data.
-->
在執行[確保所有 Secret 都加密](#ensuring-all-secrets-are-encrypted)中所給步驟之前，
`providers` 列表應以 `identity: {}` 提供程序作爲結尾，以允許讀取未加密的數據。
加密所有資源後，應移除 `identity` 提供程序，以防止 API 伺服器接受未加密的數據。

<!--
For details about the `EncryptionConfiguration` format, please check the
[API server encryption API reference](/docs/reference/config-api/apiserver-config.v1/).
-->
有關 `EncryptionConfiguration` 格式的更多詳細信息，請參閱
[kube-apiserver 加密 API 參考（v1）](/zh-cn/docs/reference/config-api/apiserver-config.v1/)。

<!--
## Verifying that the data is encrypted

When encryption at rest is correctly configured, resources are encrypted on write.
After restarting your `kube-apiserver`, any newly created or updated Secret or other resource types
configured in `EncryptionConfiguration` should be encrypted when stored. To verify,
you can use the `etcdctl` command line program to retrieve the contents of your secret data.
-->
## 驗證數據已經加密    {#verifying-that-the-data-is-encrypted}

當靜態加密被正確設定時，資源將在寫入時被加密。
重啓 `kube-apiserver` 後，所有新建或更新的 Secret 或在
`EncryptionConfiguration` 中設定的其他資源類型在存儲時應該已被加密。
要驗證這點，你可以用 `etcdctl` 命令列程序獲取私密數據的內容。

<!--
1. Create a new secret called `secret1` in the `default` namespace:
-->
1. 在默認的命名空間裏創建一個名爲 `secret1` 的 Secret：

   ```shell
   kubectl create secret generic secret1 -n default --from-literal=mykey=mydata
   ```

<!--
1. Using the `etcdctl` command line, read that secret out of etcd:
-->
2. 用 `etcdctl` 命令列，從 etcd 讀取出 Secret：

   ```shell
   ETCDCTL_API=3 etcdctl get /kubernetes.io/secrets/default/secret1 [...] | hexdump -C
   ```

   <!--
   where `[...]` contains the additional arguments for connecting to the etcd server.
   -->
   其中 `[...]` 包含連接 etcd 伺服器的額外參數。

<!--
1. Verify the stored secret is prefixed with `k8s:enc:kms:v1:` for KMS v1 or prefixed with `k8s:enc:kms:v2:` for KMS v2,
which indicates that the `kms` provider has encrypted the resulting data.
-->
3. 驗證對於 KMS v1，保存的 Secret 以 `k8s:enc:kms:v1:` 開頭，
   對於 KMS v2，保存的 Secret 以 `k8s:enc:kms:v2:` 開頭，這表明 `kms` 驅動已經對結果數據加密。

<!--
1. Verify that the secret is correctly decrypted when retrieved via the API:
-->
4. 驗證通過 API 獲取的 Secret 已被正確解密：

   ```shell
   kubectl describe secret secret1 -n default
   ```

   <!--
   The Secret should contain `mykey: mydata`
   -->
   Secret 應包含 `mykey: mydata`。

<!--
## Ensuring all secrets are encrypted

When encryption at rest is correctly configured, resources are encrypted on write.
Thus we can perform an in-place no-op update to ensure that data is encrypted.
-->
## 確保所有 Secret 都已被加密    {#ensuring-all-secrets-are-encrypted}

當靜態加密被正確設定時，資源將在寫入時被加密。
這樣我們可以執行就地零干預更新來確保數據被加密。

<!--
The following command reads all secrets and then updates them to apply server side encryption.
If an error occurs due to a conflicting write, retry the command.
For larger clusters, you may wish to subdivide the secrets by namespace or script an update.
-->
下列命令讀取所有 Secret 並更新它們以便應用伺服器端加密。如果因爲寫入衝突導致錯誤發生，
請重試此命令。對較大的叢集，你可能希望根據命名空間或腳本更新去細分 Secret 內容。

```shell
kubectl get secrets --all-namespaces -o json | kubectl replace -f -
```

<!--
## Switching from a local encryption provider to the KMS provider

To switch from a local encryption provider to the `kms` provider and re-encrypt all of the secrets:
-->
## 從本地加密驅動切換到 KMS 驅動    {#switching-from-a-local-encryption-provider-to-the-kms-provider}

爲了從本地加密驅動切換到 `kms` 驅動並重新加密所有 Secret 內容：

<!--
1. Add the `kms` provider as the first entry in the configuration file as shown in the following example.
-->
1. 在設定文件中加入 `kms` 驅動作爲第一個條目，如下列樣例所示

   ```yaml
   apiVersion: apiserver.config.k8s.io/v1
   kind: EncryptionConfiguration
   resources:
     - resources:
         - secrets
       providers:
         - kms:
             apiVersion: v2
             name : myKmsPlugin
             endpoint: unix:///tmp/socketfile.sock
         - aescbc:
             keys:
               - name: key1
                 secret: <BASE 64 ENCODED SECRET>
   ```

<!--
1. Restart all `kube-apiserver` processes.

1. Run the following command to force all secrets to be re-encrypted using the `kms` provider.
-->
2. 重啓所有 `kube-apiserver` 進程。

3. 運行下列命令使用 `kms` 驅動強制重新加密所有 Secret。

   ```shell
   kubectl get secrets --all-namespaces -o json | kubectl replace -f -
   ```

## {{% heading "whatsnext" %}}

<!-- preserve legacy hyperlinks -->
<a id="disabling-encryption-at-rest" />

<!--
If you no longer want to use encryption for data persisted in the Kubernetes API, read
[decrypt data that are already stored at rest](/docs/tasks/administer-cluster/decrypt-data/).
-->
如果你不想再對 Kubernetes API 中保存的數據加密，
請閱讀[解密已靜態存儲的數據](/zh-cn/docs/tasks/administer-cluster/decrypt-data/)。
