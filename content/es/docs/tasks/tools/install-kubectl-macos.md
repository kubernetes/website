---
title: Instalar y Configurar kubectl en macOS
content_type: task
weight: 10
---

## {{% heading "prerequisites" %}}

Se debe utilizar la versión de kubectl con la menor diferencia de versión de respecto de 
su clúster. Por ejemplo, un cliente con versión v{{< skew currentVersion >}} se puede comunicar
con los siguientes versiones de plano de control v{{< skew currentVersionAddMinor -1 >}}, 
v{{< skew currentVersionAddMinor 0 >}}, and v{{< skew currentVersionAddMinor 1 >}}.
Utilizar la última versión compatible de kubectl evita posibles errores.

## Instalar kubectl en macOS

Existen los siguientes métodos para instalar kubectl en macOS:

- [Instalar kubectl en macOS](#instalar-kubectl-en-macos)
  - [Instalación del binario para macOS con Curl](#instalación-del-binario-para-macos-de-kubectl-con-curl)
  - [Instalar con Homebrew en macOS](#instalar-utilizando-homebrew-en-macos)
  - [Instalar con Macports en macOS](#instalar-con-macports-en-macos)
- [Verificar la configuración de kubectl](#verificar-la-configuración-de-kubectl)
- [Configuraciones y plugins opcionales para kubectl](#configuraciones-opcionales-y-plugins-de-kubectl)
  - [Habilitar el autocompletado de la shell](#habilitar-el-autocompletado-en-la-shell)
  - [Instalar el plugin `kubectl convert`](#instalar-el-plugin-kubectl-convert)

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
   Para descargar una versión específica, reemplaza la siguiente parte del comando con la 
   versión que deseas instalar `$(curl -L -s https://dl.k8s.io/release/stable.txt)`

   Por ejemplo, para descargar la versión {{< skew currentPatchVersion >}} en macOS:

   ```bash
   curl -LO "https://dl.k8s.io/release/v{{< skew currentPatchVersion >}}/bin/darwin/amd64/kubectl"
   ```

   Para macOS con procesador Apple Silicon, ejecuta:

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

   Si es válido, vas a obtener la siguiente respuesta:

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

1. Mover el binario de kubectl al `PATH` de tu sistema.

   ```bash
   sudo mv ./kubectl /usr/local/bin/kubectl
   sudo chown root: /usr/local/bin/kubectl
   ```

   {{< note >}}
   Asegúrate que el PATH `/usr/local/bin` forme parte de las variables de entorno.
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

### Instalar con Macports en macOS

Si esta en macOS y utiliza [Macports](https://macports.org/),
puedes instalar kubectl con Macports.

1. Ejecute  el comando para instalar:

   ```bash
   sudo port selfupdate
   sudo port install kubectl
   ```

1. Test para asegurar que la versión instalada está actualizada:

   ```bash
   kubectl version --client
   ```

## Verificar la configuración de kubectl

{{< include "included/verify-kubectl.md" >}}

## Configuraciones opcionales y plugins de kubectl

### Habilitar el autocompletado en la shell

Kubectl tiene soporte para autocompletar en Bash, Zsh, Fish y Powershell,
lo que puede agilizar el tipeo.

A continuación están los procedimientos para configurarlo en Bash, Fisch y Zsh.

{{< tabs name="kubectl_autocompletion" >}}
{{< tab name="Bash" include="included/optional-kubectl-configs-bash-mac.md" />}}
{{< tab name="Fish" include="included/optional-kubectl-configs-fish.md" />}}
{{< tab name="Zsh" include="included/optional-kubectl-configs-zsh.md" />}}
{{< /tabs >}}

### Instalar el plugin `kubectl convert`

{{< include "included/kubectl-convert-overview.md" >}}

1. Descarga la última versión con el siguiente comando:

   {{< tabs name="download_convert_binary_macos" >}}
   {{< tab name="Intel" codelang="bash" >}}
   curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/darwin/amd64/kubectl-convert"
   {{< /tab >}}
   {{< tab name="Apple Silicon" codelang="bash" >}}
   curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/darwin/arm64/kubectl-convert"
   {{< /tab >}}
   {{< /tabs >}}

1. Valide el binario (opcional)

   Descargue el checksum de kubectl-convert:

   {{< tabs name="download_convert_checksum_macos" >}}
   {{< tab name="Intel" codelang="bash" >}}
   curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/darwin/amd64/kubectl-convert.sha256"
   {{< /tab >}}
   {{< tab name="Apple Silicon" codelang="bash" >}}
   curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/darwin/arm64/kubectl-convert.sha256"
   {{< /tab >}}
   {{< /tabs >}}

   Ahora se puede validar el binario utilizando el checksum:

   ```bash
   echo "$(cat kubectl-convert.sha256)  kubectl-convert" | shasum -a 256 --check
   ```

   Si es válido, la salida será:

   ```console
   kubectl-convert: OK
   ```

   En caso de falla, `sha256` terminará con un estado diferente a cero con una salida similar a esta:

   ```console
   kubectl-convert: FAILED
   shasum: WARNING: 1 computed checksum did NOT match
   ```

   {{< note >}}
   Descargue la misma versión del binario y del checksum.
   {{< /note >}}

1. Dar permisos de ejecución al binario.

   ```bash
   chmod +x ./kubectl-convert
   ```

1. Mover el binario de kubectl al `PATH` de su sistema.

   ```bash
   sudo mv ./kubectl-convert /usr/local/bin/kubectl-convert
   sudo chown root: /usr/local/bin/kubectl-convert
   ```

   {{< note >}}
   Asegúrese que el PATH `/usr/local/bin` forme parte de las variables de entorno.
   {{< /note >}}

1. Verificar si el plugin fue instalado correctamente

   ```shell
   kubectl convert --help
   ```

   Si no visualiza ningún error quiere decir que el plugin fue instalado correctamente.

1. Después de instalar el plugin elimine los archivos de instalación:

   ```bash
   rm kubectl-convert kubectl-convert.sha256
   ```

### Eliminar kubectl en macOS

Dependiendo de como haya instalado `kubectl` puede utilizar uno de los siguientes métodos.

### Eliminar kubectl usando la linea de comandos

1.  Ubique el binario de `kubectl` en su sistema:

    ```bash
    which kubectl
    ```

1.  Elimine el binario de `kubectl`:

    ```bash
    sudo rm <path>
    ```
    Reemplace `<path>` con el path que apunta al binario de `kubectl` del paso anterior. Por ejemplo, `sudo rm /usr/local/bin/kubectl`

### Eliminar kubectl utilizando homebrew

Si instaló `kubectl` utilizando Homebrew ejecute el siguiente comando:

```bash
brew remove kubectl
```
  
## {{% heading "whatsnext" %}}

{{< include "included/kubectl-whats-next.md" >}}
