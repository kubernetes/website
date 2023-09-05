---
title: Assign Pods to Nodes using Node Affinity
min-kubernetes-server-version: v1.10
content_type: task
weight: 160
---

<!-- overview -->
This page shows how to assign a Kubernetes Pod to a particular node using Node Affinity in a
Kubernetes cluster.


## {{% heading "prerequisites" %}}


{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}



<!-- steps -->

## Add a label to a node

1. List the nodes in your cluster, along with their labels:

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

    ```
    NAME      STATUS    ROLES    AGE     VERSION        LABELS
    worker0   Ready     <none>   1d      v1.13.0        ...,disktype=ssd,kubernetes.io/hostname=worker0
    worker1   Ready     <none>   1d      v1.13.0        ...,kubernetes.io/hostname=worker1
    worker2   Ready     <none>   1d      v1.13.0        ...,kubernetes.io/hostname=worker2
    ```

    In the preceding output, you can see that the `worker0` node has a
    `disktype=ssd` label.

## Schedule a Pod using required node affinity

This manifest describes a Pod that has a `requiredDuringSchedulingIgnoredDuringExecution` node affinity,`disktype: ssd`. 
This means that the pod will get scheduled only on a node that has a `disktype=ssd` label. 

{{% code_sample file="pods/pod-nginx-required-affinity.yaml" %}}

1. Apply the manifest to create a Pod that is scheduled onto your
   chosen node:
    
    ```shell
    kubectl apply -f https://k8s.io/examples/pods/pod-nginx-required-affinity.yaml
    ```

1. Verify that the pod is running on your chosen node:

    ```shell
    kubectl get pods --output=wide
    ```

    The output is similar to this:
    
    ```
    NAME     READY     STATUS    RESTARTS   AGE    IP           NODE
    nginx    1/1       Running   0          13s    10.200.0.4   worker0
    ```
    
## Schedule a Pod using preferred node affinity

This manifest describes a Pod that has a `preferredDuringSchedulingIgnoredDuringExecution` node affinity,`disktype: ssd`. 
This means that the pod will prefer a node that has a `disktype=ssd` label. 

{{% code_sample file="pods/pod-nginx-preferred-affinity.yaml" %}}

1. Apply the manifest to create a Pod that is scheduled onto your
   chosen node:
    
    ```shell
    kubectl apply -f https://k8s.io/examples/pods/pod-nginx-preferred-affinity.yaml
    ```

1. Verify that the pod is running on your chosen node:

    ```shell
    kubectl get pods --output=wide
    ```

    The output is similar to this:
    
    ```
    NAME     READY     STATUS    RESTARTS   AGE    IP           NODE
    nginx    1/1       Running   0          13s    10.200.0.4   worker0
    ```



## {{% heading "whatsnext" %}}

Learn more about
[Node Affinity](/docs/concepts/scheduling-eviction/assign-pod-node/#node-affinity).

