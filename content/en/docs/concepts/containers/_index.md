---
title: Containers
weight: 40
description: Technology for packaging an application along with its runtime dependencies.
reviewers:
- erictune
- thockin
content_type: concept
no_list: true
---

<!-- overview -->

Each container that you run is repeatable; the standardization from having
dependencies included means that you get the same behavior wherever you
run it.

Containers decouple applications from underlying host infrastructure.
This makes deployment easier in different cloud or OS environments.




<!-- body -->

## Container images
A [container image](/docs/concepts/containers/images/) is a ready-to-run
software package, containing everything needed to run an application:
the code and any runtime it requires, application and system libraries,
and default values for any essential settings.

By design, a container is immutable: you cannot change the code of a
container that is already running. If you have a containerized application
and want to make changes, you need to build a new image that includes
the change, then recreate the container to start from the updated image.

## Container runtimes

{{< glossary_definition term_id="container-runtime" length="all" >}}

## {{% heading "whatsnext" %}}

* Read about [container images](/docs/concepts/containers/images/)
* Read about [Pods](/docs/concepts/workloads/pods/)

