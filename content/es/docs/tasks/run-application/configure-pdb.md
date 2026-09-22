---
title: Especificando un presupuesto de interrupción para tu aplicación
content_type: task
weight: 110
---

<!-- overview -->

{{< feature-state for_k8s_version="v1.21" state="stable" >}}

Esta pagina enseña cómo limitar el número de interrupciones concurrentes que afectan a tu aplicación definiendo presupuestos de interrupción de pods, Pod Disruption Budgets (PDB) en inglés. Estos presupuestos definen el mínimo número de pods que deben estar ejecutándose en todo momento para asegurar la disponibilidad de la aplicación durante operaciones de mantenimiento efectuadas sobre los nodos por los administradores del clúster.

## {{% heading "prerequisites" %}}

* Tener permisos de administrador sobre la aplicación que está corriendo en Kubernetes y requiere alta disponibilidad
* Deberías saber cómo desplegar [Múltiples réplicas de aplicaciones stateless](/docs/tasks/run-application/run-stateless-application-deployment/)
  y/o [Múltiples réplicas de aplicaciones stateful](/docs/tasks/run-application/run-replicated-stateful-application/).
* Deberías haber leído acerca de [Interrupciones de un Pod](/docs/concepts/workloads/pods/disruptions/).
* Deberías confirmar con el propietario del clúster o proveedor del servicio que respeten los presupuestos de interrupción de pods.


<!-- steps -->

## Protegiendo una aplicación con un PodDisruptionBudget

1. Identifica la aplicación que quieres proteger con un PodDisruptionBudget (PDB).
2. Revisa cómo afectan las interrupciones a tu aplicación.
3. Crea un PDB usando un archivo YAML.
4. Crea el objeto PDB desde el archivo YAML.

<!-- discussion -->

## Identifica la aplicación que quieres proteger

El caso más común es proteger aplicaciones que usan uno de los controladores incorporados
en Kubernetes:

- Deployment
- Replicationcontrolador
- ReplicaSet
- StatefulSet

En este caso, toma nota del `.spec.selector` que utiliza el controlador; el mismo se utilizará en el `spec.selector` del PDB.

También puedes utilizar PDBs para proteger pods que no están gestionados por uno de los controladores listados arriba, o agrupaciones arbitrarias de pods, con algunas restricciones descritas en [controladores arbitrarios y selectores](#arbitrary-controllers-and-selectors).


## Revisa cómo afectan las interrupciones a tu aplicación

Decide cuántas instancias de tu aplicación pueden estar fuera de servicio al mismo
tiempo debido a interrupciones voluntarias de corto plazo.

- Frontend stateless:
  - Objetivo: evitar reducir capacidad para servir por más de 10%.
    - Solución: usar un PDB que especifica minAvailable 90%.
- Aplicación Stateful con una sola instancia:
  - Objetivo: no terminar esta aplicación sin primero confirmar conmigo.
    - Posible Solución 1: No usar un PDB y tolerar inactividad ocasional.
    - Posible Solución 2: Crea un PDB con maxUnavailable=0. Entiende que el operador del clúster debe consultar contigo antes de terminar tu aplicación. Cuando el operador te contacte, prepara tu aplicación para downtime y elimina el PDB para indicar que estás preparado para la interrupción. Crea el PDB de nuevo al terminar la interrupción.
- Aplicación Stateful con múltiples instancias como Consul, ZooKeeper, etcd, Redis o MySQL:
  - Objetivo: no reducir el número de instancias por debajo del quorum, de lo contrario, las escrituras fallarían.
    - Posible Solución 1: fijar maxUnavailable a 1 (funciona con diferentes escalas de aplicación).
    - Posible Solución 2: fijar minAvailable al tamaño del quorum (e.g. 3 cuando hay un total de 5 instancias).  (Permite más interrupciones a la vez.).
- Trabajos por lote reiniciables:
  - Objetivo: El trabajo debe completarse en caso de una interrupción voluntaria.
    - Posible solución: No cree un PDB. El controlador de Jobs creará un pod de reemplazo.

### Lógica de redondeo al especificar porcentajes

Los valores de `minAvailable` o `maxUnavailable` pueden expresarse como un número entero o como porcentaje.

- Cuando se especifica un número entero, este representa el número de pods. Por ejemplo, si estableces
  `minAvailable` en 10, siempre deben estar disponibles 10 pods, incluso durante una interrupción.
- Cuando se especifica un porcentaje, asignando al valor una cadena de un porcentaje 
  (por ejemplo, `"50%"`), este representa un porcentaje del total de pods. Por ejemplo, si 
  estableces `minAvailable` a `"50%"`, al menos el 50% de pods seguirán estando disponibles
  durante una interrupción.

Cuando se especifica el valor como porcentaje, es posible que no se corresponda con un número exacto de pods.
Por ejemplo, si tienes 7 pods y configuras `minAvailable` a `"50%"`, no queda claro si eso significa que 
deben estar disponibles 3 o 4 pods. Kubernetes redondea al número entero superior más cercano, por lo que en este caso, 
deben estar disponibles 4 pods. Cuando especificas el valor `maxUnavailable` como porcentaje, Kubernetes 
redondea al alza el número de pods que pueden sufrir interrupciones. Por lo tanto, una interrupción puede 
superar el porcentaje `maxUnavailable` definido. Puedes examinar el 
[código](https://github.com/kubernetes/kubernetes/blob/23be9587a0f8677eb8091464098881df939c44a9/pkg/controller/disruption/disruption.go#L539)
que controla este comportamiento.


## Especificando un PodDisruptionBudget

Un `PodDisruptionBudget` tiene tres atributos:

* Un label selector `.spec.selector` para especificar el grupo de
pods donde aplicar el presupuesto. Este campo es requerido.
* `.spec.minAvailable` que es una descripción del número de pods del grupo que deben estar disponibles después del desalojo, incluso en ausencia del pod desalojado. `minAvailable` puede ser un número absoluto o un porcentaje.
* `.spec.maxUnavailable` (disponible en Kubernetes 1.7 y superior) que es una descripción
del número de pods del grupo que pueden estar indisponibles después del desalojo. Puede ser un número absoluto o un porcentaje.

{{< note >}}
El comportamiento para un selector vacío difiere entre las APIs policy/v1beta1 y policy/v1 para
`PodDisruptionBudgets`. En el caso de policy/v1beta1 un selector vacío no coincide con ningún pod, mientras
que para el caso de policy/v1, un selector vacío coincide con todos los pods en el namespace.
{{< /note >}}

Puedes especificar únicamente un valor para `maxUnavailable` y `minAvailable` por `PodDisruptionBudget`.
`maxUnavailable` solo se puede usar para controlar el desalojo de pods
que tienen un controlador asociado manejándolos. En los ejemplos a continuación, "réplicas deseadas"
hace referencia al valor 'scale' del controlador que gestiona el grupo de pods seleccionados por el
`PodDisruptionBudget`.

Ejemplo 1: Con un `minAvailable` de 5, se permiten los desalojos siempre que dejen
5 o más pods [saludables](/es/docs/tasks/run-application/configure-pdb/#healthiness-of-a-pod) seleccionadas por el `selector` del presupuesto de interrupción de pods.

Ejemplo 2: Con un `minAvailable` del 30%, se permiten los desalojos mientras que al menos 30% de la cantidad de réplicas se mantengan saludables.

Ejemplo 3: Con un `maxUnavailable` de 5, se permiten desalojos siempre que haya como máximo 5
réplicas no saludables entre el número total de réplicas deseadas.

Ejemplo 4: Con un `maxUnavailable` de 30%, se permiten los desalojos siempre y cuando el número de réplicas
no saludables no supere el 30% del total de réplicas deseadas redondeando al número entero superior más cercano.
Si el número total de réplicas deseadas es solo uno, se permite que esa única réplica sufra una interrupción, 
lo que daría lugar a una indisponibilidad efectiva del 100%.

En el uso típico, se usaría un solo presupuesto para una colección de pods administrados por
un controlador, por ejemplo, los pods en un solo ReplicaSet o StatefulSet.

{{< note >}}
Un presupuesto de interrupción no garantiza que el número/porcentaje de pods especificado
siempre esté disponible. Por ejemplo, un nodo que alberga un
pod del grupo puede fallar cuando el grupo está en el tamaño mínimo especificado en el presupuesto, 
lo que hace que el número de pods disponibles esté por debajo del tamaño especificado. 
El presupuesto solo puede proteger contra desalojos voluntarios, no contra todas las causas de indisponibilidad.
{{< /note >}}

Si estableces un `maxUnavailable` de 0% (o 0) o un `minAvailable` de 100% (o igual al
número de réplicas), estás exigiendo que no se produzcan desalojos voluntarios.  
puede prevenir que los nodos sean purgados completamente. Cuando estableces cero desalojos voluntarios para un controlador,
como un ReplicaSet, no es posible drenar correctamente un nodo en el que se esté ejecutando uno de esos pods.
Si intentas drenar un nodo en el que se está ejecutando un pod que no puede ser desalojado, el drenaje nunca se completará.
Esto está permitido según la semántica de `PodDisruptionBudget`.

Puedes encontrar ejemplos de presupuestos de interrupción de pods definidos a continuación. Los ejemplos aplican al 
grupo de pods que tienen la etiqueta `app: zookeeper`.

Ejemplo de PDB usando minAvailable:

{{% code_sample file="policy/zookeeper-pod-disruption-budget-minavailable.yaml" %}}

Ejemplo de PDB usando maxUnavailable:

{{% code_sample file="policy/zookeeper-pod-disruption-budget-maxunavailable.yaml" %}}

Por ejemplo, si el objeto anterior `zk-pdb` selecciona los pods de un StatefulSet de tamaño 3, ambas
especificaciones tienen el mismo significado exacto. Se recomienda el uso de `maxUnavailable` ya que
responde automáticamente a los cambios en el número de réplicas del controlador correspondiente.

## Crea el objeto PDB

Puedes crear o actualizar el objeto PDB haciendo uso de kubectl.
```shell
kubectl apply -f mypdb.yaml
```

## Comprueba el estado del PDB

Utiliza kubectl para comprobar que se ha creado tu PDB.

Suponiendo que en realidad no tengas pods que coincidan con `app: zookeeper` en tu namespace, 
verás algo como esto:

```shell
kubectl get poddisruptionbudgets
```
```
NAME     MIN AVAILABLE   MAX UNAVAILABLE   ALLOWED DISRUPTIONS   AGE
zk-pdb   2               N/A               0                     7s
```

Si hay pods que coinciden (por ejemplo, 3), entonces debes ver algo similar a esto:

```shell
kubectl get poddisruptionbudgets
```
```
NAME     MIN AVAILABLE   MAX UNAVAILABLE   ALLOWED DISRUPTIONS   AGE
zk-pdb   2               N/A               1                     7s
```

El valor distinto a cero de `ALLOWED DISRUPTIONS` significa que el controlador de interrupción ha visto los pods, contó los pods coincidentes, y actualizó el estado del PDB.

Puedes obtener más información sobre el estado de un PDB con este comando:

```shell
kubectl get poddisruptionbudgets zk-pdb -o yaml
```
```yaml
apiVersion: policy/v1
kind: PodDisruptionBudget
metadata:
  annotations:
…
  creationTimestamp: "2020-03-04T04:22:56Z"
  generation: 1
  name: zk-pdb
…
status:
  currentHealthy: 3
  desiredHealthy: 2
  disruptionsAllowed: 1
  expectedPods: 3
  observedGeneration: 1
```

### Estado de salud de un pod {#healthiness-of-a-pod}

La implementación actual considera pods saludables a aquellos que tienen el elemento `.status.conditions`
con `type="Ready"` y `status="True"`.
Estos pods son supervisados a través del campo `.status.currentHealthy` en el estado del PDB.

## Política de desalojo de pods no saludables {#unhealthy-pod-eviction-policy}

{{< feature-state feature_gate_name="PDBUnhealthyPodEvictionPolicy" >}}

Proteger una aplicación con un presupuesto de interrupción de pods garantiza que el número de pods con
`.status.currentHealthy` no sea inferior al número especificado en `.status.desiredHealthy` impidiendo el
desalojo de pods en estado saludable. Usando `.spec.unhealthyPodEvictionPolicy`, también puedes definir el
criterio para considerar el desalojo de pods en estado no saludable. El comportamiento por defecto cuando
no se especifica ninguna política es `IfHealthyBudget`.

Políticas:

`IfHealthyBudget`
: Los pods en ejecución (`.status.phase="Running"`), pero que aún no estén en estado saludable, pueden ser
  desalojados solo si la aplicación protegida no sufre interrupciones (`.status.currentHealthy` es igual o
  mayor que `.status.desiredHealthy`).

: Esta política garantiza que los pods en ejecución de una aplicación que ya ha sido interrumpida tenga las
  máximas posibilidades de llegar a un estado saludable. Esto tiene implicaciones negativas en el drenaje
  de nodos, que puede verse bloqueado por aplicaciones que presentan un comportamiento anómalo y que estén 
  protegidas por un PDB. Más concretamente, aplicaciones con pods en estado `CrashLoopBackOff` (debido a 
  un bug o a una configuración incorrecta), o simplemente pods que no consiguen notificar la condición 
  `Ready` por cualquier motivo.

`AlwaysAllow`
: Los pods en ejecución (`.status.phase="Running"`), pero que aún no estén en estado saludable, son considerados
  para su interrupción y pueden ser desalojados independientemente de si cumplen o no con el criterio definido
  en su PDB.

: Esto significa que los pods de una aplicación que estén en proceso de ejecutarse, podrían no tener la oportunidad
  de alcanzar un estado saludable si son interrumpidos. Al aplicar esta política, los gestores de clústeres pueden 
  desalojar fácilmente las aplicaciones que presentan un comportamiento anómalo y que están protegidas por un PDB. 
  Más concretamente, aplicaciones con pods en estado `CrashLoopBackOff` (debido a un bug o a una configuración 
  incorrecta), o simplemente pods que no consiguen notificar la condición `Ready` por cualquier motivo.

{{< note >}}
Los pods en fase "pendiente" (`Pending`), "exitoso" (`Succeeded`) o "fallido" (`Failed`), siempre son considerados
para su desalojo.
{{< /note >}}

## Controladores y selectores arbitrarios {#arbitrary-controllers-and-selectors}

Puedes omitir esta sección si solo utilizas PDBs con los controladores integrados de aplicaciones (Deployment, Replicationcontrolador, ReplicaSet y StatefulSet), con el selector de PDB coincidiendo con el selector del controlador.

Puedes utilizar un PDB con pods controlados por otro tipo de controlador, por un
"Operator", o pods individuales, pero con las siguientes restricciones:

- solo puedes usar `.spec.minAvailable`, no `.spec.maxUnavailable`.
- solo puedes usar un número entero en `.spec.minAvailable`, no un porcentaje.

Puedes usar un selector que selecciona un subconjunto o superconjunto de los pods que pertenecen a un controlador incorporado. Sin embargo, cuando hay varios PDB en un namespace, debes tener cuidado de no
crear PDBs cuyos selectores se superponen.



