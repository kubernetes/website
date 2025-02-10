---
title: "  Containerd Brings More Container Runtime Options for Kubernetes "
date: 2017-11-02
slug: containerd-container-runtime-options-kubernetes
url: /blog/2017/11/Containerd-Container-Runtime-Options-Kubernetes
author: >
  Lantao Liu (Google),
  Mike Brown (IBM)
---

_Update: Kubernetes support for Docker via `dockershim` is now deprecated.
For more information, read the [deprecation notice](/blog/2020/12/08/kubernetes-1-20-release-announcement/#dockershim-deprecation).
You can also discuss the deprecation via a dedicated [GitHub issue](https://github.com/kubernetes/kubernetes/issues/106917)._

A _container runtime_ is software that executes containers and manages container images on a node. Today, the most widely known container runtime is [Docker](https://www.docker.com/), but there are other container runtimes in the ecosystem, such as [rkt](https://coreos.com/rkt/), [containerd](https://containerd.io/), and [lxd](https://linuxcontainers.org/lxd/). Docker is by far the most common container runtime used in production Kubernetes environments, but Docker’s smaller offspring, containerd, may prove to be a better option. This post describes using containerd with Kubernetes.  

Kubernetes 1.5 introduced an internal plugin API named [Container Runtime Interface (CRI)](https://kubernetes.io/blog/2016/12/container-runtime-interface-cri-in-kubernetes) to provide easy access to different container runtimes. CRI enables Kubernetes to use a variety of container runtimes without the need to recompile. In theory, Kubernetes could use any container runtime that implements CRI to manage pods, containers and container images.  

Over the past 6 months, engineers from Google, Docker, IBM, ZTE, and ZJU have worked to implement CRI for containerd. The project is called [cri-containerd](https://github.com/kubernetes-incubator/cri-containerd), which had its [feature complete v1.0.0-alpha.0 release](https://github.com/kubernetes-incubator/cri-containerd/releases/tag/v1.0.0-alpha.0) on September 25, 2017. With cri-containerd, users can run Kubernetes clusters using containerd as the underlying runtime without Docker installed.  



## containerd


[Containerd](https://containerd.io/) is an [OCI](https://www.opencontainers.org/) compliant core container runtime designed to be embedded into larger systems. It provides the minimum set of functionality to execute containers and manages images on a node. It was initiated by Docker Inc. and [donated to CNCF](https://www.cncf.io/announcement/2017/03/29/containerd-joins-cloud-native-computing-foundation/) in March of 2017. The Docker engine itself is built on top of earlier versions of containerd, and will soon be updated to the newest version. Containerd is close to a feature complete stable release, with [1.0.0-beta.1](https://github.com/containerd/containerd/releases/tag/v1.0.0-beta.1) available right now.  

Containerd has a much smaller scope than Docker, provides a golang client API, and is more focused on being embeddable.The smaller scope results in a smaller codebase that’s easier to maintain and support over time, matching Kubernetes requirements as shown in the following table:  





| | Containerd Scope (In/Out) | Kubernetes Requirement |
|-|-|-|
| Container Lifecycle Management | In | Container Create/Start/Stop/Delete/List/Inspect (✔️) |
| Image Management | In | Pull/List/Inspect (✔️) |
| Networking | Out  No concrete network solution. User can setup network namespace and put containers into it. | Kubernetes networking deals with pods, rather than containers, so container runtimes should not provide complex networking solutions that  don't satisfy requirements. (✔️) |
| Volumes | Out, No volume management. User can setup host path, and mount it into container. |Kubernetes manages volumes. Container runtimes should not provide internal volume management that may conflict with Kubernetes. (✔️) |
| Persistent Container Logging | Out, No persistent container log. Container STDIO is provided as FIFOs, which can be redirected/decorated as is required. | Kubernetes has specific requirements for persistent container logs, such as format and path etc. Container runtimes should not &nbsp;persist an unmanageable container log. (✔️) |
| Metrics | In  Containerd provides container and snapshot metrics as part of the API. | Kubernetes expects container runtime to provide container metrics (CPU, Memory, writable layer size, etc.) and image filesystem usage (disk, inode usage, etc.). (✔️) |
Overall, from a technical perspective, containerd is a very good alternative container runtime for Kubernetes.|





## cri-containerd

[Cri-containerd](https://github.com/kubernetes-incubator/cri-containerd) is exactly that: an implementation of CRI for containerd. It operates on the same node as the Kubelet and containerd. Layered between Kubernetes and containerd, cri-containerd handles all CRI service requests from the Kubelet and uses containerd to manage containers and container images. Cri-containerd manages these service requests in part by forming containerd service requests while adding sufficient additional function to support the CRI requirements.  

 ![](https://lh6.googleusercontent.com/4NGAPzwhkL0GTNjkAEFN9iWX_Wc0ZE-AZxAxEw4E5aOntuGmv764b3ZYQUyapSnP9BrlUs2rUyo5kiCrj5QuiMHw3-dz2vPUDma029Qt3tej9QABEHFSsOBsq6LjLfFhTBgMhAAc)  

Compared with the current Docker CRI implementation ([dockershim](https://github.com/kubernetes/kubernetes/tree/master/pkg/kubelet/dockershim)), cri-containerd eliminates an extra hop in the stack, making the stack more stable and efficient.



## Architecture
Cri-containerd uses containerd to manage the full container lifecycle and all container images. As also shown below, cri-containerd manages pod networking via [CNI](https://github.com/containernetworking/cni) (another CNCF project).  

 ![](https://lh5.googleusercontent.com/sfkhKO3jiLZ9_TtPpxTsKxkbe1KHg1nrfqkbJYrjN2DbNQE_y31NJVSyDIXe0oQjSwVcQ4gFCyr1MZ9_V4GZuuiHwuU3Pq6ldpRhcRiiuTJaRVuezPK9KFLKovP8mQ6sXTYF_eru)  

Let’s use an example to demonstrate how cri-containerd works for the case when Kubelet creates a single-container pod:  

1. Kubelet calls cri-containerd, via the CRI runtime service API, to create a pod;
2. cri-containerd uses containerd to create and start a special [pause container](https://www.ianlewis.org/en/almighty-pause-container) (the _sandbox container_) and put that container inside the pod’s cgroups and namespace (steps omitted for brevity);
3. cri-containerd configures the pod’s network namespace using CNI;
4. Kubelet subsequently calls cri-containerd, via the CRI image service API, to pull the application container image;
5. cri-containerd further uses containerd to pull the image if the image is not present on the node;
6. Kubelet then calls cri-containerd, via the CRI runtime service API, to create and start the application container inside the pod using the pulled container image;
7. cri-containerd finally calls containerd to create the application container, put it inside the pod’s cgroups and namespace, then to start the pod’s new application container.
After these steps, a pod and its corresponding application container is created and running.



## Status
Cri-containerd v1.0.0-alpha.0 was released on Sep. 25, 2017.  

It is feature complete. All Kubernetes features are supported.  

All [CRI validation tests](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-node/cri-validation.md) have passed. (A CRI validation is a test framework for validating whether a CRI implementation meets all the requirements expected by Kubernetes.)  

All regular [node e2e tests](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-testing/e2e-tests.md) have passed. (The Kubernetes test framework for testing Kubernetes node level functionalities such as managing pods, mounting volumes etc.)  

To learn more about the v1.0.0-alpha.0 release, see the [project repository](https://github.com/kubernetes-incubator/cri-containerd/releases/tag/v1.0.0-alpha.0).



## Try it Out

For a multi-node cluster installer and bring up steps using ansible and kubeadm, see [this repo link](https://github.com/kubernetes-incubator/cri-containerd/blob/master/contrib/ansible/README.md).  

For creating a cluster from scratch on Google Cloud, see [Kubernetes the Hard Way](https://github.com/kelseyhightower/kubernetes-the-hard-way).  

For a custom installation from release tarball, see [this repo link](https://github.com/kubernetes-incubator/cri-containerd/blob/master/docs/installation.md).  

For a installation with LinuxKit on a local VM, see [this repo link](https://github.com/linuxkit/linuxkit/tree/master/projects/kubernetes).





## Next Steps
We are focused on stability and usability improvements as our next steps.  


- Stability:

  - Set up a full set of Kubernetes integration test in the Kubernetes test infrastructure on various OS distros such as Ubuntu, COS ([Container-Optimized OS](https://cloud.google.com/container-optimized-os/docs/)) etc.
  - Actively fix any test failures and other issues reported by users.


- Usability:

  - Improve the user experience of [_crictl_](https://github.com/kubernetes-incubator/cri-tools/blob/master/docs/crictl.md). Crictl is a portable command line tool for all CRI container runtimes. The goal here is to make it easy to use for debug and development scenarios.
  - Integrate cri-containerd with [_kube-up.sh_](/docs/getting-started-guides/gce/), to help users bring up a production quality Kubernetes cluster using cri-containerd and containerd.
  - Improve our documentation for users and admins alike.

We plan to release our v1.0.0-beta.0 by the end of 2017.





## Contribute
Cri-containerd is a Kubernetes incubator project located at [https://github.com/kubernetes-incubator/cri-containerd](https://github.com/kubernetes-incubator/cri-containerd). Any contributions in terms of ideas, issues, and/or fixes are welcome. The [getting started guide for developers](https://github.com/kubernetes-incubator/cri-containerd#getting-started-for-developers) is a good place to start for contributors.



## Community

Cri-containerd is developed and maintained by the Kubernetes SIG-Node community. We’d love to hear feedback from you. To join the community:  

- [sig-node community site](https://github.com/kubernetes/community/tree/master/sig-node)
- Slack: #sig-node channel in Kubernetes ([kubernetes.slack.com](http://kubernetes.slack.com/))
- Mailing List: [https://groups.google.com/forum/#!forum/kubernetes-sig-node](https://groups.google.com/forum/#!forum/kubernetes-sig-node)
