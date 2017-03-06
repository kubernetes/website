assignees:
- mikedanese
- thockin
title: Container Environment
---

{% capture overview %}
This page describes the resources available to containers in the Container Environment. 
{% endcapture %}

{:toc}

{% capture body %}
## Container environment

The Kubernetes Container Environment provides several important resources to containers:

* A filesystem, which is a combination of an [image](/docs/concepts/workloads/containers/images) and one or more [volumes](/docs/concepts/storage/volumes).
* Information about the container itself.
* Information about other objects in the cluster.

### Container information

The *hostname* of a container is the name of the pod in which the container is running.
It is available through the `hostname` command or the
[`gethostname`](http://man7.org/linux/man-pages/man2/gethostname.2.html)
function call in libc.

The pod name and namespace are available as environment variables through the
[downward API](docs/tasks/configure-pod-container/downward-api-volume-expose-pod-information).

User defined environment variables from the pod definition are also available to the container,
as are any environment variables specified statically in the Docker image.

### Cluster information

A list of all services that were running when a container was created are available to that container as environment variables.
Those environment variables match the syntax of Docker links.

For a service named *foo* that maps to a container port named *bar*,
the following variables are defined:

```shell
FOO_SERVICE_HOST=<the host the service is running on>
FOO_SERVICE_PORT=<the port the service is running on>
```

Services have dedicated IP addresses and are available to the container via DNS,
if [DNS addon](http://releases.k8s.io/{{page.githubbranch}}/cluster/addons/dns/) is enabled. 
Because DNS is still not an enumerable protocol, however,
environment variables are provided to enable Containers to do discovery.

{% endcapture %}

{% capture whatsnext %}

* Learn more about [Container lifecycle hooks](/docs/concepts/workloads/containers/container-lifecycle-hooks.md).
* Get hands-on experience
  [attaching handlers to Container lifecycle events](/docs/tasks/configure-pod-container/attach-handler-lifecycle-event/).

{% endcapture %}

{% include templates/concept.md %}