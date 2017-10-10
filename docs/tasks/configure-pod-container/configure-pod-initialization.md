---
title: Configure Pod Initialization
---

{% capture overview %}
This page shows how to use an Init Container to initialize a Pod before an
application Container runs.

{% endcapture %}

{% capture prerequisites %}

{% include task-tutorial-prereqs.md %}

{% endcapture %}

{% capture steps %}

## Create a Pod that has an Init Container

In this exercise you create a Pod that has one application Container and one
Init Container. The init container runs to completion before the application
container starts.

Here is the configuration file for the Pod:

{% include code.html language="yaml" file="init-containers.yaml" ghlink="/docs/tasks/configure-pod-container/init-containers.yaml" %}

In the configuration file, you can see that the Pod has a Volume that the init
container and the application container share.

The init container mounts the
shared Volume at `/work-dir`, and the application container mounts the shared
Volume at `/usr/share/nginx/html`. The init container runs the following command
and then terminates:

    wget -O /work-dir/index.html http://kubernetes.io

Notice that the init container writes the `index.html` file in the root directory
of the nginx server.

Create the Pod:

    kubectl create -f https://k8s.io/docs/tasks/configure-pod-container/init-containers.yaml

Verify that the nginx container is running:

    kubectl get pod init-demo

The output shows that the nginx container is running:

    NAME        READY     STATUS    RESTARTS   AGE
    init-demo   1/1       Running   0          1m

Get a shell into the nginx container running in the init-demo Pod:

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
[communicating between Containers running in the same Pod](/docs/tasks/access-application-cluster/communicate-containers-same-pod-shared-volume/).
* Learn more about [Init Containers](/docs/concepts/workloads/pods/init-containers/).
* Learn more about [Volumes](/docs/concepts/storage/volumes/).
* Learn more about [Debugging Init Containers](/docs/tasks/debug-application-cluster/debug-init-containers/)

{% endcapture %}

{% include templates/task.md %}
