---
title: Anotaciones
content_template: templates/concept
weight: 50
---

{{% capture overview %}}
Puedes usar las anotaciones de Kubernetes para adjuntar metadatos arbitrarios a los objetos, de tal forma que clientes como herramientas y librerías puedan obtener fácilmente dichos metadatos.
{{% /capture %}}

{{% capture body %}}
## Adjuntar metadatos a los objetos

Puedes usar las etiquetas o anotaciones para adjuntar metadatos a los objetos de Kubernetes. 
Las etiquetas pueden utilizarse para seleccionar objetos y para encontrar colecciones de objetos que satisfacen ciertas condiciones.
Por el contrario, las anotaciones no se utilizan para identificar y seleccionar objetos.
Los metadatos de una anotación pueden ser pequeños o grandes, estructurados o no estructurados,
y pueden incluir caracteres no permitidos en las etiquetas.

Las anotaciones, al igual que las etiquetas, son mapas de clave/valor:

```json
"metadata": {
  "annotations": {
    "key1" : "value1",
    "key2" : "value2"
  }
}
```

Aquí se presentan algunos ejemplos de información que podría ser indicada como anotaciones:

* Campos gestionados por una capa de configuración declarativa.
  Adjuntando dichos campos como anotaciones permitiría diferenciarlos de los
  valores por defecto establecidos por clientes o servidores, además de los 
  campos auto-generados y los campos modificados por sistemas de auto-escalado.

* Información acerca de la construcción, entrega, o imagen como marcas de fecha, IDs de entrega, rama de Git,
  número de PR, funciones hash de imágenes, y direcciones de registro.

* Referencias a los repositorios de trazas, monitorización, analíticas, o auditoría.

* Información de librería de cliente o herramienta que puede usarse con fines de depuración de código:
  por ejemplo, nombre, versión, e información de construcción.

* Información de usuario o procedencia de herramienta/sistema, como las URLs de los
  objetos provenientes de otros componentes del ecosistema.

* Metadatos para una herramienta ligera de lanzamiento de aplicaciones: por ejemplo, configuración o puntos de control.

* Número de teléfono o contacto de las personas a cargo, o entradas de directorio que
  especifican dónde puede encontrarse dicha información, como la página web de un equipo de trabajo.

* Directivas del usuario final a las implementaciones para modificar el comportamiento
  o solicitar funcionalidades no estándar.

En vez de usar anotaciones, podrías almacenar este tipo de información en una
base de datos externa o un directorio, pero eso complicaría enormemente la posibilidad
de crear librerías compartidas de cliente, así como herramientas para el 
despliegue, gestión, introspección, y similares.

## Sintaxis y conjunto de caracteres

Las _Anotaciones_ son entradas clave/valor. Una clave válida para una anotación tiene dos partes: un prefijo opcional y un nombre, separados por una barra (`/`). La parte del nombre es obligatoria y debe tener 63 caracteres o menos, empezando y terminando con un carácter alfanumérico (`[a-z0-9A-Z]`) con guiones (`-`), guiones bajos (`_`), puntos (`.`) en medio. El prefijo es opcional. Si se indica, 
el prefijo debe ser un subdominio DNS: una serie de etiquetas DNS separadas por puntos (`.`), no superior a 253 caracteres en total, seguida de una barra (`/`).

Si se omite el prefijo, la clave de la anotación se entiende que es privada para el usuario. Los componentes automatizados del sistema (e.g. `kube-scheduler`, `kube-controller-manager`, `kube-apiserver`, `kubectl`, u otros de terceros) que añaden anotaciones a los objetos de usuario deben, pues, especificar un prefijo.

Los prefijos `kubernetes.io/` y `k8s.io/` se reservan para el uso exclusivo de los componentes principales de Kubernetes.

{{% /capture %}}

{{% capture whatsnext %}}
Aprende más acerca de las [Etiquetas y Selectores](/docs/concepts/overview/working-with-objects/labels/).
{{% /capture %}}


