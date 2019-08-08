---
title: rolling-update
content_template: templates/tool-reference
---

### Overview
Perform a rolling update of the given ReplicationController.

 Replaces the specified replication controller with a new replication controller by updating one pod at a time to use the new PodTemplate. The new-controller.json must specify the same namespace as the existing replication controller and overwrite at least one (common) label in its replicaSelector.

 http://kubernetes.io/images/docs/kubectl_rollingupdate.svg

### Usage

`$ rolling-update OLD_CONTROLLER_NAME ([NEW_CONTROLLER_NAME] --image=NEW_CONTAINER_IMAGE | -f NEW_CONTROLLER_SPEC)`


### Example

 Update pods of frontend-v1 using new replication controller data in frontend-v2.json.

```shell
kubectl rolling-update frontend-v1 -f frontend-v2.json
```

 Update pods of frontend-v1 using JSON data passed into stdin.

```shell
cat frontend-v2.json | kubectl rolling-update frontend-v1 -f -
```

 Update the pods of frontend-v1 to frontend-v2 by just changing the image, and switching the # name of the replication controller.

```shell
kubectl rolling-update frontend-v1 frontend-v2 --image=image:v2
```

 Update the pods of frontend by just changing the image, and keeping the old name.

```shell
kubectl rolling-update frontend --image=image:v2
```

 Abort and reverse an existing rollout in progress (from frontend-v1 to frontend-v2).

```shell
kubectl rolling-update frontend-v1 frontend-v2 --rollback
```




### Flags

<div class="table-responsive"><table class="table table-bordered">
<thead class="thead-light">
<tr>
            <th>Name</th>
            <th>Shorthand</th>
            <th>Default</th>
            <th>Usage</th>
        </tr>
    </thead>
    <tbody>
    
    <tr>
    <td>allow-missing-template-keys</td><td></td><td>true</td><td>If true, ignore any errors in templates when a field or map key is missing in the template. Only applies to golang and jsonpath output formats.</td>
    </tr>
    <tr>
    <td>container</td><td></td><td></td><td>Container name which will have its image upgraded. Only relevant when --image is specified, ignored otherwise. Required when using --image on a multi-container pod</td>
    </tr>
    <tr>
    <td>deployment-label-key</td><td></td><td>deployment</td><td>The key to use to differentiate between two different controllers, default 'deployment'.  Only relevant when --image is specified, ignored otherwise</td>
    </tr>
    <tr>
    <td>dry-run</td><td></td><td>false</td><td>If true, only print the object that would be sent, without sending it.</td>
    </tr>
    <tr>
    <td>filename</td><td>f</td><td>[]</td><td>Filename or URL to file to use to create the new replication controller.</td>
    </tr>
    <tr>
    <td>image</td><td></td><td></td><td>Image to use for upgrading the replication controller. Must be distinct from the existing image (either new image or new image tag).  Can not be used with --filename/-f</td>
    </tr>
    <tr>
    <td>image-pull-policy</td><td></td><td></td><td>Explicit policy for when to pull container images. Required when --image is same as existing image, ignored otherwise.</td>
    </tr>
    <tr>
    <td>output</td><td>o</td><td></td><td>Output format. One of: json&#124;yaml&#124;name&#124;go-template&#124;go-template-file&#124;template&#124;templatefile&#124;jsonpath&#124;jsonpath-file.</td>
    </tr>
    <tr>
    <td>poll-interval</td><td></td><td>3s</td><td>Time delay between polling for replication controller status after the update. Valid time units are "ns", "us" (or "µs"), "ms", "s", "m", "h".</td>
    </tr>
    <tr>
    <td>rollback</td><td></td><td>false</td><td>If true, this is a request to abort an existing rollout that is partially rolled out. It effectively reverses current and next and runs a rollout</td>
    </tr>
    <tr>
    <td>template</td><td></td><td></td><td>Template string or path to template file to use when -o=go-template, -o=go-template-file. The template format is golang templates [http://golang.org/pkg/text/template/#pkg-overview].</td>
    </tr>
    <tr>
    <td>timeout</td><td></td><td>5m0s</td><td>Max time to wait for a replication controller to update before giving up. Valid time units are "ns", "us" (or "µs"), "ms", "s", "m", "h".</td>
    </tr>
    <tr>
    <td>update-period</td><td></td><td>1m0s</td><td>Time to wait between updating pods. Valid time units are "ns", "us" (or "µs"), "ms", "s", "m", "h".</td>
    </tr>
    <tr>
    <td>validate</td><td></td><td>true</td><td>If true, use a schema to validate the input before sending it</td>
    </tr>
</tbody>
</table></div>



