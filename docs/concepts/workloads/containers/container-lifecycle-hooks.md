---
assignees:
- mikedanese
- thockin
title: Container Lifecycle Hooks
---

{% capture overview %}
This page describes how Kubelet managed Containers can use the Container lifecycle hook framework
to run code triggered by events during their management lifecycle. 
{% endcapture %}

{:toc}

{% capture body %}
## Overview
Analogous to many programming language frameworks that have component lifecycle hooks, such as Angular,
Kubernetes provides Containers with lifecycle hooks.
The hooks enable Containers to be aware of events in their management lifecycle
and run code implemented in a handler when the corresponding lifecycle hook is executed.


## Container hooks

There are two hooks that are exposed to Containers:

`PostStart`

This hook executes immediately after a container is created;
however, there is no guarantee that the hook will execute before the container ENTRYPOINT.
No parameters are passed to the handler. 

`PreStop`

This hook is called immediately before a container is terminated and is blocking,
so it must complete before the call to delete the container can be sent. 
No parameters are passed to the handler. 

A more detailed description of the termination behavior can be found in [Termination of Pods](/docs/user-guide/pods/#termination-of-pods).

### Hook handler execution

When a Container lifecycle management hook is called, 
the Kubernetes management system executes the handler in the container registered for that hook.  

Hook handler calls are synchronous within the context of the Pod containing the container. 
This means that for a `PostStart` hook, 
the container ENTRYPOINT and hook fire asynchronously. 
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
