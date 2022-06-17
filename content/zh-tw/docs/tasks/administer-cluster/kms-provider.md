---
title: 使用 KMS 驅動進行資料加密
content_type: task
---
<!--
reviewers:
- smarterclayton
title: Using a KMS provider for data encryption
content_type: task
-->
<!-- overview -->
<!-- This page shows how to configure a Key Management Service (KMS) provider and plugin to enable secret data encryption. -->

本頁展示瞭如何配置秘鑰管理服務—— Key Management Service (KMS) 驅動和外掛以啟用
Secret 資料加密。

## {{% heading "prerequisites" %}}

* {{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!-- * Kubernetes version 1.10.0 or later is required -->
<!-- * etcd v3 or later is required -->
* 需要 Kubernetes 1.10.0 或更新版本
* 需要 etcd v3 或更新版本

{{< feature-state for_k8s_version="v1.12" state="beta" >}}

<!-- steps -->

<!--
The KMS encryption provider uses an envelope encryption scheme to encrypt data in etcd. The data is encrypted using a data encryption key (DEK); a new DEK is generated for each encryption. The DEKs are encrypted with a key encryption key (KEK) that is stored and managed in a remote KMS. The KMS provider uses gRPC to communicate with a specific KMS 
plugin. The KMS plugin, which is implemented as a gRPC server and deployed on the same host(s) as the Kubernetes master(s), is responsible for all communication with the remote KMS.
-->
KMS 加密驅動使用封套加密模型來加密 etcd 中的資料。
資料使用資料加密秘鑰（DEK）加密；每次加密都生成一個新的 DEK。
這些 DEK 經一個秘鑰加密秘鑰（KEK）加密後在一個遠端的 KMS 中儲存和管理。
KMS 驅動使用 gRPC 與一個特定的 KMS 外掛通訊。這個 KMS 外掛作為一個 gRPC 
伺服器被部署在 Kubernetes 主伺服器的同一個主機上，負責與遠端 KMS 的通訊。

<!--
## Configuring the KMS provider

To configure a KMS provider on the API server, include a provider of type ```kms``` in the providers array in the encryption configuration file and set the following properties:
-->
## 配置 KMS 驅動

為了在 API 伺服器上配置 KMS 驅動，在加密配置檔案中的驅動陣列中加入一個型別為 `kms`
的驅動，並設定下列屬性：

<!--
* `name`: Display name of the KMS plugin.
* `endpoint`: Listen address of the gRPC server (KMS plugin). The endpoint is a UNIX domain socket.
* `cachesize`: Number of data encryption keys (DEKs) to be cached in the clear. When cached, DEKs can be used without another call to the KMS; whereas DEKs that are not cached require a call to the KMS to unwrap.
* `timeout`: How long should kube-apiserver wait for kms-plugin to respond before returning an error (default is 3 seconds).
-->

* `name`: KMS 外掛的顯示名稱。
* `endpoint`: gRPC 伺服器（KMS 外掛）的監聽地址。該端點是一個 UNIX 域套接字。
* `cachesize`: 以明文快取的資料加密秘鑰（DEKs）的數量。一旦被快取，
  就可以直接使用 DEKs 而無需另外呼叫 KMS；而未被快取的 DEKs 需要呼叫一次 KMS 才能解包。
* `timeout`: 在返回一個錯誤之前，kube-apiserver 等待 kms-plugin 響應的時間（預設是 3 秒）。

<!-- See [Understanding the encryption at rest configuration.](/docs/tasks/administer-cluster/encrypt-data) -->
參見[理解靜態資料加密配置](/zh-cn/docs/tasks/administer-cluster/encrypt-data)

<!--
## Implementing a KMS plugin

To implement a KMS plugin, you can develop a new plugin gRPC server or enable a KMS plugin already provided by your cloud provider. You then integrate the plugin with the remote KMS and deploy it on the Kubernetes master.
-->
## 實現 KMS 外掛

為實現一個 KMS 外掛，你可以開發一個新的外掛 gRPC 伺服器或啟用一個由你的雲服務驅動提供的 KMS 外掛。
你可以將這個外掛與遠端 KMS 整合，並把它部署到 Kubernetes 的主伺服器上。

<!--
### Enabling the KMS supported by your cloud provider 
Refer to your cloud provider for instructions on enabling the cloud provider-specific KMS plugin.
-->
### 啟用由雲服務驅動支援的 KMS

有關啟用雲服務驅動特定的 KMS 外掛的說明，請諮詢你的雲服務驅動商。

<!--
### Developing a KMS plugin gRPC server

You can develop a KMS plugin gRPC server using a stub file available for Go. For other languages, you use a proto file to create a stub file that you can use to develop the gRPC server code.
-->
### 開發 KMS 外掛 gRPC 伺服器

你可以使用 Go 語言的存根檔案開發 KMS 外掛 gRPC 伺服器。
對於其他語言，你可以用 proto 檔案建立可以用於開發 gRPC 伺服器程式碼的存根檔案。

<!--
* Using Go: Use the functions and data structures in the stub file:
[service.pb.go](https://github.com/kubernetes/kubernetes/blob/master/staging/src/k8s.io/apiserver/pkg/storage/value/encrypt/envelope/v1beta1/service.pb.go) to develop the gRPC server code
-->
* 使用 Go：使用存根檔案 [service.pb.go](https://github.com/kubernetes/kubernetes/blob/master/staging/src/k8s.io/apiserver/pkg/storage/value/encrypt/envelope/v1beta1/service.pb.go)
  中的函式和資料結構開發 gRPC 伺服器程式碼。

<!--
* Using languages other than Go: Use the protoc compiler with the proto file: [service.proto](https://github.com/kubernetes/kubernetes/blob/master/staging/src/k8s.io/apiserver/pkg/storage/value/encrypt/envelope/v1beta1/service.proto) to generate a stub file for the specific language
-->
* 使用 Go 以外的其他語言：用 protoc 編譯器編譯 proto 檔案：
  [service.proto](https://github.com/kubernetes/kubernetes/blob/master/staging/src/k8s.io/apiserver/pkg/storage/value/encrypt/envelope/v1beta1/service.proto)
  為指定語言生成存根檔案。

<!--
Then use the functions and data structures in the stub file to develop the server code.
-->
然後使用存根檔案中的函式和資料結構開發伺服器程式碼。

<!-- **Notes:** -->
**注意：**

<!--
* kms plugin version: `v1beta1`

  In response to procedure call Version, a compatible KMS plugin should return v1beta1 as VersionResponse.version.

* message version: `v1beta1`

  All messages from KMS provider have the version field set to current version v1beta1.

* protocol: UNIX domain socket (`unix`)

  The gRPC server should listen at UNIX domain socket.
-->
* kms 外掛版本：`v1beta1`

  作為對過程呼叫 Version 的響應，相容的 KMS 外掛應把 v1beta1 作為 VersionResponse.version 返回

* 訊息版本：`v1beta1`

  所有來自 KMS 驅動的訊息都把 version 欄位設定為當前版本 v1beta1

* 協議：UNIX 域套接字 (`unix`)

  gRPC 伺服器應監聽 UNIX 域套接字

<!--
### Integrating a KMS plugin with the remote KMS

The KMS plugin can communicate with the remote KMS using any protocol supported by the KMS.
All configuration data, including authentication credentials the KMS plugin uses to communicate with the remote KMS, 
are stored and managed by the KMS plugin independently. The KMS plugin can encode the ciphertext with additional metadata that may be required before sending it to the KMS for decryption.
-->
### 將 KMS 外掛與遠端 KMS 整合

KMS 外掛可以用任何受 KMS 支援的協議與遠端 KMS 通訊。
所有的配置資料，包括 KMS 外掛用於與遠端 KMS 通訊的認證憑據，都由 KMS 外掛獨立地儲存和管理。
KMS 外掛可以用額外的元資料對密文進行編碼，這些元資料是在把它發往 KMS 進行解密之前可能要用到的。

<!--
### Deploying the KMS plugin 

Ensure that the KMS plugin runs on the same host(s) as the Kubernetes master(s).
-->
### 部署 KMS 外掛

確保 KMS 外掛與 Kubernetes 主伺服器執行在同一主機上。

<!--
## Encrypting your data with the KMS provider

To encrypt the data:
-->
## 使用 KMS 驅動加密資料

為了加密資料：

<!--
1. Create a new encryption configuration file using the appropriate properties for the `kms` provider:
-->
1. 使用 `kms` 驅動的相應的屬性建立一個新的加密配置檔案：

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

<!--
2. Set the `--encryption-provider-config` flag on the kube-apiserver to point to the location of the configuration file.
3. Restart your API server.
-->
2. 設定 kube-apiserver 的 `--encryption-provider-config` 引數指向配置檔案的位置。
3. 重啟 API 伺服器。

<!--
## Verifying that the data is encrypted

Data is encrypted when written to etcd. After restarting your kube-apiserver, any newly created or updated secret should be encrypted when stored. To verify, you can use the etcdctl command line program to retrieve the contents of your secret.
-->
## 驗證資料已經加密

寫入 etcd 時資料被加密。重啟 kube-apiserver 後，任何新建或更新的 Secret 在儲存時應該已被加密。
要驗證這點，你可以用 etcdctl 命令列程式獲取 Secret 內容。 

<!--
1. Create a new secret called secret1 in the default namespace:
-->
1. 在預設的命名空間裡建立一個名為 secret1 的 Secret：

   ```
   kubectl create secret generic secret1 -n default --from-literal=mykey=mydata
   ```

<!--
2. Using the etcdctl command line, read that secret out of etcd:
-->
2. 用 etcdctl 命令列，從 etcd 讀取出 Secret：

   ```
   ETCDCTL_API=3 etcdctl get /kubernetes.io/secrets/default/secret1 [...] | hexdump -C
   ```

   <!--
   where `[...]` must be the additional arguments for connecting to the etcd server.
   -->
   其中 `[...]` 是用於連線 etcd 伺服器的額外引數。

<!--
3. Verify the stored secret is prefixed with `k8s:enc:kms:v1:`, which indicates that the `kms` provider has encrypted the resulting data.
-->
3. 驗證儲存的 Secret 是否是以 `k8s:enc:kms:v1:` 開頭的，這表明 `kms` 驅動已經對結果資料加密。

<!--
4. Verify that the secret is correctly decrypted when retrieved via the API:
-->
4. 驗證 Secret 在被 API 獲取時已被正確解密：

   ```
   kubectl describe secret secret1 -n default
   ```

   結果應該是 `mykey: mydata`。 

<!--
## Ensuring all secrets are encrypted

Because secrets are encrypted on write, performing an update on a secret encrypts that content.
-->
## 確保所有 Secret 都已被加密

因為 Secret 是在寫入時被加密的，所以在更新 Secret 時也會加密該內容。

<!--
The following command reads all secrets and then updates them to apply server side encryption. If an error occurs due to a conflicting write, retry the command.
For larger clusters, you may wish to subdivide the secrets by namespace or script an update.
-->
下列命令讀取所有 Secret 並更新它們以便應用伺服器端加密。如果因為寫入衝突導致錯誤發生，
請重試此命令。對較大的叢集，你可能希望根據名稱空間或指令碼更新去細分 Secret 內容。

```
kubectl get secrets --all-namespaces -o json | kubectl replace -f -
```

<!--
## Switching from a local encryption provider to the KMS provider

To switch from a local encryption provider to the `kms` provider and re-encrypt all of the secrets:
-->
## 從本地加密驅動切換到 KMS 驅動

為了從本地加密驅動切換到 `kms` 驅動並重新加密所有 Secret 內容：

<!--
1. Add the `kms` provider as the first entry in the configuration file as shown in the following example.
-->
1. 在配置檔案中加入 `kms` 驅動作為第一個條目，如下列樣例所示

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

<!--
2. Restart all kube-apiserver processes.
3. Run the following command to force all secrets to be re-encrypted using the `kms` provider.
-->
2. 重啟所有 kube-apiserver 程序。
3. 執行下列命令使用 `kms` 驅動強制重新加密所有 Secret。

   ```
   kubectl get secrets --all-namespaces -o json| kubectl replace -f -
   ```

<!--
## Disabling encryption at rest
To disable encryption at rest:
-->
## 禁用靜態資料加密

要禁用靜態資料加密：

<!--
1. Place the `identity` provider as the first entry in the configuration file:
-->
1. 將 `identity` 驅動作為配置檔案中的第一個條目： 

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

<!--
2.  Restart all kube-apiserver processes.
3. Run the following command to force all secrets to be decrypted.
-->
2. 重啟所有 kube-apiserver 程序。
3. 執行下列命令強制重新加密所有 Secret。

   ```
   kubectl get secrets --all-namespaces -o json | kubectl replace -f -
   ```

