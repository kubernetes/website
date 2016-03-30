---
---

Horizontal pod autoscaling allows to automatically scale the number of pods
in a replication controller, deployment or replica set based on observed CPU utilization.
In the future also other metrics will be supported.

In this document we explain how this feature works by walking you through an example of enabling horizontal pod autoscaling for the php-apache server.

## Prerequisites

This example requires a running Kubernetes cluster and kubectl in the version at least 1.2.
[Heapster](https://github.com/kubernetes/heapster) monitoring needs to be deployed in the cluster
as horizontal pod autoscaler uses it to collect metrics
(if you followed [getting started on GCE guide](/docs/getting-started-guides/gce),
heapster monitoring will be turned-on by default).

## Step One: Run & expose php-apache server

To demonstrate horizontal pod autoscaler we will use a custom docker image based on php-apache server.
The image can be found [here](/docs/user-guide/horizontal-pod-autoscaling/image).
It defines [index.php](/docs/user-guide/horizontal-pod-autoscaling/image/index.php) page which performs some CPU intensive computations.

First, we will start a deployment running the image and expose it as a service:

```shell
$ kubectl run php-apache --image=gcr.io/google_containers/hpa-example --requests=cpu=200m --expose --port=80
service "php-apache" created
deployment "php-apache" created
```

## Step Two: Create horizontal pod autoscaler

Now that the server is running, we will create the autoscaler using
[kubectl autoscale](https://github.com/kubernetes/kubernetes/blob/{{page.githubbranch}}/docs/user-guide/kubectl/kubectl_autoscale.md).
The following command will create a horizontal pod autoscaler that maintains between 1 and 10 replicas of the Pods
controlled by the php-apache deployment we created in the first step of these instructions.
Roughly speaking, the horizontal autoscaler will increase and decrease the number of replicas
(via the deployment) to maintain an average CPU utilization across all Pods of 50%
(since each pod requests 200 milli-cores by [kubectl run](#kubectl-run), this means average CPU usage of 100 milli-cores).
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

Now, we will see how the autoscaler reacts on the increased load on the server.
We will start a container with `busybox` image and an infinite loop of queries to our server inside (please run it in a different terminal):

```shell
$ kubectl run -i --tty load-generator --image=busybox /bin/sh

Hit enter for command prompt

$ while true; do wget -q -O- http://php-apache.default.svc.cluster.local; done
```

We may examine, how CPU load was increased by executing (it usually takes 1 minute):

```shell
$ kubectl get hpa
NAME         REFERENCE                     TARGET    CURRENT   MINPODS   MAXPODS   AGE
php-apache   Deployment/php-apache/scale   50%       305%      1         10        3m

```

In the case presented here, it bumped CPU consumption to 305% of the request.
As a result, the deployment was resized to 7 replicas:

```shell
$ kubectl get deployment php-apache
NAME         DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
php-apache   7         7         7            7           19m
```

**Warning!** Sometimes it may take few steps to stabilize the number of replicas.
Since the amount of load is not controlled in any way it may happen that the final number of replicas will
differ from this example. 

## Step Four: Stop load

We will finish our example by stopping the user load.

In the terminal where we created container with `busybox` image we will terminate
infinite ``while`` loop by sending `SIGINT` signal,
which can be done using `<Ctrl> + C` combination.

Then we will verify the result state:

```shell
$ kubectl get hpa
NAME         REFERENCE                     TARGET    CURRENT   MINPODS   MAXPODS   AGE
php-apache   Deployment/php-apache/scale   50%       0%        1         10        11m

$ kubectl get deployment php-apache
NAME         DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
php-apache   1         1         1            1           27m
```

As we see, in the presented case CPU utilization dropped to 0, and the number of replicas dropped to 1.

**Warning!** Sometimes dropping number of replicas may take few steps.

## Appendix: Other possible scenarios

### Creating the autoscaler from a .yaml file

Instead of using `kubectl autoscale` command we can use the [hpa-php-apache.yaml](/docs/user-guide/horizontal-pod-autoscaling/hpa-php-apache.yaml) file, which looks like this:

```yaml
apiVersion: extensions/v1beta1
kind: HorizontalPodAutoscaler
metadata:
  name: php-apache
  namespace: default
spec:
  scaleRef:
    kind: Deployment
    name: php-apache
    subresource: scale
  minReplicas: 1
  maxReplicas: 10
  cpuUtilization:
    targetPercentage: 50
```

We will create the autoscaler by executing the following command:

```shell
$ kubectl create -f docs/user-guide/horizontal-pod-autoscaling/hpa-php-apache.yaml
horizontalpodautoscaler "php-apache" created
```
