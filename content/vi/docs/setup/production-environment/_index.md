---
title: "Môi trường Production"
description: Tạo một cụm Kubernetes chất lượng production
weight: 30
no_list: true
---
<!-- overview -->

Một cụm Kubernetes chất lượng production yêu cầu có sự lên kế hoạch và chuẩn bị.
Nếu cụm Kubernetes của bạn dùng để chạy các workload quan trọng, nó phải được cấu hình để có khả năng phục hồi.
Trang này giải thích các bước bạn có thể thực hiện để thiết lập một cụm sẵn sàng cho production,
hoặc để thúc đẩy một cụm hiện có cho việc sử dụng production.
Nếu bạn đã quen thuộc với thiết lập production và muốn những liên kết, hãy bỏ qua đến 
[Tiếp theo là gì](#tiếp-theo-là-gì).

<!-- body -->

## Những cân nhắc production

Thông thường, một môi trường cụm Kubernetes production có nhiều yêu cầu hơn một
môi trường Kubernetes cho học tập, phát triển hoặc thử nghiệm cá nhân. Một môi trường production 
có thể yêu cầu truy cập an toàn bởi nhiều người dùng, tính khả dụng nhất quán, và các nguồn lực để
thích ứng với nhu cầu thay đổi.

Khi bạn quyết định nơi bạn muốn triển khai môi trường Kubernetes production 
(on-premise hoặc trên cloud) và lượng công việc quản lý bạn muốn đảm nhận hoặc trao cho 
người khác, hãy xem xét các yêu cầu của bạn đối với cụm Kubernetes bị ảnh hưởng như thế nào 
bởi các vấn đề sau:

- *Tính sẵn sàng*: Một [môi trường học tập](/docs/setup/#learning-environment) Kubernetes trên một máy
  có một điểm lỗi duy nhất. Tạo một cụm có tính sẵn sàng cao có nghĩa là phải cân nhắc:
  - Tách control plane khỏi các worker node.
  - Nhân bản các thành phần control plane trên nhiều node.
  - Cân bằng tải lưu lượng tới {{< glossary_tooltip term_id="kube-apiserver" text="API server" >}} của cụm.
  - Có đủ các worker node sẵn sàng, hoặc có khả năng trở nên khả dụng một cách nhanh chóng khi workload thay đổi.

- *Quy mô*: Nếu bạn mong muốn môi trường Kubernetes production của mình đáp ứng được một lượng 
  yêu cầu ổn định, bạn có thể thiết lập khả năng đáp ứng bạn cần và hoàn thành. Tuy nhiên, 
  nếu bạn mong muốn đáp ứng nhu cầu tăng theo thời gian hoặc thay đổi đáng kể dựa trên những yếu tố
  như mùa hoặc sự kiện đặc biệt, bạn cần lập kế hoạch về việc mở rộng quy mô để giảm bớt áp lực 
  tăng lên từ nhiều yêu cầu hơn đối với control plane và các worker node hoặc thu hẹp quy mô để tối ưu
  tài nguyên không sử dụng.

- *Quản lý bảo mật và truy cập*: Bạn có đầy đủ các đặc quyền admin trên cụm
  Kubernetes học tập của mình. Nhưng các cụm chia sẻ với nhiều workload quan trọng, và
  nhiều hơn một hoặc hai người dùng, yêu cầu một cách tiếp cận tinh tế hơn đối với những ai và 
  những gì có thể truy cập vào các tài nguyên cụm. Bạn có thể sử dụng kiểm soát truy cập dựa trên vai trò
  ([RBAC](/docs/reference/access-authn-authz/rbac/)) và các kỹ thuật bảo mật khác
  để chắc chắn rằng người dùng và workloads có thể truy cập được tới tài nguyên họ cần
  trong khi vẫn đảm bảo bảo mật cho worload và cụm máy chủ.
  Bạn có thể đặt giới hạn lên tài nguyên mà người dùng và workload có thể truy cập
  bằng cách quản lý [các chính sách](/docs/concepts/policy/) và
  [tài nguyên container](/docs/concepts/configuration/manage-resources-containers/).

Trước khi dựng một môi trường Kubernetes production, cân nhắc
chuyển giao một phần hoặc toàn bộ công việc này cho các nhà cung cấp giải pháp Cloud
[Turnkey Cloud Solutions](/docs/setup/production-environment/turnkey-solutions/) 
hoặc các đối tác [Kubernetes Partners](/vi/partners/).
Các tùy chọn gồm:

- *Serverless*: Chỉ cần chạy workload trên thiết bị của bên thứ ba mà không cần quản lý
  toàn bộ cụm. Bạn sẽ bị tính phí cho những thứ như mức sử dụng CPU, bộ nhớ, và
  các yêu cầu ổ đĩa.
- *Control plane được quản lý*: Hãy để nhà cung cấp quản lý quy mô và tính sẵn sàng
  của control plane trong cụm, cũng như xử lý các bản vá và cập nhật.
- *Worker node được quản lý*: Cấu hình nhóm các node để đáp ứng nhu cầu của bạn,
  sau đó nhà cung cấp sẽ đảm bảo rằng những node đó khả dụng và sẵn sàng để thực hiện
  các cập nhật khi cần thiết.
- *Sự tích hợp*: Có những nhà cung cấp tích hợp Kubernetes với các dịch vụ khác
  mà bạn có thể cần, ví dụ kho lưu trữ, container registries, các phương thức xác thực,
  và những công cụ phát triển.

Liệu bạn tự dựng một cụm Kubernetes production hay làm điều đó với
các đối tác, xem những phần dưới đây để đánh giá nhu cầu liên quan tới
*control plane*, *các worker node*, *truy cập người dùng*, và
*các tài nguyên workload* cho cụm của bạn.

## Thiết lập cụm production

Trong một cụm Kubernetes có chất lượng production, control plane quản lý
cụm từ các dịch vụ có thể được trải đều trên nhiều máy tính
theo những cách khác nhau. Tuy nhiên, mỗi worker node đại diện cho một thực thể duy nhất
được cấu hình để chạy Kubernetes pod.

### Control plane trên production

Cụm Kubernetes đơn giản nhất có toàn bộ dịch vụ control plane và worker node
chạy trên cùng một máy. Bạn có thể phát triển môi trường đó bằng cách thêm
các worker node, như được phản ánh trong sơ đồ được minh họa trong
[Các thành phần Kubernetes](/docs/concepts/overview/components/).
Nếu cụm có nghĩa là có sẵn trong một khoảng thời gian ngắn hoặc có thể
bị loại bỏ nếu có sự cố nghiêm trọng, điều này có thể đáp ứng nhu cầu của bạn.

Tuy nhiên, nếu bạn cần một cụm vĩnh viễn, có mức độ sẵn cao hơn, bạn nên
xem xét các cách mở rộng control plane. Theo thiết kế, dịch vụ control plane
chạy trên một máy tính đơn là không có tính sẵn sàng cao.
Nếu việc giữ cụm được dựng lên và chạy
và đảm bảo rằng nó có thể được sửa chữa nếu có sự cố xảy ra là điều quan trọng,
Xem xét các bước sau:

- *Chọn các công cụ triển khai*: Bạn có thể triển khai một control plane bằng các công cụ
  vi dụ như kubeadm, kops, và kubespray. Xem
  [Cài đặt Kubernetes với những công cụ triển khai](/docs/setup/production-environment/tools/)
  để tìm hiểu các mẹo triển khai chất lượng production bằng cách sử dụng từng phương pháp 
  triển khai đó. Những [Container Runtimes](/docs/setup/production-environment/container-runtimes/)
  khác cũng có sẵn để bạn sử dụng cho việc triển khai của mình.
- *Quản lý chứng chỉ*: Giao tiếp bảo mật giữa các dịch vụ control plane
  được thực hiện bằng chứng chỉ. Chứng chỉ được tự động tạo trong quá trình triển khai
  hoặc bạn có thể tạo chúng bằng cách sử dụng cơ quan cấp chứng chỉ của riêng bạn.
  Xem [Chứng chỉ PKI và yêu cầu](/docs/setup/best-practices/certificates/) để biết thêm chi tiết.
- *Cấu hình bộ cân bằng tải cho apiserver*: Cấu hình bộ cân bằng tải
  để phân phối các request API bên ngoài tới các instance của dịch vụ apiserver chạy trên các node khác nhau. Xem 
  [Tạo Bộ Cân bằng tải bên ngoài](/docs/tasks/access-application-cluster/create-external-load-balancer/)
  để biết thêm chi tiết.
- *Phân tách và sao lưu dịch vụ etcd*: Các dịch vụ etcd có thể chạy trên
  cùng các máy với các dịch vụ control plane khác hoặc chạy trên các máy tách biệt, để
  tăng tính bảo mật và khả dụng. Bởi vì etcd lưu dữ liệu cấu hình của cụm,
  sao lưu cơ sở dữ liệu etcd nên được thực hiện thường xuyên để đảm bảo rằng bạn có thể
  sửa chữa cơ sở dữ liệu đó nếu cần.
  Xem thêm [etcd FAQ](https://etcd.io/docs/v3.5/faq/) để biết thêm chi tiết về việc cấu hình và sử dụng etcd.
  Xem [Vận hành các cụm etcd cho Kubernetes](/docs/tasks/administer-cluster/configure-upgrade-etcd/)
  và [Thiết lập một cụm etcd có tính Sẵn sàng cao với kubeadm](/docs/setup/production-environment/tools/kubeadm/setup-ha-etcd-with-kubeadm/)
  để biết thêm chi tiết.
- *Tạo nhiều hệ thống control plane*: Để có tính sẵn sàng cao,
  control plane không nên giới hạn trong một máy. Nếu các dịch vụ control plane
  được chạy bởi một dịch vụ khởi tạo (ví dụ systemd), các dịch vụ nên chạy trên
  ít nhất ba máy. Tuy nhiên, chạy các dịch vụ control plane dạng pods trong
  Kubernetes đảm bảo rằng số lượng bản sao dịch vụ mà bạn yêu cầu
  sẽ luôn có sẵn.
  Scheduler phải có khả năng chịu lỗi,
  nhưng không sẵn sàng cao. Một số công cụ triển khai được thiết lập thuật toán đồng thuận 
  [Raft](https://raft.github.io/) để bầu cử leader cho các dịch vụ Kubernetes. Nếu
  nếu leader biến mất, một dịch vụ khác tự bầu cử chính nó và tiếp quản. 
- *Trải rộng nhiều zone*: Nếu việc duy trì cụm khả dụng mọi lúc là quan trọng,
  cân nhắc việc tạo một cụm chạy trên nhiều trung tâm dữ liệu,
  được gọi là zone trên các môi trường đám mây. Nhóm các zone gọi là region.
  Bằng cách trải rộng một cụm trên nhiều zone trong cùng một region,
  nó có thể làm tăng cơ hội cho cụm của bạn được tiếp tục hoạt động ngay cả khi
  một zone trở nên không khả dụng.
  Xem [Chạy trong nhiều zone](/docs/setup/best-practices/multiple-zones/) để biết thêm chi tiết.
- *Quản lý các tính năng on-going*: Nếu bạn có kế hoạch giữ cụm theo thời gian,
  có những nhiệm vụ bạn cần làm để duy trì sức khỏe và bảo mật của cụm. Ví dụ,
  nếu bạn đã cài đặt với kubeadm, có các hướng dẫn để giúp bạn
  [Quản lý Chứng chỉ](/docs/tasks/administer-cluster/kubeadm/kubeadm-certs/)
  và [Nâng cấp các cụm kubeadm](/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade/).
  Xem [Quản lý một cụm](/docs/tasks/administer-cluster/)
  để biết thêm danh sách các tác vụ quản trị của Kubernetes.

Để tìm hiểu về các tùy chọn có sẵn khi bạn chạy các dịch vụ control plane, xem các trang
[kube-apiserver](/docs/reference/command-line-tools-reference/kube-apiserver/),
[kube-controller-manager](/docs/reference/command-line-tools-reference/kube-controller-manager/),
và [kube-scheduler](/docs/reference/command-line-tools-reference/kube-scheduler/). 
Đối với các ví dụ về control plane có tính sẵn sàng cao, xem
[Các tùy chọn cho kiến trúc có tính Sẵn sàng cao](/docs/setup/production-environment/tools/kubeadm/ha-topology/),
[Tạo các cụm có tính Sẵn sàng cao với kubeadm](/docs/setup/production-environment/tools/kubeadm/high-availability/),
và [Vận hành cụm etcd cho Kubernetes](/docs/tasks/administer-cluster/configure-upgrade-etcd/).
Xem [Sao lưu cụm etcd](/docs/tasks/administer-cluster/configure-upgrade-etcd/#backing-up-an-etcd-cluster)
để biến cách tạo kế hoạch sao lưu cho etcd.

### Worker node trên production

Workload chất lượng production cần phải có tính đàn hồi và bất kỳ thành phần nào mà chúng phụ thuộc vào cũng phải có tính đàn hồi
(ví dụ CoreDNS). Cho dù bạn tự quản lý control plane hay có một nhà cung cấp cloud làm điều đó cho bạn, bạn vẫn cần phải xem xét
cách bạn muốn quản lý các worker node (còn gọi một cách đơn giản là *node*).

- *Cấu hình các node*: Các node có thể là máy vật lý hay máy ảo. Nếu bạn muốn tạo 
  và quản lý node của riêng bạn, bạn có thể cài đặt một hệ điều hành được hỗ trợ,
  sau đó thêm và chạy [các dịch vụ Node](/docs/concepts/architecture/#node-components) thích hợp. Xem xét:
  - Nhu cầu của workload khi bạn thiết lập các node bằng cách có sẵn bộ nhớ, CPU và tốc độ đĩa và dung lượng lưu trữ phù hợp.
  - Liệu các hệ thống máy tính chung sẽ làm hay bạn có workload cần bộ xử lý GPU, node Windows hoặc VM cô lập.
- *Xác nhận các node*: Xem [Thiết lập node hợp lệ](/docs/setup/best-practices/node-conformance/)
  để biết thông tin về cách đảm bảo một node đáp ứng các yêu cầu để tham gia cụm Kubernetes.
- *Thêm các node vào cụm*: Nếu bạn đang quản lý cụm của riêng mình, bạn có thể 
  thêm các node bằng cách thiết lập các máy của riêng bạn và thêm chúng theo cách thủ công hoặc 
  để chúng tự đăng ký với apiserver của cụm. Xem phần [Nodes](/docs/concepts/architecture/nodes/) 
  để biết thông tin về cách thiết lập Kubernetes để thêm các nút theo những cách này.
- *Quy mô các node*: Sau cùng bạn sẽ cần có một kế hoạch để mở rộng khả năng của cụm. 
  Xem [Các cân nhắc cho những cụm lớn](/docs/setup/best-practices/cluster-large/) để giúp xác định bạn cần bao nhiêu node,
  dựa trên số lượng pod và container bạn cần chạy. Nếu bạn đang tự quản lý các node, 
  điều này có thể có nghĩa là mua và cài đặt thiết bị vật lý của riêng bạn.
- *Autoscale các node*: Đọc 
  [Node Autoscaling](/docs/concepts/cluster-administration/node-autoscaling) để tìm hiểu về
  các công cụ có sẵn để tự động quản lý các node của bạn và khả năng chúng cung cấp.
- *Thiết lập kiểm tra sức khỏe node*: Đối với những workload quan trọng, bạn muốn đảm bảo rằng
  các node và các pod chạy trên các node đó là khỏe mạnh. Sử dụng 
  [Trình phát hiện vấn đề node](/docs/tasks/debug/debug-cluster/monitor-node-health/),
  bạn có thể đảm bảo các node của bạn khỏe mạnh.

## Quản lý người dùng trên production

Trên production, bạn có thể chuyển từ một mô hình nơi bạn hoặc một nhóm nhỏ
những người đang truy cập cụm đến nơi có khả năng có hàng tá hoặc
hàng trăm người. Trong môi trường học tập hoặc nền tảng nguyên mẫu, bạn có thể có một
tài khoản quản trị cho mọi thứ bạn làm. Trên production, bạn sẽ muốn
nhiều tài khoản với các cấp độ truy cập khác nhau vào các namespace khác nhau.

Đảm nhận một cụm có chất lượng production nghĩa là quyết định việc bạn muốn làm thế nào
để cho phép người dùng khác truy cập một cách chọn lọc. Đặc biệt, bạn cần
chọn chiến lược để xác minh danh tính những người đang cố truy cập vào cụm của bạn
(xác thực) và quyết định liệu họ có quyền làm những gì họ muốn (phân quyền):

- *Xác thực*: Apiserver có thể xác thực người dùng bằng chứng chỉ khác, bearer tokens, 
  một proxy xác thực, hoặc HTTP basic auth.
  Bạn có thể chọn phương pháp xác thực bạn muốn. Băng việc sử dụng plugin, apiserver có thể
  tận dụng phương thức xác thực hiện có của tổ chức của bạn, ví dụ LDAP hoặc Kerberos. Xem
  [Xác thực](/docs/reference/access-authn-authz/authentication/)
  dể biết mô tả về các phương pháp xác thực người dùng Kubernetes khác nhau.
- *Phân quyền*: Khi bạn bắt đầu ủy quyền cho người dùng thường xuyên của mình, bạn có lẽ
  sẽ chọn giữa phân quyền RBAC và ABAC.
  Xem [Tổng quan phân quyền](/docs/reference/access-authn-authz/authorization/)
  để xem những chế độ phân quyền tài khoản người dùng khác nhau (cũng như quyền truy cập của 
  service account tới cụm của bạn):
  - *Kiểm soát truy cập dựa trên vai trò* ([RBAC](/docs/reference/access-authn-authz/rbac/)): Cho phép
    bạn chỉ định quyền truy cập vào cụm bằng cách cho phép thiết lập một tập các quyền tới
    người dùng đã xác thực.
    Quyền có thể được chỉ định trong một namespace cụ thể (Role) hoặc trong cả cụm (ClusterRole). Sau đó sử dụng RoleBindings và ClusterRoleBindings, những quyền này có thể
    được gán tới những người dùng cụ thể.
  - *Kiểm soát truy cập dựa trên thuộc tính* ([ABAC](/docs/reference/access-authn-authz/abac/)): Cho phép bạn
    tạo các chính sách dựa trên thuộc tính của tài nguyên trong cụm và sẽ cho phép hoặc
    hoặc từ chối truy cập dựa trên những thuộc tính đó. Mỗi dòng trong 1 file chính sách
    xác định phiên bản của thuộc tính (apiVersion and kind) và một ánh xạ các thuộc tính
    đặc trưng để gán tới một chủ thể (người dùng hoặc nhóm), thuộc tính tài nguyên, thuộc tính
    phi tài nguyên (/versions hoặc /apis), và chỉ đọc. Xem
    [Các ví dụ](/docs/reference/access-authn-authz/abac/#examples) để biết thêm chi tiết

Với tư cách là người thiết lập xác thực và phân quyền trên cụm Kubernetes production,
dưới đây là một số điều cần cân nhắc:

- *Đặt chế độ phân quyền*: Khi Kubernetes API server
  ([kube-apiserver](/docs/reference/command-line-tools-reference/kube-apiserver/))
  khởi động, chế độ hỗ trợ phân quyền phải được thiết lập bằng cờ *--authorization-config* 
  file hoặc *--authorization-mode*. Ví dụ, cờ đó trong *kube-adminserver.yaml* file 
  (tại */etc/kubernetes/manifests*) có thể được đặt là `Node,RBAC`. Điều này sẽ cho phép 
  phân quyền Node và RBAC tới những yêu cầu đã xác thực.
- *Tạo chứng chỉ người dùng và role bindings (RBAC)*: Nếu bạn sử dụng phân quyền RBAC,
  người dùng có thể tạo một CertificateSigningRequest (CSR) và sẽ được ký bởi CA của cụm.
  Sau đó bạn có thể gán Roles và ClusterRoles tới từng người dùng.
  Xem [Certificate Signing Requests](/docs/reference/access-authn-authz/certificate-signing-requests/) để biết thêm chi tiết.
- *Tạo các chính sách kết hợp các thuộc tính (ABAC)*: Nếu bạn sử dụng phân quyền ABAC,
  bạn có thể gán sự kết hợp các thuộc tính thành các chính sách để phân quyền tới
  người dùng hoặc nhóm được chọn để họ có thể truy cập tới những tài nguyên cụ thể
  (ví dụ pod), namespace, hoặc apiGroup. Để biết thêm thông tin, xem
  [Các ví dụ](/docs/reference/access-authn-authz/abac/#examples).
- *Cân nhắc Admission Controllers*: Các hình thức phân quyền bổ sung cho các yêu cầu
  đến thông qua API server bao gồm
  [Webhook Token Authentication](/docs/reference/access-authn-authz/authentication/#webhook-token-authentication).
  Webhooks và những loại phân quyền đặc biệt khác cần được kích hoạt bằng cách thêm
  [Admission Controllers](/docs/reference/access-authn-authz/admission-controllers/)
  vào API server.


## Đặt giới hạn tài nguyên cho workload

Những yêu cầu từ production workload có thể gây ra áp lực lên cả trong và ngoài
Kubernetes control plane. Hãy cân nhắc những mục này khi thiết lập cho
nhu cầu của workload trong cụm của bạn:

- *Đặt giới hạn namespace*: Đặt từng namespace quotas lên những thứ như bộ nhớ và CPU. Xem
  [Quản lý Bộ nhớ, CPU, và API Resources](/docs/tasks/administer-cluster/manage-resources/)
  để biết thêm chi tiết. Bạn cũng có thể thiết lập
  [Namespaces phân cấp](/vi/blog/2020/08/14/introducing-hierarchical-namespaces/)
  để kế thừa giới hạn.
- *Chuẩn bị cho yêu cầu DNS*: Nếu bạn mong đợi workloads mở rộng một cách ồ ạt,
  dịch vụ DNS của bạn phải săn sàng để mở rộng quy mô. Xem
  [Autoscale dịch vụ DNS trong cụm](/docs/tasks/administer-cluster/dns-horizontal-autoscaling/).
- *Tạo thêm các service account*: Tài khoản người dùng (user account) xác định những gì 
  người dùng có thể thực hiện trên một cụm, trong khi đó một tài khoản dịch vụ (service account)
  định nghĩa khả năng truy cập của pod trong một namespace cụ thể. Mặc định, một pod sẽ 
  tiếp nhận service account `default` từ namespace của nó.
  Xem [Quản lý Service Account](/docs/reference/access-authn-authz/service-accounts-admin/)
  để biết cách tạo một service account. Ví dụ, bạn có thể muốn:
  - Thêm secret cho pod để có thể pull image từ một container registry cụ thể. Xem
    [Cấu hình Service Account cho Pods](/docs/tasks/configure-pod-container/configure-service-account/).
  - Gán các quyền RBAC tới một service account. Xem
    [các quyền ServiceAccount](/docs/reference/access-authn-authz/rbac/#service-account-permissions)
    để biết thêm chi tiết.

## {{% heading "whatsnext" %}}

- Quyết định liệu bạn muốn tự dựng cụm Kubernetes production hay đạt được từ những nhà cung cấp 
  [Turnkey Cloud Solutions](/docs/setup/production-environment/turnkey-solutions/)
  hoặc các đối tác [Kubernetes Partners](/vi/partners/).
- Nếu bạn chọn dựng cụm cho riêng bạn, lập kế hoạch về việc xử lý
  [các chứng chỉ](/docs/setup/best-practices/certificates/)
  và thiết lập tính sẵn sàng cao cho các thành phần, ví dụ
  [etcd](/docs/setup/production-environment/tools/kubeadm/setup-ha-etcd-with-kubeadm/)
  và
  [API server](/docs/setup/production-environment/tools/kubeadm/ha-topology/).
- Chọn phương pháp triển khai bằng [kubeadm](/docs/setup/production-environment/tools/kubeadm/),
  [kops](https://kops.sigs.k8s.io/) hay
  [Kubespray](https://kubespray.io/).
- Cấu hình quản lý người dùng bằng cách xác định các phương pháp
  [Xác thực](/docs/reference/access-authn-authz/authentication/) và
  [Phân quyền](/docs/reference/access-authn-authz/authorization/).
- Chuẩn bị cho workload ứng dụng bằng cách thiết lập
  [giới hạn tài nguyên](/docs/tasks/administer-cluster/manage-resources/),
  [DNS autoscaling](/docs/tasks/administer-cluster/dns-horizontal-autoscaling/)
  và [các service account](/docs/reference/access-authn-authz/service-accounts-admin/).
