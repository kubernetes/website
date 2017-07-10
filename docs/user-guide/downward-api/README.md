Following these examples, you will create a pod with a container that consumes the pod's name,
namespace, and resource values using the [downward API](/docs/tasks/inject-data-application/downward-api-volume-expose-pod-information/).

## Step Zero: Prerequisites

This example assumes you have a Kubernetes cluster installed and running, and that you have
installed the `kubectl` command line tool somewhere in your path. Please see [pick the right solution](/docs/setup/pick-right-solution/) for installation instructions for your platform.

## Step One: Create the pod

Containers consume the downward API using environment variables.  The downward API allows
containers to be injected with the name and namespace of the pod the container is in.

Use the [`dapi-pod.yaml`](dapi-pod.yaml) file to create a Pod with a container that consumes the
downward API.

```shell
$ kubectl create -f docs/user-guide/downward-api/dapi-pod.yaml
```

### Examine the logs

This pod runs the `env` command in a container that consumes the downward API.  You can grep
through the pod logs to see that the pod was injected with the correct values:

```shell
$ kubectl logs dapi-test-pod | grep POD_
2015-04-30T20:22:18.568024817Z MY_POD_NAME=dapi-test-pod
2015-04-30T20:22:18.568087688Z MY_POD_NAMESPACE=default
2015-04-30T20:22:18.568092435Z MY_POD_IP=10.0.1.6
```

## Example of environment variables with container resources

Use the [`dapi-container-resources.yaml`](dapi-container-resources.yaml) file to create a Pod
with a container that consumes the downward API exposing the container's resources.

```shell
$ kubectl create -f docs/user-guide/downward-api/dapi-container-resources.yaml
```

### Examine the logs

Grep through the pod logs to see that the pod was injected with the correct values:

```shell
$ kubectl logs dapi-test-pod | grep MY_
MY_MEM_LIMIT=67108864
MY_CPU_LIMIT=1
MY_MEM_REQUEST=33554432
MY_CPU_REQUEST=1
```
