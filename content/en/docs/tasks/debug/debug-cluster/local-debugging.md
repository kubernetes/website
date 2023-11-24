---
title: Developing and debugging services locally using telepresence
content_type: task
---

<!-- overview -->

{{% thirdparty-content %}}

Kubernetes applications usually consist of multiple, separate services,
each running in its own container. Developing and debugging these services
on a remote Kubernetes cluster can be cumbersome, requiring you to
[get a shell on a running container](/docs/tasks/debug/debug-application/get-shell-running-container/)
in order to run debugging tools.
 
`telepresence` is a tool to ease the process of developing and debugging
services locally while proxying the service to a remote Kubernetes cluster.
Using `telepresence` allows you to use custom tools, such as a debugger and
IDE, for a local service and provides the service full access to ConfigMap,
secrets, and the services running on the remote cluster.
 
This document describes using `telepresence` to develop and debug services
running on a remote cluster locally.

## {{% heading "prerequisites" %}}

* Kubernetes cluster is installed
* `kubectl` is configured to communicate with the cluster
* [Telepresence](https://www.telepresence.io/docs/latest/quick-start/) is installed


<!-- steps -->

## Connecting your local machine to a remote Kubernetes cluster
 
After installing `telepresence`, run `telepresence connect` to launch
its Daemon and connect your local workstation to the cluster.

```
$ telepresence connect
 
Launching Telepresence Daemon
...
Connected to context default (https://<cluster public IP>)
```

You can curl services using the Kubernetes syntax e.g. `curl -ik https://kubernetes.default`
 
## Developing or debugging an existing service

When developing an application on Kubernetes, you typically program
or debug a single service. The service might require access to other
services for testing and debugging. One option is to use the continuous
deployment pipeline, but even the fastest deployment pipeline introduces
a delay in the program or debug cycle.
 
Use the `telepresence intercept $SERVICE_NAME --port $LOCAL_PORT:$REMOTE_PORT`
command to create an "intercept" for rerouting remote service traffic.
 
Where:

-   `$SERVICE_NAME`  is the name of your local service
-   `$LOCAL_PORT` is the port that your service is running on your local workstation
-   And `$REMOTE_PORT` is the port your service listens to in the cluster

Running this command tells Telepresence to send remote traffic to your
local service instead of the service in the remote Kubernetes cluster.
Make edits to your service source code locally, save, and see the corresponding
changes when accessing your remote application take effect immediately.
You can also run your local service using a debugger or any other local development tool.

## How does Telepresence work?

Telepresence installs a traffic-agent sidecar next to your existing
application's container running in the remote cluster. It then captures
all traffic requests going into the Pod, and instead of forwarding this
to the application in the remote cluster, it routes all traffic (when you
create a [global intercept](https://www.getambassador.io/docs/telepresence/latest/concepts/intercepts/#global-intercept)
or a subset of the traffic (when you create a
[personal intercept](https://www.getambassador.io/docs/telepresence/latest/concepts/intercepts/#personal-intercept))
to your local development environment.

## {{% heading "whatsnext" %}}
 
If you're interested in a hands-on tutorial, check out
[this tutorial](https://cloud.google.com/community/tutorials/developing-services-with-k8s)
that walks through locally developing the Guestbook application on Google Kubernetes Engine.
 
For further reading, visit the [Telepresence website](https://www.telepresence.io).
