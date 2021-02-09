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
{{< glossary_tooltip term_id="pod" >}} definition or in a
{{< glossary_tooltip text="container image" term_id="image" >}}.
See [Secrets design document](https://git.k8s.io/community/contributors/design-proposals/auth/secrets.md) for more information.
-->

`Secret` 对象类型用来保存敏感信息，例如密码、OAuth 令牌和 SSH 密钥。
将这些信息放在 `secret` 中比放在 {{< glossary_tooltip term_id="pod" >}} 的定义或者 {{< glossary_tooltip text="容器镜像" term_id="image" >}} 中来说更加安全和灵活。
参阅 [Secret 设计文档](https://git.k8s.io/community/contributors/design-proposals/auth/secrets.md) 获取更多详细信息。

<!--
A Secret is an object that contains a small amount of sensitive data such as
a password, a token, or a key. Such information might otherwise be put in a
Pod specification or in an image. Users can create Secrets and the system
also creates some Secrets.
-->
Secret 是一种包含少量敏感信息例如密码、令牌或密钥的对象。
这样的信息可能会被放在 Pod 规约中或者镜像中。
用户可以创建 Secret，同时系统也创建了一些 Secret。

{{< caution >}}
<!--
Kubernetes Secrets are, by default, stored as unencrypted base64-encoded
strings. By default they can be retrieved - as plain text - by anyone with API
access, or anyone with access to Kubernetes' underlying data store, etcd. In
order to safely use Secrets, we recommend you (at a minimum):

1. [Enable Encryption at Rest](https://kubernetes.io/docs/tasks/administer-cluster/encrypt-data/) for Secrets.
2. [Enable RBAC rules that restrict reading and writing the Secret](https://kubernetes.io/docs/reference/access-authn-authz/authorization/). Be aware that secrets can be obtained implicitly by anyone with the permission to create a Pod.
-->
Kubernetes Secret 默认情况下存储为 base64-编码的、非加密的字符串。
默认情况下，能够访问 API 的任何人，或者能够访问 Kubernetes 下层数据存储（etcd）
的任何人都可以以明文形式读取这些数据。
为了能够安全地使用 Secret，我们建议你（至少）：

1. 为 Secret [启用静态加密](/zh/docs/tasks/administer-cluster/encrypt-data/)；
2. [启用 RBAC 规则来限制对 Secret 的读写操作](/zh/docs/reference/access-authn-authz/authorization/)。
   要注意，任何被允许创建 Pod 的人都默认地具有读取 Secret 的权限。
{{< /caution >}}

<!-- body -->

<!--
## Overview of Secrets

To use a secret, a Pod needs to reference the secret.
A secret can be used with a Pod in three ways:

- As [files](#using-secrets-as-files-from-a-pod) in a
{{< glossary_tooltip text="volume" term_id="volume" >}} mounted on one or more of
its containers.
- As [container environment variable](#using-secrets-as-environment-variables).
- By the [kubelet when pulling images](#using-imagepullsecrets) for the Pod.
-->
## Secret 概览 {#overview-of-secrets}

要使用 Secret，Pod 需要引用 Secret。
Pod 可以用三种方式之一来使用 Secret：

- 作为挂载到一个或多个容器上的 {{< glossary_tooltip text="卷" term_id="volume" >}}
  中的[文件](#using-secrets-as-files-from-a-pod)。
- 作为[容器的环境变量](#using-secrets-as-environment-variables)
- 由 [kubelet 在为 Pod 拉取镜像时使用](#using-imagepullsecrets)

<!--
The name of a Secret object must be a valid
[DNS subdomain name](/docs/concepts/overview/working-with-objects/names#dns-subdomain-names).
You can specify the `data` and/or the `stringData` field when creating a
configuration file for a Secret.  The `data` and the `stringData` fields are optional.
The values for all keys in the `data` field have to be base64-encoded strings.
If the conversion to base64 string is not desirable, you can choose to specify
the `stringData` field instead, which accepts arbitrary strings as values.
-->
Secret 对象的名称必须是合法的 [DNS 子域名](/zh/docs/concepts/overview/working-with-objects/names#dns-subdomain-names)。
在为创建 Secret 编写配置文件时，你可以设置 `data` 与/或 `stringData` 字段。
`data` 和 `stringData` 字段都是可选的。`data` 字段中所有键值都必须是 base64
编码的字符串。如果不希望执行这种 base64 字符串的转换操作，你可以选择设置
`stringData` 字段，其中可以使用任何字符串作为其取值。

<!--
## Types of Secret {#secret-types}

When creating a Secret, you can specify its type using the `type` field of
the [`Secret`](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#secret-v1-core)
resource, or certain equivalent `kubectl` command line flags (if available).
The Secret type is used to facilitate programmatic handling of the Secret data.

Kubernetes provides several builtin types for some common usage scenarios.
These types vary in terms of the validations performed and the constraints
Kubernetes imposes on them.
-->
## Secret 的类型  {#secret-types}

在创建 Secret 对象时，你可以使用
[`Secret`](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#secret-v1-core)
资源的 `type` 字段，或者与其等价的 `kubectl` 命令行参数（如果有的话）为其设置类型。
Secret 的类型用来帮助编写程序处理 Secret 数据。

Kubernetes 提供若干种内置的类型，用于一些常见的使用场景。
针对这些类型，Kubernetes 所执行的合法性检查操作以及对其所实施的限制各不相同。

<!--
| Builtin Type | Usage |
|--------------|-------|
| `Opaque`     |  arbitrary user-defined data |
| `kubernetes.io/service-account-token` | service account token |
| `kubernetes.io/dockercfg` | serialized `~/.dockercfg` file |
| `kubernetes.io/dockerconfigjson` | serialized `~/.docker/config.json` file |
| `kubernetes.io/basic-auth` | credentials for basic authentication |
| `kubernetes.io/ssh-auth` | credentials for SSH authentication |
| `kubernetes.io/tls` | data for a TLS client or server |
| `bootstrap.kubernetes.io/token` | bootstrap token data |
-->
| 内置类型     | 用法  |
|--------------|-------|
| `Opaque`     | 用户定义的任意数据 |
| `kubernetes.io/service-account-token` | 服务账号令牌 |
| `kubernetes.io/dockercfg` | `~/.dockercfg` 文件的序列化形式 |
| `kubernetes.io/dockerconfigjson` | `~/.docker/config.json` 文件的序列化形式 |
| `kubernetes.io/basic-auth` | 用于基本身份认证的凭据 |
| `kubernetes.io/ssh-auth` | 用于 SSH 身份认证的凭据 |
| `kubernetes.io/tls` | 用于 TLS 客户端或者服务器端的数据 |
| `bootstrap.kubernetes.io/token` | 启动引导令牌数据 |

<!--
You can define and use your own Secret type by assigning a non-empty string as the
`type` value for a Secret object. An empty string is treated as an `Opaque` type.
Kubernetes doesn't impose any constraints on the type name. However, if you
are using one of the builtin types, you must meet all the requirements defined
for that type.
-->
通过为 Secret 对象的 `type` 字段设置一个非空的字符串值，你也可以定义并使用自己
Secret 类型。如果 `type` 值为空字符串，则被视为 `Opaque` 类型。
Kubernetes 并不对类型的名称作任何限制。不过，如果你要使用内置类型之一，
则你必须满足为该类型所定义的所有要求。

<!--
### Opaque secrets

`Opaque` is the default Secret type if omitted from a Secret configuration file.
When you create a Secret using `kubectl`, you will use the `generic`
subcommand to indicate an `Opaque` Secret type. For example, the following
command creates an empty Secret of type `Opaque`.
-->
### Opaque Secret

当 Secret 配置文件中未作显式设定时，默认的 Secret 类型是 `Opaque`。
当你使用 `kubectl` 来创建一个 Secret 时，你会使用 `generic` 子命令来标明
要创建的是一个 `Opaque` 类型 Secret。
例如，下面的命令会创建一个空的 `Opaque` 类型 Secret 对象：

```shell
kubectl create secret generic empty-secret
kubectl get secret empty-secret
```

<!--
The output looks like:
-->
输出类似于

```
NAME           TYPE     DATA   AGE
empty-secret   Opaque   0      2m6s
```

<!--
The `DATA` column shows the number of data items stored in the Secret.
In this case, `0` means we have just created an empty Secret.
-->
`DATA` 列显示 Secret 中保存的数据条目个数。
在这个例子种，`0` 意味着我们刚刚创建了一个空的 Secret。

<!--
###  Service account token Secrets

A `kubernetes.io/service-account-token` type of Secret is used to store a
token that identifies a service account. When using this Secret type, you need
to ensure that the `kubernetes.io/service-account.name` annotation is set to an
existing service account name. An Kubernetes controller fills in some other
fields such as the `kubernetes.io/service-account.uid` annotation and the
`token` key in the `data` field set to actual token content.

The following example configuration declares a service account token Secret:
-->
### 服务账号令牌 Secret  {#service-account-token-secrets}

类型为 `kubernetes.io/service-account-token` 的 Secret 用来存放标识某
服务账号的令牌。使用这种 Secret 类型时，你需要确保对象的注解
`kubernetes.io/service-account-name` 被设置为某个已有的服务账号名称。
某个 Kubernetes 控制器会填写 Secret 的其它字段，例如
`kubernetes.io/service-account.uid` 注解以及 `data` 字段中的 `token`
键值，使之包含实际的令牌内容。

下面的配置实例声明了一个服务账号令牌 Secret：

<!--
```yaml
apiVersion: v1
kind: Secret
metadata:
  name: secret-sa-sample
  annotations:
    kubernetes.io/service-account.name: "sa-name"
type: kubernetes.io/service-account-token
data:
  # You can include additional key value pairs as you do with Opaque Secrets
  extra: YmFyCg==
```
-->
```yaml
apiVersion: v1
kind: Secret
metadata:
  name: secret-sa-sample
  annotations:
    kubernetes.io/service-account.name: "sa-name"
type: kubernetes.io/service-account-token
data:
  # 你可以像 Opaque Secret 一样在这里添加额外的键/值偶对
  extra: YmFyCg==
```

<!--
When creating a `Pod`, Kubernetes automatically creates a service account Secret
and automatically modifies your Pod to use this Secret. The service account token
Secret contains credentials for accessing the API.

The automatic creation and use of API credentials can be disabled or
overridden if desired. However, if all you need to do is securely access the
API server, this is the recommended workflow.
-->
Kubernetes 在创建 Pod 时会自动创建一个服务账号 Secret 并自动修改你的 Pod
以使用该 Secret。该服务账号令牌 Secret 中包含了访问 Kubernetes API
所需要的凭据。

如果需要，可以禁止或者重载这种自动创建并使用 API 凭据的操作。
不过，如果你仅仅是希望能够安全地访问 API 服务器，这是建议的工作方式。

<!--
See the [ServiceAccount](/docs/tasks/configure-pod-container/configure-service-account/)
documentation for more information on how service accounts work.
You can also check the `automountServiceAccountToken` field and the
`serviceAccountName` field of the
[`Pod`](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#secret-v1-core)
for information on referencing service account from Pods.
-->
参考 [ServiceAccount](/zh/docs/tasks/configure-pod-container/configure-service-account/)
文档了解服务账号的工作原理。你也可以查看
[`Pod`](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#pod-v1-core)
资源中的 `automountServiceAccountToken` 和 `serviceAccountName` 字段文档，了解
从 Pod 中引用服务账号。

<!--
### Docker config Secrets

You can use one of the following `type` values to create a Secret to
store the credentials for accessing a Docker registry for images.
-->
### Docker 配置 Secret  {#docker-config-secrets}

你可以使用下面两种 `type` 值之一来创建 Secret，用以存放访问 Docker 仓库
来下载镜像的凭据。

- `kubernetes.io/dockercfg`
- `kubernetes.io/dockerconfigjson`

<!--
The `kubernetes.io/dockercfg` type is reserved to store a serialized
`~/.dockercfg` which is the legacy format for configuring Docker command line.
When using this Secret type, you have to ensure the Secret `data` field
contains a `.dockercfg` key whose value is content of a `~/.dockercfg` file
encoded in the base64 format.
-->
`kubernetes.io/dockercfg` 是一种保留类型，用来存放 `~/.dockercfg` 文件的
序列化形式。该文件是配置 Docker 命令行的一种老旧形式。
使用此 Secret 类型时，你需要确保 Secret 的 `data` 字段中包含名为
`.dockercfg` 的主键，其对应键值是用 base64 编码的某 `~/.dockercfg`
文件的内容。

<!--
The `kubernetes/dockerconfigjson` type is designed for storing a serialized
JSON that follows the same format rules as the `~/.docker/config.json` file
which is a new format for `~/.dockercfg`.
When using this Secret type, the `data` field of the Secret object must
contain a `.dockerconfigjson` key, in which the content for the
`~/.docker/config.json` file is provided as a base64 encoded string.

Below is an example for a `kubernetes.io/dockercfg` type of Secret:
-->
类型 `kubernetes.io/dockerconfigjson` 被设计用来保存 JSON 数据的序列化形式，
该 JSON 也遵从 `~/.docker/config.json` 文件的格式规则，而后者是
`~/.dockercfg` 的新版本格式。
使用此 Secret 类型时，Secret 对象的 `data` 字段必须包含 `.dockerconfigjson`
键，其键值为 base64 编码的字符串包含 `~/.docker/config.json` 文件的内容。

下面是一个 `kubernetes.io/dockercfg` 类型 Secret 的示例：

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: secret-dockercfg
type: kubernetes.io/dockercfg
data:
  .dockercfg: |
    "<base64 encoded ~/.dockercfg file>"
```

{{< note >}}
<!--
If you do not want to perform the base64 encoding, you can choose to use the
`stringData` field instead.
-->
如果你不希望执行 base64 编码转换，可以使用 `stringData` 字段代替。
{{< /note >}}

<!--
When you create these types of Secrets using a manifest, the API
server checks whether the expected key does exists in the `data` field, and
it verifies if the value provided can be parsed as a valid JSON. The API
server doesn't validate if the JSON actually is a Docker config file.

When you do not have a Docker config file, or you want to use `kubectl`
to create a Docker registry Secret, you can do:
-->
当你使用清单文件来创建这两类 Secret 时，API 服务器会检查 `data` 字段中是否
存在所期望的主键，并且验证其中所提供的键值是否是合法的 JSON 数据。
不过，API 服务器不会检查 JSON 数据本身是否是一个合法的 Docker 配置文件内容。

```shell
kubectl create secret docker-registry secret-tiger-docker \
  --docker-username=tiger \
  --docker-password=pass113 \
  --docker-email=tiger@acme.com
```

<!--
This command creates a Secret of type `kubernetes.io/dockerconfigjson`.
If you dump the `.dockerconfigjson` content from the `data` field, you will
get the following JSON content which is a valid Docker configuration created
on the fly:
-->
上面的命令创建一个类型为 `kubernetes.io/dockerconfigjson` 的 Secret。
如果你对 `data` 字段中的 `.dockerconfigjson` 内容进行转储，你会得到下面的
JSON 内容，而这一内容是一个合法的 Docker 配置文件。

```json
{
  "auths": {
    "https://index.docker.io/v1/": {
      "username": "tiger",
      "password": "pass113",
      "email": "tiger@acme.com",
      "auth": "dGlnZXI6cGFzczExMw=="
    }
  }
}
```

<!--
### Basic authentication Secret

The `kubernetes.io/basic-auth` type is provided for storing credentials needed
for basic authentication. When using this Secret type, the `data` field of the
Secret must contain the following two keys:

- `username`: the user name for authentication;
- `password`: the password or token for authentication.
-->
### 基本身份认证 Secret  {#basic-authentication-secret}

`kubernetes.io/basic-auth` 类型用来存放用于基本身份认证所需的凭据信息。
使用这种 Secret 类型时，Secret 的 `data` 字段必须包含以下两个键：

- `username`: 用于身份认证的用户名；
- `password`: 用于身份认证的密码或令牌。

<!--
Both values for the above two keys are base64 encoded strings. You can, of
course, provide the clear text content using the `stringData` for Secret
creation.

The following YAML is an example config for a basic authentication Secret:
-->
以上两个键的键值都是 base64 编码的字符串。
当然你也可以在创建 Secret 时使用 `stringData` 字段来提供明文形式的内容。
下面的 YAML 是基本身份认证 Secret 的一个示例清单：

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: secret-basic-auth
type: kubernetes.io/basic-auth
stringData:
  username: admin
  password: t0p-Secret
```

<!--
The basic authentication Secret type is provided only for user's convenience.
You can create an `Opaque` for credentials used for basic authentication.
However, using the builtin Secret type helps unify the formats of your credentials
and the API server does verify if the required keys are provided in a Secret
configuration.
-->
提供基本身份认证类型的 Secret 仅仅是出于用户方便性考虑。
你也可以使用 `Opaque` 类型来保存用于基本身份认证的凭据。
不过，使用内置的 Secret 类型的有助于对凭据格式进行归一化处理，并且
API 服务器确实会检查 Secret 配置中是否提供了所需要的主键。

<!--
### SSH authentication secrets

The builtin type `kubernetes.io/ssh-auth` is provided for storing data used in
SSH authentication. When using this Secret type, you will have to specify a
`ssh-privatekey` key-value pair in the `data` (or `stringData`) field.
as the SSH credential to use.

The following YAML is an example config for a SSH authentication Secret:
-->
### SSH 身份认证 Secret {#ssh-authentication-secrets}

Kubernetes 所提供的内置类型 `kubernetes.io/ssh-auth` 用来存放 SSH 身份认证中
所需要的凭据。使用这种 Secret 类型时，你就必须在其 `data` （或 `stringData`）
字段中提供一个 `ssh-privatekey` 键值对，作为要使用的 SSH 凭据。

下面的 YAML 是一个 SSH 身份认证 Secret 的配置示例：

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: secret-ssh-auth
type: kubernetes.io/ssh-auth
data:
  # 此例中的实际数据被截断
  ssh-privatekey: |
     MIIEpQIBAAKCAQEAulqb/Y ...
```

<!--
The SSH authentication Secret type is provided only for user's convenience.
You can create an `Opaque` for credentials used for SSH authentication.
However, using the builtin Secret type helps unify the formats of your credentials
and the API server does verify if the required keys are provided in a Secret
configuration.
-->
提供 SSH 身份认证类型的 Secret 仅仅是出于用户方便性考虑。
你也可以使用 `Opaque` 类型来保存用于 SSH 身份认证的凭据。
不过，使用内置的 Secret 类型的有助于对凭据格式进行归一化处理，并且
API 服务器确实会检查 Secret 配置中是否提供了所需要的主键。

<!--
SSH private keys do not establish trusted communication between an SSH client and
host server on their own. A secondary means of establishing trust is needed to
mitigate "man in the middle" attacks, such as a `known_hosts` file added to a
ConfigMap.
-->
{{< caution >}}
SSH 私钥自身无法建立 SSH 客户端与服务器端之间的可信连接。
需要其它方式来建立这种信任关系，以缓解“中间人（Man In The Middle）”
攻击，例如向 ConfigMap 中添加一个 `known_hosts` 文件。
{{< /caution >}}

<!--
### TLS secrets

Kubernetes provides a builtin Secret type `kubernetes.io/tls` for storing
a certificate and its associated key that are typically used for TLS . This
data is primarily used with TLS termination of the Ingress resource, but may
be used with other resources or directly by a workload.
When using this type of Secret, the `tls.key` and the `tls.crt` key must be provided
in the `data` (or `stringData`) field of the Secret configuration, although the API
server doesn't actually validate the values for each key.

The following YAML contains an example config for a TLS Secret:
-->
### TLS Secret

Kubernetes 提供一种内置的 `kubernetes.io/tls` Secret 类型，用来存放证书
及其相关密钥（通常用在 TLS 场合）。
此类数据主要提供给 Ingress 资源，用以终结 TLS 链接，不过也可以用于其他
资源或者负载。当使用此类型的 Secret 时，Secret 配置中的 `data` （或
`stringData`）字段必须包含 `tls.key` 和 `tls.crt` 主键，尽管 API 服务器
实际上并不会对每个键的取值作进一步的合法性检查。

下面的 YAML 包含一个 TLS Secret 的配置示例：

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: secret-tls
type: kubernetes.io/tls
data:
  # 此例中的数据被截断
  tls.crt: |
    MIIC2DCCAcCgAwIBAgIBATANBgkqh ...
  tls.key: |
    MIIEpgIBAAKCAQEA7yn3bRHQ5FHMQ ...
```

<!--
The TLS Secret type is provided for user's convenience. You can create an `Opaque`
for credentials used for TLS server and/or client. However, using the builtin Secret
type helps ensure the consistency of Secret format in your project; the API server
does verify if the required keys are provided in a Secret configuration.

When creating a TLS Secret using `kubectl`, you can use the `tls` subcommand
as shown in the following example:
-->
提供 TLS 类型的 Secret 仅仅是出于用户方便性考虑。
你也可以使用 `Opaque` 类型来保存用于 TLS 服务器与/或客户端的凭据。
不过，使用内置的 Secret 类型的有助于对凭据格式进行归一化处理，并且
API 服务器确实会检查 Secret 配置中是否提供了所需要的主键。

当使用 `kubectl` 来创建 TLS Secret 时，你可以像下面的例子一样使用 `tls`
子命令：

```shell
kubectl create secret tls my-tls-secret \
  --cert=path/to/cert/file \
  --key=path/to/key/file
```

<!--
The public/private key pair must exist before hand. The public key certificate
for `--cert` must be .PEM encoded (Base64-encoded DER format), and match the
given private key for `--key`.
The private key must be in what is commonly called PEM private key format,
unencrypted. In both cases, the initial and the last lines from PEM (for
example, `--------BEGIN CERTIFICATE-----` and `-------END CERTIFICATE----` for
a cetificate) are *not* included.
-->
这里的公钥/私钥对都必须事先已存在。用于 `--cert` 的公钥证书必须是 .PEM 编码的
（Base64 编码的 DER 格式），且与 `--key` 所给定的私钥匹配。
私钥必须是通常所说的 PEM 私钥格式，且未加密。对这两个文件而言，PEM 格式数据
的第一行和最后一行（例如，证书所对应的 `--------BEGIN CERTIFICATE-----` 和
`-------END CERTIFICATE----`）都不会包含在其中。
<!--
### Bootstrap token Secrets

A bootstrap token Secret can be created by explicitly specifying the Secret
`type` to `bootstrap.kubernetes.io/token`. This type of Secret is designed for
tokens used during the node bootstrap process. It stores tokens used to sign
well known ConfigMaps.
-->
### 启动引导令牌 Secret  {#bootstrap-token-secrets}

通过将 Secret 的 `type` 设置为 `bootstrap.kubernetes.io/token` 可以创建
启动引导令牌类型的 Secret。这种类型的 Secret 被设计用来支持节点的启动引导过程。
其中包含用来为周知的 ConfigMap 签名的令牌。

<!--
A bootstrap token Secret is usually created in the `kube-system` namespace and
named in the form `bootstrap-token-<token-id>` where `<token-id>` is a 6 character
string of the token ID.

As a Kubernetes manifest, a bootstrap token Secret might look like the
following:
-->
启动引导令牌 Secret 通常创建于 `kube-system` 名字空间内，并以
`bootstrap-token-<令牌 ID>` 的形式命名；其中 `<令牌 ID>` 是一个由 6 个字符组成
的字符串，用作令牌的标识。

以 Kubernetes 清单文件的形式，某启动引导令牌 Secret 可能看起来像下面这样：

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: bootstrap-token-5emitj
  namespace: kube-system
type: bootstrap.kubernetes.io/token
data:
  auth-extra-groups: c3lzdGVtOmJvb3RzdHJhcHBlcnM6a3ViZWFkbTpkZWZhdWx0LW5vZGUtdG9rZW4=
  expiration: MjAyMC0wOS0xM1QwNDozOToxMFo=
  token-id: NWVtaXRq
  token-secret: a3E0Z2lodnN6emduMXAwcg==
  usage-bootstrap-authentication: dHJ1ZQ==
  usage-bootstrap-signing: dHJ1ZQ==
```

<!--
A bootstrap type has the following keys specified under `data`:

- `token-id`: A random 6 character string as the token identifier. Required.
- `token-secret`: A random 16 character string as the actual token secret. Required.
- `description1`: A human-readable string that describes what the token is
  used for. Optional.
- `expiration`: An absolute UTC time using RFC3339 specifying when the token
  should be expired. Optional.
- `usage-bootstrap-<usage>`: A boolean flag indicating additional usage for
  the bootstrap token.
- `auth-extra-groups`: A comma-separated list of group names that will be
  authenticated as in addition to the `system:bootstrappers` group.
-->
启动引导令牌类型的 Secret 会在 `data` 字段中包含如下主键：

- `token-id`：由 6 个随机字符组成的字符串，作为令牌的标识符。必需。
- `token-secret`：由 16 个随机字符组成的字符串，包含实际的令牌机密。必需。
- `description`：供用户阅读的字符串，描述令牌的用途。可选。
- `expiration`：一个使用 RFC3339 来编码的 UTC 绝对时间，给出令牌要过期的时间。可选。
- `usage-bootstrap-<usage>`：布尔类型的标志，用来标明启动引导令牌的其他用途。
- `auth-extra-groups`：用逗号分隔的组名列表，身份认证时除被认证为
  `system:bootstrappers` 组之外，还会被添加到所列的用户组中。

<!--
The above YAML may look confusing because the values are all in base64 encoded
strings. In fact, you can create an identical Secret using the following YAML:

```yaml
apiVersion: v1
kind: Secret
metadata:
  # Note how the Secret is named
  name: bootstrap-token-5emitj
  # A bootstrap token Secret usually resides in the kube-system namespace
  namespace: kube-system
type: bootstrap.kubernetes.io/token
stringData:
  auth-extra-groups: "system:bootstrappers:kubeadm:default-node-token"
  expiration: "2020-09-13T04:39:10Z"
  # This token ID is used in the name
  token-id: "5emitj"
  token-secret: "kq4gihvszzgn1p0r"
  # This token can be used for authentication
  usage-bootstrap-authentication: "true"
  # and it can be used for signing
  usage-bootstrap-signing: "true"
```
-->
上面的 YAML 文件可能看起来令人费解，因为其中的数值均为 base64 编码的字符串。
实际上，你完全可以使用下面的 YAML 来创建一个一模一样的 Secret：

```yaml
apiVersion: v1
kind: Secret
metadata:
  # 注意 Secret 的命名方式
  name: bootstrap-token-5emitj
  # 启动引导令牌 Secret 通常位于 kube-system 名字空间
  namespace: kube-system
type: bootstrap.kubernetes.io/token
stringData:
  auth-extra-groups: "system:bootstrappers:kubeadm:default-node-token"
  expiration: "2020-09-13T04:39:10Z"
  # 此令牌 ID 被用于生成 Secret 名称
  token-id: "5emitj"
  token-secret: "kq4gihvszzgn1p0r"
  # 此令牌还可用于 authentication （身份认证）
  usage-bootstrap-authentication: "true"
  # 且可用于 signing （证书签名）
  usage-bootstrap-signing: "true"
```

<!--
## Creating a Secret

There are several options to create a Secret:

- [create Secret using `kubectl` command](/docs/tasks/configmap-secret/managing-secret-using-kubectl/)
- [create Secret from config file](/docs/tasks/configmap-secret/managing-secret-using-config-file/)
- [create Secret using kustomize](/docs/tasks/configmap-secret/managing-secret-using-kustomize/)
-->
## 创建 Secret {#creating-a-secret}

有几种不同的方式来创建 Secret：

- [使用 `kubectl` 命令创建 Secret](/zh/docs/tasks/configmap-secret/managing-secret-using-kubectl/)
- [使用配置文件来创建 Secret](/zh/docs/tasks/configmap-secret/managing-secret-using-config-file/)
- [使用 kustomize 来创建 Secret](/zh/docs/tasks/configmap-secret/managing-secret-using-kustomize/)

<!--
## Editing a Secret

An existing Secret may be edited with the following command:
-->
## 编辑 Secret  {#editing-a-secret}

你可以通过下面的命令编辑现有的 Secret：

```shell
kubectl edit secrets mysecret
```

<!--
This will open the default configured editor and allow for updating the base64 encoded Secret values in the `data` field:
-->
这一命令会打开默认的编辑器，允许你更新 `data` 字段中包含的
base64 编码的 Secret 值：

```yaml
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
## 使用 Secret  {#using-secrets}

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

<!--
### Using Secrets as environment variables

To use a secret in an {{< glossary_tooltip text="environment variable" term_id="container-env-variables" >}}
in a Pod:

1. Create a secret or use an existing one.  Multiple Pods can reference the same secret.
1. Modify your Pod definition in each container that you wish to consume the value of a secret key to add an environment variable for each secret key you wish to consume. The environment variable that consumes the secret key should populate the secret's name and key in `env[].valueFrom.secretKeyRef`.
1. Modify your image and/or command line so that the program looks for values in the specified environment variables.

This is an example of a Pod that uses secrets from environment variables:
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
#### Consuming Secret Values from environment variables

Inside a container that consumes a secret in an environment variables, the secret keys appear as
normal environment variables containing the base64 decoded values of the secret data.
This is the result of commands executed inside the container from the example above:
-->
#### 使用来自环境变量的 Secret 值 {#consuming-secret-values-from-environment-variables}

在一个以环境变量形式使用 Secret 的容器中，Secret 键表现为常规的环境变量，其中
包含 Secret 数据的 base-64 解码值。这是从上面的示例在容器内执行的命令的结果：

```shell
echo $SECRET_USERNAME
```

<!--
The output is similar to:
-->
输出类似于：

```
admin
```

```shell
echo $SECRET_PASSWORD
```

<!--
The output is similar to:
-->
输出类似于：

```
1f2d1e2e67df
```

<!--
#### Environment variables are not updated after a secret update

If a container already consumes a Secret in an environment variable, a Secret update will not be seen by the container unless it is restarted.
There are third party solutions for triggering restarts when secrets change.
-->
#### Secret 更新之后对应的环境变量不会被更新

如果某个容器已经在通过环境变量使用某 Secret，对该 Secret 的更新不会被
容器马上看见，除非容器被重启。有一些第三方的解决方案能够在 Secret 发生
变化时触发容器重启。

<!--
## Immutable Secrets {#secret-immutable}
-->
## 不可更改的 Secret {#secret-immutable}

{{< feature-state for_k8s_version="v1.19" state="beta" >}}

<!--
The Kubernetes beta feature _Immutable Secrets and ConfigMaps_ provides an option to set
individual Secrets and ConfigMaps as immutable. For clusters that extensively use Secrets
(at least tens of thousands of unique Secret to Pod mounts), preventing changes to their
data has the following advantages:

- protects you from accidental (or unwanted) updates that could cause applications outages
- improves performance of your cluster by significantly reducing load on kube-apiserver, by
closing watches for secrets marked as immutable.
-->
Kubernetes 的 alpha 特性 _不可变的 Secret 和 ConfigMap_ 提供了一种可选配置，
可以设置各个 Secret 和 ConfigMap 为不可变的。
对于大量使用 Secret 的集群（至少有成千上万各不相同的 Secret 供 Pod 挂载），
禁止变更它们的数据有下列好处：

- 防止意外（或非预期的）更新导致应用程序中断
- 通过将 Secret 标记为不可变来关闭 kube-apiserver 对其的监视，从而显著降低
  kube-apiserver 的负载，提升集群性能。

<!--
This feature is controlled by the `ImmutableEphemeralVolumes` [feature
gate](/docs/reference/command-line-tools-reference/feature-gates/),
which is enabled by default since v1.19. You can create an immutable
Secret by setting the `immutable` field to `true`. For example,
-->
这个特性通过 `ImmutableEmphemeralVolumes`
[特性门控](/zh/docs/reference/command-line-tools-reference/feature-gates/)
来控制，从 v1.19 开始默认启用。
你可以通过将 Secret 的 `immutable` 字段设置为 `true` 创建不可更改的 Secret。
例如：

```yaml
apiVersion: v1
kind: Secret
metadata:
  ...
data:
  ...
immutable: true
```

{{< note >}}
<!--
Once a Secret or ConfigMap is marked as immutable, it is _not_ possible to revert this change
nor to mutate the contents of the `data` field. You can only delete and recreate the Secret.
Existing Pods maintain a mount point to the deleted Secret - it is recommended to recreate
these pods.
-->
一旦一个 Secret 或 ConfigMap 被标记为不可更改，撤销此操作或者更改 `data` 字段的内容都是 _不_ 可能的。
只能删除并重新创建这个 Secret。现有的 Pod 将维持对已删除 Secret 的挂载点 - 建议重新创建这些 Pod。
{{< /note >}}

<!--
### Using imagePullSecrets

The `imagePullSecrets` field is a list of references to secrets in the same namespace.
You can use an `imagePullSecrets` to pass a secret that contains a Docker (or other) image registry
password to the kubelet. The kubelet uses this information to pull a private image on behalf of your Pod.
See the [PodSpec API](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#podspec-v1-core) for more information about the `imagePullSecrets` field.

#### Manually specifying an imagePullSecret

You can learn how to specify `ImagePullSecrets` from the [container images documentation](/docs/concepts/containers/images/#specifying-imagepullsecrets-on-a-pod).
-->
#### 使用 imagePullSecret  {#using-imagepullsecrets}

`imagePullSecrets` 字段中包含一个列表，列举对同一名字空间中的 Secret 的引用。
你可以使用 `imagePullSecrets` 将包含 Docker（或其他）镜像仓库密码的 Secret 传递给
kubelet。kubelet 使用此信息来替你的 Pod 拉取私有镜像。
关于 `imagePullSecrets` 字段的更多信息，请参考
[PodSpec API](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#podspec-v1-core) 文档。

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

## {{% heading "whatsnext" %}}

<!--
- Learn how to [manage Secret using `kubectl`](/docs/tasks/configmap-secret/managing-secret-using-kubectl/)
- Learn how to [manage Secret using config file](/docs/tasks/configmap-secret/managing-secret-using-config-file/)
- Learn how to [manage Secret using kustomize](/docs/tasks/configmap-secret/managing-secret-using-kustomize/)
-->
- 学习如何[使用 `kubectl` 管理 Secret](/zh/docs/tasks/configmap-secret/managing-secret-using-kubectl/)
- 学习如何[使用配置文件管理 Secret](/zh/docs/tasks/configmap-secret/managing-secret-using-config-file/)
- 学习如何[使用 kustomize 管理 Secret](/zh/docs/tasks/configmap-secret/managing-secret-using-kustomize/)

