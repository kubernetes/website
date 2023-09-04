---
title: 静态加密机密数据
content_type: task
weight: 210
---
<!--
title: Encrypting Confidential Data at Rest
reviewers:
- smarterclayton
- enj
content_type: task
weight: 210
-->

<!-- overview -->

<!--
All of the APIs in Kubernetes that let you write persistent API resource data support
at-rest encryption. For example, you can enable at-rest encryption for
{{< glossary_tooltip text="Secrets" term_id="secret" >}}.
This at-rest encryption is additional to any system-level encryption for the
etcd cluster or for the filesystem(s) on hosts where you are running the
kube-apiserver.

This page shows how to enable and configure encryption of API data at rest.
-->
Kubernetes 中允许允许用户编辑的持久 API 资源数据的所有 API 都支持静态加密。
例如，你可以启用静态加密 {{< glossary_tooltip text="Secret" term_id="secret" >}}。
此静态加密是对 etcd 集群或运行 kube-apiserver 的主机上的文件系统的任何系统级加密的补充。

本页展示如何启用和配置静态 API 数据加密。

{{< note >}}
<!--
This task covers encryption for resource data stored using the
{{< glossary_tooltip text="Kubernetes API" term_id="kubernetes-api" >}}. For example, you can
encrypt Secret objects, including the key-value data they contain.
-->
此任务涵盖使用 {{< glossary_tooltip text="Kubernetes API" term_id="kubernetes-api" >}}
存储的资源数据的加密。
例如，你可以加密 Secret 对象，包括它们包含的键值数据。
<!--
If you want to encrypt data in filesystems that are mounted into containers, you instead need
to either:

- use a storage integration that provides encrypted
  {{< glossary_tooltip text="volumes" term_id="volume" >}}
- encrypt the data within your own application
-->
如果要加密安装到容器中的文件系统中的数据，则需要：

- 使用提供加密 {{< glossary_tooltip text="volumes" term_id="volume" >}} 的存储集成
- 在你自己的应用程序中加密数据

{{< /note >}}

## {{% heading "prerequisites" %}}

* {{< include "task-tutorial-prereqs.md" >}}

<!--
* This task assumes that you are running the Kubernetes API server as a
  {{< glossary_tooltip text="static pod" term_id="static-pod" >}} on each control
  plane node.

* Your cluster's control plane **must** use etcd v3.x (major version 3, any minor version).
-->
* 此任务假设你将 Kubernetes API 服务器组件以{{< glossary_tooltip text="静态 Pod" term_id="static-pod" >}}
  方式运行在每个控制平面节点上。

* 集群的控制平面**必须**使用 etcd v3.x（主版本 3，任何次要版本）。

<!--
* To encrypt a custom resource, your cluster must be running Kubernetes v1.26 or newer.

* To use a wildcard to match resources, your cluster must be running Kubernetes v1.27 or newer.
-->
* 要加密自定义资源，你的集群必须运行 Kubernetes v1.26 或更高版本。

* 在 Kubernetes v1.27 或更高版本中可以使用通配符匹配资源。

{{< version-check >}}

<!-- steps -->

<!--
## Configuration and determining whether encryption at rest is already enabled

The `kube-apiserver` process accepts an argument `--encryption-provider-config`
that controls how API data is encrypted in etcd.
The configuration is provided as an API named
[`EncryptionConfiguration`](/docs/reference/config-api/apiserver-encryption.v1/). An example configuration is provided below.
-->
## 配置并确定是否已启用静态数据加密   {#configuration-and-determing-wheter-encryption-at-rest-is-already-enabled}

`kube-apiserver` 的参数 `--encryption-provider-config` 控制 API 数据在 etcd 中的加密方式。
该配置作为一个名为 [`EncryptionConfiguration`](/zh-cn/docs/reference/config-api/apiserver-encryption.v1/)
的 API 提供。下面提供了一个示例配置。

{{< caution >}}
<!--
**IMPORTANT:** For high-availability configurations (with two or more control plane nodes), the
encryption configuration file must be the same! Otherwise, the `kube-apiserver` component cannot
decrypt data stored in the etcd.
-->
**重要：** 对于高可用配置（有两个或多个控制平面节点），加密配置文件必须相同！
否则，`kube-apiserver` 组件无法解密存储在 etcd 中的数据。
{{< /caution >}}

<!--
## Understanding the encryption at rest configuration
-->
## 理解静态数据加密    {#understanding-the-encryption-at-rest-configuration}

<!--
# CAUTION: this is an example configuration.
#          Do not use this for your own cluster!
# This configuration does not provide data confidentiality. The first
# configured provider is specifying the "identity" mechanism, which
# stores resources as plain text.
# plain text, in other words NO encryption
# do not encrypt Events even though *.* is specified below
# wildcard match requires Kubernetes 1.27 or later
# wildcard match requires Kubernetes 1.27 or later
-->
```yaml
---
#
# 注意：这是一个示例配置。请勿将其用于你自己的集群！
#
apiVersion: apiserver.config.k8s.io/v1
kind: EncryptionConfiguration
resources:
  - resources:
      - secrets
      - configmaps
      - pandas.awesome.bears.example # 自定义资源 API
    providers:
      # 此配置不提供数据机密性。
      # 第一个配置的 provider 正在指定将资源存储为纯文本的 "identity" 机制。
      - identity: {} # 纯文本，换言之未加密
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
  - resources:
      - events
    providers:
      - identity: {} # 即使如下指定 *.* 也不会加密 events
  - resources:
      - '*.apps' # 通配符匹配需要 Kubernetes 1.27 或更高版本
    providers:
      - aescbc:
          keys:
          - name: key2
            secret: c2VjcmV0IGlzIHNlY3VyZSwgb3IgaXMgaXQ/Cg==
  - resources:
      - '*.*' # 通配符匹配需要 Kubernetes 1.27 或更高版本
    providers:
      - aescbc:
          keys:
          - name: key3
            secret: c2VjcmV0IGlzIHNlY3VyZSwgSSB0aGluaw==
```

<!--
Each `resources` array item is a separate config and contains a complete configuration. The
`resources.resources` field is an array of Kubernetes resource names (`resource` or `resource.group`)
that should be encrypted like Secrets, ConfigMaps, or other resources. 

If custom resources are added to `EncryptionConfiguration` and the cluster version is 1.26 or newer, 
any newly created custom resources mentioned in the `EncryptionConfiguration` will be encrypted. 
Any custom resources that existed in etcd prior to that version and configuration will be unencrypted
until they are next written to storage. This is the same behavior as built-in resources.
See the [Ensure all secrets are encrypted](#ensure-all-secrets-are-encrypted) section.

The `providers` array is an ordered list of the possible encryption providers to use for the APIs that you listed.
-->
每个 `resources` 数组项目是一个单独的完整的配置。
`resources.resources` 字段是应加密的 Kubernetes 资源（例如 Secret、ConfigMap 或其他资源）名称
（`resource` 或 `resource.group`）的数组。

如果自定义资源被添加到 `EncryptionConfiguration` 并且集群版本为 1.26 或更高版本，
则 `EncryptionConfiguration` 中提到的任何新创建的自定义资源都将被加密。
在该版本之前存在于 etcd 中的任何自定义资源和配置不会被加密，直到它们被下一次写入到存储为止。
这与内置资源的行为相同。请参阅[确保所有 Secret 都已加密](#ensure-all-secrets-are-encrypted)一节。

`providers` 数组是可能的加密 provider 的有序列表，用于你所列出的 API。

<!--
Only one provider type may be specified per entry (`identity` or `aescbc` may be provided,
but not both in the same item).
The first provider in the list is used to encrypt resources written into the storage. When reading
resources from storage, each provider that matches the stored data attempts in order to decrypt the
data. If no provider can read the stored data due to a mismatch in format or secret key, an error
is returned which prevents clients from accessing that resource.
-->
每个条目只能指定一个 provider 类型（可以是 `identity` 或 `aescbc`，但不能在同一个项目中同时指定二者）。
列表中的第一个 provider 用于加密写入存储的资源。
当从存储器读取资源时，与存储的数据匹配的所有 provider 将按顺序尝试解密数据。
如果由于格式或密钥不匹配而导致没有 provider 能够读取存储的数据，则会返回一个错误，以防止客户端访问该资源。

<!--
`EncryptionConfiguration` supports the use of wildcards to specify the resources that should be encrypted.
Use '`*.<group>`' to encrypt all resources within a group (for eg '`*.apps`' in above example) or '`*.*`'
to encrypt all resources. '`*.`' can be used to encrypt all resource in the core group. '`*.*`' will
encrypt all resources, even custom resources that are added after API server start.
-->
`EncryptionConfiguration` 支持使用通配符指定应加密的资源。
使用 “`*.<group>`” 加密 group 内的所有资源（例如以上例子中的 “`*.apps`”）或使用
“`*.*`” 加密所有资源。“`*.`” 可用于加密核心组中的所有资源。“`*.*`”
将加密所有资源，甚至包括 API 服务器启动之后添加的自定义资源。

{{< note >}}
<!--
Use of wildcards that overlap within the same resource list or across multiple entries are not allowed
since part of the configuration would be ineffective. The `resources` list's processing order and precedence
are determined by the order it's listed in the configuration.
-->
不允许在同一资源列表或跨多个条目中使用相互重疊的通配符，因为这样一来配置的一部分将无法生效。
`resources` 列表的处理顺序和优先级由配置中列出的顺序决定。
{{< /note >}}

<!--
Opting out of encryption for specific resources while wildcard is enabled can be achieved by adding a new
`resources` array item with the resource name, followed by the `providers` array item with the `identity` provider.
For example, if '`*.*`' is enabled and you want to opt-out encryption for the `events` resource, add a new item
to the `resources` array with `events` as the resource name, followed by the providers array item with `identity`.
The new item should look like this:
-->
如果启用了通配符，但想要针对特定资源退出加密，则可以通过添加带有资源名称的新 `resources` 数组项，
后跟附带 `identity` 提供商的 `providers` 数组项。例如，如果启用了 “`*.*`”，
但想要排除对 `events` 资源的加密，则应向 `resources` 数组添加一个新项（以 `events` 为资源名称），
后跟包含 `identity` 的 providers 数组。新项应如下所示：

```yaml
- resources:
    - events
  providers:
    - identity: {}
```

<!--
Ensure that the new item is listed before the wildcard '`*.*`' item in the resources array to give it precedence.
-->
确保新项列在资源数组中的通配符 “`*.*`” 项之前，使新项优先。

<!--
For more detailed information about the `EncryptionConfiguration` struct, please refer to the
[encryption configuration API](/docs/reference/config-api/apiserver-encryption.v1/).
-->
有关 `EncryptionConfiguration` 结构体的更多详细信息，
请参阅[加密配置 API](/zh-cn/docs/reference/config-api/apiserver-encryption.v1/)。

{{< caution >}}
<!--
If any resource is not readable via the encryption config (because keys were changed),
the only recourse is to delete that key from the underlying etcd directly. Calls that attempt to
read that resource will fail until it is deleted or a valid decryption key is provided.
-->
如果通过加密配置无法读取资源（因为密钥已更改），唯一的方法是直接从底层 etcd 中删除该密钥。
任何尝试读取资源的调用将会失败，直到它被删除或提供有效的解密密钥。
{{< /caution >}}

### Providers

<!--
The following table describes each available provider:
-->
下表描述了每个可用的 Provider：

<table class="complex-layout">
<caption style="display: none;">
<!-- Providers for Kubernetes encryption at rest -->
Kubernetes 静态数据加密的 Provider
</caption>
<thead>
  <tr>
  <th><!-- Name -->名称</th>
  <th><!-- Encryption -->加密类型</th>
  <th><!-- Strength -->强度</th>
  <th><!-- Speed -->速度</th>
  <th><!-- Key length -->密钥长度</th>
  </tr>
</thead>
<tbody id="encryption-providers-identity">
  <!-- list identity first, even when the remaining rows are sorted alphabetically -->
  <tr>
  <th rowspan="2" scope="row"><tt>identity</tt></th>
  <td><strong><!-- None -->无</strong></td>
  <td>N/A</td>
  <td>N/A</td>
  <td>N/A</td>
  </tr>
  <tr>
  <td colspan="4">
  <!-- Resources written as-is without encryption. When set as the first provider, the resource will be decrypted as new values are written. Existing encrypted resources are <strong>not</strong> automatically overwritten with the plaintext data.
   The <tt>identity</tt> provider is the default if you do not specify otherwise. -->
  不加密写入的资源。当设置为第一个 provider 时，已加密的资源将在新值写入时被解密。
  </td>
  </tr>
</tbody>
<tbody id="encryption-providers-that-encrypt">
  <tr>
  <th rowspan="2" scope="row"><tt>aescbc</tt></th>
  <td>
  <!-- AES-CBC with <a href="https://datatracker.ietf.org/doc/html/rfc2315">PKCS#7</a> padding -->
  带有 <a href="https://datatracker.ietf.org/doc/html/rfc2315">PKCS#7</a> 填充的 AES-CBC
  </td>
  <td><!-- Weak -->弱</td>
  <td><!-- Fast -->快</td>
  <td><!-- 32-byte -->32 字节</td>
  </tr>
  <tr>
  <td colspan="4">
  <!-- Not recommended due to CBC's vulnerability to padding oracle attacks. Key material accessible from control plane host. -->
  由于 CBC 容易受到密文填塞攻击（Padding Oracle Attack），不推荐使用。密钥材料可从控制面主机访问。
  </td>
  </tr>
  <tr>
  <th rowspan="2" scope="row"><tt>aesgcm</tt></th>
  <td>
  <!-- AES-GCM with random nonce -->
  带有随机数的 AES-GCM
  </td>
  <td>
  <!-- Must be rotated every 200,000 writes -->
  每写入 200k 次后必须轮换
  </td>
  <td><!-- Fastest -->最快</td>
  <td><!-- 16, 24, or 32-byte -->16、24 或者 32 字节</td>
  </tr>
  <tr>
  <td colspan="4">
  <!-- Not recommended for use except when an automated key rotation scheme is implemented. Key material accessible from control plane host. -->
  不建议使用，除非实施了自动密钥轮换方案。密钥材料可从控制面主机访问。
  </td>
  </tr>
  <tr>
  <th rowspan="2" scope="row"><tt>kms</tt> v1 <em><!--(deprecated since Kubernetes v1.28)-->（自 Kubernetes 1.28 起弃用）</em></th>
  <td>
  <!-- Uses envelope encryption scheme with DEK per resource. -->
  针对每个资源使用不同的 DEK 来完成信封加密。
  </td>
  <td><!-- Strongest -->最强</td>
  <td><!-- Slow (<em>compared to <tt>kms</tt> version 2</em>) -->慢（<em>与 <tt>kms</tt> V2 相比</em>）</td>
  <td><!-- 32-bytes -->32 字节</td>
  </tr>
  <tr>
  <td colspan="4">
    <!--
    Data is encrypted by data encryption keys (DEKs) using AES-GCM;
    DEKs are encrypted by key encryption keys (KEKs) according to
    configuration in Key Management Service (KMS).
    Simple key rotation, with a new DEK generated for each encryption, and
    KEK rotation controlled by the user.
    -->
    通过数据加密密钥（DEK）使用 AES-GCM 加密数据；
    DEK 根据 Key Management Service（KMS）中的配置通过密钥加密密钥（Key Encryption Keys，KEK）加密。
    密钥轮换方式简单，每次加密都会生成一个新的 DEK，KEK 的轮换由用户控制。
    <br />
    <!--
    Read how to <a href="/docs/tasks/administer-cluster/kms-provider#configuring-the-kms-provider-kms-v1">configure the KMS V1 provider</a>.
    -->
    阅读如何<a href="/zh-cn/docs/tasks/administer-cluster/kms-provider#configuring-the-kms-provider-kms-v1">配置 KMS V1 Provider</a>
    </td>
  </tr>
  <tr>
  <th rowspan="2" scope="row"><tt>kms</tt> v2 <em>(beta)</em></th>
  <td>
  <!-- Uses envelope encryption scheme with DEK per API server. -->
  针对每个 API 服务器使用不同的 DEK 来完成信封加密。
  </td>
  <td><!-- Strongest -->最强</td>
  <td><!-- Fast -->快</td>
  <td><!-- 32-bytes -->32 字节</td>
  </tr>
  <tr>
  <td colspan="4">
    <!--
    Data is encrypted by data encryption keys (DEKs) using AES-GCM; DEKs
    are encrypted by key encryption keys (KEKs) according to configuration
    in Key Management Service (KMS).
    Kubernetes defaults to generating a new DEK at API server startup, which is then
    reused for object encryption.
    If you enable the <tt>KMSv2KDF</tt>
    <a href="/docs/reference/command-line-tools-reference/feature-gates/">feature gate</a>,
    Kubernetes instead generates a new DEK per encryption from a secret seed.
    Whichever approach you configure, the DEK or seed is also rotated whenever the KEK is rotated.<br/>
    A good choice if using a third party tool for key management.
    Available in beta from Kubernetes v1.27.
    -->
    通过数据加密密钥（DEK）使用 AES-GCM 加密数据；
    DEK 根据 Key Management Service（KMS）中的配置通过密钥加密密钥（Key Encryption Keys，KEK）加密。
    Kubernetes 默认在 API 服务器启动时生成一个新的 DEK，
    然后重复使用该密钥进行资源加密。然而，如果你使用 KMS v2 并且启用了 `KMSv2KDF`
    [特性门控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)，
    则 Kubernetes 将转为基于秘密的种子数为每次加密生成一个新的 DEK。
    无论你配置哪种方法，每当 KEK 轮换时，DEK 或种子也会轮换。
    如果使用第三方工具进行密钥管理，会是一个不错的选择。
    从 `v1.27` 开始，该功能处于 Beta 阶段。
    <br />
    <!--
    Read how to <a href="/docs/tasks/administer-cluster/kms-provider#configuring-the-kms-provider-kms-v2">configure the KMS V2 provider</a>.
    -->
    阅读如何<a href="/zh-cn/docs/tasks/administer-cluster/kms-provider#configuring-the-kms-provider-kms-v2">配置 KMS V2 Provider</a>。
    </td>
  </tr>
  <tr>
  <th rowspan="2" scope="row"><tt>secretbox</tt></th>
  <td><!-- XSalsa20 and Poly1305 -->XSalsa20 和 Poly1305</td>
  <td><!-- Strong -->强</td>
  <td><!-- Faster -->更快</td>
  <td><!-- 32-byte -->32 字节</td>
  </tr>
  <tr>
  <td colspan="4">
  <!--
  Uses relatively new encryption technologies that may not be considered acceptable in environments that require high levels of review. Key material accessible from control plane host.
  -->
  使用相对较新的加密技术，在需要高度评审的环境中可能不被接受。密钥材料可从控制面主机访问。
  </td>
  </tr>
</tbody>
</table>

<!--
Each provider supports multiple keys - the keys are tried in order for decryption, and if the provider
is the first provider, the first key is used for encryption.
-->
每个 provider 都支持多个密钥 - 在解密时会按顺序使用密钥，如果是第一个 provider，则第一个密钥用于加密。

{{< caution >}}
<!--
Storing the raw encryption key in the EncryptionConfig only moderately improves your security
posture, compared to no encryption.  Please use `kms` provider for additional security.
-->
在 EncryptionConfig 中保存原始的加密密钥与不加密相比只会略微地提升安全级别。
请使用 `kms` 驱动以获得更强的安全性。
{{< /caution >}}

<!--
By default, the `identity` provider is used to protect secret data in etcd, which provides no
encryption. `EncryptionConfiguration` was introduced to encrypt secret data locally, with a locally
managed key.

Encrypting secret data with a locally managed key protects against an etcd compromise, but it fails to
protect against a host compromise. Since the encryption keys are stored on the host in the
EncryptionConfiguration YAML file, a skilled attacker can access that file and extract the encryption
keys.

Envelope encryption creates dependence on a separate key, not stored in Kubernetes. In this case,
an attacker would need to compromise etcd, the `kubeapi-server`, and the third-party KMS provider to
retrieve the plaintext values, providing a higher level of security than locally stored encryption keys.
-->
默认情况下，`identity` 驱动被用来对 etcd 中的 Secret 数据提供保护，而这个驱动不提供加密能力。
`EncryptionConfiguration` 的引入是为了能够使用本地管理的密钥来在本地加密 Secret 数据。

使用本地管理的密钥来加密 Secret 数据能够保护数据免受 etcd 破坏的影响，不过无法针对主机被侵入提供防护。
这是因为加密的密钥保存在主机上的 EncryptionConfig YAML 文件中，
有经验的入侵者仍能访问该文件并从中提取出加密密钥。

封套加密（Envelope Encryption）引入了对独立密钥的依赖，而这个密钥并不保存在 Kubernetes 中。
在这种情况下，入侵者需要攻破 etcd、kube-apiserver 和第三方的 KMS
驱动才能获得明文数据，因而这种方案提供了比本地保存加密密钥更高的安全级别。

<!--
## Encrypting your data

Create a new encryption config file:
-->
## 加密你的数据   {#encrypting-you-data}

创建一个新的加密配置文件：

<!--
# See the following text for more details about the secret value
# this fallback allows reading unencrypted secrets;
# for example, during initial migration
-->
```yaml
---
apiVersion: apiserver.config.k8s.io/v1
kind: EncryptionConfiguration
resources:
  - resources:
      - secrets
      - configmaps
      - pandas.awesome.bears.example
    providers:
      - aescbc:
          keys:
            - name: key1
              # 参见以下文本了解有关 Secret 值的详情
              secret: <BASE 64 ENCODED SECRET>
      - identity: {} # 这个回退允许读取未加密的 Secret；
                     # 例如，在初始迁移期间
```

<!--
To create a new Secret, perform the following steps:

1. Generate a 32-byte random key and base64 encode it. If you're on Linux or macOS, run the following command:
-->
遵循如下步骤来创建一个新的 Secret：

1. 生成一个 32 字节的随机密钥并进行 base64 编码。如果你在 Linux 或 macOS 上，请运行以下命令：

   ```shell
   head -c 32 /dev/urandom | base64
   ```

<!--
1. Place that value in the `secret` field of the `EncryptionConfiguration` struct.
1. Set the `--encryption-provider-config` flag on the `kube-apiserver` to point to
   the location of the config file.

   You will need to mount the new encryption config file to the `kube-apiserver` static pod. Here is an example on how to do that:
-->
2. 将这个值放入到 `EncryptionConfiguration` 结构体的 `secret` 字段中。
3. 设置 `kube-apiserver` 的 `--encryption-provider-config` 参数，将其指向配置文件所在位置。

   你将需要把新的加密配置文件挂载到 `kube-apiserver` 静态 Pod。以下是这个操作的示例：

   <!--
   1. Save the new encryption config file to `/etc/kubernetes/enc/enc.yaml` on the control-plane node.
   1. Edit the manifest for the `kube-apiserver` static pod: `/etc/kubernetes/manifests/kube-apiserver.yaml` similarly to this:
   -->
   1. 将新的加密配置文件保存到控制平面节点上的 `/etc/kubernetes/enc/enc.yaml`。
   2. 编辑 `kube-apiserver` 静态 Pod 的清单：`/etc/kubernetes/manifests/kube-apiserver.yaml`，
      代码范例如下：

   <!--
   # This is a fragment of a manifest for a static Pod.
   # Check whether this is correct for your cluster and for your API server.
   # add this line
   -->
   ```yaml
   ---
   #
   # 这是一个静态 Pod 的清单片段。
   # 检查是否适用于你的集群和 API 服务器。
   #
   apiVersion: v1
   kind: Pod
   metadata:
     annotations:
       kubeadm.kubernetes.io/kube-apiserver.advertise-address.endpoint: 10.20.30.40:443
     creationTimestamp: null
     labels:
       app.kubernetes.io/component: kube-apiserver
       tier: control-plane
     name: kube-apiserver
     namespace: kube-system
   spec:
     containers:
     - command:
       - kube-apiserver
       ...
       - --encryption-provider-config=/etc/kubernetes/enc/enc.yaml  # 增加这一行
       volumeMounts:
       ...
       - name: enc                           # 增加这一行
         mountPath: /etc/kubernetes/enc      # 增加这一行
         readonly: true                      # 增加这一行
       ...
     volumes:
     ...
     - name: enc                             # 增加这一行
       hostPath:                             # 增加这一行
         path: /etc/kubernetes/enc           # 增加这一行
         type: DirectoryOrCreate             # 增加这一行
     ...
   ```

<!--
1. Restart your API server.
-->
4. 重启你的 API 服务器。

{{< caution >}}
<!--
Your config file contains keys that can decrypt the contents in etcd, so you must properly restrict
permissions on your control-plane nodes so only the user who runs the `kube-apiserver` can read it.
-->
你的配置文件包含可以解密 etcd 内容的密钥，因此你必须正确限制控制平面节点的访问权限，
以便只有能运行 `kube-apiserver` 的用户才能读取它。
{{< /caution >}}

<!--
## Verifying that data is encrypted

Data is encrypted when written to etcd. After restarting your `kube-apiserver`, any newly created or
updated Secret or other resource types configured in `EncryptionConfiguration` should be encrypted
when stored. To check this, you can use the `etcdctl` command line
program to retrieve the contents of your secret data.

1. Create a new Secret called `secret1` in the `default` namespace:
-->
## 验证数据已被加密   {#verifying-that-data-is-encryped}

数据在写入 etcd 时会被加密。重新启动你的 `kube-apiserver` 后，任何新创建或更新的 Secret
或在 `EncryptionConfiguration` 中配置的其他资源类型都应在存储时被加密。
如果想要检查，你可以使用 `etcdctl` 命令行程序来检索你的 Secret 数据内容。

1. 创建一个新的 secret，名称为 `secret1`，命名空间为 `default`：

   ```shell
   kubectl create secret generic secret1 -n default --from-literal=mykey=mydata
   ```

<!--
1. Using the `etcdctl` command line, read that Secret out of etcd:
-->
2. 使用 `etcdctl` 命令行，从 etcd 中读取 Secret：

   ```
   ETCDCTL_API=3 etcdctl get /registry/secrets/default/secret1 [...] | hexdump -C
   ```

   <!--
   where `[...]` must be the additional arguments for connecting to the etcd server.
   -->
   这里的 `[...]` 是用来连接 etcd 服务的额外参数。

   <!--
   For example:
   -->
   例如：

   ```shell
   ETCDCTL_API=3 etcdctl \
      --cacert=/etc/kubernetes/pki/etcd/ca.crt   \
      --cert=/etc/kubernetes/pki/etcd/server.crt \
      --key=/etc/kubernetes/pki/etcd/server.key  \
      get /registry/secrets/default/secret1 | hexdump -C
   ```

   <!--
   The output is similar to this (abbreviated):
   -->
   输出类似于（有删减）：

   ```hexdump
   00000000  2f 72 65 67 69 73 74 72  79 2f 73 65 63 72 65 74  |/registry/secret|
   00000010  73 2f 64 65 66 61 75 6c  74 2f 73 65 63 72 65 74  |s/default/secret|
   00000020  31 0a 6b 38 73 3a 65 6e  63 3a 61 65 73 63 62 63  |1.k8s:enc:aescbc|
   00000030  3a 76 31 3a 6b 65 79 31  3a c7 6c e7 d3 09 bc 06  |:v1:key1:.l.....|
   00000040  25 51 91 e4 e0 6c e5 b1  4d 7a 8b 3d b9 c2 7c 6e  |%Q...l..Mz.=..|n|
   00000050  b4 79 df 05 28 ae 0d 8e  5f 35 13 2c c0 18 99 3e  |.y..(..._5.,...>|
   [...]
   00000110  23 3a 0d fc 28 ca 48 2d  6b 2d 46 cc 72 0b 70 4c  |#:..(.H-k-F.r.pL|
   00000120  a5 fc 35 43 12 4e 60 ef  bf 6f fe cf df 0b ad 1f  |..5C.N`..o......|
   00000130  82 c4 88 53 02 da 3e 66  ff 0a                    |...S..>f..|
   0000013a
   ```

<!--
1. Verify the stored Secret is prefixed with `k8s:enc:aescbc:v1:` which indicates
   the `aescbc` provider has encrypted the resulting data. Confirm that the key name shown in `etcd`
   matches the key name specified in the `EncryptionConfiguration` mentioned above. In this example,
   you can see that the encryption key named `key1` is used in `etcd` and in `EncryptionConfiguration`.

1. Verify the Secret is correctly decrypted when retrieved via the API:
-->
3. 验证存储的密钥前缀是否为 `k8s:enc:aescbc:v1:`，这表明 `aescbc` provider 已加密结果数据。
   确认 `etcd` 中显示的密钥名称和上述 `EncryptionConfiguration` 中指定的密钥名称一致。
   在此例中，你可以看到在 `etcd` 和 `EncryptionConfiguration` 中使用了名为 `key1` 的加密密钥。

4. 通过 API 检索，验证 Secret 是否被正确解密：

   ```shell
   kubectl get secret secret1 -n default -o yaml
   ```

   <!--
   The output should contain `mykey: bXlkYXRh`, with contents of `mydata` encoded, check
   [decoding a Secret](/docs/tasks/configmap-secret/managing-secret-using-kubectl/#decoding-secret)
   to completely decode the Secret.
   -->
   其输出应该包含 `mykey: bXlkYXRh`，`mydata` 的内容是被加密过的，
   请参阅[解密 Secret](/zh-cn/docs/tasks/configmap-secret/managing-secret-using-kubectl/#decoding-secret)
   了解如何完全解码 Secret 内容。

<!--
## Ensure all Secrets are encrypted

Since Secrets are encrypted on write, performing an update on a Secret will encrypt that content.
-->
## 确保所有 Secret 都被加密   {#ensure-all-secrets-are-encrypted}

由于 Secret 是在写入时被加密，因此对 Secret 执行更新也会加密该内容。

```shell
kubectl get secrets --all-namespaces -o json | kubectl replace -f -
```

<!--
The command above reads all Secrets and then updates them to apply server side encryption.
-->
上面的命令读取所有 Secret，然后使用服务端加密来更新其内容。

{{< note >}}
<!--
If an error occurs due to a conflicting write, retry the command.
For larger clusters, you may wish to subdivide the secrets by namespace or script an update.
-->
如果由于冲突写入而发生错误，请重试该命令。
对于较大的集群，你可能希望通过命名空间或更新脚本来对 Secret 进行划分。
{{< /note >}}

<!--
## Rotating a decryption key

Changing a Secret without incurring downtime requires a multi-step operation, especially in
the presence of a highly-available deployment where multiple `kube-apiserver` processes are running.

1. Generate a new key and add it as the second key entry for the current provider on all servers
1. Restart all `kube-apiserver` processes to ensure each server can decrypt using the new key
1. Make the new key the first entry in the `keys` array so that it is used for encryption in the config
1. Restart all `kube-apiserver` processes to ensure each server now encrypts using the new key
1. Run `kubectl get secrets --all-namespaces -o json | kubectl replace -f -` to encrypt all
   existing Secrets with the new key
1. Remove the old decryption key from the config after you have backed up etcd with the new key in use
   and updated all Secrets

When running a single `kube-apiserver` instance, step 2 may be skipped.
-->
## 轮换解密密钥   {#rotating-a-decryption-key}

在不发生停机的情况下更改 Secret 需要多步操作，特别是在有多个 `kube-apiserver`
进程正在运行的高可用环境中。

1. 生成一个新密钥并将其添加为所有服务器上当前 provider 的第二个密钥条目
1. 重新启动所有 `kube-apiserver` 进程以确保每台服务器都可以使用新密钥进行解密
1. 将新密钥设置为 `keys` 数组中的第一个条目，以便在配置中使用其进行加密
1. 重新启动所有 `kube-apiserver` 进程以确保每个服务器现在都使用新密钥进行加密
1. 运行 `kubectl get secrets --all-namespaces -o json | kubectl replace -f -`
   以用新密钥加密所有现有的 Secret
1. 在使用新密钥备份 etcd 后，从配置中删除旧的解密密钥并更新所有密钥

当只运行一个 `kube-apiserver` 实例时，第 2 步可以忽略。

<!--
## Decrypting all data

To disable encryption at rest, place the `identity` provider as the first entry in the config
and restart all `kube-apiserver` processes.
-->
## 解密所有数据    {#decrypting-all-data}

要禁用静态加密，请将 `identity` provider
作为配置中的第一个条目并重新启动所有 `kube-apiserver` 进程。

```yaml
---
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
Then run the following command to force decrypt all Secrets:
-->
然后运行以下命令以强制解密所有 Secret：

```shell
kubectl get secrets --all-namespaces -o json | kubectl replace -f -
```

<!--
## Configure automatic reloading
-->
## 配置自动重新加载   {#configure-automatic-reloading}

<!--
You can configure automatic reloading of encryption provider configuration.
That setting determines whether the
{{< glossary_tooltip text="API server" term_id="kube-apiserver" >}} should
load the file you specify for `--encryption-provider-config` only once at
startup, or automatically whenever you change that file. Enabling this option
allows you to change the keys for encryption at rest without restarting the
API server.
-->
你可以配置加密提供程序配置的自动重新加载。
该设置决定了 {{< glossary_tooltip text="API 服务器" term_id="kube-apiserver" >}}
是仅在启动时加载一次为 `--encryption-provider-config` 指定的文件，
还是在每次你更改该文件时都自动加载。
启用此选项可允许你在不重启 API 服务器的情况下更改静态加密所需的密钥。

<!--
To allow automatic reloading, configure the API server to run with:
`--encryption-provider-config-automatic-reload=true`
-->
要允许自动重新加载，
可使用 `--encryption-provider-config-automatic-reload=true` 运行 API 服务器。

## {{% heading "whatsnext" %}}

<!--
* Learn more about the [EncryptionConfiguration configuration API (v1)](/docs/reference/config-api/apiserver-encryption.v1/).
-->
进一步学习 [EncryptionConfiguration 配置 API (v1)](/zh-cn/docs/reference/config-api/apiserver-encryption.v1/)。
