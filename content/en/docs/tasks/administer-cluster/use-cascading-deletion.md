---
title: Use Cascading Deletion in a Cluster
content_type: task
weight: 70
---

<!--overview-->

This page shows you how to specify the type of [cascading deletion](/docs/concepts/workloads/controllers/garbage-collection/#cascading-deletion)
to use in your cluster during {{<glossary_tooltip text="garbage collection" term_id="garbage-collection">}}.

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

* [Create a sample Deployment](/docs/tasks/run-application/run-stateless-application-deployment/#creating-and-exploring-an-nginx-deployment).

## Check owner references on your pods

Check that the `ownerReferences` field is present on your pods:

```shell 
kubectl get pods -l app=nginx --output=yaml
```

The output has an `ownerReferences` field similar to this:

```
apiVersion: v1
    ...
    ownerReferences:
    - apiVersion: apps/v1
      blockOwnerDeletion: true
      controller: true
      kind: ReplicaSet
      name: nginx-deployment-6b474476c4
      uid: 4fdcd81c-bd5d-41f7-97af-3a3b759af9a7
    ...
```

## Use foreground cascading deletion

By default, Kubernetes uses [background cascading deletion] to delete dependents
of an object. You can use foreground cascading deletion using either
`kubectl` or the Kubernetes API. 

{{<tabs name="foreground_deletion">}}
{{% tab name="kubectl" %}}
You can delete objects using foreground cascading deletion with `kubectl` if
your cluster is running Kubernetes version 1.20.

```shell
kubectl delete deployment nginx-deployment --cascade=foreground
```
{{% /tab %}}
{{% tab name="API" %}}
You can delete objects using foreground cascading deletion by calling the
Kubernetes API.

1. Start a local proxy session:

    ```shell
    kubectl proxy --port=8080
    ```

1. Use `curl` to trigger deletion:

   ```shell
   curl -X DELETE localhost:8080/apis/apps/v1/namespaces/default/deployments/nginx-deployment \
       -d '{"kind":"DeleteOptions","apiVersion":"v1","propagationPolicy":"Foreground"}' \
       -H "Content-Type: application/json"
   ```

   The output contains a `foregroundDeletion` {{<glossary_tooltip text="finalizer" term_id="finalizer">}}
   like this:

   ```
    "kind": "Deployment",
    "apiVersion": "apps/v1",
    "metadata": {
        "name": "nginx-deployment",
        "namespace": "default",
        "uid": "d1ce1b02-cae8-4288-8a53-30e84d8fa505",
        "resourceVersion": "1363097",
        "creationTimestamp": "2021-07-08T20:24:37Z",
        "deletionTimestamp": "2021-07-08T20:27:39Z",
        "finalizers": [
          "foregroundDeletion"
        ]
        ...
   ```
   {{% /tab %}}
   {{</tabs>}}

