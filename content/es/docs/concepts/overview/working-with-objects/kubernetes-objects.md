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

### Alcance y Status de un Objeto

Every Kubernetes object includes two nested object fields that govern the object's configuration: the object *spec* and the object *status*. The *spec*, which you must provide, describes your *desired state* for the object--the characteristics that you want the object to have. The *status* describes the *actual state* of the object, and is supplied and updated by the Kubernetes system. At any given time, the Kubernetes Control Plane actively manages an object's actual state to match the desired state you supplied.


For example, a Kubernetes Deployment is an object that can represent an application running on your cluster. When you create the Deployment, you might set the Deployment spec to specify that you want three replicas of the application to be running. The Kubernetes system reads the Deployment spec and starts three instances of your desired application--updating the status to match your spec. If any of those instances should fail (a status change), the Kubernetes system responds to the difference between spec and status by making a correction--in this case, starting a replacement instance.

For more information on the object spec, status, and metadata, see the [Kubernetes API Conventions](https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md).

### Describing a Kubernetes Object

When you create an object in Kubernetes, you must provide the object spec that describes its desired state, as well as some basic information about the object (such as a name). When you use the Kubernetes API to create the object (either directly or via `kubectl`), that API request must include that information as JSON in the request body. **Most often, you provide the information to `kubectl` in a .yaml file.** `kubectl` converts the information to JSON when making the API request.

Here's an example `.yaml` file that shows the required fields and object spec for a Kubernetes Deployment:

{{< codenew file="application/deployment.yaml" >}}

One way to create a Deployment using a `.yaml` file like the one above is to use the
[`kubectl apply`](/docs/reference/generated/kubectl/kubectl-commands#apply) command
in the `kubectl` command-line interface, passing the `.yaml` file as an argument. Here's an example:

```shell
kubectl apply -f https://k8s.io/examples/application/deployment.yaml --record
```

The output is similar to this:

```shell
deployment.apps/nginx-deployment created
```

### Required Fields

In the `.yaml` file for the Kubernetes object you want to create, you'll need to set values for the following fields:

* `apiVersion` - Which version of the Kubernetes API you're using to create this object
* `kind` - What kind of object you want to create
* `metadata` - Data that helps uniquely identify the object, including a `name` string, UID, and optional `namespace`

You'll also need to provide the object `spec` field. The precise format of the object `spec` is different for every Kubernetes object, and contains nested fields specific to that object. The [Kubernetes API Reference](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/) can help you find the spec format for all of the objects you can create using Kubernetes.
For example, the `spec` format for a `Pod` object can be found
[here](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#podspec-v1-core),
and the `spec` format for a `Deployment` object can be found
[here](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#deploymentspec-v1-apps).

{{% /capture %}}

{{% capture whatsnext %}}
* Learn about the most important basic Kubernetes objects, such as [Pod](/docs/concepts/workloads/pods/pod-overview/).
{{% /capture %}}


