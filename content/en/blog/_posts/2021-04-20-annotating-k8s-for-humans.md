---
layout: blog
title: 'Annotating Kubernetes Services for Humans'
date: 2021-04-20
slug: annotating-k8s-for-humans
---

**Author:** Richard Li, Ambassador Labs

Have you ever been asked to troubleshoot a failing Kubernetes service and struggled to find basic information about the service such as the source repository and owner?

One of the problems as Kubernetes applications grow is the proliferation of services. As the number of services grows, developers start to specialize working with specific services. When it comes to troubleshooting, however, developers need to be able to find the source, understand the service and dependencies, and chat with the owning team for any service.

## Human service discovery

Troubleshooting always begins with information gathering. While much attention has been paid to centralizing machine data (e.g., logs, metrics), much less attention has been given to the human aspect of service discovery. Who owns a particular service? What Slack channel does the team work on? Where is the source for the service? What issues are currently known and being tracked?

## Kubernetes annotations

Kubernetes annotations are designed to solve exactly this problem. Oft-overlooked, Kubernetes annotations are designed to add metadata to Kubernetes objects. The Kubernetes documentation says annotations can “attach arbitrary non-identifying metadata to objects.” This means that annotations should be used for attaching metadata that is external to Kubernetes (i.e., metadata that Kubernetes won’t use to identify objects. As such, annotations can contain any type of data. This is a contrast to labels, which are designed for uses internal to Kubernetes. As such, label structure and values are [constrained](/docs/concepts/overview/working-with-objects/labels/#syntax-and-character-set) so they can be efficiently used by Kubernetes.


## Kubernetes annotations in action

Here is an example. Imagine you have a Kubernetes service for quoting, called the quote service. You can do the following:

```
kubectl annotate service quote a8r.io/owner=”@sally”
```

In this example, we've just added an annotation called `a8r.io/owner` with the value of @sally. Now, we can use `kubectl describe` to get the information.

```
Name:              quote
Namespace:         default
Labels:            <none>
Annotations:       a8r.io/owner: @sally
Selector:          app=quote
Type:              ClusterIP
IP:                10.109.142.131
Port:              http  80/TCP
TargetPort:        8080/TCP
Endpoints:         <none>
Session Affinity:  None
Events:            <none>
```

If you’re practicing GitOps (and you should be!) you’ll want to code these values directly into your Kubernetes manifest, e.g.,

```yaml
apiVersion: v1
kind: Service
metadata:
  name: quote
  annotations:
    a8r.io/owner: “@sally”
spec:
  ports:
  - name: http
    port: 80
    targetPort: 8080
  selector:
    app: quote
```

## A Convention for Annotations

Adopting a common convention for annotations ensures consistency and understandability. Typically, you’ll want to attach the annotation to the service object, as services are the high-level resource that maps most clearly to a team’s responsibility. Namespacing your annotations is also very important. Here is one set of conventions, documented at [a8r.io](https://a8r.io), and reproduced below:

{{< table caption="Annotation convention for human-readable services">}}
| Annotation                                 | Description                                 |
| ------------------------------------------ | ------------------------------------------- |
| `a8r.io/description`                       | Unstructured text description of the service for humans.      |
| `a8r.io/owner`                             | SSO username (GitHub), email address (linked to GitHub account), or unstructured owner description. |
| `a8r.io/chat`                              | Slack channel, or link to external chat system. |
| `a8r.io/bugs`                              | Link to external bug tracker. |
| `a8r.io/logs`                              | Link to external log viewer. |
| `a8r.io/documentation`                     | Link to external project documentation. |
| `a8r.io/repository`                        | Link to external VCS repository. |
| `a8r.io/support`                           | Link to external support center. |
| `a8r.io/runbook`                           | Link to external project runbook. |
| `a8r.io/incidents`                         | Link to external incident dashboard. |
| `a8r.io/uptime`                            | Link to external uptime dashboard. |
| `a8r.io/performance`                       | Link to external performance dashboard. |
| `a8r.io/dependencies`                      | Unstructured text describing the service dependencies for humans. |


## Visualizing annotations: Service Catalogs

As the number of microservices and annotations proliferate, running `kubectl describe` can get tedious. Moreover, using `kubectl describe` requires every developer to have some direct access to the Kubernetes cluster. Over the past few years, service catalogs have gained greater visibility in the Kubernetes ecosystem. Popularized by tools such as [Shopify's ServicesDB](https://shopify.engineering/scaling-mobile-development-by-treating-apps-as-services) and [Spotify's System Z](https://dzone.com/articles/modeling-microservices-at-spotify-with-petter-mari), service catalogs are internally-facing developer portals that present critical information about microservices.

Note that these service catalogs should not be confused with the [Kubernetes Service Catalog project](https://svc-cat.io/). Built on the Open Service Broker API, the Kubernetes Service Catalog enables Kubernetes operators to plug in different services (e.g., databases) to their cluster.

## Annotate your services now and thank yourself later

Much like implementing observability within microservice systems, you often don’t realize that you need human service discovery until it’s too late. Don't wait until something is on fire in production to start wishing you had implemented better metrics and also documented how to get in touch with the part of your organization that looks after it.

There's enormous benefits to building an effective “version 0” service: a [_dancing skeleton_](https://containerjournal.com/topics/container-management/dancing-skeleton-apis-and-microservices/) application with a thin slice of complete functionality that can be deployed to production with a minimal yet effective continuous delivery pipeline.

Adding service annotations should be an essential part of your “version 0” for all of your services. Add them now, and you’ll thank yourself later.
