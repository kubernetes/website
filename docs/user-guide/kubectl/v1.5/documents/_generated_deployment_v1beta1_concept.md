

-----------
# Deployment v1beta1

>bdocs-tab:kubectl Deployment Config to run 3 nginx instances (max rollback set to 10 revisions).

```bdocs-tab:kubectl_yaml

apiVersion: extensions/v1beta1
kind: Deployment
metadata:
  # Unique key of the Deployment instance
  name: deployment-example
spec:
  # 3 Pods should exist at all times.
  replicas: 3
  # Keep record of 10 revisions for rollback
  revisionHistoryLimit: 10
  template:
    metadata:
      labels:
        # Apply this label to pods and default
        # the Deployment label selector to this value
        app: nginx
    spec:
      containers:
      - name: nginx
        # Run this image
        image: nginx:1.10


```
>bdocs-tab:curl Deployment Config to run 3 nginx instances (max rollback set to 10 revisions).

```bdocs-tab:curl_yaml

apiVersion: extensions/v1beta1
kind: Deployment
metadata:
  # Unique key of the Deployment instance
  name: deployment-example
spec:
  # 3 Pods should exist at all times.
  replicas: 3
  # Keep record of 10 revisions for rollback
  revisionHistoryLimit: 10
  template:
    metadata:
      labels:
        # Apply this label to pods and default
        # the Deployment label selector to this value
        app: nginx
    spec:
      containers:
      - name: nginx
        # Run this image
        image: nginx:1.10


```


Group        | Version     | Kind
------------ | ---------- | -----------
Extensions | v1beta1 | Deployment







Deployment enables declarative updates for Pods and ReplicaSets.

<aside class="notice">
Appears In <a href="#deploymentlist-v1beta1">DeploymentList</a> </aside>

Field        | Description
------------ | -----------
metadata <br /> *[ObjectMeta](#objectmeta-v1)*  | Standard object metadata.
spec <br /> *[DeploymentSpec](#deploymentspec-v1beta1)*  | Specification of the desired behavior of the Deployment.
status <br /> *[DeploymentStatus](#deploymentstatus-v1beta1)*  | Most recently observed status of the Deployment.


### DeploymentSpec v1beta1

<aside class="notice">
Appears In <a href="#deployment-v1beta1">Deployment</a> </aside>

Field        | Description
------------ | -----------
minReadySeconds <br /> *integer*  | Minimum number of seconds for which a newly created pod should be ready without any of its container crashing, for it to be considered available. Defaults to 0 (pod will be considered available as soon as it is ready)
paused <br /> *boolean*  | Indicates that the deployment is paused and will not be processed by the deployment controller.
progressDeadlineSeconds <br /> *integer*  | The maximum time in seconds for a deployment to make progress before it is considered to be failed. The deployment controller will continue to process failed deployments and a condition with a ProgressDeadlineExceeded reason will be surfaced in the deployment status. Once autoRollback is implemented, the deployment controller will automatically rollback failed deployments. Note that progress will not be estimated during the time a deployment is paused. This is not set by default.
replicas <br /> *integer*  | Number of desired pods. This is a pointer to distinguish between explicit zero and not specified. Defaults to 1.
revisionHistoryLimit <br /> *integer*  | The number of old ReplicaSets to retain to allow rollback. This is a pointer to distinguish between explicit zero and not specified.
rollbackTo <br /> *[RollbackConfig](#rollbackconfig-v1beta1)*  | The config this deployment is rolling back to. Will be cleared after rollback is done.
selector <br /> *[LabelSelector](#labelselector-unversioned)*  | Label selector for pods. Existing ReplicaSets whose pods are selected by this will be the ones affected by this deployment.
strategy <br /> *[DeploymentStrategy](#deploymentstrategy-v1beta1)*  | The deployment strategy to use to replace existing pods with new ones.
template <br /> *[PodTemplateSpec](#podtemplatespec-v1)*  | Template describes the pods that will be created.

### DeploymentStatus v1beta1

<aside class="notice">
Appears In <a href="#deployment-v1beta1">Deployment</a> </aside>

Field        | Description
------------ | -----------
availableReplicas <br /> *integer*  | Total number of available pods (ready for at least minReadySeconds) targeted by this deployment.
conditions <br /> *[DeploymentCondition](#deploymentcondition-v1beta1) array*  | Represents the latest available observations of a deployment's current state.
observedGeneration <br /> *integer*  | The generation observed by the deployment controller.
replicas <br /> *integer*  | Total number of non-terminated pods targeted by this deployment (their labels match the selector).
unavailableReplicas <br /> *integer*  | Total number of unavailable pods targeted by this deployment.
updatedReplicas <br /> *integer*  | Total number of non-terminated pods targeted by this deployment that have the desired template spec.

### DeploymentList v1beta1



Field        | Description
------------ | -----------
items <br /> *[Deployment](#deployment-v1beta1) array*  | Items is the list of Deployments.
metadata <br /> *[ListMeta](#listmeta-unversioned)*  | Standard list metadata.

### DeploymentStrategy v1beta1

<aside class="notice">
Appears In <a href="#deploymentspec-v1beta1">DeploymentSpec</a> </aside>

Field        | Description
------------ | -----------
rollingUpdate <br /> *[RollingUpdateDeployment](#rollingupdatedeployment-v1beta1)*  | Rolling update config params. Present only if DeploymentStrategyType = RollingUpdate.
type <br /> *string*  | Type of deployment. Can be "Recreate" or "RollingUpdate". Default is RollingUpdate.

### DeploymentRollback v1beta1



Field        | Description
------------ | -----------
name <br /> *string*  | Required: This must match the Name of a deployment.
rollbackTo <br /> *[RollbackConfig](#rollbackconfig-v1beta1)*  | The config of this deployment rollback.
updatedAnnotations <br /> *object*  | The annotations to be updated to a deployment

### RollingUpdateDeployment v1beta1

<aside class="notice">
Appears In <a href="#deploymentstrategy-v1beta1">DeploymentStrategy</a> </aside>

Field        | Description
------------ | -----------
maxSurge <br /> *[IntOrString](#intorstring-intstr)*  | The maximum number of pods that can be scheduled above the desired number of pods. Value can be an absolute number (ex: 5) or a percentage of desired pods (ex: 10%). This can not be 0 if MaxUnavailable is 0. Absolute number is calculated from percentage by rounding up. By default, a value of 1 is used. Example: when this is set to 30%, the new RC can be scaled up immediately when the rolling update starts, such that the total number of old and new pods do not exceed 130% of desired pods. Once old pods have been killed, new RC can be scaled up further, ensuring that total number of pods running at any time during the update is atmost 130% of desired pods.
maxUnavailable <br /> *[IntOrString](#intorstring-intstr)*  | The maximum number of pods that can be unavailable during the update. Value can be an absolute number (ex: 5) or a percentage of desired pods (ex: 10%). Absolute number is calculated from percentage by rounding up. This can not be 0 if MaxSurge is 0. By default, a fixed value of 1 is used. Example: when this is set to 30%, the old RC can be scaled down to 70% of desired pods immediately when the rolling update starts. Once new pods are ready, old RC can be scaled down further, followed by scaling up the new RC, ensuring that the total number of pods available at all times during the update is at least 70% of desired pods.




## <strong>Write Operations</strong>

See supported operations below...

## Create

>bdocs-tab:kubectl `kubectl` Command

```bdocs-tab:kubectl_shell

$ echo 'apiVersion: extensions/v1beta1
kind: Deployment
metadata:
  name: deployment-example
spec:
  replicas: 3
  revisionHistoryLimit: 10
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx:1.10
        ports:
        - containerPort: 80
' | kubectl create -f -

```

>bdocs-tab:curl `curl` Command (*requires `kubectl proxy` to be running*)

```bdocs-tab:curl_shell

$ kubectl proxy
$ curl -X POST -H 'Content-Type: application/yaml' --data '
apiVersion: extensions/v1beta1
kind: Deployment
metadata:
  name: deployment-example
spec:
  replicas: 3
  revisionHistoryLimit: 10
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx:1.10
        ports:
        - containerPort: 80
' http://127.0.0.1:8001/apis/extensions/v1beta1/namespaces/default/deployments

```

>bdocs-tab:kubectl Output

```bdocs-tab:kubectl_json

deployment "deployment-example" created

```
>bdocs-tab:curl Response Body

```bdocs-tab:curl_json

{
  "kind": "Deployment",
  "apiVersion": "extensions/v1beta1",
  "metadata": {
    "name": "deployment-example",
    "namespace": "default",
    "selfLink": "/apis/extensions/v1beta1/namespaces/default/deployments/deployment-example",
    "uid": "4ccca349-9cb1-11e6-9c54-42010a800148",
    "resourceVersion": "2118306",
    "generation": 1,
    "creationTimestamp": "2016-10-28T01:53:19Z",
    "labels": {
      "app": "nginx"
    }
  },
  "spec": {
    "replicas": 3,
    "selector": {
      "matchLabels": {
        "app": "nginx"
      }
    },
    "template": {
      "metadata": {
        "creationTimestamp": null,
        "labels": {
          "app": "nginx"
        }
      },
      "spec": {
        "containers": [
          {
            "name": "nginx",
            "image": "nginx:1.10",
            "ports": [
              {
                "containerPort": 80,
                "protocol": "TCP"
              }
            ],
            "resources": {},
            "terminationMessagePath": "/dev/termination-log",
            "imagePullPolicy": "IfNotPresent"
          }
        ],
        "restartPolicy": "Always",
        "terminationGracePeriodSeconds": 30,
        "dnsPolicy": "ClusterFirst",
        "securityContext": {}
      }
    },
    "strategy": {
      "type": "RollingUpdate",
      "rollingUpdate": {
        "maxUnavailable": 1,
        "maxSurge": 1
      }
    },
    "revisionHistoryLimit": 10
  },
  "status": {}
}

```



create a Deployment

### HTTP Request

`POST /apis/extensions/v1beta1/namespaces/{namespace}/deployments`

### Path Parameters

Parameter    | Description
------------ | -----------
namespace  | object name and auth scope, such as for teams and projects
pretty  | If 'true', then the output is pretty printed.

### Query Parameters

Parameter    | Description
------------ | -----------
body <br /> *[Deployment](#deployment-v1beta1)*  | 

### Response

Code         | Description
------------ | -----------
200 <br /> *[Deployment](#deployment-v1beta1)*  | OK


## Replace

>bdocs-tab:kubectl `kubectl` Command

```bdocs-tab:kubectl_shell

$ echo 'apiVersion: extensions/v1beta1
kind: Deployment
metadata:
  name: deployment-example
spec:
  replicas: 3
  revisionHistoryLimit: 10
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx:1.11
        ports:
        - containerPort: 80
' | kubectl replace -f -

```

>bdocs-tab:curl `curl` Command (*requires `kubectl proxy` to be running*)

```bdocs-tab:curl_shell

$ kubectl proxy
$ curl -X PUT -H 'Content-Type: application/yaml' --data '
apiVersion: extensions/v1beta1
kind: Deployment
metadata:
  name: deployment-example
spec:
  replicas: 3
  revisionHistoryLimit: 10
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx:1.11
        ports:
        - containerPort: 80
' http://127.0.0.1:8001/apis/extensions/v1beta1/namespaces/default/deployments/deployment-example

```

>bdocs-tab:kubectl Output

```bdocs-tab:kubectl_json

deployment "deployment-example" replaced

```
>bdocs-tab:curl Response Body

```bdocs-tab:curl_json

{
  "kind": "Deployment",
  "apiVersion": "extensions/v1beta1",
  "metadata": {
    "name": "deployment-example",
    "namespace": "default",
    "selfLink": "/apis/extensions/v1beta1/namespaces/default/deployments/deployment-example",
    "uid": "4ccca349-9cb1-11e6-9c54-42010a800148",
    "resourceVersion": "2119082",
    "generation": 5,
    "creationTimestamp": "2016-10-28T01:53:19Z",
    "labels": {
      "app": "nginx"
    }
  },
  "spec": {
    "replicas": 3,
    "selector": {
      "matchLabels": {
        "app": "nginx"
      }
    },
    "template": {
      "metadata": {
        "creationTimestamp": null,
        "labels": {
          "app": "nginx"
        }
      },
      "spec": {
        "containers": [
          {
            "name": "nginx",
            "image": "nginx:1.11",
            "ports": [
              {
                "containerPort": 80,
                "protocol": "TCP"
              }
            ],
            "resources": {},
            "terminationMessagePath": "/dev/termination-log",
            "imagePullPolicy": "IfNotPresent"
          }
        ],
        "restartPolicy": "Always",
        "terminationGracePeriodSeconds": 30,
        "dnsPolicy": "ClusterFirst",
        "securityContext": {}
      }
    },
    "strategy": {
      "type": "RollingUpdate",
      "rollingUpdate": {
        "maxUnavailable": 1,
        "maxSurge": 1
      }
    },
    "revisionHistoryLimit": 10
  },
  "status": {
    "observedGeneration": 4,
    "replicas": 3,
    "updatedReplicas": 3,
    "availableReplicas": 3
  }
}


```



replace the specified Deployment

### HTTP Request

`PUT /apis/extensions/v1beta1/namespaces/{namespace}/deployments/{name}`

### Path Parameters

Parameter    | Description
------------ | -----------
name  | name of the Deployment
namespace  | object name and auth scope, such as for teams and projects
pretty  | If 'true', then the output is pretty printed.

### Query Parameters

Parameter    | Description
------------ | -----------
body <br /> *[Deployment](#deployment-v1beta1)*  | 

### Response

Code         | Description
------------ | -----------
200 <br /> *[Deployment](#deployment-v1beta1)*  | OK


## Patch

>bdocs-tab:kubectl `kubectl` Command

```bdocs-tab:kubectl_shell

$ kubectl patch deployment deployment-example -p \
	'{"spec":{"template":{"spec":{"containers":[{"name":"nginx","image":"nginx:1.11"}]}}}}'

```

>bdocs-tab:curl `curl` Command (*requires `kubectl proxy` to be running*)

```bdocs-tab:curl_shell

$ kubectl proxy
$ curl -X PATCH -H 'Content-Type: application/strategic-merge-patch+json' --data '
{"spec":{"template":{"spec":{"containers":[{"name":"nginx","image":"nginx:1.11"}]}}}}' \
	'http://127.0.0.1:8001/apis/extensions/v1beta1/namespaces/default/deployments/deployment-example'

```

>bdocs-tab:kubectl Output

```bdocs-tab:kubectl_json

"deployment-example" patched

```
>bdocs-tab:curl Response Body

```bdocs-tab:curl_json

{
  "kind": "Deployment",
  "apiVersion": "extensions/v1beta1",
  "metadata": {
    "name": "deployment-example",
    "namespace": "default",
    "selfLink": "/apis/extensions/v1beta1/namespaces/default/deployments/deployment-example",
    "uid": "5dc3a8e6-b0ee-11e6-aef0-42010af00229",
    "resourceVersion": "164489",
    "generation": 11,
    "creationTimestamp": "2016-11-22T20:00:50Z",
    "labels": {
      "app": "nginx"
    },
    "annotations": {
      "deployment.kubernetes.io/revision": "5"
    }
  },
  "spec": {
    "replicas": 3,
    "selector": {
      "matchLabels": {
        "app": "nginx"
      }
    },
    "template": {
      "metadata": {
        "creationTimestamp": null,
        "labels": {
          "app": "nginx"
        }
      },
      "spec": {
        "containers": [
          {
            "name": "nginx",
            "image": "nginx:1.11",
            "ports": [
              {
                "containerPort": 80,
                "protocol": "TCP"
              }
            ],
            "resources": {},
            "terminationMessagePath": "/dev/termination-log",
            "imagePullPolicy": "IfNotPresent"
          }
        ],
        "restartPolicy": "Always",
        "terminationGracePeriodSeconds": 30,
        "dnsPolicy": "ClusterFirst",
        "securityContext": {}
      }
    },
    "strategy": {
      "type": "RollingUpdate",
      "rollingUpdate": {
        "maxUnavailable": 1,
        "maxSurge": 1
      }
    },
    "revisionHistoryLimit": 10
  },
  "status": {
    "observedGeneration": 10,
    "replicas": 3,
    "updatedReplicas": 3,
    "availableReplicas": 3
  }
}


```



partially update the specified Deployment

### HTTP Request

`PATCH /apis/extensions/v1beta1/namespaces/{namespace}/deployments/{name}`

### Path Parameters

Parameter    | Description
------------ | -----------
name  | name of the Deployment
namespace  | object name and auth scope, such as for teams and projects
pretty  | If 'true', then the output is pretty printed.

### Query Parameters

Parameter    | Description
------------ | -----------
body <br /> *[Patch](#patch-unversioned)*  | 

### Response

Code         | Description
------------ | -----------
200 <br /> *[Deployment](#deployment-v1beta1)*  | OK


## Delete

>bdocs-tab:kubectl `kubectl` Command

```bdocs-tab:kubectl_shell

$ kubectl delete deployment deployment-example

```

>bdocs-tab:curl `curl` Command (*requires `kubectl proxy` to be running*)

```bdocs-tab:curl_shell

$ kubectl proxy
$ curl -X DELETE -H 'Content-Type: application/yaml' --data '
gracePeriodSeconds: 0
orphanDependents: false
' 'http://127.0.0.1:8001/apis/extensions/v1beta1/namespaces/default/deployments/deployment-example'

```

>bdocs-tab:kubectl Output

```bdocs-tab:kubectl_json

deployment "deployment-example" deleted

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



delete a Deployment

### HTTP Request

`DELETE /apis/extensions/v1beta1/namespaces/{namespace}/deployments/{name}`

### Path Parameters

Parameter    | Description
------------ | -----------
name  | name of the Deployment
namespace  | object name and auth scope, such as for teams and projects
pretty  | If 'true', then the output is pretty printed.

### Query Parameters

Parameter    | Description
------------ | -----------
body <br /> *[DeleteOptions](#deleteoptions-v1)*  | 
gracePeriodSeconds  | The duration in seconds before the object should be deleted. Value must be non-negative integer. The value zero indicates delete immediately. If this value is nil, the default grace period for the specified type will be used. Defaults to a per object value if not specified. zero means delete immediately.
orphanDependents  | Should the dependent objects be orphaned. If true/false, the "orphan" finalizer will be added to/removed from the object's finalizers list.

### Response

Code         | Description
------------ | -----------
200 <br /> *[Status](#status-unversioned)*  | OK


## Delete Collection

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



delete collection of Deployment

### HTTP Request

`DELETE /apis/extensions/v1beta1/namespaces/{namespace}/deployments`

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
200 <br /> *[Status](#status-unversioned)*  | OK



## <strong>Read Operations</strong>

See supported operations below...

## Read

>bdocs-tab:kubectl `kubectl` Command

```bdocs-tab:kubectl_shell

$ kubectl get deployment deployment-example -o json

```

>bdocs-tab:curl `curl` Command (*requires `kubectl proxy` to be running*)

```bdocs-tab:curl_shell

$ kubectl proxy
$ curl -X GET http://127.0.0.1:8001/apis/extensions/v1beta1/namespaces/default/deployments/deployment-example

```

>bdocs-tab:kubectl Output

```bdocs-tab:kubectl_json

{
  "kind": "Deployment",
  "apiVersion": "extensions/v1beta1",
  "metadata": {
    "name": "deployment-example",
    "namespace": "default",
    "selfLink": "/apis/extensions/v1beta1/namespaces/default/deployments/deployment-example",
    "uid": "1b33145a-9c63-11e6-9c54-42010a800148",
    "resourceVersion": "2064726",
    "generation": 4,
    "creationTimestamp": "2016-10-27T16:33:35Z",
    "labels": {
      "app": "nginx"
    },
    "annotations": {
      "deployment.kubernetes.io/revision": "1"
    }
  },
  "spec": {
    "replicas": 3,
    "selector": {
      "matchLabels": {
        "app": "nginx"
      }
    },
    "template": {
      "metadata": {
        "creationTimestamp": null,
        "labels": {
          "app": "nginx"
        }
      },
      "spec": {
        "containers": [
          {
            "name": "nginx",
            "image": "nginx:1.10",
            "ports": [
              {
                "containerPort": 80,
                "protocol": "TCP"
              }
            ],
            "resources": {},
            "terminationMessagePath": "/dev/termination-log",
            "imagePullPolicy": "IfNotPresent"
          }
        ],
        "restartPolicy": "Always",
        "terminationGracePeriodSeconds": 30,
        "dnsPolicy": "ClusterFirst",
        "securityContext": {}
      }
    },
    "strategy": {
      "type": "RollingUpdate",
      "rollingUpdate": {
        "maxUnavailable": 1,
        "maxSurge": 1
      }
    }
  },
  "status": {
    "observedGeneration": 4,
    "replicas": 3,
    "updatedReplicas": 3,
    "availableReplicas": 3
  }
}


```
>bdocs-tab:curl Response Body

```bdocs-tab:curl_json

{
  "kind": "Deployment",
  "apiVersion": "extensions/v1beta1",
  "metadata": {
    "name": "deployment-example",
    "namespace": "default",
    "selfLink": "/apis/extensions/v1beta1/namespaces/default/deployments/deployment-example",
    "uid": "1b33145a-9c63-11e6-9c54-42010a800148",
    "resourceVersion": "2064726",
    "generation": 4,
    "creationTimestamp": "2016-10-27T16:33:35Z",
    "labels": {
      "app": "nginx"
    },
    "annotations": {
      "deployment.kubernetes.io/revision": "1"
    }
  },
  "spec": {
    "replicas": 3,
    "selector": {
      "matchLabels": {
        "app": "nginx"
      }
    },
    "template": {
      "metadata": {
        "creationTimestamp": null,
        "labels": {
          "app": "nginx"
        }
      },
      "spec": {
        "containers": [
          {
            "name": "nginx",
            "image": "nginx:1.10",
            "ports": [
              {
                "containerPort": 80,
                "protocol": "TCP"
              }
            ],
            "resources": {},
            "terminationMessagePath": "/dev/termination-log",
            "imagePullPolicy": "IfNotPresent"
          }
        ],
        "restartPolicy": "Always",
        "terminationGracePeriodSeconds": 30,
        "dnsPolicy": "ClusterFirst",
        "securityContext": {}
      }
    },
    "strategy": {
      "type": "RollingUpdate",
      "rollingUpdate": {
        "maxUnavailable": 1,
        "maxSurge": 1
      }
    }
  },
  "status": {
    "observedGeneration": 4,
    "replicas": 3,
    "updatedReplicas": 3,
    "availableReplicas": 3
  }
}


```



read the specified Deployment

### HTTP Request

`GET /apis/extensions/v1beta1/namespaces/{namespace}/deployments/{name}`

### Path Parameters

Parameter    | Description
------------ | -----------
name  | name of the Deployment
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
200 <br /> *[Deployment](#deployment-v1beta1)*  | OK


## List

>bdocs-tab:kubectl `kubectl` Command

```bdocs-tab:kubectl_shell

$ kubectl get deployment -o json

```

>bdocs-tab:curl `curl` Command (*requires `kubectl proxy` to be running*)

```bdocs-tab:curl_shell

$ kubectl proxy
$ curl -X GET 'http://127.0.0.1:8001/apis/extensions/v1beta1/namespaces/default/deployments'

```

>bdocs-tab:kubectl Output

```bdocs-tab:kubectl_json

{
  "kind": "List",
  "apiVersion": "v1",
  "metadata": {},
  "items": [
    {
      "kind": "Deployment",
      "apiVersion": "extensions/v1beta1",
      "metadata": {
        "name": "docs",
        "namespace": "default",
        "selfLink": "/apis/extensions/v1beta1/namespaces/default/deployments/docs",
        "uid": "ef49e1d2-915e-11e6-be81-42010a80003f",
        "resourceVersion": "1924126",
        "generation": 21,
        "creationTimestamp": "2016-10-13T16:06:00Z",
        "labels": {
          "run": "docs"
        },
        "annotations": {
          "deployment.kubernetes.io/revision": "10",
          "replicatingperfection.net/push-image": "true"
        }
      },
      "spec": {
        "replicas": 1,
        "selector": {
          "matchLabels": {
            "run": "docs"
          }
        },
        "template": {
          "metadata": {
            "creationTimestamp": null,
            "labels": {
              "auto-pushed-image-pwittrock/api-docs": "1477496453",
              "run": "docs"
            }
          },
          "spec": {
            "containers": [
              {
                "name": "docs",
                "image": "pwittrock/api-docs:v9",
                "resources": {},
                "terminationMessagePath": "/dev/termination-log",
                "imagePullPolicy": "Always"
              }
            ],
            "restartPolicy": "Always",
            "terminationGracePeriodSeconds": 30,
            "dnsPolicy": "ClusterFirst",
            "securityContext": {}
          }
        },
        "strategy": {
          "type": "RollingUpdate",
          "rollingUpdate": {
            "maxUnavailable": 1,
            "maxSurge": 1
          }
        }
      },
      "status": {
        "observedGeneration": 21,
        "replicas": 1,
        "updatedReplicas": 1,
        "availableReplicas": 1
      }
    },
    {
      "kind": "Deployment",
      "apiVersion": "extensions/v1beta1",
      "metadata": {
        "name": "deployment-example",
        "namespace": "default",
        "selfLink": "/apis/extensions/v1beta1/namespaces/default/deployments/deployment-example",
        "uid": "1b33145a-9c63-11e6-9c54-42010a800148",
        "resourceVersion": "2064726",
        "generation": 4,
        "creationTimestamp": "2016-10-27T16:33:35Z",
        "labels": {
          "app": "nginx"
        },
        "annotations": {
          "deployment.kubernetes.io/revision": "1"
        }
      },
      "spec": {
        "replicas": 3,
        "selector": {
          "matchLabels": {
            "app": "nginx"
          }
        },
        "template": {
          "metadata": {
            "creationTimestamp": null,
            "labels": {
              "app": "nginx"
            }
          },
          "spec": {
            "containers": [
              {
                "name": "nginx",
                "image": "nginx:1.10",
                "ports": [
                  {
                    "containerPort": 80,
                    "protocol": "TCP"
                  }
                ],
                "resources": {},
                "terminationMessagePath": "/dev/termination-log",
                "imagePullPolicy": "IfNotPresent"
              }
            ],
            "restartPolicy": "Always",
            "terminationGracePeriodSeconds": 30,
            "dnsPolicy": "ClusterFirst",
            "securityContext": {}
          }
        },
        "strategy": {
          "type": "RollingUpdate",
          "rollingUpdate": {
            "maxUnavailable": 1,
            "maxSurge": 1
          }
        }
      },
      "status": {
        "observedGeneration": 4,
        "replicas": 3,
        "updatedReplicas": 3,
        "availableReplicas": 3
      }
    }
  ]
}


```
>bdocs-tab:curl Response Body

```bdocs-tab:curl_json

{
  "kind": "List",
  "apiVersion": "v1",
  "metadata": {},
  "items": [
    {
      "kind": "Deployment",
      "apiVersion": "extensions/v1beta1",
      "metadata": {
        "name": "docs",
        "namespace": "default",
        "selfLink": "/apis/extensions/v1beta1/namespaces/default/deployments/docs",
        "uid": "ef49e1d2-915e-11e6-be81-42010a80003f",
        "resourceVersion": "1924126",
        "generation": 21,
        "creationTimestamp": "2016-10-13T16:06:00Z",
        "labels": {
          "run": "docs"
        },
        "annotations": {
          "deployment.kubernetes.io/revision": "10",
          "replicatingperfection.net/push-image": "true"
        }
      },
      "spec": {
        "replicas": 1,
        "selector": {
          "matchLabels": {
            "run": "docs"
          }
        },
        "template": {
          "metadata": {
            "creationTimestamp": null,
            "labels": {
              "auto-pushed-image-pwittrock/api-docs": "1477496453",
              "run": "docs"
            }
          },
          "spec": {
            "containers": [
              {
                "name": "docs",
                "image": "pwittrock/api-docs:v9",
                "resources": {},
                "terminationMessagePath": "/dev/termination-log",
                "imagePullPolicy": "Always"
              }
            ],
            "restartPolicy": "Always",
            "terminationGracePeriodSeconds": 30,
            "dnsPolicy": "ClusterFirst",
            "securityContext": {}
          }
        },
        "strategy": {
          "type": "RollingUpdate",
          "rollingUpdate": {
            "maxUnavailable": 1,
            "maxSurge": 1
          }
        }
      },
      "status": {
        "observedGeneration": 21,
        "replicas": 1,
        "updatedReplicas": 1,
        "availableReplicas": 1
      }
    },
    {
      "kind": "Deployment",
      "apiVersion": "extensions/v1beta1",
      "metadata": {
        "name": "deployment-example",
        "namespace": "default",
        "selfLink": "/apis/extensions/v1beta1/namespaces/default/deployments/deployment-example",
        "uid": "1b33145a-9c63-11e6-9c54-42010a800148",
        "resourceVersion": "2064726",
        "generation": 4,
        "creationTimestamp": "2016-10-27T16:33:35Z",
        "labels": {
          "app": "nginx"
        },
        "annotations": {
          "deployment.kubernetes.io/revision": "1"
        }
      },
      "spec": {
        "replicas": 3,
        "selector": {
          "matchLabels": {
            "app": "nginx"
          }
        },
        "template": {
          "metadata": {
            "creationTimestamp": null,
            "labels": {
              "app": "nginx"
            }
          },
          "spec": {
            "containers": [
              {
                "name": "nginx",
                "image": "nginx:1.10",
                "ports": [
                  {
                    "containerPort": 80,
                    "protocol": "TCP"
                  }
                ],
                "resources": {},
                "terminationMessagePath": "/dev/termination-log",
                "imagePullPolicy": "IfNotPresent"
              }
            ],
            "restartPolicy": "Always",
            "terminationGracePeriodSeconds": 30,
            "dnsPolicy": "ClusterFirst",
            "securityContext": {}
          }
        },
        "strategy": {
          "type": "RollingUpdate",
          "rollingUpdate": {
            "maxUnavailable": 1,
            "maxSurge": 1
          }
        }
      },
      "status": {
        "observedGeneration": 4,
        "replicas": 3,
        "updatedReplicas": 3,
        "availableReplicas": 3
      }
    }
  ]
}


```



list or watch objects of kind Deployment

### HTTP Request

`GET /apis/extensions/v1beta1/namespaces/{namespace}/deployments`

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
200 <br /> *[DeploymentList](#deploymentlist-v1beta1)*  | OK


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



list or watch objects of kind Deployment

### HTTP Request

`GET /apis/extensions/v1beta1/deployments`

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
200 <br /> *[DeploymentList](#deploymentlist-v1beta1)*  | OK


## Watch

>bdocs-tab:kubectl `kubectl` Command

```bdocs-tab:kubectl_shell

$ kubectl get deployment deployment-example --watch -o json

```

>bdocs-tab:curl `curl` Command (*requires `kubectl proxy` to be running*)

```bdocs-tab:curl_shell

$ kubectl proxy
$ curl -X GET 'http://127.0.0.1:8001/apis/extensions/v1beta1/watch/namespaces/default/deployments/deployment-example'

```

>bdocs-tab:kubectl Output

```bdocs-tab:kubectl_json

{
	"type": "ADDED",
	"object": {
		"kind": "Deployment",
		"apiVersion": "extensions/v1beta1",
		"metadata": {
			"name": "deployment-example",
			"namespace": "default",
			"selfLink": "/apis/extensions/v1beta1/namespaces/default/deployments/deployment-example",
			"uid": "64c12290-9cbf-11e6-9c54-42010a800148",
			"resourceVersion": "2128095",
			"generation": 2,
			"creationTimestamp": "2016-10-28T03:34:12Z",
			"labels": {
				"app": "nginx"
			},
			"annotations": {
				"deployment.kubernetes.io/revision": "3"
			}
		},
		"spec": {
			"replicas": 3,
			"selector": {
				"matchLabels": {
					"app": "nginx"
				}
			},
			"template": {
				"metadata": {
					"creationTimestamp": null,
					"labels": {
						"app": "nginx"
					}
				},
				"spec": {
					"containers": [
						{
							"name": "nginx",
							"image": "nginx:1.10",
							"ports": [
								{
									"containerPort": 80,
									"protocol": "TCP"
								}
							],
							"resources": {
							},
							"terminationMessagePath": "/dev/termination-log",
							"imagePullPolicy": "IfNotPresent"
						}
					],
					"restartPolicy": "Always",
					"terminationGracePeriodSeconds": 30,
					"dnsPolicy": "ClusterFirst",
					"securityContext": {
					}
				}
			},
			"strategy": {
				"type": "RollingUpdate",
				"rollingUpdate": {
					"maxUnavailable": 1,
					"maxSurge": 1
				}
			}
		},
		"status": {
			"observedGeneration": 2,
			"replicas": 3,
			"updatedReplicas": 3,
			"availableReplicas": 3
		}
	}
}

```
>bdocs-tab:curl Response Body

```bdocs-tab:curl_json

{
	"type": "ADDED",
	"object": {
		"kind": "Deployment",
		"apiVersion": "extensions/v1beta1",
		"metadata": {
			"name": "deployment-example",
			"namespace": "default",
			"selfLink": "/apis/extensions/v1beta1/namespaces/default/deployments/deployment-example",
			"uid": "64c12290-9cbf-11e6-9c54-42010a800148",
			"resourceVersion": "2128095",
			"generation": 2,
			"creationTimestamp": "2016-10-28T03:34:12Z",
			"labels": {
				"app": "nginx"
			},
			"annotations": {
				"deployment.kubernetes.io/revision": "3"
			}
		},
		"spec": {
			"replicas": 3,
			"selector": {
				"matchLabels": {
					"app": "nginx"
				}
			},
			"template": {
				"metadata": {
					"creationTimestamp": null,
					"labels": {
						"app": "nginx"
					}
				},
				"spec": {
					"containers": [
						{
							"name": "nginx",
							"image": "nginx:1.10",
							"ports": [
								{
									"containerPort": 80,
									"protocol": "TCP"
								}
							],
							"resources": {
							},
							"terminationMessagePath": "/dev/termination-log",
							"imagePullPolicy": "IfNotPresent"
						}
					],
					"restartPolicy": "Always",
					"terminationGracePeriodSeconds": 30,
					"dnsPolicy": "ClusterFirst",
					"securityContext": {
					}
				}
			},
			"strategy": {
				"type": "RollingUpdate",
				"rollingUpdate": {
					"maxUnavailable": 1,
					"maxSurge": 1
				}
			}
		},
		"status": {
			"observedGeneration": 2,
			"replicas": 3,
			"updatedReplicas": 3,
			"availableReplicas": 3
		}
	}
}

```



watch changes to an object of kind Deployment

### HTTP Request

`GET /apis/extensions/v1beta1/watch/namespaces/{namespace}/deployments/{name}`

### Path Parameters

Parameter    | Description
------------ | -----------
fieldSelector  | A selector to restrict the list of returned objects by their fields. Defaults to everything.
labelSelector  | A selector to restrict the list of returned objects by their labels. Defaults to everything.
name  | name of the Deployment
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



watch individual changes to a list of Deployment

### HTTP Request

`GET /apis/extensions/v1beta1/watch/namespaces/{namespace}/deployments`

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



watch individual changes to a list of Deployment

### HTTP Request

`GET /apis/extensions/v1beta1/watch/deployments`

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



## <strong>Misc Operations</strong>

See supported operations below...

## Read Scale

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



read scale of the specified Scale

### HTTP Request

`GET /apis/extensions/v1beta1/namespaces/{namespace}/deployments/{name}/scale`

### Path Parameters

Parameter    | Description
------------ | -----------
name  | name of the Scale
namespace  | object name and auth scope, such as for teams and projects
pretty  | If 'true', then the output is pretty printed.


### Response

Code         | Description
------------ | -----------
200 <br /> *[Scale](#scale-v1beta1)*  | OK


## Replace Scale

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



replace scale of the specified Scale

### HTTP Request

`PUT /apis/extensions/v1beta1/namespaces/{namespace}/deployments/{name}/scale`

### Path Parameters

Parameter    | Description
------------ | -----------
name  | name of the Scale
namespace  | object name and auth scope, such as for teams and projects
pretty  | If 'true', then the output is pretty printed.

### Query Parameters

Parameter    | Description
------------ | -----------
body <br /> *[Scale](#scale-v1beta1)*  | 

### Response

Code         | Description
------------ | -----------
200 <br /> *[Scale](#scale-v1beta1)*  | OK


## Patch Scale

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



partially update scale of the specified Scale

### HTTP Request

`PATCH /apis/extensions/v1beta1/namespaces/{namespace}/deployments/{name}/scale`

### Path Parameters

Parameter    | Description
------------ | -----------
name  | name of the Scale
namespace  | object name and auth scope, such as for teams and projects
pretty  | If 'true', then the output is pretty printed.

### Query Parameters

Parameter    | Description
------------ | -----------
body <br /> *[Patch](#patch-unversioned)*  | 

### Response

Code         | Description
------------ | -----------
200 <br /> *[Scale](#scale-v1beta1)*  | OK


## Rollback

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



create rollback of a DeploymentRollback

### HTTP Request

`POST /apis/extensions/v1beta1/namespaces/{namespace}/deployments/{name}/rollback`

### Path Parameters

Parameter    | Description
------------ | -----------
body <br /> *[DeploymentRollback](#deploymentrollback-v1beta1)*  | 
name  | name of the DeploymentRollback
namespace  | object name and auth scope, such as for teams and projects
pretty  | If 'true', then the output is pretty printed.


### Response

Code         | Description
------------ | -----------
200 <br /> *[DeploymentRollback](#deploymentrollback-v1beta1)*  | OK




