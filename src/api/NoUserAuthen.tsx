import axios from "axios"
const login = async (body: { username: string, password: string }) => {
    const result = await axios.post("/api/login", body)
    return result.data
}
const signup = async (body: { username: string, password: string, email: string }) => {
    const result = await axios.post("/api/signup", body, {
        headers: {
            'Content-Type': 'application/json',
        }
    })
    return result.data
}

const getItem = async (genre: string, skip: number | undefined, limit: number | undefined) => {
    const result = await axios.get(process.env.server_url + genre + `?skip=${skip ? skip : ""}&limit=${limit ? limit : ""}`)
    return result.data
}

const getOneItem = async (genre: string, slug: string) => {
    const result = await axios.get(process.env.server_url + genre + `?slug=${slug}`)
    return result.data
}

const getNews = async (genre: string, slug: string) => {
    const result = await axios.get(process.env.server_url + genre + `?rss=${slug}`)
    return result.data
}


export const NoUserAuthen = {
    login,
    signup,
    getItem,
    getOneItem,
    getNews
}