---
title: Termination of Pods
content_type: concept
weight: 45
---

<!-- overview -->

Because Pods represent processes running on nodes in the cluster, it is important to
allow those processes to gracefully terminate when they are no longer needed (rather
than being abruptly stopped with a `KILL` signal and having no chance to clean up).

The design aim is for you to be able to request deletion and know when processes
terminate, but also be able to ensure that deletes eventually complete.
When you request deletion of a Pod, the cluster records and tracks the intended grace period
before the Pod is allowed to be forcefully killed. With that forceful shutdown tracking in
place, the {{< glossary_tooltip text="kubelet" term_id="kubelet" >}} attempts graceful
shutdown.

<!-- body -->

Typically, with this graceful termination of the pod, kubelet makes requests to the container runtime
to attempt to stop the containers in the pod by first sending a TERM (aka. SIGTERM) signal,
with a grace period timeout, to the main process in each container.
The requests to stop the containers are processed by the container runtime asynchronously.
There is no guarantee to the order of processing for these requests.
Many container runtimes respect the `STOPSIGNAL` value defined in the container image and,
if different, send the container image configured STOPSIGNAL instead of TERM.
Once the grace period has expired, the KILL signal is sent to any remaining
processes, and the Pod is then deleted from the
{{< glossary_tooltip text="API Server" term_id="kube-apiserver" >}}. If the kubelet or the
container runtime's management service is restarted while waiting for processes to terminate, the
cluster retries from the start including the full original grace period.

## Stop Signals {#pod-termination-stop-signals}

The stop signal used to kill the container can be defined in the container image with the `STOPSIGNAL` instruction.
If no stop signal is defined in the image, the default signal of the container runtime
(SIGTERM for both containerd and CRI-O) would be used to kill the container.

### Defining custom stop signals

{{< feature-state feature_gate_name="ContainerStopSignals" >}}

If the `ContainerStopSignals` feature gate is enabled, you can configure a custom stop signal
for your containers from the container Lifecycle. We require the Pod's `spec.os.name` field
to be present as a requirement for defining stop signals in the container lifecycle.
The list of signals that are valid depends on the OS the Pod is scheduled to.
For Pods scheduled to Windows nodes, we only support SIGTERM and SIGKILL as valid signals.

Here is an example Pod spec defining a custom stop signal:

```yaml
spec:
  os:
    name: linux
  containers:
    - name: my-container
      image: container-image:latest
      lifecycle:
        stopSignal: SIGUSR1
```

If a stop signal is defined in the lifecycle, this will override the signal defined in the container image.
If no stop signal is defined in the container spec, the container would fall back to the default behavior.

## Pod Termination Flow {#pod-termination-flow}

Pod termination flow, illustrated with an example:

1. You use the `kubectl` tool to manually delete a specific Pod, with the default grace period
   (30 seconds).

1. The Pod in the API server is updated with the time beyond which the Pod is considered "dead"
   along with the grace period.
   If you use `kubectl describe` to check the Pod you're deleting, that Pod shows up as "Terminating".
   On the node where the Pod is running: as soon as the kubelet sees that a Pod has been marked
   as terminating (a graceful shutdown duration has been set), the kubelet begins the local Pod
   shutdown process.

   1. If one of the Pod's containers has defined a `preStop`
      [hook](/docs/concepts/containers/container-lifecycle-hooks) and the `terminationGracePeriodSeconds`
      in the Pod spec is not set to 0, the kubelet runs that hook inside of the container.
      The default `terminationGracePeriodSeconds` setting is 30 seconds.

      If the `preStop` hook is still running after the grace period expires, the kubelet requests
      a small, one-off grace period extension of 2 seconds.

   {{% note %}}
   If the `preStop` hook needs longer to complete than the default grace period allows,
   you must modify `terminationGracePeriodSeconds` to suit this.
   {{% /note %}}

   1. The kubelet triggers the container runtime to send a TERM signal to process 1 inside each
      container.

      There is [special ordering](#termination-with-sidecars) if the Pod has any
      {{< glossary_tooltip text="sidecar containers" term_id="sidecar-container" >}} defined.
      Otherwise, the containers in the Pod receive the TERM signal at different times and in
      an arbitrary order. If the order of shutdowns matters, consider using a `preStop` hook
      to synchronize (or switch to using sidecar containers).

1. At the same time as the kubelet is starting graceful shutdown of the Pod, the control plane
   evaluates whether to remove that shutting-down Pod from EndpointSlice objects,
   where those objects represent a {{< glossary_tooltip term_id="service" text="Service" >}}
   with a configured {{< glossary_tooltip text="selector" term_id="selector" >}}.
   {{< glossary_tooltip text="ReplicaSets" term_id="replica-set" >}} and other workload resources
   no longer treat the shutting-down Pod as a valid, in-service replica.

   Pods that shut down slowly should not continue to serve regular traffic and should start
   terminating and finish processing open connections.  Some applications need to go beyond
   finishing open connections and need more graceful termination, for example, session draining
   and completion.

   Any endpoints that represent the terminating Pods are not immediately removed from
   EndpointSlices, and a status indicating [terminating state](/docs/concepts/services-networking/endpoint-slices/#conditions)
   is exposed from the EndpointSlice API.
   Terminating endpoints always have their `ready` status as `false` (for backward compatibility
   with versions before 1.26), so load balancers will not use it for regular traffic.

   If traffic draining on terminating Pod is needed, the actual readiness can be checked as a
   condition `serving`.  You can find more details on how to implement connections draining in the
   tutorial [Pods And Endpoints Termination Flow](/docs/tutorials/services/pods-and-endpoint-termination-flow/)

   <a id="pod-termination-beyond-grace-period" />

1. The kubelet ensures the Pod is shut down and terminated

   1. When the grace period expires, if there is still any container running in the Pod, the
      kubelet triggers forcible shutdown.
      The container runtime sends `SIGKILL` to any processes still running in any container in the Pod.
      The kubelet also cleans up a hidden `pause` container if that container runtime uses one.
   1. The kubelet transitions the Pod into a terminal phase (`Failed` or `Succeeded` depending on
      the end state of its containers).
   1. The kubelet triggers forcible removal of the Pod object from the API server, by setting grace period
      to 0 (immediate deletion).
   1. The API server deletes the Pod's API object, which is then no longer visible from any client.

## Forced Pod termination {#pod-termination-forced}

{{< caution >}}
Forced deletions can be potentially disruptive for some workloads and their Pods.
{{< /caution >}}

By default, all deletes are graceful within 30 seconds. The `kubectl delete` command supports
the `--grace-period=<seconds>` option which allows you to override the default and specify your
own value.

Setting the grace period to `0` forcibly and immediately deletes the Pod from the API
server. If the Pod was still running on a node, that forcible deletion triggers the kubelet to
begin immediate cleanup.

Using kubectl, You must specify an additional flag `--force` along with `--grace-period=0`
in order to perform force deletions.

When a force deletion is performed, the API server does not wait for confirmation
from the kubelet that the Pod has been terminated on the node it was running on. It
removes the Pod in the API immediately so a new Pod can be created with the same
name. On the node, Pods that are set to terminate immediately will still be given
a small grace period before being force killed.

{{< caution >}}
Immediate deletion does not wait for confirmation that the running resource has been terminated.
The resource may continue to run on the cluster indefinitely.
{{< /caution >}}

If you need to force-delete Pods that are part of a StatefulSet, refer to the task
documentation for
[deleting Pods from a StatefulSet](/docs/tasks/run-application/force-delete-stateful-set-pod/).

## Pod shutdown and sidecar containers {#termination-with-sidecars}

If your Pod includes one or more
[sidecar containers](/docs/concepts/workloads/pods/sidecar-containers/)
(init containers with an `Always` restart policy), the kubelet will delay sending
the TERM signal to these sidecar containers until the last main container has fully terminated.
The sidecar containers will be terminated in the reverse order they are defined in the Pod spec.
This ensures that sidecar containers continue serving the other containers in the Pod until they
are no longer needed.

This means that slow termination of a main container will also delay the termination of the sidecar containers.
If the grace period expires before the termination process is complete, the Pod may enter [forced termination](#pod-termination-beyond-grace-period).
In this case, all remaining containers in the Pod will be terminated simultaneously with a short grace period.

Similarly, if the Pod has a `preStop` hook that exceeds the termination grace period, emergency termination may occur.
In general, if you have used `preStop` hooks to control the termination order without sidecar containers, you can now
remove them and allow the kubelet to manage sidecar termination automatically.

## Garbage collection of Pods {#pod-garbage-collection}

For failed Pods, the API objects remain in the cluster's API until a human or
{{< glossary_tooltip term_id="controller" text="controller" >}} process
explicitly removes them.

The Pod garbage collector (PodGC), which is a controller in the control plane, cleans up
terminated Pods (with a phase of `Succeeded` or `Failed`), when the number of Pods exceeds the
configured threshold (determined by `terminated-pod-gc-threshold` in the kube-controller-manager).
This avoids a resource leak as Pods are created and terminated over time.

Additionally, PodGC cleans up any Pods which satisfy any of the following conditions:

1. are orphan Pods - bound to a node which no longer exists,
1. are unscheduled terminating Pods,
1. are terminating Pods, bound to a non-ready node tainted with
   [`node.kubernetes.io/out-of-service`](/docs/reference/labels-annotations-taints/#node-kubernetes-io-out-of-service).

Along with cleaning up the Pods, PodGC will also mark them as failed if they are in a non-terminal
phase. Also, PodGC adds a Pod disruption condition when cleaning up an orphan Pod.
See [Pod disruption conditions](/docs/concepts/workloads/pods/disruptions#pod-disruption-conditions)
for more details.

## {{% heading "whatsnext" %}}

* Learn more about the [Pod lifecycle](/docs/concepts/workloads/pods/pod-lifecycle/).
* Learn more about [container lifecycle hooks](/docs/concepts/containers/container-lifecycle-hooks/),
  including the `preStop` hook used during termination.
* Learn more about [sidecar containers](/docs/concepts/workloads/pods/sidecar-containers/).
* Follow the tutorial [Pods And Endpoints Termination Flow](/docs/tutorials/services/pods-and-endpoint-termination-flow/)
  to learn how to drain connections during termination.
* Learn how to [safely drain a node](/docs/tasks/administer-cluster/safely-drain-node/).
* Learn how to [force delete Pods from a StatefulSet](/docs/tasks/run-application/force-delete-stateful-set-pod/).
