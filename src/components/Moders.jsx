import React from 'react';
import Loading from './Loading';
import api from '../API/api';
import { Card, CardImg, CardText, CardBody,
    CardTitle, CardSubtitle, Button } from 'reactstrap';
import Cookies from 'universal-cookie';
import Menu from "./Menu";

const cookies = new Cookies();

class Moders extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            masters: [],
            loaded: false,
            api: '',
            alertSucces: false,
            start: 8,
            to: 16
        }
    }
    async componentDidMount() {
        const data = { params: { from: 'get', for: 0, to: 8 } };
        const cook = {
			"token": cookies.get('token')
        };
        try {
            const res = await api.allMastersGet(data);
            const sssh = await api.sssh(cook);
            this.setState({ masters: res.data, loaded: true, api: sssh.data.api });
            console.log(res.data);    
        } catch (error) {
            console.log(error);
        }
        
        
    }
    async delMaster (e, vkid, i) {
        e.preventDefault();
        const params = new URLSearchParams();
        params.append('id',      vkid);
        params.append('api_key', this.state.api); 
        const res = await api.masterDel(params);
        if (res.status === 200) {
            let arr = [...this.state.masters];
            if (i !== -1) {
                arr.splice(i, 1);
                this.setState({masters: arr});
            }
            alert("Пользователь удален"); 
        } 
        console.log(res);
    }
    fetchMoreData = async () => {
        
        const { start, to } = this.state; 
        const data = { params: { from: 'get', for: start, to: to } };
        console.log(this.state.masters);
        
        try {
            const res = await api.allMastersGet(data);
            
            this.setState({ 
                start: this.state.start + 8, 
                to: this.state.to + 8,
                masters: [...this.state.masters, ...res.data]
            });
           
        } catch (error) {
            console.log(error);
        }
      };
      
      
    
    
    render() { 
        const { loaded, masters } = this.state;
        if (!loaded) { return ( <Loading/> ); }
        const listMasters = masters ? masters.map((item, i) => 
            <div className="col-md-3 col-12 col-sm-6" key={i}>
                <Card>
                    <CardImg top  src={item.avatar_url} alt="Card image cap" />
                    <CardBody>
                        <CardTitle>{item.full_name}</CardTitle>
                        <CardSubtitle>{"Телефон: " + item.phone_number}</CardSubtitle>
                        <a href={"https://vk.com/id" +  item.vk_id}> Вконтакте </a>
                        <CardText>{decodeURI(item.about_master)}</CardText>
                        <CardSubtitle>{item.date}</CardSubtitle>
                        <Button onClick={(e) => this.delMaster(e, item.vk_id, i)}>Удалить</Button>
                    </CardBody>
                </Card>
            </div> 
        ): null;
        return (
            <>
                <Menu/>
                <div className="container">
                    <div className="row">
                        {listMasters}
                        
                    </div>
                    <hr/>
                    <div className="row justify-content-center">
                        <Button onClick={this.fetchMoreData}>Показать еще</Button>
                    </div>
                
                </div>
            </>
        );
    }
}
 
export default Moders;
 