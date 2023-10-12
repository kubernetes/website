---
title: "Externalizing config using MicroProfile, ConfigMaps and Secrets"
content_type: tutorial
weight: 10
---

<!-- overview -->

In this tutorial, you will learn how and why to externalize your microservice’s 
configuration. Specifically, you will learn how to use Kubernetes ConfigMaps and 
Secrets to set environment variables and then consume them using MicroProfile Config.

## {{% heading "prerequisites" %}}

Before starting, make sure you have the following prerequisites:

1. **Basic understanding of Kubernetes concepts**

   If you're new to Kubernetes, it's essential to familiarize yourself with its core 
   concepts. You can get started by exploring the [Kubernetes Basics](/docs/tutorials/kubernetes-basics/) 
   tutorial.

2. **A running Kubernetes cluster**

   Set up a Kubernetes cluster, you can use [Minikube documentation](https://minikube.sigs.k8s.io/docs/start/) 
   to learn more about running a Kubernetes cluster.

3. **Java development environment set up on your local machine**

   Ensure you have Java installed. You can check by running `java -version` in your 
   terminal. If not installed, you can refer to the official website of the 
   [OpenJDK](https://openjdk.java.net/).

Now that you have the prerequisites in place, let's proceed with the tutorial.


## Creating Kubernetes ConfigMaps & Secrets

There are several ways to set environment variables for a container in Kubernetes. 
In this tutorial section, you'll explore how to use ConfigMaps and Secrets to manage
your microservice's environment variables.

### ConfigMaps: Storing Non-Sensitive Data

ConfigMaps are perfect for storing non-sensitive configuration data that can be 
shared across multiple containers. They are Kubernetes API Objects that store 
non-confidential key-value pairs.

#### Step 1: Create a ConfigMap

To get started, let's create a ConfigMap to store your microservice's application name. 
Follow these steps:

1. Open a text editor of your choice.

2. Create a new file with a `.yaml` extension, for example, `myapp-configmap.yaml`.

3. Write the following content into the `myapp-configmap.yaml` file:

    ```yaml
        apiVersion: v1
        kind: ConfigMap
        metadata:
          name: myapp-config
          annotations:
            kubernetes.io/description: "ConfigMap to store application name and API endpoint"
          labels:
            app: myapp
            environment: production
          namespace: my-namespace
        data:
          app.name: MyApp
          api.endpoint: https://api.example.com   
    ```

**Note:**  The `https://api.example.com` in `api.endpoint` is just a placeholder for the 
example. Replace it with the actual endpoint URL for your application.

  In this manifest:
   - `apiVersion` specifies the Kubernetes API version.
   - `kind` indicates the type of resource.
   - `metadata` contains metadata about the ConfigMap, including its name, annotations,
      labels, and namespace.
   - `data` contains key-value pairs for the ConfigMap's content.

   The `annotations` section adds non-identifying metadata, and labels help identify 
   and group resources. 
   **Note:** The line `namespace: my-namespace` specifies the Kubernetes 
   namespace where the ConfigMap will be created. Ensure it matches your intended 
   namespace or replace it with your desired namespace name.

Here, you're creating a ConfigMap named `myapp-config` with a key-value pair: 
`app.name: MyApp`. This centralizes your microservice's configuration for easy access. 
For more information, read [ConfigMaps](/docs/concepts/configuration/configmap/).

### Secrets: Safeguarding Sensitive Information

Secrets are designed to securely manage confidential data like passwords and API keys.

#### Step 2: Create a Secret

In this step, you'll create a Kubernetes Secret to securely store sensitive data, such 
as passwords and API keys. You'll define the Secret using a manifest in YAML format.

Here's how you can proceed:

1. Open a text editor of your choice.

2. Create a new file with a `.yaml` extension, for example, `myapp-secret.yaml`.

3. Write the following content into the `myapp-secret.yaml` file:

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
**Note:** Base64 encoding is not a secure way to store secrets, as it provides minimal 
security. In production environments, consider more secure methods such as using 
Kubernetes Secrets with encryption or a secret management system.

Replace `<base64-encoded-password>` and `<base64-encoded-api-key>` with the actual 
base64-encoded values of your sensitive information. Please note that base64 encoding 
is used as an added security measure to protect the data.

Kubernetes allows you to use Secrets to store sensitive information in a secure and 
reusable manner. The `type` field specifies the type of the Secret, while the `data` 
field is where you define key-value pairs of your sensitive information. By creating 
Secrets, you ensure that sensitive data remains safe and accessible only to authorized 
users and services.

### Externalizing Config from Code

Externalized configuration is essential as settings often vary with different environments. 
To achieve this, you make use of Java's CDI and MicroProfile Config mechanisms. The latter
is a MicroProfile feature, offering open Java tools for building cloud-native microservices.

#### Step 3: Add MicroProfile Config Dependency

To integrate MicroProfile Config into your microservice project, you'll need to include the
necessary dependency in your Maven `pom.xml` file. This dependency empowers your code to 
seamlessly utilize the capabilities of MicroProfile Config.

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

With the MicroProfile Config dependency in place, your microservice is now equipped to 
dynamically access its configuration data based on the property names defined in your 
ConfigMaps and Secrets.

#### Step 4: Inject Configuration Properties

Now, it's time to inject configuration properties into your microservice's Java code. 
This process involves utilizing MicroProfile's `@ConfigProperty` annotation to 
seamlessly access the configuration data you've defined.

Here's how to proceed:

1. Open the Java file associated with your microservice (for example, `MyService.java`) 
   using your preferred Java development environment.

2. In the beginning section of your Java file, make sure to import the necessary classes:

    ```java
    import org.eclipse.microprofile.config.inject.ConfigProperty;
    import javax.inject.Inject;
    ```

3. Inside the Java class, create fields and annotate them with `@ConfigProperty` to 
   represent the configuration properties you intend to inject. For instance:

    ```java
    import org.eclipse.microprofile.config.inject.ConfigProperty;
    import javax.enterprise.context.ApplicationScoped;
    import javax.inject.Inject;

    @ApplicationScoped
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

   By using the `@ConfigProperty` annotation, you're signaling to MicroProfile Config to 
   inject the corresponding configuration values into these fields. This enables your 
   microservice to dynamically access its configuration data based on the specified property 
   names, eliminating the necessity of hardcoding configuration values. 

CDI enables dependency injection for modular, flexible applications. MicroProfile Config offers 
a standardized way for applications and microservices to access configuration properties from 
various sources, including the application itself, the runtime environment, and external 
configurations like Kubernetes ConfigMaps and Secrets.

The integration of CDI and MicroProfile Config empowers your microservice to seamlessly access its
configuration data, enabling dynamic adaptation to diverse environments.

### **Conclusion**

Congratulations! By following the steps in this tutorial, you've externalized your microservice's 
configuration with MicroProfile Config, Kubernetes ConfigMaps, and Secrets, enhancing its 
adaptability across environments.


<!--  -->

