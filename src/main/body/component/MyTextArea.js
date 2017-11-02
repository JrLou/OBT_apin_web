/**
 * Created by apin on 2017/10/28.
 */
import React, {Component} from "react";
import css from "./MyTextArea.less";
import MyDiv from "./MyDiv.js";

class MyTextArea extends Component {

    constructor(props) {
        super(props);
        this.state = {
            myNum:0
        };
    }

    componentWillReceiveProps(nextProps) {

    }
    componentDidMount() {

    }

    render() {
        let {callBack,maxLength} = this.props;
        let div = (<div>
            <textarea
                className={css.textArea}
                {...this.props}
                onChange={(e)=>{
                    this.recycleNum(e.target.value,callBack);
                }}
            />
            {maxLength?<div className={css.numState}>{this.state.myNum+"／"+(maxLength+"字")}</div>:null}
        </div>);
        return (<MyDiv div={div}/>);
    }
    recycleNum(value,callBack){
        this.setState({
            myNum:value?value.length:0,
        },()=>{
            if (callBack){
                callBack(value);
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

module.exports = MyTextArea;