---
title: Expose Pod Information to Containers Through Environment Variables
content_type: task
weight: 30
---

<!-- overview -->

This page shows how a Pod can use environment variables to expose information
about itself to containers running in the Pod, using the _downward API_.
You can use environment variables to expose Pod fields, container fields, or both.

In Kubernetes, there are two ways to expose Pod and container fields to a running container:

* _Environment variables_, as explained in this task
* [Volume files](/docs/tasks/inject-data-application/downward-api-volume-expose-pod-information/)

Together, these two ways of exposing Pod and container fields are called the
downward API.

As Services are the primary mode of communication between containerized applications managed by Kubernetes, 
it is helpful to be able to discover them at runtime. 

Read more about accessing Services [here](/docs/tutorials/services/connect-applications-service/#accessing-the-service).

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

<!-- steps -->

## Use Pod fields as values for environment variables

In this part of exercise, you create a Pod that has one container, and you
project Pod-level fields into the running container as environment variables.

{{% code_sample file="pods/inject/dapi-envars-pod.yaml" %}}

In that manifest, you can see five environment variables. The `env`
field is an array of
environment variable definitions.
The first element in the array specifies that the `MY_NODE_NAME` environment
variable gets its value from the Pod's `spec.nodeName` field. Similarly, the
other environment variables get their names from Pod fields.

{{< note >}}
The fields in this example are Pod fields. They are not fields of the
container in the Pod.
{{< /note >}}

Create the Pod:

```shell
kubectl apply -f https://k8s.io/examples/pods/inject/dapi-envars-pod.yaml
```

Verify that the container in the Pod is running:

```shell
# If the new Pod isn't yet healthy, rerun this command a few times.
kubectl get pods
```

View the container's logs:

```shell
kubectl logs dapi-envars-fieldref
```

The output shows the values of selected environment variables:

```
minikube
dapi-envars-fieldref
default
172.17.0.4
default
```

To see why these values are in the log, look at the `command` and `args` fields
in the configuration file. When the container starts, it writes the values of
five environment variables to stdout. It repeats this every ten seconds.

Next, get a shell into the container that is running in your Pod:

```shell
kubectl exec -it dapi-envars-fieldref -- sh
```

In your shell, view the environment variables:

```shell
# Run this in a shell inside the container
printenv
```

The output shows that certain environment variables have been assigned the
values of Pod fields:

```
MY_POD_SERVICE_ACCOUNT=default
...
MY_POD_NAMESPACE=default
MY_POD_IP=172.17.0.4
...
MY_NODE_NAME=minikube
...
MY_POD_NAME=dapi-envars-fieldref
```

## Use container fields as values for environment variables

In the preceding exercise, you used information from Pod-level fields as the values
for environment variables.
In this next exercise, you are going to pass fields that are part of the Pod
definition, but taken from the specific
[container](/docs/reference/kubernetes-api/workload-resources/pod-v1/#Container)
rather than from the Pod overall.

Here is a manifest for another Pod that again has just one container:

{{% code_sample file="pods/inject/dapi-envars-container.yaml" %}}

In this manifest, you can see four environment variables. The `env`
field is an array of
environment variable definitions.
The first element in the array specifies that the `MY_CPU_REQUEST` environment
variable gets its value from the `requests.cpu` field of a container named
`test-container`. Similarly, the other environment variables get their values
from fields that are specific to this container.

Create the Pod:

```shell
kubectl apply -f https://k8s.io/examples/pods/inject/dapi-envars-container.yaml
```

Verify that the container in the Pod is running:

```shell
# If the new Pod isn't yet healthy, rerun this command a few times.
kubectl get pods
```

View the container's logs:

```shell
kubectl logs dapi-envars-resourcefieldref
```

The output shows the values of selected environment variables:

```
1
1
33554432
67108864
```

## {{% heading "whatsnext" %}}


* Read [Defining Environment Variables for a Container](/docs/tasks/inject-data-application/define-environment-variable-container/)
* Read the [`spec`](/docs/reference/kubernetes-api/workload-resources/pod-v1/#PodSpec)
  API definition for Pod. This includes the definition of Container (part of Pod).
* Read the list of [available fields](/docs/concepts/workloads/pods/downward-api/#available-fields) that you
  can expose using the downward API.

Read about Pods, containers and environment variables in the legacy API reference:

* [PodSpec](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#podspec-v1-core)
* [Container](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#container-v1-core)
* [EnvVar](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#envvar-v1-core)
* [EnvVarSource](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#envvarsource-v1-core)
* [ObjectFieldSelector](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#objectfieldselector-v1-core)
* [ResourceFieldSelector](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#resourcefieldselector-v1-core)
