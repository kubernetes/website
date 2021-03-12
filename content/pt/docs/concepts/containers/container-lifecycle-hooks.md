---
title: Ciclos de Vida do Contêiner
content_type: concept
weight: 30
---

<!-- overview -->

Essa página descreve como os contêineres gerenciados pelo _kubelet_ podem usar a estrutura de _hook_ de ciclo de vida do contêiner para executar código acionado por eventos durante seu ciclo de vida de gerenciamento. 


<!-- body -->

## Visão Geral

Análogo a muitas estruturas de linguagem de programação que tem  _hooks_ de ciclo de vida de componentes, como angular,
o Kubernetes fornece aos contêineres _hooks_ de ciclo de vida.
Os _hooks_ permitem que os contêineres estejam cientes dos eventos em seu ciclo de vida de gerenciamento
e executem código implementado em um manipulador quando o _hook_ de ciclo de vida correspondente é executado.

## Hooks do contêiner

Existem dois _hooks_ que são expostos para os contêiners:

`PostStart`

This hook is executed immediately after a container is created.
However, there is no guarantee that the hook will execute before the container ENTRYPOINT.
No parameters are passed to the handler.

`PreStop`

This hook is called immediately before a container is terminated due to an API request or management
event such as a liveness/startup probe failure, preemption, resource contention and others. A call
to the `PreStop` hook fails if the container is already in a terminated or completed state and the
hook must complete before the TERM signal to stop the container can be sent. The Pod's termination
grace period countdown begins before the `PreStop` hook is executed, so regardless of the outcome of
the handler, the container will eventually terminate within the Pod's termination grace period. No
parameters are passed to the handler.

A more detailed description of the termination behavior can be found in
[Termination of Pods](/docs/concepts/workloads/pods/pod-lifecycle/#pod-termination).

### Hook handler implementations

Containers can access a hook by implementing and registering a handler for that hook.
There are two types of hook handlers that can be implemented for Containers:

* Exec - Executes a specific command, such as `pre-stop.sh`, inside the cgroups and namespaces of the Container.
Resources consumed by the command are counted against the Container.
* HTTP - Executes an HTTP request against a specific endpoint on the Container.

### Hook handler execution

When a Container lifecycle management hook is called,
the Kubernetes management system execute the handler according to the hook action,
`httpGet` and `tcpSocket` are executed by the kubelet process, and `exec` is executed in the container.

Hook handler calls are synchronous within the context of the Pod containing the Container.
This means that for a `PostStart` hook,
the Container ENTRYPOINT and hook fire asynchronously.
However, if the hook takes too long to run or hangs,
the Container cannot reach a `running` state.

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
You can see these events by running `kubectl describe pod <pod_name>`.
Here is some example output of events from running this command:

```
Events:
  FirstSeen  LastSeen  Count  From                                                   SubObjectPath          Type      Reason               Message
  ---------  --------  -----  ----                                                   -------------          --------  ------               -------
  1m         1m        1      {default-scheduler }                                                          Normal    Scheduled            Successfully assigned test-1730497541-cq1d2 to gke-test-cluster-default-pool-a07e5d30-siqd
  1m         1m        1      {kubelet gke-test-cluster-default-pool-a07e5d30-siqd}  spec.containers{main}  Normal    Pulling              pulling image "test:1.0"
  1m         1m        1      {kubelet gke-test-cluster-default-pool-a07e5d30-siqd}  spec.containers{main}  Normal    Created              Created container with docker id 5c6a256a2567; Security:[seccomp=unconfined]
  1m         1m        1      {kubelet gke-test-cluster-default-pool-a07e5d30-siqd}  spec.containers{main}  Normal    Pulled               Successfully pulled image "test:1.0"
  1m         1m        1      {kubelet gke-test-cluster-default-pool-a07e5d30-siqd}  spec.containers{main}  Normal    Started              Started container with docker id 5c6a256a2567
  38s        38s       1      {kubelet gke-test-cluster-default-pool-a07e5d30-siqd}  spec.containers{main}  Normal    Killing              Killing container with docker id 5c6a256a2567: PostStart handler: Error executing in Docker Container: 1
  37s        37s       1      {kubelet gke-test-cluster-default-pool-a07e5d30-siqd}  spec.containers{main}  Normal    Killing              Killing container with docker id 8df9fdfd7054: PostStart handler: Error executing in Docker Container: 1
  38s        37s       2      {kubelet gke-test-cluster-default-pool-a07e5d30-siqd}                         Warning   FailedSync           Error syncing pod, skipping: failed to "StartContainer" for "main" with RunContainerError: "PostStart handler: Error executing in Docker Container: 1"
  1m         22s       2      {kubelet gke-test-cluster-default-pool-a07e5d30-siqd}  spec.containers{main}  Warning   FailedPostStartHook
```



## {{% heading "whatsnext" %}}


* Learn more about the [Container environment](/docs/concepts/containers/container-environment/).
* Get hands-on experience
  [attaching handlers to Container lifecycle events](/docs/tasks/configure-pod-container/attach-handler-lifecycle-event/).

