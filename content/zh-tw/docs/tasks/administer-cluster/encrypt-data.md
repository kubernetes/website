---
title: 靜態加密 Secret 資料
content_type: task
---

<!--
title: Encrypting Secret Data at Rest
reviewers:
- smarterclayton
content_type: task
-->

<!-- overview -->
<!--
This page shows how to enable and configure encryption of secret data at rest.
-->
本文展示如何啟用和配置靜態 Secret 資料的加密

## {{% heading "prerequisites" %}}

* {{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!--
* etcd v3.0 or later is required
-->
* 需要 etcd v3.0 或者更高版本

<!-- steps -->

<!--
## Configuration and determining whether encryption at rest is already enabled

The `kube-apiserver` process accepts an argument `--encryption-provider-config`
that controls how API data is encrypted in etcd.
The configuration is provided as an API named
[`EncryptionConfiguration`](/docs/reference/config-api/apiserver-encryption.v1/).
An example configuration is provided below.
-->
## 配置並確定是否已啟用靜態資料加密

`kube-apiserver` 的引數 `--encryption-provider-config` 控制 API 資料在 etcd 中的加密方式。
該配置作為一個名為 [`EncryptionConfiguration`](/zh-cn/docs/reference/config-api/apiserver-encryption.v1/) 的 API 提供。
下面提供了一個示例配置。

<!--
**IMPORTANT:** For high-availability configurations (with two or more control plane nodes), the
encryption configuration file must be the same! Otherwise, the `kube-apiserver` component cannot
decrypt data stored in the etcd.
-->
{{< caution >}}
**重要：** 對於高可用配置（有兩個或多個控制平面節點），加密配置檔案必須相同！
否則，`kube-apiserver` 元件無法解密儲存在 etcd 中的資料。
{{< /caution >}}

<!--
## Understanding the encryption at rest configuration.
-->
## 理解靜態資料加密

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
providers.

Only one provider type may be specified per entry (`identity` or `aescbc` may be provided,
but not both in the same item).
The first provider in the list is used to encrypt resources written into the storage. When reading
resources from storage, each provider that matches the stored data attempts in order to decrypt the
data. If no provider can read the stored data due to a mismatch in format or secret key, an error
is returned which prevents clients from accessing that resource.

For more detailed information about the `EncryptionConfiguration` struct, please refer to the
[encryption configuration API](/docs/reference/config-api/apiserver-encryption.v1/).
-->
每個 `resources` 陣列專案是一個單獨的完整的配置。
`resources.resources` 欄位是要加密的 Kubernetes 資源名稱（`resource` 或 `resource.group`）的陣列。
`providers` 陣列是可能的加密 provider 的有序列表。

每個條目只能指定一個 provider 型別（可以是 `identity` 或 `aescbc`，但不能在同一個專案中同時指定二者）。
列表中的第一個 provider 用於加密寫入儲存的資源。
當從儲存器讀取資源時，與儲存的資料匹配的所有 provider 將按順序嘗試解密資料。
如果由於格式或金鑰不匹配而導致沒有 provider 能夠讀取儲存的資料，則會返回一個錯誤，以防止客戶端訪問該資源。

有關 `EncryptionConfiguration` 結構體的更多詳細資訊，請參閱[加密配置 API](/zh-cn/docs/reference/config-api/apiserver-encryption.v1/)。

<!--
If any resource is not readable via the encryption config (because keys were changed),
the only recourse is to delete that key from the underlying etcd directly. Calls that attempt to
read that resource will fail until it is deleted or a valid decryption key is provided.
-->
{{< caution >}}
如果透過加密配置無法讀取資源（因為金鑰已更改），唯一的方法是直接從底層 etcd 中刪除該金鑰。
任何嘗試讀取資源的呼叫將會失敗，直到它被刪除或提供有效的解密金鑰。
{{< /caution >}}

### Providers:

<!--
Name | Encryption | Strength | Speed | Key Length | Other Considerations
-----|------------|----------|-------|------------|---------------------
`identity` | None | N/A | N/A | N/A | Resources written as-is without encryption. When set as the first provider, the resource will be decrypted as new values are written.
`secretbox` | XSalsa20 and Poly1305 | Strong | Faster | 32-byte | A newer standard and may not be considered acceptable in environments that require high levels of review.
`aesgcm` | AES-GCM with random nonce | Must be rotated every 200k writes | Fastest | 16, 24, or 32-byte | Is not recommended for use except when an automated key rotation scheme is implemented.
`aescbc` | AES-CBC with [PKCS#7](https://datatracker.ietf.org/doc/html/rfc2315) padding | Weak | Fast | 32-byte | Not recommended due to CBC's vulnerability to padding oracle attacks.
`kms` | Uses envelope encryption scheme: Data is encrypted by data encryption keys (DEKs) using AES-CBC with [PKCS#7](https://datatracker.ietf.org/doc/html/rfc2315) padding, DEKs are encrypted by key encryption keys (KEKs) according to configuration in Key Management Service (KMS) | Strongest | Fast | 32-bytes |  The recommended choice for using a third party tool for key management. Simplifies key rotation, with a new DEK generated for each encryption, and KEK rotation controlled by the user. [Configure the KMS provider](/docs/tasks/administer-cluster/kms-provider/)

Each provider supports multiple keys - the keys are tried in order for decryption, and if the provider
is the first provider, the first key is used for encryption.
-->
{{< table caption="Kubernetes 靜態資料加密的 Providers" >}}
名稱 | 加密型別   | 強度     | 速度  | 金鑰長度   | 其它事項
-----|------------|----------|-------|------------|---------------------
`identity` | 無 | N/A | N/A | N/A | 不加密寫入的資源。當設定為第一個 provider 時，資源將在新值寫入時被解密。
`secretbox` | XSalsa20 和 Poly1305 | 強 | 更快 | 32位元組 | 較新的標準，在需要高度評審的環境中可能不被接受。
`aesgcm` | 帶有隨機數的 AES-GCM | 必須每 200k 寫入一次 | 最快 | 16, 24 或者 32位元組 | 建議不要使用，除非實施了自動金鑰迴圈方案。
`aescbc` | 填充 [PKCS#7](https://datatracker.ietf.org/doc/html/rfc2315) 的 AES-CBC | 弱 | 快 | 32位元組 | 由於 CBC 容易受到密文填塞攻擊（Padding Oracle Attack），不推薦使用。
`kms` | 使用信封加密方案：資料使用帶有 [PKCS#7](https://datatracker.ietf.org/doc/html/rfc2315) 填充的 AES-CBC 透過資料加密金鑰（DEK）加密，DEK 根據 Key Management Service（KMS）中的配置透過金鑰加密金鑰（Key Encryption Keys，KEK）加密 | 最強 | 快 | 32位元組 | 建議使用第三方工具進行金鑰管理。為每個加密生成新的 DEK，並由使用者控制 KEK 輪換來簡化金鑰輪換。[配置 KMS 提供程式](/zh-cn/docs/tasks/administer-cluster/kms-provider/)

每個 provider 都支援多個金鑰 - 在解密時會按順序使用金鑰，如果是第一個 provider，則第一個金鑰用於加密。

<!--
Storing the raw encryption key in the EncryptionConfig only moderately improves your security
posture, compared to no encryption.  Please use `kms` provider for additional security.
-->
{{< caution >}}
在 EncryptionConfig 中儲存原始的加密金鑰與不加密相比只會略微地提升安全級別。
請使用 `kms` 驅動以獲得更強的安全性。
{{< /caution >}}

<!--
By default, the `identity` provider is used to protect Secrets in etcd, which provides no
encryption. `EncryptionConfiguration` was introduced to encrypt Secrets locally, with a locally
managed key.

Encrypting Secrets with a locally managed key protects against an etcd compromise, but it fails to
protect against a host compromise. Since the encryption keys are stored on the host in the
EncryptionConfiguration YAML file, a skilled attacker can access that file and extract the encryption
keys.

Envelope encryption creates dependence on a separate key, not stored in Kubernetes. In this case,
an attacker would need to compromise etcd, the `kubeapi-server`, and the third-party KMS provider to
retrieve the plaintext values, providing a higher level of security than locally stored encryption keys.
-->
預設情況下，`identity` 驅動被用來對 etcd 中的 Secret 提供保護，而這個驅動不提供加密能力。
`EncryptionConfiguration` 的引入是為了能夠使用本地管理的金鑰來在本地加密 Secret 資料。

使用本地管理的金鑰來加密 Secret 能夠保護資料免受 etcd 破壞的影響，不過無法針對
主機被侵入提供防護。
這是因為加密的金鑰儲存在主機上的 EncryptionConfig YAML 檔案中，有經驗的入侵者
仍能訪問該檔案並從中提取出加密金鑰。

封套加密（Envelope Encryption）引入了對獨立金鑰的依賴，而這個金鑰並不儲存在 Kubernetes 中。
在這種情況下，入侵者需要攻破 etcd、kube-apiserver 和第三方的 KMS
驅動才能獲得明文資料，因而這種方案提供了比本地儲存加密金鑰更高的安全級別。

<!--
## Encrypting your data

Create a new encryption config file:
-->
## 加密你的資料

建立一個新的加密配置檔案：

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
To create a new Secret, perform the following steps:

1. Generate a 32-byte random key and base64 encode it. If you're on Linux or macOS, run the following command:
-->
遵循如下步驟來建立一個新的 Secret：

1. 生成一個 32 位元組的隨機金鑰並進行 base64 編碼。如果你在 Linux 或 macOS 上，請執行以下命令：

   ```shell
   head -c 32 /dev/urandom | base64
   ```

<!--
1. Place that value in the `secret` field of the `EncryptionConfiguration` struct.
1. Set the `--encryption-provider-config` flag on the `kube-apiserver` to point to
   the location of the config file.
1. Restart your API server.
-->
2. 將這個值放入到 `EncryptionConfiguration` 結構體的 `secret` 欄位中。
3. 設定 `kube-apiserver` 的 `--encryption-provider-config` 引數，將其指向
   配置檔案所在位置。
4. 重啟你的 API server。

<!--
Your config file contains keys that can decrypt the contents in etcd, so you must properly restrict
permissions on your control-plane nodes so only the user who runs the `kube-apiserver` can read it.
-->
{{< caution >}}
你的配置檔案包含可以解密 etcd 內容的金鑰，因此你必須正確限制主控節點的訪問許可權，
以便只有能執行 kube-apiserver 的使用者才能讀取它。
{{< /caution >}}

<!--
## Verifying that data is encrypted

Data is encrypted when written to etcd. After restarting your `kube-apiserver`, any newly created or
updated Secret should be encrypted when stored. To check this, you can use the `etcdctl` command line
program to retrieve the contents of your Secret.

1. Create a new Secret called `secret1` in the `default` namespace:
-->
## 驗證資料已被加密

資料在寫入 etcd 時會被加密。重新啟動你的 `kube-apiserver` 後，任何新建立或更新的密碼在儲存時都應該被加密。
如果想要檢查，你可以使用 `etcdctl` 命令列程式來檢索你的加密內容。

1. 建立一個新的 secret，名稱為 `secret1`，名稱空間為 `default`：

   ```shell
   kubectl create secret generic secret1 -n default --from-literal=mykey=mydata
   ```

<!--
1. Using the `etcdctl` command line, read that Secret out of etcd:
-->
2. 使用 etcdctl 命令列，從 etcd 中讀取 Secret：
   ```shell
   ETCDCTL_API=3 etcdctl get /registry/secrets/default/secret1 [...] | hexdump -C
   ```

   <!--
   where `[...]` must be the additional arguments for connecting to the etcd server.
   -->
   這裡的 `[...]` 是用來連線 etcd 服務的額外引數。

<!--
1. Verify the stored Secret is prefixed with `k8s:enc:aescbc:v1:` which indicates
   the `aescbc` provider has encrypted the resulting data.

1. Verify the Secret is correctly decrypted when retrieved via the API:
-->
3. 驗證儲存的金鑰字首是否為 `k8s:enc:aescbc:v1:`，這表明 `aescbc` provider 已加密結果資料。

4. 透過 API 檢索，驗證 Secret 是否被正確解密：

   ```shell
   kubectl describe secret secret1 -n default
   ```

   <!--
   The output should contain `mykey: bXlkYXRh`, with contents of `mydata` encoded, check
   [decoding a Secret](/docs/tasks/configmap-secret/managing-secret-using-kubectl/#decoding-secret)
   to completely decode the Secret.
   -->
   其輸出應該包含 `mykey: bXlkYXRh`，`mydata` 的內容是被加密過的，
   請參閱[解密 Secret](/zh-cn/docs/tasks/configmap-secret/managing-secret-using-kubectl/#decoding-secret)
   瞭解如何完全解碼 Secret 內容。

<!--
## Ensure all Secrets are encrypted

Since Secrets are encrypted on write, performing an update on a Secret will encrypt that content.
-->
## 確保所有 Secret 都被加密

由於 Secret 是在寫入時被加密，因此對 Secret 執行更新也會加密該內容。

```shell
kubectl get secrets --all-namespaces -o json | kubectl replace -f -
```

<!--
The command above reads all Secrets and then updates them to apply server side encryption.
-->
上面的命令讀取所有 Secret，然後使用服務端加密來更新其內容。

<!--
If an error occurs due to a conflicting write, retry the command.
For larger clusters, you may wish to subdivide the secrets by namespace or script an update.
-->
{{< note >}}
如果由於衝突寫入而發生錯誤，請重試該命令。
對於較大的叢集，你可能希望透過名稱空間或更新指令碼來對 Secret 進行劃分。
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
## 輪換解密金鑰

在不發生停機的情況下更改 Secret 需要多步操作，特別是在有多個 `kube-apiserver` 程序正在執行的
高可用環境中。

1. 生成一個新金鑰並將其新增為所有伺服器上當前提供程式的第二個金鑰條目
1. 重新啟動所有 `kube-apiserver` 程序以確保每臺伺服器都可以使用新金鑰進行解密
1. 將新金鑰設定為 `keys` 陣列中的第一個條目，以便在配置中使用其進行加密
1. 重新啟動所有 `kube-apiserver` 程序以確保每個伺服器現在都使用新金鑰進行加密
1. 執行 `kubectl get secrets --all-namespaces -o json | kubectl replace -f -`
   以用新金鑰加密所有現有的 Secret
1. 在使用新金鑰備份 etcd 後，從配置中刪除舊的解密金鑰並更新所有金鑰

當只執行一個 `kube-apiserver` 例項時，第 2 步可能可以忽略。

<!--
## Decrypting all data

To disable encryption at rest, place the `identity` provider as the first entry in the config
and restart all `kube-apiserver` processes.
-->
## 解密所有資料

要禁用靜態加密，請將 `identity` provider
作為配置中的第一個條目並重新啟動所有 `kube-apiserver` 程序。

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
Then run the following command to force decrypt
all Secrets:
-->
然後執行以下命令以強制解密所有 Secret：

```shell
kubectl get secrets --all-namespaces -o json | kubectl replace -f -
```

## {{% heading "whatsnext" %}}

<!--
* Learn more about the [EncryptionConfiguration configuration API (v1)](/docs/reference/config-api/apiserver-encryption.v1/).
-->
進一步學習 [EncryptionConfiguration 配置 API (v1)](/zh-cn/docs/reference/config-api/apiserver-encryption.v1/)。
