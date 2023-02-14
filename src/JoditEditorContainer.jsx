import React, { Component } from "react";
import JoditEditor from "./JoditEditor";
// import JoditEditor from 'jodit-react';

class JoditEditorContainer extends Component {
  constructor(props) {
    super(props);
    this.editor = React.createRef();
    let content = props.value ? props.value : "";
    content = content.replace(/width="10in"/g, 'width="720px"');
    content = content.replace(/height="7.5in"/g, 'height="540px"');
    // content = content.replace(/height="7.5in"/g, 'height="340px"');
    // content = content.replace(/viewBox="0 0 720 540"/g, 'viewBox="0 0 720 340"');
    this.state = { content };
    this.config = {
      readonly: false, // all options from https://xdsoft.net/jodit/doc/,
      height: this.props.height ? this.props.height : 200,
      useSearch: false,
      showCharsCounter: false,
      showWordsCounter: false,
      showXPathInStatusbar: false,
      toolbarButtonSize: 'large',
      toolbarAdaptive: false,
      buttons: [
        "bold",
        "italic",
        "underline",
        "strikethrough",
        "fontsize",
        "link",
        "undo",
        "redo",
      ],
      controls: {
        bold: {
          exec: (jodit, control) => {
            const selection = window.getSelection();
            const selectedText = selection.toString();

            if (selectedText) {
              const tspan = document.createElement("tspan");
              tspan.innerHTML = `${selectedText}`;
              tspan.style.fontWeight = "bold";

              const range = selection.getRangeAt(0);
              range.deleteContents();
              range.insertNode(tspan);
            }
            this.updateContent(jodit.value);
            jodit.focus();
          },
        },
        underline: {
          exec: (jodit, control) => {
            const selection = window.getSelection();
            const selectedText = selection.toString();

            if (selectedText) {
              const tspan = document.createElement("tspan");
              tspan.innerHTML = `${selectedText}`;
              tspan.style.textDecoration = "underline";

              const range = selection.getRangeAt(0);
              range.deleteContents();
              range.insertNode(tspan);
            }
            this.updateContent(jodit.value);
          },
        },
        italic: {
          exec: (jodit, control) => {
            const selection = window.getSelection();
            const selectedText = selection.toString();

            if (selectedText) {
              const tspan = document.createElement("tspan");
              tspan.innerHTML = `${selectedText}`;
              tspan.style.fontStyle = "italic";

              const range = selection.getRangeAt(0);
              range.deleteContents();
              range.insertNode(tspan);
            }
            this.updateContent(jodit.value);
          },
        },
        strikethrough: {
          exec: (jodit, control) => {
            const selection = window.getSelection();
            const selectedText = selection.toString();

            if (selectedText) {
              const tspan = document.createElement("tspan");
              tspan.innerHTML = `${selectedText}`;
              tspan.style.textDecoration = "line-through";

              const range = selection.getRangeAt(0);
              range.deleteContents();
              range.insertNode(tspan);
            }
            this.updateContent(jodit.value);
          },
        },
        fontsize: {
          exec: (jodit, control, input) => {
            let fontSize = input.control.name + 'px';
            const selection = window.getSelection();
            const selectedText = selection.toString();

            if (selectedText) {
              const tspan = document.createElement("tspan");
              tspan.innerHTML = `${selectedText}`;
              tspan.style.fontSize = fontSize;

              const range = selection.getRangeAt(0);
              range.deleteContents();
              range.insertNode(tspan);
            }
            this.updateContent(jodit.value);
          },
        },
      },
    };

    this.onChangeHandler = props.onChangeHandler;
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.state.content !== nextState.content) {
      return true;
    }
    return false;
  }

  updateContent(content) {
    this.setState({ content });
  }

  render() {
    console.log("LOG in Rendering");
    const { content } = this.state;
    const config = this.config;
    return (
      <JoditEditor
        ref={this.editor}
        value={content}
        config={config}
        onChange={(content) => this.updateContent(content)}
        onBlur={(content) => this.onChangeHandler(content)}
      />
    );
  }
}

export default React.memo(JoditEditorContainer);

// componentWillReceiveProps(nextProps) {
//   if (this.props.value !== nextProps.value) {
//     this.setState({ content: nextProps.value });
//   }
// }

// shouldComponentUpdate(nextProps, nextState) {
//   if (this.state.content !== nextState.content) {
//     return true;
//   }
//   return false;
// }