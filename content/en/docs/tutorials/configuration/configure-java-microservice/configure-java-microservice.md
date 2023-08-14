---
title: "Externalizing config using MicroProfile, ConfigMaps and Secrets"
content_type: tutorial
weight: 10
---

<!-- overview -->

In this tutorial you will learn how and why to externalize your microservice’s configuration.
Specifically, you will learn how to use Kubernetes ConfigMaps and Secrets to set environment variables and then consume them using MicroProfile Config.


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

There are several ways to set environment variables for a Docker container in Kubernetes, including Dockerfile, kubernetes.yml, Kubernetes ConfigMaps, and Kubernetes Secrets. In this section, we'll explore how to use ConfigMaps and Secrets to manage your microservice's environment variables.

### ConfigMaps: Storing Non-Sensitive Data

ConfigMaps are perfect for storing non-sensitive configuration data that can be shared across multiple containers. They are Kubernetes API Objects that store non-confidential key-value pairs.

**Step 1: Create a ConfigMap**

To get started, let's create a ConfigMap to store your microservice's application name. Follow these steps:

1. Open a text editor of your choice.

2. Create a new file with a `.yaml` extension, for example, `myapp-configmap.yaml`.

3. Copy and paste the following content into the `myapp-configmap.yaml` file:

    ```yaml
    apiVersion: v1
    kind: ConfigMap
    metadata:
      name: myapp-config
      annotations:
        description: "ConfigMap to store application name and API endpoint"
      labels:
        app: myapp
        environment: production
      namespace: my-namespace
    data:
      app.name: MyApp
      api.endpoint: https://api.example.com
    ```  

  In this YAML definition:
   - `apiVersion` specifies the Kubernetes API version to use for the resource.
   - `kind` indicates the type of resource, which in this case is a ConfigMap.
   - `metadata` contains metadata about the ConfigMap, including its name, annotations, labels, and namespace.
   - `data` is where you define the key-value pairs that make up the content of the ConfigMap.

   The `annotations` section is used to attach non-identifying metadata to the resource. Labels are key-value pairs used for identifying and grouping resources, and the `namespace` field specifies the Kubernetes namespace where the ConfigMap will be created.

Here, we're creating a ConfigMap named `myapp-config` with a key-value pair: `app.name: MyApp`. This ConfigMap will serve as a centralized storage for your microservice's configuration data, making it easily accessible to your application. For more information regarding ConfigMaps, you can refer to official documentation [here](/docs/tasks/configure-pod-container/configure-pod-configmap/).

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

Kubernetes allows you to use Secrets to store sensitive information in a secure and reusable manner. The `type` field specifies the type of the Secret, while the `data` field is where you define key-value pairs of your sensitive information. By creating Secrets, you ensure that sensitive data remains safe and accessible only to authorized users and services.



### ConfigMaps and Secrets: Comparison

In Kubernetes, both ConfigMaps and Secrets are used to manage configuration data and sensitive information, respectively. While they share some similarities, they serve different purposes and have distinct characteristics.

#### Similarities:

- **Reusability:** Both ConfigMaps and Secrets are designed to promote reusability across multiple containers within a Kubernetes environment. This allows you to centralize configuration and sensitive data management.

- **Key-Value Storage:** Both ConfigMaps and Secrets store data as key-value pairs. This structure simplifies data retrieval and usage within application code.

#### Differences

Here are the main differences between ConfigMaps and Secrets:

#### Purpose

- **ConfigMaps:** ConfigMaps are used to store non-sensitive configuration data that can be shared among containers. They are suitable for data like environment variables, application settings, and configuration files.

- **Secrets:** Secrets are specifically designed to store sensitive information, such as passwords, API keys, and authentication tokens. They focus on ensuring data security and protection.

#### Use Cases

- **ConfigMaps:** Ideal for storing data that is non-confidential and can be safely exposed to containers. Examples include application configuration settings and URLs.

- **Secrets:** Suited for storing confidential data that should not be exposed in plaintext. Examples include database passwords, API keys, and SSL certificates.

#### Access Control

- **ConfigMaps:** ConfigMaps are less secure compared to Secrets and may not be suitable for highly sensitive information.

- **Secrets:** Secrets provide a higher level of security through encryption and base64 encoding. They are recommended for sensitive data storage.

For more detailed information on working with Secrets in Kubernetes, you can refer to the official Kubernetes documentation [here](/docs/concepts/configuration/secret/).


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
    This addition includes the MicroProfile Config API library into your project. The MicroProfile Config API provides the necessary tools and annotations to access and manage configuration properties seamlessly.

With the MicroProfile Config dependency in place, your microservice is now equipped to dynamically access its configuration data based on the property names defined in your ConfigMaps and Secrets. The integration of Contexts and Dependency Injection (CDI) and MicroProfile Config enables your microservice to adapt to different environments effortlessly.


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

   By using the `@ConfigProperty` annotation, you're signaling to MicroProfile Config to inject the corresponding configuration values into these fields. This enables your microservice to dynamically access its configuration data based on the specified property names, eliminating the necessity of hardcoding configuration values directly into your code. 

CDI provides a standard dependency injection capability enabling an application to be assembled from collaborating, loosely-coupled beans. This promotes modularity and flexibility in your application's architecture.

MicroProfile Config offers a standardized way for applications and microservices to access configuration properties from various sources, including the application itself, the runtime environment, and external configurations like Kubernetes ConfigMaps and Secrets.Based on the source's defined priority, the properties are automatically combined into a single set of properties that the application can access via an API. 

The integration of CDI and MicroProfile Config empowers your microservice to seamlessly access its configuration data, enabling dynamic adaptation to diverse environments.

### **Conclusion**

Congratulations! By following the steps in this tutorial, you've successfully externalized your microservice's configuration using MicroProfile Config, Kubernetes ConfigMaps, and Secrets. Your microservice is now capable of accessing its configuration data seamlessly, enhancing its adaptability across different environments.




<!--  -->

