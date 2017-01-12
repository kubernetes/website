

-----------
# JobList v1



Group        | Version     | Kind
------------ | ---------- | -----------
Batch | v1 | JobList




<aside class="notice">Other api versions of this object exist: <a href="#joblist-v1beta1">v1beta1</a> <a href="#joblist-v2alpha1">v2alpha1</a> </aside>


JobList is a collection of jobs.



Field        | Description
------------ | -----------
items <br /> *[Job](#job-v1) array*  | Items is the list of Job.
metadata <br /> *[ListMeta](#listmeta-unversioned)*  | Standard list metadata More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#metadata





## <strong>Read Operations</strong>

See supported operations below...

## Watch

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

`GET /apis/batch/v1/watch/namespaces/{namespace}/jobs`

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




