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
* [Service Catalog](https://kyma-project.io/docs/components/service-catalog/) is here not only to expose integrated systems. This integration also enables you to use services from hyperscalers like Azure, AWS or Google Cloud. [Kyma](https://kyma-project.io/docs/components/service-catalog/#service-brokers-service-brokers) contains easy integration of official service brokers maintained by Microsoft and Google.

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

Rewriting is hard, costs a fortune and in majority of cases is not needed. At the end what you need is to be able to write and put on production new features quicker. You can do it by connecting your monolith into Kyma using the [Application Connector](https://kyma-project.io/docs/components/application-connector). In short, this component makes sure that securely:
- You can call back registered monolith without a need of taking care of authorization, as Application Connector handles that
- Events sent from your monolith get into Kyma's event bus

Your monolith can at the moment register three different type of services: REST (with [OpenAPI](https://www.openapis.org/) specification) and OData (with Entity Data Model specification) for synchronous communication, and for asynchronous communication you can register a catalog of events based on [AsyncAPI](https://www.asyncapi.com/) specification. Your events are later delivered internally using [NATS Streaming](https://nats.io/) channel with [Knative eventing](https://github.com/knative/eventing/).

Once your monolith's services are connected you can provision them in selected namespace thanks to the, previously mentioned, [Service Catalog](https://kyma-project.io/docs/components/service-catalog/) integration. So you can imagine, you as a developer go to the catalog and see a list of all the services you can consume. There are services from your monolith, and services from other 3rd party providers thanks to registered Service Brokers, like [Azure's OSBA](https://github.com/Azure/open-service-broker-azure). It is like entering a shop, a home improvement retailer, just one. You do not go for a hammer to Azure, and to GCP for screwdriver, and for wooden board to your Monolith. It is one single place with all of it. You want to build veranda in your home. You just pick up the tools from the shelves and take them. You do not write them from scrach, you have them all in one place, in one single tool belt and you focus just one one thing only, business logic, that is it.

### Finally some code

Below you have a sample code I had to write to integrate one Monolith with Azure services. I wanted to understand sentiments shared by customers under products review section. On every event with a review comment I wanted to use some machine learning to call some sentiments analysis service and then in case of negative comment, I wanted to persist it in some database for later review. This is a code of a function created thanks to our [Serverless](https://kyma-project.io/docs/components/serverless) component. Pay attention to my code comments: 

> You can watch [this](https://www.youtube.com/watch?v=wJzVWFGkiKk) short video for full demo of sentiment analysis function.
```js
/* It is a function powered by NodeJS runtime so I have to import some necessary dependencies. I choosed Azure's CosmoDB that is a Mongo-like database, so I could use a MongoClient */
const axios = require("axios");
const MongoClient = require('mongodb').MongoClient;

module.exports = { main: async function (event, context) {
    /* My function was triggered because it was subscribed to customer review event. I have access to the payload of the event. */
    let negative = await isNegative(event.data.comment)
    
    if (negative) {
      console.log("Customer sentiment is negative:", event.data)
      await mongoInsert(event.data)
    } else {
      console.log("This positive comment was not saved:", event.data) 
    }
}}

/* Like in case of isNegative function, I focuse of usage of the MongoClient API. The necessary information about the database location and an authorization needed to call it is injected into my function and I just need to pick a proper environment variable. */
async function mongoInsert(data) {

    try {
          client = await MongoClient.connect(process.env.connectionString, { useNewUrlParser: true });
          db = client.db('mycommerce');
          const collection = db.collection('comments');
          return await collection.insertOne(data);
    } finally {
      client.close();
    }
}
/* This function calls Azure's Text Analytics service to get information about the sentiment. Notice process.env.textAnalyticsEndpoint and process.env.textAnalyticsKey part. When I wrote this function I didn't have to go to Azure's console to get these details. I had these variables automatically injected into my function thanks to our integration with Service Catalog and our Service Binding Usage controller that pairs the binding with a function. */
async function isNegative(comment) {
    let response = await axios.post(`${process.env.textAnalyticsEndpoint}/sentiment`,
      { documents: [{ id: '1', text: comment }] }, {headers:{...{ 'Ocp-Apim-Subscription-Key': process.env.textAnalyticsKey }}})
    return response.data.documents[0].score < 0.5
}
```
And this is not all. Thanks to Kyma I don't have to worry about my whole infrastructure around my function. As I mentioned I have all the tools needed in Kyma, and they are integrated together. I can quickly get access to my logs with support of [Loki](https://grafana.com/loki), and I can quickly get access to a preconfigured Grafana dashboard to see metrics of my Lambda delivered thanks to [Prometheus](https://prometheus.io/) and [Istio](https://istio.io/).

<img src="/images/blog/2019-05-08-Kyma-extend-and-build-on-kubernetes-with-ease/grafana-lambda.png" width="70%" alt="Grafana with preconfigured lambda dashboard" />

Such approach gives you a lot of flexibility in adding new functionalities. It also gives you time to rethink a need for rewriting old functionalities and their step by step replacement. 

## Contribute and give feedback

Kyma is an open source project that we would love to drive forward with you. After reading this post you already know we do not like to reinvent the wheel. We took the same approach when we were thinking about working model to enable community contributions. We work in [Special Interest Groups](
https://github.com/kyma-project/community/tree/master/sig-and-wg) and have public recording meeting that you can join any time, so we have a setup similar to what you know from Kubernetes itself.

Feel free to share also your feedback with us, through [Twitter](https://twitter.com/kymaproject) or [Slack](http://slack.kyma-project.io).
