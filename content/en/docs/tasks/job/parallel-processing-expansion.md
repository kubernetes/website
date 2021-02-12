---
title: Parallel Processing using Expansions
content_type: task
min-kubernetes-server-version: v1.8
weight: 20
---

<!-- overview -->

This task demonstrates running multiple {{< glossary_tooltip text="Jobs" term_id="job" >}}
based on a common template. You can use this approach to process batches of work in
parallel.

For this example there are only three items: _apple_, _banana_, and _cherry_.
The sample Jobs process each item by printing a string then pausing.

See [using Jobs in real workloads](#using-jobs-in-real-workloads) to learn about how
this pattern fits more realistic use cases.

## {{% heading "prerequisites" %}}

You should be familiar with the basic,
non-parallel, use of [Job](/docs/concepts/workloads/controllers/job/).

{{< include "task-tutorial-prereqs.md" >}}

For basic templating you need the command-line utility `sed`.

To follow the advanced templating example, you need a working installation of
[Python](https://www.python.org/), and the Jinja2 template
library for Python.

Once you have Python set up, you can install Jinja2 by running:

```shell
pip install --user jinja2
```

<!-- steps -->

## Create Jobs based on a template

First, download the following template of a Job to a file called `job-tmpl.yaml`.
Here's what you'll download:

{{< codenew file="application/job/job-tmpl.yaml" >}}

```shell
# Use curl to download job-tmpl.yaml
curl -L -s -O https://k8s.io/examples/application/job/job-tmpl.yaml
```

The file you downloaded is not yet a valid Kubernetes
{{< glossary_tooltip text="manifest" term_id="manifest" >}}.
Instead that template is a YAML representation of a Job object with some placeholders
that need to be filled in before it can be used.  The `$ITEM` syntax is not meaningful to Kubernetes.


### Create manifests from the template

The following shell snippet uses `sed` to replace the string `$ITEM` with the loop
variable, writing into a temporary directory named `jobs`. Run this now:

```shell
# Expand the template into multiple files, one for each item to be processed.
mkdir ./jobs
for i in apple banana cherry
do
  cat job-tmpl.yaml | sed "s/\$ITEM/$i/" > ./jobs/job-$i.yaml
done
```

Check if it worked:

```shell
ls jobs/
```

The output is similar to this:

```
job-apple.yaml
job-banana.yaml
job-cherry.yaml
```

You could use any type of template language (for example: Jinja2; ERB), or
write a program to generate the Job manifests.

### Create Jobs from the manifests

Next, create all the Jobs with one kubectl command:

```shell
kubectl create -f ./jobs
```

The output is similar to this:

```
job.batch/process-item-apple created
job.batch/process-item-banana created
job.batch/process-item-cherry created
```

Now, check on the jobs:

```shell
kubectl get jobs -l jobgroup=jobexample
```

The output is similar to this:

```
NAME                  COMPLETIONS   DURATION   AGE
process-item-apple    1/1           14s        22s
process-item-banana   1/1           12s        21s
process-item-cherry   1/1           12s        20s
```

Using the `-l` option to kubectl selects only the Jobs that are part
of this group of jobs (there might be other unrelated jobs in the system).

You can check on the Pods as well using the same
{{< glossary_tooltip text="label selector" term_id="selector" >}}:


```shell
kubectl get pods -l jobgroup=jobexample
```

The output is similar to:

```
NAME                        READY     STATUS      RESTARTS   AGE
process-item-apple-kixwv    0/1       Completed   0          4m
process-item-banana-wrsf7   0/1       Completed   0          4m
process-item-cherry-dnfu9   0/1       Completed   0          4m
```

We can use this single command to check on the output of all jobs at once:

```shell
kubectl logs -f -l jobgroup=jobexample
```

The output should be:

```
Processing item apple
Processing item banana
Processing item cherry
```

### Clean up {#cleanup-1}

```shell
# Remove the Jobs you created
# Your cluster automatically cleans up their Pods
kubectl delete job -l jobgroup=jobexample
```

## Use advanced template parameters

In the [first example](#create-jobs-based-on-a-template), each instance of the template had one
parameter, and that parameter was also used in the Job's name. However,
[names](/docs/concepts/overview/working-with-objects/names/#names) are restricted
to contain only certain characters.

This slightly more complex example uses the
[Jinja template language](https://palletsprojects.com/p/jinja/) to generate manifests
and then objects from those manifests, with a multiple parameters for each Job.

For this part of the task, you are going to use a one-line Python script to
convert the template to a set of manifests.

First, copy and paste the following template of a Job object, into a file called `job.yaml.jinja2`:


```liquid
{%- set params = [{ "name": "apple", "url": "http://dbpedia.org/resource/Apple", },
                  { "name": "banana", "url": "http://dbpedia.org/resource/Banana", },
                  { "name": "cherry", "url": "http://dbpedia.org/resource/Cherry" }]
%}
{%- for p in params %}
{%- set name = p["name"] %}
{%- set url = p["url"] %}
---
apiVersion: batch/v1
kind: Job
metadata:
  name: jobexample-{{ name }}
  labels:
    jobgroup: jobexample
spec:
  template:
    metadata:
      name: jobexample
      labels:
        jobgroup: jobexample
    spec:
      containers:
      - name: c
        image: busybox
        command: ["sh", "-c", "echo Processing URL {{ url }} && sleep 5"]
      restartPolicy: Never
{%- endfor %}
```

The above template defines two parameters for each Job object using a list of
python dicts (lines 1-4). A `for` loop emits one Job manifest for each
set of parameters (remaining lines).

This example relies on a feature of YAML. One YAML file can contain multiple
documents (Kubernetes manifests, in this case), separated by `---` on a line
by itself.
You can pipe the output directly to `kubectl` to create the Jobs.

Next, use this one-line Python program to expand the template:

```shell
alias render_template='python -c "from jinja2 import Template; import sys; print(Template(sys.stdin.read()).render());"'
```

Use `render_template` to convert the parameters and template into a single
YAML file containing Kubernetes manifests:

```shell
# This requires the alias you defined earlier
cat job.yaml.jinja2 | render_template > jobs.yaml
```

You can view `jobs.yaml` to verify that the `render_template` script worked
correctly.

Once you are happy that `render_template` is working how you intend,
you can pipe its output into `kubectl`:

```shell
cat job.yaml.jinja2 | render_template | kubectl apply -f -
```

Kubernetes accepts and runs the Jobs you created.

### Clean up {#cleanup-2}

```shell
# Remove the Jobs you created
# Your cluster automatically cleans up their Pods
kubectl delete job -l jobgroup=jobexample
```


<!-- discussion -->

## Using Jobs in real workloads

In a real use case, each Job performs some substantial computation, such as rendering a frame
of a movie, or processing a range of rows in a database. If you were rendering a movie
you would set `$ITEM` to the frame number. If you were processing rows from a database
table, you would set `$ITEM` to represent the range of database rows to process.

In the task, you ran a command to collect the output from Pods by fetching
their logs. In a real use case, each Pod for a Job writes its output to
durable storage before completing. You can use a PersistentVolume for each Job,
or an external storage service. For example, if you are rendering frames for a movie,
use HTTP to `PUT` the rendered frame data to a URL, using a different URL for each
frame.

## Labels on Jobs and Pods

After you create a Job, Kubernetes automatically adds additional
{{< glossary_tooltip text="labels" term_id="label" >}} that
distinguish one Job's pods from another Job's pods.

In this example, each Job and its Pod template have a label:
`jobgroup=jobexample`.

Kubernetes itself pays no attention to labels named `jobgroup`. Setting a label
for all the Jobs you create from a template makes it convenient to operate on all
those Jobs at once.
In the [first example](#create-jobs-based-on-a-template) you used a template to
create several Jobs. The template ensures that each Pod also gets the same label, so
you can check on all Pods for these templated Jobs with a single command.

{{< note >}}
The label key `jobgroup` is not special or reserved.
You can pick your own labelling scheme.
There are [recommended labels](/docs/concepts/overview/working-with-objects/common-labels/#labels)
that you can use if you wish.
{{< /note >}}

## Alternatives

If you plan to create a large number of Job objects, you may find that:

- Even using labels, managing so many Jobs is cumbersome.
- If you create many Jobs in a batch, you might place high load
  on the Kubernetes control plane. Alternatively, the Kubernetes API
  server could rate limit you, temporarily rejecting your requests with a 429 status.
- You are limited by a {{< glossary_tooltip text="resource quota" term_id="resource-quota" >}}
  on Jobs: the API server permanently rejects some of your requests
  when you create a great deal of work in one batch.

There are other [job patterns](/docs/concepts/workloads/controllers/job/#job-patterns)
that you can use to process large amounts of work without creating very many Job
objects.

You could also consider writing your own [controller](/docs/concepts/architecture/controller/)
to manage Job objects automatically.

