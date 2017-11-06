import React, { Component } from 'react';
import { Form, DatePicker, TimePicker, Button, Input, Row, Col, Radio ,AutoComplete} from 'antd';
import AutoInput from "../component/InputAuto";
import less from './PublishMsg.less';
const dateFormat = 'YYYY-MM-DD';
const FormItem = Form.Item;
const MonthPicker = DatePicker.MonthPicker;
const RangePicker = DatePicker.RangePicker;
const RadioGroup = Radio.Group;

class page extends Component {
    constructor(props) {
        super(props);
        this.state = {
            lineType: 1,
            lineNum: 1,
            adultNum: "",
            childNum: "",
        };
    }

    //提交
    check() {
        //  e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
            }
        });
    }
    //航线选择
    lineTypeonChange(e) {
        console.log("==========================================");
        console.log(e);
        console.log("==========================================");
        this.setState({
            lineType: e.target.value
        });
    }

    lineDel() {
        let { lineNum } = this.state;
        lineNum = lineNum - 1;
        this.setState({
            lineNum
        });
        this.lineDetails();
    }

    lineAdd() {
        let { lineNum } = this.state;
        console.log(lineNum);
        lineNum = lineNum + 1;
        this.setState({
            lineNum
        });
        this.lineDetails();
    }

    //航线信息
    lineDetails() {
        let { lineNum } = this.state;
        const { getFieldDecorator } = this.props.form;
        let div = [];
        for (let i = 0; i < lineNum; i++) {
            div.push(
                <div key={i}>
                    <Row style={{ marginBottom: 8 }}>
                        <Col span={10} >
                            <span>行程{i + 1}</span>
                        </Col>
                    </Row>
                    <Row style={{ marginBottom: 8 }}>
                        <Col span={10} >出发城市：</Col>
                        <Col span={10} offset={3}>目的城市：</Col>
                    </Row>
                    <Row >
                        <Col span={10} >
                        
                            <FormItem >
                                {getFieldDecorator('fromCity' + i, {
                                    rules: [{
                                        required: true,
                                        message: '请输入城市名称',
                                    }],
                                })(
                                    // <Input style={{ width: 240, height: 34 }} placeholder="城市名称" />
                                    <AutoInput
                                    type={"from"}
                                    placeholder={'中文／拼音／三字码'}
                                  
                                />
                                    )}
                            </FormItem>
                        </Col>
                        <Col span={10} offset={3}>
                            <FormItem >
                                {getFieldDecorator('toCity' + i, {
                                    rules: [{
                                        required: true,
                                        message: '请输入城市名称',
                                    }],
                                })(
                                     //<Input style={{ width: 240, height: 34 }} placeholder="城市名称" />
                                    //<AutoInput placeholder={'中文／拼音／三字码'} max={'10'} />
                                    <AutoComplete
                                    dataSource={["aa","ccc"]}
                                    placeholder="website"
                                  >
                                  </AutoComplete>
                                    )}
                            </FormItem>
                        </Col>
                    </Row>

                    <Row style={{ marginBottom: 8 }}>
                        <Col span={10} >出发日期：</Col>
                        {this.state.lineType == 2
                            &&
                            <Col span={10} offset={3}>返回日期：</Col>
                        }
                    </Row>
                    <Row >
                        <Col span={10} >
                            <FormItem >
                                {getFieldDecorator('fromDateTime' + i, {
                                    rules: [{
                                        required: true,
                                        message: '请选择时间',
                                    }],
                                })(
                                    // <Input style={{ width: 240, height: 34 }} placeholder="yyyy-mm-dd" />
                                    <DatePicker style={{ minWidth: "200px", width: '100%' }} format='YYYY-MM-DD' />
                                    )}
                            </FormItem>
                        </Col>
                        {this.state.lineType == 2
                            &&
                            <Col span={10} offset={3}>
                                <FormItem >
                                    {getFieldDecorator('toDateTime' + i, {
                                        rules: [{
                                            required: true,
                                            message: '请选择时间',
                                        }],
                                    })(
                                        // <Input style={{ width: 240, height: 34 }} placeholder="yyyy-mm-dd" />

                                        <DatePicker style={{ minWidth: "200px", width: '100%' }} format='YYYY-MM-DD' />


                                        )}
                                </FormItem>
                            </Col>
                        }
                        {this.state.lineType == 3
                            &&
                            <Col span={10} offset={3}>
                                <Button type="primary" disabled={this.state.lineNum != (i + 1) || i == 0} onClick={() => this.lineDel()}>删除</Button>
                            </Col>
                        }
                    </Row>
                </div>
            );
        }
        return div;
    }


    render() {
        const { getFieldDecorator } = this.props.form;
        let { lineType } = this.state;
        console.log(lineType + "====");
        return (
            <div className={less.content}>
                <div style={{ paddingTop: 10, width: 520, margin: "auto" }}>

                    {/**标题*/}
                    <div>
                        <div ></div>
                        <div>需求信息</div>
                    </div>

                    <div>
                        <hr size='1' style={{ color: "#CBD3E5", borderStyle: "dotted" }}></hr>
                    </div>
                    {/**多选择*/}
                    <Row style={{ marginBottom: 8 }}>
                        <Col span={4}>航程类型：</Col>
                    </Row>
                    <Row >
                        <FormItem >
                            {getFieldDecorator('lineType', {
                                initialValue: this.state.lineType,
                            })(
                                <RadioGroup onChange={(e) => this.lineTypeonChange(e)}>
                                    <Radio value={1}>单程</Radio>
                                    <Radio value={2}>往返</Radio>
                                    <Radio value={3}>多程</Radio>
                                </RadioGroup>
                                )}
                        </FormItem>
                    </Row>


                    {/*航线+时间*/}








                    {/*测试*/}
                    {this.lineDetails()}
                    <Row style={{ marginBottom: 8 }}>
                        <Col span={4}>
                            <Button type="primary" onClick={() => this.lineAdd()}>加一程</Button>
                        </Col>
                    </Row>



                    {/**出行人数*/}
                    <Row style={{ marginBottom: 8 }}>
                        <Col span={4}>出行人数：</Col>
                    </Row>
                    <Row >
                        <Col span={10} >
                            <FormItem >
                                {getFieldDecorator('adultNum', {
                                    rules: [{
                                        required: true,
                                        message: '成人人数',
                                    }],
                                    initialValue: this.state.adultNum
                                })(
                                    <Input style={{ width: 207, height: 34 }} onChange={(e) => {
                                        this.setState({
                                            adultNum: e.target.value
                                        });
                                    }} placeholder="成人" />
                                    )}
                            </FormItem>
                        </Col>
                        <Col span={10} offset={1}>
                            <FormItem >
                                {getFieldDecorator('childNum', {
                                    rules: [{
                                        required: true,
                                        message: '儿童人数',
                                    }],
                                    initialValue: this.state.childNum
                                })(
                                    <Input style={{ width: 207, height: 34 }} onChange={(e) => {
                                        this.setState({
                                            childNum: e.target.value
                                        });
                                    }} placeholder="儿童(2～12周岁）" />
                                    )}
                            </FormItem>
                        </Col>
                        <Col span={2} offset={1}>
                            <div style={{ height: 32, lineHeight: "32px" }}>共{this.state.adultNum + this.state.childNum}人</div>
                        </Col>
                    </Row>



                    <Row style={{ marginBottom: 8 }}>
                        <Col span={4}>备注：</Col>
                    </Row>
                    <Row>
                        <Col >
                            <FormItem >
                                {getFieldDecorator('annotation', {
                                    rules: [{
                                        required: true,
                                        message: '请输入备注',
                                    }],
                                })(
                                    <Input type="textarea" style={{ height: 180 }} placeholder="如：价格、时间等" />
                                    )}
                            </FormItem>

                        </Col>
                    </Row>



                    <Row style={{ marginBottom: 8 }}>
                        <Col span={4}>联系电话：</Col>
                    </Row>
                    <Row>
                        <Col >
                            <FormItem>
                                {getFieldDecorator('phone', {
                                    rules: [{
                                        required: true,
                                        message: '请输入联系电话',
                                    }],
                                })(
                                    <div style={{ width: "100%" }}>
                                        <Input style={{ width: 240, height: 36 }} placeholder="输入可联系的手机号码" />
                                    </div>
                                    )}
                            </FormItem>

                        </Col>
                    </Row>





                    <Button type="primary" onClick={() => this.check()}>Check</Button>
                </div>
            </div >
        );
    }
}

const publishMsg = Form.create()(page);
page.contextTypes = {
    router: React.PropTypes.object
};
module.exports = publishMsg;

