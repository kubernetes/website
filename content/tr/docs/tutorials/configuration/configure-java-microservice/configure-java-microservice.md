---
title: "Externalizing config using MicroProfile, ConfigMaps and Secrets"
content_type: tutorial
weight: 10
---

<!-- overview -->

In this tutorial you will learn how and why to externalize your microservice’s configuration.
Specifically, you will learn how to use Kubernetes ConfigMaps and Secrets to set environment
variables and then consume them using MicroProfile Config.


## {{% heading "prerequisites" %}}

### Creating Kubernetes ConfigMaps & Secrets

There are several ways to set environment variables for a Docker container in Kubernetes,
including: Dockerfile, kubernetes.yml, Kubernetes ConfigMaps, and Kubernetes Secrets.  In the
tutorial, you will learn how to use the latter two for setting your environment variables whose
values will be injected into your microservices.  One of the benefits for using ConfigMaps and
Secrets is that they can be re-used across multiple containers, including being assigned to
different environment variables for the different containers.

ConfigMaps are API Objects that store non-confidential key-value pairs.  In the Interactive
Tutorial you will learn how to use a ConfigMap to store the application's name.  For more
information regarding ConfigMaps, you can find the documentation
[here](/docs/tasks/configure-pod-container/configure-pod-configmap/).

Although Secrets are also used to store key-value pairs, they differ from ConfigMaps in that
they're intended for confidential/sensitive information and are stored using Base64 encoding.
This makes secrets the appropriate choice for storing such things as credentials, keys, and
tokens, the former of which you'll do in the Interactive Tutorial.  For more information on
Secrets, you can find the documentation [here](/docs/concepts/configuration/secret/).


### Externalizing Config from Code

Externalized application configuration is useful because configuration usually changes depending
on your environment.  In order to accomplish this, we'll use Java's Contexts and Dependency
Injection (CDI) and MicroProfile Config. MicroProfile Config is a feature of MicroProfile, a set
of open Java technologies for developing and deploying cloud-native microservices.

CDI provides a standard dependency injection capability enabling an application to be assembled
from collaborating, loosely-coupled beans.  MicroProfile Config provides apps and microservices a
standard way to obtain config properties from various sources, including the application, runtime,
and environment.  Based on the source's defined priority, the properties are automatically
combined into a single set of properties that the application can access via an API.  Together,
CDI & MicroProfile will be used in the Interactive Tutorial to retrieve the externally provided
properties from the Kubernetes ConfigMaps and Secrets and get injected into your application code.

Many open source frameworks and runtimes implement and support MicroProfile Config.  Throughout
the interactive tutorial, you'll be using Open Liberty, a flexible open-source Java runtime for
building and running cloud-native apps and microservices.  However, any MicroProfile compatible
runtime could be used instead. 


## {{% heading "objectives" %}}

* Create a Kubernetes ConfigMap and Secret
* Inject microservice configuration using MicroProfile Config
  
<!-- lessoncontent -->

## Example: Externalizing config using MicroProfile, ConfigMaps and Secrets

[Start Interactive Tutorial](/docs/tutorials/configuration/configure-java-microservice/configure-java-microservice-interactive/) 

