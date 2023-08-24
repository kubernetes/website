---
title: Changing The Kubernetes Package Repository
content_type: task
weight: 120
---

<!-- overview -->

This page explains how to switch from one Kubernetes package repository to another
when upgrading Kubernetes minor releases. Unlike deprecated Google-hosted
repositories, the Kubernetes package repositories are structured in a way that
there's a dedicated package repository for each Kubernetes minor version.

## {{% heading "prerequisites" %}}

This document assumes that you're already using the Kubernetes community-owned
package repositories. If that's not the case, it's strongly recommend to migrate
to the Kubernetes package repositories.

### Verifying if the Kubernetes package repositories are used

If you're unsure if you're using the Kubernetes package repositories or the
Google-hosted repository, take the following steps to verify:

{{< tabs name="k8s_install_versions" >}}
{{% tab name="Ubuntu, Debian or HypriotOS" %}}

Print the contents of the file that defines the Kubernetes `apt` repository:

```shell
# On your system, this configuration file could have a different name
pager /etc/apt/sources.list.d/kubernetes.list
```

If you see a line similar to:

```
deb [signed-by=/etc/apt/keyrings/kubernetes-apt-keyring.gpg] https://pkgs.k8s.io/core:/stable:/v{{< skew currentVersionAddMinor -1 "." >}}/deb/ /
```

**You're using the Kubernetes package repositories and this guide applies to you.**
Otherwise, it's strongly recommend to migrate to the Kubernetes package repositories.

{{% /tab %}}
{{% tab name="CentOS, RHEL or Fedora" %}}

Print the contents of the file that defines the Kubernetes `yum` repository:

```shell
# On your system, this configuration file could have a different name
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
Otherwise, it's strongly recommend to migrate to the Kubernetes package repositories.

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

<!-- steps -->

## Switching to another Kubernetes package repository

This step should be done upon upgrading from one to another Kubernetes minor
release in order to get access to the packages of the desired Kubernetes minor
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
deb [signed-by=/etc/apt/keyrings/kubernetes-apt-keyring.gpg] https://pkgs.k8s.io/core:/stable:/v{{< skew currentVersionAddMinor -1 "." >}}/deb/ /
```

2. Change the version in the URL to **the next available minor release**, for example:

```
deb [signed-by=/etc/apt/keyrings/kubernetes-apt-keyring.gpg] https://pkgs.k8s.io/core:/stable:/{{< param "version" >}}/deb/ /
```

3. Save the file and exit your text editor. Continue following the relevant upgrade instructions.

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

3. Save the file and exit your text editor. Continue following the relevant upgrade instructions.

{{% /tab %}}
{{< /tabs >}}

## {{% heading "whatsnext" %}}

* See how to [Upgrade Linux nodes](/docs/tasks/administer-cluster/kubeadm/upgrading-linux-nodes/).
* See how to [Upgrade Windows nodes](/docs/tasks/administer-cluster/kubeadm/upgrading-windows-nodes/).
