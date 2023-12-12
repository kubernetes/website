---
title: Instalar y Configurar kubectl en macOS
content_type: task
weight: 10
---

## {{% heading "prerequisites" %}}

Se debe utilizar la versión de kubectl con una minor versión de diferencia con
su cluster. Por ejemplo, un cliente con versión v{{< skew currentVersion >}} se puede comunicar
con los siguientes versiones de plano de control v{{< skew currentVersionAddMinor -1 >}}, 
v{{< skew currentVersionAddMinor 0 >}}, and v{{< skew currentVersionAddMinor 1 >}}.
Utilizar la última versión compatible de kubectl evita posibles errores.

## Instalar kubectl en macOS

Existen los siguientes métodos para instalar kubectl en macOS:

- [Instalar kubectl en macOS](#install-kubectl-on-macos)
  - [Instalación del binario para macOS con Curl](#install-kubectl-binary-with-curl-on-macos)
  - [Instalar con Homebrew en macOS](#install-with-homebrew-on-macos)
  - [Instalar con Macports en macOS](#install-with-macports-on-macos)
- [Verificar la configuración de kubectl](#verify-kubectl-configuration)
- [Configuraciones y plugins opcionales para kubectl](#optional-kubectl-configurations-and-plugins)
  - [Habilitar el autocompletado de la shell](#enable-shell-autocompletion)
  - [Instalar el plugin `kubectl convert`](#install-kubectl-convert-plugin)

### Instalación del binario para macOS de kubectl con Curl

1. Descargar la última versión con el siguiente comando:

   {{< tabs name="download_binary_macos" >}}
   {{< tab name="Intel" codelang="bash" >}}
   curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/darwin/amd64/kubectl"
   {{< /tab >}}
   {{< tab name="Apple Silicon" codelang="bash" >}}
   curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/darwin/arm64/kubectl"
   {{< /tab >}}
   {{< /tabs >}}

   {{< note >}}
   Para Descargar una versión específica reemplazar la siguiente parte del comando con la 
   versión que desea instalar `$(curl -L -s https://dl.k8s.io/release/stable.txt)`

   Por ejemplo, para descargar la versión {{< skew currentPatchVersion >}} en macOS:

   ```bash
   curl -LO "https://dl.k8s.io/release/v{{< skew currentPatchVersion >}}/bin/darwin/amd64/kubectl"
   ```

   Para macOS con procesador Apple Silicon, ejecute:

   ```bash
   curl -LO "https://dl.k8s.io/release/v{{< skew currentPatchVersion >}}/bin/darwin/arm64/kubectl"
   ```

   {{< /note >}}

1. Validación del binario (paso opcional)

   Descargar el archivo checksum:

   {{< tabs name="download_checksum_macos" >}}
   {{< tab name="Intel" codelang="bash" >}}
   curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/darwin/amd64/kubectl.sha256"
   {{< /tab >}}
   {{< tab name="Apple Silicon" codelang="bash" >}}
   curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/darwin/arm64/kubectl.sha256"
   {{< /tab >}}
   {{< /tabs >}}
  
   Validar el binario de kubectl contra el archivo checksum:

   ```bash
   echo "$(cat kubectl.sha256)  kubectl" | shasum -a 256 --check
   ```

   Si es válido va a obtener la siguiente respuesta:

   ```console
   kubectl: OK
   ```

   En caso de falla, `sha256` terminará con un estado diferente a cero con una salida similar a:

   ```console
   kubectl: FAILED
   shasum: WARNING: 1 computed checksum did NOT match
   ```

   {{< note >}}
   Descargue la misma versión del binario y el checksum.
   {{< /note >}}

1. Dar permisos de ejecución al binario.

   ```bash
   chmod +x ./kubectl
   ```

1. Mover el binario de kubectl al `PATH` de su sistema.

   ```bash
   sudo mv ./kubectl /usr/local/bin/kubectl
   sudo chown root: /usr/local/bin/kubectl
   ```

   {{< note >}}
   Asegúrese que el PATH `/usr/local/bin` forme parte de las variables de entorno.
   {{< /note >}}

1. Test para asegurar que la versión instalada está actualizada:

   ```bash
   kubectl version --client
   ```
   
   Se puede utilizar lo siguiente para una vista detallada de la versión:

   ```cmd
   kubectl version --client --output=yaml
   ```

1. Luego de instalar el plugin puede eliminar los archivos de instalación:

   ```bash
   rm kubectl kubectl.sha256
   ```

### Instalar utilizando Homebrew en macOS

Si está utilizando [Homebrew](https://brew.sh/) en macOS,
puede instalar kubectl con Homebrew.

1. Ejecute el comando para instalar:

   ```bash
   brew install kubectl
   ```

   ó

   ```bash
   brew install kubernetes-cli
   ```

1. Test para asegurar que la versión instalada está actualizada:

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
    which kubectl
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


