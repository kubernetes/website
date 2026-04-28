---
layout: blog
title: "Introducing Kueue"
date: 2022-10-04
slug: introducing-kueue
author: >
  Abdullah Gharaibeh (Google),
  Aldo Culquicondor (Google)
---

Whether on-premises or in the cloud, clusters face real constraints for resource usage, quota, and cost management reasons. Regardless of the autoscalling capabilities, clusters have finite capacity.  As a result, users want an easy way to fairly and 
efficiently share resources. 

In this article, we introduce [Kueue](https://github.com/kubernetes-sigs/kueue/tree/main/docs#readme),
an open source job queueing controller designed to manage batch jobs as a single unit.
Kueue leaves pod-level orchestration to existing stable components of Kubernetes.
Kueue natively supports the Kubernetes [Job](/docs/concepts/workloads/controllers/job/)
API and offers hooks for integrating other custom-built APIs for batch jobs.

## Why Kueue?
Job queueing is a key feature to run batch workloads at scale in both on-premises and cloud environments. The main goal 
of job queueing is to manage access to a limited pool of resources shared by multiple tenants. Job queueing decides which
jobs should wait, which can start immediately, and what resources they can use.

Some of the most desired job queueing requirements include:
- Quota and budgeting to control who can use what and up to what limit. This is not only needed in clusters with static resources like on-premises, 
  but it is also needed in cloud environments to control spend or usage of scarce resources.
- Fair sharing of resources between tenants. To maximize the usage of available resources, any unused quota assigned to inactive tenants should be 
  allowed to be shared fairly between active tenants.
- Flexible placement of jobs across different resource types based on availability. This is important in cloud environments which have heterogeneous 
  resources such as different architectures (GPU or CPU models) and different provisioning modes (spot vs on-demand).
- Support for autoscaled environments where resources can be provisioned on demand.

Plain Kubernetes doesn't address the above requirements. In normal circumstances, once a Job is created, the job-controller instantly creates the 
pods and kube-scheduler continuously attempts to assign the pods to nodes. At scale, this situation can work the control plane to death. There is 
also currently no good way to control at the job level which jobs should get which resources first, and no way to express order or fair sharing. The 
current ResourceQuota model is not a good fit for these needs because quotas are enforced on resource creation, and there is no queueing of requests. The 
intent of ResourceQuotas is to provide a builtin reliability mechanism with policies needed by admins to protect clusters from failing over.

In the Kubernetes ecosystem, there are several solutions for job scheduling. However, we found that these alternatives have one or more of the following problems:
- They replace existing stable components of Kubernetes, like kube-scheduler or the job-controller. This is problematic not only from an operational point of view, but 
  also the duplication in the job APIs causes fragmentation of the ecosystem and reduces portability.
- They don't integrate with autoscaling, or 
- They lack support for resource flexibility. 

## How Kueue works {#overview}
With Kueue we decided to take a different approach to job queueing on Kubernetes that is anchored around the following aspects: 
- Not duplicating existing functionalities already offered by established Kubernetes components for pod scheduling, autoscaling and job
  lifecycle management. 
- Adding key features that are missing to existing components. For example, we invested in the Job API to cover more use cases like 
  [IndexedJob](/blog/2021/04/19/introducing-indexed-jobs) and [fixed long standing issues related to pod 
  tracking](/docs/concepts/workloads/controllers/job/#job-tracking-with-finalizers). While this path takes longer to 
  land features, we believe it is the more sustainable long term solution.
- Ensuring compatibility with cloud environments where compute resources are elastic and heterogeneous.

For this approach to be feasible, Kueue needs knobs to influence the behavior of those established components so it can effectively manage 
when and where to start a job. We added those knobs to the Job API in the form of two features:
- [Suspend field](/docs/concepts/workloads/controllers/job/#suspending-a-job), which allows Kueue to signal to the job-controller 
  when to start or stop a Job.
- [Mutable scheduling directives](/docs/concepts/workloads/controllers/job/#mutable-scheduling-directives), which allows Kueue to 
  update a Job's `.spec.template.spec.nodeSelector` before starting the Job. This way, Kueue can control Pod placement while still
  delegating to kube-scheduler the actual pod-to-node scheduling.

Note that any custom job API can be managed by Kueue if that API offers the above two capabilities.

### Resource model
Kueue defines new APIs to address the requirements mentioned at the beginning of this post. The three main APIs are:

- ResourceFlavor: a cluster-scoped API to define resource flavor available for consumption, like a GPU model. At its core, a ResourceFlavor is 
  a set of labels that mirrors the labels on the nodes that offer those resources.
- ClusterQueue: a cluster-scoped API to define resource pools by setting quotas for one or more ResourceFlavor. 
- LocalQueue: a namespaced API for grouping and managing single tenant jobs. In its simplest form, a LocalQueue is a pointer to the ClusterQueue 
  that the tenant (modeled as a namespace) can use to start their jobs.

For more details, take a look at the [API concepts documentation](https://sigs.k8s.io/kueue/docs/concepts). While the three APIs may look overwhelming, 
most of Kueue’s operations are centered around ClusterQueue; the ResourceFlavor and LocalQueue APIs are mainly organizational wrappers.

### Example use case
Imagine the following setup for running batch workloads on a Kubernetes cluster on the cloud: 
- You have [cluster-autoscaler](https://github.com/kubernetes/autoscaler/tree/master/cluster-autoscaler) installed in the cluster to automatically
  adjust the size of your cluster.
- There are two types of autoscaled node groups that differ on their provisioning policies: spot and on-demand. The nodes of each group are 
  differentiated by the label `instance-type=spot` or `instance-type=ondemand`.
  Moreover, since not all Jobs can tolerate running on spot nodes, the nodes are tainted with `spot=true:NoSchedule`.
- To strike a balance between cost and resource availability, imagine you want Jobs to use up to 1000 cores of on-demand nodes, then use up to
  2000 cores of spot nodes.

As an admin for the batch system, you define two ResourceFlavors that represent the two types of nodes:

```yaml
---
apiVersion: kueue.x-k8s.io/v1alpha2
kind: ResourceFlavor
metadata:
  name: ondemand
  labels:
    instance-type: ondemand 
---
apiVersion: kueue.x-k8s.io/v1alpha2
kind: ResourceFlavor
metadata:
  name: spot
  labels:
    instance-type: spot
taints:
- effect: NoSchedule
  key: spot
  value: "true"
```

Then you define the quotas by creating a ClusterQueue as follows:
```yaml
apiVersion: kueue.x-k8s.io/v1alpha2
kind: ClusterQueue
metadata:
  name: research-pool
spec:
  namespaceSelector: {}
  resources:
  - name: "cpu"
    flavors:
    - name: ondemand
      quota:
        min: 1000
    - name: spot
      quota:
        min: 2000
```

Note that the order of flavors in the ClusterQueue resources matters: Kueue will attempt to fit jobs in the available quotas according to 
the order unless the job has an explicit affinity to specific flavors. 

For each namespace, you define a LocalQueue that points to the ClusterQueue above:

```yaml
apiVersion: kueue.x-k8s.io/v1alpha2
kind: LocalQueue
metadata:
  name: training
  namespace: team-ml
spec:
  clusterQueue: research-pool
```

Admins create the above setup once. Batch users are able to find the queues they are allowed to
submit to by listing the LocalQueues in their namespace(s). The command is similar to the following: `kubectl get -n my-namespace localqueues`

To submit work, create a Job and set the `kueue.x-k8s.io/queue-name` annotation as follows:

```yaml
apiVersion: batch/v1
kind: Job
metadata:
  generateName: sample-job-
  annotations:
    kueue.x-k8s.io/queue-name: training
spec:
  parallelism: 3
  completions: 3
  template:
    spec:
      tolerations:
      - key: spot
        operator: "Exists"
        effect: "NoSchedule"
      containers:
      - name: example-batch-workload
        image: registry.example/batch/calculate-pi:3.14
        args: ["30s"]
        resources:
          requests:
            cpu: 1
      restartPolicy: Never
```


Kueue intervenes to suspend the Job as soon as it is created. Once the Job is at the head of the ClusterQueue, Kueue evaluates if it can start
by checking if the resources requested by the job fit the available quota. 

In the above example, the Job tolerates spot resources. If there are previously admitted Jobs consuming all existing on-demand quota but
not all of spot’s, Kueue admits the Job using the spot quota. Kueue does this by issuing a single update to the Job object that: 
- Changes the `.spec.suspend` flag to false 
- Adds the term `instance-type: spot` to the job's `.spec.template.spec.nodeSelector` so that when the pods are created by the job controller, those pods can only schedule 
  onto spot nodes. 

Finally, if there are available empty nodes with matching node selector terms, then kube-scheduler will directly schedule the pods. If not, then
kube-scheduler will initially mark the pods as unschedulable, which will trigger the cluster-autoscaler to provision new nodes.

## Future work and getting involved
The example above offers a glimpse of some of Kueue's features including support for quota, resource flexibility, and integration with cluster 
autoscaler. Kueue also supports fair-sharing, job priorities, and different queueing strategies. Take a look at the
[Kueue documentation](https://github.com/kubernetes-sigs/kueue/tree/main/docs) to learn more about those features and how to use Kueue. 

We have a number of features that we plan to add to Kueue, such as hierarchical quota, budgets, and support for dynamically sized jobs. In 
the more immediate future, we are focused on adding support for job preemption.

The latest [Kueue release](https://github.com/kubernetes-sigs/kueue/releases) is available on Github;
try it out if you run batch workloads on Kubernetes (requires v1.22 or newer).
We are in the early stages of this project and we are seeking feedback of all levels, major or minor, so please don’t hesitate to reach out. We’re 
also open to additional contributors, whether it is to fix or report bugs, or help add new features or write documentation. You can get in touch with
us via our [repo](http://sigs.k8s.io/kueue), [mailing list](https://groups.google.com/a/kubernetes.io/g/wg-batch) or on 
[Slack](https://kubernetes.slack.com/messages/wg-batch).

Last but not least, thanks to all [our contributors](https://github.com/kubernetes-sigs/kueue/graphs/contributors) who made this project possible!
