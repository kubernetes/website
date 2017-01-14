
// bdocs: start page linked to by "Deployment" in Table of Contents
// (left-most pane)

---
# Deployment v1beta1

Group        | Version     | Kind
------------ | ---------- | -----------
Extensions | v1beta1 | Deployment

////////////////////// TAB KUBECTL /////////////////////////////////////
//////// bdocs: Start defining tab sections first

//////// bdocs: Code starting here appears on tab "kubectl" adjacent to the
//////// description "Deployment enables declarative updates for Pods and ReplicaSets."
//////// because that is the next non-tab code to appear after this
//////// "bdocs-tab:kubectl" as a tag is TBD by @birdrock
//////// Format shown here is `<tag>:<tab-id>`
//////// This uses a codeblock highlighting

 > bdocs-tab:kubectl Deployment Config to run 3 nginx instances (max rollback set to 10 revisions). 

//////// bdocs: This tag closes the kubectl tab code section.  The code following
//////// is included in the tab, but closes the group so future code will not be
//////// Format shown here is `/<tag>:<tab-id> <syntax-highlight>`
//////// '/' closes the section
//////// This uses "yaml" highlighting

```/bdocs-tab:kubectl yaml
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

```

//////// bdocs: kubectl tab section closed for now
/////////////////// END TAB KUBECTL /////////////////////////////////////

//////////////////////////// TAB CURL //////////////////////////////////
//////// bdocs: Code starting here appears on tab "curl" adjacent to the
//////// description "Deployment enables declarative updates for Pods and ReplicaSets."
//////// "bdocs-tab:curl" as a tag is TBD by @birdrock
//////// This uses a codeblock highlighting

 > bdocs-tab:curl Deployment Config to run 3 nginx instances (max rollback set to 10 revisions). 

//////// bdocs: This tag closes the curl tab code section.  The code following
//////// remains in the tab, but closes the group
//////// This uses "yaml" highlighting

```/bdocs-tab:curl yaml
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

```

//////// bdocs: curl tab section closed for now
/////////////////////////// END TAB CURL ///////////////////////////////

//////// bdocs: Start middle pane (non-tab) section

Deployment enables declarative updates for Pods and ReplicaSets.

<aside class="notice">
Appears In <a href="#deploymentlist-v1beta1">DeploymentList</a> </aside>

Field        | Schema     | Description
------------ | ---------- | -----------
metadata | [ObjectMeta](#objectmeta-v1) | Standard object metadata.
spec | [DeploymentSpec](#deploymentspec-v1beta1) | Specification of the desired behavior of the Deployment.
status | [DeploymentStatus](#deploymentstatus-v1beta1) | Most recently observed status of the Deployment.


### DeploymentSpec v1beta1

<aside class="notice">
Appears In <a href="#deployment-v1beta1">Deployment</a> </aside>

Field        | Schema     | Description
------------ | ---------- | -----------
minReadySeconds | integer | Minimum number of seconds for which a newly created pod should be ready without any of its container crashing, for it to be considered available. Defaults to 0 (pod will be considered available as soon as it is ready)
paused | boolean | Indicates that the deployment is paused and will not be processed by the deployment controller.
replicas | integer | Number of desired pods. This is a pointer to distinguish between explicit zero and not specified. Defaults to 1.
revisionHistoryLimit | integer | The number of old ReplicaSets to retain to allow rollback. This is a pointer to distinguish between explicit zero and not specified.
rollbackTo | [RollbackConfig](#rollbackconfig-v1beta1) | The config this deployment is rolling back to. Will be cleared after rollback is done.
selector | [LabelSelector](#labelselector-v1beta1) | Label selector for pods. Existing ReplicaSets whose pods are selected by this will be the ones affected by this deployment.
strategy | [DeploymentStrategy](#deploymentstrategy-v1beta1) | The deployment strategy to use to replace existing pods with new ones.
template | [PodTemplateSpec](#podtemplatespec-v1) | Template describes the pods that will be created.

### DeploymentStatus v1beta1

<aside class="notice">
Appears In <a href="#deployment-v1beta1">Deployment</a> </aside>

Field        | Schema     | Description
------------ | ---------- | -----------
availableReplicas | integer | Total number of available pods (ready for at least minReadySeconds) targeted by this deployment.
observedGeneration | integer | The generation observed by the deployment controller.
replicas | integer | Total number of non-terminated pods targeted by this deployment (their labels match the selector).
unavailableReplicas | integer | Total number of unavailable pods targeted by this deployment.
updatedReplicas | integer | Total number of non-terminated pods targeted by this deployment that have the desired template spec.


## <strong>Write Operations</strong>

See supported operations below...

## Create

///////////////////////////TAB KUBECTL//////////////////////////////////
//////// bdocs: Start kubectl tab code section.  Should be aligned
//////// vertically with "create a Deployment" operation description
//////// because that is the next non-tab code to appear

//////// bdocs: This is code block highlighted in the kubectl tab

> bdocs-tab:kubectl Execute

//////// bdocs: This appears in the kubectl tab with shell highlighting

```shell

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

//////// bdocs: This appears in the kubectl tab with code block highlighting

> Returns

//////// bdocs: This appears in the kubectl table with shell highlighting and
//////// bdocs: closes the tab section

```/bdocs-tab:kubectl shell

deployment "deployment-example" created

```
//////// bdocs: kubectl tab section closed
////////////////////END TAB KUBECTL/////////////////////////////////////


//////////////////////////// TAB CURL //////////////////////////////////
//////// bdocs: Start curl tab code section.  Should be aligned
//////// vertically with "create a Deployment" operation description
//////// because that is the next non-tab code to appear
//////// Uses shell highlighting

> bdocs-tab:curl Execute

```shell

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

> Returns

//////// bdocs: This appears in the 'curl' tab with json highlighting and
//////// bdocs: closes the curl tab section

```/bdocs-tab:curl json

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

//////// bdocs: curl tab section closed for now
/////////////////////////END TAB CURL //////////////////////////////////

//////// bdocs: Start middle pane (non-tab) section - should be aligned vertically with the top of the tabs above


create a Deployment

### HTTP Request

`POST /apis/extensions/v1beta1/namespaces/{namespace}/deployments`

### Path Parameters

Parameter    | Schema     | Description
------------ | ---------- | -----------
namespace |  | object name and auth scope, such as for teams and projects
pretty |  | If 'true', then the output is pretty printed.

### Query Parameters

Parameter    | Schema     | Description
------------ | ---------- | -----------
body | [Deployment](#deployment-v1beta1) | 

### Response

Code         | Schema     | Description
------------ | ---------- | -----------
200 | [Deployment](#deployment-v1beta1) | OK


## Replace

///////////////////////// TAB KUBECTL //////////////////////////////////
//////// bdocs: Start kubectl tab code section.  Should be aligned
//////// vertically with "replace the specified Deployment" operation description
//////// because that is the next non-tab code to appear

//////// bdocs: This is code block highlighted in the kubectl tab

> bdocs-tab:kubectl Execute

```shell

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

//////// bdocs: still in kubectl tab - codeblock highlight

> Returns

//////// bdocs: still in kubectl tab - shell highlight


```/bdocs-tab:kubectl shell

deployment "deployment-example" replaced

```
////////
//////// bdocs: kubectl tab section closed for now
////////
////////////////////// END TAB KUBECTL//////////////////////////////////

//////////////////////////// TAB CURL //////////////////////////////////
//////// bdocs: Start curl tab code section.  Should be aligned
//////// vertically with "replace the specified Deployment" operation description
//////// because that is the next non-tab code to appear
//////// Uses shell highlighting

> bdocs-tab:curl Execute

//////// bdocs: still in curl tab - shell highlight

```shell

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

//////// bdocs: still in curl tab - codeblock highlight

> Returns

//////// bdocs: still in curl tab - json highlight

```/bdocs-tab:curl json

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

//////// bdocs: curl tab section closed for now
/////////////////////////END TAB CURL //////////////////////////////////

//////// bdocs: start middle 'content' section.  Should be vertically
//////// bdocs: aligned with the start of both of the preceding 2 code blocks


replace the specified Deployment

### HTTP Request

`PUT /apis/extensions/v1beta1/namespaces/{namespace}/deployments/{name}`

### Path Parameters

Parameter    | Schema     | Description
------------ | ---------- | -----------
name |  | name of the Deployment
namespace |  | object name and auth scope, such as for teams and projects
pretty |  | If 'true', then the output is pretty printed.

### Query Parameters

Parameter    | Schema     | Description
------------ | ---------- | -----------
body | [Deployment](#deployment-v1beta1) | 

### Response

Code         | Schema     | Description
------------ | ---------- | -----------
200 | [Deployment](#deployment-v1beta1) | OK
