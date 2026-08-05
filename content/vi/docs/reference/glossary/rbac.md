---
title: RBAC (Role-Based Access Control - Kiểm soát truy cập dựa trên vai trò)
id: rbac
date: 2018-04-12
full_link: /docs/reference/access-authn-authz/rbac/
short_description: >
  Quản lý việc phân quyền, cho phép quản trị viên cấu hình các chính sách truy cập một cách linh hoạt thông qua Kubernetes API.

aka: 
tags:
- security
- fundamental
---
 Quản lý việc phân quyền, cho phép quản trị viên cấu hình các chính sách truy cập một cách linh hoạt thông qua {{< glossary_tooltip text="Kubernetes API" term_id="kubernetes-api" >}}.

<!--more--> 

RBAC sử dụng bốn loại đối tượng trong Kubernetes:

Role
: Định nghĩa một vai trò cùng các quyền truy cập trong một namespace cụ thể.

ClusterRole
: Định nghĩa một vai trò cùng các quyền truy cập trên toàn cụm.

RoleBinding
: Cấp các quyền được định nghĩa trong một vai trò cho một nhóm người dùng trong một namespace cụ thể.

ClusterRoleBinding
: Cấp các quyền được định nghĩa trong một vai trò cho một nhóm người dùng trên toàn cụm.

Tham khảo [RBAC](/docs/reference/access-authn-authz/rbac/) để biết thêm chi tiết.
