---
title: Secret
content_type: concept
feature:
  title: Secret 和配置管理
  description: >
    部署和更新 Secrets 和应用程序的配置而不必重新构建容器镜像，且
    不必将软件堆栈配置中的秘密信息暴露出来。
weight: 30
---
<!--
reviewers:
- mikedanese
title: Secrets
content_type: concept
feature:
  title: Secret and configuration management
  description: >
    Deploy and update secrets and application configuration without rebuilding your image and without exposing secrets in your stack configuration.
weight: 30
-->

<!-- overview -->

<!--
Kubernetes `secret` objects let you store and manage sensitive information, such
as passwords, OAuth tokens, and ssh keys.  Putting this information in a `secret`
is safer and more flexible than putting it verbatim in a
{{< glossary_tooltip term_id="pod" >}} definition or in a {{< glossary_tooltip text="container image" term_id="image" >}}. See [Secrets design document](https://git.k8s.io/community/contributors/design-proposals/auth/secrets.md) for more information.
-->

`Secret` 对象类型用来保存敏感信息，例如密码、OAuth 令牌和 SSH 密钥。
将这些信息放在 `secret` 中比放在 {{< glossary_tooltip term_id="pod" >}} 的定义或者 {{< glossary_tooltip text="容器镜像" term_id="image" >}} 中来说更加安全和灵活。
参阅 [Secret 设计文档](https://git.k8s.io/community/contributors/design-proposals/auth/secrets.md) 获取更多详细信息。

<!-- body -->

<!--
## Overview of Secrets

A Secret is an object that contains a small amount of sensitive data such as
a password, a token, or a key.  Such information might otherwise be put in a
Pod specification or in an image.  Users can create secrets and the system
also creates some secrets.

-->
## Secret 概览

Secret 是一种包含少量敏感信息例如密码、令牌或密钥的对象。
这样的信息可能会被放在 Pod 规约中或者镜像中。
用户可以创建 Secret，同时系统也创建了一些 Secret。

<!--
To use a secret, a Pod needs to reference the secret.
A secret can be used with a Pod in three ways:

- As [files](#using-secrets-as-files-from-a-pod) in a
{{< glossary_tooltip text="volume" term_id="volume" >}} mounted on one or more of
its containers.
- As [container environment variable](#using-secrets-as-environment-variables).
- By the [kubelet when pulling images](#using-imagepullsecrets) for the Pod.
-->
要使用 Secret，Pod 需要引用 Secret。
Pod 可以用三种方式之一来使用 Secret：

- 作为挂载到一个或多个容器上的 {{< glossary_tooltip text="卷" term_id="volume" >}}
  中的[文件](#using-secrets-as-files-from-a-pod)。
- 作为[容器的环境变量](#using-secrets-as-environment-variables)
- 由 [kubelet 在为 Pod 拉取镜像时使用](#using-imagepullsecrets)

<!--
### Built-in Secrets

#### Service Accounts Automatically Create and Attach Secrets with API Credentials

Kubernetes automatically creates secrets which contain credentials for
accessing the API and it automatically modifies your pods to use this type of
secret.
-->
### 内置 Secret

#### 服务账号使用 API 凭证自动创建和附加 Secret

Kubernetes 自动创建包含访问 API 凭据的 Secret，并自动修改你的 Pod 以使用此类型的 Secret。

<!--
The automatic creation and use of API credentials can be disabled or overridden
if desired.  However, if all you need to do is securely access the API server,
this is the recommended workflow.

See the [Service Account](/docs/tasks/configure-pod-container/configure-service-account/)
documentation for more information on how Service Accounts work.
-->
如果需要，可以禁用或覆盖自动创建和使用 API 凭据。
但是，如果您需要的只是安全地访问 API 服务器，我们推荐这样的工作流程。

参阅[服务账号](/zh/docs/tasks/configure-pod-container/configure-service-account/)
文档了解关于服务账号如何工作的更多信息。

<!--
### Creating your own Secrets

#### Creating a Secret Using kubectl create secret

Secrets can contain user credentials required by Pods to access a database.
For example, a database connection string
consists of a username and password. You can store the username in a file `./username.txt`
and the password in a file `./password.txt` on your local machine.
-->
### 创建您自己的 Secret

#### 使用 `kubectl` 创建 Secret

Secret 中可以包含 Pod 访问数据库时需要的用户凭证信息。
例如，某个数据库连接字符串可能包含用户名和密码。
你可以将用户名和密码保存在本地机器的 `./username.txt` 和 `./password.txt` 文件里。

```shell
# 创建本例中要使用的文件
echo -n 'admin' > ./username.txt
echo -n '1f2d1e2e67df' > ./password.txt
```

<!--
The `kubectl create secret` command packages these files into a Secret and creates
the object on the API Server.
The name of a Secret object must be a valid
[DNS subdomain name](/docs/concepts/overview/working-with-objects/names#dns-subdomain-names).
-->

`kubectl create secret` 命令将这些文件打包到一个 Secret 中并在 API server 中创建了一个对象。
Secret 对象的名称必须是合法的 [DNS 子域名](/zh/docs/concepts/overview/working-with-objects/names#dns-subdomain-names)。

```shell
kubectl create secret generic db-user-pass --from-file=./username.txt --from-file=./password.txt
```

输出类似于：

```
secret "db-user-pass" created
```

<!--
Default key name is the filename. You may optionally set the key name using `[--from-file=[key=]source]`.
-->
默认的键名是文件名。你也可以使用 `[--from-file=[key=]source]` 参数来设置键名。

```shell
kubectl create secret generic db-user-pass \
  --from-file=username=./username.txt \
  --from-file=password=./password.txt
```

<!--
Special characters such as `$`, `\`, `*`, `=`, and `!` will be interpreted by your [shell](https://en.wikipedia.org/wiki/Shell_(computing)) and require escaping.
In most shells, the easiest way to escape the password is to surround it with single quotes (`'`).
For example, if your actual password is `S!B\*d$zDsb=`, you should execute the command this way:

```
kubectl create secret generic dev-db-secret \
  --from-literal=username=devuser \
  --from-literal=password='S!B\*d$zDsb='
```

You do not need to escape special characters in passwords from files (`--from-file`).
 -->
{{< note >}}
特殊字符（例如 `$`、`*`、`*`、`=` 和 `!`）可能会被你的
[Shell](https://en.wikipedia.org/wiki/Shell_(computing)) 解析，因此需要转义。
在大多数 Shell 中，对密码进行转义的最简单方式是使用单引号（`'`）将其扩起来。
例如，如果您的实际密码是 `S!B\*d$zDsb=` ，则应通过以下方式执行命令：

```
kubectl create secret generic dev-db-secret \
  --from-literal=username=devuser \
  --from-literal=password='S!B\*d$zDsb='
```

您无需对文件中保存（`--from-file`）的密码中的特殊字符执行转义操作。
{{< /note >}}

<!--
You can check that the secret was created like this:
-->
您可以这样检查刚创建的 Secret：

```shell
kubectl get secrets
```

其输出类似于：

```
NAME                  TYPE                                  DATA      AGE
db-user-pass          Opaque                                2         51s
```

<!--
You can view a description of the secret:
-->
你可以查看 Secret 的描述：

```shell
kubectl describe secrets/db-user-pass
```

其输出类似于：

```
Name:            db-user-pass
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
`kubectl get` and `kubectl describe` avoid showing the contents of a secret by
default.
This is to protect the secret from being exposed accidentally to an onlooker,
or from being stored in a terminal log.
-->
{{< note >}}
默认情况下，`kubectl get` 和 `kubectl describe` 避免显示密码的内容。
这是为了防止机密被意外地暴露给旁观者或存储在终端日志中。
{{< /note >}}

<!--
See [decoding secret](#decoding-secret) for how to see the contents of a secret.
-->
请参阅[解码 Secret](#decoding-secret) 了解如何查看 Secret 的内容。

<!--
#### Creating a Secret Manually

You can also create a Secret in a file first, in JSON or YAML format,
and then create that object.
The name of a Secret object must be a valid
[DNS subdomain name](/docs/concepts/overview/working-with-objects/names#dns-subdomain-names).
The [Secret](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#secret-v1-core)
contains two maps:
`data` and `stringData`. The `data` field is used to store arbitrary data, encoded using
base64. The stringData field is provided for convenience, and allows you to provide
secret data as unencoded strings.
-->
#### 手动创建 Secret

您也可以先以 JSON 或 YAML 格式文件创建一个 Secret，然后创建该对象。
Secret 对象的名称必须是合法的 [DNS 子域名](/zh/docs/concepts/overview/working-with-objects/names#dns-subdomain-names)。
[Secret](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#secret-v1-core)
包含两个映射：`data` 和 `stringData`。
`data` 字段用于存储使用 base64 编码的任意数据。
提供 `stringData` 字段是为了方便，允许您用未编码的字符串提供机密数据。

<!--
For example, to store two strings in a Secret using the data field, convert
them to base64 as follows:
-->
例如，要使用 `data` 字段将两个字符串存储在 Secret 中，请按如下所示将它们转换为 base64：

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

<!--
Write a Secret that looks like this:
-->

现在可以像这样写一个 Secret 对象：

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
Now create the Secret using [`kubectl apply`](/docs/reference/generated/kubectl/kubectl-commands#apply):
-->
使用 [`kubectl apply`](/docs/reference/generated/kubectl/kubectl-commands#apply) 创建 Secret 对象：

```shell
kubectl apply -f ./secret.yaml
```

<!--The output is similar to: -->
输出类似于：

```
secret "mysecret" created
```

<!--
For certain scenarios, you may wish to use the stringData field instead. This
field allows you to put a non-base64 encoded string directly into the Secret,
and the string will be encoded for you when the Secret is created or updated.

A practical example of this might be where you are deploying an application
that uses a Secret to store a configuration file, and you want to populate
parts of that configuration file during your deployment process.

If your application uses the following configuration file:
-->
在某些情况下，你可能希望改用 stringData 字段。
此字段允许您将非 base64 编码的字符串直接放入 Secret 中，
并且在创建或更新 Secret 时将为您编码该字符串。

下面的一个实践示例提供了一个参考。
你正在部署使用 Secret 存储配置文件的应用程序，并希望在部署过程中填齐配置文件的部分内容。

如果您的应用程序使用以下配置文件：

```yaml
apiUrl: "https://my.api.com/api/v1"
username: "user"
password: "password"
```

<!-- You could store this in a Secret using the following: -->

您可以使用以下方法将其存储在Secret中：

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: mysecret
type: Opaque
stringData:
  config.yaml: |-
    apiUrl: "https://my.api.com/api/v1"
    username: {{username}}
    password: {{password}}
```

<!--
Your deployment tool could then replace the `{{username}}` and `{{password}}`
template variables before running `kubectl apply`.

stringData is a write-only convenience field. It is never output when
retrieving Secrets. For example, if you run the following command:
-->

然后，您的部署工具可以在执行 `kubectl apply` 之前替换模板的 `{{username}}` 和 `{{password}}` 变量。
stringData 是只写的便利字段。检索 Secrets 时永远不会被输出。例如，如果您运行以下命令：


```shell
kubectl get secret mysecret -o yaml
```

<!--
The output will be similar to:
-->
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
If a field is specified in both data and stringData, the value from stringData
is used. For example, the following Secret definition:
-->

如果在 data 和 stringData 中都指定了某一字段，则使用 stringData 中的值。
例如，以下是 Secret 定义：

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

<!--
Results in the following secret:
-->
secret 中的生成结果：

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

<!--
Where `YWRtaW5pc3RyYXRvcg==` decodes to `administrator`.
-->
其中的 `YWRtaW5pc3RyYXRvcg==` 解码后即是 `administrator`。

<!--
The keys of data and stringData must consist of alphanumeric characters,
'-', '_' or '.'.

The serialized JSON and YAML values of secret data are
encoded as base64 strings.  Newlines are not valid within these strings and must
be omitted.  When using the `base64` utility on Darwin/macOS users should avoid
using the `-b` option to split long lines.  Conversely Linux users *should* add
the option `-w 0` to `base64` commands or the pipeline `base64 | tr -d '\n'` if
`-w` option is not available.
-->
data 和 stringData 的键必须由字母数字字符 '-', '\_' 或者 '.' 组成。

{{< note >}}
Secret 数据在序列化为 JSON 和 YAML 时，其值被编码为 base64 字符串。
换行符在这些字符串中是非法的，因此必须省略。
在 Darwin/macOS 上使用 `base64` 实用程序时，用户应避免使用 `-b` 选项来分隔长行。
相反，Linux用户 *应该* 在 `base64` 命令中添加选项 `-w 0` ，
或者，如果 `-w` 选项不可用的情况下，执行 `base64 | tr -d '\n'`。
{{< /note >}}

<!--
#### Creating a Secret from Generator

Since Kubernetes v1.14, `kubectl` supports [managing objects using Kustomize](/docs/tasks/manage-kubernetes-objects/kustomization/). Kustomize provides resource Generators to
create Secrets and ConfigMaps. The Kustomize generators should be specified in a
`kustomization.yaml` file inside a directory. After generating the Secret,
you can create the Secret on the API server with `kubectl apply`.
-->
#### 从生成器创建 Secret

Kubectl 从 1.14 版本开始支持[使用 Kustomize 管理对象](/zh/docs/tasks/manage-kubernetes-objects/kustomization/)。
Kustomize 提供资源生成器创建 Secret 和 ConfigMaps。
Kustomize 生成器要在当前目录内的 `kustomization.yaml` 中指定。
生成 Secret 之后，使用 `kubectl apply` 在 API 服务器上创建对象。

<!--
#### Generating a Secret from files

You can generate a Secret by defining a `secretGenerator` from the
files ./username.txt and ./password.txt:
-->
#### 从文件生成 Secret   {#generating-a-secret-from-files}

你可以通过定义基于文件 `./username.txt` 和 `./password.txt` 的
`secretGenerator` 来生成一个 Secret。

```shell
cat <<EOF >./kustomization.yaml
secretGenerator:
- name: db-user-pass
  files:
  - username.txt
  - password.txt
EOF
```

<!--
Apply the directory, containing the `kustomization.yaml`, to create the Secret.
-->
应用包含 `kustomization.yaml` 目录以创建 Secret 对象。

```shell
kubectl apply -k .
```

<!-- The output is similar to: -->
输出类似于：

```
secret/db-user-pass-96mffmfh4k created
```

<!--
You can check that the secret was created like this:
-->
您可以检查 Secret 是否创建成功：

```shell
kubectl get secrets
```

<!-- The output is similar to: -->
输出类似于：

```
NAME                             TYPE                                  DATA      AGE
db-user-pass-96mffmfh4k          Opaque                                2         51s

$ kubectl describe secrets/db-user-pass-96mffmfh4k
Name:            db-user-pass
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
#### Generating a Secret from string literals

You can create a Secret by defining a `secretGenerator`
from literals `username=admin` and `password=secret`:
-->
#### 基于字符串值来创建 Secret  {#generating-a-secret-from-string-literals}

你可以通过定义使用字符串值 `username=admin` 和 `password=secret`
的 `secretGenerator` 来创建 Secret。

```shell
cat <<EOF >./kustomization.yaml
secretGenerator:
- name: db-user-pass
  literals:
  - username=admin
  - password=secret
EOF
```
<!--
Apply the directory, containing the `kustomization.yaml`, to create the Secret.
-->
应用包含 `kustomization.yaml` 目录以创建 Secret 对象。

```shell
kubectl apply -k .
```

<!--
The output is similar to:
-->
输出类似于：

```
secret/db-user-pass-dddghtt9b5 created
```

<!--
When a Secret is generated, the Secret name is created by hashing
the Secret data and appending this value to the name. This ensures that
a new Secret is generated each time the data is modified.
-->

{{< note >}}
Secret 被创建时，Secret 的名称是通过为 Secret 数据计算哈希值得到一个字符串，
并将该字符串添加到名称之后得到的。这会确保数据被修改后，会有新的 Secret
对象被生成。
{{< /note >}}

<!--
#### Decoding a Secret

Secrets can be retrieved via the `kubectl get secret`.
For example, to retrieve the secret created in the previous section:
-->

#### 解码 Secret {#decoding-secret}

可以使用 `kubectl get secret` 命令获取 Secret。例如，获取在上一节中创建的 secret：

```shell
kubectl get secret mysecret -o yaml
```

<!--
The output is similar to:
-->
输出类似于：

```yaml
apiVersion: v1
kind: Secret
metadata:
  creationTimestamp: 2016-01-22T18:41:56Z
  name: mysecret
  namespace: default
  resourceVersion: "164619"
  uid: cfee02d6-c137-11e5-8d73-42010af00002
type: Opaque
data:
  username: YWRtaW4=
  password: MWYyZDFlMmU2N2Rm
```

<!--
Decode the password field:
-->

解码 `password` 字段：

```shell
echo 'MWYyZDFlMmU2N2Rm' | base64 --decode
```

<!-- The output is similar to:-->
输出类似于：

```
1f2d1e2e67df
```

<!--
#### Editing a Secret

An existing secret may be edited with the following command:
-->
#### 编辑 Secret

可以通过下面的命令可以编辑一个已经存在的 secret 。

```shell
kubectl edit secrets mysecret
```

<!--
This will open the default configured editor and allow for updating the base64 encoded secret values in the `data` field:
-->
这将打开默认配置的编辑器，并允许更新 `data` 字段中的 base64 编码的 Secret 值：

```
# Please edit the object below. Lines beginning with a '#' will be ignored,
# and an empty file will abort the edit. If an error occurs while saving this file will be
# reopened with the relevant failures.
#
apiVersion: v1
data:
  username: YWRtaW4=
  password: MWYyZDFlMmU2N2Rm
kind: Secret
metadata:
  annotations:
    kubectl.kubernetes.io/last-applied-configuration: { ... }
  creationTimestamp: 2016-01-22T18:41:56Z
  name: mysecret
  namespace: default
  resourceVersion: "164619"
  uid: cfee02d6-c137-11e5-8d73-42010af00002
type: Opaque
```

<!--
## Using Secrets

Secrets can be mounted as data volumes or be exposed as
{{< glossary_tooltip text="environment variables" term_id="container-env-variables" >}}
to be used by a container in a pod.  They can also be used by other parts of the
system, without being directly exposed to the pod.  For example, they can hold
credentials that other parts of the system should use to interact with external
systems on your behalf.
-->

## 使用 Secret

Secret 可以作为数据卷被挂载，或作为{{< glossary_tooltip text="环境变量" term_id="container-env-variables" >}}
暴露出来以供 Pod 中的容器使用。它们也可以被系统的其他部分使用，而不直接暴露在 Pod 内。
例如，它们可以保存凭据，系统的其他部分将用它来代表你与外部系统进行交互。

<!--
### Using Secrets as Files from a Pod

To consume a Secret in a volume in a Pod:

1. Create a secret or use an existing one.  Multiple pods can reference the same secret.
1. Modify your Pod definition to add a volume under `.spec.volumes[]`.  Name the volume anything, and have a `.spec.volumes[].secret.secretName` field equal to the name of the secret object.
1. Add a `.spec.containers[].volumeMounts[]` to each container that needs the secret.  Specify `.spec.containers[].volumeMounts[].readOnly = true` and `.spec.containers[].volumeMounts[].mountPath` to an unused directory name where you would like the secrets to appear.
1. Modify your image and/or command line so that the program looks for files in that directory.  Each key in the secret `data` map becomes the filename under `mountPath`.

This is an example of a pod that mounts a secret in a volume:
-->

### 在 Pod 中使用 Secret 文件   {#using-secrets-as-files-from-a-pod}

在 Pod 中使用存放在卷中的 Secret：

1. 创建一个 Secret 或者使用已有的 Secret。多个 Pod 可以引用同一个 Secret。
1. 修改你的 Pod 定义，在 `spec.volumes[]` 下增加一个卷。可以给这个卷随意命名，
   它的 `spec.volumes[].secret.secretName` 必须是 Secret 对象的名字。
1. 将 `spec.containers[].volumeMounts[]` 加到需要用到该 Secret 的容器中。
   指定 `spec.containers[].volumeMounts[].readOnly = true` 和
   `spec.containers[].volumeMounts[].mountPath` 为你想要该 Secret 出现的尚未使用的目录。
1. 修改你的镜像并且／或者命令行，让程序从该目录下寻找文件。
   Secret 的 `data` 映射中的每一个键都对应 `mountPath` 下的一个文件名。

这是一个在 Pod 中使用存放在挂载卷中 Secret 的例子：

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: mypod
spec:
  containers:
  - name: mypod
    image: redis
    volumeMounts:
    - name: foo
      mountPath: "/etc/foo"
      readOnly: true
  volumes:
  - name: foo
    secret:
      secretName: mysecret
```

<!--
Each secret you want to use needs to be referred to in `.spec.volumes`.

If there are multiple containers in the pod, then each container needs its
own `volumeMounts` block, but only one `.spec.volumes` is needed per secret.

You can package many files into one secret, or use many secrets, whichever is convenient.

#### Projection of Secret keys to specific paths

We can also control the paths within the volume where Secret keys are projected.
You can use `.spec.volumes[].secret.items` field to change target path of each key:
-->
您想要用的每个 Secret 都需要在 `spec.volumes` 中引用。

如果 Pod 中有多个容器，每个容器都需要自己的 `volumeMounts` 配置块，
但是每个 Secret 只需要一个 `spec.volumes`。

您可以打包多个文件到一个 Secret 中，或者使用的多个 Secret，怎样方便就怎样来。

#### 将 Secret 键名映射到特定路径

我们还可以控制 Secret 键名在存储卷中映射的的路径。
你可以使用 `spec.volumes[].secret.items` 字段修改每个键对应的目标路径：

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: mypod
spec:
  containers:
  - name: mypod
    image: redis
    volumeMounts:
    - name: foo
      mountPath: "/etc/foo"
      readOnly: true
  volumes:
  - name: foo
    secret:
      secretName: mysecret
      items:
      - key: username
        path: my-group/my-username
```

<!--
What will happen:

* `username` secret is stored under `/etc/foo/my-group/my-username` file instead of `/etc/foo/username`.
* `password` secret is not projected

If `.spec.volumes[].secret.items` is used, only keys specified in `items` are projected.
To consume all keys from the secret, all of them must be listed in the `items` field.
All listed keys must exist in the corresponding secret. Otherwise, the volume is not created.

#### Secret files permissions

You can also specify the permission mode bits files part of a secret will have.
If you don't specify any, `0644` is used by default. You can specify a default
mode for the whole secret volume and override per key if needed.

For example, you can specify a default mode like this:
-->
将会发生什么呢：

- `username` Secret 存储在 `/etc/foo/my-group/my-username` 文件中而不是 `/etc/foo/username` 中。
- `password` Secret 没有被映射

如果使用了 `spec.volumes[].secret.items`，只有在 `items` 中指定的键会被映射。
要使用 Secret 中所有键，就必须将它们都列在 `items` 字段中。
所有列出的键名必须存在于相应的 Secret 中。否则，不会创建卷。

#### Secret 文件权限

你还可以指定 Secret 将拥有的权限模式位。如果不指定，默认使用 `0644`。
你可以为整个 Secret 卷指定默认模式；如果需要，可以为每个密钥设定重载值。

例如，您可以指定如下默认模式：

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: mypod
spec:
  containers:
  - name: mypod
    image: redis
    volumeMounts:
    - name: foo
      mountPath: "/etc/foo"
  volumes:
  - name: foo
    secret:
      secretName: mysecret
      defaultMode: 256
```

<!--
Then, the secret will be mounted on `/etc/foo` and all the files created by the
secret volume mount will have permission `0400`.

Note that the JSON spec doesn't support octal notation, so use the value 256 for
0400 permissions. If you use yaml instead of json for the pod, you can use octal
notation to specify permissions in a more natural way.
-->
之后，Secret 将被挂载到 `/etc/foo` 目录，而所有通过该 Secret 卷挂载
所创建的文件的权限都是 `0400`。

请注意，JSON 规范不支持八进制符号，因此使用 256 值作为 0400 权限。
如果你使用 YAML 而不是 JSON，则可以使用八进制符号以更自然的方式指定权限。

<!--
Note if you `kubectl exec` into the Pod, you need to follow the symlink to find
the expected file mode. For example,

Check the secrets file mode on the pod.
-->
注意，如果你通过 `kubectl exec` 进入到 Pod 中，你需要沿着符号链接来找到
所期望的文件模式。例如，下面命令检查 Secret 文件的访问模式：

```shell
kubectl exec mypod -it sh

cd /etc/foo
ls -l
```

<!--
The output is similar to this:
-->
输出类似于：

```
total 0
lrwxrwxrwx 1 root root 15 May 18 00:18 password -> ..data/password
lrwxrwxrwx 1 root root 15 May 18 00:18 username -> ..data/username
```

<!--
Follow the symlink to find the correct file mode.
-->
沿着符号链接，可以查看文件的访问模式：

```shell
cd /etc/foo/..data
ls -l
```

<!--
The output is similar to this:
-->
输出类似于：

```
total 8
-r-------- 1 root root 12 May 18 00:18 password
-r-------- 1 root root  5 May 18 00:18 username
```

<!--
You can also use mapping, as in the previous example, and specify different
permission for different files like this:
-->

你还可以使用映射，如上一个示例，并为不同的文件指定不同的权限，如下所示：

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: mypod
spec:
  containers:
  - name: mypod
    image: redis
    volumeMounts:
    - name: foo
      mountPath: "/etc/foo"
  volumes:
  - name: foo
    secret:
      secretName: mysecret
      items:
      - key: username
        path: my-group/my-username
        mode: 511
```

<!--
In this case, the file resulting in `/etc/foo/my-group/my-username` will have
permission value of `0777`. Owing to JSON limitations, you must specify the mode
in decimal notation, `511`.

Note that this permission value might be displayed in decimal notation if you
read it later.

#### Consuming Secret Values from Volumes

Inside the container that mounts a secret volume, the secret keys appear as
files and the secret values are base-64 decoded and stored inside these files.
This is the result of commands
executed inside the container from the example above:
-->
在这里，位于 `/etc/foo/my-group/my-username` 的文件的权限值为 `0777`。
由于 JSON 限制，必须以十进制格式指定模式，即 `511`。

请注意，如果稍后读取此权限值，可能会以十进制格式显示。

#### 使用来自卷中的 Secret 值   {#consuming-secret-values-from-volumes} 

在挂载了 Secret 卷的容器内，Secret 键名显示为文件名，并且 Secret 的值
使用 base-64 解码后存储在这些文件中。
这是在上面的示例容器内执行的命令的结果：

```shell
ls /etc/foo/
```

<!-- The output is similar to: -->
输出类似于：

```
username
password
```

```shell
cat /etc/foo/username
```

<!-- The output is similar to: -->
输出类似于：

```
admin
```

```shell
cat /etc/foo/password
```

<!-- The output is similar to: -->
输出类似于：

```
1f2d1e2e67df
```

<!--
The program in a container is responsible for reading the secrets from the
files.
-->
容器中的程序负责从文件中读取 secret。

<!--
#### Mounted Secrets are updated automatically

When a secret being already consumed in a volume is updated, projected keys are eventually updated as well.
Kubelet is checking whether the mounted secret is fresh on every periodic sync.
However, it is using its local cache for getting the current value of the Secret.

The type of the cache is configurable using the  (`ConfigMapAndSecretChangeDetectionStrategy` field in
[KubeletConfiguration struct](https://github.com/kubernetes/kubernetes/blob/{{< param "docsbranch" >}}/staging/src/k8s.io/kubelet/config/v1beta1/types.go)).
It can be either propagated via watch (default), ttl-based, or simply redirecting
all requests to directly kube-apiserver.
As a result, the total delay from the moment when the Secret is updated to the moment
when new keys are projected to the Pod can be as long as kubelet sync period + cache
propagation delay, where cache propagation delay depends on the chosen cache type
(it equals to watch propagation delay, ttl of cache, or zero corespondingly).
-->
#### 挂载的 Secret 会被自动更新

当已经存储于卷中被使用的 Secret 被更新时，被映射的键也将终将被更新。
组件 kubelet 在周期性同步时检查被挂载的 Secret 是不是最新的。
但是，它会使用其本地缓存的数值作为 Secret 的当前值。

缓存的类型可以使用 [KubeletConfiguration 结构](https://github.com/kubernetes/kubernetes/blob/{{< param "docsbranch" >}}/staging/src/k8s.io/kubelet/config/v1beta1/types.go)
中的 `ConfigMapAndSecretChangeDetectionStrategy` 字段来配置。
它可以通过 watch 操作来传播（默认），基于 TTL 来刷新，也可以
将所有请求直接重定向到 API 服务器。
因此，从 Secret 被更新到将新 Secret 被投射到 Pod 的那一刻的总延迟可能与
kubelet 同步周期 + 缓存传播延迟一样长，其中缓存传播延迟取决于所选的缓存类型。
对应于不同的缓存类型，该延迟或者等于 watch 传播延迟，或者等于缓存的 TTL，
或者为 0。

<!--
A container using a Secret as a
[subPath](/docs/concepts/storage/volumes#using-subpath) volume mount will not receive
Secret updates.
-->
{{< note >}}
使用 Secret 作为[子路径](/zh/docs/concepts/storage/volumes#using-subpath)卷挂载的容器
不会收到 Secret 更新。
{{< /note >}}

{{< feature-state for_k8s_version="v1.18" state="alpha" >}}

<!-- 
The Kubernetes alpha feature _Immutable Secrets and ConfigMaps_ provides an option to set
individual Secrets and ConfigMaps as immutable. For clusters that extensively use Secrets
(at least tens of thousands of unique Secret to Pod mounts), preventing changes to their
data has the following advantages:
-->
Kubernetes 的 alpha 特性 _不可变的 Secret 和 ConfigMap_ 提供了一种可选配置，
可以设置各个 Secret 和 ConfigMap 为不可变的。
对于大量使用 Secret 的集群（至少有成千上万各不相同的 Secret 供 Pod 挂载），
禁止变更它们的数据有下列好处：

<!-- 
- protects you from accidental (or unwanted) updates that could cause applications outages
- improves performance of your cluster by significantly reducing load on kube-apiserver, by
closing watches for secrets marked as immutable.
-->
- 防止意外（或非预期的）更新导致应用程序中断
- 通过将 Secret 标记为不可变来关闭 kube-apiserver 对其的监视，从而显著降低
  kube-apiserver 的负载，提升集群性能。

<!-- 
To use this feature, enable the `ImmutableEmphemeralVolumes`
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/) and set
your Secret or ConfigMap `immutable` field to `true`. For example:
-->
使用这个特性需要启用 `ImmutableEmphemeralVolumes`
[特性开关](/zh/docs/reference/command-line-tools-reference/feature-gates/)
并将 Secret 或 ConfigMap 的 `immutable` 字段设置为 `true`. 例如：

```yaml
apiVersion: v1
kind: Secret
metadata:
  ...
data:
  ...
immutable: true
```

<!-- 
Once a Secret or ConfigMap is marked as immutable, it is _not_ possible to revert this change
nor to mutate the contents of the `data` field. You can only delete and recreate the Secret.
Existing Pods maintain a mount point to the deleted Secret - it is recommended to recreate
these pods.
-->
{{< note >}}
一旦一个 Secret 或 ConfigMap 被标记为不可变，撤销此操作或者更改 `data` 字段的内容都是 _不_ 可能的。
只能删除并重新创建这个 Secret。现有的 Pod 将维持对已删除 Secret 的挂载点 - 建议重新创建这些 Pod。
{{< /note >}}

<!--
### Using Secrets as Environment Variables

To use a secret in an {{< glossary_tooltip text="environment variable" term_id="container-env-variables" >}}
in a pod:

1. Create a secret or use an existing one.  Multiple pods can reference the same secret.
1. Modify your Pod definition in each container that you wish to consume the value of a secret key to add an environment variable for each secret key you wish to consume.  The environment variable that consumes the secret key should populate the secret's name and key in `env[].valueFrom.secretKeyRef`.
1. Modify your image and/or command line so that the program looks for values in the specified environment variables

This is an example of a pod that uses secrets from environment variables:
-->

#### 以环境变量的形式使用 Secrets   {#using-secrets-as-environment-variables}

将 Secret 作为 Pod 中的{{< glossary_tooltip text="环境变量" term_id="container-env-variables" >}}使用：

1. 创建一个 Secret 或者使用一个已存在的 Secret。多个 Pod 可以引用同一个 Secret。
1. 修改 Pod 定义，为每个要使用 Secret 的容器添加对应 Secret 键的环境变量。
   使用 Secret 键的环境变量应在 `env[x].valueFrom.secretKeyRef` 中指定
   要包含的 Secret 名称和键名。
1. 更改镜像并／或者命令行，以便程序在指定的环境变量中查找值。

这是一个使用来自环境变量中的 Secret 值的 Pod 示例：

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: secret-env-pod
spec:
  containers:
  - name: mycontainer
    image: redis
    env:
      - name: SECRET_USERNAME
        valueFrom:
          secretKeyRef:
            name: mysecret
            key: username
      - name: SECRET_PASSWORD
        valueFrom:
          secretKeyRef:
            name: mysecret
            key: password
  restartPolicy: Never
```

<!--
**Consuming Secret Values from Environment Variables**

Inside a container that consumes a secret in an environment variables, the secret keys appear as
normal environment variables containing the base-64 decoded values of the secret data.
This is the result of commands executed inside the container from the example above:
-->
#### 使用来自环境变量的 Secret 值 {#consuming-secret-values-from-environment-variables}

在一个以环境变量形式使用 Secret 的容器中，Secret 键表现为常规的环境变量，其中
包含 Secret 数据的 base-64 解码值。这是从上面的示例在容器内执行的命令的结果：

```shell
echo $SECRET_USERNAME
```

<!-- The output is similar to: -->
输出类似于：

```
admin
```

```shell
echo $SECRET_PASSWORD
```

<!-- The output is similar to: -->
输出类似于：

```
1f2d1e2e67df
```

<!--
### Using imagePullSecrets

The `imagePullSecrets` field is a list of references to secrets in the same namespace.
You can use an `imagePullSecrets` to pass a secret that contains a Docker (or other) image registry
password to the kubelet. The kubelet uses this information to pull a private image on behalf of your Pod.
See the [PodSpec API](/docs/reference/generated/kubernetes-api/{{< latest-version >}}/#podspec-v1-core) for more information about the `imagePullSecrets` field.

#### Manually specifying an imagePullSecret

You can learn how to specify `ImagePullSecrets` from the [container images documentation](/docs/concepts/containers/images/#specifying-imagepullsecrets-on-a-pod).
-->
#### 使用 imagePullSecret  {#using-imagepullsecrets}

`imagePullSecrets` 字段中包含一个列表，列举对同一名字空间中的 Secret 的引用。
你可以使用 `imagePullSecrets` 将包含 Docker（或其他）镜像仓库密码的 Secret 传递给
kubelet。kubelet 使用此信息来替你的 Pod 拉取私有镜像。
关于 `imagePullSecrets` 字段的更多信息，请参考 [PodSpec API](/docs/reference/generated/kubernetes-api/{{< latest-version >}}/#podspec-v1-core) 文档。

#### 手动指定 imagePullSecret

你可以阅读[容器镜像文档](/zh/docs/concepts/containers/images/#specifying-imagepullsecrets-on-a-pod)
以了解如何设置 `imagePullSecrets`。

<!--
### Arranging for imagePullSecrets to be Automatically Attached

You can manually create an imagePullSecret, and reference it from
a serviceAccount.  Any pods created with that serviceAccount
or that default to use that serviceAccount, will get their imagePullSecret
field set to that of the service account.
See [Add ImagePullSecrets to a service account](/docs/tasks/configure-pod-container/configure-service-account/#add-imagepullsecrets-to-a-service-account)
 for a detailed explanation of that process.
 -->
#### 设置自动附加 imagePullSecrets 

您可以手动创建 `imagePullSecret`，并在 ServiceAccount 中引用它。
使用该 ServiceAccount 创建的任何 Pod 和默认使用该 ServiceAccount 的
Pod 将会将其的 imagePullSecret 字段设置为服务帐户的 imagePullSecret 值。
有关该过程的详细说明，请参阅
[将 ImagePullSecrets 添加到服务帐户](/zh/docs/tasks/configure-pod-container/configure-service-account/#adding-imagepullsecrets-to-a-service-account)。

<!--
### Automatic Mounting of Manually Created Secrets

Manually created secrets (e.g. one containing a token for accessing a github account)
can be automatically attached to pods based on their service account.
See [Injecting Information into Pods Using a PodPreset](/docs/tasks/inject-data-application/podpreset/) for a detailed explanation of that process.
-->

#### 自动挂载手动创建的 Secret

手动创建的 Secret（例如包含用于访问 GitHub 帐户令牌的 Secret）可以
根据其服务帐户自动附加到 Pod。
请参阅[使用 PodPreset 向 Pod 中注入信息](/zh/docs/tasks/inject-data-application/podpreset/)
以获取该过程的详细说明。

<!--
## Details

### Restrictions

Secret volume sources are validated to ensure that the specified object
reference actually points to an object of type Secret. Therefore, a secret
needs to be created before any pods that depend on it.

Secret API objects reside in a {{< glossary_tooltip text="namespace" term_id="namespace" >}}.
They can only be referenced by pods in that same namespace.
-->
## 详细说明   {#details}

### 限制   {#restrictions}

Kubernetes 会验证 Secret 作为卷来源时所给的对象引用确实指向一个类型为
Secret 的对象。因此，Secret 需要先于任何依赖于它的 Pod 创建。

Secret API 对象处于某{{< glossary_tooltip text="名字空间" term_id="namespace" >}}
中。它们只能由同一命名空间中的 Pod 引用。

<!--
Individual secrets are limited to 1MiB in size.  This is to discourage creation
of very large secrets which would exhaust apiserver and kubelet memory.
However, creation of many smaller secrets could also exhaust memory.  More
comprehensive limits on memory usage due to secrets is a planned feature.

Kubelet only supports use of secrets for Pods it gets from the API server.
This includes any pods created using kubectl, or indirectly via a replication
controller.  It does not include pods created via the kubelets
`--manifest-url` flag, its `--config` flag, or its REST API (these are
not common ways to create pods.)
-->
每个 Secret 的大小限制为 1MB。这是为了防止创建非常大的 Secret 导致 API 服务器
和 kubelet 的内存耗尽。然而，创建过多较小的 Secret 也可能耗尽内存。
更全面得限制 Secret 内存用量的功能还在计划中。

kubelet 仅支持从 API 服务器获得的 Pod 使用 Secret。
这包括使用 `kubectl` 创建的所有 Pod，以及间接通过副本控制器创建的 Pod。
它不包括通过 kubelet `--manifest-url` 标志，`--config` 标志或其 REST API
创建的 Pod（这些不是创建 Pod 的常用方法）。

<!--
Secrets must be created before they are consumed in pods as environment
variables unless they are marked as optional.  References to Secrets that do
not exist will prevent the pod from starting.

References via `secretKeyRef` to keys that do not exist in a named Secret
will prevent the pod from starting.

Secrets used to populate environment variables via `envFrom` that have keys
that are considered invalid environment variable names will have those keys
skipped.  The pod will be allowed to start.  There will be an event whose
reason is `InvalidVariableNames` and the message will contain the list of
invalid keys that were skipped. The example shows a pod which refers to the
default/mysecret that contains 2 invalid keys, 1badkey and 2alsobad.
-->
以环境变量形式在 Pod 中使用 Secret 之前必须先创建
Secret，除非该环境变量被标记为可选的。
Pod 中引用不存在的 Secret 时将无法启动。

使用 `secretKeyRef` 时，如果引用了指定 Secret 不存在的键，对应的 Pod 也无法启动。

对于通过 `envFrom` 填充环境变量的 Secret，如果 Secret 中包含的键名无法作为
合法的环境变量名称，对应的键会被跳过，该 Pod 将被允许启动。
不过这时会产生一个事件，其原因为 `InvalidVariableNames`，其消息中包含被跳过的无效键的列表。
下面的示例显示一个 Pod，它引用了包含 2 个无效键 1badkey 和 2alsobad。

```shell
kubectl get events
```

<!--The output is similar to:-->
输出类似于：

```
LASTSEEN   FIRSTSEEN   COUNT     NAME            KIND      SUBOBJECT                         TYPE      REASON
0s         0s          1         dapi-test-pod   Pod                                         Warning   InvalidEnvironmentVariableNames   kubelet, 127.0.0.1      Keys [1badkey, 2alsobad] from the EnvFrom secret default/mysecret were skipped since they are considered invalid environment variable names.
```

<!--
### Secret and Pod Lifetime interaction

When a pod is created via the API, there is no check whether a referenced
secret exists.  Once a pod is scheduled, the kubelet will try to fetch the
secret value.  If the secret cannot be fetched because it does not exist or
because of a temporary lack of connection to the API server, kubelet will
periodically retry.  It will report an event about the pod explaining the
reason it is not started yet.  Once the secret is fetched, the kubelet will
create and mount a volume containing it.  None of the pod's containers will
start until all the pod's volumes are mounted.
-->
### Secret 与 Pod 生命周期的关系

通过 API 创建 Pod 时，不会检查引用的 Secret 是否存在。一旦 Pod 被调度，kubelet
就会尝试获取该 Secret 的值。如果获取不到该 Secret，或者暂时无法与 API 服务器建立连接，
kubelet 将会定期重试。kubelet 将会报告关于 Pod 的事件，并解释它无法启动的原因。
一旦获取到 Secret，kubelet 将创建并挂载一个包含它的卷。在 Pod 的所有卷被挂载之前，
Pod 中的容器不会启动。

<!--
## Use cases

### Use-Case: As container environment variables

-->
## 使用案例


### 案例：以环境变量的形式使用 Secret

<!-- Create a secret -->
创建一个 Secret 定义：

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: mysecret
type: Opaque
data:
  USER_NAME: YWRtaW4=
  PASSWORD: MWYyZDFlMmU2N2Rm
```

<!-- Create the Secret: -->
生成 Secret 对象：

```shell
kubectl apply -f mysecret.yaml
```

<!--
Use `envFrom` to define all of the Secret’s data as container environment variables. The key from the Secret becomes the environment variable name in the Pod.
-->
使用 `envFrom` 将 Secret 的所有数据定义为容器的环境变量。
Secret 中的键名称为 Pod 中的环境变量名称：

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: secret-test-pod
spec:
  containers:
    - name: test-container
      image: k8s.gcr.io/busybox
      command: [ "/bin/sh", "-c", "env" ]
      envFrom:
      - secretRef:
          name: mysecret
  restartPolicy: Never
```

<!--
### Use-Case: Pod with ssh keys

Create a secret containing some ssh keys:
-->
### 案例：包含 SSH 密钥的 Pod

创建一个包含 SSH 密钥的 Secret：

```shell
kubectl create secret generic ssh-key-secret \
  --from-file=ssh-privatekey=/path/to/.ssh/id_rsa \
  --from-file=ssh-publickey=/path/to/.ssh/id_rsa.pub
```

<!-- The output is similar to: -->
输出类似于：

```
secret "ssh-key-secret" created
```

<!--
You can also create a `kustomization.yaml` with a `secretGenerator` field containing ssh keys.
-->
你也可以创建一个带有包含 SSH 密钥的 `secretGenerator` 字段的
`kustomization.yaml` 文件。

<!--
Think carefully before sending your own ssh keys: other users of the cluster may have access to the secret.  Use a service account which you want to be accessible to all the users with whom you share the Kubernetes cluster, and can revoke if they are compromised.
-->
{{< caution >}}
发送自己的 SSH 密钥之前要仔细思考：集群的其他用户可能有权访问该密钥。
你可以使用一个服务帐户，分享给 Kubernetes 集群中合适的用户，这些用户是你要分享的。
如果服务账号遭到侵犯，可以将其收回。
{{< /caution >}}

<!--
Now we can create a pod which references the secret with the ssh key and
consumes it in a volume:
-->
现在我们可以创建一个 Pod，令其引用包含 SSH 密钥的 Secret，并通过存储卷来使用它：

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: secret-test-pod
  labels:
    name: secret-test
spec:
  volumes:
  - name: secret-volume
    secret:
      secretName: ssh-key-secret
  containers:
  - name: ssh-test-container
    image: mySshImage
    volumeMounts:
    - name: secret-volume
      readOnly: true
      mountPath: "/etc/secret-volume"
```

<!--
When the container's command runs, the pieces of the key will be available in:
-->
容器中的命令运行时，密钥的片段可以在以下目录找到：

```
/etc/secret-volume/ssh-publickey
/etc/secret-volume/ssh-privatekey
```

<!--
The container is then free to use the secret data to establish an ssh connection.
-->
然后容器可以自由使用 Secret 数据建立一个 SSH 连接。

<!--
### Use-Case: Pods with prod / test credentials

This example illustrates a pod which consumes a secret containing prod
credentials and another pod which consumes a secret with test environment
credentials.

You can create a `kustomization.yaml` with a `secretGenerator` field or run
`kubectl create secret`.

-->
### 案例：包含生产/测试凭据的 Pod

下面的例子展示的是两个 Pod。
一个 Pod 使用包含生产环境凭据的 Secret，另一个 Pod 使用包含测试环境凭据的 Secret。

你可以创建一个带有 `secretGenerator` 字段的 `kustomization.yaml`
文件，或者执行 `kubectl create secret`：

```shell
kubectl create secret generic prod-db-secret \
  --from-literal=username=produser \
  --from-literal=password=Y4nys7f11
```

<!--The output is similar to:-->
输出类似于：

```
secret "prod-db-secret" created
```

```shell
kubectl create secret generic test-db-secret \
  --from-literal=username=testuser \
  --from-literal=password=iluvtests
```

<!--The output is similar to:-->
输出类似于：

```
secret "test-db-secret" created
```

<!--
Special characters such as `$`, `\`, `*`, `=`, and `!` will be interpreted by your [shell](https://en.wikipedia.org/wiki/Shell_(computing)) and require escaping.
In most shells, the easiest way to escape the password is to surround it with single quotes (`'`).
For example, if your actual password is `S!B\*d$zDsb=`, you should execute the command this way:
You do not need to escape special characters in passwords from files (`--from-file`).
-->
{{< note >}}
特殊字符（例如 `$`、`\`、`*`、`=` 和 `!`）会被你的
[Shell](https://en.wikipedia.org/wiki/Shell_(computing))解释，因此需要转义。
在大多数 Shell 中，对密码进行转义的最简单方式是用单引号（`'`）将其括起来。
例如，如果您的实际密码是 `S!B\*d$zDsb`，则应通过以下方式执行命令：

```shell
kubectl create secret generic dev-db-secret --from-literal=username=devuser --from-literal=password='S!B\*d$zDsb='
```

您无需对文件中的密码（`--from-file`）中的特殊字符进行转义。
{{< /note >}}

<!--
Now make the pods:
-->
创建 pod ：

```shell
$ cat <<EOF > pod.yaml
apiVersion: v1
kind: List
items:
- kind: Pod
  apiVersion: v1
  metadata:
    name: prod-db-client-pod
    labels:
      name: prod-db-client
  spec:
    volumes:
    - name: secret-volume
      secret:
        secretName: prod-db-secret
    containers:
    - name: db-client-container
      image: myClientImage
      volumeMounts:
      - name: secret-volume
        readOnly: true
        mountPath: "/etc/secret-volume"
- kind: Pod
  apiVersion: v1
  metadata:
    name: test-db-client-pod
    labels:
      name: test-db-client
  spec:
    volumes:
    - name: secret-volume
      secret:
        secretName: test-db-secret
    containers:
    - name: db-client-container
      image: myClientImage
      volumeMounts:
      - name: secret-volume
        readOnly: true
        mountPath: "/etc/secret-volume"
EOF
```

<!--
Add the pods to the same kustomization.yaml
-->
将 Pod 添加到同一个 kustomization.yaml 文件

```shell
$ cat <<EOF >> kustomization.yaml
resources:
- pod.yaml
EOF
```

<!--
Apply all those objects on the Apiserver by
-->
通过下面的命令应用所有对象

```shell
kubectl apply -k .
```

<!--
Both containers will have the following files present on their filesystems with the values for each container's environment:
-->
两个容器都会在其文件系统上存在以下文件，其中包含容器对应的环境的值：

```
/etc/secret-volume/username
/etc/secret-volume/password
```

<!--
Note how the specs for the two pods differ only in one field;  this facilitates
creating pods with different capabilities from a common pod config template.

You could further simplify the base pod specification by using two Service Accounts:

1. `prod-user` with the `prod-db-secret`
1. `test-user` with the `test-db-secret`

The Pod specification is shortened to:
-->
请注意，两个 Pod 的规约配置中仅有一个字段不同；这有助于使用共同的 Pod 配置模板创建
具有不同能力的 Pod。

您可以使用两个服务账号进一步简化基本的 Pod 规约：

1. 名为 `prod-user` 的服务账号拥有  `prod-db-secret`
1. 名为 `test-user` 的服务账号拥有 `test-db-secret`

然后，Pod 规约可以缩短为：

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: prod-db-client-pod
  labels:
    name: prod-db-client
spec:
  serviceAccount: prod-db-client
  containers:
  - name: db-client-container
    image: myClientImage
```

<!--
### Use-case: Dotfiles in secret volume

You can make your data "hidden" by defining a key that begins with a dot.
This key represents a dotfile or "hidden" file. For example, when the following secret
is mounted into a volume, `secret-volume`:

-->
### 案例：Secret 卷中以句点号开头的文件

你可以通过定义以句点开头的键名，将数据“隐藏”起来。
例如，当如下 Secret 被挂载到 `secret-volume` 卷中：

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: dotfile-secret
data:
  .secret-file: dmFsdWUtMg0KDQo=
---
apiVersion: v1
kind: Pod
metadata:
  name: secret-dotfiles-pod
spec:
  volumes:
  - name: secret-volume
    secret:
      secretName: dotfile-secret
  containers:
  - name: dotfile-test-container
    image: k8s.gcr.io/busybox
    command:
    - ls
    - "-l"
    - "/etc/secret-volume"
    volumeMounts:
    - name: secret-volume
      readOnly: true
      mountPath: "/etc/secret-volume"
```


<!--
The volume will contain a single file, called `.secret-file`, and
the `dotfile-test-container` will have this file present at the path
`/etc/secret-volume/.secret-file`.
-->
卷中将包含唯一的叫做 `.secret-file` 的文件。
容器 `dotfile-test-container` 中，该文件处于 `/etc/secret-volume/.secret-file` 路径下。

<!--
Files beginning with dot characters are hidden from the output of  `ls -l`;
you must use `ls -la` to see them when listing directory contents.
-->
{{< note >}}
以点号开头的文件在 `ls -l` 的输出中会被隐藏起来；
列出目录内容时，必须使用 `ls -la` 才能看到它们。
{{< /note >}}

<!--
### Use-case: Secret visible to one container in a pod

Consider a program that needs to handle HTTP requests, do some complex business
logic, and then sign some messages with an HMAC.  Because it has complex
application logic, there might be an unnoticed remote file reading exploit in
the server, which could expose the private key to an attacker.
-->
### 案例：Secret 仅对 Pod 中的一个容器可见   {#secret-visible-to-only-one-container}
考虑一个需要处理 HTTP 请求、执行一些复杂的业务逻辑，然后使用 HMAC 签署一些消息的应用。
因为应用程序逻辑复杂，服务器中可能会存在一个未被注意的远程文件读取漏洞，
可能会将私钥暴露给攻击者。

<!--
This could be divided into two processes in two containers: a frontend container
which handles user interaction and business logic, but which cannot see the
private key; and a signer container that can see the private key, and responds
to simple signing requests from the frontend (e.g. over localhost networking).

With this partitioned approach, an attacker now has to trick the application
server into doing something rather arbitrary, which may be harder than getting
it to read a file.
-->
解决的办法可以是将应用分为两个进程，分别运行在两个容器中：
前端容器，用于处理用户交互和业务逻辑，但无法看到私钥；
签名容器，可以看到私钥，响应来自前端（例如通过本地主机网络）的简单签名请求。

使用这种分割方法，攻击者现在必须欺骗应用程序服务器才能进行任意的操作，
这可能比使其读取文件更难。

<!-- TODO: explain how to do this while still using automation. -->

<!--
## Best practices

### Clients that use the secrets API

When deploying applications that interact with the secrets API, access should be
limited using [authorization policies](
/docs/reference/access-authn-authz/authorization/) such as [RBAC](
/docs/reference/access-authn-authz/rbac/).
-->
## 最佳实践   {#best-practices}

### 客户端使用 Secret API

当部署与 Secret API 交互的应用程序时，应使用
[鉴权策略](/zh/docs/reference/access-authn-authz/authorization/)，
例如 [RBAC](/zh/docs/reference/access-authn-authz/rbac/)，来限制访问。

<!--
Secrets often hold values that span a spectrum of importance, many of which can
cause escalations within Kubernetes (e.g. service account tokens) and to
external systems. Even if an individual app can reason about the power of the
secrets it expects to interact with, other apps within the same namespace can
render those assumptions invalid.

For these reasons `watch` and `list` requests for secrets within a namespace are
extremely powerful capabilities and should be avoided, since listing secrets allows
the clients to inspect the values of all secrets that are in that namespace. The ability to
`watch` and `list` all secrets in a cluster should be reserved for only the most
privileged, system-level components.
-->

Secret 中的值对于不同的环境来说重要性可能不同。
很多 Secret 都可能导致 Kubernetes 集群内部的权限越界（例如服务账号令牌）
甚至逃逸到集群外部。
即使某一个应用程序可以就所交互的 Secret 的能力作出正确抉择，但是同一命名空间中
的其他应用程序却可能不这样做。

由于这些原因，在命名空间中 `watch` 和 `list` Secret 的请求是非常强大的能力，
是应该避免的行为。列出 Secret 的操作可以让客户端检查该命名空间中存在的所有 Secret。
在群集中 `watch` 和 `list` 所有 Secret 的能力应该只保留给特权最高的系统级组件。

<!--
Applications that need to access the secrets API should perform `get` requests on
the secrets they need. This lets administrators restrict access to all secrets
while [white-listing access to individual instances](
/docs/reference/access-authn-authz/rbac/#referring-to-resources) that
the app needs.

For improved performance over a looping `get`, clients can design resources that
reference a secret then `watch` the resource, re-requesting the secret when the
reference changes. Additionally, a ["bulk watch" API](
https://github.com/kubernetes/community/blob/master/contributors/design-proposals/api-machinery/bulk_watch.md)
to let clients `watch` individual resources has also been proposed, and will likely
be available in future releases of Kubernetes.
-->
需要访问 Secret API 的应用程序应该针对所需要的 Secret 执行 `get` 请求。
这样，管理员就能限制对所有 Secret 的访问，同时为应用所需要的
[实例设置访问允许清单](/zh/docs/reference/access-authn-authz/rbac/#referring-to-resources) 。

为了获得高于轮询操作的性能，客户端设计资源时，可以引用 Secret，然后对资源执行 `watch`
操作，在引用更改时重新检索 Secret。
此外，社区还存在一种 [“批量监控” API](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/bulk_watch.md)
的提案，允许客户端 `watch` 独立的资源，该功能可能会在将来的 Kubernetes 版本中提供。

<!--
## Security Properties

### Protections

Because `secret` objects can be created independently of the `pods` that use
them, there is less risk of the secret being exposed during the workflow of
creating, viewing, and editing pods.  The system can also take additional
precautions with `secret` objects, such as avoiding writing them to disk where
possible.
-->
## 安全属性    {#security-properties}

### 保护   {#protections}

因为 Secret 对象可以独立于使用它们的 Pod 而创建，所以在创建、查看和编辑 Pod 的流程中
Secret 被暴露的风险较小。系统还可以对 Secret 对象采取额外的预防性保护措施，
例如，在可能的情况下避免将其写到磁盘。

<!--
A secret is only sent to a node if a pod on that node requires it.
Kubelet stores the secret into a `tmpfs` so that the secret is not written
to disk storage. Once the Pod that depends on the secret is deleted, kubelet
will delete its local copy of the secret data as well.

There may be secrets for several pods on the same node.  However, only the
secrets that a pod requests are potentially visible within its containers.
Therefore, one Pod does not have access to the secrets of another Pod.
-->
只有当某节点上的 Pod 需要用到某 Secret 时，该 Secret 才会被发送到该节点上。
Secret 不会被写入磁盘，而是被 kubelet 存储在 tmpfs 中。
一旦依赖于它的 Pod 被删除，Secret 数据的本地副本就被删除。

同一节点上的很多个 Pod 可能拥有多个 Secret。
但是，只有 Pod 所请求的 Secret 在其容器中才是可见的。
因此，一个 Pod 不能访问另一个 Pod 的 Secret。

<!--
There may be several containers in a pod.  However, each container in a pod has
to request the secret volume in its `volumeMounts` for it to be visible within
the container.  This can be used to construct useful [security partitions at the
Pod level](#use-case-secret-visible-to-one-container-in-a-pod).

On most Kubernetes distributions, communication between users
to the apiserver, and from apiserver to the kubelets, is protected by SSL/TLS.
Secrets are protected when transmitted over these channels.
-->
同一个 Pod 中可能有多个容器。但是，Pod 中的每个容器必须通过 `volumeeMounts`
请求挂载 Secret 卷才能使卷中的 Secret 对容器可见。
这一实现可以用于在 Pod 级别[构建安全分区](#secret-visible-to-only-one-container)。

在大多数 Kubernetes 发行版中，用户与 API 服务器之间的通信以及
从 API 服务器到 kubelet 的通信都受到 SSL/TLS 的保护。
通过这些通道传输时，Secret 受到保护。

{{< feature-state for_k8s_version="v1.13" state="beta" >}}

<!--
You can enable [encryption at rest](/docs/tasks/administer-cluster/encrypt-data/)
for secret data, so that the secrets are not stored in the clear into {{< glossary_tooltip term_id="etcd" >}}.
-->
你可以为 Secret 数据开启[静态加密](/zh/docs/tasks/administer-cluster/encrypt-data/)，
这样 Secret 数据就不会以明文形式存储到{{< glossary_tooltip term_id="etcd" >}} 中。

<!--
### Risks

 - In the API server secret data is stored in {{< glossary_tooltip term_id="etcd" >}};
   therefore:
   - Administrators should enable encryption at rest for cluster data (requires v1.13 or later)
   - Administrators should limit access to etcd to admin users
   - Administrators may want to wipe/shred disks used by etcd when no longer in use
   - If running etcd in a cluster, administrators should make sure to use SSL/TLS
     for etcd peer-to-peer communication.
 - If you configure the secret through a manifest (JSON or YAML) file which has
   the secret data encoded as base64, sharing this file or checking it in to a
   source repository means the secret is compromised. Base64 encoding is _not_ an
   encryption method and is considered the same as plain text.
 - Applications still need to protect the value of secret after reading it from the volume,
   such as not accidentally logging it or transmitting it to an untrusted party.
 - A user who can create a pod that uses a secret can also see the value of that secret.  Even
   if apiserver policy does not allow that user to read the secret object, the user could
   run a pod which exposes the secret.
 - Currently, anyone with root on any node can read _any_ secret from the apiserver,
   by impersonating the kubelet.  It is a planned feature to only send secrets to
   nodes that actually require them, to restrict the impact of a root exploit on a
   single node.
-->
### 风险

- API 服务器上的 Secret 数据以纯文本的方式存储在 etcd 中，因此：
  - 管理员应该为集群数据开启静态加密（要求 v1.13 或者更高版本）。
  - 管理员应该限制只有 admin 用户能访问 etcd；
  - API 服务器中的 Secret 数据位于 etcd 使用的磁盘上；管理员可能希望在不再使用时擦除/粉碎 etcd 使用的磁盘
  - 如果 etcd 运行在集群内，管理员应该确保 etcd 之间的通信使用 SSL/TLS 进行加密。
- 如果您将 Secret 数据编码为 base64 的清单（JSON 或 YAML）文件，共享该文件或将其检入代码库，该密码将会被泄露。 Base64 编码不是一种加密方式，应该视同纯文本。
- 应用程序在从卷中读取 Secret 后仍然需要保护 Secret 的值，例如不会意外将其写入日志或发送给不信任方。
- 可以创建使用 Secret 的 Pod 的用户也可以看到该 Secret 的值。即使 API 服务器策略不允许用户读取 Secret 对象，用户也可以运行 Pod 导致 Secret 暴露。
- 目前，任何节点的 root 用户都可以通过模拟 kubelet 来读取 API 服务器中的任何 Secret。
  仅向实际需要 Secret 的节点发送 Secret 数据才能限制节点的 root 账号漏洞的影响，
  该功能还在计划中。

