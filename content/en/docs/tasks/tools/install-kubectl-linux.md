---
reviewers:
- mikedanese
title: Install and Set Up kubectl on Linux
content_type: task
weight: 10
---

## {{% heading "prerequisites" %}}

You must use a kubectl version that is within one minor version difference of
your cluster. For example, a v{{< skew currentVersion >}} client can communicate
with v{{< skew currentVersionAddMinor -1 >}}, v{{< skew currentVersionAddMinor 0 >}},
and v{{< skew currentVersionAddMinor 1 >}} control planes.
Using the latest compatible version of kubectl helps avoid unforeseen issues.

## Install kubectl on Linux

The following methods exist for installing kubectl on Linux:

- [Install kubectl binary with curl on Linux](#install-kubectl-binary-with-curl-on-linux)
- [Install using native package management](#install-using-native-package-management)
- [Install using other package management](#install-using-other-package-management)

### Install kubectl binary with curl on Linux

1. Download the latest release with the command:

   {{< tabs name="download_binary_linux" >}}
   {{< tab name="x86-64" codelang="bash" >}}
   curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
   {{< /tab >}}
   {{< tab name="ARM64" codelang="bash" >}}
   curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/arm64/kubectl"
   {{< /tab >}}
   {{< /tabs >}}

   {{< note >}}
   To download a specific version, replace the `$(curl -L -s https://dl.k8s.io/release/stable.txt)`
   portion of the command with the specific version.

   For example, to download version {{< skew currentPatchVersion >}} on Linux x86-64, type:

   ```bash
   curl -LO https://dl.k8s.io/release/v{{< skew currentPatchVersion >}}/bin/linux/amd64/kubectl
   ```

   And for Linux ARM64, type:

   ```bash
   curl -LO https://dl.k8s.io/release/v{{< skew currentPatchVersion >}}/bin/linux/arm64/kubectl
   ```

   {{< /note >}}

1. Validate the binary (optional)

   Download the kubectl checksum file:

   {{< tabs name="download_checksum_linux" >}}
   {{< tab name="x86-64" codelang="bash" >}}
   curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl.sha256"
   {{< /tab >}}
   {{< tab name="ARM64" codelang="bash" >}}
   curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/arm64/kubectl.sha256"
   {{< /tab >}}
   {{< /tabs >}}

   Validate the kubectl binary against the checksum file:

   ```bash
   echo "$(cat kubectl.sha256)  kubectl" | sha256sum --check
   ```

   If valid, the output is:

   ```console
   kubectl: OK
   ```

   If the check fails, `sha256` exits with nonzero status and prints output similar to:

   ```console
   kubectl: FAILED
   sha256sum: WARNING: 1 computed checksum did NOT match
   ```

   {{< note >}}
   Download the same version of the binary and checksum.
   {{< /note >}}

1. Install kubectl

   ```bash
   sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl
   ```

   {{< note >}}
   If you do not have root access on the target system, you can still install
   kubectl to the `~/.local/bin` directory:

   ```bash
   chmod +x kubectl
   mkdir -p ~/.local/bin
   mv ./kubectl ~/.local/bin/kubectl
   # and then append (or prepend) ~/.local/bin to $PATH
   ```

   {{< /note >}}

1. Test to ensure the version you installed is up-to-date:

   ```bash
   kubectl version --client
   ```

   Or use this for detailed view of version:

   ```cmd
   kubectl version --client --output=yaml
   ```

### Install using native package management

{{< tabs name="kubectl_install" >}}
{{% tab name="Debian-based distributions" %}}

1. Update the `apt` package index and install packages needed to use the Kubernetes `apt` repository:

   ```shell
   sudo apt-get update
   # apt-transport-https may be a dummy package; if so, you can skip that package
   sudo apt-get install -y apt-transport-https ca-certificates curl gnupg
   ```

2. Download the public signing key for the Kubernetes package repositories. The same signing key is used for all repositories so you can disregard the version in the URL:

   ```shell
   # If the folder `/etc/apt/keyrings` does not exist, it should be created before the curl command, read the note below.
   # sudo mkdir -p -m 755 /etc/apt/keyrings
   curl -fsSL https://pkgs.k8s.io/core:/stable:/{{< param "version" >}}/deb/Release.key | sudo gpg --dearmor -o /etc/apt/keyrings/kubernetes-apt-keyring.gpg
   sudo chmod 644 /etc/apt/keyrings/kubernetes-apt-keyring.gpg # allow unprivileged APT programs to read this keyring
   ```
   
{{< note >}}
In releases older than Debian 12 and Ubuntu 22.04, folder `/etc/apt/keyrings` does not exist by default, and it should be created before the curl command.
{{< /note >}}

3. Add the appropriate Kubernetes `apt` repository. If you want to use Kubernetes version different than {{< param "version" >}},
   replace {{< param "version" >}} with the desired minor version in the command below:

   ```shell
   # This overwrites any existing configuration in /etc/apt/sources.list.d/kubernetes.list
   echo 'deb [signed-by=/etc/apt/keyrings/kubernetes-apt-keyring.gpg] https://pkgs.k8s.io/core:/stable:/{{< param "version" >}}/deb/ /' | sudo tee /etc/apt/sources.list.d/kubernetes.list
   sudo chmod 644 /etc/apt/sources.list.d/kubernetes.list   # helps tools such as command-not-found to work correctly
   ```

{{< note >}}
To upgrade kubectl to another minor release, you'll need to bump the version in `/etc/apt/sources.list.d/kubernetes.list` before running `apt-get update` and `apt-get upgrade`. This procedure is described in more detail in [Changing The Kubernetes Package Repository](/docs/tasks/administer-cluster/kubeadm/change-package-repository/).
{{< /note >}}

4. Update `apt` package index, then install kubectl:

   ```shell
   sudo apt-get update
   sudo apt-get install -y kubectl
   ```

{{% /tab %}}

{{% tab name="Red Hat-based distributions" %}}

1. Add the Kubernetes `yum` repository. If you want to use Kubernetes version
   different than {{< param "version" >}}, replace {{< param "version" >}} with
   the desired minor version in the command below.

   ```bash
   # This overwrites any existing configuration in /etc/yum.repos.d/kubernetes.repo
   cat <<EOF | sudo tee /etc/yum.repos.d/kubernetes.repo
   [kubernetes]
   name=Kubernetes
   baseurl=https://pkgs.k8s.io/core:/stable:/{{< param "version" >}}/rpm/
   enabled=1
   gpgcheck=1
   gpgkey=https://pkgs.k8s.io/core:/stable:/{{< param "version" >}}/rpm/repodata/repomd.xml.key
   EOF
   ```

{{< note >}}
To upgrade kubectl to another minor release, you'll need to bump the version in `/etc/yum.repos.d/kubernetes.repo` before running `yum update`. This procedure is described in more detail in [Changing The Kubernetes Package Repository](/docs/tasks/administer-cluster/kubeadm/change-package-repository/).
{{< /note >}}

2. Install kubectl using `yum`:

   ```bash
   sudo yum install -y kubectl
   ```

{{% /tab %}}

{{% tab name="SUSE-based distributions" %}}

1. Add the Kubernetes `zypper` repository. If you want to use Kubernetes version
   different than {{< param "version" >}}, replace {{< param "version" >}} with
   the desired minor version in the command below.

   ```bash
   # This overwrites any existing configuration in /etc/zypp/repos.d/kubernetes.repo
   cat <<EOF | sudo tee /etc/zypp/repos.d/kubernetes.repo
   [kubernetes]
   name=Kubernetes
   baseurl=https://pkgs.k8s.io/core:/stable:/{{< param "version" >}}/rpm/
   enabled=1
   gpgcheck=1
   gpgkey=https://pkgs.k8s.io/core:/stable:/{{< param "version" >}}/rpm/repodata/repomd.xml.key
   EOF
   ```

{{< note >}}
To upgrade kubectl to another minor release, you'll need to bump the version in `/etc/zypp/repos.d/kubernetes.repo`
before running `zypper update`. This procedure is described in more detail in
[Changing The Kubernetes Package Repository](/docs/tasks/administer-cluster/kubeadm/change-package-repository/).
{{< /note >}}

2. Update `zypper` and confirm the new repo addition:
   
   ```bash
   sudo zypper update
   ```

   When this message appears, press 't' or 'a':

   ```
   New repository or package signing key received:

   Repository:       Kubernetes
   Key Fingerprint:  1111 2222 3333 4444 5555 6666 7777 8888 9999 AAAA
   Key Name:         isv:kubernetes OBS Project <isv:kubernetes@build.opensuse.org>
   Key Algorithm:    RSA 2048
   Key Created:      Thu 25 Aug 2022 01:21:11 PM -03
   Key Expires:      Sat 02 Nov 2024 01:21:11 PM -03 (expires in 85 days)
   Rpm Name:         gpg-pubkey-9a296436-6307a177

   Note: Signing data enables the recipient to verify that no modifications occurred after the data
   were signed. Accepting data with no, wrong or unknown signature can lead to a corrupted system
   and in extreme cases even to a system compromise.

   Note: A GPG pubkey is clearly identified by its fingerprint. Do not rely on the key's name. If
   you are not sure whether the presented key is authentic, ask the repository provider or check
   their web site. Many providers maintain a web page showing the fingerprints of the GPG keys they
   are using.

   Do you want to reject the key, trust temporarily, or trust always? [r/t/a/?] (r): a
   ```
   
3. Install kubectl using `zypper`:

   ```bash
   sudo zypper install -y kubectl
   ```

{{% /tab %}}
{{< /tabs >}}

### Install using other package management

{{< tabs name="other_kubectl_install" >}}
{{% tab name="Snap" %}}
If you are on Ubuntu or another Linux distribution that supports the
[snap](https://snapcraft.io/docs/core/install) package manager, kubectl
is available as a [snap](https://snapcraft.io/) application.

```shell
snap install kubectl --classic
kubectl version --client
```

{{% /tab %}}

{{% tab name="Homebrew" %}}
If you are on Linux and using [Homebrew](https://docs.brew.sh/Homebrew-on-Linux)
package manager, kubectl is available for [installation](https://docs.brew.sh/Homebrew-on-Linux#install).

```shell
brew install kubectl
kubectl version --client
```

{{% /tab %}}

{{< /tabs >}}

## Verify kubectl configuration

{{< include "included/verify-kubectl.md" >}}

## Optional kubectl configurations and plugins

### Enable shell autocompletion

kubectl provides autocompletion support for Bash, Zsh, Fish, and PowerShell,
which can save you a lot of typing.

Below are the procedures to set up autocompletion for Bash, Fish, and Zsh.

{{< tabs name="kubectl_autocompletion" >}}
{{< tab name="Bash" include="included/optional-kubectl-configs-bash-linux.md" />}}
{{< tab name="Fish" include="included/optional-kubectl-configs-fish.md" />}}
{{< tab name="Zsh" include="included/optional-kubectl-configs-zsh.md" />}}
{{< /tabs >}}

### Install `kubectl convert` plugin

{{< include "included/kubectl-convert-overview.md" >}}

1. Download the latest release with the command:

   {{< tabs name="download_convert_binary_linux" >}}
   {{< tab name="x86-64" codelang="bash" >}}
   curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl-convert"
   {{< /tab >}}
   {{< tab name="ARM64" codelang="bash" >}}
   curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/arm64/kubectl-convert"
   {{< /tab >}}
   {{< /tabs >}}

1. Validate the binary (optional)

   Download the kubectl-convert checksum file:

   {{< tabs name="download_convert_checksum_linux" >}}
   {{< tab name="x86-64" codelang="bash" >}}
   curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl-convert.sha256"
   {{< /tab >}}
   {{< tab name="ARM64" codelang="bash" >}}
   curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/arm64/kubectl-convert.sha256"
   {{< /tab >}}
   {{< /tabs >}}

   Validate the kubectl-convert binary against the checksum file:

   ```bash
   echo "$(cat kubectl-convert.sha256) kubectl-convert" | sha256sum --check
   ```

   If valid, the output is:

   ```console
   kubectl-convert: OK
   ```

   If the check fails, `sha256` exits with nonzero status and prints output similar to:

   ```console
   kubectl-convert: FAILED
   sha256sum: WARNING: 1 computed checksum did NOT match
   ```

   {{< note >}}
   Download the same version of the binary and checksum.
   {{< /note >}}

1. Install kubectl-convert

   ```bash
   sudo install -o root -g root -m 0755 kubectl-convert /usr/local/bin/kubectl-convert
   ```

1. Verify plugin is successfully installed

   ```shell
   kubectl convert --help
   ```

   If you do not see an error, it means the plugin is successfully installed.

1. After installing the plugin, clean up the installation files:

   ```bash
   rm kubectl-convert kubectl-convert.sha256
   ```

## {{% heading "whatsnext" %}}

{{< include "included/kubectl-whats-next.md" >}}
