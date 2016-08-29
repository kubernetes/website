---
assignees:
- bgrant0607
- janetkuo

---

This guide will help you get oriented to Kubernetes and running your first containers on the cluster. If you are already familiar with the docker-cli, you can also checkout the docker-cli to kubectl migration guide [here](/docs/user-guide/docker-cli-to-kubectl).

* TOC
{:toc}

## Launching a simple application, and exposing it to the Internet

Once your application is packaged into a container and pushed to an image registry, you're ready to deploy it to Kubernetes.
Through integration with some cloud providers (for example Google Compute Engine and AWS EC2), Kubernetes also enables you to request it to provision a public IP address for your application.

For example, [nginx](http://wiki.nginx.org/Main) is a popular HTTP server, with a [pre-built container on Docker hub](https://registry.hub.docker.com/_/nginx/). The [`kubectl run`](/docs/user-guide/kubectl/kubectl_run) commands below will create two nginx replicas, listening on port 80, and a public IP address for your application.

```shell
$ kubectl run my-nginx --image=nginx --replicas=2 --port=80
deployment "my-nginx" created
```

To expose your service to the public internet, run:

```shell
$ kubectl expose deployment my-nginx --target-port=80 --type=LoadBalancer
service "my-nginx" exposed
```

You can see that they are running by:

```shell
$ kubectl get po
NAME                                READY     STATUS    RESTARTS   AGE
my-nginx-3800858182-h9v8d           1/1       Running   0          1m
my-nginx-3800858182-wqafx           1/1       Running   0          1m
```

Kubernetes will ensure that your application keeps running, by automatically restarting containers that fail, spreading containers across nodes, and recreating containers on new nodes when nodes fail.

To find the public IP address assigned to your application, execute:

```shell
$ kubectl get service my-nginx
NAME         CLUSTER_IP       EXTERNAL_IP       PORT(S)                AGE
my-nginx     10.179.240.1     25.1.2.3          80/TCP                 8s
```

You may need to wait for a minute or two for the external ip address to be provisioned.

In order to access your nginx landing page, you also have to make sure that traffic from external IPs is allowed. Do this by opening a [firewall to allow traffic on port 80](/docs/user-guide/services-firewalls).

If you're running on AWS, Kubernetes creates an ELB for you.  ELBs use host
names, not IPs, so you will have to do `kubectl describe service/my-nginx` and look
for the `LoadBalancer Ingress` host name.  Traffic from external IPs is allowed
automatically.

## Killing the application

To kill the application and delete its containers and public IP address, do:

```shell
$ kubectl delete deployment,service my-nginx
deployment "my-nginx" deleted
service "my-nginx" deleted
```

## What's next?

[Learn about how to configure common container parameters, such as commands and environment variables.](/docs/user-guide/configuring-containers)
