---
title: "容器"
weight: 40
description: 打包應用及其執行依賴環境的技術。
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
每個執行的容器都是可重複的；
包含依賴環境在內的標準，意味著無論你在哪裡執行它都會得到相同的行為。

容器將應用程式從底層的主機設施中解耦。
這使得在不同的雲或 OS 環境中部署更加容易。

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

## 容器映象 {#container-images}
[容器映象](/zh-cn/docs/concepts/containers/images/)是一個隨時可以執行的軟體包，
包含執行應用程式所需的一切：程式碼和它需要的所有執行時、應用程式和系統庫，以及一些基本設定的預設值。

根據設計，容器是不可變的：你不能更改已經執行的容器的程式碼。
如果有一個容器化的應用程式需要修改，則需要構建包含更改的新映象，然後再基於新構建的映象重新執行容器。

<!-- ## Container runtimes -->
## 容器執行時  {#container-runtimes}

{{< glossary_definition term_id="container-runtime" length="all" >}}

## {{% heading "whatsnext" %}}
<!--
* Read about [container images](/docs/concepts/containers/images/)
* Read about [Pods](/docs/concepts/workloads/pods/)
-->

* 進一步閱讀[容器映象](/zh-cn/docs/concepts/containers/images/)
* 進一步閱讀 [Pods](/zh-cn/docs/concepts/workloads/pods/)


