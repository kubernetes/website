---
assignees:
- jpeeler
- pmorie
title: Configuring a Pod to Use a Projected Volume for Storage
redirect_from:
- "/docs/tasks/configure-pod-container/projected-volume/"
- "/docs/user-guide/projected-volume/"
- "/docs/user-guide/projected-volume/index.html"
---

{% capture overview %}
This page shows how to use a [`projected`](/docs/concepts/storage/volumes/#projected) volume to mount several existing volume sources into the same directory. Currently, `secret`, `configMap`, and `downwardAPI` volumes can be projected.
{% endcapture %}

{% capture prerequisites %}
{% include task-tutorial-prereqs.md %}
{% endcapture %}

{% capture steps %}
## Configure a projected volume for a pod

In this exercise, you create a Pod that runs Redis in one Container. The Pod uses two types of Volumes: [`emptyDir`](/docs/concepts/storage/volumes/#emptydir) is used for storing Redis data, and [`projected`](/docs/concepts/storage/volumes/#projected) mounts multiple secrets into the same shared directory. Here is the configuration file for the Pod:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: test-projected-volume
spec:
  containers:
  - name: test-projected-volume
    image: busybox
    args:
    - sleep
    - "86400"
    volumeMounts:
    - name: all-in-one
      mountPath: "/projected-volume"
      readOnly: true
  volumes:
  - name: all-in-one
    projected:
      sources:
      - secret:
          name: user
      - secret:
          name: pass
```

Each projected volume source is listed in the spec under `sources`. The
parameters are nearly the same with two exceptions:

* For secrets, the `secretName` field has been changed to `name` to be consistent
with config maps naming.
* The `defaultMode` can only be specified at the projected level and not for each
volume source. However, as illustrated above, you can explicitly set the `mode`
for each individual projection.

1. Create secrets:

```
$ echo -n "admin" > ./username.txt
$ echo -n "1f2d1e2e67df" > ./password.txt
$ kubectl create secret generic user --from-file=./username.txt
$ kubectl create secret generic pass --from-file=./password.txt
```

1. Create the Pod:

        kubectl create -f podspec.yaml

1. Verify that the Pod's Container is running, and then watch for changes to
the Pod:

        kubectl get --watch pod redis

    The output looks like this:

        NAME      READY     STATUS    RESTARTS   AGE
        redis     1/1       Running   0          13s

1. In another terminal, get a shell to the running Container:

        kubectl exec -it test-projected-volume -- /bin/sh

1. In your shell, verify that the `projected-volumes` directory contains your projected sources:

        root@redis:/data/# ls ../projected-volumes/
{% endcapture %}

{% capture whatsnext %}
* Learn more about [`projected`](/docs/concepts/storage/volumes/#projected) volumes.
* Read the the [all-in-one volume](https://github.com/kubernetes/community/blob/{{page.githubbranch}}/contributors/design-proposals/all-in-one-volume.md) design document.
{% endcapture %}

{% include templates/task.md %}
