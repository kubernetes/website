---
title: Update API Objects in Place Using kubectl patch
description: Use kubectl patch to update Kubernetes API objects in place. Do a strategic merge patch or a JSON merge patch.
---

{% capture overview %}

This task shows how to use `kubectl patch` to update an API object in place. The exercises
in this task demonstrate a strategic merge patch and a JSON merge patch.

{% endcapture %}

{% capture prerequisites %}

{% include task-tutorial-prereqs.md %}

{% endcapture %}


{% capture steps %}

## Use a strategic merge patch to update a Deployment

Here's the configuration file for a Deployment that has two replicas. Each replica
is a Pod that has one container:

{% include code.html language="yaml" file="deployment-patch-demo.yaml" ghlink="/docs/tasks/run-application/deployment-patch-demo.yaml" %}

Create the Deployment:

```shell
kubectl create -f https://k8s.io/docs/tasks/run-application/deployment-patch-demo.yaml
```

View the Pods associated with your Deployment:

```shell
kubectl get pods
```

The output shows that the Deployment has two Pods. The `1/1` indicates that
each Pod has one container:


```
NAME                        READY     STATUS    RESTARTS   AGE
patch-demo-28633765-670qr   1/1       Running   0          23s
patch-demo-28633765-j5qs3   1/1       Running   0          23s
```

Make a note of the names of the running Pods. Later, you will see that these Pods
get terminated and replaced by new ones.

At this point, each Pod has one Container that runs the nginx image. Now suppose
you want each Pod to have two containers: one that runs nginx and one that runs redis.

Create a file named `patch-file.yaml` that has this content:

```shell
spec:
  template:
    spec:
      containers:
      - name: patch-demo-ctr-2
        image: redis
```

Patch your Deployment:

```shell
kubectl patch deployment patch-demo --patch "$(cat patch-file.yaml)"
```

View the patched Deployment:

```shell
kubectl get deployment patch-demo --output yaml
```

The output shows that the PodSpec in the Deployment has two Containers:

```shell
containers:
- image: redis
  imagePullPolicy: Always
  name: patch-demo-ctr-2
  ...
- image: nginx
  imagePullPolicy: Always
  name: patch-demo-ctr
  ...
```

View the Pods associated with your patched Deployment:

```shell
kubectl get pods
```

The output shows that the running Pods have different names from the Pods that
were running previously. The Deployment terminated the old Pods and created two
new Pods that comply with the updated Deployment spec. The `2/2` indicates that
each Pod has two Containers:

```
NAME                          READY     STATUS    RESTARTS   AGE
patch-demo-1081991389-2wrn5   2/2       Running   0          1m
patch-demo-1081991389-jmg7b   2/2       Running   0          1m
```

Take a closer look at one of the patch-demo Pods:

```shell
kubectl get pod <your-pod-name> --output yaml
```

The output shows that the Pod has two Containers: one running nginx and one running redis:

```
containers:
- image: redis
  ...
- image: nginx
  ...
```

### Notes on the strategic merge patch

With a patch, you do not have to specify an entire object; you specify only the portion
of the object that you want to change. For example, in the preceding exercise, you specified
one Container in the `containers` list in a `PodSpec`.

The patch you did in the preceding exercise is called a *strategic merge patch*.
With a strategic merge patch, you can update a list by specifying only the elements
that you want to add to the list. The existing list elements remain, and the new elements
are merged with the existing elements. In the preceding exercise, the resulting `containers`
list has both the original nginx Container and the new redis Container.

## Use a JSON merge patch to update a Deployment

A strategic merge patch is different from a
[JSON merge patch](https://tools.ietf.org/html/rfc6902).
With a JSON merge patch, if you
want to update a list, you have to specify the entire new list. And the new list completely
replaces the existing list.

The `kubectl patch` command has a `type` parameter that you can set to one of these values:

<table>
  <tr><th>Parameter value</th><th>Merge type</th></tr>
  <tr><td>json</td><td><a href="https://tools.ietf.org/html/rfc6902">JSON Patch, RFC 6902</a></td></tr>
  <tr><td>merge</td><td><a href="https://tools.ietf.org/html/rfc7386">JSON Merge Patch, RFC 7386</a></td></tr>
  <tr><td>strategic</td><td>Strategic merge patch</td></tr>
</table>

For a comparison of JSON patch and JSON merge patch, see
[JSON Patch and JSON Merge Patch](http://erosb.github.io/post/json-patch-vs-merge-patch/).

The default value for the `type` parameter is `strategic`. So in the preceding exercise, you
did a strategic merge patch.

Next, do a JSON merge patch on your same Deployment. Create a file named `patch-file-2.yaml`
that has this content:

```shell
spec:
  template:
    spec:
      containers:
      - name: patch-demo-ctr-3
        image: gcr.io/google-samples/node-hello:1.0
```

In your patch command, set `type` to `merge`:

```shell
kubectl patch deployment patch-demo --type merge --patch "$(cat patch-file-2.yaml)"
```

View the patched Deployment:

```shell
kubectl get deployment patch-demo --output yaml
```

The `containers` list that you specified in the patch has only one Container.
The output shows that your list of one Container replaced the existing `containers` list.

```shell
spec:
  containers:
  - image: gcr.io/google-samples/node-hello:1.0
    ...
    name: patch-demo-ctr-3
```

List the running Pods:

```shell
kubectl get pods
```

In the output, you can see that the existing Pods were terminated, and new Pods
were created. The `1/1` indicates that each new Pod is running only one Container.

```shell
NAME                          READY     STATUS    RESTARTS   AGE
patch-demo-1307768864-69308   1/1       Running   0          1m
patch-demo-1307768864-c86dc   1/1       Running   0          1m
```

## Alternate forms of the kubectl patch command

The `kubectl patch` command takes YAML or JSON. It can take the patch as a file or
directly on the command line.

Create a file named `patch-file.json` that has this content:

```shell
{
   "spec": {
      "template": {
         "spec": {
            "containers": [
               {
                  "name": "patch-demo-ctr-2",
                  "image": "redis"
               }
            ]
         }
      }
   }
}
```

The following commands are equivalent:


```shell
kubectl patch deployment patch-demo --patch "$(cat patch-file.yaml)"
kubectl patch deployment patch-demo --patch $'spec:\n template:\n  spec:\n   containers:\n   - name: patch-demo-ctr-2\n     image: redis'

kubectl patch deployment patch-demo --patch "$(cat patch-file.json)"
kubectl patch deployment patch-demo --patch '{"spec": {"template": {"spec": {"containers": [{"name": "patch-demo-ctr-2","image": "redis"}]}}}}'
```

## Summary

In this exercise, you `kubectl patch` to change the live configuration
of a Deployment object. You did not change the configuration file that you originally used to
create the Deployment object. Other commands for updating API objects include
[kubectl annotate](/docs/user-guide/kubectl/{{page.version}}/#annotate),
[kubectl edit](/docs/user-guide/kubectl/{{page.version}}/#edit),
[kubectl replace](/docs/user-guide/kubectl/{{page.version}}/#replace),
[kubectl scale](/docs/user-guide/kubectl/{{page.version}}/#scale),
and
[kubectl apply](/docs/user-guide/kubectl/{{page.version}}/#apply).

{% endcapture %}


{% capture whatsnext %}

* [Kubernetes Object Management](/docs/tutorials/object-management-kubectl/object-management/)
* [Managing Kubernetes Objects Using Imperative Commands](/docs/tutorials/object-management-kubectl/imperative-object-management-command/)
* [Imperative Management of Kubernetes Objects Using Configuration Files](/docs/tutorials/object-management-kubectl/imperative-object-management-configuration/)
* [Declarative Management of Kubernetes Objects Using Configuration Files](/docs/tutorials/object-management-kubectl/declarative-object-management-configuration/)

{% endcapture %}

{% include templates/task.md %}
