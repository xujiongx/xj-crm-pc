import hljs from 'highlight.js';
import 'highlight.js/styles/github.css';
import MarkdownIt from 'markdown-it';
import { FC } from 'react';
import './index.less';

interface MarkdownTextProps {
  text: string;
}

const MarkdownText: FC<MarkdownTextProps> = ({ text }) => {
  const highlightBlock = (str: string, lang?: string) => {
    return `<pre class="code-block-wrapper">
      <div class="code-block-header">
        <span class="code-block-header__lang">${lang}</span>
      </div>
      <code class="hljs code-block-body ${lang}">${str}</code>
    </pre>`;
  };

  const md = new MarkdownIt({
    linkify: true,
    typographer: true,
    html: true,
    breaks: true,
    highlight(code, language) {
      const validLang = !!(language && hljs.getLanguage(language));
      if (validLang) {
        const lang = language ?? '';
        return highlightBlock(hljs.highlight(lang, code, true).value, lang);
      }
      return highlightBlock(hljs.highlightAuto(code).value, '');
    },
  });

  const content = md.render(text);

  return (
    <div
      className="markdown-body"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
};

export default MarkdownText;
