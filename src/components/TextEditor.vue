<template>
  <div>
    <div class="buttons-editor" v-if="editor">
      <select name="select" @change="setText($event)" :value="typeText">
        <option value="normal">Normal</option>
        <option value="title1">Título 1</option>
        <option value="title2">Título 2</option>
        <option value="title3">Título 3</option>
      </select>
      <ion-button
        color="input"
        class="only-icon"
        :fill="editor.isActive('bold') ? 'solid' : 'outline'"
        @click="editor.chain().focus().toggleBold().run()"
        :class="{ 'is-active': editor.isActive('bold') }"
      >
        <img src="/assets/icons/bold.png" alt="" />
      </ion-button>
      <ion-button
        color="input"
        class="only-icon"
        :fill="editor.isActive('italic') ? 'solid' : 'outline'"
        @click="editor.chain().focus().toggleItalic().run()"
        :class="{ 'is-active': editor.isActive('italic') }"
      >
        <img src="/assets/icons/italic.png" alt="" />
      </ion-button>
      <ion-button
        color="input"
        class="only-icon"
        :fill="editor.isActive('strike') ? 'solid' : 'outline'"
        @click="editor.chain().focus().toggleStrike().run()"
        :class="{ 'is-active': editor.isActive('strike') }"
      >
        <img src="/assets/icons/strike.png" alt="" />
      </ion-button>
      <ion-button
        color="input"
        class="only-icon"
        :fill="editor.isActive('bulletList') ? 'solid' : 'outline'"
        @click="editor.chain().focus().toggleBulletList().run()"
        :class="{ 'is-active': editor.isActive('bulletList') }"
      >
        <img src="/assets/icons/content.png" alt="" />
      </ion-button>
      <ion-button
        color="input"
        class="only-icon"
        :fill="editor.isActive('blockquote') ? 'solid' : 'outline'"
        @click="editor.chain().focus().toggleBlockquote().run()"
        :class="{ 'is-active': editor.isActive('blockquote') }"
      >
        <img src="/assets/icons/commt.png" alt="" />
      </ion-button>
      <ion-button
        color="input"
        class="only-icon"
        :fill="editor.isActive({ textAlign: 'justify' }) ? 'solid' : 'outline'"
        @click="editor.chain().focus().setTextAlign('justify').run()"
        :class="{ 'is-active': editor.isActive({ textAlign: 'justify' }) }"
      >
        <img src="/assets/icons/align-justify.png" alt="" />
      </ion-button>
      <ion-button
        color="input"
        class="only-icon"
        :fill="editor.isActive({ textAlign: 'left' }) ? 'solid' : 'outline'"
        @click="editor.chain().focus().setTextAlign('left').run()"
        :class="{ 'is-active': editor.isActive({ textAlign: 'left' }) }"
      >
        <img src="/assets/icons/align-left.png" alt="" />
      </ion-button>
      <ion-button
        color="input"
        class="only-icon"
        :fill="editor.isActive({ textAlign: 'center' }) ? 'solid' : 'outline'"
        @click="editor.chain().focus().setTextAlign('center').run()"
        :class="{ 'is-active': editor.isActive({ textAlign: 'center' }) }"
      >
        <img src="/assets/icons/align-center.png" alt="" />
      </ion-button>
      <ion-button
        color="input"
        class="only-icon"
        :fill="editor.isActive({ textAlign: 'right' }) ? 'solid' : 'outline'"
        @click="editor.chain().focus().setTextAlign('right').run()"
        :class="{ 'is-active': editor.isActive({ textAlign: 'right' }) }"
      >
        <img src="/assets/icons/align-right.png" alt="" />
      </ion-button>
      <ion-button color="input" class="only-icon" fill="outline" @click="editor.chain().focus().undo().run()" :disabled="!editor.can().undo()">
        <img src="/assets/icons/undo.png" alt="" />
      </ion-button>
      <ion-button color="input" class="only-icon" fill="outline" @click="editor.chain().focus().redo().run()" :disabled="!editor.can().redo()">
        <img src="/assets/icons/redo.png" alt="" />
      </ion-button>
    </div>

    <EditorContent :editor="editor" />

    <div class="footer">
      <div>
        <div v-if="characterCount >= 1 && characterCount < minimun" class="text-minimun">Mínimo de {{ minimun }} caracteres</div>
      </div>
      <div
        v-if="editor"
        :class="{
          'character-count': true,
          'character-count--danger': characterCount === limit,
          'character-count--warning': characterCount >= limit * 0.85 && characterCount < limit,
        }"
      >
        <svg height="20" width="20" viewBox="0 0 20 20" class="character-count__graph">
          <circle r="10" cx="10" cy="10" fill="#e9ecef" />
          <circle r="5" cx="10" cy="10" fill="transparent" stroke="currentColor" stroke-width="10" :stroke-dasharray="`calc(${percentage} * 31.4 / 100) 31.4`" transform="rotate(-90) translate(-20)" />
          <circle r="6" cx="10" cy="10" fill="#f4f5f8" />
        </svg>

        <div class="character-count__text">{{ characterCount }}/{{ limit }} caracteres</div>
      </div>
    </div>
  </div>
</template>

<script>
import { Editor, EditorContent } from "@tiptap/vue-3";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import Heading from "@tiptap/extension-heading";
import CharacterCount from "@tiptap/extension-character-count";
import Placeholder from "@tiptap/extension-placeholder";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import Link from "@tiptap/extension-link";
import Typography from "@tiptap/extension-typography";

export default {
  name: "EditorComponent",
  components: {
    EditorContent,
  },
  props: {
    modelValue: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      editor: null,
      limit: 2000,
      minimun: 100,
      textSelect: "normal",
    };
  },
  mounted() {
    this.editor = new Editor({
      content: this.modelValue,
      extensions: [
        Document,
        Paragraph,
        Text,
        StarterKit,
        Typography,
        TextAlign.configure({
          types: ["heading", "paragraph"],
        }),
        Heading.configure({
          levels: [1, 2, 3],
        }),
        CharacterCount.configure({
          limit: this.limit,
        }),
        Placeholder.configure({
          placeholder: () => {
            return "Descreva seu anúncio...";
          },
        }),
        Link.configure({
          openOnClick: false,
        }),
      ],
      onUpdate: () => {
        this.$emit("update:modelValue", this.editor.getHTML());
        this.$emit("characterCount", this.characterCount);
      },
    });
  },
  computed: {
    characterCount() {
      let char = 0;
      if (this.editor?.storage) char = this.editor.storage.characterCount.characters();
      return char;
    },
    percentage() {
      return Math.round((100 / this.limit) * this.characterCount);
    },
    typeText() {
      if (this.editor.isActive("paragraph")) return "normal";
      if (this.editor.isActive("heading", { level: 1 })) return "title1";
      if (this.editor.isActive("heading", { level: 2 })) return "title2";
      if (this.editor.isActive("heading", { level: 3 })) return "title3";
      return "";
    },
  },
  methods: {
    setText(e) {
      let typeSelect = e.target.value;
      if (typeSelect == "normal") this.editor.chain().focus().setParagraph().run();
      if (typeSelect == "title1") this.editor.chain().focus().toggleHeading({ level: 1 }).run();
      if (typeSelect == "title2") this.editor.chain().focus().toggleHeading({ level: 2 }).run();
      if (typeSelect == "title3") this.editor.chain().focus().toggleHeading({ level: 3 }).run();
    },
  },
  watch: {
    modelValue(value) {
      const isSame = this.editor.getHTML() === value;
      if (isSame) {
        return;
      }
      this.editor.commands.setContent(value, false);
    },
  },
  beforeUnmount() {
    this.editor.destroy();
  },
};
</script>

<style lang="scss">
.ProseMirror {
  margin-top: 0;
  box-sizing: border-box !important;
  border: 1px solid rgba(var(--ion-color-input-rgb), 0.5);
  border-radius: 0 0 8px 8px;
  height: 30vh;
  max-height: 30vh !important;
  overflow-y: auto;
  padding: 6px 12px;
  &:focus-visible {
    outline: none;
  }
}
.ProseMirror p.is-editor-empty:first-child::before {
  content: attr(data-placeholder);
  float: left;
  color: var(--ion-color-medium);
  pointer-events: none;
  height: 0;
}

.footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  .text-minimun {
    color: var(--ion-color-danger);
    opacity: 0.5;
  }

  .character-count {
    margin-top: 8px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 6px;
    color: var(--ion-color-success);
    &--warning {
      color: var(--ion-color-warning);
    }
    &--danger {
      color: var(--ion-color-danger);
    }
    &__text {
      color: var(--ion-color-medium-tint);
    }
  }
}

.buttons-editor {
  margin-top: 12px;
  box-sizing: border-box !important;
  border: 1px solid rgba(var(--ion-color-input-rgb), 0.5);
  border-bottom: none;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-flow: row wrap;
  border-radius: 8px 8px 0 0;
  gap: 4px;
  padding: 4px;
  ion-button {
    margin: 0;
    position: relative;
    --padding-start: 6px;
    --padding-end: 6px;
    --padding-top: 6px;
    --padding-bottom: 6px;
    --border-radius: 6px;
    &.is-active {
      --border-radius: 8px;
      img {
        filter: invert(1);
      }
    }
  }

  select {
    appearance: none;
    border: 0;
    outline: 0;
    font: inherit;
    width: auto;
    max-width: 75px;
    flex-flow: 1;
    height: 32px;
    padding: 0 8px;
    background: transparent;
    color: var(--ion-text-color);
    border: 1px solid var(--ion-color-input);
    border-radius: 6px;
    cursor: pointer;
    option {
      color: inherit;
      background-color: var(--ion-color-step-50);
      border: none;
    }
    &:focus {
      outline: none;
    }
    &::-ms-expand {
      display: none;
    }
  }
}
</style>
