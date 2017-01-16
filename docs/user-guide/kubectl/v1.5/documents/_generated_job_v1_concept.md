

-----------
# Job v1

>bdocs-tab:kubectl Job Config to print pi up to 2000 digits (then exit).

```bdocs-tab:kubectl_yaml

apiVersion: batch/v1
kind: Job
metadata:
  # Unique key of the Job instance
  name: example-job
spec:
  template:
    metadata:
      name: example-job
    spec:
      containers:
      - name: pi
        image: perl
        command: ["perl"]
        args: ["-Mbignum=bpi", "-wle", "print bpi(2000)"]
      # Do not restart containers after they exit
      restartPolicy: Never


```
>bdocs-tab:curl Job Config to print pi up to 2000 digits (then exit).

```bdocs-tab:curl_yaml

apiVersion: batch/v1
kind: Job
metadata:
  # Unique key of the Job instance
  name: example-job
spec:
  template:
    metadata:
      name: example-job
    spec:
      containers:
      - name: pi
        image: perl
        command: ["perl"]
        args: ["-Mbignum=bpi", "-wle", "print bpi(2000)"]
      # Do not restart containers after they exit
      restartPolicy: Never


```


Group        | Version     | Kind
------------ | ---------- | -----------
Batch | v1 | Job




<aside class="notice">Other api versions of this object exist: <a href="#job-v1beta1">v1beta1</a> </aside>


Job represents the configuration of a single job.

<aside class="notice">
Appears In <a href="#joblist-v1">JobList</a> </aside>

Field        | Description
------------ | -----------
metadata <br /> *[ObjectMeta](#objectmeta-v1)*  | Standard object's metadata. More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#metadata
spec <br /> *[JobSpec](#jobspec-v1)*  | Spec is a structure defining the expected behavior of a job. More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#spec-and-status
status <br /> *[JobStatus](#jobstatus-v1)*  | Status is a structure describing current status of a job. More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#spec-and-status


### JobSpec v1

<aside class="notice">
Appears In <a href="#job-v1">Job</a> </aside>

Field        | Description
------------ | -----------
activeDeadlineSeconds <br /> *integer*  | Optional duration in seconds relative to the startTime that the job may be active before the system tries to terminate it; value must be positive integer
completions <br /> *integer*  | Completions specifies the desired number of successfully finished pods the job should be run with.  Setting to nil means that the success of any pod signals the success of all pods, and allows parallelism to have any positive value.  Setting to 1 means that parallelism is limited to 1 and the success of that pod signals the success of the job. More info: http://kubernetes.io/docs/user-guide/jobs
manualSelector <br /> *boolean*  | ManualSelector controls generation of pod labels and pod selectors. Leave `manualSelector` unset unless you are certain what you are doing. When false or unset, the system pick labels unique to this job and appends those labels to the pod template.  When true, the user is responsible for picking unique labels and specifying the selector.  Failure to pick a unique label may cause this and other jobs to not function correctly.  However, You may see `manualSelector=true` in jobs that were created with the old `extensions/v1beta1` API. More info: http://releases.k8s.io/HEAD/docs/design/selector-generation.md
parallelism <br /> *integer*  | Parallelism specifies the maximum desired number of pods the job should run at any given time. The actual number of pods running in steady state will be less than this number when ((.spec.completions - .status.successful) < .spec.parallelism), i.e. when the work left to do is less than max parallelism. More info: http://kubernetes.io/docs/user-guide/jobs
selector <br /> *[LabelSelector](#labelselector-unversioned)*  | Selector is a label query over pods that should match the pod count. Normally, the system sets this field for you. More info: http://kubernetes.io/docs/user-guide/labels#label-selectors
template <br /> *[PodTemplateSpec](#podtemplatespec-v1)*  | Template is the object that describes the pod that will be created when executing a job. More info: http://kubernetes.io/docs/user-guide/jobs

### JobStatus v1

<aside class="notice">
Appears In <a href="#job-v1">Job</a> </aside>

Field        | Description
------------ | -----------
active <br /> *integer*  | Active is the number of actively running pods.
completionTime <br /> *[Time](#time-unversioned)*  | CompletionTime represents time when the job was completed. It is not guaranteed to be set in happens-before order across separate operations. It is represented in RFC3339 form and is in UTC.
conditions <br /> *[JobCondition](#jobcondition-v1) array*  | Conditions represent the latest available observations of an object's current state. More info: http://kubernetes.io/docs/user-guide/jobs
failed <br /> *integer*  | Failed is the number of pods which reached Phase Failed.
startTime <br /> *[Time](#time-unversioned)*  | StartTime represents time when the job was acknowledged by the Job Manager. It is not guaranteed to be set in happens-before order across separate operations. It is represented in RFC3339 form and is in UTC.
succeeded <br /> *integer*  | Succeeded is the number of pods which reached Phase Succeeded.

### JobList v1



Field        | Description
------------ | -----------
items <br /> *[Job](#job-v1) array*  | Items is the list of Job.
metadata <br /> *[ListMeta](#listmeta-unversioned)*  | Standard list metadata More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#metadata




## <strong>Write Operations</strong>

See supported operations below...

## Create

>bdocs-tab:kubectl `kubectl` Command

```bdocs-tab:kubectl_shell

$ echo 'apiVersion: batch/v1
kind: Job
metadata:
  name: example-job
spec:
  template:
    metadata:
      name: example-job
    spec:
      containers:
      - name: pi
        image: perl
        command: ["perl",  "-Mbignum=bpi", "-wle", "print bpi(2000)"]
      restartPolicy: Never
' | kubectl create -f -

```

>bdocs-tab:curl `curl` Command (*requires `kubectl proxy` to be running*)

```bdocs-tab:curl_shell

$ kubectl proxy
$ curl -X POST -H 'Content-Type: application/yaml' --data '
apiVersion: batch/v1
kind: Job
metadata:
  name: example-job
spec:
  template:
    metadata:
      name: example-job
    spec:
      containers:
      - name: pi
        image: perl
        command: ["perl",  "-Mbignum=bpi", "-wle", "print bpi(2000)"]
      restartPolicy: Never
' http://127.0.0.1:8001/apis/batch/v1/namespaces/default/jobs

```

>bdocs-tab:kubectl Output

```bdocs-tab:kubectl_json

job "example-job" created

```
>bdocs-tab:curl Response Body

```bdocs-tab:curl_json

{
  "kind": "Job",
  "apiVersion": "batch/v1",
  "metadata": {
    "name": "example-job",
    "namespace": "default",
    "selfLink": "/apis/batch/v1/namespaces/default/jobs/example-job",
    "uid": "d93a3569-a2be-11e6-a008-fa043d458cc7",
    "resourceVersion": "7479",
    "creationTimestamp": "2016-11-04T18:45:25Z"
  },
  "spec": {
    "parallelism": 1,
    "completions": 1,
    "selector": {
      "matchLabels": {
        "controller-uid": "d93a3569-a2be-11e6-a008-fa043d458cc7"
      }
    },
    "template": {
      "metadata": {
        "name": "example-job",
        "creationTimestamp": null,
        "labels": {
          "controller-uid": "d93a3569-a2be-11e6-a008-fa043d458cc7",
          "job-name": "example-job"
        }
      },
      "spec": {
        "containers": [
          {
            "name": "pi",
            "image": "perl",
            "command": [
              "perl",
              "-Mbignum=bpi",
              "-wle",
              "print bpi(2000)"
            ],
            "resources": {},
            "terminationMessagePath": "/dev/termination-log",
            "imagePullPolicy": "Always"
          }
        ],
        "restartPolicy": "Never",
        "terminationGracePeriodSeconds": 30,
        "dnsPolicy": "ClusterFirst",
        "securityContext": {}
      }
    }
  },
  "status": {}
}

```



create a Job

### HTTP Request

`POST /apis/batch/v1/namespaces/{namespace}/jobs`

### Path Parameters

Parameter    | Description
------------ | -----------
namespace  | object name and auth scope, such as for teams and projects
pretty  | If 'true', then the output is pretty printed.

### Query Parameters

Parameter    | Description
------------ | -----------
body <br /> *[Job](#job-v1)*  | 

### Response

Code         | Description
------------ | -----------
200 <br /> *[Job](#job-v1)*  | OK


## Replace

>bdocs-tab:kubectl `kubectl` Command

```bdocs-tab:kubectl_shell

$ echo '' | kubectl replace -f -

```

>bdocs-tab:curl `curl` Command (*requires `kubectl proxy` to be running*)

```bdocs-tab:curl_shell

$ kubectl proxy
$ curl -X PUT -H 'Content-Type: application/yaml' --data '
' http://127.0.0.1:8001/apis/batch/v1/namespaces/default/jobs/example-job

```

>bdocs-tab:kubectl Output

```bdocs-tab:kubectl_json

job "example-job" replaced

```
>bdocs-tab:curl Response Body

```bdocs-tab:curl_json



```



replace the specified Job

### HTTP Request

`PUT /apis/batch/v1/namespaces/{namespace}/jobs/{name}`

### Path Parameters

Parameter    | Description
------------ | -----------
name  | name of the Job
namespace  | object name and auth scope, such as for teams and projects
pretty  | If 'true', then the output is pretty printed.

### Query Parameters

Parameter    | Description
------------ | -----------
body <br /> *[Job](#job-v1)*  | 

### Response

Code         | Description
------------ | -----------
200 <br /> *[Job](#job-v1)*  | OK


## Patch

>bdocs-tab:kubectl `kubectl` Command

```bdocs-tab:kubectl_shell

$ kubectl patch job example-job -p \
	''

```

>bdocs-tab:curl `curl` Command (*requires `kubectl proxy` to be running*)

```bdocs-tab:curl_shell

$ kubectl proxy
$ curl -X PATCH -H 'Content-Type: application/strategic-merge-patch+json' --data '
' \
	'http://127.0.0.1:8001/apis/batch/v1/namespaces/default/jobs/example-job'

```

>bdocs-tab:kubectl Output

```bdocs-tab:kubectl_json

"example-job" patched

```
>bdocs-tab:curl Response Body

```bdocs-tab:curl_json



```



partially update the specified Job

### HTTP Request

`PATCH /apis/batch/v1/namespaces/{namespace}/jobs/{name}`

### Path Parameters

Parameter    | Description
------------ | -----------
name  | name of the Job
namespace  | object name and auth scope, such as for teams and projects
pretty  | If 'true', then the output is pretty printed.

### Query Parameters

Parameter    | Description
------------ | -----------
body <br /> *[Patch](#patch-unversioned)*  | 

### Response

Code         | Description
------------ | -----------
200 <br /> *[Job](#job-v1)*  | OK


## Delete

>bdocs-tab:kubectl `kubectl` Command

```bdocs-tab:kubectl_shell

$ kubectl delete job example-job

```

>bdocs-tab:curl `curl` Command (*requires `kubectl proxy` to be running*)

```bdocs-tab:curl_shell

$ kubectl proxy
$ curl -X DELETE -H 'Content-Type: application/yaml' --data '
gracePeriodSeconds: 0
orphanDependents: false
' 'http://127.0.0.1:8001/apis/batch/v1/namespaces/default/jobs/example-job'

```

>bdocs-tab:kubectl Output

```bdocs-tab:kubectl_json

job "example-job" deleted

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



delete a Job

### HTTP Request

`DELETE /apis/batch/v1/namespaces/{namespace}/jobs/{name}`

### Path Parameters

Parameter    | Description
------------ | -----------
name  | name of the Job
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



delete collection of Job

### HTTP Request

`DELETE /apis/batch/v1/namespaces/{namespace}/jobs`

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

$ kubectl get job example-job -o json

```

>bdocs-tab:curl `curl` Command (*requires `kubectl proxy` to be running*)

```bdocs-tab:curl_shell

$ kubectl proxy
$ curl -X GET http://127.0.0.1:8001/apis/batch/v1/namespaces/default/jobs/example-job

```

>bdocs-tab:kubectl Output

```bdocs-tab:kubectl_json

{
  "kind": "Job",
  "apiVersion": "batch/v1",
  "metadata": {
    "name": "example-job",
    "namespace": "default",
    "selfLink": "/apis/batch/v1/namespaces/default/jobs/example-job",
    "uid": "d93a3569-a2be-11e6-a008-fa043d458cc7",
    "resourceVersion": "7482",
    "creationTimestamp": "2016-11-04T18:45:25Z"
  },
  "spec": {
    "parallelism": 1,
    "completions": 1,
    "selector": {
      "matchLabels": {
        "controller-uid": "d93a3569-a2be-11e6-a008-fa043d458cc7"
      }
    },
    "template": {
      "metadata": {
        "name": "example-job",
        "creationTimestamp": null,
        "labels": {
          "controller-uid": "d93a3569-a2be-11e6-a008-fa043d458cc7",
          "job-name": "example-job"
        }
      },
      "spec": {
        "containers": [
          {
            "name": "pi",
            "image": "perl",
            "command": [
              "perl",
              "-Mbignum=bpi",
              "-wle",
              "print bpi(2000)"
            ],
            "resources": {},
            "terminationMessagePath": "/dev/termination-log",
            "imagePullPolicy": "Always"
          }
        ],
        "restartPolicy": "Never",
        "terminationGracePeriodSeconds": 30,
        "dnsPolicy": "ClusterFirst",
        "securityContext": {}
      }
    }
  },
  "status": {
    "startTime": "2016-11-04T18:45:25Z",
    "active": 1
  }
}

```
>bdocs-tab:curl Response Body

```bdocs-tab:curl_json

{
  "kind": "Job",
  "apiVersion": "batch/v1",
  "metadata": {
    "name": "example-job",
    "namespace": "default",
    "selfLink": "/apis/batch/v1/namespaces/default/jobs/example-job",
    "uid": "d93a3569-a2be-11e6-a008-fa043d458cc7",
    "resourceVersion": "7482",
    "creationTimestamp": "2016-11-04T18:45:25Z"
  },
  "spec": {
    "parallelism": 1,
    "completions": 1,
    "selector": {
      "matchLabels": {
        "controller-uid": "d93a3569-a2be-11e6-a008-fa043d458cc7"
      }
    },
    "template": {
      "metadata": {
        "name": "example-job",
        "creationTimestamp": null,
        "labels": {
          "controller-uid": "d93a3569-a2be-11e6-a008-fa043d458cc7",
          "job-name": "example-job"
        }
      },
      "spec": {
        "containers": [
          {
            "name": "pi",
            "image": "perl",
            "command": [
              "perl",
              "-Mbignum=bpi",
              "-wle",
              "print bpi(2000)"
            ],
            "resources": {},
            "terminationMessagePath": "/dev/termination-log",
            "imagePullPolicy": "Always"
          }
        ],
        "restartPolicy": "Never",
        "terminationGracePeriodSeconds": 30,
        "dnsPolicy": "ClusterFirst",
        "securityContext": {}
      }
    }
  },
  "status": {
    "startTime": "2016-11-04T18:45:25Z",
    "active": 1
  }
}

```



read the specified Job

### HTTP Request

`GET /apis/batch/v1/namespaces/{namespace}/jobs/{name}`

### Path Parameters

Parameter    | Description
------------ | -----------
name  | name of the Job
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
200 <br /> *[Job](#job-v1)*  | OK


## List

>bdocs-tab:kubectl `kubectl` Command

```bdocs-tab:kubectl_shell

$ kubectl get job -o json

```

>bdocs-tab:curl `curl` Command (*requires `kubectl proxy` to be running*)

```bdocs-tab:curl_shell

$ kubectl proxy
$ curl -X GET 'http://127.0.0.1:8001/apis/batch/v1/namespaces/default/jobs'

```

>bdocs-tab:kubectl Output

```bdocs-tab:kubectl_json

{
  "kind": "JobList",
  "apiVersion": "batch/v1",
  "metadata": {
    "selfLink": "/apis/batch/v1/namespaces/default/jobs",
    "resourceVersion": "7589"
  },
  "items": [
    {
      "metadata": {
        "name": "",
        "namespace": "default",
        "selfLink": "/apis/batch/v1/namespaces/default/jobs/",
        "uid": "d93a3569-a2be-11e6-a008-fa043d458cc7",
        "resourceVersion": "7482",
        "creationTimestamp": "2016-11-04T18:45:25Z"
      },
      "spec": {
        "parallelism": 1,
        "completions": 1,
        "selector": {
          "matchLabels": {
            "controller-uid": "d93a3569-a2be-11e6-a008-fa043d458cc7"
          }
        },
        "template": {
          "metadata": {
            "name": "",
            "creationTimestamp": null,
            "labels": {
              "controller-uid": "d93a3569-a2be-11e6-a008-fa043d458cc7",
              "job-name": ""
            }
          },
          "spec": {
            "containers": [
              {
                "name": "pi",
                "image": "perl",
                "command": [
                  "perl",
                  "-Mbignum=bpi",
                  "-wle",
                  "print bpi(2000)"
                ],
                "resources": {},
                "terminationMessagePath": "/dev/termination-log",
                "imagePullPolicy": "Always"
              }
            ],
            "restartPolicy": "Never",
            "terminationGracePeriodSeconds": 30,
            "dnsPolicy": "ClusterFirst",
            "securityContext": {}
          }
        }
      },
      "status": {
        "startTime": "2016-11-04T18:45:25Z",
        "active": 1
      }
    }
  ]
}

```
>bdocs-tab:curl Response Body

```bdocs-tab:curl_json

{
  "kind": "JobList",
  "apiVersion": "batch/v1",
  "metadata": {
    "selfLink": "/apis/batch/v1/namespaces/default/jobs",
    "resourceVersion": "7589"
  },
  "items": [
    {
      "metadata": {
        "name": "",
        "namespace": "default",
        "selfLink": "/apis/batch/v1/namespaces/default/jobs/",
        "uid": "d93a3569-a2be-11e6-a008-fa043d458cc7",
        "resourceVersion": "7482",
        "creationTimestamp": "2016-11-04T18:45:25Z"
      },
      "spec": {
        "parallelism": 1,
        "completions": 1,
        "selector": {
          "matchLabels": {
            "controller-uid": "d93a3569-a2be-11e6-a008-fa043d458cc7"
          }
        },
        "template": {
          "metadata": {
            "name": "",
            "creationTimestamp": null,
            "labels": {
              "controller-uid": "d93a3569-a2be-11e6-a008-fa043d458cc7",
              "job-name": ""
            }
          },
          "spec": {
            "containers": [
              {
                "name": "pi",
                "image": "perl",
                "command": [
                  "perl",
                  "-Mbignum=bpi",
                  "-wle",
                  "print bpi(2000)"
                ],
                "resources": {},
                "terminationMessagePath": "/dev/termination-log",
                "imagePullPolicy": "Always"
              }
            ],
            "restartPolicy": "Never",
            "terminationGracePeriodSeconds": 30,
            "dnsPolicy": "ClusterFirst",
            "securityContext": {}
          }
        }
      },
      "status": {
        "startTime": "2016-11-04T18:45:25Z",
        "active": 1
      }
    }
  ]
}

```



list or watch objects of kind Job

### HTTP Request

`GET /apis/batch/v1/namespaces/{namespace}/jobs`

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
200 <br /> *[JobList](#joblist-v1)*  | OK


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



list or watch objects of kind Job

### HTTP Request

`GET /apis/batch/v1/jobs`

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
200 <br /> *[JobList](#joblist-v1)*  | OK


## Watch

>bdocs-tab:kubectl `kubectl` Command

```bdocs-tab:kubectl_shell

$ kubectl get job example-job --watch -o json

```

>bdocs-tab:curl `curl` Command (*requires `kubectl proxy` to be running*)

```bdocs-tab:curl_shell

$ kubectl proxy
$ curl -X GET 'http://127.0.0.1:8001/apis/batch/v1/watch/namespaces/default/jobs/example-job'

```

>bdocs-tab:kubectl Output

```bdocs-tab:kubectl_json

{
	"type": "ADDED",
	"object": {
		"kind": "Job",
		"apiVersion": "batch/v1",
		"metadata": {
			"name": "example-job",
			"namespace": "default",
			"selfLink": "/apis/batch/v1/namespaces/default/jobs/example-job",
			"uid": "d93a3569-a2be-11e6-a008-fa043d458cc7",
			"resourceVersion": "7482",
			"creationTimestamp": "2016-11-04T18:45:25Z"
		},
		"spec": {
			"parallelism": 1,
			"completions": 1,
			"selector": {
				"matchLabels": {
					"controller-uid": "d93a3569-a2be-11e6-a008-fa043d458cc7"
				}
			},
			"template": {
				"metadata": {
					"name": "example-job",
					"creationTimestamp": null,
					"labels": {
						"controller-uid": "d93a3569-a2be-11e6-a008-fa043d458cc7",
						"job-name": "example-job"
					}
				},
				"spec": {
					"containers": [
						{
							"name": "pi",
							"image": "perl",
							"command": [
								"perl",
								"-Mbignum=bpi",
								"-wle",
								"print bpi(2000)"
							],
							"resources": {
							},
							"terminationMessagePath": "/dev/termination-log",
							"imagePullPolicy": "Always"
						}
					],
					"restartPolicy": "Never",
					"terminationGracePeriodSeconds": 30,
					"dnsPolicy": "ClusterFirst",
					"securityContext": {
					}
				}
			}
		},
		"status": {
			"startTime": "2016-11-04T18:45:25Z",
			"active": 1
		}
	}
}

```
>bdocs-tab:curl Response Body

```bdocs-tab:curl_json

{
	"type": "ADDED",
	"object": {
		"kind": "Job",
		"apiVersion": "batch/v1",
		"metadata": {
			"name": "example-job",
			"namespace": "default",
			"selfLink": "/apis/batch/v1/namespaces/default/jobs/example-job",
			"uid": "d93a3569-a2be-11e6-a008-fa043d458cc7",
			"resourceVersion": "7482",
			"creationTimestamp": "2016-11-04T18:45:25Z"
		},
		"spec": {
			"parallelism": 1,
			"completions": 1,
			"selector": {
				"matchLabels": {
					"controller-uid": "d93a3569-a2be-11e6-a008-fa043d458cc7"
				}
			},
			"template": {
				"metadata": {
					"name": "example-job",
					"creationTimestamp": null,
					"labels": {
						"controller-uid": "d93a3569-a2be-11e6-a008-fa043d458cc7",
						"job-name": "example-job"
					}
				},
				"spec": {
					"containers": [
						{
							"name": "pi",
							"image": "perl",
							"command": [
								"perl",
								"-Mbignum=bpi",
								"-wle",
								"print bpi(2000)"
							],
							"resources": {
							},
							"terminationMessagePath": "/dev/termination-log",
							"imagePullPolicy": "Always"
						}
					],
					"restartPolicy": "Never",
					"terminationGracePeriodSeconds": 30,
					"dnsPolicy": "ClusterFirst",
					"securityContext": {
					}
				}
			}
		},
		"status": {
			"startTime": "2016-11-04T18:45:25Z",
			"active": 1
		}
	}
}

```



watch changes to an object of kind Job

### HTTP Request

`GET /apis/batch/v1/watch/namespaces/{namespace}/jobs/{name}`

### Path Parameters

Parameter    | Description
------------ | -----------
fieldSelector  | A selector to restrict the list of returned objects by their fields. Defaults to everything.
labelSelector  | A selector to restrict the list of returned objects by their labels. Defaults to everything.
name  | name of the Job
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



watch individual changes to a list of Job

### HTTP Request

`GET /apis/batch/v1/watch/jobs`

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




