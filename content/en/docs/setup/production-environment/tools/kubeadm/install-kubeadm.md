---
title: Installing kubeadm
content_type: task
weight: 10
card:
  name: setup
  weight: 40
  title: Install the kubeadm setup tool
---

<!-- overview -->

<img src="/images/kubeadm-stacked-color.png" align="right" width="150px"></img>
This page shows how to install the `kubeadm` toolbox.
For information on how to create a cluster with kubeadm once you have performed this installation process,
see the [Creating a cluster with kubeadm](/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/) page.

{{< doc-versions-list "installation guide" >}}

## {{% heading "prerequisites" %}}

* A compatible Linux host. The Kubernetes project provides generic instructions for Linux distributions
  based on Debian and Red Hat, and those distributions without a package manager.
* 2 GB or more of RAM per machine (any less will leave little room for your apps).
* 2 CPUs or more for control plane machines.
* Full network connectivity between all machines in the cluster (public or private network is fine).
* Unique hostname, MAC address, and product_uuid for every node. See [here](#verify-mac-address) for more details.
* Certain ports are open on your machines. See [here](#check-required-ports) for more details.

{{< note >}}
The `kubeadm` installation is done via binaries that use dynamic linking and assumes that your target system provides `glibc`.
This is a reasonable assumption on many Linux distributions (including Debian, Ubuntu, Fedora, CentOS, etc.)
but it is not always the case with custom and lightweight distributions which don't include `glibc` by default, such as Alpine Linux.
The expectation is that the distribution either includes `glibc` or a [compatibility layer](https://wiki.alpinelinux.org/wiki/Running_glibc_programs)
that provides the expected symbols.
{{< /note >}}

<!-- steps -->

## Verify the MAC address and product_uuid are unique for every node {#verify-mac-address}

* You can get the MAC address of the network interfaces using the command `ip link` or `ifconfig -a`
* The product_uuid can be checked by using the command `sudo cat /sys/class/dmi/id/product_uuid`

It is very likely that hardware devices will have unique addresses, although some virtual machines may have
identical values. Kubernetes uses these values to uniquely identify the nodes in the cluster.
If these values are not unique to each node, the installation process
may [fail](https://github.com/kubernetes/kubeadm/issues/31).

## Check network adapters

If you have more than one network adapter, and your Kubernetes components are not reachable on the default
route, we recommend you add IP route(s) so Kubernetes cluster addresses go via the appropriate adapter.

## Check required ports {#check-required-ports}

These [required ports](/docs/reference/networking/ports-and-protocols/)
need to be open in order for Kubernetes components to communicate with each other.
You can use tools like [netcat](https://netcat.sourceforge.net) to check if a port is open. For example:

```shell
nc 127.0.0.1 6443 -v
```

The pod network plugin you use may also require certain ports to be
open. Since this differs with each pod network plugin, please see the
documentation for the plugins about what port(s) those need.

## Swap configuration {#swap-configuration}

The default behavior of a kubelet is to fail to start if swap memory is detected on a node.
This means that swap should either be disabled or tolerated by kubelet.

* To tolerate swap, add `failSwapOn: false` to kubelet configuration or as a command line argument.
  Note: even if `failSwapOn: false` is provided, workloads wouldn't have swap access by default.
  This can be changed by setting a `swapBehavior`, again in the kubelet configuration file. To use swap,
  set a `swapBehavior` other than the default `NoSwap` setting.
  See [Swap memory management](/docs/concepts/architecture/nodes/#swap-memory) for more details.
* To disable swap, `sudo swapoff -a` can be used to disable swapping temporarily.
  To make this change persistent across reboots, make sure swap is disabled in
  config files like `/etc/fstab`, `systemd.swap`, depending how it was configured on your system.


## Installing a container runtime {#installing-runtime}

To run containers in Pods, Kubernetes uses a
{{< glossary_tooltip term_id="container-runtime" text="container runtime" >}}.

By default, Kubernetes uses the
{{< glossary_tooltip term_id="cri" text="Container Runtime Interface">}} (CRI)
to interface with your chosen container runtime.

If you don't specify a runtime, kubeadm automatically tries to detect an installed
container runtime by scanning through a list of known endpoints.

If multiple or no container runtimes are detected kubeadm will throw an error
and will request that you specify which one you want to use.

See [container runtimes](/docs/setup/production-environment/container-runtimes/)
for more information.

{{< note >}}
Docker Engine does not implement the [CRI](/docs/concepts/architecture/cri/)
which is a requirement for a container runtime to work with Kubernetes.
For that reason, an additional service [cri-dockerd](https://mirantis.github.io/cri-dockerd/)
has to be installed. cri-dockerd is a project based on the legacy built-in
Docker Engine support that was [removed](/dockershim) from the kubelet in version 1.24.
{{< /note >}}

The tables below include the known endpoints for supported operating systems:

{{< tabs name="container_runtime" >}}
{{% tab name="Linux" %}}

{{< table caption="Linux container runtimes" >}}
| Runtime                            | Path to Unix domain socket                   |
|------------------------------------|----------------------------------------------|
| containerd                         | `unix:///var/run/containerd/containerd.sock` |
| CRI-O                              | `unix:///var/run/crio/crio.sock`             |
| Docker Engine (using cri-dockerd)  | `unix:///var/run/cri-dockerd.sock`           |
{{< /table >}}

{{% /tab %}}

{{% tab name="Windows" %}}

{{< table caption="Windows container runtimes" >}}
| Runtime                            | Path to Windows named pipe                   |
|------------------------------------|----------------------------------------------|
| containerd                         | `npipe:////./pipe/containerd-containerd`     |
| Docker Engine (using cri-dockerd)  | `npipe:////./pipe/cri-dockerd`               |
{{< /table >}}

{{% /tab %}}
{{< /tabs >}}

## Installing kubeadm, kubelet and kubectl

You will install these packages on all of your machines:

* `kubeadm`: the command to bootstrap the cluster.

* `kubelet`: the component that runs on all of the machines in your cluster
  and does things like starting pods and containers.

* `kubectl`: the command line util to talk to your cluster.

kubeadm **will not** install or manage `kubelet` or `kubectl` for you, so you will
need to ensure they match the version of the Kubernetes control plane you want
kubeadm to install for you. If you do not, there is a risk of a version skew occurring that
can lead to unexpected, buggy behaviour. However, _one_ minor version skew between the
kubelet and the control plane is supported, but the kubelet version may never exceed the API
server version. For example, the kubelet running 1.7.0 should be fully compatible with a 1.8.0 API server,
but not vice versa.

For information about installing `kubectl`, see [Install and set up kubectl](/docs/tasks/tools/).

{{< warning >}}
These instructions exclude all Kubernetes packages from any system upgrades.
This is because kubeadm and Kubernetes require
[special attention to upgrade](/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade/).
{{</ warning >}}

For more information on version skews, see:

* Kubernetes [version and version-skew policy](/docs/setup/release/version-skew-policy/)
* Kubeadm-specific [version skew policy](/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/#version-skew-policy)

{{% legacy-repos-deprecation %}}

{{< note >}}
There's a dedicated package repository for each Kubernetes minor version. If you want to install
a minor version other than v{{< skew currentVersion >}}, please see the installation guide for
your desired minor version.
{{< /note >}}

{{< tabs name="k8s_install" >}}
{{% tab name="Debian-based distributions" %}}

These instructions are for Kubernetes v{{< skew currentVersion >}}.

1. Update the `apt` package index and install packages needed to use the Kubernetes `apt` repository:

   ```shell
   sudo apt-get update
   # apt-transport-https may be a dummy package; if so, you can skip that package
   sudo apt-get install -y apt-transport-https ca-certificates curl gpg
   ```

2. Download the public signing key for the Kubernetes package repositories.
   The same signing key is used for all repositories so you can disregard the version in the URL:

   ```shell
   # If the directory `/etc/apt/keyrings` does not exist, it should be created before the curl command, read the note below.
   # sudo mkdir -p -m 755 /etc/apt/keyrings
   curl -fsSL https://pkgs.k8s.io/core:/stable:/{{< param "version" >}}/deb/Release.key | sudo gpg --dearmor -o /etc/apt/keyrings/kubernetes-apt-keyring.gpg
   ```

{{< note >}}
In releases older than Debian 12 and Ubuntu 22.04, directory `/etc/apt/keyrings` does not exist by default, and it should be created before the curl command.
{{< /note >}}

3. Add the appropriate Kubernetes `apt` repository. Please note that this repository have packages
   only for Kubernetes {{< skew currentVersion >}}; for other Kubernetes minor versions, you need to
   change the Kubernetes minor version in the URL to match your desired minor version
   (you should also check that you are reading the documentation for the version of Kubernetes
   that you plan to install).

   ```shell
   # This overwrites any existing configuration in /etc/apt/sources.list.d/kubernetes.list
   echo 'deb [signed-by=/etc/apt/keyrings/kubernetes-apt-keyring.gpg] https://pkgs.k8s.io/core:/stable:/{{< param "version" >}}/deb/ /' | sudo tee /etc/apt/sources.list.d/kubernetes.list
   ```

4. Update the `apt` package index, install kubelet, kubeadm and kubectl, and pin their version:

   ```shell
   sudo apt-get update
   sudo apt-get install -y kubelet kubeadm kubectl
   sudo apt-mark hold kubelet kubeadm kubectl
   ```

5. (Optional) Enable the kubelet service before running kubeadm:

   ```shell
   sudo systemctl enable --now kubelet
   ```

{{% /tab %}}
{{% tab name="Red Hat-based distributions" %}}

1. Set SELinux to `permissive` mode:

   These instructions are for Kubernetes {{< skew currentVersion >}}.

   ```shell
   # Set SELinux in permissive mode (effectively disabling it)
   sudo setenforce 0
   sudo sed -i 's/^SELINUX=enforcing$/SELINUX=permissive/' /etc/selinux/config
   ```

{{< caution >}}
- Setting SELinux in permissive mode by running `setenforce 0` and `sed ...`
effectively disables it. This is required to allow containers to access the host
filesystem; for example, some cluster network plugins require that. You have to
do this until SELinux support is improved in the kubelet.
- You can leave SELinux enabled if you know how to configure it but it may require
settings that are not supported by kubeadm.
{{< /caution >}}

2. Add the Kubernetes `yum` repository. The `exclude` parameter in the
   repository definition ensures that the packages related to Kubernetes are
   not upgraded upon running `yum update` as there's a special procedure that
   must be followed for upgrading Kubernetes. Please note that this repository
   have packages only for Kubernetes {{< skew currentVersion >}}; for other
   Kubernetes minor versions, you need to change the Kubernetes minor version
   in the URL to match your desired minor version (you should also check that
   you are reading the documentation for the version of Kubernetes that you
   plan to install).

   ```shell
   # This overwrites any existing configuration in /etc/yum.repos.d/kubernetes.repo
   cat <<EOF | sudo tee /etc/yum.repos.d/kubernetes.repo
   [kubernetes]
   name=Kubernetes
   baseurl=https://pkgs.k8s.io/core:/stable:/{{< param "version" >}}/rpm/
   enabled=1
   gpgcheck=1
   gpgkey=https://pkgs.k8s.io/core:/stable:/{{< param "version" >}}/rpm/repodata/repomd.xml.key
   exclude=kubelet kubeadm kubectl cri-tools kubernetes-cni
   EOF
   ```

3. Install kubelet, kubeadm and kubectl:

   ```shell
   sudo yum install -y kubelet kubeadm kubectl --disableexcludes=kubernetes
   ```

4. (Optional) Enable the kubelet service before running kubeadm:

   ```shell
   sudo systemctl enable --now kubelet
   ```

{{% /tab %}}
{{% tab name="Without a package manager" %}}
Install CNI plugins (required for most pod network):

```bash
CNI_PLUGINS_VERSION="v1.3.0"
ARCH="amd64"
DEST="/opt/cni/bin"
sudo mkdir -p "$DEST"
curl -L "https://github.com/containernetworking/plugins/releases/download/${CNI_PLUGINS_VERSION}/cni-plugins-linux-${ARCH}-${CNI_PLUGINS_VERSION}.tgz" | sudo tar -C "$DEST" -xz
```

Define the directory to download command files:

{{< note >}}
The `DOWNLOAD_DIR` variable must be set to a writable directory.
If you are running Flatcar Container Linux, set `DOWNLOAD_DIR="/opt/bin"`.
{{< /note >}}

```bash
DOWNLOAD_DIR="/usr/local/bin"
sudo mkdir -p "$DOWNLOAD_DIR"
```

Optionally install crictl (required for interaction with the Container Runtime Interface (CRI), optional for kubeadm):

```bash
CRICTL_VERSION="v1.31.0"
ARCH="amd64"
curl -L "https://github.com/kubernetes-sigs/cri-tools/releases/download/${CRICTL_VERSION}/crictl-${CRICTL_VERSION}-linux-${ARCH}.tar.gz" | sudo tar -C $DOWNLOAD_DIR -xz
```

Install `kubeadm`, `kubelet` and add a `kubelet` systemd service:

```bash
RELEASE="$(curl -sSL https://dl.k8s.io/release/stable.txt)"
ARCH="amd64"
cd $DOWNLOAD_DIR
sudo curl -L --remote-name-all https://dl.k8s.io/release/${RELEASE}/bin/linux/${ARCH}/{kubeadm,kubelet}
sudo chmod +x {kubeadm,kubelet}

RELEASE_VERSION="v0.16.2"
curl -sSL "https://raw.githubusercontent.com/kubernetes/release/${RELEASE_VERSION}/cmd/krel/templates/latest/kubelet/kubelet.service" | sed "s:/usr/bin:${DOWNLOAD_DIR}:g" | sudo tee /usr/lib/systemd/system/kubelet.service
sudo mkdir -p /usr/lib/systemd/system/kubelet.service.d
curl -sSL "https://raw.githubusercontent.com/kubernetes/release/${RELEASE_VERSION}/cmd/krel/templates/latest/kubeadm/10-kubeadm.conf" | sed "s:/usr/bin:${DOWNLOAD_DIR}:g" | sudo tee /usr/lib/systemd/system/kubelet.service.d/10-kubeadm.conf
```

{{< note >}}
Please refer to the note in the [Before you begin](#before-you-begin) section for Linux distributions
that do not include `glibc` by default.
{{< /note >}}

Install `kubectl` by following the instructions on [Install Tools page](/docs/tasks/tools/#kubectl).

Optionally, enable the kubelet service before running kubeadm:

```bash
sudo systemctl enable --now kubelet
```

{{< note >}}
The Flatcar Container Linux distribution mounts the `/usr` directory as a read-only filesystem.
Before bootstrapping your cluster, you need to take additional steps to configure a writable directory.
See the [Kubeadm Troubleshooting guide](/docs/setup/production-environment/tools/kubeadm/troubleshooting-kubeadm/#usr-mounted-read-only)
to learn how to set up a writable directory.
{{< /note >}}
{{% /tab %}}
{{< /tabs >}}

The kubelet is now restarting every few seconds, as it waits in a crashloop for
kubeadm to tell it what to do.

## Configuring a cgroup driver

Both the container runtime and the kubelet have a property called
["cgroup driver"](/docs/setup/production-environment/container-runtimes/#cgroup-drivers), which is important
for the management of cgroups on Linux machines.

{{< warning >}}
Matching the container runtime and kubelet cgroup drivers is required or otherwise the kubelet process will fail.

See [Configuring a cgroup driver](/docs/tasks/administer-cluster/kubeadm/configure-cgroup-driver/) for more details.
{{< /warning >}}

## Troubleshooting

If you are running into difficulties with kubeadm, please consult our
[troubleshooting docs](/docs/setup/production-environment/tools/kubeadm/troubleshooting-kubeadm/).

## {{% heading "whatsnext" %}}

* [Using kubeadm to Create a Cluster](/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/)
