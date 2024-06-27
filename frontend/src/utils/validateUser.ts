import { getCookie } from "./cookies";

const checkUser = async (token: string, login: ()=>void, logout:()=>void) => {
    const req = await fetch(`http://localhost:3000/users/get-user/${token}`);
    const res = await req.json();
    if (res && res.token && new Date(res.expired).getTime() > Date.now()) {
      login();
    } else {
      logout();
    }
  };
  export const validateUser = async (login: ()=>void, logout: ()=>void) => {
    const userCookie = getCookie("user");
    if (userCookie) {
      checkUser(userCookie.token, login, logout);
    }
  };