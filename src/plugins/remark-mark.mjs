export function rehypeMark() {
  function splitMark(text) {
    const re = /==([^=\n]+)==/g;
    const parts = [];
    let last = 0;
    let m;

    while ((m = re.exec(text)) !== null) {
      if (m.index > last) {
        parts.push({ type: 'text', value: text.slice(last, m.index) });
      }
      parts.push({
        type: 'element',
        tagName: 'mark',
        properties: {},
        children: [{ type: 'text', value: m[1] }],
      });
      last = m.index + m[0].length;
    }

    if (last === 0) return null;
    if (last < text.length) {
      parts.push({ type: 'text', value: text.slice(last) });
    }
    return parts;
  }

  function walk(node) {
    if (!Array.isArray(node.children)) return;
    let i = 0;
    while (i < node.children.length) {
      const child = node.children[i];
      if (child.type === 'text' && typeof child.value === 'string' && child.value.includes('==')) {
        const replacement = splitMark(child.value);
        if (replacement) {
          node.children.splice(i, 1, ...replacement);
          i += replacement.length;
          continue;
        }
      }
      walk(child);
      i++;
    }
  }

  return function (tree) {
    walk(tree);
  };
}
