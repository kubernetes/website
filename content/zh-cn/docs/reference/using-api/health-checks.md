---
title: Kubernetes API 健康端点
content_type: concept
weight: 50
---
<!-- 
title: Kubernetes API health endpoints
reviewers:
- logicalhan
content_type: concept
weight: 50
 -->

<!-- overview -->
<!-- 
The Kubernetes {{< glossary_tooltip term_id="kube-apiserver" text="API server" >}} provides API endpoints to indicate the current status of the API server.
This page describes these API endpoints and explains how you can use them. 
-->
Kubernetes {{< glossary_tooltip term_id="kube-apiserver" text="API 服务器" >}} 提供 API 端点以指示 API 服务器的当前状态。
本文描述了这些 API 端点，并说明如何使用。

<!-- body -->

<!-- ## API endpoints for health -->
## API 健康端点  {#api-endpoints-for-health}

<!-- 
The Kubernetes API server provides 3 API endpoints (`healthz`, `livez` and `readyz`) to indicate the current status of the API server.
The `healthz` endpoint is deprecated (since Kubernetes v1.16), and you should use the more specific `livez` and `readyz` endpoints instead.
The `livez` endpoint can be used with the `--livez-grace-period` [flag](/docs/reference/command-line-tools-reference/kube-apiserver) to specify the startup duration.
For a graceful shutdown you can specify the `--shutdown-delay-duration` [flag](/docs/reference/command-line-tools-reference/kube-apiserver) with the `/readyz` endpoint.
Machines that check the `healthz`/`livez`/`readyz` of the API server should rely on the HTTP status code.
A status code `200` indicates the API server is `healthy`/`live`/`ready`, depending on the called endpoint.
The more verbose options shown below are intended to be used by human operators to debug their cluster or understand the state of the API server.
-->
Kubernetes API 服务器提供 3 个 API 端点（`healthz`、`livez` 和 `readyz`）来表明 API 服务器的当前状态。
`healthz` 端点已被弃用（自 Kubernetes v1.16 起），你应该使用更为明确的 `livez` 和 `readyz` 端点。
`livez` 端点可与 `--livez-grace-period` [标志](/zh-cn/docs/reference/command-line-tools-reference/kube-apiserver)一起使用，来指定启动持续时间。
为了正常关机，你可以使用 `/readyz` 端点并指定 `--shutdown-delay-duration` [标志](/zh-cn/docs/reference/command-line-tools-reference/kube-apiserver)。
检查 API 服务器的 `healthz`/`livez`/`readyz` 端点的机器应依赖于 HTTP 状态代码。
状态码 `200` 表示 API 服务器是 `healthy`、`live` 还是 `ready`，具体取决于所调用的端点。
以下更详细的选项供操作人员使用，用来调试其集群或了解 API 服务器的状态。

<!-- The following examples will show how you can interact with the health API endpoints. -->
以下示例将显示如何与运行状况 API 端点进行交互。

<!-- 
For all endpoints, you can use the `verbose` parameter to print out the checks and their status.
This can be useful for a human operator to debug the current status of the API server, it is not intended to be consumed by a machine:
-->
对于所有端点，都可以使用 `verbose` 参数来打印检查项以及检查状态。
这对于操作人员调试 API 服务器的当前状态很有用，这些不打算给机器使用：

```shell
curl -k https://localhost:6443/livez?verbose
```

<!-- or from a remote host with authentication: -->
或从具有身份验证的远程主机：

```shell
kubectl get --raw='/readyz?verbose'
```

<!-- The output will look like this: -->
输出将如下所示：

```
[+]ping ok
[+]log ok
[+]etcd ok
[+]poststarthook/start-kube-apiserver-admission-initializer ok
[+]poststarthook/generic-apiserver-start-informers ok
[+]poststarthook/start-apiextensions-informers ok
[+]poststarthook/start-apiextensions-controllers ok
[+]poststarthook/crd-informer-synced ok
[+]poststarthook/bootstrap-controller ok
[+]poststarthook/rbac/bootstrap-roles ok
[+]poststarthook/scheduling/bootstrap-system-priority-classes ok
[+]poststarthook/start-cluster-authentication-info-controller ok
[+]poststarthook/start-kube-aggregator-informers ok
[+]poststarthook/apiservice-registration-controller ok
[+]poststarthook/apiservice-status-available-controller ok
[+]poststarthook/kube-apiserver-autoregistration ok
[+]autoregister-completion ok
[+]poststarthook/apiservice-openapi-controller ok
healthz check passed
```

<!-- 
The Kubernetes API server also supports to exclude specific checks.
The query parameters can also be combined like in this example:
-->
Kubernetes API 服务器也支持排除特定的检查项。
查询参数也可以像以下示例一样进行组合：

```shell
curl -k 'https://localhost:6443/readyz?verbose&exclude=etcd'
```

<!-- The output show that the `etcd` check is excluded: -->
输出显示排除了 `etcd` 检查：

```
[+]ping ok
[+]log ok
[+]etcd excluded: ok
[+]poststarthook/start-kube-apiserver-admission-initializer ok
[+]poststarthook/generic-apiserver-start-informers ok
[+]poststarthook/start-apiextensions-informers ok
[+]poststarthook/start-apiextensions-controllers ok
[+]poststarthook/crd-informer-synced ok
[+]poststarthook/bootstrap-controller ok
[+]poststarthook/rbac/bootstrap-roles ok
[+]poststarthook/scheduling/bootstrap-system-priority-classes ok
[+]poststarthook/start-cluster-authentication-info-controller ok
[+]poststarthook/start-kube-aggregator-informers ok
[+]poststarthook/apiservice-registration-controller ok
[+]poststarthook/apiservice-status-available-controller ok
[+]poststarthook/kube-apiserver-autoregistration ok
[+]autoregister-completion ok
[+]poststarthook/apiservice-openapi-controller ok
[+]shutdown ok
healthz check passed
```

<!-- ## Individual health checks -->
## 独立健康检查  {#individual-health-check}

{{< feature-state state="alpha" >}}

<!-- 
Each individual health check exposes an HTTP endpoint and can be checked individually.
The schema for the individual health checks is `/livez/<healthcheck-name>` or `/readyz/<healthcheck-name>`, where `livez` and `readyz` can be used to indicate if you want to check the liveness or the readiness of the API server, respectively.
The `<healthcheck-name>` path can be discovered using the `verbose` flag from above and take the path between `[+]` and `ok`.
These individual health checks should not be consumed by machines but can be helpful for a human operator to debug a system:
-->
每个单独的健康检查都会公开一个 HTTP 端点，并且可以单独检查。
单个运行状况检查的模式为 `/livez/<healthcheck-name>` 或 `/readyz/<healthcheck-name>`，
其中 `livez` 和 `readyz` 分别表明你要检查的是 API 服务器是否存活或就绪。
`<healthcheck-name>` 的路径可以通过上面的 `verbose` 参数发现 ，并采用 `[+]` 和 `ok` 之间的路径。
这些单独的健康检查不应由机器使用，但对于操作人员调试系统而言，是有帮助的：

```shell
curl -k https://localhost:6443/livez/etcd
```
