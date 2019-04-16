---
title: Etiquetas y Selectores
content_template: templates/concept
weight: 40
---

{{% capture overview %}}

Las _etiquetas_ son pares de clave/valor que se asocian a los objetos, como los pods.
El propósito de las etiquetas es permitir identificar atributos de los objetos que son relevantes y significativos para los usuarios, pero que no tienen significado para el sistema principal.
Se puede usar las etiquetas para organizar y seleccionar subconjuntos de objetos. Las etiquetas se pueden asociar a los objetos a la hora de crearlos y posteriormente modificarlas o añadir nuevas.
Cada objeto puede tener un conjunto de etiquetas clave/valor definidas, donde cada clave debe ser única para un mismo objeto.

```json
"metadata": {
  "labels": {
    "key1" : "value1",
    "key2" : "value2"
  }
}
```

Las etiquetas permiten consultar y monitorizar los objetos de forma más eficiente y son ideales para su uso en UIs y CLIs. El resto de información no identificada debe ser registrada usando [anotaciones](/docs/concepts/overview/working-with-objects/annotations/).

{{% /capture %}}


{{% capture body %}}

## Motivación

Las etiquetas permiten que los usuarios mapeen sus estructuras organizacionales en los propios objetos sin acoplamiento, sin forzar a los clientes a almacenar estos mapeos.

Los despliegues de servicios y los procesos en lotes suelen requerir a menudo la gestión de entidades multi-dimensionales (ej., múltiples particiones o despliegues, múltiples entregas, múltiples capas, múltiples microservicios por capa). Tal gestión a menudo requiere de operaciones horizontales que rompen la encapsulación de representaciones estrictamente jerárquicas, especialmente jerarquías rígidas determinadas por la infraestructura en vez de por los usuarios.

Ejemplos de etiquetas:

   * `"release" : "stable"`, `"release" : "canary"`
   * `"environment" : "dev"`, `"environment" : "qa"`, `"environment" : "production"`
   * `"tier" : "frontend"`, `"tier" : "backend"`, `"tier" : "cache"`
   * `"partition" : "customerA"`, `"partition" : "customerB"`
   * `"track" : "daily"`, `"track" : "weekly"`

Estos son sólo algunos ejemplos de etiquetas de uso común; eres libre de establecer tus propias normas. Ten en cuenta que la clave de cada etiqueta debe ser única dentro de cada objeto.

## Sintaxis y conjunto de caracteres

Las _etiquetas_ son pares de clave/valor. Las claves válidas de etiqueta tienen dos partes: un prefijo opcional y un nombre, separados por una barra (`/`). La parte del nombre es obligatoria y debe ser menor o igual a 63 caracteres, empezando y terminando con un carácter alfanumérico (`[a-z0-9A-Z]`), con guiones (`-`), guiones bajos (`_`), puntos (`.`), y cualquier carácter alfanumérico en medio. El prefijo es opcional. Si se indica, este debe ser un subdominio DNS: una serie de etiquetas DNS separadas por puntos (`.`), no mayores de 253 caracteres en total, seguidas de una barra (`/`).

Si se omite el prefijo, la clave de la etiqueta se entiende que es privada para el usuario. Los componentes automatizados del sistema (ej. `kube-scheduler`, `kube-controller-manager`, `kube-apiserver`, `kubectl`, u otros de terceras partes) que añaden etiquetas a los objetos de usuario deben especificar obligatoriamente un prefijo.

Los prefijos `kubernetes.io/` y `k8s.io/` están reservados para el sistema de Kubernetes.

Los valores de etiqueta válidos deben tener como máximo 63 caracteres y empezar y terminar con un carácter alfanumérico (`[a-z0-9A-Z]`), con guiones (`-`), guiones bajos (`_`), puntos (`.`), y cualquier carácter alfanumérico en medio.

## Selectores de etiquetas

Al contrario que los [nombres y UIDs](/docs/user-guide/identifiers), las etiquetas no garantizan la unicidad. En general, se espera que muchos objetos compartan la(s) misma(s) etiqueta(s).

A través del _selector de etiqueta_, el cliente/usuario puede identificar un conjunto de objetos. El selector de etiqueta es la primitiva principal de agrupación en Kubernetes.

La API actualmente soporta dos tipos de selectores: _basados en igualdad_ y _basados en conjunto_.
Un selector de etiqueta puede componerse de múltiples _requisitos_ separados por coma. En el caso de múltiples requisitos, todos ellos deben ser satisfechos de forma que las comas actúan como operadores _AND_ (`&&`) lógicos.

La semántica de selectores vacíos o no espefificados es dependiente del contexto,
y los tipos de la API que utilizan los selectores deberían documentar su propia validación y significado.

{{< note >}}
Para algunos tipos de la API, como los ReplicaSets, los selectores de etiqueta de dos instancias no deben superponerse dentro del mismo espacio de nombres, ya que el controlador puede interpretarlos como un conflicto y no ser capaz de determinar cuántas réplicas debería haber finalmente.
{{< /note >}}

### Requisito _basado en Igualdad_

Los requisitos basados en _Igualdad_ o _Desigualdad_ permiten filtrar por claves y valores de etiqueta. Los objetos coincidentes deben satisfacer todas y cada una de las etiquetas indicadas, aunque puedan tener otras etiquetas adicionalmente.
Se permiten tres clases de operadores `=`,`==`,`!=`. Los dos primeros representan la _igualdad_ (y son simplemente sinónimos), mientras que el último representa la _desigualdad_. Por ejemplo:

```
environment = production
tier != frontend
```

El primero selecciona todos los recursos cuya clave es igual a `environment` y su valor es igual a `production`.
El último selecciona todos los recursos cuya clave es igual a `tier` y su valor distinto de `frontend`, y todos los recursos que no tengan etiquetas con la clave `tier`.
Se podría filtrar los recursos de `production` que excluyan `frontend` usando comas: `environment=production,tier!=frontend`

Un escenario de uso de requisitos basados en igualdad es aquel donde los Pods pueden especificar
los criterios de selección de nodo. Por ejemplo, el Pod de abajo selecciona aquellos nodos con
la etiqueta "`accelerator=nvidia-tesla-p100`".

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: cuda-test
spec:
  containers:
    - name: cuda-test
      image: "k8s.gcr.io/cuda-vector-add:v0.1"
      resources:
        limits:
          nvidia.com/gpu: 1
  nodeSelector:
    accelerator: nvidia-tesla-p100
```

### Requisito _basado en Conjunto_

Los requisitos de etiqueta basados en _Conjuntos_ permiten el filtro de claves en base a un conjunto de valores. Se puede utilizar tres tipos de operadores: `in`,`notin` y `exists` (sólo el identificador clave). Por ejemplo:

```
environment in (production, qa)
tier notin (frontend, backend)
partition
!partition
```

El primer ejemplo selecciona todos los recursos cuya clave es igual a `environment` y su valor es igual a `production` o `qa`.
El segundo ejemplo selecciona todos los recursos cuya clave es igual a `tier` y sus valores son distintos de `frontend` y `backend`, y todos los recursos que no tengan etiquetas con la clave`tier`.
El tercer ejemplo selecciona todos los recursos que incluyan una etiqueta con la clave `partition`; sin comprobar los valores.
El cuarto ejemplo selecciona todos los recursos que no incluyan una etiqueta con la clave `partition`; sin comprobar los valores.
De forma similar, el separador de coma actúa como un operador _AND_ . Así, el filtro de recursos con una clave igual a `partition` (sin importar el valor) y con un `environment` distinto de `qa` puede expresarse como `partition,environment notin (qa)`.
El selector _basado en conjunto_ es una forma genérica de igualdad puesto que `environment=production` es equivalente a `environment in (production)`; y lo mismo aplica para `!=` y `notin`.

Los requisitos _basados en conjunto_ pueden alternarse con aquellos _basados en igualdad_. Por ejemplo: `partition in (customerA, customerB),environment!=qa`.


## API

### Filtro con LIST y WATCH

Las operaciones LIST y WATCH pueden especificar selectores de etiqueta para filtrar el conjunto de objetos devueltos usando un parámetro de consulta. Ambos requisitos están permitidos (se presentan aquí como aparecerían en la cadena URL de consulta):

  * requisitios _basados en igualdad_: `?labelSelector=environment%3Dproduction,tier%3Dfrontend`
  * requisitios _basados en conjunto_: `?labelSelector=environment+in+%28production%2Cqa%29%2Ctier+in+%28frontend%29`

Es posible utilizar ambos estilos de selección de etiquetas para mostrar u observar recursos con un cliente REST. Por ejemplo, para enfocarse en `apiserver` con `kubectl` usando el estilo _basado en igualdad_ se puede ejecutar:

```shell
kubectl get pods -l environment=production,tier=frontend
```

o usando requisitos _basados en conjunto_:

```shell
kubectl get pods -l 'environment in (production),tier in (frontend)'
```

Como ya se ha comentado, los requisitos _basados en conjunto_ son más expresivos.  Por ejemplo, se puede implementar el operador _OR_ sobre valores:

```shell
kubectl get pods -l 'environment in (production, qa)'
```

o restringir la coincidencia negativa mediante el operador _exists_:

```shell
kubectl get pods -l 'environment,environment notin (frontend)'
```

### Establecer referencias en los objetos de la API

Algunos objetos de Kubernetes, como los [`services`](/docs/user-guide/services) y los [`replicationcontrollers`](/docs/user-guide/replication-controller), también hacen uso de los selectores de etiqueta para referirse a otros conjuntos de objetos, como los [pods](/docs/user-guide/pods).

#### Service y ReplicationController

El conjunto de pods que un `service` expone se define con un selector de etiqueta. De forma similar, el conjunto de pods que un `replicationcontroller` debería gestionar se define con un selector de etiqueta.

Los selectores de etiqueta para ambos objetos se definen en los archivos `json` o `yaml` usando mapas, y únicamente se permite los selectores _basados en igualad_:

```json
"selector": {
    "component" : "redis",
}
```
ó

```yaml
selector:
    component: redis
```

este selector (respectivamente en formato `json` o `yaml`) es equivalente a `component=redis` o `component in (redis)`.

#### Recursos que soportan requisitos basados en conjunto

Algunos recursos más recientes, como el [`Job`](/docs/concepts/jobs/run-to-completion-finite-workloads/), el [`Deployment`](/docs/concepts/workloads/controllers/deployment/), el [`Replica Set`](/docs/concepts/workloads/controllers/replicaset/), y el [`Daemon Set`](/docs/concepts/workloads/controllers/daemonset/), sí permiten requisitos _basados en conjunto_.

```yaml
selector:
  matchLabels:
    component: redis
  matchExpressions:
    - {key: tier, operator: In, values: [cache]}
    - {key: environment, operator: NotIn, values: [dev]}
```

`matchLabels` es un mapa de pares `{key,value}`. Una única combinación de `{key,value}` en el mapa `matchLabels` es equivalente a un elemento en `matchExpressions` donde el campo `key` es "key", el `operator` es "In", y la matriz `values` contiene únicamente "value". `matchExpressions` es una lista de requisitos de selección de pod. Los operadores permitidos son In, NotIn, Exists, y DoesNotExist. El conjunto de valores no puede ser vacío en el caso particular de In y NotIn. Todos los requisitos, tanto de `matchLabels` como de `matchExpressions` se combinan entre sí con el operador AND -- todos ellos deben ser satisfechos.

#### Seleccionar conjuntos de objetos

Un caso de uso de selección basada en etiquetas es la posibilidad de limitar los nodos en los que un pod puede desplegarse.
Ver la documentación sobre [selección de nodo](/docs/concepts/configuration/assign-pod-node/) para más información.

{{% /capture %}}
