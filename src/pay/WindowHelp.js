import React, {Component} from 'react';
import less from './Pay.less';

class WindowHelp {
    openInitWindow(){
        let w = window.screen.width*0.6 ,h = window.screen.height*0.6;
        this.shareWindow =  window.open('/html/loading.html', 'apinPanel', 'height='+h+', width='+w+', top='+(window.screen.height-h)/2+',left='+(window.screen.width-w)/2+',toolbar=no, menubar=no, scrollbars=no, resizable=no,location=no, status=no');

        return this.shareWindow;
    }

    openWindow(apinPanel,url){
        apinPanel.location.href = url;
    }
    closeWindow(apinPanel){
        let panel = apinPanel||this.shareWindow;
        if(panel){
            panel.close();
        }
    }
}
module.exports = WindowHelp;