---
title: 静态加密 Secret 数据
content_type: task
---

<!--
reviewers:
- smarterclayton
title: Encrypting Secret Data at Rest
content_type: task
-->

<!-- overview -->
<!--
This page shows how to enable and configure encryption of secret data at rest.
-->
本文展示如何启用和配置静态 Secret 数据的加密

## {{% heading "prerequisites" %}}

* {{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!--
* etcd v3 or later is required
-->
* 需要 etcd v3 或者更高版本

<!-- steps -->

<!--
## Configuration and determining whether encryption at rest is already enabled

The `kube-apiserver` process accepts an argument `-experimental-encryption-provider-config`
that controls how API data is encrypted in etcd. An example configuration
is provided below.

## Understanding the encryption at rest configuration.
-->
## 配置并确定是否已启用静态数据加密

`kube-apiserver` 的参数 `--experimental-encryption-provider-config` 控制 API 数据在 etcd 中的加密方式。
下面提供一个配置示例。

## 理解静态数据加密

```yaml
apiVersion: apiserver.config.k8s.io/v1
kind: EncryptionConfiguration
resources:
  - resources:
    - secrets
    providers:
    - identity: {}
    - aesgcm:
        keys:
        - name: key1
          secret: c2VjcmV0IGlzIHNlY3VyZQ==
        - name: key2
          secret: dGhpcyBpcyBwYXNzd29yZA==
    - aescbc:
        keys:
        - name: key1
          secret: c2VjcmV0IGlzIHNlY3VyZQ==
        - name: key2
          secret: dGhpcyBpcyBwYXNzd29yZA==
    - secretbox:
        keys:
        - name: key1
          secret: YWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXoxMjM0NTY=
```

<!--
Each `resources` array item is a separate config and contains a complete configuration. The
`resources.resources` field is an array of Kubernetes resource names (`resource` or `resource.group`)
that should be encrypted. The `providers` array is an ordered list of the possible encryption
providers. Only one provider type may be specified per entry (`identity` or `aescbc` may be provided,
but not both in the same item).
-->
每个 `resources` 数组项目是一个单独的完整的配置。
`resources.resources` 字段是要加密的 Kubernetes 资源名称（`resource` 或 `resource.group`）的数组。
`providers` 数组是可能的加密 provider 的有序列表。
每个条目只能指定一个 provider 类型（可以是 `identity` 或 `aescbc`，但不能在同一个项目中同时指定）。

<!--
The first provider in the list is used to encrypt resources going into storage. When reading
resources from storage each provider that matches the stored data attempts to decrypt the data in
order. If no provider can read the stored data due to a mismatch in format or secret key, an error
is returned which prevents clients from accessing that resource.
-->
列表中的第一个 provider 用于加密进入存储的资源。
当从存储器读取资源时，与存储的数据匹配的所有 provider 将按顺序尝试解密数据。
如果由于格式或密钥不匹配而导致没有 provider 能够读取存储的数据，则会返回一个错误，以防止客户端访问该资源。

<!--
**IMPORTANT:** If any resource is not readable via the encryption config (because keys were changed),
the only recourse is to delete that key from the underlying etcd directly. Calls that attempt to
read that resource will fail until it is deleted or a valid decryption key is provided.
-->
{{< caution >}}
**重要：** 如果通过加密配置无法读取资源（因为密钥已更改），唯一的方法是直接从底层 etcd 中删除该密钥。
任何尝试读取资源的调用将会失败，直到它被删除或提供有效的解密密钥。
{{< /caution >}}

### Providers:

<!--
Name | Encryption | Strength | Speed | Key Length | Other Considerations
-----|------------|----------|-------|------------|---------------------
`identity` | None | N/A | N/A | N/A | Resources written as-is without encryption. When set as the first provider, the resource will be decrypted as new values are written.
`aescbc` | AES-CBC with PKCS#7 padding | Strongest | Fast | 32-byte | The recommended choice for encryption at rest but may be slightly slower than `secretbox`.
`secretbox` | XSalsa20 and Poly1305 | Strong | Faster | 32-byte | A newer standard and may not be considered acceptable in environments that require high levels of review.
`aesgcm` | AES-GCM with random nonce | Must be rotated every 200k writes | Fastest | 16, 24, or 32-byte | Is not recommended for use except when an automated key rotation scheme is implemented.
`kms` | Uses envelope encryption scheme: Data is encrypted by data encryption keys (DEKs) using AES-CBC with PKCS#7 padding, DEKs are encrypted by key encryption keys (KEKs) according to configuration in Key Management Service (KMS) | Strongest | Fast | 32-bytes |  The recommended choice for using a third party tool for key management. Simplifies key rotation, with a new DEK generated for each encryption, and KEK rotation controlled by the user. [Configure the KMS provider](/docs/tasks/administer-cluster/kms-provider/)

Each provider supports multiple keys - the keys are tried in order for decryption, and if the provider
is the first provider, the first key is used for encryption.
-->
{{< table caption="Kubernetes 静态数据加密的 Providers" >}}
名称 | 加密类型   | 强度     | 速度  | 密钥长度   | 其它事项
-----|------------|----------|-------|------------|---------------------
`identity` | 无 | N/A | N/A | N/A | 不加密写入的资源。当设置为第一个 provider 时，资源将在新值写入时被解密。
`aescbc` | 填充 PKCS#7 的 AES-CBC | 最强 | 快 | 32字节 | 建议使用的加密项，但可能比 `secretbox` 稍微慢一些。
`secretbox` | XSalsa20 和 Poly1305 | 强 | 更快 | 32字节 | 较新的标准，在需要高度评审的环境中可能不被接受。
`aesgcm` | 带有随机数的 AES-GCM | 必须每 200k 写入一次 | 最快 | 16, 24 或者 32字节 | 建议不要使用，除非实施了自动密钥循环方案。
`kms` | 使用信封加密方案：数据使用带有 PKCS#7 填充的 AES-CBC 通过数据加密密钥（DEK）加密，DEK 根据 Key Management Service（KMS）中的配置通过密钥加密密钥（Key Encryption Keys，KEK）加密 | 最强 | 快 | 32字节 | 建议使用第三方工具进行密钥管理。为每个加密生成新的 DEK，并由用户控制 KEK 轮换来简化密钥轮换。[配置 KMS 提供程序](/zh/docs/tasks/administer-cluster/kms-provider/)

每个 provider 都支持多个密钥 - 在解密时会按顺序使用密钥，如果是第一个 provider，则第一个密钥用于加密。

<!--
__Storing the raw encryption key in the EncryptionConfig only moderately improves your security posture, compared to no encryption.
Please use `kms` provider for additional security.__ By default, the `identity` provider is used to protect secrets in etcd, which
provides no encryption. `EncryptionConfiguration` was introduced to encrypt secrets locally, with a locally managed key.
-->
__在 EncryptionConfig 中保存原始的加密密钥与不加密相比只会略微地提升安全级别。
请使用 `kms` 驱动以获得更强的安全性。__
默认情况下，`identity` 驱动被用来对 etcd 中的 Secret 提供保护，
而这个驱动不提供加密能力。
`EncryptionConfiguration` 的引入是为了能够使用本地管理的密钥来在本地加密 Secret 数据。

<!--
Encrypting secrets with a locally managed key protects against an etcd compromise, but it fails to protect against a host compromise.
Since the encryption keys are stored on the host in the EncryptionConfig YAML file, a skilled attacker can access that file and
extract the encryption keys.
-->
使用本地管理的密钥来加密 Secret 能够保护数据免受 etcd 破坏的影响，不过无法针对
主机被侵入提供防护。
这是因为加密的密钥保存在主机上的 EncryptionConfig YAML 文件中，有经验的入侵者
仍能访问该文件并从中提取出加密密钥。

<!--
Envelope encryption creates dependence on a separate key, not stored in Kubernetes. In this case, an attacker would need to compromise etcd, the kubeapi-server, and the third-party KMS provider to retrieve the plaintext values, providing a higher level of security than locally-stored encryption keys.
-->
封套加密（Envelope Encryption）引入了对独立密钥的依赖，而这个密钥并不保存在 Kubernetes 中。
在这种情况下下，入侵者需要攻破 etcd、kube-apiserver 和第三方的 KMS
驱动才能获得明文数据，因而这种方案提供了比本地保存加密密钥更高的安全级别。

<!--
## Encrypting your data

Create a new encryption config file:
-->
## 加密你的数据

创建一个新的加密配置文件：

```yaml
apiVersion: apiserver.config.k8s.io/v1
kind: EncryptionConfiguration
resources:
  - resources:
    - secrets
    providers:
    - aescbc:
        keys:
        - name: key1
          secret: <BASE 64 ENCODED SECRET>
    - identity: {}
```

<!--
To create a new secret perform the following steps:

1. Generate a 32 byte random key and base64 encode it. If you're on Linux or Mac OS X, run the following command:
-->
遵循如下步骤来创建一个新的 secret：

1. 生成一个 32 字节的随机密钥并进行 base64 编码。如果你在 Linux 或 Mac OS X 上，请运行以下命令：

   ```
   head -c 32 /dev/urandom | base64
   ```

<!--
2. Place that value in the secret field.
3. Set the `--experimental-encryption-provider-config` flag on the `kube-apiserver` to point to the location of the config file.
4. Restart your API server.

**IMPORTANT:** Your config file contains keys that can decrypt content in etcd, so you must properly restrict permissions on your masters so only the user who runs the kube-apiserver can read it.
-->
2. 将这个值放入到 secret 字段中。
3. 设置 `kube-apiserver` 的 `--experimental-encryption-provider-config` 参数，将其指向
   配置文件所在位置。
4. 重启你的 API server。


{{< caution >}}
你的配置文件包含可以解密 etcd 内容的密钥，因此你必须正确限制主控节点的访问权限，
以便只有能运行 kube-apiserver 的用户才能读取它。
{{< /caution >}}

<!--
## Verifying that data is encrypted

Data is encrypted when written to etcd. After restarting your `kube-apiserver`, any newly created or
updated secret should be encrypted when stored. To check, you can use the `etcdctl` command line
program to retrieve the contents of your secret.

1. Create a new secret called `secret1` in the `default` namespace:
-->
## 验证数据已被加密

数据在写入 etcd 时会被加密。重新启动你的 `kube-apiserver` 后，任何新创建或更新的密码在存储时都应该被加密。
如果想要检查，你可以使用 `etcdctl` 命令行程序来检索你的加密内容。

1. 创建一个新的 secret，名称为 `secret1`，命名空间为 `default`：

   ```shell
   kubectl create secret generic secret1 -n default --from-literal=mykey=mydata
   ```

<!--
2. Using the etcdctl commandline, read that secret out of etcd:
-->
2. 使用 etcdctl 命令行，从 etcd 中读取 secret：
   ```shell
   ETCDCTL_API=3 etcdctl get /registry/secrets/default/secret1 [...] | hexdump -C
   ```

   <!--
   where `[...]` must be the additional arguments for connecting to the etcd server.
   -->
   这里的 `[...]` 是用来连接 etcd 服务的额外参数。

<!--
3. Verify the stored secret is prefixed with `k8s:enc:aescbc:v1:` which indicates the `aescbc` provider has encrypted the resulting data.
4. Verify the secret is correctly decrypted when retrieved via the API:
-->
3. 验证存储的密钥前缀是否为 `k8s:enc:aescbc:v1:`，这表明 `aescbc` provider 已加密结果数据。
4. 通过 API 检索，验证 secret 是否被正确解密：

   ```shell
   kubectl describe secret secret1 -n default
   ```

   <!--
   should match `mykey: mydata`, mydata is encoded, check [decoding a secret](/docs/tasks/configmap-secret/managing-secret-using-kubectl/#decoding-secret) to
   completely decode the secret.
   -->
   其输出应该是 `mykey: bXlkYXRh`，`mydata` 数据是被加密过的，请参阅
   [解密 Secret](/zh/docs/tasks/configmap-secret/managing-secret-using-kubectl/#decoding-secret)
   了解如何完全解码 Secret 内容。

<!--
## Ensure all secrets are encrypted

Since secrets are encrypted on write, performing an update on a secret will encrypt that content.
-->
## 确保所有 Secret 都被加密

由于 Secret 是在写入时被加密，因此对 Secret 执行更新也会加密该内容。

```
kubectl get secrets --all-namespaces -o json | kubectl replace -f -
```

<!--
The command above reads all secrets and then updates them to apply server side encryption.
-->
上面的命令读取所有 Secret，然后使用服务端加密来更新其内容。

<!--
If an error occurs due to a conflicting write, retry the command.
For larger clusters, you may wish to subdivide the secrets by namespace or script an update.
-->
{{< note >}}
如果由于冲突写入而发生错误，请重试该命令。
对于较大的集群，你可能希望通过命名空间或更新脚本来对 Secret 进行划分。
{{< /note >}}

<!--
## Rotating a decryption key

Changing the secret without incurring downtime requires a multi step operation, especially in
the presence of a highly available deployment where multiple `kube-apiserver` processes are running.

1. Generate a new key and add it as the second key entry for the current provider on all servers
2. Restart all `kube-apiserver` processes to ensure each server can decrypt using the new key
3. Make the new key the first entry in the `keys` array so that it is used for encryption in the config
4. Restart all `kube-apiserver` processes to ensure each server now encrypts using the new key
5. Run `kubectl get secrets -all-namespaces -o json | kubectl replace -f -` to encrypt all existing secrets with the new key
6. Remove the old decryption key from the config after you back up etcd with the new key in use and update all secrets

With a single `kube-apiserver`, step 2 may be skipped.
-->
## 轮换解密密钥

在不发生停机的情况下更改 Secret 需要多步操作，特别是在有多个 `kube-apiserver` 进程正在运行的
高可用环境中。

1. 生成一个新密钥并将其添加为所有服务器上当前提供程序的第二个密钥条目
2. 重新启动所有 `kube-apiserver` 进程以确保每台服务器都可以使用新密钥进行解密
3. 将新密钥设置为 `keys` 数组中的第一个条目，以便在配置中使用其进行加密
4. 重新启动所有 `kube-apiserver` 进程以确保每个服务器现在都使用新密钥进行加密
5. 运行 `kubectl get secrets --all-namespaces -o json | kubectl replace -f -` 以用新密钥加密所有现有的秘密
6. 在使用新密钥备份 etcd 后，从配置中删除旧的解密密钥并更新所有密钥

如果只有一个 `kube-apiserver`，第 2 步可能可以忽略。

<!--
## Decrypting all data

To disable encryption at rest place the `identity` provider as the first entry in the config:
-->
## 解密所有数据

要禁用 rest 加密，请将 `identity` provider 作为配置中的第一个条目：

```yaml
apiVersion: apiserver.config.k8s.io/v1
kind: EncryptionConfiguration
resources:
  - resources:
    - secrets
    providers:
    - identity: {}
    - aescbc:
        keys:
        - name: key1
          secret: <BASE 64 ENCODED SECRET>
```

<!--
and restart all `kube-apiserver` processes. Then run
-->
并重新启动所有 `kube-apiserver` 进程。然后运行：

```
kubectl get secrets -all-namespaces -o json | kubectl replace -f -
```

<!--
to force all secrets to be decrypted.
-->
以强制解密所有 secret。

