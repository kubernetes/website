---
Title: kube-apiserver
Notitle: true
---
## kube-apiserver



### Summary


The Kubernetes API server validates and configures data for api objects, including pods, services, replicationcontrollers, and other api objects. The API Server provides REST operations and front-ends to the cluster's shared state where all other components interact.

```
Kube-apiserver
```

### Options
```

      --admission-control stringSlice An ordered list of admission control plug-ins that control resource access to the cluster. Comma-separated list of NamespaceLifecycles. (Default is [AlwaysAdmit])

      --admission-control-config-file string File containing the admission control configuration.

      --advertise-address ip Notifies the cluster member of the IP address of the apiserver message. This address must be accessible to other members of the cluster. If the IP address is empty, --bind-address will be used. If --bind-address is not specified, the default interface address of the host will be used.

      --allow-privileged If true, allows privilege containers.

      --anonymous-auth Enables anonymous requests to the secure port of the API server. Requests that are not rejected by other authentication methods are treated as anonymous requests. The user name of the anonymous request is system:anonymous and the user group name is system:unauthenticated. (default is true)

      --apiserver-count int Number of apiservers running in the cluster, must be positive. (default 1)

      --audit-log-maxage int Based on the timestamp in the file name, the maximum number of days of old audit log file retention.

      --audit-log-maxbackup int Maximum number of old audit log files to retain.

      --audit-log-maxsize int The maximum number of megabytes before the audit log was rotated.

      --audit-log-path string If this value is set, all requests to apiserver will be logged to this file. '-' indicates that the standard output is recorded.

      --audit-policy-file string Path to the file that defines the audit policy configuration. Need to open the 'AdvancedAuditing' feature switch. AdvancedAuditing requires a configuration to enable auditing.

      --audit-webhook-config-file string A path with a kubeconfig format file that defines the audited webhook configuration. Need to open the 'AdvancedAuditing' feature switch.

      --audit-webhook-mode string Policy for sending audit events. Blocking mode indicates that the server's response should be blocked while an event is being sent. Batch mode makes webhook asynchronously cache and send events. Known mode is batch, blocking. (default "batch")

      --authentication-token-webhook-cache-ttl duration The cache length of the response obtained from the webhook token certifier. (default 2m0s)

      --authentication-token-webhook-config-file string A file containing a webhook configuration for token authentication in the kubeconfig format. The API server will query the remote service to determine the certification of the bearer token.

      --authorization-mode string Order list of plug-ins for permission verification on secure ports. Comma-separated list including: AlwaysAllow, AlwaysDeny, ABAC, Webhook, RBAC, Node. (Default "AlwaysAllow")
 
      --authorization-policy-file string The csv file containing the authority verification policy, used with --authorization-mode=ABAC, on the secure port.
 
      --authorization-webhook-cache-authorized-ttl duration The cache length of the 'authorized' response obtained from the webhook authorizer. (default 5m0s)
 
      --authorization-webhook-cache-unauthorized-ttl duration The cache length of the 'unauthorized' response obtained from the webhook authorizer. (Default 30s)
 
      --authorization-webhook-config-file string The kubeconfig format file that contains the webhook configuration, used with --authorization-mode=Webhook. The API server will query the remote service to determine access to the secure port of the API server.
 
      --azure-container-registry-config string Path to the file that contains the Azure Container registry configuration information.

      --basic-auth-file string If this value is set, this file will be used to permit requests through http basic authentication to the secure port of the API server.

      --bind-address ip listen--seure-port's IP address. The associated interface must be accessible to other cluster nodes and CLI/web clients. If empty, all interfaces (0.0.0.0) will be used. (Default 0.0.0.0)

      --cert-dir string The directory where the TLS certificate is stored. If the --tls-cert-file and --tls-private-key-file options are provided, this flag will be ignored. (Default "/var/run/kubernetes")

      --client-ca-file string If this flag is set, the client certificate containing the authorities signature in client-ca-file for any request will be authenticated using the identity corresponding to the CommonName in the client certificate.
 
      --cloud-config string Cloud service provider configuration file path. Empty string means no configuration file.
 
      --cloud-provider string Cloud provider, empty string means no provider.
 
      --contention-profiling Enables lock contention profiling if profiling is enabled.

      --cors-allowed-origins stringSlice List of CORS fields, separated by commas. A legal domain can be a regular expression that matches a subdomain. If this list is empty, CORS will not be enabled.

      --delete-collection-workers int Number of workers for the DeleteCollection call. This is used to speed up the cleanup of the namespace. (default 1)

      --deserialization-cache-size int Number of deserialized json objects cached in memory.

      --enable-aggregator-routing Opens an aggregator route request to the endpoints IP, replacing the cluster IP.

      --enable-garbage-collector Enables the generic garbage collector. It must be synchronized with the corresponding flag of the kube-controller-manager. (default is true)

      --enable-logs-handler If true, install a /logs processor for the apiserver logging feature. (default is true)

      --enable-swagger-ui Enables swagger ui in the /swagger-ui path of the apiserver.

      --etcd-cafile string An SSL CA file used to protect etcd traffic.

      --etcd-certfile string SSL certificate file used to protect etcd communication.

      --etcd-keyfile string SSL key file used to protect etcd traffic.

      --etcd-prefix string The prefix appended to all resource paths in etcd. (default "/registry")

      --etcd-quorum-read If true, enable quorum reads.

      --etcd-servers stringSlice List of etcd servers connected in the form (scheme://ip:port), separated by commas.

      --etcd-servers-overrides stringSlice etcd server override configuration for individual resources, separated by commas. The single configuration override format is: group/resource#servers, where the servers are in the form of http://ip:port, separated by semicolons.

      --event-ttl duration Event dwell time. (default 1h0m0s)

      --experimental-bootstrap-token-auth Enable this option to allow the 'bootstrap.kubernetes.io/token' type key in the 'kube-system' namespace to be used for startup authentication of TLS.

      --experimental-encryption-provider-config string Contains the configuration file for the cryptographic provider that was used to store the key in etcd.

      --experimental-keystone-ca-file string If this value is set, the certificate of the Keystone service will be verified with an authority in the experimental-keystone-ca-file, otherwise the host's root CA will be used for authentication.

      --experimental-keystone-url string If this value is set, the keystone authentication plug-in will be enabled.

      --external-hostname string Hostname used when generating the external URL for this master (for example, the Swagger API documentation).

      --feature-gates mapStringBool A list of key-value pairs that describe the alpha/experimental feature switches. Options include:
Accelerators=true|false (ALPHA - default=false)
AdvancedAuditing=true|false (ALPHA - default=false)
AffinityInAnnotations=true|false (ALPHA - default=false)
AllAlpha=true|false (ALPHA - default=false)
AllowExtTrafficLocalEndpoints=true|false (default=true)
AppArmor=true|false (BETA - default=true)
DynamicKubeletConfig=true|false (ALPHA - default=false)
DynamicVolumeProvisioning=true|false (ALPHA - default=true)
ExperimentalCriticalPodAnnotation=true|false (ALPHA - default=false)
ExperimentalHostUserNamespaceDefaulting=true|false (BETA - default=false)
LocalStorageCapacityIsolation=true|false (ALPHA - default=false)
PersistentLocalVolumes=true|false (ALPHA - default=false)
RotateKubeletClientCertificate=true|false (ALPHA - default=false)
RotateKubeletServerCertificate=true|false (ALPHA - default=false)
StreamingProxyRedirects=true|false (BETA - default=true)
TaintBasedEvictions=true|false (ALPHA - default=false)

      --google-json-key string The JSON key of the Google Cloud Platform service account used for authentication.

      --insecure-allow-any-token username/group1,group2 If you set this value, your service will be in an unsecured state. Any token will be allowed and the user information will be resolved from the token to username/group1, group2.

      --insecure-bind-address ip is used to listen on the IP address of --insecure-port (set to 0.0.0.0 to listen on all interfaces). (The default value is 127.0.0.1)

      --insecure-port int Listen for ports that are insecure and for authenticated access. This configuration assumes that you have set firewall rules so that this port cannot be accessed from outside the cluster. Access to port 443 of the cluster's public address will be proxied to this port. The nginx implementation is used in the default settings. (Default 8080)

      --kubelet-certificate-authority string The file path of the certificate authority.

      --kubelet-client-certificate string Client certificate file path for TLS.

      --kubelet-client-key string Client certificate key file path for TLS.

      --kubelet-https Enable https for kubelet. (default is true)

      --kubelet-preferred-address-types stringSlice The list of preferred NodeAddressTypes for kubelet connections. (Default value [Hostname,InternalDNS,InternalIP,ExternalDNS,ExternalIP])

      --kubelet-read-only-port uint Deprecated: kubelet port. (Default 10255)

      --kubelet-timeout duration Kubelet operation timeout. (Defaults
      5s)

      --kubernetes-service-node-port int If not 0, the Kubernetes master service (for creating/managing an apiserver) will use the NodePort type and use this value as the port number. If 0, the Kubernetes master service will use the ClusterIP type.

      --master-service-namespace string Deprecated: The namespace of the kubernetes master service injected into the pod. (Default "default")

      --max-connection-bytes-per-sec int If not 0, each user connection will be limited to this value (bytes/sec). Currently only applies to long-running requests.

      --max-mutating-requests-inflight int Maximum number of moderately variable requests made at a given time. When this value is exceeded, the service will reject all requests. A value of 0 means there is no limit. (Default 200)

      --max-requests-inflight int The maximum number of immutable requests made at a given time. When this value is exceeded, the service will reject all requests. A value of 0 means there is no limit. (Default 400)

      --min-request-timeout int An optional field that represents the minimum number of seconds a handler must keep an open request before timing out. Currently only valid for the listen request handler, it selects a random number based on this value as the connection timeout value to achieve the purpose of distributing the load (default value 1800).
      
      --oidc-ca-file string If this value is set, the OpenID service's certificate will be verified using any authority in oidc-ca-file, otherwise the host's root CA will be used to verify it.
      
      --oidc-client-id string ID of the client connected using OpenID. If oidc-issuer-url is set, this value must be set.
       
      --oidc-groups-claim string If provided, this custom OpenID connection name will be assigned to a specific user group. The declared value needs to be a string or an array of strings. This flag is experimental. Please check the verification documentation for further details.

      --oidc-issuer-url string OpenID issuer URL accepts only HTTPS schemes. If this value is set, it will be used to validate the OIDC JSON Web Token (JWT).
      
      --oidc-username-claim string The OpenID declaration value to use as the username. Note that the uniqueness and invariance of other declared values ​​other than the default ('sub') are not guaranteed. This flag is experimental. Please check the verification documentation for further details.
       
      --profiling Enables profiling on the web interface host:port/debug/pprof/. (default is true)
       
      --proxy-client-cert-file string Client certificate used to prove the identity of the aggregator or kuber-apiserver when an external program must be invoked. Includes requests for proxy to user api-server and calls for webhook admission control plug-ins. It expects this certificate to contain a signature from the --requestheader-client-ca-file tag in the CA. The CA is published in the 'extension-apiserver-authentication' configmap of the kube-system namespace. The components that are called from Kube-aggregator should use this CA for their partial bidirectional TLS authentication.
 
      --proxy-client-key-file string The client certificate key used to prove the identity of the aggregator or kuber-apiserver when an external program must be invoked. Includes requests for proxy to user api-server and calls for webhook admission control plug-ins.
      
      --repair-malformed-updates If true, the service will do its best to fix the update request to pass validation, for example: to set the current value of the update request UID to null. After we have fixed all clients that send a malformed request, this flag can be turned off.

      --requestheader-allowed-names stringSlice Specifies a list of client certificate common names that are specified in --requestheader-username-headers, which allows the user name to be provided in the header. If it is null, any client certificate that is verified by the authorities in --requestheader-client-ca-file is allowed.
      
      --requestheader-client-ca-file string Root certificate bundle used to verify the client certificate in the access request before the username indicated by --requestheader-username-headers in the trust request header.
      
      --requestheader-extra-headers-prefix stringSlice A list of prefixes for the request headers to check. X-Remote-Extra- is recommended.

      --requestheader-group-headers stringSlice A list of headers used to check the group. It is recommended to use X-Remote-Group.
       
      --requestheader-username-headers stringSlice A list of headers used to check the username. X-Remote-User is recommended.
       
      --runtime-config mapStringString The set of key-value pairs passed to apiserver to describe the runtime configuration. The apis/<groupVersion> key can be used to turn on/off a particular api version. The apis/<groupVersion>/<resource> keys are used to enable/disable specific resources. The api/all and api/legacy keys are used to control all and legacy API versions, respectively.
        
      --secure-port int Port used to listen to the HTTPS protocol with authentication and authorization. If 0, the HTTPS protocol is not monitored. (Default 6443)
       
      --service-account-key-file stringArray A file containing a PEM-encrypted x509 RSA or ECDSA private or public key used to verify the ServiceAccount token. If this value is set, --tls-private-key-file will be used. The specified file can contain multiple keys, and this flag can be used multiple times with different files.
      
      --service-cluster-ip-range ipNet CIDR indicates the IP range from which the service's cluster ip will be allocated. Never overlap with the IP ranges assigned to nodes and pods.
      
      --ssh-keyfile string If not empty, this file is used as the user key file when using a secure SSH proxy to access the node.
      
      --storage-backend string Persistent storage backend. The options are: 'etcd3' (default), 'etcd2'.
     
      --storage-media-type string Stores the media type of the object in storage. Some resources or storage backends may only support specific media types and ignore this configuration item. (Default "application/vnd.kubernetes.protobuf")
      
      --storage-versions string The version of the resource store divided by group. Specified in the format of "group1/version1, group2/version2, ...". When objects move from one group to another, you can specify the format of "group1=group2/v1beta1,group3/v1beta1,...". You only need to pass in a list of groups that you want to change from the result. The default is a list of preferred versions of all registered groups that are integrated from the KUBE_API_VERSIONS environment variable. (The default value "admission.k8s.io/v1alpha1,admissionregistration.k8s.io/v1alpha1,apps/v1beta1,authentication.k8s.io/v1,authorization.k8s.io/v1,autoscaling/v1,batch/v1,certificates. k8s.io/v1beta1,componentconfig/v1alpha1,extensions/v1beta1,federation/v1beta1,imagepolicy.k8s.io/v1alpha1,networking.k8s.io/v1,policy/v1beta1,rbac.authorization.k8s.io/v1beta1,settings. K8s.io/v1alpha1,storage.k8s.io/v1,v1")
      
      --target-ram-mb int apiserver memory limit in MB (for configuring cache size, etc.)
      
      --tls-ca-file string If this value is set, this certificate authority will be used for secure access from the Admission Controllers. It must be a PEM encrypted legitimate CA bundle. In addition, the certificate authority can be added to the certificate file provided with --tls-cert-file.
      
      --tls-cert-file string File containing the default x509 certificate for HTTPS. (If you have a CA certificate is appended after the server certificate). If the HTTPS service is enabled, and does not provide --tls-cert-file and --tls-private-key-file, it will generate a self-signed certificate and key public address and save it in / var / run / kubernetes table of Contents.
      
      --tls-private-key-file string File containing the x509 certificate private key that matches the --tls-cert-file.
      
      --tls-sni-cert-key namedCertKey A file path for a pair of x509 certificates and private keys. You can use the form of the domain that matches the official domain name as a suffix. If no domain form suffix is ​​provided, the certificate name will be extracted. The non-wildcard version takes precedence over the wildcard version, and the displayed field takes precedence over the extracted name in the certificate. For multiple key/certificate pairs, use --tls-sni-cert-key multiple times. For example: "example.crt,example.key" or "foo.crt,foo.key:*.foo.com,foo.com". (Default value [])
      
      --token-auth-file string If this value is set, this file will be used to secure the API service's secure port through token authentication.
      
      --version version[=true] Print version information and exit.
      
      --watch-cache Enables apiserver's monitoring cache. (default is true)
      
      --watch-cache-sizes stringSlice A list of monitoring buffer sizes for each resource (pods, nodes, etc.), separated by commas. Form for each cache configuration: resource # size, size is a number. Effective when watch-cache is enabled.
```
