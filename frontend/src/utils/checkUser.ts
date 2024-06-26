const checkUser = async(id:string)=>{
    const req = await fetch(`http://localhost:3000/users/get-user/${id}`)
    const res = await req.json()
    return res
}
export default checkUser