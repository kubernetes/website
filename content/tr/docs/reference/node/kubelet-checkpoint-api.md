---
content_type: "reference"
title: Kubelet Checkpoint API
weight: 10
---

{{< feature-state feature_gate_name="ContainerCheckpoint" >}}

Checkpointing a container is the functionality to create a stateful copy of a
running container. Once you have a stateful copy of a container, you could
move it to a different computer for debugging or similar purposes.

If you move the checkpointed container data to a computer that's able to restore
it, that restored container continues to run at exactly the same
point it was checkpointed. You can also inspect the saved data, provided that you
have suitable tools for doing so.

Creating a checkpoint of a container might have security implications. Typically
a checkpoint contains all memory pages of all processes in the checkpointed
container. This means that everything that used to be in memory is now available
on the local disk. This includes all private data and possibly keys used for
encryption. The underlying CRI implementations (the container runtime on that node)
should create the checkpoint archive to be only accessible by the `root` user. It
is still important to remember if the checkpoint archive is transferred to another
system all memory pages will be readable by the owner of the checkpoint archive.

## Operations {#operations}

### `post` checkpoint the specified container {#post-checkpoint}

Tell the kubelet to checkpoint a specific container from the specified Pod.

Consult the [Kubelet authentication/authorization reference](/docs/reference/access-authn-authz/kubelet-authn-authz)
for more information about how access to the kubelet checkpoint interface is
controlled.

The kubelet will request a checkpoint from the underlying
{{<glossary_tooltip term_id="cri" text="CRI">}} implementation. In the checkpoint
request the kubelet will specify the name of the checkpoint archive as
`checkpoint-<podFullName>-<containerName>-<timestamp>.tar` and also request to
store the checkpoint archive in the `checkpoints` directory below its root
directory (as defined by `--root-dir`).  This defaults to
`/var/lib/kubelet/checkpoints`.

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

- **timeout** (*in query*): integer

  Timeout in seconds to wait until the checkpoint creation is finished.
  If zero or no timeout is specified the default {{<glossary_tooltip
  term_id="cri" text="CRI">}} timeout value will be used. Checkpoint
  creation time depends directly on the used memory of the container.
  The more memory a container uses the more time is required to create
  the corresponding checkpoint.

#### Response {#post-checkpoint-response}

200: OK

401: Unauthorized

404: Not Found (if the `ContainerCheckpoint` feature gate is disabled)

404: Not Found (if the specified `namespace`, `pod` or `container` cannot be found)

500: Internal Server Error (if the CRI implementation encounter an error during checkpointing (see error message for further details))

500: Internal Server Error (if the CRI implementation does not implement the checkpoint CRI API (see error message for further details))

{{< comment >}}
TODO: Add more information about return codes once CRI implementation have checkpoint/restore.
      This TODO cannot be fixed before the release, because the CRI implementation need
      the Kubernetes changes to be merged to implement the new ContainerCheckpoint CRI API
      call. We need to wait after the 1.25 release to fix this.
{{< /comment >}}
