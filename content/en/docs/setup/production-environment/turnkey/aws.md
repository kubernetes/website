---
reviewers:
- justinsb
- clove
title: Running Kubernetes on AWS EC2
content_template: templates/task
---

{{% capture overview %}}

This page describes how to install a Kubernetes cluster on AWS.

{{% /capture %}}

{{% capture prerequisites %}}

To create a Kubernetes cluster on AWS, you will need an Access Key ID and a Secret Access Key from AWS.

### Supported Production Grade Tools

* [conjure-up](/docs/getting-started-guides/ubuntu/) is an open-source installer for Kubernetes that creates Kubernetes clusters with native AWS integrations on Ubuntu.

* [Kubernetes Operations](https://github.com/kubernetes/kops) - Production Grade K8s Installation, Upgrades, and Management. Supports running Debian, Ubuntu, CentOS, and RHEL in AWS.

* [CoreOS Tectonic](https://coreos.com/tectonic/) includes the open-source [Tectonic Installer](https://github.com/coreos/tectonic-installer) that creates Kubernetes clusters with Container Linux nodes on AWS.

* CoreOS originated and the Kubernetes Incubator maintains [a CLI tool, kube-aws](https://github.com/kubernetes-incubator/kube-aws), that creates and manages Kubernetes clusters with [Container Linux](https://coreos.com/why/) nodes, using AWS tools: EC2, CloudFormation and Autoscaling.

* [KubeOne](https://github.com/kubermatic/kubeone) is an open source cluster lifecycle management tool that creates, upgrades and manages Kubernetes Highly-Available clusters.

{{% /capture %}}

{{% capture steps %}}

## Getting started with your cluster

### Command line administration tool: kubectl

The cluster startup script will leave you with a `kubernetes` directory on your workstation.
Alternately, you can download the latest Kubernetes release from [this page](https://github.com/kubernetes/kubernetes/releases).

Next, add the appropriate binary folder to your `PATH` to access kubectl:

```shell
# macOS
export PATH=<path/to/kubernetes-directory>/platforms/darwin/amd64:$PATH

# Linux
export PATH=<path/to/kubernetes-directory>/platforms/linux/amd64:$PATH
```

An up-to-date documentation page for this tool is available here: [kubectl manual](/docs/user-guide/kubectl/)

By default, `kubectl` will use the `kubeconfig` file generated during the cluster startup for authenticating against the API.
For more information, please read [kubeconfig files](/docs/tasks/access-application-cluster/configure-access-multiple-clusters/)

### Examples

See [a simple nginx example](/docs/tasks/run-application/run-stateless-application-deployment/) to try out your new cluster.

The "Guestbook" application is another popular example to get started with Kubernetes: [guestbook example](https://github.com/kubernetes/examples/tree/{{< param "githubbranch" >}}/guestbook/)

For more complete applications, please look in the [examples directory](https://github.com/kubernetes/examples/tree/{{< param "githubbranch" >}}/)

## Scaling the cluster

Adding and removing nodes through `kubectl` is not supported. You can still scale the amount of nodes manually through adjustments of the 'Desired' and 'Max' properties within the [Auto Scaling Group](http://docs.aws.amazon.com/autoscaling/latest/userguide/as-manual-scaling.html), which was created during the installation.

## Tearing down the cluster

Make sure the environment variables you used to provision your cluster are still exported, then call the following script inside the
`kubernetes` directory:

```shell
cluster/kube-down.sh
```

## Support Level


IaaS Provider        | Config. Mgmt | OS            | Networking  | Docs                                          | Conforms | Support Level
-------------------- | ------------ | ------------- | ----------  | --------------------------------------------- | ---------| ----------------------------
AWS                  | kops         | Debian        | k8s (VPC)   | [docs](https://github.com/kubernetes/kops)    |          | Community ([@justinsb](https://github.com/justinsb))
AWS                  | CoreOS       | CoreOS        | flannel     | [docs](/docs/getting-started-guides/aws)      |          | Community
AWS                  | Juju         | Ubuntu        | flannel, calico, canal     | [docs](/docs/getting-started-guides/ubuntu)      | 100%     | Commercial, Community
AWS                  | KubeOne         | Ubuntu, CoreOS, CentOS   | canal, weavenet     | [docs](https://github.com/kubermatic/kubeone)      | 100%    | Commercial, Community

## Further reading

Please see the [Kubernetes docs](/docs/) for more details on administering
and using a Kubernetes cluster.

{{% /capture %}}
