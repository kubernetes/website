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
## Determine whether encryption at rest is already enabled {#determining-whether-encryption-at-rest-is-already-enabled}

By default, the API server stores plain-text representations of resources into etcd, with
no at-rest encryption.
-->
## 确定是否已启用静态数据加密   {#determining-whether-encryption-at-rest-is-already-enabled}

默认情况下，API 服务器将资源的明文表示存储在 etcd 中，没有静态加密。

<!--
The `kube-apiserver` process accepts an argument `--encryption-provider-config`
that specifies a path to a configuration file. The contents of that file, if you specify one,
control how Kubernetes API data is encrypted in etcd.
If you are running the kube-apiserver without the `--encryption-provider-config` command line
argument, you do not have encryption at rest enabled. If you are running the kube-apiserver
with the `--encryption-provider-config` command line argument, and the file that it references
specifies the `identity` provider as the first encryption provider in the list, then you
do not have at-rest encryption enabled
(**the default `identity` provider does not provide any confidentiality protection.**)
-->
`kube-apiserver` 进程使用 `--encryption-provider-config` 参数指定配置文件的路径，
所指定的配置文件的内容将控制 Kubernetes API 数据在 etcd 中的加密方式。
如果你在运行 kube-apiserver 时没有使用 `--encryption-provider-config` 命令行参数，
则你未启用静态加密。如果你在运行 kube-apiserver 时使用了 `--encryption-provider-config`
命令行参数，并且此参数所引用的文件指定 `identity` 提供程序作为加密提供程序列表中的第一个，
则你未启用静态加密（**默认的 `identity` 提供程序不提供任何机密性保护**）。

<!--
If you are running the kube-apiserver
with the `--encryption-provider-config` command line argument, and the file that it references
specifies a provider other than `identity` as the first encryption provider in the list, then
you already have at-rest encryption enabled. However, that check does not tell you whether
a previous migration to encrypted storage has succeeded. If you are not sure, see
[ensure all relevant data are encrypted](#ensure-all-secrets-are-encrypted).
-->
如果你在运行 kube-apiserver 时使用了 `--encryption-provider-config` 命令行参数，
并且此参数所引用的文件指定一个不是 `identity` 的提供程序作为加密提供程序列表中的第一个，
则你已启用静态加密。然而此项检查并未告知你先前向加密存储的迁移是否成功。如果你不确定，
请参阅[确保所有相关数据都已加密](#ensure-all-secrets-are-encrypted)。

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

<!-- note to localizers: the highlight is to make the initial comment obvious -->
<!-- you can use as many lines as makes sense for your target localization    -->

<!--
{{< highlight yaml "linenos=false,hl_lines=2-5" >}}
---
#
# CAUTION: this is an example configuration.
#          Do not use this for your own cluster!
#
apiVersion: apiserver.config.k8s.io/v1
kind: EncryptionConfiguration
resources:
  - resources:
      - secrets
      - configmaps
      - pandas.awesome.bears.example # a custom resource API
    providers:
      # This configuration does not provide data confidentiality. The first
      # configured provider is specifying the "identity" mechanism, which
      # stores resources as plain text.
      #
      - identity: {} # plain text, in other words NO encryption
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
      - identity: {} # do not encrypt Events even though *.* is specified below
  - resources:
      - '*.apps' # wildcard match requires Kubernetes 1.27 or later
    providers:
      - aescbc:
          keys:
          - name: key2
            secret: c2VjcmV0IGlzIHNlY3VyZSwgb3IgaXMgaXQ/Cg==
  - resources:
      - '*.*' # wildcard match requires Kubernetes 1.27 or later
    providers:
      - aescbc:
          keys:
          - name: key3
            secret: c2VjcmV0IGlzIHNlY3VyZSwgSSB0aGluaw==
{{< /highlight  >}}
-->
{{< highlight yaml "linenos=false,hl_lines=2-5" >}}
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
{{< /highlight  >}}

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
Each provider supports multiple keys - the keys are tried in order for decryption, and if the provider
is the first provider, the first key is used for encryption.
-->
每个 `resources` 数组项目是一个单独的完整的配置。
`resources.resources` 字段是应加密的 Kubernetes 资源（例如 Secret、ConfigMap 或其他资源）名称
（`resource` 或 `resource.group`）的数组。

如果自定义资源被添加到 `EncryptionConfiguration` 并且集群版本为 1.26 或更高版本，
则 `EncryptionConfiguration` 中提到的任何新创建的自定义资源都将被加密。
在该版本之前存在于 etcd 中的任何自定义资源和配置不会被加密，直到它们被下一次写入到存储为止。
这与内置资源的行为相同。请参阅[确保所有 Secret 都已加密](#ensure-all-secrets-are-encrypted)一节。

`providers` 数组是可能的加密提供程序的有序列表，用于你所列出的 API。
每个提供程序支持多个密钥 - 解密时会按顺序尝试这些密钥，
如果这是第一个提供程序，其第一个密钥将被用于加密。

<!--
Only one provider type may be specified per entry (`identity` or `aescbc` may be provided,
but not both in the same item).
The first provider in the list is used to encrypt resources written into the storage. When reading
resources from storage, each provider that matches the stored data attempts in order to decrypt the
data. If no provider can read the stored data due to a mismatch in format or secret key, an error
is returned which prevents clients from accessing that resource.
-->
每个条目只能指定一个提供程序类型（可以是 `identity` 或 `aescbc`，但不能在同一个项目中同时指定二者）。
列表中的第一个提供程序用于加密写入存储的资源。
当从存储器读取资源时，与存储的数据匹配的所有提供程序将按顺序尝试解密数据。
如果由于格式或密钥不匹配而导致没有提供程序能够读取存储的数据，则会返回一个错误，以防止客户端访问该资源。

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
If you have a wildcard covering resources and want to opt out of at-rest encryption for a particular kind
of resource, you achieve that by adding a separate `resources` array item with the name of the resource that
you want to exempt, followed by a `providers` array item where you specify the `identity` provider. You add
this item to the list so that it appears earlier than the configuration where you do specify encryption
(a provider that is not `identity`).
-->
如果你有一个涵盖资源（resource）的通配符，并且想要过滤掉静态加密的特定类型资源，
则可以通过添加一个单独的 `resources` 数组项来实现此目的，
其中包含要豁免的资源的名称，还可以在其后跟一个 `providers` 数组项来指定 `identity` 提供商。
你可以将此数组项添加到列表中，以便它早于你指定加密的配置（不是 `identity` 的提供商）出现。

<!--
For example, if '`*.*`' is enabled and you want to opt out of encryption for Events and ConfigMaps, add a
new **earlier** item to the `resources`, followed by the providers array item with `identity` as the
provider. The more specific entry must come before the wildcard entry.

The new item would look similar to:
-->
例如，如果启用了 '`*.*`'，并且你想要选择不加密 Event 和 ConfigMap，
请在 `resources` 中**靠前**的位置添加一个新的条目，后跟带有 `identity`
的 providers 数组项作为提供程序。较为特定的条目必须位于通配符条目之前。

新项目看起来类似于：

<!--
```yaml
  ...
  - resources:
      - configmaps. # specifically from the core API group,
                    # because of trailing "."
      - events
    providers:
      - identity: {}
  # and then other entries in resources
```
-->
```yaml
  ...
  - resources:
      - configmaps. # 特定于来自核心 API 组的资源，因为结尾是 “.”
      - events
    providers:
      - identity: {}
  # 然后是资源中的其他条目
```

<!--
Ensure that the new item is listed _before_ the wildcard '`*.*`' item in the resources array
to give it precedence.
-->
确保新项列在资源数组中的通配符 “`*.*`” 项**之前**，使新项优先。

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

<!--
### Available providers {#providers}

Before you configure encryption-at-rest for data in your cluster's Kubernetes API, you
need to select which provider(s) you will use.

The following table describes each available provider.
-->
### 可用的提供程序   {#providers}

在为集群的 Kubernetes API 数据配置静态加密之前，你需要选择要使用的提供程序。

下表描述了每个可用的提供程序：

<table class="complex-layout">
<caption style="display: none;">
<!--
Providers for Kubernetes encryption at rest
-->
Kubernetes 静态数据加密的提供程序
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
  <!--
  Resources written as-is without encryption. When set as the first provider,
  the resource will be decrypted as new values are written.
  Existing encrypted resources are <strong>not</strong> automatically overwritten with the plaintext data.
  The <tt>identity</tt> provider is the default if you do not specify otherwise.
  -->
  不加密写入的资源。当设置为第一个提供程序时，已加密的资源将在新值写入时被解密。
  </td>
  </tr>
</tbody>
<tbody id="encryption-providers-that-encrypt">
  <tr>
  <th rowspan="2" scope="row"><tt>aescbc</tt></th>
  <td>
  <!--
  AES-CBC with <a href="https://datatracker.ietf.org/doc/html/rfc2315">PKCS#7</a> padding
  -->
  带有 <a href="https://datatracker.ietf.org/doc/html/rfc2315">PKCS#7</a> 填充的 AES-CBC
  </td>
  <td><!-- Weak -->弱</td>
  <td><!-- Fast -->快</td>
  <td><!-- 32-byte -->32 字节</td>
  </tr>
  <tr>
  <td colspan="4">
  <!--
  Not recommended due to CBC's vulnerability to padding oracle attacks. Key material accessible from control plane host.
  -->
  由于 CBC 容易受到密文填塞攻击（Padding Oracle Attack），不推荐使用。密钥材料可从控制面主机访问。
  </td>
  </tr>
  <tr>
  <th rowspan="2" scope="row"><tt>aesgcm</tt></th>
  <td>
  <!--
  AES-GCM with random nonce
  -->
  带有随机数的 AES-GCM
  </td>
  <td>
  <!--
  Must be rotated every 200,000 writes
  -->
  每写入 200k 次后必须轮换
  </td>
  <td><!-- Fastest -->最快</td>
  <td><!-- 16, 24, or 32-byte -->16、24 或者 32 字节</td>
  </tr>
  <tr>
  <td colspan="4">
  <!--
  Not recommended for use except when an automated key rotation scheme is implemented. Key material accessible from control plane host.
  -->
  不建议使用，除非实施了自动密钥轮换方案。密钥材料可从控制面主机访问。
  </td>
  </tr>
  <tr>
  <th rowspan="2" scope="row"><tt>kms</tt> v1 <em><!--(deprecated since Kubernetes v1.28)-->（自 Kubernetes 1.28 起弃用）</em></th>
  <td>
  <!--
  Uses envelope encryption scheme with DEK per resource.
  -->
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
    阅读如何<a href="/zh-cn/docs/tasks/administer-cluster/kms-provider#configuring-the-kms-provider-kms-v1">配置 KMS V1 提供程序</a>
    </td>
  </tr>
  <tr>
  <th rowspan="2" scope="row"><tt>kms</tt> v2 </th>
  <td>
  <!--
  Uses envelope encryption scheme with DEK per API server.
  -->
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
    Kubernetes generates a new DEK per encryption from a secret seed.
    The seed is rotated whenever the KEK is rotated.<br/>
    A good choice if using a third party tool for key management.
    Available as stable from Kubernetes v1.29.
    -->
    通过数据加密密钥（DEK）使用 AES-GCM 加密数据；
    DEK 根据 Key Management Service（KMS）中的配置通过密钥加密密钥（Key Encryption Keys，KEK）加密。
    Kubernetes 基于秘密的种子数为每次加密生成一个新的 DEK。
    每当 KEK 轮换时，种子也会轮换。
    如果使用第三方工具进行密钥管理，这是一个不错的选择。
    从 `v1.29` 开始，该功能处于稳定阶段。
    <br />
    <!--
    Read how to <a href="/docs/tasks/administer-cluster/kms-provider#configuring-the-kms-provider-kms-v2">configure the KMS V2 provider</a>.
    -->
    阅读如何<a href="/zh-cn/docs/tasks/administer-cluster/kms-provider#configuring-the-kms-provider-kms-v2">配置 KMS V2 提供程序</a>。
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
The `identity` provider is the default if you do not specify otherwise. **The `identity` provider does not
encrypt stored data and provides _no_ additional confidentiality protection.**
-->
如果你没有另外指定，`identity` 提供程序将作为默认选项。
**`identity` 提供程序不会加密存储的数据，并且提供无附加的机密保护。**

<!--
### Key storage

#### Local key storage

Encrypting secret data with a locally managed key protects against an etcd compromise, but it fails to
protect against a host compromise. Since the encryption keys are stored on the host in the
EncryptionConfiguration YAML file, a skilled attacker can access that file and extract the encryption
keys.
-->
### 密钥存储   {#key-storage}

#### 本地密钥存储    {#local-key-storage}

使用本地管理的密钥对 Secret 数据进行加密可以防止 etcd 受到威胁，但无法防范主机受到威胁的情况。
由于加密密钥被存储在主机上的 EncryptionConfiguration YAML 文件中，有经验的攻击者可以访问该文件并提取加密密钥。

<!--
#### Managed (KMS) key storage {#kms-key-storage}

The KMS provider uses _envelope encryption_: Kubernetes encrypts resources using a data key, and then
encrypts that data key using the managed encryption service. Kubernetes generates a unique data key for
each resource. The API server stores an encrypted version of the data key in etcd alongside the ciphertext;
when reading the resource, the API server calls the managed encryption service and provides both the
ciphertext and the (encrypted) data key.
Within the managed encryption service, the provider use a _key encryption key_ to decipher the data key,
deciphers the data key, and finally recovers the plain text. Communication between the control plane
and the KMS requires in-transit protection, such as TLS.
-->
#### 托管的（KMS）密钥存储   {#kms-key-storage}

KMS 提供程序使用**封套加密**：Kubernetes 使用一个数据密钥来加密资源，然后使用托管的加密服务来加密该数据密钥。
Kubernetes 为每个资源生成唯一的数据密钥。API 服务器将数据密钥的加密版本与密文一起存储在 etcd 中；
API 服务器在读取资源时，调用托管的加密服务并提供密文和（加密的）数据密钥。
在托管的加密服务中，提供程序使用**密钥加密密钥**来解密数据密钥，解密数据密钥后恢复为明文。
在控制平面和 KMS 之间的通信需要在传输过程中提供 TLS 这类保护。

<!--
Using envelope encryption creates dependence on the key encryption key, which is not stored in Kubernetes.
In the KMS case, an attacker who intends to get unauthorised access to the plaintext
values would need to compromise etcd **and** the third-party KMS provider.
-->
使用封套加密会依赖于密钥加密密钥，此密钥不存储在 Kubernetes 中。
就 KMS 而言，如果攻击者意图未经授权地访问明文值，则需要同时入侵 etcd
**和**第三方 KMS 提供程序。

<!--
### Protection for encryption keys

You should take appropriate measures to protect the confidential information that allows decryption,
whether that is a local encryption key, or an authentication token that allows the API server to
call KMS.
-->
### 保护加密密钥   {#protection-for-encryption-keys}

你应该采取适当的措施来保护允许解密的机密信息，无论是本地加密密钥还是允许
API 服务器调用 KMS 的身份验证令牌。

<!--
Even when you rely on a provider to manage the use and lifecycle of the main encryption key (or keys), you are still responsible
for making sure that access controls and other security measures for the managed encryption service are
appropriate for your security needs.
-->
即使你依赖提供商来管理主加密密钥（或多个密钥）的使用和生命周期，
你仍然有责任确保托管加密服务的访问控制和其他安全措施满足你的安全需求。

<!--
## Encrypt your data {#encrypting-your-data}

### Generate the encryption key {#generate-key-no-kms}
-->
## 加密你的数据  {#encrypting-your-data}

### 生成加密密钥  {#generate-key-no-kms}

<!--
The following steps assume that you are not using KMS, and therefore the steps also
assume that you need to generate an encryption key. If you already have an encryption key,
skip to [Write an encryption configuration file](#write-an-encryption-configuration-file).
-->
以下步骤假设你没有使用 KMS，因此这些步骤还假设你需要生成加密密钥。
如果你已有加密密钥，请跳至[编写加密配置文件](#write-an-encryption-configuration-file)。

{{< caution >}}
<!--
Storing the raw encryption key in the EncryptionConfig only moderately improves your security posture,
compared to no encryption.
-->
与不加密相比，将原始加密密钥存储在 EncryptionConfig 中只能适度改善你的安全状况。

<!--
For additional secrecy, consider using the `kms` provider as this relies on keys held outside your
Kubernetes cluster. Implementations of `kms` can work with hardware security modules or with
encryption services managed by your cloud provider.
-->
为了获得额外的保密性，请考虑使用 `kms` 提供程序，因为这依赖于 Kubernetes
集群外部保存的密钥。`kms` 的实现可以与硬件安全模块或由云提供商管理的加密服务配合使用。

<!--
To learn about setting
up encryption at rest using KMS, see
[Using a KMS provider for data encryption](/docs/tasks/administer-cluster/kms-provider/).
The KMS provider plugin that you use may also come with additional specific documentation.
-->
要了解如何使用 KMS 设置静态加密，请参阅[使用 KMS 提供程序进行数据加密](/zh-cn/docs/tasks/administer-cluster/kms-provider/)。
你使用的 KMS 提供程序插件可能还附带其他特定文档。
{{< /caution >}}

<!--
Start by generating a new encryption key, and then encode it using base64:
-->
首先生成新的加密密钥，然后使用 base64 对其进行编码：

{{< tabs name="generate_encryption_key" >}}
{{% tab name="Linux" %}}
<!--
Generate a 32-byte random key and base64 encode it. You can use this command:
-->
生成 32 字节随机密钥并对其进行 base64 编码。你可以使用这个命令：

```shell
head -c 32 /dev/urandom | base64
```

<!--
You can use `/dev/hwrng` instead of `/dev/urandom` if you want to
use your PC's built-in hardware entropy source. Not all Linux
devices provide a hardware random generator.
-->
如果你想使用 PC 的内置硬件熵源，可以使用 `/dev/hwrng` 而不是 `/dev/urandom`。
并非所有 Linux 设备都提供硬件随机数生成器。
{{% /tab %}}
{{% tab name="macOS" %}}
<!-- localization note: this is similar to the Linux tab and the wording
should match wherever the English text does -->
<!--
Generate a 32-byte random key and base64 encode it. You can use this command:
-->
生成 32 字节随机密钥并对其进行 base64 编码。你可以使用此命令：

```shell
head -c 32 /dev/urandom | base64
```
{{% /tab %}}
{{% tab name="Windows" %}}
<!--
Generate a 32-byte random key and base64 encode it. You can use this command:
-->
生成 32 字节随机密钥并对其进行 base64 编码。你可以使用此命令：

<!--
# Do not run this in a session where you have set a random number
# generator seed.
-->
```powershell
# 不要在已设置随机数生成器种子的会话中运行此命令。
[Convert]::ToBase64String((1..32|%{[byte](Get-Random -Max 256)}))
```
{{% /tab %}}
{{< /tabs >}}


{{< note >}}
<!--
Keep the encryption key confidential, including while you generate it and
ideally even after you are no longer actively using it.
-->
保持加密密钥的机密性，包括在生成密钥时，甚至理想的情况下在你不再主动使用密钥后也要保密。
{{< /note >}}

<!--
### Replicate the encryption key

Using a secure mechanism for file transfer, make a copy of that encryption key
available to every other control plane host.

At a minimum, use encryption in transit - for example, secure shell (SSH). For more
security, use asymmetric encryption between hosts, or change the approach you are using
so that you're relying on KMS encryption.
-->
### 复制加密密钥

使用安全的文件传输机制，将该加密密钥的副本提供给所有其他控制平面主机。

至少，使用传输加密 - 例如，安全 shell（SSH）。为了提高安全性，
请在主机之间使用非对称加密，或更改你正在使用的方法，以便依赖 KMS 加密。

<!--
## Write an encryption configuration file
-->
## 编辑加密配置文件   {#write-an-encryption-configuration-file}

{{< caution >}}
<!--
The encryption configuration file may contain keys that can decrypt content in etcd.
If the configuration file contains any key material, you must properly
restrict permissions on all your control plane hosts so only the user
who runs the kube-apiserver can read this configuration.
-->
加密配置文件可能包含可以解密 etcd 中内容的密钥。
如果此配置文件包含任何密钥信息，你必须在所有控制平面主机上合理限制权限，
以便只有运行 kube-apiserver 的用户可以读取此配置。
{{< /caution >}}

<!--
Create a new encryption configuration file. The contents should be similar to:
-->
创建一个新的加密配置文件。其内容应类似于：

<!--
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
              # See the following text for more details about the secret value
              secret: <BASE 64 ENCODED SECRET>
      - identity: {} # this fallback allows reading unencrypted secrets;
                     # for example, during initial migration
```
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
To create a new encryption key (that does not use KMS), see
[Generate the encryption key](#generate-key-no-kms).
-->
要创建新的加密密钥（不使用 KMS），请参阅[生成加密密钥](#generate-key-no-kms)。

<!--
### Use the new encryption configuration file
-->
### 使用新的加密配置文件

<!--
You will need to mount the new encryption config file to the `kube-apiserver` static pod. Here is an example on how to do that:
-->
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
         readOnly: true                      # 增加这一行
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
You now have encryption in place for **one** control plane host. A typical
Kubernetes cluster has multiple control plane hosts, so there is more to do.
-->
你现在已经为**一个**控制平面主机进行了加密。典型的 Kubernetes
集群有多个控制平面主机，因此需要做的事情更多。

<!--
### Reconfigure other control plane hosts {#api-server-config-update-more}

If you have multiple API servers in your cluster, you should deploy the
changes in turn to each API server.
-->
### 重新配置其他控制平面主机   {#api-server-config-update-more}

如果你的集群中有多个 API 服务器，应轮流将更改部署到每个 API 服务器。

{{< caution >}}
<!--
For cluster configurations with two or more control plane nodes, the encryption configuration
should be identical across each control plane node.

If there is a difference in the encryption provider configuration between control plane
nodes, this difference may mean that the kube-apiserver can't decrypt data.
-->
对于具有两个或更多控制平面节点的集群配置，每个控制平面节点的加密配置应该是相同的。

如果控制平面节点间的加密驱动配置不一致，这种差异可能导致 kube-apiserver 无法解密数据。
{{< /caution >}}

<!--
When you are planning to update the encryption configuration of your cluster, plan this
so that the API servers in your control plane can always decrypt the stored data
(even part way through rolling out the change).

Make sure that you use the **same** encryption configuration on each
control plane host.
-->
你在计划更新集群的加密配置时，请确保控制平面中的 API 服务器在任何时候都能解密存储的数据（即使是在更改逐步实施的过程中也是如此）。

确保在每个控制平面主机上使用**相同的**加密配置。

<!--
### Verify that newly written data is encrypted {#verifying-that-data-is-encrypted}

Data is encrypted when written to etcd. After restarting your `kube-apiserver`, any newly
created or updated Secret (or other resource kinds configured in `EncryptionConfiguration`)
should be encrypted when stored.

To check this, you can use the `etcdctl` command line
program to retrieve the contents of your secret data.

This example shows how to check this for encrypting the Secret API.
-->
### 验证数据已被加密   {#verifying-that-data-is-encryped}

数据在写入 etcd 时会被加密。重新启动你的 `kube-apiserver` 后，任何新创建或更新的 Secret
或在 `EncryptionConfiguration` 中配置的其他资源类别都应在存储时被加密。

如果想要检查，你可以使用 `etcdctl` 命令行程序来检索你的 Secret 数据内容。

以下示例演示了如何对加密 Secret API 进行检查。

<!--
1. Create a new Secret called `secret1` in the `default` namespace:
-->
1. 创建一个新的 Secret，名称为 `secret1`，命名空间为 `default`：

   ```shell
   kubectl create secret generic secret1 -n default --from-literal=mykey=mydata
   ```

<!--
1. Using the `etcdctl` command line tool, read that Secret out of etcd:
-->
2. 使用 `etcdctl` 命令行工具，从 etcd 中读取 Secret：

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
   The output should contain `mykey: bXlkYXRh`, with contents of `mydata` encoded using base64;
   read
   [decoding a Secret](/docs/tasks/configmap-secret/managing-secret-using-kubectl/#decoding-secret)
   to learn how to completely decode the Secret.
   -->
   其输出应该包含 `mykey: bXlkYXRh`，其中 `mydata` 的内容使用 base64 进行加密，
   请参阅[解密 Secret](/zh-cn/docs/tasks/configmap-secret/managing-secret-using-kubectl/#decoding-secret)
   了解如何完全解码 Secret 内容。

<!--
### Ensure all relevant data are encrypted {#ensure-all-secrets-are-encrypted}

It's often not enough to make sure that new objects get encrypted: you also want that
encryption to apply to the objects that are already stored.

For this example, you have configured your cluster so that Secrets are encrypted on write.
Performing a replace operation for each Secret will encrypt that content at rest,
where the objects are unchanged.

You can make this change across all Secrets in your cluster:
-->
### 确保所有相关数据都被加密   {#ensure-all-secrets-are-encrypted}

仅仅确保新对象被加密通常是不够的：你还希望对已经存储的对象进行加密。

例如，你已经配置了集群，使得 Secret 在写入时进行加密。
为每个 Secret 执行替换操作将加密那些对象保持不变的静态内容。

你可以在集群中的所有 Secret 上进行此项变更：

<!--
# Run this as an administrator that can read and write all Secrets
-->
```shell
# 以能够读写所有 Secret 的管理员身份运行此命令
kubectl get secrets --all-namespaces -o json | kubectl replace -f -
```

<!--
The command above reads all Secrets and then updates them with the same data, in order to
apply server side encryption.
-->
上面的命令读取所有 Secret，然后使用相同的数据更新这些 Secret，以便应用服务端加密。

{{< note >}}
<!--
If an error occurs due to a conflicting write, retry the command.
It is safe to run that command more than once.

For larger clusters, you may wish to subdivide the Secrets by namespace,
or script an update.
-->
如果由于冲突写入而发生错误，请重试该命令。
多次运行此命令是安全的。

对于较大的集群，你可能希望通过命名空间或更新脚本来对 Secret 进行划分。
{{< /note >}}

<!--
## Prevent plain text retrieval {#cleanup-all-secrets-encrypted}

If you want to make sure that the only access to a particular API kind is done using
encryption, you can remove the API server's ability to read that API's backing data
as plaintext.
-->
## 防止纯文本检索   {#cleanup-all-secrets-encrypted}

如果你想确保对特定 API 类型的唯一访问是使用加密完成的，你可以移除
API 服务器以明文形式读取该 API 的支持数据的能力。

{{< warning >}}
<!--
Making this change prevents the API server from retrieving resources that are marked
as encrypted at rest, but are actually stored in the clear.

When you have configured encryption at rest for an API (for example: the API kind
`Secret`, representing `secrets` resources in the core API group), you **must** ensure
that all those resources in this cluster really are encrypted at rest. Check this before
you carry on with the next steps.
-->
此更改可防止 API 服务器检索标记为静态加密但实际上以明文形式存储的资源。

当你为某个 API 配置静态加密时（例如：API 种类 `Secret`，代表核心 API 组中的 `secrets` 资源），
你**必须**确保该集群中的所有这些资源确实被静态加密，
在后续步骤开始之前请检查此项。
{{< /warning >}}

<!--
Once all Secrets in your cluster are encrypted, you can remove the `identity`
part of the encryption configuration. For example:
-->
一旦集群中的所有 Secret 都被加密，你就可以删除加密配置中的 `identity` 部分。例如：

<!--
{{< highlight yaml "linenos=false,hl_lines=12" >}}
---
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
      - identity: {} # REMOVE THIS LINE
{{< /highlight >}}
-->
{{< highlight yaml "linenos=false,hl_lines=12" >}}
---
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
      - identity: {} # 删除此行
{{< /highlight >}}

<!--
…and then restart each API server in turn. This change prevents the API server
from accessing a plain-text Secret, even by accident.
-->
…然后依次重新启动每个 API 服务器。此更改可防止 API 服务器访问纯文本 Secret，即使是意外访问也是如此。

<!--
## Rotate a decryption key {#rotating-a-decryption-key}

Changing an encryption key for Kubernetes without incurring downtime requires a multi-step operation,
especially in the presence of a highly-available deployment where multiple `kube-apiserver` processes
are running.

1. Generate a new key and add it as the second key entry for the current provider on all
   control plane nodes.
1. Restart **all** `kube-apiserver` processes, to ensure each server can decrypt
   any data that are encrypted with the new key.
1. Make a secure backup of the new encryption key. If you lose all copies of this key you would
   need to delete all the resources were encrypted under the lost key, and workloads may not
   operate as expected during the time that at-rest encryption is broken.
1. Make the new key the first entry in the `keys` array so that it is used for encryption-at-rest
   for new writes
1. Restart all `kube-apiserver` processes to ensure each control plane host now encrypts using the new key
1. As a privileged user, run `kubectl get secrets --all-namespaces -o json | kubectl replace -f -`
   to encrypt all existing Secrets with the new key
1. After you have updated all existing Secrets to use the new key and have made a secure backup of the
   new key, remove the old decryption key from the configuration.
-->
## 轮换解密密钥   {#rotating-a-decryption-key}

在不发生停机的情况下更改 Kubernetes 的加密密钥需要多步操作，特别是在有多个 `kube-apiserver`
进程正在运行的高可用环境中。

1. 生成一个新密钥并将其添加为所有控制平面节点上当前提供程序的第二个密钥条目
1. 重新启动所有 `kube-apiserver` 进程以确保每台服务器都可以使用新密钥加密任何数据
1. 对新的加密密钥进行安全备份。如果你丢失了此密钥的所有副本，则需要删除用已丢失的密钥加密的所有资源，
   并且在静态加密被破坏期间，工作负载可能无法按预期运行。
1. 将新密钥设置为 `keys` 数组中的第一个条目，以便将其用于新编写的静态加密
1. 重新启动所有 `kube-apiserver` 进程，以确保每个控制平面主机现在使用新密钥进行加密
1. 作为特权用户，运行 `kubectl get secrets --all-namespaces -o json | kubectl replace -f -`
   以用新密钥加密所有现有的 Secret
1. 将所有现有 Secret 更新为使用新密钥并对新密钥进行安全备份后，从配置中删除旧的解密密钥。

<!--
## Decrypt all data {#decrypting-all-data}

This example shows how to stop encrypting the Secret API at rest. If you are encrypting
other API kinds, adjust the steps to match.

To disable encryption at rest, place the `identity` provider as the first
entry in your encryption configuration file:
-->
## 解密所有数据    {#decrypting-all-data}

此示例演示如何停止静态加密 Secret API。如果你所加密的是其他 API 类型，请调整对应步骤来适配。

要禁用静态加密，请将 `identity` 提供程序作为加密配置文件中的第一个条目：

<!--
```yaml
---
apiVersion: apiserver.config.k8s.io/v1
kind: EncryptionConfiguration
resources:
  - resources:
      - secrets
      # list any other resources here that you previously were
      # encrypting at rest
    providers:
      - identity: {} # add this line
      - aescbc:
          keys:
            - name: key1
              secret: <BASE 64 ENCODED SECRET> # keep this in place
                                               # make sure it comes after "identity"
```
-->
```yaml
---
apiVersion: apiserver.config.k8s.io/v1
kind: EncryptionConfiguration
resources:
  - resources:
      - secrets
      # 在此列出你之前静态加密的任何其他资源
    providers:
      - identity: {} # 添加此行
      - aescbc:
          keys:
            - name: key1
              secret: <BASE 64 ENCODED SECRET> # 将其保留在适当的位置并确保它位于 "identity" 之后
```

<!--
Then run the following command to force decryption of all Secrets:
-->
然后运行以下命令以强制解密所有 Secret：

```shell
kubectl get secrets --all-namespaces -o json | kubectl replace -f -
```

<!--
Once you have replaced all existing encrypted resources with backing data that
don't use encryption, you can remove the encryption settings from the
`kube-apiserver`.
-->
将所有现有加密资源替换为不使用加密的支持数据后，你可以从 `kube-apiserver`
中删除加密设置。

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
`--encryption-provider-config-automatic-reload=true`.
When enabled, file changes are polled every minute to observe the modifications.
The `apiserver_encryption_config_controller_automatic_reload_last_timestamp_seconds`
metric identifies when the new config becomes effective. This allows
encryption keys to be rotated without restarting the API server.
-->
要允许自动重新加载，
可使用 `--encryption-provider-config-automatic-reload=true` 运行 API 服务器。
该功能启用后，每分钟会轮询文件变化以监测修改情况。
`apiserver_encryption_config_controller_automatic_reload_last_timestamp_seconds` 指标用于标识新配置生效的时间。
这种设置可以在不重启 API 服务器的情况下轮换加密密钥。

## {{% heading "whatsnext" %}}

<!--
* Read about [decrypting data that are already stored at rest](/docs/tasks/administer-cluster/decrypt-data/)
* Learn more about the [EncryptionConfiguration configuration API (v1)](/docs/reference/config-api/apiserver-config.v1/).
-->
* 进一步学习[解密已静态加密的数据](/zh-cn/docs/tasks/administer-cluster/decrypt-data/)。
* 进一步学习 [EncryptionConfiguration 配置 API（v1）](/zh-cn/docs/reference/config-api/apiserver-config.v1/)。
