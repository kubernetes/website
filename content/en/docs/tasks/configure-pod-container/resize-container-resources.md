---
title: Resize CPU and Memory Resources assigned to Containers of a Pod
content_template: templates/task
weight: 20
---

{{% capture overview %}}

THIS IS A PLACEHOLDER DOC - A WIP.

This page shows how to resize a CPU and memory resources assigned to containers
of a running pod without restarting the pod or its containers.

Kubernetes allocates resources on a node when a pod {{< glossary_tooltip text="Pod" term_id="pod" >}}
is started, and limits its resource use based on requests and limits specified
in the pod's containers {{< glossary_tooltip text="Container" term_id="container" >}}.

A container's resource **requests** and **limits** are now **mutable** for CPU
and memory resource types. They now represent **desired** CPU and memory values.

{{% /capture %}}

{{% capture prerequisites %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

This page assumes you are familiar with Quality of Service {{< glossary_tooltip text="QoS" term_id="qos-class" >}} for Pods.

{{% /capture %}}

{{% capture steps %}}

## Container Resize Policies

Resize policies allow for a more fine-grained control over how pod's containers
are resized for CPU and memory resource types. For example, the container's
application may be able to handle CPU resources resized while it continues to
run, but resizing memory limits may require that the container be restarted.

To enable this, container specification allows specifying  **resizePolicy**.
The following container resize policies can be specified for CPU and memory:
* *RestartNotRequired*: Resize the container's resources while it is running.
* *Restart*: Restart the container and apply the new resources on restart.

If resizePolicy is not specified, it defaults to *RestartNotRequired*.

{{< note >}}
If the pod's restartPolicy is 'Never', resize policy must be set to RestartNotRequired
for all containers in the pod.
{{< /note >}}

Below example shows a pod whose container's CPU can be resized live, but memory
resize memory requires that the container be restarted.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: qos-demo
  namespace: qos-example
spec:
  containers:
  - name: qos-demo-ctr
    image: nginx
    resizePolicy:
    - policy: RestartNotRequired
      resourceName: cpu
    - policy: Restart
      resourceName: memory
    resources:
      limits:
        memory: "200Mi"
        cpu: "700m"
      requests:
        memory: "200Mi"
        cpu: "700m"
```

{{< note >}}
In the above example, if desired resources for both CPU and memory have changed,
the container will be restarted in order to resize its memory.
{{< /note >}}

## Create a pod with resources

You can create a Guaranteed or Burstable QoS class pod by specifying requests
and/or limits for a pod's containers.

Consider the following configuration file for a pod that has one container.

{{< codenew file="pods/qos/qos-pod.yaml" >}}

Create the pod in qos-example namespace:

```shell
kubectl create namespace qos-example
kubectl create -f https://k8s.io/examples/pods/qos/qos-pod.yaml
```

This is classified as a Guaranteed QoS class pod requesting 700m CPU and 200Mi
memory.

View detailed information about the pod:

```shell
kubectl get pod qos-demo --output=yaml --namespace=qos-example
```

Also notice that the values of resizePolicy defaulted to RestartNotRequired,
indicating that CPU and memory can be resized while container is running.

```yaml
spec:
  containers:
    ...
    resizePolicy:
    - policy: RestartNotRequired
      resourceName: cpu
    - policy: RestartNotRequired
      resourceName: memory
    resources:
      limits:
        cpu: 700m
        memory: 200Mi
      requests:
        cpu: 700m
        memory: 200Mi
...
  containerStatuses:
...
    name: qos-demo-ctr
    ready: true
...
    resourcesAllocated:
      cpu: 700m
      memory: 200Mi
    resources:
      limits:
        cpu: 700m
        memory: 200Mi
      requests:
        cpu: 700m
        memory: 200Mi
    restartCount: 0
    started: true
...
  qosClass: Guaranteed
```

## Updating the pod's resources

Let's say the CPU needs have increased, and 800m CPU is now desired. This is
typically determined, and may be programmatically applied, by an entity such as
Vertical Pod Autoscaler.

{{< note >}}
While you can change a pod's requests and limits to express new desired
resources, you cannot change the QoS class in which the pod was created.
{{< /note >}}

Now, patch the pod's container with CPU requests & limits of 800m:

```shell
kubectl -n qos-example patch pod qos-demo --patch '{"spec":{"containers":[{"name":"qos-demo-ctr", "resources":{"requests":{"cpu":"800m"}, "limits":{"cpu":"800m"}}}]}}'
```

Query the pod's detailed information after the pod has been patched.

```shell
kubectl get pod qos-demo --output=yaml --namespace=qos-example
```

The pod's spec below reflects the updated CPU requests and limits.

```yaml
spec:
  containers:
    ...
    resources:
      limits:
        cpu: 800m
        memory: 200Mi
      requests:
        cpu: 800m
        memory: 200Mi
...
  containerStatuses:
...
    resourcesAllocated:
      cpu: 800m
      memory: 200Mi
    resources:
      limits:
        cpu: 800m
        memory: 200Mi
      requests:
        cpu: 800m
        memory: 200Mi
    restartCount: 0
    started: true
```

Observe that resourcesAllocated values has been updated to reflect the new
desired CPU requests. This indicates that node was able to accommodate the
increased CPU resource needs.

In the container's status, updated CPU resource values shows that new CPU
resources have been applied. The container's restart count remains unchanged,
indicating that container's CPU resources were resized without restarting it.

## Clean up

Delete your namespace:

```shell
kubectl delete namespace qos-example
```

{{% /capture %}}

