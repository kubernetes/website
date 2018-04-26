---
title: Expose Pod Information to Containers Through Environment Variables
---

{% capture overview %}

This page shows how a Pod can use environment variables to expose information
about itself to Containers running in the Pod. Environment variables can expose
Pod fields and Container fields.

{% endcapture %}


{% capture prerequisites %}

{% include task-tutorial-prereqs.md %}

{% endcapture %}


{% capture steps %}

## The Downward API

There are two ways to expose Pod and Container fields to a running Container:

* Environment variables
* [DownwardAPIVolumeFiles](/docs/reference/generated/kubernetes-api/{{page.version}}/#downwardapivolumefile-v1-core)

Together, these two ways of exposing Pod and Container fields are called the
*Downward API*.


## Use Pod fields as values for environment variables

In this exercise, you create a Pod that has one Container. Here is the
configuration file for the Pod:

{% include code.html language="yaml" file="dapi-envars-pod.yaml" ghlink="/docs/tasks/inject-data-application/dapi-envars-pod.yaml" %}

In the configuration file, you can see five environment variables. The `env`
field is an array of
[EnvVars](/docs/reference/generated/kubernetes-api/{{page.version}}/#envvar-v1-core).
The first element in the array specifies that the `MY_NODE_NAME` environment
variable gets its value from the Pod's `spec.nodeName` field. Similarly, the
other environment variables get their names from Pod fields.

**Note:** The fields in this example are Pod fields. They are not fields of the
Container in the Pod.
{: .note}

Create the Pod:

```shell
kubectl create -f https://k8s.io/docs/tasks/inject-data-application/dapi-envars-pod.yaml
```

Verify that the Container in the Pod is running:

```
kubectl get pods
```

View the Container's logs:

```
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
in the configuration file. When the Container starts, it writes the values of
five environment variables to stdout. It repeats this every ten seconds.

Next, get a shell into the Container that is running in your Pod:

```
kubectl exec -it dapi-envars-fieldref -- sh
```

In your shell, view the environment variables:

```
/# printenv
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

## Use Container fields as values for environment variables

In the preceding exercise, you used Pod fields as the values for environment
variables. In this next exercise, you use Container fields as the values for
environment variables. Here is the configuration file for a Pod that has one
container:

{% include code.html language="yaml" file="dapi-envars-container.yaml" ghlink="/docs/tasks/inject-data-application/dapi-envars-container.yaml" %}

In the configuration file, you can see four environment variables. The `env`
field is an array of
[EnvVars](/docs/reference/generated/kubernetes-api/{{page.version}}/#envvar-v1-core).
The first element in the array specifies that the `MY_CPU_REQUEST` environment
variable gets its value from the `requests.cpu` field of a Container named
`test-container`. Similarly, the other environment variables get their values
from Container fields.

Create the Pod:

```shell
kubectl create -f https://k8s.io/docs/tasks/inject-data-application/dapi-envars-container.yaml
```

Verify that the Container in the Pod is running:

```
kubectl get pods
```

View the Container's logs:

```
kubectl logs dapi-envars-resourcefieldref
```

The output shows the values of selected environment variables:

```
1
1
33554432
67108864
```

{% endcapture %}

{% capture whatsnext %}

* [Defining Environment Variables for a Container](/docs/tasks/inject-data-application/define-environment-variable-container/)
* [PodSpec](/docs/reference/generated/kubernetes-api/{{page.version}}/#podspec-v1-core)
* [Container](/docs/reference/generated/kubernetes-api/{{page.version}}/#container-v1-core)
* [EnvVar](/docs/reference/generated/kubernetes-api/{{page.version}}/#envvar-v1-core)
* [EnvVarSource](/docs/reference/generated/kubernetes-api/{{page.version}}/#envvarsource-v1-core)
* [ObjectFieldSelector](/docs/reference/generated/kubernetes-api/{{page.version}}/#objectfieldselector-v1-core)
* [ResourceFieldSelector](/docs/reference/generated/kubernetes-api/{{page.version}}/#resourcefieldselector-v1-core)

{% endcapture %}


{% include templates/task.md %}

