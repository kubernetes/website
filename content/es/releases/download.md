---
title: Descargar Kubernetes
type: docs
---

Kubernetes distribuye binarios para cada componente, así como un conjunto estándar de aplicaciones
de cliente para realizar el arranque o interactuar con un cluster. Componentes como el
API server son capaces de ejecutarse dentro de imágenes de contenedor dentro de un
cluster. Esos componentes también se distribuyen en imágenes de contenedor como parte del
proceso oficial de lanzamiento. Todos los binarios, así como las imágenes de contenedor, están disponibles
para múltiples sistemas operativos y arquitecturas de hardware.

### kubectl

<!-- overview -->

La herramienta de línea de comandos de Kubernetes, [kubectl](/docs/reference/kubectl/kubectl/), te permite
ejecutar comandos contra clusters de Kubernetes.

Puedes usar kubectl para desplegar aplicaciones, inspeccionar y gestionar recursos del cluster,
y ver logs. Para más información, incluyendo una lista completa de las operaciones de kubectl, consulta la
[documentación de referencia de `kubectl`](/docs/reference/kubectl/).

kubectl se puede instalar en una variedad de plataformas Linux, macOS y Windows.
Busca tu sistema operativo preferido a continuación.

- [Instalar kubectl en Linux](/docs/tasks/tools/install-kubectl-linux)
- [Instalar kubectl en macOS](/docs/tasks/tools/install-kubectl-macos)
- [Instalar kubectl en Windows](/docs/tasks/tools/install-kubectl-windows)

## Imágenes de contenedor

Todas las imágenes de contenedor de Kubernetes se despliegan en el
registro de imágenes de contenedor `registry.k8s.io`.

| Imagen de contenedor                                                      | Arquitecturas soportadas          |
| ------------------------------------------------------------------------- | --------------------------------- |
| registry.k8s.io/kube-apiserver:v{{< skew currentPatchVersion >}}          | amd64, arm, arm64, ppc64le, s390x |
| registry.k8s.io/kube-controller-manager:v{{< skew currentPatchVersion >}} | amd64, arm, arm64, ppc64le, s390x |
| registry.k8s.io/kube-proxy:v{{< skew currentPatchVersion >}}              | amd64, arm, arm64, ppc64le, s390x |
| registry.k8s.io/kube-scheduler:v{{< skew currentPatchVersion >}}          | amd64, arm, arm64, ppc64le, s390x |
| registry.k8s.io/conformance:v{{< skew currentPatchVersion >}}             | amd64, arm, arm64, ppc64le, s390x |

### Arquitecturas de imágenes de contenedor

Todas las imágenes de contenedor están disponibles para múltiples arquitecturas, por lo que el
container runtime debería elegir la correcta basándose en la plataforma subyacente.
También es posible descargar una arquitectura dedicada añadiendo un sufijo al
nombre de la imagen de contenedor, por ejemplo
`registry.k8s.io/kube-apiserver-arm64:v{{< skew currentPatchVersion >}}`.

### Firmas de imágenes de contenedor

{{< feature-state for_k8s_version="v1.26" state="beta" >}}

Para Kubernetes {{< param "version" >}},
las imágenes de contenedor están firmadas utilizando firmas de [sigstore](https://sigstore.dev):

{{< note >}}
Las firmas sigstore de las imágenes de contenedor actualmente no coinciden entre diferentes ubicaciones geográficas.
Hay más información disponible sobre este problema en el correspondiente
[<em>issue</em> de GitHub](https://github.com/kubernetes/registry.k8s.io/issues/187).
{{< /note >}}

El proyecto Kubernetes publica una lista de imágenes de contenedor de Kubernetes firmadas
en formato [SPDX 2.3](https://spdx.dev/specifications/).
Puedes obtener esa lista utilizando:

```shell
curl -Ls "https://sbom.k8s.io/$(curl -Ls https://dl.k8s.io/release/stable.txt)/release" | grep "SPDXID: SPDXRef-Package-registry.k8s.io" |  grep -v sha256 | cut -d- -f3- | sed 's/-/\//' | sed 's/-v1/:v1/'
```

Para verificar manualmente las imágenes de contenedor firmadas de los componentes principales de Kubernetes, consulta
[Verificar imágenes de contenedor firmadas](/docs/tasks/administer-cluster/verify-signed-artifacts).

Si descargas una imagen de contenedor para una arquitectura específica, la imagen de
arquitectura única está firmada de la misma manera que en las listas de manifests multi-arquitectura.

## Binarios

{{< release-binaries >}}
