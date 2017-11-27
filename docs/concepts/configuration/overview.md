---
approvers:
- mikedanese
title: Configuration Best Practices
---

{% capture overview %}
This document highlights and consolidates configuration best practices that are introduced throughout the user-guide, getting-started documentation and examples.

This is a living document. If you think of something that is not on this list but might be useful to others, please don't hesitate to file an issue or submit a PR.
{% endcapture %}

{% capture body %}
## General Config Tips

- When defining configurations, specify the latest stable API version (currently v1).

- Configuration files should be stored in version control before being pushed to the cluster. This allows quick roll-back of a configuration if needed. It also aids with cluster re-creation and restoration if necessary.

- Write your configuration files using YAML rather than JSON. Though these formats can be used interchangeably in almost all scenarios, YAML tends to be more user-friendly.

- Group related objects into a single file whenever it makes sense. One file is often easier to manage than several. See the [guestbook-all-in-one.yaml](https://github.com/kubernetes/examples/tree/{{page.githubbranch}}/guestbook/all-in-one/guestbook-all-in-one.yaml) file as an example of this syntax.

  Note also that many `kubectl` commands can be called on a directory, so you can also call `kubectl create` on a directory of config files. See below for more details.

- Don't specify default values unnecessarily -- simple and minimal configs will reduce errors.

- Put an object description in an annotation to allow better introspection.


## "Naked" Pods vs Replication Controllers and Jobs

- If there is a viable alternative to naked pods (in other words: pods not bound to a [replication controller](/docs/user-guide/replication-controller)), go with the alternative. Naked pods will not be rescheduled in the event of node failure.

  Replication controllers are almost always preferable to creating pods, except for some explicit [`restartPolicy: Never`](/docs/concepts/workloads/pods/pod-lifecycle/#restart-policy) scenarios. A [Job](/docs/concepts/jobs/run-to-completion-finite-workloads/) object (currently in Beta) may also be appropriate.


## Services

- It's typically best to create a [service](/docs/concepts/services-networking/service/) before corresponding [replication controllers](/docs/concepts/workloads/controllers/replicationcontroller/). This lets the scheduler spread the pods that comprise the service.

  You can also use this process to ensure that at least one replica works before creating lots of them:

    1. Create a replication controller without specifying replicas (this will set replicas=1);
    2. Create a service;
    3. Then scale up the replication controller.

- Don't use `hostPort` unless it is absolutely necessary (for example: for a node daemon).
  It specifies the port number to expose on the host.
  When you bind a Pod to a `hostPort`, there are a limited number of places to schedule a pod due to port conflicts.
  The conflict comes from the requirement of an unique <hostIP,hostPort,protocol> combination.
  Different <hostIP,hostPort,protocol> combinations mean different requirements.
  For example, a pod that binds to host port 80 on 127.0.0.1 with TCP protocol has no conflict with another Pod that binds to host port 80 on 127.0.0.2 with TCP protocol.
  
  *Special notes on hostIP and protocol*: If you don't specify the hostIP and protocol explicitly,
  kubernetes will use 0.0.0.0 and TCP as the default hostIP and protocol, 
  where "0.0.0.0" is a wildcard IP that will match all <*,hostPort,protocol> on the node the pod is scheduled on.
  Specifically, it will match all <IP,hostPort,protocol> tuples for all IPs on the host.

  If you only need access to the port for debugging purposes, you can use the [kubectl proxy and apiserver proxy](/docs/tasks/access-kubernetes-api/http-proxy-access-api/) or [kubectl port-forward](/docs/tasks/access-application-cluster/port-forward-access-application-cluster/).
  You can use a [Service](/docs/concepts/services-networking/service/) object for external service access.

  If you explicitly need to expose a pod's port on the host machine, consider using a [NodePort](/docs/concepts/services-networking/service/#type-nodeport) service before resorting to `hostPort`.

- Avoid using `hostNetwork`, for the same reasons as `hostPort`.

- Use _headless services_ for easy service discovery when you don't need kube-proxy load balancing. See [headless services](/docs/concepts/services-networking/service/#headless-services).

## Using Labels

- Define and use [labels](/docs/concepts/overview/working-with-objects/labels/) that identify __semantic attributes__ of your application or deployment. For example, instead of attaching a label to a set of pods to explicitly represent some service (For example, `service: myservice`), or explicitly representing the replication controller managing the pods  (for example, `controller: mycontroller`), attach labels that identify semantic attributes, such as `{ app: myapp, tier: frontend, phase: test, deployment: v3 }`. This will let you select the object groups appropriate to the context— for example, a service for all "tier: frontend" pods, or all "test" phase components of app "myapp". See the [guestbook](https://github.com/kubernetes/examples/tree/{{page.githubbranch}}/guestbook/) app for an example of this approach.

  A service can be made to span multiple deployments, such as is done across [rolling updates](/docs/tasks/run-application/rolling-update-replication-controller/), by simply omitting release-specific labels from its selector, rather than updating a service's selector to match the replication controller's selector fully.

- To facilitate rolling updates, include version info in replication controller names, for example as a suffix to the name. It is useful to set a `version` label as well. The rolling update creates a new controller as opposed to modifying the existing controller. So, there will be issues with version-agnostic controller names. See the [documentation](/docs/tasks/run-application/rolling-update-replication-controller/) on the rolling-update command for more detail.

  Note that the [Deployment](/docs/concepts/workloads/controllers/deployment/) object obviates the need to manage replication controller `version names`. A desired state of an object is described by a Deployment, and if changes to that spec are _applied_, the deployment controller changes the actual state to the desired state at a controlled rate. (Deployment objects are currently part of the [`extensions` API Group](/docs/concepts/overview/kubernetes-api/#api-groups).)

- You can manipulate labels for debugging. Because Kubernetes replication controllers and services match to pods using labels, this allows you to remove a pod from being considered by a controller, or served traffic by a service, by removing the relevant selector labels. If you remove the labels of an existing pod, its controller will create a new pod to take its place. This is a useful way to debug a previously "live" pod in a quarantine environment. See the [`kubectl label`](/docs/concepts/overview/working-with-objects/labels/) command.

## Container Images

- The [default container image pull policy](/docs/concepts/containers/images/) is `IfNotPresent`, which causes the [Kubelet](/docs/admin/kubelet/) to not pull an image if it already exists. If you would like to always force a pull, you must specify a pull image policy of `Always` in your .yaml file (`imagePullPolicy: Always`) or specify a `:latest` tag on your image.

  That is, if you're specifying an image with other than the `:latest` tag, for example `myimage:v1`, and there is an image update to that same tag, the Kubelet won't pull the updated image. You can address this by ensuring that any updates to an image bump the image tag as well (for example, `myimage:v2`), and ensuring that your configs point to the correct version.

  **Note:** You should avoid using `:latest` tag when deploying containers in production, because this makes it hard to track which version of the image is running and hard to roll back.

- To work only with a specific version of an image, you can specify an image with its digest (SHA256). This approach guarantees that the image will never update. For detailed information about working with image digests, see [the Docker documentation](https://docs.docker.com/engine/reference/commandline/pull/#pull-an-image-by-digest-immutable-identifier).

## Using kubectl

- Use `kubectl create -f <directory>` where possible. This looks for config objects in all `.yaml`, `.yml`, and `.json` files in `<directory>` and passes them to `create`.

- Use `kubectl delete` rather than `stop`. `Delete` has a superset of the functionality of `stop`, and `stop` is deprecated.

- Use kubectl bulk operations (via files and/or labels) for get and delete. See [label selectors](/docs/concepts/overview/working-with-objects/labels/#label-selectors) and [using labels effectively](/docs/concepts/cluster-administration/manage-deployment/#using-labels-effectively).

- Use `kubectl run` and `expose` to quickly create and expose single container Deployments. See the [quick start guide](/docs/user-guide/quick-start/) for an example.

{% endcapture %}

{% include templates/concept.md %}
