---
title: Instalar Minikube
content_template: templates/task
weight: 20
card:
  name: tasks
  weight: 10
---

{{% capture overview %}}

Esta página muestra cómo instalar [Minikube](/docs/tutorials/hello-minikube), una herramienta que despliega un clúster de Kubernetes con un único nodo en una máquina virtual.

{{% /capture %}}

{{% capture prerequisites %}}

La virtualización VT-x o AMD-v debe estar habilitada en la BIOS de tu ordenador. En Linux, puedes comprobar si la tienes habilitada buscando 'vmx' o 'svm' en el fichero `/proc/cpuinfo`:
```shell
egrep --color 'vmx|svm' /proc/cpuinfo
```

{{% /capture %}}

{{% capture steps %}}

## Instalar un Hipervisor

Si todavía no tienes un hipervisor instalado, puedes instalar uno de los siguientes:

Sistema Operativo | Hipervisores soportados
:-----------------|:------------------------
macOS | [VirtualBox](https://www.virtualbox.org/wiki/Downloads), [VMware Fusion](https://www.vmware.com/products/fusion), [HyperKit](https://github.com/moby/hyperkit)
Linux | [VirtualBox](https://www.virtualbox.org/wiki/Downloads), [KVM](http://www.linux-kvm.org/)
Windows | [VirtualBox](https://www.virtualbox.org/wiki/Downloads), [Hyper-V](https://msdn.microsoft.com/en-us/virtualization/hyperv_on_windows/quick_start/walkthrough_install)

{{< note >}}
Minikube también soporta una opción `--vm-driver=none` que ejecuta los componentes de Kubernetes directamente en el servidor y no en una máquina virtual (MV). Para usar este modo, se requiere Docker y un entorno Linux, pero no es necesario tener un hipervisor.
{{< /note >}}

## Instalar kubectl

* Instala kubectl siguiendo las instrucciones disponibles en [Instalar y Configurar kubectl](/docs/tasks/tools/install-kubectl/).

## Instalar Minikube

### macOS

La forma más fácil de instalar Minikube en macOS es usar [Homebrew](https://brew.sh):

```shell
brew cask install minikube
```

También puedes instalarlo en macOS descargando un ejecutable autocontenido:

```shell
curl -Lo minikube https://storage.googleapis.com/minikube/releases/latest/minikube-darwin-amd64 \
  && chmod +x minikube
```

Para tener disponible en la consola el comando `minikube`, puedes añadir el comando al $PATH o moverlo por ejemplo a `/usr/local/bin`:

```shell
sudo mv minikube /usr/local/bin
```

### Linux

{{< note >}}
Este documento muestra cómo instalar Minikube en Linux usando un ejecutable autocontenido. Para métodos alternativos de instalación en Linux, ver [Otros métodos de Instalación](https://github.com/kubernetes/minikube#other-ways-to-install) en el repositorio GitHub oficial de Minikube.
{{< /note >}}

Puedes instalar Minikube en Linux descargando un ejecutable autocontenido:

```shell
curl -Lo minikube https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64 \
  && chmod +x minikube
```

Para tener disponible en la consola el comando `minikube`, puedes añadir el comando al $PATH o moverlo por ejemplo a `/usr/local/bin`:

```shell
sudo cp minikube /usr/local/bin && rm minikube
```

### Windows

{{< note >}}
Para ejecutar Minikube en Windows, necesitas instalar [Hyper-V](https://docs.microsoft.com/en-us/virtualization/hyper-v-on-windows/quick-start/enable-hyper-v) primero, que puede ejecutarse en las tres versiones de Windows 10: Windows 10 Enterprise, Windows 10 Professional, y Windows 10 Education.
{{< /note >}}

La forma más fácil de instalar Minikube en Windows es usando [Chocolatey](https://chocolatey.org/) (ejecutar como administrador):

```shell
choco install minikube kubernetes-cli
```

Una vez Minikube ha terminado de instalarse, cierra la sesión cliente actual y reinicia. Minikube debería haberse añadido a tu $PATH automáticamente.

#### Instalación manual en Windows

Para instalar Minikube manualmente en Windows, descarga [`minikube-windows-amd64`](https://github.com/kubernetes/minikube/releases/latest), renómbralo a `minikube.exe`, y añádelo a tu PATH.

#### Instalador de Windows

Para instalar Minikube manualmente en Windows usando [Windows Installer](https://docs.microsoft.com/en-us/windows/desktop/msi/windows-installer-portal), descarga [`minikube-installer.exe`](https://github.com/kubernetes/minikube/releases/latest) y ejecuta el instalador.

{{% /capture %}}

{{% capture whatsnext %}}

* [Ejecutar Kubernetes Localmente via Minikube](/docs/setup/minikube/)

{{% /capture %}}

## Limpiar todo para comenzar de cero

Si habías instalado previamente minikube, y ejecutas:
```shell
minikube start
```

Y dicho comando devuelve un error:
```shell
machine does not exist
```

Necesitas eliminar permanentemente los siguientes archivos de configuración:
```shell
rm -rf ~/.minikube
```
