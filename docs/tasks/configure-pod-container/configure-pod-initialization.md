---
title: Configuring Pod Initialization
---

{% capture overview %}
This page shows how to use an init Container to initialize a Pod before the
application Container runs.

{% endcapture %}

{% capture prerequisites %}

{% include task-tutorial-prereqs.md %}

{% endcapture %}

{% capture steps %}

## Creating a Pod that has an init Container

In this exercise you create a Pod that has one application Container and one
init Container. The init Container runs to completion before the application
container starts.

Here is the configuration file for the Pod:

{% include code.html language="yaml" file="init-containers.yaml" ghlink="/docs/tasks/configure-pod-container/init-containers.yaml" %}

In the configuration file, you can see that the Pod has a Volume that the init
Container and the application Container share. Notice that the init Container
is a beta feature and is specified as an annotation.

The init Container mounts the
shared Volume at `/work-dir`, and the application Container mounts the shared
Volume at `/usr/share/nginx/html`. The init Container runs the following command
and then terminates:

     wget -O /work-dir/index.html http://kubernetes.io

Notice that the init Container writes the `index.html` file in the root directory
of the nginx server.

Create the Pod:

    kubectl create -f http://k8s.io/docs/tasks/configure-pod-container/init-containers.yaml

Verify that the nginx Container is running:

    kubectl get pod init-demo

The output shows that the nginx Container is running:

    NAME      READY     STATUS    RESTARTS   AGE
    nginx     1/1       Running   0          43m

Get a shell into nginx the Container running in the init-demo Pod:

    kubectl exec -it init-demo -- /bin/bash

In your shell, send a GET request to the nginx server:

    root@nginx:~# apt-get update
    root@nginx:~# apt-get install curl
    root@nginx:~# curl localhost

The output shows that nginx is serving the web page that was written by the init container:

    <!Doctype html>
    <html id="home">

    <head>
    ...
    "url": "http://kubernetes.io/"}</script>
    </head>
    <body>
      ...
      <p>Kubernetes is open source giving you the freedom to take advantage ...</p>
      ...

{% endcapture %}

{% capture whatsnext %}

* Learn more about
[communicating between Containers running in the same Pod](/docs/tasks/configure-pod-container/communicate-containers-same-pod/).
* Learn more about [init Containers](/docs/user-guide/pods/init-container/).
* Learn more about [Volumes](/docs/user-guide/volumes/).

{% endcapture %}

{% include templates/task.md %}
