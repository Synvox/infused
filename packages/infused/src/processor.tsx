export type Processor<T> = {
  next?(string: string, charCode: number): void;
  end(fullString: string): T;
};

export function process<T>(str: string, fn: () => Processor<T>) {
  const length = str.length;
  const process = fn();

  if (process.next)
    for (let i = 0; i < length; i++) {
      process.next(str[i], str.charCodeAt(i));
    }

  const result = process.end(str);

  return result;
}

// based on cyrb53
export function getHashProcessor(seed = 0) {
  let h1 = 0xdeadbeef ^ seed;
  let h2 = 0x41c6ce57 ^ seed;

  return {
    next(_str: string, ch: number) {
      h1 = Math.imul(h1 ^ ch, 2654435761);
      h2 = Math.imul(h2 ^ ch, 1597334677);
    },
    end() {
      h1 =
        Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^
        Math.imul(h2 ^ (h2 >>> 13), 3266489909);
      h2 =
        Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^
        Math.imul(h1 ^ (h1 >>> 13), 3266489909);

      return (
        (h2 >>> 0).toString(16).padStart(8, "0") +
        (h1 >>> 0).toString(16).padStart(8, "0")
      );
    },
  };
}

type CSSSelectorTree = {
  selector: string;
  rules: (string | StyleTree)[];
};
type StyleTree =
  | CSSSelectorTree
  | {
      wrapper: string;
      subTrees: StyleTree[];
    };

export function getUnnestProcessor() {
  let tree: StyleTree = {
    selector: "",
    rules: [""],
  };
  let buffer = "";
  let quote = "";
  let isWrapping = false;
  let isWhitespace = false;
  let cursors: StyleTree[] = [tree];
  const appendRule = (str: string) => {
    let cursor = cursors[cursors.length - 1];
    if (!("rules" in cursor)) throw new Error();
    if (typeof cursor.rules[cursor.rules.length - 1] !== "string")
      cursor.rules.push(str);
    else cursor.rules[cursor.rules.length - 1] += str;
  };

  return {
    next(str: string, _char: number) {
      let cursor = cursors[cursors.length - 1];

      if ((str === '"' || str === "'") && !quote) {
        buffer += str;
        quote = str;
      } else if (quote === str) {
        buffer += str;
        quote = "";
      } else if (quote) {
        buffer += str;
      } else if (str === ";" && "rules" in cursor) {
        appendRule(buffer.trim() + ";");
        buffer = "";
      } else if (str === "@" && buffer.trim().length === 0) {
        buffer = "@";
        isWrapping = true;
      } else if (str === "{" && isWrapping) {
        let newTree: StyleTree = {
          wrapper: buffer.trim(),
          subTrees: [
            {
              selector: "&",
              rules: [""],
            },
          ],
        };
        cursors.push(newTree.subTrees[0]);
        (cursor as CSSSelectorTree).rules.push(newTree);
        buffer = "";
        isWrapping = false;
      } else if (str === "{") {
        let newTree: StyleTree = {
          selector: buffer.trim(),
          rules: [""],
        };

        cursors.push(newTree);
        (cursor as CSSSelectorTree).rules.push(newTree);

        buffer = "";
      } else if (str === "}") {
        if ("rules" in cursor) {
          appendRule(buffer);
          buffer = "";
        }
        cursors.pop();
      } else if (" \t\n".includes(str)) {
        if (isWhitespace) return;
        isWhitespace = true;
        buffer += " ";
      } else {
        isWhitespace = false;
        buffer += str;
      }
    },
    end() {
      let cursor = cursors[cursors.length - 1];

      if ("rules" in cursor) {
        appendRule(buffer);
        buffer = "";
      }

      function walk(tree: StyleTree, topSelector: string): string {
        if ("wrapper" in tree) {
          return `${tree.wrapper}{${tree.subTrees
            .map((tree) => walk(tree, topSelector))
            .filter((x) => x)
            .join("\n")}}`;
        }

        if (topSelector === "&") topSelector = "";

        const { selector, rules } = tree;
        const newSelector = !topSelector
          ? selector
          : topSelector
              .split(",")
              .map((s) => s.trim())
              .map((topSelector) =>
                selector
                  .split(",")
                  .map((s) => s.trim())
                  .map((selector) =>
                    selector.includes("&")
                      ? selector.replace(/&/g, topSelector)
                      : `${topSelector} ${selector}`
                  )
                  .join(",")
              )
              .join(",")
              .trim();

        let output = [];
        for (let rule of rules) {
          if (typeof rule === "string") {
            const ruleText = rule.trim();
            const selector = newSelector.trim();
            if (ruleText && selector) output.push(`${selector}{${ruleText}}`);
          } else {
            const result = walk(rule, newSelector);
            if (result) output.push(result);
          }
        }

        return output.join("\n");
      }

      return (topLevel: string) => walk(tree, topLevel);
    },
  };
}
