---
title: Update API Objects in Place Using kubectl patch
description: Use kubectl patch to update Kubernetes API objects in place. Do a strategic merge patch or a JSON merge patch.
content_type: task
weight: 50
---

<!-- overview -->

This task shows how to use `kubectl patch` to update an API object in place. The exercises
in this task demonstrate a [strategic merge patch][strategic-merge-patch], a
[RFC7386 JSON merge patch][jsonmergepatch] and a [RFC6902 json patch][json-patch].

## {{% heading "prerequisites" %}}


{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}




<!-- steps -->

## Use a strategic merge patch to update a Deployment

Here's the configuration file for a Deployment that has two replicas. Each replica
is a Pod that has one container:

{{% code_sample file="application/deployment-patch.yaml" %}}

Create the Deployment:

```shell
kubectl apply -f https://k8s.io/examples/application/deployment-patch.yaml
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

```yaml
spec:
  template:
    spec:
      containers:
      - name: patch-demo-ctr-2
        image: redis
```

Patch your Deployment:

```shell
kubectl patch deployment patch-demo --patch-file patch-file.yaml
```

View the patched Deployment:

```shell
kubectl get deployment patch-demo --output yaml
```

The output shows that the PodSpec in the Deployment has two Containers:

```yaml
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

The patch you did in the preceding exercise is called a [*strategic merge patch*][strategic-merge-patch].
Notice that the patch did not replace the `containers` list. Instead it added a new
Container to the list. In other words, the list in the patch was merged with the
existing list. This is not always what happens when you use a strategic merge patch on a list.
In some cases, the list is replaced, not merged.

With a strategic merge patch, a list is either replaced or merged depending on its
patch strategy. The [patch strategy is specified by the value of the `patchStrategy` key
in a field tag in the Kubernetes source code or the OpenAPI specification for a custom resource
unless overridden in a [`$patch` directive][strategic-merge-patch] in the patch itself.

For example, the `Containers` field of `PodSpec` struct has a `patchStrategy` of `merge`:

```go
type PodSpec struct {
  ...
  Containers []Container `json:"containers" patchStrategy:"merge" patchMergeKey:"name" ...`
  ...
}
```

You can also see the patch strategy in the
[OpenApi spec](https://raw.githubusercontent.com/kubernetes/kubernetes/master/api/openapi-spec/swagger.json):

```yaml
"io.k8s.api.core.v1.PodSpec": {
    ...,
    "containers": {
        "description": "List of containers belonging to the pod.  ...."
    },
    "x-kubernetes-patch-merge-key": "name",
    "x-kubernetes-patch-strategy": "merge"
}
```
<!-- for editors: intentionally use yaml instead of json here, to prevent syntax highlight error. -->

And you can see the patch strategy in the
[Kubernetes API documentation](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#podspec-v1-core).

Create a file named `patch-file-tolerations.yaml` that has this content:

```yaml
spec:
  template:
    spec:
      tolerations:
      - effect: NoSchedule
        key: disktype
        value: ssd
```

Patch your Deployment:

```shell
kubectl patch deployment patch-demo --patch-file patch-file-tolerations.yaml
```

View the patched Deployment:

```shell
kubectl get deployment patch-demo --output yaml
```

The output shows that the PodSpec in the Deployment has only one Toleration:

```yaml
tolerations:
- effect: NoSchedule
  key: disktype
  value: ssd
```

Notice that the `tolerations` list in the PodSpec was replaced, not merged. This is because
the Tolerations field of PodSpec does not have a `patchStrategy` key in its field tag. So the
strategic merge patch uses the default patch strategy, which is `replace`.

```go
type PodSpec struct {
  ...
  Tolerations []Toleration `json:"tolerations,omitempty" protobuf:"bytes,22,opt,name=tolerations"`
  ...
}
```

## Use a JSON `merge` patch to update a Deployment

A strategic merge patch is different from a
[RFC7386 JSON merge patch](https://tools.ietf.org/html/rfc7386)
or a [RFC6902 json patch][json-patch]

With a JSON merge patch, if you want to update a list, you have to specify the entire new list.
And the new list completely replaces the existing list.

The `kubectl patch` command has a `type` parameter that you can set to one of these values:

| *Parameter value* | *Merge type* |
|-------------------|--------------|
| `json`            | [JSON Patch, RFC 6902][json-patch] |
| `merge`           | [JSON Merge Patch, RFC 7386][json-merge-patch] |
| `strategic`       | [Strategic merge patch][strategic-merge-patch] |

Despite the names, both `json` and `merge` JSON patches can be presented to `kubectl`
in YAML representation.

For a comparison of JSON patch and JSON merge patch, see
[JSON Patch and JSON Merge Patch](https://erosb.github.io/post/json-patch-vs-merge-patch/).

The default value for the `type` parameter is `strategic`. So in the preceding exercise, you
did a strategic merge patch.

Next, do a JSON merge patch on your same Deployment. Create a file named `patch-file-2.yaml`
that has this content:

```yaml
spec:
  template:
    spec:
      containers:
      - name: patch-demo-ctr-3
        image: gcr.io/google-samples/hello-app:2.0
```

In your patch command, set `type` to `merge`:

```shell
kubectl patch deployment patch-demo --type merge --patch-file patch-file-2.yaml
```

View the patched Deployment:

```shell
kubectl get deployment patch-demo --output yaml
```

The `containers` list that you specified in the patch has only one Container.
The output shows that your list of one Container replaced the existing `containers` list.

```yaml
spec:
  containers:
  - image: gcr.io/google-samples/hello-app:2.0
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

## Use a `json` patch to update a Deployment

The `json` patch type accepts a [RFC 6902 json patch][json-patch] as input.

This patch type specifies exact step-by-step changes to the input as an array of
`add`, `remove`, `replace`, `copy`, `move` and `test` operations. Unlike a `merge` patch,
it can be used append elements to arrays. However, unlike a `strategic` patch, it does
not "understand" the object structure, so it cannot (for example) target containers within a
`PodTemplate` by container _name_, only array index.

Repeating the prior exercise with a `json` patch, first restore the original example deployment:

```sh
kubectl apply -f https://k8s.io/examples/application/deployment-patch.yaml
```

Now create a `patch-json.yaml` file containing:

```yaml
- op: test
  path: /spec/template/spec/containers/0/name
  value: patch-demo-ctr
- op: replace
  path: /spec/template/spec/containers/0/image
  value: gcr.io/google-samples/hello-app:2.0
```

In your patch command, set `type` to `json`:

```shell
kubectl patch deployment patch-demo --type json --patch-file patch-json.yaml
```

Query the image of the first container in the deployment:

```shell
kubectl get deployment patch-demo --output jsonpath='{@.spec.template.spec.containers[?(@.name=="patch-demo-ctr")].image}{"\n"}'
```

The output should be `gcr.io/google-samples/hello-app:2.0`, showing the image
was updated as expected.

The `test` directive, the first entry in the patch operations list, does not
apply a change. It ensures that if the order of containers in the target object
changes, the patch will fail instead of changing the image of the wrong
container. This is necessary because json patches cannot use json-path style
selector expressions; there is no way to say anything like
`/spec/template/spec/containers/[?@.name=="patch-demo-ctr-3"]/image` (**this
will not work**). Try changing the container name in the patch and re-applying
it. The patch will fail with `The request is invalid: the server rejected our
request due to an error in our request`.

Note that unlike strategic merge or json merge patches, RFC 6902 json patches
will not create missing keys. So this patch will fail to apply to the supplied
example:

```yaml
- op: add
  path: /metadata/annotations/my-annotation
  value: foo
    my-annotation: foo
    other-annotation: bar
```

Instead the annotations dictionary must be explicitly created:

```yaml
- op: add
  path: /metadata/annotations
  value:
    my-annotation: foo
    other-annotation: bar
```

... in which case this patch will then fail to apply if the base object is
modified to add a `.metadata.annotations`. There is no way to express a
conditional operation like "create if not exists", "remove if exists" or
"replace, but ignore if missing". `json` patches are thus more precise and
targeted, but less able to adapt to changes in the resource being patched.

They are particularly useful for appending to arrays, such as `volumes`,
`volumeMounts` and `args`, where the order of elements is significant and
a json `merge` patch cannot be used effectively. Use `arrayname/-` to append
to an array, e.g. to append to the `volumes` and `volumeMounts` of a container
(which must already exist):

```yaml
- op: add
  path: /spec/template/spec/containers/0/volumeMounts/-
  value:
    name: my-volume
    mountPath: /path/to/mount
- op: add
  path: /spec/template/spec/volumes/-
  value:
    name: my-volume
    emptyDir: {}
```


## Use strategic merge patch to update a Deployment using the retainKeys strategy

Here's the configuration file for a Deployment that uses the `RollingUpdate` strategy:

{{% code_sample file="application/deployment-retainkeys.yaml" %}}

Create the deployment:

```shell
kubectl apply -f https://k8s.io/examples/application/deployment-retainkeys.yaml
```

At this point, the deployment is created and is using the `RollingUpdate` strategy.

Create a file named `patch-file-no-retainkeys.yaml` that has this content:

```yaml
spec:
  strategy:
    type: Recreate
```

Patch your Deployment:

```shell
kubectl patch deployment retainkeys-demo --type strategic --patch-file patch-file-no-retainkeys.yaml
```

In the output, you can see that it is not possible to set `type` as `Recreate` when a value is defined for `spec.strategy.rollingUpdate`:

```
The Deployment "retainkeys-demo" is invalid: spec.strategy.rollingUpdate: Forbidden: may not be specified when strategy `type` is 'Recreate'
```

The way to remove the value for `spec.strategy.rollingUpdate` when updating the value for `type` is to use the `retainKeys` strategy for the strategic merge.

Create another file named `patch-file-retainkeys.yaml` that has this content:

```yaml
spec:
  strategy:
    $retainKeys:
    - type
    type: Recreate
```

With this patch, we indicate that we want to retain only the `type` key of the `strategy` object. Thus, the `rollingUpdate` will be removed during the patch operation.

Patch your Deployment again with this new patch:

```shell
kubectl patch deployment retainkeys-demo --type strategic --patch-file patch-file-retainkeys.yaml
```

Examine the content of the Deployment:

```shell
kubectl get deployment retainkeys-demo --output yaml
```

The output shows that the strategy object in the Deployment does not contain the `rollingUpdate` key anymore:

```yaml
spec:
  strategy:
    type: Recreate
  template:
```

### Notes on the strategic merge patch using the retainKeys strategy

The patch you did in the preceding exercise is called a *strategic merge patch with retainKeys strategy*. This method introduces a new directive `$retainKeys` that has the following strategies:

- It contains a list of strings.
- All fields needing to be preserved must be present in the `$retainKeys` list.
- The fields that are present will be merged with live object.
- All of the missing fields will be cleared when patching.
- All fields in the `$retainKeys` list must be a superset or the same as the fields present in the patch.

The `retainKeys` strategy does not work for all objects. It only works when the value of the `patchStrategy` key in a field tag in the Kubernetes source code contains `retainKeys`. For example, the `Strategy` field of the `DeploymentSpec` struct has a `patchStrategy` of `retainKeys`:

```go
type DeploymentSpec struct {
  ...
  // +patchStrategy=retainKeys
  Strategy DeploymentStrategy `json:"strategy,omitempty" patchStrategy:"retainKeys" ...`
  ...
}
```

You can also see the `retainKeys` strategy in the [OpenApi spec](https://raw.githubusercontent.com/kubernetes/kubernetes/master/api/openapi-spec/swagger.json):

```yaml
"io.k8s.api.apps.v1.DeploymentSpec": {
    ...,
    "strategy": {
        "$ref": "#/definitions/io.k8s.api.apps.v1.DeploymentStrategy",
        "description": "The deployment strategy to use to replace existing pods with new ones.",
        "x-kubernetes-patch-strategy": "retainKeys"
    },
    ....
}
```
<!-- for editors: intentionally use yaml instead of json here, to prevent syntax highlight error. -->

And you can see the `retainKeys` strategy in the
[Kubernetes API documentation](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#deploymentspec-v1-apps).

### Alternate forms of the kubectl patch command

The `kubectl patch` command takes YAML or JSON. It can take the patch as a file or
directly on the command line.

Create a file named `patch-file.json` that has this content:

```json
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
kubectl patch deployment patch-demo --patch-file patch-file.yaml
kubectl patch deployment patch-demo --patch 'spec:\n template:\n  spec:\n   containers:\n   - name: patch-demo-ctr-2\n     image: redis'

kubectl patch deployment patch-demo --patch-file patch-file.json
kubectl patch deployment patch-demo --patch '{"spec": {"template": {"spec": {"containers": [{"name": "patch-demo-ctr-2","image": "redis"}]}}}}'
```

### Update an object's replica count using `kubectl patch` with `--subresource` {#scale-kubectl-patch}

{{< feature-state for_k8s_version="v1.24" state="alpha" >}}

The flag `--subresource=[subresource-name]` is used with kubectl commands like get, patch,
edit and replace to fetch and update `status` and `scale` subresources of the resources
(applicable for kubectl version v1.24 or more). This flag is used with all the API resources
(built-in and CRs) that have `status` or `scale` subresource. Deployment is one of the
examples which supports these subresources.

Here's a manifest for a Deployment that has two replicas:

{{% code_sample file="application/deployment.yaml" %}}

Create the Deployment:

```shell
kubectl apply -f https://k8s.io/examples/application/deployment.yaml
```

View the Pods associated with your Deployment:

```shell
kubectl get pods -l app=nginx
```

In the output, you can see that Deployment has two Pods. For example:

```
NAME                                READY   STATUS    RESTARTS   AGE
nginx-deployment-7fb96c846b-22567   1/1     Running   0          47s
nginx-deployment-7fb96c846b-mlgns   1/1     Running   0          47s
```

Now, patch that Deployment with `--subresource=[subresource-name]` flag:

```shell
kubectl patch deployment nginx-deployment --subresource='scale' --type='merge' -p '{"spec":{"replicas":3}}'
```

The output is:

```shell
scale.autoscaling/nginx-deployment patched
```

View the Pods associated with your patched Deployment:

```shell
kubectl get pods -l app=nginx
```

In the output, you can see one new pod is created, so now you have 3 running pods.

```
NAME                                READY   STATUS    RESTARTS   AGE
nginx-deployment-7fb96c846b-22567   1/1     Running   0          107s
nginx-deployment-7fb96c846b-lxfr2   1/1     Running   0          14s
nginx-deployment-7fb96c846b-mlgns   1/1     Running   0          107s
```

View the patched Deployment:

```shell
kubectl get deployment nginx-deployment -o yaml
```

```yaml
...
spec:
  replicas: 3
  ...
status:
  ...
  availableReplicas: 3
  readyReplicas: 3
  replicas: 3
```

{{< note >}}
If you run `kubectl patch` and specify `--subresource` flag for resource that doesn't support that
particular subresource, the API server returns a 404 Not Found error.
{{< /note >}}

## Summary

In this exercise, you used `kubectl patch` to change the live configuration
of a Deployment object. You did not change the configuration file that you originally used to
create the Deployment object. Other commands for updating API objects include
[kubectl annotate](/docs/reference/generated/kubectl/kubectl-commands/#annotate),
[kubectl edit](/docs/reference/generated/kubectl/kubectl-commands/#edit),
[kubectl replace](/docs/reference/generated/kubectl/kubectl-commands/#replace),
[kubectl scale](/docs/reference/generated/kubectl/kubectl-commands/#scale),
and
[kubectl apply](/docs/reference/generated/kubectl/kubectl-commands/#apply).


{{< note >}}
Strategic merge patch is not supported by `kubectl` for custom resources. Other tools like [`kustomize`](https://github.com/kubernetes-sigs/kustomize/blob/master/examples/customOpenAPIschema.md) have varying degrees of support.
{{< /note >}}


## {{% heading "whatsnext" %}}


* [Kubernetes Object Management](/docs/concepts/overview/working-with-objects/object-management/)
* [Managing Kubernetes Objects Using Imperative Commands](/docs/tasks/manage-kubernetes-objects/imperative-command/)
* [Imperative Management of Kubernetes Objects Using Configuration Files](/docs/tasks/manage-kubernetes-objects/imperative-config/)
* [Declarative Management of Kubernetes Objects Using Configuration Files](/docs/tasks/manage-kubernetes-objects/declarative-config/)
* [Server-side apply](/docs/reference/using-api/server-side-apply/)

[strategic-merge-patch]: https://github.com/kubernetes/community/blob/master/contributors/devel/sig-api-machinery/strategic-merge-patch.md
[json-patch]: https://tools.ietf.org/html/rfc6902
[json-merge-patch]: https://tools.ietf.org/html/rfc7386