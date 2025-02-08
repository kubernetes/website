---
title: Gestión de Objetos en Kubernetes
content_type: concept
weight: 20
---

<!-- overview -->
La herramienta de línea de comandos `kubectl` admite varias formas de crear y gestionar
{{< glossary_tooltip text="objetos" term_id="object" >}} de Kubernetes. Este documento proporciona una visión general de los diferentes
enfoques. Consulta el [Libro de Kubectl](https://kubectl.docs.kubernetes.io) para
detalles sobre la gestión de objetos mediante Kubectl.

<!-- body -->

## Técnicas de gestión

{{< warning >}}
Un objeto de Kubernetes debe gestionarse utilizando una única técnica. Mezclar
técnicas para el mismo objeto puede resultar en comportamientos no definidos.
{{< /warning >}}

| Técnica de gestión                   | Opera sobre              | Entorno recomendado     | Escritores admitidos | Curva de aprendizaje |
|--------------------------------------|--------------------------|-------------------------|----------------------|----------------------|
| Comandos imperativos                 | Objetos en vivo          | Proyectos de desarrollo | 1+                   | Más baja             |
| Configuración imperativa de objetos  | Archivos individuales    | Proyectos en producción | 1                    | Moderada             |
| Configuración declarativa de objetos | Directorios de archivos  | Proyectos en producción | 1+                   | Más alta             |

## Comandos imperativos

Al usar comandos imperativos, un usuario opera directamente sobre objetos en vivo
en un clúster. El usuario proporciona operaciones al
comando `kubectl` como argumentos o banderas.

Esta es la forma recomendada para comenzar o ejecutar tareas puntuales en
un clúster. Dado que esta técnica opera directamente sobre objetos
en vivo, no guarda un historial de configuraciones previas.

### Ejemplos

Ejecuta una instancia del contenedor nginx creando un objeto Deployment:

```sh
kubectl create deployment nginx --image nginx
```

### Ventajas y desventajas

**Ventajas en comparación con la configuración de objetos:**

- Los comandos se expresan como una sola palabra de acción.
- Los comandos requieren solo un paso para realizar cambios en el clúster.

**Desventajas en comparación con la configuración de objetos:**

- Los comandos no se integran con procesos de revisión de cambios.
- Los comandos no proporcionan un registro de auditoría asociado a los cambios.
- Los comandos no ofrecen un registro fuente, excepto para lo que está en vivo.
- Los comandos no brindan una plantilla para crear nuevos objetos.

---

## Configuración imperativa de objetos

En la configuración imperativa de objetos, el comando `kubectl` especifica la operación (`create`, `replace`, etc.), banderas opcionales y al menos un nombre de archivo. El archivo especificado debe contener una definición completa del objeto en formato YAML o JSON.

Consulta la [referencia de la API](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/) para obtener más detalles sobre las definiciones de objetos.

{{< warning >}}
El comando imperativo `replace` reemplaza la especificación existente con la nueva proporcionada, descartando todos los cambios en el objeto que no estén en el archivo de configuración. Este enfoque **no debe usarse** con tipos de recursos cuyas especificaciones se actualicen de forma independiente al archivo de configuración. Por ejemplo, los servicios de tipo `LoadBalancer` tienen su campo `externalIPs` actualizado de manera independiente por el clúster.
{{< /warning >}}

### Ejemplos

Crear los objetos definidos en un archivo de configuración:

```sh
kubectl create -f nginx.yaml
```

Eliminar los objetos definidos en dos archivos de configuración:

```sh
kubectl delete -f nginx.yaml -f redis.yaml
```

Actualizar los objetos definidos en un archivo de configuración sobrescribiendo la configuración en vivo:

```sh
kubectl replace -f nginx.yaml
```

### Compensaciones

Ventajas en comparación con los comandos imperativos:

- La configuración de objetos puede almacenarse en un sistema de control de versiones como Git.
- La configuración de objetos puede integrarse con procesos como la revisión de cambios antes de enviarlos y auditorías.
- La configuración de objetos proporciona una plantilla para crear nuevos objetos.

Desventajas en comparación con los comandos imperativos:

- La configuración de objetos requiere un conocimiento básico del esquema del objeto.
- La configuración de objetos requiere el paso adicional de escribir un archivo YAML.

Ventajas en comparación con la configuración declarativa de objetos:

- El comportamiento de la configuración imperativa de objetos es más simple y fácil de entender.
- A partir de la versión 1.5 de Kubernetes, la configuración imperativa de objetos es más madura.

Desventajas en comparación con la configuración declarativa de objetos:

- La configuración imperativa de objetos funciona mejor con archivos, no con directorios.
- Las actualizaciones a los objetos en vivo deben reflejarse en los archivos de configuración, o se perderán durante la próxima reemplazo.

## Configuración declarativa de objetos

Cuando se utiliza la configuración declarativa de objetos, un usuario opera sobre archivos de configuración de objetos almacenados localmente, pero no define las operaciones que se realizarán en los archivos. Las operaciones de creación, actualización y eliminación se detectan automáticamente por objeto mediante `kubectl`. Esto permite trabajar con directorios, donde podrían ser necesarias diferentes operaciones para diferentes objetos.

{{< note >}}
La configuración declarativa de objetos conserva los cambios realizados por otros escritores, incluso si los cambios no se fusionan de nuevo en el archivo de configuración del objeto. Esto es posible utilizando la operación de API `patch` para escribir solo las diferencias observadas, en lugar de utilizar la operación de API `replace` para reemplazar toda la configuración del objeto.
{{< /note >}}

### Ejemplos

Procesa todos los archivos de configuración de objetos en el directorio `configs`, y crea o aplica parches a los objetos en vivo. Primero puedes usar `diff` para ver qué cambios se van a realizar, y luego aplicar:

```sh
kubectl diff -f configs/
kubectl apply -f configs/

Recursively process directories:

```sh
kubectl diff -R -f configs/
kubectl apply -R -f configs/
```

### Compensaciones

Ventajas en comparación con la configuración imperativa de objetos:

- Los cambios realizados directamente en los objetos en vivo se conservan, incluso si no se fusionan de nuevo en los archivos de configuración.
- La configuración declarativa de objetos tiene un mejor soporte para operar en directorios y detectar automáticamente los tipos de operación (crear, aplicar parches, eliminar) por objeto.

Desventajas en comparación con la configuración imperativa de objetos:

- La configuración declarativa de objetos es más difícil de depurar y entender los resultados cuando son inesperados.
- Las actualizaciones parciales utilizando diferencias crean operaciones de fusión y aplicación de parches complejas.

## {{% heading "whatsnext" %}}

- [Gestión de objetos de Kubernetes usando comandos imperativos](/docs/tasks/manage-kubernetes-objects/imperative-command/)
- [Gestión imperativa de objetos de Kubernetes usando archivos de configuración](/docs/tasks/manage-kubernetes-objects/imperative-config/)
- [Gestión declarativa de objetos de Kubernetes usando archivos de configuración](/docs/tasks/manage-kubernetes-objects/declarative-config/)
- [Gestión declarativa de objetos de Kubernetes usando Kustomize](/docs/tasks/manage-kubernetes-objects/kustomization/)
- [Referencia de comandos de Kubectl](/docs/reference/generated/kubectl/kubectl-commands/)
- [Libro de Kubectl](https://kubectl.docs.kubernetes.io)
- [Referencia de la API de Kubernetes](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/)
