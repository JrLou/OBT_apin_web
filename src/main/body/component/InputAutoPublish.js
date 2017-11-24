/**
 * Created by lixifeng on 17/10/12.
 */
import React, {Component, Icon} from "react";
import {AutoComplete,Input} from "antd";
const Option = AutoComplete.Option;
const OptGroup = AutoComplete.OptGroup;
import less from "./InputAuto.less";

import {HttpTool} from "../../../../lib/utils/index.js";
import APIGYW from "../../../api/APIGYW.js";

class InputAuto extends Component {
    constructor(props) {
        super(props);
        let a = ["安娜", "阿尔巴哈", "凯里", "乌兰察布"];
        a = a.concat(a).concat(a).concat(a).concat(a);

        this.state = {
            dataSource: [],
            ifFirst: true,
        };
        this.selectValue = this.props.defaultValue;
        this.keyWord = this.props.defaultValue;
    }

    componentDidMount() {
        if (this.keyWord) {
            this.loadDataForKeyWord(this.keyWord);
        } else {
      //      this.loadData();
        }

    }

    loadData() {
        if (this.hotDataSource) {
            this.setState({
                dataSource: this.hotDataSource
            });
            return;
        }
        let param = {};
        let success = (code, msg, json, option) => {
            log(json);
            // json||
            this.hotDataSource =[];
            this.setState({
                dataSource: this.hotDataSource
            });
        };
        let failure = (code, msg, option) => {
            //无结果
            this.hotDataSource = [];
            this.setState({
                dataSource: this.hotDataSource
            });
        };
        let api = (this.props.type === "from") ? APIGYW.manageapi_depCity_list : APIGYW.manageapi_arrCity_list;
        HttpTool.request(HttpTool.typeEnum.POST, api, success, failure, param);
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
        HttpTool.request(HttpTool.typeEnum.POST, APIGYW.cities_list_key, success, failure, param);
    }

    handleSearch(value) {
        let arr = [];
        for (let i = 0; i < 100; i++) {
            arr.push("i" + i);
        }
        this.setState({
            dataSource: arr
        });
    }

    formatValue(value) {

        return this.state.dataSource[value];
    }

    onSelect(value, option) {
        this.selectValue = this.formatValue(value);
        this.keyWord = this.formatValue(value);
        this.onChangeValue();
    }
    onChangeValue(){
        const onChangeValue = this.props.onChangeValue;
        if (onChangeValue) {
            onChangeValue(this.selectValue);
        }
    }

    getValue() {
        console.log(this.selectValue);
        return this.selectValue;
    }

    renderTitle(title) {
        return (
            <span>
             {title}
                <a
                    style={{float: "right"}}
                    href="https://www.google.com/search?q=antd"
                    target="_blank"
                    rel="noopener noreferrer"
                >更多
      </a>
    </span>
        );
    }

    getOptions(dataSource) {
        if (!dataSource || this.state.ifFirst) {
            return [];
        }
        let hasValue = this.keyWord;
        let noData = dataSource.length< 1;


        let getHotHead = (view)=>{
            return (
                <Option disabled key="all0" className="show-all">
                    <div className={less.drop}>
                        <div className={less.dropHeadLineLayout}>
                            <div className={less.dropHeadLine}/>
                        </div>
                        <div className={less.dropHead}>
                            热门推荐
                        </div>
                    </div>
                    {view}
                </Option>
            );
        };

        // if(noData){
        //     if (hasValue) {
        //         return [
        //             <Option disabled key="all1" className="show-all">
        //                 <div className={less.errorMessage}>
        //                     对不起,暂不支持该地点
        //                 </div>
        //             </Option>
        //         ];
        //     } else {
        //         return [getHotHead(
        //             <div className={less.errorMessage}>
        //                 暂无热门城市
        //             </div>
        //         )];
        //     }
        // }
        let result = dataSource.map((obj, index) => {
            return <Option className={this.keyWord ? null : less.dropItemFloat} key={index}>{obj}</Option>;
        });

        if (hasValue) {
            return result;
        }
        //  else {
        //     return [getHotHead()].concat(result);
        // }

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
            <div className="certain-category-search-wrapper" style={{width: "100%"}}>
                <AutoComplete
                    {...props}
                    children={<Input maxLength={30} />}
                    dropdownMatchSelectWidth={false}
                    dropdownStyle={{width: "220px"}}
                    size="large"
                    style={{width: "230px"}}
                    dataSource={this.getOptions(this.state.dataSource)}
                    onSelect={this.onSelect.bind(this)}
                    onFocus={() => {
                        this.changeFirstState();
                    }}
                    onSearch={(value) => {
                        this.keyWord = value;
                        this.selectValue = value;
                        this.onChangeValue();
                        log("==========");
                        log(value);
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
                             //           this.loadData();
                                    }
                                },time);
                            }
                        }else{
                            //热门
                 //           this.loadData();
                        }

                        this.tempTime = new Date().getTime();
                    }}


                >
                </AutoComplete>
            </div>
        );
    }

    // render22() {
    //     return <AutoComplete
    //         ref="com"
    //         style={{height:36}}
    //         dataSource={this.state.dataSource}
    //         className={less.input}
    //         onSelect={this.onSelect.bind(this)}
    //         onChange={(value) => {
    //             this.selectValue = this.formatValue(value);
    //         }}
    //         onSearch={this.handleSearch.bind(this)}
    //         {...this.props}
    //     />;

    // }
}

module.exports = InputAuto;