---
title: Secret
api_metadata:
- apiVersion: "v1"
  kind: "Secret"
content_type: concept
feature:
  title: Secret 和配置管理
  description: >
    部署和更新 Secret 和应用程序的配置而不必重新构建容器镜像，
    且不必将软件堆栈配置中的秘密信息暴露出来。
weight: 30
---
<!--
reviewers:
- mikedanese
title: Secrets
api_metadata:
- apiVersion: "v1"
  kind: "Secret"
content_type: concept
feature:
  title: Secret and configuration management
  description: >
    Deploy and update Secrets and application configuration without rebuilding your image
    and without exposing Secrets in your stack configuration.
weight: 30
-->

<!-- overview -->

<!--
A Secret is an object that contains a small amount of sensitive data such as
a password, a token, or a key. Such information might otherwise be put in a
{{< glossary_tooltip term_id="pod" >}} specification or in a
{{< glossary_tooltip text="container image" term_id="image" >}}. Using a
Secret means that you don't need to include confidential data in your
application code.
-->
Secret 是一种包含少量敏感信息例如密码、令牌或密钥的对象。
这样的信息可能会被放在 {{< glossary_tooltip term_id="pod" >}} 规约中或者镜像中。
使用 Secret 意味着你不需要在应用程序代码中包含机密数据。

<!--
Because Secrets can be created independently of the Pods that use them, there
is less risk of the Secret (and its data) being exposed during the workflow of
creating, viewing, and editing Pods. Kubernetes, and applications that run in
your cluster, can also take additional precautions with Secrets, such as avoiding
writing sensitive data to nonvolatile storage.

Secrets are similar to {{< glossary_tooltip text="ConfigMaps" term_id="configmap" >}}
but are specifically intended to hold confidential data.
-->
由于创建 Secret 可以独立于使用它们的 Pod，
因此在创建、查看和编辑 Pod 的工作流程中暴露 Secret（及其数据）的风险较小。
Kubernetes 和在集群中运行的应用程序也可以对 Secret 采取额外的预防措施，
例如避免将敏感数据写入非易失性存储。

Secret 类似于 {{<glossary_tooltip text="ConfigMap" term_id="configmap" >}}
但专门用于保存机密数据。

{{< caution >}}
<!--
Kubernetes Secrets are, by default, stored unencrypted in the API server's underlying data store
(etcd). Anyone with API access can retrieve or modify a Secret, and so can anyone with access to etcd.
Additionally, anyone who is authorized to create a Pod in a namespace can use that access to read
any Secret in that namespace; this includes indirect access such as the ability to create a
Deployment.

In order to safely use Secrets, take at least the following steps:

1. [Enable Encryption at Rest](/docs/tasks/administer-cluster/encrypt-data/) for Secrets.
1. [Enable or configure RBAC rules](/docs/reference/access-authn-authz/authorization/) with
   least-privilege access to Secrets.
1. Restrict Secret access to specific containers.
1. [Consider using external Secret store providers](https://secrets-store-csi-driver.sigs.k8s.io/concepts.html#provider-for-the-secrets-store-csi-driver).
-->
默认情况下，Kubernetes Secret 未加密地存储在 API 服务器的底层数据存储（etcd）中。
任何拥有 API 访问权限的人都可以检索或修改 Secret，任何有权访问 etcd 的人也可以。
此外，任何有权限在命名空间中创建 Pod 的人都可以使用该访问权限读取该命名空间中的任何 Secret；
这包括间接访问，例如创建 Deployment 的能力。

为了安全地使用 Secret，请至少执行以下步骤：

1. 为 Secret [启用静态加密](/zh-cn/docs/tasks/administer-cluster/encrypt-data/)。
1. 以最小特权访问 Secret 并[启用或配置 RBAC 规则](/zh-cn/docs/reference/access-authn-authz/authorization/)。
1. 限制 Secret 对特定容器的访问。
1. [考虑使用外部 Secret 存储驱动](https://secrets-store-csi-driver.sigs.k8s.io/concepts.html#provider-for-the-secrets-store-csi-driver)。

<!--
For more guidelines to manage and improve the security of your Secrets, refer to
[Good practices for Kubernetes Secrets](/docs/concepts/security/secrets-good-practices).
-->
有关管理和提升 Secret 安全性的指南，请参阅
[Kubernetes Secret 良好实践](/zh-cn/docs/concepts/security/secrets-good-practices)。
{{< /caution >}}

<!--
See [Information security for Secrets](#information-security-for-secrets) for more details.
-->
参见 [Secret 的信息安全](#information-security-for-secrets)了解详情。

<!-- body -->

<!--
## Uses for Secrets

You can use Secrets for purposes such as the following:
- [Set environment variables for a container](/docs/tasks/inject-data-application/distribute-credentials-secure/#define-container-environment-variables-using-secret-data).
- [Provide credentials such as SSH keys or passwords to Pods](/docs/tasks/inject-data-application/distribute-credentials-secure/#provide-prod-test-creds).
- [Allow the kubelet to pull container images from private registries](/docs/tasks/configure-pod-container/pull-image-private-registry/).

The Kubernetes control plane also uses Secrets; for example,
[bootstrap token Secrets](#bootstrap-token-secrets) are a mechanism to
help automate node registration.
-->
## Secret 的使用 {#uses-for-secrets}

你可以将 Secret 用于以下场景：

- [设置容器的环境变量](/zh-cn/docs/tasks/inject-data-application/distribute-credentials-secure/#define-container-environment-variables-using-secret-data)。
- [向 Pod 提供 SSH 密钥或密码等凭据](/zh-cn/docs/tasks/inject-data-application/distribute-credentials-secure/#provide-prod-test-creds)。
- [允许 kubelet 从私有镜像仓库中拉取镜像](/zh-cn/docs/tasks/configure-pod-container/pull-image-private-registry/)。

Kubernetes 控制面也使用 Secret；
例如，[引导令牌 Secret](#bootstrap-token-secrets)
是一种帮助自动化节点注册的机制。

<!--
### Use case: dotfiles in a secret volume

You can make your data "hidden" by defining a key that begins with a dot.
This key represents a dotfile or "hidden" file. For example, when the following Secret
is mounted into a volume, `secret-volume`, the volume will contain a single file,
called `.secret-file`, and the `dotfile-test-container` will have this file
present at the path `/etc/secret-volume/.secret-file`.
-->
### 使用场景：在 Secret 卷中带句点的文件 {#use-case-dotfiles-in-a-secret-volume}

通过定义以句点（`.`）开头的主键，你可以“隐藏”你的数据。
这些主键代表的是以句点开头的文件或“隐藏”文件。
例如，当以下 Secret 被挂载到 `secret-volume` 卷上时，该卷中会包含一个名为
`.secret-file` 的文件，并且容器 `dotfile-test-container`
中此文件位于路径 `/etc/secret-volume/.secret-file` 处。

{{< note >}}
<!--
Files beginning with dot characters are hidden from the output of  `ls -l`;
you must use `ls -la` to see them when listing directory contents.
-->
以句点开头的文件会在 `ls -l` 的输出中被隐藏起来；
列举目录内容时你必须使用 `ls -la` 才能看到它们。
{{< /note >}}

{{% code language="yaml" file="secret/dotfile-secret.yaml" %}}

<!--
### Use case: Secret visible to one container in a Pod

Consider a program that needs to handle HTTP requests, do some complex business
logic, and then sign some messages with an HMAC. Because it has complex
application logic, there might be an unnoticed remote file reading exploit in
the server, which could expose the private key to an attacker.
-->
### 使用场景：仅对 Pod 中一个容器可见的 Secret {#use-case-secret-visible-to-one-container-in-a-pod}

考虑一个需要处理 HTTP 请求，执行某些复杂的业务逻辑，之后使用 HMAC
来对某些消息进行签名的程序。因为这一程序的应用逻辑很复杂，
其中可能包含未被注意到的远程服务器文件读取漏洞，
这种漏洞可能会把私钥暴露给攻击者。

<!--
This could be divided into two processes in two containers: a frontend container
which handles user interaction and business logic, but which cannot see the
private key; and a signer container that can see the private key, and responds
to simple signing requests from the frontend (for example, over localhost networking).
-->
这一程序可以分隔成两个容器中的两个进程：前端容器要处理用户交互和业务逻辑，
但无法看到私钥；签名容器可以看到私钥，并对来自前端的简单签名请求作出响应
（例如，通过本地主机网络）。

<!--
With this partitioned approach, an attacker now has to trick the application
server into doing something rather arbitrary, which may be harder than getting
it to read a file.
-->
采用这种划分的方法，攻击者现在必须欺骗应用服务器来做一些其他操作，
而这些操作可能要比读取一个文件要复杂很多。

<!--
### Alternatives to Secrets

Rather than using a Secret to protect confidential data, you can pick from alternatives.

Here are some of your options:
-->
### Secret 的替代方案  {#alternatives-to-secrets}

除了使用 Secret 来保护机密数据，你也可以选择一些替代方案。

下面是一些选项：

<!--
- If your cloud-native component needs to authenticate to another application that you
  know is running within the same Kubernetes cluster, you can use a
  [ServiceAccount](/docs/reference/access-authn-authz/authentication/#service-account-tokens)
  and its tokens to identify your client.
- There are third-party tools that you can run, either within or outside your cluster,
  that provide sensitive data. For example, a service that Pods access over HTTPS,
  that reveals a Secret if the client correctly authenticates (for example, with a ServiceAccount
  token).
-->
- 如果你的云原生组件需要执行身份认证来访问你所知道的、在同一 Kubernetes 集群中运行的另一个应用，
  你可以使用 [ServiceAccount](/zh-cn/docs/reference/access-authn-authz/authentication/#service-account-tokens)
  及其令牌来标识你的客户端身份。
- 你可以运行的第三方工具也有很多，这些工具可以运行在集群内或集群外，提供机密数据管理。
  例如，这一工具可能是 Pod 通过 HTTPS 访问的一个服务，该服务在客户端能够正确地通过身份认证
  （例如，通过 ServiceAccount 令牌）时，提供机密数据内容。
<!--
- For authentication, you can implement a custom signer for X.509 certificates, and use
  [CertificateSigningRequests](/docs/reference/access-authn-authz/certificate-signing-requests/)
  to let that custom signer issue certificates to Pods that need them.
- You can use a [device plugin](/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/)
  to expose node-local encryption hardware to a specific Pod. For example, you can schedule
  trusted Pods onto nodes that provide a Trusted Platform Module, configured out-of-band.
-->
- 就身份认证而言，你可以为 X.509 证书实现一个定制的签名者，并使用
  [CertificateSigningRequest](/zh-cn/docs/reference/access-authn-authz/certificate-signing-requests/)
  来让该签名者为需要证书的 Pod 发放证书。
- 你可以使用一个[设备插件](/zh-cn/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/)
  来将节点本地的加密硬件暴露给特定的 Pod。例如，你可以将可信任的 Pod
  调度到提供可信平台模块（Trusted Platform Module，TPM）的节点上。
  这类节点是另行配置的。

<!--
You can also combine two or more of those options, including the option to use Secret objects themselves.

For example: implement (or deploy) an {{< glossary_tooltip text="operator" term_id="operator-pattern" >}}
that fetches short-lived session tokens from an external service, and then creates Secrets based
on those short-lived session tokens. Pods running in your cluster can make use of the session tokens,
and operator ensures they are valid. This separation means that you can run Pods that are unaware of
the exact mechanisms for issuing and refreshing those session tokens.
-->
你还可以将如上选项的两种或多种进行组合，包括直接使用 Secret 对象本身也是一种选项。

例如：实现（或部署）一个 {{< glossary_tooltip text="operator" term_id="operator-pattern" >}}，
从外部服务取回生命期很短的会话令牌，之后基于这些生命期很短的会话令牌来创建 Secret。
运行在集群中的 Pod 可以使用这些会话令牌，而 Operator 则确保这些令牌是合法的。
这种责权分离意味着你可以运行那些不了解会话令牌如何发放与刷新的确切机制的 Pod。

<!--
## Types of Secret {#secret-types}

When creating a Secret, you can specify its type using the `type` field of
the [Secret](/docs/reference/kubernetes-api/config-and-storage-resources/secret-v1/)
resource, or certain equivalent `kubectl` command line flags (if available).
The Secret type is used to facilitate programmatic handling of the Secret data.

Kubernetes provides several built-in types for some common usage scenarios.
These types vary in terms of the validations performed and the constraints
Kubernetes imposes on them.
-->
## Secret 的类型  {#secret-types}

创建 Secret 时，你可以使用 [Secret](/zh-cn/docs/reference/kubernetes-api/config-and-storage-resources/secret-v1/)
资源的 `type` 字段，或者与其等价的 `kubectl` 命令行参数（如果有的话）为其设置类型。
Secret 类型有助于对 Secret 数据进行编程处理。

Kubernetes 提供若干种内置的类型，用于一些常见的使用场景。
针对这些类型，Kubernetes 所执行的合法性检查操作以及对其所实施的限制各不相同。

<!--
| Built-in Type | Usage |
|--------------|-------|
| `Opaque`     |  arbitrary user-defined data |
| `kubernetes.io/service-account-token` | ServiceAccount token |
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
`type` value for a Secret object (an empty string is treated as an `Opaque` type).
-->
通过为 Secret 对象的 `type` 字段设置一个非空的字符串值，你也可以定义并使用自己
Secret 类型（如果 `type` 值为空字符串，则被视为 `Opaque` 类型）。

<!--
Kubernetes doesn't impose any constraints on the type name. However, if you
are using one of the built-in types, you must meet all the requirements defined
for that type.
-->
Kubernetes 并不对类型的名称作任何限制。不过，如果你要使用内置类型之一，
则你必须满足为该类型所定义的所有要求。

<!--
If you are defining a type of Secret that's for public use, follow the convention
and structure the Secret type to have your domain name before the name, separated
by a `/`. For example: `cloud-hosting.example.net/cloud-api-credentials`.
-->
如果你要定义一种公开使用的 Secret 类型，请遵守 Secret 类型的约定和结构，
在类型名前面添加域名，并用 `/` 隔开。
例如：`cloud-hosting.example.net/cloud-api-credentials`。

<!--
### Opaque Secrets

`Opaque` is the default Secret type if you don't explicitly specify a type in
a Secret manifest. When you create a Secret using `kubectl`, you must use the
`generic` subcommand to indicate an `Opaque` Secret type. For example, the
following command creates an empty Secret of type `Opaque`:
-->
### Opaque Secret

当你未在 Secret 清单中显式指定类型时，默认的 Secret 类型是 `Opaque`。
当你使用 `kubectl` 来创建一个 Secret 时，你必须使用 `generic`
子命令来标明要创建的是一个 `Opaque` 类型的 Secret。
例如，下面的命令会创建一个空的 `Opaque` 类型的 Secret：

```shell
kubectl create secret generic empty-secret
kubectl get secret empty-secret
```

<!--
The output looks like:
-->
输出类似于：

```
NAME           TYPE     DATA   AGE
empty-secret   Opaque   0      2m6s
```

<!--
The `DATA` column shows the number of data items stored in the Secret.
In this case, `0` means you have created an empty Secret.
-->
`DATA` 列显示 Secret 中保存的数据条目个数。
在这个例子中，`0` 意味着你刚刚创建了一个空的 Secret。

<!--
### ServiceAccount token Secrets

A `kubernetes.io/service-account-token` type of Secret is used to store a
token credential that identifies a
{{< glossary_tooltip text="ServiceAccount" term_id="service-account" >}}. This
is a legacy mechanism that provides long-lived ServiceAccount credentials to
Pods.
-->
### ServiceAccount 令牌 Secret  {#service-account-token-secrets}

类型为 `kubernetes.io/service-account-token` 的 Secret 用来存放标识某
{{< glossary_tooltip text="ServiceAccount" term_id="service-account" >}} 的令牌凭据。
这是为 Pod 提供长期有效 ServiceAccount 凭据的传统机制。

<!--
In Kubernetes v1.22 and later, the recommended approach is to obtain a
short-lived, automatically rotating ServiceAccount token by using the
[`TokenRequest`](/docs/reference/kubernetes-api/authentication-resources/token-request-v1/)
API instead. You can get these short-lived tokens using the following methods:
-->
在 Kubernetes v1.22 及更高版本中，推荐的方法是通过使用
[`TokenRequest`](/zh-cn/docs/reference/kubernetes-api/authentication-resources/token-request-v1/) API
来获取短期自动轮换的 ServiceAccount 令牌。你可以使用以下方法获取这些短期令牌：

<!--
* Call the `TokenRequest` API either directly or by using an API client like
  `kubectl`. For example, you can use the
  [`kubectl create token`](/docs/reference/generated/kubectl/kubectl-commands#-em-token-em-)
  command.
* Request a mounted token in a
  [projected volume](/docs/reference/access-authn-authz/service-accounts-admin/#bound-service-account-token-volume)
  in your Pod manifest. Kubernetes creates the token and mounts it in the Pod.
  The token is automatically invalidated when the Pod that it's mounted in is
  deleted. For details, see
  [Launch a Pod using service account token projection](/docs/tasks/configure-pod-container/configure-service-account/#launch-a-pod-using-service-account-token-projection).
-->
- 直接调用 `TokenRequest` API，或者使用像 `kubectl` 这样的 API 客户端。
  例如，你可以使用
  [`kubectl create token`](/docs/reference/generated/kubectl/kubectl-commands#-em-token-em-) 命令。
- 在 Pod 清单中请求使用[投射卷](/zh-cn/docs/reference/access-authn-authz/service-accounts-admin/#bound-service-account-token-volume)挂载的令牌。
  Kubernetes 会创建令牌并将其挂载到 Pod 中。
  当挂载令牌的 Pod 被删除时，此令牌会自动失效。
  更多细节参阅[启动使用服务账号令牌投射的 Pod](/zh-cn/docs/tasks/configure-pod-container/configure-service-account/#launch-a-pod-using-service-account-token-projection)。

{{< note >}}
<!--
You should only create a ServiceAccount token Secret
if you can't use the `TokenRequest` API to obtain a token,
and the security exposure of persisting a non-expiring token credential
in a readable API object is acceptable to you. For instructions, see
[Manually create a long-lived API token for a ServiceAccount](/docs/tasks/configure-pod-container/configure-service-account/#manually-create-an-api-token-for-a-serviceaccount).
-->
只有在你无法使用 `TokenRequest` API 来获取令牌，
并且你能够接受因为将永不过期的令牌凭据写入到可读取的 API 对象而带来的安全风险时，
才应该创建 ServiceAccount 令牌 Secret。
更多细节参阅[为 ServiceAccount 手动创建长期有效的 API 令牌](/zh-cn/docs/tasks/configure-pod-container/configure-service-account/#manually-create-an-api-token-for-a-serviceaccount)。
{{< /note >}}

<!--
When using this Secret type, you need to ensure that the
`kubernetes.io/service-account.name` annotation is set to an existing
ServiceAccount name. If you are creating both the ServiceAccount and
the Secret objects, you should create the ServiceAccount object first.
-->
使用这种 Secret 类型时，你需要确保对象的注解 `kubernetes.io/service-account-name`
被设置为某个已有的 ServiceAccount 名称。
如果你同时创建 ServiceAccount 和 Secret 对象，应该先创建 ServiceAccount 对象。

<!--
After the Secret is created, a Kubernetes {{< glossary_tooltip text="controller" term_id="controller" >}}
fills in some other fields such as the `kubernetes.io/service-account.uid` annotation, and the
`token` key in the `data` field, which is populated with an authentication token.

The following example configuration declares a ServiceAccount token Secret:
-->
当 Secret 对象被创建之后，某个 Kubernetes
{{< glossary_tooltip text="控制器" term_id="controller" >}}会填写
Secret 的其它字段，例如 `kubernetes.io/service-account.uid` 注解和
`data` 字段中的 `token` 键值（该键包含一个身份认证令牌）。

下面的配置实例声明了一个 ServiceAccount 令牌 Secret：

{{% code language="yaml" file="secret/serviceaccount-token-secret.yaml" %}}

<!--
After creating the Secret, wait for Kubernetes to populate the `token` key in the `data` field.
-->
创建了 Secret 之后，等待 Kubernetes 在 `data` 字段中填充 `token` 主键。

<!--
See the [ServiceAccount](/docs/concepts/security/service-accounts/)
documentation for more information on how ServiceAccounts work.
You can also check the `automountServiceAccountToken` field and the
`serviceAccountName` field of the
[`Pod`](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#pod-v1-core)
for information on referencing ServiceAccount credentials from within Pods.
-->
参考 [ServiceAccount](/zh-cn/docs/concepts/security/service-accounts/)
文档了解 ServiceAccount 的工作原理。你也可以查看
[`Pod`](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#pod-v1-core)
资源中的 `automountServiceAccountToken` 和 `serviceAccountName` 字段文档，
进一步了解从 Pod 中引用 ServiceAccount 凭据。

<!--
### Docker config Secrets

If you are creating a Secret to store credentials for accessing a container image registry,
you must use one of the following `type` values for that Secret:
-->
### Docker 配置 Secret  {#docker-config-secrets}

如果你要创建 Secret 用来存放用于访问容器镜像仓库的凭据，则必须选用以下 `type`
值之一来创建 Secret：

<!--
- `kubernetes.io/dockercfg`: store a serialized `~/.dockercfg` which is the
  legacy format for configuring Docker command line. The Secret
  `data` field contains a `.dockercfg` key whose value is the content of a
  base64 encoded `~/.dockercfg` file.
- `kubernetes.io/dockerconfigjson`: store a serialized JSON that follows the
  same format rules as the `~/.docker/config.json` file, which is a new format
  for `~/.dockercfg`. The Secret `data` field must contain a
  `.dockerconfigjson` key for which the value is the content of a base64
  encoded `~/.docker/config.json` file.
-->
- `kubernetes.io/dockercfg`：存放 `~/.dockercfg` 文件的序列化形式，它是配置 Docker
  命令行的一种老旧形式。Secret 的 `data` 字段包含名为 `.dockercfg` 的主键，
  其值是用 base64 编码的某 `~/.dockercfg` 文件的内容。
- `kubernetes.io/dockerconfigjson`：存放 JSON 数据的序列化形式，
  该 JSON 也遵从 `~/.docker/config.json` 文件的格式规则，而后者是 `~/.dockercfg`
  的新版本格式。使用此 Secret 类型时，Secret 对象的 `data` 字段必须包含
  `.dockerconfigjson` 键，其键值为 base64 编码的字符串包含 `~/.docker/config.json`
  文件的内容。

<!--
Below is an example for a `kubernetes.io/dockercfg` type of Secret:
-->
下面是一个 `kubernetes.io/dockercfg` 类型 Secret 的示例：

{{% code language="yaml" file="secret/dockercfg-secret.yaml" %}}

{{< note >}}
<!--
If you do not want to perform the base64 encoding, you can choose to use the
`stringData` field instead.
-->
如果你不希望执行 base64 编码转换，可以使用 `stringData` 字段代替。
{{< /note >}}

<!--
When you create Docker config Secrets using a manifest, the API
server checks whether the expected key exists in the `data` field, and
it verifies if the value provided can be parsed as a valid JSON. The API
server doesn't validate if the JSON actually is a Docker config file.

You can also use `kubectl` to create a Secret for accessing a container
registry, such as when you don't have a Docker configuration file:
-->
当你使用清单文件通过 Docker 配置来创建 Secret 时，API 服务器会检查 `data` 字段中是否存在所期望的主键，
并且验证其中所提供的键值是否是合法的 JSON 数据。
不过，API 服务器不会检查 JSON 数据本身是否是一个合法的 Docker 配置文件内容。

你还可以使用 `kubectl` 创建一个 Secret 来访问容器仓库时，
当你没有 Docker 配置文件时你可以这样做：

```shell
kubectl create secret docker-registry secret-tiger-docker \
  --docker-email=tiger@acme.example \
  --docker-username=tiger \
  --docker-password=pass1234 \
  --docker-server=my-registry.example:5000
```

<!--
This command creates a Secret of type `kubernetes.io/dockerconfigjson`.

Retrieve the `.data.dockerconfigjson` field from that new Secret and decode the
data:
-->
此命令创建一个类型为 `kubernetes.io/dockerconfigjson` 的 Secret。

从这个新的 Secret 中获取 `.data.dockerconfigjson` 字段并执行数据解码：

```shell
kubectl get secret secret-tiger-docker -o jsonpath='{.data.*}' | base64 -d
```

<!--
The output is equivalent to the following JSON document (which is also a valid
Docker configuration file):
-->
输出等价于以下 JSON 文档（这也是一个有效的 Docker 配置文件）：

```json
{
  "auths": {
    "my-registry.example:5000": {
      "username": "tiger",
      "password": "pass1234",
      "email": "tiger@acme.example",
      "auth": "dGlnZXI6cGFzczEyMzQ="
    }
  }
}
```

{{< caution >}}
<!--
The `auth` value there is base64 encoded; it is obscured but not secret.
Anyone who can read that Secret can learn the registry access bearer token.

It is suggested to use [credential providers](/docs/tasks/administer-cluster/kubelet-credential-provider/) to dynamically and securely provide pull secrets on-demand.
-->
`auths` 值是 base64 编码的，其内容被屏蔽但未被加密。
任何能够读取该 Secret 的人都可以了解镜像库的访问令牌。

建议使用[凭据提供程序](/zh-cn/docs/tasks/administer-cluster/kubelet-credential-provider/)来动态、
安全地按需提供拉取 Secret。
{{< /caution >}}

<!--
### Basic authentication Secret

The `kubernetes.io/basic-auth` type is provided for storing credentials needed
for basic authentication. When using this Secret type, the `data` field of the
Secret must contain one of the following two keys:

- `username`: the user name for authentication
- `password`: the password or token for authentication
-->
### 基本身份认证 Secret  {#basic-authentication-secret}

`kubernetes.io/basic-auth` 类型用来存放用于基本身份认证所需的凭据信息。
使用这种 Secret 类型时，Secret 的 `data` 字段必须包含以下两个键之一：

- `username`: 用于身份认证的用户名；
- `password`: 用于身份认证的密码或令牌。

<!--
Both values for the above two keys are base64 encoded strings. You can
alternatively provide the clear text content using the `stringData` field in the
Secret manifest.

The following manifest is an example of a basic authentication Secret:
-->
以上两个键的键值都是 base64 编码的字符串。
当然你也可以在 Secret 清单中的使用 `stringData` 字段来提供明文形式的内容。

以下清单是基本身份验证 Secret 的示例：

{{% code language="yaml" file="secret/basicauth-secret.yaml" %}}

{{< note >}}
<!--
The `stringData` field for a Secret does not work well with server-side apply.
-->
Secret 的 `stringData` 字段不能很好地与服务器端应用配合使用。
{{< /note >}}

<!--
The basic authentication Secret type is provided only for convenience.
You can create an `Opaque` type for credentials used for basic authentication.
However, using the defined and public Secret type (`kubernetes.io/basic-auth`) helps other
people to understand the purpose of your Secret, and sets a convention for what key names
to expect.
-->
提供基本身份认证类型的 Secret 仅仅是出于方便性考虑。
你也可以使用 `Opaque` 类型来保存用于基本身份认证的凭据。
不过，使用预定义的、公开的 Secret 类型（`kubernetes.io/basic-auth`）
有助于帮助其他用户理解 Secret 的目的，并且对其中存在的主键形成一种约定。

<!--
### SSH authentication Secrets

The builtin type `kubernetes.io/ssh-auth` is provided for storing data used in
SSH authentication. When using this Secret type, you will have to specify a
`ssh-privatekey` key-value pair in the `data` (or `stringData`) field
as the SSH credential to use.

The following manifest is an example of a Secret used for SSH public/private
key authentication:
-->
### SSH 身份认证 Secret {#ssh-authentication-secrets}

Kubernetes 所提供的内置类型 `kubernetes.io/ssh-auth` 用来存放 SSH 身份认证中所需要的凭据。
使用这种 Secret 类型时，你就必须在其 `data` （或 `stringData`）
字段中提供一个 `ssh-privatekey` 键值对，作为要使用的 SSH 凭据。

下面的清单是一个 SSH 公钥/私钥身份认证的 Secret 示例：

{{% code language="yaml" file="secret/ssh-auth-secret.yaml" %}}

<!--
The SSH authentication Secret type is provided only for convenience.
You can create an `Opaque` type for credentials used for SSH authentication.
However, using the defined and public Secret type (`kubernetes.io/tls`) helps other
people to understand the purpose of your Secret, and sets a convention for what key names
to expect.
The Kubernetes API verifies that the required keys are set for a Secret of this type.
-->
提供 SSH 身份认证类型的 Secret 仅仅是出于方便性考虑。
你可以使用 `Opaque` 类型来保存用于 SSH 身份认证的凭据。
不过，使用预定义的、公开的 Secret 类型（`kubernetes.io/tls`）
有助于其他人理解你的 Secret 的用途，也可以就其中包含的主键名形成约定。
Kubernetes API 会验证这种类型的 Secret 中是否设定了所需的主键。

{{< caution >}}
<!--
SSH private keys do not establish trusted communication between an SSH client and
host server on their own. A secondary means of establishing trust is needed to
mitigate "man in the middle" attacks, such as a `known_hosts` file added to a ConfigMap.
-->
SSH 私钥自身无法建立 SSH 客户端与服务器端之间的可信连接。
需要其它方式来建立这种信任关系，以缓解“中间人（Man In The Middle）”
攻击，例如向 ConfigMap 中添加一个 `known_hosts` 文件。
{{< /caution >}}

<!--
### TLS Secrets

The `kubernetes.io/tls` Secret type is for storing
a certificate and its associated key that are typically used for TLS.

One common use for TLS Secrets is to configure encryption in transit for
an [Ingress](/docs/concepts/services-networking/ingress/), but you can also use it
with other resources or directly in your workload.
When using this type of Secret, the `tls.key` and the `tls.crt` key must be provided
in the `data` (or `stringData`) field of the Secret configuration, although the API
server doesn't actually validate the values for each key.

As an alternative to using `stringData`, you can use the `data` field to provide
the base64 encoded certificate and private key. For details, see
[Constraints on Secret names and data](#restriction-names-data).

The following YAML contains an example config for a TLS Secret:
-->
### TLS Secret

`kubernetes.io/tls` Secret 类型用来存放 TLS 场合通常要使用的证书及其相关密钥。

TLS Secret 的一种典型用法是为 [Ingress](/zh-cn/docs/concepts/services-networking/ingress/)
资源配置传输过程中的数据加密，不过也可以用于其他资源或者直接在负载中使用。
当使用此类型的 Secret 时，Secret 配置中的 `data` （或 `stringData`）字段必须包含
`tls.key` 和 `tls.crt` 主键，尽管 API 服务器实际上并不会对每个键的取值作进一步的合法性检查。

作为使用 `stringData` 的替代方法，你可以使用 `data` 字段来指定 base64 编码的证书和私钥。
有关详细信息，请参阅 [Secret 名称和数据的限制](#restriction-names-data)。

下面的 YAML 包含一个 TLS Secret 的配置示例：

{{% code language="yaml" file="secret/tls-auth-secret.yaml" %}}

<!--
The TLS Secret type is provided only for convenience.
You can create an `Opaque` type for credentials used for TLS authentication.
However, using the defined and public Secret type (`kubernetes.io/tls`)
helps ensure the consistency of Secret format in your project. The API server
verifies if the required keys are set for a Secret of this type.

To create a TLS Secret using `kubectl`, use the `tls` subcommand:
-->
提供 TLS 类型的 Secret 仅仅是出于方便性考虑。
你可以创建 `Opaque` 类型的 Secret 来保存用于 TLS 身份认证的凭据。
不过，使用已定义和公开的 Secret 类型（`kubernetes.io/tls`）有助于确保你自己项目中的 Secret 格式的一致性。
API 服务器会验证这种类型的 Secret 是否设定了所需的主键。

要使用 `kubectl` 创建 TLS Secret，你可以使用 `tls` 子命令：

```shell
kubectl create secret tls my-tls-secret \
  --cert=path/to/cert/file \
  --key=path/to/key/file
```

<!--
The public/private key pair must exist before hand. The public key certificate for `--cert` must be .PEM encoded
and must match the given private key for `--key`.
-->
公钥/私钥对必须事先存在，`--cert` 的公钥证书必须采用 .PEM 编码，
并且必须与 `--key` 的给定私钥匹配。

<!--
### Bootstrap token Secrets

The `bootstrap.kubernetes.io/token` Secret type is for
tokens used during the node bootstrap process. It stores tokens used to sign
well-known ConfigMaps.
-->
### 启动引导令牌 Secret  {#bootstrap-token-secrets}

`bootstrap.kubernetes.io/token` Secret 类型针对的是节点启动引导过程所用的令牌。
其中包含用来为周知的 ConfigMap 签名的令牌。

<!--
A bootstrap token Secret is usually created in the `kube-system` namespace and
named in the form `bootstrap-token-<token-id>` where `<token-id>` is a 6 character
string of the token ID.

As a Kubernetes manifest, a bootstrap token Secret might look like the
following:
-->
启动引导令牌 Secret 通常创建于 `kube-system` 名字空间内，并以
`bootstrap-token-<令牌 ID>` 的形式命名；
其中 `<令牌 ID>` 是一个由 6 个字符组成的字符串，用作令牌的标识。

以 Kubernetes 清单文件的形式，某启动引导令牌 Secret 可能看起来像下面这样：

{{% code language="yaml" file="secret/bootstrap-token-secret-base64.yaml" %}}

<!--
A bootstrap token Secret has the following keys specified under `data`:

- `token-id`: A random 6 character string as the token identifier. Required.
- `token-secret`: A random 16 character string as the actual token Secret. Required.
- `description`: A human-readable string that describes what the token is
  used for. Optional.
- `expiration`: An absolute UTC time using [RFC3339](https://datatracker.ietf.org/doc/html/rfc3339) specifying when the token
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
- `expiration`：一个使用 [RFC3339](https://datatracker.ietf.org/doc/html/rfc3339)
  来编码的 UTC 绝对时间，给出令牌要过期的时间。可选。
- `usage-bootstrap-<usage>`：布尔类型的标志，用来标明启动引导令牌的其他用途。
- `auth-extra-groups`：用逗号分隔的组名列表，身份认证时除被认证为
  `system:bootstrappers` 组之外，还会被添加到所列的用户组中。

<!--
You can alternatively provide the values in the `stringData` field of the Secret
without base64 encoding them:

{{% code language="yaml" file="secret/bootstrap-token-secret-literal.yaml" %}}

-->
你也可以在 Secret 的 `stringData` 字段中提供值，而无需对其进行 base64 编码：

{{% code language="yaml" file="secret/bootstrap-token-secret-literal.yaml" %}}

{{< note >}}
<!--
The `stringData` field for a Secret does not work well with server-side apply.
-->
Secret 的 `stringData` 字段不能很好地与服务器端应用配合使用。
{{< /note >}}

<!--
## Working with Secrets

### Creating a Secret

There are several options to create a Secret:

- [Use `kubectl`](/docs/tasks/configmap-secret/managing-secret-using-kubectl/)
- [Use a configuration file](/docs/tasks/configmap-secret/managing-secret-using-config-file/)
- [Use the Kustomize tool](/docs/tasks/configmap-secret/managing-secret-using-kustomize/)
-->
## 使用 Secret  {#working-with-secrets}

### 创建 Secret  {#creating-a-secret}

创建 Secret 有以下几种可选方式：

- [使用 `kubectl`](/zh-cn/docs/tasks/configmap-secret/managing-secret-using-kubectl/)
- [使用配置文件](/zh-cn/docs/tasks/configmap-secret/managing-secret-using-config-file/)
- [使用 Kustomize 工具](/zh-cn/docs/tasks/configmap-secret/managing-secret-using-kustomize/)

<!--
#### Constraints on Secret names and data {#restriction-names-data}

The name of a Secret object must be a valid
[DNS subdomain name](/docs/concepts/overview/working-with-objects/names#dns-subdomain-names).
-->
#### 对 Secret 名称与数据的约束 {#restriction-names-data}

Secret 对象的名称必须是合法的
[DNS 子域名](/zh-cn/docs/concepts/overview/working-with-objects/names#dns-subdomain-names)。

<!--
You can specify the `data` and/or the `stringData` field when creating a
configuration file for a Secret. The `data` and the `stringData` fields are optional.
The values for all keys in the `data` field have to be base64-encoded strings.
If the conversion to base64 string is not desirable, you can choose to specify
the `stringData` field instead, which accepts arbitrary strings as values.

The keys of `data` and `stringData` must consist of alphanumeric characters,
`-`, `_` or `.`. All key-value pairs in the `stringData` field are internally
merged into the `data` field. If a key appears in both the `data` and the
`stringData` field, the value specified in the `stringData` field takes
precedence.
-->
在为创建 Secret 编写配置文件时，你可以设置 `data` 与/或 `stringData` 字段。
`data` 和 `stringData` 字段都是可选的。`data` 字段中所有键值都必须是 base64
编码的字符串。如果不希望执行这种 base64 字符串的转换操作，你可以选择设置
`stringData` 字段，其中可以使用任何字符串作为其取值。

`data` 和 `stringData` 中的键名只能包含字母、数字、`-`、`_` 或 `.` 字符。
`stringData` 字段中的所有键值对都会在内部被合并到 `data` 字段中。
如果某个主键同时出现在 `data` 和 `stringData` 字段中，`stringData`
所指定的键值具有高优先级。

<!--
#### Size limit {#restriction-data-size}

Individual Secrets are limited to 1MiB in size. This is to discourage creation
of very large Secrets that could exhaust the API server and kubelet memory.
However, creation of many smaller Secrets could also exhaust memory. You can
use a [resource quota](/docs/concepts/policy/resource-quotas/) to limit the
number of Secrets (or other resources) in a namespace.
-->
#### 尺寸限制   {#restriction-data-size}

每个 Secret 的尺寸最多为 1MiB。施加这一限制是为了避免用户创建非常大的 Secret，
进而导致 API 服务器和 kubelet 内存耗尽。不过创建很多小的 Secret 也可能耗尽内存。
你可以使用[资源配额](/zh-cn/docs/concepts/policy/resource-quotas/)来约束每个名字空间中
Secret（或其他资源）的个数。

<!--
### Editing a Secret

You can edit an existing Secret unless it is [immutable](#secret-immutable). To
edit a Secret, use one of the following methods:
-->
### 编辑 Secret    {#editing-a-secret}

你可以编辑一个已有的 Secret，除非它是[不可变更的](#secret-immutable)。
要编辑一个 Secret，可使用以下方法之一：

<!--
- [Use `kubectl`](/docs/tasks/configmap-secret/managing-secret-using-kubectl/#edit-secret)
- [Use a configuration file](/docs/tasks/configmap-secret/managing-secret-using-config-file/#edit-secret)
-->
- [使用 `kubectl`](/zh-cn/docs/tasks/configmap-secret/managing-secret-using-kubectl/#edit-secret)
- [使用配置文件](/zh-cn/docs/tasks/configmap-secret/managing-secret-using-config-file/#edit-secret)

<!--
You can also edit the data in a Secret using the [Kustomize tool](/docs/tasks/configmap-secret/managing-secret-using-kustomize/#edit-secret). However, this
method creates a new `Secret` object with the edited data.

Depending on how you created the Secret, as well as how the Secret is used in
your Pods, updates to existing `Secret` objects are propagated automatically to
Pods that use the data. For more information, refer to [Using Secrets as files from a Pod](#using-secrets-as-files-from-a-pod) section.
-->
你也可以使用
[Kustomize 工具](/zh-cn/docs/tasks/configmap-secret/managing-secret-using-kustomize/#edit-secret)编辑数据。
然而这种方法会用编辑过的数据创建新的 `Secret` 对象。

根据你创建 Secret 的方式以及该 Secret 在 Pod 中被使用的方式，对已有 `Secret`
对象的更新将自动扩散到使用此数据的 Pod。有关更多信息，
请参阅[在 Pod 以文件形式使用 Secret](#using-secrets-as-files-from-a-pod)。

<!--
### Using a Secret

Secrets can be mounted as data volumes or exposed as
{{< glossary_tooltip text="environment variables" term_id="container-env-variables" >}}
to be used by a container in a Pod. Secrets can also be used by other parts of the
system, without being directly exposed to the Pod. For example, Secrets can hold
credentials that other parts of the system should use to interact with external
systems on your behalf.
-->
### 使用 Secret    {#using-a-secret}

Secret 可以以数据卷的形式挂载，也可以作为{{< glossary_tooltip text="环境变量" term_id="container-env-variables" >}}
暴露给 Pod 中的容器使用。Secret 也可用于系统中的其他部分，而不是一定要直接暴露给 Pod。
例如，Secret 也可以包含系统中其他部分在替你与外部系统交互时要使用的凭证数据。

<!--
Secret volume sources are validated to ensure that the specified object
reference actually points to an object of type Secret. Therefore, a Secret
needs to be created before any Pods that depend on it.

If the Secret cannot be fetched (perhaps because it does not exist, or
due to a temporary lack of connection to the API server) the kubelet
periodically retries running that Pod. The kubelet also reports an Event
for that Pod, including details of the problem fetching the Secret.
-->
Kubernetes 会检查 Secret 的卷数据源，确保所指定的对象引用确实指向类型为 Secret
的对象。因此，如果 Pod 依赖于某 Secret，该 Secret 必须先于 Pod 被创建。

如果 Secret 内容无法取回（可能因为 Secret 尚不存在或者临时性地出现 API
服务器网络连接问题），kubelet 会周期性地重试 Pod 运行操作。kubelet 也会为该 Pod
报告 Event 事件，给出读取 Secret 时遇到的问题细节。

<!--
#### Optional Secrets {#restriction-secret-must-exist}
-->
#### 可选的 Secret   {#restriction-secret-must-exist}

<!--
When you reference a Secret in a Pod, you can mark the Secret as _optional_,
such as in the following example. If an optional Secret doesn't exist,
Kubernetes ignores it.
-->
当你在 Pod 中引用 Secret 时，你可以将该 Secret 标记为**可选**，就像下面例子中所展示的那样。
如果可选的 Secret 不存在，Kubernetes 将忽略它。

{{% code language="yaml" file="secret/optional-secret.yaml" %}}

<!--
By default, Secrets are required. None of a Pod's containers will start until
all non-optional Secrets are available.
-->
默认情况下，Secret 是必需的。在所有非可选的 Secret 都可用之前，Pod 的所有容器都不会启动。

<!--
If a Pod references a specific key in a non-optional Secret and that Secret
does exist, but is missing the named key, the Pod fails during startup.
-->
如果 Pod 引用了非可选 Secret 中的特定键，并且该 Secret 确实存在，但缺少所指定的键，
则 Pod 在启动期间会失败。

<!--
### Using Secrets as files from a Pod {#using-secrets-as-files-from-a-pod}

If you want to access data from a Secret in a Pod, one way to do that is to
have Kubernetes make the value of that Secret be available as a file inside
the filesystem of one or more of the Pod's containers.
-->
### 在 Pod 以文件形式使用 Secret   {#using-secrets-as-files-from-a-pod}

如果你要在 Pod 中访问来自 Secret 的数据，一种方式是让 Kubernetes 将该 Secret 的值以
文件的形式呈现，该文件存在于 Pod 中一个或多个容器内的文件系统内。

<!--
For instructions, refer to
[Create a Pod that has access to the secret data through a Volume](/docs/tasks/inject-data-application/distribute-credentials-secure/#create-a-pod-that-has-access-to-the-secret-data-through-a-volume).
-->
相关的指示说明，
可以参阅[创建一个可以通过卷访问 Secret 数据的 Pod](/zh-cn/docs/tasks/inject-data-application/distribute-credentials-secure/#create-a-pod-that-has-access-to-the-secret-data-through-a-volume)。

<!--
When a volume contains data from a Secret, and that Secret is updated, Kubernetes tracks
this and updates the data in the volume, using an eventually-consistent approach.
-->
当卷中包含来自 Secret 的数据，而对应的 Secret 被更新，Kubernetes
会跟踪到这一操作并更新卷中的数据。更新的方式是保证最终一致性。

{{< note >}}
<!--
A container using a Secret as a
[subPath](/docs/concepts/storage/volumes#using-subpath) volume mount does not receive
automated Secret updates.
-->
对于以 [subPath](/zh-cn/docs/concepts/storage/volumes#using-subpath) 形式挂载 Secret 卷的容器而言，
它们无法收到自动的 Secret 更新。
{{< /note >}}

<!--
The kubelet keeps a cache of the current keys and values for the Secrets that are used in
volumes for pods on that node.
You can configure the way that the kubelet detects changes from the cached values. The
`configMapAndSecretChangeDetectionStrategy` field in the
[kubelet configuration](/docs/reference/config-api/kubelet-config.v1beta1/) controls
which strategy the kubelet uses. The default strategy is `Watch`.
-->
Kubelet 组件会维护一个缓存，在其中保存节点上 Pod 卷中使用的 Secret 的当前主键和取值。
你可以配置 kubelet 如何检测所缓存数值的变化。
[kubelet 配置](/zh-cn/docs/reference/config-api/kubelet-config.v1beta1/)中的
`configMapAndSecretChangeDetectionStrategy` 字段控制 kubelet 所采用的策略。
默认的策略是 `Watch`。

<!--
Updates to Secrets can be either propagated by an API watch mechanism (the default), based on
a cache with a defined time-to-live, or polled from the cluster API server on each kubelet
synchronisation loop.
-->
对 Secret 的更新操作既可以通过 API 的 watch 机制（默认）来传播，
基于设置了生命期的缓存获取，也可以通过 kubelet 的同步回路来从集群的 API
服务器上轮询获取。

<!--
As a result, the total delay from the moment when the Secret is updated to the moment
when new keys are projected to the Pod can be as long as the kubelet sync period + cache
propagation delay, where the cache propagation delay depends on the chosen cache type
(following the same order listed in the previous paragraph, these are:
watch propagation delay, the configured cache TTL, or zero for direct polling).
-->
因此，从 Secret 被更新到新的主键被投射到 Pod 中，中间存在一个延迟。
这一延迟的上限是 kubelet 的同步周期加上缓存的传播延迟，
其中缓存的传播延迟取决于所选择的缓存类型。
对应上一段中提到的几种传播机制，延迟时长为 watch 的传播延迟、所配置的缓存 TTL
或者对于直接轮询而言是零。

<!--
### Using Secrets as environment variables

To use a Secret in an {{< glossary_tooltip text="environment variable" term_id="container-env-variables" >}}
in a Pod:
-->
### 以环境变量的方式使用 Secret   {#using-secrets-as-environment-variables}

如果需要在 Pod
中以{{< glossary_tooltip text="环境变量" term_id="container-env-variables" >}}的形式使用 Secret：

<!--
1. For each container in your Pod specification, add an environment variable
   for each Secret key that you want to use to the
   `env[].valueFrom.secretKeyRef` field.
1. Modify your image and/or command line so that the program looks for values
   in the specified environment variables.
-->
1. 对于 Pod 规约中的每个容器，针对你要使用的每个 Secret 键，将对应的环境变量添加到
   `env[].valueFrom.secretKeyRef` 中。
1. 更改你的镜像或命令行，以便程序能够从指定的环境变量找到所需要的值。

<!--
For instructions, refer to
[Define container environment variables using Secret data](/docs/tasks/inject-data-application/distribute-credentials-secure/#define-container-environment-variables-using-secret-data).
-->
相关的指示说明，
可以参阅[使用 Secret 数据定义容器变量](/zh-cn/docs/tasks/inject-data-application/distribute-credentials-secure/#define-container-environment-variables-using-secret-data)。

<!--
It's important to note that the range of characters allowed for environment variable
names in pods is [restricted](/docs/tasks/inject-data-application/define-environment-variable-container/#using-environment-variables-inside-of-your-config).
If any keys do not meet the rules, those keys are not made available to your container, though
the Pod is allowed to start.
-->
需要注意的是，Pod 中环境变量名称允许的字符范围是[有限的](/zh-cn/docs/tasks/inject-data-application/define-environment-variable-container/#using-environment-variables-inside-of-your-config)。
如果某些变量名称不满足这些规则，则即使 Pod 是可以启动的，你的容器也无法访问这些变量。

<!--
### Container image pull Secrets {#using-imagepullsecrets}

If you want to fetch container images from a private repository, you need a way for
the kubelet on each node to authenticate to that repository. You can configure
_image pull Secrets_ to make this possible. These secrets are configured at the Pod
level.
-->
### 容器镜像拉取 Secret  {#using-imagepullsecrets}

如果你尝试从私有仓库拉取容器镜像，你需要一种方式让每个节点上的 kubelet
能够完成与镜像库的身份认证。你可以配置**镜像拉取 Secret** 来实现这点。
Secret 是在 Pod 层面来配置的。

<!--
#### Using imagePullSecrets

The `imagePullSecrets` field is a list of references to Secrets in the same namespace.
You can use an `imagePullSecrets` to pass a Secret that contains a Docker (or other) image registry
password to the kubelet. The kubelet uses this information to pull a private image on behalf of your Pod.
See the [PodSpec API](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#podspec-v1-core)
for more information about the `imagePullSecrets` field.
-->
#### 使用 imagePullSecrets {#using-imagepullsecrets-1}

`imagePullSecrets` 字段是一个列表，包含对同一名字空间中 Secret 的引用。
你可以使用 `imagePullSecrets` 将包含 Docker（或其他）镜像仓库密码的 Secret
传递给 kubelet。kubelet 使用此信息来替 Pod 拉取私有镜像。
参阅 [PodSpec API](/zh-cn/docs/reference/kubernetes-api/workload-resources/pod-v1/#PodSpec)
进一步了解 `imagePullSecrets` 字段。

<!--
##### Manually specifying an imagePullSecret

You can learn how to specify `imagePullSecrets` from the
[container images](/docs/concepts/containers/images/#specifying-imagepullsecrets-on-a-pod)
documentation.
-->
##### 手动设定 imagePullSecret {#manually-specifying-an-imagepullsecret}

你可以通过阅读[容器镜像](/zh-cn/docs/concepts/containers/images/#specifying-imagepullsecrets-on-a-pod)
文档了解如何设置 `imagePullSecrets`。

<!--
##### Arranging for imagePullSecrets to be automatically attached

You can manually create `imagePullSecrets`, and reference these from a ServiceAccount. Any Pods
created with that ServiceAccount or created with that ServiceAccount by default, will get their
`imagePullSecrets` field set to that of the service account.
See [Add ImagePullSecrets to a service account](/docs/tasks/configure-pod-container/configure-service-account/#add-imagepullsecrets-to-a-service-account)
for a detailed explanation of that process.
-->
##### 设置 imagePullSecrets 为自动挂载 {#arranging-for-imagepullsecrets-to-be-automatically-attached}

你可以手动创建 `imagePullSecret`，并在一个 ServiceAccount 中引用它。
对使用该 ServiceAccount 创建的所有 Pod，或者默认使用该 ServiceAccount 创建的 Pod
而言，其 `imagePullSecrets` 字段都会设置为该服务账号。
请阅读[向服务账号添加 ImagePullSecrets](/zh-cn/docs/tasks/configure-pod-container/configure-service-account/#add-imagepullsecrets-to-a-service-account)
来详细了解这一过程。

<!--
### Using Secrets with static Pods {#restriction-static-pod}

You cannot use ConfigMaps or Secrets with {{< glossary_tooltip text="static Pods" term_id="static-pod" >}}.
-->
### 在静态 Pod 中使用 Secret    {#restriction-static-pod}

你不可以在{{< glossary_tooltip text="静态 Pod" term_id="static-pod" >}}
中使用 ConfigMap 或 Secret。

<!--
## Use cases

### Use case: As container environment variables {#use-case-as-container-environment-variables}

You can create a Secret and use it to
[set environment variables for a container](/docs/tasks/inject-data-application/distribute-credentials-secure/#define-container-environment-variables-using-secret-data).
-->
## 使用场景  {#use-case}

### 使用场景：作为容器环境变量 {#use-case-as-container-environment-variables}

你可以创建 Secret
并使用它[为容器设置环境变量](/zh-cn/docs/tasks/inject-data-application/distribute-credentials-secure/#define-container-environment-variables-using-secret-data)。

<!--
### Use case: Pod with SSH keys

Create a Secret containing some SSH keys:
-->
### 使用场景：带 SSH 密钥的 Pod {#use-case-pod-with-ssh-keys}

创建包含一些 SSH 密钥的 Secret：

```shell
kubectl create secret generic ssh-key-secret --from-file=ssh-privatekey=/path/to/.ssh/id_rsa --from-file=ssh-publickey=/path/to/.ssh/id_rsa.pub
```

<!--
The output is similar to:
-->
输出类似于：

```
secret "ssh-key-secret" created
```

<!--
You can also create a `kustomization.yaml` with a `secretGenerator` field containing ssh keys.
-->
你也可以创建一个 `kustomization.yaml` 文件，在其 `secretGenerator`
字段中包含 SSH 密钥。

{{< caution >}}
<!--
Think carefully before sending your own SSH keys: other users of the cluster may have access
to the Secret.
-->
在提供你自己的 SSH 密钥之前要仔细思考：集群的其他用户可能有权访问该 Secret。

<!--
You could instead create an SSH private key representing a service identity that you want to be
accessible to all the users with whom you share the Kubernetes cluster, and that you can revoke
if the credentials are compromised.
-->
你也可以创建一个 SSH 私钥，代表一个你希望与你共享 Kubernetes 集群的其他用户分享的服务标识。
当凭据信息被泄露时，你可以收回该访问权限。
{{< /caution >}}

<!--
Now you can create a Pod which references the secret with the SSH key and
consumes it in a volume:
-->
现在你可以创建一个 Pod，在其中访问包含 SSH 密钥的 Secret，并通过卷的方式来使用它：

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
容器命令执行时，秘钥的数据可以在下面的位置访问到：

```
/etc/secret-volume/ssh-publickey
/etc/secret-volume/ssh-privatekey
```

<!--
The container is then free to use the secret data to establish an SSH connection.
-->
容器就可以随便使用 Secret 数据来建立 SSH 连接。

<!--
### Use case: Pods with prod / test credentials

This example illustrates a Pod which consumes a secret containing production credentials and
another Pod which consumes a secret with test environment credentials.

You can create a `kustomization.yaml` with a `secretGenerator` field or run
`kubectl create secret`.
-->
### 使用场景：带有生产、测试环境凭据的 Pod {#use-case-pods-with-prod-test-credentials}

这一示例所展示的一个 Pod 会使用包含生产环境凭据的 Secret，另一个 Pod
使用包含测试环境凭据的 Secret。

你可以创建一个带有 `secretGenerator` 字段的 `kustomization.yaml` 文件或者运行
`kubectl create secret` 来创建 Secret。

```shell
kubectl create secret generic prod-db-secret --from-literal=username=produser --from-literal=password=Y4nys7f11
```

<!--
The output is similar to:
-->
输出类似于：

```
secret "prod-db-secret" created
```

<!--
You can also create a secret for test environment credentials.
-->
你也可以创建一个包含测试环境凭据的 Secret：

```shell
kubectl create secret generic test-db-secret --from-literal=username=testuser --from-literal=password=iluvtests
```

<!--
The output is similar to:
-->
输出类似于：

```
secret "test-db-secret" created
```

{{< note >}}
<!--
Special characters such as `$`, `\`, `*`, `=`, and `!` will be interpreted by your
[shell](https://en.wikipedia.org/wiki/Shell_(computing)) and require escaping.
-->
特殊字符（例如 `$`、`\`、`*`、`=` 和 `!`）会被你的
[Shell](https://zh.wikipedia.org/wiki/%E6%AE%BC%E5%B1%A4) 解释，因此需要转义。

<!--
In most shells, the easiest way to escape the password is to surround it with single quotes (`'`).
For example, if your actual password is `S!B\*d$zDsb=`, you should execute the command this way:
-->
在大多数 Shell 中，对密码进行转义的最简单方式是用单引号（`'`）将其括起来。
例如，如果你的实际密码是 `S!B\*d$zDsb`，则应通过以下方式执行命令：

```shell
kubectl create secret generic dev-db-secret --from-literal=username=devuser --from-literal=password='S!B\*d$zDsb='
```

<!--
You do not need to escape special characters in passwords from files (`--from-file`).
-->
你无需对文件中的密码（`--from-file`）中的特殊字符进行转义。
{{< /note >}}

<!--
Now make the Pods:
-->
现在生成 Pod：

```shell
cat <<EOF > pod.yaml
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
Add the pods to the same `kustomization.yaml`:
-->
将 Pod 添加到同一 `kustomization.yaml` 文件中：

```shell
cat <<EOF >> kustomization.yaml
resources:
- pod.yaml
EOF
```

<!--
Apply all those objects on the API server by running:
-->
通过下面的命令在 API 服务器上应用所有这些对象：

```shell
kubectl apply -k .
```

<!--
Both containers will have the following files present on their filesystems with the values
for each container's environment:
-->
两个文件都会在其文件系统中出现下面的文件，文件中内容是各个容器的环境值：

```
/etc/secret-volume/username
/etc/secret-volume/password
```

<!--
Note how the specs for the two Pods differ only in one field; this facilitates
creating Pods with different capabilities from a common Pod template.
-->
注意这两个 Pod 的规约中只有一个字段不同。
这便于基于相同的 Pod 模板生成具有不同能力的 Pod。

<!--
You could further simplify the base Pod specification by using two service accounts:

1. `prod-user` with the `prod-db-secret`
1. `test-user` with the `test-db-secret`

The Pod specification is shortened to:
-->
你可以通过使用两个服务账号来进一步简化这一基本的 Pod 规约：

1. `prod-user` 服务账号使用 `prod-db-secret`
1. `test-user` 服务账号使用 `test-db-secret`

Pod 规约简化为：

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
## Immutable Secrets {#secret-immutable}
-->
## 不可更改的 Secret {#secret-immutable}

{{< feature-state for_k8s_version="v1.21" state="stable" >}}

<!--
Kubernetes lets you mark specific Secrets (and ConfigMaps) as _immutable_.
Preventing changes to the data of an existing Secret has the following benefits:

- protects you from accidental (or unwanted) updates that could cause applications outages
- (for clusters that extensively use Secrets - at least tens of thousands of unique Secret
  to Pod mounts), switching to immutable Secrets improves the performance of your cluster
  by significantly reducing load on kube-apiserver. The kubelet does not need to maintain
  a [watch] on any Secrets that are marked as immutable.
-->
Kubernetes 允许你将特定的 Secret（和 ConfigMap）标记为 **不可更改（Immutable）**。
禁止更改现有 Secret 的数据有下列好处：

- 防止意外（或非预期的）更新导致应用程序中断
- （对于大量使用 Secret 的集群而言，至少数万个不同的 Secret 供 Pod 挂载），
  通过将 Secret 标记为不可变，可以极大降低 kube-apiserver 的负载，提升集群性能。
  kubelet 不需要监视那些被标记为不可更改的 Secret。

<!--
### Marking a Secret as immutable {#secret-immutable-create}

You can create an immutable Secret by setting the `immutable` field to `true`. For example,
-->
### 将 Secret 标记为不可更改   {#secret-immutable-create}

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

<!--
You can also update any existing mutable Secret to make it immutable.
-->
你也可以更改现有的 Secret，令其不可更改。

{{< note >}}
<!--
Once a Secret or ConfigMap is marked as immutable, it is _not_ possible to revert this change
nor to mutate the contents of the `data` field. You can only delete and recreate the Secret.
Existing Pods maintain a mount point to the deleted Secret - it is recommended to recreate
these pods.
-->
一旦一个 Secret 或 ConfigMap 被标记为不可更改，撤销此操作或者更改 `data`
字段的内容都是**不**可能的。
只能删除并重新创建这个 Secret。现有的 Pod 将维持对已删除 Secret 的挂载点 --
建议重新创建这些 Pod。
{{< /note >}}

<!--
## Information security for Secrets

Although ConfigMap and Secret work similarly, Kubernetes applies some additional
protection for Secret objects.
-->
## Secret 的信息安全问题 {#information-security-for-secrets}

尽管 ConfigMap 和 Secret 的工作方式类似，但 Kubernetes 对 Secret 有一些额外的保护。

<!--
Secrets often hold values that span a spectrum of importance, many of which can
cause escalations within Kubernetes (e.g. service account tokens) and to
external systems. Even if an individual app can reason about the power of the
Secrets it expects to interact with, other apps within the same namespace can
render those assumptions invalid.
-->
Secret 通常保存重要性各异的数值，其中很多都可能会导致 Kubernetes 中
（例如，服务账号令牌）或对外部系统的特权提升。
即使某些个别应用能够推导它期望使用的 Secret 的能力，
同一名字空间中的其他应用可能会让这种假定不成立。

<!--
A Secret is only sent to a node if a Pod on that node requires it.
For mounting Secrets into Pods, the kubelet stores a copy of the data into a `tmpfs`
so that the confidential data is not written to durable storage.
Once the Pod that depends on the Secret is deleted, the kubelet deletes its local copy
of the confidential data from the Secret.
-->
只有当某个节点上的 Pod 需要某 Secret 时，对应的 Secret 才会被发送到该节点上。
如果将 Secret 挂载到 Pod 中，kubelet 会将数据的副本保存在在 `tmpfs` 中，
这样机密的数据不会被写入到持久性存储中。
一旦依赖于该 Secret 的 Pod 被删除，kubelet 会删除来自于该 Secret 的机密数据的本地副本。

<!--
There may be several containers in a Pod. By default, containers you define
only have access to the default ServiceAccount and its related Secret.
You must explicitly define environment variables or map a volume into a
container in order to provide access to any other Secret.
-->
同一个 Pod 中可能包含多个容器。默认情况下，你所定义的容器只能访问默认 ServiceAccount
及其相关 Secret。你必须显式地定义环境变量或者将卷映射到容器中，才能为容器提供对其他
Secret 的访问。

<!--
There may be Secrets for several Pods on the same node. However, only the
Secrets that a Pod requests are potentially visible within its containers.
Therefore, one Pod does not have access to the Secrets of another Pod.
-->
针对同一节点上的多个 Pod 可能有多个 Secret。不过，只有某个 Pod 所请求的 Secret
才有可能对 Pod 中的容器可见。因此，一个 Pod 不会获得访问其他 Pod 的 Secret 的权限。

<!--
### Configure least-privilege access to Secrets

To enhance the security measures around Secrets, Kubernetes provides a mechanism: you can
annotate a ServiceAccount as `kubernetes.io/enforce-mountable-secrets: "true"`.

For more information, you can refer to the [documentation about this annotation](/docs/concepts/security/service-accounts/#enforce-mountable-secrets).
-->
### 配置 Secret 资源的最小特权访问

为了加强对 Secret 的安全措施，Kubernetes 提供了一种机制：
你可以为 ServiceAccount 添加 `kubernetes.io/enforce-mountable-secrets: "true"` 注解。

想了解更多信息，你可以参考[此注解的文档](/zh-cn/docs/concepts/security/service-accounts/#enforce-mountable-secrets)。

{{< warning >}}
<!--
Any containers that run with `privileged: true` on a node can access all
Secrets used on that node.
-->
在一个节点上以 `privileged: true` 运行的所有容器可以访问该节点上使用的所有 Secret。
{{< /warning >}}

## {{% heading "whatsnext" %}}

<!--
- For guidelines to manage and improve the security of your Secrets, refer to
  [Good practices for Kubernetes Secrets](/docs/concepts/security/secrets-good-practices).
- Learn how to [manage Secrets using `kubectl`](/docs/tasks/configmap-secret/managing-secret-using-kubectl/)
- Learn how to [manage Secrets using config file](/docs/tasks/configmap-secret/managing-secret-using-config-file/)
- Learn how to [manage Secrets using kustomize](/docs/tasks/configmap-secret/managing-secret-using-kustomize/)
- Read the [API reference](/docs/reference/kubernetes-api/config-and-storage-resources/secret-v1/) for `Secret`
-->
- 有关管理和提升 Secret 安全性的指南，请参阅 [Kubernetes Secret 良好实践](/zh-cn/docs/concepts/security/secrets-good-practices)
- 学习如何[使用 `kubectl` 管理 Secret](/zh-cn/docs/tasks/configmap-secret/managing-secret-using-kubectl/)
- 学习如何[使用配置文件管理 Secret](/zh-cn/docs/tasks/configmap-secret/managing-secret-using-config-file/)
- 学习如何[使用 kustomize 管理 Secret](/zh-cn/docs/tasks/configmap-secret/managing-secret-using-kustomize/)
- 阅读 [API 参考](/zh-cn/docs/reference/kubernetes-api/config-and-storage-resources/secret-v1/)了解 `Secret`

