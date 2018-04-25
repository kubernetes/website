---
reviewers:
- mikedanese
- thockin
title: Container Environment Variables
---

{% capture overview %}

This page describes the resources available to Containers in the Container environment. 

{% endcapture %}

{:toc}

{% capture body %}

## Container environment

The Kubernetes Container environment provides several important resources to Containers:

* A filesystem, which is a combination of an [image](/docs/concepts/containers/images/) and one or more [volumes](/docs/concepts/storage/volumes/).
* Information about the Container itself.
* Information about other objects in the cluster.

### Container information

The *hostname* of a Container is the name of the Pod in which the Container is running.
It is available through the `hostname` command or the
[`gethostname`](http://man7.org/linux/man-pages/man2/gethostname.2.html)
function call in libc.

The Pod name and namespace are available as environment variables through the
[downward API](/docs/tasks/inject-data-application/downward-api-volume-expose-pod-information/).

User defined environment variables from the Pod definition are also available to the Container,
as are any environment variables specified statically in the Docker image.

### Cluster information

A list of all services that were running when a Container was created is available to that Container as environment variables.
Those environment variables match the syntax of Docker links.

For a service named *foo* that maps to a Container named *bar*,
the following variables are defined:

```shell
FOO_SERVICE_HOST=<the host the service is running on>
FOO_SERVICE_PORT=<the port the service is running on>
```

Services have dedicated IP addresses and are available to the Container via DNS,
if [DNS addon](http://releases.k8s.io/{{page.githubbranch}}/cluster/addons/dns/) is enabled. 

{% endcapture %}

{% capture whatsnext %}

* Learn more about [Container lifecycle hooks](/docs/concepts/containers/container-lifecycle-hooks/).
* Get hands-on experience
  [attaching handlers to Container lifecycle events](/docs/tasks/configure-pod-container/attach-handler-lifecycle-event/).

{% endcapture %}

{% include templates/concept.md %}
