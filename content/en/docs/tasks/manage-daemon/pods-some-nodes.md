---
title: Running Pods on Only Some Nodes
content_type: task
weight: 30
---
<!-- overview -->

This page demonstrates how can you run {{<glossary_tooltip term_id="pod" text="Pods">}} on only some {{<glossary_tooltip term_id="node" text="Nodes">}} as part of a {{<glossary_tooltip term_id="daemonset" text="DaemonSet">}}

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

## Running Pods on only some Nodes

Imagine that you want to run a {{<glossary_tooltip term_id="daemonset" text="DaemonSet">}}, but you only need to run those daemon pods
on nodes that have local solid state (SSD) storage. For example, the Pod might provide cache service to the
node, and the cache is only useful when low-latency local storage is available.

### Step 1: Add labels to your nodes

Add the label `ssd=true` to the nodes which have SSDs.

```shell
kubectl label nodes example-node-1 example-node-2 ssd=true
```

### Step 2: Create the manifest

Let's create a {{<glossary_tooltip term_id="daemonset" text="DaemonSet">}} which will provision the daemon pods on the SSD labeled {{<glossary_tooltip term_id="node" text="nodes">}} only.


Next, use a `nodeSelector` to ensure that the DaemonSet only runs Pods on nodes
with the `ssd` label set to `"true"`.

{{% code_sample file="controllers/daemonset-label-selector.yaml" %}}

### Step 3: Create the DaemonSet

Create the DaemonSet from the manifest by using `kubectl create` or `kubectl apply`

Let's label another node as `ssd=true`.

```shell
kubectl label nodes example-node-3 ssd=true
```

Labelling the node automatically triggers the control plane (specifically, the DaemonSet controller)
to run a new daemon pod on that node.

```shell
kubectl get pods -o wide
```
The output is similar to:

```
NAME                              READY     STATUS    RESTARTS   AGE    IP      NODE
<daemonset-name><some-hash-01>    1/1       Running   0          13s    .....   example-node-1
<daemonset-name><some-hash-02>    1/1       Running   0          13s    .....   example-node-2
<daemonset-name><some-hash-03>    1/1       Running   0          5s     .....   example-node-3
```