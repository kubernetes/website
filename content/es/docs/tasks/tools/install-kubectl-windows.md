---
reviewers:
- mikedanese
title: Instalar y configurar kubectl en Windows
content_type: tarea
weight: 10
card:
  name: Tareas
  weight: 20
  title: Instalar kubectl en Windows
---

## {{% heading "prerequisites" %}}

Debes utilizar una versión de kubectl que esté dentro de una diferencia de una versión menor de tu clúster. Por ejemplo, un cliente v{{<skew currentVersion>}} puede comunicarse con planes de control v{{<skew currentVersionAddMinor -1>}}, v{{<skew currentVersionAddMinor 0>}} y v{{<skew currentVersionAddMinor 1>}}.
Usar la última versión compatible de kubectl ayuda a evitar problemas imprevistos.

## Instalar kubectl en Windows

Existen los siguientes métodos para instalar kubectl en Windows:

- [Instalar kubectl binary con curl en Windows](#install-kubectl-binary-with-curl-on-windows)
- [Instalar en Windows usando Chocolatey, Scoop o winget](#install-nonstandard-package-tools)

### Instalar kubectl binary con curl en Windows

1. Descargue lo último {{< skew currentVersion >}} Versión del parche:
   [kubectl {{< skew currentPatchVersion >}}](https://dl.k8s.io/release/v{{< skew currentPatchVersion >}}/bin/windows/amd64/kubectl.exe).

   O si tiene `curl` instalado, use este comando:

   ```powershell
   curl.exe -LO "https://dl.k8s.io/release/v{{< skew currentPatchVersion >}}/bin/windows/amd64/kubectl.exe"
   ```

   {{< note >}}
   Para conocer la última versión estable (por ejemplo, para scripting), eche un vistazo a
   [https://dl.k8s.io/release/stable.txt](https://dl.k8s.io/release/stable.txt).
   {{< /note >}}

1. Validar el binario (opcional)

    Descargue el archivo de suma de comprobación `kubectl`:

   ```powershell
   curl.exe -LO "https://dl.k8s.io/v{{< skew currentPatchVersion >}}/bin/windows/amd64/kubectl.exe.sha256"
   ```

   Valide el binario `kubectl` con el archivo de suma de comprobación:

   - Usando el símbolo del sistema para comparar manualmente la salida de 'CertUtil' con el archivo de suma de comprobación descargado:

     ```cmd
     CertUtil -hashfile kubectl.exe SHA256
     type kubectl.exe.sha256
     ```

   - Usar PowerShell para automatizar la verificación mediante el operador `-eq` para
     obtener un resultado `Verdadero` o `Falso`:

     ```powershell
      $(Get-FileHash -Algorithm SHA256 .\kubectl.exe).Hash -eq $(Get-Content .\kubectl.exe.sha256)
     ```

1. Agrega o coloca la carpeta del ejecutable de `kubectl` al principio o al final de la variable de entorno `PATH`.

1. Realiza una prueba para asegurarte de que la versión de `kubectl` sea la misma que la descargada.

   ```cmd
   kubectl version --client
   ```

   {{< note >}}
   El comando anterior generará una advertencia:

   ```
   WARNING: This version information is deprecated and will be replaced with the output from kubectl version --short.
   ```

   Puedes ignorar esta advertencia. Solo estás verificando la versión de `kubectl` que tienes instalada.
   {{< /note >}}
   
   O use esto para una vista detallada de la versión:

   ```cmd
   kubectl version --client --output=yaml
   ```



{{< note >}}
[Docker Desktop Para Windows](https://docs.docker.com/docker-for-windows/#kubernetes)
agrega su propia versión de `Kubectl` a` ruta '.Si ha instalado Docker Desktop antes,
Es posible que deba colocar su entrada de 'ruta' antes de la que agregó el escritorio Docker
instalador o eliminar el `kubectl` del escritorio Docker.
{{< /note >}}

### Instalar en Windows usando Chocolatey, Scoop, or winget {#install-nonstandard-package-tools}

1. Para instalar kubectl en Windows puede usar [Chocolatey](https://chocolatey.org)
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

1. Pruebe para asegurarse de que la versión que instaló esté actualizada:

   ```powershell
   kubectl version --client
   ```

1. Navegue a su directorio de inicio:

   ```powershell
   # If you're using cmd.exe, run: cd %USERPROFILE%
   cd ~
   ```

1. Cree el directorio `.kube`:

   ```powershell
   mkdir .kube
   ```

1. Cambiar al directorio `.kube` que acabas de crear:

   ```powershell
   cd .kube
   ```

1. Configurar Kubectl para usar un clúster remoto de Kubernetes:

   ```powershell
   New-Item config -type file
   ```

{{< note >}}
Edite el archivo de configuración con un editor de texto de su elección, como el bloc de notas.
{{< /note >}}

## Verificar la configuración de Kubectl

{{< include "included/verify-kubectl.md" >}}

## Configuraciones y complementos opcionales de Kubectl

### Habilitar el autocompleto de shell

Kubectl proporciona soporte de autocompletación para Bash, ZSH, Fish y PowerShell,
lo que puede ahorrarle mucha escritura.

A continuación se presentan los procedimientos para configurar Autocompletación para PowerShell.

{{< include "included/optional-kubectl-configs-pwsh.md" >}}

### Instalar el complemento `Kubectl Convert`

{{< include "included/kubectl-convert-overview.md" >}}

1. Descargue el último lanzamiento con el comando:

   ```powershell
   curl.exe -LO "https://dl.k8s.io/release/v{{< skew currentPatchVersion >}}/bin/windows/amd64/kubectl-convert.exe"
   ```

1. Validar el binario (opcional).

   Descargue el archivo de suma de verificación `Kubectl-Convert`:

   ```powershell
   curl.exe -LO "https://dl.k8s.io/v{{< skew currentPatchVersion >}}/bin/windows/amd64/kubectl-convert.exe.sha256"
   ```

   Valide el binario `Kubectl-Convert` contra el archivo de suma de verificación:

   - Uso del símbolo del sistema para comparar manualmente la salida de `certutil` con el archivo de suma de verificación descargado:

     ```cmd
     CertUtil -hashfile kubectl-convert.exe SHA256
     type kubectl-convert.exe.sha256
     ```

   - Uso de PowerShell para automatizar la verificación utilizando el operador `-eq` para obtener
     un resultado `verdadero 'o` falso':

     ```powershell
     $($(CertUtil -hashfile .\kubectl-convert.exe SHA256)[1] -replace " ", "") -eq $(type .\kubectl-convert.exe.sha256)
     ```

1.Agregue o prependa la carpeta binaria `Kubectl-Convert` a su variable de entorno` ruta '.

1. Verifique que el complemento se instale correctamente.

   ```shell
   kubectl convert --help
   ```

   Si no ve un error, significa que el complemento se instala correctamente.

1. Después de instalar el complemento, limpie los archivos de instalación:

   ```powershell
   del kubectl-convert.exe kubectl-convert.exe.sha256
   ```

## {{% heading "whatsnext" %}}

{{< include "included/kubectl-whats-next.md" >}}
