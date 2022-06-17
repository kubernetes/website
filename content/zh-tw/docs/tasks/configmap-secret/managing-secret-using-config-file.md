---
title: 使用配置檔案管理 Secret
content_type: task
weight: 20
description: 使用資源配置檔案建立 Secret 物件。
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

<!-- ## Create the Config file -->
## 建立配置檔案    {#create-the-config-file}

<!-- 
You can create a Secret in a file first, in JSON or YAML format, and then
create that object.  The
[Secret](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#secret-v1-core)
resource contains two maps: `data` and `stringData`.
The `data` field is used to store arbitrary data, encoded using base64. The
`stringData` field is provided for convenience, and it allows you to provide
Secret data as unencoded strings.
The keys of `data` and `stringData` must consist of alphanumeric characters,
`-`, `_` or `.`. 
-->
你可以先用 JSON 或 YAML 格式在檔案中建立 Secret，然後建立該物件。
[Secret](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#secret-v1-core)
資源包含2個鍵值對： `data` 和 `stringData`。
`data` 欄位用來儲存 base64 編碼的任意資料。
提供 `stringData` 欄位是為了方便，它允許 Secret 使用未編碼的字串。
`data` 和 `stringData` 的鍵必須由字母、數字、`-`，`_` 或 `.` 組成。

<!--  
For example, to store two strings in a Secret using the `data` field, convert
the strings to base64 as follows:
-->
例如，要使用 Secret 的 `data` 欄位儲存兩個字串，請將字串轉換為 base64 ，如下所示：

```shell
echo -n 'admin' | base64
```

<!-- The output is similar to: -->
輸出類似於：

```
YWRtaW4=
```

```shell
echo -n '1f2d1e2e67df' | base64
```

<!-- The output is similar to: -->
輸出類似於：

```
MWYyZDFlMmU2N2Rm
```

<!-- Write a Secret config file that looks like this: -->
編寫一個 Secret 配置檔案，如下所示：

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
注意，Secret 物件的名稱必須是有效的 [DNS 子域名](/zh-cn/docs/concepts/overview/working-with-objects/names#dns-subdomain-names). 

{{< note >}}
<!--  
The serialized JSON and YAML values of Secret data are encoded as base64
strings. Newlines are not valid within these strings and must be omitted. When
using the `base64` utility on Darwin/macOS, users should avoid using the `-b`
option to split long lines. Conversely, Linux users *should* add the option
`-w 0` to `base64` commands or the pipeline `base64 | tr -d '\n'` if the `-w`
option is not available.
-->
Secret 資料的 JSON 和 YAML 序列化結果是以 base64 編碼的。
換行符在這些字串中無效，必須省略。
在 Darwin/macOS 上使用 `base64` 工具時，使用者不應該使用 `-b` 選項分割長行。
相反地，Linux 使用者 *應該* 在 `base64` 地命令中新增 `-w 0` 選項，
或者在 `-w` 選項不可用的情況下，輸入 `base64 | tr -d '\n'`。
{{< /note >}}

<!-- 
For certain scenarios, you may wish to use the `stringData` field instead. This
field allows you to put a non-base64 encoded string directly into the Secret,
and the string will be encoded for you when the Secret is created or updated.
-->
對於某些場景，你可能希望使用 `stringData` 欄位。
這欄位可以將一個非 base64 編碼的字串直接放入 Secret 中，
當建立或更新該 Secret 時，此欄位將被編碼。

<!--  
A practical example of this might be where you are deploying an application
that uses a Secret to store a configuration file, and you want to populate
parts of that configuration file during your deployment process.
-->
上述用例的實際場景可能是這樣：當你部署應用時，使用 Secret 儲存配置檔案，
你希望在部署過程中，填入部分內容到該配置檔案。

<!-- For example, if your application uses the following configuration file: -->
例如，如果你的應用程式使用以下配置檔案:

```yaml
apiUrl: "https://my.api.com/api/v1"
username: "<user>"
password: "<password>"
```

<!-- You could store this in a Secret using the following definition: -->
你可以使用以下定義將其儲存在 Secret 中:

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

<!-- ## Create the Secret object -->
## 建立 Secret 物件    {#create-the-secret-object}

<!-- Now create the Secret using [`kubectl apply`](/docs/reference/generated/kubectl/kubectl-commands#apply): -->
現在使用 [`kubectl apply`](/docs/reference/generated/kubectl/kubectl-commands#apply) 建立 Secret：

```shell
kubectl apply -f ./secret.yaml
```

<!-- The output is similar to: -->
輸出類似於：

```
secret/mysecret created
```

<!-- ## Check the Secret -->
## 檢查 Secret   {#check-the-secret}

<!--  
The `stringData` field is a write-only convenience field. It is never output when
retrieving Secrets. For example, if you run the following command:
-->
`stringData` 欄位是隻寫的。獲取 Secret 時，此欄位永遠不會輸出。
例如，如果你執行以下命令：


```shell
kubectl get secret mysecret -o yaml
```

<!-- The output is similar to: -->
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
type: Opaque
```

<!--  
The commands `kubectl get` and `kubectl describe` avoid showing the contents of a `Secret` by
default. This is to protect the `Secret` from being exposed accidentally to an onlooker,
or from being stored in a terminal log.
To check the actual content of the encoded data, please refer to
[decoding secret](/docs/tasks/configmap-secret/managing-secret-using-kubectl/#decoding-secret).
-->
命令 `kubectl get` 和 `kubectl describe` 預設不顯示 `Secret` 的內容。
這是為了防止 `Secret` 意外地暴露給旁觀者或者儲存在終端日誌中。
檢查編碼資料的實際內容，請參考[解碼 secret](/zh-cn/docs/tasks/configmap-secret/managing-secret-using-kubectl/#decoding-secret).

<!-- 
If a field, such as `username`, is specified in both `data` and `stringData`,
the value from `stringData` is used. For example, the following Secret definition: 
-->
如果在 `data` 和 `stringData` 中都指定了一個欄位，比如 `username`，欄位值來自 `stringData`。
例如，下面的 Secret 定義:

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

<!-- Results in the following Secret: -->
結果有以下 Secret：

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

<!-- Where `YWRtaW5pc3RyYXRvcg==` decodes to `administrator`. -->
其中 `YWRtaW5pc3RyYXRvcg==` 解碼成 `administrator`。

<!-- ## Clean Up -->
## 清理    {#clean-up}

<!-- To delete the Secret you have created: -->
刪除你建立的 Secret：

```shell
kubectl delete secret mysecret
```

## {{% heading "whatsnext" %}}

<!-- 
- Read more about the [Secret concept](/docs/concepts/configuration/secret/)
- Learn how to [manage Secrets with the `kubectl` command](/docs/tasks/configmap-secret/managing-secret-using-kubectl/)
- Learn how to [manage Secrets using kustomize](/docs/tasks/configmap-secret/managing-secret-using-kustomize/)
-->
- 進一步閱讀 [Secret 概念](/zh-cn/docs/concepts/configuration/secret/)
- 瞭解如何[使用 `kubectl` 命令管理 Secret](/zh-cn/docs/tasks/configmap-secret/managing-secret-using-kubectl/)
- 瞭解如何[使用 kustomize 管理 Secret](/zh-cn/docs/tasks/configmap-secret/managing-secret-using-kustomize/)

