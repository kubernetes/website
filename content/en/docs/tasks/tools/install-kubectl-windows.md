---
reviewers:
- mikedanese
title: Install and Set Up kubectl on Windows
content_type: task
weight: 10
---

## {{% heading "prerequisites" %}}

You must use a kubectl version that is within one minor version difference of
your cluster. For example, a v{{< skew currentVersion >}} client can communicate
with v{{< skew currentVersionAddMinor -1 >}}, v{{< skew currentVersionAddMinor 0 >}},
and v{{< skew currentVersionAddMinor 1 >}} control planes.
Using the latest compatible version of kubectl helps avoid unforeseen issues.

## Install kubectl on Windows

The following methods exist for installing kubectl on Windows:

- [Install kubectl binary on Windows (via direct download or curl)](#install-kubectl-binary-on-windows-via-direct-download-or-curl)
- [Install on Windows using Chocolatey, Scoop, or winget](#install-nonstandard-package-tools)

### Install kubectl binary on Windows (via direct download or curl)

1. You have two options for installing kubectl on your Windows device

   - Direct download:
     
     Download the latest {{< skew currentVersion >}} patch release binary directly for your specific architecture by visiting the [Kubernetes release page](https://kubernetes.io/releases/download/#binaries). Be sure to select the correct binary for your architecture (e.g., amd64, arm64, etc.).
   
   - Using curl:

     If you have `curl` installed, use this command:

     ```powershell
     curl.exe -LO "https://dl.k8s.io/release/v{{< skew currentPatchVersion >}}/bin/windows/amd64/kubectl.exe"
     ```

   {{< note >}}
   To find out the latest stable version (for example, for scripting), take a look at
   [https://dl.k8s.io/release/stable.txt](https://dl.k8s.io/release/stable.txt).
   {{< /note >}}

1. Validate the binary (optional)

   Download the `kubectl` checksum file:

   ```powershell
   curl.exe -LO "https://dl.k8s.io/v{{< skew currentPatchVersion >}}/bin/windows/amd64/kubectl.exe.sha256"
   ```

   Validate the `kubectl` binary against the checksum file:

   - Using Command Prompt to manually compare `CertUtil`'s output to the checksum file downloaded:

     ```cmd
     CertUtil -hashfile kubectl.exe SHA256
     type kubectl.exe.sha256
     ```

   - Using PowerShell to automate the verification using the `-eq` operator to
     get a `True` or `False` result:

     ```powershell
      $(Get-FileHash -Algorithm SHA256 .\kubectl.exe).Hash -eq $(Get-Content .\kubectl.exe.sha256)
     ```

1. Append or prepend the `kubectl` binary folder to your `PATH` environment variable.

1. Test to ensure the version of `kubectl` is the same as downloaded:

   ```cmd
   kubectl version --client
   ```
   
   Or use this for detailed view of version:

   ```cmd
   kubectl version --client --output=yaml
   ```



{{< note >}}
[Docker Desktop for Windows](https://docs.docker.com/docker-for-windows/#kubernetes)
adds its own version of `kubectl` to `PATH`. If you have installed Docker Desktop before,
you may need to place your `PATH` entry before the one added by the Docker Desktop
installer or remove the Docker Desktop's `kubectl`.
{{< /note >}}

### Install on Windows using Chocolatey, Scoop, or winget {#install-nonstandard-package-tools}

1. To install kubectl on Windows you can use either [Chocolatey](https://chocolatey.org)
   package manager, [Scoop](https://scoop.sh) command-line installer, or
   [winget](https://learn.microsoft.com/en-us/windows/package-manager/winget/) package manager.

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
   {{% tab name="winget" %}}
   ```powershell
   winget install -e --id Kubernetes.kubectl
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

## Verify kubectl configuration

{{< include "included/verify-kubectl.md" >}}

## Optional kubectl configurations and plugins

### Enable shell autocompletion

kubectl provides autocompletion support for Bash, Zsh, Fish, and PowerShell,
which can save you a lot of typing.

Below are the procedures to set up autocompletion for PowerShell.

{{< include "included/optional-kubectl-configs-pwsh.md" >}}

### Install `kubectl convert` plugin

{{< include "included/kubectl-convert-overview.md" >}}

1. Download the latest release with the command:

   ```powershell
   curl.exe -LO "https://dl.k8s.io/release/v{{< skew currentPatchVersion >}}/bin/windows/amd64/kubectl-convert.exe"
   ```

1. Validate the binary (optional).

   Download the `kubectl-convert` checksum file:

   ```powershell
   curl.exe -LO "https://dl.k8s.io/v{{< skew currentPatchVersion >}}/bin/windows/amd64/kubectl-convert.exe.sha256"
   ```

   Validate the `kubectl-convert` binary against the checksum file:

   - Using Command Prompt to manually compare `CertUtil`'s output to the checksum file downloaded:

     ```cmd
     CertUtil -hashfile kubectl-convert.exe SHA256
     type kubectl-convert.exe.sha256
     ```

   - Using PowerShell to automate the verification using the `-eq` operator to get
     a `True` or `False` result:

     ```powershell
     $($(CertUtil -hashfile .\kubectl-convert.exe SHA256)[1] -replace " ", "") -eq $(type .\kubectl-convert.exe.sha256)
     ```

1. Append or prepend the `kubectl-convert` binary folder to your `PATH` environment variable.

1. Verify the plugin is successfully installed.

   ```shell
   kubectl convert --help
   ```

   If you do not see an error, it means the plugin is successfully installed.

1. After installing the plugin, clean up the installation files:

   ```powershell
   del kubectl-convert.exe
   del kubectl-convert.exe.sha256
   ```

## {{% heading "whatsnext" %}}

{{< include "included/kubectl-whats-next.md" >}}
