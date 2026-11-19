---
title: Convenciones de uso de kubectl
reviewers:
- raelga
- electrocucaracha
content_type: concept
weight: 60
---

<!-- overview -->
Convenciones de uso recomendadas para `kubectl`.


<!-- body -->

## Utilizar `kubectl` en scripts reutilizables

Para una salida estable en un script:

* Solicita uno de los formatos de salida orientados a máquinas, como `-o name`, `-o json`, `-o yaml`, `-o go-template`, o `-o jsonpath`.
* Especifica la versión completa. Por ejemplo, `jobs.v1.batch/myjob`. Esto asegurará que kubectl no utilice la versión por predeterminado que cambia en el tiempo.
* No dependas del contexto, de las preferencias, u otros estados implícitos.

## Subrecursos

* Puedes utilizar el argumento `--subresource` para subcomandos de kubectl como `get`, `patch`,
`edit`, `apply` y `replace` para buscar y actualizar subrecursos para todos los recursos que
lo soporten. En la versión de kubernetes {{< skew currentVersion >}}, solo los subrecursos `status`, `scale`
y `resize` son admitidos.
  * Para `kubectl edit`, el subrecurso `scale` no es compatible. Si utilizas `--subresource` con
    `kubectl edit` y especificas `scale` como subrecurso, el comando fallará.
* El contrato de la API para un subrecurso es idéntico al de un recurso completo. Al actualizar el
subrecurso `status` a un nuevo valor, ten en cuenta que el subrecurso podría ser potencialmente
reconciliado a un valor diferente por un controlador.


## Mejores prácticas

### `kubectl run`

Para que `kubectl run` satisfaga la infraestructura como código:

* Etiqueta la imagen con una etiqueta de una versión específica y no muevas esa etiqueta a una nueva versión. Por ejemplo, utiliza `:v1234`, `v1.2.3`, `r03062016-1-4`, por encima de `:latest` (Para más información, mira [Buenas prácticas de configuración de Kubernetes](/blog/2025/11/25/configuration-good-practices/)).
* Revisa en el script si hay una imagen que esté fuertemente parametrizada.
* Recurre a utilizar archivos de configuración versionados en el control de versiones para aquellas características que son necesarias, pero que no puedan expresarse mediante flags de `kubectl run`.

Puedes utilizar el flag `--dry-run=client` para previsualizar el objeto que sería enviado a tu clúster, sin realmente enviarlo.

### `kubectl proxy`

{{< caution >}}
Navegar por endpoints de pods o servicios no confiables a través de `kubectl proxy` es peligroso,
ya que el contenido servido tiene acceso implícito a la API de Kubernetes utilizando las credenciales del proxy. Ten precaución y evita acceder a endpoints no confiables mientras utilices
credenciales con privilegios.

Para reducir riesgos:

* Evita navegar a pods o servicios no confiables a través de `kubectl proxy`.
* Utiliza `--reject-methods='POST,PUT,PATCH,DELETE'` para limitar al proxy a
  operaciones de solo lectura cuando solo necesitas ver los recursos.
* Utiliza `--reject-paths` para limitar que rutas de la API el proxy expone.
* No ejecutes `kubectl proxy` con credenciales de administrador de clúster a menos que sea necesario.
{{< /caution >}}

### `kubectl apply`

* Puedes utilizar `kubectl apply` para crear o actualizar recursos. Para más información sobre el uso de kubectl apply para actualizar recursos, mira el [libro de Kubectl](https://kubectl.docs.kubernetes.io).


