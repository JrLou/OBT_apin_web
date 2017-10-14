/**
 * Created by lixifeng on 17/10/12.
 */
import React, {Component} from 'react';
import {AutoComplete} from 'antd';
import css from './index.less';
/**
 * //精品特价航线view
 */
class RecommendView extends Component {

    constructor(props) {
        super(props)
        this.state = {
            dataSource: [],
        }
    }

    componentDidMount() {

    }

    render() {

        let {data,template} = this.props;

        if (!data)return null;
        return (
            <div
                className={css.cell}
                {...this.props}
            >
                <div className={css.border}>
                    <div
                        className={css.content}
                        style={{
                            backgroundImage: "url(" + data.image + ")"
                        }}
                    >
                        {
                            this.getImageBottom(data,template)
                        }
                        <div className={css.tag}>
                            {data.tag}
                        </div>
                    </div>
                    {
                        this.getBottom(data,template)
                    }

                </div>

            </div>
        )
    }


    getCountShow(data,template)
    {
        if(template==1){
            return (
                <div className={css.bottomRight}>
                    <font className={css.moneyBlack}>{"已团"}</font>
                    <font className={css.money}>{data.count+"张"}</font>
                    <br/>
                    <font className={css.moneyGray}>{"还剩"+data.count+"张"}</font>
                </div>
            )
        }else {
            return (
                <div >
                    <font className={css.moneyWhite}>{"已团"}</font>
                    <font className={css.money}>{data.count+"张"}</font>
                    <font className={css.moneyWhiteV}>{"|"}</font>
                    <font className={css.moneyWhite}>{"还剩"+data.count+"张"}</font>
                </div>
            )
        }

    }

    getTitleLayout(data,template){

        let img = null;
        if(template==1){
            if(data.type==1){
                img = require('../../../../images/wfw.png');
            }else{
                img = require('../../../../images/dcw.png');
            }
        }else {
            if(data.type==1){
                img = require('../../../../images/wfw.png');
            }else{
                img = require('../../../../images/dcw.png');
            }
        }

        return (
            <div className={template==1?css.title:css.titleBlack} >
                <div className={css.text}> {data.from}</div>
                <div className={css.text2}>
                    <div className={css.icon}
                         style={{
                             backgroundImage: "url(" + img + ")"
                         }}
                    >

                    </div>
                </div>
                <div className={css.text}> {data.to}</div>
            </div>
        )

    }
    getImageBottom(data,template) {

        return (
            <div className={css.titleLayout}>
                {template==1?this.getTitleLayout(data,template):this.getCountShow(data,template)}
            </div>
        )
    }

    getBottom(data,template) {
        if(template==1){
            return (
                <div className={css.bottom}>
                    <div className={css.bottomLeft}>
                        <font className={css.money}>{"￥"}</font>
                        <font className={css.moneyBig}>{data.money}</font>
                        <font className={css.moneyGray}>{"起"}</font>
                        <br/>
                        <font className={css.moneyGray}>{"(含税)"}</font>
                    </div>
                    {this.getCountShow(data,template)}
                </div>
            )
        }else{
            return (
                <div className={css.bottom}>
                    <div className={css.bottomLeft}>
                        {this.getTitleLayout(data,template)}
                        <div
                            className={css.moneyGray}
                        >{data.time}</div>
                    </div>

                    <div className={css.bottomRight}>
                        <font className={css.money}>{"￥"}</font>
                        <font className={css.moneyBig}>{data.money}</font>
                        <font className={css.moneyGray}>{"起"}</font>
                    </div>
                </div>
            )
        }

    }
}
module.exports = RecommendView;

{/*<div*/}
    {/*{...this.props}*/}
    {/*style={{marginTop: 20, marginLeft: 11, float: "left",}}>*/}
    {/*<div style={{*/}
        {/*width: 286, height: 287,*/}
        {/*border:1,borderColor:"#eee",*/}
        {/*backgroundColor: "#fff",*/}
    {/*}}>*/}
        {/*<div style={{*/}
            {/*margin: "auto",*/}
            {/*height: 215,width: 286,*/}
            {/*backgroundImage:'url('+data.image+')',*/}
            {/*backgroundPosition: "center",*/}
            {/*backgroundRepeat: "no-repeat", position: 'relative'*/}
        {/*}}>*/}
            {/*<div style={{position: "absolute",width:50,height:24,backgroundColor:"#29A6FF",*/}
                {/*color:"#fff",fontSize:14,textAlign:"center",paddingTop:2,*/}
                {/*right:14, borderBottomLeftRadius:2,borderBottomRightRadius:2}}>*/}
                {/*往返*/}
            {/*</div>*/}
            {/*<div*/}
                {/*style={{position: "absolute",bottom:0, fontSize: "14px", color: "#FFFFFF",}}>*/}

                {/*<div style={{width:286,height:42,backgroundColor:"#000",opacity:0.8,paddingLeft:14*/}
                    {/*,paddingTop:11}}>*/}

                {/*</div>*/}
                {/*<div style={{position: "absolute",bottom:11,left:14}}>*/}
                    {/*<div style={{color: "#fff", float: "left",fontSize:14,}}>已团</div>*/}
                    {/*<div style={{color: "#FF5841", float: "left",fontSize:14}}>{data.money}张</div>*/}
                    {/*<div style={{color: "#fff", float: "left",fontSize:14,}}>|还剩42张</div>*/}
                {/*</div>*/}
            {/*</div>*/}
        {/*</div>*/}
        {/*<div style={{width: 286, paddingLeft: 14, marginTop: 16, float: "left",position:"absolute"}}>*/}
            {/*<div style={{float: "left", fontSize:16,position:"absolute"}}>*/}
                {/*杭州  -  北京*/}
            {/*</div>*/}
            {/*<div style={{float: "left",marginTop:25, fontSize:12,position:"absolute"}}>*/}
                {/*10月13日-11月12日*/}
            {/*</div>*/}
            {/*<div style={{float: "left",right:10,position:"absolute"}}>*/}
                {/*<div style={{marginTop:14,color: "#FF5841", float: "left",fontSize:14}}>¥</div>*/}
                {/*<div style={{marginTop:4,color: "#FF5841", float: "left",fontSize:24}}>{data.money}</div>*/}
                {/*<div style={{marginTop:17,color: "#666", float: "left",fontSize:12,}}>起</div>*/}
            {/*</div>*/}

        {/*</div>*/}
    {/*</div>*/}
{/*</div>*/}