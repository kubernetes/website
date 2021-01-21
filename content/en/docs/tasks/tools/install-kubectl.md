---
reviewers:
- mikedanese
title: Install and Set Up kubectl
content_type: task
weight: 10
card:
  name: tasks
  weight: 20
  title: Install kubectl
---

<!-- overview -->
The Kubernetes command-line tool, [kubectl](/docs/reference/kubectl/kubectl/), allows
you to run commands against Kubernetes clusters.
You can use kubectl to deploy applications, inspect and manage cluster resources,
and view logs. For a complete list of kubectl operations, see
[Overview of kubectl](/docs/reference/kubectl/overview/).


## {{% heading "prerequisites" %}}

You must use a kubectl version that is within one minor version difference of your cluster.
For example, a v1.2 client should work with v1.1, v1.2, and v1.3 master.
Using the latest version of kubectl helps avoid unforeseen issues.

<!-- steps -->

## Install kubectl on Linux

### Install kubectl binary with curl on Linux

1. Download the latest release with the command:

   ```bash
   curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
   ```

   {{< note >}}
To download a specific version, replace the `$(curl -L -s https://dl.k8s.io/release/stable.txt)` portion of the command with the specific version.

For example, to download version {{< param "fullversion" >}} on Linux, type:

   ```bash
   curl -LO https://dl.k8s.io/release/{{< param "fullversion" >}}/bin/linux/amd64/kubectl
   ```
   {{< /note >}}

1. Validate the binary (optional)

   Download the kubectl checksum file:

   ```bash
   curl -LO "https://dl.k8s.io/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl.sha256"
   ```

   Validate the kubectl binary against the checksum file:

   ```bash
   echo "$(<kubectl.sha256) kubectl" | sha256sum --check
   ```

   If valid, the output is:

   ```bash
   kubectl: OK
   ```

   If the check fails, `sha256` exits with nonzero status and prints output similar to:

   ```bash
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
   If you do not have root access on the target system, you can still install kubectl to the `~/.local/bin` directory:

   ```bash
   mkdir -p ~/.local/bin/kubectl
   mv ./kubectl ~/.local/bin/kubectl
   # and then add ~/.local/bin/kubectl to $PATH
   ```

   {{< /note >}}

1. Test to ensure the version you installed is up-to-date:

   ```bash
   kubectl version --client
   ```

### Install using native package management

{{< tabs name="kubectl_install" >}}
{{< tab name="Ubuntu, Debian or HypriotOS" codelang="bash" >}}
sudo apt-get update && sudo apt-get install -y apt-transport-https gnupg2 curl
curl -s https://packages.cloud.google.com/apt/doc/apt-key.gpg | sudo apt-key add -
echo "deb https://apt.kubernetes.io/ kubernetes-xenial main" | sudo tee -a /etc/apt/sources.list.d/kubernetes.list
sudo apt-get update
sudo apt-get install -y kubectl
{{< /tab >}}

{{< tab name="CentOS, RHEL or Fedora" codelang="bash" >}}cat <<EOF > /etc/yum.repos.d/kubernetes.repo
[kubernetes]
name=Kubernetes
baseurl=https://packages.cloud.google.com/yum/repos/kubernetes-el7-x86_64
enabled=1
gpgcheck=1
repo_gpgcheck=1
gpgkey=https://packages.cloud.google.com/yum/doc/yum-key.gpg https://packages.cloud.google.com/yum/doc/rpm-package-key.gpg
EOF
yum install -y kubectl
{{< /tab >}}
{{< /tabs >}}

### Install using other package management

{{< tabs name="other_kubectl_install" >}}
{{% tab name="Snap" %}}
If you are on Ubuntu or another Linux distribution that support [snap](https://snapcraft.io/docs/core/install) package manager, kubectl is available as a [snap](https://snapcraft.io/) application.

```shell
snap install kubectl --classic

kubectl version --client
```

{{% /tab %}}

{{% tab name="Homebrew" %}}
If you are on Linux and using [Homebrew](https://docs.brew.sh/Homebrew-on-Linux) package manager, kubectl is available for [installation](https://docs.brew.sh/Homebrew-on-Linux#install).

```shell
brew install kubectl

kubectl version --client
```

{{% /tab %}}

{{< /tabs >}}


## Install kubectl on macOS

### Install kubectl binary with curl on macOS

1. Download the latest release:

   ```bash
   curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/darwin/amd64/kubectl"
   ```

   {{< note >}}
   To download a specific version, replace the `$(curl -L -s https://dl.k8s.io/release/stable.txt)` portion of the command with the specific version.

   For example, to download version {{< param "fullversion" >}} on macOS, type:

   ```bash
   curl -LO https://dl.k8s.io/release/{{< param "fullversion" >}}/bin/darwin/amd64/kubectl
   ```

   {{< /note >}}

1. Validate the binary (optional)

   Download the kubectl checksum file:

   ```bash
   curl -LO "https://dl.k8s.io/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/darwin/amd64/kubectl.sha256"
   ```

   Validate the kubectl binary against the checksum file:

   ```bash
   echo "$(<kubectl.sha256)  kubectl" | shasum -a 256 --check
   ```

   If valid, the output is:

   ```bash
   kubectl: OK
   ```

   If the check fails, `shasum` exits with nonzero status and prints output similar to:

   ```bash
   kubectl: FAILED
   shasum: WARNING: 1 computed checksum did NOT match
   ```

   {{< note >}}
   Download the same version of the binary and checksum.
   {{< /note >}}

1. Make the kubectl binary executable.

   ```bash
   chmod +x ./kubectl
   ```

1. Move the kubectl binary to a file location on your system `PATH`.

   ```bash
   sudo mv ./kubectl /usr/local/bin/kubectl && \
   sudo chown root: /usr/local/bin/kubectl
   ```

1. Test to ensure the version you installed is up-to-date:

   ```bash
   kubectl version --client
   ```

### Install with Homebrew on macOS

If you are on macOS and using [Homebrew](https://brew.sh/) package manager, you can install kubectl with Homebrew.

1. Run the installation command:

   ```bash
   brew install kubectl 
   ```

   or

   ```bash
   brew install kubernetes-cli
   ```

1. Test to ensure the version you installed is up-to-date:

   ```bash
   kubectl version --client
   ```

### Install with Macports on macOS

If you are on macOS and using [Macports](https://macports.org/) package manager, you can install kubectl with Macports.

1. Run the installation command:

   ```bash
   sudo port selfupdate
   sudo port install kubectl
   ```

1. Test to ensure the version you installed is up-to-date:

   ```bash
   kubectl version --client
   ```

## Install kubectl on Windows

### Install kubectl binary with curl on Windows

1. Download the [latest release {{< param "fullversion" >}}](https://dl.k8s.io/release/{{< param "fullversion" >}}/bin/windows/amd64/kubectl.exe).

   Or if you have `curl` installed, use this command:

   ```powershell
   curl -LO https://dl.k8s.io/release/{{< param "fullversion" >}}/bin/windows/amd64/kubectl.exe
   ```

   {{< note >}}
   To find out the latest stable version (for example, for scripting), take a look at [https://dl.k8s.io/release/stable.txt](https://dl.k8s.io/release/stable.txt).
   {{< /note >}}

1. Validate the binary (optional)

   Download the kubectl checksum file:

   ```powershell
   curl -LO https://dl.k8s.io/{{< param "fullversion" >}}/bin/windows/amd64/kubectl.exe.sha256
   ```

   Validate the kubectl binary against the checksum file:

   - Using Command Prompt to manually compare `CertUtil`'s output to the checksum file downloaded:

     ```cmd
     CertUtil -hashfile kubectl.exe SHA256
     type kubectl.exe.sha256
     ```

   - Using PowerShell to automate the verification using the `-eq` operator to get a `True` or `False` result:

     ```powershell
     $($(CertUtil -hashfile .\kubectl.exe SHA256)[1] -replace " ", "") -eq $(type .\kubectl.exe.sha256)
     ```

1. Add the binary in to your `PATH`.

1. Test to ensure the version of `kubectl` is the same as downloaded:

   ```cmd
   kubectl version --client
   ```

{{< note >}}
[Docker Desktop for Windows](https://docs.docker.com/docker-for-windows/#kubernetes) adds its own version of `kubectl` to `PATH`.
If you have installed Docker Desktop before, you may need to place your `PATH` entry before the one added by the Docker Desktop installer or remove the Docker Desktop's `kubectl`.
{{< /note >}}

### Install with PowerShell from PSGallery

If you are on Windows and using the [PowerShell Gallery](https://www.powershellgallery.com/) package manager, you can install and update kubectl with PowerShell.

1. Run the installation commands (making sure to specify a `DownloadLocation`):

   ```powershell
   Install-Script -Name 'install-kubectl' -Scope CurrentUser -Force
   install-kubectl.ps1 [-DownloadLocation <path>]
   ```

   {{< note >}}
   If you do not specify a `DownloadLocation`, `kubectl` will be installed in the user's `temp` Directory.
   {{< /note >}}

   The installer creates `$HOME/.kube` and instructs it to create a config file.

1. Test to ensure the version you installed is up-to-date:

   ```powershell
   kubectl version --client
   ```

{{< note >}}
Updating the installation is performed by rerunning the two commands listed in step 1.
{{< /note >}}

### Install on Windows using Chocolatey or Scoop

1. To install kubectl on Windows you can use either [Chocolatey](https://chocolatey.org) package manager or [Scoop](https://scoop.sh) command-line installer.

   {{< tabs name="kubectl_win_install" >}}
   {{% tab name="choco" %}}
   ```powershell
   choco install kubernetes-cli
   ```
   {{% /tab %}}
   {{% tab name="scoop" %}}
   ```powershell
   scoop install kubectl
   ```
   {{% /tab %}}
   {{< /tabs >}}


1. Test to ensure the version you installed is up-to-date:

   ```powershell
   kubectl version --client
   ```

1. Navigate to your home directory:

   ```powershell
   # If you're using cmd.exe, run: cd %USERPROFILE%
   cd ~
   ```

1. Create the `.kube` directory:

   ```powershell
   mkdir .kube
   ```

1. Change to the `.kube` directory you just created:

   ```powershell
   cd .kube
   ```

1. Configure kubectl to use a remote Kubernetes cluster:

   ```powershell
   New-Item config -type file
   ```

{{< note >}}
Edit the config file with a text editor of your choice, such as Notepad.
{{< /note >}}

## Download as part of the Google Cloud SDK

You can install kubectl as part of the Google Cloud SDK.

1. Install the [Google Cloud SDK](https://cloud.google.com/sdk/).

1. Run the `kubectl` installation command:

   ```shell
   gcloud components install kubectl
   ```

1. Test to ensure the version you installed is up-to-date:

   ```shell
   kubectl version --client
   ```

## Verifying kubectl configuration

In order for kubectl to find and access a Kubernetes cluster, it needs a
[kubeconfig file](/docs/concepts/configuration/organize-cluster-access-kubeconfig/),
which is created automatically when you create a cluster using
[kube-up.sh](https://github.com/kubernetes/kubernetes/blob/master/cluster/kube-up.sh)
or successfully deploy a Minikube cluster.
By default, kubectl configuration is located at `~/.kube/config`.

Check that kubectl is properly configured by getting the cluster state:

```shell
kubectl cluster-info
```

If you see a URL response, kubectl is correctly configured to access your cluster.

If you see a message similar to the following, kubectl is not configured correctly or is not able to connect to a Kubernetes cluster.

```
The connection to the server <server-name:port> was refused - did you specify the right host or port?
```

For example, if you are intending to run a Kubernetes cluster on your laptop (locally), you will need a tool like Minikube to be installed first and then re-run the commands stated above.

If kubectl cluster-info returns the url response but you can't access your cluster, to check whether it is configured properly, use:

```shell
kubectl cluster-info dump
```

## Optional kubectl configurations

### Enabling shell autocompletion

kubectl provides autocompletion support for Bash and Zsh, which can save you a lot of typing.

Below are the procedures to set up autocompletion for Bash (including the difference between Linux and macOS) and Zsh.

{{< tabs name="kubectl_autocompletion" >}}

{{% tab name="Bash on Linux" %}}

### Introduction

The kubectl completion script for Bash can be generated with the command `kubectl completion bash`. Sourcing the completion script in your shell enables kubectl autocompletion.

However, the completion script depends on [**bash-completion**](https://github.com/scop/bash-completion), which means that you have to install this software first (you can test if you have bash-completion already installed by running `type _init_completion`).

### Install bash-completion

bash-completion is provided by many package managers (see [here](https://github.com/scop/bash-completion#installation)). You can install it with `apt-get install bash-completion` or `yum install bash-completion`, etc.

The above commands create `/usr/share/bash-completion/bash_completion`, which is the main script of bash-completion. Depending on your package manager, you have to manually source this file in your `~/.bashrc` file.

To find out, reload your shell and run `type _init_completion`. If the command succeeds, you're already set, otherwise add the following to your `~/.bashrc` file:

```bash
source /usr/share/bash-completion/bash_completion
```

Reload your shell and verify that bash-completion is correctly installed by typing `type _init_completion`.

### Enable kubectl autocompletion

You now need to ensure that the kubectl completion script gets sourced in all your shell sessions. There are two ways in which you can do this:

- Source the completion script in your `~/.bashrc` file:

   ```bash
   echo 'source <(kubectl completion bash)' >>~/.bashrc
   ```

- Add the completion script to the `/etc/bash_completion.d` directory:

   ```bash
   kubectl completion bash >/etc/bash_completion.d/kubectl
   ```

If you have an alias for kubectl, you can extend shell completion to work with that alias:

```bash
echo 'alias k=kubectl' >>~/.bashrc
echo 'complete -F __start_kubectl k' >>~/.bashrc
```

{{< note >}}
bash-completion sources all completion scripts in `/etc/bash_completion.d`.
{{< /note >}}

Both approaches are equivalent. After reloading your shell, kubectl autocompletion should be working.

{{% /tab %}}


{{% tab name="Bash on macOS" %}}


### Introduction

The kubectl completion script for Bash can be generated with `kubectl completion bash`. Sourcing this script in your shell enables kubectl completion.

However, the kubectl completion script depends on [**bash-completion**](https://github.com/scop/bash-completion) which you thus have to previously install.

{{< warning>}}
There are two versions of bash-completion, v1 and v2. V1 is for Bash 3.2 (which is the default on macOS), and v2 is for Bash 4.1+. The kubectl completion script **doesn't work** correctly with bash-completion v1 and Bash 3.2. It requires **bash-completion v2** and **Bash 4.1+**. Thus, to be able to correctly use kubectl completion on macOS, you have to install and use Bash 4.1+ ([*instructions*](https://itnext.io/upgrading-bash-on-macos-7138bd1066ba)). The following instructions assume that you use Bash 4.1+ (that is, any Bash version of 4.1 or newer).
{{< /warning >}}

### Upgrade Bash

The instructions here assume you use Bash 4.1+. You can check your Bash's version by running:

```bash
echo $BASH_VERSION
```

If it is too old, you can install/upgrade it using Homebrew:

```bash
brew install bash
```

Reload your shell and verify that the desired version is being used:

```bash
echo $BASH_VERSION $SHELL
```

Homebrew usually installs it at `/usr/local/bin/bash`.

### Install bash-completion

{{< note >}}
As mentioned, these instructions assume you use Bash 4.1+, which means you will install bash-completion v2 (in contrast to Bash 3.2 and bash-completion v1, in which case kubectl completion won't work).
{{< /note >}}

You can test if you have bash-completion v2 already installed with `type _init_completion`. If not, you can install it with Homebrew:

```bash
brew install bash-completion@2
```

As stated in the output of this command, add the following to your `~/.bash_profile` file:

```bash
export BASH_COMPLETION_COMPAT_DIR="/usr/local/etc/bash_completion.d"
[[ -r "/usr/local/etc/profile.d/bash_completion.sh" ]] && . "/usr/local/etc/profile.d/bash_completion.sh"
```

Reload your shell and verify that bash-completion v2 is correctly installed with `type _init_completion`.

### Enable kubectl autocompletion

You now have to ensure that the kubectl completion script gets sourced in all your shell sessions. There are multiple ways to achieve this:

- Source the completion script in your `~/.bash_profile` file:

    ```bash
    echo 'source <(kubectl completion bash)' >>~/.bash_profile
    ```

- Add the completion script to the `/usr/local/etc/bash_completion.d` directory:

    ```bash
    kubectl completion bash >/usr/local/etc/bash_completion.d/kubectl
    ```

- If you have an alias for kubectl, you can extend shell completion to work with that alias:

    ```bash
    echo 'alias k=kubectl' >>~/.bash_profile
    echo 'complete -F __start_kubectl k' >>~/.bash_profile
    ```

- If you installed kubectl with Homebrew (as explained [above](#install-with-homebrew-on-macos)), then the kubectl completion script should already be in `/usr/local/etc/bash_completion.d/kubectl`. In that case, you don't need to do anything.

   {{< note >}}
   The Homebrew installation of bash-completion v2 sources all the files in the `BASH_COMPLETION_COMPAT_DIR` directory, that's why the latter two methods work.
   {{< /note >}}

In any case, after reloading your shell, kubectl completion should be working.
{{% /tab %}}

{{% tab name="Zsh" %}}

The kubectl completion script for Zsh can be generated with the command `kubectl completion zsh`. Sourcing the completion script in your shell enables kubectl autocompletion.

To do so in all your shell sessions, add the following to your `~/.zshrc` file:

```zsh
source <(kubectl completion zsh)
```

If you have an alias for kubectl, you can extend shell completion to work with that alias:

```zsh
echo 'alias k=kubectl' >>~/.zshrc
echo 'complete -F __start_kubectl k' >>~/.zshrc
```

After reloading your shell, kubectl autocompletion should be working.

If you get an error like `complete:13: command not found: compdef`, then add the following to the beginning of your `~/.zshrc` file:

```zsh
autoload -Uz compinit
compinit
```
{{% /tab %}}
{{< /tabs >}}

## {{% heading "whatsnext" %}}

* [Install Minikube](https://minikube.sigs.k8s.io/docs/start/)
* See the [getting started guides](/docs/setup/) for more about creating clusters.
* [Learn how to launch and expose your application.](/docs/tasks/access-application-cluster/service-access-application-cluster/)
* If you need access to a cluster you didn't create, see the
  [Sharing Cluster Access document](/docs/tasks/access-application-cluster/configure-access-multiple-clusters/).
* Read the [kubectl reference docs](/docs/reference/kubectl/kubectl/)

