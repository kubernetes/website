---
reviewers:
- smarterclayton
title: 使用 KMS 提供商进行数据加密
content_type: task
---
<!-- ---
reviewers:
- smarterclayton
title: Using a KMS provider for data encryption
content_type: task
--- -->
<!-- overview -->
<!-- This page shows how to configure a Key Management Service (KMS) provider and plugin to enable secret data encryption. -->

本页展示了如何配置秘钥管理服务—— Key Management Service (KMS) 提供商和插件以启用数据加密。



## {{% heading "prerequisites" %}}


* {{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!-- * Kubernetes version 1.10.0 or later is required -->

* 需要 Kubernetes 1.10.0 或更新版本

<!-- * etcd v3 or later is required -->

* 需要 etcd v3 或更新版本

{{< feature-state for_k8s_version="v1.12" state="beta" >}}



<!-- steps -->

<!-- The KMS encryption provider uses an envelope encryption scheme to encrypt data in etcd. The data is encrypted using a data encryption key (DEK); a new DEK is generated for each encryption. The DEKs are encrypted with a key encryption key (KEK) that is stored and managed in a remote KMS. The KMS provider uses gRPC to communicate with a specific KMS 
plugin. The KMS plugin, which is implemented as a gRPC server and deployed on the same host(s) as the Kubernetes master(s), is responsible for all communication with the remote KMS. -->

KMS 加密提供商使用封套加密模型来加密 etcd 中的数据。数据使用数据加密秘钥（DEK）加密；每次加密都生成一个新的 DEK。这些 DEK 经一个秘钥加密秘钥（KEK）加密后在一个远端的 KMS 中存储和管理。KMS 提供商使用 gRPC 与一个特定的 KMS 插件通信。这个 KMS 插件作为一个 gRPC 服务器被部署在 Kubernetes 主服务器的同一个主机上，负责与远端 KMS 的通信。

<!-- ## Configuring the KMS provider -->

## 配置 KMS 提供商

<!-- To configure a KMS provider on the API server, include a provider of type ```kms``` in the providers array in the encryption configuration file and set the following properties: -->

为了在 API 服务器上配置 KMS 提供商，在加密配置文件中的提供商数组中加入一个类型为 ```kms``` 的提供商，并设置下列属性：

<!--   * `name`: Display name of the KMS plugin.
  * `endpoint`: Listen address of the gRPC server (KMS plugin). The endpoint is a UNIX domain socket.
  * `cachesize`: Number of data encryption keys (DEKs) to be cached in the clear. When cached, DEKs can be used without another call to the KMS; whereas DEKs that are not cached require a call to the KMS to unwrap.
  * `timeout`: How long should kube-apiserver wait for kms-plugin to respond before returning an error (default is 3 seconds). -->

  * `name`: KMS 插件的显示名称。
  * `endpoint`: gRPC 服务器（KMS 插件）的监听地址。该端点是一个 UNIX 的套接字。
  * `cachesize`: 以明文缓存的数据加密秘钥（DEKs）的数量。一旦被缓存，就可以直接使用 DEKs 而无需另外调用 KMS；而未被缓存的 DEKs 需要调用一次 KMS 才能解包。
  * `timeout`: 在返回一个错误之前，kube-apiserver 等待 kms-plugin 响应的时间（默认是 3 秒）。

<!-- See [Understanding the encryption at rest configuration.](/docs/tasks/administer-cluster/encrypt-data) -->

参见 [理解静态数据加密配置](/docs/tasks/administer-cluster/encrypt-data)

<!-- ## Implementing a KMS plugin -->

## 实现 KMS 插件

<!-- To implement a KMS plugin, you can develop a new plugin gRPC server or enable a KMS plugin already provided by your cloud provider. You then integrate the plugin with the remote KMS and deploy it on the Kubernetes master. -->

为实现一个 KMS 插件，您可以开发一个新的插件 gRPC 服务器或启用一个由您的云服务提供商提供的 KMS 插件。您可以将这个插件与远程 KMS 集成，并把它部署到 Kubernetes 的主服务器上。

<!-- ### Enabling the KMS supported by your cloud provider 
Refer to your cloud provider for instructions on enabling the cloud provider-specific KMS plugin. -->

### 启用由云服务提供商支持的 KMS
有关启用云服务提供商特定的 KMS 插件的说明，请咨询您的云服务提供商。

<!-- ### Developing a KMS plugin gRPC server
You can develop a KMS plugin gRPC server using a stub file available for Go. For other languages, you use a proto file to create a stub file that you can use to develop the gRPC server code. -->

### 开发 KMS 插件 gRPC 服务器
您可以使用 Go 语言的存根文件开发 KMS 插件 gRPC 服务器。对于其他语言，您可以用 proto 文件创建可以用于开发 gRPC 服务器代码的存根文件。

<!-- * Using Go: Use the functions and data structures in the stub file: [service.pb.go](https://github.com/kubernetes/kubernetes/blob/master/staging/src/k8s.io/apiserver/pkg/storage/value/encrypt/envelope/v1beta1/service.pb.go) to develop the gRPC server code  -->

* 使用 Go：使用存根文件 [service.pb.go](https://github.com/kubernetes/kubernetes/blob/master/staging/src/k8s.io/apiserver/pkg/storage/value/encrypt/envelope/v1beta1/service.pb.go) 中的函数和数据结构开发 gRPC 服务器代码。

<!-- * Using languages other than Go: Use the protoc compiler with the proto file: [service.proto](https://github.com/kubernetes/kubernetes/blob/master/staging/src/k8s.io/apiserver/pkg/storage/value/encrypt/envelope/v1beta1/service.proto) to generate a stub file for the specific language -->

* 使用 Go 以外的其他语言：用 protoc 编译器编译 proto 文件： [service.proto](https://github.com/kubernetes/kubernetes/blob/master/staging/src/k8s.io/apiserver/pkg/storage/value/encrypt/envelope/v1beta1/service.proto) 为指定语言生成存根文件。

<!-- Then use the functions and data structures in the stub file to develop the server code. -->

然后使用存根文件中的函数和数据结构开发服务器代码。

<!-- **Notes:** -->

**注意：**

<!-- * kms plugin version: `v1beta1`

In response to procedure call Version, a compatible KMS plugin should return v1beta1 as VersionResponse.version -->

* kms 插件版本：`v1beta1`

作为对过程调用 Version 的响应，兼容的 KMS 插件应把 v1beta1 作为 VersionResponse.version 返回

<!-- * message version: `v1beta1`

All messages from KMS provider have the version field set to current version v1beta1 -->

* 消息版本：`v1beta1`

所有来自 KMS 提供商的消息都把 version 字段设置为当前版本 v1beta1

<!-- * protocol: UNIX domain socket (`unix`)

The gRPC server should listen at UNIX domain socket -->

* 协议：UNIX 域套接字 (`unix`)

gRPC 服务器应监听 UNIX 域套接字

<!-- ### Integrating a KMS plugin with the remote KMS
The KMS plugin can communicate with the remote KMS using any protocol supported by the KMS.
All configuration data, including authentication credentials the KMS plugin uses to communicate with the remote KMS, 
are stored and managed by the KMS plugin independently. The KMS plugin can encode the ciphertext with additional metadata that may be required before sending it to the KMS for decryption. -->

### 将 KMS 插件与远程 KMS 整合
KMS 插件可以用任何受 KMS 支持的协议与远程 KMS 通信。
所有的配置数据，包括 KMS 插件用于与远程 KMS 通信的认证凭据，都由 KMS 插件独立地存储和管理。KMS 插件可以用额外的元数据对密文进行编码，这些元数据是在把它发往 KMS 进行解密之前可能要用到的。

<!-- ### Deploying the KMS plugin 
Ensure that the KMS plugin runs on the same host(s) as the Kubernetes master(s). -->

### 部署 KMS 插件
确保 KMS 插件与 Kubernetes 主服务器运行在同一主机上。

<!-- ## Encrypting your data with the KMS provider -->
## 使用 KMS 提供商加密数据

<!-- To encrypt the data: -->
为了加密数据：

<!-- 1. Create a new encryption configuration file using the appropriate properties for the `kms` provider: -->
1. 使用 `kms` 提供商的相应的属性创建一个新的加密配置文件：

```yaml
kind: EncryptionConfiguration
apiVersion: apiserver.config.k8s.io/v1
resources:
  - resources:
    - secrets
    providers:
    - kms:
        name: myKmsPlugin
        endpoint: unix:///tmp/socketfile.sock
        cachesize: 100
        timeout: 3s
    - identity: {}
```

<!-- 2. Set the `--encryption-provider-config` flag on the kube-apiserver to point to the location of the configuration file. -->
2. 设置 kube-apiserver 的 `--encryption-provider-config` 参数指向配置文件的位置。
<!-- 3. Restart your API server. -->
3. 重启 API 服务器。

<!-- Note:
The alpha version of the encryption feature prior to 1.13 required a config file with
`kind: EncryptionConfig` and `apiVersion: v1`, and used the `--experimental-encryption-provider-config` flag. -->

注意：
在 1.13 之前的加密功能的 alpha 版本需要一个带有 `kind: EncryptionConfig` 和 `apiVersion: v1` 的配置文件，并使用 `--experimental-encryption-provider-config` 标志。

<!-- ## Verifying that the data is encrypted
Data is encrypted when written to etcd. After restarting your kube-apiserver, any newly created or updated secret should be encrypted when stored. To verify, you can use the etcdctl command line program to retrieve the contents of your secret. -->

## 验证数据是否已加密
写入 etcd 时数据被加密。重启 kube-apiserver 后，任何新建或更新的秘密信息在存储时应该已被加密。要验证这点，您可以用 etcdctl 命令行程序获取秘密信息内容。 

<!-- 1. Create a new secret called secret1 in the default namespace: -->
1. 在默认的命名空间里创建一个名为 secret1 的秘密信息：
```
kubectl create secret generic secret1 -n default --from-literal=mykey=mydata
```
<!-- 2. Using the etcdctl command line, read that secret out of etcd: -->
2. 用 etcdctl 命令行，从 etcd 读取出秘密信息：
```
ETCDCTL_API=3 etcdctl get /kubernetes.io/secrets/default/secret1 [...] | hexdump -C
```
 <!-- where `[...]` must be the additional arguments for connecting to the etcd server. -->
 其中 `[...]` 是用于连接 etcd 服务器的额外参数。
<!-- 3. Verify the stored secret is prefixed with `k8s:enc:kms:v1:`, which indicates that the `kms` provider has encrypted the resulting data. -->
3. 验证保存的秘密信息是否是以 `k8s:enc:kms:v1:` 开头的，这表明 `kms` 提供商已经对结果数据加密。
<!-- 4. Verify that the secret is correctly decrypted when retrieved via the API: -->
4. 验证秘密信息在被 API 获取时已被正确解密：
```
kubectl describe secret secret1 -n default
```
应该符合 `mykey: mydata` 格式

<!-- ## Ensuring all secrets are encrypted
Because secrets are encrypted on write, performing an update on a secret encrypts that content. -->

## 确保所有秘密信息都已被加密
因为秘密信息是在写入时被加密的，所以在更新秘密信息时会加密该内容。

<!-- The following command reads all secrets and then updates them to apply server side encryption. If an error occurs due to a conflicting write, retry the command. For larger clusters, you may wish to subdivide the secrets by namespace or script an update. -->

下列命令读取所有秘密信息并更新他们以便应用服务器端加密。如果因为写入冲突导致错误发生，请重试此命令。对较大的集群，您可能希望根据命名空间或脚本更新去细分秘密内容。

```
kubectl get secrets --all-namespaces -o json | kubectl replace -f -
```

<!-- ## Switching from a local encryption provider to the KMS provider
To switch from a local encryption provider to the `kms` provider and re-encrypt all of the secrets: -->

## 从本地加密提供商切换到 KMS 提供商
为了从本地加密提供商切换到 `kms` 提供商并重新加密所有秘密内容：

<!-- 1. Add the `kms` provider as the first entry in the configuration file as shown in the following example. -->
1. 在配置文件中加入 `kms` 提供商作为第一个条目，如下列样例所示

```yaml
kind: EncryptionConfiguration
apiVersion: apiserver.config.k8s.io/v1
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
<!-- 2. Restart all kube-apiserver processes. -->
2. 重启所有 kube-apiserver 进程。
<!-- 3. Run the following command to force all secrets to be re-encrypted using the `kms` provider. -->
3. 运行下列命令使用 `kms` 提供商强制重新加密所有秘密信息。
```
kubectl get secrets --all-namespaces -o json| kubectl replace -f -
```

<!-- ## Disabling encryption at rest
To disable encryption at rest: -->

## 禁用静态数据加密
要禁用静态数据加密：

<!-- 1. Place the `identity` provider as the first entry in the configuration file:  -->

1. 将 `identity` 提供商作为配置文件中的第一个条目： 

```yaml
kind: EncryptionConfiguration
apiVersion: apiserver.config.k8s.io/v1
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
<!-- 2.  Restart all kube-apiserver processes.  -->
2. 重启所有 kube-apiserver 进程。
<!-- 3. Run the following command to force all secrets to be decrypted. -->
3. 运行下列命令强制重新加密所有秘密信息。
```
kubectl get secrets --all-namespaces -o json | kubectl replace -f -
```




