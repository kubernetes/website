---
title: 手动轮换 CA 证书
content_type: task
---
<!--
title: Manual Rotation of CA Certificates
content_type: task
-->

<!-- overview -->

<!--
This page shows how to manually rotate the certificate authority (CA) certificates.
-->
本页展示如何手动轮换证书机构（CA）证书。

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

<!--
- For more information about authentication in Kubernetes, see
  [Authenticating](/docs/reference/access-authn-authz/authentication).
- For more information about best practices for CA certificates, see
  [Single root CA](/docs/setup/best-practices/certificates/#single-root-ca).
-->
- 要了解 Kubernetes 中用户认证的更多信息，参阅
  [认证](/zh-cn/docs/reference/access-authn-authz/authentication)；
- 要了解与 CA 证书最佳实践有关的更多信息，
  参阅[单根 CA](/zh-cn/docs/setup/best-practices/certificates/#single-root-ca)。

<!-- steps -->

<!--
## Rotate the CA certificates manually
-->
## 手动轮换 CA 证书  {#rotate-the-ca-certificates-manually}

{{< caution >}}
<!--
Make sure to back up your certificate directory along with configuration files and any other necessary files.

This approach assumes operation of the Kubernetes control plane in a HA configuration with multiple API servers.
Graceful termination of the API server is also assumed so clients can cleanly disconnect from one API server and reconnect to another.

Configurations with a single API server will experience unavailability while the API server is being restarted.
-->
确保备份你的证书目录、配置文件以及其他必要文件。

这里的方法假定 Kubernetes 的控制面通过运行多个 API 服务器以高可用配置模式运行。
另一假定是 API 服务器可体面地终止，因而客户端可以彻底地与一个 API 服务器断开
连接并连接到另一个 API 服务器。

如果集群中只有一个 API 服务器，则在 API 服务器重启期间会经历服务中断期。
{{< /caution >}}

<!--
1. Distribute the new CA certificates and private keys (for example: `ca.crt`, `ca.key`, `front-proxy-ca.crt`,
   and `front-proxy-ca.key`) to all your control plane nodes in the Kubernetes certificates directory.
-->
1. 将新的 CA 证书和私钥（例如：`ca.crt`、`ca.key`、`front-proxy-ca.crt` 和
   `front-proxy-client.key`）分发到所有控制面节点，放在其 Kubernetes 证书目录下。

<!--
1. Update the `--root-ca-file` flag for the {{< glossary_tooltip term_id="kube-controller-manager" >}} to include
   both old and new CA, then restart the kube-controller-manager.

   Any {{< glossary_tooltip text="ServiceAccount" term_id="service-account" >}} created after this point will get
   Secrets that include both old and new CAs.
-->
2. 更新 {{< glossary_tooltip text="kube-controller-manager" term_id="kube-controller-manager" >}}
   的 `--root-ca-file` 标志，使之同时包含老的和新的 CA，之后重启
   kube-controller-manager。

   自此刻起，所创建的所有{{< glossary_tooltip text="ServiceAccount" term_id="service-account" >}}
   都会获得同时包含老的 CA 和新的 CA 的 Secret。

   {{< note >}}
   <!--
   The files specified by the kube-controller-manager flags `--client-ca-file` and `--cluster-signing-cert-file`
   cannot be CA bundles. If these flags and `--root-ca-file` point to the same `ca.crt` file which is now a
   bundle (includes both old and new CA) you will face an error. To workaround this problem you can copy the new CA
   to a separate file and make the flags `--client-ca-file` and `--cluster-signing-cert-file` point to the copy.
   Once `ca.crt` is no longer a bundle you can restore the problem flags to point to `ca.crt` and delete the copy.
   -->
   kube-controller-manager 标志 `--client-ca-file` 和 `--cluster-signing-cert-file`
   所引用的文件不能是 CA 证书包。如果这些标志和 `--root-ca-file` 指向同一个 `ca.crt` 包文件
   （包含老的和新的 CA 证书），你将会收到出错信息。
   要解决这个问题，可以将新的 CA 证书复制到单独的文件中，并将 `--client-ca-file` 和
   `--cluster-signing-cert-file` 标志指向该副本。一旦 `ca.crt` 不再是证书包文件，
   就可以恢复有问题的标志指向  `ca.crt` 并删除该副本。

   <!--
   [Issue 1350](https://github.com/kubernetes/kubeadm/issues/1350) for kubeadm tracks an bug with the
   kube-controller-manager being unable to accept a CA bundle.
   -->
   kubeadm 的 [Issue 1350](https://github.com/kubernetes/kubeadm/issues/1350)
   在跟踪一个导致 kube-controller-manager 无法接收 CA 证书包的问题。
   {{< /note >}}

<!--
1. Wait for the controller manager to update `ca.crt` in the service account Secrets to include both old and new CA certificates.

If any Pods are started before new CA is used by API servers, the new Pods get this update and will trust both old and new CAs.
-->
3. 等待该控制器管理器更新服务账号 Secret 中的 `ca.crt`，使之同时包含老的和新的 CA 证书。

   如果在 API 服务器使用新的 CA 之前启动了新的 Pod，这些新的 Pod
   也会获得此更新并且同时信任老的和新的 CA 证书。

<!--
1. Restart all pods using in-cluster configurations (for example: kube-proxy, CoreDNS, etc) so they can use the
   updated certificate authority data from Secrets that link to ServiceAccounts.

   * Make sure CoreDNS, kube-proxy and other Pods using in-cluster configurations are working as expected.

1. Append the both old and new CA to the file against `--client-ca-file` and `--kubelet-certificate-authority`
   flag in the `kube-apiserver` configuration.

1. Append the both old and new CA to the file against `--client-ca-file` flag in the `kube-scheduler` configuration.
-->
4. 重启所有使用集群内配置的 Pod（例如：kube-proxy、CoreDNS 等），以便这些 Pod
   能够使用与 ServiceAccount 相关联的 Secret 中的、已更新的证书机构数据。

   * 确保 CoreDNS、kube-proxy 和其他使用集群内配置的 Pod 都正按预期方式工作。

5. 将老的和新的 CA 都追加到 `kube-apiserver` 配置的 `--client-ca-file` 和
   `--kubelet-certificate-authority` 标志所指的文件。

6. 将老的和新的 CA 都追加到 `kube-scheduler` 配置的 `--client-ca-file` 标志所指的文件。

<!--
1. Update certificates for user accounts by replacing the content of `client-certificate-data` and `client-key-data` respectively.

   For information about creating certificates for individual user accounts, see
   [Configure certificates for user accounts](/docs/setup/best-practices/certificates/#configure-certificates-for-user-accounts).

   Additionally, update the `certificate-authority-data` section in the kubeconfig files,
   respectively with Base64-encoded old and new certificate authority data
-->
7. 通过替换 `client-certificate-data` 和 `client-key-data` 中的内容，更新用户账号的证书。

   有关为独立用户账号创建证书的更多信息，可参阅
   [为用户帐号配置证书](/zh-cn/docs/setup/best-practices/certificates/#configure-certificates-for-user-accounts)。

   另外，还要更新 kubeconfig 文件中的 `certificate-authority-data` 节，
   使之包含 Base64 编码的老的和新的证书机构数据。

<!--
1. Update the `--root-ca-file` flag for the {{< glossary_tooltip term_id="cloud-controller-manager" >}} to include
   both old and new CA, then restart the cloud-controller-manager.
-->
8. 更新 {{< glossary_tooltip term_id="cloud-controller-manager" >}} 的 `--root-ca-file`
   标志值，使之同时包含老的和新的 CA，之后重新启动 cloud-controller-manager。

   {{< note >}}
   <!--
   If your cluster does not have a cloud-controller-manager, you can skip this step.
   -->
   如果你的集群中不包含 cloud-controller-manager，你可以略过这一步。
   {{< /note >}}

<!--
1. Follow the steps below in a rolling fashion.

   1. Restart any other
      [aggregated API servers](/docs/concepts/extend-kubernetes/api-extension/apiserver-aggregation/) or
      webhook handlers to trust the new CA certificates.

   1. Restart the kubelet by update the file against `clientCAFile` in kubelet configuration and
      `certificate-authority-data` in `kubelet.conf` to use both the old and new CA on all nodes.

      If your kubelet is not using client certificate rotation, update `client-certificate-data` and
      `client-key-data` in `kubelet.conf` on all nodes along with the kubelet client certificate file
      usually found in `/var/lib/kubelet/pki`.
-->
9. 遵循下列步骤执行滚动更新

   1. 重新启动所有其他[被聚合的 API 服务器](/zh-cn/docs/concepts/extend-kubernetes/api-extension/apiserver-aggregation/)
      或者 Webhook 处理程序，使之信任新的 CA 证书。

   2. 在所有节点上更新 kubelet 配置中的 `clientCAFile` 所指文件以及 `kubelet.conf` 中的
      `certificate-authority-data` 并重启 kubelet 以同时使用老的和新的 CA 证书。

      如果你的 kubelet 并未使用客户端证书轮换，则在所有节点上更新 `kubelet.conf` 中
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

      <!--
      Since the Pods in your cluster trust both old and new CAs, there will be a momentarily disconnection
      after which pods' Kubernetes clients reconnect to the new API server.
      The new API server uses a certificate signed by the new CA.
      -->
      由于集群中的 Pod 既信任老的 CA 也信任新的 CA，Pod 中的客户端会经历短暂的连接断开状态，
      之后再使用新的 CA 所签名的证书连接到新的 API 服务器。

      <!--
      * Restart the {{< glossary_tooltip term_id="kube-scheduler" text="kube-scheduler" >}} to use and
        trust the new CAs.
      * Make sure control plane components logs no TLS errors.
      -->
      * 重启 {{< glossary_tooltip term_id="kube-scheduler" text="kube-scheduler" >}} 以使用并信任新的
        CA 证书。
      * 确保控制面组件的日志中没有 TLS 相关的错误信息。

      {{< note >}}
      <!--
      To generate certificates and private keys for your cluster using the `openssl` command line tool,
      see [Certificates (`openssl`)](/docs/tasks/administer-cluster/certificates/#openssl).
      You can also use [`cfssl`](/docs/tasks/administer-cluster/certificates/#cfssl).
      -->
      要使用 `openssl` 命令行为集群生成新的证书和私钥，可参阅
      [证书（`openssl`）](/zh-cn/docs/tasks/administer-cluster/certificates/#openssl)。
      你也可以使用[`cfssl`](/zh-cn/docs/tasks/administer-cluster/certificates/#cfssl).
      {{< /note >}}

   <!--
   1. Annotate any DaemonSets and Deployments to trigger pod replacement in a safer rolling fashion.
   -->
   4. 为 Daemonset 和 Deployment 添加注解，从而触发较安全的滚动更新，替换 Pod。

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
      <!--
      To limit the number of concurrent disruptions that your application experiences,
      see [configure pod disruption budget](/docs/tasks/run-application/configure-pdb/).
      -->
      要限制应用可能受到的并发干扰数量，
      可以参阅[配置 Pod 干扰预算](/zh-cn/docs/tasks/run-application/configure-pdb/)。
      {{< /note >}}

      <!--
      Depending on how you use StatefulSets you may also need to perform similar rolling replacement.
      -->
      取决于你在如何使用 StatefulSet，你可能需要对其执行类似的滚动替换操作。

<!--
1. If your cluster is using bootstrap tokens to join nodes, update the ConfigMap `cluster-info` in the `kube-public`
   namespace with new CA.
-->
10. 如果你的集群使用启动引导令牌来添加节点，则需要更新 `kube-public` 名字空间下的
    ConfigMap `cluster-info`，使之包含新的 CA 证书。

    ```shell
    base64_encoded_ca="$(base64 -w0 /etc/kubernetes/pki/ca.crt)"

    kubectl get cm/cluster-info --namespace kube-public -o yaml | \
       /bin/sed "s/\(certificate-authority-data:\).*/\1 ${base64_encoded_ca}/" | \
       kubectl apply -f -
    ```
<!--
1. Verify the cluster functionality.

   1. Check the logs from control plane components, along with the kubelet and the kube-proxy.
       Ensure those components are not reporting any TLS errors; see
       [looking at the logs](/docs/tasks/debug/debug-cluster/#looking-at-logs) for more details.

   1. Validate logs from any aggregated api servers and pods using in-cluster config.
-->
11. 验证集群的功能正常。

    1. 检查控制面组件以及 `kubelet` 和 `kube-proxy` 的日志，确保其中没有抛出 TLS 错误，
       参阅[查看日志](/zh-cn/docs/tasks/debug/debug-cluster/#looking-at-logs)。

    2. 验证被聚合的 API 服务器的日志，以及所有使用集群内配置的 Pod 的日志。

<!--
1. Once the cluster functionality is successfully verified:

   1. Update all service account tokens to include new CA certificate only.

      * All pods using an in-cluster kubeconfig will eventually need to be restarted to pick up the new Secret,
        so that no Pods are relying on the old cluster CA.

   1. Restart the control plane components by removing the old CA from the kubeconfig files and the files against `--client-ca-file`, `--root-ca-file` flags resp.

   1. On each node, restart the kubelet by removing the old CA from file against the `clientCAFile` flag
      and from the kubelet kubeconfig file. You should carry this out as a rolling update.

      If your cluster lets you make this change, you can also roll it out by replacing nodes rather than
      reconfiguring them.
-->
12. 完成集群功能的检查之后：

    1. 更新所有的服务账号令牌，使之仅包含新的 CA 证书。

       * 使用集群内 kubeconfig 的 Pod 最终也需要被重启，以获得新的服务账号 Secret
         数据，这样就不会有 Pod 再依赖老的集群 CA。

    1. 从 kubeconfig 文件和 `--client-ca-file` 以及 `--root-ca-file` 标志所指向的文件
       中去除老的 CA 数据，之后重启控制面组件。

    1. 在每个节点上，移除 `clientCAFile` 标志所指向的文件，以删除老的 CA 数据，并从
       kubelet kubeconfig 文件中去掉老的 CA，重启 kubelet。
       你应该用滚动更新的方式来执行这一步骤的操作。

       如果你的集群允许你执行这一变更，你也可以通过替换节点而不是重新配置节点的方式来将其上线。


