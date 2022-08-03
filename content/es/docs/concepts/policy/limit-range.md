---
reviewers:
- raelga
title: Rangos de límites (Limit Ranges)
description: >
    Aplica límites de recursos a un Namespace para restringir y garantizar la asignación y consumo de recursos informáticos.
content_type: concept
weight: 10
---

<!-- overview -->

### Contexto

Por defecto, los contenedores se ejecutan sin restricciones sobre los [recursos informáticos disponibles en un clúster de Kubernetes](/docs/concepts/configuration/manage-resources-containers/).
Si el {{< glossary_tooltip text="Nodo" term_id="node" >}} dispone de los recursos informáticos, un {{< glossary_tooltip text="Pod" term_id="pod" >}} o sus {{< glossary_tooltip text="Contenedores" term_id="container" >}} tienen permitido consumir por encima de la cuota solicitada si no superan el límite establecido en su especificación.
Existe la preocupación de que un Pod o Contenedor pueda monopolizar todos los recursos disponibles.

### Utilidad

Aplicando restricciones de asignación de recursos, los administradores de clústeres se aseguran del cumplimiento del consumo de recursos por espacio de nombre ({{< glossary_tooltip text="Namespace" term_id="namespace" >}}).

Un **{{< glossary_tooltip text="LimitRange" term_id="limitrange" >}}** es la política que permite:

- Imponer restricciones de requisitos de recursos a {{< glossary_tooltip text="Pods" term_id="pod" >}} o {{< glossary_tooltip text="Contenedores" term_id="container" >}} por Namespace.
- Imponer las limitaciones de recursos mínimas/máximas para Pods o Contenedores dentro de un Namespace.
- Especificar requisitos y límites de recursos predeterminados para Pods o Contenedores de un Namespace.
- Imponer una relación de proporción entre los requisitos y el límite de un recurso.
- Imponer el cumplimiento de las demandas de almacenamiento mínimo/máximo para {{< glossary_tooltip text="Solicitudes de Volúmenes Persistentes" term_id="persistent-volume-claim" >}}.

### Habilitar el LimitRange

La compatibilidad con LimitRange está habilitada por defecto en Kubernetes desde la versión 1.10.

Para que un LimitRange se active en un {{< glossary_tooltip text="Namespace" term_id="namespace" >}} en particular, el LimitRange debe definirse con el Namespace, o aplicarse a éste.

El nombre de recurso de un objeto LimitRange debe ser un
[nombre de subdominio DNS](/docs/concepts/overview/working-with-objects/names#dns-subdomain-names) válido.

### Aplicando LimitRanges

- El administrador crea un LimitRange en un {{< glossary_tooltip text="Namespace" term_id="namespace" >}}.
- Los usuarios crean recursos como {{< glossary_tooltip text="Pods" term_id="pod" >}}, {{< glossary_tooltip text="Contenedores" term_id="container" >}} o {{< glossary_tooltip text="Solicitudes de Volúmenes Persistentes" term_id="persistent-volume-claim" >}} en el Namespace.
- El controlador de admisión `LimitRanger` aplicará valores predeterminados y límites, para todos los Pods o Contenedores que no establezcan requisitos de recursos informáticos. Y realizará un seguimiento del uso para garantizar que no excedan el mínimo, el máximo, y la proporción de ningún LimitRange definido en el Namespace.
- Si al crear o actualizar un recurso del ejemplo (Pods, Contenedores, {{< glossary_tooltip text="Solicitudes de Volúmenes Persistentes" term_id="persistent-volume-claim" >}}) se viola una restricción al LimitRange, la solicitud al servidor API fallará con un código de estado HTTP "403 FORBIDDEN" y un mensaje que explica la restricción que se ha violado.
- En caso de que en se active un LimitRange para recursos de cómputos como `cpu` y `memory`, los usuarios deberán especificar los requisitos y/o límites de recursos a dichos valores. De lo contrario, el sistema puede rechazar la creación del Pod.
- Las validaciones de LimitRange ocurren solo en la etapa de Admisión de Pod, no en Pods que ya se han iniciado (Running {{< glossary_tooltip text="Pods" term_id="pod" >}}).

Algunos ejemplos de políticas que se pueden crear utilizando rangos de límites son:

- En un clúster de 2 nodos con una capacidad de 8 GiB de RAM y 16 núcleos, podría restringirse los {{< glossary_tooltip text="Pods" term_id="pod" >}} en un {{< glossary_tooltip text="Namespace" term_id="namespace" >}} a requerir `100m` de CPU con un límite máximo de `500m` para CPU y requerir `200Mi` de memoria con un límite máximo de `600Mi` de memoria.
- Definir el valor por defecto de límite y requisitos de CPU a `150m` y el valor por defecto de requisito de memoria a `300Mi` {{< glossary_tooltip text="Contenedores" term_id="container" >}} que se iniciaron sin requisitos de CPU y memoria en sus especificaciones.

En el caso de que los límites totales del {{< glossary_tooltip text="Namespace" term_id="namespace" >}} sean menores que la suma de los límites de los {{< glossary_tooltip text="Pods" term_id="pod" >}},
puede haber contienda por los recursos. En este caso, los contenedores o pods no seran creados.

Ni la contención ni los cambios en un LimitRange afectarán a los recursos ya creados.

## {{% heading "whatsnext" %}}

Consulte el [documento de diseño del LimitRanger](https://git.k8s.io/design-proposals-archive/resource-management/admission_control_limit_range.md) para más información.

Los siguientes ejemplos utilizan límites y están pendientes de su traducción:

- [how to configure minimum and maximum CPU constraints per namespace](/docs/tasks/administer-cluster/manage-resources/cpu-constraint-namespace/).
- [how to configure minimum and maximum Memory constraints per namespace](/docs/tasks/administer-cluster/manage-resources/memory-constraint-namespace/).
- [how to configure default CPU Requests and Limits per namespace](/docs/tasks/administer-cluster/manage-resources/cpu-default-namespace/).
- [how to configure default Memory Requests and Limits per namespace](/docs/tasks/administer-cluster/manage-resources/memory-default-namespace/).
- [how to configure minimum and maximum Storage consumption per namespace](/docs/tasks/administer-cluster/limit-storage-consumption/#limitrange-to-limit-requests-for-storage).
- [a detailed example on configuring quota per namespace](/docs/tasks/administer-cluster/manage-resources/quota-memory-cpu-namespace/).
