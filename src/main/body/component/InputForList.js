/**
 * Created by lixifeng on 17/10/12.
 */
import React, {Component, Input, Icon} from "react";
import {AutoComplete} from "antd";

const Option = AutoComplete.Option;
const OptGroup = AutoComplete.OptGroup;
import less from "./InputAuto.less";

import {HttpTool} from "../../../../lib/utils/index.js";

class InputAuto extends Component {

    constructor(props) {
        super(props);

        this.state = {
            dataSource: [],
            ifFirst: true,
            inputValue: '',
        };
        this.selectValue = this.props.defaultValue;
        this.keyWord = this.props.defaultValue;

        if(this.props.getClearAction){
            this.props.getClearAction(this.clearValue.bind(this));
        }
    }

    clearValue(){
        this.setState({
            inputValue:'',
        });
    }

    componentDidMount() {
        if (this.keyWord) {
            this.loadDataForKeyWord(this.keyWord);
        } else {
            this.loadData();
        }

    }

    loadData() {

    }

    loadDataForKeyWord(keyWord) {
        let param = {
            str: keyWord
        };
        let success = (code, msg, json, option) => {
            log(json);
            if(this.keyWord){
                this.setState({
                    dataSource: json
                });
            }

        };
        let failure = (code, msg, option) => {
            //无结果
            if(this.keyWord){
                this.setState({
                    dataSource: []
                });
            }

        };
        HttpTool.request(HttpTool.typeEnum.POST, "/ba/baseapi/v1.0/cities/list/key", success, failure, param,
            {
                ipKey: "hlIP"
            });
    }

    formatValue(value) {

        return this.state.dataSource[value];
    }

    onSelect(value, option) {
        this.selectValue = this.formatValue(value);
        this.keyWord = this.formatValue(value);
        this.setState({
            inputValue:this.selectValue,
        },this.onChangeValue);
    }
    onChangeValue(){
        const onChangeValue = this.props.onChangeValue;
        if (onChangeValue) {
            onChangeValue(this.state.inputValue);
        }
    }

    getValue() {
        log(this.selectValue);
        return this.selectValue;
    }

    getOptions(dataSource) {
        if (!dataSource || this.state.ifFirst) {
            return [];
        }
        let hasValue = this.keyWord;
        let noData = dataSource.length< 1;

        if(noData){
            if (hasValue) {
                return [
                    <Option disabled key="all1" className="show-all">
                        <div className={less.errorMessage}>
                            无查询结果
                        </div>
                    </Option>
                ];
            }
        }
        let result = dataSource.map((obj, index) => {
            return <Option className={this.keyWord ? null : less.dropItemFloat} key={index}>{obj}</Option>;
        });

        if (hasValue) {
            return result;
        }

    }

    changeFirstState() {
        if (this.state.ifFirst) {
            this.setState({ifFirst: false});
        }
    }


    render() {
        let props = {};
        for(let v in this.props){
            //去除值选项
            if(v!=="value"){
                props[v]= this.props[v];
            }
        }
        return (
                <AutoComplete
                    {...props}
                    value={this.state.inputValue}
                    className={less.autoComplete}
                    dropdownMatchSelectWidth={true}
                    dropdownStyle={{width: "320px"}}
                    size="large"
                    dataSource={this.getOptions(this.state.dataSource)}
                    onSelect={this.onSelect.bind(this)}
                    onFocus={() => {
                        this.changeFirstState();
                    }}
                    onSearch={(value) => {
                        if(value&&value.length>18){
                            return;
                        }
                        this.setState({
                           inputValue:value,
                        });
                        this.keyWord = value;
                        this.selectValue = value;
                        this.onChangeValue();
                        // log("==========");
                        // log(value);
                        //防止连续快速搜索，请求接口



                        if(this.keyWord){
                            //搜索

                            // this.setState({
                            //     dataSource:null
                            // });
                            clearTimeout(this.seeIng);
                            this.seeIng = null;
                            let time = 300;
                        //   1:输入频率,是否超过300MS
                            if(new Date().getTime()-this.tempTime>time){
                                //可以去搜索
                                this.loadDataForKeyWord(this.keyWord);
                            }else{
                                //频率太高,不搜索
                                //计时 300后开始搜索
                                this.seeIng = setTimeout(()=>{
                                    clearTimeout(this.seeIng);
                                    this.seeIng = null;
                                    if(this.keyWord) {
                                        this.loadDataForKeyWord(this.keyWord);
                                    }else{
                                        this.loadData();
                                    }
                                },time);
                            }
                        }else{
                            //热门
                            this.loadData();
                        }

                        this.tempTime = new Date().getTime();
                    }}


                >
                </AutoComplete>
        );
    }
}

module.exports = InputAuto;