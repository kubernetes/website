---
title: Learning environment
content_type: concept
weight: 20
---

<!-- overview -->

If you are learning Kubernetes, you need a place to practice. This page explains your options for setting up a Kubernetes environment where you can experiment and learn.

<!-- body -->

## Installing kubectl

Before you set up a cluster, you need the `kubectl` command-line tool. This tool lets you communicate with a Kubernetes cluster and run commands against it.

See [Install and Set Up kubectl](/docs/tasks/tools/#kubectl) for installation instructions.

## Setting up local Kubernetes environments

Running Kubernetes locally gives you a safe environment to learn and experiment. You can set up and tear down clusters without worrying about costs or affecting production systems.

### kind

[kind](https://kind.sigs.k8s.io/) (Kubernetes IN Docker) runs Kubernetes clusters using Docker containers as nodes. It is lightweight and designed specifically for testing Kubernetes itself, but works great for learning too.

To get started with kind, see the [kind Quick Start](https://kind.sigs.k8s.io/docs/user/quick-start/).

### minikube

[minikube](https://minikube.sigs.k8s.io/) runs a single-node Kubernetes cluster on your local machine. It supports multiple container runtimes and works on Linux, macOS, and Windows.

To get started with minikube, see the [minikube Get Started](https://minikube.sigs.k8s.io/docs/start/) guide.

### Other local options

{{% thirdparty-content single="true" %}}

There are several third-party tools that can also run Kubernetes locally. Kubernetes does not provide support for these tools, but they may work well for your learning needs:

- [Docker Desktop](https://docs.docker.com/desktop/kubernetes/) can run a local Kubernetes cluster
- [Podman Desktop](https://podman-desktop.io/docs/kubernetes) can run a local Kubernetes cluster
- [Rancher Desktop](https://docs.rancherdesktop.io/) provides Kubernetes on your desktop
- [MicroK8s](https://canonical.com/microk8s) runs a lightweight Kubernetes cluster
- [Red Hat CodeReady Containers (CRC)](https://developers.redhat.com/products/openshift-local) runs a minimal OpenShift cluster locally (OpenShift is Kubernetes-conformant)

Refer to each tool's documentation for setup instructions and support.

## Using online playgrounds

{{% thirdparty-content single="true" %}}

Online Kubernetes playgrounds let you try Kubernetes without installing anything on your computer. These environments run in your web browser:

- **[Killercoda](https://killercoda.com/kubernetes)** provides interactive Kubernetes scenarios and a playground environment
- **[Play with Kubernetes](https://labs.play-with-k8s.com/)** gives you a temporary Kubernetes cluster in your browser

These platforms are useful for quick experiments and following tutorials without local setup.

## Practicing with production-like clusters

If you want to practice setting up a more production-like cluster, you can use **kubeadm**. Setting up a cluster with kubeadm is an advanced task that requires multiple machines (physical or virtual) and careful configuration.

For learning about production environments, see [Production environment](/docs/setup/production-environment/).

{{< note >}}
Setting up a production-like cluster is significantly more complex than the learning environments described above. Start with kind, minikube, or an online playground first.
{{< /note >}}

## {{% heading "whatsnext" %}}

- Follow the [Hello Minikube](/docs/tutorials/hello-minikube/) tutorial to deploy your first application
- Learn about [Kubernetes components](/docs/concepts/overview/components/)
- Explore [kubectl commands](/docs/reference/kubectl/)
