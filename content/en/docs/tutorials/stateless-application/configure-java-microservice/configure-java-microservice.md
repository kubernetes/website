---
title: Externalizing config using MicroProfile, ConfigMaps and Secrets
content_template: templates/tutorial
weight: 10
---

{{% capture overview %}}

In this tutorial you will learn how and why to externalize your microservice’s configuration.  Specifically, you will learn how to use Kubernetes ConfigMaps and Secrets to set environment variables and then consume them using MicroProfile Config.

{{% /capture %}}


{{% capture prerequisites %}}

### Externalizing Config from Code
Externalized application configuration is useful because configuration usually changes depending on your environment.  In order to accomplish this, we'll use Java's Contexts and Dependency Injection (CDI) and [MicroProfile Config](https://github.com/eclipse/microprofile-config). MicroProfile Config is a feature of [MicroProfile](http://microprofile.io/), a set of open Java technologies for developing and deploying cloud-native microservices.

CDI defines a rich set of complementary services that improve the application structure. This provides a standard dependency injection capability enabling an application to be assembled from collaborating, loosely-coupled beans.  During the interactive tutorial, you'll use the @Inject annotation to inject the value from an external configuration into your code.

MicroProfile Config provides apps and microservices a standard way to obtain config properties from various sources, including the application, runtime, and environment.  Based on the source's defined priority, the properties are automatically combined into a single set of properties that the application can access via an API.  During the interactive tutorial you'll use the @ConfigProperty annotation to inject various externally provided property values into your code.

Many open source frameworks and runtimes implement and support MicroProfile Config.  Throughout the interactive tutorial, you'll be using [Open Liberty](https://openliberty.io), a flexible open-source Java runtime for building and running cloud-native apps and microservices.  You can find more information on how to use MicroProfile Config in this [Open Liberty guide](https://www.openliberty.io/guides/microprofile-config-intro.html).

### Creating Kubernetes ConfigMaps & Secrets
There are several ways to set environment variables for a Docker container in Kubernetes, including: Dockerfile, kubernetes.yml, Kubernetes ConfigMaps, and Kubernetes Secrets.  In the tutorial, you will use the latter two for setting your environment variables whose values will be injected into your microservices.  One of the benefits for using ConfigMaps and Secrets is that they can be re-used across multiple containers, including being assigned to different environment variables for the different containers.  ConfigMaps and Secrets are stores of key-value pairs, however, Secrets are intended for storing Base64 encoded sensitive information.  For more information, see the following: [ConfigMaps](https://kubernetes.io/docs/tasks/configure-pod-container/configure-pod-configmap/) & [Secrets](https://kubernetes.io/docs/concepts/configuration/secret/).

{{% /capture %}}


{{% capture objectives %}}

* Inject microservice configuration using MicroProfile Config
* Create a Kubernetes ConfigMap and Secret
  
{{% /capture %}}
  
{{% capture lessoncontent %}}
  
## [Start Interactive Tutorial](/docs/tutorials/configuration/configure-java-microservice/configure-java-microservice-interactive/)  
  
{{% /capture %}}