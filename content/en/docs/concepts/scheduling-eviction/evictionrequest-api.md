---
title: EvictionRequest API
content_type: concept
weight: 120
---

<!-- overview -->
{{< feature-state feature_gate_name="EvictionRequestAPI" >}}

EvictionRequest and Eviction are API resources whose purpose is to enable graceful eviction of pods and to introduce
observability into the eviction process. Several participants can coordinate the eviction of a
{{< glossary_tooltip text="Pod" term_id="pod" >}} from a node.

A _requester_ is an entity that wants the Pod to be terminated, for example node drain tooling. Each requester creates
its own EvictionRequest instance, which targets a single Pod. Because the eviction is asynchronous, the requester
should observe the `TargetEvicted` and `Failed` conditions of the EvictionRequest to learn the outcome. It can also
withdraw its eviction intent by updating the `.spec.intent` or by deleting the request.

The `evictionrequest-controller` observes EvictionRequests and ensures that the appropriate Eviction objects exist.
This mapping depends on the target and the intent of the requests, but there is at most one active Eviction per Pod.

A _responder_ is usually a controller that knows how to terminate or move the application away safely. Responders
should register themselves in the Pod's `.spec.evictionResponders`. Each responder has a unique name and a priority.
Responders take turns, from the highest priority to the lowest, and report their progress in the Eviction object. If
none of the custom responders terminate the Pod, the default `imperative-eviction.k8s.io/evictor` responder becomes
active. It uses [API-initiated eviction](/docs/concepts/scheduling-eviction/api-eviction/), which honors
PodDisruptionBudgets, and retries until the Pod is gone.

The `EvictionRequest` and `Eviction` API resources are part of the `lifecycle.k8s.io/v1alpha1`
{{< glossary_tooltip text="API group" term_id="api-group" >}}. Your cluster must have that API group enabled, as well
as the `EvictionRequestAPI` [feature gate](/docs/reference/command-line-tools-reference/feature-gates/) for
the kube-apiserver and the kube-controller-manager, before you can use this API.

<!-- body -->

## How it works

The `evictionrequest-controller` enforces the eviction contract between requesters and responders. It reacts to
EvictionRequests, manages the resulting Evictions, and takes every eviction through the following steps:

1. A requester creates an EvictionRequest. It sets `.spec.requester` to its identifier, which is a domain name followed
   by a key (for example `node-maintenance.example.com/drainer`), `.spec.target.pod` to the name and UID of the Pod, and
   `.spec.intent` to `Eviction`.
2. The evictionrequest-controller validates the target. If the Pod does not exist or is invalid, the controller marks
   the EvictionRequest as `Failed`.
3. The controller creates an Eviction with the same `.spec.target.pod`, or reuses the active one if another requester
   already asked for the same Pod. It initializes the status of the Eviction: it records the requesters, prepares the
   responder fields from the Pod's `.spec.evictionResponders`, and adds the default responders.
4. The controller sets the `state` of the responder with the highest priority to `Active` in `.status.targetResponders`
   and sets `startTime` in its `.status.responders` entry. The state guides the responder through the eviction: each
   responder observes its own state and acts only when the state tells it to.
5. When a responder observes that its state is `Active`, it starts working on the eviction. In its `.status.responders`
   entry, it periodically updates `heartbeatTime`, and optionally `expectedCompletionTime` and `message`. It keeps
   observing its state while it works. If the state changes, for example to `Canceled` because every requester withdrew,
   the responder stops. Otherwise, it ends its turn by setting `completionTime`.
6. If the Pod is still running after the responder sets `completionTime`, the controller sets the state of the responder
   to `Completed`. If the responder does not update `heartbeatTime` for 20 minutes, the controller sets its state to
   `Interrupted`. In both cases, the controller sets the responder with the next highest priority to `Active`.

The eviction ends in one of these ways:

* The Pod is deleted or reaches a terminal phase (`Succeeded` or `Failed`). The controller sets the `TargetEvicted`
  condition to `True` with the reason `PodDeleted` or `PodTerminal`.
* Every requester sets `.spec.intent` to `Withdrawn` or deletes its EvictionRequest. The controller sets the state of
  the active responder to `Canceled` and the `Failed` condition to `True` with the reason `CanceledDueToNoRequesters`.
* All responders finish without evicting the Pod. The controller sets the `Failed` condition to `True` with the reason
  `NoFurtherResponder`. This outcome is a fallback and should not usually happen, because the default responder keeps
  retrying until the Pod is gone.

The controller sets these conditions on the Eviction and copies them to all its EvictionRequests. Requesters read the
result and delete their EvictionRequests. The Eviction object is garbage collected after all of them are deleted.

{{< note >}}
`Eviction` in the `lifecycle.k8s.io` API group is a different kind from the `policy/v1` `Eviction` that you POST to the
`pods/<name>/eviction` subresource for API-initiated eviction.
{{< /note >}}


## Example

This example evicts a database Pod that is managed by an operator. The operator acts as the responder and a node
maintenance tool acts as the requester.

### Register a responder on the Pod

The responder is declared when the Pod is created, typically through the Pod template of the workload.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: db-0
spec:
  evictionResponders:
  - name: database.example.com/operator
    priority: 15000
  containers:
  - name: db
    image: db:latest
```

### Request the eviction

The requester needs the name and the UID of the Pod. The UID makes sure that a new Pod with the same name is not
evicted by mistake.

```bash
kubectl get pod db-0 -o jsonpath='{.metadata.uid}'
```

The requester then creates an EvictionRequest in the namespace of the Pod:

```yaml
apiVersion: lifecycle.k8s.io/v1alpha1
kind: EvictionRequest
metadata:
  name: drain-db-54qh7
spec:
  requester: node-maintenance.example.com/drainer
  intent: Eviction
  target:
    pod:
      name: db-0
      uid: 6a2e7f0c-3c55-4f43-9d0b-1f2a5c8e7b11
```

### Inspect the Eviction

The evictionrequest-controller creates an Eviction for the Pod. The names of all requesters and responders are set as
labels on the Eviction, so the requester can find it with a label selector:

```bash
kubectl get evictions -l node-maintenance.example.com/drainer=requester -o yaml
```

The Eviction is similar to:

```yaml
apiVersion: lifecycle.k8s.io/v1alpha1
kind: Eviction
metadata:
  name: pod-1-db-0
  labels:
    node-maintenance.example.com/drainer: requester
    database.example.com/operator: responder
    imperative-eviction.k8s.io/evictor: responder
  ownerReferences:
    - apiVersion: lifecycle.k8s.io/v1alpha1
      kind: EvictionRequest
      name: drain-db-54qh7
      uid: 0b7c5d2e-91a4-4f6b-8c3d-5e2f7a9b1c04
spec:
  target:
    pod:
      name: db-0
      uid: 6a2e7f0c-3c55-4f43-9d0b-1f2a5c8e7b11
status:
  observedGeneration: 1
  conditions:
  - type: Failed
    status: "False"
    reason: AwaitingEviction
  - type: TargetEvicted
    status: "False"
    reason: AwaitingEviction
  requesters:
  - name: node-maintenance.example.com/drainer
    intent: Eviction
  targetResponders:
  - name: database.example.com/operator
    priority: 15000
    state: Active
  - name: imperative-eviction.k8s.io/evictor
    priority: 100
    state: Inactive
  responders:
  - name: database.example.com/operator
    startTime: "2026-11-25T12:00:00Z"
  - name: imperative-eviction.k8s.io/evictor
```

The operator is the active responder. The default responder `imperative-eviction.k8s.io/evictor` waits as a fallback.

### Respond to the eviction

The operator watches Evictions that carry its label (`database.example.com/operator`). When its entry in
`.status.targetResponders` becomes `Active`, it checks that `.spec.target` is a Pod it manages and starts working.
While it works, it should periodically update its own entry in `.status.responders` through the `status` subresource:

```yaml
status:
  responders:
  - name: database.example.com/operator
    heartbeatTime: "2026-11-25T12:07:00Z"
    expectedCompletionTime: "2026-11-25T12:10:00Z"
    message: "Replicating data to db-1 (60%)"
```

When the data is safe, the operator deletes or evicts the Pod and sets `completionTime` on its
entry:

```yaml
status:
  responders:
  - name: database.example.com/operator
    heartbeatTime: "2026-11-25T12:09:00Z"
    completionTime: "2026-11-25T12:09:30Z"
    message: "Data replicated to db-1, db-0 deleted"
```

A responder that does not want to handle an eviction sets `completionTime` right away without
terminating the Pod. The eviction then moves on to the next responder, in this case the default
responder.

### Observe the result

When the Pod is deleted or reaches a terminal phase, the controller sets the state of the operator
to `Completed` and updates the conditions of the Eviction. It copies the conditions to every
EvictionRequest for that Pod. The requester can wait for the result:

```bash
kubectl wait --for=condition=TargetEvicted evictionrequest/drain-db-54qh7 --timeout=30m
```

The status of the EvictionRequest is then similar to:

```yaml
status:
  observedGeneration: 1
  conditions:
  - type: TargetEvicted
    status: "True"
    reason: PodDeleted
    message: Target pod has been deleted.
  - type: Failed
    status: "False"
    reason: Succeeded
```

The requester then deletes its EvictionRequest. Because the EvictionRequest is the only owner of the Eviction, the
Eviction is garbage collected as well.

### Withdraw the request

If the eviction is no longer needed before it completes, for example because the node maintenance was called off, the
requester withdraws it:

```bash
kubectl patch evictionrequest drain-db-54qh7 --type=merge -p '{"spec":{"intent":"Withdrawn"}}'
```

The drainer is the only requester, so the controller cancels the Eviction. It sets the state of the operator to
`Canceled` and sets the `Failed` condition to `True` with the reason `CanceledDueToNoRequesters`. The operator stops
the replication and keeps `db-0` running.

If a second requester had also created an EvictionRequest for `db-0`, both names would be listed in
`.status.requesters`. The withdrawal of the drainer would only change its intent in that list, and the operator would
continue until the second requester withdrew as well.

## Guidelines for requesters and responders

### Requesters

* Create one EvictionRequest per Pod and set the same `.spec.requester` on all of them. The requester name should be a
  domain-prefixed key such as `acme.io/foo`. The `*.k8s.io` and `*.kubernetes.io` domains are reserved.
* The `evictionrequest-controller` manages the Eviction and ensures there is at most one active Eviction per Pod.
  You should not create Evictions yourself.
* Keep `.spec.intent` current. Leave it at `Eviction` while you want the Pod evicted, and set it to `Withdrawn` as soon
  as the eviction is no longer needed.
* `.spec.target.pod` requires both name and uid. A Pod that is recreated with the same name needs a new EvictionRequest.
* Read the result from the conditions of your EvictionRequest. Read the Eviction status for progress details.
* To find the Evictions for your requests, use a label selector that selects the label whose key is your
  `.spec.requester` and whose value is `requester`, or `requester-responder` if you are also a responder for the Pod.
* Delete the EvictionRequest after the `TargetEvicted` or the `Failed` condition is `True` and you have processed the
  result.

### Responders

A responder first registers itself on the Pods that it manages. It then watches the Evictions for these Pods, reads the
state that the `evictionrequest-controller` assigned to it, and decides what to do. While it works on an eviction, it
periodically updates the status of the Eviction to report its progress, until it completes its turn or the state tells
it to stop.

#### Register on Pods

* Register in `.spec.evictionResponders` only on Pods that you manage or understand. The responder name should be a
  domain-prefixed key such as `acme.io/foo`. The `*.k8s.io` and `*.kubernetes.io` domains are reserved.
* Priority ranges from 0 to 100000. Higher values run first, and only one responder is active at a time. If there are
  responders with the same priority, the responder whose domain name comes first in the alphabetical higher domain
  order is picked. This means that the top domain labels are compared alphabetically first, followed by the lower
  domain labels. The key is compared last. For example, `a.example.com/beta` is picked before `b.example.com/alpha`.
* The controller that manages the Pod should use priority 10000. This leaves room for other responders to run before it
  or to act as a fallback after it. Priorities 0-999 are reserved for `*.k8s.io` responders.

#### Observe the state

To find the Evictions that you have to respond to, use a label selector that selects the label whose key is your
responder name and whose value is `responder`, or `requester-responder` if you also requested the eviction.

Verify the target before you act on an Eviction. Check that the `.spec.target.pod` refers to a Pod that you manage.

Then find the entry with your name in `.status.targetResponders` and read its `state`. The controller assigns the state,
and it tells you what to do:

| State | Meaning | Expected reaction |
|---|---|---|
| `Inactive` | The responder's turn has not come. | None. |
| `Active` | The responder is running or expected to start soon. Its `startTime` is set. | Work on the eviction and report progress. |
| `Interrupted` | The responder did not start or did not send a heartbeat in time. | Stop all work. Another responder might be active. |
| `Canceled` | No requester wants the eviction anymore. | Stop the eviction and return the application to a healthy state. |
| `Completed` | The responder set `completionTime`. | None. |

#### Report progress

While your state is `Active`, update the entry with your name in `.status.responders` through the `status` subresource.
Use [Server-Side Apply](/docs/reference/using-api/server-side-apply/) with your own field manager for these updates,
because the controller and the other responders write to the status of the same Eviction. Only the entry of the active
responder can be changed. Each update follows these steps:

1. Verify that `.spec.target.pod` refers to a Pod that you manage. Compare both the name and the UID, because an
   Eviction can exist for a Pod that was recreated with the same name.
2. Read your `state` in `.status.targetResponders`. Continue only if it is `Active`. Otherwise, react as described in
   the table above.
3. Set `heartbeatTime` to the current time to signal that the eviction is not stuck. The value cannot move backwards.
   If it is not updated for 20 minutes, the controller marks you as `Interrupted` and the next responder becomes
   active. Send a heartbeat regularly, for example every few minutes, so that a short outage of your controller does
   not exceed the deadline.
4. Set `expectedCompletionTime` if you can make a reasonable estimate of when your part of the eviction ends.
5. Set `message` to describe the progress in human-readable form.
6. When your part is done, set `completionTime` to the current time. This ends your turn, whether or not you terminated
   the Pod.

Optionally, emit an Event that refers to the Eviction to inform about the start or the progress of the eviction, or
about the reason why it is blocked. Keep the number of events low.

#### Other points to acknowledge

* Send heartbeats only while the eviction makes meaningful progress. If you are waiting for an external system, explain
  why in `message` and give an estimate in `expectedCompletionTime`. Do not use heartbeats to block an eviction
  indefinitely; if an eviction has to be blocked, use a PDB.
* If you do not want to handle an eviction, set `completionTime` immediately instead of letting the heartbeat deadline
  expire.
* Prefer API-initiated eviction over deletion when you terminate the Pod, so that PDBs are respected. Delete the Pod
  directly only if you know the availability of the application better than the PDB does.
* When your state changes to `Canceled`, stop the eviction if possible, or help the application return to a healthy
  state as soon as possible.
* When your state changes to `Interrupted`, stop all the ongoing work. Another responder might be processing the
  eviction or recovering from your interruption.
* Expect that the Eviction can be deleted at any time.


## Default imperative eviction responder

Every Eviction that targets a Pod includes the `imperative-eviction.k8s.io/evictor` responder with priority 100. It is
implemented by the `imperative-eviction-responder-controller`, which runs in the kube-controller-manager. It becomes
active after all other responders are done and calls API-initiated eviction for the Pod. If a PDB blocks the call, it
records the reason and the number of attempts in its `message` and retries with an exponential backoff, while it keeps
sending heartbeats. A Pod without custom responders is therefore evicted the same way as with API-initiated eviction,
with the retries handled for the requester.

## Eviction outcomes

An eviction ends when the `evictionrequest-controller` sets the `TargetEvicted` or the `Failed` condition to `True`. It
sets the condition on the Eviction and copies it to every EvictionRequest with the same target.

The eviction succeeds as soon as the Pod is no longer running. It is enough for the Pod to reach a terminal phase
(`Succeeded` or `Failed`) or to be deleted. The eviction fails when no responder is processing it anymore and the Pod
is still running.

| Condition | Reason | Meaning |
|---|---|---|
| `TargetEvicted` | `PodTerminal` | The Pod reached a terminal phase. The Pod object still exists. |
| `TargetEvicted` | `PodDeleted` | The Pod was deleted. |
| `Failed` | `EvictionInvalid` | The target is not valid, for example the Pod does not exist or its UID does not match. |
| `Failed` | `CanceledDueToNoRequesters` | Every requester withdrew or deleted its request. |
| `Failed` | `NoFurtherResponder` | All responders finished without evicting the Pod. |

### Cancellation

A requester withdraws by setting `.spec.intent` to `Withdrawn` or by deleting its EvictionRequest. The eviction
continues while at least one requester keeps the `Eviction` intent. When none is left, the eviction is canceled:
inactive responders never run, the active responder is expected to stop, and work that responders have already done is
not undone. Prefer `Withdrawn` over deletion so that responders have time to react.

### Cleanup

The outcome of an Eviction is final. The conditions of an EvictionRequest can be reset if the eviction was unsuccessful
and a new `Eviction` intent has been submitted.

Requesters should delete their EvictionRequests after they have processed the outcome. Every EvictionRequest is an
owner of its Eviction in `.metadata.ownerReferences`, so the Eviction is garbage collected after all of them are
deleted.

## Observability and troubleshooting

To see why an eviction is pending, look at the Eviction of the Pod:

* `.status.targetResponders` shows which responder is active and which ones were interrupted, canceled, or completed.
* `.status.responders` shows when the active responder started, its last heartbeat, its estimate, and its message.
* `.status.requesters` shows who asked for the eviction.

### Stuck evictions

An eviction stays pending in these cases:

* A custom responder keeps sending heartbeats without finishing. Compare `startTime`, `heartbeatTime`, and
  `expectedCompletionTime`, and check the responder itself.
* A custom responder is not running. The controller moves on after the 20-minute heartbeat deadline.
* A PDB blocks the default responder. Its `message` contains the error from the Eviction API and the number of attempts.
  Resolve this as described in [Troubleshooting stuck
  evictions](/docs/concepts/scheduling-eviction/api-eviction/#troubleshooting-stuck-evictions).
  To detect evictions that are blocked this way across the cluster, monitor the
  `imperative_eviction_responder_controller_failed_evictions_total` metric of the kube-controller-manager. It counts
  evictions for which the default responder made at least three unsuccessful calls to the `pods/<name>/eviction`
  subresource. What counts as normal depends on your cluster and on the applications that run in it. A number of failed
  evictions that is large for your cluster, or that rises sharply compared to its usual level, indicates that evictions
  are not making progress, for example because applications are unavailable or their PDBs are too strict.

## Comparison with API-initiated eviction and PodDisruptionBudgets

API-initiated eviction is a single imperative call, and a
[PodDisruptionBudget](/docs/concepts/workloads/pods/disruptions/#pod-disruption-budgets) (PDB) is the only way for an
application owner to influence it. A PDB can only allow or deny the call based on how many Pods are healthy. An
EvictionRequest, on the other hand, is declarative: it records the intent to evict a Pod, lets responders act before
the Pod is terminated, and reports the progress and the outcome in the status of the API objects.

The imperative approach leaves gaps:

* An application with one replica, or one that an autoscaler can scale down to one replica, must choose between a PDB
  that blocks every node drain and no protection at all.
* The application cannot run its own logic before termination, such as starting a replacement first, migrating or
  checkpointing state, or finishing a computation. Such logic can take on the order of hours or days.
* The [termination grace period](/docs/concepts/workloads/pods/pod-termination/) only starts after the decision to
  terminate the Pod has been made, and it is a fixed duration.
* A caller that is denied sees only an error response. It has to retry by brute force, which results in a large number
  of API requests, and it cannot tell whether anything is making progress or when the eviction is expected to finish.
* Several components that want to evict the same Pod do not know about each other.
  To work around these gaps, some cluster administrators override PDBs during a node drain, and some applications block
  evictions with admission webhooks. Both approaches are hard to discover and can disrupt or block other workloads.

An EvictionRequest closes these gaps. Responders run application-specific logic before the Pod is terminated, so a
single-replica application can be moved without downtime. Progress is visible through heartbeats, an expected completion
time, a message, and conditions. All requesters for a Pod share one eviction process, and each of them can withdraw its
intent while it is in progress.

Eviction requests build on the existing mechanisms. The
[default imperative eviction responder](#default-imperative-eviction-responder) uses API-initiated eviction, so PDBs
still apply to Pods that no other responder terminates. API-initiated eviction and PDBs keep working as before for
clients that do not use EvictionRequests.

## Interactions in the ecosystem

The API is an integration point between components that remove Pods and components that manage applications. The
following scenarios show how each side can use it. Whether a particular tool creates EvictionRequests or registers
responders depends on that tool.

### Node maintenance and node drain

A node maintenance or drain tool cordons the node and creates one EvictionRequest for each Pod on it, instead of calling
the Eviction API in a retry loop. It then watches the `TargetEvicted` and `Failed` conditions to learn when the node is
empty, and reads the Evictions to show which responder is working on each Pod and when it expects to finish. If the
maintenance is called off, the tool sets the intent of its requests to `Withdrawn` and the applications stay where they
are. See [Safely Drain a Node](/docs/tasks/administer-cluster/safely-drain-node/) for the drain process that is based on
API-initiated eviction.

### Descheduling and autoscaling

A component that performs any kind of descheduling and wants to move a Pod to a better node, or a cluster autoscaler
that wants to remove an underused node, acts as a requester in the same way. Because all requesters share one Eviction
for a Pod, these components do not interfere with a node drain that targets the same Pod. The eviction continues until
every requester has withdrawn.

### Workload controllers and operators

A controller that manages Pods can register as a responder and decide how its application leaves a node. For example:

* A controller for a replicated application starts a replacement Pod on another node, waits for it to become available,
  and only then terminates the evicted Pod.
* An operator for a stateful application moves data or hands over leadership before it terminates the Pod.
* A controller for virtual machines or long-running computations migrates or checkpoints the workload so that the work
  is not lost.
  Several responders can cooperate on one Pod. A responder with a priority above 10000 runs before the managing
  controller, for example to notify users or to prepare the application. A responder with a lower priority acts as a
  fallback if the managing controller does not terminate or support the termination of the Pod.

## {{% heading "whatsnext" %}}

* Read the API reference for [EvictionRequest](/docs/reference/kubernetes-api/lifecycle/eviction-request-v1alpha1/) and
  [Eviction](/docs/reference/kubernetes-api/lifecycle/eviction-v1alpha1/).
* Learn about [Disruptions](/docs/concepts/workloads/pods/disruptions/), 
  [API-initiated Eviction](/docs/concepts/scheduling-eviction/api-eviction/) and 
  [PodDisruptionBudget](/docs/tasks/run-application/configure-pdb/).
* Read [KEP-4563](https://github.com/kubernetes/enhancements/tree/master/keps/sig-node/4563-eviction-request-api) for
  the design and the planned follow-ups.
 

