---
title: Developing and debugging services locally
---

{% capture overview %}

Kubernetes applications usually consist of multiple, separate services, each running in its own container. Developing and debugging these services on a remote Kubernetes cluster can be cumbersome, requiring you to [get a shell on a running container](https://kubernetes.io/docs/tasks/debug-application-cluster/get-shell-running-container/) and running your tools inside the remote shell.

`telepresence` is a tool to ease the process of developing and debugging services locally, while proxying the service to a remote Kubernetes cluster. Using `telepresence` allows you to use custom tools, such as a debugger and IDE, for a local service and provides the service full access to ConfigMap, secrets, and the services running on the remote cluster.

This document describes using `telepresence` to develop and debug services running on a remote cluster locally.


{% endcapture %}

{% capture prerequisites %}

* Kubernetes cluster is installed
* `kubectl` is configured to communicate with the cluster
* [Telepresence](https://www.telepresence.io/reference/install) is installed

{% endcapture %}

{% capture steps %}

## Getting a shell on a remote cluster

Open a terminal and run `telepresence` with no arguments to get a `telepresence` shell. This shell runs locally, giving you full access to your local filesystem.

The `telepresence` shell can be used in a variety of ways. For example, write a shell script on your laptop, and run it directly from the shell in real time. You can do this on a remote shell as well, but you might not be able to use your preferred code editor, and the script is deleted when the container is terminated.

Enter `exit` to quit and close the shell.

## Developing or debugging an existing service

When developing an application on Kubernetes, you typically program or debug a single service. The service might require access to other services for testing and debugging. One option is to use the continuous deployment pipeline, but even the fastest deployment pipeline introduces a delay in the program or debug cycle.

Use the `--swap-deployment` option to swap an existing deployment with the Telepresence proxy. Swapping allows you to run a service locally and connect to the remote Kubernetes cluster. The services in the remote cluster can now access the locally running instance.

To run telepresence with `--swap-deployment`, enter:

`telepresence --swap-deployment $DEPLOYMENT_NAME`

where $DEPLOYMENT_NAME is the name of your existing deployment.

Running this command spawns a shell. In the shell, start your service. You can then make edits to the source code locally, save, and see the changes take effect immediately. You can also run your service in a debugger, or any other local development tool.

{% endcapture %}

{% capture whatsnext %}

If you're interested in a hands-on tutorial, check out [this tutorial](https://cloud.google.com/community/tutorials/developing-services-with-k8s) that walks through locally developing the Guestbook application on Google Kubernetes Engine.

Telepresence has [numerous proxying options](https://www.telepresence.io/reference/methods), depending on your situation.

For further reading, visit the [Telepresence website](https://www.telepresence.io).

{% endcapture %}

{% include templates/task.md %}
