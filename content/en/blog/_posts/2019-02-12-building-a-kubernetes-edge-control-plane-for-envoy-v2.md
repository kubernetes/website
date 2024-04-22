---
title: Building a Kubernetes Edge (Ingress) Control Plane for Envoy v2
date: 2019-02-12
slug: building-a-kubernetes-edge-control-plane-for-envoy-v2
author: >
  Daniel Bryant (Datawire),
  Flynn (Datawire),
  Richard Li (Datawire) 
---


Kubernetes has become the de facto runtime for container-based microservice applications, but this orchestration framework alone does not provide all of the infrastructure necessary for running a distributed system. Microservices typically communicate through Layer 7 protocols such as HTTP, gRPC, or WebSockets, and therefore having the ability to make routing decisions, manipulate protocol metadata, and observe at this layer is vital. However, traditional load balancers and edge proxies have predominantly focused on L3/4 traffic. This is where the [Envoy Proxy](https://www.envoyproxy.io/) comes into play.

Envoy proxy was designed as a [universal data plane](https://blog.envoyproxy.io/the-universal-data-plane-api-d15cec7a) from the ground-up by the Lyft Engineering team for today's distributed, L7-centric world, with broad support for L7 protocols, a real-time API for managing its configuration, first-class observability, and high performance within a small memory footprint. However, Envoy's vast feature set and flexibility of operation also makes its configuration highly complicated -- this is evident from looking at its rich but verbose [control plane](https://blog.envoyproxy.io/service-mesh-data-plane-vs-control-plane-2774e720f7fc) syntax.

With the open source [Ambassador API Gateway](https://www.getambassador.io), we wanted to tackle the challenge of creating a new control plane that focuses on the use case of deploying Envoy as an forward-facing edge proxy within a Kubernetes cluster, in a way that is idiomatic to Kubernetes operators. In this article, we'll walk through two major iterations of the Ambassador design, and how we integrated Ambassador with Kubernetes.


## Ambassador pre-2019: Envoy v1 APIs, Jinja Template Files, and Hot Restarts

Ambassador itself is deployed within a container as a Kubernetes service, and uses annotations added to Kubernetes Services as its [core configuration model](https://www.getambassador.io/reference/configuration). This approach [enables application developers to manage routing](https://www.getambassador.io/concepts/developers) as part of the Kubernetes service definition. We explicitly decided to go down this route because of [limitations](https://blog.getambassador.io/kubernetes-ingress-nodeport-load-balancers-and-ingress-controllers-6e29f1c44f2d) in the current [Ingress API spec](/docs/concepts/services-networking/ingress/), and we liked the simplicity of extending Kubernetes services, rather than introducing another custom resource type. An example of an Ambassador annotation can be seen here:


```
kind: Service
apiVersion: v1
metadata:
  name: my-service
  annotations:
    getambassador.io/config: |
      ---
        apiVersion: ambassador/v0
        kind:  Mapping
        name:  my_service_mapping
        prefix: /my-service/
        service: my-service
spec:
  selector:
    app: MyApp
  ports:
  - protocol: TCP
    port: 80
    targetPort: 9376
```


Translating this simple Ambassador annotation config into valid [Envoy v1](https://www.envoyproxy.io/docs/envoy/v1.6.0/configuration/overview/v1_overview) config was not a trivial task. By design, Ambassador's configuration isn't based on the same conceptual model as Envoy's configuration -- we deliberately wanted to aggregate and simplify operations and config. Therefore, translating between one set of concepts to the other involves a fair amount of logic within Ambassador.

In this first iteration of Ambassador we created a Python-based service that watched the Kubernetes API for changes to Service objects. When new or updated Ambassador annotations were detected, these were translated from the Ambassador syntax into an intermediate representation (IR) which embodied our core configuration model and concepts. Next, Ambassador translated this IR into a representative Envoy configuration which was saved as a file within pods associated with the running Ambassador k8s Service. Ambassador then "hot-restarted" the Envoy process running within the Ambassador pods, which triggered the loading of the new configuration.

There were many benefits with this initial implementation. The mechanics involved were fundamentally simple, the transformation of Ambassador config into Envoy config was reliable, and the file-based hot restart integration with Envoy was dependable.

However, there were also notable challenges with this version of Ambassador. First, although the hot restart was effective for the majority of our customers' use cases, it was not very fast, and some customers (particularly those with huge application deployments) found it was limiting the frequency with which they could change their configuration. Hot restart can also drop connections, especially long-lived connections like WebSockets or gRPC streams.

More crucially, though, the first implementation of the IR allowed rapid prototyping but was primitive enough that it proved very difficult to make substantial changes. While this was a pain point from the beginning, it became a critical issue as Envoy shifted to the [Envoy v2 API](https://www.envoyproxy.io/docs/envoy/latest/configuration/overview/v2_overview). It was clear that the v2 API would offer Ambassador many benefits -- as Matt Klein outlined in his blog post, "[The universal data plane API](https://blog.envoyproxy.io/the-universal-data-plane-api-d15cec7a)" -- including access to new features and a solution to the connection-drop problem noted above, but it was also clear that the existing IR implementation was not capable of making the leap.


## Ambassador >= v0.50: Envoy v2 APIs (ADS), Testing with KAT, and Golang

In consultation with the [Ambassador community](http://d6e.co/slack), the [Datawire](https://www.datawire.io) team undertook a redesign of the internals of Ambassador in 2018. This was driven by two key goals. First, we wanted to integrate Envoy's v2 configuration format, which would enable the support of features such as [SNI](https://www.getambassador.io/user-guide/sni/), [rate limiting](https://www.getambassador.io/user-guide/rate-limiting) and [gRPC authentication APIs](https://www.getambassador.io/user-guide/auth-tutorial). Second, we also wanted to do much more robust semantic validation of Envoy configuration due to its increasing complexity (particularly when operating with large-scale application deployments).


### Initial stages

We started by restructuring the Ambassador internals more along the lines of a multipass compiler. The class hierarchy was made to more closely mirror the separation of concerns between the Ambassador configuration resources, the IR, and the Envoy configuration resources. Core parts of Ambassador were also redesigned to facilitate contributions from the community outside Datawire. We decided to take this approach for several reasons. First, Envoy Proxy is a very fast moving project, and we realized that we needed an approach where a seemingly minor Envoy configuration change didn't result in days of reengineering within Ambassador. In addition, we wanted to be able to provide semantic verification of configuration.

As we started working more closely with Envoy v2, a testing challenge was quickly identified. As more and more features were being supported in Ambassador, more and more bugs appeared in Ambassador's handling of less common but completely valid combinations of features. This drove to creation of a new testing requirement that meant Ambassador's test suite needed to be reworked to automatically manage many combinations of features, rather than relying on humans to write each test individually. Moreover, we wanted the test suite to be fast in order to maximize engineering productivity.

Thus, as part of the Ambassador rearchitecture, we introduced the [Kubernetes Acceptance Test (KAT)](https://github.com/datawire/ambassador/tree/master/python/kat) framework. KAT is an extensible test framework that:



1.  Deploys a bunch of services (along with Ambassador) to a Kubernetes cluster
1.  Run a series of verification queries against the spun up APIs
1.  Perform a bunch of assertions on those query results

KAT is designed for performance -- it batches test setup upfront, and then runs all the queries in step 3 asynchronously with a high performance client. The traffic driver in KAT runs locally using [Telepresence](https://www.telepresence.io), which makes it easier to debug issues.

### Introducing Golang to the Ambassador Stack

With the KAT test framework in place, we quickly ran into some issues with Envoy v2 configuration and hot restart, which presented the opportunity to switch to use Envoy’s Aggregated Discovery Service (ADS) APIs instead of hot restart. This completely eliminated the requirement for restart on configuration changes, which we found could lead to dropped connection under high loads or long-lived connections.

However, we faced an interesting question as we considered the move to the ADS. The ADS is not as simple as one might expect: there are explicit ordering dependencies when sending updates to Envoy. The Envoy project has reference implementations of the ordering logic, but only in Go and Java, where Ambassador was primarily in Python. We agonized a bit, and decided that the simplest way forward was to accept the polyglot nature of our world, and do our ADS implementation in Go.

We also found, with KAT,  that our testing had reached the point where Python’s performance with many network connections was a limitation, so we took advantage of Go here, as well, writing KAT’s querying and backend services primarily in Go. After all, what’s another Golang dependency when you’ve already taken the plunge?

With a new test framework, new IR generating valid Envoy v2 configuration, and the ADS, we thought we were done with the major architectural changes in Ambassador 0.50. Alas, we hit one more issue. On the Azure Kubernetes Service, Ambassador annotation changes were no longer being detected.

Working with the highly-responsive AKS engineering team, we were able to identify the issue -- namely, the Kubernetes API server in AKS is exposed through a chain of proxies, requiring clients to be updating to understand how to connect using the FQDN of the API server, which is provided through a mutating webhook in AKS. Unfortunately, support for this feature was not available in the official Kubernetes Python client, so this was the third spot where we chose to switch to Go instead of Python.

This raises the interesting question of, “why not ditch all the Python code, and just rewrite Ambassador entirely in Go?” It’s a valid question. The main concern with a rewrite is that Ambassador and Envoy operate at different conceptual levels rather than simply expressing the same concepts with different syntax. Being certain that we’ve expressed the conceptual bridges in a new language is not a trivial challenge, and not something to undertake without already having really excellent test coverage in place

At this point, we use Go to coverage very specific, well-contained functions that can be verified for correctness much more easily that we could verify a complete Golang rewrite. In the future, who knows? But for 0.50.0, this functional split let us both take advantage of Golang’s strengths, while letting us retain more confidence about all the changes already in 0.50.

## Lessons Learned

We've learned a lot in the process of building [Ambassador 0.50](https://blog.getambassador.io/ambassador-0-50-ga-release-notes-sni-new-authservice-and-envoy-v2-support-3b30a4d04c81). Some of our key takeaways:

*   Kubernetes and Envoy are very powerful frameworks, but they are also extremely fast moving targets -- there is sometimes no substitute for reading the source code and talking to the maintainers (who are fortunately all quite accessible!)
*   The best supported libraries in the Kubernetes / Envoy ecosystem are written in Go. While we love Python, we have had to adopt Go so that we're not forced to maintain too many components ourselves.
*   Redesigning a test harness is sometimes necessary to move your software forward.
*   The real cost in redesigning a test harness is often in porting your old tests to the new harness implementation.
*   Designing (and implementing) an effective control plane for the edge proxy use case has been challenging, and the feedback from the open source community around Kubernetes, Envoy and Ambassador has been extremely useful.

Migrating Ambassador to the Envoy v2 configuration and ADS APIs was a long and difficult journey that required lots of architecture and design discussions and plenty of coding, but early feedback from results have been positive. [Ambassador 0.50 is available now](https://blog.getambassador.io/announcing-ambassador-0-50-8dffab5b05e0), so you can take it for a test run and share your feedback with the community on our [Slack channel](http://d6e.co/slack) or on [Twitter](https://www.twitter.com/getambassadorio).
