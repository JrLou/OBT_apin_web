import React, {Component} from 'react';

class WindowHelp {
    setPanel(panel){
        this.shareWindow = panel;
    }
    getPanel(){
        return this.shareWindow;
    }
    openInitWindow(panel){
        if(panel){
            this.shareWindow = panel;
            return panel;
        }
        let w = window.screen.width*0.6 ,h = window.screen.height*0.6;
        this.shareWindow  =  window.open('/html/exportPassengers.html', 'apinPanel');

        return this.shareWindow;
    }

    openWindow(apinPanel,value){
        if(apinPanel.location){
            //打开URL类型
            apinPanel.location.href = value;
            apinPanel.focus();
        }else{
            //打开自定义类型
            if(apinPanel.show){
                apinPanel.show(true,value);
            }

        }
    }
    closeWindow(apinPanel){
        let panel = apinPanel||this.shareWindow;
        if(panel){
            if(panel.location){
                panel.close();
            }else{
                if(panel.show){
                    panel.show(false);
                }

            }

        }
    }
}
module.exports = WindowHelp;