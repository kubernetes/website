---
reviewers:
- mikedanese
title: Install and Set Up kubectl on Windows
content_type: task
weight: 10
card:
  name: tasks
  weight: 20
  title: Install kubectl on Windows
---

## {{% heading "prerequisites" %}}

You must use a kubectl version that is within one minor version difference of your cluster.
For example, a v1.2 client should work with v1.1, v1.2, and v1.3 master.
Using the latest version of kubectl helps avoid unforeseen issues.

## Install kubectl on Windows

The following methods exist for installing kubectl on Windows:

- [Install kubectl binary with curl on Windows](#install-kubectl-binary-with-curl-on-windows)
- [Install with PowerShell from PSGallery](#install-with-powershell-from-psgallery)
- [Install on Windows using Chocolatey or Scoop](#install-on-windows-using-chocolatey-or-scoop)
- [Install on Windows as part of the Google Cloud SDK](#install-on-windows-as-part-of-the-google-cloud-sdk)


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

### Install on Windows as part of the Google Cloud SDK

{{< include "included/kubectl_installs_gcloud.md" >}}

## Verifying kubectl configuration

{{< include "included/verify-kubectl.md" >}}

## Optional kubectl configurations

{{< include "included/optional-kubectl-configs.md" >}}

## {{% heading "whatsnext" %}}

{{< include "included/kubectl-whats-next.md" >}}