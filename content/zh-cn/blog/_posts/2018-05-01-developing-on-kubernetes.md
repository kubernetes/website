---
title: 在 Kubernetes 上开发
date: 2018-05-01
slug: developing-on-kubernetes
---

<!--
---
title: Developing on Kubernetes
date: 2018-05-01
slug: developing-on-kubernetes
---
-->

<!--
**Authors**: [Michael Hausenblas](https://twitter.com/mhausenblas) (Red Hat), [Ilya Dmitrichenko](https://twitter.com/errordeveloper) (Weaveworks)
-->
**作者**： [Michael Hausenblas](https://twitter.com/mhausenblas) (Red Hat), [Ilya Dmitrichenko](https://twitter.com/errordeveloper) (Weaveworks)

<!-- 
How do you develop a Kubernetes app? That is, how do you write and test an app that is supposed to run on Kubernetes? This article focuses on the challenges, tools and methods you might want to be aware of to successfully write Kubernetes apps alone or in a team setting.
-->

您将如何开发一个 Kubernetes 应用？也就是说，您如何编写并测试一个要在 Kubernetes 上运行的应用程序？本文将重点介绍在独自开发或者团队协作中，您可能希望了解到的为了成功编写 Kubernetes 应用程序而需面临的挑战，工具和方法。

<!--
We’re assuming you are a developer, you have a favorite programming language, editor/IDE, and a testing framework available. The overarching goal is to introduce minimal changes to your current workflow when developing the app for Kubernetes. For example, if you’re a Node.js developer and are used to a hot-reload setup—that is, on save in your editor the running app gets automagically updated—then dealing with containers and container images, with container registries, Kubernetes deployments, triggers, and more can not only be overwhelming but really take all the fun out if it.
-->

我们假定您是一位开发人员，有您钟爱的编程语言，编辑器/IDE（集成开发环境），以及可用的测试框架。在针对 Kubernetes 开发应用时，最重要的目标是减少对当前工作流程的影响，改变越少越好，尽量做到最小。举个例子，如果您是 Node.js 开发人员，习惯于那种热重载的环境 - 也就是说您在编辑器里一做保存，正在运行的程序就会自动更新 - 那么跟容器、容器镜像或者镜像仓库打交道，又或是跟 Kubernetes 部署、triggers 以及更多头疼东西打交道，不仅会让人难以招架也真的会让开发过程完全失去乐趣。

<!--
In the following, we’ll first discuss the overall development setup, then review tools of the trade, and last but not least do a hands-on walkthrough of three exemplary tools that allow for iterative, local app development against Kubernetes.
-->

在下文中，我们将首先讨论 Kubernetes 总体开发环境，然后回顾常用工具，最后进行三个示例性工具的实践演练。这些工具允许针对 Kubernetes 进行本地应用程序的开发和迭代。

<!--
## Where to run your cluster?
-->

## 您的集群运行在哪里？

<!--
As a developer you want to think about where the Kubernetes cluster you’re developing against runs as well as where the development environment sits. Conceptually there are four development modes:
-->

作为开发人员，您既需要考虑所针对开发的 Kubernetes 集群运行在哪里，也需要思考开发环境如何配置。概念上，有四种开发模式：

![Dev Modes](/images/blog/2018-05-01-developing-on-kubernetes/dok-devmodes_preview.png)

<!--
A number of tools support pure offline development including Minikube, Docker for Mac/Windows, Minishift, and the ones we discuss in detail below. Sometimes, for example, in a microservices setup where certain microservices already run in the cluster, a proxied setup (forwarding traffic into and from the cluster) is preferable and Telepresence is an example tool in this category. The live mode essentially means you’re building and/or deploying against a remote cluster and, finally, the pure online mode means both your development environment and the cluster are remote, as this is the case with, for example, [Eclipse Che](https://www.eclipse.org/che/docs/che-7/introduction-to-eclipse-che/) or [Cloud 9](https://github.com/errordeveloper/k9c). Let’s now have a closer look at the basics of offline development: running Kubernetes locally.
-->

许多工具支持纯 offline 开发，包括 Minikube、Docker（Mac 版/Windows 版）、Minishift 以及下文中我们将详细讨论的几种。有时，比如说在一个微服务系统中，已经有若干微服务在运行，proxied 模式（通过转发把数据流传进传出集群）就非常合适，Telepresence 就是此类工具的一个实例。live 模式，本质上是您基于一个远程集群进行构建和部署。最后，纯 online 模式意味着您的开发环境和运行集群都是远程的，典型的例子是 [Eclipse Che](https://www.eclipse.org/che/docs/che-7/introduction-to-eclipse-che/) 或者 [Cloud 9](https://github.com/errordeveloper/k9c)。现在让我们仔细看看离线开发的基础：在本地运行 Kubernetes。

<!--
[Minikube](/docs/getting-started-guides/minikube/) is a popular choice for those who prefer to run Kubernetes in a local VM. More recently Docker for [Mac](https://docs.docker.com/docker-for-mac/kubernetes/) and [Windows](https://docs.docker.com/docker-for-windows/kubernetes/) started shipping Kubernetes as an experimental package (in the “edge” channel). Some reasons why you may want to prefer using Minikube over the Docker desktop option are:
-->

[Minikube](/docs/getting-started-guides/minikube/) 在更加喜欢于本地 VM 上运行 Kubernetes 的开发人员中，非常受欢迎。不久前，Docker 的 [Mac](https://docs.docker.com/docker-for-mac/kubernetes/) 版和 [Windows](https://docs.docker.com/docker-for-windows/kubernetes/) 版，都试验性地开始自带 Kubernetes（需要下载 “edge” 安装包）。在两者之间，以下原因也许会促使您选择 Minikube 而不是 Docker 桌面版：

<!--
* You already have Minikube installed and running
* You prefer to wait until Docker ships a stable package
* You’re a Linux desktop user
* You are a Windows user who doesn’t have Windows 10 Pro with Hyper-V
-->

* 您已经安装了 Minikube 并且它运行良好
* 您想等到 Docker 出稳定版本
* 您是 Linux 桌面用户
* 您是 Windows 用户，但是没有配有 Hyper-V 的 Windows 10 Pro

<!--
Running a local cluster allows folks to work offline and that you don’t have to pay for using cloud resources. Cloud provider costs are often rather affordable and free tiers exists, however some folks prefer to avoid having to approve those costs with their manager as well as potentially incur unexpected costs, for example, when leaving cluster running over the weekend.
-->

运行一个本地集群，开发人员可以离线工作，不用支付云服务。云服务收费一般不会太高，并且免费的等级也有，但是一些开发人员不喜欢为了使用云服务而必须得到经理的批准，也不愿意支付意想不到的费用，比如说忘了下线而集群在周末也在运转。

<!--
Some developers prefer to use a remote Kubernetes cluster, and this is usually to allow for larger compute and storage capacity and also enable collaborative workflows more easily. This means it’s easier for you to pull in a colleague to help with debugging or share access to an app in the team. Additionally, for some developers it can be critical to mirror production environment as closely as possible, especially when it comes down to external cloud services, say,  proprietary databases, object stores, message queues, external load balancer, or mail delivery systems.
-->

有些开发人员却更喜欢远程的 Kubernetes 集群，这样他们通常可以获得更大的计算能力和存储容量，也简化了协同工作流程。您可以更容易的拉上一个同事来帮您调试，或者在团队内共享一个应用的使用。再者，对某些开发人员来说，尽可能的让开发环境类似生产环境至关重要，尤其是您依赖外部厂商的云服务时，如：专有数据库、云对象存储、消息队列、外商的负载均衡器或者邮件投递系统。

<!--
In summary, there are good reasons for you to develop against a local cluster as well as a remote one. It very much depends on in which phase you are: from early prototyping and/or developing alone to integrating a set of more stable microservices.
-->

总之，无论您选择本地或者远程集群，理由都足够多。这很大程度上取决于您所处的阶段：从早期的原型设计/单人开发到后期面对一批稳定微服务的集成。

<!--
Now that you have a basic idea of the options around the runtime environment, let’s move on to how to iteratively develop and deploy your app.
-->

既然您已经了解到运行环境的基本选项，那么我们就接着讨论如何迭代式的开发并部署您的应用。

<!--
## The tools of the trade
-->

## 常用工具

<!--
We are now going to review tooling allowing you to develop apps on Kubernetes with the focus on having minimal impact on your existing workflow. We strive to provide an unbiased description including implications of using each of the tools in general terms.
-->

我们现在回顾既可以允许您可以在 Kubernetes 上开发应用程序又尽可能最小地改变您现有的工作流程的一些工具。我们致力于提供一份不偏不倚的描述，也会提及使用某个工具将会意味着什么。

<!--
Note that this is a tricky area since even for established technologies such as, for example, JSON vs YAML vs XML or REST vs gRPC vs SOAP a lot depends on your background, your preferences and organizational settings. It’s even harder to compare tooling in the Kubernetes ecosystem as things evolve very rapidly and new tools are announced almost on a weekly basis; during the preparation of this post alone, for example, [Gitkube](https://gitkube.sh/) and [Watchpod](https://github.com/MinikubeAddon/watchpod) came out. To cover these new tools as well as related, existing tooling such as [Weave Flux](https://github.com/weaveworks/flux) and OpenShift’s [S2I](https://docs.openshift.com/container-platform/3.9/creating_images/s2i.html) we are planning a follow-up blog post to the one you’re reading.
-->

请注意这很棘手，因为即使在成熟定型的技术中做选择，比如说在 JSON、YAML、XML、REST、gRPC 或者 SOAP 之间做选择，很大程度也取决于您的背景、喜好以及公司环境。在 Kubernetes 生态系统内比较各种工具就更加困难，因为技术发展太快，几乎每周都有新工具面市；举个例子，仅在准备这篇博客的期间，[Gitkube](https://gitkube.sh/) 和 [Watchpod](https://github.com/MinikubeAddon/watchpod) 相继出品。为了进一步覆盖到这些新的，以及一些相关的已推出的工具，例如 [Weave Flux](https://github.com/weaveworks/flux) 和 OpenShift 的 [S2I](https://docs.openshift.com/container-platform/3.9/creating_images/s2i.html)，我们计划再写一篇跟进的博客。

### Draft


<!--
[Draft](https://github.com/Azure/draft) aims to help you get started deploying any app to Kubernetes. It is capable of applying heuristics as to what programming language your app is written in and generates a Dockerfile along with a Helm chart. It then runs the build for you and deploys resulting image to the target cluster via the Helm chart. It also allows user to setup port forwarding to localhost very easily.
-->

[Draft](https://github.com/Azure/draft) 旨在帮助您将任何应用程序部署到 Kubernetes。它能够检测到您的应用所使用的编程语言，并且生成一份 Dockerfile 和 Helm 图表。然后它替您启动构建并且依照 Helm 图表把所生产的镜像部署到目标集群。它也可以让您很容易地设置到 localhost 的端口映射。

<!--
Implications:
-->

这意味着：

<!--
* User can customise the chart and Dockerfile templates however they like, or even create a [custom pack](https://github.com/Azure/draft/blob/master/docs/reference/dep-003.md) (with Dockerfile, the chart and more) for future use
-->
* 用户可以任意地自定义 Helm 图表和 Dockerfile 模版，或者甚至创建一个 [custom pack](https://github.com/Azure/draft/blob/master/docs/reference/dep-003.md)（使用 Dockerfile、Helm 图表以及其他）以备后用

<!--
* It’s not very simple to guess how just any app is supposed to be built, in some cases user may need to tweak Dockerfile and the Helm chart that Draft generates
-->
* 要想理解一个应用应该怎么构建并不容易，在某些情况下，用户也许需要修改 Draft 生成的 Dockerfile 和 Heml 图表

<!--
* With [Draft version 0.12.0](https://github.com/Azure/draft/releases/tag/v0.12.0) or older, every time user wants to test a change, they need to wait for Draft to copy the code to the cluster, then run the build, push the image and release updated chart; this can timely, but it results in an image being for every single change made by the user (whether it was committed to git or not)
-->
* 如果使用 [Draft version 0.12.0](https://github.com/Azure/draft/releases/tag/v0.12.0)<sup>1</sup> 或者更老版本，每一次用户想要测试一个改动，他们需要等 Draft 把代码拷贝到集群，运行构建，推送镜像并且发布更新后的图表；这些步骤可能进行得很快，但是每一次用户的改动都会产生一个镜像（无论是否提交到 git ）

<!--
* As of Draft version 0.12.0, builds are executed locally
* User doesn’t have an option to choose something other than Helm for deployment
* It can watch local changes and trigger deployments, but this feature is not enabled by default
-->
* 在 Draft 0.12.0版本，构建是本地进行的
* 用户不能选择 Helm 以外的工具进行部署
* 它可以监控本地的改动并且触发部署，但是这个功能默认是关闭的

<!--
* It allows developer to use either local or remote Kubernetes cluster
* Deploying to production is up to the user, Draft authors recommend their other project – Brigade
* Can be used instead of Skaffold, and along the side of Squash
-->
* 它允许开发人员使用本地或者远程的 Kubernetes 集群
* 如何部署到生产环境取决于用户， Draft 的作者推荐了他们的另一个项目 - Brigade
* 可以代替 Skaffold， 并且可以和 Squash 一起使用

<!--
More info:
-->

更多信息：

* [Draft: Kubernetes container development made easy](https://kubernetes.io/blog/2017/05/draft-kubernetes-container-development)
* [Getting Started Guide](https://github.com/Azure/draft/blob/master/docs/getting-started.md)

【1】：此处疑为 0.11.0，因为 0.12.0 已经支持本地构建，见下一条

### Skaffold

<!--
[Skaffold](https://github.com/GoogleCloudPlatform/skaffold) is a tool that aims to provide portability for CI integrations with different build system, image registry and deployment tools. It is different from Draft, yet somewhat comparable. It has a basic capability for generating manifests, but it’s not a prominent feature. Skaffold is extendible and lets user pick tools for use in each of the steps in building and deploying their app.
-->

[Skaffold](https://github.com/GoogleCloudPlatform/skaffold) 让 CI 集成具有可移植性的，它允许用户采用不同的构建系统，镜像仓库和部署工具。它不同于 Draft，同时也具有一定的可比性。它具有生成系统清单的基本能力，但那不是一个重要功能。Skaffold 易于扩展，允许用户在构建和部署应用的每一步选取相应的工具。

<!--
Implications:
-->

这意味着：

<!--
* Modular by design
* Works independently of CI vendor, user doesn’t need Docker or Kubernetes plugin
* Works without CI as such, i.e. from the developer’s laptop
* It can watch local changes and trigger deployments
-->
* 模块化设计
* 不依赖于 CI，用户不需要 Docker 或者 Kubernetes 插件
* 没有 CI 也可以工作，也就是说，可以在开发人员的电脑上工作
* 它可以监控本地的改动并且触发部署

<!--
* It allows developer to use either local or remote Kubernetes cluster
* It can be used to deploy to production, user can configure how exactly they prefer to do it and provide different kind of pipeline for each target environment
* Can be used instead of Draft, and along the side with most other tools
-->
* 它允许开发人员使用本地或者远程的 Kubernetes 集群
* 它可以用于部署生产环境，用户可以精确配置，也可以为每一套目标环境提供不同的生产线
* 可以代替 Draft，并且和其他工具一起使用

<!--
More info:
-->

更多信息：

* [Introducing Skaffold: Easy and repeatable Kubernetes development](https://cloudplatform.googleblog.com/2018/03/introducing-Skaffold-Easy-and-repeatable-Kubernetes-development.html)
* [Getting Started Guide](https://github.com/GoogleCloudPlatform/skaffold#getting-started-with-local-tooling)

### Squash

<!--
[Squash](https://github.com/solo-io/squash) consists of a debug server that is fully integrated with Kubernetes, and a IDE plugin. It allows you to insert breakpoints and do all the fun stuff you are used to doing when debugging an application using an IDE. It bridges IDE debugging experience with your Kubernetes cluster by allowing you to attach the debugger to a pod running in your Kubernetes cluster.
-->
[Squash](https://github.com/solo-io/squash) 包含一个与 Kubernetes 全面集成的调试服务器，以及一个 IDE 插件。它允许您插入断点和所有的调试操作，就像您所习惯的使用 IDE 调试一个程序一般。它允许您将调试器应用到 Kubernetes 集群中运行的 pod 上，从而让您可以使用 IDE 调试 Kubernetes 集群。

<!--
Implications:
-->

这意味着：

<!--
* Can be used independently of other tools you chose
* Requires a privileged DaemonSet
* Integrates with popular IDEs
* Supports Go, Python, Node.js, Java and gdb
-->
* 不依赖您选择的其它工具
* 需要一组特权 DaemonSet
* 可以和流行 IDE 集成
* 支持 Go、Python、Node.js、Java 和 gdb

<!--
* User must ensure application binaries inside the container image are compiled with debug symbols
* Can be used in combination with any other tools described here
* It can be used with either local or remote Kubernetes cluster
-->
* 用户必须确保容器中的应用程序使编译时使用了调试符号
* 可与此处描述的任何其他工具结合使用
* 它可以与本地或远程 Kubernetes 集群一起使用

<!--
More info:
-->

更多信息：

* [Squash: A Debugger for Kubernetes Apps](https://www.youtube.com/watch?v=5TrV3qzXlgI)
* [Getting Started Guide](https://squash.solo.io/overview/)

### Telepresence

<!--
[Telepresence](https://www.telepresence.io/) connects containers running on developer’s workstation with a remote Kubernetes cluster using a two-way proxy and emulates in-cluster environment as well as provides access to config maps and secrets. It aims to improve iteration time for container app development by eliminating the need for deploying app to the cluster and leverages local container to abstract network and filesystem interface in order to make it appear as if the app was running in the cluster.
-->
[Telepresence](https://www.telepresence.io/) 使用双向代理将开发人员工作站上运行的容器与远程 Kubernetes 集群连接起来，并模拟集群内环境以及提供对配置映射和机密的访问。它消除了将应用部署到集群的需要，并利用本地容器抽象出网络和文件系统接口，以使其看起来应用好像就在集群中运行，从而改进容器应用程序开发的迭代时间。

<!--
Implications:
-->

这意味着：

<!--
* It can be used independently of other tools you chose
* Using together with Squash is possible, although Squash would have to be used for pods in the cluster, while conventional/local debugger would need to be used for debugging local container that’s connected to the cluster via Telepresence
* Telepresence imposes some network latency
-->
* 它不依赖于其它您选取的工具
* 可以同 Squash 一起使用，但是 Squash 必须用于调试集群中的 pods，而传统/本地调试器需要用于调试通过 Telepresence 连接到集群的本地容器
* Telepresence 会产生一些网络延迟

<!--
* It provides connectivity via a side-car process - sshuttle, which is based on SSH
* More intrusive dependency injection mode with LD_PRELOAD/DYLD_INSERT_LIBRARIES is also available
* It is most commonly used with a remote Kubernetes cluster, but can be used with a local one also
-->
* 它通过辅助进程提供连接 -  sshuttle，基于SSH的一个工具
* 还提供了使用 LD_PRELOAD/DYLD_INSERT_LIBRARIES 的更具侵入性的依赖注入模式
* 它最常用于远程 Kubernetes 集群，但也可以与本地集群一起使用

<!--
More info:
-->

更多信息：

* [Telepresence: fast, realistic local development for Kubernetes microservices](https://www.telepresence.io/)
* [Getting Started Guide](https://www.telepresence.io/tutorials/docker)
* [How It Works](https://www.telepresence.io/discussion/how-it-works)

### Ksync

<!--
[Ksync](https://github.com/vapor-ware/ksync) synchronizes application code (and configuration) between your local machine and the container running in Kubernetes, akin to what [oc rsync](https://docs.openshift.com/container-platform/3.9/dev_guide/copy_files_to_container.html) does in OpenShift. It aims to improve iteration time for app development by eliminating build and deployment steps.
-->


[Ksync](https://github.com/vapor-ware/ksync) 在本地计算机和运行在 Kubernetes 中的容器之间同步应用程序代码（和配置），类似于 [oc rsync](https://docs.openshift.com/container-platform/3.9/dev_guide/copy_files_to_container.html) 在 OpenShift 中的角色。它旨在通过消除构建和部署步骤来缩短应用程序开发的迭代时间。


<!--
Implications:
-->

这意味着：

<!--
* It bypasses container image build and revision control
* Compiled language users have to run builds inside the pod (TBC)
* Two-way sync – remote files are copied to local directory
* Container is restarted each time remote filesystem is updated
* No security features – development only
-->
* 它绕过容器图像构建和修订控制
* 使用编译语言的用户必须在 pod（TBC）内运行构建
* 双向同步 - 远程文件会复制到本地目录
* 每次更新远程文件系统时都会重启容器
* 无安全功能 - 仅限开发

<!--
* Utilizes [Syncthing](https://github.com/syncthing/syncthing), a Go library for peer-to-peer sync
* Requires a privileged DaemonSet running in the cluster
* Node has to use Docker with overlayfs2 – no other CRI implementations are supported at the time of writing
-->
* 使用 [Syncthing](https://github.com/syncthing/syncthing)，一个用于点对点同步的 Go 语言库
* 需要一个在集群中运行的特权 DaemonSet
* Node 必须使用带有 overlayfs2 的 Docker  - 在写作本文时，尚不支持其他 CRI 实现

<!--
More info:
-->

更多信息：

* [Getting Started Guide](https://github.com/vapor-ware/ksync#getting-started)
* [How It Works](https://github.com/vapor-ware/ksync/blob/master/docs/architecture.md)
* [Katacoda scenario to try out ksync in your browser](https://www.katacoda.com/vaporio/scenarios/ksync)
* [Syncthing Specification](https://docs.syncthing.net/specs/)

<!--
## Hands-on walkthroughs
-->

## 实践演练


<!--
The app we will be using for the hands-on walkthroughs of the tools in the following is a simple [stock market simulator](https://github.com/kubernauts/dok-example-us), consisting of two microservices:
-->

我们接下来用于练习使用工具的应用是一个简单的[股市模拟器](https://github.com/kubernauts/dok-example-us)，包含两个微服务：

<!--
* The `stock-gen` microservice is written in Go and generates stock data randomly and exposes it via HTTP endpoint `/stockdata`.
‎* A second microservice, `stock-con` is a Node.js app that consumes the stream of stock data from `stock-gen` and provides an aggregation in form of a moving average via the HTTP endpoint `/average/$SYMBOL` as well as a health-check endpoint at `/healthz`.
-->

* `stock-gen`（股市数据生成器）微服务是用 Go 编写的，随机生成股票数据并通过 HTTP 端点 `/ stockdata` 公开
* 第二个微服务，`stock-con`（股市数据消费者）是一个 Node.js 应用程序，它使用来自 `stock-gen` 的股票数据流，并通过 HTTP 端点 `/average/$SYMBOL` 提供股价移动平均线，也提供一个健康检查端点 `/healthz`。

<!--
Overall, the default setup of the app looks as follows:
-->

总体上，此应用的默认配置如下图所示：

![Default Setup](/images/blog/2018-05-01-developing-on-kubernetes/dok-architecture_preview.png)

<!--
In the following we’ll do a hands-on walkthrough for a representative selection of tools discussed above: ksync, Minikube with local build, as well as Skaffold. For each of the tools we do the following:
-->

在下文中，我们将选取以上讨论的代表性工具进行实践演练：ksync，具有本地构建的 Minikube 以及 Skaffold。对于每个工具，我们执行以下操作：

<!--
* Set up the respective tool incl. preparations for the deployment and local consumption of the `stock-con` microservice.
* Perform a code update, that is, change the source code of the `/healthz` endpoint in the `stock-con` microservice and observe the updates.
-->

* 设置相应的工具，包括部署准备和 `stock-con` 微服务数据的本地读取
* 执行代码更新，即更改 `stock-con` 微服务的 `/healthz` 端点的源代码并观察网页刷新

<!--
Note that for the target Kubernetes cluster we’ve been using Minikube locally, but you can also a remote cluster for ksync and Skaffold if you want to follow along.
-->

请注意，我们一直使用 Minikube 的本地 Kubernetes 集群，但是您也可以使用 ksync 和 Skaffold 的远程集群跟随练习。

<!--
## Walkthrough: ksync
-->

## 实践演练：ksync

<!--
As a preparation, install [ksync](https://vapor-ware.github.io/ksync/#installation) and then carry out the following steps to prepare the development setup:
-->

作为准备，安装 [ksync](https://vapor-ware.github.io/ksync/#installation)，然后执行以下步骤配置开发环境：

```
$ mkdir -p $(pwd)/ksync
$ kubectl create namespace dok
$ ksync init -n dok
```
<!--
With the basic setup completed we're ready to tell ksync’s local client to watch a certain Kubernetes namespace and then we create a spec to define what we want to sync (the directory `$(pwd)/ksync` locally with `/app` in the container). Note that target pod is specified via the selector parameter:
-->


完成基本设置后，我们可以告诉 ksync 的本地客户端监控 Kubernetes 的某个命名空间，然后我们创建一个规范来定义我们想要同步的文件夹（本地的 `$(pwd)/ksync` 和容器中的 `/ app` ）。请注意，目标 pod 是用 selector 参数指定：

```
$ ksync watch -n dok
$ ksync create -n dok --selector=app=stock-con $(pwd)/ksync /app
$ ksync get -n dok
```

<!--
Now we deploy the stock generator and the stock consumer microservice:
-->

现在我们部署股价数据生成器和股价数据消费者微服务：

```
$ kubectl -n=dok apply \
      -f https://raw.githubusercontent.com/kubernauts/dok-example-us/master/stock-gen/app.yaml
$ kubectl -n=dok apply \
      -f https://raw.githubusercontent.com/kubernauts/dok-example-us/master/stock-con/app.yaml
```
<!--
Once both deployments are created and the pods are running, we forward the `stock-con` service for local consumption (in a separate terminal session):
-->


一旦两个部署建好并且 pod 开始运行，我们转发 `stock-con` 服务以供本地读取（另开一个终端窗口）：

```
$ kubectl get -n dok po --selector=app=stock-con  \
                     -o=custom-columns=:metadata.name --no-headers |  \
                     xargs -IPOD kubectl -n dok port-forward POD 9898:9898
```
<!--
With that we should be able to consume the `stock-con` service from our local machine; we do this by regularly checking the response of the `healthz` endpoint like so (in a separate terminal session):
-->


这样，通过定期查询 `healthz` 端点，我们就应该能够从本地机器上读取 `stock-con` 服务，查询命令如下（在一个单独的终端窗口）：

```
$ watch curl localhost:9898/healthz
```
<!--
Now change the code in the `ksync/stock-con`directory, for example update the [`/healthz` endpoint code in `service.js`](https://github.com/kubernauts/dok-example-us/blob/2334ee8fb11f8813370122bd46285cf45bdd4c48/stock-con/service.js#L52) by adding a field to the JSON response and observe how the pod gets updated and the response of the `curl localhost:9898/healthz` command changes. Overall you should have something like the following in the end:
-->


现在，改动 `ksync/stock-con` 目录中的代码，例如改动 [`service.js` 中定义的 `/healthz` 端点代码](https://github.com/kubernauts/dok-example-us/blob/2334ee8fb11f8813370122bd46285cf45bdd4c48/stock-con/service.js#L52)，在其 JSON 形式的响应中新添一个字段并观察 pod 如何更新以及 `curl localhost：9898/healthz` 命令的输出发生何种变化。总的来说，您最后应该看到类似的内容：


![Preview](/images/blog/2018-05-01-developing-on-kubernetes/dok-ksync_preview.png)


<!--
### Walkthrough: Minikube with local build
-->

### 实践演练：带本地构建的 Minikube

<!--
For the following you will need to have Minikube up and running and we will leverage the Minikube-internal Docker daemon for building images, locally. As a preparation, do the following
-->


对于以下内容，您需要启动并运行 Minikube，我们将利用 Minikube 自带的 Docker daemon 在本地构建镜像。作为准备，请执行以下操作

```
$ git clone https://github.com/kubernauts/dok-example-us.git && cd dok-example-us
$ eval $(minikube docker-env)
$ kubectl create namespace dok
```

<!--
Now we deploy the stock generator and the stock consumer microservice:
-->

现在我们部署股价数据生成器和股价数据消费者微服务：


```
$ kubectl -n=dok apply -f stock-gen/app.yaml
$ kubectl -n=dok apply -f stock-con/app.yaml
```
<!--
Once both deployments are created and the pods are running, we forward the `stock-con` service for local consumption (in a separate terminal session) and check the response of the `healthz` endpoint:
-->


一旦两个部署建好并且 pod 开始运行，我们转发 `stock-con` 服务以供本地读取（另开一个终端窗口）并检查 `healthz` 端点的响应：

```
$ kubectl get -n dok po --selector=app=stock-con  \
                     -o=custom-columns=:metadata.name --no-headers |  \
                     xargs -IPOD kubectl -n dok port-forward POD 9898:9898 &
$ watch curl localhost:9898/healthz
```
<!--
Now change the code in the `stock-con`directory, for example, update the [`/healthz` endpoint code in `service.js`](https://github.com/kubernauts/dok-example-us/blob/2334ee8fb11f8813370122bd46285cf45bdd4c48/stock-con/service.js#L52) by adding a field to the JSON response. Once you’re done with your code update, the last step is to build a new container image and kick off a new deployment like shown below:
-->

现在，改一下 `ksync/stock-con` 目录中的代码，例如修改 [`service.js` 中定义的 `/healthz` 端点代码](https://github.com/kubernauts/dok-example-us/blob/2334ee8fb11f8813370122bd46285cf45bdd4c48/stock-con/service.js#L52)，在其 JSON 形式的响应中添加一个字段。在您更新完代码后，最后一步是构建新的容器镜像并启动新部署，如下所示：


```
$ docker build -t stock-con:dev -f Dockerfile .
$ kubectl -n dok set image deployment/stock-con *=stock-con:dev
```
<!--
Overall you should have something like the following in the end:
-->

总的来说，您最后应该看到类似的内容：

![Local Preview](/images/blog/2018-05-01-developing-on-kubernetes/dok-minikube-localdev_preview.png)

<!--
### Walkthrough: Skaffold
-->

### 实践演练：Skaffold

<!--
To perform this walkthrough you first need to install [Skaffold](https://github.com/GoogleContainerTools/skaffold#installation). Once that is done, you can do the following steps to prepare the development setup:
-->

要进行此演练，首先需要安装 [Skaffold](https://github.com/GoogleContainerTools/skaffold#installation)。完成后，您可以执行以下步骤来配置开发环境：

```
$ git clone https://github.com/kubernauts/dok-example-us.git && cd dok-example-us
$ kubectl create namespace dok
```
<!--
Now we deploy the stock generator (but not the stock consumer microservice, that is done via Skaffold):
-->

现在我们部署股价数据生成器（但是暂不部署股价数据消费者，此服务将使用 Skaffold 完成）：

```
$ kubectl -n=dok apply -f stock-gen/app.yaml
```

<!--
Note that initially we experienced an authentication error when doing `skaffold dev` and needed to apply a fix as described in [Issue 322](https://github.com/GoogleContainerTools/skaffold/issues/322). Essentially it means changing the content of `~/.docker/config.json` to:
-->


请注意，最初我们在执行 `skaffold dev` 时发生身份验证错误，为避免此错误需要安装[问题322](https://github.com/GoogleContainerTools/skaffold/issues/322) 中所述的修复。本质上，需要将 `〜/.docker/config.json` 的内容改为：


```
{
   "auths": {}
}
```

<!--
Next, we had to patch `stock-con/app.yaml` slightly to make it work with Skaffold:
-->

接下来，我们需要略微改动 `stock-con/app.yaml`，这样 Skaffold 才能正常使用此文件：

<!--
Add a `namespace` field to both the `stock-con` deployment and the service with the value of `dok`.
Change the `image` field of the container spec to `quay.io/mhausenblas/stock-con` since Skaffold manages the container image tag on the fly.
-->

在 `stock-con` 部署和服务中添加一个 `namespace` 字段，其值为 `dok`

将容器规范的 `image` 字段更改为 `quay.io/mhausenblas/stock-con`，因为 Skaffold 可以即时管理容器镜像标签。

<!--
 The resulting `app.yaml` file stock-con looks as follows:
 -->
最终的 stock-con 的 `app.yaml` 文件看起来如下：


```
apiVersion: apps/v1beta1
kind: Deployment
metadata:
  labels:
    app: stock-con
  name: stock-con
  namespace: dok
spec:
  replicas: 1
  template:
    metadata:
      labels:
        app: stock-con
    spec:
      containers:
      - name: stock-con
        image: quay.io/mhausenblas/stock-con
        env:
        - name: DOK_STOCKGEN_HOSTNAME
          value: stock-gen
        - name: DOK_STOCKGEN_PORT
          value: "9999"
        ports:
        - containerPort: 9898
          protocol: TCP
        livenessProbe:
          initialDelaySeconds: 2
          periodSeconds: 5
          httpGet:
            path: /healthz
            port: 9898
        readinessProbe:
          initialDelaySeconds: 2
          periodSeconds: 5
          httpGet:
            path: /healthz
            port: 9898
---
apiVersion: v1
kind: Service
metadata:
  labels:
    app: stock-con
  name: stock-con
  namespace: dok
spec:
  type: ClusterIP
  ports:
  - name: http
    port: 80
    protocol: TCP
    targetPort: 9898
  selector:
    app: stock-con
```
<!--
The final step before we can start development is to configure Skaffold. So, create a file `skaffold.yaml` in the `stock-con/` directory with the following content:
 -->

我们能够开始开发之前的最后一步是配置 Skaffold。因此，在 `stock-con/` 目录中创建文件 `skaffold.yaml`，其中包含以下内容：

```
apiVersion: skaffold/v1alpha2
kind: Config
build:
  artifacts:
  - imageName: quay.io/mhausenblas/stock-con
    workspace: .
    docker: {}
  local: {}
deploy:
  kubectl:
    manifests:
      - app.yaml
```
<!--
Now we’re ready to kick off the development. For that execute the following in the `stock-con/` directory:
 -->

现在我们准备好开始开发了。为此，在 `stock-con/` 目录中执行以下命令：

```
$ skaffold dev
```
<!--
Above command triggers a build of the `stock-con` image and then a deployment. Once the pod of the `stock-con` deployment is running, we again forward the `stock-con` service for local consumption (in a separate terminal session) and check the response of the `healthz` endpoint:
 -->


上面的命令将触发 `stock-con` 图像的构建和部署。一旦 `stock-con` 部署的 pod 开始运行，我们再次转发 `stock-con` 服务以供本地读取（在单独的终端窗口中）并检查 `healthz` 端点的响应：

```bash
$ kubectl get -n dok po --selector=app=stock-con  \
                     -o=custom-columns=:metadata.name --no-headers |  \
                     xargs -IPOD kubectl -n dok port-forward POD 9898:9898 &
$ watch curl localhost:9898/healthz
```
<!--
If you now change the code in the `stock-con`directory, for example, by updating the [`/healthz` endpoint code in `service.js`](https://github.com/kubernauts/dok-example-us/blob/2334ee8fb11f8813370122bd46285cf45bdd4c48/stock-con/service.js#L52) by adding a field to the JSON response, you should see Skaffold noticing the change and create a new image as well as deploy it. The resulting screen would look something like this:
 -->
 
现在，如果您修改一下 `stock-con` 目录中的代码，例如 [`service.js` 中定义的 `/healthz` 端点代码](https://github.com/kubernauts/dok-example-us/blob/2334ee8fb11f8813370122bd46285cf45bdd4c48/stock-con/service.js#L52)，在其 JSON 形式的响应中添加一个字段，您应该看到 Skaffold 可以检测到代码改动并创建新图像以及部署它。您的屏幕看起来应该类似这样：
 
 
![Skaffold Preview](/images/blog/2018-05-01-developing-on-kubernetes/dok-skaffold_preview.png)
<!--
By now you should have a feeling how different tools enable you to develop apps on Kubernetes and if you’re interested to learn more about tools and or methods, check out the following resources:
 -->

至此，您应该对不同的工具如何帮您在 Kubernetes 上开发应用程序有了一定的概念，如果您有兴趣了解有关工具和/或方法的更多信息，请查看以下资源：

* Blog post by Shahidh K Muhammed on [Draft vs Gitkube vs Helm vs Ksonnet vs Metaparticle vs Skaffold](https://blog.hasura.io/draft-vs-gitkube-vs-helm-vs-ksonnet-vs-metaparticle-vs-skaffold-f5aa9561f948) (03/2018)
* Blog post by Gergely Nemeth on [Using Kubernetes for Local Development](https://nemethgergely.com/using-kubernetes-for-local-development/index.html), with a focus on Skaffold (03/2018)
* Blog post by Richard Li on [Locally developing Kubernetes services (without waiting for a deploy)](https://hackernoon.com/locally-developing-kubernetes-services-without-waiting-for-a-deploy-f63995de7b99), with a focus on Telepresence
* Blog post by Abhishek Tiwari on [Local Development Environment for Kubernetes using Minikube](https://abhishek-tiwari.com/local-development-environment-for-kubernetes-using-minikube/) (09/2017)
* Blog post by Aymen El Amri on [Using Kubernetes for Local Development — Minikube](https://medium.com/devopslinks/using-kubernetes-minikube-for-local-development-c37c6e56e3db) (08/2017)
* Blog post by Alexis Richardson on [​GitOps - Operations by Pull Request](https://www.weave.works/blog/gitops-operations-by-pull-request) (08/2017)
* Slide deck [GitOps: Drive operations through git](https://docs.google.com/presentation/d/1d3PigRVt_m5rO89Ob2XZ16bW8lRSkHHH5k816-oMzZo/), with a focus on Gitkube by Tirumarai Selvan (03/2018)
* Slide deck [Developing apps on Kubernetes](https://speakerdeck.com/mhausenblas/developing-apps-on-kubernetes), a talk Michael Hausenblas gave at a CNCF Paris meetup  (04/2018)
* YouTube videos:
    * [TGI Kubernetes 029: Developing Apps with Ksync](https://www.youtube.com/watch?v=QW85Y0Ug3KY )
    * [TGI Kubernetes 030: Exploring Skaffold](https://www.youtube.com/watch?v=McwwWhCXMxc)
    * [TGI Kubernetes 031: Connecting with Telepresence](https://www.youtube.com/watch?v=zezeBAJ_3w8)
    * [TGI Kubernetes 033: Developing with Draft](https://www.youtube.com/watch?v=8B1D7cTMPgA)
* Raw responses to the [Kubernetes Application Survey](https://docs.google.com/spreadsheets/d/12ilRCly2eHKPuicv1P_BD6z__PXAqpiaR-tDYe2eudE/edit) 2018 by SIG Apps

<!--
With that we wrap up this post on how to go about developing apps on Kubernetes, we hope you learned something and if you have feedback and/or want to point out a tool that you found useful, please let us know via Twitter: [Ilya](https://twitter.com/errordeveloper) and [Michael](https://twitter.com/mhausenblas).
-->

有了这些，我们这篇关于如何在 Kubernetes 上开发应用程序的博客就可以收尾了，希望您有所收获，如果您有反馈和/或想要指出您认为有用的工具，请通过 Twitter 告诉我们：[Ilya](https://twitter.com/errordeveloper) 和 [Michael](https://twitter.com/mhausenblas)
