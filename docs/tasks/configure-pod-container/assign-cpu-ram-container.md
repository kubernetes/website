---
title: Assign CPU and RAM Resources to a Container
description: When you create a Pod, you can request CPU and RAM resources for the containers that run in the Pod. You can also set limits for CPU and RAM use.
---

{% capture overview %}

This page shows how to assign CPU and RAM resources to containers running
in a Kubernetes Pod.

{% endcapture %}


{% capture prerequisites %}

{% include task-tutorial-prereqs.md %}

{% endcapture %}


{% capture steps %}

## Assign CPU and RAM resources to a container

When you create a Pod, you can request CPU and RAM resources for the containers
that run in the Pod. You can also set limits for CPU and RAM resources. To
request CPU and RAM resources, include the `resources:requests` field in the
configuration file. To set limits on CPU and RAM resources, include the
`resources:limits` field.

Kubernetes schedules a Pod to run on a Node only if the Node has enough CPU and
RAM available to satisfy the total CPU and RAM requested by all of the
containers in the Pod. Also, as a container runs on a Node, Kubernetes doesn't
allow the CPU and RAM consumed by the container to exceed the limits you specify
for the container. If a container exceeds its RAM limit, it is terminated. If a
container exceeds its CPU limit, it becomes a candidate for having its CPU use
throttled.

In this exercise, you create a Pod that runs one container. The configuration
file for the Pod requests 250 milicpu and 64 mebibytes of RAM. It also sets
upper limits of 1 cpu and 128 mebibytes of RAM. Here is the configuration file
for the `Pod`:

{% include code.html language="yaml" file="cpu-ram.yaml" ghlink="/docs/tasks/configure-pod-container/cpu-ram.yaml" %}

1. Create a Pod based on the YAML configuration file:

        kubectl create -f https://k8s.io/docs/tasks/configure-pod-container/cpu-ram.yaml

1. Display information about the pod:

        kubectl describe pod cpu-ram-demo

    The output is similar to this:

        Name:   cpu-ram-demo
        ...
        Containers:
          cpu-ram-demo-container:
           ...
            Limits:
              cpu:  1
              memory: 128Mi
            Requests:
              cpu:    250m
              memory:   64Mi

## CPU and RAM units

The CPU resource is measured in *cpu*s. Fractional values are allowed. You can
use the suffix *m* to mean mili. For example 100m cpu is 100 milicpu, and is
the same as 0.1 cpu.

The RAM resource is measured in bytes. You can express RAM as a plain integer
or a fixed-point integer with one of these suffixes: E, P, T, G, M, K, Ei, Pi,
Ti, Gi, Mi, Ki. For example, the following represent approximately the same value:

    128974848, 129e6, 129M , 123Mi

If you're not sure how much resources to request, you can first launch the
application without specifying resources, and use
[resource usage monitoring](/docs/user-guide/monitoring) to determine
appropriate values.

If a Container exceeds its RAM limit, it dies from an out-of-memory condition.
You can improve reliability by specifying a value that is a little higher
than what you expect to use.

If you specify a request, a Pod is guaranteed to be able to use that much
of the resource. See
[Resource QoS](https://git.k8s.io/community/contributors/design-proposals/resource-qos.md) for the difference between resource limits and requests.

## If you don't specify limits or requests

If you don't specify a RAM limit, Kubernetes places no upper bound on the
amount of RAM a Container can use. A Container could use all the RAM
available on the Node where the Container is running. Similarly, if you don't
specify a CPU limit, Kubernetes places no upper bound on CPU resources, and a
Container could use all of the CPU resources available on the Node.

Default limits are applied according to a limit range for the default
[namespace](/docs/user-guide/namespaces). You can use `kubectl describe limitrange limits`
to see the default limits.

For information about why you would want to specify limits, see
[Setting Pod CPU and Memory Limits](/docs/tasks/configure-pod-container/limit-range/).

For information about what happens if you don't specify CPU and RAM requests, see
[Resource Requests and Limits of Pod and Container](/docs/concepts/configuration/manage-compute-resources-container/).

{% endcapture %}

{% capture whatsnext %}

* Learn more about [managing compute resources](/docs/concepts/configuration/manage-compute-resources-container/).
* See [ResourceRequirements](/docs/api-reference/v1.6/#resourcerequirements-v1-core).

{% endcapture %}


{% include templates/task.md %}

