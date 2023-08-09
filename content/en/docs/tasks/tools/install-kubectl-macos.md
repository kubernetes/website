---
reviewers:
- mikedanese
title: Install and Set Up kubectl on macOS
content_type: task
weight: 10
card:
  name: tasks
  weight: 20
  title: Install kubectl on macOS
---

## {{% heading "prerequisites" %}}

You must use a kubectl version that is within one minor version difference of
your cluster. For example, a v{{< skew currentVersion >}} client can communicate
with v{{< skew currentVersionAddMinor -1 >}}, v{{< skew currentVersionAddMinor 0 >}},
and v{{< skew currentVersionAddMinor 1 >}} control planes.
Using the latest compatible version of kubectl helps avoid unforeseen issues.

## Install kubectl on macOS

The following methods exist for installing kubectl on macOS:

- [Install kubectl on macOS](#install-kubectl-on-macos)
  - [Install kubectl binary with curl on macOS](#install-kubectl-binary-with-curl-on-macos)
  - [Install with Homebrew on macOS](#install-with-homebrew-on-macos)
  - [Install with Macports on macOS](#install-with-macports-on-macos)
- [Verify kubectl configuration](#verify-kubectl-configuration)
- [Optional kubectl configurations and plugins](#optional-kubectl-configurations-and-plugins)
  - [Enable shell autocompletion](#enable-shell-autocompletion)
  - [Install `kubectl convert` plugin](#install-kubectl-convert-plugin)

### Install kubectl binary with curl on macOS

1. Download the latest release:

   {{< tabs name="download_binary_macos" >}}
   {{< tab name="Intel" codelang="bash" >}}
   curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/darwin/amd64/kubectl"
   {{< /tab >}}
   {{< tab name="Apple Silicon" codelang="bash" >}}
   curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/darwin/arm64/kubectl"
   {{< /tab >}}
   {{< /tabs >}}

   {{< note >}}
   To download a specific version, replace the `$(curl -L -s https://dl.k8s.io/release/stable.txt)`
   portion of the command with the specific version.

   For example, to download version {{< skew currentPatchVersion >}} on Intel macOS, type:

   ```bash
   curl -LO "https://dl.k8s.io/release/v{{< skew currentPatchVersion >}}/bin/darwin/amd64/kubectl"
   ```

   And for macOS on Apple Silicon, type:

   ```bash
   curl -LO "https://dl.k8s.io/release/v{{< skew currentPatchVersion >}}/bin/darwin/arm64/kubectl"
   ```

   {{< /note >}}

1. Validate the binary (optional)

   Download the kubectl checksum file:

   {{< tabs name="download_checksum_macos" >}}
   {{< tab name="Intel" codelang="bash" >}}
   curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/darwin/amd64/kubectl.sha256"
   {{< /tab >}}
   {{< tab name="Apple Silicon" codelang="bash" >}}
   curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/darwin/arm64/kubectl.sha256"
   {{< /tab >}}
   {{< /tabs >}}
  
   Validate the kubectl binary against the checksum file:

   ```bash
   echo "$(cat kubectl.sha256)  kubectl" | shasum -a 256 --check
   ```

   If valid, the output is:

   ```console
   kubectl: OK
   ```

   If the check fails, `shasum` exits with nonzero status and prints output similar to:

   ```console
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
   sudo mv ./kubectl /usr/local/bin/kubectl
   sudo chown root: /usr/local/bin/kubectl
   ```

   {{< note >}}
   Make sure `/usr/local/bin` is in your PATH environment variable.
   {{< /note >}}

1. Test to ensure the version you installed is up-to-date:

   ```bash
   kubectl version --client
   ```
   
   {{< note >}}
   The above command will generate a warning:

   ```
   WARNING: This version information is deprecated and will be replaced with the output from kubectl version --short.
   ```

   You can ignore this warning. You are only checking the version of `kubectl` that you
   have installed.
   
   {{< /note >}}
   
   Or use this for detailed view of version:

   ```cmd
   kubectl version --client --output=yaml
   ```

1. After installing the plugin, clean up the installation files:

   ```bash
   rm kubectl kubectl.sha256
   ```

### Install with Homebrew on macOS

If you are on macOS and using [Homebrew](https://brew.sh/) package manager,
you can install kubectl with Homebrew.

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

If you are on macOS and using [Macports](https://macports.org/) package manager,
you can install kubectl with Macports.

1. Run the installation command:

   ```bash
   sudo port selfupdate
   sudo port install kubectl
   ```

1. Test to ensure the version you installed is up-to-date:

   ```bash
   kubectl version --client
   ```

## Verify kubectl configuration

{{< include "included/verify-kubectl.md" >}}

## Optional kubectl configurations and plugins

### Enable shell autocompletion

kubectl provides autocompletion support for Bash, Zsh, Fish, and PowerShell
which can save you a lot of typing.

Below are the procedures to set up autocompletion for Bash, Fish, and Zsh.

{{< tabs name="kubectl_autocompletion" >}}
{{< tab name="Bash" include="included/optional-kubectl-configs-bash-mac.md" />}}
{{< tab name="Fish" include="included/optional-kubectl-configs-fish.md" />}}
{{< tab name="Zsh" include="included/optional-kubectl-configs-zsh.md" />}}
{{< /tabs >}}

### Install `kubectl convert` plugin

{{< include "included/kubectl-convert-overview.md" >}}

1. Download the latest release with the command:

   {{< tabs name="download_convert_binary_macos" >}}
   {{< tab name="Intel" codelang="bash" >}}
   curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/darwin/amd64/kubectl-convert"
   {{< /tab >}}
   {{< tab name="Apple Silicon" codelang="bash" >}}
   curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/darwin/arm64/kubectl-convert"
   {{< /tab >}}
   {{< /tabs >}}

1. Validate the binary (optional)

   Download the kubectl-convert checksum file:

   {{< tabs name="download_convert_checksum_macos" >}}
   {{< tab name="Intel" codelang="bash" >}}
   curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/darwin/amd64/kubectl-convert.sha256"
   {{< /tab >}}
   {{< tab name="Apple Silicon" codelang="bash" >}}
   curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/darwin/arm64/kubectl-convert.sha256"
   {{< /tab >}}
   {{< /tabs >}}

   Validate the kubectl-convert binary against the checksum file:

   ```bash
   echo "$(cat kubectl-convert.sha256)  kubectl-convert" | shasum -a 256 --check
   ```

   If valid, the output is:

   ```console
   kubectl-convert: OK
   ```

   If the check fails, `shasum` exits with nonzero status and prints output similar to:

   ```console
   kubectl-convert: FAILED
   shasum: WARNING: 1 computed checksum did NOT match
   ```

   {{< note >}}
   Download the same version of the binary and checksum.
   {{< /note >}}

1. Make kubectl-convert binary executable

   ```bash
   chmod +x ./kubectl-convert
   ```

1. Move the kubectl-convert binary to a file location on your system `PATH`.

   ```bash
   sudo mv ./kubectl-convert /usr/local/bin/kubectl-convert
   sudo chown root: /usr/local/bin/kubectl-convert
   ```

   {{< note >}}
   Make sure `/usr/local/bin` is in your PATH environment variable.
   {{< /note >}}

1. Verify plugin is successfully installed

   ```shell
   kubectl convert --help
   ```

   If you do not see an error, it means the plugin is successfully installed.

1. After installing the plugin, clean up the installation files:

   ```bash
   rm kubectl-convert kubectl-convert.sha256
   ```

### Uninstall kubectl on macOS

Depending on how you installed `kubectl`, use one of the following methods.

### Uninstall kubectl using the command-line

1.  Locate the `kubectl` binary on your system:

    ```bash
    where kubectl
    ```

1.  Remove the `kubectl` binary:

    ```bash
    sudo rm <path>
    ```
    Replace `<path>` with the path to the `kubectl` binary from the previous step. For example, `sudo rm /usr/local/bin/kubectl`.

### Uninstall kubectl using homebrew

If you installed `kubectl` using Homebrew, run the following command:

```bash
brew remove kubectl
```
  
## {{% heading "whatsnext" %}}

{{< include "included/kubectl-whats-next.md" >}}


