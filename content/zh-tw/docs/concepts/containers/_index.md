---
title: "容器"
weight: 40
description: 打包應用及其運行依賴環境的技術。
content_type: concept
card:
  name: concepts
  weight: 50
---
<!--
title: Containers
weight: 40
description: Technology for packaging an application along with its runtime dependencies.
reviewers:
- erictune
- thockin
content_type: concept
card:
  name: concepts
  weight: 50
-->

<!-- overview -->
<!--
This page will discuss containers and container images, as well as their use in operations and solution development.

The word _container_ is an overloaded term. Whenever you use the word, check whether your audience uses the same definition.

Each container that you run is repeatable; the standardization from having
dependencies included means that you get the same behavior wherever you
run it.

Containers decouple applications from the underlying host infrastructure.
This makes deployment easier in different cloud or OS environments.

Each {{< glossary_tooltip text="node" term_id="node" >}} in a Kubernetes
cluster runs the containers that form the
[Pods](/docs/concepts/workloads/pods/) assigned to that node.
Containers in a Pod are co-located and co-scheduled to run on the same node.
-->
本頁將討論容器和容器鏡像，以及它們在運維和解決方案開發中的應用。

**容器**是一個多義詞。每當你使用這個詞時，請確認你的受衆是否使用相同的定義。

每個運行的容器都是可重複的；
包含依賴環境在內的標準，意味着無論你在哪裏運行它都會得到相同的行爲。

容器將應用程序從底層的主機設施中解耦。
這使得在不同的雲或 OS 環境中部署更加容易。

Kubernetes 集羣中的每個{{< glossary_tooltip text="節點" term_id="node" >}}都會運行容器，
這些容器構成分配給該節點的 [Pod](/zh-cn/docs/concepts/workloads/pods/)。
單個 Pod 中的容器會在共同調度下，於同一位置運行在相同的節點上。

<!-- body -->
<!--
## Container images
A [container image](/docs/concepts/containers/images/) is a ready-to-run
software package containing everything needed to run an application:
the code and any runtime it requires, application and system libraries,
and default values for any essential settings.

Containers are intended to be stateless and
[immutable](https://glossary.cncf.io/immutable-infrastructure/):
you should not change
the code of a container that is already running. If you have a containerized
application and want to make changes, the correct process is to build a new
image that includes the change, then recreate the container to start from the
updated image.
-->

## 容器鏡像 {#container-images}
[容器鏡像](/zh-cn/docs/concepts/containers/images/)是一個隨時可以運行的軟件包，
包含運行應用程序所需的一切：代碼和它需要的所有運行時、應用程序和系統庫，以及一些基本設置的默認值。

容器旨在設計成無狀態且[不可變的](https://glossary.cncf.io/immutable-infrastructure/)：
你不應更改已經運行的容器的代碼。如果有一個容器化的應用程序需要修改，
正確的流程是：先構建包含更改的新鏡像，再基於新構建的鏡像重新運行容器。

<!-- ## Container runtimes -->
## 容器運行時  {#container-runtimes}

{{< glossary_definition term_id="container-runtime" length="all" >}}

<!--
Usually, you can allow your cluster to pick the default container runtime
for a Pod. If you need to use more than one container runtime in your cluster,
you can specify the [RuntimeClass](/docs/concepts/containers/runtime-class/)
for a Pod to make sure that Kubernetes runs those containers using a
particular container runtime.

You can also use RuntimeClass to run different Pods with the same container
runtime but with different settings.
-->
通常，你可以允許集羣爲一個 Pod 選擇其默認的容器運行時。如果你需要在集羣中使用多個容器運行時，
你可以爲一個 Pod 指定 [RuntimeClass](/zh-cn/docs/concepts/containers/runtime-class/)，
以確保 Kubernetes 會使用特定的容器運行時來運行這些容器。

你還可以通過 RuntimeClass，使用相同的容器運行時，但使用不同設定的配置來運行不同的 Pod。
