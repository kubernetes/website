---
title: 使用 Kustomize 管理 Secret
content_type: task
weight: 30
description: 使用 kustomization.yaml 文件創建 Secret 對象。
---
<!-- 
title: Managing Secrets using Kustomize
content_type: task
weight: 30
description: Creating Secret objects using kustomization.yaml file.
-->

<!-- overview -->

<!--  
`kubectl` supports using the [Kustomize object management tool](/docs/tasks/manage-kubernetes-objects/kustomization/) to manage Secrets
and ConfigMaps. You create a *resource generator* using Kustomize, which
generates a Secret that you can apply to the API server using `kubectl`.
-->
`kubectl` 支持使用 [Kustomize 對象管理工具](/zh-cn/docs/tasks/manage-kubernetes-objects/kustomization/)來管理
Secret 和 ConfigMap。你可以使用 Kustomize 創建**資源生成器（Resource Generator）**，
該生成器會生成一個 Secret，讓你能夠通過 `kubectl` 應用到 API 伺服器。

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

<!-- steps -->

<!--
## Create a Secret

You can generate a Secret by defining a `secretGenerator` in a
`kustomization.yaml` file that references other existing files, `.env` files, or
literal values. For example, the following instructions create a kustomization
file for the username `admin` and the password `1f2d1e2e67df`.

### Create the kustomization file
-->
## 創建 Secret    {#create-a-secret}

你可以在 `kustomization.yaml` 文件中定義 `secreteGenerator` 字段，
並在定義中引用其它本地文件、`.env` 文件或文字值生成 Secret。
例如：下面的指令爲使用者名 `admin` 和密碼 `1f2d1e2e67df` 創建 kustomization 文件。

{{< note >}}
<!--
The `stringData` field for a Secret does not work well with server-side apply.
-->
Secret 的 `stringData` 字段與服務端應用不兼容。
{{< /note >}}

### 創建 kustomization 文件   {#create-the-kustomization-file}

{{< tabs name="Secret data" >}}
{{< tab name="文字" codelang="yaml" >}}
secretGenerator:
- name: database-creds
  literals:
  - username=admin
  - password=1f2d1e2e67df
{{< /tab >}}
{{% tab name="文件" %}}

<!--
1.  Store the credentials in files. The filenames are the keys of the secret:
-->
1. 將憑據存儲在文件中。文件名是 Secret 的 key 值：

   ```shell
   echo -n 'admin' > ./username.txt
   echo -n '1f2d1e2e67df' > ./password.txt
   ```
    
   <!--
   The `-n` flag ensures that there's no newline character at the end of your
   files.
   -->

   `-n` 標誌確保文件結尾處沒有換行符。

<!--
1.  Create the `kustomization.yaml` file:
-->
2. 創建 `kustomization.yaml` 文件：

   ```yaml
   secretGenerator:
   - name: database-creds
     files:
     - username.txt
     - password.txt
   ```

{{% /tab %}}
{{% tab name=".env 文件" %}}
<!-- 
You can also define the secretGenerator in the `kustomization.yaml` file by
providing `.env` files. For example, the following `kustomization.yaml` file
pulls in data from an `.env.secret` file:
-->
你也可以使用 `.env` 文件在 `kustomization.yaml` 中定義 `secretGenerator`。
例如下面的 `kustomization.yaml` 文件從 `.env.secret` 文件獲取數據：

```yaml
secretGenerator:
- name: db-user-pass
  envs:
  - .env.secret
```
{{% /tab %}}
{{< /tabs >}}

<!--
In all cases, you don't need to encode the values in base64. The name of the YAML
file **must** be `kustomization.yaml` or `kustomization.yml`.
-->
在所有情況下，你都不需要對取值作 base64 編碼。
YAML 文件的名稱**必須**是 `kustomization.yaml` 或 `kustomization.yml`。

<!--
### Apply the kustomization file

To create the Secret, apply the directory that contains the kustomization file:
-->
### 應用 kustomization 文件   {#apply-the-kustomization-file}

若要創建 Secret，應用包含 kustomization 文件的目錄。

```shell
kubectl apply -k <目錄路徑>
```

<!--
The output is similar to:
-->
輸出類似於：

```
secret/database-creds-5hdh7hhgfk created
```

<!--
When a Secret is generated, the Secret name is created by hashing
the Secret data and appending the hash value to the name. This ensures that
a new Secret is generated each time the data is modified.

To verify that the Secret was created and to decode the Secret data,

```shell
kubectl get -k <directory-path> -o jsonpath='{.data}' 
```
-->
生成 Secret 時，Secret 的名稱最終是由 `name` 字段和數據的哈希值拼接而成。
這將保證每次修改數據時生成一個新的 Secret。

要驗證 Secret 是否已創建並解碼 Secret 數據，

```shell
kubectl get -k <目錄路徑> -o jsonpath='{.data}' 
```

<!--
The output is similar to:
-->
輸出類似於：

```
{ "password": "MWYyZDFlMmU2N2Rm", "username": "YWRtaW4=" }
```

```
echo 'MWYyZDFlMmU2N2Rm' | base64 --decode
```

<!--
The output is similar to:
-->
輸出類似於：

```
1f2d1e2e67df
```

<!--
For more information, refer to
[Managing Secrets using kubectl](/docs/tasks/configmap-secret/managing-secret-using-kubectl/#verify-the-secret) and
[Declarative Management of Kubernetes Objects Using Kustomize](/docs/tasks/manage-kubernetes-objects/kustomization/).
-->
更多信息參閱
[使用 kubectl 管理 Secret](/zh-cn/docs/tasks/configmap-secret/managing-secret-using-kubectl/#verify-the-secret)和
[使用 Kustomize 對 Kubernetes 對象進行聲明式管理](/zh-cn/docs/tasks/manage-kubernetes-objects/kustomization/)

<!--
## Edit a Secret {#edit-secret}

1.  In your `kustomization.yaml` file, modify the data, such as the `password`.
1.  Apply the directory that contains the kustomization file:

    ```shell
    kubectl apply -k <directory-path>
    ```
-->
## 編輯 Secret {#edit-secret}

1. 在 `kustomization.yaml` 文件中，修改諸如 `password` 等數據。
1. 應用包含 kustomization 文件的目錄：

   ```shell
   kubectl apply -k <目錄路徑>
   ```

   <!--
   The output is similar to:
   -->

   輸出類似於：

   ```
   secret/db-user-pass-6f24b56cc8 created
   ```

<!--
The edited Secret is created as a new `Secret` object, instead of updating the
existing `Secret` object. You might need to update references to the Secret in
your Pods.
-->
編輯過的 Secret 被創建爲一個新的 `Secret` 對象，而不是更新現有的 `Secret` 對象。
你可能需要在 Pod 中更新對該 Secret 的引用。

<!--
## Clean up

To delete a Secret, use `kubectl`:
-->
## 清理   {#clean-up}

要刪除 Secret，請使用 `kubectl`：

```shell
kubectl delete secret db-user-pass
```

## {{% heading "whatsnext" %}}

<!-- 
- Read more about the [Secret concept](/docs/concepts/configuration/secret/)
- Learn how to [manage Secrets using kubectl](/docs/tasks/configmap-secret/managing-secret-using-kubectl/)
- Learn how to [manage Secrets using config file](/docs/tasks/configmap-secret/managing-secret-using-config-file/)
-->
- 進一步閱讀 [Secret 概念](/zh-cn/docs/concepts/configuration/secret/)
- 瞭解如何[使用 kubectl 管理 Secret](/zh-cn/docs/tasks/configmap-secret/managing-secret-using-kubectl/)
- 瞭解如何[使用設定文件管理 Secret](/zh-cn/docs/tasks/configmap-secret/managing-secret-using-config-file/)
