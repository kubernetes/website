---
title: 使用 kubectl 管理 Secret
content_type: task
weight: 10
description: 使用 kubectl 命令行创建 Secret 对象。
---
<!--
title: Managing Secret using kubectl
content_type: task
weight: 10
description: Creating Secret objects using kubectl command line.
-->

<!-- overview -->

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

<!-- steps -->

<!-- ## Create a Secret -->
## 创建 Secret    {#create-a-secret}

<!--
A `Secret` can contain user credentials required by Pods to access a database.
For example, a database connection string consists of a username and password.
You can store the username in a file `./username.txt` and the password in a
file `./password.txt` on your local machine.
 -->
一个 `Secret` 可以包含 Pod 访问数据库所需的用户凭证。
例如，由用户名和密码组成的数据库连接字符串。
你可以在本地计算机上，将用户名存储在文件 `./username.txt` 中，将密码存储在文件 `./password.txt` 中。

```shell
echo -n 'admin' > ./username.txt
echo -n '1f2d1e2e67df' > ./password.txt
```

<!--
The `-n` flag in the above two commands ensures that the generated files will
not contain an extra newline character at the end of the text. This is
important because when `kubectl` reads a file and encode the content into
base64 string, the extra newline character gets encoded too.
-->
上面两个命令中的 `-n` 标志确保生成的文件在文本末尾不包含额外的换行符。
这一点很重要，因为当 `kubectl` 读取文件并将内容编码为 base64 字符串时，多余的换行符也会被编码。

<!--
The `kubectl create secret` command packages these files into a Secret and creates
the object on the API server.
-->
`kubectl create secret` 命令将这些文件打包成一个 Secret 并在 API 服务器上创建对象。

```shell
kubectl create secret generic db-user-pass \
  --from-file=./username.txt \
  --from-file=./password.txt
```

<!-- The output is similar to: -->
输出类似于：

```
secret/db-user-pass created
```

<!--
Default key name is the filename. You may optionally set the key name using
`--from-file=[key=]source`. For example:
-->
默认密钥名称是文件名。 你可以选择使用 `--from-file=[key=]source` 来设置密钥名称。例如：

```shell
kubectl create secret generic db-user-pass \
  --from-file=username=./username.txt \
  --from-file=password=./password.txt
```

<!--
You do not need to escape special characters in passwords from files
().
-->
你无需转义文件（`--from-file`）中的密码的特殊字符。

<!--
You can also provide Secret data using the `--from-literal=<key>=<value>` tag.
This tag can be specified more than once to provide multiple key-value pairs.
Note that special characters such as `$`, `\`, `*`, `=`, and `!` will be
interpreted by your [shell](https://en.wikipedia.org/wiki/Shell_(computing))
and require escaping.
In most shells, the easiest way to escape the password is to surround it with
single quotes (`'`).  For example, if your actual password is `S!B\*d$zDsb=`,
you should execute the command this way:
-->
你还可以使用 `--from-literal=<key>=<value>` 标签提供 Secret 数据。
可以多次使用此标签，提供多个键值对。
请注意，特殊字符（例如：`$`，`\`，`*`，`=` 和 `!`）由你的 [shell](https://en.wikipedia.org/wiki/Shell_(computing)) 解释执行，而且需要转义。
在大多数 shell 中，转义密码最简便的方法是用单引号括起来。
比如，如果你的密码是 `S!B\*d$zDsb=`， 
可以像下面一样执行命令：

```shell
kubectl create secret generic dev-db-secret \
  --from-literal=username=devuser \
  --from-literal=password='S!B\*d$zDsb='
```

<!-- ## Verify the Secret -->
## 验证 Secret    {#verify-the-secret}

<!-- You can check that the secret was created: -->
你可以检查 secret 是否已创建：

```shell
kubectl get secrets
```

<!-- The output is similar to: -->
输出类似于：

```
NAME                  TYPE                                  DATA      AGE
db-user-pass          Opaque                                2         51s
```

<!-- You can view a description of the `Secret`: -->
你可以查看 `Secret` 的描述：

```shell
kubectl describe secrets/db-user-pass
```

<!-- The output is similar to: -->
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
accidentally to an onlooker, or from being stored in a terminal log.
-->
`kubectl get` 和 `kubectl describe` 命令默认不显示 `Secret` 的内容。
这是为了防止 `Secret` 被意外暴露给旁观者或存储在终端日志中。

<!-- ## Decoding the Secret  {#decoding-secret} -->
## 解码 Secret  {#decoding-secret}

<!--
To view the contents of the Secret we just created, you can run the following
command:
-->
要查看我们刚刚创建的 Secret 的内容，可以运行以下命令：

```shell
kubectl get secret db-user-pass -o jsonpath='{.data}'
```

<!-- The output is similar to: -->
输出类似于：

```json
{"password":"MWYyZDFlMmU2N2Rm","username":"YWRtaW4="}
```

<!-- 
Now you can decode the `password` data:
-->
现在你可以解码 `password` 的数据：

```shell
echo 'MWYyZDFlMmU2N2Rm' | base64 --decode
```

<!-- The output is similar to: -->
输出类似于：

```
1f2d1e2e67df
```

<!-- ## Clean Up -->
## 清理    {#clean-up}

<!-- To delete the Secret you have just created: -->
删除刚刚创建的 Secret：

```shell
kubectl delete secret db-user-pass
```

<!-- discussion -->

## {{% heading "whatsnext" %}}

<!--
- Read more about the [Secret concept](/docs/concepts/configuration/secret/)
- Learn how to [manage Secret using config file](/docs/tasks/configmap-secret/managing-secret-using-config-file/)
- Learn how to [manage Secret using kustomize](/docs/tasks/configmap-secret/managing-secret-using-kustomize/)
-->
- 进一步阅读 [Secret 概念](/zh/docs/concepts/configuration/secret/)
- 了解如何[使用配置文件管理 Secret](/zh/docs/tasks/configmap-secret/managing-secret-using-config-file/)
- 了解如何[使用 kustomize 管理 Secret](/zh/docs/tasks/configmap-secret/managing-secret-using-kustomize/)
