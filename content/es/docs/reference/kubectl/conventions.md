---
title: Convenciones de uso de kubectl
reviewers:
- janetkuo
content_type: concept
weight: 60
---

<!-- overview -->
Convenciones de uso recomendadas para `kubectl`.


<!-- body -->

## Uso de `kubectl` en scripts reutilizables

Para obtener una salida estable en un script:

* Solicita una de las formas de salida orientadas a máquinas, como `-o name`, `-o json`, `-o yaml`, `-o go-template` o `-o jsonpath`.
* Califica completamente la versión. Por ejemplo, `jobs.v1.batch/myjob`. Esto garantizará que kubectl no utilice su versión predeterminada, la cual puede cambiar con el tiempo.
* No dependas del contexto, las preferencias u otros estados implícitos.

## Subrecursos

* Puedes usar el argumento `--subresource` para subcomandos de kubectl tales como `get`, `patch`,
`edit`, `apply` y `replace` para obtener y actualizar subrecursos para todos los recursos que
los admitan. En la versión {{< skew currentVersion >}} de Kubernetes, solo se admiten los subrecursos
`status`, `scale` y `resize`.
  * Para `kubectl edit`, el subrecurso `scale` no es compatible. Si usas `--subresource` con
    `kubectl edit` y especificas `scale` como el subrecurso, el comando devolverá un error.
* El contrato de la API frente a un subrecurso es idéntico al de un recurso completo. Al actualizar el
subrecurso `status` a un nuevo valor, ten en cuenta que el subrecurso podría ser potencialmente
conciliado por un controlador con un valor diferente.


## Prácticas recomendadas

### `kubectl run`

Para que `kubectl run` satisfaga la infraestructura como código:

* Etiqueta la imagen con una etiqueta específica de versión y no muevas esa etiqueta a una nueva versión. Por ejemplo, utiliza `:v1234`, `v1.2.3`, `r03062016-1-4`, en lugar de `:latest` (Para obtener más información, consulta [Buenas prácticas de configuración de Kubernetes](/blog/2025/11/25/configuration-good-practices/)).
* Registra en el control de versiones el script para una imagen que esté fuertemente parametrizada.
* Cambia a archivos de configuración registrados en el control de código fuente para características que se necesiten, pero que no se puedan expresar mediante parámetros de `kubectl run`.

Puedes usar el parámetro `--dry-run=client` para obtener una vista previa del objeto que se enviaría a tu clúster, sin enviarlo realmente.

### `kubectl proxy`

{{< caution >}}
Navegar por endpoints no confiables de pods o servicios a través de `kubectl proxy` es peligroso,
ya que el contenido servido tiene acceso implícito a la API de Kubernetes utilizando las credenciales
del proxy. Ten precaución y evita acceder a endpoints no confiables mientras utilizas
credenciales privilegiadas.

Para reducir el riesgo:

* Evita navegar a pods o servicios no confiables a través de `kubectl proxy`.
* Utiliza `--reject-methods='POST,PUT,PATCH,DELETE'` para restringir el proxy a
  operaciones de solo lectura cuando únicamente necesites ver recursos.
* Utiliza `--reject-paths` para limitar qué rutas de API expone el proxy.
* No ejecutes `kubectl proxy` con credenciales de cluster-admin a menos que sea necesario.
{{< /caution >}}

### `kubectl apply`

* Puedes usar `kubectl apply` para crear o actualizar recursos. Para obtener más información sobre el uso de kubectl apply para actualizar recursos, consulta el [Libro de Kubectl](https://kubectl.docs.kubernetes.io).
