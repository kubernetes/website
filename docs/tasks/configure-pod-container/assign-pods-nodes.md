---
title: Assign Pods to Nodes
---

{% capture overview %}
This page shows how to assign a Kubernetes Pod to a particular node in a
Kubernetes cluster.
{% endcapture %}

{% capture prerequisites %}

{% include task-tutorial-prereqs.md %}

{% endcapture %}

{% capture steps %}

## Add a label to a node

1. List the nodes in your cluster:

        kubectl get nodes

    The output is similar to this:

        NAME      STATUS    AGE     VERSION
        worker0   Ready     1d      v1.6.0+fff5156
        worker1   Ready     1d      v1.6.0+fff5156
        worker2   Ready     1d      v1.6.0+fff5156

1. Chose one of your nodes, and add a label to it:

        kubectl label nodes <your-node-name> disktype=ssd

    where `<your-node-name>` is the name of your chosen node.

1. Verify that your chosen node has a `disktype=ssd` label:

        kubectl get nodes --show-labels


    The output is similar to this:

        NAME      STATUS    AGE     VERSION            LABELS
        worker0   Ready     1d      v1.6.0+fff5156     ...,disktype=ssd,kubernetes.io/hostname=worker0
        worker1   Ready     1d      v1.6.0+fff5156     ...,kubernetes.io/hostname=worker1
        worker2   Ready     1d      v1.6.0+fff5156     ...,kubernetes.io/hostname=worker2

    In the preceding output, you can see that the `worker0` node has a
    `disktype=ssd` label.

## Create a pod that gets scheduled to your chosen node

This pod configuration file describes a pod that has a node selector,
`disktype: ssd`. This means that the pod will get scheduled on a node that has
a `disktype=ssd` label.

{% include code.html language="yaml" file="pod.yaml" ghlink="/docs/tasks/configure-pod-container/pod.yaml" %}

1. Use the configuration file to create a pod that will get scheduled on your
   chosen node:

        kubectl create -f https://k8s.io/docs/tasks/configure-pod-container/pod.yaml

1. Verify that the pod is running on your chosen node:

        kubectl get pods --output=wide

    The output is similar to this:

        NAME     READY     STATUS    RESTARTS   AGE    IP           NODE
        nginx    1/1       Running   0          13s    10.200.0.4   worker0

{% endcapture %}

{% capture whatsnext %}
Learn more about
[labels and selectors](/docs/user-guide/labels/).
{% endcapture %}

{% include templates/task.md %}
