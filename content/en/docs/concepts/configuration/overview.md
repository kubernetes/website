---
reviewers:
- mikedanese
title: Configuration Best Practices
content_type: concept
weight: 10
---

<!-- overview -->
This document highlights and consolidates configuration best practices that are introduced throughout the user guide, Getting Started documentation, and examples.

This is a living document. If you think of something that is not on this list but might be useful to others, please don't hesitate to file an issue or submit a PR.


<!-- body -->
## General Configuration Tips

- When defining configurations, specify the latest stable API version.

- Configuration files should be stored in version control before being pushed to the cluster. This allows you to quickly roll back a configuration change if necessary. It also aids cluster re-creation and restoration.

- Write your configuration files using YAML rather than JSON. Though these formats can be used interchangeably in almost all scenarios, YAML tends to be more user-friendly.

- Group related objects into a single file whenever it makes sense. One file is often easier to manage than several. See the [guestbook-all-in-one.yaml](https://github.com/kubernetes/examples/tree/{{< param "githubbranch" >}}/guestbook/all-in-one/guestbook-all-in-one.yaml) file as an example of this syntax.

- Note also that many `kubectl` commands can be called on a directory. For example, you can call `kubectl apply` on a directory of config files.

- Don't specify default values unnecessarily: simple, minimal configuration will make errors less likely.

- Put object descriptions in annotations, to allow better introspection.


## "Naked" Pods versus ReplicaSets, Deployments, and Jobs {#naked-pods-vs-replicasets-deployments-and-jobs}

- Don't use naked Pods (that is, Pods not bound to a [ReplicaSet](/docs/concepts/workloads/controllers/replicaset/) or [Deployment](/docs/concepts/workloads/controllers/deployment/)) if you can avoid it. Naked Pods will not be rescheduled in the event of a node failure.

  A Deployment, which both creates a ReplicaSet to ensure that the desired number of Pods is always available, and specifies a strategy to replace Pods (such as [RollingUpdate](/docs/concepts/workloads/controllers/deployment/#rolling-update-deployment)), is almost always preferable to creating Pods directly, except for some explicit [`restartPolicy: Never`](/docs/concepts/workloads/pods/pod-lifecycle/#restart-policy) scenarios. A [Job](/docs/concepts/workloads/controllers/job/) may also be appropriate.


## Services

- Create a [Service](/docs/concepts/services-networking/service/) before its corresponding backend workloads (Deployments or ReplicaSets), and before any workloads that need to access it. When Kubernetes starts a container, it provides environment variables pointing to all the Services which were running when the container was started. For example, if a Service named `foo` exists, all containers will get the following variables in their initial environment:

  ```shell
  FOO_SERVICE_HOST=<the host the Service is running on>
  FOO_SERVICE_PORT=<the port the Service is running on>
  ```

  *This does imply an ordering requirement* - any `Service` that a `Pod` wants to access must be created before the `Pod` itself, or else the environment variables will not be populated.  DNS does not have this restriction.

- An optional (though strongly recommended) [cluster add-on](/docs/concepts/cluster-administration/addons/) is a DNS server.  The
DNS server watches the Kubernetes API for new `Services` and creates a set of DNS records for each.  If DNS has been enabled throughout the cluster then all `Pods` should be able to do name resolution of `Services` automatically.

- Don't specify a `hostPort` for a Pod unless it is absolutely necessary. When you bind a Pod to a `hostPort`, it limits the number of places the Pod can be scheduled, because each <`hostIP`, `hostPort`, `protocol`> combination must be unique. If you don't specify the `hostIP` and `protocol` explicitly, Kubernetes will use `0.0.0.0` as the default `hostIP` and `TCP` as the default `protocol`.

  If you only need access to the port for debugging purposes, you can use the [apiserver proxy](/docs/tasks/access-application-cluster/access-cluster/#manually-constructing-apiserver-proxy-urls) or [`kubectl port-forward`](/docs/tasks/access-application-cluster/port-forward-access-application-cluster/).

  If you explicitly need to expose a Pod's port on the node, consider using a [NodePort](/docs/concepts/services-networking/service/#nodeport) Service before resorting to `hostPort`.

- Avoid using `hostNetwork`, for the same reasons as `hostPort`.

- Use [headless Services](/docs/concepts/services-networking/service/#headless-services) (which have a `ClusterIP` of `None`) for service discovery when you don't need `kube-proxy` load balancing.

## Using Labels

- Define and use [labels](/docs/concepts/overview/working-with-objects/labels/) that identify __semantic attributes__ of your application or Deployment, such as `{ app: myapp, tier: frontend, phase: test, deployment: v3 }`. You can use these labels to select the appropriate Pods for other resources; for example, a Service that selects all `tier: frontend` Pods, or all `phase: test` components of `app: myapp`. See the [guestbook](https://github.com/kubernetes/examples/tree/{{< param "githubbranch" >}}/guestbook/) app for examples of this approach.

A Service can be made to span multiple Deployments by omitting release-specific labels from its selector. When you need to update a running service without downtime, use a [Deployment](/docs/concepts/workloads/controllers/deployment/).

A desired state of an object is described by a Deployment, and if changes to that spec are _applied_, the deployment controller changes the actual state to the desired state at a controlled rate.

- Use the [Kubernetes common labels](/docs/concepts/overview/working-with-objects/common-labels/) for common use cases. These standardized labels enrich the metadata in a way that allows tools, including `kubectl` and [dashboard](/docs/tasks/access-application-cluster/web-ui-dashboard), to work in an interoperable way.

- You can manipulate labels for debugging. Because Kubernetes controllers (such as ReplicaSet) and Services match to Pods using selector labels, removing the relevant labels from a Pod will stop it from being considered by a controller or from being served traffic by a Service. If you remove the labels of an existing Pod, its controller will create a new Pod to take its place. This is a useful way to debug a previously "live" Pod in a "quarantine" environment. To interactively remove or add labels, use [`kubectl label`](/docs/reference/generated/kubectl/kubectl-commands#label).

## Container Images

The [imagePullPolicy](/docs/concepts/containers/images/#updating-images) and the tag of the image affect when the [kubelet](/docs/reference/command-line-tools-reference/kubelet/) attempts to pull the specified image.

- `imagePullPolicy: IfNotPresent`: the image is pulled only if it is not already present locally.

- `imagePullPolicy: Always`: every time the kubelet launches a container, the kubelet queries the container image registry to resolve the name to an image digest. If the kubelet has a container image with that exact digest cached locally, the kubelet uses its cached image; otherwise, the kubelet downloads (pulls) the image with the resolved digest, and uses that image to launch the container.

- `imagePullPolicy` is omitted and either the image tag is `:latest` or it is omitted: `imagePullPolicy` is automatically set to `Always`. Note that this will _not_ be updated to `IfNotPresent` if the tag changes value.

- `imagePullPolicy` is omitted and the image tag is present but not `:latest`: `imagePullPolicy` is automatically set to `IfNotPresent`. Note that this will _not_ be updated to `Always` if the tag is later removed or changed to `:latest`.

- `imagePullPolicy: Never`: the image is assumed to exist locally. No attempt is made to pull the image.

{{< note >}}
To make sure the container always uses the same version of the image, you can specify its [digest](https://docs.docker.com/engine/reference/commandline/pull/#pull-an-image-by-digest-immutable-identifier); replace `<image-name>:<tag>` with `<image-name>@<digest>` (for example, `image@sha256:45b23dee08af5e43a7fea6c4cf9c25ccf269ee113168c19722f87876677c5cb2`). The digest uniquely identifies a specific version of the image, so it is never updated by Kubernetes unless you change the digest value.
{{< /note >}}

{{< note >}}
You should avoid using the `:latest` tag when deploying containers in production as it is harder to track which version of the image is running and more difficult to roll back properly.
{{< /note >}}

{{< note >}}
The caching semantics of the underlying image provider make even `imagePullPolicy: Always` efficient, as long as the registry is reliably accessible. With Docker, for example, if the image already exists, the pull attempt is fast because all image layers are cached and no image download is needed.
{{< /note >}}

## Using kubectl

- Use `kubectl apply -f <directory>`. This looks for Kubernetes configuration in all `.yaml`, `.yml`, and `.json` files in `<directory>` and passes it to `apply`.

- Use label selectors for `get` and `delete` operations instead of specific object names. See the sections on [label selectors](/docs/concepts/overview/working-with-objects/labels/#label-selectors) and [using labels effectively](/docs/concepts/cluster-administration/manage-deployment/#using-labels-effectively).

- Use `kubectl create deployment` and `kubectl expose` to quickly create single-container Deployments and Services. See [Use a Service to Access an Application in a Cluster](/docs/tasks/access-application-cluster/service-access-application-cluster/) for an example.



