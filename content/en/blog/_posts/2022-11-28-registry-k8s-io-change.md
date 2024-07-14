---
layout: blog
title: "registry.k8s.io: faster, cheaper and Generally Available (GA)"
date: 2022-11-28
slug: registry-k8s-io-faster-cheaper-ga
author: >
   Adolfo García Veytia (Chainguard),
   Bob Killen (Google)
---

Starting with Kubernetes 1.25, our container image registry has changed from k8s.gcr.io to [registry.k8s.io](https://registry.k8s.io). This new registry spreads the load across multiple Cloud Providers & Regions, functioning as a sort of content delivery network (CDN) for Kubernetes container images. This change reduces the project’s reliance on a single entity and provides a faster download experience for a large number of users.

## TL;DR: What you need to know about this change

* Container images for Kubernetes releases from <del>1.25</del> 1.27 onward are not published to k8s.gcr.io, only to registry.k8s.io.
* In the upcoming December patch releases, the new registry domain default will be backported to all branches still in support (1.22, 1.23, 1.24).
* If you run in a restricted environment and apply strict domain/IP address access policies limited to k8s.gcr.io, the __image pulls will not function__ after the migration to this new registry. For these users, the recommended method is to mirror the release images to a private registry.

If you’d like to know more about why we made this change, or some potential issues you might run into, keep reading.

## Why has Kubernetes changed to a different image registry?

k8s.gcr.io is hosted on a custom [Google Container Registry](https://cloud.google.com/container-registry) (GCR) domain that was setup solely for the Kubernetes project. This has worked well since the inception of the project, and we thank Google for providing these resources, but today there are other cloud providers and vendors that would like to host images to provide a better experience for the people on their platforms. In addition to Google’s [renewed commitment to donate $3 million](https://www.cncf.io/google-cloud-recommits-3m-to-kubernetes/) to support the project's infrastructure, Amazon announced a matching donation during their Kubecon NA 2022 keynote in Detroit. This will provide a better experience for users (closer servers = faster downloads) and will reduce the egress bandwidth and costs from GCR at the same time. registry.k8s.io will spread the load between Google and Amazon, with other providers to follow in the future.

## Why isn’t there a stable list of domains/IPs? Why can’t I restrict image pulls?

registry.k8s.io is a [secure blob redirector](https://github.com/kubernetes/registry.k8s.io/blob/main/cmd/archeio/docs/request-handling.md) that connects clients to the closest cloud provider. The nature of this change means that a client pulling an image could be redirected to any one of a large number of backends. We expect the set of backends to keep changing and will only increase as more and more cloud providers and vendors come on board to help mirror the release images. 

Restrictive control mechanisms like man-in-the-middle proxies or network policies that restrict access to a specific list of IPs/domains will break with this change. For these scenarios, we encourage you to mirror the release images to a local registry that you have strict control over.

For more information on this policy, please see the [stability section of the registry.k8s.io documentation](https://github.com/kubernetes/registry.k8s.io#stability).

## What kind of errors will I see? How will I know if I’m still using the old address?

Errors may depend on what kind of container runtime you are using, and what endpoint you are routed to, but it should present as a container failing to be created with the warning `FailedCreatePodSandBox`.

Below is an example error message showing a proxied deployment failing to pull due to an unknown certificate:

```
FailedCreatePodSandBox: Failed to create pod sandbox: rpc error: code = Unknown desc = Error response from daemon: Head “https://us-west1-docker.pkg.dev/v2/k8s-artifacts-prod/images/pause/manifests/3.8”: x509: certificate signed by unknown authority
```

## I’m impacted by this change, how do I revert to the old registry address?

If using the new registry domain name is not an option, you can revert to the old domain name for cluster versions less than 1.25. Keep in mind that, eventually, you will have to switch to the new registry, as new image tags will no longer be pushed to GCR.

### Reverting the registry name in kubeadm
The registry used by kubeadm to pull its images can be controlled by two methods:

Setting the `--image-repository` flag. 

```
kubeadm init --image-repository=k8s.gcr.io
```

Or in [kubeadm config](/docs/reference/config-api/kubeadm-config.v1beta3/) `ClusterConfiguration`:

```yaml
apiVersion: kubeadm.k8s.io/v1beta3
kind: ClusterConfiguration
imageRepository: "k8s.gcr.io"
```

### Reverting the Registry Name in kubelet

The image used by kubelet for the pod sandbox (`pause`) can be overridden
by configuring your container runtime or by setting the `--pod-infra-container-image`
flag depending on the version of Kubernetes you are using.

Other runtimes:
[containerd](/docs/setup/production-environment/container-runtimes/#override-pause-image-containerd),
[CRI-O](/docs/setup/production-environment/container-runtimes/#override-pause-image-cri-o),
[cri-dockerd](/docs/setup/production-environment/container-runtimes/#override-pause-image-cri-dockerd-mcr).

When using dockershim before v1.23:

```
kubelet --pod-infra-container-image=k8s.gcr.io/pause:3.5
```

## Legacy container registry freeze {#registry-freeze}

[k8s.gcr.io Image Registry Will Be Frozen From the 3rd of April 2023](/blog/2023/02/06/k8s-gcr-io-freeze-announcement/) announces the freeze of the
legacy k8s.gcr.io image registry. Read that article for more details.

## Acknowledgments

__Change is hard__, and evolving our image-serving platform is needed to ensure a sustainable future for the project. We strive to make things better for everyone using Kubernetes. Many contributors from all corners of our community have been working long and hard to ensure we are making the best decisions possible, executing plans, and doing our best to communicate those plans. 

Thanks to Aaron Crickenberger, Arnaud Meukam, Benjamin Elder, Caleb Woodbine, Davanum Srinivas, Mahamed Ali, and Tim Hockin from SIG K8s Infra, Brian McQueen, and Sergey Kanzhelev from SIG Node, Lubomir Ivanov from SIG Cluster Lifecycle, Adolfo García Veytia, Jeremy Rickard, Sascha Grunert, and Stephen Augustus from SIG Release, Bob Killen and Kaslin Fields from SIG Contribex, Tim Allclair from the Security Response Committee. Also a big thank you to our friends acting as liaisons with our cloud provider partners: Jay Pipes from Amazon and Jon Johnson Jr. from Google.

_This article was updated on the 28th of February 2023._
