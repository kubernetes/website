---
reviewers:
title: Instalar y configurar kubectl en Linux
content_type: task
weight: 10
card:
  name: tasks
  weight: 20
  title: Instalar kubectl en Linux
---

## {{% heading "prerequisites" %}}

Debes usar una versión de kubectl que esté dentro de una diferencia de versión menor de tu clúster. Por ejemplo, un v{{< skew latestVersion >}} La cliente puede comunicarse con v{{< skew prevMinorVersion >}}, v{{< skew latestVersion >}}, y v{{< skew nextMinorVersion >}} aviones de control.
El uso de la última versión de kubectl ayuda a evitar problemas imprevistos.

## Instalar kubectl en Linux

Existen los siguientes métodos para instalar kubectl en Linux:

- [Instale kubectl binary con curl en Linux](#install-kubectl-binary-with-curl-on-linux)
- [Instalar usando la administración de paquetes nativa](#install-using-native-package-management)
- [Instalar usando otra administración de paquetes](#install-using-other-package-management)

### Instale kubectl binary con curl en Linux

1. Descargue la última versión con el comando:

   ```bash
   curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
   ```

   {{< note >}}
Para descargar una versión específica, reemplace el `$(curl -L -s https://dl.k8s.io/release/stable.txt)` parte del comando con la versión específica.

Por ejemplo, para descargar la versión {{< param "fullversion" >}} en Linux, escriba:

   ```bash
   curl -LO https://dl.k8s.io/release/{{< param "fullversion" >}}/bin/linux/amd64/kubectl
   ```
   {{< /note >}}

1. Validar el binario (opcional)

   Descargue el archivo de suma de comprobación de kubectl:

   ```bash
   curl -LO "https://dl.k8s.io/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl.sha256"
   ```

   Valide el binario kubectl con el archivo de suma de comprobación:

   ```bash
   echo "$(<kubectl.sha256) kubectl" | sha256sum --check
   ```

   Si es válido, la salida es:

   ```console
   kubectl: OK
   ```

   Si la comprobación falla, `sha256` sale con un estado distinto de cero e imprime una salida similar a:

   ```bash
   kubectl: FAILED
   sha256sum: WARNING: 1 computed checksum did NOT match
   ```

   {{< note >}}
   Descargue la misma versión del binario y la suma de comprobación.
   {{< /note >}}

1. Instalar kubectl

   ```bash
   sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl
   ```

   {{< note >}}
   Si no tiene acceso de root en el sistema de destino, aún puede instalar kubectl en el `~/.local/bin` directorio:

   ```bash
   chmod +x kubectl
   mkdir -p ~/.local/bin/kubectl
   mv ./kubectl ~/.local/bin/kubectl
   # y luego agrega ~/.local/bin/kubectl para $PATH
   ```

   {{< /note >}}

1. Pruebe para asegurarse de que la versión que instaló esté actualizada:

   ```bash
   kubectl version --client
   ```

### Instalar usando la administración de paquetes nativa

{{< tabs name="kubectl_install" >}}
{{% tab name="Debian-based distributions" %}}

1. Actualizar el `apt` índice de paquetes e instale los paquetes necesarios para usar Kubernetes `apt` repositorio:

   ```shell
   sudo apt-get update
   sudo apt-get install -y apt-transport-https ca-certificates curl
   ```

2. Descargue la clave de firma pública de Google Cloud:

   ```shell
   sudo curl -fsSLo /usr/share/keyrings/kubernetes-archive-keyring.gpg https://packages.cloud.google.com/apt/doc/apt-key.gpg
   ```

3. Agregue el repositorio `apt` de Kubernetes:

   ```shell
   echo "deb [signed-by=/usr/share/keyrings/kubernetes-archive-keyring.gpg] https://apt.kubernetes.io/ kubernetes-xenial main" | sudo tee /etc/apt/sources.list.d/kubernetes.list
   ```

4. Actualice el índice del paquete `apt` con el nuevo repositorio e instale kubectl:

   ```shell
   sudo apt-get update
   sudo apt-get install -y kubectl
   ```

{{% /tab %}}

{{< tab name="Red Hat-based distributions" codelang="bash" >}}
cat <<EOF > /etc/yum.repos.d/kubernetes.repo
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

### Instalar usando otra administración de paquetes

{{< tabs name="other_kubectl_install" >}}
{{% tab name="Snap" %}}
Si está en Ubuntu u otra distribución de Linux que admita [snap](https://snapcraft.io/docs/core/install) administrador de paquetes, kubectl está disponible como [snap](https://snapcraft.io/) solicitud.

```shell
snap install kubectl --classic
kubectl version --client
```

{{% /tab %}}

{{% tab name="Homebrew" %}}
Si está en Linux y usa [Homebrew](https://docs.brew.sh/Homebrew-on-Linux) administrador de paquetes, kubectl está disponible para [installation](https://docs.brew.sh/Homebrew-on-Linux#install).

```shell
brew install kubectl
kubectl version --client
```

{{% /tab %}}

{{< /tabs >}}

## Verificar la configuración de kubectl

{{< include "included/verify-kubectl.md" >}}

## Complementos y configuraciones opcionales de kubectl

### Habilitar el autocompletado de shell

kubectl proporciona soporte de autocompletado para Bash y Zsh, lo que puede ahorrarle mucho escribir.

A continuación, se muestran los procedimientos para configurar el autocompletado para Bash y Zsh.

{{< tabs name="kubectl_autocompletion" >}}
{{< tab name="Bash" include="included/optional-kubectl-configs-bash-linux.md" />}}
{{< tab name="Zsh" include="included/optional-kubectl-configs-zsh.md" />}}
{{< /tabs >}}

### Instalar en pc `kubectl convert` enchufar

{{< include "included/kubectl-convert-overview.md" >}}

1. Descargue la última versión con el comando:

   ```bash
   curl -LO https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl-convert
   ```

1. Validar el binario (opcional)

   Descargue el archivo de suma de comprobación kubectl-convert:

   ```bash
   curl -LO "https://dl.k8s.io/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl-convert.sha256"
   ```

   Valide el binario kubectl-convert con el archivo de suma de comprobación:

   ```bash
   echo "$(<kubectl-convert.sha256) kubectl-convert" | sha256sum --check
   ```

   Si es válido, la salida es:

   ```console
   kubectl-convert: OK
   ```

   Si la comprobación falla, `sha256` sale con un estado distinto de cero e imprime una salida similar a:

   ```bash
   kubectl-convert: FAILED
   sha256sum: WARNING: 1 computed checksum did NOT match
   ```

   {{< note >}}
   Descargue la misma versión del binario y la suma de comprobación.
   {{< /note >}}

1. Instalar en pc kubectl-convert

   ```bash
   sudo install -o root -g root -m 0755 kubectl-convert /usr/local/bin/kubectl-convert
   ```

1. Verifique que el complemento se haya instalado correctamente

   ```shell
   kubectl convert --help
   ```

   Si no ve un error, significa que el complemento se instaló correctamente.

## {{% heading "whatsnext" %}}

{{< include "included/kubectl-whats-next.md" >}}