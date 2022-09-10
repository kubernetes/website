---
title: Debugging Kubernetes nodes with kubectl
content_type: task
---

<!-- overview -->
This page shows how to debug a [node](/docs/concepts/architecture/nodes/) running on the Kubernetes cluster using `kubectl debug` command.

## {{% heading "prerequisites" %}}


{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}



<!-- steps -->

## Debugging Node using kubectl debug node

Use the `kubectl debug node` command to deploy a Pod to a Node that you want to troubleshoot.
This command is helpful in scenarios where you can't access your Node by using an SSH connection.
When the Pod is created, the Pod opens a interactive shell on the Node.
To create an interactive shell on a Node using `kubectl debug`, run:

```shell
kubectl debug node/mynode -it --image=ubuntu
```

```shell
Creating debugging pod node-debugger-mynode-pdx84 with container debugger on node mynode.
If you don't see a command prompt, try pressing enter.
root@ek8s:/#
```

Run debug commands to help you gather information and troubleshoot issues. Commands 
that you might use to debug, such as `ip`, `ifconfig`, `nc`, `ping`, and `ps`. You can also
install other tools, such as `mtr`, `tcpdump`, and `curl`, from the respective package manager.

When creating a debugging session on a Node, keep in mind that:

* `kubectl debug` automatically generates the name of the new Pod based on
  the name of the Node.
* The root filesystem of the Node will be mounted at `/host`.
* The container runs in the host IPC, Network, and PID namespaces, although
  the pod isn't privileged, so reading some process information may fail,
  and `chroot /host` will fail.
* If you need a privileged pod, create it manually.

Don't forget to clean up the debugging Pod when you're finished with it:

```shell
kubectl delete pod node-debugger-mynode-pdx84
```
{{< note >}}

The `kubectl debug node` command won't work if the Node is down (disconnected
from the network, or kubelet dies and won't restart, etc.). Check [Debugging Unreachable Node](/docs/tasks/debug/debug-cluster/#example-debugging-a-down-unreachable-node)

{{< /note >}}