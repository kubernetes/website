---
reviewers:
title: Instalar y configurar kubectl en Windows
content_type: task
weight: 10
---

## {{% heading "prerequisites" %}}

Debes usar una versión de kubectl que esté dentro de una diferencia de versión menor de tu clúster. Por ejemplo, un cliente v{{< skew latestVersion >}} puede comunicarse con versiones v{{< skew prevMinorVersion >}}, v{{< skew latestVersion >}}, y v{{< skew nextMinorVersion >}} del plano de control.

El uso de la última versión de kubectl ayuda a evitar problemas imprevistos.

## Instalar kubectl en Windows

Existen los siguientes métodos para instalar kubectl en Windows:

- [Instalar el binario de kubectl con curl en Windows](#install-kubectl-binary-with-curl-on-windows)
- [Instalar en Windows usando Chocolatey, Scoop o winget](#install-on-windows-using-chocolatey-o-scoop)


### Instalar el binario de kubectl en Windows (mediante descarga directa o usando curl)

1. Tiene dos opciones para instalar kubectl en su dispositivo Windows:

   - Descarga directa:
      Descargue la última versión {{< skew currentPatchVersion >}} del binario  directamente según tu arquitectura visitando [Kubernetes release page](https://kubernetes.io/releases/download/#binaries). Asegúrese de seleccionar el binario correcto para tu arquitectura (e.g., amd64, arm64, etc.).

   - Usando curl: 

     Si tiene `curl` instalado, use este comando:

     ```powershell
     curl.exe -LO https://dl.k8s.io/release/v{{< skew currentPatchVersion >}}/bin/windows/amd64/kubectl.exe
     ```

   {{< note >}}
   Para conocer la última versión estable (por ejemplo, para secuencias de comandos), eche un vistazo a [https://dl.k8s.io/release/stable.txt](https://dl.k8s.io/release/stable.txt).
   {{< /note >}}

2. Validar el binario (opcional)

   Descargue el archivo de comprobación de kubectl:

   ```powershell
   curl.exe -LO https://dl.k8s.io/v{{< skew currentPatchVersion >}}/bin/windows/amd64/kubectl.exe.sha256
   ```

   Valide el binario kubectl con el archivo de comprobación:

   - Usando la consola del sistema para comparar manualmente la salida de `CertUtil` con el archivo de comprobación descargado:

     ```cmd
     CertUtil -hashfile kubectl.exe SHA256
     type kubectl.exe.sha256
     ```

   - Usando PowerShell puede automatizar la verificación usando el operador `-eq` para obtener un resultado de `True` o `False`:

     ```powershell
     $(Get-FileHash -Algorithm SHA256 .\kubectl.exe).Hash -eq $(Get-Content .\kubectl.exe.sha256)
     ```

3. Agregue el binario `kubectl` a su `PATH` en las variables de entorno.

4. Para asegurar que la versión de `kubectl` es la misma que descargada, ejecute:

   ```cmd
   kubectl version --client
   ```

O para una vista detallada de la versión, ejecute:
```cmd
kubectl version --client --output=yaml
```

{{< note >}}
[Docker Desktop para Windows](https://docs.docker.com/docker-for-windows/#kubernetes) agrega su propia versión de `kubectl` al `PATH`.
Si ha instalado Docker Desktop antes, es posible que deba colocar su entrada del `PATH` antes de la agregada por el instalador de Docker Desktop o elimine el `kubectl` de Docker Desktop.
{{< /note >}}

### Instalar en Windows usando Chocolatey, Scoop o winget {#install-nonstandard-package-tools}

1. Para instalar kubectl en Windows puede usar el gestor de paquetes [Chocolatey](https://chocolatey.org), 
   el instalador por línea de comandos [Scoop](https://scoop.sh) o 
   el gestor de paquetes [winget](https://docs.microsoft.com/en-us/windows/package-manager/winget/).

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


2. Para asegurarse de que la versión que instaló esté actualizada, ejecute:

   ```powershell
   kubectl version --client
   ```

3. Navegue a su directorio de inicio:

   ```powershell
   # Si estás usando cmd.exe, correr: cd %USERPROFILE%
   cd ~
   ```

4. Cree el directorio `.kube`:

   ```powershell
   mkdir .kube
   ```

5. Cambie al directorio `.kube` que acaba de crear:

   ```powershell
   cd .kube
   ```

6. Configure kubectl para usar un clúster de Kubernetes remoto:

   ```powershell
   New-Item config -type file
   ```

{{< note >}}
Edite el archivo de configuración con un editor de texto de su elección, como el Bloc de notas.
{{< /note >}}

## Verificar la configuración de kubectl

{{< include "included/verify-kubectl.md" >}}

## Plugins y configuraciones opcionales de kubectl

### Habilitar el autocompletado de shell

kubectl proporciona soporte de autocompletado para Bash, Zsh, Fish, y PowerShell, lo que puede ahorrarle mucho tiempo de escritura.

A continuación se muestran los procedimientos para configurar el autocompletado para PowerShell.

{{< include "included/optional-kubectl-configs-pwsh.md" >}}

### Instalar el plugin `kubectl-convert`

1. Descargue la última versión con el comando:

   ```powershell
   curl.exe -LO "https://dl.k8s.io/release/v{{< skew currentPatchVersion >}}/bin/windows/amd64/kubectl-convert.exe"
   ```

2. Validar el binario (opcional) 

   Descargue el archivo de comprobación `kubectl-convert`:

   ```powershell
   curl.exe -LO "https://dl.k8s.io/v{{< skew currentPatchVersion >}}/bin/windows/amd64/kubectl-convert.exe.sha256"
   ```

   Valide el binario `kubectl-convert` con el archivo de comprobación:

   - Usando la consola del sistema puede comparar manualmente la salida de `CertUtil` con el archivo de comprobación descargado:

     ```cmd
     CertUtil -hashfile kubectl-convert.exe SHA256
     type kubectl-convert.exe.sha256
     ```

   - Usando PowerShell puede automatizar la verificación usando el operador `-eq` para obtener 
      un resultado de `True` o `False`:

     ```powershell
     $($(CertUtil -hashfile .\kubectl-convert.exe SHA256)[1] -replace " ", "") -eq $(type .\kubectl-convert.exe.sha256)
     ```

3. Agregue el binario a su `PATH`.

4. Verifique que el plugin se haya instalado correctamente

   ```shell
   kubectl convert --help
   ```

   Si no ve un error, significa que el plugin se instaló correctamente.

5. Después de instalar el plugin, elimine los archivos de instalación:
   ```powershell
   del kubectl-convert.exe
   del kubectl-convert.exe.sha256
   ```

## {{% heading "whatsnext" %}}

{{< include "included/kubectl-whats-next.md" >}}