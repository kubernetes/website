---
title: autoscale
content_template: templates/tool-reference
---

### Overview
Creates an autoscaler that automatically chooses and sets the number of pods that run in a kubernetes cluster.

 Looks up a Deployment, ReplicaSet, StatefulSet, or ReplicationController by name and creates an autoscaler that uses the given resource as a reference. An autoscaler can automatically increase or decrease number of pods deployed within the system as needed.

### Usage

`autoscale (-f FILENAME | TYPE NAME | TYPE/NAME) [--min=MINPODS] --max=MAXPODS [--cpu-percent=CPU]`


### Example

 Auto scale a deployment "foo", with the number of pods between 2 and 10, no target CPU utilization specified so a default autoscaling policy will be used:

```shell
kubectl autoscale deployment foo --min=2 --max=10
```

 Auto scale a replication controller "foo", with the number of pods between 1 and 5, target CPU utilization at 80%:

```shell
kubectl autoscale rc foo --max=5 --cpu-percent=80
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
    <td>cpu-percent</td><td></td><td>-1</td><td>The target average CPU utilization (represented as a percent of requested CPU) over all the pods. If it's not specified or negative, a default autoscaling policy will be used.</td>
    </tr>
    <tr>
    <td>dry-run</td><td></td><td>false</td><td>If true, only print the object that would be sent, without sending it.</td>
    </tr>
    <tr>
    <td>filename</td><td>f</td><td>[]</td><td>Filename, directory, or URL to files identifying the resource to autoscale.</td>
    </tr>
    <tr>
    <td>generator</td><td></td><td>horizontalpodautoscaler/v1</td><td>The name of the API generator to use. Currently there is only 1 generator.</td>
    </tr>
    <tr>
    <td>kustomize</td><td>k</td><td></td><td>Process the kustomization directory. This flag can't be used together with -f or -R.</td>
    </tr>
    <tr>
    <td>max</td><td></td><td>-1</td><td>The upper limit for the number of pods that can be set by the autoscaler. Required.</td>
    </tr>
    <tr>
    <td>min</td><td></td><td>-1</td><td>The lower limit for the number of pods that can be set by the autoscaler. If it's not specified or negative, the server will apply a default value.</td>
    </tr>
    <tr>
    <td>name</td><td></td><td></td><td>The name for the newly created object. If not specified, the name of the input resource will be used.</td>
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
    <td>save-config</td><td></td><td>false</td><td>If true, the configuration of current object will be saved in its annotation. Otherwise, the annotation will be unchanged. This flag is useful when you want to perform kubectl apply on this object in the future.</td>
    </tr>
    <tr>
    <td>template</td><td></td><td></td><td>Template string or path to template file to use when -o=go-template, -o=go-template-file. The template format is golang templates [http://golang.org/pkg/text/template/#pkg-overview].</td>
    </tr>
</tbody>
</table></div>




<hr>


### Version

<div class="kubectl-reference-copyright">

<a href="https://github.com/kubernetes/kubernetes">Kubectl Reference Docs  
{{< param "fullversion" >}}   &#xa9;Copyright 2019 The Kubernetes Authors</a>

</div>

