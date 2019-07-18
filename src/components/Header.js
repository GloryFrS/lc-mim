import React from 'react';
import { platform } from '@vkontakte/vkui';



const osname = platform();


class Header extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    

    componentDidMount() {
        if (osname === "android") {
            var heightHeader = document.getElementsByClassName('header');
            for (let i = 0; i < heightHeader.length; i++) {
                heightHeader[i].style.height = "58px";
            }

            var heightIosheader = document.getElementsByClassName('iosheader');
            for (let i = 0; i < heightIosheader.length; i++) {
                heightIosheader[i].style.height = "0px";
            }
        }
        if (osname === "ios") { console.log("de ios") }
    }

    

    render() {
        return (
            <div>
                <div className="iosheader"></div>
                <div className="header">
                    
                </div>
            </div>
        );
    }
}

export default Header;