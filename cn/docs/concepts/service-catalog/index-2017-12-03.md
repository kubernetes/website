---
title: Service Catalog
approvers:
- chenopis
---

{% capture overview %}
{% glossary_definition term_id="service-catalog" length="all" prepend="Service Catalog is " %}  

A *Service Broker*, as defined by the [Open Service Broker API spec](https://github.com/openservicebrokerapi/servicebroker/blob/v2.13/spec.md), is an endpoint for a set of Managed Services offered and maintained by a third-party, which could be a cloud provider such as AWS, GCP, or Azure.
Some examples of *Managed Services* are Microsoft Azure Cloud Queue, Amazon Simple Queue Service, and Google Cloud Pub/Sub, but they can be any software offering that can be used by an application.

Using Service Catalog, a {% glossary_tooltip text="Cluster Operator" term_id="cluster-operator" %} can browse the list of {% glossary_tooltip text="Managed Services" term_id="managed-service" %} offered by a {% glossary_tooltip text="Service Brokers" term_id="service-broker" %}, provision an instance of a Managed Service, and bind with it to make it available to an application within the Kubernetes cluster.

{% endcapture %}


{% capture body %}
## Example use case

An {% glossary_tooltip text="Application Developer" term_id="application-developer" %} wants to use message queuing as part of their application running in a Kubernetes cluster.
However, they do not want to deal with the overhead of setting such a service up and administering it themselves.
Fortunately, there is a cloud provider that offers message queuing as a *Managed Service* through their *Service Broker*.

A {% glossary_tooltip text="Cluster Operator" term_id="cluster-operator" %} can setup Service Catalog and use it to communicate with the cloud provider's {% glossary_tooltip text="Service Broker" term_id="service-broker" %} to provision an instance of the message queuing service and make it available to the application within the Kubernetes cluster.
The {% glossary_tooltip text="Application Developer" term_id="application-developer" %} therefore does not need to concern themselves with the implementation details or management of the message queue.
Their application can simply use it as a service.

## Architecture

Service Catalog uses the [Open Service Broker API](https://github.com/openservicebrokerapi/servicebroker) to communicate with Service Brokers, acting as an intermediary for the Kubernetes API Server in order to negotiate the initial provisioning and retrieve the credentials necessary for the application to use a Managed Service.

It is implemented as an extension API server and a controller manager, using Etcd for storage. It also uses the [aggregation layer](/docs/concepts/api-extension/apiserver-aggregation/) available in Kubernetes 1.7+ to present its API.

<br>

![Service Catalog Architecture](/images/docs/service-catalog-architecture.svg)


### API Resources

Service Catalog installs the `servicecatalog.k8s.io` API and provides the following Kubernetes resources:

* `ClusterServiceBroker`: An in-cluster representation of a Service Broker, encapsulating its server connection details.
These are created and managed by Cluster Operators who wish to use that broker server to make new types of Managed Services available within their cluster.
* `ClusterServiceClass`: A Managed Service offered by a particular Service Broker.
When a new `ClusterServiceBroker` resource is added to the cluster, the Service Catalog controller connects to the Service Broker to obtain a list of available Managed Services. It then creates a new `ClusterServiceClass` resource corresponding to each Managed Service.
* `ClusterServicePlan`: A specific offering of a Managed Service. For example, a Managed Service may have different plans available, such as a free tier or paid tier, or it may have different configuration options, such as using SSD storage or having more resources. Similar to `ClusterServiceClass`, when a new `ClusterServiceBroker` is added to the cluster, the Service Catalog creates a new `ClusterServicePlan` resource corresponding to each Service Plan available for each Managed Service.
* `ServiceInstance`: A provisioned instance of a `ClusterServiceClass`.
These are created by Cluster Operators to make a specific instance of a Managed Service available for use by one or more in-cluster applications.
When a new `ServiceInstance` resource is created, the Service Catalog controller will connect to the appropriate Service Broker and instruct it to provision the service instance.
* `ServiceBinding`: Access credentials to a `ServiceInstance`.
These are created by Cluster Operators who want their applications to make use of a Service `ServiceInstance`.
Upon creation, the Service Catalog controller will create a Kubernetes `Secret` containing connection details and credentials for the Service Instance, which can be mounted into Pods.

### Authentication

Service Catalog supports these methods of authentication: 

* Basic (username/password)
* [OAuth 2.0 Bearer Token](https://tools.ietf.org/html/rfc6750)

## Usage

A {% glossary_tooltip text="Cluster Operator" term_id="cluster-operator" %} can use the Service Catalog API Resources to provision Managed Services and make them available within a Kubernetes cluster. The steps involved are:

1. Listing the Managed Services and Service Plans available from a Service Broker.
1. Provisioning a new instance of the Managed Service.
1. Binding to the Managed Service, which returns the connection credentials.
1. Mapping the connection credentials into the application.

### Listing Managed Services and Service Plans

First, a {% glossary_tooltip text="Cluster Operator" term_id="cluster-operator" %} must create a `ClusterServiceBroker` resource within the `servicecatalog.k8s.io` group. This resource contains the URL and connection details necessary to access a Service Broker endpoint.

This is an example of a `ClusterServiceBroker` resource:

```yaml
apiVersion: servicecatalog.k8s.io/v1beta1
kind: ClusterServiceBroker
metadata:
  name: cloud-broker
spec:
  # Points to the endpoint of a Service Broker. (This example is not a working URL.)
  url:  https://servicebroker.somecloudprovider.com/v1alpha1/projects/service-catalog/brokers/default
  #####
  # Additional values can be added here, which may be used to communicate
  # with the Service Broker, such as bearer token info or a caBundle for TLS.
  #####
```

The following is a sequence diagram illustrating the steps involved in listing Managed Services and Plans available from a Service Broker:

![List Services](/images/docs/service-catalog-list.svg){:height="80%" width="80%"}

1. Once the `ClusterServiceBroker` resource is added to Service Catalog, it triggers a *List Services* call to the external Service Broker.
1. The Service Broker returns a list of available Managed Services and Service Plans, which are cached locally in `ClusterServiceClass` and `ClusterServicePlan` resources.
1. A {% glossary_tooltip text="Cluster Operator" term_id="cluster-operator" %} can then get the list of available Managed Services using the following command:

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

A {% glossary_tooltip text="Cluster Operator" term_id="cluster-operator" %} can initiate the provisioning of a new instance by creating a `ServiceInstance` resource. 

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
  # which may be used by the Service Broker.
  #####
```

The following sequence diagram illustrates the steps involved in provisioning a new instance of a Managed Service:

![Provision a Service](/images/docs/service-catalog-provision.svg){:height="80%" width="80%"}

1. When the `ServiceInstance` resource is created, Service Catalog initiates a *Provision Instance* call to the external Service Broker.
1. The Service Broker creates a new instance of the Managed Service and returns an HTTP response.
1. A {% glossary_tooltip text="Cluster Operator" term_id="cluster-operator" %} can then check the status of the instance to see if it is ready.

### Binding to a Managed Service

After a new instance has been provisioned, a {% glossary_tooltip text="Cluster Operator" term_id="cluster-operator" %} must bind to the Managed Service to get the connection credentials and service account details necessary for the application to use the service. This is done by creating a `ServiceBinding` resource. 

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
  # service account parameters, which may be used by the Service Broker.
  #####
```

The following sequence diagram illustrates the steps involved in binding to a Managed Service instance:

![Bind to a Managed Service](/images/docs/service-catalog-bind.svg){:height="80%" width="80%"}

1. After the `ServiceBinding` is created, Service Catalog makes a *Bind Instance* call to the external Service Broker.
1. The Service Broker enables the application permissions/roles for the appropriate service account.
1. The Service Broker returns the information necessary to connect and access the Managed Service instance. This is provider and service-specific so the information returned may differ between Service Providers and their Managed Services.

### Mapping the connection credentials

After binding, the final step involves mapping the connection credentials and service-specific information into the application.
These pieces of information are stored in secrets that the application in the cluster can access and use to connect directly with the Managed Service.

<br>

![Map connection credentials](/images/docs/service-catalog-map.svg)

#### Pod Configuration File

One method to perform this mapping is to use a declarative Pod configuration.

The following example describes how to map service account credentials into the application. A key called `sa-key` is stored in a volume named `provider-cloud-key`, and the application mounts this volume at `/var/secrets/provider/key.json`. The environment variable `GOOGLE_APPLICATION_CREDENTIALS` is mapped from the value of the mounted file.

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

{% endcapture %}


{% capture whatsnext %}
* If you are familiar with {% glossary_tooltip text="Helm Charts" term_id="helm-chart" %}, [install Service Catalog using Helm](/docs/tasks/service-catalog/install-service-catalog-using-helm/) into your Kubernetes cluster. Alternatively, you can [install Service Catalog using the SC tool](/docs/tasks/service-catalog/install-service-catalog-using-sc/).
* View [sample service brokers](https://github.com/openservicebrokerapi/servicebroker/blob/master/gettingStarted.md#sample-service-brokers).
* Explore the [kubernetes-incubator/service-catalog](https://github.com/kubernetes-incubator/service-catalog) project.

{% endcapture %}


{% include templates/concept.md %}
