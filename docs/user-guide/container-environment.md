---
assignees:
- mikedanese
- thockin
title: Container Lifecycle Hooks
---

This document describes the environment for Kubelet managed containers on a Kubernetes node (kNode).  In contrast to the Kubernetes cluster API, which provides an API for creating and managing containers, the Kubernetes container environment provides the container access to information about what else is going on in the cluster.

This cluster information makes it possible to build applications that are *cluster aware*.
Additionally, the Kubernetes container environment defines a series of hooks that are surfaced to optional hook handlers defined as part of individual containers.  Container hooks are somewhat analogous to operating system signals in a traditional process model.   However these hooks are designed to make it easier to build reliable, scalable cloud applications in the Kubernetes cluster.  Containers that participate in this cluster lifecycle become *cluster native*.

Another important part of the container environment is the file system that is available to the container.  In Kubernetes, the filesystem is a combination of an [image](/docs/user-guide/images) and one or more [volumes](/docs/user-guide/volumes).

The following sections describe both the cluster information provided to containers, as well as the hooks and life-cycle that allows containers to interact with the management system.

* TOC
{:toc}

## Cluster Information

There are two types of information that are available within the container environment.  There is information about the container itself, and there is information about other objects in the system.

### Container Information

Currently, the Pod name for the pod in which the container is running is set as the hostname of the container, and is accessible through all calls to access the hostname within the container (e.g. the hostname command, or the [gethostname][1] function call in libc), but this is planned to change in the future and should not be used.

The Pod name and namespace are also available as environment variables via the [downward API](/docs/user-guide/downward-api).  Additionally, user-defined environment variables from the pod definition, are also available to the container, as are any environment variables specified statically in the Docker image.

In the future, we anticipate expanding this information with richer information about the container.  Examples include available memory, number of restarts, and in general any state that you could get from the call to GET /pods on the API server.

### Cluster Information

Currently the list of all services that are running at the time when the container was created via the Kubernetes Cluster API are available to the container as environment variables.  The set of environment variables matches the syntax of Docker links.

For a service named **foo** that maps to a container port named **bar**, the following variables are defined:

```shell
FOO_SERVICE_HOST=<the host the service is running on>
FOO_SERVICE_PORT=<the port the service is running on>
```

Services have dedicated IP address, and are also surfaced to the container via DNS (If [DNS addon](http://releases.k8s.io/{{page.githubbranch}}/cluster/addons/dns/) is enabled).  Of course DNS is still not an enumerable protocol, so we will continue to provide environment variables so that containers can do discovery.

## Container Hooks

Container hooks provide information to the container about events in its management lifecycle.  For example, immediately after a container is started, it receives a *PostStart* hook.  These hooks are broadcast *into* the container with information about the life-cycle of the container.  They are different from the events provided by Docker and other systems which are *output* from the container.  Output events provide a log of what has already happened.  Input hooks provide real-time notification about things that are happening, but no historical log.

### Hook Details

There are currently two container hooks that are surfaced to containers:

*PostStart*

This hook is sent immediately after a container is created.  It notifies the container that it has been created.  No parameters are passed to the handler. It is NOT guaranteed that the hook will execute before the container entrypoint.

*PreStop*

This hook is called immediately before a container is terminated. No parameters are passed to the handler. This event handler is blocking, and must complete before the call to delete the container is sent to the Docker daemon.  The SIGTERM notification sent by Docker is also still sent. A more complete description of termination behavior can be found in [Termination of Pods](/docs/user-guide/pods/#termination-of-pods).

### Hook Handler Execution

When a management hook occurs, the management system calls into any registered hook handlers in the container for that hook.  These hook handler calls are synchronous in the context of the pod containing the container. This means that for a `PostStart` hook, the container entrypoint and hook will fire asynchronously. However, if the hook takes a while to run or hangs, the container will never reach a "running" state. The behavior is similar for a `PreStop` hook. If the hook hangs during execution, the Pod phase will stay in a "running" state and never reach "failed." If a `PostStart` or `PreStop` hook fails, it will kill the container.

Typically we expect that users will make their hook handlers as lightweight as possible, but there are cases where long running commands make sense (e.g. saving state prior to container stop).

### Hook delivery guarantees

Hook delivery is intended to be "at least once", which means that a hook may be called multiple times for any given event (e.g. "start" or "stop") and it is up to the hook implementer to be able to handle this
correctly.

We expect double delivery to be rare, but in some cases if the Kubelet restarts in the middle of sending a hook, the hook may be resent after the Kubelet comes back up.

Likewise, we only make a single delivery attempt.  If (for example) an http hook receiver is down, and unable to take traffic, we do not make any attempts to resend.

Currently, there are (hopefully rare) scenarios where PostStart hooks may not be delivered.

### Hook Handler Implementations

Hook handlers are the way that hooks are surfaced to containers.  Containers can select the type of hook handler they would like to implement.  Kubernetes currently supports two different hook handler types:

   * Exec - Executes a specific command (e.g. pre-stop.sh) inside the cgroups and namespaces of the container.  Resources consumed by the command are counted against the container.

   * HTTP - Executes an HTTP request against a specific endpoint on the container.

[1]: http://man7.org/linux/man-pages/man2/gethostname.2.html

### Debugging Hook Handlers

Currently, the logs for a hook handler are not exposed in the pod events. If your handler fails for some reason, it will emit an event. For `PostStart`, this is the `FailedPostStartHook` event. For `PreStop` this is the `FailedPreStopHook` event. You can see these events by running `kubectl describe pod <pod_name>`. An example output of events from runing this command is below:

```
Events:
  FirstSeen	LastSeen	Count	From							SubobjectPath		Type		Reason		Message
  ---------	--------	-----	----							-------------		--------	------		-------
  1m		1m		1	{default-scheduler }								Normal		Scheduled	Successfully assigned test-1730497541-cq1d2 to gke-test-cluster-default-pool-a07e5d30-siqd
  1m		1m		1	{kubelet gke-test-cluster-default-pool-a07e5d30-siqd}	spec.containers{main}	Normal		Pulling		pulling image "test:1.0"
  1m		1m		1	{kubelet gke-test-cluster-default-pool-a07e5d30-siqd}	spec.containers{main}	Normal		Created		Created container with docker id 5c6a256a2567; Security:[seccomp=unconfined]
  1m		1m		1	{kubelet gke-test-cluster-default-pool-a07e5d30-siqd}	spec.containers{main}	Normal		Pulled		Successfully pulled image "test:1.0"
  1m		1m		1	{kubelet gke-test-cluster-default-pool-a07e5d30-siqd}	spec.containers{main}	Normal		Started		Started container with docker id 5c6a256a2567
  38s		38s		1	{kubelet gke-test-cluster-default-pool-a07e5d30-siqd}	spec.containers{main}	Normal		Killing		Killing container with docker id 5c6a256a2567: PostStart handler: Error executing in Docker Container: 1
  37s		37s		1	{kubelet gke-test-cluster-default-pool-a07e5d30-siqd}	spec.containers{main}	Normal		Killing		Killing container with docker id 8df9fdfd7054: PostStart handler: Error executing in Docker Container: 1
  38s		37s		2	{kubelet gke-test-cluster-default-pool-a07e5d30-siqd}				Warning		FailedSync	Error syncing pod, skipping: failed to "StartContainer" for "main" with RunContainerError: "PostStart handler: Error executing in Docker Container: 1"
  1m 		22s 		2 	{kubelet gke-test-cluster-default-pool-a07e5d30-siqd}	spec.containers{main}	Warning		FailedPostStartHook	
``` 