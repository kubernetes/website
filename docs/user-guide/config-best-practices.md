---
assignees:
- mikedanese

---

This document is meant to highlight and consolidate in one place configuration best practices that are introduced throughout the user-guide and getting-started documentation and examples. This is a living document so if you think of something that is not on this list but might be useful to others, please don't hesitate to file an issue or submit a PR.

## General Config Tips

- When defining configurations, specify the latest stable API version (currently v1).

- Configuration files should be stored in version control before being pushed to the cluster. This allows a configuration to be quickly rolled back if needed, and will aid with cluster re-creation and restoration if necessary.

- Write your configuration files using YAML rather than JSON. They can be used interchangeably in almost all scenarios, but YAML tends to be more user-friendly for config.

- Group related objects together in a single file where this makes sense. This format is often easier to manage than separate files. See the [guestbook-all-in-one.yaml](https://github.com/kubernetes/kubernetes/tree/{{page.githubbranch}}/examples/guestbook/all-in-one/guestbook-all-in-one.yaml) file as an example of this syntax.
(Note also that many `kubectl` commands can be called on a directory, and so you can also call
`kubectl create` on a directory of config files— see below for more detail).

- Don't specify default values unnecessarily, in order to simplify and minimize configs, and to
  reduce error. For example, omit the selector and labels in a `ReplicationController` if you want
  them to be the same as the labels in its `podTemplate`, since those fields are populated from the
  `podTemplate` labels by default. See the [guestbook app's](https://github.com/kubernetes/kubernetes/tree/{{page.githubbranch}}/examples/guestbook/) .yaml files for some [examples](https://github.com/kubernetes/kubernetes/tree/{{page.githubbranch}}/examples/guestbook/frontend-controller.yaml) of this.

- Put an object description in an annotation to allow better introspection.


## "Naked" Pods vs Replication Controllers and Jobs

- If there is a viable alternative to naked pods (i.e., pods not bound to a [replication controller
  ](/docs/user-guide/replication-controller)), go with the alternative. Naked pods will not be rescheduled in the
  event of node failure.

  Replication controllers are almost always preferable to creating pods, except for some explicit
  [`restartPolicy: Never`](/docs/user-guide/pod-states/#restartpolicy) scenarios.  A
  [Job](/docs/user-guide/jobs/) object (currently in Beta), may also be appropriate.


## Services

- It's typically best to create a [service](/docs/user-guide/services/) before corresponding [replication
  controllers](/docs/user-guide/replication-controller/), so that the scheduler can spread the pods comprising the
  service. You can also create a replication controller without specifying replicas (this will set
  replicas=1), create a service, then scale up the replication controller. This can be useful in
  ensuring that one replica works before creating lots of them.

- Don't use `hostPort` (which specifies the port number to expose on the host) unless absolutely
  necessary, e.g., for a node daemon. When you bind a Pod to a `hostPort`, there are a limited
  number of places that pod can be scheduled, due to port conflicts— you can only schedule as many
  such Pods as there are nodes in your Kubernetes cluster.

  If you only need access to the port for debugging purposes, you can use the [kubectl proxy and apiserver proxy](/docs/user-guide/connecting-to-applications-proxy/) or [kubectl port-forward](/docs/user-guide/connecting-to-applications-port-forward/).
  You can use a [Service](/docs/user-guide/services/) object for external service access.
  If you do need to expose a pod's port on the host machine, consider using a [NodePort](/docs/user-guide/services/#type-nodeport) service before resorting to `hostPort`.

- Avoid using `hostNetwork`, for the same reasons as `hostPort`.

- Use _headless services_ for easy service discovery when you don't need kube-proxy load balancing.
  See [headless services](/docs/user-guide/services/#headless-services).

## Using Labels

- Define and use [labels](/docs/user-guide/labels/) that identify __semantic attributes__ of your application or
  deployment. For example, instead of attaching a label to a set of pods to explicitly represent
  some service (e.g.,   `service: myservice`), or explicitly representing the replication
  controller managing the pods  (e.g., `controller: mycontroller`), attach labels that identify
  semantic attributes, such as `{ app: myapp, tier: frontend, phase: test, deployment: v3 }`. This
  will let you select the object groups appropriate to the context— e.g., a service for all "tier:
  frontend" pods, or all "test" phase components of app "myapp". See the
  [guestbook](https://github.com/kubernetes/kubernetes/tree/{{page.githubbranch}}/examples/guestbook/) app for an example of this approach.

  A service can be made to span multiple deployments, such as is done across [rolling updates](/docs/user-guide/kubectl/kubectl_rolling-update/), by simply omitting release-specific labels from its selector, rather than updating a service's selector to match the replication controller's selector fully.

- To facilitate rolling updates, include version info in replication controller names, e.g. as a
  suffix to the name. It is useful to set a 'version' label as well. The rolling update creates a
  new controller as opposed to modifying the existing controller. So, there will be issues with
  version-agnostic controller names. See the [documentation](/docs/user-guide/kubectl/kubectl_rolling-update/) on
  the rolling-update command for more detail.

  Note that the [Deployment](/docs/user-guide/deployments/) object obviates the need to manage replication
  controller 'version names'. A desired state of an object is described by a Deployment, and if
  changes to that spec are _applied_, the deployment controller changes the actual state to the
  desired state at a controlled rate. (Deployment objects are currently part of the [`extensions`
  API Group](/docs/api/#api-groups).)

- You can manipulate labels for debugging. Because Kubernetes replication controllers and services
  match to pods using labels, this allows you to remove a pod from being considered by a
  controller, or served traffic by a service, by removing the relevant selector labels. If you
  remove the labels of an existing pod, its controller will create a new pod to take its place.
  This is a useful way to debug a previously "live" pod in a quarantine environment. See the
  [`kubectl label`](/docs/user-guide/kubectl/kubectl_label/) command.

## Container Images

- The [default container image pull policy](/docs/user-guide/images/) is `IfNotPresent`, which causes the
  [Kubelet](/docs/admin/kubelet/) to not pull an image if it already exists. If you would like to
  always force a pull, you must specify a pull image policy of `Always` in your .yaml file
  (`imagePullPolicy: Always`) or specify a `:latest` tag on your image.

  That is, if you're specifying an image with other than the `:latest` tag, e.g. `myimage:v1`, and
  there is an image update to that same tag, the Kubelet won't pull the updated image. You can
  address this by ensuring that any updates to an image bump the image tag as well (e.g.
  `myimage:v2`), and ensuring that your configs point to the correct version.

  **Note:** you should avoid using `:latest` tag when deploying containers in production, because this makes it hard
  to track which version of the image is running and hard to roll back.

## Using kubectl

- Use `kubectl create -f <directory>` where possible. This looks for config objects in all `.yaml`, `.yml`, and `.json` files in `<directory>` and passes them to `create`.

- Use `kubectl delete` rather than `stop`. `Delete` has a superset of the functionality of `stop`, and `stop` is deprecated.

- Use kubectl bulk operations (via files and/or labels) for get and delete. See [label selectors](/docs/user-guide/labels/#label-selectors) and [using labels effectively](/docs/user-guide/managing-deployments/#using-labels-effectively).

- Use `kubectl run` and `expose` to quickly create and expose single container Deployments. See the [quick start guide](/docs/user-guide/quick-start/) for an example.


