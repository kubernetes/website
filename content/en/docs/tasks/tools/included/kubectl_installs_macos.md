- [Install kubectl binary with curl on macOS](#install-kubectl-binary-with-curl-on-macos)
- [Install with Homebrew on macOS](#install-with-homebrew-on-macos)
- [Install with Macports on macOS](#install-with-macports-on-macos)

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