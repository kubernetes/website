---
title: 從 Pod 中訪問 Kubernetes API
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
本指南演示瞭如何從 Pod 中訪問 Kubernetes API。

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

<!-- steps -->

<!--
## Accessing the API from within a Pod

When accessing the API from within a Pod, locating and authenticating
to the API server are slightly different to the external client case.
-->
### 從 Pod 中訪問 API   {#accessing-the-api-from-within-a-pod}

從 Pod 內部訪問 API 時，定位 API 伺服器和向伺服器認證身份的操作與外部客戶端場景不同。

<!--
The easiest way to use the Kubernetes API from a Pod is to use
one of the official [client libraries](/docs/reference/using-api/client-libraries/). These
libraries can automatically discover the API server and authenticate.
-->
從 Pod 使用 Kubernetes API 的最簡單的方法就是使用官方的
[客戶端庫](/zh-cn/docs/reference/using-api/client-libraries/)。
這些庫可以自動發現 API 伺服器並進行身份驗證。

<!--
### Using Official Client Libraries

From within a Pod, the recommended ways to connect to the Kubernetes API are:
-->
#### 使用官方客戶端庫   {#using-official-client-libraries}

從一個 Pod 內部連接到 Kubernetes API 的推薦方式爲：

<!--
- For a Go client, use the official
  [Go client library](https://github.com/kubernetes/client-go/).
  The `rest.InClusterConfig()` function handles API host discovery and authentication automatically.
  See [an example here](https://git.k8s.io/client-go/examples/in-cluster-client-configuration/main.go).

- For a Python client, use the official
  [Python client library](https://github.com/kubernetes-client/python/).
  The `config.load_incluster_config()` function handles API host discovery and authentication automatically.
  See [an example here](https://github.com/kubernetes-client/python/blob/master/examples/in_cluster_config.py).

- There are a number of other libraries available, please refer to the
  [Client Libraries](/docs/reference/using-api/client-libraries/) page.
-->
- 對於 Go 語言客戶端，使用官方的 [Go 客戶端庫](https://github.com/kubernetes/client-go/)。
  函數 `rest.InClusterConfig()` 自動處理 API 主機發現和身份認證。
  參見[這裏的一個例子](https://git.k8s.io/client-go/examples/in-cluster-client-configuration/main.go)。

- 對於 Python 客戶端，使用官方的 [Python 客戶端庫](https://github.com/kubernetes-client/python/)。
  函數 `config.load_incluster_config()` 自動處理 API 主機的發現和身份認證。
  參見[這裏的一個例子](https://github.com/kubernetes-client/python/blob/master/examples/in_cluster_config.py)。

- 還有一些其他可用的客戶端庫，請參閱[客戶端庫](/zh-cn/docs/reference/using-api/client-libraries/)頁面。

<!--
In each case, the service account credentials of the Pod are used to communicate
securely with the API server.
-->
在以上場景中，客戶端庫都使用 Pod 的服務賬號憑據來與 API 伺服器安全地通信。

<!--
### Directly accessing the REST API

While running in a Pod, your container can create an HTTPS URL for the Kubernetes API
server by fetching the `KUBERNETES_SERVICE_HOST` and `KUBERNETES_SERVICE_PORT_HTTPS`
environment variables. The API server's in-cluster address is also published to a
Service named `kubernetes` in the `default` namespace so that pods may reference
`kubernetes.default.svc` as a DNS name for the local API server.
-->
#### 直接訪問 REST API   {#directly-accessing-the-rest-api}

在運行在 Pod 中時，你的容器可以通過獲取 `KUBERNETES_SERVICE_HOST` 和
`KUBERNETES_SERVICE_PORT_HTTPS` 環境變量爲 Kubernetes API
伺服器生成一個 HTTPS URL。
API 伺服器的叢集內地址也發佈到 `default` 命名空間中名爲 `kubernetes` 的 Service 中，
從而 Pod 可以引用 `kubernetes.default.svc` 作爲本地 API 伺服器的 DNS 名稱。

{{< note >}}
<!--
Kubernetes does not guarantee that the API server has a valid certificate for
the hostname `kubernetes.default.svc`;
however, the control plane **is** expected to present a valid certificate for the
hostname or IP address that `$KUBERNETES_SERVICE_HOST` represents.
-->
Kubernetes 不保證 API 伺服器具有主機名 `kubernetes.default.svc` 的有效證書；
但是，控制平面應該爲 `$KUBERNETES_SERVICE_HOST` 代表的主機名或 IP 地址提供有效證書。
{{< /note >}}

<!--
The recommended way to authenticate to the API server is with a
[service account](/docs/tasks/configure-pod-container/configure-service-account/)
credential. By default, a Pod
is associated with a service account, and a credential (token) for that
service account is placed into the filesystem tree of each container in that Pod,
at `/var/run/secrets/kubernetes.io/serviceaccount/token`.
-->
向 API 伺服器進行身份認證的推薦做法是使用
[服務賬號](/zh-cn/docs/tasks/configure-pod-container/configure-service-account/)憑據。
默認情況下，每個 Pod 與一個服務賬號關聯，該服務賬號的憑據（令牌）放置在此 Pod
中每個容器的文件系統樹中的 `/var/run/secrets/kubernetes.io/serviceaccount/token` 處。

<!--
If available, a certificate bundle is placed into the filesystem tree of each
container at `/var/run/secrets/kubernetes.io/serviceaccount/ca.crt`, and should be
used to verify the serving certificate of the API server.
-->
如果證書包可用，則憑據包被放入每個容器的文件系統樹中的
`/var/run/secrets/kubernetes.io/serviceaccount/ca.crt` 處，
且將被用於驗證 API 伺服器的服務證書。

<!--
Finally, the default namespace to be used for namespaced API operations is placed in a file
at `/var/run/secrets/kubernetes.io/serviceaccount/namespace` in each container.
-->
最後，用於命名空間域 API 操作的默認命名空間放置在每個容器中的
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

如果你希望不使用官方客戶端庫就完成 API 查詢，可以將 `kubectl proxy` 作爲
[command](/zh-cn/docs/tasks/inject-data-application/define-command-argument-container/)
在 Pod 中啓動一個邊車（Sidecar）容器。這樣，`kubectl proxy` 自動完成對 API
的身份認證，並將其暴露到 Pod 的 `localhost` 接口，從而 Pod
中的其他容器可以直接使用 API。

<!--
### Without using a proxy

It is possible to avoid using the kubectl proxy by passing the authentication token
directly to the API server. The internal certificate secures the connection.
-->
### 不使用代理   {#without-using-a-proxy}

通過將認證令牌直接發送到 API 伺服器，也可以避免運行 kubectl proxy 命令。
內部的證書機制能夠爲連接提供保護。

<!--
# Point to the internal API server hostname
APISERVER=https://kubernetes.default.svc

# Path to ServiceAccount token
SERVICEACCOUNT=/var/run/secrets/kubernetes.io/serviceaccount

# Read this Pod's namespace
NAMESPACE=$(cat ${SERVICEACCOUNT}/namespace)

# Read the ServiceAccount bearer token
TOKEN=$(cat ${SERVICEACCOUNT}/token)

# Reference the internal certificate authority (CA)
CACERT=${SERVICEACCOUNT}/ca.crt

# Explore the API with TOKEN
curl --cacert ${CACERT} --header "Authorization: Bearer ${TOKEN}" -X GET ${APISERVER}/api
-->
```shell
# 指向內部 API 伺服器的主機名
APISERVER=https://kubernetes.default.svc

# 服務賬號令牌的路徑
SERVICEACCOUNT=/var/run/secrets/kubernetes.io/serviceaccount

# 讀取 Pod 的名字空間
NAMESPACE=$(cat ${SERVICEACCOUNT}/namespace)

# 讀取服務賬號的持有者令牌
TOKEN=$(cat ${SERVICEACCOUNT}/token)

# 引用內部證書機構（CA）
CACERT=${SERVICEACCOUNT}/ca.crt

# 使用令牌訪問 API
curl --cacert ${CACERT} --header "Authorization: Bearer ${TOKEN}" -X GET ${APISERVER}/api
```

<!--
The output will be similar to this:
-->
輸出類似於：

```json
{
  "kind": "APIVersions",
  "versions": ["v1"],
  "serverAddressByClientCIDRs": [
    {
      "clientCIDR": "0.0.0.0/0",
      "serverAddress": "10.0.1.149:443"
    }
  ]
}
```
