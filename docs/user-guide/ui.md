---
assignees:
- bryk
- mikedanese

---


Dashboard (the web-based user interface of Kubernetes) allows you to deploy containerized applications to a Kubernetes cluster, troubleshoot them, and manage the cluster and its resources itself. You can use it for getting an overview of applications running on the cluster, as well as for creating or modifying individual Kubernetes resources and workloads, such as Daemon sets, Pet sets, Replica sets, Jobs, Replication controllers and corresponding Services, or Pods.

Dashboard also provides information on the state of Pods, Replication controllers, etc. and on any errors that might have occurred. You can inspect and manage the Kubernetes resources, as well as your deployed containerized applications. You can also change the number of replicated Pods, delete Pods, and deploy new applications using a deploy wizard.

By default, Dashboard is installed as a cluster addon. It is enabled by default as of Kubernetes 1.2 clusters.

* TOC
{:toc}

## Dashboard access

Navigate in your Browser to the following URL:
```
https://<kubernetes-master>/ui
```
This redirects to the following URL:
```
https://<kubernetes-master>/api/v1/proxy/namespaces/kube-system/services/kubernetes-dashboard
```
The Dashboard UI lives in the `kube-system` [namespace](/docs/admin/namespaces/), but shows all resources from all namespaces in your environment.

If you find that you are not able to access Dashboard, you can install and open the latest stable release by running the following command:

```
kubectl create -f https://rawgit.com/kubernetes/dashboard/master/src/deploy/kubernetes-dashboard.yaml
```

Then, navigate to

```
https://<kubernetes-master>/ui
```

In case you have to provide a password, use the following command to find it out:

```
kubectl config view
```

## Welcome page

When accessing Dashboard on an empty cluster for the first time, the Welcome page is displayed. This page contains a link to this document as well as a button to deploy your first application. In addition, you can view which system applications are running by **default** in the `kube-system` [namespace](/docs/admin/namespaces/) of your cluster, for example monitoring applications such as Heapster.

![Kubernetes Dashboard welcome page](/images/docs/ui-dashboard-zerostate.png)

## Deploying containerized applications

Dashboard lets you create and deploy a containerized application as a Replication Controller and corresponding Service with a simple wizard. You can either manually specify application details, or upload a YAML or JSON file containing the required information.

To access the deploy wizard from the Welcome page, click the respective button. To access the wizard at a later point in time, click the **DEPLOY APP** or **UPLOAD YAML** link in the upper right corner of any page listing workloads.

![Deploy wizard](/images/docs/ui-dashboard-deploy-simple.png)

### Specifying application details

The deploy wizard expects that you provide the following information:

- **App name** (mandatory): Name for your application. A [label](/docs/user-guide/labels/) with the name will be added to the Replication Controller and Service, if any, that will be deployed.

  The application name must be unique within the selected Kubernetes [namespace](/docs/admin/namespaces/). It must start and end with a lowercase character, and contain only lowercase letters, numbers and dashes (-). It is limited to 24 characters. Leading and trailing spaces are ignored.

- **Container image** (mandatory): The URL of a public Docker [container image](/docs/user-guide/images/) on any registry, or a private image (commonly hosted on the Google Container Registry or Docker Hub). The container image specification must end with a colon.

- **Number of pods** (mandatory): The target number of Pods you want your application to be deployed in. The value must be a positive integer.

  A [Replication Controller](/docs/user-guide/replication-controller/) will be created to maintain the desired number of Pods across your cluster.

- **Service** (optional): For some parts of your application (e.g. frontends) you may want to expose a [Service](http://kubernetes.io/docs/user-guide/services/) onto an external, maybe public IP address outside of your cluster (external Service). For external Services, you may need to open up one or more ports to do so. Find more details [here](/docs/user-guide/services-firewalls/).

  Other Services that are only visible from inside the cluster are called internal Services.

  Irrespective of the Service type, if you choose to create a Service and your container listens on a port (incoming), you need to specify two ports. The Service will be created mapping the port (incoming) to the target port seen by the container. This Service will route to your deployed Pods. Supported protocols are TCP and UDP. The internal DNS name for this Service will be the value you specified as application name above.

If needed, you can expand the **Advanced options** section where you can specify more settings:

![Deploy wizard advanced options](/images/docs/ui-dashboard-deploy-more.png)

- **Description**: The text you enter here will be added as an [annotation](/docs/user-guide/annotations/) to the Replication Controller and displayed in the application's details.

- **Labels**: Default [labels](/docs/user-guide/labels/) to be used for your application are application name and version. You can specify additional labels to be applied to the Replication Controller, Service (if any), and Pods, such as release, environment, tier, partition, and release track.

  Example:

  ```conf
release=1.0
tier=frontend
environment=pod
track=stable
```

- **Namespace**: Kubernetes supports multiple virtual clusters backed by the same physical cluster. These virtual clusters are called [namespaces](/docs/admin/namespaces/). They let you partition resources into logically named groups.

  Dashboard offers all available namespaces in a dropdown list, and allows you to create a new namespace. The namespace name may contain a maximum of 63 alphanumeric characters and dashes (-).

  In case the creation of the namespace is successful, it is selected by default. If the creation fails, the first namespace is selected.

- **Image Pull Secret**: In case the specified Docker container image is private, it may require [pull secret](/docs/user-guide/secrets/) credentials.

  Dashboard offers all available secrets in a dropdown list, and allows you to create a new secret. The secret name must follow the DNS domain name syntax, e.g. `new.image-pull.secret`. The content of a secret must be base64-encoded and specified in a  [`.dockercfg`](/docs/user-guide/images/#specifying-imagepullsecrets-on-a-pod) file. The secret name may consist of a maximum of 253 characters.

  In case the creation of the image pull secret is successful, it is selected by default. If the creation fails, no secret is applied.

- **CPU requirement (cores)** and **Memory requirement (MiB)**: You can specify the minimum [resource limits](/docs/admin/limitrange/) for the container. By default, Pods run with unbounded CPU and memory limits.

- **Run command** and **Run command arguments**: By default, your containers run the specified Docker image's default [entrypoint command](/docs/user-guide/containers/#containers-and-commands). You can use the command options and arguments to override the default.

- **Run as privileged**: This setting determines whether processes in [privileged containers](/docs/user-guide/pods/#privileged-mode-for-pod-containers) are equivalent to processes running as root on the host. Privileged containers can make use of capabilities like manipulating the network stack and accessing devices.

- **Environment variables**: Kubernetes exposes Services through [environment variables](http://kubernetes.io/docs/user-guide/environment-guide/). You can compose environment variable or pass arguments to your commands using the values of environment variables. They can be used in applications to find a Service. Values can reference other variables using the `$(VAR_NAME)` syntax.

### Uploading a YAML or JSON file

Kubernetes supports declarative configuration. In this style, all configuration is stored in YAML or JSON configuration files using the Kubernetes' [API](http://kubernetes.io/docs/api/) resource schemas as the configuration schemas.

As an alternative to specifying application details in the deploy wizard, you can define your Replication Controllers and Services in YAML or JSON files, and upload the files to your Pods:

![Deploy wizard file upload](/images/docs/ui-dashboard-deploy-file.png)

## Managing resources

### List view

As soon as applications are running on your cluster, Dashboard's initial view defaults to showing all resources available in all namespaces in a list view, for example:

![Workloads view](/images/docs/ui-dashboard-workloadview.png)

For every resource, the list view shows the following information:

* Name of the resource
* All labels assigned to the resource
* Number of pods assigned to the resource
* Age, i.e. amount of time passed since the resource has been created
* Docker container image

To filter the resources and only show those of a specific namespace, select it from the dropdown list in the right corner of the title bar:

![Namespace selector](/images/docs/ui-dashboard-namespace.png)

### Details view

When clicking a resource, the details view is opened, for example:

![Details view](/images/docs/ui-dashboard-detailsview.png)

The **OVERVIEW** tab shows the actual resource details as well as the Pods the resource is running in.

The **EVENTS** tab can be useful for debugging applications.

To go back to the workloads overview, click the Kubernetes logo.

### Workload categories

Workloads are categorized as follows:

* [Daemon Sets](http://kubernetes.io/docs/admin/daemons/) which ensure that all or some of the nodes in your cluster run a copy of a Pod.  
* [Deployments](http://kubernetes.io/docs/user-guide/deployments/) which provide declarative updates for Pods and Replica Sets (the next-generation [Replication Controller](http://kubernetes.io/docs/user-guide/replication-controller/))
  The Details page for a Deployment lists resource details, as well as new and old Replica Sets. The resource details also include information on the [RollingUpdate](http://kubernetes.io/docs/user-guide/rolling-updates/) strategy, if any.
* [Pet Sets](http://kubernetes.io/docs/user-guide/load-balancer/) (nominal Services, also known as load-balanced Services) for legacy application support.
* [Replica Sets](http://kubernetes.io/docs/user-guide/replicasets/) for using label selectors.
* [Jobs](http://kubernetes.io/docs/user-guide/jobs/) for creating one or more Pods, ensuring that a specified number of them successfully terminate, and tracking the completions.
* [Replication Controllers](http://kubernetes.io/docs/user-guide/replication-controller/)
* [Pods](http://kubernetes.io/docs/user-guide/pods/)

You can display the resources of a specific category in two ways:

* Click the category name, e.g. **Deployments**
* Edit the Dashboard URL and add the name of a desired category. For example, to display the list of Replication Controllers, specify the following URL:

  ```
http://<your_host>:9090/#/replicationcontroller
```

### Actions

Every list view offers an action menu to the right of the listed resources. The related details view provides the same actions as buttons in the upper right corner of the page.

* **Edit**

  Opens a text editor so that you can instantly view or update the JSON or YAML file of the respective resource.

* **Delete**

  After confirmation, deletes the respective resource.

  When deleting a Replication Controller, the Pods managed by it are also deleted. You have the option to also delete Services related to the Replication Controller.

* **View details**

  For Replication Controllers only. Takes you to the details page where you can view more information about the Pods that make up your application.

* **Scale**

  For Replication Controllers only. Changes the number of Pods your application runs in. The respective Replication Controller will be updated to reflect the newly specified number. Be aware that setting a high number of Pods may result in a decrease of performance of the cluster or Dashboard itself.

## More information

For more information, see the
[Kubernetes Dashboard repository](https://github.com/kubernetes/dashboard).
