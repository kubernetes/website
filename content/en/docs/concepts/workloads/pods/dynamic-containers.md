---
reviewers:
- tallclair
- dchen1107
title: Dynamic Containers
content_type: concept
weight: 65
---

<!-- overview -->

{{< feature-state feature_gate_name="DynamicContainers" >}}

Dynamic Containers lets you add
{{< glossary_tooltip text="app containers" term_id="app-container" >}} to a running
{{< glossary_tooltip text="Pod" term_id="pod" >}}, and remove them, without recreating the Pod.
You can use this to run work quickly in a Pod that is already scheduled and initialized,
or to let a framework start and stop its own tasks inside a Pod.

<!-- body -->


## Understanding dynamic containers

Normally, the list of app containers in a Pod (`spec.containers`) is fixed when you create the Pod.
To run a different set of containers, you replace the Pod. Kubernetes must schedule each
replacement Pod, set up its network and volumes, and run its
{{< glossary_tooltip text="init containers" term_id="init-container" >}} again.
This setup can take a long time.

With dynamic containers, you do this setup once. After the Pod is running, you add
app containers to it when you have work to run, and remove them when the work is done.


## Uses for dynamic containers

- **Pods that are ready for work.** You create Pods ahead of time, and add a container
  when a request arrives. The container starts without waiting for scheduling or Pod setup.
  This is sometimes called a _warm pool_.
- **Frameworks that manage their own tasks.** A framework such as Ray or Slurm can use
  a Pod as a fixed set of resources, and start and stop task containers inside it.
- **Upgrading an app container.** You can replace an app container with a new version
  while the rest of the Pod keeps running. For example, add a container with a new name
  that runs the new version, and then remove the old container. You can do this only for
  app containers, because you cannot add or remove init containers or
  {{< glossary_tooltip text="sidecar containers" term_id="sidecar-container" >}}.


## How dynamic containers work

### The `dynamic` subresource

You add and remove containers by updating the Pod through its `dynamic` subresource.
The `dynamic` subresource is not limited to containers. An update through `dynamic` can:

- Make any change that an update to the Pod allows, such as changing a container image.
- Change CPU and memory resources, like the
  [`resize`](/docs/concepts/workloads/pods/pod-lifecycle/#pod-resize) subresource.
- Add, remove, and reorder entries in `spec.containers`.

You can make several of these changes in one request. Future Kubernetes releases might allow
more Pod fields to change through `dynamic`.

<!-- TODO(KEP-6395): document dynamic node-local ephemeral volumes. -->

The default `admin` and `edit` roles do not allow updates to `pods/dynamic`.
A cluster administrator must grant access to `pods/dynamic` explicitly, for example `get`
and `patch` for `kubectl patch`, with a [Role](/docs/reference/access-authn-authz/rbac/).
A user with this permission can run any code in the Pod.
To let a user change only container resources, grant `pods/resize` instead.

For the steps, see
[Add and Remove Containers in a Running Pod](/docs/tasks/configure-pod-container/add-remove-containers/).

### Allocation

After the API server accepts an update, the {{< glossary_tooltip text="kubelet" term_id="kubelet" >}}
on the Pod's node _allocates_ the change: it checks that the node can run it, and reserves
the resources. This works the same way as
[in-place Pod resize](/docs/concepts/workloads/pods/pod-lifecycle/#pod-resize).
The resource requests of an added container add to the Pod's total, so the kubelet handles
the change like a resize.

The kubelet allocates added and removed containers, image changes, and resource changes
together, or none of them.
If the node can't fit the changes, the Pod gets the `PodResizePending`
{{< glossary_tooltip text="condition" term_id="condition" >}} with the reason `Deferred` or
`Infeasible`, even if the update doesn't change resources. The kubelet retries deferred
changes later.

When the `DynamicContainers` feature gate is enabled on the kubelet, image changes also wait
until the kubelet can allocate the other pending changes to the Pod.

### Container status

An added container that the kubelet has not allocated yet has the `Waiting` state with the
reason `Unallocated`. While a container is `Unallocated`, it doesn't affect the Pod's readiness.
After the kubelet allocates the container, the container starts. The Pod is not ready until
the container is ready. For example, if the container has a readiness probe, the Pod is not
ready until the probe succeeds.

When you remove a running container, the kubelet stops it and respects the termination
grace period. The kubelet never restarts a removed container. While it stops, the container
still uses its resources and still counts toward
[resource quota](/docs/concepts/policy/resource-quotas/).

After a removed container stops, its status stays in `status.containerStatuses` with the
`Terminated` state, and you can still read its logs through the Pod's `log` API.
`kubectl logs` doesn't accept removed containers yet. This is a known issue, and a future
kubectl release will support it.
<!-- TODO(KEP-5972): switch to kubectl logs once kubectl accepts removed containers. -->
See
[Add and Remove Containers in a Running Pod](/docs/tasks/configure-pod-container/add-remove-containers/)
for how to read these logs.
The kubelet keeps the status and logs of up to 10 removed containers in each Pod,
and deletes the ones that stopped earliest.
You can't add a container with the same name as a removed container while the old status exists.
In practice, give each container that you add a new name.

### Admission control

The API server runs built-in
[admission controllers](/docs/reference/access-authn-authz/admission-controllers/)
on updates to `pods/dynamic`. This includes Pod Security admission, LimitRanger,
ResourceQuota, and ServiceAccount. For example, a namespace that enforces the `restricted`
[Pod Security Standard](/docs/concepts/security/pod-security-standards/) rejects an
added container that violates that standard.

{{< alert color="danger" title="Warning" >}}
Admission webhooks and admission policies run only for the resources that their rules match.
A webhook or policy that matches `pods`, but not `pods/dynamic`, doesn't run when a user
updates a Pod through `dynamic`.
Also, a rule that matches only the `CREATE` operation doesn't run for these updates.
If you use webhooks or policies to enforce rules on Pods, add `pods/dynamic`
with the `UPDATE` operation to their rules. These policies must check the whole Pod, not only
`spec.containers`, because future releases might allow more fields to change through `dynamic`.

While this feature is alpha, the API server doesn't check that your webhooks and policies
cover `pods/dynamic`. Before the feature becomes beta, the API server will require this coverage.
{{< /alert >}}

To stop users from changing Pods through `dynamic`, do one of the following:

- Don't grant `pods/dynamic` to anyone.
- Run the API server with `--disable-pod-subresources=dynamic`.
- Use a [ValidatingAdmissionPolicy](/docs/reference/access-authn-authz/validating-admission-policy/)
  and binding that reject the updates to `pods/dynamic` that you don't allow.
  A policy that checks only container names doesn't block other changes. To allow only
  some changes, compare the whole old and new Pod spec.


## Limitations {#limitations}

- **Feature gate.** You must enable the `DynamicContainers`
  [feature gate](/docs/reference/command-line-tools-reference/feature-gates/) on the
  API server and on the kubelet of every node where you want to use it. If the
  node doesn't support the feature, the API server rejects the update.
- **Linux only.** You can add or remove containers only in Pods that run on Linux nodes.
  Windows Pods are not supported.
- **App containers only.** You can't add, remove, or reorder init containers (including
  sidecar containers) or ephemeral containers through `pods/dynamic`.
- **Pod state.** The Pod must be in the `Running` phase, all its init containers must have
  completed, and the Pod must not be terminating.
  You can't add or remove containers in [static Pods](/docs/concepts/workloads/pods/static-pods/).
- **Security settings.** An added container can't be privileged, can't use `hostPort`,
  and can't set `securityContext.cgroupOptions`.
- **Resources.** Added and removed containers can set only CPU and memory resources.
  Adding or removing a container must not change the Pod's
  [Quality of Service (QoS) class](/docs/concepts/workloads/pods/pod-qos/).
  For example, a container added to a `BestEffort` Pod can't set any requests or limits.
  You can't add or remove containers that use swap.
  The [limitations of in-place resize](/docs/tasks/configure-pod-container/resize-container-resources/#limitations)
  also apply.
- **Volumes and resource claims.** An added container can only use volumes and
  [ResourceClaims](/docs/concepts/resource-management/dynamic-resource-allocation/)
  that the Pod already has. You can't add volumes or claims to a running Pod.
- **Removing containers.** The kubelet must report a status for a container before you can
  remove it. You can't remove the last app container, or a container that an ephemeral
  container targets.
- **Removed containers.** After a removed container stops, the kubelet doesn't lower the
  Pod's resource limits on the node.
- **Other tools.** Some controllers, service meshes, and logging tools assume that the
  containers in a Pod never change. These tools might not see containers that you add.
  Check that the tools in your cluster handle Pod updates before you use this feature.


## Differences from ephemeral containers

[Ephemeral containers](/docs/concepts/workloads/pods/ephemeral-containers/) are for
troubleshooting. They can't have resources, ports, or probes, and you can't remove them.
Dynamic containers are app containers: they can have resources and probes, they affect the
Pod's readiness, and you can remove them. Users need different permissions for each:
`pods/ephemeralcontainers` for ephemeral containers and `pods/dynamic` for dynamic containers.


## {{% heading "whatsnext" %}}

* Learn how to [add and remove containers in a running Pod](/docs/tasks/configure-pod-container/add-remove-containers/).
* Read about [in-place Pod resize](/docs/concepts/workloads/pods/pod-lifecycle/#pod-resize).
* Read about [container states](/docs/concepts/workloads/pods/pod-lifecycle/#container-states).
* Read about [ephemeral containers](/docs/concepts/workloads/pods/ephemeral-containers/).
