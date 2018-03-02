---
reviewers:
- jpeeler
- pmorie
title: Configure a Pod to Use a Projected Volume for Storage
---

{% capture overview %}
This page shows how to use a [`projected`](/docs/concepts/storage/volumes/#projected) volume to mount several existing volume sources into the same directory. Currently, `secret`, `configMap`, and `downwardAPI` volumes can be projected.
{% endcapture %}

{% capture prerequisites %}
{% include task-tutorial-prereqs.md %}
{% endcapture %}

{% capture steps %}
## Configure a projected volume for a pod

In this exercise, you create username and password Secrets from local files. You then create a Pod that runs one Container, using a [`projected`](/docs/concepts/storage/volumes/#projected) Volume to mount the Secrets into the same shared directory.

Here is the configuration file for the Pod:

{% include code.html language="yaml" file="projected-volume.yaml" ghlink="/docs/tasks/configure-pod-container/projected-volume.yaml" %}

1. Create the Secrets:

       # Create files containing the username and password:
       echo -n "admin" > ./username.txt
       echo -n "1f2d1e2e67df" > ./password.txt

       # Package these files into secrets:
       kubectl create secret generic user --from-file=./username.txt
       kubectl create secret generic pass --from-file=./password.txt

1. Create the Pod:

       kubectl create -f https://k8s.io/docs/tasks/configure-pod-container/projected-volume.yaml

1. Verify that the Pod's Container is running, and then watch for changes to
the Pod:

       kubectl get --watch pod test-projected-volume

    The output looks like this:

       NAME                    READY     STATUS    RESTARTS   AGE
       test-projected-volume   1/1       Running   0          14s

1. In another terminal, get a shell to the running Container:

       kubectl exec -it test-projected-volume -- /bin/sh

1. In your shell, verify that the `projected-volume` directory contains your projected sources:

       / # ls /projected-volume/
{% endcapture %}

{% capture whatsnext %}
* Learn more about [`projected`](/docs/concepts/storage/volumes/#projected) volumes.
* Read the [all-in-one volume](https://github.com/kubernetes/community/blob/{{page.githubbranch}}/contributors/design-proposals/node/all-in-one-volume.md) design document.
{% endcapture %}

{% include templates/task.md %}
