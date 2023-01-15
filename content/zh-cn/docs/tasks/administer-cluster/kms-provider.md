---
title: 使用 KMS 驱动进行数据加密
content_type: task
---
<!--
reviewers:
- smarterclayton
title: Using a KMS provider for data encryption
content_type: task
-->
<!-- overview -->
<!--
This page shows how to configure a Key Management Service (KMS) provider and plugin to enable secret data encryption. 
Currently there are two KMS API versions. KMS v1 will continue to work while v2 develops in maturity. 
If you are not sure which KMS API version to pick, choose v1. 
-->

本页展示了如何配置密钥管理服务（Key Management Service，KMS）驱动和插件以启用 Secret 数据加密。
目前有两个 KMS API 版本。KMS v1 将继续工作，而 KMS v2 将开发得逐渐成熟。
如果你不确定要选用哪个 KMS API 版本，可选择 v1。

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

<!--
* Kubernetes version 1.10.0 or later is required

* Your cluster must use etcd v3 or later
-->
* 需要 Kubernetes 1.10.0 或更高版本
* 你的集群必须使用 etcd v3 或更高版本

{{< feature-state for_k8s_version="v1.12" state="beta" >}}

### KMS v2

<!--
* Kubernetes version 1.25.0 or later is required

* Set kube-apiserver feature gate: `--feature-gates=KMSv2=true` to configure a KMS v2 provider

* Your cluster must use etcd v3 or later
-->
* 需要 Kubernetes 1.25.0 或更高版本

* 设置 kube-apiserver 特性门控：`--feature-gates=KMSv2=true` 以配置 KMS v2 驱动

* 你的集群必须使用 etcd v3 或更高版本

{{< feature-state for_k8s_version="v1.25" state="alpha" >}}

<!-- steps -->

<!--
The KMS encryption provider uses an envelope encryption scheme to encrypt data in etcd.
The data is encrypted using a data encryption key (DEK); a new DEK is generated for each encryption.
The DEKs are encrypted with a key encryption key (KEK) that is stored and managed in a remote KMS.
The KMS provider uses gRPC to communicate with a specific KMS plugin.
The KMS plugin, which is implemented as a gRPC server and deployed on the same host(s)
as the Kubernetes control plane, is responsible for all communication with the remote KMS.
-->
KMS 加密驱动使用封套加密模型来加密 etcd 中的数据。
数据使用数据加密密钥（DEK）加密；每次加密都生成一个新的 DEK。
这些 DEK 经一个密钥加密密钥（KEK）加密后在一个远端的 KMS 中存储和管理。
KMS 驱动使用 gRPC 与一个特定的 KMS 插件通信。这个 KMS 插件作为一个 gRPC 
服务器被部署在 Kubernetes 控制平面的相同主机上，负责与远端 KMS 的通信。

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
* `name`: Display name of the KMS plugin. Cannot be changed once set.
* `endpoint`: Listen address of the gRPC server (KMS plugin). The endpoint is a UNIX domain socket.
* `cachesize`: Number of data encryption keys (DEKs) to be cached in the clear.
  When cached, DEKs can be used without another call to the KMS;
  whereas DEKs that are not cached require a call to the KMS to unwrap.
* `timeout`: How long should `kube-apiserver` wait for kms-plugin to respond before
  returning an error (default is 3 seconds).
-->
* `name`: KMS 插件的显示名称。一旦设置，就无法更改。
* `endpoint`: gRPC 服务器（KMS 插件）的监听地址。该端点是一个 UNIX 域套接字。
* `cachesize`: 以明文缓存的数据加密密钥（DEK）的数量。一旦被缓存，
  就可以直接使用 DEK 而无需另外调用 KMS；而未被缓存的 DEK 需要调用一次 KMS 才能解包。
* `timeout`: 在返回一个错误之前，`kube-apiserver` 等待 kms-plugin 响应的时间（默认是 3 秒）。

### KMS v2 {#configuring-the-kms-provider-kms-v2}

<!--
* `apiVersion`: API Version for KMS provider (Allowed values: v2, v1 or empty. Any other value will result in an error.)  Must be set to v2 to use the KMS v2 APIs.
* `name`: Display name of the KMS plugin. Cannot be changed once set.
* `endpoint`: Listen address of the gRPC server (KMS plugin). The endpoint is a UNIX domain socket.
* `cachesize`: Number of data encryption keys (DEKs) to be cached in the clear.
  When cached, DEKs can be used without another call to the KMS;
  whereas DEKs that are not cached require a call to the KMS to unwrap.
* `timeout`: How long should `kube-apiserver` wait for kms-plugin to respond before
  returning an error (default is 3 seconds).
-->
* `apiVersion`：针对 KMS 驱动的 API 版本（允许的值：v2、v1 或空值。任何其他值都将产生一个错误。）
  必须设置为 v2 才能使用 KMS v2 API。
* `name`：KMS 插件的显示名称。一旦设置，就无法更改。
* `endpoint`：gRPC 服务器（KMS 插件）的监听地址。该端点是一个 UNIX 域套接字。
* `cachesize`：以明文缓存的数据加密密钥（DEK）的数量。一旦被缓存，
  就可以直接使用 DEK 而无需另外调用 KMS；而未被缓存的 DEK 需要调用一次 KMS 才能解包。
* `timeout`：在返回一个错误之前，`kube-apiserver` 等待 kms-plugin 响应的时间（默认是 3 秒）。

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
* Using Go: Use the functions and data structures in the stub file:
  [api.pb.go](https://github.com/kubernetes/kubernetes/blob/release-1.25/staging/src/k8s.io/apiserver/pkg/storage/value/encrypt/envelope/v2alpha1/api.pb.go)
  to develop the gRPC server code 

* Using languages other than Go: Use the protoc compiler with the proto file:
  [api.proto](https://github.com/kubernetes/kubernetes/blob/release-1.25/staging/src/k8s.io/apiserver/pkg/storage/value/encrypt/envelope/v2alpha1/api.proto)
  to generate a stub file for the specific language
-->
* 使用 Go：使用存根文件 [api.pb.go](https://github.com/kubernetes/kubernetes/blob/release-1.25/staging/src/k8s.io/apiserver/pkg/storage/value/encrypt/envelope/v2alpha1/api.pb.go)
  中的函数和数据结构开发 gRPC 服务器代码。

* 使用 Go 以外的其他语言：用 protoc 编译器编译 proto 文件：
  [api.proto](https://github.com/kubernetes/kubernetes/blob/release-1.25/staging/src/k8s.io/apiserver/pkg/storage/value/encrypt/envelope/v2alpha1/api.proto)
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

  All messages from KMS provider have the version field set to current version v1beta1.
-->
* kms 插件版本：`v1beta1`

  作为对过程调用 Version 的响应，兼容的 KMS 插件应把 `v1beta1` 作为 `VersionResponse.version` 版本返回。

* 消息版本：`v1beta1`

  所有来自 KMS 驱动的消息都把 version 字段设置为当前版本 v1beta1

<!--
* protocol: UNIX domain socket (`unix`)

  The plugin is implemented as a gRPC server that listens at UNIX domain socket.
  The plugin deployment should create a file on the file system to run the gRPC unix domain socket connection.
  The API server (gRPC client) is configured with the KMS provider (gRPC server) unix domain socket endpoint in order to communicate with it.
  An abstract Linux socket may be used by starting the endpoint with `/@`, i.e. `unix:///@foo`.
  Care must be taken when using this type of socket as they do not have concept of ACL (unlike traditional file based sockets).
  However, they are subject to Linux networking namespace, so will only be accessible to containers within the same pod unless host networking is used.
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
* kms plugin version: `v2alpha1`

  In response to procedure call Status, a compatible KMS plugin should return `v2alpha1` as `StatusResponse.Version`,
  "ok" as `StatusResponse.Healthz` and a keyID (KMS KEK ID) as `StatusResponse.KeyID`
-->
* kms 插件版本：`v2alpha1`

  作为对过程调用 Status 的响应，兼容的 KMS 插件应把 `v2alpha1` 作为 `StatusResponse.Version` 版本、
  “ok” 作为 `StatusResponse.Healthz` 并且 keyID（KMS KEK ID）作为 `StatusResponse.KeyID` 返回。

<!--
* protocol: UNIX domain socket (`unix`)

  The plugin is implemented as a gRPC server that listens at UNIX domain socket.
  The plugin deployment should create a file on the file system to run the gRPC unix domain socket connection.
  The API server (gRPC client) is configured with the KMS provider (gRPC server) unix domain socket endpoint in order to communicate with it.
  An abstract Linux socket may be used by starting the endpoint with `/@`, i.e. `unix:///@foo`.
  Care must be taken when using this type of socket as they do not have concept of ACL (unlike traditional file based sockets).
  However, they are subject to Linux networking namespace, so will only be accessible to containers within the same pod unless host networking is used.
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
The KMS plugin can encode the ciphertext with additional metadata that may be required before sending it to the KMS for decryption.
-->
### 将 KMS 插件与远程 KMS 整合   {#integrating-a-kms-plugin-with-the-remote-kms}

KMS 插件可以用任何受 KMS 支持的协议与远程 KMS 通信。
所有的配置数据，包括 KMS 插件用于与远程 KMS 通信的认证凭据，都由 KMS 插件独立地存储和管理。
KMS 插件可以用额外的元数据对密文进行编码，这些元数据是在把它发往 KMS 进行解密之前可能要用到的。

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
1. Create a new `EncryptionConfiguration` file using the appropriate properties for the `kms` provider to encrypt resources like Secrets and ConfigMaps.

1. Set the `--encryption-provider-config` flag on the kube-apiserver to point to the location of the configuration file.

1. Restart your API server.
-->
1. 使用适合于 `kms` 驱动的属性创建一个新的 `EncryptionConfiguration` 文件，以加密
   Secret 和 ConfigMap 等资源。

2. 设置 kube-apiserver 的 `--encryption-provider-config` 参数指向配置文件的位置。

3. 重启你的 API 服务器。

### KMS v1 {#encrypting-your-data-with-the-kms-provider-kms-v1}

   ```yaml
   apiVersion: apiserver.config.k8s.io/v1
   kind: EncryptionConfiguration
   resources:
     - resources:
         - secrets
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
       providers:
         - kms:
             apiVersion: v2
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

Data is encrypted when written to etcd. After restarting your `kube-apiserver`, 
any newly created or updated secret should be encrypted when stored. To verify,
you can use the `etcdctl` command line program to retrieve the contents of your secret.
-->
## 验证数据已经加密    {#verifying-that-the-data-is-encrypted}

写入 etcd 时数据被加密。重启 `kube-apiserver` 后，任何新建或更新的 Secret 在存储时应该已被加密。
要验证这点，你可以用 `etcdctl` 命令行程序获取 Secret 内容。 

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

   结果应该是 `mykey: mydata`。 

<!--
## Ensuring all secrets are encrypted

Because secrets are encrypted on write, performing an update on a secret encrypts that content.
-->
## 确保所有 Secret 都已被加密    {#ensuring-all-secrets-are-encrypted}

因为 Secret 是在写入时被加密的，所以在更新 Secret 时也会加密该内容。

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
             name : myKmsPlugin
             endpoint: unix:///tmp/socketfile.sock
             cachesize: 100
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
             name : myKmsPlugin
             endpoint: unix:///tmp/socketfile.sock
             cachesize: 100
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

