---
title: 使用 Kubernetes API 访问集群
content_template: templates/task
---
<!-- ---
title: Access Clusters Using the Kubernetes API
content_template: templates/task
--- -->
{{% capture overview %}}
<!-- This page shows how to access clusters using the Kubernetes API. -->
本页展示了如何使用 Kubernetes API 访问集群
{{% /capture %}}

{{% capture prerequisites %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}
{{% /capture %}}

{{% capture steps %}}

<!-- ## Accessing the cluster API -->

## 访问集群 API

<!-- ### Accessing for the first time with kubectl -->

### 使用 kubectl 进行首次访问

<!-- When accessing the Kubernetes API for the first time, use the
Kubernetes command-line tool, `kubectl`. -->

首次访问 Kubernetes API 时，请使用 Kubernetes 命令行工具 `kubectl` 。

<!-- To access a cluster, you need to know the location of the cluster and have credentials
to access it. Typically, this is automatically set-up when you work through
a [Getting started guide](/docs/setup/),
or someone else setup the cluster and provided you with credentials and a location. -->

要访问集群，您需要知道集群位置并拥有访问它的凭证。通常，当您完成[入门指南](/docs/setup/)时，这会自动设置完成，或者由其他人设置好集群并将凭证和位置提供给您。

<!-- Check the location and credentials that kubectl knows about with this command: -->

使用此命令检查 kubectl 已知的位置和凭证：

```shell
$ kubectl config view
```

<!-- Many of the [examples](https://github.com/kubernetes/examples/tree/{{< param "githubbranch" >}}/) provide an introduction to using
kubectl. Complete documentation is found in the [kubectl manual](/docs/reference/kubectl/overview/). -->

许多[样例](https://github.com/kubernetes/examples/tree/{{< param "githubbranch" >}}/)提供了使用 kubectl 的介绍。完整文档请见 [kubectl 手册](/docs/reference/kubectl/overview/)。

<!-- ### Directly accessing the REST API -->

### 直接访问 REST API

<!-- kubectl handles locating and authenticating to the API server. If you want to directly access the REST API with an http client like
`curl` or `wget`, or a browser, there are multiple ways you can locate and authenticate against the API server: -->

kubectl 处理对 API 服务器的定位和身份验证。如果您想通过 http 客户端（如 `curl` 或 `wget`，或浏览器）直接访问 REST API，您可以通过多种方式对 API 服务器进行定位和身份验证：

 <!-- 1. Run kubectl in proxy mode (recommended). This method is recommended, since it uses the stored apiserver location and verifies the identity of the API server using a self-signed cert. No man-in-the-middle (MITM) attack is possible using this method.
 1. Alternatively, you can provide the location and credentials directly to the http client. This works with client code that is confused by proxies. To protect against man in the middle attacks, you'll need to import a root cert into your browser. -->

 1. 以代理模式运行 kubectl（推荐）。 推荐使用此方法，因为它用存储的 apiserver 位置并使用自签名证书验证 API 服务器的标识。使用这种方法无法进行中间人（MITM）攻击。
 2. 另外，您可以直接为 http 客户端提供位置和身份认证。这适用于被代理混淆的客户端代码。为防止中间人攻击，您需要将根证书导入浏览器。

 <!-- Using the Go or Python client libraries provides accessing kubectl in proxy mode. -->

 使用 Go 或 Python 客户端库可以在代理模式下访问 kubectl。

<!-- #### Using kubectl proxy -->

#### 使用 kubectl 代理

<!-- The following command runs kubectl in a mode where it acts as a reverse proxy. It handles
locating the API server and authenticating. -->

下列命令使 kubectl 运行在反向代理模式下。它处理 API 服务器的定位和身份认证。

<!-- Run it like this: -->

像这样运行它：

```shell
$ kubectl proxy --port=8080 &
```

<!-- See [kubectl proxy](/docs/reference/generated/kubectl/kubectl-commands/#proxy) for more details. -->

参见 [kubectl 代理](/docs/reference/generated/kubectl/kubectl-commands/#proxy) 获取更多细节。

<!-- Then you can explore the API with curl, wget, or a browser, like so: -->

然后您可以通过 curl，wget，或浏览器浏览 API，像这样：

```shell
$ curl http://localhost:8080/api/
{
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

<!-- #### Without kubectl proxy -->

#### 不使用 kubectl 代理

<!-- It is possible to avoid using kubectl proxy by passing an authentication token
directly to the API server, like this: -->

通过将身份认证令牌直接传给 API 服务器，可以避免使用 kubectl 代理，像这样：

``` shell
$ APISERVER=$(kubectl config view | grep server | cut -f 2- -d ":" | tr -d " ")
$ TOKEN=$(kubectl describe secret $(kubectl get secrets | grep default | cut -f1 -d ' ') | grep -E '^token' | cut -f2 -d':' | tr -d '\t')
$ curl $APISERVER/api --header "Authorization: Bearer $TOKEN" --insecure
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

<!-- The above example uses the `--insecure` flag. This leaves it subject to MITM
attacks. When kubectl accesses the cluster it uses a stored root certificate
and client certificates to access the server. (These are installed in the
`~/.kube` directory). Since cluster certificates are typically self-signed, it
may take special configuration to get your http client to use root
certificate. -->

上面例子使用了 `--insecure` 标志位。这使它易受到 MITM 攻击。当 kubectl 访问集群时，它使用存储的根证书和客户端证书访问服务器。（已安装在 `~/.kube` 目录下）。由于集群认证通常是自签名的，因此可能需要特殊设置才能让你的 http 客户端使用根证书。

<!-- On some clusters, the API server does not require authentication; it may serve
on localhost, or be protected by a firewall. There is not a standard
for this. [Configuring Access to the API](/docs/reference/access-authn-authz/controlling-access/)
describes how a cluster admin can configure this. Such approaches may conflict
with future high-availability support. -->

在一些集群中，API 服务器不需要身份认证；它运行在本地，或由防火墙保护着。对此并没有一个标准。[配置对 API 的访问](/docs/reference/access-authn-authz/controlling-access/) 阐述了一个集群管理员如何对此进行配置。这种方法可能与未来的高可用性支持发生冲突。

<!-- ### Programmatic access to the API -->

### 编程方式访问 API

<!-- Kubernetes officially supports client libraries for [Go](#go-client) and
[Python](#python-client). -->

Kubernetes 官方支持 [Go](#go-客户端) 和 [Python](#python-客户端) 的客户端库.

<!-- #### Go client -->

#### Go 客户端

<!-- * To get the library, run the following command: `go get k8s.io/client-go/<version number>/kubernetes` See [https://github.com/kubernetes/client-go](https://github.com/kubernetes/client-go) to see which versions are supported.
* Write an application atop of the client-go clients. Note that client-go defines its own API objects, so if needed, please import API definitions from client-go rather than from the main repository, e.g., `import "k8s.io/client-go/1.4/pkg/api/v1"` is correct. -->

* 要获取库，运行下列命令：`go get k8s.io/client-go/<version number>/kubernetes` 参见 [https://github.com/kubernetes/client-go](https://github.com/kubernetes/client-go) 查看受支持的版本。
* 基于 client-go 客户端编写应用程序。注意 client-go 定义了自己的 API 对象，因此如果需要，请从 client-go 而不是主仓库导入 API 定义，例如 `import "k8s.io/client-go/1.4/pkg/api/v1"` 是正确做法。

<!-- The Go client can use the same [kubeconfig file](/docs/concepts/cluster-administration/authenticate-across-clusters-kubeconfig/)
as the kubectl CLI does to locate and authenticate to the API server. See this [example](https://git.k8s.io/client-go/examples/out-of-cluster-client-configuration/main.go): -->

Go 客户端可以使用与 kubectl 命令行工具相同的 [kubeconfig 文件](/docs/concepts/cluster-administration/authenticate-across-clusters-kubeconfig/) 定位和验证 API 服务器。参见这个 [例子](https://git.k8s.io/client-go/examples/out-of-cluster-client-configuration/main.go)：

```golang
import (
   "fmt"
   "k8s.io/client-go/1.4/kubernetes"
   "k8s.io/client-go/1.4/pkg/api/v1"
   "k8s.io/client-go/1.4/tools/clientcmd"
)
...
   // uses the current context in kubeconfig
   config, _ := clientcmd.BuildConfigFromFlags("", "path to kubeconfig")
   // creates the clientset
   clientset, _:= kubernetes.NewForConfig(config)
   // access the API to list pods
   pods, _:= clientset.CoreV1().Pods("").List(v1.ListOptions{})
   fmt.Printf("There are %d pods in the cluster\n", len(pods.Items))
...
```

<!-- If the application is deployed as a Pod in the cluster, please refer to the [next section](#accessing-the-api-from-a-pod). -->

如果该应用程序部署为集群中的一个 Pod，请参阅 [下一节](#从-pod-中访问-api)。

<!-- #### Python client -->

#### Python 客户端

<!-- To use [Python client](https://github.com/kubernetes-client/python), run the following command: `pip install kubernetes` See [Python Client Library page](https://github.com/kubernetes-client/python) for more installation options. -->

要使用 [Python 客户端](https://github.com/kubernetes-client/python)，运行下列命令：`pip install kubernetes` 参见 [Python 客户端库主页](https://github.com/kubernetes-client/python) 查看更多安装选项。

<!-- The Python client can use the same [kubeconfig file](/docs/concepts/cluster-administration/authenticate-across-clusters-kubeconfig/)
as the kubectl CLI does to locate and authenticate to the API server. See this [example](https://github.com/kubernetes-client/python/tree/master/examples/example1.py): -->

Python 客户端可以使用与 kubectl 命令行工具相同的 [kubeconfig 文件](/docs/concepts/cluster-administration/authenticate-across-clusters-kubeconfig/) 定位和验证 API 服务器。参见这个 [例子](https://github.com/kubernetes-client/python/tree/master/examples/example1.py)：

```python
from kubernetes import client, config

config.load_kube_config()

v1=client.CoreV1Api()
print("Listing pods with their IPs:")
ret = v1.list_pod_for_all_namespaces(watch=False)
for i in ret.items:
    print("%s\t%s\t%s" % (i.status.pod_ip, i.metadata.namespace, i.metadata.name))
```

<!-- #### Other languages -->

#### 其他语言

<!-- There are [client libraries](/docs/reference/using-api/client-libraries/) for accessing the API from other languages. See documentation for other libraries for how they authenticate. -->

有许多 [客户端库](/docs/reference/using-api/client-libraries/) 可以用于从其他语言访问 API。请参阅其他库的文档了解它们的身份验证方式。

<!-- ### Accessing the API from a Pod -->

### 从 Pod 中访问 API

<!-- When accessing the API from a Pod, locating and authenticating
to the API server are somewhat different. -->

从 Pod 访问 API 时，对 API 服务器的定位和身份验证会有所不同。

<!-- The easiest way to use the Kubernetes API from a Pod is to use
one of the official [client libraries](/docs/reference/using-api/client-libraries/). These
libraries can automatically discover the API server and authenticate. -->

从 Pod 使用 Kubernetes API 的最简单的方法就是使用一个官方的 [客户端库](/docs/reference/using-api/client-libraries/)。这些库可以自动发现 API 服务器并进行身份验证。

<!-- While running in a Pod, the Kubernetes apiserver is accessible via a Service named
`kubernetes` in the `default` namespace. Therefore, Pods can use the 
`kubernetes.default.svc` hostname to query the API server. Official client libraries
do this automatically. -->

在运行在 Pod 中时，可以通过 `default` 命名空间中的名为 `kubernetes` 的服务访问 Kubernetes apiserver。也就是说，Pods 可以使用 `kubernetes.default.svc` 主机名来查询 API 服务器。官方客户端库自动完成这个工作。

<!-- From within a Pod, the recommended way to authenticate to the API server is with a
[service account](/docs/user-guide/service-accounts) credential. By default, a Pod
is associated with a service account, and a credential (token) for that
service account is placed into the filesystem tree of each container in that Pod,
at `/var/run/secrets/kubernetes.io/serviceaccount/token`. -->

从一个 Pod 内，向 API 服务器进行身份认证的推荐的做法是使用 [服务账号](/docs/user-guide/service-accounts) 凭证。默认的，一个 Pod 与一个服务账号关联，该服务账户的凭证（令牌）放置在此 Pod 中每个容器的文件系统树中的 `/var/run/secrets/kubernetes.io/serviceaccount/token` 处。

<!-- If available, a certificate bundle is placed into the filesystem tree of each
container at `/var/run/secrets/kubernetes.io/serviceaccount/ca.crt`, and should be
used to verify the serving certificate of the API server. -->

如果可用，凭证包被放入每个容器的文件系统树中的 `/var/run/secrets/kubernetes.io/serviceaccount/ca.crt` 处，并且将被用于验证 API 服务器的服务证书。

<!-- Finally, the default namespace to be used for namespaced API operations is placed in a file
at `/var/run/secrets/kubernetes.io/serviceaccount/namespace` in each container. -->

最后，用于命名空间 API 操作的默认的命名空间放置在每个容器中的 `/var/run/secrets/kubernetes.io/serviceaccount/namespace` 文件中。

<!-- From within a Pod, the recommended ways to connect to the Kubernetes API are: -->

从一个 Pod 内，连接 Kubernetes API 的推荐方法是：

<!--   - Use one of the official [client libraries](/docs/reference/using-api/client-libraries/)
    as they handle API host discovery and authentication automatically.
    For Go client, the `rest.InClusterConfig()` function assists with this.
    See [an example here](https://git.k8s.io/client-go/examples/in-cluster-client-configuration/main.go). -->

  - 使用官方的 [客户端库](/docs/reference/using-api/client-libraries/) 因为他们会自动地完成 API 主机发现和身份认证。以 Go 客户端来说，`rest.InClusterConfig()` 可以帮助解决这个问题。参见 [这里的一个例子](https://git.k8s.io/client-go/examples/in-cluster-client-configuration/main.go)。

<!--   - If you would like to query the API without an official client library, you can run `kubectl proxy`
    as the [command](/docs/tasks/inject-data-application/define-command-argument-container/)
    of a new sidecar container in the Pod. This way, `kubectl proxy` will authenticate
    to the API and expose it on the `localhost` interface of the Pod, so that other containers
    in the Pod can use it directly. -->

  - 如果您想要在没有官方客户端库的情况下查询 API，可以在 Pod 里以一个新的边车容器的 [命令](/docs/tasks/inject-data-application/define-command-argument-container/)的方式运行 `kubectl proxy` 。此方式下，`kubectl proxy` 将对 API 进行身份验证并将其公开在 Pod 的 `localhost` 接口上，以便 Pod 中的其他容器可以直接使用它。

<!-- In each case, the service account credentials of the Pod are used to communicate
securely with the API server. -->

在每种情况下，Pod 的服务账号凭证被用于与 API 服务器的安全通信。

{{% /capture %}}
