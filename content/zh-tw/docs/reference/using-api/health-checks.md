---
title: Kubernetes API 健康端點
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
Kubernetes {{< glossary_tooltip term_id="kube-apiserver" text="API 服務器" >}} 提供 API 端點以指示 API 服務器的當前狀態。
本文描述了這些 API 端點，並說明如何使用。

<!-- body -->

<!-- ## API endpoints for health -->
## API 健康端點  {#api-endpoints-for-health}

<!-- 
The Kubernetes API server provides 3 API endpoints (`healthz`, `livez` and `readyz`) to indicate the current status of the API server.
The `healthz` endpoint is deprecated (since Kubernetes v1.16), and you should use the more specific `livez` and `readyz` endpoints instead.
The `livez` endpoint can be used with the `--livez-grace-period` [flag](/docs/reference/command-line-tools-reference/kube-apiserver) to specify the startup duration.
For a graceful shutdown you can specify the `--shutdown-delay-duration` [flag](/docs/reference/command-line-tools-reference/kube-apiserver) with the `/readyz` endpoint.
Machines that check the `healthz`/`livez`/`readyz` of the API server should rely on the HTTP status code.
A status code `200` indicates the API server is `healthy`/`live`/`ready`, depending on the called endpoint.
The more verbose options shown below are intended to be used by human operators to debug their cluster or understand the state of the API server.
-->
Kubernetes API 服務器提供 3 個 API 端點（`healthz`、`livez` 和 `readyz`）來表明 API 服務器的當前狀態。
`healthz` 端點已被棄用（自 Kubernetes v1.16 起），你應該使用更爲明確的 `livez` 和 `readyz` 端點。
`livez` 端點可與 `--livez-grace-period` [標誌](/zh-cn/docs/reference/command-line-tools-reference/kube-apiserver)一起使用，來指定啓動持續時間。
爲了正常關機，你可以使用 `/readyz` 端點並指定 `--shutdown-delay-duration` [標誌](/zh-cn/docs/reference/command-line-tools-reference/kube-apiserver)。
檢查 API 服務器的 `healthz`/`livez`/`readyz` 端點的機器應依賴於 HTTP 狀態代碼。
狀態碼 `200` 表示 API 服務器是 `healthy`、`live` 還是 `ready`，具體取決於所調用的端點。
以下更詳細的選項供操作人員使用，用來調試其集羣或瞭解 API 服務器的狀態。

<!-- The following examples will show how you can interact with the health API endpoints. -->
以下示例將顯示如何與運行狀況 API 端點進行交互。

<!-- 
For all endpoints, you can use the `verbose` parameter to print out the checks and their status.
This can be useful for a human operator to debug the current status of the API server, it is not intended to be consumed by a machine:
-->
對於所有端點，都可以使用 `verbose` 參數來打印檢查項以及檢查狀態。
這對於操作人員調試 API 服務器的當前狀態很有用，這些不打算給機器使用：

```shell
curl -k https://localhost:6443/livez?verbose
```

<!-- or from a remote host with authentication: -->
或從具有身份驗證的遠程主機：

```shell
kubectl get --raw='/readyz?verbose'
```

<!-- The output will look like this: -->
輸出將如下所示：

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
Kubernetes API 服務器也支持排除特定的檢查項。
查詢參數也可以像以下示例一樣進行組合：

```shell
curl -k 'https://localhost:6443/readyz?verbose&exclude=etcd'
```

<!-- The output show that the `etcd` check is excluded: -->
輸出顯示排除了 `etcd` 檢查：

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
## 獨立健康檢查  {#individual-health-check}

{{< feature-state state="alpha" >}}

<!-- 
Each individual health check exposes an HTTP endpoint and can be checked individually.
The schema for the individual health checks is `/livez/<healthcheck-name>` or `/readyz/<healthcheck-name>`, where `livez` and `readyz` can be used to indicate if you want to check the liveness or the readiness of the API server, respectively.
The `<healthcheck-name>` path can be discovered using the `verbose` flag from above and take the path between `[+]` and `ok`.
These individual health checks should not be consumed by machines but can be helpful for a human operator to debug a system:
-->
每個單獨的健康檢查都會公開一個 HTTP 端點，並且可以單獨檢查。
單個運行狀況檢查的模式爲 `/livez/<healthcheck-name>` 或 `/readyz/<healthcheck-name>`，
其中 `livez` 和 `readyz` 分別表明你要檢查的是 API 服務器是否存活或就緒。
`<healthcheck-name>` 的路徑可以通過上面的 `verbose` 參數發現 ，並採用 `[+]` 和 `ok` 之間的路徑。
這些單獨的健康檢查不應由機器使用，但對於操作人員調試系統而言，是有幫助的：

```shell
curl -k https://localhost:6443/livez/etcd
```
