---
reviewers:
- verb
- soltysh
title: Debug Running Pods
content_template: templates/task
---

{{% capture overview %}}

This page explains how to debug Pods running (or crashing) on a Node.

{{% /capture %}}

{{% capture prerequisites %}}

* Your {{< glossary_tooltip text="Pod" term_id="pod" >}} should already be
  scheduled and running. If your Pod is not yet running, start with [Troubleshoot
  Applications](/docs/tasks/debug-application-cluster/debug-application/).
* For some of the advanced debugging steps you need to know on which Node the
  Pod is running and have shell access to run commands on that Node. You don't
  need that access to run the standard debug steps that use `kubectl`.

{{% /capture %}}

{{% capture steps %}}

## Examining pod logs {#examine-pod-logs}

First, look at the logs of the affected container:

```shell
kubectl logs ${POD_NAME} ${CONTAINER_NAME}
```

If your container has previously crashed, you can access the previous container's crash log with:

```shell
kubectl logs --previous ${POD_NAME} ${CONTAINER_NAME}
```

## Debugging with container exec {#container-exec}

If the {{< glossary_tooltip text="container image" term_id="image" >}} includes
debugging utilities, as is the case with images built from Linux and Windows OS
base images, you can run commands inside a specific container with
`kubectl exec`:

```shell
kubectl exec ${POD_NAME} -c ${CONTAINER_NAME} -- ${CMD} ${ARG1} ${ARG2} ... ${ARGN}
```

{{< note >}}
`-c ${CONTAINER_NAME}` is optional. You can omit it for Pods that only contain a single container.
{{< /note >}}

As an example, to look at the logs from a running Cassandra pod, you might run

```shell
kubectl exec cassandra -- cat /var/log/cassandra/system.log
```

You can run a shell that's connected to your terminal using the `-i` and `-t`
arguments to `kubectl exec`, for example:

```shell
kubectl exec -it cassandra -- sh
```

For more details, see [Get a Shell to a Running Container](
/docs/tasks/debug-application-cluster/get-shell-running-container/).

## Debugging with an ephemeral debug container {#ephemeral-container}

{{< feature-state state="alpha" for_k8s_version="v1.18" >}}

{{< glossary_tooltip text="Ephemeral containers" term_id="ephemeral-container" >}}
are useful for interactive troubleshooting when `kubectl exec` is insufficient
because a container has crashed or a container image doesn't include debugging
utilities, such as with [distroless images](
https://github.com/GoogleContainerTools/distroless). `kubectl` has an alpha
command that can create ephemeral containers for debugging beginning with version
`v1.18`.

### Example debugging using ephemeral containers {#ephemeral-container-example}

{{< note >}}
The examples in this section require the `EphemeralContainers` [feature gate](
/docs/reference/command-line-tools-reference/feature-gates/) enabled in your
cluster and `kubectl` version v1.18 or later.
{{< /note >}}

You can use the `kubectl alpha debug` command to add ephemeral containers to a
running Pod. First, create a pod for the example:

```shell
kubectl run ephemeral-demo --image=k8s.gcr.io/pause:3.1 --restart=Never
```

{{< note >}}
This section use the `pause` container image in examples because it does not
contain userland debugging utilities, but this method works with all container
images.
{{< /note >}}

If you attempt to use `kubectl exec` to create a shell you will see an error
because there is no shell in this container image.

```shell
kubectl exec -it ephemeral-demo -- sh
```

```
OCI runtime exec failed: exec failed: container_linux.go:346: starting container process caused "exec: \"sh\": executable file not found in $PATH": unknown
```

You can instead add a debugging container using `kubectl alpha debug`. If you
specify the `-i`/`--interactive` argument, `kubectl` will automatically attach
to the console of the Ephemeral Container.

```shell
kubectl alpha debug -it ephemeral-demo --image=busybox --target=ephemeral-demo
```

```
Defaulting debug container name to debugger-8xzrl.
If you don't see a command prompt, try pressing enter.
/ #
```

This command adds a new busybox container and attaches to it. The `--target`
parameter targets the process namespace of another container. It's necessary
here because `kubectl run` does not enable [process namespace sharing](
/docs/tasks/configure-pod-container/share-process-namespace/) in the pod it
creates.

{{< note >}}
The `--target` parameter must be supported by the {{< glossary_tooltip
text="Container Runtime" term_id="container-runtime" >}}. When not supported,
the Ephemeral Container may not be started, or it may be started with an
isolated process namespace.
{{< /note >}}

You can view the state of the newly created ephemeral container using `kubectl describe`:

```shell
kubectl describe pod ephemeral-demo
```

```
...
Ephemeral Containers:
  debugger-8xzrl:
    Container ID:   docker://b888f9adfd15bd5739fefaa39e1df4dd3c617b9902082b1cfdc29c4028ffb2eb
    Image:          busybox
    Image ID:       docker-pullable://busybox@sha256:1828edd60c5efd34b2bf5dd3282ec0cc04d47b2ff9caa0b6d4f07a21d1c08084
    Port:           <none>
    Host Port:      <none>
    State:          Running
      Started:      Wed, 12 Feb 2020 14:25:42 +0100
    Ready:          False
    Restart Count:  0
    Environment:    <none>
    Mounts:         <none>
...
```

Use `kubectl delete` to remove the Pod when you're finished:

```shell
kubectl delete pod ephemeral-demo
```

<!--
Planned future sections include:

* Debugging with a copy of the pod

See https://git.k8s.io/enhancements/keps/sig-cli/20190805-kubectl-debug.md
-->

## Debugging via a shell on the node {#node-shell-session}

If none of these approaches work, you can find the host machine that the pod is
running on and SSH into that host, but this should generally not be necessary
given tools in the Kubernetes API. Therefore, if you find yourself needing to
ssh into a machine, please file a feature request on GitHub describing your use
case and why these tools are insufficient.

{{% /capture %}}
