import { useInsertionEffect } from "react";
import { useRegisterInfusedStyleSheet } from "./context";
import { getHashProcessor, process } from "./processor";

type Entry = { id: string; css: string };

export class WithInfusedStyleSheet {
  stylesheet: InfusedStyleSheet;
  constructor(stylesheet: InfusedStyleSheet) {
    this.stylesheet = stylesheet;
  }
}

export class InfusedStyleSheet {
  static sheets: InfusedStyleSheet[] = [];

  css: string | null = null;
  dependsOn: Set<InfusedStyleSheet> = new Set();
  element: HTMLStyleElement | null = null;
  entries: Entry[] = [];
  id: string | null = null;
  index: number;
  subscribers = 0;
  prefix: string;

  constructor(prefix?: string) {
    this.prefix = prefix ? `${prefix}-` : "i";
    this.index = InfusedStyleSheet.sheets.length;
    InfusedStyleSheet.sheets.push(this);
  }

  get mounted() {
    return this.element && this.element.parentElement !== null;
  }

  compile() {
    if (this.id !== null) return;
    this.id =
      this.prefix +
      process(this.entries.map((e) => e.id).join("-"), () =>
        getHashProcessor()
      );
    this.css = this.entries
      .map((e) => e.css)
      .filter((x) => x)
      .join("\n");
    this.element = this.createTag();
  }

  createTag() {
    if (typeof document === "undefined") return null;
    let styleTag = document.querySelector<HTMLStyleElement>(`style#${this.id}`);
    if (styleTag) return styleTag;
    styleTag = document.createElement("style");
    styleTag.setAttribute("id", this.id!);
    styleTag.innerHTML = this.css!;
    return styleTag;
  }

  append(styleId: string, css: string, stylesheets: Set<InfusedStyleSheet>) {
    if (this.id) throw new Error("InfusedStyleSheet is locked");
    this.entries.push({ id: styleId, css });
    for (let stylesheet of stylesheets) this.dependsOn.add(stylesheet);
  }

  mount() {
    this.compile();

    if (this.subscribers++ !== 0) return;
    for (let s of this.dependsOn) s.mount();

    for (let sheet of InfusedStyleSheet.sheets.slice(0, this.index)) {
      if (sheet.mounted) {
        sheet.element!.after(this.element!);
        return;
      }
    }

    if (document.head) document.head.appendChild(this.element!);
  }

  unmount() {
    if (--this.subscribers !== 0) return;
    this.element!.parentElement?.removeChild(this.element!);
    for (let s of this.dependsOn) s.unmount();
  }

  useStyle() {
    if (typeof document === "undefined") {
      this.compile();
      useRegisterInfusedStyleSheet(this);
    }

    useInsertionEffect(() => {
      this.mount();
      return () => this.unmount();
    }, []);
  }
}
