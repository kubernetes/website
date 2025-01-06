---
title: Building a Basic DaemonSet  
content_type: task  
weight: 5  
---
<!-- overview -->

This page demonstrates how to build a basic {{< glossary_tooltip text="DaemonSet" term_id="daemonset" >}} that runs a Pod on every node in a Kubernetes cluster.
It covers a simple use case of mounting a file from the host, logging its contents using
an [init container](/docs/concepts/workloads/pods/init-containers/), and utilizing a pause container.

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

A Kubernetes cluster with at least two nodes (one control plane node and one worker node) to demonstrate the behavior of DaemonSets.

## Define the DaemonSet

In this task, a basic DaemonSet is created which ensures that the copy of a Pod is scheduled on every node.
The Pod will use an init container to read and log the contents of `/etc/machine-id` from the host,
while the main container will be a `pause` container, which keeps the Pod running.

{{% code_sample file="application/basic-daemonset.yaml" %}}

1. Create a DaemonSet based on the (YAML) manifest:

  ```shell
  kubectl apply -f https://k8s.io/examples/application/basic-daemonset.yaml
  ```

1. Once applied, you can verify that the DaemonSet is running a Pod on every node in the cluster:

  ```shell
  kubectl get pods -o wide
  ```

  The output will list one Pod per node, similar to:

  ```
  NAME                                READY   STATUS    RESTARTS   AGE    IP       NODE
  example-daemonset-xxxxx             1/1     Running   0          5m     x.x.x.x  node-1
  example-daemonset-yyyyy             1/1     Running   0          5m     x.x.x.x  node-2
  ```

1. You can inspect the contents of the logged `/etc/machine-id` file by checking the log directory mounted from the host:

  ```shell
  kubectl exec <pod-name> -- cat /var/log/machine-id.log
  ```
  
  Where `<pod-name>` is the name of one of your Pods.

## {{% heading "cleanup" %}}

  ```
  kubectl delete --cascade=foreground --ignore-not-found --now daemonsets/example-daemonset
  ```

This simple DaemonSet example introduces key components like init containers and host path volumes,
which can be expanded upon for more advanced use cases. For more details refer to
[DaemonSet](/docs/concepts/workloads/controllers/daemonset/).



