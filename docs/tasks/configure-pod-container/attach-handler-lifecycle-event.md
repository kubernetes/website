---
title: Attaching Handlers to Container Lifecycle Events
---

{% capture overview %}

This page shows how to attach handlers to Container lifecycle events. Kubernetes supports
the postStart and preStop events. Kubernetes sends the postStart event immediately
after a Container is started, and it sends the preStop event immediately before the
Container is terminated.

{% endcapture %}


{% capture prerequisites %}

{% include task-tutorial-prereqs.md %}

{% endcapture %}


{% capture steps %}

## Defining postStart and preStop handlers

In this exercise, you create a Pod that has one Container. The Container has handlers
for the postStart and preStop events.

Here is the configuration file for the Pod:

{% include code.html language="yaml" file="lifecycle-events.yaml" ghlink="/docs/tasks/configure-pod-container/lifecycle-events.yaml" %}

In the configuration file, you can see that the postStart command writes a `message`
file to the Container's `/usr/share` directory. The preStop command shuts down
nginx gracefully. This is helpful if the Container is being terminated because of a failure.

Create the Pod:

    kubectl create -f http://k8s.io/docs/tasks/configure-pod-container/lifecycle-events.yaml

Verify that the Container in the Pod is running:

    kubectl get pod lifecycle-demo

Get a shell into the Container running in your Pod:

    kubectl exec -it lifecycle-demo -- /bin/bash

In your shell, verify that the `postStart` handler created the `message` file:

    root@lifecycle-demo:/# cat /usr/share/message

The output shows the text written by the postStart handler:

    Hello from the postStart handler

{% endcapture %}



{% capture discussion %}

## Discussion

Kubernetes sends the postStart event immediately after the Container is created.
There is no guarantee, however, that the postStart handler is called before
the Container's entrypoint is called. The postStart handler runs asynchronously
relative to the Container's code, but Kubernetes' management of the container
blocks until the postStart handler completes. The Container's status is not
set to RUNNING until the postStart handler completes.

Kubernetes sends the preStop event immediately before the Container is terminated.
Kubernetes' management of the Container blocks until the preStop handler completes,
unless the Pod's grace period expires. For more details, see
[Termination of Pods](/docs/user-guide/pods/#termination-of-pods).

{% endcapture %}


{% capture whatsnext %}

* Learn more about [Container lifecycle hooks](/docs/user-guide/container-environment/.)
* Learn more about the [lifecycle of a Pod](https://kubernetes.io/docs/user-guide/pod-states/).


### Reference
 
* [Lifecycle](https://kubernetes.io/docs/resources-reference/1_5/#lifecycle-v1)
* [Container](https://kubernetes.io/docs/resources-reference/1_5/#container-v1)
* See `terminationGracePeriodSeconds` in [PodSpec](/docs/resources-reference/v1.5/#podspec-v1)

{% endcapture %}

{% include templates/task.md %}
