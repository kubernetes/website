---
---

This guide will help you get oriented to Kubernetes and running your first containers on the cluster. If you are already familiar with the docker-cli, you can also checkout the docker-cli to kubectl migration guide [here](/docs/user-guide/docker-cli-to-kubectl).

* TOC
{:toc}

## Launching a simple application

Once your application is packaged into a container and pushed to an image registry, you're ready to deploy it to Kubernetes.

For example, [nginx](http://wiki.nginx.org/Main) is a popular HTTP server, with a [pre-built container on Docker hub](https://registry.hub.docker.com/_/nginx/). The [`kubectl run`](/docs/user-guide/kubectl/kubectl_run) command below will create two nginx replicas, listening on port 80.

```shell
$ kubectl run my-nginx --image=nginx --replicas=2 --port=80
CONTROLLER   CONTAINER(S)   IMAGE(S)   SELECTOR       REPLICAS
my-nginx     my-nginx       nginx      run=my-nginx   2
```

You can see that they are running by:

```shell
$ kubectl get po
NAME             READY     STATUS    RESTARTS   AGE
my-nginx-l8n3i   1/1       Running   0          29m
my-nginx-q7jo3   1/1       Running   0          29m
```

Kubernetes will ensure that your application keeps running, by automatically restarting containers that fail, spreading containers across nodes, and recreating containers on new nodes when nodes fail.

## Exposing your application to the Internet

Through integration with some cloud providers (for example Google Compute Engine and AWS EC2), Kubernetes enables you to request that it provision a public IP address for your application. To do this run:

```shell
$ kubectl expose rc my-nginx --port=80 --type=LoadBalancer
service "my-nginx" exposed
```

To find the public IP address assigned to your application, execute:

```shell
$ kubectl get svc my-nginx
NAME         CLUSTER_IP       EXTERNAL_IP       PORT(S)                SELECTOR     AGE
my-nginx     10.179.240.1     25.1.2.3          80/TCP                 run=nginx    8d
```

You may need to wait for a minute or two for the external ip address to be provisioned.

In order to access your nginx landing page, you also have to make sure that traffic from external IPs is allowed. Do this by opening a [firewall to allow traffic on port 80](/docs/user-guide/services-firewalls).

## Killing the application

To kill the application and delete its containers and public IP address, do:

```shell
$ kubectl delete rc my-nginx
replicationcontrollers/my-nginx
$ kubectl delete svc my-nginx
services/my-nginx
```

## What's next?

[Learn about how to configure common container parameters, such as commands and environment variables.](/docs/user-guide/configuring-containers)