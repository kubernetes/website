---
reviewers:
- mikedanese
- thockin
title: Debug Pods
content_type: task
weight: 10
---

<!-- overview -->

This guide is to help users debug applications that are deployed into Kubernetes
and not behaving correctly. This is *not* a guide for people who want to debug their cluster.
For that you should check out [this guide](/docs/tasks/debug/debug-cluster).

<!-- body -->

## Diagnosing the problem

The first step in troubleshooting is triage. What is the problem?
Is it your Pods, your Replication Controller or your Service?

   * [Debugging Pods](#debugging-pods)
   * [Debugging Replication Controllers](#debugging-replication-controllers)
   * [Debugging Services](#debugging-services)

### Debugging Pods

The first step in debugging a Pod is taking a look at it. Check the current
state of the Pod and recent events with the following command:

```shell
kubectl describe pods ${POD_NAME}
```

Look at the state of the containers in the pod. Are they all `Running`?
Have there been recent restarts?

Continue debugging depending on the state of the pods.

#### My pod stays pending

If a Pod is stuck in `Pending` it means that it can not be scheduled onto a node.
Generally this is because there are insufficient resources of one type or another
that prevent scheduling. Look at the output of the `kubectl describe ...` command above.
There should be messages from the scheduler about why it can not schedule your pod.
Reasons include:

* **You don't have enough resources**: You may have exhausted the supply of CPU
  or Memory in your cluster, in this case you need to delete Pods, adjust resource
  requests, or add new nodes to your cluster. See [Compute Resources document](/docs/concepts/configuration/manage-resources-containers/)
  for more information.

* **You are using `hostPort`**: When you bind a Pod to a `hostPort` there are a
  limited number of places that pod can be scheduled. In most cases, `hostPort`
  is unnecessary, try using a Service object to expose your Pod.  If you do require
  `hostPort` then you can only schedule as many Pods as there are nodes in your Kubernetes cluster.


#### My pod stays waiting

If a Pod is stuck in the `Waiting` state, then it has been scheduled to a worker node, 
but it can't run on that machine. Again, the information from `kubectl describe ...`
should be informative. The most common cause of `Waiting` pods is a failure to pull the image.
There are three things to check:

* Make sure that you have the name of the image correct.
* Have you pushed the image to the registry?
* Try to manually pull the image to see if the image can be pulled. For example,
  if you use Docker on your PC, run `docker pull <image>`.


#### My pod stays terminating

If a Pod is stuck in the `Terminating` state, it means that a deletion has been
issued for the Pod, but the control plane is unable to delete the Pod object.

This typically happens if the Pod has a [finalizer](/docs/concepts/overview/working-with-objects/finalizers/)
and there is an [admission webhook](/docs/reference/access-authn-authz/extensible-admission-controllers/)
installed in the cluster that prevents the control plane from removing the
finalizer.

To identify this scenario, check if your cluster has any
ValidatingWebhookConfiguration or MutatingWebhookConfiguration that target
`UPDATE` operations for `pods` resources.

If the webhook is provided by a third-party:
- Make sure you are using the latest version.
- Disable the webhook for `UPDATE` operations.
- Report an issue with the corresponding provider.

If you are the author of the webhook:
- For a mutating webhook, make sure it never changes immutable fields on
  `UPDATE` operations. For example, changes to containers are usually not allowed.
- For a validating webhook, make sure that your validation policies only apply
  to new changes. In other words, you should allow Pods with existing violations
  to pass validation. This allows Pods that were created before the validating
  webhook was installed to continue running.

#### My pod is crashing or otherwise unhealthy

Once your pod has been scheduled, the methods described in
[Debug Running Pods](/docs/tasks/debug/debug-application/debug-running-pod/)
are available for debugging.

#### My pod is running but not doing what I told it to do

If your pod is not behaving as you expected, it may be that there was an error in your
pod description (e.g. `mypod.yaml` file on your local machine), and that the error
was silently ignored when you created the pod.  Often a section of the pod description
is nested incorrectly, or a key name is typed incorrectly, and so the key is ignored.
For example, if you misspelled `command` as `commnd` then the pod will be created but
will not use the command line you intended it to use.

The first thing to do is to delete your pod and try creating it again with the `--validate` option.
For example, run `kubectl apply --validate -f mypod.yaml`.
If you misspelled `command` as `commnd` then will give an error like this:

```shell
I0805 10:43:25.129850   46757 schema.go:126] unknown field: commnd
I0805 10:43:25.129973   46757 schema.go:129] this may be a false alarm, see https://github.com/kubernetes/kubernetes/issues/6842
pods/mypod
```

<!-- TODO: Now that #11914 is merged, this advice may need to be updated -->

The next thing to check is whether the pod on the apiserver
matches the pod you meant to create (e.g. in a yaml file on your local machine).
For example, run `kubectl get pods/mypod -o yaml > mypod-on-apiserver.yaml` and then
manually compare the original pod description, `mypod.yaml` with the one you got
back from apiserver, `mypod-on-apiserver.yaml`. There will typically be some
lines on the "apiserver" version that are not on the original version. This is
expected. However, if there are lines on the original that are not on the apiserver
version, then this may indicate a problem with your pod spec.

### Debugging Replication Controllers

Replication controllers are fairly straightforward. They can either create Pods or they can't.
If they can't create pods, then please refer to the
[instructions above](#debugging-pods) to debug your pods.

You can also use `kubectl describe rc ${CONTROLLER_NAME}` to introspect events
related to the replication controller.

### Debugging Services

Services provide load balancing across a set of pods. There are several common problems that can make Services
not work properly.  The following instructions should help debug Service problems.

First, verify that there are endpoints for the service. For every Service object,
the apiserver makes an `endpoints` resource available.

You can view this resource with:

```shell
kubectl get endpoints ${SERVICE_NAME}
```

Make sure that the endpoints match up with the number of pods that you expect to be members of your service.
For example, if your Service is for an nginx container with 3 replicas, you would expect to see three different
IP addresses in the Service's endpoints.

#### My service is missing endpoints

If you are missing endpoints, try listing pods using the labels that Service uses.
Imagine that you have a Service where the labels are:

```yaml
...
spec:
  - selector:
     name: nginx
     type: frontend
```

You can use:

```shell
kubectl get pods --selector=name=nginx,type=frontend
```

to list pods that match this selector. Verify that the list matches the Pods that you expect to provide your Service.
Verify that the pod's `containerPort` matches up with the Service's `targetPort`

#### Network traffic is not forwarded

Please see [debugging service](/docs/tasks/debug/debug-application/debug-service/) for more information.

## {{% heading "whatsnext" %}}

If none of the above solves your problem, follow the instructions in
[Debugging Service document](/docs/tasks/debug/debug-application/debug-service/)
to make sure that your `Service` is running, has `Endpoints`, and your `Pods` are
actually serving; you have DNS working, iptables rules installed, and kube-proxy
does not seem to be misbehaving.

You may also visit [troubleshooting document](/docs/tasks/debug/) for more information.
