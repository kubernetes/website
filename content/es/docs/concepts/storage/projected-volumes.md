---
reviewers:
  - ramrodo
  - krol3
  - electrocucaracha
title: Volúmenes proyectados
content_type: concept
weight: 21 # just after persistent volumes
---

<!-- overview -->

Este documento describe los _volúmenes proyectados_ en Kubernetes. Necesita estar familiarizado con [volúmenes](/es/docs/concepts/storage/volumes/).

<!-- body -->

## Introducción

Un volumen `proyectado` asigna varias fuentes de volúmenes existentes al mismo directorio.

Actualmente se pueden proyectar los siguientes tipos de fuentes de volumen:

- [`secret`](/es/docs/concepts/storage/volumes/#secret)
- [`downwardAPI`](/es/docs/concepts/storage/volumes/#downwardapi)
- [`configMap`](/es/docs/concepts/storage/volumes/#configmap)
- [`serviceAccountToken`](#serviceaccounttoken)

Se requiere que todas las fuentes estén en el mismo espacio de nombres que el Pod. Para más detalles,
vea el documento de diseño [all-in-one volume](https://git.k8s.io/design-proposals-archive/node/all-in-one-volume.md).

### Configuración de ejemplo con un secreto, una downwardAPI y una configMap {#example-configuration-secret-downwardapi-configmap}

{{% code_sample file="pods/storage/projected-secret-downwardapi-configmap.yaml" %}}

### Configuración de ejemplo: secretos con un modo de permiso no predeterminado establecido {#example-configuration-secrets-nondefault-permission-mode}

{{% code_sample file="pods/storage/projected-secrets-nondefault-permission-mode.yaml" %}}

Cada fuente de volumen proyectada aparece en la especificación bajo `sources`. Los parámetros son casi los mismos con dos excepciones:

- Para los secretos, el campo `secretName` se ha cambiado a `name` para que sea coherente con el nombre de ConfigMap.
- El `defaultMode` solo se puede especificar en el nivel proyectado y no para cada fuente de volumen. Sin embargo, como se ilustra arriba, puede configurar explícitamente el `mode` para cada proyección individual.

## Volúmenes proyectados de serviceAccountToken {#serviceaccounttoken}

Puede inyectar el token para la [service account](/docs/reference/access-authn-authz/authentication/#service-account-tokens) actual
en un Pod en una ruta especificada. Por ejemplo:

{{% code_sample file="pods/storage/projected-service-account-token.yaml" %}}

El Pod de ejemplo tiene un volumen proyectado que contiene el token de cuenta de servicio inyectado.
Los contenedores en este Pod pueden usar ese token para acceder al servidor API de Kubernetes, autenticándose con la identidad de [the pod's ServiceAccount](/docs/tasks/configure-pod-container/configure-service-account/).

El campo `audience` contiene la audiencia prevista del
token. Un destinatario del token debe identificarse con un identificador especificado en la audiencia del token y, de lo contrario, debe rechazar el token. Este campo es opcional y de forma predeterminada es el identificador del servidor API.

The `expirationSeconds` es la duración esperada de validez del token de la cuenta de servicio. El valor predeterminado es 1 hora y debe durar al menos 10 minutos (600 segundos).
Un administrador
también puede limitar su valor máximo especificando la opción `--service-account-max-token-expiration`
para el servidor API. El campo `path` especifica una ruta relativa al punto de montaje del volumen proyectado.

{{< note >}}
Un contenedor que utiliza una fuente de volumen proyectada como montaje de volumen [`subPath`](/docs/concepts/storage/volumes/#using-subpath)
no recibirá actualizaciones para esas fuentes de volumen.
{{< /note >}}

## Interacciones SecurityContext

La [propuesta](https://git.k8s.io/enhancements/keps/sig-storage/2451-service-account-token-volumes#proposal) para el manejo de permisos de archivos en la mejora del volumen de cuentas de servicio proyectadas introdujo los archivos proyectados que tienen los permisos de propietario correctos establecidos.

### Linux

En los pods de Linux que tienen un volumen proyectado y `RunAsUser` configurado en el Pod
[`SecurityContext`](/docs/reference/kubernetes-api/workload-resources/pod-v1/#security-context),
los archivos proyectados tienen la conjunto de propiedad correcto, incluida la propiedad del usuario del contenedor.

Cuando todos los contenedores en un pod tienen el mismo `runAsUser` configurado en su
[`PodSecurityContext`](/docs/reference/kubernetes-api/workload-resources/pod-v1/#security-context)
o el contenedor
[`SecurityContext`](/docs/reference/kubernetes-api/workload-resources/pod-v1/#security-context-1),
entonces el kubelet garantiza que el contenido del volumen `serviceAccountToken` sea propiedad de ese usuario y que el archivo token tenga su modo de permiso establecido en `0600`.

{{< note >}}
{{< glossary_tooltip text="Ephemeral containers" term_id="ephemeral-container" >}}
agregado a un pod después de su creación _no_ cambia los permisos de volumen que se establecieron cuando se creó el pod.

Si los permisos de volumen `serviceAccountToken` de un Pod se establecieron en `0600` porque todos los demás contenedores en el Pod tienen el mismo `runAsUser`, los contenedores efímeros deben usar el mismo `runAsUser` para poder leer el token.
{{< /note >}}

### Windows

En los pods de Windows que tienen un volumen proyectado y `RunAsUsername` configurado en el pod `SecurityContext`, la propiedad no se aplica debido a la forma en que se administran las cuentas de usuario en Windows.
Windows almacena y administra cuentas de grupos y usuarios locales en un archivo de base de datos llamado Administrador de cuentas de seguridad (SAM).
Cada contenedor mantiene su propia instancia de la base de datos SAM, de la cual el host no tiene visibilidad mientras el contenedor se está ejecutando.
Los contenedores de Windows están diseñados para ejecutar la parte del modo de usuario del sistema operativo de forma aislada del host, de ahí el mantenimiento de una base de datos SAM virtual.
Como resultado, el kubelet que se ejecuta en el host no tiene la capacidad de configurar dinámicamente la propiedad de los archivos del host para cuentas de contenedores virtualizados. Se recomienda que, si los archivos de la máquina host se van a compartir con el contenedor, se coloquen en su propio montaje de volumen fuera de `C:\`.

De forma predeterminada, los archivos proyectados tendrán la siguiente propiedad, como se muestra en un archivo de volumen proyectado de ejemplo:

```powershell
PS C:\> Get-Acl C:\var\run\secrets\kubernetes.io\serviceaccount\..2021_08_31_22_22_18.318230061\ca.crt | Format-List

Path   : Microsoft.PowerShell.Core\FileSystem::C:\var\run\secrets\kubernetes.io\serviceaccount\..2021_08_31_22_22_18.318230061\ca.crt
Owner  : BUILTIN\Administrators
Group  : NT AUTHORITY\SYSTEM
Access : NT AUTHORITY\SYSTEM Allow  FullControl
         BUILTIN\Administrators Allow  FullControl
         BUILTIN\Users Allow  ReadAndExecute, Synchronize
Audit  :
Sddl   : O:BAG:SYD:AI(A;ID;FA;;;SY)(A;ID;FA;;;BA)(A;ID;0x1200a9;;;BU)
```

Esto implica que todos los usuarios administradores como `ContainerAdministrator` tendrán acceso de lectura, escritura y ejecución, mientras que los usuarios que no sean administradores tendrán acceso de lectura y ejecución.

{{< note >}}
En general, se desaconseja otorgar acceso al contenedor al host, ya que puede abrir la puerta a posibles vulnerabilidades de seguridad.

Crear un Pod de Windows con `RunAsUser` en su `SecurityContext` dará como resultado que el Pod quede atascado en `ContainerCreating` para siempre. Por lo tanto, se recomienda no utilizar la opción `RunAsUser` exclusiva de Linux con Windows Pods.
{{< /note >}}
