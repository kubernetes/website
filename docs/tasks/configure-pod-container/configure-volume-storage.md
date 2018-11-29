---
title: Configure a Pod to Use a Volume for Storage
---

{% capture overview %}

This page shows how to configure a Pod to use a Volume for storage.

A Container's file system lives only as long as the Container does, so when a
Container terminates and restarts, changes to the filesystem are lost. For more
consistent storage that is independent of the Container, you can use a
[Volume](/docs/concepts/storage/volumes/). This is especially important for stateful
applications, such as key-value stores and databases. For example, Redis is a
key-value cache and store.

{% endcapture %}

{% capture prerequisites %}

{% include task-tutorial-prereqs.md %}

{% endcapture %}

{% capture steps %}

## Configure a volume for a Pod

In this exercise, you create a Pod that runs one Container. This Pod has a
Volume of type
[emptyDir](/docs/concepts/storage/volumes/#emptydir)
that lasts for the life of the Pod, even if the Container terminates and
restarts. Here is the configuration file for the Pod:

{% include code.html language="yaml" file="pod-redis.yaml" ghlink="/docs/tasks/configure-pod-container/pod-redis.yaml" %}

1. Create the Pod:

       kubectl create -f https://k8s.io/docs/tasks/configure-pod-container/pod-redis.yaml

1. Verify that the Pod's Container is running, and then watch for changes to
the Pod:

       kubectl get pod redis --watch

    The output looks like this:

       NAME      READY     STATUS    RESTARTS   AGE
       redis     1/1       Running   0          13s

1. In another terminal, get a shell to the running Container:

       kubectl exec -it redis -- /bin/bash

1. In your shell, go to `/data/redis`, and create a file:

       root@redis:/data# cd /data/redis/
       root@redis:/data/redis# echo Hello > test-file

1. In your shell, list the running processes:

       root@redis:/data/redis# ps aux

    The output is similar to this:

       USER       PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND
       redis        1  0.1  0.1  33308  3828 ?        Ssl  00:46   0:00 redis-server *:6379
       root        12  0.0  0.0  20228  3020 ?        Ss   00:47   0:00 /bin/bash
       root        15  0.0  0.0  17500  2072 ?        R+   00:48   0:00 ps aux

1. In your shell, kill the redis process:

       root@redis:/data/redis# kill <pid>

    where `<pid>` is the redis process ID (PID).

1. In your original terminal, watch for changes to the redis Pod. Eventually,
you will see something like this:

       NAME      READY     STATUS     RESTARTS   AGE
       redis     1/1       Running    0          13s
       redis     0/1       Completed  0         6m
       redis     1/1       Running    1         6m

At this point, the Container has terminated and restarted. This is because the
redis Pod has a
[restartPolicy](/docs/reference/generated/kubernetes-api/{{page.version}}/#podspec-v1-core)
of `Always`.

1. Get a shell into the restarted Container:

       kubectl exec -it redis -- /bin/bash

1. In your shell, goto `/data/redis`, and verify that `test-file` is still there.

{% endcapture %}

{% capture whatsnext %}

* See [Volume](/docs/reference/generated/kubernetes-api/{{page.version}}/#volume-v1-core).

* See [Pod](/docs/reference/generated/kubernetes-api/{{page.version}}/#pod-v1-core).

* In addition to the local disk storage provided by `emptyDir`, Kubernetes
supports many different network-attached storage solutions, including PD on
GCE and EBS on EC2, which are preferred for critical data, and will handle
details such as mounting and unmounting the devices on the nodes. See
[Volumes](/docs/concepts/storage/volumes/) for more details.

{% endcapture %}

{% include templates/task.md %}
