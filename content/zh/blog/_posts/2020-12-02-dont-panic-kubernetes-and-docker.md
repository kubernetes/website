---
layout: blog
title: "别慌: Kubernetes 和 Docker"
date: 2020-12-02
slug: dont-panic-kubernetes-and-docker
---
<!-- 
layout: blog
title: "Don't Panic: Kubernetes and Docker"
date: 2020-12-02
slug: dont-panic-kubernetes-and-docker
-->

**作者：** Jorge Castro, Duffie Cooley, Kat Cosgrove, Justin Garrison, Noah Kantrowitz, Bob Killen, Rey Lejano, Dan “POP” Papandrea, Jeffrey Sica, Davanum “Dims” Srinivas

<!-- 
Kubernetes is [deprecating
Docker](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.20.md#deprecation)
as a container runtime after v1.20.
-->
Kubernetes 从版本 v1.20 之后，[弃用 Docker](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.20.md#deprecation)
这个容器运行时。

<!-- 
**You do not need to panic. It’s not as dramatic as it sounds.**
-->
**不必慌张，这件事并没有听起来那么吓人。**

<!-- 
TL;DR Docker as an underlying runtime is being deprecated in favor of runtimes
that use the [Container Runtime Interface (CRI)](https://kubernetes.io/blog/2016/12/container-runtime-interface-cri-in-kubernetes/)
created for Kubernetes. Docker-produced images will continue to work in your
cluster with all runtimes, as they always have.
-->
弃用 Docker 这个底层运行时，转而支持符合为 Kubernetes 创建的
[Container Runtime Interface (CRI)](https://kubernetes.io/blog/2016/12/container-runtime-interface-cri-in-kubernetes/)
的运行时。
Docker 构建的镜像，将在你的集群的所有运行时中继续工作，一如既往。

<!-- 
If you’re an end-user of Kubernetes, not a whole lot will be changing for you.
This doesn’t mean the death of Docker, and it doesn’t mean you can’t, or
shouldn’t, use Docker as a development tool anymore. Docker is still a useful
tool for building containers, and the images that result from running `docker
build` can still run in your Kubernetes cluster. 
--> 
如果你是 Kubernetes 的终端用户，这对你不会有太大影响。
这事并不意味着 Docker 已死、也不意味着你不能或不该继续把 Docker 用作开发工具。
Docker 仍然是构建容器的利器，使用命令 `docker build` 构建的镜像在 Kubernetes 集群中仍然可以运行。

<!-- 
If you’re using a managed Kubernetes service like GKE, EKS, or AKS (which [defaults to containerd](https://github.com/Azure/AKS/releases/tag/2020-11-16)) you will need to
make sure your worker nodes are using a supported container runtime before
Docker support is removed in a future version of Kubernetes. If you have node
customizations you may need to update them based on your environment and runtime
requirements. Please work with your service provider to ensure proper upgrade
testing and planning. 
-->
如果你正在使用 GKE、EKS、或 AKS 
([默认使用 containerd](https://github.com/Azure/AKS/releases/tag/2020-11-16))  
这类托管 Kubernetes 服务，你需要在 Kubernetes 后续版本移除对 Docker 支持之前，
确认工作节点使用了被支持的容器运行时。
如果你的节点被定制过，你可能需要根据你自己的环境和运行时需求更新它们。
请与你的服务供应商协作，确保做出适当的升级测试和计划。

<!-- 
If you’re rolling your own clusters, you will also need to make changes to avoid
your clusters breaking. At v1.20, you will get a deprecation warning for Docker.
When Docker runtime support is removed in a future release (currently planned
for the 1.22 release in late 2021) of Kubernetes it will no longer be supported
and you will need to switch to one of the other compliant container runtimes,
like containerd or CRI-O. Just make sure that the runtime you choose supports
the docker daemon configurations you currently use (e.g. logging).
-->
如果你正在运营你自己的集群，那还应该做些工作，以避免集群中断。
在 v1.20 版中，你仅会得到一个 Docker 的弃用警告。
当对 Docker 运行时的支持在 Kubernetes 某个后续发行版（目前的计划是 2021 年晚些时候的 1.22 版）中被移除时，
你需要切换到 containerd 或 CRI-O 等兼容的容器运行时。
只要确保你选择的运行时支持你当前使用的 Docker 守护进程配置（例如 logging）。

<!-- 
## So why the confusion and what is everyone freaking out about?
-->
## 那为什么会有这样的困惑，为什么每个人要害怕呢？{#so-why-the-confusion-and-what-is-everyone-freaking-out-about}

<!-- 
We’re talking about two different environments here, and that’s creating
confusion. Inside of your Kubernetes cluster, there’s a thing called a container
runtime that’s responsible for pulling and running your container images. Docker
is a popular choice for that runtime (other common options include containerd
and CRI-O), but Docker was not designed to be embedded inside Kubernetes, and
that causes a problem. 
-->
我们在这里讨论的是两套不同的环境，这就是造成困惑的根源。
在你的 Kubernetes 集群中，有一个叫做容器运行时的东西，它负责拉取并运行容器镜像。
Docker 对于运行时来说是一个流行的选择（其他常见的选择包括 containerd 和 CRI-O），
但 Docker 并非设计用来嵌入到 Kubernetes，这就是问题所在。

<!-- 
You see, the thing we call “Docker” isn’t actually one thing&mdash;it’s an entire
tech stack, and one part of it is a thing called “containerd,” which is a
high-level container runtime by itself. Docker is cool and useful because it has
a lot of UX enhancements that make it really easy for humans to interact with
while we’re doing development work, but those UX enhancements aren’t necessary
for Kubernetes, because it isn’t a human. 
-->
你看，我们称之为 “Docker” 的物件实际上并不是一个物件——它是一个完整的技术堆栈，
它其中一个叫做 “containerd” 的部件本身，才是一个高级容器运行时。
Docker 既酷炫又实用，因为它提供了很多用户体验增强功能，而这简化了我们做开发工作时的操作，
Kubernetes 用不到这些增强的用户体验，毕竟它并非人类。

<!-- 
As a result of this human-friendly abstraction layer, your Kubernetes cluster
has to use another tool called Dockershim to get at what it really needs, which
is containerd. That’s not great, because it gives us another thing that has to
be maintained and can possibly break. What’s actually happening here is that
Dockershim is being removed from Kubelet as early as v1.23 release, which
removes support for Docker as a container runtime as a result. You might be
thinking to yourself, but if containerd is included in the Docker stack, why
does Kubernetes need the Dockershim?
-->
因为这个用户友好的抽象层，Kubernetes 集群不得不引入一个叫做 Dockershim 的工具来访问它真正需要的 containerd。
这不是一件好事，因为这引入了额外的运维工作量，而且还可能出错。
实际上正在发生的事情就是：Dockershim 将在不早于 v1.23 版中从 kubelet 中被移除，也就取消对 Docker 容器运行时的支持。
你心里可能会想，如果 containerd 已经包含在 Docker 堆栈中，为什么 Kubernetes 需要 Dockershim。

<!-- 
Docker isn’t compliant with CRI, the [Container Runtime Interface](https://kubernetes.io/blog/2016/12/container-runtime-interface-cri-in-kubernetes/).
If it were, we wouldn’t need the shim, and this wouldn’t be a thing. But it’s
not the end of the world, and you don’t need to panic&mdash;you just need to change
your container runtime from Docker to another supported container runtime.
-->
Docker 不兼容 CRI，
[容器运行时接口](https://kubernetes.io/blog/2016/12/container-runtime-interface-cri-in-kubernetes/)。
如果支持，我们就不需要这个 shim 了，也就没问题了。
但这也不是世界末日，你也不需要恐慌——你唯一要做的就是把你的容器运行时从 Docker 切换到其他受支持的容器运行时。

<!-- 
One thing to note: If you are relying on the underlying docker socket
(`/var/run/docker.sock`) as part of a workflow within your cluster today, moving
to a different runtime will break your ability to use it. This pattern is often
called Docker in Docker. There are lots of options out there for this specific
use case including things like
[kaniko](https://github.com/GoogleContainerTools/kaniko),
[img](https://github.com/genuinetools/img), and
[buildah](https://github.com/containers/buildah). 
-->
要注意一点：如果你依赖底层的 Docker 套接字(`/var/run/docker.sock`)，作为你集群中工作流的一部分，
切换到不同的运行时会导致你无法使用它。
这种模式经常被称之为嵌套 Docker（Docker in Docker）。
对于这种特殊的场景，有很多选项，比如：
[kaniko](https://github.com/GoogleContainerTools/kaniko)、
[img](https://github.com/genuinetools/img)、和
[buildah](https://github.com/containers/buildah)。

<!-- 
## What does this change mean for developers, though? Do we still write Dockerfiles? Do we still build things with Docker?
-->
## 那么，这一改变对开发人员意味着什么？我们还要写 Dockerfile 吗？还能用 Docker 构建镜像吗？{#what-does-this-change-mean-for-developers}

<!-- 
This change addresses a different environment than most folks use to interact
with Docker. The Docker installation you’re using in development is unrelated to
the Docker runtime inside your Kubernetes cluster. It’s confusing, we understand.
As a developer, Docker is still useful to you in all the ways it was before this
change was announced. The image that Docker produces isn’t really a
Docker-specific image&mdash;it’s an OCI ([Open Container Initiative](https://opencontainers.org/)) image. 
Any OCI-compliant image, regardless of the tool you use to build it, will look
the same to Kubernetes. Both [containerd](https://containerd.io/) and
[CRI-O](https://cri-o.io/) know how to pull those images and run them. This is
why we have a standard for what containers should look like.
-->
此次改变带来了一个不同的环境，这不同于我们常用的 Docker 交互方式。
你在开发环境中用的 Docker 和你 Kubernetes 集群中的 Docker 运行时无关。
我们知道这听起来让人困惑。
对于开发人员，Docker 从所有角度来看仍然有用，就跟这次改变之前一样。
Docker 构建的镜像并不是 Docker 特有的镜像——它是一个
OCI（[开放容器标准](https://opencontainers.org/)）镜像。
任一 OCI 兼容的镜像，不管它是用什么工具构建的，在 Kubernetes 的角度来看都是一样的。
[containerd](https://containerd.io/) 和
[CRI-O](https://cri-o.io/)
两者都知道怎么拉取并运行这些镜像。
这就是我们制定容器标准的原因。

<!-- 
So, this change is coming. It’s going to cause issues for some, but it isn’t
catastrophic, and generally it’s a good thing. Depending on how you interact
with Kubernetes, this could mean nothing to you, or it could mean a bit of work.
In the long run, it’s going to make things easier. If this is still confusing
for you, that’s okay&mdash;there’s a lot going on here; Kubernetes has a lot of
moving parts, and nobody is an expert in 100% of it. We encourage any and all
questions regardless of experience level or complexity! Our goal is to make sure
everyone is educated as much as possible on the upcoming changes. We hope
this has answered most of your questions and soothed some anxieties! ❤️
-->
所以，改变已经发生。
它确实带来了一些问题，但这不是一个灾难，总的说来，这还是一件好事。
根据你操作 Kubernetes 的方式的不同，这可能对你不构成任何问题，或者也只是意味着一点点的工作量。
从一个长远的角度看，它使得事情更简单。
如果你还在困惑，也没问题——这里还有很多事情；
Kubernetes 有很多变化中的功能，没有人是100%的专家。
我们鼓励你提出任何问题，无论水平高低、问题难易。
我们的目标是确保所有人都能在即将到来的改变中获得足够的了解。
我们希望这已经回答了你的大部分问题，并缓解了一些焦虑！❤️

<!-- 
Looking for more answers? Check out our accompanying [Dockershim Deprecation FAQ](/blog/2020/12/02/dockershim-faq/).
-->
还在寻求更多答案吗？请参考我们附带的
[弃用 Dockershim 的常见问题](/zh/blog/2020/12/02/dockershim-faq/)。
