import React, {FC, useState, MouseEvent} from 'react'
import classNames from 'classnames';
import Cell from '../cell'
import GroupContext from './GroupContext';

export interface ICheckboxProps {
  checked?: boolean;
  value?: any;
  disabled?: boolean;
  labelDisabled?: boolean, 
  readOnly?: boolean;
  indeterminate?: boolean;
  onChange?: (values: any) => void;
  className?: string;
  checkedColor?: string,
  style?: React.CSSProperties;
  labelStyle?: React.CSSProperties;
  iconSize?: number | string,
  shape?: string,
  width?: number;
  children?: any;
  prefix?: string;
  isValueEqual?: (value1: any, value2: any) => boolean;
}

const Checkbox:FC<ICheckboxProps>=(props)=>{
  const groupCtx = React.useContext(GroupContext);
  const propsRef = React.useRef(props);

  const {
    checked: _3,
    className,
    style,
    // disabled,
    // readOnly,
    children,
    indeterminate,
    width,
    // value可以是任意类型，不要写到dom上去
    value,
    iconSize,
    shape,
    checkedColor,
    labelStyle,
    disabled,
    labelDisabled, 
    readOnly,
    onChange,
    ...others
  } = props;


  const ctxOnChange = groupCtx && groupCtx.onChange;
  let checked: boolean;
  if (groupCtx) {
    const { value, isValueEqual } = groupCtx;
    checked = value.findIndex(it => isValueEqual(it, props.value)) !== -1;
  } else {
    checked = !!props.checked;
  }

  const [check, setChecked] = useState(checked)
  
  const onChangeVal = (event:  MouseEvent<HTMLElement>) => {
    if (disabled) {
      return;
    }
    // 1、判断是group的还是子的
    // 2、挂载在点击事件然后传出去
    setChecked(!check)
    //     onChange && onChange(!checked);
    if (ctxOnChange) { // 如果有group就用group的点击事件
        ctxOnChange(value);
        return;
      } else if (onChange) {
        const e: any = Object.create(event);
        console.log(event)

        e.target = {
          ...props,
          type: 'checkbox',
          checked:!(event.currentTarget.getAttribute('aria-checked') === 'true'), // 需要实时，不能在上面定义变量
        };
        onChange(e);
    }
};

  const classes = classNames('ha-checkbox',{
    [`ha-checkbox--disabled`]: disabled,
    [`ha-checkbox--label-disabled`]: labelDisabled
  })
  const iconClasses=classNames('ha-checkbox__icon',{
      [`ha-checkbox__icon--round`]: shape!=='square',
      [`ha-checkbox__icon--square`]: shape==='square',
      [`ha-checkbox__icon--checked`]: checked,
      [`ha-checkbox__icon--disabled`]: disabled
  })
  const labelClasses=classNames('ha-checkbox__label',{
      [`ha-checkbox__label--disabled`]: disabled
  })
  const colorStyle = {borderColor: checked? checkedColor:'',backgroundColor:checked? checkedColor:''}

  const checkboxRender = (
    <div role="checkbox" tab-index="0" aria-checked={check} className={classes} onClick={onChangeVal} >
        <div className={iconClasses} style={{fontSize: iconSize}}>
            <i className="ha-icon ha-icon-success" style={colorStyle}></i>
        </div>
        { groupCtx && groupCtx.type === 'cell'? null:<span className={labelClasses}>{children}</span>}
    </div>
  );

  if (groupCtx && groupCtx.type === 'cell') {
      return (
          <Cell title={children} value="" onClick={onChangeVal}>
            {checkboxRender}
          </Cell>
      );
  }

  return (
    checkboxRender
  )
}

export default Checkbox;

/*
1、子点击：
  如果有group就调用group的点击事件，把value（'a'）传出去给group点击事件去组装成数组['a','b','c']再返回出去
  否则把props、checked变量挂载到event事件上传出去
*/