---
title: Especificando un presupuesto de disrupción para tu aplicación
content_template: templates/task
weight: 110
---

{{% capture overview %}}

Ésta pagina enseña como limitar el numero de disrupciones concurrentes que afectan a tu aplicación definiendo presupuestos de disrupción de pods, Pod Disruption Budgets (PDB) en inglés. Estos presupuestos definen el mínimo número de pods que deben estar ejecutándose en todo momento para asegurar la disponibilidad de la aplicación durante operaciones de mantenimiento efectuadas sobre los nodos por los administradores del cluster.

{{% /capture %}}

{{% capture prerequisites %}}
* Tener permisos de administrador sobre la aplicación que esta corriendo en Kubernetes y requiere alta disponibilidad
* Deberías saber como desplegar [Múltiples réplicas de aplicaciones stateless](/docs/tasks/run-application/run-stateless-application-deployment/)
  y/o [Múltiples réplicas de aplicaciones stateful](/docs/tasks/run-application/run-replicated-stateful-application/).
* Deberías haber leido acerca de [Disrupciones de un Pod](/docs/concepts/workloads/pods/disruptions/).
* Deberías confirmar con el propietario del cluster o proveedor de servicio que respetan Presupuestos de Disrupción para Pods.
{{% /capture %}}

{{% capture steps %}}

## Protegiendo una aplicación con un PodDisruptionBudget

1. Identifica la aplicación que quieres proteger con un PodDisruptionBudget (PDB).
2. Revisa como afectan las disrupciones a tú aplicación.
3. Crea un PDB usando un archivo YAML.
4. Crea el objecto PDB desde el archivo YAML.

{{% /capture %}}

{{% capture discussion %}}

## Identifica la applicación que quieres proteger

El caso más común es proteger aplicaciones que usan uno de los controladores incorporados
en Kubernetes:

- Deployment
- Replicationcontrolador
- ReplicaSet
- StatefulSet

En este caso, toma nota del `.spec.selector` que utiliza el controlador; el mismo se utilizará en el `spec.selector` del PDB.

También puedes utilizar PDBs para proteger pods que no estan gestionados por uno de los controladores listados arriba, o agrupaciones arbitrarias de pods, con algunas restricciones descritas en [Controladores Arbitrarios y Selectors](#arbitrary-controladores-and-selectors).


## Revisa como afectan las disrupciones a tú aplicación

Decide cuántas instancias de tu aplicación pueden estar fuera de servicio al mismo
tiempo debido a disrupciones voluntarias de corto plazo.

- Frontend stateless:
  - Objetivo: evitar reducir capacidad para servir por mas de 10%.
    - Solución: usar un PDB que especifica minAvailable 90%.
- Aplicación Stateful con una sola instancia:
  - Objetivo: no terminar esta aplicación sin primero confirmar conmigo.
    - Posible Solución 1: No usar un PDB y tolerar inactividad ocasional.
    - Posible Solución 2: Crea un PDB con maxUnavailable=0. Entiende que el operador del cluster debe consultar contigo antes de terminar tu aplicación. Cuando el operador te contacte, prepara tu aplicación para downtime y elimina el PDB para indicar que estas preparado para la disrupción. Crea el PDB de nuevo al terminar la disrupción.
- Aplicación Stateful con múltiples instancias como Consul, ZooKeeper, etcd, Redis o MySQL:
  - Objetivo: no reducir el numero de instancias por debajo del quorum, de lo contrario, las escrituras fallarían.
    - Posible Solución 1: fijar maxUnavailable a 1 (funciona con diferentes escalas de aplicación).
    - Posible Solución 2: fijar minAvailable al tamaño del quorum (e.g. 3 cuando hay un total de 5 instancias).  (Permite mas disrupciones a la vez.).
- Trabajos por lote reiniciables:
  - Objetivo: El trabajo debe completarse en caso de una interrupción voluntaria.
    - Posible solución: No cree un PDB. El controlador de Jobs creará un pod de reemplazo.

## Especificando un PodDisruptionBudget

Un `PodDisruptionBudget` tiene tres atributos:

* Un label selector `.spec.selector` para especificar el grupo de
pods donde aplicar el presupuesto. Este campo es requerido.
* `.spec.minAvailable` que es una descripción del número de pods del grupo que deben estar disponibles después del desalojo, incluso en ausencia del pod desalojado. `minAvailable` puede ser un número absoluto o un porcentaje.
* `.spec.maxUnavailable` (disponible en Kubernetes 1.7 y superior) que es una descripción
del numero de pods del grupo que pueden estar indisponibles despues del desalojo. Puede ser un número absoluto o un porcentaje.

{{< note >}}
Para las versiones 1.8 y anteriores: al crear un `PodDisruptionBudget`
utilizando la herramienta de línea de comandos `kubectl`, el campo `minAvailable` es 1 por defecto si no se especifica `minAvailable` ni `maxUnavailable`.
{{< /note >}}

Puedes especificar únicamente un valor para `maxUnavailable` y `minAvailable` por `PodDisruptionBudget`.
`maxUnavailable` solo se puede usar para controlar el desalojo de pods
que tienen un controlador asociado manejándolos. En los ejemplos a continuación, "réplicas deseadas"
hace referencia al valor 'scale' del controlador que gestiona el grupo de pods seleccionados por el
`PodDisruptionBudget`.

Ejemplo 1: Con un `minAvailable` de 5, se permiten los desalojos siempre que dejen
5 o más pods disponibles entre las seleccionadas por el `selector` del PodDisruptionBudget.

Ejemplo 2: Con un `minAvailable` del 30%, se permiten los desalojos mientras que al menos 30% de la cantidad de réplicas se mantengan disponibles.

Ejemplo 3: Con un `maxUnavailable` de 5, se permiten desalojos siempre que haya como máximo 5
réplicas indisponibles entre el número total de réplicas deseadas.

Ejemplo 4: Con un `maxUnavailable` de 30%, se permiten los desalojos siempre y cuando no más del 30%
de las réplicas esten indisponibles.

En el uso típico, se usaría un solo presupuesto para una colección de pods administrados por
un controlador, por ejemplo, los pods en un solo ReplicaSet o StatefulSet.

{{< note >}}
Un presupuesto de disrupción no garantiza que el número/porcentaje de pods especificado 
siempre estarán disponibles. Por ejemplo, un nodo que alberga un
pod del grupo puede fallar cuando el grupo está en el tamaño mínimo
especificados en el presupuesto, lo que hace que el número de pods disponibles este por debajo del tamaño especificado. El presupuesto solo puede proteger contra
desalojos voluntarios, pero no todas las causas de indisponibilidad.
{{< /note >}}

Un `maxUnavailable` de 0% (o 0) o un `minAvailable` de 100% (o igual al
número de réplicas) puede prevenir que los nodos sean purgados completamente.
Esto está permitido según la semántica de `PodDisruptionBudget`.

Puedes encontrar ejemplos de presupuestos de disrupción de pods definidas a continuación. Los ejemplos aplican al grupo de pods que tienen la etiqueta `app: zookeeper`.

Ejemplo de PDB usando minAvailable:

```yaml
apiVersion: policy/v1beta1
kind: PodDisruptionBudget
metadata:
  name: zk-pdb
spec:
  minAvailable: 2
  selector:
    matchLabels:
      app: zookeeper
```

Ejemplo de PDB usando maxUnavailable (Kubernetes 1.7 o superior):

```yaml
apiVersion: policy/v1beta1
kind: PodDisruptionBudget
metadata:
  name: zk-pdb
spec:
  maxUnavailable: 1
  selector:
    matchLabels:
      app: zookeeper
```

Por ejemplo, si el objeto anterior `zk-pdb` selecciona los pods de un StatefulSet de tamaño 3, ambas
especificaciones tienen el mismo significado exacto. Se recomienda el uso de `maxUnavailable` ya que
responde automáticamente a los cambios en el número de réplicas del controlador correspondiente.

## Crea el objeto PDB

Puedes crear el objeto PDB con el comando `kubectl apply -f mypdb.yaml`.

No puedes actualizar objetos PDB. Deben ser eliminados y recreados.

## Comprueba el estado del PDB

Utiliza kubectl para comprobar que se ha creado tu PDB.

Suponiendo que en realidad no tengas pods que coincidan con `app: zookeeper` en su namespace,
entonces verás algo como esto:

```shell
kubectl get poddisruptionbudgets
```
```
NAME      MIN-AVAILABLE   ALLOWED-DISRUPTIONS   AGE
zk-pdb    2               0                     7s
```

Si hay pods que coinciden (por ejemplo, 3), entonces debes ver algo similar a esto:

```shell
kubectl get poddisruptionbudgets
```
```
NAME      MIN-AVAILABLE   ALLOWED-DISRUPTIONS   AGE
zk-pdb    2               1                     7s
```

El valor distinto a cero de `ALLOWED-DISRUPTIONS` significa que el controlador de disrupción ha visto los pods, contó los pods coincidentes, y actualizó el estado del PDB.

Puedes obtener más información sobre el estado de un PDB con este comando:

```shell
kubectl get poddisruptionbudgets zk-pdb -o yaml
```
```yaml
apiVersion: policy/v1beta1
kind: PodDisruptionBudget
metadata:
  creationTimestamp: 2017-08-28T02:38:26Z
  generation: 1
  name: zk-pdb
...
status:
  currentHealthy: 3
  desiredHealthy: 3
  disruptedPods: null
  disruptionsAllowed: 1
  expectedPods: 3
  observedGeneration: 1
```

Por último, los PodDisruptionBudgets también se pueden consultar con kubectl utilizando el nombre corto pdb:

```shell
kubectl get pdb
```

```shell
NAME      MIN-AVAILABLE   ALLOWED-DISRUPTIONS   AGE
zk-pdb    2               0                     7s
```

## Controladores y selectors arbitrarios

Puedes omitir esta sección si solo utilizas PDBs con los controladores integrados de aplicaciones (Deployment, Replicationcontrolador, ReplicaSet y StatefulSet), con el selector de PDB coincidiendo con el selector del controlador.

Puedes utilizar un PDB con pods controlados por otro tipo de controlador, por un
"Operator", o pods individuales, pero con las siguientes restricciones:

- solo puedes usar `.spec.minAvailable`, no `.spec.maxUnavailable`.
- solo puedes usar un número entero en `.spec.minAvailable`, no un porcentaje.

Puedes usar un selector que selecciona un subconjunto o superconjunto de los pods que pertenecen a un controlador incorporado. Sin embargo, cuando hay varios PDB en un namespace, debes tener cuidado de no
crear PDBs cuyos selectores se superponen.
{{% /capture %}}


