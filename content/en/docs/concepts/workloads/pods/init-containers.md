---
reviewers:
- erictune
title: Init Containers
content_template: templates/concept
weight: 40
---

{{% capture overview %}}
This page provides an overview of Init Containers, which are specialized
Containers that run before app Containers and can contain utilities or setup
scripts not present in an app image.
{{% /capture %}}


This feature has exited beta in 1.6. Init Containers can be specified in the PodSpec
alongside the app `containers` array. The beta annotation value will still be respected
and overrides the PodSpec field value, however, they are deprecated in 1.6 and 1.7.
In 1.8, the annotations are no longer supported and must be converted to the PodSpec field.

{{% capture body %}}
## Understanding Init Containers

A [Pod](/docs/concepts/workloads/pods/pod-overview/) can have multiple Containers running
apps within it, but it can also have one or more Init Containers, which are run
before the app Containers are started.

Init Containers are exactly like regular Containers, except:

* They always run to completion.
* Each one must complete successfully before the next one is started.

If an Init Container fails for a Pod, Kubernetes restarts the Pod repeatedly until the Init
Container succeeds. However, if the Pod has a `restartPolicy` of Never, it is not restarted.

To specify a Container as an Init Container, add the `initContainers` field on the PodSpec as
a JSON array of objects of type
[Container](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#container-v1-core)
alongside the app `containers` array.
The status of the init containers is returned in `.status.initContainerStatuses`
field as an array of the container statuses (similar to the `.status.containerStatuses`
field).

### Differences from regular Containers

Init Containers support all the fields and features of app Containers,
including resource limits, volumes, and security settings. However, the
resource requests and limits for an Init Container are handled slightly
differently, which are documented in [Resources](#resources) below.  Also, Init Containers do not
support readiness probes because they must run to completion before the Pod can
be ready.

If multiple Init Containers are specified for a Pod, those Containers are run
one at a time in sequential order. Each must succeed before the next can run.
When all of the Init Containers have run to completion, Kubernetes initializes
the Pod and runs the application Containers as usual.

## What can Init Containers be used for?

Because Init Containers have separate images from app Containers, they
have some advantages for start-up related code:

* They can contain and run utilities that are not desirable to include in the
  app Container image for security reasons.
* They can contain utilities or custom code for setup that is not present in an app
  image. For example, there is no need to make an image `FROM` another image just to use a tool like
  `sed`, `awk`, `python`, or `dig` during setup.
* The application image builder and deployer roles can work independently without
  the need to jointly build a single app image.
* They use Linux namespaces so that they have different filesystem views from app Containers.
  Consequently, they can be given access to Secrets that app Containers are not able to
  access.
* They run to completion before any app Containers start, whereas app
  Containers run in parallel, so Init Containers provide an easy way to block or
  delay the startup of app Containers until some set of preconditions are met.

### Examples
Here are some ideas for how to use Init Containers:

* Wait for a service to be created with a shell command like:

      for i in {1..100}; do sleep 1; if dig myservice; then exit 0; fi; done; exit 1

* Register this Pod with a remote server from the downward API with a command like:

      `curl -X POST http://$MANAGEMENT_SERVICE_HOST:$MANAGEMENT_SERVICE_PORT/register -d 'instance=$(<POD_NAME>)&ip=$(<POD_IP>)'`

* Wait for some time before starting the app Container with a command like `sleep 60`.
* Clone a git repository into a volume.
* Place values into a configuration file and run a template tool to dynamically
  generate a configuration file for the main app Container. For example,
  place the POD_IP value in a configuration and generate the main app
  configuration file using Jinja.

More detailed usage examples can be found in the [StatefulSets documentation](/docs/concepts/workloads/controllers/statefulset/)
and the [Production Pods guide](/docs/tasks/configure-pod-container/configure-pod-initialization/).

### Init Containers in use

The following yaml file for Kubernetes 1.5 outlines a simple Pod which has two Init Containers.
The first waits for `myservice` and the second waits for `mydb`. Once both
containers complete, the Pod will begin.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: myapp-pod
  labels:
    app: myapp
  annotations:
    pod.beta.kubernetes.io/init-containers: '[
        {
            "name": "init-myservice",
            "image": "busybox:1.28",
            "command": ["sh", "-c", "until nslookup myservice; do echo waiting for myservice; sleep 2; done;"]
        },
        {
            "name": "init-mydb",
            "image": "busybox:1.28",
            "command": ["sh", "-c", "until nslookup mydb; do echo waiting for mydb; sleep 2; done;"]
        }
    ]'
spec:
  containers:
  - name: myapp-container
    image: busybox:1.28
    command: ['sh', '-c', 'echo The app is running! && sleep 3600']
```

There is a new syntax in Kubernetes 1.6, although the old annotation syntax still works for 1.6 and 1.7.  The new syntax must be used for 1.8 or greater. We have moved the declaration of Init Containers to `spec`:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: myapp-pod
  labels:
    app: myapp
spec:
  containers:
  - name: myapp-container
    image: busybox:1.28
    command: ['sh', '-c', 'echo The app is running! && sleep 3600']
  initContainers:
  - name: init-myservice
    image: busybox:1.28
    command: ['sh', '-c', 'until nslookup myservice; do echo waiting for myservice; sleep 2; done;']
  - name: init-mydb
    image: busybox:1.28
    command: ['sh', '-c', 'until nslookup mydb; do echo waiting for mydb; sleep 2; done;']
```

1.5 syntax still works on 1.6, but we recommend using 1.6 syntax. In Kubernetes 1.6, Init Containers were made a field in the API. The beta annotation is still respected in 1.6 and 1.7, but is not supported in 1.8 or greater.

Yaml file below outlines the `mydb` and `myservice` services:

```yaml
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

This Pod can be started and debugged with the following commands:

```shell
kubectl apply -f myapp.yaml
```
```
pod/myapp-pod created
```

```shell
kubectl get -f myapp.yaml
```
```
NAME        READY     STATUS     RESTARTS   AGE
myapp-pod   0/1       Init:0/2   0          6m
```

```shell
kubectl describe -f myapp.yaml
```
```
Name:          myapp-pod
Namespace:     default
[...]
Labels:        app=myapp
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
  13s          13s         1        {kubelet 172.17.4.201}    spec.initContainers{init-myservice}     Normal        Created       Created container with docker id 5ced34a04634; Security:[seccomp=unconfined]
  13s          13s         1        {kubelet 172.17.4.201}    spec.initContainers{init-myservice}     Normal        Started       Started container with docker id 5ced34a04634
```
```shell
kubectl logs myapp-pod -c init-myservice # Inspect the first init container
kubectl logs myapp-pod -c init-mydb      # Inspect the second init container
```

Once we start the `mydb` and `myservice` services, we can see the Init Containers
complete and the `myapp-pod` is created:

```shell
kubectl apply -f services.yaml
```
```
service/myservice created
service/mydb created
```

```shell
kubectl get -f myapp.yaml
NAME        READY     STATUS    RESTARTS   AGE
myapp-pod   1/1       Running   0          9m
```

This example is very simple but should provide some inspiration for you to
create your own Init Containers.

## Detailed behavior

During the startup of a Pod, the Init Containers are started in order, after the
network and volumes are initialized. Each Container must exit successfully before
the next is started. If a Container fails to start due to the runtime or
exits with failure, it is retried according to the Pod `restartPolicy`. However,
if the Pod `restartPolicy` is set to Always, the Init Containers use
`RestartPolicy` OnFailure.

A Pod cannot be `Ready` until all Init Containers have succeeded. The ports on an
Init Container are not aggregated under a service. A Pod that is initializing
is in the `Pending` state but should have a condition `Initializing` set to true.

If the Pod is [restarted](#pod-restart-reasons), all Init Containers must
execute again.

Changes to the Init Container spec are limited to the container image field.
Altering an Init Container image field is equivalent to restarting the Pod.

Because Init Containers can be restarted, retried, or re-executed, Init Container
code should be idempotent. In particular, code that writes to files on `EmptyDirs`
should be prepared for the possibility that an output file already exists.

Init Containers have all of the fields of an app Container. However, Kubernetes
prohibits `readinessProbe` from being used because Init Containers cannot
define readiness distinct from completion. This is enforced during validation.

Use `activeDeadlineSeconds` on the Pod and `livenessProbe` on the Container to
prevent Init Containers from failing forever. The active deadline includes Init
Containers.

The name of each app and Init Container in a Pod must be unique; a
validation error is thrown for any Container sharing a name with another.

### Resources

Given the ordering and execution for Init Containers, the following rules
for resource usage apply:

* The highest of any particular resource request or limit defined on all Init
  Containers is the *effective init request/limit*
* The Pod's *effective request/limit* for a resource is the higher of:
  * the sum of all app Containers request/limit for a resource
  * the effective init request/limit for a resource
* Scheduling is done based on effective requests/limits, which means
  Init Containers can reserve resources for initialization that are not used
  during the life of the Pod.
* QoS tier of the Pod's *effective QoS tier* is the QoS tier for Init Containers
  and app containers alike.

Quota and limits are applied based on the effective Pod request and
limit.

Pod level cgroups are based on the effective Pod request and limit, the
same as the scheduler.


### Pod restart reasons

A Pod can restart, causing re-execution of Init Containers, for the following
reasons:

* A user updates the PodSpec causing the Init Container image to change. Any
  changes to the Init Container image restarts the Pod. App Container image 
  changes only restart the app Container.
* The Pod infrastructure container is restarted. This is uncommon and would
  have to be done by someone with root access to nodes.
* All containers in a Pod are terminated while `restartPolicy` is set to Always,
  forcing a restart, and the Init Container completion record has been lost due
  to garbage collection.

## Support and compatibility

A cluster with Apiserver version 1.6.0 or greater supports Init Containers
using the `.spec.initContainers` field. Previous versions support Init Containers
using the alpha or beta annotations. The `.spec.initContainers` field is also mirrored
into alpha and beta annotations so that Kubelets version 1.3.0 or greater can execute
Init Containers, and so that a version 1.6 apiserver can safely be rolled back to version
1.5.x without losing Init Container functionality for existing created pods.

In Apiserver and Kubelet versions 1.8.0 or greater, support for the alpha and beta annotations
is removed, requiring a conversion from the deprecated annotations to the
`.spec.initContainers` field.

{{% /capture %}}


{{% capture whatsnext %}}

* [Creating a Pod that has an Init Container](/docs/tasks/configure-pod-container/configure-pod-initialization/#creating-a-pod-that-has-an-init-container)

{{% /capture %}}
