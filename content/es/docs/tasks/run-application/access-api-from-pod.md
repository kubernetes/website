---
title: Accediendo a la API de Kubernetes desde un Pod
content_type: task
weight: 120
---

<!-- overview -->

Esta guía demuestra cómo acceder a la API de Kubernetes desde dentro de un pod.

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

<!-- steps -->

## Accediendo a la API desde dentro de un Pod

Al acceder a la API desde dentro de un Pod, localizar y autenticarse
en el servidor de la API es ligeramente diferente al caso de un cliente externo.

La forma más fácil de usar la API de Kubernetes desde un Pod es utilizar
una de las bibliotecas de [cliente oficiales](/docs/reference/using-api/client-libraries/). Estas
bibliotecas pueden descubrir automáticamente el servidor de la API y autenticarse.

### Usando Bibliotecas de Cliente Oficiales

Desde dentro de un POD, las formas recomendadas de conectarse a la API de Kubernetes son:

- Para un cliente de Go, utiliza la
  [biblioteca oficial de cliente Go](https://github.com/kubernetes/client-go/).
  La función `rest.InClusterConfig()` maneja automáticamente el descubrimiento del host de la API
  y la autenticación. Ver [un ejemplo aqui](https://git.k8s.io/client-go/examples/in-cluster-client-configuration/main.go).

- Para un cliente de Python, utiliza la
  [biblioteca oficial de cliente Python](https://github.com/kubernetes-client/python/).
  La función `config.load_incluster_config()` maneja automáticamente el descubrimiento
  del host de la API y la autenticación. Ver [un ejemplo aqui](https://github.com/kubernetes-client/python/blob/master/examples/in_cluster_config.py).

- Existen varias bibliotecas disponibles, por favor consulta la pagina de
  [Bibliotecas de Cliente](/docs/reference/using-api/client-libraries/).

En cada caso, las credenciales de la cuenta de servicio del Pod se utilizan para
comunicarse de manera segura con el servidor de la API.

### Accediendo directamente a la API REST

Al ejecutarse en un Pod, tu contenedor puede crear una URL HTTPS para el servidor
de la API de Kubernetes obteniendo las variables de entorno `KUBERNETES_SERVICE_HOST`
and `KUBERNETES_SERVICE_PORT_HTTPS`. La dirección del servidor de la API dentro del
clúster también se publica en un Servicio llamado `kubernetes` en el espacio de nombres
`default`, de modo que los pods pueden hacer referencia a `kubernetes.default.svc`como
el nombre DNS para el servidor de la API local.

{{< note >}}
Kubernetes does not guarantee that the API server has a valid certificate for
the hostname `kubernetes.default.svc`;
however, the control plane **is** expected to present a valid certificate for the
hostname or IP address that `$KUBERNETES_SERVICE_HOST` represents.
{{< /note >}}

The recommended way to authenticate to the API server is with a
[service account](/docs/tasks/configure-pod-container/configure-service-account/)
credential. By default, a Pod
is associated with a service account, and a credential (token) for that
service account is placed into the filesystem tree of each container in that Pod,
at `/var/run/secrets/kubernetes.io/serviceaccount/token`.

If available, a certificate bundle is placed into the filesystem tree of each
container at `/var/run/secrets/kubernetes.io/serviceaccount/ca.crt`, and should be
used to verify the serving certificate of the API server.

Finally, the default namespace to be used for namespaced API operations is placed in a file
at `/var/run/secrets/kubernetes.io/serviceaccount/namespace` in each container.

### Using kubectl proxy

Si deseas consultar la API sin una biblioteca de cliente oficial, puedes ejecutar `kubectl proxy`
como el [comando](/docs/tasks/inject-data-application/define-command-argument-container/)
de un nuevo contenedor sidecar en el Pod. De esta manera, `kubectl proxy` se autenticará
en la API y la expondrá en la interfaz `localhost` del Pod, para que otros contenedores
en el Pod puedan usarla directamente.

### Sin usar un proxy

Es posible evitar el uso del proxy de kubectl pasando el token de autenticación
directamente al servidor de la API. El certificado interno asegura la conexión.

```shell
# Point to the internal API server hostname
APISERVER=https://kubernetes.default.svc

# Path to ServiceAccount token
SERVICEACCOUNT=/var/run/secrets/kubernetes.io/serviceaccount

# Read this Pod's namespace
NAMESPACE=$(cat ${SERVICEACCOUNT}/namespace)

# Read the ServiceAccount bearer token
TOKEN=$(cat ${SERVICEACCOUNT}/token)

# Reference the internal certificate authority (CA)
CACERT=${SERVICEACCOUNT}/ca.crt

# Explore the API with TOKEN
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
