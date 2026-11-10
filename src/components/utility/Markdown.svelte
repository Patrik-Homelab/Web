<script lang="ts">
  import type { ClassValue } from 'clsx';
  import clsx from 'clsx';
  import DOMPurify from 'isomorphic-dompurify';
  import { Marked } from 'marked';
  import { twMerge } from 'tailwind-merge';
  import { HIDE_LINK_KEYWORDS } from '$/lib/data/projectsData';

  type MarkdownProps = {
    content: string;
    class?: ClassValue;
  };

  const markedInstance = new Marked({
    renderer: {
      link({ href, title, text }) {
        const cleanHref = href.replace(
          /#(?:hidden|hide|nobutton|no-button|nobtn|no-btn|(?:btn|button|label)=[^&]*)$/i,
          ''
        );

        let cleanTitle = title;
        if (cleanTitle) {
          const lower = cleanTitle.toLowerCase();
          if (
            HIDE_LINK_KEYWORDS.has(lower) ||
            /^(?:btn|button|label)\s*:/i.test(cleanTitle)
          ) {
            cleanTitle = undefined;
          }
        }

        const isExternal =
          cleanHref.startsWith('http://') || cleanHref.startsWith('https://');
        const targetAttrs = isExternal
          ? ' target="_blank" rel="noopener noreferrer"'
          : '';
        const titleAttr = cleanTitle
          ? ` title="${cleanTitle.replace(/"/g, '&quot;')}"`
          : '';

        return `<a href="${cleanHref}"${targetAttrs}${titleAttr}>${text}</a>`;
      }
    }
  });

  function prepareMarkdown(text: string): string {
    if (!text) return '';
    return text.replace(/\[([^\]|]+?)\s*\|\s*[^\]]+\]\(/g, '[$1](');
  }

  const { content, class: cls = '' }: MarkdownProps = $props();

  const sanitized = $derived(
    DOMPurify.sanitize(markedInstance.parse(prepareMarkdown(content)) as string, {
      ADD_ATTR: ['target']
    })
  );
</script>

<div class={twMerge('prose prose-theme prose-lg lg:prose-xl font-medium', clsx(cls))}>
  <!-- eslint-disable-next-line svelte/no-at-html-tags -->
  {@html sanitized}
</div>
