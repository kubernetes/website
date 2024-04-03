---
reviewers:
- davidopp
- madhusudancs
title: Configure Multiple Schedulers
content_type: task
weight: 20
---

<!-- overview -->

Kubernetes ships with a default scheduler that is described
[here](/docs/reference/command-line-tools-reference/kube-scheduler/).
If the default scheduler does not suit your needs you can implement your own scheduler.
Moreover, you can even run multiple schedulers simultaneously alongside the default
scheduler and instruct Kubernetes what scheduler to use for each of your pods. Let's
learn how to run multiple schedulers in Kubernetes with an example.

A detailed description of how to implement a scheduler is outside the scope of this
document. Please refer to the kube-scheduler implementation in
[pkg/scheduler](https://github.com/kubernetes/kubernetes/tree/master/pkg/scheduler)
in the Kubernetes source directory for a canonical example.

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!-- steps -->

## Package the scheduler

Package your scheduler binary into a container image. For the purposes of this example,
you can use the default scheduler (kube-scheduler) as your second scheduler.
Clone the [Kubernetes source code from GitHub](https://github.com/kubernetes/kubernetes)
and build the source.

```shell
git clone https://github.com/kubernetes/kubernetes.git
cd kubernetes
make
```

Create a container image containing the kube-scheduler binary. Here is the `Dockerfile`
to build the image:

```docker
FROM busybox
ADD ./_output/local/bin/linux/amd64/kube-scheduler /usr/local/bin/kube-scheduler
```

Save the file as `Dockerfile`, build the image and push it to a registry. This example
pushes the image to
[Google Container Registry (GCR)](https://cloud.google.com/container-registry/).
For more details, please read the GCR
[documentation](https://cloud.google.com/container-registry/docs/). Alternatively
you can also use the [docker hub](https://hub.docker.com/search?q=). For more details
refer to the docker hub [documentation](https://docs.docker.com/docker-hub/repos/create/#create-a-repository).

```shell
docker build -t gcr.io/my-gcp-project/my-kube-scheduler:1.0 .     # The image name and the repository
gcloud docker -- push gcr.io/my-gcp-project/my-kube-scheduler:1.0 # used in here is just an example
```

## Define a Kubernetes Deployment for the scheduler

Now that you have your scheduler in a container image, create a pod
configuration for it and run it in your Kubernetes cluster. But instead of creating a pod
directly in the cluster, you can use a [Deployment](/docs/concepts/workloads/controllers/deployment/)
for this example. A [Deployment](/docs/concepts/workloads/controllers/deployment/) manages a
[Replica Set](/docs/concepts/workloads/controllers/replicaset/) which in turn manages the pods,
thereby making the scheduler resilient to failures. Here is the deployment
config. Save it as `my-scheduler.yaml`:

{{% code_sample file="admin/sched/my-scheduler.yaml" %}}

In the above manifest, you use a [KubeSchedulerConfiguration](/docs/reference/scheduling/config/)
to customize the behavior of your scheduler implementation. This configuration has been passed to
the `kube-scheduler` during initialization with the `--config` option. The `my-scheduler-config` ConfigMap stores the configuration file. The Pod of the`my-scheduler` Deployment mounts the `my-scheduler-config` ConfigMap as a volume.

In the aforementioned Scheduler Configuration, your scheduler implementation is represented via
a [KubeSchedulerProfile](/docs/reference/config-api/kube-scheduler-config.v1/#kubescheduler-config-k8s-io-v1-KubeSchedulerProfile).
{{< note >}}
To determine if a scheduler is responsible for scheduling a specific Pod, the `spec.schedulerName` field in a 
PodTemplate or Pod manifest must match the `schedulerName` field of the `KubeSchedulerProfile`.
All schedulers running in the cluster must have unique names.
{{< /note >}}

Also, note that you create a dedicated service account `my-scheduler` and bind the ClusterRole
`system:kube-scheduler` to it so that it can acquire the same privileges as `kube-scheduler`.

Please see the
[kube-scheduler documentation](/docs/reference/command-line-tools-reference/kube-scheduler/) for
detailed description of other command line arguments and
[Scheduler Configuration reference](/docs/reference/config-api/kube-scheduler-config.v1/) for
detailed description of other customizable `kube-scheduler` configurations.

## Run the second scheduler in the cluster

In order to run your scheduler in a Kubernetes cluster, create the deployment
specified in the config above in a Kubernetes cluster:

```shell
kubectl create -f my-scheduler.yaml
```

Verify that the scheduler pod is running:

```shell
kubectl get pods --namespace=kube-system
```

```
NAME                                           READY     STATUS    RESTARTS   AGE
....
my-scheduler-lnf4s-4744f                       1/1       Running   0          2m
...
```

You should see a "Running" my-scheduler pod, in addition to the default kube-scheduler
pod in this list.

### Enable leader election

To run multiple-scheduler with leader election enabled, you must do the following:

Update the following fields for the KubeSchedulerConfiguration in the `my-scheduler-config` ConfigMap in your YAML file:

* `leaderElection.leaderElect` to `true`
* `leaderElection.resourceNamespace` to `<lock-object-namespace>`
* `leaderElection.resourceName` to `<lock-object-name>`

{{< note >}}
The control plane creates the lock objects for you, but the namespace must already exist.
You can use the `kube-system` namespace.
{{< /note >}}

If RBAC is enabled on your cluster, you must update the `system:kube-scheduler` cluster role.
Add your scheduler name to the resourceNames of the rule applied for `endpoints` and `leases` resources, as in the following example:

```shell
kubectl edit clusterrole system:kube-scheduler
```

{{% code_sample file="admin/sched/clusterrole.yaml" %}}

## Specify schedulers for pods

Now that your second scheduler is running, create some pods, and direct them
to be scheduled by either the default scheduler or the one you deployed.
In order to schedule a given pod using a specific scheduler, specify the name of the
scheduler in that pod spec. Let's look at three examples.

- Pod spec without any scheduler name

  {{% code_sample file="admin/sched/pod1.yaml" %}}

  When no scheduler name is supplied, the pod is automatically scheduled using the
  default-scheduler.

  Save this file as `pod1.yaml` and submit it to the Kubernetes cluster.

  ```shell
  kubectl create -f pod1.yaml
  ```

- Pod spec with `default-scheduler`

  {{% code_sample file="admin/sched/pod2.yaml" %}}

  A scheduler is specified by supplying the scheduler name as a value to `spec.schedulerName`. In this case, we supply the name of the
  default scheduler which is `default-scheduler`.

  Save this file as `pod2.yaml` and submit it to the Kubernetes cluster.

  ```shell
  kubectl create -f pod2.yaml
  ```

- Pod spec with `my-scheduler`

  {{% code_sample file="admin/sched/pod3.yaml" %}}

  In this case, we specify that this pod should be scheduled using the scheduler that we
  deployed - `my-scheduler`. Note that the value of `spec.schedulerName` should match the name supplied for the scheduler
  in the `schedulerName` field of the mapping `KubeSchedulerProfile`.

  Save this file as `pod3.yaml` and submit it to the Kubernetes cluster.

  ```shell
  kubectl create -f pod3.yaml
  ```

  Verify that all three pods are running.

  ```shell
  kubectl get pods
  ```

<!-- discussion -->

### Verifying that the pods were scheduled using the desired schedulers

In order to make it easier to work through these examples, we did not verify that the
pods were actually scheduled using the desired schedulers. We can verify that by
changing the order of pod and deployment config submissions above. If we submit all the
pod configs to a Kubernetes cluster before submitting the scheduler deployment config,
we see that the pod `annotation-second-scheduler` remains in "Pending" state forever
while the other two pods get scheduled. Once we submit the scheduler deployment config
and our new scheduler starts running, the `annotation-second-scheduler` pod gets
scheduled as well.

Alternatively, you can look at the "Scheduled" entries in the event logs to
verify that the pods were scheduled by the desired schedulers.

```shell
kubectl get events
```
You can also use a [custom scheduler configuration](/docs/reference/scheduling/config/#multiple-profiles)
or a custom container image for the cluster's main scheduler by modifying its static pod manifest
on the relevant control plane nodes.

