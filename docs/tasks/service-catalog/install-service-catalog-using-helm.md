---
title: Install Service Catalog using Helm
reviewers:
- chenopis
---

{% capture overview %}
{% glossary_definition term_id="service-catalog" length="all" prepend="Service Catalog is" %}  

Use [Helm](https://helm.sh/) to install Service Catalog on your Kubernetes cluster. Up to date information on this process can be found at the [kubernetes-incubator/service-catalog](https://github.com/kubernetes-incubator/service-catalog/blob/master/docs/install.md) repo.

{% endcapture %}


{% capture prerequisites %}
* Understand the key concepts of [Service Catalog](/docs/concepts/service-catalog/).
* Service Catalog requires a Kubernetes cluster running version 1.7 or higher.
* You must have a Kubernetes cluster with cluster DNS enabled.
    * If you are using a cloud-based Kubernetes cluster or {% glossary_tooltip text="Minikube" term_id="minikube" %}, you may already have cluster DNS enabled.
    * If you are using `hack/local-up-cluster.sh`, ensure that the `KUBE_ENABLE_CLUSTER_DNS` environment variable is set, then run the install script.
* [Install and setup kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/) v1.7 or higher. Make sure it is configured to connect to the Kubernetes cluster.
* Install [Helm](http://helm.sh/) v2.7.0 or newer.
    * Follow the [Helm install instructions](https://github.com/kubernetes/helm/blob/master/docs/install.md).
    * If you already have an appropriate version of Helm installed, execute `helm init` to install Tiller, the server-side component of Helm.

{% endcapture %}


{% capture steps %}
## Add the service-catalog Helm repository

Once Helm is installed, add the *service-catalog* Helm repository to your local machine by executing the following command:

```shell
helm repo add svc-cat https://svc-catalog-charts.storage.googleapis.com
```

Check to make sure that it installed successfully by executing the following command:

```shell
helm search service-catalog
```

If the installation was successful, the command should output the following:

```
NAME            VERSION DESCRIPTION
svc-cat/catalog 0.0.1   service-catalog API server and controller-manag...
```

## Enable RBAC

Your Kubernetes cluster must have RBAC enabled, which requires your Tiller Pod(s) to have `cluster-admin` access.

If you are using Minikube, run the `minikube start` command with the following flag:

```shell
minikube start --extra-config=apiserver.Authorization.Mode=RBAC
```

If you are using `hack/local-up-cluster.sh`, set the `AUTHORIZATION_MODE` environment variable with the following values:

```
AUTHORIZATION_MODE=Node,RBAC hack/local-up-cluster.sh -O
```

By default, `helm init` installs the Tiller Pod into the `kube-system` namespace, with Tiller configured to use the `default` service account.

**NOTE:** If you used the `--tiller-namespace` or `--service-account` flags when running `helm init`, the `--serviceaccount` flag in the following command needs to be adjusted to reference the appropriate namespace and ServiceAccount name.
{: .note}

Configure Tiller to have `cluster-admin` access:

```shell
kubectl create clusterrolebinding tiller-cluster-admin \
    --clusterrole=cluster-admin \
    --serviceaccount=kube-system:default
```


## Install Service Catalog in your Kubernetes cluster

Install Service Catalog from the root of the Helm repository using the following command:

```shell
helm install svc-cat/catalog \
    --name catalog --namespace catalog
```

{% endcapture %}


{% capture whatsnext %}
* View [sample service brokers](https://github.com/openservicebrokerapi/servicebroker/blob/master/gettingStarted.md#sample-service-brokers).
* Explore the [kubernetes-incubator/service-catalog](https://github.com/kubernetes-incubator/service-catalog) project.

{% endcapture %}


{% include templates/task.md %}
