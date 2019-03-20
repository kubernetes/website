---
title: kubectl
notitle: true
---

## kubectl
<!--
kubectl controls the Kubernetes cluster manager
-->
kubectl ���Բٿ� Kubernetes ��Ⱥ��

<!--
### Synopsis

kubectl controls the Kubernetes cluster manager.

Find more information at: /docs/reference/kubectl/overview/
-->
### ���

kubectl ���Բٿ� Kubernetes ��Ⱥ��

��ȡ�����/docs/s.io/docs/reference/kubectl/overview/

```
kubectl [flags]
```
<!--
### Options

```
      --alsologtostderr                  log to standard error as well as files
      --as string                        Username to impersonate for the operation
      --as-group stringArray             Group to impersonate for the operation, this flag can be repeated to specify multiple groups.
      --cache-dir string                 Default HTTP cache directory (default "/home/username/.kube/http-cache")
      --certificate-authority string     Path to a cert file for the certificate authority
      --client-certificate string        Path to a client certificate file for TLS
      --client-key string                Path to a client key file for TLS
      --cluster string                   The name of the kubeconfig cluster to use
      --context string                   The name of the kubeconfig context to use
  -h, --help                             help for kubectl
      --insecure-skip-tls-verify         If true, the server's certificate will not be checked for validity. This will make your HTTPS connections insecure
      --kubeconfig string                Path to the kubeconfig file to use for CLI requests.
      --log-backtrace-at traceLocation   when logging hits line file:N, emit a stack trace (default :0)
      --log-dir string                   If non-empty, write log files in this directory
      --logtostderr                      log to standard error instead of files
      --match-server-version             Require server version to match client version
  -n, --namespace string                 If present, the namespace scope for this CLI request
      --request-timeout string           The length of time to wait before giving up on a single server request. Non-zero values should contain a corresponding time unit (e.g. 1s, 2m, 3h). A value of zero means don't timeout requests. (default "0")
  -s, --server string                    The address and port of the Kubernetes API server
      --stderrthreshold severity         logs at or above this threshold go to stderr (default 2)
      --token string                     Bearer token for authentication to the API server
      --user string                      The name of the kubeconfig user to use
  -v, --v Level                          log level for V logs
      --vmodule moduleSpec               comma-separated list of pattern=N settings for file-filtered logging
```
-->
### ѡ��
```
      --alsologtostderr                  ͬʱ�����־����׼�������̨���ļ�
      --as string                        ��ָ���û�ִ�в���
	  --as-group stringArray             ģ��������飬����ʹ�������ʶ��ָ������顣
      --cache-dir string                 Ĭ�� HTTP ����Ŀ¼��Ĭ��ֵ "/home/username/.kube/http-cache" ��
      --certificate-authority string     ���ڽ�����֤��Ȩ�� .cert �ļ�·��
      --client-certificate string        TLS ʹ�õĿͻ���֤��·��
      --client-key string                TLS ʹ�õĿͻ�����Կ�ļ�·��
      --cluster string                   ָ��Ҫʹ�õ� kubeconfig �ļ��м�Ⱥ��
      --context string                   ָ��Ҫʹ�õ� kubeconfig �ļ���������
  -h, --help                             kubectl ����
      --insecure-skip-tls-verify         ֵΪ true���򲻻����������֤�����Ч�ԡ� �⽫ʹ����HTTPS���Ӳ���ȫ
      --kubeconfig string                CLI ����ʹ�õ� kubeconfig �����ļ�·����
      --log-backtrace-at traceLocation   ����־���ȳ����涨������ʱ�����Զ�ջ��Ϣ��Ĭ��ֵ��0��
      --log-dir string                   �����Ϊ�գ�����־�ļ�д���Ŀ¼
      --logtostderr                      ��־�������׼�������̨����������ļ�
      --match-server-version             Ҫ��ͻ��˰汾�ͷ���˰汾��ƥ��
  -n, --namespace string                 ������ڣ�CLI ����ʹ�ô������ռ�
      --request-timeout string           ����һ���򵥷�������ǰ�ĵȴ�ʱ�䣬����ֵ��Ҫ������Ӧʱ�䵥λ(���磺1s, 2m, 3h)����ֵ����Ϊ������ʱ���� (Ĭ��ֵ "0")
  -s, --server string                    Kubernetes API server �ĵ�ַ�Ͷ˿�
      --stderrthreshold severity         ���ڻ���ڴ���ֵ����־�������׼�������̨��Ĭ��ֵ2��
      --token string                     ���� API server ����������֤�ĳ�������
      --user string                      ָ��ʹ�õ� kubeconfig �����ļ��е��û���
  -v, --v Level                          ָ�������־����־����
      --vmodule moduleSpec               ָ�������־��ģ�飬��ʽ���£�pattern=N��ʹ�ö��ŷָ�
```
<!--
### SEE ALSO

* [kubectl alpha](kubectl_alpha.md)	 - Commands for features in alpha
* [kubectl annotate](kubectl_annotate.md)	 - Update the annotations on a resource
* [kubectl api-resources](kubectl_api-resources.md)	 - Print the supported API resources on the server
* [kubectl api-versions](kubectl_api-versions.md)	 - Print the supported API versions on the server, in the form of "group/version"
* [kubectl apply](kubectl_apply.md)	 - Apply a configuration to a resource by filename or stdin
* [kubectl attach](kubectl_attach.md)	 - Attach to a running container
* [kubectl auth](kubectl_auth.md)	 - Inspect authorization
* [kubectl autoscale](kubectl_autoscale.md)	 - Auto-scale a Deployment, ReplicaSet, or ReplicationController
* [kubectl certificate](kubectl_certificate.md)	 - Modify certificate resources.
* [kubectl cluster-info](kubectl_cluster-info.md)	 - Display cluster info
* [kubectl completion](kubectl_completion.md)	 - Output shell completion code for the specified shell (bash or zsh)
* [kubectl config](kubectl_config.md)	 - Modify kubeconfig files
* [kubectl convert](kubectl_convert.md)	 - Convert config files between different API versions
* [kubectl cordon](kubectl_cordon.md)	 - Mark node as unschedulable
* [kubectl cp](kubectl_cp.md)	 - Copy files and directories to and from containers.
* [kubectl create](kubectl_create.md)	 - Create a resource from a file or from stdin.
* [kubectl delete](kubectl_delete.md)	 - Delete resources by filenames, stdin, resources and names, or by resources and label selector
* [kubectl describe](kubectl_describe.md)	 - Show details of a specific resource or group of resources
* [kubectl drain](kubectl_drain.md)	 - Drain node in preparation for maintenance
* [kubectl edit](kubectl_edit.md)	 - Edit a resource on the server
* [kubectl exec](kubectl_exec.md)	 - Execute a command in a container
* [kubectl explain](kubectl_explain.md)	 - Documentation of resources
* [kubectl expose](kubectl_expose.md)	 - Take a replication controller, service, deployment or pod and expose it as a new Kubernetes Service
* [kubectl get](kubectl_get.md)	 - Display one or many resources
* [kubectl label](kubectl_label.md)	 - Update the labels on a resource
* [kubectl logs](kubectl_logs.md)	 - Print the logs for a container in a pod
* [kubectl options](kubectl_options.md)	 - Print the list of flags inherited by all commands
* [kubectl patch](kubectl_patch.md)	 - Update field(s) of a resource using strategic merge patch
* [kubectl plugin](kubectl_plugin.md)	 - Runs a command-line plugin
* [kubectl port-forward](kubectl_port-forward.md)	 - Forward one or more local ports to a pod
* [kubectl proxy](kubectl_proxy.md)	 - Run a proxy to the Kubernetes API server
* [kubectl replace](kubectl_replace.md)	 - Replace a resource by filename or stdin
* [kubectl rollout](kubectl_rollout.md)	 - Manage the rollout of a resource
* [kubectl run](kubectl_run.md)	 - Run a particular image on the cluster
* [kubectl scale](kubectl_scale.md)	 - Set a new size for a Deployment, ReplicaSet, Replication Controller, or Job
* [kubectl set](kubectl_set.md)	 - Set specific features on objects
* [kubectl taint](kubectl_taint.md)	 - Update the taints on one or more nodes
* [kubectl top](kubectl_top.md)	 - Display Resource (CPU/Memory/Storage) usage.
* [kubectl uncordon](kubectl_uncordon.md)	 - Mark node as schedulable
* [kubectl version](kubectl_version.md)	 - Print the client and server version information
* [kubectl wait](kubectl_wait.md)	 - Experimental: Wait for one condition on one or many resources
-->
### ��������

* [kubectl alpha](kubectl_alpha.md)	 - alpha��������������
* [kubectl annotate](kubectl_annotate.md)	 - ������Դ��ע��
* [kubectl api-resources](kubectl_api-resources.md)	 - �ڷ������ϴ�ӡ֧�ֵ� API ��Դ
* [kubectl api-versions](kubectl_api-versions.md)	 - �� "group/version" ����ʽ�ڷ������ϴ�ӡ֧�ֵ� API �汾
* [kubectl apply](kubectl_apply.md)	 - ͨ���ļ������׼���뽫�������Ӹ���Դ
* [kubectl attach](kubectl_attach.md)	 - ���ӵ��������е�����
* [kubectl auth](kubectl_auth.md)	 - �����Ȩ
* [kubectl autoscale](kubectl_autoscale.md)	 - �Զ���չ Deployment, ReplicaSet �� ReplicationController
* [kubectl certificate](kubectl_certificate.md)	 - �޸�֤����Դ��
* [kubectl cluster-info](kubectl_cluster-info.md)	 - չʾ��Ⱥ��Ϣ
* [kubectl completion](kubectl_completion.md)	 - Ϊ������ shell �����ɴ��루 bash �� zsh��
* [kubectl config](kubectl_config.md)	 - �޸� kubeconfig �����ļ�
* [kubectl convert](kubectl_convert.md)	 - �ڲ�ͬ�� API �汾֮��ת�������ļ�
* [kubectl cordon](kubectl_cordon.md)	 - �� node �ڵ���Ϊ���ɵ���
* [kubectl cp](kubectl_cp.md)	 - �����������ļ���Ŀ¼��Ҳ�ɽ��ļ���Ŀ¼���Ƶ�������
* [kubectl create](kubectl_create.md)	 - ͨ���ļ������׼���봴����Դ��
* [kubectl delete](kubectl_delete.md)	 - ͨ���ļ�������׼���룬��Դ�����ƻ���Դ�ͱ�ǩѡ����ɾ����Դ
* [kubectl describe](kubectl_describe.md)	 - ��ʾ�ض���Դ����Դ�����ϸ��Ϣ
* [kubectl drain](kubectl_drain.md)	 - Ϊ����ά������Ҫ��ǰ����node�ڵ�
* [kubectl edit](kubectl_edit.md)	 - �ڷ������༭��Դ
* [kubectl exec](kubectl_exec.md)	 - �������˳�����
* [kubectl explain](kubectl_explain.md)	 - ��Դ�ĵ�
* [kubectl expose](kubectl_expose.md)	 - ��ȡ replication controller, service, deployment �� pod ��Դ������Ϊ�µ� Kubernetes ����¶
* [kubectl get](kubectl_get.md)	 - չʾһ��������Դ
* [kubectl label](kubectl_label.md)	 - ������Դ��ǩ
* [kubectl logs](kubectl_logs.md)	 - Ϊ pod �е�������ӡ��־
* [kubectl options](kubectl_options.md)	 - ��ӡ��������̳еı�ʶ�б�
* [kubectl patch](kubectl_patch.md)	 - ʹ��ս���Ժϲ�����������Դ�ֶ�
* [kubectl plugin](kubectl_plugin.md)	 - ���������в��
* [kubectl port-forward](kubectl_port-forward.md)	 - �� pod ����һ���������ض˿�
* [kubectl proxy](kubectl_proxy.md)	 - Ϊ Kubernetes API server ���д���
* [kubectl replace](kubectl_replace.md)	 - ͨ���ļ����׼�����滻��Դ
* [kubectl rollout](kubectl_rollout.md)	 - ������Դչʾ
* [kubectl run](kubectl_run.md)	 - �ڼ�Ⱥ������ָ������
* [kubectl scale](kubectl_scale.md)	 - �� Deployment, ReplicaSet, Replication Controller �� Job �����¸�����ģ
* [kubectl set](kubectl_set.md)	 - �����������ض�����
* [kubectl taint](kubectl_taint.md)	 - ����һ������ node �ڵ���۵���Ϣ
* [kubectl top](kubectl_top.md)	 - չʾ��Դ (CPU/Memory/Storage) ʹ����Ϣ��
* [kubectl uncordon](kubectl_uncordon.md)	 - ��� node �ڵ�Ϊ�ɵ���
* [kubectl version](kubectl_version.md)	 - ��ӡ�ͻ��˺ͷ���˰汾��Ϣ
* [kubectl wait](kubectl_wait.md)	 - ����: ��һ��������Դ�ϵȴ��������

<!--
###### Auto generated by spf13/cobra on 16-Jun-2018
-->
######2018��6��16�գ�ͨ��spf13/cobra�Զ�����
