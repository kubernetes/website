---
title: "Announcing Ingress2Gateway 1.0: Your Path to Gateway API"
slug: ingress2gateway-1-0-release
tags: ["Gateway API", "Networking", "SIG Network", "Migration"]
authors: [
    "[Beka Modebadze](https://github.com/bexxmodd) (Google)",
    "[Steven Jin](https://github.com/Stevenjin8) (Microsoft)"
]
draft: true
---

**I'm still waiting for the gateway api 1.5 release to update links**

## Introduction

[With the Ingress-NGINX retirement scheduled March 2026](/blog/2025/11/11/ingress-nginx-retirement/), the Kubernetes networking landscape is at a turning point.
For most organizations, the question isn't whether to migrate to Gateway API, but how to do so safely.

Migrating from Ingress to Gateway API is a fundamental shift in API design.
Gateway API provides a modular, extensible, tenancy-aware design. 
Conversely, the Ingress API is overly simple, and implementations such as Ingress NGINX extend the API through esoteric annotations, configmaps, and CRDs.
This flat, annotation-heavy model leads to few tenancy controls and lots of implementation-specific behavior.
Migrating away from Ingress controllers such as Ingress NGINX presents the daunting task of capturing all the nuances of the Ingress controller, and mapping that behavior to Gateway API and implementation-specific Gateway API extensions.

Ingress2Gateway is an assistant that helps teams confidently move from Ingress to Gateway API.
It translates Ingress resources and implementation-specific annotations to Gateway API while warning you about untranslatable configuration and offering suggestions.

Today, SIG Network is proud to announce the **1.0 release of Ingress2Gateway**.
This milestone represents a comprehensive, stable, tested migration assistant for teams ready to modernize their networking stack.

## Ingress2Gateway 1.0

### Ingress NGINX Annotation Support

The main improvement for the 1.0 release is more comprehensive Ingress NGINX support.
Before the 1.0 release, Ingress2Gateway only supported three Ingress NGINX annotations.
For the 1.0 release, Ingress2Gateway supports over 30 common annotations (CORS, Backend TLS, regex matching, path rewrite, etc.).

### E2E Tests for Ingress NGINX

Each supported Ingress NGINX annotation, and representative combinations of common annotations, is backed by controller-level integration tests that verify the behavioral equivalence of the Ingress NGINX configuration and the generated Gateway API.
These tests exercise real controllers in live clusters and compare runtime behavior (routing, redirects, rewrites, etc.), not just YAML structure.

Our tests:

* spin up an Ingress NGINX controller
* spin up multiple Gateway API controllers
* apply Ingress resources that have implementation-specific configuration
* translate Ingress resources to Gateway API with `ingress2gateway` and apply generated resources
* verify that the Gateway API controllers and the Ingress controller exhibit equivalent behavior.

A comprehensive test suite not only catches bugs in development, but also ensures the correctness of the translation, especially given [surprising edge cases and unexpected defaults](Link to article with these), so that you don't find out about them in production.

### Notification & Error Handling System

Migration is not "one-click" and surfacing subtleties and untranslatable behavior is as important as translating supported configuration.
The 1.0 release cleans up the formatting and content of notifications, so it is clear what is missing and how you can fix it.

## Using Ingress2Gateway

Ingress2Gateway is a migration assistant, not a one-shot replacement.
Its goal is to

* migrate supported Ingress configuration and behavior
* identify unsupported configuration and suggest alternatives
* reevaluate and potentially discard undesirable configuration

The rest of the section shows you how to safely migrate the following Ingress NGINX configuration

```yaml=
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  annotations:
    nginx.ingress.kubernetes.io/proxy-body-size: "1g"
    nginx.ingress.kubernetes.io/use-regex: "true"
    nginx.ingress.kubernetes.io/proxy-send-timeout: "1"
    nginx.ingress.kubernetes.io/proxy-read-timeout: "1"
    nginx.ingress.kubernetes.io/enable-cors: "true"
  name: my-api
  namespace: my-api
spec:
  ingressClassName: nginx
  rules:
    - host: my-api.example.com
      http:
        paths:
          - backend:
              service:
                name: website-service
                port:
                  number: 80
            path: /users/(\d+)
            pathType: ImplementationSpecific
  tls:
    - hosts:
        - my-api.example.com
      secretName: my-api-tls
```

### 1. Install the Toolkit

Install the binary with

```bash
go install github.com/kubernetes-sigs/ingress2gateway@v1.0.0
```

or

```bash
brew install ingress2gateway
```

You can also download the binary from [GitHub](https://github.com/kubernetes-sigs/ingress2gateway/releases/tag/v1.0.0) or [build from source](https://github.com/kubernetes-sigs/ingress2gateway/)

### 2. Run Ingress2Gateway

You can either pass Ingress2Gateway Ingress manifests, point it at a namespace in your cluster, or your whole cluster

```bash
# Pass it files
i2gw print --input-file my-manifest.yaml,my-other-manifest.yaml --providers=ingress-nginx > gwapi.yaml
# Use a namespace in your cluster
i2gw print --namespace my-api --providers=ingress-nginx > gwapi.yaml
# Or your whole cluster
i2gw print --providers=ingress-nginx > gwapi.yaml
```

**Note:** You can also pass `--emitter <kgateway|envoy-gateway>` to output implementation-specific extensions. 

### 3. Review the output

This is the most critical step.
Ingress2Gateway outputs Gateway API resources to `gwapi.yaml`, and it also emits warnings that explain what did not translate exactly and what to review manually.

```yaml=
apiVersion: gateway.networking.k8s.io/v1
kind: Gateway
metadata:
  annotations:
    gateway.networking.k8s.io/generator: ingress2gateway-dev
  name: nginx
  namespace: my-api
spec:
  gatewayClassName: nginx
  listeners:
  - hostname: my-api.example.com
    name: my-api-example-com-http
    port: 80
    protocol: HTTP
  - hostname: my-api.example.com
    name: my-api-example-com-https
    port: 443
    protocol: HTTPS
    tls:
      certificateRefs:
      - group: ""
        kind: Secret
        name: my-api-tls
---
apiVersion: gateway.networking.k8s.io/v1
kind: HTTPRoute
metadata:
  annotations:
    gateway.networking.k8s.io/generator: ingress2gateway-dev
  name: my-api-my-api-example-com
  namespace: my-api
spec:
  hostnames:
  - my-api.example.com
  parentRefs:
  - name: nginx
    port: 443
  rules:
  - backendRefs:
    - name: website-service
      port: 80
    filters:
    - cors:
        allowCredentials: true
        allowHeaders:
        - DNT
        ...
        allowMethods:
        - GET
        ...
        allowOrigins:
        - '*'
        maxAge: 1728000
      type: CORS
    matches:
    - path:
        type: RegularExpression
        value: (?i)/users/(\d+).*
    name: rule-0
    timeouts:
      request: 10s
status:
  parents: []
---
apiVersion: gateway.networking.k8s.io/v1
kind: HTTPRoute
metadata:
  annotations:
    gateway.networking.k8s.io/generator: ingress2gateway-dev
  name: my-api-my-api-example-com-ssl-redirect
  namespace: my-api
spec:
  hostnames:
  - my-api.example.com
  parentRefs:
  - name: nginx
    port: 80
  rules:
  - filters:
    - requestRedirect:
        scheme: https
        statusCode: 308
      type: RequestRedirect
status:
  parents: null
```

Ingress2Gateway successfully translated some annotations into their Gateway API equivalents.
For example, the `nginx.ingress.kubernetes.io/enable-cors` annotation was translated into a CORS filter.
But upon closer inspection, the `nginx.ingress.kubernetes.io/proxy-{read,send}-timeout` and `nginx.ingress.kubernetes.io/proxy-body-size` annotations do not map perfectly.
The logs show the reason for these omissions as well as reasoning behind the translation

```
[WARNING] HTTPRoute my-api/my-api-my-api-example-com
          Failed to parse annotation:
          nginx.ingress.kubernetes.io/proxy-body-size
          Most Gateway API implementations have reasonable
          body size and buffering defaults.

[WARNING] HTTPRoute my-api/my-api-my-api-example-com
          ingress-nginx only supports TCP-level timeouts.
          i2gw performed a best-effort translation to
          timeouts.request.
          Please verify this meets your needs:
          https://gateway-api.sigs.k8s.io/guides/http-timeouts/

[WARNING] HTTPRoute my-api/my-api-my-api-example-com
          ingress-nginx regex matches are case-insensitive prefix matches.
          You might want to change this.
```

Ingress2Gateway made a best-effort translation from the `nginx.ingress.kubernetes.io/proxy-{send,read}-timeout` annotations to a 10 second [request timeout](https://gateway-api.sigs.k8s.io/guides/http-timeouts/) in our HTTP route.
If requests for this service should be much shorter, say 3 seconds, you can make the corresponding changes to our Gateway API manifests.

To match Ingress NGINX default behavior, Ingress2Gateway also added a listener on port 80 and a [HTTP Request redirect filter](https://gateway-api.sigs.k8s.io/reference/spec/#httprequestredirectfilter) to redirect HTTP traffic to HTTPS.
Some organizations might not want to serve HTTP traffic at all and remove the listener on port 80 and the corresponding HTTPRoute.

There is also a warning that Ingress NGINX regex matches are case-insensitive prefix matches, which is why there is a match pattern of `(?i)/users/(\d+).*`.
Most organizations will want to change this behavior to be an exact case-sensitive match by remove the leading `(?i)` and the trailing `.*` from the path pattern.

**WARNING:** Always thoroughly review the generated output and logs.

After manually applying these changes, the Gateway API manifests might look as follows.

```yaml=
---
apiVersion: gateway.networking.k8s.io/v1
kind: Gateway
metadata:
  annotations:
    gateway.networking.k8s.io/generator: ingress2gateway-dev
  name: nginx
  namespace: my-api
spec:
  gatewayClassName: nginx
  listeners:
  - hostname: my-api.example.com
    name: my-api-example-com-https
    port: 443
    protocol: HTTPS
    tls:
      certificateRefs:
      - group: ""
        kind: Secret
        name: my-api-tls
---
apiVersion: gateway.networking.k8s.io/v1
kind: HTTPRoute
metadata:
  annotations:
    gateway.networking.k8s.io/generator: ingress2gateway-dev
  name: my-api-my-api-example-com
  namespace: my-api
spec:
  hostnames:
  - my-api.example.com
  parentRefs:
  - name: nginx
    port: 443
  rules:
  - backendRefs:
    - name: website-service
      port: 80
    filters:
    - cors:
        allowCredentials: true
        allowHeaders:
        - DNT
        ...
        allowMethods:
        - GET
        ...
        allowOrigins:
        - '*'
        maxAge: 1728000
      type: CORS
    matches:
    - path:
        type: RegularExpression
        value: (?i)/users/(\d+).*
    name: rule-0
    timeouts:
      request: 3s
```

### 4. Verify

Now that you have Gateway API manifests, you should thoroughly test them in a development cluster.
In this case, you should at least double-check that your Gateway API implementation's maximum body size defaults are appropriate for you and verify that a three second timeout is enough.

After validating behavior in a development cluster, deploy your Gateway API configuration alongside your existing Ingress.
Then, gradually shift traffic using weighted DNS, your cloud load balancer, or traffic-splitting features of your platform.
This way, you can quickly recover from any misconfiguration that made it through your tests.

Finally, when you have shifted all your traffic to your Gateway API controller, delete your Ingress resources and your Ingress NGINX controller.

## Conclusion

The Ingress2Gateway 1.0 release is just the beginning, and we hope that you use Ingress2Gateway to safely migrate to Gateway API.
As we approach the March 2026 Ingress-NGINX retirement, we invite the community to help us increase our configuration coverage, expand testing, and improve UX.

## Gateway API Resources

The complexity of Gateway API can be daunting, but much of its design was a direct result of Ingress API shortcomings.
Here are some resources to help you work with Gateway API:

* [Listener sets](https://gateway-api.sigs.k8s.io/geps/gep-1713/?h=listenersets) allow application developers to manage gateway listeners.
* [`gwctl`](https://github.com/kubernetes-sigs/gwctl) gives you a comprehensive view of your Gateway resources, such as attachments and linter errors.
* Gateway API Slack: `#sig-network-gateway-api` on [Kubernetes Slack](https://kubernetes.slack.com)
* Ingress2Gateway Slack: `#sig-network-ingress2gateway` on [Kubernetes Slack](https://kubernetes.slack.com)
* GitHub: [kubernetes-sigs/ingress2gateway](https://github.com/kubernetes-sigs/ingress2gateway)
