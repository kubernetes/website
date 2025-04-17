---
layout: blog
title: "Kubernetes v1.33: Image Pull Policy the way you always thought it worked!"
date:  2025-05-12
draft: true
slug: kubernetes-v1-33-ensure-secret-pulled-images-alpha
author: >
  [Ben Petersen](https://github.com/benjaminapetersen) (Microsoft),
  [Stanislav Láznička](https://github.com/stlaz) (Microsoft)
---

## Image Pull Policy the way you always thought it worked!

Some things in Kubernetes are surprising, and the way `imagePullPolicy` behaves might
be one of them. Given Kubernetes is all about running pods, it may be peculiar
to learn that there has been a caveat to restricting pod access to authenticated images for
over 10 years in the form of [issue 18787](https://github.com/kubernetes/kubernetes/issues/18787)!
It is an exciting release when you can resolve a ten-year-old issue.

{{< note >}}
Throughout this blog post, the term "pod credentials" will be used often. In this context,
the term generally encapsulates the authentication material that is available to a pod
to authenticate a container image pull.
{{< /note >}}

## IfNotPresent, even if I'm not supposed to have it

The gist of the problem is that the `imagePullPolicy: IfNotPresent` strategy has done
precisely what it says, and nothing more. Let's set up a scenario. To begin, *Pod A* in *Namespace X* is scheduled to *Node 1* and requires *image Foo* from a private repository.
For it's image pull authentication material, the pod references *Secret 1* in its `imagePullSecrets`. *Secret 1* contains the necessary credentials to pull from the private repository. The Kubelet will utilize the credentials from *Secret 1* as supplied by *Pod A*
and it will pull *container image Foo* from the registry.  This is the intended (and secure)
behavior.

But now things get curious. If *Pod B* in *Namespace Y* happens to also be scheduled to *Node 1*, unexpected (and potentially insecure) things happen. *Pod B* may reference the same private image, specifying the `IfNotPresent` image pull policy. *Pod B* does not reference *Secret 1*
(or in our case, any secret) in it's `imagePullSecrets`. When the Kubelet tries to run the pod, it honors the `IfNotPresent` policy. The Kubelet sees that the *image Foo* is already present locally, and will provide *image Foo* to *Pod B*. *Pod B* gets to run the image even though it did not provide credentials authorizing it to pull the image in the first place.

{{< figure
    src="ensure_secret_image_pulls.svg"
    caption="Using a private image pulled by a different pod"
    alt="Illustration of the process of two pods trying to access a private image, the first one with a pull secret, the second one without it"
>}}

While `IfNotPresent` should not pull *image Foo* if it is already present
on the node, it is an incorrect security posture to allow all pods scheduled
to a node to have access to previously pulled private image. These pods were never
authorized to pull the image in the first place.

## IfNotPresent, but only if I am supposed to have it

In Kubernetes v1.33, we - SIG Auth and SIG Node - are finally addressing this (really old) problem and getting the verification right! The basic expected behavior is not changed. If
an image is not present, the Kubelet will attempt to pull the image. The credentials each pod supplies will be utilized for this task. This matches behavior prior to 1.33.

If the image is present, then the behavior of the Kubelet changes. The Kubelet will now
verify the pod's credentials before allowing the pod to use the image.

Performance and service stability have been a consideration while revising the feature.
Pods utilizing the same credential will not be required to re-authenticate. This is
also true when pods source credentials from the same Kubernetes Secret object, even
when the credentials are rotated.

## Never pull, but use if authorized

The `imagePullPolicy: Never` option does not fetch images. However, if the
container image is already present on the node, any pod attempting to use the private
image will be required to provide credentials, and those credentials require verification.

Pods utilizing the same credential will not be required to re-authenticate.
Pods that do not supply credentials previously used to successfully pull an
image will not be allowed to use the private image.

## Always pull, if authorized

The `imagePullPolicy: Always` has always worked as intended. Each time an image
is requested, the request goes to the registry and the registry will perform an authentication
check.

In the past, forcing the `Always` image pull policy via pod admission was the only way to ensure
that your private container images didn't get reused by other pods on nodes which already pulled the images.

Fortunately, this was somewhat performant. Only the image manifest was pulled, not the image. However, there was still a cost and a risk. During a new rollout, scale up, or pod restart, the image registry that provided the image MUST be available for the auth check, putting the image registry in the critical path for stability of services running inside of the cluster.

## How it all works

The feature is based on persistent, file-based caches that are present on each of
the nodes. The following is a simplified description of how the feature works.
For the complete version, please see [KEP-2535](https://kep.k8s.io/2535).

The process of requesting an image for the first time goes like this:
  1. A pod requesting an image from a private registry is scheduled to a node.
  1. The image is not present on the node.
  1. The Kubelet makes a record of the intention to pull the image.
  1. The Kubelet extracts credentials from the Kubernetes Secret referenced by the pod
     as an image pull secret, and uses them to pull the image from the private registry.
  1. After the image has been successfully pulled, the Kubelet makes a record of
     the successful pull. This record includes details about credentials used
     (in the form of a hash) as well as the Secret from which they originated.
  1. The Kubelet removes the original record of intent.
  1. The Kubelet retains the record of successful pull for later use.

When future pods scheduled to the same node request the previously pulled private image:
  1. The Kubelet checks the credentials that the new pod provides for the pull.
  1. If the hash of these credentials, or the source Secret of the credentials match
     the hash or source Secret which were recorded for a previous successful pull,
     the pod is allowed to use the previously pulled image.
  1. If the credentials or their source Secret are not found in the records of
     successful pulls for that image, the Kubelet will attempt to use
     these new credentials to request a pull from the remote registry, triggering
     the authorization flow.

## Try it out

In Kubernetes v1.33 we shipped the alpha version of this feature. To give it a spin,
enable the `KubeletEnsureSecretPulledImages` feature gate for your 1.33 Kubelets.

You can learn more about the feature and additional optional configuration on the
[concept page for Images](/docs/concepts/containers/images/#ensureimagepullcredentialverification)
in the official Kubernetes documentation.

## What's next?

In future releases we are going to:
1. Make this feature work together with [Projected service account tokens for Kubelet image credential providers](https://kep.k8s.io/4412) which adds a new, workload-specific source of image pull credentials.
1. Write a benchmarking suite to measure the performance of this feature and assess the impact of
   any future changes.
1. Implement an in-memory caching layer so that we don't need to read files for each image
   pull request.
1. Add support for credential expirations, thus forcing previously validated credentials to
   be re-authenticated.

## How to get involved

[Reading KEP-2535](https://kep.k8s.io/2535) is a great way to understand these changes in depth.

If you are interested in further involvement, reach out to us on the [#sig-auth-authenticators-dev](https://kubernetes.slack.com/archives/C04UMAUC4UA) channel
on Kubernetes Slack (for an invitation, visit [https://slack.k8s.io/](https://slack.k8s.io/)).
You are also welcome to join the bi-weekly [SIG Auth meetings](https://github.com/kubernetes/community/blob/master/sig-auth/README.md#meetings),
held every other Wednesday.