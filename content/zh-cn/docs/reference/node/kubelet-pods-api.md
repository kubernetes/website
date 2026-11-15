---
content_type: "reference"
title: Kubelet Pods API
weight: 20
---

{{< feature-state feature_gate_name="PodsAPI" >}}

<!--
The Kubelet Pods API provides a way for Node-local components to query information about {{< glossary_tooltip text="Pods" term_id="pod" >}} running on the {{< glossary_tooltip term_id="Node" >}} directly from the `kubelet`. This increases reliability by removing the dependency on the Kubernetes API server for node-local information and reduces load on the {{< glossary_tooltip text="control plane" term_id="control-plane" >}}.

Access to this API is restricted to local admin users (typically `root`) through file permissions on the UNIX socket.
-->
Kubelet Pods API 为节点本地组件提供了一种直接从 `kubelet` 查询在
{{< glossary_tooltip text="节点" term_id="node" >}}上运行的
{{< glossary_tooltip text="Pod" term_id="pod" >}} 信息的方法。
这通过移除对 Kubernetes API 服务器的节点本地信息依赖来提高可靠性，
并减少{{< glossary_tooltip text="控制平面" term_id="control-plane" >}}的负载。

通过 UNIX 套接字上的文件权限，该 API 的访问权限被限制为本地管理员用户（通常为 `root`）。

<!--
## Endpoint {#endpoint}

The API listens on a UNIX socket at:
`/var/lib/kubelet/pods-api/pods-api.sock`
-->
## 端点 {#endpoint}

API 在以下 UNIX 套接字上监听：
`/var/lib/kubelet/pods-api/pods-api.sock`

{{< note >}}
<!--
This API is not supported on Windows nodes.
-->
此 API 在 Windows 节点上不受支持。
{{< /note >}}

<!--
## Operations {#operations}

The API provides the following gRPC methods:
-->
## 操作 {#operations}

API 提供以下 gRPC 方法：

### `ListPods` {#list-pods}
<!--
Returns a list of all pods currently managed by the kubelet on the node.
-->
返回 kubelet 在节点上当前管理的所有 Pod 列表。

### `WatchPods` {#watch-pods}
<!--
Returns a stream of pod updates. Whenever a pod's state changes locally, the kubelet sends the updated pod information through the stream.
-->
返回 Pod 更新流。每当 Pod 的状态在本地发生变化时，kubelet
会通过该流发送更新后的 Pod 信息。

### `GetPod` {#get-pod}
<!--
Returns information for a specific pod identified by its UID.
-->
返回由 UID 标识的特定 Pod 的信息。

<!--
## API Definition {#api-definition}

The API uses the following protobuf definition:
-->
## API 定义 {#api-definition}

API 使用以下 protobuf 定义：

<!--
```protobuf
import "google/protobuf/field_mask.proto";
import "k8s.io/api/core/v1/generated.proto";

service Pods {
    // ListPods returns a list of v1.Pod, optionally filtered by field mask.
    rpc ListPods(PodListRequest) returns (PodListResponse) {}
    // WatchPods returns a stream of Pod updates, optionally filtered by field mask.
    rpc WatchPods(PodWatchRequest) returns (stream PodWatchResponse) {}
    // GetPod returns a v1.Pod for a given pod's UID, optionally filtered by field mask.
    rpc GetPod(PodGetRequest) returns (PodGetResponse) {}
}

message PodListRequest {
    // Optional field mask in the gRPC metadata, to specify which pod fields to return.
}

message PodListResponse {
    repeated v1.Pod pods = 1;
}

message PodWatchRequest {
    // Optional field mask in the gRPC metadata, to specify which pod fields to return.
}

message PodWatchResponse {
    v1.Pod pod = 1;
}

message PodGetRequest {
    string podUID = 1;
    // Optional field mask in the gRPC metadata, to specify which pod fields to return.
}

message PodGetResponse {
    v1.Pod pod = 1;
}
```
-->
```protobuf
import "google/protobuf/field_mask.proto";
import "k8s.io/api/core/v1/generated.proto";

service Pods {
    // ListPods 返回 v1.Pod 列表，可选地按字段掩码过滤。
    rpc ListPods(PodListRequest) returns (PodListResponse) {}
    // WatchPods 返回 Pod 更新流，可选地按字段掩码过滤。
    rpc WatchPods(PodWatchRequest) returns (stream PodWatchResponse) {}
    // GetPod 返回给定 Pod UID 的 v1.Pod，可选地按字段掩码过滤。
    rpc GetPod(PodGetRequest) returns (PodGetResponse) {}
}

message PodListRequest {
    // gRPC 元数据中的可选字段掩码，用于指定要返回的 Pod 字段。
}

message PodListResponse {
    repeated v1.Pod pods = 1;
}

message PodWatchRequest {
    // gRPC 元数据中的可选字段掩码，用于指定要返回的 Pod 字段。
}

message PodWatchResponse {
    v1.Pod pod = 1;
}

message PodGetRequest {
    string podUID = 1;
    // gRPC 元数据中的可选字段掩码，用于指定要返回的 Pod 字段。
}

message PodGetResponse {
    v1.Pod pod = 1;
}
```

<!--
## Field selection {#field-selection}

The API supports `google.protobuf.FieldMask` to allow clients to request only the specific fields they need (e.g., `status.phase`, `status.podIPs`). This enables lean and efficient data transfer. If no field mask is provided, the full `v1.Pod` object is returned.
-->
## 字段选择 {#field-selection}

API 支持 `google.protobuf.FieldMask`，允许客户端仅请求他们需要的特定字段（例如 `status.phase`、`status.podIPs`）。
这实现了精简和高效的数据传输。如果未提供字段掩码，则返回完整的 `v1.Pod` 对象。

<!--
## Reliability and availability {#reliability}

The API serves the most up-to-date information known locally by the kubelet, derived from its internal cache and reconciliation with the container runtime. It remains available even if the node loses connectivity to the Kubernetes control plane.

If the kubelet's pod sources have not finished their initial synchronization yet (for example, right after the kubelet starts or restarts), every operation returns a gRPC `FAILED_PRECONDITION` error instead of incomplete data. Once synchronization completes, requests are served normally.
-->
## 可靠性和可用性 {#reliability}

API 提供 kubelet 本地已知的最新的信息，这些信息来自其内部缓存以及与容器运行时的协调。
即使节点失去与 Kubernetes 控制平面的连接，该 API 仍然可用。

如果 kubelet 的 Pod 数据源尚未完成初始同步（例如，在 kubelet 启动或重启之后立即发起请求），
则每个操作都会返回 gRPC `FAILED_PRECONDITION` 错误，而不是返回不完整的数据。
一旦同步完成，请求即可正常得到处理。

<!--
## Rate limiting {#rate-limiting}

The `kubelet` rate-limits `ListPods` and `GetPod` requests to protect itself from excessive load. By default, the server allows `100` queries per second with a burst of `10` tokens. Requests that exceed this limit receive a gRPC `RESOURCE_EXHAUSTED` error.

`WatchPods` streams are not subject to this rate limit; instead, a slow consumer that falls behind on its event stream has its watch connection dropped (see [Metrics](#metrics)).
-->
## 速率限制 {#rate-limiting}

`kubelet` 对 `ListPods` 和 `GetPod` 请求进行速率限制，以保护自身免受过载影响。
默认情况下，服务器允许每秒 `100` 次查询，突发容量为 `10` 个令牌。
超过此限制的请求会收到 gRPC `RESOURCE_EXHAUSTED` 错误。

`WatchPods` 流不受此速率限制；相反，如果慢速消费者在其事件流上落后，
其 watch 连接会被断开（参见[指标](#metrics)）。

<!--
## Metrics {#metrics}

The `kubelet` exposes the following metrics for the Pods API, with labels `server_api_version` and `status_code`:

* `kubelet_pod_requests_total`: cumulative number of requests to the API.
* `kubelet_pod_requests_list_total`: number of requests to the `ListPods` endpoint.
* `kubelet_pod_requests_get_total`: number of requests to the `GetPod` endpoint.
* `kubelet_pod_requests_watch_total`: number of requests to the `WatchPods` endpoint.

The `kubelet` also exposes `kubelet_pod_watch_events_dropped_total`, which counts watch events dropped because a client was not consuming its event stream quickly enough.
-->
## 指标 {#metrics}

`kubelet` 为 Pods API 暴露以下指标，这些指标带有 `server_api_version` 和 `status_code` 标签：

* `kubelet_pod_requests_total`：对该 API 的请求累计次数。
* `kubelet_pod_requests_list_total`：对 `ListPods` 端点的请求次数。
* `kubelet_pod_requests_get_total`：对 `GetPod` 端点的请求次数。
* `kubelet_pod_requests_watch_total`：对 `WatchPods` 端点的请求次数。

`kubelet` 还暴露 `kubelet_pod_watch_events_dropped_total` 指标，
用于统计因客户端未能足够快地消费其事件流而被丢弃的 watch 事件数量。
