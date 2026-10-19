---
content_type: "reference"
title: Kubelet Pods API
weight: 20
---

{{< feature-state feature_gate_name="PodsAPI" >}}

The Kubelet Pods API provides a way for Node-local components to query information about {{< glossary_tooltip text="Pods" term_id="pod" >}} running on the {{< glossary_tooltip term_id="Node" >}} directly from the `kubelet`. This increases reliability by removing the dependency on the Kubernetes API server for node-local information and reduces load on the {{< glossary_tooltip text="control plane" term_id="control-plane" >}}.

Access to this API is restricted to local admin users (typically `root`) through file permissions on the UNIX socket.

## Endpoint {#endpoint}

The API listens on a UNIX socket at:
`/var/lib/kubelet/pods-api/pods-api.sock`

{{< note >}}
This API is not supported on Windows nodes.
{{< /note >}}

## Operations {#operations}

The API provides the following gRPC methods:

### `ListPods` {#list-pods}

Returns a list of all pods currently managed by the kubelet on the node.

### `WatchPods` {#watch-pods}

Returns a stream of pod updates. Whenever a pod's state changes locally, the kubelet sends the updated pod information through the stream.

### `GetPod` {#get-pod}

Returns information for a specific pod identified by its UID.

## API Definition {#api-definition}

The API uses the following protobuf definition:

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

## Field selection {#field-selection}

The API supports `google.protobuf.FieldMask` to allow clients to request only the specific fields they need (e.g., `status.phase`, `status.podIPs`). This enables lean and efficient data transfer. If no field mask is provided, the full `v1.Pod` object is returned.

## Reliability and availability {#reliability}

The API serves the most up-to-date information known locally by the kubelet, derived from its internal cache and reconciliation with the container runtime. It remains available even if the node loses connectivity to the Kubernetes control plane.

If the kubelet's pod sources have not finished their initial synchronization yet (for example, right after the kubelet starts or restarts), every operation returns a gRPC `FAILED_PRECONDITION` error instead of incomplete data. Once synchronization completes, requests are served normally.

## Rate limiting {#rate-limiting}

The `kubelet` rate-limits `ListPods` and `GetPod` requests to protect itself from excessive load. By default, the server allows `100` queries per second with a burst of `10` tokens. Requests that exceed this limit receive a gRPC `RESOURCE_EXHAUSTED` error.

`WatchPods` streams are not subject to this rate limit; instead, a slow consumer that falls behind on its event stream has its watch connection dropped (see [Metrics](#metrics)).

## Metrics {#metrics}

The `kubelet` exposes the following metrics for the Pods API, with labels `server_api_version` and `status_code`:

* `kubelet_pod_requests_total`: cumulative number of requests to the API.
* `kubelet_pod_requests_list_total`: number of requests to the `ListPods` endpoint.
* `kubelet_pod_requests_get_total`: number of requests to the `GetPod` endpoint.
* `kubelet_pod_requests_watch_total`: number of requests to the `WatchPods` endpoint.

The `kubelet` also exposes `kubelet_pod_watch_events_dropped_total`, which counts watch events dropped because a client was not consuming its event stream quickly enough.
