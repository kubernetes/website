---
title: Espacios de nombres
content_template: templates/concept
weight: 30
---

{{% capture overview %}}

Kubernetes soporta múltiples clústeres virtuales respaldados por el mismo clúster físico.
Estos clústeres virtuales se denominan espacios de nombres (namespaces).

{{% /capture %}}


{{% capture body %}}

## Cuándo Usar Múltiple Espacios de Nombre

Los espacios de nombres están pensados para utilizarse en entornos con muchos usuarios
distribuidos entre múltiples equipos, o proyectos. Para aquellos clústeres con 
unas pocas decenas de usuarios, no deberías necesitar crear o pensar en espacios de 
nombres en absoluto. Empieza a usarlos solamente si necesitas las características
que proporcionan.

Los espacios de nombres proporcionan un campo de acción para los nombres.  Los nombres de los recursos
tienen que ser únicos dentro de cada espacio de nombres, pero no entre dichos espacios de nombres.

Los espacios de nombres son una forma de dividir los recursos del clúster
entre múltiples usuarios (via [cuotas de recursos](/docs/concepts/policy/resource-quotas/)).

En futuras versiones de Kubernetes, los objetos de un mismo espacio de nombres
tendrán las mismas políticas de control de acceso por defecto.

No es necesario usar múltiples espacios de nombres sólo para separar recursos 
ligeramente diferentes, como versiones diferentes de la misma aplicación: para ello
utiliza [etiquetas](/docs/user-guide/labels) para distinguir tus recursos dentro
del mismo espacio de nombres.

## Trabajar con Espacios de Nombres

La creación y borrado de espacios de nombres se describe en la [documentación de la Guía de Administración para espacios de nombres](/docs/admin/namespaces).

### Ver espacios de nombre

Puedes listar los espacios de nombres actuales dentro de un clúster mediante:

```shell
kubectl get namespaces
```
```
NAME          STATUS    AGE
default       Active    1d
kube-system   Active    1d
kube-public   Active    1d
```

Kubernetes arranca con tres espacios de nombres inicialmente:

   * `default` El espacio de nombres por defecto para aquellos objetos que no especifican ningún espacio de nombres
   * `kube-system` El espacio de nombres para aquellos objetos creados por el sistema de Kubernetes
   * `kube-public` Este espacio de nombres se crea de forma automática y es legible por todos los usuarios (incluyendo aquellos no autenticados). 
   Este espacio de nombres se reserva principalmente para uso interno del clúster, en caso de que algunos recursos necesiten ser visibles y legibles de forma pública para todo el clúster. 
   La naturaleza pública de este espacio de nombres es simplemente por convención, no es un requisito.

### Establecer el espacio de nombres para una petición

Para indicar de forma temporal el espacio de nombres para una petición, usa la opción `--namespace`.

Por ejemplo:

```shell
kubectl --namespace=<insert-namespace-name-here> run nginx --image=nginx
kubectl --namespace=<insert-namespace-name-here> get pods
```

### Establecer la preferencia de espacio de nombres

Puedes indicar de forma permanente el espacio de nombres para todas las llamadas futuras a comandos kubectl
en dicho contexto.

```shell
kubectl config set-context --current --namespace=<insert-namespace-name-here>
# Validate it
kubectl config view | grep namespace:
```

## Espacios de nombres y DNS

Cuando creas un [Servicio](/docs/user-guide/services), se crea una [entrada DNS](/docs/concepts/services-networking/dns-pod-service/) correspondiente.
Esta entrada tiene la forma `<service-name>.<namespace-name>.svc.cluster.local`, que significa
que si un contenedor simplemente usa `<service-name>`, se resolverá al servicio
que sea local al espacio de nombres. Esto es de utilidad para poder emplear la misma
configuración entre múltiples espacios de nombres como Development, Staging y Production.
Si quieres referenciar recursos entre distintos espacios de nombres, entonces
debes utilizar el nombre cualificado completo de dominio (FQDN).

## No Todos los Objetos están en un Espacio de nombres

La mayoría de los recursos de Kubernetes (ej. pods, services, replication controllers, y otros) están
en algunos espacios de nombres.  Sin embargo, los recursos que representan a los propios
 espacios de nombres no están a su vez en espacios de nombres.
De forma similar, los recursos de bajo nivel, como los nodos [nodos](/docs/admin/node) y
los volúmenes persistentes, no están en ningún espacio de nombres.

Para comprobar qué recursos de Kubernetes están y no están en un espacio de nombres:

```shell
# In a namespace
kubectl api-resources --namespaced=true

# Not in a namespace
kubectl api-resources --namespaced=false
```

{{% /capture %}}
