---
title: Leases
api_metadata:
- apiVersion: "coordination.k8s.io/v1"
  kind: "Lease"
content_type: concept
weight: 30
---

<!-- overview -->

Los sistemas distribuidos suelen necesitar _leases_, que proporcionan un mecanismo para bloquear recursos compartidos
y coordinar la actividad entre los miembros de un conjunto.
En Kubernetes, el concepto de lease (arrendamiento) está representado por objetos [Lease](/docs/reference/kubernetes-api/cluster-resources/lease-v1/)
en el {{< glossary_tooltip text="grupo API" term_id="api-group" >}} de `coordination.k8s.io`,
que se utilizan para capacidades críticas del sistema, como los heartbeats del nodo y la elección del líder a nivel de componente.
<!-- body -->

## Heartbeats del nodo {#node-heart-beats}

Kubernetes utiliza la API Lease para comunicar los heartbeats de los nodos kubelet al servidor API de Kubernetes.
Para cada `Nodo` , existe un objeto `Lease` con un nombre que coincide en el espacio de nombres `kube-node-lease`.
Analizando a detalle, cada hearbeat es una solicitud **update** a este objeto `Lease`, actualizando
el campo `spec.renewTime` del objeto Lease. El plano de control de Kubernetes utiliza la marca de tiempo de este campo
para determinar la disponibilidad de este «Nodo».

Ve [Objetos Lease de nodos](/docs/concepts/architecture/nodes/#node-heartbeats) para más detalles.

## Elección del líder


Kubernetes también utiliza Leases para asegurar que sólo una instancia de un componente se está ejecutando en un momento dado.
Esto lo utilizan componentes del plano de control como `kube-controller-manager` y `kube-scheduler` en configuraciones de
HA, donde sólo una instancia del componente debe estar ejecutándose activamente mientras las otras 
instancias están en espera.

## Identidad del servidor API

{{< feature-state feature_gate_name="APIServerIdentity" >}}

A partir de Kubernetes v1.26, cada `kube-apiserver` utiliza la API Lease para publicar su identidad al resto del sistema. 
Aunque no es particularmente útil por sí mismo, esto proporciona un mecanismo para que los clientes
puedan descubrir cuántas instancias de `kube-apiserver` están operando el plano de control de Kubernetes.
La existencia de los objetos leases de kube-apiserver permite futuras capacidades que pueden requerir la coordinación entre
cada kube-apiserver.

Puedes inspeccionar los leases de cada kube-apiserver buscando objetos leases en el namespace `kube-system`
con el nombre `kube-apiserver-<sha256-hash>`. También puedes utilizar el selector de etiquetas `apiserver.kubernetes.io/identity=kube-apiserver`:

```shell
kubectl -n kube-system get lease -l apiserver.kubernetes.io/identity=kube-apiserver
```
```
NAME                                        HOLDER                                                                           AGE
apiserver-07a5ea9b9b072c4a5f3d1c3702        apiserver-07a5ea9b9b072c4a5f3d1c3702_0c8914f7-0f35-440e-8676-7844977d3a05        5m33s
apiserver-7be9e061c59d368b3ddaf1376e        apiserver-7be9e061c59d368b3ddaf1376e_84f2a85d-37c1-4b14-b6b9-603e62e4896f        4m23s
apiserver-1dfef752bcb36637d2763d1868        apiserver-1dfef752bcb36637d2763d1868_c5ffa286-8a9a-45d4-91e7-61118ed58d2e        4m43s

```


El hash SHA256 utilizado en el nombre del lease se basa en el nombre de host del sistema operativo visto por ese servidor API. Cada kube-apiserver debe ser
configurado para utilizar un nombre de host que es único dentro del clúster. Las nuevas instancias de kube-apiserver que utilizan el mismo nombre de host
asumirán los leases existentes utilizando una nueva identidad de titular, en lugar de instanciar nuevos objetos leases. Puedes comprobar el
nombre de host utilizado por kube-apiserver comprobando el valor de la etiqueta `kubernetes.io/hostname`:

```shell
kubectl -n kube-system get lease apiserver-07a5ea9b9b072c4a5f3d1c3702 -o yaml
```
```yaml
apiVersion: coordination.k8s.io/v1
kind: Lease
metadata:
  creationTimestamp: "2023-07-02T13:16:48Z"
  labels:
    apiserver.kubernetes.io/identity: kube-apiserver
    kubernetes.io/hostname: master-1
  name: apiserver-07a5ea9b9b072c4a5f3d1c3702
  namespace: kube-system
  resourceVersion: "334899"
  uid: 90870ab5-1ba9-4523-b215-e4d4e662acb1
spec:
  holderIdentity: apiserver-07a5ea9b9b072c4a5f3d1c3702_0c8914f7-0f35-440e-8676-7844977d3a05
  leaseDurationSeconds: 3600
  renewTime: "2023-07-04T21:58:48.065888Z"
```

Los leases caducados de los kube-apiservers que ya no existen son recogidos por los nuevos kube-apiservers después de 1 hora.

Puedes desactivar el lease de identidades del servidor API desactivando la opción `APIServerIdentity` de los [interruptores de funcionalidades](/docs/reference/command-line-tools-reference/feature-gates/).

## Cargas de trabajo {#custom-workload}

Tu propia carga de trabajo puede definir su propio uso de los leases. Por ejemplo, puede ejecutar un
{{< glossary_tooltip term_id=controller text=controlador >}} en la que un miembro principal o líder
realiza operaciones que sus compañeros no realizan. Tú defines un Lease para que las réplicas del controlador puedan seleccionar
o elegir un líder, utilizando la API de Kubernetes para la coordinación.
Si utilizas un lease, es una buena práctica definir un nombre para el lease que esté obviamente vinculado a
el producto o componente. Por ejemplo, si tienes un componente denominado Ejemplo Foo, utilice un lease denominado
`ejemplo-foo`.

Si un operador de clúster u otro usuario final puede desplegar varias instancias de un componente, selecciona un nombre
prefijo y elije un mecanismo (como el hash del nombre del despliegue) para evitar colisiones de nombres
para los leases.

Puedes utilizar otro enfoque siempre que consigas el mismo resultado: los distintos productos de software no entren en conflicto entre sí.