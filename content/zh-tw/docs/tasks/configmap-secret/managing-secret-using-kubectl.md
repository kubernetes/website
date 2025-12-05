---
title: 使用 kubectl 管理 Secret
content_type: task
weight: 10
description: 使用 kubectl 命令列創建 Secret 對象。
---
<!--
title: Managing Secrets using kubectl
content_type: task
weight: 10
description: Creating Secret objects using kubectl command line.
-->

<!-- overview -->

<!--
This page shows you how to create, edit, manage, and delete Kubernetes
{{<glossary_tooltip text="Secrets" term_id="secret">}} using the `kubectl`
command-line tool.
-->
本頁向你展示如何使用 `kubectl` 命令列工具來創建、編輯、管理和刪除。 
Kubernetes {{<glossary_tooltip text="Secrets" term_id="secret">}}

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

<!-- steps -->

<!-- ## Create a Secret -->
## 創建 Secret    {#create-a-secret}

<!--
A `Secret` object stores sensitive data such as credentials
used by Pods to access services. For example, you might need a Secret to store
the username and password needed to access a database.
-->
`Secret` 對象用來儲存敏感資料，如 Pod 用於訪問服務的憑據。例如，爲訪問資料庫，你可能需要一個
Secret 來儲存所需的使用者名及密碼。

<!--
You can create the Secret by passing the raw data in the command, or by storing
the credentials in files that you pass in the command. The following commands
create a Secret that stores the username `admin` and the password `S!B\*d$zDsb=`.
-->
你可以通過在命令中傳遞原始資料，或將憑據儲存檔案中，然後再在命令列中創建 Secret。以下命令
將創建一個儲存使用者名 `admin` 和密碼 `S!B\*d$zDsb=` 的 Secret。

<!--
### Use raw data
-->
### 使用原始資料

<!--
Run the following command:
-->
執行以下命令：

```shell
kubectl create secret generic db-user-pass \
    --from-literal=username=admin \
    --from-literal=password='S!B\*d$zDsb='
```

<!--
You must use single quotes `''` to escape special characters such as `$`, `\`,
`*`, `=`, and `!` in your strings. If you don't, your shell will interpret these
characters.
-->
你必須使用單引號 `''` 轉義字符串中的特殊字符，如 `$`、`\`、`*`、`=`和`!` 。否則，你的 shell
將會解析這些字符。

{{< note >}}
<!--
The `stringData` field for a Secret does not work well with server-side apply.
-->
Secret 的 `stringData` 字段與服務端應用不兼容。
{{< /note >}}

<!--
### Use source files
-->
### 使用源檔案

<!--
1. Store the credentials in files:
-->
1. 將憑據保存到檔案：

   ```shell
   echo -n 'admin' > ./username.txt
   echo -n 'S!B\*d$zDsb=' > ./password.txt
   ```

   <!--
   The `-n` flag ensures that the generated files do not have an extra newline
   character at the end of the text. This is important because when `kubectl`
   reads a file and encodes the content into a base64 string, the extra
   newline character gets encoded too. You do not need to escape special
   characters in strings that you include in a file.
   -->
   `-n` 標誌用來確保生成檔案的文末沒有多餘的換行符。這很重要，因爲當 `kubectl`
   讀取檔案並將內容編碼爲 base64 字符串時，額外的換行符也會被編碼。
   你不需要對檔案中包含的字符串中的特殊字符進行轉義。

<!--
2. Pass the file paths in the `kubectl` command:
-->
2. 在 `kubectl` 命令中傳遞檔案路徑：

   ```shell
   kubectl create secret generic db-user-pass \
       --from-file=./username.txt \
       --from-file=./password.txt
   ```

   <!--
   The default key name is the file name. You can optionally set the key name
   using `--from-file=[key=]source`. For example:
    -->
   預設鍵名爲檔案名。你也可以通過 `--from-file=[key=]source` 設置鍵名，例如：

   ```shell
   kubectl create secret generic db-user-pass \
       --from-file=username=./username.txt \
       --from-file=password=./password.txt
   ```

<!--
With either method, the output is similar to:
-->
無論使用哪種方法，輸出都類似於：

```
secret/db-user-pass created
```

<!--
### Verify the Secret {#verify-the-secret}
-->
## 驗證 Secret  {#verify-the-secret}

<!--
Check that the Secret was created:
-->
檢查 Secret 是否已創建：

```shell
kubectl get secrets
```

<!--
The output is similar to:
-->
輸出類似於：

```
NAME              TYPE       DATA      AGE
db-user-pass      Opaque     2         51s
```

<!--
View the details of the Secret:
-->
查看 Secret 的細節：

```shell
kubectl describe secret db-user-pass
```

<!--
The output is similar to:
-->
輸出類似於：

```
Name:            db-user-pass
Namespace:       default
Labels:          <none>
Annotations:     <none>

Type:            Opaque

Data
====
password:    12 bytes
username:    5 bytes
```

<!--
The commands `kubectl get` and `kubectl describe` avoid showing the contents
of a `Secret` by default. This is to protect the `Secret` from being exposed
accidentally, or from being stored in a terminal log.
-->
`kubectl get` 和 `kubectl describe` 命令預設不顯示 `Secret` 的內容。
這是爲了防止 `Secret` 被意外暴露或儲存在終端日誌中。

<!--
### Decode the Secret  {#decoding-secret}
-->
### 解碼 Secret  {#decoding-secret}

<!--
1. View the contents of the Secret you created:
-->
1. 查看你所創建的 Secret 內容

   ```shell
   kubectl get secret db-user-pass -o jsonpath='{.data}'
   ```

   <!--
   The output is similar to:
   -->
   輸出類似於：

   ```json
   { "password": "UyFCXCpkJHpEc2I9", "username": "YWRtaW4=" }
   ```

<!--
2.  Decode the `password` data:
-->
2. 解碼 `password` 資料:

   ```shell
   echo 'UyFCXCpkJHpEc2I9' | base64 --decode
   ```

   <!--
   The output is similar to:
   -->
   輸出類似於：

   ```
   S!B\*d$zDsb=
   ```

   {{< caution >}}
   <!--
   This is an example for documentation purposes. In practice,
   this method could cause the command with the encoded data to be stored in
   your shell history. Anyone with access to your computer could find the
   command and decode the secret. A better approach is to combine the view and
   decode commands.
   -->
   這是一個出於文檔編制目的的示例。實際上，該方法可能會導致包含編碼資料的命令儲存在
   Shell 的歷史記錄中。任何可以訪問你的計算機的人都可以找到該命令並對 Secret 進行解碼。
   更好的辦法是將查看和解碼命令一同使用。
   {{< /caution >}}

   ```shell
   kubectl get secret db-user-pass -o jsonpath='{.data.password}' | base64 --decode
   ```

<!--
## Edit a Secret {#edit-secret}
-->
## 編輯 Secret {#edit-secret}

<!--
You can edit an existing `Secret` object unless it is
[immutable](/docs/concepts/configuration/secret/#secret-immutable). To edit a
Secret, run the following command:
-->
你可以編輯一個現存的 `Secret` 對象，除非它是[不可改變的](/zh-cn/docs/concepts/configuration/secret/#secret-immutable)。
要想編輯一個 Secret，請執行以下命令：

```shell
kubectl edit secrets <secret-name>
```

<!--
This opens your default editor and allows you to update the base64 encoded
Secret values in the `data` field, such as in the following example:
-->
這將打開預設編輯器，並允許你更新 `data` 字段中的 base64 編碼的 Secret 值，示例如下：

<!--
# Please edit the object below. Lines beginning with a '#' will be ignored,
# and an empty file will abort the edit. If an error occurs while saving this file, it will be
# reopened with the relevant failures.
#
-->

```yaml
#請編輯下面的對象。以“#”開頭的行將被忽略，
#空文件將中止編輯。如果在保存此文件時發生錯誤，
#則將重新打開該文件並顯示相關的失敗。
apiVersion: v1
data:
  password: UyFCXCpkJHpEc2I9
  username: YWRtaW4=
kind: Secret
metadata:
  creationTimestamp: "2022-06-28T17:44:13Z"
  name: db-user-pass
  namespace: default
  resourceVersion: "12708504"
  uid: 91becd59-78fa-4c85-823f-6d44436242ac
type: Opaque
```

<!--
## Clean up
-->
## 清理    {#clean-up}

<!--
To delete a Secret, run the following command:
-->
要想刪除一個 Secret，請執行以下命令：

```shell
kubectl delete secret db-user-pass
```

## {{% heading "whatsnext" %}}

<!--
- Read more about the [Secret concept](/docs/concepts/configuration/secret/)
- Learn how to [manage Secrets using config file](/docs/tasks/configmap-secret/managing-secret-using-config-file/)
- Learn how to [manage Secrets using kustomize](/docs/tasks/configmap-secret/managing-secret-using-kustomize/)
-->
- 進一步閱讀 [Secret 概念](/zh-cn/docs/concepts/configuration/secret/)
- 瞭解如何[使用設定檔案管理 Secret](/zh-cn/docs/tasks/configmap-secret/managing-secret-using-config-file/)
- 瞭解如何[使用 Kustomize 管理 Secret](/zh-cn/docs/tasks/configmap-secret/managing-secret-using-kustomize/)
