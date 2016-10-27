---
---

{% capture overview %}

This page shows how assign CPU and RAM resources to containers running
in a Kubernetes Pod.

{% endcapture %}


{% capture prerequisites %}

{% include task-tutorial-prereqs.md %}

{% endcapture %}


{% capture steps %}

### Assigning CPU and RAM resources to a container

When you create a Pod, you can request CPU and RAM resources for the containers
that run in the Pod. You can also set limits for CPU and RAM resources. To
request CPU and RAM resources, include the `resources:requests` field in the
configuration file. To set limits on CPU and RAM resources, include the
`resources:limits` field.

In this exercise, you create a Pod that runs one container. The configuration
file for the Pod requests 250 milicpu and 64 mebibytes of RAM. It also sets
upper limits of 1 cpu and 128 mebibytes of RAM. Here is the configuration file
for the `Pod`:

{% include code.html language="yaml" file="cpu-ram.yaml" ghlink="/docs/tasks/configure-pod-container/cpu-ram.yaml" %}

1. Create a Pod based on the YAML configuration file:

        export REPO=https://raw.githubusercontent.com/kubernetes/kubernetes.github.io/master
        kubectl create -f $REPO/docs/tasks/configure-pod-container/cpu-ram.yaml

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

### Understanding CPU and RAM units

The CPU resource is measured in *cpu*s. Fractional values are allowed. You can
use the suffix *m* to mean mili. For example 100m cpu is 100 milicpu, and is
the same as 0.1 cpu.

The RAM resource is measured in bytes. You can express RAM as a plain integer
or a fixed-point integer with one of these suffixes: E, P, T, G, M, K, Ei, Pi,
Ti, Gi, Mi, Ki. For example, the following represent approximately the same value:

        128974848, 129e6, 129M , 123Mi

{% endcapture %}

{% capture whatsnext %}

* Learn more about [managing compute resources](/docs/user-guide/compute-resources/).
* Learn more about [setting pod cpu and memory limits](/docs/admin/limitrange/).
* See [ResourceRequirements](/docs/api-reference/v1/definitions/#_v1_resourcerequirements).

{% endcapture %}


{% include templates/task.md %}

