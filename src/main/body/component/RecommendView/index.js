/**
 * Created by lixifeng on 17/10/12.
 */
import React, {Component} from 'react';
import {AutoComplete} from 'antd';
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


    render() {

        let {data} = this.props;
        if (!data)return null;
        return (
            <div
                {...this.props}
                style={{marginTop: 20, marginLeft: 11, float: "left",}}>
                <div style={{
                    width: 286, height: 287,
                    border:1,borderColor:"#eee",
                    backgroundColor: "#fff",
                }}>
                    <div style={{
                        margin: "auto",
                        height: 215,width: 286,
                        backgroundImage:'url('+data.image+')',
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat", position: 'relative'
                    }}>
                        <div
                            style={{position: "absolute",bottom:0, fontSize: "14px", color: "#FFFFFF",}}>

                            <div style={{width:286,height:42,backgroundColor:"#000",opacity:0.8,paddingLeft:14
                            ,paddingTop:11}}>
                                {data.from + "   -   " + data.to}
                            </div>
                        </div>
                    </div>
                    <div style={{width: 286, paddingLeft: 14, marginTop: 20, float: "left",position:"absolute"}}>
                        <div style={{float: "left"}}>
                            <div style={{marginTop:10,color: "#FF5841", float: "left",fontSize:14}}>¥</div>
                            <div style={{color: "#FF5841", float: "left",fontSize:24}}>{data.money}</div>
                            <div style={{marginTop:13,color: "#666", float: "left",fontSize:12,}}>起</div>
                        </div>
                        <div style={{float: "left",marginTop:10,right:10,position:"absolute"}}>
                            <div style={{color: "#666", float: "left",fontSize:14,}}>已团</div>
                            <div style={{color: "#FF5841", float: "left",fontSize:14}}>{data.money}张</div>
                            <div style={{color: "#666", float: "left",fontSize:14,}}>|还剩42张</div>
                        </div>
                    </div>
                </div>
            </div>
        )
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