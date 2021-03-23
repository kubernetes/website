---
title: "Introducing Suspended Jobs"
date: 2021-04-12
slug: introducing-suspended-jobs
layout: blog
---

**Author:** Adhityaa Chandrasekar (Google)

[Jobs](/docs/concepts/workloads/controllers/job/) are a crucial part of
Kubernetes API. While other kinds of workloads such as [Deployments](/docs/concepts/workloads/controllers/deployment/),
[ReplicaSets](/docs/concepts/workloads/controllers/replicaset/),
[StatefulSets](/docs/concepts/workloads/controllers/statefulset/), and
[DaemonSets](/docs/concepts/workloads/controllers/daemonset/)
solve use-cases that require Pods to run forever, Jobs are useful when Pods need
to run to completion. Commonly used in parallel batch processing, Jobs can be
used in a variety of applications ranging from video rendering and database
maintenance to sending bulk emails and scientific computing.

While the amount of parallelism and the conditions for Job completion are
configurable, the Kubernetes API lacked the ability to suspend and resume Jobs.
This is often desired when cluster resources are limited and a higher priority
Job needs to execute in the place of another Job. Deleting the lower priority
Job is a poor workaround as Pod completion history and other metrics associated
with the Job will be lost.

With the recent Kubernetes 1.21 release, you will be able to suspend a Job by
updating its spec. The feature is currently in **alpha** and requires you to
enable the `SuspendJob` [feature gate](/docs/reference/command-line-tools-reference/feature-gates/)
on the [API server](/docs/reference/command-line-tools-reference/kube-apiserver/)
and the [controller manager](/docs/reference/command-line-tools-reference/kube-controller-manager/)
in order to use it.

## API changes

A new boolean field `suspend` is introduced in the Job spec API. Let's say I
create the following Job:

```yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: my-job
spec:
  suspend: true
  parallelism: 2
  completions: 10
  template:
    spec:
      containers:
      - name: my-container
        image: busybox
        command: ["sleep", "5"]
      restartPolicy: Never
```

Jobs are not suspended by default, so I'm explicitly setting the `suspend` field
to true in the above Job spec. In the above example, the Job controller will
refrain from creating Pods until I'm ready to start the Job, which I can do by
updating the field to false.

As another example, consider a Job that was created with the `suspend` field
omitted. The Job controller will happily create Pods to work towards Job
completion. However, before the Job completes, if I explicitly set the field to
true with a Job update, the Job controller will terminate all active Pods that
are running and will wait indefinitely for the flag to be flipped back to false.
Pod termination is done by sending a SIGTERM signal to all active Pods; the
[graceful termination period](/docs/concepts/workloads/pods/pod-lifecycle/#pod-termination)
defined in the Pod spec will be honoured. Pods terminated this way will not be
counted as failures by the Job controller.

It is important to understand that succeeded and failed Pods from the past will
continue to exist after you suspend a Job. That is, that they will count towards
Job completion once you resume it. You can verify this by looking at Job's
status before and after suspension.

Read the [documentation](/docs/concepts/workloads/controllers/job#suspending-a-job)
for a full overview of this new feature.

## Where is this useful?

Let's say I'm the operator of a large cluster. I have many users submitting Jobs
to the cluster, but not all Jobs are created equal — some Jobs are more
important than others. Cluster resources aren't infinite either, so all users
must share resources. If all Jobs were created in the suspended state and placed
in a pending queue, I can achieve priority-based Job scheduling by resuming Jobs
in the right order.

As another motivational use-case, consider a cloud provider where compute
resources are cheaper at night than in the morning. If I have a long-running Job
that takes multiple days to complete, being able to suspend the Job in the
morning and then resume it in the evening every day can reduce costs.

Since this field is a part of the Job spec, CronJobs automatically get this
feature for free too.

## References and next steps

If you're interested in a deeper dive into the rationale behind this feature and
the decisions we have taken, consider reading the [enhancement proposal](https://github.com/kubernetes/enhancements/tree/master/keps/sig-apps/2232-suspend-jobs).
There's more detail on suspending and resuming jobs in the documentation for [Job](/docs/concepts/workloads/controllers/job#suspending-a-job).

As previously mentioned, this feature is currently in alpha and is available
only if you explicitly opt-in through the `SuspendJob` feature gate. If this is
a feature you're interested in, please consider testing suspended Jobs in your
cluster and providing feedback. You can discuss this enhancement [on GitHub](https://github.com/kubernetes/enhancements/issues/2232).
The SIG Apps community also [meets regularly](https://github.com/kubernetes/community/tree/master/sig-apps#meetings)
and can be reached through [Slack or the mailing list](https://github.com/kubernetes/community/tree/master/sig-apps#contact).
Barring any unexpected changes to the API, we intend to graduate the feature to
beta in Kubernetes 1.22, so that the feature becomes available by default.
