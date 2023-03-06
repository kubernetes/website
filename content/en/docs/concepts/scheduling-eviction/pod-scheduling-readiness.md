---
title: Pod Scheduling Readiness
content_type: concept
weight: 40
---

<!-- overview -->

{{< feature-state for_k8s_version="v1.26" state="alpha" >}}

Pods were considered ready for scheduling once created. Kubernetes scheduler
does its due diligence to find nodes to place all pending Pods. However, in a 
real-world case, some Pods may stay in a "miss-essential-resources" state for a long period.
These Pods actually churn the scheduler (and downstream integrators like Cluster AutoScaler)
in an unnecessary manner.

By specifying/removing a Pod's `.spec.schedulingGates`, you can control when a Pod is ready
to be considered for scheduling.

<!-- body -->

## Configuring Pod schedulingGates

The `schedulingGates` field contains a list of strings, and each string literal is perceived as a
criteria that Pod should be satisfied before considered schedulable. This field can be initialized
only when a Pod is created (either by the client, or mutated during admission). After creation,
each schedulingGate can be removed in arbitrary order, but addition of a new scheduling gate is disallowed.

{{< figure src="/docs/images/podSchedulingGates.svg" alt="pod-scheduling-gates-diagram" caption="Figure. Pod SchedulingGates" class="diagram-large" link="https://mermaid.live/edit#pako:eNplkktTwyAUhf8KgzuHWpukaYszutGlK3caFxQuCVMCGSDVTKf_XfKyPlhxz4HDB9wT5lYAptgHFuBRsdKxenFMClMYFIdfUdRYgbiD6ItJTEbR8wpEq5UpUfnDTf-5cbPoJjcbXdcaE61RVJIiqJvQ_Y30D-OCt-t3tFjcR5wZayiVnIGmkv4NiEfX9jijKTmmRH5jf0sRugOP0HyHUc1m6KGMFP27cM28fwSJDluPpNKaXqVJzmFNfHD2APRKSjnNFx9KhIpmzSfhVls3eHdTRrwG8QnxKfEZUUNeYTDBNbiaKRF_5dSfX-BQQQ0FpnEqQLJWhwIX5hyXsjbYl85wTINrgeC2EZd_xFQy7b_VJ6GCdd-itkxALE84dE3fAqXyIUZya6Qqe711OspVCI2ny2Vv35QqVO3-htt66ZWomAvVcZcv8yTfsiSFfJOydZoKvl_ttjLJVlJsblcJw-czwQ0zr9ZeqGDgeR77b2jD8xdtjtDn" >}}
## Usage example

To mark a Pod not-ready for scheduling, you can create it with one or more scheduling gates like this:

{{< codenew file="pods/pod-with-scheduling-gates.yaml" >}}

After the Pod's creation, you can check its state using:

```bash
kubectl get pod test-pod
```

The output reveals it's in `SchedulingGated` state:

```none
NAME       READY   STATUS            RESTARTS   AGE
test-pod   0/1     SchedulingGated   0          7s
```

You can also check its `schedulingGates` field by running:

```bash
kubectl get pod test-pod -o jsonpath='{.spec.schedulingGates}'
```

The output is:

```none
[{"name":"example.com/foo"},{"name":"example.com/bar"}]
```

To inform scheduler this Pod is ready for scheduling, you can remove its `schedulingGates` entirely
by re-applying a modified manifest:

{{< codenew file="pods/pod-without-scheduling-gates.yaml" >}}

You can check if the `schedulingGates` is cleared by running:

```bash
kubectl get pod test-pod -o jsonpath='{.spec.schedulingGates}'
```

The output is expected to be empty. And you can check its latest status by running:

```bash
kubectl get pod test-pod -o wide
```

Given the test-pod doesn't request any CPU/memory resources, it's expected that this Pod's state get
transited from previous `SchedulingGated` to `Running`:

```none
NAME       READY   STATUS    RESTARTS   AGE   IP         NODE  
test-pod   1/1     Running   0          15s   10.0.0.4   node-2
```

## Observability

The metric `scheduler_pending_pods` comes with a new label `"gated"` to distinguish whether a Pod
has been tried scheduling but claimed as unschedulable, or explicitly marked as not ready for
scheduling. You can use `scheduler_pending_pods{queue="gated"}` to check the metric result.

## {{% heading "whatsnext" %}}

* Read the [PodSchedulingReadiness KEP](https://github.com/kubernetes/enhancements/blob/master/keps/sig-scheduling/3521-pod-scheduling-readiness) for more details
