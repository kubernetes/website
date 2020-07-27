---
title: 容器概述
content_type: concept
weight: 1
---

<!-- overview -->

<!--
Containers are a technnology for packaging the (compiled) code for an
application along with the dependencies it needs at run time. Each
container that you run is repeatable; the standardisation from having
dependencies included means that you get the same behavior wherever you
run it.

Containers decouple applications from underlying host infrastructure.
This makes deployment easier in different cloud or OS environments.
-->
容器是一种用来打包已经编译好的代码以及运行时需要的各个依赖项的技术。您运行的每个容器都是可以重复运行的；包含依赖项的标准化意味着您在任何地点运行它都会得到相同的结果。

容器将应用程序和底层主机架构解耦，这使得在不同的云或OS环境中部署应用更加容易。




<!-- body -->

<!--
## Container images
A [container image](/docs/concepts/containers/images/) is a ready-to-run
software package, containing everything needed to run an application:
the code and any runtime it requires, application and system libraries,
and default values for any essential settings.

By design, a container is immutable: you cannot change the code of a
container that is already running. If you have a containerized application
and want to make changes, you need to build a new container that includes
the change, then recreate the container to start from the updated image.
-->
## 容器镜像

[容器镜像](/docs/concepts/containers/images/)是一个现成的软件包，包含了运行应用程序时所需要的一切：代码和任何运行时所需的东西，应用程序和系统库，以及任何基本设置的默认值。

根据设计，容器是不可变的：你不能更改已经在运行的容器中的代码。如果您有一个容器化的应用程序，想要做一些更改，您需要构建一个新的容器，来包含所做的更改，然后使用已经更新过的镜像来重新创建容器。

<!--
## Container runtimes
-->
## 容器运行时

{{< glossary_definition term_id="container-runtime" length="all" >}}


## {{% heading "whatsnext" %}}

<!--
* Read about [container images](/docs/concepts/containers/images/)
* Read about [Pods](/docs/concepts/workloads/pods/)
-->
* 阅读有关[容器镜像](/docs/concepts/containers/images/)
* 阅读有关 [Pods](/docs/concepts/workloads/pods/)

