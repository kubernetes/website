---
title: 靜態加密機密資料
content_type: task
weight: 210
---
<!--
title: Encrypting Confidential Data at Rest
reviewers:
- aramase
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
Kubernetes 中允許允許使用者編輯的持久 API 資源資料的所有 API 都支持靜態加密。
例如，你可以啓用靜態加密 {{< glossary_tooltip text="Secret" term_id="secret" >}}。
此靜態加密是對 etcd 叢集或運行 kube-apiserver 的主機上的檔案系統的任何系統級加密的補充。

本頁展示如何啓用和設定靜態 API 資料加密。

{{< note >}}
<!--
This task covers encryption for resource data stored using the
{{< glossary_tooltip text="Kubernetes API" term_id="kubernetes-api" >}}. For example, you can
encrypt Secret objects, including the key-value data they contain.
-->
此任務涵蓋使用 {{< glossary_tooltip text="Kubernetes API" term_id="kubernetes-api" >}}
儲存的資源資料的加密。
例如，你可以加密 Secret 對象，包括它們包含的鍵值資料。

<!--
If you want to encrypt data in filesystems that are mounted into containers, you instead need
to either:

- use a storage integration that provides encrypted
  {{< glossary_tooltip text="volumes" term_id="volume" >}}
- encrypt the data within your own application
-->
如果要加密安裝到容器中的檔案系統中的資料，則需要：

- 使用提供加密 {{< glossary_tooltip text="volumes" term_id="volume" >}} 的儲存集成
- 在你自己的應用程式中加密資料

{{< /note >}}

## {{% heading "prerequisites" %}}

* {{< include "task-tutorial-prereqs.md" >}}

<!--
* This task assumes that you are running the Kubernetes API server as a
  {{< glossary_tooltip text="static pod" term_id="static-pod" >}} on each control
  plane node.

* Your cluster's control plane **must** use etcd v3.x (major version 3, any minor version).
-->
* 此任務假設你將 Kubernetes API 伺服器組件以{{< glossary_tooltip text="靜態 Pod" term_id="static-pod" >}}
  方式運行在每個控制平面節點上。

* 叢集的控制平面**必須**使用 etcd v3.x（主版本 3，任何次要版本）。

<!--
* To encrypt a custom resource, your cluster must be running Kubernetes v1.26 or newer.

* To use a wildcard to match resources, your cluster must be running Kubernetes v1.27 or newer.
-->
* 要加密自定義資源，你的叢集必須運行 Kubernetes v1.26 或更高版本。

* 在 Kubernetes v1.27 或更高版本中可以使用通配符匹配資源。

{{< version-check >}}

<!-- steps -->

<!--
## Determine whether encryption at rest is already enabled {#determining-whether-encryption-at-rest-is-already-enabled}

By default, the API server stores plain-text representations of resources into etcd, with
no at-rest encryption.
-->
## 確定是否已啓用靜態資料加密   {#determining-whether-encryption-at-rest-is-already-enabled}

預設情況下，API 伺服器將資源的明文表示儲存在 etcd 中，沒有靜態加密。

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
`kube-apiserver` 進程使用 `--encryption-provider-config` 參數指定設定檔案的路徑，
所指定的設定檔案的內容將控制 Kubernetes API 資料在 etcd 中的加密方式。
如果你在運行 kube-apiserver 時沒有使用 `--encryption-provider-config` 命令列參數，
則你未啓用靜態加密。如果你在運行 kube-apiserver 時使用了 `--encryption-provider-config`
命令列參數，並且此參數所引用的檔案指定 `identity` 提供程式作爲加密提供程式列表中的第一個，
則你未啓用靜態加密（**預設的 `identity` 提供程式不提供任何機密性保護**）。

<!--
If you are running the kube-apiserver
with the `--encryption-provider-config` command line argument, and the file that it references
specifies a provider other than `identity` as the first encryption provider in the list, then
you already have at-rest encryption enabled. However, that check does not tell you whether
a previous migration to encrypted storage has succeeded. If you are not sure, see
[ensure all relevant data are encrypted](#ensure-all-secrets-are-encrypted).
-->
如果你在運行 kube-apiserver 時使用了 `--encryption-provider-config` 命令列參數，
並且此參數所引用的檔案指定一個不是 `identity` 的提供程式作爲加密提供程式列表中的第一個，
則你已啓用靜態加密。然而此項檢查並未告知你先前向加密儲存的遷移是否成功。如果你不確定，
請參閱[確保所有相關資料都已加密](#ensure-all-secrets-are-encrypted)。

{{< caution >}}
<!--
**IMPORTANT:** For high-availability configurations (with two or more control plane nodes), the
encryption configuration file must be the same! Otherwise, the `kube-apiserver` component cannot
decrypt data stored in the etcd.
-->
**重要：** 對於高可用設定（有兩個或多個控制平面節點），加密設定檔案必須相同！
否則，`kube-apiserver` 組件無法解密儲存在 etcd 中的資料。
{{< /caution >}}

<!--
## Understanding the encryption at rest configuration
-->
## 理解靜態資料加密    {#understanding-the-encryption-at-rest-configuration}

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
# 注意：這是一個示例設定。請勿將其用於你自己的叢集！
#
apiVersion: apiserver.config.k8s.io/v1
kind: EncryptionConfiguration
resources:
  - resources:
      - secrets
      - configmaps
      - pandas.awesome.bears.example # 自定義資源 API
    providers:
      # 此設定不提供資料機密性。
      # 第一個設定的 provider 正在指定將資源儲存爲純文本的 "identity" 機制。
      - identity: {} # 純文本，換言之未加密
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
      - identity: {} # 即使如下指定 *.* 也不會加密 events
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
每個 `resources` 數組項目是一個單獨的完整的設定。
`resources.resources` 字段是應加密的 Kubernetes 資源（例如 Secret、ConfigMap 或其他資源）名稱
（`resource` 或 `resource.group`）的數組。

如果自定義資源被添加到 `EncryptionConfiguration` 並且叢集版本爲 1.26 或更高版本，
則 `EncryptionConfiguration` 中提到的任何新創建的自定義資源都將被加密。
在該版本之前存在於 etcd 中的任何自定義資源和設定不會被加密，直到它們被下一次寫入到儲存爲止。
這與內置資源的行爲相同。請參閱[確保所有 Secret 都已加密](#ensure-all-secrets-are-encrypted)一節。

`providers` 數組是可能的加密提供程式的有序列表，用於你所列出的 API。
每個提供程式支持多個密鑰 - 解密時會按順序嘗試這些密鑰，
如果這是第一個提供程式，其第一個密鑰將被用於加密。

<!--
Only one provider type may be specified per entry (`identity` or `aescbc` may be provided,
but not both in the same item).
The first provider in the list is used to encrypt resources written into the storage. When reading
resources from storage, each provider that matches the stored data attempts in order to decrypt the
data. If no provider can read the stored data due to a mismatch in format or secret key, an error
is returned which prevents clients from accessing that resource.
-->
每個條目只能指定一個提供程式類型（可以是 `identity` 或 `aescbc`，但不能在同一個項目中同時指定二者）。
列表中的第一個提供程式用於加密寫入儲存的資源。
當從儲存器讀取資源時，與儲存的資料匹配的所有提供程式將按順序嘗試解密資料。
如果由於格式或密鑰不匹配而導致沒有提供程式能夠讀取儲存的資料，則會返回一個錯誤，以防止客戶端訪問該資源。

<!--
`EncryptionConfiguration` supports the use of wildcards to specify the resources that should be encrypted.
Use '`*.<group>`' to encrypt all resources within a group (for eg '`*.apps`' in above example) or '`*.*`'
to encrypt all resources. '`*.`' can be used to encrypt all resource in the core group. '`*.*`' will
encrypt all resources, even custom resources that are added after API server start.
-->
`EncryptionConfiguration` 支持使用通配符指定應加密的資源。
使用 “`*.<group>`” 加密 group 內的所有資源（例如以上例子中的 “`*.apps`”）或使用
“`*.*`” 加密所有資源。“`*.`” 可用於加密核心組中的所有資源。“`*.*`”
將加密所有資源，甚至包括 API 伺服器啓動之後添加的自定義資源。

{{< note >}}
<!--
Use of wildcards that overlap within the same resource list or across multiple entries are not allowed
since part of the configuration would be ineffective. The `resources` list's processing order and precedence
are determined by the order it's listed in the configuration.
-->
不允許在同一資源列表或跨多個條目中使用相互重疊的通配符，因爲這樣一來設定的一部分將無法生效。
`resources` 列表的處理順序和優先級由設定中列出的順序決定。
{{< /note >}}

<!--
If you have a wildcard covering resources and want to opt out of at-rest encryption for a particular kind
of resource, you achieve that by adding a separate `resources` array item with the name of the resource that
you want to exempt, followed by a `providers` array item where you specify the `identity` provider. You add
this item to the list so that it appears earlier than the configuration where you do specify encryption
(a provider that is not `identity`).
-->
如果你有一個涵蓋資源（resource）的通配符，並且想要過濾掉靜態加密的特定類型資源，
則可以通過添加一個單獨的 `resources` 數組項來實現此目的，
其中包含要豁免的資源的名稱，還可以在其後跟一個 `providers` 數組項來指定 `identity` 提供商。
你可以將此數組項添加到列表中，以便它早於你指定加密的設定（不是 `identity` 的提供商）出現。

<!--
For example, if '`*.*`' is enabled and you want to opt out of encryption for Events and ConfigMaps, add a
new **earlier** item to the `resources`, followed by the providers array item with `identity` as the
provider. The more specific entry must come before the wildcard entry.

The new item would look similar to:
-->
例如，如果啓用了 '`*.*`'，並且你想要選擇不加密 Event 和 ConfigMap，
請在 `resources` 中**靠前**的位置添加一個新的條目，後跟帶有 `identity`
的 providers 數組項作爲提供程式。較爲特定的條目必須位於通配符條目之前。

新項目看起來類似於：

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
      - configmaps. # 特定於來自核心 API 組的資源，因爲結尾是 “.”
      - events
    providers:
      - identity: {}
  # 然後是資源中的其他條目
```

<!--
Ensure that the new item is listed _before_ the wildcard '`*.*`' item in the resources array
to give it precedence.
-->
確保新項列在資源數組中的通配符 “`*.*`” 項**之前**，使新項優先。

<!--
For more detailed information about the `EncryptionConfiguration` struct, please refer to the
[encryption configuration API](/docs/reference/config-api/apiserver-config.v1/)).
-->
有關 `EncryptionConfiguration` 結構體的更多詳細資訊，
請參閱[加密設定 API](/zh-cn/docs/reference/config-api/apiserver-config.v1/)。

{{< caution >}}
<!--
If any resource is not readable via the encryption config (because keys were changed),
the only recourse is to delete that key from the underlying etcd directly. Calls that attempt to
read that resource will fail until it is deleted or a valid decryption key is provided.
-->
如果通過加密設定無法讀取資源（因爲密鑰已更改），唯一的方法是直接從底層 etcd 中刪除該密鑰。
任何嘗試讀取資源的調用將會失敗，直到它被刪除或提供有效的解密密鑰。
{{< /caution >}}

<!--
### Available providers {#providers}

Before you configure encryption-at-rest for data in your cluster's Kubernetes API, you
need to select which provider(s) you will use.

The following table describes each available provider.
-->
### 可用的提供程式   {#providers}

在爲叢集的 Kubernetes API 資料設定靜態加密之前，你需要選擇要使用的提供程式。

下表描述了每個可用的提供程式：

<table class="complex-layout">
<caption style="display: none;">
<!--
Providers for Kubernetes encryption at rest
-->
Kubernetes 靜態資料加密的提供程式
</caption>
<thead>
  <tr>
  <th><!-- Name -->名稱</th>
  <th><!-- Encryption -->加密類型</th>
  <th><!-- Strength -->強度</th>
  <th><!-- Speed -->速度</th>
  <th><!-- Key length -->密鑰長度</th>
  </tr>
</thead>
<tbody id="encryption-providers-identity">
  <!-- list identity first, even when the remaining rows are sorted alphabetically -->
  <tr>
  <th rowspan="2" scope="row"><tt>identity</tt></th>
  <td><strong><!-- None -->無</strong></td>
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
  不加密寫入的資源。當設置爲第一個提供程式時，已加密的資源將在新值寫入時被解密。
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
  帶有 <a href="https://datatracker.ietf.org/doc/html/rfc2315">PKCS#7</a> 填充的 AES-CBC
  </td>
  <td><!-- Weak -->弱</td>
  <td><!-- Fast -->快</td>
  <td><!-- 32-byte -->32 字節</td>
  <td><!-- 16, 24, or 32-byte -->16、24 或 32 字節</td>
  </tr>
  <tr>
  <td colspan="4">
  <!--
  Not recommended due to CBC's vulnerability to padding oracle attacks. Key material accessible from control plane host.
  -->
  由於 CBC 容易受到密文填塞攻擊（Padding Oracle Attack），不推薦使用。密鑰材料可從控制面主機訪問。
  </td>
  </tr>
  <tr>
  <th rowspan="2" scope="row"><tt>aesgcm</tt></th>
  <td>
  <!--
  AES-GCM with random nonce
  -->
  帶有隨機數的 AES-GCM
  </td>
  <td>
  <!--
  Must be rotated every 200,000 writes
  -->
  每寫入 200k 次後必須輪換
  </td>
  <td><!-- Fastest -->最快</td>
  <td><!-- 16, 24, or 32-byte -->16、24 或者 32 字節</td>
  </tr>
  <tr>
  <td colspan="4">
  <!--
  Not recommended for use except when an automated key rotation scheme is implemented. Key material accessible from control plane host.
  -->
  不建議使用，除非實施了自動密鑰輪換方案。密鑰材料可從控制面主機訪問。
  </td>
  </tr>
  <tr>
  <th rowspan="2" scope="row"><tt>kms</tt> v1 <em><!--(deprecated since Kubernetes v1.28)-->（自 Kubernetes 1.28 起棄用）</em></th>
  <td>
  <!--
  Uses envelope encryption scheme with DEK per resource.
  -->
  針對每個資源使用不同的 DEK 來完成信封加密。
  </td>
  <td><!-- Strongest -->最強</td>
  <td><!-- Slow (<em>compared to <tt>kms</tt> version 2</em>) -->慢（<em>與 <tt>kms</tt> V2 相比</em>）</td>
  <td><!-- 32-bytes -->32 字節</td>
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
    通過資料加密密鑰（DEK）使用 AES-GCM 加密資料；
    DEK 根據 Key Management Service（KMS）中的設定通過密鑰加密密鑰（Key Encryption Keys，KEK）加密。
    密鑰輪換方式簡單，每次加密都會生成一個新的 DEK，KEK 的輪換由使用者控制。
    <br />
    <!--
    Read how to <a href="/docs/tasks/administer-cluster/kms-provider#configuring-the-kms-provider-kms-v1">configure the KMS V1 provider</a>.
    -->
    閱讀如何<a href="/zh-cn/docs/tasks/administer-cluster/kms-provider#configuring-the-kms-provider-kms-v1">設定 KMS V1 提供程式</a>
    </td>
  </tr>
  <tr>
  <th rowspan="2" scope="row"><tt>kms</tt> v2 </th>
  <td>
  <!--
  Uses envelope encryption scheme with DEK per API server.
  -->
  針對每個 API 伺服器使用不同的 DEK 來完成信封加密。
  </td>
  <td><!-- Strongest -->最強</td>
  <td><!-- Fast -->快</td>
  <td><!-- 32-bytes -->32 字節</td>
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
    通過資料加密密鑰（DEK）使用 AES-GCM 加密資料；
    DEK 根據 Key Management Service（KMS）中的設定通過密鑰加密密鑰（Key Encryption Keys，KEK）加密。
    Kubernetes 基於祕密的種子數爲每次加密生成一個新的 DEK。
    每當 KEK 輪換時，種子也會輪換。
    如果使用第三方工具進行密鑰管理，這是一個不錯的選擇。
    從 `v1.29` 開始，該功能處於穩定階段。
    <br />
    <!--
    Read how to <a href="/docs/tasks/administer-cluster/kms-provider#configuring-the-kms-provider-kms-v2">configure the KMS V2 provider</a>.
    -->
    閱讀如何<a href="/zh-cn/docs/tasks/administer-cluster/kms-provider#configuring-the-kms-provider-kms-v2">設定 KMS V2 提供程式</a>。
    </td>
  </tr>
  <tr>
  <th rowspan="2" scope="row"><tt>secretbox</tt></th>
  <td><!-- XSalsa20 and Poly1305 -->XSalsa20 和 Poly1305</td>
  <td><!-- Strong -->強</td>
  <td><!-- Faster -->更快</td>
  <td><!-- 32-byte -->32 字節</td>
  </tr>
  <tr>
  <td colspan="4">
  <!--
  Uses relatively new encryption technologies that may not be considered acceptable in environments that require high levels of review. Key material accessible from control plane host.
  -->
  使用相對較新的加密技術，在需要高度評審的環境中可能不被接受。密鑰材料可從控制面主機訪問。
  </td>
  </tr>
</tbody>
</table>

<!--
The `identity` provider is the default if you do not specify otherwise. **The `identity` provider does not
encrypt stored data and provides _no_ additional confidentiality protection.**
-->
如果你沒有另外指定，`identity` 提供程式將作爲預設選項。
**`identity` 提供程式不會加密儲存的資料，並且提供無附加的機密保護。**

<!--
### Key storage

#### Local key storage

Encrypting secret data with a locally managed key protects against an etcd compromise, but it fails to
protect against a host compromise. Since the encryption keys are stored on the host in the
EncryptionConfiguration YAML file, a skilled attacker can access that file and extract the encryption
keys.
-->
### 密鑰儲存   {#key-storage}

#### 本地密鑰儲存    {#local-key-storage}

使用本地管理的密鑰對 Secret 資料進行加密可以防止 etcd 受到威脅，但無法防範主機受到威脅的情況。
由於加密密鑰被儲存在主機上的 EncryptionConfiguration YAML 檔案中，有經驗的攻擊者可以訪問該檔案並提取加密密鑰。

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
#### 託管的（KMS）密鑰儲存   {#kms-key-storage}

KMS 提供程式使用**封套加密**：Kubernetes 使用一個資料密鑰來加密資源，然後使用託管的加密服務來加密該資料密鑰。
Kubernetes 爲每個資源生成唯一的資料密鑰。API 伺服器將資料密鑰的加密版本與密文一起儲存在 etcd 中；
API 伺服器在讀取資源時，調用託管的加密服務並提供密文和（加密的）資料密鑰。
在託管的加密服務中，提供程式使用**密鑰加密密鑰**來解密資料密鑰，解密資料密鑰後恢復爲明文。
在控制平面和 KMS 之間的通信需要在傳輸過程中提供 TLS 這類保護。

<!--
Using envelope encryption creates dependence on the key encryption key, which is not stored in Kubernetes.
In the KMS case, an attacker who intends to get unauthorised access to the plaintext
values would need to compromise etcd **and** the third-party KMS provider.
-->
使用封套加密會依賴於密鑰加密密鑰，此密鑰不儲存在 Kubernetes 中。
就 KMS 而言，如果攻擊者意圖未經授權地訪問明文值，則需要同時入侵 etcd
**和**第三方 KMS 提供程式。

<!--
### Protection for encryption keys

You should take appropriate measures to protect the confidential information that allows decryption,
whether that is a local encryption key, or an authentication token that allows the API server to
call KMS.
-->
### 保護加密密鑰   {#protection-for-encryption-keys}

你應該採取適當的措施來保護允許解密的機密資訊，無論是本地加密密鑰還是允許
API 伺服器調用 KMS 的身份驗證令牌。

<!--
Even when you rely on a provider to manage the use and lifecycle of the main encryption key (or keys), you are still responsible
for making sure that access controls and other security measures for the managed encryption service are
appropriate for your security needs.
-->
即使你依賴提供商來管理主加密密鑰（或多個密鑰）的使用和生命週期，
你仍然有責任確保託管加密服務的訪問控制和其他安全措施滿足你的安全需求。

<!--
## Encrypt your data {#encrypting-your-data}

### Generate the encryption key {#generate-key-no-kms}
-->
## 加密你的資料  {#encrypting-your-data}

### 生成加密密鑰  {#generate-key-no-kms}

<!--
The following steps assume that you are not using KMS, and therefore the steps also
assume that you need to generate an encryption key. If you already have an encryption key,
skip to [Write an encryption configuration file](#write-an-encryption-configuration-file).
-->
以下步驟假設你沒有使用 KMS，因此這些步驟還假設你需要生成加密密鑰。
如果你已有加密密鑰，請跳至[編寫加密設定檔案](#write-an-encryption-configuration-file)。

{{< caution >}}
<!--
Storing the raw encryption key in the EncryptionConfig only moderately improves your security posture,
compared to no encryption.
-->
與不加密相比，將原始加密密鑰儲存在 EncryptionConfig 中只能適度改善你的安全狀況。

<!--
For additional secrecy, consider using the `kms` provider as this relies on keys held outside your
Kubernetes cluster. Implementations of `kms` can work with hardware security modules or with
encryption services managed by your cloud provider.
-->
爲了獲得額外的保密性，請考慮使用 `kms` 提供程式，因爲這依賴於 Kubernetes
叢集外部保存的密鑰。`kms` 的實現可以與硬件安全模塊或由雲提供商管理的加密服務配合使用。

<!--
To learn about setting
up encryption at rest using KMS, see
[Using a KMS provider for data encryption](/docs/tasks/administer-cluster/kms-provider/).
The KMS provider plugin that you use may also come with additional specific documentation.
-->
要了解如何使用 KMS 設置靜態加密，請參閱[使用 KMS 提供程式進行資料加密](/zh-cn/docs/tasks/administer-cluster/kms-provider/)。
你使用的 KMS 提供程式插件可能還附帶其他特定文檔。
{{< /caution >}}

<!--
Start by generating a new encryption key, and then encode it using base64:
-->
首先生成新的加密密鑰，然後使用 base64 對其進行編碼：

{{< tabs name="generate_encryption_key" >}}
{{% tab name="Linux" %}}
<!--
Generate a 32-byte random key and base64 encode it. You can use this command:
-->
生成 32 字節隨機密鑰並對其進行 base64 編碼。你可以使用這個命令：

```shell
head -c 32 /dev/urandom | base64
```

<!--
You can use `/dev/hwrng` instead of `/dev/urandom` if you want to
use your PC's built-in hardware entropy source. Not all Linux
devices provide a hardware random generator.
-->
如果你想使用 PC 的內置硬件熵源，可以使用 `/dev/hwrng` 而不是 `/dev/urandom`。
並非所有 Linux 設備都提供硬件隨機數生成器。
{{% /tab %}}
{{% tab name="macOS" %}}
<!-- localization note: this is similar to the Linux tab and the wording
should match wherever the English text does -->
<!--
Generate a 32-byte random key and base64 encode it. You can use this command:
-->
生成 32 字節隨機密鑰並對其進行 base64 編碼。你可以使用此命令：

```shell
head -c 32 /dev/urandom | base64
```
{{% /tab %}}
{{% tab name="Windows" %}}
<!--
Generate a 32-byte random key and base64 encode it. You can use this command:
-->
生成 32 字節隨機密鑰並對其進行 base64 編碼。你可以使用此命令：

<!--
# Do not run this in a session where you have set a random number
# generator seed.
-->
```powershell
# 不要在已設置隨機數生成器種子的會話中運行此命令。
[Convert]::ToBase64String((1..32|%{[byte](Get-Random -Max 256)}))
```
{{% /tab %}}
{{< /tabs >}}


{{< note >}}
<!--
Keep the encryption key confidential, including while you generate it and
ideally even after you are no longer actively using it.
-->
保持加密密鑰的機密性，包括在生成密鑰時，甚至理想的情況下在你不再主動使用密鑰後也要保密。
{{< /note >}}

<!--
### Replicate the encryption key

Using a secure mechanism for file transfer, make a copy of that encryption key
available to every other control plane host.

At a minimum, use encryption in transit - for example, secure shell (SSH). For more
security, use asymmetric encryption between hosts, or change the approach you are using
so that you're relying on KMS encryption.
-->
### 複製加密密鑰

使用安全的檔案傳輸機制，將該加密密鑰的副本提供給所有其他控制平面主機。

至少，使用傳輸加密 - 例如，安全 shell（SSH）。爲了提高安全性，
請在主機之間使用非對稱加密，或更改你正在使用的方法，以便依賴 KMS 加密。

<!--
## Write an encryption configuration file
-->
## 編輯加密設定檔案   {#write-an-encryption-configuration-file}

{{< caution >}}
<!--
The encryption configuration file may contain keys that can decrypt content in etcd.
If the configuration file contains any key material, you must properly
restrict permissions on all your control plane hosts so only the user
who runs the kube-apiserver can read this configuration.
-->
加密設定檔案可能包含可以解密 etcd 中內容的密鑰。
如果此設定檔案包含任何密鑰資訊，你必須在所有控制平面主機上合理限制權限，
以便只有運行 kube-apiserver 的使用者可以讀取此設定。
{{< /caution >}}

<!--
Create a new encryption configuration file. The contents should be similar to:
-->
創建一個新的加密設定檔案。其內容應類似於：

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
              # 參見以下文本瞭解有關 Secret 值的詳情
              secret: <BASE 64 ENCODED SECRET>
      - identity: {} # 這個回退允許讀取未加密的 Secret；
                     # 例如，在初始遷移期間
```

<!--
To create a new encryption key (that does not use KMS), see
[Generate the encryption key](#generate-key-no-kms).
-->
要創建新的加密密鑰（不使用 KMS），請參閱[生成加密密鑰](#generate-key-no-kms)。

<!--
### Use the new encryption configuration file
-->
### 使用新的加密設定檔案

<!--
You will need to mount the new encryption config file to the `kube-apiserver` static pod. Here is an example on how to do that:
-->
你將需要把新的加密設定檔案掛載到 `kube-apiserver` 靜態 Pod。以下是這個操作的示例：

<!--
1. Save the new encryption config file to `/etc/kubernetes/enc/enc.yaml` on the control-plane node.
1. Edit the manifest for the `kube-apiserver` static pod: `/etc/kubernetes/manifests/kube-apiserver.yaml` similarly to this:
-->
1. 將新的加密設定檔案保存到控制平面節點上的 `/etc/kubernetes/enc/enc.yaml`。
2. 編輯 `kube-apiserver` 靜態 Pod 的清單：`/etc/kubernetes/manifests/kube-apiserver.yaml`，
   代碼範例如下：

   <!--
   # This is a fragment of a manifest for a static Pod.
   # Check whether this is correct for your cluster and for your API server.
   # add this line
   -->
   ```yaml
   ---
   #
   # 這是一個靜態 Pod 的清單片段。
   # 檢查是否適用於你的集羣和 API 伺服器。
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
       - --encryption-provider-config=/etc/kubernetes/enc/enc.yaml  # 增加這一行
       volumeMounts:
       ...
       - name: enc                           # 增加這一行
         mountPath: /etc/kubernetes/enc      # 增加這一行
         readOnly: true                      # 增加這一行
       ...
     volumes:
     ...
     - name: enc                             # 增加這一行
       hostPath:                             # 增加這一行
         path: /etc/kubernetes/enc           # 增加這一行
         type: DirectoryOrCreate             # 增加這一行
     ...
   ```

<!--
1. Restart your API server.
-->
4. 重啓你的 API 伺服器。

{{< caution >}}
<!--
Your config file contains keys that can decrypt the contents in etcd, so you must properly restrict
permissions on your control-plane nodes so only the user who runs the `kube-apiserver` can read it.
-->
你的設定檔案包含可以解密 etcd 內容的密鑰，因此你必須正確限制控制平面節點的訪問權限，
以便只有能運行 `kube-apiserver` 的使用者才能讀取它。
{{< /caution >}}

<!--
You now have encryption in place for **one** control plane host. A typical
Kubernetes cluster has multiple control plane hosts, so there is more to do.
-->
你現在已經爲**一個**控制平面主機進行了加密。典型的 Kubernetes
叢集有多個控制平面主機，因此需要做的事情更多。

<!--
### Reconfigure other control plane hosts {#api-server-config-update-more}

If you have multiple API servers in your cluster, you should deploy the
changes in turn to each API server.
-->
### 重新設定其他控制平面主機   {#api-server-config-update-more}

如果你的叢集中有多個 API 伺服器，應輪流將更改部署到每個 API 伺服器。

{{< caution >}}
<!--
For cluster configurations with two or more control plane nodes, the encryption configuration
should be identical across each control plane node.

If there is a difference in the encryption provider configuration between control plane
nodes, this difference may mean that the kube-apiserver can't decrypt data.
-->
對於具有兩個或更多控制平面節點的叢集設定，每個控制平面節點的加密設定應該是相同的。

如果控制平面節點間的加密驅動設定不一致，這種差異可能導致 kube-apiserver 無法解密資料。
{{< /caution >}}

<!--
When you are planning to update the encryption configuration of your cluster, plan this
so that the API servers in your control plane can always decrypt the stored data
(even part way through rolling out the change).

Make sure that you use the **same** encryption configuration on each
control plane host.
-->
你在計劃更新叢集的加密設定時，請確保控制平面中的 API 伺服器在任何時候都能解密儲存的資料（即使是在更改逐步實施的過程中也是如此）。

確保在每個控制平面主機上使用**相同的**加密設定。

<!--
### Verify that newly written data is encrypted {#verifying-that-data-is-encrypted}

Data is encrypted when written to etcd. After restarting your `kube-apiserver`, any newly
created or updated Secret (or other resource kinds configured in `EncryptionConfiguration`)
should be encrypted when stored.

To check this, you can use the `etcdctl` command line
program to retrieve the contents of your secret data.

This example shows how to check this for encrypting the Secret API.
-->
### 驗證資料已被加密   {#verifying-that-data-is-encryped}

資料在寫入 etcd 時會被加密。重新啓動你的 `kube-apiserver` 後，任何新創建或更新的 Secret
或在 `EncryptionConfiguration` 中設定的其他資源類別都應在儲存時被加密。

如果想要檢查，你可以使用 `etcdctl` 命令列程式來檢索你的 Secret 資料內容。

以下示例演示瞭如何對加密 Secret API 進行檢查。

<!--
1. Create a new Secret called `secret1` in the `default` namespace:
-->
1. 創建一個新的 Secret，名稱爲 `secret1`，命名空間爲 `default`：

   ```shell
   kubectl create secret generic secret1 -n default --from-literal=mykey=mydata
   ```

<!--
1. Using the `etcdctl` command line tool, read that Secret out of etcd:
-->
2. 使用 `etcdctl` 命令列工具，從 etcd 中讀取 Secret：

   ```
   ETCDCTL_API=3 etcdctl get /registry/secrets/default/secret1 [...] | hexdump -C
   ```

   <!--
   where `[...]` must be the additional arguments for connecting to the etcd server.
   -->
   這裏的 `[...]` 是用來連接 etcd 服務的額外參數。

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
   輸出類似於（有刪減）：

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
3. 驗證儲存的密鑰前綴是否爲 `k8s:enc:aescbc:v1:`，這表明 `aescbc` provider 已加密結果資料。
   確認 `etcd` 中顯示的密鑰名稱和上述 `EncryptionConfiguration` 中指定的密鑰名稱一致。
   在此例中，你可以看到在 `etcd` 和 `EncryptionConfiguration` 中使用了名爲 `key1` 的加密密鑰。

4. 通過 API 檢索，驗證 Secret 是否被正確解密：

   ```shell
   kubectl get secret secret1 -n default -o yaml
   ```

   <!--
   The output should contain `mykey: bXlkYXRh`, with contents of `mydata` encoded using base64;
   read
   [decoding a Secret](/docs/tasks/configmap-secret/managing-secret-using-kubectl/#decoding-secret)
   to learn how to completely decode the Secret.
   -->
   其輸出應該包含 `mykey: bXlkYXRh`，其中 `mydata` 的內容使用 base64 進行加密，
   請參閱[解密 Secret](/zh-cn/docs/tasks/configmap-secret/managing-secret-using-kubectl/#decoding-secret)
   瞭解如何完全解碼 Secret 內容。

<!--
### Ensure all relevant data are encrypted {#ensure-all-secrets-are-encrypted}

It's often not enough to make sure that new objects get encrypted: you also want that
encryption to apply to the objects that are already stored.

For this example, you have configured your cluster so that Secrets are encrypted on write.
Performing a replace operation for each Secret will encrypt that content at rest,
where the objects are unchanged.

You can make this change across all Secrets in your cluster:
-->
### 確保所有相關資料都被加密   {#ensure-all-secrets-are-encrypted}

僅僅確保新對象被加密通常是不夠的：你還希望對已經儲存的對象進行加密。

例如，你已經設定了叢集，使得 Secret 在寫入時進行加密。
爲每個 Secret 執行替換操作將加密那些對象保持不變的靜態內容。

你可以在叢集中的所有 Secret 上進行此項變更：

<!--
# Run this as an administrator that can read and write all Secrets
-->
```shell
# 以能夠讀寫所有 Secret 的管理員身份運行此命令
kubectl get secrets --all-namespaces -o json | kubectl replace -f -
```

<!--
The command above reads all Secrets and then updates them with the same data, in order to
apply server side encryption.
-->
上面的命令讀取所有 Secret，然後使用相同的資料更新這些 Secret，以便應用服務端加密。

{{< note >}}
<!--
If an error occurs due to a conflicting write, retry the command.
It is safe to run that command more than once.

For larger clusters, you may wish to subdivide the Secrets by namespace,
or script an update.
-->
如果由於衝突寫入而發生錯誤，請重試該命令。
多次運行此命令是安全的。

對於較大的叢集，你可能希望通過命名空間或更新腳本來對 Secret 進行劃分。
{{< /note >}}

<!--
## Prevent plain text retrieval {#cleanup-all-secrets-encrypted}

If you want to make sure that the only access to a particular API kind is done using
encryption, you can remove the API server's ability to read that API's backing data
as plaintext.
-->
## 防止純文本檢索   {#cleanup-all-secrets-encrypted}

如果你想確保對特定 API 類型的唯一訪問是使用加密完成的，你可以移除
API 伺服器以明文形式讀取該 API 的支持資料的能力。

{{< warning >}}
<!--
Making this change prevents the API server from retrieving resources that are marked
as encrypted at rest, but are actually stored in the clear.

When you have configured encryption at rest for an API (for example: the API kind
`Secret`, representing `secrets` resources in the core API group), you **must** ensure
that all those resources in this cluster really are encrypted at rest. Check this before
you carry on with the next steps.
-->
此更改可防止 API 伺服器檢索標記爲靜態加密但實際上以明文形式儲存的資源。

當你爲某個 API 設定靜態加密時（例如：API 種類 `Secret`，代表核心 API 組中的 `secrets` 資源），
你**必須**確保該叢集中的所有這些資源確實被靜態加密，
在後續步驟開始之前請檢查此項。
{{< /warning >}}

<!--
Once all Secrets in your cluster are encrypted, you can remove the `identity`
part of the encryption configuration. For example:
-->
一旦叢集中的所有 Secret 都被加密，你就可以刪除加密設定中的 `identity` 部分。例如：

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
      - identity: {} # 刪除此行
{{< /highlight >}}

<!--
…and then restart each API server in turn. This change prevents the API server
from accessing a plain-text Secret, even by accident.
-->
…然後依次重新啓動每個 API 伺服器。此更改可防止 API 伺服器訪問純文本 Secret，即使是意外訪問也是如此。

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
## 輪換解密密鑰   {#rotating-a-decryption-key}

在不發生停機的情況下更改 Kubernetes 的加密密鑰需要多步操作，特別是在有多個 `kube-apiserver`
進程正在運行的高可用環境中。

1. 生成一個新密鑰並將其添加爲所有控制平面節點上當前提供程式的第二個密鑰條目
1. 重新啓動所有 `kube-apiserver` 進程以確保每臺伺服器都可以使用新密鑰加密任何資料
1. 對新的加密密鑰進行安全備份。如果你丟失了此密鑰的所有副本，則需要刪除用已丟失的密鑰加密的所有資源，
   並且在靜態加密被破壞期間，工作負載可能無法按預期運行。
1. 將新密鑰設置爲 `keys` 數組中的第一個條目，以便將其用於新編寫的靜態加密
1. 重新啓動所有 `kube-apiserver` 進程，以確保每個控制平面主機現在使用新密鑰進行加密
1. 作爲特權使用者，運行 `kubectl get secrets --all-namespaces -o json | kubectl replace -f -`
   以用新密鑰加密所有現有的 Secret
1. 將所有現有 Secret 更新爲使用新密鑰並對新密鑰進行安全備份後，從設定中刪除舊的解密密鑰。

<!--
## Decrypt all data {#decrypting-all-data}

This example shows how to stop encrypting the Secret API at rest. If you are encrypting
other API kinds, adjust the steps to match.

To disable encryption at rest, place the `identity` provider as the first
entry in your encryption configuration file:
-->
## 解密所有資料    {#decrypting-all-data}

此示例演示如何停止靜態加密 Secret API。如果你所加密的是其他 API 類型，請調整對應步驟來適配。

要禁用靜態加密，請將 `identity` 提供程式作爲加密設定檔案中的第一個條目：

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
      # 在此列出你之前靜態加密的任何其他資源
    providers:
      - identity: {} # 添加此行
      - aescbc:
          keys:
            - name: key1
              secret: <BASE 64 ENCODED SECRET> # 將其保留在適當的位置並確保它位於 "identity" 之後
```

<!--
Then run the following command to force decryption of all Secrets:
-->
然後運行以下命令以強制解密所有 Secret：

```shell
kubectl get secrets --all-namespaces -o json | kubectl replace -f -
```

<!--
Once you have replaced all existing encrypted resources with backing data that
don't use encryption, you can remove the encryption settings from the
`kube-apiserver`.
-->
將所有現有加密資源替換爲不使用加密的支持資料後，你可以從 `kube-apiserver`
中刪除加密設置。

<!--
## Configure automatic reloading
-->
## 設定自動重新加載   {#configure-automatic-reloading}

<!--
You can configure automatic reloading of encryption provider configuration.
That setting determines whether the
{{< glossary_tooltip text="API server" term_id="kube-apiserver" >}} should
load the file you specify for `--encryption-provider-config` only once at
startup, or automatically whenever you change that file. Enabling this option
allows you to change the keys for encryption at rest without restarting the
API server.
-->
你可以設定加密提供程式設定的自動重新加載。
該設置決定了 {{< glossary_tooltip text="API 伺服器" term_id="kube-apiserver" >}}
是僅在啓動時加載一次爲 `--encryption-provider-config` 指定的檔案，
還是在每次你更改該檔案時都自動加載。
啓用此選項可允許你在不重啓 API 伺服器的情況下更改靜態加密所需的密鑰。

<!--
To allow automatic reloading, configure the API server to run with:
`--encryption-provider-config-automatic-reload=true`.
When enabled, file changes are polled every minute to observe the modifications.
The `apiserver_encryption_config_controller_automatic_reload_last_timestamp_seconds`
metric identifies when the new config becomes effective. This allows
encryption keys to be rotated without restarting the API server.
-->
要允許自動重新加載，
可使用 `--encryption-provider-config-automatic-reload=true` 運行 API 伺服器。
該功能啓用後，每分鐘會輪詢檔案變化以監測修改情況。
`apiserver_encryption_config_controller_automatic_reload_last_timestamp_seconds` 指標用於標識新設定生效的時間。
這種設置可以在不重啓 API 伺服器的情況下輪換加密密鑰。

## {{% heading "whatsnext" %}}

<!--
* Read about [decrypting data that are already stored at rest](/docs/tasks/administer-cluster/decrypt-data/)
* Learn more about the [EncryptionConfiguration configuration API (v1)](/docs/reference/config-api/apiserver-config.v1/).
-->
* 進一步學習[解密已靜態加密的資料](/zh-cn/docs/tasks/administer-cluster/decrypt-data/)。
* 進一步學習 [EncryptionConfiguration 設定 API（v1）](/zh-cn/docs/reference/config-api/apiserver-config.v1/)。
