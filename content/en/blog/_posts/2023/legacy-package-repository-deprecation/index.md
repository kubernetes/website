---
layout: blog
title: "Kubernetes Legacy Package Repositories Will Be Frozen On September 13, 2023"
date: 2023-08-31T15:30:00-07:00
slug: legacy-package-repository-deprecation
evergreen: true
author: >
  Bob Killen (Google),
  Chris Short (AWS),
  Jeremy Rickard (Microsoft),
  Marko Mudrinić (Kubermatic),
  Tim Bannister (The Scale Factory)
---

On August 15, 2023, the Kubernetes project announced the general availability of
the community-owned package repositories for Debian and RPM packages available
at `pkgs.k8s.io`. The new package repositories are replacement for the legacy
Google-hosted package repositories: `apt.kubernetes.io` and `yum.kubernetes.io`.
The
[announcement blog post for `pkgs.k8s.io`](/blog/2023/08/15/pkgs-k8s-io-introduction/)
highlighted that we will stop publishing packages to the legacy repositories in
the future.

Today, we're formally deprecating the legacy package repositories (`apt.kubernetes.io`
and `yum.kubernetes.io`), and we're announcing our plans to freeze the contents of
the repositories as of **September 13, 2023**.

Please continue reading in order to learn what does this mean for you as an user or
distributor, and what steps you may need to take.

**ℹ️ Update (March 26, 2024): _the legacy Google-hosted repositories went
away on March 4, 2024. It's not possible to install Kubernetes packages from
the legacy Google-hosted package repositories any longer._**

## How does this affect me as a Kubernetes end user?

This change affects users **directly installing upstream versions of Kubernetes**,
either manually by following the official
[installation](/docs/setup/production-environment/tools/kubeadm/install-kubeadm/) and
[upgrade](/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade/) instructions, or
by **using a Kubernetes installer** that's using packages provided by the Kubernetes
project.

**This change also affects you if you run Linux on your own PC and have installed `kubectl` using the legacy package repositories**.
We'll explain later on how to [check](#check-if-affected) if you're affected.

If you use **fully managed** Kubernetes, for example through a service from a cloud
provider, you would only be affected by this change if you also installed `kubectl`
on your Linux PC using packages from the legacy repositories. Cloud providers are
generally using their own Kubernetes distributions and therefore they don't use
packages provided by the Kubernetes project; more importantly, if someone else is
managing Kubernetes for you, then they would usually take responsibility for that check.

If you have a managed [control plane](/docs/concepts/architecture/#control-plane-components)
but you are responsible for **managing the nodes yourself**, and any of those nodes run Linux,
you should [check](#check-if-affected) whether you are affected.

If you're managing your clusters on your own by following the official installation
and upgrade instructions, please follow the instructions in this blog post to migrate
to the (new) community-owned package repositories.


If you're using a Kubernetes installer that's using packages provided by the
Kubernetes project, please check the installer tool's communication channels for
information about what steps you need to take, and eventually if needed, follow up
with maintainers to let them know about this change.

The following diagram shows who's affected by this change in a visual form
(click on diagram for the larger version):

{{< figure src="/blog/2023/08/31/legacy-package-repository-deprecation/flow.svg" alt="Visual explanation of who's affected by the legacy repositories being deprecated and frozen. Textual explanation is available above this diagram." class="diagram-large" link="/blog/2023/08/31/legacy-package-repository-deprecation/flow.svg" >}}

## How does this affect me as a Kubernetes distributor?

If you're using the legacy repositories as part of your project (e.g. a Kubernetes
installer tool), you should migrate to the community-owned repositories as soon as
possible and inform your users about this change and what steps they need to take.

## Timeline of changes

<!-- note to maintainers - the trailing whitespace is significant -->

_(updated on March 26, 2024)_

- **15th August 2023:**  
  Kubernetes announces a new, community-managed source for Linux software packages of Kubernetes components
- **31st August 2023:**  
  _(this announcement)_ Kubernetes formally deprecates the legacy
  package repositories
- **13th September 2023** (approximately):  
  Kubernetes will freeze the legacy package repositories,
  (`apt.kubernetes.io` and `yum.kubernetes.io`).
  The freeze will happen immediately following the patch releases that are scheduled for September, 2023.
- **12th January 2024:**  
  Kubernetes announced intentions to remove the legacy package repositories in January 2024
- **4th March 2024:**  
  The legacy package repositories have been removed. It's not possible to install Kubernetes packages from
  the legacy package repositories any longer

The Kubernetes patch releases scheduled for September 2023 (v1.28.2, v1.27.6,
v1.26.9, v1.25.14) will have packages published **both** to the community-owned and
the legacy repositories.

We'll freeze the legacy repositories after cutting the patch releases for September
which means that we'll completely stop publishing packages to the legacy repositories
at that point.

For the v1.28, v1.27, v1.26, and v1.25 patch releases from October 2023 and onwards,
we'll only publish packages to the new package repositories (`pkgs.k8s.io`).

### What about future minor releases?

Kubernetes 1.29 and onwards will have packages published **only** to the
community-owned repositories (`pkgs.k8s.io`).

### What releases are available in the new community-owned package repositories?

Linux packages for releases starting from Kubernetes v1.24.0 are available in the 
Kubernetes package repositories (`pkgs.k8s.io`). Kubernetes does not have official
Linux packages available for earlier releases of Kubernetes; however, your Linux
distribution may provide its own packages.

## Can I continue to use the legacy package repositories?

_(updated on March 26, 2024)_

**The legacy Google-hosted repositories went away on March 4, 2024. It's not possible
to install Kubernetes packages from the legacy Google-hosted package repositories any
longer.**

~~The existing packages in the legacy repositories will be available for the foreseeable
future. However, the Kubernetes project can't provide _any_ guarantees on how long
is that going to be. The deprecated legacy repositories, and their contents, might
be removed at any time in the future and without a further notice period.~~

~~The Kubernetes project **strongly recommends** migrating to the new community-owned
repositories **as soon as possible**.~~ Migrating to the new package repositories is
required to consume the official Kubernetes packages.

Given that no new releases will be published to the legacy repositories **after the September 13, 2023**
cut-off point, **you will not be able to upgrade to any patch or minor release made from that date onwards.**

Whilst the project makes every effort to release secure software, there may one
day be a high-severity vulnerability in Kubernetes, and consequently an important
release to upgrade to. The advice we're announcing will help you be as prepared for
any future security update, whether trivial or urgent.

## How can I check if I'm using the legacy repositories? {#check-if-affected}

The steps to check if you're using the legacy repositories depend on whether you're
using Debian-based distributions (Debian, Ubuntu, and more) or RPM-based distributions
(CentOS, RHEL, Rocky Linux, and more) in your cluster.

Run these instructions on one of your nodes in the cluster.

### Debian-based Linux distributions

The repository definitions (sources) are located in `/etc/apt/sources.list` and `/etc/apt/sources.list.d/`
on Debian-based distributions. Inspect these two locations and try to locate a
package repository definition that looks like:

```
deb [signed-by=/etc/apt/keyrings/kubernetes-archive-keyring.gpg] https://apt.kubernetes.io/ kubernetes-xenial main
```

**If you find a repository definition that looks like this, you're using the legacy repository and you need to migrate.**

If the repository definition uses `pkgs.k8s.io`, you're already using the
community-hosted repositories and you don't need to take any action.

On most systems, this repository definition should be located in
`/etc/apt/sources.list.d/kubernetes.list` (as recommended by the Kubernetes
documentation), but on some systems it might be in a different location.

If you can't find a repository definition related to Kubernetes, it's likely that you
don't use package managers to install Kubernetes and you don't need to take any action.

### RPM-based Linux distributions

The repository definitions are located in `/etc/yum.repos.d` if you're using the
`yum` package manager, or `/etc/dnf/dnf.conf` and `/etc/dnf/repos.d/` if you're using
`dnf` package manager. Inspect those locations and try to locate a package repository
definition that looks like this:

```
[kubernetes]
name=Kubernetes
baseurl=https://packages.cloud.google.com/yum/repos/kubernetes-el7-\$basearch
enabled=1
gpgcheck=1
gpgkey=https://packages.cloud.google.com/yum/doc/rpm-package-key.gpg
exclude=kubelet kubeadm kubectl
```

**If you find a repository definition that looks like this, you're using the legacy repository and you need to migrate.**

If the repository definition uses `pkgs.k8s.io`, you're already using the
community-hosted repositories and you don't need to take any action.

On most systems, that repository definition should be located in `/etc/yum.repos.d/kubernetes.repo`
(as recommended by the Kubernetes documentation), but on some systems it might be
in a different location.

If you can't find a repository definition related to Kubernetes, it's likely that you
don't use package managers to install Kubernetes and you don't need to take any action.

## How can I migrate to the new community-operated repositories?

For more information on how to migrate to the new community
managed packages, please refer to the
[announcement blog post for `pkgs.k8s.io`](/blog/2023/08/15/pkgs-k8s-io-introduction/).

## Why is the Kubernetes project making this change?

Kubernetes has been publishing packages solely to the Google-hosted repository
since Kubernetes v1.5, or the past **seven** years! Following in the footsteps of
migrating to our community-managed registry, `registry.k8s.io`, we are now migrating the
Kubernetes package repositories to our own community-managed infrastructure. We’re
thankful to Google for their continuous hosting and support all these years, but
this transition marks another big milestone for the project’s goal of migrating
to complete community-owned infrastructure.

## Is there a Kubernetes tool to help me migrate?

We don't have any announcement to make about tooling there. As a Kubernetes user, you
have to manually modify your configuration to use the new repositories. Automating
the migration from the legacy to the community-owned repositories is technically
challenging and we want to avoid any potential risks associated with this.

## Acknowledgments

First of all, we want to acknowledge the contributions from Alphabet. Staff at Google
have provided their time; Google as a business has provided both the infrastructure
to serve packages, and the security context for giving those packages trustworthy
digital signatures.
These have been important to the adoption and growth of Kubernetes.

Releasing software might not be glamorous but it's important. Many people within
the Kubernetes contributor community have contributed to the new way that we, as a
project, have for building and publishing packages.

And finally, we want to once again acknowledge the help from SUSE. OpenBuildService,
from SUSE, is the technology that the powers the new community-managed package repositories.
