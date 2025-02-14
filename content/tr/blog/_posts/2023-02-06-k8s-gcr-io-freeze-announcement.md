---
layout: blog
title: "k8s.gcr.io Image Registry Will Be Frozen From the 3rd of April 2023"
date: 2023-02-06
slug: k8s-gcr-io-freeze-announcement
author: >
   Mahamed Ali (Rackspace Technology)
---

The Kubernetes project runs a community-owned image registry called `registry.k8s.io`
to host its container images. On the 3rd of April 2023, the old registry `k8s.gcr.io`
will be frozen and no further images for Kubernetes and related subprojects will be
pushed to the old registry.

This registry `registry.k8s.io` replaced the old one and has been generally available
for several months. We have published a [blog post](/blog/2022/11/28/registry-k8s-io-faster-cheaper-ga/)
about its benefits to the community and the Kubernetes project. This post also
announced that future versions of Kubernetes will not be available in the old
registry. Now that time has come.

What does this change mean for contributors:

- If you are a maintainer of a subproject, you will need to update your manifests
  and Helm charts to use the new registry.

What does this change mean for end users:

- 1.27 Kubernetes release will not be published to the old registry.
- Patch releases for 1.24, 1.25, and 1.26 will no longer be published to the old
  registry from April. Please read the timelines below for details of the final
  patch releases in the old registry.
- Starting in 1.25, the default image registry has been set to `registry.k8s.io`.
  This value is overridable in `kubeadm` and `kubelet` but setting it to `k8s.gcr.io`
  will fail for new releases after April as they won’t be present in the old registry.
- If you want to increase the reliability of your cluster and remove dependency on
  the community-owned registry or you are running Kubernetes in networks where
  external traffic is restricted, you should consider hosting local image registry
  mirrors. Some cloud vendors may offer hosted solutions for this.

## Timeline of the changes

- `k8s.gcr.io` will be frozen on the 3rd of April 2023
- 1.27 is expected to be released on the 12th of April 2023
- The last 1.23 release on `k8s.gcr.io` will be 1.23.18 (1.23 goes end-of-life before the freeze)
- The last 1.24 release on `k8s.gcr.io` will be 1.24.12
- The last 1.25 release on `k8s.gcr.io` will be 1.25.8
- The last 1.26 release on `k8s.gcr.io` will be 1.26.3

## What's next

Please make sure your cluster does not have dependencies on old image registry.
For example,  you can run this command to list the images used by pods:

```shell
kubectl get pods --all-namespaces -o jsonpath="{.items[*].spec.containers[*].image}" |\
tr -s '[[:space:]]' '\n' |\
sort |\
uniq -c
```

There may be other dependencies on the old image registry. Make sure you review
any potential dependencies to keep your cluster healthy and up to date.

## Acknowledgments

__Change is hard__, and evolving our image-serving platform is needed to ensure
a sustainable future for the project. We strive to make things better for everyone
using Kubernetes. Many contributors from all corners of our community have been
working long and hard to ensure we are making the best decisions possible,
executing plans, and doing our best to communicate those plans.

Thanks to Aaron Crickenberger, Arnaud Meukam, Benjamin Elder, Caleb Woodbine,
Davanum Srinivas, Mahamed Ali, and Tim Hockin from SIG K8s Infra, Brian McQueen,
and Sergey Kanzhelev from SIG Node, Lubomir Ivanov from SIG Cluster Lifecycle,
Adolfo García Veytia, Jeremy Rickard, Sascha Grunert, and Stephen Augustus from
SIG Release, Bob Killen and Kaslin Fields from SIG Contribex, Tim Allclair from
the Security Response Committee. Also a big thank you to our friends acting as
liaisons with our cloud provider partners: Jay Pipes from Amazon and Jon Johnson
Jr. from Google.
