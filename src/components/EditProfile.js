import React from 'react';


class EditProfile extends React.Component {
   
    render() {
        return (
            <div className="container">
            <div className="row">
            <div className="col-12">
                <div className="d-flex">
                    <h3 className="title">Редактирование профиля</h3>
                    <div className="btn-block d-flex">
                        <a className="btn" href='asd'>Сохранить изменения</a>
                        <a className="btn-cancel" href='asd'>Отмена</a>
                    </div>
                </div>
                <form className="edit-profile">
                <div className="row">
                    <div className="form-group col-md-6">
                    <label htmlFor="name-input">Ваша имя и фамилия</label>
                    <input type="text" id="name-input" className="form-control" defaultValue="Ольга Петрова" placeholder="Введите имя и фамилию" />
                    </div>
                    <div className="form-group col-md-6">
                    <label htmlFor="tel">Телефон</label>
                    <input type="tel" className="form-control" id="tel" defaultValue="+ 7 (961) 996-25-03" placeholder="Введите номер" />
                    </div>
                </div>
                <div className="row">
                    <label className="fix-label">Адрес</label>
                    <div className="form-group col-md-3">
                    <input type="text" className="form-control" defaultValue placeholder="Страна" />
                    </div>
                    <div className="form-group col-md-3">                            
                    <input type="text" className="form-control" defaultValue placeholder="Город" />
                    </div>
                    <div className="form-group col-md-3">                            
                    <input type="text" className="form-control" defaultValue placeholder="Улица" />
                    </div>
                    <div className="form-group col-md-3">                            
                    <input type="text" className="form-control" defaultValue placeholder="Дом" />
                    </div>
                </div>
                <div className="row">
                    <div className="form-group col-md-6">
                    <label>Ссылка на ваш профиль ВК</label>
                    <input type="text" id="name-input" className="form-control" defaultValue="https://vk.com/id155648422" placeholder="https://vk.com/id155648422" />
                    </div>
                </div>
                <div className="row">
                    <div className="form-group col-md-12">
                    <label>О себе</label>
                    <textarea className="form-control" rows={5} defaultValue={""} />
                    </div>
                </div>
                <div className="row">
                <div className="form-group col-md-9">
                  <label>Ваши услуги</label>
                  <div className="row" style={{alignItems: 'center'}}>
                    <div className="col-md-6">
                      <select className="form-control" id="service">
                        <option>1</option>
                        <option>2</option>
                        <option>3</option>
                        <option>4</option>
                        <option>5</option>
                      </select>
                    </div>
                    <div className="col-md-4">
                      <input id="price" className="form-control" type="text" />
                    </div>
                    <div className="col-md-2">
                      <a href='123'  id="add">+</a>
                    </div>
                  </div>
                  <div id="dynamic_field">
                  </div>
                </div>
              </div>
                <div className="btn-block-bottom d-flex">
                    <a className="btn" href="/card">Сохранить изменения</a>
                    <a className="btn-cancel" href='asd'>Отмена</a>
                </div>
            </form>
          </div>
        </div>
        </div>
        )
        
    }



}

export default EditProfile;