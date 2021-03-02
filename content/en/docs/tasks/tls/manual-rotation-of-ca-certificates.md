---
title: Manual Rotation of CA Certificates
min-kubernetes-server-version: v1.13
content_type: task
---

<!-- overview -->

This page shows how to manually rotate the certificate authority (CA) certificates.

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}


- For more information about authentication in Kubernetes, see [Authenticating](/docs/reference/access-authn-authz/authentication).
- For more information about best practices for CA certificates, see [Single root CA](/docs/setup/best-practices/certificates/#single-root-ca).

<!-- steps -->

## Rotate the CA certificates manually

{{< caution >}}
Make sure to back up your certificate directory along with configuration files and any other necessary files.

This approach assumes operation of the Kubernetes control plane in a HA configuration with multiple API servers.
Graceful termination of the API server is also assumed so clients can cleanly disconnect from one API server and reconnect to another.

Configurations with a single API server will experience unavailability while the API server is being restarted.
{{< /caution >}}

1. Distribute the new CA certificates and private keys
   (ex: `ca.crt`, `ca.key`, `front-proxy-ca.crt`, and `front-proxy-ca.key`)
   to all your control plane nodes in the Kubernetes certificates directory.

1. Update {{< glossary_tooltip text="kube-controller-manager" term_id="kube-controller-manager" >}}'s `--root-ca-file` to
   include both old and new CA. Then restart the component.

   Any service account created after this point will get secrets that include both old and new CAs.

   {{< note >}}
   The files specified by the kube-controller-manager flags `--client-ca-file` and `--cluster-signing-cert-file`
   cannot be CA bundles. If these flags and `--root-ca-file` point to the same `ca.crt` file which is now a
   bundle (includes both old and new CA) you will face an error. To workaround this problem you can copy the new CA to a separate
   file and make the flags `--client-ca-file` and `--cluster-signing-cert-file` point to the copy. Once `ca.crt` is no longer
   a bundle you can restore the problem flags to point to `ca.crt` and delete the copy.
   {{< /note >}}

1. Update all service account tokens to include both old and new CA certificates.

   If any pods are started before new CA is used by API servers, they will get this update and trust both old and new CAs.

   ```shell
   base64_encoded_ca="$(base64 -w0 <path to file containing both old and new CAs>)"

   for namespace in $(kubectl get ns --no-headers | awk '{print $1}'); do
       for token in $(kubectl get secrets --namespace "$namespace" --field-selector type=kubernetes.io/service-account-token -o name); do
           kubectl get $token --namespace "$namespace" -o yaml | \
             /bin/sed "s/\(ca.crt:\).*/\1 ${base64_encoded_ca}/" | \
             kubectl apply -f -
       done
   done
   ```

1. Restart all pods using in-cluster configs (ex: kube-proxy, coredns, etc) so they can use the updated certificate authority data from *ServiceAccount* secrets.

   * Make sure coredns, kube-proxy and other pods using in-cluster configs are working as expected.

1. Append the both old and new CA to the file against `--client-ca-file` and `--kubelet-certificate-authority` flag in the `kube-apiserver` configuration.

1. Append the both old and new CA to the file against `--client-ca-file` flag in the `kube-scheduler` configuration.

1. Update certificates for user accounts by replacing the content of `client-certificate-data` and `client-key-data` respectively.

   For information about creating certificates for individual user accounts, see
   [Configure certificates for user accounts](/docs/setup/best-practices/certificates/#configure-certificates-for-user-accounts).

   Additionally, update the `certificate-authority-data` section in the kubeconfig files,
   respectively with Base64-encoded old and new certificate authority data

1. Follow below steps in a rolling fashion.

   1. Restart any other *[aggregated api servers](/docs/concepts/extend-kubernetes/api-extension/apiserver-aggregation/)*
      or *webhook handlers* to trust the new CA certificates.

   1. Restart the kubelet by update the file against `clientCAFile` in kubelet configuration and
      `certificate-authority-data` in kubelet.conf to use both the old and new CA on all nodes.

      If your kubelet is not using client certificate rotation update `client-certificate-data` and
      `client-key-data` in kubelet.conf on all nodes along with the kubelet client certificate file
      usually found in `/var/lib/kubelet/pki`.


   1. Restart API servers with the certificates (`apiserver.crt`, `apiserver-kubelet-client.crt` and
      `front-proxy-client.crt`) signed by new CA.
      You can use the existing private keys or new private keys.
      If you changed the private keys then update these in the Kubernetes certificates directory as well.

      Since the pod trusts both old and new CAs, there will be a momentarily disconnection
      after which the pod's kube client will reconnect to the new API server
      that uses the certificate signed by the new CA.

      * Restart Scheduler to use the new CAs.

      * Make sure control plane components logs no TLS errors.

      {{< note >}}
      To generate certificates and private keys for your cluster using the `openssl` command line tool, see [Certificates (`openssl`)](/docs/tasks/administer-cluster/certificates/#openssl).
      You can also use [`cfssl`](/docs/tasks/administer-cluster/certificates/#cfssl).
      {{< /note >}}

   1. Annotate any Daemonsets and Deployments to trigger pod replacement in a safer rolling fashion.

      Example:

      ```shell
      for namespace in $(kubectl get namespace -o jsonpath='{.items[*].metadata.name}'); do
          for name in $(kubectl get deployments -n $namespace -o jsonpath='{.items[*].metadata.name}'); do
              kubectl patch deployment -n ${namespace} ${name} -p '{"spec":{"template":{"metadata":{"annotations":{"ca-rotation": "1"}}}}}';
          done
          for name in $(kubectl get daemonset -n $namespace -o jsonpath='{.items[*].metadata.name}'); do
              kubectl patch daemonset -n ${namespace} ${name} -p '{"spec":{"template":{"metadata":{"annotations":{"ca-rotation": "1"}}}}}';
          done
      done
      ```

      {{< note >}}
      To limit the number of concurrent disruptions that your application experiences,
      see [configure pod disruption budget](/docs/tasks/run-application/configure-pdb/).
      {{< /note >}}

1. If your cluster is using bootstrap tokens to join nodes, update the ConfigMap `cluster-info` in the `kube-public` namespace with new CA.

   ```shell
   base64_encoded_ca="$(base64 -w0 /etc/kubernetes/pki/ca.crt)"

   kubectl get cm/cluster-info --namespace kube-public -o yaml | \
       /bin/sed "s/\(certificate-authority-data:\).*/\1 ${base64_encoded_ca}/" | \
       kubectl apply -f -
   ```

1. Verify the cluster functionality.

   1. Validate the logs from control plane components, along with the kubelet and the
      kube-proxy are not throwing any tls errors, see
      [looking at the logs](/docs/tasks/debug-application-cluster/debug-cluster/#looking-at-logs).

   1. Validate logs from any aggregated api servers and pods using in-cluster config.

1. Once the cluster functionality is successfully verified:

   1. Update all service account tokens to include new CA certificate only.

      * All pods using an in-cluster kubeconfig will eventually need to be restarted to pick up the new SA secret for the old CA to be completely untrusted.

   1. Restart the control plane components by removing the old CA from the kubeconfig files and the files against `--client-ca-file`, `--root-ca-file` flags resp.

   1. Restart kubelet by removing the old CA from file against the `clientCAFile` flag and kubelet kubeconfig file.

