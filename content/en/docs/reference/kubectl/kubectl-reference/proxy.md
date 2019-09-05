---
title: proxy
noedit: true
layout: kuberef
---

### Overview
Creates a proxy server or application-level gateway between localhost and the Kubernetes API Server. It also allows serving static content over specified HTTP path. All incoming data enters through one port and gets forwarded to the remote kubernetes API Server port, except for the path matching the static content path.

### Usage

`proxy [--port=PORT] [--www=static-dir] [--www-prefix=prefix] [--api-prefix=prefix]`


### Example

 To proxy all of the kubernetes api and nothing else, use:

```shell
$ kubectl proxy --api-prefix=/
```

 To proxy only part of the kubernetes api and also some static files:

```shell
$ kubectl proxy --www=/my/files --www-prefix=/static/ --api-prefix=/api/
```

 The above lets you 'curl localhost:8001/api/v1/pods'. # To proxy the entire kubernetes api at a different root, use:

```shell
$ kubectl proxy --api-prefix=/custom/
```

 The above lets you 'curl localhost:8001/custom/api/v1/pods' # Run a proxy to kubernetes apiserver on port 8011, serving static content from ./local/www/

```shell
kubectl proxy --port=8011 --www=./local/www/
```

 Run a proxy to kubernetes apiserver on an arbitrary local port. # The chosen port for the server will be output to stdout.

```shell
kubectl proxy --port=0
```

 Run a proxy to kubernetes apiserver, changing the api prefix to k8s-api # This makes e.g. the pods api available at localhost:8001/k8s-api/v1/pods/

```shell
kubectl proxy --api-prefix=/k8s-api
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
    <td>accept-hosts</td><td></td><td>^localhost$,^127\.0\.0\.1$,^\[::1\]$</td><td>Regular expression for hosts that the proxy should accept.</td>
    </tr>
    <tr>
    <td>accept-paths</td><td></td><td>^.*</td><td>Regular expression for paths that the proxy should accept.</td>
    </tr>
    <tr>
    <td>address</td><td></td><td>127.0.0.1</td><td>The IP address on which to serve on.</td>
    </tr>
    <tr>
    <td>api-prefix</td><td></td><td>/</td><td>Prefix to serve the proxied API under.</td>
    </tr>
    <tr>
    <td>disable-filter</td><td></td><td>false</td><td>If true, disable request filtering in the proxy. This is dangerous, and can leave you vulnerable to XSRF attacks, when used with an accessible port.</td>
    </tr>
    <tr>
    <td>keepalive</td><td></td><td>0s</td><td>keepalive specifies the keep-alive period for an active network connection. Set to 0 to disable keepalive.</td>
    </tr>
    <tr>
    <td>port</td><td>p</td><td>8001</td><td>The port on which to run the proxy. Set to 0 to pick a random port.</td>
    </tr>
    <tr>
    <td>reject-methods</td><td></td><td>^$</td><td>Regular expression for HTTP methods that the proxy should reject (example --reject-methods='POST,PUT,PATCH'). </td>
    </tr>
    <tr>
    <td>reject-paths</td><td></td><td>^/api/.*/pods/.*/exec,^/api/.*/pods/.*/attach</td><td>Regular expression for paths that the proxy should reject. Paths specified here will be rejected even accepted by --accept-paths.</td>
    </tr>
    <tr>
    <td>unix-socket</td><td>u</td><td></td><td>Unix socket on which to run the proxy.</td>
    </tr>
    <tr>
    <td>www</td><td>w</td><td></td><td>Also serve static files from the given directory under the specified prefix.</td>
    </tr>
    <tr>
    <td>www-prefix</td><td>P</td><td>/static/</td><td>Prefix to serve static files under, if static file directory is specified.</td>
    </tr>
</tbody>
</table></div>




<hr>


### Version

<div class="kubectl-reference-copyright">

<a href="https://github.com/kubernetes/kubernetes">Kubectl Reference Docs  
{{< param "fullversion" >}}   &#xa9;Copyright 2019 The Kubernetes Authors</a>

</div>

