---
reviewers:
- raelga
title: API de Kubernetes
content_type: concept
weight: 30
card:
  name: concepts
  weight: 30
---

<!-- overview -->

Las convenciones globales de la API se describen en el [documento de convenciones de la API](https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md).

Los endpoints, tipos de recursos y ejemplos se describen en la [Referencia](/es/docs/reference) de la API.

El acceso remoto a la API se discute en el documento [Controlando el acceso a la API](/docs/reference/access-authn-authz/controlling-access/).

La API de Kubernetes sirve como base para el esquema de configuración declarativa del sistema. La herramienta de
línea de comandos [kubectl](/docs/reference/kubectl/overview/) puede ser usada para crear, actualizar, eliminar y consultar objetos a través de la API.

Kubernetes también almacena el estado de los recursos de la API en forma serializada. Actualmente esto se hace en [etcd](https://coreos.com/docs/distributed-configuration/getting-started-with-etcd/).

Kubernetes está compuesto, en si mismo, por varios componentes que interactúan a través de su API.

<!-- body -->

## Cambios a la API

En nuestra experiencia, cualquier sistema exitoso necesita crecer y evolucionar al cambiar o emerger nuevos casos de uso. Por lo tanto, esperamos que la API de Kubernetes cambie y crezca continuamente. Dicho esto, nuestro objetivo es no romper la compatibilidad con los clientes ya existentes, por un período de tiempo razonable. En general, podemos esperar que se agreguen nuevos recursos y propiedades con cierta frecuencia. Para eliminar un recurso o propiedad, se requiere seguir la [política de obsolescencia de la API](/docs/reference/using-api/deprecation-policy/).

En el documento de [cambios a la API](https://git.k8s.io/community/contributors/devel/sig-architecture/api_changes.md) describimos como cambiar la API y definimos lo que es considerado como un cambio compatible.

## Definiciones OpenAPI y Swagger

Los detalles completos de la API se documentan usando [OpenAPI](https://www.openapis.org/).

A partir de Kubernetes 1.10, el servidor de API de Kubernetes provee una especificación OpenAPI en el endpoint  `/openapi/v2`.

Se puede solicitar un formato en particular utilizando las siguientes cabeceras HTTP:

| Cabecera        | Valores admitidos                                                                                                                                                                  |
| --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Accept          | `application/json`, `application/com.github.proto-openapi.spec.v2@v1.0+protobuf` (el content-type predeterminado es `application/json` si esta cabecera contiene `*/*` o se omite) |
| Accept-Encoding | `gzip` (esta cabecera es opcional)                                                                                                                                                 |

Antes de 1.14, los endpoints separados por formato (`/swagger.json`, `/swagger-2.0.0.json`, `/swagger-2.0.0.pb-v1`, `/swagger-2.0.0.pb-v1.gz`)
servían la especificación OpenAPI en distintos formatos. Estos endpoints se consideran obsoletos y serán removidos en Kubernetes 1.14.

**Ejemplos**:

| Antes de 1.10               | A partir de 1.10                                                                                                 |
| --------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| GET /swagger.json           | GET /openapi/v2 **Accept**: application/json                                                                     |
| GET /swagger-2.0.0.pb-v1    | GET /openapi/v2 **Accept**: application/com.github.proto-openapi.spec.v2@v1.0+protobuf                           |
| GET /swagger-2.0.0.pb-v1.gz | GET /openapi/v2 **Accept**: application/com.github.proto-openapi.spec.v2@v1.0+protobuf **Accept-Encoding**: gzip |

Kubernetes implementa un formato alternativo de serialización basado en [Protocol Buffer (_Protobuf_)](https://developers.google.com/protocol-buffers/) diseñado principalmente para las comunicaciones dentro del clúster. Este formato está documentado en su [propuesta de diseño](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/api-machinery/protobuf.md) y los archivos IDL de cada esquema se encuentran en los paquetes de Go que definen los objetos de la API.

Antes de 1.14, el `apiserver` de Kubernetes ofrecía una API para obtener la especificación [Swagger v1.2](http://swagger.io/) de la API de Kubernetes en `/swaggerapi`. Este endpoint se considera obsoleto y será removido en Kubernetes 1.14.

## Versionado de la API

Para facilitar la eliminación de propiedades o reestructurar la representación de un recurso, Kubernetes soporta múltiples versiones de la API en distintas rutas como `/api/v1` or `/apis/extensions/v1beta1`.

Se versiona a nivel de la API en vez de a nivel de los recursos o propiedades para asegurarnos de que la API presenta una visión clara y consistente de los recursos y el comportamiento del sistema, y para controlar el acceso a las APIs experimentales o que estén terminando su ciclo de vida. Los esquemas de serialización JSON y Protobuf siguen los mismos lineamientos para los cambios, es decir, estas descripciones cubren ambos formatos.

Se ha de tener en cuenta que hay una relación indirecta entre el versionado de la API y el versionado del resto del software. La propuesta de [versionado de la API y releases](https://git.k8s.io/design-proposals-archive/release/versioning.md) describe esta relación.

Las distintas versiones de la API implican distintos niveles de estabilidad y soporte. El criterio para cada nivel se describe en detalle en la documentación de [Cambios a la API](https://git.k8s.io/community/contributors/devel/sig-architecture/api_changes.md#alpha-beta-and-stable-versions). A continuación se ofrece un resumen:

- Nivel "alpha":
  - El nombre de la versión contiene `alpha` (p. ej., `v1alpha1`).
  - Puede tener muchos errores. Activar esta característica podría exponer errores. Desactivada por defecto.
  - El soporte para esta característica podría ser eliminado sin previo aviso.
  - La API podría volverse incompatible en el futuro y sin previo aviso.
  - Se recomienda su uso solo en clústers efímeros y de prueba ya que hay mayor riesgo de errores y carece de soporte a largo plazo
- Nivel "beta":
  - El nombre de la versión contiene `beta` (p. ej., `v2beta3`).
  - El código ha sido probado. Activar esta característica es seguro. Activada por defecto.
  - Los detalles de esta característica podrían cambiar, pero se mantendrá el soporte.
  - El esquema y/o la semántica de un objeto podría volverse incompatible en el futuro. Si esto pasa, se ofrecerán instrucciones para migrar a una nueva versión. Esto podría requerir eliminar, editar o volver a crear objetos. El proceso de edición podría requerir planificación, incluyendo tiempo de inactividad para aplicaciones que usaban esta característica.
  - No se recomienda para aplicaciones críticas de negocio ya que podría volverse incompatible en futuras versiones. Si tiene múltiples clústeres que pueden actualizarse de forma independiente se podría decidir correr este riesgo.
  - **Por favor, ¡pruebe las características en fase beta y comparta sus comentarios! Una vez que salgan de la fase beta, sería más difícil hacer cambios.**
- Nivel estable:
  - El nombre de la versión es `vX` donde `X` es un entero.
  - Las versiones estables de las características aparecerán en los siguientes releases.

## Grupos de API

Para que sea más fácil extender la API de Kubernetes, se han creado los [*grupos de API*](https://git.k8s.io/design-proposals-archive/api-machinery/api-group.md).
Estos grupos se especifican en una ruta REST y en la propiedad `apiVersion` de un objeto serializado.

Actualmente hay varios grupos de API en uso:

1. El grupo *core* (o *group*) en la ruta REST `/api/v1` y usa `apiVersion: v1`.

2. Los grupos con entidad propia están en la ruta REST `/apis/$NOMBRE_GRUPO/$VERSION` y usan `apiVersion: $NOMBRE_GRUPO/$VERSION`.
   (p. ej., `apiVersion: batch/v1`).  La lista completa de los grupos soportados está disponible en la [Referencia de la API](/es/docs/reference/).


Hay dos rutas soportadas para extender la API con [recursos personalizados](/docs/concepts/api-extension/custom-resources/):

1. [CustomResourceDefinition](/docs/tasks/access-kubernetes-api/extend-api-custom-resource-definitions/)
   es para los usuarios que tengan necesidades CRUD muy básicas.
2. Los usuarios que necesiten la semántica completa de la API pueden implementar su propio `apiserver`
   usando el [agregador](/docs/tasks/access-kubernetes-api/configure-aggregation-layer/) para hacerlo
   transparente para los clientes.

## Activar los grupos de API

Ciertos recursos y grupos de API están activados por defecto. Pueden activarse o desactivarse con la opción `--runtime-config` en `apiserver`. `--runtime-config` acepta valores separados por coma. Por ejemplo, para desactivar `batch/v1`, use la opción
`--runtime-config=batch/v1=false`. Para activar `batch/v2alpha1`, pase la opción `--runtime-config=batch/v2alpha1`.
Esta opción acepta pares de `clave=valor` separados por coma que describen la configuración operativa del `apiserver`.

**IMPORTANTE:** Activar o desactivar grupos o recursos requiere reiniciar el `apiserver` y el controller-manager para que estos reconozcan los cambios a `--runtime-config`.

## Activar recursos en los grupos

Los `DaemonSets`, `Deployments`, `HorizontalPodAutoscalers`, `Ingresses`, `Jobs` y `ReplicaSets` están activados por defecto.

Se pueden activar otros recursos con la opción `--runtime-config` del `apiserver`. Por ejemplo, como `--runtime-config` acepta valores separados por coma, puede desactivar los Deployments y los Ingress con la opción
`--runtime-config=extensions/v1beta1/deployments=false,extensions/v1beta1/ingresses=false`
