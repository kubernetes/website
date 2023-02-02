---
layout: blog
title: "k8s.gcr.io image registry will be frozen from the 3rd of April 2023"
date: 2023-02-06
slug: k8s-gcr-io-freeze-announcement
---

**Authors**: Mahamed Ali (Rackspace Technology)

The Kubernetes project has released a new community-owned image registry called `registry.k8s.io`. This registry has been generally available(GA) for several months, and we have published a [blog post](https://kubernetes.io/blog/2022/11/28/registry-k8s-io-faster-cheaper-ga/) about it, its benefits to the community, and the Kubernetes project. This post also announced that future versions of Kubernetes will not be available in the old registry.

On the 3rd of April 2023, the `k8s.gcr.io` image registry will be frozen and no further images for Kubernetes and related subprojects will be pushed to the old registry.

What does this change mean for contributors:
- If you are a maintainer of a subproject, you will need to update your manifests and Helm charts to use the new registry.

What does this change mean for end users:
- 1.27 Kubernetes release will not be published to the old registry.
- Starting in 1.25, the default image registry has been set to `registry.k8s.io`. This value is overridable but will no longer work for any version of Kubernetes released after April as they won’t be present in the old registry.
- If you are running Kubernetes in networks where outbound traffic is restricted, you should consider hosting local image registry mirrors.

Timeline of the Changes:

- `k8s.gcr.io` will be frozen on the 3rd of April 2023
- 1.27 is expected to be released on the 12th of April 2023
- The last 1.23 release on `k8s.gcr.io` will be 1.23.18 (1.23 goes EoL before the freeze)
- The last 1.24 release on `k8s.gcr.io` will be 1.24.12
- The last 1.25 release on `k8s.gcr.io` will be 1.25.8
- The last 1.26 release on `k8s.gcr.io` will be 1.26.3


## Acknowledgments

__Change is hard__, and evolving our image-serving platform is needed to ensure a sustainable future for the project. We strive to make things better for everyone using Kubernetes. Many contributors from all corners of our community have been working long and hard to ensure we are making the best decisions possible, executing plans, and doing our best to communicate those plans. 

Thanks to Aaron Crickenberger, Arnaud Meukam, Benjamin Elder, Caleb Woodbine, Davanum Srinivas, Mahamed Ali, and Tim Hockin from SIG K8s Infra, Brian McQueen, and Sergey Kanzhelev from SIG Node, Lubomir Ivanov from SIG Cluster Lifecycle, Adolfo García Veytia, Jeremy Rickard, Sascha Grunert, and Stephen Augustus from SIG Release, Bob Killen and Kaslin Fields from SIG Contribex, Tim Allclair from the Security Response Committee. Also a big thank you to our friends acting as liaisons with our cloud provider partners: Jay Pipes from Amazon and Jon Johnson Jr. from Google.
