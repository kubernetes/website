---
title: Manejo Declarativo de Objectos de Kubernetes usando Kustomize
content_type: task
weight: 20
---

<!-- overview -->

[Kustomize](https://github.com/kubernetes-sigs/kustomize) es una herramienta independiente para personalizar objetos de Kubernetes a través de un  [archivo de kustomization](https://kubectl.docs.kubernetes.io/references/kustomize/glossary/#kustomization).

Desde la versión 1.14, Kubectl también admite la gestión de objetos de Kubernetes utilizando un archivo de kustomización. Para ver Recursos encontrados en un directorio que contiene un archivo de kustomización, ejecuta el siguiente comando:


```shell
kubectl kustomize <directorio_de_kustomización>
```

Para aplicar esos Recursos, ejecuta `kubectl apply` con la bandera `--kustomize` o `-k` :

```shell
kubectl apply -k <directorio_de_kustomización>
```



## {{% heading "prerequisites" %}}


Instala [`kubectl`](/docs/tasks/tools/).

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}



<!-- steps -->

## Descripción General de Kustomize

Kustomize es una herramienta para personalizar configuraciones de Kubernetes. Ofrece características para manejar archivos de configuración de aplicaciones, tales como:

* Generar recursos a partir de otras fuentes.
* Establecer campos transversales para los recursos.
* Componer y personalizar colecciones de recursos.

### Generando Recursos

ConfigMaps y Secrets almacenan configuración o datos sensibles utilizados por otros objetos de Kubernetes, como los Pods. La fuente de verdad de los ConfigMaps o Secrets suele ser externa a un clúster, como un archivo `.properties` o un archivo de clave SSH.
Kustomize tiene `secretGenerator` y `configMapGenerator`, que generan Secret y ConfigMap a partir de archivos o literales.

#### configMapGenerator

Para generar un ConfigMap desde un archivo, añade una entrada en la lista  `files` en `configMapGenerator`.  Aquí tienes un ejemplo de cómo generar un ConfigMap con un elemento de datos de un archivo `.properties`:

```shell
# Crear un archivo application.properties
cat <<EOF >application.properties
FOO=Bar
EOF

cat <<EOF >./kustomization.yaml
configMapGenerator:
- name: example-configmap-1
  files:
  - application.properties
EOF
```

El ConfigMap generado se puede examinar con el siguiente comando:

```shell
kubectl kustomize ./
```

El ConfigMap generado es:

```yaml
apiVersion: v1
data:
  application.properties: |
    FOO=Bar
kind: ConfigMap
metadata:
  name: example-configmap-1-8mbdf7882g
```

Para generar un ConfigMap desde un archivo env, añade una entrada en la lista de `envs` en `configMapGenerator`. Aquí tienes un ejemplo de cómo generar un ConfigMap con un elemento de datos de un archivo `.env`:

```shell
# Crear un archivo .env
cat <<EOF >.env
FOO=Bar
EOF

cat <<EOF >./kustomization.yaml
configMapGenerator:
- name: example-configmap-1
  envs:
  - .env
EOF
```

El ConfigMap generado se puede examinar con el siguiente comando:

```shell
kubectl kustomize ./
```

El ConfigMap generado es:

```yaml
apiVersion: v1
data:
  FOO: Bar
kind: ConfigMap
metadata:
  name: example-configmap-1-42cfbf598f
```

{{< note >}}
Cada variable en el archivo `.env` se convierte en una clave separada en el ConfigMap que generas. Esto es diferente del ejemplo anterior, que incorpora un archivo llamado `application.properties` (y todas sus entradas) como el valor para una única clave.
{{< /note >}}

Los ConfigMaps también pueden generarse a partir de pares clave-valor literales. Para generar un ConfigMap a partir de una literal clave-valor, añade una entrada a la lista `literals` en configMapGenerator. Aquí hay un ejemplo de cómo generar un ConfigMap con un elemento de datos de un par clave-valor:

```shell
cat <<EOF >./kustomization.yaml
configMapGenerator:
- name: example-configmap-2
  literals:
  - FOO=Bar
EOF
```

El ConfigMap generado se puede verificar con el siguiente comando:

```shell
kubectl kustomize ./
```

El ConfigMap generado es:

```yaml
apiVersion: v1
data:
  FOO: Bar
kind: ConfigMap
metadata:
  name: example-configmap-2-g2hdhfc6tk
```

Para usar un ConfigMap generado en un Deployment, refiérelo por el nombre del configMapGenerator. Kustomize reemplazará automáticamente este nombre con el nombre generado.

Este es un ejemplo de un Deployment que utiliza un ConfigMap generado:

```yaml
# Crear un archivo application.properties
cat <<EOF >application.properties
FOO=Bar
EOF

cat <<EOF >deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-app
  labels:
    app: my-app
spec:
  selector:
    matchLabels:
      app: my-app
  template:
    metadata:
      labels:
        app: my-app
    spec:
      containers:
      - name: app
        image: my-app
        volumeMounts:
        - name: config
          mountPath: /config
      volumes:
      - name: config
        configMap:
          name: example-configmap-1
EOF

cat <<EOF >./kustomization.yaml
resources:
- deployment.yaml
configMapGenerator:
- name: example-configmap-1
  files:
  - application.properties
EOF
```

Genera el ConfigMap y Deployment:

```shell
kubectl kustomize ./
```

El Deployment generado hara referencia al ConfigMap generado por nombre:

```yaml
apiVersion: v1
data:
  application.properties: |
    FOO=Bar
kind: ConfigMap
metadata:
  name: example-configmap-1-g4hk9g2ff8
---
apiVersion: apps/v1
kind: Deployment
metadata:
  labels:
    app: my-app
  name: my-app
spec:
  selector:
    matchLabels:
      app: my-app
  template:
    metadata:
      labels:
        app: my-app
    spec:
      containers:
      - image: my-app
        name: app
        volumeMounts:
        - mountPath: /config
          name: config
      volumes:
      - configMap:
          name: example-configmap-1-g4hk9g2ff8
        name: config
```

#### secretGenerator

Puedes generar Secrets a partir de archivos o pares clave-valor literales. Para generar un Secret a partir de un archivo, añade una entrada a la lista `files` en `secretGenerator`. Aquí tienes un ejemplo de cómo generar un Secret con un elemento de datos de un archivo.

```shell
# Crea un archivo password.txt
cat <<EOF >./password.txt
username=admin
password=secret
EOF

cat <<EOF >./kustomization.yaml
secretGenerator:
- name: example-secret-1
  files:
  - password.txt
EOF
```

El Secret generado se vería de la siguiente manera:

```yaml
apiVersion: v1
data:
  password.txt: dXNlcm5hbWU9YWRtaW4KcGFzc3dvcmQ9c2VjcmV0Cg==
kind: Secret
metadata:
  name: example-secret-1-t2kt65hgtb
type: Opaque
```

Para generar un Secret a partir de una literal clave-valor, añade una entrada a la lista `literals` en `secretGenerator`. Aquí tienes un ejemplo de cómo generar un Secret con un elemento de datos de un par clave-valor.

```shell
cat <<EOF >./kustomization.yaml
secretGenerator:
- name: example-secret-2
  literals:
  - username=admin
  - password=secret
EOF
```

El Secret generado se verá de la siguiente manera:

```yaml
apiVersion: v1
data:
  password: c2VjcmV0
  username: YWRtaW4=
kind: Secret
metadata:
  name: example-secret-2-t52t6g96d8
type: Opaque
```

Al igual que los ConfigMaps, los Secrets generados pueden utilizarse en Deployments refiriéndose al nombre del secretGenerator.

```shell
# Crea un archivo password.txt 
cat <<EOF >./password.txt
username=admin
password=secret
EOF

cat <<EOF >deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-app
  labels:
    app: my-app
spec:
  selector:
    matchLabels:
      app: my-app
  template:
    metadata:
      labels:
        app: my-app
    spec:
      containers:
      - name: app
        image: my-app
        volumeMounts:
        - name: password
          mountPath: /secrets
      volumes:
      - name: password
        secret:
          secretName: example-secret-1
EOF

cat <<EOF >./kustomization.yaml
resources:
- deployment.yaml
secretGenerator:
- name: example-secret-1
  files:
  - password.txt
EOF
```

#### generatorOptions

Los ConfigMaps y Secrets generados tienen un sufijo de hash de contenido añadido. Esto asegura que se genere un nuevo ConfigMap o Secret cuando se cambian los contenidos. Para desactivar el comportamiento de añadir un sufijo, se puede utilizar `generatorOptions`. Además, es posible especificar opciones transversales para los ConfigMaps y Secrets generados.

```shell
cat <<EOF >./kustomization.yaml
configMapGenerator:
- name: example-configmap-3
  literals:
  - FOO=Bar
generatorOptions:
  disableNameSuffixHash: true
  labels:
    type: generated
  annotations:
    note: generated
EOF
```

Ejecuta `kubectl kustomize ./` para visualizar el ConfigMap generado:

```yaml
apiVersion: v1
data:
  FOO: Bar
kind: ConfigMap
metadata:
  annotations:
    note: generated
  labels:
    type: generated
  name: example-configmap-3
```

### Establecer campos transversales

Es bastante común establecer campos transversales para todos los recursos de Kubernetes en un proyecto.
Algunos casos de uso para establecer campos transversales:

* Establecer el mismo espacio de nombres para todos los Recursos
* Agregar el mismo prefijo o sufijo de nombre
* Agregar el mismo conjunto de etiquetas
* Agregar el mismo conjunto de anotaciones

Aquí hay un ejemplo:

```shell
# Crea un deployment.yaml
cat <<EOF >./deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
  labels:
    app: nginx
spec:
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx
EOF

cat <<EOF >./kustomization.yaml
namespace: my-namespace
namePrefix: dev-
nameSuffix: "-001"
commonLabels:
  app: bingo
commonAnnotations:
  oncallPager: 800-555-1212
resources:
- deployment.yaml
EOF
```

Ejecuta `kubectl kustomize ./` para ver que esos campos están todos establecidos en el Recurso Deployment:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  annotations:
    oncallPager: 800-555-1212
  labels:
    app: bingo
  name: dev-nginx-deployment-001
  namespace: my-namespace
spec:
  selector:
    matchLabels:
      app: bingo
  template:
    metadata:
      annotations:
        oncallPager: 800-555-1212
      labels:
        app: bingo
    spec:
      containers:
      - image: nginx
        name: nginx
```

### Componiendo y Personalizando Recursos

Es común componer un conjunto de recursos en un proyecto y gestionarlos dentro del mismo archivo o directorio.

Kustomize ofrece la composición de recursos desde diferentes archivos y la aplicación de parches u otras personalizaciones a ellos.

#### Composición

Kustomize admite la composición de diferentes recursos. El campo `resources`, en el archivo `kustomization.yaml`, define la lista de recursos para incluir en una configuración. Establece la ruta al archivo de configuración de un recurso en la lista `resources`.

Aquí hay un ejemplo de una aplicación NGINX compuesta por un Deployment y un Service:

```shell
# Crea un archivo deployment.yaml 
cat <<EOF > deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-nginx
spec:
  selector:
    matchLabels:
      run: my-nginx
  replicas: 2
  template:
    metadata:
      labels:
        run: my-nginx
    spec:
      containers:
      - name: my-nginx
        image: nginx
        ports:
        - containerPort: 80
EOF

# Crea un archivo service.yaml 
cat <<EOF > service.yaml
apiVersion: v1
kind: Service
metadata:
  name: my-nginx
  labels:
    run: my-nginx
spec:
  ports:
  - port: 80
    protocol: TCP
  selector:
    run: my-nginx
EOF

# Crea un  kustomization.yaml que los integra
cat <<EOF >./kustomization.yaml
resources:
- deployment.yaml
- service.yaml
EOF
```

Los Recursos de `kubectl kustomize ./` contienen tanto los objetos de Deployment como los de Service.

#### Personalizando

Los parches pueden usarse para aplicar diferentes personalizaciones a los recursos. Kustomize admite diferentes mecanismos de parcheo a través de `patchesStrategicMerge` y `patchesJson6902`. `patchesStrategicMerge` es una lista de rutas de archivo. Cada archivo debe resolverse en un [parche de fusión estratégica](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-api-machinery/strategic-merge-patch.md). Los nombres dentro de los parches deben coincidir con los nombres de recursos que ya están cargados. Se recomiendan pequeños parches que hagan una sola cosa. Por ejemplo, crear un parche para aumentar el número de réplicas del Deployment y otro parche para establecer el límite de memoria.

```shell
# Crea un archivo deployment.yaml
cat <<EOF > deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-nginx
spec:
  selector:
    matchLabels:
      run: my-nginx
  replicas: 2
  template:
    metadata:
      labels:
        run: my-nginx
    spec:
      containers:
      - name: my-nginx
        image: nginx
        ports:
        - containerPort: 80
EOF

# Crea un parche increase_replicas.yaml
cat <<EOF > increase_replicas.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-nginx
spec:
  replicas: 3
EOF

# Crea otro parche set_memory.yaml
cat <<EOF > set_memory.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-nginx
spec:
  template:
    spec:
      containers:
      - name: my-nginx
        resources:
          limits:
            memory: 512Mi
EOF

cat <<EOF >./kustomization.yaml
resources:
- deployment.yaml
patchesStrategicMerge:
- increase_replicas.yaml
- set_memory.yaml
EOF
```

Ejecuta `kubectl kustomize ./` para visualizar el Deployment:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-nginx
spec:
  replicas: 3
  selector:
    matchLabels:
      run: my-nginx
  template:
    metadata:
      labels:
        run: my-nginx
    spec:
      containers:
      - image: nginx
        name: my-nginx
        ports:
        - containerPort: 80
        resources:
          limits:
            memory: 512Mi
```

No todos los recursos o campos admiten parches de fusión estratégica. Para admitir la modificación de campos arbitrarios en recursos arbitrarios,
Kustomize ofrece la implementacion a través de  [JSON patch](https://tools.ietf.org/html/rfc6902) `patchesJson6902`.
Para encontrar el Recurso correcto para un parche Json, el grupo, versión, tipo y nombre de ese recurso necesitan ser especificados en `kustomization.yaml`. Por ejemplo, aumentar el número de réplicas de un objeto de Deployment también se puede hacer a través de  `patchesJson6902`.

```shell
# Crea un archivo deployment.yaml 
cat <<EOF > deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-nginx
spec:
  selector:
    matchLabels:
      run: my-nginx
  replicas: 2
  template:
    metadata:
      labels:
        run: my-nginx
    spec:
      containers:
      - name: my-nginx
        image: nginx
        ports:
        - containerPort: 80
EOF

# Crea un parche en json
cat <<EOF > patch.yaml
- op: replace
  path: /spec/replicas
  value: 3
EOF

# Crea un  kustomization.yaml
cat <<EOF >./kustomization.yaml
resources:
- deployment.yaml

patchesJson6902:
- target:
    group: apps
    version: v1
    kind: Deployment
    name: my-nginx
  path: patch.yaml
EOF
```

Ejecuta `kubectl kustomize ./` para ver que el campo `replicas` está actualizado:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-nginx
spec:
  replicas: 3
  selector:
    matchLabels:
      run: my-nginx
  template:
    metadata:
      labels:
        run: my-nginx
    spec:
      containers:
      - image: nginx
        name: my-nginx
        ports:
        - containerPort: 80
```

Además de los parches, Kustomize también ofrece personalizar imágenes de contenedores o inyectar valores de campos de otros objetos en contenedores sin crear parches. Por ejemplo, puedes cambiar la imagen utilizada dentro de los contenedores especificando la nueva imagen en el campo `images` en `kustomization.yaml`.

```shell
cat <<EOF > deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-nginx
spec:
  selector:
    matchLabels:
      run: my-nginx
  replicas: 2
  template:
    metadata:
      labels:
        run: my-nginx
    spec:
      containers:
      - name: my-nginx
        image: nginx
        ports:
        - containerPort: 80
EOF

cat <<EOF >./kustomization.yaml
resources:
- deployment.yaml
images:
- name: nginx
  newName: my.image.registry/nginx
  newTag: 1.4.0
EOF
```
Ejecuta `kubectl kustomize ./` para ver que el campo `image` ha sido actualizado:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-nginx
spec:
  replicas: 2
  selector:
    matchLabels:
      run: my-nginx
  template:
    metadata:
      labels:
        run: my-nginx
    spec:
      containers:
      - image: my.image.registry/nginx:1.4.0
        name: my-nginx
        ports:
        - containerPort: 80
```

A veces, la aplicación que se ejecuta en un Pod puede necesitar usar valores de configuración de otros objetos. Por ejemplo, un Pod de un objeto de Deployment necesita leer el nombre del Service correspondiente desde Env o como un argumento de comando.

Dado que el nombre del Service puede cambiar a medida que se agrega `namePrefix` o `nameSuffix` en el archivo `kustomization.yaml`. No se recomienda codificar de manera fija el nombre del Service en el argumento del comando. Para este uso, Kustomize puede inyectar el nombre del Service en los contenedores a través de vars.

```shell
# Crea un archivo deployment.yaml (citando el delimitador de documento aquí)
cat <<'EOF' > deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-nginx
spec:
  selector:
    matchLabels:
      run: my-nginx
  replicas: 2
  template:
    metadata:
      labels:
        run: my-nginx
    spec:
      containers:
      - name: my-nginx
        image: nginx
        command: ["start", "--host", "$(MY_SERVICE_NAME)"]
EOF

# Crea un archivo service.yaml 
cat <<EOF > service.yaml
apiVersion: v1
kind: Service
metadata:
  name: my-nginx
  labels:
    run: my-nginx
spec:
  ports:
  - port: 80
    protocol: TCP
  selector:
    run: my-nginx
EOF

cat <<EOF >./kustomization.yaml
namePrefix: dev-
nameSuffix: "-001"

resources:
- deployment.yaml
- service.yaml

vars:
- name: MY_SERVICE_NAME
  objref:
    kind: Service
    name: my-nginx
    apiVersion: v1
EOF
```

Ejecuta `kubectl kustomize ./` para ver que el nombre del Service inyectado en la sección de contaierns es `dev-my-nginx-001`:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: dev-my-nginx-001
spec:
  replicas: 2
  selector:
    matchLabels:
      run: my-nginx
  template:
    metadata:
      labels:
        run: my-nginx
    spec:
      containers:
      - command:
        - start
        - --host
        - dev-my-nginx-001
        image: nginx
        name: my-nginx
```

## Bases y Overlays


Kustomize tiene los conceptos de **bases** y **overlays**. Una **base** es un directorio con un `kustomization.yaml`, que contiene un conjunto de recursos y personalización asociada. Una **base** puede ser un directorio local o un directorio de un repositorio remoto, siempre que haya un ``kustomization.yaml`` presente dentro. Un **overlay** es un directorio con un ``kustomization.yaml`` que se refiere a otros directorios de kustomization como sus `bases`. Una **base** no tiene conocimiento de un **overlay** y puede ser utilizada en múltiples **overlays**. Un **overlay** puede tener múltiples **bases** y compone todos los recursos de las **bases** y también puede tener personalizaciones encima de ellos.

Aquí hay un ejemplo de una base:

```shell

# Crea un directorio que tendrá la **base**

mkdir base

# Crea el archivo base/deployment.yaml
cat <<EOF > base/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-nginx
spec:
  selector:
    matchLabels:
      run: my-nginx
  replicas: 2
  template:
    metadata:
      labels:
        run: my-nginx
    spec:
      containers:
      - name: my-nginx
        image: nginx
EOF

# Crea el archivo base/service.yaml 
cat <<EOF > base/service.yaml
apiVersion: v1
kind: Service
metadata:
  name: my-nginx
  labels:
    run: my-nginx
spec:
  ports:
  - port: 80
    protocol: TCP
  selector:
    run: my-nginx
EOF
# Crea un archivo base/kustomization.yaml
cat <<EOF > base/kustomization.yaml
resources:
- deployment.yaml
- service.yaml
EOF
```

Esta **base** puede ser utilizada en múltiples **overlays**. Puedes agregar diferentes `namePrefix` u otros campos transversales en diferentes **overlays**. Aquí hay dos **overlays** utilizando la misma **base**.

```shell
mkdir dev
cat <<EOF > dev/kustomization.yaml
resources:
- ../base
namePrefix: dev-
EOF

mkdir prod
cat <<EOF > prod/kustomization.yaml
resources:
- ../base
namePrefix: prod-
EOF
```

## Cómo aplicar/ver/eliminar objetos usando Kustomize

Usa `--kustomize` o `-k` en comandos de `kubectl` para reconocer recursos gestionados por 
`kustomization.yaml`.
Nota que `-k` debe apuntar a un directorio de kustomization, tal como:

```shell
kubectl apply -k <kustomization directory>/
```

Dando como resultado el siguiente`kustomization.yaml`,

```shell
# Crea un archivo deployment.yaml 
cat <<EOF > deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-nginx
spec:
  selector:
    matchLabels:
      run: my-nginx
  replicas: 2
  template:
    metadata:
      labels:
        run: my-nginx
    spec:
      containers:
      - name: my-nginx
        image: nginx
        ports:
        - containerPort: 80
EOF

# Crea un archivo kustomization.yaml
cat <<EOF >./kustomization.yaml
namePrefix: dev-
commonLabels:
  app: my-nginx
resources:
- deployment.yaml
EOF
```

Ejecuta el siguiente comando para aplicar el objeto de Deployment `dev-my-nginx`:

```shell
> kubectl apply -k ./
deployment.apps/dev-my-nginx created
```

Ejecuta uno de los siguientes comandos para ver el objeto de Deployment  `dev-my-nginx`:

```shell
kubectl get -k ./
```

```shell
kubectl describe -k ./
```

Ejecuta el siguiente comando para comparar el objecto Deployment `dev-my-nginx` contra el 
estado en el que estaría el clúster si se aplicara el manifiesto:
```shell
kubectl diff -k ./
```

Ejecuta el siguiente comando para eliminar el objeto de Deployment  `dev-my-nginx`:

```shell
> kubectl delete -k ./
deployment.apps "dev-my-nginx" deleted
```

## Kustomize Feature List

| Campo                 | Tipo                                                                                                         | Explicación                                                                        |
|-----------------------|--------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------|
| namespace             | string                                                                                                       | Agregar namespace a todos los recursos                                             |
| namePrefix            | string                                                                                                       | El valor de este campo se antepone a los nombres de todos los recursos             |
| nameSuffix            | string                                                                                                       | El valor de este campo se añade al final de los nombres de todos los recursos      |
| commonLabels          | map[string]string                                                                                            | Etiquetas para agregar a los  recursos y selectores.                               |
| commonAnnotations     | map[string]string                                                                                            | Anotaciones para agregar a todos los recursos                                      |
| resources             | []string                                                                                                     | Cada entrada en esta lista debe resolverse en un archivo de configuración de recurso existente |
| configMapGenerator    | [][ConfigMapArgs](https://github.com/kubernetes-sigs/kustomize/blob/master/api/types/configmapargs.go#L7)    | Cada entrada en esta lista genera un ConfigMap                                     |
| secretGenerator       | [][SecretArgs](https://github.com/kubernetes-sigs/kustomize/blob/master/api/types/secretargs.go#L7)          | Cada entrada en esta lista genera un Secret                                         |
| generatorOptions      | [GeneratorOptions](https://github.com/kubernetes-sigs/kustomize/blob/master/api/types/generatoroptions.go#L7) | Modifica comportamientos de todos los generadores de ConfigMap y Secret           |
| bases                 | []string                                                                                                     | Cada entrada en esta lista debe resolverse en un directorio que contenga un archivo kustomization.yaml |
| patchesStrategicMerge | []string                                                                                                     | Cada entrada en esta lista debe resolver un parche de fusión estratégica de un objeto de Kubernetes |
| patchesJson6902       | [][Patch](https://github.com/kubernetes-sigs/kustomize/blob/master/api/types/patch.go#L10)                   | Cada entrada en esta lista debe resolverse en un objeto de Kubernetes y un parche Json |
| vars                  | [][Var](https://github.com/kubernetes-sigs/kustomize/blob/master/api/types/var.go#L19)                       | Cada entrada es para capturar texto del campo de un recurso                            |
| images                | [][Image](https://github.com/kubernetes-sigs/kustomize/blob/master/api/types/image.go#L8)                    | Cada entrada es para modificar el nombre, las etiquetas y/o el digesto de una imagen sin crear parches |
| configurations        | []string                                                                                                     | Cada entrada en esta lista debe resolverse en un archivo que contenga [Configuraciones de transformador de Kustomize](https://github.com/kubernetes-sigs/kustomize/tree/master/examples/transformerconfigs) |
| crds                  | []string                                                                                                     | Cada entrada en esta lista debería resolver a un archivo de definición OpenAPI para los tipos de Kubernetes. |

## {{% heading "whatsnext" %}}


* [Kustomize](https://github.com/kubernetes-sigs/kustomize)
* [Documentación de Kubectl](https://kubectl.docs.kubernetes.io)
* [Referencia de Comando de Kubectl](/docs/reference/generated/kubectl/kubectl-commands/)
* [Referencia de Kubernetes API](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/)
