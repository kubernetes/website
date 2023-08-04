---
title: Changing the Kubernetes package repository
min-kubernetes-server-version: 1.24
content_type: task
weight: 120
---

<!-- overview -->

This page explains how to switch from one to another Kubernetes package repository
upon upgrading from one to another Kubernetes minor release. Unlike Google-hosted
repositories, the Kubernetes community-owned package repositories are structured
in a way that there's a dedicated package repository for each Kubernetes minor version.


For more information about the Kubernetes community-owned package repositories,
see the ["pkgs.k8s.io: Introducing Kubernetes community-owned package repositories"](TBD)
blog post.

## {{% heading "prerequisites" %}}

This document assumes that you're already using the Kubernetes community-owned
package repositories. If that's not the case, it's strongly recommend to migrate
from the Google-hosted repository to the Kubernetes package repositories
as described in [the blog post](TBD).

If you're unsure if you're using the Kubernetes package repositories or the
Google-hosted repository, the first step of this document explains how to check
what repository is in use.

<!-- steps -->

## Verifying if the Kubernetes package repositories are used

The purpose of this step is to verify if you're using the Kubernetes package repositories.

{{< tabs name="k8s_install_versions" >}}
{{% tab name="Ubuntu, Debian or HypriotOS" %}}

Print contents of the file that defines the Kubernetes `apt` repository:

```shell
cat /etc/apt/sources.list.d/kubernetes.list
```

If you see the URL similar to:

```
deb https://pkgs.k8s.io/core:/stable:/v{{< skew currentVersionAddMinor -1 "." >}}/deb/ /
```

**You're using the Kubernetes package repositories and this guide applies to you.**
Otherwise, it's strongly recommend to migrate to the Kubernetes package repositories
as described in [the blog post](TBD).

{{% /tab %}}
{{% tab name="CentOS, RHEL or Fedora" %}}

Print contents of the file that defines the Kubernetes `yum` repository:

```shell
cat /etc/yum.repos.d/kubernetes.repo
```

If you see `baseurl` similar to the `baseurl` in the output below:

```
[kubernetes]
name=Kubernetes
baseurl=https://pkgs.k8s.io/core:/stable:/v{{< skew currentVersionAddMinor -1 "." >}}/rpm/
enabled=1
gpgcheck=1
gpgkey=https://pkgs.k8s.io/core:/stable:/v{{< skew currentVersionAddMinor -1 "." >}}/rpm/repodata/repomd.xml.key
exclude=kubelet kubeadm kubectl
```

**You're using the Kubernetes package repositories and this guide applies to you.**
Otherwise, it's strongly recommend to migrate to the Kubernetes package repositories
as described in [the blog post](TBD).

{{% /tab %}}
{{< /tabs >}}

{{< note >}}
The URL used for the Kubernetes package repositories is not limited to `pkgs.k8s.io`,
it can also be one of:

- `pkgs.k8s.io`
- `pkgs.kubernetes.io`
- `packages.kubernetes.io`
- `packages.kubernetes.io`
{{</ note >}}

## Switching to another Kubernetes package repository

This step should be done upon upgrading from one to another Kubernetes minor
release in order to get access to packages for the desired Kubernetes minor
version.

{{< tabs name="k8s_install_versions" >}}
{{% tab name="Ubuntu, Debian or HypriotOS" %}}

1. Open the file that defines the Kubernetes `apt` repository using a text editor of your choice:

```shell
nano /etc/apt/sources.list.d/kubernetes.list
```

You should see a single line with the URL that contains your current Kubernetes
minor version. For example, if you're using v{{< skew currentVersionAddMinor -1 "." >}},
you should see this:

```
deb https://pkgs.k8s.io/core:/stable:/v{{< skew currentVersionAddMinor -1 "." >}}/deb/ /
```

2. Change the version in the URL to **the next available minor release**, for example:

```
deb https://pkgs.k8s.io/core:/stable:/{{< param "version" >}}/deb/ /
```

3. Save the file and exit your text editor. Proceed with following the relevant upgrade guidelines.

{{% /tab %}}
{{% tab name="CentOS, RHEL or Fedora" %}}

1. Open the file that defines the Kubernetes `yum` repository using a text editor of your choice:

```shell
nano /etc/yum.repos.d/kubernetes.repo
```

You should see a file with two URLs that contain your current Kubernetes
minor version. For example, if you're using v{{< skew currentVersionAddMinor -1 "." >}},
you should see this:

```
[kubernetes]
name=Kubernetes
baseurl=https://pkgs.k8s.io/core:/stable:/v{{< skew currentVersionAddMinor -1 "." >}}/rpm/
enabled=1
gpgcheck=1
gpgkey=https://pkgs.k8s.io/core:/stable:/v{{< skew currentVersionAddMinor -1 "." >}}/rpm/repodata/repomd.xml.key
exclude=kubelet kubeadm kubectl cri-tools kubernetes-cni
```

2. Change the version in these URLs to **the next available minor release**, for example:

```
[kubernetes]
name=Kubernetes
baseurl=https://pkgs.k8s.io/core:/stable:/v{{< param "version" >}}/rpm/
enabled=1
gpgcheck=1
gpgkey=https://pkgs.k8s.io/core:/stable:/v{{< param "version" >}}/rpm/repodata/repomd.xml.key
exclude=kubelet kubeadm kubectl cri-tools kubernetes-cni
```

3. Save the file and exit your text editor. Proceed with following the relevant upgrade guidelines.

{{% /tab %}}
{{< /tabs >}}

## {{% heading "whatsnext" %}}

* See how to [Upgrade Linux nodes](/docs/tasks/administer-cluster/kubeadm/upgrading-linux-nodes/).
* See how to [Upgrade Windows nodes](/docs/tasks/administer-cluster/kubeadm/upgrading-windows-nodes/).
