---
title: 访问集群
redirect_from:
- "/docs/user-guide/accessing-the-cluster/"
- "/docs/user-guide/accessing-the-cluster.html"
- "/docs/concepts/cluster-administration/access-cluster/"
- "/docs/concepts/cluster-administration/access-cluster.html"
cn-approvers:
- rootsongjc
cn-reviewers:
- shidrdn
---

* TOC
{:toc}
<!--
## Accessing the cluster API

### Accessing for the first time with kubectl

When accessing the Kubernetes API for the first time, we suggest using the
Kubernetes CLI, `kubectl`.

To access a cluster, you need to know the location of the cluster and have credentials
to access it.  Typically, this is automatically set-up when you work through
a [Getting started guide](/docs/getting-started-guides/),
or someone else setup the cluster and provided you with credentials and a location.

Check the location and credentials that kubectl knows about with this command:

```shell
$ kubectl config view
```

Many of the [examples](https://github.com/kubernetes/kubernetes/tree/{{page.githubbranch}}/examples/) provide an introduction to using
kubectl and complete documentation is found in the [kubectl manual](/docs/user-guide/kubectl/index).
-->

## 访问集群 API

### 第一次使用 kubectl 访问

如果您是第一次访问 Kubernetes API 的话，我们建议您使用 Kubernetes 命令行工具：`kubectl`。

为了访问集群，您需要知道集群的地址，并且需要有访问它的凭证。通常，如果您完成了 [入门指南](/docs/getting-started-guides/) 那么这些将会自动设置，或者其他人为您部署的集群提供并给您凭证和集群地址。

使用下面的命令检查 kubectl 已知的集群的地址和凭证：

```shell
$ kubectl config view
```
关于 kubectl 命令使用的更多 [示例](https://github.com/kubernetes/kubernetes/tree/{{page.githubbranch}}/examples/) 和完整文档可以在这里找到：[kubectl 手册](/docs/user-guide/kubectl/index)
<!--


### Directly accessing the REST API

Kubectl handles locating and authenticating to the apiserver.
If you want to directly access the REST API with an http client like
curl or wget, or a browser, there are several ways to locate and authenticate:

- Run kubectl in proxy mode.
    - Recommended approach.
    - Uses stored apiserver location.
    - Verifies identity of apiserver using self-signed cert.  No MITM possible.
    - Authenticates to apiserver.
    - In future, may do intelligent client-side load-balancing and failover.
- Provide the location and credentials directly to the http client.
    - Alternate approach.
    - Works with some types of client code that are confused by using a proxy.
    - Need to import a root cert into your browser to protect against MITM.

-->

### 直接访问 REST API

Kubectl 处理对 apiserver 的定位和认证。如果您想直接访问 REST API，可以使用像 curl、wget 或浏览器这样的 http 客户端，有以下几种方式来定位和认证：

- 以 proxy 模式运行 kubectl。
  - 推荐方法。
  - 使用已保存的 apiserver 位置信息。
  - 使用自签名证书验证 apiserver 的身份。 没有 MITM（中间人攻击）的可能。
  - 认证到 apiserver。
  - 将来，可能会做智能的客户端负载均衡和故障转移。
- 直接向 http 客户端提供位置和凭据。
  - 替代方法。
  - 适用于通过使用代理而混杂的某些类型的客户端代码。
  - 需要将根证书导入浏览器以防止 MITM。

<!--


#### Using kubectl proxy

The following command runs kubectl in a mode where it acts as a reverse proxy.  It handles
locating the apiserver and authenticating.
Run it like this:
-->

#### 使用 kubectl proxy

以下命令作为反向代理的模式运行 kubectl。 它处理对 apiserver 的定位并进行认证。

像这样运行：


```shell
$ kubectl proxy --port=8080 &
```
<!--


See [kubectl proxy](/docs/user-guide/kubectl/v1.6/#proxy) for more details.

Then you can explore the API with curl, wget, or a browser, like so:
-->

查看关于 [kubectl proxy](/docs/user-guide/kubectl/v1.6/#proxy)  的更多细节。

然后您可以使用 curl、wget 或者浏览器来访问 API，如下所示：


```shell
$ curl http://localhost:8080/api/
{
  "versions": [
    "v1"
  ]
}
```

<!--

#### Without kubectl proxy (before v1.3.x)

It is possible to avoid using kubectl proxy by passing an authentication token
directly to the apiserver, like this:
-->

#### 不使用 kubectl proxy（1.3.x 以前版本）

通过将认证 token 直接传递给 apiserver 的方式，可以避免使用 kubectl proxy，如下所示：


```shell
$ APISERVER=$(kubectl config view | grep server | cut -f 2- -d ":" | tr -d " ")
$ TOKEN=$(kubectl config view | grep token | cut -f 2 -d ":" | tr -d " ")
$ curl $APISERVER/api --header "Authorization: Bearer $TOKEN" --insecure
{
  "versions": [
    "v1"
  ]
}
```
<!--


#### Without kubectl proxy (post v1.3.x)

In Kubernetes version 1.3 or later, `kubectl config view` no longer displays the token. Use `kubectl describe secret...` to get the token for the default service account, like this:
-->

#### 不使用 kubectl proxy（1.3.x 以后版本）

在 Kubernetes 1.3 或更高版本中，`kubectl config view` 不再显示 token。 使用 `kubectl describe secret …` 获取 default service account 的 token，如下所示：


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
<!--


The above examples use the `--insecure` flag.  This leaves it subject to MITM
attacks.  When kubectl accesses the cluster it uses a stored root certificate
and client certificates to access the server.  (These are installed in the
`~/.kube` directory).  Since cluster certificates are typically self-signed, it
may take special configuration to get your http client to use root
certificate.

On some clusters, the apiserver does not require authentication; it may serve
on localhost, or be protected by a firewall.  There is not a standard
for this.  [Configuring Access to the API](/docs/admin/accessing-the-api)
describes how a cluster admin can configure this.  Such approaches may conflict
with future high-availability support.
-->

以上示例使用`--insecure` 标志。 这使得它容易受到 MITM 攻击。 当 kubectl 访问集群时，它使用存储的根证书和客户端证书来访问服务器。 （这些安装在`~/.kube`目录中）。 由于集群证书通常是自签名的，因此可能需要特殊配置才能让您的 http 客户端使用根证书。

对于某些集群，apiserver 可能不需要身份验证；可以选择在本地主机上服务，或者使用防火墙保护。 对此还没有一个标准。[配置对API的访问](/docs/admin/accessing-the-api) 描述了集群管理员如何配置此操作。 这种方法可能与未来的高可用性支持相冲突。
<!--

### Programmatic access to the API

Kubernetes supports [Go](#go-client) and [Python](#python-client) client libraries.

#### Go client

* To get the library, run the following command: `go get k8s.io/client-go/<version number>/kubernetes` See [https://github.com/kubernetes/client-go](https://github.com/kubernetes/client-go) to see which versions are supported.
* Write an application atop of the client-go clients. Note that client-go defines its own API objects, so if needed, please import API definitions from client-go rather than from the main repository, e.g., `import "k8s.io/client-go/1.4/pkg/api/v1"` is correct.

The Go client can use the same [kubeconfig file](/docs/concepts/cluster-administration/authenticate-across-clusters-kubeconfig/)
as the kubectl CLI does to locate and authenticate to the apiserver. See this [example](https://git.k8s.io/client-go/examples/out-of-cluster-client-configuration/main.go).

If the application is deployed as a Pod in the cluster, please refer to the [next section](#accessing-the-api-from-a-pod).
-->

### 编程访问 API

Kubernetes 支持 [Go](#go-client) 和 [Python](#python-client) 客户端库。

#### Go 客户端

- 要获取该库，请运行以下命令：`go get k8s.io/client-go/<version number>/kubernetes`  请参阅 https://github.com/kubernetes/client-go 以查看支持哪些版本。
- 使用 client-go 客户端编程。请注意，client-go 定义了自己的 API 对象，因此如果需要，请从 client-go 而不是从主存储库导入 API 定义，例如导入 `k8s.io/client-go/1.4/pkg/api/v1` 是正确的。

Go 客户端可以使用与 kubectl 命令行工具相同的 [kubeconfig 文件](/docs/concepts/cluster-administration/authenticate-across-clusters-kubeconfig/) 来定位和验证 apiserver。参考该 [示例](https://git.k8s.io/client-go/examples/out-of-cluster-client-configuration/main.go)。

如果应用程序在集群中以 Pod 的形式部署，请参考 [下一节](#accessing-the-api-from-a-pod)。

<!--


#### Python client

To use [Python client](https://github.com/kubernetes-client/python), run the following command: `pip install kubernetes` See [Python Client Library page](https://github.com/kubernetes-client/python) for more installation options.

The Python client can use the same [kubeconfig file](/docs/user-guide/kubeconfig-file)
as the kubectl CLI does to locate and authenticate to the apiserver. See this [example](https://github.com/kubernetes-client/python/tree/master/examples/example1.py).
-->

#### Python 客户端

要使用 [Python client](https://github.com/kubernetes-client/python)，请运行以下命令：`pip install kubernetes`。查看  [Python 客户端库页面](https://github.com/kubernetes-client/python) 获取更多的安装选择。

Python 客户端可以使用与 kubectl 命令行工具相同的 [kubeconfig 文件](/docs/concepts/cluster-administration/authenticate-across-clusters-kubeconfig/) 来定位和验证 apiserver。参考该 [示例](https://github.com/kubernetes-client/python/tree/master/examples/example1.py)。
<!--


#### Other languages

There are [client libraries](https://git.k8s.io/community/contributors/devel/client-libraries.md) for accessing the API from other languages. See documentation for other libraries for how they authenticate.
-->

#### 其他语言

还有更多的 [客户端库](https://git.k8s.io/community/contributors/devel/client-libraries.md) 可以用来访问 API。有关其他库的验证方式，请参阅文档。
<!--


### Accessing the API from a Pod

When accessing the API from a pod, locating and authenticating
to the api server are somewhat different.

The recommended way to locate the apiserver within the pod is with
the `kubernetes` DNS name, which resolves to a Service IP which in turn
will be routed to an apiserver.

The recommended way to authenticate to the apiserver is with a
[service account](/docs/user-guide/service-accounts) credential.  By kube-system, a pod
is associated with a service account, and a credential (token) for that
service account is placed into the filesystem tree of each container in that pod,
at `/var/run/secrets/kubernetes.io/serviceaccount/token`.

If available, a certificate bundle is placed into the filesystem tree of each
container at `/var/run/secrets/kubernetes.io/serviceaccount/ca.crt`, and should be
used to verify the serving certificate of the apiserver.

Finally, the default namespace to be used for namespaced API operations is placed in a file
at `/var/run/secrets/kubernetes.io/serviceaccount/namespace` in each container.

From within a pod the recommended ways to connect to API are:

- run a kubectl proxy as one of the containers in the pod, or as a background
    process within a container.  This proxies the
    Kubernetes API to the localhost interface of the pod, so that other processes
    in any container of the pod can access it.  See this [example of using kubectl proxy
    in a pod](https://github.com/kubernetes/kubernetes/tree/{{page.githubbranch}}/examples/kubectl-container/).
- use the Go client library, and create a client using the `rest.InClusterConfig()` and `kubernetes.NewForConfig()` functions.
    They handle locating and authenticating to the apiserver. [example](https://git.k8s.io/client-go/examples/in-cluster/main.go)

In each case, the credentials of the pod are used to communicate securely with the apiserver.

-->

### 在 Pod 中访问 API

在 Pod 中访问 API 时，定位和认证到 API server 的方式有所不同。在 Pod 中找到 apiserver 地址的推荐方法是使用kubernetes DNS 名称，将它解析为服务 IP，后者又将被路由到 apiserver。

向 apiserver 认证的推荐方法是使用 [service account](/docs/user-guide/service-accounts) 凭据。通过 kube-system，pod 与 service account 相关联，并且将该 service account 的凭据（token）放入该 pod 中每个容器的文件系统树中，位于 `/var/run/secrets/kubernetes.io/serviceaccount/token`。

如果可用，证书包将位于每个容器的文件系统树的  `/var/run/secrets/kubernetes.io/serviceaccount/ca.crt`  位置，并用于验证 apiserver 的服务证书。

最后，用于 namespace API 操作的默认 namespace 放在每个容器中的 `/var/run/secrets/kubernetes.io/serviceaccount/namespace` 中。

在 pod 中，连接到 API 的推荐方法是：

- 将 kubectl proxy 作为 pod 中的一个容器来运行，或作为在容器内运行的后台进程。它将 Kubernetes API 代理到 pod 的本地主机接口，以便其他任何 pod 中的容器内的进程都可以访问它。请参阅 [在 pod 中使用 kubectl proxy 的示例](https://github.com/kubernetes/kubernetes/tree/{{page.githubbranch}}/examples/kubectl-container/)。

- 使用 Go 客户端库，并使用 `rest.InClusterConfig()` 和  `kubernetes.NewForConfig()`  函数创建一个客户端。

    他们处理对 apiserver 的定位和认证。[示例](https://git.k8s.io/client-go/examples/in-cluster-client-configuration/main.go)

在以上的几种情况下，都需要使用 pod 的凭据与 apiserver 进行安全通信。

<!--

## Accessing services running on the cluster

The previous section was about connecting the Kubernetes API server.  This section is about
connecting to other services running on Kubernetes cluster.  In Kubernetes, the
[nodes](/docs/admin/node), [pods](/docs/user-guide/pods) and [services](/docs/user-guide/services) all have
their own IPs.  In many cases, the node IPs, pod IPs, and some service IPs on a cluster will not be
routable, so they will not be reachable from a machine outside the cluster,
such as your desktop machine.
-->

## 访问集群中运行的 service

上一节是关于连接到 kubernetes API  server。这一节是关于连接到 kubernetes 集群中运行的 service。在 Kubernetes 中，[node](/docs/admin/node)、 [pod](/docs/user-guide/pods) 和 [service](/docs/user-guide/services) 都有它们自己的 IP。很多情况下，集群中 node 的 IP、Pod 的 IP、service 的 IP 都是不可路由的，因此在集群外面的机器就无法访问到它们，例如从您自己的笔记本电脑。

<!--

### Ways to connect

You have several options for connecting to nodes, pods and services from outside the cluster:

- Access services through public IPs.
    - Use a service with type `NodePort` or `LoadBalancer` to make the service reachable outside
      the cluster.  See the [services](/docs/user-guide/services) and
      [kubectl expose](/docs/user-guide/kubectl/v1.6/#expose) documentation.
    - Depending on your cluster environment, this may just expose the service to your corporate network,
      or it may expose it to the internet.  Think about whether the service being exposed is secure.
      Does it do its own authentication?
    - Place pods behind services.  To access one specific pod from a set of replicas, such as for debugging,
      place a unique label on the pod it and create a new service which selects this label.
    - In most cases, it should not be necessary for application developer to directly access
      nodes via their nodeIPs.
- Access services, nodes, or pods using the Proxy Verb.
    - Does apiserver authentication and authorization prior to accessing the remote service.
      Use this if the services are not secure enough to expose to the internet, or to gain
      access to ports on the node IP, or for debugging.
    - Proxies may cause problems for some web applications.
    - Only works for HTTP/HTTPS.
    - Described [here](#manually-constructing-apiserver-proxy-urls).
- Access from a node or pod in the cluster.
    - Run a pod, and then connect to a shell in it using [kubectl exec](/docs/user-guide/kubectl/v1.6/#exec).
      Connect to other nodes, pods, and services from that shell.
    - Some clusters may allow you to ssh to a node in the cluster.  From there you may be able to
      access cluster services.  This is a non-standard method, and will work on some clusters but
      not others.  Browsers and other tools may or may not be installed.  Cluster DNS may not work.

-->

### 连接的方式

您可以选择以下几种方式从集群外部连接到 node、pod 和 service：

- 通过 public IP 访问 service。
  - 使用 `NodePort` 和 `LoadBalancer` 类型的 service，以使 service 能够在集群外部被访问到。请查看 [service](/docs/user-guide/services) 和 [kubectl expose](/docs/user-guide/kubectl/v1.6/#expose) 文档。
  - 根据您的集群环境，这可能会将服务暴露给您的公司网络，或者可能会将其暴露在互联网上。想想暴露的服务是否安全。它是否自己进行身份验证？
  - 将 pod 放在服务后面。 要从一组副本（例如为了调试）访问一个特定的 pod，请在 pod 上放置一个唯一的 label，并创建一个选择该 label 的新服务。
  - 在大多数情况下，应用程序开发人员不需要通过 node IP 直接访问节点。
- 通过 Proxy  规则访问 service、node、pod。
  - 在访问远程服务之前，请执行 apiserver 认证和授权。
    如果服务不够安全，无法暴露给互联网，或者为了访问节点 IP 上的端口或进行调试，请使用这种方式。
  - 代理可能会导致某些 Web 应用程序出现问题。
  - 仅适用于 HTTP/HTTPS。
  - [见此描述](#manually-constructing-apiserver-proxy-urls)。
- 在集群内访问 node 和 pod。
  - 运行一个 pod，然后使用 [kubectl exec](/docs/user-guide/kubectl/v1.6/#exec) 命令连接到 shell。从该 shell 中连接到其他 node、pod 和 service。
  - 有些集群可能允许 ssh 到集群上的某个节点。 从那个节点您可以访问到集群中的服务。这是一个非标准的方法，它可能将在某些集群上奏效，而在某些集群不行。这些节点上可能安装了浏览器和其他工具也可能没有。集群 DNS 可能无法正常工作。

<!--


### Discovering builtin services

Typically, there are several services which are started on a cluster by kube-system. Get a list of these
with the `kubectl cluster-info` command:
-->

### 访问内置服务

通常集群内会有几个在 kube-system 中启动的服务。使用 `kubectl cluster-info` 命令获取该列表：

```shell
$ kubectl cluster-info

  Kubernetes master is running at https://104.197.5.247
  elasticsearch-logging is running at https://104.197.5.247/api/v1/namespaces/kube-system/services/elasticsearch-logging/proxy
  kibana-logging is running at https://104.197.5.247/api/v1/namespaces/kube-system/services/kibana-logging/proxy
  kube-dns is running at https://104.197.5.247/api/v1/namespaces/kube-system/services/kube-dns/proxy
  grafana is running at https://104.197.5.247/api/v1/namespaces/kube-system/services/monitoring-grafana/proxy
  heapster is running at https://104.197.5.247/api/v1/namespaces/kube-system/services/monitoring-heapster/proxy
```

<!--

This shows the proxy-verb URL for accessing each service.
For example, this cluster has cluster-level logging enabled (using Elasticsearch), which can be reached
at `https://104.197.5.247/api/v1/namespaces/kube-system/services/elasticsearch-logging/proxy/` if suitable credentials are passed, or through a kubectl proxy at, for example:
`http://localhost:8080/api/v1/namespaces/kube-system/services/elasticsearch-logging/proxy/`.
(See [above](#accessing-the-cluster-api) for how to pass credentials or use kubectl proxy.)

-->

这显示了访问每个服务的代理 URL。

例如，此集群启用了集群级日志记录（使用Elasticsearch），如果传入合适的凭据，可以在该地址 `https://104.197.5.247/api/v1/namespaces/kube-system/services/elasticsearch-logging/proxy/`  访问到，或通过 kubectl 代理，例如：`http://localhost:8080/api/v1/namespaces/kube-system/services/elasticsearch-logging/proxy/`。

（有关如何传递凭据和使用 kubectl 代理，请 [参阅上文](#accessing-the-cluster-api)）

<!--

#### Manually constructing apiserver proxy URLs

As mentioned above, you use the `kubectl cluster-info` command to retrieve the service's proxy URL. To create proxy URLs that include service endpoints, suffixes, and parameters, you simply append to the service's proxy URL:
`http://`*`kubernetes_master_address`*`/api/v1/namespaces/`*`namespace_name`*`/services/`*`service_name[:port_name]`*`/proxy`

If you haven't specified a name for your port, you don't have to specify *port_name* in the URL
-->

#### 手动构建 apiserver 代理 URL

如上所述，您可以使用 `kubectl cluster-info` 命令来检索服务的代理 URL。要创建包含服务端点、后缀和参数的代理 URL，您只需附加到服务的代理URL：

`http://`*`kubernetes_master_address`*`/api/v1/namespaces/`*`namespace_name`*`/services/`*`service_name[:port_name]`*`/proxy`

如果您没有指定 port 的名字，那么您不必在 URL 里指定 port_name。

<!--


##### Examples

* To access the Elasticsearch service endpoint `_search?q=user:kimchy`, you would use:   `http://104.197.5.247/api/v1/namespaces/kube-system/services/elasticsearch-logging/proxy/_search?q=user:kimchy`
* To access the Elasticsearch cluster health information `_cluster/health?pretty=true`, you would use:   `https://104.197.5.247/api/v1/namespaces/kube-system/services/elasticsearch-logging/proxy/_cluster/health?pretty=true`

-->

##### 示例

- 要想访问 Elasticsearch 的服务端点 `_search?q=user:kimchy`，您需要使用：`http://104.197.5.247/api/v1/namespaces/kube-system/services/elasticsearch-logging/proxy/_search?q=user:kimchy`
- 要想访问 Elasticsearch 的集群健康信息 `_cluster/health?pretty=true`，您需要使用：`https://104.197.5.247/api/v1/namespaces/kube-system/services/elasticsearch-logging/proxy/_cluster/health?pretty=true`

```json
  {
    "cluster_name" : "kubernetes_logging",
    "status" : "yellow",
    "timed_out" : false,
    "number_of_nodes" : 1,
    "number_of_data_nodes" : 1,
    "active_primary_shards" : 5,
    "active_shards" : 5,
    "relocating_shards" : 0,
    "initializing_shards" : 0,
    "unassigned_shards" : 5
  }
```

<!--

#### Using web browsers to access services running on the cluster

You may be able to put an apiserver proxy url into the address bar of a browser. However:

- Web browsers cannot usually pass tokens, so you may need to use basic (password) auth.  Apiserver can be configured to accept basic auth,
    but your cluster may not be configured to accept basic auth.
- Some web apps may not work, particularly those with client side javascript that construct urls in a
    way that is unaware of the proxy path prefix.

-->

#### 使用 web 浏览器来访问集群中运行的服务

您可以将 apiserver 代理网址放在浏览器的地址栏中。 然而：

- Web 浏览器通常不能传递 token，因此您可能需要使用基本（密码）认证。 Apiserver 可以配置为接受基本认证，但您的集群可能未配置为接受基本认证。
- 某些网络应用程序可能无法正常工作，特别是那些在不知道代理路径前缀的情况下构造 URL 的客户端 JavaScript。

<!--

## Requesting redirects

The redirect capabilities have been deprecated and removed.  Please use a proxy (see below) instead.
-->

## 请求重定向

重定向功能已被弃用和删除。 请改用代理（见下文）。

<!--

## So Many Proxies

There are several different proxies you may encounter when using Kubernetes:

    1. The [kubectl proxy](#directly-accessing-the-rest-api):
    - runs on a user's desktop or in a pod
    - proxies from a localhost address to the Kubernetes apiserver
    - client to proxy uses HTTP
    - proxy to apiserver uses HTTPS
    - locates apiserver
    - adds authentication headers
    2. The [apiserver proxy](#discovering-builtin-services):
    - is a bastion built into the apiserver
    - connects a user outside of the cluster to cluster IPs which otherwise might not be reachable
    - runs in the apiserver processes
    - client to proxy uses HTTPS (or http if apiserver so configured)
    - proxy to target may use HTTP or HTTPS as chosen by proxy using available information
    - can be used to reach a Node, Pod, or Service
    - does load balancing when used to reach a Service
    3. The [kube proxy](/docs/user-guide/services/#ips-and-vips):
    - runs on each node
    - proxies UDP and TCP
    - does not understand HTTP
    - provides load balancing
    - is just used to reach services
    4. A Proxy/Load-balancer in front of apiserver(s):
    - existence and implementation varies from cluster to cluster (e.g. nginx)
    - sits between all clients and one or more apiservers
    - acts as load balancer if there are several apiservers.
    5. Cloud Load Balancers on external services:
    - are provided by some cloud providers (e.g. AWS ELB, Google Cloud Load Balancer)
    - are created automatically when the Kubernetes service has type `LoadBalancer`
    - use UDP/TCP only
    - implementation varies by cloud provider.

Kubernetes users will typically not need to worry about anything other than the first two types.  The cluster admin
will typically ensure that the latter types are setup correctly.

-->
## 多种代理

在使用 kubernetes 的时候您可能会遇到许多种不同的代理：

1. [kubectl 代理](#directly-accessing-the-rest-api)：

   - 在用户桌面或 pod 中运行
   - 从 localhost 地址到 Kubernetes apiserver 的代理
   - 客户端到代理使用 HTTP
   - apiserver 的代理使用 HTTPS
   - 定位 apiserver
   - 添加身份验证 header
2. [apiserver 代理](#discovering-builtin-services)：
   - 将一个堡垒机作为 apiserver
   - 将集群之外的用户连接到集群IP，否则可能无法访问
   - 在 apiserver 进程中运行
   - 客户端到代理使用 HTTPS（或 http，如果 apiserver 如此配置）
   - 根据代理目标的可用信息由代理选择使用 HTTP 或 HTTPS
   - 可用于访问 node、pod 或 service
   - 用于访问 service 时进行负载均衡
3. [kube 代理](/docs/user-guide/services/#ips-and-vips)：
   - 在每个节点上运行
   - 代理 UDP 和 TCP
   - 不支持 HTTP
   - 提供负载均衡
   - 只是用来访问 service
4. apiserver 前面的代理/负载均衡器：
   - 存在和实现因集群而异（例如 nginx）
   - 位于所有客户端和一个或多个 apiserver 之间
   - 作为负载均衡器，如果有多个 apiserver
5. 外部服务的云负载均衡器：
   - 由一些云提供商提供（例如 AWS ELB，Google Cloud Load Balancer）
   - 当 Kubernetes service 类型为 LoadBalancer 时，会自动创建
   - 仅使用 UDP/TCP
   - 实施方式因云提供商而异
