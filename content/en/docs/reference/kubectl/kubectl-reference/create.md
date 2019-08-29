---
title: create
content_template: templates/tool-reference
---

### Overview
Create a resource from a file or from stdin.

 JSON and YAML formats are accepted.

### Usage

`create -f FILENAME`


### Example

 Create a pod using the data in pod.json.

```shell
kubectl create -f ./pod.json
```

 Create a pod based on the JSON passed into stdin.

```shell
cat pod.json | kubectl create -f -
```

 Edit the data in docker-registry.yaml in JSON then create the resource using the edited data.

```shell
kubectl create -f docker-registry.yaml --edit -o json
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
    <td>dry-run</td><td></td><td>false</td><td>If true, only print the object that would be sent, without sending it.</td>
    </tr>
    <tr>
    <td>edit</td><td></td><td>false</td><td>Edit the API resource before creating</td>
    </tr>
    <tr>
    <td>filename</td><td>f</td><td>[]</td><td>Filename, directory, or URL to files to use to create the resource</td>
    </tr>
    <tr>
    <td>kustomize</td><td>k</td><td></td><td>Process the kustomization directory. This flag can't be used together with -f or -R.</td>
    </tr>
    <tr>
    <td>output</td><td>o</td><td></td><td>Output format. One of: json&#124;yaml&#124;name&#124;go-template&#124;go-template-file&#124;template&#124;templatefile&#124;jsonpath&#124;jsonpath-file.</td>
    </tr>
    <tr>
    <td>raw</td><td></td><td></td><td>Raw URI to POST to the server.  Uses the transport specified by the kubeconfig file.</td>
    </tr>
    <tr>
    <td>record</td><td></td><td>false</td><td>Record current kubectl command in the resource annotation. If set to false, do not record the command. If set to true, record the command. If not set, default to updating the existing annotation value only if one already exists.</td>
    </tr>
    <tr>
    <td>recursive</td><td>R</td><td>false</td><td>Process the directory used in -f, --filename recursively. Useful when you want to manage related manifests organized within the same directory.</td>
    </tr>
    <tr>
    <td>save-config</td><td></td><td>false</td><td>If true, the configuration of current object will be saved in its annotation. Otherwise, the annotation will be unchanged. This flag is useful when you want to perform kubectl apply on this object in the future.</td>
    </tr>
    <tr>
    <td>selector</td><td>l</td><td></td><td>Selector (label query) to filter on, supports '=', '==', and '!='.(e.g. -l key1=value1,key2=value2)</td>
    </tr>
    <tr>
    <td>template</td><td></td><td></td><td>Template string or path to template file to use when -o=go-template, -o=go-template-file. The template format is golang templates [http://golang.org/pkg/text/template/#pkg-overview].</td>
    </tr>
    <tr>
    <td>validate</td><td></td><td>true</td><td>If true, use a schema to validate the input before sending it</td>
    </tr>
    <tr>
    <td>windows-line-endings</td><td></td><td>false</td><td>Only relevant if --edit=true. Defaults to the line ending native to your platform.</td>
    </tr>
</tbody>
</table></div>



<hr>

## clusterrole


### Overview
Create a ClusterRole.

### Usage

`clusterrole NAME --verb=verb --resource=resource.group [--resource-name=resourcename] [--dry-run]`


### Example
 Create a ClusterRole named "pod-reader" that allows user to perform "get", "watch" and "list" on pods

```shell
kubectl create clusterrole pod-reader --verb=get,list,watch --resource=pods
```

 Create a ClusterRole named "pod-reader" with ResourceName specified

```shell
kubectl create clusterrole pod-reader --verb=get --resource=pods --resource-name=readablepod --resource-name=anotherpod
```

 Create a ClusterRole named "foo" with API Group specified

```shell
kubectl create clusterrole foo --verb=get,list,watch --resource=rs.extensions
```

 Create a ClusterRole named "foo" with SubResource specified

```shell
kubectl create clusterrole foo --verb=get,list,watch --resource=pods,pods/status
```

 Create a ClusterRole name "foo" with NonResourceURL specified

```shell
kubectl create clusterrole "foo" --verb=get --non-resource-url=/logs/*
```

 Create a ClusterRole name "monitoring" with AggregationRule specified

```shell
kubectl create clusterrole monitoring --aggregation-rule="rbac.example.com/aggregate-to-monitoring=true"
```




### Flags

<div class="table-responsive kubectl-flags-table"><table class="table table-bordered">
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
    <td>aggregation-rule</td><td></td><td></td><td>An aggregation label selector for combining ClusterRoles.</td>
    </tr>
    <tr>
    <td>allow-missing-template-keys</td><td></td><td>true</td><td>If true, ignore any errors in templates when a field or map key is missing in the template. Only applies to golang and jsonpath output formats.</td>
    </tr>
    <tr>
    <td>dry-run</td><td></td><td>false</td><td>If true, only print the object that would be sent, without sending it.</td>
    </tr>
    <tr>
    <td>non-resource-url</td><td></td><td>[]</td><td>A partial url that user should have access to.</td>
    </tr>
    <tr>
    <td>output</td><td>o</td><td></td><td>Output format. One of: json&#124;yaml&#124;name&#124;go-template&#124;go-template-file&#124;template&#124;templatefile&#124;jsonpath&#124;jsonpath-file.</td>
    </tr>
    <tr>
    <td>resource</td><td></td><td>[]</td><td>Resource that the rule applies to</td>
    </tr>
    <tr>
    <td>resource-name</td><td></td><td>[]</td><td>Resource in the white list that the rule applies to, repeat this flag for multiple items</td>
    </tr>
    <tr>
    <td>save-config</td><td></td><td>false</td><td>If true, the configuration of current object will be saved in its annotation. Otherwise, the annotation will be unchanged. This flag is useful when you want to perform kubectl apply on this object in the future.</td>
    </tr>
    <tr>
    <td>template</td><td></td><td></td><td>Template string or path to template file to use when -o=go-template, -o=go-template-file. The template format is golang templates [http://golang.org/pkg/text/template/#pkg-overview].</td>
    </tr>
    <tr>
    <td>validate</td><td></td><td>true</td><td>If true, use a schema to validate the input before sending it</td>
    </tr>
    <tr>
    <td>verb</td><td></td><td>[]</td><td>Verb that applies to the resources contained in the rule</td>
    </tr>
</tbody>
</table></div>



<hr>

## clusterrolebinding


### Overview
Create a ClusterRoleBinding for a particular ClusterRole.

### Usage

`clusterrolebinding NAME --clusterrole=NAME [--user=username] [--group=groupname] [--serviceaccount=namespace:serviceaccountname] [--dry-run]`


### Example
 Create a ClusterRoleBinding for user1, user2, and group1 using the cluster-admin ClusterRole

```shell
kubectl create clusterrolebinding cluster-admin --clusterrole=cluster-admin --user=user1 --user=user2 --group=group1
```




### Flags

<div class="table-responsive kubectl-flags-table"><table class="table table-bordered">
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
    <td>clusterrole</td><td></td><td></td><td>ClusterRole this ClusterRoleBinding should reference</td>
    </tr>
    <tr>
    <td>dry-run</td><td></td><td>false</td><td>If true, only print the object that would be sent, without sending it.</td>
    </tr>
    <tr>
    <td>generator</td><td></td><td>clusterrolebinding.rbac.authorization.k8s.io/v1alpha1</td><td>The name of the API generator to use.</td>
    </tr>
    <tr>
    <td>group</td><td></td><td>[]</td><td>Groups to bind to the clusterrole</td>
    </tr>
    <tr>
    <td>output</td><td>o</td><td></td><td>Output format. One of: json&#124;yaml&#124;name&#124;go-template&#124;go-template-file&#124;template&#124;templatefile&#124;jsonpath&#124;jsonpath-file.</td>
    </tr>
    <tr>
    <td>save-config</td><td></td><td>false</td><td>If true, the configuration of current object will be saved in its annotation. Otherwise, the annotation will be unchanged. This flag is useful when you want to perform kubectl apply on this object in the future.</td>
    </tr>
    <tr>
    <td>serviceaccount</td><td></td><td>[]</td><td>Service accounts to bind to the clusterrole, in the format <namespace>:<name></td>
    </tr>
    <tr>
    <td>template</td><td></td><td></td><td>Template string or path to template file to use when -o=go-template, -o=go-template-file. The template format is golang templates [http://golang.org/pkg/text/template/#pkg-overview].</td>
    </tr>
    <tr>
    <td>validate</td><td></td><td>true</td><td>If true, use a schema to validate the input before sending it</td>
    </tr>
</tbody>
</table></div>



<hr>

## configmap


### Overview
Create a configmap based on a file, directory, or specified literal value.

 A single configmap may package one or more key/value pairs.

 When creating a configmap based on a file, the key will default to the basename of the file, and the value will default to the file content.  If the basename is an invalid key, you may specify an alternate key.

 When creating a configmap based on a directory, each file whose basename is a valid key in the directory will be packaged into the configmap.  Any directory entries except regular files are ignored (e.g. subdirectories, symlinks, devices, pipes, etc).

### Usage

`configmap NAME [--from-file=[key=]source] [--from-literal=key1=value1] [--dry-run]`


### Example
 Create a new configmap named my-config based on folder bar

```shell
kubectl create configmap my-config --from-file=path/to/bar
```

 Create a new configmap named my-config with specified keys instead of file basenames on disk

```shell
kubectl create configmap my-config --from-file=key1=/path/to/bar/file1.txt --from-file=key2=/path/to/bar/file2.txt
```

 Create a new configmap named my-config with key1=config1 and key2=config2

```shell
kubectl create configmap my-config --from-literal=key1=config1 --from-literal=key2=config2
```

 Create a new configmap named my-config from the key=value pairs in the file

```shell
kubectl create configmap my-config --from-file=path/to/bar
```

 Create a new configmap named my-config from an env file

```shell
kubectl create configmap my-config --from-env-file=path/to/bar.env
```




### Flags

<div class="table-responsive kubectl-flags-table"><table class="table table-bordered">
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
    <td>append-hash</td><td></td><td>false</td><td>Append a hash of the configmap to its name.</td>
    </tr>
    <tr>
    <td>dry-run</td><td></td><td>false</td><td>If true, only print the object that would be sent, without sending it.</td>
    </tr>
    <tr>
    <td>from-env-file</td><td></td><td></td><td>Specify the path to a file to read lines of key=val pairs to create a configmap (i.e. a Docker .env file).</td>
    </tr>
    <tr>
    <td>from-file</td><td></td><td>[]</td><td>Key file can be specified using its file path, in which case file basename will be used as configmap key, or optionally with a key and file path, in which case the given key will be used.  Specifying a directory will iterate each named file in the directory whose basename is a valid configmap key.</td>
    </tr>
    <tr>
    <td>from-literal</td><td></td><td>[]</td><td>Specify a key and literal value to insert in configmap (i.e. mykey=somevalue)</td>
    </tr>
    <tr>
    <td>generator</td><td></td><td>configmap/v1</td><td>The name of the API generator to use.</td>
    </tr>
    <tr>
    <td>output</td><td>o</td><td></td><td>Output format. One of: json&#124;yaml&#124;name&#124;go-template&#124;go-template-file&#124;template&#124;templatefile&#124;jsonpath&#124;jsonpath-file.</td>
    </tr>
    <tr>
    <td>save-config</td><td></td><td>false</td><td>If true, the configuration of current object will be saved in its annotation. Otherwise, the annotation will be unchanged. This flag is useful when you want to perform kubectl apply on this object in the future.</td>
    </tr>
    <tr>
    <td>template</td><td></td><td></td><td>Template string or path to template file to use when -o=go-template, -o=go-template-file. The template format is golang templates [http://golang.org/pkg/text/template/#pkg-overview].</td>
    </tr>
    <tr>
    <td>validate</td><td></td><td>true</td><td>If true, use a schema to validate the input before sending it</td>
    </tr>
</tbody>
</table></div>



<hr>

## cronjob


### Overview
Create a cronjob with the specified name.

### Usage

`cronjob NAME --image=image --schedule='0/5 * * * ?' -- [COMMAND] [args...]`


### Example
 Create a cronjob

```shell
kubectl create cronjob my-job --image=busybox
```

 Create a cronjob with command

```shell
kubectl create cronjob my-job --image=busybox -- date
```

 Create a cronjob with schedule

```shell
kubectl create cronjob test-job --image=busybox --schedule="*/1 * * * *"
```




### Flags

<div class="table-responsive kubectl-flags-table"><table class="table table-bordered">
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
    <td>dry-run</td><td></td><td>false</td><td>If true, only print the object that would be sent, without sending it.</td>
    </tr>
    <tr>
    <td>image</td><td></td><td></td><td>Image name to run.</td>
    </tr>
    <tr>
    <td>output</td><td>o</td><td></td><td>Output format. One of: json&#124;yaml&#124;name&#124;go-template&#124;go-template-file&#124;template&#124;templatefile&#124;jsonpath&#124;jsonpath-file.</td>
    </tr>
    <tr>
    <td>restart</td><td></td><td></td><td>job's restart policy. supported values: OnFailure, Never</td>
    </tr>
    <tr>
    <td>save-config</td><td></td><td>false</td><td>If true, the configuration of current object will be saved in its annotation. Otherwise, the annotation will be unchanged. This flag is useful when you want to perform kubectl apply on this object in the future.</td>
    </tr>
    <tr>
    <td>schedule</td><td></td><td></td><td>A schedule in the Cron format the job should be run with.</td>
    </tr>
    <tr>
    <td>template</td><td></td><td></td><td>Template string or path to template file to use when -o=go-template, -o=go-template-file. The template format is golang templates [http://golang.org/pkg/text/template/#pkg-overview].</td>
    </tr>
    <tr>
    <td>validate</td><td></td><td>true</td><td>If true, use a schema to validate the input before sending it</td>
    </tr>
</tbody>
</table></div>



<hr>

## deployment


### Overview
Create a deployment with the specified name.

### Usage

`deployment NAME --image=image [--dry-run]`


### Example
 Create a new deployment named my-dep that runs the busybox image.

```shell
kubectl create deployment my-dep --image=busybox
```




### Flags

<div class="table-responsive kubectl-flags-table"><table class="table table-bordered">
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
    <td>dry-run</td><td></td><td>false</td><td>If true, only print the object that would be sent, without sending it.</td>
    </tr>
    <tr>
    <td>generator</td><td></td><td></td><td>The name of the API generator to use.</td>
    </tr>
    <tr>
    <td>image</td><td></td><td>[]</td><td>Image name to run.</td>
    </tr>
    <tr>
    <td>output</td><td>o</td><td></td><td>Output format. One of: json&#124;yaml&#124;name&#124;go-template&#124;go-template-file&#124;template&#124;templatefile&#124;jsonpath&#124;jsonpath-file.</td>
    </tr>
    <tr>
    <td>save-config</td><td></td><td>false</td><td>If true, the configuration of current object will be saved in its annotation. Otherwise, the annotation will be unchanged. This flag is useful when you want to perform kubectl apply on this object in the future.</td>
    </tr>
    <tr>
    <td>template</td><td></td><td></td><td>Template string or path to template file to use when -o=go-template, -o=go-template-file. The template format is golang templates [http://golang.org/pkg/text/template/#pkg-overview].</td>
    </tr>
    <tr>
    <td>validate</td><td></td><td>true</td><td>If true, use a schema to validate the input before sending it</td>
    </tr>
</tbody>
</table></div>



<hr>

## job


### Overview
Create a job with the specified name.

### Usage

`job NAME --image=image [--from=cronjob/name] -- [COMMAND] [args...]`


### Example
 Create a job

```shell
kubectl create job my-job --image=busybox
```

 Create a job with command

```shell
kubectl create job my-job --image=busybox -- date
```

 Create a job from a CronJob named "a-cronjob"

```shell
kubectl create job test-job --from=cronjob/a-cronjob
```




### Flags

<div class="table-responsive kubectl-flags-table"><table class="table table-bordered">
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
    <td>dry-run</td><td></td><td>false</td><td>If true, only print the object that would be sent, without sending it.</td>
    </tr>
    <tr>
    <td>from</td><td></td><td></td><td>The name of the resource to create a Job from (only cronjob is supported).</td>
    </tr>
    <tr>
    <td>image</td><td></td><td></td><td>Image name to run.</td>
    </tr>
    <tr>
    <td>output</td><td>o</td><td></td><td>Output format. One of: json&#124;yaml&#124;name&#124;go-template&#124;go-template-file&#124;template&#124;templatefile&#124;jsonpath&#124;jsonpath-file.</td>
    </tr>
    <tr>
    <td>save-config</td><td></td><td>false</td><td>If true, the configuration of current object will be saved in its annotation. Otherwise, the annotation will be unchanged. This flag is useful when you want to perform kubectl apply on this object in the future.</td>
    </tr>
    <tr>
    <td>template</td><td></td><td></td><td>Template string or path to template file to use when -o=go-template, -o=go-template-file. The template format is golang templates [http://golang.org/pkg/text/template/#pkg-overview].</td>
    </tr>
    <tr>
    <td>validate</td><td></td><td>true</td><td>If true, use a schema to validate the input before sending it</td>
    </tr>
</tbody>
</table></div>



<hr>

## namespace


### Overview
Create a namespace with the specified name.

### Usage

`namespace NAME [--dry-run]`


### Example
 Create a new namespace named my-namespace

```shell
kubectl create namespace my-namespace
```




### Flags

<div class="table-responsive kubectl-flags-table"><table class="table table-bordered">
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
    <td>dry-run</td><td></td><td>false</td><td>If true, only print the object that would be sent, without sending it.</td>
    </tr>
    <tr>
    <td>generator</td><td></td><td>namespace/v1</td><td>The name of the API generator to use.</td>
    </tr>
    <tr>
    <td>output</td><td>o</td><td></td><td>Output format. One of: json&#124;yaml&#124;name&#124;go-template&#124;go-template-file&#124;template&#124;templatefile&#124;jsonpath&#124;jsonpath-file.</td>
    </tr>
    <tr>
    <td>save-config</td><td></td><td>false</td><td>If true, the configuration of current object will be saved in its annotation. Otherwise, the annotation will be unchanged. This flag is useful when you want to perform kubectl apply on this object in the future.</td>
    </tr>
    <tr>
    <td>template</td><td></td><td></td><td>Template string or path to template file to use when -o=go-template, -o=go-template-file. The template format is golang templates [http://golang.org/pkg/text/template/#pkg-overview].</td>
    </tr>
    <tr>
    <td>validate</td><td></td><td>true</td><td>If true, use a schema to validate the input before sending it</td>
    </tr>
</tbody>
</table></div>



<hr>

## poddisruptionbudget


### Overview
Create a pod disruption budget with the specified name, selector, and desired minimum available pods

### Usage

`poddisruptionbudget NAME --selector=SELECTOR --min-available=N [--dry-run]`


### Example
 Create a pod disruption budget named my-pdb that will select all pods with the app=rails label # and require at least one of them being available at any point in time.

```shell
kubectl create poddisruptionbudget my-pdb --selector=app=rails --min-available=1
```

 Create a pod disruption budget named my-pdb that will select all pods with the app=nginx label # and require at least half of the pods selected to be available at any point in time.

```shell
kubectl create pdb my-pdb --selector=app=nginx --min-available=50%
```




### Flags

<div class="table-responsive kubectl-flags-table"><table class="table table-bordered">
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
    <td>dry-run</td><td></td><td>false</td><td>If true, only print the object that would be sent, without sending it.</td>
    </tr>
    <tr>
    <td>generator</td><td></td><td>poddisruptionbudget/v1beta1/v2</td><td>The name of the API generator to use.</td>
    </tr>
    <tr>
    <td>max-unavailable</td><td></td><td></td><td>The maximum number or percentage of unavailable pods this budget requires.</td>
    </tr>
    <tr>
    <td>min-available</td><td></td><td></td><td>The minimum number or percentage of available pods this budget requires.</td>
    </tr>
    <tr>
    <td>output</td><td>o</td><td></td><td>Output format. One of: json&#124;yaml&#124;name&#124;go-template&#124;go-template-file&#124;template&#124;templatefile&#124;jsonpath&#124;jsonpath-file.</td>
    </tr>
    <tr>
    <td>save-config</td><td></td><td>false</td><td>If true, the configuration of current object will be saved in its annotation. Otherwise, the annotation will be unchanged. This flag is useful when you want to perform kubectl apply on this object in the future.</td>
    </tr>
    <tr>
    <td>selector</td><td></td><td></td><td>A label selector to use for this budget. Only equality-based selector requirements are supported.</td>
    </tr>
    <tr>
    <td>template</td><td></td><td></td><td>Template string or path to template file to use when -o=go-template, -o=go-template-file. The template format is golang templates [http://golang.org/pkg/text/template/#pkg-overview].</td>
    </tr>
    <tr>
    <td>validate</td><td></td><td>true</td><td>If true, use a schema to validate the input before sending it</td>
    </tr>
</tbody>
</table></div>



<hr>

## priorityclass


### Overview
Create a priorityclass with the specified name, value, globalDefault and description

### Usage

`priorityclass NAME --value=VALUE --global-default=BOOL [--dry-run]`


### Example
 Create a priorityclass named high-priority

```shell
kubectl create priorityclass high-priority --value=1000 --description="high priority"
```

 Create a priorityclass named default-priority that considered as the global default priority

```shell
kubectl create priorityclass default-priority --value=1000 --global-default=true --description="default priority"
```

 Create a priorityclass named high-priority that can not preempt pods with lower priority

```shell
kubectl create priorityclass high-priority --value=1000 --description="high priority" --preemption-policy="Never"
```




### Flags

<div class="table-responsive kubectl-flags-table"><table class="table table-bordered">
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
    <td>description</td><td></td><td></td><td>description is an arbitrary string that usually provides guidelines on when this priority class should be used.</td>
    </tr>
    <tr>
    <td>dry-run</td><td></td><td>false</td><td>If true, only print the object that would be sent, without sending it.</td>
    </tr>
    <tr>
    <td>generator</td><td></td><td>priorityclass/v1</td><td>The name of the API generator to use.</td>
    </tr>
    <tr>
    <td>global-default</td><td></td><td>false</td><td>global-default specifies whether this PriorityClass should be considered as the default priority.</td>
    </tr>
    <tr>
    <td>output</td><td>o</td><td></td><td>Output format. One of: json&#124;yaml&#124;name&#124;go-template&#124;go-template-file&#124;template&#124;templatefile&#124;jsonpath&#124;jsonpath-file.</td>
    </tr>
    <tr>
    <td>preemption-policy</td><td></td><td></td><td>preemption-policy is the policy for preempting pods with lower priority.</td>
    </tr>
    <tr>
    <td>save-config</td><td></td><td>false</td><td>If true, the configuration of current object will be saved in its annotation. Otherwise, the annotation will be unchanged. This flag is useful when you want to perform kubectl apply on this object in the future.</td>
    </tr>
    <tr>
    <td>template</td><td></td><td></td><td>Template string or path to template file to use when -o=go-template, -o=go-template-file. The template format is golang templates [http://golang.org/pkg/text/template/#pkg-overview].</td>
    </tr>
    <tr>
    <td>validate</td><td></td><td>true</td><td>If true, use a schema to validate the input before sending it</td>
    </tr>
    <tr>
    <td>value</td><td></td><td>0</td><td>the value of this priority class.</td>
    </tr>
</tbody>
</table></div>



<hr>

## quota


### Overview
Create a resourcequota with the specified name, hard limits and optional scopes

### Usage

`quota NAME [--hard=key1=value1,key2=value2] [--scopes=Scope1,Scope2] [--dry-run=bool]`


### Example
 Create a new resourcequota named my-quota

```shell
kubectl create quota my-quota --hard=cpu=1,memory=1G,pods=2,services=3,replicationcontrollers=2,resourcequotas=1,secrets=5,persistentvolumeclaims=10
```

 Create a new resourcequota named best-effort

```shell
kubectl create quota best-effort --hard=pods=100 --scopes=BestEffort
```




### Flags

<div class="table-responsive kubectl-flags-table"><table class="table table-bordered">
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
    <td>dry-run</td><td></td><td>false</td><td>If true, only print the object that would be sent, without sending it.</td>
    </tr>
    <tr>
    <td>generator</td><td></td><td>resourcequotas/v1</td><td>The name of the API generator to use.</td>
    </tr>
    <tr>
    <td>hard</td><td></td><td></td><td>A comma-delimited set of resource=quantity pairs that define a hard limit.</td>
    </tr>
    <tr>
    <td>output</td><td>o</td><td></td><td>Output format. One of: json&#124;yaml&#124;name&#124;go-template&#124;go-template-file&#124;template&#124;templatefile&#124;jsonpath&#124;jsonpath-file.</td>
    </tr>
    <tr>
    <td>save-config</td><td></td><td>false</td><td>If true, the configuration of current object will be saved in its annotation. Otherwise, the annotation will be unchanged. This flag is useful when you want to perform kubectl apply on this object in the future.</td>
    </tr>
    <tr>
    <td>scopes</td><td></td><td></td><td>A comma-delimited set of quota scopes that must all match each object tracked by the quota.</td>
    </tr>
    <tr>
    <td>template</td><td></td><td></td><td>Template string or path to template file to use when -o=go-template, -o=go-template-file. The template format is golang templates [http://golang.org/pkg/text/template/#pkg-overview].</td>
    </tr>
    <tr>
    <td>validate</td><td></td><td>true</td><td>If true, use a schema to validate the input before sending it</td>
    </tr>
</tbody>
</table></div>



<hr>

## role


### Overview
Create a role with single rule.

### Usage

`role NAME --verb=verb --resource=resource.group/subresource [--resource-name=resourcename] [--dry-run]`


### Example
 Create a Role named "pod-reader" that allows user to perform "get", "watch" and "list" on pods

```shell
kubectl create role pod-reader --verb=get --verb=list --verb=watch --resource=pods
```

 Create a Role named "pod-reader" with ResourceName specified

```shell
kubectl create role pod-reader --verb=get --resource=pods --resource-name=readablepod --resource-name=anotherpod
```

 Create a Role named "foo" with API Group specified

```shell
kubectl create role foo --verb=get,list,watch --resource=rs.extensions
```

 Create a Role named "foo" with SubResource specified

```shell
kubectl create role foo --verb=get,list,watch --resource=pods,pods/status
```




### Flags

<div class="table-responsive kubectl-flags-table"><table class="table table-bordered">
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
    <td>dry-run</td><td></td><td>false</td><td>If true, only print the object that would be sent, without sending it.</td>
    </tr>
    <tr>
    <td>output</td><td>o</td><td></td><td>Output format. One of: json&#124;yaml&#124;name&#124;go-template&#124;go-template-file&#124;template&#124;templatefile&#124;jsonpath&#124;jsonpath-file.</td>
    </tr>
    <tr>
    <td>resource</td><td></td><td>[]</td><td>Resource that the rule applies to</td>
    </tr>
    <tr>
    <td>resource-name</td><td></td><td>[]</td><td>Resource in the white list that the rule applies to, repeat this flag for multiple items</td>
    </tr>
    <tr>
    <td>save-config</td><td></td><td>false</td><td>If true, the configuration of current object will be saved in its annotation. Otherwise, the annotation will be unchanged. This flag is useful when you want to perform kubectl apply on this object in the future.</td>
    </tr>
    <tr>
    <td>template</td><td></td><td></td><td>Template string or path to template file to use when -o=go-template, -o=go-template-file. The template format is golang templates [http://golang.org/pkg/text/template/#pkg-overview].</td>
    </tr>
    <tr>
    <td>validate</td><td></td><td>true</td><td>If true, use a schema to validate the input before sending it</td>
    </tr>
    <tr>
    <td>verb</td><td></td><td>[]</td><td>Verb that applies to the resources contained in the rule</td>
    </tr>
</tbody>
</table></div>



<hr>

## rolebinding


### Overview
Create a RoleBinding for a particular Role or ClusterRole.

### Usage

`rolebinding NAME --clusterrole=NAME|--role=NAME [--user=username] [--group=groupname] [--serviceaccount=namespace:serviceaccountname] [--dry-run]`


### Example
 Create a RoleBinding for user1, user2, and group1 using the admin ClusterRole

```shell
kubectl create rolebinding admin --clusterrole=admin --user=user1 --user=user2 --group=group1
```




### Flags

<div class="table-responsive kubectl-flags-table"><table class="table table-bordered">
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
    <td>clusterrole</td><td></td><td></td><td>ClusterRole this RoleBinding should reference</td>
    </tr>
    <tr>
    <td>dry-run</td><td></td><td>false</td><td>If true, only print the object that would be sent, without sending it.</td>
    </tr>
    <tr>
    <td>generator</td><td></td><td>rolebinding.rbac.authorization.k8s.io/v1alpha1</td><td>The name of the API generator to use.</td>
    </tr>
    <tr>
    <td>group</td><td></td><td>[]</td><td>Groups to bind to the role</td>
    </tr>
    <tr>
    <td>output</td><td>o</td><td></td><td>Output format. One of: json&#124;yaml&#124;name&#124;go-template&#124;go-template-file&#124;template&#124;templatefile&#124;jsonpath&#124;jsonpath-file.</td>
    </tr>
    <tr>
    <td>role</td><td></td><td></td><td>Role this RoleBinding should reference</td>
    </tr>
    <tr>
    <td>save-config</td><td></td><td>false</td><td>If true, the configuration of current object will be saved in its annotation. Otherwise, the annotation will be unchanged. This flag is useful when you want to perform kubectl apply on this object in the future.</td>
    </tr>
    <tr>
    <td>serviceaccount</td><td></td><td>[]</td><td>Service accounts to bind to the role, in the format <namespace>:<name></td>
    </tr>
    <tr>
    <td>template</td><td></td><td></td><td>Template string or path to template file to use when -o=go-template, -o=go-template-file. The template format is golang templates [http://golang.org/pkg/text/template/#pkg-overview].</td>
    </tr>
    <tr>
    <td>validate</td><td></td><td>true</td><td>If true, use a schema to validate the input before sending it</td>
    </tr>
</tbody>
</table></div>



<hr>

## secret


### Overview
Create a secret using specified subcommand.

### Usage

`secret`






<hr>

## secret docker-registry


### Overview
Create a new secret for use with Docker registries.
  
  Dockercfg secrets are used to authenticate against Docker registries.
  
  When using the Docker command line to push images, you can authenticate to a given registry by running:
    '$ docker login DOCKER_REGISTRY_SERVER --username=DOCKER_USER --password=DOCKER_PASSWORD --email=DOCKER_EMAIL'.
  
 That produces a ~/.dockercfg file that is used by subsequent 'docker push' and 'docker pull' commands to authenticate to the registry. The email address is optional.

  When creating applications, you may have a Docker registry that requires authentication.  In order for the
  nodes to pull images on your behalf, they have to have the credentials.  You can provide this information
  by creating a dockercfg secret and attaching it to your service account.

### Usage

`docker-registry NAME --docker-username=user --docker-password=password --docker-email=email [--docker-server=string] [--from-literal=key1=value1] [--dry-run]`


### Example
 If you don't already have a .dockercfg file, you can create a dockercfg secret directly by using:

```shell
kubectl create secret docker-registry my-secret --docker-server=DOCKER_REGISTRY_SERVER --docker-username=DOCKER_USER --docker-password=DOCKER_PASSWORD --docker-email=DOCKER_EMAIL
```




### Flags

<div class="table-responsive kubectl-flags-table"><table class="table table-bordered">
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
    <td>append-hash</td><td></td><td>false</td><td>Append a hash of the secret to its name.</td>
    </tr>
    <tr>
    <td>docker-email</td><td></td><td></td><td>Email for Docker registry</td>
    </tr>
    <tr>
    <td>docker-password</td><td></td><td></td><td>Password for Docker registry authentication</td>
    </tr>
    <tr>
    <td>docker-server</td><td></td><td>https://index.docker.io/v1/</td><td>Server location for Docker registry</td>
    </tr>
    <tr>
    <td>docker-username</td><td></td><td></td><td>Username for Docker registry authentication</td>
    </tr>
    <tr>
    <td>dry-run</td><td></td><td>false</td><td>If true, only print the object that would be sent, without sending it.</td>
    </tr>
    <tr>
    <td>from-file</td><td></td><td>[]</td><td>Key files can be specified using their file path, in which case a default name will be given to them, or optionally with a name and file path, in which case the given name will be used.  Specifying a directory will iterate each named file in the directory that is a valid secret key.</td>
    </tr>
    <tr>
    <td>generator</td><td></td><td>secret-for-docker-registry/v1</td><td>The name of the API generator to use.</td>
    </tr>
    <tr>
    <td>output</td><td>o</td><td></td><td>Output format. One of: json&#124;yaml&#124;name&#124;go-template&#124;go-template-file&#124;template&#124;templatefile&#124;jsonpath&#124;jsonpath-file.</td>
    </tr>
    <tr>
    <td>save-config</td><td></td><td>false</td><td>If true, the configuration of current object will be saved in its annotation. Otherwise, the annotation will be unchanged. This flag is useful when you want to perform kubectl apply on this object in the future.</td>
    </tr>
    <tr>
    <td>template</td><td></td><td></td><td>Template string or path to template file to use when -o=go-template, -o=go-template-file. The template format is golang templates [http://golang.org/pkg/text/template/#pkg-overview].</td>
    </tr>
    <tr>
    <td>validate</td><td></td><td>true</td><td>If true, use a schema to validate the input before sending it</td>
    </tr>
</tbody>
</table></div>



<hr>

## secret generic


### Overview
Create a secret based on a file, directory, or specified literal value.

 A single secret may package one or more key/value pairs.

 When creating a secret based on a file, the key will default to the basename of the file, and the value will default to the file content. If the basename is an invalid key or you wish to chose your own, you may specify an alternate key.

 When creating a secret based on a directory, each file whose basename is a valid key in the directory will be packaged into the secret. Any directory entries except regular files are ignored (e.g. subdirectories, symlinks, devices, pipes, etc).

### Usage

`generic NAME [--type=string] [--from-file=[key=]source] [--from-literal=key1=value1] [--dry-run]`


### Example
 Create a new secret named my-secret with keys for each file in folder bar

```shell
kubectl create secret generic my-secret --from-file=path/to/bar
```

 Create a new secret named my-secret with specified keys instead of names on disk

```shell
kubectl create secret generic my-secret --from-file=ssh-privatekey=path/to/id_rsa --from-file=ssh-publickey=path/to/id_rsa.pub
```

 Create a new secret named my-secret with key1=supersecret and key2=topsecret

```shell
kubectl create secret generic my-secret --from-literal=key1=supersecret --from-literal=key2=topsecret
```

 Create a new secret named my-secret using a combination of a file and a literal

```shell
kubectl create secret generic my-secret --from-file=ssh-privatekey=path/to/id_rsa --from-literal=passphrase=topsecret
```

 Create a new secret named my-secret from an env file

```shell
kubectl create secret generic my-secret --from-env-file=path/to/bar.env
```




### Flags

<div class="table-responsive kubectl-flags-table"><table class="table table-bordered">
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
    <td>append-hash</td><td></td><td>false</td><td>Append a hash of the secret to its name.</td>
    </tr>
    <tr>
    <td>dry-run</td><td></td><td>false</td><td>If true, only print the object that would be sent, without sending it.</td>
    </tr>
    <tr>
    <td>from-env-file</td><td></td><td></td><td>Specify the path to a file to read lines of key=val pairs to create a secret (i.e. a Docker .env file).</td>
    </tr>
    <tr>
    <td>from-file</td><td></td><td>[]</td><td>Key files can be specified using their file path, in which case a default name will be given to them, or optionally with a name and file path, in which case the given name will be used.  Specifying a directory will iterate each named file in the directory that is a valid secret key.</td>
    </tr>
    <tr>
    <td>from-literal</td><td></td><td>[]</td><td>Specify a key and literal value to insert in secret (i.e. mykey=somevalue)</td>
    </tr>
    <tr>
    <td>generator</td><td></td><td>secret/v1</td><td>The name of the API generator to use.</td>
    </tr>
    <tr>
    <td>output</td><td>o</td><td></td><td>Output format. One of: json&#124;yaml&#124;name&#124;go-template&#124;go-template-file&#124;template&#124;templatefile&#124;jsonpath&#124;jsonpath-file.</td>
    </tr>
    <tr>
    <td>save-config</td><td></td><td>false</td><td>If true, the configuration of current object will be saved in its annotation. Otherwise, the annotation will be unchanged. This flag is useful when you want to perform kubectl apply on this object in the future.</td>
    </tr>
    <tr>
    <td>template</td><td></td><td></td><td>Template string or path to template file to use when -o=go-template, -o=go-template-file. The template format is golang templates [http://golang.org/pkg/text/template/#pkg-overview].</td>
    </tr>
    <tr>
    <td>type</td><td></td><td></td><td>The type of secret to create</td>
    </tr>
    <tr>
    <td>validate</td><td></td><td>true</td><td>If true, use a schema to validate the input before sending it</td>
    </tr>
</tbody>
</table></div>



<hr>

## secret tls


### Overview
Create a TLS secret from the given public/private key pair.

 The public/private key pair must exist before hand. The public key certificate must be .PEM encoded and match the given private key.

### Usage

`tls NAME --cert=path/to/cert/file --key=path/to/key/file [--dry-run]`


### Example
 Create a new TLS secret named tls-secret with the given key pair:

```shell
kubectl create secret tls tls-secret --cert=path/to/tls.cert --key=path/to/tls.key
```




### Flags

<div class="table-responsive kubectl-flags-table"><table class="table table-bordered">
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
    <td>append-hash</td><td></td><td>false</td><td>Append a hash of the secret to its name.</td>
    </tr>
    <tr>
    <td>cert</td><td></td><td></td><td>Path to PEM encoded public key certificate.</td>
    </tr>
    <tr>
    <td>dry-run</td><td></td><td>false</td><td>If true, only print the object that would be sent, without sending it.</td>
    </tr>
    <tr>
    <td>generator</td><td></td><td>secret-for-tls/v1</td><td>The name of the API generator to use.</td>
    </tr>
    <tr>
    <td>key</td><td></td><td></td><td>Path to private key associated with given certificate.</td>
    </tr>
    <tr>
    <td>output</td><td>o</td><td></td><td>Output format. One of: json&#124;yaml&#124;name&#124;go-template&#124;go-template-file&#124;template&#124;templatefile&#124;jsonpath&#124;jsonpath-file.</td>
    </tr>
    <tr>
    <td>save-config</td><td></td><td>false</td><td>If true, the configuration of current object will be saved in its annotation. Otherwise, the annotation will be unchanged. This flag is useful when you want to perform kubectl apply on this object in the future.</td>
    </tr>
    <tr>
    <td>template</td><td></td><td></td><td>Template string or path to template file to use when -o=go-template, -o=go-template-file. The template format is golang templates [http://golang.org/pkg/text/template/#pkg-overview].</td>
    </tr>
    <tr>
    <td>validate</td><td></td><td>true</td><td>If true, use a schema to validate the input before sending it</td>
    </tr>
</tbody>
</table></div>



<hr>

## service


### Overview
Create a service using specified subcommand.

### Usage

`service`






<hr>

## service clusterip


### Overview
Create a ClusterIP service with the specified name.

### Usage

`clusterip NAME [--tcp=<port>:<targetPort>] [--dry-run]`


### Example
 Create a new ClusterIP service named my-cs

```shell
kubectl create service clusterip my-cs --tcp=5678:8080
```

 Create a new ClusterIP service named my-cs (in headless mode)

```shell
kubectl create service clusterip my-cs --clusterip="None"
```




### Flags

<div class="table-responsive kubectl-flags-table"><table class="table table-bordered">
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
    <td>clusterip</td><td></td><td></td><td>Assign your own ClusterIP or set to 'None' for a 'headless' service (no loadbalancing).</td>
    </tr>
    <tr>
    <td>dry-run</td><td></td><td>false</td><td>If true, only print the object that would be sent, without sending it.</td>
    </tr>
    <tr>
    <td>generator</td><td></td><td>service-clusterip/v1</td><td>The name of the API generator to use.</td>
    </tr>
    <tr>
    <td>output</td><td>o</td><td></td><td>Output format. One of: json&#124;yaml&#124;name&#124;go-template&#124;go-template-file&#124;template&#124;templatefile&#124;jsonpath&#124;jsonpath-file.</td>
    </tr>
    <tr>
    <td>save-config</td><td></td><td>false</td><td>If true, the configuration of current object will be saved in its annotation. Otherwise, the annotation will be unchanged. This flag is useful when you want to perform kubectl apply on this object in the future.</td>
    </tr>
    <tr>
    <td>tcp</td><td></td><td>[]</td><td>Port pairs can be specified as '<port>:<targetPort>'.</td>
    </tr>
    <tr>
    <td>template</td><td></td><td></td><td>Template string or path to template file to use when -o=go-template, -o=go-template-file. The template format is golang templates [http://golang.org/pkg/text/template/#pkg-overview].</td>
    </tr>
    <tr>
    <td>validate</td><td></td><td>true</td><td>If true, use a schema to validate the input before sending it</td>
    </tr>
</tbody>
</table></div>



<hr>

## service externalname


### Overview
Create an ExternalName service with the specified name.

 ExternalName service references to an external DNS address instead of only pods, which will allow application authors to reference services that exist off platform, on other clusters, or locally.

### Usage

`externalname NAME --external-name external.name [--dry-run]`


### Example
 Create a new ExternalName service named my-ns

```shell
kubectl create service externalname my-ns --external-name bar.com
```




### Flags

<div class="table-responsive kubectl-flags-table"><table class="table table-bordered">
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
    <td>dry-run</td><td></td><td>false</td><td>If true, only print the object that would be sent, without sending it.</td>
    </tr>
    <tr>
    <td>external-name</td><td></td><td></td><td>External name of service</td>
    </tr>
    <tr>
    <td>generator</td><td></td><td>service-externalname/v1</td><td>The name of the API generator to use.</td>
    </tr>
    <tr>
    <td>output</td><td>o</td><td></td><td>Output format. One of: json&#124;yaml&#124;name&#124;go-template&#124;go-template-file&#124;template&#124;templatefile&#124;jsonpath&#124;jsonpath-file.</td>
    </tr>
    <tr>
    <td>save-config</td><td></td><td>false</td><td>If true, the configuration of current object will be saved in its annotation. Otherwise, the annotation will be unchanged. This flag is useful when you want to perform kubectl apply on this object in the future.</td>
    </tr>
    <tr>
    <td>tcp</td><td></td><td>[]</td><td>Port pairs can be specified as '<port>:<targetPort>'.</td>
    </tr>
    <tr>
    <td>template</td><td></td><td></td><td>Template string or path to template file to use when -o=go-template, -o=go-template-file. The template format is golang templates [http://golang.org/pkg/text/template/#pkg-overview].</td>
    </tr>
    <tr>
    <td>validate</td><td></td><td>true</td><td>If true, use a schema to validate the input before sending it</td>
    </tr>
</tbody>
</table></div>



<hr>

## service loadbalancer


### Overview
Create a LoadBalancer service with the specified name.

### Usage

`loadbalancer NAME [--tcp=port:targetPort] [--dry-run]`


### Example
 Create a new LoadBalancer service named my-lbs

```shell
kubectl create service loadbalancer my-lbs --tcp=5678:8080
```




### Flags

<div class="table-responsive kubectl-flags-table"><table class="table table-bordered">
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
    <td>dry-run</td><td></td><td>false</td><td>If true, only print the object that would be sent, without sending it.</td>
    </tr>
    <tr>
    <td>generator</td><td></td><td>service-loadbalancer/v1</td><td>The name of the API generator to use.</td>
    </tr>
    <tr>
    <td>output</td><td>o</td><td></td><td>Output format. One of: json&#124;yaml&#124;name&#124;go-template&#124;go-template-file&#124;template&#124;templatefile&#124;jsonpath&#124;jsonpath-file.</td>
    </tr>
    <tr>
    <td>save-config</td><td></td><td>false</td><td>If true, the configuration of current object will be saved in its annotation. Otherwise, the annotation will be unchanged. This flag is useful when you want to perform kubectl apply on this object in the future.</td>
    </tr>
    <tr>
    <td>tcp</td><td></td><td>[]</td><td>Port pairs can be specified as '<port>:<targetPort>'.</td>
    </tr>
    <tr>
    <td>template</td><td></td><td></td><td>Template string or path to template file to use when -o=go-template, -o=go-template-file. The template format is golang templates [http://golang.org/pkg/text/template/#pkg-overview].</td>
    </tr>
    <tr>
    <td>validate</td><td></td><td>true</td><td>If true, use a schema to validate the input before sending it</td>
    </tr>
</tbody>
</table></div>



<hr>

## service nodeport


### Overview
Create a NodePort service with the specified name.

### Usage

`nodeport NAME [--tcp=port:targetPort] [--dry-run]`


### Example
 Create a new NodePort service named my-ns

```shell
kubectl create service nodeport my-ns --tcp=5678:8080
```




### Flags

<div class="table-responsive kubectl-flags-table"><table class="table table-bordered">
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
    <td>dry-run</td><td></td><td>false</td><td>If true, only print the object that would be sent, without sending it.</td>
    </tr>
    <tr>
    <td>generator</td><td></td><td>service-nodeport/v1</td><td>The name of the API generator to use.</td>
    </tr>
    <tr>
    <td>node-port</td><td></td><td>0</td><td>Port used to expose the service on each node in a cluster.</td>
    </tr>
    <tr>
    <td>output</td><td>o</td><td></td><td>Output format. One of: json&#124;yaml&#124;name&#124;go-template&#124;go-template-file&#124;template&#124;templatefile&#124;jsonpath&#124;jsonpath-file.</td>
    </tr>
    <tr>
    <td>save-config</td><td></td><td>false</td><td>If true, the configuration of current object will be saved in its annotation. Otherwise, the annotation will be unchanged. This flag is useful when you want to perform kubectl apply on this object in the future.</td>
    </tr>
    <tr>
    <td>tcp</td><td></td><td>[]</td><td>Port pairs can be specified as '<port>:<targetPort>'.</td>
    </tr>
    <tr>
    <td>template</td><td></td><td></td><td>Template string or path to template file to use when -o=go-template, -o=go-template-file. The template format is golang templates [http://golang.org/pkg/text/template/#pkg-overview].</td>
    </tr>
    <tr>
    <td>validate</td><td></td><td>true</td><td>If true, use a schema to validate the input before sending it</td>
    </tr>
</tbody>
</table></div>



<hr>

## serviceaccount


### Overview
Create a service account with the specified name.

### Usage

`serviceaccount NAME [--dry-run]`


### Example
 Create a new service account named my-service-account

```shell
kubectl create serviceaccount my-service-account
```




### Flags

<div class="table-responsive kubectl-flags-table"><table class="table table-bordered">
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
    <td>dry-run</td><td></td><td>false</td><td>If true, only print the object that would be sent, without sending it.</td>
    </tr>
    <tr>
    <td>generator</td><td></td><td>serviceaccount/v1</td><td>The name of the API generator to use.</td>
    </tr>
    <tr>
    <td>output</td><td>o</td><td></td><td>Output format. One of: json&#124;yaml&#124;name&#124;go-template&#124;go-template-file&#124;template&#124;templatefile&#124;jsonpath&#124;jsonpath-file.</td>
    </tr>
    <tr>
    <td>save-config</td><td></td><td>false</td><td>If true, the configuration of current object will be saved in its annotation. Otherwise, the annotation will be unchanged. This flag is useful when you want to perform kubectl apply on this object in the future.</td>
    </tr>
    <tr>
    <td>template</td><td></td><td></td><td>Template string or path to template file to use when -o=go-template, -o=go-template-file. The template format is golang templates [http://golang.org/pkg/text/template/#pkg-overview].</td>
    </tr>
    <tr>
    <td>validate</td><td></td><td>true</td><td>If true, use a schema to validate the input before sending it</td>
    </tr>
</tbody>
</table></div>




<hr>


### Version

<div class="kubectl-reference-copyright">

<a href="https://github.com/kubernetes/kubernetes">Kubectl Reference Docs  
{{< param "fullversion" >}}   &#xa9;Copyright 2019 The Kubernetes Authors</a>

</div>

