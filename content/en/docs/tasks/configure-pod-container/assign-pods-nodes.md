---
title: Assign Pods to Nodes
content_type: task
weight: 150
---

<!-- overview -->
This page shows how to assign a Kubernetes Pod to a particular node in a
Kubernetes cluster.


## {{% heading "prerequisites" %}}


{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}



<!-- steps -->

## Add a label to a node

1. List the {{< glossary_tooltip term_id="node" text="nodes" >}} in your cluster, along with their labels:

    ```shell
    kubectl get nodes --show-labels
    ```

    The output is similar to this:

    ```shell
    NAME      STATUS    ROLES    AGE     VERSION        LABELS
    worker0   Ready     <none>   1d      v1.13.0        ...,kubernetes.io/hostname=worker0
    worker1   Ready     <none>   1d      v1.13.0        ...,kubernetes.io/hostname=worker1
    worker2   Ready     <none>   1d      v1.13.0        ...,kubernetes.io/hostname=worker2
    ```
1. Choose one of your nodes, and add a label to it:

    ```shell
    kubectl label nodes <your-node-name> disktype=ssd
    ```

    where `<your-node-name>` is the name of your chosen node.

1. Verify that your chosen node has a `disktype=ssd` label:

    ```shell
    kubectl get nodes --show-labels
    ```

    The output is similar to this:

    ```shell
    NAME      STATUS    ROLES    AGE     VERSION        LABELS
    worker0   Ready     <none>   1d      v1.13.0        ...,disktype=ssd,kubernetes.io/hostname=worker0
    worker1   Ready     <none>   1d      v1.13.0        ...,kubernetes.io/hostname=worker1
    worker2   Ready     <none>   1d      v1.13.0        ...,kubernetes.io/hostname=worker2
    ```

    In the preceding output, you can see that the `worker0` node has a
    `disktype=ssd` label.

## Create a pod that gets scheduled to your chosen node

This pod configuration file describes a pod that has a node selector,
`disktype: ssd`. This means that the pod will get scheduled on a node that has
a `disktype=ssd` label.

{{% code_sample file="pods/pod-nginx.yaml" %}}

1. Use the configuration file to create a pod that will get scheduled on your
   chosen node:
    
    ```shell
    kubectl apply -f https://k8s.io/examples/pods/pod-nginx.yaml
    ```

1. Verify that the pod is running on your chosen node:

    ```shell
    kubectl get pods --output=wide
    ```

    The output is similar to this:
    
    ```shell
    NAME     READY     STATUS    RESTARTS   AGE    IP           NODE
    nginx    1/1       Running   0          13s    10.200.0.4   worker0
    ```
## Create a pod that gets scheduled to specific node

You can also schedule a pod to one specific node via setting `nodeName`.

{{% code_sample file="pods/pod-nginx-specific-node.yaml" %}}

Use the configuration file to create a pod that will get scheduled on `foo-node` only.



## {{% heading "whatsnext" %}}

* Learn more about [labels and selectors](/docs/concepts/overview/working-with-objects/labels/).
* Learn more about [nodes](/docs/concepts/architecture/nodes/).


