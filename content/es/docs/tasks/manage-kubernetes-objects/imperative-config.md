---
title: Administración Imperativa de Objetos de Kubernetes Mediante Archivos de Configuración
content_type: task
weight: 40
---

<!-- overview -->
Los objetos de Kubernetes se pueden crear, actualizar y eliminar utilizando la herramienta 
de línea de comandos `kubectl` junto con un archivo de configuración de objetos escrito en YAML o JSON. 
Este documento explica cómo definir y gestionar objetos utilizando archivos de configuración.


## {{% heading "prerequisites" %}}


Instalar [`kubectl`](/docs/tasks/tools/).

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}



<!-- steps -->

## Opciones

La herramienta `kubectl` admite tres tipos de administración de objetos:

* Comandos imperativos
* Configuración de objeto imperativo.
* Configuración de objeto declarativo

Consulta [Administración de objetos de Kubernetes](/docs/concepts/overview/working-with-objects/object-management/)
para una discusión de las ventajas y desventajas de cada tipo de administración de objetos.

## ¿Cómo crear objetos?

Puede usar `kubectl create -f` para crear un objeto a partir de un archivo de configuración.
Consulta la [referencia de la API de Kubernetes](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/)
para mas detalles.

* `kubectl create -f <filename|url>`

## ¿Cómo actualizar objetos?

{{< warning >}}
La actualización de objetos con el comando `replace` elimina todas las 
partes de la especificación no especificadas en el archivo de configuración. Esto no debe 
usarse con objetos cuyas especificaciones son administradas 
parcialmente por el clúster, como Services de tipo `LoadBalancer`, donde el 
campo `externalIPs` se administra independientemente del archivo de
configuración. Los campos administrados de forma independiente deben copiarse en 
el archivo de configuración para evitar que `replace` los elimine.
{{< /warning >}}

Puedes usar `kubectl replace -f` para actualizar un objeto en activo de acuerdo con un archivo de configuración.

* `kubectl replace -f <filename|url>`

## ¿Cómo eliminar objetos?

Puedes usar `kubectl delete -f` para eliminar un objeto que se describe en un
archivo de configuración.

* `kubectl delete -f <filename|url>`

{{< note >}}
Si el archivo de configuración especifica el campo `generateName` en la sección `metadata` en lugar del campo `name`, no puede eliminar el objeto usando `kubectl delete -f <filename|url>`. Tendrás que usar otras banderas para eliminar el objeto. Por ejemplo:

```shell
kubectl delete <type> <name>
kubectl delete <type> -l <label>
```
{{< /note >}}

## ¿Cómo ver un objeto?

Puedes usar `kubectl get -f` para ver información sobre un objeto que está
descrito en un archivo de configuración.

* `kubectl get -f <filename|url> -o yaml`

La bandera `-o yaml` especifica que se imprime la configuración completa del objeto. Utiliza `kubectl get -h` para ver una lista de opciones.

## Limitaciones
Los comandos `create`, `replace` y `delete` funcionan bien cuando la configuración de cada objeto está completamente definida y registrada en su archivo de configuración. Sin embargo, cuando se actualiza un objeto activo y las actualizaciones no se combinan en su archivo de configuración las actualizaciones se perderán la próxima vez que se ejecute un `replace`. Esto puede suceder si un controlador, como un HorizontalPodAutoscaler, realiza actualizaciones directamente a un objeto en activo. 
Los comandos `create`, `replace` y `delete` funcionan bien cuando la configuración de cada objeto 
está completamente definida y registrada en su archivo
de configuración. Sin embargo, cuando se actualiza un objeto activo y las actualizaciones no se combinan 
en su archivo de configuración las actualizaciones se perderán la próxima vez que 
se ejecute un `replace`. Esto puede suceder si un controlador, como un 
HorizontalPodAutoscaler, realice actualizaciones directamente a un objeto en activo. 


Ejemplo:

1. Creas un objeto a partir de un archivo de configuración.
1. Otra fuente actualiza el objeto cambiando algún campo.
1. Reemplaza el objeto del archivo de configuración. Cambios hechos por
la otra fuente en el paso 2 se pierden.

Si necesitas admitir varios escritores en el mismo objeto, puede usar `kubectl apply` para administrar el objeto.

## Crear y editar un objeto desde una URL sin guardar la configuración

Supongamos que tienes la URL de un archivo de configuración de objeto. Puedes usar
1. Exporta el objeto en vivo a un archivo de configuración de objeto local.
que apuntan a un archivo de configuración que podría ser modificado por el lector.


```shell
kubectl create -f <url> --edit
```

## Migración de comandos imperativos a configuración de objetos imperativos

La migración de comandos imperativos a la configuración de objetos imperativos implica varios pasos manuales.

1. Exporta el objeto en vivo a un archivo de configuración de objeto local.

    ```shell
    kubectl get <kind>/<name> -o yaml > <kind>_<name>.yaml
    ```

1. Elimina manualmente el campo de estado del archivo de configuración del objeto.

1. Para la gestión posterior de objetos, utiliza `replace` exclusivamente.

    ```shell
    kubectl replace -f <kind>_<name>.yaml
    ```

## Definiendo selectores de controlador y etiquetas PodTemplate

{{< warning >}}
Se desaconseja encarecidamente actualizar los selectores de los controladores.
{{< /warning >}}


El enfoque recomendado es definir una etiqueta PodTemplate única e inmutable utilizada únicamente por el selector del controlador sin ningún otro significado semántico.

Etiqueta de ejemplo:

```yaml
selector:
  matchLabels:
      controller-selector: "apps/v1/deployment/nginx"
template:
  metadata:
* [Referencia de la API de Kubernetes](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/)
      controller-selector: "apps/v1/deployment/nginx"
```



## {{% heading "whatsnext" %}}


* [Administración de objetos de Kubernetes mediante comandos imperativos](/docs/tasks/manage-kubernetes-objects/imperative-command/)
* [Gestión declarativa de objetos de Kubernetes mediante archivos de configuración](/docs/tasks/manage-kubernetes-objects/declarative-config/)
* [Referencia de comandos de Kubectl](/docs/reference/generated/kubectl/kubectl-commands/)
* [Referencia de API de Kubernetes](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/)


