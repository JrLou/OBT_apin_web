import React, {Component} from 'react';
import {Modal,Spin,Form,Icon,message,Input,Button} from 'antd';
const FormItem = Form.Item;
class DataAction {

    constructor(props){
    }
    /**
     * 得到添加/编辑数据模板
     */
    getAddDataView(data,columns ,collectData){
        //如果是自定义,转换到自定义

        if(!columns){
            return <div>无字段,不可添加</div>;
        }


        let FormListView = Form.create({})(FormList);
        return <div>
            <FormListView
                ref={(ref)=>{
                    this.formListView = ref;
                }}
                data={data} columns={columns} collectData={collectData}/>

        </div>
    }

    editData(data,columns,cb){
        let exe = (cb)=>{
            setTimeout(()=>{
                cb(Math.random()>0.6?1:-1,"编辑失败");
            },Math.random()*1000)
        }

        let collectData = {};
        let view = this.getAddDataView(data,columns,collectData);
        let ref =  Modal.confirm({
            title:"编辑数据",
            cancelText:"给朕退下",
            okText:"传旨吧",
            okType:"danger",
            content:view,
            iconType:"edit",
            width:document.body.clientWidth*0.8,
            footer:null,
            closable:true,
            maskClosable:true,
            onCancel:()=>{
                return false;
            },
            onOk:()=>{

                let formList = collectData.getFormList();
                if(formList.state.loading){
                    //正在加载,等待加载
                    message.warn("正在为您提交,请耐心等待^_^")
                    return;
                }
                //第一步:收集数据(包含验证)
                let form = formList.props.form;

                form.validateFields((err, values) => {
                    if (!err) {
                        console.log('form: ', values);
                        formList.setState({
                            loading:true
                        },()=>{
                            //第二步:提交数据
                            exe((code,msg)=>{
                                if(code<0){
                                    formList.setState({
                                        loading:false
                                    },()=>message.error(msg));
                                }else{
                                    //提交完成,关闭
                                    cb();
                                    ref.destroy();
                                }
                            })
                        });
                    }
                });


                return true;
            }
        })
    }
}

class FormList extends Component{
    constructor(props){
        super(props)
        console.log(this.props)
        this.state = {
            loading:false,
        }
        this.props.collectData.getFormList = ()=>{
            return this;
        }
    }

    render(){
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 5 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 12 },
            },
        };
        let {data,columns} = this.props;
        const { getFieldDecorator } = this.props.form;


        return (
            <Spin
                spinning={this.state.loading}
                tip="提交中..."
            >
            <Form
                style={{height:document.body.clientHeight*0.4,overflow:"auto"}}
                onSubmit={(e) => {
                    console.log("==")
                    e.preventDefault();
                    this.props.form.validateFields((err, values) => {
                        if (!err) {
                            console.log('Received values of form: ', values);
                        }
                    });
                    // this.props.form.getFieldsValue(([fieldNames])=>{
                    //
                    //     console.log(fieldNames)
                    // })
                }}
            >

                {
                    columns.map((obj,index)=>{
                        return (
                            <FormItem
                                {...formItemLayout}
                                key={index}
                                label={obj.title}
                            >
                                {getFieldDecorator(obj.dataIndex, {
                                    rules: [{ required: false, message: "请输入"+obj.title }],
                                    initialValue:data[obj.dataIndex],
                                })(
                                    <Input placeholder={"请输入"+obj.title} id="error" />
                                )}

                            </FormItem>
                        );
                    })
                }
            </Form>
            </Spin>
        );
    }
}
module.exports = DataAction;