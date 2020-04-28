---
reviewers:
- erictune
- thockin
title: Containers overview
content_template: templates/concept
weight: 1
---

{{% capture overview %}}

Containers are a technnology for packaging the (compiled) code for an
application along with the dependencies it needs at run time. Each
container that you run is repeatable; the standardisation from having
dependencies included means that you get the same behavior wherever you
run it.

Containers decouple applications from underlying host infrastructure.
This makes deployment easier in different cloud or OS environments.

{{% /capture %}}


{{% capture body %}}

## Container images
A [container image](/docs/concepts/containers/images/) is a ready-to-run
software package, containing everything needed to run an application:
the code and any runtime it requires, application and system libraries,
and default values for any essential settings.

By design, a container is immutable: you cannot change the code of a
container that is already running. If you have a containerized application
and want to make changes, you need to build a new container that includes
the change, then recreate the container to start from the updated image.

## Container runtimes

{{< glossary_definition term_id="container-runtime" length="all" >}}

{{% /capture %}}
{{% capture whatsnext %}}
* Read about [container images](/docs/concepts/containers/images/)
* Read about [Pods](/docs/concepts/workloads/pods/)
{{% /capture %}}
