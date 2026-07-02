---
layout: blog
title: "Introducing Kube Resource Orchestrator (kro): Simplifying Kubernetes Resource Composition"
draft: true
slug: kube-resource-orchestrator-kro
author: >
  [Yash Israni](https://github.com/yashisrani)
---

If you've ever built a platform on top of Kubernetes, you know the drill. Someone asks for a "simple web app" and suddenly you're stitching together a Deployment, a Service, an Ingress, maybe a ConfigMap, a ServiceAccount, some network policies, and oh right — they also need a database. Before long, you're either writing yet another Helm chart, maintaining a custo$$m controller, or asking your team to carefully copy-paste YAML from a wiki page.

None of these approaches are *bad*, but they all leave something on the table. Helm charts are great for packaging but they're client-side — there's no server-side validation or lifecycle management. Kustomize handles overlays well but dependency ordering across resources is tricky. And writing a custom controller from scratch? That's a lot of boilerplate Go code for what is essentially "create resource A, wait for it, then create resource B."

This is where **Kube Resource Orchestrator (kro)** comes in.

## What is kro?

Kro (pronounced "crow") is a Kubernetes-native project that lets you define complex multi-resource APIs as reusable building blocks — without writing a single line of Go. It started as an experiment at AWS but quickly turned into a cross-cloud collaboration between AWS, Google Cloud, and Microsoft Azure. Today it's hosted under [SIG Cloud Provider](https://github.com/kubernetes/community/tree/master/sig-cloud-provider), and anyone can use it.

The core idea is simple: you define a **ResourceGraphDefinition (RGD)** that describes a set of Kubernetes resources and how they relate to each other. When someone creates an instance of your RGD, kro automatically generates the CRD, deploys a lightweight controller, and manages the entire lifecycle — creation, updates, drift detection, the works.

## A concrete example

Let's say you want to offer your application teams a `WebApp` resource. One YAML file, done. Here's what the RGD looks like:

```yaml
apiVersion: kro.run/v1alpha1
kind: ResourceGraphDefinition
metadata:
  name: webapp
spec:
  schema:
    apiVersion: v1alpha1
    spec:
      name: string | default=my-app
      image: string | default=nginx
      replicas: integer | default=3 | minimum=1 | maximum=20
      enableIngress: boolean | default=false
      host: string | default=example.com
    status:
      url: ${deployment.status.conditions}
      ingressIP: ${ingress.status.loadBalancer.ingress[0].ip}

  resources:
    - id: deployment
      template:
        apiVersion: apps/v1
        kind: Deployment
        metadata:
          name: ${schema.spec.name}
        spec:
          replicas: ${schema.spec.replicas}
          selector:
            matchLabels:
              app: ${schema.spec.name}
          template:
            metadata:
              labels:
                app: ${schema.spec.name}
            spec:
              containers:
                - name: ${schema.spec.name}
                  image: ${schema.spec.image}
                  ports:
                    - containerPort: 80

    - id: service
      template:
        apiVersion: v1
        kind: Service
        metadata:
          name: ${schema.spec.name}
        spec:
          selector:
            app: ${schema.spec.name}
          ports:
            - protocol: TCP
              port: 80
              targetPort: 80

    - id: ingress
      includeWhen:
        - ${schema.spec.enableIngress == true}
      template:
        apiVersion: networking.k8s.io/v1
        kind: Ingress
        metadata:
          name: ${schema.spec.name}
        spec:
          rules:
            - host: ${schema.spec.host}
              http:
                paths:
                  - path: /
                    pathType: Prefix
                    backend:
                      service:
                        name: ${schema.spec.name}
                        port:
                          number: 80
```

A few things worth pointing out here:

- The `schema` block defines what end users see and configure. Everything else is hidden from them.
- Resources reference each other using `${...}` expressions — kro figures out the dependency graph and creates things in the right order.
- `includeWhen` lets you conditionally include resources. No Ingress? Just set `enableIngress: false`.
- The `status` block uses CEL expressions to surface information from underlying resources back to the instance.

An end user then creates a web app like this:

```yaml
apiVersion: acme.com/v1alpha1
kind: WebApp
metadata:
  name: my-app
spec:
  image: nginx:alpine
  replicas: 3
  enableIngress: true
  host: myapp.example.com
```

That's it. Kro creates the Deployment, the Service, and the Ingress, wires them together, and reports the status back on the `WebApp` resource.

## Why CEL?

Kro uses [Common Expression Language (CEL)](https://github.com/google/cel-spec) for all its expressions. If you've worked with Kubernetes validation rules or CRD schemas, you've probably run into CEL before — it's the same language used for things like [validating admission policies](https://kubernetes.io/docs/reference/access-authn-authz/validating-admission-policy/). It's type-safe, not Turing-complete, and validated at admission time, so you can't accidentally write an infinite loop into your resource definition.

The `${...}` syntax lets you reference any field from any resource in the graph. Need the load balancer hostname from a Service? `${service.status.loadBalancer.ingress[0].hostname}`. Need to wait for a database to be ready before creating the app? `readyWhen` checks can poll on status conditions. This makes it possible to model real-world dependencies without resorting to init containers or sidecar hacks.

## What can you build with it?

We've been collecting examples as the project has grown, and the range is pretty wide:

**Platform abstractions.** This is the most common use case. Platform teams define a handful of RGDs — `WebApp`, `DataPipeline`, `MLJob` — and application teams just fill in the blanks. The platform team controls defaults, security policies, and which parameters are exposed.

**Multi-cloud resource orchestration.** Because kro works with any Kubernetes resource, it's compatible with cloud provider CRDs from [ACK](https://aws-controllers-k8s.org/), [KCC](https://github.com/GoogleCloudPlatform/k8s-config-connector), and [ASO](https://azure.github.io/azure-service-operator/). You can define an RGD that creates a GKE cluster via KCC, deploys your workloads, and sets up monitoring — all driven from a single API call.

**SaaS multi-tenancy.** RGDs can reference other RGDs, so you can build hierarchical resource definitions. A `Tenant` RGD can create namespaces, resource quotas, network policies, and a base application stack. Each tenant instance gets an isolated environment without any manual setup.

## A note on maturity

Kro is still at API version `v1alpha1`, and it's not production-ready yet. The community has been iterating quickly — there have been 27 releases so far, with the latest being v0.9.2. The core concepts are solid, but things like performance at scale, advanced monitoring, and certain edge cases around resource deletion are still being worked out.

That said, it's perfectly usable in development environments today. The installation is straightforward:

```bash
kubectl apply -f https://kro.run/install.yaml
```

And the [quickstart tutorial](https://kro.run/docs/getting-started/deploy-a-resource-graph-definition) walks through creating your first RGD in a few minutes.

## Getting involved

The project is hosted under [SIG Cloud Provider](https://github.com/kubernetes/community/tree/master/sig-cloud-provider), and the [GitHub repository](https://github.com/kubernetes-sigs/kro) is open to contributions. The [examples directory](https://kro.run/examples/) has a growing collection of RGDs for various scenarios, and we'd love to see more.

If you're curious, swing by the [#kro Slack channel](https://kubernetes.slack.com/archives/C081TMY9D6Y). It's still early days, and there's plenty of room to help shape where this project goes.
