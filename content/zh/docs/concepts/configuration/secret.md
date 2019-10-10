---
title: Secret
content_template: templates/concept
weight: 50
---


{{% capture overview %}}

<!--
Kubernetes `secret` objects let you store and manage sensitive information, such
as passwords, OAuth tokens, and ssh keys.  Putting this information in a `secret`
is safer and more flexible than putting it verbatim in a
{{< glossary_tooltip term_id="pod" >}} definition or in a {{< glossary_tooltip text="container image" term_id="image" >}}. See [Secrets design document](https://git.k8s.io/community/contributors/design-proposals/auth/secrets.md) for more information.
-->

`Secret` 对象类型用来保存敏感信息，例如密码、OAuth 令牌和 ssh key。
将这些信息放在 `secret` 中比放在 {{< glossary_tooltip term_id="pod" >}} 的定义或者 {{< glossary_tooltip text="容器镜像" term_id="image" >}} 中来说更加安全和灵活。
参阅 [Secret 设计文档](https://git.k8s.io/community/contributors/design-proposals/auth/secrets.md) 获取更多详细信息。

{{% /capture %}}

{{% capture body %}}

<!--
## Overview of Secrets

A Secret is an object that contains a small amount of sensitive data such as
a password, a token, or a key.  Such information might otherwise be put in a
Pod specification or in an image; putting it in a Secret object allows for
more control over how it is used, and reduces the risk of accidental exposure.
-->

## Secret 概览

Secret 是一种包含少量敏感信息例如密码、token 或 key 的对象。这样的信息可能会被放在 Pod spec 中或者镜像中；将其放在一个 secret 对象中可以更好地控制它的用途，并降低意外暴露的风险。

<!--
Users can create secrets, and the system also creates some secrets.

To use a secret, a pod needs to reference the secret.
A secret can be used with a pod in two ways: as files in a
{{< glossary_tooltip text="volume" term_id="volume" >}} mounted on one or more of
its containers, or used by kubelet when pulling images for the pod.
-->

用户可以创建 secret，同时系统也创建了一些 secret。

要使用 secret，pod 需要引用 secret。Pod 可以用两种方式使用 secret：作为 {{< glossary_tooltip text="volume" term_id="volume" >}} 中的文件被挂载到 pod 中的一个或者多个容器里，或者当 kubelet 为 pod 拉取镜像时使用。

<!--
### Built-in Secrets

#### Service Accounts Automatically Create and Attach Secrets with API Credentials

Kubernetes automatically creates secrets which contain credentials for
accessing the API and it automatically modifies your pods to use this type of
secret.
-->

### 内置 secret

#### Service Account 使用 API 凭证自动创建和附加 secret

Kubernetes 自动创建包含访问 API 凭据的 secret，并自动修改您的 pod 以使用此类型的 secret。

<!--
The automatic creation and use of API credentials can be disabled or overridden
if desired.  However, if all you need to do is securely access the apiserver,
this is the recommended workflow.

See the [Service Account](/docs/tasks/configure-pod-container/configure-service-account/) documentation for more
information on how Service Accounts work.
-->

如果需要，可以禁用或覆盖自动创建和使用API凭据。但是，如果您需要的只是安全地访问 apiserver，我们推荐这样的工作流程。

参阅  [Service Account](/docs/tasks/configure-pod-container/configure-service-account/) 文档获取关于 Service Account 如何工作的更多信息。

<!--
### Creating your own Secrets

#### Creating a Secret Using kubectl create secret

Say that some pods need to access a database.  The
username and password that the pods should use is in the files
`./username.txt` and `./password.txt` on your local machine.
-->
### 创建您自己的 Secret

#### 使用 kubectl 创建 Secret

假设有些 pod 需要访问数据库。这些 pod 需要使用的用户名和密码在您本地机器的 `./username.txt` 和 `./password.txt` 文件里。

```shell
# Create files needed for rest of example.
echo -n 'admin' > ./username.txt
echo -n '1f2d1e2e67df' > ./password.txt
```

<!--
The `kubectl create secret` command
packages these files into a Secret and creates
the object on the Apiserver.
-->

`kubectl create secret` 命令将这些文件打包到一个 Secret 中并在 API server 中创建了一个对象。


```shell
kubectl create secret generic db-user-pass --from-file=./username.txt --from-file=./password.txt
```
```
secret "db-user-pass" created
```

{{< note >}}
<!--
Special characters such as `$`, `\*`, and `!` require escaping.
If the password you are using has special characters, you need to escape them using the `\\` character. For example, if your actual password is `S!B\*d$zDsb`, you should execute the command this way:
     kubectl create secret generic dev-db-secret --from-literal=username=devuser --from-literal=password=S\\!B\\\\*d\\$zDsb
 You do not need to escape special characters in passwords from files (`--from-file`).
 -->
 
 
特殊字符（例如 `$`,  `\*` 和 `!` ）需要转义。
如果您使用的密码具有特殊字符，则需要使用 `\\` 字符对其进行转义。 例如，如果您的实际密码是 `S!B\*d$zDsb` ，则应通过以下方式执行命令：
     kubectl create secret generic dev-db-secret --from-literal=username=devuser --from-literal=password=S\\!B\\\\*d\\$zDsb
您无需从文件中转义密码中的特殊字符（ `--from-file` ）。
{{< /note >}}

<!--
You can check that the secret was created like this:
-->
您可以这样检查刚创建的 secret：

```shell
kubectl get secrets
```
```
NAME                  TYPE                                  DATA      AGE
db-user-pass          Opaque                                2         51s
```
```shell
kubectl describe secrets/db-user-pass
```
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

{{< note >}}

<!--
`kubectl get` and `kubectl describe` avoid showing the contents of a secret by
default.
This is to protect the secret from being exposed accidentally to an onlooker,
or from being stored in a terminal log.
-->

{{< /note >}}

默认情况下，`kubectl get`和`kubectl describe`避免显示密码的内容。 这是为了防止机密被意外地暴露给旁观者或存储在终端日志中。

<!--
See [decoding a secret](#decoding-a-secret) for how to see the contents of a secret.
-->

请参阅 [解码 secret](#解码-secret) 了解如何查看它们的内容。

<!--
#### Creating a Secret Manually

You can also create a Secret in a file first, in json or yaml format,
and then create that object. The
[Secret](/docs/reference/generated/kubernetes-api/v1.12/#secret-v1-core) contains two maps:
data and stringData. The data field is used to store arbitrary data, encoded using
base64. The stringData field is provided for convenience, and allows you to provide
secret data as unencoded strings.
-->

#### 手动创建 Secret

您也可以先以 json 或 yaml 格式在文件中创建一个 secret 对象，然后创建该对象。
[密码](/docs/reference/generated/kubernetes-api/v1.12/#secret-v1-core)包含两中类型，数据和字符串数据。
数据字段用于存储使用base64编码的任意数据。 提供stringData字段是为了方便起见，它允许您将机密数据作为未编码的字符串提供。

<!--
For example, to store two strings in a Secret using the data field, convert
them to base64 as follows:
-->

例如，要使用数据字段将两个字符串存储在 Secret 中，请按如下所示将它们转换为 base64：

```shell
echo -n 'admin' | base64
YWRtaW4=
echo -n '1f2d1e2e67df' | base64
MWYyZDFlMmU2N2Rm
```

<!--
Write a Secret that looks like this:
-->

现在可以像这样写一个 secret 对象：

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

使用  [`kubectl apply`](/docs/reference/generated/kubectl/kubectl-commands#apply) 创建 secret：

```shell
kubectl apply -f ./secret.yaml
```
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

对于某些情况，您可能希望改用 stringData 字段。 此字段允许您将非 base64 编码的字符串直接放入 Secret 中，
并且在创建或更新 Secret 时将为您编码该字符串。

下面的一个实践示例提供了一个参考，您正在部署使用密钥存储配置文件的应用程序，并希望在部署过程中填补齐配置文件的部分内容。

如果您的应用程序使用以下配置文件：

```yaml
apiUrl: "https://my.api.com/api/v1"
username: "user"
password: "password"
```

<!--
You could store this in a Secret using the following:
-->

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
stringData 是只写的便利字段。 检索 Secrets 时永远不会被输出。 例如，如果您运行以下命令：

```shell
kubectl get secret mysecret -o yaml
```

<!--
The output will be similar to:
-->

输出将类似于：

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

如果在 data 和 stringData 中都指定了字段，则使用 stringData 中的值。 例如，以下是 Secret 定义：

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

`YWRtaW5pc3RyYXRvcg==` 转换成了 `administrator`。

<!--
The keys of data and stringData must consist of alphanumeric characters,
'-', '_' or '.'.

**Encoding Note:** The serialized JSON and YAML values of secret data are
encoded as base64 strings.  Newlines are not valid within these strings and must
be omitted.  When using the `base64` utility on Darwin/macOS users should avoid
using the `-b` option to split long lines.  Conversely Linux users *should* add
the option `-w 0` to `base64` commands or the pipeline `base64 | tr -d '\n'` if
`-w` option is not available.
-->

data和stringData的键必须由字母数字字符 '-', '_' 或者 '.' 组成。

** 编码注意：** 秘密数据的序列化 JSON 和 YAML 值被编码为base64字符串。 
换行符在这些字符串中无效，因此必须省略。 
在 Darwin / macOS 上使用 `base64` 实用程序时，用户应避免使用 `-b` 选项来分隔长行。 
相反，Linux用户 *应该* 在 `base64` 命令中添加选项 `-w 0`， 或者，如果`-w`选项不可用的情况下，
执行 `base64 | tr -d '\n'`。

<!--
#### Creating a Secret from Generator
Kubectl supports [managing objects using Kustomize](/docs/tasks/manage-kubernetes-objects/kustomization/)
since 1.14. With this new feature,
you can also create a Secret from generators and then apply it to create the object on
the Apiserver. The generators
should be specified in a `kustomization.yaml` inside a directory.

For example, to generate a Secret from files `./username.txt` and `./password.txt`
-->

#### 从生成器创建 Secret
Kubectl 从1.14版本开始支持 [使用 Kustomize 管理对象](/docs/tasks/manage-kubernetes-objects/kustomization/)
使用此新功能，您还可以从生成器创建一个 Secret，然后将其应用于在 Apiserver 上创建对象。 
生成器应在目录内的“ kustomization.yaml”中指定。

例如，从文件 `./username.txt` 和 `./password.txt` 生成一个 Secret。

```shell
# Create a kustomization.yaml file with SecretGenerator
cat <<EOF >./kustomization.yaml
secretGenerator:
- name: db-user-pass
  files:
  - username.txt
  - password.txt
EOF
```

<!--
Apply the kustomization directory to create the Secret object.
-->

应用 kustomization 目录创建 Secret 对象。

```shell
$ kubectl apply -k .
secret/db-user-pass-96mffmfh4k created
```

<!--
You can check that the secret was created like this:
-->

您可以检查 secret 是否是这样创建的：

```shell
$ kubectl get secrets
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
For example, to generate a Secret from literals `username=admin` and `password=secret`,
you can specify the secret generator in `kustomization.yaml` as
-->

例如，要从文字 `username=admin` 和 `password=secret` 生成秘密，可以在 `kustomization.yaml` 中将秘密生成器指定为

```shell
# Create a kustomization.yaml file with SecretGenerator
$ cat <<EOF >./kustomization.yaml
secretGenerator:
- name: db-user-pass
  literals:
  - username=admin
  - password=secret
EOF
```
Apply the kustomization directory to create the Secret object.
```shell
$ kubectl apply -k .
secret/db-user-pass-dddghtt9b5 created
```
{{< note >}}

<!--
The generated Secrets name has a suffix appended by hashing the contents. This ensures that a new
Secret is generated each time the contents is modified.
-->

通过对内容进行序列化后，生成一个后缀作为 Secrets 的名称。
这样可以确保每次修改内容时都会生成一个新的Secret。

{{< /note >}}

<!--
#### Decoding a Secret

Secrets can be retrieved via the `kubectl get secret` command. For example, to retrieve the secret created in the previous section:
-->

#### 解码 Secret

可以使用 `kubectl get secret` 命令获取 secret。例如，获取在上一节中创建的 secret：

```shell
kubectl get secret mysecret -o yaml
```
```
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

解码密码字段：

```shell
echo 'MWYyZDFlMmU2N2Rm' | base64 --decode
```
```
1f2d1e2e67df
```

<!--
#### Editing a Secret

An existing secret may be edited with the following command:
-->

#### 编辑 Secret

可以通过下面的命令编辑一个已经存在的 secret 。

```shell
kubectl edit secrets mysecret
```

<!--
This will open the default configured editor and allow for updating the base64 encoded secret values in the `data` field:
-->

这将打开默认配置的编辑器，并允许更新 `data` 字段中的base64编码的 secret：

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
暴露出来以供 pod 中的容器使用。它们也可以被系统的其他部分使用，而不直接暴露在 pod 内。
例如，它们可以保存凭据，系统的其他部分应该用它来代表您与外部系统进行交互。

<!--
### Using Secrets as Files from a Pod

To consume a Secret in a volume in a Pod:

1. Create a secret or use an existing one.  Multiple pods can reference the same secret.
1. Modify your Pod definition to add a volume under `.spec.volumes[]`.  Name the volume anything, and have a `.spec.volumes[].secret.secretName` field equal to the name of the secret object.
1. Add a `.spec.containers[].volumeMounts[]` to each container that needs the secret.  Specify `.spec.containers[].volumeMounts[].readOnly = true` and `.spec.containers[].volumeMounts[].mountPath` to an unused directory name where you would like the secrets to appear.
1. Modify your image and/or command line so that the program looks for files in that directory.  Each key in the secret `data` map becomes the filename under `mountPath`.

This is an example of a pod that mounts a secret in a volume:
-->

### 在 Pod 中使用 Secret 文件

在 Pod 中的 volume 里使用 Secret：

1. 创建一个 secret 或者使用已有的 secret。多个 pod 可以引用同一个 secret。
1. 修改您的 pod 的定义在 `spec.volumes[]` 下增加一个 volume。可以给这个 volume 随意命名，它的 `spec.volumes[].secret.secretName` 必须等于 secret 对象的名字。
1. 将 `spec.containers[].volumeMounts[]` 加到需要用到该 secret 的容器中。指定 `spec.containers[].volumeMounts[].readOnly = true` 和 `spec.containers[].volumeMounts[].mountPath` 为您想要该 secret 出现的尚未使用的目录。
1. 修改您的镜像并且／或者命令行让程序从该目录下寻找文件。Secret 的 `data` 映射中的每一个键都成为了 `mountPath` 下的一个文件名。

这是一个在 pod 中使用 volume 挂在 secret 的例子：

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

**Projection of secret keys to specific paths**

We can also control the paths within the volume where Secret keys are projected.
You can use `.spec.volumes[].secret.items` field to change target path of each key:
-->

您想要用的每个 secret 都需要在 `spec.volumes` 中指明。

如果 pod 中有多个容器，每个容器都需要自己的 `volumeMounts` 配置块，但是每个 secret 只需要一个 `spec.volumes`。

您可以打包多个文件到一个 secret 中，或者使用的多个 secret，怎样方便就怎样来。

**向特性路径映射 secret 密钥**

我们还可以控制 Secret key 映射在 volume 中的路径。您可以使用 `spec.volumes[].secret.items` 字段修改每个 key 的目标路径：

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

**Secret files permissions**

You can also specify the permission mode bits files part of a secret will have.
If you don't specify any, `0644` is used by default. You can specify a default
mode for the whole secret volume and override per key if needed.

For example, you can specify a default mode like this:
-->

将会发生什么呢：

- `username` secret 存储在 `/etc/foo/my-group/my-username` 文件中而不是 `/etc/foo/username` 中。
- `password` secret 没有被映射

如果使用了 `spec.volumes[].secret.items`，只有在 `items` 中指定的 key 被映射。要使用 secret 中所有的 key，所有这些都必须列在 `items` 字段中。所有列出的密钥必须存在于相应的 secret 中。否则，不会创建卷。

**Secret 文件权限**

您还可以指定 secret 将拥有的权限模式位文件。如果不指定，默认使用 `0644`。您可以为整个保密卷指定默认模式，如果需要，可以覆盖每个密钥。

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

You can also use mapping, as in the previous example, and specify different
permission for different files like this:
-->

然后，secret 将被挂载到 `/etc/foo` 目录，所有通过该 secret volume 挂载创建的文件的权限都是 `0400`。

请注意，JSON 规范不支持八进制符号，因此使用 256 值作为 0400 权限。如果您使用 yaml 而不是 json 作为 pod，则可以使用八进制符号以更自然的方式指定权限。

您还可以使用映射，如上一个示例，并为不同的文件指定不同的权限，如下所示：

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
in decimal notation.

Note that this permission value might be displayed in decimal notation if you
read it later.

**Consuming Secret Values from Volumes**

Inside the container that mounts a secret volume, the secret keys appear as
files and the secret values are base-64 decoded and stored inside these files.
This is the result of commands
executed inside the container from the example above:
-->

在这种情况下，导致 `/etc/foo/my-group/my-username` 的文件的权限值为 `0777`。由于 JSON 限制，必须以十进制格式指定模式。

请注意，如果稍后阅读此权限值可能会以十进制格式显示。

**从 Volume 中消费 secret 值**

在挂载的 secret volume 的容器内，secret key 将作为文件，并且 secret 的值使用 base-64 解码并存储在这些文件中。这是在上面的示例容器内执行的命令的结果：

```shell
ls /etc/foo/
```
```
username
password
```

```shell
cat /etc/foo/username
```
```
admin
```


```shell
cat /etc/foo/password
```
```
1f2d1e2e67df
```

<!--
The program in a container is responsible for reading the secrets from the
files.

**Mounted Secrets are updated automatically**
-->

容器中的程序负责从文件中读取 secret。

**挂载的 secret 被自动更新**

<!--
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
当已经在 volume 中被消费的 secret 被更新时，被映射的 key 也将被更新。
Kubelet 在周期性同步时检查被挂载的 secret 是不是最新的。
但是，它正在使用其本地缓存来获取 Secret 的当前值。

缓存的类型可以使用 (`ConfigMapAndSecretChangeDetectionStrategy` 中的 [KubeletConfiguration 结构](https://github.com/kubernetes/kubernetes/blob/{{< param "docsbranch" >}}/staging/src/k8s.io/kubelet/config/v1beta1/types.go)).
它可以通过基于 ttl 的 watch(默认)传播，也可以将所有请求直接重定向到直接kube-apiserver。
结果，从更新密钥到将新密钥投射到 Pod 的那一刻的总延迟可能与 kubelet 同步周期 + 缓存传播延迟一样长，其中缓存传播延迟取决于所选的缓存类型。
(它等于观察传播延迟，缓存的ttl或相应为0)

{{< note >}}

<!--
A container using a Secret as a
[subPath](/docs/concepts/storage/volumes#using-subpath) volume mount will not receive
Secret updates.
-->

使用 Secret 作为[子路径](/docs/concepts/storage/volumes#using-subpath)卷安装的容器将不会收到 Secret 更新。

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

#### Secret 作为环境变量

将 secret 作为 pod 中的{{< glossary_tooltip text="环境变量" term_id="container-env-variables" >}}使用：

1. 创建一个 secret 或者使用一个已存在的 secret。多个 pod 可以引用同一个 secret。
1. 修改 Pod 定义，为每个要使用 secret 的容器添加对应 secret key 的环境变量。消费secret key 的环境变量应填充 secret 的名称，并键入 `env[x].valueFrom.secretKeyRef`。
1. 修改镜像并／或者命令行，以便程序在指定的环境变量中查找值。

这是一个使用 Secret 作为环境变量的示例：

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
**消费环境变量里的 Secret 值**

在一个消耗环境变量 secret 的容器中，secret key 作为包含 secret 数据的 base-64 解码值的常规环境变量。这是从上面的示例在容器内执行的命令的结果：

```shell
echo $SECRET_USERNAME
```
```
admin
```
```shell
echo $SECRET_PASSWORD
```
```
1f2d1e2e67df
```

<!--
### Using imagePullSecrets

An imagePullSecret is a way to pass a secret that contains a Docker (or other) image registry
password to the Kubelet so it can pull a private image on behalf of your Pod.

**Manually specifying an imagePullSecret**

Use of imagePullSecrets is described in the [images documentation](/docs/concepts/containers/images/#specifying-imagepullsecrets-on-a-pod)

-->

#### 使用 imagePullSecret

imagePullSecret 是将包含 Docker（或其他）镜像注册表密码的 secret 传递给 Kubelet 的一种方式，因此可以代表您的 pod 拉取私有镜像。

**手动指定 imagePullSecret**

imagePullSecret 的使用在 [镜像文档](/docs/concepts/containers/images/#specifying-imagepullsecrets-on-a-pod) 中说明。

<!--
### Arranging for imagePullSecrets to be Automatically Attached

You can manually create an imagePullSecret, and reference it from
a serviceAccount.  Any pods created with that serviceAccount
or that default to use that serviceAccount, will get their imagePullSecret
field set to that of the service account.
See [Add ImagePullSecrets to a service account](/docs/tasks/configure-pod-container/configure-service-account/#add-imagepullsecrets-to-a-service-account)
 for a detailed explanation of that process.
 -->
 
### 安排 imagePullSecrets 自动附加

您可以手动创建 imagePullSecret，并从 serviceAccount 引用它。使用该 serviceAccount 创建的任何 pod 和默认使用该 serviceAccount 的 pod 将会将其的 imagePullSecret 字段设置为服务帐户的 imagePullSecret 字段。有关该过程的详细说明，请参阅 [将 ImagePullSecrets 添加到服务帐户](/docs/tasks/configure-pod-container/configure-service-account/#adding-imagepullsecrets-to-a-service-account)。

<!--
### Automatic Mounting of Manually Created Secrets

Manually created secrets (e.g. one containing a token for accessing a github account)
can be automatically attached to pods based on their service account.
See [Injecting Information into Pods Using a PodPreset](/docs/tasks/inject-data-application/podpreset/) for a detailed explanation of that process.
-->

#### 自动挂载手动创建的 Secret

手动创建的 secret（例如包含用于访问 github 帐户的令牌）可以根据其服务帐户自动附加到 pod。请参阅 [使用 PodPreset 向 Pod 中注入信息](/docs/tasks/run-application/podpreset/) 以获取该进程的详细说明。

<!--
## Details

### Restrictions

Secret volume sources are validated to ensure that the specified object
reference actually points to an object of type `Secret`.  Therefore, a secret
needs to be created before any pods that depend on it.

Secret API objects reside in a {{< glossary_tooltip text="namespace" term_id="namespace" >}}.
They can only be referenced by pods in that same namespace.
-->

## 详细

### 限制

验证 secret volume 来源确保指定的对象引用实际上指向一个类型为 Secret 的对象。因此，需要在依赖于它的任何 pod 之前创建一个 secret。

Secret API 对象驻留在命名空间中。它们只能由同一命名空间中的 pod 引用。

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

每个 secret 的大小限制为1MB。这是为了防止创建非常大的 secret 会耗尽 apiserver 和 kubelet 的内存。然而，创建许多较小的 secret 也可能耗尽内存。更全面得限制 secret 对内存使用的功能还在计划中。

Kubelet 仅支持从 API server 获取的 Pod 使用 secret。这包括使用 kubectl 创建的任何 pod，或间接通过 replication controller 创建的 pod。它不包括通过 kubelet `--manifest-url` 标志，其 `--config` 标志或其 REST API 创建的pod（这些不是创建 pod 的常用方法）。

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

必须先创建 secret，除非将它们标记为可选项，否则必须在将其作为环境变量在 pod 中使用之前创建 secret。对不存在的 secret 的引用将阻止其启动。

使用 `secretKeyRef` ，引用指定的 secret 中的不存在的 key ，这会阻止 pod 的启动。

对于通过 `envFrom` 填充环境变量的 secret，这些环境变量具有被认为是无效环境变量名称的 key 将跳过这些键。该 pod 将被允许启动。将会有一个事件，其原因是 `InvalidVariableNames`，该消息将包含被跳过的无效键的列表。该示例显示一个 pod，它指的是包含2个无效键，1badkey 和 2alsobad 的默认/mysecret ConfigMap。

```shell
kubectl get events
```
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
### Secret 与 Pod 生命周期的联系

通过 API 创建 Pod 时，不会检查应用的 secret 是否存在。一旦 Pod 被调度，kubelet 就会尝试获取该 secret 的值。如果获取不到该 secret，或者暂时无法与 API server 建立连接，kubelet 将会定期重试。Kubelet 将会报告关于 pod 的事件，并解释它无法启动的原因。一旦获取到 secret，kubelet将创建并装载一个包含它的卷。在所有 pod 的卷被挂载之前，都不会启动 pod 的容器。

<!--
## Use cases

### Use-Case: Pod with ssh keys

Create a kustomization.yaml with SecretGenerator containing some ssh keys:
-->

## 使用案例

### 使用案例：包含 ssh 密钥的 pod

创建一个包含 ssh key 的 secret：

```shell
kubectl create secret generic ssh-key-secret --from-file=ssh-privatekey=/path/to/.ssh/id_rsa --from-file=ssh-publickey=/path/to/.ssh/id_rsa.pub
```

```
secret "ssh-key-secret" created
```

{{< caution >}}
<!--
Think carefully before sending your own ssh keys: other users of the cluster may have access to the secret.  Use a service account which you want to be accessible to all the users with whom you share the Kubernetes cluster, and can revoke if they are compromised.
-->

发送自己的 ssh 密钥之前要仔细思考：集群的其他用户可能有权访问该密钥。使用您想要共享 Kubernetes 群集的所有用户可以访问的服务帐户，如果它们遭到入侵，可以撤销。
{{< /caution >}}


<!--
Now we can create a pod which references the secret with the ssh key and
consumes it in a volume:
-->
现在我们可以创建一个使用 ssh 密钥引用 secret 的pod，并在一个卷中使用它：

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

当容器中的命令运行时，密钥的片段将可在以下目录：

```shell
/etc/secret-volume/ssh-publickey
/etc/secret-volume/ssh-privatekey
```

<!--
The container is then free to use the secret data to establish an ssh connection.
-->
然后容器可以自由使用密钥数据建立一个 ssh 连接。

<!--
### Use-Case: Pods with prod / test credentials

This example illustrates a pod which consumes a secret containing prod
credentials and another pod which consumes a secret with test environment
credentials.

Make the kustomization.yaml with SecretGenerator
-->
### 使用案例：包含 prod/test 凭据的 pod

下面的例子说明一个 pod 消费一个包含 prod 凭据的 secret，另一个 pod 使用测试环境凭据消费 secret。

通过秘钥生成器制作 kustomization.yaml 

```shell
kubectl create secret generic prod-db-secret --from-literal=username=produser --from-literal=password=Y4nys7f11
```
```
secret "prod-db-secret" created
```

```shell
kubectl create secret generic test-db-secret --from-literal=username=testuser --from-literal=password=iluvtests
```
```
secret "test-db-secret" created
```
{{< note >}}
<!--
Special characters such as `$`, `\*`, and `!` require escaping.
If the password you are using has special characters, you need to escape them using the `\\` character. For example, if your actual password is `S!B\*d$zDsb`, you should execute the command this way:
-->

特殊字符（例如 `$`, `\*`, 和 `!`）需要转义。 如果您使用的密码具有特殊字符，则需要使用 `\\` 字符对其进行转义。 例如，如果您的实际密码是 `S!B\*d$zDsb`，则应通过以下方式执行命令：

```shell
kubectl create secret generic dev-db-secret --from-literal=username=devuser --from-literal=password=S\\!B\\\*d\\$zDsb
```

<!--
You do not need to escape special characters in passwords from files (`--from-file`).
-->
您无需从文件中转义密码中的特殊字符（ `--from-file` ）。
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

加入 Pod 到同样的 kustomization.yaml 文件

```shell
$ cat <<EOF >> kustomization.yaml
resources:
- pod.yaml
EOF
```

<!--
Apply all those objects on the Apiserver by
-->
部署所有的对象通过下面的命令

```shell
kubectl apply -k .
```

<!--
Both containers will have the following files present on their filesystems with the values for each container's environment:
-->
这两个容器将在其文件系统上显示以下文件，其中包含每个容器环境的值：

```shell
/etc/secret-volume/username
/etc/secret-volume/password
```

<!--
Note how the specs for the two pods differ only in one field;  this facilitates
creating pods with different capabilities from a common pod config template.

You could further simplify the base pod specification by using two Service Accounts:
one called, say, `prod-user` with the `prod-db-secret`, and one called, say,
`test-user` with the `test-db-secret`.  Then, the pod spec can be shortened to, for example:
-->

请注意，两个 pod 的 spec 配置中仅有一个字段有所不同；这有助于使用普通的 pod 配置模板创建具有不同功能的 pod。

您可以使用两个 service account 进一步简化基本 pod spec：一个名为 `prod-user` 拥有  `prod-db-secret` ，另一个称为 `test-user` 拥有 `test-db-secret` 。然后，pod spec 可以缩短为，例如：

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

In order to make piece of data 'hidden' (i.e., in a file whose name begins with a dot character), simply
make that key begin with a dot.  For example, when the following secret is mounted into a volume:
-->
### 使用案例：Secret 卷中以点号开头的文件

为了将数据“隐藏”起来（即文件名以点号开头的文件），简单地说让该键以一个点开始。例如，当如下 secret 被挂载到卷中：

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
The `secret-volume` will contain a single file, called `.secret-file`, and
the `dotfile-test-container` will have this file present at the path
`/etc/secret-volume/.secret-file`.
-->
`Secret-volume` 将包含一个单独的文件，叫做 `.secret-file`，`dotfile-test-container` 的 `/etc/secret-volume/.secret-file` 路径下将有该文件。

{{< note >}}

<!--
Files beginning with dot characters are hidden from the output of  `ls -l`;
you must use `ls -la` to see them when listing directory contents.
-->

以点号开头的文件在 `ls -l` 的输出中被隐藏起来了；列出目录内容时，必须使用 `ls -la` 才能查看它们。
{{< /note >}}

<!--
### Use-case: Secret visible to one container in a pod

Consider a program that needs to handle HTTP requests, do some complex business
logic, and then sign some messages with an HMAC.  Because it has complex
application logic, there might be an unnoticed remote file reading exploit in
the server, which could expose the private key to an attacker.
-->

### 使用案例：Secret 仅对 pod 中的一个容器可见

考虑以下一个需要处理 HTTP 请求的程序，执行一些复杂的业务逻辑，然后使用 HMAC 签署一些消息。因为它具有复杂的应用程序逻辑，所以在服务器中可能会出现一个未被注意的远程文件读取漏洞，这可能会将私钥暴露给攻击者。

<!--
This could be divided into two processes in two containers: a frontend container
which handles user interaction and business logic, but which cannot see the
private key; and a signer container that can see the private key, and responds
to simple signing requests from the frontend (e.g. over localhost networking).

With this partitioned approach, an attacker now has to trick the application
server into doing something rather arbitrary, which may be harder than getting
it to read a file.
-->

这可以在两个容器中分为两个进程：前端容器，用于处理用户交互和业务逻辑，但无法看到私钥；以及可以看到私钥的签名者容器，并且响应来自前端的简单签名请求（例如通过本地主机网络）。

使用这种分割方法，攻击者现在必须欺骗应用程序服务器才能进行任意的操作，这可能比使其读取文件更难。

<!-- TODO: explain how to do this while still using automation. -->

<!--
## Best practices

### Clients that use the secrets API

When deploying applications that interact with the secrets API, access should be
limited using [authorization policies](
/docs/reference/access-authn-authz/authorization/) such as [RBAC](
/docs/reference/access-authn-authz/rbac/).
-->

## 最佳实践

### 客户端使用 Secret API

当部署与 secret API 交互的应用程序时，应使用 [授权策略](/docs/reference/access-authn-authz/authorization/)， 例如 [RBAC](/docs/reference/access-authn-authz/rbac/) 来限制访问。

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

Secret 中的值对于不同的环境来说重要性可能不同，例如对于 Kubernetes 集群内部（例如 service account 令牌）和集群外部来说就不一样。即使一个应用程序可以理解其期望的与之交互的 secret 有多大的能力，但是同一命名空间中的其他应用程序却可能不这样认为。

由于这些原因，在命名空间中 `watch` 和 `list`  secret 的请求是非常强大的功能，应该避免这样的行为，因为列出 secret 可以让客户端检查所有 secret 是否在该命名空间中。在群集中`watch` 和 `list` 所有 secret 的能力应该只保留给最有特权的系统级组件。

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

需要访问 secrets API 的应用程序应该根据他们需要的 secret 执行 `get` 请求。这允许管理员限制对所有 secret 的访问，
同时设置 [白名单访问](/docs/reference/access-authn-authz/rbac/#referring-to-resources) 应用程序需要的各个实例。

为了提高循环获取的性能，客户端可以设计引用 secret 的资源，然后 `watch` 资源，在引用更改时重新请求 secret。
此外，还提出了一种 [”批量监控“ API](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/bulk_watch.md) 来让客户端 `watch` 每个资源，该功能可能会在将来的 Kubernetes 版本中提供。

<!--
## Security Properties


### Protections

Because `secret` objects can be created independently of the `pods` that use
them, there is less risk of the secret being exposed during the workflow of
creating, viewing, and editing pods.  The system can also take additional
precautions with `secret` objects, such as avoiding writing them to disk where
possible.
-->

## 安全属性

### 保护

因为 `secret` 对象可以独立于使用它们的 `pod` 而创建，所以在创建、查看和编辑 pod 的流程中 secret 被暴露的风险较小。系统还可以对 `secret` 对象采取额外的预防措施，例如避免将其写入到磁盘中可能的位置。

<!--
A secret is only sent to a node if a pod on that node requires it.
Kubelet stores the secret into a `tmpfs` so that the secret is not written
to disk storage. Once the Pod that depends on the secret is deleted, kubelet
will delete its local copy of the secret data as well.

There may be secrets for several pods on the same node.  However, only the
secrets that a pod requests are potentially visible within its containers.
Therefore, one Pod does not have access to the secrets of another Pod.
-->

只有当节点上的 pod 需要用到该 secret 时，该 secret 才会被发送到该节点上。它不会被写入磁盘，而是存储在 tmpfs 中。一旦依赖于它的 pod 被删除，它就被删除。

同一节点上的很多个 pod 可能拥有多个 secret。但是，只有 pod 请求的 secret 在其容器中才是可见的。因此，一个 pod 不能访问另一个 Pod 的 secret。

<!--
There may be several containers in a pod.  However, each container in a pod has
to request the secret volume in its `volumeMounts` for it to be visible within
the container.  This can be used to construct useful [security partitions at the
Pod level](#use-case-secret-visible-to-one-container-in-a-pod).

On most Kubernetes-project-maintained distributions, communication between user
to the apiserver, and from apiserver to the kubelets, is protected by SSL/TLS.
Secrets are protected when transmitted over these channels.
-->
Pod 中有多个容器。但是，pod 中的每个容器必须请求其挂载卷中的 secret 卷才能在容器内可见。
这可以用于 [在 Pod 级别构建安全分区](#使用案例secret-仅对-pod-中的一个容器可见)。

在大多数 Kubernetes 项目维护的发行版中，用户与 API server 之间的通信以及从 API server 到 kubelet 的通信都受到 SSL/TLS 的保护。通过这些通道传输时，secret 受到保护。

{{< feature-state for_k8s_version="v1.13" state="beta" >}}

<!--
You can enable [encryption at rest](/docs/tasks/administer-cluster/encrypt-data/)
for secret data, so that the secrets are not stored in the clear into {{< glossary_tooltip term_id="etcd" >}}.
-->
你可以为 secret 数据开启[静态加密](/docs/tasks/administer-cluster/encrypt-data/)，这样秘密信息就不会以明文形式存储到{{< glossary_tooltip term_id="etcd" >}}。

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

- API server 的 secret 数据以纯文本的方式存储在 etcd 中，因此：
  - 管理员应该为集群数据开启静态加密(需求 v1.13 或者更新)。
  - 管理员应该限制 admin 用户访问 etcd；
  - API server 中的 secret 数据位于 etcd 使用的磁盘上；管理员可能希望在不再使用时擦除/粉碎 etcd 使用的磁盘
  - 如果 etcd 运行在集群内，管理员应该确保 etcd 之间的通信使用 SSL/TLS 进行加密。
- 如果您将 secret 数据编码为 base64 的清单（JSON 或 YAML）文件，共享该文件或将其检入代码库，这样的话该密码将会被泄露。 Base64 编码不是一种加密方式，一样也是纯文本。
- 应用程序在从卷中读取 secret 后仍然需要保护 secret 的值，例如不会意外记录或发送给不信任方。
- 可以创建和使用 secret 的 pod 的用户也可以看到该 secret 的值。即使 API server 策略不允许用户读取 secret 对象，用户也可以运行暴露 secret 的 pod。
- 目前，任何节点的 root 用户都可以通过模拟 kubelet 来读取 API server 中的任何 secret。只有向实际需要它们的节点发送 secret 才能限制单个节点的根漏洞的影响，该功能还在计划中。

{{% capture whatsnext %}}

{{% /capture %}}
