---
title: "Borg: Kubernetes 的前身"
date: 2015-04-23
slug: borg-predecessor-to-kubernetes
---
<!--
title: " Borg: The Predecessor to Kubernetes "
date: 2015-04-23
slug: borg-predecessor-to-kubernetes
url: /blog/2015/04/Borg-Predecessor-To-Kubernetes
-->

<!--
Google has been running containerized workloads in production for more than a decade. Whether it's service jobs like web front-ends and stateful servers, infrastructure systems like [Bigtable](http://research.google.com/archive/bigtable.html) and [Spanner](http://research.google.com/archive/spanner.html), or batch frameworks like [MapReduce](http://research.google.com/archive/mapreduce.html) and [Millwheel](http://research.google.com/pubs/pub41378.html), virtually everything at Google runs as a container. Today, we took the wraps off of Borg, Google’s long-rumored internal container-oriented cluster-management system, publishing details at the academic computer systems conference [Eurosys](http://eurosys2015.labri.fr/). You can find the paper [here](https://research.google.com/pubs/pub43438.html).
-->
十多年来，谷歌一直在生产中运行容器化工作负载。
无论是像网络前端和有状态服务器之类的工作，像 [Bigtable](http://research.google.com/archive/bigtable.html) 和
[Spanner](http://research.google.com/archive/spanner.html)一样的基础架构系统，或是像
[MapReduce](http://research.google.com/archive/mapreduce.html) 和 [Millwheel](http://research.google.com/pubs/pub41378.html)一样的批处理框架，
Google 的几乎一切都是以容器的方式运行的。今天，我们揭开了 Borg 的面纱，Google 传闻已久的面向容器的内部集群管理系统，并在学术计算机系统会议 [Eurosys](http://eurosys2015.labri.fr/) 上发布了详细信息。你可以在 [此处](https://research.google.com/pubs/pub43438.html) 找到论文。

<!--
Kubernetes traces its lineage directly from Borg. Many of the developers at Google working on Kubernetes were formerly developers on the Borg project. We've incorporated the best ideas from Borg in Kubernetes, and have tried to address some pain points that users identified with Borg over the years.
-->
Kubernetes 直接继承自 Borg。
在 Google 的很多从事 Kubernetes 的开发人员以前都是 Borg 项目的开发人员。
我们在 Kubernetes 中结合了 Borg 的最佳创意，并试图解决用户多年来在 Borg 中发现的一些痛点。

<!--
To give you a flavor, here are four Kubernetes features that came from our experiences with Borg:
-->
Kubernetes 中的以下四个功能特性源于我们从 Borg 获得的经验：

<!--
1) [Pods](/docs/concepts/workloads/pods/). A pod is the unit of scheduling in Kubernetes. It is a resource envelope in which one or more containers run. Containers that are part of the same pod are guaranteed to be scheduled together onto the same machine, and can share state via local volumes.
-->
1) [Pods](/zh-cn/docs/concepts/workloads/pods/)。
Pod 是 Kubernetes 中调度的单位。
它是一个或多个容器在其中运行的资源封装。
保证属于同一 Pod 的容器可以一起调度到同一台计算机上，并且可以通过本地卷共享状态。

<!--
Borg has a similar abstraction, called an alloc (short for “resource allocation”). Popular uses of allocs in Borg include running a web server that generates logs alongside a lightweight log collection process that ships the log to a cluster filesystem (not unlike fluentd or logstash); running a web server that serves data from a disk directory that is populated by a process that reads data from a cluster filesystem and prepares/stages it for the web server (not unlike a Content Management System); and running user-defined processing functions alongside a storage shard.
-->
Borg 有一个类似的抽象，称为 alloc（“资源分配”的缩写）。
Borg 中 alloc 的常见用法包括运行 Web 服务器，该服务器生成日志，一起部署一个轻量级日志收集进程，
该进程将日志发送到集群文件系统（和 fluentd 或 logstash 没什么不同 ）；
运行 Web 服务器，该 Web 服务器从磁盘目录提供数据，
该磁盘目录由从集群文件系统读取数据并为 Web 服务器准备/暂存的进程填充（与内容管理系统没什么不同）；
并与存储分片一起运行用户定义的处理功能。
<!--
Pods not only support these use cases, but they also provide an environment similar to running multiple processes in a single VM -- Kubernetes users can deploy multiple co-located, cooperating processes in a pod without having to give up the simplicity of a one-application-per-container deployment model.
-->
Pod 不仅支持这些用例，而且还提供类似于在单个 VM 中运行多个进程的环境 -- Kubernetes 用户可以在 Pod 中部署多个位于同一地点的协作过程，而不必放弃一个应用程序一个容器的部署模型。

<!--
2) [Services](/docs/concepts/services-networking/service/). Although Borg’s primary role is to manage the lifecycles of tasks and machines, the applications that run on Borg benefit from many other cluster services, including naming and load balancing. Kubernetes supports naming and load balancing using the service abstraction: a service has a name and maps to a dynamic set of pods defined by a label selector (see next section). Any container in the cluster can connect to the service using the service name.
-->
2) [服务](/zh-cn/docs/concepts/services-networking/service/)。
尽管 Borg 的主要角色是管理任务和计算机的生命周期，但是在 Borg 上运行的应用程序还可以从许多其它集群服务中受益，包括命名和负载均衡。
Kubernetes 使用服务抽象支持命名和负载均衡：带名字的服务，会映射到由标签选择器定义的一组动态 Pod 集（请参阅下一节）。
集群中的任何容器都可以使用服务名称链接到服务。
<!--
Under the covers, Kubernetes automatically load-balances connections to the service among the pods that match the label selector, and keeps track of where the pods are running as they get rescheduled over time due to failures.
-->
在幕后，Kubernetes 会自动在与标签选择器匹配到 Pod 之间对与服务的连接进行负载均衡，并跟踪 Pod 在哪里运行，由于故障，它们会随着时间的推移而重新安排。

<!--
3) [Labels](/docs/concepts/overview/working-with-objects/labels/). A container in Borg is usually one replica in a collection of identical or nearly identical containers that correspond to one tier of an Internet service (e.g. the front-ends for Google Maps) or to the workers of a batch job (e.g. a MapReduce). The collection is called a Job, and each replica is called a Task. While the Job is a very useful abstraction, it can be limiting. For example, users often want to manage their entire service (composed of many Jobs) as a single entity, or to uniformly manage several related instances of their service, for example separate canary and stable release tracks. At the other end of the spectrum, users frequently want to reason about and control subsets of tasks within a Job -- the most common example is during rolling updates, when different subsets of the Job need to have different configurations.
-->

3) [标签](/zh-cn/docs/concepts/overview/working-with-objects/labels/)。
Borg 中的容器通常是一组相同或几乎相同的容器中的一个副本，该容器对应于 Internet 服务的一层（例如 Google Maps 的前端）或批处理作业的工人（例如 MapReduce）。
该集合称为 Job ，每个副本称为任务。
尽管 Job 是一个非常有用的抽象，但它可能是有限的。
例如，用户经常希望将其整个服务（由许多 Job 组成）作为一个实体进行管理，或者统一管理其服务的几个相关实例，例如单独的 Canary 和稳定的发行版。
另一方面，用户经常希望推理和控制 Job 中的任务子集 --最常见的示例是在滚动更新期间，此时作业的不同子集需要具有不同的配置。

<!--
Kubernetes supports more flexible collections than Borg by organizing pods using labels, which are arbitrary key/value pairs that users attach to pods (and in fact to any object in the system). Users can create groupings equivalent to Borg Jobs by using a “job:\<jobname\>” label on their pods, but they can also use additional labels to tag the service name, service instance (production, staging, test), and in general, any subset of their pods. A label query (called a “label selector”) is used to select which set of pods an operation should be applied to. Taken together, labels and [replication controllers](/docs/concepts/workloads/controllers/replicationcontroller/) allow for very flexible update semantics, as well as for operations that span the equivalent of Borg Jobs.
-->
通过使用标签组织 Pod ，Kubernetes 比 Borg 支持更灵活的集合，标签是用户附加到 Pod（实际上是系统中的任何对象）的任意键/值对。
用户可以通过在其 Pod 上使用 “job:\<jobname\>” 标签来创建与 Borg Jobs 等效的分组，但是他们还可以使用其他标签来标记服务名称，服务实例（生产，登台，测试）以及一般而言，其 pod 的任何子集。
标签查询（称为“标签选择器”）用于选择操作应用于哪一组 Pod 。
结合起来，标签和[复制控制器](/zh-cn/docs/concepts/workloads/controllers/replicationcontroller/) 允许非常灵活的更新语义，以及跨等效项的操作 Borg Jobs。

<!--
4) IP-per-Pod. In Borg, all tasks on a machine use the IP address of that host, and thus share the host’s port space. While this means Borg can use a vanilla network, it imposes a number of burdens on infrastructure and application developers: Borg must schedule ports as a resource; tasks must pre-declare how many ports they need, and take as start-up arguments which ports to use; the Borglet (node agent) must enforce port isolation; and the naming and RPC systems must handle ports as well as IP addresses.
-->
4) 每个 Pod 一个 IP。在 Borg 中，计算机上的所有任务都使用该主机的 IP 地址，从而共享主机的端口空间。
虽然这意味着 Borg 可以使用普通网络，但是它给基础结构和应用程序开发人员带来了许多负担：Borg 必须将端口作为资源进行调度；任务必须预先声明它们需要多少个端口，并将要使用的端口作为启动参数；Borglet（节点代理）必须强制端口隔离；命名和 RPC 系统必须处理端口以及 IP 地址。

<!--
Thanks to the advent of software-defined overlay networks such as [flannel](https://coreos.com/blog/introducing-rudder/) or those built into [public clouds](https://cloud.google.com/compute/docs/networking), Kubernetes is able to give every pod and service its own IP address. This removes the infrastructure complexity of managing ports, and allows developers to choose any ports they want rather than requiring their software to adapt to the ones chosen by the infrastructure. The latter point is crucial for making it easy to run off-the-shelf open-source applications on Kubernetes--pods can be treated much like VMs or physical hosts, with access to the full port space, oblivious to the fact that they may be sharing the same physical machine with other pods.
-->
多亏了软件定义的覆盖网络，例如 [flannel](https://coreos.com/blog/introducing-rudder/) 或内置于[公有云](https://cloud.google.com/compute/docs/networking)网络的出现，Kubernetes 能够为每个 Pod 提供服务并为其提供自己的 IP 地址。
这消除了管理端口的基础架构的复杂性，并允许开发人员选择他们想要的任何端口，而不需要其软件适应基础架构选择的端口。
后一点对于使现成的易于运行 Kubernetes 上的开源应用程序至关重要 -- 可以将 Pod 视为 VMs 或物理主机，可以访问整个端口空间，他们可能与其他 Pod 共享同一台物理计算机，这一事实已被忽略。

<!--
With the growing popularity of container-based microservice architectures, the lessons Google has learned from running such systems internally have become of increasing interest to the external DevOps community. By revealing some of the inner workings of our cluster manager Borg, and building our next-generation cluster manager as both an open-source project (Kubernetes) and a publicly available hosted service ([Google Container Engine](http://cloud.google.com/container-engine)), we hope these lessons can benefit the broader community outside of Google and advance the state-of-the-art in container scheduling and cluster management.
-->
随着基于容器的微服务架构的日益普及，Google 从内部运行此类系统所汲取的经验教训已引起外部 DevOps 社区越来越多的兴趣。
通过揭示集群管理器 Borg 的一些内部工作原理，并将下一代集群管理器构建为一个开源项目（Kubernetes）和一个公开可用的托管服务（[Google Container Engine](http://cloud.google.com/container-engine)），我们希望这些课程可以使 Google 之外的广大社区受益，并推动容器调度和集群管理方面的最新技术发展。
