

-----------
# Service v1

>bdocs-tab:kubectl Service Config to load balance traffic across all Pods with the app=nginx label.  Receives on and sends to port 80.  Exposes an externally accessible endpoint.

```bdocs-tab:kubectl_yaml

kind: Service
apiVersion: v1
metadata:
  # Unique key of the Service instance
  name: service-example
spec:
  ports:
    # Accept traffic sent to port 80
    - name: http
      port: 80
      targetPort: 80
  selector:
    # Loadbalance traffic across Pods matching
    # this label selector
    app: nginx
  # Create an HA proxy in the cloud provider
  # with an External IP address
  type: LoadBalancer


```
>bdocs-tab:curl Service Config to load balance traffic across all Pods with the app=nginx label.  Receives on and sends to port 80.  Exposes an externally accessible endpoint.

```bdocs-tab:curl_yaml

kind: Service
apiVersion: v1
metadata:
  # Unique key of the Service instance
  name: service-example
spec:
  ports:
    # Accept traffic sent to port 80
    - name: http
      port: 80
      targetPort: 80
  selector:
    # Loadbalance traffic across Pods matching
    # this label selector
    app: nginx
  # Create an HA proxy in the cloud provider
  # with an External IP address
  type: LoadBalancer


```


Group        | Version     | Kind
------------ | ---------- | -----------
Core | v1 | Service







Service is a named abstraction of software service (for example, mysql) consisting of local port (for example 3306) that the proxy listens on, and the selector that determines which pods will answer requests sent through the proxy.

<aside class="notice">
Appears In <a href="#servicelist-v1">ServiceList</a> </aside>

Field        | Description
------------ | -----------
metadata <br /> *[ObjectMeta](#objectmeta-v1)*  | Standard object's metadata. More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#metadata
spec <br /> *[ServiceSpec](#servicespec-v1)*  | Spec defines the behavior of a service. http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#spec-and-status
status <br /> *[ServiceStatus](#servicestatus-v1)*  | Most recently observed status of the service. Populated by the system. Read-only. More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#spec-and-status


### ServiceSpec v1

<aside class="notice">
Appears In <a href="#service-v1">Service</a> </aside>

Field        | Description
------------ | -----------
clusterIP <br /> *string*  | clusterIP is the IP address of the service and is usually assigned randomly by the master. If an address is specified manually and is not in use by others, it will be allocated to the service; otherwise, creation of the service will fail. This field can not be changed through updates. Valid values are "None", empty string (""), or a valid IP address. "None" can be specified for headless services when proxying is not required. Only applies to types ClusterIP, NodePort, and LoadBalancer. Ignored if type is ExternalName. More info: http://kubernetes.io/docs/user-guide/services#virtual-ips-and-service-proxies
deprecatedPublicIPs <br /> *string array*  | deprecatedPublicIPs is deprecated and replaced by the externalIPs field with almost the exact same semantics.  This field is retained in the v1 API for compatibility until at least 8/20/2016.  It will be removed from any new API revisions.  If both deprecatedPublicIPs *and* externalIPs are set, deprecatedPublicIPs is used.
externalIPs <br /> *string array*  | externalIPs is a list of IP addresses for which nodes in the cluster will also accept traffic for this service.  These IPs are not managed by Kubernetes.  The user is responsible for ensuring that traffic arrives at a node with this IP.  A common example is external load-balancers that are not part of the Kubernetes system.  A previous form of this functionality exists as the deprecatedPublicIPs field.  When using this field, callers should also clear the deprecatedPublicIPs field.
externalName <br /> *string*  | externalName is the external reference that kubedns or equivalent will return as a CNAME record for this service. No proxying will be involved. Must be a valid DNS name and requires Type to be ExternalName.
loadBalancerIP <br /> *string*  | Only applies to Service Type: LoadBalancer LoadBalancer will get created with the IP specified in this field. This feature depends on whether the underlying cloud-provider supports specifying the loadBalancerIP when a load balancer is created. This field will be ignored if the cloud-provider does not support the feature.
loadBalancerSourceRanges <br /> *string array*  | If specified and supported by the platform, this will restrict traffic through the cloud-provider load-balancer will be restricted to the specified client IPs. This field will be ignored if the cloud-provider does not support the feature." More info: http://kubernetes.io/docs/user-guide/services-firewalls
ports <br /> *[ServicePort](#serviceport-v1) array*  | The list of ports that are exposed by this service. More info: http://kubernetes.io/docs/user-guide/services#virtual-ips-and-service-proxies
selector <br /> *object*  | Route service traffic to pods with label keys and values matching this selector. If empty or not present, the service is assumed to have an external process managing its endpoints, which Kubernetes will not modify. Only applies to types ClusterIP, NodePort, and LoadBalancer. Ignored if type is ExternalName. More info: http://kubernetes.io/docs/user-guide/services#overview
sessionAffinity <br /> *string*  | Supports "ClientIP" and "None". Used to maintain session affinity. Enable client IP based session affinity. Must be ClientIP or None. Defaults to None. More info: http://kubernetes.io/docs/user-guide/services#virtual-ips-and-service-proxies
type <br /> *string*  | type determines how the Service is exposed. Defaults to ClusterIP. Valid options are ExternalName, ClusterIP, NodePort, and LoadBalancer. "ExternalName" maps to the specified externalName. "ClusterIP" allocates a cluster-internal IP address for load-balancing to endpoints. Endpoints are determined by the selector or if that is not specified, by manual construction of an Endpoints object. If clusterIP is "None", no virtual IP is allocated and the endpoints are published as a set of endpoints rather than a stable IP. "NodePort" builds on ClusterIP and allocates a port on every node which routes to the clusterIP. "LoadBalancer" builds on NodePort and creates an external load-balancer (if supported in the current cloud) which routes to the clusterIP. More info: http://kubernetes.io/docs/user-guide/services#overview

### ServiceStatus v1

<aside class="notice">
Appears In <a href="#service-v1">Service</a> </aside>

Field        | Description
------------ | -----------
loadBalancer <br /> *[LoadBalancerStatus](#loadbalancerstatus-v1)*  | LoadBalancer contains the current status of the load-balancer, if one is present.

### ServiceList v1



Field        | Description
------------ | -----------
items <br /> *[Service](#service-v1) array*  | List of services
metadata <br /> *[ListMeta](#listmeta-unversioned)*  | Standard list metadata. More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#types-kinds




## <strong>Write Operations</strong>

See supported operations below...

## Create

>bdocs-tab:kubectl `kubectl` Command

```bdocs-tab:kubectl_shell

$ echo 'kind: Service
apiVersion: v1
metadata:
  name: service-example
spec:
  ports:
    - name: http
      port: 80
      targetPort: 80
  selector:
      app: nginx
  type: LoadBalancer
' | kubectl create -f -

```

>bdocs-tab:curl `curl` Command (*requires `kubectl proxy` to be running*)

```bdocs-tab:curl_shell

$ kubectl proxy
$ curl -X POST -H 'Content-Type: application/yaml' --data '
kind: Service
apiVersion: v1
metadata:
  name: service-example
spec:
  ports:
    - name: http
      port: 80
      targetPort: 80
  selector:
      app: nginx
  type: LoadBalancer
' http://127.0.0.1:8001/api/v1/namespaces/default/services

```

>bdocs-tab:kubectl Output

```bdocs-tab:kubectl_json

service "service-example" created

```
>bdocs-tab:curl Response Body

```bdocs-tab:curl_json

{
  "kind": "Service",
  "apiVersion": "v1",
  "metadata": {
    "name": "service-example",
    "namespace": "default",
    "selfLink": "/api/v1/namespaces/default/services/service-example",
    "uid": "93e5c731-9d30-11e6-9c54-42010a800148",
    "resourceVersion": "2205767",
    "creationTimestamp": "2016-10-28T17:04:24Z"
  },
  "spec": {
    "ports": [
      {
        "name": "http",
        "protocol": "TCP",
        "port": 80,
        "targetPort": 80,
        "nodePort": 32417
      }
    ],
    "selector": {
      "app": "nginx"
    },
    "clusterIP": "10.183.250.161",
    "type": "LoadBalancer",
    "sessionAffinity": "None"
  },
  "status": {
    "loadBalancer": {}
  }
}

```



create a Service

### HTTP Request

`POST /api/v1/namespaces/{namespace}/services`

### Path Parameters

Parameter    | Description
------------ | -----------
namespace  | object name and auth scope, such as for teams and projects
pretty  | If 'true', then the output is pretty printed.

### Query Parameters

Parameter    | Description
------------ | -----------
body <br /> *[Service](#service-v1)*  | 

### Response

Code         | Description
------------ | -----------
200 <br /> *[Service](#service-v1)*  | OK


## Replace

>bdocs-tab:kubectl `kubectl` Command

```bdocs-tab:kubectl_shell

$ echo 'apiVersion: v1
kind: Service
metadata:
  name: deployment-example
  resourceVersion: "2205995"
spec:
  clusterIP: 10.183.250.161
  ports:
  - name: http
    nodePort: 32417
    port: 80
    protocol: TCP
    targetPort: 8080
  selector:
    app: nginx
  sessionAffinity: None
  type: LoadBalancer
' | kubectl replace -f -

```

>bdocs-tab:curl `curl` Command (*requires `kubectl proxy` to be running*)

```bdocs-tab:curl_shell

$ kubectl proxy
$ curl -X PUT -H 'Content-Type: application/yaml' --data '
apiVersion: v1
kind: Service
metadata:
  name: deployment-example
  resourceVersion: "2205995"
spec:
  clusterIP: 10.183.250.161
  ports:
  - name: http
    nodePort: 32417
    port: 80
    protocol: TCP
    targetPort: 8080
  selector:
    app: nginx
  sessionAffinity: None
  type: LoadBalancer
' http://127.0.0.1:8001/api/v1/namespaces/default/services/deployment-example

```

>bdocs-tab:kubectl Output

```bdocs-tab:kubectl_json

service "deployment-example" replaced

```
>bdocs-tab:curl Response Body

```bdocs-tab:curl_json

{
  "kind": "Service",
  "apiVersion": "v1",
  "metadata": {
    "name": "deployment-example",
    "namespace": "default",
    "selfLink": "/api/v1/namespaces/default/services/deployment-example",
    "uid": "93e5c731-9d30-11e6-9c54-42010a800148",
    "resourceVersion": "2208672",
    "creationTimestamp": "2016-10-28T17:04:24Z"
  },
  "spec": {
    "ports": [
      {
        "name": "http",
        "protocol": "TCP",
        "port": 80,
        "targetPort": 8080,
        "nodePort": 32417
      }
    ],
    "selector": {
      "app": "nginx"
    },
    "clusterIP": "10.183.250.161",
    "type": "LoadBalancer",
    "sessionAffinity": "None"
  },
  "status": {
    "loadBalancer": {
      "ingress": [
        {
          "ip": "104.198.186.106"
        }
      ]
    }
  }
}

```



replace the specified Service

### HTTP Request

`PUT /api/v1/namespaces/{namespace}/services/{name}`

### Path Parameters

Parameter    | Description
------------ | -----------
name  | name of the Service
namespace  | object name and auth scope, such as for teams and projects
pretty  | If 'true', then the output is pretty printed.

### Query Parameters

Parameter    | Description
------------ | -----------
body <br /> *[Service](#service-v1)*  | 

### Response

Code         | Description
------------ | -----------
200 <br /> *[Service](#service-v1)*  | OK


## Patch

>bdocs-tab:kubectl `kubectl` Command

```bdocs-tab:kubectl_shell

$ kubectl patch service deployment-example -p \
	'{"spec":{"ports":[{"name":"http","port":80,"targetPort":8080}]}}'

```

>bdocs-tab:curl `curl` Command (*requires `kubectl proxy` to be running*)

```bdocs-tab:curl_shell

$ kubectl proxy
$ curl -X PATCH -H 'Content-Type: application/strategic-merge-patch+json' --data '
{"spec":{"ports":[{"name":"http","port":80,"targetPort":8080}]}}' \
	'http://127.0.0.1:8001/api/v1/namespaces/default/services/deployment-example'

```

>bdocs-tab:kubectl Output

```bdocs-tab:kubectl_json

"deployment-example" patched

```
>bdocs-tab:curl Response Body

```bdocs-tab:curl_json

{
  "kind": "Service",
  "apiVersion": "v1",
  "metadata": {
    "name": "deployment-example",
    "namespace": "default",
    "selfLink": "/api/v1/namespaces/default/services/deployment-example",
    "uid": "93e5c731-9d30-11e6-9c54-42010a800148",
    "resourceVersion": "2205995",
    "creationTimestamp": "2016-10-28T17:04:24Z"
  },
  "spec": {
    "ports": [
      {
        "name": "http",
        "protocol": "TCP",
        "port": 80,
        "targetPort": 8080,
        "nodePort": 32417
      }
    ],
    "selector": {
      "app": "nginx"
    },
    "clusterIP": "10.183.250.161",
    "type": "LoadBalancer",
    "sessionAffinity": "None"
  },
  "status": {
    "loadBalancer": {
      "ingress": [
        {
          "ip": "104.198.186.106"
        }
      ]
    }
  }
}

```



partially update the specified Service

### HTTP Request

`PATCH /api/v1/namespaces/{namespace}/services/{name}`

### Path Parameters

Parameter    | Description
------------ | -----------
name  | name of the Service
namespace  | object name and auth scope, such as for teams and projects
pretty  | If 'true', then the output is pretty printed.

### Query Parameters

Parameter    | Description
------------ | -----------
body <br /> *[Patch](#patch-unversioned)*  | 

### Response

Code         | Description
------------ | -----------
200 <br /> *[Service](#service-v1)*  | OK


## Delete

>bdocs-tab:kubectl `kubectl` Command

```bdocs-tab:kubectl_shell

$ kubectl delete service deployment-example

```

>bdocs-tab:curl `curl` Command (*requires `kubectl proxy` to be running*)

```bdocs-tab:curl_shell

$ kubectl proxy
$ curl -X DELETE -H 'Content-Type: application/yaml' --data '
gracePeriodSeconds: 0
orphanDependents: false
' 'http://127.0.0.1:8001/api/v1/namespaces/default/services/deployment-example'

```

>bdocs-tab:kubectl Output

```bdocs-tab:kubectl_json

service "deployment-example" deleted

```
>bdocs-tab:curl Response Body

```bdocs-tab:curl_json

{
  "kind": "Status",
  "apiVersion": "v1",
  "metadata": {},
  "status": "Success",
  "code": 200
}


```



delete a Service

### HTTP Request

`DELETE /api/v1/namespaces/{namespace}/services/{name}`

### Path Parameters

Parameter    | Description
------------ | -----------
name  | name of the Service
namespace  | object name and auth scope, such as for teams and projects
pretty  | If 'true', then the output is pretty printed.


### Response

Code         | Description
------------ | -----------
200 <br /> *[Status](#status-unversioned)*  | OK



## <strong>Read Operations</strong>

See supported operations below...

## Read

>bdocs-tab:kubectl `kubectl` Command

```bdocs-tab:kubectl_shell

$ kubectl get service deployment-example -o json

```

>bdocs-tab:curl `curl` Command (*requires `kubectl proxy` to be running*)

```bdocs-tab:curl_shell

$ kubectl proxy
$ curl -X GET http://127.0.0.1:8001/api/v1/namespaces/default/services/deployment-example

```

>bdocs-tab:kubectl Output

```bdocs-tab:kubectl_json

{
  "kind": "Service",
  "apiVersion": "v1",
  "metadata": {
    "name": "deployment-example",
    "namespace": "default",
    "selfLink": "/api/v1/namespaces/default/services/deployment-example",
    "uid": "93e5c731-9d30-11e6-9c54-42010a800148",
    "resourceVersion": "2205995",
    "creationTimestamp": "2016-10-28T17:04:24Z"
  },
  "spec": {
    "ports": [
      {
        "name": "http",
        "protocol": "TCP",
        "port": 80,
        "targetPort": 8080,
        "nodePort": 32417
      }
    ],
    "selector": {
      "app": "nginx"
    },
    "clusterIP": "10.183.250.161",
    "type": "LoadBalancer",
    "sessionAffinity": "None"
  },
  "status": {
    "loadBalancer": {
      "ingress": [
        {
          "ip": "104.198.186.106"
        }
      ]
    }
  }
}

```
>bdocs-tab:curl Response Body

```bdocs-tab:curl_json

{
  "kind": "Service",
  "apiVersion": "v1",
  "metadata": {
    "name": "deployment-example",
    "namespace": "default",
    "selfLink": "/api/v1/namespaces/default/services/deployment-example",
    "uid": "93e5c731-9d30-11e6-9c54-42010a800148",
    "resourceVersion": "2205995",
    "creationTimestamp": "2016-10-28T17:04:24Z"
  },
  "spec": {
    "ports": [
      {
        "name": "http",
        "protocol": "TCP",
        "port": 80,
        "targetPort": 8080,
        "nodePort": 32417
      }
    ],
    "selector": {
      "app": "nginx"
    },
    "clusterIP": "10.183.250.161",
    "type": "LoadBalancer",
    "sessionAffinity": "None"
  },
  "status": {
    "loadBalancer": {
      "ingress": [
        {
          "ip": "104.198.186.106"
        }
      ]
    }
  }
}

```



read the specified Service

### HTTP Request

`GET /api/v1/namespaces/{namespace}/services/{name}`

### Path Parameters

Parameter    | Description
------------ | -----------
name  | name of the Service
namespace  | object name and auth scope, such as for teams and projects
pretty  | If 'true', then the output is pretty printed.

### Query Parameters

Parameter    | Description
------------ | -----------
exact  | Should the export be exact.  Exact export maintains cluster-specific fields like 'Namespace'
export  | Should this value be exported.  Export strips fields that a user can not specify.

### Response

Code         | Description
------------ | -----------
200 <br /> *[Service](#service-v1)*  | OK


## List

>bdocs-tab:kubectl `kubectl` Command

```bdocs-tab:kubectl_shell

$ kubectl get service -o json

```

>bdocs-tab:curl `curl` Command (*requires `kubectl proxy` to be running*)

```bdocs-tab:curl_shell

$ kubectl proxy
$ curl -X GET 'http://127.0.0.1:8001/api/v1/namespaces/default/services'

```

>bdocs-tab:kubectl Output

```bdocs-tab:kubectl_json



```
>bdocs-tab:curl Response Body

```bdocs-tab:curl_json



```



list or watch objects of kind Service

### HTTP Request

`GET /api/v1/namespaces/{namespace}/services`

### Path Parameters

Parameter    | Description
------------ | -----------
namespace  | object name and auth scope, such as for teams and projects
pretty  | If 'true', then the output is pretty printed.

### Query Parameters

Parameter    | Description
------------ | -----------
fieldSelector  | A selector to restrict the list of returned objects by their fields. Defaults to everything.
labelSelector  | A selector to restrict the list of returned objects by their labels. Defaults to everything.
resourceVersion  | When specified with a watch call, shows changes that occur after that particular version of a resource. Defaults to changes from the beginning of history.
timeoutSeconds  | Timeout for the list/watch call.
watch  | Watch for changes to the described resources and return them as a stream of add, update, and remove notifications. Specify resourceVersion.

### Response

Code         | Description
------------ | -----------
200 <br /> *[ServiceList](#servicelist-v1)*  | OK


## List All Namespaces

>bdocs-tab:kubectl `kubectl` Command

```bdocs-tab:kubectl_shell

Coming Soon

```

>bdocs-tab:curl `curl` Command (*requires `kubectl proxy` to be running*)

```bdocs-tab:curl_shell

Coming Soon

```

>bdocs-tab:kubectl Output

```bdocs-tab:kubectl_json

Coming Soon

```
>bdocs-tab:curl Response Body

```bdocs-tab:curl_json

Coming Soon

```



list or watch objects of kind Service

### HTTP Request

`GET /api/v1/services`

### Path Parameters

Parameter    | Description
------------ | -----------
fieldSelector  | A selector to restrict the list of returned objects by their fields. Defaults to everything.
labelSelector  | A selector to restrict the list of returned objects by their labels. Defaults to everything.
pretty  | If 'true', then the output is pretty printed.
resourceVersion  | When specified with a watch call, shows changes that occur after that particular version of a resource. Defaults to changes from the beginning of history.
timeoutSeconds  | Timeout for the list/watch call.
watch  | Watch for changes to the described resources and return them as a stream of add, update, and remove notifications. Specify resourceVersion.


### Response

Code         | Description
------------ | -----------
200 <br /> *[ServiceList](#servicelist-v1)*  | OK


## Watch

>bdocs-tab:kubectl `kubectl` Command

```bdocs-tab:kubectl_shell

$ kubectl get service deployment-example --watch -o json

```

>bdocs-tab:curl `curl` Command (*requires `kubectl proxy` to be running*)

```bdocs-tab:curl_shell

$ kubectl proxy
$ curl -X GET 'http://127.0.0.1:8001/api/v1/watch/namespaces/default/services/deployment-example'

```

>bdocs-tab:kubectl Output

```bdocs-tab:kubectl_json

{
	"type": "ADDED",
	"object": {
		"kind": "Service",
		"apiVersion": "v1",
		"metadata": {
			"name": "deployment-example",
			"namespace": "default",
			"selfLink": "/api/v1/namespaces/default/services/deployment-example",
			"uid": "93e5c731-9d30-11e6-9c54-42010a800148",
			"resourceVersion": "2205995",
			"creationTimestamp": "2016-10-28T17:04:24Z"
		},
		"spec": {
			"ports": [
				{
					"name": "http",
					"protocol": "TCP",
					"port": 80,
					"targetPort": 8080,
					"nodePort": 32417
				}
			],
			"selector": {
				"app": "nginx"
			},
			"clusterIP": "10.183.250.161",
			"type": "LoadBalancer",
			"sessionAffinity": "None"
		},
		"status": {
			"loadBalancer": {
				"ingress": [
					{
						"ip": "104.198.186.106"
					}
				]
			}
		}
	}
}

```
>bdocs-tab:curl Response Body

```bdocs-tab:curl_json

{
	"type": "ADDED",
	"object": {
		"kind": "Service",
		"apiVersion": "v1",
		"metadata": {
			"name": "deployment-example",
			"namespace": "default",
			"selfLink": "/api/v1/namespaces/default/services/deployment-example",
			"uid": "93e5c731-9d30-11e6-9c54-42010a800148",
			"resourceVersion": "2205995",
			"creationTimestamp": "2016-10-28T17:04:24Z"
		},
		"spec": {
			"ports": [
				{
					"name": "http",
					"protocol": "TCP",
					"port": 80,
					"targetPort": 8080,
					"nodePort": 32417
				}
			],
			"selector": {
				"app": "nginx"
			},
			"clusterIP": "10.183.250.161",
			"type": "LoadBalancer",
			"sessionAffinity": "None"
		},
		"status": {
			"loadBalancer": {
				"ingress": [
					{
						"ip": "104.198.186.106"
					}
				]
			}
		}
	}
}

```



watch changes to an object of kind Service

### HTTP Request

`GET /api/v1/watch/namespaces/{namespace}/services/{name}`

### Path Parameters

Parameter    | Description
------------ | -----------
fieldSelector  | A selector to restrict the list of returned objects by their fields. Defaults to everything.
labelSelector  | A selector to restrict the list of returned objects by their labels. Defaults to everything.
name  | name of the Service
namespace  | object name and auth scope, such as for teams and projects
pretty  | If 'true', then the output is pretty printed.
resourceVersion  | When specified with a watch call, shows changes that occur after that particular version of a resource. Defaults to changes from the beginning of history.
timeoutSeconds  | Timeout for the list/watch call.
watch  | Watch for changes to the described resources and return them as a stream of add, update, and remove notifications. Specify resourceVersion.


### Response

Code         | Description
------------ | -----------
200 <br /> *[Event](#event-versioned)*  | OK


## Watch List

>bdocs-tab:kubectl `kubectl` Command

```bdocs-tab:kubectl_shell

Coming Soon

```

>bdocs-tab:curl `curl` Command (*requires `kubectl proxy` to be running*)

```bdocs-tab:curl_shell

Coming Soon

```

>bdocs-tab:kubectl Output

```bdocs-tab:kubectl_json

Coming Soon

```
>bdocs-tab:curl Response Body

```bdocs-tab:curl_json

Coming Soon

```



watch individual changes to a list of Service

### HTTP Request

`GET /api/v1/watch/namespaces/{namespace}/services`

### Path Parameters

Parameter    | Description
------------ | -----------
fieldSelector  | A selector to restrict the list of returned objects by their fields. Defaults to everything.
labelSelector  | A selector to restrict the list of returned objects by their labels. Defaults to everything.
namespace  | object name and auth scope, such as for teams and projects
pretty  | If 'true', then the output is pretty printed.
resourceVersion  | When specified with a watch call, shows changes that occur after that particular version of a resource. Defaults to changes from the beginning of history.
timeoutSeconds  | Timeout for the list/watch call.
watch  | Watch for changes to the described resources and return them as a stream of add, update, and remove notifications. Specify resourceVersion.


### Response

Code         | Description
------------ | -----------
200 <br /> *[Event](#event-versioned)*  | OK


## Watch List All Namespaces

>bdocs-tab:kubectl `kubectl` Command

```bdocs-tab:kubectl_shell

Coming Soon

```

>bdocs-tab:curl `curl` Command (*requires `kubectl proxy` to be running*)

```bdocs-tab:curl_shell

Coming Soon

```

>bdocs-tab:kubectl Output

```bdocs-tab:kubectl_json

Coming Soon

```
>bdocs-tab:curl Response Body

```bdocs-tab:curl_json

Coming Soon

```



watch individual changes to a list of Service

### HTTP Request

`GET /api/v1/watch/services`

### Path Parameters

Parameter    | Description
------------ | -----------
fieldSelector  | A selector to restrict the list of returned objects by their fields. Defaults to everything.
labelSelector  | A selector to restrict the list of returned objects by their labels. Defaults to everything.
pretty  | If 'true', then the output is pretty printed.
resourceVersion  | When specified with a watch call, shows changes that occur after that particular version of a resource. Defaults to changes from the beginning of history.
timeoutSeconds  | Timeout for the list/watch call.
watch  | Watch for changes to the described resources and return them as a stream of add, update, and remove notifications. Specify resourceVersion.


### Response

Code         | Description
------------ | -----------
200 <br /> *[Event](#event-versioned)*  | OK




