---
title: Find Out What Container Runtime is Used on a Node
content_type: task
reviewers:
- SergeyKanzhelev
weight: 30
---

<!-- overview -->

This page outlines steps to find out what [container runtime](/docs/setup/production-environment/container-runtimes/)
the nodes in your cluster use.

Depending on the way you run your cluster, the container runtime for the nodes may
have been pre-configured or you need to configure it. If you're using a managed
Kubernetes service, there might be vendor-specific ways to check what container runtime is
configured for the nodes. The method described on this page should work whenever
the execution of `kubectl` is allowed.

## {{% heading "prerequisites" %}}

Install and configure `kubectl`. See [Install Tools](/docs/tasks/tools/#kubectl) section for details.

## Find out the container runtime used on a Node

Use `kubectl` to fetch and show node information:

```shell
kubectl get nodes -o wide
```

The output is similar to the following. The column `CONTAINER-RUNTIME` outputs
the runtime and its version.

For Docker Engine, the output is similar to this:

```none
NAME         STATUS   VERSION    CONTAINER-RUNTIME
node-1       Ready    v1.16.15   docker://19.3.1
node-2       Ready    v1.16.15   docker://19.3.1
node-3       Ready    v1.16.15   docker://19.3.1
```
If your runtime shows as Docker Engine, you still might not be affected by the
removal of dockershim in Kubernetes v1.24.
[Check the runtime endpoint](#which-endpoint) to see if you use dockershim.
If you don't use dockershim, you aren't affected. 

For containerd, the output is similar to this:

```none
NAME         STATUS   VERSION   CONTAINER-RUNTIME
node-1       Ready    v1.19.6   containerd://1.4.1
node-2       Ready    v1.19.6   containerd://1.4.1
node-3       Ready    v1.19.6   containerd://1.4.1
```

Find out more information about container runtimes
on [Container Runtimes](/docs/setup/production-environment/container-runtimes/)
page.

## Find out what container runtime endpoint you use {#which-endpoint}

The container runtime talks to the kubelet over a Unix socket using the [CRI
protocol](/docs/concepts/architecture/cri/), which is based on the gRPC
framework. The kubelet acts as a client, and the runtime acts as the server.
In some cases, you might find it useful to know which socket your nodes use. For
example, with the removal of dockershim in Kubernetes v1.24 and later, you might
want to know whether you use Docker Engine with dockershim.

{{<note>}}
If you currently use Docker Engine in your nodes with `cri-dockerd`, you aren't
affected by the dockershim removal.
{{</note>}}

You can check which socket you use by checking the kubelet configuration on your
nodes.

1.  Read the starting commands for the kubelet process:

    ```
    tr \\0 ' ' < /proc/"$(pgrep kubelet)"/cmdline
    ```
    If you don't have `tr` or `pgrep`, check the command line for the kubelet
    process manually.

1.  In the output, look for the `--container-runtime` flag and the
    `--container-runtime-endpoint` flag.

    *   If your nodes use Kubernetes v1.23 and earlier and these flags aren't
        present or if the `--container-runtime` flag is not `remote`,
        you use the dockershim socket with Docker Engine. The `--container-runtime` command line
        argument is not available in Kubernetes v1.27 and later.
    *   If the `--container-runtime-endpoint` flag is present, check the socket
        name to find out which runtime you use. For example,
        `unix:///run/containerd/containerd.sock` is the containerd endpoint.

If you want to change the Container Runtime on a Node from Docker Engine to containerd,
you can find out more information on [migrating from Docker Engine to  containerd](/docs/tasks/administer-cluster/migrating-from-dockershim/change-runtime-containerd/),
or, if you want to continue using Docker Engine in Kubernetes v1.24 and later, migrate to a
CRI-compatible adapter like [`cri-dockerd`](https://github.com/Mirantis/cri-dockerd).
