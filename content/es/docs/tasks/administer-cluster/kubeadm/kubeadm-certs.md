---
reviewers:
- sig-cluster-lifecycle
title: Gestión de Certificados con kubeadm
content_type: task
weight: 80
---

<!-- overview -->

{{< feature-state for_k8s_version="v1.15" state="stable" >}}

Los certificados de cliente generados por [kubeadm](/docs/reference/setup-tools/kubeadm/) expiran después de 1 año.
Esta página explica cómo gestionar la renovación de certificados con kubeadm. También cubre otras tareas relacionadas
con la gestión de certificados de kubeadm.

El proyecto Kubernetes recomienda actualizar a las últimas versiones patch rápidamente, y
asegurarse de que estás ejecutando una versión minor soportada de Kubernetes.
Seguir esta recomendación te ayuda a mantenerte seguro.


## {{% heading "prerequisites" %}}


Debes estar familiarizado con los [certificados PKI y requisitos en Kubernetes](/docs/setup/best-practices/certificates/).

Debes conocer cómo pasar un archivo de [configuración](/docs/reference/config-api/kubeadm-config.v1beta4/) a los comandos de kubeadm.

Esta guía cubre el uso del comando `openssl` (usado para la firma manual de certificados,
si eliges ese enfoque), pero puedes usar tus herramientas preferidas.

Algunos de los pasos aquí usan `sudo` para acceso de administrador. Puedes usar cualquier herramienta equivalente.

<!-- steps -->

## Uso de certificados personalizados {#custom-certificates}

Por defecto, kubeadm genera todos los certificados necesarios para que un clúster funcione.
Puedes sobrescribir este comportamiento proporcionando tus propios certificados.

Para hacerlo, debes colocarlos en el directorio especificado por el
flag `--cert-dir` o el campo `certificatesDir` de la `ClusterConfiguration` de kubeadm.
Por defecto es `/etc/kubernetes/pki`.

Si un par de certificado y clave privada existe antes de ejecutar `kubeadm init`,
kubeadm no los sobrescribe. Esto significa que puedes, por ejemplo, copiar una CA existente en `/etc/kubernetes/pki/ca.crt` y `/etc/kubernetes/pki/ca.key`,
y kubeadm usará esta CA para firmar el resto de los certificados.

## Elección de un algoritmo de cifrado {#choosing-encryption-algorithm}

kubeadm te permite elegir un algoritmo de cifrado que se usa para crear
claves públicas y privadas. Esto se puede hacer usando el campo `encryptionAlgorithm` en la configuración de kubeadm:

```yaml
apiVersion: kubeadm.k8s.io/v1beta4
kind: ClusterConfiguration
encryptionAlgorithm: <ALGORITHM>
```

`<ALGORITHM>` puede ser uno de `RSA-2048` (por defecto), `RSA-3072`, `RSA-4096` o `ECDSA-P256`.

## Elección del periodo de validez del certificado {#choosing-cert-validity-period}

kubeadm te permite elegir el periodo de validez de los certificados CA y leaf.
Esto se puede hacer usando los campos `certificateValidityPeriod` y `caCertificateValidityPeriod`
en la configuración de kubeadm:

```yaml
apiVersion: kubeadm.k8s.io/v1beta4
kind: ClusterConfiguration
certificateValidityPeriod: 8760h # Por defecto: 365 días × 24 horas = 1 año
caCertificateValidityPeriod: 87600h # Por defecto: 365 días × 24 horas * 10 = 10 años
```

Los valores de los campos siguen el formato aceptado para
[valores de `time.Duration` de Go](https://pkg.go.dev/time#ParseDuration), con la unidad más larga soportada siendo `h` (horas).

## Modo CA externo {#external-ca-mode}

También es posible proporcionar solo el archivo `ca.crt` y no el
archivo `ca.key` (esto solo está disponible para el archivo CA raíz, no para otros pares de certificados).
Si todos los demás certificados y archivos kubeconfig están en su lugar, kubeadm reconoce
esta condición y activa el modo "CA Externa". kubeadm procederá sin la
clave CA en disco.

En su lugar, ejecuta el controller-manager de forma independiente con `--controllers=csrsigner` y
apunta al certificado y clave de la CA.

Existen varias formas de preparar las credenciales de los componentes cuando se usa el modo CA externo.

### Preparación manual de credenciales de componentes

[Certificados PKI y requisitos](/docs/setup/best-practices/certificates/) incluye información
sobre cómo preparar manualmente todas las credenciales requeridas por los componentes de kubeadm.

Esta guía cubre el uso del comando `openssl` (usado para la firma manual de certificados,
si eliges ese enfoque), pero puedes usar tus herramientas preferidas.

### Preparación de credenciales firmando CSRs generados por kubeadm

kubeadm puede [generar archivos CSR](#signing-csr) que puedes firmar manualmente con herramientas como
`openssl` y tu CA externa. Estos archivos CSR incluirán toda la especificación para las credenciales
que requieren los componentes desplegados por kubeadm.

### Preparación automatizada de credenciales de componentes usando fases de kubeadm

Alternativamente, es posible usar comandos de fase de kubeadm para automatizar este proceso.

- Ve a un host que quieras preparar como nodo de plano de control de kubeadm con CA externa.
- Copia los archivos de CA externa `ca.crt` y `ca.key` que tienes en `/etc/kubernetes/pki` en el nodo.
- Prepara un archivo temporal de [configuración de kubeadm](/docs/reference/setup-tools/kubeadm/kubeadm-init/#config-file)
llamado `config.yaml` que pueda usarse con `kubeadm init`. Asegúrate de que este archivo incluya
cualquier información relevante a nivel de clúster o específica del host que pueda incluirse en los certificados, como
`ClusterConfiguration.controlPlaneEndpoint`, `ClusterConfiguration.certSANs` y `InitConfiguration.APIEndpoint`.
- En el mismo host ejecuta los comandos `kubeadm init phase kubeconfig all --config config.yaml` y
`kubeadm init phase certs all --config config.yaml`. Esto generará todos los archivos kubeconfig
y certificados requeridos bajo `/etc/kubernetes/` y su subdirectorio `pki`.
- Inspecciona los archivos generados. Elimina `/etc/kubernetes/pki/ca.key`, elimina o mueve a un lugar seguro
el archivo `/etc/kubernetes/super-admin.conf`.
- En los nodos donde se llamará a `kubeadm join` también elimina `/etc/kubernetes/kubelet.conf`.
Este archivo solo se requiere en el primer nodo donde se llamará a `kubeadm init`.
- Ten en cuenta que algunos archivos como `pki/sa.*`, `pki/front-proxy-ca.*` y `pki/etc/ca.*` son
compartidos entre nodos de plano de control. Puedes generarlos una vez y
[distribuirlos manualmente](/docs/setup/production-environment/tools/kubeadm/high-availability/#manual-certs)
a los nodos donde se llamará a `kubeadm join`, o puedes usar la
[funcionalidad `--upload-certs`](/docs/setup/production-environment/tools/kubeadm/high-availability/#stacked-control-plane-and-etcd-nodes)
de `kubeadm init` y `--certificate-key` de `kubeadm join` para automatizar esta distribución.

Una vez que las credenciales estén preparadas en todos los nodos, llama a `kubeadm init` y `kubeadm join` para que estos nodos se unan al clúster. kubeadm usará los archivos kubeconfig y certificados existentes bajo `/etc/kubernetes/`
y su subdirectorio `pki`.

## Expiración y gestión de certificados {#check-certificate-expiration}

{{< note >}}
`kubeadm` no puede gestionar certificados firmados por una CA externa.
{{< /note >}}

Puedes usar el subcomando `check-expiration` para comprobar cuándo expiran los certificados:

```shell
kubeadm certs check-expiration
```

La salida es similar a esto:

```console
CERTIFICATE                EXPIRES                  RESIDUAL TIME   CERTIFICATE AUTHORITY   EXTERNALLY MANAGED
admin.conf                 Dec 30, 2020 23:36 UTC   364d                                    no
apiserver                  Dec 30, 2020 23:36 UTC   364d            ca                      no
apiserver-etcd-client      Dec 30, 2020 23:36 UTC   364d            etcd-ca                 no
apiserver-kubelet-client   Dec 30, 2020 23:36 UTC   364d            ca                      no
controller-manager.conf    Dec 30, 2020 23:36 UTC   364d                                    no
etcd-healthcheck-client    Dec 30, 2020 23:36 UTC   364d            etcd-ca                 no
etcd-peer                  Dec 30, 2020 23:36 UTC   364d            etcd-ca                 no
etcd-server                Dec 30, 2020 23:36 UTC   364d            etcd-ca                 no
front-proxy-client         Dec 30, 2020 23:36 UTC   364d            front-proxy-ca          no
scheduler.conf             Dec 30, 2020 23:36 UTC   364d                                    no

CERTIFICATE AUTHORITY   EXPIRES                  RESIDUAL TIME   EXTERNALLY MANAGED
ca                      Dec 28, 2029 23:36 UTC   9y              no
etcd-ca                 Dec 28, 2029 23:36 UTC   9y              no
front-proxy-ca          Dec 28, 2029 23:36 UTC   9y              no
```

El comando muestra la expiración/tiempo residual para los certificados de cliente en la
carpeta `/etc/kubernetes/pki` y para el certificado de cliente embebido en los archivos kubeconfig usados
por kubeadm (`admin.conf`, `controller-manager.conf` y `scheduler.conf`).

Adicionalmente, kubeadm informa al usuario si el certificado es gestionado externamente; en este caso,
el usuario debe encargarse de la renovación del certificado manualmente/usando otras herramientas.

El archivo de configuración `kubelet.conf` no está incluido en la lista anterior porque kubeadm
configura kubelet
para [renovación automática de certificados](/docs/tasks/tls/certificate-rotation/)
con certificados rotables bajo `/var/lib/kubelet/pki`.
Para reparar un certificado de cliente kubelet expirado ver
[La rotación del certificado de cliente kubelet falla](/docs/setup/production-environment/tools/kubeadm/troubleshooting-kubeadm/#kubelet-client-cert).

{{< note >}}
En nodos creados con `kubeadm init` de versiones anteriores a kubeadm 1.17, hay un
[bug](https://github.com/kubernetes/kubeadm/issues/1753) donde debes modificar manualmente el
contenido de `kubelet.conf`. Después de que termine `kubeadm init`, debes actualizar `kubelet.conf` para
apuntar a los certificados de cliente kubelet rotados, reemplazando `client-certificate-data` y
`client-key-data` por:

```yaml
client-certificate: /var/lib/kubelet/pki/kubelet-client-current.pem
client-key: /var/lib/kubelet/pki/kubelet-client-current.pem
```
{{< /note >}}

## Renovación automática de certificados

kubeadm renueva todos los certificados durante la
[actualización](/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade/) del plano de control.

Esta funcionalidad está diseñada para los casos de uso más simples;
si no tienes requisitos específicos sobre la renovación de certificados y realizas actualizaciones de versión de Kubernetes regularmente (menos de 1 año entre cada actualización), kubeadm se encargará de mantener
tu clúster actualizado y razonablemente seguro.

Si tienes requisitos más complejos para la renovación de certificados, puedes optar por no usar el comportamiento por defecto pasando `--certificate-renewal=false` a `kubeadm upgrade apply` o a `kubeadm
upgrade node`.

## Renovación manual de certificados

Puedes renovar tus certificados manualmente en cualquier momento con el comando `kubeadm certs renew`,
con las opciones de línea de comandos apropiadas. Si ejecutas un clúster con un plano de control replicado,
este comando debe ejecutarse en todos los nodos del plano de control.

Este comando realiza la renovación usando el certificado y clave de la CA (o front-proxy-CA) almacenados en `/etc/kubernetes/pki`.

`kubeadm certs renew` usa los certificados existentes como fuente autoritativa para los atributos
(Common Name, Organization, subject alternative name) y no depende del ConfigMap `kubeadm-config`.
Aun así, el proyecto Kubernetes recomienda mantener el certificado servido y los valores asociados
en ese ConfigMap sincronizados, para evitar cualquier riesgo de confusión.

Después de ejecutar el comando debes reiniciar los Pods del plano de control. Esto es necesario ya que
la recarga dinámica de certificados actualmente no está soportada para todos los componentes y certificados.
[Static Pods](/docs/tasks/configure-pod-container/static-pod/) son gestionados por el kubelet local
y no por el API Server, por lo tanto kubectl no puede usarse para eliminarlos y reiniciarlos.
Para reiniciar un Pod estático puedes eliminar temporalmente su archivo de manifiesto de `/etc/kubernetes/manifests/`
y esperar 20 segundos (ver el valor `fileCheckFrequency` en [KubeletConfiguration struct](/docs/reference/config-api/kubelet-config.v1beta1/).
El kubelet terminará el Pod si ya no está en el directorio de manifiestos.
Luego puedes volver a mover el archivo y después de otro periodo de `fileCheckFrequency`, el kubelet recreará
el Pod y la renovación del certificado para el componente podrá completarse.

`kubeadm certs renew` puede renovar cualquier certificado específico o, con el subcomando `all`, puede renovarlos todos:

```shell
# Si ejecutas un clúster con un plano de control replicado, este comando
# debe ejecutarse en todos los nodos del plano de control.
kubeadm certs renew all
```

### Copiar el certificado de administrador (opcional) {#admin-certificate-copy}

Los clústeres construidos con kubeadm suelen copiar el certificado `admin.conf` en
`$HOME/.kube/config`, como se indica en [Crear un clúster con kubeadm](/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/).
En un sistema así, para actualizar el contenido de `$HOME/.kube/config`
después de renovar el `admin.conf`, puedes ejecutar los siguientes comandos:

```shell
sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
sudo chown $(id -u):$(id -g) $HOME/.kube/config
```

## Renovar certificados con la API de certificados de Kubernetes

Esta sección proporciona más detalles sobre cómo ejecutar la renovación manual de certificados usando la API de certificados de Kubernetes.

{{< caution >}}
Estos son temas avanzados para usuarios que necesitan integrar la infraestructura de certificados de su organización en un clúster construido con kubeadm. Si la configuración por defecto de kubeadm satisface tus
necesidades, deberías dejar que kubeadm gestione los certificados.
{{< /caution >}}

### Configurar un firmante

La Autoridad Certificadora de Kubernetes no funciona por defecto.
Puedes configurar un firmante externo como [cert-manager](https://cert-manager.io/docs/configuration/ca/),
o puedes usar el firmante incorporado.

El firmante incorporado es parte de [`kube-controller-manager`](/docs/reference/command-line-tools-reference/kube-controller-manager/).

Para activar el firmante incorporado, debes pasar los flags `--cluster-signing-cert-file` y
`--cluster-signing-key-file`.

Si estás creando un nuevo clúster, puedes usar un archivo de
[configuración de kubeadm](/docs/reference/config-api/kubeadm-config.v1beta4/):

```yaml
apiVersion: kubeadm.k8s.io/v1beta4
kind: ClusterConfiguration
controllerManager:
  extraArgs:
  - name: "cluster-signing-cert-file"
    value: "/etc/kubernetes/pki/ca.crt"
  - name: "cluster-signing-key-file"
    value: "/etc/kubernetes/pki/ca.key"
```

### Crear solicitudes de firma de certificado (CSR)

Ver [Crear CertificateSigningRequest](/docs/reference/access-authn-authz/certificate-signing-requests/#create-certificatessigningrequest)
para crear CSRs con la API de Kubernetes.

## Renovar certificados con CA externa

Esta sección proporciona más detalles sobre cómo ejecutar la renovación manual de certificados usando una CA externa.

Para integrarse mejor con CAs externas, kubeadm también puede producir solicitudes de firma de certificado (CSRs).
Un CSR representa una solicitud a una CA para un certificado firmado para un cliente.
En términos de kubeadm, cualquier certificado que normalmente sería firmado por una CA en disco puede producirse
como un CSR en su lugar. Sin embargo, una CA no puede producirse como un CSR.

### Renovación usando solicitudes de firma de certificado (CSR)

La renovación de certificados es posible generando nuevos CSRs y firmándolos con la CA externa.
Para más detalles sobre cómo trabajar con CSRs generados por kubeadm ver la sección
[Firmar solicitudes de firma de certificado (CSR) generadas por kubeadm](#signing-csr).

## Rotación de la autoridad certificadora (CA) {#certificate-authority-rotation}

Kubeadm no soporta la rotación o reemplazo de certificados CA de forma nativa.

Para más información sobre la rotación o reemplazo manual de la CA, ver [rotación manual de certificados CA](/docs/tasks/tls/manual-rotation-of-ca-certificates/).

## Habilitar certificados firmados para el kubelet {#kubelet-serving-certs}

Por defecto el certificado de servicio del kubelet desplegado por kubeadm es autofirmado.
Esto significa que una conexión desde servicios externos como el
[metrics-server](https://github.com/kubernetes-sigs/metrics-server) a un
kubelet no puede asegurarse con TLS.

Para configurar los kubelets en un nuevo clúster kubeadm para obtener certificados de servicio firmados correctamente debes pasar la siguiente configuración mínima a `kubeadm init`:

```yaml
apiVersion: kubeadm.k8s.io/v1beta4
kind: ClusterConfiguration
---
apiVersion: kubelet.config.k8s.io/v1beta1
kind: KubeletConfiguration
serverTLSBootstrap: true
```

Si ya creaste el clúster debes adaptarlo haciendo lo siguiente:
 - Busca y edita el ConfigMap `kubelet-config-{{< skew currentVersion >}}` en el namespace `kube-system`.
En ese ConfigMap, la clave `kubelet` tiene un
documento [KubeletConfiguration](/docs/reference/config-api/kubelet-config.v1beta1/) como valor. Edita el documento KubeletConfiguration para establecer `serverTLSBootstrap: true`.
- En cada nodo, agrega el campo `serverTLSBootstrap: true` en `/var/lib/kubelet/config.yaml`
y reinicia el kubelet con `systemctl restart kubelet`

El campo `serverTLSBootstrap: true` habilitará el bootstrap de certificados de servicio del kubelet solicitándolos a la API `certificates.k8s.io`. Una limitación conocida
es que los CSRs (Solicitudes de Firma de Certificado) para estos certificados no pueden ser aprobados automáticamente por el firmante por defecto en el kube-controller-manager -
[`kubernetes.io/kubelet-serving`](/docs/reference/access-authn-authz/certificate-signing-requests/#kubernetes-signers).
Esto requerirá acción del usuario o de un controlador de terceros.

Estos CSRs pueden verse usando:

```shell
kubectl get csr
```
```console
NAME        AGE     SIGNERNAME                        REQUESTOR                      CONDITION
csr-9wvgt   112s    kubernetes.io/kubelet-serving     system:node:worker-1           Pending
csr-lz97v   1m58s   kubernetes.io/kubelet-serving     system:node:control-plane-1    Pending
```

Para aprobarlos puedes hacer lo siguiente:
```shell
kubectl certificate approve <CSR-name>
```

Por defecto, estos certificados de servicio expirarán después de un año. Kubeadm establece el
campo `rotateCertificates` de `KubeletConfiguration` en `true`, lo que significa que cerca de la expiración se crearán nuevos CSRs para los certificados de servicio y deben
ser aprobados para completar la rotación. Para entender más ver
[Rotación de Certificados](/docs/reference/access-authn-authz/kubelet-tls-bootstrapping/#certificate-rotation).

Si buscas una solución para la aprobación automática de estos CSRs se recomienda
que contactes a tu proveedor de nube y preguntes si tienen un firmante de CSR que verifique
la identidad del nodo con un mecanismo out of band.

{{% thirdparty-content %}}

Se pueden usar controladores personalizados de terceros:
- [kubelet-csr-approver](https://github.com/postfinance/kubelet-csr-approver)

Dicho controlador no es un mecanismo seguro a menos que no solo verifique el CommonName
en el CSR sino también las IPs y nombres de dominio solicitados. Esto prevendría
que un actor malicioso que tenga acceso a un certificado de cliente kubelet cree
CSRs solicitando certificados de servicio para cualquier IP o nombre de dominio.

## Generar archivos kubeconfig para usuarios adicionales {#kubeconfig-additional-users}

Durante la creación del clúster, `kubeadm init` firma el certificado en el `super-admin.conf`
para tener `Subject: O = system:masters, CN = kubernetes-super-admin`.
[`system:masters`](/docs/reference/access-authn-authz/rbac/#user-facing-roles)
es un grupo de superusuario de emergencia que omite la capa de autorización (por ejemplo,
[RBAC](/docs/reference/access-authn-authz/rbac/)). El archivo `admin.conf` también es creado
por kubeadm en los nodos del plano de control y contiene un certificado con
`Subject: O = kubeadm:cluster-admins, CN = kubernetes-admin`. `kubeadm:cluster-admins`
es un grupo lógicamente perteneciente a kubeadm. Si tu clúster usa RBAC
(el valor por defecto de kubeadm), el grupo `kubeadm:cluster-admins` está vinculado al
[`cluster-admin`](/docs/reference/access-authn-authz/rbac/#user-facing-roles) ClusterRole.

{{< warning >}}
Evita compartir los archivos `super-admin.conf` o `admin.conf`. En su lugar, crea acceso de menor privilegio incluso para personas que trabajan como administradores y usa esa alternativa de menor privilegio para cualquier cosa que no sea acceso de emergencia.
{{< /warning >}}

Puedes usar el comando [`kubeadm kubeconfig user`](/docs/reference/setup-tools/kubeadm/kubeadm-kubeconfig)
para generar archivos kubeconfig para usuarios adicionales.
El comando acepta una mezcla de flags de línea de comandos y
opciones de [configuración de kubeadm](/docs/reference/config-api/kubeadm-config.v1beta4/).
El kubeconfig generado se escribirá en stdout y puede redirigirse a un archivo usando
`kubeadm kubeconfig user ... > somefile.conf`.

Ejemplo de archivo de configuración que puede usarse con `--config`:

```yaml
# example.yaml
apiVersion: kubeadm.k8s.io/v1beta4
kind: ClusterConfiguration
# Se usará como el "cluster" objetivo en el kubeconfig
clusterName: "kubernetes"
# Se usará como el "server" (IP o nombre DNS) de este clúster en el kubeconfig
controlPlaneEndpoint: "some-dns-address:6443"
# La clave y certificado de la CA del clúster se cargarán desde este directorio local
certificatesDir: "/etc/kubernetes/pki"
```

Asegúrate de que estos valores coincidan con la configuración deseada del clúster objetivo.
Para ver la configuración de un clúster existente usa:

```shell
kubectl get cm kubeadm-config -n kube-system -o=jsonpath="{.data.ClusterConfiguration}"
```

El siguiente ejemplo generará un archivo kubeconfig con credenciales válidas por 24 horas
para un nuevo usuario `johndoe` que es parte del grupo `appdevs`:

```shell
kubeadm kubeconfig user --config example.yaml --org appdevs --client-name johndoe --validity-period 24h
```

El siguiente ejemplo generará un archivo kubeconfig con credenciales de administrador válidas por 1 semana:

```shell
kubeadm kubeconfig user --config example.yaml --client-name admin --validity-period 168h
```

## Firmar solicitudes de firma de certificado (CSR) generadas por kubeadm {#signing-csr}

Puedes crear solicitudes de firma de certificado con `kubeadm certs generate-csr`.
Llamar a este comando generará pares de archivos `.csr` / `.key` para certificados regulares. Para certificados embebidos en archivos kubeconfig, el comando
generará un par `.csr` / `.conf` donde la clave ya está embebida en el archivo `.conf`.

Un archivo CSR contiene toda la información relevante para que una CA firme un certificado.
kubeadm usa una
[especificación bien definida](/docs/setup/best-practices/certificates/#all-certificates)
para todos sus certificados y CSRs.

El directorio de certificados por defecto es `/etc/kubernetes/pki`, mientras que el directorio por defecto para archivos kubeconfig es `/etc/kubernetes`. Estos valores pueden ser
sobrescritos con los flags `--cert-dir` y `--kubeconfig-dir`, respectivamente.

Para pasar opciones personalizadas a `kubeadm certs generate-csr` usa el flag `--config`,
que acepta un archivo de [configuración de kubeadm](/docs/reference/config-api/kubeadm-config.v1beta4/),
de forma similar a comandos como `kubeadm init`. Cualquier especificación como SANs extra y direcciones IP personalizadas debe almacenarse en el mismo archivo de configuración y usarse para todos los comandos relevantes de kubeadm pasándolo como `--config`.

{{< note >}}
Esta guía usa el directorio por defecto de Kubernetes `/etc/kubernetes`, que requiere
usuario root. Si sigues esta guía y usas directorios a los que puedes
escribir (típicamente, esto significa ejecutar `kubeadm` con `--cert-dir` y `--kubeconfig-dir`)
entonces puedes omitir el comando `sudo`).

Luego debes copiar los archivos que produjiste dentro del directorio `/etc/kubernetes`
para que `kubeadm init` o `kubeadm join` los encuentren.
{{< /note >}}

### Preparar archivos de CA y cuenta de servicio

En el nodo principal del plano de control, donde se ejecutará `kubeadm init`, ejecuta los siguientes
comandos:

```shell
sudo kubeadm init phase certs ca
sudo kubeadm init phase certs etcd-ca
sudo kubeadm init phase certs front-proxy-ca
sudo kubeadm init phase certs sa
```

Esto poblará las carpetas `/etc/kubernetes/pki` y `/etc/kubernetes/pki/etcd`
con todos los archivos de CA autofirmados (certificados y claves) y cuenta de servicio (claves públicas y
privadas) que kubeadm necesita para un nodo de plano de control.

{{< note >}}
Si usas una CA externa, debes generar los mismos archivos fuera de banda y copiarlos manualmente al nodo principal del plano de control en `/etc/kubernetes`.

Una vez que todos los CSRs estén firmados, puedes eliminar la clave de la CA raíz (`ca.key`) como se indica en la
sección [Modo CA externo](#external-ca-mode).
{{< /note >}}

Para nodos secundarios del plano de control (`kubeadm join --control-plane`) no es necesario llamar
a los comandos anteriores. Dependiendo de cómo configures el clúster de
[Alta Disponibilidad](/docs/setup/production-environment/tools/kubeadm/high-availability),
deberás copiar manualmente los mismos archivos desde el nodo principal del plano de control, o usar la funcionalidad automatizada `--upload-certs` de `kubeadm init`.

### Generar CSRs

El comando `kubeadm certs generate-csr` genera CSRs para todos los certificados conocidos
gestionados por kubeadm. Una vez que el comando termine debes eliminar manualmente los archivos `.csr`, `.conf`
o `.key` que no necesites.

#### Consideraciones para kubelet.conf {#considerations-kubelet-conf}

Esta sección aplica tanto a nodos de plano de control como a nodos worker.

Si has eliminado el archivo `ca.key` de los nodos del plano de control
([Modo CA externo](#external-ca-mode)), el kube-controller-manager activo en
este clúster no podrá firmar certificados de cliente kubelet. Si no existe un método externo
para firmar estos certificados en tu configuración (como un
[firmante externo](#set-up-a-signer)), podrías firmar manualmente el `kubelet.conf.csr`
como se explica en esta guía.

Ten en cuenta que esto también significa que la
[rotación automática de certificados de cliente kubelet](/docs/tasks/tls/certificate-rotation/#enabling-client-certificate-rotation)
estará deshabilitada. Si es así, cerca de la expiración del certificado, debes generar
un nuevo `kubelet.conf.csr`, firmar el certificado, embederlo en `kubelet.conf`
y reiniciar el kubelet.

Si esto no aplica a tu configuración, puedes omitir el procesamiento del archivo `kubelet.conf.csr`
en nodos secundarios del plano de control y en nodos worker (todos los nodos que llaman a `kubeadm join ...`).
Eso es porque el kube-controller-manager activo será responsable
de firmar nuevos certificados de cliente kubelet.

{{< note >}}
Debes procesar el archivo `kubelet.conf.csr` en el nodo principal del plano de control
(el host donde originalmente ejecutaste `kubeadm init`). Esto es porque `kubeadm`
considera ese nodo como el que inicia el clúster, y se necesita un `kubelet.conf`
pre-poblado.
{{< /note >}}

#### Nodos de plano de control

Ejecuta el siguiente comando en nodos principales (`kubeadm init`) y secundarios
(`kubeadm join --control-plane`) del plano de control para generar todos los archivos CSR:

```shell
sudo kubeadm certs generate-csr
```

Si se va a usar etcd externo, sigue la
[guía de etcd externo con kubeadm](/docs/setup/production-environment/tools/kubeadm/high-availability/#external-etcd-nodes)
para entender qué archivos CSR se necesitan en los nodos kubeadm y etcd. Otros
archivos `.csr` y `.key` bajo `/etc/kubernetes/pki/etcd` pueden eliminarse.

Según la explicación en
[Consideraciones para kubelet.conf](#considerations-kubelet-conf) conserva o elimina
los archivos `kubelet.conf` y `kubelet.conf.csr`.

#### Nodos worker

Según la explicación en
[Consideraciones para kubelet.conf](#considerations-kubelet-conf), opcionalmente ejecuta:

```shell
sudo kubeadm certs generate-csr
```

y conserva solo los archivos `kubelet.conf` y `kubelet.conf.csr`. Alternativamente omite
los pasos para nodos worker completamente.

### Firmar CSRs para todos los certificados

{{< note >}}
Si usas CA externa y ya tienes archivos de número de serie de CA (`.srl`) para
`openssl`, puedes copiar dichos archivos a un nodo kubeadm donde se procesarán los CSRs.
Los archivos `.srl` a copiar son `/etc/kubernetes/pki/ca.srl`,
`/etc/kubernetes/pki/front-proxy-ca.srl` y `/etc/kubernetes/pki/etcd/ca.srl`.
Los archivos pueden luego moverse a un nuevo nodo donde se procesarán los archivos CSR.

Si falta un archivo `.srl` para una CA en un nodo, el script de abajo generará un nuevo archivo SRL
con un número de serie inicial aleatorio.

Para leer más sobre archivos `.srl` ver la
[documentación de `openssl`](https://www.openssl.org/docs/man3.0/man1/openssl-x509.html)
para el flag `--CAserial`.
{{< /note >}}

Repite este paso para todos los nodos que tengan archivos CSR.

Escribe el siguiente script en el directorio `/etc/kubernetes`, navega al directorio
y ejecuta el script. El script generará certificados para todos los archivos CSR que estén
presentes en el árbol `/etc/kubernetes`.

```bash
#!/bin/bash

# Establecer tiempo de expiración del certificado en días
DAYS=365

# Procesar todos los archivos CSR excepto los de front-proxy y etcd
find ./ -name "*.csr" | grep -v "pki/etcd" | grep -v "front-proxy" | while read -r FILE;
do
    echo "* Procesando ${FILE} ..."
    FILE=${FILE%.*} # Quitar la extensión
    if [ -f "./pki/ca.srl" ]; then
        SERIAL_FLAG="-CAserial ./pki/ca.srl"
    else
        SERIAL_FLAG="-CAcreateserial"
    fi
    openssl x509 -req -days "${DAYS}" -CA ./pki/ca.crt -CAkey ./pki/ca.key ${SERIAL_FLAG} \
        -in "${FILE}.csr" -out "${FILE}.crt"
    sleep 2
done

# Procesar todos los CSRs de etcd
find ./pki/etcd -name "*.csr" | while read -r FILE;
do
    echo "* Procesando ${FILE} ..."
    FILE=${FILE%.*} # Quitar la extensión
    if [ -f "./pki/etcd/ca.srl" ]; then
        SERIAL_FLAG=-CAserial ./pki/etcd/ca.srl
    else
        SERIAL_FLAG=-CAcreateserial
    fi
    openssl x509 -req -days "${DAYS}" -CA ./pki/etcd/ca.crt -CAkey ./pki/etcd/ca.key ${SERIAL_FLAG} \
        -in "${FILE}.csr" -out "${FILE}.crt"
done

# Procesar CSRs de front-proxy
echo "* Procesando ./pki/front-proxy-client.csr ..."
openssl x509 -req -days "${DAYS}" -CA ./pki/front-proxy-ca.crt -CAkey ./pki/front-proxy-ca.key -CAcreateserial \
    -in ./pki/front-proxy-client.csr -out ./pki/front-proxy-client.crt
```

### Embeder certificados en archivos kubeconfig

Repite este paso para todos los nodos que tengan archivos CSR.

Escribe el siguiente script en el directorio `/etc/kubernetes`, navega al directorio
y ejecuta el script. El script tomará los archivos `.crt` que fueron firmados para
archivos kubeconfig desde CSRs en el paso anterior y los embederá en los archivos kubeconfig.

```bash
#!/bin/bash

CLUSTER=kubernetes
find ./ -name "*.conf" | while read -r FILE;
do
    echo "* Procesando ${FILE} ..."
    KUBECONFIG="${FILE}" kubectl config set-cluster "${CLUSTER}" --certificate-authority ./pki/ca.crt --embed-certs
    USER=$(KUBECONFIG="${FILE}" kubectl config view -o jsonpath='{.users[0].name}')
    KUBECONFIG="${FILE}" kubectl config set-credentials "${USER}" --client-certificate "${FILE}.crt" --embed-certs
done
```

### Realizar limpieza {#post-csr-cleanup}

Realiza este paso en todos los nodos que tengan archivos CSR.

Escribe el siguiente script en el directorio `/etc/kubernetes`, navega al directorio
y ejecuta el script.

```bash
#!/bin/bash

# Limpiar archivos CSR
rm -f ./*.csr ./pki/*.csr ./pki/etcd/*.csr # Limpiar todos los archivos CSR

# Limpiar archivos CRT que ya fueron embebidos en archivos kubeconfig
rm -f ./*.crt
```

Opcionalmente, mueve los archivos `.srl` al siguiente nodo a procesar.

Opcionalmente, si usas CA externa elimina el archivo `/etc/kubernetes/pki/ca.key`,
como se explica en la sección [Modo CA externo](#external-ca-mode).

### Inicialización de nodo kubeadm

Una vez que los archivos CSR hayan sido firmados y los certificados requeridos estén en los hosts que quieres usar como nodos, puedes usar los comandos `kubeadm init` y `kubeadm join` para crear un clúster de Kubernetes desde estos nodos. Durante `init` y `join`, kubeadm usa los certificados, claves de cifrado y archivos kubeconfig existentes que encuentra en el árbol `/etc/kubernetes` en el sistema de archivos local del host.
