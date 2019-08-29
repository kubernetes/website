---
title: explain
content_template: templates/tool-reference
---

### Overview
List the fields for supported resources

 This command describes the fields associated with each supported API resource. Fields are identified via a simple JSONPath identifier:

  <type>.<fieldName>[.<fieldName>]
  
 Add the --recursive flag to display all of the fields at once without descriptions. Information about each field is retrieved from the server in OpenAPI format.

Use "kubectl api-resources" for a complete list of supported resources.

### Usage

`explain RESOURCE`


### Example

 Get the documentation of the resource and its fields

```shell
kubectl explain pods
```

 Get the documentation of a specific field of a resource

```shell
kubectl explain pods.spec.containers
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
    <td>api-version</td><td></td><td></td><td>Get different explanations for particular API version</td>
    </tr>
    <tr>
    <td>recursive</td><td></td><td>false</td><td>Print the fields of fields (Currently only 1 level deep)</td>
    </tr>
</tbody>
</table></div>




<hr>


### Version

<div class="kubectl-reference-copyright">

<a href="https://github.com/kubernetes/kubernetes">Kubectl Reference Docs  
{{< param "fullversion" >}}   &#xa9;Copyright 2019 The Kubernetes Authors</a>

</div>

