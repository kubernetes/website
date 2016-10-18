---
assignees:
- janetkuo

---

* TOC
{:toc}

## Native Tools

### Kubectl 

[`kubectl`](/docs/user-guide/kubectl/) is the command line tool for Kubernetes. It controls the Kubernetes cluster manager.

### Dashboard 

[Dashboard](/docs/user-guide/ui/), the web-based user interface of Kubernetes, allows you to deploy containerized applications
to a Kubernetes cluster, troubleshoot them, and manage the cluster and its resources itself. 

## Third-Party Tools

### Helm

[Kubernetes Helm](https://github.com/kubernetes/helm) is a tool for managing packages of pre-configured
Kubernetes resources, aka Kubernetes charts.

Use Helm to: 

* Find and use popular software packaged as Kubernetes charts
* Share your own applications as Kubernetes charts
* Create reproducible builds of your Kubernetes applications
* Intelligently manage your Kubernetes manifest files
* Manage releases of Helm packages

### Kompose 

[Kompose](https://github.com/kubernetes-incubator/kompose) is a tool to help users familiar with `docker-compose`
move to Kubernetes. It takes a Docker Compose file and translates it into Kubernetes objects. `kompose`
is a convenient tool to go from local Docker development to managing your application with Kubernetes.
