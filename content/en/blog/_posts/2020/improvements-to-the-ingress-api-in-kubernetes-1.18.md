---
layout: blog
title: Improvements to the Ingress API in Kubernetes 1.18
date: 2020-04-02
slug: Improvements-to-the-Ingress-API-in-Kubernetes-1.18
author: >
  Rob Scott (Google),
  Christopher M Luciano (IBM) 
---

The Ingress API in Kubernetes has enabled a large number of controllers to provide simple and powerful ways to manage inbound network traffic to Kubernetes workloads. In Kubernetes 1.18, we've made 3 significant additions to this API:

* A new `pathType` field that can specify how Ingress paths should be matched.
* A new `IngressClass` resource that can specify how Ingresses should be implemented by controllers.
* Support for wildcards in hostnames.

## Better Path Matching With Path Types
The new concept of a path type allows you to specify how a path should be matched. There are three supported types:

* __ImplementationSpecific (default):__ With this path type, matching is up to the controller implementing the `IngressClass`. Implementations can treat this as a separate `pathType` or treat it identically to the `Prefix` or `Exact` path types.
* __Exact:__ Matches the URL path exactly and with case sensitivity.
* __Prefix:__ Matches based on a URL path prefix split by `/`. Matching is case sensitive and done on a path element by element basis.
   
## Extended Configuration With Ingress Classes
The Ingress resource was designed with simplicity in mind, providing a simple set of fields that would be applicable in all use cases. Over time, as use cases evolved, implementations began to rely on a long list of custom annotations for further configuration. The new `IngressClass` resource provides a way to replace some of those annotations.

Each `IngressClass` specifies which controller should implement Ingresses of the class and can reference a custom resource with additional parameters. 
```yaml
apiVersion: "networking.k8s.io/v1beta1"
kind: "IngressClass"
metadata:
  name: "external-lb"
spec:
  controller: "example.com/ingress-controller"
  parameters:
    apiGroup: "k8s.example.com/v1alpha"
    kind: "IngressParameters"
    name: "external-lb"
```

### Specifying the Class of an Ingress
A new `ingressClassName` field has been added to the Ingress spec that is used to reference the `IngressClass` that should be used to implement this Ingress.  

### Deprecating the Ingress Class Annotation
Before the `IngressClass` resource was added in Kubernetes 1.18, a similar concept of Ingress class was often specified with a `kubernetes.io/ingress.class` annotation on the Ingress. Although this annotation was never formally defined, it was widely supported by Ingress controllers, and should now be considered formally deprecated.

### Setting a Default IngressClass
It’s possible to mark a specific `IngressClass` as default in a cluster. Setting the
`ingressclass.kubernetes.io/is-default-class` annotation to true on an
IngressClass resource will ensure that new Ingresses without an `ingressClassName` specified will be assigned this default `IngressClass`.

## Support for Hostname Wildcards
Many Ingress providers have supported wildcard hostname matching like `*.foo.com` matching `app1.foo.com`, but until now the spec assumed an exact FQDN match of the host. Hosts can now be precise matches (for example “`foo.bar.com`”) or a wildcard (for example “`*.foo.com`”). Precise matches require that the http host header matches the Host setting. Wildcard matches require the http host header is equal to the suffix of the wildcard rule.

| Host        | Host header       | Match?                                            |
| ----------- |-------------------| --------------------------------------------------|
| `*.foo.com` | `bar.foo.com`     | Matches based on shared suffix                    |
| `*.foo.com` | `baz.bar.foo.com` | No match, wildcard only covers a single DNS label |
| `*.foo.com` | `foo.com`         | No match, wildcard only covers a single DNS label |

### Putting it All Together
These new Ingress features allow for much more configurability. Here’s an example of an Ingress that makes use of pathType, `ingressClassName`, and a hostname wildcard:

```yaml
apiVersion: "networking.k8s.io/v1beta1"
kind: "Ingress"
metadata:
  name: "example-ingress"
spec:
  ingressClassName: "external-lb"
  rules:
  - host: "*.example.com"
    http:
      paths:
      - path: "/example"
        pathType: "Prefix"
        backend:
          serviceName: "example-service"
          servicePort: 80
```

### Ingress Controller Support
Since these features are new in Kubernetes 1.18, each Ingress controller implementation will need some time to develop support for these new features. Check the documentation for your preferred Ingress controllers to see when they will support this new functionality.

## The Future of Ingress
The Ingress API is on pace to graduate from beta to a stable API in Kubernetes 1.19. It will continue to provide a simple way to manage inbound network traffic for Kubernetes workloads. This API has intentionally been kept simple and lightweight, but there has been a desire for greater configurability for more advanced use cases. 

Work is currently underway on a new highly configurable set of APIs that will provide an alternative to Ingress in the future. These APIs are being referred to as the new “Service APIs”. They are not intended to replace any existing APIs, but instead provide a more configurable alternative for complex use cases.  For more information, check out the [Service APIs repo on GitHub](http://github.com/kubernetes-sigs/service-apis).
