---
assignees:
- davidopp
- madhusudancs

---

Kubernetes ships with a default scheduler that is described [here](/docs/admin/kube-scheduler/).
If the default scheduler does not suit your needs you can implement your own scheduler.
Not just that, you can even run multiple schedulers simultaneously alongside the default
scheduler and instruct Kubernetes what scheduler to use for each of your pods. Let's
learn how to run multiple schedulers in Kubernetes with an example.

A detailed description of how to implement a scheduler is outside the scope of this
document. Please refer to the kube-scheduler implementation in
[plugin/pkg/scheduler](https://github.com/kubernetes/kubernetes/tree/{{page.githubbranch}}/plugin/pkg/scheduler)
in the Kubernetes source directory for a canonical example.

### 1. Package the scheduler

Package your scheduler binary into a container image. For the purposes of this example,
let's just use the default scheduler (kube-scheduler) as our second scheduler as well.
Clone the [Kubernetes source code from Github](https://github.com/kubernetes/kubernetes)
and build the source.

```shell
git clone https://github.com/kubernetes/kubernetes.git
cd kubernetes
hack/build-go.sh
```

Create a container image containing the kube-scheduler binary. Here is the `Dockerfile`
to build the image:

```docker
FROM busybox
ADD _output/local/go/bin/kube-scheduler /usr/local/bin/kube-scheduler
```

Save the file as `Dockerfile`, build the image and push it to a registry. This example
pushes the image to
[Google Container Registry (GCR)](https://cloud.google.com/container-registry/).
For more details, please read the GCR
[documentation](https://cloud.google.com/container-registry/docs/).

```shell
docker build -t my-kube-scheduler:1.0 .
gcloud docker push gcr.io/my-gcp-project/my-kube-scheduler:1.0
```

### 2. Define a Kubernetes Deployment for the scheduler

Now that we have our scheduler in a container image, we can just create a pod
config for it and run it in our Kubernetes cluster. But instead of creating a pod
directly in the cluster, let's use a [Deployment](/docs/user-guide/deployments/)
for this example. A [Deployment](/docs/user-guide/deployments/) manages a
[Replica Set](/docs/user-guide/replicasets/) which in turn manages the pods,
thereby making the scheduler resilient to failures. Here is the deployment
config. Save it as `my-scheduler.yaml`:

{% include code.html language="yaml" file="multiple-schedulers/my-scheduler.yaml" ghlink="/docs/admin/multiple-schedulers/my-scheduler.yaml" %}

An important thing to note here is that the name of the scheduler specified as an
argument to the scheduler command in the container spec should be unique. This is the name that is matched against the value of the optional `scheduler.alpha.kubernetes.io/name` annotation on pods, to determine whether this scheduler is responsible for scheduling a particular pod.

Please see the
[kube-scheduler documentation](/docs/admin/kube-scheduler/) for
detailed description of other command line arguments.

### 3. Run the second scheduler in the cluster

In order to run your scheduler in a Kubernetes cluster, just create the deployment
specified in the config above in a Kubernetes cluster:

```shell
kubectl create -f my-scheduler.yaml
```

Verify that the scheduler pod is running:

```shell
$ kubectl get pods --namespace=kube-system
NAME                                           READY     STATUS    RESTARTS   AGE
....
my-scheduler-lnf4s-4744f                       1/1       Running   0          2m
...
```

You should see a "Running" my-scheduler pod, in addition to the default kube-scheduler
pod in this list.

### 4. Specify schedulers for pods

Now that our second scheduler is running, let's create some pods, and direct them to be scheduled by either the default scheduler or the one we just deployed. In order to schedule a given pod using a specific scheduler, we specify the name of the
scheduler as an annotation in that pod spec. Let's look at three examples.


1. Pod spec without any scheduler annotation

  {% include code.html language="yaml" file="multiple-schedulers/pod1.yaml" ghlink="/docs/admin/multiple-schedulers/pod1.yaml" %}

  When no scheduler annotation is supplied, the pod is automatically scheduled using the
  default-scheduler.

  Save this file as `pod1.yaml` and submit it to the Kubernetes cluster.

  ```shell
  kubectl create -f pod1.yaml
  ```
2. Pod spec with `default-scheduler` annotation

  {% include code.html language="yaml" file="multiple-schedulers/pod2.yaml" ghlink="/docs/admin/multiple-schedulers/pod2.yaml" %}

  A scheduler is specified by supplying the scheduler name as a value to the annotation
  with key `scheduler.alpha.kubernetes.io/name`. In this case, we supply the name of the
  default scheduler which is `default-scheduler`.

  Save this file as `pod2.yaml` and submit it to the Kubernetes cluster.

  ```shell
  kubectl create -f pod2.yaml
  ```
3. Pod spec with `my-scheduler` annotation

  {% include code.html language="yaml" file="multiple-schedulers/pod3.yaml" ghlink="/docs/admin/multiple-schedulers/pod3.yaml" %}

  In this case, we specify that this pod should be scheduled using the scheduler that we
  deployed - `my-scheduler`. Note that the value of the annotation with key
  `scheduler.alpha.kubernetes.io/name` should match the name supplied to the scheduler
  command as an argument in the deployment config for the scheduler.

  Save this file as `pod3.yaml` and submit it to the Kubernetes cluster.

  ```shell
  kubectl create -f pod3.yaml
  ```

  Verify that all three pods are running.

  ```shell
  kubectl get pods
  ```

### Verifying that the pods were scheduled using the desired schedulers

In order to make it easier to work through these examples, we did not verify that the
pods were actually scheduled using the desired schedulers. We can verify that by
changing the order of pod and deployment config submissions above. If we submit all the
pod configs to a Kubernetes cluster before submitting the scheduler deployment config,
we see that the pod `annotation-second-scheduler` remains in "Pending" state forever
while the other two pods get scheduled. Once we submit the scheduler deployment config
and our new scheduler starts running, the `annotation-second-scheduler` pod gets
scheduled as well.

Alternatively, one could just look at the "Scheduled" entries in the event logs to
verify that the pods were scheduled by the desired schedulers.

```shell
kubectl get events
```
