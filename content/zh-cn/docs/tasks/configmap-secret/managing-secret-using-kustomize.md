---
title: 使用 Kustomize 管理 Secret
content_type: task
weight: 30
description: 使用 kustomization.yaml 文件创建 Secret 对象。
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
`kubectl` 支持使用 [Kustomize 对象管理工具](/zh-cn/docs/tasks/manage-kubernetes-objects/kustomization/)来管理
Secret 和 ConfigMap。你可以使用 Kustomize 创建**资源生成器（Resource Generator）**，
该生成器会生成一个 Secret，让你能够通过 `kubectl` 应用到 API 服务器。

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
## 创建 Secret    {#create-a-secret}

你可以在 `kustomization.yaml` 文件中定义 `secreteGenerator` 字段，
并在定义中引用其它本地文件、`.env` 文件或文字值生成 Secret。
例如：下面的指令为用户名 `admin` 和密码 `1f2d1e2e67df` 创建 kustomization 文件。

{{< note >}}
<!--
The `stringData` field for a Secret does not work well with server-side apply.
-->
Secret 的 `stringData` 字段与服务端应用不兼容。
{{< /note >}}

### 创建 kustomization 文件   {#create-the-kustomization-file}

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
1. 将凭据存储在文件中。文件名是 Secret 的 key 值：

   ```shell
   echo -n 'admin' > ./username.txt
   echo -n '1f2d1e2e67df' > ./password.txt
   ```
    
   <!--
   The `-n` flag ensures that there's no newline character at the end of your
   files.
   -->

   `-n` 标志确保文件结尾处没有换行符。

<!--
1.  Create the `kustomization.yaml` file:
-->
2. 创建 `kustomization.yaml` 文件：

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
你也可以使用 `.env` 文件在 `kustomization.yaml` 中定义 `secretGenerator`。
例如下面的 `kustomization.yaml` 文件从 `.env.secret` 文件获取数据：

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
在所有情况下，你都不需要对取值作 base64 编码。
YAML 文件的名称**必须**是 `kustomization.yaml` 或 `kustomization.yml`。

<!--
### Apply the kustomization file

To create the Secret, apply the directory that contains the kustomization file:
-->
### 应用 kustomization 文件   {#apply-the-kustomization-file}

若要创建 Secret，应用包含 kustomization 文件的目录。

```shell
kubectl apply -k <目录路径>
```

<!--
The output is similar to:
-->
输出类似于：

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
生成 Secret 时，Secret 的名称最终是由 `name` 字段和数据的哈希值拼接而成。
这将保证每次修改数据时生成一个新的 Secret。

要验证 Secret 是否已创建并解码 Secret 数据，

```shell
kubectl get -k <目录路径> -o jsonpath='{.data}' 
```

<!--
The output is similar to:
-->
输出类似于：

```
{ "password": "MWYyZDFlMmU2N2Rm", "username": "YWRtaW4=" }
```

```
echo 'MWYyZDFlMmU2N2Rm' | base64 --decode
```

<!--
The output is similar to:
-->
输出类似于：

```
1f2d1e2e67df
```

<!--
For more information, refer to
[Managing Secrets using kubectl](/docs/tasks/configmap-secret/managing-secret-using-kubectl/#verify-the-secret) and
[Declarative Management of Kubernetes Objects Using Kustomize](/docs/tasks/manage-kubernetes-objects/kustomization/).
-->
更多信息参阅
[使用 kubectl 管理 Secret](/zh-cn/docs/tasks/configmap-secret/managing-secret-using-kubectl/#verify-the-secret)和
[使用 Kustomize 对 Kubernetes 对象进行声明式管理](/zh-cn/docs/tasks/manage-kubernetes-objects/kustomization/)

<!--
## Edit a Secret {#edit-secret}

1.  In your `kustomization.yaml` file, modify the data, such as the `password`.
1.  Apply the directory that contains the kustomization file:

    ```shell
    kubectl apply -k <directory-path>
    ```
-->
## 编辑 Secret {#edit-secret}

1. 在 `kustomization.yaml` 文件中，修改诸如 `password` 等数据。
1. 应用包含 kustomization 文件的目录：

   ```shell
   kubectl apply -k <目录路径>
   ```

   <!--
   The output is similar to:
   -->

   输出类似于：

   ```
   secret/db-user-pass-6f24b56cc8 created
   ```

<!--
The edited Secret is created as a new `Secret` object, instead of updating the
existing `Secret` object. You might need to update references to the Secret in
your Pods.
-->
编辑过的 Secret 被创建为一个新的 `Secret` 对象，而不是更新现有的 `Secret` 对象。
你可能需要在 Pod 中更新对该 Secret 的引用。

<!--
## Clean up

To delete a Secret, use `kubectl`:
-->
## 清理   {#clean-up}

要删除 Secret，请使用 `kubectl`：

```shell
kubectl delete secret db-user-pass
```

## {{% heading "whatsnext" %}}

<!-- 
- Read more about the [Secret concept](/docs/concepts/configuration/secret/)
- Learn how to [manage Secrets using kubectl](/docs/tasks/configmap-secret/managing-secret-using-kubectl/)
- Learn how to [manage Secrets using config file](/docs/tasks/configmap-secret/managing-secret-using-config-file/)
-->
- 进一步阅读 [Secret 概念](/zh-cn/docs/concepts/configuration/secret/)
- 了解如何[使用 kubectl 管理 Secret](/zh-cn/docs/tasks/configmap-secret/managing-secret-using-kubectl/)
- 了解如何[使用配置文件管理 Secret](/zh-cn/docs/tasks/configmap-secret/managing-secret-using-config-file/)
