---
layout: blog
title: "Kubernetes Configuration Good Practices"
date: 2025-11-25T00:00:00+00:00
slug: configuration-good-practices
evergreen: true
author: Kirti Goyal
---

Configuration is one of those things in Kubernetes that seems small until it's not. Configuration is at the heart of every Kubernetes workload.
A missing quote, a wrong API version or a misplaced YAML indent can ruin your entire deploy. 

This blog brings together tried-and-tested configuration best practices. The small habits that make your Kubernetes setup clean, consistent and easier to manage. 
Whether you are just starting out or already deploying apps daily, these are the little things that keep your cluster stable and your future self sane. 

_This blog is inspired by the original *Configuration Best Practices* page, which has evolved through contributions from many members of the Kubernetes community._

## General configuration practices

### Use the latest stable API version 
Kubernetes evolves fast. Older APIs eventually get deprecated and stop working. So, whenever you are defining resources, make sure you are using the latest stable API version. 
You can always check with
```bash
kubectl api-resources
```
This simple step saves you from future compatibility issues. 
  
### Store configuration in version control 
Never apply manifest files directly from your desktop. Always keep them in a version control system like Git, it's your safety net. 
If something breaks, you can instantly roll back to a previous commit, compare changes or recreate your cluster setup without panic.

### Write configs in YAML not JSON
Write your configuration files using YAML rather than JSON. Both work technically, but YAML is just easier for humans. It's cleaner to read and less noisy and widely used in the community. 

YAML has some sneaky gotchas with boolean values: 
Use only `true` or `false`. 
Don't write `yes`, `no`, `on` or  `off`.
They might work in one version of YAML but break in another. To be safe, quote anything that looks like a Boolean (for example `"yes"`).

###	Keep configuration simple and minimal
Avoid setting default values that are already handled by Kubernetes. Minimal manifests are easier to debug, cleaner to review and less likely to break things later. 

###	Group related objects together
If your Deployment, Service and ConfigMap all belong to one app, put them in a single manifest file.  
It's easier to track changes and apply them as a unit. 
See the [Guestbook all-in-one.yaml](https://github.com/kubernetes/examples/blob/master/web/guestbook/all-in-one/guestbook-all-in-one.yaml) file for an example of this syntax.

You can even apply entire directories with:
```bash
kubectl apply -f configs/
```
One command and boom everything in that folder gets deployed. 

###	Add helpful annotations
Manifest files are not just for machines, they are for humans too. Use annotations to describe why something exists or what it does. A quick one-liner can save hours when debugging later and also allows better collaboration.  

The most helpful annotation to set is `kubernetes.io/description`. It's like using comment, except that it gets copied into the API so that everyone else can see it even after you deploy.

## Managing Workloads: Pods, Deployments, and Jobs

A common early mistake in Kubernetes is creating Pods directly. Pods work, but they don't reschedule themselves if something goes wrong.

_Naked Pods_ (Pods not managed by a controller, such as [Deployment](/docs/concepts/workloads/controllers/deployment/) or a [StatefulSet](/docs/concepts/workloads/controllers/statefulset/)) are fine for testing, but in real setups, they are risky.

Why?
Because if the node hosting that Pod dies, the Pod dies with it and Kubernetes won't bring it back automatically. 

### Use Deployments for apps that should always be running
A Deployment, which both creates a ReplicaSet to ensure that the desired number of Pods is always available, and specifies a strategy to replace Pods (such as [RollingUpdate](/docs/concepts/workloads/controllers/deployment/#rolling-update-deployment)), is almost always preferable to creating Pods directly.
You can roll out a new version, and if something breaks, roll back instantly.

### Use Jobs for tasks that should finish
A [Job](/docs/concepts/workloads/controllers/job/) is perfect when you need something to run once and then stop like database migration or batch processing task.
It will retry if the pods fails and report success when it's done. 

## Service Configuration and Networking

Services are how your workloads talk to each other inside (and sometimes outside) your cluster. Without them, your pods exist but can't reach anyone. Let's make sure that doesn't happen.

### Create Services before workloads that use them
When Kubernetes starts a Pod, it automatically injects environment variables for existing Services.
So, if a Pod depends on a Service, create a [Service](/docs/concepts/services-networking/service/) **before** its corresponding backend workloads (Deployments or StatefulSets), and before any workloads that need to access it.

For example, if a Service named foo exists, all containers will get the following variables in their initial environment:
```
FOO_SERVICE_HOST=<the host the Service runs on>
FOO_SERVICE_PORT=<the port the Service runs on>
```
DNS based discovery doesn't have this problem, but it's a good habit to follow anyway.

### Use DNS for Service discovery
If your cluster has the DNS [add-on](/docs/concepts/cluster-administration/addons/) (most do), every Service automatically gets a DNS entry. That means you can access it by name instead of IP:
```bash
curl http://my-service.default.svc.cluster.local
``` 
It's one of those features that makes Kubernetes networking feel magical. 

### Avoid `hostPort` and `hostNetwork` unless absolutely necessary
You'll sometimes see these options in manifests:
```yaml
hostPort: 8080
hostNetwork: true
```
But here's the thing:
They tie your Pods to specific nodes, making them harder to schedule and scale. Because each <`hostIP`, `hostPort`, `protocol`> combination must be unique. If you don't specify the `hostIP` and `protocol` explicitly, Kubernetes will use `0.0.0.0` as the default `hostIP` and `TCP` as the default `protocol`.
Unless you're debugging or building something like a network plugin, avoid them. 

If you just need local access for testing, try [`kubectl port-forward`](/docs/reference/kubectl/generated/kubectl_port-forward/):

```bash
kubectl port-forward deployment/web 8080:80
```
See [Use Port Forwarding to access applications in a cluster](/docs/tasks/access-application-cluster/port-forward-access-application-cluster/) to learn more.
Or if you really need external access, use a [`type: NodePort` Service](/docs/concepts/services-networking/service/#type-nodeport). That's the safer, Kubernetes-native way. 

### Use headless Services for internal discovery 
Sometimes, you don't want Kubernetes to load balance traffic. You want to talk directly to each Pod. That's where [headless Services](/docs/concepts/services-networking/service/#headless-services) come in.

You create one by setting `clusterIP: None`.
Instead of a single IP, DNS gives you a list of all Pods IPs, perfect for apps that manage connections themselves. 


## Working with labels effectively 

[Labels](/docs/concepts/overview/working-with-objects/labels/) are key/value pairs that are attached to objects such as Pods.
Labels help you organize, query and group your resources.
They don't do anything by themselves, but they make everything else from Services to Deployments work together smoothly. 

### Use semantics labels
Good labels help you understand what's what, even after months later. 
Define and use [labels](/docs/concepts/overview/working-with-objects/labels/) that identify semantic attributes of your application or Deployment.
For example;
```yaml
labels:
  app.kubernetes.io/name: myapp
  app.kubernetes.io/component: web
  tier: frontend
  phase: test
```
  - `app.kubernetes.io/name` : what the app is
  - `tier` : which layer it belongs to (frontend/backend)
  - `phase` : which stage it's in (test/prod)

You can then use these labels to make powerful selectors.
For example:
```bash
kubectl get pods -l tier=frontend
```
This will list all frontend Pods across your cluster, no matter which Deployment they came from. 
Basically you are not manually listing Pod names; you are just describing what you want. 
See the [guestbook](https://github.com/kubernetes/examples/tree/master/web/guestbook/) app for examples of this approach.

### Use common Kubernetes labels
Kubernetes actually recommends a set of [common labels](/docs/concepts/overview/working-with-objects/common-labels/). It's a standardized way to name things across your different workloads or projects.
Following this convention makes your manifests cleaner, and it means that tools such as [Headlamp](https://headlamp.dev/), [dashboard](https://github.com/kubernetes/dashboard#introduction), or third-party monitoring systems can all
automatically understand what's running.

###	Manipulate labels for debugging 
Since controllers (like ReplicaSets or Deployments) use labels to manage Pods, you can remove a label to “detach” a Pod temporarily.

Example:
```bash
kubectl label pod mypod app-
```
The `app-` part removes the label key `app`.
Once that happens, the controller won’t manage that Pod anymore.
It’s like isolating it for inspection, a “quarantine mode” for debugging. To interactively remove or add labels, use [`kubectl label`](/docs/reference/kubectl/generated/kubectl_label/).

You can then check logs, exec into it and once done, delete it manually.
That’s a super underrated trick every Kubernetes engineer should know.

## Handy kubectl tips 

These small tips make life much easier when you are working with multiple manifest files or clusters.

### Apply entire directories
Instead of applying one file at a time, apply the whole folder:

```bash
# Using server-side apply is also a good practice
kubectl apply -f configs/ --server-side
```
This command looks for `.yaml`, `.yml` and `.json` files in that folder and applies them all together.
It's faster, cleaner and helps keep things grouped by app. 

### Use label selectors to get or delete resources
You don't always need to type out resource names one by one.
Instead, use [selectors](/docs/concepts/overview/working-with-objects/labels/#label-selectors) to act on entire groups at once:

```bash
kubectl get pods -l app=myapp
kubectl delete pod -l phase=test
```
It's especially useful in CI/CD pipelines, where you want to clean up test resources dynamically. 

### Quickly create Deployments and Services
For quick experiments, you don't always need to write a manifest. You can spin up a Deployment right from the CLI:

```bash
kubectl create deployment webapp --image=nginx
```

Then expose it as a Service:
```bash
kubectl expose deployment webapp --port=80
```
This is great when you just want to test something before writing full manifests. 
Also, see [Use a Service to Access an Application in a cluster](/docs/tasks/access-application-cluster/service-access-application-cluster/) for an example.

## Conclusion

Cleaner configuration leads to calmer cluster administrators. 
If you stick to a few simple habits: keep configuration simple and minimal, version-control everything,
use consistent labels, and avoid relying on naked Pods, you'll save yourself hours of debugging down the road.

The best part? 
Clean configurations stay readable. Even after months, you or anyone on your team can glance at them and know exactly what’s happening.

