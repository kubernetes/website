---
title: Service Catalog
reviewers:
- chenopis
content_type: concept
weight: 40
---

<!-- overview -->
{{< glossary_definition term_id="service-catalog" length="all" prepend="Service Catalog is" >}}  

A service broker, as defined by the [Open service broker API spec](https://github.com/openservicebrokerapi/servicebroker/blob/v2.13/spec.md), is an endpoint for a set of managed services offered and maintained by a third-party, which could be a cloud provider such as AWS, GCP, or Azure.
Some examples of managed services are Microsoft Azure Cloud Queue, Amazon Simple Queue Service, and Google Cloud Pub/Sub, but they can be any software offering that can be used by an application.

Using Service Catalog, a {{< glossary_tooltip text="cluster operator" term_id="cluster-operator" >}} can browse the list of managed services offered by a service broker, provision an instance of a managed service, and bind with it to make it available to an application in the Kubernetes cluster.




<!-- body -->
## Example use case

An {{< glossary_tooltip text="application developer" term_id="application-developer" >}} wants to use message queuing as part of their application running in a Kubernetes cluster.
However, they do not want to deal with the overhead of setting such a service up and administering it themselves.
Fortunately, there is a cloud provider that offers message queuing as a managed service through its service broker.

A cluster operator can setup Service Catalog and use it to communicate with the cloud provider's service broker to provision an instance of the message queuing service and make it available to the application within the Kubernetes cluster.
The application developer therefore does not need to be concerned with the implementation details or management of the message queue.
The application can access the message queue as a service.

## Architecture

Service Catalog uses the [Open service broker API](https://github.com/openservicebrokerapi/servicebroker) to communicate with service brokers, acting as an intermediary for the Kubernetes API Server to negotiate the initial provisioning and retrieve the credentials necessary for the application to use a managed service.

It is implemented as an extension API server and a controller, using etcd for storage. It also uses the [aggregation layer](/docs/concepts/extend-kubernetes/api-extension/apiserver-aggregation/) available in Kubernetes 1.7+ to present its API.

<br>

![Service Catalog Architecture](/images/docs/service-catalog-architecture.svg)


### API Resources

Service Catalog installs the `servicecatalog.k8s.io` API and provides the following Kubernetes resources:

* `ClusterServiceBroker`: An in-cluster representation of a service broker, encapsulating its server connection details.
These are created and managed by cluster operators who wish to use that broker server to make new types of managed services available within their cluster.
* `ClusterServiceClass`: A managed service offered by a particular service broker.
When a new `ClusterServiceBroker` resource is added to the cluster, the Service Catalog controller connects to the service broker to obtain a list of available managed services. It then creates a new `ClusterServiceClass` resource corresponding to each managed service.
* `ClusterServicePlan`: A specific offering of a managed service. For example, a managed service may have different plans available, such as a free tier or paid tier, or it may have different configuration options, such as using SSD storage or having more resources. Similar to `ClusterServiceClass`, when a new `ClusterServiceBroker` is added to the cluster, Service Catalog creates a new `ClusterServicePlan` resource corresponding to each Service Plan available for each managed service.
* `ServiceInstance`: A provisioned instance of a `ClusterServiceClass`.
These are created by cluster operators to make a specific instance of a managed service available for use by one or more in-cluster applications.
When a new `ServiceInstance` resource is created, the Service Catalog controller connects to the appropriate service broker and instruct it to provision the service instance.
* `ServiceBinding`: Access credentials to a `ServiceInstance`.
These are created by cluster operators who want their applications to make use of a `ServiceInstance`.
Upon creation, the Service Catalog controller creates a Kubernetes `Secret` containing connection details and credentials for the Service Instance, which can be mounted into Pods.

### Authentication

Service Catalog supports these methods of authentication:

* Basic (username/password)
* [OAuth 2.0 Bearer Token](https://tools.ietf.org/html/rfc6750)

## Usage

A cluster operator can use Service Catalog API Resources to provision managed services and make them available within a Kubernetes cluster. The steps involved are:

1. Listing the managed services and Service Plans available from a service broker.
1. Provisioning a new instance of the managed service.
1. Binding to the managed service, which returns the connection credentials.
1. Mapping the connection credentials into the application.

### Listing managed services and Service Plans

First, a cluster operator must create a `ClusterServiceBroker` resource within the `servicecatalog.k8s.io` group. This resource contains the URL and connection details necessary to access a service broker endpoint.

This is an example of a `ClusterServiceBroker` resource:

```yaml
apiVersion: servicecatalog.k8s.io/v1beta1
kind: ClusterServiceBroker
metadata:
  name: cloud-broker
spec:
  # Points to the endpoint of a service broker. (This example is not a working URL.)
  url:  https://servicebroker.somecloudprovider.com/v1alpha1/projects/service-catalog/brokers/default
  #####
  # Additional values can be added here, which may be used to communicate
  # with the service broker, such as bearer token info or a caBundle for TLS.
  #####
```

The following is a sequence diagram illustrating the steps involved in listing managed services and Plans available from a service broker:

![List Services](/images/docs/service-catalog-list.svg)

1. Once the `ClusterServiceBroker` resource is added to Service Catalog, it triggers a call to the external service broker for a list of available services.
1. The service broker returns a list of available managed services and a list of Service Plans, which are cached locally as `ClusterServiceClass` and `ClusterServicePlan` resources respectively.
1. A cluster operator can then get the list of available managed services using the following command:

        kubectl get clusterserviceclasses -o=custom-columns=SERVICE\ NAME:.metadata.name,EXTERNAL\ NAME:.spec.externalName

    It should output a list of service names with a format similar to:

        SERVICE NAME                           EXTERNAL NAME
        4f6e6cf6-ffdd-425f-a2c7-3c9258ad2468   cloud-provider-service
        ...                                    ...

    They can also view the Service Plans available using the following command:

        kubectl get clusterserviceplans -o=custom-columns=PLAN\ NAME:.metadata.name,EXTERNAL\ NAME:.spec.externalName

    It should output a list of plan names with a format similar to:

        PLAN NAME                              EXTERNAL NAME
        86064792-7ea2-467b-af93-ac9694d96d52   service-plan-name
        ...                                    ...


### Provisioning a new instance

A cluster operator can initiate the provisioning of a new instance by creating a `ServiceInstance` resource.

This is an example of a `ServiceInstance` resource:

```yaml
apiVersion: servicecatalog.k8s.io/v1beta1
kind: ServiceInstance
metadata:
  name: cloud-queue-instance
  namespace: cloud-apps
spec:
  # References one of the previously returned services
  clusterServiceClassExternalName: cloud-provider-service
  clusterServicePlanExternalName: service-plan-name
  #####
  # Additional parameters can be added here,
  # which may be used by the service broker.
  #####
```

The following sequence diagram illustrates the steps involved in provisioning a new instance of a managed service:

![Provision a Service](/images/docs/service-catalog-provision.svg)

1. When the `ServiceInstance` resource is created, Service Catalog initiates a call to the external service broker to provision an instance of the service.
1. The service broker creates a new instance of the managed service and returns an HTTP response.
1. A cluster operator can then check the status of the instance to see if it is ready.

### Binding to a managed service

After a new instance has been provisioned, a cluster operator must bind to the managed service to get the connection credentials and service account details necessary for the application to use the service. This is done by creating a `ServiceBinding` resource.

The following is an example of a `ServiceBinding` resource:

```yaml
apiVersion: servicecatalog.k8s.io/v1beta1
kind: ServiceBinding
metadata:
  name: cloud-queue-binding
  namespace: cloud-apps
spec:
  instanceRef:
    name: cloud-queue-instance
  #####
  # Additional information can be added here, such as a secretName or
  # service account parameters, which may be used by the service broker.
  #####
```

The following sequence diagram illustrates the steps involved in binding to a managed service instance:

![Bind to a managed service](/images/docs/service-catalog-bind.svg)

1. After the `ServiceBinding` is created, Service Catalog makes a call to the external service broker requesting the information necessary to bind with the service instance.
1. The service broker enables the application permissions/roles for the appropriate service account.
1. The service broker returns the information necessary to connect and access the managed service instance. This is provider and service-specific so the information returned may differ between Service Providers and their managed services.

### Mapping the connection credentials

After binding, the final step involves mapping the connection credentials and service-specific information into the application.
These pieces of information are stored in secrets that the application in the cluster can access and use to connect directly with the managed service.

<br>

![Map connection credentials](/images/docs/service-catalog-map.svg)

#### Pod configuration File

One method to perform this mapping is to use a declarative Pod configuration.

The following example describes how to map service account credentials into the application. A key called `sa-key` is stored in a volume named `provider-cloud-key`, and the application mounts this volume at `/var/secrets/provider/key.json`. The environment variable `PROVIDER_APPLICATION_CREDENTIALS` is mapped from the value of the mounted file.

```yaml
...
    spec:
      volumes:
        - name: provider-cloud-key
          secret:
            secretName: sa-key
      containers:
...
          volumeMounts:
          - name: provider-cloud-key
            mountPath: /var/secrets/provider
          env:
          - name: PROVIDER_APPLICATION_CREDENTIALS
            value: "/var/secrets/provider/key.json"
```

The following example describes how to map secret values into application environment variables. In this example, the messaging queue topic name is mapped from a secret named `provider-queue-credentials` with a key named `topic` to the environment variable `TOPIC`.


```yaml
...
          env:
          - name: "TOPIC"
            valueFrom:
                secretKeyRef:
                   name: provider-queue-credentials
                   key: topic
```




## {{% heading "whatsnext" %}}

* If you are familiar with {{< glossary_tooltip text="Helm Charts" term_id="helm-chart" >}}, [install Service Catalog using Helm](/docs/tasks/service-catalog/install-service-catalog-using-helm/) into your Kubernetes cluster. Alternatively, you can [install Service Catalog using the SC tool](/docs/tasks/service-catalog/install-service-catalog-using-sc/).
* View [sample service brokers](https://github.com/openservicebrokerapi/servicebroker/blob/master/gettingStarted.md#sample-service-brokers).
* Explore the [kubernetes-sigs/service-catalog](https://github.com/kubernetes-sigs/service-catalog) project.
* View [svc-cat.io](https://svc-cat.io/docs/).





