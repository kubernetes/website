---
title: 从 Pod 中访问 Kubernetes API
content_type: task
weight: 120
---

<!--
title: Accessing the Kubernetes API from a Pod
content_type: task
weight: 120
-->

<!-- overview -->

<!--
This guide demonstrates how to access the Kubernetes API from within a pod.
-->
本指南演示了如何从 Pod 中访问 Kubernetes API。

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

<!-- steps -->

<!--
## Accessing the API from within a Pod

When accessing the API from within a Pod, locating and authenticating
to the API server are slightly different to the external client case.
-->
### 从 Pod 中访问 API   {#accessing-the-api-from-within-a-pod}

从 Pod 内部访问 API 时，定位 API 服务器和向服务器认证身份的操作
与外部客户端场景不同。

<!--
The easiest way to use the Kubernetes API from a Pod is to use
one of the official [client libraries](/docs/reference/using-api/client-libraries/). These
libraries can automatically discover the API server and authenticate.
-->
从 Pod 使用 Kubernetes API 的最简单的方法就是使用官方的
[客户端库](/zh/docs/reference/using-api/client-libraries/)。
这些库可以自动发现 API 服务器并进行身份验证。

<!--
### Using Official Client Libraries

From within a Pod, the recommended ways to connect to the Kubernetes API are:

  - For a Go client, use the official [Go client library](https://github.com/kubernetes/client-go/).
    The `rest.InClusterConfig()` function handles API host discovery and authentication automatically.
    See [an example here](https://git.k8s.io/client-go/examples/in-cluster-client-configuration/main.go).

  - For a Python client, use the official [Python client library](https://github.com/kubernetes-client/python/).
    The `config.load_incluster_config()` function handles API host discovery and authentication automatically.
    See [an example here](https://github.com/kubernetes-client/python/blob/master/examples/in_cluster_config.py).

  - There are a number of other libraries available, please refer to the [Client Libraries](/docs/reference/using-api/client-libraries/) page.

In each case, the service account credentials of the Pod are used to communicate
securely with the API server.
-->
#### 使用官方客户端库   {#using-official-client-libraries}

从一个 Pod 内部连接到 Kubernetes API 的推荐方式为：

- 对于 Go 语言客户端，使用官方的 [Go 客户端库](https://github.com/kubernetes/client-go/)。
  函数 `rest.InClusterConfig()` 自动处理 API 主机发现和身份认证。
  参见[这里的一个例子](https://git.k8s.io/client-go/examples/in-cluster-client-configuration/main.go)。

- 对于 Python 客户端，使用官方的 [Python 客户端库](https://github.com/kubernetes-client/python/)。
  函数 `config.load_incluster_config()` 自动处理 API 主机的发现和身份认证。
  参见[这里的一个例子](https://github.com/kubernetes-client/python/blob/master/examples/in_cluster_config.py)。

- 还有一些其他可用的客户端库，请参阅[客户端库](/zh/docs/reference/using-api/client-libraries/)页面。

在以上场景中，客户端库都使用 Pod 的服务账号凭据来与 API 服务器安全地通信。

<!--
### Directly accessing the REST API

While running in a Pod, the Kubernetes apiserver is accessible via a Service named
`kubernetes` in the `default` namespace. Therefore, Pods can use the
`kubernetes.default.svc` hostname to query the API server. Official client libraries
do this automatically.
-->
#### 直接访问 REST API   {#directly-accessing-the-rest-api}

在运行在 Pod 中时，可以通过 `default` 命名空间中的名为 `kubernetes` 的服务访问
Kubernetes API 服务器。也就是说，Pod 可以使用 `kubernetes.default.svc` 主机名
来查询 API 服务器。官方客户端库自动完成这个工作。

<!--
The recommended way to authenticate to the API server is with a
[service account](/docs/tasks/configure-pod-container/configure-service-account/) credential. By default, a Pod
is associated with a service account, and a credential (token) for that
service account is placed into the filesystem tree of each container in that Pod,
at `/var/run/secrets/kubernetes.io/serviceaccount/token`.
-->
向 API 服务器进行身份认证的推荐做法是使用
[服务账号](/zh/docs/tasks/configure-pod-container/configure-service-account/)凭据。
默认情况下，每个 Pod 与一个服务账号关联，该服务账户的凭证（令牌）放置在此 Pod 中
每个容器的文件系统树中的 `/var/run/secrets/kubernetes.io/serviceaccount/token` 处。

<!--
If available, a certificate bundle is placed into the filesystem tree of each
container at `/var/run/secrets/kubernetes.io/serviceaccount/ca.crt`, and should be
used to verify the serving certificate of the API server.
-->
如果证书包可用，则凭证包被放入每个容器的文件系统树中的
`/var/run/secrets/kubernetes.io/serviceaccount/ca.crt` 处，
且将被用于验证 API 服务器的服务证书。

<!--
Finally, the default namespace to be used for namespaced API operations is placed in a file
at `/var/run/secrets/kubernetes.io/serviceaccount/namespace` in each container.
-->
最后，用于命名空间域 API 操作的默认命名空间放置在每个容器中的
`/var/run/secrets/kubernetes.io/serviceaccount/namespace` 文件中。

<!--
### Using kubectl proxy

If you would like to query the API without an official client library, you can run `kubectl proxy`
as the [command](/docs/tasks/inject-data-application/define-command-argument-container/)
of a new sidecar container in the Pod. This way, `kubectl proxy` will authenticate
to the API and expose it on the `localhost` interface of the Pod, so that other containers
in the Pod can use it directly.
-->
#### 使用 kubectl proxy   {#use-kubectl-proxy}

如果你希望不使用官方客户端库就完成 API 查询，可以将 `kubectl proxy` 作为
[command](/zh/docs/tasks/inject-data-application/define-command-argument-container/)
在 Pod 中启动一个边车（Sidecar）容器。这样，`kubectl proxy` 自动完成对 API
的身份认证，并将其暴露到 Pod 的 `localhost` 接口，从而 Pod 中的其他容器可以
直接使用 API。

<!--
### Without using a proxy

It is possible to avoid using the kubectl proxy by passing the authentication token
directly to the API server.  The internal certificate secures the connection.
-->
### 不使用代理   {#without-using-a-proxy}

通过将认证令牌直接发送到 API 服务器，也可以避免运行 kubectl proxy 命令。
内部的证书机制能够为链接提供保护。

```shell
# 指向内部 API 服务器的主机名
APISERVER=https://kubernetes.default.svc

# 服务账号令牌的路径
SERVICEACCOUNT=/var/run/secrets/kubernetes.io/serviceaccount

# 读取 Pod 的名字空间
NAMESPACE=$(cat ${SERVICEACCOUNT}/namespace)

# 读取服务账号的持有者令牌
TOKEN=$(cat ${SERVICEACCOUNT}/token)

# 引用内部证书机构（CA）
CACERT=${SERVICEACCOUNT}/ca.crt

# 使用令牌访问 API
curl --cacert ${CACERT} --header "Authorization: Bearer ${TOKEN}" -X GET ${APISERVER}/api
```

<!--
The output will be similar to this:
-->
输出类似于：

```json
{
  "kind": "APIVersions",
  "versions": [
    "v1"
  ],
  "serverAddressByClientCIDRs": [
    {
      "clientCIDR": "0.0.0.0/0",
      "serverAddress": "10.0.1.149:443"
    }
  ]
}
```
