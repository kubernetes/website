---
title: set
content_template: templates/tool-reference
---

### Overview
Configure application resources

 These commands help you make changes to existing application resources.

### Usage

`set SUBCOMMAND`






<hr>

## env


### Overview
Update environment variables on a pod template.

 List environment variable definitions in one or more pods, pod templates. Add, update, or remove container environment variable definitions in one or more pod templates (within replication controllers or deployment configurations). View or modify the environment variable definitions on all containers in the specified pods or pod templates, or just those that match a wildcard.

 If "--env -" is passed, environment variables can be read from STDIN using the standard env syntax.

 Possible resources include (case insensitive):

  pod (po), replicationcontroller (rc), deployment (deploy), daemonset (ds), job, replicaset (rs)

### Usage

`env RESOURCE/NAME KEY_1=VAL_1 ... KEY_N=VAL_N`


### Example
 Update deployment 'registry' with a new environment variable

```shell
kubectl set env deployment/registry STORAGE_DIR=/local
```

 List the environment variables defined on a deployments 'sample-build'

```shell
kubectl set env deployment/sample-build --list
```

 List the environment variables defined on all pods

```shell
kubectl set env pods --all --list
```

 Output modified deployment in YAML, and does not alter the object on the server

```shell
kubectl set env deployment/sample-build STORAGE_DIR=/data -o yaml
```

 Update all containers in all replication controllers in the project to have ENV=prod

```shell
kubectl set env rc --all ENV=prod
```

 Import environment from a secret

```shell
kubectl set env --from=secret/mysecret deployment/myapp
```

 Import environment from a config map with a prefix

```shell
kubectl set env --from=configmap/myconfigmap --prefix=MYSQL_ deployment/myapp
```

 Import specific keys from a config map

```shell
kubectl set env --keys=my-example-key --from=configmap/myconfigmap deployment/myapp
```

 Remove the environment variable ENV from container 'c1' in all deployment configs

```shell
kubectl set env deployments --all --containers="c1" ENV-
```

 Remove the environment variable ENV from a deployment definition on disk and # update the deployment config on the server

```shell
kubectl set env -f deploy.json ENV-
```

 Set some of the local shell environment into a deployment config on the server

```shell
env | grep RAILS_ | kubectl set env -e - deployment/registry
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
    <td>all</td><td></td><td>false</td><td>If true, select all resources in the namespace of the specified resource types</td>
    </tr>
    <tr>
    <td>allow-missing-template-keys</td><td></td><td>true</td><td>If true, ignore any errors in templates when a field or map key is missing in the template. Only applies to golang and jsonpath output formats.</td>
    </tr>
    <tr>
    <td>containers</td><td>c</td><td>*</td><td>The names of containers in the selected pod templates to change - may use wildcards</td>
    </tr>
    <tr>
    <td>dry-run</td><td></td><td>false</td><td>If true, only print the object that would be sent, without sending it.</td>
    </tr>
    <tr>
    <td>env</td><td>e</td><td>[]</td><td>Specify a key-value pair for an environment variable to set into each container.</td>
    </tr>
    <tr>
    <td>filename</td><td>f</td><td>[]</td><td>Filename, directory, or URL to files the resource to update the env</td>
    </tr>
    <tr>
    <td>from</td><td></td><td></td><td>The name of a resource from which to inject environment variables</td>
    </tr>
    <tr>
    <td>keys</td><td></td><td>[]</td><td>Comma-separated list of keys to import from specified resource</td>
    </tr>
    <tr>
    <td>kustomize</td><td>k</td><td></td><td>Process the kustomization directory. This flag can't be used together with -f or -R.</td>
    </tr>
    <tr>
    <td>list</td><td></td><td>false</td><td>If true, display the environment and any changes in the standard format. this flag will removed when we have kubectl view env.</td>
    </tr>
    <tr>
    <td>local</td><td></td><td>false</td><td>If true, set env will NOT contact api-server but run locally.</td>
    </tr>
    <tr>
    <td>output</td><td>o</td><td></td><td>Output format. One of: json&#124;yaml&#124;name&#124;go-template&#124;go-template-file&#124;template&#124;templatefile&#124;jsonpath&#124;jsonpath-file.</td>
    </tr>
    <tr>
    <td>overwrite</td><td></td><td>true</td><td>If true, allow environment to be overwritten, otherwise reject updates that overwrite existing environment.</td>
    </tr>
    <tr>
    <td>prefix</td><td></td><td></td><td>Prefix to append to variable names</td>
    </tr>
    <tr>
    <td>recursive</td><td>R</td><td>false</td><td>Process the directory used in -f, --filename recursively. Useful when you want to manage related manifests organized within the same directory.</td>
    </tr>
    <tr>
    <td>resolve</td><td></td><td>false</td><td>If true, show secret or configmap references when listing variables</td>
    </tr>
    <tr>
    <td>selector</td><td>l</td><td></td><td>Selector (label query) to filter on</td>
    </tr>
    <tr>
    <td>template</td><td></td><td></td><td>Template string or path to template file to use when -o=go-template, -o=go-template-file. The template format is golang templates [http://golang.org/pkg/text/template/#pkg-overview].</td>
    </tr>
</tbody>
</table></div>



<hr>

## image


### Overview
Update existing container image(s) of resources.

 Possible resources include (case insensitive):

  pod (po), replicationcontroller (rc), deployment (deploy), daemonset (ds), replicaset (rs)

### Usage

`image (-f FILENAME | TYPE NAME) CONTAINER_NAME_1=CONTAINER_IMAGE_1 ... CONTAINER_NAME_N=CONTAINER_IMAGE_N`


### Example
 Set a deployment's nginx container image to 'nginx:1.9.1', and its busybox container image to 'busybox'.

```shell
kubectl set image deployment/nginx busybox=busybox nginx=nginx:1.9.1
```

 Update all deployments' and rc's nginx container's image to 'nginx:1.9.1'

```shell
kubectl set image deployments,rc nginx=nginx:1.9.1 --all
```

 Update image of all containers of daemonset abc to 'nginx:1.9.1'

```shell
kubectl set image daemonset abc *=nginx:1.9.1
```

 Print result (in yaml format) of updating nginx container image from local file, without hitting the server

```shell
kubectl set image -f path/to/file.yaml nginx=nginx:1.9.1 --local -o yaml
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
    <td>all</td><td></td><td>false</td><td>Select all resources, including uninitialized ones, in the namespace of the specified resource types</td>
    </tr>
    <tr>
    <td>allow-missing-template-keys</td><td></td><td>true</td><td>If true, ignore any errors in templates when a field or map key is missing in the template. Only applies to golang and jsonpath output formats.</td>
    </tr>
    <tr>
    <td>dry-run</td><td></td><td>false</td><td>If true, only print the object that would be sent, without sending it.</td>
    </tr>
    <tr>
    <td>filename</td><td>f</td><td>[]</td><td>Filename, directory, or URL to files identifying the resource to get from a server.</td>
    </tr>
    <tr>
    <td>include-uninitialized</td><td></td><td>false</td><td>If true, the kubectl command applies to uninitialized objects. If explicitly set to false, this flag overrides other flags that make the kubectl commands apply to uninitialized objects, e.g., "--all". Objects with empty metadata.initializers are regarded as initialized.</td>
    </tr>
    <tr>
    <td>kustomize</td><td>k</td><td></td><td>Process the kustomization directory. This flag can't be used together with -f or -R.</td>
    </tr>
    <tr>
    <td>local</td><td></td><td>false</td><td>If true, set image will NOT contact api-server but run locally.</td>
    </tr>
    <tr>
    <td>output</td><td>o</td><td></td><td>Output format. One of: json&#124;yaml&#124;name&#124;go-template&#124;go-template-file&#124;template&#124;templatefile&#124;jsonpath&#124;jsonpath-file.</td>
    </tr>
    <tr>
    <td>record</td><td></td><td>false</td><td>Record current kubectl command in the resource annotation. If set to false, do not record the command. If set to true, record the command. If not set, default to updating the existing annotation value only if one already exists.</td>
    </tr>
    <tr>
    <td>recursive</td><td>R</td><td>false</td><td>Process the directory used in -f, --filename recursively. Useful when you want to manage related manifests organized within the same directory.</td>
    </tr>
    <tr>
    <td>selector</td><td>l</td><td></td><td>Selector (label query) to filter on, not including uninitialized ones, supports '=', '==', and '!='.(e.g. -l key1=value1,key2=value2)</td>
    </tr>
    <tr>
    <td>template</td><td></td><td></td><td>Template string or path to template file to use when -o=go-template, -o=go-template-file. The template format is golang templates [http://golang.org/pkg/text/template/#pkg-overview].</td>
    </tr>
</tbody>
</table></div>



<hr>

## resources


### Overview
Specify compute resource requirements (cpu, memory) for any resource that defines a pod template.  If a pod is successfully scheduled, it is guaranteed the amount of resource requested, but may burst up to its specified limits.

 for each compute resource, if a limit is specified and a request is omitted, the request will default to the limit.

 Possible resources include (case insensitive): Use "kubectl api-resources" for a complete list of supported resources..

### Usage

`resources (-f FILENAME | TYPE NAME)  ([--limits=LIMITS & --requests=REQUESTS]`


### Example
 Set a deployments nginx container cpu limits to "200m" and memory to "512Mi"

```shell
kubectl set resources deployment nginx -c=nginx --limits=cpu=200m,memory=512Mi
```

 Set the resource request and limits for all containers in nginx

```shell
kubectl set resources deployment nginx --limits=cpu=200m,memory=512Mi --requests=cpu=100m,memory=256Mi
```

 Remove the resource requests for resources on containers in nginx

```shell
kubectl set resources deployment nginx --limits=cpu=0,memory=0 --requests=cpu=0,memory=0
```

 Print the result (in yaml format) of updating nginx container limits from a local, without hitting the server

```shell
kubectl set resources -f path/to/file.yaml --limits=cpu=200m,memory=512Mi --local -o yaml
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
    <td>all</td><td></td><td>false</td><td>Select all resources, including uninitialized ones, in the namespace of the specified resource types</td>
    </tr>
    <tr>
    <td>allow-missing-template-keys</td><td></td><td>true</td><td>If true, ignore any errors in templates when a field or map key is missing in the template. Only applies to golang and jsonpath output formats.</td>
    </tr>
    <tr>
    <td>containers</td><td>c</td><td>*</td><td>The names of containers in the selected pod templates to change, all containers are selected by default - may use wildcards</td>
    </tr>
    <tr>
    <td>dry-run</td><td></td><td>false</td><td>If true, only print the object that would be sent, without sending it.</td>
    </tr>
    <tr>
    <td>filename</td><td>f</td><td>[]</td><td>Filename, directory, or URL to files identifying the resource to get from a server.</td>
    </tr>
    <tr>
    <td>include-uninitialized</td><td></td><td>false</td><td>If true, the kubectl command applies to uninitialized objects. If explicitly set to false, this flag overrides other flags that make the kubectl commands apply to uninitialized objects, e.g., "--all". Objects with empty metadata.initializers are regarded as initialized.</td>
    </tr>
    <tr>
    <td>kustomize</td><td>k</td><td></td><td>Process the kustomization directory. This flag can't be used together with -f or -R.</td>
    </tr>
    <tr>
    <td>limits</td><td></td><td></td><td>The resource requirement requests for this container.  For example, 'cpu=100m,memory=256Mi'.  Note that server side components may assign requests depending on the server configuration, such as limit ranges.</td>
    </tr>
    <tr>
    <td>local</td><td></td><td>false</td><td>If true, set resources will NOT contact api-server but run locally.</td>
    </tr>
    <tr>
    <td>output</td><td>o</td><td></td><td>Output format. One of: json&#124;yaml&#124;name&#124;go-template&#124;go-template-file&#124;template&#124;templatefile&#124;jsonpath&#124;jsonpath-file.</td>
    </tr>
    <tr>
    <td>record</td><td></td><td>false</td><td>Record current kubectl command in the resource annotation. If set to false, do not record the command. If set to true, record the command. If not set, default to updating the existing annotation value only if one already exists.</td>
    </tr>
    <tr>
    <td>recursive</td><td>R</td><td>false</td><td>Process the directory used in -f, --filename recursively. Useful when you want to manage related manifests organized within the same directory.</td>
    </tr>
    <tr>
    <td>requests</td><td></td><td></td><td>The resource requirement requests for this container.  For example, 'cpu=100m,memory=256Mi'.  Note that server side components may assign requests depending on the server configuration, such as limit ranges.</td>
    </tr>
    <tr>
    <td>selector</td><td>l</td><td></td><td>Selector (label query) to filter on, not including uninitialized ones,supports '=', '==', and '!='.(e.g. -l key1=value1,key2=value2)</td>
    </tr>
    <tr>
    <td>template</td><td></td><td></td><td>Template string or path to template file to use when -o=go-template, -o=go-template-file. The template format is golang templates [http://golang.org/pkg/text/template/#pkg-overview].</td>
    </tr>
</tbody>
</table></div>



<hr>

## selector


### Overview
Set the selector on a resource. Note that the new selector will overwrite the old selector if the resource had one prior to the invocation of 'set selector'.

 A selector must begin with a letter or number, and may contain letters, numbers, hyphens, dots, and underscores, up to  63 characters. If --resource-version is specified, then updates will use this resource version, otherwise the existing resource-version will be used. Note: currently selectors can only be set on Service objects.

### Usage

`selector (-f FILENAME | TYPE NAME) EXPRESSIONS [--resource-version=version]`


### Example
 set the labels and selector before creating a deployment/service pair.

```shell
kubectl create service clusterip my-svc --clusterip="None" -o yaml --dry-run | kubectl set selector --local -f - 'environment=qa' -o yaml | kubectl create -f -
kubectl create deployment my-dep -o yaml --dry-run | kubectl label --local -f - environment=qa -o yaml | kubectl create -f -
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
    <td>all</td><td></td><td>false</td><td>Select all resources in the namespace of the specified resource types</td>
    </tr>
    <tr>
    <td>allow-missing-template-keys</td><td></td><td>true</td><td>If true, ignore any errors in templates when a field or map key is missing in the template. Only applies to golang and jsonpath output formats.</td>
    </tr>
    <tr>
    <td>dry-run</td><td></td><td>false</td><td>If true, only print the object that would be sent, without sending it.</td>
    </tr>
    <tr>
    <td>filename</td><td>f</td><td>[]</td><td>identifying the resource.</td>
    </tr>
    <tr>
    <td>local</td><td></td><td>false</td><td>If true, annotation will NOT contact api-server but run locally.</td>
    </tr>
    <tr>
    <td>output</td><td>o</td><td></td><td>Output format. One of: json&#124;yaml&#124;name&#124;go-template&#124;go-template-file&#124;template&#124;templatefile&#124;jsonpath&#124;jsonpath-file.</td>
    </tr>
    <tr>
    <td>record</td><td></td><td>false</td><td>Record current kubectl command in the resource annotation. If set to false, do not record the command. If set to true, record the command. If not set, default to updating the existing annotation value only if one already exists.</td>
    </tr>
    <tr>
    <td>recursive</td><td>R</td><td>true</td><td>Process the directory used in -f, --filename recursively. Useful when you want to manage related manifests organized within the same directory.</td>
    </tr>
    <tr>
    <td>resource-version</td><td></td><td></td><td>If non-empty, the selectors update will only succeed if this is the current resource-version for the object. Only valid when specifying a single resource.</td>
    </tr>
    <tr>
    <td>template</td><td></td><td></td><td>Template string or path to template file to use when -o=go-template, -o=go-template-file. The template format is golang templates [http://golang.org/pkg/text/template/#pkg-overview].</td>
    </tr>
</tbody>
</table></div>



<hr>

## serviceaccount


### Overview
Update ServiceAccount of pod template resources.

 Possible resources (case insensitive) can be:

 replicationcontroller (rc), deployment (deploy), daemonset (ds), job, replicaset (rs), statefulset

### Usage

`serviceaccount (-f FILENAME | TYPE NAME) SERVICE_ACCOUNT`


### Example
 Set Deployment nginx-deployment's ServiceAccount to serviceaccount1

```shell
kubectl set serviceaccount deployment nginx-deployment serviceaccount1
```

 Print the result (in yaml format) of updated nginx deployment with serviceaccount from local file, without hitting apiserver

```shell
kubectl set sa -f nginx-deployment.yaml serviceaccount1 --local --dry-run -o yaml
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
    <td>all</td><td></td><td>false</td><td>Select all resources, including uninitialized ones, in the namespace of the specified resource types</td>
    </tr>
    <tr>
    <td>allow-missing-template-keys</td><td></td><td>true</td><td>If true, ignore any errors in templates when a field or map key is missing in the template. Only applies to golang and jsonpath output formats.</td>
    </tr>
    <tr>
    <td>dry-run</td><td></td><td>false</td><td>If true, only print the object that would be sent, without sending it.</td>
    </tr>
    <tr>
    <td>filename</td><td>f</td><td>[]</td><td>Filename, directory, or URL to files identifying the resource to get from a server.</td>
    </tr>
    <tr>
    <td>include-uninitialized</td><td></td><td>false</td><td>If true, the kubectl command applies to uninitialized objects. If explicitly set to false, this flag overrides other flags that make the kubectl commands apply to uninitialized objects, e.g., "--all". Objects with empty metadata.initializers are regarded as initialized.</td>
    </tr>
    <tr>
    <td>kustomize</td><td>k</td><td></td><td>Process the kustomization directory. This flag can't be used together with -f or -R.</td>
    </tr>
    <tr>
    <td>local</td><td></td><td>false</td><td>If true, set serviceaccount will NOT contact api-server but run locally.</td>
    </tr>
    <tr>
    <td>output</td><td>o</td><td></td><td>Output format. One of: json&#124;yaml&#124;name&#124;go-template&#124;go-template-file&#124;template&#124;templatefile&#124;jsonpath&#124;jsonpath-file.</td>
    </tr>
    <tr>
    <td>record</td><td></td><td>false</td><td>Record current kubectl command in the resource annotation. If set to false, do not record the command. If set to true, record the command. If not set, default to updating the existing annotation value only if one already exists.</td>
    </tr>
    <tr>
    <td>recursive</td><td>R</td><td>false</td><td>Process the directory used in -f, --filename recursively. Useful when you want to manage related manifests organized within the same directory.</td>
    </tr>
    <tr>
    <td>template</td><td></td><td></td><td>Template string or path to template file to use when -o=go-template, -o=go-template-file. The template format is golang templates [http://golang.org/pkg/text/template/#pkg-overview].</td>
    </tr>
</tbody>
</table></div>



<hr>

## subject


### Overview
Update User, Group or ServiceAccount in a RoleBinding/ClusterRoleBinding.

### Usage

`subject (-f FILENAME | TYPE NAME) [--user=username] [--group=groupname] [--serviceaccount=namespace:serviceaccountname] [--dry-run]`


### Example
 Update a ClusterRoleBinding for serviceaccount1

```shell
kubectl set subject clusterrolebinding admin --serviceaccount=namespace:serviceaccount1
```

 Update a RoleBinding for user1, user2, and group1

```shell
kubectl set subject rolebinding admin --user=user1 --user=user2 --group=group1
```

 Print the result (in yaml format) of updating rolebinding subjects from a local, without hitting the server

```shell
kubectl create rolebinding admin --role=admin --user=admin -o yaml --dry-run | kubectl set subject --local -f - --user=foo -o yaml
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
    <td>all</td><td></td><td>false</td><td>Select all resources, including uninitialized ones, in the namespace of the specified resource types</td>
    </tr>
    <tr>
    <td>allow-missing-template-keys</td><td></td><td>true</td><td>If true, ignore any errors in templates when a field or map key is missing in the template. Only applies to golang and jsonpath output formats.</td>
    </tr>
    <tr>
    <td>dry-run</td><td></td><td>false</td><td>If true, only print the object that would be sent, without sending it.</td>
    </tr>
    <tr>
    <td>filename</td><td>f</td><td>[]</td><td>Filename, directory, or URL to files the resource to update the subjects</td>
    </tr>
    <tr>
    <td>group</td><td></td><td>[]</td><td>Groups to bind to the role</td>
    </tr>
    <tr>
    <td>include-uninitialized</td><td></td><td>false</td><td>If true, the kubectl command applies to uninitialized objects. If explicitly set to false, this flag overrides other flags that make the kubectl commands apply to uninitialized objects, e.g., "--all". Objects with empty metadata.initializers are regarded as initialized.</td>
    </tr>
    <tr>
    <td>kustomize</td><td>k</td><td></td><td>Process the kustomization directory. This flag can't be used together with -f or -R.</td>
    </tr>
    <tr>
    <td>local</td><td></td><td>false</td><td>If true, set subject will NOT contact api-server but run locally.</td>
    </tr>
    <tr>
    <td>output</td><td>o</td><td></td><td>Output format. One of: json&#124;yaml&#124;name&#124;go-template&#124;go-template-file&#124;template&#124;templatefile&#124;jsonpath&#124;jsonpath-file.</td>
    </tr>
    <tr>
    <td>recursive</td><td>R</td><td>false</td><td>Process the directory used in -f, --filename recursively. Useful when you want to manage related manifests organized within the same directory.</td>
    </tr>
    <tr>
    <td>selector</td><td>l</td><td></td><td>Selector (label query) to filter on, not including uninitialized ones, supports '=', '==', and '!='.(e.g. -l key1=value1,key2=value2)</td>
    </tr>
    <tr>
    <td>serviceaccount</td><td></td><td>[]</td><td>Service accounts to bind to the role</td>
    </tr>
    <tr>
    <td>template</td><td></td><td></td><td>Template string or path to template file to use when -o=go-template, -o=go-template-file. The template format is golang templates [http://golang.org/pkg/text/template/#pkg-overview].</td>
    </tr>
</tbody>
</table></div>




<hr>


### Version
<div class="kubectl-reference-copyright">

<a href="https://github.com/kubernetes/kubernetes">Kubectl Reference Docs version 1.15 &#xa9;Copyright 2019 The Kubernetes Authors</a>
</div>

