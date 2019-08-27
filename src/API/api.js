import axios from 'axios'
const headers = { headers: {'Content-Type': 'application/x-www-form-urlencoded', 'PARAM_HEADER': "eyJ0eXAiOiJKV1QiLC"} };
export default {
  // master backend 
  allMastersGet: params => axios.get('https://vk.masterimodel.com/php/select.php', params),
  customerTypes: params => axios.get('https://vk.masterimodel.com/node/customerTypes.get', params, headers),
  customerServices: params => axios.post('https://vk.masterimodel.com/node/customerServices.get', params, headers),
  masterDel: params => axios.post('https://vk.masterimodel.com/node/masters.delete', params, headers),
  mastersAdd: params => axios.post('https://vk.masterimodel.com/node/masters.add', params, headers),
  mastersGet: params => axios.post('https://vk.masterimodel.com/node/masters.get', params, headers),
  mastersGet2: params => axios.post('https://vk.masterimodel.com:3005/getUser', params),
  mastersEdit: params => axios.post('https://vk.masterimodel.com/node/masters.edit', params,headers),
  masterServices: params => axios.post('https://vk.masterimodel.com/node/masterServices.get', params, headers),
  masterServicesAdd: params => axios.post('https://vk.masterimodel.com/node/masterServices.add', params, headers),
  masterServicesDelete: params => axios.post('https://vk.masterimodel.com/node/masterServices.delete', params,headers),
  masterPortfolioAdd: params => axios.post('https://vk.masterimodel.com/node/masterPortfolio.add', params),
  masterPortfolioDel: params => axios.post('https://vk.masterimodel.com/node/masterPortfolio.deleteOnce', params),
  linkGet: params => axios.post('https://vk.masterimodel.com/node/banner.get', params),
  
  
  // auth backend
  login: params => axios.post('https://vk.masterimodel.com:3005/login', params, { headers: {'Content-Type': 'application/json'}}),
  checkToken: params => axios.post('https://vk.masterimodel.com:3005/checkToken', params),
  checkAdmin: params => axios.post('https://vk.masterimodel.com:3005/checkAdmin', params),  
  sssh: params => axios.post('https://vk.masterimodel.com:3005/ss33sh',params),
  authVk: params => axios.post('https://vk.masterimodel.com:3005/vkauth',params), 
  test: params => axios.post('https://vk.masterimodel.com:3005/test', params, {withCredentials: true }),  
  
  // etc.
}


