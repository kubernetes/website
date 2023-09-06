---
layout: blog
title: "pkgs.k8s.io: Introducing Kubernetes Community-Owned Package Repositories"
date: 2023-08-15T20:00:00+0000
slug: pkgs-k8s-io-introduction
---

**Author**: Marko Mudrinić (Kubermatic)

On behalf of Kubernetes SIG Release, I am very excited to introduce the
Kubernetes community-owned software
repositories for Debian and RPM packages: `pkgs.k8s.io`! The new package
repositories are replacement for the Google-hosted package repositories
(`apt.kubernetes.io` and `yum.kubernetes.io`) that we've been using since
Kubernetes v1.5.

This blog post contains information about these new package repositories,
what does it mean to you as an end user, and how to migrate to the new
repositories.

**ℹ️  Update (August 31, 2023):** the _**legacy Google-hosted repositories are deprecated
and will be frozen starting with September 13, 2023.**_
Check out [the deprecation announcement](/blog/2023/08/31/legacy-package-repository-deprecation/)
for more details about this change.

## What you need to know about the new package repositories?

_(updated on August 31, 2023)_

- This is an **opt-in change**; you're required to manually migrate from the
  Google-hosted repository to the Kubernetes community-owned repositories.
  See [how to migrate](#how-to-migrate) later in this announcement for migration information
  and instructions.
- The legacy Google-hosted repositories are **deprecated as of August 31, 2023**,
  and will be **frozen approximately as of September 13, 2023**. The freeze will happen
  immediately following the patch releases that are scheduled for September 2023.
  Freezing the legacy repositories means that we will publish packages for the Kubernetes
  project only to the community-owned repositories as of the September 13, 2023 cut-off point.
  Check out the [deprecation announcement](/blog/2023/08/31/legacy-package-repository-deprecation/)
  for more details about this change.
- The existing packages in the legacy repositories will be available for the foreseeable future.
  However, the Kubernetes project can't provide any guarantees on how long is that going to be.
  The deprecated legacy repositories, and their contents, might be removed at any time in the future
  and without a further notice period.
- Given that no new releases will be published to the legacy repositories after
  the September 13, 2023 cut-off point, you will not be able to upgrade to any patch or minor
  release made from that date onwards if you don't migrate to the new Kubernetes package repositories.
  That said, we recommend migrating to the new Kubernetes package repositories **as soon as possible**.
- The new Kubernetes package repositories contain packages beginning with those
  Kubernetes versions that were still under support when the community took
  over the package builds. This means that anything before v1.24.0 will only be
  available in the Google-hosted repository.
- There's a dedicated package repository for each Kubernetes minor version.
  When upgrading to a different minor release, you must bear in mind that
  the package repository details also change.

## Why are we introducing new package repositories?

As the Kubernetes project is growing, we want to ensure the best possible
experience for the end users. The Google-hosted repository has been serving
us well for many years, but we started facing some problems that require
significant changes to how we publish packages. Another goal that we have is to
use community-owned infrastructure for all critical components and that
includes package repositories.

Publishing packages to the Google-hosted repository is a manual process that
can be done only by a team of Google employees called
[Google Build Admins](/releases/release-managers/#build-admins).
[The Kubernetes Release Managers team](/releases/release-managers/#release-managers)
is a very diverse team especially in terms of timezones that we work in.
Given this constraint, we have to do very careful planning for every release to
ensure that we have both Release Manager and Google Build Admin available to 
carry out the release.

Another problem is that we only have a single package repository. Because of
this, we were not able to publish packages for prerelease versions (alpha,
beta, and rc). This made testing Kubernetes prereleases harder for anyone who
is interested to do so. The feedback that we receive from people testing these
releases is critical to ensure the best quality of releases, so we want to make
testing these releases as easy as possible. On top of that, having only one
repository limited us when it comes to publishing dependencies like `cri-tools`
and `kubernetes-cni`.

Regardless of all these issues, we're very thankful to Google and Google Build
Admins for their involvement, support, and help all these years!

## How the new package repositories work?

The new package repositories are hosted at `pkgs.k8s.io` for both Debian and
RPM packages. At this time, this domain points to a CloudFront CDN backed by S3
bucket that contains repositories and packages. However, we plan on onboarding
additional mirrors in the future, giving possibility for other companies to
help us with serving packages.

Packages are built and published via the [OpenBuildService (OBS) platform](http://openbuildservice.org).
After a long period of evaluating different solutions, we made a decision to
use OpenBuildService as a platform to manage our repositories and packages.
First of all, OpenBuildService is an open source platform used by a large
number of open source projects and companies, like openSUSE, VideoLAN,
Dell, Intel, and more. OpenBuildService has many features making it very
flexible and easy to integrate with our existing release tooling. It also
allows us to build packages in a similar way as for the Google-hosted
repository making the migration process as seamless as possible.

SUSE sponsors the Kubernetes project with access to their reference
OpenBuildService setup ([`build.opensuse.org`](http://build.opensuse.org)) and
with technical support to integrate OBS with our release processes.

We use SUSE's OBS instance for building and publishing packages. Upon building
a new release, our tooling automatically pushes needed artifacts and 
package specifications to `build.opensuse.org`. That will trigger the build
process that's going to build packages for all supported architectures (AMD64,
ARM64, PPC64LE, S390X). At the end, generated packages will be automatically
pushed to our community-owned S3 bucket making them available to all users.

We want to take this opportunity to thank SUSE for allowing us to use
`build.opensuse.org` and their generous support to make this integration
possible!

## What are significant differences between the Google-hosted and Kubernetes package repositories?

There are three significant differences that you should be aware of:

- There's a dedicated package repository for each Kubernetes minor release.
  For example, repository called `core:/stable:/v1.28` only hosts packages for
  stable Kubernetes v1.28 releases. This means you can install v1.28.0 from
  this repository, but you can't install v1.27.0 or any other minor release
  other than v1.28. Upon upgrading to another minor version, you have to add a
  new repository and optionally remove the old one
- There's a difference in what `cri-tools` and `kubernetes-cni` package
  versions are available in each Kubernetes repository
  - These two packages are dependencies for `kubelet` and `kubeadm`
  - Kubernetes repositories for v1.24 to v1.27 have same versions of these
    packages as the Google-hosted repository
  - Kubernetes repositories for v1.28 and onwards are going to have published
    only versions that are used by that Kubernetes minor release
    - Speaking of v1.28, only kubernetes-cni 1.2.0 and cri-tols v1.28 are going
      to be available in the repository for Kubernetes v1.28
    - Similar for v1.29, we only plan on publishing cri-tools v1.29 and
      whatever kubernetes-cni version is going to be used by Kubernetes v1.29
- The revision part of the package version (the `-00` part in `1.28.0-00`) is
  now autogenerated by the OpenBuildService platform and has a different format.
  The revision is now in the format of `-x.y`, e.g. `1.28.0-1.1`

## Does this in any way affect existing Google-hosted repositories?

The Google-hosted repository and all packages published to it will continue
working in the same way as before. There are no changes in how we build and
publish packages to the Google-hosted repository, all newly-introduced changes
are only affecting packages publish to the community-owned repositories.

However, as mentioned at the beginning of this blog post, we plan to stop
publishing packages to the Google-hosted repository in the future.

## How to migrate to the Kubernetes community-owned repositories? {#how-to-migrate}

### Debian, Ubuntu, and operating systems using `apt`/`apt-get` {#how-to-migrate-deb}

1. Replace the `apt` repository definition so that `apt` points to the new
   repository instead of the Google-hosted repository. Make sure to replace the
   Kubernetes minor version in the command below with the minor version
   that you're currently using:

   ```shell
   echo "deb [signed-by=/etc/apt/keyrings/kubernetes-apt-keyring.gpg] https://pkgs.k8s.io/core:/stable:/v1.28/deb/ /" | sudo tee /etc/apt/sources.list.d/kubernetes.list
   ```

2. Download the public signing key for the Kubernetes package repositories.
   The same signing key is used for all repositories, so you can disregard the
   version in the URL:

   ```shell
   curl -fsSL https://pkgs.k8s.io/core:/stable:/v1.28/deb/Release.key | sudo gpg --dearmor -o /etc/apt/keyrings/kubernetes-apt-keyring.gpg
   ```

3. Update the `apt` package index:

   ```shell
   sudo apt-get update
   ```

### CentOS, Fedora, RHEL, and operating systems using `rpm`/`dnf` {#how-to-migrate-rpm}

1. Replace the `yum` repository definition so that `yum` points to the new 
   repository instead of the Google-hosted repository. Make sure to replace the
   Kubernetes minor version in the command below with the minor version
   that you're currently using:

   ```shell
   cat <<EOF | sudo tee /etc/yum.repos.d/kubernetes.repo
   [kubernetes]
   name=Kubernetes
   baseurl=https://pkgs.k8s.io/core:/stable:/v1.28/rpm/
   enabled=1
   gpgcheck=1
   gpgkey=https://pkgs.k8s.io/core:/stable:/v1.28/rpm/repodata/repomd.xml.key
   exclude=kubelet kubeadm kubectl cri-tools kubernetes-cni
   EOF
   ```

## Can I rollback to the Google-hosted repository after migrating to the Kubernetes repositories?

In general, yes. Just do the same steps as when migrating, but use parameters
for the Google-hosted repository. You can find those parameters in a document
like ["Installing kubeadm"](/docs/setup/production-environment/tools/kubeadm/install-kubeadm).

## Why isn’t there a stable list of domains/IPs? Why can’t I restrict package downloads?

Our plan for `pkgs.k8s.io` is to make it work as a redirector to a set of 
backends (package mirrors) based on user's location. The nature of this change
means that a user downloading a package could be redirected to any mirror at
any time. Given the architecture and our plans to onboard additional mirrors in
the near future, we can't provide a list of IP addresses or domains that you 
can add to an allow list.

Restrictive control mechanisms like man-in-the-middle proxies or network
policies that restrict access to a specific list of IPs/domains will break with
this change. For these scenarios, we encourage you to mirror the release
packages to a local package repository that you have strict control over.

## What should I do if I detect some abnormality with the new repositories?

If you encounter any issue with new Kubernetes package repositories, please
file an issue in the
[`kubernetes/release` repository](https://github.com/kubernetes/release/issues/new/choose).
