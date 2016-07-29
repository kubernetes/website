---
assignees:
- fgrzadkowski
- jszczepkowski

---

This document describes the current state of Horizontal Pod Autoscaling in Kubernetes.

## What is Horizontal Pod Autoscaling?

With Horizontal Pod Autoscaling, Kubernetes automatically scales the number of pods
in a replication controller, deployment or replica set based on observed CPU utilization
(or, with alpha support, on some other, application-provided metrics).

The Horizontal Pod Autoscaler is implemented as a Kubernetes API resource and a controller.
The resource determines the behavior of the controller.
The controller periodically adjusts the number of replicas in a replication controller or deployment
to match the observed average CPU utilization to the target specified by user.

## How does the Horizontal Pod Autoscaler work?

![Horizontal Pod Autoscaler diagram](/images/docs/horizontal-pod-autoscaler.svg)

The autoscaler is implemented as a control loop.
It periodically queries CPU utilization for the pods it targets.
(The period of the autoscaler is controlled by `--horizontal-pod-autoscaler-sync-period` flag of controller manager.
The default value is 30 seconds).
Then, it compares the arithmetic mean of the pods' CPU utilization with the target and adjust the number of replicas if needed.

CPU utilization is the recent CPU usage of a pod divided by the sum of CPU requested by the pod's containers.
Please note that if some of the pod's containers do not have CPU request set,
CPU utilization for the pod will not be defined and the autoscaler will not take any action.
Further details of the autoscaling algorithm are given [here](https://github.com/kubernetes/kubernetes/blob/{{page.githubbranch}}/docs/design/horizontal-pod-autoscaler.md#autoscaling-algorithm).

The autoscaler uses heapster to collect CPU utilization.
Therefore, it is required to deploy heapster monitoring in your cluster for autoscaling to work.

The autoscaler accesses corresponding replication controller, deployment or replica set by scale sub-resource.
Scale is an interface which allows to dynamically set the number of replicas and to learn the current state of them.
More details on scale sub-resource can be found [here](https://github.com/kubernetes/kubernetes/blob/{{page.githubbranch}}/docs/design/horizontal-pod-autoscaler.md#scale-subresource).


## API Object

Horizontal Pod Autoscaler is a top-level resource in the Kubernetes REST API.
In Kubernetes 1.2 HPA was graduated from beta to stable (more details about [api versioning](/docs/api/#api-versioning)) with compatibility between versions.
The stable version is available in the `autoscaling/v1` api group whereas the beta vesion is available in the `extensions/v1beta1` api group as before.
The transition plan is to deprecate beta version of HPA in Kubernetes 1.3, and get it rid off completely in Kubernetes 1.4.

**Warning!** Please have in mind that all Kubernetes components still use HPA in `extensions/v1beta1` in Kubernetes 1.2.

More details about the API object can be found at
[HorizontalPodAutoscaler Object](https://github.com/kubernetes/kubernetes/blob/{{page.githubbranch}}/docs/design/horizontal-pod-autoscaler.md#horizontalpodautoscaler-object).

## Support for Horizontal Pod Autoscaler in kubectl

Horizontal Pod Autoscaler, like every API resource, is supported in a standard way by `kubectl`.
We can create a new autoscaler using `kubectl create` command.
We can list autoscalers by `kubectl get hpa` and get detailed description by `kubectl describe hpa`.
Finally, we can delete an autoscaler using `kubectl delete hpa`.

In addition, there is a special `kubectl autoscale` command for easy creation of a Horizontal Pod Autoscaler.
For instance, executing `kubectl autoscale rc foo --min=2 --max=5 --cpu-percent=80`
will create an autoscaler for replication controller *foo*, with target CPU utilization set to `80%`
and the number of replicas between 2 and 5.
The detailed documentation of `kubectl autoscale` can be found [here](/docs/user-guide/kubectl/kubectl_autoscale).


## Autoscaling during rolling update

Currently in Kubernetes, it is possible to perform a rolling update by managing replication controllers directly,
or by using the deployment object, which manages the underlying replication controllers for you.
Horizontal Pod Autoscaler only supports the latter approach: the Horizontal Pod Autoscaler is bound to the deployment object,
it sets the size for the deployment object, and the deployment is responsible for setting sizes of underlying replication controllers.

Horizontal Pod Autoscaler does not work with rolling update using direct manipulation of replication controllers,
i.e. you cannot bind a Horizontal Pod Autoscaler to a replication controller and do rolling update (e.g. using `kubectl rolling-update`).
The reason this doesn't work is that when rolling update creates a new replication controller,
the Horizontal Pod Autoscaler will not be bound to the new replication controller.

## Support for custom metrics

Kubernetes 1.2 adds alpha support for scaling based on application-specific metrics like QPS (queries per second) or average request latency.

### Prerequisites

The cluster has to be started with `ENABLE_CUSTOM_METRICS` environment variable set to `true`.

### Pod configuration

The pods to be scaled must have cAdvisor-specific custom (aka application) metrics endpoint configured. The configuration format is described [here](https://github.com/google/cadvisor/blob/master/docs/application_metrics.md). Kubernetes expects the configuration to 
  be placed in `definition.json` mounted via a [config map](/docs/user-guide/horizontal-pod-autoscaling/configmap/) in `/etc/custom-metrics`. A sample config map may look like this:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: cm-config
data:
  definition.json: "{\"endpoint\" : \"http://localhost:8080/metrics\"}"
``` 

**Warning**
Due to the way cAdvisor currently works `localhost` refers to the node itself, not to the running pod. Thus the appropriate container in the pod must ask for a node port. Example:

```yaml
    ports:
    - hostPort: 8080
      containerPort: 8080
```

### Specifying target

HPA for custom metrics is configured via an annotation. The value in the annotation is interpreted as a target metric value averaged over
all running pods. Example: 

```yaml
    annotations:
      alpha/target.custom-metrics.podautoscaler.kubernetes.io: '{"items":[{"name":"qps", "value": "10"}]}'
```

In this case if there are 4 pods running and each of them reports qps metric to be equal to 15 HPA will start 2 additional pods so there will be 6 pods in total. If there are multiple metrics passed in the annotation or CPU is configured as well then HPA will use the biggest 
number of replicas that comes from the calculations.

At this moment even if target CPU utilization is not specified a default of 80% will be used. 
To calculate number of desired replicas based only on custom metrics CPU utilization
target should be set to a very large value (e.g. 100000%). Then CPU-related logic 
will want only 1 replica, leaving the decision about higher replica count to cusom metrics (and min/max limits).

## Further reading

* Design documentation: [Horizontal Pod Autoscaling](https://github.com/kubernetes/kubernetes/blob/{{page.githubbranch}}/docs/design/horizontal-pod-autoscaler.md).
* kubectl autoscale command: [kubectl autoscale](/docs/user-guide/kubectl/kubectl_autoscale).
* Usage example of [Horizontal Pod Autoscaler](/docs/user-guide/horizontal-pod-autoscaling/walkthrough/).
