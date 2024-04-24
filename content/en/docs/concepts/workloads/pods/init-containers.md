---
reviewers:
- erictune
title: Init Containers
content_type: concept
weight: 40
---

<!-- overview -->
This page provides an overview of init containers: specialized containers that run
before app containers in a {{< glossary_tooltip text="Pod" term_id="pod" >}}.
Init containers can contain utilities or setup scripts not present in an app image.

You can specify init containers in the Pod specification alongside the `containers`
array (which describes app containers).

In Kubernetes, a [sidecar container](/docs/concepts/workloads/pods/sidecar-containers/) is a container that
starts before the main application container and _continues to run_. This document is about init containers:
containers that run to completion during Pod initialization.

<!-- body -->

## Understanding init containers

A {{< glossary_tooltip text="Pod" term_id="pod" >}} can have multiple containers
running apps within it, but it can also have one or more init containers, which are run
before the app containers are started.

Init containers are exactly like regular containers, except:

* Init containers always run to completion.
* Each init container must complete successfully before the next one starts.

If a Pod's init container fails, the kubelet repeatedly restarts that init container until it succeeds.
However, if the Pod has a `restartPolicy` of Never, and an init container fails during startup of that Pod, Kubernetes treats the overall Pod as failed.

To specify an init container for a Pod, add the `initContainers` field into
the [Pod specification](/docs/reference/kubernetes-api/workload-resources/pod-v1/#PodSpec),
as an array of `container` items (similar to the app `containers` field and its contents).
See [Container](/docs/reference/kubernetes-api/workload-resources/pod-v1/#Container) in the
API reference for more details.

The status of the init containers is returned in `.status.initContainerStatuses`
field as an array of the container statuses (similar to the `.status.containerStatuses`
field).

### Differences from regular containers

Init containers support all the fields and features of app containers,
including resource limits, [volumes](/docs/concepts/storage/volumes/), and security settings. However, the
resource requests and limits for an init container are handled differently,
as documented in [Resource sharing within containers](#resource-sharing-within-containers).

Regular init containers (in other words: excluding sidecar containers) do not support the
`lifecycle`, `livenessProbe`, `readinessProbe`, or `startupProbe` fields. Init containers
must run to completion before the Pod can be ready; sidecar containers continue running
during a Pod's lifetime, and _do_ support some probes. See [sidecar container](/docs/concepts/workloads/pods/sidecar-containers/)
for further details about sidecar containers.

If you specify multiple init containers for a Pod, kubelet runs each init
container sequentially. Each init container must succeed before the next can run.
When all of the init containers have run to completion, kubelet initializes
the application containers for the Pod and runs them as usual.

### Differences from sidecar containers

Init containers run and complete their tasks before the main application container starts.
Unlike [sidecar containers](/docs/concepts/workloads/pods/sidecar-containers),
init containers are not continuously running alongside the main containers.

Init containers run to completion sequentially, and the main container does not start
until all the init containers have successfully completed.

init containers do not support `lifecycle`, `livenessProbe`, `readinessProbe`, or
`startupProbe` whereas sidecar containers support all these [probes](/docs/concepts/workloads/pods/pod-lifecycle/#types-of-probe) to control their lifecycle.

Init containers share the same resources (CPU, memory, network) with the main application
containers but do not interact directly with them. They can, however, use shared volumes
for data exchange.

## Using init containers

Because init containers have separate images from app containers, they
have some advantages for start-up related code:

* Init containers can contain utilities or custom code for setup that are not present in an app
  image. For example, there is no need to make an image `FROM` another image just to use a tool like
  `sed`, `awk`, `python`, or `dig` during setup.
* The application image builder and deployer roles can work independently without
  the need to jointly build a single app image.
* Init containers can run with a different view of the filesystem than app containers in the
  same Pod. Consequently, they can be given access to
  {{< glossary_tooltip text="Secrets" term_id="secret" >}} that app containers cannot access.
* Because init containers run to completion before any app containers start, init containers offer
  a mechanism to block or delay app container startup until a set of preconditions are met. Once
  preconditions are met, all of the app containers in a Pod can start in parallel.
* Init containers can securely run utilities or custom code that would otherwise make an app
  container image less secure. By keeping unnecessary tools separate you can limit the attack
  surface of your app container image.


### Examples
Here are some ideas for how to use init containers:

* Wait for a {{< glossary_tooltip text="Service" term_id="service">}} to
  be created, using a shell one-line command like:
  ```shell
  for i in {1..100}; do sleep 1; if nslookup myservice; then exit 0; fi; done; exit 1
  ```

* Register this Pod with a remote server from the downward API with a command like:
  ```shell
  curl -X POST http://$MANAGEMENT_SERVICE_HOST:$MANAGEMENT_SERVICE_PORT/register -d 'instance=$(<POD_NAME>)&ip=$(<POD_IP>)'
  ```

* Wait for some time before starting the app container with a command like
  ```shell
  sleep 60
  ```

* Clone a Git repository into a {{< glossary_tooltip text="Volume" term_id="volume" >}}

* Place values into a configuration file and run a template tool to dynamically
  generate a configuration file for the main app container. For example,
  place the `POD_IP` value in a configuration and generate the main app
  configuration file using Jinja.

#### Init containers in use

This example defines a simple Pod that has two init containers.
The first waits for `myservice`, and the second waits for `mydb`. Once both
init containers complete, the Pod runs the app container from its `spec` section.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: myapp-pod
  labels:
    app.kubernetes.io/name: MyApp
spec:
  containers:
  - name: myapp-container
    image: busybox:1.28
    command: ['sh', '-c', 'echo The app is running! && sleep 3600']
  initContainers:
  - name: init-myservice
    image: busybox:1.28
    command: ['sh', '-c', "until nslookup myservice.$(cat /var/run/secrets/kubernetes.io/serviceaccount/namespace).svc.cluster.local; do echo waiting for myservice; sleep 2; done"]
  - name: init-mydb
    image: busybox:1.28
    command: ['sh', '-c', "until nslookup mydb.$(cat /var/run/secrets/kubernetes.io/serviceaccount/namespace).svc.cluster.local; do echo waiting for mydb; sleep 2; done"]
```

You can start this Pod by running:

```shell
kubectl apply -f myapp.yaml
```
The output is similar to this:
```
pod/myapp-pod created
```

And check on its status with:
```shell
kubectl get -f myapp.yaml
```
The output is similar to this:
```
NAME        READY     STATUS     RESTARTS   AGE
myapp-pod   0/1       Init:0/2   0          6m
```

or for more details:
```shell
kubectl describe -f myapp.yaml
```
The output is similar to this:
```
Name:          myapp-pod
Namespace:     default
[...]
Labels:        app.kubernetes.io/name=MyApp
Status:        Pending
[...]
Init Containers:
  init-myservice:
[...]
    State:         Running
[...]
  init-mydb:
[...]
    State:         Waiting
      Reason:      PodInitializing
    Ready:         False
[...]
Containers:
  myapp-container:
[...]
    State:         Waiting
      Reason:      PodInitializing
    Ready:         False
[...]
Events:
  FirstSeen    LastSeen    Count    From                      SubObjectPath                           Type          Reason        Message
  ---------    --------    -----    ----                      -------------                           --------      ------        -------
  16s          16s         1        {default-scheduler }                                              Normal        Scheduled     Successfully assigned myapp-pod to 172.17.4.201
  16s          16s         1        {kubelet 172.17.4.201}    spec.initContainers{init-myservice}     Normal        Pulling       pulling image "busybox"
  13s          13s         1        {kubelet 172.17.4.201}    spec.initContainers{init-myservice}     Normal        Pulled        Successfully pulled image "busybox"
  13s          13s         1        {kubelet 172.17.4.201}    spec.initContainers{init-myservice}     Normal        Created       Created container init-myservice
  13s          13s         1        {kubelet 172.17.4.201}    spec.initContainers{init-myservice}     Normal        Started       Started container init-myservice
```

To see logs for the init containers in this Pod, run:
```shell
kubectl logs myapp-pod -c init-myservice # Inspect the first init container
kubectl logs myapp-pod -c init-mydb      # Inspect the second init container
```

At this point, those init containers will be waiting to discover {{< glossary_tooltip text="Services" term_id="service" >}} named
`mydb` and `myservice`.

Here's a configuration you can use to make those Services appear:

```yaml
---
apiVersion: v1
kind: Service
metadata:
  name: myservice
spec:
  ports:
  - protocol: TCP
    port: 80
    targetPort: 9376
---
apiVersion: v1
kind: Service
metadata:
  name: mydb
spec:
  ports:
  - protocol: TCP
    port: 80
    targetPort: 9377
```

To create the `mydb` and `myservice` services:

```shell
kubectl apply -f services.yaml
```
The output is similar to this:
```
service/myservice created
service/mydb created
```

You'll then see that those init containers complete, and that the `myapp-pod`
Pod moves into the Running state:

```shell
kubectl get -f myapp.yaml
```
The output is similar to this:
```
NAME        READY     STATUS    RESTARTS   AGE
myapp-pod   1/1       Running   0          9m
```

This simple example should provide some inspiration for you to create your own
init containers. [What's next](#what-s-next) contains a link to a more detailed example.

## Detailed behavior

During Pod startup, the kubelet delays running init containers until the networking
and storage are ready. Then the kubelet runs the Pod's init containers in the order
they appear in the Pod's spec.

Each init container must exit successfully before
the next container starts. If a container fails to start due to the runtime or
exits with failure, it is retried according to the Pod `restartPolicy`. However,
if the Pod `restartPolicy` is set to Always, the init containers use
`restartPolicy` OnFailure.

A Pod cannot be `Ready` until all init containers have succeeded. The ports on an
init container are not aggregated under a Service. A Pod that is initializing
is in the `Pending` state but should have a condition `Initialized` set to false.

If the Pod [restarts](#pod-restart-reasons), or is restarted, all init containers
must execute again.

Changes to the init container spec are limited to the container image field.
Altering an init container image field is equivalent to restarting the Pod.

Because init containers can be restarted, retried, or re-executed, init container
code should be idempotent. In particular, code that writes to files on `EmptyDirs`
should be prepared for the possibility that an output file already exists.

Init containers have all of the fields of an app container. However, Kubernetes
prohibits `readinessProbe` from being used because init containers cannot
define readiness distinct from completion. This is enforced during validation.

Use `activeDeadlineSeconds` on the Pod to prevent init containers from failing forever.
The active deadline includes init containers.
However it is recommended to use `activeDeadlineSeconds` only if teams deploy their application
as a Job, because `activeDeadlineSeconds` has an effect even after initContainer finished.
The Pod which is already running correctly would be killed by `activeDeadlineSeconds` if you set.

The name of each app and init container in a Pod must be unique; a
validation error is thrown for any container sharing a name with another.

### Resource sharing within containers

Given the order of execution for init, sidecar and app containers, the following rules
for resource usage apply:

* The highest of any particular resource request or limit defined on all init
  containers is the *effective init request/limit*. If any resource has no
  resource limit specified this is considered as the highest limit.
* The Pod's *effective request/limit* for a resource is the higher of:
  * the sum of all app containers request/limit for a resource
  * the effective init request/limit for a resource
* Scheduling is done based on effective requests/limits, which means
  init containers can reserve resources for initialization that are not used
  during the life of the Pod.
* The QoS (quality of service) tier of the Pod's *effective QoS tier* is the
  QoS tier for init containers and app containers alike.

Quota and limits are applied based on the effective Pod request and
limit.

### Init containers and Linux cgroups {#cgroups}

On Linux, resource allocations for Pod level control groups (cgroups) are based on the effective Pod
request and limit, the same as the scheduler.

{{< comment >}}
This section also present under [sidecar containers](/docs/concepts/workloads/pods/sidecar-containers/) page.
If you're editing this section, change both places.
{{< /comment >}}

### Pod restart reasons

A Pod can restart, causing re-execution of init containers, for the following
reasons:

* The Pod infrastructure container is restarted. This is uncommon and would
  have to be done by someone with root access to nodes.
* All containers in a Pod are terminated while `restartPolicy` is set to Always,
  forcing a restart, and the init container completion record has been lost due
  to {{< glossary_tooltip text="garbage collection" term_id="garbage-collection" >}}.

The Pod will not be restarted when the init container image is changed, or the
init container completion record has been lost due to garbage collection. This
applies for Kubernetes v1.20 and later. If you are using an earlier version of
Kubernetes, consult the documentation for the version you are using.

## {{% heading "whatsnext" %}}

Learn more about the following:
* [Creating a Pod that has an init container](/docs/tasks/configure-pod-container/configure-pod-initialization/#create-a-pod-that-has-an-init-container).
* [Debug init containers](/docs/tasks/debug/debug-application/debug-init-containers/).
* Overview of [kubelet](/docs/reference/command-line-tools-reference/kubelet/) and [kubectl](/docs/reference/kubectl/).
* [Types of probes](/docs/concepts/workloads/pods/pod-lifecycle/#types-of-probe): liveness, readiness, startup probe.
* [Sidecar containers](/docs/concepts/workloads/pods/sidecar-containers).
