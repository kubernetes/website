---
reviewers:
- seomago
title: Compilando desde código fuente
content_template: templates/concept
card:
  name: download
  weight: 20
  title: Building a release
---
{{% capture overview %}}
Se puede o bien crear una release desde el código fuente o bien descargar una version pre-built. Si no se pretende hacer un desarrollo de Kubernetes en sí mismo, se sugiere usar una version pre-built de la release actual, que se puede encontrar en [Release Notes](/docs/setup/release/notes/).

El codigo fuente de Kubernetes se puede descargar desde el repositorio [kubernetes/kubernetes](https://github.com/kubernetes/kubernetes) .
{{% /capture %}}

{{% capture body %}}
## Compilar desde codigo fuente

Si simplemente estas compiladondo una release desde el código fuente, no es necesario hacer una configuración completa del entorno golang ya que toda la compilación se realiza desde un contenedor Docker.

Compilar es facil.

```shell
git clone https://github.com/kubernetes/kubernetes.git
cd kubernetes
make release
```

Para más detalles sobre el proceso de compilar una release, visita la carpeta kubernetes/kubernetes [`build`](http://releases.k8s.io/{{< param "githubbranch" >}}/build/) 



{{% /capture %}}
