---
layout: blog
title: 'Kyma - extend and build on Kubernetes with ease'
date: 2019-05-08
---

**Authors:** Lukasz Gornicki (SAP)

[CNCF Survey](https://www.cncf.io/blog/2018/08/29/cncf-survey-use-of-cloud-native-technologies-in-production-has-grown-over-200-percent/) clearly shows that usage of Clound Native technologies in production grows rapidly. Kubernetes plays a very important role in this trend, and this is the fact. The thing is that like with any other technology, as it evolves, and the ecosystem grows, the complexity increases as well. Try to google `kubernetes is hard` and you get a list of different articles that address this problem. This is normal, and best thing about CNCF community is that these problems are addressed with projects like Knative and for example its [Build resource](https://github.com/knative/build). Remember though, this is not the only challenge you face when transitioning into Cloud Native.

## Problems to solve

### Picking the right technology is hard 

Now, once you understand Kubernetes, your teams are trained, start building apps on top. You face another difficulty. Cloud Native is not just PaaS solution. Writing an application is the easiest part really, but what about logging? monitoring? tracing? alerting? service mesh? storage?. These are all the questions you need to answer, and you need to perform a proper investigation that takes time. CNCFs helps here a lot by providing a [landscape](https://landscape.cncf.io/) of all the cloud native technologies, but the list is huge and overwhelming. 

[Kyma](http://kyma-project.io) simplifies your life here. It's mission statement is to enable flexible and easy way of extending applications. 

<img src="/images/blog/2019-05-08-Kyma-extend-and-build-on-kubernetes-with-ease/kyma-center.png" width="70%" alt="Kyma in center" />

It may sound pretty generic, but we know what hides behind such a statement, we know what you need, to be able to write a production ready solution from end to end. [Kyma](https://github.com/kyma-project/kyma/) is donated to open source community by [SAP](https://www.sap.com), by people with experience in writing production grade clound native applications. And guess what, we just reached our first major release, [Kyma 1.0 release](https://github.com/kyma-project/kyma/releases/tag/1.0.0) is already out there https://twitter.com/kymaproject/status/1121426458243678209.

### Deciding on the path from Monolith to Cloud Native is hard

Try to google `monolith to cloud native` or `monolith to microsevices` and you get a list of different articles and talks recordings that tackle this challenge. There are different paths and our experience thought us to be quite opinionated in this area. First let's answer a question why would you event consideer moving from Monolith to Cloud Native? Reasoning is almost always:
- Increase scalability
- Increase the speed of providing new features
- Enable more flexible extensibility
You do not have to rewrite your monolith to achieve above. Why spending all the costs related to rewriting the functionality that you already sell. Just focus on enablign your monolith to follow [event-driven architecture](https://en.wikipedia.org/wiki/Event-driven_architecture).

## How Kyma solves your challenges?

### What is Kyma?

You first need to understand what [Kyma](https://kyma-project.io/docs/root/kyma/#overview-overview) is. Kyma runs on top of Kubernetes and consists of a number of different component where the 3 key components are:
* [Application connector](https://kyma-project.io/docs/components/application-connector/) that you can use to connect any application with a Kubernetes cluster and expose its APIs and Events through the [Kubernetes Service Catalog](https://github.com/kubernetes-incubator/service-catalog).
* [Serverless](https://kyma-project.io/docs/components/serverless/) that enables you to easily write extensions for your application. You function code can be triggered by API calls and also by event comming from external system. You can also securely call back the integrated system from your function.
* [Service Catalog](https://kyma-project.io/docs/components/service-catalog/) is here not only to expose integrated systems. This integration also enables you to use services from hyperscalers like Azure or Google Cloud. [Kyma](https://kyma-project.io/docs/components/service-catalog/#service-brokers-service-brokers) contains easy integration of official service brokers maintained by Microsoft and Google.

![core components](/images/blog/2019-05-08-Kyma-extend-and-build-on-kubernetes-with-ease/ac-s-sc.svg)

You can watch [this video](https://www.youtube.com/watch?v=wJzVWFGkiKk) for short overview of Kyma key features that is based on real demo scenario.

### We picked right technologies for you

You can provide reliable extensibility in project like Kyma only if it is properly monitored and configured. We decided to follow here a rule to not reinvent the wheel. There are so many great projects in the CNCF landscape with huge communities behind them, we decided to pick the best ones and glue them all together in Kyma. You can see the same architecture diagram that is above but with clear visibility of what projects we glued inside Kyma:

<img src="/images/blog/2019-05-08-Kyma-extend-and-build-on-kubernetes-with-ease/arch.png" width="70%" alt="Kyma architecture" />

* Monitoring and alerting is based on [Prometheus](https://prometheus.io/) and [Grafana](https://grafana.com/)
* Logging is based on [Loki](https://grafana.com/loki)
* Eventing uses [Knative](https://github.com/knative/eventing/) and [NATS](https://nats.io/)
* Assets management uses [Minio](https://min.io/) as a storage
* Service mesh is based on [Istio](https://istio.io/)
* Tracing is done with [Jaeger](https://www.jaegertracing.io/)
* Authentication is supported by [dex](https://github.com/dexidp/dex)

You do not have to worry about integration of all those tools. We made sure they all play together well and are always up to date (for example we are already integrated with Istio 1.1). With our custom [Installer](https://github.com/kyma-project/kyma/tree/master/components/installer) the [Helm](https://helm.sh/) charts we enabled easy installation and upgrading between Kyma versions.

### Do not rewrite your Monoliths

Rewriting is hard, costs a fortune and in majority of cases is not needed. At the end what you need is to be able to write new features quicker. You can do it by connecting your monolith into Kyma using the [Application connector](https://kyma-project.io/docs/components/application-connector). The whole integration is based on [Custom resources](https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources/) so just with **kubectl** you can create a new application:
```
cat <<EOF | kubectl apply -f -
apiVersion: applicationconnector.kyma-project.io/v1alpha1
kind: Application
metadata:
  name: {APP_NAME}
spec:
  description: {APP_DESCRIPTION}
  labels:
    region: us
    kind: production
EOF
```
Then you just request a token needed for initial pairing of your application with the Kyma cluster:
```
cat <<EOF | kubectl apply -f -
apiVersion: applicationconnector.kyma-project.io/v1alpha1
kind: TokenRequest
metadata:
  name: {APP_NAME}
EOF
```

Your monolith can at the moment register three different type of services: REST (with [OpenAPI](https://www.openapis.org/) specification) and OData (with Entity Data Model specification) for synchronous communication, and for asynchronous communication you can register a catalog of events based on [AsyncAPI](https://www.asyncapi.com/) specification. Then just make sure those events are delivered into Kyma cluster through it's event service. Your events are later delivered internally using [NATS Streaming](https://nats.io/) channel with [Knative eventing](https://github.com/knative/eventing/).

Such approach gives you a lot of flexibility in adding new functionalities. It also gives you time to rethink a need for rewriting old functionalities and their step by step replacement. 

## Contribute and feedback

Kyma is an open source project that we would love to drive forward with you. After reading this post you already know we do not like to reinvent the wheel. We took the same approach when we were thinking about working model to enable community contributions. We work in [Special Interest Groups](
https://github.com/kyma-project/community/tree/master/sig-and-wg) and have public recording meeting that you can join any time, so we have a setup similar to what you know from Kubernetes itself.

Feel free to share also your feedback with us, through [Twitter](https://twitter.com/kymaproject) or [Slack](http://slack.kyma-project.io).
