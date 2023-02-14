import React, { Component, createRef } from 'react';
import { func, number, object, string } from 'prop-types';
// import { Jodit } from './include.jodit';
import { Jodit } from './include.jodit';
const { isFunction } = Jodit.modules.Helpers;

class JoditEditor extends Component {
  
  constructor(props){
    super(props);
    this.textArea = createRef();
  }
 

  componentDidMount(){
    const { ref, config, editorRef, value } = this.props;

    const element = this.textArea.current;
    const jodit = Jodit.make(element, config);
    this.textArea.current = jodit;

    if (isFunction(editorRef)) {
      editorRef(jodit);
    }

    if (ref) {
      if (isFunction(ref)) {
        ref(this.textArea.current);
      } else {
        ref.current = this.textArea.current;
      }
    }

    jodit.workplace.tabIndex = this.props.tabIndex || -1;

    if (this.props.onBlur || this.props.onChange) {
      const onBlurHandler = e =>
        this.props.onBlur && this.props.onBlur(jodit.value, e);
      const onChangeHandler = value => this.props.onChange && this.props.onChange(value);

      jodit.events
        .on('blur', onBlurHandler)
        .on('change', onChangeHandler);
    }

    if (jodit.isReady) {
      jodit.value = value;
    } else {
      jodit.waitForReady().then(() => {
        jodit.value = value;
      });
    }
  }

  componentWillUnmount() {
    this.textArea.current.destruct();
  }

  componentDidUpdate(prevProps) {
    const classList = this.textArea.current?.container?.classList;

    if (prevProps.className !== this.props.className) {
      if (typeof prevProps.className === 'string') {
        prevProps.className.split(/\s+/).forEach(cl => classList?.remove(cl));
      }

      if (typeof this.props.className === 'string') {
        this.props.className.split(/\s+/).forEach(cl => classList?.add(cl));
      }
    }

    if (prevProps.value !== this.props.value) {
      this.textArea.current.value = this.props.value;
    }
  }

  render() {
    return (
      <div className={'jodit-react-container'}>
        <textarea
          name={this.props.name}
          id={this.props.id}
          ref={this.textArea}
        />
      </div>
    );
  }
}

JoditEditor.displayName = 'JoditEditor';
JoditEditor.propTypes = {
	className: string,
	config: object,
	id: string,
	name: string,
	onBlur: func,
	onChange: func,
	editorRef: func,
	tabIndex: number,
	value: string
};

JoditEditor.defaultProps = {
  className: '',
  config: {},
  id: '',
  name: '',
  onBlur: null,
  onChange: null,
  tabIndex: null,
  value: '',
  editorRef: null
};
  
export default JoditEditor;
  
  