---
reviewers:
title: Instalar y configurar kubectl en Windows
content_type: task
weight: 10
card:
  name: tasks
  weight: 20
  title: Instalar kubectl en Windows
---

## {{% heading "prerequisites" %}}

Debes usar una versión de kubectl que este dentro de una diferencia de versión menor de tu clúster. Por ejemplo, un cliente v{{< skew latestVersion >}} puede comunicarse con versiones v{{< skew prevMinorVersion >}}, v{{< skew latestVersion >}}, y v{{< skew nextMinorVersion >}} del plano de control.

El uso de la última versión de kubectl ayuda a evitar problemas imprevistos.

## Instalar kubectl en Windows

Existen los siguientes métodos para instalar kubectl en Windows:

- [Instalar el binario de kubectl con curl en Windows](#install-kubectl-binary-with-curl-on-windows)
- [Instalar en Windows usando Chocolatey o Scoop](#install-on-windows-using-chocolatey-or-scoop)


### Instalar el binario de kubectl con curl en Windows

1. Descarga la [última versión {{< skew currentPatchVersion >}}](https://dl.k8s.io/release/v{{< skew currentPatchVersion >}}/bin/windows/amd64/kubectl.exe).

   O si tiene `curl` instalado, use este comando:

   ```powershell
   curl -LO https://dl.k8s.io/release/v{{% skew currentPatchVersion %}}/bin/windows/amd64/kubectl.exe
   ```

   {{< note >}}
   Para conocer la última versión estable (por ejemplo, para secuencias de comandos), eche un vistazo a [https://dl.k8s.io/release/stable.txt](https://dl.k8s.io/release/stable.txt).
   {{< /note >}}

1. Validar el binario (opcional)

   Descargue el archivo de comprobación de kubectl:

   ```powershell
   curl -LO https://dl.k8s.io/v{{% skew currentPatchVersion %}}/bin/windows/amd64/kubectl.exe.sha256
   ```

   Valide el binario kubectl con el archivo de comprobación:

   - Usando la consola del sistema para comparar manualmente la salida de `CertUtil` con el archivo de comprobación descargado:

     ```cmd
     CertUtil -hashfile kubectl.exe SHA256
     type kubectl.exe.sha256
     ```

   - Usando PowerShell puede automatizar la verificación usando el operador `-eq` para obtener un resultado de `True` o `False`:

     ```powershell
      $(Get-FileHash -Algorithm SHA256 .\kubectl.exe).Hash -eq $(Get-Content .\kubectl.exe.sha256))
     ```

1. Agregue el binario a su `PATH`.

1. Para asegurar que la versión de`kubectl` es la misma que descargada, ejecute:

   ```cmd
   kubectl version --client
   ```

{{< note >}}
[Docker Desktop para Windows](https://docs.docker.com/docker-for-windows/#kubernetes) agrega su propia versión de `kubectl` a el `PATH`.
Si ha instalado Docker Desktop antes, es posible que deba colocar su entrada en el `PATH` antes de la agregada por el instalador de Docker Desktop o elimine el `kubectl`.
{{< /note >}}

### Instalar en Windows usando Chocolatey o Scoop

1. Para instalar kubectl en Windows, puede usar [Chocolatey](https://chocolatey.org) 
como administrador de paquetes o el instalador [Scoop](https://scoop.sh) desde línea de comandos.

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


1. Para asegurarse de que la versión que instaló esté actualizada, ejecute:

   ```powershell
   kubectl version --client
   ```

1. Navegue a su directorio de inicio:

   ```powershell
   # Si estas usando cmd.exe, correr: cd %USERPROFILE%
   cd ~
   ```

1. Cree el directorio `.kube`:

   ```powershell
   mkdir .kube
   ```

1. Cambie al directorio `.kube` que acaba de crear:

   ```powershell
   cd .kube
   ```

1. Configure kubectl para usar un clúster de Kubernetes remoto:

   ```powershell
   New-Item config -type file
   ```

{{< note >}}
Edite el archivo de configuración con un editor de texto de su elección, como el Bloc de notas.
{{< /note >}}

## Verificar la configuración de kubectl

{{< include "verify-kubectl.md" >}}

## Plugins y configuraciones opcionales de kubectl

### Habilitar el autocompletado de shell

kubectl proporciona soporte de autocompletado para Bash y Zsh, lo que puede ahorrarle mucho tiempo al escribir.

A continuación se muestran los procedimientos para configurar el autocompletado para Zsh, si lo está ejecutando en Windows.

{{< include "optional-kubectl-configs-zsh.md" >}}

### Instalar el plugin `kubectl-convert`

{{< include "kubectl-convert-overview.md" >}}

1. Descargue la última versión con el comando:

   ```powershell
   curl -LO https://dl.k8s.io/release/v{{% skew currentPatchVersion %}}/bin/windows/amd64/kubectl-convert.exe
   ```

1. Validar el binario (opcional)

   Descargue el archivo de comprobación kubectl-convert:

   ```powershell
   curl -LO https://dl.k8s.io/v{{% skew currentPatchVersion %}}/bin/windows/amd64/kubectl-convert.exe.sha256
   ```

   Valide el binario kubectl-convert con el archivo de comprobación:

   - Usando la consola del sistema puede comparar manualmente la salida de `CertUtil` con el archivo de comprobación descargado:

     ```cmd
     CertUtil -hashfile kubectl-convert.exe SHA256
     type kubectl-convert.exe.sha256
     ```

   - Usando PowerShell puede automatizar la verificación usando el operador `-eq` 
     para obtener un resultado de `True` o `False`:

     ```powershell
     $($(CertUtil -hashfile .\kubectl-convert.exe SHA256)[1] -replace " ", "") -eq $(type .\kubectl-convert.exe.sha256)
     ```

1. Agregue el binario a su `PATH`.

1. Verifique que el plugin se haya instalado correctamente

   ```shell
   kubectl convert --help
   ```

   Si no ve un error, significa que el plugin se instaló correctamente.

## {{% heading "whatsnext" %}}

{{< include "kubectl-whats-next.md" >}}