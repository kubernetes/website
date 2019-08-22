---
title: convert
content_template: templates/tool-reference
---

### Overview
Convert config files between different API versions. Both YAML and JSON formats are accepted.

 The command takes filename, directory, or URL as input, and convert it into format of version specified by --output-version flag. If target version is not specified or not supported, convert to latest version.

 The default output will be printed to stdout in YAML format. One can use -o option to change to output destination.

### Usage

`convert -f FILENAME`


### Example

 Convert 'pod.yaml' to latest version and print to stdout.

```shell
kubectl convert -f pod.yaml
```

 Convert the live state of the resource specified by 'pod.yaml' to the latest version # and print to stdout in JSON format.

```shell
kubectl convert -f pod.yaml --local -o json
```

 Convert all files under current directory to latest version and create them all.

```shell
kubectl convert -f . | kubectl create -f -
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
    <td>filename</td><td>f</td><td>[]</td><td>Filename, directory, or URL to files to need to get converted.</td>
    </tr>
    <tr>
    <td>kustomize</td><td>k</td><td></td><td>Process the kustomization directory. This flag can't be used together with -f or -R.</td>
    </tr>
    <tr>
    <td>local</td><td></td><td>true</td><td>If true, convert will NOT try to contact api-server but run locally.</td>
    </tr>
    <tr>
    <td>output</td><td>o</td><td>yaml</td><td>Output format. One of: json&#124;yaml&#124;name&#124;go-template&#124;go-template-file&#124;template&#124;templatefile&#124;jsonpath&#124;jsonpath-file.</td>
    </tr>
    <tr>
    <td>output-version</td><td></td><td></td><td>Output the formatted object with the given group version (for ex: 'extensions/v1beta1').</td>
    </tr>
    <tr>
    <td>recursive</td><td>R</td><td>false</td><td>Process the directory used in -f, --filename recursively. Useful when you want to manage related manifests organized within the same directory.</td>
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

<a href="https://github.com/kubernetes/kubernetes">Kubectl Reference Docs version 1.15 &#xa9;Copyright 2019 The Kubernetes Authors</a>
</div>

