---
title: run
noedit: true
layout: kuberef
---

### Overview
Create and run a particular image, possibly replicated.

 Creates a deployment or job to manage the created container(s).

### Usage

`run NAME --image=image [--env="key=value"] [--port=port] [--replicas=replicas] [--dry-run=bool] [--overrides=inline-json] [--command] -- [COMMAND] [args...]`


### Example

 Start a single instance of nginx.

```shell
kubectl run nginx --image=nginx
```

 Start a single instance of hazelcast and let the container expose port 5701 .

```shell
kubectl run hazelcast --image=hazelcast --port=5701
```

 Start a single instance of hazelcast and set environment variables "DNS_DOMAIN=cluster" and "POD_NAMESPACE=default" in the container.

```shell
kubectl run hazelcast --image=hazelcast --env="DNS_DOMAIN=cluster" --env="POD_NAMESPACE=default"
```

 Start a single instance of hazelcast and set labels "app=hazelcast" and "env=prod" in the container.

```shell
kubectl run hazelcast --image=hazelcast --labels="app=hazelcast,env=prod"
```

 Start a replicated instance of nginx.

```shell
kubectl run nginx --image=nginx --replicas=5
```

 Dry run. Print the corresponding API objects without creating them.

```shell
kubectl run nginx --image=nginx --dry-run
```

 Start a single instance of nginx, but overload the spec of the deployment with a partial set of values parsed from JSON.

```shell
kubectl run nginx --image=nginx --overrides='{ "apiVersion": "v1", "spec": { ... } }'
```

 Start a pod of busybox and keep it in the foreground, don't restart it if it exits.

```shell
kubectl run -i -t busybox --image=busybox --restart=Never
```

 Start the nginx container using the default command, but use custom arguments (arg1 .. argN) for that command.

```shell
kubectl run nginx --image=nginx -- <arg1> <arg2> ... <argN>
```

 Start the nginx container using a different command and custom arguments.

```shell
kubectl run nginx --image=nginx --command -- <cmd> <arg1> ... <argN>
```

 Start the perl container to compute π to 2000 places and print it out.

```shell
kubectl run pi --image=perl --restart=OnFailure -- perl -Mbignum=bpi -wle 'print bpi(2000)'
```

 Start the cron job to compute π to 2000 places and print it out every 5 minutes.

```shell
kubectl run pi --schedule="0/5 * * * ?" --image=perl --restart=OnFailure -- perl -Mbignum=bpi -wle 'print bpi(2000)'
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
    <td>attach</td><td></td><td>false</td><td>If true, wait for the Pod to start running, and then attach to the Pod as if 'kubectl attach ...' were called.  Default false, unless '-i/--stdin' is set, in which case the default is true. With '--restart=Never' the exit code of the container process is returned.</td>
    </tr>
    <tr>
    <td>cascade</td><td></td><td>true</td><td>If true, cascade the deletion of the resources managed by this resource (e.g. Pods created by a ReplicationController).  Default true.</td>
    </tr>
    <tr>
    <td>command</td><td></td><td>false</td><td>If true and extra arguments are present, use them as the 'command' field in the container, rather than the 'args' field which is the default.</td>
    </tr>
    <tr>
    <td>dry-run</td><td></td><td>false</td><td>If true, only print the object that would be sent, without sending it.</td>
    </tr>
    <tr>
    <td>env</td><td></td><td>[]</td><td>Environment variables to set in the container</td>
    </tr>
    <tr>
    <td>expose</td><td></td><td>false</td><td>If true, a public, external service is created for the container(s) which are run</td>
    </tr>
    <tr>
    <td>filename</td><td>f</td><td>[]</td><td>to use to replace the resource.</td>
    </tr>
    <tr>
    <td>force</td><td></td><td>false</td><td>Only used when grace-period=0. If true, immediately remove resources from API and bypass graceful deletion. Note that immediate deletion of some resources may result in inconsistency or data loss and requires confirmation.</td>
    </tr>
    <tr>
    <td>generator</td><td></td><td></td><td>The name of the API generator to use, see http://kubernetes.io/docs/user-guide/kubectl-conventions/#generators for a list.</td>
    </tr>
    <tr>
    <td>grace-period</td><td></td><td>-1</td><td>Period of time in seconds given to the resource to terminate gracefully. Ignored if negative. Set to 1 for immediate shutdown. Can only be set to 0 when --force is true (force deletion).</td>
    </tr>
    <tr>
    <td>hostport</td><td></td><td>-1</td><td>The host port mapping for the container port. To demonstrate a single-machine container.</td>
    </tr>
    <tr>
    <td>image</td><td></td><td></td><td>The image for the container to run.</td>
    </tr>
    <tr>
    <td>image-pull-policy</td><td></td><td></td><td>The image pull policy for the container. If left empty, this value will not be specified by the client and defaulted by the server</td>
    </tr>
    <tr>
    <td>kustomize</td><td>k</td><td></td><td>Process a kustomization directory. This flag can't be used together with -f or -R.</td>
    </tr>
    <tr>
    <td>labels</td><td>l</td><td></td><td>Comma separated labels to apply to the pod(s). Will override previous values.</td>
    </tr>
    <tr>
    <td>leave-stdin-open</td><td></td><td>false</td><td>If the pod is started in interactive mode or with stdin, leave stdin open after the first attach completes. By default, stdin will be closed after the first attach completes.</td>
    </tr>
    <tr>
    <td>limits</td><td></td><td></td><td>The resource requirement limits for this container.  For example, 'cpu=200m,memory=512Mi'.  Note that server side components may assign limits depending on the server configuration, such as limit ranges.</td>
    </tr>
    <tr>
    <td>output</td><td>o</td><td></td><td>Output format. One of: json&#124;yaml&#124;name&#124;go-template&#124;go-template-file&#124;template&#124;templatefile&#124;jsonpath&#124;jsonpath-file.</td>
    </tr>
    <tr>
    <td>overrides</td><td></td><td></td><td>An inline JSON override for the generated object. If this is non-empty, it is used to override the generated object. Requires that the object supply a valid apiVersion field.</td>
    </tr>
    <tr>
    <td>pod-running-timeout</td><td></td><td>1m0s</td><td>The length of time (like 5s, 2m, or 3h, higher than zero) to wait until at least one pod is running</td>
    </tr>
    <tr>
    <td>port</td><td></td><td></td><td>The port that this container exposes.  If --expose is true, this is also the port used by the service that is created.</td>
    </tr>
    <tr>
    <td>quiet</td><td></td><td>false</td><td>If true, suppress prompt messages.</td>
    </tr>
    <tr>
    <td>record</td><td></td><td>false</td><td>Record current kubectl command in the resource annotation. If set to false, do not record the command. If set to true, record the command. If not set, default to updating the existing annotation value only if one already exists.</td>
    </tr>
    <tr>
    <td>recursive</td><td>R</td><td>false</td><td>Process the directory used in -f, --filename recursively. Useful when you want to manage related manifests organized within the same directory.</td>
    </tr>
    <tr>
    <td>replicas</td><td>r</td><td>1</td><td>Number of replicas to create for this container. Default is 1.</td>
    </tr>
    <tr>
    <td>requests</td><td></td><td></td><td>The resource requirement requests for this container.  For example, 'cpu=100m,memory=256Mi'.  Note that server side components may assign requests depending on the server configuration, such as limit ranges.</td>
    </tr>
    <tr>
    <td>restart</td><td></td><td>Always</td><td>The restart policy for this Pod.  Legal values [Always, OnFailure, Never].  If set to 'Always' a deployment is created, if set to 'OnFailure' a job is created, if set to 'Never', a regular pod is created. For the latter two --replicas must be 1.  Default 'Always', for CronJobs `Never`.</td>
    </tr>
    <tr>
    <td>rm</td><td></td><td>false</td><td>If true, delete resources created in this command for attached containers.</td>
    </tr>
    <tr>
    <td>save-config</td><td></td><td>false</td><td>If true, the configuration of current object will be saved in its annotation. Otherwise, the annotation will be unchanged. This flag is useful when you want to perform kubectl apply on this object in the future.</td>
    </tr>
    <tr>
    <td>schedule</td><td></td><td></td><td>A schedule in the Cron format the job should be run with.</td>
    </tr>
    <tr>
    <td>service-generator</td><td></td><td>service/v2</td><td>The name of the generator to use for creating a service.  Only used if --expose is true</td>
    </tr>
    <tr>
    <td>service-overrides</td><td></td><td></td><td>An inline JSON override for the generated service object. If this is non-empty, it is used to override the generated object. Requires that the object supply a valid apiVersion field.  Only used if --expose is true.</td>
    </tr>
    <tr>
    <td>serviceaccount</td><td></td><td></td><td>Service account to set in the pod spec</td>
    </tr>
    <tr>
    <td>stdin</td><td>i</td><td>false</td><td>Keep stdin open on the container(s) in the pod, even if nothing is attached.</td>
    </tr>
    <tr>
    <td>template</td><td></td><td></td><td>Template string or path to template file to use when -o=go-template, -o=go-template-file. The template format is golang templates [http://golang.org/pkg/text/template/#pkg-overview].</td>
    </tr>
    <tr>
    <td>timeout</td><td></td><td>0s</td><td>The length of time to wait before giving up on a delete, zero means determine a timeout from the size of the object</td>
    </tr>
    <tr>
    <td>tty</td><td>t</td><td>false</td><td>Allocated a TTY for each container in the pod.</td>
    </tr>
    <tr>
    <td>wait</td><td></td><td>false</td><td>If true, wait for resources to be gone before returning. This waits for finalizers.</td>
    </tr>
</tbody>
</table></div>




<hr>


### Version

<div class="kubectl-reference-copyright">

<a href="https://github.com/kubernetes/kubernetes">Kubectl Reference Docs  
{{< param "fullversion" >}}   &#xa9;Copyright 2019 The Kubernetes Authors</a>

</div>

