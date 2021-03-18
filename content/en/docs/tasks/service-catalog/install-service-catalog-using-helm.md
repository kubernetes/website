---
title: Install Service Catalog using Helm
reviewers:
- chenopis
content_type: task
---

<!-- overview -->
{{< glossary_definition term_id="service-catalog" length="all" prepend="Service Catalog is" >}}  

Use [Helm](https://helm.sh/) to install Service Catalog on your Kubernetes cluster.
Up to date information on this process can be found at the
[kubernetes-sigs/service-catalog](https://github.com/kubernetes-sigs/service-catalog/blob/master/docs/install.md) repo.

## {{% heading "prerequisites" %}}

* Understand the key concepts of [Service Catalog](/docs/concepts/extend-kubernetes/service-catalog/).
* Service Catalog requires a Kubernetes cluster running version 1.7 or higher.
* You must have a Kubernetes cluster with cluster DNS enabled.
    * If you are using a cloud-based Kubernetes cluster or {{< glossary_tooltip text="Minikube" term_id="minikube" >}}, you may already have cluster DNS enabled.
    * If you are using `hack/local-up-cluster.sh`, ensure that the `KUBE_ENABLE_CLUSTER_DNS` environment variable is set, then run the install script.
* [Install and setup kubectl](/docs/tasks/tools/) v1.7 or higher. Make sure it is configured to connect to the Kubernetes cluster.
* Install [Helm](https://helm.sh/) v2.7.0 or newer.
    * Follow the [Helm install instructions](https://helm.sh/docs/intro/install/).
    * If you already have an appropriate version of Helm installed, execute `helm init` to install Tiller, the server-side component of Helm.




<!-- steps -->
## Add the service-catalog Helm repository

Once Helm is installed, add the *service-catalog* Helm repository to your local machine by executing the following command:

```shell
helm repo add svc-cat https://svc-catalog-charts.storage.googleapis.com
```

Check to make sure that it installed successfully by executing the following command:

```shell
helm search repo service-catalog
```

If the installation was successful, the command should output the following:

```
NAME                	CHART VERSION	APP VERSION	DESCRIPTION                                                 
svc-cat/catalog     	0.2.1        	           	service-catalog API server and controller-manager helm chart
svc-cat/catalog-v0.2	0.2.2        	           	service-catalog API server and controller-manager helm chart
```

## Enable RBAC

Your Kubernetes cluster must have RBAC enabled, which requires your Tiller Pod(s) to have `cluster-admin` access.

When using Minikube v0.25 or older, you must run Minikube with RBAC explicitly enabled:

```shell
minikube start --extra-config=apiserver.Authorization.Mode=RBAC
```

When using Minikube v0.26+, run:

```shell
minikube start
```

With Minikube v0.26+, do not specify `--extra-config`. The flag has since been changed to --extra-config=apiserver.authorization-mode and Minikube now uses RBAC by default. Specifying the older flag may cause the start command to hang.

If you are using `hack/local-up-cluster.sh`, set the `AUTHORIZATION_MODE` environment variable with the following values:

```
AUTHORIZATION_MODE=Node,RBAC hack/local-up-cluster.sh -O
```

By default, `helm init` installs the Tiller Pod into the `kube-system` namespace, with Tiller configured to use the `default` service account.

{{< note >}}
If you used the `--tiller-namespace` or `--service-account` flags when running `helm init`, the `--serviceaccount` flag in the following command needs to be adjusted to reference the appropriate namespace and ServiceAccount name.
{{< /note >}}

Configure Tiller to have `cluster-admin` access:

```shell
kubectl create clusterrolebinding tiller-cluster-admin \
    --clusterrole=cluster-admin \
    --serviceaccount=kube-system:default
```


## Install Service Catalog in your Kubernetes cluster

Install Service Catalog from the root of the Helm repository using the following command:

{{< tabs name="helm-versions" >}} 
{{% tab name="Helm version 3" %}}
```shell
helm install catalog svc-cat/catalog --namespace catalog
```
{{% /tab %}}
{{% tab name="Helm version 2" %}}
```shell
helm install svc-cat/catalog --name catalog --namespace catalog
```
{{% /tab %}}
{{< /tabs >}}



## {{% heading "whatsnext" %}}

* View [sample service brokers](https://github.com/openservicebrokerapi/servicebroker/blob/master/gettingStarted.md#sample-service-brokers).
* Explore the [kubernetes-sigs/service-catalog](https://github.com/kubernetes-sigs/service-catalog) project.


