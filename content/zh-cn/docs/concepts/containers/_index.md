---
title: "容器"
weight: 40
description: 打包应用及其运行依赖环境的技术。
content_type: concept
no_list: true
---

<!-- overview -->
<!--
Each container that you run is repeatable; the standardization from having
dependencies included means that you get the same behavior wherever you
run it.

Containers decouple applications from underlying host infrastructure.
This makes deployment easier in different cloud or OS environments.
-->
每个运行的容器都是可重复的；
包含依赖环境在内的标准，意味着无论你在哪里运行它都会得到相同的行为。

容器将应用程序从底层的主机设施中解耦。
这使得在不同的云或 OS 环境中部署更加容易。

<!-- body -->
<!--
## Container images
A [container image](/docs/concepts/containers/images/) is a ready-to-run
software package, containing everything needed to run an application:
the code and any runtime it requires, application and system libraries,
and default values for any essential settings.

By design, a container is immutable: you cannot change the code of a
container that is already running. If you have a containerized application
and want to make changes, you need to build a new image that includes
the change, then recreate the container to start from the updated image.
-->

## 容器镜像 {#container-images}
[容器镜像](/zh/docs/concepts/containers/images/)是一个随时可以运行的软件包，
包含运行应用程序所需的一切：代码和它需要的所有运行时、应用程序和系统库，以及一些基本设置的默认值。

根据设计，容器是不可变的：你不能更改已经运行的容器的代码。
如果有一个容器化的应用程序需要修改，则需要构建包含更改的新镜像，然后再基于新构建的镜像重新运行容器。

<!-- ## Container runtimes -->
## 容器运行时  {#container-runtimes}

{{< glossary_definition term_id="container-runtime" length="all" >}}

## {{% heading "whatsnext" %}}
<!--
* Read about [container images](/docs/concepts/containers/images/)
* Read about [Pods](/docs/concepts/workloads/pods/)
-->

* 进一步阅读[容器镜像](/zh/docs/concepts/containers/images/)
* 进一步阅读 [Pods](/zh/docs/concepts/workloads/pods/)


