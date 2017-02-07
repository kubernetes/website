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

{% capture body %}
## Understanding Init Containers

A [Pod](/docs/user-guide/pods) can have multiple Containers running apps within
it, but it can also have one or more Init Containers, which are run before the
app Containers are started.

An Init Container is exactly like a regular Container, except that it
1. always runs to completion, and
2. must complete successfully before the next one is started.

If the Init Container fails, Kubernetes will restart the Pod until the Init
Container succeeds. If a Pod is marked as `RestartNever`, the Pod will fail if
the Init Container fails.

To specify a container as an Init Container, add the annotation key
`pod.beta.kubernetes.io/init-containers`.  The annotation value should be a
JSON array of objects of type
[`v1.Container`](http://kubernetes.io/docs/api-reference/v1/definitions/#_v1_container).

{% include 1-5-beta.md %}

**Once the feature exits beta, Init Containers will be specified in the Pod
Spec alongside the app `containers` array.**

The status of an Init Container is returned as another annotation,
`pod.beta.kubernetes.io/init-container-statuses` -- an array of the
container statuses similar to the `status.containerStatuses` field.

Init Containers have all of the fields of an app container and support all of
the same features, including resource limits, volumes, and security settings.
However, the resource requests and limits for an Init Container are handled
slightly differently (See [Resources](#resources)).  Init Containers do not
support readiness probes because they will run to completion before the Pod
can be ready.

If multiple Init Containers are specified for a Pod, those Containers run one at
a time in sequential order. Each must succeed before the next can run. Once all
Init Containers have run to completion, Kubernetes will initialize the Pod and run
the application containers as usual.

## What are Init Containers Good For?

Since Init Containers have separate images from app Containers, they
have some advantages for start-up related code. These include:

* being able to contain utilities that are not desirable to include in the app
  container image for security reasons,
* being able to contain utilities or custom code for setup that is not present in an app
  image, i.e. there is no need to make an image `FROM` another image just to use a tool like
  `sed`, `awk`, `python`, `dig`, etc during setup), and
* having the application image builder and deployer roles work independently without
  the need to jointly build a single app image.

They also have a different filesystem view (Linux namespaces) from app
Containers, so they can be given access to Secrets that app Containers are not
able to access.

Init Containers run to completion before any app Containers start, and app
Containers run in parallel, so Init Containers provide an easy way to block or
delay the startup of app Containers until some set of preconditions are met.

## Examples
Here are some ideas for how to use Init Containers:

* Wait for a service to be created with a shell command like:
  `for i in {1..100}; do sleep 1; if dig myservice; then exit 0; fi; exit 1`
* Register this Pod with a remote server with a command like:
  `curl -X POST http://$MANAGEMENT_SERVICE_HOST:$MANAGEMENT_SERVICE_PORT/register -d 'instance=$(POD_NAME)&ip=$(POD_IP)'`
  using `POD_NAME` and `POD_IP` from the downward API.
* Wait for some time before starting the app container with a command like `sleep 60`.
* Clone a git repository into a volume
* Place values like a POD_IP into a configuration file, and run a template tool (e.g. jinja)
  to generate a configuration file to be consumed by the main app contianer.

Complete usage examples can be found in the [StatefulSets documentation](/docs/concepts/abstractions/controllers/statefulsets/)
and the [Production Pods guide](/docs/user-guide/production-pods.md#handling-initialization).

{% endcapture %}

{% capture whatsnext %}
* Learn more about Init Containers:
  * Detailed Behavior
  * Support and Compatibility
{% endcapture %}

{% include templates/concept.md %}