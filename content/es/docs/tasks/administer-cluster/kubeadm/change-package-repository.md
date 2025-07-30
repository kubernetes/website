---
title: Cambiando el Repositorio de Paquetes de Kubernetes
content_type: task
weight: 150
---

<!-- overview -->

Esta página explica cómo habilitar un repositorio de paquetes para la versión menor de Kubernetes deseada al actualizar un clúster. Esto solo es necesario para los usuarios de los repositorios de paquetes administrados por la comunidad alojados en `pkgs.k8s.io`. A diferencia de los repositorios de paquetes heredados, los repositorios de la comunidad están estructurados de manera que hay un repositorio dedicado para cada versión menor de Kubernetes.

{{< note >}}
Esta guía solo cubre una parte del proceso de actualización de Kubernetes. Por favor, consulta la
[guía de actualización](/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade/)
para más información sobre cómo actualizar clústeres de Kubernetes.
{{</ note >}}

{{< note >}}
Este paso solo es necesario al actualizar un clúster a otra versión **menor**.
Si estás actualizando a otra versión patch dentro de la misma versión menor (por ejemplo,
v{{< skew currentVersion >}}.5 a v{{< skew currentVersion >}}.7), no necesitas seguir esta guía. Sin embargo, si aún usas los repositorios de paquetes heredados, deberás migrar a los nuevos repositorios de la comunidad antes de actualizar (consulta la siguiente sección para más detalles sobre cómo hacerlo).
{{</ note >}}

## {{% heading "prerequisites" %}}

Este documento asume que ya estás usando los repositorios de paquetes de la comunidad (`pkgs.k8s.io`). Si no es así, se recomienda encarecidamente migrar a los repositorios de la comunidad como se describe en el [anuncio oficial](/blog/2023/08/15/pkgs-k8s-io-introduction/).

{{% legacy-repos-deprecation %}}

### Verificando si se usan los repositorios de paquetes de Kubernetes

Si no estás seguro de si usas los repositorios de la comunidad o los heredados, sigue estos pasos para verificarlo:

{{< tabs name="k8s_install_versions" >}}
{{% tab name="Ubuntu, Debian o HypriotOS" %}}

Imprime el contenido del archivo que define el repositorio `apt` de Kubernetes:

```shell
# En tu sistema, este archivo de configuración podría tener otro nombre
pager /etc/apt/sources.list.d/kubernetes.list
```

Si ves una línea similar a:

```
deb [signed-by=/etc/apt/keyrings/kubernetes-apt-keyring.gpg] https://pkgs.k8s.io/core:/stable:/v{{< skew currentVersionAddMinor -1 "." >}}/deb/ /
```

**Estás usando los repositorios de paquetes de Kubernetes y esta guía aplica para ti.**
De lo contrario, se recomienda encarecidamente migrar a los repositorios de la comunidad como se describe en el [anuncio oficial](/blog/2023/08/15/pkgs-k8s-io-introduction/).

{{% /tab %}}
{{% tab name="CentOS, RHEL o Fedora" %}}

Imprime el contenido del archivo que define el repositorio `yum` de Kubernetes:

```shell
# En tu sistema, este archivo de configuración podría tener otro nombre
cat /etc/yum.repos.d/kubernetes.repo
```

Si ves un `baseurl` similar al `baseurl` en la salida siguiente:

```
[kubernetes]
name=Kubernetes
baseurl=https://pkgs.k8s.io/core:/stable:/v{{< skew currentVersionAddMinor -1 "." >}}/rpm/
enabled=1
gpgcheck=1
gpgkey=https://pkgs.k8s.io/core:/stable:/v{{< skew currentVersionAddMinor -1 "." >}}/rpm/repodata/repomd.xml.key
exclude=kubelet kubeadm kubectl
```

**Estás usando los repositorios de paquetes de Kubernetes y esta guía aplica para ti.**
De lo contrario, se recomienda encarecidamente migrar a los repositorios de la comunidad como se describe en el [anuncio oficial](/blog/2023/08/15/pkgs-k8s-io-introduction/).

{{% /tab %}}

{{% tab name="openSUSE o SLES" %}}

Imprime el contenido del archivo que define el repositorio `zypper` de Kubernetes:

```shell
# En tu sistema, este archivo de configuración podría tener otro nombre
cat /etc/zypp/repos.d/kubernetes.repo
```

Si ves un `baseurl` similar al `baseurl` en la salida siguiente:

```
[kubernetes]
name=Kubernetes
baseurl=https://pkgs.k8s.io/core:/stable:/v{{< skew currentVersionAddMinor -1 "." >}}/rpm/
enabled=1
gpgcheck=1
gpgkey=https://pkgs.k8s.io/core:/stable:/v{{< skew currentVersionAddMinor -1 "." >}}/rpm/repodata/repomd.xml.key
exclude=kubelet kubeadm kubectl
```

**Estás usando los repositorios de paquetes de Kubernetes y esta guía aplica para ti.**
De lo contrario, se recomienda encarecidamente migrar a los repositorios de la comunidad como se describe en el [anuncio oficial](/blog/2023/08/15/pkgs-k8s-io-introduction/).

{{% /tab %}}
{{< /tabs >}}

{{< note >}}
La URL utilizada para los repositorios de paquetes de Kubernetes no se limita a `pkgs.k8s.io`,
también puede ser una de las siguientes:

- `pkgs.k8s.io`
- `pkgs.kubernetes.io`
- `packages.kubernetes.io`
{{</ note >}}

<!-- steps -->

## Cambiando a otro repositorio de paquetes de Kubernetes

Este paso debe realizarse al actualizar de una versión menor a otra de Kubernetes para obtener acceso a los paquetes de la versión menor deseada.

{{< tabs name="k8s_upgrade_versions" >}}
{{% tab name="Ubuntu, Debian o HypriotOS" %}}

1. Abre el archivo que define el repositorio `apt` de Kubernetes usando el editor de texto de tu preferencia:

   ```shell
   nano /etc/apt/sources.list.d/kubernetes.list
   ```

   Deberías ver una sola línea con la URL que contiene tu versión menor actual de Kubernetes. Por ejemplo, si usas v{{< skew currentVersionAddMinor -1 "." >}},
   deberías ver esto:

   ```
   deb [signed-by=/etc/apt/keyrings/kubernetes-apt-keyring.gpg] https://pkgs.k8s.io/core:/stable:/v{{< skew currentVersionAddMinor -1 "." >}}/deb/ /
   ```

1. Cambia la versión en la URL a **la siguiente versión menor disponible**, por ejemplo:

   ```
   deb [signed-by=/etc/apt/keyrings/kubernetes-apt-keyring.gpg] https://pkgs.k8s.io/core:/stable:/{{< param "version" >}}/deb/ /
   ```

1. Guarda el archivo y cierra el editor de texto. Continúa siguiendo las instrucciones relevantes de actualización.

{{% /tab %}}
{{% tab name="CentOS, RHEL o Fedora" %}}

1. Abre el archivo que define el repositorio `yum` de Kubernetes usando el editor de texto de tu preferencia:

   ```shell
   nano /etc/yum.repos.d/kubernetes.repo
   ```

   Deberías ver un archivo con dos URLs que contienen tu versión menor actual de Kubernetes. Por ejemplo, si usas v{{< skew currentVersionAddMinor -1 "." >}},
   deberías ver esto:

   ```
   [kubernetes]
   name=Kubernetes
   baseurl=https://pkgs.k8s.io/core:/stable:/v{{< skew currentVersionAddMinor -1 "." >}}/rpm/
   enabled=1
   gpgcheck=1
   gpgkey=https://pkgs.k8s.io/core:/stable:/v{{< skew currentVersionAddMinor -1 "." >}}/rpm/repodata/repomd.xml.key
   exclude=kubelet kubeadm kubectl cri-tools kubernetes-cni
   ```

1. Cambia la versión en estas URLs a **la siguiente versión menor disponible**, por ejemplo:

   ```
   [kubernetes]
   name=Kubernetes
   baseurl=https://pkgs.k8s.io/core:/stable:/{{< param "version" >}}/rpm/
   enabled=1
   gpgcheck=1
   gpgkey=https://pkgs.k8s.io/core:/stable:/{{< param "version" >}}/rpm/repodata/repomd.xml.key
   exclude=kubelet kubeadm kubectl cri-tools kubernetes-cni
   ```

1. Guarda el archivo y cierra el editor de texto. Continúa siguiendo las instrucciones relevantes de actualización.

{{% /tab %}}
{{< /tabs >}}

## {{% heading "whatsnext" %}}

* Consulta cómo [Actualizar nodos Linux](/docs/tasks/administer-cluster/kubeadm/upgrading-linux-nodes/).
* Consulta cómo [Actualizar nodos Windows](/docs/tasks/administer-cluster/kubeadm/upgrading-windows-nodes/).
