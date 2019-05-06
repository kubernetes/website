---
layout: blog
title: 'Kyma - extend and build on Kubernetes with ease'
date: 2019-05-08
---

**Authors:** Lukasz Gornicki (SAP)

[CNCF Survey](https://www.cncf.io/blog/2018/08/29/cncf-survey-use-of-cloud-native-technologies-in-production-has-grown-over-200-percent/) clearly shows that usage of Clound Native technologies in production grows rapidly. Kubernetes plays a very important role in this trend, and this is the fact. The thing is that like with any other technology, as it evolves, and the ecosystem grows, the complexity increases as well. Try to google `kubernetes is hard` and you get a list of different articles that address this problem. This is normal, and best thing about CNCF community is that these problems are addressed with projects like Knative and for example its [Build resource](https://github.com/knative/build).

## Picking the right technology is hard 

Now, once you understand Kubernetes, your teams are trained, start building apps on top. You face another difficulty. Cloud Native is not just PaaS solution. Writing an application is the easiest part really, but what about logging? monitoring? tracing? alerting? service mesh? storage?. These are all the questions you need to answer, and you need to perform a proper investigation that takes time. CNCFs helps here a lot by providing a [landscape](https://landscape.cncf.io/) of all the cloud native technologies, but the list is huge and overwhelming. 

Kyma simplifies you life here. It's mission statement is to enable flexible and easy way of extending applications. 

<img src="/images/blog/2019-05-08-Kyma-extend-and-build-on-kubernetes-with-ease/kyma-center.png" width="70%" alt="Kyma in center" />

It may sound pretty generic, but we know what hides behind such a statement, we know what you need, to be able to write a production ready solution from end to end. Kyma is donated to open source community by [SAP](https://www.sap.com), by people with experience in writing production grade clound native applications. And guess what, we just reached our first major release, Kyma 1.0 release is already out there https://twitter.com/kymaproject/status/1121426458243678209.

## How Kyma helps 

You first need to understand what Kyma is. Kyma runs on top of Kubernetes and consists of a number of different component where the 3 key components are:
* Application connector that you can use to connect any application with a Kubernetes cluster and expose its APIs and Events through the Kubernetes Service Catalog.
* Serverless that enables you to easily write extensions for your application. You function code can be triggered by API calls and also by event comming from external system. You can also securely call back the integrated system from your function.
* Service Catalog is here not only to expose integrated systems. This integration also enables you to use services from hyperscalers like Azure or Google Cloud. Kyma contains easy integration of official service brokers maintained by Microsoft and Google.

![core components](/images/blog/2019-05-08-Kyma-extend-and-build-on-kubernetes-with-ease/ac-s-sc.svg)

You can provide such extensibility only if it is properly monitored and configured. We decided to follow here a rule to not reinvent the wheel. There are so many great project in the CNCF landscape with huge communities behind them, we decided to pick them and glue them all together in Kyma. You can see the same architecture diagram that is above but with clear visibility of what projects we glued inside Kyma:

<img src="/images/blog/2019-05-08-Kyma-extend-and-build-on-kubernetes-with-ease/arch.png" width="70%" alt="Kyma architecture" />

Kyma solves that issue, provides all tools glued together with 3 core concepts

The best thing is that there is a big player behind the project and gives it to their customers. Thanks to that we made sure it is stable and available with major 1.0 release

# Details

- application connectivity
- service catalog
- serverless
- links to videos

# Contribute/feedback

- how we work
- how to contact
- how to contribute
