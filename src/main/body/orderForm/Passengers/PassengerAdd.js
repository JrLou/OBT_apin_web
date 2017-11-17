/**
 * Created by louxudong on 2017/11/7.
 */

import React, {Component} from 'react';
import css from './PassengerAdd.less';
import { HttpTool } from '../../../../../lib/utils/index.js';
import APILXD from "../../../../api/APILXD.js";
import {removeSpace} from '../../tool/LXDHelp.js';
import moment from 'moment';
import {Input,Radio,Modal,DatePicker,Select,Button,message,Spin} from 'antd';
const RadioGroup = Radio.Group;
const Option = Select.Option;

class PassengerAdd extends Component{
    constructor(props) {
        super(props);
        this.state = {
            lineType:this.props.lineType?this.props.lineType:1,  //1:国内  2：国际
            credType:this.props.lineType?this.props.lineType:1,     //证件类型
            visible:false,  //模态框显示
            loading:false,   //是否处于加载中

            testState:{
                name:{state:true,msg:`请输入姓名`},
                nation:{state:true,msg:'请输入国籍'},
                birthday:{state:true,msg:'请选择出生日期'},
                credNumber:{state:true,msg:'请输入正确的证件号码'},
                expireTime:{state:true,msg:'请选择证件有效期'},
                issuePlace:{state:true,msg:'请输入签发地'},
            },
            data:{
                name:'',
                gender:1,
            }
        };

        //订单Id
        this.orderId = this.props.orderId?this.props.orderId:'';

        if(this.props.getFunction){
            this.props.getFunction(this.changeVisible.bind(this));
        }
    }

    componentDidMount(){

    }

    componentWillReceiveProps(nextProps){
        let defaultData = nextProps.defaultData;
        let newData = {};
        if(defaultData){
            //修改
            newData.name = defaultData.name?defaultData.name:'';
            newData.gender = (defaultData.gender==0)?0:1;
            newData.nation = defaultData.nation?defaultData.nation:'';
            newData.birthday = defaultData.birthday?defaultData.birthday:null;
            newData.credType = defaultData.credType?defaultData.credType:1;
            newData.credNumber = defaultData.credNumber?defaultData.credNumber:'';
            newData.expireTime = defaultData.expireTime?defaultData.expireTime:null;
            newData.issuePlace = defaultData.issuePlace?defaultData.issuePlace:'';
            newData.id = defaultData.id?defaultData.id:'';
        }else{
            //新增
            newData.gender = 1;
            newData.credType = nextProps.lineType?nextProps.lineType:1;
        }
        this.setState({
            data:newData,
            credType:newData.credType,
            testState:{
                name:{state:true,msg:`请输入姓名`},
                nation:{state:true,msg:'请输入国籍'},
                birthday:{state:true,msg:'请选择出生日期'},
                credNumber:{state:true,msg:'请输入正确的证件号码'},
                expireTime:{state:true,msg:'请选择证件有效期'},
                issuePlace:{state:true,msg:'请输入签发地'},
            },
        });
    }

    /**
     * 获取标题
     * @param title
     * @returns {XML}
     */
    getItemTitle(title){
        return(
            <div className={css.itemTitle}>
                <span style={{color:'#f2502f'}}>*</span>
                {title}
            </div>
        );
    }

    /**
     * 获得姓名输入框
     * @returns {XML}
     */
    getNameInput(){
        return(
          <div>
              {this.getItemTitle('姓名：')}
              <Input
                  value={this.state.data.name}
                  placeholder={'请与证件姓名保持一致'}
                  onChange={(e)=>{
                      let val = e.target.value;
                      let reg = /^[a-zA-Z\u4e00-\u9fa5 .]{0,20}$/;
                      if(reg.test(val)){
                          this.setData('name',val);
                      }
                  }}
                  onBlur={(e)=>{
                      let value = e.target.value;
                      let result = !(!value||value.trim()=='');
                      this.setData('name',removeSpace(value));
                      this.setTestState('name',{state:result,msg:'请输入姓名'});
                  }}
              />
              <div className={this.state.testState.name.state?css.hideMsg:css.errorMsg}>
                  {this.state.testState.name.msg}
              </div>
          </div>
        );
    }

    /**
     * 获得性别选项
     * @returns {XML}
     */
    getGenderSel(){
        return(
            <div>
                {this.getItemTitle('性别：')}
                <RadioGroup
                    value={this.state.data.gender}
                    onChange={(e)=>{
                        let val = e.target.value;
                        this.setData('gender',val);
                    }}
                >
                    <Radio value={1}>男</Radio>
                    <Radio value={0}>女</Radio>
                </RadioGroup>
            </div>
        );
    }

    /**
     * 获得国籍输入框
     * @returns {XML}
     */
    getNationInput(){
        return(
            <div>
                {this.getItemTitle('国籍：')}
                <Input
                    value={this.state.data.nation}
                    placeholder={'请输入国籍'}
                    onChange={(e)=>{
                        let val = e.target.value;
                        let reg = /^[a-zA-Z\u4e00-\u9fa5 .]{0,20}$/;
                        if(reg.test(val)){
                            this.setData('nation',val);
                        }
                    }}
                    onBlur={(e)=>{
                        let value = e.target.value;
                        let result = !(!value||value.trim()=='');
                        this.setData('nation',removeSpace(value));
                        this.setTestState('nation',{state:result,msg:'请输入国籍'});
                    }}
                />
                <div className={this.state.testState.nation.state?css.hideMsg:css.errorMsg}>
                    {this.state.testState.nation.msg}
                </div>
            </div>
        );
    }

    /**
     * 获取日期选择框
     */
    getBirthDate(){
        // log(this.state.data.bitrh);
        return(
            <div>
                {this.getItemTitle('出生日期：')}
                <DatePicker
                    style={{width:'100%'}}
                    placeholder={'例：1990-01-01'}
                    format={'YYYY-MM-DD'}
                    value={this.state.data.birthday?moment(this.state.data.birthday, 'YYYY-MM-DD'):null}
                    disabledDate={this.disabledTimeForBirth.bind(this)}
                    onChange={(date,dateString)=>{
                        this.setData('birthday',dateString);
                    }}
                />
                <div className={this.state.testState.birthday.state?css.hideMsg:css.errorMsg}>
                    {this.state.testState.birthday.msg}
                </div>
            </div>
        );
    }

    //获得证件类型选择
    getCredType(){
        return(
            <div>
                {this.getItemTitle('证件类型：')}
                <Select
                    style={{width:'100%'}}
                    value={''+this.state.data.credType}
                    onChange={(value)=>{
                        this.setState({
                            credType:value,
                        });
                        this.setData('credType',value);
                    }}
                >
                    <Option value="1">身份证</Option>
                    <Option value="2">护照</Option>
                    <Option value="3">港澳通行证</Option>
                    <Option value="4">台胞证</Option>
                </Select>
            </div>
        );
    }

    //获得证件号码
    getCredNum(isSimple){
        return(
            <div>
                {this.getItemTitle('证件号码：')}
                <Input
                    placeholder={'证件号码'}
                    value={this.state.data.credNumber}
                    onChange={(e)=>{
                        let value = e.target.value;
                        let regIDCard = /^[0-9Xx]{0,40}$/;
                        let regOther = /^[0-9a-zA-Z\<\>\-\/\－\－]{0,40}$/;
                        let reg = isSimple?regIDCard:regOther;
                        if(reg.test(value)){
                            this.setData('credNumber',value);
                        }
                    }}
                    onBlur={(e)=>{
                        let value = e.target.value;
                        let regIDCard = /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$)/;
                        let regOther = /^[0-9a-zA-Z\<\>\-\/\－\－]{0,40}$/;
                        let reg = isSimple?regIDCard:regOther;
                        this.setTestState('credNumber',{state:reg.test(value),msg:'请输入正确的证件号'});
                    }}
                />
                <div className={this.state.testState.credNumber.state?css.hideMsg:css.errorMsg}>
                    {this.state.testState.credNumber.msg}
                </div>
            </div>
        );
    }

    //获得有效期
    getExpireTime(){
        return(
            <div>
                {this.getItemTitle('证件有效期：')}
                <DatePicker
                    style={{width:'100%'}}
                    placeholder={'请输入证件有效期'}
                    format={'YYYY-MM-DD'}
                    value={this.state.data.expireTime?moment(this.state.data.expireTime, 'YYYY-MM-DD'):null}
                    disabledDate={this.disabledTimeForExpire.bind(this)}
                    onChange={(date,dateString)=>{
                        this.setData('expireTime',dateString);
                    }}
                />
                <div className={this.state.testState.expireTime.state?css.hideMsg:css.errorMsg}>
                    {this.state.testState.expireTime.msg}
                </div>
            </div>
        );
    }

    //获得签发地址
    getIssuePlace(){
        return(
            <div>
                {this.getItemTitle('签发地：')}
                <Input
                    value={this.state.data.issuePlace}
                    placeholder={'请输入签发地'}
                    onChange={(e)=>{
                        let val = e.target.value;
                        let reg = /^[a-zA-Z\u4e00-\u9fa5 .]{0,20}$/;
                        if(reg.test(val)){
                            this.setData('issuePlace',val);
                        }
                    }}
                    onBlur={(e)=>{
                        let value = e.target.value;
                        let result = !(!value||value.trim()=='');
                        this.setData('issuePlace',removeSpace(value));
                        this.setTestState('issuePlace',{state:result,msg:'请输入签发地'});
                    }}
                />
                <div className={this.state.testState.issuePlace.state?css.hideMsg:css.errorMsg}>
                    {this.state.testState.issuePlace.msg}
                </div>
            </div>
        );
    }

    //更改状态机中的data
    setData(field,value){
        let newData = this.state.data;
        newData[field] = value;
        this.setState({
            data:newData,
        });
    }

    //更改状态机中的testState
    setTestState(field,obj){
        let newTestState = this.state.testState;
        newTestState[field] = obj;
        this.setState({
           testState:newTestState,
        });
    }

    //默认不可选的日期(证件有效期)
    disabledTimeForExpire(date){
        if(!date){
            return true;
        }
        let nowDate = new Date();
        return (date.valueOf()<=nowDate.valueOf()-86400000);
    }
    //默认不可选的日期(生日)
    disabledTimeForBirth(date){
        if(!date){
            return true;
        }
        let earlistDate = new Date(1900,0,1);
        let nowDate = new Date();
        return (date.valueOf()<=earlistDate.valueOf()-86400000||date.valueOf()>=nowDate.valueOf());
    }

    render(){
        // log(this.props.defaultData);
        let defaultData = this.props.defaultData;
        let isSimple = (this.state.credType==1)?true:false;     //是否使用身份证
        let isAdd = (defaultData?false:true);                   //false:编辑   true:新增
        let itemStyle = isSimple?css.hiddenItem:css.contentItem;
        return(
            <Modal
                width={600}
                visible={this.state.visible}
                footer={null}
                maskClosable={false}
                closable={true}
                onCancel={()=>{
                        this.changeVisible(false);
                    }
                }
            >
                <Spin
                    spinning={this.state.loading}
                    size={'large'}
                >
                    <div className={css.modBody}>
                        <div className={css.modTitle}>{isAdd?'新增乘机人':'修改乘机人'}</div>
                        <div className={css.modContent}>
                            <div className={isSimple?css.contentOneLine:css.contentItem}>
                                {this.getNameInput()}
                            </div>
                            <div className={itemStyle}>
                                {this.getGenderSel()}
                            </div>
                            <div className={itemStyle}>
                                {this.getNationInput()}
                            </div>
                            <div className={itemStyle}>
                                {this.getBirthDate()}
                            </div>
                            <div className={css.contentItem}>
                                {this.getCredType()}
                            </div>
                            <div className={css.contentItem}>
                                {this.getCredNum(isSimple)}
                            </div>
                            <div className={itemStyle}>
                                {this.getExpireTime()}
                            </div>
                            <div className={itemStyle}>
                                {this.getIssuePlace()}
                            </div>
                        </div>
                        <div className={css.modFooter}>
                            <Button
                                type={'primary'}
                                onClick={()=>{
                                    this.clickSubmitBtn(isAdd);
                                }}
                            >
                                {isAdd?'确认新增':'确认修改'}
                            </Button>
                        </div>
                    </div>
                </Spin>
            </Modal>
        );
    }

    /**
     * 改变模态框显示状态
     * @param value
     */
    changeVisible(value){
        this.setState({
           visible:!!value,
        });
        if(!value){
            if(this.props.closeModCB){
                //关闭模态框的回调（用于提示父组件将默认选择的乘机人信息置为null）
                this.props.closeModCB();
            }
        }
    }

    /**
     * 更改请求数据的状态并回调
     * @param loading
     * @param cb
     */
    setLoading(loading, cb) {
        this.setState({
            loading: loading
        }, cb);
    }

    /**
     * 返回加载的状态
     * @returns {boolean}
     */
    isLoading() {
        return this.state.loading;
    }

    /**
     * 检验表单数据
     * @returns {boolean}
     */
    checkMsg(){
        //验证状态为true，且值存在，才能通过
        //目前，其他输入框只要有值，都是已经通过正则验证的，仅对证件号码做一次检验
        let requireData = this.state.data;
        let testMsg = this.state.testState;
        let checkedState = false;
        if(this.state.credType==1){
            //身份证类型
            if(requireData.name&&requireData.credNumber&&testMsg.credNumber.state){
                checkedState = true;
            }
            //对必填对输入项做验证
            if(!requireData.name){
                this.setTestState('name',{state:false,msg:'请输入姓名'});
            }
            if(!requireData.credNumber){
                this.setTestState('credNumber',{state:false,msg:'请输入证件号'});
            }
        }else{
            //其它类型
            if(requireData.name&&requireData.nation&&requireData.birthday&&requireData.credNumber&&requireData.expireTime&&requireData.issuePlace&&testMsg.credNumber.state){
                checkedState = true;
            }
            //对必填对输入项做验证
            if(!requireData.name){
                this.setTestState('name',{state:false,msg:'请输入姓名'});
            }
            if(!requireData.credNumber){
                this.setTestState('credNumber',{state:false,msg:'请输入证件号'});
            }
            if(!requireData.nation){
                this.setTestState('nation',{state:false,msg:'请输入国籍'});
            }
            if(!requireData.birthday){
                this.setTestState('birthday',{state:false,msg:'请输入出生日期'});
            }
            if(!requireData.expireTime){
                this.setTestState('expireTime',{state:false,msg:'请输入证件有效期'});
            }
            if(!requireData.issuePlace){
                this.setTestState('issuePlace',{state:false,msg:'请输入签发地'});
            }
        }
        return checkedState;
    }

    /**
     * 点击提交按钮
     */
    clickSubmitBtn(isAdd){
        //先验证信息
        let result = this.checkMsg();
        if(!result){
            //验证失败
            message.warning('请先完善表单信息');
        }else{
            //验证通过
            this.submitMsg(isAdd);
        }
    }

    /**
     * 提交信息
     * @param isAdd
     */
    submitMsg(isAdd) {
        let newData = this.state.data;
        let parames = {};
        if(newData.credType == 1){
            parames = {
                orderId:this.orderId,
                id:newData.id,
                name:newData.name,
                credType:newData.credType,
                credNumber:newData.credNumber,
            };
        }else{
            parames = newData;
            parames.orderId = this.orderId;
        }
        let requestAPI = isAdd?APILXD.addPassenger:APILXD.upDataPassenger;
        let successCB = (code, msg, json, option) => {
            this.setLoading(false);
            message.success(isAdd?'添加成功':'修改成功');
            this.changeVisible(false);
            if(this.props.changeSuccCB){
                this.props.changeSuccCB(json);
            }
        };
        let failureCB = (code, msg, option) => {
            this.setLoading(false);
            message.error(msg);
        };

        this.setLoading(true,()=>{
            HttpTool.request(HttpTool.typeEnum.POST,requestAPI, successCB, failureCB, parames,
                {
                    ipKey: "hlIP", 
                });
        });
    }
}

PassengerAdd.contextTypes = {
    router: React.PropTypes.object
};
module.exports = PassengerAdd;