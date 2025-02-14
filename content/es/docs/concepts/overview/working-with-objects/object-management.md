---
title: Gestión de Objetos en Kubernetes
content_type: concepto
weight: 20
---

<!-- overview -->
La herramienta de línea de comandos `kubectl` admite varias formas diferentes de crear y gestionar
Kubernetes {{< glossary_tooltip text="objects" term_id="object" >}}. Este documento proporciona una visión general de los diferentes
enfoques. Lea el [libro de Kubectl](https://kubectl.docs.kubernetes.io) para obtener
detalles sobre la gestión de objetos mediante Kubectl.

<!-- body -->

## Técnicas de gestión

{{< warning >}}
Un objeto Kubernetes debe ser gestionado utilizando una sola técnica. Mezclar
y técnicas coincidentes para el mismo objeto resulta en un comportamiento indefinido.
{{< /warning >}}

| Técnica de gestión                   | Opera sobre             | Entorno recomendado      | Escritores soportados | Curva de aprendizaje |
| ------------------------------------ | ----------------------- | ------------------------ | --------------------- | -------------------- |
| Comandos imperativos                 | Objetos activos         | Proyectos de desarrollo  | 1+                    | Más baja             |
| Configuración imperativa de objetos  | Archivos individuales   | Proyectos de producción  | 1                     | Moderada             |
| Configuración declarativa de objetos | Directorios de archivos | Proyectos de producción  | 1+                    | Más alta             |

## Órdenes imperativas

Cuando se utilizan comandos imperativos, un usuario opera directamente sobre objetos vivos
en un clúster. El usuario proporciona operaciones al comando
al comando `kubectl` como argumentos o banderas.

Esta es la forma recomendada para empezar o para ejecutar una tarea puntual en
un clúster. Dado que esta técnica opera directamente sobre objetos
no proporciona ningún historial de configuraciones anteriores.


### Ejemplos

Ejecuta una instancia del contenedor nginx creando un objeto Deployment:

```sh
kubectl create deployment nginx --image nginx
```

### Compromisos

Ventajas frente a la configuración de objetos:

- Los comandos se expresan como una sola palabra de acción.
- Los comandos sólo requieren un único paso para realizar cambios en el clúster.

Desventajas en comparación con la configuración de objetos:

- Los comandos no se integran con los procesos de revisión de cambios.
- Los comandos no proporcionan una pista de auditoría asociada a los cambios.
- Los comandos no proporcionan una fuente de registros excepto para lo que está en vivo.
- Los comandos no proporcionan una plantilla para crear nuevos objetos.

## Configuración imperativa de objetos

En la configuración de objetos imperativos, el comando kubectl especifica la operación
operación (crear, reemplazar, etc.), banderas opcionales y al menos un nombre de archivo.
archivo. El archivo especificado debe contener una definición completa del objeto
en formato YAML o JSON.

Consulte la [API reference](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/)
para obtener más detalles sobre las definiciones de objetos.

{{< warning >}}
El comando imperativo `replace` sustituye la especificación
existente con la nueva especificación, eliminando todos los cambios en el objeto que falta en el archivo de configuración.
el archivo de configuración.  Este método no debe utilizarse con tipos de recursos
cuyas especificaciones se actualizan independientemente del fichero de configuración.
Los servicios de tipo `LoadBalancer`, por ejemplo, tienen su campo `externalIPs` actualizado
independientemente de la configuración del cluster.
{{< /warning >}}

### Ejemplos

Crea los objetos definidos en un fichero de configuración:

```sh
kubectl create -f nginx.yaml
```

Delete the objects defined in two configuration files:

```sh
kubectl delete -f nginx.yaml -f redis.yaml
```

Update the objects defined in a configuration file by overwriting
the live configuration:

```sh
kubectl replace -f nginx.yaml
```

### Compromisos

Ventajas en comparación con los comandos imperativos:

- La configuración de objetos puede almacenarse en un sistema de control de fuentes como Git.
- La configuración de objetos puede integrarse con procesos como la revisión de cambios antes de enviarlos y los registros de auditoría.
- La configuración de objetos proporciona una plantilla para crear nuevos objetos.

Desventajas en comparación con los comandos imperativos:

- La configuración de objetos requiere una comprensión básica del esquema de objetos.
- La configuración de objetos requiere el paso adicional de escribir un archivo YAML.

Ventajas en comparación con la configuración de objetos declarativa:

- El comportamiento de la configuración de objetos imperativa es más simple y fácil de entender.
- A partir de la versión 1.5 de Kubernetes, la configuración imperativa de objetos está más madura.

Desventajas en comparación con la configuración de objetos declarativa:

- La configuración imperativa de objetos funciona mejor en archivos, no en directorios.
- Las actualizaciones de los objetos vivos deben reflejarse en los archivos de configuración, o se perderán durante el siguiente reemplazo.


## Configuración declarativa de objetos

Cuando se utiliza la configuración declarativa de objetos, un usuario opera sobre archivos de configuración de objetos almacenados localmente.
archivos de configuración de objetos almacenados localmente, sin embargo el usuario no define las
operaciones a realizar sobre los ficheros. Las operaciones de creación, actualización y eliminación
son detectadas automáticamente por objeto por `kubectl`. Esto permite trabajar en
directorios, donde pueden ser necesarias diferentes operaciones para diferentes objetos.

{{< note >}}
La configuración declarativa de objetos conserva los cambios realizados por otros
aunque los cambios no se fusionen con el archivo de configuración de objetos.
Esto es posible utilizando la operación `patch` de la API para escribir sólo
diferencias observadas, en lugar de utilizar la operación de la API `replace`
para reemplazar toda la configuración del objeto.
{{< /note >}}

### Ejemplos

Procesa todos los archivos de configuración de objetos del directorio `configs`, y crea o
parchear los objetos activos. Primero puedes `diff` para ver qué cambios se van a hacer
y luego aplicarlos:

```sh
kubectl diff -f configs/
kubectl apply -f configs/
```

Procesar directorios de forma recursiva:

```sh
kubectl diff -R -f configs/
kubectl apply -R -f configs/
```

### Compromisos

Ventajas en comparación con la configuración imperativa de objetos:

- Los cambios realizados directamente en los objetos vivos se conservan, incluso si no se fusionan de nuevo en los archivos de configuración.
- La configuración declarativa de objetos tiene un mejor soporte para operar en directorios y detectar automáticamente los tipos de operación (crear, parchear, borrar) por objeto.

Desventajas en comparación con la configuración imperativa de objetos:

- La configuración declarativa de objetos es más difícil de depurar y entender los resultados cuando son inesperados.
- Las actualizaciones parciales mediante diffs crean complejas operaciones de fusión y parcheo.

## {{% heading "whatsnext" %}}

- [Managing Kubernetes Objects Using Imperative Commands](/docs/tasks/manage-kubernetes-objects/imperative-command/)
- [Imperative Management of Kubernetes Objects Using Configuration Files](/docs/tasks/manage-kubernetes-objects/imperative-config/)
- [Declarative Management of Kubernetes Objects Using Configuration Files](/docs/tasks/manage-kubernetes-objects/declarative-config/)
- [Declarative Management of Kubernetes Objects Using Kustomize](/docs/tasks/manage-kubernetes-objects/kustomization/)
- [Kubectl Command Reference](/docs/reference/generated/kubectl/kubectl-commands/)
- [Kubectl Book](https://kubectl.docs.kubernetes.io)
- [Kubernetes API Reference](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/)

