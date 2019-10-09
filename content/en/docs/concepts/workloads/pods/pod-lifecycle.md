---
title: Pod Lifecycle
content_template: templates/concept
weight: 30
---

{{% capture overview %}}

{{< comment >}}Updated: 4/14/2015{{< /comment >}}
{{< comment >}}Edited and moved to Concepts section: 2/2/17{{< /comment >}}

This page describes the lifecycle of a Pod.

{{% /capture %}}


{{% capture body %}}

## Pod phase

A Pod's `status` field is a
[PodStatus](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#podstatus-v1-core)
object, which has a `phase` field.

The phase of a Pod is a simple, high-level summary of where the Pod is in its
lifecycle. The phase is not intended to be a comprehensive rollup of observations
of Container or Pod state, nor is it intended to be a comprehensive state machine.

The number and meanings of Pod phase values are tightly guarded.
Other than what is documented here, nothing should be assumed about Pods that
have a given `phase` value.

Here are the possible values for `phase`:

Value | Description
:-----|:-----------
`Pending` | The Pod has been accepted by the Kubernetes system, but one or more of the Container images has not been created. This includes time before being scheduled as well as time spent downloading images over the network, which could take a while.
`Running` | The Pod has been bound to a node, and all of the Containers have been created. At least one Container is still running, or is in the process of starting or restarting.
`Succeeded` | All Containers in the Pod have terminated in success, and will not be restarted.
`Failed` | All Containers in the Pod have terminated, and at least one Container has terminated in failure. That is, the Container either exited with non-zero status or was terminated by the system.
`Unknown` | For some reason the state of the Pod could not be obtained, typically due to an error in communicating with the host of the Pod.

## Pod conditions

A Pod has a PodStatus, which has an array of
[PodConditions](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#podcondition-v1-core)
through which the Pod has or has not passed. Each element of the PodCondition
array has six possible fields:

* The `lastProbeTime` field provides a timestamp for when the Pod condition
  was last probed.

* The `lastTransitionTime` field provides a timestamp for when the Pod
  last transitioned from one status to another.

* The `message` field is a human-readable message indicating details
  about the transition.
  
* The `reason` field is a unique, one-word, CamelCase reason for the condition's last transition.

* The `status` field is a string, with possible values "`True`", "`False`", and "`Unknown`".

* The `type` field is a string with the following possible values:

  * `PodScheduled`: the Pod has been scheduled to a node;
  * `Ready`: the Pod is able to serve requests and should be added to the load
    balancing pools of all matching Services;
  * `Initialized`: all [init containers](/docs/concepts/workloads/pods/init-containers)
    have started successfully;
  * `Unschedulable`: the scheduler cannot schedule the Pod right now, for example
    due to lack of resources or other constraints;
  * `ContainersReady`: all containers in the Pod are ready.



## Container probes

A [Probe](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#probe-v1-core) is a diagnostic
performed periodically by the [kubelet](/docs/admin/kubelet/)
on a Container. To perform a diagnostic,
the kubelet calls a
[Handler](https://godoc.org/k8s.io/kubernetes/pkg/api/v1#Handler) implemented by
the Container. There are three types of handlers:

* [ExecAction](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#execaction-v1-core):
  Executes a specified command inside the Container. The diagnostic
  is considered successful if the command exits with a status code of 0.

* [TCPSocketAction](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#tcpsocketaction-v1-core):
  Performs a TCP check against the Container's IP address on
  a specified port. The diagnostic is considered successful if the port is open.

* [HTTPGetAction](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#httpgetaction-v1-core):
  Performs an HTTP Get request against the Container's IP
  address on a specified port and path. The diagnostic is considered successful
  if the response has a status code greater than or equal to 200 and less than 400.

Each probe has one of three results:

* Success: The Container passed the diagnostic.
* Failure: The Container failed the diagnostic.
* Unknown: The diagnostic failed, so no action should be taken.

The kubelet can optionally perform and react to three kinds of probes on running
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

* `startupProbe`: Indicates whether the application within the Container is started.
   All other probes are disabled if a startup probe is provided, until it succeeds.
   If the startup probe fails, the kubelet kills the Container, and the Container
   is subjected to its [restart policy](#restart-policy). If a Container does not
   provide a startup probe, the default state is `Success`.

### When should you use a liveness probe?

{{< feature-state for_k8s_version="v1.0" state="stable" >}}

If the process in your Container is able to crash on its own whenever it
encounters an issue or becomes unhealthy, you do not necessarily need a liveness
probe; the kubelet will automatically perform the correct action in accordance
with the Pod's `restartPolicy`.

If you'd like your Container to be killed and restarted if a probe fails, then
specify a liveness probe, and specify a `restartPolicy` of Always or OnFailure.

### When should you use a readiness probe?

{{< feature-state for_k8s_version="v1.0" state="stable" >}}

If you'd like to start sending traffic to a Pod only when a probe succeeds,
specify a readiness probe. In this case, the readiness probe might be the same
as the liveness probe, but the existence of the readiness probe in the spec means
that the Pod will start without receiving any traffic and only start receiving
traffic after the probe starts succeeding.
If your Container needs to work on loading large data, configuration files, or migrations during startup, specify a readiness probe.

If you want your Container to be able to take itself down for maintenance, you
can specify a readiness probe that checks an endpoint specific to readiness that
is different from the liveness probe.

Note that if you just want to be able to drain requests when the Pod is deleted,
you do not necessarily need a readiness probe; on deletion, the Pod automatically
puts itself into an unready state regardless of whether the readiness probe exists.
The Pod remains in the unready state while it waits for the Containers in the Pod
to stop.

### When should you use a startup probe?

{{< feature-state for_k8s_version="v1.16" state="alpha" >}}

If your Container usually starts in more than `initialDelaySeconds + failureThreshold × periodSeconds`, you should specify a startup probe that checks the same endpoint as the liveness probe. The default for `periodSeconds` is 30s.
You should then set its `failureThreshold` high enough to allow the Container to start, without changing the default values of the liveness probe. This helps to protect against deadlocks.

For more information about how to set up a liveness, readiness, startup probe, see
[Configure Liveness, Readiness and Startup Probes](/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/).

## Pod and Container status

For detailed information about Pod Container status, see
[PodStatus](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#podstatus-v1-core)
and
[ContainerStatus](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#containerstatus-v1-core).
Note that the information reported as Pod status depends on the current
[ContainerState](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#containerstatus-v1-core).

## Container States

Once Pod is assigned to a node by scheduler, kubelet starts creating containers using container runtime.There are three possible states of containers: Waiting, Running and Terminated. To check state of container, you can use `kubectl describe pod [POD_NAME]`. State is displayed for each container within that Pod.

* `Waiting`: Default state of container. If container is not in either Running or Terminated state, it is in Waiting state. A container in Waiting state still runs its required operations, like pulling images, applying Secrets, etc. Along with this state, a message and reason about the state are displayed to provide more information.

    ```yaml
   ...
      State:          Waiting
       Reason:       ErrImagePull
	  ...
   ```
   
* `Running`: Indicates that the container is executing without issues. Once a container enters into Running, `postStart` hook (if any) is executed. This state also displays the time when the container entered Running state.  
   
   ```yaml
   ...
      State:          Running
       Started:      Wed, 30 Jan 2019 16:46:38 +0530
   ...
   ```   
       
* `Terminated`:  Indicates that the container completed its execution and has stopped running. A container enters into this when it has successfully completed execution or when it has failed for some reason. Regardless, a reason and exit code is displayed, as well as the container's start and finish time. Before a container enters into Terminated, `preStop` hook (if any) is executed.
  
   ```yaml
   ...
      State:          Terminated
        Reason:       Completed
        Exit Code:    0
        Started:      Wed, 30 Jan 2019 11:45:26 +0530
        Finished:     Wed, 30 Jan 2019 11:45:26 +0530
    ...
   ``` 

## Pod readiness gate

{{< feature-state for_k8s_version="v1.14" state="stable" >}}

In order to add extensibility to Pod readiness by enabling the injection of
extra feedback or signals into `PodStatus`, Kubernetes 1.11 introduced a
feature named [Pod ready++](https://github.com/kubernetes/enhancements/blob/master/keps/sig-network/0007-pod-ready%2B%2B.md).
You can use the new field `ReadinessGate` in the `PodSpec` to specify additional
conditions to be evaluated for Pod readiness. If Kubernetes cannot find such a
condition in the `status.conditions` field of a Pod, the status of the condition 
is default to "`False`". Below is an example:

```yaml
Kind: Pod
...
spec:
  readinessGates:
    - conditionType: "www.example.com/feature-1"
status:
  conditions:
    - type: Ready  # this is a builtin PodCondition
      status: "False"
      lastProbeTime: null
      lastTransitionTime: 2018-01-01T00:00:00Z
    - type: "www.example.com/feature-1"   # an extra PodCondition
      status: "False"
      lastProbeTime: null
      lastTransitionTime: 2018-01-01T00:00:00Z
  containerStatuses:
    - containerID: docker://abcd...
      ready: true
...
```

The new Pod conditions must comply with Kubernetes [label key format](/docs/concepts/overview/working-with-objects/labels/#syntax-and-character-set).
Since the `kubectl patch` command still doesn't support patching object status,
the new Pod conditions have to be injected through the `PATCH` action using
one of the [KubeClient libraries](/docs/reference/using-api/client-libraries/).

With the introduction of new Pod conditions, a Pod is evaluated to be ready **only**
when both the following statements are true:

* All containers in the Pod are ready.
* All conditions specified in `ReadinessGates` are "`True`".

To facilitate this change to Pod readiness evaluation, a new Pod condition
`ContainersReady` is introduced to capture the old Pod `Ready` condition.

In K8s 1.11, as an alpha feature, the "Pod Ready++" feature has to be explicitly enabled by
setting the `PodReadinessGates` [feature gate](/docs/reference/command-line-tools-reference/feature-gates/)
to true.

In K8s 1.12, the feature is enabled by default.

## Restart policy

A PodSpec has a `restartPolicy` field with possible values Always, OnFailure,
and Never. The default value is Always.
`restartPolicy` applies to all Containers in the Pod. `restartPolicy` only
refers to restarts of the Containers by the kubelet on the same node. Exited
Containers that are restarted by the kubelet are restarted with an exponential
back-off delay (10s, 20s, 40s ...) capped at five minutes, and is reset after ten
minutes of successful execution. As discussed in the
[Pods document](/docs/user-guide/pods/#durability-of-pods-or-lack-thereof),
once bound to a node, a Pod will never be rebound to another node.


## Pod lifetime

In general, Pods do not disappear until someone destroys them. This might be a
human or a controller. The only exception to
this rule is that Pods with a `phase` of Succeeded or Failed for more than some
duration (determined by `terminated-pod-gc-threshold` in the master) will expire and be automatically destroyed.

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

{{% /capture %}}


{{% capture whatsnext %}}

* Get hands-on experience
  [attaching handlers to Container lifecycle events](/docs/tasks/configure-pod-container/attach-handler-lifecycle-event/).

* Get hands-on experience
  [Configure Liveness, Readiness and Startup Probes](/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/).

* Learn more about [Container lifecycle hooks](/docs/concepts/containers/container-lifecycle-hooks/).

{{% /capture %}}



