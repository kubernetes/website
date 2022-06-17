---
title: 使用 Kustomize 管理 Secret
content_type: task
weight: 30
description: 使用 kustomization.yaml 檔案建立 Secret 物件。
---
<!-- 
title: Managing Secrets using Kustomize
content_type: task
weight: 30
description: Creating Secret objects using kustomization.yaml file.
-->

<!-- overview -->

<!--  
Since Kubernetes v1.14, `kubectl` supports
[managing objects using Kustomize](/docs/tasks/manage-kubernetes-objects/kustomization/).
Kustomize provides resource Generators to create Secrets and ConfigMaps. The
Kustomize generators should be specified in a `kustomization.yaml` file inside
a directory. After generating the Secret, you can create the Secret on the API
server with `kubectl apply`.
-->
從 kubernetes v1.14 開始，`kubectl` 支援[使用 Kustomize 管理物件](/zh-cn/docs/tasks/manage-kubernetes-objects/kustomization/)。
Kustomize 提供了資源生成器（Generators）來建立 Secret 和 ConfigMap。
Kustomize 生成器應該在某個目錄的 `kustomization.yaml` 檔案中指定。
生成 Secret 後，你可以使用 `kubectl apply` 在 API 伺服器上建立該 Secret。
## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

<!-- steps -->

<!-- ## Create the Kustomization file -->
## 建立 Kustomization 檔案    {#create-the-kustomization-file}

<!--  
You can generate a Secret by defining a `secretGenerator` in a
`kustomization.yaml` file that references other existing files.
For example, the following kustomization file references the
`./username.txt` and the `./password.txt` files:
-->
你可以在 `kustomization.yaml` 中定義 `secreteGenerator`，並在定義中引用其他現成的檔案，生成 Secret。
例如：下面的 kustomization 檔案 引用了 `./username.txt` 和 `./password.txt` 檔案：

```yaml
secretGenerator:
- name: db-user-pass
  files:
  - username.txt
  - password.txt
```

<!--  
You can also define the `secretGenerator` in the `kustomization.yaml`
file by providing some literals.
For example, the following `kustomization.yaml` file contains two literals
for `username` and `password` respectively:
-->
你也可以在 `kustomization.yaml` 檔案中指定一些字面量定義 `secretGenerator`。
例如：下面的 `kustomization.yaml` 檔案中包含了 `username` 和 `password` 兩個字面量：

```yaml
secretGenerator:
- name: db-user-pass
  literals:
  - username=admin
  - password=1f2d1e2e67df
```

<!-- 
You can also define the `secretGenerator` in the `kustomization.yaml`
file by providing `.env` files.
For example, the following `kustomization.yaml` file pulls in data from
`.env.secret` file:
-->
你也可以使用 `.env` 檔案在 `kustomization.yaml` 中定義 `secretGenerator`。
例如：下面的 `kustomization.yaml` 檔案從 `.env.secret` 檔案獲取資料。

```yaml
secretGenerator:
- name: db-user-pass
  envs:
  - .env.secret
```

<!--
Note that in all cases, you don't need to base64 encode the values.
-->
注意，上面兩種情況，你都不需要使用 base64 編碼。

<!-- ## Create the Secret -->
## 建立 Secret    {#create-the-secret}

<!-- Apply the directory containing the `kustomization.yaml` to create the Secret. -->
使用 `kubectl apply` 命令應用包含 `kustomization.yaml` 檔案的目錄建立 Secret。

```shell
kubectl apply -k .
```

<!-- The output is similar to: -->
輸出類似於：

```
secret/db-user-pass-96mffmfh4k created
```

<!-- 
Note that when a Secret is generated, the Secret name is created by hashing
the Secret data and appending the hash value to the name. This ensures that
a new Secret is generated each time the data is modified. 
-->
請注意，生成 Secret 時，Secret 的名稱最終是由 `name` 欄位和資料的雜湊值拼接而成。
這將保證每次修改資料時生成一個新的 Secret。

<!-- ## Check the Secret created -->
## 檢查建立的 Secret    {#check-the-secret-created}

<!-- You can check that the secret was created: -->
你可以檢查剛才建立的 Secret：

```shell
kubectl get secrets
```

<!-- The output is similar to: -->
輸出類似於：

```
NAME                             TYPE                                  DATA      AGE
db-user-pass-96mffmfh4k          Opaque                                2         51s
```

<!-- You can view a description of the secret: -->
你可以看到 Secret 的描述：

```shell
kubectl describe secrets/db-user-pass-96mffmfh4k
```

<!-- The output is similar to: -->
輸出類似於：

```
Name:            db-user-pass-96mffmfh4k
Namespace:       default
Labels:          <none>
Annotations:     <none>

Type:            Opaque

Data
====
password.txt:    12 bytes
username.txt:    5 bytes
```

<!-- 
The commands `kubectl get` and `kubectl describe` avoid showing the contents of a `Secret` by
default. This is to protect the `Secret` from being exposed accidentally to an onlooker,
or from being stored in a terminal log.
To check the actual content of the encoded data, please refer to
[decoding secret](/docs/tasks/configmap-secret/managing-secret-using-kubectl/#decoding-secret). 
-->
`kubectl get` 和 `kubectl describe` 命令預設不顯示 `Secret` 的內容。
這是為了防止 `Secret` 被意外暴露給旁觀者或儲存在終端日誌中。
檢查編碼後的實際內容，請參考[解碼 secret](/zh-cn/docs/tasks/configmap-secret/managing-secret-using-kubectl/#decoding-secret)。 
-->


<!-- ## Clean Up -->
## 清理    {#clean-up}

<!-- To delete the Secret you have created: -->
刪除你建立的 Secret：

```shell
kubectl delete secret db-user-pass-96mffmfh4k
```

<!-- Optional section; add links to information related to this topic. -->
## {{% heading "whatsnext" %}}

<!-- 
- Read more about the [Secret concept](/docs/concepts/configuration/secret/)
- Learn how to [manage Secrets with the `kubectl` command](/docs/tasks/configmap-secret/managing-secret-using-kubectl/)
- Learn how to [manage Secrets using config file](/docs/tasks/configmap-secret/managing-secret-using-config-file/) 
-->
- 進一步閱讀 [Secret 概念](/zh-cn/docs/concepts/configuration/secret/)
- 瞭解如何[使用 `kubectl` 命令管理 Secret](/zh-cn/docs/tasks/configmap-secret/managing-secret-using-kubectl/)
- 瞭解如何[使用配置檔案管理 Secret](/zh-cn/docs/tasks/configmap-secret/managing-secret-using-config-file/)
