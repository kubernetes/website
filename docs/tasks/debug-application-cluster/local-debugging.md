---
title: Local development and debugging
---

{% capture overview %}

Frequently, Kubernetes applications consist of multiple, separate services, each running in its own container. Developing and debugging these services on a remote Kubernetes cluster can be cumbersome, requiring you to [get a shell on a running container](https://kubernetes.io/docs/tasks/debug-application-cluster/get-shell-running-container/), and running your tools inside the remote shell.

This document will show how you can use `telepresence` to develop and debug one of your services locally, while proxying your service to a remote Kubernetes cluster. This lets you use your own local tools (debugger, IDE, etc.) for your local service, while giving the service full access to ConfigMap, secrets, and the other services running in the cluster.

{% endcapture %}

{% capture prerequisites %}

You need to have a Kubernetes cluster, and the `kubectl` command-line tool configured to communicate with your cluster. You'll also need to [install Telepresence](https://www.telepresence.io/reference/install).

{% endcapture %}

{% capture steps %}

## Getting a shell on a remote cluster

If you start `telepresence` with no arguments, you'll get a special shell. Unlike a remote shell, the telepresence shell runs locally, giving you full access to your filesystem.

There are a variety of ways that the local shell can be used. For example, you could write a shell script on your laptop, and run it directly from the shell in real-time. You can do this on a remote shell as well, of course, but you may not be able to use your preferred code editor, and the script is deleted when you terminate the container.

You can exit the shell by typing `exit`.

## Developing or debugging an existing service

When developing an application on Kubernetes, you typically code/debug a single service, but that service may require access to other services for proper testing and debugging. One option for coding and debugging is to use your continuous deployment pipeline, but even the fastest deployment pipeline introduces a delay in the code/debug cycle.

With the `--swap-deployment` option, Telepresence lets you swap an existing deployment with the Telepresence proxy. This lets you run your service locally while connecting to the remote Kubernetes cluster -- while letting other services in the remote cluster also access your locally running instance. To run Telepresence with `--swap-deployment`, type:

`telepresence --swap-deployment $DEPLOYMENT_NAME`

where $DEPLOYMENT_NAME is the name of your existing deployment. This will spawn a shell. In the shell, start up your service. You can then make edits to your source code locally, save, and see the changes take effect immediately. You can also run your service in a debugger, or any other local development tool.

{% endcapture %}

{% capture whatsnext %}

If you're interested in a hands-on tutorial, check out [this tutorial](https://cloud.google.com/community/tutorials/developing-services-with-k8s) that walks through locally developing the Guestbook application on Google Container Engine.

Telepresence has [numerous proxying options](https://www.telepresence.io/reference/methods), depending on your situation.

For further reading, visit the [Telepresence website](https://www.telepresence.io).

{% endcapture %}

{% include templates/task.md %}
