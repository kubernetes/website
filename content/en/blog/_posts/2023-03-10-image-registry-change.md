---
layout: blog
title: "k8s.gcr.io Redirect to registry.k8s.io - What You Need to Know"
date: 2023-03-10T17:00:00.000Z
slug: image-registry-redirect
author: >
   Bob Killen (Google),
   Davanum Srinivas (AWS),
   Chris Short (AWS),
   Frederico Muñoz (SAS Institute),
   Tim Bannister (The Scale Factory),
   Ricky Sadowski (AWS),
   Grace Nguyen (Expo),
   Mahamed Ali (Rackspace Technology),
   Mars Toktonaliev (independent),
   Laura Santamaria (Dell),
   Kat Cosgrove (Dell)
---

On Monday, March 20th, the k8s.gcr.io registry [will be redirected to the community owned
registry](https://kubernetes.io/blog/2022/11/28/registry-k8s-io-faster-cheaper-ga/),
**registry.k8s.io** .


## TL;DR: What you need to know about this change

- On Monday, March 20th, traffic from the older k8s.gcr.io registry will be redirected to
  registry.k8s.io with the eventual goal of sunsetting k8s.gcr.io.
- If you run in a restricted environment, and apply strict domain name or IP address access policies
  limited to k8s.gcr.io, **the image pulls will not function** after k8s.gcr.io starts redirecting
  to the new registry. 
- A small subset of non-standard clients do not handle HTTP redirects by image registries, and will
  need to be pointed directly at registry.k8s.io.
- The redirect is a stopgap to assist users in making the switch. The deprecated k8s.gcr.io registry
  will be phased out at some point. **Please update your manifests as soon as possible to point to
  registry.k8s.io**.
- If you host your own image registry, you can copy images you need there as well to reduce traffic
  to community owned registries.

If you think you may be impacted, or would like to know more about this change, please keep reading.

## How can I check if I am impacted?

To test connectivity to registry.k8s.io and being able to pull images from there, here is a sample
command that can be executed in the namespace of your choosing:

```
kubectl run hello-world -ti --rm --image=registry.k8s.io/busybox:latest --restart=Never -- date
```

When you run the command above, here’s what to expect when things work correctly:

```
$ kubectl run hello-world -ti --rm --image=registry.k8s.io/busybox:latest --restart=Never -- date
Fri Feb 31 07:07:07 UTC 2023
pod "hello-world" deleted
```

## What kind of errors will I see if I’m impacted?

Errors may depend on what kind of container runtime you are using, and what endpoint you are routed
to, but it should present such as `ErrImagePull`, `ImagePullBackOff`, or a container failing to be
created with the warning `FailedCreatePodSandBox`.

Below is an example error message showing a proxied deployment failing to pull due to an unknown
certificate:

```
FailedCreatePodSandBox: Failed to create pod sandbox: rpc error: code = Unknown desc = Error response from daemon: Head “https://us-west1-docker.pkg.dev/v2/k8s-artifacts-prod/images/pause/manifests/3.8”: x509: certificate signed by unknown authority
```

## What images will be impacted?

**ALL** images on k8s.gcr.io will be impacted by this change. k8s.gcr.io hosts many images beyond
Kubernetes releases. A large number of Kubernetes subprojects host their images there as well. Some
examples include the `dns/k8s-dns-node-cache`, `ingress-nginx/controller`, and
`node-problem-detector/node-problem-detector` images.

## I am impacted. What should I do?

For impacted users that run in a restricted environment, the best option is to copy over the
required images to a private registry or configure a pull-through cache in their registry.

There are several tools to copy images between registries;
[crane](https://github.com/google/go-containerregistry/blob/main/cmd/crane/doc/crane_copy.md) is one
of those tools, and images can be copied to a private registry by using `crane copy SRC DST`. There
are also vendor-specific tools, like e.g. Google’s
[gcrane](https://cloud.google.com/container-registry/docs/migrate-external-containers#copy), that
perform a similar function but are streamlined for their platform.

## How can I find which images are using the legacy registry, and fix them?

**Option 1**: See the one line kubectl command in our [earlier blog
post](https://kubernetes.io/blog/2023/02/06/k8s-gcr-io-freeze-announcement/#what-s-next):

```
kubectl get pods --all-namespaces -o jsonpath="{.items[*].spec.containers[*].image}" |\
tr -s '[[:space:]]' '\n' |\
sort |\
uniq -c
```

**Option 2**: A `kubectl` [krew](https://krew.sigs.k8s.io/) plugin has been developed called
[`community-images`](https://github.com/kubernetes-sigs/community-images#kubectl-community-images),
that will scan and report any images using the k8s.gcr.io endpoint.

If you have krew installed, you can install it with:

```
kubectl krew install community-images
```

and generate a report with:

```
kubectl community-images
```

For alternate methods of install and example output, check out the repo:
[kubernetes-sigs/community-images](https://github.com/kubernetes-sigs/community-images).

**Option 3**: If you do not have access to a cluster directly, or manage many clusters - the best
way is to run a search over your manifests and charts for _"k8s.gcr.io"_.

**Option 4**: If you wish to prevent k8s.gcr.io based images from running in your cluster, example
policies for [Gatekeeper](https://open-policy-agent.github.io/gatekeeper-library/website/) and
[Kyverno](https://kyverno.io/) are available in the [AWS EKS Best Practices
repository](https://github.com/aws/aws-eks-best-practices/tree/master/policies/k8s-registry-deprecation)
that will block them from being pulled. You can use these third-party policies with any Kubernetes
cluster.

**Option 5**: As a **LAST** possible option, you can use a
[Mutating Admission Webhook](/docs/reference/access-authn-authz/extensible-admission-controllers/#what-are-admission-webhooks)
to change the image address dynamically. This should only be
considered a stopgap till your manifests have been updated. You can
find a (third party) Mutating Webhook and Kyverno policy in
[k8s-gcr-quickfix](https://github.com/abstractinfrastructure/k8s-gcr-quickfix).

## Why did Kubernetes change to a different image registry?

k8s.gcr.io is hosted on a custom [Google Container Registry
(GCR)](https://cloud.google.com/container-registry) domain that was set up solely for the Kubernetes
project. This has worked well since the inception of the project, and we thank Google for providing
these resources, but today, there are other cloud providers and vendors that would like to host
images to provide a better experience for the people on their platforms. In addition to Google’s
[renewed commitment to donate $3
million](https://www.cncf.io/google-cloud-recommits-3m-to-kubernetes/) to support the project's
infrastructure last year, Amazon Web Services announced a matching donation [during their Kubecon NA
2022 keynote in Detroit](https://youtu.be/PPdimejomWo?t=236). This will provide a better experience
for users (closer servers = faster downloads) and will reduce the egress bandwidth and costs from
GCR at the same time.

For more details on this change, check out [registry.k8s.io: faster, cheaper and Generally Available
(GA)](/blog/2022/11/28/registry-k8s-io-faster-cheaper-ga/).

## Why is a redirect being put in place?

The project switched to [registry.k8s.io last year with the 1.25
release](https://kubernetes.io/blog/2022/11/28/registry-k8s-io-faster-cheaper-ga/); however, most of
the image pull traffic is still directed at the old endpoint k8s.gcr.io. This has not been
sustainable for us as a project, as it is not utilizing the resources that have been donated to the
project from other providers, and we are in the danger of running out of funds due to the cost of
serving this traffic.

A redirect will enable the project to take advantage of these new resources, significantly reducing
our egress bandwidth costs. We only expect this change to impact a small subset of users running in
restricted environments or using very old clients that do not respect redirects properly.

## What will happen to k8s.gcr.io?

Separate from the redirect, k8s.gcr.io will be frozen [and will not be updated with new images
after April 3rd, 2023](https://kubernetes.io/blog/2023/02/06/k8s-gcr-io-freeze-announcement/). `k8s.gcr.io`
will not get any new releases, patches, or security updates. It will continue to remain available to
help people migrate, but it **WILL** be phased out entirely in the future.

## I still have questions, where should I go?

For more information on registry.k8s.io and why it was developed, see [registry.k8s.io: faster,
cheaper and Generally Available](/blog/2022/11/28/registry-k8s-io-faster-cheaper-ga/).

If you would like to know more about the image freeze and the last images that will be available
there, see the blog post: [k8s.gcr.io Image Registry Will Be Frozen From the 3rd of April
2023](/blog/2023/02/06/k8s-gcr-io-freeze-announcement/).

Information on the architecture of registry.k8s.io and its [request handling decision
tree](https://github.com/kubernetes/registry.k8s.io/blob/8408d0501a88b3d2531ff54b14eeb0e3c900a4f3/cmd/archeio/docs/request-handling.md)
can be found in the [kubernetes/registry.k8s.io
repo](https://github.com/kubernetes/registry.k8s.io).

If you believe you have encountered a bug with the new registry or the redirect, please open an
issue in the [kubernetes/registry.k8s.io
repo](https://github.com/kubernetes/registry.k8s.io/issues/new/choose). **Please check if there is an issue already
open similar to what you are seeing before you create a new issue**.
