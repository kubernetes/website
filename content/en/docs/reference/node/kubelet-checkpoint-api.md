---
content_type: "reference"
title: Kubelet Checkpoint API
weight: 10
---


{{< feature-state for_k8s_version="v1.24" state="alpha" >}}

Checkpointing a container is the functionality to create a stateful copy of a
running container. Once you have a stateful copy of a container, you could
move it to a different computer for debugging or similar purposes.

If you move the checkpointed container data to a computer that's able to restore
it, that restored container continues to run at exactly the same
point it was checkpointed. You can also inspect the saved data, provided that you
have suitable tools for doing so.

## Operations {#operations}

### `post` checkpoint the specified container {#post-checkpoint}

Tell the kubelet to checkpoint a specific container from the specified Pod.

Consult the [Kubelet authentication/authorization reference](/docs/reference/command-line-tools-reference/kubelet-authentication-authorization)
for more information about how access to the kubelet checkpoint interface is
controlled.

The kubelet will request a checkpoint from the underlying
{{<glossary_tooltip term_id="cri" text="CRI">}} implementation. In the checkpoint
request the kubelet will specify the name of the checkpoint archive as
`<containerID>.tar` and also request to store the checkpoint archive in the
`checkpoints` directory below its root directory (as defined by `--root-dir`).
This defaults to `/var/lib/kubelet/checkpoints`. If an existing checkpoint
archive will be overwritten depends on the underlying CRI implementation.

The checkpoint archive is in _tar_ format, and could be listed using an implementation of
[`tar`](https://pubs.opengroup.org/onlinepubs/7908799/xcu/tar.html). The contents of the
archive depend on the underlying CRI implementation (the container runtime on that node).

#### HTTP Request {#post-checkpoint-request}

POST /checkpoint/{namespace}/{pod}/{container}

#### Parameters {#post-checkpoint-params}

- **namespace** (*in path*): string, required

  {{< glossary_tooltip term_id="namespace" >}}

- **pod** (*in path*): string, required

  {{< glossary_tooltip term_id="pod" >}}

- **container** (*in path*): string, required

  {{< glossary_tooltip term_id="container" >}}

#### Response {#post-checkpoint-response}

200: OK

401: Unauthorized

404: Not Found (if the `CheckpointContainer` feature gate is disabled)

404: Not Found (if the specified `namespace`, `pod` or `container` cannot be found)

500: Internal Server Error (if the CRI implementation encounter an error during checkpointing (see error message for further details))

500: Internal Server Error (if the CRI implementation does not implement the checkpoint CRI API (see error message for further details))

{{< comment >}}
TODO: Add more information about return codes once CRI implementation have checkpoint/restore.
{{< /comment >}}
