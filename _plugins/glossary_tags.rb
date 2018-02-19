require 'pry'
# See /_plugins/README.md for full documentation of these custom Jekyll tags
module Jekyll
  module GlossaryTags
    # Base class for tags (not to be instantiated)
    class Base < Liquid::Tag
      VALID_PARAM_NAMES = []
      LENGTH_SHORT = "short"
      LENGTH_LONG = "long"
      SNIPPET_TEMPLATE = "templates/glossary/snippet.md"

      def initialize(tag_name, markup, options)
        super
        @args = {}
        @markup.scan(/([\S]+=['"][^=]+["'])+/).each do |arg|
          key, val = arg.first.split("=")
          key = key.to_sym
          next unless val
          if self.class::VALID_PARAM_NAMES.include?(key)
            @args[key] = val.gsub("\"", "")
          end
        end
      end

      # "abstract" method
      def render(context)
        raise NotImplementedError
      end

      protected

      def glossary_term_info(context)
        global_glossary_hash = context.registers[:site].data["glossary"]
        unless global_glossary_hash.keys.to_set.include?(@args[:term_id])
          raise StandardError,
            "#{@args[:term_id]} is not a valid glossary term id. Please " \
            "see ./_data/glossary/* for the complete list."
        end
        global_glossary_hash[@args[:term_id]]
      end

      def include_snippet(context)
        @args[:length] ||= LENGTH_SHORT
        clean_markup = @args.keys.map { |k| "#{k}=\"#{@args[k]}\"" }.join(" ")

        Jekyll::Tags::IncludeTag.parse(
          "include",
          "#{SNIPPET_TEMPLATE} #{clean_markup}",
          nil,
          @parse_context
        ).render(context)
      end
    end

    # Tag for displaying a glossary term's definition inline
    class Definition < Base
      VALID_PARAM_NAMES = [
        :term_id,
        :length,
        :prepend,
      ].freeze

      def render(context)
        text = include_snippet(context)
        if @args[:prepend]
          text.sub(/<p>(.)/) { "<p>#{@args[:prepend]} #{$1.downcase}" }
        else
          text
        end
      end
    end

    # Tag to display a tooltip for a specific glossary term
    class Tooltip < Base
      VALID_PARAM_NAMES = [
        :text,
        :term_id
      ].freeze
      GLOSSARY_HOME = "/docs/reference/glossary/?all=true"
      NESTED_TOOLTIPS = /{% (.*?text="(.*?)".*?) %}/
      NESTED_MARKDOWN_LINKS = /(\[(.*?)\]\(.*?\))/

      def render(context)
        term_info = glossary_term_info(context)
        external_link =
          term_info["full-link"] ||
          "#{GLOSSARY_HOME}#term-#{term_info["id"]}"
        tooltip = term_info["short-description"].
          gsub(NESTED_TOOLTIPS, '\2').
          gsub(NESTED_MARKDOWN_LINKS, '\2').
          strip

        "<a class='glossary-tooltip' href='#{external_link}' target='_blank'>" \
        "#{@args[:text] || term_info["name"]}" \
        "<span class='tooltip-text'>" \
        "#{tooltip}" \
        "</span>" \
        "</a>"
      end
    end

    # Tag to inject a glossary term definition into another HTML element
    class Injector < Base
      VALID_PARAM_NAMES = [
        :text,
        :term_id,
        :placeholder_id,
        :length
      ].freeze
      RENDERED_DESCRIPTION_BLOCK = /.*<p>(.+)<\/p>.*/

      def render(context)
        term_info = glossary_term_info(context)
        description = RENDERED_DESCRIPTION_BLOCK.match(include_snippet(context))[1]

        "<span class='glossary-injector' data-placeholder-id='#{@args[:placeholder_id]}'>" \
        "#{@args[:text] || term_info["name"]}" \
        "<span class='injector-def hide'>" \
        "#{description}" \
        "</span>" \
        "</span>"
      end
    end
  end
end

Liquid::Template.register_tag('glossary_definition', Jekyll::GlossaryTags::Definition)
Liquid::Template.register_tag('glossary_tooltip', Jekyll::GlossaryTags::Tooltip)
Liquid::Template.register_tag('glossary_injector', Jekyll::GlossaryTags::Injector)
