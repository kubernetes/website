REPO_TMPL = "https://github.com/kubernetes/kubernetes/tree/%s/%s/:splat"

fixed_redirects = """# 301 redirects (301 is the default status when no other one is provided for each line)
/third_party/swagger-ui		/kubernetes/third_party/swagger-ui/
/resource-quota			/docs/admin/resourcequota/
/horizontal-pod-autoscaler	/docs/user-guide/horizontal-pod-autoscaling/
/docs/user-guide/overview	/docs/whatisk8s/
/docs/roadmap			https://github.com/kubernetes/kubernetes/milestones/
/api-ref			https://github.com/kubernetes/kubernetes/milestones/
"""

branch_redirects = ["examples" , "cluster", "docs/devel", "docs/design"]

branch_redirects.each do |name|
  dest = REPO_TMPL % [ENV.fetch("HEAD", "master"), name]
  rule = "\n/#{name}/* #{dest}"

  fixed_redirects << rule
end

output = ENV["DEBUG"] ? STDOUT : File.open(ENV.fetch("REDIRECTS_PATH", "_redirects"), "w+")
output.puts fixed_redirects
