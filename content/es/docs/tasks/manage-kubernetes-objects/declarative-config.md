---
title: Administración declarativa de Objetos en Kubernetes usando Ficheros de Configuración
content_type: task
weight: 10
---

<!-- overview -->
Objetos en Kubernetes pueden ser creados, actualizados y eliminados utilizando
ficheros de configuración almacenados en un directorio. Usando el comando
`kubectl apply` podrá crearlos o actualizarlos de manera recursiva según sea necesario.
Este método retiene cualquier escritura realizada contra objetos activos en el
sistema sin unirlos de regreso a los ficheros de configuración. `kubectl diff` le
permite visualizar de manera previa los cambios que `apply` realizará.

## {{% heading "prerequisites" %}}


Instale [`kubectl`](/es/docs/tasks/tools/install-kubectl/).

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}


<!-- steps -->

## Modos de administración

La herramienta `kubectl` soporta tres modos distintos para la administración de objetos:

* Comandos imperativos
* Configuración de objetos imperativa
* Configuración de objetos declarativa

Acceda [Kubernetes Object Management](/docs/concepts/overview/working-with-objects/object-management/)
para una discusión de las ventajas y desventajas de cada modo distinto de administración.

## Visión general

La configuración de objetos declarativa requiere una comprensión firme de la
definición y configuración de objetos de Kubernetes. Lea y complete los siguientes
documentos si aún no lo ha hecho:

* [Administració n de Objetos de Kubernetes usando comandos imperativos](/docs/tasks/manage-kubernetes-objects/imperative-command/)
* [Administración imperativa de los Objetos de Kubernetes usando ficheros de Configuración](/docs/tasks/manage-kubernetes-objects/imperative-config/)

{{< comment >}}
TODO(lmurillo): Update the links above to the spanish versions of these documents once the
localizations become available
{{< /comment >}}

A continuación la definición de términos usados en este documento:

- *fichero de configuración de objeto / fichero de configuración*: Un fichero en el
  que se define la configuración de un objeto de Kubernetes. Este tema muestra como
  utilizar ficheros de configuración con `kubectl apply`. Los ficheros de configuración
  por lo general se almacenan en un sistema de control de versiones, como Git.
- *configuración activa de objeto / configuración activa*: Los valores de configuración
  activos de un objeto, según estén siendo observados por el Clúster. Esta configuración
  se almacena en el sistema de almacenamiento de Kubernetes, usualmente etcd.
- *escritor de configuración declarativo / escritor declarativo*: Una persona o
  componente de software que actualiza a un objeto activo. Los escritores activos a
  los que se refiere este tema aplican cambios a los ficheros de configuración de objetos
  y ejecutan `kubectl apply` para aplicarlos.

## Como crear objetos

Utilice `kubectl apply` para crear todos los objetos definidos en los ficheros
de configuración existentes en un directorio específico, con excepción de aquellos que
ya existen:

```shell
kubectl apply -f <directorio>/
```

Esto definirá la anotación `kubectl.kubernetes.io/last-applied-configuration: '{...}'`
en cada objeto. Esta anotación contiene el contenido del fichero de configuración
utilizado para la creación del objeto.

{{< note >}}
Agregue la opción `-R` para procesar un directorio de manera recursiva.
{{< /note >}}

El siguiente es un ejemplo de fichero de configuración para un objeto:

{{< codenew file="application/simple_deployment.yaml" >}}

Ejecute `kubectl diff` para visualizar el objeto que será creado:

```shell
kubectl diff -f https://k8s.io/examples/application/simple_deployment.yaml
```

{{< note >}}
`diff` utiliza [server-side dry-run](/docs/reference/using-api/api-concepts/#dry-run),
que debe estar habilitado en el `kube-apiserver`.

Dado que `diff` ejecuta una solicitud de `apply` en el servidor en modo de simulacro (dry-run),
requiere obtener permisos de `PATCH`, `CREATE`, y `UPDATE`.
Vea [Autorización Dry-Run](/docs/reference/using-api/api-concepts#dry-run-authorization)
para más detalles.

{{< /note >}}

Cree el objeto usando `kubectl apply`:

```shell
kubectl apply -f https://k8s.io/examples/application/simple_deployment.yaml
```

Despliegue la configuración activa usando `kubectl get`:

```shell
kubectl get -f https://k8s.io/examples/application/simple_deployment.yaml -o yaml
```

La salida le demostrará que la anotación `kubectl.kubernetes.io/last-applied-configuration`
fue escrita a la configuración activa, y es consistente con los contenidos del fichero
de configuración:

```yaml
kind: Deployment
metadata:
  annotations:
    # ...
    # Esta es la representación JSON de simple_deployment.yaml
    # Fue escrita por kubectl apply cuando el objeto fue creado
    kubectl.kubernetes.io/last-applied-configuration: |
      {"apiVersion":"apps/v1","kind":"Deployment",
      "metadata":{"annotations":{},"name":"nginx-deployment","namespace":"default"},
      "spec":{"minReadySeconds":5,"selector":{"matchLabels":{"app":nginx}},"template":{"metadata":{"labels":{"app":"nginx"}},
      "spec":{"containers":[{"image":"nginx:1.14.2","name":"nginx",
      "ports":[{"containerPort":80}]}]}}}}
  # ...
spec:
  # ...
  minReadySeconds: 5
  selector:
    matchLabels:
      # ...
      app: nginx
  template:
    metadata:
      # ...
      labels:
        app: nginx
    spec:
      containers:
      - image: nginx:1.14.2
        # ...
        name: nginx
        ports:
        - containerPort: 80
        # ...
      # ...
    # ...
  # ...
```

## Como actualizar objetos

También puede usar `kubectl apply` para actualizar los objetos definidos en un directorio,
aún cuando esos objetos ya existan en la configuración activa. Con este enfoque logrará
lo siguiente:

1. Definir los campos que aparecerán en la configuración activa.
2. Eliminar aquellos campos eliminados en el fichero de configuración, de la configuración activa.

```shell
kubectl diff -f <directorio>/
kubectl apply -f <directorio>/
```

{{< note >}}
Agregue la opción `-R` para procesar directorios de manera recursiva.
{{< /note >}}

Este es un ejemplo de fichero de configuración:

{{< codenew file="application/simple_deployment.yaml" >}}

Cree el objeto usando `kubectl apply`:

```shell
kubectl apply -f https://k8s.io/examples/application/simple_deployment.yaml
```

{{< note >}}
Con el propósito de ilustrar, el comando anterior se refiere a un único fichero
de configuración en vez de un directorio.
{{< /note >}}

Despliegue la configuración activa usando `kubectl get`:

```shell
kubectl get -f https://k8s.io/examples/application/simple_deployment.yaml -o yaml
```

La salida le demostrará que la anotación `kubectl.kubernetes.io/last-applied-configuration`
fue escrita a la configuración activa, y es consistente con los contenidos del fichero
de configuración:

```yaml
kind: Deployment
metadata:
  annotations:
    # ...
    # Esta es la representación JSON de simple_deployment.yaml
    # Fue escrita por kubectl apply cuando el objeto fue creado
    kubectl.kubernetes.io/last-applied-configuration: |
      {"apiVersion":"apps/v1","kind":"Deployment",
      "metadata":{"annotations":{},"name":"nginx-deployment","namespace":"default"},
      "spec":{"minReadySeconds":5,"selector":{"matchLabels":{"app":nginx}},"template":{"metadata":{"labels":{"app":"nginx"}},
      "spec":{"containers":[{"image":"nginx:1.14.2","name":"nginx",
      "ports":[{"containerPort":80}]}]}}}}
  # ...
spec:
  # ...
  minReadySeconds: 5
  selector:
    matchLabels:
      # ...
      app: nginx
  template:
    metadata:
      # ...
      labels:
        app: nginx
    spec:
      containers:
      - image: nginx:1.14.2
        # ...
        name: nginx
        ports:
        - containerPort: 80
        # ...
      # ...
    # ...
  # ...
```

De manera directa, actualice el campo `replicas` en la configuración activa usando `kubectl scale`.
En este caso no se usa `kubectl apply`:

```shell
kubectl scale deployment/nginx-deployment --replicas=2
```

Despliegue la configuración activa usando `kubectl get`:

```shell
kubectl get deployment nginx-deployment -o yaml
```

La salida le muestra que el campo `replicas` ha sido definido en 2, y que la
anotación `last-applied-configuration` no contiene el campo `replicas`:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  annotations:
    # ...
    # note que la anotación no contiene replicas
    # debido a que el objeto no fue actualizado usando apply
    kubectl.kubernetes.io/last-applied-configuration: |
      {"apiVersion":"apps/v1","kind":"Deployment",
      "metadata":{"annotations":{},"name":"nginx-deployment","namespace":"default"},
      "spec":{"minReadySeconds":5,"selector":{"matchLabels":{"app":nginx}},"template":{"metadata":{"labels":{"app":"nginx"}},
      "spec":{"containers":[{"image":"nginx:1.14.2","name":"nginx",
      "ports":[{"containerPort":80}]}]}}}}
  # ...
spec:
  replicas: 2 # definido por scale
  # ...
  minReadySeconds: 5
  selector:
    matchLabels:
      # ...
      app: nginx
  template:
    metadata:
      # ...
      labels:
        app: nginx
    spec:
      containers:
      - image: nginx:1.14.2
        # ...
        name: nginx
        ports:
        - containerPort: 80
      # ...
```

Actualice el fichero de configuración `simple_deployment.yaml` para cambiar el campo `image`
de `nginx:1.14.2` a `nginx:1.16.1`, y elimine el campo `minReadySeconds`:

{{< codenew file="application/update_deployment.yaml" >}}

Aplique los cambios realizados al fichero de configuración:

```shell
kubectl diff -f https://k8s.io/examples/application/update_deployment.yaml
kubectl apply -f https://k8s.io/examples/application/update_deployment.yaml
```

Despliegue la configuración activa usando `kubectl get`:

```shell
kubectl get -f https://k8s.io/examples/application/update_deployment.yaml -o yaml
```

La salida le mostrará los siguienes cambios hechos a la configuración activa:

* El campo `replicas` retiene el valor de 2 definido por `kubectl scale`.
  Esto es posible ya que el campo fue omitido en el fichero de configuración.
* El campo `image` ha sido actualizado de `nginx:1.16.1` a `nginx:1.14.2`.
* La anotación `last-applied-configuration` ha sido actualizada con la nueva imagen.
* El campo `minReadySeconds` ha sido despejado.
* La anotación `last-applied-configuration` ya no contiene el campo `minReadySeconds`

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  annotations:
    # ...
    # La anotación contiene la imagen acutalizada a nginx 1.11.9,
    # pero no contiene la actualización de las replicas a 2
    kubectl.kubernetes.io/last-applied-configuration: |
      {"apiVersion":"apps/v1","kind":"Deployment",
      "metadata":{"annotations":{},"name":"nginx-deployment","namespace":"default"},
      "spec":{"selector":{"matchLabels":{"app":nginx}},"template":{"metadata":{"labels":{"app":"nginx"}},
      "spec":{"containers":[{"image":"nginx:1.16.1","name":"nginx",
      "ports":[{"containerPort":80}]}]}}}}
    # ...
spec:
  replicas: 2 # Definido por `kubectl scale`.  Ignorado por `kubectl apply`.
  # minReadySeconds fue despejado por `kubectl apply`
  # ...
  selector:
    matchLabels:
      # ...
      app: nginx
  template:
    metadata:
      # ...
      labels:
        app: nginx
    spec:
      containers:
      - image: nginx:1.16.1 # Definido `kubectl apply`
        # ...
        name: nginx
        ports:
        - containerPort: 80
        # ...
      # ...
    # ...
  # ...
```

{{< warning >}}
No es soportado combinar `kubectl apply` con los comandos de configuración imperativa de objetos 
`create` y `replace`. Esto se debe a que `create`
y `replace` no retienen la anotación `kubectl.kubernetes.io/last-applied-configuration`
que `kubectl apply` utiliza para calcular los cambios por realizar.
{{< /warning >}}

## Como eliminar objetos

Hay dos diferentes opciones para eliminar objetos gestionados por `kubectl apply`.

### Manera recomendada: `kubectl delete -f <fichero>`

Eliminar objetos de manera manual utilizando el comando imperativo es la opción
recomendada, ya que es más explícito en relación a lo que será eliminado, y es
menos probable que resulte en algo siendo eliminado sin la intención del usuario.

```shell
kubectl delete -f <fichero>
```

### Manera alternativa: `kubectl apply -f <directorio/> --prune -l etiqueta=deseada`

Únicamente utilice esta opción si está seguro de saber lo que está haciendo.

{{< warning >}}
`kubectl apply --prune` se encuentra aún en alpha, y cambios incompatibles con versiones previas
podrían ser introducidos en lanzamientos futuros.
{{< /warning >}}

{{< warning >}}
Sea cuidadoso o cuidadosa al usar este comando, para evitar eliminar objetos
no intencionalmente.
{{< /warning >}}

Como una alternativa a `kubectl delete`, puede usar `kubectl apply`para identificar objetos por ser
eliminados, luego de que sus archivos de configuración han sido eliminados del directorio. El commando `apply` con `--prune`
consulta a la API del servidor por todos los objetos que coincidan con un grupo de etiquetas, e intenta relacionar
la configuración obtenida de los objetos activos contra los objetos según sus ficheros de configuración.
Si un objeto coincide con la consulta, y no tiene un fichero de configuración en el directorio, pero si
tiene una anotación `last-applied-configuration`, entonces será eliminado.

{{< comment >}}
TODO(pwittrock): We need to change the behavior to prevent the user from running apply on subdirectories unintentionally.
{{< /comment >}}

```shell
kubectl apply -f <directorio/> --prune -l <etiquetas>
```

{{< warning >}}
`apply` con `--prune` debería de ser ejecutado únicamente en contra del directorio
raíz que contiene los ficheros de configuración. Ejecutarlo en contra de sub-directorios
podría causar que objetos sean eliminados no intencionalmente, si son retornados en la
consulta por selección de etiqueta usando `-l <etiquetas>` y no existen en el subdirectorio.
{{< /warning >}}

## Como visualizar un objeto

Puede usar `kubectl get` con `-o yaml` para ver la configuración de objetos activos:

```shell
kubectl get -f <fichero|url> -o yaml
```

## Como son las diferencias calculadas y unidas por apply

{{< caution >}}
Un *patch*  (parche) es una operación de actualización con alcance a campos específicos 
de un objeto, y no al objeto completo. Esto permite actualizar únicamente grupos de campos
específicos en un objeto sin tener que leer el objeto primero.
{{< /caution >}}

Cuando `kubectl apply` actualiza la configuración activa para un objeto, lo hace enviando
una solicitud de patch al servidor de API. El patch define actualizaciones para campos
específicos en la configuración del objeto activo. El comando `kubectl apply` calcula esta solicitud
de patch usando el fichero de configuración, la configuración activa, y la anotación `last-applied-configuration`
almacenada en la configuración activa.

### Calculando la unión de un patch

El comando `kubectl apply` escribe los contenidos de la configuración a la anotación
`kubectl.kubernetes.io/last-applied-configuration`. Esto es usado para identificar aquellos campos
que han sido eliminados de la configuración y deben ser limpiados. Los siguientes pasos
son usados para calcular que campos deben ser eliminados o definidos:

1. Calculo de campos por eliminar. Estos son los campos presentes en `last-applied-configuration` pero ausentes en el fichero de configuración.
2. Calculo de campos por agregar o definir. Estos son los campos presentes en el fichero de configuración, con valores inconsistentes con la configuración activa.

A continuación un ejemplo. Suponga que este es el fichero de configuración para un objeto de tipo Deployment:

{{< codenew file="application/update_deployment.yaml" >}}

También, supognga que esta es la configuración activa para ese mismo objeto de tipo Deployment:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  annotations:
    # ...
    # tome nota de que la anotación no contiene un valor para replicas
    # dado que no fue actualizado usando el comando apply
    kubectl.kubernetes.io/last-applied-configuration: |
      {"apiVersion":"apps/v1","kind":"Deployment",
      "metadata":{"annotations":{},"name":"nginx-deployment","namespace":"default"},
      "spec":{"minReadySeconds":5,"selector":{"matchLabels":{"app":nginx}},"template":{"metadata":{"labels":{"app":"nginx"}},
      "spec":{"containers":[{"image":"nginx:1.14.2","name":"nginx",
      "ports":[{"containerPort":80}]}]}}}}
  # ...
spec:
  replicas: 2 # definidas por scale
  # ...
  minReadySeconds: 5
  selector:
    matchLabels:
      # ...
      app: nginx
  template:
    metadata:
      # ...
      labels:
        app: nginx
    spec:
      containers:
      - image: nginx:1.14.2
        # ...
        name: nginx
        ports:
        - containerPort: 80
      # ...
```

Estos son los cálculos de unión que serían realizados por `kubectl apply`:

1. Calcular los campos por eliminar, leyendo los valores de `last-applied-configuration`
   y comparándolos con los valores en el fichero de configuración.
   Limpiar los campos definidos en null de manera explícita en el fichero de configuración
   sin tomar en cuenta si se encuentran presentes en la anotación `last-applied-configuration`.
   En este ejemplo, `minReadySeconds` aparece en la anotación
   `last-applied-configuration` pero no aparece en el fichero de configuración.
    **Acción:** Limpiar `minReadySeconds` de la configuración activa.
2. Calcular los campos por ser definidos, al leer los valores del firecho de configuración
   y compararlos con los valores en la configuración activa. En este ejemplo, el valor `image`
   en el fichero de configuración, no coincide con el valor en la configuración activa.
   **Acción:** Definir el campo `image` en la configuración activa.
3. Definir el valor de la anotación `last-applied-configuration` para que sea consistente
   con el fichero de configuración.
4. Unir los resultados de 1, 2 y 3, en una única solicitud de patch para enviar al API server.

Esta es la configuración activa como resultado de esta unión:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  annotations:
    # ...
    # La anotación contiene la imágen actualizada a nginx 1.11.9,
    # pero no contiene la actualización a 2 replicas
    kubectl.kubernetes.io/last-applied-configuration: |
      {"apiVersion":"apps/v1","kind":"Deployment",
      "metadata":{"annotations":{},"name":"nginx-deployment","namespace":"default"},
      "spec":{"selector":{"matchLabels":{"app":nginx}},"template":{"metadata":{"labels":{"app":"nginx"}},
      "spec":{"containers":[{"image":"nginx:1.16.1","name":"nginx",
      "ports":[{"containerPort":80}]}]}}}}
    # ...
spec:
  selector:
    matchLabels:
      # ...
      app: nginx
  replicas: 2 # Definido por `kubectl scale`.  Ignorado por `kubectl apply`.
  # minReadySeconds eliminado por `kubectl apply`
  # ...
  template:
    metadata:
      # ...
      labels:
        app: nginx
    spec:
      containers:
      - image: nginx:1.16.1 # Definido por `kubectl apply`
        # ...
        name: nginx
        ports:
        - containerPort: 80
        # ...
      # ...
    # ...
  # ...
```

### Como se unen los diferentes tipos de campos

La manera en la que los campos en un fichero de configuración son unidos con la
configuración activa depende del tipo de campo. Existen varios tipos de campos:

- *primitivo*: Campos de cadena de texto (string), enteros (integer), o lógicos (boolean).
  Por ejemplo, `image` y `replicas` son campos de tipo primitivo. **Acción:** Reemplazarlos.

- *mapa*, también llamados *objeto*:  Campo de tipo mapa o un tipo
  complejo que contiene sub-campos. Por ejemplo, `labels`,
  `annotations`,`spec` y `metadata` son todos mapas. **Acción:** Unir los elementos o sub-campos.

- *lista*: Campos que contienen una lista de elementos que pueden ser de tipo primitivo o mapa.
  Como ejemplos, `containers`, `ports`, y `args` son listas. **Acción:** Varía.

Cuando `kubectl apply` actualiza un campo de tipo mapa o lista, típicamente no reemplaza
el campo completo, sino actualiza los sub-elementos individuales.
Por ejemplo, cuando se hace una unión del campo `spec` en un Deployment, el `spec`
completo no es reemplazado, por el contrario, únicamente los sub-campos de `spec` como
`replica` son comparados y unidos.

### Uniendo cambios en campos primitivos

Campos primitivos son limpiados o reemplazados.

{{< note >}}
`-` determina que "no aplica" debido a que el valor no es utilizado.
{{< /note >}}

| Campo en el fichero de configuración  | Campo en la configuración activa   | Campo en last-applied-configuration | Acción                                                       |
|---------------------------------------|------------------------------------|-------------------------------------|--------------------------------------------------------------|
| Si                                    | Si                                 | -                                   | Define el valor en el fichero de configuración como activo.  |
| Si                                    | No                                 | -                                   | Define el valor a la configuración local.                    |
| No                                    | -                                  | Si                                  | Elimina de la configuración activa.                          |
| No                                    | -                                  | No                                  | No hacer nada. Mantiene el valor activo.                     |

### Uniendo cambios en campos de un mapa

Los campos que conjúntamente representan un mapa, son unidos al comparar cada uno de los subcampos o elementos del mapa:

{{< note >}}
`-` determina que "no aplica" debido a que el valor no es utilizado.
{{< /note >}}

| Propiedad en fichero de configuración | Propiedad en configuración activa | Campo en last-applied-configuration | Acción                                   |
|---------------------------------------|-----------------------------------|-------------------------------------|------------------------------------------|
| Si                                    | Si                                | -                                   | Comparar valores de sub-propiedades.     |
| Si                                    | No                                | -                                   | Usar configuracón local.                 |
| No                                    | -                                 | Si                                  | Eliminar de la configuración activa.     |
| No                                    | -                                 | No                                  | No hacer nada. Mantener el valor activo. |

### Uniendo cambios en campos de tipo lista

El unir cambios en una lista utiliza una de tres posibles estrategias:

* Reemplazar la lista si todos sus elementos son primitivos.
* Unir elementos individuales en líneas de elementos complejos.
* Unir una lista de elementos primitivos.

Se define la estrategia elegida con base en cada campo.

#### Reemplazar una lista si todos sus elementos son primitivos

Trata la lista como si fuese un campo primitivo. Reemplaza o elimina la lista completa.
Esto preserva el orden de los elementos.


**Ejemplo:** Usndo `kubectl apply` para actualizar el campo `args` de un Contenedor en un Pod.
Esto define el valor de `args` en la configuración activa, al valor en el fichero de configuración.
Cualquier elemento de `args` que haya sido previamente agregado a la configuración activa se perderá.
El orden de los elementos definidos en `args` en el fichero de configuración, serán conservados
en la configuración activa.

```yaml
# valor en last-applied-configuration
    args: ["a", "b"]

# valores en fichero de configuración
    args: ["a", "c"]

# configuración activa
    args: ["a", "b", "d"]

# resultado posterior a la unión
    args: ["a", "c"]
```

**Explicación:** La unión utilizó los valores del fichero de configuración para definir los nuevos valores de la lista.

#### Unir elementos individuales en una lista de elementos complejos

Trata la lista como un mapa, y trata cada campo específico de cada elemento como una llave.
Agrega, elimina o actualiza elementos individuales. Esta operación no conserva orden.

Esta estrategia de unión utiliza una etiqueta especial en cada campo llamada `patchMergeKey`. La etiqueta
`patchMergeKey` es definida para cada campo en el código fuente de Kubernetes:
[types.go](https://github.com/kubernetes/api/blob/d04500c8c3dda9c980b668c57abc2ca61efcf5c4/core/v1/types.go#L2747)
Al unir una lista de mapas, el campo específicado en `patchMergeKey` para el elemento dado
se utiliza como un mapa de llaves para ese elemento.

**Ejemplo:** Utilice `kubectl apply` para actualizar el campo `containers` de un PodSpec.
Esto une la lista como si fuese un mapa donde cada elemento utiliza `name` por llave.

```yaml
# valor en last-applied-configuration
    containers:
    - name: nginx
      image: nginx:1.16
    - name: nginx-helper-a # llave: nginx-helper-a; será eliminado en resultado
      image: helper:1.3
    - name: nginx-helper-b # llave: nginx-helper-b; será conservado
      image: helper:1.3

# valor en fichero de configuración
    containers:
    - name: nginx
      image: nginx:1.16
    - name: nginx-helper-b
      image: helper:1.3
    - name: nginx-helper-c # llavel: nginx-helper-c; será agregado en el resultado
      image: helper:1.3

# configuración activa
    containers:
    - name: nginx
      image: nginx:1.16
    - name: nginx-helper-a
      image: helper:1.3
    - name: nginx-helper-b
      image: helper:1.3
      args: ["run"] # Campo será conservado
    - name: nginx-helper-d # llave: nginx-helper-d; será conservado
      image: helper:1.3

# resultado posterior a la unión
    containers:
    - name: nginx
      image: nginx:1.16
      # Elemento nginx-helper-a fue eliminado
    - name: nginx-helper-b
      image: helper:1.3
      args: ["run"] # Campo fue conservado
    - name: nginx-helper-c # Elemento fue agregado
      image: helper:1.3
    - name: nginx-helper-d # Elemento fue ignorado
      image: helper:1.3
```

**Explicación:**

- El contenedor llamado "nginx-helper-a" fué eliminado al no aparecer ningún
  contenedor llamado "nginx-helper-a" en el fichero de configuración.
- El contenedor llamado "nginx-helper-b" mantiene los cambios a  `args`
  existentes en la configuración activa. `kubectl apply` pudo identificar que
  el contenedor "nginx-helper-b" en la configuración activa es el mismo
  "nginx-helper-b" que aparece en el fichero de configuración, aún teniendo diferentes
  valores en los campos (no existe `args` en el fichero de configuración). Esto sucede
  debido a que el valor del campo `patchMergeKey` (name) es idéntico en ambos.
- El contenedor llamado "nginx-helper-c" fue agregado ya que no existe ningún contenedor
  con ese nombre en la configuración activa, pero si existe uno con ese nombre
  en el fichero de configuración.
- El contendor llamado "nginx-helper-d" fue conservado debido a que no aparece
  ningún elemento con ese nombre en last-applied-configuration.

#### Unir una lista de elementos primitivos

A partir de Kubernetes 1.5, el unir listas de elementos primitivos no es soportado.

{{< note >}}
La escogencia de estrategia por selecciones para un campo en particular, es controlada
por la etiqueta `patchStrategy` en [types.go](https://github.com/kubernetes/api/blob/d04500c8c3dda9c980b668c57abc2ca61efcf5c4/core/v1/types.go#L2748)
Si no se especifica `patchStrategy` para un campo de tipo lista, entonces el campo
es reemplazado.
{{< /note >}}

{{< comment >}}
TODO(pwittrock): Uncomment this for 1.6

- Treat the list as a set of primitives.  Replace or delete individual
  elements.  Does not preserve ordering.  Does not preserve duplicates.

**Example:** Using apply to update the `finalizers` field of ObjectMeta
keeps elements added to the live configuration.  Ordering of finalizers
is lost.
{{< /comment >}}

## Valores de campo por defecto

El Servidor de API define algunos campos a sus valores por defecto si no son especificados
al momento de crear un objeto.

Aquí puede ver un fichero de configuración para un Deployment. Este fichero no especifica
el campo `strategy`:

{{< codenew file="application/simple_deployment.yaml" >}}

Cree un nuevo objeto `kubectl apply`:

```shell
kubectl apply -f https://k8s.io/examples/application/simple_deployment.yaml
```

Despliegue la configuración activa usando `kubectl get`:

```shell
kubectl get -f https://k8s.io/examples/application/simple_deployment.yaml -o yaml
```

La salida demuestra que el API Server definió varios campos con los valores por defecto
en la configuración activa. Estos campos no fueron especificados en el fichero de
configuración.

```yaml
apiVersion: apps/v1
kind: Deployment
# ...
spec:
  selector:
    matchLabels:
      app: nginx
  minReadySeconds: 5
  replicas: 1 # valor por defecto definido por apiserver
  strategy:
    rollingUpdate: # valor por defecto definido por apiserver - derivado de strategy.type
      maxSurge: 1
      maxUnavailable: 1
    type: RollingUpdate # valor por defecto definido por apiserver
  template:
    metadata:
      creationTimestamp: null
      labels:
        app: nginx
    spec:
      containers:
      - image: nginx:1.14.2
        imagePullPolicy: IfNotPresent # valor por defecto definido por apiserver
        name: nginx
        ports:
        - containerPort: 80
          protocol: TCP # valor por defecto definido por apiserver
        resources: {} # valor por defecto definido por apiserver
        terminationMessagePath: /dev/termination-log # valor por defecto definido por apiserver
      dnsPolicy: ClústerFirst # valor por defecto definido por apiserver
      restartPolicy: Always # valor por defecto definido por apiserver
      securityContext: {} # valor por defecto definido por apiserver
      terminationGracePeriodSeconds: 30 # valor por defecto definido por apiserver
# ...
```

En una solicitud de patch, los campos definidos a valores por defecto no son re-definidos exceptuando
cuando hayan sido limpiados de manera explícita como parte de la solicitud de patch. Esto puede
causar comportamientos no esperados para campos cuyo valor por defecto es basado en los valores
de otros campos. Cuando el otro campo ha cambiado, el valor por defecto de ellos no será actualizado
de no ser que sean limpiados de manera explícita.

Por esta razón, se recomienda que algunos campos que reciben un valor por defecto del
servidor sean definidos de manera explícita en los ficheros de configuración, aun cuando
el valor definido sea idéntico al valor por defecto. Esto facilita la identificación
de valores conflictivos que podrían no ser revertidos a valores por defecto por parte
del servidor.

**Ejemplo:**

```yaml
# last-applied-configuration
spec:
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx:1.14.2
        ports:
        - containerPort: 80

# fichero de configuración
spec:
  strategy:
    type: Recreate # valor actualizado
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx:1.14.2
        ports:
        - containerPort: 80

# configuración activa
spec:
  strategy:
    type: RollingUpdate # valor por defecto
    rollingUpdate: # valor por defecto derivado del campo type
      maxSurge : 1
      maxUnavailable: 1
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx:1.14.2
        ports:
        - containerPort: 80

# resultado posterior a la unión - ERROR!
spec:
  strategy:
    type: Recreate # valor actualizado: incompatible con RollingUpdate
    rollingUpdate: # valor por defecto: incompatible con "type: Recreate"
      maxSurge : 1
      maxUnavailable: 1
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx:1.14.2
        ports:
        - containerPort: 80
```

**Explicación:**

1. El usuario crea un Deployment sin definir `strategy.type`.
2. El servidor define `strategy.type` a su valor por defecto de `RollingUpdate` y
   agrega los valores por defecto a `strategy.rollingUpdate`.
3. El usuario cambia `strategy.type` a `Recreate`. Los valores de `strategy.rollingUpdate`
   se mantienen en su configuración por defecto, sin embargo el servidor espera que se limpien.
   Si los valores de `strategy.rollingUpdate` hubiesen sido definidos inicialmente en el fichero
   de configuración, hubiese sido más claro que requerían ser eliminados.
4. Apply fallará debido a que `strategy.rollingUpdate` no fue eliminado. El campo `strategy.rollingupdate`
   no puede estar definido, si el valor de `strategy.type` es `Recreate`.

Recomendación: Estos campos deberían de ser definidos de manera explícita en el fichero de configuración:

- Etiquetas de Selectors y PodTemplate en cargas de trabajo como Deployment, StatefulSet, Job, DaemonSet,
  ReplicaSet, y ReplicationController
- Estrategia de rollout para un Deployment

### Como limpiar campos definidos a valores por defecto por el servidor, o definidos por otros escritores

Campos que no aparecen en el fichero de configuración pueden ser limpiados si se define su valor
a `null` y luego se aplica el fichero de configuración.
Para los campos definidos a valores por defecto por el servidor, esto provoca el re establecimiento
a sus valores por defecto.

## Como cambiar al propietario de un campo entre un fichero de configuración y un escritor imperativo

Estos son los únicos métodos que debe usar para cambiar un campo individual de un objeto:

- Usando `kubectl apply`.
- Escribiendo de manera directa a la configuración activa sin modificar el fichero de configuración:
por ejemplo, usando `kubectl scale`.

### Cambiando al propietario de un campo de un escritor imperativo a un fichero de configuración

Añada el campo al fichero de configuración, y no realice nuevas actualizaciones a la configuración
activa que no sucedan por medio de `kubectl apply`.

### Cambiando al propietario de un fichero de configuración a un escritor imperativo

A partir de Kubernetes 1.5, el cambiar un campo que ha sido definido por medio de un
fichero de configuración para que sea modificado por un escritor imperativo requiere
pasos manuales:

- Eliminar el campo del fichero de configuración.
- Eliminar el campo de la anotación `kubectl.kubernetes.io/last-applied-configuration` en el objeto activo.

## Cambiando los métodos de gestión

Los objetos en Kubernetes deberían de ser gestionados utilizando únicamente un método
a la vez. El alternar de un método a otro es posible, pero es un proceso manual.

{{< note >}}
Esta bien el usar eliminación imperativa junto a gestión declarativa.
{{< /note >}}

{{< comment >}}
TODO(pwittrock): We need to make using imperative commands with
declarative object configuration work so that it doesn't write the
fields to the annotation, and instead.  Then add this bullet point.

- using imperative commands with declarative configuration to manage where each manages different fields.
{{< /comment >}}

### Migrando de gestión imperativa con comandos a configuración declarativa de objetos

El migrar de gestión imperativa utilizando comandos a la gestión declarativa de objetos
requiere varios pasos manuales:

1. Exporte el objeto activo a un fichero local de configuración:

     ```shell
     kubectl get <tipo>/<nombre> -o yaml > <tipo>_<nombre>.yaml
     ```

1. Elimine de manera manual el campo `status` del fichero de configuración.

    {{< note >}}
    Este paso es opcional, ya que `kubectl apply` no actualiza el campo `status`
   aunque este presente en el fichero de configuración.
    {{< /note >}}

1. Defina la anotación `kubectl.kubernetes.io/last-applied-configuration` en el objeto:

    ```shell
    kubectl replace --save-config -f <tipo>_<nombre>.yaml
    ```

1. Modifique el proceso para usar `kubectl apply` para gestionar el objeto de manera exclusiva.

{{< comment >}}
TODO(pwittrock): Why doesn't export remove the status field?  Seems like it should.
{{< /comment >}}

### Migrando de gestión imperativa de la configuración de objetos a gestión declarativa

1. Defina la anotación `kubectl.kubernetes.io/last-applied-configuration` en el objeto:

    ```shell
    kubectl replace --save-config -f <tipo>_<nombre>.yaml
    ```

1. Modifique el proceso para usar `kubectl apply` para gestionar el objeto de manera exclusiva.

## Definiendo los selectores para el controlador y las etiquetas de PodTemplate

{{< warning >}}
Actualizar selectores en controladores se desaconseja encarecidamente.
{{< /warning >}}

La forma recomendada es definir una etiqueta única e inmutable para PodTemplate usada
únicamente por el selector del controlador sin tener ningún otro significado semántico.

**Ejemplo:**

```yaml
selector:
  matchLabels:
      controller-selector: "apps/v1/deployment/nginx"
template:
  metadata:
    labels:
      controller-selector: "apps/v1/deployment/nginx"
```

## {{% heading "whatsnext" %}}


* [Administración de Objetos de Kubernetes usando comandos imperativos](/docs/tasks/manage-kubernetes-objects/imperative-command/)
* [Administración imperativa de los Objetos de Kubernetes usando archivos de configuración](/docs/tasks/manage-kubernetes-objects/imperative-config/)
* [Referencia del comando Kubectl](/docs/reference/generated/kubectl/kubectl-commands/)
* [Referencia de la API de Kubernetes](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/)


