---
assignees:
- mikedanese

---

Updated: 4/14/2015

This document covers the lifecycle of a pod.  It is not an exhaustive document, but an introduction to the topic.

## Pod Phase

As consistent with the overall [API convention](https://github.com/kubernetes/kubernetes/tree/{{page.githubbranch}}/docs/devel/api-conventions.md#typical-status-properties), phase is a simple, high-level summary of the phase of the lifecycle of a pod. It is not intended to be a comprehensive rollup of observations of container-level or even pod-level conditions or other state, nor is it intended to be a comprehensive state machine.

The number and meanings of `PodPhase` values are tightly guarded.  Other than what is documented here, nothing should be assumed about pods with a given `PodPhase`.

* Pending: The pod has been accepted by the system, but one or more of the container images has not been created.  This includes time before being scheduled as well as time spent downloading images over the network, which could take a while.
* Running: The pod has been bound to a node, and all of the containers have been created.  At least one container is still running, or is in the process of starting or restarting.
* Succeeded: All containers in the pod have terminated in success, and will not be restarted.
* Failed: All containers in the pod have terminated, at least one container has terminated in failure (exited with non-zero exit status or was terminated by the system).
* Unknown: For some reason the state of the pod could not be obtained, typically due to an error in communicating with the host of the pod.

## Pod Conditions

A pod containing containers that specify readiness probes will also report the Ready condition. Condition status values may be `True`, `False`, or `Unknown`.

## Container Probes

A [Probe](https://godoc.org/k8s.io/kubernetes/pkg/api/v1#Probe) is a diagnostic performed periodically by the kubelet on a container. Specifically the diagnostic is one of three [Handlers](https://godoc.org/k8s.io/kubernetes/pkg/api/v1#Handler):

* `ExecAction`: executes a specified command inside the container expecting on success that the command exits with status code 0.
* `TCPSocketAction`: performs a tcp check against the container's IP address on a specified port expecting on success that the port is open.
* `HTTPGetAction`: performs an HTTP Get against the container's IP address on a specified port and path expecting on success that the response has a status code greater than or equal to 200 and less than 400.

Each probe will have one of three results:

* `Success`: indicates that the container passed the diagnostic.
* `Failure`: indicates that the container failed the diagnostic.
* `Unknown`: indicates that the diagnostic failed so no action should be taken.

The kubelet can optionally perform and react to two kinds of probes on running containers:

* `LivenessProbe`: indicates whether the container is *live*, i.e. running. If the LivenessProbe fails, the kubelet will kill the container and the container will be subjected to its [RestartPolicy](#restartpolicy). The default state of Liveness before the initial delay is `Success`. The state of Liveness for a container when no probe is provided is assumed to be `Success`.
* `ReadinessProbe`: indicates whether the container is *ready* to service requests. If the ReadinessProbe fails, the endpoints controller will remove the pod's IP address from the endpoints of all services that match the pod. The default state of Readiness before the initial delay is `Failure`. The state of Readiness for a container when no probe is provided is assumed to be `Success`.

### When should I use liveness or readiness probes?

If the process in your container is able to crash on its own whenever it encounters an issue or becomes unhealthy, you do not necessarily need a liveness probe - the kubelet will automatically perform the correct action in accordance with the RestartPolicy when the process crashes.

If you'd like your container to be killed and restarted if a probe fails, then specify a LivenessProbe and a RestartPolicy of `Always` or `OnFailure`.

If you'd like to start sending traffic to a pod only when a probe succeeds, specify a ReadinessProbe. In this case, the ReadinessProbe may be the same as the LivenessProbe, but the existence of the ReadinessProbe in the spec means that the pod will start without receiving any traffic and only start receiving traffic once the probe starts succeeding.

If a container wants the ability to take itself down for maintenance, you can specify a ReadinessProbe that checks an endpoint specific to readiness which is different than the LivenessProbe.

Note that if you just want to be able to drain requests when the pod is deleted, you do not necessarily need a ReadinessProbe - on deletion, the pod automatically puts itself into an unready state regardless of whether the ReadinessProbe exists or not while it waits for the containers in the pod to stop.

## Container Statuses

More detailed information about the current (and previous) container statuses can be found in [ContainerStatuses](https://godoc.org/k8s.io/kubernetes/pkg/api/v1#PodStatus). The information reported depends on the current [ContainerState](https://godoc.org/k8s.io/kubernetes/pkg/api/v1#ContainerState), which may be Waiting, Running, or Terminated.

## RestartPolicy

The possible values for RestartPolicy are `Always`, `OnFailure`, or `Never`. If RestartPolicy is not set, the default value is `Always`. RestartPolicy applies to all containers in the pod. RestartPolicy only refers to restarts of the containers by the Kubelet on the same node. Failed containers that are restarted by Kubelet, are restarted with an exponential back-off delay, the delay is in multiples of sync-frequency 0, 1x, 2x, 4x, 8x ... capped at 5 minutes and is reset after 10 minutes of successful execution. As discussed in the [pods document](/docs/user-guide/pods/#durability-of-pods-or-lack-thereof), once bound to a node, a pod will never be rebound to another node. This means that some kind of controller is necessary in order for a pod to survive node failure, even if just a single pod at a time is desired.

Three types of controllers are currently available:

- Use a [`Job`](/docs/user-guide/jobs/) for pods which are expected to terminate (e.g. batch computations).
- Use a [`ReplicationController`](/docs/user-guide/replication-controller/) for pods which are not expected to
  terminate (e.g. web servers).
- Use a [`DaemonSet`](/docs/admin/daemons/): Use for pods which need to run 1 per machine because they provide a
  machine-specific system service.
If you are unsure whether to use ReplicationController or Daemon, then see [Daemon Set versus
Replication Controller](/docs/admin/daemons/#daemon-set-versus-replication-controller).

`ReplicationController` is *only* appropriate for pods with `RestartPolicy = Always`.
`Job` is *only* appropriate for pods with `RestartPolicy` equal to `OnFailure` or `Never`.

All 3 types of controllers contain a PodTemplate, which has all the same fields as a Pod.
It is recommended to create the appropriate controller and let it create pods, rather than to
directly create pods yourself.  That is because pods alone are not resilient to machine failures,
but Controllers are.

## Pod lifetime

In general, pods which are created do not disappear until someone destroys them.  This might be a human or a `ReplicationController`, or another controller.  The only exception to this rule is that pods with a `PodPhase` of `Succeeded` or `Failed` for more than some duration (determined by the master) will expire and be automatically reaped.

If a node dies or is disconnected from the rest of the cluster, some entity within the system (call it the NodeController for now) is responsible for applying policy (e.g. a timeout) and marking any pods on the lost node as `Failed`.

## Examples

### Advanced livenessProbe example

Liveness probes are executed by `kubelet`, so all requests will be made within kubelet network namespace.

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
    image: gcr.io/google_containers/liveness
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

   * Pod is `Running`, 1 container, container exits success
     * Log completion event
     * If RestartPolicy is:
       * Always: restart container, pod stays `Running`
       * OnFailure: pod becomes `Succeeded`
       * Never: pod becomes `Succeeded`

   * Pod is `Running`, 1 container, container exits failure
     * Log failure event
     * If RestartPolicy is:
       * Always: restart container, pod stays `Running`
       * OnFailure: restart container, pod stays `Running`
       * Never: pod becomes `Failed`

   * Pod is `Running`, 2 containers, container 1 exits failure
     * Log failure event
     * If RestartPolicy is:
       * Always: restart container, pod stays `Running`
       * OnFailure: restart container, pod stays `Running`
       * Never: pod stays `Running`
     * When container 2 exits...
       * Log failure event
       * If RestartPolicy is:
         * Always: restart container, pod stays `Running`
         * OnFailure: restart container, pod stays `Running`
         * Never: pod becomes `Failed`

   * Pod is `Running`, container becomes OOM
     * Container terminates in failure
     * Log OOM event
     * If RestartPolicy is:
       * Always: restart container, pod stays `Running`
       * OnFailure: restart container, pod stays `Running`
       * Never: log failure event, pod becomes `Failed`

   * Pod is `Running`, a disk dies
     * All containers are killed
     * Log appropriate event
     * Pod becomes `Failed`
     * If running under a controller, pod will be recreated elsewhere

   * Pod is `Running`, its node is segmented out
     * NodeController waits for timeout
     * NodeController marks pod `Failed`
     * If running under a controller, pod will be recreated elsewhere

