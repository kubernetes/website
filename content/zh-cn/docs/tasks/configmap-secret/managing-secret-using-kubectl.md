---
title: 使用 kubectl 管理 Secret
content_type: task
weight: 10
description: 使用 kubectl 命令行创建 Secret 对象。
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
本页向你展示如何使用 `kubectl` 命令行工具来创建、编辑、管理和删除。 
Kubernetes {{<glossary_tooltip text="Secrets" term_id="secret">}}

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

<!-- steps -->

<!-- ## Create a Secret -->
## 创建 Secret    {#create-a-secret}

<!--
A `Secret` object stores sensitive data such as credentials
used by Pods to access services. For example, you might need a Secret to store
the username and password needed to access a database.
-->
`Secret` 对象用来存储敏感数据，如 Pod 用于访问服务的凭据。例如，为访问数据库，你可能需要一个
Secret 来存储所需的用户名及密码。

<!--
You can create the Secret by passing the raw data in the command, or by storing
the credentials in files that you pass in the command. The following commands
create a Secret that stores the username `admin` and the password `S!B\*d$zDsb=`.
-->
你可以通过在命令中传递原始数据，或将凭据存储文件中，然后再在命令行中创建 Secret。以下命令
将创建一个存储用户名 `admin` 和密码 `S!B\*d$zDsb=` 的 Secret。

<!--
### Use raw data
-->
### 使用原始数据

<!--
Run the following command:
-->
执行以下命令：

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
你必须使用单引号 `''` 转义字符串中的特殊字符，如 `$`、`\`、`*`、`=`和`!` 。否则，你的 shell
将会解析这些字符。

{{< note >}}
<!--
The `stringData` field for a Secret does not work well with server-side apply.
-->
Secret 的 `stringData` 字段与服务端应用不兼容。
{{< /note >}}

<!--
### Use source files
-->
### 使用源文件

<!--
1. Store the credentials in files:
-->
1. 将凭据保存到文件：

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
   `-n` 标志用来确保生成文件的文末没有多余的换行符。这很重要，因为当 `kubectl`
   读取文件并将内容编码为 base64 字符串时，额外的换行符也会被编码。
   你不需要对文件中包含的字符串中的特殊字符进行转义。

<!--
2. Pass the file paths in the `kubectl` command:
-->
2. 在 `kubectl` 命令中传递文件路径：

   ```shell
   kubectl create secret generic db-user-pass \
       --from-file=./username.txt \
       --from-file=./password.txt
   ```

   <!--
   The default key name is the file name. You can optionally set the key name
   using `--from-file=[key=]source`. For example:
    -->
   默认键名为文件名。你也可以通过 `--from-file=[key=]source` 设置键名，例如：

   ```shell
   kubectl create secret generic db-user-pass \
       --from-file=username=./username.txt \
       --from-file=password=./password.txt
   ```

<!--
With either method, the output is similar to:
-->
无论使用哪种方法，输出都类似于：

```
secret/db-user-pass created
```

<!--
### Verify the Secret {#verify-the-secret}
-->
## 验证 Secret  {#verify-the-secret}

<!--
Check that the Secret was created:
-->
检查 Secret 是否已创建：

```shell
kubectl get secrets
```

<!--
The output is similar to:
-->
输出类似于：

```
NAME              TYPE       DATA      AGE
db-user-pass      Opaque     2         51s
```

<!--
View the details of the Secret:
-->
查看 Secret 的细节：

```shell
kubectl describe secret db-user-pass
```

<!--
The output is similar to:
-->
输出类似于：

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
`kubectl get` 和 `kubectl describe` 命令默认不显示 `Secret` 的内容。
这是为了防止 `Secret` 被意外暴露或存储在终端日志中。

<!--
### Decode the Secret  {#decoding-secret}
-->
### 解码 Secret  {#decoding-secret}

<!--
1. View the contents of the Secret you created:
-->
1. 查看你所创建的 Secret 内容

   ```shell
   kubectl get secret db-user-pass -o jsonpath='{.data}'
   ```

   <!--
   The output is similar to:
   -->
   输出类似于：

   ```json
   { "password": "UyFCXCpkJHpEc2I9", "username": "YWRtaW4=" }
   ```

<!--
2.  Decode the `password` data:
-->
2. 解码 `password` 数据:

   ```shell
   echo 'UyFCXCpkJHpEc2I9' | base64 --decode
   ```

   <!--
   The output is similar to:
   -->
   输出类似于：

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
   这是一个出于文档编制目的的示例。实际上，该方法可能会导致包含编码数据的命令存储在
   Shell 的历史记录中。任何可以访问你的计算机的人都可以找到该命令并对 Secret 进行解码。
   更好的办法是将查看和解码命令一同使用。
   {{< /caution >}}

   ```shell
   kubectl get secret db-user-pass -o jsonpath='{.data.password}' | base64 --decode
   ```

<!--
## Edit a Secret {#edit-secret}
-->
## 编辑 Secret {#edit-secret}

<!--
You can edit an existing `Secret` object unless it is
[immutable](/docs/concepts/configuration/secret/#secret-immutable). To edit a
Secret, run the following command:
-->
你可以编辑一个现存的 `Secret` 对象，除非它是[不可改变的](/zh-cn/docs/concepts/configuration/secret/#secret-immutable)。
要想编辑一个 Secret，请执行以下命令：

```shell
kubectl edit secrets <secret-name>
```

<!--
This opens your default editor and allows you to update the base64 encoded
Secret values in the `data` field, such as in the following example:
-->
这将打开默认编辑器，并允许你更新 `data` 字段中的 base64 编码的 Secret 值，示例如下：

<!--
# Please edit the object below. Lines beginning with a '#' will be ignored,
# and an empty file will abort the edit. If an error occurs while saving this file, it will be
# reopened with the relevant failures.
#
-->

```yaml
#请编辑下面的对象。以“#”开头的行将被忽略，
#空文件将中止编辑。如果在保存此文件时发生错误，
#则将重新打开该文件并显示相关的失败。
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
要想删除一个 Secret，请执行以下命令：

```shell
kubectl delete secret db-user-pass
```

## {{% heading "whatsnext" %}}

<!--
- Read more about the [Secret concept](/docs/concepts/configuration/secret/)
- Learn how to [manage Secrets using config file](/docs/tasks/configmap-secret/managing-secret-using-config-file/)
- Learn how to [manage Secrets using kustomize](/docs/tasks/configmap-secret/managing-secret-using-kustomize/)
-->
- 进一步阅读 [Secret 概念](/zh-cn/docs/concepts/configuration/secret/)
- 了解如何[使用配置文件管理 Secret](/zh-cn/docs/tasks/configmap-secret/managing-secret-using-config-file/)
- 了解如何[使用 Kustomize 管理 Secret](/zh-cn/docs/tasks/configmap-secret/managing-secret-using-kustomize/)
