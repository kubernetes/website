---
reviewers:
- seomago
title: Compilando desde código fuente
content_template: templates/concept
card:
  name: download
  weight: 20
  title: Compilando desde código fuente

---

{{% capture overview %}}
Se puede o bien crear una release desde el código fuente o bien descargar una versión pre-built. Si no se pretende hacer un desarrollo de Kubernetes en sí mismo, se sugiere usar una version pre-built de la release actual, que se puede encontrar en [Release Notes](/docs/setup/release/notes/).

El código fuente de Kubernetes se puede descargar desde el repositorio [kubernetes/kubernetes](https://github.com/kubernetes/kubernetes) .
{{% /capture %}}

{{% capture body %}}

## Compilar desde código fuente

Si simplemente estas compilando una release desde el código fuente, no es necesario hacer una configuración completa del entorno golang ya que toda la compilación se realiza desde un contenedor Docker.

Compilar es fácil.

```shell
git clone https://github.com/kubernetes/kubernetes.git
cd kubernetes
make release
```

Para más detalles sobre el proceso de compilación de una release, visita la carpeta kubernetes/kubernetes [`build`](http://releases.k8s.io/{{< param "githubbranch" >}}/build/) 



{{% /capture %}}
