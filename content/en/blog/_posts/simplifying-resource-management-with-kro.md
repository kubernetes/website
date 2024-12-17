# Simplifying Kubernetes Resource Management with AWS's Kro

Custom Resouce Definitions (CRDs) are the backbone of the Kubernetes ecosystem. Many controllers, operators, and other entities provide their own CRDs to simplify or implement additional functionality and ease the complexity of deployments. Creating the required logic to handle and manage those CRDs isn’t easy, though. But that’s about to change.

AWS recently open-sourced [Kro (Kubernetes Resource Orchestrator)](https://kro.run/), a new tool that aims to revolutionize the management of complex Kubernetes resources. While still in alpha, Kro shows promising potential for simplifying resource management in Kubernetes clusters.

## The Evolution of Kubernetes Resource Management

When Kubernetes introduced [Custom Resource Definitions](https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources/), it fundamentally changed how we manage and customize our clusters. CRDs allowed us to define new, custom resources alongside native ones like Pods and Services. However, managing multiple dependent and interconnected resources became increasingly challenging as our applications grew more complex. That's where Kro steps in.

This evolution in Kubernetes extensibility brought great power but also increased complexity. Teams needed to manage multiple CRDs, handle interdependencies, and ensure proper lifecycle management. The traditional approach of using various YAML files and manual resource orchestration became increasingly cumbersome as applications scale.

## Understanding Kro: A New Abstraction Called ResourceGroup

Kro introduces a powerful concept called [ResourceGroups](https://kro.run/docs/concepts/resource-groups), which allows us to define, organize, and manage sets of related Kubernetes resources as single, reusable units. Think of ResourceGroups as blueprints that specify what users can configure, what resources to create, how resources reference each other, and when specific resources should be included.

For example, imagine deploying a web application that requires a Deployment, Service, and Ingress. Instead of managing these resources separately, Kro lets us package them into a single ResourceGroup. When we create an instance of this ResourceGroup, Kro automatically handles the creation and configuration of all underlying resources.

Kro's real power lies in its ability to create new APIs based on these ResourceGroups in your cluster. When you apply a ResourceGroup, Kro automatically generates a new Custom Resource Definition and sets up the necessary controllers to manage instances of your new API. This means teams can create standardized, reusable components that encapsulate best practices and security configurations.

## Why Kro Matters for Complex Deployments

Traditional Kubernetes deployments often involve juggling multiple YAML files and managing intricate dependencies between resources. Kro simplifies this by:

1. Thinking of resources as a Directed Acyclic Graph (DAG) to understand their dependencies
2. Automatically determining the correct deployment order and validating resource definitions
3. Creating the necessary CRD and its API in our cluster
4. Managing the lifecycle of instances of this new CRD and its dependencies

Consider a microservices application that needs multiple deployments, services, config maps, and secrets. With Kro, we can define this entire stack as a single ResourceGroup, making it easier to version, deploy, and manage our application as a cohesive unit.

While this was previously possible before by creating your own custom resource definition on top of other custom or native ones, Kro simplifies this process.

### Advanced Use Cases

One particularly powerful aspect of Kro is its support for conditional resource creation. Using the `includeWhen` field in ResourceGroups, we can specify conditions for when certain resources should be created. For example, we might want to create an Ingress resource only when external access is required:

```yaml
- id: ingress
  includeWhen:
    - ${schema.spec.ingress.enabled}
  template:
    apiVersion: networking.k8s.io/v1
    kind: Ingress
    metadata:
      name: ${schema.spec.name}-ingress
```

This conditional creation helps teams build flexible, reusable templates that can adapt to different deployment scenarios without requiring multiple versions of the same ResourceGroup.

The above example is highly simplified. We’ll be coming back to the full example in a bit.

## Getting Started with Kro

The orchestrator pod is the heart of Kro. Before we can use ResourceGroups we need to install Kro into our cluster. The easiest way to do that is by using the Kro-provided helm chart.

To start using Kro, we need:
- A Kubernetes cluster
- Helm 3.x installed
- kubectl configured to interact with our cluster

Installation is straightforward using Helm:

```bash
export KRO_VERSION=$(curl -sL \
    https://api.github.com/repos/awslabs/kro/releases/latest | \
    jq -r '.tag_name | ltrimstr("v")')

helm install kro oci://public.ecr.aws/kro/kro \
    --namespace kro \
    --create-namespace \
    --version=${KRO_VERSION}
```

After installation, it's essential to verify that Kro is running correctly:

```bash
helm -n kro list
kubectl get pods -n kro
```

You should see a deployed helm release and the Kro controller pod running in the kro namespace.

## Creating Our First ResourceGroup

Let's look at a practical example of creating a ResourceGroup for a web application:

```yaml
apiVersion: kro.run/v1alpha1
kind: ResourceGroup
metadata:
  name: my-application
spec:
  schema:
    apiVersion: v1alpha1
    kind: Application
    spec:
      name: string
      image: string | default="nginx"
      ingress:
        enabled: boolean | default=false
      replicas: integer | default=3
    status:
      deploymentConditions: ${deployment.status.conditions}
      availableReplicas: ${deployment.status.availableReplicas}
  resources:
    - id: deployment
      template:
        apiVersion: apps/v1
        kind: Deployment
        metadata:
          name: ${schema.spec.name}
        spec:
          replicas: ${schema.spec.replicas}
          selector:
            matchLabels:
              app: ${schema.spec.name}
          template:
            metadata:
              labels:
                app: ${schema.spec.name}
            spec:
              containers:
                - name: ${schema.spec.name}
                  image: ${schema.spec.image}
                  ports:
                    - containerPort: 80
    - id: service
      template:
        apiVersion: v1
        kind: Service
        metadata:
          name: ${schema.spec.name}-service
        spec:
          selector: ${deployment.spec.selector.matchLabels}
          ports:
            - protocol: TCP
              port: 80
              targetPort: 80
    - id: ingress
      includeWhen:
        - ${schema.spec.ingress.enabled} # Only include if the user wants to create an Ingress
      template:
        apiVersion: networking.k8s.io/v1
        kind: Ingress
        metadata:
          name: ${schema.spec.name}-ingress
          annotations:
            cert-manager.io/cluster-issuer: letsencrypt-prod
            kubernetes.io/ingress.class: nginx
            kubernetes.io/tls-acme: "true"
            nginx.ingress.kubernetes.io/use-regex: "true"
        spec:
          tls:
            - secretName: ${schema.spec.name}.example.com.tls
              hosts:
                - ${schema.spec.name}.example.com
          rules:
            - host: ${schema.spec.name}.example.com
              http:
                paths:
                  - path: /api/v1/example
                    pathType: ImplementationSpecific
                    backend:
                      service:
                        name: ${service.metadata.name}
                    port:
                      number: 80
```

Using this ResourceGroup we now create up to three different resources: a deployment, a service, and potentially an ingress, if enabled.

Our ResouceGroup consists of two sections. The lead-in defines its schema, meaning the choices and properties we have to provide when creating an instance of it. User input is automatically validated against the schema to prevent user mistakes at deployment time.

The second section describes the different parts of the ResourceGroup, in this case, the deployment, service, and potential ingress. All of them define their own template, which is basically the YAML that makes up the actual resource itself.

As we can see, Kro heavily uses placeholders to fill in resource names automatically. In Addition, as shown before, Kro also uses conditional includes or excludes when creating resources to adjust the group’s children according to our requests.

### Using Resource Groups

Once we've created our ResourceGroup, we can create instances using a much simpler YAML:

```yaml
apiVersion: kro.run/v1alpha1
kind: Application
metadata:
  name: my-web-app
spec:
  name: awesome-app
  image: my-app:latest
  replicas: 3
```

Kro will automatically create all the necessary resources, maintaining the proper dependencies and configurations. We can then manage our application as a single unit:

```bash
kubectl get applications
kubectl describe application my-web-app
```

## Potential Impact on Projects Like Simplyblock

Why am I excited about it? For solutions like simplyblock, which deal with storage and [CSI drivers](https://github.com/simplyblock-io/simplyblock-csi/blob/master/charts/README.md#driver-parameters), Kro could significantly simplify resource management without the complexity of building a full-blown Kubernetes operator.

Consider creating ResourceGroups for common storage patterns, combining [PersistentVolumeClaims](https://kubernetes.io/docs/concepts/storage/persistent-volumes/#persistentvolumeclaims) with the necessary storage class configurations and encrypted volumes. This would make it easier for users to deploy standardized storage solutions with proper security configurations.

Here's an example of how a simplyblock storage ResourceGroup might look:

```yaml
apiVersion: kro.run/v1alpha1
kind: ResourceGroup
metadata:
  name: encrypted-storage
spec:
  schema:
    apiVersion: v1alpha1
    kind: EncryptedVolume
    spec:
      name: string
      size: string
      encryption:
        enabled: boolean | default=true
        secretKey1: string
        secretKey2: string
  resources:
    - id: secret
      template:
        apiVersion: v1
        kind: Secret
        metadata:
          name: ${schema.spec.name}-keys
        stringData:
          crypto_key1: ${schema.spec.encryption.secretKey1}
          crypto_key2: ${schema.spec.encryption.secretKey2}
    - id: storageclass
      template:
        apiVersion: storage.k8s.io/v1
        kind: StorageClass
        metadata:
          name: ${schema.spec.name}-sc
        provisioner: csi.simplyblock.io
        parameters:
          ...
          encryption: "True"
    - id: pvc
      template:
        apiVersion: v1
        kind: PersistentVolumeClaim
        metadata:
          name: ${schema.spec.name}-pv
          annotations:
            simplybk/secret-name: ${secret.spec.name}-keys
        spec:
          storageClassName: ${schema.spec.name}-sc
          accessModes:
            - ReadWriteOnce
          resources:
            requests:
              storage: ${schema.spec.size}
```

Using the above ResourceGroup we created a deployable template that would automatically create a [StorageClass](https://kubernetes.io/docs/concepts/storage/storage-classes/) for an encrypted PersistentVolume. While this is a fairly simple use case, it’s not hard to think of harder ones in [simplyblock’s Kubernetes integration](https://www.simplyblock.io/kubernetes-storage-nvme-tcp/), as well as for many other projects.

## Current Limitations and Future Potential

It's important to note that Kro is currently in alpha stage and not recommended for production use. Some key areas still under development include:

1. Enhanced validation and error handling
2. Better support for complex dependency chains
3. Improved status reporting and lifecycle management
4. Integration with existing Kubernetes operators
5. Support for advanced update strategies
6. Better documentation and examples

Despite these limitations, Kro's approach to resource management shows excellent promise. The project's focus on using core Kubernetes primitives while providing higher-level abstractions could make it a valuable tool for DevOps teams.

Using CEL (Common Expression Language) for validation rules and conditions also opens up exciting possibilities for more sophisticated resource management patterns. As the project matures, we expect to see more advanced features built on this foundation.

## The Kubernetes Ecosystem Just Keeps Getting Better

While still in its early stages, Kro represents an exciting development in the Kubernetes ecosystem. It addresses a significant pain point in Kubernetes operations by simplifying the management of complex resource configurations. Its resource organization and management approach could significantly reduce the complexity of managing modern cloud-native applications.

The ability to define reusable templates encapsulating best practices and security configurations makes Kro particularly interesting for platform teams. As organizations continue to standardize their Kubernetes deployments, tools like Kro will become increasingly valuable for maintaining consistency and reducing operational overhead.

It has to show if AWS presents itself as a good steward for such a project. In the past, AWS has been a good and bad parent to all kinds of open-source projects and a “leecher” to the open-source community. While they never broke an open-source license, taking the source code and turning it into a private, closed-source product that takes advantage of the esteem of those projects is at least questionable to some people in the open-source community.

For those interested in exploring Kro, I’d recommend starting with simple use cases in development environments. The project welcomes community contributions, and early adopters can help shape its future direction. You can find the [Kro project on GitHub](https://github.com/awslabs/kro), where you can participate in discussions and provide feedback, too.

While Kro is promising, its alpha status means you should approach it cautiously in any environment where stability is crucial. However, now is the perfect time to get involved with the project, experiment with its capabilities, and help shape its future development.

