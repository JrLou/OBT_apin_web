import React, {Component} from 'react';
import {Table, Button, Radio, Icon,Form, Input} from 'antd';
import Base from './Base.js';
import DataAction from './DataAction.js';
const ButtonGroup = Button.Group;
const FormItem = Form.Item;


/**
 * data:[{title:"123",data:[data:[]]}]
 * onSelectRow(obj) obj:选择的行的对像
 */
class TableCom extends Component {

    /**
     *
     * @param props
     */
    constructor(props) {
        super(props);
        this.base = new Base(this);
        this.state = this.base.getDefaultState();
        this.state.selectedRowKeys = [];
        this.pageCount = 30;
        this.pageSize = 3;
        this.pageIndex = 1;


    }

    componentDidMount() {
        console.log("好了:" + this.props.com)
        this.base.componentDidMount();
    }

    render() {
        this.dataAction = new DataAction();
        return this.base.render();
    }

    addData(){

    }




    editData(){
        let data = this.verAction();
        if(!data){
            return;
        }

        this.dataAction.editData(data,this.props.table.columns,()=>{
            //编辑成功
            this.refresh();
        });
    }
    refresh(){
        this.pageIndex = 1;
        this.state.selectedRowKeys = [];
        this.base.refreshLoad();
    }
    verAction(){
        if(!this.state.selectedRowKeys||this.state.selectedRowKeys.length<1){
            this.base.message.warn("请选择一条数据进行操作");
            return undefined;
        }else{
            return this.state.net.data[this.state.selectedRowKeys[0]];
        }
    }
    delData(){
        let data = this.verAction();
        if(!data){
            return;
        }


        let del = (cb)=>{
            setTimeout(()=>{
                cb(Math.random()>0.6?1:-1,"删除失败");
            },Math.random()*1000)
        }

         this.base.Modal.confirm({
            title:"是否删除",
            cancelText:"给朕退下",
            okText:"拖下去斩了",
            okType:"danger",
            content:this.base.getJsonView(data),
            iconType:"delete",
            maskClosable:true,
            onCancel:()=>{
                return false;
            },
            onOk:()=>{
                return new Promise((resolve, reject) => {
                    del((code,msg)=>{
                        if(code<0){
                            this.base.message.error(msg);
                        }else{
                            this.refresh();
                        }
                        resolve();
                    })

                }).catch(() => console.log('Oops errors!'));
                //删除成功,再关闭
            }
        })
    }

    getPowerMap() {
        let map = new Map()
        map.set("e", <Button key={"e"} type="primary" icon="plus" onClick={()=>{this.addData()}}>新增</Button>);
        map.set("a", <Button key={"a"} type="primary" icon="edit" onClick={()=>{this.editData()}}>编辑</Button>);
        map.set("d", <Button key={"d"} type="danger" icon="delete" onClick={()=>{this.delData()}}>删除</Button>);
        // map.set("s",);
        return map;
    }

    getSelectView(){
        let keys = this.state.net.power.key.split("|");
        //包含删除/添加,显示选择
        let select = keys.find((value)=>{
                return value==="e"||value==="d";
        })
        console.log("a1:"+select)
        return !!select;
    }
    getPowerMapView() {
        //r|e|a|s|d
        let keys = this.state.net.power.key.split("|");
        //添加对应的权限
        let powerS = this.getPowerMap();
        let viewArr = [];
        for (let key of keys) {
            if (powerS.has(key)) {
                viewArr.push(powerS.get(key))
            }
        }
        return viewArr;
    }

    renderBase() {
        //得到头显示

        this.state.net.power.key = "a|d";
        console.log()
        //添加唯一KEY
        if(this.state.net.data.length>0&&!this.state.net.data[0].UNIQUEKEY){
            this.state.net.data.forEach((value, index, array) => {
                value.UNIQUEKEY = index;
            })
        }

        let powerView = this.getPowerMapView();
        return <Table
            bordered={true}
            title={powerView && powerView.length > 0 ? () => {
                return (
                    <ButtonGroup>
                        {powerView}
                    </ButtonGroup>
                );
            } : null
            }
            footer={() => '描述表'}
            pagination={{
                total: this.pageCount,
                pageSize: this.pageSize,
                defaultCurrent: this.pageIndex,
            }}
            rowKey={"UNIQUEKEY"}
            {...this.props.table}
            dataSource={this.state.net.data}
            rowSelection={
                this.getSelectView()?
                {
                    selectedRowKeys: this.state.selectedRowKeys,
                    type: "radio",
                    onChange: (selectedRowKeys) => {
                        console.log('selectedRowKeys changed: ', selectedRowKeys);
                        this.setState({
                            selectedRowKeys
                        });
                    }
                }:null
            }
            // onRowClick={(record, index, event) => {
            //     console.log('record: ', record);
            //     console.log('index: ', index);
            //     console.log('event: ', event);
            // }}
            onChange={(pagination, filters, sorter) => {
                this.pageIndex = pagination.current;
                // console.log(pagination)
                // console.log(filters)
                // console.log(sorter)
                //排序
                // sorter.field
                // order.order
                // this.base.refreshLoad();
            }}
        />
    }


}

module.exports = TableCom;