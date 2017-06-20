---
title: Parallel Processing using Expansions
redirect_from:
- "/docs/user-guide/jobs/expansions/index/"
- "/docs/user-guide/jobs/expansions/index.html"
---

* TOC
{:toc}

# Example: Multiple Job Objects from Template Expansion

In this example, we will run multiple Kubernetes Jobs created from
a common template.  You may want to be familiar with the basic,
non-parallel, use of [Jobs](/docs/concepts/jobs/run-to-completion-finite-workloads/) first.

## Basic Template Expansion

First, download the following template of a job to a file called `job.yaml`

{% include code.html language="yaml" file="job.yaml" ghlink="/docs/tasks/job/parallel-processing-expansion/job.yaml" %}

Unlike a *pod template*, our *job template* is not a Kubernetes API type.  It is just
a yaml representation of a Job object that has some placeholders that need to be filled
in before it can be used.  The `$ITEM` syntax is not meaningful to Kubernetes.

In this example, the only processing the container does is to `echo` a string and sleep for a bit.
In a real use case, the processing would be some substantial computation, such as rendering a frame
of a movie, or processing a range of rows in a database.  The "$ITEM" parameter would specify for
example, the frame number or the row range.

This Job and its Pod template have a label: `jobgroup=jobexample`.  There is nothing special
to the system about this label.  This label
makes it convenient to operate on all the jobs in this group at once.
We also put the same label on the pod template so that we can check on all Pods of these Jobs
with a single command.
After the job is created, the system will add more labels that distinguish one Job's pods
from another Job's pods.
Note that the label key `jobgroup` is not special to Kubernetes. You can pick your own label scheme.

Next, expand the template into multiple files, one for each item to be processed.

```shell
# Expand files into a temporary directory
mkdir ./jobs
for i in apple banana cherry
do
  cat job.yaml.txt | sed "s/\$ITEM/$i/" > ./jobs/job-$i.yaml
done
```

Check if it worked:

```shell
$ ls jobs/
job-apple.yaml
job-banana.yaml
job-cherry.yaml
```

Here, we used `sed` to replace the string `$ITEM` with the loop variable.
You could use any type of template language (jinja2, erb) or write a program
to generate the Job objects.

Next, create all the jobs with one kubectl command:

```shell
$ kubectl create -f ./jobs
job "process-item-apple" created
job "process-item-banana" created
job "process-item-cherry" created
```

Now, check on the jobs:

```shell
$ kubectl get jobs -l jobgroup=jobexample
JOB                   CONTAINER(S)   IMAGE(S)   SELECTOR                               SUCCESSFUL
process-item-apple    c              busybox    app in (jobexample),item in (apple)    1
process-item-banana   c              busybox    app in (jobexample),item in (banana)   1
process-item-cherry   c              busybox    app in (jobexample),item in (cherry)   1
```

Here we use the `-l` option to select all jobs that are part of this
group of jobs.  (There might be other unrelated jobs in the system that we
do not care to see.)

We can check on the pods as well using the same label selector:

```shell
$ kubectl get pods -l jobgroup=jobexample --show-all
NAME                        READY     STATUS      RESTARTS   AGE
process-item-apple-kixwv    0/1       Completed   0          4m 
process-item-banana-wrsf7   0/1       Completed   0          4m 
process-item-cherry-dnfu9   0/1       Completed   0          4m 
```

There is not a single command to check on the output of all jobs at once,
but looping over all the pods is pretty easy:

```shell
$ for p in $(kubectl get pods -l jobgroup=jobexample --show-all -o name)
do
  kubectl logs $p
done
Processing item apple
Processing item banana
Processing item cherry
```

## Multiple Template Parameters

In the first example, each instance of the template had one parameter, and that parameter was also
used as a label.  However label keys are limited in [what characters they can
contain](/docs/user-guide/labels/#syntax-and-character-set).

This slightly more complex example uses the jinja2 template language to generate our objects.
We will use a one-line python script to convert the template to a file.

First, copy and paste the following template of a Job object, into a file called `job.yaml.jinja2`:


```liquid{% raw %}
{%- set params = [{ "name": "apple", "url": "http://www.orangepippin.com/apples", },
                  { "name": "banana", "url": "https://en.wikipedia.org/wiki/Banana", },
                  { "name": "raspberry", "url": "https://www.raspberrypi.org/" }]
%} 
{%- for p in params %}
{%- set name = p["name"] %}
{%- set url = p["url"] %}
apiVersion: batch/v1
kind: Job
metadata:
  name: jobexample-{{ name }}
  labels:
    jobgroup: jobexample
spec:
  template:
      name: jobexample
      labels:
        jobgroup: jobexample
    spec:
      containers:
      - name: c
        image: busybox
        command: ["sh", "-c", "echo Processing URL {{ url }} && sleep 5"]
      restartPolicy: Never
---
{%- endfor %}
{% endraw %}
```

The above template defines parameters for each job object using a list of
python dicts (lines 1-4).  Then a for loop emits one job yaml object
for each set of parameters (remaining lines).
We take advantage of the fact that multiple yaml documents can be concatenated
with the `---` separator (second to last line).
.)  We can pipe the output directly to kubectl to
create the objects.

You will need the jinja2 package if you do not already have it: `pip install --user jinja2`.
Now, use this one-line python program to expand the template:

```shell
alias render_template='python -c "from jinja2 import Template; import sys; print(Template(sys.stdin.read()).render());"'
```



The output can be saved to a file, like this:

```shell
cat job.yaml.jinja2 | render_template > jobs.yaml
```

or sent directly to kubectl, like this:

```shell
cat job.yaml.jinja2 | render_template | kubectl create -f -
```

## Alternatives

If you have a large number of job objects, you may find that:

- even using labels, managing so many Job objects is cumbersome.
- You exceed resource quota when creating all the Jobs at once,
  and do not want to wait to create them incrementally.
- You need a way to easily scale the number of pods running
  concurrently.  One reason would be to avoid using too many
  compute resources.  Another would be to limit the number of
  concurrent requests to a shared resource, such as a database,
  used by all the pods in the job.
- very large numbers of jobs created at once overload the
  Kubernetes apiserver, controller, or scheduler.

In this case, you can consider one of the
other [job patterns](/docs/concepts/jobs/run-to-completion-finite-workloads/#job-patterns).
