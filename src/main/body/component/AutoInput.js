/**
 * Created by Administrator on 2017\10\13 0013.
 */
import React, {Component} from 'react';
import css from './AutoInput.less';

class AutoInput extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value:props.defaultValue||"",
            inputFocused:false,
            upData:0,
        };

        //默认数据的查询接口地址
        this.defaultDataApi = this.props.getDefaultDataApi?this.props.getDefaultDataApi:'';
        //模糊匹配数据的查询接口地址
        this.searchDataApi = this.props.getSearchDataApi?this.props.getSearchDataApi:'';

        //默认的下拉数据
        this.defaultSource = [];

        //查询得到的下拉数据
        this.searchSource = [];

    }

    componentDidMount() {
        this.loadData(1);
    }

    /**
     * 手动更改状态机，触发刷新页面
     */
    upView(){
        this.setState({
            upData:this.state.upData+1
        });
    }

    /**
     * 输入框获取/失去 焦点 触发
     * @param boolen    true/false
     */
    changeFocus(boolen){
        setTimeout(()=>{
            this.setState({
                inputFocused:boolen
            });
        },200);

    }

    /**
     * 输入框内容改变，将值保存在状态机，查询模糊匹配数据
     * @param e
     */
    valueChange(e){
        if(e&&e.target) {
            let value = e.target.value.trim();
            this.setState({
                value: value,
            });
            //模糊匹配
            this.loadData(2,value);
        }
    }
    getValue(){
        return this.state.value;
    }

    /**
     * 绘制默认下拉视图
     * @returns {XML}
     */
    getDefaultOptions(data){
        if(!data||!(data instanceof Array)){
            return;
        }
        if(data.length<1){
            return(
                <div>数据加载中...</div>
            );
        }
        return(
            data.map((group,key) => (
                    this.getCityBox(group,key)
                )
            )
        );
    }

    /**
     * 绘制一组标签城市
     * @param group
     * @returns {XML}
     */
    getCityBox(group,key){
        if(!group){
            return;
        }
        return(
            <div
                key={'group'+key}
                className={css.groupBox}
            >
                <div className={css.groupTitle}>{group.title}</div>
                <div>
                    {
                        this.defaultCityList(group.children)
                    }
                </div>
            </div>
        );
    }

    /**
     * 绘制城市标签
     * @param data
     * @returns {Array}
     */
    defaultCityList(data){
        let list = [];
        data.map((obj,key) =>{(
            list.push(
                <div
                    key={'city'+key}
                    className={css.cityItem}
                    onClick={(e)=>{this.selectOption(e);}}
                    value={obj.cityName+' ( '+obj.idata+' ) '}
                >
                    {obj.cityName}
                </div>
            )
        );});
        return list;
    }

    /**
     * 绘制搜索下拉视图
     * @returns {XML}
     */
    getSearchOptions(data){
        if(!data||!(data instanceof Array)){
            return;
        }
        if(data.length<1){
            return(
                <div>未匹配到相关城市</div>
            );
        }
        return(
            data.map((item,key) => (
                    <div
                        key={'searchCity'+key}
                        className={css.searchItem}
                        onClick={(e)=>{this.selectOption(e);}}
                        value={item.cityName+' ( '+item.idata+' ) '}
                    >
                        {this.matchText(item.cityName)}
                    </div>
                )
            )
        );
    }

    /**
     * 将匹配的字符变色
     * @param txt
     * @returns {*}
     */
    matchText(txt){
        let text = txt;
        let value = this.state.value;
        let len = value.length;
        let textArray = Array.from(txt);
        let chartIndex = text.toLowerCase().indexOf(value.toLowerCase());
        if(chartIndex>=0){
            let itemView = [];
            textArray.map((chart,key)=>(
                itemView.push(
                    <span
                        key={'chart'+key}
                        className={(chartIndex<=key&&key<(chartIndex+len))?css.matchColor:''}
                    >
                    {chart}
                </span>
                )
            ));
            return itemView;
        }else{
            return text;
        }

    }


    /**
     * 用户点击选择
     * @param e
     */
    selectOption(e){
        let selOpt = e.target.getAttribute('value');
        if(selOpt){
            this.setState({
                value:selOpt
            });
            this.loadData(2,selOpt);
        }
    }

    /**
     * 从后台查询数据
     * @param searchType   1.请求默认数据    2.请求模糊匹配数据
     * @param searchValue   输入框的值，用于查询
     */
    loadData(searchType,searchValue){
        let type = searchType?searchType:2;
        let inputVal = searchValue?searchValue:'';
        if(type === 2 && inputVal && inputVal.length>0){
            let parames = {
                value:inputVal,
            };
            let successCB = (code, msg, json, option)=>{
                this.searchSource = json;
            };
            let failCB = (code, msg, option)=>{
                console.warn(msg);
            };
            // HttpTool.post(HttpTool.typeEnum.POST,this.searchDataApi,successCB,failCB,parames);

            //模拟数据
            this.searchSource = [
                {
                    cityName:'北京',
                    idata:'BJ',
                },
                {
                    cityName:'杭州',
                    idata:'HZ',
                },
                {
                    cityName:'杭州2',
                    idata:'HZ',
                },
                {
                    cityName:'杭州3',
                    idata:'HZ',
                },
                {
                    cityName:'杭州4',
                    idata:'HZ',
                },
                {
                    cityName:'杭州5',
                    idata:'HZ',
                },
                {
                    cityName:'杭州6',
                    idata:'HZ',
                },
                {
                    cityName:'杭州7',
                    idata:'HZ',
                },
                {
                    cityName:'杭州8',
                    idata:'HZ',
                },
                {
                    cityName:'杭州866666',
                    idata:'HZ',
                },
                {
                    cityName:'杭州84444',
                    idata:'HZ',
                },
                {
                    cityName:'杭州33338',
                    idata:'HZ',
                },
                {
                    cityName:'杭州228',
                    idata:'HZ',
                }
            ];
        }else if(type === 1){
            let parames = {
            };
            let successCB = (code, msg, json, option)=>{
                this.defaultSource = json;
            };
            let failCB = (code, msg, option)=>{
                console.warn(msg);
            };
            // HttpTool.post(HttpTool.typeEnum.POST,this.defaultDataApi,successCB,failCB,parames);

            //模拟数据
            this.defaultSource = [
                {
                    title: '热门城市',
                    children: [{
                        cityName: '北京',
                        idata: 'BJ',
                    }, {
                        cityName: '西安1',
                        idata: 'XA',
                    }, {
                        cityName: '西安2',
                        idata: 'XA',
                    }, {
                        cityName: '西安3',
                        idata: 'XA',
                    }, {
                        cityName: '西安4',
                        idata: 'XA',
                    }, {
                        cityName: '西安5',
                        idata: 'XA',
                    }, {
                        cityName: '西安6',
                        idata: 'XA',
                    }, {
                        cityName: '西安7',
                        idata: 'XA',
                    }, {
                        cityName: '西安8',
                        idata: 'XA',
                    }, {
                        cityName: '西安9',
                        idata: 'XA',
                    }, {
                        cityName: '西安10',
                        idata: 'XA',
                    }, {
                        cityName: '西安11',
                        idata: 'XA',
                    }, {
                        cityName: '西安12',
                        idata: 'XA',
                    }, {
                        cityName: '西安13',
                        idata: 'XA',
                    }, {
                        cityName: '西安14',
                        idata: 'XA',
                    }, {
                        cityName: '广州',
                        idata: 'GZ',
                    }],
                },
                {
                    title: 'Apin推荐',
                    children: [{
                        cityName: '杭州',
                        idata: 'HZ',
                    }, {
                        cityName: '苏州',
                        idata: 'SZ',
                    }],
                },
            ];
        }

        this.upView();
    }

    render() {
        return (
            <div className={css.container}
                 {...this.props}
            >
                <input
                    maxLength={20}
                    type="text"
                    placeholder={this.props.placeholder}
                    className={css.inputStyle}
                    value={this.state.value}
                    onChange={(e)=>{this.valueChange(e);}}
                    onFocus={()=>{this.changeFocus(true);}}
                    onBlur={()=>{this.changeFocus(false);}}

                />

                <div
                    className={this.state.inputFocused?css.optionsBox:css.close}
                >
                    {
                        this.state.value.length>0
                        ?this.getSearchOptions(this.searchSource)
                        :this.getDefaultOptions(this.defaultSource)
                    }
                </div>
            </div>
        );
    }
}

AutoInput.contextTypes = {
    router: React.PropTypes.object
};

module.exports = AutoInput;