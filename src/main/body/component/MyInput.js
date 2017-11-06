/**
 * Created by apin on 2017/10/26.
 */
import React, {Component} from "react";
import css from "./MyInput.less";
import MyDiv from "./MyDiv.js";

class MyInput extends Component {

    constructor(props) {
        super(props);
        this.state = {
            myNum:props.value
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            myNum:nextProps.value,
        });
    }
    componentDidMount() {

    }
    addAction(isAdd,callBack){
        let {myNum} = this.state;
        if (!myNum){
            myNum = 0;
        }
        let num_Int = parseInt(myNum);
        if (isAdd){
            num_Int++;
        }else {
            num_Int--;
        }
        num_Int = num_Int<=0?"0":num_Int;
        this.setState({
            myNum:num_Int
        },()=>{
            if (callBack){
                callBack(num_Int);
            }
        });

    }
    render() {
        let {callBack,obj} = this.props;
        let div = (<div>
            <div className={css.cell}>
                <div className={css.title}>{obj.title}</div>
                <div className={css.inputCell}>
                    {obj&&obj.isAddOrSub?<div style={{float:"left"}}>
                        <MyDiv div={<div className={css.addItem}
                                         onClick={()=>{
                                             this.addAction(false,callBack);
                                         }}
                        >{"-"}</div>}/>
                    </div>:null}


                    <div style={{float:"left"}}>
                        <MyDiv div={<div>
                            <input {...this.props}
                                   value={this.state.myNum}
                                   onChange={(e)=>{
                                       let value = e.target.value;
                                       if (obj&&obj.isRandom){
                                           this.setState({
                                               myNum:value,
                                           },()=>{
                                               if (callBack){
                                                   callBack(value);
                                               }
                                           });
                                       }else {
                                           this.recycleNum(value,callBack);
                                       }
                                   }}
                                   onMouseLeave={(e)=>{
                                       if (obj&&obj.regular && e.target.value){
                                           alert("请核对您的手机号");
                                       }
                                   }}
                            />
                            {obj&&obj.text?<div style={{float:"right",
                                height:"30px",
                                lineHeight:"30px",
                                paddingRight:"5px",
                                paddingLeft:"5px",
                                fontSize:"12px",
                                color:"#CBD3E5",
                            }}>{obj.text}</div>:null}

                        </div>}/>
                    </div>

                    {obj&&obj.isAddOrSub?<div style={{float:"left"}}>
                        <MyDiv div={<div className={css.addItem}
                                         onClick={()=>{
                                             this.addAction(true,callBack);
                                         }}
                        >{"+"}</div>}/>
                    </div>:null}
                </div>
                <div className={css.subtitle}>{obj.subtitle}</div>
            </div>
            <div className={css.error}>{"人数必须大于0"}</div>
        </div>);
        return (div);
    }
    recycleNum(value,callBack){
        if(!/^[0-9]*$/.test(value) && value!=""){
            return;
        }
        if (value.substring(0,1)==0){
            this.setState({
                myNum:"",
            },()=>{
                if (callBack){
                    callBack("");
                }
            });
            return;
        }
        this.setState({
            myNum:value,
        },()=>{
            if (callBack){
                callBack(this.state.myNum);
            }
        });
        // if (value&value.replace("^[0-9]\d*$",)&parseInt(value)){
        //
        //
        //     this.setState({
        //         myNum:value,
        //     },()=>{
        //         if (callBack){
        //             callBack(this.state.myNum);
        //         }
        //     });
        // }else {
        //     if (value===""){
        //         this.setState({
        //             myNum:(value&&parseInt(value)>0)?this.state.myNum:"",
        //         },()=>{
        //             if (callBack){
        //                 callBack(this.state.myNum);
        //             }
        //         });
        //     }
        //
        // }
    }
}

module.exports = MyInput;