---
title: Install Service Catalog using SC
reviewers:
- chenopis
content_type: task
---

<!-- overview -->
{{< glossary_definition term_id="service-catalog" length="all" prepend="Service Catalog is" >}}

You can use the GCP [Service Catalog Installer](https://github.com/GoogleCloudPlatform/k8s-service-catalog#installation)
tool to easily install or uninstall Service Catalog on your Kubernetes cluster, linking it to
Google Cloud projects.

Service Catalog itself can work with any kind of managed service, not just Google Cloud.




## {{% heading "prerequisites" %}}

* Understand the key concepts of [Service Catalog](/docs/concepts/extend-kubernetes/service-catalog/).
* Install [Go 1.6+](https://golang.org/dl/) and set the `GOPATH`.
* Install the [cfssl](https://github.com/cloudflare/cfssl) tool needed for generating SSL artifacts.
* Service Catalog requires Kubernetes version 1.7+.
* [Install and setup kubectl](/docs/tasks/tools/) so that it is configured to connect to a Kubernetes v1.7+ cluster.
* The kubectl user must be bound to the *cluster-admin* role for it to install Service Catalog. To ensure that this is true, run the following command:

        kubectl create clusterrolebinding cluster-admin-binding --clusterrole=cluster-admin --user=<user-name>




<!-- steps -->
## Install `sc` in your local environment

The installer runs on your local computer as a CLI tool named `sc`.

Install using `go get`:

```shell
go get github.com/GoogleCloudPlatform/k8s-service-catalog/installer/cmd/sc
```

`sc` should now be installed in your `GOPATH/bin` directory.

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




## {{% heading "whatsnext" %}}

* View [sample service brokers](https://github.com/openservicebrokerapi/servicebroker/blob/master/gettingStarted.md#sample-service-brokers).
* Explore the [kubernetes-sigs/service-catalog](https://github.com/kubernetes-sigs/service-catalog) project.


