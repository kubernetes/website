---
layout: blog
title: "Before You Migrate: Five Surprising Ingress-NGINX Behaviors You Need to Know"
draft: true
author: >
  [Steven Jin](https://github.com/Stevenjin8) (Microsoft)
---

As [announced](/blog/2025/11/11/ingress-nginx-retirement/) November 2025, Kubernetes will retire Ingress-NGINX in March 2026.
Despite its widespread usage, Ingress-NGINX is full of surprising defaults and side effects that are probably present in your cluster today.
This blog highlights these behaviors so that you can migrate away safely and make a conscious decision about which behaviors to keep.
This post also compares Ingress-NGINX with Gateway API and shows you how to preserve Ingress-NGINX behavior in Gateway API.
The recurring risk pattern in every section is the same: a seemingly correct translation can still cause outages if it does not consider Ingress-NGINX's quirks.

I'm going to assume that you, the reader, have some familiarity with Ingress-NGINX and the Ingress API.
Most examples use [`httpbin`](https://github.com/postmanlabs/httpbin) as the backend.

Also, note that Ingress-NGINX and NGINX Ingress are two separate Ingress controllers.
[Ingress-NGINX](https://github.com/kubernetes/ingress-nginx) is an Ingress controller maintained and governed by the Kubernetes community that is retiring March 2026.
[NGINX Ingress](https://docs.nginx.com/nginx-ingress-controller/) is an Ingress controller by F5.
Both use NGINX as the dataplane, but are otherwise unrelated.
From now on, this blog post only discusses Ingress-NGINX.

## 1. Regex matches are prefix and case insensitive

Consider the following Ingress:

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: regex-match-ingress
  annotations:
    nginx.ingress.kubernetes.io/use-regex: "true"
spec:
  ingressClassName: nginx
  rules:
  - host: regex-match.example.com
    http:
      paths:
      - path: "/u[A-Z]"
        pathType: ImplementationSpecific
        backend:
          service:
            name: httpbin
            port:
              number: 8000
```

Due to the `/u[A-Z]` pattern, one would expect that this Ingress would only match requests with a path containing only a `u` followed by one uppercase letter, but this is not the case.

```bash
curl -sS -H "Host: regex-match.example.com" http://<your-ingress-ip>/uuid
```

The output is similar to:

```yaml
{
  "uuid": "e55ef929-25a0-49e9-9175-1b6e87f40af7"
}
```

**Note:** The `/uuid` endpoint of httpbin returns a random UUID.
A UUID in the response body means that the request was successfully routed to httpbin.

Because Ingress-NGINX performs [case-insensitive prefix matching](https://kubernetes.github.io/ingress-nginx/user-guide/ingress-path-matching/), the `/u[A-Z]` pattern matches **any** path that **starts** with a `u` or `U` followed by any letter, such as `/uuid`.
As such, Ingress-NGINX routes `/uuid` to the `httpbin` service, rather than responding with a 404 Not Found.
In other words, `path: "/u[A-Z]"` is equivalent to `path: "/[uU][a-zA-Z].*"`.

With Gateway API, you can use an [HTTP path match](https://gateway-api.sigs.k8s.io/reference/spec/#httppathmatch) with a `type` of `RegularExpression` for regular expression path matching.
`RegularExpression` matches are implementation specific, so check with your Gateway API implementation to verify the semantics of `RegularExpression` matching.
Popular Envoy-based Gateway API implementations such as [Istio](https://istio.io/)[^1], [Envoy Gateway](https://gateway.envoyproxy.io/), and [Kgateway](https://kgateway.dev/) use RE2 for their regex flavor and do a full case-sensitive match.

Thus, if you are unaware that Ingress-NGINX patterns are prefix and case-insensitive, and your
clients or applications send traffic to `/uuid` (or `/uuid/some/other/path`), you might create the following HTTP route.

```yaml
apiVersion: gateway.networking.k8s.io/v1
kind: HTTPRoute
metadata:
  name: regex-match-route
spec:
  hostnames:
  - regex-match.example.com
  parentRefs:
  - name: <your gateway>  # Change this depending on your use case
  rules:
  - matches:
    - path:
        type: RegularExpression
        value: "/[u][A-Z]"
    backendRefs:
    - name: httpbin
      port: 8000
```

However, if your Gateway API implementation does full case-sensitive matches,
then the above HTTP route would respond with a 404 Not Found to a request to `/uuid`.
Using the above HTTP route will cause an outage because requests that used to be routed to a backwn in Ingress-NGINX now fail to match any route and with a 404 Not Found at the Gateway.

To preserve the case-insensitive regex matching, you can use the following HTTP route.

```yaml
apiVersion: gateway.networking.k8s.io/v1
kind: HTTPRoute
metadata:
  name: regex-match-route
spec:
  hostnames:
  - regex-match.example.com
  parentRefs:
  - name: <your gateway>  # Change this depending on your use case
  rules:
  - matches:
    - path:
        type: RegularExpression
        value: "/[uU][a-zA-Z].*"
    backendRefs:
    - name: httpbin
      port: 8000
```

`[uU][a-zA-Z]` matches a `u` or `U` and then any letter, and `.*` matches any number of any character.
Alternatively, the aforementioned proxies use RE2 for their regex engine, so you can also use the `(?i)` flag to indicate case insensitive matches.
Using the flag, the pattern could be `(?i)/u[A-Z].*` instead of `/[uU][a-zA-Z].*`.

## 2. The `nginx.ingress.kubernetes.io/use-regex` applies to all paths of a host across all (Ingress-NGINX) Ingresses

Consider the following Ingresses:

```yaml
---
# This ingress is the same as above
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: regex-match-ingress
  annotations:
    nginx.ingress.kubernetes.io/use-regex: "true"
spec:
  ingressClassName: nginx
  rules:
  - host: regex-match.example.com
    http:
      paths:
      - path: "/u[A-Z]"
        pathType: ImplementationSpecific
        backend:
          service:
            name: httpbin
            port:
              number: 8000
---
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: regex-match-ingress-other
spec:
  ingressClassName: nginx
  rules:
  - host: regex-match.example.com
    http:
      paths:
      - path: "/HEAD"
        pathType: Exact
        backend:
          service:
            name: httpbin
            port:
              number: 8000
```

Most would expect a request to `/headers` to respond with a 404 Not Found, since `/headers` does not match the `Exact` path of `/HEAD`.
However, because the `regex-match-ingress` Ingress has the `nginx.ingress.kubernetes.io/use-regex: "true"` annotation and the `regex-match.example.com` host, **all paths with the `regex-match.example.com` host are treated as regular expressions across all (Ingress-NGINX) Ingresses.** 
Since regex patterns are case-insensitive prefix matches, `/headers` matches the `/HEAD` pattern and Ingress-NGINX routes the request to `httpbin`. Running the command

```bash
curl -sS -H "Host: regex-match.example.com" http://<your-ingress-ip>/headers
```

The output looks like:

```yaml
{
  "headers": {
    ...
  }
}
```


**Note:** The `/headers` endpoint of httpbin returns the request headers.
The fact that the response contains the request headers in the body means that our request was successfully routed to httpbin.

Gateway API does not silently convert nor interpret `Exact` and `Prefix` matches into regex patterns.
The following HTTP route would respond with a 404 Not Found to a `/headers` request.

```yaml
apiVersion: gateway.networking.k8s.io/v1
kind: HTTPRoute
metadata:
  name: regex-match-route
spec:
  hostnames:
  - regex-match.example.com
  rules:
  ...
  - matches:
    - path:
        type: Exact
        value: "/HEAD"
    backendRefs:
    - name: httpbin
      port: 8000
```

As in Section 1, if you unknowingly rely on this Ingress-NGINX quirk, the above HTTP route can cause an outage.
To keep the case-insensitive prefix matching, you can change

```yaml
  - matches:
    - path:
        type: Exact
        value: "/HEAD"
```

to

```yaml
  - matches:
    - path:
        type: RegularExpression
        value: "/[hH][eE][aA][dD].*" # or "(?i)/head"
```

## 3. Rewrite target implies regex

Consider the following Ingresses.:

```yaml
---
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: rewrite-target-ingress
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: "/uuid"
spec:
  ingressClassName: nginx
  rules:
  - host: rewrite-target.example.com
    http:
      paths:
      - path: "/[abc]"
        pathType: ImplementationSpecific
        backend:
          service:
            name: httpbin
            port:
              number: 8000
---
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: rewrite-target-ingress-other
spec:
  ingressClassName: nginx
  rules:
  - host: rewrite-target.example.com
    http:
      paths:
      - path: "/HEAD"
        pathType: Exact
        backend:
          service:
            name: httpbin
            port:
              number: 8000
```

The `nginx.ingress.kubernetes.io/rewrite-target: "/uuid"` annotation
causes requests that match paths in the `rewrite-target-ingress` Ingress to have their paths rewritten to `/uuid` before being routed to the backend.

Even though no Ingress has the `nginx.ingress.kubernetes.io/use-regex: "true"` annotation,
the presence of the `nginx.ingress.kubernetes.io/rewrite-target` annotation in the `rewrite-target-ingress` Ingress causes **all paths with the `rewrite-target.example.com` host to be treated as regex patterns.**
In other words, the `nginx.ingress.kubernetes.io/rewrite-target` silently adds the `nginx.ingress.kubernetes.io/use-regex: "true"` annotation, along with all the side effects discussed above.

For example, a request to `/ABCdef` has its path rewritten to `/uuid` because `/ABCdef` matches the case-insensitive prefix pattern of `/[abc]` in the `rewrite-target-ingress` Ingress. After running the command

```bash
curl -sS -H "Host: rewrite-target.example.com" http://<your-ingress-ip>/ABCdef
```

the output is similar to:

```yaml
{
  "uuid": "12a0def9-1adg-2943-adcd-1234gadfgc67"
}
```

Like in the `nginx.ingress.kubernetes.io/use-regex` example, Ingress-NGINX treats `path`s of other ingresses with the `rewrite-target.example.com` host as case-insensitive prefix patterns.

```bash
curl -sS -H "Host: rewrite-target.example.com" http://<your-ingress-ip>/headers
```

The output looks like:

```yaml
{
  "headers": {
    ...
  }
}
```

You can configure path rewrites in Gateway API with the [HTTP URL rewrite filter](https://gateway-api.sigs.k8s.io/reference/spec/#httpurlrewritefilter).

```yaml
apiVersion: gateway.networking.k8s.io/v1
kind: HTTPRoute
metadata:
  name: rewrite-target-route
spec:
  hostnames:
  - rewrite-target.example.com
  parentRefs:
  - name: <your-gateway>
  rules:
  - matches:
    - path:
        type: RegularExpression
        value: "[abcABC].*" # or "[abc]" if you do not want the case insensitive prefix match
    filters:
    - type: URLRewrite
      urlRewrite:
        path:
          type: ReplaceFullPath
          replaceFullPath: /uuid
    backendRefs:
    - name: httpbin
      port: 8000
  - matches:
    - path:
        # This is an exact match, irrespective of other rules
        type: Exact
        value: "/HEAD"
    backendRefs:
    - name: httpbin
      port: 8000
```

HTTP URL rewrite filters do not silently convert your `Exact` and `Prefix` matches into regex patterns.
As with Sections 1 and 2 of this article: if you unknowingly depend on this Ingress-NGINX side effect,
**a direct migration can break previously working routes**.
As before, you can keep the case-insensitive prefix match by changing

```yaml
  - matches:
    - path:
        type: Exact
        value: "/HEAD"
```

to

```yaml
  - matches:
    - path:
        type: RegularExpression
        value: "/[hH][eE][aA][dD].*" # or "(?i)/head"
```

## 4. Requests missing a trailing slash are redirected to the same path with a trailing slash

Consider the following Ingress:

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: trailing-slash-ingress
spec:
  ingressClassName: nginx
  rules:
  - host: trailing-slash.example.com
    http:
      paths:
      - path: "/my-path/"
        pathType: Exact
        backend:
          service:
            name: <your-backend>
            port:
              number: 8000
```

You might expect Ingress-NGINX to respond to `/my-path` with a 404 Not Found since the `/my-path` does not exactly match the `Exact` path of `/my-path/`.
However, Ingress-NGINX redirects the request to `/my-path/` with a 301 Moved Permanently because the only difference between `/my-path` and `/my-path/` is a trailing slash.

```bash
curl -isS -H "Host: trailing-slash.example.com" http://<your-ingress-ip>/my-path
```

The output looks like:

```http
HTTP/1.1 301 Moved Permanently
...
Location: http://trailing-slash.example.com/my-path/
...
```

The same applies if you change the `pathType` to `Prefix`.
However, the redirect does not happen if the path is a regex pattern.

Conformant Gateway API implementations do not silently configure any kind of redirects.
If clients or downstream services depend on this redirect, a migration to Gateway API that
does not explicitly configure request redirects will cause an outage because
requests to `/my-path` will now respond with a 404 Not Found instead of a 301 Moved Permanently.
You can explicitly configure redirects using the [HTTP request redirect filter](https://gateway-api.sigs.k8s.io/reference/spec/#httprequestredirectfilter) as follows

```yaml
apiVersion: gateway.networking.k8s.io/v1
kind: HTTPRoute
metadata:
  name: trailing-slash-route
spec:
  hostnames:
  - trailing-slash.example.com
  parentRefs:
  - name: <your-gateway>
  rules:
  - matches:
    - path:
        type: Exact
        value: "/my-path"
    filters:
      requestRedirect:
        statusCode: 301
        path:
          type: ReplaceFullPath
          replaceFullPath: /my-path/
  - matches:
    - path:
        type: Exact # or Prefix
        value: "/my-path/"
    backendRefs:
    - name: <your-backend>
      port: 8000
```

## 5. Ingress-NGINX normalizes URLs

*URL normalization* is the process of converting a URL into a canonical form before matching it against Ingress rules and routing it.
The specifics of URL normalization are defined in [RFC 3986 Section 6.2](https://datatracker.ietf.org/doc/html/rfc3986#section-6.2), but some examples are

* removing path segments that are just a `.`: `my/./path -> my/path`
* having a `..` path segment remove the previous segment: `my/../path -> /path`
* deduplicating consecutive slashes in a path: `my//path -> my/path`

Ingress-NGINX normalizes URLs before matching them against Ingress rules.
For example, consider the following Ingress:

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: path-normalization-ingress
spec:
  ingressClassName: nginx
  rules:
  - host: path-normalization.example.com
    http:
      paths:
      - path: "/uuid"
        pathType: Exact
        backend:
          service:
            name: httpbin
            port:
              number: 8000
```

Ingress-NGINX normalizes the path of the following requests to `/uuid`.
Now that the request matches the `Exact` path of `/uuid`, Ingress-NGINX responds with either a 200 OK response or a 301 Moved Permanently to `/uuid`.

For the following commands
```bash
curl -sS -H "Host: path-normalization.example.com" http://<your-ingress-ip>/uuid
curl -sS -H "Host: path-normalization.example.com" http://<your-ingress-ip>/ip/abc/../../uuid
curl -sSi -H "Host: path-normalization.example.com" http://<your-ingress-ip>////uuid
```

the outputs are similar to

```yaml
{
  "uuid": "29c77dfe-73ec-4449-b70a-ef328ea9dbce"
}
```
```yaml
{
  "uuid": "d20d92e8-af57-4014-80ba-cf21c0c4ffae"
}
```
```http
HTTP/1.1 301 Moved Permanently
...
Location: /uuid
...
```

Your backends might rely on the Ingress/Gateway API implementation to normalize URLs.
That said, most Gateway API implementations will have some path normalization enabled by default.
For example, Istio, Envoy Gateway, and Kgateway all normalize `.` and `..` segments out of the box.
For more details, check the documentation for each Gateway API implementation that you use.

## Conclusion

As we all race to respond to the Ingress-NGINX retirement, I hope this blog post instills some confidence that you can migrate safely and effectively despite all the intricacies of Ingress-NGINX.

SIG Network has also been working on supporting the most common Ingress-NGINX annotations (and some of these unexpected behaviors) in [Ingress2Gateway](https://github.com/kubernetes-sigs/ingress2gateway) to help you translate Ingress-NGINX configuration into Gateway API, and offer alternatives to unsupported behavior.

SIG Network released Gateway API 1.5 February 26th, 2026, which graduates features such as Listener sets that allow app developers to manage TLS certificates and the CORS filter that allows CORS configuration.

[^1]: You can use Istio purely as Gateway API controller with no other service mesh features.
