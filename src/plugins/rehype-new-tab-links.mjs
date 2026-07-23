export default function rehypeNewTabLinks() {
  return function addNewTabAttributes(node) {
    if (node.type === "element" && node.tagName === "a") {
      node.properties = {
        ...node.properties,
        target: "_blank",
        rel: ["noopener", "noreferrer"],
      };
    }

    if (node.children) {
      node.children.forEach(addNewTabAttributes);
    }
  };
}
