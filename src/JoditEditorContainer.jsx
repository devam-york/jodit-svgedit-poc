import React, { Component } from "react";
import JoditEditor from 'jodit-react';

function provideControlOptions(tspanStyleProperties){
  return function(jodit, control){
    const selection = document.getSelection();
    const nodeText = selection.focusNode.textContent;
    const selectedText = selection.toString();
    const tspanUpdate = selectedText === nodeText;
    
    if (selectedText) {
      if(tspanUpdate){
        let tspan = selection.focusNode;
        const euid = tspan.getAttribute('id') ?? 'tspan_' + Math.floor(Math.random() * 100);
        for (const property in tspanStyleProperties){
          if(tspan.style.getPropertyValue(property) && tspanStyleProperties[property] === tspan.style.getPropertyValue(property)){
            tspan.style.removeProperty(property)
          } else {
            tspan.style.setProperty(property, tspanStyleProperties[property])
          }
        }
      } else {
        let tspan = document.createElement("tspan");
        tspan.innerHTML = `${selectedText}`;
        const euid = 'tspan_' + Math.floor(Math.random() * 100)
        tspan.setAttribute('id', euid)
        for (const property in tspanStyleProperties) {
          tspan.style.setProperty(property, tspanStyleProperties[property])
        }
        const range = selection.getRangeAt(0);
        range.deleteContents();
        range.insertNode(tspan);
        
        let joditValue = document.querySelector('.jodit-wysiwyg');
        jodit.setEditorValue(joditValue.innerHTML);
        jodit.setNativeEditorValue(joditValue.innerHTML);
        jodit.synchronizeValues();
      
        const updateTspan = document.getElementById(euid);
        selection.removeAllRanges();
        const newRange = document.createRange();
        newRange.selectNodeContents(updateTspan);
        selection.addRange(newRange);
        jodit.focus();
      }
    }
  }
}

let basicControlOptions = {
  'strikethrough': {
    'text-decoration' : "line-through"
  },
  'bold': {
    'font-weight': "bold"
  },
  'italic': {
    'font-style': "italic"
  },
  'underline': {
    'text-decoration' : "underline"
  }
}

function toCheckIfContainsSVG(content){
  let div = document.createElement('div');
  div.innerHTML = `${content}`;
  let svg = div.querySelector('svg.slides-canvas');
  return !!svg;
}
class JoditEditorContainer extends Component {
  constructor(props) {
    super(props);
    this.editor = React.createRef();
    let content = props.value ? props.value : "";
    let config = {
      readonly: false, // all options from https://xdsoft.net/jodit/doc/,
      height: this.props.height ? this.props.height : 200,
      useSearch: false,
      showCharsCounter: false,
      showWordsCounter: false,
      showXPathInStatusbar: false,
    };
    
    let svgContent = toCheckIfContainsSVG(content);
    
    if(svgContent) {
      content = content.replace(/width="10in"/g, 'width="720px"');
      content = content.replace(/height="7.5in"/g, 'height="540px"');
      let basicOptionFuncs = {}
      Object.keys(basicControlOptions).forEach((optionName)=>{
        basicOptionFuncs[optionName] = {
          exec: provideControlOptions(basicControlOptions[optionName])
        }
      });
      config = {
        ...config,
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
          ...basicOptionFuncs,
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
              // this.updateContent(jodit.value);
              let joditValue = document.querySelector('.jodit-wysiwyg');
              jodit.setEditorValue(joditValue.innerHTML);
              jodit.setNativeEditorValue(joditValue.innerHTML);
              jodit.synchronizeValues();
            },
          },
        },
      }
    } 

    this.state = { content };
    this.config = config;
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
    const { content } = this.state;
    return (
      <JoditEditor
        ref={this.editor}
        value={content}
        config={this.config}
        onChange={(content) => this.updateContent(content)}
        onBlur={(content) => this.onChangeHandler(content)}
      />
    );
  }
}

export default React.memo(JoditEditorContainer);