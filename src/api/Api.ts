import axios from "axios";
import { heartbeat } from "../services/apiHeartbeatService";

const backendUrl = await heartbeat();
const Api = axios.create({
  baseURL: backendUrl,
  withCredentials: true 
});

export default Api;
