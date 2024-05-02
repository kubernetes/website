---
layout: blog
title: "Container Runtime Interface streaming explained"
date: 2024-05-01
slug: cri-streaming-explained
author: Sascha Grunert
---

The Kubernetes [Container Runtime Interface (CRI)](/docs/concepts/architecture/cri)
acts as the main connection between the [kubelet](/docs/reference/command-line-tools-reference/kubelet)
and the [Container Runtime](/docs/setup/production-environment/container-runtimes).
Those runtimes have to provide a [gRPC](https://grpc.io) server which has to
fulfill a Kubernetes defined [Protocol Buffer](https://protobuf.dev) interface.
[This API definition](https://github.com/kubernetes/cri-api/blob/63929b3/pkg/apis/runtime/v1/api.proto)
evolves over time, for example when contributors add new features or fields are
going to become deprecated.

In this blog post, I'd like to dive into the functionality and history of three
extraordinary Remote Procedure Calls (RPCs), which are truly outstanding in
terms of how they work: `Exec`, `Attach` and `PortForward`.

**Exec** can be used to run dedicated commands within the container and stream
the output to a client like [kubectl](/docs/reference/kubectl) or
[crictl](/docs/tasks/debug/debug-cluster/crictl). It also allows interaction with
that process using standard input (stdin), for example if users want to run a
new shell instance within an existing workload.

**Attach** streams the output of the currently running process via [standard I/O](https://en.wikipedia.org/wiki/Standard_streams)
from the container to the client and also allows interaction with them. This is
particularly useful if users want to see what is going on in the container and
be able to interact with the process.

**PortForward** can be utilized to forward a port from the host to the container
to be able to interact with it using third party network tools. This allows it
to bypass [Kubernetes services](/docs/concepts/services-networking/service)
for a certain workload and interact with its network interface.

## What is so special about them?

All RPCs of the CRI either use the [gRPC unary calls](https://grpc.io/docs/what-is-grpc/core-concepts/#unary-rpc)
for communication or the [server side streaming](https://grpc.io/docs/what-is-grpc/core-concepts/#server-streaming-rpc)
feature (only `GetContainerEvents` right now). This means that mainly all RPCs
retrieve a single client request and have to return a single server response.
The same applies to `Exec`, `Attach`, and `PortForward`, where their [protocol definition](https://github.com/kubernetes/cri-api/blob/63929b3/pkg/apis/runtime/v1/api.proto#L94-L99)
looks like this:

```protobuf
// Exec prepares a streaming endpoint to execute a command in the container.
rpc Exec(ExecRequest) returns (ExecResponse) {}
```

```protobuf
// Attach prepares a streaming endpoint to attach to a running container.
rpc Attach(AttachRequest) returns (AttachResponse) {}
```

```protobuf
// PortForward prepares a streaming endpoint to forward ports from a PodSandbox.
rpc PortForward(PortForwardRequest) returns (PortForwardResponse) {}
```

The requests carry everything required to allow the server to do the work,
for example, the `ContainerId` or command (`Cmd`) to be run in case of `Exec`.
More interestingly, all of their responses only contain a `url`:

```protobuf
message ExecResponse {
    // Fully qualified URL of the exec streaming server.
    string url = 1;
}
```

```protobuf
message AttachResponse {
    // Fully qualified URL of the attach streaming server.
    string url = 1;
}
```

```protobuf
message PortForwardResponse {
    // Fully qualified URL of the port-forward streaming server.
    string url = 1;
}
```

Why is it implemented like that? Well, [the original design document](https://docs.google.com/document/d/1MreuHzNvkBW6q7o_zehm1CBOBof3shbtMTGtUpjpRmY)
for those RPCs even predates [Kubernetes Enhancements Proposals (KEPs)](https://github.com/kubernetes/enhancements)
and was originally outlined back in 2016. The kubelet had a native
implementation for `Exec`, `Attach`, and `PortForward` before the
initiative to bring the functionality to the CRI started. Before that,
everything was bound to [Docker](https://www.docker.com) or the later abandoned
container runtime [rkt](https://github.com/rkt/rkt).

The CRI related design document also elaborates on the option to use native RPC
streaming for exec, attach, and port forward. The downsides outweighed this
approach: the kubelet would still create a network bottleneck and future
runtimes would not be free in choosing the server implementation details. Also,
another option that the Kubelet implements a portable, runtime-agnostic solution
has been abandoned over the final one, because this would mean another project
to maintain which nevertheless would be runtime dependent.

This means, that the basic flow for `Exec`, `Attach` and `PortForward`
was proposed to look like this:

{{< figure src="flow.svg" alt="CRI Streaming flow" class="diagram-large" >}}

Clients like crictl or the kubelet (via kubectl) request a new exec, attach or
port forward session from the runtime using the gRPC interface. The runtime
implements a streaming server that also manages the active sessions. This
streaming server provides an HTTP endpoint for the client to connect to. The
client upgrades the connection to use the [SPDY](https://en.wikipedia.org/wiki/SPDY)
streaming protocol or (in the future) to a [WebSocket](https://en.wikipedia.org/wiki/WebSocket)
connection and starts to stream the data back and forth.

This implementation allows runtimes to have the flexibility to implement
`Exec`, `Attach` and `PortForward` the way they want, and also allows a
simple test path. Runtimes can change the underlying implementation to support
any kind of feature without having a need to modify the CRI at all.

Many smaller enhancements to this overall approach have been merged into
Kubernetes in the past years, but the general pattern has always stayed the
same. The kubelet source code transformed into [a reusable library](https://github.com/kubernetes/kubernetes/blob/db9fcfe/staging/src/k8s.io/kubelet/pkg/cri/streaming),
which is nowadays usable from container runtimes to implement the basic
streaming capability.

## How does the streaming actually work?

At a first glance, it looks like all three RPCs work the same way, but that's
not the case. It's possible to group the functionality of **Exec** and
**Attach**, while **PortForward** follows a distinct internal protocol
definition.

### Exec and Attach

Kubernetes defines **Exec** and **Attach** as _remote commands_, where its
protocol definition exists in [five different versions](https://github.com/kubernetes/kubernetes/blob/9791f0d/staging/src/k8s.io/apimachinery/pkg/util/remotecommand/constants.go#L28-L52):

| #   | Version             | Note                                                                                                                   |
| --- | ------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| 1   | `channel.k8s.io`    | Initial (unversioned) SPDY sub protocol ([#13394](https://issues.k8s.io/13394), [#13395](https://issues.k8s.io/13395)) |
| 2   | `v2.channel.k8s.io` | Resolves the issues present in the first version ([#15961](https://github.com/kubernetes/kubernetes/pull/15961))       |
| 3   | `v3.channel.k8s.io` | Adds support for resizing container terminals ([#25273](https://github.com/kubernetes/kubernetes/pull/25273))          |
| 4   | `v4.channel.k8s.io` | Adds support for exit codes using JSON errors ([#26541](https://github.com/kubernetes/kubernetes/pull/26541))          |
| 5   | `v5.channel.k8s.io` | Adds support for a CLOSE signal ([#119157](https://github.com/kubernetes/kubernetes/pull/119157))                       |

On top of that, there is an overall effort to replace the SPDY transport
protocol using WebSockets as part [KEP #4006](https://github.com/kubernetes/enhancements/issues/4006).
Runtimes have to satisfy those protocols over their life cycle to stay up to
date with the Kubernetes implementation.

Let's assume that a client uses the latest (`v5`) version of the protocol as
well as communicating over WebSockets. In that case, the general flow would be:

1. The client requests an URL endpoint for **Exec** or **Attach** using the CRI.

   - The server (runtime) validates the request, inserts it into a connection
     tracking cache, and provides the HTTP endpoint URL for that request.

1. The client connects to that URL, upgrades the connection to establish
   a WebSocket, and starts to stream data.

   - In the case of **Attach**, the server has to stream the main container process
     data to the client.
   - In the case of **Exec**, the server has to create the subprocess command within
     the container and then streams the output to the client.

   If stdin is required, then the server needs to listen for that as well and
   redirect it to the corresponding process.

Interpreting data for the defined protocol is fairly simple: The first
byte of every input and output packet [defines](https://github.com/kubernetes/kubernetes/blob/9791f0d/staging/src/k8s.io/apimachinery/pkg/util/remotecommand/constants.go#L57-L64)
the actual stream:

| First Byte | Type            | Description                              |
| ---------- | --------------- | ---------------------------------------- |
| `0`        | standard input  | Data streamed from stdin                 |
| `1`        | standard output | Data streamed to stdout                  |
| `2`        | standard error  | Data streamed to stderr                  |
| `3`        | stream error    | A streaming error occurred               |
| `4`        | stream resize   | A terminal resize event                  |
| `255`      | stream close    | Stream should be closed (for WebSockets) |

How should runtimes now implement the streaming server methods for **Exec** and
**Attach** by using the provided kubelet library? The key is that the streaming
server implementation in the kubelet [outlines an interface](https://github.com/kubernetes/kubernetes/blob/db9fcfe/staging/src/k8s.io/kubelet/pkg/cri/streaming/server.go#L63-L68)
called `Runtime` which has to be fulfilled by the actual container runtime if it
wants to use that library:

```go
// Runtime is the interface to execute the commands and provide the streams.
type Runtime interface {
        Exec(ctx context.Context, containerID string, cmd []string, in io.Reader, out, err io.WriteCloser, tty bool, resize <-chan remotecommand.TerminalSize) error
        Attach(ctx context.Context, containerID string, in io.Reader, out, err io.WriteCloser, tty bool, resize <-chan remotecommand.TerminalSize) error
        PortForward(ctx context.Context, podSandboxID string, port int32, stream io.ReadWriteCloser) error
}
```

Everything related to the protocol interpretation is
already in place and runtimes only have to implement the actual `Exec` and
`Attach` logic. For example, the container runtime [CRI-O](https://github.com/cri-o/cri-o)
does it [like this pseudo code](https://github.com/cri-o/cri-o/blob/2a0867/server/container_exec.go#L27-L46):

```go
func (s StreamService) Exec(
    ctx context.Context,
    containerID string,
    cmd []string,
    stdin io.Reader, stdout, stderr io.WriteCloser,
    tty bool,
    resizeChan <-chan remotecommand.TerminalSize,
) error {
    // Retrieve the container by the provided containerID
    // …

    // Update the container status and verify that the workload is running
    // …

    // Execute the command and stream the data
    return s.runtimeServer.Runtime().ExecContainer(
        s.ctx, c, cmd, stdin, stdout, stderr, tty, resizeChan,
    )
}
```

### PortForward

Forwarding ports to a container works a bit differently when comparing it to
streaming IO data from a workload. The server still has to provide a URL
endpoint for the client to connect to, but then the container runtime has to
enter the network namespace of the container, allocate the port as well as
stream the data back and forth. There is no simple protocol definition available
like for **Exec** or **Attach**. This means that the client will stream the
plain SPDY frames (with or without an additional WebSocket connection) which can
be interpreted using libraries like [moby/spdystream](https://github.com/moby/spdystream).

Luckily, the kubelet library already provides the `PortForward` interface method
which has to be implemented by the runtime. [CRI-O does that]() by (simplified):

```go
func (s StreamService) PortForward(
    ctx context.Context,
    podSandboxID string,
    port int32,
    stream io.ReadWriteCloser,
) error {
    // Retrieve the pod sandbox by the provided podSandboxID
    sandboxID, err := s.runtimeServer.PodIDIndex().Get(podSandboxID)
    sb := s.runtimeServer.GetSandbox(sandboxID)
    // …

    // Get the network namespace path on disk for that sandbox
    netNsPath := sb.NetNsPath()
    // …

    // Enter the network namespace and stream the data
    return s.runtimeServer.Runtime().PortForwardContainer(
        ctx, sb.InfraContainer(), netNsPath, port, stream,
    )
}
```

## Future work

The flexibility Kubernetes provides for the RPCs `Exec`, `Attach` and
`PortForward` is truly outstanding compared to other methods. Nevertheless,
container runtimes have to keep up with the latest and greatest implementations
to support those features in a meaningful way. The general effort to support
WebSockets is not only a plain Kubernetes thing, it also has to be supported by
container runtimes as well as clients like `crictl`.

For example, `crictl` v1.30 features a new `--transport` flag for the
subcommands `exec`, `attach` and `port-forward`
([#1383](https://github.com/kubernetes-sigs/cri-tools/pull/1383),
[#1385](https://github.com/kubernetes-sigs/cri-tools/pull/1385))
to allow choosing between `websocket` and `spdy`.

CRI-O is going an experimental path by moving the streaming server
implementation into [conmon-rs](https://github.com/containers/conmon-rs)
(a substitute for the container monitor [conmon](https://github.com/containers/conmon)). conmon-rs is
a [Rust](https://www.rust-lang.org) implementation of the original container
monitor and allows streaming WebSockets directly using supported libraries
([#2070](https://github.com/containers/conmon-rs/pull/2070)). The major benefit
of this approach is that CRI-O does not even have to be running while conmon-rs
can keep active **Exec**, **Attach** and **PortForward** sessions open. The
simplified flow when using crictl directly will then look like this:

{{< mermaid >}}
sequenceDiagram
    autonumber
    participant crictl
    participant runtime as Container Runtime
    participant conmon-rs
    Note over crictl,runtime: Container Runtime Interface (CRI)
    crictl->>runtime: Exec, Attach, PortForward
    Note over runtime,conmon-rs: Cap’n Proto
    runtime->>conmon-rs: Serve Exec, Attach, PortForward
    conmon-rs->>runtime: HTTP endpoint (URL)
    runtime->>crictl: Response URL
    crictl-->>conmon-rs: Connection upgrade to WebSocket
    conmon-rs-)crictl: Stream data
{{< /mermaid >}}

All of those enhancements require iterative design decisions, while the original
well-conceived implementation acts as the foundation for those. I really hope
you've enjoyed this compact journey through the history of CRI RPCs. Feel free
to reach out to me anytime for suggestions or feedback using the
[official Kubernetes Slack](https://kubernetes.slack.com/team/U53SUDBD4).
