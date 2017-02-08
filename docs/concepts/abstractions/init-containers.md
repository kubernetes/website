---
assignees:
- erictune
title: Init Containers
---

{% capture overview %}
This page provides an overview of `Init Containers`, which are specialized
Containers that run before app Containers and can contain utilities or setup
scripts not present in an app image.
{% endcapture %}

{:toc}

{% include 1-5-beta.md %}

**Once the feature exits beta, Init Containers will be specified in the Pod
Spec alongside the app `containers` array.**

{% capture body %}
## Understanding Init Containers

A [Pod](/docs/concepts/abstractions/pod/) can have multiple Containers running
apps within it, but it can also have one or more Init Containers, which are run
before the app Containers are started.

Init Containers are exactly like regular Containers, except that they

1. always run to completion, and
2. must complete successfully before the next one is started.

If an Init Container fails for a Pod, Kubernetes will restart the Pod until the Init
Container succeeds. However, if a Pod is marked as `RestartNever`, the Pod will fail if
the Init Container fails.

To specify a container as an Init Container, add the annotation key
`pod.beta.kubernetes.io/init-containers`.  The annotation value should be a
JSON array of objects of type
[`v1.Container`](http://kubernetes.io/docs/api-reference/v1/definitions/#_v1_container).

The status of an Init Container is returned as another annotation,
`pod.beta.kubernetes.io/init-container-statuses`, which is an array of the
container statuses similar to the `status.containerStatuses` field.

### Differences from regular Containers

Init Containers support all the fields and features of app Containers,
including resource limits, volumes, and security settings. However, the
resource requests and limits for an Init Container are handled slightly
differently (See [Resources](#resources)).  Also, Init Containers do not
support readiness probes because they must run to completion before the Pod can
be ready.

If multiple Init Containers are specified for a Pod, those Containers are run
one at a time in sequential order. Each must succeed before the next can run.
When all of the Init Containers have run to completion, Kubernetes will
initialize the Pod and run the application Containers as usual.

## What can Init Containers be used for?

Since Init Containers have separate images from app Containers, they
have some advantages for start-up related code.

* They can contain and run utilities that are not desirable to include in the
  app Container image for security reasons.
* They can contain utilities or custom code for setup that is not present in an app
  image. For example, there is no need to make an image `FROM` another image just to use a tool like
  `sed`, `awk`, `python`, `dig`, etc. during setup).
* The application image builder and deployer roles can work independently without
  the need to jointly build a single app image.
* They have a different filesystem view (Linux namespaces) from app Containers,
  so they can be given access to Secrets that app Containers are not able to
  access.
* They run to completion before any app Containers start, whereas app
  Containers run in parallel, so Init Containers provide an easy way to block or
  delay the startup of app Containers until some set of preconditions are met.

### Examples
Here are some ideas for how to use Init Containers:

* Wait for a service to be created with a shell command like:
  `for i in {1..100}; do sleep 1; if dig myservice; then exit 0; fi; exit 1`
* Register this Pod with a remote server with a command like:
  `curl -X POST http://$MANAGEMENT_SERVICE_HOST:$MANAGEMENT_SERVICE_PORT/register -d 'instance=$(POD_NAME)&ip=$(POD_IP)'`
  using `POD_NAME` and `POD_IP` from the downward API.
* Wait for some time before starting the app Container with a command like `sleep 60`.
* Clone a git repository into a volume.
* Place values like a POD_IP into a configuration file, and run a template tool (e.g. jinja)
  to generate a configuration file to be consumed by the main app Container.

Complete usage examples can be found in the [StatefulSets documentation](/docs/concepts/abstractions/controllers/statefulsets/)
and the [Production Pods guide](/docs/user-guide/production-pods.md#handling-initialization).

## Detailed Behavior

Each Pod may have 0..N Init Containers defined along with the existing
1..M app Containers.

During the startup of a Pod, after the network and volumes are initialized, the Init
Containers are started in order. Each Container must exit successfully before
the next is started. If a Container fails to start (due to the runtime) or
exits with failure, it is retried according to the Pod `RestartPolicy`, except
when the Pod restart policy is `RestartPolicyAlways`, in which case just the Init
Containers use `RestartPolicyOnFailure`.

A Pod cannot be ready until all Init Containers have succeeded. The ports on an
Init Container are not aggregated under a service. A Pod that is being
initialized is in the `Pending` phase but should have a condition `Initializing`
set to `true`.

If the Pod is [restarted](#pod-restart-reasons) all Init Containers must
execute again.

Changes to the Init Container spec are limited to the container image field.
Altering an Init Container image field is equivalent to restarting the Pod.

Because Init Containers can be restarted, retried, or re-executed, Init Container
code should be idempotent.  In particular, code that writes to files on `EmptyDirs`
should be prepared for the possibility that an output file already exists.

An Init Container has all of the fields of an app Container. The following
fields are prohibited from being used on Init Containers by validation:

* `readinessProbe` - Init Containers must exit for Pod startup to continue,
  are not included in rotation, and therefore cannot define readiness distinct from
  completion.

Init Container authors may use `activeDeadlineSeconds` on the Pod and
`livenessProbe` on the Container to prevent Init Containers from failing
forever. The active deadline includes Init Containers.

The name of each app and Init Container in a Pod must be unique; a
validation error will be thrown for any Container sharing a name with another.

### Resources

Given the ordering and execution for Init Containers, the following rules
for resource usage apply:

* The highest of any particular resource request or limit defined on all Init
  Containers is the **effective init request/limit**
* The Pod's **effective request/limit** for a resource is the higher of:
  * sum of all app containers request/limit for a resource
  * effective init request/limit for a resource
* Scheduling is done based on effective requests/limits, which means
  Init Containers can reserve resources for initialization that are not used
  during the life of the Pod.
* QoS tier of the Pod's **effective QoS tier** is the QoS tier for Init Containers
  and app containers alike.

Quota and limits are applied based on the effective Pod request and
limit.

Pod level cGroups are based on the effective Pod request and limit, the
same as the scheduler.


### Pod Restart Reasons

A Pod may `restart`, causing re-execution of Init Containers, for the following
reasons:

* An Init Container image is changed by a user updating the Pod Spec -
  App Container image changes only restart the app Container.
* The Pod infrastructure container is restarted - this is uncommon and would
  have to be done by someone with root access to nodes.
* All containers in a Pod are terminated, requiring a restart
  (`RestartPolicyAlways`) AND the record of Init Container completion has been
  lost due to garbage collection.

## Support and compatibility

A cluster with Kubelet and Apiserver version 1.4.0 or greater supports Init
Containers with the beta annotations.  Support varies for other combinations of
Kubelet and Apiserver versions; see the [release notes](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG.md) for details.

{% endcapture %}

{% include templates/concept.md %}