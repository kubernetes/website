---
title: Debugging Kubernetes nodes with kubectl
content_type: task
---

<!-- overview -->
This page shows how to debug a [nodes](/docs/concepts/architecture/nodes/) running on the Kubernetes cluster using `kubectl debug` command.


## {{% heading "prerequisites" %}}


{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}



<!-- steps -->

## Debugging via a shell on the node {#node-shell-session}

To create an interactive shell on a node using `kubectl debug`, run:

```shell
kubectl debug node/mynode -it --image=ubuntu
```

```
Creating debugging pod node-debugger-mynode-pdx84 with container debugger on node mynode.
If you don't see a command prompt, try pressing enter.
root@ek8s:/#
```

When creating a debugging session on a node, keep in mind that:

* `kubectl debug` automatically generates the name of the new Pod based on
  the name of the Node.
* The container runs in the host IPC, Network, and PID namespaces.
* The root filesystem of the Node will be mounted at `/host`.

Don't forget to clean up the debugging Pod when you're finished with it:

```shell
kubectl delete pod node-debugger-mynode-pdx84
```
