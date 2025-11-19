---
title: 使用設定文件管理 Secret
content_type: task
weight: 20
description: 使用資源設定文件創建 Secret 對象。
---
<!--  
title: Managing Secrets using Configuration File
content_type: task
weight: 20
description: Creating Secret objects using resource configuration file.
-->

<!-- overview -->

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

<!-- steps -->

<!--
## Create the Secret {#create-the-config-file}
-->
## 創建 Secret  {#create-the-config-file}

<!--
You can define the `Secret` object in a manifest first, in JSON or YAML format,
and then create that object. The
[Secret](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#secret-v1-core)
resource contains two maps: `data` and `stringData`.
The `data` field is used to store arbitrary data, encoded using base64. The
`stringData` field is provided for convenience, and it allows you to provide
the same data as unencoded strings.
The keys of `data` and `stringData` must consist of alphanumeric characters,
`-`, `_` or `.`.
-->
你可以先用 JSON 或 YAML 格式在一個清單文件中定義 `Secret` 對象，然後創建該對象。
[Secret](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#secret-v1-core)
資源包含 2 個鍵值對：`data` 和 `stringData`。
`data` 字段用來存儲 base64 編碼的任意數據。
提供 `stringData` 字段是爲了方便，它允許 Secret 使用未編碼的字符串。
`data` 和 `stringData` 的鍵必須由字母、數字、`-`、`_` 或 `.` 組成。

<!--
The following example stores two strings in a Secret using the `data` field.
-->
以下示例使用 `data` 字段在 Secret 中存儲兩個字符串：

<!-- 
1. Convert the strings to base64: 
-->
1. 將這些字符串轉換爲 base64：

   ```shell
   echo -n 'admin' | base64
   echo -n '1f2d1e2e67df' | base64
   ```

   {{< note >}}
   <!--
   The serialized JSON and YAML values of Secret data are encoded as base64 strings. Newlines are not valid within these strings and must be omitted. When using the `base64` utility on Darwin/macOS, users should avoid using the `-b` option to split long lines. Conversely, Linux users *should* add the option `-w 0` to `base64` commands or the pipeline `base64 | tr -d '\n'` if the `-w` option is not available.
   -->
   Secret 數據的 JSON 和 YAML 序列化結果是以 base64 編碼的。
   換行符在這些字符串中無效，必須省略。
   在 Darwin/macOS 上使用 `base64` 工具時，使用者不應該使用 `-b` 選項分割長行。
   相反地，Linux 使用者**應該**在 `base64` 地命令中添加 `-w 0` 選項，
   或者在 `-w` 選項不可用的情況下，輸入 `base64 | tr -d '\n'`。
   {{< /note >}}

   <!--
   The output is similar to:
   -->
   輸出類似於：

   ```
   YWRtaW4=
   MWYyZDFlMmU2N2Rm
   ```
<!-- 
1. Create the manifest: 
-->
2. 創建清單：

   ```yaml
   apiVersion: v1
   kind: Secret
   metadata:
     name: mysecret
   type: Opaque
   data:
     username: YWRtaW4=
     password: MWYyZDFlMmU2N2Rm
   ```
   <!-- 
   Note that the name of a Secret object must be a valid
   [DNS subdomain name](/docs/concepts/overview/working-with-objects/names#dns-subdomain-names). 
   -->
   注意，Secret 對象的名稱必須是有效的 [DNS 子域名](/zh-cn/docs/concepts/overview/working-with-objects/names#dns-subdomain-names)。

<!-- 
1. Create the Secret using [`kubectl apply`](/docs/reference/generated/kubectl/kubectl-commands#apply): 
-->
3. 使用 [`kubectl apply`](/docs/reference/generated/kubectl/kubectl-commands#apply) 創建 Secret：

   ```shell
   kubectl apply -f ./secret.yaml
   ```

   <!--
   The output is similar to:
   -->
   輸出類似於：

   ```
   secret/mysecret created
   ```
<!-- 
To verify that the Secret was created and to decode the Secret data, refer to
[Managing Secrets using kubectl](/docs/tasks/configmap-secret/managing-secret-using-kubectl/#verify-the-secret). 
-->
若要驗證 Secret 被創建以及想要解碼 Secret 數據，
請參閱[使用 kubectl 管理 Secret](/zh-cn/docs/tasks/configmap-secret/managing-secret-using-kubectl/#verify-the-secret)

<!-- 
### Specify unencoded data when creating a Secret
-->
### 創建 Secret 時提供未編碼的數據  {#specify-unencoded-data-when-creating-a-secret}

<!-- 
For certain scenarios, you may wish to use the `stringData` field instead. This
field allows you to put a non-base64 encoded string directly into the Secret,
and the string will be encoded for you when the Secret is created or updated.
-->
對於某些場景，你可能希望使用 `stringData` 字段。
這個字段可以將一個非 base64 編碼的字符串直接放入 Secret 中，
當創建或更新該 Secret 時，此字段將被編碼。

<!--  
A practical example of this might be where you are deploying an application
that uses a Secret to store a configuration file, and you want to populate
parts of that configuration file during your deployment process.
-->
上述用例的實際場景可能是這樣：當你部署應用時，使用 Secret 存儲設定文件，
你希望在部署過程中，填入部分內容到該設定文件。

<!--
For example, if your application uses the following configuration file:
-->
例如，如果你的應用程序使用以下設定文件：

```yaml
apiUrl: "https://my.api.com/api/v1"
username: "<user>"
password: "<password>"
```

<!--
You could store this in a Secret using the following definition:
-->
你可以使用以下定義將其存儲在 Secret 中：

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: mysecret
type: Opaque
stringData:
  config.yaml: |
    apiUrl: "https://my.api.com/api/v1"
    username: <user>
    password: <password>
```

{{< note >}}
<!--
The `stringData` field for a Secret does not work well with server-side apply.
-->
Secret 的 `stringData` 字段不能很好地與伺服器端應用配合使用。
{{< /note >}}

<!-- 
When you retrieve the Secret data, the command returns the encoded values,
and not the plaintext values you provided in `stringData`.

For example, if you run the following command: 
-->
當你檢索 Secret 數據時，此命令將返回編碼的值，並不是你在 `stringData` 中提供的純文本值。

例如，如果你運行以下命令：

```shell
kubectl get secret mysecret -o yaml
```

<!--
The output is similar to:
-->
輸出類似於：

```yaml
apiVersion: v1
data:
  config.yaml: YXBpVXJsOiAiaHR0cHM6Ly9teS5hcGkuY29tL2FwaS92MSIKdXNlcm5hbWU6IHt7dXNlcm5hbWV9fQpwYXNzd29yZDoge3twYXNzd29yZH19
kind: Secret
metadata:
  creationTimestamp: 2018-11-15T20:40:59Z
  name: mysecret
  namespace: default
  resourceVersion: "7225"
  uid: c280ad2e-e916-11e8-98f2-025000000001
type:
```

<!-- 
### Specify both `data` and `stringData`

If you specify a field in both `data` and `stringData`, the value from `stringData` is used.

For example, if you define the following Secret:
-->
### 同時指定 `data` 和 `stringData` {#specifying-both-data-and-stringdata}

如果你在 `data` 和 `stringData` 中設置了同一個字段，則使用來自 `stringData` 中的值。

例如，如果你定義以下 Secret：

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: mysecret
type: Opaque
data:
  username: YWRtaW4=
stringData:
  username: administrator
```

{{< note >}}
<!--
The `stringData` field for a Secret does not work well with server-side apply.
-->
Secret 的 `stringData` 字段不能很好地與伺服器端應用配合使用。
{{< /note >}}

<!--
The `Secret` object is created as follows:
-->
所創建的 `Secret` 對象如下：

```yaml
apiVersion: v1
data:
  username: YWRtaW5pc3RyYXRvcg==
kind: Secret
metadata:
  creationTimestamp: 2018-11-15T20:46:46Z
  name: mysecret
  namespace: default
  resourceVersion: "7579"
  uid: 91460ecb-e917-11e8-98f2-025000000001
type: Opaque
```

<!--
`YWRtaW5pc3RyYXRvcg==` decodes to `administrator`.
-->
`YWRtaW5pc3RyYXRvcg==` 解碼成 `administrator`。

<!--
## Edit a Secret {#edit-secret}

To edit the data in the Secret you created using a manifest, modify the `data`
or `stringData` field in your manifest and apply the file to your
cluster. You can edit an existing `Secret` object unless it is
[immutable](/docs/concepts/configuration/secret/#secret-immutable).

For example, if you want to change the password from the previous example to
`birdsarentreal`, do the following:

1. Encode the new password string:
-->
## 編輯 Secret {#edit-secret}

要編輯使用清單創建的 Secret 中的數據，請修改清單中的 `data` 或 `stringData` 字段並將此清單文件應用到叢集。
你可以編輯現有的 `Secret` 對象，除非它是[不可變的](/zh-cn/docs/concepts/configuration/secret/#secret-immutable)。

例如，如果你想將上一個示例中的密碼更改爲 `birdsarentreal`，請執行以下操作：

1. 編碼新密碼字符串：

   ```shell
   echo -n 'birdsarentreal' | base64
   ```

   <!--
   The output is similar to:
   -->
   輸出類似於：

   ```
   YmlyZHNhcmVudHJlYWw=
   ```

<!--
1. Update the `data` field with your new password string:
-->
2. 使用你的新密碼字符串更新 `data` 字段：

   ```yaml
   apiVersion: v1
   kind: Secret
   metadata:
     name: mysecret
   type: Opaque
   data:
     username: YWRtaW4=
     password: YmlyZHNhcmVudHJlYWw=
   ```

<!--
1. Apply the manifest to your cluster:
-->
3. 將清單應用到你的叢集：

   ```shell
   kubectl apply -f ./secret.yaml
   ```

   <!--
   The output is similar to:
   -->
   輸出類似於：

   ```
   secret/mysecret configured
   ```

<!--
Kubernetes updates the existing `Secret` object. In detail, the `kubectl` tool
notices that there is an existing `Secret` object with the same name. `kubectl`
fetches the existing object, plans changes to it, and submits the changed
`Secret` object to your cluster control plane.

If you specified `kubectl apply --server-side` instead, `kubectl` uses
[Server Side Apply](/docs/reference/using-api/server-side-apply/) instead.
-->
Kubernetes 更新現有的 `Secret` 對象。具體而言，`kubectl` 工具發現存在一個同名的現有 `Secret` 對象。
`kubectl` 獲取現有對象，計劃對其進行更改，並將更改後的 `Secret` 對象提交到你的叢集控制平面。

如果你指定了 `kubectl apply --server-side`，則 `kubectl`
使用[伺服器端應用（Server-Side Apply）](/zh-cn/docs/reference/using-api/server-side-apply/)。

<!--
## Clean Up
-->
## 清理    {#clean-up}

<!--
To delete the Secret you have created:
-->
刪除你創建的 Secret：

```shell
kubectl delete secret mysecret
```

## {{% heading "whatsnext" %}}

<!-- 
- Read more about the [Secret concept](/docs/concepts/configuration/secret/)
- Learn how to [manage Secrets using kubectl](/docs/tasks/configmap-secret/managing-secret-using-kubectl/)
- Learn how to [manage Secrets using kustomize](/docs/tasks/configmap-secret/managing-secret-using-kustomize/)
-->
- 進一步閱讀 [Secret 概念](/zh-cn/docs/concepts/configuration/secret/)
- 瞭解如何[使用 `kubectl` 管理 Secret](/zh-cn/docs/tasks/configmap-secret/managing-secret-using-kubectl/)
- 瞭解如何[使用 kustomize 管理 Secret](/zh-cn/docs/tasks/configmap-secret/managing-secret-using-kustomize/)
