---
assignees:
- karlkfi
title: DCOS
---

This guide will walk you through installing [Kubernetes-Mesos](https://github.com/mesosphere/kubernetes-mesos) on [Datacenter Operating System (DCOS)](https://mesosphere.com/product/) with the [DCOS CLI](https://github.com/mesosphere/dcos-cli) and operating Kubernetes with the [DCOS Kubectl plugin](https://github.com/mesosphere/dcos-kubectl).

* TOC
{:toc}


## About Kubernetes on DCOS

DCOS is system software that manages computer cluster hardware and software resources and provides common services for distributed applications. Among other services, it provides [Apache Mesos](http://mesos.apache.org/) as its cluster kernel and [Marathon](https://mesosphere.github.io/marathon/) as its init system. With DCOS CLI, Mesos frameworks like [Kubernetes-Mesos](https://github.com/mesosphere/kubernetes-mesos) can be installed with a single command.

Another feature of the DCOS CLI is that it allows plugins like the [DCOS Kubectl plugin](https://github.com/mesosphere/dcos-kubectl). This allows for easy access to a version-compatible Kubectl without having to manually download or install.

Further information about the benefits of installing Kubernetes on DCOS can be found in the [Kubernetes-Mesos documentation](https://releases.k8s.io/{{page.githubbranch}}/contrib/mesos/README.md).

For more details about the Kubernetes DCOS packaging, see the [Kubernetes-Mesos project](https://github.com/mesosphere/kubernetes-mesos).

Since Kubernetes-Mesos is still alpha, it is a good idea to familiarize yourself with the [current known issues](https://releases.k8s.io/{{page.githubbranch}}/contrib/mesos/docs/issues.md) which may limit or modify the behavior of Kubernetes on DCOS.

If you have problems completing the steps below, please [file an issue against the kubernetes-mesos project](https://github.com/mesosphere/kubernetes-mesos/issues).


## Resources

Explore the following resources for more information about Kubernetes, Kubernetes on Mesos/DCOS, and DCOS itself.

- [DCOS Documentation](https://docs.mesosphere.com/)
- [Managing DCOS Services](https://docs.mesosphere.com/services/kubernetes/)
- [Kubernetes Examples](https://github.com/kubernetes/kubernetes/tree/{{page.githubbranch}}/examples/)
- [Kubernetes on Mesos Documentation](https://github.com/kubernetes-incubator/kube-mesos-framework/blob/master/README.md)
- [Kubernetes on Mesos Release Notes](https://github.com/mesosphere/kubernetes-mesos/releases)
- [Kubernetes on DCOS Package Source](https://github.com/mesosphere/kubernetes-mesos)


## Prerequisites

- A running [DCOS cluster](https://mesosphere.com/product/)
  - [DCOS Community Edition](https://docs.mesosphere.com/install/) is currently available on [AWS](https://mesosphere.com/amazon/).
  - [DCOS Enterprise Edition](https://mesosphere.com/product/) can be deployed on virtual or bare metal machines. Contact sales@mesosphere.com for more info and to set up an engagement.
- [DCOS CLI](https://docs.mesosphere.com/install/cli/) installed locally


## Install

1. Configure and validate the [Mesosphere Multiverse](https://github.com/mesosphere/multiverse) as a package source repository

    ```shell
$ dcos config prepend package.sources https://github.com/mesosphere/multiverse/archive/version-1.x.zip
    $ dcos package update --validate
    ```    
2. Install etcd

    By default, the Kubernetes DCOS package starts a single-node etcd. In order to avoid state loss in the event of Kubernetes component container failure, install an HA [etcd-mesos](https://github.com/mesosphere/etcd-mesos) cluster on DCOS.

    ```shell
$ dcos package install etcd
    ```    
3. Verify that etcd is installed and healthy

    The etcd cluster takes a short while to deploy. Verify that `/etcd` is healthy before going on to the next step.

    ```shell
$ dcos marathon app list
    ID           MEM  CPUS  TASKS  HEALTH  DEPLOYMENT  CONTAINER  CMD
    /etcd        128  0.2    1/1    1/1       ---        DOCKER   None
    ```    
4. Create Kubernetes installation configuration

    Configure Kubernetes to use the HA etcd installed on DCOS.

    ```shell
$ cat >/tmp/options.json <<EOF
    {
      "kubernetes": {
        "etcd-mesos-framework-name": "etcd"
      }
    }
    EOF
    ```    
5. Install Kubernetes

    ```shell
$ dcos package install --options=/tmp/options.json kubernetes
    ```    
6. Verify that Kubernetes is installed and healthy

    The Kubernetes cluster takes a short while to deploy. Verify that `/kubernetes` is healthy before going on to the next step.

    ```shell
$ dcos marathon app list
    ID           MEM  CPUS  TASKS  HEALTH  DEPLOYMENT  CONTAINER  CMD
    /etcd        128  0.2    1/1    1/1       ---        DOCKER   None
    /kubernetes  768   1     1/1    1/1       ---        DOCKER   None
    ```    
7. Verify that Kube-DNS & Kube-UI are deployed, running, and ready

    ```shell
$ dcos kubectl get pods --namespace=kube-system
    NAME                READY     STATUS    RESTARTS   AGE
    kube-dns-v8-tjxk9   4/4       Running   0          1m
    kube-ui-v2-tjq7b    1/1       Running   0          1m
    ```    
Names and ages may vary.


Now that Kubernetes is installed on DCOS, you may wish to explore the [Kubernetes Examples](https://github.com/kubernetes/kubernetes/tree/{{page.githubbranch}}/examples/README.md) or the [Kubernetes User Guide](/docs/user-guide/).


## Uninstall

1. Stop and delete all replication controllers and pods in each namespace:

    Before uninstalling Kubernetes, destroy all the pods and replication controllers. The uninstall process will try to do this itself, but by default it times out quickly and may leave your cluster in a dirty state.

    ```shell
$ dcos kubectl delete rc,pods --all --namespace=default
    $ dcos kubectl delete rc,pods --all --namespace=kube-system
    ```    
2. Validate that all pods have been deleted

    ```shell
$ dcos kubectl get pods --all-namespaces
    ```    
3. Uninstall Kubernetes

    ```shell
$ dcos package uninstall kubernetes
    ```
## Support Level


IaaS Provider        | Config. Mgmt | OS     | Networking  | Docs                                              | Conforms | Support Level
-------------------- | ------------ | ------ | ----------  | ---------------------------------------------     | ---------| ----------------------------
DCOS                 | Marathon   | CoreOS/Alpine | custom | [docs](/docs/getting-started-guides/dcos)                                   |          | Community ([Kubernetes-Mesos Authors](https://github.com/mesosphere/kubernetes-mesos/blob/master/AUTHORS.md))

For support level information on all solutions, see the [Table of solutions](/docs/getting-started-guides/#table-of-solutions) chart.
