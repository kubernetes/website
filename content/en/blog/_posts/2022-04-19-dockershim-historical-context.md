---
layout: blog
title: "Dockershim: The Historical Context"
date: 2022-04-19
slug: dockershim-historical-context
---

**Author:** Kat Cosgrove


Dockershim has been removed as of Kubernetes v1.24, and this is a positive move for the project. However, context is important for fully understanding something, be it socially or in software development, and this deserves a more in-depth review. Alongside the dockershim removal in Kubernetes v1.24, we’ve seen some confusion and even panic in the community, largely due to a lack of context around this removal. The decision to deprecate and eventually remove it from Kubernetes was not made quickly or lightly. Still, it’s been in the works for so long that many of today’s users are newer than that decision, and certainly newer than the choices that led to the dockershim being necessary in the first place.

So what is the dockershim, and why is it going away?

In the early days of Kubernetes, we only supported one container runtime. That runtime was Docker Engine. Back then, there weren’t really a lot of other options out there and Docker was the dominant tool for working with containers, so this was not a controversial choice. Eventually, we started adding more container runtimes, like rkt and hypernetes, and it became clear that Kubernetes needed a way to allow cluster operators the flexibility to use whatever runtime they choose.

The [Container Runtime Interface](/blog/2016/12/container-runtime-interface-cri-in-kubernetes/) (CRI) was released to allow that flexibility. The introduction of CRI was great for the project and users alike, but it did introduce a problem: Docker Engine’s use as a container runtime predates CRI, and Docker Engine is not CRI-compatible. To solve this issue, a small software shim (dockershim) was introduced specifically to fill in the gaps between Docker Engine and CRI, allowing cluster operators to continue using Docker Engine as their container runtime largely uninterrupted.

This little software shim was never intended to be a permanent solution, though. Over the course of years, its existence has introduced a lot of unnecessary complexity to the kubelet itself. Some integrations are inconsistently implemented for Docker because of this shim, resulting in an increased burden on maintainers, and maintaining vendor-specific code is not in line with our open source philosophy. To reduce this maintenance burden and move towards a more collaborative community in support of open standards, [KEP-2221 was introduced](https://github.com/kubernetes/enhancements/tree/master/keps/sig-node/2221-remove-dockershim), proposing the removal of the dockershim. With the release of Kubernetes v1.20, the deprecation was official.

We didn’t do a great job communicating this, and unfortunately, the deprecation announcement led to some panic within the community. Confusion around what this meant for Docker as a company, if container images built by Docker would still run, and what Docker Engine actually is led to a conflagration on social media. This was our fault; we should have more clearly communicated what was happening and why at the time. To combat this, we released [a blog](/blog/2020/12/02/dont-panic-kubernetes-and-docker/) and [accompanying FAQ](/blog/2020/12/02/dockershim-faq/) to allay the community’s fears and correct some misconceptions around what Docker is, and how containers work within Kubernetes. As a result of the community’s concerns, Docker and Mirantis jointly agreed to continue supporting the dockershim code in the form of [cri-dockerd](https://github.com/Mirantis/cri-dockerd), allowing you to continue using Docker Engine as your container runtime if need be.

Docker is not going away, either as a tool or as a company. It’s an important part of the cloud native community, and of the history of the Kubernetes project. We wouldn’t be where we are without them. That said, the removal of the dockershim from kubelet is ultimately good for the community, the ecosystem, the project, and open source at large. This is an opportunity for all of us to come together in support of open standards, and we’re glad to be doing so with the help of Docker and the community.
