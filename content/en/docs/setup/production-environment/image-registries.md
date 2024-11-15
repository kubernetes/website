---
title: Container Image Registries
content_type: concept
weight: 30
---

<!-- overview -->

Public container image registries, like Docker Hub, offer a vast array of ready-to-use
images, but having a private or dedicated registry can significantly improve security,
reliability, and control over container images.

This page outlines the key benefits of using a private registry, common setup options,
potential risks of not using one, and how to configure a cluster service to run
a registry.

When implementing your registry strategy, consider your specific requirements around
security, compliance, costs, and performance to choose the most appropriate solution.

### Difference between registry and repository

Ocassionally, the terms _registry_ and _repository_ are used as if they were
interchangeable. While they are related, they are not the same thing.

A _registry_ is a centralized service or server that stores and distributes
container images. It functions as a hub, allowing users to manage, _pull_, and
_push_ images.

A _repository_ exists within a registry and is used to store a specific set of related
container images, usually organized by name and tag.

## {{% heading "objectives" %}}

- Understand container image registries concepts.
- List some  of the available commercial and free open source options.
- Set up a self-hosted image registry for your Kubernetes cluster.
- Upload (push) a container image to the registry.
- Deploy a Pod using the image stored in the private registry.

## {{% heading "prerequisites" %}}

Familiarity with the following tutorials since you are going to use **minikube**
for setting up a self-hosted image registry:

- [Hello Minikube](/docs/tutorials/hello-minikube/)
- [Using kubectl to Create a Deployment](/docs/tutorials/kubernetes-basics/deploy-app/deploy-intro/)
- [Using a Service to Expose Your App](/docs/tutorials/kubernetes-basics/deploy-app/expose-intro/)

You also need an undertanding of:
- [container runtimes](/docs/setup/production-environment/container-runtimes/)
- [container images](/docs/concepts/containers/images/)

<!-- lessoncontent -->

## Why set up a private container image registry?

Using a private container registry allows Kubernetes administrators to:

- **Increase Security**: Public registries may contain images with unverified or
vulnerable code. Private registries allow for controlled access and for image
vulnerability scanning before deployment.

- **Reduce Latency**: Locally hosted registries can decrease deployment times when
pulling images and mitigate downtime due to network issues accessing external registries.

- **Cost Control**: Public registries may incur unexpected costs under heavy use
due to subscription fees and rate limiting. Private registries allow you to optimize
storage and access.

## Risks of using public registries

Using public container image registries poses several risks in production environments:

- **Security and Compliance**: Public registries expose clusters to potential vulnerabilities.
Private registries enable more rigorous access controls and compliance with data
security regulations.

- **Reliability and Performance**: Public registries may be unavailable due to rate
limiting or downtime, affecting deployment speed and stability.

- **Unpredictable Costs**: Some public registries impose usage limits and fees.
A private registry provides predictable and optimized costs.

## Options for setting up a private container registry

Several solutions are available for setting up a container registry, depending on
the needs and constraints of your Kubernetes environment.

{{% thirdparty-content %}}

### Cloud provider managed registries

- **Amazon Elastic Container Registry (ECR)**: Managed by AWS and integrates
with Amazon Elastic Kubernetes Service (EKS).

- **Google Artifact Registry (GAR)**: Managed by Google and integrates with Google
Kubernetes Engine (GKE).

- **Azure Container Registry (ACR)**: Managed by Microsoft and integrates
with Azure Kubernetes Service (AKS).

### Commercial solutions

- **JFrog Artifactory**: A commercial registry supporting advanced access control
and security features.

- **Quay**: Managed by Red Hat, Quay provides features such as vulnerability scanning
and role-based access control (RBAC).

- **Anchore Enterprise**: Anchore provides container image scanning and policy compliance,
making it a strong choice for security-focused deployments.

### Open source self-hosted solutions

- **Docker Registry**: The official open-source registry for Docker images, offering
basic functionality for local image storage.

- **Harbor**: A cloud-native, open-source registry offering image signing, vulnerability
scanning, and access control.

- **GitLab Container Registry**: Bundled with GitLab, this registry is ideal for
those already using GitLab CI/CD, offering easy integration and project-specific registries.

## Setting up a private container registry

In this section, you are going to set up **Docker Registry** on your **minikube** cluster.

{{< caution >}}
The registry configuration used for this task is insecure by design and should
_not_ be used in a production environment.
{{< /caution >}}

### Deploy Docker Registry on Kubernetes

Install [minikube](https://minikube.sigs.k8s.io/docs/start/) on your computer.

Install [kubectl](/docs/tasks/tools/#kubectl) on your computer.

Create a [minikube](/docs/tutorials/hello-minikube/#create-a-minikube-cluster)
cluster:

```shell
start minikube
```

Create a deployment to install Docker Registry on the cluster:

```shell
kubectl create deployment registry --image=registry:2
```

```shell
kubectl get deployments/registry
```

The output is similar to:

```
NAME       READY   UP-TO-DATE   AVAILABLE   AGE
registry   1/1     1            1           1m
```

Create a service to expose the registry:

```shell
kubectl expose deployment/registry --type="NodePort" --port 5000
```

```shell
kubectl get services/registry
```

The output is similar to:

```
NAME       TYPE       CLUSTER-IP      EXTERNAL-IP   PORT(S)          AGE
registry   NodePort   10.96.189.131   <none>        5000:31920/TCP   10m
```

The NodePort in this case is `31920`.

Another (slightly more complicated) way to get the NodePort address:

```shell
export NODE_PORT="$(kubectl get services/registry -o go-template='{{(index .spec.ports 0).nodePort}}')"
echo "NODE_PORT=$NODE_PORT"
```

The output is similar to:

```
31920
```

Get the IP address of the minikube node:

```shell
minikube ip
```

The output is similar to:

```
192.168.49.2
```

Using the `IP:NodePort` information, check the registry with the `curl`
command:

```shell
curl 192.168.49.2:31920/v2/_catalog
```

The output is similar to:

```
{"repositories":[]}
```

On your computer, download the `nginx` container image from Docker Hub:


```shell
docker pull nginx
```

Verify the `image:tag` information:

```shell
docker images
```

If not specified, it will dowload the `nginx:latest` image.

Tag the `nginx:latest` image to point to your registry:


```shell
docker tag nginx:latest 192.168.49.2:31920/nginx:latest
```

Since the registry has an insecure configuration, before uploading the image, you
will need to make a change to the `docker` service in your computer.

{{< note >}}
This example shows Docker running on Linux.
Check the Docker documentation for your operating system.
{{< /note >}}

Edit the `/etc/docker/daemon.json` file and append the following lines inside
the `{}` (adapt the `ip:port` to your configuration):

```json
{
  "insecure-registries": [
    "192.168.49.2:31920"
  ],
}
```

Restart the `docker` service:

```shell
sudo systemctl restart docker
```

Push the image to the registry:

Format: `docker push REGISTRY_IP:PORT/IMAGE_NAME:TAG`

```shell
docker push 192.168.49.2:31920/nginx:latest
```

Check the repository with the `curl` command:

```shell
curl 192.168.49.2:31920/v2/_catalog
```

The output is similar to:

```
{"repositories":["nginx"]}
```

Using the output from the command `kubectl get services/registry`, create a Pod
named `web` using the `nginx` image stored in your private registry:

```shell
kubectl run web --image=10.96.189.131:5000/nginx:latest
```

```sh
kubectl get pods/web
```

The output is similar to:

```
NAME   READY   STATUS    RESTARTS   AGE
web    1/1     Running   0          5m15s
```

To verify that the Pod is using the private registry image, run:

```sh
kubectl describe/pods web
```

The output is similar to:

```
Name:            web 
...
Containers:
  nginx:
    Container ID:   docker://109e40073340ac98353c5c8d0c79a51d15c299a548a66c0e1f81864eb005781c
    Image:          10.96.189.131:5000/nginx:latest
...
```

## Clean up

Stop minikube:

```sh
minikube stop
```

Delete minikube:

```sh
minikube delete 
```
## Conclusion

This page covered the basic aspects of deploying a self-hosted image registry.
You are now ready to explore and evaluate different registries available in the
market that adapt to your technical requirements and budget.

Make sure to also check the Container Registry section of the
[CNCF Landscape](https://landscape.cncf.io/guide#provisioning--container-registry)
for additional information.

## {{% heading "whatsnext" %}}

- Configure user management by determining your
  [Authentication](/docs/reference/access-authn-authz/authentication/) and
  [Authorization](/docs/reference/access-authn-authz/authorization/) methods.

- Prepare for application workloads by setting up
  [resource limits](/docs/tasks/administer-cluster/manage-resources/),
  [DNS autoscaling](/docs/tasks/administer-cluster/dns-horizontal-autoscaling/)
  and [service accounts](/docs/reference/access-authn-authz/service-accounts-admin/).

