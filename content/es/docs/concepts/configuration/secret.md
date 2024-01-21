---
reviewers:
- raelga
title: Secrets
content_template: templates/concept
feature:
  title: Secret y gestión de la configuración
  description: >
    Implemente y actualice Secrets y configuración de aplicaciones sin reconstruir su imagen y sin exponer Secrets en su stack de configuración.
weight: 50
---

<!-- overview -->

Los objetos de tipo {{< glossary_tooltip text="Secret" term_id="secret" >}} en Kubernetes te permiten almacenar y administrar información confidencial, como
contraseñas, tokens OAuth y llaves ssh.  Poniendo esta información en un Secret
es más seguro y más flexible que ponerlo en la definición de un {{< glossary_tooltip term_id="pod" >}} o en un {{< glossary_tooltip text="container image" term_id="image" >}}. Ver [Secrets design document](https://git.k8s.io/design-proposals-archive/auth/secrets.md) para más información.

<!-- body -->

## Introducción a Secrets

Un Secret es un objeto que contiene una pequeña cantidad de datos confidenciales como contraseñas, un token, o una llave.  Tal información podría ser puesta en la especificación de un Pod o en una imagen; poniendolo en un objeto de tipo Secret permite mayor control sobre como se usa, y reduce el riesgo de exposicición accidental.

Los usuarios pueden crear Secrets, y el sistema también puede crearlos.

Para usar un Secret, un Pod debe hacer referencia a este. Un Secret puede ser usado con un Pod de dos formas: como archivos en un {{< glossary_tooltip text="volume" term_id="volume" >}} montado en uno o más de sus contenedores, o utilizados por el kubelet al extraer imágenes del pod.

### Secrets incorporados

#### Las Cuentas de Servicio Crean y Adjuntan Secrets con las Credenciales de la API

Kubernetes crea automaticamente Secrets que contienen credenciales para acceder a la API y modifica automáticamente sus pods para usar este tipo de Secret.

La creación y el uso automático de las credenciales de la API, pueden desabilitarse o anularse si se desea. Sin embargo, si todo lo que necesita hacer es acceder de forma segura al apiserver, este es el flujo de trabajo recomendado.

Ver la documentación de [Service Account](/docs/tasks/configure-pod-container/configure-service-account/) para más información sobre cómo funcionan las Cuentas de Servicio.

### Creando tu propio Secret

#### Creando un Secret Usando kubectl create Secret

Pongamos como ejemplo el caso de una grupo de pods que necesitan acceder a una base de datos. El nombre y contraseña que los pods deberían usar están en los archivos:
`./username.txt` y `./password.txt` en tu máquina local.

```shell
# Crear archivos necesarios para el resto del ejemplo.
echo -n 'admin' > ./username.txt
echo -n '1f2d1e2e67df' > ./password.txt
```

El comando `kubectl create secret`
empaqueta esos archivos en un Secret y crea el objeto en el Apiserver.

```shell
kubectl create secret generic db-user-pass --from-file=./username.txt --from-file=./password.txt
```

```none
Secret "db-user-pass" created
```

{{< note >}}
Si la contraseña que está utilizando tiene caracteres especiales como por ejemplo `$`, `\`, `*`, o `!`, es posible que sean interpretados por tu intérprete de comandos y es necesario escapar cada carácter utilizando `\` o introduciéndolos entre comillas simples `'`.
Por ejemplo, si tú password actual es `S!B\*d$zDsb`, deberías ejecutar el comando de esta manera: 

`kubectl create Secret generic dev-db-secret --from-literal=username=devuser --from-literal=password=' 
S\!B*d$zDsb'`

No necesita escapar de caracteres especiales en contraseñas de archivos (`--from-file`).
{{< /note >}}

Puedes comprobar que el Secret se haya creado, así:

```shell
kubectl get secrets
```

```none
NAME                  TYPE                                  DATA      AGE
db-user-pass          Opaque                                2         51s
```

```shell
kubectl describe secrets/db-user-pass
```

```none
Name:            db-user-pass
Namespace:       default
Labels:          <none>
Annotations:     <none>

Type:            Opaque

Data
====
password.txt:    12 bytes
username.txt:    5 bytes
```

{{< note >}}
`kubectl get` y `kubectl describe` evita mostrar el contenido de un Secret por defecto.
Esto es para proteger el Secret de ser expuesto accidentalmente a un espectador, o de ser almacenado en un registro de terminal.
{{< /note >}}

Ver [Decodificando un Secret](#decoding-a-secret) para ver el contenido de un Secret.

#### Creando un Secret Manualmente

Puedes crear también un Secret primero en un archivo, en formato json o en yaml, y luego crear ese objeto. El 
[Secret](/docs/reference/generated/kubernetes-api/v1.12/#secret-v1-core) contiene dos mapas:
data y stringData. El campo de data es usado para almacenar datos arbitrarios, codificado usando base64. El campo stringData se proporciona para su conveniencia, y le permite proporcionar datos secretos como cadenas no codificadas.

Por ejemplo, para almacenar dos cadenas en un Secret usando el campo data, conviértalos a base64  de la siguiente manera:

```shell
echo -n 'admin' | base64
YWRtaW4=
echo -n '1f2d1e2e67df' | base64
MWYyZDFlMmU2N2Rm
```

Escribe un secret que se vea así:

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: mysecret
type: Opaque
data:
  username: YWRtaW4=
  password: MWYyZDFlMmU2N2Rm
```

Ahora escribe un Secret usando [`kubectl apply`](/docs/reference/generated/kubectl/kubectl-commands#apply):

```shell
kubectl apply -f ./secret.yaml
```

```none
secret "mysecret" created
```

Para ciertos escenarios, es posible que desee utilizar el campo de stringData field en su lugar. 
Este campo le permite poner una cadena codificada que no sea base64 directamente en el Secret,
y la cadena será codificada para ti cuando el Secret es creado o actualizado.

Un ejemplo práctico de esto podría ser donde está implementando una aplicación 
que usa un Secret para almacenar un archivo de configuración,  y desea completar partes de ese archivo de configuración durante su proceso de implementación.

Si su aplicación usa el siguiente archivo de configuración:

```yaml
apiUrl: "https://my.api.com/api/v1"
username: "user"
password: "password"
```

Podrías almacenarlo en un Secret usando lo siguiente:

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: mysecret
type: Opaque
stringData:
  config.yaml: |-
    apiUrl: "https://my.api.com/api/v1"
    username: {{username}}
    password: {{password}}
```

Su herramienta de despliegue podría entonces reemplazar el `{{username}}` y `{{password}}`
variables de plantilla antes de ejecutar `kubectl apply`.

stringData es un campo de conveniencia de solo lectura. Nunca se muestran cuando se recuperan Secrets. Por ejemplo, si ejecuta el siguiente comando:

```shell
kubectl get secret mysecret -o yaml
```

La salida será similar a:

```yaml
apiVersion: v1
kind: Secret
metadata:
  creationTimestamp: 2018-11-15T20:40:59Z
  name: mysecret
  namespace: default
  resourceVersion: "7225"
  selfLink: /api/v1/namespaces/default/secrets/mysecret
  uid: c280ad2e-e916-11e8-98f2-025000000001
type: Opaque
data:
  config.yaml: YXBpVXJsOiAiaHR0cHM6Ly9teS5hcGkuY29tL2FwaS92MSIKdXNlcm5hbWU6IHt7dXNlcm5hbWV9fQpwYXNzd29yZDoge3twYXNzd29yZH19
```

Si se especifica un campo tanto de data y stringData, el valor de StringData
es usado. Por ejemplo, la siguiente definición de Secret:

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: mysecret
type: Opaque
data:
  username: YWRtaW4=
stringData:
  username: administrator
```

Los resultado en el siguiente Secret:

```yaml
apiVersion: v1
kind: Secret
metadata:
  creationTimestamp: 2018-11-15T20:46:46Z
  name: mysecret
  namespace: default
  resourceVersion: "7579"
  selfLink: /api/v1/namespaces/default/secrets/mysecret
  uid: 91460ecb-e917-11e8-98f2-025000000001
type: Opaque
data:
  username: YWRtaW5pc3RyYXRvcg==
```

Donde `YWRtaW5pc3RyYXRvcg==` decodifica a `administrator`.

Las llaves de data y stringData deben consistir en caracteres alfanuméricos,
'-', '_' or '.'.

**Nota de codificación:** Los valores serializados JSON y YAML  de los datos secretos estan codificadas como cadenas base64.  Las nuevas lineas no son válidas dentro de esa cadena y debe ser omitido.  Al usar `base64` en Darwin/macOS, los usuarios deben evitar el uso de la opción `-b` para dividir líneas largas. Por lo contratio los usuarios de Linux *deben* añadir la opción `-w 0` a los comandos `base64` o al pipeline `base64 | tr -d '\n'` si la opción `-w` no esta disponible.

#### Creando un Secret a partir de Generador
Kubectl soporta [managing objects using Kustomize](/docs/tasks/manage-kubernetes-objects/kustomization/)
desde 1.14. Con esta nueva característica,
puedes tambien crear un Secret a partir de un generador y luego aplicarlo para crear el objeto en el Apiserver. Los generadores deben ser especificados en un   `kustomization.yaml` dentro de un directorio.

Por ejemplo, para generar un Secret a partir de los archivos `./username.txt` y `./password.txt`

```shell
# Crear un fichero llamado kustomization.yaml con SecretGenerator
cat <<EOF >./kustomization.yaml
secretGenerator:
- name: db-user-pass
  files:
  - username.txt
  - password.txt
EOF
```
Aplica el directorio kustomization para crear el objeto Secret.
```shell
$ kubectl apply -k .
secret/db-user-pass-96mffmfh4k created
```

Puedes verificar que el secret fue creado de la siguiente manera:

```shell
$ kubectl get secrets
NAME                             TYPE                                  DATA      AGE
db-user-pass-96mffmfh4k          Opaque                                2         51s

$ kubectl describe secrets/db-user-pass-96mffmfh4k
Name:            db-user-pass
Namespace:       default
Labels:          <none>
Annotations:     <none>

Type:            Opaque

Data
====
password.txt:    12 bytes
username.txt:    5 bytes
```

Por ejemplo, para generar un Secret a partir de literales `username=admin` y `password=secret`,
puedes especificar el generador del Secret en `kustomization.yaml` como:

```shell
# Crea un fichero kustomization.yaml con SecretGenerator
cat <<EOF >./kustomization.yaml
secretGenerator:
- name: db-user-pass
  literals:
  - username=admin
  - password=secret
EOF
```

Aplica el directorio kustomization  para crear el objeto Secret.

```shell
kubectl apply -k .
secret/db-user-pass-dddghtt9b5 created
```

{{< note >}}
El nombre generado del Secret  tiene un sufijo agregado al hashing de los contenidos. Esto asegura que se genera un nuevo Secret cada vez que el contenido es modificado.
{{< /note >}}

#### Decodificando un Secret

Los Secrets se pueden recuperar a través del comando `kubectl get secret` . Por ejemplo, para recuperar el Secret creado en la sección anterior:

```shell
kubectl get secret mysecret -o yaml
```

```none
apiVersion: v1
kind: Secret
metadata:
  creationTimestamp: 2016-01-22T18:41:56Z
  name: mysecret
  namespace: default
  resourceVersion: "164619"
  selfLink: /api/v1/namespaces/default/secrets/mysecret
  uid: cfee02d6-c137-11e5-8d73-42010af00002
type: Opaque
data:
  username: YWRtaW4=
  password: MWYyZDFlMmU2N2Rm
```

Decodifica el campo de contraseña:

```shell
echo 'MWYyZDFlMmU2N2Rm' | base64 --decode
```

```none
1f2d1e2e67df
```

## Usando Secrets

Los Secrets se pueden montar como volúmenes de datos o ser expuestos como 
{{< glossary_tooltip text="variables de entorno" term_id="container-env-variables" >}}
para ser usados por un contenedor en un pod.  También pueden ser utilizados por otras partes del sistema, 
sin estar directamente expuesto en el pod.  Por ejemplo, pueden tener credenciales que otras partes del sistema usan para interactuar con sistemas externos en su nombre.

### Usando Secrets como Archivos de un Pod

Para consumir un Secret en un volumen en un Pod:

1. Crear un Secret o usar uno existente. Múltiples pods pueden referenciar el mismo Secret.
1. Modifique la definición del Pod para agregar un volumen debajo de `.spec.volumes[]`.  Asigne un nombre al volumen y tenga un campo `.spec.volumes[].secret.secretName` igual al nombre del objeto del Secret.
1. Agrega un `.spec.containers[].volumeMounts[]` a cada contenedor que necesite un Secret. Especifica `.spec.containers[].volumeMounts[].readOnly = true` y `.spec.containers[].volumeMounts[].mountPath` a un nombre de directorio no utilizado donde desea que aparezca los Secrets.
1. Modifique la imagen y/o linea de comando para que el programa busque archivos en ese directorio.  Cada llave en el `data` map del los Secrets se convierte en el nombre del archivo bajo `mountPath`.

Este es un ejemplo de un pod que monta un Secret en un volumen:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: mypod
spec:
  containers:
  - name: mypod
    image: redis
    volumeMounts:
    - name: foo
      mountPath: "/etc/foo"
      readOnly: true
  volumes:
  - name: foo
    secret:
      secretName: mysecret
```

Cada Secret que desea usar debe mencionarse en `.spec.volumes`.

Si hay múltiples contenedores en un Pod, entonces cada contenedor necesita su propio bloque `volumeMounts` , pero solo un `.spec.volumes` se necesita por Secret.

Puede empaquetar muchos archivos en un Secret, o usar muchos Secrets, lo que sea conveniente.

**Proyección de llaves Secret a rutas específicas**

También podemos controlar las rutas dentro del volumen donde se proyectan las llaves Secrets.
Puede usar  el campo `.spec.volumes[].secret.items` para cambiar la ruta de destino de cada clave:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: mypod
spec:
  containers:
  - name: mypod
    image: redis
    volumeMounts:
    - name: foo
      mountPath: "/etc/foo"
      readOnly: true
  volumes:
  - name: foo
    secret:
      secretName: mysecret
      items:
      - key: username
        path: my-group/my-username
```

Lo que sucederá:

* El Secret `username` se almacena bajo el archivo `/etc/foo/my-group/my-username` en lugar de `/etc/foo/username`.
* El Secret `password` no se proyecta

Si se utiliza `.spec.volumes[].secret.items` , solo se proyectan las llaves específicadas en los `items`.
Para consumir todas las llaves del Secret, Todas deben ser enumeradas en el campo `items`.
Todas las llaves enumeradas deben existir en el Secret correspondiente. De lo contrario, el volumen no se crea.

**Permisos de archivos Secrets**

Tambien puede especificar el modo de permiso de los archivos de bits  que tendrá una parte de un Secret.
Si no especifica ninguno, `0644` es usado por defecto. Puede especificar un modo predeterminado para todo el volumen del Secret y sobreescribir por llave si es necesario.

Por ejemplo, puede especificar un modo predeterminado como este:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: mypod
spec:
  containers:
  - name: mypod
    image: redis
    volumeMounts:
    - name: foo
      mountPath: "/etc/foo"
  volumes:
  - name: foo
    secret:
      secretName: mysecret
      defaultMode: 256
```

Entonces, el Secret será montado en `/etc/foo` y todos los  archivos creados por el 
montaje del volumen del Secret tendrán permiso `0400`.

Tenga en cuenta que la especificación JSON no soporta la notación octal, entonces use el valor 256 para
permisos 0400. Si usa yaml en lugar de json para el pod, puede usar notación octal para especificar permisos de una manera más natural.

También puede usar el mapeo, como en el ejemplo anterior,  y especificar diferentes permisos para diferentes archivos como:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: mypod
spec:
  containers:
  - name: mypod
    image: redis
    volumeMounts:
    - name: foo
      mountPath: "/etc/foo"
  volumes:
  - name: foo
    secret:
      secretName: mysecret
      items:
      - key: username
        path: my-group/my-username
        mode: 511
```

En este caso, el archivo resultante en `/etc/foo/my-group/my-username` tendrá
un valor de permiso `0777`. Debido a las limitaciones de JSON, debe especificar el modo en notación decimal.

Tenga en cuenta que este valor de permiso puede mostrarse en notación decimal si lo lee después.

**Consumir Valores Secrets de Volúmenes**

Dentro del contenedor que monta un volumen del Secret, las llaves del Secret aparece como archivos y los valores del Secret son decodificados en base-64 y almacenados dentro de estos archivos.
Este es el resultado de comandos ejecutados dentro del contenedor del ejemplo anterior:

```shell
ls /etc/foo/
```

```none
username
password
```

```shell
cat /etc/foo/username
```

```none
admin
```

```shell
cat /etc/foo/password
```

```none
1f2d1e2e67df
```

El programa en un contenedor es responsable de leer los Secrets de los archivos.

**Los Secrets Montados se actualizan automáticamente**

Cuando se actualiza un Secret que ya se está consumiendo en un volumen, las claves proyectadas también se actualizan eventualmente.
Kubelet está verificando si el Secret montado esta actualizado en cada sincronización periódica.
Sin embargo, está usando su caché local para obtener el valor actual del Secret.
El tipo de caché es configurable usando el  (campo `ConfigMapAndSecretChangeDetectionStrategy`  en
[KubeletConfiguration struct](https://github.com/kubernetes/kubernetes/blob/master/staging/src/k8s.io/kubelet/config/v1beta1/types.go)).
Puede ser propagado por el reloj (default), ttl-based, o simplemente redirigiendo
todas las solicitudes a kube-apiserver directamente.
Como resultado, el retraso total desde el momento en que se actualiza el Secret hasta el momento en que se proyectan las nuevas claves en el Pod puede ser tan largo como el periodo de sincronización de kubelet + retraso de 
propagación de caché, donde el retraso de propagación de caché depende del tipo de caché elegido.
(Es igual a mirar el retraso de propagación, ttl of cache, o cero correspondientemente).

{{< note >}}
Un contenedor que usa un Secret como
[subPath](/docs/concepts/storage/volumes#using-subpath) el montaje del volumen no recibirá actualizaciones de Secret.
{{< /note >}}

### Usando Secrets como Variables de Entorno

Para usar un Secret en una {{< glossary_tooltip text="variable de entorno" term_id="container-env-variables" >}}
en un pod:

1. Crea un Secret o usa uno existente. Múltiples pods pueden hacer referencia a un mismo Secret.
1. Modifique la definición de su Pod en cada contenedor que desee consumir el valor de una llave Secret para agregar una variable de entorno para cada llave Secret que deseas consumir.   La variable de entorno que consume la llave Secret debe completar el nombre y la llave del  Secret en `env[].valueFrom.secretKeyRef`.
1. Modifique su imagen y/o linea de comandos para que el programa busque valores en las variables de entorno especificadas.

Esto es un ejemplo de un pod que usa Secrets de variables de entorno:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: secret-env-pod
spec:
  containers:
  - name: mycontainer
    image: redis
    env:
      - name: SECRET_USERNAME
        valueFrom:
          secretKeyRef:
            name: mysecret
            key: username
      - name: SECRET_PASSWORD
        valueFrom:
          secretKeyRef:
            name: mysecret
            key: password
  restartPolicy: Never
```

**Consumiendo Valores Secrets a partir de Variables de Entorno**

Dentro de un contenedor que consume un Secret en una variable de entorno, las claves Secrets aparecen como variables de entorno normal  que contienen valores decodificados de base-64 de los datos del Secret.
Este es el resultado de comandos ejecutados dentro del contenedor del ejemplo anterior.

```shell
echo $SECRET_USERNAME
```

```none
admin
```

```shell
echo $SECRET_PASSWORD
```

```none
1f2d1e2e67df
```

### Usando imagePullSecrets

Una imagePullSecret es una forma de pasar a kubelet un Secret que contiene las credenciales para un registro de imagenes de Docker (u otro) para que pueda obtener una imagen privada en nombre de su pod.

**Especificar manualmente una imagePullSecret**

El uso de imagePullSecrets se desccriben en la documentación de las imágenes [images documentation](/docs/concepts/containers/images/#specifying-imagepullsecrets-on-a-pod)

### Organización de imagePullSecrets para que se Adjunte Automáticamente

Puede crear manualmente un imagePullSecret, y hacer referencia a él desde un serviceAccount.  Cualquier pod creado con ese serviceAccount 
o ese valor predeterminado para usar serviceAccount, obtendrá su campo imagePullSecret
establecido en el service account.
Ver [Agregar ImagePullSecrets a una cuenta de servicio](/docs/tasks/configure-pod-container/configure-service-account/#add-imagepullsecrets-to-a-service-account)
 para una explicación detallada de ese proceso.

### Montaje Automatico de Secrets Creados Manualmente

Secrets creados Manualmente, (por ejemplo uno que contiene un token para acceder a una cuenta github) se puede conectar automáticamente a los pods según su cuenta de servicio. Vea [ Inyección de infromación en pods usando un a PodPreset](/docs/tasks/inject-data-application/podpreset/)  para una explicación detallada de este proceso.

## Detalles

### Restricciones

Las fuentes del volumen del  Secret  se validan para garantizar que la referencia del objeto especificado apunte a un objeto de tipo `Secret`. Por lo tanto, se debe crear un `Secret` antes de que cualquier pod dependa de él.

Los objetos API Secret residen en {{< glossary_tooltip text="namespace" term_id="namespace" >}}.
Solo pueden ser referenciados por pods en el mismo namespace.

Los `Secrets` individuales estan limitados a 1MiB de tamaño.  Esto es para desalentar la creación de `Secrets` muy grandes que agotarían la memoria del apiserver y de kubelet.
Sin embargo la creación de muchos Secrets más pequeños también podría agotar la memoria. Límites más completos en el uso de memoria debido a `Secret` es una característica planificada.

Kubelet solo admite el uso de `Secret` para Pods que obtiene del API server. Esto incluye cualquier pods creado usando kubectl, o indirectamente a través de un contralador de replicación.
No incluye pods creados a través de los kubelets 
`--manifest-url` flag, its `--config` flag, o su REST API (estas no son formas comunes de crear pods.)

Los Secrets deben crearse antes de que se consuman en pod como variables de entono a menos que estén marcados como optional.  Referencias a Secrets que no existen evitarán que el pod inicie. 
Las referencias a través de `secretKeyRef` a claves que no existen en un Secret con nombre evitarán que el pod se inicie.

Los Secrets que se utilizan para poblar variables de entorno a través de `envFrom` que tienen claves que se consideran nombres de variables de entorno no validos, tendran esas claves omitidas. El Pod se permitira reiniciar. Habrá un evento cuyo motivo es  `InvalidVariableNames` y el mensaje contendrá la lista de claves no validas que se omitieron. El ejemplo muestra un pod que se refiere al default/mysecret que contiene 2 claves no validas, 1 badkey y 2 alsobad.

```shell
kubectl get events
```
```
LASTSEEN   FIRSTSEEN   COUNT     NAME            KIND      SUBOBJECT                         TYPE      REASON
0s         0s          1         dapi-test-pod   Pod                                         Warning   InvalidEnvironmentVariableNames   kubelet, 127.0.0.1      Keys [1badkey, 2alsobad] from the EnvFrom secret default/mysecret were skipped since they are considered invalid environment variable names.
```

### Interacción del Secret y Pod de por vida

Cuando se crea un Pod a través de la API, no se verifica que exista un recreto referenciado. 
Una vez que se programa el Pod, kubelet intentará obtener el valor del Secret.
Si el Secret no se puede recuperar será por que no existe o por una falla 
temporal de conexión al servidor API, kubelet volverá a intentarlo periodicamente.
Enviará un evento sobre el pod explicando las razones por la que aún no se inició.
Una vez que el Secret es encontrado, kubelet creará y montará el volumen que lo contiene.
Ninguno de los contenedorees del pod se iniciará hasta que se monten todos los volúmes del pod.

## Casos de uso

### Caso de Uso: Pod con llaves ssh

Cree un fichero kustomization.yaml con SecretGenerator conteniendo algunas llaves ssh:

```shell
kubectl create secret generic ssh-key-secret --from-file=ssh-privatekey=/path/to/.ssh/id_rsa --from-file=ssh-publickey=/path/to/.ssh/id_rsa.pub
```

```none
secret "ssh-key-secret" created
```

{{< caution >}}
Piense detenidamente antes de enviar tus propias llaves ssh: otros usuarios del cluster pueden tener acceso al Secret. Utilice una cuenta de servicio a la que desee que estén accesibles todos los usuarios con los que comparte el cluster de Kubernetes, y pueda revocarlas si se ven comprometidas.
{{< /caution >}}

Ahora podemos crear un pod que haga referencia al Secret con la llave ssh key y lo consuma en un volumen:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: secret-test-pod
  labels:
    name: secret-test
spec:
  volumes:
  - name: secret-volume
    secret:
      secretName: ssh-key-secret
  containers:
  - name: ssh-test-container
    image: mySshImage
    volumeMounts:
    - name: secret-volume
      readOnly: true
      mountPath: "/etc/secret-volume"
```

Cuando se ejecuta el comando del contenedor, las partes de la llave estarán disponible en:

```shell
/etc/secret-volume/ssh-publickey
/etc/secret-volume/ssh-privatekey
```

El contenedor es libre de usar los datos del Secret para establecer conexión ssh.

### Caso de uso: Pods con credenciales prod / test

Este ejemplo ilustra un pod que consume un Secret que contiene credenciales de prod y  otro pod que consume un Secret con credenciales de entorno de prueba.

Crear un fichero kustomization.yaml con SecretGenerator

```shell
kubectl create secret generic prod-db-secret --from-literal=username=produser --from-literal=password=Y4nys7f11
```

```none
secret "prod-db-secret" created
```

```shell
kubectl create secret generic test-db-secret --from-literal=username=testuser --from-literal=password=iluvtests
```

```none
secret "test-db-secret" created
```

{{< note >}}
Caracteres especiales como `$`, `\*`, y `!` requieren ser escapados.
Si el password que estas usando tiene caracteres especiales, necesitas escaparlos usando el caracter `\\` . Por ejemplo, si tu password actual es `S!B\*d$zDsb`, deberías ejecutar el comando de esta forma:

```shell
kubectl create secret generic dev-db-secret --from-literal=username=devuser --from-literal=password=S\\!B\\\*d\\$zDsb
```

No necesitas escapar caracteres especiales en contraseñas de los archivos (`--from-file`).
{{< /note >}}

Ahora haz los pods:

```shell
cat <<EOF > pod.yaml
apiVersion: v1
kind: List
items:
- kind: Pod
  apiVersion: v1
  metadata:
    name: prod-db-client-pod
    labels:
      name: prod-db-client
  spec:
    volumes:
    - name: secret-volume
      secret:
        secretName: prod-db-secret
    containers:
    - name: db-client-container
      image: myClientImage
      volumeMounts:
      - name: secret-volume
        readOnly: true
        mountPath: "/etc/secret-volume"
- kind: Pod
  apiVersion: v1
  metadata:
    name: test-db-client-pod
    labels:
      name: test-db-client
  spec:
    volumes:
    - name: secret-volume
      secret:
        secretName: test-db-secret
    containers:
    - name: db-client-container
      image: myClientImage
      volumeMounts:
      - name: secret-volume
        readOnly: true
        mountPath: "/etc/secret-volume"
EOF
```

Añade los pods a el mismo fichero kustomization.yaml

```shell
cat <<EOF >> kustomization.yaml
resources:
- pod.yaml
EOF
```

Aplique todos estos objetos en el Apiserver por

```shell
kubectl apply --k .
```

Ambos contenedores tendrán los siguientes archivos presentes en sus  sistemas de archivos con valores  para el entorno de cada contenedor:

```shell
/etc/secret-volume/username
/etc/secret-volume/password
```

observe cómo las especificaciones para los dos pods difieren solo en un campo;  esto facilita la creación de pods con diferentes capacidades de una plantilla de configuración de pod común.

Deberías simplificar aún más la especificación del pod base utilizando dos Cuentas de Servicio:
uno llamado, `prod-user` con el `prod-db-secret`, y otro llamado,
`test-user` con el `test-db-secret`.  Luego, la especificación del pod se puede acortar a, por ejemplo:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: prod-db-client-pod
  labels:
    name: prod-db-client
spec:
  serviceAccount: prod-db-client
  containers:
  - name: db-client-container
    image: myClientImage
```

### Caso de uso: Dotfiles en el volume del Secret

Para hacer que los datos esten 'ocultos' (es decir, en un file dónde el nombre comienza con un caracter de punto), simplemente haga que esa clave comience con un punto.  Por ejemplo, cuando el siguiente Secret es montado en un volumen:

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: dotfile-secret
data:
  .secret-file: dmFsdWUtMg0KDQo=
---
apiVersion: v1
kind: Pod
metadata:
  name: secret-dotfiles-pod
spec:
  volumes:
  - name: secret-volume
    secret:
      secretName: dotfile-secret
  containers:
  - name: dotfile-test-container
    image: registry.k8s.io/busybox
    command:
    - ls
    - "-l"
    - "/etc/secret-volume"
    volumeMounts:
    - name: secret-volume
      readOnly: true
      mountPath: "/etc/secret-volume"
```

El `secret-volume` contendrá un solo archivo, llamado `.secret-file`, y
el `dotfile-test-container` tendrá este fichero presente en el path
`/etc/secret-volume/.secret-file`.

{{< note >}}
Los archivos que comiences con caracterers de punto estan ocultos de la salida de `ls -l`;
tu debes usar `ls -la` para verlos al enumerar los contenidos del directorio.
{{< /note >}}

### Caso de uso: Secret visible para un contenedor en un pod

Considere un programa que necesita manejar solicitudes HTTP, hacer una lógica empresarial compleja y luego firmar algunos mensajes con un HMAC. Debido a que tiene una lógica de aplicación compleja, puede haber una vulnerabilidad de lectura remota de archivos inadvertida en el servidor, lo que podría exponer la clave privada a un atacante.

Esto podría dividirse en dos procesos en dos contenedores: un contenedor de frontend que maneja la interacción del usuario y la lógica empresarial. pero que no puede ver la clave privada; y un contenedor de firmante que puede ver la clave privada, y responde a solicitudes de firma simples del frontend (ejemplo, a través de redes de localhost).

Con este enfoque particionado, un atacante ahora tiene que engañar a un servidor de aplicaciones para que haga algo bastante arbitrario, lo que puede ser más difícil que hacer que lea un archivo.

<!-- TODO: explain how to do this while still using automation. -->

## Mejores prácticas

### Clientes que usan la API de Secrets

Al implementar aplicaciones que interactuan con los API Secrets, el acceso debe limitarse utilizando [authorization policies](
/docs/reference/access-authn-authz/authorization/) como [RBAC](
/docs/reference/access-authn-authz/rbac/).

Los Secrets a menudo contienen valores que abarcan un espectro de importancia, muchos de los cuales pueden causar escalamientos dentro de Kubernetes (ejememplo, tokens de cuentas de servicio) y a sistemas externos. Incluso si  una aplicación individual puede razonar sobre el poder de los Secrets con los que espera interactuar, otras aplicaciones dentro dle mismo namespace pueden invalidar esos supuestos.

Por esas razones las solicitudes de `watch` y `list` dentro de un espacio de nombres son extremadamente poderosos y deben evitarse, dado que listar Secrets permiten a los clientes inspecionar los valores de todos los Secrets que estan en el namespace. La capacidad para `watch` and `list` todos los Secrets en un cluster deben reservarse solo para los componentes de nivel de sistema más privilegiados.

Las aplicaciones que necesitan acceder a la API de Secrets deben realizar solicitudes de `get` de los Secrets que necesitan. Esto permite a los administradores restringir el acceso a todos los Secrets mientras [white-listing access to individual instances](
/docs/reference/access-authn-authz/rbac/#referring-to-resources) que necesita la aplicación.

Para un mejor rendimiento sobre un bucle `get`, los clientes pueden diseñar recursos que hacen referencia a un Secret y luego un Secret `watch` el recurso, al volver a solicitar el Secret cuando cambie la referencia. Además,, un ["bulk watch" API](
https://github.com/kubernetes/community/blob/master/contributors/design-proposals/api-machinery/bulk_watch.md)
para que los clientes puedan `watch` recursos individuales, y probablemente estará disponible en futuras versiones de Kubernetes.

## Propiedades de seguridad

### Protecciones

Debido a que los objetos `Secret` se pueden crear independientemente de los `Pods` que los usan, hay menos riesgo de que el Secret expuesto durante el flujo de trabajo de la creación,  visualización, y edición de pods. El sistema también puede tomar precausiones con los objetos`Secret`, tal como eviar escribirlos en el disco siempre que sea posible.

Un Secret solo se envía a un nodo si un pod en ese nodo lo requiere. Kubelet almacena el Secret en un `tmpfs` para que el Secret no se escriba en el almacenamiento de disco. Una vez que se elimina el pod que depende del Secret, kubelet eliminará su copia local de los datos de Secrets.

Puede haber Secrets para varios Pods en el mismo nodo. Sin embargo, solo los Secrets que solicita un Pod son potencialmente visibles dentro de sus contenedores. Por lo tanto, un Pod no tiene acceso a los Secrets de otro Pod.

Puede haber varios contenedores en un Pod. Sin embargo, cada contenedor en un pod tiene que solicitar el volumen del Secret en su 
`volumeMounts` para que sea visible dentro del contenedor. Esto se puede usar para construir particiones de seguridad útiles en el Pod level](#use-case-secret-visible-to-one-container-in-a-pod).

En la mayoría de las distribuciones Kubernetes-project-maintained, la comunicación entre usuario a el apiserver, y del apiserver a kubelets, ista protegido por SSL/TLS.
Los Secrets estan protegidos cuando se transmiten por estos canales.

{{< feature-state for_k8s_version="v1.13" state="beta" >}}

Puedes habilitar [encryption at rest](/docs/tasks/administer-cluster/encrypt-data/)
para datos secretos, para que los Secrets no se almacenen en claro en {{< glossary_tooltip term_id="etcd" >}}.

### Riesgos

 - En el servidor API, los datos de los Secrets se almacenan en {{< glossary_tooltip term_id="etcd" >}}; por lo tanto:
   - Los adminsitradores deben habilitar el cifrado en reposo para los datos del cluster (requiere v1.13 o posterior)
   - Los administradores deben limitar el acceso a etcd a los usuarios administradores
   - Los administradores  pueden querer borrar/destruir discos usados por etcd cuando ya no estén en uso
   - Si ejecuta etcd en un clúster, los administradores deben asegurarse de usar SSL/TSL para la comunicación entre pares etcd.
 - Si configura el Secret a través de un archivo de (JSON o YAML) que tiene los datos del Secret codificados como base64, compartir este archivo o registrarlo en un repositorio de origen significa que el Secret está comprometido. La codificación Base64 no es un método de cifrado y se considera igual que un texto plano.
 - Las aplicaciones aún necesitan proteger el valor del Secret después de leerlo del volumen, como no registrarlo accidentalmente o transmitirlo a una parte no confiable.
 - Un usuario que puede crear un pod que usa un Secret también puede ver el valor del Secret. Incluso si una política del apiserver no permite que ese usuario lea el objeto Secret, el usuario puede ejecutar el pod que expone el Secret.
 - Actualmente, cualquier persona con root en cualquier nodo puede leer _cualquier_ secret del apiserver, haciéndose pasar por el kubelet.  Es una característica planificada enviar Secrets a los nodos que realmente lo requieran, para restringir el impacto de una explosión de root en un single node.

## {{% heading "whatsnext" %}}
