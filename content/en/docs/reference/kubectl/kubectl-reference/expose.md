---
title: expose
content_template: templates/tool-reference
---

### Overview
Expose a resource as a new Kubernetes service.

 Looks up a deployment, service, replica set, replication controller or pod by name and uses the selector for that resource as the selector for a new service on the specified port. A deployment or replica set will be exposed as a service only if its selector is convertible to a selector that service supports, i.e. when the selector contains only the matchLabels component. Note that if no port is specified via --port and the exposed resource has multiple ports, all will be re-used by the new service. Also if no labels are specified, the new service will re-use the labels from the resource it exposes.

 Possible resources include (case insensitive):

 pod (po), service (svc), replicationcontroller (rc), deployment (deploy), replicaset (rs)

### Usage

`expose (-f FILENAME | TYPE NAME) [--port=port] [--protocol=TCP|UDP|SCTP] [--target-port=number-or-name] [--name=name] [--external-ip=external-ip-of-service] [--type=type]`


### Example

 Create a service for a replicated nginx, which serves on port 80 and connects to the containers on port 8000.

```shell
kubectl expose rc nginx --port=80 --target-port=8000
```

 Create a service for a replication controller identified by type and name specified in "nginx-controller.yaml", which serves on port 80 and connects to the containers on port 8000.

```shell
kubectl expose -f nginx-controller.yaml --port=80 --target-port=8000
```

 Create a service for a pod valid-pod, which serves on port 444 with the name "frontend"

```shell
kubectl expose pod valid-pod --port=444 --name=frontend
```

 Create a second service based on the above service, exposing the container port 8443 as port 443 with the name "nginx-https"

```shell
kubectl expose service nginx --port=443 --target-port=8443 --name=nginx-https
```

 Create a service for a replicated streaming application on port 4100 balancing UDP traffic and named 'video-stream'.

```shell
kubectl expose rc streamer --port=4100 --protocol=UDP --name=video-stream
```

 Create a service for a replicated nginx using replica set, which serves on port 80 and connects to the containers on port 8000.

```shell
kubectl expose rs nginx --port=80 --target-port=8000
```

 Create a service for an nginx deployment, which serves on port 80 and connects to the containers on port 8000.

```shell
kubectl expose deployment nginx --port=80 --target-port=8000
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
    <td>cluster-ip</td><td></td><td></td><td>ClusterIP to be assigned to the service. Leave empty to auto-allocate, or set to 'None' to create a headless service.</td>
    </tr>
    <tr>
    <td>container-port</td><td></td><td></td><td>Synonym for --target-port</td>
    </tr>
    <tr>
    <td>dry-run</td><td></td><td>false</td><td>If true, only print the object that would be sent, without sending it.</td>
    </tr>
    <tr>
    <td>external-ip</td><td></td><td></td><td>Additional external IP address (not managed by Kubernetes) to accept for the service. If this IP is routed to a node, the service can be accessed by this IP in addition to its generated service IP.</td>
    </tr>
    <tr>
    <td>filename</td><td>f</td><td>[]</td><td>Filename, directory, or URL to files identifying the resource to expose a service</td>
    </tr>
    <tr>
    <td>generator</td><td></td><td>service/v2</td><td>The name of the API generator to use. There are 2 generators: 'service/v1' and 'service/v2'. The only difference between them is that service port in v1 is named 'default', while it is left unnamed in v2. Default is 'service/v2'.</td>
    </tr>
    <tr>
    <td>kustomize</td><td>k</td><td></td><td>Process the kustomization directory. This flag can't be used together with -f or -R.</td>
    </tr>
    <tr>
    <td>labels</td><td>l</td><td></td><td>Labels to apply to the service created by this call.</td>
    </tr>
    <tr>
    <td>load-balancer-ip</td><td></td><td></td><td>IP to assign to the LoadBalancer. If empty, an ephemeral IP will be created and used (cloud-provider specific).</td>
    </tr>
    <tr>
    <td>name</td><td></td><td></td><td>The name for the newly created object.</td>
    </tr>
    <tr>
    <td>output</td><td>o</td><td></td><td>Output format. One of: json&#124;yaml&#124;name&#124;go-template&#124;go-template-file&#124;template&#124;templatefile&#124;jsonpath&#124;jsonpath-file.</td>
    </tr>
    <tr>
    <td>overrides</td><td></td><td></td><td>An inline JSON override for the generated object. If this is non-empty, it is used to override the generated object. Requires that the object supply a valid apiVersion field.</td>
    </tr>
    <tr>
    <td>port</td><td></td><td></td><td>The port that the service should serve on. Copied from the resource being exposed, if unspecified</td>
    </tr>
    <tr>
    <td>protocol</td><td></td><td></td><td>The network protocol for the service to be created. Default is 'TCP'.</td>
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
    <td>selector</td><td></td><td></td><td>A label selector to use for this service. Only equality-based selector requirements are supported. If empty (the default) infer the selector from the replication controller or replica set.)</td>
    </tr>
    <tr>
    <td>session-affinity</td><td></td><td></td><td>If non-empty, set the session affinity for the service to this; legal values: 'None', 'ClientIP'</td>
    </tr>
    <tr>
    <td>target-port</td><td></td><td></td><td>Name or number for the port on the container that the service should direct traffic to. Optional.</td>
    </tr>
    <tr>
    <td>template</td><td></td><td></td><td>Template string or path to template file to use when -o=go-template, -o=go-template-file. The template format is golang templates [http://golang.org/pkg/text/template/#pkg-overview].</td>
    </tr>
    <tr>
    <td>type</td><td></td><td></td><td>Type for this service: ClusterIP, NodePort, LoadBalancer, or ExternalName. Default is 'ClusterIP'.</td>
    </tr>
</tbody>
</table></div>




<hr>


### Version
<div class="kubectl-reference-copyright">

<a href="https://github.com/kubernetes/kubernetes">Kubectl Reference Docs version 1.15 &#xa9;Copyright 2019 The Kubernetes Authors</a>
</div>

