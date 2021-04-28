---
title: Instalar y Configurar kubectl
content_type: task
weight: 10
card:
  name: tasks
  weight: 20
  title: Instalar kubectl
---

<!-- overview -->
Usa la herramienta de línea de comandos de Kubernetes, [kubectl](/docs/reference/kubectl/kubectl/), para desplegar y gestionar aplicaciones en Kubernetes. Usando kubectl, puedes inspeccionar recursos del clúster; crear, eliminar, y actualizar componentes; explorar tu nuevo clúster; y arrancar aplicaciones de ejemplo. Para ver la lista completa de operaciones de kubectl, se puede ver [el resumen de kubectl](/docs/reference/kubectl/overview/).


## {{% heading "prerequisites" %}}

Debes usar una versión de kubectl que esté a menos de una versión menor de diferencia con tu clúster. Por ejemplo, un cliente v1.2 debería funcionar con un máster v1.1, v1.2, y v1.3. Usar la última versión de kubectl ayuda a evitar problemas inesperados.



<!-- steps -->

## Instalar kubectl en Linux

### Instalar el binario de kubectl con curl en Linux

1. Descargar la última entrega:

    ```
    curl -LO "https://storage.googleapis.com/kubernetes-release/release/$(curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt)/bin/linux/amd64/kubectl"
    ```

Para descargar una versión específica, remplaza el comando `$(curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt)` con la versión específica. 

Por ejemplo, para descarga la versión {{< param "fullversion" >}} en Linux, teclea: 

    ```
    curl -LO https://storage.googleapis.com/kubernetes-release/release/{{< param "fullversion" >}}/bin/linux/amd64/kubectl
    ```

2. Habilita los permisos de ejecución del binario `kubectl`.

    ```
    chmod +x ./kubectl
    ```

3. Mueve el binario dentro de tu PATH.

    ```
    sudo mv ./kubectl /usr/local/bin/kubectl
    ```

4. Comprueba que la versión que se ha instalado es la más reciente.

    ```
    kubectl version --client
    ```


## Instalar mediante el gestor de paquetes del sistema

{{< tabs name="kubectl_install" >}}
{{< tab name="Ubuntu, Debian or HypriotOS" codelang="bash" >}}
sudo apt-get update && sudo apt-get install -y apt-transport-https gnupg2 curl
curl -s https://packages.cloud.google.com/apt/doc/apt-key.gpg | sudo apt-key add -
echo "deb https://apt.kubernetes.io/ kubernetes-xenial main" | sudo tee -a /etc/apt/sources.list.d/kubernetes.list
sudo apt-get update
sudo apt-get install -y kubectl
{{< /tab >}}

{{< tab name="CentOS, RHEL or Fedora" codelang="bash" >}}cat <<EOF > /etc/yum.repos.d/kubernetes.repo
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

### Instalar usando otro gestor de paquetes

{{< tabs name="other_kubectl_install" >}}
{{% tab name="Snap" %}}
Si usas Ubuntu o alguna de las otras distribuciones de Linux que soportan el gestor de paquetes [snap](https://snapcraft.io/docs/core/install), kubectl está disponible como una aplicación [snap](https://snapcraft.io/).

```shell
snap install kubectl --classic

kubectl version --client
```

{{% /tab %}}

{{% tab name="Homebrew" %}}
Si usas alguna de las otras distribuciones de Linux que soportan el gestor de paquetes  [Homebrew](https://docs.brew.sh/Homebrew-on-Linux), kubectl está disponible como una aplicación de [Homebrew]((https://docs.brew.sh/Homebrew-on-Linux#install).

```shell
brew install kubectl

kubectl version --client
```

{{% /tab %}}

{{< /tabs >}}


## Instalar kubectl en macOS

### Instalar el binario de kubectl usando curl en macOS

1. Descarga la última entrega:

   ```bash
   curl -LO "https://storage.googleapis.com/kubernetes-release/release/$(curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt)/bin/darwin/amd64/kubectl"
   ```

    Para descargar una versión específica, remplaza el comando `$(curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt)` con la versión específica.

    Por ejemplo, para descargar la versión {{< param "fullversion" >}} en macOS, teclea:
		
  ```bash
   curl -LO https://storage.googleapis.com/kubernetes-release/release/{{< param "fullversion" >}}/bin/darwin/amd64/kubectl
   ```

2. Habilita los permisos de ejecución del binario `kubectl`.

   ```bash
   chmod +x ./kubectl
   ```

3. Mueve el binario dentro de tu PATH.

    ```bash
    sudo mv ./kubectl /usr/local/bin/kubectl
    ```

4. Para asegurar que la versión utilizada sea la más actual puedes probar:

   ```bash
   kubectl version --client
   ```

### Instalar con Homebrew en macOS

Si estás usando macOS y el gestor de paquetes es [Homebrew](https://brew.sh/), puedes instalar `kubectl` con `brew`.

1. Ejecuta el comando de instalación:

    ```bash
    brew install kubectl
    ```

    o

    ```bash
    brew install kubernetes-cli
    ```

2. Para asegurar que la versión utilizada sea la más actual, puedes ejecutar:

    ```bash
    kubectl version --client
    ```

### Instalar con Macports en macOS

Si estás en macOS y utilizas el gestor de paquetes [Macports](https://macports.org/), puedes instalar `kubectl` con `port`.

1. Ejecuta los comandos de instalación:

    ```bash
    sudo port selfupdate
    sudo port install kubectl
    ```

2. Para asegurar que la versión utilizada sea la más actual puedes ejecutar:

    ```bash
    kubectl version --client
    ```

# Instalar kubectl en Windows

### Instalar el binario de kubectl con curl en Windows

1. Descargar la última entrega {{< param "fullversion" >}} de [este link](https://storage.googleapis.com/kubernetes-release/release/{{< param "fullversion" >}}/bin/windows/amd64/kubectl.exe).

    o si tiene `curl` instalada, utiliza este comando:

   ```bash
   curl -LO https://storage.googleapis.com/kubernetes-release/release/{{< param "fullversion" >}}/bin/windows/amd64/kubectl.exe
   ```

    Para averiguar la última versión estable (por ejemplo, para secuencias de comandos), echa un vistazo a [https://storage.googleapis.com/kubernetes-release/release/stable.txt](https://storage.googleapis.com/kubernetes-release/release/stable.txt).

2. Añade el binario a tu PATH.

3. Para asegurar que la versión utilizada sea la más actual, puedes ejecutar:

    ```bash
    kubectl version --client
    ```

{{< note >}}
[Docker Desktop para Windows](https://docs.docker.com/docker-for-windows/#kubernetes) añade su propia versión de `kubectl` a PATH.

Si tienes Docker Desktop instalado, es posible que tengas que modificar tu PATH al PATH añadido por Docker Desktop o eliminar la versión de `kubectl` proporcionada por Docker Desktop.
{{< /note >}}

### Instalar con Powershell desde PSGallery

Si estás en Windows y utilizas el gestor de paquetes [Powershell Gallery](https://www.powershellgallery.com/), puedes instalar y actualizar kubectl con Powershell.

1. Ejecuta los comandos de instalación (asegurándote de especificar una `DownloadLocation`):

   ```powershell
   Install-Script -Name 'install-kubectl' -Scope CurrentUser -Force
   install-kubectl.ps1 [-DownloadLocation <path>]
    ```

    {{< note >}}Si no especificas una `DownloadLocation`, `kubectl` se instalará en el directorio temporal del usuario.{{< /note >}}

    El instalador crea `$HOME/.kube` y crea un archivo de configuración

2. Para asegurar que la versión utilizada sea la más actual puedes probar:

    ```powershell
    kubectl version --client
    ```

{{< note >}}
Actualizar la instalación se realiza mediante la re-ejecución de los dos comandos listados en el paso 1.{{< /note >}}

### Instalar en Windows usando Chocolatey o scoop

1. Para instalar kubectl en Windows puedes usar el gestor de paquetes [Chocolatey](https://chocolatey.org) o el instalador de línea de comandos [scoop](https://scoop.sh).

    {{< tabs name="kubectl_win_install" >}}
    {{% tab name="choco" %}}
Using  [Chocolatey](https://chocolatey.org).

    ```powershell
    choco install kubernetes-cli
    ```
    {{% /tab %}}
    {{% tab name="scoop" %}}
Using [scoop](https://scoop.sh).

    ```powershell
    scoop install kubectl
    ```
    {{% /tab %}}
    {{< /tabs >}}

2. Para asegurar que la versión utilizada sea la más actual puedes probar:

    ```powershell
    kubectl version --client
    ```

3. Navega a tu directorio de inicio:

    ```powershell
    # Si estas usando cmd.exe, ejecuta: cd %USERPROFILE%
    cd ~
    ```

4. Crea el directorio `.kube`:

    ```powershell
    mkdir .kube
    ```

5. Cambia al directorio `.kube` que acabas de crear:

    ```powershell
    cd .kube
    ```

6. Configura kubectl para usar un clúster remoto de Kubernetes:

    ```powershell
    New-Item config -type file
    ```

{{< note >}}Edita el fichero de configuración con un editor de texto de tu elección, como Notepad.{{< /note >}}

## Descarga como parte del Google Cloud SDK

Puedes instalar kubectl como parte del Google Cloud SDK.

1. Instala el [Google Cloud SDK](https://cloud.google.com/sdk/).
2. Ejecuta el comando de instalación de `kubectl`:

    ```shell
    gcloud components install kubectl
    ```

3. Para asegurar que la versión utilizada sea la más actual puedes probar:

    ```shell
    kubectl version --client
    ```

## Comprobar la configuración kubectl

Para que kubectl pueda encontrar y acceder a un clúster de Kubernetes, necesita un [fichero kubeconfig](/docs/tasks/access-application-cluster/configure-access-multiple-clusters/), que se crea de forma automática cuando creas un clúster usando [kube-up.sh](https://github.com/kubernetes/kubernetes/blob/master/cluster/kube-up.sh)  o despliegas de forma satisfactoria un clúster de Minikube. Revisa las [guías para comenzar](/docs/setup/) para más información acerca de crear clústers. Si necesitas acceso a un clúster que no has creado, ver el [documento de Compartir Acceso a un Clúster](/docs/tasks/access-application-cluster/configure-access-multiple-clusters/).
Por defecto, la configuración de kubectl se encuentra en `~/.kube/config`.

Comprueba que kubectl está correctamente configurado obteniendo el estado del clúster:

```shell
kubectl cluster-info
```

Si ves una respuesta en forma de URL, kubectl está correctamente configurado para acceder a tu clúster.

Si ves un mensaje similar al siguiente, kubectl no está correctamente configurado o no es capaz de conectar con un clúster de Kubernetes.

```
The connection to the server <server-name:port> was refused - did you specify the right host or port?
```

Por ejemplo, si intentas ejecutar un clúster de Kubernetes en tu portátil (localmente), necesitarás una herramienta como minikube que esté instalada primero y entonces volver a ejecutar los comandos indicados arriba.

Si kubectl cluster-info devuelve la respuesta en forma de url, pero no puedes acceder a tu clúster, para comprobar si está configurado adecuadamente, usa:

```shell
kubectl cluster-info dump
```

## kubectl configuraciones opcionales

### Habilitar el auto-completado en el intérprete de comandos

kubectl provee de soporte para auto-completado para Bash y Zsh, ¡que te puede ahorrar mucho uso del teclado!

Abajo están los procedimientos para configurar el auto-completado para Bash (incluyendo la diferencia entre Linux y macOS) y Zsh.

{{< tabs name="kubectl_autocompletion" >}}

{{% tab name="Bash en Linux" %}}

### Introducción

La secuencia de comandos de completado de kubectl para Bash puede ser generado con el comando `kubectl completion bash`. Corriendo la secuencia de comandos de completado en tu intérprete de comandos habilita el auto-completado de kubectl.

Sin embargo, la secuencia de comandos de completado depende de [*bash-completion**](https://github.com/scop/bash-completion), lo que significa que tienes que instalar primero este programa (puedes probar si ya tienes bash-completion instalado ejecutando `type _init_completion`).

### Instalar bash-completion

bash-completion es ofrecido por muchos gestores de paquetes (ver [aquí](https://github.com/scop/bash-completion#installation)). Puedes instalarlo con `apt-get install bash-completion` o `yum install bash-completion`, etc.

Los comandos de arriba crean `/usr/share/bash-completion/bash_completion`, que es la secuencia de comandos principal de bash-completion. Dependiendo de tu gestor de paquetes, tienes que correr manualmente este archivo en tu `~/.bashrc`.

Para averiguarlo, recarga tu intérprete de comandos y ejecuta `type _init_completion`. Si el comando tiene éxito, ya has terminado; si no, añade lo siguiente a tu `~/.bashrc`:

```shell
source /usr/share/bash-completion/bash_completion
```

recarga tu intérprete de comandos y verifica que bash-completion está correctamente instalado tecleando `type _init_completion`.

### Habilitar el auto-completado de kubectl

Debes asegurarte que la secuencia de comandos de completado de kubectl corre en todas tus sesiones de tu intérprete de comandos. Hay dos formas en que puedes hacer esto:

- Corre la secuencia de comandos de completado en tu `~/.bashrc`:

    ```bash
    echo 'source <(kubectl completion bash)' >>~/.bashrc
    ```

- Añade la secuencia de comandos de completado al directorio `/etc/bash_completion.d`:

    ```bash
    kubectl completion bash >/etc/bash_completion.d/kubectl
    ```

Si tienes un alias para `kubectl`, puedes extender los comandos de shell para funcionar con ese alias:

```bash
echo 'alias k=kubectl' >>~/.bashrc
echo 'complete -F __start_kubectl k' >>~/.bashrc
```

{{< note >}}
bash-completion corre todas las secuencias de comandos de completado en `/etc/bash_completion.d`.
{{< /note >}}

Ambas estrategias son equivalentes. Tras recargar tu intérprete de comandos, el auto-completado de kubectl debería estar funcionando.

{{% /tab %}}


{{% tab name="Bash en macOS" %}}

### Introducción

La secuencia de comandos de completado de kubectl para Bash puede generarse con el comando `kubectl completion bash`. Corriendo la secuencia de comandos de completado en tu intérprete de comandos habilita el auto-completado de kubectl.

Sin embargo, la secuencia de comandos de completado depende de [*bash-completion**](https://github.com/scop/bash-completion), lo que significa que tienes que instalar primero este programa (puedes probar si ya tienes bash-completion instalado ejecutando `type _init_completion`).

{{< warning>}}
macOS incluye Bash 3.2 por defecto. La secuencia de comandos de completado de kubectl requiere Bash 4.1+ y no funciona con Bash 3.2. Una posible alternativa es instalar una nueva versión de Bash en macOS (ver instrucciones [aquí](https://itnext.io/upgrading-bash-on-macos-7138bd1066ba)). Las instrucciones de abajo sólo funcionan si estás usando Bash 4.1+.
{{< /warning >}}

### Actualizar bash

Las instrucciones asumen que usa Bash 4.1+. Puedes comprobar tu versión de bash con:

```bash
echo $BASH_VERSION
```

Si no es 4.1+, puede actualizar bash con Homebrew:

```bash
brew install bash
```

Recarga tu intérprete de comandos y verifica que estás usando la versión deseada:

```bash
echo $BASH_VERSION $SHELL
```

Usualmente, Homebrew lo instala en `/usr/local/bin/bash`.

### Instalar bash-completion

Puedes instalar bash-completion con Homebrew:

```bash
brew install bash-completion@2
```

{{< note >}}
El `@2` simboliza bash-completion 2, que es requerido por la secuencia de comandos de completado de kubectl (no funciona con bash-completion 1). Luego, bash-completion 2 requiere Bash 4.1+, eso es por lo que necesitabas actualizar Bash.
{{< /note >}}

Como se indicaba en la salida de `brew install` (sección "Caveats"), añade las siguientes líneas a tu `~/.bashrc` o `~/.bash_profile`:

```bash
export BASH_COMPLETION_COMPAT_DIR="/usr/local/etc/bash_completion.d"
[[ -r "/usr/local/etc/profile.d/bash_completion.sh" ]] && . "/usr/local/etc/profile.d/bash_completion.sh"
```

Recarga tu intérprete de comandos y verifica que bash-completion está correctamente instalado tecleando `type _init_completion`.

### Habilitar el auto-completado de kubectl

Debes asegurarte que la secuencia de comandos de completado de kubectl corre en todas tus sesiones de tu intérprete de comenados. Hay múltiples formas en que puedes hacer esto:

- Corre la secuencia de comandos de completado en tu `~/.bashrc`:

    ```shell
    echo 'source <(kubectl completion bash)' >>~/.bashrc

    ```

- Añade la secuencia de comandos de completado al directorio `/usr/local/etc/bash_completion.d`:

    ```shell
    kubectl completion bash >/usr/local/etc/bash_completion.d/kubectl
    ```

- Si has instalado kubectl con Homebrew (como se explica [aquí](#install-with-homebrew-on-macos)), entonces la secuencia de comandos de completado se instaló automáticamente en `/usr/local/etc/bash_completion.d/kubectl`. En este caso, no tienes que hacer nada.

{{< note >}}
bash-completion (si se instaló con Homebrew) corre todas las secuencias de comandos de completado en el directorio que se ha puesto en la variable de entorno `BASH_COMPLETION_COMPAT_DIR`.
{{< /note >}}

Todas las estrategias son equivalentes. Tras recargar tu intérprete de comandos, el auto-completado de kubectl debería funcionar.
{{% /tab %}}

{{% tab name="Zsh" %}}

La secuencia de comandos de completado de kubectl para Zsh puede ser generada con el comando `kubectl completion zsh`. Corriendo la secuencia de comandos de completado en tu intérprete de comandos habilita el auto-completado de kubectl.

Para hacerlo en todas tus sesiones de tu intérprete de comandos, añade lo siguiente a tu `~/.zshrc`:

```zsh
source <(kubectl completion zsh)
```

Si tienes alias para kubectl, puedes extender el completado de intérprete de comandos para funcionar con ese alias.

```zsh
echo 'alias k=kubectl' >>~/.zshrc
echo 'complete -F __start_kubectl k' >>~/.zshrc
```

Tras recargar tu intérprete de comandos, el auto-completado de kubectl debería funcionar.

Si obtienes un error como `complete:13: command not found: compdef`, entonces añade lo siguiente al principio de tu `~/.zshrc`:

```zsh
autoload -Uz compinit
compinit
```
{{% /tab %}}
{{< /tabs >}}

## {{% heading "whatsnext" %}}
* [Instalar Minikube](https://minikube.sigs.k8s.io/docs/start/)
* Ver las [guías](/docs/setup/) para ver mas información sobre como crear clusteres.
* [Aprender cómo lanzar y exponer tu aplicación.](/docs/tasks/access-application-cluster/service-access-application-cluster/).
* Si necesita acceso a un clúster que no se creó, ver el documento de [compartiendo acceso a clúster](/docs/tasks/access-application-cluster/configure-access-multiple-clusters/).
* Leer ´la documentación de kubectl reference](/docs/reference/kubectl/kubectl/)
