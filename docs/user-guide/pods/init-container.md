---
assignees:
- erictune
title: Init Containers
---

* TOC
{:toc}

In addition to having one or more main containers (or **app containers**), a
pod can also have one or more **init containers** which run before the app
containers.   Init containers allow you to reduce and reorganize setup scripts
and "glue code".

## Overview

An init container is exactly like a regular container, except that it always
runs to completion and each init container must complete successfully before
the next one is started. If the init container fails, Kubernetes will restart
the pod until the init container succeeds. If a pod is marked as `RestartNever`,
the pod will fail if the init container fails.

You specify a container as an init container by adding an annotation
The annotation key is `pod.beta.kubernetes.io/init-containers`.  The annotation
value is a JSON array of [objects of type `v1.Container`
](http://kubernetes.io/docs/api-reference/v1/definitions/#_v1_container)

Once the feature exits beta, the init containers will be specified on the Pod
Spec alongside the app `containers` array.
The status of the init containers is returned as another annotation -
`pod.beta.kubernetes.io/init-container-statuses` -- as an array of the
container statuses (similar to the `status.containerStatuses` field).

Init containers support all of the same features as normal containers,
including resource limits, volumes, and security settings. The resource
requests and limits for an init container are [handled slightly differently](
#resources).  Init containers do not support readiness probes since they will
run to completion before the pod can be ready.
An init container has all of the fields of an app container.

If you specify multiple init containers for a pod, those containers run one at
a time in sequential order. Each must succeed before the next can run. Once all
init containers have run to completion, Kubernetes initializes the pod and runs
the application containers as usual.

## What are Init Containers Good For?

Because init containers have separate images from application containers, they
have some advantages for start-up related code. These include:

* they can contain utilities that are not desirable to include in the app container
  image for security reasons,
* they can contain utilities or custom code for setup that is not present in an app
  image.  (No need to make an image `FROM` another image just to use a tool like
  `sed`, `awk`, `python`, `dig`, etc during setup).
* the application image builder and the deployer roles can work independently without
  the need to jointly build a single app image.

Because init containers have different filesystem view (Linux namespaces) from
app containers, they can be given access to Secrets that the app containers are
not able to access.

Since init containers run to completion before any app containers start, and
since app containers run in parallel, they provide an easier way to block or
delay the startup of application containers until some precondition is met. 

Because init containers run in sequence and there can be multiple init containers,
they can be composed easily.

Here are some ideas for how to use init containers:
- Wait for a service to be created with a shell command like:
  `for i in {1..100}; do sleep 1; if dig myservice; then exit 0; fi; exit 1`
- Register this pod with a remote server with a command like:
  `curl -X POST http://$MANAGEMENT_SERVICE_HOST:$MANAGEMENT_SERVICE_PORT/register -d 'instance=$(POD_NAME)&ip=$(POD_IP)'`
  using `POD_NAME` and `POD_IP` from the downward API.
- Wait for some time before starting the app container with a command like `sleep 60`.
- Clone a git repository into a volume
- Place values like a POD_IP into a configuration file, and run a template tool (e.g. jinja)
  to generate a configuration file to be consumed by the main app contianer.
```

Complete usage examples can be found in the [StatefulSets
documentation](/docs/concepts/abstractions/controllers/statefulsets/) and the [Production Pods
guide](/docs/user-guide/production-pods.md#handling-initialization).


## Detailed Behavior

Each pod may have 0..N init containers defined along with the existing
1..M app containers.

On startup of the pod, after the network and volumes are initialized, the init
containers are started in order. Each container must exit successfully before
the next is invoked. If a container fails to start (due to the runtime) or
exits with failure, it is retried according to the pod RestartPolicy, except
when the pod restart policy is RestartPolicyAlways, in which case just the init
containers use RestartPolicyOnFailure.

A pod cannot be ready until all init containers have succeeded. The ports on an
init container are not aggregated under a service. A pod that is being
initialized is in the `Pending` phase but should has a condition `Initializing`
set to `true`.

If the pod is [restarted](#pod-restart-reasons) all init containers must
execute again.

Changes to the init container spec are limited to the container image field.
Altering an init container image field is equivalent to restarting the pod.

Because init containers can be restarted, retried, or reexecuted, init container
code should be idempotent.  In particular, code that writes to files on EmptyDirs
should be prepared for the possibility that an output file already exists.

An init container has all of the fields of an app container. The following
fields are prohibited from being used on init containers by validation:

* `readinessProbe` - init containers must exit for pod startup to continue,
  are not included in rotation, and so cannot define readiness distinct from
  completion.

Init container authors may use `activeDeadlineSeconds` on the pod and
`livenessProbe` on the container to prevent init containers from failing
forever. The active deadline includes init containers.

The name of each app and init container in a pod must be unique - it is a
validation error for any container to share a name.

### Resources

Given the ordering and execution for init containers, the following rules
for resource usage apply:

* The highest of any particular resource request or limit defined on all init
  containers is the **effective init request/limit**
* The pod's **effective request/limit** for a resource is the higher of:
  * sum of all app containers request/limit for a resource
  * effective init request/limit for a resource
* Scheduling is done based on effective requests/limits, which means
  init containers can reserve resources for initialization that are not used
  during the life of the pod.
* QoS tier of the pod's **effective QoS tier** is the QoS tier for init containers
  and app containers alike.

Quota and limits are applied based on the effective pod request and
limit.

Pod level cGroups are based on the effective pod request and limit, the
same as the scheduler.


## Pod Restart Reasons

A Pod may "restart", causing reexecution of init containers, for the following
reasons:

* An init container image is changed by a user updating the Pod Spec.
  * App container image changes only restart the app container.
* The pod infrastructure container is restarted
  * This is uncommon and would have to be done by someone with root access to nodes.
* All containers in a pod are terminated, requiring a restart (RestartPolicyAlways) AND the record of init container completion has been lost due to garbage collection.

## Support and compatibility

A cluster with Kubelet and Apiserver version 1.4.0 or greater supports init
containers with the beta annotations.  Support varies for other combinations of
Kubelet and Apiserver version; see the [release notes
](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG.md) for details.


