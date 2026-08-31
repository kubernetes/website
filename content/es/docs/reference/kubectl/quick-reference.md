---
title: Referencia rápida de kubectl
content_type: concept
weight: 10 # highlight it
card:
  name: tasks
  weight: 10
---

<!-- overview -->

Esta página contiene una lista de los comandos y flags de `kubectl` más utilizados.

{{< note >}}
Estas instrucciones son para Kubernetes v{{< skew currentVersion >}}. Para comprobar la versión, usa el comando `kubectl version`.
{{< /note >}}
<!-- body -->

## Autocompletado de kubectl

### BASH

```bash
source <(kubectl completion bash) # configura el autocompletado en bash en el shell actual; primero debe estar instalado el paquete bash-completion.
echo "source <(kubectl completion bash)" >> ~/.bashrc # añade el autocompletado permanentemente a tu shell de bash.
```

También puedes usar un alias abreviado para `kubectl` que también funciona con el autocompletado:

```bash
alias k=kubectl
complete -o default -F __start_kubectl k
```

### ZSH

```bash
source <(kubectl completion zsh)  # configura el autocompletado en zsh en el shell actual
echo '[[ $commands[kubectl] ]] && source <(kubectl completion zsh)' >> ~/.zshrc # añade el autocompletado permanentemente a tu shell de zsh
```

### FISH

{{< note >}}
Requiere la versión 1.23 de kubectl o superior.
{{< /note >}}

```bash
echo 'kubectl completion fish | source' > ~/.config/fish/completions/kubectl.fish && source ~/.config/fish/completions/kubectl.fish
```

### Una nota sobre `--all-namespaces`

Añadir `--all-namespaces` ocurre con la frecuencia suficiente como para que conozcas la forma abreviada de `--all-namespaces`:

```kubectl -A```

## Contexto y configuración de kubectl

Define con qué clúster de Kubernetes se comunica `kubectl` y modifica la
información de configuración. Consulta la documentación
[Autenticación entre clústeres con kubeconfig](/docs/tasks/access-application-cluster/configure-access-multiple-clusters/) para obtener
información detallada sobre el archivo de configuración.

```bash
kubectl config view # Muestra la configuración de kubeconfig fusionada.

# usa varios archivos kubeconfig al mismo tiempo y muestra la configuración fusionada
KUBECONFIG=~/.kube/config:~/.kube/kubconfig2

kubectl config view

# Muestra la configuración de kubeconfig fusionada con los datos de certificados sin procesar y los secretos expuestos
kubectl config view --raw

# obtén la contraseña del usuario e2e
kubectl config view -o jsonpath='{.users[?(@.name == "e2e")].user.password}'

# obtén el certificado del usuario e2e
kubectl config view --raw -o jsonpath='{.users[?(.name == "e2e")].user.client-certificate-data}' | base64 -d

kubectl config view -o jsonpath='{.users[].name}'    # muestra el primer usuario
kubectl config view -o jsonpath='{.users[*].name}'   # obtén una lista de usuarios
kubectl config get-contexts                          # muestra la lista de contextos
kubectl config get-contexts -o name                  # obtén todos los nombres de contextos
kubectl config current-context                       # muestra el current-context
kubectl config use-context my-cluster-name           # establece el contexto por defecto a my-cluster-name

kubectl config set-cluster my-cluster-name           # crea una entrada de clúster en el kubeconfig

# configura la URL del servidor proxy que se usará para las solicitudes realizadas por este cliente en el kubeconfig
kubectl config set-cluster my-cluster-name --proxy-url=my-proxy-url

# añade un nuevo usuario a tu kubeconf que soporte autenticación básica
kubectl config set-credentials kubeuser/foo.kubernetes.com --username=kubeuser --password=kubepassword

# guarda permanentemente el namespace para todos los comandos kubectl posteriores en ese contexto.
kubectl config set-context --current --namespace=ggckad-s2

# establece un contexto utilizando un usuario y un namespace específicos.
kubectl config set-context gce --user=cluster-admin --namespace=foo \
  && kubectl config use-context gce

kubectl config unset users.foo                       # elimina el usuario foo

# alias abreviado para establecer/mostrar el contexto/namespace (solo funciona en bash y shells compatibles con bash; el contexto actual debe establecerse antes de usar kn para configurar el namespace)
alias kx='f() { [ "$1" ] && kubectl config use-context $1 || kubectl config current-context ; } ; f'
alias kn='f() { [ "$1" ] && kubectl config set-context --current --namespace $1 || kubectl config view --minify | grep namespace | cut -d" " -f6 ; } ; f'
```

## kubectl apply

`apply` gestiona las aplicaciones a través de archivos que definen recursos de Kubernetes. Crea y actualiza recursos en un clúster mediante la ejecución de `kubectl apply`. Esta es la forma recomendada de gestionar aplicaciones de Kubernetes en producción. Consulta el [Kubectl Book](https://kubectl.docs.kubernetes.io).

## Creación de objetos

Los manifiestos de Kubernetes pueden definirse en YAML o JSON. Se pueden usar las extensiones de archivo `.yaml`,
`.yml` y `.json`.

```bash
kubectl apply -f ./my-manifest.yaml                 # crea uno o varios recursos
kubectl apply -f ./my1.yaml -f ./my2.yaml           # crea a partir de varios archivos
kubectl apply -f ./dir                              # crea uno o varios recursos a partir de todos los archivos de manifiesto en dir
kubectl apply -f https://example.com/manifest.yaml  # crea uno o varios recursos a partir de una URL (Nota: este es un dominio de ejemplo y no contiene un manifiesto válido)
kubectl create deployment nginx --image=nginx       # inicia una única instancia de nginx

# crea un Job que imprime "Hello World"
kubectl create job hello --image=busybox:1.28 -- echo "Hello World"

# crea un CronJob que imprime "Hello World" cada minuto
kubectl create cronjob hello --image=busybox:1.28   --schedule="*/1 * * * *" -- echo "Hello World"

kubectl explain pods                           # obtén la documentación de los manifiestos de pod

# Crea múltiples objetos YAML a partir de stdin
kubectl apply -f - <<EOF
apiVersion: v1
kind: Pod
metadata:
  name: busybox-sleep
spec:
  containers:
  - name: busybox
    image: busybox:1.28
    args:
    - sleep
    - "1000000"
---
apiVersion: v1
kind: Pod
metadata:
  name: busybox-sleep-less
spec:
  containers:
  - name: busybox
    image: busybox:1.28
    args:
    - sleep
    - "1000"
EOF

# Crea un secret con varias claves
kubectl apply -f - <<EOF
apiVersion: v1
kind: Secret
metadata:
  name: mysecret
type: Opaque
data:
  password: $(echo -n "s33msi4" | base64 -w0)
  username: $(echo -n "jane" | base64 -w0)
EOF

```

## Ver y encontrar recursos

```bash
# Comandos get con salida básica
kubectl get services                          # Lista todos los services del namespace
kubectl get pods --all-namespaces             # Lista todos los pods de todos los namespaces
kubectl get pods -o wide                      # Lista todos los pods del namespace actual, con más detalles
kubectl get deployment my-dep                 # Lista un deployment en particular
kubectl get pods                              # Lista todos los pods del namespace
kubectl get pod my-pod -o yaml                # Obtiene el YAML de un pod

# Comandos describe con salida detallada
kubectl describe nodes my-node
kubectl describe pods my-pod

# Lista los services ordenados por nombre
kubectl get services --sort-by=.metadata.name

# Lista los pods ordenados por número de reinicios
kubectl get pods --sort-by='.status.containerStatuses[0].restartCount'

# Lista los PersistentVolumes ordenados por capacidad
kubectl get pv --sort-by=.spec.capacity.storage

# Obtiene el label de versión de todos los pods con el label app=cassandra
kubectl get pods --selector=app=cassandra -o \
  jsonpath='{.items[*].metadata.labels.version}'

# Recupera el valor de una clave con puntos, por ejemplo 'ca.crt'
kubectl get configmap myconfig \
  -o jsonpath='{.data.ca\.crt}'

# Recupera un valor codificado en base64 con guiones en lugar de guiones bajos.
kubectl get secret my-secret --template='{{index .data "key-name-with-dashes"}}'

# Obtiene todos los nodos de trabajo (usa un selector para excluir los resultados que tengan un
# label llamado 'node-role.kubernetes.io/control-plane')
kubectl get node --selector='!node-role.kubernetes.io/control-plane'

# Obtiene todos los pods en ejecución del namespace
kubectl get pods --field-selector=status.phase=Running

# Obtiene las ExternalIPs de todos los nodos
kubectl get nodes -o jsonpath='{.items[*].status.addresses[?(@.type=="ExternalIP")].address}'

# Lista los nombres de los pods que pertenecen a un RC en particular
# el comando "jq" es útil para transformaciones demasiado complejas para jsonpath; puedes encontrarlo en https://jqlang.github.io/jq/
sel=${$(kubectl get rc my-rc --output=json | jq -j '.spec.selector | to_entries | .[] | "\(.key)=\(.value),"')%?}
echo $(kubectl get pods --selector=$sel --output=jsonpath={.items..metadata.name})

# Muestra los labels de todos los pods (o cualquier otro objeto de Kubernetes que soporte labels)
kubectl get pods --show-labels

# Comprueba qué nodos están listos
JSONPATH='{range .items[*]}{@.metadata.name}:{range @.status.conditions[*]}{@.type}={@.status};{end}{end}' \
 && kubectl get nodes -o jsonpath="$JSONPATH" | grep "Ready=True"

# Comprueba qué nodos están listos con custom-columns
kubectl get node -o custom-columns='NODE_NAME:.metadata.name,STATUS:.status.conditions[?(@.type=="Ready")].status'

# Muestra los secret decodificados sin herramientas externas
kubectl get secret my-secret -o go-template='{{range $k,$v := .data}}{{"### "}}{{$k}}{{"\n"}}{{$v|base64decode}}{{"\n\n"}}{{end}}'

# Lista todos los secrets actualmente en uso por un pod
kubectl get pods -o json | jq '.items[].spec.containers[].env[]?.valueFrom.secretKeyRef.name' | grep -v null | sort | uniq

# Lista todos los containerID de los initContainer de todos los pods
# Útil al limpiar contenedores detenidos, evitando la eliminación de los initContainers.
kubectl get pods --all-namespaces -o jsonpath='{range .items[*].status.initContainerStatuses[*]}{.containerID}{"\n"}{end}' | cut -d/ -f3

# Lista los eventos ordenados por timestamp
kubectl get events --sort-by=.metadata.creationTimestamp

# Lista todos los eventos de advertencia
kubectl events --types=Warning

# Compara el estado actual del clúster con el estado en el que estaría si se aplicara el manifiesto.
kubectl diff -f ./my-manifest.yaml

# Genera un árbol delimitado por puntos de todas las claves devueltas para los nodos
# Útil al localizar una clave dentro de una estructura JSON anidada compleja
kubectl get nodes -o json | jq -c 'paths|join(".")'

# Genera un árbol delimitado por puntos de todas las claves devueltas para los pods, etc.
kubectl get pods -o json | jq -c 'paths|join(".")'

# Genera variables de entorno para todos los pods, asumiendo que tienes un contenedor por defecto para los pods, el namespace por defecto y que se soporta el comando `env`.
# Útil al ejecutar cualquier comando soportado en todos los pods, no solo `env`
for pod in $(kubectl get po --output=jsonpath={.items..metadata.name}); do echo $pod && kubectl exec -it $pod -- env; done

# Obtiene el subrecurso status de un deployment
kubectl get deployment nginx-deployment --subresource=status
```

## Actualización de recursos

```bash
kubectl set image deployment/frontend www=image:v2               # Actualización continua (rolling update) de los contenedores "www" del deployment "frontend", actualizando la imagen
kubectl rollout history deployment/frontend                      # Comprueba el historial de los deployments, incluida la revisión
kubectl rollout undo deployment/frontend                         # Revierte al deployment anterior
kubectl rollout undo deployment/frontend --to-revision=2         # Revierte a una revisión específica
kubectl rollout status -w deployment/frontend                    # Observa el estado de la actualización continua del deployment "frontend" hasta su finalización
kubectl rollout restart deployment/frontend                      # Reinicio continuo del deployment "frontend"


cat pod.json | kubectl replace -f -                              # Reemplaza un pod basándose en el JSON pasado por stdin

# Reemplazo forzado: elimina y vuelve a crear el recurso. Provocará una interrupción del servicio.
kubectl replace --force -f ./pod.json

# Crea un service para un nginx replicado, que sirve en el puerto 80 y se conecta a los contenedores en el puerto 8000
kubectl expose rc nginx --port=80 --target-port=8000

# Actualiza la versión (tag) de la imagen de un pod de un solo contenedor a v4
kubectl get pod mypod -o yaml | sed 's/\(image: myimage\):.*$/\1:v4/' | kubectl replace -f -

kubectl label pods my-pod new-label=awesome                      # Añade un label
kubectl label pods my-pod new-label-                             # Elimina un label
kubectl label pods my-pod new-label=new-value --overwrite        # Sobrescribe un valor existente
kubectl annotate pods my-pod icon-url=http://goo.gl/XXBTWq       # Añade una anotación
kubectl annotate pods my-pod icon-url-                           # Elimina una anotación
kubectl autoscale deployment foo --min=2 --max=10                # Escala automáticamente el deployment "foo"
```

## Aplicar parches a recursos

```bash
# Actualiza parcialmente un nodo
kubectl patch node k8s-node-1 -p '{"spec":{"unschedulable":true}}'

# Actualiza la imagen de un contenedor; spec.containers[*].name es obligatorio porque es una merge key
kubectl patch pod valid-pod -p '{"spec":{"containers":[{"name":"kubernetes-serve-hostname","image":"new image"}]}}'

# Actualiza la imagen de un contenedor usando un json patch con arrays posicionales
kubectl patch pod valid-pod --type='json' -p='[{"op": "replace", "path": "/spec/containers/0/image", "value":"new image"}]'

# Deshabilita el livenessProbe de un deployment usando un json patch con arrays posicionales
kubectl patch deployment valid-deployment  --type json   -p='[{"op": "remove", "path": "/spec/template/spec/containers/0/livenessProbe"}]'

# Añade un nuevo elemento a un array posicional
kubectl patch sa default --type='json' -p='[{"op": "add", "path": "/secrets/1", "value": {"name": "whatever" } }]'

# Actualiza el número de réplicas de un deployment aplicando un parche a su subrecurso scale
kubectl patch deployment nginx-deployment --subresource='scale' --type='merge' -p '{"spec":{"replicas":2}}'
```

## Edición de recursos

Edita cualquier recurso de la API en tu editor preferido.

```bash
kubectl edit svc/docker-registry                      # Edita el service llamado docker-registry
KUBE_EDITOR="nano" kubectl edit svc/docker-registry   # Usa un editor alternativo
```

## Escalado de recursos

```bash
kubectl scale --replicas=3 rs/foo                                 # Escala un replicaset llamado 'foo' a 3
kubectl scale --replicas=3 -f foo.yaml                            # Escala el recurso especificado en "foo.yaml" a 3
kubectl scale --current-replicas=2 --replicas=3 deployment/mysql  # Si el tamaño actual del deployment llamado mysql es 2, escala mysql a 3
kubectl scale --replicas=5 rc/foo rc/bar rc/baz                   # Escala múltiples replication controllers
```

## Eliminación de recursos

```bash
kubectl delete -f ./pod.json                                      # Elimina un pod usando el tipo y el nombre especificados en pod.json
kubectl delete pod unwanted --now                                 # Elimina un pod sin período de gracia
kubectl delete pod,service baz foo                                # Elimina pods y services con los mismos nombres "baz" y "foo"
kubectl delete pods,services -l name=myLabel                      # Elimina pods y services con el label name=myLabel
kubectl -n my-ns delete pod,svc --all                             # Elimina todos los pods y services del namespace my-ns,
# Elimina todos los pods que coincidan con el patrón awk pattern1 o pattern2
kubectl get pods  -n mynamespace --no-headers=true | awk '/pattern1|pattern2/{print $1}' | xargs  kubectl delete -n mynamespace pod
```

## Interacción con Pods en ejecución

```bash
kubectl logs my-pod                                 # vuelca los logs del pod (stdout)
kubectl logs -l name=myLabel                        # vuelca los logs de los pods, con el label name=myLabel (stdout)
kubectl logs my-pod --previous                      # vuelca los logs del pod (stdout) de una instanciación anterior de un contenedor
kubectl logs my-pod -c my-container                 # vuelca los logs del contenedor del pod (stdout, caso de múltiples contenedores)
kubectl logs -l name=myLabel -c my-container        # vuelca los logs del contenedor del pod, con el label name=myLabel (stdout)
kubectl logs my-pod -c my-container --previous      # vuelca los logs del contenedor del pod (stdout, caso de múltiples contenedores) de una instanciación anterior de un contenedor
kubectl logs -f my-pod                              # transmite (stream) los logs del pod (stdout)
kubectl logs -f my-pod -c my-container              # transmite los logs del contenedor del pod (stdout, caso de múltiples contenedores)
kubectl logs -f -l name=myLabel --all-containers    # transmite los logs de todos los pods con el label name=myLabel (stdout)
kubectl run -i --tty busybox --image=busybox:1.28 -- sh  # Ejecuta un pod como shell interactivo
kubectl run nginx --image=nginx -n mynamespace      # Inicia una única instancia del pod nginx en el namespace mynamespace
kubectl run nginx --image=nginx --dry-run=client -o yaml > pod.yaml
                                                    # Genera la spec para ejecutar el pod nginx y la escribe en un archivo llamado pod.yaml
kubectl attach my-pod -i                            # Adjúntate al contenedor en ejecución
kubectl port-forward my-pod 5000:6000               # Escucha en el puerto 5000 de la máquina local y lo reenvía al puerto 6000 de my-pod
kubectl exec my-pod -- ls /                         # Ejecuta un comando en un pod existente (caso de un contenedor)
kubectl exec --stdin --tty my-pod -- /bin/sh        # Acceso a shell interactivo a un pod en ejecución (caso de un contenedor)
kubectl exec my-pod -c my-container -- ls /         # Ejecuta un comando en un pod existente (caso de múltiples contenedores)
kubectl debug my-pod -it --image=busybox:1.28       # Crea una sesión de depuración interactiva dentro de un pod existente y se adjunta a ella inmediatamente
kubectl debug node/my-node -it --image=busybox:1.28 # Crea una sesión de depuración interactiva en un nodo y se adjunta a ella inmediatamente
kubectl top pod                                     # Muestra las métricas de todos los pods del namespace por defecto
kubectl top pod POD_NAME --containers               # Muestra las métricas de un pod determinado y sus contenedores
kubectl top pod POD_NAME --sort-by=cpu              # Muestra las métricas de un pod determinado y las ordena por 'cpu' o 'memory'
```
## Copiar archivos y directorios hacia y desde los contenedores

```bash
kubectl cp /tmp/foo_dir my-pod:/tmp/bar_dir            # Copia el directorio local /tmp/foo_dir a /tmp/bar_dir en un pod remoto del namespace actual
kubectl cp /tmp/foo my-pod:/tmp/bar -c my-container    # Copia el archivo local /tmp/foo a /tmp/bar en un contenedor específico de un pod remoto
kubectl cp /tmp/foo my-namespace/my-pod:/tmp/bar       # Copia el archivo local /tmp/foo a /tmp/bar en un pod remoto del namespace my-namespace
kubectl cp my-namespace/my-pod:/tmp/foo /tmp/bar       # Copia /tmp/foo de un pod remoto a /tmp/bar localmente
```
{{< note >}}
`kubectl cp` requiere que el binario 'tar' esté presente en la imagen de tu contenedor. Si 'tar' no está presente, `kubectl cp` fallará.
Para casos de uso avanzados, como symlinks, expansión de comodines o conservación de los modos de archivo, considera usar `kubectl exec`.
{{< /note >}}

```bash
tar cf - /tmp/foo | kubectl exec -i -n my-namespace my-pod -- tar xf - -C /tmp/bar           # Copia el archivo local /tmp/foo a /tmp/bar en un pod remoto del namespace my-namespace
kubectl exec -n my-namespace my-pod -- tar cf - /tmp/foo | tar xf - -C /tmp/bar    # Copia /tmp/foo de un pod remoto a /tmp/bar localmente
```


## Interacción con Deployments y Services
```bash
kubectl logs deploy/my-deployment                         # vuelca los logs del Pod de un Deployment (caso de un solo contenedor)
kubectl logs deploy/my-deployment -c my-container         # vuelca los logs del Pod de un Deployment (caso de múltiples contenedores)

kubectl port-forward svc/my-service 5000                  # escucha en el puerto local 5000 y lo reenvía al puerto 5000 del backend del Service
kubectl port-forward svc/my-service 5000:my-service-port  # escucha en el puerto local 5000 y lo reenvía al puerto de destino del Service llamado <my-service-port>

kubectl port-forward deploy/my-deployment 5000:6000       # escucha en el puerto local 5000 y lo reenvía al puerto 6000 de un Pod creado por <my-deployment>
kubectl exec deploy/my-deployment -- ls                   # ejecuta un comando en el primer Pod y primer contenedor del Deployment (casos de uno o múltiples contenedores)
```

## Interacción con los Nodos y el clúster

```bash
kubectl cordon my-node                                                # Marca my-node como no agendable
kubectl drain my-node                                                 # Drena (drain) my-node en preparación para el mantenimiento
kubectl uncordon my-node                                              # Marca my-node como agendable
kubectl top node                                                      # Muestra las métricas de todos los nodos
kubectl top node my-node                                              # Muestra las métricas de un nodo determinado
kubectl cluster-info                                                  # Muestra las direcciones del master y de los services
kubectl cluster-info dump                                             # Vuelca el estado actual del clúster a stdout
kubectl cluster-info dump --output-directory=/path/to/cluster-state   # Vuelca el estado actual del clúster a /path/to/cluster-state

# Muestra los taints existentes en los nodos actuales.
kubectl get nodes -o='custom-columns=NodeName:.metadata.name,TaintKey:.spec.taints[*].key,TaintValue:.spec.taints[*].value,TaintEffect:.spec.taints[*].effect'

# Si ya existe un taint con esa clave y efecto, su valor se reemplaza según lo especificado.
kubectl taint nodes foo dedicated=special-user:NoSchedule
```

### Tipos de recursos

Lista todos los tipos de recursos soportados junto con sus nombres cortos, [grupo de la API](/docs/concepts/overview/kubernetes-api/#api-groups-and-versioning), si tienen [namespace](/docs/concepts/overview/working-with-objects/namespaces) y su [kind](/docs/concepts/overview/working-with-objects/):

```bash
kubectl api-resources
```

Otras operaciones para explorar los recursos de la API:

```bash
kubectl api-resources --namespaced=true      # Todos los recursos con namespace
kubectl api-resources --namespaced=false     # Todos los recursos sin namespace
kubectl api-resources -o name                # Todos los recursos con salida simple (solo el nombre del recurso)
kubectl api-resources -o wide                # Todos los recursos con salida expandida (también conocida como "wide")
kubectl api-resources --verbs=list,get       # Todos los recursos que soportan los verbos de solicitud "list" y "get"
kubectl api-resources --api-group=extensions # Todos los recursos del grupo de API "extensions"
```

### Formateo de la salida

Para mostrar los detalles en tu ventana de terminal en un formato específico, añade la flag `-o` (o `--output`) a un comando de `kubectl` soportado.

Formato de salida | Descripción
--------------| -----------
`-o=custom-columns=<spec>` | Imprime una tabla usando una lista separada por comas de columnas personalizadas
`-o=custom-columns-file=<filename>` | Imprime una tabla usando la plantilla de columnas personalizadas del archivo `<filename>`
`-o=go-template=<template>`     | Imprime los campos definidos en una [plantilla de golang](https://pkg.go.dev/text/template)
`-o=go-template-file=<filename>` | Imprime los campos definidos por la [plantilla de golang](https://pkg.go.dev/text/template) del archivo `<filename>`
`-o=json`     | Muestra un objeto de la API formateado en JSON
`-o=jsonpath=<template>` | Imprime los campos definidos en una expresión [jsonpath](/docs/reference/kubectl/jsonpath)
`-o=jsonpath-file=<filename>` | Imprime los campos definidos por la expresión [jsonpath](/docs/reference/kubectl/jsonpath) del archivo `<filename>`
`-o=kyaml`    | Muestra un objeto de la API formateado en [KYAML](/docs/reference/encodings/kyaml). KYAML es un dialecto de YAML específico de Kubernetes y puede interpretarse como YAML.
`-o=name`     | Imprime únicamente el nombre del recurso y nada más
`-o=wide`     | Muestra en formato de texto plano con información adicional; para los pods, se incluye el nombre del nodo
`-o=yaml`     | Muestra un objeto de la API formateado en YAML

Ejemplos usando `-o=custom-columns`:

```bash
# Todas las imágenes en ejecución en un clúster
kubectl get pods -A -o=custom-columns='DATA:spec.containers[*].image'

# Todas las imágenes en ejecución en el namespace: default, agrupadas por Pod
kubectl get pods --namespace default --output=custom-columns="NAME:.metadata.name,IMAGE:.spec.containers[*].image"

 # Todas las imágenes excepto "registry.k8s.io/coredns:1.6.2"
kubectl get pods -A -o=custom-columns='DATA:spec.containers[?(@.image!="registry.k8s.io/coredns:1.6.2")].image'

# Todos los campos de metadata independientemente del nombre
kubectl get pods -A -o=custom-columns='DATA:metadata.*'
```

Más ejemplos en la [documentación de referencia](/docs/reference/kubectl/#custom-columns) de kubectl.

### Nivel de detalle y depuración de la salida de kubectl

El nivel de detalle de kubectl se controla con las flags `-v` o `--v` seguidas de un número entero que representa el nivel de registro (log). Las convenciones generales de registro de Kubernetes y los niveles de registro asociados se describen [aquí](https://github.com/kubernetes/community/blob/main/contributors/devel/sig-instrumentation/logging.md).

Nivel de detalle | Descripción
--------------| -----------
`--v=0` | Generalmente es útil que esto sea *siempre* visible para el operador del clúster.
`--v=1` | Un nivel de registro por defecto razonable si no quieres demasiado detalle.
`--v=2` | Información útil de estado estable sobre el servicio y mensajes de registro importantes que pueden correlacionarse con cambios significativos en el sistema. Este es el nivel de registro por defecto recomendado para la mayoría de los sistemas.
`--v=3` | Información ampliada sobre los cambios.
`--v=4` | Nivel de detalle de depuración.
`--v=5` | Nivel de detalle de trazas (trace).
`--v=6` | Muestra los recursos solicitados.
`--v=7` | Muestra las cabeceras de las solicitudes HTTP.
`--v=8` | Muestra el contenido de las solicitudes HTTP.
`--v=9` | Muestra el contenido de las solicitudes HTTP sin truncar el contenido.

## {{% heading "whatsnext" %}}

* Aprende sobre la [introducción a kubectl](/docs/concepts/overview/kubectl/) y su papel en el ecosistema de Kubernetes.
* Lee la [referencia de kubectl](/docs/reference/kubectl/) y aprende sobre [JsonPath](/docs/reference/kubectl/jsonpath).

* Consulta las opciones de [kubectl](/docs/reference/kubectl/kubectl/).

* Consulta las opciones de [kuberc](/docs/reference/kubectl/kuberc).

* Lee también las [convenciones de uso de kubectl](/docs/reference/kubectl/conventions/) para entender cómo usar kubectl en scripts reutilizables.

* Consulta más [cheatsheets de kubectl de la comunidad](https://github.com/dennyzhang/cheatsheet-kubernetes-A4).
