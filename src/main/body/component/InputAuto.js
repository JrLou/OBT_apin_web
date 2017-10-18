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
        let a = ["安娜", "阿尔巴哈", "凯里", "乌兰察布"];
        a = a.concat(a).concat(a).concat(a).concat(a);

        this.state = {
            dataSource: [],

        };
        this.selectValue = this.props.defaultValue;
        this.keyWord = this.props.defaultValue;
    }

    componentDidMount() {
        if(this.keyWord){
            this.loadDataForKeyWord(this.keyWord);
        }else{
            this.loadData();
        }

    }

    loadData() {
        if(this.hotDataSource){
            this.setState({
                dataSource:this.hotDataSource
            });
            return;
        }
        let param = {};
        let success = (code, msg, json, option) => {
            log(json);
            this.hotDataSource = json;
            this.setState({
                dataSource:this.hotDataSource
            });
        };
        let failure = (code, msg, option) => {
            //无结果
            this.hotDataSource = [];
            this.setState({
                dataSource:this.hotDataSource
            });
        };
        let api = this.props.type==="from"?"/os/hotcityapi/v1.0/depCity/list":"/os/hotcityapi/v1.0/arrCity/list";
        HttpTool.request(HttpTool.typeEnum.POST, api, success, failure, param,
            {
                ipKey: "hlIP"
            });
    }

    loadDataForKeyWord(keyWord) {
        let param = {
            str:keyWord
        };
        let success = (code, msg, json, option) => {
            log(json);
            this.setState({
                dataSource:json
            });
        };
        let failure = (code, msg, option) => {
            //无结果
            this.setState({
                dataSource:[]
            });
        };
        HttpTool.request(HttpTool.typeEnum.POST, "/ba/baseapi/v1.0/cities/list/key", success, failure, param,
            {
                ipKey: "hlIP"
            });
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

    formatValue(value){

        return this.state.dataSource[value];
    }
    onSelect(value, option) {
        this.selectValue = this.formatValue(value);
        this.keyWord = this.formatValue(value);
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
        if(!dataSource){
            return [];
        }
        let head = <Option disabled key="all" className="show-all">
            <div className={less.drop}>
                <div className={less.dropHeadLineLayout}>
                    <div className={less.dropHeadLine}/>
                </div>
                <div className={less.dropHead}>
                    热门推荐
                </div>
            </div>
            {dataSource.length<1?(   <div className={less.errorMessage}>
                无热门城市
            </div>):null}
        </Option>;

                let result =dataSource.length<1?(
                    [
                        <Option disabled key="all" className="show-all">
                            <div className={less.errorMessage}>
                                对不起,暂不支持该地点
                            </div>
                        </Option>
                    ]
                ): dataSource.map((obj, index) => {
                    return <Option className={this.keyWord?null:less.dropItemFloat} key={index}>{obj}</Option>;
                });
                if(this.keyWord){
                    return result;
                }else{
                    return [head].concat(result);
                }

    }


    render() {
        return (
            <div className="certain-category-search-wrapper" style={{width: 250}}>
                <AutoComplete
                    {...this.props}
                    dropdownMatchSelectWidth={false}
                    dropdownStyle={{width: 300}}
                    size="large"
                    style={{width: "100%"}}
                    dataSource={this.getOptions(this.state.dataSource)}
                    onSelect={this.onSelect.bind(this)}
                    onSearch={(value)=>{
                        this.keyWord = value;
                        this.selectValue = value;

                        //防止连续快速搜索，请求接口
                        let time = new Date().getTime();
                        if(time-this.timeTemp<300){
                            return;
                        }
                        this.timeTemp =time;

                        this.setState({
                            dataSource:[]
                        },()=>{
                            if(this.keyWord){
                                this.loadDataForKeyWord(this.keyWord);
                            }else{
                                this.loadData();
                            }
                        });

                    }}


                >
                </AutoComplete>
            </div>
        );
    }

    render22() {
        return <AutoComplete
            ref="com"
            dataSource={this.state.dataSource}
            className={less.input}
            onSelect={this.onSelect.bind(this)}
            onChange={(value) => {
                this.selectValue = this.formatValue(value);
            }}
            onSearch={this.handleSearch.bind(this)}
            {...this.props}
        />;

    }
}

module.exports = InputAuto;