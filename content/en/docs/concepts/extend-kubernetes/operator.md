---
title: Operator pattern
content_template: templates/concept
weight: 30
---

{{% capture overview %}}

Operators are software extensions to Kubernetes that make use of third-party
resources to manage applications and their components. Operators follow
Kubernetes principles, notably the [control loop](/docs/concepts/#kubernetes-control-plane).

{{% /capture %}}


{{% capture body %}}

## Motivation

The Operator pattern aims to capture the key aim of a human operator who
is managing a service or set of services. Human operators who look after
specific applications and services have deep knowledge of how the system
ought to behave, how to deploy it, and how to react if there are problems.

People who run workloads on Kubernetes often like to use automation to take
care of repeatable tasks. The Operator pattern captures how you can write
code to automate a task beyond what Kubernetes itself provides.

## Operators in Kubernetes

Kubernetes is designed for automation. Out of the box, you get lots of
built-in automation from the core of Kubernetes. You can use Kubernetes
to automate deploying and running workloads, *and* you can automate how
Kubernetes does that.

Kubernetes' {{< glossary_tooltip text="controllers" term_id="controller" >}}
concept lets you extend the cluster's behaviour without modifying the code
of Kubernetes itself.
Operators are clients of the Kubernetes API that act as controllers for
a [Custom Resource](/docs/concepts/api-extension/custom-resources/).

## An example Operator {#example}

Some of the things that you can use an operator to automate include:

* deploying an application on demand
* taking and restoring backups of that application's state
* handling upgrades of the application code alongside related changes such
  as database schemas or extra configuration settings
* publishing a Service to applications that don't support Kubernetes APIs to
  discover them
* simulating failure in all or part of your cluster to test its resilience
* choosing a leader for a distributed application without an internal
  member election process

What might an Operator look like in more detail? Here's an example in more
detail:

1. A custom resource named SampleDB, that you can configure into the cluster.
2. A Deployment that makes sure a Pod is running that contains the
   controller part of the operator.
3. A container image of the operator code.
4. Controller code that queries the control plane to find out what SampleDB
   resources are configured.
5. The core of the Operator is code to tell the API server how to make
   reality match the configured resources.
   * If you add a new SampleDB, the operator sets up PersistentVolumeClaims
     to provide durable database storage, a StatefulSet to run SampleDB and
     a Job to handle initial configuration.
   * If you delete it, the Operator takes a snapshot, then makes sure that
     the the StatefulSet and Volumes are also removed.
6. The operator also manages regular database backups. For each SampleDB
   resource, the operator determines when to create a Pod that can connect
   to the database and take backups. These Pods would rely on a ConfigMap
   and / or a Secret that has database connection details and credentials.
7. Because the Operator aims to provide robust automation for the resource
   it manages, there would be additional supporting code. For this example,
   code checks to see if the database is running an old version and, if so,
   creates Job objects that upgrade it for you.

## Deploying Operators

The most common way to deploy an Operator is to add the
Custom Resource Definition and its associated Controller to your cluster.
The Controller will normally run outside of the
{{< glossary_tooltip text="control plane" term_id="control-plane" >}},
much as you would run any containerized application.
For example, you can run the controller in your cluster as a Deployment.

## Using an Operator {#using-operators}

Once you have an Operator deployed, you'd use it by adding, modifying or
deleting the kind of resource that the Operator uses. Following the above
example, you would set up a Deployment for the Operator itself, and then:

```shell
kubectl get SampleDB                   # find configured databases

kubectl edit SampleDB/example-database # manually change some settings
```

&hellip;and that's it! The Operator will take care of applying the changes
as well as keeping the existing service in good shape.

## Writing your own Operator {#writing-operator}

If there isn't an Operator in the ecosystem that implements the behavior you
want, you can code your own. In [What's next](#what-s-next) you'll find a few
links to libraries and tools you can use to write your own cloud native
Operator.

You also implement an Operator (that is, a Controller) using any language / runtime
that can act as a [client for the Kubernetes API](/docs/reference/using-api/client-libraries/).

{{% /capture %}}

{{% capture whatsnext %}}

* Learn more about [Custom Resources](/docs/concepts/extend-kubernetes/api-extension/custom-resources/)
* Find ready-made operators on [OperatorHub.io](https://operatorhub.io/) to suit your use case
* Use existing tools to write your own operator, eg:
  * using [KUDO](https://kudo.dev/) (Kubernetes Universal Declarative Operator)
  * using [kubebuilder](https://book.kubebuilder.io/)
  * using [Metacontroller](https://metacontroller.app/) along with WebHooks that
    you implement yourself
  * using the [Operator Framework](https://github.com/operator-framework/getting-started)
* [Publish](https://operatorhub.io/) your operator for other people to use
* Read [CoreOS' original article](https://coreos.com/blog/introducing-operators.html) that introduced the Operator pattern
* Read an [article](https://cloud.google.com/blog/products/containers-kubernetes/best-practices-for-building-kubernetes-operators-and-stateful-apps) from Google Cloud about best practices for building Operators

{{% /capture %}}
