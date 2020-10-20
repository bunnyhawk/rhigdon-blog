const markdownItAttrs = require('markdown-it-attrs');
const markdownIt = require('markdown-it')({
  html: true,
  breaks: true,
  linkify: true
});

markdownIt.use(markdownItAttrs);

module.exports = function markdown(value) {
  return markdownIt.render(value);
};
