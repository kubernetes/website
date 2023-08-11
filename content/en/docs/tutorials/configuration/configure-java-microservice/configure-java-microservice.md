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

Before starting, make sure you have the following prerequisites:

1. **Basic understanding of Kubernetes concepts**

   If you're new to Kubernetes, it's essential to familiarize yourself with its core concepts. You can get started by exploring the [Kubernetes Basics](/docs/tutorials/kubernetes-basics/) tutorial.

2. **A running Kubernetes cluster**

   Set up a Kubernetes cluster according to your platform:

   - For **Mac** users, you can use [Docker Desktop](https://www.docker.com/products/docker-desktop) to run a Kubernetes cluster locally.

   - For **Windows** users, Docker Desktop also supports Kubernetes on Windows.

   - For **Linux** users, you can use [Minikube](https://minikube.sigs.k8s.io/docs/start/) or set up a Kubernetes cluster on a cloud provider like [Google Kubernetes Engine (GKE)](https://cloud.google.com/kubernetes-engine) or [Amazon Elastic Kubernetes Service (EKS)](https://aws.amazon.com/eks/).

3. **Java development environment set up on your local machine**

   Ensure you have Java installed. You can check by running `java -version` in your terminal. If not installed, follow these steps:

   - **Mac**:


     ```bash
     brew install openjdk@11
     ```

   - **Windows**:
     Download and install [AdoptOpenJDK](https://adoptopenjdk.net/) for Java 11.

   - **Linux**:
     Use your package manager to install OpenJDK 11. For example, on Ubuntu:


     ```bash
     sudo apt-get update
     sudo apt-get install openjdk-11-jdk
     ```

Now that you have the prerequisites in place, let's proceed with the tutorial.

## Creating Kubernetes ConfigMaps & Secrets

There are several ways to set environment variables for a Docker container in Kubernetes,
including: Dockerfile, kubernetes.yml, Kubernetes ConfigMaps, and Kubernetes Secrets.  In this section, we'll explore how to use ConfigMaps and Secrets to manage your microservice's environment variables.

### ConfigMaps: Storing Non-Sensitive Data

ConfigMaps are perfect for storing non-sensitive configuration data that can be shared across multiple containers.

**Step 1: Create a ConfigMap**

To get started, follow these steps:

1. Open a text editor of your choice.

2. Create a new file with a `.yaml` extension, for example, `myapp-configmap.yaml`.

3. Copy and paste the following content into the `myapp-configmap.yaml` file:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: myapp-config
data:
  app.name: MyApp
  api.endpoint: https://api.example.com
```    
ConfigMaps are API Objects that store non-confidential key-value pairs.  For more
information regarding ConfigMaps, you can find the documentation
[here](/docs/tasks/configure-pod-container/configure-pod-configmap/).

### Secrets: Safeguarding Sensitive Information

Secrets are designed to securely manage confidential data like passwords and API keys.

**Step 2: Create a Secret**

In this step, you'll create a Kubernetes Secret to securely store sensitive data, such as passwords and API keys. You'll define the Secret using YAML format and ensure that sensitive information is base64-encoded for added security.

Here's how you can proceed:

1. Open a text editor of your choice.

2. Create a new file with a `.yaml` extension, for example, `myapp-secret.yaml`.

3. Copy and paste the following content into the `myapp-secret.yaml` file:

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: myapp-secret
type: Opaque
data:
  db.password: <base64-encoded-password>
  api.key: <base64-encoded-api-key>
```
Replace `<base64-encoded-password>` and `<base64-encoded-api-key>` with the actual base64-encoded values of your sensitive information. Please note that base64 encoding is used as an added security measure to protect the data.


ConfigMaps and Secrets offer the advantage of reusability across multiple containers, allowing them to be shared among various parts of your application.

However, it's important to note the distinction: while both store key-value pairs, Secrets focus on safeguarding sensitive data and use Base64 encoding for added security. For more information on
Secrets, you can find the documentation [here](/docs/concepts/configuration/secret/).


### Externalizing Config from Code

Externalized configuration is essential as settings often vary with different environments. To achieve this, we leverage Java's CDI and MicroProfile Config. The latter is a MicroProfile feature, offering open Java tools for building cloud-native microservices.
**Step 3: Add MicroProfile Config Dependency**

To integrate MicroProfile Config into your microservice project, you'll need to include the necessary dependency in your Maven `pom.xml` file. This dependency empowers your code to seamlessly utilize the capabilities of MicroProfile Config.

Here's how you can achieve this:

1. Open your project's `pom.xml` file.

2. Locate the `<dependencies>` section.

3. Add the following lines within the `<dependencies>` section:

```xml
<dependency>
    <groupId>org.eclipse.microprofile.config</groupId>
    <artifactId>microprofile-config-api</artifactId>
    <version>3.1</version>
</dependency>
```

**Step 4: Inject Configuration Properties**

Having set up the MicroProfile Config dependency, it's time to inject configuration properties into your microservice's Java code. This process involves utilizing MicroProfile's `@ConfigProperty` annotation to seamlessly access the configuration data you've defined.

Here's how to proceed:

1. Open the Java file associated with your microservice (for example, `MyService.java`) using your preferred Java development environment.

2. In the beginning section of your Java file, make sure to import the necessary classes:

    ```java
    import org.eclipse.microprofile.config.inject.ConfigProperty;
    import javax.inject.Inject;
    ```

3. Inside the Java class, create fields and annotate them with `@ConfigProperty` to represent the configuration properties you intend to inject. For instance:

    ```java
    public class MyService {
        @Inject
        @ConfigProperty(name = "app.name")
        String appName;

        @Inject
        @ConfigProperty(name = "api.endpoint")
        String apiEndpoint;

        // ... your code ...
    }
    ```

   By using the `@ConfigProperty` annotation, you're signaling to MicroProfile Config to inject the corresponding configuration values into these fields. This enables your microservice to dynamically access its configuration data based on the specified property names.

CDI provides a standard dependency injection capability enabling an application to be assembled
from collaborating, loosely-coupled beans. This promotes modularity and flexibility in your application's architecture.

MicroProfile Config offers a standardized way for applications and microservices to access configuration properties from various sources, including the application itself, the runtime environment, and external configurations like Kubernetes ConfigMaps and Secrets.
Based on the source's defined priority, the properties are automatically
combined into a single set of properties that the application can access via an API. 

The integration of CDI and MicroProfile Config empowers your microservice to seamlessly access its configuration data, enabling dynamic adaptation to diverse environments.

## {{% heading "Putting It All Together" %}}

Congratulations! By following the steps in this tutorial, you've successfully externalized your microservice's configuration using MicroProfile Config, Kubernetes ConfigMaps, and Secrets. Your microservice is now capable of accessing its configuration data seamlessly, enhancing its adaptability across different environments.




<!--  -->

