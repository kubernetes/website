---
title: Entender los Objetos de Kubernetes
content_template: templates/concept
weight: 10
card: 
  name: concepts
  weight: 40
---

{{% capture overview %}}
Esta página explica cómo se representan los objetos de Kubernetes en la API de Kubernetes, y cómo puedes definirlos en formato `.yaml`.
{{% /capture %}}

{{% capture body %}}
## Entender los Objetos de Kubernetes

Los *Objetos de Kubernetes* son entidades persistentes dentro del sistema de Kubernetes. Kubernetes utiliza estas entidades para representar el estado de tu clúster. Específicamente, pueden describir:

* Qué aplicaciones corren en contenedores (y en qué nodos)
* Los recursos disponibles para dichas aplicaciones
* Las políticas acerca de cómo dichas aplicaciones se comportan, como las políticas de reinicio, actualización, y tolerancia a fallos

Un objeto de Kubernetes es un "registro de intención" -- una vez que has creado el objeto, el sistema de Kubernetes se pondrá en marcha para asegurar que el objeto existe. Al crear un objeto, en realidad le estás diciendo al sistema de Kubernetes cómo quieres que sea la carga de trabajo de tu clúster; esto es, el **estado deseado** de tu clúster.

Para trabajar con los objetos de Kubernetes -- sea para crearlos, modificarlos, o borrarlos -- necesitarás usar la [API de Kubernetes](/docs/concepts/overview/kubernetes-api/). Cuando utilizas el interfaz de línea de comandos `kubectl`, por ejemplo, este realiza las llamadas necesarias a la API de Kubernetes en tu lugar. También puedes usar la API de Kubernetes directamente desde tus programas utilizando alguna de las [Librerías de Cliente](/docs/reference/using-api/client-libraries/).

### Alcance y Estado de un Objeto

Cada objeto de Kubernetes incluye dos campos como objetos anidados que determinan la configuración del objeto: el campo de objeto *spec* y el campo de objeto *status*. El campo *spec*, que es obligatorio, describe el *estado deseado* del objeto -- las características que quieres que tenga el objeto. El campo *status* describe el *estado actual* del objeto, y se suministra y actualiza directamente por el sistema de Kubernetes. En cualquier momento, el Plano de Control de Kubernetes gestiona de forma activa el estado actual del objeto para que coincida con el estado deseado requerido.


Por ejemplo, un Deployment de Kubernetes es un objeto que puede representar una aplicación de tu clúster. Cuando creas el Deployment, puedes especificar en el spec del Deployment que quieres correr tres réplicas de la aplicación. El sistema de Kubernetes lee el spec del Deployment y comienza a instanciar réplicas de tu aplicación -- actualizando el estado para conciliarlo con tu spec. Si cualquiera de las instancias falla (un cambio de estado), el sistema de Kubernetes soluciona la diferencia entre la spec y el estado llevando a cabo una correción -- en este caso, iniciando otra instancia de reemplazo.

Para obtener más información acerca de la spec, el status, y los metadatos de los objetos, echa un vistazo a las [Normas de la API de Kubernetes](https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md).

### Describir un Objeto de Kubernetes

Cuando creas un objeto en Kubernetes, debes especificar la spec del objeto que describe su estado deseado, así como información básica del mismo (como el nombre). Cuando usas la API de Kubernetes para crear el objeto (bien de forma directa o usando `kubectl`), dicha petición a la API debe incluir toda la información en formato JSON en el cuerpo de la petición. **A menudo, le proporcionas la información a `kubectl` como un archivo .yaml.** `kubectl` convierte esa información a JSON cuando realiza la llamada a la API.

Aquí hay un ejemplo de un archivo `.yaml` que muestra los campos requeridos y la spec del objeto Deployment de Kubernetes:

{{< codenew file="application/deployment.yaml" >}}

Una forma de crear un Deployment utilizando un archivo `.yaml` como el indicado arriba sería ejecutar el comando
[`kubectl apply`](/docs/reference/generated/kubectl/kubectl-commands#apply) 
en el interfaz de línea de comandos, pasándole el archivo `.yaml` como argumento. Aquí tienes un ejemplo de cómo hacerlo:

```shell
kubectl apply -f https://k8s.io/examples/application/deployment.yaml --record
```

La salida del comando sería algo parecido a esto:

```shell
deployment.apps/nginx-deployment created
```

### Campos requeridos

En el archivo `.yaml` del objeto de Kubernetes que quieras crear, obligatoriamente tendrás que indicar los valores de los siguientes campos (como mínimo):

* `apiVersion` - Qué versión de la API de Kubernetes estás usando para crear este objeto
* `kind` - Qué clase de objeto quieres crear
* `metadata` - Datos que permiten identificar unívocamente al objeto, incluyendo una cadena de texto para el `name`, UID, y opcionalmente el `namespace`

También deberás indicar el campo `spec` del objeto. El formato del campo `spec` es diferente según el tipo de objeto de Kubernetes, y contiene campos anidados específicos de cada objeto. La [Referencia de la API de Kubernetes](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/) puede servirte de ayuda para encontrar el formato de la spec para cada uno de los objetos que puedes crear usando Kubernetes.
Por ejemplo, el formato de la `spec` para un objeto de tipo `Pod` lo puedes encontrar 
[aquí](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#podspec-v1-core),
y el formato de la `spec` para un objeto de tipo `Deployment` lo puedes encontrar
[aquí](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#deploymentspec-v1-apps).

{{% /capture %}}

{{% capture whatsnext %}}
* Aprender más acerca de los objetos básicos más importantes de Kubernetes, como el [Pod](/docs/concepts/workloads/pods/pod-overview/).
{{% /capture %}}


