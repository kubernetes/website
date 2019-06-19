---
title: Etiquetas recomendadas
content_template: templates/concept
---

{{% capture overview %}}
Puedes visualizar y gestionar los objetos de Kubernetes con herramientas adicionales a kubectl
y el propio tablero de control. Un conjunto común de etiquetas permite a dichas herramientas 
trabajar de forma interoperable, describiendo los objetos de una forma común que todas las
herramientas puedan entender.

Además del soporte a herramientas, las etiquetas recomendadas describen las aplicaciones
de forma que puedan ser consultadas.
{{% /capture %}}

{{% capture body %}}
Los metadatos se organizan en torno al concepto de una _aplicación_. Kubernetes no es
una plataforma como servicio (PaaS) y ni tiene o restringe la definición formal de una aplicación.
Al contrario, las aplicaciones son informales y se describen mediante el uso de los metadatos.
La definición de lo que contiene una aplicación es imprecisa.

{{< note >}}
Estas son las etiquetas recomendadas. Estas facilitan la gestión de aplicaciones,
pero no son obligatorias para las herramientas en general.
{{< /note >}}

Las etiquetas compartidas y las anotaciones comparten un prefijo común: `app.kubernetes.io`. 
Las etiquetas sin un prefijo son privadas para los usuarios. El prefijo compartido
garantiza que las etiquetas compartidas no entran en conflicto con las etiquetas
personalizadas de usuario.

## Etiquetas

Para beneficiarse al máximo del uso de estas etiquetas, estas deberían aplicarse a cada objeto de recurso.

| Clave                               | Descripción           | Ejemplo  | Tipo |
| ----------------------------------- | --------------------- | -------- | ---- |
| `app.kubernetes.io/name`            | El nombre de la aplicación | `mysql` | string |
| `app.kubernetes.io/instance`        | Un nombre único que identifique la instancia de la aplicación | `wordpress-abcxzy` | string |
| `app.kubernetes.io/version`         | La versión actual de la aplicación (ej., la versión semántica, cadena hash de revisión, etc.) | `5.7.21` | string |
| `app.kubernetes.io/component`       | El componente dentro de la arquitectura | `database` | string |
| `app.kubernetes.io/part-of`         | El nombre de una aplicación de nivel superior de la cual es parte esta aplicación | `wordpress` | string |
| `app.kubernetes.io/managed-by`  | La herramienta usada para gestionar la operativa de una aplicación | `helm` | string |

Para ilustrar estas etiquetas en acción, consideremos el siguiente objeto StatefulSet:

```yaml
apiVersion: apps/v1
kind: StatefulSet
metadata:
  labels:
    app.kubernetes.io/name: mysql
    app.kubernetes.io/instance: wordpress-abcxzy
    app.kubernetes.io/version: "5.7.21"
    app.kubernetes.io/component: database
    app.kubernetes.io/part-of: wordpress
    app.kubernetes.io/managed-by: helm
```

## Aplicaciones e Instancias de Aplicaciones

Una misma aplicación puede desplegarse una o más veces en un clúster de Kubernetes e,
incluso, el mismo espacio de nombres. Por ejemplo, wordpress puede instalarse más de una
vez de forma que sitios web diferentes sean instalaciones diferentes de wordpress.

El nombre de una aplicación y el nombre de la instancia se almacenan de forma separada. 
Por ejemplo, WordPress tiene un `app.kubernetes.io/name` igual a `wordpress` mientras que 
tiene un nombre de instancia, representado como `app.kubernetes.io/instance` con un valor de 
`wordpress-abcxzy`. Esto permite identificar tanto a la aplicación como a sus instancias. 
Cada instancia de una aplicación tiene su propio nombre único.

## Ejemplos

Para ilustrar las diferentes formas en que se puede utilizar las etiquetas, los siguientes ejemplos presentan distintas complejidades.

### Un Servicio Simple sin Estado

Considera el caso de un servicio simple sin estado desplegado mediante el uso de un objeto `Deployment` y `Service`. Los dos siguientes extractos de código representan cómo usar las etiquetas de la forma más sencilla.

El objeto `Deployment` se utiliza para supervisar los pods que ejecutan la propia aplicación.
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  labels:
    app.kubernetes.io/name: myservice
    app.kubernetes.io/instance: myservice-abcxzy
...
```

El objeto `Service` se utiliza para exponer la aplicación.
```yaml
apiVersion: v1
kind: Service
metadata:
  labels:
    app.kubernetes.io/name: myservice
    app.kubernetes.io/instance: myservice-abcxzy
...
```

### Aplicación Web con una Base de Datos

Considera una aplicación un poco más complicada: una aplicación web (WordPress)
que utiliza una base de datos (MySQL), instalada utilizando Helm. Los siguientes extractos
de código ilustran la parte inicial de los objetos utilizados para desplegar esta aplicación.

El comienzo del objeto `Deployment` siguiente se utiliza para WordPress:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  labels:
    app.kubernetes.io/name: wordpress
    app.kubernetes.io/instance: wordpress-abcxzy
    app.kubernetes.io/version: "4.9.4"
    app.kubernetes.io/managed-by: helm
    app.kubernetes.io/component: server
    app.kubernetes.io/part-of: wordpress
...
```

El objeto `Service` se emplea para exponer WordPress:

```yaml
apiVersion: v1
kind: Service
metadata:
  labels:
    app.kubernetes.io/name: wordpress
    app.kubernetes.io/instance: wordpress-abcxzy
    app.kubernetes.io/version: "4.9.4"
    app.kubernetes.io/managed-by: helm
    app.kubernetes.io/component: server
    app.kubernetes.io/part-of: wordpress
...
```

MySQL se expone como un objeto `StatefulSet` con metadatos tanto para sí mismo como para la aplicación global que lo contiene:

```yaml
apiVersion: apps/v1
kind: StatefulSet
metadata:
  labels:
    app.kubernetes.io/name: mysql
    app.kubernetes.io/instance: wordpress-abcxzy
    app.kubernetes.io/managed-by: helm
    app.kubernetes.io/component: database
    app.kubernetes.io/part-of: wordpress
    app.kubernetes.io/version: "5.7.21"
...
```

El objeto `Service` se usa para exponer MySQL como parte de WordPress:

```yaml
apiVersion: v1
kind: Service
metadata:
  labels:
    app.kubernetes.io/name: mysql
    app.kubernetes.io/instance: wordpress-abcxzy
    app.kubernetes.io/managed-by: helm
    app.kubernetes.io/component: database
    app.kubernetes.io/part-of: wordpress
    app.kubernetes.io/version: "5.7.21"
...
```

Con los objetos `StatefulSet` y `Service` de MySQL te darás cuenta que se incluye la información acerca de MySQL y Wordpress, la aplicación global.

{{% /capture %}}