---
title: Communicating Between Containers Running in the Same Pod
---

{% capture overview %}

This page shows how to use a Volume to communicate between two Containers running
in the same Pod.

{% endcapture %}


{% capture prerequisites %}

{% include task-tutorial-prereqs.md %}

{% endcapture %}


{% capture steps %}

###  Creating a Pod that runs two Containers

In this exercise, you create a Pod that runs two Containers. The two containers
share a Volume that they can use to communicate. Here is the configuration file
for the Pod:

{% include code.html language="yaml" file="two-container-pod.yaml" ghlink="/docs/tasks/configure-pod-container/two-container-pod.yaml" %}

In the configuration file, you can see that the Pod has a Volume named
`shared-data`.

The first container listed in the configuration file runs an nginx server. The
second container, which is based on the debian image, runs this one command and
then terminates.

    echo Hello from the debian container > /pod-data/test-file

Create the Pod and the two Containers:

    kubectl create -f k8s.io//docs/tasks/configure-pod-container/two-container-pod.yaml

View information about the Pod and the Containers:

    kubectl get pod two-containers --output=yaml

Here is a portion of the output:

    apiVersion: v1
    kind: Pod
    metadata:
      ...
      name: two-containers
      namespace: default
      ...
    spec:
      ...
      containerStatuses:

      - containerID: docker://c1d8abd1 ...
        image: debian
        ...
        lastState:
          terminated:
            ...
        name: debian-container
        ...

      - containerID: docker://96c1ff2c5bb ...
        image: nginx
        ...
        name: nginx-container
        ...
        state:
          running:
        ...

You can see that the debian Container has terminated, and the nginx Container
is still running.

Get a shell to nginx Container:

    kubectl exec -it two-containers -c nginx-container -- /bin/bash

In your shell, verify that nginx is running:

    root@two-containers:/# ps aux

The output is similar to this:

    USER       PID  ...  STAT START   TIME COMMAND
    root         1  ...  Ss   21:12   0:00 nginx: master process nginx -g daemon off;

Recall that the debian Container created a file named `test-file` in the Pod's
shared Volume. In your shell to the nginx Container, view the contents of
`test-file`:

    root@two-containers:/# cat /pod-data/test-file

The output is the message written by the debian Container:

    Hello from the debian container

{% endcapture %}


{% capture discussion %}

### Discussion

The primary reason that Pods can have multiple containers is to support
helper applications that assist a primary application. Typical examples of
helper applications are data pullers, data pushers, and proxies.
Helper and primary applications typically need to communicate with each other,
often through the file system. An example of this pattern would be a web server
along with a helper program that polls a Git repository for new updates.

The Volume in this exercise provides a way for Containers to communicate during
the life of the Pod. If the Pod is deleted and recreated, any data stored in
the shared Volume is lost.

{% endcapture %}


{% capture whatsnext %}

* Learn more about
[patterns for composite containers](http://blog.kubernetes.io/2015/06/the-distributed-system-toolkit-patterns.html).

* Learn about
[composite containers for modular architecture](http://www.slideshare.net/Docker/slideshare-burns).

* See
[Configuring a Pod to Use a Volume for Storage](http://localhost:4000/docs/tasks/configure-pod-container/configure-volume-storage/).

* See [Volume](/docs/api-reference/v1/definitions/#_v1_volume).

* See [Pod](/docs/api-reference/v1/definitions/#_v1_pod).

{% endcapture %}


{% include templates/task.md %}
