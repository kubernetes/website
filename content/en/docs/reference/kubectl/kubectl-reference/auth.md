---
title: auth
content_template: templates/tool-reference
---

### Overview
Inspect authorization

### Usage

`auth`






<hr>

## can-i


### Overview
Check whether an action is allowed.

 VERB is a logical Kubernetes API verb like 'get', 'list', 'watch', 'delete', etc. TYPE is a Kubernetes resource. Shortcuts and groups will be resolved. NONRESOURCEURL is a partial URL starts with "/". NAME is the name of a particular Kubernetes resource.

### Usage

`can-i VERB [TYPE | TYPE/NAME | NONRESOURCEURL]`


### Example
 Check to see if I can create pods in any namespace

```shell
kubectl auth can-i create pods --all-namespaces
```

 Check to see if I can list deployments in my current namespace

```shell
kubectl auth can-i list deployments.extensions
```

 Check to see if I can do everything in my current namespace ("*" means all)

```shell
kubectl auth can-i '*' '*'
```

 Check to see if I can get the job named "bar" in namespace "foo"

```shell
kubectl auth can-i list jobs.batch/bar -n foo
```

 Check to see if I can read pod logs

```shell
kubectl auth can-i get pods --subresource=log
```

 Check to see if I can access the URL /logs/

```shell
kubectl auth can-i get /logs/
```

 List all allowed actions in namespace "foo"

```shell
kubectl auth can-i --list --namespace=foo
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
    <td>all-namespaces</td><td>A</td><td>false</td><td>If true, check the specified action in all namespaces.</td>
    </tr>
    <tr>
    <td>list</td><td></td><td>false</td><td>If true, prints all allowed actions.</td>
    </tr>
    <tr>
    <td>no-headers</td><td></td><td>false</td><td>If true, prints allowed actions without headers</td>
    </tr>
    <tr>
    <td>quiet</td><td>q</td><td>false</td><td>If true, suppress output and just return the exit code.</td>
    </tr>
    <tr>
    <td>subresource</td><td></td><td></td><td>SubResource such as pod/log or deployment/scale</td>
    </tr>
</tbody>
</table></div>



<hr>

## reconcile


### Overview
Reconciles rules for RBAC Role, RoleBinding, ClusterRole, and ClusterRole binding objects.

 Missing objects are created, and the containing namespace is created for namespaced objects, if required.

 Existing roles are updated to include the permissions in the input objects, and remove extra permissions if --remove-extra-permissions is specified.

 Existing bindings are updated to include the subjects in the input objects, and remove extra subjects if --remove-extra-subjects is specified.

 This is preferred to 'apply' for RBAC resources so that semantically-aware merging of rules and subjects is done.

### Usage

`reconcile -f FILENAME`


### Example
 Reconcile rbac resources from a file

```shell
kubectl auth reconcile -f my-rbac-rules.yaml
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
    <td>dry-run</td><td></td><td>false</td><td>If true, display results but do not submit changes</td>
    </tr>
    <tr>
    <td>filename</td><td>f</td><td>[]</td><td>Filename, directory, or URL to files identifying the resource to reconcile.</td>
    </tr>
    <tr>
    <td>kustomize</td><td>k</td><td></td><td>Process the kustomization directory. This flag can't be used together with -f or -R.</td>
    </tr>
    <tr>
    <td>output</td><td>o</td><td></td><td>Output format. One of: json&#124;yaml&#124;name&#124;go-template&#124;go-template-file&#124;template&#124;templatefile&#124;jsonpath&#124;jsonpath-file.</td>
    </tr>
    <tr>
    <td>recursive</td><td>R</td><td>false</td><td>Process the directory used in -f, --filename recursively. Useful when you want to manage related manifests organized within the same directory.</td>
    </tr>
    <tr>
    <td>remove-extra-permissions</td><td></td><td>false</td><td>If true, removes extra permissions added to roles</td>
    </tr>
    <tr>
    <td>remove-extra-subjects</td><td></td><td>false</td><td>If true, removes extra subjects added to rolebindings</td>
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

