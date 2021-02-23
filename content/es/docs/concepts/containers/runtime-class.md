---
reviewers:
title: Clase Runtime
content_type: concept
weight: 20
---

<!-- overview -->

{{< feature-state for_k8s_version="v1.20" state="stable" >}}

Esta página describe el recurso RuntimeClass y el mecanismo de selección del
motor de ejecución.

RuntimeClass es una característica que permite seleccionar la configuración del
motor de ejecución para los contenedores. La configuración del motor de ejecución para
los contenedores se utiliza para ejecutar los contenedores de un Pod.




<!-- body -->

## Motivación

Se puede seleccionar un RuntimeClass diferente entre diferentes Pods para
proporcionar equilibrio entre rendimiento y seguridad. Por ejemplo, si parte de
la carga de trabajo requiere un alto nivel de garantía de seguridad, se podrían
planificar esos Pods para ejecutarse en un motor de ejecución que use
virtualización de hardware. Así se beneficiaría con un mayor aislamiento del motor
de ejecución alternativo, con el coste de alguna sobrecarga adicional.

También se puede utilizar el RuntimeClass para ejecutar distintos Pods con el
mismo motor de ejecución pero con distintos parámetros.

## Configuración

1. Configurar la implementación del CRI en los nodos (depende del motor de
   ejecución)
2. Crear los recursos RuntimeClass correspondientes.

### 1. Configurar la implementación del CRI en los nodos

La configuración disponible utilizando RuntimeClass dependen de la
implementación de la Interfaz del Motor de ejecución de Containers (CRI). Véase
la documentación correspondiente ([más abajo)[#cri-configuration]) para más
información sobre cómo configurar la implementación del CRI.

{{< note >}}
RuntimeClass por defecto asume una configuración de nodos homogénea para todo el
clúster (lo que significa que todos los nodos están configurados de la misma
forma para el motor de ejecución de los contenedores). Para soportar configuraciones
heterogéneas de nodos, véase [Planificación](#scheduling) más abajo.
{{< /note >}}

Las configuraciones tienen un nombre de `manejador` correspondiente, referenciado
por la RuntimeClass. El manejador debe ser una etiqueta DNS 1123 válida
(alfanumérico + caracter `-`).
The configurations have a corresponding `handler` name, referenced by the RuntimeClass. The
handler must be a valid DNS 1123 label (alpha-numeric + `-` characters).

### 2. Crear los recursos RuntimeClass correspondientes.

Cada configuración establecida en el paso 1 tiene un nombre de `manejador`, que
identifica a dicha configuración. Para cada manejador, hay que crearun objeto
RuntimeClass correspondiente.

Actualmente el recurso RuntimeClass sólo tiene dos campos significativos: el
nombre del RuntimeClass (`metadata.name`) y el manejador (`handler`). La
definición del objeto se parece a ésta:

```yaml
apiVersion: node.k8s.io/v1  # La RuntimeClass se define en el grupo node.k8s.io
kind: RuntimeClass
metadata:
  name: myclass  # Nombre por el que se referenciará la RuntimeClass
  # no contiene espacio de nombres
handler: myconfiguration  # El nombre de la configuración CRI correspondiente
```

El nombre de un objeto RuntimeClass debe ser un [nombre de subdominio
DNS](/docs/concepts/overview/working-with-objects/names#dns-subdomain-names)
válido.

{{< note >}}
Se recomienda que las operaciones de escritura de la RuntimeClass
(creación/modificación/parcheo/elimiación) se restrinjan al administrador del
cluster. Habitualmente es el valor por defecto. Véase [Visión general de la
Autorización](/docs/reference/access-authn-authz/authorization/) para más
detalles.
{{< /note >}}

## Uso

Una vez se han configurado las RuntimeClasses para el cluster, utilizarlas es
muy sencillo. Se especifica un `runtimeClassName` en la especificación del Pod.
Por ejemplo:


```yaml
apiVersion: v1
kind: Pod
metadata:
  name: mypod
spec:
  runtimeClassName: myclass
  # ...
```

Así se informa al kubelet del nombre de la RuntimeClass a utilizar para ejecutar
este pod. Si dicho RuntimeClass no existe, o el CRI no puede ejecutar el
manejador correspondiente, el pod entrará en la
[fase](/docs/concepts/workloads/pods/pod-lifecycle/#pod-phase) final `Failed`.
Se puede buscar por el correspondiente
[evento](/docs/tasks/debug-application-cluster/debug-application-introspection/)
con el mensaje de error.

Si no se especifica ninguna `runtimeClassName`, se usará el RuntimeHandler por
defecto, lo que equivale al comportamiento cuando la opción RuntimeClass está
deshabilitada.

### Configuración del CRI

Para más detalles sobre cómo configurar los motores de ejecución del CRI, véase
[instalación del CRI] (/docs/setup/production-environment/container-runtimes/).

#### dockershim

El CRI dockershim incorporado por Kubernetes no soporta manejadores de motor de
ejecución.

#### {{< glossary_tooltip term_id="containerd" >}}

Los manejadores del motor de ejecución se configuran mediante la configuración
de containerd en `/etc/containerd/config.toml`. Los manejadores válidos se
configuran en la sección de motores de ejecución:

```
[plugins.cri.containerd.runtimes.${HANDLER_NAME}]
```

Véase la configuración de containerd para más detalles:
https://github.com/containerd/cri/blob/master/docs/config.md

#### {{< glossary_tooltip term_id="cri-o" >}}

Los manejadores del motor de ejecución se configuran a través de la
configuración del CRI-O en `/etc/crio/crio.conf`. Los manejadores válidos se
configuran en la [tabla
crio.runtime](https://github.com/cri-o/cri-o/blob/master/docs/crio.conf.5.md#crioruntime-table)

```
[crio.runtime.runtimes.${HANDLER_NAME}]
  runtime_path = "${PATH_TO_BINARY}"
```

Véase la [documentación de la
configuración](https://raw.githubusercontent.com/cri-o/cri-o/9f11d1d/docs/crio.conf.5.md)
de CRI-O para más detalles.

## Planificación

{{< feature-state for_k8s_version="v1.16" state="beta" >}}

Especificando el campo `scheduling` en una RuntimeClass se pueden establecer
restricciones para asegurar que los Pods ejecutándose con dicha RuntimeClass se
planifican en los nodos que la soportan.

Para asegurar que los pods aterrizan en nodos que soportan una RuntimeClass
determinada, ese conjunto de nodos debe tener una etiqueta común que se
selecciona en el campo `runtimeclass.scheduling.nodeSelector`. El nodeSelector
de la RuntimeClass se combina con el nodeSelector del pod durante la admisión,
haciéndose efectiva la intersección del conjunto de nodos seleccionados por
ambos. Si hay conflicto, el pod se rechazará.

Si los nodos soportados se marcan para evitar que los pods con otra RuntimeClass
se ejecuten en el nodo, se pueden añadir `tolerations` al RuntimeClass. Igual
que con el `nodeSelector`, las tolerancias se mezclan con las tolerancias del
pod durante la admisión, haciéndose efectiva la unión del conjunto de nodos
tolerados por ambos.

Para saber más sobre configurar el selector de nodos y las tolerancias, véase
[Asignando Pods a Nodos](/docs/concepts/scheduling-eviction/assign-pod-node/).

### Sobrecarga del Pod

{{< feature-state for_k8s_version="v1.18" state="beta" >}}

Se pueden especificar recursos de _sobrecarga_ adicional que se asocian a los
Pods que estén ejeuctándose. Declarar la sobrecarga permite al cluster (incluido
el planificador) contabilizarlo al tomar decisiones sobre los Pods y los
recursos. Parautilizar la sobrecarga de pods, se debe haber habilitado la
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/)
PodOverhead (lo está por defecto).

La sobrecarga de pods se define en la RuntimeClass a través del los campos de
`overhead`. Con estos campos se puede especificar la sobrecarga de los pods en
ejecución que utilizan esta RuntimeClass para asegurar que estas sobrecargas se
cuentan en Kubernetes.

## {{% heading "whatsnext" %}}


- [Diseño de RuntimeClass](https://github.com/kubernetes/enhancements/blob/master/keps/sig-node/585-runtime-class/README.md)
- [Diseño de programación de RuntimeClass](https://github.com/kubernetes/enhancements/blob/master/keps/sig-node/585-runtime-class/README.md#runtimeclass-scheduling)
- Leer sobre el concepto de [Pod Overhead](/docs/concepts/scheduling-eviction/pod-overhead/)
- [Diseño de capacidad de PodOverhead](https://github.com/kubernetes/enhancements/blob/master/keps/sig-node/20190226-pod-overhead.md)
