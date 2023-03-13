---
title: Running Pods on Only Some Nodes
content_type: task
weight: 30
min-kubernetes-server-version: 1.7
---
<!-- overview -->

This page shows how you can run {{<glossary_tooltip term_id="pod" text="Pods">}} on only some {{<glossary_tooltip term_id="node" text="Nodes">}}

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

## Running Pods on only some Nodes

Consider a scenario where we want to run some of our {{<glossary_tooltip term_id="pod" text="Pods">}} only on those {{<glossary_tooltip term_id="node" text="Nodes">}} which do have ssd. 

### Step 1: Add labels to your nodes

Adding the label `ssd=true` to the nodes which have ssd.

```shell
kubectl label nodes my-node ssd=true
```

### Step 2: Creating the configuration file

We will create a {{<glossary_tooltip term_id="daemonset" text="DaemonSet">}} which will provision the nginx on the ssd labeled {{<glossary_tooltip term_id="node" text="nodes">}} only.

we will use the nodeSelector to select the {{<glossary_tooltip term_id="node" text="nodes">}} based on the labels assigned to them

{{<codenew file="controllers/daemonset-label-selector.yaml">}}

### Step 3: Create the {{<glossary_tooltip term_id="daemonset" text="DaemonSet">}}

Create the daemonset from the configuration file by using `kubectl create` or `kubectl apply`

Now suppose we label another node as `ssd=true`.

```shell
kubectl label nodes another-node ssd=true
```

Now our {{<glossary_tooltip term_id="pod" text="pod">}} would be automatically deployed there. We can check this using

```shell
kubectl get pods -o wide
```