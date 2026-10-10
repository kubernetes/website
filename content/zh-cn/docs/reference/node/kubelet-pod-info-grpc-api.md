---
content_type: "reference"
title: Kubelet Pod Info gRPC API
weight: 20
---

{{< feature-state feature_gate_name="PodInfoAPI" >}}

<!--
The Kubelet Pod Info gRPC API provides a way for node-local components to query information about pods running on the node directly from the kubelet. This increases reliability by removing the dependency on the Kubernetes API server for node-local information and reduces load on the control plane.

Access to this API is restricted to local admin users (typically `root`) through file permissions on the UNIX socket.
-->
Kubelet Pod Info gRPC API 为节点本地组件提供了一种直接从 kubelet 查询节点上运行的 Pod 信息的方法。
这通过移除对 Kubernetes API 服务器的节点本地信息依赖来提高可靠性，并减少控制平面的负载。

通过 UNIX 套接字上的文件权限，该 API 的访问权限被限制为本地管理员用户（通常为 `root`）。

<!--
## endpoint
-->
## 端点

<!--
The API listens on a UNIX socket at:
`/var/lib/kubelet/pods/kubelet.sock`
-->
API 在以下 UNIX 套接字上监听：
`/var/lib/kubelet/pods/kubelet.sock`

{{< note >}}
<!--
This API is not supported on Windows nodes.
-->
此 API 在 Windows 节点上不受支持。
{{< /note >}}

<!--
## operations
-->
## 操作

<!--
The API provides the following gRPC methods:
-->
API 提供以下 gRPC 方法：

### `ListPods`    {#list-pods}
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

### `GetPod`    {#get-pod}

<!--
Returns information for a specific pod identified by its UID.
-->
返回由 UID 标识的特定 Pod 的信息。

<!--
## api definition
-->
## API 定义    {#api-definition}

<!--
The API uses the following protobuf definition:
-->
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
## field selection
-->
## 字段选择

<!--
The API supports `google.protobuf.FieldMask` to allow clients to request only the specific fields they need (e.g., `status.phase`, `status.podIPs`). This enables lean and efficient data transfer. If no field mask is provided, the full `v1.Pod` object is returned.
-->
API 支持 `google.protobuf.FieldMask`，允许客户端仅请求他们需要的特定字段（例如 `status.phase`、`status.podIPs`）。
这实现了精简和高效的数据传输。如果未提供字段掩码，则返回完整的 `v1.Pod` 对象。

<!--
## Reliability and availability 
-->
## 可靠性和可用性    {#reliability}

<!--
The API serves the most up-to-date information known locally by the kubelet, derived from its internal cache and reconciliation with the container runtime. It remains available even if the node loses connectivity to the Kubernetes control plane.

If the kubelet has recently restarted and its internal state is not yet fully initialized, the API returns a gRPC `FAILED_PRECONDITION` error.
-->
API 提供 kubelet 本地已知的最新的信息，这些信息来自其内部缓存以及与容器运行时的协调。
即使节点失去与 Kubernetes 控制平面的连接，该 API 仍然可用。

如果 kubelet 最近重启且其内部状态尚未完全初始化，API 会返回 gRPC `FAILED_PRECONDITION` 错误。
