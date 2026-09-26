---
layout: blog
title: Kubernetes Containerd Integration Goes GA
date: 2018-05-24
author: >
  Lantao Liu (Google),
  Mike Brown (IBM)
---
# Kubernetes Containerd Integration Goes GA

In a previous blog - [Containerd Brings More Container Runtime Options for Kubernetes](https://kubernetes.io/blog/2017/11/containerd-container-runtime-options-kubernetes), we introduced the alpha version of the Kubernetes containerd integration. With another 6 months of development, the integration with containerd is now generally available! You can now use [containerd 1.1](https://github.com/containerd/containerd/releases/tag/v1.1.0) as the container runtime for production Kubernetes clusters!

Containerd 1.1 works with Kubernetes 1.10 and above, and supports all Kubernetes features. The test coverage of containerd integration on [Google Cloud Platform](https://cloud.google.com/) in Kubernetes test infrastructure is now equivalent to the Docker integration (See: [test dashboard)](https://k8s-testgrid.appspot.com/sig-node-containerd).

_We're very glad to see containerd rapidly grow to this big milestone. Alibaba Cloud started to use containerd actively since its first day, and thanks to the simplicity and robustness emphasise, make it a perfect container engine running in our Serverless Kubernetes product, which has high qualification on performance and stability. No doubt, containerd will be a core engine of container era, and continue to driving innovation forward._

<p style="text-align: right">
<em>— Xinwei, Staff Engineer in Alibaba Cloud</em></p>

# Architecture Improvements
The Kubernetes containerd integration architecture has evolved twice. Each evolution has made the stack more stable and efficient.

## Containerd 1.0 - CRI-Containerd (end of life)
<img src="/images/blog/2018-05-24-kubernetes-containerd-integration-goes-ga/cri-containerd.png" width="100%" alt="cri-containerd architecture" />

For containerd 1.0, a daemon called cri-containerd was required to operate between Kubelet and containerd. Cri-containerd handled the [Container Runtime Interface (CRI)](https://kubernetes.io/blog/2016/12/container-runtime-interface-cri-in-kubernetes/) service requests from Kubelet and used containerd to manage containers and container images correspondingly. Compared to the Docker CRI implementation ([dockershim](https://github.com/kubernetes/kubernetes/tree/v1.10.2/pkg/kubelet/dockershim)), this eliminated one extra hop in the stack.

However, cri-containerd and containerd 1.0 were still 2 different daemons which interacted via grpc. The extra daemon in the loop made it more complex for users to understand and deploy, and introduced unnecessary communication overhead.

## Containerd 1.1 - CRI Plugin (current)
<img src="/images/blog/2018-05-24-kubernetes-containerd-integration-goes-ga/containerd.png" width="100%" alt="containerd architecture" />

In containerd 1.1, the cri-containerd daemon is now refactored to be a containerd CRI plugin. The CRI plugin is built into containerd 1.1, and enabled by default. Unlike cri-containerd, the CRI plugin interacts with containerd through direct function calls. This new architecture makes the integration more stable and efficient, and eliminates another grpc hop in the stack. Users can now use Kubernetes with containerd 1.1 directly. The cri-containerd daemon is no longer needed.

# Performance
Improving performance was one of the major focus items for the containerd 1.1 release. Performance was optimized in terms of pod startup latency and daemon resource usage.

The following results are a comparison between containerd 1.1 and Docker 18.03 CE. The containerd 1.1 integration uses the CRI plugin built into containerd; and the Docker 18.03 CE integration uses the dockershim.

The results were generated using the Kubernetes node performance benchmark, which is part of [Kubernetes node e2e test](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-testing/e2e-tests.md). Most of the containerd benchmark data is publicly accessible on the [node performance dashboard](http://node-perf-dash.k8s.io/).

### Pod Startup Latency
The "105 pod batch startup benchmark" results show that the containerd 1.1 integration has lower pod startup latency than Docker 18.03 CE integration with dockershim (lower is better).

<p style="text-align:center;"><img src="/images/blog/2018-05-24-kubernetes-containerd-integration-goes-ga/latency.png" alt="latency"/></p>

### CPU and Memory
At the steady state, with 105 pods, the containerd 1.1 integration consumes less CPU and memory overall compared to Docker 18.03 CE integration with dockershim. The results vary with the number of pods running on the node, 105 is chosen because it is the current default for the maximum number of user pods per node.

As shown in the figures below, compared to Docker 18.03 CE integration with dockershim, the containerd 1.1 integration has 30.89% lower kubelet cpu usage, 68.13% lower container runtime cpu usage, 11.30% lower kubelet resident set size (RSS) memory usage, 12.78% lower container runtime RSS memory usage.

<img src="/images/blog/2018-05-24-kubernetes-containerd-integration-goes-ga/cpu.png" alt="cpu" width="50%"/><img src="/images/blog/2018-05-24-kubernetes-containerd-integration-goes-ga/memory.png" alt="memory" width="50%"/>

# crictl
Container runtime command-line interface (CLI) is a useful tool for system and application troubleshooting. When using Docker as the container runtime for Kubernetes, system administrators sometimes login to the Kubernetes node to run Docker commands for collecting system and/or application information. For example, one may use _docker ps_ and _docker inspect_ to check application process status, _docker images_ to list images on the node, and _docker info_ to identify container runtime configuration, etc.

For containerd and all other CRI-compatible container runtimes, e.g. dockershim, we recommend using _crictl_ as a replacement CLI over the Docker CLI for troubleshooting pods, containers, and container images on Kubernetes nodes.

_crictl_ is a tool providing a similar experience to the Docker CLI for Kubernetes node troubleshooting and _crictl_ works consistently across all CRI-compatible container runtimes. It is hosted in the [kubernetes-incubator/cri-tools](https://github.com/kubernetes-incubator/cri-tools) repository and the current version is [v1.0.0-beta.1](https://github.com/kubernetes-incubator/cri-tools/releases/tag/v1.0.0-beta.1). _crictl_ is designed to resemble the Docker CLI to offer a better transition experience for users, but it is not exactly the same. There are a few important differences, explained below.

## Limited Scope - crictl is a Troubleshooting Tool
The scope of _crictl_ is limited to troubleshooting, it is not a replacement to docker or kubectl. Docker's CLI provides a rich set of commands, making it a very useful development tool. But it is not the best fit for troubleshooting on Kubernetes nodes. Some Docker commands are not useful to Kubernetes, such as _docker network_ and _docker build_; and some may even break the system, such as _docker rename_. _crictl_ provides just enough commands for node troubleshooting, which is arguably safer to use on production nodes.

## Kubernetes Oriented
_crictl_ offers a more kubernetes-friendly view of containers. Docker CLI lacks core Kubernetes concepts, e.g. _pod_ and _[namespace](/docs/concepts/overview/working-with-objects/namespaces/)_, so it can't provide a clear view of containers and pods. One example is that _docker ps_ shows somewhat obscure, long Docker container names, and shows pause containers and application containers together:

<img src="/images/blog/2018-05-24-kubernetes-containerd-integration-goes-ga/docker-ps.png" width="100%" alt="docker ps" />

However, [pause containers](https://www.ianlewis.org/en/almighty-pause-container) are a pod implementation detail, where one pause container is used for each pod, and thus should not be shown when listing containers that are members of pods.

_crictl_, by contrast, is designed for Kubernetes. It has different sets of commands for pods and containers. For example, _crictl pods_ lists pod information, and _crictl ps_ only lists application container information. All information is well formatted into table columns.

<img src="/images/blog/2018-05-24-kubernetes-containerd-integration-goes-ga/crictl-pods.png" width="100%" alt="crictl pods" />
<img src="/images/blog/2018-05-24-kubernetes-containerd-integration-goes-ga/crictl-ps.png" width="100%" alt="crictl ps" />

As another example, _crictl pods_ includes a _--namespace_ option for filtering pods by the namespaces specified in Kubernetes.

<img src="/images/blog/2018-05-24-kubernetes-containerd-integration-goes-ga/crictl-pods-filter.png" width="100%" alt="crictl pods filter" />

For more details about how to use _crictl_ with containerd:

*   [Document](https://github.com/containerd/cri/blob/master/docs/crictl.md)
*   [Demo video](https://asciinema.org/a/179047)

# What about Docker Engine?
"Does switching to containerd mean I can't use Docker Engine anymore?" We hear this question a lot, the short answer is NO.

Docker Engine is built on top of containerd. The next release of [Docker Community Edition (Docker CE)](https://www.docker.com/community-edition) will use containerd version 1.1. Of course, it will have the CRI plugin built-in and enabled by default. This means users will have the option to continue using Docker Engine for other purposes typical for Docker users, while also being able to configure Kubernetes to use the underlying containerd that came with and is simultaneously being used by Docker Engine on the same node. See the architecture figure below showing the same containerd being used by Docker Engine and Kubelet:

<p style="text-align:center;"><img src="/images/blog/2018-05-24-kubernetes-containerd-integration-goes-ga/docker-ce.png" width="60%" alt="docker-ce"/></p>

Since containerd is being used by both Kubelet and Docker Engine, this means users who choose the containerd integration will not just get new Kubernetes features, performance, and stability improvements, they will also have the option of keeping Docker Engine around for other use cases.

A containerd [namespace](https://github.com/containerd/containerd/blob/master/docs/namespaces.md) mechanism is employed to guarantee that Kubelet and Docker Engine won't see or have access to containers and images created by each other. This makes sure they won't interfere with each other. This also means that:

*   Users won't see Kubernetes created containers with the _docker ps_ command. Please use _crictl ps_ instead. And vice versa, users won't see Docker CLI created containers in Kubernetes or with _crictl ps_ command. The _crictl create_ and _crictl runp_ commands are only for troubleshooting. Manually starting pod or container with _crictl_ on production nodes is not recommended.
*   Users won't see Kubernetes pulled images with the _docker images_ command. Please use the _crictl images_ command instead. And vice versa, Kubernetes won't see images created by _docker pull_, _docker load_ or _docker build_ commands. Please use the _crictl pull_ command instead, and _[ctr](https://github.com/containerd/containerd/blob/release/1.2/docs/man/ctr.1.md) cri load_ if you have to load an image.

# Summary
*   Containerd 1.1 natively supports CRI. It can be used directly by Kubernetes.
*   Containerd 1.1 is production ready.
*   Containerd 1.1 has good performance in terms of pod startup latency and system resource utilization.
*   _crictl_ is the CLI tool to talk with containerd 1.1 and other CRI-conformant container runtimes for node troubleshooting.
*   The next stable release of Docker CE will include containerd 1.1. Users have the option to continue using Docker for use cases not specific to Kubernetes, and configure Kubernetes to use the same underlying containerd that comes with Docker.

We'd like to thank all the contributors from Google, IBM, Docker, ZTE, ZJU and many other individuals who made this happen!

For a detailed list of changes in the containerd 1.1 release, please see the release notes here: [https://github.com/containerd/containerd/releases/tag/v1.1.0](https://github.com/containerd/containerd/releases/tag/v1.1.0)

# Try it out
To setup a Kubernetes cluster using containerd as the container runtime:

*   For a production quality cluster on GCE brought up with kube-up.sh, see [here](https://github.com/containerd/cri/blob/v1.0.0/docs/kube-up.md).
*   For a multi-node cluster installer and bring up steps using Ansible and kubeadm, see [here](https://github.com/containerd/cri/blob/v1.0.0/contrib/ansible/README.md).
*   For creating a cluster from scratch on Google Cloud, see [Kubernetes the Hard Way](https://github.com/kelseyhightower/kubernetes-the-hard-way).
*   For a custom installation from release tarball, see [here](https://github.com/containerd/cri/blob/v1.0.0/docs/installation.md).
*   To install using LinuxKit on a local VM, see [here](https://github.com/linuxkit/linuxkit/tree/master/projects/kubernetes).

# Contribute
The containerd CRI plugin is an open source github project within containerd [https://github.com/containerd/cri](https://github.com/containerd/cri). Any contributions in terms of ideas, issues, and/or fixes are welcome. The [getting started guide for developers](https://github.com/containerd/cri#getting-started-for-developers) is a good place to start for contributors.

# Community
The project is developed and maintained jointly by members of the Kubernetes SIG-Node community and the containerd community. We'd love to hear feedback from you. To join the communities:

*   [sig-node community site](https://github.com/kubernetes/community/tree/master/sig-node)
*   Slack:
    *   #sig-node channel in [kubernetes.slack.com](http://kubernetes.slack.com)
    *   #containerd channel in [https://dockr.ly/community](https://dockr.ly/community)
*   Mailing List: [https://groups.google.com/forum/#!forum/kubernetes-sig-node](https://groups.google.com/forum/#!forum/kubernetes-sig-node)
