---
title: Install Minikube
content_template: templates/task
weight: 20
card:
  name: tasks
  weight: 10
---

{{% capture overview %}}

This page shows you how to install [Minikube](/docs/tutorials/hello-minikube), a tool that runs a single-node Kubernetes cluster in a virtual machine on your personal computer.

{{% /capture %}}

{{% capture prerequisites %}}

{{< tabs name="minikube_before_you_begin" >}}
{{% tab name="Linux" %}}
To check if virtualization is supported on Linux, run the following command and verify that the output is non-empty:
```
grep -E --color 'vmx|svm' /proc/cpuinfo
```
{{% /tab %}}

{{% tab name="macOS" %}}
To check if virtualization is supported on macOS, run the following command on your terminal.
```
sysctl -a | grep -E --color 'machdep.cpu.features|VMX'
```
If you see `VMX` in the output (should be colored), the VT-x feature is enabled in your machine.
{{% /tab %}}

{{% tab name="Windows" %}}
To check if virtualization is supported on Windows 8 and above, run the following command on your Windows terminal or command prompt.
```
systeminfo
```
If you see the following output, virtualization is supported on Windows.
```
Hyper-V Requirements:     VM Monitor Mode Extensions: Yes
                          Virtualization Enabled In Firmware: Yes
                          Second Level Address Translation: Yes
                          Data Execution Prevention Available: Yes
```

If you see the following output, your system already has a Hypervisor installed and you can skip the next step.
```
Hyper-V Requirements:     A hypervisor has been detected. Features required for Hyper-V will not be displayed.
```


{{% /tab %}}
{{< /tabs >}}

{{% /capture %}}

{{% capture steps %}}

# Installing minikube

{{< tabs name="tab_with_md" >}}
{{% tab name="Linux" %}}

### Install kubectl

Make sure you have kubectl installed. You can install kubectl according to the instructions in [Install and Set Up kubectl](/docs/tasks/tools/install-kubectl/#install-kubectl-on-linux).

### Install a Hypervisor

If you do not already have a hypervisor installed, install one of these now:

• [KVM](https://www.linux-kvm.org/), which also uses QEMU

• [VirtualBox](https://www.virtualbox.org/wiki/Downloads)

Minikube also supports a `--driver=none` option that runs the Kubernetes components on the host and not in a VM.
Using this driver requires [Docker](https://www.docker.com/products/docker-desktop) and a Linux environment but not a hypervisor.

If you're using the `none` driver in Debian or a derivative, use the `.deb` packages for
Docker rather than the snap package, which does not work with Minikube.
You can download `.deb` packages from [Docker](https://www.docker.com/products/docker-desktop).

{{< caution >}}
The `none` VM driver can result in security and data loss issues.
Before using `--driver=none`, consult [this documentation](https://minikube.sigs.k8s.io/docs/reference/drivers/none/) for more information.
{{< /caution >}}

Minikube also supports a `vm-driver=podman` similar to the Docker driver. Podman run as superuser privilege (root user) is the best way to ensure that your containers have full access to any feature available on your system.

{{< caution >}}
The `podman` driver requires running the containers as root because regular user accounts don’t have full access to all operating system features that their containers might need to run.
{{< /caution >}}

### Install Minikube using a package

There are *experimental* packages for Minikube available; you can find Linux (AMD64) packages
from Minikube's [releases](https://github.com/kubernetes/minikube/releases) page on GitHub.

Use your Linux's distribution's package tool to install a suitable package.

### Install Minikube via direct download

If you're not installing via a package, you can download a stand-alone
binary and use that.

```shell
curl -Lo minikube https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64 \
  && chmod +x minikube
```

Here's an easy way to add the Minikube executable to your path:

```shell
sudo mkdir -p /usr/local/bin/
sudo install minikube /usr/local/bin/
```

### Install Minikube using Homebrew

As yet another alternative, you can install Minikube using Linux [Homebrew](https://docs.brew.sh/Homebrew-on-Linux):

```shell
brew install minikube
```

{{% /tab %}}
{{% tab name="macOS" %}}
### Install kubectl

Make sure you have kubectl installed. You can install kubectl according to the instructions in [Install and Set Up kubectl](/docs/tasks/tools/install-kubectl/#install-kubectl-on-macos).

### Install a Hypervisor

If you do not already have a hypervisor installed, install one of these now:

• [HyperKit](https://github.com/moby/hyperkit)

• [VirtualBox](https://www.virtualbox.org/wiki/Downloads)

• [VMware Fusion](https://www.vmware.com/products/fusion)

### Install Minikube
The easiest way to install Minikube on macOS is using [Homebrew](https://brew.sh):

```shell
brew install minikube
```

You can also install it on macOS by downloading a stand-alone binary:

```shell
curl -Lo minikube https://storage.googleapis.com/minikube/releases/latest/minikube-darwin-amd64 \
  && chmod +x minikube
```

Here's an easy way to add the Minikube executable to your path:

```shell
sudo mv minikube /usr/local/bin
```

{{% /tab %}}
{{% tab name="Windows" %}}
### Install kubectl

Make sure you have kubectl installed. You can install kubectl according to the instructions in [Install and Set Up kubectl](/docs/tasks/tools/install-kubectl/#install-kubectl-on-windows).

### Install a Hypervisor

If you do not already have a hypervisor installed, install one of these now:

• [Hyper-V](https://msdn.microsoft.com/en-us/virtualization/hyperv_on_windows/quick_start/walkthrough_install)

• [VirtualBox](https://www.virtualbox.org/wiki/Downloads)

{{< note >}}
Hyper-V can run on three versions of Windows 10: Windows 10 Enterprise, Windows 10 Professional, and Windows 10 Education.
{{< /note >}}

### Install Minikube using Chocolatey

The easiest way to install Minikube on Windows is using [Chocolatey](https://chocolatey.org/) (run as an administrator):

```shell
choco install minikube
```

After Minikube has finished installing, close the current CLI session and restart. Minikube should have been added to your path automatically.

### Install Minikube using an installer executable

To install Minikube manually on Windows using [Windows Installer](https://docs.microsoft.com/en-us/windows/desktop/msi/windows-installer-portal), download [`minikube-installer.exe`](https://github.com/kubernetes/minikube/releases/latest/download/minikube-installer.exe) and execute the installer.

### Install Minikube via direct download

To install Minikube manually on Windows, download [`minikube-windows-amd64`](https://github.com/kubernetes/minikube/releases/latest), rename it to `minikube.exe`, and add it to your path.

{{% /tab %}}
{{< /tabs >}}


{{% /capture %}}

{{% capture whatsnext %}}

* [Running Kubernetes Locally via Minikube](/docs/setup/learning-environment/minikube/)

{{% /capture %}}

## Confirm Installation

To confirm successful installation of both a hypervisor and Minikube, you can run the following command to start up a local Kubernetes cluster:

{{< note >}}

For setting the `--driver` with `minikube start`, enter the name of the hypervisor you installed in lowercase letters where `<driver_name>` is mentioned below. A full list of `--driver` values is available in [specifying the VM driver documentation](https://kubernetes.io/docs/setup/learning-environment/minikube/#specifying-the-vm-driver).

{{< /note >}}

```shell
minikube start --driver=<driver_name>
```

Once `minikube start` finishes, run the command below to check the status of the cluster:

```shell
minikube status
```

If your cluster is running, the output from `minikube status` should be similar to:

```
host: Running
kubelet: Running
apiserver: Running
kubeconfig: Configured
```

After you have confirmed whether Minikube is working with your chosen hypervisor, you can continue to use Minikube or you can stop your cluster. To stop your cluster, run:

```shell
minikube stop
```

## Clean up local state {#cleanup-local-state}

If you have previously installed Minikube, and run:
```shell
minikube start
```

and `minikube start` returned an error:
```
machine does not exist
```

then you need to clear minikube's local state:
```shell
minikube delete
```
