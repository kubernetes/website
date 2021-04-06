---
title: 手动轮换 CA 证书
min-kubernetes-server-version: v1.13
content_type: task
---
<!--
title: Manual Rotation of CA Certificates
min-kubernetes-server-version: v1.13
content_type: task
-->
<!-- overview -->

<!--
This page shows how to manually rotate the certificate authority (CA) certificates.
-->
本页展示如何手动轮换证书机构（CA）证书。

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!--
- For more information about authentication in Kubernetes, see [Authenticating](/docs/reference/access-authn-authz/authentication).
- For more information about best practices for CA certificates, see [Single root CA](/docs/setup/best-practices/certificates/#single-root-ca).
-->
- 要了解 Kubernetes 中用户认证的更多信息，参阅
  [认证](/zh/docs/reference/access-authn-authz/authentication)；
- 要了解与 CA 证书最佳实践有关的更多信息，参阅[单根 CA](/zh/docs/setup/best-practices/certificates/#single-root-ca)。

<!-- steps -->

<!--
## Rotate the CA certificates manually
-->
## 手动轮换 CA 证书  {#rotate-the-ca-certificates-manually}

<!--
Make sure to back up your certificate directory along with configuration files and any other necessary files.

This approach assumes operation of the Kubernetes control plane in a HA configuration with multiple API servers.
Graceful termination of the API server is also assumed so clients can cleanly disconnect from one API server and reconnect to another.

Configurations with a single API server will experience unavailability while the API server is being restarted.
-->
{{< caution >}}
确保备份你的证书目录、配置文件以及其他必要文件。

这里的方法假定 Kubernetes 的控制面通过运行多个 API 服务器以高可用配置模式运行。
另一假定是 API 服务器可体面地终止，因而客户端可以彻底地与一个 API 服务器断开
连接并连接到另一个 API 服务器。

如果集群中只有一个 API 服务器，则在 API 服务器重启期间会经历服务中断期。
{{< /caution >}}

<!--
1. Distribute the new CA certificates and private keys
   (ex: `ca.crt`, `ca.key`, `front-proxy-ca.crt`, and `front-proxy-ca.key`)
   to all your control plane nodes in the Kubernetes certificates directory.
-->
1. 将新的 CA 证书和私钥（例如：`ca.crt`、`ca.key`、`front-proxy-ca.crt` 和
   `front-proxy-client.key`）分发到所有控制面节点，放在其 Kubernetes 证书目录下。

<!--
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
-->
2. 更新 {{< glossary_tooltip text="kube-controller-manager" term_id="kube-controller-manager" >}} 的
   `--root-ca-file` 标志，使之同时包含老的和新的 CA，之后重启组件。

   自此刻起，所创建的所有服务账号都会获得同时包含老的 CA 和新的 CA 的 Secret。

   {{< note >}}
   kube-controller-manager 标志 `--client-ca-file` 和 `--cluster-signing-cert-file` 所引用的文件
   不能是 CA 证书包。如果这些标志和 `--root-ca-file` 指向同一个 `ca.crt` 包文件（包含老的和新的 CA 证书），
   你将会收到出错信息。
   要解决这个问题，可以将新的 CA 证书复制到单独的文件中，并将 `--client-ca-file` 和 `--cluster-signing-cert-file` 
   标志指向该副本。一旦 `ca.crt` 不再是证书包文件，就可以恢复有问题的标志指向  `ca.crt` 并删除该副本。
   {{< /note >}}

<!--
   1. Update all service account tokens to include both old and new CA certificates.

   If any pods are started before new CA is used by API servers, they will get this update and trust both old and new CAs.
-->
3. 更新所有服务账号令牌，使之同时包含老的和新的 CA 证书。

   如果在 API 服务器使用新的 CA 之前启动了新的 Pod，这些 Pod
   也会获得此更新并且同时信任老的和新的 CA 证书。
   <!--
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
   -->

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
<!--
1. Restart all pods using in-cluster configs (ex: kube-proxy, coredns, etc) so they can use the updated certificate authority data from *ServiceAccount* secrets.

   * Make sure coredns, kube-proxy and other pods using in-cluster configs are working as expected.

1. Append the both old and new CA to the file against `-client-ca-file` and `-kubelet-certificate-authority` flag in the `kube-apiserver` configuration.

1. Append the both old and new CA to the file against `-client-ca-file` flag in the `kube-scheduler` configuration.
-->
4. 重启所有使用集群内配置的 Pods（例如：`kube-proxy`、`coredns` 等），以便这些 Pod 能够使用
   来自 *ServiceAccount* Secret 中的、已更新的证书机构数据。

   * 确保 `coredns`、`kube-proxy` 和其他使用集群内配置的 Pod 都正按预期方式工作。

5. 将老的和新的 CA 都追加到 `kube-apiserver` 配置的 `--client-ca-file` 和 `--kubelet-certificate-authority` 标志所指的文件。

6. 将老的和新的 CA 都追加到 `kube-scheduler` 配置的 `--client-ca-file` 标志所指的文件。

<!--
1. Update certificates for user accounts by replacing the content of `client-certificate-data` and `client-key-data` respectively.

   For information about creating certificates for individual user accounts, see
   [Configure certificates for user accounts](/docs/setup/best-practices/certificates/#configure-certificates-for-user-accounts).

   Additionally, update the `certificate-authority-data` section in the kubeconfig files,
   respectively with Base64-encoded old and new certificate authority data
-->
7. 通过替换 `client-certificate-data` 和 `client-key-data`
   中的内容，更新用户账号的证书。

   有关为独立用户账号创建证书的更多信息，可参阅
   [为用户帐号配置证书](/zh/docs/setup/best-practices/certificates/#configure-certificates-for-user-accounts)。

   另外，还要更新 kubeconfig 文件中的 `certificate-authority-data`
   节，使之包含 Base64 编码的老的和新的证书机构数据。
<!--
1. Follow below steps in a rolling fashion.

   1. Restart any other *[aggregated api servers](/docs/concepts/extend-kubernetes/api-extension/apiserver-aggregation/)*
      or *webhook handlers* to trust the new CA certificates.

   1. Restart the kubelet by update the file against `clientCAFile` in kubelet configuration and
      `certificate-authority-data` in kubelet.conf to use both the old and new CA on all nodes.

      If your kubelet is not using client certificate rotation update `client-certificate-data` and
      `client-key-data` in kubelet.conf on all nodes along with the kubelet client certificate file
      usually found in `/var/lib/kubelet/pki`.
-->
8. 遵循下列步骤执行滚动更新

   1. 重新启动所有其他 *[被聚合的 API 服务器](/zh/docs/concepts/extend-kubernetes/api-extension/apiserver-aggregation/)*
      或者 *Webhook 处理程序*，使之信任新的 CA 证书。

   2. 在所有节点上更新 kubelet 配置中的 `clientCAFile` 所指文件以及 kubelet.conf 中的
      `certificate-authority-data` 并重启 kubelet 以同时使用老的和新的 CA 证书。

      如果你的 kubelet 并未使用客户端证书轮换，则在所有节点上更新 kubelet.conf 中
      `client-certificate-data` 和 `client-key-data` 以及 kubelet
      客户端证书文件（通常位于 `/var/lib/kubelet/pki` 目录下）

   <!--
   1. Restart API servers with the certificates (`apiserver.crt`, `apiserver-kubelet-client.crt` and
      `front-proxy-client.crt`) signed by new CA.
      You can use the existing private keys or new private keys.
      If you changed the private keys then update these in the Kubernetes certificates directory as well.
   -->
   3. 使用用新的 CA 签名的证书
       （`apiserver.crt`、`apiserver-kubelet-client.crt` 和 `front-proxy-client.crt`）
      来重启 API 服务器。
      你可以使用现有的私钥，也可以使用新的私钥。
      如果你改变了私钥，则要将更新的私钥也放到 Kubernetes 证书目录下。

      由于 Pod 既信任老的 CA 也信任新的 CA，Pod 中的客户端会经历短暂的连接断开状态，
      之后再连接到使用新的 CA 所签名的证书的新的 API 服务器。

      <!--
      * Restart Scheduler to use the new CAs.
      * Make sure control plane components logs no TLS errors.
      -->
      * 重启调度器以使用新的 CA 证书。
      * 确保控制面组件的日志中没有 TLS 相关的错误信息。

      <!--
      To generate certificates and private keys for your cluster using the `openssl`
      command line tool, see [Certificates (`openssl`)](/docs/tasks/administer-cluster/certificates/#openssl).
      You can also use [`cfssl`](/docs/tasks/administer-cluster/certificates/#cfssl).
      -->
      {{< note >}}
      要使用 `openssl` 命令行为集群生成新的证书和私钥，可参阅
      [证书（`openssl`）](/zh/docs/tasks/administer-cluster/certificates/#openssl)。
      你也可以使用[`cfssl`](/zh/docs/tasks/administer-cluster/certificates/#cfssl).
      {{< /note >}}

   <!--
   1. Annotate any Daemonsets and Deployments to trigger pod replacement in a safer rolling fashion.

      Example:
   -->
   4. 为 Daemonset 和 Deployment 添加注解，从而触发较安全的滚动更新，替换 Pod。

      示例：

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

      <!--
      To limit the number of concurrent disruptions that your application experiences,
      see [configure pod disruption budget](/docs/tasks/run-application/configure-pdb/).
      -->
      {{< note >}}
      要限制应用可能受到的并发干扰数量，可以参阅
      [配置 Pod 干扰预算](/zh/docs/tasks/run-application/configure-pdb/).
      {{< /note >}}
<!--
1. If your cluster is using bootstrap tokens to join nodes, update the ConfigMap `cluster-info` in the `kube-public` namespace with new CA.
-->
9. 如果你的集群使用启动引导令牌来添加节点，则需要更新 `kube-public` 名字空间下的
   ConfigMap `cluster-info`，使之包含新的 CA 证书。

   ```shell
   base64_encoded_ca="$(base64 -w0 /etc/kubernetes/pki/ca.crt)"

   kubectl get cm/cluster-info --namespace kube-public -o yaml | \
       /bin/sed "s/\(certificate-authority-data:\).*/\1 ${base64_encoded_ca}/" | \
       kubectl apply -f -
   ```
<!--
1. Verify the cluster functionality.

   1. Validate the logs from control plane components, along with the kubelet and the
      kube-proxy are not throwing any tls errors, see
      [looking at the logs](/docs/tasks/debug-application-cluster/debug-cluster/#looking-at-logs).

   1. Validate logs from any aggregated api servers and pods using in-cluster config.
-->
10. 验证集群的功能正常

    1. 验证控制面组件的日志，以及 `kubelet` 和 `kube-proxy` 的日志，确保其中没有
       抛出 TLS 错误，参阅
       [查看日志](/zh/docs/tasks/debug-application-cluster/debug-cluster/#looking-at-logs).

    2. 验证被聚合的 API 服务器的日志，以及所有使用集群内配置的 Pod 的日志。

<!--
1. Once the cluster functionality is successfully verified:

   1. Update all service account tokens to include new CA certificate only.

      * All pods using an in-cluster kubeconfig will eventually need to be restarted to pick up the new SA secret for the old CA to be completely untrusted.

   1. Restart the control plane components by removing the old CA from the kubeconfig files and the files against `--client-ca-file`, `--root-ca-file` flags resp.

   1. Restart kubelet by removing the old CA from file against the `clientCAFile` flag and kubelet kubeconfig file.
-->
11. 完成集群功能的检查之后：

    1. 更新所有的服务账号令牌，使之仅包含新的 CA 证书。

       * 使用集群内 kubeconfig 的 Pod 最终也需要被重启，以获得新的服务账号 Secret
         数据，进而不再信任老的 CA 证书。

    1. 从 kubeconfig 文件和 `--client-ca-file` 以及 `--root-ca-file` 标志所指向的文件
       中去除老的 CA 数据，之后重启控制面组件。

    1. 重启 kubelet，移除 `clientCAFile` 标志所指向的文件以及 kubelet kubeconfig 文件中
       的老的 CA 数据。
