---
layout: blog
title: "Image Pull Policy the way you always thought it worked!"
date: 2025-04-08
draft: false
slug: ensure-secret-pulled-images-alpha
author: >
  [Ben Petersen](https://github.com/benjaminapetersen) (Microsoft),
  [Stanislav Láznička](https://github.com/stlaz) (Microsoft)
---

## Image Pull Policy the way you always thought it worked!

Some things in Kubernetes are surprising, and the way `imagePullPolicy` behaves might
be one of them. Given Kubernetes is all about running pods, it may be surprising
to learn that there has been a caveat to restricting pod access to authenticated images for
over 10 years in the form of [this issue](https://github.com/kubernetes/kubernetes/issues/18787)!
It is an exciting release when you can resolve a ten year old issue.

{{< note >}}
Throughout this blog post, the term "pod credentials" will be used often. In this context,
the term generally encapsulates the authentication material that is available to a pod
to authenticate a container image pull.
{{< /note >}}

## IfNotPresent, even if I'm not supposed to have it

The gist of the problem is that the `imagePullPolicy: IfNotPresent` strategy has done
exactly its job. *Pod A* in a *Namespace X* is scheduled to a *Node 1*, and requires
*image Foo* from a private repository. The pod references *Secret 1* in its `imagePullSecrets`.
*Secret 1* contains the necessary credentials to pull from the private repository.
The Kubelet will utilize the credentials from *Secret 1* as supplied by *Pod A*
and it pulls *container image Foo* from the registry. This is exactly what you expect.

But, if *Pod B* in *Namespace Y* happens to also be scheduled to *Node 1*, funny things
can happen. *Pod B* may reference the same private image, specifying the `IfNotPresent`
image pull policy. When the Kubelet tries to run the pod, it honors the `IfNotPresent`
policy, it sees that the *image Foo* is already present locally, and will
provide *image Foo* to *Pod B*. Surely that is ok since the container image is already
present, right?

{{< figure
    src="ensure_secret_image_pulls.svg"
    caption="Using a private image pulled by a different pod"
    alt="Illustration of the process of two pods trying to access a private image, the first one with a pull secret, the second one without it"
>}}

Wrong. While `IfNotPresent` should not pull *image Foo* if it is already present
on the node, it is an incorrect security posture to allow all pods scheduled
to a node to have access to that private image, discarding the fact that these
pods would otherwise never be able to pull that image from the remote repository
in the first place.

## IfNotPresent, but only if I am supposed to have it

In Kubernetes 1.33, we - SIG Auth and SIG Node - are finally addressing this (really old) problem and
getting the verification right! As expected, if an image is not present, the Kubelet will
attempt to pull the image. The credentials each pod supplies will be utilized for this
task. This matches behavior prior to 1.33.

If the image is present, this is where the behavior changes.
The Kubelet will now verify the pod's credentials before allowing the pod to use
the image.

Performance and service stability have been a consideration while designing the feature.
Pods utilizing the same credential will not be required to re-authenticate. This is
also true in case the credentials sourced from the same Kubernetes Secret object rotated.

## Never pull, but prove you can use it!

The `imagePullPolicy: Never` option does not fetch images. Ever. However, if the
container image is already present on the node, the pod's credentials to use the
image may still require verification.

Just like before, pods utilizing the same credential will not be required to re-authenticate.
If the pod is not able to supply credentials previously used to successfully pull an
image, though, the `Never` image pull policy will make it fail because without
the ability to pull images, the pod just has no way to access the image.

## Always?

The `imagePullPolicy: Always` has always worked as intended. Each time an image
is requested, the request goes to the registry and there will be an authentication
check.

In the past, forcing the `Always` image pull policy via pod admission was the only way to ensure
that your private container images didn't get reused by other pods on nodes which already pulled the images.

Fortunately, only the image manifest usually gets pulled in these cases instead
of the whole image. However, this means that whenever this check is done (during a new rollout,
scale up, or pod restart), the image registry that provides the image MUST be available, making
the image registry critical for stability of services running inside of the cluster.

## How it all works

The feature is based on persistent, file-based caches that are present on each of
the nodes. The following is a simplified description of how the feature works,
for the complete version, please see [KEP-2535](https://github.com/kubernetes/enhancements/blob/0262549808ebe7e64b94ee6f8e4fbdd024332470/keps/sig-node/2535-ensure-secret-pulled-images/README.md).

The process of requesting an image for the first time goes likes this:
  1. A pod requesting an image from a private registry is scheduled to a node.
  1. The image is not present on the node and so the Kubelet makes a record about
     the intention to pull the image.
  1. The Kubelet extracts credentials from the Kubernetes Secret referenced by the Pod
     as an image pull secret, and uses them to pull the image from the private registry.
  1. After the image has been successfully pulled, the Kubelet makes a record about
     the successful pull, including the details about credentials used and the Secret
     they originated from.
  1. The Kubelet removes the original record about the intent to pull an image.

When future pods scheduled to the same node request the same private image that was pulled before:
  1. The Kubelet checks the credentials that the pod provided for the pull.
  1. If the credential hash, or the source Secret of the credentials match the hash or source
     Secret which were recorded for a successful pull before, the pod is allowed to use
     the already-pulled image.
  1. If the credentials or their source Secret are not found in the records of
     previous successful pulls for that image, the Kubelet will attempt to use
     these new credentials to request a pull from the remote registry.

## Try it out

In Kubernetes 1.33 we shipped the alpha version of this feature. To give it a spin,
enable the `KubeletEnsureSecretPulledImages` feature gate for your 1.33 Kubelets.

You can learn more about the feature and additional optional configuration on the
[concept page for Images](/docs/concepts/containers/images/#ensureimagepullcredentialverification)
in the official Kubernetes documentation.

## What's next?

In future releases, there are a couple of areas for us to focus on:
1. Make the feature work together with [Projected service account tokens for Kubelet image credential providers](https://kep.k8s.io/4412) which
   adds a new, workload-specific source of image pull credentials.
1. Write a benchmarking suite to be able to measure the performance of the feature,
   and to be able to measure the performance impact of any future changes to it.
1. Implement an in-memory caching layer so that we don't need to read files for each image pull request.

## How to get involved

[Reading KEP-2535](https://kep.k8s.io/2535) is a great way to understand these changes in depth.

If you are interested in further involvement, reach out in Slack
on the [#sig-auth-authenticators-dev](https://kubernetes.slack.com/archives/C04UMAUC4UA) channel
on Kubernetes Slack (for an invitation, visit [https://slack.k8s.io/](https://slack.k8s.io/)).
You are also welcome to join the bi-weekly [SIG Auth meetings](https://github.com/kubernetes/community/blob/master/sig-auth/README.md#meetings),
held every other Wednesday.