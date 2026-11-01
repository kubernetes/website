---
layout: blog
title: "CRI-O is moving towards pkgs.k8s.io"
date: 2023-10-10
slug: cri-o-community-package-infrastructure
author: >
  Sascha Grunert
---

The Kubernetes community [recently announced](/blog/2023/08/31/legacy-package-repository-deprecation/)
that their legacy package repositories are frozen, and now they moved to
[introduced community-owned package repositories](/blog/2023/08/15/pkgs-k8s-io-introduction) powered by the
[OpenBuildService (OBS)](https://build.opensuse.org/project/subprojects/isv:kubernetes).
CRI-O has a long history of utilizing
[OBS for their package builds](https://github.com/cri-o/cri-o/blob/e292f17/install.md#install-packaged-versions-of-cri-o),
but all of the packaging efforts have been done manually so far.

The CRI-O community absolutely loves Kubernetes, which means that they're
delighted to announce that:

**All future CRI-O packages will be shipped as part of the officially supported
Kubernetes infrastructure hosted on pkgs.k8s.io!**

There will be a deprecation phase for the existing packages, which is currently
being [discussed in the CRI-O community](https://github.com/cri-o/cri-o/discussions/7315).
The new infrastructure will only support releases of CRI-O `>= v1.28.2` as well as
release branches newer than `release-1.28`.

## How to use the new packages

In the same way as the Kubernetes community, CRI-O provides `deb` and `rpm`
packages as part of a dedicated subproject in OBS, called
[`isv:kubernetes:addons:cri-o`](https://build.opensuse.org/project/show/isv:kubernetes:addons:cri-o).
This project acts as an umbrella and provides `stable` (for CRI-O tags) as well as
`prerelease` (for CRI-O `release-1.y` and `main` branches) package builds.

**Stable Releases:**

- [`isv:kubernetes:addons:cri-o:stable`](https://build.opensuse.org/project/show/isv:kubernetes:addons:cri-o:stable): Stable Packages
  - [`isv:kubernetes:addons:cri-o:stable:v1.29`](https://build.opensuse.org/project/show/isv:kubernetes:addons:cri-o:stable:v1.29): `v1.29.z` tags
  - [`isv:kubernetes:addons:cri-o:stable:v1.28`](https://build.opensuse.org/project/show/isv:kubernetes:addons:cri-o:stable:v1.28): `v1.28.z` tags

**Prereleases:**

- [`isv:kubernetes:addons:cri-o:prerelease`](https://build.opensuse.org/project/show/isv:kubernetes:addons:cri-o:prerelease): Prerelease Packages
  - [`isv:kubernetes:addons:cri-o:prerelease:main`](https://build.opensuse.org/project/show/isv:kubernetes:addons:cri-o:prerelease:main): [`main`](https://github.com/cri-o/cri-o/commits/main) branch
  - [`isv:kubernetes:addons:cri-o:prerelease:v1.29`](https://build.opensuse.org/project/show/isv:kubernetes:addons:cri-o:prerelease:v1.29): [`release-1.29`](https://github.com/cri-o/cri-o/commits/release-1.29) branch
  - [`isv:kubernetes:addons:cri-o:prerelease:v1.28`](https://build.opensuse.org/project/show/isv:kubernetes:addons:cri-o:prerelease:v1.28): [`release-1.28`](https://github.com/cri-o/cri-o/commits/release-1.28) branch

There are no stable releases available in the v1.29 repository yet, because
v1.29.0 will be released in December. The CRI-O community will also **not**
support release branches older than `release-1.28`, because there have been CI
requirements merged into `main` which could be only backported to `release-1.28`
with appropriate efforts.

For example, If an end-user would like to install the latest available version
of the CRI-O `main` branch, then they can add the repository in the same way as
they do for Kubernetes.

### `rpm` Based Distributions

For `rpm` based distributions, you can run the following commands as a `root` user
to install CRI-O together with Kubernetes:

#### Add the Kubernetes repo

```bash
cat <<EOF | tee /etc/yum.repos.d/kubernetes.repo
[kubernetes]
name=Kubernetes
baseurl=https://pkgs.k8s.io/core:/stable:/v1.28/rpm/
enabled=1
gpgcheck=1
gpgkey=https://pkgs.k8s.io/core:/stable:/v1.28/rpm/repodata/repomd.xml.key
EOF
```

#### Add the CRI-O repo

```bash
cat <<EOF | tee /etc/yum.repos.d/cri-o.repo
[cri-o]
name=CRI-O
baseurl=https://pkgs.k8s.io/addons:/cri-o:/prerelease:/main/rpm/
enabled=1
gpgcheck=1
gpgkey=https://pkgs.k8s.io/addons:/cri-o:/prerelease:/main/rpm/repodata/repomd.xml.key
EOF
```

#### Install official package dependencies

```bash
dnf install -y \
    conntrack \
    container-selinux \
    ebtables \
    ethtool \
    iptables \
    socat
```

#### Install the packages from the added repos

```bash
dnf install -y --repo cri-o --repo kubernetes \
    cri-o \
    kubeadm \
    kubectl \
    kubelet
```

### `deb` Based Distributions

For `deb` based distributions, you can run the following commands as a `root`
user:

#### Install dependencies for adding the repositories

```bash
apt-get update
apt-get install -y software-properties-common curl
```

#### Add the Kubernetes repository

```bash
curl -fsSL https://pkgs.k8s.io/core:/stable:/v1.28/deb/Release.key |
    gpg --dearmor -o /etc/apt/keyrings/kubernetes-apt-keyring.gpg
echo "deb [signed-by=/etc/apt/keyrings/kubernetes-apt-keyring.gpg] https://pkgs.k8s.io/core:/stable:/v1.28/deb/ /" |
    tee /etc/apt/sources.list.d/kubernetes.list
```

#### Add the CRI-O repository

```bash
curl -fsSL https://pkgs.k8s.io/addons:/cri-o:/prerelease:/main/deb/Release.key |
    gpg --dearmor -o /etc/apt/keyrings/cri-o-apt-keyring.gpg
echo "deb [signed-by=/etc/apt/keyrings/cri-o-apt-keyring.gpg] https://pkgs.k8s.io/addons:/cri-o:/prerelease:/main/deb/ /" |
    tee /etc/apt/sources.list.d/cri-o.list
```

#### Install the packages

```bash
apt-get update
apt-get install -y cri-o kubelet kubeadm kubectl
```

#### Start CRI-O

```bash
systemctl start crio.service
```

The Project's `prerelease:/main` prefix at the CRI-O's package path, can be replaced with
`stable:/v1.28`, `stable:/v1.29`, `prerelease:/v1.28` or `prerelease:/v1.29`
if another stream package is used.

Bootstrapping [a cluster using `kubeadm`](/docs/setup/production-environment/tools/kubeadm/install-kubeadm/)
can be done by running `kubeadm init` command, which automatically detects that
CRI-O is running in the background. There are also `Vagrantfile` examples
available for [Fedora 38](https://github.com/cri-o/packaging/blob/91df5f7/test/rpm/Vagrantfile)
as well as [Ubuntu 22.04](https://github.com/cri-o/packaging/blob/91df5f7/test/deb/Vagrantfile)
for testing the packages together with `kubeadm`.

## How it works under the hood

Everything related to these packages lives in the new
[CRI-O packaging repository](https://github.com/cri-o/packaging).
It contains a [daily reconciliation](https://github.com/cri-o/packaging/blob/91df5f7/.github/workflows/schedule.yml)
GitHub action workflow, for all supported release branches as well as tags of
CRI-O. A [test pipeline](https://github.com/cri-o/packaging/actions/workflows/obs.yml)
in the OBS workflow ensures that the packages can be correctly installed and
used before being published. All of the staging and publishing of the
packages is done with the help of the [Kubernetes Release Toolbox (krel)](https://github.com/kubernetes/release/blob/1f85912/docs/krel/README.md),
which is also used for the official Kubernetes `deb` and `rpm` packages.

The package build inputs will undergo daily reconciliation and will be supplied by
CRI-O's static binary bundles.
These bundles are built and signed for each commit in the CRI-O CI,
and contain everything CRI-O requires to run on a certain architecture.
The static builds are reproducible, powered by [nixpkgs](https://github.com/NixOS/nixpkgs)
and available only for `x86_64`, `aarch64` and `ppc64le` architecture.

The CRI-O maintainers will be happy to listen to any feedback or suggestions on the new
packaging efforts! Thank you for reading this blog post, feel free to reach out
to the maintainers via the Kubernetes [Slack channel #crio](https://kubernetes.slack.com/messages/CAZH62UR1)
or create an issue in the [packaging repository](https://github.com/cri-o/packaging/issues).
