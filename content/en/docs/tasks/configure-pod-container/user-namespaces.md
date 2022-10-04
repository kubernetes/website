---
title: Use a User Namespace With a Pod
reviewers:
content_type: task
weight: 160
min-kubernetes-server-version: v1.25
---

<!-- overview -->
{{< feature-state for_k8s_version="v1.25" state="alpha" >}}

This page shows how to configure a user namespace for stateless pods. This
allows to isolate the user running inside the container from the one in the
host.

A process running as root in a container can run as a different (non-root) user
in the host; in other words, the process has full privileges for operations
inside the user namespace, but is unprivileged for operations outside the
namespace.

You can use this feature to reduce the damage a compromised container can do to
the host or other pods in the same node. There are [several security
vulnerabilities][KEP-vulns] rated either **HIGH** or **CRITICAL** that were not
exploitable when user namespaces is active. It is expected user namespace will
mitigate some future vulnerabilities too.

Without using a user namespace a container running as root, in the case of a
container breakout, has root privileges on the node. And if some capability were
granted to the container, the capabilities are valid on the host too. None of
this is true when user namespaces are used.

[KEP-vulns]: https://github.com/kubernetes/enhancements/tree/217d790720c5aef09b8bd4d6ca96284a0affe6c2/keps/sig-node/127-user-namespaces#motivation

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

{{% thirdparty-content single="true" %}}
<!-- if adding another runtime in the future, omit the single setting -->

* The node OS needs to be Linux
* You need to exec commands in the host
* You need to be able to exec into pods
* Feature gate `UserNamespacesStatelessPodsSupport` need to be enabled.

In addition, support is needed in the
{{< glossary_tooltip text="container runtime" term_id="container-runtime" >}}
to use this feature with Kubernetes stateless pods:

* CRI-O: v1.25 has support for user namespaces.

Please note that **if your container runtime doesn't support user namespaces, the
new `pod.spec` field will be silently ignored and the pod will be created without
user namespaces.**

<!-- steps -->

## Run a Pod that uses a user namespace {#create-pod}

A user namespace for a stateless pod is enabled setting the `hostUsers` field of
`.spec` to `false`. For example:

{{< codenew file="pods/user-namespaces-stateless.yaml" >}}

1. Create the pod on your cluster:

   ```shell
   kubectl apply -f https://k8s.io/examples/pods/user-namespaces-stateless.yaml
   ```

1. Attach to the container and run `readlink /proc/self/ns/user`:

   ```shell
   kubectl attach -it userns bash
   ```

And run the command. The output is similar to this:

```none
readlink /proc/self/ns/user
user:[4026531837]
cat /proc/self/uid_map
0          0 4294967295
```

Then, open a shell in the host and run the same command.

The output must be different. This means the host and the pod are using a
different user namespace. When user namespaces are not enabled, the host and the
pod use the same user namespace.

If you are running the kubelet inside a user namespace, you need to compare the
output from running the command in the pod to the output of running in the host:

```none
readlink /proc/$pid/ns/user
user:[4026534732]
```

replacing `$pid` with the kubelet PID.
