---
title: Pod Lifecycle
---

{% capture overview %}

{% comment %}Updated: 4/14/2015{% endcomment %}
{% comment %}Edited and moved to Concepts section: 2/2/17{% endcomment %}

This page describes the lifecycle of a Pod.

{% endcapture %}


{% capture body %}

## Pod phase

A Pod's `status` field is a
[PodStatus](/docs/reference/generated/kubernetes-api/{{page.version}}/#podstatus-v1-core)
object, which has a `phase` field.

The phase of a Pod is a simple, high-level summary of where the Pod is in its
lifecycle. The phase is not intended to be a comprehensive rollup of observations
of Container or Pod state, nor is it intended to be a comprehensive state machine.

The number and meanings of Pod phase values are tightly guarded.
Other than what is documented here, nothing should be assumed about Pods that
have a given `phase` value.

Here are the possible values for `phase`:

* Pending: The Pod has been accepted by the Kubernetes system, but one or more of
  the Container images has not been created. This includes time before being
  scheduled as well as time spent downloading images over the network,
  which could take a while.

* Running: The Pod has been bound to a node, and all of the Containers have been
  created. At least one Container is still running, or is in the process of
  starting or restarting.

* Succeeded: All Containers in the Pod have terminated in success, and will not
  be restarted.

* Failed: All Containers in the Pod have terminated, and at least one Container
  has terminated in failure. That is, the Container either exited with non-zero
  status or was terminated by the system.

* Unknown: For some reason the state of the Pod could not be obtained, typically
  due to an error in communicating with the host of the Pod.

## Pod conditions

A Pod has a PodStatus, which has an array of
[PodConditions](/docs/reference/generated/kubernetes-api/{{page.version}}/#podcondition-v1-core). Each element
of the PodCondition array has a `type` field and a `status` field. The `type`
field is a string, with possible values PodScheduled, Ready, Initialized, and
Unschedulable. The `status` field is a string, with possible values True, False,
and Unknown.

## Container probes

A [Probe](/docs/reference/generated/kubernetes-api/{{page.version}}/#probe-v1-core) is a diagnostic
performed periodically by the [kubelet](/docs/admin/kubelet/)
on a Container. To perform a diagnostic,
the kubelet calls a
[Handler](https://godoc.org/k8s.io/kubernetes/pkg/api/v1#Handler) implemented by
the Container. There are three types of handlers:

* [ExecAction](/docs/reference/generated/kubernetes-api/{{page.version}}/#execaction-v1-core):
  Executes a specified command inside the Container. The diagnostic
  is considered successful if the command exits with a status code of 0.

* [TCPSocketAction](/docs/reference/generated/kubernetes-api/{{page.version}}/#tcpsocketaction-v1-core):
  Performs a TCP check against the Container's IP address on
  a specified port. The diagnostic is considered successful if the port is open.

* [HTTPGetAction](/docs/reference/generated/kubernetes-api/{{page.version}}/#httpgetaction-v1-core):
  Performs an HTTP Get request against the Container's IP
  address on a specified port and path. The diagnostic is considered successful
  if the response has a status code greater than or equal to 200 and less than 400.

Each probe has one of three results:

* Success: The Container passed the diagnostic.
* Failure: The Container failed the diagnostic.
* Unknown: The diagnostic failed, so no action should be taken.

The kubelet can optionally perform and react to two kinds of probes on running
Containers:

* `livenessProbe`: Indicates whether the Container is running. If
   the liveness probe fails, the kubelet kills the Container, and the Container
   is subjected to its [restart policy](#restart-policy). If a Container does not
   provide a liveness probe, the default state is `Success`.

* `readinessProbe`: Indicates whether the Container is ready to service requests.
   If the readiness probe fails, the endpoints controller removes the Pod's IP
   address from the endpoints of all Services that match the Pod. The default
   state of readiness before the initial delay is `Failure`. If a Container does
   not provide a readiness probe, the default state is `Success`.

### When should you use liveness or readiness probes?

If the process in your Container is able to crash on its own whenever it
encounters an issue or becomes unhealthy, you do not necessarily need a liveness
probe; the kubelet will automatically perform the correct action in accordance
with the Pod's `restartPolicy`.

If you'd like your Container to be killed and restarted if a probe fails, then
specify a liveness probe, and specify a `restartPolicy` of Always or OnFailure.

If you'd like to start sending traffic to a Pod only when a probe succeeds,
specify a readiness probe. In this case, the readiness probe might be the same
as the liveness probe, but the existence of the readiness probe in the spec means
that the Pod will start without receiving any traffic and only start receiving
traffic after the probe starts succeeding.

If you want your Container to be able to take itself down for maintenance, you
can specify a readiness probe that checks an endpoint specific to readiness that
is different from the liveness probe.

Note that if you just want to be able to drain requests when the Pod is deleted,
you do not necessarily need a readiness probe; on deletion, the Pod automatically
puts itself into an unready state regardless of whether the readiness probe exists.
The Pod remains in the unready state while it waits for the Containers in the Pod
to stop.

## Pod and Container status

For detailed information about Pod Container status, see
[PodStatus](/docs/reference/generated/kubernetes-api/{{page.version}}/#podstatus-v1-core)
and
[ContainerStatus](/docs/reference/generated/kubernetes-api/{{page.version}}/#containerstatus-v1-core).
Note that the information reported as Pod status depends on the current
[ContainerState](/docs/reference/generated/kubernetes-api/{{page.version}}/#containerstatus-v1-core).

## Restart policy

A PodSpec has a `restartPolicy` field with possible values Always, OnFailure,
and Never. The default value is Always.
`restartPolicy` applies to all Containers in the Pod. `restartPolicy` only
refers to restarts of the Containers by the kubelet on the same node. Failed
Containers that are restarted by the kubelet are restarted with an exponential
back-off delay (10s, 20s, 40s ...) capped at five minutes, and is reset after ten
minutes of successful execution. As discussed in the
[Pods document](/docs/user-guide/pods/#durability-of-pods-or-lack-thereof),
once bound to a node, a Pod will never be rebound to another node.



## Pod lifetime

In general, Pods do not disappear until someone destroys them. This might be a
human or a controller. The only exception to
this rule is that Pods with a `phase` of Succeeded or Failed for more than some
duration (determined by the master) will expire and be automatically destroyed.

Three types of controllers are available:

- Use a [Job](/docs/concepts/jobs/run-to-completion-finite-workloads/) for Pods that are expected to terminate,
  for example, batch computations. Jobs are appropriate only for Pods with
  `restartPolicy` equal to OnFailure or Never.

- Use a [ReplicationController](/docs/concepts/workloads/controllers/replicationcontroller/),
  [ReplicaSet](/docs/concepts/workloads/controllers/replicaset/), or
  [Deployment](/docs/concepts/workloads/controllers/deployment/)
  for Pods that are not expected to terminate, for example, web servers.
  ReplicationControllers are appropriate only for Pods with a `restartPolicy` of
  Always.

- Use a [DaemonSet](/docs/concepts/workloads/controllers/daemonset/) for Pods that need to run one per
  machine, because they provide a machine-specific system service.

All three types of controllers contain a PodTemplate. It
is recommended to create the appropriate controller and let
it create Pods, rather than directly create Pods yourself. That is because Pods
alone are not resilient to machine failures, but controllers are.

If a node dies or is disconnected from the rest of the cluster, Kubernetes
applies a policy for setting the `phase` of all Pods on the lost node to Failed.

## Examples

### Advanced liveness probe example

Liveness probes are executed by the kubelet, so all requests are made in the
kubelet network namespace.

```yaml
apiVersion: v1
kind: Pod
metadata:
  labels:
    test: liveness
  name: liveness-http
spec:
  containers:
  - args:
    - /server
    image: k8s.gcr.io/liveness
    livenessProbe:
      httpGet:
        # when "host" is not defined, "PodIP" will be used
        # host: my-host
        # when "scheme" is not defined, "HTTP" scheme will be used. Only "HTTP" and "HTTPS" are allowed
        # scheme: HTTPS
        path: /healthz
        port: 8080
        httpHeaders:
        - name: X-Custom-Header
          value: Awesome
      initialDelaySeconds: 15
      timeoutSeconds: 1
    name: liveness
```

### Example states

   * Pod is running and has one Container. Container exits with success.
     * Log completion event.
     * If `restartPolicy` is:
       * Always: Restart Container; Pod `phase` stays Running.
       * OnFailure: Pod `phase` becomes Succeeded.
       * Never: Pod `phase` becomes Succeeded.

   * Pod is running and has one Container. Container exits with failure.
     * Log failure event.
     * If `restartPolicy` is:
       * Always: Restart Container; Pod `phase` stays Running.
       * OnFailure: Restart Container; Pod `phase` stays Running.
       * Never: Pod `phase` becomes Failed.

   * Pod is running and has two Containers. Container 1 exits with failure.
     * Log failure event.
     * If `restartPolicy` is:
       * Always: Restart Container; Pod `phase` stays Running.
       * OnFailure: Restart Container; Pod `phase` stays Running.
       * Never: Do not restart Container; Pod `phase` stays Running.
     * If Container 1 is not running, and Container 2 exits:
       * Log failure event.
       * If `restartPolicy` is:
         * Always: Restart Container; Pod `phase` stays Running.
         * OnFailure: Restart Container; Pod `phase` stays Running.
         * Never: Pod `phase` becomes Failed.

   * Pod is running and has one Container. Container runs out of memory.
     * Container terminates in failure.
     * Log OOM event.
     * If `restartPolicy` is:
       * Always: Restart Container; Pod `phase` stays Running.
       * OnFailure: Restart Container; Pod `phase` stays Running.
       * Never: Log failure event; Pod `phase` becomes Failed.

   * Pod is running, and a disk dies.
     * Kill all Containers.
     * Log appropriate event.
     * Pod `phase` becomes Failed.
     * If running under a controller, Pod is recreated elsewhere.

   * Pod is running, and its node is segmented out.
     * Node controller waits for timeout.
     * Node controller sets Pod `phase` to Failed.
     * If running under a controller, Pod is recreated elsewhere.

{% endcapture %}


{% capture whatsnext %}

* Get hands-on experience
  [attaching handlers to Container lifecycle events](/docs/tasks/configure-pod-container/attach-handler-lifecycle-event/).

* Get hands-on experience
  [configuring liveness and readiness probes](/docs/tasks/configure-pod-container/configure-liveness-readiness-probes/).

* Learn more about [Container lifecycle hooks](/docs/concepts/containers/container-lifecycle-hooks/).

{% endcapture %}

{% include templates/concept.md %}

