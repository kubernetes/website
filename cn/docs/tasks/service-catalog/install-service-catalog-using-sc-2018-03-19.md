---
title: Install Service Catalog using SC
reviewers:
- chenopis
---

{% capture overview %}
{% glossary_definition term_id="service-catalog" length="all" prepend="Service Catalog is" %}

Use the [Service Catalog Installer](https://github.com/GoogleCloudPlatform/k8s-service-catalog#installation) tool to easily install or uninstall Service Catalog on your Kubernetes cluster. This CLI tool is installed as `sc` in your local environment.

{% endcapture %}


{% capture prerequisites %}
* Understand the key concepts of [Service Catalog](/docs/concepts/service-catalog/).
* Install [Go 1.6+](https://golang.org/dl/) and set the `GOPATH`.
* Install the [cfssl](https://github.com/cloudflare/cfssl) tool needed for generating SSL artifacts.
* Service Catalog requires Kubernetes version 1.7+.
* [Install and setup kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/) so that it is configured to connect to a Kubernetes v1.7+ cluster.
* The kubectl user must be bound to the *cluster-admin* role for it to install Service Catalog. To ensure that this is true, run the following command:

        kubectl create clusterrolebinding cluster-admin-binding --clusterrole=cluster-admin --user=<user-name>

{% endcapture %}


{% capture steps %}
## Install `sc` in your local environment

Install the `sc` CLI tool using the `go get` command:

```Go
go get github.com/GoogleCloudPlatform/k8s-service-catalog/installer/cmd/sc
```

After running the above command, `sc` should be installed in your `GOPATH/bin` directory.

## Install Service Catalog in your Kubernetes cluster

First, verify that all dependencies have been installed. Run:

```shell
sc check
```

If the check is successful, it should return:

```
Dependency check passed. You are good to go.
```

Next, run the install command and specify the `storageclass` that you want to use for the backup:

```shell
sc install --etcd-backup-storageclass "standard"
```

## Uninstall Service Catalog

If you would like to uninstall Service Catalog from your Kubernetes cluster using the `sc` tool, run:

```shell
sc uninstall
```

{% endcapture %}


{% capture whatsnext %}
* View [sample service brokers](https://github.com/openservicebrokerapi/servicebroker/blob/master/gettingStarted.md#sample-service-brokers).
* Explore the [kubernetes-incubator/service-catalog](https://github.com/kubernetes-incubator/service-catalog) project.

{% endcapture %}


{% include templates/task.md %}
