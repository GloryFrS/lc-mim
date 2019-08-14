import axios from 'axios'
const headers = { headers: {'Content-Type': 'application/x-www-form-urlencoded', 'PARAM_HEADER': "eyJ0eXAiOiJKV1QiLC"} };
export default {
  // master backend 
  customerTypes: params => axios.get('http://vk.masterimodel.com/node/customerTypes.get', params, headers),
  customerServices: params => axios.post('http://vk.masterimodel.com/node/customerServices.get', params, headers),
  mastersAdd: params => axios.post('http://vk.masterimodel.com/node/masters.add', params, headers),
  mastersGet: params => axios.post('http://vk.masterimodel.com/node/masters.get', params, headers),
  mastersEdit: params => axios.post('http://vk.masterimodel.com/node/masters.edit', params,headers),
  masterServices: params => axios.post('http://vk.masterimodel.com/node/masterServices.get', params, headers),
  masterServicesAdd: params => axios.post('http://vk.masterimodel.com/node/masterServices.add', params, headers),
  masterServicesDelete: params => axios.post('http://vk.masterimodel.com/node/masterServices.delete', params,headers),
  masterPortfolioAdd: params => axios.post('http://vk.masterimodel.com/node/masterPortfolio.add', params),
  masterPortfolioDel: params => axios.post('http://vk.masterimodel.com/node/masterPortfolio.deleteOnce', params),
  
  // auth backend
  login: params => axios.post('http://vk.masterimodel.com:3004/login', params, {headers: {'Content-Type': 'application/json'}}),
  checkToken: params => axios.post('http://vk.masterimodel.com:3004/checkToken', params),
  sssh: params => axios.post('https://vk.masterimodel.com:3005/ss33sh',params),
  
  
  // etc.
}


