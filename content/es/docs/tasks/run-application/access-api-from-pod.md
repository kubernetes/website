---
title: Accediendo a la API de Kubernetes desde un Pod
content_type: task
weight: 120
---

<!-- overview -->

Esta guía muestra como acceder a la API de Kubernetes desde de un Pod.

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

<!-- steps -->

## Accediendo a la API desde un Pod

El acceder a la API desde un Pod, la ubicacion y autentication
del servidor de la API es ligeramente diferente que en el caso de un cliente externo.

La forma más fácil de usar la API de Kubernetes desde un Pod es utilizando
una de las bibliotecas de [cliente oficiales](/docs/reference/using-api/client-libraries/). Estas
bibliotecas pueden automáticamente descubrir el servidor de la API y autenticarse.

### Usando Bibliotecas de Cliente Oficiales

Desde un Pod, las formas recomendadas de conectarse a la API de Kubernetes son:

- Para un cliente de Go, utilice la
  [biblioteca oficial del cliente de Go](https://github.com/kubernetes/client-go/).
  La función `rest.InClusterConfig()` maneja automáticamente el descubrimiento del host de la API
  y la autenticación. Vea [un ejemplo aqui](https://git.k8s.io/client-go/examples/in-cluster-client-configuration/main.go).

- Para un cliente de Python, utilice la
  [biblioteca oficial del cliente de Python](https://github.com/kubernetes-client/python/).
  La función `config.load_incluster_config()` maneja automáticamente el descubrimiento
  del host de la API y la autenticación. Vea [un ejemplo aqui](https://github.com/kubernetes-client/python/blob/master/examples/in_cluster_config.py).

- Existen varias bibliotecas disponibles, por favor consulte la página de
  [Bibliotecas de Clientes](/docs/reference/using-api/client-libraries/).

En cada caso, las credenciales de la cuenta de servicio del Pod se utilizan para
comunicarse de manera segura con el servidor de la API.

### Accediendo directamente a la API REST

Al ejecutarse en un Pod, su contenedor puede crear una URL HTTPS para el servidor de la API de Kubernetes
obteniendo las variables de entorno `KUBERNETES_SERVICE_HOST`y `KUBERNETES_SERVICE_PORT_HTTPS`.
La dirección del servidor de la API dentro del clúster también se publica
en un Servicio llamado `kubernetes` en el namespace `default`, de modo que los pods pueden hacer referencia a
`kubernetes.default.svc` como el nombre DNS para el servidor de la API local.

{{< note >}}
Kubernetes no garantiza que el servidor de API tenga un certificado válido para el
nombre de host `kubernetes.default.svc`;
Sin embargo, se espera que el plano de control presente un certificado válido para
el nombre de host o la dirección IP que representa `$KUBERNETES_SERVICE_HOST`
{{< /note >}}

La forma recomendada para autenticarse con el servidor de la API es con una
credencial de [cuenta de servicio](/docs/tasks/configure-pod-container/configure-service-account/).
Por defecto, un Pod esta asociado con una cuenta de servicio,
esta asociado con una cuenta de servicio, y una credencial (token) para esa cuenta
de servicio se coloca en el sistema de archivos de cada contenedor en ese Pod
en la ruta `/var/run/secrets/kubernetes.io/serviceaccount/token`.

Si está disponible, un paquete de certificados se coloca en el sistema de archivos de
cada contenedor en la ruta `/var/run/secrets/kubernetes.io/serviceaccount/ca.crt`, y
debe usarse para verificar el certificado de servicio del servidor API.

Finalmente, el Namespace default puede ser utilizado en las operaciones de API con ámbito de espacio de nombres que se colocan en un archivo
con la ruta `/var/run/secrets/kubernetes.io/serviceaccount/namespace` de cada contenedor

### Usando kubectl proxy

Si deseas consultar la API sin una biblioteca de cliente oficial, puedes ejecutar `kubectl proxy`
como el [comando](/docs/tasks/inject-data-application/define-command-argument-container/)
de un nuevo contenedor sidecar en el Pod. De esta manera, `kubectl proxy` se autenticará
en la API y la expondrá en la interfaz `localhost` del Pod, para que otros contenedores
en el Pod puedan usarla directamente.

### Sin usar un proxy

Es posible evitar el uso del proxy de kubectl pasando el token de autenticación
directamente al servidor de la API. El certificado interno asegura la conexión.

```shell
# Apuntar nombre de host del servidor API interno.
APISERVER=https://kubernetes.default.svc

# Ruta del token de ServiceAccount
SERVICEACCOUNT=/var/run/secrets/kubernetes.io/serviceaccount

# Lectura del Namespace del Pod
NAMESPACE=$(cat ${SERVICEACCOUNT}/namespace)

# Lectura del bearer token del ServiceAccount
TOKEN=$(cat ${SERVICEACCOUNT}/token)

# Referencia a la autoridad de certificación interna (CA)
CACERT=${SERVICEACCOUNT}/ca.crt

# Explora la API con TOKEN
curl --cacert ${CACERT} --header "Authorization: Bearer ${TOKEN}" -X GET ${APISERVER}/api
```

La salida será similar a esto:

```json
{
  "kind": "APIVersions",
  "versions": ["v1"],
  "serverAddressByClientCIDRs": [
    {
      "clientCIDR": "0.0.0.0/0",
      "serverAddress": "10.0.1.149:443"
    }
  ]
}
```
