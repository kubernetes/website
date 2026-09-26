---
title: "Tổng quan về kubectl-convert"
description: >-
  Một plugin của kubectl cho phép chuyển đổi các manifest từ một phiên bản
  của Kubernetes API sang một phiên bản khác.
headless: true
_build:
  list: never
  render: never
  publishResources: false
---

Một plugin cho công cụ dòng lệnh của Kubernetes `kubectl`, cho phép chuyển đổi các manifest giữa các phiên bản API khác nhau.
Công cụ này đặc biệt hữu ích khi cần chuyển đổi các manifest sang các phiên bản API còn được hỗ trợ trong các bản Kubernetes mới phát hành.
Để biết thêm chi tiết, tham khảo [nâng cấp lên các phiên bản API đang được hỗ trợ](/docs/reference/using-api/deprecation-guide/#migrate-to-non-deprecated-apis)
