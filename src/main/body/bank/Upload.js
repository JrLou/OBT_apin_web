import React, {Component} from "react";



class page extends Component {
    constructor(props) {
        super(props);
    }



    render() {
        let arr = [];
        for (let i = 0; i < 100; i++) {
            arr.push(<div key={i}>{i}</div>);
        }
        return (
            <div
                style={{margin: "auto", maxWidth: 1200}}
                ref={(ref) => {
                    this.myScroll = ref;
                }}>
                {arr}
            </div>
        );
    }


}


page.contextTypes = {
    router: React.PropTypes.object
};
module.exports = page;




