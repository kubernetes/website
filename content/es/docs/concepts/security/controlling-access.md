---
reviewers:
- electrocucaracha
- raelga
title: Controlando el Acceso a la API de Kubernetes
content_type: concept
---

<!-- overview -->
Esta página proporciona información sobre cómo controlar el acceso a la API de Kubernetes.


<!-- body -->
Los usuarios acceden a la [API de Kubernetes](/docs/concepts/overview/kubernetes-api/) usando `kubectl`,
bibliotecas de cliente, o haciendo peticiones REST.  Usuarios y
[Kubernetes service accounts](/docs/tasks/configure-pod-container/configure-service-account/) pueden ser
autorizados para acceder a la API.
Cuando una petición llega a la API, pasa por varias etapas, están ilustradas en el
siguiente diagrama:

![Diagrama de pasos para una petición a la API de Kubernetes](/images/docs/admin/access-control-overview.svg)

## Seguridad en la capa de transporte

En un {{< glossary_tooltip term_id="cluster" text="cluster" >}}  típico de Kubernetes, la API sirve peticiones en el puerto 443, protegida por TLS.
El {{< glossary_tooltip term_id="kube-apiserver" text="API Server" >}} presenta un certificado. Este certificado puede ser firmando usando
un certificado de autoridad privada (CA) o basado en una llave pública relacionada
generalmente a un CA reconocido.

Si el cluster usa un certificado de autoridad privado, se necesita copiar este certificado
CA configurado dentro de su `~/.kube/config` en el cliente, entonces se podrá
confiar en la conexión y estar seguro que no será comprometida.

El cliente puede presentar un certificado TLS de cliente en esta etapa.

## Autenticación

Una vez que se estableció la conexión TLS, las peticiones HTTP avanzan a la etapa de autenticación.
Esto se muestra en el paso 1 del diagrama.
El script de creación del cluster o el administrador del cluster puede configurar el {{< glossary_tooltip term_id="kube-apiserver" text="API Server" >}} para ejecutar
uno o mas módulos de autenticación.
Los Autenticadores están descritos con más detalle en
[Authentication](/docs/reference/access-authn-authz/authentication/).

```The input to the authentication step is the entire HTTP request; however, it typically
examines the headers and/or client certificate.
```
La entrada al paso de autenticación es la petición HTTP completa, aun así, esta tipicamente
examina las cabeceras y/o el certificado del cliente.

Los modulos de autenticación incluyen certificado de cliente, contraseña, tokens planos,
tokens de inicio y JSON Web Tokens (usados para los service accounts).

Múltiples módulos de autenticación puede ser especificados, en este caso cada uno es probado secuencialmente,
hasta que uno de ellos tiene éxito.

Si la petición no puede ser autenticada, la misma es rechazada con un código HTTP 401.
En otro caso, el usuario es validado con el `username` específico, y el nombre de usuario
esta disponible para los pasos siguientes. Algunos autenticadores
tambien proporcionan membresías de grupo al usuario, mientras que otros
no lo hacen.

While Kubernetes uses usernames for access control decisions and in request logging,
este n otiene un objeto `User` ni tampoco guarda nombres de usaurio o otra información acerca
de ellos en su API.

## Autorización

Despues de autenticar la petición como proveniente de un usuario específico, la petición debe ser autorizada. Esto se muestra en el paso 2 del diagrama.

Una petición debe incluir el nombre de usuario solicitante, la acción solicitada y el objeto afectado por la acción. La petición es autorizada si hay una politica existente que declare que el usuario tiene permisos para la realizar la acción.

Por ejemplo, si Bob tiene la siguiente politica, entonces el puede leer pods solamente en el namespace `projectCaribou`:

```json
{
    "apiVersion": "abac.authorization.kubernetes.io/v1beta1",
    "kind": "Policy",
    "spec": {
        "user": "bob",
        "namespace": "projectCaribou",
        "resource": "pods",
        "readonly": true
    }
}
```
Si Bob hace la siguiente petición, será aturizada porque él tiene permitido leer los objetos en el namespace `projectCaribou` :

```json
{
  "apiVersion": "authorization.k8s.io/v1beta1",
  "kind": "SubjectAccessReview",
  "spec": {
    "resourceAttributes": {
      "namespace": "projectCaribou",
      "verb": "get",
      "group": "unicorn.example.org",
      "resource": "pods"
    }
  }
}
```
Si Bob en su petición intenta escribir (`create` o `update`) en los objetos del namespace `projectCaribou`. Si Bob hace una petición para leer (`get`) objetocs en otro namespace como `projectFish`, entonces la autorización será denegada.

Las autorizaciones en Kubernetes requieren que se usen atributos REST comunes para interactuar con el existente sistema de control de toda la organización o del proveedor cloud. Es importante usar formatos REST porque esos sistemas de control pueden interactuar con otras APIs además de la API de Kubernetes.

Kubernetes soporta multiples modulos de autorización, como el modo ABAC, el modo RBAC y el modo Webhook. Cuando un administrador crea un cluster, se realiza la configuración de los modulos de autorización que deben ser usados con la API del server. Si mas de uno modulo de autorización es configurado, Kubernetes verificada cada uon y si alguno de ellos autoriza la petición entonces la misma se ejecuta. Si todos los modules deniegan la petición, entonces la misma es denegada (Con un error HTTP con código 403).

Para leer más acerca de las autorizaciones en Kubernetes, incluyendo detalles acerca de crear politicas usando los modulos de autorización soportados, vea [Authorization](/docs/reference/access-authn-authz/authorization/).


## Control de Admisión

Los modulos de Control de Admisión son modulos de software que solo pueen modificar o rechazar peticiones.
Adicionalmente a los atributos disponibles en los modulos de Autorización, los modulos de
Control de Admisión pueden acceder al contenido del objeto que esta siendo creado o modificado.

Los Controles de Admisión actúan en las peticiones que crean, modifican, borran ó se conectan (proxy) a un objeto.
cuando multiples modulos de control de admisión son configurados, son llamados en orden.

Esto se muestra en el paso 3 del diagrama.

A diferencia de los modulos de Autorización y Autenticación, si uno de los modulos de control de admisión
rechaza la petición, entonces es inmediatamente rechazada.

Adicionalmente a rechazar objetos, los controles de admisión pueden tambien permite establecer
valores predeterminados complejos.

Los modulos de Control de Admisión disponibles están descriptos en [Admission Controllers](/docs/reference/access-authn-authz/admission-controllers/).

Cuando una petición pasa todos los controles de admisión, esta es validada usando la rutinas de validación
para el objeto API correspondiente y luego es escrita en el objeto.


## Puertos e IPs del API server

La discusión previa aplica a peticiones enviadas a un puerto seguro del servidor API
(el caso típico). El servidor API puede en realidad servir en 2 puertos:

Por defecto, la API de Kubernetes entrega HTTP en 2 puertos:

  1. puerto `localhost`:

      - debe usarse para testeo e iniciar el sistema y para otros componentes del nodo maestro
        (scheduler, controller-manager) para hablar con la API
      - no se usa TLS
      - el puerto predeterminado es el `8080`
      - la IP por defecto es localhost, la puede cambiar con el flag `--insecure-bind-address`.
      - request **bypasses** authentication and authorization modules.
      - peticiones controladas por los modulos de control de admisión.
      - protejidas por necesidad para tener acceso al host

  2. “Puerto seguro”:

      - usar siempre que sea posible
      - usa TLS.  Se configura el certificado con el flag `--tls-cert-file` y la llave con `--tls-private-key-file`.
      - el puerto predeterminado es 6443, se cambia con el flag `--secure-port`.
      - la IP por defecto es la primer interface que no es la localhost. se cambia con el flag `--bind-address`.
      - peticiones controladas por los módulos de autenticación y autorización.
      - peticiones controladas por los módulos de control de admisión.

## {{% heading "whatsnext" %}}

Lea mas documentación sobre autenticación, autorización y el contro de acceso a la API:

- [Authenticating](/docs/reference/access-authn-authz/authentication/)
   - [Authenticating with Bootstrap Tokens](/docs/reference/access-authn-authz/bootstrap-tokens/)
- [Admission Controllers](/docs/reference/access-authn-authz/admission-controllers/)
   - [Dynamic Admission Control](/docs/reference/access-authn-authz/extensible-admission-controllers/)
- [Authorization](/docs/reference/access-authn-authz/authorization/)
   - [Role Based Access Control](/docs/reference/access-authn-authz/rbac/)
   - [Attribute Based Access Control](/docs/reference/access-authn-authz/abac/)
   - [Node Authorization](/docs/reference/access-authn-authz/node/)
   - [Webhook Authorization](/docs/reference/access-authn-authz/webhook/)
- [Certificate Signing Requests](/docs/reference/access-authn-authz/certificate-signing-requests/)
   - including [CSR approval](/docs/reference/access-authn-authz/certificate-signing-requests/#approval-rejection)
     and [certificate signing](/docs/reference/access-authn-authz/certificate-signing-requests/#signing)
- Service accounts
  - [Developer guide](/docs/tasks/configure-pod-container/configure-service-account/)
  - [Administration](/docs/reference/access-authn-authz/service-accounts-admin/)

Tambien puede aprender sobre:
- como los pods pueden usar
  [Secrets](/docs/concepts/configuration/secret/#service-accounts-automatically-create-and-attach-secrets-with-api-credentials)
  para obtener credenciales para la API.
