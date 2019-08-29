---
title: apply
content_template: templates/tool-reference
---

### Overview
Apply a configuration to a resource by filename or stdin. The resource name must be specified. This resource will be created if it doesn't exist yet. To use 'apply', always create the resource initially with either 'apply' or 'create --save-config'.

 JSON and YAML formats are accepted.

 Alpha Disclaimer: the --prune functionality is not yet complete. Do not use unless you are aware of what the current state is. See https://issues.k8s.io/34274.

### Usage

`apply (-f FILENAME | -k DIRECTORY)`


### Example

 Apply the configuration in pod.json to a pod.

```shell
kubectl apply -f ./pod.json
```

 Apply resources from a directory containing kustomization.yaml - e.g. dir/kustomization.yaml.

```shell
kubectl apply -k dir/
```

 Apply the JSON passed into stdin to a pod.

```shell
cat pod.json | kubectl apply -f -
```

 Note: --prune is still in Alpha # Apply the configuration in manifest.yaml that matches label app=nginx and delete all the other resources that are not in the file and match label app=nginx.

```shell
kubectl apply --prune -f manifest.yaml -l app=nginx
```

 Apply the configuration in manifest.yaml and delete all the other configmaps that are not in the file.

```shell
kubectl apply --prune -f manifest.yaml --all --prune-whitelist=core/v1/ConfigMap
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
    <td>all</td><td></td><td>false</td><td>Select all resources in the namespace of the specified resource types.</td>
    </tr>
    <tr>
    <td>allow-missing-template-keys</td><td></td><td>true</td><td>If true, ignore any errors in templates when a field or map key is missing in the template. Only applies to golang and jsonpath output formats.</td>
    </tr>
    <tr>
    <td>cascade</td><td></td><td>true</td><td>If true, cascade the deletion of the resources managed by this resource (e.g. Pods created by a ReplicationController).  Default true.</td>
    </tr>
    <tr>
    <td>dry-run</td><td></td><td>false</td><td>If true, only print the object that would be sent, without sending it. Warning: --dry-run cannot accurately output the result of merging the local manifest and the server-side data. Use --server-dry-run to get the merged result instead.</td>
    </tr>
    <tr>
    <td>experimental-field-manager</td><td></td><td>kubectl</td><td>Name of the manager used to track field ownership. This is an alpha feature and flag.</td>
    </tr>
    <tr>
    <td>experimental-force-conflicts</td><td></td><td>false</td><td>If true, server-side apply will force the changes against conflicts. This is an alpha feature and flag.</td>
    </tr>
    <tr>
    <td>experimental-server-side</td><td></td><td>false</td><td>If true, apply runs in the server instead of the client. This is an alpha feature and flag.</td>
    </tr>
    <tr>
    <td>filename</td><td>f</td><td>[]</td><td>that contains the configuration to apply</td>
    </tr>
    <tr>
    <td>force</td><td></td><td>false</td><td>Only used when grace-period=0. If true, immediately remove resources from API and bypass graceful deletion. Note that immediate deletion of some resources may result in inconsistency or data loss and requires confirmation.</td>
    </tr>
    <tr>
    <td>grace-period</td><td></td><td>-1</td><td>Period of time in seconds given to the resource to terminate gracefully. Ignored if negative. Set to 1 for immediate shutdown. Can only be set to 0 when --force is true (force deletion).</td>
    </tr>
    <tr>
    <td>include-uninitialized</td><td></td><td>false</td><td>If true, the kubectl command applies to uninitialized objects. If explicitly set to false, this flag overrides other flags that make the kubectl commands apply to uninitialized objects, e.g., "--all". Objects with empty metadata.initializers are regarded as initialized.</td>
    </tr>
    <tr>
    <td>kustomize</td><td>k</td><td></td><td>Process a kustomization directory. This flag can't be used together with -f or -R.</td>
    </tr>
    <tr>
    <td>openapi-patch</td><td></td><td>true</td><td>If true, use openapi to calculate diff when the openapi presents and the resource can be found in the openapi spec. Otherwise, fall back to use baked-in types.</td>
    </tr>
    <tr>
    <td>output</td><td>o</td><td></td><td>Output format. One of: json&#124;yaml&#124;name&#124;go-template&#124;go-template-file&#124;template&#124;templatefile&#124;jsonpath&#124;jsonpath-file.</td>
    </tr>
    <tr>
    <td>overwrite</td><td></td><td>true</td><td>Automatically resolve conflicts between the modified and live configuration by using values from the modified configuration</td>
    </tr>
    <tr>
    <td>prune</td><td></td><td>false</td><td>Automatically delete resource objects, including the uninitialized ones, that do not appear in the configs and are created by either apply or create --save-config. Should be used with either -l or --all.</td>
    </tr>
    <tr>
    <td>prune-whitelist</td><td></td><td>[]</td><td>Overwrite the default whitelist with <group/version/kind> for --prune</td>
    </tr>
    <tr>
    <td>record</td><td></td><td>false</td><td>Record current kubectl command in the resource annotation. If set to false, do not record the command. If set to true, record the command. If not set, default to updating the existing annotation value only if one already exists.</td>
    </tr>
    <tr>
    <td>recursive</td><td>R</td><td>false</td><td>Process the directory used in -f, --filename recursively. Useful when you want to manage related manifests organized within the same directory.</td>
    </tr>
    <tr>
    <td>selector</td><td>l</td><td></td><td>Selector (label query) to filter on, supports '=', '==', and '!='.(e.g. -l key1=value1,key2=value2)</td>
    </tr>
    <tr>
    <td>server-dry-run</td><td></td><td>false</td><td>If true, request will be sent to server with dry-run flag, which means the modifications won't be persisted. This is an alpha feature and flag.</td>
    </tr>
    <tr>
    <td>template</td><td></td><td></td><td>Template string or path to template file to use when -o=go-template, -o=go-template-file. The template format is golang templates [http://golang.org/pkg/text/template/#pkg-overview].</td>
    </tr>
    <tr>
    <td>timeout</td><td></td><td>0s</td><td>The length of time to wait before giving up on a delete, zero means determine a timeout from the size of the object</td>
    </tr>
    <tr>
    <td>validate</td><td></td><td>true</td><td>If true, use a schema to validate the input before sending it</td>
    </tr>
    <tr>
    <td>wait</td><td></td><td>false</td><td>If true, wait for resources to be gone before returning. This waits for finalizers.</td>
    </tr>
</tbody>
</table></div>



<hr>

## edit-last-applied


### Overview
Edit the latest last-applied-configuration annotations of resources from the default editor.

 The edit-last-applied command allows you to directly edit any API resource you can retrieve via the command line tools. It will open the editor defined by your KUBE_EDITOR, or EDITOR environment variables, or fall back to 'vi' for Linux or 'notepad' for Windows. You can edit multiple objects, although changes are applied one at a time. The command accepts filenames as well as command line arguments, although the files you point to must be previously saved versions of resources.

 The default format is YAML. To edit in JSON, specify "-o json".

 The flag --windows-line-endings can be used to force Windows line endings, otherwise the default for your operating system will be used.

 In the event an error occurs while updating, a temporary file will be created on disk that contains your unapplied changes. The most common error when updating a resource is another editor changing the resource on the server. When this occurs, you will have to apply your changes to the newer version of the resource, or update your temporary saved copy to include the latest resource version.

### Usage

`edit-last-applied (RESOURCE/NAME | -f FILENAME)`


### Example
 Edit the last-applied-configuration annotations by type/name in YAML.

```shell
kubectl apply edit-last-applied deployment/nginx
```

 Edit the last-applied-configuration annotations by file in JSON.

```shell
kubectl apply edit-last-applied -f deploy.yaml -o json
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
    <td>filename</td><td>f</td><td>[]</td><td>Filename, directory, or URL to files to use to edit the resource</td>
    </tr>
    <tr>
    <td>include-uninitialized</td><td></td><td>false</td><td>If true, the kubectl command applies to uninitialized objects. If explicitly set to false, this flag overrides other flags that make the kubectl commands apply to uninitialized objects, e.g., "--all". Objects with empty metadata.initializers are regarded as initialized.</td>
    </tr>
    <tr>
    <td>kustomize</td><td>k</td><td></td><td>Process the kustomization directory. This flag can't be used together with -f or -R.</td>
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
    <tr>
    <td>windows-line-endings</td><td></td><td>false</td><td>Defaults to the line ending native to your platform.</td>
    </tr>
</tbody>
</table></div>



<hr>

## set-last-applied


### Overview
Set the latest last-applied-configuration annotations by setting it to match the contents of a file. This results in the last-applied-configuration being updated as though 'kubectl apply -f<file> ' was run, without updating any other parts of the object.

### Usage

`set-last-applied -f FILENAME`


### Example
 Set the last-applied-configuration of a resource to match the contents of a file.

```shell
kubectl apply set-last-applied -f deploy.yaml
```

 Execute set-last-applied against each configuration file in a directory.

```shell
kubectl apply set-last-applied -f path/
```

 Set the last-applied-configuration of a resource to match the contents of a file, will create the annotation if it does not already exist.

```shell
kubectl apply set-last-applied -f deploy.yaml --create-annotation=true
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
    <td>create-annotation</td><td></td><td>false</td><td>Will create 'last-applied-configuration' annotations if current objects doesn't have one</td>
    </tr>
    <tr>
    <td>dry-run</td><td></td><td>false</td><td>If true, only print the object that would be sent, without sending it.</td>
    </tr>
    <tr>
    <td>filename</td><td>f</td><td>[]</td><td>Filename, directory, or URL to files that contains the last-applied-configuration annotations</td>
    </tr>
    <tr>
    <td>output</td><td>o</td><td></td><td>Output format. One of: json&#124;yaml&#124;name&#124;go-template&#124;go-template-file&#124;template&#124;templatefile&#124;jsonpath&#124;jsonpath-file.</td>
    </tr>
    <tr>
    <td>template</td><td></td><td></td><td>Template string or path to template file to use when -o=go-template, -o=go-template-file. The template format is golang templates [http://golang.org/pkg/text/template/#pkg-overview].</td>
    </tr>
</tbody>
</table></div>



<hr>

## view-last-applied


### Overview
View the latest last-applied-configuration annotations by type/name or file.

 The default output will be printed to stdout in YAML format. One can use -o option to change output format.

### Usage

`view-last-applied (TYPE [NAME | -l label] | TYPE/NAME | -f FILENAME)`


### Example
 View the last-applied-configuration annotations by type/name in YAML.

```shell
kubectl apply view-last-applied deployment/nginx
```

 View the last-applied-configuration annotations by file in JSON

```shell
kubectl apply view-last-applied -f deploy.yaml -o json
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
    <td>filename</td><td>f</td><td>[]</td><td>Filename, directory, or URL to files that contains the last-applied-configuration annotations</td>
    </tr>
    <tr>
    <td>kustomize</td><td>k</td><td></td><td>Process the kustomization directory. This flag can't be used together with -f or -R.</td>
    </tr>
    <tr>
    <td>output</td><td>o</td><td>yaml</td><td>Output format. Must be one of yaml&#124;json</td>
    </tr>
    <tr>
    <td>recursive</td><td>R</td><td>false</td><td>Process the directory used in -f, --filename recursively. Useful when you want to manage related manifests organized within the same directory.</td>
    </tr>
    <tr>
    <td>selector</td><td>l</td><td></td><td>Selector (label query) to filter on, supports '=', '==', and '!='.(e.g. -l key1=value1,key2=value2)</td>
    </tr>
</tbody>
</table></div>




<hr>


### Version

<div class="kubectl-reference-copyright">

<a href="https://github.com/kubernetes/kubernetes">Kubectl Reference Docs  
{{< param "fullversion" >}}   &#xa9;Copyright 2019 The Kubernetes Authors</a>

</div>

