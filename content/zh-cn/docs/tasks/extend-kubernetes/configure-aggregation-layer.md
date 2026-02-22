---
title: 配置聚合层
content_type: task
weight: 10
---
<!--
title: Configure the Aggregation Layer
reviewers:
- lavalamp
- cheftako
- chenopis
content_type: task
weight: 10
-->

<!-- overview -->

<!--
Configuring the [aggregation layer](/docs/concepts/extend-kubernetes/api-extension/apiserver-aggregation/)
allows the Kubernetes apiserver to be extended with additional APIs, which are not
part of the core Kubernetes APIs.
-->
配置[聚合层](/zh-cn/docs/concepts/extend-kubernetes/api-extension/apiserver-aggregation/)可以允许
Kubernetes apiserver 使用其它 API 扩展，这些 API 不是核心 Kubernetes API 的一部分。

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

{{< note >}}
<!--
There are a few setup requirements for getting the aggregation layer working in
your environment to support mutual TLS auth between the proxy and extension apiservers.
Kubernetes and the kube-apiserver have multiple CAs, so make sure that the proxy is
signed by the aggregation layer CA and not by something else, like the Kubernetes general CA.
-->
要使聚合层在你的环境中正常工作以支持代理服务器和扩展 apiserver 之间的相互 TLS 身份验证，
需要满足一些设置要求。Kubernetes 和 kube-apiserver 具有多个 CA，
因此请确保代理是由聚合层 CA 签名的，而不是由 Kubernetes 通用 CA 签名的。
{{< /note >}}

{{< caution >}}
<!--
Reusing the same CA for different client types can negatively impact the cluster's
ability to function. For more information, see [CA Reusage and Conflicts](#ca-reusage-and-conflicts).
-->
对不同的客户端类型重复使用相同的 CA 会对集群的功能产生负面影响。
有关更多信息，请参见 [CA 重用和冲突](#ca-reusage-and-conflicts)。
{{< /caution >}}

<!-- steps -->

<!--
## Authentication Flow

Unlike Custom Resource Definitions (CRDs), the Aggregation API involves
another server - your Extension apiserver - in addition to the standard Kubernetes apiserver.
The Kubernetes apiserver will need to communicate with your extension apiserver,
and your extension apiserver will need to communicate with the Kubernetes apiserver.
In order for this communication to be secured, the Kubernetes apiserver uses x509
certificates to authenticate itself to the extension apiserver.

This section describes how the authentication and authorization flows work,
and how to configure them.
-->
## 身份认证流程   {#authentication-flow}

与自定义资源定义（CRD）不同，除标准的 Kubernetes apiserver 外，Aggregation API
还涉及另一个服务器：扩展 apiserver。
Kubernetes apiserver 将需要与你的扩展 apiserver 通信，并且你的扩展 apiserver
也需要与 Kubernetes apiserver 通信。
为了确保此通信的安全，Kubernetes apiserver 使用 x509 证书向扩展 apiserver 认证。

本节介绍身份认证和鉴权流程的工作方式以及如何配置它们。

<!--
The high-level flow is as follows:

1. Kubernetes apiserver: authenticate the requesting user and authorize their
   rights to the requested API path.
2. Kubernetes apiserver: proxy the request to the extension apiserver
3. Extension apiserver: authenticate the request from the Kubernetes apiserver
4. Extension apiserver: authorize the request from the original user
5. Extension apiserver: execute
-->
大致流程如下：

1. Kubernetes apiserver：对发出请求的用户身份认证，并对请求的 API 路径执行鉴权。
2. Kubernetes apiserver：将请求转发到扩展 apiserver
3. 扩展 apiserver：认证来自 Kubernetes apiserver 的请求
4. 扩展 apiserver：对来自原始用户的请求鉴权
5. 扩展 apiserver：执行

<!--
The rest of this section describes these steps in detail.

The flow can be seen in the following diagram.

![aggregation auth flows](/images/docs/aggregation-api-auth-flow.png)

The source for the above swimlanes can be found in the source of this document.
-->
本节的其余部分详细描述了这些步骤。

该流程可以在下图中看到。

![聚合层认证流程](/images/docs/aggregation-api-auth-flow.png)

以上泳道的来源可以在本文档的源码中找到。

<!--
Swimlanes generated at https://swimlanes.io with the source as follows:

-----BEGIN-----
title: Welcome to swimlanes.io


User -> kube-apiserver / aggregator:

note:
1. The user makes a request to the Kube API server using any recognized credential (e.g. OIDC or client certs)

kube-apiserver / aggregator -> kube-apiserver / aggregator: authentication

note:
2. The Kube API server authenticates the incoming request using any configured
   authentication methods (e.g. OIDC or client certs)

kube-apiserver / aggregator -> kube-apiserver / aggregator: authorization

note:
3. The Kube API server authorizes the requested URL using any configured authorization method (e.g. RBAC)

kube-apiserver / aggregator -> aggregated apiserver:

note:
4. The aggregator opens a connection to the aggregated API server using
   `--proxy-client-cert-file`/`--proxy-client-key-file` client certificate/key to secure the channel
5. The aggregator sends the user info from step 1 to the aggregated API server as
   http headers, as defined by the following flags:
  * `--requestheader-username-headers`
  * `--requestheader-group-headers`
  * `--requestheader-extra-headers-prefix`

aggregated apiserver -> aggregated apiserver: authentication

note:
6. The aggregated apiserver authenticates the incoming request using the auth proxy authentication method:
  * verifies the request has a recognized auth proxy client certificate
  * pulls user info from the incoming request's http headers

By default, it pulls the configuration information for this from a configmap
in the kube-system namespace that is published by the kube-apiserver,
containing the info from the `--requestheader-...` flags provided to the
kube-apiserver (CA bundle to use, auth proxy client certificate names to allow,
http header names to use, etc)

aggregated apiserver -> kube-apiserver / aggregator: authorization

note:
7. The aggregated apiserver authorizes the incoming request by making a
   SubjectAccessReview call to the kube-apiserver

aggregated apiserver -> aggregated apiserver: admission

note:
8. For mutating requests, the aggregated apiserver runs admission checks.
   by default, the namespace lifecycle admission plugin ensures namespaced
   resources are created in a namespace that exists in the kube-apiserver
-----END-----
-->

<!--
在 https://swimlanes.io 生成的泳道，其源码如下：

-----BEGIN-----
title: 认证流程

User -> kube-apiserver / aggregator:

note:
1.用户使用任何公认的凭证（例如 OIDC 或客户端证书）向 Kube Apiserver 发出请求

kube-apiserver / aggregator -> kube-apiserver / aggregator: 认证

note:
2.Kube Apiserver 使用任何配置的身份验证方法（例如 OIDC 或客户端证书）对传入请求认证

kube-apiserver / aggregator -> kube-apiserver / aggregator: 鉴权

note:
3.Kube Apiserver 使用任何配置的鉴权方法（例如 RBAC）对请求的 URL 鉴权

kube-apiserver / aggregator -> 聚合的 apiserver:

note:
4.aggregator 使用 `--proxy-client-cert-file`，`--proxy-client-key-file`
  客户端证书/密钥打开与聚合 Apiserver 的连接以保护通道

5.aggregator 将步骤 1 中的用户信息作为 http 标头发送到聚合的 Apiserver，
  如以下标志所定义：

  * `--requestheader-username-headers`
  * `--requestheader-group-headers`
  * `--requestheader-extra-headers-prefix`

kube-apiserver / aggregator -> 聚合的 apiserver: 认证

note:
6.聚合的 apiserver 使用代理身份验证方法对传入的请求认证：

  * 验证请求是否具有公认的身份验证代理客户端证书
  * 从传入请求的 HTTP 标头中提取用户信息

默认情况下，它从 kube-apiserver 发布的 kube-system 命名空间中的 configmap
中获取配置信息，其中包含提供给 kube-apiserver 的`--requestheader-...`
标志中的信息（要使用的 CA 包，要允许的身份验证代理客户端证书名称，
要使用的 HTTP 标头名称等）

kube-apiserver / aggregator -> 聚合的 apiserver: 鉴权

note:
7.聚合的 apiserver 通过 SubjectAccessReview 请求 kube-apiserver 鉴权

kube-apiserver / aggregator -> 聚合的 apiserver: 准入

note:
8.对于可变请求，聚合的 apiserver 运行准入检查。
  默认情况下，namespace 生命周期准入插件可确保在 kube-apiserver
  中存在的 namespace 中创建指定 namespace 下的资源
-----END-----

-->

<!--
### Kubernetes Apiserver Authentication and Authorization

A request to an API path that is served by an extension apiserver begins
the same way as all API requests: communication to the Kubernetes apiserver.
This path already has been registered with the Kubernetes apiserver by the extension apiserver.

The user communicates with the Kubernetes apiserver, requesting access to the path.
The Kubernetes apiserver uses standard authentication and authorization configured
with the Kubernetes apiserver to authenticate the user and authorize access to the specific path.

For an overview of authenticating to a Kubernetes cluster, see
["Authenticating to a Cluster"](/docs/reference/access-authn-authz/authentication/).
For an overview of authorization of access to Kubernetes cluster resources, see
["Authorization Overview"](/docs/reference/access-authn-authz/authorization/).

Everything to this point has been standard Kubernetes API requests, authentication and authorization.

The Kubernetes apiserver now is prepared to send the request to the extension apiserver.
-->
### Kubernetes Apiserver 认证和授权   {#kubernetes-apiserver-authentication-and-authorization}

由扩展 apiserver 服务的对 API 路径的请求以与所有 API 请求相同的方式开始：
与 Kubernetes apiserver 的通信。该路径已通过扩展 apiserver 在
Kubernetes apiserver 中注册。

用户与 Kubernetes apiserver 通信，请求访问路径。
Kubernetes apiserver 使用它的标准认证和授权配置来对用户认证，以及对特定路径的鉴权。

有关对 Kubernetes 集群认证的概述，
请参见[对集群认证](/zh-cn/docs/reference/access-authn-authz/authentication/)。
有关对 Kubernetes 集群资源的访问鉴权的概述，
请参见[鉴权概述](/zh-cn/docs/reference/access-authn-authz/authorization/)。

到目前为止，所有内容都是标准的 Kubernetes API 请求，认证与鉴权。

Kubernetes apiserver 现在准备将请求发送到扩展 apiserver。

<!--
### Kubernetes Apiserver Proxies the Request

The Kubernetes apiserver now will send, or proxy, the request to the extension
apiserver that registered to handle the request. In order to do so,
it needs to know several things:

1. How should the Kubernetes apiserver authenticate to the extension apiserver,
   informing the extension apiserver that the request, which comes over the network,
   is coming from a valid Kubernetes apiserver?
2. How should the Kubernetes apiserver inform the extension apiserver of the
   username and group for which the original request was authenticated?

In order to provide for these two, you must configure the Kubernetes apiserver using several flags.
-->
### Kubernetes Apiserver 代理请求   {#kubernetes-apiserver-proxies-the-request}

Kubernetes apiserver 现在将请求发送或代理到注册以处理该请求的扩展 apiserver。
为此，它需要了解几件事：

1. Kubernetes apiserver 应该如何向扩展 apiserver 认证，以通知扩展
   apiserver 通过网络发出的请求来自有效的 Kubernetes apiserver？

2. Kubernetes apiserver 应该如何通知扩展 apiserver
   原始请求已通过认证的用户名和组？

为提供这两条信息，你必须使用若干标志来配置 Kubernetes apiserver。

<!--
#### Kubernetes Apiserver Client Authentication

The Kubernetes apiserver connects to the extension apiserver over TLS,
authenticating itself using a client certificate. You must provide the
following to the Kubernetes apiserver upon startup, using the provided flags:

* private key file via `--proxy-client-key-file`
* signed client certificate file via `--proxy-client-cert-file`
* certificate of the CA that signed the client certificate file via `--requestheader-client-ca-file`
* valid Common Name values (CNs) in the signed client certificate via `--requestheader-allowed-names`
-->
#### Kubernetes Apiserver 客户端认证

Kubernetes apiserver 通过 TLS 连接到扩展 apiserver，并使用客户端证书认证。
你必须在启动时使用提供的标志向 Kubernetes apiserver 提供以下内容：

* 通过 `--proxy-client-key-file` 指定私钥文件
* 通过 `--proxy-client-cert-file` 签名的客户端证书文件
* 通过 `--requestheader-client-ca-file` 签署客户端证书文件的 CA 证书
* 通过 `--requestheader-allowed-names` 在签署的客户端证书中有效的公用名（CN）

<!--
The Kubernetes apiserver will use the files indicated by `--proxy-client-*-file`
to authenticate to the extension apiserver. In order for the request to be considered
valid by a compliant extension apiserver, the following conditions must be met:

1. The connection must be made using a client certificate that is signed by
   the CA whose certificate is in `--requestheader-client-ca-file`.
2. The connection must be made using a client certificate whose CN is one of
   those listed in `--requestheader-allowed-names`.
-->
Kubernetes apiserver 将使用由 `--proxy-client-*-file` 指示的文件来向扩展 apiserver认证。
为了使合规的扩展 apiserver 能够将该请求视为有效，必须满足以下条件：

1. 连接必须使用由 CA 签署的客户端证书，该证书的证书位于 `--requestheader-client-ca-file` 中。
2. 连接必须使用客户端证书，该客户端证书的 CN 是 `--requestheader-allowed-names` 中列出的证书之一。

{{< note >}}
<!--
You can set this option to blank as `--requestheader-allowed-names=""`.
This will indicate to an extension apiserver that _any_ CN is acceptable.
-->
你可以将此选项设置为空白，即为`--requestheader-allowed-names=""`。
这将向扩展 apiserver 指示**任何** CN 都是可接受的。
{{< /note >}}

<!--
When started with these options, the Kubernetes apiserver will:

1. Use them to authenticate to the extension apiserver.
2. Create a configmap in the `kube-system` namespace called `extension-apiserver-authentication`,
   in which it will place the CA certificate and the allowed CNs. These in turn can be retrieved
   by extension apiservers to validate requests.

Note that the same client certificate is used by the Kubernetes apiserver to authenticate
against _all_ extension apiservers. It does not create a client certificate per extension
apiserver, but rather a single one to authenticate as the Kubernetes apiserver.
This same one is reused for all extension apiserver requests.
-->
使用这些选项启动时，Kubernetes apiserver 将：

1. 使用它们向扩展 apiserver 认证。
2. 在 `kube-system` 命名空间中创建一个名为
   `extension-apiserver-authentication` 的 ConfigMap，
   它将在其中放置 CA 证书和允许的 CN。
   反过来，扩展 apiserver 可以检索这些内容以验证请求。

请注意，Kubernetes apiserver 使用相同的客户端证书对所有扩展 apiserver 认证。
它不会为每个扩展 apiserver 创建一个客户端证书，而是创建一个证书作为
Kubernetes apiserver 认证。所有扩展 apiserver 请求都重复使用相同的请求。

<!--
#### Original Request Username and Group

When the Kubernetes apiserver proxies the request to the extension apiserver,
it informs the extension apiserver of the username and group with which the
original request successfully authenticated. It provides these in http headers of its proxied request. You must inform the Kubernetes apiserver of the names of the headers to be used.

* the header in which to store the username via `--requestheader-username-headers`
* the header in which to store the group via `--requestheader-group-headers`
* the prefix to append to all extra headers via `--requestheader-extra-headers-prefix`

These header names are also placed in the `extension-apiserver-authentication` configmap,
so they can be retrieved and used by extension apiservers.
-->
#### 原始请求用户名和组

当 Kubernetes apiserver 将请求代理到扩展 apiserver 时，
它将向扩展 apiserver 通知原始请求已成功通过其验证的用户名和组。
它在其代理请求的 HTTP 头部中提供这些。你必须将要使用的标头名称告知
Kubernetes apiserver。

* 通过 `--requestheader-username-headers` 标明用来保存用户名的头部
* 通过 `--requestheader-group-headers` 标明用来保存 group 的头部
* 通过 `--requestheader-extra-headers-prefix` 标明用来保存拓展信息前缀的头部

这些头部名称也放置在 `extension-apiserver-authentication` ConfigMap 中，
因此扩展 apiserver 可以检索和使用它们。

<!--
### Extension Apiserver Authenticates the Request

The extension apiserver, upon receiving a proxied request from the Kubernetes apiserver,
must validate that the request actually did come from a valid authenticating proxy,
which role the Kubernetes apiserver is fulfilling. The extension apiserver validates it via:

1. Retrieve the following from the configmap in `kube-system`, as described above:
    * Client CA certificate
    * List of allowed names (CNs)
    * Header names for username, group and extra info

2. Check that the TLS connection was authenticated using a client certificate which:
    * Was signed by the CA whose certificate matches the retrieved CA certificate.
    * Has a CN in the list of allowed CNs, unless the list is blank, in which case all CNs are allowed.
    * Extract the username and group from the appropriate headers
-->
### 扩展 Apiserver 认证请求    {#extension-apiserver-authenticates-the-request}

扩展 apiserver 在收到来自 Kubernetes apiserver 的代理请求后，
必须验证该请求确实确实来自有效的身份验证代理，
该认证代理由 Kubernetes apiserver 履行。扩展 apiserver 通过以下方式对其认证：

1. 如上所述，从 `kube-system` 中的 ConfigMap 中检索以下内容：

   * 客户端 CA 证书
   * 允许名称（CN）列表
   * 用户名，组和其他信息的头部

2. 使用以下证书检查 TLS 连接是否已通过认证：

   * 由其证书与检索到的 CA 证书匹配的 CA 签名。
   * 在允许的 CN 列表中有一个 CN，除非列表为空，在这种情况下允许所有 CN。
   * 从适当的头部中提取用户名和组。

<!--
If the above passes, then the request is a valid proxied request from a legitimate
authenticating proxy, in this case the Kubernetes apiserver.

Note that it is the responsibility of the extension apiserver implementation to provide
the above. Many do it by default, leveraging the `k8s.io/apiserver/` package.
Others may provide options to override it using command-line options.

In order to have permission to retrieve the configmap, an extension apiserver
requires the appropriate role. There is a default role named `extension-apiserver-authentication-reader`
in the `kube-system` namespace which can be assigned.
-->
如果以上均通过，则该请求是来自合法认证代理（在本例中为 Kubernetes apiserver）
的有效代理请求。

请注意，扩展 apiserver 实现负责提供上述内容。
默认情况下，许多扩展 apiserver 实现利用 `k8s.io/apiserver/` 软件包来做到这一点。
也有一些实现可能支持使用命令行选项来覆盖这些配置。

为了具有检索 configmap 的权限，扩展 apiserver 需要适当的角色。
在 `kube-system` 名字空间中有一个默认角色
`extension-apiserver-authentication-reader` 可用于设置。

<!--
### Extension Apiserver Authorizes the Request

The extension apiserver now can validate that the user/group retrieved from
the headers are authorized to execute the given request. It does so by sending
a standard [SubjectAccessReview](/docs/reference/access-authn-authz/authorization/)
request to the Kubernetes apiserver.

In order for the extension apiserver to be authorized itself to submit the
`SubjectAccessReview` request to the Kubernetes apiserver, it needs the correct permissions.
Kubernetes includes a default `ClusterRole` named `system:auth-delegator` that
has the appropriate permissions. It can be granted to the extension apiserver's service account.
-->
### 扩展 Apiserver 对请求鉴权   {#extensions-apiserver-authorizes-the-request}

扩展 apiserver 现在可以验证从标头检索的`user/group`是否有权执行给定请求。
通过向 Kubernetes apiserver 发送标准
[SubjectAccessReview](/zh-cn/docs/reference/access-authn-authz/authorization/) 请求来实现。

为了使扩展 apiserver 本身被鉴权可以向 Kubernetes apiserver 提交 SubjectAccessReview 请求，
它需要正确的权限。
Kubernetes 包含一个具有相应权限的名为 `system:auth-delegator` 的默认 `ClusterRole`，
可以将其授予扩展 apiserver 的服务帐户。

<!--
### Extension Apiserver Executes

If the `SubjectAccessReview` passes, the extension apiserver executes the request.

## Enable Kubernetes Apiserver flags

Enable the aggregation layer via the following `kube-apiserver` flags.
They may have already been taken care of by your provider.
-->
### 扩展 Apiserver 执行   {#enable-kubernetes-apiserver-flags}

如果 `SubjectAccessReview` 通过，则扩展 apiserver 执行请求。

## 启用 Kubernetes Apiserver 标志

通过以下 `kube-apiserver` 标志启用聚合层。
你的服务提供商可能已经为你完成了这些工作：

```
    --requestheader-client-ca-file=<path to aggregator CA cert>
    --requestheader-allowed-names=front-proxy-client
    --requestheader-extra-headers-prefix=X-Remote-Extra-
    --requestheader-group-headers=X-Remote-Group
    --requestheader-username-headers=X-Remote-User
    --proxy-client-cert-file=<path to aggregator proxy cert>
    --proxy-client-key-file=<path to aggregator proxy key>
```

<!--
### CA Reusage and Conflicts

The Kubernetes apiserver has two client CA options:
-->
### CA 重用和冲突  {#ca-reusage-and-conflicts}

Kubernetes apiserver 有两个客户端 CA 选项：

* `--client-ca-file`
* `--requestheader-client-ca-file`

<!--
Each of these functions independently and can conflict with each other,
if not used correctly.

* `--client-ca-file`: When a request arrives to the Kubernetes apiserver,
  if this option is enabled, the Kubernetes apiserver checks the certificate
  of the request. If it is signed by one of the CA certificates in the file referenced by
  `--client-ca-file`, then the request is treated as a legitimate request,
  and the user is the value of the common name `CN=`, while the group is the organization `O=`.
  See the [documentation on TLS authentication](/docs/reference/access-authn-authz/authentication/#x509-client-certificates).
* `--requestheader-client-ca-file`: When a request arrives to the Kubernetes apisever,
  if this option is enabled, the Kubernetes apiserver checks the certificate of the request.
  If it is signed by one of the CA certificates in the file reference by `--requestheader-client-ca-file`,
  then the request is treated as a potentially legitimate request. The Kubernetes apiserver then
  checks if the common name `CN=` is one of the names in the list provided by `--requestheader-allowed-names`.
  If the name is allowed, the request is approved; if it is not, the request is not.
-->
这些功能中的每个功能都是独立的；如果使用不正确，可能彼此冲突。

* `--client-ca-file`：当请求到达 Kubernetes apiserver 时，如果启用了此选项，
  则 Kubernetes apiserver 会检查请求的证书。
  如果它是由 `--client-ca-file` 引用的文件中的 CA 证书之一签名的，
  并且用户是公用名 `CN=` 的值，而组是组织 `O=` 的取值，则该请求被视为合法请求。
  请参阅[关于 TLS 身份验证的文档](/zh-cn/docs/reference/access-authn-authz/authentication/#x509-client-certificates)。

* `--requestheader-client-ca-file`：当请求到达 Kubernetes apiserver 时，
  如果启用此选项，则 Kubernetes apiserver 会检查请求的证书。
  如果它是由文件引用中的 `--requestheader-client-ca-file` 所签署的 CA 证书之一签名的，
  则该请求将被视为潜在的合法请求。
  然后，Kubernetes apiserver 检查通用名称 `CN=` 是否是
  `--requestheader-allowed-names` 提供的列表中的名称之一。
  如果名称允许，则请求被批准；如果不是，则请求被拒绝。

<!--
If _both_ `--client-ca-file` and `--requestheader-client-ca-file` are provided,
then the request first checks the `--requestheader-client-ca-file` CA and then the
`--client-ca-file`. Normally, different CAs, either root CAs or intermediate CAs,
are used for each of these options; regular client requests match against `--client-ca-file`,
while aggregation requests match against `--requestheader-client-ca-file`. However,
if both use the _same_ CA, then client requests that normally would pass via `--client-ca-file`
will fail, because the CA will match the CA in `--requestheader-client-ca-file`,
but the common name `CN=` will **not** match one of the acceptable common names in
`--requestheader-allowed-names`. This can cause your kubelets and other control plane components,
as well as end-users, to be unable to authenticate to the Kubernetes apiserver.

For this reason, use different CA certs for the `--client-ca-file`
option - to authorize control plane components and end-users - and the `--requestheader-client-ca-file` option - to authorize aggregation apiserver requests.
-->
如果同时提供了 `--client-ca-file` 和 `--requestheader-client-ca-file`，
则首先检查 `--requestheader-client-ca-file` CA，然后再检查 `--client-ca-file`。
通常，这些选项中的每一个都使用不同的 CA（根 CA 或中间 CA）。
常规客户端请求与 `--client-ca-file` 相匹配，而聚合请求要与
`--requestheader-client-ca-file` 相匹配。
但是，如果两者都使用同一个 CA，则通常会通过 `--client-ca-file`
传递的客户端请求将失败，因为 CA 将与 `--requestheader-client-ca-file`
中的 CA 匹配，但是通用名称 `CN=` 将不匹配 `--requestheader-allowed-names`
中可接受的通用名称之一。
这可能导致你的 kubelet 和其他控制平面组件以及最终用户无法向
Kubernetes apiserver 认证。

因此，请对用于控制平面组件和最终用户鉴权的 `--client-ca-file`
选项和用于聚合 apiserver 鉴权的 `--requestheader-client-ca-file`
选项使用不同的 CA 证书。

{{< warning >}}
<!--
Do **not** reuse a CA that is used in a different context unless you understand
the risks and the mechanisms to protect the CA's usage.
-->
除非你了解风险和保护 CA 用法的机制，否则**不要**重用在不同上下文中使用的 CA。
{{< /warning >}}

<!--
If you are not running kube-proxy on a host running the API server,
then you must make sure that the system is enabled with the following `kube-apiserver` flag:
-->
如果你未在运行 API 服务器的主机上运行 kube-proxy，则必须确保使用以下
`kube-apiserver` 标志启用系统：

```
--enable-aggregator-routing=true
```

<!--
### Register APIService objects

You can dynamically configure what client requests are proxied to extension
apiserver. The following is an example registration:
-->
### 注册 APIService 对象   {#register-apiservice-objects}

你可以动态配置将哪些客户端请求代理到扩展 apiserver。以下是注册示例：

```yaml
apiVersion: apiregistration.k8s.io/v1
kind: APIService
metadata:
  name: <注释对象名称>
spec:
  group: <扩展 Apiserver 的 API 组名>
  version: <扩展 Apiserver 的 API 版本>
  groupPriorityMinimum: <APIService 对应组的优先级, 参考 API 文档>
  versionPriority: <版本在组中的优先排序, 参考 API 文档>
  service:
    namespace: <拓展 Apiserver 服务的名字空间>
    name: <拓展 Apiserver 服务的名称>
  caBundle: <PEM 编码的 CA 证书，用于对 Webhook 服务器的证书签名>
```

<!--
The name of an APIService object must be a valid
[path segment name](/docs/concepts/overview/working-with-objects/names#path-segment-names).
-->
APIService
对象的名称必须是合法的[路径片段名称](/zh-cn/docs/concepts/overview/working-with-objects/names#path-segment-names)。

<!--
#### Contacting the extension apiserver

Once the Kubernetes apiserver has determined a request should be sent to an extension apiserver,
it needs to know how to contact it.

The `service` stanza is a reference to the service for an extension apiserver.
The service namespace and name are required. The port is optional and defaults to 443.

Here is an example of an extension apiserver that is configured to be called on port "1234",
and to verify the TLS connection against the ServerName
`my-service-name.my-service-namespace.svc` using a custom CA bundle.
-->
#### 调用扩展 apiserver

一旦 Kubernetes apiserver 确定应将请求发送到扩展 apiserver，
它需要知道如何调用它。

`service` 部分是对扩展 apiserver 的服务的引用。
服务的名字空间和名字是必需的。端口是可选的，默认为 443。

下面是一个扩展 apiserver 的配置示例，它被配置为在端口 `1234` 上调用。
并针对 ServerName `my-service-name.my-service-namespace.svc`
使用自定义的 CA 包来验证 TLS 连接使用自定义 CA 捆绑包的
`my-service-name.my-service-namespace.svc`。

```yaml
apiVersion: apiregistration.k8s.io/v1
kind: APIService
...
spec:
  ...
  service:
    namespace: my-service-namespace
    name: my-service-name
    port: 1234
  caBundle: "Ci0tLS0tQk...<base64-encoded PEM bundle>...tLS0K"
...
```

## {{% heading "whatsnext" %}}

<!--
* [Set up an extension api-server](/docs/tasks/extend-kubernetes/setup-extension-api-server/)
  to work with the aggregation layer.
* For a high level overview, see
  [Extending the Kubernetes API with the aggregation layer](/docs/concepts/extend-kubernetes/api-extension/apiserver-aggregation/).
* Learn how to [Extend the Kubernetes API Using Custom Resource Definitions](/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/).
-->

* 使用聚合层[安装扩展 API 服务器](/zh-cn/docs/tasks/extend-kubernetes/setup-extension-api-server/)。
* 有关高级概述，请参阅[使用聚合层扩展 Kubernetes API](/zh-cn/docs/concepts/extend-kubernetes/api-extension/apiserver-aggregation/)。
* 了解如何[使用自定义资源扩展 Kubernetes API](/zh-cn/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/)。
