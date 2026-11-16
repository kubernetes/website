---
title: Binding
content_type: concept
weight: 25
---

<!-- overview -->

In Kubernetes, _binding_ is the action of associating or linking one API object to another. Most commonly, binding refers to assigning a {{< glossary_tooltip text="Pod" term_id="pod" >}} to a specific {{< glossary_tooltip text="Node" term_id="node" >}} where it will run.

While binding is often performed by the {{< glossary_tooltip text="kube-scheduler" term_id="kube-scheduler" >}} as the final step of scheduling, it is a distinct architectural operation in Kubernetes. You can bind a Pod to a Node during scheduling, at Pod creation time, or programmatically through the Kubernetes API.

<!-- body -->

## Abstract concept of binding

At an abstract level in Kubernetes, a binding couples two related resources together. For example:

- **Pod-to-Node binding**: Links a Pod to the Node that will execute it.
- **RBAC RoleBinding**: Links a `Role` or `ClusterRole` to one or more subjects (users, groups, or service accounts).
- **Volume binding**: Binds a `PersistentVolumeClaim` (PVC) to a suitable `PersistentVolume` (PV), or ties dynamic volume provisioning to the topology of the node where the consumer Pod is scheduled.
- **Dynamic Resource Allocation (DRA) binding**: Associates a `ResourceClaim` with a device driver on a candidate node.

Across all these contexts, binding represents the commitment or link between a consumer of a resource and the provider or location of that resource.

## Pod-to-Node binding

When you create a Pod without specifying a node, the Pod starts in the `Pending` phase. Kubernetes needs to bind the Pod to a Node so that the {{< glossary_tooltip text="kubelet" term_id="kubelet" >}} on that Node can recognize the Pod and start its containers.

Binding sets the `.spec.nodeName` field of the Pod to the name of the selected Node. Once a Pod is bound to a Node, `.spec.nodeName` becomes immutable; you cannot rebind an existing Pod to a different Node.

### Binding vs. scheduling

Although binding is often discussed as part of scheduling, they are conceptually separate:

- **Scheduling** is the decision-making process of selecting the most suitable Node for an unscheduled Pod. The scheduler evaluates requirements such as resource requests, affinity/anti-affinity rules, taints and tolerations, and data locality.
- **Binding** is the state change that records the placement decision in the cluster by writing the node assignment to the Pod.

Because binding is separate from scheduling:
- You can bypass the scheduler entirely and bind a Pod to a specific Node at creation time.
- The `kube-scheduler` decouples its logic into a synchronous **scheduling cycle** (which calculates the best node) and an asynchronous **binding cycle** (which commits the binding).
- Custom controllers or external schedulers can implement their own placement algorithms and perform the binding step using the Kubernetes API.

### Binding mechanisms

There are two primary ways a Pod is bound to a Node:

#### 1. Creation-time binding (direct assignment)

You can bind a Pod directly to a Node at creation time by explicitly specifying the `nodeName` field in the Pod's specification:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: nginx-direct-bound
spec:
  nodeName: worker-node-1
  containers:
  - name: nginx
    image: nginx:1.27
```

When `.spec.nodeName` is provided in the initial manifest:
- The `kube-scheduler` ignores the Pod.
- The kubelet running on `worker-node-1` detects the Pod and starts it immediately.
- If the named Node does not exist or lacks sufficient resources, the Pod will fail to run.

#### 2. Dynamic binding via the `pods/binding` subresource

When a Pod is created without `.spec.nodeName`, you cannot set `.spec.nodeName` later through a standard `PUT` or `PATCH` update to `/api/v1/namespaces/{namespace}/pods/{name}`. Direct updates to `.spec.nodeName` on an existing Pod are rejected by the API server.

Instead, assigning a Node to an existing Pod requires sending a `POST` request to the Pod's **`binding` subresource**:

```http
POST /api/v1/namespaces/{namespace}/pods/{name}/binding
```

The request payload must be a [`Binding`](/docs/reference/kubernetes-api/definitions/binding-v1/) object:

```yaml
apiVersion: v1
kind: Binding
metadata:
  name: my-pending-pod
  namespace: default
target:
  apiVersion: v1
  kind: Node
  name: worker-node-1
```

When the API server processes the `POST` request to the `binding` subresource:
1. It validates that the Pod currently has an empty `.spec.nodeName`.
2. It verifies that the caller has permission to create bindings for the Pod.
3. It sets `.spec.nodeName` on the Pod to the name specified in `target.name`.
4. It saves the updated Pod object and emits an event recording the assignment.

This subresource endpoint is what `kube-scheduler` uses to commit its placement decisions.

### The binding cycle in `kube-scheduler`

Within the [Scheduling Framework](/docs/concepts/scheduling-eviction/scheduling-framework/), the scheduler splits its work into two phases: the **scheduling cycle** and the **binding cycle**.

The binding cycle applies the scheduling decision and consists of several extension points:

1. **`WaitOnPermit`**: If a permit plugin requested a hold or delayed approval, the binding cycle waits until the permit is granted.
2. **`PreBind`**: Plugins perform any prerequisite tasks before binding, such as provisioning network attachments or preparing storage volumes.
3. **`Bind`**: A binder plugin (by default, the `DefaultBinder`) sends the `POST` request to the Pod's `binding` subresource on the API server.
4. **`PostBind`**: Informational plugins run after the Pod has been successfully bound to clean up resources or update external metrics.

While scheduling cycles execute sequentially one Pod at a time, binding cycles can run concurrently.

## Security and RBAC

The ability to bind Pods to Nodes allows a user or process to bypass scheduler constraints, such as taints, tolerations, resource quotas, and affinity policies. A rogue or compromised entity with binding permissions could schedule workloads onto sensitive control plane nodes or starved worker nodes.

For this reason, access to the `binding` subresource is restricted. In Kubernetes Role-Based Access Control (RBAC), permission to bind a Pod is represented by the `create` verb on the `pods/binding` subresource:

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: pod-binder
rules:
- apiGroups: [""]
  resources: ["pods/binding"]
  verbs: ["create"]
```

In standard clusters, only the system scheduler (`system:kube-scheduler`) has this permission. If you implement a custom scheduler or controller that binds Pods, you must explicitly grant its service account access to `pods/binding`.

## {{% heading "whatsnext" %}}

- Learn more about [assigning Pods to Nodes](/docs/concepts/scheduling-eviction/assign-pod-node/).
- Read about the [Kubernetes Scheduler](/docs/concepts/scheduling-eviction/kube-scheduler/).
- Understand extension points in the [Scheduling Framework](/docs/concepts/scheduling-eviction/scheduling-framework/).
- View the [`Binding`](/docs/reference/kubernetes-api/definitions/binding-v1/) API reference definition.
