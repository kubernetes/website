---
assignees:
- mikedanese
- thockin
title: Container Lifecycle Hooks
---

{% capture overview %}
This page describes the environment for Kubelet managed Containers on a Kubernetes node.
In contrast to the Kubernetes Cluster API, 
which provides an interface for creating and managing Containers,
the Kubernetes Container environment provides Containers with access to information about other objects in the Cluster via Hooks. 
This makes it possible to build applications that are *cluster aware*.

The following sections describe the Cluster information provided to Containers, 
as well as the hooks and lifecycle that allow Containers to interact with the management system.
{% endcapture %}

{:toc}

{% capture body %}
The Kubernetes Container environment defines a series of Hooks that are available to Containers that register the corresponding Hook handlers.
Container Hooks are analogous to operating system signals in a traditional process model;
however, their purpose is to make it easier to build reliable and scalable cloud applications in a Kubernetes cluster. 

Containers that participate in a cluster lifecycle are considered *cluster native*.


## Container environment

The Container environment provides several important resources to a Container.
This includes the filesystem that is available to the container, 
which is a combination of an [image](/docs/concepts/workloads/containers/images) and one or more [volumes](/docs/concepts/storage/volumes).

There are also two types of information that are available within the Container environment:

* Information about the container itself.
* Information about other objects in the system.

### Container information

The *hostname* of the container is the name of the pod in which the container is running. 
It is available through the `hostname` command or the [`gethostname`](http://man7.org/linux/man-pages/man2/gethostname.2.html) function call in libc.

The pod name and namespace are also available as environment variables through the [downward API](docs/tasks/configure-pod-container/downward-api-volume-expose-pod-information). 
Additionally, user defined environment variables from the pod definition are also available to the container, 
as are any environment variables specified statically in the Docker image.

### Cluster information

A list of all services that were running when a container was created via the Kubernetes Cluster API are available to that container as environment variables.
The set of environment variables matches the syntax of Docker links.

For a service named *foo* that maps to a container port named *bar*, 
the following variables are defined:

```shell
FOO_SERVICE_HOST=<the host the service is running on>
FOO_SERVICE_PORT=<the port the service is running on>
```

Services have dedicated IP addresses and are available to the container via DNS
if [DNS addon](http://releases.k8s.io/{{page.githubbranch}}/cluster/addons/dns/) is enabled. 
Because DNS is still not an enumerable protocol, 
environment variables are provided so that Containers can do discovery.

## Container hooks

Container hooks provide information to the container about events in its management lifecycle.  
For example, immediately after a container is started, it receives a `PostStart` hook.  
Hooks are broadcast in the container with information about the lifecycle of the container.  
They are different from the events provided by Docker or other systems which are output by the container.  
Output events provide a log of what has already happened.  
Input hooks, however, provide real-time notification about events that are happening, but without a historical log.

### Hook details

There are currently two Container hooks that are surfaced to containers:

`PostStart`

This hook is sent immediately after a container is created and notifies the container that it has been created.  
No parameters are passed to the handler. 
It is not guaranteed that the hook will execute before the container entrypoint.

`PreStop`

This hook is called immediately before a container is terminated. 
No parameters are passed to the handler. 
This event handler is blocking and must complete before the call to delete the container is sent to the Docker daemon. 
The `SIGTERM` notification sent by Docker is also sent. 
A more complete description of the termination behavior can be found in [Termination of Pods](/docs/user-guide/pods/#termination-of-pods).

### Hook handler execution

When a management hook occurs, 
the management system calls into any registered hook handlers in the container for that hook.  
These hook handler calls are synchronous in the context of the pod containing the container. 
This means that for a `PostStart` hook, 
the container entrypoint and hook fire asynchronously. 
However, if the hook takes too long to run or hangs, 
the container cannot reach a `running` state. 
The behavior is similar for a `PreStop` hook. 
If the hook hangs during execution, 
the Pod phase stays in a `running` state and never reaches `failed`. 
If a `PostStart` or `PreStop` hook fails, 
it kills the container.

Users should make their hook handlers as lightweight as possible;
however, there are cases where long running commands make sense, 
for example, when saving state prior to stopping a container.

### Hook delivery guarantees

Hook delivery is intended to be *at least once*, 
which means that a hook may be called multiple times for any given event, 
such as for `start` or `stop`.
It is up to the hook implementation to handle this correctly.

Generally, only single deliveries are made. 
If, for example, an http hook receiver is down and is unable to take traffic, 
there is no attempt to resend. 
In some rare cases, however, double delivery may occur.
For instance, if a Kubelet restarts in the middle of sending a hook, 
the hook may be resent after the Kubelet comes back up.


### Hook handler implementations

Hook handlers are the method by which Hooks are exposed to Containers.  
Kubernetes supports two types of Hook handlers that Containers can implement:

* Exec - Executes a specific command, such as `pre-stop.sh`, inside the cgroups and namespaces of the container.  
Resources consumed by the command are counted against the container.
* HTTP - Executes an HTTP request against a specific endpoint on the container.

### Debugging Hook handlers

The logs for a Hook handler are not exposed in Pod events. 
If a handler fails for some reason, it broadcasts an event. 
For `PostStart`, this is the `FailedPostStartHook` event. 
For `PreStop` this is the `FailedPreStopHook` event. 
You can see these events by running `kubectl describe pod <pod_name>`. 
Here is an example output of events from running this command:

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

{% endcapture %}


{% capture whatsnext %}
{% endcapture %}

{% include templates/concept.md %}