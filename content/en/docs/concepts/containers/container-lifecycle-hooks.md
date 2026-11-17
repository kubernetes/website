---
reviewers:
- mikedanese
- thockin
title: Container Lifecycle Hooks
content_type: concept
weight: 40
---

<!-- overview -->

This page describes how kubelet managed Containers can use the Container lifecycle hook framework
to run code triggered by events during their management lifecycle.

<!-- body -->

## Overview

Analogous to many programming language frameworks that have component lifecycle hooks, such as Angular,
Kubernetes provides Containers with lifecycle hooks.
The hooks enable Containers to be aware of events in their management lifecycle
and run code implemented in a handler when the corresponding lifecycle hook is executed.

## Container hooks

There are two hooks that are exposed to Containers:

`PostStart`

This hook is executed immediately after a container is created.
It runs **concurrently** with the container's `ENTRYPOINT` (main process),
meaning the hook may run before, during, or after the main process starts.

No parameters are passed to the handler.

{{< note >}}
While the hook runs concurrently with the container process,
it can delay container status updates;
the container may not transition to `Running` until the hook completes.
{{< /note >}}

`PreStop`

This hook is called immediately before a container is terminated due to an API request or management
event such as a liveness/startup probe failure, preemption, resource contention and others. A call
to the `PreStop` hook fails if the container is already in a terminated or completed state and the
hook must complete before the TERM signal to stop the container can be sent. The Pod's termination
grace period countdown begins before the `PreStop` hook is executed, so regardless of the outcome of
the handler, the container will eventually terminate within the Pod's termination grace period. No
parameters are passed to the handler.

A more detailed description of the termination behavior can be found in
[Termination of Pods](/docs/concepts/workloads/pods/pod-termination/).

`StopSignal`

The StopSignal lifecycle can be used to define a stop signal which would be sent to the container when it is
stopped. If you set this, it overrides any `STOPSIGNAL` instruction defined within the container image.

A more detailed description of termination behaviour with custom stop signals can be found in
[Stop Signals](/docs/concepts/workloads/pods/pod-termination/#pod-termination-stop-signals).

### Hook handler implementations

Containers can access a hook by implementing and registering a handler for that hook.
There are three types of hook handlers that can be implemented for Containers:

* Exec - Executes a specific command, such as `pre-stop.sh`, inside the cgroups and namespaces of the Container.
Resources consumed by the command are counted against the Container.
* HTTP - Executes an HTTP request against a specific endpoint on the Container.
* Sleep - Pauses the container for a specified duration. 

### Hook handler execution

When a Container lifecycle management hook is called,
the Kubernetes management system executes the handler according to the hook action,
`httpGet`, `tcpSocket` ([deprecated](/docs/reference/generated/kubernetes-api/v1.35/#lifecyclehandler-v1-core))
and `sleep` are executed by the kubelet process, and `exec` is executed in the container.

The `PostStart` hook handler call is initiated when a container is created,
meaning the container ENTRYPOINT and the `PostStart` hook are triggered simultaneously. 
(This means it generally doesn't make sense to use an HTTP hook for `PostStart`, since
there is no guarantee that the container's process will have fully started up when the
hook runs.)
If the `PostStart` hook takes too long to execute or if it hangs,
it can prevent the container from transitioning to a `running` state.

`PreStop` hooks are not executed asynchronously from the signal to stop the Container; the hook must
complete its execution before the TERM signal can be sent. If a `PreStop` hook hangs during
execution, the Pod's phase will be `Terminating` and remain there until the Pod is killed after its
`terminationGracePeriodSeconds` expires. This grace period applies to the total time it takes for
both the `PreStop` hook to execute and for the Container to stop normally. If, for example,
`terminationGracePeriodSeconds` is 60, and the hook takes 55 seconds to complete, and the Container
takes 10 seconds to stop normally after receiving the signal, then the Container will be killed
before it can stop normally, since `terminationGracePeriodSeconds` is less than the total time
(55+10) it takes for these two things to happen.

If either a `PostStart` or `PreStop` hook fails,
it kills the Container.

Users should make their hook handlers as lightweight as possible.
There are cases, however, when long running commands make sense,
such as when saving state prior to stopping a Container.

### Hook delivery guarantees

Hook delivery is intended to be *at least once*,
which means that a hook may be called multiple times for any given event,
such as for `PostStart` or `PreStop`.
It is up to the hook implementation to handle this correctly.

Generally, only single deliveries are made.
If, for example, an HTTP hook receiver is down and is unable to take traffic,
there is no attempt to resend.
In some rare cases, however, double delivery may occur.
For instance, if a kubelet restarts in the middle of sending a hook,
the hook might be resent after the kubelet comes back up.

### Debugging Hook handlers

The logs for a Hook handler are not exposed in Pod events.
If a handler fails for some reason, it broadcasts an event.
For `PostStart`, this is the `FailedPostStartHook` event,
and for `PreStop`, this is the `FailedPreStopHook` event.
To generate a failed `FailedPostStartHook` event yourself, modify the
[lifecycle-events.yaml](https://k8s.io/examples/pods/lifecycle-events.yaml)
file to change the postStart command to "badcommand" and apply it.
Here is some example output of the resulting events you see from running `kubectl describe pod lifecycle-demo`:

```
Events:
  Type     Reason               Age               From               Message
  ----     ------               ----              ----               -------
  Normal   Scheduled            45s               default-scheduler  Successfully assigned default/lifecycle-demo to hook-control-plane
  Normal   Pulled               42s               kubelet            spec.containers{lifecycle-demo-container}: Successfully pulled image "nginx" in 2.329s (2.329s including waiting). Image size: 63933865 bytes.
  Normal   Pulled               40s               kubelet            spec.containers{lifecycle-demo-container}: Successfully pulled image "nginx" in 436ms (436ms including waiting). Image size: 63933865 bytes.
  Normal   Pulled               27s               kubelet            spec.containers{lifecycle-demo-container}: Successfully pulled image "nginx" in 403ms (404ms including waiting). Image size: 63933865 bytes.
  Normal   Pulling              5s (x4 over 45s)  kubelet            spec.containers{lifecycle-demo-container}: Pulling image "nginx"
  Normal   Created              5s (x4 over 42s)  kubelet            spec.containers{lifecycle-demo-container}: Container created
  Normal   Pulled               5s                kubelet            spec.containers{lifecycle-demo-container}: Successfully pulled image "nginx" in 434ms (434ms including waiting). Image size: 63933865 bytes.
  Normal   Started              4s (x4 over 42s)  kubelet            spec.containers{lifecycle-demo-container}: Container started
  Warning  FailedPostStartHook  4s (x4 over 42s)  kubelet            spec.containers{lifecycle-demo-container}: PostStartHook failed
  Normal   Killing              4s (x4 over 42s)  kubelet            spec.containers{lifecycle-demo-container}: FailedPostStartHook
  Warning  BackOff              4s (x4 over 40s)  kubelet            spec.containers{lifecycle-demo-container}: Back-off restarting failed container lifecycle-demo-container in pod lifecycle-demo_default(7b71727e-b83d-4637-989e-37b9b9beb8d8)
```

The event does not say why the handler failed. The kubelet keeps the handler's error
and output out of the event message, so that sensitive data is not exposed through events.
To find the reason, check the kubelet's log on the node where the Pod is running.



## {{% heading "whatsnext" %}}


* Learn more about the [Container environment](/docs/concepts/containers/container-environment/).
* Get hands-on experience
  [attaching handlers to Container lifecycle events](/docs/tasks/configure-pod-container/attach-handler-lifecycle-event/).

