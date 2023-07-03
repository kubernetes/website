---
title: 使用 KMS 驱动进行数据加密
content_type: task
weight: 370
---
<!--
reviewers:
- smarterclayton
- enj
title: Using a KMS provider for data encryption
content_type: task
weight: 370
-->
<!-- overview -->

<!--
This page shows how to configure a Key Management Service (KMS) provider and plugin to enable secret data encryption.
Currently there are two KMS API versions. New integrations that only need to support Kubernetes v1.27+ 
should use KMS v2 as it offers significantly better performance characteristics than v1
(note the `Caution` sections below for specific cases when KMS v2 must not be used.)
-->
本页展示了如何配置密钥管理服务（Key Management Service，KMS）驱动和插件以启用 Secret 数据加密。
目前有两个 KMS API 版本。如果是只需要支持 Kubernetes v1.27+ 的新场景，应使用 KMS v2，
因为 KMS v2 相比 KMS v1 具有显著更佳的性能特征。
（请注意，下文的“注意”部分说明了不得使用 KMS v2 的特殊场景。）

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

<!--
The version of Kubernetes that you need depends on which KMS API version
you have selected.

- If you selected KMS API v1, any supported Kubernetes version will work fine.
- If you selected KMS API v2, you should use Kubernetes v{{< skew currentVersion >}}
  (if you are running a different version of Kubernetes that also supports the v2 KMS
  API, switch to the documentation for that version of Kubernetes).
-->
你所需要的 Kubernetes 版本取决于你已选择的 KMS API 版本。

- 如果你选择了 KMS API v1，所有受支持的 Kubernetes 版本都可以正常工作。
- 如果你选择了 KMS API v2，则应使用 Kubernetes v{{< skew currentVersion >}}
  （如果你正在运行也支持 KMS API v2 的其他 Kubernetes 版本，需查阅该 Kubernetes 版本的文档）。

{{< version-check >}}

### KMS v1

{{< feature-state for_k8s_version="v1.12" state="beta" >}}

<!--
* Kubernetes version 1.10.0 or later is required

* Your cluster must use etcd v3 or later
-->
* 需要 Kubernetes 1.10.0 或更高版本
* 你的集群必须使用 etcd v3 或更高版本

### KMS v2

{{< feature-state for_k8s_version="v1.27" state="beta" >}}

<!--
* For version 1.25 and 1.26, enabling the feature via kube-apiserver feature gate is required.
Set `--feature-gates=KMSv2=true` to configure a KMS v2 provider.

* Your cluster must use etcd v3 or later
-->
* 对于 Kubernetes 1.25 和 1.26 版本，需要通过 kube-apiserver 特性门控启用此特性。
  设置 `--feature-gates=KMSv2=true` 以配置 KMS v2 驱动。

* 你的集群必须使用 etcd v3 或更高版本。

{{< caution >}}
<!--
The KMS v2 API and implementation changed in incompatible ways in-between the alpha release in v1.25
and the beta release in v1.27.  Attempting to upgrade from old versions with the alpha feature
enabled will result in data loss.
-->
KMS v2 API 和实现在 v1.25 的 Alpha 版本和 v1.27 的 Beta 版本之间以不兼容的方式进行了更改。
如果尝试从启用了 Alpha 特性的旧版本进行升级将导致数据丢失。
{{< /caution >}}

<!-- steps -->

<!--
The KMS encryption provider uses an envelope encryption scheme to encrypt data in etcd.
The data is encrypted using a data encryption key (DEK).
The DEKs are encrypted with a key encryption key (KEK) that is stored and managed in a remote KMS.
With KMS v1, a new DEK is generated for each encryption.
With KMS v2, a new DEK is generated on server startup and when the KMS plugin informs the API server
that a KEK rotation has occurred (see `Understanding key_id and Key Rotation` section below).
The KMS provider uses gRPC to communicate with a specific KMS plugin over a UNIX domain socket.
The KMS plugin, which is implemented as a gRPC server and deployed on the same host(s)
as the Kubernetes control plane, is responsible for all communication with the remote KMS.
-->
KMS 加密驱动使用封套加密模型来加密 etcd 中的数据。数据使用数据加密密钥（DEK）加密。
这些 DEK 经一个密钥加密密钥（KEK）加密后在一个远端的 KMS 中存储和管理。
对于 KMS v1，每次加密将生成新的 DEK。对于 KMS v2，在服务器启动和 KMS 插件通知 API
服务器已出现 KEK 轮换时生成新的 DEK。（参见以下“了解 key_id 和密钥轮换”章节）。
KMS 驱动使用 gRPC 通过 UNIX 域套接字与一个特定的 KMS 插件通信。
这个 KMS 插件作为一个 gRPC 服务器被部署在 Kubernetes 控制平面的相同主机上，负责与远端 KMS 的通信。

{{< caution >}}
<!--
If you are running virtual machine (VM) based nodes that leverage VM state store with this feature, you must not use KMS v2.

With KMS v2, the API server uses AES-GCM with a 12 byte nonce (8 byte atomic counter and 4 bytes random data) for encryption. 
The following issues could occur if the VM is saved and restored:
-->
如果你正在运行基于虚拟机 (VM) 的节点并利用此特性使用 VM 状态存储，则不得使用 KMS v2。

使用 KMS v2 时，API 服务器使用带有 12 字节随机数（8 字节原子计数器和 4 字节随机数据）
的 AES-GCM 进行加密。如果保存并恢复 VM，则可能会出现以下问题：

<!--
1. The counter value may be lost or corrupted if the VM is saved in an inconsistent state or restored improperly. 
   This can lead to a situation where the same counter value is used twice, resulting in the same nonce being used 
   for two different messages.
2. If the VM is restored to a previous state, the counter value may be set back to its previous value, 
   resulting in the same nonce being used again.
-->
1. 如果 VM 在不一致的状态下保存或恢复不当，则可能会丢失或损坏计数器值。
   这可能导致相同的计数器值被用了两次，从而造成两个不同的消息使用相同的随机数。
2. 如果将 VM 还原到先前的状态，则计数器值可能会被设置回其先前的值，导致再次使用相同的随机数。

<!--
Although both of these cases are partially mitigated by the 4 byte random nonce, this can compromise 
the security of the encryption.
-->
尽管这两种情况都通过 4 字节随机数进行了部分缓解，但这可能会损害加密的安全性。
{{< /caution >}}

<!--
## Configuring the KMS provider

To configure a KMS provider on the API server, include a provider of type `kms` in the
`providers` array in the encryption configuration file and set the following properties:
-->
## 配置 KMS 驱动   {#configuring-the-kms-provider}

为了在 API 服务器上配置 KMS 驱动，在加密配置文件中的 `providers` 数组中加入一个类型为 `kms`
的驱动，并设置下列属性：

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
* `apiVersion`：针对 KMS 驱动的 API 版本。此项留空或设为 `v1`。
* `name`：KMS 插件的显示名称。一旦设置，就无法更改。
* `endpoint`：gRPC 服务器（KMS 插件）的监听地址。该端点是一个 UNIX 域套接字。
* `cachesize`：以明文缓存的数据加密密钥（DEK）的数量。一旦被缓存，
  就可以直接使用 DEK 而无需另外调用 KMS；而未被缓存的 DEK 需要调用一次 KMS 才能解包。
* `timeout`：在返回一个错误之前，`kube-apiserver` 等待 kms-plugin 响应的时间（默认是 3 秒）。

### KMS v2 {#configuring-the-kms-provider-kms-v2}

<!--
* `apiVersion`: API Version for KMS provider. Set this to `v2`.
* `name`: Display name of the KMS plugin. Cannot be changed once set.
* `endpoint`: Listen address of the gRPC server (KMS plugin). The endpoint is a UNIX domain socket.
* `timeout`: How long should `kube-apiserver` wait for kms-plugin to respond before
  returning an error (default is 3 seconds).
-->
* `apiVersion`：针对 KMS 驱动的 API 版本。此项设为 `v2`。
* `name`：KMS 插件的显示名称。一旦设置，就无法更改。
* `endpoint`：gRPC 服务器（KMS 插件）的监听地址。该端点是一个 UNIX 域套接字。
* `timeout`：在返回一个错误之前，`kube-apiserver` 等待 kms-plugin 响应的时间（默认是 3 秒）。

<!--
KMS v2 does not support the `cachesize` property. All data encryption keys (DEKs) will be cached in
the clear once the server has unwrapped them via a call to the KMS. Once cached, DEKs can be used
to perform decryption indefinitely without making a call to the KMS.
-->
KMS v2 不支持 `cachesize` 属性。一旦服务器通过调用 KMS 解密了数据加密密钥 (DEK)，
所有的 DEK 将会以明文形式被缓存。一旦被缓存，DEK 可以无限期地用于解密操作，而无需再次调用 KMS。

<!--
See [Understanding the encryption at rest configuration.](/docs/tasks/administer-cluster/encrypt-data)
-->
参见[理解静态配置加密](/zh-cn/docs/tasks/administer-cluster/encrypt-data)

<!--
## Implementing a KMS plugin

To implement a KMS plugin, you can develop a new plugin gRPC server or enable a KMS plugin
already provided by your cloud provider.
You then integrate the plugin with the remote KMS and deploy it on the Kubernetes master.
-->
## 实现 KMS 插件   {#implementing-a-kms-plugin}

为实现一个 KMS 插件，你可以开发一个新的插件 gRPC 服务器或启用一个由你的云服务驱动提供的 KMS 插件。
你可以将这个插件与远程 KMS 集成，并把它部署到 Kubernetes 的主服务器上。

<!--
### Enabling the KMS supported by your cloud provider 
Refer to your cloud provider for instructions on enabling the cloud provider-specific KMS plugin.
-->
### 启用由云服务驱动支持的 KMS   {#enabling-the-kms-supported-by-your-cloud-provider}

有关启用云服务驱动特定的 KMS 插件的说明，请咨询你的云服务驱动商。

<!--
### Developing a KMS plugin gRPC server

You can develop a KMS plugin gRPC server using a stub file available for Go. For other languages,
you use a proto file to create a stub file that you can use to develop the gRPC server code.
-->
### 开发 KMS 插件 gRPC 服务器   {#developing-a-kms-plugin-grpc-server}

你可以使用 Go 语言的存根文件开发 KMS 插件 gRPC 服务器。
对于其他语言，你可以用 proto 文件创建可以用于开发 gRPC 服务器代码的存根文件。

#### KMS v1 {#developing-a-kms-plugin-gRPC-server-kms-v1}

<!--
* Using Go: Use the functions and data structures in the stub file:
  [api.pb.go](https://github.com/kubernetes/kubernetes/blob/release-1.25/staging/src/k8s.io/apiserver/pkg/storage/value/encrypt/envelope/v1beta1/api.pb.go)
  to develop the gRPC server code 
-->
* 使用 Go：使用存根文件 [api.pb.go](https://github.com/kubernetes/kubernetes/blob/release-1.25/staging/src/k8s.io/apiserver/pkg/storage/value/encrypt/envelope/v1beta1/api.pb.go)
  中的函数和数据结构开发 gRPC 服务器代码。

<!--
* Using languages other than Go: Use the protoc compiler with the proto file:
  [api.proto](https://github.com/kubernetes/kubernetes/blob/release-1.25/staging/src/k8s.io/apiserver/pkg/storage/value/encrypt/envelope/v1beta1/api.proto)
  to generate a stub file for the specific language
-->
* 使用 Go 以外的其他语言：用 protoc 编译器编译 proto 文件：
  [api.proto](https://github.com/kubernetes/kubernetes/blob/release-1.25/staging/src/k8s.io/apiserver/pkg/storage/value/encrypt/envelope/v1beta1/api.proto)
  为指定语言生成存根文件。

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
* 使用 Go：提供了一个高级[库](https://github.com/kubernetes/kms/blob/release-{{< skew currentVersion >}}/pkg/service/interface.go)简化这个过程。
  底层实现可以使用存根文件
  [api.pb.go](https://github.com/kubernetes/kms/blob/release-{{< skew currentVersion >}}/apis/v2/api.pb.go)
  中的函数和数据结构开发 gRPC 服务器代码。

* 使用 Go 以外的其他语言：用 protoc 编译器编译 proto 文件：
  [api.proto](https://github.com/kubernetes/kms/blob/release-{{< skew currentVersion >}}/apis/v2/api.proto)
  为指定语言生成存根文件。

<!--
Then use the functions and data structures in the stub file to develop the server code.
-->
然后使用存根文件中的函数和数据结构开发服务器代码。

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

  作为对过程调用 Version 的响应，兼容的 KMS 插件应把 `v1beta1` 作为 `VersionResponse.version` 版本返回。

* 消息版本：`v1beta1`

  所有来自 KMS 驱动的消息都把 version 字段设置为 `v1beta1`。

<!--
* protocol: UNIX domain socket (`unix`)

  The plugin is implemented as a gRPC server that listens at UNIX domain socket. The plugin deployment should create a file on the file system to run the gRPC unix domain socket connection. The API server (gRPC client) is configured with the KMS provider (gRPC server) unix domain socket endpoint in order to communicate with it. An abstract Linux socket may be used by starting the endpoint with `/@`, i.e. `unix:///@foo`. Care must be taken when using this type of socket as they do not have concept of ACL (unlike traditional file based sockets). However, they are subject to Linux networking namespace, so will only be accessible to containers within the same pod unless host networking is used.
-->
* 协议：UNIX 域套接字 (`unix`)

  该插件被实现为一个在 UNIX 域套接字上侦听的 gRPC 服务器。
  该插件部署时应在文件系统上创建一个文件来运行 gRPC UNIX 域套接字连接。
  API 服务器（gRPC 客户端）配置了 KMS 驱动（gRPC 服务器）UNIX 域套接字端点，以便与其通信。
  通过以 `/@` 开头的端点，可以使用一个抽象的 Linux 套接字，即 `unix:///@foo`。
  使用这种类型的套接字时必须小心，因为它们没有 ACL 的概念（与传统的基于文件的套接字不同）。
  然而，这些套接字遵从 Linux 网络命名空间约束，因此只能由同一 Pod 中的容器进行访问，除非使用了主机网络。

##### KMS v2 {#developing-a-kms-plugin-gRPC-server-notes-kms-v2}

<!--
* KMS plugin version: `v2beta1`

  In response to procedure call `Status`, a compatible KMS plugin should return `v2beta1` as `StatusResponse.version`,
  "ok" as `StatusResponse.healthz` and a `key_id` (remote KMS KEK ID) as `StatusResponse.key_id`.
-->
* KMS 插件版本：`v2beta1`

  作为对过程调用 `Status` 的响应，兼容的 KMS 插件应把 `v2beta1` 作为 `StatusResponse.Version` 版本、
  “ok” 作为 `StatusResponse.healthz` 并且 `key_id`（远程 KMS KEK ID）作为 `StatusResponse.key_id` 返回。

  <!--
  The API server polls the `Status` procedure call approximately every minute when everything is healthy,
  and every 10 seconds when the plugin is not healthy.  Plugins must take care to optimize this call as it will be
  under constant load.
  -->
  当一切健康时，API 服务器大约每分钟轮询一次 `Status` 过程调用，
  而插件不健康时每 10 秒钟轮询一次。使用这些插件时要注意优化此调用，因为此调用将经受持续的负载。

<!--
* Encryption

  The `EncryptRequest` procedure call provides the plaintext and a UID for logging purposes.  The response must include
  the ciphertext, the `key_id` for the KEK used, and, optionally, any metadata that the KMS plugin needs to aid in
  future `DecryptRequest` calls (via the `annotations` field).  The plugin must guarantee that any distinct plaintext
  results in a distinct response `(ciphertext, key_id, annotations)`.
-->
* 加密

  `EncryptRequest` 过程调用提供明文和一个 UID 以用于日志记录。
  响应必须包括密文、使用的 KEK 的 `key_id`，以及可选的任意元数据，这些元数据可以
  帮助 KMS 插件在未来的 `DecryptRequest` 调用中（通过 `annotations` 字段）进行解密。
  插件必须保证所有不同的明文都会产生不同的响应 `(ciphertext, key_id, annotations)`。

  <!--
  If the plugin returns a non-empty `annotations` map, all map keys must be fully qualified domain names such as
  `example.com`. An example use case of `annotation` is `{"kms.example.io/remote-kms-auditid":"<audit ID used by the remote KMS>"}`

  The API server does not perform the `EncryptRequest` procedure call at a high rate.  Plugin implementations should
  still aim to keep each request's latency at under 100 milliseconds.
  -->
  如果插件返回一个非空的 `annotations` 映射，则所有映射键必须是完全限定域名，
  例如 `example.com`。`annotation` 的一个示例用例是
  `{"kms.example.io/remote-kms-auditid":"<远程 KMS 使用的审计 ID>"}`。

  当 API 服务器运行正常时，并不会高频执行 `EncryptRequest` 过程调用。
  插件实现仍应力求使每个请求的延迟保持在 100 毫秒以下。

<!--
* Decryption

  The `DecryptRequest` procedure call provides the `(ciphertext, key_id, annotations)` from `EncryptRequest` and a UID
  for logging purposes.  As expected, it is the inverse of the `EncryptRequest` call.  Plugins must verify that the
  `key_id` is one that they understand - they must not attempt to decrypt data unless they are sure that it was
  encrypted by them at an earlier time.
-->
* 解密

  `DecryptRequest` 过程调用提供 `EncryptRequest` 中的 `(ciphertext, key_id, annotations)`
  和一个 UID 以用于日志记录。正如预期的那样，它是 `EncryptRequest` 调用的反向操作。插件必须验证
  `key_id` 是否为其理解的密钥ID - 除非这些插件确定数据是之前自己加密的，否则不应尝试解密。

  <!--
  The API server may perform thousands of `DecryptRequest` procedure calls on startup to fill its watch cache.  Thus
  plugin implementations must perform these calls as quickly as possible, and should aim to keep each request's latency
  at under 10 milliseconds.
  -->
  在启动时，API 服务器可能会执行数千个 `DecryptRequest` 过程调用以填充其监视缓存。
  因此，插件实现必须尽快执行这些调用，并应力求使每个请求的延迟保持在 10 毫秒以下。

<!--
* Understanding `key_id` and Key Rotation

  The `key_id` is the public, non-secret name of the remote KMS KEK that is currently in use.  It may be logged
  during regular operation of the API server, and thus must not contain any private data.  Plugin implementations
  are encouraged to use a hash to avoid leaking any data.  The KMS v2 metrics take care to hash this value before
  exposing it via the `/metrics` endpoint.
-->
* 理解 `key_id` 和密钥轮换

  `key_id` 是目前使用的远程 KMS KEK 的公共、非机密名称。
  它可能会在 API 服务器的常规操作期间记录，因此不得包含任何私有数据。
  建议插件实现使用哈希来避免泄漏任何数据。
  KMS v2 指标负责在通过 `/metrics` 端点公开之前对此值进行哈希。

  <!--
  The API server considers the `key_id` returned from the `Status` procedure call to be authoritative.  Thus, a change
  to this value signals to the API server that the remote KEK has changed, and data encrypted with the old KEK should
  be marked stale when a no-op write is performed (as described below).  If an `EncryptRequest` procedure call returns a
  `key_id` that is different from `Status`, the response is thrown away and the plugin is considered unhealthy.  Thus
  implementations must guarantee that the `key_id` returned from `Status` will be the same as the one returned by
  `EncryptRequest`.  Furthermore, plugins must ensure that the `key_id` is stable and does not flip-flop between values
  (i.e. during a remote KEK rotation).
  -->
  API 服务器认为从 `Status` 过程调用返回的 `key_id` 是权威性的。因此，此值的更改表示远程 KEK 已更改，
  并且使用旧 KEK 加密的数据应在执行无操作写入时标记为过期（如下所述）。如果 `EncryptRequest`
  过程调用返回与 `Status` 不同的 `key_id`，则响应将被丢弃，并且插件将被认为是不健康的。
  因此，插件实现必须保证从 `Status` 返回的 `key_id` 与 `EncryptRequest` 返回的 `key_id` 相同。
  此外，插件必须确保 `key_id` 是稳定的，并且不会在不同值之间翻转（即在远程 KEK 轮换期间）。

  <!--
  Plugins must not re-use `key_id`s, even in situations where a previously used remote KEK has been reinstated.  For
  example, if a plugin was using `key_id=A`, switched to `key_id=B`, and then went back to `key_id=A` - instead of
  reporting `key_id=A` the plugin should report some derivative value such as `key_id=A_001` or use a new value such
  as `key_id=C`.
  -->
  插件不能重新使用 `key_id`，即使在先前使用的远程 KEK 被恢复的情况下也是如此。
  例如，如果插件使用了 `key_id=A`，切换到 `key_id=B`，然后又回到 `key_id=A`，
  那么插件应报告 `key_id=A_001` 或使用一个新值，如 `key_id=C`。

  <!--
  Since the API server polls `Status` about every minute, `key_id` rotation is not immediate.  Furthermore, the API
  server will coast on the last valid state for about three minutes.  Thus if a user wants to take a passive approach
  to storage migration (i.e. by waiting), they must schedule a migration to occur at `3 + N + M` minutes after the
  remote KEK has been rotated (`N` is how long it takes the plugin to observe the `key_id` change and `M` is the
  desired buffer to allow config changes to be processed - a minimum `M` of five minutes is recommend).  Note that no
  API server restart is required to perform KEK rotation.
  -->
  由于 API 服务器大约每分钟轮询一次 `Status`，因此 `key_id` 轮换并不立即发生。
  此外，API 服务器在三分钟内以最近一个有效状态为准。因此，
  如果用户想采取被动方法进行存储迁移（即等待），则必须安排迁移在远程 KEK 轮换后的 `3 + N + M` 分钟内发生
  （其中 `N` 表示插件观察 `key_id` 更改所需的时间，`M` 是允许处理配置更改的缓冲区时间 - 建议至少使用 5 分钟）。
  请注意，执行 KEK 轮换不需要进行 API 服务器重启。

  {{< caution >}}  
  <!--
  Because you don't control the number of writes performed with the DEK, we recommend rotating the KEK at least every 90 days.
  -->
  因为你未控制使用 DEK 执行的写入次数，所以建议至少每 90 天轮换一次 KEK。
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
* 协议：UNIX 域套接字 (`unix`)

  该插件被实现为一个在 UNIX 域套接字上侦听的 gRPC 服务器。
  该插件部署时应在文件系统上创建一个文件来运行 gRPC UNIX 域套接字连接。
  API 服务器（gRPC 客户端）配置了 KMS 驱动（gRPC 服务器）UNIX 域套接字端点，以便与其通信。
  通过以 `/@` 开头的端点，可以使用一个抽象的 Linux 套接字，即 `unix:///@foo`。
  使用这种类型的套接字时必须小心，因为它们没有 ACL 的概念（与传统的基于文件的套接字不同）。
  然而，这些套接字遵从 Linux 网络命名空间，因此只能由同一 Pod 中的容器进行访问，除非使用了主机网络。

<!--
### Integrating a KMS plugin with the remote KMS

The KMS plugin can communicate with the remote KMS using any protocol supported by the KMS.
All configuration data, including authentication credentials the KMS plugin uses to communicate with the remote KMS,
are stored and managed by the KMS plugin independently.
The KMS plugin can encode the ciphertext with additional metadata that may be required before sending it to the KMS
for decryption (KMS v2 makes this process easier by providing a dedicated `annotations` field).
-->
### 将 KMS 插件与远程 KMS 整合   {#integrating-a-kms-plugin-with-the-remote-kms}

KMS 插件可以用任何受 KMS 支持的协议与远程 KMS 通信。
所有的配置数据，包括 KMS 插件用于与远程 KMS 通信的认证凭据，都由 KMS 插件独立地存储和管理。
KMS 插件可以用额外的元数据对密文进行编码，这些元数据是在把它发往 KMS 进行解密之前可能要用到的
（KMS v2 提供了专用的 `annotations` 字段简化了这个过程）。

<!--
### Deploying the KMS plugin

Ensure that the KMS plugin runs on the same host(s) as the Kubernetes master(s).
-->
### 部署 KMS 插件   {#deploying-the-kms-plugin}

确保 KMS 插件与 Kubernetes 主服务器运行在同一主机上。

<!--
## Encrypting your data with the KMS provider

To encrypt the data:
-->
## 使用 KMS 驱动加密数据   {#encrypting-your-data-with-the-kms-provider}

为了加密数据：

<!--
1. Create a new `EncryptionConfiguration` file using the appropriate properties for the `kms` provider
to encrypt resources like Secrets and ConfigMaps. If you want to encrypt an extension API that is
defined in a CustomResourceDefinition, your cluster must be running Kubernetes v1.26 or newer.

1. Set the `--encryption-provider-config` flag on the kube-apiserver to point to the location of the configuration file.
-->
1. 使用适合于 `kms` 驱动的属性创建一个新的 `EncryptionConfiguration` 文件，以加密
   Secret 和 ConfigMap 等资源。
   如果要加密使用 CustomResourceDefinition 定义的扩展 API，你的集群必须运行 Kubernetes v1.26 或更高版本。

2. 设置 kube-apiserver 的 `--encryption-provider-config` 参数指向配置文件的位置。

<!--
1. `--encryption-provider-config-automatic-reload` boolean argument determines if the file set by `--encryption-provider-config` should be automatically reloaded if the disk contents change. This enables key rotation without API server restarts.

1. Restart your API server.
-->
3. `--encryption-provider-config-automatic-reload` 布尔参数决定了磁盘内容发生变化时是否应自动重新加载
   通过 `--encryption-provider-config` 设置的文件。这样可以在不重启 API 服务器的情况下进行密钥轮换。

4. 重启你的 API 服务器。

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
             endpoint: unix:///tmp/socketfile.sock
             cachesize: 100
             timeout: 3s
         - kms:
             name: myKmsPluginBar
             endpoint: unix:///tmp/socketfile.sock
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
             endpoint: unix:///tmp/socketfile.sock
             timeout: 3s
         - kms:
             apiVersion: v2
             name: myKmsPluginBar
             endpoint: unix:///tmp/socketfile.sock
             timeout: 3s
   ```

<!--
Setting `--encryption-provider-config-automatic-reload` to `true` collapses all health checks to a single health check endpoint. Individual health checks are only available when KMS v1 providers are in use and the encryption config is not auto-reloaded.

The following table summarizes the health check endpoints for each KMS version:
-->
`--encryption-provider-config-automatic-reload` 设置为 `true` 会将所有健康检查集中到同一个健康检查端点。
只有 KMS v1 驱动正使用且加密配置未被自动重新加载时，才能进行独立的健康检查。

下表总结了每个 KMS 版本的健康检查端点：

<!--
| KMS configurations | Without Automatic Reload | With Automatic Reload |
| ------------------ | ------------------------ | --------------------- |
| KMS v1 only        | Individual Healthchecks  | Single Healthcheck    |
| KMS v2 only        | Single Healthcheck       | Single Healthcheck    |
| Both KMS v1 and v2 | Individual Healthchecks  | Single Healthcheck    |
| No KMS             | None                     | Single Healthcheck    |
-->
| KMS 配置     | 没有自动重新加载           | 有自动重新加载       |
| ------------ | ----------------------- | ------------------ |
| 仅 KMS v1    | Individual Healthchecks | Single Healthcheck |
| 仅 KMS v2    | Single Healthcheck      | Single Healthcheck |
| KMS v1 和 v2 | Individual Healthchecks | Single Healthcheck |
| 没有 KMS     | 无                      | Single Healthcheck |

<!--
`Single Healthcheck` means that the only health check endpoint is `/healthz/kms-providers`.

`Individual Healthchecks` means that each KMS plugin has an associated health check endpoint based on its location in the encryption config: `/healthz/kms-provider-0`, `/healthz/kms-provider-1` etc.

These healthcheck endpoint paths are hard coded and generated/controlled by the server. The indices for individual healthchecks corresponds to the order in which the KMS encryption config is processed.
-->
`Single Healthcheck` 意味着唯一的健康检查端点是 `/healthz/kms-providers`。

`Individual Healthchecks` 意味着每个 KMS 插件都有一个对应的健康检查端点，
并且这一端点基于插件在加密配置中的位置确定，例如 `/healthz/kms-provider-0`、`/healthz/kms-provider-1` 等。

这些健康检查端点路径是由服务器硬编码、生成并控制的。
`Individual Healthchecks` 的索引序号对应于 KMS 加密配置被处理的顺序。

<!--
At a high level, restarting an API server when a KMS plugin is unhealthy is unlikely to make the situation better.
It can make the situation significantly worse by throwing away the API server's DEK cache.  Thus the general
recommendation is to ignore the API server KMS healthz checks for liveness purposes, i.e. `/livez?exclude=kms-providers`.
-->
一般而言，在 KMS 插件出现故障时重新启动 API 服务器并不太可能改善情况。
这样做会由于丢弃 API 服务器的 DEK 缓存使情况显著恶化。因此，
一般建议忽略出于存活性探测的目的而对 API 服务器 KMS 的健康检查，
即 `/livez?exclude=kms-providers`。

<!--
Until the steps defined in [Ensuring all secrets are encrypted](#ensuring-all-secrets-are-encrypted) are performed,
the `providers` list should end with the `identity: {}` provider to allow unencrypted data to be read.
Once all resources are encrypted, the `identity` provider should be removed to prevent the API server from honoring unencrypted data.
-->
在执行[确保所有 Secret 都加密](#ensuring-all-secrets-are-encrypted)中所给步骤之前，
`providers` 列表应以 `identity: {}` 提供程序作为结尾，以允许读取未加密的数据。
加密所有资源后，应移除 `identity` 提供程序，以防止 API 服务器接受未加密的数据。

<!--
For details about the `EncryptionConfiguration` format, please check the
[API server encryption API reference](/docs/reference/config-api/apiserver-encryption.v1/).
-->
有关 `EncryptionConfiguration` 格式的更多详细信息，请参阅
[kube-apiserver 加密 API 参考 (v1)](/zh-cn/docs/reference/config-api/apiserver-encryption.v1/).

<!--
## Verifying that the data is encrypted

When encryption at rest is correctly configured, resources are encrypted on write.
After restarting your `kube-apiserver`, any newly created or updated Secret or other resource types
configured in `EncryptionConfiguration` should be encrypted when stored. To verify,
you can use the `etcdctl` command line program to retrieve the contents of your secret data.
-->
## 验证数据已经加密    {#verifying-that-the-data-is-encrypted}

当静态加密被正确配置时，资源将在写入时被加密。
重启 `kube-apiserver` 后，所有新建或更新的 Secret 或在
`EncryptionConfiguration` 中配置的其他资源类型在存储时应该已被加密。
要验证这点，你可以用 `etcdctl` 命令行程序获取私密数据的内容。

<!--
1. Create a new secret called `secret1` in the `default` namespace:
-->
1. 在默认的命名空间里创建一个名为 `secret1` 的 Secret：

   ```shell
   kubectl create secret generic secret1 -n default --from-literal=mykey=mydata
   ```

<!--
1. Using the `etcdctl` command line, read that secret out of etcd:
-->
2. 用 `etcdctl` 命令行，从 etcd 读取出 Secret：

   ```shell
   ETCDCTL_API=3 etcdctl get /kubernetes.io/secrets/default/secret1 [...] | hexdump -C
   ```

   <!--
   where `[...]` contains the additional arguments for connecting to the etcd server.
   -->
   其中 `[...]` 包含连接 etcd 服务器的额外参数。

<!--
1. Verify the stored secret is prefixed with `k8s:enc:kms:v1:` for KMS v1 or prefixed with `k8s:enc:kms:v2:` for KMS v2,
which indicates that the `kms` provider has encrypted the resulting data.
-->
3. 验证对于 KMS v1，保存的 Secret 以 `k8s:enc:kms:v1:` 开头，
   对于 KMS v2，保存的 Secret 以 `k8s:enc:kms:v2:` 开头，这表明 `kms` 驱动已经对结果数据加密。

<!--
1. Verify that the secret is correctly decrypted when retrieved via the API:
-->
4. 验证通过 API 获取的 Secret 已被正确解密：

   ```shell
   kubectl describe secret secret1 -n default
   ```

   <!--
   The Secret should contain `mykey: mydata`
   -->
   Secret 应包含 `mykey: mydata`。

<!--
## Ensuring all secrets are encrypted

When encryption at rest is correctly configured, resources are encrypted on write.
Thus we can perform an in-place no-op update to ensure that data is encrypted.
-->
## 确保所有 Secret 都已被加密    {#ensuring-all-secrets-are-encrypted}

当静态加密被正确配置时，资源将在写入时被加密。
这样我们可以执行就地零干预更新来确保数据被加密。

<!--
The following command reads all secrets and then updates them to apply server side encryption.
If an error occurs due to a conflicting write, retry the command.
For larger clusters, you may wish to subdivide the secrets by namespace or script an update.
-->
下列命令读取所有 Secret 并更新它们以便应用服务器端加密。如果因为写入冲突导致错误发生，
请重试此命令。对较大的集群，你可能希望根据命名空间或脚本更新去细分 Secret 内容。

```shell
kubectl get secrets --all-namespaces -o json | kubectl replace -f -
```

<!--
## Switching from a local encryption provider to the KMS provider

To switch from a local encryption provider to the `kms` provider and re-encrypt all of the secrets:
-->
## 从本地加密驱动切换到 KMS 驱动    {#switching-from-a-local-encryption-provider-to-the-kms-provider}

为了从本地加密驱动切换到 `kms` 驱动并重新加密所有 Secret 内容：

<!--
1. Add the `kms` provider as the first entry in the configuration file as shown in the following example.
-->
1. 在配置文件中加入 `kms` 驱动作为第一个条目，如下列样例所示

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
2. 重启所有 `kube-apiserver` 进程。

3. 运行下列命令使用 `kms` 驱动强制重新加密所有 Secret。

   ```shell
   kubectl get secrets --all-namespaces -o json | kubectl replace -f -
   ```

<!--
## Disabling encryption at rest

To disable encryption at rest:
-->
## 禁用静态数据加密   {#disabling-encryption-at-rest}

要禁用静态数据加密：

<!--
1. Place the `identity` provider as the first entry in the configuration file:
-->
1. 将 `identity` 驱动作为配置文件中的第一个条目：

   ```yaml
   apiVersion: apiserver.config.k8s.io/v1
   kind: EncryptionConfiguration
   resources:
     - resources:
         - secrets
       providers:
         - identity: {}
         - kms:
             apiVersion: v2
             name : myKmsPlugin
             endpoint: unix:///tmp/socketfile.sock
   ```

<!--
1. Restart all `kube-apiserver` processes. 

1. Run the following command to force all secrets to be decrypted.
-->
2. 重启所有 `kube-apiserver` 进程。

3. 运行下列命令强制重新加密所有 Secret。

   ```shell
   kubectl get secrets --all-namespaces -o json | kubectl replace -f -
   ```
