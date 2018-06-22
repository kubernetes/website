---
reviewers:
- erictune
- soltysh
title: Jobs - Run to Completion
content_template: templates/concept
weight: 70
---

{{% capture overview %}}

A _job_ creates one or more pods and ensures that a specified number of them successfully terminate.
As pods successfully complete, the _job_ tracks the successful completions.  When a specified number
of successful completions is reached, the job itself is complete.  Deleting a Job will cleanup the
pods it created.

A simple case is to create one Job object in order to reliably run one Pod to completion.
The Job object will start a new Pod if the first pod fails or is deleted (for example
due to a node hardware failure or a node reboot).

A Job can also be used to run multiple pods in parallel.

{{% /capture %}}

{{< toc >}}

{{% capture body %}}

## Running an example Job

Here is an example Job config.  It computes π to 2000 places and prints it out.
It takes around 10s to complete.

{{< code file="job.yaml" >}}

Run the example job by downloading the example file and then running this command:

```shell
$ kubectl create -f ./job.yaml
job "pi" created
```

Check on the status of the job using this command:

```shell
$ kubectl describe jobs/pi
Name:             pi
Namespace:        default
Selector:         controller-uid=b1db589a-2c8d-11e6-b324-0209dc45a495
Labels:           controller-uid=b1db589a-2c8d-11e6-b324-0209dc45a495
                  job-name=pi
Annotations:      <none>
Parallelism:      1
Completions:      1
Start Time:       Tue, 07 Jun 2016 10:56:16 +0200
Pods Statuses:    0 Running / 1 Succeeded / 0 Failed
Pod Template:
  Labels:       controller-uid=b1db589a-2c8d-11e6-b324-0209dc45a495
                job-name=pi
  Containers:
   pi:
    Image:      perl
    Port:
    Command:
      perl
      -Mbignum=bpi
      -wle
      print bpi(2000)
    Environment:        <none>
    Mounts:             <none>
  Volumes:              <none>
Events:
  FirstSeen    LastSeen    Count    From            SubobjectPath    Type        Reason            Message
  ---------    --------    -----    ----            -------------    --------    ------            -------
  1m           1m          1        {job-controller }                Normal      SuccessfulCreate  Created pod: pi-dtn4q
```

To view completed pods of a job, use `kubectl get pods`.

To list all the pods that belong to a job in a machine readable form, you can use a command like this:

```shell
$ pods=$(kubectl get pods --selector=job-name=pi --output=jsonpath={.items..metadata.name})
$ echo $pods
pi-aiw0a
```

Here, the selector is the same as the selector for the job.  The `--output=jsonpath` option specifies an expression
that just gets the name from each pod in the returned list.

View the standard output of one of the pods:

```shell
$ kubectl logs $pods
3.1415926535897932384626433832795028841971693993751058209749445923078164062862089986280348253421170679821480865132823066470938446095505822317253594081284811174502841027019385211055596446229489549303819644288109756659334461284756482337867831652712019091456485669234603486104543266482133936072602491412737245870066063155881748815209209628292540917153643678925903600113305305488204665213841469519415116094330572703657595919530921861173819326117931051185480744623799627495673518857527248912279381830119491298336733624406566430860213949463952247371907021798609437027705392171762931767523846748184676694051320005681271452635608277857713427577896091736371787214684409012249534301465495853710507922796892589235420199561121290219608640344181598136297747713099605187072113499999983729780499510597317328160963185950244594553469083026425223082533446850352619311881710100031378387528865875332083814206171776691473035982534904287554687311595628638823537875937519577818577805321712268066130019278766111959092164201989380952572010654858632788659361533818279682303019520353018529689957736225994138912497217752834791315155748572424541506959508295331168617278558890750983817546374649393192550604009277016711390098488240128583616035637076601047101819429555961989467678374494482553797747268471040475346462080466842590694912933136770289891521047521620569660240580381501935112533824300355876402474964732639141992726042699227967823547816360093417216412199245863150302861829745557067498385054945885869269956909272107975093029553211653449872027559602364806654991198818347977535663698074265425278625518184175746728909777727938000816470600161452491921732172147723501414419735685481613611573525521334757418494684385233239073941433345477624168625189835694855620992192221842725502542568876717904946016534668049886272327917860857843838279679766814541009538837863609506800642251252051173929848960841284886269456042419652850222106611863067442786220391949450471237137869609563643719172874677646575739624138908658326459958133904780275901
```

## Writing a Job Spec

As with all other Kubernetes config, a Job needs `apiVersion`, `kind`, and `metadata` fields.

A Job also needs a [`.spec` section](https://git.k8s.io/community/contributors/devel/api-conventions.md#spec-and-status).

### Pod Template

The `.spec.template` is the only required field of the `.spec`.

The `.spec.template` is a [pod template](/docs/concepts/workloads/pods/pod-overview/#pod-templates). It has exactly the same schema as a [pod](/docs/user-guide/pods), except it is nested and does not have an `apiVersion` or `kind`.

In addition to required fields for a Pod, a pod template in a job must specify appropriate
labels (see [pod selector](#pod-selector)) and an appropriate restart policy.

Only a [`RestartPolicy`](/docs/concepts/workloads/pods/pod-lifecycle/#restart-policy) equal to `Never` or `OnFailure` is allowed.

### Pod Selector

The `.spec.selector` field is optional.  In almost all cases you should not specify it.
See section [specifying your own pod selector](#specifying-your-own-pod-selector).


### Parallel Jobs

There are three main types of jobs:

1. Non-parallel Jobs
  - normally only one pod is started, unless the pod fails.
  - job is complete as soon as Pod terminates successfully.
1. Parallel Jobs with a *fixed completion count*:
  - specify a non-zero positive value for `.spec.completions`.
  - the job is complete when there is one successful pod for each value in the range 1 to `.spec.completions`.
  - **not implemented yet:** each pod passed a different index in the range 1 to `.spec.completions`.
1. Parallel Jobs with a *work queue*:
  - do not specify `.spec.completions`, default to `.spec.parallelism`.
  - the pods must coordinate with themselves or an external service to determine what each should work on.
  - each pod is independently capable of determining whether or not all its peers are done, thus the entire Job is done.
  - when _any_ pod terminates with success, no new pods are created.
  - once at least one pod has terminated with success and all pods are terminated, then the job is completed with success.
  - once any pod has exited with success, no other pod should still be doing any work or writing any output.  They should all be
    in the process of exiting.

For a Non-parallel job, you can leave both `.spec.completions` and `.spec.parallelism` unset.  When both are
unset, both are defaulted to 1.

For a Fixed Completion Count job, you should set `.spec.completions` to the number of completions needed.
You can set `.spec.parallelism`, or leave it unset and it will default to 1.

For a Work Queue Job, you must leave `.spec.completions` unset, and set `.spec.parallelism` to
a non-negative integer.

For more information about how to make use of the different types of job, see the [job patterns](#job-patterns) section.


#### Controlling Parallelism

The requested parallelism (`.spec.parallelism`) can be set to any non-negative value.
If it is unspecified, it defaults to 1.
If it is specified as 0, then the Job is effectively paused until it is increased.

Actual parallelism (number of pods running at any instant) may be more or less than requested
parallelism, for a variety of reasons:

- For Fixed Completion Count jobs, the actual number of pods running in parallel will not exceed the number of
  remaining completions.   Higher values of `.spec.parallelism` are effectively ignored.
- For work queue jobs, no new pods are started after any pod has succeeded -- remaining pods are allowed to complete, however.
- If the controller has not had time to react.
- If the controller failed to create pods for any reason (lack of ResourceQuota, lack of permission, etc.),
  then there may be fewer pods than requested.
- The controller may throttle new pod creation due to excessive previous pod failures in the same Job.
- When a pod is gracefully shutdown, it takes time to stop.

## Handling Pod and Container Failures

A Container in a Pod may fail for a number of reasons, such as because the process in it exited with
a non-zero exit code, or the Container was killed for exceeding a memory limit, etc.  If this
happens, and the `.spec.template.spec.restartPolicy = "OnFailure"`, then the Pod stays
on the node, but the Container is re-run.  Therefore, your program needs to handle the case when it is
restarted locally, or else specify `.spec.template.spec.restartPolicy = "Never"`.
See [pods-states](/docs/concepts/workloads/pods/pod-lifecycle/#example-states) for more information on `restartPolicy`.

An entire Pod can also fail, for a number of reasons, such as when the pod is kicked off the node
(node is upgraded, rebooted, deleted, etc.), or if a container of the Pod fails and the
`.spec.template.spec.restartPolicy = "Never"`.  When a Pod fails, then the Job controller
starts a new Pod.  Therefore, your program needs to handle the case when it is restarted in a new
pod.  In particular, it needs to handle temporary files, locks, incomplete output and the like
caused by previous runs.

Note that even if you specify `.spec.parallelism = 1` and `.spec.completions = 1` and
`.spec.template.spec.restartPolicy = "Never"`, the same program may
sometimes be started twice.

If you do specify `.spec.parallelism` and `.spec.completions` both greater than 1, then there may be
multiple pods running at once.  Therefore, your pods must also be tolerant of concurrency.

### Pod Backoff failure policy

There are situations where you want to fail a Job after some amount of retries
due to a logical error in configuration etc.
To do so, set `.spec.backoffLimit` to specify the number of retries before
considering a Job as failed. The back-off limit is set by default to 6. Failed
Pods associated with the Job are recreated by the Job controller with an
exponential back-off delay (10s, 20s, 40s ...) capped at six minutes. The
back-off count is reset if no new failed Pods appear before the Job's next
status check.

{{< note >}}
**Note:** Due to a known issue [#54870](https://github.com/kubernetes/kubernetes/issues/54870),
when the `.spec.template.spec.restartPolicy` field is set to "`OnFailure`", the
back-off limit may be ineffective. As a short-term workaround, set the restart
policy for the embedded template to "`Never`".
{{< /note >}}

## Job Termination and Cleanup

When a Job completes, no more Pods are created, but the Pods are not deleted either.  Keeping them around
allows you to still view the logs of completed pods to check for errors, warnings, or other diagnostic output.
The job object also remains after it is completed so that you can view its status.  It is up to the user to delete
old jobs after noting their status.  Delete the job with `kubectl` (e.g. `kubectl delete jobs/pi` or `kubectl delete -f ./job.yaml`). When you delete the job using `kubectl`, all the pods it created are deleted too.

By default, a Job will run uninterrupted unless a Pod fails, at which point the Job defers to the
`.spec.backoffLimit` described above. Another way to terminate a Job is by setting an active deadline.
Do this by setting the `.spec.activeDeadlineSeconds` field of the Job to a number of seconds.

The `activeDeadlineSeconds` applies to the duration of the job, no matter how many Pods are created.
Once a Job reaches `activeDeadlineSeconds`, the Job and all of its Pods are terminated.
The result is that the job has a status with `reason: DeadlineExceeded`. 

Note that a Job's `.spec.activeDeadlineSeconds` takes precedence over its `.spec.backoffLimit`. Therefore, a Job that is retrying one or more failed Pods will not deploy additional Pods once it reaches the time limit specified by `activeDeadlineSeconds`, even if the `backoffLimit` is not yet reached.

Example:

```yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: pi-with-timeout
spec:
  backoffLimit: 5
  activeDeadlineSeconds: 100
  template:
    spec:
      containers:
      - name: pi
        image: perl
        command: ["perl",  "-Mbignum=bpi", "-wle", "print bpi(2000)"]
      restartPolicy: Never
```

Note that both the Job Spec and the [Pod Template Spec](https://kubernetes.io/docs/concepts/workloads/pods/init-containers/#detailed-behavior) within the Job have an `activeDeadlineSeconds` field. Ensure that you set this field at the proper level.


## Job Patterns

The Job object can be used to support reliable parallel execution of Pods.  The Job object is not
designed to support closely-communicating parallel processes, as commonly found in scientific
computing.  It does support parallel processing of a set of independent but related *work items*.
These might be emails to be sent, frames to be rendered, files to be transcoded, ranges of keys in a
NoSQL database to scan, and so on.

In a complex system, there may be multiple different sets of work items.  Here we are just
considering one set of work items that the user wants to manage together &mdash; a *batch job*.

There are several different patterns for parallel computation, each with strengths and weaknesses.
The tradeoffs are:

- One Job object for each work item, vs. a single Job object for all work items.  The latter is
  better for large numbers of work items.  The former creates some overhead for the user and for the
  system to manage large numbers of Job objects.
- Number of pods created equals number of work items, vs. each pod can process multiple work items.
  The former typically requires less modification to existing code and containers.  The latter
  is better for large numbers of work items, for similar reasons to the previous bullet.
- Several approaches use a work queue.  This requires running a queue service,
  and modifications to the existing program or container to make it use the work queue.
  Other approaches are easier to adapt to an existing containerised application.


The tradeoffs are summarized here, with columns 2 to 4 corresponding to the above tradeoffs.
The pattern names are also links to examples and more detailed description.

|                            Pattern                                   | Single Job object | Fewer pods than work items? | Use app unmodified? |  Works in Kube 1.1? |
| -------------------------------------------------------------------- |:-----------------:|:---------------------------:|:-------------------:|:-------------------:|
| [Job Template Expansion](/docs/tasks/job/parallel-processing-expansion/)            |                   |                             |          ✓          |          ✓          |
| [Queue with Pod Per Work Item](/docs/tasks/job/coarse-parallel-processing-work-queue/)   |         ✓         |                             |      sometimes      |          ✓          |
| [Queue with Variable Pod Count](/docs/tasks/job/fine-parallel-processing-work-queue/)  |         ✓         |             ✓               |                     |          ✓          |
| Single Job with Static Work Assignment                               |         ✓         |                             |          ✓          |                     |

When you specify completions with `.spec.completions`, each Pod created by the Job controller
has an identical [`spec`](https://git.k8s.io/community/contributors/devel/api-conventions.md#spec-and-status).  This means that
all pods will have the same command line and the same
image, the same volumes, and (almost) the same environment variables.  These patterns
are different ways to arrange for pods to work on different things.

This table shows the required settings for `.spec.parallelism` and `.spec.completions` for each of the patterns.
Here, `W` is the number of work items.

|                             Pattern                                  | `.spec.completions` |  `.spec.parallelism` |
| -------------------------------------------------------------------- |:-------------------:|:--------------------:|
| [Job Template Expansion](/docs/tasks/job/parallel-processing-expansion/)           |          1          |     should be 1      |
| [Queue with Pod Per Work Item](/docs/tasks/job/coarse-parallel-processing-work-queue/)   |          W          |        any           |
| [Queue with Variable Pod Count](/docs/tasks/job/fine-parallel-processing-work-queue/)  |          1          |        any           |
| Single Job with Static Work Assignment                               |          W          |        any           |


## Advanced Usage

### Specifying your own pod selector

Normally, when you create a job object, you do not specify `.spec.selector`.
The system defaulting logic adds this field when the job is created.
It picks a selector value that will not overlap with any other jobs.

However, in some cases, you might need to override this automatically set selector.
To do this, you can specify the `.spec.selector` of the job.

Be very careful when doing this.  If you specify a label selector which is not
unique to the pods of that job, and which matches unrelated pods, then pods of the unrelated
job may be deleted, or this job may count other pods as completing it, or one or both
of the jobs may refuse to create pods or run to completion.  If a non-unique selector is
chosen, then other controllers (e.g. ReplicationController) and their pods may behave
in unpredictable ways too.  Kubernetes will not stop you from making a mistake when
specifying `.spec.selector`.

Here is an example of a case when you might want to use this feature.

Say job `old` is already running.  You want existing pods
to keep running, but you want the rest of the pods it creates
to use a different pod template and for the job to have a new name.
You cannot update the job because these fields are not updatable.
Therefore, you delete job `old` but leave its pods
running, using `kubectl delete jobs/old --cascade=false`.
Before deleting it, you make a note of what selector it uses:

```
kind: Job
metadata:
  name: old
  ...
spec:
  selector:
    matchLabels:
      job-uid: a8f3d00d-c6d2-11e5-9f87-42010af00002
  ...
```

Then you create a new job with name `new` and you explicitly specify the same selector.
Since the existing pods have label `job-uid=a8f3d00d-c6d2-11e5-9f87-42010af00002`,
they are controlled by job `new` as well.

You need to specify `manualSelector: true` in the new job since you are not using
the selector that the system normally generates for you automatically.

```
kind: Job
metadata:
  name: new
  ...
spec:
  manualSelector: true
  selector:
    matchLabels:
      job-uid: a8f3d00d-c6d2-11e5-9f87-42010af00002
  ...
```

The new Job itself will have a different uid from `a8f3d00d-c6d2-11e5-9f87-42010af00002`.  Setting
`manualSelector: true` tells the system to that you know what you are doing and to allow this
mismatch.

## Alternatives

### Bare Pods

When the node that a pod is running on reboots or fails, the pod is terminated
and will not be restarted.  However, a Job will create new pods to replace terminated ones.
For this reason, we recommend that you use a job rather than a bare pod, even if your application
requires only a single pod.

### Replication Controller

Jobs are complementary to [Replication Controllers](/docs/user-guide/replication-controller).
A Replication Controller manages pods which are not expected to terminate (e.g. web servers), and a Job
manages pods that are expected to terminate (e.g. batch jobs).

As discussed in [Pod Lifecycle](/docs/concepts/workloads/pods/pod-lifecycle/), `Job` is *only* appropriate for pods with
`RestartPolicy` equal to `OnFailure` or `Never`.  (Note: If `RestartPolicy` is not set, the default
value is `Always`.)

### Single Job starts Controller Pod

Another pattern is for a single Job to create a pod which then creates other pods, acting as a sort
of custom controller for those pods.  This allows the most flexibility, but may be somewhat
complicated to get started with and offers less integration with Kubernetes.

One example of this pattern would be a Job which starts a Pod which runs a script that in turn
starts a Spark master controller (see [spark example](https://github.com/kubernetes/examples/tree/{{< param "githubbranch" >}}/staging/spark/README.md)), runs a spark
driver, and then cleans up.

An advantage of this approach is that the overall process gets the completion guarantee of a Job
object, but complete control over what pods are created and how work is assigned to them.

## Cron Jobs

Support for creating Jobs at specified times/dates (i.e. cron) is available in Kubernetes [1.4](https://github.com/kubernetes/kubernetes/pull/11980). More information is available in the [cron job documents](/docs/concepts/workloads/controllers/cron-jobs/)

{{% /capture %}}