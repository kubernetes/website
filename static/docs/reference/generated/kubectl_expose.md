---
title: kubectl expose
content_template: templates/tool-reference
weight: 28
---

{{% capture synopsis %}}


Expose a resource as a new Kubernetes service.

 Looks up a deployment, service, replica set, replication controller or pod by name and uses the selector for that resource as the selector for a new service on the specified port. A deployment or replica set will be exposed as a service only if its selector is convertible to a selector that service supports, i.e. when the selector contains only the matchLabels component. Note that if no port is specified via --port and the exposed resource has multiple ports, all will be re-used by the new service. Also if no labels are specified, the new service will re-use the labels from the resource it exposes.

 Possible resources include (case insensitive):

 pod (po), service (svc), replicationcontroller (rc), deployment (deploy), replicaset (rs)

```
kubectl expose (-f FILENAME | TYPE NAME) [--port=port] [--protocol=TCP|UDP|SCTP] [--target-port=number-or-name] [--name=name] [--external-ip=external-ip-of-service] [--type=type]
```

{{% /capture %}}

{{% capture examples %}}

```
  # Create a service for a replicated nginx, which serves on port 80 and connects to the containers on port 8000.
  kubectl expose rc nginx --port=80 --target-port=8000
  
  # Create a service for a replication controller identified by type and name specified in "nginx-controller.yaml", which serves on port 80 and connects to the containers on port 8000.
  kubectl expose -f nginx-controller.yaml --port=80 --target-port=8000
  
  # Create a service for a pod valid-pod, which serves on port 444 with the name "frontend"
  kubectl expose pod valid-pod --port=444 --name=frontend
  
  # Create a second service based on the above service, exposing the container port 8443 as port 443 with the name "nginx-https"
  kubectl expose service nginx --port=443 --target-port=8443 --name=nginx-https
  
  # Create a service for a replicated streaming application on port 4100 balancing UDP traffic and named 'video-stream'.
  kubectl expose rc streamer --port=4100 --protocol=UDP --name=video-stream
  
  # Create a service for a replicated nginx using replica set, which serves on port 80 and connects to the containers on port 8000.
  kubectl expose rs nginx --port=80 --target-port=8000
  
  # Create a service for an nginx deployment, which serves on port 80 and connects to the containers on port 8000.
  kubectl expose deployment nginx --port=80 --target-port=8000
```

{{% /capture %}}

{{% capture options %}}

<table style="width: 100%; table-layout: fixed;">
  <colgroup>
    <col span="1" style="width: 10px;" />
    <col span="1" />
  </colgroup>
  <tbody>

    <tr>
      <td colspan="2">--allow-missing-template-keys&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: true</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">If true, ignore any errors in templates when a field or map key is missing in the template. Only applies to golang and jsonpath output formats.</td>
    </tr>

    <tr>
      <td colspan="2">--cluster-ip string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">ClusterIP to be assigned to the service. Leave empty to auto-allocate, or set to 'None' to create a headless service.</td>
    </tr>

    <tr>
      <td colspan="2">--dry-run</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">If true, only print the object that would be sent, without sending it.</td>
    </tr>

    <tr>
      <td colspan="2">--external-ip string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Additional external IP address (not managed by Kubernetes) to accept for the service. If this IP is routed to a node, the service can be accessed by this IP in addition to its generated service IP.</td>
    </tr>

    <tr>
      <td colspan="2">-f, --filename stringSlice</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Filename, directory, or URL to files identifying the resource to expose a service</td>
    </tr>

    <tr>
      <td colspan="2">--generator string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "service/v2"</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">The name of the API generator to use. There are 2 generators: 'service/v1' and 'service/v2'. The only difference between them is that service port in v1 is named 'default', while it is left unnamed in v2. Default is 'service/v2'.</td>
    </tr>

    <tr>
      <td colspan="2">-h, --help</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">help for expose</td>
    </tr>

    <tr>
      <td colspan="2">-k, --kustomize string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Process the kustomization directory. This flag can't be used together with -f or -R.</td>
    </tr>

    <tr>
      <td colspan="2">-l, --labels string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Labels to apply to the service created by this call.</td>
    </tr>

    <tr>
      <td colspan="2">--load-balancer-ip string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">IP to assign to the LoadBalancer. If empty, an ephemeral IP will be created and used (cloud-provider specific).</td>
    </tr>

    <tr>
      <td colspan="2">--name string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">The name for the newly created object.</td>
    </tr>

    <tr>
      <td colspan="2">-o, --output string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Output format. One of: json|yaml|name|go-template|go-template-file|template|templatefile|jsonpath|jsonpath-file.</td>
    </tr>

    <tr>
      <td colspan="2">--overrides string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">An inline JSON override for the generated object. If this is non-empty, it is used to override the generated object. Requires that the object supply a valid apiVersion field.</td>
    </tr>

    <tr>
      <td colspan="2">--port string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">The port that the service should serve on. Copied from the resource being exposed, if unspecified</td>
    </tr>

    <tr>
      <td colspan="2">--protocol string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">The network protocol for the service to be created. Default is 'TCP'.</td>
    </tr>

    <tr>
      <td colspan="2">--record</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Record current kubectl command in the resource annotation. If set to false, do not record the command. If set to true, record the command. If not set, default to updating the existing annotation value only if one already exists.</td>
    </tr>

    <tr>
      <td colspan="2">-R, --recursive</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Process the directory used in -f, --filename recursively. Useful when you want to manage related manifests organized within the same directory.</td>
    </tr>

    <tr>
      <td colspan="2">--save-config</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">If true, the configuration of current object will be saved in its annotation. Otherwise, the annotation will be unchanged. This flag is useful when you want to perform kubectl apply on this object in the future.</td>
    </tr>

    <tr>
      <td colspan="2">--selector string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">A label selector to use for this service. Only equality-based selector requirements are supported. If empty (the default) infer the selector from the replication controller or replica set.)</td>
    </tr>

    <tr>
      <td colspan="2">--session-affinity string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">If non-empty, set the session affinity for the service to this; legal values: 'None', 'ClientIP'</td>
    </tr>

    <tr>
      <td colspan="2">--target-port string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Name or number for the port on the container that the service should direct traffic to. Optional.</td>
    </tr>

    <tr>
      <td colspan="2">--template string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Template string or path to template file to use when -o=go-template, -o=go-template-file. The template format is golang templates [http://golang.org/pkg/text/template/#pkg-overview].</td>
    </tr>

    <tr>
      <td colspan="2">--type string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Type for this service: ClusterIP, NodePort, LoadBalancer, or ExternalName. Default is 'ClusterIP'.</td>
    </tr>

  </tbody>
</table>



{{% /capture %}}

{{% capture parentoptions %}}

<table style="width: 100%; table-layout: fixed;">
  <colgroup>
    <col span="1" style="width: 10px;" />
    <col span="1" />
  </colgroup>
  <tbody>

    <tr>
      <td colspan="2">--add-dir-header</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">If true, adds the file directory to the header</td>
    </tr>

    <tr>
      <td colspan="2">--alsologtostderr</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">log to standard error as well as files</td>
    </tr>

    <tr>
      <td colspan="2">--application-metrics-count-limit int&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 100</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Max number of application metrics to store (per container)</td>
    </tr>

    <tr>
      <td colspan="2">--as string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Username to impersonate for the operation</td>
    </tr>

    <tr>
      <td colspan="2">--as-group stringArray</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Group to impersonate for the operation, this flag can be repeated to specify multiple groups.</td>
    </tr>

    <tr>
      <td colspan="2">--azure-container-registry-config string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Path to the file containing Azure container registry configuration information.</td>
    </tr>

    <tr>
      <td colspan="2">--boot-id-file string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "/proc/sys/kernel/random/boot_id"</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Comma-separated list of files to check for boot-id. Use the first one that exists.</td>
    </tr>

    <tr>
      <td colspan="2">--cache-dir string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "/home/karen/.kube/http-cache"</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Default HTTP cache directory</td>
    </tr>

    <tr>
      <td colspan="2">--certificate-authority string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Path to a cert file for the certificate authority</td>
    </tr>

    <tr>
      <td colspan="2">--client-certificate string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Path to a client certificate file for TLS</td>
    </tr>

    <tr>
      <td colspan="2">--client-key string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Path to a client key file for TLS</td>
    </tr>

    <tr>
      <td colspan="2">--cloud-provider-gce-l7lb-src-cidrs cidrs&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 130.211.0.0/22,35.191.0.0/16</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">CIDRs opened in GCE firewall for L7 LB traffic proxy & health checks</td>
    </tr>

    <tr>
      <td colspan="2">--cloud-provider-gce-lb-src-cidrs cidrs&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 130.211.0.0/22,209.85.152.0/22,209.85.204.0/22,35.191.0.0/16</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">CIDRs opened in GCE firewall for L4 LB traffic proxy & health checks</td>
    </tr>

    <tr>
      <td colspan="2">--cluster string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">The name of the kubeconfig cluster to use</td>
    </tr>

    <tr>
      <td colspan="2">--container-hints string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "/etc/cadvisor/container_hints.json"</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">location of the container hints file</td>
    </tr>

    <tr>
      <td colspan="2">--containerd string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "/run/containerd/containerd.sock"</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">containerd endpoint</td>
    </tr>

    <tr>
      <td colspan="2">--containerd-namespace string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "k8s.io"</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">containerd namespace</td>
    </tr>

    <tr>
      <td colspan="2">--context string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">The name of the kubeconfig context to use</td>
    </tr>

    <tr>
      <td colspan="2">--default-not-ready-toleration-seconds int&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 300</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Indicates the tolerationSeconds of the toleration for notReady:NoExecute that is added by default to every pod that does not already have such a toleration.</td>
    </tr>

    <tr>
      <td colspan="2">--default-unreachable-toleration-seconds int&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 300</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Indicates the tolerationSeconds of the toleration for unreachable:NoExecute that is added by default to every pod that does not already have such a toleration.</td>
    </tr>

    <tr>
      <td colspan="2">--disable-root-cgroup-stats</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Disable collecting root Cgroup stats</td>
    </tr>

    <tr>
      <td colspan="2">--docker string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "unix:///var/run/docker.sock"</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">docker endpoint</td>
    </tr>

    <tr>
      <td colspan="2">--docker-env-metadata-whitelist string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">a comma-separated list of environment variable keys that needs to be collected for docker containers</td>
    </tr>

    <tr>
      <td colspan="2">--docker-only</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Only report docker containers in addition to root stats</td>
    </tr>

    <tr>
      <td colspan="2">--docker-root string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "/var/lib/docker"</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">DEPRECATED: docker root is read from docker info (this is a fallback, default: /var/lib/docker)</td>
    </tr>

    <tr>
      <td colspan="2">--docker-tls</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">use TLS to connect to docker</td>
    </tr>

    <tr>
      <td colspan="2">--docker-tls-ca string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "ca.pem"</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">path to trusted CA</td>
    </tr>

    <tr>
      <td colspan="2">--docker-tls-cert string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "cert.pem"</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">path to client certificate</td>
    </tr>

    <tr>
      <td colspan="2">--docker-tls-key string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "key.pem"</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">path to private key</td>
    </tr>

    <tr>
      <td colspan="2">--enable-load-reader</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Whether to enable cpu load reader</td>
    </tr>

    <tr>
      <td colspan="2">--event-storage-age-limit string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "default=0"</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Max length of time for which to store events (per type). Value is a comma separated list of key values, where the keys are event types (e.g.: creation, oom) or "default" and the value is a duration. Default is applied to all non-specified event types</td>
    </tr>

    <tr>
      <td colspan="2">--event-storage-event-limit string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "default=0"</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Max number of events to store (per type). Value is a comma separated list of key values, where the keys are event types (e.g.: creation, oom) or "default" and the value is an integer. Default is applied to all non-specified event types</td>
    </tr>

    <tr>
      <td colspan="2">--global-housekeeping-interval duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 1m0s</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Interval between global housekeepings</td>
    </tr>

    <tr>
      <td colspan="2">--housekeeping-interval duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 10s</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Interval between container housekeepings</td>
    </tr>

    <tr>
      <td colspan="2">--insecure-skip-tls-verify</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">If true, the server's certificate will not be checked for validity. This will make your HTTPS connections insecure</td>
    </tr>

    <tr>
      <td colspan="2">--kubeconfig string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Path to the kubeconfig file to use for CLI requests.</td>
    </tr>

    <tr>
      <td colspan="2">--log-backtrace-at traceLocation&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: :0</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">when logging hits line file:N, emit a stack trace</td>
    </tr>

    <tr>
      <td colspan="2">--log-cadvisor-usage</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Whether to log the usage of the cAdvisor container</td>
    </tr>

    <tr>
      <td colspan="2">--log-dir string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">If non-empty, write log files in this directory</td>
    </tr>

    <tr>
      <td colspan="2">--log-file string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">If non-empty, use this log file</td>
    </tr>

    <tr>
      <td colspan="2">--log-file-max-size uint&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 1800</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Defines the maximum size a log file can grow to. Unit is megabytes. If the value is 0, the maximum file size is unlimited.</td>
    </tr>

    <tr>
      <td colspan="2">--log-flush-frequency duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 5s</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Maximum number of seconds between log flushes</td>
    </tr>

    <tr>
      <td colspan="2">--logtostderr&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: true</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">log to standard error instead of files</td>
    </tr>

    <tr>
      <td colspan="2">--machine-id-file string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "/etc/machine-id,/var/lib/dbus/machine-id"</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Comma-separated list of files to check for machine-id. Use the first one that exists.</td>
    </tr>

    <tr>
      <td colspan="2">--match-server-version</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Require server version to match client version</td>
    </tr>

    <tr>
      <td colspan="2">-n, --namespace string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">If present, the namespace scope for this CLI request</td>
    </tr>

    <tr>
      <td colspan="2">--password string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Password for basic authentication to the API server</td>
    </tr>

    <tr>
      <td colspan="2">--profile string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "none"</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Name of profile to capture. One of (none|cpu|heap|goroutine|threadcreate|block|mutex)</td>
    </tr>

    <tr>
      <td colspan="2">--profile-output string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "profile.pprof"</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Name of the file to write the profile to</td>
    </tr>

    <tr>
      <td colspan="2">--request-timeout string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "0"</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">The length of time to wait before giving up on a single server request. Non-zero values should contain a corresponding time unit (e.g. 1s, 2m, 3h). A value of zero means don't timeout requests.</td>
    </tr>

    <tr>
      <td colspan="2">-s, --server string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">The address and port of the Kubernetes API server</td>
    </tr>

    <tr>
      <td colspan="2">--skip-headers</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">If true, avoid header prefixes in the log messages</td>
    </tr>

    <tr>
      <td colspan="2">--skip-log-headers</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">If true, avoid headers when opening log files</td>
    </tr>

    <tr>
      <td colspan="2">--stderrthreshold severity&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 2</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">logs at or above this threshold go to stderr</td>
    </tr>

    <tr>
      <td colspan="2">--storage-driver-buffer-duration duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 1m0s</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Writes in the storage driver will be buffered for this duration, and committed to the non memory backends as a single transaction</td>
    </tr>

    <tr>
      <td colspan="2">--storage-driver-db string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "cadvisor"</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">database name</td>
    </tr>

    <tr>
      <td colspan="2">--storage-driver-host string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "localhost:8086"</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">database host:port</td>
    </tr>

    <tr>
      <td colspan="2">--storage-driver-password string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "root"</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">database password</td>
    </tr>

    <tr>
      <td colspan="2">--storage-driver-secure</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">use secure connection with database</td>
    </tr>

    <tr>
      <td colspan="2">--storage-driver-table string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "stats"</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">table name</td>
    </tr>

    <tr>
      <td colspan="2">--storage-driver-user string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "root"</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">database username</td>
    </tr>

    <tr>
      <td colspan="2">--token string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Bearer token for authentication to the API server</td>
    </tr>

    <tr>
      <td colspan="2">--update-machine-info-interval duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 5m0s</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Interval between machine info updates.</td>
    </tr>

    <tr>
      <td colspan="2">--user string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">The name of the kubeconfig user to use</td>
    </tr>

    <tr>
      <td colspan="2">--username string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Username for basic authentication to the API server</td>
    </tr>

    <tr>
      <td colspan="2">-v, --v Level</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">number for the log level verbosity</td>
    </tr>

    <tr>
      <td colspan="2">--version version[=true]</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Print version information and quit</td>
    </tr>

    <tr>
      <td colspan="2">--vmodule moduleSpec</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">comma-separated list of pattern=N settings for file-filtered logging</td>
    </tr>

  </tbody>
</table>



{{% /capture %}}

{{% capture seealso %}}

* [kubectl](kubectl.md)	 - kubectl controls the Kubernetes cluster manager

{{% /capture %}}

