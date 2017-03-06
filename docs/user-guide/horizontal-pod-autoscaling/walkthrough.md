---
assignees:
- fgrzadkowski
- jszczepkowski
- justinsb
- directxman12
title: Horizontal Pod Autoscaling
---

Horizontal Pod Autoscaling automatically scales the number of pods
in a replication controller, deployment or replica set based on observed CPU utilization
(or, with alpha support, on some other, application-provided metrics).

This document walks you through an example of enabling Horizontal Pod Autoscaling for the php-apache server.  For more information on how Horizontal Pod Autoscaling behaves, see the [Horizontal Pod Autoscaling user guide](/docs/user-guide/horizontal-pod-autoscaling/).

## Prerequisites

This example requires a running Kubernetes cluster and kubectl, version 1.2 or later.
[Heapster](https://github.com/kubernetes/heapster) monitoring needs to be deployed in the cluster
as Horizontal Pod Autoscaler uses it to collect metrics
(if you followed [getting started on GCE guide](/docs/getting-started-guides/gce),
heapster monitoring will be turned-on by default).

To specify multiple resource metrics for a Horizontal Pod Autoscaler, you must have a Kubernetes cluster
and kubectl at version 1.6 or later.  Furthermore, in order to make use of custom metrics, your cluster
must be able to communicate with the API server providing the custom metrics API.
See the [Horizontal Pod Autoscaling user guide](/docs/user-guide/horizontal-pod-autoscaling/#support-for-custom-metrics) for more details.

## Step One: Run & expose php-apache server

To demonstrate Horizontal Pod Autoscaler we will use a custom docker image based on the php-apache image.
The Dockerfile can be found [here](/docs/user-guide/horizontal-pod-autoscaling/image/Dockerfile).
It defines an [index.php](/docs/user-guide/horizontal-pod-autoscaling/image/index.php) page which performs some CPU intensive computations.

First, we will start a deployment running the image and expose it as a service:

```shell
$ kubectl run php-apache --image=gcr.io/google_containers/hpa-example --requests=cpu=200m --expose --port=80
service "php-apache" created
deployment "php-apache" created
```

## Step Two: Create Horizontal Pod Autoscaler

Now that the server is running, we will create the autoscaler using
[kubectl autoscale](https://github.com/kubernetes/kubernetes/blob/{{page.githubbranch}}/docs/user-guide/kubectl/kubectl_autoscale.md).
The following command will create a Horizontal Pod Autoscaler that maintains between 1 and 10 replicas of the Pods
controlled by the php-apache deployment we created in the first step of these instructions.
Roughly speaking, HPA will increase and decrease the number of replicas
(via the deployment) to maintain an average CPU utilization across all Pods of 50%
(since each pod requests 200 milli-cores by [kubectl run](https://github.com/kubernetes/kubernetes/blob/{{page.githubbranch}}/docs/user-guide/kubectl/kubectl_run.md), this means average CPU usage of 100 milli-cores).
See [here](https://github.com/kubernetes/kubernetes/blob/{{page.githubbranch}}/docs/design/horizontal-pod-autoscaler.md#autoscaling-algorithm) for more details on the algorithm.

```shell
$ kubectl autoscale deployment php-apache --cpu-percent=50 --min=1 --max=10
deployment "php-apache" autoscaled
```

We may check the current status of autoscaler by running:

```shell
$ kubectl get hpa
NAME         REFERENCE                     TARGET    CURRENT   MINPODS   MAXPODS   AGE
php-apache   Deployment/php-apache/scale   50%       0%        1         10        18s

```

Please note that the current CPU consumption is 0% as we are not sending any requests to the server
(the ``CURRENT`` column shows the average across all the pods controlled by the corresponding deployment).

## Step Three: Increase load

Now, we will see how the autoscaler reacts to increased load.
We will start a container, and send an infinite loop of queries to the php-apache service (please run it in a different terminal):

```shell
$ kubectl run -i --tty load-generator --image=busybox /bin/sh

Hit enter for command prompt

$ while true; do wget -q -O- http://php-apache.default.svc.cluster.local; done
```

Within a minute or so, we should see the higher CPU load by executing:

```shell
$ kubectl get hpa
NAME         REFERENCE                     TARGET    CURRENT   MINPODS   MAXPODS   AGE
php-apache   Deployment/php-apache/scale   50%       305%      1         10        3m

```

Here, CPU consumption has increased to 305% of the request.
As a result, the deployment was resized to 7 replicas:

```shell
$ kubectl get deployment php-apache
NAME         DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
php-apache   7         7         7            7           19m
```

**Note** Sometimes it may take a few minutes to stabilize the number of replicas.
Since the amount of load is not controlled in any way it may happen that the final number of replicas will
differ from this example.

## Step Four: Stop load

We will finish our example by stopping the user load.

In the terminal where we created the container with `busybox` image, terminate
the load generation by typing `<Ctrl> + C`.

Then we will verify the result state (after a minute or so):

```shell
$ kubectl get hpa
NAME         REFERENCE                     TARGET    CURRENT   MINPODS   MAXPODS   AGE
php-apache   Deployment/php-apache/scale   50%       0%        1         10        11m

$ kubectl get deployment php-apache
NAME         DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
php-apache   1         1         1            1           27m
```

Here CPU utilization dropped to 0, and so HPA autoscaled the number of replicas back down to 1.

**Note** autoscaling the replicas may take a few minutes.

## Autoscaling on multiple metrics and custom metrics

You can introduce additional metrics to use when autoscaling the `php-apache` Deployment
by making use of the `autoscaling/v2alpha1` API version.

First, get the YAML of your HorizontalPodAutoscaler in the `autoscaling/v2alpha1` form:

```shell
$ kubectl get hpa.autoscaling.v2alpha1 -o yaml > /tmp/hpa-v2.yaml
```

Open the `/tmp/hpa-v2.yaml` file in an editor, and you should see YAML which looks like this:

```yaml
apiVersion: autoscaling/v2alpha1
kind: HorizontalPodAutoscaler
metadata:
  name: php-apache
  namespace: default
spec:
  scaleTargetRef:
    apiVersion: extensions/v1beta1
    kind: Deployment
    name: php-apache
  minReplicas: 1
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      targetAverageUtilization: 50
status:
  observedGeneration: 1
  lastScaleTime: <some-time>
  currentReplicas: 1
  desiredReplicas: 1
  currentMetrics:
  - type: Resource
    resource:
      name: cpu
      currentAverageUtilization: 0
      currentAverageValue: 0
```

Notice that the `targetCPUUtilizationPercentage` field has been replaced with an array called `metrics`.
The CPU utilization metric is a *resource metric*, since it is represented as a percentage of a resource
specified on pod containers.  Notice that you can specify other resource metrics besides CPU.  By default,
the only other supported resource metric is memory.  These resources do not change names from cluster
to cluster, and should always be available, as long as Heapster is deployed.

You can also specify resource metrics in terms of direct values, instead of as percentages of the
requested value.  To do so, use the `targetAverageValue` field insted of the `targetAverageUtilization`
field.

There are two other types of metrics, both of which are considered *custom metrics*: pod metrics and
object metrics.  These metrics may have names which are cluster specific, and require a more
advanced cluster monitoring setup.

The first of these alternative metric types is *pod metrics*.  These metrics describe pods, and
are averaged together across pods and compared with a target value to determine the replica count.
They work much like resource metrics, except that they *only* have the `targetAverageValue` field.

Pod metrics are specified using a metric block like this:
```yaml
type: Pods
pods:
  metricName: packets-per-second
  targetAverageValue: 1k
```

The second alternative metric type is *object metrics*.  These metrics describe a different
object in the same namespace, instead of describing pods.  Note that the metrics are not
fetched from the object -- they simply describe it.  Object metrics do not involve averaging,
and look like this:

```yaml
type: Object
object:
  metricName: requests-per-second
  target:
    apiVersion: extensions/v1beta1
    kind: Ingress
    name: main-route
  targetValue: 2k
```

If you provide multiple such metric blocks, the HorizontalPodAutoscaler will consider each metric in turn.
The HorizontalPodAutoscaler will calculate proposed replica counts for each metric, and then choose the
one with the highest replica count.

For example, if you had your monitoring system collecting metrics about network traffic,
you could update the definition above using `kubectl edit` to look like this:

```yaml
apiVersion: autoscaling/v2alpha1
kind: HorizontalPodAutoscaler
metadata:
  name: php-apache
  namespace: default
spec:
  scaleTargetRef:
    apiVersion: extensions/v1beta1
    kind: Deployment
    name: php-apache
  minReplicas: 1
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      targetAverageUtilization: 50
  - type: Pods
    pods:
      metricName: packets-per-second
      targetAverageValue: 1k
  - type: Object
    object:
      metricName: requests-per-second
      target:
        apiVersion: extensions/v1beta1
        kind: Ingress
        name: main-route
      targetValue: 10k
status:
  observedGeneration: 1
  lastScaleTime: <some-time>
  currentReplicas: 1
  desiredReplicas: 1
  currentMetrics:
  - type: Resource
    resource:
      name: cpu
      currentAverageUtilization: 0
      currentAverageValue: 0
```

Then, your HorizontalPodAutoscaler would attempt to ensure that each pod was consuming roughly
50% of its requested CPU, serving 1000 packets per second, and that all pods behind the main-route
Ingress were serving a total of 10000 requests per second.

## Appendix: Other possible scenarios

### Creating the autoscaler from a .yaml file

Instead of using `kubectl autoscale` command we can use the [hpa-php-apache.yaml](/docs/user-guide/horizontal-pod-autoscaling/hpa-php-apache.yaml) file, which looks like this:

```yaml
apiVersion: autoscaling/v1
kind: HorizontalPodAutoscaler
metadata:
  name: php-apache
  namespace: default
spec:
  scaleTargetRef:
    apiVersion: extensions/v1beta1
    kind: Deployment
    name: php-apache
  minReplicas: 1
  maxReplicas: 10
  targetCPUUtilizationPercentage: 50
```

We will create the autoscaler by executing the following command:

```shell
$ kubectl create -f docs/user-guide/horizontal-pod-autoscaling/hpa-php-apache.yaml
horizontalpodautoscaler "php-apache" created
```
