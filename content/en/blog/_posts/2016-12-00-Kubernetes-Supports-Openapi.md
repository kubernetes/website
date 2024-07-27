---
title: " Kubernetes supports OpenAPI "
date: 2016-12-23
slug: kubernetes-supports-openapi
url: /blog/2016/12/Kubernetes-Supports-Openapi
author: >
  Mehdy Bohlool (Google)
---
_**Editor's note:** this post is part of a [series of in-depth articles](/blog/2016/12/five-days-of-kubernetes-1-5/) on what's new in Kubernetes 1.5_

[OpenAPI](https://www.openapis.org/) allows API providers to define their operations and models, and enables developers to automate their tools and generate their favorite language’s client to talk to that API server. Kubernetes has supported swagger 1.2 (older version of OpenAPI spec) for a while, but the spec was incomplete and invalid, making it hard to generate tools/clients based on it.   

In Kubernetes 1.4, we introduced alpha support for the OpenAPI spec (formerly known as swagger 2.0 before it was donated to the [Open API Initiative](https://www.openapis.org/about)) by upgrading the current models and operations. Beginning in [Kubernetes 1.5](https://kubernetes.io/blog/2016/12/kubernetes-1-5-supporting-production-workloads/), the support for the OpenAPI spec has been completed by auto-generating the spec directly from Kubernetes source, which will keep the spec--and documentation--completely in sync with future changes in operations/models.

The new spec enables us to have better API documentation and we have even introduced a supported [python client](https://github.com/kubernetes-incubator/client-python).  

The spec is modular, divided by GroupVersion: this is future-proof, since we intend to allow separate GroupVersions to be served out of separate API servers.  

The structure of spec is explained in detail in [OpenAPI spec definition](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md). We used [operation’s tags](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#tag-object) to separate each GroupVersion and filled as much information as we can about paths/operations and models. For a specific operation, all parameters, method of call, and responses are documented.   

For example, OpenAPI spec for reading a pod information is:  



```
{

...  
  "paths": {

"/api/v1/namespaces/{namespace}/pods/{name}": {  
    "get": {  
     "description": "read the specified Pod",  
     "consumes": [  
      "\*/\*"  
     ],  
     "produces": [  
      "application/json",  
      "application/yaml",  
      "application/vnd.kubernetes.protobuf"  
     ],  
     "schemes": [  
      "https"  
     ],  
     "tags": [  
      "core\_v1"  
     ],  
     "operationId": "readCoreV1NamespacedPod",  
     "parameters": [  
      {  
       "uniqueItems": true,  
       "type": "boolean",  
       "description": "Should the export be exact.  Exact export maintains cluster-specific fields like 'Namespace'.",  
       "name": "exact",  
       "in": "query"  
      },  
      {  
       "uniqueItems": true,  
       "type": "boolean",  
       "description": "Should this value be exported.  Export strips fields that a user can not specify.",  
       "name": "export",  
       "in": "query"  
      }  
     ],  
     "responses": {  
      "200": {  
       "description": "OK",  
       "schema": {  
        "$ref": "#/definitions/v1.Pod"  
       }  
      },  
      "401": {  
       "description": "Unauthorized"  
      }  
     }  
    },

…

}

…
 ```



Using this information and the URL of `kube-apiserver`, one should be able to make the call to the given url (/api/v1/namespaces/{namespace}/pods/{name}) with parameters such as `name`, `exact`, `export`, etc. to get pod’s information. Client libraries generators would also use this information to create an API function call for reading pod’s information. For example, [python client](https://github.com/kubernetes-incubator/client-python) makes it easy to call this operation like this:



```
from kubernetes import client

ret = client.CoreV1Api().read\_namespaced\_pod(name="pods\_name", namespace="default")
 ```



A simplified version of generated read\_namespaced\_pod, can be found [here](https://gist.github.com/mbohlool/d5ec1dace27ef90cf742555c05480146).



Swagger-codegen document generator would also be able to create documentation using the same information:



```
GET /api/v1/namespaces/{namespace}/pods/{name}

(readCoreV1NamespacedPod)

read the specified Pod

Path parameters

name (required)

Path Parameter — name of the Pod

namespace (required)

Path Parameter — object name and auth scope, such as for teams and projects

Consumes

This API call consumes the following media types via the Content-Type request header:

-
\*/\*


Query parameters

pretty (optional)

Query Parameter — If 'true', then the output is pretty printed.

exact (optional)

Query Parameter — Should the export be exact. Exact export maintains cluster-specific fields like 'Namespace'.

export (optional)

Query Parameter — Should this value be exported. Export strips fields that a user can not specify.

Return type

v1.Pod


Produces

This API call produces the following media types according to the Accept request header; the media type will be conveyed by the Content-Type response header.

-
application/json
-
application/yaml
-
application/vnd.kubernetes.protobuf

Responses

200

OK v1.Pod

401

Unauthorized
 ```





There are two ways to access OpenAPI spec:

- From `kuber-apiserver`/swagger.json. This file will have all enabled GroupVersions routes and models and would be most up-to-date file with an specific `kube-apiserver`.
- From Kubernetes GitHub repository with all core GroupVersions enabled. You can access it on [master](https://github.com/kubernetes/kubernetes/blob/master/api/openapi-spec/swagger.json) or an specific release (for example [1.5 release](https://github.com/kubernetes/kubernetes/blob/release-1.5/api/openapi-spec/swagger.json)).

There are numerous [tools](http://swagger.io/tools/) that works with this spec. For example, you can use the [swagger editor](http://swagger.io/swagger-editor/) to open the spec file and render documentation, as well as generate clients; or you can directly use [swagger codegen](http://swagger.io/swagger-codegen/) to generate documentation and clients. The clients this generates will mostly work out of the box--but you will need some support for authorization and some Kubernetes specific utilities. Use [python client](https://github.com/kubernetes-incubator/client-python) as a template to create your own client.



If you want to get involved in development of OpenAPI support, client libraries, or report a bug, you can get in touch with developers at [SIG-API-Machinery](https://github.com/kubernetes/community/tree/master/sig-api-machinery).






- [Download](http://get.k8s.io/) Kubernetes
- Get involved with the Kubernetes project on [GitHub](https://github.com/kubernetes/kubernetes)
- Post questions (or answer questions) on [Stack Overflow](http://stackoverflow.com/questions/tagged/kubernetes)
- Connect with the community on [Slack](http://slack.k8s.io/)
- Follow us on Twitter [@Kubernetesio](https://twitter.com/kubernetesio) for latest updates
