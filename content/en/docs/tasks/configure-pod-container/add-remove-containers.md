---
title: Add and Remove Containers in a Running Pod
content_type: task
weight: 35
min-kubernetes-server-version: 1.38
---

<!-- overview -->

{{< feature-state feature_gate_name="DynamicContainers" >}}

This page shows how to add {{< glossary_tooltip text="app containers" term_id="app-container" >}}
to a running {{< glossary_tooltip text="Pod" term_id="pod" >}}, and how to remove them,
without recreating the Pod.
You make these changes through the Pod's `dynamic` subresource.
You can also use this subresource to make other changes to the Pod.

For background on how this works, and for the full list of limitations, read
[Dynamic Containers](/docs/concepts/workloads/pods/dynamic-containers/).

## {{% heading "prerequisites" %}}


{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

The `DynamicContainers`
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/)
must be enabled for your control plane and for all nodes in your cluster.
This feature also depends on other feature gates that are enabled by default.

Your nodes must run Linux. Windows nodes do not support dynamic containers.

You need permission to `get` and `patch` the `pods/dynamic` subresource in the
namespace that you use for this task.
The default `admin` and `edit` roles do not grant this permission.
This permission lets a user make any change that the `dynamic` subresource allows,
not only add and remove containers.
A cluster administrator can grant it with a Role like the following one and a RoleBinding.
For details, see [Using RBAC Authorization](/docs/reference/access-authn-authz/rbac/).

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: dynamic-containers-editor
  namespace: dynamic-containers-example
rules:
- apiGroups: [""]
  resources: ["pods/dynamic"]
  verbs: ["get", "patch", "update"]
```

The `kubectl` client version must be at least v1.32 to use `--subresource dynamic`.


## Create a namespace

Create a namespace so that the resources you create in this task are isolated from the
rest of your cluster:

```shell
kubectl create namespace dynamic-containers-example
```


## Create a Pod

Here is the manifest for a Pod that has one app container, named `main`:

{{% code_sample file="pods/dynamic-containers.yaml" %}}

Create the Pod:

```shell
kubectl apply -f https://k8s.io/examples/pods/dynamic-containers.yaml --namespace=dynamic-containers-example
```

Wait until the Pod is running:

```shell
kubectl wait --for=condition=Ready pod/dynamic-demo --namespace=dynamic-containers-example
```

You can add or remove containers only while the Pod is in the `Running` phase,
and only after all of its {{< glossary_tooltip text="init containers" term_id="init-container" >}}
have completed.


## Add a container

Create a file named `add-helper.yaml` that has this content:

```yaml
spec:
  containers:
  - name: helper
    image: busybox:1.28
    command: ["sh", "-c", "trap 'exit 0' TERM; echo helper started; while true; do sleep 1; done"]
    resources:
      requests:
        cpu: "50m"
        memory: "32Mi"
```

The `trap` command makes the container stop quickly when you remove it later.

Patch the Pod through the `dynamic` subresource:

```shell
kubectl patch pod dynamic-demo --namespace=dynamic-containers-example \
  --subresource dynamic --patch-file add-helper.yaml
```

By default, `kubectl patch` uses a strategic merge patch. This patch type matches
containers by name. Because the Pod has no container named `helper`, the patch adds it
to `spec.containers`.

You can also make the same change with one of these commands:

```shell
# kubectl edit pod dynamic-demo --namespace=dynamic-containers-example --subresource dynamic
# kubectl apply -f <updated-manifest> --namespace=dynamic-containers-example --subresource dynamic --server-side
```

Check the state of each container:

```shell
kubectl get pod dynamic-demo --namespace=dynamic-containers-example \
  --output=jsonpath='{range .status.containerStatuses[*]}{.name}{"\t"}{.state}{"\n"}{end}'
```

Right after the patch, the output is similar to this:

```none
helper	{"waiting":{"message":"The container has not been allocated by the kubelet yet","reason":"Unallocated"}}
main	{"running":{"startedAt":"2026-11-16T18:00:00Z"}}
```

The `Unallocated` reason means that the {{< glossary_tooltip text="kubelet" term_id="kubelet" >}}
has not accepted the change yet.
The kubelet checks that the node has enough resources for the container's requests,
the same way it does for an
[in-place resize](/docs/tasks/configure-pod-container/resize-container-resources/).
A container in this state does not make the Pod unready.
After the kubelet accepts the container, the Pod is not ready until that container is ready.

The `Unallocated` state can be very short. If the node already has the image and enough
free resources, the container might already be running when you check.

After a few seconds, run the command again. You should see that both containers are running:

```none
helper	{"running":{"startedAt":"2026-11-16T18:00:05Z"}}
main	{"running":{"startedAt":"2026-11-16T18:00:00Z"}}
```

View the logs of the added container:

```shell
kubectl logs dynamic-demo --namespace=dynamic-containers-example --container=helper
```

The output is similar to this:

```none
helper started
```


## Remove a container

You can remove a container only after its status appears in the Pod's
`status.containerStatuses`.

Remove the `helper` container. In the patch, `$patch: delete` tells the API server to
remove the container with that name:

```shell
kubectl patch pod dynamic-demo --namespace=dynamic-containers-example \
  --subresource dynamic --patch '{"spec":{"containers":[{"name":"helper","$patch":"delete"}]}}'
```

The kubelet stops the container. It uses the Pod's `terminationGracePeriodSeconds`,
the same as when it stops a container for other reasons.

Check the state of each container again:

```shell
kubectl get pod dynamic-demo --namespace=dynamic-containers-example \
  --output=jsonpath='{range .status.containerStatuses[*]}{.name}{"\t"}{.state}{"\n"}{end}'
```

The output is similar to this:

```none
helper	{"terminated":{"exitCode":0,"finishedAt":"2026-11-16T18:02:01Z","reason":"Completed","startedAt":"2026-11-16T18:00:05Z"}}
main	{"running":{"startedAt":"2026-11-16T18:00:00Z"}}
```

The `helper` container is no longer in `spec.containers`, but its status stays in the Pod.
While the status is there, you can still read the logs of the removed container
through the API:

```shell
kubectl get --raw "/api/v1/namespaces/dynamic-containers-example/pods/dynamic-demo/log?container=helper"
```

<!-- TODO(KEP-5972): switch to kubectl logs once kubectl accepts removed containers. -->
{{< alert color="info" title="Note" >}}
`kubectl logs` doesn't accept containers that were removed from the Pod yet.
This is a known issue that a future kubectl release will fix. Until then, use the
`kubectl get --raw` command shown above.
{{< /alert >}}

The kubelet keeps the status and logs of at most 10 removed containers in each Pod.
If there are more, it deletes the ones that stopped earliest.
The status and logs of a removed container also go away if
[container garbage collection](/docs/concepts/architecture/garbage-collection/#container-image-garbage-collection)
deletes that container.

You cannot add another container named `helper` while the status of the removed `helper`
container is still in the Pod. Use a different name.


## Change several containers at once

One request to the `dynamic` subresource can add and remove containers, and also
change other fields, such as container images and container resources.
The kubelet applies the added and removed containers, image changes, and resource changes
together, or none of them.

For example, if the node does not have enough free CPU and memory for a request,
the kubelet waits:

* The Pod has a `PodResizePending` condition with reason `Deferred`.
* Added containers stay in the `Waiting` state with reason `Unallocated`.
* Removed containers keep running, and image changes are not applied.

When the node has enough resources, the kubelet applies the changes.
If the API server can tell that the requests are larger than the node's total capacity
for Pods, it rejects the request.
If the kubelet finds that the change can never fit on the node, the reason is `Infeasible`
instead of `Deferred`.
To learn more about the `PodResizePending` condition, read
[Pod resize status](/docs/tasks/configure-pod-container/resize-container-resources/#pod-resize-status).


## Troubleshooting

### The request is forbidden

If you don't have permission to use the `dynamic` subresource, the output is similar to this:

```none
Error from server (Forbidden): pods "dynamic-demo" is forbidden: User "jane" cannot get resource "pods/dynamic" in API group "" in the namespace "dynamic-containers-example"
```

Ask a cluster administrator to grant you access, as shown in
[Before you begin](#before-you-begin).

### The server cannot find the subresource

If the `DynamicContainers` feature gate is not enabled for the API server, the `dynamic`
subresource does not exist. The same happens if a cluster administrator disabled the
subresource with the kube-apiserver `--disable-pod-subresources` flag.
The output is similar to this:

```none
Error from server (NotFound): the server could not find the requested resource
```

### The node does not support dynamic containers

If the `DynamicContainers` feature gate is not enabled for the kubelet on the Pod's node,
the API server rejects the request with an error similar to this:

```none
pod update requires features DynamicContainers which are not available on node "node-1"
```

Ask a cluster administrator to enable the feature gate for the kubelet on that node.

### The request does not use the subresource

If you leave out `--subresource dynamic`, the request updates the Pod directly.
A Pod update cannot add or remove containers, so the request fails with an error that
contains `pod updates may not add or remove containers`.

### The change is not valid

The API server rejects changes that dynamic containers do not support.
The error message names the field and the reason. Some common examples:

* The Pod is not running:
  `containers may only be added or removed while the pod is Running, but it is "Pending"`.
* The container is privileged:
  `privileged containers may not be added to an existing pod`.
* The container uses a host port:
  `containers with host ports may not be added to an existing pod`.
* The name was used by a removed container whose status is still in the Pod:
  `a status for container "helper" is still present; the name may not be reused until the previous container's status is removed`.
* The container was added but its status is not reported yet:
  `container "helper" may not be removed until its status is reported`.
* Adding or removing the container would change the Pod's
  [Quality of Service class](/docs/concepts/workloads/pods/pod-qos/):
  `Pod QOS Class may not change as a result of resizing or adding or removing containers`.

For the full list of limitations, read
[Dynamic Containers](/docs/concepts/workloads/pods/dynamic-containers/).


## Clean up

Delete your namespace. This deletes the Pod that you created for this task:

```shell
kubectl delete namespace dynamic-containers-example
```


## {{% heading "whatsnext" %}}

* Read about [Dynamic Containers](/docs/concepts/workloads/pods/dynamic-containers/).
* Learn how to [resize CPU and memory resources assigned to containers](/docs/tasks/configure-pod-container/resize-container-resources/).
* Read about [ephemeral containers](/docs/concepts/workloads/pods/ephemeral-containers/).
* Learn about [using RBAC authorization](/docs/reference/access-authn-authz/rbac/).
