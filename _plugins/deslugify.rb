require 'uri'

module Jekyll
    module DeslugifyFilter
        def deslugify(input)
            uri = URI(input)
            p = uri.path.split('/')
            output = ""
            p.each_with_index{|x,i|
                output << x.gsub('-', ' ').gsub('_', ' ').strip
                if i <= p.length - 2 and !output.empty?
                    output << ' - '
                end
            }

            return output.split(/ |\_/).map(&:capitalize).join(' ').strip
        end
    end
end

Liquid::Template.register_filter(Jekyll::DeslugifyFilter)
