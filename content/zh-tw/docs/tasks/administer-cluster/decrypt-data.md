---
title: 解密已靜態加密的機密數據
content_type: task
weight: 215
---
<!--
title: Decrypt Confidential Data that is Already Encrypted at Rest
content_type: task
weight: 215
-->

<!-- overview -->

<!--
All of the APIs in Kubernetes that let you write persistent API resource data support
at-rest encryption. For example, you can enable at-rest encryption for
{{< glossary_tooltip text="Secrets" term_id="secret" >}}.
This at-rest encryption is additional to any system-level encryption for the
etcd cluster or for the filesystem(s) on hosts where you are running the
kube-apiserver.
-->
Kubernetes 中允許允許你寫入持久性 API 資源數據的所有 API 都支持靜態加密。
例如，你可以爲 {{< glossary_tooltip text="Secret" term_id="secret" >}} 啓用靜態加密。
此靜態加密是對 etcd 集羣或運行 kube-apiserver 的主機上的文件系統的所有系統級加密的補充。

<!--
This page shows how to switch from encryption of API data at rest, so that API data
are stored unencrypted. You might want to do this to improve performance; usually,
though, if it was a good idea to encrypt some data, it's also a good idea to leave them
encrypted.
-->
本文介紹如何停止靜態加密 API 數據，以便 API 數據以未加密的形式存儲。
你可能希望這樣做以提高性能；但通常情況下，如果加密某些數據是個好主意，那麼繼續加密這些數據也是一個好主意。

{{< note >}}
<!--
This task covers encryption for resource data stored using the
{{< glossary_tooltip text="Kubernetes API" term_id="kubernetes-api" >}}. For example, you can
encrypt Secret objects, including the key-value data they contain.
-->
此任務涵蓋使用 {{< glossary_tooltip text="Kubernetes API" term_id="kubernetes-api" >}}
存儲的資源數據的加密。例如，你可以加密 Secret 對象，包括它們所包含的鍵值數據。

<!--
If you wanted to manage encryption for data in filesystems that are mounted into containers, you instead
need to either:

- use a storage integration that provides encrypted
  {{< glossary_tooltip text="volumes" term_id="volume" >}}
- encrypt the data within your own application
-->
如果要加密安裝到容器中的文件系統中的數據，則需要：

- 使用提供{{< glossary_tooltip text="存儲卷" term_id="volume" >}}加密的存儲集成方案
- 在你自己的應用中加密數據
{{< /note >}}

## {{% heading "prerequisites" %}}

* {{< include "task-tutorial-prereqs.md" >}}

<!--
* This task assumes that you are running the Kubernetes API server as a
  {{< glossary_tooltip text="static pod" term_id="static-pod" >}} on each control
  plane node.

* Your cluster's control plane **must** use etcd v3.x (major version 3, any minor version).
-->
* 此任務假設你將 Kubernetes API 服務器組件以{{< glossary_tooltip text="靜態 Pod" term_id="static-pod" >}}
  方式運行在每個控制平面節點上。

* 集羣的控制平面**必須**使用 etcd v3.x（主版本 3，任何次要版本）。

<!--
* To encrypt a custom resource, your cluster must be running Kubernetes v1.26 or newer.

* You should have some API data that are already encrypted.
-->
* 要加密自定義資源，你的集羣必須運行 Kubernetes v1.26 或更高版本。

* 你應該有一些已加密的 API 數據。

{{< version-check >}}

<!-- steps -->

<!--
## Determine whether encryption at rest is already enabled

By default, the API server uses an `identity` provider that stores plain-text representations
of resources.
**The default `identity` provider does not provide any confidentiality protection.**
-->
## 確定靜態加密是否已被啓用   {#determine-whether-encryption-at-rest-is-already-enabled}

默認情況下，API 服務器使用一個名爲 `identity` 的提供程序來存儲資源的明文表示。
**默認的 `identity` 提供程序不提供任何機密性保護。**

<!--
The `kube-apiserver` process accepts an argument `--encryption-provider-config`
that specifies a path to a configuration file. The contents of that file, if you specify one,
control how Kubernetes API data is encrypted in etcd.
If it is not specified, you do not have encryption at rest enabled.

The format of that configuration file is YAML, representing a configuration API kind named
[`EncryptionConfiguration`](/docs/reference/config-api/apiserver-config.v1/).
You can see an example configuration
in [Encryption at rest configuration](/docs/tasks/administer-cluster/encrypt-data/#understanding-the-encryption-at-rest-configuration).
-->
`kube-apiserver` 進程接受參數 `--encryption-provider-config`，該參數指定了配置文件的路徑。
如果你指定了一個路徑，那麼該文件的內容將控制 Kubernetes API 數據在 etcd 中的加密方式。
如果未指定，則表示你未啓用靜態加密。

該配置文件的格式是 YAML，表示名爲
[`EncryptionConfiguration`](/zh-cn/docs/reference/config-api/apiserver-config.v1/) 的配置 API 類別。
你可以在[靜態加密配置](/zh-cn/docs/tasks/administer-cluster/encrypt-data/#understanding-the-encryption-at-rest-configuration)中查看示例配置。

<!--
If `--encryption-provider-config` is set, check which resources (such as `secrets`) are
configured for encryption, and what provider is used.
Make sure that the preferred provider for that resource type is **not** `identity`; you
only set `identity` (_no encryption_) as default when you want to disable encryption at
rest.
Verify that the first-listed provider for a resource is something **other** than `identity`,
which means that any new information written to resources of that type will be encrypted as
configured. If you do see `identity` as the first-listed provider for any resource, this
means that those resources are being written out to etcd without encryption.
-->
如果設置了 `--encryption-provider-config`，檢查哪些資源（如 `secrets`）已配置爲進行加密，
並查看所適用的是哪個提供程序。確保該資源類型首選的提供程序 **不是** `identity`；
只有在想要禁用靜態加密時，纔可將 `identity`（**無加密**）設置爲默認值。
驗證資源首選的提供程序是否不是 `identity`，這意味着寫入該類型資源的任何新信息都將按照配置被加密。
如果在任何資源的首選提供程序中看到 `identity`，這意味着這些資源將以非加密的方式寫入 etcd 中。

<!--
## Decrypt all data {#decrypting-all-data}

This example shows how to stop encrypting the Secret API at rest. If you are encrypting
other API kinds, adjust the steps to match.
-->
## 解密所有數據 {#decrypting-all-data}

本例展示如何停止對 Secret API 進行靜態加密。如果你正在加密其他 API 類別，可以相應調整以下步驟。

<!--
### Locate the encryption configuration file

First, find the API server configuration files. On each control plane node, static Pod manifest
for the kube-apiserver specifies a command line argument, `--encryption-provider-config`.
You are likely to find that this file is mounted into the static Pod using a
[`hostPath`](/docs/concepts/storage/volumes/#hostpath) volume mount. Once you locate the volume
you can find the file on the node filesystem and inspect it.
-->
### 找到加密配置文件   {#locate-encryption-configuration-file}

首先，找到 API 服務器的配置文件。在每個控制平面節點上，kube-apiserver 的靜態 Pod
清單指定了一個命令行參數 `--encryption-provider-config`。你很可能會發現此文件通過
[`hostPath`](/zh-cn/docs/concepts/storage/volumes/#hostpath) 卷掛載到靜態 Pod 中。
一旦你找到到此卷，就可以在節點文件系統中找到此文件並對其進行檢查。

<!--
### Configure the API server to decrypt objects

To disable encryption at rest, place the `identity` provider as the first
entry in your encryption configuration file.

For example, if your existing EncryptionConfiguration file reads:
-->
### 配置 API 服務器以解密對象   {#configure-api-server-to-decrypt-objects}

要禁用靜態加密，將 `identity` 提供程序設置爲加密配置文件中的第一個條目。

例如，如果你現有的 EncryptionConfiguration 文件內容如下：

<!--
# Do not use this (invalid) example key for encryption
-->
```yaml
---
apiVersion: apiserver.config.k8s.io/v1
kind: EncryptionConfiguration
resources:
  - resources:
      - secrets
    providers:
      - aescbc:
          keys:
            # 你加密時不要使用這個（無效）的示例密鑰
            - name: example
              secret: 2KfZgdiq2K0g2YrYpyDYs9mF2LPZhQ==
```

<!--
then change it to:
-->
然後將其更改爲：

<!--
# add this line
-->
```yaml
---
apiVersion: apiserver.config.k8s.io/v1
kind: EncryptionConfiguration
resources:
  - resources:
      - secrets
    providers:
      - identity: {} # 增加這一行
      - aescbc:
          keys:
            - name: example
              secret: 2KfZgdiq2K0g2YrYpyDYs9mF2LPZhQ==
```

<!--
and restart the kube-apiserver Pod on this node.

### Reconfigure other control plane hosts {#api-server-config-update-more-1}

If you have multiple API servers in your cluster, you should deploy the changes in turn to each API server.

Make sure that you use the same encryption configuration on each control plane host.
-->
並重啓此節點上的 kube-apiserver Pod。

### 重新配置其他控制平面主機 {#api-server-config-update-more-1}

如果你的集羣中有多個 API 服務器，應輪流對每個 API 服務器部署這些更改。

確保在每個控制平面主機上使用相同的加密配置。

<!--
### Force decryption

Then run the following command to force decryption of all Secrets:
-->
### 強制解密   {#force-decryption}

然後運行以下命令強制解密所有 Secret：

<!--
# If you are decrypting a different kind of object, change "secrets" to match.
-->
```shell
# 如果你正在解密不同類別的對象，請相應更改 "secrets"
kubectl get secrets --all-namespaces -o json | kubectl replace -f -
```

<!--
Once you have replaced **all** existing encrypted resources with backing data that
don't use encryption, you can remove the encryption settings from the
`kube-apiserver`.

The command line options to remove are:
-->
一旦你用未加密的後臺數據替換了**所有**現有的已加密資源，即可從 `kube-apiserver` 中刪除這些加密設置。

要移除的命令行選項爲：

- `--encryption-provider-config`
- `--encryption-provider-config-automatic-reload`

<!--
Restart the kube-apiserver Pod again to apply the new configuration.

### Reconfigure other control plane hosts {#api-server-config-update-more-2}

If you have multiple API servers in your cluster, you should again deploy the changes in turn to each API server.

Make sure that you use the same encryption configuration on each control plane host.
-->
再次重啓 kube-apiserver Pod 以應用新的配置。

### 重新配置其他控制平面主機   {#api-server-config-update-more-2}

如果你的集羣中有多個 API 服務器，應再次輪流對每個 API 服務器部署這些更改。

確保在每個控制平面主機上使用相同的加密配置。

## {{% heading "whatsnext" %}}

<!--
* Learn more about the [EncryptionConfiguration configuration API (v1)](/docs/reference/config-api/apiserver-config.v1/).
-->
* 更多細節參閱 [EncryptionConfiguration configuration API (v1)](/zh-cn/docs/reference/config-api/apiserver-config.v1/)。
