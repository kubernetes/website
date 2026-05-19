---
content_type: "reference"
title: Kubelet Pod Info gRPC API
weight: 20
---

{{< feature-state feature_gate_name="PodInfoAPI" >}}

The Kubelet Pod Info gRPC API provides a way for node-local components to query information about pods running on the node directly from the kubelet. This increases reliability by removing the dependency on the Kubernetes API server for node-local information and reduces load on the control plane.

Access to this API is restricted to local admin users (typically `root`) through file permissions on the UNIX socket.

## Endpoint {#endpoint}

The API listens on a UNIX socket at:
`/var/lib/kubelet/pods/kubelet.sock`

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

If the kubelet has recently restarted and its internal state is not yet fully initialized, the API returns a gRPC `FAILED_PRECONDITION` error.
