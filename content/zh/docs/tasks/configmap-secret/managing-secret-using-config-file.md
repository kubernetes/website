---
title: 使用配置文件管理 Secret
content_type: task
weight: 20
description: 使用资源配置文件创建 Secret 对象。
---
<!--  
title: Managing Secret using Configuration File
content_type: task
weight: 20
description: Creating Secret objects using resource configuration file.
-->

<!-- overview -->

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

<!-- steps -->

<!-- ## Create the Config file -->
## 创建配置文件    {#create-the-config-file}

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
你可以先用 JSON 或 YAML 格式在文件中创建 Secret，然后创建该对象。
[Secret](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#secret-v1-core)
资源包含2个键值对： `data` 和 `stringData`。
`data` 字段用来存储 base64 编码的任意数据。
提供 `stringData` 字段是为了方便，它允许 Secret 使用未编码的字符串。
`data` 和 `stringData` 的键必须由字母、数字、`-`，`_` 或 `.` 组成。

<!--  
For example, to store two strings in a Secret using the `data` field, convert
the strings to base64 as follows:
-->
例如，要使用 Secret 的 `data` 字段存储两个字符串，请将字符串转换为 base64 ，如下所示：

```shell
echo -n 'admin' | base64
```

<!-- The output is similar to: -->
输出类似于：

```
YWRtaW4=
```

```shell
echo -n '1f2d1e2e67df' | base64
```

<!-- The output is similar to: -->
输出类似于：

```
MWYyZDFlMmU2N2Rm
```

<!-- Write a Secret config file that looks like this: -->
编写一个 Secret 配置文件，如下所示：

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
注意，Secret 对象的名称必须是有效的 [DNS 子域名](/zh/docs/concepts/overview/working-with-objects/names#dns-subdomain-names). 

{{< note >}}
<!--  
The serialized JSON and YAML values of Secret data are encoded as base64
strings. Newlines are not valid within these strings and must be omitted. When
using the `base64` utility on Darwin/macOS, users should avoid using the `-b`
option to split long lines. Conversely, Linux users *should* add the option
`-w 0` to `base64` commands or the pipeline `base64 | tr -d '\n'` if the `-w`
option is not available.
-->
Secret 数据的 JSON 和 YAML 序列化结果是以 base64 编码的。
换行符在这些字符串中无效，必须省略。
在 Darwin/macOS 上使用 `base64` 工具时，用户不应该使用 `-b` 选项分割长行。
相反地，Linux 用户 *应该* 在 `base64` 地命令中添加 `-w 0` 选项，
或者在 `-w` 选项不可用的情况下，输入 `base64 | tr -d '\n'`。
{{< /note >}}

<!-- 
For certain scenarios, you may wish to use the `stringData` field instead. This
field allows you to put a non-base64 encoded string directly into the Secret,
and the string will be encoded for you when the Secret is created or updated.
-->
对于某些场景，你可能希望使用 `stringData` 字段。
这字段可以将一个非 base64 编码的字符串直接放入 Secret 中，
当创建或更新该 Secret 时，此字段将被编码。

<!--  
A practical example of this might be where you are deploying an application
that uses a Secret to store a configuration file, and you want to populate
parts of that configuration file during your deployment process.
-->
上述用例的实际场景可能是这样：当你部署应用时，使用 Secret 存储配置文件，
你希望在部署过程中，填入部分内容到该配置文件。

<!-- For example, if your application uses the following configuration file: -->
例如，如果你的应用程序使用以下配置文件:

```yaml
apiUrl: "https://my.api.com/api/v1"
username: "<user>"
password: "<password>"
```

<!-- You could store this in a Secret using the following definition: -->
你可以使用以下定义将其存储在 Secret 中:

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
## 创建 Secret 对象    {#create-the-secret-object}

<!-- Now create the Secret using [`kubectl apply`](/docs/reference/generated/kubectl/kubectl-commands#apply): -->
现在使用 [`kubectl apply`](/docs/reference/generated/kubectl/kubectl-commands#apply) 创建 Secret：

```shell
kubectl apply -f ./secret.yaml
```

<!-- The output is similar to: -->
输出类似于：

```
secret/mysecret created
```

<!-- ## Check the Secret -->
## 检查 Secret   {#check-the-secret}

<!--  
The `stringData` field is a write-only convenience field. It is never output when
retrieving Secrets. For example, if you run the following command:
-->
`stringData` 字段是只写的。获取 Secret 时，此字段永远不会输出。
例如，如果你运行以下命令：


```shell
kubectl get secret mysecret -o yaml
```

<!-- The output is similar to: -->
输出类似于：

```yaml
apiVersion: v1
kind: Secret
metadata:
  creationTimestamp: 2018-11-15T20:40:59Z
  name: mysecret
  namespace: default
  resourceVersion: "7225"
  uid: c280ad2e-e916-11e8-98f2-025000000001
type: Opaque
data:
  config.yaml: YXBpVXJsOiAiaHR0cHM6Ly9teS5hcGkuY29tL2FwaS92MSIKdXNlcm5hbWU6IHt7dXNlcm5hbWV9fQpwYXNzd29yZDoge3twYXNzd29yZH19
```

<!--  
The commands `kubectl get` and `kubectl describe` avoid showing the contents of a `Secret` by
default. This is to protect the `Secret` from being exposed accidentally to an onlooker,
or from being stored in a terminal log.
To check the actual content of the encoded data, please refer to
[decoding secret](/docs/tasks/configmap-secret/managing-secret-using-kubectl/#decoding-secret).
-->
命令 `kubectl get` 和 `kubectl describe` 默认不显示 `Secret` 的内容。
这是为了防止 `Secret` 意外地暴露给旁观者或者保存在终端日志中。
检查编码数据的实际内容，请参考[解码 secret](/zh/docs/tasks/configmap-secret/managing-secret-using-kubectl/#decoding-secret).

<!-- 
If a field, such as `username`, is specified in both `data` and `stringData`,
the value from `stringData` is used. For example, the following Secret definition: 
-->
如果在 `data` 和 `stringData` 中都指定了一个字段，比如 `username`，字段值来自 `stringData`。
例如，下面的 Secret 定义:

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
结果有以下 Secret：

```yaml
apiVersion: v1
kind: Secret
metadata:
  creationTimestamp: 2018-11-15T20:46:46Z
  name: mysecret
  namespace: default
  resourceVersion: "7579"
  uid: 91460ecb-e917-11e8-98f2-025000000001
type: Opaque
data:
  username: YWRtaW5pc3RyYXRvcg==
```

<!-- Where `YWRtaW5pc3RyYXRvcg==` decodes to `administrator`. -->
其中 `YWRtaW5pc3RyYXRvcg==` 解码成 `administrator`。

<!-- ## Clean Up -->
## 清理    {#clean-up}

<!-- To delete the Secret you have just created: -->
删除你刚才创建的 Secret：

```shell
kubectl delete secret mysecret
```

## {{% heading "whatsnext" %}}

<!-- 
- Read more about the [Secret concept](/docs/concepts/configuration/secret/)
- Learn how to [manage Secret with the `kubectl` command](/docs/tasks/configmap-secret/managing-secret-using-kubectl/)
- Learn how to [manage Secret using kustomizae](/docs/tasks/configmap-secret/managing-secret-using-kustomize/)
-->
- 进一步阅读 [Secret 概念](/zh/docs/concepts/configuration/secret/)
- 了解如何[使用 `kubectl` 命令管理 Secret](/zh/docs/tasks/configmap-secret/managing-secret-using-kubectl/)
- 了解如何[使用 kustomize 管理 Secret](/zh/docs/tasks/configmap-secret/managing-secret-using-kustomize/)

