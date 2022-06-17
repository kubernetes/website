---
title: 使用 kubectl 管理 Secret
content_type: task
weight: 10
description: 使用 kubectl 命令列建立 Secret 物件。
---
<!--
title: Managing Secrets using kubectl
content_type: task
weight: 10
description: Creating Secret objects using kubectl command line.
-->

<!-- overview -->

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

<!-- steps -->

<!-- ## Create a Secret -->
## 建立 Secret    {#create-a-secret}

<!--
A `Secret` can contain user credentials required by pods to access a database.
For example, a database connection string consists of a username and password.
You can store the username in a file `./username.txt` and the password in a
file `./password.txt` on your local machine.
 -->
一個 `Secret` 可以包含 Pod 訪問資料庫所需的使用者憑證。
例如，由使用者名稱和密碼組成的資料庫連線字串。
你可以在本地計算機上，將使用者名稱儲存在檔案 `./username.txt` 中，將密碼儲存在檔案 `./password.txt` 中。

```shell
echo -n 'admin' > ./username.txt
echo -n '1f2d1e2e67df' > ./password.txt
```

<!--
In these commands, the `-n` flag ensures that the generated files do not have
an extra newline character at the end of the text. This is important because
when `kubectl` reads a file and encodes the content into a base64 string, the
extra newline character gets encoded too.
-->
在這些命令中，`-n` 標誌確保生成的檔案在文字末尾不包含額外的換行符。
這一點很重要，因為當 `kubectl` 讀取檔案並將內容編碼為 base64 字串時，多餘的換行符也會被編碼。

<!--
The `kubectl create secret` command packages these files into a Secret and creates
the object on the API server.
-->
`kubectl create secret` 命令將這些檔案打包成一個 Secret 並在 API 伺服器上建立物件。

```shell
kubectl create secret generic db-user-pass \
  --from-file=./username.txt \
  --from-file=./password.txt
```

<!-- The output is similar to: -->
輸出類似於：

```
secret/db-user-pass created
```

<!--
The default key name is the filename. You can optionally set the key name using
`--from-file=[key=]source`. For example:
-->
預設金鑰名稱是檔名。 你可以選擇使用 `--from-file=[key=]source` 來設定金鑰名稱。例如：

```shell
kubectl create secret generic db-user-pass \
  --from-file=username=./username.txt \
  --from-file=password=./password.txt
```

<!--
You do not need to escape special characters in password strings that you 
include in a file.
-->
你不需要對檔案中包含的密碼字串中的特殊字元進行轉義。

<!--
You can also provide Secret data using the `--from-literal=<key>=<value>` tag.
This tag can be specified more than once to provide multiple key-value pairs.
Note that special characters such as `$`, `\`, `*`, `=`, and `!` will be
interpreted by your [shell](https://en.wikipedia.org/wiki/Shell_(computing))
and require escaping.

In most shells, the easiest way to escape the password is to surround it with
single quotes (`'`). For example, if your password is `S!B\*d$zDsb=`,
run the following command:
-->
你還可以使用 `--from-literal=<key>=<value>` 標籤提供 Secret 資料。
可以多次使用此標籤，提供多個鍵值對。
請注意，特殊字元（例如：`$`，`\`，`*`，`=` 和 `!`）由你的 [shell](https://en.wikipedia.org/wiki/Shell_(computing))
解釋執行，而且需要轉義。

在大多數 shell 中，轉義密碼最簡便的方法是用單引號括起來。
比如，如果你的密碼是 `S!B\*d$zDsb=`， 
可以像下面一樣執行命令：

```shell
kubectl create secret generic db-user-pass \
  --from-literal=username=devuser \
  --from-literal=password='S!B\*d$zDsb='
```

<!-- ## Verify the Secret -->
## 驗證 Secret    {#verify-the-secret}

<!-- Check that the Secret was created: -->
檢查 secret 是否已建立：

```shell
kubectl get secrets
```

<!-- The output is similar to: -->
輸出類似於：

```
NAME                  TYPE                                  DATA      AGE
db-user-pass          Opaque                                2         51s
```

<!-- You can view a description of the `Secret`: -->
你可以檢視 `Secret` 的描述：

```shell
kubectl describe secrets/db-user-pass
```

<!-- The output is similar to: -->
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
這是為了防止 `Secret` 被意外暴露或儲存在終端日誌中。

<!-- ## Decoding the Secret  {#decoding-secret} -->
## 解碼 Secret  {#decoding-secret}

<!--
To view the contents of the Secret you created, run the following command:
-->
要檢視建立的 Secret 的內容，執行以下命令：

```shell
kubectl get secret db-user-pass -o jsonpath='{.data}'
```

<!-- The output is similar to: -->
輸出類似於：

```json
{"password":"MWYyZDFlMmU2N2Rm","username":"YWRtaW4="}
```

<!-- 
Now you can decode the `password` data:
-->
現在你可以解碼 `password` 的資料：

```shell
# 這是一個用於文件說明的示例。
# 如果你這樣做，資料 'MWYyZDFlMmU2N2Rm' 可以儲存在你的 shell 歷史中。
# 可以進入你電腦的人可以找到那個記住的命令並可以在你不知情的情況下 base-64 解碼這個 Secret。
# 通常最好將這些步驟結合起來，如頁面後面所示。
echo 'MWYyZDFlMmU2N2Rm' | base64 --decode
```

<!-- The output is similar to: -->
輸出類似於：

```
1f2d1e2e67df
```

<!--
In order to avoid storing a secret encoded value in your shell history, you can
run the following command:
-->
為了避免在 shell 歷史記錄中儲存 Secret 的編碼值，可以執行如下命令:

```shell
kubectl get secret db-user-pass -o jsonpath='{.data.password}' | base64 --decode
```

<!--
The output shall be similar as above.
-->
輸出應與上述類似。

<!-- ## Clean Up -->
## 清理    {#clean-up}

<!-- Delete the Secret you created: -->
刪除建立的 Secret：

```shell
kubectl delete secret db-user-pass
```

<!-- discussion -->

## {{% heading "whatsnext" %}}

<!--
- Read more about the [Secret concept](/docs/concepts/configuration/secret/)
- Learn how to [manage Secrets using config files](/docs/tasks/configmap-secret/managing-secret-using-config-file/)
- Learn how to [manage Secrets using kustomize](/docs/tasks/configmap-secret/managing-secret-using-kustomize/)
-->
- 進一步閱讀 [Secret 概念](/zh-cn/docs/concepts/configuration/secret/)
- 瞭解如何[使用配置檔案管理 Secret](/zh-cn/docs/tasks/configmap-secret/managing-secret-using-config-file/)
- 瞭解如何[使用 kustomize 管理 Secret](/zh-cn/docs/tasks/configmap-secret/managing-secret-using-kustomize/)
