---
title: Instalar y Configurar kubectl en Linux
content_type: task
weight: 10
---

## {{% heading "prerequisites" %}}

Se debe utilizar la versión de kubectl con una minor versión de diferencia con
tu cluster. Por ejemplo, un cliente con versión v{{< skew currentVersion >}} se puede comunicar
con las siguientes versiones de plano de control v{{< skew currentVersionAddMinor -1 >}}, 
v{{< skew currentVersionAddMinor 0 >}} y v{{< skew currentVersionAddMinor 1 >}}.
Utilizar la última versión compatible de kubectl evita posibles errores.

## Instalar kubectl en Linux

Existen los siguientes métodos para instalar kubectl en Linux:

- [Instalación del binario para Linux de kubectl con Curl](#instalación-del-binario-para-linux-de-kubectl-con-curl)
- [Instalación mediante el administrador de paquetes nativo](#instalación-mediante-el-administrador-de-paquetes-nativo)
- [Instalación usando otro administrador de paquetes](#instalación-usando-otro-administrador-de-paquetes)

### Instalación del binario para Linux de kubectl con Curl

1. Descargar la última versión con el siguiente comando:

   {{< tabs name="download_binary_linux" >}}
   {{< tab name="x86-64" codelang="bash" >}}
   curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
   {{< /tab >}}
   {{< tab name="ARM64" codelang="bash" >}}
   curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/arm64/kubectl"
   {{< /tab >}}
   {{< /tabs >}}

   {{< note >}}
   Para descargar una versión específica reemplaza la siguiente parte del comando con la 
   versión que desea instalar `$(curl -L -s https://dl.k8s.io/release/stable.txt)`

   Por ejemplo, para descargar la versión {{< skew currentPatchVersion >}} en linux x86-64:

   ```bash
   curl -LO https://dl.k8s.io/release/v{{< skew currentPatchVersion >}}/bin/linux/amd64/kubectl
   ```

   Y para Linux ARM64:

   ```bash
   curl -LO https://dl.k8s.io/release/v{{< skew currentPatchVersion >}}/bin/linux/arm64/kubectl
   ```

   {{< /note >}}

1. Validación del binario (paso opcional)

   Descargar el archivo checksum:

   {{< tabs name="download_checksum_linux" >}}
   {{< tab name="x86-64" codelang="bash" >}}
   curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl.sha256"
   {{< /tab >}}
   {{< tab name="ARM64" codelang="bash" >}}
   curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/arm64/kubectl.sha256"
   {{< /tab >}}
   {{< /tabs >}}

   Validar el binario de kubectl contra el archivo checksum:

   ```bash
   echo "$(cat kubectl.sha256)  kubectl" | sha256sum --check
   ```

   Si es válido, va a obtener la siguiente respuesta:

   ```console
   kubectl: OK
   ```

   En caso de falla, `sha256` terminará con un estado diferente a cero con una salida similar a:

   ```console
   kubectl: FAILED
   sha256sum: WARNING: 1 computed checksum did NOT match
   ```

   {{< note >}}
   Descarga la misma versión del binario y el checksum.
   {{< /note >}}

1. Instalar kubectl

   ```bash
   sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl
   ```

   {{< note >}}
   Si no tienes acceso root en el sistema donde se busca instalar, puedes colocar
   el binario kubectl en el directorio `~/.local/bin`:

   ```bash
   chmod +x kubectl
   mkdir -p ~/.local/bin
   mv ./kubectl ~/.local/bin/kubectl
   # Y después agrega el directorio ~/.local/bin a tu $PATH
   ```

   {{< /note >}}

1. Test para asegurar que la versión instalada está actualizada:

   ```bash
   kubectl version --client
   ```

   O puedes utilizar lo siguiente para una vista detallada de la versión:

   ```cmd
   kubectl version --client --output=yaml
   ```

### Instalación mediante el administrador de paquetes nativo

{{< tabs name="kubectl_install" >}}
{{% tab name="Debian-based distributions" %}}

1. Actualiza el índice del paquete `apt`, luego instala los paquetes necesarios para Kubernetes:

   ```shell
   sudo apt-get update
   # apt-transport-https may be a dummy package; if so, you can skip that package
   sudo apt-get install -y apt-transport-https ca-certificates curl gnupg
   ```

2. Descarga la llave pública firmada para los repositorios de Kubernetes. La misma llave firmada es usada para todos los repositorios por lo que se puede obviar la versión en la URL:

   ```shell
   curl -fsSL https://pkgs.k8s.io/core:/stable:/{{< param "version" >}}/deb/Release.key | sudo gpg --dearmor -o /etc/apt/keyrings/kubernetes-apt-keyring.gpg
   ```

3. Agregar el repositorio apropiado de Kubernetes. Si quieres una versión de Kubernetes diferente a {{< param "version" >}},
   reemplace {{< param "version" >}} con la versión deseada en el siguiente comando:

   ```shell
   # Esto sobrescribe cualquier configuración existente en el archivo /etc/apt/sources.list.d/kubernetes.list
   echo 'deb [signed-by=/etc/apt/keyrings/kubernetes-apt-keyring.gpg] https://pkgs.k8s.io/core:/stable:/{{< param "version" >}}/deb/ /' | sudo tee /etc/apt/sources.list.d/kubernetes.list
   ```

{{< note >}}
Para actualizar kubectl a una minor release diferente, se debe reemplazar la versión en el archivo `/etc/apt/sources.list.d/kubernetes.list` antes de ejecutar `apt-get update` y `apt-get upgrade`. Este procedimiento se describe con más detalle en [Cambiando el Repositorio de Kubernetes](/docs/tasks/administer-cluster/kubeadm/change-package-repository/).
{{< /note >}}

4. Actualiza el índice de `apt`, luego instala kubectl:

   ```shell
   sudo apt-get update
   sudo apt-get install -y kubectl
   ```

{{< note >}}
En versiones anteriores a Debian 12 y Ubuntu 22.04 el directorio `/etc/apt/keyrings` no existe por defecto, puede ser creado usando el comando `sudo mkdir -m 755 /etc/apt/keyrings`
{{< /note >}}

{{% /tab %}}

{{% tab name="Red Hat-based distributions" %}}

1. Agregar Kubernetes al repositorio `yum`. Si deseas usar una versión de Kubernetes
   diferente a {{< param "version" >}}, reemplaza {{< param "version" >}} con
   la versión deseada en el siguiente comando:

   ```bash
   # Lo siguiente reemplaza cualquier configuración existente en /etc/yum.repos.d/kubernetes.repo
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
Para actualizar kubectl a otra versión, será necesario modificar la versión en `/etc/yum.repos.d/kubernetes.repo`
antes de ejecutar `yum update`. Este procedimiento se describe con más detalle en [Changing The Kubernetes Package Repository](/docs/tasks/administer-cluster/kubeadm/change-package-repository/).
{{< /note >}}

2. Instalar kubectl utilizando `yum`:

   ```bash
   sudo yum install -y kubectl
   ```

{{% /tab %}}

{{% tab name="SUSE-based distributions" %}}

1. Agregar Kubernetes al repositorio `zypper`. Si deseas usar una versión de Kubernetes
   diferente a {{< param "version" >}}, reemplaza {{< param "version" >}} con
   la versión deseada en el siguiente comando:

   ```bash
   # Lo siguiente reemplaza cualquier configuración existente en /etc/zypp/repos.d/kubernetes.repo
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
Para actualizar kubectl a otra versión será necesario modificar la versión en `/etc/zypp/repos.d/kubernetes.repo`
antes de ejecutar `zypper update`. Este procedimiento se describe con más detalle en [Changing The Kubernetes Package Repository](/docs/tasks/administer-cluster/kubeadm/change-package-repository/).
{{< /note >}}

   2. Instalar kubectl usando `zypper`:

      ```bash
      sudo zypper install -y kubectl
      ```

{{% /tab %}}
{{< /tabs >}}

### Instalación usando otro administrador de paquetes

{{< tabs name="other_kubectl_install" >}}
{{% tab name="Snap" %}}
Si utilizas Ubuntu o alguna distribución que soporte el administrador de
páquetes [snap](https://snapcraft.io/docs/core/install), kubectl
está disponible como una aplicación de [snap](https://snapcraft.io/).

```shell
snap install kubectl --classic
kubectl version --client
```

{{% /tab %}}

{{% tab name="Homebrew" %}}
Si utilizas [Homebrew](https://docs.brew.sh/Homebrew-on-Linux) en Linux,
kubectl está disponible para su [instalación](https://docs.brew.sh/Homebrew-on-Linux#install).

```shell
brew install kubectl
kubectl version --client
```

{{% /tab %}}

{{< /tabs >}}

## Verificar la configuración de kubectl

{{< include "included/verify-kubectl.md" >}}

## Configuraciones opcionales y plugins de kubectl

### Habilitar el autocompletado en la shell

Kubectl tiene soporte para autocompletar en Bash, Zsh, Fish y Powershell,
lo que puede agilizar el tipeo.

A continuación están los procedimientos para configurarlo en Bash, Fish y Zsh.

{{< tabs name="kubectl_autocompletion" >}}
{{< tab name="Bash" include="included/optional-kubectl-configs-bash-linux.md" />}}
{{< tab name="Fish" include="included/optional-kubectl-configs-fish.md" />}}
{{< tab name="Zsh" include="included/optional-kubectl-configs-zsh.md" />}}
{{< /tabs >}}

### Instalar el plugin `kubectl convert`

{{< include "included/kubectl-convert-overview.md" >}}

1. Descarga la última versión con el siguiente comando:

   {{< tabs name="download_convert_binary_linux" >}}
   {{< tab name="x86-64" codelang="bash" >}}
   curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl-convert"
   {{< /tab >}}
   {{< tab name="ARM64" codelang="bash" >}}
   curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/arm64/kubectl-convert"
   {{< /tab >}}
   {{< /tabs >}}

1. Valida el binario (opcional)

   Descarga el checksum de kubectl-convert:

   {{< tabs name="download_convert_checksum_linux" >}}
   {{< tab name="x86-64" codelang="bash" >}}
   curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl-convert.sha256"
   {{< /tab >}}
   {{< tab name="ARM64" codelang="bash" >}}
   curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/arm64/kubectl-convert.sha256"
   {{< /tab >}}
   {{< /tabs >}}

   Ahora se puede validar el binario utilizando el checksum:

   ```bash
   echo "$(cat kubectl-convert.sha256) kubectl-convert" | sha256sum --check
   ```

   Si es válido, la salida será:

   ```console
   kubectl-convert: OK
   ```

   En caso de falla, `sha256` terminará con un estado diferente a cero con una salida similar a esta:

   ```console
   kubectl-convert: FAILED
   sha256sum: WARNING: 1 computed checksum did NOT match
   ```

   {{< note >}}
   Descargue la misma versión del binario y del checksum.
   {{< /note >}}

1. Instalar kubectl-convert

   ```bash
   sudo install -o root -g root -m 0755 kubectl-convert /usr/local/bin/kubectl-convert
   ```

1. Verificar si el plugin fue instalado correctamente

   ```shell
   kubectl convert --help
   ```

   Si no visualizas ningún error quiere decir que el plugin fue instalado correctamente.

1. Después de instalar el plugin elimina los archivos de instalación:

   ```bash
   rm kubectl-convert kubectl-convert.sha256
   ```

## {{% heading "whatsnext" %}}

{{< include "included/kubectl-whats-next.md" >}}
