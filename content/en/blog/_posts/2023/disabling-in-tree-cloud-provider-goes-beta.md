---
layout: blog
title: "Kubernetes 1.29: Cloud Provider Integrations Are Now Separate Components"
date: 2023-12-14T09:30:00-08:00
slug: cloud-provider-integration-changes
author: >
  Michael McCune (Red Hat),
  Andrew Sy Kim (Google)
---

For Kubernetes v1.29, you need to use additional components to integrate your
Kubernetes cluster with a cloud infrastructure provider. By default, Kubernetes
v1.29 components **abort** if you try to specify integration with any cloud provider using
one of the legacy compiled-in cloud provider integrations. If you want to use a legacy
integration, you have to opt back in - and a future release will remove even that option.

In 2018, the [Kubernetes community agreed to form the Cloud Provider Special
Interest Group (SIG)][oldblog], with a mission to externalize all cloud provider
integrations and remove all the existing in-tree cloud provider integrations.
In January 2019, the Kubernetes community approved the initial draft of
[KEP-2395: Removing In-Tree Cloud Provider Code][kep2395]. This KEP defines a
process by which we can remove cloud provider specific code from the core
Kubernetes source tree. From the KEP:

> Motiviation [sic] behind this effort is to allow cloud providers to develop and
> make releases independent from the core Kubernetes release cycle. The
> de-coupling of cloud provider code allows for separation of concern between
> "Kubernetes core" and the cloud providers within the ecosystem. In addition,
> this ensures all cloud providers in the ecosystem are integrating with
> Kubernetes in a consistent and extendable way.

After many years of development and collaboration across many contributors,
the default behavior for legacy cloud provider integrations is changing.
This means that users will need to confirm their Kubernetes configurations,
and in some cases run external cloud controller managers. These changes are
taking effect in Kubernetes version 1.29; read on to learn if you are affected
and what changes you will need to make.

These updated default settings affect a large proportion of Kubernetes users,
and **will require changes** for users who were previously using the in-tree
provider integrations. The legacy integrations offered compatibility with
Azure, AWS, GCE, OpenStack, and vSphere; however for AWS and OpenStack the
compiled-in integrations were removed in Kubernetes versions 1.27 and 1.26,
respectively.

## What has changed?

At the most basic level, two [feature gates][fg] are changing their default
value from false to true. Those feature gates, `DisableCloudProviders` and
`DisableKubeletCloudCredentialProviders`, control the way that the
[kube-apiserver][kapi], [kube-controller-manager][kcm], and [kubelet][kubelet]
invoke the cloud provider related code that is included in those components.
When these feature gates are true (the default), the only recognized value for
the `--cloud-provider` command line argument is `external`.

Let's see what the [official Kubernetes documentation][fg] says about these
feature gates:

> `DisableCloudProviders`: Disables any functionality in `kube-apiserver`,
> `kube-controller-manager` and `kubelet` related to the `--cloud-provider`
> component flag.

> `DisableKubeletCloudCredentialProviders`: Disable the in-tree functionality
> in kubelet to authenticate to a cloud provider container registry for image
> pull credentials.

The next stage beyond beta will be full removal; for that release onwards, you
won't be able to override those feature gates back to false.

## What do you need to do?

If you are upgrading from Kubernetes 1.28+ and are not on Azure, GCE, or
vSphere then there are no changes you will need to make. If
you **are** on Azure, GCE, or vSphere, or you are upgrading from a version
older than 1.28, then read on.

Historically, Kubernetes has included code for a set of cloud providers that
included AWS, Azure, GCE, OpenStack, and vSphere. Since the inception of
[KEP-2395][kep2395] the community has been moving towards removal of that
cloud provider code. The OpenStack provider code was removed in version 1.26,
and the AWS provider code was removed in version 1.27. This means that users
who are upgrading from one of the affected cloud providers and versions will
need to modify their deployments.

### Upgrading on Azure, GCE, or vSphere

There are two options for upgrading in this configuration: migrate to external
cloud controller managers, or continue using the in-tree provider code.
Although migrating to external cloud controller managers is recommended,
there are scenarios where continuing with the current behavior is desired.
Please choose the best option for your needs.

#### Migrate to external cloud controller managers

Migrating to use external cloud controller managers is the recommended upgrade
path, when possible in your situation. To do this you will need to
enable the `--cloud-provider=external` command line flag for the
`kube-apiserver`, `kube-controller-manager`, and `kubelet` components. In
addition you will need to deploy a cloud controller manager for your provider.

Installing and running cloud controller managers is a larger topic than this
post can address; if you would like more information on this process please
read the documentation for [Cloud Controller Manager Administration][ccmadmin]
and [Migrate Replicated Control Plane To Use Cloud Controller Manager][ccmha].
See [below](#cloud-provider-integrations) for links to specific cloud provider
implementations.

#### Continue using in-tree provider code

If you wish to continue using Kubernetes with the in-tree cloud provider code,
you will need to modify the command line parameters for `kube-apiserver`,
`kube-controller-manager`, and `kubelet` to disable the feature gates for
`DisableCloudProviders` and `DisableKubeletCloudCredentialProviders`. To do
this, add the following command line flag to the arguments for the previously
listed commands:

```
--feature-gates=DisableCloudProviders=false,DisableKubeletCloudCredentialProviders=false
```

_Please note that if you have other feature gate modifications on the command
line, they will need to include these 2 feature gates._

**Note**: These feature gates will be locked to `true` in an upcoming
release. Setting these feature gates to `false` should be used as a last
resort. It is highly recommended to migrate to an external cloud controller
manager as the in-tree providers are planned for removal as early as Kubernetes
version 1.31.

### Upgrading on other providers

For providers other than Azure, GCE, or vSphere, good news, the external cloud
controller manager should already be in use. You can confirm this by inspecting
the `--cloud-provider` flag for the kubelets in your cluster, they will have
the value `external` if using external providers. The code for AWS and OpenStack
providers was removed from Kubernetes before version 1.27 was released.
Other providers beyond the AWS, Azure, GCE, OpenStack, and vSphere were never
included in Kubernetes and as such they began their life as external cloud
controller managers.

### Upgrading from older Kubernetes versions

If you are upgrading from a Kubernetes release older than 1.26, and you are on
AWS, Azure, GCE, OpenStack, or vSphere then you will need to enable the
`--cloud-provider=external` flag, and follow the advice for installing and
running a cloud controller manager for your provider.

Please read the documentation for
[Cloud Controller Manager Administration][ccmadmin] and
[Migrate Replicated Control Plane To Use Cloud Controller Manager][ccmha]. See
below for links to specific cloud provider implementations.

## Where to find a cloud controller manager?

At its core, this announcement is about the cloud provider integrations that
were previously included in Kubernetes. As these components move out of the
core Kubernetes code and into their own repositories, it is important to note
a few things:

First, SIG Cloud Provider offers a reference framework for developers who
wish to create cloud controller managers for any provider. See the
[cloud-provider repository][cloud-provider] for more information about how
these controllers work and how to get started creating your own.

Second, there are many cloud controller managers available for Kubernetes.
This post is addressing the provider integrations that have been historically
included with Kubernetes but are now in the process of being removed. If you
need a cloud controller manager for your provider and do not see it listed here,
please reach out to the cloud provider you are integrating with or the
[Kubernetes SIG Cloud Provider community][sig] for help and advice. It is
worth noting that while most cloud controller managers are open source today,
this may not always be the case. Users should always contact their cloud
provider to learn if there are preferred solutions to utilize on their
infrastructure.

### Cloud provider integrations provided by the Kubernetes project {#cloud-provider-integrations}

* AWS - https://github.com/kubernetes/cloud-provider-aws
* Azure - https://github.com/kubernetes-sigs/cloud-provider-azure
* GCE - https://github.com/kubernetes/cloud-provider-gcp
* OpenStack - https://github.com/kubernetes/cloud-provider-openstack
* vSphere - https://github.com/kubernetes/cloud-provider-vsphere

If you are looking for an automated approach to installing cloud controller
managers in your clusters, the [kOps][kops] project provides a convenient
solution for managing production-ready clusters.

## Want to learn more?

Cloud providers and cloud controller managers serve a core function in
Kubernetes. Cloud providers are often the substrate upon which Kubernetes is
operated, and the cloud controller managers supply the essential lifeline
between Kubernetes clusters and their physical infrastructure.

This post covers one aspect of how the Kubernetes community interacts with
the world of cloud infrastructure providers. If you are curious about this
topic and want to learn more, the Cloud Provider Special Interest Group (SIG)
is the place to go. SIG Cloud Provider hosts bi-weekly meetings to discuss all
manner of topics related to cloud providers and cloud controller managers in
Kubernetes.

### SIG Cloud Provider

* Regular SIG Meeting: [Wednesdays at 9:00 PT (Pacific Time)](https://zoom.us/j/508079177?pwd=ZmEvMksxdTFTc0N1eXFLRm91QUlyUT09) (biweekly). [Convert to your timezone](http://www.thetimezoneconverter.com/?t=9:00&tz=PT%20%28Pacific%20Time%29).
* [Kubernetes slack][kslack] channel `#sig-cloud-provider`
* [SIG Community page][sig]

[kep2395]: https://github.com/kubernetes/enhancements/tree/master/keps/sig-cloud-provider/2395-removing-in-tree-cloud-providers
[fg]: https://kubernetes.io/docs/reference/command-line-tools-reference/feature-gates/
[kubelet]: https://kubernetes.io/docs/reference/command-line-tools-reference/kubelet/
[kcm]: https://kubernetes.io/docs/reference/command-line-tools-reference/kube-controller-manager/
[kapi]: https://kubernetes.io/docs/reference/command-line-tools-reference/kube-apiserver/
[ccmadmin]: https://kubernetes.io/docs/tasks/administer-cluster/running-cloud-controller/
[ccmha]: https://kubernetes.io/docs/tasks/administer-cluster/controller-manager-leader-migration/
[kslack]: https://kubernetes.slack.com
[sig]: https://github.com/kubernetes/community/tree/master/sig-cloud-provider
[cloud-provider]: https://github.com/kubernetes/cloud-provider
[oldblog]: https://kubernetes.io/blog/2019/04/17/the-future-of-cloud-providers-in-kubernetes/
[kops]: https://github.com/kubernetes/kops
