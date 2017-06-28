# This script generates a redirects file that Netlify's CDN
# can use to forward visitor to the right content.
#
# You can read more details about this file in Netlify documentation:
#
#     https://www.netlify.com/docs/redirects/
#
# USAGE:
#
# Run this script with Ruby to generate the _redirects file in this repository.
# It works with any Ruby version higher than 1.8.
#
#     ruby redirects.rb
#
# If you want to test a change without modifying the content of the current file,
# you can print the output of the script setting the DEBUG environment variable
# when you run the script:
#
#     DEBUG=1 ruby redirects.rb
#
# You can test if the content generated is correct in this playground:
#
#     https://play.netlify.com/redirects
#
# HOW TO ADD NEW RULES:
#
# This script is divided in two sections.
#
# The first section handles static redirects,
# those that you know the old path and the new path and never change.
#
# If you want to add one of these redirects, add the rule to the `fixed_redirects` variable,
# in a new line before the closing """. The format for basic 301 redirects is the following one,
# check Netlify's documentation linked above for other rules:
#
# /OLD_PATH /NEW_PATH_OR_URL
#
# The second section handles redirects that change depending on the branch that's deployed
# in the site. For instance, when you want to redirect a path to content in
# the kubernetes main repository but the content is specific to a branch that
# matches the deployed branch.
#
# If you want to add one of there redirects, add the old path to the `branch_redirects` list. For instance,
# when you deploy the branch release-1.5 on Netlify, this script will generate the following redirects:
#
# /examples/* https://github.com/kubernetes/kubernetes/tree/release-1.5/examples/:splat
# /cluster/* https://github.com/kubernetes/kubernetes/tree/release-1.5/cluster/:splat
# /docs/devel/* https://github.com/kubernetes/kubernetes/tree/release-1.5/docs/devel/:splat
# /docs/design/* https://github.com/kubernetes/kubernetes/tree/release-1.5/docs/design/:splat
#
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
