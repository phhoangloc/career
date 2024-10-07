import axios from "axios"
const login = async (body: { username: string, password: string }) => {
    const result = await axios.post("/api/login", body)
    return result.data
}
const signup = async (body: { username: string, password: string, email: string, facilities: string[] }) => {
    const result = await axios.post("/api/signup", body, {
        headers: {
            'Content-Type': 'application/json',
        }
    })
    return result.data
}

const getItem = async (archive: string, search: string, wp: string, wt: string, ws: string, lo: string, skip: number | undefined, limit: number | undefined, area?: string, host?: string, lis?: string) => {
    const result = await axios.get("/api/" + archive + `?archive=${archive}&search=${search ? search : ""}&wp=${wp ? wp : ""}&wt=${wt ? wt : ""}&ws=${ws ? ws : ""}&lo=${lo ? lo : ""}&skip=${skip ? skip : ""}&limit=${limit ? limit : ""}&area=${area ? area : ""}&host=${host ? host : ""}&lisense=${lis ? lis : ""}`)
    return result.data
}

const getOneItem = async (archive: string, slug: string) => {
    const result = await axios.get("/api/" + archive + `?slug=${slug}`)
    return result.data
}

const getInterview = async () => {
    const result = await axios.get(`/api/interview`)
    return result.data
}
const getPicById = async (id: string) => {
    const result = await axios.get("/api/image?id=" + id)
    return result.data
}
const getAddress = async (pNo: string) => {
    const result = await axios.get("https://zipcloud.ibsnet.co.jp/api/search?zipcode=" + pNo)
    return result.data
}
export const NoUserAuthen = {
    login,
    signup,
    getItem,
    getOneItem,
    getInterview,
    getPicById, getAddress
}