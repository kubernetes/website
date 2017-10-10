---
title: Service Catalog
approvers:
- chenopis
---

{% capture overview %}
{% glossary_definition term_id="service-catalog" length="all" %}

{% endcapture %}


{% capture body %}
## Example use case

An {% glossary_tooltip text="Application Developer" term_id="application-developer" %} wants to use a datastore, such as MySQL, as part of their application running in a Kubernetes cluster.
However, they do not want to deal with the overhead of setting one up and administrating it themselves.
Fortunately, there is a cloud provider that offers MySQL databases as a *Managed Service* through their *Service Broker*.

A *Service Broker*, as defined by the [Open Service Broker API spec](https://github.com/openservicebrokerapi/servicebroker/blob/v2.13/spec.md), is an endpoint for a set of Managed Services offered and maintained by a third-party, which could be a cloud provider such as AWS, GCP, or Azure.
Some examples of *Managed Services* are Azure SQL Database, Amazon EC2, and Google Cloud Pub/Sub, but they can be any software offering that can be used by an application, typically available via HTTP REST endpoints.
{: .note}

Using Service Catalog, the {% glossary_tooltip text="Cluster Operator" term_id="cluster-operator" %} can browse the list of Managed Services offered by a Service Broker, provision a MySQL database instance, and bind with it to make it available to the application within the Kubernetes cluster.
The Application Developer therefore does not need to concern themselves with the implementation details or management of the database.
Their application can simply use it as a service.

## Architecture

Service Catalog is built on the [Open Service Broker API](https://github.com/openservicebrokerapi/servicebroker) and is implemented as an extension API server, controller manager, and etcd operator.
It communicates with Service Brokers via the OSB API and acts as an intermediary for the Kubernetes API Server in order to negotiate the initial provisioning and return the credentials necessary for the application to use a Managed Service.

<br>

![Service Catalog Architecture](/images/docs/service-catalog-architecture.svg)


### API Resources

Service Catalog installs the `servicecatalog.k8s.io` API and provides the following Kubernetes resources:

* `ServiceBroker`: An in-cluster representation of a Service Broker, encapsulating its server connection details.
These are created and managed by Cluster Operators who wish to use that broker server to make new types of Managed Services available within their cluster.
* `ServiceClass`: A Managed Service offered by a particular Service Broker.
When a new `ServiceBroker` resource is added to the cluster, the Service Catalog controller connects to the Service Broker to obtain a list of available Managed Services. It then creates a new `ServiceClass` resource corresponding to each Managed Service.
* `ServiceInstance`: A provisioned instance of a `ServiceClass`.
These are created by Cluster Operators to make a specific instance of a Managed Service available for use by one or more in-cluster applications.
When a new `ServiceInstance` resource is created, the Service Catalog controller will connect to the appropriate Service Broker and instruct it to provision the service instance.
* `ServiceBinding`: Access credentials to a `ServiceInstance`.
These are created by Cluster Operators who want their applications to make use of a Service `ServiceInstance`.
Upon creation, the Service Catalog controller will create a Kubernetes `Secret` containing connection details and credentials for the Service Instance, which can be mounted into Pods.

### Mutual TLS encryption

The mutual TLS protocol encrypts communication between the Service Catalog extension API server and the main Kubernetes API server. 

During installation, Service Catalog creates its own certificate authority (CA), and generates its own public and private keys, signed by this CA.
The CA public certificate is installed into the main API server when Service Catalog registers its API.
Service Catalog accesses the main API server CA certificate from the API server ConfigMap, after being granted the *extension-apiserver-authentication-reader* role. 

Certificate rotation is handled by exposing a Service Catalog URL, similar to a `/statusz` endpoint, which returns the number of days until the CA and certificates expire.
Alerts for certificate rotation can be created by monitoring this URL.

### Authentication

Service Catalog supports these methods of authentication: 

* Basic (username/password)
* [OAuth 2.0 Bearer Token](https://tools.ietf.org/html/rfc6750)

## Usage

The {% glossary_tooltip text="Cluster Operator" term_id="cluster-operator" %} can use the Service Catalog API Resources to provision Managed Services and make them available within the Kubernetes cluster. The steps involved are:

1. Listing the Managed Services available from a Service Broker.
1. Provisioning a new instance of the Managed Service.
1. Binding to the Managed Service, which returns the connection credentials.
1. Mapping the connection credentials into the application.

### Listing Managed Services

First, the Cluster Operator must create a `ServiceBroker` resource within the `servicecatalog.k8s.io` group. This resource contains the URL and connection details necessary to access a Service Broker endpoint.

This is an example of a `ServiceBroker` resource:

```yaml
apiVersion: servicecatalog.k8s.io/v1alpha1
kind: ServiceBroker
metadata:
  name: cloud-broker
spec:
  # Points to the endpoint of a Service Broker. (This example is not a working URL.)
  url:  https://servicebroker.somecloudprovider.com/v1alpha1/projects/service-catalog/brokers/default
  # Describes the secret which contains the short-lived bearer token
  authInfo:
    bearer:
      secretRef:
        name: cloud-svc-account-secret
        namespace: service-catalog
```

The following is a sequence diagram illustrating the steps involved in listing Managed Services available from a Service Broker:

![List Services](/images/docs/service-catalog-list.svg){:height="80%" width="80%"}

1. Once the `ServiceBroker` resource is added to Service Catalog, it triggers a *List Services* call to the external Service Broker.
1. The Service Broker returns a list of available Managed Services, which is cached locally in a `ServiceClass` resource.
1. The Cluster Operator can then get the list of available Managed Services using the following command:

        kubectl get serviceclasses

### Provisioning a new instance

The Cluster Operator can initiate the provisioning of a new instance by creating a `ServiceInstance` resource. 

This is an example of a `ServiceInstance` resource:

```yaml
apiVersion: servicecatalog.k8s.io/v1alpha1
kind: ServiceInstance
metadata:
  name: cloud-mysql-instance
  namespace: cloud-apps
spec:
  # References one of the previously returned services
  serviceClassName: mysql
  planName: mysql-plan
```

The following sequence diagram illustrates the steps involved in provisioning a new instance of a Managed Service:

![Provision a Service](/images/docs/service-catalog-provision.svg){:height="80%" width="80%"}

1. When the `ServiceInstance` resource is created, Service Catalog initiates a *Provision Instance* call to the external Service Broker.
1. The Service Broker creates a new instance of the Managed Service and returns an HTTP 200 response if the provisioning was successful.
1. The Cluster Operator can then check the status of the instance to see if it is ready.

### Binding to a Managed Service

After a new instance has been provisioned, the Cluster Operator must bind to the Managed Service to get the connection credentials and service account details necessary for the application to use the service. This is done by creating a `ServiceBinding` resource. 

The following is an example of a `ServiceBinding` resource:

```yaml
apiVersion: servicecatalog.k8s.io/v1alpha1
kind: ServiceBinding
metadata:
  name: cloud-mysql-binding
  namespace: cloud-apps
spec:
  instanceRef:
    name: cloud-mysql-instance
  # Secret to store returned data from bind call
  # Currently:
  #   project: provider project id
  #   serviceAccount: same as passed as parameter
  #   subscription: generated subscription name
  #   topic: generated topic name
  secretName: cloud-mysql-credentials
  parameters:
    # provider *app* service account
    serviceAccount: "someuser@auth.somecloudprovider.com"
    # publisher or subscriber
    roles: ["roles/mysql.subscriber"]
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

The following example describes how to map service account credentials into the application. A key called `sa-key` is stored in a volume named `google-cloud-key`, and the application mounts this volume at `/var/secrets/google/key.json`. The environment variable `GOOGLE_APPLICATION_CREDENTIALS` is mapped from the value of the mounted file.

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

The following example describes how to map secret values into application environment variables. In this example, the MySql topic name is mapped from a secret named `provider-mysql-credentials` with a key named `topic` to the environment variable `TOPIC`.


```yaml
...
          env:
          - name: "TOPIC"
            valueFrom:
                secretKeyRef:
                   name: provider-mysql-credentials
                   key: topic
```

{% endcapture %}


{% capture whatsnext %}
* [Install Service Catalog](/docs/tasks/service-catalog/install-service-catalog/) in your Kubernetes cluster.
* View [sample service brokers](https://github.com/openservicebrokerapi/servicebroker/blob/master/gettingStarted.md#sample-service-brokers).
* Explore the [kubernetes-incubator/service-catalog](https://github.com/kubernetes-incubator/service-catalog) project.

{% endcapture %}


{% include templates/concept.md %}
